# AGENTS.md — Portafolio Alessandro Altamirano

## Project Overview

Static, dependency-free portfolio website (vanilla HTML/CSS/JS). No `package.json`, no npm install, no framework, not a git repository. Deployable to any static host (GitHub Pages, Vercel, Netlify, Nginx). All test/build tooling uses Node.js stdlib only (`fs`, `path`, `vm`, `assert`, `http`).

- `index.html` — production entry point (source of truth, modular).
- `script.js` (~173KB) — all logic: i18n dictionary `T` (top of file), CLI terminal engine (`runCommand`), theme switcher, modals (STAR cases, CV, terms), ROI simulator, lanyard 3D, background engine.
- `styles.css` — themes via CSS custom properties, responsive layout.
- `assets/`, `favicon.svg`, `CV_Alessandro_Altamirano_Salazar_2026.pdf` — static media.
- `tests/` — Node.js E2E suite, dist builder, static server.
- `docs/` — README.md (architecture and testing documentation).

## Commands

```bash
node tests/build-dist.js              # Regenerate portfolio-mejorado.html (REQUIRED before e2e tests)
node tests/run-e2e-tests.js           # E2E suite: 103 tests, DOM emulated via vm.runInContext, no network
node tests/adversarial-stress-tests.js # Tier 5 adversarial/stress suite
node tests/server.js                  # Local preview at http://localhost:3000
```

There is no lint or typecheck; `node tests/run-e2e-tests.js` is the only automated validation (exit 0 = all pass).

## Architecture Rules

- **Layering**: background layers (`.cyber-aurora-mesh` CSS blobs, `#cyber-canvas`, `.noise`) are `position: fixed`, `pointer-events: none`, z-index 0–1. All interactive UI lives in `.shell` (z-index 2+). Never let background code attach blocking listeners or intercept pointer events on UI.
- **Themes**: `document.body.dataset.theme` — `""` = green (default), `"cyan"`, `"amber"`. A `MutationObserver` on `data-theme` drives runtime color updates in JS (`updateThemeColors()`); palettes live in CSS variables. Add new theme colors in both places.
- **i18n**: Spanish is the default (`<html lang="es">`). All user-facing strings go in the `T` dictionary (`es`/`en`) at the top of `script.js`; `translate()` applies them. Do not hardcode visible text.
- **Dual-file parity**: `portfolio-mejorado.html` is a generated single-file bundle (built by `tests/build-dist.js` from index.html + script.js + styles.css). Never edit it by hand — edit the modular files and rebuild.
- **Test hooks**: exposed on `window` for the suite — `__triggerRipple(x, y, intensity)`, `__boostBinaryMatrix()`, `__replayPreloader()`. Preserve them when refactoring the background engine.

## Known Gotchas

- **Tests crash without the dist file**: `run-e2e-tests.js` reads `portfolio-mejorado.html` directly and throws ENOENT if absent. Always run `node tests/build-dist.js` first. The file is a build artifact (safe to delete/regenerate).
- **Current test state (Aug 2026): 96/103 pass, 7 fail, exit code 1.** The 7 failures are `Cannot read properties of null (reading 'getContext')`: the old dual-canvas background (`#ripple-canvas` + `#binary-canvas`) was replaced by a single `#cyber-canvas` + CSS aurora mesh, but tests, `docs/PROJECT.md`, `docs/TEST_INFRA.md`, and parts of `README.md` still describe the old architecture. Fixing the tests means updating canvas lookups (tests/run-e2e-tests.js ~lines 1756, 1776) — or treat those 7 as known-drift failures.
- README's "Estructura del Proyecto" mentions `legacy/` and lists files that no longer exist; trust the filesystem over the README.
- External links must keep `rel="noreferrer"` with `target="_blank"`; single `<h1>` per page (SEO/accessibility invariants checked by tests).

## Docs to Read Before Sensitive Changes

- `docs/README.md` — layer architecture, feature inventory, interface contracts (theme ↔ engine, engine ↔ UI), and test tier methodology (Tiers 1–5). Read before touching the background engine, theme system, or adding/modifying tests.
