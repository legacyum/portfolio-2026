'use strict';
/* Rasterizador por software para prototypes/cat3d.html (NO es parte del sitio).
   Renderiza la escena Three.js REAL del prototipo sin GPU: recorre las mallas,
   proyecta con la cámara del prototipo y rasteriza con z-buffer + sombreado
   Lambert/toon + sombra planar. Escribe PNG usando solo zlib (stdlib).

   Uso:
     node tests/prototype-cat3d-render.js [--pose walk] [--frames 90] [--shots 6]
          [--every 12] [--out /tmp/cat.png] [--cam 7.6,4.9,10.6] [--look 0,2.25,0]
          [--goto 1.6,-1.2] [--keys ArrowUp:60,ArrowLeft:30] [--w 480] [--h 300]
          [--actions meow,pet,startle] [--follow] [--ascii] [--cell 9] [--tint]

   Cada "shot" es un tile; se componen en una hoja de contactos (3 columnas).
   --ascii aplica en CPU el mismo post-proceso que el shader GLSL del prototipo
   (luminancia por celda → rampa de glifos, Sobel sobre profundidad → glifos de
   contorno), con un atlas de glifos bitmap 5×7 embebido. */
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const { createCatSandbox } = require('./prototype-cat3d-harness');

// ---------- CLI ----------
const argv = process.argv.slice(2);
function arg(name, def) {
  const i = argv.indexOf('--' + name);
  if (i === -1) return def;
  const v = argv[i + 1];
  if (v === undefined || v.startsWith('--')) return true;
  return v;
}
const POSE = arg('pose', null);
const FRAMES = parseInt(arg('frames', '90'), 10);      // frames de calentamiento antes del primer shot
const SHOTS = parseInt(arg('shots', '6'), 10);
const EVERY = parseInt(arg('every', '10'), 10);        // frames entre shots
const OUT = arg('out', '/tmp/cat3d-render.png');
const TW = parseInt(arg('w', '480'), 10);
const TH = parseInt(arg('h', '300'), 10);
const CAM = arg('cam', null);
const LOOK = arg('look', null);
const GOTO = arg('goto', null);
const KEYS = arg('keys', null);
const ACTIONS = arg('actions', null);
const FOLLOW = !!arg('follow', false);
const COLS = parseInt(arg('cols', '3'), 10);
const ASCII = !!arg('ascii', false);
const CELL = parseInt(arg('cell', '9'), 10);
const TINT = !!arg('tint', false);

const H = createCatSandbox();
const { sandbox, THREE, stepFrames, winHandlers } = H;
const cat = sandbox.__cat3D;
const scene = cat.scene;
const camera = cat.camera;

// ---------- PNG ----------
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    t[n] = c >>> 0;
  }
  return t;
})();
function crc32(buf) {
  let c = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xFF] ^ (c >>> 8);
  return (c ^ 0xFFFFFFFF) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length, 0);
  const td = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td), 0);
  return Buffer.concat([len, td, crc]);
}
function encodePNG(width, height, rgb) {
  const raw = Buffer.alloc((width * 3 + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (width * 3 + 1)] = 0;
    rgb.copy(raw, y * (width * 3 + 1) + 1, y * width * 3, (y + 1) * width * 3);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0); ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; ihdr[9] = 2; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw, { level: 6 })),
    chunk('IEND', Buffer.alloc(0))
  ]);
}

// ---------- rasterizador ----------
const LIGHT = new THREE.Vector3(6.5, 11, 6).normalize();
const FILL = new THREE.Vector3(-7, 4, -4).normalize();
const SHADOW_Y = 0.26 + 0.002; // tapa de la plataforma (DAIS_H)

function makeTarget(w, h) {
  return { w, h, rgb: Buffer.alloc(w * h * 3), z: new Float32Array(w * h).fill(Infinity) };
}

