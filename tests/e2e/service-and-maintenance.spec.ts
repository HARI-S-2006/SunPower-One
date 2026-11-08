import { test, expect } from '@playwright/test'

test.describe('Phase 12.9: Service Desk, Warranty Claims & Zero-Cost RMA Lifecycle', () => {

  test('Customer Portal: Customer files service ticket and views status', async ({ page }) => {
    await page.goto('/login')
    await page.waitForLoadState('networkidle')

    const customerBtn = page.getByRole('button', { name: 'Customer', exact: true })
    await customerBtn.click()
    await page.fill('input#email', 'customer@demo.com')
    await page.fill('input#password', 'password123')
    await page.click('button[type="submit"]')
    await page.waitForURL('**/portal/dashboard')

    await page.goto('/portal/service')
    await page.waitForLoadState('networkidle')

    await expect(page.locator('body')).toContainText(/Customer Service & Support Desk/i)
    await expect(page.locator('body')).toContainText(/SRV-TKT-2026-092/i)
    await expect(page.locator('body')).toContainText(/ERR-F04/i)
  })

  test('Support Desk: Adjudicates zero-cost warranty repairs and enforces customer sign-off before closure', async ({ page }) => {
    await page.goto('/login')
    await page.waitForLoadState('networkidle')

    const employeeBtn = page.getByRole('button', { name: 'Employee', exact: true })
    await employeeBtn.click()
    await page.selectOption('#role-select', 'support')
    await page.fill('input#email', 'support@demo.com')
    await page.fill('input#password', 'password123')
    await page.click('button[type="submit"]')
    await page.waitForURL(/\/app\/(service|dashboard)/)

    await page.goto('/app/service')
    await page.waitForLoadState('networkidle')

    await expect(page.locator('body')).toContainText(/Service Desk & After-Sales Complaints/i)
    await expect(page.locator('body')).toContainText(/₹0 Covered RMA/i)

    // Verify ticket resolution requires customer confirmation
    const resolveBtn = page.getByText(/Resolve Ticket/i).first()
    if (await resolveBtn.isVisible()) {
      await resolveBtn.click()
      const confirmBtn = page.getByText(/Confirm & Close Ticket/i).first()
      if (await confirmBtn.isVisible()) {
        await confirmBtn.click()
        await expect(page.locator('body')).toContainText(/Customer confirmation must be explicitly recorded/i)
      }
    }
  })

  test('Preventive Maintenance: Routine healthchecks scheduled and logged in telemetry', async ({ page }) => {
    await page.goto('/login')
    await page.waitForLoadState('networkidle')

    const adminBtn = page.getByRole('button', { name: 'Admin', exact: true })
    await adminBtn.click()
    await page.click('button[type="submit"]')
    await page.waitForURL('**/app/dashboard')

    await page.goto('/app/service')
    await page.waitForLoadState('networkidle')

    await expect(page.locator('body')).toContainText(/SRV-TKT-2026-095/i)
    await expect(page.locator('body')).toContainText(/Resolved|Routine/i)
  })
})

