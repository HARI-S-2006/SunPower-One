import { chromium } from '@playwright/test';
import { preview } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const views = [
  { name: 'public-home', path: '/' },
  { name: 'erp-dashboard', path: '/app/dashboard' },
  { name: 'technician-jobs', path: '/technician/jobs' },
  { name: 'customer-portal', path: '/portal/dashboard' },
];

async function measurePagePerformance(page, url) {
  // Inject PerformanceObserver before document loads to capture LCP and CLS accurately
  await page.addInitScript(() => {
    window.__perfData = {
      lcp: 0,
      cls: 0,
    };

    try {
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        if (lastEntry) window.__perfData.lcp = lastEntry.startTime;
      });
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

      const clsObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (!entry.hadRecentInput) {
            window.__perfData.cls += entry.value;
          }
        }
      });
      clsObserver.observe({ type: 'layout-shift', buffered: true });
    } catch (e) {
      // observer not supported
    }
  });

  const t0 = Date.now();
  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  const loadDuration = Date.now() - t0;

  await page.waitForTimeout(1000);

  const metrics = await page.evaluate(() => {
    const nav = performance.getEntriesByType('navigation')[0] || {};
    const paint = performance.getEntriesByType('paint') || [];
    const fcp = paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0;

    return {
      ttfb: nav.responseStart ? Math.round(nav.responseStart - nav.requestStart) : 0,
      fcp: Math.round(fcp),
      lcp: Math.round(window.__perfData?.lcp || fcp || 0),
      cls: Number((window.__perfData?.cls || 0).toFixed(4)),
      domInteractive: nav.domInteractive ? Math.round(nav.domInteractive) : 0,
      domContentLoaded: nav.domContentLoadedEventEnd ? Math.round(nav.domContentLoadedEventEnd) : 0,
      totalLoadTime: nav.loadEventEnd ? Math.round(nav.loadEventEnd) : 0,
    };
  });

  metrics.measuredDuration = loadDuration;
  return metrics;
}

async function main() {
  console.log('=== Starting Local Production Preview & Web Vitals Audit ===');
  
  // Start local Vite preview server on ephemeral port 4173
  const server = await preview({
    preview: { port: 4173, host: 'localhost' },
    build: { outDir: path.join(rootDir, 'dist') }
  });
  
  const baseUrl = 'http://localhost:4173';
  console.log(`Vite preview running at ${baseUrl}`);

  const browser = await chromium.launch({ headless: true });
  const results = {
    desktop: {},
    tablet: {},
    mobile: {}
  };

  try {
    // Ensure directories exist
    fs.mkdirSync(path.join(rootDir, 'docs/screenshots/desktop'), { recursive: true });
    fs.mkdirSync(path.join(rootDir, 'docs/screenshots/tablet'), { recursive: true });
    fs.mkdirSync(path.join(rootDir, 'docs/screenshots/mobile'), { recursive: true });
    fs.mkdirSync(path.join(rootDir, 'test-results/screenshots/local-desktop'), { recursive: true });
    fs.mkdirSync(path.join(rootDir, 'test-results/screenshots/local-tablet'), { recursive: true });
    fs.mkdirSync(path.join(rootDir, 'test-results/screenshots/local-mobile'), { recursive: true });

    // 1. Desktop Audit (1440x900)
    console.log('\n--- 1. Desktop Audit (1440x900) ---');
    const desktopCtx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const desktopPage = await desktopCtx.newPage();

    for (const v of views) {
      console.log(`Auditing Desktop: ${v.name} (${v.path})...`);
      const perf = await measurePagePerformance(desktopPage, baseUrl + v.path);
      const shotPath = path.join(rootDir, `docs/screenshots/desktop/${v.name}-1440.png`);
      await desktopPage.screenshot({ path: shotPath, fullPage: true });
      fs.copyFileSync(shotPath, path.join(rootDir, `test-results/screenshots/local-desktop/${v.name}-1440.png`));
      results.desktop[v.name] = { ...perf, screenshot: shotPath };
      console.log(`  ✓ TTFB: ${perf.ttfb}ms | FCP: ${perf.fcp}ms | LCP: ${perf.lcp}ms | CLS: ${perf.cls}`);
    }
    await desktopCtx.close();

    // 2. Tablet Audit (768x1024)
    console.log('\n--- 2. Tablet Audit (768x1024) ---');
    const tabletCtx = await browser.newContext({ viewport: { width: 768, height: 1024 } });
    const tabletPage = await tabletCtx.newPage();

    for (const v of views) {
      console.log(`Auditing Tablet: ${v.name} (${v.path})...`);
      const perf = await measurePagePerformance(tabletPage, baseUrl + v.path);
      const shotPath = path.join(rootDir, `docs/screenshots/tablet/${v.name}-768.png`);
      await tabletPage.screenshot({ path: shotPath, fullPage: true });
      fs.copyFileSync(shotPath, path.join(rootDir, `test-results/screenshots/local-tablet/${v.name}-768.png`));
      results.tablet[v.name] = { ...perf, screenshot: shotPath };
      console.log(`  ✓ TTFB: ${perf.ttfb}ms | FCP: ${perf.fcp}ms | LCP: ${perf.lcp}ms | CLS: ${perf.cls}`);
    }
    await tabletCtx.close();

    // 3. Mobile Audit (390x844)
    console.log('\n--- 3. Mobile Audit (390x844) ---');
    const mobileCtx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    const mobilePage = await mobileCtx.newPage();

    for (const v of views) {
      console.log(`Auditing Mobile: ${v.name} (${v.path})...`);
      const perf = await measurePagePerformance(mobilePage, baseUrl + v.path);
      const shotPath = path.join(rootDir, `docs/screenshots/mobile/${v.name}-390.png`);
      await mobilePage.screenshot({ path: shotPath, fullPage: true });
      fs.copyFileSync(shotPath, path.join(rootDir, `test-results/screenshots/local-mobile/${v.name}-390.png`));
      results.mobile[v.name] = { ...perf, screenshot: shotPath };
      console.log(`  ✓ TTFB: ${perf.ttfb}ms | FCP: ${perf.fcp}ms | LCP: ${perf.lcp}ms | CLS: ${perf.cls}`);
    }
    await mobileCtx.close();

  } finally {
    await browser.close();
    await server.httpServer.close();
  }

  console.log('\n=== REAL WEB VITALS RESULTS SUMMARY ===');
  console.log(JSON.stringify(results, null, 2));

  fs.writeFileSync(
    path.join(rootDir, 'test-results/web-vitals-summary.json'),
    JSON.stringify(results, null, 2)
  );
  console.log('\nSaved: test-results/web-vitals-summary.json');
}

main().catch(err => {
  console.error('Fatal audit failure:', err);
  process.exit(1);
});
