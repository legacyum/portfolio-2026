const http = require('http');
const fs = require('fs');
const path = require('path');

const requestedPort = Number(process.env.PORT);
const PORT = process.env.PORT !== undefined && Number.isInteger(requestedPort) && requestedPort >= 0 && requestedPort <= 65535
  ? requestedPort
  : 3000;
const HOST = process.env.HOST || '0.0.0.0';
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
    relativePath.split('/').includes('..')
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

  return candidate;
}

const server = http.createServer((req, res) => {
  let reqPath = (req.url || '/').split('?')[0];
  if (reqPath === '/') reqPath = '/index.html';

  // Resolve priority: src/ -> dist/ -> root
  let filePath = null;
  for (const rootDir of [SRC_DIR, DIST_DIR, ROOT_DIR]) {
    const candidate = resolveStaticPath(rootDir, reqPath);
    if (candidate && fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
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
      'Access-Control-Allow-Origin': '*',
      'Cross-Origin-Resource-Policy': 'cross-origin',
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
