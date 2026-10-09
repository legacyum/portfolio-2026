# AGENTS.md — Portafolio Alessandro Altamirano

Static, dependency-free portfolio (vanilla HTML/CSS/JS). No `package.json`, no npm install, no framework. Git repo on branch `main`. All tooling uses Node.js stdlib only (`fs`, `path`, `vm`, `assert`, `http`). Deploy target is Vercel with `outputDirectory: src` (`vercel.json`); mirrored security headers live in `src/_headers` — keep both in sync.

- `src/index.html` — production entry point, source of truth (modular).
- `src/script.js` — all logic: i18n dictionary `T` (top of file), CLI engine (`runCommand`), theme switcher, STAR/CV/terms modals, ROI simulator, lanyard 3D, background engine, cat controller.
- `src/cat3d-mini.js` — procedural 3D cat widget (Three.js + ASCII fallback).
- `src/styles.css` — themes via CSS custom properties, responsive layout.
- `src/vendor/` — Three.js, OrbitControls, asciify, cosmos, crt engines (loaded via `<script src>` in src, inlined on build).
- `dist/portfolio-mejorado.html` — generated single-file bundle. Never edit by hand.
- `tests/` — `build-dist.js`, `run-e2e-tests.js` (110 tests, Tiers 1–4), `adversarial-stress-tests.js` (16 tests, Tier 5), `server.js`, `server-security-tests.js`.
- `docs/` — `README.md` (background/test architecture), `PROJECT.md` (cat + canvas milestones, hook contracts).

## Commands

```bash
node tests/build-dist.js                # Regenerate dist (REQUIRED before e2e/adversarial runs)
node tests/run-e2e-tests.js             # E2E suite: 110 tests, DOM via vm.runInContext, no network
node tests/adversarial-stress-tests.js  # Tier 5 stress suite: 16 tests
node tests/server-security-tests.js     # Preview-server security checks (spawns tests/server.js)
node tests/server.js                    # Local preview (PORT/HOST env, defaults 3000/0.0.0.0)
```

No lint or typecheck; the three test scripts are the validation (exit 0 = pass). Verified: 110/110 E2E + 16/16 adversarial green.

## Architecture rules

- **Layering** (trust `src/index.html`, not `docs/README.md` — its `#ripple-canvas`/`#binary-canvas` names are stale): `.cyber-bg-wrap` > `.cyber-aurora-mesh` + single unified `#cyber-canvas` (z-index 0), `.noise` (z-index 1), interactive UI in `.shell` (`main#content`, z-index 2+, modals higher). Background stays `pointer-events: none` with `{ passive: true }` window listeners; never let it intercept UI events.
- **Themes**: `document.body.dataset.theme` — `""` = green (default `#c9ff62`), `"cyan"` (`#7beeff`), `"amber"` (`#ffce64`). A `MutationObserver` on `data-theme` drives JS color LERP (`0.08`/frame); palettes live in CSS variables. Update both places.
- **i18n**: Spanish default (`<html lang="es">`). User-facing strings go in `T` (`es`/`en`) at top of `script.js`, applied via `translate()`. Don't hardcode visible text.
- **Dual-file parity**: `run-e2e-tests.js` reads `dist/portfolio-mejorado.html` and throws if absent — always rebuild first. Tier 4 test `T4-SCN-04` cross-checks `src/index.html` vs the bundle.
- **Build-markers are load-bearing**: `build-dist.js` inlines vendor scripts with `data-vendor` / `data-canvasui-asciify` attributes so the app script stays the FIRST plain `<script>` (the e2e harness executes it). Don't change the inlining scheme without updating the harness.
- **Test hooks** (preserve when refactoring): `__triggerRipple(x, y, intensity)` (shockwave queue clamped ≤ 6), `__boostCyberMatrix()` (canonical; `__boostBinaryMatrix` is an alias), `__replayPreloader()`; cat suite `__catMini`, `__summonCat`/`__hideCat`, `__petCat`, `__sleepCat`/`__wakeUpCat`, roam/fur/mode setters.
- **Preview server**: resolves `src/` → `dist/` → root, serves `src/404.html` on miss with path-traversal guards. `PORT`/`HOST` env supported.
- **Test invariants**: single `<h1>`; every `target="_blank"` link keeps `rel="noreferrer"`; physics clamps (`dt <= 2.5`, idle breathing > 5.5s, reduced-motion at 15%).