// ---------- post-proceso ASCII (réplica CPU del shader) ----------
// Atlas bitmap 5x7 de los glifos usados por la rampa (subconjunto suficiente para
// el look; los glifos que no están caen al más cercano por densidad).
const FONT = {
  ' ': ['     ','     ','     ','     ','     ','     ','     '],
  '.': ['     ','     ','     ','     ','     ','  #  ','     '],
  '`': ['  #  ','   # ','     ','     ','     ','     ','     '],
  '-': ['     ','     ','     ',' ####','     ','     ','     '],
  "'": ['  #  ','  #  ','     ','     ','     ','     ','     '],
  ':': ['     ','  #  ','     ','     ','  #  ','     ','     '],
  '_': ['     ','     ','     ','     ','     ','     ','#####'],
  ',': ['     ','     ','     ','     ','  #  ','  #  ',' #   '],
  '^': ['  #  ',' # # ','     ','     ','     ','     ','     '],
  '=': ['     ','     ','#####','     ','#####','     ','     '],
  ';': ['     ','  #  ','     ','     ','  #  ','  #  ',' #   '],
  '>': ['#    ',' #   ','  #  ','   # ','  #  ',' #   ','#    '],
  '<': ['    #','   # ','  #  ',' #   ','  #  ','   # ','    #'],
  '+': ['     ','  #  ','  #  ','#####','  #  ','  #  ','     '],
  '!': ['  #  ','  #  ','  #  ','  #  ','  #  ','     ','  #  '],
  'r': ['     ','     ','# ## ','##  #','#    ','#    ','#    '],
  'c': ['     ','     ',' ### ','#    ','#    ','#    ',' ### '],
  '*': ['     ','  #  ','# # #',' ### ','# # #','  #  ','     '],
  '/': ['    #','    #','   # ','  #  ',' #   ','#    ','#    '],
  'z': ['     ','     ','#####','   # ','  #  ',' #   ','#####'],
  '?': [' ### ','#   #','    #','   # ','  #  ','     ','  #  '],
  's': ['     ','     ',' ####','#    ',' ### ','    #','#### '],
  'L': ['#    ','#    ','#    ','#    ','#    ','#    ','#####'],
  'T': ['#####','  #  ','  #  ','  #  ','  #  ','  #  ','  #  '],
  'v': ['     ','     ','#   #','#   #','#   #',' # # ','  #  '],
  ')': [' #   ','  #  ','   # ','   # ','   # ','  #  ',' #   '],
  'J': ['  ###','   # ','   # ','   # ','   # ','#  # ',' ##  '],
  '7': ['#####','    #','   # ','  #  ',' #   ',' #   ',' #   '],
  '(': ['   # ','  #  ',' #   ',' #   ',' #   ','  #  ','   # '],
  '|': ['  #  ','  #  ','  #  ','  #  ','  #  ','  #  ','  #  '],
  'F': ['#####','#    ','#    ','#### ','#    ','#    ','#    '],
  'i': ['  #  ','     ',' ##  ','  #  ','  #  ','  #  ',' ### '],
  '{': ['   ##','  #  ','  #  ',' #   ','  #  ','  #  ','   ##'],
  'C': [' ### ','#   #','#    ','#    ','#    ','#   #',' ### '],
  '}': ['##   ','  #  ','  #  ','   # ','  #  ','  #  ','##   '],
  'f': ['  ## ',' #  #',' #   ','###  ',' #   ',' #   ',' #   '],
  'I': [' ### ','  #  ','  #  ','  #  ','  #  ','  #  ',' ### '],
  '3': ['#####','    #','   # ','  ## ','    #','#   #',' ### '],
  '1': ['  #  ',' ##  ','  #  ','  #  ','  #  ','  #  ',' ### '],
  't': [' #   ',' #   ','###  ',' #   ',' #   ',' #  #','  ## '],
  'l': [' ##  ','  #  ','  #  ','  #  ','  #  ','  #  ',' ### '],
  'u': ['     ','     ','#   #','#   #','#   #','#  ##',' ## #'],
  '[': [' ### ',' #   ',' #   ',' #   ',' #   ',' #   ',' ### '],
  'n': ['     ','     ','# ## ','##  #','#   #','#   #','#   #'],
  'e': ['     ','     ',' ### ','#   #','#####','#    ',' ### '],
  'o': ['     ','     ',' ### ','#   #','#   #','#   #',' ### '],
  'Z': ['#####','    #','   # ','  #  ',' #   ','#    ','#####'],
  '5': ['#####','#    ','#### ','    #','    #','#   #',' ### '],
  'Y': ['#   #','#   #',' # # ','  #  ','  #  ','  #  ','  #  '],
  'x': ['     ','     ','#   #',' # # ','  #  ',' # # ','#   #'],
  'j': ['   # ','     ','  ## ','   # ','   # ','#  # ',' ##  '],
  'y': ['     ','     ','#   #','#   #',' ####','    #',' ### '],
  'a': ['     ','     ',' ### ','    #',' ####','#   #',' ####'],
  ']': [' ### ','   # ','   # ','   # ','   # ','   # ',' ### '],
  '2': [' ### ','#   #','    #','   # ','  #  ',' #   ','#####'],
  'E': ['#####','#    ','#    ','#### ','#    ','#    ','#####'],
  'S': [' ####','#    ','#    ',' ### ','    #','    #','#### '],
  'w': ['     ','     ','#   #','#   #','# # #','# # #',' # # '],
  'q': ['     ','     ',' ####','#   #',' ####','    #','    #'],
  'k': ['#    ','#    ','#  # ','# #  ','##   ','# #  ','#  # '],
  'P': ['#### ','#   #','#   #','#### ','#    ','#    ','#    '],
  '6': ['  ## ',' #   ','#    ','#### ','#   #','#   #',' ### '],
  'h': ['#    ','#    ','# ## ','##  #','#   #','#   #','#   #'],
  '9': [' ### ','#   #','#   #',' ####','    #','   # ',' ##  '],
  'd': ['    #','    #',' ## #','#  ##','#   #','#   #',' ## #'],
  '4': ['   # ','  ## ',' # # ','#  # ','#####','   # ','   # '],
  'V': ['#   #','#   #','#   #','#   #','#   #',' # # ','  #  '],
  'p': ['     ','     ','# ## ','##  #','#### ','#    ','#    '],
  'O': [' ### ','#   #','#   #','#   #','#   #','#   #',' ### '],
  'G': [' ### ','#   #','#    ','# ###','#   #','#   #',' ### '],
  'b': ['#    ','#    ','# ## ','##  #','#   #','#   #','#### '],
  'U': ['#   #','#   #','#   #','#   #','#   #','#   #',' ### '],
  'A': ['  #  ',' # # ','#   #','#   #','#####','#   #','#   #'],
  'K': ['#   #','#  # ','# #  ','##   ','# #  ','#  # ','#   #'],
  'X': ['#   #','#   #',' # # ','  #  ',' # # ','#   #','#   #'],
  'H': ['#   #','#   #','#   #','#####','#   #','#   #','#   #'],
  'm': ['     ','     ','## # ','# # #','# # #','# # #','# # #'],
  '8': [' ### ','#   #','#   #',' ### ','#   #','#   #',' ### '],
  'R': ['#### ','#   #','#   #','#### ','# #  ','#  # ','#   #'],
  'D': ['#### ','#   #','#   #','#   #','#   #','#   #','#### '],
  '#': [' # # ',' # # ','#####',' # # ','#####',' # # ',' # # '],
  '$': ['  #  ',' ####','# #  ',' ### ','  # #','#### ','  #  '],
  'B': ['#### ','#   #','#   #','#### ','#   #','#   #','#### '],
  'g': ['     ','     ',' ####','#   #',' ####','    #',' ### '],
  '0': [' ### ','#   #','#  ##','# # #','##  #','#   #',' ### '],
  'M': ['#   #','## ##','# # #','# # #','#   #','#   #','#   #'],
  'N': ['#   #','##  #','# # #','#  ##','#   #','#   #','#   #'],
  'W': ['#   #','#   #','#   #','# # #','# # #','## ##','#   #'],
  'Q': [' ### ','#   #','#   #','#   #','# # #','#  # ',' ## #'],
  '%': ['##   ','##  #','   # ','  #  ',' #   ','#  ##','   ##'],
  '&': [' ##  ','#  # ','# #  ',' #   ','# # #','#  # ',' ## #'],
  '@': [' ### ','#   #','# ###','# # #','# ###','#    ',' ### '],
  '\\': ['#    ','#    ',' #   ','  #  ','   # ','    #','    #']
};
const RAMP = ' .`-\':_,^=;><+!rc*/z?sLTv)J7(|Fi{C}fI31tlu[neoZ5Yxjya]2ESwqkP6h9d4VpOGbUAKXHm8RD#$Bg0MNWQ%&@\\';
function glyphBitmap(ch) {
  if (FONT[ch]) return FONT[ch];
  // fallback: glifo de densidad similar
  const dens = c => FONT[c].join('').split('#').length - 1;
  const target = RAMP.indexOf(ch) / (RAMP.length - 1) * 20;
  let best = ' ', bd = Infinity;
  for (const k of Object.keys(FONT)) { const d = Math.abs(dens(k) - target); if (d < bd) { bd = d; best = k; } }
  return FONT[best];
}
function glyphAt(ch, u, v) { // u,v en 0..1 → 1/0
  const bm = glyphBitmap(ch);
  const gx = Math.min(4, Math.floor(u * 5)), gy = Math.min(6, Math.floor(v * 7));
  return bm[gy][gx] === '#' ? 1 : 0;
}
function asciiPost(t, cell, accent, bgc, tint) {
  const W = t.w, Hh = t.h;
  const out = Buffer.alloc(W * Hh * 3);
  const cw = Math.ceil(W / cell), chh = Math.ceil(Hh / cell);
  const lum = new Float32Array(cw * chh), dep = new Float32Array(cw * chh);
  const col = new Float32Array(cw * chh * 3);
  for (let cy = 0; cy < chh; cy++) for (let cx = 0; cx < cw; cx++) {
    let r = 0, g = 0, b = 0, n = 0, zsum = 0, zn = 0;
    for (let y = cy * cell; y < Math.min(Hh, (cy + 1) * cell); y++) for (let x = cx * cell; x < Math.min(W, (cx + 1) * cell); x++) {
      const i = y * W + x; r += t.rgb[i * 3]; g += t.rgb[i * 3 + 1]; b += t.rgb[i * 3 + 2]; n++;
      const z = t.z[i]; zsum += Number.isFinite(z) ? (z * 0.5 + 0.5) : 1; zn++;
    }
    const k = cy * cw + cx;
    r /= n * 255; g /= n * 255; b /= n * 255;
    col[k * 3] = r; col[k * 3 + 1] = g; col[k * 3 + 2] = b;
    lum[k] = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    dep[k] = zsum / zn;
  }
  const D = (x, y) => dep[Math.min(chh - 1, Math.max(0, y)) * cw + Math.min(cw - 1, Math.max(0, x))];
  // z ndc no es lineal: convertimos a profundidad "ortográfica" aproximada con near/far de la cámara
  const near = camera.near, far = camera.far;
  const lin = zn => { const vz = (near * far) / ((far - near) * zn - far); return (vz + near) / (near - far); };
  const EDGE = { bar: '|', slash: '/', dash: '-', back: '\\' };
  for (let cy = 0; cy < chh; cy++) for (let cx = 0; cx < cw; cx++) {
    const k = cy * cw + cx;
    const l = lum[k];
    let lv = Math.pow(Math.min(1, l * 1.28), 1.15);
    const ss = Math.min(1, Math.max(0, (l - 0.12) / (0.5 - 0.12)));
    lv = lv * 0.55 + 0.45 * ss * ss * (3 - 2 * ss);
    const d = (x, y) => lin(D(x, y));
    const d00 = d(cx - 1, cy - 1), d10 = d(cx, cy - 1), d20 = d(cx + 1, cy - 1);
    const d01 = d(cx - 1, cy), d21 = d(cx + 1, cy);
    const d02 = d(cx - 1, cy + 1), d12 = d(cx, cy + 1), d22 = d(cx + 1, cy + 1);
    const dC = d(cx, cy);
    const lap = Math.abs(d10 + d12 - 2 * dC) + Math.abs(d01 + d21 - 2 * dC) + 0.5 * (Math.abs(d00 + d22 - 2 * dC) + Math.abs(d20 + d02 - 2 * dC));
    let edge = Math.min(1, Math.max(0, (lap - 0.0025 - dC * 0.02) * 90));
    const dMin = Math.min(d00, d10, d20, d01, d21, d02, d12, d22);
    if (dC > dMin + 0.004) edge = 0;
    if (dC > 0.995) edge = 0;
    const gxs = (d20 + 2 * d21 + d22) - (d00 + 2 * d01 + d02);
    const gys = (d02 + 2 * d12 + d22) - (d00 + 2 * d10 + d20);
    let ch = RAMP[Math.round(lv * (RAMP.length - 1))];
    let isEdge = false;
    if (edge > 0.42) {
      isEdge = true;
      const a = ((Math.atan2(gys, gxs) + Math.PI) % Math.PI + Math.PI) % Math.PI;
      if (a < 0.3927 || a > 2.7489) ch = EDGE.bar;
      else if (a < 1.1781) ch = EDGE.back;
      else if (a < 1.9635) ch = EDGE.dash;
      else ch = EDGE.slash;
      lv = Math.max(lv, 0.55);
    }
    const sc = [col[k * 3], col[k * 3 + 1], col[k * 3 + 2]].map(v => v / Math.max(l, 1e-4));
    const scn = Math.hypot(sc[0] + 0.001, sc[1] + 0.001, sc[2] + 0.001) || 1;
    const base = accent.map((av, i) => tint ? ((sc[i] + 0.001) / scn) * 1.2 * Math.max(av, 0.6) : av);
    let bright = 0.22 + 0.95 * lv;
    if (isEdge) bright = 1.05 + 0.25 * edge;
    if (dC > 0.995) bright *= 0.55;
    const vis = Math.min(1, Math.max(0, (l + edge * 0.2 - 0.015) / (0.06 - 0.015)));
    const visS = vis * vis * (3 - 2 * vis);
    for (let y = cy * cell; y < Math.min(Hh, (cy + 1) * cell); y++) for (let x = cx * cell; x < Math.min(W, (cx + 1) * cell); x++) {
      const u = (x - cx * cell + 0.5) / cell, v = (y - cy * cell + 0.5) / cell;
      const g = glyphAt(ch, Math.min(0.98, Math.max(0.02, u)), Math.min(0.98, Math.max(0.02, v)));
      const halo = glyphAt(ch, Math.min(0.98, Math.max(0.02, (u - 0.5) * 0.72 + 0.5)), Math.min(0.98, Math.max(0.02, (v - 0.5) * 0.72 + 0.5))) * 0.28;
      const i = (y * W + x) * 3;
      for (let c = 0; c < 3; c++) {
        const ink = base[c] * bright;
        let o = bgc[c] * 0.9 + ink * (g + halo * lv);
        o = bgc[c] + (o - bgc[c]) * visS;
        out[i + c] = Math.round(Math.min(1, Math.max(0, o)) * 255);
      }
    }
  }
  out.copy(t.rgb);
}
function clear(t, r, g, b) {
  for (let i = 0; i < t.w * t.h; i++) { t.rgb[i * 3] = r; t.rgb[i * 3 + 1] = g; t.rgb[i * 3 + 2] = b; }
  t.z.fill(Infinity);
}
const _m = new THREE.Matrix4();
const _pv = new THREE.Matrix4();
const _v4 = [new THREE.Vector4(), new THREE.Vector4(), new THREE.Vector4()];
const _p = [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()];
const _n = new THREE.Vector3(), _e1 = new THREE.Vector3(), _e2 = new THREE.Vector3();

