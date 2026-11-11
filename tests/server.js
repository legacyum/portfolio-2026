const http = require('http');
const fs = require('fs');
const path = require('path');

const requestedPort = Number(process.env.PORT);
const PORT = process.env.PORT !== undefined && Number.isInteger(requestedPort) && requestedPort >= 0 && requestedPort <= 65535
  ? requestedPort
  : 3000;
const HOST = process.env.HOST || '127.0.0.1';
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
  '.glb': 'model/gltf-binary',
  '.gltf': 'model/gltf+json'
};

const ROOT_DIR = path.resolve(__dirname, '..');
const SRC_DIR = path.join(ROOT_DIR, 'src');
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const PROTOTYPES_DIR = path.join(ROOT_DIR, 'prototypes');

function resolveStaticPath(rootDir, rawPath) {
  let decodedPath;
  try {
    decodedPath = decodeURIComponent(rawPath);
  } catch {
    return null;
  }

  if (
    !decodedPath.startsWith('/') ||
    /%2f|%5c/i.test(rawPath) ||
    decodedPath.includes('\\') ||
    decodedPath.includes('\0')
  ) {
    return null;
  }

  const relativePath = decodedPath.replace(/^\/+/, '');
  if (
    path.isAbsolute(relativePath) ||
    path.win32.isAbsolute(relativePath) ||
    relativePath.split('/').some(segment => segment.startsWith('.') || segment.toLowerCase() === 'graphify-out') ||
    /(?:^|\/)debug\.log$/i.test(relativePath)
  ) {
    return null;
  }

  const candidate = path.resolve(rootDir, relativePath);
  const relativeCandidate = path.relative(rootDir, candidate);
  if (
    relativeCandidate === '..' ||
    relativeCandidate.startsWith(`..${path.sep}`) ||
    path.isAbsolute(relativeCandidate)
  ) {
    return null;
  }

  try {
    const realRoot = fs.realpathSync(rootDir);
    const realCandidate = fs.realpathSync(candidate);
    const relativeReal = path.relative(realRoot, realCandidate);
    if (relativeReal === '..' || relativeReal.startsWith(`..${path.sep}`) || path.isAbsolute(relativeReal)) return null;
    if (relativeReal.split(path.sep).some(segment => segment.startsWith('.') || segment.toLowerCase() === 'graphify-out') || /(?:^|[\\/])debug\.log$/i.test(relativeReal)) return null;
    return fs.statSync(realCandidate).isFile() ? realCandidate : null;
  } catch {
    return null;
  }
}

const server = http.createServer((req, res) => {
  let reqPath = (req.url || '/').split('?')[0];
  if (reqPath === '/') reqPath = '/index.html';

  // Serve public roots and the two explicit prototype pages only.
  let filePath = null;
  const roots = [[SRC_DIR, reqPath], [DIST_DIR, reqPath]];
  if (reqPath.startsWith('/src/')) roots.push([SRC_DIR, reqPath.slice(4)]);
  if (reqPath === '/prototypes/cat3d.html' || reqPath === '/prototypes/crt.html') {
    roots.push([PROTOTYPES_DIR, reqPath.slice('/prototypes'.length)]);
  }
  for (const [rootDir, publicPath] of roots) {
    const candidate = resolveStaticPath(rootDir, publicPath);
    if (candidate) {
      filePath = candidate;
      break;
    }
  }

  if (filePath) {
    const stat = fs.statSync(filePath);
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME[ext] || 'application/octet-stream';
    console.log(`[HTTP 200] ${req.url} -> ${filePath} (${stat.size} bytes)`);
    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': stat.size,
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });
    fs.createReadStream(filePath).pipe(res);
  } else {
    const errorPagePath = path.join(SRC_DIR, '404.html');
    const errorPage = fs.readFileSync(errorPagePath);
    console.warn(`[HTTP 404] ${req.url} -> ${errorPagePath}`);
    res.writeHead(404, {
      'Content-Type': 'text/html; charset=utf-8',
      'Content-Length': errorPage.length,
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });
    res.end(errorPage);
  }
});

server.listen(PORT, HOST, () => {
  const address = server.address();
  const activePort = address && typeof address === 'object' ? address.port : PORT;
  console.log(`Server running at http://${HOST === '0.0.0.0' ? 'localhost' : HOST}:${activePort}/`);
  console.log(`Prototipo gato 3D: http://localhost:${activePort}/prototypes/cat3d.html`);
});
