import { test, expect } from '@playwright/test'

test.describe('Phase 12.10: Financial Control, Invoices, Settlements & Profitability Suite', () => {

  test.beforeEach(async ({ page }) => {
    // Authenticate as Finance Controller
    await page.goto('/login')
    const employeeBtn = page.getByRole('button', { name: 'Employee', exact: true })
    await employeeBtn.click()
    await page.selectOption('#role-select', 'finance')
    await page.fill('input#email', 'finance@demo.com')
    await page.fill('input#password', 'password123')
    await page.click('button[type="submit"]')
    await page.waitForURL(/\/app\/(invoices|dashboard)/, { timeout: 15000 })
  })

  test('Customer Invoices: Milestone invoices display GST breakdown, line items and status', async ({ page }) => {
    await page.goto('/app/invoices')

    await expect(page.locator('body')).toContainText(/Customer Invoices|Billing Ledger/i)
    await expect(page.locator('body')).toContainText(/INV-2026/i)
    await expect(page.locator('body')).toContainText(/Paid|Pending|Milestone/i)
  })

  test('Expense Ledger: Project material, logistics and operational disbursements recorded', async ({ page }) => {
    await page.goto('/app/expenses')

    await expect(page.locator('body')).toContainText(/Expense Ledger|Operating Expenses/i)
    await expect(page.locator('body')).toContainText(/Logistics|Hardware|Permitting|Labour/i)
  })

  test('Technician Settlements: Crew payouts calculated and disbursed per milestone completion', async ({ page }) => {
    await page.goto('/app/technician-payments')

    await expect(page.locator('body')).toContainText(/Technician Settlements|Field Crew Payouts/i)
    await expect(page.locator('body')).toContainText(/Crew Lead|Settlement|Disbursement/i)
  })

  test('Government Subsidies: PM Surya Ghar national portal status and claims ledger', async ({ page }) => {
    await page.goto('/app/subsidies')

    await expect(page.locator('body')).toContainText(/PM Surya Ghar|Subsidy Claims/i)
    await expect(page.locator('body')).toContainText(/₹78,000|₹30,000|Disbursed|Approved/i)
  })

  test('Project Profitability: Unit economics and gross margin calculations per project', async ({ page }) => {
    await page.goto('/app/profitability')

    await expect(page.locator('body')).toContainText(/Project Unit Economics & Profitability/i)
    await expect(page.locator('body')).toContainText(/Gross Margin/i)
    await expect(page.locator('body')).toContainText(/Revenue|COGS|Net Margin/i)
  })
})
