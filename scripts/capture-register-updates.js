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
    preview: { port: 4176, host: 'localhost' },
    build: { outDir: path.join(rootDir, 'dist') }
  });

  const browser = await chromium.launch({ headless: true });

  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    fs.mkdirSync(path.join(rootDir, 'docs/screenshots'), { recursive: true });

    // 1. Capture Header Navbar on Home Page
    await page.goto('http://localhost:4176/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    const headerElement = page.locator('header nav');
    await headerElement.screenshot({ path: path.join(rootDir, 'docs/screenshots/header-register-navbar.png') });
    console.log('Saved: docs/screenshots/header-register-navbar.png');

    // 2. Capture Register Page Desktop
    await page.goto('http://localhost:4176/register', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(rootDir, 'docs/screenshots/register-page-desktop.png') });
    console.log('Saved: docs/screenshots/register-page-desktop.png');

    // 3. Capture Register Page Mobile
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(rootDir, 'docs/screenshots/register-page-mobile.png') });
    console.log('Saved: docs/screenshots/register-page-mobile.png');

    // 4. Capture Login Page with Register link
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('http://localhost:4176/login', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(rootDir, 'docs/screenshots/login-with-register-link.png') });
    console.log('Saved: docs/screenshots/login-with-register-link.png');

  } finally {
    await browser.close();
    await server.httpServer.close();
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
