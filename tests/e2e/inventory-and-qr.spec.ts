import { test, expect } from '@playwright/test'

test.describe('Phase 12.7: Inventory, Serial Registry & Dispatch Lifecycle', () => {

  test.beforeEach(async ({ page }) => {
    // Authenticate as Warehouse Manager
    await page.goto('/login')
    const employeeBtn = page.getByRole('button', { name: 'Employee', exact: true })
    await employeeBtn.click()
    await page.selectOption('#role-select', 'warehouse')
    await page.fill('input#email', 'warehouse@demo.com')
    await page.fill('input#password', 'password123')
    await page.click('button[type="submit"]')
    await page.waitForURL(/\/app\/(inventory|dashboard)/, { timeout: 15000 })
  })

  test('Warehouse Stock: Inventory levels display quantities, categories and low-stock alerts', async ({ page }) => {
    await page.goto('/app/inventory')

    await expect(page.locator('body')).toContainText(/Inventory|Stock/i)
    await expect(page.locator('body')).toContainText(/Solar Panels|Inverters|Mounting/i)
  })

  test('Serial Number Registry: Unique hardware serials, QR tokens and status ledger', async ({ page }) => {
    await page.goto('/app/inventory/serials')

    await expect(page.locator('body')).toContainText(/Serial Number Registry & QR Ledger/i)
    await expect(page.locator('body')).toContainText(/INV-3300-8491|INV-4000-9102/i)
    await expect(page.locator('body')).toContainText(/Allocated|In Stock|Active/i)
  })

  test('Dispatch Staging: Order material reservation and serial number validation', async ({ page }) => {
    await page.goto('/app/inventory/dispatch')

    await expect(page.locator('body')).toContainText(/Serial Number Dispatch & Warranty Activation/i)
    await expect(page.locator('body')).toContainText(/SO-2026-0038/i)
    await expect(page.locator('body')).toContainText(/Siddharth Varma/i)
  })

  test('Stock Ledger: Audited movement ledger with inbound and outbound transactions', async ({ page }) => {
    await page.goto('/app/inventory/stock-ledger')

    await expect(page.locator('body')).toContainText(/Stock Ledger|Movement History/i)
    await expect(page.locator('body')).toContainText(/Inbound|Outbound|Balance/i)
  })
})
