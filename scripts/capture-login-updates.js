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
    preview: { port: 4175, host: 'localhost' },
    build: { outDir: path.join(rootDir, 'dist') }
  });

  const browser = await chromium.launch({ headless: true });

  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

    // 1. Capture Login Page with Admin Selected (Default: Role dropdown hidden)
    await page.goto('http://localhost:4175/login', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    fs.mkdirSync(path.join(rootDir, 'docs/screenshots'), { recursive: true });
    await page.screenshot({ path: path.join(rootDir, 'docs/screenshots/login-admin-1440.png') });
    console.log('Saved: docs/screenshots/login-admin-1440.png');

    // 2. Capture Login Page with Employee Selected (Role dropdown visible)
    await page.click('button:has-text("Employee")');
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(rootDir, 'docs/screenshots/login-employee-1440.png') });
    console.log('Saved: docs/screenshots/login-employee-1440.png');

    // 3. Capture Login Page with Customer Selected (Role dropdown hidden)
    await page.click('button:has-text("Customer")');
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(rootDir, 'docs/screenshots/login-customer-1440.png') });
    console.log('Saved: docs/screenshots/login-customer-1440.png');

    // 4. Capture Mobile Viewport with Employee selected
    await page.setViewportSize({ width: 390, height: 844 });
    await page.click('button:has-text("Employee")');
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(rootDir, 'docs/screenshots/login-employee-390.png') });
    console.log('Saved: docs/screenshots/login-employee-390.png');

  } finally {
    await browser.close();
    await server.httpServer.close();
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
