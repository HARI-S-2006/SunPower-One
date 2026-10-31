import { chromium } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const baseUrl = 'https://sunpower-one.netlify.app';

const pagesToTest = [
  { name: 'home', path: '/' },
  { name: 'about', path: '/about' },
  { name: 'solutions', path: '/solutions' },
  { name: 'solutions-on-grid', path: '/solutions/on-grid' },
  { name: 'solutions-off-grid', path: '/solutions/off-grid' },
  { name: 'solar-calculator', path: '/solar-calculator' },
  { name: 'request-survey', path: '/request-survey' },
  { name: 'contact', path: '/contact' },
  { name: 'login', path: '/login' },
  { name: 'app-dashboard', path: '/app/dashboard' },
  { name: 'app-crm', path: '/app/crm' },
  { name: 'app-inventory', path: '/app/inventory' },
  { name: 'app-installations', path: '/app/installations' },
  { name: 'technician-jobs', path: '/technician/jobs' },
  { name: 'portal-dashboard', path: '/portal/dashboard' },
  { name: 'portal-orders', path: '/portal/orders' },
];

const deepLinkUrls = [
  '/login',
  '/solar-calculator',
  '/calculator',
  '/request-survey',
  '/app/dashboard',
  '/app/leads',
  '/app/inventory',
  '/app/installations',
  '/technician/jobs',
  '/portal',
  '/portal/orders',
];

