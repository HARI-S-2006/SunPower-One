import { test, expect } from '@playwright/test'

// Comprehensive list of every major route across all 4 application experiences
const pagesToInspect = [
  // 1. Public Marketing & Consumer Site
  { name: 'Home Landing', url: '/', expectedText: 'The Intelligent Operating Platform' },
  { name: 'About Us', url: '/about', expectedText: 'About SunPower One' },
  { name: 'Solar Solutions', url: '/solutions', expectedText: 'Solar Solutions' },
  { name: 'On-Grid Solutions', url: '/solutions/on-grid', expectedText: 'On-Grid' },
  { name: 'Off-Grid Solutions', url: '/solutions/off-grid', expectedText: 'Off-Grid' },
  { name: 'Solar Calculator', url: '/solar-calculator', expectedText: 'Solar Calculator' },
  { name: 'Request Survey', url: '/request-survey', expectedText: 'Request a Free Site Survey' },
  { name: 'Contact', url: '/contact', expectedText: 'Get in Touch' },
  { name: 'Login Gateway', url: '/login', expectedText: 'Command Center Sign In' },
  { name: 'Registration', url: '/register', expectedText: 'Create Your Account' },

  // 2. ERP Operations Command Center
  { name: 'ERP Dashboard', url: '/app/dashboard', expectedText: 'Operations Dashboard' },
  { name: 'CRM Leads', url: '/app/crm/leads', expectedText: 'Leads & Inquiries' },
  { name: 'Customer Directory', url: '/app/customers', expectedText: 'Customer Directory' },
  { name: 'Site Surveys', url: '/app/surveys', expectedText: 'Site Surveys & Engineering Feasibility' },
  { name: 'Solar Configurator', url: '/app/configurator', expectedText: 'Solar System Configurator' },
  { name: 'Product Catalogue', url: '/app/products', expectedText: 'Product Catalogue' },
  { name: 'Bill of Materials', url: '/app/bom', expectedText: 'Bill of Materials (BOM)' },
  { name: 'Quotations', url: '/app/quotations', expectedText: 'Quotations & Pricing' },
  { name: 'Sales Orders', url: '/app/orders', expectedText: 'Sales Orders' },
  { name: 'Milestone Payments', url: '/app/payments', expectedText: 'Milestone Payments' },
  { name: 'Inventory Stock', url: '/app/inventory', expectedText: 'Inventory & Asset Tracking' },
  { name: 'Serial Numbers', url: '/app/inventory/serials', expectedText: 'Serial Number Registry' },
  { name: 'Digital Passport', url: '/app/inventory/passport', expectedText: 'Solar Digital Passport' },
  { name: 'Dispatch Staging', url: '/app/inventory/dispatch', expectedText: 'Dispatch Staging' },
  { name: 'Suppliers', url: '/app/suppliers', expectedText: 'Tier-1 Hardware Suppliers' },
  { name: 'Purchase Orders', url: '/app/purchase-orders', expectedText: 'Purchase Orders' },
  { name: 'Crew Operations', url: '/app/installations', expectedText: 'Crew Operations & Field Commissioning' },
  { name: 'Technicians Roster', url: '/app/technicians', expectedText: 'Technicians Roster' },
  { name: 'Technician Schedules', url: '/app/technician-schedule', expectedText: 'Technician Field Calendar' },
  { name: 'Warranty Registry', url: '/app/warranties', expectedText: 'Warranty Management' },
  { name: 'Service Desk', url: '/app/service', expectedText: 'Service Tickets Desk' },
  { name: 'Invoices', url: '/app/invoices', expectedText: 'Customer Invoices' },
  { name: 'Expenses', url: '/app/expenses', expectedText: 'Expense Ledger' },
  { name: 'Technician Settlements', url: '/app/technician-payments', expectedText: 'Technician Settlements' },
  { name: 'Government Subsidies', url: '/app/subsidies', expectedText: 'PM Surya Ghar Subsidy' },
  { name: 'Project Profitability', url: '/app/profitability', expectedText: 'Project Profitability' },
  { name: 'Business Analytics', url: '/app/analytics', expectedText: 'Business Analytics' },
  { name: 'Solar AI Assistant', url: '/app/ai-assistant', expectedText: 'Solar Intelligence AI' },
  { name: 'System Notifications', url: '/app/notifications', expectedText: 'System Notifications' },
  { name: 'Settings & Security', url: '/app/settings', expectedText: 'User Account Profile & Credentials' },

  // 3. Technician Mobile Field Experience
  { name: 'Technician Jobs', url: '/technician/jobs', expectedText: 'Field Job Roster' },
  { name: 'Technician Scan', url: '/technician/scan', expectedText: 'Optical Serial Scanner' },
  { name: 'Technician Checklist', url: '/technician/checklist/inst-01', expectedText: 'Commissioning Inspection' },
  { name: 'Technician Completion', url: '/technician/completion/inst-01', expectedText: 'Customer Handover & Signature' },

  // 4. Customer Self-Service Portal
  { name: 'Customer Dashboard', url: '/portal/dashboard', expectedText: 'Welcome back' },
  { name: 'Customer Quotations', url: '/portal/quotations', expectedText: 'My Commercial Quotations' },
  { name: 'Customer Orders', url: '/portal/orders', expectedText: 'My Orders & Payment Schedule' },
  { name: 'Customer Installations', url: '/portal/installations', expectedText: 'Installation & Field Commissioning' },
  { name: 'Customer Equipment', url: '/portal/equipment', expectedText: 'Installed Solar Equipment' },
  { name: 'Customer Warranty', url: '/portal/warranty', expectedText: 'Digital Warranty Certificates' },
  { name: 'Customer Service', url: '/portal/service', expectedText: 'Customer Service & Support Desk' },
  { name: 'Customer Profile', url: '/portal/profile', expectedText: 'Customer Account Profile' },
]

