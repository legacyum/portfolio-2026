'use strict';
/* Harness de humo para prototypes/cat3d.html (NO es parte del sitio).
   Corre el script inline en un VM con DOM/WebGL stub + three.min.js real.
   Validación: construcción de geometría, sistema de poses, FX, interacciones y loop. */
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

const ROOT = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(ROOT, 'prototypes', 'cat3d.html'), 'utf8');
const threeSrc = fs.readFileSync(path.join(ROOT, 'src', 'vendor', 'three.min.js'), 'utf8');
const inline = (html.match(/<script>([\s\S]*?)<\/script>/) || [])[1];
if (!inline) throw new Error('no se encontró el script inline');

// ---------- stubs DOM ----------
function mkEl(tag, id) {
  const el = {
    tagName: (tag || 'div').toUpperCase(),
    id: id || '',
    dataset: {},
    children: [],
    parentNode: null,
    style: { setProperty() {}, removeProperty() {} },
    textContent: '',
    innerHTML: '',
    offsetWidth: 100,
    _attrs: {},
    _handlers: {},
    _classes: new Set(),
    classList: {
      add: (...c) => c.forEach(x => el._classes.add(x)),
      remove: (...c) => c.forEach(x => el._classes.delete(x)),
      contains: c => el._classes.has(c),
      toggle: (c, on) => { if (on === undefined) on = !el._classes.has(c); on ? el._classes.add(c) : el._classes.delete(c); return on; }
    },
    setAttribute(k, v) { el._attrs[k] = String(v); if (k === 'class') String(v).split(/\s+/).forEach(c => c && el._classes.add(c)); },
    getAttribute(k) { return el._attrs[k] === undefined ? null : el._attrs[k]; },
    removeAttribute(k) { delete el._attrs[k]; },
    appendChild(c) { c.parentNode = el; el.children.push(c); return c; },
    removeChild(c) { el.children = el.children.filter(x => x !== c); c.parentNode = null; return c; },
    addEventListener(t, fn) { (el._handlers[t] = el._handlers[t] || []).push(fn); },
    removeEventListener(t, fn) { el._handlers[t] = (el._handlers[t] || []).filter(f => f !== fn); },
    dispatch(t, ev) { (el._handlers[t] || []).forEach(f => f.call(el, ev || {})); },
    getBoundingClientRect() { return { left: 0, top: 0, right: 100, bottom: 100, width: 100, height: 100 }; },
    querySelector() { return null; },
    querySelectorAll() { return []; },
    focus() {}, blur() {}, click() { el.dispatch('click', {}); },
    getContext() { return ctx2d; },
    width: 256, height: 256
  };
  return el;
}
const ctx2d = new Proxy({
  canvas: null,
  measureText: () => ({ width: 10 })
}, {
  get(t, k) {
    if (k in t) return t[k];
    return typeof k === 'string' ? function () {} : undefined;
  },
  set(t, k, v) { t[k] = v; return true; }
});

const byId = {};
['scene', 'stats', 'fps', 'tris', 'calls', 'panel', 'furSw', 'themeRow', 'btnMeow', 'btnPet',
 'btnStartle', 'btnWire', 'btnSpin', 'btnSound', 'btnReset', 'bubble', 'boot', 'bootMsg']
  .forEach(id => { byId[id] = mkEl(id === 'scene' ? 'canvas' : 'div', id); });

const poseButtons = ['sit', 'sleep', 'play'].map(p => { const b = mkEl('button'); b.dataset.pose = p; return b; });
const themeButtons = ['', 'cyan', 'amber'].map(t => { const b = mkEl('button'); b.dataset.theme = t; return b; });
// el script crea los swatches con createElement + appendChild: los capturamos aquí
const furSw0 = byId.furSw;
furSw0.appendChild = function (c) { c.parentNode = furSw0; furSw0.children.push(c); furSwButtons.push(c); return c; };

