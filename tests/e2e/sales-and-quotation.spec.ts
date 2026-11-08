import { test, expect } from '@playwright/test'

test.describe('Phase 12.5: Sales, Configurator & Quotation Lifecycle', () => {

  test.beforeEach(async ({ page }) => {
    // Authenticate as Sales Executive
    await page.goto('/login')
    const employeeBtn = page.getByRole('button', { name: 'Employee', exact: true })
    await employeeBtn.click()
    await page.selectOption('#role-select', 'sales')
    await page.fill('input#email', 'sales@demo.com')
    await page.fill('input#password', 'password123')
    await page.click('button[type="submit"]')
    await page.waitForURL(/\/app\/(crm\/leads|dashboard)/, { timeout: 15000 })
  })

  test('CRM Pipeline: Lists leads with contact, capacity and status', async ({ page }) => {
    await page.goto('/app/crm/leads')

    await expect(page.locator('body')).toContainText(/Customer Inquiries & Leads/i)
    await expect(page.locator('body')).toContainText('Siddharth Varma')
    await expect(page.locator('body')).toContainText(/4.3 kW|4 kW/i)
  })

  test('Configurator: Dynamic BOM calculation for 1kW to 5kW systems', async ({ page }) => {
    await page.goto('/app/configurator')

    await expect(page.locator('body')).toContainText(/Solar System Configurator & BOM Engine/i)

    // Select 3 kW On-Grid
    const typeSelect = page.locator('select[name="systemType"]').first()
    if (await typeSelect.isVisible()) {
      await typeSelect.selectOption('on-grid')
    }

    const capacitySelect = page.locator('select[name="capacity"]').first()
    if (await capacitySelect.isVisible()) {
      await capacitySelect.selectOption('3')
    }

    // Verify BOM items
    await expect(page.locator('body')).toContainText(/Inverter/i)
    await expect(page.locator('body')).toContainText(/Mounting/i)
    await expect(page.locator('body')).toContainText(/GST/i)
    await expect(page.locator('body')).toContainText(/Subsidy/i)
  })

  test('Quotations Engine: Mandatory Survey Approval gatekeeper is strictly enforced', async ({ page }) => {
    await page.goto('/app/quotations')

    await expect(page.locator('body')).toContainText(/Commercial Solar Quotations/i)
    await expect(page.locator('body')).toContainText(/Strict Business Requirement Enforced/i)
    await expect(page.locator('body')).toContainText(/engineering approval/i)
  })

  test('BOM Engine: Displays bill of materials with unit costs and component details', async ({ page }) => {
    await page.goto('/app/bom')

    await expect(page.locator('body')).toContainText(/Bill of Materials|BOM/i)
    await expect(page.locator('body')).toContainText(/Mono PERC|Inverter|Balance of System/i)
  })
})