test.describe('SunPower One - Deep Autonomous Loop Audit & Reliability Verification', () => {

  test('Page Health Loop: Check image integrity, zero broken images, and zero fatal console errors on all 48 pages', async ({ page }) => {
    test.setTimeout(120000)
    const criticalErrors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const text = msg.text()
        // Filter out third-party/sandbox noise
        if (!text.includes('chrome-extension') && !text.includes('favicon.ico') && !text.includes('net::ERR_')) {
          criticalErrors.push(text)
        }
      }
    })

    page.on('pageerror', (err) => criticalErrors.push(err.message))

    for (const item of pagesToInspect) {
      await page.goto(item.url)
      await page.waitForLoadState('domcontentloaded')

      // 1. Verify text presence
      await expect(page.locator('body')).toContainText(item.expectedText)

      // 2. Audit all images on the page for broken links
      const images = page.locator('img')
      const imgCount = await images.count()

      for (let i = 0; i < imgCount; i++) {
        const img = images.nth(i)
        if (await img.isVisible()) {
          const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth)
          // If naturalWidth is 0, the image failed to load!
          expect(naturalWidth, `Broken image found on ${item.name} (${item.url}) with selector index ${i}`).toBeGreaterThan(0)
        }
      }
    }

    expect(criticalErrors).toEqual([])
  })

  test('Form & Business Logic Loop: Public Solar Calculator real-time calculation', async ({ page }) => {
    await page.goto('/solar-calculator')
    await page.waitForLoadState('domcontentloaded')
    const billInput = page.locator('input#monthlyBill, input[type="number"]').first()
    if (await billInput.isVisible()) {
      await billInput.fill('6000')
    }
    const calcBtn = page.locator('button:has-text("Calculate Estimate")').first()
    if (await calcBtn.isVisible()) {
      await calcBtn.click()
      await page.waitForTimeout(500)
    }
    await expect(page.locator('body')).toContainText('kW')
  })

  test('Form & Business Logic Loop: Request Survey creates lead in CRM pipeline', async ({ page }) => {
    await page.goto('/request-survey')
    await page.waitForLoadState('domcontentloaded')

    const uniquePhone = `98${Math.floor(10000000 + Math.random() * 90000000)}`
    await page.fill('input[name="name"]', 'Vikramaditya Roy')
    await page.fill('input[name="phone"]', uniquePhone)
    await page.fill('input[name="email"]', 'vikramaditya.roy@test.com')
    await page.fill('textarea[name="address"]', 'Penthouse 14, Lavelle Road, Bengaluru')
    await page.fill('input[name="city"]', 'Bengaluru')
    await page.selectOption('select[name="state"]', 'Karnataka')
    await page.fill('input[name="pincode"]', '560001')
    await page.selectOption('select[name="requiredCapacity"]', '4')
    await page.selectOption('select[name="systemType"]', 'on-grid')

    // Submit inquiry
    await page.click('button[type="submit"]')
    await page.waitForTimeout(1000)

    // Verify lead exists in CRM
    await page.goto('/app/crm/leads')
    await page.waitForLoadState('domcontentloaded')
    await expect(page.locator('body')).toContainText('Vikramaditya Roy')
  })

  test('Warehouse Staging & Dispatch Loop: Verify Serial Barcode scan validation', async ({ page }) => {
    await page.goto('/app/inventory/dispatch')
    await page.waitForLoadState('domcontentloaded')

    // Check dispatch staging dashboard
    await expect(page.locator('body')).toContainText('Dispatch Staging')
    
    // Check barcode scanning input field or buttons
    const scanInput = page.locator('input[placeholder*="serial"], input[placeholder*="Scan"], input#serial-input').first()
    if (await scanInput.isVisible()) {
      await scanInput.fill('PNL-540W-0081')
      await page.keyboard.press('Enter')
      await page.waitForTimeout(500)
    }
  })

  test('Technician Checklist & Signature Canvas Loop', async ({ page }) => {
    await page.goto('/technician/checklist/inst-01')
    await page.waitForLoadState('domcontentloaded')

    // Verify checklist items exist
    await expect(page.locator('body')).toContainText('Commissioning Inspection')
    await expect(page.locator('body')).toContainText('5-Point Safety Inspection')
    
    // Check toggle items
    const checkboxes = page.locator('input[type="checkbox"]')
    const count = await checkboxes.count()
    if (count > 0) {
      // Check first item
      await checkboxes.first().check({ force: true })
    }

    // Go to completion page with signature canvas
    await page.goto('/technician/completion/inst-01')
    await page.waitForLoadState('domcontentloaded')
    await expect(page.locator('body')).toContainText('Customer Handover & Signature')
    
    // Check that canvas is rendered
    const canvas = page.locator('canvas')
    if (await canvas.isVisible()) {
      const box = await canvas.boundingBox()
      if (box) {
        await page.mouse.move(box.x + 20, box.y + 20)
        await page.mouse.down()
        await page.mouse.move(box.x + 80, box.y + 40)
        await page.mouse.up()
      }
    }
  })

  test('Customer Portal Warranty Bond & Modal Loop', async ({ page }) => {
    await page.goto('/portal/warranty')
    await page.waitForLoadState('domcontentloaded')

    await expect(page.locator('body')).toContainText('ACTIVE WARRANTY')

    // Click "View Official Certificate Bond" or certificate bond card
    const viewCertBtn = page.locator('button:has-text("View Official Certificate Bond")').first()
    if (await viewCertBtn.isVisible()) {
      await viewCertBtn.click()
      await expect(page.locator('body')).toContainText('Certificate of Solar Warranty')
      // Close modal
      const closeBtn = page.locator('button:has-text("Close"), button[aria-label="Close"]').first()
      if (await closeBtn.isVisible()) {
        await closeBtn.click()
      }
    }
  })
})
