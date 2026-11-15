import { createServer } from 'node:http';
import { createReadStream, statSync, mkdirSync } from 'node:fs';
import { extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

const __dirname = resolve(fileURLToPath(import.meta.url), '..');
const root = resolve(__dirname, 'game');
const PORT = 8080;

const MIME: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.glb': 'model/gltf-binary',
  '.wav': 'audio/wav',
  '.ogg': 'audio/ogg',
};

const server = createServer((request, response) => {
  const url = new URL(request.url ?? '/', 'http://localhost');
  let pathname: string;
  try {
    pathname = decodeURIComponent(url.pathname);
  } catch {
    response.writeHead(400).end('bad request');
    return;
  }
  if (pathname.endsWith('/')) pathname += 'index.html';
  const file = resolve(join(root, normalize(pathname)));
  if (file !== root && !file.startsWith(root + sep)) {
    response.writeHead(403).end('forbidden');
    return;
  }
  let size: number;
  try {
    const stats = statSync(file);
    if (!stats.isFile()) throw new Error('not a file');
    size = stats.size;
  } catch {
    response.writeHead(404).end('not found');
    return;
  }
  response.writeHead(200, {
    'content-type': MIME[extname(file).toLowerCase()] ?? 'application/octet-stream',
    'content-length': size,
    'cache-control': 'no-store',
  });
  createReadStream(file).pipe(response);
});

server.listen(PORT, '127.0.0.1', async () => {
  console.log(`Apex Terminal orchestrator running on http://localhost:${PORT}`);

  try {
    mkdirSync('screenshots', { recursive: true });
    const browser = await chromium.launch({
      executablePath: '/root/.cache/ms-playwright/chromium-1208/chrome-linux64/chrome',
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
    });
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });

    const shots = [
      { name: 'screenshots/1-start.jpg', url: `http://localhost:${PORT}/?shot=start&seed=1` },
      { name: 'screenshots/2-play.jpg', url: `http://localhost:${PORT}/?shot=play&seed=1` },
      { name: 'screenshots/3-end.jpg', url: `http://localhost:${PORT}/?shot=end&seed=1` },
    ];

    for (const s of shots) {
      const page = await context.newPage();
      await page.goto(s.url, { waitUntil: 'networkidle' }).catch(() => {});
      
      if (s.url.includes('play')) {
        await page.keyboard.down('KeyW');
        await page.waitForTimeout(600);
        await page.keyboard.down('Space');
        await page.waitForTimeout(200);
        await page.keyboard.up('Space');
        await page.mouse.click(640, 360);
        await page.waitForTimeout(1000);
        await page.keyboard.up('KeyW');
      } else if (s.url.includes('end')) {
        await page.waitForTimeout(1000);
      }

      await page.waitForFunction(() => (window as any).__shotReady === true, { timeout: 6000 }).catch(() => {});
      await page.waitForTimeout(800);
      await page.screenshot({ path: s.name, type: 'jpeg', quality: 90 });
      await page.close();
      console.log(`Captured ${s.name}`);
    }

    await browser.close();
    console.log('Screenshots regenerated successfully.');
    server.close(() => {
      process.exit(0);
    });
  } catch (err) {
    console.error('Error during orchestrator execution:', err);
    server.close(() => {
      process.exit(1);
    });
  }
});
