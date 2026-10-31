import { chromium } from '@playwright/test';
import { preview } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

async function main() {
  const server = await preview({
    preview: { port: 4178, host: 'localhost' },
    build: { outDir: path.join(rootDir, 'dist') }
  });

  const browser = await chromium.launch({ headless: true });

  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    fs.mkdirSync(path.join(rootDir, 'docs/screenshots'), { recursive: true });

    // 1. Capture Register Page in Register Mode (shows [LOGIN] beside [REGISTER])
    await page.goto('http://localhost:4178/register', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(rootDir, 'docs/screenshots/register-mode-side-by-side.png') });
    console.log('Saved: docs/screenshots/register-mode-side-by-side.png');

    // 2. Click LOGIN button to switch dynamically to Sign In mode on the same page
    await page.click('button:has-text("LOGIN")');
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(rootDir, 'docs/screenshots/signin-mode-side-by-side.png') });
    console.log('Saved: docs/screenshots/signin-mode-side-by-side.png');

    // 3. Capture Login Page showing [LOGIN] beside [REGISTER]
    await page.goto('http://localhost:4178/login', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(rootDir, 'docs/screenshots/login-page-side-by-side.png') });
    console.log('Saved: docs/screenshots/login-page-side-by-side.png');

  } finally {
    await browser.close();
    await server.httpServer.close();
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
