import { chromium } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

async function runLiveAudit() {
  console.log('--- Launching Chromium to Audit Live Site: https://sunpower-one.netlify.app/ ---');
  const browser = await chromium.launch({ headless: true });
  
  // 1. Desktop Viewport
  const desktopContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  const desktopPage = await desktopContext.newPage();
  
  const consoleMessages = [];
  const pageErrors = [];
  const failedRequests = [];
  
  desktopPage.on('console', msg => consoleMessages.push(`[${msg.type()}] ${msg.text()}`));
  desktopPage.on('pageerror', err => pageErrors.push(err.message));
  desktopPage.on('requestfailed', req => failedRequests.push(`${req.method()} ${req.url()} - ${req.failure()?.errorText}`));

  try {
    const t0 = Date.now();
    const res = await desktopPage.goto('https://sunpower-one.netlify.app/', { waitUntil: 'networkidle', timeout: 30000 });
    const loadTimeMs = Date.now() - t0;
    console.log(`Live site loaded in ${loadTimeMs}ms with status: ${res?.status()}`);

    // Capture desktop screenshots
    await desktopPage.screenshot({ path: path.join(rootDir, 'test-results/screenshots/desktop/live-home-1440.png'), fullPage: true });
    console.log('Saved: test-results/screenshots/desktop/live-home-1440.png');

    // Test client-side navigation to Calculator
    await desktopPage.click('a[href*="calculator"]');
    await desktopPage.waitForTimeout(1000);
    await desktopPage.screenshot({ path: path.join(rootDir, 'test-results/screenshots/desktop/live-calculator-1440.png'), fullPage: true });
    console.log('Saved: test-results/screenshots/desktop/live-calculator-1440.png');

    // Test client-side navigation to Login
    await desktopPage.click('a[href*="login"]');
    await desktopPage.waitForTimeout(1000);
    await desktopPage.screenshot({ path: path.join(rootDir, 'test-results/screenshots/desktop/live-login-1440.png'), fullPage: true });
    console.log('Saved: test-results/screenshots/desktop/live-login-1440.png');

  } catch (err) {
    console.error('Error during desktop audit:', err.message);
  } finally {
    await desktopContext.close();
  }

  // 2. Tablet Viewport (768x1024)
  const tabletContext = await browser.newContext({
    viewport: { width: 768, height: 1024 }
  });
  const tabletPage = await tabletContext.newPage();
  try {
    await tabletPage.goto('https://sunpower-one.netlify.app/', { waitUntil: 'networkidle', timeout: 30000 });
    await tabletPage.screenshot({ path: path.join(rootDir, 'test-results/screenshots/tablet/live-home-768.png'), fullPage: true });
    console.log('Saved: test-results/screenshots/tablet/live-home-768.png');
  } catch (err) {
    console.error('Error during tablet audit:', err.message);
  } finally {
    await tabletContext.close();
  }

  // 3. Mobile Viewport (390x844)
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true
  });
  const mobilePage = await mobileContext.newPage();
  try {
    await mobilePage.goto('https://sunpower-one.netlify.app/', { waitUntil: 'networkidle', timeout: 30000 });
    await mobilePage.screenshot({ path: path.join(rootDir, 'test-results/screenshots/mobile/live-home-390.png'), fullPage: true });
    console.log('Saved: test-results/screenshots/mobile/live-home-390.png');
  } catch (err) {
    console.error('Error during mobile audit:', err.message);
  } finally {
    await mobileContext.close();
  }

  await browser.close();

  console.log('\n--- LIVE SITE LOGS ---');
  console.log(`Console messages count: ${consoleMessages.length}`);
  if (consoleMessages.length > 0) console.log(consoleMessages.slice(0, 10).join('\n'));
  console.log(`Page errors count: ${pageErrors.length}`);
  if (pageErrors.length > 0) console.log(pageErrors.join('\n'));
  console.log(`Failed requests count: ${failedRequests.length}`);
  if (failedRequests.length > 0) console.log(failedRequests.join('\n'));
}

runLiveAudit().catch(err => {
  console.error('Fatal audit failure:', err);
  process.exit(1);
});
