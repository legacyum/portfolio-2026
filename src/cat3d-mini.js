/*
 * Cat 3D Mini — High-Fidelity Procedural Cat (Three.js r128).
 * Replicates the exact anatomy, Toon cel-shading, materials, dais platform,
 * and GLSL ASCII post-processing shader from prototypes/cat3d.html.
 */
(function (global) {
  'use strict';

  var THREE = global.THREE;

  function cssAccent() {
    try {
      var styles = global.getComputedStyle(global.document.body);
      return (styles.getPropertyValue('--accent') || '').trim() || '#c9ff62';
    } catch (e) {
      return '#c9ff62';
    }
  }

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  // Toon 4-band luminance ramp texture
  function createToonMap() {
    var data = new Uint8Array([70, 148, 214, 255]);
    var tex = new THREE.DataTexture(data, 4, 1, THREE.LuminanceFormat);
    tex.minFilter = tex.magFilter = THREE.NearestFilter;
    tex.generateMipmaps = false;
    tex.needsUpdate = true;
    return tex;
  }

  // ASCII Ramp & Glyph Atlas for GLSL Post-Process
  var ASCII_RAMP = ' .`-\':_,^=;><+!rc*/z?sLTv)J7(|Fi{C}fI31tlu[neoZ5Yxjya]2ESwqkP6h9d4VpOGbUAKXHm8RD#$Bg0MNWQ%&@\\';
  var EDGE_GLYPHS = new THREE.Vector4(
    ASCII_RAMP.indexOf('|'),
    ASCII_RAMP.indexOf('/'),
    ASCII_RAMP.indexOf('-'),
    ASCII_RAMP.indexOf('\\')
  );
  var GLYPH_COLS = 16;
  var GLYPH_ROWS = Math.ceil(ASCII_RAMP.length / GLYPH_COLS);
  var GLYPH_PX = 32;

  function createGlyphAtlas() {
    if (!global.document) return null;
    var canvas = global.document.createElement('canvas');
    canvas.width = GLYPH_COLS * GLYPH_PX;
    canvas.height = GLYPH_ROWS * GLYPH_PX;
    var ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'bold ' + Math.round(GLYPH_PX * 0.92) + 'px ui-monospace, "JetBrains Mono", Menlo, Consolas, monospace';
    for (var i = 0; i < ASCII_RAMP.length; i++) {
      var cx = (i % GLYPH_COLS) * GLYPH_PX + GLYPH_PX / 2;
      var cy = Math.floor(i / GLYPH_COLS) * GLYPH_PX + GLYPH_PX / 2 + 1;
      ctx.fillText(ASCII_RAMP[i], cx, cy);
    }
    var tex = new THREE.CanvasTexture(canvas);
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.generateMipmaps = false;
    tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
  }

  // Web Audio Synthesized Meow & Purr
  var AC = null;
  function getAudioCtx() {
    var Ctx = global.AudioContext || global.webkitAudioContext;
    if (!Ctx) return null;
    if (!AC) AC = new Ctx();
    if (AC.state === 'suspended') AC.resume();
    return AC;
  }

  function playMeow() {
    try {
      var ac = getAudioCtx();
      if (!ac) return;
      var t0 = ac.currentTime;
      var osc = ac.createOscillator(); osc.type = 'sawtooth';
      var osc2 = ac.createOscillator(); osc2.type = 'triangle';
      var filt = ac.createBiquadFilter(); filt.type = 'bandpass'; filt.Q.value = 3.4;
      var g = ac.createGain();
      osc.frequency.setValueAtTime(430, t0);
      osc.frequency.exponentialRampToValueAtTime(880, t0 + 0.13);
      osc.frequency.exponentialRampToValueAtTime(360, t0 + 0.52);
      osc2.frequency.setValueAtTime(215, t0);
      osc2.frequency.exponentialRampToValueAtTime(440, t0 + 0.13);
      osc2.frequency.exponentialRampToValueAtTime(180, t0 + 0.52);
      filt.frequency.setValueAtTime(700, t0);
      filt.frequency.exponentialRampToValueAtTime(1750, t0 + 0.14);
      filt.frequency.exponentialRampToValueAtTime(620, t0 + 0.52);
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(0.16, t0 + 0.07);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.58);
      osc.connect(filt); osc2.connect(filt); filt.connect(g); g.connect(ac.destination);
      osc.start(t0); osc2.start(t0); osc.stop(t0 + 0.6); osc2.stop(t0 + 0.6);
    } catch (e) {}
  }

  function playPurr(duration) {
    try {
      var ac = getAudioCtx();
      if (!ac) return;
      var t0 = ac.currentTime;
      var dur = duration || 1.8;

      // Carrier: vibración cálida de pecho a ~68Hz
      var carrier = ac.createOscillator();
      carrier.type = 'triangle';
      carrier.frequency.setValueAtTime(68, t0);
      carrier.frequency.linearRampToValueAtTime(72, t0 + dur * 0.5);
      carrier.frequency.linearRampToValueAtTime(66, t0 + dur);

      // Armónico sutil ~136Hz
      var overtone = ac.createOscillator();
      overtone.type = 'sine';
      overtone.frequency.setValueAtTime(136, t0);

      // Modulador de Amplitud (LFO) a ~25Hz (ritmo laríngeo felino)
      var lfo = ac.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.setValueAtTime(25, t0);
      lfo.frequency.linearRampToValueAtTime(27, t0 + dur * 0.4);
      lfo.frequency.linearRampToValueAtTime(24, t0 + dur);

      var lfoGain = ac.createGain();
      lfoGain.gain.value = 0.5;

      var amGain = ac.createGain();
      amGain.gain.value = 0.5;
      lfo.connect(lfoGain);
      lfoGain.connect(amGain.gain);

      // Filtro paso-bajo para timbre suave y retumbante
      var filt = ac.createBiquadFilter();
      filt.type = 'lowpass';
      filt.frequency.setValueAtTime(260, t0);
      filt.Q.value = 1.4;

      // Envolvente de volumen maestro
      var master = ac.createGain();
      master.gain.setValueAtTime(0.0001, t0);
      master.gain.exponentialRampToValueAtTime(0.18, t0 + 0.15);
      master.gain.setValueAtTime(0.18, t0 + dur - 0.25);
      master.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

      carrier.connect(amGain);
      overtone.connect(amGain);
      amGain.connect(filt);
      filt.connect(master);
      master.connect(ac.destination);

      lfo.start(t0);
      carrier.start(t0);
      overtone.start(t0);
      lfo.stop(t0 + dur);
      carrier.stop(t0 + dur);
      overtone.stop(t0 + dur);
    } catch (e) {}
  }

  function mount(stage) {
    if (!THREE || !stage || !global.document) return null;
    var canvas = stage.querySelector('#cat3DCanvas');
    if (!canvas || canvas.__cat3dMini) return canvas && canvas.__cat3dMini ? canvas.__cat3dMini : null;

    try {
      var reducedMotion = !!(global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches);
      var renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'low-power'
      });
      renderer.setPixelRatio(Math.min(global.devicePixelRatio || 1, 1.75));
      renderer.setClearColor(0x000000, 0);
      renderer.outputEncoding = THREE.sRGBEncoding;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.0;

      // ---------------------------------------------------------------
      // Scene, Camera & Three-Quarter Framing
      // ---------------------------------------------------------------
      var scene = new THREE.Scene();
      // Three-quarter isometric-like perspective that frames head, ears, tail, and dais
      var camera = new THREE.PerspectiveCamera(34, 1, 0.1, 50);
      camera.position.set(4.5, 3.2, 5.8);
      camera.lookAt(0, 1.35, 0);

      // ---------------------------------------------------------------
      // Lighting (Calibrated Cel-Shading)
      // ---------------------------------------------------------------
      var hemi = new THREE.HemisphereLight(0xfff2e0, 0x080c10, 0.58);
      scene.add(hemi);

      var key = new THREE.DirectionalLight(0xffffff, 1.25);
      key.position.set(5.5, 9.0, 5.5);
      scene.add(key);

      var fill = new THREE.DirectionalLight(0x86b0d8, 0.32);
      fill.position.set(-6, 3, -3);
      scene.add(fill);

      var accentColor = new THREE.Color(cssAccent());
      var rim = new THREE.PointLight(accentColor, 1.35, 16, 2);
      rim.position.set(-2.5, 2.8, -4.0);
      scene.add(rim);

      // ---------------------------------------------------------------
      // Materials & Toon Ramp (Matches prototypes/cat3d.html)
      // ---------------------------------------------------------------
      var TOON = createToonMap();

      var furMat = new THREE.MeshToonMaterial({ color: 0xdb771f, gradientMap: TOON });
      var furDarkMat = new THREE.MeshToonMaterial({ color: 0x73380e, gradientMap: TOON });
      var bellyMat = new THREE.MeshToonMaterial({ color: 0xf5dec0, gradientMap: TOON });
      var eyeMat = new THREE.MeshStandardMaterial({
        color: 0x8fe04a,
        emissive: 0x8fe04a,
        emissiveIntensity: 0.85,
        roughness: 0.16,
        metalness: 0.05
      });
      var pupilMat = new THREE.MeshStandardMaterial({ color: 0x07090b, roughness: 0.12, metalness: 0.1 });
      var glintMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.95 });
      var noseMat = new THREE.MeshToonMaterial({ color: 0xe4849b, gradientMap: TOON });
      var earInMat = new THREE.MeshToonMaterial({ color: 0xd98f9e, gradientMap: TOON });
      var whiskMat = new THREE.MeshStandardMaterial({ color: 0xf3f6f2, roughness: 0.45, metalness: 0.1 });
      var collarMat = new THREE.MeshStandardMaterial({
        color: accentColor,
        emissive: accentColor,
        emissiveIntensity: 0.55,
        roughness: 0.3,
        metalness: 0.6
      });
      var bellMat = new THREE.MeshStandardMaterial({ color: 0xffe9a8, roughness: 0.22, metalness: 0.95 });
      var yarnMat = new THREE.MeshStandardMaterial({
        color: accentColor,
        emissive: accentColor,
        emissiveIntensity: 0.32,
        roughness: 0.85
      });

      // Dais Platform & Cyber Neon Ring
      var daisMat = new THREE.MeshStandardMaterial({ color: 0x0d1218, roughness: 0.38, metalness: 0.72 });
      var dais = new THREE.Mesh(new THREE.CylinderGeometry(2.35, 2.5, 0.2, 40), daisMat);
      dais.position.y = 0.1;
      scene.add(dais);

      var ringMat = new THREE.MeshBasicMaterial({ color: accentColor, transparent: true, opacity: 0.88 });
      var ring = new THREE.Mesh(new THREE.TorusGeometry(2.38, 0.03, 8, 56), ringMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = 0.21;
      scene.add(ring);

      var floorHalo = new THREE.Mesh(
        new THREE.RingGeometry(2.45, 3.2, 48),
        new THREE.MeshBasicMaterial({ color: accentColor, transparent: true, opacity: 0.12, side: THREE.DoubleSide, depthWrite: false })
      );
      floorHalo.rotation.x = -Math.PI / 2;
      floorHalo.position.y = 0.02;
      scene.add(floorHalo);

      // Contact shadow for free-roaming mode on webpage
      var shadowCanvas = global.document ? global.document.createElement('canvas') : null;
      var shadowTex = null;
      if (shadowCanvas) {
        shadowCanvas.width = shadowCanvas.height = 128;
        var sCtx = shadowCanvas.getContext('2d');
        if (sCtx) {
          var grad = sCtx.createRadialGradient(64, 64, 6, 64, 64, 62);
          grad.addColorStop(0, 'rgba(0,0,0,0.52)');
          grad.addColorStop(0.45, 'rgba(0,0,0,0.24)');
          grad.addColorStop(1, 'rgba(0,0,0,0)');
          sCtx.fillStyle = grad;
          sCtx.fillRect(0, 0, 128, 128);
          shadowTex = new THREE.CanvasTexture(shadowCanvas);
        }
      }
      var contactShadow = new THREE.Mesh(
        new THREE.PlaneGeometry(3.0, 3.0),
        new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, opacity: 0.75, depthWrite: false })
      );
      contactShadow.rotation.x = -Math.PI / 2;
      contactShadow.position.y = 0.02;
      contactShadow.visible = false;
      scene.add(contactShadow);

      // ---------------------------------------------------------------
      // Cat Procedural Hierarchy
      // ---------------------------------------------------------------
      var DAIS_H = 0.2;
      var root = new THREE.Group();
      scene.add(root);
      var rig = new THREE.Group();
      rig.position.y = DAIS_H;
      root.add(rig);

      function mesh(geo, mat, parent) {
        var m = new THREE.Mesh(geo, mat);
        (parent || rig).add(m);
        return m;
      }

      // --- Body (Torso, Chest, Haunches, Spine Bridge, Scapulae & Stripes) ---
      var bodyG = new THREE.Group();
      bodyG.position.set(0, 1.42, 0);
      rig.add(bodyG);

      var torso = mesh(new THREE.SphereGeometry(0.72, 22, 16), furMat, bodyG);
      torso.scale.set(1.0, 1.06, 1.42);

      var chest = mesh(new THREE.SphereGeometry(0.5, 18, 14), bellyMat, bodyG);
      chest.position.set(0, -0.09, 0.62);
      chest.scale.set(0.94, 1.0, 0.86);

      var haunchL = mesh(new THREE.SphereGeometry(0.4, 16, 12), furMat, bodyG);
      haunchL.position.set(0.45, -0.12, -0.55); haunchL.scale.set(0.85, 1.02, 1.0);
      var haunchR = mesh(new THREE.SphereGeometry(0.4, 16, 12), furMat, bodyG);
      haunchR.position.set(-0.45, -0.12, -0.55); haunchR.scale.set(0.85, 1.02, 1.0);

      var spine = mesh(new THREE.SphereGeometry(0.58, 18, 14), furMat, bodyG);
      spine.position.set(0, 0.09, -0.16); spine.scale.set(1.02, 0.92, 1.6);

      var scapL = mesh(new THREE.SphereGeometry(0.28, 14, 10), furMat, bodyG);
      scapL.position.set(0.36, 0.13, 0.56); scapL.scale.set(0.9, 1.0, 1.15);
      var scapR = mesh(new THREE.SphereGeometry(0.28, 14, 10), furMat, bodyG);
      scapR.position.set(-0.36, 0.13, 0.56); scapR.scale.set(0.9, 1.0, 1.15);

      var bellyFur = mesh(new THREE.SphereGeometry(0.48, 16, 12), bellyMat, bodyG);
      bellyFur.position.set(0, -0.38, 0.02); bellyFur.scale.set(0.9, 0.62, 1.5);

      // Back Tabby Stripes
      var stripes = new THREE.Group();
      bodyG.add(stripes);
      for (var si = 0; si < 5; si++) {
        var st = mesh(new THREE.BoxGeometry(1.15, 0.08, 0.09), furDarkMat, stripes);
        st.position.set(0, 0.44 - si * 0.04, 0.44 - si * 0.3);
        st.scale.set(0.86 - si * 0.05, 1, 1);
        st.rotation.x = -0.2 + si * 0.07;
      }

      // --- Neck, Collar & Golden Bell ---
      var neck = mesh(new THREE.CylinderGeometry(0.22, 0.28, 0.32, 14), furMat, rig);
      neck.position.set(0, 1.95, 0.46);
      neck.rotation.x = 0.32;

      var collar = mesh(new THREE.TorusGeometry(0.27, 0.038, 8, 24), collarMat, rig);
      collar.position.set(0, 2.02, 0.52);
      collar.rotation.x = Math.PI / 2 - 0.32;

      var bell = mesh(new THREE.SphereGeometry(0.065, 10, 8), bellMat, rig);
      bell.position.set(0, 1.88, 0.74);

      // --- Head & Face ---
      var head = new THREE.Group();
      head.position.set(0, 2.38, 0.68);
      rig.add(head);

      var skull = mesh(new THREE.SphereGeometry(0.62, 20, 16), furMat, head);
      skull.scale.set(1.06, 0.98, 1.0);

      var cheekL = mesh(new THREE.SphereGeometry(0.26, 14, 10), furMat, head);
      cheekL.position.set(0.35, -0.13, 0.28);
      var cheekR = mesh(new THREE.SphereGeometry(0.26, 14, 10), furMat, head);
      cheekR.position.set(-0.35, -0.13, 0.28);

      var muzzle = mesh(new THREE.SphereGeometry(0.24, 14, 10), bellyMat, head);
      muzzle.position.set(0, -0.16, 0.52);
      muzzle.scale.set(1.24, 0.8, 0.85);

      // Ears (with Pink Interior & Tufts)
      function buildEar(side) {
        var earG = new THREE.Group();
        earG.position.set(0.35 * side, 0.44, -0.06);
        earG.rotation.set(-0.16, 0, side * -0.28);
        head.add(earG);

        var outer = mesh(new THREE.ConeGeometry(0.24, 0.56, 4), furMat, earG);
        outer.position.y = 0.25;
        outer.rotation.y = Math.PI / 4;
        outer.scale.set(1, 1, 0.56);

        var inner = mesh(new THREE.ConeGeometry(0.15, 0.38, 4), earInMat, earG);
        inner.position.set(0, 0.22, 0.07);
        inner.rotation.y = Math.PI / 4;
        inner.scale.set(1, 1, 0.4);

        // Tufts
        for (var k = 0; k < 2; k++) {
          var tuft = mesh(new THREE.ConeGeometry(0.024, 0.14, 4), whiskMat, earG);
          tuft.position.set(k ? 0.04 : -0.04, 0.54, 0.03);
          tuft.rotation.set(-0.25, 0, side * 0.2);
        }
        return earG;
      }
      var earL = buildEar(1);
      var earR = buildEar(-1);

      // Eyes with Slit Pupil & Glint
      function buildEye(side) {
        var g = new THREE.Group();
        g.position.set(0.25 * side, 0.04, 0.54);
        head.add(g);

        var ball = mesh(new THREE.SphereGeometry(0.15, 16, 12), eyeMat, g);
        ball.scale.set(1, 1.06, 0.72);

        var pup = mesh(new THREE.SphereGeometry(0.08, 12, 10), pupilMat, g);
        pup.position.set(0, 0, 0.095);
        pup.scale.set(0.55, 1.22, 0.4);

        var gl = mesh(new THREE.SphereGeometry(0.032, 8, 6), glintMat, g);
        gl.position.set(0.04 * side, 0.05, 0.13);

        return { group: g, pupil: pup, ball: ball };
      }
      var eyeL = buildEye(1);
      var eyeR = buildEye(-1);

      var nose = mesh(new THREE.SphereGeometry(0.065, 12, 10), noseMat, head);
      nose.position.set(0, -0.12, 0.71);
      nose.scale.set(1.25, 0.82, 0.72);

      var mouth = mesh(new THREE.TorusGeometry(0.085, 0.016, 6, 16, Math.PI * 0.82), pupilMat, head);
      mouth.position.set(0, -0.23, 0.67);
      mouth.rotation.set(-0.28, 0, Math.PI);

      // Whiskers (3 on each cheek)
      function buildWhiskers(side) {
        var g = new THREE.Group();
        g.position.set(0.22 * side, -0.14, 0.62);
        head.add(g);
        for (var w = 0; w < 3; w++) {
          var len = 0.52 - w * 0.04;
          var wh = mesh(new THREE.CylinderGeometry(0.006, 0.0025, len, 4), whiskMat, g);
          wh.rotation.set(0.06, 0, Math.PI / 2);
          wh.position.set(side * len / 2, (w - 1) * 0.055, -w * 0.02);
          wh.rotation.y = side * (0.16 + w * 0.12);
          wh.rotation.x = (w - 1) * 0.09;
        }
        return g;
      }
      buildWhiskers(1);
      buildWhiskers(-1);

      // --- Legs (3 bones with paws and toes) ---
      function buildLeg(x, z, front) {
        var hip = new THREE.Group();
        hip.position.set(x, front ? 1.45 : 1.32, z);
        rig.add(hip);

        var len1 = front ? 0.6 : 0.54;
        var len2 = front ? 0.6 : 0.52;

        var upper = mesh(new THREE.CylinderGeometry(0.12, 0.105, len1, 10), furMat, hip);
        upper.position.y = -len1 / 2;

        if (!front) {
          var thigh = mesh(new THREE.SphereGeometry(0.25, 14, 10), furMat, hip);
          thigh.position.set(0, -0.08, 0);
          thigh.scale.set(1, 1.1, 1.25);
        }

        var knee = new THREE.Group();
        knee.position.y = -len1;
        hip.add(knee);

        var lower = mesh(new THREE.CylinderGeometry(0.105, 0.09, len2, 10), furMat, knee);
        lower.position.y = -len2 / 2;

        var paw = mesh(new THREE.SphereGeometry(0.15, 14, 10), furDarkMat, knee);
        paw.position.set(0, -len2 - 0.02, 0.04);
        paw.scale.set(1.05, 0.72, 1.3);

        // 3 Toes
        for (var td = -1; td <= 1; td++) {
          var toe = mesh(new THREE.SphereGeometry(0.055, 8, 6), furDarkMat, knee);
          toe.position.set(td * 0.07, -len2 - 0.065, 0.22 + (td === 0 ? 0.02 : 0));
          toe.scale.set(1, 0.8, 1.25);
        }

        return { hip: hip, knee: knee, paw: paw, home: hip.position.clone() };
      }

      var legFL = buildLeg(0.32, 0.6, true);
      var legFR = buildLeg(-0.32, 0.6, true);
      var legBL = buildLeg(0.44, -0.55, false);
      var legBR = buildLeg(-0.44, -0.55, false);
      var legs = [legFL, legFR, legBL, legBR];

      // --- Tail (Articulated with 12 segments) ---
      var tailRoot = new THREE.Group();
      tailRoot.position.set(0, 1.62, -0.88);
      rig.add(tailRoot);
      var tailSegs = [];
      var curParent = tailRoot;
      var TAIL_N = 10;
      for (var ti = 0; ti < TAIL_N; ti++) {
        var seg = new THREE.Group();
        seg.position.z = ti === 0 ? 0 : -0.19;
        curParent.add(seg);
        var tr = Math.max(0.13 - ti * 0.009, 0.045);
        var tj = mesh(new THREE.SphereGeometry(tr, 8, 6), ti > 7 ? furDarkMat : furMat, seg);
        tj.position.z = -0.1;
        tj.scale.z = 1.35;
        tailSegs.push(seg);
        curParent = seg;
      }
      var tailTip = mesh(new THREE.SphereGeometry(0.06, 8, 6), furDarkMat, curParent);
      tailTip.position.z = -0.18;

      // --- Yarn Ball (Toy) with Winding Rings ---
      var yarn = new THREE.Group();
      yarn.position.set(1.45, 0.44, 1.05);
      scene.add(yarn);
      mesh(new THREE.SphereGeometry(0.24, 16, 12), yarnMat, yarn);
      for (var yi = 0; yi < 4; yi++) {
        var yRing = mesh(new THREE.TorusGeometry(0.245, 0.012, 5, 24), yarnMat, yarn);
        yRing.rotation.set(yi * 0.85, yi * 0.62, yi * 0.4);
      }
      var yarnHome = yarn.position.clone();
      var yarnVelocity = new THREE.Vector3();

      // ---------------------------------------------------------------
      // Post-Processing ASCII Shader Pipeline (Optional GLSL Quad)
      // ---------------------------------------------------------------
      var glyphTex = createGlyphAtlas();
      var rtColor = null;
      var asciiQuad = null;
      var asciiScene = null;
      var asciiCamera = null;
      var asciiUniforms = null;
      var renderMode = '3d'; // '3d' | 'ascii' | 'hybrid'

      if (glyphTex) {
        rtColor = new THREE.WebGLRenderTarget(256, 256, {
          minFilter: THREE.LinearFilter,
          magFilter: THREE.LinearFilter,
          format: THREE.RGBAFormat,
          depthBuffer: true
        });
        rtColor.depthTexture = new THREE.DepthTexture();
        rtColor.depthTexture.type = THREE.UnsignedIntType;

        asciiUniforms = {
          tScene:     { value: rtColor.texture },
          tDepth:     { value: rtColor.depthTexture },
          tGlyph:     { value: glyphTex },
          resolution: { value: new THREE.Vector2(256, 256) },
          cell:       { value: 8.0 },
          glyphGrid:  { value: new THREE.Vector2(GLYPH_COLS, GLYPH_ROWS) },
          glyphCount: { value: ASCII_RAMP.length },
          accent:     { value: accentColor },
          bg:         { value: new THREE.Color(0x05070a) },
          tint:       { value: 0.0 },
          edgeMix:    { value: 1.0 },
          edgeGlyphs: { value: EDGE_GLYPHS },
          cameraNear: { value: camera.near },
          cameraFar:  { value: camera.far }
        };

        var asciiMat = new THREE.ShaderMaterial({
          uniforms: asciiUniforms,
          transparent: true,
          vertexShader: [
            'varying vec2 vUv;',
            'void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }'
          ].join('\n'),
          fragmentShader: [
            'precision highp float;',
            'uniform sampler2D tScene;',
            'uniform sampler2D tDepth;',
            'uniform sampler2D tGlyph;',
            'uniform vec2 resolution;',
            'uniform float cell;',
            'uniform vec2 glyphGrid;',
            'uniform float glyphCount;',
            'uniform vec3 accent;',
            'uniform vec3 bg;',
            'uniform float tint;',
            'varying vec2 vUv;',
            THREE.ShaderChunk.packing,
            'float luma(vec3 c) { return dot(c, vec3(0.2126, 0.7152, 0.0722)); }',
            'float glyph(float idx, vec2 p) {',
            '  idx = clamp(floor(idx + 0.5), 0.0, glyphCount - 1.0);',
            '  float gx = mod(idx, glyphGrid.x);',
            '  float gy = floor(idx / glyphGrid.x);',
            '  vec2 uv = (vec2(gx, gy) + clamp(p, 0.02, 0.98)) / glyphGrid;',
            '  uv.y = 1.0 - uv.y;',
            '  return texture2D(tGlyph, uv).r;',
            '}',
            'void main() {',
            '  vec2 frag = vUv * resolution;',
            '  vec2 cellId = floor(frag / cell);',
            '  vec2 cellUv = (cellId + 0.5) * cell / resolution;',
            '  vec2 local = fract(frag / cell);',
            '  vec4 sceneSample = texture2D(tScene, cellUv);',
            '  vec3 sceneCol = sceneSample.rgb;',
            '  float sceneA = sceneSample.a;',
            '  if (sceneA < 0.06 || luma(sceneCol) < 0.008) {',
            '    discard;',
            '  }',
            '  float L = luma(sceneCol);',
            '  float gIdx = floor(L * (glyphCount - 1.0));',
            '  float gAlpha = glyph(gIdx, local);',
            '  if (gAlpha < 0.09) {',
            '    discard;',
            '  }',
            '  // Colores atigrados cálidos modulados por los glifos de texto ASCII',
            '  vec3 charCol = sceneCol * (0.68 + gAlpha * 0.72);',
            '  if (tint > 0.05) {',
            '    charCol = mix(charCol, accent * gAlpha, tint);',
            '  }',
            '  gl_FragColor = vec4(charCol, sceneA * gAlpha);',
            '}'
          ].join('\n')
        });

        asciiScene = new THREE.Scene();
        asciiCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        asciiQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), asciiMat);
        asciiScene.add(asciiQuad);
      }

      // ---------------------------------------------------------------
      // Theme Observer
      // ---------------------------------------------------------------
      var accentObserver = null;
      function setAccent(colorStr) {
        accentColor.set(colorStr || cssAccent());
        collarMat.color.copy(accentColor);
        collarMat.emissive.copy(accentColor);
        yarnMat.color.copy(accentColor);
        yarnMat.emissive.copy(accentColor);
        ringMat.color.copy(accentColor);
        floorHalo.material.color.copy(accentColor);
        rim.color.copy(accentColor);
        if (asciiUniforms) asciiUniforms.accent.value.copy(accentColor);
      }

      // ---------------------------------------------------------------
      // Animation & Locomotion State Loop
      // ---------------------------------------------------------------
      var isVisible = false;
      var isPaused = false;
      var playing = true;
      var time = 0;
      var hitCooldown = 0.25;
      var lastTime = 0;
      var frameId = null;
      var disposed = false;

      // Locomotion & Gait Variables
      var currentPose = 'play'; // 'play' | 'walk' | 'sit'
      var isRoaming = false;
      var walkSpeed = 1.0;
      var gaitPhase = 0;
      var currentHeading = 0;
      var targetHeading = 0;

      function wrapAngle(a) {
        while (a < -Math.PI) a += Math.PI * 2;
        while (a > Math.PI) a -= Math.PI * 2;
        return a;
      }

      function resize() {
        if (disposed) return;
        var width = canvas.clientWidth || stage.clientWidth || 240;
        var height = canvas.clientHeight || stage.clientHeight || 185;
        if (!width || !height) return;
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        if (rtColor) {
          rtColor.setSize(width * (global.devicePixelRatio || 1), height * (global.devicePixelRatio || 1));
          if (asciiUniforms) {
            asciiUniforms.resolution.value.set(width * (global.devicePixelRatio || 1), height * (global.devicePixelRatio || 1));
          }
        }
      }

      function hitYarn() {
        yarnVelocity.set(-0.7 - Math.random() * 0.35, 1.1, -0.2 + Math.random() * 0.4);
        hitCooldown = 0.38;
      }

      function setRoaming(bool) {
        isRoaming = !!bool;
        dais.visible = !isRoaming;
        ring.visible = !isRoaming;
        yarn.visible = !isRoaming;
        floorHalo.visible = !isRoaming;
        contactShadow.visible = isRoaming;
        if (isRoaming) {
          rig.position.y = 0;
        } else {
          rig.position.y = DAIS_H;
        }
      }

      function setPose(p) {
        if (p === 'walk' || p === 'sit' || p === 'play' || p === 'pet' || p === 'sleep') {
          currentPose = p;
          playing = (p === 'play');
          if (p === 'walk') {
            // Restore leg vertical home
            legs.forEach(function (l) { l.hip.position.y = l.home.y; });
          }
        }
      }

      function setHeading(h) {
        if (typeof h === 'number' && !isNaN(h)) {
          targetHeading = h;
        }
      }

      function setWalkSpeed(spd) {
        walkSpeed = Math.max(0.2, Math.min(3.0, +spd || 1.0));
      }

      function update(dt) {
        time += dt;
        hitCooldown -= dt;

        // Smooth heading orientation towards target
        var diffH = wrapAngle(targetHeading - currentHeading);
        currentHeading += diffH * Math.min(1, dt * 9.5);
        rig.rotation.y = currentHeading;

        // Common breathing cycle
        var breathe = Math.sin(time * 2.2) * 0.024;
        bodyG.scale.y = 1.0 + breathe;

        // Subtle Ear twitching
        earL.rotation.z = -0.28 + Math.sin(time * 2.5) * 0.04;
        earR.rotation.z = 0.28 - Math.sin(time * 2.1) * 0.04;

        if (currentPose === 'walk') {
          // --- Quadrupedal Walk / Trot Gait ---
          gaitPhase += dt * walkSpeed * 7.5;
          var p1 = gaitPhase;
          var p2 = gaitPhase + Math.PI;

          // Diagonal Pair 1: Front Left & Back Right
          var swingFL = Math.sin(p1) * 0.44;
          var liftFL = Math.max(0, -Math.sin(p1));
          legFL.hip.rotation.x = swingFL;
          legFL.knee.rotation.x = liftFL * 0.52;
          legFL.hip.position.y = legFL.home.y + liftFL * 0.12;

          var swingBR = -Math.sin(p1) * 0.40;
          var liftBR = Math.max(0, Math.sin(p1));
          legBR.hip.rotation.x = swingBR;
          legBR.knee.rotation.x = liftBR * 0.46;
          legBR.hip.position.y = legBR.home.y + liftBR * 0.09;

          // Diagonal Pair 2: Front Right & Back Left
          var swingFR = Math.sin(p2) * 0.44;
          var liftFR = Math.max(0, -Math.sin(p2));
          legFR.hip.rotation.x = swingFR;
          legFR.knee.rotation.x = liftFR * 0.52;
          legFR.hip.position.y = legFR.home.y + liftFR * 0.12;

          var swingBL = -Math.sin(p2) * 0.40;
          var liftBL = Math.max(0, Math.sin(p2));
          legBL.hip.rotation.x = swingBL;
          legBL.knee.rotation.x = liftBL * 0.46;
          legBL.hip.position.y = legBL.home.y + liftBL * 0.09;

          // Dynamic torso sway and vertical bobbing
          bodyG.position.y = 1.40 + Math.abs(Math.sin(gaitPhase * 2)) * 0.06;
          bodyG.rotation.z = Math.sin(gaitPhase) * 0.04;
          bodyG.rotation.x = -0.02 + Math.sin(gaitPhase * 2) * 0.02;
          spine.rotation.x = Math.sin(gaitPhase * 2) * 0.025;

          // Head harmonic bobbing
          head.position.y = 1.68 + Math.sin(gaitPhase * 2) * 0.03;
          head.rotation.x = Math.cos(gaitPhase * 2) * 0.035;
          head.rotation.y = Math.sin(gaitPhase) * 0.06;

          // Harmonic tail balance
          tailRoot.rotation.y = Math.sin(gaitPhase) * 0.26;
          tailRoot.rotation.x = 0.06 + Math.cos(gaitPhase * 2) * 0.05;
          for (var tw = 0; tw < tailSegs.length; tw++) {
            tailSegs[tw].rotation.y = Math.sin(gaitPhase + tw * 0.3) * 0.12;
            tailSegs[tw].rotation.x = 0.08 + Math.cos(gaitPhase + tw * 0.2) * 0.06;
          }
        } else if (currentPose === 'sit') {
          // --- Sitting / Resting Pose ---
          var sitLerp = Math.min(1, dt * 6.5);
          bodyG.position.y += (1.28 - bodyG.position.y) * sitLerp;
          bodyG.rotation.x += (-0.20 - bodyG.rotation.x) * sitLerp;
          bodyG.rotation.z += (0 - bodyG.rotation.z) * sitLerp;

          // Back legs tucked forward
          legBL.hip.rotation.x += (-0.68 - legBL.hip.rotation.x) * sitLerp;
          legBL.knee.rotation.x += (0.92 - legBL.knee.rotation.x) * sitLerp;
          legBL.hip.position.y += ((legBL.home.y - 0.15) - legBL.hip.position.y) * sitLerp;

          legBR.hip.rotation.x += (-0.68 - legBR.hip.rotation.x) * sitLerp;
          legBR.knee.rotation.x += (0.92 - legBR.knee.rotation.x) * sitLerp;
          legBR.hip.position.y += ((legBR.home.y - 0.15) - legBR.hip.position.y) * sitLerp;

          // Front legs straight
          legFL.hip.rotation.x += (0.05 - legFL.hip.rotation.x) * sitLerp;
          legFL.knee.rotation.x += (0.02 - legFL.knee.rotation.x) * sitLerp;
          legFL.hip.position.y += (legFL.home.y - legFL.hip.position.y) * sitLerp;

          legFR.hip.rotation.x += (0.05 - legFR.hip.rotation.x) * sitLerp;
          legFR.knee.rotation.x += (0.02 - legFR.knee.rotation.x) * sitLerp;
          legFR.hip.position.y += (legFR.home.y - legFR.hip.position.y) * sitLerp;

          // Head looks around gently
          head.rotation.y = Math.sin(time * 0.6) * 0.16;
          head.rotation.x = Math.cos(time * 0.9) * 0.05;

          // Tail wrapped quietly around paws
          tailRoot.rotation.y += (0.64 - tailRoot.rotation.y) * sitLerp;
          tailRoot.rotation.x += (-0.28 - tailRoot.rotation.x) * sitLerp;
          for (var tsi = 0; tsi < tailSegs.length; tsi++) {
            tailSegs[tsi].rotation.y = Math.sin(time * 1.5 + tsi * 0.4) * 0.08;
            tailSegs[tsi].rotation.x = 0.10;
          }
        } else if (currentPose === 'pet') {
          // --- Petting / Arched Happy Back Pose ---
          var petLerp = Math.min(1, dt * 7.0);
          bodyG.position.y += (1.48 - bodyG.position.y) * petLerp;
          bodyG.rotation.x += (-0.12 - bodyG.rotation.x) * petLerp;
          bodyG.rotation.z = Math.sin(time * 3.5) * 0.03;
          spine.rotation.x += (-0.22 - spine.rotation.x) * petLerp;

          // Front legs pushed firmly down, back legs flexing slightly
          legFL.hip.rotation.x += (0.02 - legFL.hip.rotation.x) * petLerp;
          legFL.knee.rotation.x += (0.01 - legFL.knee.rotation.x) * petLerp;
          legFR.hip.rotation.x += (0.02 - legFR.hip.rotation.x) * petLerp;
          legFR.knee.rotation.x += (0.01 - legFR.knee.rotation.x) * petLerp;
          legBL.hip.rotation.x += (-0.3 - legBL.hip.rotation.x) * petLerp;
          legBR.hip.rotation.x += (-0.3 - legBR.hip.rotation.x) * petLerp;

          // Head tilted up happily frotándose
          head.position.y += (1.74 - head.position.y) * petLerp;
          head.rotation.x = -0.30 + Math.sin(time * 3.0) * 0.05;
          head.rotation.y = Math.sin(time * 2.2) * 0.12;

          // Ears flattened slightly in delight
          earL.rotation.z = -0.38 + Math.sin(time * 3.0) * 0.03;
          earR.rotation.z = 0.38 - Math.sin(time * 3.0) * 0.03;

          // Tail high with rapid cheerful wagging
          tailRoot.rotation.x += (0.52 - tailRoot.rotation.x) * petLerp;
          tailRoot.rotation.y = Math.sin(time * 6.0) * 0.42;
          for (var tpi = 0; tpi < tailSegs.length; tpi++) {
            tailSegs[tpi].rotation.y = Math.sin(time * 6.0 + tpi * 0.5) * 0.22;
            tailSegs[tpi].rotation.x = 0.2 + Math.cos(time * 3.0 + tpi * 0.3) * 0.08;
          }
        } else if (currentPose === 'sleep') {
          // --- Sleeping / Catloaf Nap Pose ---
          var sleepLerp = Math.min(1, dt * 5.0);
          var slowBreathe = Math.sin(time * 1.15) * 0.018;
          bodyG.position.y += (1.16 + slowBreathe - bodyG.position.y) * sleepLerp;
          bodyG.rotation.x += (-0.04 - bodyG.rotation.x) * sleepLerp;
          bodyG.rotation.z += (0 - bodyG.rotation.z) * sleepLerp;
          spine.rotation.x += (0.05 - spine.rotation.x) * sleepLerp;

          // Legs tucked flat
          legFL.hip.rotation.x += (0.48 - legFL.hip.rotation.x) * sleepLerp;
          legFL.knee.rotation.x += (0.65 - legFL.knee.rotation.x) * sleepLerp;
          legFL.hip.position.y += ((legFL.home.y - 0.2) - legFL.hip.position.y) * sleepLerp;

          legFR.hip.rotation.x += (0.48 - legFR.hip.rotation.x) * sleepLerp;
          legFR.knee.rotation.x += (0.65 - legFR.knee.rotation.x) * sleepLerp;
          legFR.hip.position.y += ((legFR.home.y - 0.2) - legFR.hip.position.y) * sleepLerp;

          legBL.hip.rotation.x += (-0.82 - legBL.hip.rotation.x) * sleepLerp;
          legBL.knee.rotation.x += (1.08 - legBL.knee.rotation.x) * sleepLerp;
          legBL.hip.position.y += ((legBL.home.y - 0.24) - legBL.hip.position.y) * sleepLerp;

          legBR.hip.rotation.x += (-0.82 - legBR.hip.rotation.x) * sleepLerp;
          legBR.knee.rotation.x += (1.08 - legBR.knee.rotation.x) * sleepLerp;
          legBR.hip.position.y += ((legBR.home.y - 0.24) - legBR.hip.position.y) * sleepLerp;

          // Head rested low near paws
          head.position.y += (1.38 + slowBreathe * 0.6 - head.position.y) * sleepLerp;
          head.rotation.x += (0.16 - head.rotation.x) * sleepLerp;
          head.rotation.y += (0.18 - head.rotation.y) * sleepLerp;

          // Tail curled close around body
          tailRoot.rotation.y += (0.92 - tailRoot.rotation.y) * sleepLerp;
          tailRoot.rotation.x += (-0.42 - tailRoot.rotation.x) * sleepLerp;
          for (var tsi2 = 0; tsi2 < tailSegs.length; tsi2++) {
            tailSegs[tsi2].rotation.y = 0.35 + Math.sin(time * 0.8 + tsi2 * 0.3) * 0.04;
            tailSegs[tsi2].rotation.x = -0.05;
          }
        } else {
          // --- Default: Playing with Yarn on Dais ---
          bodyG.position.y = 1.42 + breathe * 0.4;
          bodyG.rotation.x = 0;
          bodyG.rotation.z = 0;

          // Reset legs toward home
          legFL.hip.rotation.x *= 0.85; legFL.knee.rotation.x *= 0.85; legFL.hip.position.y = legFL.home.y;
          legBL.hip.rotation.x *= 0.85; legBL.knee.rotation.x *= 0.85; legBL.hip.position.y = legBL.home.y;
          legBR.hip.rotation.x *= 0.85; legBR.knee.rotation.x *= 0.85; legBR.hip.position.y = legBR.home.y;

          head.rotation.y = Math.sin(time * 0.7) * 0.12;
          head.rotation.x = Math.cos(time * 1.1) * 0.04;

          for (var ti = 0; ti < tailSegs.length; ti++) {
            var curl = Math.sin(time * 2.8 + ti * 0.45) * 0.16;
            tailSegs[ti].rotation.x = 0.14 + Math.sin(time * 1.8 + ti * 0.3) * 0.08;
            tailSegs[ti].rotation.y = curl;
          }

          if (playing) {
            var pawLift = Math.max(0, Math.sin(time * 4.2)) * 0.22;
            legFR.hip.position.y = legFR.home.y + pawLift;
            legFR.hip.rotation.x = -pawLift * 0.8;
            legFR.knee.rotation.x = pawLift * 0.5;

            // Yarn physics
            if (yarnVelocity.lengthSq() > 0.001) {
              yarn.position.addScaledVector(yarnVelocity, dt * 2.2);
              yarnVelocity.y -= 9.8 * dt * 0.35;
              if (yarn.position.y < 0.44) {
                yarn.position.y = 0.44;
                yarnVelocity.y = -yarnVelocity.y * 0.4;
                yarnVelocity.x *= 0.7;
                yarnVelocity.z *= 0.7;
              }
            } else {
              yarn.position.lerp(yarnHome, 0.04);
            }

            if (hitCooldown <= 0 && yarn.position.distanceTo(yarnHome) < 0.45) {
              hitYarn();
            }
          }
        }
      }

      function renderFrame(now) {
        if (disposed || !isVisible || isPaused) {
          frameId = null;
          return;
        }
        var dt = lastTime ? Math.min((now - lastTime) / 1000, 0.05) : 0.016;
        lastTime = now;
        if (reducedMotion) dt *= 0.25;
        update(dt);

        if (renderMode === 'ascii' && rtColor && asciiScene) {
          renderer.setClearColor(0x000000, 0);
          renderer.setRenderTarget(rtColor);
          renderer.clear();
          renderer.render(scene, camera);
          renderer.setRenderTarget(null);
          renderer.clear();
          asciiUniforms.tint.value = 0.0;
          renderer.render(asciiScene, asciiCamera);
        } else if (renderMode === 'hybrid' && rtColor && asciiScene) {
          renderer.setClearColor(0x000000, 0);
          renderer.setRenderTarget(rtColor);
          renderer.clear();
          renderer.render(scene, camera);
          renderer.setRenderTarget(null);
          renderer.clear();
          asciiUniforms.tint.value = 0.45;
          renderer.render(asciiScene, asciiCamera);
        } else {
          // Default: Crisp Cel-Shaded 3D (Matches prototype reference)
          renderer.render(scene, camera);
        }

        frameId = global.requestAnimationFrame(renderFrame);
      }

      function start() {
        if (disposed || !isVisible || isPaused || frameId !== null) return;
        resize();
        lastTime = 0;
        frameId = global.requestAnimationFrame(renderFrame);
      }

      function show() {
        if (disposed) return;
        isVisible = true;
        isPaused = false;
        setAccent(cssAccent());
        resize();
        start();
      }

      function hide() {
        isVisible = false;
        playing = false;
        if (frameId !== null) {
          global.cancelAnimationFrame(frameId);
          frameId = null;
        }
      }

      function play() {
        if (disposed) return;
        playing = true;
        playMeow();
        show();
      }

      function pause() {
        isPaused = true;
        if (frameId !== null) {
          global.cancelAnimationFrame(frameId);
          frameId = null;
        }
      }

      function resume() {
        if (!disposed && isVisible) {
          isPaused = false;
          start();
        }
      }

      function setMode(mode) {
        if (mode === 'ascii' || mode === 'hybrid' || mode === '3d') {
          renderMode = mode;
        }
      }

      function destroy() {
        disposed = true;
        hide();
        global.removeEventListener('resize', resize);
        if (accentObserver) accentObserver.disconnect();
        renderer.dispose();
      }

      global.addEventListener('resize', resize, { passive: true });
      if (global.MutationObserver) {
        accentObserver = new global.MutationObserver(function () { setAccent(cssAccent()); });
        accentObserver.observe(global.document.body, { attributes: true, attributeFilter: ['data-theme'] });
      }

      // Click to play and trigger sound
      canvas.addEventListener('click', function (e) {
        if (isRoaming) {
          // Permite que el manejador de caricias de roaming en script.js reciba el clic
          return;
        }
        e.stopPropagation();
        if (currentPose === 'play') {
          hitYarn();
        }
        playMeow();
      });

      canvas.__cat3dMini = {
        show: show,
        hide: hide,
        play: play,
        pause: pause,
        resume: resume,
        resize: resize,
        setMode: setMode,
        setPose: setPose,
        getPose: function () { return currentPose; },
        setHeading: setHeading,
        setWalkSpeed: setWalkSpeed,
        setRoaming: setRoaming,
        isRoaming: function () { return isRoaming; },
        playMeow: playMeow,
        playPurr: playPurr,
        destroy: destroy,
        scene: scene,
        root: root,
        state: function () {
          return { visible: isVisible, playing: playing, mode: renderMode, pose: currentPose, roaming: isRoaming };
        }
      };

      resize();
      renderer.render(scene, camera);
      return canvas.__cat3dMini;
    } catch (error) {
      try { if (global.console && global.console.warn) global.console.warn('Cat 3D mini error:', error); } catch (e) {}
      return null;
    }
  }

  global.Cat3DMini = { mount: mount };
})(window);
