'use strict';
/* Harness de humo para prototypes/cat3d.html (NO es parte del sitio).
   Corre el script inline en un VM con DOM/WebGL stub + three.min.js real
   (sandbox compartido en tests/prototype-cat3d-harness.js).
   Validación: geometría, sistema de poses, FX, interacciones, loop y
   — desde v0.2 — locomoción: IK de patas, ciclo de marcha, navegación,
   manejo por teclado, paseo autónomo y regreso a casa. */
const assert = require('assert');
const { createCatSandbox } = require('./prototype-cat3d-harness');

const H = createCatSandbox();
const { sandbox, byId, poseButtons, themeButtons, furSwButtons, documentStub, docHandlers, winHandlers, errors, stepFrames, REVISION } = H;
const log = (...a) => console.log(...a);

let passed = 0;
function check(name, fn) {
  try { fn(); passed++; log('  ✔', name); }
  catch (e) { log('  ✘', name); throw e; }
}

// ---------- aserciones base ----------
assert.ok(sandbox.__cat3D, 'window.__cat3D no está expuesto');
const cat = sandbox.__cat3D;
assert.ok(cat.isReady === true, '__cat3D.isReady !== true');
assert.strictEqual(cat.version, '0.2.0-prototype');
assert.ok(cat.scene && cat.camera && cat.renderer, 'faltan scene/camera/renderer');

const scene = cat.scene;
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

stepFrames(40);

// ---------- poses estáticas (regresión v0.1) ----------
log('\n— poses y acciones —');
['sleep', 'play', 'sit', 'play', 'sleep', 'sit'].forEach(p => {
  cat.setPose(p);
  assert.strictEqual(cat.state.pose, p, 'setPose falló en ' + p);
  stepFrames(30);
});
check('las poses estáticas no mueven al gato de la plataforma', () => {
  assert.ok(Math.hypot(cat.root.position.x, cat.root.position.z) < 1e-6, 'root se desplazó en pose estática');
  assert.strictEqual(cat.walkDebug().ikWeight, 0, 'IK activa en pose estática');
});
check('en "sit" las 4 garras quedan a la altura original (silueta v0.1 intacta)', () => {
  stepFrames(90);
  const d = cat.walkDebug();
  const y = d.legs.map(l => l.pawWorld.y);
  // medidas del prototipo v0.1 (pata recta): delanteras ≈ 0.40, traseras ≈ 0.72
  assert.ok(Math.abs(y[0] - 0.40) < 0.06 && Math.abs(y[1] - 0.40) < 0.06, 'garras delanteras: ' + y.slice(0, 2));
  assert.ok(Math.abs(y[2] - 0.72) < 0.12 && Math.abs(y[3] - 0.72) < 0.12, 'garras traseras: ' + y.slice(2));
});

cat.meow(); stepFrames(30);
cat.pet(); stepFrames(60);
cat.startle(); stepFrames(60);
check('el sobresalto sigue saltando (root.y > 0.5 en el pico)', () => {
  cat.startle();
  let peak = 0;
  for (let i = 0; i < 50; i++) { stepFrames(1); peak = Math.max(peak, cat.root.position.y); }
  assert.ok(peak > 0.5, 'pico de salto ' + peak.toFixed(2));
  stepFrames(60);
  assert.ok(cat.root.position.y < 0.02, 'no volvió al suelo');
});

['gris', 'negro', 'blanco', 'siames', 'neon', 'tabby'].forEach(f => {
  cat.setFur(f);
  assert.strictEqual(cat.state.fur, f);
  stepFrames(6);
});
['cyan', 'amber', ''].forEach(t => {
  cat.setTheme(t);
  assert.strictEqual(cat.state.theme, t);
  stepFrames(6);
});
cat.toggleWireframe();
assert.strictEqual(cat.state.wire, true);
stepFrames(10);
cat.toggleWireframe();
assert.strictEqual(cat.state.wire, false);

// ---------- locomoción ----------
log('\n— locomoción —');
const THREE = H.THREE;
const near = (a, b, eps) => Math.abs(a - b) <= eps;

check('groundY(): plataforma 0.26, bisel, suelo 0', () => {
  assert.strictEqual(cat.groundY(0, 0), 0.26);
  assert.strictEqual(cat.groundY(3.4, 0), 0.26);
  assert.strictEqual(cat.groundY(0, 6), 0);
  const b = cat.groundY(3.61, 0);
  assert.ok(b > 0 && b < 0.26, 'bisel fuera de rango: ' + b);
});

