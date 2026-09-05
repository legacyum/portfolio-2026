/*
 * Cat 3D Mini — procedural Three.js easter egg for the main portfolio.
 * Kept separate from script.js so the portfolio shell stays readable and the
 * same renderer can be inlined by tests/build-dist.js.
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

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function mount(stage) {
    if (!THREE || !stage || !global.document) return null;
    var canvas = stage.querySelector('#cat3DCanvas');
    if (!canvas || canvas.__cat3dMini) return canvas && canvas.__cat3dMini ? canvas.__cat3dMini : null;

    try {
      var reducedMotion = !!(global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches);
      var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
      renderer.setPixelRatio(Math.min(global.devicePixelRatio || 1, 1.5));
      renderer.setClearColor(0x000000, 0);
      renderer.outputEncoding = THREE.sRGBEncoding;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.08;

      var scene = new THREE.Scene();
      var camera = new THREE.PerspectiveCamera(31, 1, 0.1, 50);
      camera.position.set(0.1, 2.2, 6.6);
      camera.lookAt(0, 1.65, 0);

      var accent = new THREE.Color(cssAccent());
      var fur = new THREE.MeshToonMaterial({ color: 0xd39152 });
      var furDark = new THREE.MeshToonMaterial({ color: 0x7c431f });
      var belly = new THREE.MeshToonMaterial({ color: 0xf4ddc0 });
      var eye = new THREE.MeshStandardMaterial({ color: 0x9bea55, emissive: 0x9bea55, emissiveIntensity: 0.9, roughness: 0.18 });
      var pupil = new THREE.MeshStandardMaterial({ color: 0x080b0d, roughness: 0.15 });
      var glint = new THREE.MeshBasicMaterial({ color: 0xffffff });
      var noseMat = new THREE.MeshToonMaterial({ color: 0xe4849b });
      var earIn = new THREE.MeshToonMaterial({ color: 0xd98f9e });
      var whisk = new THREE.MeshBasicMaterial({ color: 0xf3f6f2 });
      var collarMat = new THREE.MeshStandardMaterial({ color: accent, emissive: accent, emissiveIntensity: 0.65, metalness: 0.55, roughness: 0.3 });
      var bellMat = new THREE.MeshStandardMaterial({ color: 0xffe9a8, metalness: 0.9, roughness: 0.2 });
      var yarnMat = new THREE.MeshStandardMaterial({ color: accent, emissive: accent, emissiveIntensity: 0.45, roughness: 0.8 });
      var floorMat = new THREE.MeshBasicMaterial({ color: accent, transparent: true, opacity: 0.08, side: THREE.DoubleSide, depthWrite: false });

      var hemi = new THREE.HemisphereLight(0xd8f0ff, 0x111713, 1.05);
      scene.add(hemi);
      var key = new THREE.DirectionalLight(0xffffff, 1.45);
      key.position.set(3, 7, 5);
      scene.add(key);
      var rim = new THREE.PointLight(accent, 1.1, 12, 2);
      rim.position.set(-2, 2.5, -2.5);
      scene.add(rim);

      var floor = new THREE.Mesh(new THREE.CircleGeometry(2.35, 40), floorMat);
      floor.rotation.x = -Math.PI / 2;
      floor.position.y = 0.02;
      scene.add(floor);
      var ring = new THREE.Mesh(new THREE.TorusGeometry(1.65, 0.025, 6, 48), new THREE.MeshBasicMaterial({ color: accent, transparent: true, opacity: 0.55 }));
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = 0.04;
      scene.add(ring);

      var root = new THREE.Group();
      root.position.y = 0.08;
      scene.add(root);
      var rig = new THREE.Group();
      root.add(rig);

      function mesh(geometry, material, parent) {
        var item = new THREE.Mesh(geometry, material);
        item.castShadow = false;
        item.receiveShadow = false;
        (parent || rig).add(item);
        return item;
      }

      var body = new THREE.Group();
      body.position.set(0, 1.48, 0);
      rig.add(body);
      var torso = mesh(new THREE.SphereGeometry(0.72, 16, 12), fur, body);
      torso.scale.set(1, 1.08, 1.23);
      var chest = mesh(new THREE.SphereGeometry(0.48, 14, 10), belly, body);
      chest.position.set(0, -0.08, 0.62);
      chest.scale.set(0.95, 1, 0.76);

      function buildLeg(x, z, front) {
        var leg = new THREE.Group();
        leg.position.set(x, front ? 1.35 : 1.2, z);
        leg.userData.home = leg.position.clone();
        leg.userData.base = new THREE.Vector3(front ? -0.08 : 0, 0, front ? (x > 0 ? 0.05 : -0.05) : (x > 0 ? 0.18 : -0.18));
        rig.add(leg);
        var length = front ? 1.05 : 0.82;
        var upper = mesh(new THREE.CylinderGeometry(0.12, 0.105, length, 8), fur, leg);
        upper.position.y = -length / 2;
        var paw = mesh(new THREE.SphereGeometry(0.16, 12, 9), furDark, leg);
        paw.position.set(0, -length - 0.03, 0.06);
        paw.scale.set(1.05, 0.7, 1.25);
        return leg;
      }

      var legFL = buildLeg(0.34, 0.62, true);
      var legFR = buildLeg(-0.34, 0.62, true);
      var legBL = buildLeg(0.48, -0.62, false);
      var legBR = buildLeg(-0.48, -0.62, false);
      var legs = [legFL, legFR, legBL, legBR];

      var tailRoot = new THREE.Group();
      tailRoot.position.set(0, 1.65, -0.92);
      rig.add(tailRoot);
      var tailSegments = [];
      var tailParent = tailRoot;
      for (var ti = 0; ti < 8; ti++) {
        var tailPart = new THREE.Group();
        tailPart.position.z = ti === 0 ? 0 : -0.2;
        tailParent.add(tailPart);
        var tailSphere = mesh(new THREE.SphereGeometry(Math.max(0.14 - ti * 0.012, 0.06), 10, 8), ti > 5 ? furDark : fur, tailPart);
        tailSphere.position.z = -0.1;
        tailSphere.scale.z = 1.35;
        tailSegments.push(tailPart);
        tailParent = tailPart;
      }

      var neck = mesh(new THREE.CylinderGeometry(0.29, 0.36, 0.42, 12), fur, rig);
      neck.position.set(0, 2.12, 0.64);
      neck.rotation.x = 0.36;
      var collar = mesh(new THREE.TorusGeometry(0.35, 0.045, 8, 24), collarMat, rig);
      collar.position.set(0, 2.2, 0.72);
      collar.rotation.x = Math.PI / 2 - 0.36;
      var bell = mesh(new THREE.SphereGeometry(0.07, 10, 8), bellMat, rig);
      bell.position.set(0, 2.05, 1.02);

      var head = new THREE.Group();
      head.position.set(0, 2.62, 0.78);
      rig.add(head);
      var skull = mesh(new THREE.SphereGeometry(0.68, 18, 14), fur, head);
      skull.scale.set(1.05, 0.98, 1);
      var cheekL = mesh(new THREE.SphereGeometry(0.27, 12, 9), fur, head);
      cheekL.position.set(0.38, -0.17, 0.32);
      var cheekR = mesh(new THREE.SphereGeometry(0.27, 12, 9), fur, head);
      cheekR.position.set(-0.38, -0.17, 0.32);
      var muzzle = mesh(new THREE.SphereGeometry(0.25, 12, 9), belly, head);
      muzzle.position.set(0, -0.19, 0.55);
      muzzle.scale.set(1.25, 0.78, 0.85);

      function buildEar(side) {
        var ear = new THREE.Group();
        ear.position.set(0.35 * side, 0.48, -0.04);
        ear.rotation.z = side * -0.25;
        head.add(ear);
        var outer = mesh(new THREE.ConeGeometry(0.24, 0.58, 4), fur, ear);
        outer.position.y = 0.26;
        outer.rotation.y = Math.PI / 4;
        outer.scale.z = 0.6;
        var inner = mesh(new THREE.ConeGeometry(0.14, 0.39, 4), earIn, ear);
        inner.position.set(0, 0.23, 0.08);
        inner.rotation.y = Math.PI / 4;
        inner.scale.z = 0.45;
        return ear;
      }
      var earL = buildEar(1);
      var earR = buildEar(-1);

      function buildEye(side) {
        var group = new THREE.Group();
        group.position.set(0.25 * side, 0.02, 0.55);
        head.add(group);
        var ball = mesh(new THREE.SphereGeometry(0.15, 12, 10), eye, group);
        ball.scale.set(1, 1.08, 0.7);
        var pup = mesh(new THREE.SphereGeometry(0.08, 10, 8), pupil, group);
        pup.position.z = 0.09;
        pup.scale.set(0.55, 1.2, 0.4);
        var shine = mesh(new THREE.SphereGeometry(0.03, 8, 6), glint, group);
        shine.position.set(0.035 * side, 0.05, 0.13);
        return { group: group, ball: ball, pupil: pup };
      }
      var eyeL = buildEye(1);
      var eyeR = buildEye(-1);
      var nose = mesh(new THREE.SphereGeometry(0.06, 10, 8), noseMat, head);
      nose.position.set(0, -0.14, 0.73);
      nose.scale.set(1.2, 0.8, 0.7);
      var mouth = mesh(new THREE.TorusGeometry(0.075, 0.014, 6, 14, Math.PI * 0.8), pupil, head);
      mouth.position.set(0, -0.24, 0.7);
      mouth.rotation.set(-0.25, 0, Math.PI);

      function buildWhiskers(side) {
        var group = new THREE.Group();
        group.position.set(0.22 * side, -0.13, 0.62);
        head.add(group);
        for (var wi = 0; wi < 2; wi++) {
          var line = mesh(new THREE.CylinderGeometry(0.004, 0.002, 0.45, 5), whisk, group);
          line.position.set(side * 0.23, (wi - 0.5) * 0.06, -wi * 0.02);
          line.rotation.set(0.05, side * (0.18 + wi * 0.1), Math.PI / 2);
        }
      }
      buildWhiskers(1);
      buildWhiskers(-1);

      var yarn = new THREE.Group();
      yarn.position.set(1.28, 0.34, 0.9);
      scene.add(yarn);
      mesh(new THREE.SphereGeometry(0.22, 14, 10), yarnMat, yarn);
      for (var yi = 0; yi < 3; yi++) {
        var yarnRing = mesh(new THREE.TorusGeometry(0.225, 0.01, 5, 20), yarnMat, yarn);
        yarnRing.rotation.set(yi * 0.9, yi * 0.65, yi * 0.4);
      }
      var yarnHome = yarn.position.clone();
      var yarnVelocity = new THREE.Vector3();
      var tmpTarget = new THREE.Vector3();
      var tmpHead = new THREE.Vector3();
      var frameId = null;
      var lastTime = 0;
      var disposed = false;
      var isVisible = false;
      var isPaused = false;
      var playing = true;
      var time = 0;
      var hitCooldown = 0.25;
      var pulse = 0;
      var walkBlend = 0;
      var accentObserver = null;

      function setAccent(value) {
        accent.set(value || cssAccent());
        collarMat.color.copy(accent);
        collarMat.emissive.copy(accent);
        yarnMat.color.copy(accent);
        yarnMat.emissive.copy(accent);
        floorMat.color.copy(accent);
        ring.material.color.copy(accent);
        rim.color.copy(accent);
      }

      function resize() {
        if (disposed) return;
        var width = canvas.clientWidth || stage.clientWidth || 184;
        var height = canvas.clientHeight || stage.clientHeight || 140;
        if (!width || !height) return;
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      }

      function hitYarn() {
        yarnVelocity.set(-0.7 - Math.random() * 0.35, 1.05, -0.2 + Math.random() * 0.4);
        pulse = 1;
        hitCooldown = 0.36;
      }

      function solveStep(leg, phase, stride, lift, dirX, dirZ, blend) {
        var home = leg.userData.home;
        var swing = Math.sin(phase) * stride * blend;
        var liftAmount = Math.max(0, Math.sin(phase)) * lift * blend;
        leg.position.x = home.x + dirX * swing;
        leg.position.y = home.y + liftAmount;
        leg.position.z = home.z + dirZ * swing;
        leg.rotation.x = leg.userData.base.x + clamp((-dirZ * swing - liftAmount * 0.18) / 1.2, -0.25, 0.25);
        leg.rotation.y = leg.userData.base.y;
        leg.rotation.z = leg.userData.base.z + clamp((dirX * swing) / 1.2, -0.25, 0.25);
      }

      function update(dt) {
        time += dt;
        pulse = Math.max(0, pulse - dt * 4.4);
        hitCooldown -= dt;

        var phase = time * (playing ? 6.1 : 1.8);
        var wave = Math.sin(phase);
        var right = Math.max(0, wave);
        var left = Math.max(0, -wave);
        var pounce = playing ? Math.pow(Math.max(0, Math.sin(phase - 0.65)), 2) : 0;
        var targetX = playing ? clamp(yarn.position.x - 0.7, -0.62, 0.7) : 0;
        var targetZ = playing ? clamp(yarn.position.z - 0.62, -0.48, 0.54) : 0;
        var dx = targetX - root.position.x;
        var dz = targetZ - root.position.z;
        var distance = Math.sqrt(dx * dx + dz * dz);
        var inv = distance > 0.001 ? 1 / distance : 0;
        var dirX = dx * inv;
        var dirZ = dz * inv;
        var moving = playing && distance > 0.035;
        walkBlend += ((moving ? 1 : 0) - walkBlend) * (1 - Math.exp(-8 * dt));
        root.position.x += (targetX - root.position.x) * (1 - Math.exp(-8 * dt));
        root.position.z += (targetZ - root.position.z) * (1 - Math.exp(-8 * dt));
        root.position.y += ((0.08 + pounce * 0.22) - root.position.y) * (1 - Math.exp(-12 * dt));

        var breathe = Math.sin(time * 2) * (playing ? 0.025 : 0.035);
        var bodyY = 1.48 + breathe + (playing ? pounce * 0.09 : 0);
        body.position.y += (bodyY - body.position.y) * (1 - Math.exp(-10 * dt));
        body.rotation.x += ((playing ? -0.12 + pounce * 0.08 : 0) - body.rotation.x) * (1 - Math.exp(-10 * dt));
        body.rotation.z += (Math.sin(phase * 0.5) * 0.035 - body.rotation.z) * (1 - Math.exp(-10 * dt));
        body.scale.y += (1 + breathe * 0.8 - body.scale.y) * (1 - Math.exp(-10 * dt));

        solveStep(legFL, phase, 0.18, 0.1, dirX, dirZ, walkBlend);
        solveStep(legBR, phase, 0.2, 0.09, dirX, dirZ, walkBlend);
        solveStep(legFR, phase + Math.PI, 0.18, 0.1, dirX, dirZ, walkBlend);
        solveStep(legBL, phase + Math.PI, 0.2, 0.09, dirX, dirZ, walkBlend);
        legFR.rotation.x -= right * 0.58;
        legFR.rotation.z += right * 0.18;
        legFL.rotation.x -= left * 0.52;
        legFL.rotation.z -= left * 0.16;

        yarn.getWorldPosition(tmpTarget);
        head.getWorldPosition(tmpHead);
        var lookX = clamp((tmpTarget.x - tmpHead.x) * 0.16, -0.42, 0.42);
        var lookY = clamp((tmpTarget.y - tmpHead.y) * 0.13, -0.25, 0.25);
        head.rotation.y += (lookX - head.rotation.y) * (1 - Math.exp(-7 * dt));
        head.rotation.x += (-lookY - head.rotation.x) * (1 - Math.exp(-7 * dt));

        tailSegments.forEach(function (segment, index) {
          var tailPhase = time * (playing ? 5.2 : 1.35) - index * 0.42;
          segment.rotation.y += (Math.sin(tailPhase) * (playing ? 0.26 : 0.1) - segment.rotation.y) * (1 - Math.exp(-10 * dt));
          segment.rotation.x += (0.12 + Math.cos(tailPhase) * (playing ? 0.15 : 0.06) - segment.rotation.x) * (1 - Math.exp(-10 * dt));
        });
        earL.rotation.x = Math.sin(time * 1.8) * 0.035;
        earR.rotation.x = Math.sin(time * 1.8 + 0.5) * 0.035;
        bell.rotation.z = Math.sin(time * 3.2) * 0.15;
        ring.material.opacity = 0.38 + Math.sin(time * 2.2) * 0.12 + pulse * 0.24;
        yarn.scale.setScalar(1 + pulse * 0.1);
        yarnMat.emissiveIntensity = 0.45 + pulse * 0.8;
        eye.emissiveIntensity = 0.8 + Math.sin(time * 2.3) * 0.14 + pulse * 0.3;
        [eyeL, eyeR].forEach(function (eyePart) {
          eyePart.pupil.scale.x += (0.58 - eyePart.pupil.scale.x) * (1 - Math.exp(-14 * dt));
          eyePart.pupil.scale.y += (0.95 - eyePart.pupil.scale.y) * (1 - Math.exp(-14 * dt));
        });

        yarnVelocity.y -= 3.6 * dt;
        yarn.position.addScaledVector(yarnVelocity, dt);
        if (yarn.position.y < yarnHome.y) {
          yarn.position.y = yarnHome.y;
          if (yarnVelocity.y < -0.25) yarnVelocity.y = -yarnVelocity.y * 0.38;
          else yarnVelocity.y = 0;
          yarnVelocity.x *= Math.max(0, 1 - 2.8 * dt);
          yarnVelocity.z *= Math.max(0, 1 - 2.8 * dt);
        }
        var returnVector = yarnHome.clone().sub(yarn.position);
        returnVector.y = 0;
        if (returnVector.length() > 0.01) {
          yarn.position.addScaledVector(returnVector.normalize(), Math.min(returnVector.length(), 0.8) * dt * (playing ? 0.8 : 1.6));
        }
        yarn.rotation.x += dt * (0.8 + yarnVelocity.length() * 2);
        yarn.rotation.z += dt * (0.6 + yarnVelocity.length() * 1.5);
        if (playing && wave > 0.97 && hitCooldown <= 0 && yarn.position.distanceTo(yarnHome) < 0.48) hitYarn();
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
        renderer.render(scene, camera);
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
        if (yarn.position.distanceTo(yarnHome) > 0.6) yarn.position.lerp(yarnHome, 0.35);
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
      canvas.__cat3dMini = {
        show: show,
        hide: hide,
        play: play,
        pause: pause,
        resume: resume,
        resize: resize,
        destroy: destroy,
        scene: scene,
        root: root,
        state: function () { return { visible: isVisible, playing: playing, walking: walkBlend > 0.05 }; }
      };
      resize();
      renderer.render(scene, camera);
      return canvas.__cat3dMini;
    } catch (error) {
      try { if (global.console && global.console.warn) global.console.warn('Cat 3D mini disabled:', error); } catch (e) {}
      return null;
    }
  }

  global.Cat3DMini = { mount: mount };
})(window);
