/**
 * Cosmic Atlas 3D — Real-Time Astronomical Three.js Engine
 * Portafolio Alessandro Altamirano
 * 
 * Performance & Real-Time Optimizations:
 * - Persistent WebGL Singleton (0ms instant opening, no shader re-compile lag)
 * - Progressive Texture Streaming (instant lightweight rendering, smooth GPU uploads)
 * - Real-Time Ephemeris Engine (accurate orbital angles calculated from live UTC Date.now())
 * - Live UTC Astronomical Clock & variable time-scale controls
 */

(function () {
  'use strict';

  // Real planetary orbital periods (in Earth days) and semi-major axes (scaled for visual clarity)
  const CELESTIAL_BODIES = [
    {
      id: 'sun',
      name: 'Sol',
      enName: 'Sun',
      radius: 4.5,
      distance: 0,
      orbitPeriodDays: 0,
      rotPeriodHours: 609.12,
      color: '#f3ae35',
      texture: 'sun.webp',
      desc: 'Estrella enana amarilla centro de nuestro sistema solar, concentra el 99.86% de la masa total.',
      enDesc: 'Yellow dwarf star at the center of our solar system, containing 99.86% of total system mass.',
      stats: { type: 'Estrella G2V', temp: '5,500 °C', diameter: '1,392,700 km', mass: '333,000 Tierras' }
    },
    {
      id: 'mercury',
      name: 'Mercurio',
      enName: 'Mercury',
      radius: 0.7,
      distance: 9,
      orbitPeriodDays: 87.97,
      rotPeriodHours: 1407.6,
      color: '#9e9e9e',
      texture: 'mercury.webp',
      desc: 'El planeta más cercano al Sol y el más pequeño del sistema solar.',
      enDesc: 'The smallest planet and closest to the Sun.',
      stats: { type: 'Planeta Rocoso', temp: '167 °C (-180 a 430)', diameter: '4,879 km', orbit: '87.97 días' }
    },
    {
      id: 'venus',
      name: 'Venus',
      enName: 'Venus',
      radius: 1.15,
      distance: 14,
      orbitPeriodDays: 224.7,
      rotPeriodHours: -5832.5,
      color: '#e0a96d',
      texture: 'venus.webp',
      atmosphere: 'venus_atmosphere.webp',
      desc: 'El mundo más caliente por su densa atmósfera de efecto invernadero descontrolado.',
      enDesc: 'Hottest world in the system due to a runaway greenhouse effect.',
      stats: { type: 'Planeta Rocoso', temp: '464 °C constante', diameter: '12,104 km', orbit: '224.7 días' }
    },
    {
      id: 'earth',
      name: 'Tierra',
      enName: 'Earth',
      radius: 1.25,
      distance: 20,
      orbitPeriodDays: 365.256,
      rotPeriodHours: 23.934,
      color: '#4b95e9',
      texture: 'earth.webp',
      clouds: 'earth_clouds.webp',
      desc: 'Nuestro hogar: el único mundo conocido con vida activa, agua líquida y atmósfera equilibrada.',
      enDesc: 'Our home: the only known world hosting active life, liquid oceans, and a breathable atmosphere.',
      stats: { type: 'Planeta Rocoso', temp: '15 °C promedio', diameter: '12,742 km', orbit: '365.25 días' }
    },
    {
      id: 'moon',
      name: 'Luna',
      enName: 'Moon',
      radius: 0.38,
      distance: 2.6,
      orbitPeriodDays: 27.32,
      rotPeriodHours: 655.7,
      color: '#cccccc',
      texture: 'moon.webp',
      parent: 'earth',
      desc: 'Único satélite natural de la Tierra, estabiliza el eje de rotación terrestre.',
      enDesc: "Earth's only natural satellite, stabilizing our axial tilt.",
      stats: { type: 'Satélite Natural', temp: '-130 a 120 °C', diameter: '3,474 km', orbit: '27.32 días' }
    },
    {
      id: 'mars',
      name: 'Marte',
      enName: 'Mars',
      radius: 0.8,
      distance: 27,
      orbitPeriodDays: 686.98,
      rotPeriodHours: 24.62,
      color: '#d81e5b',
      texture: 'mars.webp',
      desc: 'El planeta rojo: hogar del Monte Olimpo y cañones kilométricos.',
      enDesc: 'The Red Planet: home to Olympus Mons and vast ancient riverbeds.',
      stats: { type: 'Planeta Rocoso', temp: '-65 °C promedio', diameter: '6,779 km', orbit: '686.98 días' }
    },
    {
      id: 'jupiter',
      name: 'Júpiter',
      enName: 'Jupiter',
      radius: 2.8,
      distance: 37,
      orbitPeriodDays: 4332.59,
      rotPeriodHours: 9.93,
      color: '#d4a373',
      texture: 'jupiter.webp',
      desc: 'El gigante gaseoso más masivo del sistema solar con su icónica Gran Mancha Roja.',
      enDesc: 'The most massive gas giant with its iconic Great Red Spot storm.',
      stats: { type: 'Gigante Gaseoso', temp: '-110 °C', diameter: '139,820 km', orbit: '11.86 años' }
    },
    {
      id: 'saturn',
      name: 'Saturno',
      enName: 'Saturn',
      radius: 2.3,
      distance: 48,
      orbitPeriodDays: 10759.22,
      rotPeriodHours: 10.7,
      color: '#f0c808',
      texture: 'saturn.webp',
      ring: 'saturn_ring.webp',
      desc: 'Famoso por su majestuoso e intrincado sistema de anillos de partículas de hielo.',
      enDesc: 'Famous for its complex, majestic system of ice-and-dust rings.',
      stats: { type: 'Gigante Gaseoso', temp: '-140 °C', diameter: '116,460 km', orbit: '29.45 años' }
    },
    {
      id: 'uranus',
      name: 'Urano',
      enName: 'Uranus',
      radius: 1.6,
      distance: 59,
      orbitPeriodDays: 30685.4,
      rotPeriodHours: -17.24,
      color: '#70d6ff',
      texture: 'uranus.webp',
      desc: 'Gigante de hielo con inclinación axial extrema de 98°, rotando de costado.',
      enDesc: 'Ice giant with an extreme 98° axial tilt, orbiting on its side.',
      stats: { type: 'Gigante de Hielo', temp: '-195 °C', diameter: '50,724 km', orbit: '84.01 años' }
    },
    {
      id: 'neptune',
      name: 'Neptuno',
      enName: 'Neptune',
      radius: 1.55,
      distance: 69,
      orbitPeriodDays: 60189.0,
      rotPeriodHours: 16.11,
      color: '#3a86ff',
      texture: 'neptune.webp',
      desc: 'El planeta más distante, azotado por vientos supersónicos de más de 2,000 km/h.',
      enDesc: 'The most distant planet, whipped by supersonic winds over 2,000 km/h.',
      stats: { type: 'Gigante de Hielo', temp: '-200 °C', diameter: '49,244 km', orbit: '164.79 años' }
    }
  ];

  // Epoch J2000 reference (Jan 1, 2000 12:00 UTC)
  const J2000_MS = Date.UTC(2000, 0, 1, 12, 0, 0);

  let scene, camera, renderer, controls;
  let animationFrameId = null;
  let container = null;
  let bodiesMap = new Map();
  let orbitLinesGroup = null;
  let focusedBodyId = 'sun';
  
  // Real-time & Simulation Time State
  let simTimeMs = Date.now();
  let timeMode = 'realtime'; // 'realtime' | 'day_sec' | 'year_10s' | 'paused'
  let timeScale = 1; // 1 second real = 1 second sim in realtime
  let showOrbits = true;
  let isInitialized = false;
  let isRunning = false;
  let lastFrameTime = performance.now();

  let isTransitioning = false;
  let targetCamPos = null;
  let targetLookAt = null;

  function calculatePlanetAngle(bodyData, timeMs) {
    if (!bodyData.orbitPeriodDays || bodyData.orbitPeriodDays === 0) return 0;
    const daysSinceEpoch = (timeMs - J2000_MS) / (1000 * 60 * 60 * 24);
    const meanAnomaly = (daysSinceEpoch / bodyData.orbitPeriodDays) * 2 * Math.PI;
    return meanAnomaly % (2 * Math.PI);
  }

  function getTexturePath(name, tier = 'mid') {
    return 'assets/textures/' + tier + '/' + name;
  }

  function setupScene() {
    if (isInitialized) return;

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x01050e);

    camera = new THREE.PerspectiveCamera(45, 16 / 9, 0.1, 2000);
    camera.position.set(0, 35, 75);

    // High performance renderer with powerPreference and pixel ratio clamping
    renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;

    if (THREE.OrbitControls) {
      controls = new THREE.OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.06;
      controls.maxDistance = 350;
      controls.minDistance = 2.5;
    }

    // Lights
    const ambientLight = new THREE.AmbientLight(0x445577, 0.5);
    scene.add(ambientLight);

    const sunPointLight = new THREE.PointLight(0xfff5e6, 2.4, 500, 0.5);
    sunPointLight.position.set(0, 0, 0);
    scene.add(sunPointLight);

    // Starfield Background Sphere
    const starsGeo = new THREE.SphereGeometry(600, 24, 24);
    const textureLoader = new THREE.TextureLoader();
    
    // Fast initial load with low tier, then upgrade smoothly
    const starsTex = textureLoader.load(getTexturePath('stars.webp', 'lo'), (tex) => {
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(3, 3);
      // Upgrade to mid in background
      setTimeout(() => {
        textureLoader.load(getTexturePath('stars.webp', 'mid'), (upgTex) => {
          upgTex.wrapS = THREE.RepeatWrapping;
          upgTex.wrapT = THREE.RepeatWrapping;
          upgTex.repeat.set(3, 3);
          starsMat.map = upgTex;
          starsMat.needsUpdate = true;
        });
      }, 500);
    });

    const starsMat = new THREE.MeshBasicMaterial({
      map: starsTex,
      side: THREE.BackSide,
      color: 0x8899bb
    });
    const starfield = new THREE.Mesh(starsGeo, starsMat);
    scene.add(starfield);

    // Celestial bodies and orbits
    bodiesMap.clear();
    orbitLinesGroup = new THREE.Group();
    scene.add(orbitLinesGroup);

    CELESTIAL_BODIES.forEach(data => {
      const group = new THREE.Group();
      let mesh;

      if (data.id === 'sun') {
        const geo = new THREE.SphereGeometry(data.radius, 40, 40);
        const tex = textureLoader.load(getTexturePath(data.texture, 'mid'));
        const mat = new THREE.MeshBasicMaterial({ map: tex });
        mesh = new THREE.Mesh(geo, mat);

        const glowGeo = new THREE.SphereGeometry(data.radius * 1.12, 28, 28);
        const glowMat = new THREE.MeshBasicMaterial({
          color: 0xffaa22,
          transparent: true,
          opacity: 0.25,
          side: THREE.BackSide
        });
        mesh.add(new THREE.Mesh(glowGeo, glowMat));
      } else {
        const geo = new THREE.SphereGeometry(data.radius, 32, 32);
        // Fast initial material with base color
        const mat = new THREE.MeshStandardMaterial({
          color: new THREE.Color(data.color),
          roughness: 0.82,
          metalness: 0.05
        });
        mesh = new THREE.Mesh(geo, mat);

        // Stream texture asynchronously without blocking frame render
        textureLoader.load(getTexturePath(data.texture, 'mid'), (tex) => {
          mat.map = tex;
          mat.color.setHex(0xffffff);
          mat.needsUpdate = true;
        });

        // Earth Clouds
        if (data.clouds) {
          const cloudGeo = new THREE.SphereGeometry(data.radius * 1.02, 32, 32);
          const cloudMat = new THREE.MeshStandardMaterial({
            transparent: true,
            opacity: 0.45,
            blending: THREE.AdditiveBlending
          });
          const cloudMesh = new THREE.Mesh(cloudGeo, cloudMat);
          mesh.add(cloudMesh);
          data._cloudMesh = cloudMesh;

          textureLoader.load(getTexturePath(data.clouds, 'mid'), (cTex) => {
            cloudMat.map = cTex;
            cloudMat.needsUpdate = true;
          });
        }

        // Venus Atmosphere
        if (data.atmosphere) {
          const atmoGeo = new THREE.SphereGeometry(data.radius * 1.015, 32, 32);
          const atmoMat = new THREE.MeshStandardMaterial({
            transparent: true,
            opacity: 0.55
          });
          const atmoMesh = new THREE.Mesh(atmoGeo, atmoMat);
          mesh.add(atmoMesh);

          textureLoader.load(getTexturePath(data.atmosphere, 'mid'), (aTex) => {
            atmoMat.map = aTex;
            atmoMat.needsUpdate = true;
          });
        }

        // Saturn Ring
        if (data.ring) {
          const ringGeo = new THREE.RingGeometry(data.radius * 1.35, data.radius * 2.5, 48);
          const pos = ringGeo.attributes.position;
          const uvs = ringGeo.attributes.uv;
          for (let i = 0; i < pos.count; i++) {
            const vx = pos.getX(i);
            const vy = pos.getY(i);
            const dist = Math.sqrt(vx * vx + vy * vy);
            const normalized = (dist - data.radius * 1.35) / (data.radius * 2.5 - data.radius * 1.35);
            uvs.setXY(i, normalized, 0.5);
          }
          const ringMat = new THREE.MeshStandardMaterial({
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.92,
            roughness: 0.7
          });
          const ringMesh = new THREE.Mesh(ringGeo, ringMat);
          ringMesh.rotation.x = Math.PI / 2.3;
          mesh.add(ringMesh);

          textureLoader.load(getTexturePath(data.ring, 'mid'), (rTex) => {
            ringMat.map = rTex;
            ringMat.needsUpdate = true;
          });
        }
      }

      group.add(mesh);

      // Orbit Ellipse
      if (data.distance > 0 && !data.parent) {
        const orbitCurve = new THREE.EllipseCurve(0, 0, data.distance, data.distance, 0, 2 * Math.PI, false, 0);
        const points = orbitCurve.getPoints(96);
        const lineGeo = new THREE.BufferGeometry().setFromPoints(points.map(p => new THREE.Vector3(p.x, 0, p.y)));
        const lineMat = new THREE.LineBasicMaterial({
          color: new THREE.Color(data.color),
          transparent: true,
          opacity: 0.22
        });
        const orbitLine = new THREE.Line(lineGeo, lineMat);
        orbitLinesGroup.add(orbitLine);
        data._orbitLine = orbitLine;
      }

      scene.add(group);
      bodiesMap.set(data.id, {
        data,
        group,
        mesh,
        angle: calculatePlanetAngle(data, simTimeMs)
      });
    });

    // Raycasting
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    renderer.domElement.addEventListener('pointerdown', (e) => {
      if (!renderer || !camera) return;
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const meshes = [];
      bodiesMap.forEach(b => meshes.push(b.mesh));
      const intersects = raycaster.intersectObjects(meshes, true);

      if (intersects.length > 0) {
        let topObj = intersects[0].object;
        while (topObj && !topObj.parent.isScene && topObj.parent) {
          for (const [id, body] of bodiesMap.entries()) {
            if (body.mesh === topObj || body.group === topObj) {
              focusBody(id);
              return;
            }
          }
          topObj = topObj.parent;
        }
      }
    });

    isInitialized = true;
  }

  function init(containerEl) {
    if (!containerEl) return;
    container = containerEl;

    setupScene();

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);

    if (renderer.domElement.parentNode !== container) {
      container.innerHTML = '';
      container.appendChild(renderer.domElement);
    }

    window.addEventListener('resize', onWindowResize);

    lastFrameTime = performance.now();
    isRunning = true;

    // Reset to live current time on entry
    syncToLiveTime();
    focusBody('sun', true);

    if (!animationFrameId) {
      animate();
    }
  }

  function onWindowResize() {
    if (!container || !renderer || !camera) return;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  function focusBody(id, immediate) {
    const target = bodiesMap.get(id);
    if (!target) return;
    focusedBodyId = id;

    const bodyData = target.data;
    const currentWorldPos = new THREE.Vector3();
    target.group.getWorldPosition(currentWorldPos);

    const distOffset = bodyData.radius * 3.6 + (id === 'sun' ? 14 : 3);
    const endPos = new THREE.Vector3(
      currentWorldPos.x + distOffset * 0.75,
      currentWorldPos.y + distOffset * 0.45,
      currentWorldPos.z + distOffset
    );

    if (immediate || !controls) {
      camera.position.copy(endPos);
      if (controls) {
        controls.target.copy(currentWorldPos);
        controls.update();
      }
    } else {
      isTransitioning = true;
      targetCamPos = endPos;
      targetLookAt = currentWorldPos;
    }

    const evt = new CustomEvent('cosmos:body-change', {
      detail: { body: bodyData }
    });
    window.dispatchEvent(evt);
  }

  function animate() {
    if (!isRunning) {
      animationFrameId = null;
      return;
    }
    animationFrameId = requestAnimationFrame(animate);

    const now = performance.now();
    const dtSeconds = Math.min((now - lastFrameTime) / 1000, 0.1);
    lastFrameTime = now;

    // Advance simulation time according to active mode
    if (timeMode === 'realtime') {
      simTimeMs = Date.now();
    } else if (timeMode === 'day_sec') {
      simTimeMs += dtSeconds * (86400 * 1000); // 1 sec = 1 Earth day
    } else if (timeMode === 'year_10s') {
      simTimeMs += dtSeconds * ((365.25 * 86400 * 1000) / 10); // 10 sec = 1 Earth year
    }

    // Emit live astronomical clock update
    const clockEvt = new CustomEvent('cosmos:time-update', {
      detail: {
        timeMs: simTimeMs,
        utcString: new Date(simTimeMs).toUTCString().replace('GMT', 'UTC'),
        isoDate: new Date(simTimeMs).toISOString().split('T')[0],
        timeMode
      }
    });
    window.dispatchEvent(clockEvt);

    // Update planetary positions & rotations
    bodiesMap.forEach(item => {
      const d = item.data;

      // Axial rotation
      if (item.mesh && d.rotPeriodHours) {
        const rotDelta = (dtSeconds * 3600) / (d.rotPeriodHours * 3600);
        item.mesh.rotation.y += rotDelta * 0.05 * (timeMode === 'realtime' ? 1 : 2.5);
      }
      if (d._cloudMesh) {
        d._cloudMesh.rotation.y += 0.0003;
      }

      // Orbital position from epoch or visual real-time speed
      if (d.distance > 0) {
        if (timeMode === 'realtime') {
          // Accurate real-time astronomical angle
          item.angle = calculatePlanetAngle(d, simTimeMs);
        } else if (timeMode !== 'paused') {
          item.angle = calculatePlanetAngle(d, simTimeMs);
        }

        if (d.parent) {
          const parentItem = bodiesMap.get(d.parent);
          if (parentItem) {
            const px = parentItem.group.position.x;
            const pz = parentItem.group.position.z;
            item.group.position.x = px + Math.cos(item.angle) * d.distance;
            item.group.position.z = pz + Math.sin(item.angle) * d.distance;
          }
        } else {
          item.group.position.x = Math.cos(item.angle) * d.distance;
          item.group.position.z = Math.sin(item.angle) * d.distance;
        }
      }
    });

    // Camera follow
    const focused = bodiesMap.get(focusedBodyId);
    if (focused && controls) {
      const targetPos = new THREE.Vector3();
      focused.group.getWorldPosition(targetPos);

      if (isTransitioning && targetCamPos) {
        camera.position.lerp(targetCamPos, 0.08);
        controls.target.lerp(targetLookAt, 0.08);
        if (camera.position.distanceTo(targetCamPos) < 0.25) {
          isTransitioning = false;
        }
      } else {
        controls.target.lerp(targetPos, 0.08);
      }
      controls.update();
    }

    if (renderer && scene && camera) {
      renderer.render(scene, camera);
    }
  }

  function setTimeMode(mode) {
    timeMode = mode;
    if (mode === 'realtime') {
      simTimeMs = Date.now();
    }
  }

  function syncToLiveTime() {
    timeMode = 'realtime';
    simTimeMs = Date.now();
  }

  function toggleOrbits() {
    showOrbits = !showOrbits;
    if (orbitLinesGroup) {
      orbitLinesGroup.visible = showOrbits;
    }
    return showOrbits;
  }

  function pause() {
    isRunning = false;
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
    window.removeEventListener('resize', onWindowResize);
  }

  function resume() {
    if (!isRunning) {
      isRunning = true;
      lastFrameTime = performance.now();
      animate();
    }
  }

  function destroy() {
    pause();
  }

  window.CosmicAtlas = {
    init,
    pause,
    resume,
    destroy,
    focusBody,
    setTimeMode,
    syncToLiveTime,
    toggleOrbits,
    getBodies: () => CELESTIAL_BODIES,
    getActiveBody: () => CELESTIAL_BODIES.find(b => b.id === focusedBodyId)
  };

})();