check('goTo(3,-2): llega (<0.3 u), orientado hacia el destino, con pasos y IK cerrada', () => {
  cat.setPose('sit');
  stepFrames(30);
  const steps0 = cat.walkDebug().steps;
  cat.goTo(3, -2);
  assert.strictEqual(cat.state.pose, 'walk');
  assert.ok(cat.state.navTarget && cat.state.navTarget.x === 3 && cat.state.navTarget.z === -2, 'navTarget ' + JSON.stringify(cat.state.navTarget)); // (objeto de otro contexto VM: sin deepStrictEqual)
  let maxErr = 0, maxSpeed = 0, headingAtMid = null;
  for (let i = 0; i < 60 * 6; i++) {
    stepFrames(1);
    const d = cat.walkDebug();
    d.legs.forEach(l => { maxErr = Math.max(maxErr, l.reachErr); });
    maxSpeed = Math.max(maxSpeed, d.speed);
    if (i === 90) headingAtMid = d.heading;
    if (!cat.state.navTarget) break;
  }
  const d = cat.walkDebug();
  assert.ok(Math.hypot(d.pos[0] - 3, d.pos[2] + 2) < 0.3, 'no llegó: ' + d.pos);
  assert.strictEqual(cat.state.navTarget, null, 'navTarget no se limpió al llegar');
  assert.ok(near(headingAtMid, Math.atan2(3, -2), 0.25), 'rumbo a mitad de camino ' + headingAtMid.toFixed(2) + ' vs ' + Math.atan2(3, -2).toFixed(2));
  assert.ok(maxSpeed > 1.4 && maxSpeed <= 1.6 * 1.36 + 1e-6, 'velocidad máx ' + maxSpeed.toFixed(2));
  assert.ok(maxErr < 1e-3, 'IK no cierra: err máx ' + maxErr);
  assert.ok(d.steps - steps0 >= 8, 'muy pocos pasos: ' + (d.steps - steps0));
  assert.strictEqual(d.ikWeight, 1);
});

check('marcha: las garras apoyadas no patinan y las que vuelan se elevan', () => {
  cat.drive({ fwd: true });
  stepFrames(60);
  let maxSlip = 0, maxLift = 0, swings = 0;
  const prev = {};
  for (let i = 0; i < 120; i++) {
    stepFrames(1);
    const d = cat.walkDebug();
    d.legs.forEach(l => {
      if (!l.swinging) {
        if (prev[l.key]) maxSlip = Math.max(maxSlip, prev[l.key].distanceTo(l.pawWorld));
        prev[l.key] = l.pawWorld.clone();
      } else { prev[l.key] = null; swings++; maxLift = Math.max(maxLift, l.lift); }
    });
  }
  cat.drive({ fwd: false });
  assert.ok(maxSlip < 0.03, 'las garras apoyadas patinan: ' + maxSlip.toFixed(3) + ' u/frame');
  assert.ok(maxLift > 0.1, 'el paso no levanta la garra: ' + maxLift.toFixed(3));
  assert.ok(swings > 40, 'apenas hubo fases de vuelo: ' + swings);
});

check('paso lateral al andar: tras cada trasera despega la delantera del mismo lado', () => {
  cat.drive({ fwd: true });
  stepFrames(80);
  const order = [];
  let last = {};
  for (let i = 0; i < 240; i++) {
    stepFrames(1);
    cat.walkDebug().legs.forEach(l => { if (l.swinging && !last[l.key]) order.push(l.key); last[l.key] = l.swinging; });
  }
  cat.drive({ fwd: false });
  const seq = order.join(' ');
  assert.ok(order.length >= 8, 'secuencia corta: ' + seq);
  let lateral = 0, total = 0;
  for (let i = 0; i < order.length - 1; i++) {
    if (order[i][0] === 'B') { total++; if (order[i + 1] === 'F' + order[i][1]) lateral++; }
  }
  assert.ok(lateral / Math.max(total, 1) >= 0.75, 'secuencia no lateral: ' + seq);
});

check('correr (shift): ~3.6 u/s, duty baja y pares diagonales (trote)', () => {
  cat.drive({ fwd: true, run: true });
  stepFrames(120);
  const d = cat.walkDebug();
  assert.ok(near(d.speed, 3.6, 0.05), 'velocidad ' + d.speed);
  assert.ok(d.duty < 0.56, 'duty al correr ' + d.duty.toFixed(2));
  assert.ok(cat.state.running === true);
  // pares diagonales en vuelo simultáneo
  let diag = 0, frames = 0;
  for (let i = 0; i < 120; i++) {
    stepFrames(1);
    const s = cat.walkDebug().legs.map(l => l.swinging);
    if ((s[0] && s[3]) || (s[1] && s[2])) diag++;
    if (s.some(Boolean)) frames++;
  }
  cat.drive({ fwd: false, run: false });
  assert.ok(diag / Math.max(frames, 1) > 0.5, 'no trota en diagonal: ' + diag + '/' + frames);
});

