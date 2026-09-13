const assert = require('assert');
const http = require('http');
const path = require('path');
const { spawn } = require('child_process');

const ROOT_DIR = path.resolve(__dirname, '..');
const HOST = '127.0.0.1';

function request(port, requestPath) {
  return new Promise((resolve, reject) => {
    const req = http.get({ host: HOST, port, path: requestPath }, res => {
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => resolve({ statusCode: res.statusCode, body: Buffer.concat(chunks).toString('utf8') }));
    });
    req.once('error', reject);
  });
}

function waitForServer(child) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Preview server did not start within five seconds')), 5000);
    child.stdout.setEncoding('utf8');
    child.stdout.on('data', output => {
      const match = output.match(/Server running at http:\/\/[^:]+:(\d+)\//);
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
  const child = spawn(process.execPath, ['tests/server.js'], {
    cwd: ROOT_DIR,
    env: { ...process.env, HOST, PORT: '0' },
    stdio: ['ignore', 'pipe', 'ignore']
  });

  try {
    const port = await waitForServer(child);

    for (const requestPath of ['/', '/styles.css', '//styles.css', '/portfolio-mejorado.html', '/prototypes/cat3d.html']) {
      const response = await request(port, requestPath);
      assert.strictEqual(response.statusCode, 200, `${requestPath} should remain available`);
    }

    assert.strictEqual((await request(port, '/not-a-file')).statusCode, 404, 'Missing files should remain 404');

    for (const requestPath of [
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
  }
}

run().catch(error => {
  console.error(error.stack || error);
  process.exitCode = 1;
});
