# Project: Cyber-Industrial Interactive Background — Portafolio Alessandro Altamirano

## Architecture
El sistema de fondo interactivo Cyber-Industrial se estructura en una arquitectura multicapa de alto rendimiento y cero interferencias con la interfaz de usuario:
- **Capa 0 (Underlay - `#ripple-canvas`):** Renderizado procedural de gradientes aurorales fluidos dinámicos y rejilla cuántica (*quantum data grid*) con micro-cruces e interpolación de ondas de choque.
- **Capa 1 (Overlay - `#binary-canvas`):** Motor cinemático de partículas de operaciones en suspensión, vectores de velocidad con amortiguación elástica ante puntero/touch, ondas lumínicas expansivas (*shockwaves*) y micro-paralaje reactivo a scroll.
- **Capa 2 (Textura - `.noise`):** Grano fractal SVG sutil (`z-index: 1`) con viñeta perimetral para atmósfera industrial.
- **Capa 3 (Interfaz de Usuario - `.shell`):** Contenido interactivo principal (`z-index: 2` a `1000` y modales en *Top Layer*), aislado mediante `pointer-events: none` en las capas de fondo y listeners pasivos en `window`.

```
[Window Viewport]
  ├── z-index: 0: .liquid-bg-wrap (auroras base CSS)
  ├── z-index: 0: #ripple-canvas (auroras fluidas Canvas + quantum grid)
  ├── z-index: 0: #binary-canvas (partículas cinemáticas + shockwaves + micro-paralaje)
  ├── z-index: 1: .noise (textura táctil SVG)
  └── z-index: 2+: .shell (UI: Lanyard 3D, Terminal CLI, Calculadora ROI, STAR Modales, i18n)
```

## Feature Inventory
| # | Feature | Description | Milestone | Source | Status |
|---|---------|-------------|-----------|--------|--------|
| 1 | F-VIS-01 | Entorno visual Cyber-Industrial multicapa (auroras fluidas, rejilla cuántica, partículas) | M1 | ORIGINAL_REQUEST §R1 | DONE |
| 2 | F-VIS-02 | Compatibilidad multi-tema (Verde Neón, Cyan Neón, Ámbar) con LERP suave cromático | M1 | ORIGINAL_REQUEST §R1 | DONE |
| 3 | F-VIS-03 | Ratio de contraste óptimo y legibilidad WCAG AA+ sobre UI y tarjetas STAR | M1 | ORIGINAL_REQUEST §R1 | DONE |
| 4 | F-KIN-01 | Físicas de repulsión cinemática y dispersión suave ante puntero/cursor táctil | M2 | ORIGINAL_REQUEST §R2 | DONE |
| 5 | F-KIN-02 | Ondas de choque lumínicas expansivas (shockwaves/ripples) en clic y touch | M2 | ORIGINAL_REQUEST §R2 | DONE |
| 6 | F-KIN-03 | Micro-paralaje suave reactivo al scroll vertical | M2 | ORIGINAL_REQUEST §R2 | DONE |
| 7 | F-KIN-04 | Modo autónomo de respiración lumínica tras 5 segundos de inactividad (idle) | M2 | ORIGINAL_REQUEST §R2 | DONE |
| 8 | F-PERF-01 | Render loop a 60 FPS estables con delta-time y sin fugas de memoria | M3 | ORIGINAL_REQUEST §R3 | DONE |
| 9 | F-PERF-02 | Pausa inmediata del render loop en pestañas inactivas (`document.visibilityState === 'hidden'`) | M3 | ORIGINAL_REQUEST §R3 | DONE |
| 10 | F-PERF-03 | Soporte para accesibilidad `prefers-reduced-motion: reduce` (desaceleración al 15%) | M3 | ORIGINAL_REQUEST §R3 | DONE |
| 11 | F-PERF-04 | No-interferencia y compatibilidad con Lanyard 3D, Terminal CLI, Calculadora ROI, i18n | M3 | ORIGINAL_REQUEST §R3 | DONE |
| 12 | F-E2E-01 | Suite completa E2E automatizada en 4 Tiers con 100% pass + Tier 5 adversarial | M4 | ORIGINAL_REQUEST §Acceptance | DONE |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Visual Architecture & Multi-Theme System | Capas Canvas underlay/overlay, shaders/gradientes aurorales, rejilla cuántica y LERP cromático para Verde, Cyan y Ámbar | none | DONE |
| M2 | Kinematic Physics & Interaction Engine | Repulsión y elasticidad de partículas, shockwaves lumínicas en clic, micro-paralaje en scroll y respiración en reposo tras 5s | M1 | DONE |
| M3 | Performance, Accessibility & Interop | Normalización delta-time para 60 FPS, listeners de visibilidad (`visibilitychange`), `prefers-reduced-motion` y verificación de no-bloqueo con UI | M2 | DONE |
| M4 | E2E Testing Suite (Tiers 1-4) & Adversarial Coverage (Tier 5) | Verificación integral contra suite de pruebas E2E en Node.js (103/103 pass), auditoría forense de integridad (CLEAN), aprobación unánime de revisores y challengers | M3 | DONE |

