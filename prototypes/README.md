# Proto-lab · Gato 3D low-poly procedural

> **Estado: prototipo experimental (`v0.1.0-prototype`)** — no forma parte del sitio publicado.
> `prototypes/` no es leído por `tests/build-dist.js` ni por `tests/run-e2e-tests.js`,
> así que este archivo no afecta el bundle `dist/` ni los 103 tests E2E.

## Qué es

Un gato 3D **100 % procedural**: toda la geometría se construye en código con primitivas
de Three.js (esferas, conos, cilindros, toros). No hay ningún `.glb`/`.gltf` externo,
ni texturas descargadas, ni dependencias nuevas. Reutiliza el vendor que ya existe en
el repo (`src/vendor/three.min.js` **r128** + `src/vendor/OrbitControls.js`).

- **74 mallas · ~25 300 triángulos** en escena.
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
| Patas | jerarquía `Group` (cadera → fémur → garra) para rotar desde la articulación |
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
| Seguimiento de mirada | la cabeza apunta al `Raycaster` sobre un plano, clampeado a ±0.42 rad; durante `play` sigue el ovillo |
| Tics de oreja | cada 4–11 s |
| Cola | onda viajera; velocidad y amplitud cambian por pose (1.5 sentado → 5.2 jugando) |
| Dormir | se enrosca, suelta sprites `Z` cada 1.35 s |
| Jugar | secuencia en bucle con anticipación, desplazamiento hacia el ovillo, pisada alternada con solver procedural tipo IK, mini-salto, zarpazos alternados, mirada que sigue el ovillo y golpe sincronizado con física simple (gravedad, rebote 0.44, fricción y retorno elástico a su sitio); cada impacto emite una nota y un destello |
| Sobresalto | salto parabólico, lomo arqueado, **cola erizada** (`tailPuff` +0.85), orejas hacia atrás, pupilas dilatadas |

## Interacción

- **Arrastrar** → orbitar · **rueda** → zoom (5–26 u.) · auto-orbit activable.
- **Click sobre el gato** (raycast con `userData.tag` por pieza):
  - cabeza/collar → ronroneo + corazones + audio
  - lomo/cola → sobresalto y salto
  - patas → modo jugar y persecución del ovillo
  - ovillo → lo bate y activa el desplazamiento del gato
- **Audio 100 % sintetizado con WebAudio** (sin archivos): maullido = sierra + triángulo
  con `bandpass` barriendo 700 → 1750 → 620 Hz; ronroneo = ruido blanco con `lowpass`
  190 Hz modulado por un LFO de 26 Hz.

### Atajos

`1` sentado · `2` dormido · `3` jugar · `M` miau · `P` acariciar · `S` asustar ·
`W` wireframe · `R` auto-orbit · `A` sonido · `C` reset cámara · `T` ciclar tema

## Hooks de prueba

Siguiendo la convención de hooks globales de `src/script.js` (`__triggerRipple`, etc.):

```js
window.__cat3D.meow();            window.__cat3D.setPose('sleep');
window.__cat3D.pet();             window.__cat3D.setFur('siames');
window.__cat3D.startle();         window.__cat3D.setTheme('cyan');
window.__cat3D.toggleWireframe(); window.__cat3D.state;   // estado en vivo
window.__catMeow / window.__catPet   // alias cortos
```

## Validación automatizada

```bash
node tests/prototype-cat3d-smoke.js
```

Harness propio (Node stdlib, sin dependencias): ejecuta el `<script>` inline dentro de un
`vm.createContext` con **DOM y WebGL stub** + el `three.min.js` real del repo. Cubre:

- ensamblaje completo (>60 mallas, >3000 triángulos) y ausencia de `NaN`/`Inf` en toda la jerarquía;
- las 3 poses y sus transiciones, ~600 frames simulados;
- las 3 acciones, los 6 pelajes y los 3 temas;
- clicks de todos los botones, swatches y teclas;
- `resize`, pausa por `visibilitychange`, y que no queden sprites FX huérfanos (fugas).

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
2. Añadir juguetes alternativos, contador de combos y una pequeña meta de juego.
3. Exportar a GLB y cargar con `GLTFLoader` si se quiere un modelo más detallado.
4. Piel con patrón generado por shader (rayas/manchas procedurales en GLSL).