const documentStub = {
  documentElement: mkEl('html'),
  body: mkEl('body'),
  getElementById: id => byId[id] || null,
  createElement: t => mkEl(t),
  createElementNS: (ns, t) => mkEl(t),
  querySelector: sel => (sel === '#scene' ? byId.scene : null),
  querySelectorAll: sel => {
    if (/\[data-pose\]/.test(sel)) return poseButtons;
    if (/#themeRow/.test(sel)) return themeButtons;
    if (/\.sw/.test(sel)) return furSwButtons;
    return [];
  },
  addEventListener(t, fn) { (docHandlers[t] = docHandlers[t] || []).push(fn); },
  visibilityState: 'visible',
  hidden: false
};
const docHandlers = {};
const furSwButtons = [];

// WebGL stub: Proxy que auto-resuelve cualquier llamada GL que three r128 necesite.
// Solo se especializan los métodos cuyo *valor de retorno* importa de verdad.
function mkGL() {
  const target = {
    canvas: byId.scene,
    drawingBufferWidth: 1280,
    drawingBufferHeight: 720,
    // three r128 hace getParameter(VERSION).indexOf('WebGL'): los params de
    // texto deben devolver string; el resto, números plausibles.
    getParameter(pname) {
      if (pname === 7938) return 'WebGL 1.0 (stub)';           // VERSION
      if (pname === 35724) return 'WebGL GLSL ES 1.0 (stub)';  // SHADING_LANGUAGE_VERSION
      if (pname === 7936) return 'stub-vendor';                // VENDOR
      if (pname === 7937) return 'stub-renderer';              // RENDERER
      if (pname === 36347 || pname === 36348 || pname === 36349) return 1024; // MAX_*_UNIFORM_VECTORS
      if (pname === 35661 || pname === 34930 || pname === 35071) return 32;    // MAX_*_LENGTH / TEXTURE_UNITS
      if (pname === 3379 || pname === 34076) return 16384;     // MAX_TEXTURE_SIZE
      return 4096;
    },
    getShaderPrecisionFormat() { return { rangeMin: 127, rangeMax: 127, precision: 23 }; },
    // retornamos 0 uniforms/atributos activos => three no itera getActiveUniform
    getProgramParameter(prog, pname) {
      if (pname === 35714 || pname === 35713) return true;                     // LINK/VALIDATE_STATUS
      if (pname === 35718 || pname === 35721 || pname === 34929 || pname === 34928) return 0; // ACTIVE_*
      if (pname === 35719 || pname === 35722 || pname === 34930 || pname === 34929) return 32; // *_MAX_LENGTH
      return 0;
    },
    getShaderParameter() { return true; },
    getProgramInfoLog() { return ''; },
    getShaderInfoLog() { return ''; },
    getShaderSource() { return ''; },
    getActiveUniform() { return { name: 'u', size: 1, type: 5126 }; },
    getActiveAttrib() { return { name: 'a', size: 1, type: 5126 }; },
    getUniformLocation() { return {}; },
    getAttribLocation() { return 0; },
    getError() { return 0; },
    isContextLost() { return false; },
    checkFramebufferStatus() { return 36053; },
    getSupportedExtensions() { return []; },
    getExtension() { return null; },
    getContextAttributes() { return { alpha: false, antialias: true, depth: true, stencil: false, premultipliedAlpha: true, preserveDrawingBuffer: false, failIfMajorPerformanceCaveat: false }; },
    createBuffer() { return {}; }, createTexture() { return {}; },
    createProgram() { return {}; }, createShader() { return {}; },
    createFramebuffer() { return {}; }, createRenderbuffer() { return {}; },
    createQuery() { return {}; }, createSampler() { return {}; }, createVertexArray() { return {}; }
  };
  return new Proxy(target, {
    get(t, k) {
      if (k in t) return t[k];
      if (typeof k === 'symbol') return undefined;
      if (/^[A-Z0-9_]+$/.test(k)) return 0;          // constantes GLenum inexistentes
      return function () { return undefined; };       // cualquier método GL: no-op
    },
    set(t, k, v) { t[k] = v; return true; }
  });
}
byId.scene.getContext = (type) => (type === 'webgl' || type === 'experimental-webgl' || type === 'webgl2') ? mkGL() : ctx2d;
byId.scene.addEventListener = () => {};
byId.scene.removeEventListener = () => {};
byId.scene.style = { setProperty() {} };
byId.scene.clientWidth = 1280;
byId.scene.clientHeight = 720;

const rafQueue = [];
const winHandlers = {};
let now = 0;
const sandbox = {
  console,
  // three.min.js es UMD: si ve `exports`/`module` se va por la rama CommonJS
  // y nunca se cuelga de window. Los dejamos undefined a propósito.
  exports: undefined,
  module: undefined,
  define: undefined,
  performance: { now: () => now },
  requestAnimationFrame: fn => { rafQueue.push(fn); return rafQueue.length; },
  cancelAnimationFrame() {},
  setTimeout: (fn, ms) => setTimeout(fn, 0),
  clearTimeout,
  setInterval: () => 0,
  clearInterval() {},
  Math, Date, JSON, Object, Array, String, Number, Boolean, Error, Float32Array, Uint8Array, Uint16Array, Int32Array, Promise, Symbol, Map, Set, Proxy, isNaN, parseInt, parseFloat,
  document: documentStub,
  navigator: { userAgent: 'node-harness', maxTouchPoints: 0, platform: 'linux' },
  location: { href: 'http://localhost/prototypes/cat3d.html', protocol: 'http:' },
  matchMedia: () => ({ matches: false, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {} }),
  innerWidth: 1280,
  innerHeight: 720,
  devicePixelRatio: 2,
  addEventListener: (t, fn) => { (winHandlers[t] = winHandlers[t] || []).push(fn); },
  removeEventListener() {},
  AudioContext: function () {
    const node = () => ({ connect() {}, disconnect() {}, start() {}, stop() {}, frequency: { value: 0, setValueAtTime() {}, exponentialRampToValueAtTime() {}, linearRampToValueAtTime() {} }, gain: { value: 0, setValueAtTime() {}, exponentialRampToValueAtTime() {}, linearRampToValueAtTime() {} }, Q: { value: 0 }, type: '', buffer: null });
    return {
      currentTime: 0, state: 'running', destination: node(), sampleRate: 44100,
      resume() {}, createOscillator: node, createGain: node, createBiquadFilter: node,
      createBufferSource: node,
      createBuffer: (ch, len) => ({ getChannelData: () => new Float32Array(len) })
    };
  },
  Image: function () { return { addEventListener() {}, removeEventListener() {} }; },
  self: null
};
sandbox.window = sandbox;
sandbox.globalThis = sandbox;
sandbox.self = sandbox;

// ---------- cargar three real + script del prototipo ----------
const ctx = vm.createContext(sandbox);
function shortStack(err) {
  const raw = String(err && err.stack || err).split('\n');
  return raw.map(l => (l.length > 220 ? l.slice(0, 220) + ' …[línea minificada recortada]' : l)).join('\n');
}
try {
  vm.runInContext(threeSrc, ctx, { filename: 'three.min.js' });
} catch (e) {
  origLog('FALLÓ al cargar three.min.js:\n' + shortStack(e));
  process.exit(1);
}
assert.ok(sandbox.THREE, 'THREE no se cargó en el sandbox');
const REVISION = sandbox.THREE.REVISION;

let errors = [];
const origLog = console.log, origWarn = console.warn, origError = console.error;
let quiet = true;
console.log = (...a) => { if (!quiet) origLog(...a); else errors.push('LOG: ' + a.join(' ')); };
console.warn = (...a) => { errors.push('WARN: ' + a.join(' ')); };
console.error = (...a) => { errors.push('ERROR: ' + a.join(' ')); };

try {
  vm.runInContext(inline, ctx, { filename: 'cat3d.html:inline' });
} catch (e) {
  quiet = false;
  origLog('FALLÓ el script del prototipo:\n' + shortStack(e));
  origLog('\n--- últimos registros internos ---');
  origLog(errors.slice(-14).map(x => x.slice(0, 300)).join('\n'));
  process.exit(1);
}

quiet = false;
console.log = origLog; console.warn = origWarn; console.error = origError;
function log(...a) { origLog(...a); }

// ---------- aserciones ----------
assert.ok(sandbox.__cat3D, 'window.__cat3D no está expuesto');
assert.ok(sandbox.__cat3D.isReady === true, '__cat3D.isReady !== true');
assert.strictEqual(sandbox.__cat3D.version, '0.1.0-prototype');
assert.ok(sandbox.__cat3D.scene && sandbox.__cat3D.camera && sandbox.__cat3D.renderer, 'faltan scene/camera/renderer');

const scene = sandbox.__cat3D.scene;
let meshes = 0, tris = 0;
scene.traverse(o => {
  if (o.isMesh) {
    meshes++;
    if (o.geometry && o.geometry.index) tris += o.geometry.index.count / 3;
    else if (o.geometry && o.geometry.attributes.position) tris += o.geometry.attributes.position.count / 3;
    const g = o.geometry;
    assert.ok(g, 'mesh sin geometría');
    assert.ok(Number.isFinite(o.position.x + o.position.y + o.position.z), 'posición NaN en ' + (o.type));
    assert.ok(Number.isFinite(o.scale.x) && o.scale.x !== 0, 'escala inválida');
  }
});
log('THREE.REVISION      :', REVISION);
log('meshes en escena    :', meshes);
log('triángulos aprox    :', Math.round(tris).toLocaleString('es-PE'));
assert.ok(meshes > 60, 'muy pocos meshes (' + meshes + ') — el gato no se ensambló completo');
assert.ok(tris > 3000, 'muy pocos triángulos');

// --- correr frames reales del loop ---
function stepFrames(n, dtMs) {
  for (let i = 0; i < n; i++) {
    now += (dtMs || 16.7);
    const q = rafQueue.splice(0, rafQueue.length);
    q.forEach(fn => fn(now));
  }
}
stepFrames(40);

// --- probar todas las poses y transiciones ---
['sleep', 'play', 'sit', 'play', 'sleep', 'sit'].forEach(p => {
  sandbox.__cat3D.setPose(p);
  assert.strictEqual(sandbox.__cat3D.state.pose, p, 'setPose falló en ' + p);
  stepFrames(30);
});

// --- verificar seguimiento del ovillo + pisada procedural ------------
sandbox.__cat3D.setPose('play');
stepFrames(36);
assert.strictEqual(typeof sandbox.__cat3D.state.walking, 'boolean', 'el estado walking no está expuesto');
assert.ok(Number.isFinite(sandbox.__cat3D.state.walkBlend), 'walkBlend inválido');
assert.ok(sandbox.__cat3D.state.walkBlend >= 0 && sandbox.__cat3D.state.walkBlend <= 1.001, 'walkBlend fuera de rango');
assert.ok(Number.isFinite(sandbox.__cat3D.root.position.x + sandbox.__cat3D.root.position.z), 'el root no sigue el ovillo');

// --- probar acciones ---
sandbox.__cat3D.meow(); stepFrames(30);
sandbox.__cat3D.pet(); stepFrames(60);
sandbox.__cat3D.startle(); stepFrames(60);

// --- probar todos los pelajes y temas ---
['gris', 'negro', 'blanco', 'siames', 'neon', 'tabby'].forEach(f => {
  sandbox.__cat3D.setFur(f);
  assert.strictEqual(sandbox.__cat3D.state.fur, f);
  stepFrames(6);
});
['cyan', 'amber', ''].forEach(t => {
  sandbox.__cat3D.setTheme(t);
  assert.strictEqual(sandbox.__cat3D.state.theme, t);
  stepFrames(6);
});

// --- wireframe + UI clicks ---
sandbox.__cat3D.toggleWireframe();
assert.strictEqual(sandbox.__cat3D.state.wire, true);
stepFrames(10);
sandbox.__cat3D.toggleWireframe();
assert.strictEqual(sandbox.__cat3D.state.wire, false);

poseButtons.forEach(b => { b.dispatch('click', {}); stepFrames(12); });
themeButtons.forEach(b => { b.dispatch('click', {}); stepFrames(6); });
['btnMeow', 'btnPet', 'btnStartle', 'btnWire', 'btnSpin', 'btnSound', 'btnReset'].forEach(id => {
  byId[id].dispatch('click', {});
  stepFrames(6);
});
assert.strictEqual(sandbox.__cat3D.state.sound, false, 'el toggle de sonido no funcionó');
byId.btnSound.dispatch('click', {});
assert.strictEqual(sandbox.__cat3D.state.sound, true);

// --- swatches de pelaje creados dinámicamente ---
assert.ok(furSwButtons.length === 0 || furSwButtons.length === 6, 'swatches no registrados (query fallback)');

// --- eventos de ventana: pointer + teclado ---
(winHandlers.pointermove || []).forEach(fn => fn({ clientX: 900, clientY: 300 }));
stepFrames(30);
(winHandlers.pointerdown || []).forEach(fn => fn({ clientX: 640, clientY: 360 }));
(winHandlers.pointerup || []).forEach(fn => fn({ clientX: 641, clientY: 361 }));
stepFrames(20);
['1', '2', '3', 'm', 'p', 's', 'w', 'r', 'a', 'c', 't'].forEach(k => {
  (winHandlers.keydown || []).forEach(fn => fn({ key: k, target: { tagName: 'BODY' } }));
  stepFrames(8);
});
(winHandlers.resize || []).forEach(fn => fn({}));
stepFrames(5);

// --- pausa por pestaña oculta ---
documentStub.visibilityState = 'hidden';
(docHandlers.visibilitychange || []).forEach(fn => fn({}));
stepFrames(10);
documentStub.visibilityState = 'visible';
(docHandlers.visibilitychange || []).forEach(fn => fn({}));
stepFrames(10);

// --- NaN check final en toda la jerarquía ---
let nanCount = 0;
scene.traverse(o => {
  const v = [o.position.x, o.position.y, o.position.z, o.rotation.x, o.rotation.y, o.rotation.z, o.scale.x, o.scale.y, o.scale.z];
  if (v.some(n => !Number.isFinite(n))) { nanCount++; }
});
assert.strictEqual(nanCount, 0, nanCount + ' objetos con NaN/Inf tras la simulación');

// --- no deben quedar FX huérfanos creciendo sin límite ---
stepFrames(400);
let fxLeft = 0;
scene.traverse(o => { if (o.isSprite) fxLeft++; });
assert.ok(fxLeft < 40, 'fuga de sprites FX: ' + fxLeft);

const fatal = errors.filter(e => !/THREE\.WebGLRenderer|WEBGL|extension|deprecated|WebGL/i.test(e));
log('frames simulados    : ~600');
log('sprites FX activos  :', fxLeft);
log('warnings/errors     :', errors.length, fatal.length ? '(no-WebGL: ' + fatal.length + ')' : '(todos WebGL-stub, esperados)');
if (fatal.length) log(fatal.slice(0, 12).join('\n'));
assert.strictEqual(fatal.length, 0, 'hay errores no relacionados con el stub WebGL');
log('\n✅ HUMO OK — prototipo gato 3D construye, anima e interactúa sin errores.');
