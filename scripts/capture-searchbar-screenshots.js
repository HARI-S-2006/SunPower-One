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
    preview: { port: 4174, host: 'localhost' },
    build: { outDir: path.join(rootDir, 'dist') }
  });

  const browser = await chromium.launch({ headless: true });

  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

    // 1. Capture Header with Search Bar on Homepage
    await page.goto('http://localhost:4174/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    fs.mkdirSync(path.join(rootDir, 'docs/screenshots'), { recursive: true });
    await page.screenshot({ path: path.join(rootDir, 'docs/screenshots/header-searchbar-1440.png') });
    console.log('Saved: docs/screenshots/header-searchbar-1440.png');

    // 2. Capture Login Page with SolarSync 360 Search Bar
    await page.goto('http://localhost:4174/login', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    // Type into the search bar to demonstrate functionality
    const searchInput = page.locator('input[placeholder="Search SolarSync 360..."]');
    await searchInput.fill('Inverter warranty tracking');
    await page.screenshot({ path: path.join(rootDir, 'docs/screenshots/login-searchbar-1440.png') });
    console.log('Saved: docs/screenshots/login-searchbar-1440.png');

    // 3. Capture Mobile Viewport for Login Page
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('http://localhost:4174/login', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(rootDir, 'docs/screenshots/login-searchbar-390.png') });
    console.log('Saved: docs/screenshots/login-searchbar-390.png');

  } finally {
    await browser.close();
    await server.httpServer.close();
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