## Interface Contracts

### Background Engine ↔ CSS Theme System
- `document.body.dataset.theme`: `""` (Verde, RGB `[201, 255, 98]`), `"cyan"` (Cyan, RGB `[123, 238, 255]`), `"amber"` (Ámbar, RGB `[255, 206, 100]`).
- MutationObserver observa `attributes` con `attributeFilter: ['data-theme']`.
- Interpolación de color: `currentRGB.r += (targetRGB.r - currentRGB.r) * 0.08` por frame.

### Background Engine ↔ UI Layer
- Canvas elements (`#ripple-canvas`, `#binary-canvas`) mantienen `pointer-events: none; position: fixed; inset: 0; z-index: 0;`.
- Global Event Listeners en `window`: `{ passive: true }` en `pointermove`, `pointerdown`, `scroll`, `keydown`.
- Global Test Hooks expuestos en `window`:
  - `window.__triggerRipple(x, y, intensity)`: Dispara shockwave programática en coordenadas dadas.
  - `window.__boostBinaryMatrix()`: Acelera partículas temporalmente.
  - `window.__replayPreloader()`: Reinicia preloader 3D.

### Code Layout
- `index.html`: Estructura HTML modular con capas de fondo, preloader, lanyard, terminal y modales.
- `styles.css`: Estilos del portafolio, variables CSS de temas, clases del preloader, terminal, lanyard y canvas.
- `script.js`: Lógica interactiva modular (i18n, CLI terminal, ROI calculator, Lanyard 3D, Background Engine).
- `portfolio-mejorado.html`: Versión empaquetada monolítica generada automáticamente por `tests/build-dist.js`.
- `tests/run-e2e-tests.js`: Suite automatizada E2E con 4 Tiers de validación y aserciones completas (103/103 tests pass).
- `tests/build-dist.js`: Script de empaquetado para mantener sincronizado `portfolio-mejorado.html`.


# E2E Test Infra: Cyber-Industrial Interactive Background

## Test Philosophy
- Opaque-box, requirement-driven y orientado a la integridad técnica total.
- Metodología en 4 Tiers sistemáticos (Categorización/Partición, Valores Límite, Combinatoria Pairwise y Escenarios del Mundo Real) + Tier 5 de endurecimiento adversarial.
- Verificación automatizada sin dependencias de red externa mediante emulación virtualizada del DOM en Node.js (`vm.runInContext`) y comprobación cruzada entre `index.html` y `portfolio-mejorado.html`.

