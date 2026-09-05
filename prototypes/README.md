# Proto-lab · Gato 3D low-poly procedural

> **Estado: prototipo experimental (`v0.2.0-prototype`)** — no forma parte del sitio publicado.
> `prototypes/` no es leído por `tests/build-dist.js` ni por `tests/run-e2e-tests.js`,
> así que este archivo no afecta el bundle `dist/` ni los 103 tests E2E.

## Qué es

Un gato 3D **100 % procedural**: toda la geometría se construye en código con primitivas
de Three.js (esferas, conos, cilindros, toros). No hay ningún `.glb`/`.gltf` externo,
ni texturas descargadas, ni dependencias nuevas. Reutiliza el vendor que ya existe en
el repo (`src/vendor/three.min.js` **r128** + `src/vendor/OrbitControls.js`).

- **83 mallas · ~27 400 triángulos** en escena.
- Estética *cyber-industrial* alineada al portafolio: plataforma metálica, rejilla
  cuántica en el suelo, aro neón pulsante, jaula esférica wireframe y polvo en suspensión.
- Las 3 paletas son **las mismas de `src/styles.css`**: verde `#c9ff62`, cyan `#7beeff`,
  ámbar `#ffce64`.

## Cómo verlo

```bash
node tests/server.js
# → http://localhost:3000/prototypes/cat3d.html
```

## Anatomía del gato

| Parte | Técnica |
|---|---|
| Torso / pecho / ancas | `SphereGeometry` escaladas no uniformemente |
| Franjas atigradas | `BoxGeometry` finas sobre el lomo |
| Patas | cadena de **3 huesos** (`cadera → rodilla/corvejón → garra`); la cadera usa orden Euler `ZXY` (rz = abducción, rx = balanceo) y la rodilla es una bisagra en X. Las poses estáticas las mueven por FK; la marcha, por **IK analítica de 2 huesos** |
| Cola | **cadena de 12 `Group`s anidados**; una onda sinusoidal viajera con desfase por segmento produce el meneo natural |
| Cabeza / mejillas / hocico | esferas escaladas, `MeshToonMaterial` con `gradientMap` de 4 bandas |
| Orejas | `ConeGeometry` de 4 lados (low-poly) + cono interno rosa + mechones |
| Ojos | esfera emisiva + pupila vertical + destrezo especular + **párpado que se cierra por escala Y** |
| Bigotes | cilindros de radio 0.008 con abanico por lado |
| Collar y campanilla | `TorusGeometry` emisivo con el color del tema activo |

El material es `MeshToonMaterial` (cel-shading) con un `DataTexture` de 4 niveles en
`THREE.LuminanceFormat`, lo que da el look plano/low-poly sin sacrificar sombras.

## Sistema de animación

En vez de keyframes, hay un **sistema de poses con target + amortiguación exponencial**:

1. Cada frame se copia la pose base (`sit`, `sleep`, `play`) a un objeto target `T`.
2. Las acciones (respiración, parpadeo, ronroneo, maullido, sobresalto, seguimiento del
   puntero, tics de oreja) **suman offsets** sobre ese target.
3. Todo se aproxima al target con `1 - exp(-λ·dt)` → transiciones suaves y *frame-rate
   independent* (delta-time acotado a 50 ms).

| Comportamiento | Detalle |
|---|---|
| Respiración | escala Y del torso ±0.026 (±0.055 dormido) |
| Parpadeo | aleatorio cada 2.4–6.6 s, con 14 % de doble parpadeo |
| Seguimiento de mirada | la cabeza apunta al `Raycaster` sobre un plano, clampeado a ±0.42 rad |
| Tics de oreja | cada 4–11 s |
| Cola | onda viajera; velocidad y amplitud cambian por pose (1.5 sentado → 5.2 jugando) |
| Dormir | se enrosca, suelta sprites `Z` cada 1.35 s |
| Jugar | zarpazo sincronizado que **impulsa el ovillo con física simple** (gravedad, rebote 0.44, fricción y retorno elástico a su sitio) |
| Sobresalto | salto parabólico, lomo arqueado, **cola erizada** (`tailPuff` +0.85), orejas hacia atrás, pupilas dilatadas |
| Caminar | ver **Locomoción** más abajo |

## Locomoción (v0.2)

El gato **camina de verdad** por la arena (radio 9.5 u): baja de la plataforma, sube el bisel,
gira, corre, retrocede y vuelve a casa. Es 100 % procedural: no hay clips de animación.

### Capas

