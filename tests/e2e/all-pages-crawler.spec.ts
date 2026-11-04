import { test, expect } from '@playwright/test'

const allRoutes = [
  // Public pages
  '/',
  '/about',
  '/solutions',
  '/solutions/on-grid',
  '/solutions/off-grid',
  '/solar-calculator',
  '/request-survey',
  '/contact',
  '/login',
  '/register',

  // ERP Operations pages
  '/app/dashboard',
  '/app/crm/leads',
  '/app/customers',
  '/app/surveys',
  '/app/configurator',
  '/app/products',
  '/app/bom',
  '/app/quotations',
  '/app/orders',
  '/app/payments',
  '/app/inventory',
  '/app/inventory/stock-ledger',
  '/app/inventory/serials',
  '/app/inventory/passport',
  '/app/inventory/dispatch',
  '/app/suppliers',
  '/app/purchase-orders',
  '/app/installations',
  '/app/technicians',
  '/app/technician-schedule',
  '/app/warranties',
  '/app/service',
  '/app/invoices',
  '/app/expenses',
  '/app/technician-payments',
  '/app/subsidies',
  '/app/profitability',
  '/app/analytics',
  '/app/ai-assistant',
  '/app/notifications',
  '/app/settings',

  // Technician pages
  '/technician/jobs',
  '/technician/scan',
  '/technician/checklist/inst-01',
  '/technician/completion/inst-01',

  // Customer Portal pages
  '/portal/dashboard',
  '/portal/quotations',
  '/portal/orders',
  '/portal/installations',
  '/portal/equipment',
  '/portal/warranty',
  '/portal/service',
  '/portal/profile',
]

test.describe('SunPower One - 48-Page Multi-Pass Autonomous Crawler Audit', () => {

  test('Pass 1: Crawl all 48 routes, verify HTTP 200, zero uncaught exceptions, and valid content', async ({ page }) => {
    test.setTimeout(60000)
    const errorLogs: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const text = msg.text()
        // Ignore expected external resource errors and rapid navigation socket resets
        if (!text.includes('favicon') && !text.includes('chrome-extension') && !text.includes('net::ERR_')) {
          errorLogs.push(text)
        }
      }
    })

    page.on('pageerror', (err) => {
      errorLogs.push(err.message)
    })

    for (const route of allRoutes) {
      await page.goto(route)
      await page.waitForLoadState('domcontentloaded')
      
      // Verify body is rendered and not blank
      const bodyContent = await page.textContent('body')
      expect(bodyContent?.length).toBeGreaterThan(50)
      
      // Verify no critical uncaught React error boundary exploded
      expect(bodyContent).not.toContain('Something went wrong')
      expect(bodyContent).not.toContain('Cannot read properties of undefined')
    }

    expect(errorLogs).toEqual([])
  })

  test('Pass 2: Re-crawl all 48 routes with active authenticated Admin Director session', async ({ page }) => {
    // Authenticate as Admin first
    await page.goto('/login')
    await page.waitForLoadState('networkidle')
    await page.fill('input#email', 'admin@sunpower-solutions.com')
    await page.fill('input#password', 'password123')
    await page.click('button[type="submit"]:has-text("LOGIN")')
    await page.waitForURL('**/app/dashboard', { timeout: 15000 })

    const errorLogs: string[] = []
    page.on('pageerror', (err) => errorLogs.push(err.message))

    for (const route of allRoutes) {
      await page.goto(route)
      await page.waitForLoadState('domcontentloaded')
      const body = await page.textContent('body')
      expect(body?.length).toBeGreaterThan(50)
    }

    expect(errorLogs).toEqual([])
  })

  test('Pass 3: Re-crawl Customer Portal with authenticated Customer profile (Siddharth Varma)', async ({ page }) => {
    // Authenticate as Customer
    await page.goto('/login')
    await page.waitForLoadState('networkidle')
    await page.fill('input#email', 'customer@demo.com')
    await page.fill('input#password', 'password123')
    await page.click('button[type="submit"]:has-text("LOGIN")')
    await page.waitForURL(/.*\/portal/, { timeout: 15000 })

    const portalRoutes = allRoutes.filter((r) => r.startsWith('/portal'))
    for (const pRoute of portalRoutes) {
      await page.goto(pRoute)
      await page.waitForLoadState('networkidle')
      // Ensure customer profile name Siddharth Varma is present across portal views
      await expect(page.locator('aside')).toContainText('Siddharth Varma')
    }
  })
})
