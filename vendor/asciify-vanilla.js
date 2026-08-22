/* ==========================================================================
   Canvas UI — Asciify (vanilla engine)
   Upstream: https://canvasui.dev/docs/components/asciify
   Source: https://github.com/DavidHDev/canvas-ui (src/lib/Asciify/AsciifyVanilla.ts)
   License: MIT + Commons Clause (free to use in your own projects).

   Local adaptations for this portfolio (marked with "ADAPTED"):
   1. TypeScript stripped to plain browser JS; wrapped in an IIFE exposing
      window.CanvasUIAsciify = { createAsciify, supportsHtmlInCanvas }.
   2. ADAPTED: pointer listeners attach to `window` instead of the output's
      parent — this layer sits beneath the UI shell (pointer-events: none)
      and would never receive pointer events itself.
   3. ADAPTED: instance gains a `refresh()` method that forces an immediate
      fallback recapture, required because the captured content here is an
      animated <canvas> (pixel changes emit no DOM mutations).
   Everything else is a faithful port of the upstream engine.
   ==========================================================================
   Asciify: a soft lens follows your cursor, redrawing the page beneath it
   as ascii characters. WebGL2 renderer with an automatic DOM-painting
   fallback for browsers without html-in-canvas support.
   ========================================================================== */
(function (global) {
  'use strict';

  var MAX_GLYPHS = 16;
  var FALLBACK_CAPTURE_DELAY = 500;

  var DEFAULTS = {
    radius: 0.4,
    softness: 1,
    scale: 2,
    spacing: 1,
    charset: 'ascii',
    glyphs: [],
    background: [0, 0, 0],
    backgroundOpacity: 0,
    contrast: 1,
    brightness: 0,
    invert: 0,
    strength: 1,
    baseStrength: 0,
    followSpeed: 3,
    glow: 0.75,
    aberration: 0.75,
  };

  var CHARSETS = {
    ascii: [
      0, 128, 131200, 14336, 459200, 469440, 4357252, 18157905, 11512810,
      15724526,
    ],
    blocks: [0, 328000, 22041621, 22369621, 11512810, 33554431],
    binary: [0, 4591758, 15324974],
  };

  var VERT = '#version 300 es\n' +
    'precision highp float;\n' +
    'layout(location = 0) in vec2 aPos;\n' +
    'out vec2 vUv;\n' +
    'void main () {\n' +
    '  vUv = aPos * 0.5 + 0.5;\n' +
    '  gl_Position = vec4(aPos, 0.0, 1.0);\n' +
    '}';

  var FRAG = '#version 300 es\n' +
    'precision highp float;\n' +
    'in vec2 vUv;\n' +
    'out vec4 outColor;\n' +
    'uniform sampler2D uContent;\n' +
    'uniform vec2 uContentOffset;\n' +
    'uniform vec2 uResolution;\n' +
    'uniform float uGlyphPx;\n' +
    'uniform float uSpacing;\n' +
    'uniform uint uGlyphs[' + MAX_GLYPHS + '];\n' +
    'uniform int uGlyphCount;\n' +
    'uniform float uRadius;\n' +
    'uniform float uSoftness;\n' +
    'uniform vec2 uPointer;\n' +
    'uniform float uActive;\n' +
    'uniform vec3 uBg;\n' +
    'uniform float uBackingLum;\n' +
    'uniform float uBgOpacity;\n' +
    'uniform float uLod;\n' +
    'uniform float uContrast;\n' +
    'uniform float uBrightness;\n' +
    'uniform float uInvert;\n' +
    'uniform float uStrength;\n' +
    'uniform float uBase;\n' +
    'uniform float uMaxX;\n' +
    'uniform sampler2D uTextMask;\n' +
    'uniform float uDotPx;\n' +
    'uniform float uDotLod;\n' +
    'uniform float uGlowAmt;\n' +
    'uniform float uAberration;\n' +
    '\n' +
    '#define S(a, b, t) smoothstep(a, b, t)\n' +
    '\n' +
    'float glyphBit (int index, ivec2 p) {\n' +
    '  if (p.x < 0 || p.x > 4 || p.y < 0 || p.y > 4) return 0.0;\n' +
    '  uint bits = uGlyphs[index];\n' +
    '  return float((bits >> uint((4 - p.x) + 5 * p.y)) & 1u);\n' +
    '}\n' +
    '\n' +
    'float hash21 (vec2 p) {\n' +
    '  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);\n' +
    '}\n' +
    '\n' +
    'vec4 sampleFringe (vec2 uv, float lod, vec2 off) {\n' +
    '  vec4 c = textureLod(uContent, uv, lod);\n' +
    '  c.r = textureLod(uContent, uv + off, lod).r;\n' +
    '  c.b = textureLod(uContent, uv - off, lod).b;\n' +
    '  return c;\n' +
    '}\n' +
    '\n' +
    'void main () {\n' +
    '  vec2 uv = vUv;\n' +
    '\n' +
    '  if (uv.x > uMaxX) {\n' +
    '    outColor = vec4(0.0);\n' +
    '    return;\n' +
    '  }\n' +
    '\n' +
    '  float cellPx = (5.0 + 2.0 * uSpacing) * uGlyphPx;\n' +
    '  vec2 frag = uv * uResolution;\n' +
    '  vec2 cell = floor(frag / cellPx);\n' +
    '  vec2 cellUv = (cell + 0.5) * cellPx / uResolution;\n' +
    '\n' +
    '  float aspect = uResolution.x / uResolution.y;\n' +
    '  float dist = length((cellUv - uPointer) * vec2(aspect, 1.0));\n' +
    '  float radius = max(uRadius * uActive, 1e-4);\n' +
    '  float inner = radius * (1.0 - clamp(uSoftness, 0.0, 1.0));\n' +
    '  float lens = (1.0 - S(inner, radius, dist)) * uActive;\n' +
    '  float mask = clamp(max(lens, clamp(uBase, 0.0, 1.0)), 0.0, 1.0)\n' +
    '    * clamp(uStrength, 0.0, 1.0);\n' +
    '\n' +
    '  float apply = mask < 0.003 ? 0.0 : step(hash21(cell), mask);\n' +
    '\n' +
    '  if (apply < 0.5) {\n' +
    '    outColor = vec4(0.0);\n' +
    '    return;\n' +
    '  }\n' +
    '\n' +
    '  vec2 textureUv = vec2(cellUv.x, 1.0 - cellUv.y) + uContentOffset;\n' +
    '  if (textureUv.x < 0.001 || textureUv.x > uMaxX - 0.002 ||\n' +
    '      textureUv.y < 0.001 || textureUv.y > 0.999) {\n' +
    '    outColor = vec4(0.0);\n' +
    '    return;\n' +
    '  }\n' +
    '\n' +
    '  vec2 lensDir = (cellUv - uPointer) * vec2(aspect, 1.0);\n' +
    '  float fringeAmp = max(uActive, S(0.0, 0.25, uBase));\n' +
    '  vec2 fringe = normalize(lensDir + 1e-5)\n' +
    '    * clamp(uAberration, 0.0, 1.0) * 0.005\n' +
    '    * S(uRadius * 0.15, uRadius, dist) * fringeAmp;\n' +
    '  fringe = vec2(fringe.x / aspect, -fringe.y);\n' +
    '\n' +
    '  float textness = texture(uTextMask, vec2(cellUv.x, 1.0 - cellUv.y)).r;\n' +
    '\n' +
    '  if (textness > 0.4) {\n' +
    '    vec2 dotIdx = floor(frag / uDotPx);\n' +
    '    vec2 dotUv = (dotIdx + 0.5) * uDotPx / uResolution;\n' +
    '    vec2 flippedUv = clamp(\n' +
    '      vec2(dotUv.x, 1.0 - dotUv.y) + uContentOffset,\n' +
    '      vec2(0.001), vec2(uMaxX - 0.002, 0.999));\n' +
    '    vec4 ink = sampleFringe(flippedUv, uDotLod, fringe);\n' +
    '    float inkLum = dot(ink.rgb, vec3(0.299, 0.587, 0.114));\n' +
    '    float density = abs(inkLum - uBackingLum);\n' +
    '    density = clamp((density - 0.5) * uContrast + 0.5 + uBrightness, 0.0, 1.0);\n' +
    '    density = mix(density, 1.0 - density, clamp(uInvert, 0.0, 1.0));\n' +
    '    float d = length(frag - (dotIdx + 0.5) * uDotPx) / (uDotPx * 0.5);\n' +
    '    float reach = sqrt(density);\n' +
    '    float on = (1.0 - S(reach - 0.3, reach + 0.2, d)) * step(0.03, density);\n' +
    '    vec3 inkColor = clamp(\n' +
    '      uBg + (ink.rgb - uBg) / max(abs(inkLum - uBackingLum), 0.2),\n' +
    '      0.0, 1.0);\n' +
    '    vec4 soft = sampleFringe(flippedUv, uDotLod + 2.5, fringe);\n' +
    '    float softLum = dot(soft.rgb, vec3(0.299, 0.587, 0.114));\n' +
    '    float halo = clamp(abs(softLum - uBackingLum) * 2.2, 0.0, 1.0)\n' +
    '      * clamp(uGlowAmt, 0.0, 1.0) * 0.55;\n' +
    '    vec3 haloColor = clamp(\n' +
    '      uBg + (soft.rgb - uBg) / max(abs(softLum - uBackingLum), 0.2),\n' +
    '      0.0, 1.0);\n' +
    '    vec3 col = mix(haloColor, inkColor, on);\n' +
    '    float alpha = ink.a\n' +
    '      * max(mix(clamp(uBgOpacity, 0.0, 1.0), 1.0, on), halo * (1.0 - on));\n' +
    '    outColor = vec4(col * alpha, alpha);\n' +
    '    return;\n' +
    '  }\n' +
    '\n' +
    '  vec4 pixel = sampleFringe(textureUv, uLod, fringe);\n' +
    '\n' +
    '  float lum = dot(pixel.rgb, vec3(0.299, 0.587, 0.114));\n' +
    '  float amount = abs(lum - uBackingLum);\n' +
    '  amount = clamp((amount - 0.5) * uContrast + 0.5 + uBrightness, 0.0, 1.0);\n' +
    '  amount = mix(amount, 1.0 - amount, clamp(uInvert, 0.0, 1.0));\n' +
    '\n' +
    '  int index = min(int(amount * float(uGlyphCount)), uGlyphCount - 1);\n' +
    '\n' +
    '  ivec2 local = ivec2(floor((frag - cell * cellPx) / uGlyphPx));\n' +
    '  int pad = int(uSpacing);\n' +
    '  float on = glyphBit(index, ivec2(local.x - pad, local.y - pad));\n' +
    '\n' +
    '  vec3 glyphColor = clamp(\n' +
    '    uBg + (pixel.rgb - uBg) / max(abs(lum - uBackingLum), 0.2),\n' +
    '    0.0, 1.0);\n' +
    '  vec3 col = mix(uBg, glyphColor, on);\n' +
    '  float alpha = pixel.a * mix(clamp(uBgOpacity, 0.0, 1.0), 1.0, on);\n' +
    '  outColor = vec4(col * alpha, alpha);\n' +
    '}';

  function supportsHtmlInCanvas() {
    if (typeof document === 'undefined') return false;
    var probe = document.createElement('canvas');
    var ctx = probe.getContext('2d');
    return Boolean(
      ctx &&
      typeof ctx.drawElementImage === 'function' &&
      typeof probe.requestPaint === 'function'
    );
  }

  function intersectFallbackRects(first, second) {
    return {
      left: Math.max(first.left, second.left),
      top: Math.max(first.top, second.top),
      right: Math.min(first.right, second.right),
      bottom: Math.min(first.bottom, second.bottom),
    };
  }

  function paintFallbackSnapshot(content, canvas) {
    var rootRect = content.getBoundingClientRect();
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var width = Math.max(1, Math.round(rootRect.width * dpr));
    var height = Math.max(1, Math.round(rootRect.height * dpr));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }

    var ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('2D canvas is unavailable');
    ctx.resetTransform();
    ctx.clearRect(0, 0, width, height);
    ctx.scale(dpr, dpr);

    var rootClip = {
      left: rootRect.left,
      top: rootRect.top,
      right: rootRect.right,
      bottom: rootRect.bottom,
    };
    var states = new WeakMap();

    function resolveState(element) {
      var cached = states.get(element);
      if (cached) return cached;

      var parent = element.parentElement;
      var parentState =
        parent && content.contains(parent) ? resolveState(parent) : null;
      var style = getComputedStyle(element);
      var ownOpacity = Number.parseFloat(style.opacity);
      var opacity =
        (parentState ? parentState.opacity : 1) *
        (Number.isFinite(ownOpacity) ? ownOpacity : 1);
      var visible =
        (parentState ? parentState.visible : true) &&
        style.display !== 'none' &&
        style.visibility !== 'hidden' &&
        style.visibility !== 'collapse' &&
        opacity > 0;
      var clip = parentState ? parentState.childrenClip : rootClip;
      var rect = element.getBoundingClientRect();
      var childrenClip = Object.assign({}, clip);
      if (style.overflowX !== 'visible') {
        childrenClip.left = Math.max(childrenClip.left, rect.left);
        childrenClip.right = Math.min(childrenClip.right, rect.right);
      }
      if (style.overflowY !== 'visible') {
        childrenClip.top = Math.max(childrenClip.top, rect.top);
        childrenClip.bottom = Math.min(childrenClip.bottom, rect.bottom);
      }

      var state = { style: style, visible: visible, opacity: opacity, clip: clip, childrenClip: childrenClip };
      states.set(element, state);
      return state;
    }

    var walker = document.createTreeWalker(content, NodeFilter.SHOW_ELEMENT);
    var current = walker.currentNode;
    while (current) {
      var element = current;
      var rect = element.getBoundingClientRect();
      var state = resolveState(element);
      var visibleRect = intersectFallbackRects(rect, state.clip);
      if (
        state.visible &&
        visibleRect.right > visibleRect.left &&
        visibleRect.bottom > visibleRect.top
      ) {
        var style = state.style;
        ctx.save();
        ctx.beginPath();
        ctx.rect(
          state.clip.left - rootRect.left,
          state.clip.top - rootRect.top,
          state.clip.right - state.clip.left,
          state.clip.bottom - state.clip.top
        );
        ctx.clip();
        ctx.globalAlpha = state.opacity;
        var x = rect.left - rootRect.left;
        var y = rect.top - rootRect.top;

        if (style.backgroundColor !== 'transparent') {
          ctx.fillStyle = style.backgroundColor;
          ctx.fillRect(x, y, rect.width, rect.height);
        }

        paintFallbackMedia(ctx, element, style, rect, rootRect);
        paintFallbackText(ctx, element, style, rootRect);
        paintFallbackBorders(ctx, style, rect, rootRect);
        ctx.restore();
      }
      current = walker.nextNode();
    }
    ctx.globalAlpha = 1;
  }

  function paintFallbackMedia(ctx, element, style, rect, rootRect) {
    var drawable =
      element instanceof HTMLImageElement
        ? element.complete && element.naturalWidth > 0
          ? element
          : null
        : element instanceof HTMLCanvasElement
          ? element
          : element instanceof HTMLVideoElement && element.readyState >= 2
            ? element
            : null;
    if (!drawable) return;
    if (!isFallbackMediaOriginClean(drawable)) return;

    var sourceWidth =
      drawable instanceof HTMLImageElement
        ? drawable.naturalWidth
        : drawable instanceof HTMLVideoElement
          ? drawable.videoWidth
          : drawable.width;
    var sourceHeight =
      drawable instanceof HTMLImageElement
        ? drawable.naturalHeight
        : drawable instanceof HTMLVideoElement
          ? drawable.videoHeight
          : drawable.height;
    if (!(sourceWidth > 0 && sourceHeight > 0)) return;

    var sourceX = 0;
    var sourceY = 0;
    var cropWidth = sourceWidth;
    var cropHeight = sourceHeight;
    var targetX = rect.left - rootRect.left;
    var targetY = rect.top - rootRect.top;
    var targetWidth = rect.width;
    var targetHeight = rect.height;
    var position = resolveObjectPosition(style.objectPosition);
    var positionX = position[0];
    var positionY = position[1];
    if (style.objectFit === 'cover') {
      var coverScale = Math.max(
        rect.width / sourceWidth,
        rect.height / sourceHeight
      );
      cropWidth = rect.width / coverScale;
      cropHeight = rect.height / coverScale;
      sourceX = (sourceWidth - cropWidth) * positionX;
      sourceY = (sourceHeight - cropHeight) * positionY;
    } else if (
      style.objectFit === 'contain' ||
      style.objectFit === 'scale-down'
    ) {
      var containScale = Math.min(
        rect.width / sourceWidth,
        rect.height / sourceHeight,
        style.objectFit === 'scale-down' ? 1 : Number.POSITIVE_INFINITY
      );
      targetWidth = sourceWidth * containScale;
      targetHeight = sourceHeight * containScale;
      targetX += (rect.width - targetWidth) * positionX;
      targetY += (rect.height - targetHeight) * positionY;
    }

    try {
      ctx.drawImage(
        drawable,
        sourceX,
        sourceY,
        cropWidth,
        cropHeight,
        targetX,
        targetY,
        targetWidth,
        targetHeight
      );
    } catch (err) { /* upstream ignores tainted/draw failures */ }
  }

  function isFallbackMediaOriginClean(drawable) {
    var probe = document.createElement('canvas');
    probe.width = probe.height = 1;
    var ctx = probe.getContext('2d', { willReadFrequently: true });
    if (!ctx) return false;
    try {
      ctx.drawImage(drawable, 0, 0, 1, 1);
      ctx.getImageData(0, 0, 1, 1);
      return true;
    } catch (err) {
      return false;
    }
  }

  function resolveObjectPosition(position) {
    var parts = position.split(/\s+/);
    var x = parts[0] === undefined ? '50%' : parts[0];
    var y = parts[1] === undefined ? '50%' : parts[1];
    return [
      resolvePositionValue(x, 'left', 'right'),
      resolvePositionValue(y, 'top', 'bottom'),
    ];
  }

  function resolvePositionValue(value, start, end) {
    if (value === start) return 0;
    if (value === end) return 1;
    if (value === 'center') return 0.5;
    if (value.endsWith('%')) {
      return Math.min(1, Math.max(0, Number.parseFloat(value) / 100));
    }
    return 0.5;
  }

  function paintFallbackText(ctx, element, style, rootRect) {
    var textNodes = Array.from(element.childNodes).filter(
      function (node) {
        return node.nodeType === Node.TEXT_NODE && node.textContent && node.textContent.trim();
      }
    );
    if (textNodes.length === 0) return;

    ctx.fillStyle = style.color;
    ctx.font = style.fontStyle + ' ' + style.fontWeight + ' ' + style.fontSize + ' ' + style.fontFamily;
    ctx.textBaseline = 'alphabetic';
    if ('letterSpacing' in ctx) {
      ctx.letterSpacing =
        style.letterSpacing === 'normal' ? '0px' : style.letterSpacing;
    }
    var textAlign =
      style.textAlign === 'center' ||
      style.textAlign === 'right' ||
      style.textAlign === 'start' ||
      style.textAlign === 'end'
        ? style.textAlign
        : 'left';
    var direction = style.direction === 'rtl' ? 'rtl' : 'ltr';
    ctx.textAlign = textAlign;
    ctx.direction = direction;

    var whiteSpace = style.whiteSpace;
    var preservesNewlines =
      whiteSpace === 'pre' ||
      whiteSpace === 'pre-wrap' ||
      whiteSpace === 'pre-line' ||
      whiteSpace === 'break-spaces';
    var preservesSpaces = preservesNewlines && whiteSpace !== 'pre-line';

    var anchor =
      textAlign === 'center'
        ? 0.5
        : textAlign === 'right' ||
            (textAlign === 'end' && direction === 'ltr') ||
            (textAlign === 'start' && direction === 'rtl')
          ? 1
          : 0;

    function transform(text) {
      if (style.textTransform === 'uppercase') return text.toUpperCase();
      if (style.textTransform === 'lowercase') return text.toLowerCase();
      return text;
    }

    function drawAcrossRects(text, rects) {
      var visible = rects.filter(
        function (rect) {
          return (
            rect.right > rootRect.left &&
            rect.left < rootRect.right &&
            rect.bottom > rootRect.top &&
            rect.top < rootRect.bottom
          );
        }
      );
      if (visible.length === 0) return;
      var totalWidth = visible.reduce(function (sum, rect) { return sum + rect.width; }, 0);
      var offset = 0;
      for (var index = 0; index < visible.length; index++) {
        var rect = visible[index];
        var remaining = text.length - offset;
        if (remaining <= 0) break;
        var count =
          index === visible.length - 1
            ? remaining
            : Math.min(
                remaining,
                Math.max(1, Math.round((text.length * rect.width) / totalWidth))
              );
        var slice = text.slice(offset, offset + count);
        offset += count;
        var line = preservesSpaces ? slice : slice.trim();
        if (!line.trim()) continue;
        var x = rect.left - rootRect.left + rect.width * anchor;
        var metrics = ctx.measureText(line);
        var ascent = metrics.fontBoundingBoxAscent || 0;
        var descent = metrics.fontBoundingBoxDescent || 0;
        var y =
          ascent > 0
            ? rect.top -
              rootRect.top +
              (rect.height - ascent - descent) / 2 +
              ascent
            : rect.bottom - rootRect.top - rect.height * 0.2;
        ctx.fillText(line, x, y, Math.max(rect.width, 1));
      }
    }

    for (var i = 0; i < textNodes.length; i++) {
      var node = textNodes[i];
      var raw = node.textContent || '';
      var range = document.createRange();

      if (preservesNewlines) {
        var position = 0;
        var parts = raw.split('\n');
        for (var p = 0; p < parts.length; p++) {
          var part = parts[p];
          var start = position;
          position += part.length + 1;
          if (!part.trim()) continue;
          range.setStart(node, start);
          range.setEnd(node, start + part.length);
          var text1 = transform(
            preservesSpaces ? part : part.replace(/\s+/g, ' ').trim()
          );
          drawAcrossRects(text1, Array.from(range.getClientRects()));
        }
        continue;
      }

      var text2 = transform(raw.replace(/\s+/g, ' ').trim());
      if (!text2) continue;
      range.selectNodeContents(node);
      drawAcrossRects(text2, Array.from(range.getClientRects()));
    }
  }

  function paintFallbackBorders(ctx, style, rect, rootRect) {
    var x = rect.left - rootRect.left;
    var y = rect.top - rootRect.top;
    var top = Number.parseFloat(style.borderTopWidth);
    var right = Number.parseFloat(style.borderRightWidth);
    var bottom = Number.parseFloat(style.borderBottomWidth);
    var left = Number.parseFloat(style.borderLeftWidth);
    if (top > 0) {
      ctx.fillStyle = style.borderTopColor;
      ctx.fillRect(x, y, rect.width, top);
    }
    if (right > 0) {
      ctx.fillStyle = style.borderRightColor;
      ctx.fillRect(x + rect.width - right, y, right, rect.height);
    }
    if (bottom > 0) {
      ctx.fillStyle = style.borderBottomColor;
      ctx.fillRect(x, y + rect.height - bottom, rect.width, bottom);
    }
    if (left > 0) {
      ctx.fillStyle = style.borderLeftColor;
      ctx.fillRect(x, y, left, rect.height);
    }
  }

  function createAsciify(elements, options) {
    try {
      return initializeAsciify(elements, options || {});
    } catch (error) {
      console.error('Asciify initialization failed:', error);
      return null;
    }
  }

  function initializeAsciify(elements, options) {
    var config = Object.assign({}, DEFAULTS, options);
    var source = elements.source;
    var content = elements.content;
    var output = elements.output;

    var gl = output.getContext('webgl2', {
      alpha: true,
      depth: false,
      stencil: false,
      antialias: false,
      premultipliedAlpha: true,
    });
    if (!gl || gl.isContextLost()) return null;

    var sourceCtx = source.getContext('2d');
    var paintable = source;
    var htmlInCanvas = Boolean(
      sourceCtx &&
      typeof sourceCtx.drawElementImage === 'function' &&
      typeof paintable.requestPaint === 'function'
    );

    var destroyed = false;
    var contentDirty = false;
    var wake = function () {};
    var fallbackSource = null;
    var fallbackCaptureTimer = 0;
    var fallbackCaptureDeadline = 0;
    var fallbackScrollCaptureTimer = 0;
    var capturedScrollLeft = 0;
    var capturedScrollTop = 0;
    var fallbackErrorLogged = false;
    var textureUploadErrorLogged = false;

    if (htmlInCanvas) {
      paintable.onpaint = function () {
        try {
          sourceCtx.reset();
          sourceCtx.drawElementImage(content, 0, 0);
          contentDirty = true;
          scheduleTextMask();
          wake();
        } catch (err) { /* upstream ignores capture failures */ }
      };
    }

    function queueFallbackCapture(immediate) {
      if (htmlInCanvas || destroyed) return;
      var delay = immediate ? 0 : FALLBACK_CAPTURE_DELAY;
      var deadline = performance.now() + delay;
      if (fallbackCaptureTimer && fallbackCaptureDeadline <= deadline) return;
      window.clearTimeout(fallbackCaptureTimer);
      fallbackCaptureDeadline = deadline;
      fallbackCaptureTimer = window.setTimeout(captureFallback, delay);
    }

    function captureFallback() {
      window.clearTimeout(fallbackCaptureTimer);
      window.clearTimeout(fallbackScrollCaptureTimer);
      fallbackCaptureTimer = 0;
      fallbackScrollCaptureTimer = 0;
      try {
        paintFallbackSnapshot(content, source);
        if (destroyed) return;
        fallbackSource = source;
        capturedScrollLeft = content.scrollLeft;
        capturedScrollTop = content.scrollTop;
        contentDirty = true;
        fallbackErrorLogged = false;
        scheduleTextMask();
        wake();
      } catch (error) {
        if (!destroyed && !fallbackErrorLogged) {
          fallbackErrorLogged = true;
          console.warn('Asciify could not capture its HTML fallback:', error);
        }
      }
    }

    function compile(type, text) {
      var shader = gl.createShader(type);
      gl.shaderSource(shader, text);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        var message = gl.getShaderInfoLog(shader) || 'Unknown shader error';
        gl.deleteShader(shader);
        throw new Error(message);
      }
      return shader;
    }

    var vertexShader = compile(gl.VERTEX_SHADER, VERT);
    var fragmentShader = compile(gl.FRAGMENT_SHADER, FRAG);
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      var linkMessage =
        gl.getProgramInfoLog(program) || 'Unknown program link error';
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      throw new Error(linkMessage);
    }

    var uniforms = {};
    var uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
    for (var ui = 0; ui < uniformCount; ui++) {
      var info = gl.getActiveUniform(program, ui);
      uniforms[info.name] = gl.getUniformLocation(program, info.name);
    }

    var quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    var contentTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, contentTexture);
    gl.texParameteri(
      gl.TEXTURE_2D,
      gl.TEXTURE_MIN_FILTER,
      gl.LINEAR_MIPMAP_LINEAR
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      1,
      1,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      new Uint8Array([0, 0, 0, 0])
    );

    var contentMaxX = 1;

    var textMaskTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, textMaskTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      1,
      1,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      new Uint8Array([0, 0, 0, 0])
    );

    var MASK_SCALE = 0.25;
    var maskCanvas = document.createElement('canvas');
    var maskCtx = maskCanvas.getContext('2d');
    var maskDirty = false;
    var maskTimer = 0;
    var maskStamp = 0;

    function buildTextMask() {
      if (!maskCtx) return;
      var bounds = output.getBoundingClientRect();
      var width = Math.max(1, Math.round(bounds.width * MASK_SCALE));
      var height = Math.max(1, Math.round(bounds.height * MASK_SCALE));
      if (maskCanvas.width !== width || maskCanvas.height !== height) {
        maskCanvas.width = width;
        maskCanvas.height = height;
      }
      maskCtx.clearRect(0, 0, width, height);
      maskCtx.fillStyle = '#fff';
      var walker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT);
      var range = document.createRange();
      var node;
      while ((node = walker.nextNode())) {
        if (!node.textContent || !node.textContent.trim()) continue;
        var parent = node.parentElement;
        if (!parent || (parent.checkVisibility && !parent.checkVisibility())) {
          continue;
        }
        range.selectNodeContents(node);
        var rects = range.getClientRects();
        for (var i = 0; i < rects.length; i++) {
          var r = rects[i];
          if (r.width < 1 || r.height < 1) continue;
          if (r.bottom < bounds.top || r.top > bounds.bottom) continue;
          maskCtx.fillRect(
            (r.left - bounds.left - 1) * MASK_SCALE,
            (r.top - bounds.top - 1) * MASK_SCALE,
            (r.width + 2) * MASK_SCALE,
            (r.height + 2) * MASK_SCALE
          );
        }
      }
      var fields = content.querySelectorAll('input, textarea, select');
      for (var f = 0; f < fields.length; f++) {
        var fr = fields[f].getBoundingClientRect();
        if (fr.width < 1 || fr.height < 1) continue;
        if (fr.bottom < bounds.top || fr.top > bounds.bottom) continue;
        maskCtx.fillRect(
          (fr.left - bounds.left) * MASK_SCALE,
          (fr.top - bounds.top) * MASK_SCALE,
          fr.width * MASK_SCALE,
          fr.height * MASK_SCALE
        );
      }
      maskDirty = true;
    }

    function scheduleTextMask() {
      if (maskTimer) return;
      var wait = Math.max(0, 120 - (performance.now() - maskStamp));
      maskTimer = window.setTimeout(function () {
        maskTimer = 0;
        maskStamp = performance.now();
        buildTextMask();
        start();
      }, wait);
    }

    function syncCanvasSize() {
      var changed = false;
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      var width = Math.max(1, Math.round(output.clientWidth * dpr));
      var height = Math.max(1, Math.round(output.clientHeight * dpr));
      if (output.width !== width || output.height !== height) {
        output.width = width;
        output.height = height;
        changed = true;
      }
      contentMaxX = Math.min(
        1,
        Math.max(0.05, content.clientWidth / Math.max(output.clientWidth, 1))
      );
      if (htmlInCanvas) {
        var cssWidth = Math.max(1, Math.round(source.clientWidth));
        var cssHeight = Math.max(1, Math.round(source.clientHeight));
        if (
          source.width !== cssWidth * dpr ||
          source.height !== cssHeight * dpr
        ) {
          source.width = cssWidth * dpr;
          source.height = cssHeight * dpr;
          changed = true;
        }
        paintable.requestPaint();
      }
      return changed;
    }

    syncCanvasSize();

    var backingRgb = [1, 1, 1];
    var backingLum = 1;
    var probe = document.createElement('canvas');
    probe.width = probe.height = 1;
    var probeCtx = probe.getContext('2d', { willReadFrequently: true });

    function syncBacking() {
      backingRgb = [1, 1, 1];
      if (probeCtx) {
        var el = content;
        while (el) {
          var bg = getComputedStyle(el).backgroundColor;
          if (bg && bg !== 'transparent') {
            probeCtx.clearRect(0, 0, 1, 1);
            probeCtx.fillStyle = bg;
            probeCtx.fillRect(0, 0, 1, 1);
            var data = probeCtx.getImageData(0, 0, 1, 1).data;
            if (data[3] > 0) {
              backingRgb = [data[0] / 255, data[1] / 255, data[2] / 255];
              break;
            }
          }
          el = el.parentElement;
        }
      }
      backingLum =
        0.299 * backingRgb[0] + 0.587 * backingRgb[1] + 0.114 * backingRgb[2];
    }

    syncBacking();

    var pointer = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, active: 0, target: 0 };
    var glyphData = new Uint32Array(MAX_GLYPHS);

    function resolveGlyphs() {
      var ramp =
        config.glyphs.length > 1
          ? config.glyphs
          : (CHARSETS[config.charset] || CHARSETS.ascii);
      var count = Math.min(ramp.length, MAX_GLYPHS);
      glyphData.fill(0);
      for (var i = 0; i < count; i++) glyphData[i] = ramp[i] >>> 0;
      return count;
    }

    function uploadContent() {
      var bitmap = htmlInCanvas ? source : fallbackSource;
      if (!bitmap || !contentDirty) return;
      contentDirty = false;
      try {
        gl.bindTexture(gl.TEXTURE_2D, contentTexture);
        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RGBA,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          bitmap
        );
        gl.generateMipmap(gl.TEXTURE_2D);
        textureUploadErrorLogged = false;
      } catch (error) {
        if (!textureUploadErrorLogged) {
          textureUploadErrorLogged = true;
          console.warn('Asciify could not upload its content texture:', error);
        }
      }
    }

    function uploadMask() {
      if (!maskDirty) return;
      maskDirty = false;
      gl.bindTexture(gl.TEXTURE_2D, textMaskTexture);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        maskCanvas
      );
    }

    function render() {
      uploadContent();
      uploadMask();
      gl.useProgram(program);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, contentTexture);
      gl.uniform1i(uniforms.uContent, 0);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, textMaskTexture);
      gl.uniform1i(uniforms.uTextMask, 1);
      gl.uniform2f(
        uniforms.uContentOffset,
        htmlInCanvas
          ? 0
          : (content.scrollLeft - capturedScrollLeft) /
              Math.max(content.clientWidth, 1),
        htmlInCanvas
          ? 0
          : (content.scrollTop - capturedScrollTop) /
              Math.max(content.clientHeight, 1)
      );
      gl.uniform2f(uniforms.uResolution, output.width, output.height);
      var dpr = output.width / Math.max(output.clientWidth, 1);
      var glyphCss = Math.max(config.scale, 0.5);
      var dotCss = Math.max(1.25, glyphCss * 0.75);
      var texelsPerCss = htmlInCanvas
        ? dpr
        : source.width / Math.max(content.clientWidth, 1);
      gl.uniform1f(uniforms.uDotPx, dotCss * dpr);
      gl.uniform1f(
        uniforms.uDotLod,
        Math.max(0, Math.log2((dotCss * Math.max(texelsPerCss, 0.25)) / dpr) - 1)
      );
      gl.uniform1f(uniforms.uGlowAmt, config.glow);
      gl.uniform1f(uniforms.uAberration, config.aberration);
      var spacing = Math.round(Math.min(Math.max(config.spacing, 0), 3));
      gl.uniform1f(uniforms.uGlyphPx, glyphCss * dpr);
      gl.uniform1f(uniforms.uSpacing, spacing);
      gl.uniform1f(
        uniforms.uLod,
        Math.max(0, Math.log2((5 + 2 * spacing) * glyphCss) - 1)
      );
      var glyphCount = resolveGlyphs();
      gl.uniform1uiv(uniforms['uGlyphs[0]'], glyphData);
      gl.uniform1i(uniforms.uGlyphCount, glyphCount);
      gl.uniform1f(uniforms.uRadius, Math.max(config.radius, 0.01));
      gl.uniform1f(uniforms.uSoftness, config.softness);
      gl.uniform2f(uniforms.uPointer, pointer.x, pointer.y);
      gl.uniform1f(uniforms.uActive, pointer.active);
      var bg = config.background === 'auto' ? backingRgb : config.background;
      gl.uniform3f(uniforms.uBg, bg[0], bg[1], bg[2]);
      gl.uniform1f(uniforms.uBackingLum, backingLum);
      gl.uniform1f(uniforms.uBgOpacity, config.backgroundOpacity);
      gl.uniform1f(uniforms.uContrast, Math.max(config.contrast, 0));
      gl.uniform1f(uniforms.uBrightness, config.brightness);
      gl.uniform1f(uniforms.uInvert, config.invert);
      gl.uniform1f(uniforms.uStrength, config.strength);
      gl.uniform1f(uniforms.uBase, config.baseStrength);
      gl.uniform1f(uniforms.uMaxX, contentMaxX);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, output.width, output.height);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    var raf = 0;
    var lastTime = performance.now();
    var running = false;
    var visible = true;

    var motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    var reducedMotion = motionQuery.matches;

    function frame(now) {
      if (destroyed) return;
      if (!visible) {
        running = false;
        return;
      }
      var delta = Math.min((now - lastTime) / 1000, 1 / 30);
      lastTime = now;
      var ease = reducedMotion
        ? 1
        : 1 - Math.exp(-delta * Math.max(config.followSpeed, 0.5));
      pointer.x += (pointer.tx - pointer.x) * ease;
      pointer.y += (pointer.ty - pointer.y) * ease;
      pointer.active += (pointer.target - pointer.active) * ease;
      var settled =
        Math.abs(pointer.tx - pointer.x) < 5e-4 &&
        Math.abs(pointer.ty - pointer.y) < 5e-4 &&
        Math.abs(pointer.target - pointer.active) < 1e-3;
      if (settled) {
        pointer.x = pointer.tx;
        pointer.y = pointer.ty;
        pointer.active = pointer.target;
      }
      render();
      if (settled && !contentDirty) {
        running = false;
        return;
      }
      raf = requestAnimationFrame(frame);
    }

    function start() {
      if (destroyed || running || !visible) return;
      running = true;
      lastTime = performance.now();
      raf = requestAnimationFrame(frame);
    }

    wake = start;
    queueFallbackCapture(true);
    start();

    function onMotionChange() {
      reducedMotion = motionQuery.matches;
      start();
    }
    motionQuery.addEventListener('change', onMotionChange);

    var themeTimer = 0;
    function onThemeShift() {
      syncBacking();
      start();
      window.clearTimeout(themeTimer);
      themeTimer = window.setTimeout(function () {
        syncBacking();
        queueFallbackCapture();
        start();
      }, 300);
    }

    var themeObserver = new MutationObserver(onThemeShift);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'style', 'data-theme'],
    });
    var schemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    schemeQuery.addEventListener('change', onThemeShift);

    var observer = new ResizeObserver(function () {
      if (syncCanvasSize()) queueFallbackCapture();
      start();
    });
    observer.observe(output);
    observer.observe(content);

    var intersection = new IntersectionObserver(function (entries) {
      var last = entries[entries.length - 1];
      visible = last ? last.isIntersecting : true;
      if (visible) start();
    });
    intersection.observe(output);

    // ADAPTED: listen on `window` — the layer sits beneath the UI shell
    // (pointer-events: none) and never receives pointer events itself.
    var listenTarget = window;

    var contentObserver = htmlInCanvas
      ? null
      : new MutationObserver(function () { queueFallbackCapture(); });
    if (contentObserver) {
      contentObserver.observe(content, {
        attributes: true,
        attributeFilter: ['class', 'hidden', 'src', 'srcset', 'style'],
        characterData: true,
        childList: true,
        subtree: true,
      });
    }

    function onContentScroll() {
      if (htmlInCanvas || destroyed) return;
      window.clearTimeout(fallbackScrollCaptureTimer);
      fallbackScrollCaptureTimer = window.setTimeout(
        captureFallback,
        FALLBACK_CAPTURE_DELAY
      );
      start();
    }
    function onFallbackVisualChange() {
      queueFallbackCapture();
    }
    if (!htmlInCanvas) {
      content.addEventListener('scroll', onContentScroll, {
        capture: true,
        passive: true,
      });
      content.addEventListener('load', onFallbackVisualChange, true);
      content.addEventListener('loadeddata', onFallbackVisualChange, true);
      content.addEventListener('focusin', onFallbackVisualChange, true);
      content.addEventListener('focusout', onFallbackVisualChange, true);
      content.addEventListener('input', onFallbackVisualChange, true);
      content.addEventListener('change', onFallbackVisualChange, true);
      content.addEventListener('transitionend', onFallbackVisualChange, true);
      content.addEventListener('transitioncancel', onFallbackVisualChange, true);
      content.addEventListener('animationend', onFallbackVisualChange, true);
      if (document.fonts && document.fonts.addEventListener) {
        document.fonts.addEventListener('loadingdone', onFallbackVisualChange);
      }
    }

    function onPointerMove(event) {
      var rect = output.getBoundingClientRect();
      pointer.tx = (event.clientX - rect.left) / Math.max(rect.width, 1);
      pointer.ty = 1 - (event.clientY - rect.top) / Math.max(rect.height, 1);
      pointer.target = 1;
      queueFallbackCapture();
      start();
    }

    function onPointerLeave() {
      pointer.target = 0;
      queueFallbackCapture();
      start();
    }

    listenTarget.addEventListener('pointermove', onPointerMove, { passive: true });
    listenTarget.addEventListener('pointerleave', onPointerLeave, { passive: true });
    content.addEventListener('scroll', scheduleTextMask, {
      capture: true,
      passive: true,
    });

    return {
      setOptions: function (next) {
        var changed = false;
        var keys = Object.keys(next);
        for (var k = 0; k < keys.length; k++) {
          var key = keys[k];
          var value = next[key];
          var prev = config[key];
          if (Array.isArray(value) && Array.isArray(prev)) {
            if (
              value.length !== prev.length ||
              value.some(function (item, i) { return item !== prev[i]; })
            ) {
              changed = true;
              break;
            }
          } else if (prev !== value) {
            changed = true;
            break;
          }
        }
        Object.assign(config, next);
        if (!changed) return;
        syncBacking();
        scheduleTextMask();
        start();
      },
      // ADAPTED: force an immediate fallback recapture. Needed for animated
      // <canvas> content, whose pixel changes emit no DOM mutations.
      refresh: function () {
        if (destroyed) return;
        queueFallbackCapture(true);
        start();
      },
      resize: function () {
        syncCanvasSize();
        syncBacking();
        queueFallbackCapture();
        scheduleTextMask();
        start();
      },
      destroy: function () {
        destroyed = true;
        cancelAnimationFrame(raf);
        window.clearTimeout(themeTimer);
        window.clearTimeout(fallbackCaptureTimer);
        window.clearTimeout(fallbackScrollCaptureTimer);
        window.clearTimeout(maskTimer);
        observer.disconnect();
        intersection.disconnect();
        themeObserver.disconnect();
        if (contentObserver) contentObserver.disconnect();
        schemeQuery.removeEventListener('change', onThemeShift);
        motionQuery.removeEventListener('change', onMotionChange);
        listenTarget.removeEventListener('pointermove', onPointerMove);
        listenTarget.removeEventListener('pointerleave', onPointerLeave);
        content.removeEventListener('scroll', onContentScroll, true);
        content.removeEventListener('scroll', scheduleTextMask, {
          capture: true,
        });
        content.removeEventListener('load', onFallbackVisualChange, true);
        content.removeEventListener('loadeddata', onFallbackVisualChange, true);
        content.removeEventListener('focusin', onFallbackVisualChange, true);
        content.removeEventListener('focusout', onFallbackVisualChange, true);
        content.removeEventListener('input', onFallbackVisualChange, true);
        content.removeEventListener('change', onFallbackVisualChange, true);
        content.removeEventListener(
          'transitionend',
          onFallbackVisualChange,
          true
        );
        content.removeEventListener(
          'transitioncancel',
          onFallbackVisualChange,
          true
        );
        content.removeEventListener('animationend', onFallbackVisualChange, true);
        if (document.fonts && document.fonts.removeEventListener) {
          document.fonts.removeEventListener(
            'loadingdone',
            onFallbackVisualChange
          );
        }
        gl.deleteTexture(contentTexture);
        gl.deleteTexture(textMaskTexture);
        gl.deleteProgram(program);
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);
        gl.deleteBuffer(quad);
        if (htmlInCanvas) paintable.onpaint = null;
      },
    };
  }

  global.CanvasUIAsciify = {
    createAsciify: createAsciify,
    supportsHtmlInCanvas: supportsHtmlInCanvas,
  };
})(typeof window !== 'undefined' ? window : this);