1. **Órdenes** (prioridad: teclado > navegación > paseo autónomo)
   - **Click en el suelo** → `goTo(x, z)`: aparece un aro en el destino y el gato va hasta ahí.
   - **WASD / flechas** (mantenidas) → manejo directo; **Shift** = correr. Como `W` `S` `A`
     ya eran atajos de UI (wireframe / asustar / sonido), solo actúan como manejo si se
     **mantienen ≥ 180 ms**; un toque corto sigue ejecutando el atajo (en `keyup`).
   - Botón/tecla **`4` caminar** → paseo autónomo por waypoints aleatorios, con pausas y algún maullido.
   - **`H` a casa** → `goHome()`: vuelve al centro, gira a rumbo 0 y se sienta.
   - `jugar` estando lejos del ovillo → primero camina hasta él y luego juega.
   - Tras **4.5 s** quieto en pose `walk` sin órdenes, se sienta solo.
2. **Cinemática del cuerpo**: velocidad y yaw con aceleración acotada (`WALK 1.6` · `RUN 3.6`
   · `BACK 0.7` u/s, giro 2.6 rad/s). En navegación primero gira y luego avanza
   (`desired *= clamp(1.35 - |err|)`).
3. **Generador de marcha** (`updateLocomotion`): fase global `gaitPhase` con frecuencia
   `f = clamp(v_eff / stride, 0.9, 2.8)`. Cada pata tiene un desfase:

   | | FL | FR | BL | BR |
   |---|---|---|---|---|
   | offset | 0.75 | 0.25 | 0.00 | 0.50 |

   → orden de despegue **BR → FR → BL → FL** = *paso lateral* (tras una trasera, la
   delantera del mismo lado), que es el andar real del gato. Al correr, `gaitShift → +0.25`
   en las traseras y el *duty* baja de 0.68 a 0.50 → **trote por pares diagonales** (FL+BR, FR+BL).
   Girar en el sitio también genera pasitos porque la velocidad de cada huella incluye `ω × r`.
4. **Huellas**: cada pata alterna *apoyo* (la garra queda **clavada en el mundo**, no patina) y
   *vuelo* (arco `sin(π·s)` con `smoothstep`, hacia una huella predicha
   `home + v_huella · (t_restante + ½·duty/f)`). La altura de la huella sale de `groundY(x, z)`
   (plataforma 0.26 → bisel → suelo 0), así que **sube y baja el escalón** con cabeceo del cuerpo.
5. **IK** (`solveLegIK`): resuelve `{cadera: [rx, 0, rz], rodilla}` analíticamente contra la huella
   en coordenadas de `rig`. La articulación visible apunta **hacia atrás** en las 4 patas (codo /
   corvejón). El peso IK ↔ FK se mezcla exponencialmente (`loco.w`), así que la transición
   sentado ↔ de pie es continua; durante un salto las garras suben con el cuerpo.
6. **Secundario**: bamboleo vertical a 2× la frecuencia, roll lateral, inclinación hacia dentro
   de la curva, cabeza mirando hacia donde gira, cola en alto contrabalanceando y más horizontal al
   correr. La cámara (`OrbitControls`) y la luz de sombras **siguen al gato**.

## Interacción

- **Arrastrar** → orbitar · **rueda** → zoom (5–26 u.) · auto-orbit activable.
- **Click en el suelo** → camina hasta ahí · **WASD / flechas** → manejar (**shift** = correr).
- **Click sobre el gato** (raycast con `userData.tag` por pieza):
  - cabeza/collar → ronroneo + corazones + audio
  - lomo/cola → sobresalto y salto
  - patas → modo jugar
  - ovillo → lo bate
- **Audio 100 % sintetizado con WebAudio** (sin archivos): maullido = sierra + triángulo
  con `bandpass` barriendo 700 → 1750 → 620 Hz; ronroneo = ruido blanco con `lowpass`
  190 Hz modulado por un LFO de 26 Hz.

### Atajos

`1` sentado · `2` dormido · `3` jugar · `4` caminar (paseo) · `H` a casa · `M` miau ·
`P` acariciar · `S` asustar · `W` wireframe · `R` auto-orbit · `A` sonido · `C` reset cámara ·
`T` ciclar tema · **flechas / WASD (mantener)** manejar · **shift** correr

## Hooks de prueba

Siguiendo la convención de hooks globales de `src/script.js` (`__triggerRipple`, etc.):

