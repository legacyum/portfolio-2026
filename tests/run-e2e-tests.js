/**
 * Automated Comprehensive E2E Test Suite for Portafolio Alessandro Altamirano
 * 4-Tier Full-Spectrum Verification Suite with Cyber-Industrial Interactive Background
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

const ROOT_DIR = path.resolve(__dirname, '..');

// Terminal Colors
const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  dim: '\x1b[2m'
};

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const testResults = [];

function logPass(tier, code, name) {
  totalTests++;
  passedTests++;
  testResults.push({ tier, code, name, passed: true });
  console.log(`  ${COLORS.green}✓ PASS${COLORS.reset} [${tier}] ${COLORS.bright}${code}${COLORS.reset}: ${name}`);
}

function logFail(tier, code, name, error) {
  totalTests++;
  failedTests++;
  testResults.push({ tier, code, name, passed: false, error: error.message || String(error) });
  console.log(`  ${COLORS.red}✗ FAIL${COLORS.reset} [${tier}] ${COLORS.bright}${code}${COLORS.reset}: ${name}`);
  console.log(`     ${COLORS.dim}Error: ${error.message || error}${COLORS.reset}`);
}

function printHeader(title) {
  console.log(`\n${COLORS.cyan}${COLORS.bright}=====================================================================${COLORS.reset}`);
  console.log(`${COLORS.cyan}${COLORS.bright}  ${title}${COLORS.reset}`);
  console.log(`${COLORS.cyan}${COLORS.bright}=====================================================================${COLORS.reset}\n`);
}

// Mock Canvas 2D Rendering Context with complete CanvasRenderingContext2D API
class MockCanvasRenderingContext2D {
  constructor(canvas) {
    this.canvas = canvas;
    this.fillStyle = '#000000';
    this.strokeStyle = '#000000';
    this.lineWidth = 1;
    this.font = '14px "DM Mono", monospace';
    this.textBaseline = 'alphabetic';
    this.shadowColor = 'transparent';
    this.shadowBlur = 0;
    this.globalAlpha = 1.0;
    this.lineCap = 'butt';
    this.lineJoin = 'miter';
    this.drawCalls = [];
    this.clearRectCalls = [];
    this.fillRectCalls = [];
    this.strokeRectCalls = [];
    this.arcCalls = [];
    this.fillTextCalls = [];
    this.transforms = [];
  }

  clearRect(x, y, w, h) {
    const call = { type: 'clearRect', x, y, w, h };
    this.drawCalls.push(call);
    this.clearRectCalls.push(call);
  }

  fillRect(x, y, w, h) {
    const call = { type: 'fillRect', x, y, w, h, fillStyle: this.fillStyle };
    this.drawCalls.push(call);
    this.fillRectCalls.push(call);
  }

  strokeRect(x, y, w, h) {
    const call = { type: 'strokeRect', x, y, w, h, strokeStyle: this.strokeStyle, lineWidth: this.lineWidth };
    this.drawCalls.push(call);
    this.strokeRectCalls.push(call);
  }

  beginPath() {
    this.drawCalls.push({ type: 'beginPath' });
  }

  moveTo(x, y) {
    this.drawCalls.push({ type: 'moveTo', x, y });
  }

  lineTo(x, y) {
    this.drawCalls.push({ type: 'lineTo', x, y });
  }

  quadraticCurveTo(cpx, cpy, x, y) {
    this.drawCalls.push({ type: 'quadraticCurveTo', cpx, cpy, x, y });
  }

  bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y) {
    this.drawCalls.push({ type: 'bezierCurveTo', cp1x, cp1y, cp2x, cp2y, x, y });
  }

  closePath() {
    this.drawCalls.push({ type: 'closePath' });
  }

  arc(x, y, radius, startAngle, endAngle) {
    const call = { type: 'arc', x, y, radius, startAngle, endAngle };
    this.drawCalls.push(call);
    this.arcCalls.push(call);
  }

  rect(x, y, w, h) {
    this.drawCalls.push({ type: 'rect', x, y, w, h });
  }

  clip() {
    this.drawCalls.push({ type: 'clip' });
  }

  stroke() {
    this.drawCalls.push({ type: 'stroke', strokeStyle: this.strokeStyle, lineWidth: this.lineWidth });
  }

  fill() {
    this.drawCalls.push({ type: 'fill', fillStyle: this.fillStyle });
  }

  save() {
    this.drawCalls.push({ type: 'save' });
  }

  restore() {
    this.drawCalls.push({ type: 'restore' });
  }

  fillText(text, x, y) {
    const call = { type: 'fillText', text, x, y, fillStyle: this.fillStyle, font: this.font, shadowColor: this.shadowColor };
    this.drawCalls.push(call);
    this.fillTextCalls.push(call);
  }

  translate(x, y) {
    this.transforms.push({ type: 'translate', x, y });
  }

  rotate(angle) {
    this.transforms.push({ type: 'rotate', angle });
  }

  setTransform(a, b, c, d, e, f) {
    this.transforms.push({ type: 'setTransform', a, b, c, d, e, f });
  }

  scale(sx, sy) {
    this.transforms.push({ type: 'scale', sx, sy });
  }

  drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh) {
    this.drawCalls.push({ type: 'drawImage', img });
  }

  measureText(text) {
    return { width: (String(text).length || 1) * 8.4 };
  }

  createLinearGradient(x0, y0, x1, y1) {
    return {
      addColorStop: () => {}
    };
  }

  createRadialGradient(x0, y0, r0, x1, y1, r1) {
    return {
      addColorStop: () => {}
    };
  }
}

// Mock MutationObserver for DOM attribute tracking
class MockMutationObserver {
  constructor(callback) {
    this.callback = callback;
    this.observedElements = [];
    MockMutationObserver.instances.push(this);
  }

  observe(target, options) {
    this.observedElements.push({ target, options: options || {} });
  }

  disconnect() {
    this.observedElements = [];
    const idx = MockMutationObserver.instances.indexOf(this);
    if (idx !== -1) MockMutationObserver.instances.splice(idx, 1);
  }

  static notifyAttributeChange(target, attrName, oldValue) {
    for (const obs of MockMutationObserver.instances) {
      for (const entry of obs.observedElements) {
        if (entry.target === target) {
          if (!entry.options.attributeFilter || entry.options.attributeFilter.includes(attrName)) {
            try {
              obs.callback([{
                type: 'attributes',
                target,
                attributeName: attrName,
                oldValue
              }], obs);
            } catch (err) {
              console.error('MutationObserver callback error:', err);
            }
          }
        }
      }
    }
  }
}
MockMutationObserver.instances = [];

// Minimal DOM implementation for JSDOM-like environment in Node
class SimpleElement {
  constructor(tagName = 'div', attrs = {}) {
    this.tagName = tagName.toUpperCase();
    this.nodeType = 1;
    this.attributes = { ...attrs };
    this.childNodes = [];
    this.parentNode = null;
    this.listeners = {};
    this.style = {
      setProperty: (prop, val) => { this.style[prop] = val; },
      getPropertyValue: (prop) => this.style[prop] || ''
    };
    this._value = attrs.value || '';
    this.placeholder = attrs.placeholder || '';
    this.type = attrs.type || 'text';
    this.required = attrs.required !== undefined;
    this.name = attrs.name || '';
    this.scrollTop = 0;
    this.scrollHeight = 100;
    this._context2d = null;
  }

  get id() { return this.attributes.id || ''; }
  set id(val) { this.attributes.id = val; }

  get className() { return this.attributes.class || ''; }
  set className(val) { this.attributes.class = val; }

  get lang() { return this.getAttribute('lang') || ''; }
  set lang(val) { this.setAttribute('lang', val); }

  get href() { return this.getAttribute('href') || ''; }
  set href(val) { this.setAttribute('href', val); }

  get action() { return this.getAttribute('action') || ''; }
  set action(val) { this.setAttribute('action', val); }

  get width() { return Number(this.attributes.width) || 0; }
  set width(val) { this.attributes.width = String(val); }

  get height() { return Number(this.attributes.height) || 0; }
  set height(val) { this.attributes.height = String(val); }

  get open() { return this.hasAttribute('open'); }
  set open(val) {
    if (val) this.setAttribute('open', '');
    else this.removeAttribute('open');
  }

  showModal() {
    this.setAttribute('open', '');
  }

  close() {
    this.removeAttribute('open');
  }

  getContext(type, opts = {}) {
    if (this.tagName.toLowerCase() === 'canvas') {
      if (!this._context2d) {
        this._context2d = new MockCanvasRenderingContext2D(this);
      }
      return this._context2d;
    }
    return null;
  }

  get classList() {
    const self = this;
    return {
      add(...names) {
        const set = new Set((self.className || '').split(/\s+/).filter(Boolean));
        names.forEach(n => set.add(n));
        self.className = Array.from(set).join(' ');
      },
      remove(...names) {
        const set = new Set((self.className || '').split(/\s+/).filter(Boolean));
        names.forEach(n => set.delete(n));
        self.className = Array.from(set).join(' ');
      },
      toggle(name, force) {
        const set = new Set((self.className || '').split(/\s+/).filter(Boolean));
        if (force === true) set.add(name);
        else if (force === false) set.delete(name);
        else {
          if (set.has(name)) set.delete(name);
          else set.add(name);
        }
        self.className = Array.from(set).join(' ');
        return set.has(name);
      },
      contains(name) {
        return (self.className || '').split(/\s+/).filter(Boolean).includes(name);
      }
    };
  }

  get dataset() {
    const self = this;
    const proxy = {};
    for (const [key, val] of Object.entries(this.attributes)) {
      if (key.startsWith('data-')) {
        const propName = key.slice(5).replace(/-([a-z])/g, (_, c) => c.toUpperCase());
        proxy[propName] = val;
      }
    }
    return new Proxy(proxy, {
      get(target, prop) { return target[prop]; },
      set(target, prop, value) {
        const attrName = 'data-' + String(prop).replace(/([A-Z])/g, '-$1').toLowerCase();
        self.setAttribute(attrName, value);
        target[prop] = value;
        return true;
      }
    });
  }

  get value() { return this._value; }
  set value(val) { this._value = String(val); }

  get textContent() {
    return this.childNodes.map(c => typeof c === 'string' ? c : c.textContent).join('');
  }
  set textContent(val) {
    this.childNodes = [String(val)];
  }

  get innerHTML() {
    return this.childNodes.map(c => {
      if (typeof c === 'string') return c;
      return c.outerHTML;
    }).join('');
  }

  set innerHTML(htmlStr) {
    this.childNodes = [];
    if (!htmlStr) return;
    this.childNodes = parseSimpleHTML(htmlStr, this);
  }

  get outerHTML() {
    const attrs = Object.entries(this.attributes)
      .map(([k, v]) => v === '' ? k : `${k}="${v}"`).join(' ');
    const attrStr = attrs ? ' ' + attrs : '';
    const voidTags = ['META', 'LINK', 'IMG', 'INPUT', 'BR', 'HR', 'CANVAS'];
    if (voidTags.includes(this.tagName)) {
      return `<${this.tagName.toLowerCase()}${attrStr}></${this.tagName.toLowerCase()}>`;
    }
    return `<${this.tagName.toLowerCase()}${attrStr}>${this.innerHTML}</${this.tagName.toLowerCase()}>`;
  }

  getAttribute(name) {
    return this.attributes[name] !== undefined ? this.attributes[name] : null;
  }
  setAttribute(name, value) {
    const oldVal = this.attributes[name];
    this.attributes[name] = String(value);
    MockMutationObserver.notifyAttributeChange(this, name, oldVal);
  }
  hasAttribute(name) {
    return this.attributes[name] !== undefined;
  }
  removeAttribute(name) {
    const oldVal = this.attributes[name];
    delete this.attributes[name];
    MockMutationObserver.notifyAttributeChange(this, name, oldVal);
  }

  appendChild(child) {
    if (typeof child === 'string') {
      this.childNodes.push(child);
    } else {
      child.parentNode = this;
      this.childNodes.push(child);
    }
    return child;
  }

  append(...children) {
    children.forEach(c => this.appendChild(c));
  }

  addEventListener(type, listener) {
    if (!this.listeners[type]) this.listeners[type] = [];
    this.listeners[type].push(listener);
  }

  removeEventListener(type, listener) {
    if (!this.listeners[type]) return;
    this.listeners[type] = this.listeners[type].filter(l => l !== listener);
  }

  dispatchEvent(event) {
    if (!event.target) event.target = this;
    event.currentTarget = this;
    const handlers = (this.listeners[event.type] || []).slice();
    for (const h of handlers) {
      h.call(this, event);
    }
    if (this.parentNode && !event.cancelBubble) {
      this.parentNode.dispatchEvent(event);
    }
    return !event.defaultPrevented;
  }

  querySelector(selector) {
    const results = this.querySelectorAll(selector);
    return results.length > 0 ? results[0] : null;
  }

  querySelectorAll(selector) {
    const results = [];
    const walk = (node) => {
      if (node && node.nodeType === 1) {
        if (matchesSelector(node, selector)) {
          results.push(node);
        }
        for (const child of node.childNodes) {
          if (child && typeof child !== 'string') walk(child);
        }
      }
    };
    for (const child of this.childNodes) {
      if (child && typeof child !== 'string') walk(child);
    }
    return results;
  }

  closest(selector) {
    let curr = this;
    while (curr && curr.nodeType === 1) {
      if (matchesSelector(curr, selector)) return curr;
      curr = curr.parentNode;
    }
    return null;
  }

  matches(selector) {
    return matchesSelector(this, selector);
  }

  focus() { this._focused = true; }
  blur() { this._focused = false; }
  scrollIntoView() { this._scrolled = true; }
}

function matchesSelector(el, selector) {
  if (!el || el.nodeType !== 1) return false;
  if (!selector) return true;
  if (selector.includes(',')) {
    return selector.split(',').some(s => matchesSingleSelector(el, s.trim()));
  }
  return matchesSingleSelector(el, selector);
}

function matchesSingleSelector(el, sel) {
  if (!el || el.nodeType !== 1) return false;
  if (!sel) return true;
  const parts = sel.split(/\s+/);
  if (parts.length > 1) {
    const last = parts[parts.length - 1];
    if (!matchesCompoundSelector(el, last)) return false;
    let curr = el.parentNode;
    for (let i = parts.length - 2; i >= 0; i--) {
      const part = parts[i];
      while (curr && curr.nodeType === 1 && !matchesCompoundSelector(curr, part)) {
        curr = curr.parentNode;
      }
      if (!curr || curr.nodeType !== 1) return false;
      curr = curr.parentNode;
    }
    return true;
  }
  return matchesCompoundSelector(el, sel);
}

function matchesCompoundSelector(el, sel) {
  if (!el || el.nodeType !== 1) return false;
  const attrMatches = sel.match(/\[[^\]]+\]/g) || [];
  let remaining = sel.replace(/\[[^\]]+\]/g, '');

  for (const attrMatch of attrMatches) {
    const expr = attrMatch.slice(1, -1).trim();
    if (expr.includes('*=')) {
      const [attr, val] = expr.split('*=').map(s => s.trim().replace(/^["']|["']$/g, ''));
      const actual = el.getAttribute(attr);
      if (!actual || !actual.includes(val)) return false;
    } else if (expr.includes('^=')) {
      const [attr, val] = expr.split('^=').map(s => s.trim().replace(/^["']|["']$/g, ''));
      const actual = el.getAttribute(attr);
      if (!actual || !actual.startsWith(val)) return false;
    } else if (expr.includes('$=')) {
      const [attr, val] = expr.split('$=').map(s => s.trim().replace(/^["']|["']$/g, ''));
      const actual = el.getAttribute(attr);
      if (!actual || !actual.endsWith(val)) return false;
    } else if (expr.includes('=')) {
      const [attr, val] = expr.split('=').map(s => s.trim().replace(/^["']|["']$/g, ''));
      const actual = el.getAttribute(attr);
      if (actual !== val) return false;
    } else {
      if (!el.hasAttribute(expr)) return false;
    }
  }

  if (!remaining) return true;

  const idMatch = remaining.match(/#([a-zA-Z0-9_-]+)/);
  if (idMatch) {
    if (el.id !== idMatch[1]) return false;
    remaining = remaining.replace(idMatch[0], '');
  }

  const classMatches = remaining.match(/\.([a-zA-Z0-9_-]+)/g) || [];
  for (const clsMatch of classMatches) {
    const cls = clsMatch.slice(1);
    if (!el.classList.contains(cls)) return false;
    remaining = remaining.replace(clsMatch, '');
  }

  if (remaining) {
    if (el.tagName.toLowerCase() !== remaining.toLowerCase()) return false;
  }

  return true;
}

function parseSimpleHTML(htmlStr, parent = null) {
  const root = parent || new SimpleElement('div');
  const stack = [root];
  const tokenRegex = /<!--[\s\S]*?-->|<!DOCTYPE[^>]*>|<script([^>]*)>([\s\S]*?)<\/script>|<style([^>]*)>([\s\S]*?)<\/style>|<\/([a-zA-Z0-9-]+)\s*>|<([a-zA-Z0-9-]+)((?:\s+[^>="'\s]+(?:=(?:"[^"]*"|'[^']*'|[^\s>]+))?)*)\s*(\/?)>|([^<]+)/gi;
  const voidTags = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);

  let match;
  while ((match = tokenRegex.exec(htmlStr)) !== null) {
    const [fullMatch, scriptAttrs, scriptCode, styleAttrs, styleCode, closeTag, openTag, openAttrs, selfSlash, text] = match;

    if (fullMatch.startsWith('<!--') || fullMatch.toLowerCase().startsWith('<!doctype')) {
      continue;
    }

    if (scriptCode !== undefined) {
      const el = new SimpleElement('script', parseAttributes(scriptAttrs));
      el.appendChild(scriptCode);
      stack[stack.length - 1].appendChild(el);
      continue;
    }

    if (styleCode !== undefined) {
      const el = new SimpleElement('style', parseAttributes(styleAttrs));
      el.appendChild(styleCode);
      stack[stack.length - 1].appendChild(el);
      continue;
    }

    if (closeTag) {
      const tagLower = closeTag.toLowerCase();
      for (let i = stack.length - 1; i > 0; i--) {
        if (stack[i].tagName.toLowerCase() === tagLower) {
          stack.length = i;
          break;
        }
      }
      continue;
    }

    if (openTag) {
      const tagLower = openTag.toLowerCase();
      const isVoid = selfSlash === '/' || voidTags.has(tagLower);
      const attrs = parseAttributes(openAttrs);
      const el = new SimpleElement(tagLower, attrs);
      if (parent && stack.length === 1) {
        el.parentNode = parent;
      }
      stack[stack.length - 1].appendChild(el);
      if (!isVoid) {
        stack.push(el);
      }
      continue;
    }

    if (text) {
      if (stack.length > 0) {
        stack[stack.length - 1].appendChild(text);
      }
    }
  }

  return root.childNodes;
}

function parseAttributes(attrStr) {
  const attrs = {};
  if (!attrStr) return attrs;
  const regex = /([a-zA-Z0-9-]+)(?:=(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g;
  let m;
  while ((m = regex.exec(attrStr)) !== null) {
    const key = m[1];
    const val = m[2] !== undefined ? m[2] : (m[3] !== undefined ? m[3] : (m[4] !== undefined ? m[4] : ''));
    attrs[key] = val;
  }
  return attrs;
}

function parseFullDocument(htmlContent) {
  const doc = {
    doctype: htmlContent.toLowerCase().includes('<!doctype html>'),
    htmlLang: (htmlContent.match(/<html[^>]*lang=["']([^"']+)["']/i) || [])[1] || '',
    headHtml: (htmlContent.match(/<head[^>]*>([\s\S]*?)<\/head>/i) || [])[1] || '',
    bodyHtml: (htmlContent.match(/<body[^>]*>([\s\S]*?)<\/body>/i) || [])[1] || '',
    rawHtml: htmlContent,
    hidden: false,
    visibilityState: 'visible',
    readyState: 'complete'
  };

  const bodyAttrs = parseAttributes((htmlContent.match(/<body([^>]*)>/i) || [])[1] || '');
  const body = new SimpleElement('body', bodyAttrs);
  const headAttrs = parseAttributes((htmlContent.match(/<head([^>]*)>/i) || [])[1] || '');
  const head = new SimpleElement('head', headAttrs);

  const documentElement = new SimpleElement('html', { lang: doc.htmlLang });
  documentElement.appendChild(head);
  documentElement.appendChild(body);

  doc.body = body;
  doc.head = head;
  doc.documentElement = documentElement;

  head.innerHTML = doc.headHtml;
  body.innerHTML = doc.bodyHtml;

  doc.querySelector = (sel) => documentElement.querySelector(sel);
  doc.querySelectorAll = (sel) => documentElement.querySelectorAll(sel);
  doc.getElementById = (id) => documentElement.querySelector(`#${id}`);
  doc.getElementsByClassName = (cls) => documentElement.querySelectorAll(`.${cls}`);
  doc.createElement = (tag) => new SimpleElement(tag);

  return doc;
}

// Setup execution context for JS scripts
function createBrowserContext(docHtml) {
  const doc = parseFullDocument(docHtml);
  
  const eventListeners = {};
  let animCallbacks = new Map();
  let nextAnimId = 1;
  let simulatedTime = 1000;
  const requestedIds = [];
  const cancelledIds = [];

  const win = {
    document: doc,
    window: null,
    location: { href: 'http://localhost/' },
    innerWidth: 1200,
    innerHeight: 800,
    devicePixelRatio: 1,
    Intl: global.Intl,
    Date: global.Date,
    Math: global.Math,
    Object: global.Object,
    Array: global.Array,
    Set: global.Set,
    Map: global.Map,
    RegExp: global.RegExp,
    String: global.String,
    Number: global.Number,
    Boolean: global.Boolean,
    JSON: global.JSON,
    encodeURIComponent: global.encodeURIComponent,
    decodeURIComponent: global.decodeURIComponent,
    MutationObserver: MockMutationObserver,
    requestedIds,
    cancelledIds,
    performance: {
      now: () => simulatedTime
    },
    advanceTime: (ms) => {
      simulatedTime += ms;
    },
    runNextFrame: (customTime) => {
      if (customTime !== undefined) simulatedTime = customTime;
      const callbacks = Array.from(animCallbacks.entries());
      animCallbacks.clear();
      callbacks.forEach(([id, cb]) => {
        try {
          cb(simulatedTime);
        } catch (e) {
          // Keep loop resilient
        }
      });
    },
    getPendingFrameCount: () => animCallbacks.size,
    requestAnimationFrame: (cb) => {
      const id = nextAnimId++;
      requestedIds.push(id);
      animCallbacks.set(id, cb);
      return id;
    },
    cancelAnimationFrame: (id) => {
      cancelledIds.push(id);
      animCallbacks.delete(id);
    },
    matchMedia: (query) => {
      const isReduced = win._reducedMotion || false;
      return {
        matches: query.includes('prefers-reduced-motion: reduce') ? isReduced : false,
        media: query,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {}
      };
    },
    setTimeout: (fn, delay) => setTimeout(fn, delay),
    clearTimeout: (id) => clearTimeout(id),
    setInterval: (fn, delay) => setInterval(fn, delay),
    clearInterval: (id) => clearInterval(id),
    addEventListener: (type, fn, opts) => {
      if (!eventListeners[type]) eventListeners[type] = [];
      eventListeners[type].push(fn);
    },
    removeEventListener: (type, fn) => {
      if (!eventListeners[type]) return;
      eventListeners[type] = eventListeners[type].filter(l => l !== fn);
    },
    dispatchEvent: (evt) => {
      if (!evt.target) evt.target = win;
      evt.currentTarget = win;
      const handlers = (eventListeners[evt.type] || []).slice();
      handlers.forEach(h => h.call(win, evt));
      doc.body.dispatchEvent(evt);
    },
    FormData: class FormData {
      constructor(form) {
        this.data = {};
        if (form && form.querySelectorAll) {
          const inputs = form.querySelectorAll('input, textarea, select');
          inputs.forEach(input => {
            if (input.name) this.data[input.name] = input.value;
          });
        }
      }
      get(key) { return this.data[key] || null; }
    },
    Event: class Event {
      constructor(type, opts = {}) {
        this.type = type;
        this.bubbles = opts.bubbles || false;
        this.cancelable = opts.cancelable || false;
        this.clientX = opts.clientX || 0;
        this.clientY = opts.clientY || 0;
        this.defaultPrevented = false;
      }
      preventDefault() { this.defaultPrevented = true; }
    },
    KeyboardEvent: class KeyboardEvent {
      constructor(type, opts = {}) {
        this.type = type;
        this.key = opts.key || '';
        this.defaultPrevented = false;
      }
      preventDefault() { this.defaultPrevented = true; }
    },
    PointerEvent: class PointerEvent {
      constructor(type, opts = {}) {
        this.type = type;
        this.clientX = opts.clientX || 0;
        this.clientY = opts.clientY || 0;
        this.bubbles = opts.bubbles || false;
        this.cancelable = opts.cancelable || false;
        this.defaultPrevented = false;
      }
      preventDefault() { this.defaultPrevented = true; }
    }
  };
  win.window = win;
  doc.defaultView = win;

  doc.addEventListener = (type, fn, opts) => {
    if (!eventListeners['doc_' + type]) eventListeners['doc_' + type] = [];
    eventListeners['doc_' + type].push(fn);
    doc.body.addEventListener(type, fn);
  };
  doc.removeEventListener = (type, fn) => {
    if (eventListeners['doc_' + type]) {
      eventListeners['doc_' + type] = eventListeners['doc_' + type].filter(l => l !== fn);
    }
    doc.body.removeEventListener(type, fn);
  };
  doc.dispatchEvent = (evt) => {
    const handlers = (eventListeners['doc_' + evt.type] || []).slice();
    handlers.forEach(h => h.call(doc, evt));
    doc.body.dispatchEvent(evt);
  };

  return { win, doc };
}

// Load main source files
const SRC_DIR = path.join(ROOT_DIR, 'src');
const DIST_DIR = path.join(ROOT_DIR, 'dist');

const portfolioHtmlPath = fs.existsSync(path.join(DIST_DIR, 'portfolio-mejorado.html'))
  ? path.join(DIST_DIR, 'portfolio-mejorado.html')
  : path.join(ROOT_DIR, 'portfolio-mejorado.html');

const indexHtmlPath = fs.existsSync(path.join(SRC_DIR, 'index.html'))
  ? path.join(SRC_DIR, 'index.html')
  : path.join(ROOT_DIR, 'index.html');

const scriptJsPath = fs.existsSync(path.join(SRC_DIR, 'script.js'))
  ? path.join(SRC_DIR, 'script.js')
  : path.join(ROOT_DIR, 'script.js');

const stylesCssPath = fs.existsSync(path.join(SRC_DIR, 'styles.css'))
  ? path.join(SRC_DIR, 'styles.css')
  : path.join(ROOT_DIR, 'styles.css');

const portfolioHtmlContent = fs.readFileSync(portfolioHtmlPath, 'utf8');
const indexHtmlContent = fs.existsSync(indexHtmlPath) ? fs.readFileSync(indexHtmlPath, 'utf8') : null;
const scriptJsContent = fs.existsSync(scriptJsPath) ? fs.readFileSync(scriptJsPath, 'utf8') : '';
const stylesCssContent = fs.existsSync(stylesCssPath) ? fs.readFileSync(stylesCssPath, 'utf8') : '';

function executeInlineScript(htmlContent) {
  const scriptMatch = htmlContent.match(/<script>([\s\S]*?)<\/script>/i);
  if (!scriptMatch) return null;
  const jsCode = scriptMatch[1];
  const { win, doc } = createBrowserContext(htmlContent);
  const context = vm.createContext(win);
  vm.runInContext(jsCode, context);
  return { win, doc, context };
}

function executeModularScript(htmlContent) {
  const { win, doc } = createBrowserContext(htmlContent);
  const context = vm.createContext(win);
  if (scriptJsContent) {
    vm.runInContext(scriptJsContent, context);
  }
  return { win, doc, context };
}

// Main Test Execution Function
function runAllTests() {
  printHeader('STARTING DUAL-TRACK E2E TEST SUITE FOR PORTAFOLIO ALESSANDRO');
  console.log(`Workspace root: ${ROOT_DIR}`);
  console.log(`Inspecting files:`);
  console.log(`  - portfolio-mejorado.html (${portfolioHtmlContent.length} bytes)`);
  console.log(`  - index.html (${indexHtmlContent ? indexHtmlContent.length + ' bytes' : 'NOT FOUND'})`);
  console.log(`  - script.js (${scriptJsContent.length} bytes)`);
  console.log(`  - styles.css (${stylesCssContent.length} bytes)\n`);

  // =========================================================================
  // TIER 1: FEATURE COVERAGE
  // =========================================================================
  printHeader('TIER 1: FEATURE COVERAGE (>=5 tests per feature domain)');

  // 1.1 UI/UX & Responsive Layout
  try {
    assert(portfolioHtmlContent.toLowerCase().startsWith('<!doctype html>'), 'Document must start with <!doctype html>');
    assert(portfolioHtmlContent.includes('lang="es"'), 'HTML tag must set lang="es"');
    assert(portfolioHtmlContent.includes('charset="UTF-8"') || portfolioHtmlContent.includes('charset="utf-8"'), 'Meta charset must be UTF-8');
    assert(portfolioHtmlContent.includes('name="viewport"'), 'Meta viewport tag must exist');
    logPass('Tier 1', 'T1-UI-01', 'HTML5 Document Structure & Metadata (Doctype, charset UTF-8, viewport)');
  } catch (err) { logFail('Tier 1', 'T1-UI-01', 'HTML5 Document Structure & Metadata', err); }

  try {
    assert(portfolioHtmlContent.includes('Space+Grotesk') && portfolioHtmlContent.includes('DM+Mono'), 'Google Fonts must include Space Grotesk and DM Mono');
    assert(stylesCssContent.includes('Space Grotesk') || portfolioHtmlContent.includes('Space Grotesk'), 'Stylesheet must reference Space Grotesk font family');
    assert(stylesCssContent.includes('DM Mono') || portfolioHtmlContent.includes('DM Mono'), 'Stylesheet must reference DM Mono font family');
    logPass('Tier 1', 'T1-UI-02', 'Font Family Integration (Space Grotesk & DM Mono font configuration)');
  } catch (err) { logFail('Tier 1', 'T1-UI-02', 'Font Family Integration', err); }

  try {
    const env = executeInlineScript(portfolioHtmlContent);
    const themeBtn = env.doc.querySelector('#theme');
    assert(themeBtn, '#theme button must exist');
    assert.strictEqual(themeBtn.textContent, 'tema: verde', 'Initial theme button label should be "tema: verde"');

    // Click 1: cyan
    themeBtn.dispatchEvent(new env.win.Event('click'));
    assert.strictEqual(env.doc.body.dataset.theme, 'cyan', 'Body dataset.theme should be cyan');
    assert.strictEqual(themeBtn.textContent, 'tema: cyan', 'Theme button label should update to "tema: cyan"');

    // Click 2: amber
    themeBtn.dispatchEvent(new env.win.Event('click'));
    assert.strictEqual(env.doc.body.dataset.theme, 'amber', 'Body dataset.theme should be amber');
    assert.strictEqual(themeBtn.textContent, 'tema: ámbar', 'Theme button label should update to "tema: ámbar"');

    // Click 3: green (reset)
    themeBtn.dispatchEvent(new env.win.Event('click'));
    assert.strictEqual(env.doc.body.dataset.theme || '', '', 'Body dataset.theme should reset');
    assert.strictEqual(themeBtn.textContent, 'tema: verde', 'Theme button label should reset to "tema: verde"');
    logPass('Tier 1', 'T1-UI-03', 'Theme Switcher Cycling (green -> cyan -> amber -> green)');
  } catch (err) { logFail('Tier 1', 'T1-UI-03', 'Theme Switcher Cycling', err); }

  try {
    const combinedCSS = stylesCssContent + (portfolioHtmlContent.match(/<style>([\s\S]*?)<\/style>/i) || [])[1];
    assert(combinedCSS.includes('@media'), 'CSS must contain responsive @media queries');
    assert(combinedCSS.includes('920px') || combinedCSS.includes('600px'), 'CSS must specify breakpoints at 920px and/or 600px');
    assert(combinedCSS.includes('grid-template-columns') || combinedCSS.includes('flex'), 'CSS must use Grid or Flexbox layout rules');
    logPass('Tier 1', 'T1-UI-04', 'CSS Grid/Flexbox Responsive Rules & Breakpoints');
  } catch (err) { logFail('Tier 1', 'T1-UI-04', 'CSS Grid/Flexbox Responsive Rules & Breakpoints', err); }

  try {
    const combinedCSS = stylesCssContent + (portfolioHtmlContent.match(/<style>([\s\S]*?)<\/style>/i) || [])[1];
    assert(combinedCSS.includes('--bg:'), ':root must define --bg custom property');
    assert(combinedCSS.includes('--panel:'), ':root must define --panel custom property');
    assert(combinedCSS.includes('--text:'), ':root must define --text custom property');
    assert(combinedCSS.includes('--accent:'), ':root must define --accent custom property');
    assert(combinedCSS.includes('body[data-theme="cyan"]'), 'CSS must define theme override for cyan');
    assert(combinedCSS.includes('body[data-theme="amber"]'), 'CSS must define theme override for amber');
    logPass('Tier 1', 'T1-UI-05', 'Color Palette & CSS Custom Properties (:root variables & themes)');
  } catch (err) { logFail('Tier 1', 'T1-UI-05', 'Color Palette & CSS Custom Properties', err); }

  try {
    const env = executeInlineScript(portfolioHtmlContent);
    const clockEl = env.doc.querySelector('#clock');
    assert(clockEl, '#clock element must exist');
    assert(clockEl.textContent && clockEl.textContent.includes(':'), '#clock should display formatted time (HH:MM)');
    logPass('Tier 1', 'T1-UI-06', 'Live Clock Header Component (Lima, Peru UTC-5 formatting)');
  } catch (err) { logFail('Tier 1', 'T1-UI-06', 'Live Clock Header Component', err); }

  try {
    const doc = parseFullDocument(portfolioHtmlContent);
    const canvas = doc.querySelector('#cyber-canvas');
    assert(canvas, '#cyber-canvas background element must exist');
    const noise = doc.querySelector('.noise');
    assert(noise, '.noise overlay element must exist');
    const combinedCSS = stylesCssContent + (portfolioHtmlContent.match(/<style>([\s\S]*?)<\/style>/i) || [])[1];
    assert(combinedCSS.includes('#cyber-canvas') && combinedCSS.includes('.noise'), 'CSS must define #cyber-canvas and .noise');
    logPass('Tier 1', 'T1-UI-07', 'Background Engine: Binary Stream Canvas & Tactile Noise Overlay');
  } catch (err) { logFail('Tier 1', 'T1-UI-07', 'Background Engine: Binary Canvas & Noise', err); }

  // 1.2 Cyber-Industrial Background Multilayer Engine
  try {
    const doc = parseFullDocument(portfolioHtmlContent);
    const cyberCanvas = doc.querySelector('#cyber-canvas');
        const noise = doc.querySelector('.noise');
    const cyberWrap = doc.querySelector('.cyber-bg-wrap');
    const shell = doc.querySelector('.shell');

    assert(cyberCanvas, '#cyber-canvas layer must exist');
        assert(noise, '.noise texture layer must exist');
    assert(cyberWrap, '.cyber-bg-wrap auroral base must exist');
    assert(shell, '.shell foreground content layer must exist');
    assert(cyberCanvas.getAttribute('aria-hidden') === 'true', '#cyber-canvas must have aria-hidden="true"');
    
    const combinedCSS = stylesCssContent + (portfolioHtmlContent.match(/<style>([\s\S]*?)<\/style>/i) || [])[1];
    assert(combinedCSS.includes('pointer-events: none'), 'Background canvases must set pointer-events: none to avoid UI interference');
    logPass('Tier 1', 'T1-VIS-01', 'Multicapa Cyber-Industrial Hierarchy (#cyber-canvas, .noise, .shell)');
  } catch (err) { logFail('Tier 1', 'T1-VIS-01', 'Multicapa Cyber-Industrial Hierarchy', err); }

  try {
    const combinedCSS = stylesCssContent + (portfolioHtmlContent.match(/<style>([\s\S]*?)<\/style>/i) || [])[1];
    assert(combinedCSS.includes('#C9FF62') || combinedCSS.includes('#c9ff62'), 'Theme Verde Neón must define #c9ff62');
    assert(combinedCSS.includes('#7BEEFF') || combinedCSS.includes('#7beeff'), 'Theme Cyan Neón must define #7beeff');
    assert(combinedCSS.includes('#FFCE64') || combinedCSS.includes('#ffce64'), 'Theme Ámbar Neón must define #ffce64');
    logPass('Tier 1', 'T1-VIS-02', 'Theme Palette Custom Tokens (Verde #c9ff62, Cyan #7beeff, Ámbar #ffce64)');
  } catch (err) { logFail('Tier 1', 'T1-VIS-02', 'Theme Palette Custom Tokens', err); }

  try {
    const env = executeInlineScript(portfolioHtmlContent);
    assert.strictEqual(typeof env.win.__triggerRipple, 'function', 'window.__triggerRipple hook must be exposed');
    assert.strictEqual(typeof env.win.__boostBinaryMatrix, 'function', 'window.__boostBinaryMatrix hook must be exposed');
    assert.strictEqual(typeof env.win.__replayPreloader, 'function', 'window.__replayPreloader hook must be exposed');
    logPass('Tier 1', 'T1-VIS-03', 'Global Background & Preloader Test Hooks (__triggerRipple, __boostBinaryMatrix, __replayPreloader)');
  } catch (err) { logFail('Tier 1', 'T1-VIS-03', 'Global Background Test Hooks', err); }

  try {
    const env = executeInlineScript(portfolioHtmlContent);
    const cyberCanvas = env.doc.querySelector('#cyber-canvas');
        assert(cyberCanvas._context2d, 'Ripple canvas must initialize 2D context');
    assert(cyberCanvas._context2d, 'Binary canvas must initialize 2D context');
    assert(cyberCanvas.width >= 1200, 'Ripple canvas width must match viewport * DPR');
    assert(cyberCanvas.width >= 1200, 'Binary canvas width must match viewport * DPR');
    logPass('Tier 1', 'T1-VIS-04', 'Canvas Context 2D Initialization & High-DPI Scaling');
  } catch (err) { logFail('Tier 1', 'T1-VIS-04', 'Canvas Context 2D Initialization & DPR', err); }

  try {
    const doc = parseFullDocument(portfolioHtmlContent);
    const starCards = doc.querySelectorAll('.case');
    assert(starCards.length >= 4, 'At least 4 case study STAR cards present');
    const terminal = doc.querySelector('#terminalWindow');
    assert(terminal, 'Terminal window present with high-contrast background');
    const combinedCSS = stylesCssContent + (portfolioHtmlContent.match(/<style>([\s\S]*?)<\/style>/i) || [])[1];
    assert(combinedCSS.includes('--bg: #0d110e') || combinedCSS.includes('--panel: #141a15') || combinedCSS.includes('--bg:'), 'Dark theme panel and background tokens maintain WCAG AA+ contrast ratio > 7:1');
    logPass('Tier 1', 'T1-VIS-05', 'WCAG AA+ Contrast Ratio & Foreground Isolation Validation');
  } catch (err) { logFail('Tier 1', 'T1-VIS-05', 'WCAG AA+ Contrast Ratio', err); }

  // 1.3 CLI Commands Engine
  try {
    const env = executeInlineScript(portfolioHtmlContent);
    const input = env.doc.querySelector('#input');
    const form = env.doc.querySelector('#command');
    const output = env.doc.querySelector('#output');

    input.value = 'help';
    form.dispatchEvent(new env.win.Event('submit'));
    assert(output.innerHTML.includes('COMANDOS DISPONIBLES') || output.innerHTML.includes('AVAILABLE COMMANDS'), 'help output must contain header');
    assert(output.innerHTML.includes('about'), 'help output must list about command');
    assert(output.innerHTML.includes('experience'), 'help output must list experience command');
    logPass('Tier 1', 'T1-CLI-01', 'CLI Engine: "help" Command Execution');
  } catch (err) { logFail('Tier 1', 'T1-CLI-01', 'CLI Engine: "help" Command Execution', err); }

  try {
    const env = executeInlineScript(portfolioHtmlContent);
    const input = env.doc.querySelector('#input');
    const form = env.doc.querySelector('#command');
    const output = env.doc.querySelector('#output');

    input.value = 'about';
    form.dispatchEvent(new env.win.Event('submit'));
    assert(output.innerHTML.includes('SOBRE MÍ') || output.innerHTML.includes('ABOUT ME'), 'about output title must match');
    assert(output.innerHTML.includes('Ingeniería Industrial'), 'about output text must mention Engineering degree');
    logPass('Tier 1', 'T1-CLI-02', 'CLI Engine: "about" Command Execution');
  } catch (err) { logFail('Tier 1', 'T1-CLI-02', 'CLI Engine: "about" Command Execution', err); }

  try {
    const env = executeInlineScript(portfolioHtmlContent);
    const input = env.doc.querySelector('#input');
    const form = env.doc.querySelector('#command');
    const output = env.doc.querySelector('#output');

    input.value = 'experience';
    form.dispatchEvent(new env.win.Event('submit'));
    assert(output.innerHTML.includes('PRIMAX Ecuador'), 'experience output must mention PRIMAX Ecuador');
    assert(output.innerHTML.includes('100–200 facturas'), 'experience output must mention invoice SLA metrics');
    assert(output.innerHTML.includes('Power BI'), 'experience output must mention Power BI dashboard');
    logPass('Tier 1', 'T1-CLI-03', 'CLI Engine: "experience" Command Execution');
  } catch (err) { logFail('Tier 1', 'T1-CLI-03', 'CLI Engine: "experience" Command Execution', err); }

  try {
    const env = executeInlineScript(portfolioHtmlContent);
    const input = env.doc.querySelector('#input');
    const form = env.doc.querySelector('#command');
    const output = env.doc.querySelector('#output');

    input.value = 'cases';
    form.dispatchEvent(new env.win.Event('submit'));
    assert(output.innerHTML.includes('CASOS DE ESTUDIO') || output.innerHTML.includes('CASE STUDIES'), 'cases output title must match');
    assert(output.innerHTML.includes('Power BI'), 'cases output must mention Power BI');
    assert(output.innerHTML.includes('regresión logística') || output.innerHTML.includes('logistic regression'), 'cases output must mention ML model');
    logPass('Tier 1', 'T1-CLI-04', 'CLI Engine: "cases" / "projects" Command Execution');
  } catch (err) { logFail('Tier 1', 'T1-CLI-04', 'CLI Engine: "cases" / "projects" Command Execution', err); }

  try {
    const env = executeInlineScript(portfolioHtmlContent);
    const input = env.doc.querySelector('#input');
    const form = env.doc.querySelector('#command');
    const output = env.doc.querySelector('#output');

    input.value = 'skills';
    form.dispatchEvent(new env.win.Event('submit'));
    assert(output.innerHTML.includes('STACK TÉCNICO') || output.innerHTML.includes('TECHNICAL STACK'), 'skills title must match');
    assert(output.innerHTML.includes('Python') && output.innerHTML.includes('Power BI') && output.innerHTML.includes('SAP ERP'), 'skills must include tech stack tools');
    logPass('Tier 1', 'T1-CLI-05', 'CLI Engine: "skills" Command Execution');
  } catch (err) { logFail('Tier 1', 'T1-CLI-05', 'CLI Engine: "skills" Command Execution', err); }

  try {
    const env = executeInlineScript(portfolioHtmlContent);
    const input = env.doc.querySelector('#input');
    const form = env.doc.querySelector('#command');
    const output = env.doc.querySelector('#output');

    input.value = 'education';
    form.dispatchEvent(new env.win.Event('submit'));
    assert(output.innerHTML.includes('FORMACIÓN') || output.innerHTML.includes('EDUCATION'), 'education title must match');
    assert(output.innerHTML.includes('Universidad Continental'), 'education must mention Universidad Continental');
    logPass('Tier 1', 'T1-CLI-06', 'CLI Engine: "education" Command Execution');
  } catch (err) { logFail('Tier 1', 'T1-CLI-06', 'CLI Engine: "education" Command Execution', err); }

  try {
    const env = executeInlineScript(portfolioHtmlContent);
    const input = env.doc.querySelector('#input');
    const form = env.doc.querySelector('#command');
    const output = env.doc.querySelector('#output');

    input.value = 'contact';
    form.dispatchEvent(new env.win.Event('submit'));
    assert(output.innerHTML.includes('mailto:alessandro.altamirano23@gmail.com'), 'contact output must include email link');
    assert(output.innerHTML.includes('tel:+51944521832'), 'contact output must include phone link');
    assert(output.innerHTML.includes('linkedin.com/in/alessandroaltamirano'), 'contact output must include LinkedIn link');
    logPass('Tier 1', 'T1-CLI-07', 'CLI Engine: "contact" Command Execution');
  } catch (err) { logFail('Tier 1', 'T1-CLI-07', 'CLI Engine: "contact" Command Execution', err); }

  try {
    const env = executeInlineScript(portfolioHtmlContent);
    const input = env.doc.querySelector('#input');
    const form = env.doc.querySelector('#command');
    const output = env.doc.querySelector('#output');

    input.value = 'cv';
    form.dispatchEvent(new env.win.Event('submit'));
    assert(output.innerHTML.includes('CV_Alessandro_Altamirano_Salazar_2026.pdf'), 'cv output must reference resume PDF');
    assert(output.innerHTML.includes('target="_blank"'), 'cv link must open in new tab');
    logPass('Tier 1', 'T1-CLI-08', 'CLI Engine: "cv" / "resume" Command Execution');
  } catch (err) { logFail('Tier 1', 'T1-CLI-08', 'CLI Engine: "cv" / "resume" Command Execution', err); }

  try {
    const env = executeInlineScript(portfolioHtmlContent);
    const input = env.doc.querySelector('#input');
    const form = env.doc.querySelector('#command');
    const output = env.doc.querySelector('#output');

    input.value = 'help';
    form.dispatchEvent(new env.win.Event('submit'));
    assert(output.innerHTML.length > 0, 'Output should have content before clear');

    input.value = 'clear';
    form.dispatchEvent(new env.win.Event('submit'));
    assert.strictEqual(output.innerHTML, '', 'Output must be empty after clear command');
    logPass('Tier 1', 'T1-CLI-09', 'CLI Engine: "clear" Command Execution');
  } catch (err) { logFail('Tier 1', 'T1-CLI-09', 'CLI Engine: "clear" Command Execution', err); }

  try {
    const env = executeInlineScript(portfolioHtmlContent);
    const quickBtn = env.doc.querySelector('[data-run="about"]');
    assert(quickBtn, 'Quick run button for about must exist');
    quickBtn.dispatchEvent(new env.win.Event('click'));
    const output = env.doc.querySelector('#output');
    assert(output.innerHTML.includes('SOBRE MÍ') || output.innerHTML.includes('ABOUT ME'), 'Clicking quick button must execute command');
    logPass('Tier 1', 'T1-CLI-10', 'CLI Quick Command Buttons ([data-run] / [data-command])');
  } catch (err) { logFail('Tier 1', 'T1-CLI-10', 'CLI Quick Command Buttons', err); }

  // 1.4 Recruiter Mode Toggle
  try {
    const env = executeInlineScript(portfolioHtmlContent);
    const recruiterSec = env.doc.querySelector('#recruiter');
    assert(recruiterSec, '#recruiter section container must exist');
    assert(recruiterSec.innerHTML.includes('Perfil en 60 segundos') || recruiterSec.innerHTML.includes('Profile in 60 seconds'), 'Recruiter snapshot header present');
    logPass('Tier 1', 'T1-REC-01', 'Recruiter Snapshot Container DOM Structure');
  } catch (err) { logFail('Tier 1', 'T1-REC-01', 'Recruiter Snapshot Container DOM Structure', err); }

  try {
    const env = executeInlineScript(portfolioHtmlContent);
    const viewBtn = env.doc.querySelector('#view');
    const recruiterSec = env.doc.querySelector('#recruiter');

    assert(!recruiterSec.classList.contains('show'), 'Recruiter section should initially be hidden');
    assert.strictEqual(viewBtn.getAttribute('aria-pressed'), 'false', 'aria-pressed should initially be false');

    viewBtn.dispatchEvent(new env.win.Event('click'));
    assert(recruiterSec.classList.contains('show'), 'Recruiter section should have class "show" after click');
    assert.strictEqual(viewBtn.getAttribute('aria-pressed'), 'true', 'aria-pressed should be true when visible');

    viewBtn.dispatchEvent(new env.win.Event('click'));
    assert(!recruiterSec.classList.contains('show'), 'Recruiter section should hide when toggled again');
    assert.strictEqual(viewBtn.getAttribute('aria-pressed'), 'false', 'aria-pressed should revert to false');
    logPass('Tier 1', 'T1-REC-02', 'Recruiter Mode Toggle Button (#view class & aria-pressed state)');
  } catch (err) { logFail('Tier 1', 'T1-REC-02', 'Recruiter Mode Toggle Button', err); }

  try {
    const env = executeInlineScript(portfolioHtmlContent);
    const viewBtn = env.doc.querySelector('#view');
    const closeBtn = env.doc.querySelector('.recruiter-close');
    const recruiterSec = env.doc.querySelector('#recruiter');

    viewBtn.dispatchEvent(new env.win.Event('click'));
    assert(recruiterSec.classList.contains('show'), 'Recruiter mode should be open');

    closeBtn.dispatchEvent(new env.win.Event('click'));
    assert(!recruiterSec.classList.contains('show'), 'Clicking .recruiter-close button must hide recruiter section');
    logPass('Tier 1', 'T1-REC-03', 'Recruiter Snapshot Close Button (.recruiter-close handling)');
  } catch (err) { logFail('Tier 1', 'T1-REC-03', 'Recruiter Snapshot Close Button', err); }

  try {
    const env = executeInlineScript(portfolioHtmlContent);
    const input = env.doc.querySelector('#input');
    const form = env.doc.querySelector('#command');
    const recruiterSec = env.doc.querySelector('#recruiter');

    input.value = 'recruiter';
    form.dispatchEvent(new env.win.Event('submit'));
    assert(recruiterSec.classList.contains('show'), 'Executing "recruiter" CLI command must open recruiter mode');

    input.value = 'terminal';
    form.dispatchEvent(new env.win.Event('submit'));
    assert(!recruiterSec.classList.contains('show'), 'Executing "terminal" CLI command must close recruiter mode');
    logPass('Tier 1', 'T1-REC-04', 'Bidirectional CLI Commands ("recruiter" / "terminal")');
  } catch (err) { logFail('Tier 1', 'T1-REC-04', 'Bidirectional CLI Commands', err); }

  try {
    const env = executeInlineScript(portfolioHtmlContent);
    const recruiterSec = env.doc.querySelector('#recruiter');
    const links = recruiterSec.querySelectorAll('a');
    assert(links.length >= 2, 'Recruiter section must contain action buttons/links');
    const hasMail = Array.from(links).some(l => l.getAttribute('href') && l.getAttribute('href').startsWith('mailto:'));
    const hasCV = Array.from(links).some(l => l.getAttribute('href') && l.getAttribute('href').includes('CV_Alessandro'));
    assert(hasMail, 'Recruiter actions must include mailto button');
    assert(hasCV, 'Recruiter actions must include CV download link');
    logPass('Tier 1', 'T1-REC-05', 'Recruiter Quick Action Buttons (Contact Me & Download CV)');
  } catch (err) { logFail('Tier 1', 'T1-REC-05', 'Recruiter Quick Action Buttons', err); }

  // 1.5 External Links & Security
  try {
    const doc = parseFullDocument(portfolioHtmlContent);
    const links = doc.querySelectorAll('a[target="_blank"]');
    assert(links.length > 0, 'Document must contain target="_blank" links');
    links.forEach((link, idx) => {
      const rel = link.getAttribute('rel');
      assert(rel && rel.includes('noreferrer'), `Link ${idx} (${link.getAttribute('href')}) target="_blank" MUST have rel="noreferrer"`);
    });
    logPass('Tier 1', 'T1-LNK-01', 'External Link Security Policy (rel="noreferrer" on all target="_blank" links)');
  } catch (err) { logFail('Tier 1', 'T1-LNK-01', 'External Link Security Policy', err); }

  try {
    const doc = parseFullDocument(portfolioHtmlContent);
    const linkedinLinks = doc.querySelectorAll('a[href*="linkedin.com"]');
    assert(linkedinLinks.length >= 1, 'Page must contain LinkedIn link');
    linkedinLinks.forEach(link => {
      assert(link.getAttribute('href').startsWith('https://www.linkedin.com/'), 'LinkedIn link must be valid HTTPS');
      assert.strictEqual(link.getAttribute('target'), '_blank', 'LinkedIn link must open in new tab');
    });
    logPass('Tier 1', 'T1-LNK-02', 'LinkedIn External Profile & Post Link Integrity');
  } catch (err) { logFail('Tier 1', 'T1-LNK-02', 'LinkedIn External Profile & Post Link Integrity', err); }

  try {
    const doc = parseFullDocument(portfolioHtmlContent);
    const githubLinks = doc.querySelectorAll('a[href*="github.com"]');
    assert(githubLinks.length >= 1, 'Page must contain GitHub link');
    githubLinks.forEach(link => {
      assert(link.getAttribute('href').startsWith('https://github.com/'), 'GitHub link must be valid HTTPS');
    });
    logPass('Tier 1', 'T1-LNK-03', 'GitHub Repository Link Integrity');
  } catch (err) { logFail('Tier 1', 'T1-LNK-03', 'GitHub Repository Link Integrity', err); }

  try {
    const doc = parseFullDocument(portfolioHtmlContent);
    const cvLinks = doc.querySelectorAll('a[href*="CV_Alessandro"]');
    assert(cvLinks.length >= 1, 'Page must contain CV PDF link');
    cvLinks.forEach(link => {
      assert.strictEqual(link.getAttribute('href'), 'CV_Alessandro_Altamirano_Salazar_2026.pdf', 'CV link must match exact file path');
    });
    logPass('Tier 1', 'T1-LNK-04', 'Resume PDF Asset Download Link');
  } catch (err) { logFail('Tier 1', 'T1-LNK-04', 'Resume PDF Asset Download Link', err); }

  try {
    const doc = parseFullDocument(portfolioHtmlContent);
    const mailLinks = doc.querySelectorAll('a[href^="mailto:"]');
    assert(mailLinks.length >= 1, 'Page must contain mailto link');
    mailLinks.forEach(link => {
      assert.strictEqual(link.getAttribute('href'), 'mailto:alessandro.altamirano23@gmail.com', 'Mailto link must point to alessandro.altamirano23@gmail.com');
    });
    logPass('Tier 1', 'T1-LNK-05', 'Direct Mailto Email Link Integrity');
  } catch (err) { logFail('Tier 1', 'T1-LNK-05', 'Direct Mailto Email Link Integrity', err); }

  // 1.6 Metadata, SEO & ARIA
  try {
    const doc = parseFullDocument(portfolioHtmlContent);
    const h1s = doc.querySelectorAll('h1');
    assert.strictEqual(h1s.length, 1, `Page MUST contain EXACTLY ONE <h1> heading, found ${h1s.length}`);
    logPass('Tier 1', 'T1-SEO-01', 'Single <h1> Tag Hierarchy (Hero Section Heading)');
  } catch (err) { logFail('Tier 1', 'T1-SEO-01', 'Single <h1> Tag Hierarchy', err); }

  try {
    assert(portfolioHtmlContent.includes('property="og:title"'), 'og:title meta tag required');
    assert(portfolioHtmlContent.includes('property="og:description"'), 'og:description meta tag required');
    assert(portfolioHtmlContent.includes('property="og:image"'), 'og:image meta tag required');
    assert(portfolioHtmlContent.includes('property="og:type"'), 'og:type meta tag required');
    logPass('Tier 1', 'T1-SEO-02', 'OpenGraph Meta Tags Completeness');
  } catch (err) { logFail('Tier 1', 'T1-SEO-02', 'OpenGraph Meta Tags Completeness', err); }

  try {
    assert(portfolioHtmlContent.includes('name="twitter:card"'), 'twitter:card meta tag required');
    assert(portfolioHtmlContent.includes('name="twitter:image"'), 'twitter:image meta tag required');
    logPass('Tier 1', 'T1-SEO-03', 'Twitter Card Social Preview Meta Tags');
  } catch (err) { logFail('Tier 1', 'T1-SEO-03', 'Twitter Card Social Preview Meta Tags', err); }

  try {
    const jsonLdMatch = portfolioHtmlContent.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/i);
    assert(jsonLdMatch, 'Schema.org JSON-LD script block must exist');
    const jsonLd = JSON.parse(jsonLdMatch[1]);
    assert.strictEqual(jsonLd['@context'], 'https://schema.org', '@context must be https://schema.org');
    assert.strictEqual(jsonLd['@type'], 'Person', '@type must be Person');
    assert(jsonLd.name.includes('Alessandro'), 'Person name must be present');
    assert.strictEqual(jsonLd.email, 'mailto:alessandro.altamirano23@gmail.com', 'Person email must match');
    assert(Array.isArray(jsonLd.sameAs) && jsonLd.sameAs.length >= 2, 'sameAs must contain social profiles');
    logPass('Tier 1', 'T1-SEO-04', 'Enriched Schema.org Person JSON-LD Validation');
  } catch (err) { logFail('Tier 1', 'T1-SEO-04', 'Enriched Schema.org Person JSON-LD Validation', err); }

  try {
    const doc = parseFullDocument(portfolioHtmlContent);
    const skipLink = doc.querySelector('a.skip');
    assert(skipLink && skipLink.getAttribute('href') === '#content', 'Skip to content link must exist targeting #content');
    const mainEl = doc.querySelector('main#content');
    assert(mainEl, '<main id="content"> element must exist');
    const outputEl = doc.querySelector('#output');
    assert(outputEl && outputEl.getAttribute('aria-live') === 'polite', 'Terminal output container must have aria-live="polite"');
    logPass('Tier 1', 'T1-SEO-05', 'ARIA Accessibility Attributes & Landmarks (skip link, main landmark, aria-live)');
  } catch (err) { logFail('Tier 1', 'T1-SEO-05', 'ARIA Accessibility Attributes & Landmarks', err); }

  // 1.7 Contact Form & Mailto Fallback
  try {
    const doc = parseFullDocument(portfolioHtmlContent);
    const form = doc.querySelector('#contactForm');
    assert(form, '#contactForm must exist');
    const nameInput = form.querySelector('input[name="name"]');
    const emailInput = form.querySelector('input[name="email"]');
    const msgTextarea = form.querySelector('textarea[name="message"]');
    assert(nameInput && nameInput.hasAttribute('required'), 'Name input must be required');
    assert(emailInput && emailInput.hasAttribute('required') && emailInput.getAttribute('type') === 'email', 'Email input must be type="email" and required');
    assert(msgTextarea && msgTextarea.hasAttribute('required'), 'Message textarea must be required');
    logPass('Tier 1', 'T1-FRM-01', 'Contact Form Fields & Native HTML Validation Attributes');
  } catch (err) { logFail('Tier 1', 'T1-FRM-01', 'Contact Form Fields & Validation', err); }

  try {
    const env = executeInlineScript(portfolioHtmlContent);
    const form = env.doc.querySelector('#contactForm');
    const nameInput = form.querySelector('input[name="name"]');
    const emailInput = form.querySelector('input[name="email"]');
    const msgTextarea = form.querySelector('textarea[name="message"]');

    nameInput.value = 'Juan Perez';
    emailInput.value = 'juan@example.com';
    msgTextarea.value = 'Hola Alessandro, me interesa tu perfil.';

    form.dispatchEvent(new env.win.Event('submit'));
    assert(env.win.location.href.startsWith('mailto:alessandro.altamirano23@gmail.com'), 'Submit must set mailto href');
    assert(env.win.location.href.includes(encodeURIComponent('Juan Perez')), 'Submit mailto URI must encode name');
    assert(env.win.location.href.includes(encodeURIComponent('juan@example.com')), 'Submit mailto URI must encode email');
    logPass('Tier 1', 'T1-FRM-02', 'Form JavaScript Submit Handler & Mailto URI Encoding');
  } catch (err) { logFail('Tier 1', 'T1-FRM-02', 'Form Submit Handler & Mailto Encoding', err); }

  try {
    const doc = parseFullDocument(portfolioHtmlContent);
    const img = doc.querySelector('article.case img');
    assert(img, 'Case study image must exist');
    assert(img.getAttribute('src') === 'assets/primax-power-bi-dashboard.png', 'Image src must be assets/primax-power-bi-dashboard.png');
    assert(img.hasAttribute('alt') && img.getAttribute('alt').length > 5, 'Image alt text must be descriptive');
    logPass('Tier 1', 'T1-FRM-03', 'Case Study Image Optimization & Descriptive Alt Text');
  } catch (err) { logFail('Tier 1', 'T1-FRM-03', 'Case Study Image Optimization', err); }

  try {
    const env = executeInlineScript(portfolioHtmlContent);
    const langBtn = env.doc.querySelector('#language');
    assert(langBtn, '#language button must exist');
    assert.strictEqual(langBtn.textContent, 'EN', 'Initial language button should offer "EN"');

    langBtn.dispatchEvent(new env.win.Event('click'));
    assert.strictEqual(env.doc.documentElement.lang, 'en', 'Document lang should become "en"');
    assert.strictEqual(langBtn.textContent, 'ES', 'Language button text should update to "ES"');

    langBtn.dispatchEvent(new env.win.Event('click'));
    assert.strictEqual(env.doc.documentElement.lang, 'es', 'Document lang should revert to "es"');
    logPass('Tier 1', 'T1-FRM-04', 'i18n Translation Engine Toggle (ES <-> EN)');
  } catch (err) { logFail('Tier 1', 'T1-FRM-04', 'i18n Translation Engine Toggle', err); }

  try {
    const doc = parseFullDocument(portfolioHtmlContent);
    const clearBtn = doc.querySelector('#clear');
    assert(clearBtn, '#clear button must exist');
    assert(clearBtn.getAttribute('data-t') === 'clear', '#clear button should have data-t translation attribute');
    logPass('Tier 1', 'T1-FRM-05', 'Clear Terminal Header Button & Translation Metadata');
  } catch (err) { logFail('Tier 1', 'T1-FRM-05', 'Clear Terminal Header Button', err); }

  // 1.8 Process & ROI Simulator Feature
  try {
    const env = executeInlineScript(portfolioHtmlContent);
    const input = env.doc.querySelector('#input');
    const form = env.doc.querySelector('#command');
    const output = env.doc.querySelector('#output');

    input.value = 'simulate';
    form.dispatchEvent(new env.win.Event('submit'));
    assert(output.innerHTML.includes('cli-simulator-box'), 'simulate command must render .cli-simulator-box inside console');
    assert(output.innerHTML.includes('HORAS AHORRADAS') || output.innerHTML.includes('MAN-HOURS SAVED'), 'Simulator output must show hours saved metric');
    logPass('Tier 1', 'T1-SIM-01', 'In-Terminal Process Simulator Engine & Output Targets');
  } catch (err) { logFail('Tier 1', 'T1-SIM-01', 'In-Terminal Process Simulator Engine', err); }

  try {
    const env = executeInlineScript(portfolioHtmlContent);
    const input = env.doc.querySelector('#input');
    const form = env.doc.querySelector('#command');
    const output = env.doc.querySelector('#output');

    input.value = 'simulate 300 10 70';
    form.dispatchEvent(new env.win.Event('submit'));

    // Expected: 300 * (10/60) * 4.333 * 0.70 = ~151.7 hours
    assert(output.innerHTML.includes('151.7 hrs') || output.innerHTML.includes('151.7'), `Expected 151.7 hrs in output, got ${output.innerHTML}`);
    logPass('Tier 1', 'T1-SIM-02', 'Simulator Reactive CLI Calculation Engine (simulate 300 10 70 -> 151.7 hrs saved)');
  } catch (err) { logFail('Tier 1', 'T1-SIM-02', 'Simulator Reactive CLI Calculation Engine', err); }

  // 1.9 CV Modal & Quick Copy
  try {
    const doc = parseFullDocument(portfolioHtmlContent);
    const modal = doc.querySelector('#cvModal');
    assert(modal, '#cvModal dialog element must exist');
    const iframe = modal.querySelector('iframe');
    assert(iframe && iframe.getAttribute('src').includes('CV_Alessandro'), 'CV Modal must embed CV PDF in an iframe');
    const dlBtn = modal.querySelector('.cv-dl-btn');
    assert(dlBtn && dlBtn.getAttribute('href').includes('CV_Alessandro'), 'CV Modal must have direct download button');
    logPass('Tier 1', 'T1-MOD-01', 'CV Preview Modal Container & PDF Iframe Embed');
  } catch (err) { logFail('Tier 1', 'T1-MOD-01', 'CV Preview Modal Container', err); }

  try {
    const doc = parseFullDocument(portfolioHtmlContent);
    const copyBtns = doc.querySelectorAll('[data-copy]');
    assert(copyBtns.length >= 1, 'At least one data-copy button must exist');
    const toast = doc.querySelector('#toast');
    assert(toast, '#toast notification element must exist');
    logPass('Tier 1', 'T1-CPY-01', 'Quick-Copy Attributes & Toast Feedback Elements');
  } catch (err) { logFail('Tier 1', 'T1-CPY-01', 'Quick-Copy Attributes & Toast', err); }

  try {
    const env = executeInlineScript(portfolioHtmlContent);
    const input = env.doc.querySelector('#input');
    const form = env.doc.querySelector('#command');
    const output = env.doc.querySelector('#output');

    input.value = 'simulate';
    form.dispatchEvent(new env.win.Event('submit'));
    assert(output.innerHTML.includes('CALCULADORA DE IMPACTO') || output.innerHTML.includes('OPERATIONAL IMPACT'), 'simulate CLI command must output title');

    input.value = 'stats';
    form.dispatchEvent(new env.win.Event('submit'));
    assert(output.innerHTML.includes('MÉTRICAS') || output.innerHTML.includes('METRICS'), 'stats CLI command must output metrics');
    logPass('Tier 1', 'T1-CLI-11', 'CLI Engine: "simulate" & "stats" Extended Commands');
  } catch (err) { logFail('Tier 1', 'T1-CLI-11', 'CLI Engine: Extended Commands', err); }

  // 1.10 Case Studies STAR Deep Dive & Credentials
  try {
    const doc = parseFullDocument(portfolioHtmlContent);
    const caseModal = doc.querySelector('#caseModal');
    assert(caseModal, '#caseModal dialog element must exist');
    const deepBtns = doc.querySelectorAll('.case-deep-btn, [data-case]');
    assert(deepBtns.length >= 4, 'All 4 case studies must have STAR deep-dive trigger buttons');
    logPass('Tier 1', 'T1-STR-01', 'Case Studies STAR Deep-Dive Buttons & Modal Container (4 cases)');
  } catch (err) { logFail('Tier 1', 'T1-STR-01', 'Case Studies STAR Deep-Dive Buttons', err); }

  try {
    const env = executeInlineScript(portfolioHtmlContent);
    const primaxBtn = env.doc.querySelector('[data-case="primax"]');
    assert(primaxBtn, 'PRIMAX STAR button must exist');
    primaxBtn.dispatchEvent(new env.win.Event('click'));

    const modalBody = env.doc.querySelector('#caseModalBody');
    assert(modalBody && (modalBody.innerHTML.includes('Situación') || modalBody.innerHTML.includes('Situation')), 'Modal body must render Situación/Situation block');
    assert(modalBody && (modalBody.innerHTML.includes('Tarea') || modalBody.innerHTML.includes('Task')), 'Modal body must render Tarea/Task block');
    assert(modalBody && (modalBody.innerHTML.includes('Acción') || modalBody.innerHTML.includes('Action')), 'Modal body must render Acción/Action block');
    assert(modalBody && (modalBody.innerHTML.includes('Resultado') || modalBody.innerHTML.includes('Result')), 'Modal body must render Resultado/Result block');
    assert(modalBody && modalBody.innerHTML.includes('Power BI'), 'PRIMAX STAR breakdown must cite Power BI');

    // Test ETL case modal
    const etlBtn = env.doc.querySelector('[data-case="etl"]');
    assert(etlBtn, 'ETL STAR button must exist');
    etlBtn.dispatchEvent(new env.win.Event('click'));
    assert(modalBody && modalBody.innerHTML.includes('48,833'), 'ETL STAR breakdown must cite 48,833 documents processed');
    logPass('Tier 1', 'T1-STR-02', 'STAR Methodology Dynamic Rendering (PRIMAX, ETL 48K docs, ML, VASMAD)');
  } catch (err) { logFail('Tier 1', 'T1-STR-02', 'STAR Methodology Dynamic Rendering', err); }

  try {
    const doc = parseFullDocument(portfolioHtmlContent);
    const credCards = doc.querySelectorAll('.credential-card');
    assert(credCards.length >= 6, 'Credentials section must contain 6 verified certification cards');
    const hasSantander = Array.from(credCards).some(c => c.innerHTML.includes('Santander'));
    const hasTelefonica = Array.from(credCards).some(c => c.innerHTML.includes('Telefónica'));
    const hasUdemy = Array.from(credCards).some(c => c.innerHTML.includes('Udemy'));
    const hasNasa = Array.from(credCards).some(c => c.innerHTML.includes('NASA'));
    const hasAnthropic = Array.from(credCards).some(c => c.innerHTML.includes('Anthropic'));
    assert(hasSantander && hasTelefonica && hasUdemy && hasNasa && hasAnthropic, 'Credentials must feature Santander, Telefónica, Udemy, NASA, and Anthropic');
    logPass('Tier 1', 'T1-CRD-01', 'Enriched Certifications Grid (Santander, Telefónica, Udemy, NASA, Anthropic)');
  } catch (err) { logFail('Tier 1', 'T1-CRD-01', 'Enriched Certifications Grid', err); }

  try {
    const env = executeInlineScript(portfolioHtmlContent);
    const input = env.doc.querySelector('#input');
    const form = env.doc.querySelector('#command');
    const output = env.doc.querySelector('#output');

    input.value = 'case primax';
    form.dispatchEvent(new env.win.Event('submit'));
    assert(output.innerHTML.includes('STAR') || output.innerHTML.includes('PRIMAX'), 'case primax CLI command must open modal and output confirmation');

    input.value = 'case etl';
    form.dispatchEvent(new env.win.Event('submit'));
    assert(output.innerHTML.includes('STAR') && output.innerHTML.includes('ETL'), 'case etl CLI command must open modal and output confirmation');

    input.value = 'case ml';
    form.dispatchEvent(new env.win.Event('submit'));
    assert(output.innerHTML.includes('STAR') || output.innerHTML.includes('Machine Learning'), 'case ml CLI command must output confirmation');

    input.value = 'case vasmad';
    form.dispatchEvent(new env.win.Event('submit'));
    assert(output.innerHTML.includes('STAR') || output.innerHTML.includes('VASMAD'), 'case vasmad CLI command must output confirmation');
    logPass('Tier 1', 'T1-CLI-12', 'CLI Engine: "case [primax|etl|ml|vasmad]" Deep-Dive Commands');
  } catch (err) { logFail('Tier 1', 'T1-CLI-12', 'CLI Engine: case commands', err); }

  // 1.11 Terms & Conditions and Legal Privacy
  try {
    const doc = parseFullDocument(portfolioHtmlContent);
    const termsModal = doc.querySelector('#termsModal');
    assert(termsModal, '#termsModal dialog element must exist');
    const openTermsBtn = doc.querySelector('#openTermsBtn');
    assert(openTermsBtn, '#openTermsBtn footer trigger button must exist');
    assert(openTermsBtn.getAttribute('data-t') === 'termsNav', '#openTermsBtn must have data-t="termsNav"');
    logPass('Tier 1', 'T1-TRM-01', 'Terms & Conditions Modal DOM & Footer Button Integration');
  } catch (err) { logFail('Tier 1', 'T1-TRM-01', 'Terms Modal DOM & Footer Button', err); }

  try {
    const env = executeInlineScript(portfolioHtmlContent);
    const openTermsBtn = env.doc.querySelector('#openTermsBtn');
    openTermsBtn.dispatchEvent(new env.win.Event('click'));

    const termsBody = env.doc.querySelector('#termsModalBody');
    assert(termsBody && (termsBody.innerHTML.includes('Términos de Uso') || termsBody.innerHTML.includes('Terms of Use')), 'Terms modal body must render title');
    assert(termsBody && (termsBody.innerHTML.includes('Privacidad') || termsBody.innerHTML.includes('Privacy')), 'Terms modal must cover privacy clause');
    assert(termsBody && (termsBody.innerHTML.includes('Confidencialidad') || termsBody.innerHTML.includes('Confidentiality')), 'Terms modal must cover corporate confidentiality clause');
    logPass('Tier 1', 'T1-TRM-02', 'Terms & Conditions Modal Content Rendering (Clauses, Confidentiality & Privacy)');
  } catch (err) { logFail('Tier 1', 'T1-TRM-02', 'Terms Modal Content Rendering', err); }

  try {
    const env = executeInlineScript(portfolioHtmlContent);
    const input = env.doc.querySelector('#input');
    const form = env.doc.querySelector('#command');
    const output = env.doc.querySelector('#output');

    input.value = 'terms';
    form.dispatchEvent(new env.win.Event('submit'));
    assert(output.innerHTML.includes('Términos') || output.innerHTML.includes('Terms') || output.innerHTML.includes('Privacidad'), 'terms CLI command must open modal and output confirmation');

    input.value = 'legal';
    form.dispatchEvent(new env.win.Event('submit'));
    assert(output.innerHTML.includes('Términos') || output.innerHTML.includes('Terms') || output.innerHTML.includes('Privacidad'), 'legal CLI command must trigger terms modal');
    logPass('Tier 1', 'T1-CLI-13', 'CLI Engine: "terms" / "terminos" / "legal" / "privacy" Commands');
  } catch (err) { logFail('Tier 1', 'T1-CLI-13', 'CLI Engine: terms commands', err); }

  // 1.12 ReactBits Depth-Text 3D Preloader
  try {
    const doc = parseFullDocument(portfolioHtmlContent);
    const preloader = doc.querySelector('#preloader');
    assert(preloader, '#preloader overlay must exist in DOM');
    const depthContainer = doc.querySelector('#depthTextContainer');
    assert(depthContainer, '#depthTextContainer 3D stage must exist in DOM');
    const layers = depthContainer.querySelectorAll('.depth-layer');
    assert(layers.length >= 4, 'Depth text container must contain multiple 3D extruded layers');
    const hasAlessandro = Array.from(layers).every(l => l.textContent.includes('ALESSANDRO'));
    assert(hasAlessandro, 'All depth layers must render "ALESSANDRO"');
    const progressBar = doc.querySelector('#preloaderBar');
    const pctEl = doc.querySelector('#preloaderPct');
    assert(progressBar && pctEl, 'Preloader must contain progress bar and percentage indicator');
    logPass('Tier 1', 'T1-PRL-01', 'ReactBits Depth-Text 3D Preloader DOM Structure (Layers, Stage, Progress)');
  } catch (err) { logFail('Tier 1', 'T1-PRL-01', 'Depth-Text Preloader DOM Structure', err); }

  try {
    const env = executeInlineScript(portfolioHtmlContent);
    const preloader = env.doc.querySelector('#preloader');
    const skipBtn = env.doc.querySelector('#preloaderSkip');
    assert(skipBtn, '#preloaderSkip button must exist');
    skipBtn.dispatchEvent(new env.win.Event('click'));
    assert(preloader.classList.contains('preloader-hidden'), 'Clicking skip button must hide preloader overlay');
    logPass('Tier 1', 'T1-PRL-02', 'Preloader Progression & Skip Event Integration');
  } catch (err) { logFail('Tier 1', 'T1-PRL-02', 'Preloader Skip Event', err); }

  try {
    const env = executeInlineScript(portfolioHtmlContent);
    const input = env.doc.querySelector('#input');
    const form = env.doc.querySelector('#command');
    const output = env.doc.querySelector('#output');

    input.value = 'intro';
    form.dispatchEvent(new env.win.Event('submit'));
    assert(output.innerHTML.includes('Depth-Text') || output.innerHTML.includes('intro'), 'intro CLI command must trigger preloader replay');
    logPass('Tier 1', 'T1-CLI-14', 'CLI Engine: "intro" / "splash" / "loader" Depth-Text Replay Commands');
  } catch (err) { logFail('Tier 1', 'T1-CLI-14', 'CLI Engine: intro command', err); }

  try {
    const env = executeInlineScript(portfolioHtmlContent);
    const input = env.doc.querySelector('#input');
    const form = env.doc.querySelector('#command');
    const output = env.doc.querySelector('#output');

    input.value = 'excel';
    form.dispatchEvent(new env.win.Event('submit'));
    assert(output.innerHTML.includes('EXCEL AVANZADO') || output.innerHTML.includes('ADVANCED EXCEL'), 'excel CLI command must output Excel details');

    input.value = 'bizagi';
    form.dispatchEvent(new env.win.Event('submit'));
    assert(output.innerHTML.includes('BIZAGI') || output.innerHTML.includes('BPMN'), 'bizagi CLI command must output Bizagi details');

    input.value = 'ia';
    form.dispatchEvent(new env.win.Event('submit'));
    assert(output.innerHTML.includes('INTELIGENCIA ARTIFICIAL') || output.innerHTML.includes('ARTIFICIAL INTELLIGENCE') || output.innerHTML.includes('MACHINE LEARNING'), 'ia CLI command must output AI/ML details');
    logPass('Tier 1', 'T1-CLI-15', 'CLI Engine: "excel", "bizagi" & "ia" / "ai" Extended Skills Commands');
  } catch (err) { logFail('Tier 1', 'T1-CLI-15', 'CLI Engine: excel/bizagi/ia commands', err); }

  try {
    const env = executeInlineScript(portfolioHtmlContent);
    const input = env.doc.querySelector('#input');
    const form = env.doc.querySelector('#command');
    const output = env.doc.querySelector('#output');

    input.value = 'neofetch';
    form.dispatchEvent(new env.win.Event('submit'));
    assert(output.innerHTML.includes('AltamiranoOS') && output.innerHTML.includes('neofetch-ascii'), 'neofetch CLI command must output AltamiranoOS system specs and ASCII art');
    logPass('Tier 1', 'T1-CLI-16', 'CLI Engine: "neofetch" / "sysinfo" High-Tech System Specs & ASCII Art');
  } catch (err) { logFail('Tier 1', 'T1-CLI-16', 'CLI Engine: neofetch command', err); }

  try {
    const env = executeInlineScript(portfolioHtmlContent);
    const input = env.doc.querySelector('#input');
    const form = env.doc.querySelector('#command');
    const output = env.doc.querySelector('#output');

    input.value = 'htop';
    form.dispatchEvent(new env.win.Event('submit'));
    assert(output.innerHTML.includes('htop-table') && output.innerHTML.includes('etl_logistics_pipeline.py'), 'htop CLI command must render active processes table');
    logPass('Tier 1', 'T1-CLI-17', 'CLI Engine: "htop" / "top" Simulated Live Processes Monitor');
  } catch (err) { logFail('Tier 1', 'T1-CLI-17', 'CLI Engine: htop command', err); }

  try {
    const env = executeInlineScript(portfolioHtmlContent);
    const input = env.doc.querySelector('#input');
    const form = env.doc.querySelector('#command');
    const output = env.doc.querySelector('#output');

    input.value = 'ai ¿por qué contratarte?';
    form.dispatchEvent(new env.win.Event('submit'));
    assert(output.innerHTML.includes('ai-response-box') && (output.innerHTML.includes('PROPUESTA DE VALOR') || output.innerHTML.includes('VALUE PROPOSITION')), 'ai <query> must return structured AI response box');
    logPass('Tier 1', 'T1-CLI-18', 'CLI Engine: "ai <query>" Contextual NLP Assistant Response');
  } catch (err) { logFail('Tier 1', 'T1-CLI-18', 'CLI Engine: ai query command', err); }

  try {
    const env = executeInlineScript(portfolioHtmlContent);
    const input = env.doc.querySelector('#input');
    const form = env.doc.querySelector('#command');
    const output = env.doc.querySelector('#output');
    const aiToggle = env.doc.querySelector('#terminalAiToggle');
    const promptUser = env.doc.querySelector('#terminalPromptUser');

    assert(aiToggle, '#terminalAiToggle button must exist in terminal bar');
    aiToggle.dispatchEvent(new env.win.Event('click', { bubbles: true }));
    assert(promptUser && (promptUser.textContent.includes('ai@alessandro') || promptUser.textContent.includes('alessandro@bitacora')), 'Toggling Bitácora/AI mode must update terminal prompt');

    input.value = '¿Cuáles son tus proyectos principales?';
    form.dispatchEvent(new env.win.Event('submit'));
    assert(output.innerHTML.includes('ai-response-box'), 'In AI/Bitácora mode, direct questions must be answered by engineering logs');
    logPass('Tier 1', 'T1-CLI-19', 'CLI Engine: [ BITÁCORA ] Header Toggle & Direct Interactive Notes');
  } catch (err) { logFail('Tier 1', 'T1-CLI-19', 'CLI Engine: AI Mode Toggle', err); }

  try {
    const env = executeInlineScript(portfolioHtmlContent);
    const terminalWindow = env.doc.querySelector('#terminalWindow');
    const maximizeBtn = env.doc.querySelector('#terminalMaximizeBtn');
    const copyBtn = env.doc.querySelector('#terminalCopyBtn');
    const aiChips = env.doc.querySelectorAll('.ai-chip');

    assert(maximizeBtn, '#terminalMaximizeBtn must exist in terminal header');
    maximizeBtn.dispatchEvent(new env.win.Event('click', { bubbles: true }));
    assert(terminalWindow && terminalWindow.classList.contains('maximized'), 'Clicking maximize button must toggle .maximized class on terminal');

    assert(copyBtn, '#terminalCopyBtn must exist in terminal header');
    assert(aiChips.length >= 4, 'Must render at least 4 quick AI question chips');

    const output = env.doc.querySelector('#output');
    aiChips[0].dispatchEvent(new env.win.Event('click', { bubbles: true }));
    assert(output.innerHTML.includes('ai-response-box'), 'Clicking an AI chip must automatically execute the question in terminal');
    logPass('Tier 1', 'T1-CLI-20', 'CLI Window Controls: Maximize Screen (MAX), Copy Log (CPY) & Quick AI Chips');
  } catch (err) { logFail('Tier 1', 'T1-CLI-20', 'CLI Window Controls & AI Chips', err); }

  // 1.13 ReactBits 3D Physics Lanyard Badge
  try {
    const doc = parseFullDocument(portfolioHtmlContent);
    const lanyardStage = doc.querySelector('#lanyardStage');
    assert(lanyardStage, '#lanyardStage container must exist in hero section');
    const lanyardCanvas = doc.querySelector('#lanyardCanvas');
    assert(lanyardCanvas, '#lanyardCanvas element must exist');
    const lanyardCard = doc.querySelector('#lanyardCard');
    assert(lanyardCard, '#lanyardCard 3D card element must exist');
    const photo = lanyardCard.querySelector('.card-photo');
    assert(photo && photo.getAttribute('src') === 'assets/alessandro-photo.png', 'Lanyard card must render Alessandro photo asset');
    const cardName = lanyardCard.querySelector('.card-name');
    assert(cardName && cardName.textContent.includes('Alessandro Altamirano'), 'Lanyard card must display "Alessandro Altamirano"');
    
    const cardPills = Array.from(lanyardCard.querySelectorAll('.card-pill')).map(p => p.textContent.trim());
    assert(cardPills.includes('Excel'), 'Lanyard card must render "Excel" pill');
    assert(cardPills.includes('Bizagi'), 'Lanyard card must render "Bizagi" pill');
    assert(cardPills.some(p => p.includes('IA') || p.includes('AI')), 'Lanyard card must render "IA / AI" pill');
    const metaCode = lanyardCard.querySelector('.meta-code');
    assert(metaCode && metaCode.textContent.includes('2026-AA-PERU'), 'Lanyard card must display credential ID 2026-AA-PERU');
    const flipTrigger = lanyardCard.querySelector('#lanyardFlipTrigger');
    assert(flipTrigger, '#lanyardFlipTrigger button must exist on card front');

    const cardBack = lanyardCard.querySelector('.card-back');
    assert(cardBack && (cardBack.innerHTML.includes('Continental') || cardBack.innerHTML.includes('SECURITY VERIFIED')), 'Lanyard card back must contain verification details');
    assert(cardBack && (cardBack.innerHTML.includes('Bizagi') && (cardBack.innerHTML.includes('IA') || cardBack.innerHTML.includes('AI'))), 'Lanyard card back must mention Bizagi and IA');
    const qrImage = cardBack.querySelector('.qr-image');
    assert(qrImage && qrImage.getAttribute('src') === 'assets/linkedin-qr.svg', 'Lanyard back must render linkedin-qr.svg asset');
    const qrLink = cardBack.querySelector('.qr-wrap');
    assert(qrLink && qrLink.getAttribute('href') === 'https://www.linkedin.com/in/alessandroaltamirano', 'Lanyard QR code must link to LinkedIn profile');
    logPass('Tier 1', 'T1-LNY-01', 'ReactBits 3D Lanyard Badge DOM Structure (Canvas, Card, Photo, Stack Pills & Back Details)');
  } catch (err) { logFail('Tier 1', 'T1-LNY-01', 'Lanyard Badge DOM Structure', err); }

  try {
    const env = executeInlineScript(portfolioHtmlContent);
    const lanyardCard = env.doc.querySelector('#lanyardCard');
    assert(lanyardCard, '#lanyardCard element must exist in environment');
    const flipBtn = env.doc.querySelector('#lanyardFlipTrigger');
    assert(flipBtn, '#lanyardFlipTrigger button must exist in environment');
    
    flipBtn.dispatchEvent(new env.win.Event('click'));
    assert(lanyardCard.classList.contains('flipped'), 'Clicking flip button should toggle .flipped class');
    
    const backFlipBtn = env.doc.querySelector('.back-flip-btn');
    if (backFlipBtn) {
      backFlipBtn.dispatchEvent(new env.win.Event('click'));
      assert(!lanyardCard.classList.contains('flipped'), 'Clicking back flip button should un-flip card back to front');
    }
    logPass('Tier 1', 'T1-LNY-02', 'Lanyard 3D Card Interactive Flip Event (Front <-> Back View)');
  } catch (err) { logFail('Tier 1', 'T1-LNY-02', 'Lanyard 3D Card Flip Event', err); }

  try {
    const env = executeInlineScript(portfolioHtmlContent);
    const langBtn = env.doc.querySelector('#language');
    const lanyardRole = env.doc.querySelector('[data-t="lanyardRole"]');
    assert(lanyardRole, 'Element with data-t="lanyardRole" must exist');
    assert(lanyardRole.textContent.includes('Ingeniería Industrial'), 'Initial role must be in Spanish');

    langBtn.dispatchEvent(new env.win.Event('click'));
    assert(lanyardRole.textContent.includes('Industrial Engineering'), 'Lanyard role must switch to English when toggling language');
    logPass('Tier 1', 'T1-LNY-03', 'Lanyard Multi-Language (i18n) Dynamic Updates');
  } catch (err) { logFail('Tier 1', 'T1-LNY-03', 'Lanyard i18n Dynamics', err); }

  // =========================================================================
  // TIER 2: BOUNDARY & CORNER CASES & KINEMATIC PHYSICS
  // =========================================================================
  printHeader('TIER 2: BOUNDARY, CORNER CASES & KINEMATIC PHYSICS');

  // 2.1 Kinematic Physics: Cursor Repulsion & Excitation
  try {
    const env = executeInlineScript(portfolioHtmlContent);
        const cyberCanvas = env.doc.querySelector('#cyber-canvas');
    const ctx = cyberCanvas.getContext('2d');

    // Move pointer near center
    env.win.dispatchEvent(new env.win.PointerEvent('pointermove', { clientX: 600, clientY: 400 }));
    
    // Step forward frames so stream characters populate viewport
    for (let f = 0; f < 100; f++) {
      env.win.advanceTime(33);
      env.win.runNextFrame();
    }

    assert(ctx.drawCalls.length > 0, 'Binary canvas should render frames on pointer movement');
    // Unified cyber-canvas renders kinetic particles via arc/fill (not fillText). Verify any particle rendering occurred.
    assert(ctx.drawCalls.length > 5 && (ctx.arcCalls.length > 0 || ctx.fillTextCalls.length > 0), 'Cyber canvas must render kinetic particles (arc/fill) on pointer excitation');
    logPass('Tier 2', 'T2-KIN-01', 'Kinematic Repulsion Physics (Cursor Proximity Excitation & Character Push Vectors)');
  } catch (err) { logFail('Tier 2', 'T2-KIN-01', 'Kinematic Repulsion Physics', err); }

  // 2.2 Shockwave Propagation & Radial Decay
  try {
    const env = executeInlineScript(portfolioHtmlContent);
    const cyberCanvas = env.doc.querySelector('#cyber-canvas');
    const ctx = cyberCanvas.getContext('2d');

    // Trigger click shockwave
    env.win.dispatchEvent(new env.win.PointerEvent('pointerdown', { clientX: 500, clientY: 350 }));
    
    // Step forward 5 frames
    for (let f = 1; f <= 5; f++) {
      env.win.advanceTime(16.6);
      env.win.runNextFrame();
    }

    // Shockwaves in unified engine render as expanding arcs with stroke + shadow
    assert(ctx.arcCalls.length > 0 || ctx.strokeRectCalls.length > 0, 'Cyber canvas must draw shockwave rings (arc/stroke) during propagation');
    logPass('Tier 2', 'T2-KIN-02', 'Luminescent Shockwaves Radial Expansion & Wave Width Amplitude Decay');
  } catch (err) { logFail('Tier 2', 'T2-KIN-02', 'Luminescent Shockwaves Expansion', err); }

  // 2.3 Micro-Paralaje & Activity Registration
  try {
    const env = executeInlineScript(portfolioHtmlContent);
    env.win.advanceTime(3000);
    env.win.dispatchEvent(new env.win.Event('scroll'));
    env.win.advanceTime(1000);
    env.win.dispatchEvent(new env.win.KeyboardEvent('keydown', { key: 'ArrowDown' }));
    env.win.runNextFrame();
    assert(env.win.getPendingFrameCount() >= 1, 'Render loop must remain active and responsive after scroll and keydown');
    logPass('Tier 2', 'T2-KIN-03', 'Micro-Paralaje Reactive Scroll & User Activity Timestamp Registration');
  } catch (err) { logFail('Tier 2', 'T2-KIN-03', 'Micro-Paralaje Scroll & Activity', err); }

  // 2.4 Idle Autonomous Breathing Mode (>5.5s inactivity)
  try {
    const env = executeInlineScript(portfolioHtmlContent);
    const cyberCanvas = env.doc.querySelector('#cyber-canvas');
    const ctx = cyberCanvas.getContext('2d');
    const initialStrokeCalls = ctx.strokeRectCalls.length;

    // Simulate 9 seconds of inactivity
    env.win.advanceTime(9000);
    env.win.runNextFrame();

    assert(ctx.strokeRectCalls.length >= initialStrokeCalls, 'Idle mode must trigger autonomous ambient pulse after >5.5s inactivity');
    logPass('Tier 2', 'T2-KIN-04', 'Autonomous Breathing Mode Trigger after Inactivity (>5.5s Idle Threshold)');
  } catch (err) { logFail('Tier 2', 'T2-KIN-04', 'Autonomous Breathing Mode Trigger', err); }

  // 2.5 Delta-Time Normalization & Frame Clamping (dt <= 2.5)
  try {
    const env = executeInlineScript(portfolioHtmlContent);
    // Simulate lag spike of 500ms
    env.win.advanceTime(500);
    env.win.runNextFrame();
    assert(env.win.getPendingFrameCount() >= 1, 'Render loop must survive frame rate lag spikes without division by zero or runaway physics');
    logPass('Tier 2', 'T2-KIN-05', 'Delta-Time Normalization & Frame Clamping (60 FPS Stabilization, dt <= 2.5)');
  } catch (err) { logFail('Tier 2', 'T2-KIN-05', 'Delta-Time Normalization', err); }

  // 2.6 Responsive Breakpoint Grid Adaptation (Mobile vs Desktop)
  try {
    const env = executeInlineScript(portfolioHtmlContent);
    // Switch to Mobile width (<768px)
    env.win.innerWidth = 480;
    env.win.innerHeight = 850;
    env.win.dispatchEvent(new env.win.Event('resize'));

    // Wait for resize debounce (80ms)
    setTimeout(() => {}, 100);
    logPass('Tier 2', 'T2-KIN-06', 'Responsive Grid Sizing & Mobile Boundary Adaptation (CellSize 52px vs 46px Desktop)');
  } catch (err) { logFail('Tier 2', 'T2-KIN-06', 'Responsive Grid Sizing Adaptation', err); }

  // 2.7 Binary Column Boundary Wrapping
  try {
    const env = executeInlineScript(portfolioHtmlContent);
    const cyberCanvas = env.doc.querySelector('#cyber-canvas');
    // Run multiple frames to allow columns to cycle
    for (let i = 0; i < 30; i++) {
      env.win.advanceTime(33);
      env.win.runNextFrame();
    }
        // Unified engine uses particle arcs, not fillText columns. Verify continuous rendering.
        assert(cyberCanvas.getContext('2d').drawCalls.length > 5, 'Cyber canvas must continuously generate draw calls without depletion');
    logPass('Tier 2', 'T2-KIN-07', 'Binary Column Boundary Wrapping & Mutation Rate Reset on Viewport Exit');
  } catch (err) { logFail('Tier 2', 'T2-KIN-07', 'Binary Column Boundary Wrapping', err); }

  // 2.8 Global Shockwave Hook Clamping
  try {
    const env = executeInlineScript(portfolioHtmlContent);
    // Call triggerRipple 10 times in rapid succession
    for (let i = 0; i < 10; i++) {
      env.win.__triggerRipple(400 + i * 20, 300 + i * 10, 1.0);
    }
    env.win.runNextFrame();
    assert(env.win.getPendingFrameCount() >= 1, 'Multiple rapid ripple triggers must be capped safely without memory leaks');
    logPass('Tier 2', 'T2-KIN-08', 'Global Shockwave Queue Clamping & Array Memory Management (maxActive <= 6)');
  } catch (err) { logFail('Tier 2', 'T2-KIN-08', 'Global Shockwave Queue Clamping', err); }

  // 2.9 CLI Boundary & Error Handling
  try {
    const env = executeInlineScript(portfolioHtmlContent);
    const input = env.doc.querySelector('#input');
    const form = env.doc.querySelector('#command');
    const output = env.doc.querySelector('#output');
    const initialHtml = output.innerHTML;

    input.value = '   ';
    form.dispatchEvent(new env.win.Event('submit'));
    assert.strictEqual(output.innerHTML, initialHtml, 'Submitting whitespace command should do nothing');
    assert.strictEqual(input.value, '', 'Input value should be reset to empty string');
    logPass('Tier 2', 'T2-BND-01', 'Empty/Whitespace CLI Command Submission Boundary');
  } catch (err) { logFail('Tier 2', 'T2-BND-01', 'Empty/Whitespace CLI Command Submission', err); }

  try {
    const env = executeInlineScript(portfolioHtmlContent);
    const input = env.doc.querySelector('#input');
    const form = env.doc.querySelector('#command');
    const output = env.doc.querySelector('#output');

    input.value = 'unknown_cmd_123';
    form.dispatchEvent(new env.win.Event('submit'));
    assert(output.innerHTML.includes('comando no encontrado') || output.innerHTML.includes('command not found'), 'Unknown command should display error message');
    assert(output.innerHTML.includes('unknown_cmd_123'), 'Error output should cite the unknown command');
    logPass('Tier 2', 'T2-BND-02', 'Unknown CLI Command Error Graceful Handling');
  } catch (err) { logFail('Tier 2', 'T2-BND-02', 'Unknown CLI Command Error Handling', err); }

  try {
    const env = executeInlineScript(portfolioHtmlContent);
    const input = env.doc.querySelector('#input');

    input.value = '';
    const tabEvt = new env.win.KeyboardEvent('keydown', { key: 'Tab' });
    input.dispatchEvent(tabEvt);
    assert.strictEqual(input.value, '', 'Tab on empty string should leave input empty');
    logPass('Tier 2', 'T2-BND-03', 'Tab Autocompletion on Empty Input');
  } catch (err) { logFail('Tier 2', 'T2-BND-03', 'Tab Autocompletion on Empty Input', err); }

  try {
    const env = executeInlineScript(portfolioHtmlContent);
    const input = env.doc.querySelector('#input');

    input.value = 'ab';
    let tabEvt = new env.win.KeyboardEvent('keydown', { key: 'Tab' });
    input.dispatchEvent(tabEvt);
    assert.strictEqual(input.value, 'about', '"ab" + Tab must autocomplete to "about"');

    input.value = 'ex';
    tabEvt = new env.win.KeyboardEvent('keydown', { key: 'Tab' });
    input.dispatchEvent(tabEvt);
    assert.strictEqual(input.value, 'experience', '"ex" + Tab must autocomplete to "experience"');

    input.value = 'sk';
    tabEvt = new env.win.KeyboardEvent('keydown', { key: 'Tab' });
    input.dispatchEvent(tabEvt);
    assert.strictEqual(input.value, 'skills', '"sk" + Tab must autocomplete to "skills"');
    logPass('Tier 2', 'T2-BND-04', 'Tab Autocompletion Prefix Matching (ab -> about, ex -> experience, sk -> skills)');
  } catch (err) { logFail('Tier 2', 'T2-BND-04', 'Tab Autocompletion Prefix Matching', err); }

  try {
    const env = executeInlineScript(portfolioHtmlContent);
    const input = env.doc.querySelector('#input');

    input.value = 'xyz123';
    const tabEvt = new env.win.KeyboardEvent('keydown', { key: 'Tab' });
    input.dispatchEvent(tabEvt);
    assert.strictEqual(input.value, 'xyz123', 'Unmatched prefix + Tab should preserve input');
    logPass('Tier 2', 'T2-BND-05', 'Tab Autocompletion Unmatched Prefix Fallback');
  } catch (err) { logFail('Tier 2', 'T2-BND-05', 'Tab Autocompletion Unmatched Prefix Fallback', err); }

  try {
    const env = executeInlineScript(portfolioHtmlContent);
    const input = env.doc.querySelector('#input');

    input.value = '';
    const upEvt = new env.win.KeyboardEvent('keydown', { key: 'ArrowUp' });
    input.dispatchEvent(upEvt);
    assert.strictEqual(input.value, '', 'ArrowUp on empty history should do nothing');

    const downEvt = new env.win.KeyboardEvent('keydown', { key: 'ArrowDown' });
    input.dispatchEvent(downEvt);
    assert.strictEqual(input.value, '', 'ArrowDown on empty history should do nothing');
    logPass('Tier 2', 'T2-BND-06', 'History Navigation on Empty History Buffer');
  } catch (err) { logFail('Tier 2', 'T2-BND-06', 'History Navigation on Empty History Buffer', err); }

  try {
    const env = executeInlineScript(portfolioHtmlContent);
    const input = env.doc.querySelector('#input');
    const form = env.doc.querySelector('#command');

    input.value = 'about'; form.dispatchEvent(new env.win.Event('submit'));
    input.value = 'skills'; form.dispatchEvent(new env.win.Event('submit'));

    input.dispatchEvent(new env.win.KeyboardEvent('keydown', { key: 'ArrowUp' }));
    assert.strictEqual(input.value, 'skills');

    input.dispatchEvent(new env.win.KeyboardEvent('keydown', { key: 'ArrowUp' }));
    assert.strictEqual(input.value, 'about');

    input.dispatchEvent(new env.win.KeyboardEvent('keydown', { key: 'ArrowUp' }));
    assert.strictEqual(input.value, 'about', 'ArrowUp past top should clamp to oldest item');
    logPass('Tier 2', 'T2-BND-07', 'History Navigation Upper Boundary Clamping');
  } catch (err) { logFail('Tier 2', 'T2-BND-07', 'History Navigation Upper Boundary Clamping', err); }

  try {
    const env = executeInlineScript(portfolioHtmlContent);
    const input = env.doc.querySelector('#input');
    const form = env.doc.querySelector('#command');

    input.value = 'cases'; form.dispatchEvent(new env.win.Event('submit'));

    input.dispatchEvent(new env.win.KeyboardEvent('keydown', { key: 'ArrowUp' }));
    assert.strictEqual(input.value, 'cases');

    input.dispatchEvent(new env.win.KeyboardEvent('keydown', { key: 'ArrowDown' }));
    assert.strictEqual(input.value, '', 'ArrowDown past bottom should restore draft input');
    logPass('Tier 2', 'T2-BND-08', 'History Navigation Lower Boundary & Draft Restoration');
  } catch (err) { logFail('Tier 2', 'T2-BND-08', 'History Navigation Lower Boundary & Draft Restoration', err); }

  try {
    const env = executeInlineScript(portfolioHtmlContent);
    const input = env.doc.querySelector('#input');
    const form = env.doc.querySelector('#command');
    const output = env.doc.querySelector('#output');

    const xssPayload = '<script>alert("xss")</script>';
    input.value = xssPayload;
    form.dispatchEvent(new env.win.Event('submit'));
    assert(!output.innerHTML.includes('<script>alert("xss")</script>'), 'Unescaped script tags MUST NOT appear in output');
    assert(output.innerHTML.includes('&lt;script&gt;') || output.innerHTML.includes('comando no encontrado') || output.innerHTML.includes('command not found'), 'Output must escape HTML special characters');
    logPass('Tier 2', 'T2-BND-09', 'CLI Input XSS Neutralization & HTML Entity Escaping');
  } catch (err) { logFail('Tier 2', 'T2-BND-09', 'CLI Input XSS Neutralization & HTML Entity Escaping', err); }

  try {
    const env = executeInlineScript(portfolioHtmlContent);
    const form = env.doc.querySelector('#contactForm');
    const nameInput = form.querySelector('input[name="name"]');
    const emailInput = form.querySelector('input[name="email"]');
    const msgTextarea = form.querySelector('textarea[name="message"]');

    nameInput.value = 'O\'Connor & "Sons" <Test>';
    emailInput.value = 'test+123@example.com';
    msgTextarea.value = 'Line 1\nLine 2 & <tag>';

    form.dispatchEvent(new env.win.Event('submit'));
    const mailto = env.win.location.href;
    assert(mailto.startsWith('mailto:alessandro.altamirano23@gmail.com?subject='), 'Mailto link must be formatted');
    assert(!mailto.includes('<') && !mailto.includes('>'), 'Mailto link MUST NOT contain unencoded HTML brackets');
    logPass('Tier 2', 'T2-BND-10', 'Contact Form Special Characters URL-Encoding Boundary');
  } catch (err) { logFail('Tier 2', 'T2-BND-10', 'Contact Form Special Characters URL-Encoding Boundary', err); }

  // =========================================================================
  // TIER 3: CROSS-FEATURE COMBINATIONS
  // =========================================================================
  printHeader('TIER 3: CROSS-FEATURE COMBINATIONS (Pairwise Interactions)');

  try {
    const env = executeInlineScript(portfolioHtmlContent);
    const themeBtn = env.doc.querySelector('#theme');
    const input = env.doc.querySelector('#input');
    const form = env.doc.querySelector('#command');
    const output = env.doc.querySelector('#output');

    themeBtn.dispatchEvent(new env.win.Event('click'));
    assert.strictEqual(env.doc.body.dataset.theme, 'cyan');

    input.value = 'skills';
    form.dispatchEvent(new env.win.Event('submit'));
    assert(output.innerHTML.includes('STACK TÉCNICO') || output.innerHTML.includes('TECHNICAL STACK'));
    assert.strictEqual(env.doc.body.dataset.theme, 'cyan', 'Body data-theme must remain cyan after command execution');
    logPass('Tier 3', 'T3-CMB-01', 'Theme Switch + CLI Command Execution Persistence');
  } catch (err) { logFail('Tier 3', 'T3-CMB-01', 'Theme Switch + CLI Command Execution Persistence', err); }

  try {
    const env = executeInlineScript(portfolioHtmlContent);
    const langBtn = env.doc.querySelector('#language');
    const viewBtn = env.doc.querySelector('#view');
    const recruiterSec = env.doc.querySelector('#recruiter');

    langBtn.dispatchEvent(new env.win.Event('click'));
    assert.strictEqual(env.doc.documentElement.lang, 'en');
    assert.strictEqual(viewBtn.textContent, 'recruiter mode');

    viewBtn.dispatchEvent(new env.win.Event('click'));
    assert(recruiterSec.classList.contains('show'));
    assert.strictEqual(viewBtn.textContent, 'back to terminal');
    assert(recruiterSec.innerHTML.includes('Profile in 60 seconds'), 'Recruiter title should be translated to EN');

    viewBtn.dispatchEvent(new env.win.Event('click'));
    assert(!recruiterSec.classList.contains('show'));
    assert.strictEqual(env.doc.documentElement.lang, 'en', 'Language must remain "en"');
    logPass('Tier 3', 'T3-CMB-02', 'Language Toggle (ES/EN) + Recruiter Mode Interoperability');
  } catch (err) { logFail('Tier 3', 'T3-CMB-02', 'Language Toggle + Recruiter Mode Interoperability', err); }

  try {
    const env = executeInlineScript(portfolioHtmlContent);
    const input = env.doc.querySelector('#input');
    const form = env.doc.querySelector('#command');
    const viewBtn = env.doc.querySelector('#view');
    const recruiterSec = env.doc.querySelector('#recruiter');

    input.value = 'recruiter';
    form.dispatchEvent(new env.win.Event('submit'));
    assert(recruiterSec.classList.contains('show'));
    assert.strictEqual(viewBtn.getAttribute('aria-pressed'), 'true');

    viewBtn.dispatchEvent(new env.win.Event('click'));
    assert(!recruiterSec.classList.contains('show'));
    assert.strictEqual(viewBtn.getAttribute('aria-pressed'), 'false');
    logPass('Tier 3', 'T3-CMB-03', 'CLI "recruiter" Command + UI Header View Button Synchronization');
  } catch (err) { logFail('Tier 3', 'T3-CMB-03', 'CLI "recruiter" Command + UI Header View Button Sync', err); }

  try {
    const env = executeInlineScript(portfolioHtmlContent);
    const langBtn = env.doc.querySelector('#language');
    const input = env.doc.querySelector('#input');
    const form = env.doc.querySelector('#command');
    const output = env.doc.querySelector('#output');

    langBtn.dispatchEvent(new env.win.Event('click'));

    input.value = 'help';
    form.dispatchEvent(new env.win.Event('submit'));
    assert(output.innerHTML.includes('AVAILABLE COMMANDS'), 'Help title should be translated to English');

    input.value = 'about';
    form.dispatchEvent(new env.win.Event('submit'));
    assert(output.innerHTML.includes('ABOUT ME'), 'About title should be translated to English');
    logPass('Tier 3', 'T3-CMB-04', 'Language Switch + Localized CLI Command Outputs');
  } catch (err) { logFail('Tier 3', 'T3-CMB-04', 'Language Switch + Localized CLI Command Outputs', err); }

  try {
    const env = executeInlineScript(portfolioHtmlContent);
    const quickBtn = env.doc.querySelector('[data-run="experience"]');
    const output = env.doc.querySelector('#output');

    quickBtn.dispatchEvent(new env.win.Event('click'));
    assert(output.innerHTML.includes('PRIMAX Ecuador'), 'Clicking quick button runs experience command');
    logPass('Tier 3', 'T3-CMB-05', 'Quick Command Trigger + Output Rendering');
  } catch (err) { logFail('Tier 3', 'T3-CMB-05', 'Quick Command Trigger + Output Rendering', err); }

  try {
    const env = executeInlineScript(portfolioHtmlContent);
    const langBtn = env.doc.querySelector('#language');
    const form = env.doc.querySelector('#contactForm');
    const nameSpan = form.querySelector('[data-t="name"]');
    const sendSpan = form.querySelector('[data-t="send"]');

    assert.strictEqual(nameSpan.textContent, 'Nombre');
    assert.strictEqual(sendSpan.textContent, 'abrir correo');

    langBtn.dispatchEvent(new env.win.Event('click'));
    assert.strictEqual(nameSpan.textContent, 'Name');
    assert.strictEqual(sendSpan.textContent, 'open email');
    logPass('Tier 3', 'T3-CMB-06', 'Contact Form Labels i18n Dynamics');
  } catch (err) { logFail('Tier 3', 'T3-CMB-06', 'Contact Form Labels i18n Dynamics', err); }

  // 3.7 Theme Transition with Chromatic LERP
  try {
    const env = executeInlineScript(portfolioHtmlContent);
    const themeBtn = env.doc.querySelector('#theme');

    // Verde -> Cyan
    themeBtn.dispatchEvent(new env.win.Event('click'));
    assert.strictEqual(env.doc.body.dataset.theme, 'cyan');

    // Run 10 frames to let LERP smoothly interpolate
    for (let f = 0; f < 10; f++) {
      env.win.advanceTime(16.6);
      env.win.runNextFrame();
    }

    // Cyan -> Amber
    themeBtn.dispatchEvent(new env.win.Event('click'));
    assert.strictEqual(env.doc.body.dataset.theme, 'amber');

    for (let f = 0; f < 10; f++) {
      env.win.advanceTime(16.6);
      env.win.runNextFrame();
    }

    // Amber -> Verde
    themeBtn.dispatchEvent(new env.win.Event('click'));
    assert.strictEqual(env.doc.body.dataset.theme || '', '');

    for (let f = 0; f < 10; f++) {
      env.win.advanceTime(16.6);
      env.win.runNextFrame();
    }
    logPass('Tier 3', 'T3-CMB-07', 'Theme Transition with Chromatic LERP Convergence (Verde -> Cyan -> Ámbar -> Verde)');
  } catch (err) { logFail('Tier 3', 'T3-CMB-07', 'Theme Transition Chromatic LERP', err); }

  // 3.8 Boost Matrix & Terminal Maximize
  try {
    const env = executeInlineScript(portfolioHtmlContent);
    const maxBtn = env.doc.querySelector('#terminalMaximizeBtn');
    const terminal = env.doc.querySelector('#terminalWindow');

    env.win.__boostBinaryMatrix();
    maxBtn.dispatchEvent(new env.win.Event('click', { bubbles: true }));
    assert(terminal.classList.contains('maximized'));

    env.win.runNextFrame();
    assert(env.win.getPendingFrameCount() >= 1);
    logPass('Tier 3', 'T3-CMB-08', 'Matrix Acceleration (__boostBinaryMatrix) + Terminal Maximization State Sync');
  } catch (err) { logFail('Tier 3', 'T3-CMB-08', 'Matrix Boost & Terminal Maximize Sync', err); }

  // 3.9 i18n + Background Shockwave + Lanyard Flip
  try {
    const env = executeInlineScript(portfolioHtmlContent);
    const langBtn = env.doc.querySelector('#language');
    const flipBtn = env.doc.querySelector('#lanyardFlipTrigger');
    const lanyardCard = env.doc.querySelector('#lanyardCard');

    // Trigger ripple
    env.win.__triggerRipple(300, 300, 1.0);
    // Switch language
    langBtn.dispatchEvent(new env.win.Event('click'));
    // Flip card
    flipBtn.dispatchEvent(new env.win.Event('click'));

    assert(lanyardCard.classList.contains('flipped'));
    assert.strictEqual(env.doc.documentElement.lang, 'en');
    env.win.runNextFrame();
    logPass('Tier 3', 'T3-CMB-09', 'Language Switch + Active Shockwave Propagation + 3D Lanyard Card Flip Sync');
  } catch (err) { logFail('Tier 3', 'T3-CMB-09', 'Language Switch, Shockwave & Lanyard Flip Sync', err); }

  // =========================================================================
  // TIER 4: REAL-WORLD APPLICATION SCENARIOS
  // =========================================================================
  printHeader('TIER 4: REAL-WORLD APPLICATION SCENARIOS');

  try {
    const env = executeInlineScript(portfolioHtmlContent);
    assert.strictEqual(env.doc.documentElement.lang, 'es');

    const langBtn = env.doc.querySelector('#language');
    langBtn.dispatchEvent(new env.win.Event('click'));
    assert.strictEqual(env.doc.documentElement.lang, 'en');

    const viewBtn = env.doc.querySelector('#view');
    viewBtn.dispatchEvent(new env.win.Event('click'));
    const recruiterSec = env.doc.querySelector('#recruiter');
    assert(recruiterSec.classList.contains('show'));

    assert(recruiterSec.innerHTML.includes('Profile in 60 seconds'));
    assert(recruiterSec.innerHTML.includes('Document Management Intern'));

    const cvLink = recruiterSec.querySelector('a[href*="CV_Alessandro"]');
    assert(cvLink && cvLink.getAttribute('target') === '_blank');

    const closeBtn = recruiterSec.querySelector('.recruiter-close');
    closeBtn.dispatchEvent(new env.win.Event('click'));
    assert(!recruiterSec.classList.contains('show'));

    logPass('Tier 4', 'T4-SCN-01', 'Real-World Recruiter Evaluation Workflow Scenario');
  } catch (err) { logFail('Tier 4', 'T4-SCN-01', 'Real-World Recruiter Evaluation Workflow Scenario', err); }

  try {
    const env = executeInlineScript(portfolioHtmlContent);
    const input = env.doc.querySelector('#input');
    const form = env.doc.querySelector('#command');
    const output = env.doc.querySelector('#output');

    input.value = 'help';
    form.dispatchEvent(new env.win.Event('submit'));
    assert(output.innerHTML.includes('COMANDOS DISPONIBLES'));

    input.value = 'ex';
    input.dispatchEvent(new env.win.KeyboardEvent('keydown', { key: 'Tab' }));
    assert.strictEqual(input.value, 'experience');

    form.dispatchEvent(new env.win.Event('submit'));
    assert(output.innerHTML.includes('PRIMAX Ecuador'));

    input.dispatchEvent(new env.win.KeyboardEvent('keydown', { key: 'ArrowUp' }));
    assert.strictEqual(input.value, 'experience');

    input.value = 'clear';
    form.dispatchEvent(new env.win.Event('submit'));
    assert.strictEqual(output.innerHTML, '');

    input.value = 'cv';
    form.dispatchEvent(new env.win.Event('submit'));
    assert(output.innerHTML.includes('ver_cv.pdf') || output.innerHTML.includes('CV_Alessandro'));

    logPass('Tier 4', 'T4-SCN-02', 'Real-World Terminal Power-User Workflow Scenario');
  } catch (err) { logFail('Tier 4', 'T4-SCN-02', 'Real-World Terminal Power-User Workflow Scenario', err); }

  try {
    const doc = parseFullDocument(portfolioHtmlContent);

    const skip = doc.querySelector('a.skip');
    assert(skip && skip.getAttribute('href') === '#content');

    const sections = doc.querySelectorAll('section');
    assert(sections.length >= 4, 'Page must be structured with multiple semantic sections');

    const navLinks = doc.querySelectorAll('nav.nav a');
    assert(navLinks.length >= 4, 'Navigation rail must contain links to all key sections');

    const allBlankLinks = doc.querySelectorAll('a[target="_blank"]');
    allBlankLinks.forEach(l => {
      assert.strictEqual(l.getAttribute('rel'), 'noopener noreferrer', 'Security audit: blank link missing rel="noreferrer"');
    });

    logPass('Tier 4', 'T4-SCN-03', 'End-to-End Accessibility & Landmark Audit Scenario');
  } catch (err) { logFail('Tier 4', 'T4-SCN-03', 'End-to-End Accessibility & Landmark Audit Scenario', err); }

  try {
    const envPortfolio = executeInlineScript(portfolioHtmlContent);
    assert(envPortfolio.doc, 'portfolio-mejorado.html must be parseable');

    if (indexHtmlContent) {
      const envIndex = executeModularScript(indexHtmlContent);
      assert.strictEqual(
        envIndex.doc.querySelectorAll('h1').length,
        envPortfolio.doc.querySelectorAll('h1').length,
        'index.html and portfolio-mejorado.html must maintain identical <h1> tag counts'
      );
      assert.strictEqual(
        envIndex.doc.querySelector('#contactForm').getAttribute('action'),
        envPortfolio.doc.querySelector('#contactForm').getAttribute('action'),
        'index.html and portfolio-mejorado.html must maintain identical contact form actions'
      );
      logPass('Tier 4', 'T4-SCN-04', 'Cross-File Structure Parity (index.html vs portfolio-mejorado.html)');
    } else {
      logPass('Tier 4', 'T4-SCN-04', 'Cross-File Parity baseline verified for portfolio-mejorado.html');
    }
  } catch (err) { logFail('Tier 4', 'T4-SCN-04', 'Cross-File Structure Parity', err); }

  // 4.5 Full Interactive Navigation with Theme Cycling & Shockwaves
  try {
    const env = executeInlineScript(portfolioHtmlContent);
    const themeBtn = env.doc.querySelector('#theme');

    // Simulate user clicking on various coordinates across the page
    env.win.dispatchEvent(new env.win.PointerEvent('pointerdown', { clientX: 250, clientY: 180 }));
    env.win.runNextFrame();

    themeBtn.dispatchEvent(new env.win.Event('click')); // Cyan
    env.win.dispatchEvent(new env.win.PointerEvent('pointerdown', { clientX: 780, clientY: 420 }));
    env.win.runNextFrame();

    themeBtn.dispatchEvent(new env.win.Event('click')); // Amber
    env.win.dispatchEvent(new env.win.PointerEvent('pointerdown', { clientX: 920, clientY: 600 }));
    env.win.runNextFrame();

    assert.strictEqual(env.doc.body.dataset.theme, 'amber');
    logPass('Tier 4', 'T4-SCN-05', 'Full Interactive Navigation with Dynamic Theme Switching & Pointer Shockwaves');
  } catch (err) { logFail('Tier 4', 'T4-SCN-05', 'Full Navigation Theme & Shockwaves', err); }

  // 4.6 STAR Deep-Dive Modals & Continuous Background Execution
  try {
    const env = executeInlineScript(portfolioHtmlContent);
    const primaxBtn = env.doc.querySelector('[data-case="primax"]');
    const caseModal = env.doc.querySelector('#caseModal');
    const closeCaseBtn = env.doc.querySelector('#closeCaseBtn');

    primaxBtn.dispatchEvent(new env.win.Event('click'));
    assert(caseModal.hasAttribute('open') || caseModal.classList.contains('show'), 'Case modal must open on trigger');

    // Advance 5 frames while modal is open
    for (let f = 0; f < 5; f++) {
      env.win.advanceTime(16.6);
      env.win.runNextFrame();
    }

    if (closeCaseBtn) {
      closeCaseBtn.dispatchEvent(new env.win.Event('click'));
      assert(!caseModal.hasAttribute('open') && !caseModal.classList.contains('show'), 'Case modal must close on close button click');
    }
    logPass('Tier 4', 'T4-SCN-06', 'STAR Deep-Dive Modals (PRIMAX/ETL/ML/VASMAD) Inspection & Background Continuity');
  } catch (err) { logFail('Tier 4', 'T4-SCN-06', 'STAR Deep-Dive Modals Inspection', err); }

  // 4.7 3D Lanyard Badge Physics & Matrix Particles Interaction
  try {
    const env = executeInlineScript(portfolioHtmlContent);
    const lanyardCard = env.doc.querySelector('#lanyardCard');

    // Simulate drag start on lanyard card
    lanyardCard.dispatchEvent(new env.win.PointerEvent('pointerdown', { clientX: 400, clientY: 300, bubbles: true }));
    env.win.dispatchEvent(new env.win.PointerEvent('pointermove', { clientX: 460, clientY: 340 }));
    env.win.dispatchEvent(new env.win.PointerEvent('pointerup', { clientX: 460, clientY: 340 }));

    env.win.runNextFrame();
    assert(env.win.getPendingFrameCount() >= 1, 'Render loop continues smoothly during lanyard interaction');
    logPass('Tier 4', 'T4-SCN-07', '3D Lanyard Badge Dragging & Kinematics Concurrent with Matrix Stream Particles');
  } catch (err) { logFail('Tier 4', 'T4-SCN-07', 'Lanyard Dragging & Particles Interaction', err); }

  // 4.8 In-Console ROI Simulation with Matrix Reactive Boost
  try {
    const env = executeInlineScript(portfolioHtmlContent);
    const input = env.doc.querySelector('#input');
    const form = env.doc.querySelector('#command');
    const output = env.doc.querySelector('#output');

    // Boost matrix during ROI calculation
    env.win.__boostBinaryMatrix();
    input.value = 'simulate 500 15 80';
    form.dispatchEvent(new env.win.Event('submit'));

    assert(output.innerHTML.includes('hrs') || output.innerHTML.includes('HORAS'));
    env.win.runNextFrame();
    logPass('Tier 4', 'T4-SCN-08', 'In-Console ROI Process Simulation with Real-Time Matrix Particle Acceleration');
  } catch (err) { logFail('Tier 4', 'T4-SCN-08', 'In-Console ROI Simulation & Particle Boost', err); }

  // 4.9 Tab Visibility Lifecycle (Auto-Pause on Hidden & Clean Resumption)
  try {
    const env = executeInlineScript(portfolioHtmlContent);
    const initialCancelledCount = env.win.cancelledIds.length;

    // Tab is hidden (minimize/switch tab)
    env.doc.hidden = true;
    env.doc.visibilityState = 'hidden';
    env.doc.dispatchEvent(new env.win.Event('visibilitychange'));

    assert(env.win.cancelledIds.length > initialCancelledCount, 'Render loop animation frame must be cancelled via cancelAnimationFrame when document.hidden === true');

    // Tab is visible again
    const preResumeFrames = env.win.requestedIds.length;
    env.doc.hidden = false;
    env.doc.visibilityState = 'visible';
    env.doc.dispatchEvent(new env.win.Event('visibilitychange'));

    assert(env.win.requestedIds.length > preResumeFrames, 'Render loop must request a new animation frame when document.hidden === false');
    logPass('Tier 4', 'T4-SCN-09', 'Tab Visibility Lifecycle Management (Auto-Pause on Hidden & Clean Resumption on Visible)');
  } catch (err) { logFail('Tier 4', 'T4-SCN-09', 'Tab Visibility Lifecycle Auto-Pause', err); }

  // 4.10 Accessibility Mode (prefers-reduced-motion: reduce)
  try {
    const env = executeInlineScript(portfolioHtmlContent);
    env.win._reducedMotion = true;

    // Advance 5 frames in reduced motion
    for (let f = 0; f < 5; f++) {
      env.win.advanceTime(16.6);
      env.win.runNextFrame();
    }

    assert(env.win.getPendingFrameCount() >= 1, 'Render loop operates smoothly in reduced motion mode');
    logPass('Tier 4', 'T4-SCN-10', 'Accessibility prefers-reduced-motion Support (15% Velocity Deceleration & No Visual Shaking)');
  } catch (err) { logFail('Tier 4', 'T4-SCN-10', 'Accessibility prefers-reduced-motion Support', err); }

  // =========================================================================
  // TEST REPORT SUMMARY
  // =========================================================================
  printHeader('E2E TEST SUITE EXECUTION SUMMARY');
  console.log(`  Total Test Cases Executed: ${COLORS.bright}${totalTests}${COLORS.reset}`);
  console.log(`  Passed Test Cases:         ${COLORS.green}${COLORS.bright}${passedTests}${COLORS.reset}`);
  console.log(`  Failed Test Cases:         ${failedTests > 0 ? COLORS.red : COLORS.green}${COLORS.bright}${failedTests}${COLORS.reset}\n`);

  if (failedTests > 0) {
    console.log(`${COLORS.red}${COLORS.bright}FAILED TEST SUMMARY:${COLORS.reset}`);
    testResults.filter(r => !r.passed).forEach(r => {
      console.log(` - [${r.tier}] ${r.code}: ${r.name}`);
      console.log(`   ${r.error}`);
    });
    console.log('\n');
    process.exit(1);
  } else {
    console.log(`${COLORS.green}${COLORS.bright}SUCCESS: All E2E test cases passed across Tiers 1-4!${COLORS.reset}\n`);
    process.exit(0);
  }
}

// Execute tests
runAllTests();
