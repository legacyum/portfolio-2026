# Project: Portafolio Alessandro Altamirano — Mejoras Canvas y Compañero Gato 3D

## Architecture
- **Vanilla Web Stack**: HTML5, CSS3, ES6+ JavaScript sin empaquetadores externos ni frameworks npm.
- **Layering Model**:
  - Capa 0: `.cyber-bg-wrap` (auroras CSS) + `#cyber-canvas` (motor cinemático 2D unificado para rejilla cuántica, partículas y shockwaves). `pointer-events: none; z-index: 0;`
  - Capa 1: `.noise` (textura táctil SVG). `pointer-events: none; z-index: 1;`
  - Capa 2+: `.shell` (interfaz de usuario interactiva: terminal CLI, modales, snapshot reclutador, simulador ROI, lanyard 3D). `z-index: 2` a `1000`.
  - Capa Gato 3D: `#cat3DStage` dentro de `.crt-glass-screen`, con canvas `#cat3DCanvas` y fallback `#cat3DFallback`.
- **Theme Engine**: Basado en `document.body.dataset.theme` ("" verde, "cyan", "amber") coordinado mediante `MutationObserver` y LERP suave.
- **Dual-file Parity**: `src/` modular es la fuente de verdad. `dist/portfolio-mejorado.html` se compila mediante `node tests/build-dist.js`.

## Code Layout
- `src/index.html`: Estructura HTML5 modular (Hero, Terminal, Recruiter, Lanyard, Modales, Canvas, Cat3D).
- `src/styles.css`: Hojas de estilo y variables CSS para temas.
- `src/script.js`: Lógica unificada (i18n diccionario `T`, CLI, Theme Switcher, Lanyard 3D, Background Engine `#cyber-canvas`, Controlador Gato `#cat3DStage`).
- `src/cat3d-mini.js`: Widget procedural Three.js del gato 3D, Web Audio API y shader ASCII.
- `dist/portfolio-mejorado.html`: Bundle monolítico generado por `tests/build-dist.js`.
- `tests/run-e2e-tests.js`: Suite principal de pruebas E2E (110 tests automáticos ejecutados y pasando).
- `tests/prototype-cat3d-smoke.js`: Suite de 27 verificaciones cinemáticas y anatómicas del gato 3D.
- `tests/adversarial-stress-tests.js`: Suite de 16 pruebas adversariales (Tier 5).