check('la arena tiene límite: nunca sale de r ≤ 9.5', () => {
  cat.drive({ fwd: true, run: true });
  let maxR = 0;
  for (let i = 0; i < 60 * 8; i++) { stepFrames(1); maxR = Math.max(maxR, Math.hypot(cat.root.position.x, cat.root.position.z)); }
  cat.drive({ fwd: false, run: false });
  assert.ok(maxR <= 9.5 + 1e-6, 'se salió: ' + maxR);
});

check('girar en el sitio (left) rota el rumbo y da pasitos sin patinar', () => {
  const h0 = cat.state.heading, s0 = cat.walkDebug().steps;
  cat.drive({ left: true });
  stepFrames(45);
  cat.drive({ left: false });
  stepFrames(30);
  const dh = ((cat.state.heading - h0 + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
  assert.ok(dh > 0.8, 'no giró lo suficiente: ' + dh.toFixed(2));
  assert.ok(cat.walkDebug().steps > s0, 'giró sin dar pasos');
  assert.ok(Math.abs(cat.state.speed) < 0.05, 'giró avanzando');
});

check('marcha atrás: velocidad negativa', () => {
  cat.drive({ back: true });
  stepFrames(60);
  assert.ok(cat.state.speed < -0.5, 'speed ' + cat.state.speed);
  cat.drive({ back: false });
  stepFrames(40);
  assert.strictEqual(cat.state.speed, 0);
});

check('goHome(): vuelve al centro, mira al frente (rumbo 0) y se sienta', () => {
  cat.goHome();
  for (let i = 0; i < 60 * 14 && cat.state.pose !== 'sit'; i++) stepFrames(1);
  assert.strictEqual(cat.state.pose, 'sit', 'no se sentó al llegar');
  stepFrames(60);
  const d = cat.walkDebug();
  assert.ok(Math.hypot(d.pos[0], d.pos[2]) < 0.3, 'no volvió al centro: ' + d.pos);
  assert.ok(Math.abs(d.heading) < 0.05, 'rumbo final ' + d.heading);
  assert.strictEqual(d.ikWeight, 0, 'la IK no se desactivó al sentarse');
});

check('reposo: en pose walk sin órdenes se sienta solo (~4.5 s)', () => {
  cat.setPose('walk', true);
  cat.stop();
  stepFrames(60 * 6);
  assert.strictEqual(cat.state.pose, 'sit');
});

check('botón/tecla "caminar" activa el paseo autónomo y se mueve por la arena', () => {
  cat.setPose('walk');
  assert.strictEqual(cat.state.autoWalk, true);
  let maxD = 0;
  for (let i = 0; i < 60 * 15; i++) { stepFrames(1); maxD = Math.max(maxD, Math.hypot(cat.root.position.x, cat.root.position.z)); }
  assert.ok(maxD > 1.5, 'no paseó: máx ' + maxD.toFixed(2));
  assert.ok(maxD <= 9.5, 'salió de la arena');
});

check('"jugar" lejos del ovillo: primero vuelve caminando y luego juega', () => {
  cat.goTo(5, 4);
  for (let i = 0; i < 60 * 8 && cat.state.navTarget; i++) stepFrames(1);
  cat.setPose('play');
  assert.strictEqual(cat.state.pose, 'walk', 'debería ir caminando hacia el ovillo');
  for (let i = 0; i < 60 * 14 && cat.state.pose !== 'play'; i++) stepFrames(1);
  assert.strictEqual(cat.state.pose, 'play');
  assert.ok(Math.hypot(cat.root.position.x, cat.root.position.z) < 0.4, 'juega lejos del ovillo');
});

check('una pose estática cancela la navegación (dormir a medio camino)', () => {
  cat.goTo(-4, 3);
  stepFrames(40);
  cat.setPose('sleep');
  assert.strictEqual(cat.state.navTarget, null);
  const p = cat.root.position.clone();
  stepFrames(90);
  assert.ok(p.distanceTo(cat.root.position) < 0.3, 'siguió andando dormido');
  assert.strictEqual(cat.state.pose, 'sleep');
});

check('sobresalto en marcha: salta y las garras suben con el cuerpo', () => {
  cat.goTo(2, 2, { quiet: true });
  stepFrames(50);
  cat.startle();
  let minPawY = Infinity, peak = 0;
  for (let i = 0; i < 40; i++) {
    stepFrames(1);
    peak = Math.max(peak, cat.root.position.y);
    if (cat.root.position.y > 0.6) cat.walkDebug().legs.forEach(l => { minPawY = Math.min(minPawY, l.pawWorld.y - cat.root.position.y); });
  }
  assert.ok(peak > 0.5, 'no saltó: ' + peak);
  assert.ok(minPawY > -0.5, 'las garras se quedaron clavadas al suelo durante el salto: ' + minPawY);
  stepFrames(120);
});

check('teclado: flechas y WASD (mantenidas) manejan; toque corto de W/S/A = atajo', () => {
  cat.setPose('sit'); stepFrames(30);
  const kd = (key, extra) => (winHandlers.keydown || []).forEach(fn => fn(Object.assign({ key, target: { tagName: 'BODY' }, preventDefault() {} }, extra || {})));
  const ku = key => (winHandlers.keyup || []).forEach(fn => fn({ key, target: { tagName: 'BODY' }, preventDefault() {} }));
  kd('ArrowUp'); stepFrames(60);
  assert.strictEqual(cat.state.pose, 'walk');
  assert.ok(cat.state.speed > 1, 'ArrowUp no avanza');
  kd('ArrowUp', { repeat: true });               // auto-repeat no debe romper nada
  kd('Shift'); stepFrames(60);
  assert.ok(cat.state.speed > 3, 'Shift no corre: ' + cat.state.speed);
  ku('Shift'); ku('ArrowUp'); stepFrames(60);
  assert.strictEqual(cat.state.speed, 0, 'no frenó al soltar');
  // W mantenida → avanza (el setTimeout del sandbox dispara en el siguiente tick real)
  const wire0 = cat.state.wire;
  kd('w');
  return new Promise(res => setTimeout(res, 5)).then(() => {
    stepFrames(60);
    assert.ok(cat.state.speed > 1, 'W mantenida no avanza');
    ku('w'); stepFrames(60);
    assert.strictEqual(cat.state.wire, wire0, 'W mantenida no debe alternar wireframe');
    assert.strictEqual(cat.state.speed, 0);
  });
});

// el check anterior devuelve una promesa: el resto va encadenado
(async () => {
  await new Promise(res => setTimeout(res, 10));

  check('toque corto de W alterna wireframe (compatibilidad v0.1)', () => {
    const wire0 = cat.state.wire;
    const kd = key => (winHandlers.keydown || []).forEach(fn => fn({ key, target: { tagName: 'BODY' }, preventDefault() {} }));
    const ku = key => (winHandlers.keyup || []).forEach(fn => fn({ key, target: { tagName: 'BODY' }, preventDefault() {} }));
    kd('w'); ku('w');
    assert.strictEqual(cat.state.wire, !wire0);
    kd('w'); ku('w');
    assert.strictEqual(cat.state.wire, wire0);
  });

  check('click en el suelo (fuera del gato) lo hace caminar hasta ahí', () => {
    cat.goHome();
    for (let i = 0; i < 60 * 14 && cat.state.pose !== 'sit'; i++) stepFrames(1);
    stepFrames(30);
    // proyectamos un punto del suelo a pantalla con la cámara real y hacemos click ahí
    const target = new THREE.Vector3(4.5, 0, 2.5);
    const v = target.clone().project(cat.camera);
    const x = (v.x * 0.5 + 0.5) * sandbox.innerWidth, y = (-v.y * 0.5 + 0.5) * sandbox.innerHeight;
    (winHandlers.pointerdown || []).forEach(fn => fn({ clientX: x, clientY: y }));
    (winHandlers.pointerup || []).forEach(fn => fn({ clientX: x, clientY: y }));
    assert.ok(cat.state.navTarget, 'no se fijó destino');
    assert.ok(Math.hypot(cat.state.navTarget.x - 4.5, cat.state.navTarget.z - 2.5) < 0.3, 'destino equivocado: ' + JSON.stringify(cat.state.navTarget));
    assert.strictEqual(cat.state.pose, 'walk');
    for (let i = 0; i < 60 * 10 && cat.state.navTarget; i++) stepFrames(1);
    assert.ok(Math.hypot(cat.root.position.x - 4.5, cat.root.position.z - 2.5) < 0.35, 'no llegó al click');
  });

  check('la cámara (OrbitControls) sigue al gato', () => {
    const t = cat.controls.target;
    assert.ok(Math.hypot(t.x - cat.root.position.x, t.z - cat.root.position.z) < 0.6, 'pivote lejos del gato: ' + [t.x, t.z]);
  });

  check('prefers-reduced-motion: la locomoción funciona a 25 % sin romperse', () => {
    const R = createCatSandbox({ reducedMotion: true });
    const c2 = R.sandbox.__cat3D;
    R.stepFrames(30);
    c2.goTo(2, 0);
    for (let i = 0; i < 60 * 12 && c2.state.navTarget; i++) R.stepFrames(1);
    assert.ok(Math.hypot(c2.root.position.x - 2, c2.root.position.z) < 0.4, 'no llegó con reduced motion: ' + c2.root.position.toArray());
    let nan = 0;
    c2.scene.traverse(o => { if (![o.position.x, o.position.y, o.position.z, o.rotation.x, o.rotation.y, o.rotation.z].every(Number.isFinite)) nan++; });
    assert.strictEqual(nan, 0);
  });

  // ---------- UI clicks / eventos (regresión v0.1) ----------
  log('\n— UI y eventos —');
  poseButtons.forEach(b => { b.dispatch('click', {}); stepFrames(12); });
  themeButtons.forEach(b => { b.dispatch('click', {}); stepFrames(6); });
  ['btnMeow', 'btnPet', 'btnStartle', 'btnHome', 'btnWire', 'btnSpin', 'btnSound', 'btnReset'].forEach(id => {
    byId[id].dispatch('click', {});
    stepFrames(6);
  });
  assert.strictEqual(cat.state.sound, false, 'el toggle de sonido no funcionó');
  byId.btnSound.dispatch('click', {});
  assert.strictEqual(cat.state.sound, true);
  assert.ok(furSwButtons.length === 0 || furSwButtons.length === 6, 'swatches no registrados (query fallback)');

  (winHandlers.pointermove || []).forEach(fn => fn({ clientX: 900, clientY: 300 }));
  stepFrames(30);
  ['1', '2', '3', '4', 'h', 'm', 'p', 'r', 'c', 't'].forEach(k => {
    (winHandlers.keydown || []).forEach(fn => fn({ key: k, target: { tagName: 'BODY' }, preventDefault() {} }));
    (winHandlers.keyup || []).forEach(fn => fn({ key: k, target: { tagName: 'BODY' }, preventDefault() {} }));
    stepFrames(8);
  });
  (winHandlers.resize || []).forEach(fn => fn({}));
  (winHandlers.blur || []).forEach(fn => fn({}));
  stepFrames(5);

  documentStub.visibilityState = 'hidden';
  (docHandlers.visibilitychange || []).forEach(fn => fn({}));
  stepFrames(10);
  documentStub.visibilityState = 'visible';
  (docHandlers.visibilitychange || []).forEach(fn => fn({}));
  stepFrames(10);
  log('  ✔ botones, swatches, teclas, resize, blur y visibilitychange');

  // ---------- integridad final ----------
  let nanCount = 0;
  scene.traverse(o => {
    const v = [o.position.x, o.position.y, o.position.z, o.rotation.x, o.rotation.y, o.rotation.z, o.scale.x, o.scale.y, o.scale.z];
    if (v.some(n => !Number.isFinite(n))) { nanCount++; }
  });
  assert.strictEqual(nanCount, 0, nanCount + ' objetos con NaN/Inf tras la simulación');

  stepFrames(400);
  let fxLeft = 0;
  scene.traverse(o => { if (o.isSprite) fxLeft++; });
  assert.ok(fxLeft < 40, 'fuga de sprites FX: ' + fxLeft);

  const fatal = errors.filter(e => !/THREE\.WebGLRenderer|WEBGL|extension|deprecated|WebGL/i.test(e));
  log('\nframes simulados    : >6000');
  log('pasos dados         :', cat.walkDebug().steps);
  log('sprites FX activos  :', fxLeft);
  log('checks              :', passed + 1);
  log('warnings/errors     :', errors.length, fatal.length ? '(no-WebGL: ' + fatal.length + ')' : '(todos WebGL-stub, esperados)');
  if (fatal.length) log(fatal.slice(0, 12).join('\n'));
  assert.strictEqual(fatal.length, 0, 'hay errores no relacionados con el stub WebGL');
  log('\n✅ HUMO OK — prototipo gato 3D construye, anima, camina e interactúa sin errores.');
})().catch(e => { console.error(e); process.exit(1); });
