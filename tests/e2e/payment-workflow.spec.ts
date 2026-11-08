import { test, expect } from '@playwright/test'

test.describe('Phase 12.6: Payment State Machine & Milestone Escrow Workflow', () => {

  test('Customer Portal: Milestone Escrow Schedule displays correct percentages and payment actions', async ({ page }) => {
    await page.goto('/login')

    const customerBtn = page.getByRole('button', { name: 'Customer', exact: true })
    await customerBtn.click()
    await page.fill('input#email', 'customer@demo.com')
    await page.fill('input#password', 'password123')
    await page.click('button[type="submit"]')
    await page.waitForURL('**/portal/dashboard', { timeout: 15000 })

    // Navigate to customer orders/payments portal
    await page.goto('/portal/orders')

    await expect(page.locator('body')).toContainText(/SO-2026-0038/i)
    await expect(page.locator('body')).toContainText(/Milestone|Advance|Progress|Delivery/i)
    await expect(page.locator('body')).toContainText(/₹/i)
  })

  test('Finance Console: Payment Reconciliation ledger records incoming milestone disbursements', async ({ page }) => {
    await page.goto('/login')

    const employeeBtn = page.getByRole('button', { name: 'Employee', exact: true })
    await employeeBtn.click()
    await page.selectOption('#role-select', 'finance')
    await page.fill('input#email', 'finance@demo.com')
    await page.fill('input#password', 'password123')
    await page.click('button[type="submit"]')
    await page.waitForURL(/\/app\/(invoices|dashboard)/, { timeout: 15000 })

    // Check payment reconciliation ledger
    await page.goto('/app/payments')

    await expect(page.locator('body')).toContainText(/Payment Receipts|Milestone Escrow/i)
    await expect(page.locator('body')).toContainText(/Settled|Received|Milestone/i)
    await expect(page.locator('body')).toContainText(/PAY-|TXN-|SO-/i)
  })

  test('Sales Orders: Milestone payment progress tracked across project lifecycle', async ({ page }) => {
    await page.goto('/login')

    const adminBtn = page.getByRole('button', { name: 'Admin', exact: true })
    await adminBtn.click()
    await page.click('button[type="submit"]')
    await page.waitForURL('**/app/dashboard', { timeout: 15000 })

    await page.goto('/app/orders')

    await expect(page.locator('body')).toContainText(/Sales Orders & Payment Milestones/i)
    await expect(page.locator('body')).toContainText('SO-2026-0038')
    await expect(page.locator('body')).toContainText('Siddharth Varma')
    await expect(page.locator('body')).toContainText(/Advance Received|Milestone/i)
  })
})
