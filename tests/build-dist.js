const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const SRC_DIR = path.join(ROOT_DIR, 'src');
const DIST_DIR = path.join(ROOT_DIR, 'dist');

if (!fs.existsSync(DIST_DIR)) {
  fs.mkdirSync(DIST_DIR, { recursive: true });
}

const indexHtml = fs.readFileSync(path.join(SRC_DIR, 'index.html'), 'utf8');
const stylesCss = fs.readFileSync(path.join(SRC_DIR, 'styles.css'), 'utf8');
const scriptJs = fs.readFileSync(path.join(SRC_DIR, 'script.js'), 'utf8');
const cat3dMiniJs = fs.readFileSync(path.join(SRC_DIR, 'cat3d-mini.js'), 'utf8');
const asciifyJs = fs.readFileSync(path.join(SRC_DIR, 'vendor', 'asciify-vanilla.js'), 'utf8');

let distHtml = indexHtml;

// Replace styles.css link with inline <style>
distHtml = distHtml.replace(
  /<link rel="stylesheet" href="styles\.css"\s*\/?>/i,
  () => `<style>\n${stylesCss}\n  </style>`
);
// Inline vendor glyph.css (glyphcat) if present — after main styles
try {
  const glyphCss = fs.readFileSync(path.join(SRC_DIR, 'vendor', 'glyph.css'), 'utf8');
  distHtml = distHtml.replace(
    /<link rel="stylesheet" href="vendor\/glyph\.css"\s*\/?>/i,
    () => `<style data-vendor="glyph">\n${glyphCss}\n  </style>`
  );
} catch (e) { /* glyph.css optional */ }

// Inline vendor scripts with data-vendor marker so they are NOT picked as the
// first plain <script> (E2E harness executes the first plain script as the app).
function inlineVendor(relPath, dataAttr) {
  try {
    const content = fs.readFileSync(path.join(SRC_DIR, relPath), 'utf8');
    const escaped = relPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(`<script src="${escaped}"[^>]*><\\/script>`, 'i');
    distHtml = distHtml.replace(re, () => `<script ${dataAttr}>\n${content}\n  </script>`);
  } catch (e) {
    console.warn(`Warning: could not inline ${relPath}: ${e.message}`);
  }
}

inlineVendor('vendor/three.min.js', 'data-vendor="three"');
inlineVendor('vendor/OrbitControls.js', 'data-vendor="orbit-controls"');
inlineVendor('vendor/cosmos-engine.js', 'data-vendor="cosmos"');

// Inline the lightweight procedural cat before script.js initializes its Easter egg.
distHtml = distHtml.replace(
  /<script src="cat3d-mini\.js"[^>]*><\/script>/i,
  () => `<script data-vendor="cat3d-mini">\n${cat3dMiniJs}\n  </script>`
);

// Inline the Asciify vendor engine. The data-canvasui-asciify attribute is
// load-bearing for the E2E suite: run-e2e-tests.js executes the FIRST plain
// `<script>` block it finds in the bundle, which must stay the app script.
distHtml = distHtml.replace(
  /<script src="vendor\/asciify-vanilla\.js"[^>]*><\/script>/i,
  () => `<script data-canvasui-asciify>\n${asciifyJs}\n  </script>`
);

// Replace script.js script tag with inline <script> — MUST remain the first plain script
distHtml = distHtml.replace(
  /<script src="script\.js"[^>]*><\/script>/i,
  () => `<script>\n${scriptJs}\n  </script>`
);

const outPath = path.join(DIST_DIR, 'portfolio-mejorado.html');
fs.writeFileSync(outPath, distHtml, 'utf8');
console.log(`✓ Generated ${path.relative(ROOT_DIR, outPath)} (${distHtml.length} bytes)`);

