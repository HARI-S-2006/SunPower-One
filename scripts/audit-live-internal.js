import { chromium } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

async function auditInternal() {
  console.log('--- Auditing Internal Live Site via Client Navigation ---');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  try {
    // 1. Go to homepage
    await page.goto('https://sunpower-one.netlify.app/', { waitUntil: 'networkidle' });
    
    // 2. Click Login in navbar
    await page.click('a[href*="login"]');
    await page.waitForURL('**/login', { timeout: 10000 });
    console.log('Navigated to /login');

    // 3. Submit login to go to /app/dashboard
    await page.click('button[type="submit"]');
    await page.waitForURL('**/app/dashboard', { timeout: 15000 });
    console.log('Navigated to /app/dashboard');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(rootDir, 'test-results/screenshots/desktop/live-dashboard-1440.png'), fullPage: true });

    // 4. Navigate to CRM Leads
    await page.click('a[href*="crm/leads"], a[href*="/app/crm"]');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(rootDir, 'test-results/screenshots/desktop/live-crm-1440.png'), fullPage: true });

    // 5. Navigate to Surveys
    await page.click('a[href*="surveys"]');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(rootDir, 'test-results/screenshots/desktop/live-surveys-1440.png'), fullPage: true });

    // 6. Navigate to Technician Portal
    await page.goto('https://sunpower-one.netlify.app/');
    await page.click('a[href*="login"]');
    // If mobile technician
    const roleSelect = await page.$('select[name="role"]');
    if (roleSelect) {
      await page.selectOption('select[name="role"]', 'technician');
    }
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(rootDir, 'test-results/screenshots/mobile/live-technician-portal.png'), fullPage: true });

    console.log('Internal Live Audit Screenshots Captured Successfully!');
  } catch (err) {
    console.error('Error during live internal audit:', err.message);
  } finally {
    await browser.close();
  }
}

auditInternal().catch(err => {
  console.error(err);
  process.exit(1);
});