```js
window.__cat3D.meow();            window.__cat3D.setPose('sleep');
window.__cat3D.pet();             window.__cat3D.setFur('siames');
window.__cat3D.startle();         window.__cat3D.setTheme('cyan');
window.__cat3D.toggleWireframe(); window.__cat3D.state;   // estado en vivo
// locomoción
window.__cat3D.goTo(3, -2);                       // camina hasta (x, z)
window.__cat3D.goTo(0, 0, { then: 'sit', heading: 0 });
window.__cat3D.goHome();                          // = lo anterior
window.__cat3D.drive({ fwd: true, run: true });   // teclas virtuales (fwd/back/left/right/run)
window.__cat3D.stop();                            // cancela navegación / paseo
window.__cat3D.groundY(x, z);                     // altura del terreno
window.__cat3D.walkDebug();                       // {speed, heading, phase, duty, steps, legs:[{swinging, reachErr, pawWorld…}]}
window.__catMeow / window.__catPet   // alias cortos
```

## Validación automatizada

```bash
node tests/prototype-cat3d-smoke.js                    # 23 checks
node tests/prototype-cat3d-render.js --pose walk --keys ArrowUp:400 --follow --out /tmp/cat.png
```

`tests/prototype-cat3d-harness.js` es el sandbox compartido (Node stdlib, sin dependencias):
ejecuta el `<script>` inline dentro de un `vm.createContext` con **DOM y WebGL stub** + el
`three.min.js` y `OrbitControls.js` reales del repo. El humo cubre:

- ensamblaje completo (>60 mallas, >3000 triángulos) y ausencia de `NaN`/`Inf` en toda la jerarquía;
- las 4 poses y sus transiciones; la silueta de `sit` es la misma que en v0.1 (altura de garras);
- las 3 acciones, los 6 pelajes y los 3 temas;
- **locomoción**: `goTo` llega y se orienta; la IK cierra (error < 1e-3); las garras apoyadas
  **no patinan** (< 0.03 u/frame) y las que vuelan se elevan; secuencia de paso lateral al andar
  y pares diagonales al correr; giro en el sitio; marcha atrás; límite de arena; `goHome`; reposo
  automático; paseo autónomo; `jugar` desde lejos; cancelación por pose estática; salto en marcha;
  teclado (flechas, WASD mantenida vs toque corto, shift, `repeat`); click en el suelo proyectado
  con la cámara real; seguimiento de cámara; `prefers-reduced-motion`;
- clicks de todos los botones, swatches y teclas; `resize`, `blur`, pausa por `visibilitychange`,
  y que no queden sprites FX huérfanos (fugas). ~6000 frames simulados.

`tests/prototype-cat3d-render.js` es un **rasterizador por software** (z-buffer, sombreado
toon/Lambert, sombra planar, PNG vía `zlib`) que renderiza la escena real del prototipo **sin GPU**
en una hoja de contactos, con marcadores de garras (verde = apoyada, magenta = en vuelo) y del
destino de navegación. Sirve para revisar la marcha visualmente en CI o desde un agente.

Detalle del harness: `three.min.js` es UMD, así que el sandbox expone
`exports`/`module`/`define` como `undefined` a propósito para que se cuelgue de `window`;
y el stub GL es un `Proxy` que devuelve no-ops, salvo `getParameter(VERSION)` que **debe**
devolver un string (`three` hace `R.indexOf('WebGL')`).

## Accesibilidad y rendimiento

- `prefers-reduced-motion` → toda la simulación corre al 25 % y el auto-orbit nace apagado.
- El loop se **pausa** con `document.visibilityState === 'hidden'`.
- `pixelRatio` acotado a 2; sombras `PCFSoft` con un solo `DirectionalLight` proyector.
- `toneMapping = ACESFilmic`, `outputEncoding = sRGBEncoding` (API de r128, no la de r152+).
- HUD con FPS, triángulos y draw calls en vivo.

## Restricciones por Three.js r128

El vendor del repo es **r128** (2021). Para no romper compatibilidad:

- ❌ nada de `CapsuleGeometry`, `ColorManagement`, `outputColorSpace`, `useLegacyLights`
- ✅ `outputEncoding`, `sRGBEncoding`, `THREE.LuminanceFormat`, `MeshToonMaterial` + `gradientMap`
- ⚠️ `Object3D.copy()` copia `userData` **por referencia**: nunca usar `.clone()` en mallas
  pickables (se sobrescribe el `tag` de la original). Se duplican a mano.

## Siguientes pasos posibles

1. **Integrarlo al portafolio** reemplazando el easter egg ASCII `#cat3DStage`
   (`initCat3D()` en `src/script.js:3660`) por este gato real en mini-canvas.
2. Exportar a GLB y cargar con `GLTFLoader` si se quiere un modelo más detallado.
3. ~~Añadir caminar/`lookAt` con IK en las patas.~~ ✅ v0.2 — pendiente: galope (4 tiempos con
   fase de suspensión), salto a la plataforma en vez de subir el bisel, y evitar el ovillo.
4. Piel con patrón generado por shader (rayas/Manchas procedurales en GLSL).