## Feature Inventory
| # | Feature | Description | Milestone | Source | Status |
|---|---------|-------------|-----------|--------|--------|
| 1 | Constelaciones dinámicas inter-partícula | Ampliación de enlaces cuadráticos entre partículas (radio 80/108px) | M1 | ORIGINAL_REQUEST §R1 | DONE |
| 2 | Constelaciones dinámicas al cursor | Conexiones tenues proyectadas desde el cursor hacia partículas cercanas (radio 155px, alpha <= 0.35) | M1 | ORIGINAL_REQUEST §R1 | DONE |
| 3 | Deformación elástica de rejilla cuántica | Perturbación gravitatoria radial sutil de nodos ante cursor (desplazamiento <= 11.5px) y ondas de choque | M1 | ORIGINAL_REQUEST §R1 | DONE |
| 4 | Adaptación cromática LERP de Canvas | Interpolación suave de colores en constelaciones, cruces y rejilla para Verde, Cyan y Ámbar | M1 | ORIGINAL_REQUEST §R1 | DONE |
| 5 | Aislamiento estricto de eventos Canvas | `#cyber-canvas` con `pointer-events: none` y listeners `{ passive: true }`, sin bloqueo a `.shell` | M1 | ORIGINAL_REQUEST §R1 | DONE |
| 6 | Invariantes de rendimiento de Canvas | 60 FPS estables, delta-time clamp $dt \le 2.5$, pausa en tab oculto y reducción al 15% con `prefers-reduced-motion` | M1 | ORIGINAL_REQUEST §R1 | DONE |
| 7 | Suavizado cinemático de mirada del gato | Gaze tracking con amortiguación exponencial $1 - e^{-8.5 \cdot dt}$, micro-movimiento de pupilas y timeout idle 2.2s | M2 | ORIGINAL_REQUEST §R2 | DONE |
| 8 | Expresiones y ronroneo táctil del gato | Micro-vibración del cuerpo a ~48Hz durante caricias, Web Audio purr y emisión de partículas ASCII de corazones | M2 | ORIGINAL_REQUEST §R2 | DONE |
| 9 | Paseo orgánico entre tarjetas y viewport | Normalización de coordenadas relativas a `.crt-glass-screen`, aceleración ease-in-out, arco parabólico y evasión de controles | M2 | ORIGINAL_REQUEST §R2 | DONE |
| 10 | Adaptación cromática multi-tema del gato | Sincronización LERP de luces, aro de pedestal y corrección de `asciiUniforms.bg` para fondo ámbar (#0c0803) | M2 | ORIGINAL_REQUEST §R2 | DONE |
| 11 | Fallback ASCII robusto e interactivo | Máquina de estados ASCII multi-pose (sit, pet, sleep, walk), audio desacoplado y captura de `webglcontextlost` | M2 | ORIGINAL_REQUEST §R2 | DONE |
| 12 | Integridad arquitectónica vanilla | HTML5/CSS3/JS ES6+ sin dependencias npm, frameworks ni compiladores | M3 | ORIGINAL_REQUEST §R3 | DONE |
| 13 | Sincronización y paridad en dist/ | Ejecución de `node tests/build-dist.js` manteniendo a `script.js` como único script sin atributos | M3 | ORIGINAL_REQUEST §R3 | DONE |
| 14 | Cero regresiones en suite E2E (103 tests) | Pase del 100% de los 103 tests existentes en `tests/run-e2e-tests.js` | M3 | ORIGINAL_REQUEST §R4 | DONE |
| 15 | Invarianza en smoke tests del gato (27 checks) | Mantener verdes los 27 tests de `tests/prototype-cat3d-smoke.js` | M3 | ORIGINAL_REQUEST §R4 | DONE |
| 16 | Extensión de tests para nuevas capacidades | Adición de 7 nuevos tests automáticos en `tests/run-e2e-tests.js` (110 tests totales) para R1 y R2 | M3 | ORIGINAL_REQUEST §R4 | DONE |
| 17 | Validación adversarial (16 checks) | Verificación exitosa en `tests/adversarial-stress-tests.js` | M3 | AGENTS.md | DONE |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Canvas & Background Engine (R1) | Enriquecimiento de `#cyber-canvas` en `src/script.js` y `src/styles.css`: constelaciones al cursor y entre partículas, rejilla cuántica elástica/gravitatoria, LERP cromático multi-tema, clamping dt <= 2.5 y aislamiento estricto de eventos. | none | DONE |
| M2 | Compañero Gato 3D Procedural (R2) | Optimización en `src/cat3d-mini.js` y `src/script.js`: mirada cinemática suavizada, timeout idle, expresiones y ronroneo táctil, paseo relativo entre tarjetas sin solapar controles, corrección cromática del shader ASCII y fallback interactivo. | none | DONE |
| M3 | Build Parity, E2E Suite & Verification (R3/R4) | Sincronización de `dist/portfolio-mejorado.html` vía `tests/build-dist.js`, pase del 100% de tests E2E expandidos a 110 tests, validación de 27 smoke tests del gato y 16 pruebas adversariales. Puerta aprobada por revisores y auditoría forense CLEAN. | M1, M2 | DONE |

## Interface Contracts
### Theme Switcher ↔ Canvas & Cat3D
- Evento/Observador: `MutationObserver` en `document.body` sobre `data-theme`.
- Valores: `""` (Verde Neón `#c9ff62`), `"cyan"` (Cyan Neón `#7beeff`), `"amber"` (Ámbar `#ffce64`).
- Canvas: Transición LERP con tasa 0.08 por frame en `currentColor` (rgb primario, secundario, crossAlpha, gridAlpha).
- Cat3D: Transición LERP en `rim.color`, `fill.color`, `daisRingMat.color`, `asciiUniforms.accent` y `asciiUniforms.bg`.

### Window Test Hooks
- Canvas:
  - `window.__triggerRipple(x, y, intensity)`: Dispara onda expansiva con clamping de cola (<= 6).
  - `window.__boostBinaryMatrix()` / `window.__boostCyberMatrix()`: Acelera temporalmente la rejilla cuántica.
  - `window.__replayPreloader()`: Reinicia la animación del preloader.
- Cat3D:
  - `window.__catMini`: Referencia a la instancia montada.
  - `window.__summonCat()`, `window.__hideCat()`: Toggle visibilidad.
  - `window.__startCatRoam()`, `window.__stopCatRoam()`, `window.__isCatRoaming()`: Control de paseo.
  - `window.__petCat()`, `window.__sleepCat()`, `window.__wakeUpCat()`: Interacciones de estado.
  - `window.__setCatFur(fur)`, `window.__setCatMode(mode)`: Configuración estética.
