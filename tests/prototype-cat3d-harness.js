'use strict';
/* Sandbox compartido para prototypes/cat3d.html (NO es parte del sitio publicado).
   Ejecuta el <script> inline del prototipo dentro de un vm.createContext con DOM y
   WebGL stub + el three.min.js REAL del repo (src/vendor, r128).

   Lo usan:
     - tests/prototype-cat3d-smoke.js   → aserciones de humo
     - tests/prototype-cat3d-render.js  → rasterizador por software (PNG sin GPU)

   Solo Node stdlib (fs, path, vm). */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');

function createCatSandbox(opts) {
  opts = opts || {};
  const html = fs.readFileSync(path.join(ROOT, 'prototypes', 'cat3d.html'), 'utf8');
  const threeSrc = fs.readFileSync(path.join(ROOT, 'src', 'vendor', 'three.min.js'), 'utf8');
  const orbitSrc = fs.readFileSync(path.join(ROOT, 'src', 'vendor', 'OrbitControls.js'), 'utf8');
  const inline = (html.match(/<script>([\s\S]*?)<\/script>/) || [])[1];
  if (!inline) throw new Error('no se encontró el script inline en prototypes/cat3d.html');

  // ---------- stubs DOM ----------
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

  const byId = {};
  ['scene', 'stats', 'fps', 'tris', 'calls', 'speed', 'panel', 'furSw', 'themeRow', 'asciiRow', 'asciiCell', 'btnMeow', 'btnPet',
   'btnStartle', 'btnHome', 'btnWire', 'btnSpin', 'btnSound', 'btnReset', 'bubble', 'boot', 'bootMsg']
    .forEach(id => { byId[id] = mkEl(id === 'scene' ? 'canvas' : 'div', id); });

  const poseButtons = ['sit', 'sleep', 'play', 'walk'].map(p => { const b = mkEl('button'); b.dataset.pose = p; return b; });
  const themeButtons = ['', 'cyan', 'amber'].map(t => { const b = mkEl('button'); b.dataset.theme = t; return b; });
  const asciiButtons = ['ascii', 'hybrid', 'off'].map(m => { const b = mkEl('button'); b.dataset.ascii = m; return b; });
  const furSwButtons = [];
  // el script crea los swatches con createElement + appendChild: los capturamos aquí
  const furSw0 = byId.furSw;
  furSw0.appendChild = function (c) { c.parentNode = furSw0; furSw0.children.push(c); furSwButtons.push(c); return c; };

  const docHandlers = {};
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
      if (/#asciiRow/.test(sel)) return asciiButtons;
      if (/\.sw/.test(sel)) return furSwButtons;
      return [];
    },
    addEventListener(t, fn) { (docHandlers[t] = docHandlers[t] || []).push(fn); },
    visibilityState: 'visible',
    hidden: false
  };

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
  byId.scene.ownerDocument = documentStub;   // OrbitControls escucha pointermove/up en ownerDocument
  byId.scene.style = { setProperty() {} };
  byId.asciiCell.value = '9';
  byId.scene.clientWidth = 1280;
  byId.scene.clientHeight = 720;

  const rafQueue = [];
  const winHandlers = {};
  let now = 0;
  const reducedMotion = !!opts.reducedMotion;
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
    Math, Date, JSON, Object, Array, String, Number, Boolean, Error, Float32Array, Float64Array, Uint8Array, Uint16Array, Uint32Array, Int32Array, Promise, Symbol, Map, Set, Proxy, isNaN, parseInt, parseFloat,
    document: documentStub,
    navigator: { userAgent: 'node-harness', maxTouchPoints: 0, platform: 'linux' },
    location: { href: 'http://localhost/prototypes/cat3d.html', protocol: 'http:' },
    matchMedia: (q) => ({ matches: reducedMotion && /reduce/.test(q), addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {} }),
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
  vm.runInContext(threeSrc, ctx, { filename: 'three.min.js' });
  if (!sandbox.THREE) throw new Error('THREE no se cargó en el sandbox');
  if (opts.orbitControls !== false) {
    vm.runInContext(orbitSrc, ctx, { filename: 'OrbitControls.js' });
    if (!sandbox.THREE.OrbitControls) throw new Error('OrbitControls no se cargó en el sandbox');
  }

  // Captura de consola durante la carga del prototipo (three avisa por el stub GL).
  const errors = [];
  const origLog = console.log, origWarn = console.warn, origError = console.error;
  console.log = (...a) => { errors.push('LOG: ' + a.join(' ')); };
  console.warn = (...a) => { errors.push('WARN: ' + a.join(' ')); };
  console.error = (...a) => { errors.push('ERROR: ' + a.join(' ')); };
  try {
    vm.runInContext(inline, ctx, { filename: 'cat3d.html:inline' });
  } catch (e) {
    console.log = origLog; console.warn = origWarn; console.error = origError;
    const err = new Error('FALLÓ el script del prototipo:\n' + shortStack(e) +
      '\n\n--- últimos registros internos ---\n' + errors.slice(-14).map(x => x.slice(0, 300)).join('\n'));
    err.inner = e;
    throw err;
  }
  console.log = origLog; console.warn = origWarn; console.error = origError;

  // Corre n frames reales del loop (rAF) con un dt fijo (ms).
  function stepFrames(n, dtMs) {
    for (let i = 0; i < n; i++) {
      now += (dtMs || 16.7);
      const q = rafQueue.splice(0, rafQueue.length);
      q.forEach(fn => fn(now));
    }
  }

  return {
    sandbox, ctx, byId, poseButtons, themeButtons, asciiButtons, furSwButtons,
    documentStub, docHandlers, winHandlers, rafQueue, errors, stepFrames, shortStack,
    THREE: sandbox.THREE, REVISION: sandbox.THREE.REVISION,
    now: () => now
  };
}

module.exports = { createCatSandbox, ROOT };
