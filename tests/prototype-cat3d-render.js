'use strict';
/* Rasterizador por software para prototypes/cat3d.html (NO es parte del sitio).
   Renderiza la escena Three.js REAL del prototipo sin GPU: recorre las mallas,
   proyecta con la cámara del prototipo y rasteriza con z-buffer + sombreado
   Lambert/toon + sombra planar. Escribe PNG usando solo zlib (stdlib).

   Uso:
     node tests/prototype-cat3d-render.js [--pose walk] [--frames 90] [--shots 6]
          [--every 12] [--out /tmp/cat.png] [--cam 7.6,4.9,10.6] [--look 0,2.25,0]
          [--goto 1.6,-1.2] [--keys ArrowUp:60,ArrowLeft:30] [--w 480] [--h 300]
          [--actions meow,pet,startle] [--follow]

   Cada "shot" es un tile; se componen en una hoja de contactos (3 columnas). */
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
