const assert = require('assert');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const ROOT_DIR = path.resolve(__dirname, '..');
const HOST = '127.0.0.1';

function request(port, requestPath) {
  return new Promise((resolve, reject) => {
    const req = http.get({ host: HOST, port, path: requestPath }, res => {
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => resolve({ statusCode: res.statusCode, headers: res.headers, body: Buffer.concat(chunks).toString('utf8') }));
    });
    req.once('error', reject);
  });
}

function waitForServer(child) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Preview server did not start within five seconds')), 5000);
    child.stdout.setEncoding('utf8');
    child.stdout.on('data', output => {
      const match = output.match(/Server running at http:\/\/127\.0\.0\.1:(\d+)\//);
      if (match) {
        clearTimeout(timer);
        resolve(Number(match[1]));
      }
    });
    child.once('exit', code => {
      clearTimeout(timer);
      reject(new Error(`Preview server exited early with code ${code}`));
    });
  });
}

async function run() {
  const fixtureName = `security-fixture-${process.pid}.txt`;
  const fixturePath = path.join(ROOT_DIR, fixtureName);
  const hiddenName = `.security-fixture-${process.pid}`;
  const hiddenPath = path.join(ROOT_DIR, 'src', hiddenName);
  fs.writeFileSync(fixturePath, 'private fixture', { flag: 'wx' });
  fs.writeFileSync(hiddenPath, 'private fixture', { flag: 'wx' });
  const env = { ...process.env, PORT: '0' };
  delete env.HOST;
  const child = spawn(process.execPath, ['tests/server.js'], {
    cwd: ROOT_DIR,
    env,
    stdio: ['ignore', 'pipe', 'ignore']
  });

  try {
    const port = await waitForServer(child);

    for (const requestPath of ['/', '/styles.css', '//styles.css', '/portfolio-mejorado.html', '/prototypes/cat3d.html', '/prototypes/crt.html', '/src/vendor/three.min.js', '/src/vendor/OrbitControls.js', '/src/vendor/crt-engine.js', '/src/favicon.svg', '/src/CV_Alessandro_Altamirano_Salazar_2026.pdf']) {
      const response = await request(port, requestPath);
      assert.strictEqual(response.statusCode, 200, `${requestPath} should remain available`);
      assert.strictEqual(response.headers['access-control-allow-origin'], undefined, 'Preview should not allow cross-origin reads');
    }

    const missingFileResponse = await request(port, '/not-a-file');
    assert.strictEqual(missingFileResponse.statusCode, 404, 'Missing files should remain 404');
    assert.match(missingFileResponse.headers['content-type'], /^text\/html/, 'Missing files should return the custom HTML page');
    assert(missingFileResponse.body.includes('Ruta no'), 'Missing files should render the custom 404 page');

    for (const requestPath of [
      `/${fixtureName}`,
      `/${hiddenName}`,
      `/src/${hiddenName}`,
      '/.git/HEAD',
      '/.git/config',
      '/.env',
      '/debug.log',
      '/tests/server.js',
      '/graphify-out/cache/',
      '/AGENTS.md',
      '/prototypes/README.md',
      '/%2egit/HEAD',
      '/../AGENTS.md',
      '/%2e%2e/AGENTS.md',
      '/..%2fAGENTS.md',
      '/..%5cAGENTS.md',
      '/C:%5cWindows%5cwin.ini',
      '/%00',
      '/%ZZ'
    ]) {
      const response = await request(port, requestPath);
      assert.strictEqual(response.statusCode, 404, `${requestPath} must not escape a static root`);
      assert(!response.body.includes('Project Overview'), `${requestPath} must not stream the traversal target`);
    }

    console.log('PASS server path traversal and fallback behavior');
  } finally {
    child.kill();
    fs.unlinkSync(fixturePath);
    fs.unlinkSync(hiddenPath);
  }
}

run().catch(error => {
  console.error(error.stack || error);
  process.exitCode = 1;
});