## Read before sensitive changes

- `docs/README.md` — engine↔theme↔UI contracts, tier methodology. `docs/PROJECT.md` — cat subsystem hooks and canvas physics constants.

<!-- gitnexus:start -->
# GitNexus — Code Intelligence

This project is indexed by GitNexus as **portfolio-2026** (706 symbols, 2215 relationships, 51 execution flows).

> Index stale? Run `node .gitnexus/run.cjs analyze --index-only` from the project root — it auto-selects an available runner. No `.gitnexus/run.cjs` yet? Bootstrap with `npx`, `bunx`, or `pnpm dlx` — e.g. `bunx gitnexus@latest analyze` (npm 11 npx crash; #1939).

## Always Do

- **MUST run impact analysis before editing.** Use `impact({target: "symbolName", direction: "upstream"})` (MCP) or `node .gitnexus/run.cjs impact "symbolName" --direction upstream --repo .` (CLI fallback); report callers, processes, and risk. Never substitute grep for graph analysis.
- **MUST analyze graph changes before committing.** Use `detect_changes({scope: "all"})` (MCP) or `node .gitnexus/run.cjs detect-changes --scope all --repo .` (CLI fallback). `partial: true` or `truncated: true` is not a clean check — a zero means unseen, not unaffected; re-run it. For regression review: `detect_changes({scope: "compare", base_ref: "main"})` or `node .gitnexus/run.cjs detect-changes --scope compare --base-ref "main" --repo .`.
- **MUST warn the user** if impact analysis returns HIGH or CRITICAL risk before proceeding with edits.
- **MUST treat `risk: UNKNOWN` as unresolved, not as low.** An empty caller set is not evidence the symbol is unused — it can also mean the callers are not resolvable by the index (plain-object property access, dynamic dispatch, cross-language calls). `impact` pairs `UNKNOWN` with a `riskNote` saying so. Confirm with a text search before treating the symbol as safe to change or delete; do not proceed on the strength of a zero.
- When exploring unfamiliar code, use `query({search_query: "concept"})` to find execution flows instead of grepping. It returns process-grouped results ranked by relevance.
- When you need full context on a specific symbol — callers, callees, which execution flows it participates in — use `context({name: "symbolName"})`.
- For security review, `explain({target: "fileOrSymbol"})` lists taint findings (source→sink flows; needs `analyze --pdg`).

## Never Do

- NEVER edit a function, class, or method before MCP/CLI impact analysis.
- NEVER ignore HIGH or CRITICAL risk warnings from impact analysis, and never read `UNKNOWN` as an all-clear — it means the walk could not answer, which is the one verdict that requires confirming by other means.
- NEVER rename symbols with find-and-replace — use `rename` which understands the call graph.
- NEVER commit before MCP/CLI graph change analysis.

## Resources

| Resource | Use for |
| --- | --- |
| `gitnexus://repo/portfolio-2026/context` | Codebase overview, check index freshness |
| `gitnexus://repo/portfolio-2026/clusters` | All functional areas |
| `gitnexus://repo/portfolio-2026/processes` | All execution flows |
| `gitnexus://repo/portfolio-2026/process/{name}` | Step-by-step execution trace |

## CLI

| Task | Read this skill file |
| --- | --- |
| Understand architecture / "How does X work?" | `.claude/skills/gitnexus-exploring/SKILL.md` |
| Blast radius / "What breaks if I change X?" | `.claude/skills/gitnexus-impact-analysis/SKILL.md` |
| Trace bugs / "Why is X failing?" | `.claude/skills/gitnexus-debugging/SKILL.md` |
| Rename / extract / split / refactor | `.claude/skills/gitnexus-refactoring/SKILL.md` |
| Tools, resources, schema reference | `.claude/skills/gitnexus-guide/SKILL.md` |
| Index, status, clean, wiki CLI commands | `.claude/skills/gitnexus-cli/SKILL.md` |

<!-- gitnexus:end -->