function clipNear(poly) {
  // Sutherland–Hodgman contra z >= -w (plano near en clip space)
  const out = [];
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length];
    const da = a.z + a.w, db = b.z + b.w;
    if (da >= 0) out.push(a);
    if ((da >= 0) !== (db >= 0)) {
      const t = da / (da - db);
      out.push(new THREE.Vector4(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t, a.z + (b.z - a.z) * t, a.w + (b.w - a.w) * t));
    }
  }
  return out;
}
function rasterTri(t, a, b, c, col, twoSided) {
  // a,b,c: {x,y (px), z (ndc)}
  const area = (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
  if (area === 0) return;
  if (!twoSided && area > 0) return; // backface (y invertida → CCW se vuelve área positiva)
  const minX = Math.max(0, Math.floor(Math.min(a.x, b.x, c.x)));
  const maxX = Math.min(t.w - 1, Math.ceil(Math.max(a.x, b.x, c.x)));
  const minY = Math.max(0, Math.floor(Math.min(a.y, b.y, c.y)));
  const maxY = Math.min(t.h - 1, Math.ceil(Math.max(a.y, b.y, c.y)));
  if (minX > maxX || minY > maxY) return;
  const inv = 1 / area;
  for (let y = minY; y <= maxY; y++) {
    const py = y + 0.5;
    for (let x = minX; x <= maxX; x++) {
      const px = x + 0.5;
      let w0 = ((b.x - px) * (c.y - py) - (b.y - py) * (c.x - px)) * inv;
      let w1 = ((c.x - px) * (a.y - py) - (c.y - py) * (a.x - px)) * inv;
      let w2 = 1 - w0 - w1;
      if (w0 < 0 || w1 < 0 || w2 < 0) continue;
      const z = w0 * a.z + w1 * b.z + w2 * c.z;
      const idx = y * t.w + x;
      if (z >= t.z[idx]) continue;
      t.z[idx] = z;
      t.rgb[idx * 3] = col[0]; t.rgb[idx * 3 + 1] = col[1]; t.rgb[idx * 3 + 2] = col[2];
    }
  }
}
function projectAndDraw(t, worldTri, col, twoSided) {
  for (let i = 0; i < 3; i++) _v4[i].set(worldTri[i].x, worldTri[i].y, worldTri[i].z, 1).applyMatrix4(_pv);
  let poly = [_v4[0].clone(), _v4[1].clone(), _v4[2].clone()];
  if (poly.some(v => v.z + v.w < 0)) poly = clipNear(poly);
  if (poly.length < 3) return;
  const scr = poly.map(v => ({ x: (v.x / v.w * 0.5 + 0.5) * t.w, y: (1 - (v.y / v.w * 0.5 + 0.5)) * t.h, z: v.z / v.w }));
  for (let i = 1; i < scr.length - 1; i++) rasterTri(t, scr[0], scr[i], scr[i + 1], col, twoSided);
}
function toon(x) { // 4 bandas como el gradientMap del prototipo
  if (x < 0.25) return 70 / 255; if (x < 0.5) return 148 / 255; if (x < 0.75) return 214 / 255; return 1;
}
function shade(mat, n) {
  const c = mat.color || new THREE.Color(0x888888);
  let r = c.r, g = c.g, b = c.b;
  if (mat.isMeshBasicMaterial || mat.isPointsMaterial || mat.isSpriteMaterial) {
    // sin iluminación
  } else {
    const dl = Math.max(0, n.dot(LIGHT));
    const df = Math.max(0, n.dot(FILL)) * 0.25;
    let k = 0.22 + 0.78 * dl + df;
    if (mat.isMeshToonMaterial) k = 0.18 + 0.82 * toon(Math.min(1, dl + df * 0.5));
    k = Math.min(1.15, k);
    r *= k; g *= k; b *= k;
    if (mat.emissive) {
      const ei = mat.emissiveIntensity == null ? 1 : mat.emissiveIntensity;
      r += mat.emissive.r * ei * 0.9; g += mat.emissive.g * ei * 0.9; b += mat.emissive.b * ei * 0.9;
    }
  }
  // gamma aprox (los colores del prototipo son sRGB a secas en r128)
  const gm = v => Math.round(Math.min(1, Math.max(0, Math.pow(v, 1 / 1.25))) * 255);
  return [gm(r), gm(g), gm(b)];
}
function isUnder(obj, ancestor) {
  for (let o = obj; o; o = o.parent) if (o === ancestor) return true;
  return false;
}
function renderTo(t) {
  scene.updateMatrixWorld(true);
  camera.updateMatrixWorld(true);
  camera.updateProjectionMatrix();
  _pv.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
  const bg = scene.background && scene.background.isColor ? scene.background : new THREE.Color(0x05070a);
  clear(t, Math.round(bg.r * 255), Math.round(bg.g * 255), Math.round(bg.b * 255));

  const items = [];
  scene.traverse(o => {
    if (!o.isMesh || !o.geometry) return;
    let vis = true;
    for (let p = o; p; p = p.parent) if (!p.visible) { vis = false; break; }
    if (!vis) return;
    const mat = o.material;
    if (!mat || mat.wireframe) return;
    if (mat.transparent && mat.opacity < 0.3) return;
    items.push(o);
  });

  const shadowCol = [8, 10, 12];
  const catRoot = cat.root;
  const tri = [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()];
  const shTri = [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()];
  const nm = new THREE.Matrix3();
  for (const o of items) {
    const g = o.geometry;
    const pos = g.attributes.position;
    if (!pos) continue;
    const idx = g.index ? g.index.array : null;
    const count = idx ? idx.length : pos.count;
    const mw = o.matrixWorld;
    nm.getNormalMatrix(mw);
    const mat = o.material;
    const twoSided = mat.side === THREE.DoubleSide;
    const castsShadow = o.castShadow && isUnder(o, catRoot);
    for (let i = 0; i < count; i += 3) {
      for (let k = 0; k < 3; k++) {
        const vi = idx ? idx[i + k] : i + k;
        tri[k].fromBufferAttribute(pos, vi).applyMatrix4(mw);
      }
      _e1.subVectors(tri[1], tri[0]); _e2.subVectors(tri[2], tri[0]);
      _n.crossVectors(_e1, _e2);
      if (_n.lengthSq() === 0) continue;
      _n.normalize();
      // para materiales de doble cara, orientar la normal hacia la cámara
      if (twoSided) {
        const toCam = camera.position.clone().sub(tri[0]);
        if (_n.dot(toCam) < 0) _n.negate();
      }
      const col = shade(mat, _n);
      projectAndDraw(t, tri, col, twoSided);
      if (castsShadow) {
        // proyección sobre el plano y = SHADOW_Y a lo largo de la luz principal
        for (let k = 0; k < 3; k++) {
          const s = (tri[k].y - SHADOW_Y) / LIGHT.y;
          shTri[k].set(tri[k].x - LIGHT.x * s, SHADOW_Y, tri[k].z - LIGHT.z * s);
        }
        projectAndDraw(t, shTri, shadowCol, true);
      }
    }
  }
}

// ---------- marcadores de depuración (pies IK / objetivo) ----------
function drawMarker(t, worldPos, col, size) {
  const v = new THREE.Vector4(worldPos.x, worldPos.y, worldPos.z, 1).applyMatrix4(_pv);
  if (v.w <= 0) return;
  const x = Math.round((v.x / v.w * 0.5 + 0.5) * t.w), y = Math.round((1 - (v.y / v.w * 0.5 + 0.5)) * t.h);
  const s = size || 2;
  for (let dy = -s; dy <= s; dy++) for (let dx = -s; dx <= s; dx++) {
    const px = x + dx, py = y + dy;
    if (px < 0 || py < 0 || px >= t.w || py >= t.h) continue;
    const i = py * t.w + px;
    t.rgb[i * 3] = col[0]; t.rgb[i * 3 + 1] = col[1]; t.rgb[i * 3 + 2] = col[2];
  }
}

// ---------- escenario ----------
if (CAM) {
  const c = CAM.split(',').map(Number);
  camera.position.set(c[0], c[1], c[2]);
}
const lookAt = LOOK ? new THREE.Vector3(...LOOK.split(',').map(Number)) : new THREE.Vector3(0, 2.25, 0);
const camOffset = camera.position.clone().sub(lookAt);
function aimCamera() {
  if (FOLLOW && cat.root) {
    const p = cat.root.position;
    const tgt = new THREE.Vector3(p.x, lookAt.y, p.z);
    camera.position.copy(tgt).add(camOffset);
    camera.lookAt(tgt);
  } else {
    camera.lookAt(lookAt);
  }
  camera.updateMatrixWorld(true);
}
// desactivar auto-orbit de OrbitControls para tener una cámara determinista
if (cat.controls) { cat.controls.autoRotate = false; cat.controls.enabled = false; }

stepFrames(20);
if (ACTIONS) ACTIONS.split(',').forEach(a => { if (typeof cat[a] === 'function') cat[a](); });
if (POSE) cat.setPose(POSE);
if (GOTO && cat.goTo) { const g = GOTO.split(',').map(Number); cat.goTo(g[0], g[1]); }
let keyPlan = [];
if (KEYS) keyPlan = KEYS.split(',').map(s => { const [k, n] = s.split(':'); return { key: k, frames: parseInt(n || '30', 10) }; });

function pressKeys(down) {
  (winHandlers[down ? 'keydown' : 'keyup'] || []).forEach(fn => fn({ key: down ? '' : '', target: { tagName: 'BODY' }, preventDefault() {} }));
}
function keyEvent(type, key) {
  (winHandlers[type] || []).forEach(fn => fn({ key, target: { tagName: 'BODY' }, preventDefault() {} }));
}
void pressKeys;

// calentamiento (con plan de teclas si lo hay)
let planIdx = 0, planLeft = keyPlan.length ? keyPlan[0].frames : 0;
if (keyPlan.length) keyEvent('keydown', keyPlan[0].key);
function stepWithPlan(n) {
  for (let i = 0; i < n; i++) {
    stepFrames(1);
    if (keyPlan.length && planIdx < keyPlan.length) {
      planLeft--;
      if (planLeft <= 0) {
        keyEvent('keyup', keyPlan[planIdx].key);
        planIdx++;
        if (planIdx < keyPlan.length) { planLeft = keyPlan[planIdx].frames; keyEvent('keydown', keyPlan[planIdx].key); }
      }
    }
  }
}
stepWithPlan(FRAMES);

const cols = Math.min(COLS, SHOTS), rows = Math.ceil(SHOTS / cols);
const sheet = Buffer.alloc(TW * cols * TH * rows * 3);
const tile = makeTarget(TW, TH);
const info = [];
for (let s = 0; s < SHOTS; s++) {
  if (s > 0) stepWithPlan(EVERY);
  aimCamera();
  renderTo(tile);
  if (ASCII) {
    const th = { '': ['#c9ff62', '#05070a'], cyan: ['#7beeff', '#04080c'], amber: ['#ffce64', '#0a0704'] }[cat.state.theme || ''];
    const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16) / 255);
    asciiPost(tile, CELL, hex(th[0]), hex(th[1]), TINT);
  }
  // marcadores: pies (verde=apoyado, magenta=en vuelo), objetivo de navegación (amarillo)
  if (cat.walkDebug) {
    const d = cat.walkDebug();
    (d.legs || []).forEach(l => {
      if (l.pawWorld) drawMarker(tile, l.pawWorld, l.swinging ? [255, 60, 220] : [90, 255, 120], 2);
      if (l.planted) drawMarker(tile, l.planted, [255, 255, 255], 1);
    });
    if (d.target) drawMarker(tile, new THREE.Vector3(d.target.x, 0.3, d.target.z), [255, 230, 60], 3);
    info.push({ shot: s, speed: +d.speed.toFixed(2), heading: +d.heading.toFixed(2), pos: d.pos, legs: (d.legs || []).map(l => (l.swinging ? 'S' : '_') + (l.reachErr != null ? l.reachErr.toFixed(3) : '')) });
  } else {
    info.push({ shot: s, pos: cat.root.position.toArray().map(n => +n.toFixed(2)) });
  }
  const cx = s % cols, cy = Math.floor(s / cols);
  for (let y = 0; y < TH; y++) {
    tile.rgb.copy(sheet, ((cy * TH + y) * TW * cols + cx * TW) * 3, y * TW * 3, (y + 1) * TW * 3);
  }
}
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, encodePNG(TW * cols, TH * rows, sheet));
console.log('render →', OUT, `(${TW * cols}×${TH * rows}, ${SHOTS} shots, pose=${cat.state.pose})`);
info.forEach(i => console.log(JSON.stringify(i)));