async function main() {
  console.log(`Starting independent re-audit of production URL: ${baseUrl}`);
  const browser = await chromium.launch({ headless: true });

  const auditLog = {
    pages: [],
    deepLinks: [],
    consoleErrors: [],
    networkFailures: []
  };

  // 1. Audit Desktop 1440x900
  console.log('\n--- 1. Desktop Audit (1440x900) ---');
  const desktopCtx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const desktopPage = await desktopCtx.newPage();

  desktopPage.on('console', msg => {
    if (msg.type() === 'error') {
      auditLog.consoleErrors.push(`[Console Error][${desktopPage.url()}] ${msg.text()}`);
    }
  });
  desktopPage.on('pageerror', err => {
    auditLog.consoleErrors.push(`[Page Crash][${desktopPage.url()}] ${err.message}`);
  });
  desktopPage.on('requestfailed', req => {
    // Ignore analytics/third party tracking if any
    auditLog.networkFailures.push(`[Request Failed] ${req.method()} ${req.url()} (${req.failure()?.errorText})`);
  });

  for (const p of pagesToTest) {
    try {
      const t0 = Date.now();
      const res = await desktopPage.goto(baseUrl + p.path, { waitUntil: 'domcontentloaded', timeout: 20000 });
      await desktopPage.waitForTimeout(800);
      const duration = Date.now() - t0;
      const status = res?.status();
      const title = await desktopPage.title();
      const currentUrl = desktopPage.url();

      const shotPath = path.join(rootDir, `test-results/screenshots/live-desktop/${p.name}-1440.png`);
      await desktopPage.screenshot({ path: shotPath, fullPage: true });

      console.log(`✓ ${p.name.padEnd(20)} | Status: ${status} | Time: ${duration}ms | URL: ${currentUrl}`);
      auditLog.pages.push({
        name: p.name,
        path: p.path,
        status,
        duration,
        currentUrl,
        screenshot: shotPath
      });
    } catch (err) {
      console.error(`✗ ${p.name.padEnd(20)} | Failed: ${err.message}`);
      auditLog.pages.push({ name: p.name, path: p.path, error: err.message });
    }
  }

  // 2. Audit Tablet 768x1024
  console.log('\n--- 2. Tablet Audit (768x1024) ---');
  const tabletCtx = await browser.newContext({ viewport: { width: 768, height: 1024 } });
  const tabletPage = await tabletCtx.newPage();
  for (const p of ['home', 'solar-calculator', 'login', 'app-dashboard', 'technician-jobs']) {
    const pageItem = pagesToTest.find(x => x.name === p);
    if (!pageItem) continue;
    try {
      await tabletPage.goto(baseUrl + pageItem.path, { waitUntil: 'domcontentloaded', timeout: 20000 });
      await tabletPage.waitForTimeout(800);
      const shotPath = path.join(rootDir, `test-results/screenshots/live-tablet/${p}-768.png`);
      await tabletPage.screenshot({ path: shotPath, fullPage: true });
      console.log(`✓ Tablet ${p} captured`);
    } catch (e) {
      console.error(`✗ Tablet ${p} failed: ${e.message}`);
    }
  }
  await tabletCtx.close();

  // 3. Audit Mobile 390x844
  console.log('\n--- 3. Mobile Audit (390x844) ---');
  const mobileCtx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const mobilePage = await mobileCtx.newPage();
  for (const p of ['home', 'solar-calculator', 'request-survey', 'login', 'technician-jobs', 'portal-dashboard']) {
    const pageItem = pagesToTest.find(x => x.name === p);
    if (!pageItem) continue;
    try {
      await mobilePage.goto(baseUrl + pageItem.path, { waitUntil: 'domcontentloaded', timeout: 20000 });
      await mobilePage.waitForTimeout(800);
      const shotPath = path.join(rootDir, `test-results/screenshots/live-mobile/${p}-390.png`);
      await mobilePage.screenshot({ path: shotPath, fullPage: true });
      console.log(`✓ Mobile ${p} captured`);
    } catch (e) {
      console.error(`✗ Mobile ${p} failed: ${e.message}`);
    }
  }
  await mobileCtx.close();

  // 4. Test Deep Link Routing and Refresh
  console.log('\n--- 4. Direct Deep Link & Refresh Verification ---');
  for (const dl of deepLinkUrls) {
    try {
      // Direct navigation
      const t0 = Date.now();
      const res = await desktopPage.goto(baseUrl + dl, { waitUntil: 'domcontentloaded', timeout: 20000 });
      await desktopPage.waitForTimeout(500);
      const directUrl = desktopPage.url();
      const directStatus = res?.status();

      // Refresh test
      const refreshRes = await desktopPage.reload({ waitUntil: 'domcontentloaded', timeout: 20000 });
      await desktopPage.waitForTimeout(500);
      const refreshUrl = desktopPage.url();
      const refreshStatus = refreshRes?.status();

      const passed = directStatus === 200 && refreshStatus === 200;
      console.log(`${passed ? '✓' : '✗'} Deep link ${dl.padEnd(20)} | Direct: ${directStatus} -> ${directUrl} | Refresh: ${refreshStatus} -> ${refreshUrl}`);
      auditLog.deepLinks.push({
        path: dl,
        directStatus,
        directUrl,
        refreshStatus,
        refreshUrl,
        passed
      });
    } catch (e) {
      console.error(`✗ Deep link ${dl} failed: ${e.message}`);
      auditLog.deepLinks.push({ path: dl, error: e.message, passed: false });
    }
  }

  await desktopCtx.close();
  await browser.close();

  console.log('\n--- AUDIT SUMMARY ---');
  console.log(`Pages audited: ${auditLog.pages.length}`);
  console.log(`Deep links verified: ${auditLog.deepLinks.length}`);
  console.log(`Console errors: ${auditLog.consoleErrors.length}`);
  if (auditLog.consoleErrors.length > 0) {
    console.log(auditLog.consoleErrors.slice(0, 10).join('\n'));
  }
  console.log(`Network failures: ${auditLog.networkFailures.length}`);
  if (auditLog.networkFailures.length > 0) {
    console.log(auditLog.networkFailures.slice(0, 10).join('\n'));
  }

  return auditLog;
}

main().catch(err => {
  console.error('Fatal execution error:', err);
  process.exit(1);
});