## Feature Inventory
| # | Feature | Source (requirement) | Tier 1 | Tier 2 | Tier 3 | Tier 4 |
|---|---------|---------------------|:------:|:------:|:------:|:------:|
| 1 | F-VIS-01: Multicapa Cyber-Industrial | ORIGINAL_REQUEST §R1 | ≥5 | ≥5 | ✓ | ✓ |
| 2 | F-VIS-02: Sistema Multi-Tema (Verde/Cyan/Ámbar) | ORIGINAL_REQUEST §R1 | ≥5 | ≥5 | ✓ | ✓ |
| 3 | F-VIS-03: Contraste y Legibilidad WCAG AA+ | ORIGINAL_REQUEST §R1 | ≥5 | ≥5 | ✓ | ✓ |
| 4 | F-KIN-01: Físicas de Repulsión Cursor/Touch | ORIGINAL_REQUEST §R2 | ≥5 | ≥5 | ✓ | ✓ |
| 5 | F-KIN-02: Shockwaves Lumínicas en Clic/Tap | ORIGINAL_REQUEST §R2 | ≥5 | ≥5 | ✓ | ✓ |
| 6 | F-KIN-03: Micro-Paralaje Reactivo en Scroll | ORIGINAL_REQUEST §R2 | ≥5 | ≥5 | ✓ | ✓ |
| 7 | F-KIN-04: Modo Respiración Autónoma (Idle >5s) | ORIGINAL_REQUEST §R2 | ≥5 | ≥5 | ✓ | ✓ |
| 8 | F-PERF-01: 60 FPS Delta-Time & Sin Fugas | ORIGINAL_REQUEST §R3 | ≥5 | ≥5 | ✓ | ✓ |
| 9 | F-PERF-02: Pausa en VisibilityState Hidden | ORIGINAL_REQUEST §R3 | ≥5 | ≥5 | ✓ | ✓ |
| 10 | F-PERF-03: Soporte Prefers-Reduced-Motion | ORIGINAL_REQUEST §R3 | ≥5 | ≥5 | ✓ | ✓ |
| 11 | F-PERF-04: No-Interferencia con Componentes UI | ORIGINAL_REQUEST §R3 | ≥5 | ≥5 | ✓ | ✓ |
| 12 | F-E2E-01: Cobertura E2E & Consistencia Dual File | ORIGINAL_REQUEST §AC | ≥5 | ≥5 | ✓ | ✓ |

## Test Architecture
- **Test Runner**: `node tests/run-e2e-tests.js`
- **Build Sync Tool**: `node tests/build-dist.js`
- **Pass/Fail Semantics**: Exit code 0 on all tests passing, non-zero on assertion error.
- **Test Case Structure**:
  - Tier 1: Tests estructurales, selectores DOM, existencia de canvas, atributos semánticos, tokens CSS.
  - Tier 2: Tests de valores límite, redimensionamiento de pantalla (mobile vs desktop), límites de ondas y partículas, umbral de inactividad de 5.0s, delta-time clamping.
  - Tier 3: Pruebas combinatorias (cambio de tema + disparo de shockwave + ejecución de comandos CLI + conmutación de idioma i18n).
  - Tier 4: Escenarios de usuario real (flujo completo de navegación, apertura de modales STAR, arrastre del lanyard 3D, simulación de ROI, cambio de tema continuo).
  - Tier 5: Análisis adversarial de rutas no cubiertas y casos extremos.

## Real-World Application Scenarios (Tier 4)
| # | Scenario | Features Exercised | Complexity |
|---|----------|--------------------|------------|
| 1 | Navegación completa con cambio dinámico de tema y shockwaves | F-VIS-01, F-VIS-02, F-KIN-02, F-PERF-04 | High |
| 2 | Sesión prolongada con inactividad (respiración) y reactivación inmediata | F-KIN-04, F-PERF-01, F-KIN-01 | High |
| 3 | Scroll vertical intenso con micro-paralaje y operación de Lanyard 3D | F-KIN-03, F-PERF-01, F-PERF-04 | Medium |
| 4 | Cambio de pestaña (minimizar/ocultar) con pausa y reanudación limpia de RAF | F-PERF-02, F-PERF-01 | Medium |
| 5 | Accesibilidad reducida (`prefers-reduced-motion`) con interacción completa | F-PERF-03, F-VIS-02, F-PERF-04 | Medium |

## Coverage Thresholds
- Tier 1: ≥5 por feature (Total ≥ 60)
- Tier 2: ≥5 por feature (Total ≥ 60)
- Tier 3: Cobertura pairwise de interacciones entre temas, CLI, lanyard y fondo
- Tier 4: ≥5 escenarios realistas de aplicación
- Total: 100% de aserciones aprobadas sin excepciones

