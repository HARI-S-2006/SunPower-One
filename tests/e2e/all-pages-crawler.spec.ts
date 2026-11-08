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

const routeAssertions: Record<string, RegExp> = {
  '/': /SunPower|Intelligent Operating Platform/i,
  '/about': /About SunPower|Engineering Excellence|Certified/i,
  '/solutions': /Solar Solutions|On-Grid|Off-Grid/i,
  '/solutions/on-grid': /On-Grid|Net-Metering/i,
  '/solutions/off-grid': /Off-Grid|Battery Storage|BESS/i,
  '/solar-calculator': /Solar Calculator|Estimate Your Solar/i,
  '/request-survey': /Request.*Survey|Site Inspection|Booking/i,
  '/contact': /Contact|Regional Hubs|Inquiry/i,
  '/login': /Command Center Sign In|SolarSync 360/i,
  '/register': /Register|Create.*Account/i,
  '/app/dashboard': /Solar Operations Command Center|SCADA/i,
  '/app/crm/leads': /Customer Inquiries|Lead/i,
  '/app/customers': /Customer Directory|Commercial Accounts/i,
  '/app/surveys': /Site Surveys|Feasibility/i,
  '/app/configurator': /Configurator|BOM Engine/i,
  '/app/products': /Hardware SKU Master Database|Product Catalog/i,
  '/app/bom': /Bill of Materials|BOM/i,
  '/app/quotations': /Quotations|Formal Proposal/i,
  '/app/orders': /Sales Orders|Payment Milestones/i,
  '/app/payments': /Payment Receipts|Milestone Escrow/i,
  '/app/inventory': /Inventory|Stock Levels/i,
  '/app/inventory/stock-ledger': /Stock Movement Ledger|Audit/i,
  '/app/inventory/serials': /Serial Number Registry|QR Ledger/i,
  '/app/inventory/passport': /Solar Digital Passport|Asset Registry/i,
  '/app/inventory/dispatch': /Dispatch|Warranty Activation/i,
  '/app/suppliers': /Suppliers|OEM Vendors/i,
  '/app/purchase-orders': /Purchase Orders|Procurement/i,
  '/app/installations': /Installation Management|Project/i,
  '/app/technicians': /Field Technicians|Workforce/i,
  '/app/technician-schedule': /Technician Schedule|Calendar/i,
  '/app/warranties': /Warranty Management|Digital Certificates/i,
  '/app/service': /Service Desk|After-Sales/i,
  '/app/invoices': /Commercial Invoices|Billing/i,
  '/app/expenses': /Operating Expenses|Cost Accounting|Expense Ledger/i,
  '/app/technician-payments': /Technician Labour|Settlement/i,
  '/app/subsidies': /PM Surya Ghar|Subsidy Tracker/i,
  '/app/profitability': /Project Unit Economics|Profitability/i,
  '/app/analytics': /Analytics|SCADA Fleet/i,
  '/app/ai-assistant': /Solar Intelligence|AI Assistant/i,
  '/app/notifications': /Notifications|Alerts/i,
  '/app/settings': /Account Profile & System Policy Settings/i,
  '/technician/jobs': /Field Job|Assigned Job|Technician Field Portal/i,
  '/technician/scan': /Optical Serial Scanner|Barcode.*Scanner|Scan QR/i,
  '/technician/checklist/inst-01': /Commissioning Inspection|Safety/i,
  '/technician/completion/inst-01': /Customer Handover & Signature|Customer Signature/i,
  '/portal/dashboard': /Siddharth Varma|Live Solar Output/i,
  '/portal/quotations': /My Commercial Quotations/i,
  '/portal/orders': /My Orders & Payment Schedule/i,
  '/portal/installations': /Installation & Field Commissioning/i,
  '/portal/equipment': /Installed Solar Equipment|Digital Passports/i,
  '/portal/warranty': /Digital Warranty Certificates/i,
  '/portal/service': /Customer Service & Support Desk/i,
  '/portal/profile': /Customer Profile/i,
}

test.describe('SunPower One - Comprehensive Multi-Pass Autonomous Crawler Audit', () => {

  test('Pass 1: Crawl public routes, verify zero exceptions, and valid content', async ({ page }) => {
    test.setTimeout(60000)
    const errorLogs: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const text = msg.text()
        if (!text.includes('favicon') && !text.includes('chrome-extension') && !text.includes('net::ERR_')) {
          errorLogs.push(text)
        }
      }
    })

    page.on('pageerror', (err) => {
      errorLogs.push(err.message)
    })

    const publicRoutes = allRoutes.filter((r) => !r.startsWith('/app') && !r.startsWith('/technician') && !r.startsWith('/portal'))
    for (const route of publicRoutes) {
      await page.goto(route)
      await page.waitForLoadState('domcontentloaded')
      
      const bodyContent = await page.textContent('body')
      expect(bodyContent?.length).toBeGreaterThan(50)
      expect(bodyContent).not.toContain('Page Not Found')
      expect(bodyContent).not.toContain('Something went wrong')

      if (routeAssertions[route]) {
        await expect(page.locator('body')).toContainText(routeAssertions[route])
      }
    }

    expect(errorLogs).toEqual([])
  })

  test('Pass 2: Re-crawl all 53 routes with active authenticated Admin Director session & Page-Specific Assertions', async ({ page }) => {
    test.setTimeout(90000)
    // Authenticate as Admin first
    await page.goto('/login')
    await page.waitForLoadState('domcontentloaded')
    await page.fill('input#email', 'admin@sunpower-solutions.com')
    await page.fill('input#password', 'password123')
    await page.click('button[type="submit"]:has-text("LOGIN")')
    await page.waitForURL('**/app/dashboard', { timeout: 15000 })

    const errorLogs: string[] = []
    page.on('pageerror', (err) => errorLogs.push(err.message))

    for (const route of allRoutes) {
      await page.goto(route)
      await page.waitForLoadState('domcontentloaded')

      // Assert page is NOT a 404 / Netlify SPA fallback
      const body = await page.textContent('body')
      expect(body?.length).toBeGreaterThan(50)
      expect(body).not.toContain('Page Not Found')
      expect(body).not.toContain('Something went wrong')

      // Page-specific assertion guaranteeing unique component rendered
      if (routeAssertions[route]) {
        await expect(page.locator('body')).toContainText(routeAssertions[route])
      }
    }

    expect(errorLogs).toEqual([])
  })

  test('Pass 3: Re-crawl Customer Portal with authenticated Customer profile (Siddharth Varma)', async ({ page }) => {
    test.setTimeout(60000)
    // Authenticate as Customer
    await page.goto('/login')
    await page.waitForLoadState('domcontentloaded')
    const customerTab = page.locator('button:has-text("Customer")').first()
    if (await customerTab.isVisible()) {
      await customerTab.click()
    }
    await page.fill('input#email', 'customer@demo.com')
    await page.fill('input#password', 'password123')
    await page.click('button[type="submit"]:has-text("LOGIN")')
    await page.waitForURL(/.*\/portal/, { timeout: 15000 })

    const portalRoutes = allRoutes.filter((r) => r.startsWith('/portal'))
    for (const pRoute of portalRoutes) {
      await page.goto(pRoute)
      await page.waitForLoadState('domcontentloaded')
      // Ensure customer profile name Siddharth Varma is present across portal views
      await expect(page.locator('aside')).toContainText('Siddharth Varma')
      expect(await page.textContent('body')).not.toContain('Page Not Found')
      if (routeAssertions[pRoute]) {
        await expect(page.locator('body')).toContainText(routeAssertions[pRoute])
      }
    }
  })
})
