const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const indexHtml = fs.readFileSync(path.join(ROOT_DIR, 'index.html'), 'utf8');
const stylesCss = fs.readFileSync(path.join(ROOT_DIR, 'styles.css'), 'utf8');
const scriptJs = fs.readFileSync(path.join(ROOT_DIR, 'script.js'), 'utf8');
const asciifyJs = fs.readFileSync(path.join(ROOT_DIR, 'vendor', 'asciify-vanilla.js'), 'utf8');

let distHtml = indexHtml;

// Replace styles.css link with inline <style>
distHtml = distHtml.replace(
  /<link rel="stylesheet" href="styles\.css"\s*\/?>/i,
  () => `<style>\n${stylesCss}\n  </style>`
);

// Inline vendor scripts with data-vendor marker so they are NOT picked as the
// first plain <script> (E2E harness executes the first plain script as the app).
function inlineVendor(srcPath, dataAttr) {
  try {
    const content = fs.readFileSync(path.join(ROOT_DIR, srcPath), 'utf8');
    const escaped = srcPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(`<script src="${escaped}"[^>]*><\\/script>`, 'i');
    distHtml = distHtml.replace(re, () => `<script ${dataAttr}>\n${content}\n  </script>`);
  } catch (e) {
    console.warn(`Warning: could not inline ${srcPath}: ${e.message}`);
  }
}

inlineVendor('vendor/three.min.js', 'data-vendor="three"');
inlineVendor('vendor/OrbitControls.js', 'data-vendor="orbit-controls"');
inlineVendor('vendor/cosmos-engine.js', 'data-vendor="cosmos"');

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

fs.writeFileSync(path.join(ROOT_DIR, 'portfolio-mejorado.html'), distHtml, 'utf8');
console.log(`✓ Generated portfolio-mejorado.html (${distHtml.length} bytes)`);
