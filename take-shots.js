import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';

async function main() {
  mkdirSync('screenshots', { recursive: true });
  const browser = await chromium.launch({
    executablePath: '/root/.cache/ms-playwright/chromium-1208/chrome-linux64/chrome',
    headless: true,
  });
  const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  
  const shots = [
    { name: 'screenshots/1-start.jpg', url: 'http://localhost:8080/?shot=start&seed=1' },
    { name: 'screenshots/2-play.jpg', url: 'http://localhost:8080/?shot=play&seed=1' },
    { name: 'screenshots/3-end.jpg', url: 'http://localhost:8080/?shot=end&seed=1' },
  ];

  for (const s of shots) {
    const page = await context.newPage();
    await page.goto(s.url, { waitUntil: 'networkidle' });
    // Wait for window.__shotReady
    await page.waitForFunction(() => window.__shotReady === true, { timeout: 10000 }).catch(() => {});
    await page.waitForTimeout(500);
    await page.screenshot({ path: s.name, type: 'jpeg', quality: 90 });
    await page.close();
    console.log(`Captured ${s.name}`);
  }

  await browser.close();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
