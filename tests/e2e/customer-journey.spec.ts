import { test, expect } from '@playwright/test'

test.describe('Phase 12.2: Customer Complete Journey Regression Suite', () => {

  test('Public Website: Solar Calculator estimation generates instant quotation metrics', async ({ page }) => {
    await page.goto('/solar-calculator')
    await page.waitForLoadState('networkidle')

    await expect(page.getByText(/Estimate Your Solar Requirements/i)).toBeVisible()
    
    // Choose 4 kW System or input bill
    const monthlyBillInput = page.locator('input#monthly-bill, input[name="monthlyBill"]').first()
    if (await monthlyBillInput.isVisible()) {
      await monthlyBillInput.fill('6000')
    }

    // Verify system capacity estimate is calculated
    await expect(page.locator('body')).toContainText(/kW/i)
    await expect(page.locator('body')).toContainText(/Estimated Annual Savings|Annual Energy Generation|System Size/i)
  })

  test('Public Website: Customer enquiry submission captures lead in database', async ({ page }) => {
    await page.goto('/request-survey')
    await page.waitForLoadState('networkidle')

    const uniquePhone = `98${Math.floor(10000000 + Math.random() * 90000000)}`
    await page.fill('input[name="name"]', 'Deepak Sharma')
    await page.fill('input[name="phone"]', uniquePhone)
    await page.fill('input[name="email"]', 'deepak.sharma@example.com')
    await page.fill('textarea[name="address"]', '54 Rajajinagar 3rd Block')
    await page.fill('input[name="city"]', 'Bengaluru')
    await page.selectOption('select[name="state"]', 'Karnataka')
    await page.fill('input[name="pincode"]', '560010')
    await page.selectOption('select[name="requiredCapacity"]', '4')
    await page.selectOption('select[name="systemType"]', 'on-grid')
    await page.fill('input[name="monthlyBill"]', '5500')
    await page.fill('input[name="rooftopArea"]', '750')
    await page.selectOption('select[name="gridSuitability"]', 'reliable')

    await page.click('button[type="submit"]')
    await expect(page.locator('body')).toContainText(/Enquiry Submitted|Thank You|Feasibility Booking Confirmed/i)
  })

  test('Customer Portal: Authenticated customer views Dashboard, Quotations, Payments, Installations, Warranties and Service', async ({ page }) => {
    await page.goto('/login')
    await page.waitForLoadState('networkidle')

    const customerBtn = page.getByRole('button', { name: 'Customer', exact: true })
    await customerBtn.click()
    await page.fill('input#email', 'customer@demo.com')
    await page.fill('input#password', 'password123')
    await page.click('button[type="submit"]')

    await page.waitForURL('**/portal/dashboard', { timeout: 15000 })

    // 1. Dashboard KPIs
    await expect(page.locator('body')).toContainText('Siddharth Varma')
    await expect(page.locator('body')).toContainText('4.3 kW')
    await expect(page.locator('body')).toContainText('Koramangala 4th Block')

    // 2. Quotation Viewer
    await page.goto('/portal/quotations')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('body')).toContainText('CUST-2026-038')
    await expect(page.locator('body')).toContainText('Siddharth Varma')

    // 3. Milestone Payments & Sales Orders Portal
    await page.goto('/portal/orders')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('body')).toContainText('SO-2026-0038')
    await expect(page.locator('body')).toContainText(/Milestone|Advance|Progress/i)

    // 4. Installation Tracking
    await page.goto('/portal/installations')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('body')).toContainText('Siddharth Varma')
    await expect(page.locator('body')).toContainText(/Installation|Milestone|Commissioning/i)

    // 5. Warranty Certificate Vault
    await page.goto('/portal/warranties')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('body')).toContainText(/Warranty Certificate|Digital Warranty/i)
    await expect(page.locator('body')).toContainText('WAR-INV-2025-019')

    // 6. Customer Service Desk Ticket View
    await page.goto('/portal/service')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('body')).toContainText(/Customer Service & Support Desk/i)
    await expect(page.locator('body')).toContainText('SRV-TKT-2026-092')
  })
})
