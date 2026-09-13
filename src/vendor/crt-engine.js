/**
 * ThreeUI CrtBackground - Zion Terminal CRT Renderer (Vanilla Engine)
 * Runtime: Raw WebGL + Canvas 2D
 * Exact ThreeUI logic: 19-row Zion Boot Log + CRT Scanline/Grille/Curvature Shaders
 * Source revision: SHA-256 860a1eb1d4c9
 */
(function(global) {
  "use strict";

  // --- CRT Shaders ---
  const CRT_VERTEX_SHADER = "attribute vec2 aPos;\nvoid main(){ gl_Position = vec4(aPos,0.0,1.0); }";

const CRT_FRAGMENT_SHADER = `precision highp float;
uniform sampler2D uTex;
uniform vec2 uRes;
uniform float uTime;
uniform float uMotion;
uniform vec2 uCurve;
uniform float uScan;
uniform float uScanDepth;
uniform float uTriad;
uniform float uGrille;
uniform float uChroma;
uniform float uBar;
uniform float uFlicker;
uniform float uGrain;
uniform float uNoise;
uniform float uVignette;
uniform float uMono;
uniform float uGain;
uniform float uHalo;
uniform vec3 uSheen;
uniform vec3 uRoom;

float hash(vec2 p){ p=fract(p*vec2(123.34,456.21)); p+=dot(p,p+45.32); return fract(p.x*p.y); }

vec2 curve(vec2 uv){
  uv = uv*2.0-1.0;
  vec2 o = uv.yx*uv.yx;
  uv += uv * o * uCurve;
  uv = uv*0.5+0.5;
  return uv;
}

void main(){
  vec2 fuv = gl_FragCoord.xy / uRes;
  vec2 uv = curve(fuv);
  float t = uTime;

  /* analogue transport faults: per-row jitter, a rolling dropout band, and the
     head-switching scramble along the bottom edge of the raster */
  float band = 0.0;
  if (uNoise > 0.001){
    float row = floor(uv.y * 190.0);
    float gate = step(0.905, hash(vec2(row, floor(t*15.0))));
    uv.x += (hash(vec2(row*1.7, floor(t*15.0)+7.0)) - 0.5) * 0.052 * gate * uNoise;
    float pos = fract(uv.y * 0.8 - t * 0.17);
    band = smoothstep(0.075, 0.0, pos);
    uv.x += band * (hash(vec2(floor(uv.y*260.0), floor(t*26.0))) - 0.5) * 0.030 * uNoise;
    float head = smoothstep(0.030, 0.0, uv.y);
    uv.x += head * (hash(vec2(floor(uv.y*520.0), floor(t*22.0))) - 0.32) * 0.075 * uNoise;
    band = max(band, head);
  }

  vec2 inb = step(vec2(0.0), uv) * step(uv, vec2(1.0));
  float inside = inb.x*inb.y;
  vec2 ed = min(uv, 1.0-uv);
  inside *= smoothstep(0.0,0.020, min(ed.x,ed.y));

  vec2 dir = uv-0.5;
  float d2 = dot(dir,dir);
  vec2 ao = dir * (0.0010 + 0.0075*d2) * uChroma;
  vec3 col;
  col.r = texture2D(uTex, uv + ao).r;
  col.g = texture2D(uTex, uv).g;
  col.b = texture2D(uTex, uv - ao).b;

  /* phosphor halation: a wide cheap tap ring so bright glyphs bloom into the
     glass instead of relying on the text canvas alone */
  if (uHalo > 0.001){
    float s = 0.0038;
    vec3 wide = texture2D(uTex, uv + vec2( s, 0.0)).rgb
              + texture2D(uTex, uv + vec2(-s, 0.0)).rgb
              + texture2D(uTex, uv + vec2(0.0,  s)).rgb
              + texture2D(uTex, uv + vec2(0.0, -s)).rgb
              + texture2D(uTex, uv + vec2( s,  s)*0.72).rgb
              + texture2D(uTex, uv + vec2(-s, -s)*0.72).rgb;
    col += wide * (uHalo / 6.0);
  }

  float sl = sin(uv.y*3.14159265*uScan + t*4.0*uMotion);
  col *= mix(1.0 - uScanDepth, 1.0, sl*sl);

  float gx = gl_FragCoord.x * (6.2831853/max(uTriad, 1.0));
  vec3 grille = (1.0-uGrille) + uGrille*cos(gx + vec3(0.0,2.094,4.188));
  col *= mix(vec3(1.0), grille, step(0.001, uGrille));
  col *= uGain;

  float bar = fract(uv.y*0.5 - t*0.07*uMotion);
  bar = smoothstep(0.0,0.05,bar)*smoothstep(0.18,0.05,bar);
  col += bar*uBar*uMotion;

  float sheen = smoothstep(0.55,0.0, distance(uv, vec2(0.50,0.15)));
  col += sheen*0.030*uSheen;

  float vig = smoothstep(0.98,0.30, length((uv-0.5)*vec2(1.05,1.0)));
  col *= mix(1.0-uVignette, 1.0, vig);
  col *= 1.0 - uFlicker*uMotion*sin(t*8.0);

  if (uNoise > 0.001){
    float st = hash(fuv*uRes*0.5 + vec2(floor(t*24.0), floor(t*24.0)*1.7));
    col += (st-0.5)*0.135*uNoise;
    col += band*0.085*uNoise;
  }
  col += (hash(fuv + fract(t*0.37)) - 0.5)*uGrain;

  float luma = dot(col, vec3(0.2126,0.7152,0.0722));
  col = mix(col, vec3(luma), uMono);

  float spill = smoothstep(0.85,0.18, length(fuv-0.5))*0.05;
  vec3 room = uRoom + uSheen*spill*0.42;
  col = mix(room, col, inside);
  col = max(col, uRoom*0.34);
  gl_FragColor = vec4(col,1.0);
}`;


  // --- CRT Screens & Styles ---
  /* Screen painters for the CRT variants. Each one draws a complete picture into an
   offscreen 2D canvas that the WebGL pass then curves, scans, and grades. The
   authored ZION terminal stays in crtRenderer.ts; these are the added styles. */

const CRT_STYLES = {
  terminal: {
    curve: [0.115, 0.165], scanDensity: 0.44, scanDepth: 0.30, triadCss: 3.2, grille: 0.34, chroma: 1,
    bar: 0.045, flicker: 0.028, grain: 0.022, noise: 0, vignette: 0.58, mono: 0, gain: 1.34, halo: 0.10,
    sheen: [0.55, 1.0, 0.78], room: [0.012, 0.03, 0.022], background: "#03100a",
    filtering: "linear", surface: { mode: "buffer" }, redrawMs: 0,
  },
  cinematic: {
    curve: [0.085, 0.125], scanDensity: 0.40, scanDepth: 0.22, triadCss: 3.6, grille: 0.14, chroma: 0.7,
    bar: 0.022, flicker: 0.020, grain: 0.055, noise: 0, vignette: 0.74, mono: 1, gain: 1.16, halo: 0.20,
    sheen: [0.86, 0.90, 1.0], room: [0.016, 0.016, 0.018], background: "#07070a",
    filtering: "linear", surface: { mode: "cap", width: 1280 }, redrawMs: 33,
  },
  "blue-screen": {
    curve: [0.130, 0.180], scanDensity: 0.46, scanDepth: 0.34, triadCss: 3.0, grille: 0.30, chroma: 1.9,
    bar: 0.055, flicker: 0.042, grain: 0.038, noise: 1, vignette: 0.60, mono: 0, gain: 1.22, halo: 0.16,
    sheen: [0.62, 0.76, 1.0], room: [0.014, 0.020, 0.046], background: "#050a24",
    filtering: "linear", surface: { mode: "cap", width: 1600 }, redrawMs: 96,
  },
  nintendo: {
    curve: [0.070, 0.100], scanDensity: 0.34, scanDepth: 0.26, triadCss: 3.4, grille: 0.20, chroma: 0.55,
    bar: 0.018, flicker: 0.014, grain: 0.014, noise: 0, vignette: 0.46, mono: 0, gain: 1.20, halo: 0.06,
    sheen: [0.72, 0.84, 1.0], room: [0.020, 0.024, 0.040], background: "#0a1030",
    filtering: "nearest", surface: { mode: "fixed", width: 320, height: 180 }, redrawMs: 16,
  },
};



const MONO_STACK = 'ui-monospace, "SF Mono", "JetBrains Mono", Menlo, Consolas, monospace';
const GROTESQUE_STACK = '"Helvetica Neue", "Inter", Helvetica, Arial, sans-serif';
const pad = (value, size = 2) => String(Math.floor(value)).padStart(size, "0");

/* ---------------------------------------------------------------- cinematic */

const CINEMATIC_CYCLE = 8;
const CINEMATIC_CHROME = [
  { text: "PICTURE START", corner: "tl" }, { text: "MONO · ACADEMY", corner: "bl" }, { text: "REEL 02 OF 04", corner: "br" },
];

function registrationMark(context, x, y, size) {
  context.beginPath(); context.moveTo(x - size, y); context.lineTo(x + size, y); context.moveTo(x, y - size); context.lineTo(x, y + size); context.stroke();
  context.beginPath(); context.arc(x, y, size * 0.52, 0, Math.PI * 2); context.stroke();
}

const paintCinematic = (context, width, height, time) => {
  const bar = height * 0.112, top = bar, bottom = height - bar, frameHeight = bottom - top;
  const cx = width / 2, cy = top + frameHeight / 2, radius = frameHeight * 0.325;
  const phase = ((time % CINEMATIC_CYCLE) + CINEMATIC_CYCLE) % CINEMATIC_CYCLE, counting = phase < 7;
  const label = Math.max(2, 9 - Math.ceil(phase || 0.0001));

  const wash = context.createLinearGradient(0, top, 0, bottom);
  wash.addColorStop(0, "#101013"); wash.addColorStop(0.55, "#08080a"); wash.addColorStop(1, "#0d0d10");
  context.setTransform(1, 0, 0, 1, 0, 0); context.fillStyle = wash; context.fillRect(0, 0, width, height);

  /* the running film edge: perforations scroll past on both sides of the frame */
  context.fillStyle = "rgba(236,236,240,0.20)";
  const pitch = frameHeight / 9, offset = (time * pitch * 2.4) % pitch, perfWidth = width * 0.011, perfHeight = pitch * 0.34;
  for (let y = top - pitch + offset; y < bottom + pitch; y += pitch) {
    context.fillRect(width * 0.022, y, perfWidth, perfHeight);
    context.fillRect(width - width * 0.022 - perfWidth, y, perfWidth, perfHeight);
  }

  context.strokeStyle = "rgba(238,238,244,0.16)"; context.lineWidth = Math.max(1, height * 0.0016);
  context.beginPath(); context.moveTo(cx, top); context.lineTo(cx, bottom); context.moveTo(width * 0.06, cy); context.lineTo(width * 0.94, cy); context.stroke();

  context.strokeStyle = "rgba(238,238,244,0.30)";
  for (const corner of ["tl", "tr", "bl", "br"]) {
    const x = corner.endsWith("l") ? width * 0.085 : width * 0.915, y = corner.startsWith("t") ? top + frameHeight * 0.16 : bottom - frameHeight * 0.16;
    registrationMark(context, x, y, height * 0.024);
  }

  if (counting) {
    context.strokeStyle = "rgba(240,240,246,0.42)"; context.lineWidth = Math.max(1.4, height * 0.0032);
    context.beginPath(); context.arc(cx, cy, radius, 0, Math.PI * 2); context.stroke();
    context.strokeStyle = "rgba(240,240,246,0.22)";
    context.beginPath(); context.arc(cx, cy, radius * 0.845, 0, Math.PI * 2); context.stroke();

    const sweep = (phase % 1) * Math.PI * 2, start = -Math.PI / 2;
    context.fillStyle = "rgba(244,244,250,0.085)";
    context.beginPath(); context.moveTo(cx, cy); context.arc(cx, cy, radius, start, start + sweep); context.closePath(); context.fill();
    context.strokeStyle = "rgba(248,248,252,0.70)"; context.lineWidth = Math.max(1.2, height * 0.0026);
    context.beginPath(); context.moveTo(cx, cy); context.lineTo(cx + Math.cos(start + sweep) * radius, cy + Math.sin(start + sweep) * radius); context.stroke();

    context.strokeStyle = "rgba(238,238,244,0.34)"; context.lineWidth = Math.max(1, height * 0.0020);
    for (let tick = 0; tick < 12; tick += 1) {
      const angle = start + (tick / 12) * Math.PI * 2, inner = tick % 3 === 0 ? radius * 1.055 : radius * 1.028;
      context.beginPath(); context.moveTo(cx + Math.cos(angle) * inner, cy + Math.sin(angle) * inner); context.lineTo(cx + Math.cos(angle) * radius * 1.10, cy + Math.sin(angle) * radius * 1.10); context.stroke();
    }

    context.textAlign = "center"; context.textBaseline = "middle";
    context.shadowColor = "rgba(255,255,255,0.55)"; context.shadowBlur = height * 0.030;
    context.fillStyle = "#f6f6fa"; context.font = `700 ${(radius * 1.28).toFixed(2)}px ${GROTESQUE_STACK}`;
    context.fillText(String(label), cx, cy + radius * 0.02);
    context.shadowBlur = 0;
  } else {
    const flash = Math.max(0, 1 - (phase - 7) / 0.10);
    if (flash > 0) { context.fillStyle = `rgba(250,250,252,${(flash * 0.62).toFixed(3)})`; context.fillRect(0, top, width, frameHeight); }
    context.textAlign = "center"; context.textBaseline = "middle";
    context.fillStyle = "rgba(244,244,248,0.92)";
    const size = height * 0.052;
    context.font = `500 ${size.toFixed(2)}px ${MONO_STACK}`;
    const title = "T H E   L O N G   Q U I E T";
    context.shadowColor = "rgba(255,255,255,0.45)"; context.shadowBlur = height * 0.020;
    /* clear of the horizontal crosshair, which otherwise rules through the baseline */
    context.fillText(title, cx, cy - size * 0.78);
    context.shadowBlur = 0;
    context.font = `400 ${(size * 0.42).toFixed(2)}px ${MONO_STACK}`;
    context.fillStyle = "rgba(232,232,238,0.60)";
    context.fillText("S C E N E   1 4   ·   T A K E   0 3", cx, cy + size * 0.62);
  }

  const chromeSize = height * 0.0255;
  context.font = `500 ${chromeSize.toFixed(2)}px ${MONO_STACK}`; context.textBaseline = "middle"; context.fillStyle = "rgba(226,226,232,0.66)";
  for (const item of CINEMATIC_CHROME) {
    context.textAlign = item.corner.endsWith("l") ? "left" : "right";
    const x = item.corner.endsWith("l") ? width * 0.055 : width * 0.945;
    context.fillText(item.text, x, item.corner.startsWith("t") ? top + frameHeight * 0.055 : bottom - frameHeight * 0.055);
  }
  const frames = Math.floor(time * 24);
  context.textAlign = "right";
  context.fillStyle = "rgba(240,240,246,0.82)";
  context.fillText(`01:${pad((frames / 1440) % 60)}:${pad((frames / 24) % 60)}:${pad(frames % 24)}`, width * 0.945, top + frameHeight * 0.055);

  context.fillStyle = "#000"; context.fillRect(0, 0, width, bar); context.fillRect(0, bottom, width, bar + 1);
};

/* -------------------------------------------------------------- blue screen */

const BLUE_LINES = [
  { text: "SIGNAL HALTED", tone: "head" }, { text: "" },
  { text: "A fault was detected in the video subsystem and the raster" },
  { text: "driver was stopped to prevent damage to the display." }, { text: "" },
  { text: "*  If this screen appears again, power the unit down and let" },
  { text: "   the flyback transformer discharge before restarting." }, { text: "" },
  { text: "*  Horizontal deflection module HD-04 reported a bad sync" },
  { text: "   pulse on line 312 of field 2." }, { text: "" },
  { text: "Technical information:", tone: "bright" }, { text: "" },
  { text: "***  STOP: 0x0000CA7E  (0x0F13D0C0, 0x00000002, 0xC0000005)" },
  { text: "***  RASTER.SYS  -  address 8C1FA00E  base at 8C1F0000" }, { text: "" },
];

const paintBlueScreen = (context, width, height, time) => {
  const wash = context.createLinearGradient(0, 0, 0, height);
  wash.addColorStop(0, "#212ec0"); wash.addColorStop(0.62, "#1a22a4"); wash.addColorStop(1, "#141a86");
  context.setTransform(1, 0, 0, 1, 0, 0); context.fillStyle = wash; context.fillRect(0, 0, width, height);

  /* the panel is sized off the line budget so the whole fault report clears the
     curved edges of the tube at any aspect */
  const columns = 62, total = BLUE_LINES.length + 4;
  const size = Math.min((height * 0.88) / (total * 1.44), (width * 0.82) / (columns * 0.60));
  context.font = `600 ${size.toFixed(2)}px ${MONO_STACK}`;
  const advance = context.measureText("M").width || size * 0.6, lineHeight = size * 1.44;
  const blockWidth = advance * columns, left = Math.round((width - blockWidth) / 2);
  const startY = Math.round((height - total * lineHeight) / 2);
  context.textBaseline = "top"; context.textAlign = "left";

  const head = BLUE_LINES[0].text, headWidth = advance * (head.length + 4);
  context.fillStyle = "#e9ecff";
  context.fillRect(Math.round((width - headWidth) / 2), startY - size * 0.20, headWidth, lineHeight);
  context.fillStyle = "#161d92";
  context.fillText(head, Math.round((width - headWidth) / 2) + advance * 2, startY);

  context.shadowColor = "rgba(196,214,255,0.55)"; context.shadowBlur = size * 0.30;
  let y = startY + lineHeight;
  for (const line of BLUE_LINES.slice(1)) {
    if (line.text) {
      context.fillStyle = line.tone === "bright" ? "#ffffff" : line.tone === "dim" ? "#aab6f0" : "#dfe5ff";
      context.fillText(line.text, left, y);
    }
    y += lineHeight;
  }

  const dump = Math.min(100, Math.floor((((time % 12) + 12) % 12) * 22));
  context.fillStyle = "#dfe5ff";
  context.fillText(dump >= 100 ? "Dump of video memory complete." : `Beginning dump of video memory: ${pad(dump, 2)}%`, left, y);
  y += lineHeight * 2;
  const prompt = "Press any key to restart the deflection stage ";
  context.fillText(prompt, left, y);
  if (Math.floor(time * 2) % 2 === 0) context.fillRect(left + advance * prompt.length, y + size * 0.08, advance * 0.9, size * 0.96);
  context.shadowBlur = 0;
};

/* ----------------------------------------------------------------- nintendo */

const GLYPHS = {
  "0": ".###.#...##..###.#.###..##...#.###.", "1": "..#...##....#....#....#....#...###.", "2": ".###.#...#....#...#...#...#...#####",
  "3": "####.....#....#.###.....#....#####.", "4": "#..#.#..#.#..#.#####...#....#....#.", "5": "######....####.....#....##...#.###.",
  "6": ".###.#....#....####.#...##...#.###.", "7": "#####....#...#...#...#....#....#...", "8": ".###.#...##...#.###.#...##...#.###.",
  "9": ".###.#...##...#.####....#....#.###.", A: ".###.#...##...#######...##...##...#", B: "####.#...##...#####.#...##...#####.",
  C: ".#####....#....#....#....#.....####", D: "####.#...##...##...##...##...#####.", E: "######....#....####.#....#....#####",
  F: "######....#....####.#....#....#....", G: ".#####....#....#..###...##...#.####", H: "#...##...##...#######...##...##...#",
  I: "#####..#....#....#....#....#..#####", J: "....#....#....#....##...##...#.###.", K: "#...##..#.#.#..##...#.#..#..#.#...#",
  L: "#....#....#....#....#....#....#####", M: "#...###.###.#.##...##...##...##...#", N: "#...###..##.#.##..###...##...##...#",
  O: ".###.#...##...##...##...##...#.###.", P: "####.#...##...#####.#....#....#....", Q: ".###.#...##...##...##.#.##..#..##.#",
  R: "####.#...##...#####.#.#..#..#.#...#", S: ".#####....#.....###.....#....#####.", T: "#####..#....#....#....#....#....#..",
  U: "#...##...##...##...##...##...#.###.", V: "#...##...##...##...##...#.#.#...#..", W: "#...##...##...##...##.#.###.###...#",
  X: "#...##...#.#.#...#...#.#.#...##...#", Y: "#...##...#.#.#...#....#....#....#..", Z: "#####....#...#...#...#...#....#####",
  " ": "...................................", "-": "...............#####...............", ".": "..........................##...##..",
  ":": "......##...##........##...##.......", "!": "..#....#....#....#....#.........#..", "?": ".###.#...#....#..##...#.........#..",
  "(": "..##..#....#....#....#....#.....##.", ")": ".##.....#....#....#....#....#..##..", "/": "....#....#...#...#...#...#....#....",
  "*": ".....#.#.#.###.#####.###.#.#.#.....", "'": "..#....#...........................",
};

const GLYPH_WIDTH = 5, GLYPH_HEIGHT = 7;

function pixelTextWidth(text, scale) {
  return text.length ? (text.length * (GLYPH_WIDTH + 1) - 1) * scale : 0;
}

function drawPixelText(context, text, x, y, scale, color) {
  context.fillStyle = color;
  let cursor = x;
  for (const character of text.toUpperCase()) {
    const rows = GLYPHS[character];
    if (rows) {
      for (let row = 0; row < GLYPH_HEIGHT; row += 1) {
        for (let column = 0; column < GLYPH_WIDTH; column += 1) {
          if (rows[row * GLYPH_WIDTH + column] === "#") context.fillRect(cursor + column * scale, y + row * scale, scale, scale);
        }
      }
    }
    cursor += (GLYPH_WIDTH + 1) * scale;
  }
}

const RUNNER_PALETTE = { "1": "#1a1028", "2": "#e0402c", "3": "#f4f4f4", "4": "#2ec4e8", "5": "#22304a" };
const RUNNER_HEAD = [
  "....111111....", "...13333331...", "..1333333331..", "..1355555531..", "..1355555531..", "..1333333331..", "...13333331...", "....111111....",
  "...12222221...", ".122222222221.", ".124444444421.", ".122222222221.", "..1222222221..",
];
const RUNNER_LEGS = {
  a: ["...122..221...", "...122..221...", "..1111..1111.."],
  b: ["..122....221..", ".122......221.", "1111......1111"],
  jump: ["..122....221..", ".1221....1221.", ".111......111."],
};

function drawRunner(context, x, y, pose, flip) {
  const rows = [...RUNNER_HEAD, ...RUNNER_LEGS[pose]];
  for (let row = 0; row < rows.length; row += 1) {
    const line = rows[row];
    for (let column = 0; column < line.length; column += 1) {
      const color = RUNNER_PALETTE[line[column]];
      if (color) { context.fillStyle = color; context.fillRect(x + (flip ? line.length - 1 - column : column), y + row, 1, 1); }
    }
  }
}

function drawCloud(context, x, y, scale) {
  context.fillStyle = "#f4f8ff";
  const puffs = [[0, 4, 22, 6], [4, 1, 14, 4], [11, 2, 12, 5], [2, 8, 20, 3]];
  for (const [dx, dy, w, h] of puffs) context.fillRect(Math.round(x + dx * scale), Math.round(y + dy * scale), Math.round(w * scale), Math.round(h * scale));
}

function drawHill(context, x, baseY, size, color) {
  context.fillStyle = color;
  for (let step = 0; step < size; step += 1) {
    const width = (size - step) * 4;
    context.fillRect(Math.round(x - width / 2), baseY - (step + 1) * 3, width, 3);
  }
}

/* one 320x180 title screen, laid out so the wordmark, credit, prompt, crates, and
   the runner's jump arc each own a horizontal band and never overlap */
const NINTENDO_CYCLE = 10;
const CRATE_X = [118, 208], GROUND_ROW = 154, JUMP_SPAN = 50, JUMP_LIFT = 22;

function drawCrate(context, x, y) {
  context.fillStyle = "#20140c"; context.fillRect(x, y, 16, 16);
  context.fillStyle = "#d8902c"; context.fillRect(x + 1, y + 1, 14, 14);
  context.fillStyle = "#f0c060"; context.fillRect(x + 1, y + 1, 14, 3);
  context.fillStyle = "#8a5414"; context.fillRect(x + 1, y + 11, 14, 3);
  context.fillStyle = "#20140c";
  context.fillRect(x + 6, y + 5, 4, 2); context.fillRect(x + 5, y + 7, 6, 2); context.fillRect(x + 6, y + 9, 4, 2);
}

function drawGem(context, x, y, spin) {
  const gemWidth = [8, 6, 2, 6][spin], half = gemWidth / 2, inset = gemWidth > 3 ? 1 : 0;
  context.fillStyle = "#20140c";
  context.fillRect(x - half - 1, y + 1, gemWidth + 2, 8); context.fillRect(x - half, y - 1, gemWidth, 12);
  context.fillStyle = "#ffe070";
  context.fillRect(x - half, y + 1, gemWidth, 8); context.fillRect(x - half + inset, y, gemWidth - inset * 2, 10);
  context.fillStyle = "#fff8c8"; context.fillRect(x - half + inset, y + 2, Math.max(1, half - inset), 4);
}

const paintNintendo = (context, width, height, time) => {
  const groundY = GROUND_ROW, phase = ((time % NINTENDO_CYCLE) + NINTENDO_CYCLE) % NINTENDO_CYCLE;

  const sky = context.createLinearGradient(0, 0, 0, groundY);
  sky.addColorStop(0, "#2440b8"); sky.addColorStop(0.55, "#5c94fc"); sky.addColorStop(1, "#9ecbff");
  context.setTransform(1, 0, 0, 1, 0, 0); context.fillStyle = sky; context.fillRect(0, 0, width, height);

  for (let star = 0; star < 22; star += 1) {
    const x = (star * 61) % width, y = 2 + ((star * 29) % 16);
    context.fillStyle = (star + Math.floor(time * 3)) % 5 === 0 ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.30)";
    context.fillRect(x, y, 1, 1);
  }

  /* clouds sit in the sky band above the wordmark, never behind its counters */
  for (const [speed, cloudY, scale] of [[6, 18, 1.25], [3.5, 32, 0.85]]) {
    const span = width + 80;
    for (let copy = 0; copy < 3; copy += 1) drawCloud(context, (((time * speed) + (copy * span) / 3) % span) - 50, cloudY + (copy % 2) * 5, scale);
  }

  drawHill(context, 48, groundY, 9, "#2f7a3a");
  drawHill(context, 268, groundY, 11, "#2f7a3a");
  drawHill(context, 160, groundY, 6, "#3e9a48");

  context.fillStyle = "#3ca03c"; context.fillRect(0, groundY, width, 4);
  context.fillStyle = "#2c7a2c"; context.fillRect(0, groundY + 4, width, 2);
  context.fillStyle = "#a05a28"; context.fillRect(0, groundY + 6, width, height - groundY - 6);
  context.fillStyle = "#7c4018";
  for (let y = groundY + 6; y < height; y += 6) {
    context.fillRect(0, y, width, 1);
    for (let x = (y % 12 === 0 ? 0 : 6); x < width; x += 12) context.fillRect(x, y, 1, 6);
  }

  const spin = Math.floor(time * 8) % 4, bob = [0, 1, 1, 0][Math.floor(time * 6) % 4];
  for (const crateX of CRATE_X) { drawCrate(context, crateX, groundY - 16); drawGem(context, crateX + 8, groundY - 32 - bob, spin); }

  const runX = Math.round(-24 + ((phase / NINTENDO_CYCLE) * (width + 60)));
  let lift = 0;
  for (const crateX of CRATE_X) {
    const progress = (runX - (crateX - 28)) / JUMP_SPAN;
    if (progress > 0 && progress < 1) lift = Math.max(lift, Math.sin(progress * Math.PI) * JUMP_LIFT);
  }
  const pose = lift > 0.5 ? "jump" : Math.floor(time * 9) % 2 === 0 ? "a" : "b";
  context.fillStyle = "rgba(20,16,10,0.20)"; context.fillRect(runX + 2, groundY - 1, 10, 2);
  drawRunner(context, runX, groundY - 16 - Math.round(lift), pose, false);

  for (const [text, x] of [["PLAYER-1", 10], ["GEMS 0" + (2 + Math.floor(phase / 4)), 96], ["WORLD 1-1", 174], ["TIME " + pad(Math.max(0, 384 - Math.floor(time * 2)) % 1000, 3), 254]]) {
    drawPixelText(context, String(text), Number(x), 7, 1, "#141428");
    drawPixelText(context, String(text), Number(x), 6, 1, "#ffffff");
  }

  const title = "RASTER RUN", titleWidth = pixelTextWidth(title, 3), titleX = Math.round((width - titleWidth) / 2);
  drawPixelText(context, title, titleX + 3, 53, 3, "#141028");
  drawPixelText(context, title, titleX, 50, 3, "#f8e038");
  /* a highlight band sweeps the wordmark the way an attract-mode title does */
  const sweepX = titleX + ((time * 130) % (titleWidth + 110)) - 55;
  context.save();
  context.beginPath(); context.rect(sweepX, 50, 24, 21); context.clip();
  drawPixelText(context, title, titleX, 50, 3, "#fffce0");
  context.restore();

  const credit = "(C) 1987 THREEUI", creditX = Math.round((width - pixelTextWidth(credit, 1)) / 2);
  drawPixelText(context, credit, creditX, 79, 1, "#0e1430");
  drawPixelText(context, credit, creditX, 78, 1, "#dfe8ff");

  if (Math.floor(time * 1.6) % 2 === 0) {
    const start = "PUSH START", startX = Math.round((width - pixelTextWidth(start, 2)) / 2);
    drawPixelText(context, start, startX + 2, 100, 2, "#141028");
    drawPixelText(context, start, startX, 98, 2, "#ffffff");
  }
};

const CRT_SCREENS = {
  cinematic: paintCinematic,
  "blue-screen": paintBlueScreen,
  nintendo: paintNintendo,
};


  // --- CRT Renderer ---
  const CRT_VARIANTS = ["terminal", "cinematic", "blue-screen", "nintendo"];

const CRT_DEFAULTS = { variant: "terminal", speed: 1, typeSpeed: 1, motion: 1, brightness: 1, opacity: 1, hue: 0, saturation: 1 };
const crtStyle = (variant) => CRT_STYLES[variant] ?? CRT_STYLES.terminal;

const segment = (text, color = "p", action = null, data = null) => ({ t: text, c: color, a: action, d: data });
const dots = (count) => "·".repeat(count);

const LOG = [
  [segment("ZION MAINFRAME  v9.1.1"), segment("   (c) 2199 Nebuchadnezzar", "d")], [segment("CONSTRUCT Broadcast  Rev M  S/N NX-0101-0011", "d")], [],
  [segment("Hacking Matrix grid nodes "), segment(`${dots(14)} `, "d"), segment("OK", "a")], [segment("Neural Jack  0x000-0x0FF "), segment(`${dots(11)} `, "d"), segment("ONLINE "), segment("OK", "a")], [segment("Pinging agent signatures "), segment(`${dots(6)} `, "d"), segment("3 found")],
  [segment("nav0  OPERATOR UPLINK SECURE ", "d"), segment(`${dots(6)} `, "d"), segment("READY", "a")], [segment("vis0  CODE RAIN DECRYPT 256bit ", "d"), segment("READY", "a")], [segment("net0  HARDLINE CONNECTION MAX ", "d"), segment(`${dots(4)} `, "d"), segment("LINK", "a")], [segment("red0  RED PILL EXTRACTION ", "d"), segment(`${dots(4)} `, "d"), segment("READY", "a")],
  [segment("Mounting /dev/mind -> ROOT: "), segment(`${dots(6)} `, "d"), segment("OK", "a")], [segment("Loading weapon training program "), segment(`${dots(4)} `, "d"), segment("OK", "a")], [segment("Starting [ jmp spd str wpn ] "), segment(`${dots(4)} `, "d"), segment("OK", "a")], [segment("Locating the Oracle sector "), segment(`${dots(6)} `, "d"), segment("99.9%")], [],
  [segment("SYSTEM ANOMALY  "), segment("detected.", "h")], [segment("subject Thomas A. Anderson   status asleep ", "d"), segment("z", "d"), segment("Z", "d")], [], [segment("wake up: ")],
];

const PORTFOLIO_LOG = [
  [segment("==========================================================================", "d")],
  [segment("  ██████╗  ██████╗ ██████╗ ████████╗███████╗ ██████╗ ██╗     ██╗ ██████╗ ", "h")],
  [segment("  ██╔══██╗██╔═══██╗██╔══██╗╚══██╔══╝██╔════╝██╔═══██╗██║     ██║██╔═══██╗", "p")],
  [segment("  ██████╔╝██║   ██║██████╔╝   ██║   █████╗  ██║   ██║██║     ██║██║   ██║", "p")],
  [segment("  ██╔═══╝ ██║   ██║██╔══██╗   ██║   ██╔══╝  ██║   ██║██║     ██║██║   ██║", "p")],
  [segment("  ██║     ╚██████╔╝██║  ██║   ██║   ██║     ╚██████╔╝███████╗██║╚██████╔╝", "p")],
  [segment("==========================================================================", "d")],
  [segment("ALESSANDRO ALTAMIRANO SALAZAR", "h"), segment(" | DATOS, BI & AUTOMATIZACIÓN", "a")],
  [segment("Terminal CRT interactiva · Usa la rueda del ratón, touch o teclas ↑ / ↓ para scrollear", "d")],
  [],
  [segment("--- NAVEGACIÓN RÁPIDA (HAZ CLIC EN CUALQUIER SECCIÓN) ---", "d")],
  [
    segment("[ 1. BIO ]", "a", "jump-bio"),
    segment("   "),
    segment("[ 2. MÉTRICAS ]", "a", "jump-metrics"),
    segment("   "),
    segment("[ 3. CASOS STAR ]", "a", "jump-cases"),
    segment("   "),
    segment("[ 4. EXPERIENCIA ]", "a", "jump-exp"),
    segment("   "),
    segment("[ 5. SKILLS ]", "a", "jump-skills"),
    segment("   "),
    segment("[ 6. CONTACTO ]", "a", "jump-contact")
  ],
  [],
  [segment("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", "d")],
  [segment("01. RESUMEN PROFESIONAL & PROPUESTA DE VALOR", "h", null, "sec-bio")],
  [segment("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", "d")],
  [segment("Especialista en Business Intelligence, Ingeniería de Datos y Automatización.", "p")],
  [segment("Enfocado en transformar datos dispersos en arquitecturas analíticas de alto ROI.", "p")],
  [segment("Diseño pipelines ETL/ELT robustos, modelos dimensionales en Power BI (PBIR/DAX),", "d")],
  [segment("arquitecturas de datos en la nube y soluciones de Machine Learning predictivo.", "d")],
  [],
  [segment("• Core Tech: ", "a"), segment("Power BI, DAX, Python, SQL Avanzado, Google BigQuery, Snowflake, dbt", "p")],
  [segment("• Metodología: ", "a"), segment("Kimball Dimensional Modeling, Medallion Architecture, CI/CD DataOps", "p")],
  [segment("• Estado Actual: ", "a"), segment("DISPONIBILIDAD INMEDIATA · PROYECTOS REMOTOS & HÍBRIDOS", "h")],
  [],
  [segment("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", "d")],
  [segment("02. MÉTRICAS CLAVE DE IMPACTO CUANTIFICABLE", "h", null, "sec-metrics")],
  [segment("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", "d")],
  [segment("┌───────────────────┬────────────────────────────────────────────────────┐", "d")],
  [segment("│  +35% EFICIENCIA  │ Automatización de reportería ejecutiva y comercial │", "p")],
  [segment("│  -70% TIEMPO      │ Reducción de horas-hombre en conciliaciones y ETL  │", "p")],
  [segment("│  99.8% UPTIME     │ Confiabilidad en pipelines de datos y modelos prod │", "p")],
  [segment("│  +$120K USD/AÑO   │ Ahorro directo en costos de cómputo y licencias   │", "a")],
  [segment("└───────────────────┴────────────────────────────────────────────────────┘", "d")],
  [],
  [segment("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", "d")],
  [segment("03. CASOS DE ESTUDIO STAR (HAZ CLIC EN CUALQUIERA PARA DETALLES)", "h", null, "sec-cases")],
  [segment("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", "d")],
  [segment("[► CASO 1: PRIMAX PERÚ — ANALÍTICA COMERCIAL & LOGÍSTICA]", "a", "star-primax")],
  [segment("    S: 200+ estaciones de servicio con reportes manuales y 3 días de desfase.", "d")],
  [segment("    T: Diseñar una solución centralizada de telemetría y ventas en tiempo real.", "d")],
  [segment("    A: Arquitectura BigQuery + vistas analíticas + dashboards Power BI PBIR.", "d")],
  [segment("    R: Reducción del desfase a 0 horas (T-0), -65% tiempo y $45K ahorrados en merma.", "p")],
  [],
  [segment("[► CASO 2: PIPELINE MEDALLION LAKEHOUSE & DATA WAREHOUSE]", "a", "star-etl")],
  [segment("    S: Silos de datos heterogéneos (SAP, POS, APIs REST) sin auditoría ni linaje.", "d")],
  [segment("    T: Implementar arquitectura escalable Bronze/Silver/Gold con gobernanza.", "d")],
  [segment("    A: Ingesta batch/streaming con dbt Core, Snowflake y validaciones automáticas.", "d")],
  [segment("    R: 48,000+ documentos procesados/día, 99.8% disponibilidad y linaje de datos 100%.", "p")],
  [],
  [segment("[► CASO 3: SCORING PREDICTIVO DE RETENCIÓN & CHURN (ML)]", "a", "star-ml")],
  [segment("    S: Pérdida mensual recurrente de clientes B2B sin alertas tempranas de riesgo.", "d")],
  [segment("    T: Crear modelo de propensión de fuga y detección preventiva de patrones.", "d")],
  [segment("    A: Pipeline de ML en Python (XGBoost/Scikit-Learn), feature store y scoring semanal.", "d")],
  [segment("    R: +22% retención en el Q1, precisión AUC-ROC 0.89 y alertas automáticas a ventas.", "p")],
  [],
  [segment("[► CASO 4: DASHBOARD DIRECTIVO VASMAD EN POWER BI]", "a", "star-vasmad")],
  [segment("    S: C-Suite requería KPIs financieros consolidados y visualización móvil inmediata.", "d")],
  [segment("    T: Diseñar suite directiva en Power BI con latencia de carga inferior a 1.5s.", "d")],
  [segment("    A: Modelado estrella en Tabular Editor, medidas DAX vectorizadas y maquetación PBIR.", "d")],
  [segment("    R: Adopción del 100% en directorio, renderizado en 0.8s y decisiones estratégicas ágiles.", "p")],
  [],
  [segment("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", "d")],
  [segment("04. TRAYECTORIA PROFESIONAL & EXPERIENCIA", "h", null, "sec-exp")],
  [segment("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", "d")],
  [segment("• LEAD DATA & BI SPECIALIST", "h"), segment(" | 2023 — Presente", "d")],
  [segment("  - Liderazgo técnico en modelado dimensional, gobierno y automatización corporativa.", "p")],
  [segment("  - Reducción de tiempos de procesamiento y optimización de costos de infraestructura cloud.", "d")],
  [],
  [segment("• SENIOR BI & DATA AUTOMATION ANALYST", "h"), segment(" | 2021 — 2023", "d")],
  [segment("  - Creación de pipelines ETL/ELT y modelos semánticos de negocio para toma de decisiones.", "p")],
  [segment("  - Integración de Power BI con almacenes analíticos y desarrollo de dashboards ejecutivos.", "d")],
  [],
  [segment("• CONSULTOR DE INTELIGENCIA COMERCIAL & BI", "h"), segment(" | 2019 — 2021", "d")],
  [segment("  - Consultoría en transformación digital, reporting gerencial y optimización de flujos de datos.", "p")],
  [],
  [segment("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", "d")],
  [segment("05. CERTIFICACIONES & COMPETENCIAS TÉCNICAS", "h", null, "sec-skills")],
  [segment("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", "d")],
  [segment("[✔] Microsoft Certified: Power BI Data Analyst Associate (PL-300)", "p")],
  [segment("[✔] Google Cloud: Professional Data Engineering & Big Data Analytics", "p")],
  [segment("[✔] Python for Data Science, Scikit-Learn & Advanced Predictive Modeling", "p")],
  [segment("[✔] Kimball Group Dimensional Modeling & Data Warehouse Design", "p")],
  [segment("[✔] dbt Fundamentals & Modern Data Stack Lakehouse Architectures", "p")],
  [],
  [segment("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", "d")],
  [segment("06. SIMULADOR DE IMPACTO & RETORNO DE INVERSIÓN (ROI)", "h", null, "sec-roi")],
  [segment("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", "d")],
  [segment("Estimación basada en procesos de reportería y ETL estándar:", "d")],
  [segment("  • Horas manuales ahorradas por mes:       ~120 hrs", "p")],
  [segment("  • Horas manuales ahorradas al año:        ~1,440 hrs", "p")],
  [segment("  • Retorno de inversión estimado (ROI):    380% en el primer año", "a")],
  [segment("  • Periodo de amortización (Payback):      3.2 meses", "a")],
  [],
  [segment("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", "d")],
  [segment("07. ACCIONES & CANALES DE CONTACTO", "h", null, "sec-contact")],
  [segment("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", "d")],
  [segment("HAZ CLIC DIRECTAMENTE EN CUALQUIER BOTÓN PARA EJECUTAR LA ACCIÓN:", "d")],
  [
    segment("[ 📄 DESCARGAR CV EN PDF ]", "h", "open-cv"),
    segment("     "),
    segment("[ 💼 VER LINKEDIN ]", "p", "open-linkedin")
  ],
  [
    segment("[ 💻 VER REPOSITORIO GITHUB ]", "p", "open-github"),
    segment("  "),
    segment("[ ✉ ENVIAR CORREO ]", "a", "open-email")
  ],
  [],
  [segment("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", "d")],
  [segment("08. TERMINAL CLI INTEGRADA (COMANDOS DISPONIBLES)", "d")],
  [segment("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", "d")],
  [segment("Escribe en la consola inferior: ", "d"), segment("bio · metrics · star · exp · skills · contact · cv · clear", "a")],
  [],
  [segment("=== FIN DEL REPORTE CRT · SCROLL ARRIBA [▲] PARA VOLVER AL INICIO ===", "d")],
  []
];

const COLORS = {
  p: { fill: "#8df0b4", glow: "rgba(28,236,132,0.95)" },
  d: { fill: "#4f9a76", glow: "rgba(28,236,132,0.45)" },
  a: { fill: "#ffba5e", glow: "rgba(255,150,52,0.95)" },
  h: { fill: "#eafff3", glow: "rgba(120,255,190,0.95)" }
};

const lineLength = (line) => line.reduce((total, item) => total + item.t.length, 0);
const TOTAL = LOG.reduce((total, line) => total + lineLength(line), 0);
const MAX_CHARS = Math.max(...LOG.map(lineLength));

/* backing-store ceiling: the composite is one triangle, so the cost that matters is
   the 2D screen redraw and its upload, not the fragment pass */
const MAX_BUFFER_WIDTH = 1920, MIN_BUFFER_WIDTH = 640, MAX_BUFFER_PIXELS = 2_400_000;

function compile(gl, type, source) {
  const shader = gl.createShader(type);
  if (!shader) throw new Error("Unable to create CRT shader");
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader) ?? "CRT shader compilation failed");
  return shader;
}

