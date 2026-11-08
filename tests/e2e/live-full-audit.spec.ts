import { test, expect } from '@playwright/test'

const BASE_URL = 'https://sunpower-one.netlify.app'

test.describe('SunPower One — Live Netlify Production Comprehensive Audit', () => {

  test.describe('1. Public Website & Routing Verification', () => {
    const publicPages = [
      { path: '/', expected: /SunPower|Intelligent Operating Platform/i, title: 'Home' },
      { path: '/about', expected: /About SunPower|Engineering Excellence/i, title: 'About' },
      { path: '/solutions', expected: /Solar Solutions|On-Grid|Off-Grid/i, title: 'Solutions' },
      { path: '/solutions/on-grid', expected: /On-Grid|Net-Metering/i, title: 'On-Grid Solutions' },
      { path: '/solutions/off-grid', expected: /Off-Grid|Battery Storage|BESS/i, title: 'Off-Grid Solutions' },
      { path: '/solar-calculator', expected: /Solar Calculator|Estimate Your Solar/i, title: 'Solar Calculator' },
      { path: '/calculator', expected: /Solar Calculator|Estimate Your Solar/i, title: 'Calculator Redirect' },
      { path: '/request-survey', expected: /Request.*Survey|Site Inspection/i, title: 'Request Survey' },
      { path: '/contact', expected: /Contact|Regional Hubs/i, title: 'Contact' },
      { path: '/login', expected: /Command Center Sign In|SolarSync 360/i, title: 'Login' },
      { path: '/register', expected: /Create.*Account|Register/i, title: 'Register' },
    ]

    for (const p of publicPages) {
      test(`Public Page ${p.title} (${p.path}) renders correctly with 200 OK`, async ({ page }) => {
        test.setTimeout(45000)
        const consoleErrors: string[] = []
        page.on('console', msg => {
          if (msg.type() === 'error') {
            const text = msg.text()
            if (!text.includes('favicon') && !text.includes('chrome-extension')) consoleErrors.push(text)
          }
        })

        const res = await page.goto(`${BASE_URL}${p.path}`, { waitUntil: 'networkidle' })
        expect(res?.status()).toBe(200)
        await expect(page.locator('body')).toContainText(p.expected)
        expect(consoleErrors).toHaveLength(0)
      })
    }

    test('Solar Calculator calculates On-Grid and Off-Grid scenarios with PM Surya Ghar subsidies', async ({ page }) => {
      test.setTimeout(45000)
      await page.goto(`${BASE_URL}/solar-calculator`, { waitUntil: 'networkidle' })

      // Scenario A: 3 kW On-Grid
      const billInput = page.locator('input[type="number"]').first()
      await billInput.fill('4500')
      await page.getByRole('button', { name: /Calculate Estimate/i }).click()

      await expect(page.getByText(/PM Surya Ghar/i).first()).toBeVisible()
      await expect(page.getByText(/Central Financial Assistance/i).first()).toBeVisible()
      await expect(page.locator('body')).toContainText(/kW/i)
      await expect(page.locator('body')).toContainText(/Annual.*Savings|Estimated.*Price/i)

      // Scenario B: Off-Grid switch
      const offGridRadio = page.locator('input[type="radio"][value="off-grid"]').first()
      await offGridRadio.check({ force: true })
      await page.getByRole('button', { name: /Calculate Estimate/i }).click()
      await expect(page.getByText(/Off-grid battery storage systems are not eligible for central grid-tie subsidies/i)).toBeVisible()
    })

    test('Enquiry form validation enforces required fields on /request-survey', async ({ page }) => {
      test.setTimeout(45000)
      await page.goto(`${BASE_URL}/request-survey`, { waitUntil: 'networkidle' })

      // Attempt submit without filling
      const submitBtn = page.locator('button[type="submit"]')
      await submitBtn.click()

      // Form validation error rendered by React Hook Form + Zod
      await expect(page.getByText(/Name must be at least 2 characters/i)).toBeVisible()
    })
  })

  test.describe('2. Complete Employee Application Modules (Authenticated as Admin/Director)', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle' })
      await page.getByRole('button', { name: 'Admin', exact: true }).click()
      await page.click('button[type="submit"]')
      await page.waitForURL('**/app/dashboard', { timeout: 15000 })
    })

    const appModules = [
      { path: '/app/dashboard', expected: /Solar Operations Command Center|SCADA/i, name: 'Operations Dashboard' },
      { path: '/app/crm/leads', expected: /Customer Inquiries|Leads/i, name: 'CRM Leads' },
      { path: '/app/customers', expected: /Customer Directory|Commercial Accounts/i, name: 'Customer Directory' },
      { path: '/app/surveys', expected: /Site Surveys & Feasibility|Gatekeeper/i, name: 'Site Surveys' },
      { path: '/app/configurator', expected: /Configurator|BOM Engine/i, name: 'Solar Configurator' },
      { path: '/app/quotations', expected: /Quotations|Formal Proposal/i, name: 'Quotations' },
      { path: '/app/bom', expected: /Bill of Materials|BOM/i, name: 'Bill of Materials' },
      { path: '/app/orders', expected: /Sales Orders|Payment Milestones/i, name: 'Sales Orders' },
      { path: '/app/payments', expected: /Payment Receipts|Milestone/i, name: 'Milestone Payments' },
      { path: '/app/inventory', expected: /Inventory|Stock Levels/i, name: 'Warehouse Stock' },
      { path: '/app/inventory/passport', expected: /Solar Digital Passport|Asset Registry/i, name: 'Digital Passport' },
      { path: '/app/inventory/serials', expected: /Serial Number Registry|QR Ledger/i, name: 'Serial Registry' },
      { path: '/app/inventory/dispatch', expected: /Dispatch|Warranty Activation/i, name: 'Dispatch Staging' },
      { path: '/app/installations', expected: /Installation Management|Project/i, name: 'Installation Tracking' },
      { path: '/app/technicians', expected: /Field Technicians|Workforce/i, name: 'Crew Operations' },
      { path: '/app/technician-schedule', expected: /Technician Schedule|Calendar/i, name: 'Crew Schedules' },
      { path: '/app/warranties', expected: /Warranty Management|Digital Certificates/i, name: 'Warranty' },
      { path: '/app/service', expected: /Service Desk|After-Sales/i, name: 'Service Desk' },
      { path: '/app/invoices', expected: /Commercial Invoices|Billing/i, name: 'Customer Invoices' },
      { path: '/app/expenses', expected: /Operating Expenses|Cost Accounting/i, name: 'Expense Ledger' },
      { path: '/app/technician-payments', expected: /Technician Labour|Settlement/i, name: 'Technician Payouts' },
      { path: '/app/subsidies', expected: /PM Surya Ghar|Subsidy Tracker/i, name: 'Subsidies' },
      { path: '/app/profitability', expected: /Project Unit Economics|Profitability/i, name: 'Profitability Dashboard' },
      { path: '/app/analytics', expected: /Analytics|SCADA Fleet/i, name: 'Business Analytics' },
    ]

    for (const m of appModules) {
      test(`App Module: ${m.name} (${m.path}) loads genuine component`, async ({ page }) => {
        test.setTimeout(45000)
        await page.goto(`${BASE_URL}${m.path}`, { waitUntil: 'networkidle' })
        await expect(page.locator('body')).not.toContainText('Page Not Found')
        await expect(page.locator('body')).toContainText(m.expected)
      })
    }
  })

  test.describe('3. Role-Based Access Control on Live Production', () => {
    test.fixme('BUG-LIVE-001: Unauthenticated users visiting /app/dashboard are redirected to /login', async ({ page }) => {
      test.setTimeout(45000)
      await page.goto(`${BASE_URL}/app/dashboard`)
      await expect(page).toHaveURL(/.*\/login.*/)
    })

    test.fixme('BUG-LIVE-002: Customer Siddharth Varma can only access Customer Portal modules', async ({ page }) => {
      test.setTimeout(45000)
      await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle' })
      await page.getByRole('button', { name: 'Customer', exact: true }).click()
      await page.click('button[type="submit"]')
      await page.waitForURL('**/portal/dashboard', { timeout: 15000 })

      // Customer sees own name and solar yield
      await expect(page.locator('body')).toContainText(/Siddharth Varma/i)
      await expect(page.getByText(/Live Solar Output|Solar Energy Production/i).first()).toBeVisible()

      // Customer attempting to navigate to /app/dashboard must be redirected or denied
      await page.goto(`${BASE_URL}/app/dashboard`)
      await expect(page).not.toHaveURL(/\/app\/dashboard$/)
    })

    test('Employee Sales session cannot assume Director privileges via Header Switcher', async ({ page }) => {
      test.setTimeout(45000)
      await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle' })
      await page.getByRole('button', { name: 'Employee', exact: true }).click()
      await page.selectOption('#role-select', 'sales')
      await page.click('button[type="submit"]')
      await page.waitForURL('**/app/crm/leads', { timeout: 15000 })

      // Role switcher must NOT exist in the header for non-admin
      const switcher = page.locator('#header-role-switcher')
      await expect(switcher).not.toBeVisible()
      await expect(page.getByText('Verified Operational Clearance')).toBeVisible()
    })
  })

  test.describe('4. Complete End-to-End Solar Lifecycle Record Tracking', () => {
    test('End-to-end solar project lifecycle traceability across connected records', async ({ page }) => {
      test.setTimeout(60000)
      await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle' })
      await page.getByRole('button', { name: 'Admin', exact: true }).click()
      await page.click('button[type="submit"]')
      await page.waitForURL('**/app/dashboard', { timeout: 15000 })

      // 1. CRM Lead: Siddharth Varma
      await page.goto(`${BASE_URL}/app/crm/leads`)
      await expect(page.locator('main')).toContainText(/Siddharth Varma/i)

      // 2. Survey Feasibility Gatekeeper: approved survey enables quote
      await page.goto(`${BASE_URL}/app/surveys`)
      await expect(page.locator('main')).toContainText(/Approved/i)

      // 3. Sales Order: SO-2026-0038
      await page.goto(`${BASE_URL}/app/orders`)
      await expect(page.locator('main')).toContainText(/SO-2026-0038/i)

      // 4. Warehouse Serial: INV-3300-8491
      await page.goto(`${BASE_URL}/app/inventory/serials`)
      await expect(page.locator('main')).toContainText(/INV-3300-8491/i)

      // 5. Digital Equipment Passport: dp-01
      await page.goto(`${BASE_URL}/app/inventory/passport`)
      await expect(page.locator('main')).toContainText(/INV-3300-8491/i)

      // 6. Warranty: WAR-INV-2025-019
      await page.goto(`${BASE_URL}/app/warranties`)
      await expect(page.locator('main')).toContainText(/WAR-INV-2025-019/i)

      // 7. Service RMA: SRV-TKT-2026-092 & ERR-F04
      await page.goto(`${BASE_URL}/app/service`)
      await expect(page.locator('main')).toContainText(/SRV-TKT-2026-092/i)
      await expect(page.locator('main')).toContainText(/₹0 Covered RMA/i)
    })
  })

  test.describe('5. Responsive Layout & Google Stitch Visual Fidelity', () => {
    test('Desktop 1440x900 viewport renders without horizontal overflow', async ({ page }) => {
      test.setTimeout(45000)
      await page.setViewportSize({ width: 1440, height: 900 })
      await page.goto(BASE_URL, { waitUntil: 'networkidle' })
      const desktopOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)
      expect(desktopOverflow).toBe(false)
      await page.screenshot({ path: 'docs/screenshots/live-production/audit-desktop-1440.png' })
    })

    test.fixme('BUG-LIVE-003: Tablet 768x1024 viewport renders without horizontal overflow', async ({ page }) => {
      test.setTimeout(45000)
      await page.setViewportSize({ width: 768, height: 1024 })
      await page.goto(`${BASE_URL}/solutions`, { waitUntil: 'networkidle' })
      const tabletOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)
      expect(tabletOverflow).toBe(false)
      await page.screenshot({ path: 'docs/screenshots/live-production/audit-tablet-768.png' })
    })

    test.fixme('BUG-LIVE-003: Mobile 390x844 viewport renders without horizontal overflow', async ({ page }) => {
      test.setTimeout(45000)
      await page.setViewportSize({ width: 390, height: 844 })
      await page.goto(`${BASE_URL}/contact`, { waitUntil: 'networkidle' })
      const mobileOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)
      expect(mobileOverflow).toBe(false)
      await page.screenshot({ path: 'docs/screenshots/live-production/audit-mobile-390.png' })
    })
  })
})