function createCrtRenderer(host, canvas, getOptions) {
  const gl = canvas.getContext("webgl", { antialias: false, alpha: false, depth: false, premultipliedAlpha: false });
  if (!gl) throw new Error("CRT requires WebGL");
  const textCanvas = document.createElement("canvas"), textContext = textCanvas.getContext("2d");
  if (!textContext) throw new Error("CRT text canvas unavailable");

  const vertex = compile(gl, gl.VERTEX_SHADER, CRT_VERTEX_SHADER),
        fragment = compile(gl, gl.FRAGMENT_SHADER, CRT_FRAGMENT_SHADER),
        program = gl.createProgram();
  if (!program) throw new Error("Unable to create CRT program");
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program) ?? "CRT link failed");
  gl.useProgram(program);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, "aPos");
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  const uniform = (name) => gl.getUniformLocation(program, name);
  const uTexture = uniform("uTex"), uResolution = uniform("uRes"), uTime = uniform("uTime"), uMotion = uniform("uMotion"),
        uCurve = uniform("uCurve"), uScan = uniform("uScan"), uScanDepth = uniform("uScanDepth"), uTriad = uniform("uTriad"),
        uGrille = uniform("uGrille"), uChroma = uniform("uChroma"), uBar = uniform("uBar"), uFlicker = uniform("uFlicker"),
        uGrain = uniform("uGrain"), uNoise = uniform("uNoise"), uVignette = uniform("uVignette"), uMono = uniform("uMono"),
        uGain = uniform("uGain"), uHalo = uniform("uHalo"), uSheen = uniform("uSheen"), uRoom = uniform("uRoom");

  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.uniform1i(uTexture, 0);

  let width = 1, height = 1, cssWidth = 1, cssHeight = 1, fontSize = 14, lineHeight = 20, startY = 0, charWidth = 8,
      caretX = 0, caretY = 0, typed = 0, done = false, textDirty = true, lastTextAt = 0, lastReveal = -1, lastBlink = -1,
      variant = "terminal", style = crtStyle(variant);

  // Smooth scroll & interactive state
  let scrollY = 0, targetScrollY = 0, maxScrollY = 0;
  let sectionOffsets = {};
  let clickableRegions = [];
  let isDragging = false, dragStartY = 0, scrollStart = 0, hasDraggedFar = false;

  const startedAt = performance.now();

  const applyStyle = () => {
    gl.useProgram(program);
    gl.uniform2f(uCurve, style.curve[0], style.curve[1]);
    gl.uniform1f(uScanDepth, style.scanDepth);
    gl.uniform1f(uGrille, style.grille);
    gl.uniform1f(uChroma, style.chroma);
    gl.uniform1f(uBar, style.bar);
    gl.uniform1f(uFlicker, style.flicker);
    gl.uniform1f(uGrain, style.grain);
    gl.uniform1f(uNoise, style.noise);
    gl.uniform1f(uVignette, style.vignette);
    gl.uniform1f(uMono, style.mono);
    gl.uniform1f(uGain, style.gain);
    gl.uniform1f(uHalo, style.halo);
    gl.uniform3f(uSheen, style.sheen[0], style.sheen[1], style.sheen[2]);
    gl.uniform3f(uRoom, style.room[0], style.room[1], style.room[2]);
    const filter = style.filtering === "nearest" ? gl.NEAREST : gl.LINEAR;
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
  };

  const getActiveLog = () => {
    const opts = getOptions();
    return (opts && opts.contentMode === "zion") ? LOG : PORTFOLIO_LOG;
  };

  const layout = () => {
    const opts = getOptions();
    const isZion = opts && opts.contentMode === "zion";
    const activeLog = getActiveLog();
    sectionOffsets = {};

    if (isZion) {
      startY = height * 0.135;
      lineHeight = height * 0.74 / LOG.length;
      fontSize = Math.max(5, Math.min(lineHeight * 0.8, width * 0.88 / (Math.max(MAX_CHARS, 1) * 0.62)));
      maxScrollY = 0;
      targetScrollY = 0;
      scrollY = 0;
    } else {
      fontSize = Math.max(12, Math.min(18, Math.round(width * 0.0155)));
      lineHeight = Math.round(fontSize * 1.58);
      startY = Math.max(26, Math.round(height * 0.075));
      const totalH = startY + activeLog.length * lineHeight + Math.round(height * 0.15);
      maxScrollY = Math.max(0, totalH - height);
      targetScrollY = Math.max(0, Math.min(maxScrollY, targetScrollY));
      scrollY = Math.max(0, Math.min(maxScrollY, scrollY));

      for (let i = 0; i < activeLog.length; i++) {
        const line = activeLog[i];
        for (const item of line) {
          if (item.d && typeof item.d === "string" && item.d.startsWith("sec-")) {
            sectionOffsets[item.d] = Math.max(0, startY + i * lineHeight - 32);
          }
        }
      }
    }

    textContext.font = `600 ${fontSize.toFixed(2)}px ui-monospace, "SF Mono", "JetBrains Mono", Menlo, Consolas, monospace`;
    charWidth = textContext.measureText("M").width || fontSize * 0.6;
  };

  const setStyle = (key, glow) => {
    const color = COLORS[key] || COLORS.p;
    textContext.fillStyle = color.fill;
    textContext.shadowColor = glow ? color.glow : "transparent";
    textContext.shadowBlur = glow ? fontSize * 0.38 : 0;
  };

  /* two passes per glyph: a soft phosphor halo, then the same glyph re-filled with
     the shadow off so the stroke core stays crisp at any backing resolution */
  const drawScreen = (reveal) => {
    const opts = getOptions();
    textContext.setTransform(1, 0, 0, 1, 0, 0);
    textContext.fillStyle = (style && style.background) || "#03100a";
    textContext.fillRect(0, 0, width, height);

    if (opts && opts.showLog === false) {
      clickableRegions = [];
      return;
    }

    clickableRegions = [];
    const isZion = opts && opts.contentMode === "zion";
    const activeLog = getActiveLog();
    const baseLeft = isZion ? Math.floor((width - MAX_CHARS * charWidth) / 2) : Math.max(28, Math.round(width * 0.055));

    textContext.textAlign = "left";
    textContext.textBaseline = "top";
    textContext.font = `600 ${fontSize.toFixed(2)}px ui-monospace, "SF Mono", "JetBrains Mono", Menlo, Consolas, monospace`;

    if (isZion) {
      let remaining = reveal, y = startY;
      caretX = baseLeft;
      caretY = startY;
      for (const line of activeLog) {
        const length = lineLength(line), visible = reveal === Infinity ? Infinity : Math.min(remaining, length);
        let x = baseLeft, drawn = 0;
        for (const item of line) {
          let text = item.t;
          if (visible !== Infinity) {
            const left = visible - drawn;
            if (left <= 0) break;
            if (left < text.length) text = text.slice(0, left);
          }
          if (text.length) {
            setStyle(item.c, true);
            textContext.fillText(text, x, y);
            setStyle(item.c, false);
            textContext.fillText(text, x, y);
            x += charWidth * text.length;
          }
          drawn += item.t.length;
          if (visible !== Infinity && drawn >= visible) break;
        }
        caretX = x;
        caretY = y;
        if (visible !== Infinity) remaining -= visible;
        y += lineHeight;
        if (visible !== Infinity && remaining <= 0) break;
      }
    } else {
      // Portfolio Mode with vertical viewport culling
      let y = startY - Math.round(scrollY);
      caretX = baseLeft;
      caretY = y;

      for (let i = 0; i < activeLog.length; i++) {
        const line = activeLog[i];
        if (y >= -lineHeight && y <= height + lineHeight) {
          let x = baseLeft;
          for (const item of line) {
            const text = item.t;
            if (text.length) {
              setStyle(item.c, true);
              textContext.fillText(text, x, y);
              setStyle(item.c, false);
              textContext.fillText(text, x, y);
              const segW = charWidth * text.length;
              if (item.a) {
                clickableRegions.push({
                  x1: x - 4,
                  y1: y - 2,
                  x2: x + segW + 4,
                  y2: y + lineHeight - 2,
                  action: item.a,
                  data: item.d,
                  text: text
                });
              }
              x += segW;
            }
          }
        }
        y += lineHeight;
      }

      // Draw phosphor scrollbar if content exceeds viewport
      if (maxScrollY > 0) {
        const trackX = width - 20;
        const trackY = 24;
        const trackH = height - 48;

        textContext.fillStyle = "rgba(28, 236, 132, 0.12)";
        textContext.fillRect(trackX, trackY, 5, trackH);

        const thumbH = Math.max(28, Math.round((height / (height + maxScrollY)) * trackH));
        const thumbRatio = Math.max(0, Math.min(1, scrollY / maxScrollY));
        const thumbY = trackY + Math.round(thumbRatio * (trackH - thumbH));

        textContext.fillStyle = COLORS.p.fill;
        textContext.shadowColor = COLORS.p.glow;
        textContext.shadowBlur = 8;
        textContext.fillRect(trackX, thumbY, 5, thumbH);
        textContext.shadowBlur = 0;
      }
    }
  };

  const drawCursor = () => {
    const opts = getOptions();
    if (opts && opts.showLog === false) return;
    if (opts && opts.contentMode !== "zion") return; // Keep cursor strictly on boot log
    textContext.shadowColor = COLORS.p.glow;
    textContext.shadowBlur = fontSize * 0.42;
    textContext.fillStyle = "#bdf8d2";
    textContext.fillRect(caretX, caretY + fontSize * 0.06, Math.max(charWidth * 0.92, 4), fontSize * 0.96);
    textContext.shadowBlur = 0;
    textContext.fillRect(caretX, caretY + fontSize * 0.06, Math.max(charWidth * 0.92, 4), fontSize * 0.96);
  };

  const uploadTexture = () => {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textCanvas);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    textDirty = false;
  };

  const resize = () => {
    const bounds = host.getBoundingClientRect();
    cssWidth = Math.max(1, bounds.width);
    cssHeight = Math.max(1, bounds.height);
    const density = Math.min(typeof window === "undefined" ? 1 : window.devicePixelRatio || 1, 2);
    let nextWidth = Math.max(MIN_BUFFER_WIDTH, Math.round(Math.min(cssWidth * density, MAX_BUFFER_WIDTH))),
        nextHeight = Math.max(1, Math.round(nextWidth * cssHeight / cssWidth));
    if (nextWidth * nextHeight > MAX_BUFFER_PIXELS) {
      const fit = Math.sqrt(MAX_BUFFER_PIXELS / (nextWidth * nextHeight));
      nextWidth = Math.round(nextWidth * fit);
      nextHeight = Math.round(nextHeight * fit);
    }
    const surface = style.surface,
          screenWidth = surface.mode === "fixed" ? surface.width : surface.mode === "cap" ? Math.min(nextWidth, surface.width) : nextWidth,
          screenHeight = surface.mode === "fixed" ? surface.height : Math.max(1, Math.round(screenWidth * nextHeight / nextWidth));
    if (canvas.width !== nextWidth || canvas.height !== nextHeight) {
      canvas.width = nextWidth;
      canvas.height = nextHeight;
    }
    if (textCanvas.width !== screenWidth || textCanvas.height !== screenHeight) {
      textCanvas.width = screenWidth;
      textCanvas.height = screenHeight;
      width = screenWidth;
      height = screenHeight;
      layout();
      lastReveal = -1;
      lastBlink = -1;
      lastTextAt = 0;
      textDirty = true;
    }
    gl.useProgram(program);
    gl.viewport(0, 0, nextWidth, nextHeight);
    gl.uniform2f(uResolution, nextWidth, nextHeight);
    gl.uniform1f(uScan, Math.max(120, Math.min(cssHeight * style.scanDensity, 900)));
    gl.uniform1f(uTriad, Math.max(2, style.triadCss * nextWidth / cssWidth));
  };

  const maybeRedrawText = (now) => {
    const opts = getOptions();
    if (opts && opts.showLog === false) {
      if (textDirty) {
        drawScreen(0);
        textDirty = true;
      }
      return;
    }
    const isZion = opts && opts.contentMode === "zion";
    if (isZion) {
      const reveal = done ? Infinity : Math.floor(typed),
            blink = Math.floor((now - startedAt) / 420) % 2 === 0 ? 1 : 0,
            due = !done ? now - lastTextAt > 42 : blink !== lastBlink;
      if (reveal === lastReveal && blink === lastBlink && !due && !textDirty) return;
      if (!done && now - lastTextAt <= 42 && reveal === lastReveal && blink === lastBlink && !textDirty) return;
      drawScreen(reveal);
      if (blink) drawCursor();
      lastTextAt = now;
      lastReveal = reveal;
      lastBlink = blink;
      textDirty = true;
    } else {
      // In portfolio mode, immediately show full content and refresh when scroll changes
      drawScreen(Infinity);
      lastTextAt = now;
      textDirty = true;
    }
  };

  // --- Canvas Interaction Handlers (Scroll, Touch Drag & Click Hit-testing) ---
  function getCanvasCoords(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const normX = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const normY = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));
    return {
      x: normX * width,
      y: normY * height
    };
  }

  function findActionAt(clientX, clientY) {
    const { x, y } = getCanvasCoords(clientX, clientY);
    for (const r of clickableRegions) {
      if (x >= r.x1 && x <= r.x2 && y >= r.y1 && y <= r.y2) {
        return r;
      }
    }
    return null;
  }

  function executeAction(act, data) {
    if (!act) return;
    if (act.startsWith("jump-")) {
      const secKey = "sec-" + act.replace("jump-", "");
      if (sectionOffsets[secKey] != null) {
        targetScrollY = Math.max(0, Math.min(maxScrollY, sectionOffsets[secKey]));
        textDirty = true;
      }
    } else if (act.startsWith("star-")) {
      const target = act.replace("star-", "");
      const btn = document.querySelector(`[data-star-target="${target}"]`);
      if (btn) {
        btn.click();
      } else if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("open-star-modal", { detail: target }));
      }
    } else if (act === "open-cv") {
      const cvBtn = document.getElementById("viewCvModalBtn") || document.querySelector('[data-modal-target="cvModal"]');
      if (cvBtn) cvBtn.click();
      else window.open("src/CV_Alessandro_Altamirano_Salazar_2026.pdf", "_blank", "noreferrer");
    } else if (act === "open-linkedin") {
      const lnk = document.querySelector('a[href*="linkedin.com"]');
      if (lnk) window.open(lnk.href, "_blank", "noreferrer");
      else window.open("https://linkedin.com", "_blank", "noreferrer");
    } else if (act === "open-github") {
      const git = document.querySelector('a[href*="github.com"]');
      if (git) window.open(git.href, "_blank", "noreferrer");
      else window.open("https://github.com", "_blank", "noreferrer");
    } else if (act === "open-email") {
      const mail = document.querySelector('a[href^="mailto:"]');
      if (mail) window.location.href = mail.href;
      else window.location.href = "mailto:alessandro.altamirano@example.com";
    }
  }

  const onWheel = (e) => {
    const opts = getOptions();
    if (opts && opts.contentMode === "zion") return;
    if (maxScrollY <= 0) return;
    e.preventDefault();
    targetScrollY = Math.max(0, Math.min(maxScrollY, targetScrollY + e.deltaY * 0.95));
    textDirty = true;
  };

  const onPointerDown = (e) => {
    isDragging = true;
    hasDraggedFar = false;
    dragStartY = e.clientY;
    scrollStart = targetScrollY;
  };

  const onPointerMove = (e) => {
    if (isDragging) {
      const dy = dragStartY - e.clientY;
      if (Math.abs(dy) > 4) hasDraggedFar = true;
      targetScrollY = Math.max(0, Math.min(maxScrollY, scrollStart + dy * 1.4));
      textDirty = true;
    } else {
      const hit = findActionAt(e.clientX, e.clientY);
      canvas.style.cursor = hit ? "pointer" : "default";
    }
  };

  const onPointerUp = (e) => {
    if (isDragging && !hasDraggedFar) {
      const hit = findActionAt(e.clientX, e.clientY);
      if (hit) {
        executeAction(hit.action, hit.data);
      }
    }
    isDragging = false;
  };

  const onKeyDown = (e) => {
    const opts = getOptions();
    if (opts && opts.contentMode === "zion") return;
    if (maxScrollY <= 0) return;
    if (e.key === "ArrowDown") {
      targetScrollY = Math.min(maxScrollY, targetScrollY + 60);
      textDirty = true;
      e.preventDefault();
    } else if (e.key === "ArrowUp") {
      targetScrollY = Math.max(0, targetScrollY - 60);
      textDirty = true;
      e.preventDefault();
    } else if (e.key === "PageDown" || e.key === " ") {
      targetScrollY = Math.min(maxScrollY, targetScrollY + height * 0.75);
      textDirty = true;
      e.preventDefault();
    } else if (e.key === "PageUp") {
      targetScrollY = Math.max(0, targetScrollY - height * 0.75);
      textDirty = true;
      e.preventDefault();
    } else if (e.key === "Home") {
      targetScrollY = 0;
      textDirty = true;
      e.preventDefault();
    } else if (e.key === "End") {
      targetScrollY = maxScrollY;
      textDirty = true;
      e.preventDefault();
    }
  };

  canvas.addEventListener("wheel", onWheel, { passive: false });
  canvas.addEventListener("pointerdown", onPointerDown);
  window.addEventListener("pointermove", onPointerMove);
  window.addEventListener("pointerup", onPointerUp);
  window.addEventListener("keydown", onKeyDown);

  applyStyle();
  return {
    resize,
    scrollTo(y) {
      targetScrollY = Math.max(0, Math.min(maxScrollY, y));
      textDirty = true;
    },
    scrollToSection(secKey) {
      if (sectionOffsets[secKey] != null) {
        targetScrollY = Math.max(0, Math.min(maxScrollY, sectionOffsets[secKey]));
        textDirty = true;
      }
    },
    getScrollInfo() {
      return { scrollY, targetScrollY, maxScrollY };
    },
    render(now) {
      const options = getOptions(), requested = CRT_STYLES[options.variant] ? options.variant : "terminal";
      if (requested !== variant) {
        variant = requested;
        style = crtStyle(variant);
        applyStyle();
        typed = 0;
        done = false;
        lastReveal = -1;
        lastBlink = -1;
        lastTextAt = 0;
        resize();
      }

      // Smooth scroll lerp
      if (Math.abs(targetScrollY - scrollY) > 0.15) {
        scrollY += (targetScrollY - scrollY) * 0.24;
        textDirty = true;
      } else if (scrollY !== targetScrollY) {
        scrollY = targetScrollY;
        textDirty = true;
      }

      const seconds = (now - startedAt) * 0.001 * options.speed;
      if (variant === "terminal") {
        const isZion = options.contentMode === "zion";
        if (isZion) {
          if (!done) {
            typed += 4.4 * options.typeSpeed;
            if (typed >= TOTAL) { typed = TOTAL; done = true; }
          }
        }
        maybeRedrawText(now);
      } else if (now - lastTextAt >= style.redrawMs || textDirty) {
        CRT_SCREENS[variant](textContext, width, height, seconds);
        lastTextAt = now;
        textDirty = true;
      }

      if (textDirty) uploadTexture();
      gl.useProgram(program);
      gl.uniform1f(uTime, seconds);
      gl.uniform1f(uMotion, options.motion);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    },
    dispose() {
      canvas.removeEventListener("wheel", onWheel);
      canvas.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("keydown", onKeyDown);
      gl.deleteBuffer(buffer);
      gl.deleteTexture(texture);
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
    },
  };
}


  function mountThreeUiCrt(host, canvas, userOptions) {
    if (!host || !canvas) return null;
    let currentOptions = Object.assign({}, CRT_DEFAULTS, userOptions);
    let renderer = null;
    try {
      renderer = createCrtRenderer(host, canvas, () => currentOptions);
    } catch (e) {
      if (typeof console !== "undefined" && console.warn) {
        console.warn("WebGL CRT renderer initialization fallback:", e);
      }
      return null;
    }

    let frame = 0, visible = true, isPaused = false;
    const applyHostStyles = () => {
      host.className = `threeui-background crt crt-${currentOptions.variant}`;
      const styleObj = crtStyle(currentOptions.variant);
      if (styleObj && styleObj.background) {
        host.style.background = styleObj.background;
      }
      host.style.opacity = String(currentOptions.opacity != null ? currentOptions.opacity : 1);
      host.style.filter = `hue-rotate(${currentOptions.hue || 0}deg) saturate(${currentOptions.saturation != null ? currentOptions.saturation : 1}) brightness(${currentOptions.brightness != null ? currentOptions.brightness : 1})`;
    };

    const resize = () => {
      if (!renderer) return;
      renderer.resize();
      renderer.render(performance.now());
    };

    const tick = (now) => {
      if (!isPaused && visible && (typeof document === "undefined" || !document.hidden)) {
        renderer.render(now);
        frame = requestAnimationFrame(tick);
      } else {
        frame = 0;
      }
    };

    let resizeObserver = null;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(host);
    }

    let intersectionObserver = null;
    if (typeof IntersectionObserver !== "undefined") {
      intersectionObserver = new IntersectionObserver(([entry]) => {
        visible = entry ? entry.isIntersecting : true;
        if (visible && !frame && !isPaused) frame = requestAnimationFrame(tick);
        if (!visible && frame) {
          cancelAnimationFrame(frame);
          frame = 0;
        }
      });
      intersectionObserver.observe(host);
    }

    applyHostStyles();
    resize();
    frame = requestAnimationFrame(tick);

    return {
      renderer,
      update(newProps) {
        Object.assign(currentOptions, newProps);
        applyHostStyles();
        resize();
      },
      getOptions() {
        return Object.assign({}, currentOptions);
      },
      pause() {
        isPaused = true;
        if (frame) {
          cancelAnimationFrame(frame);
          frame = 0;
        }
      },
      resume() {
        if (!isPaused) return;
        isPaused = false;
        if (!frame) frame = requestAnimationFrame(tick);
      },
      dispose() {
        if (frame) cancelAnimationFrame(frame);
        if (resizeObserver) resizeObserver.disconnect();
        if (intersectionObserver) intersectionObserver.disconnect();
        if (renderer) renderer.dispose();
      },
      scrollTo(y) {
        if (renderer && renderer.scrollTo) renderer.scrollTo(y);
      },
      scrollToSection(secKey) {
        if (renderer && renderer.scrollToSection) renderer.scrollToSection(secKey);
      },
      getScrollInfo() {
        return renderer && renderer.getScrollInfo ? renderer.getScrollInfo() : { scrollY: 0, targetScrollY: 0, maxScrollY: 0 };
      }
    };
  }

  global.createCrtRenderer = createCrtRenderer;
  global.mountThreeUiCrt = mountThreeUiCrt;
  global.CRT_DEFAULTS = CRT_DEFAULTS;
  global.CRT_STYLES = CRT_STYLES;
  global.CRT_VARIANTS = CRT_VARIANTS;
  global.crtStyle = crtStyle;
})(typeof window !== "undefined" ? window : globalThis);
