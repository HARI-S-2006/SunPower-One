import { test, expect } from '@playwright/test'

test.describe('Phase 12.8: Installation Workflow, Field Checklist & Warranty Activation', () => {

  test('ERP Operations: Installation Projects roster tracks active crews and milestones', async ({ page }) => {
    await page.goto('/login')
    const adminBtn = page.getByRole('button', { name: 'Admin', exact: true })
    await adminBtn.click()
    await page.click('button[type="submit"]')
    await page.waitForURL('**/app/dashboard', { timeout: 15000 })

    await page.goto('/app/installations')

    await expect(page.locator('body')).toContainText(/Solar Installation Management/i)
    await expect(page.locator('body')).toContainText(/Siddharth Varma|Vikramaditya Rao/i)
    await expect(page.locator('body')).toContainText(/Structure|Wiring|Testing|Commissioning/i)
  })

  test('Technician Mobile Experience: Field Job details and 5-Point Safety Inspection Checklist', async ({ page }) => {
    await page.goto('/technician/checklist/inst-01')

    await expect(page.locator('body')).toContainText(/Commissioning Inspection/i)
    await expect(page.locator('body')).toContainText(/5-Point Safety Inspection/i)
    await expect(page.locator('body')).toContainText(/Mounting Structure Torque Verified/i)
    await expect(page.locator('body')).toContainText(/Isolation Resistance Megger Test Passed/i)
    await expect(page.locator('body')).toContainText(/Earthing Resistance/i)
  })

  test('Technician Mobile Experience: Handover, Photo Upload and Customer Digital Signature Pad', async ({ page }) => {
    await page.goto('/technician/completion/inst-01')

    await expect(page.locator('body')).toContainText(/Customer Handover & Signature/i)
    await expect(page.locator('body')).toContainText(/Customer Signature Pad/i)
    
    // Canvas signature pad should exist
    const canvas = page.locator('canvas')
    await expect(canvas).toBeVisible()
  })

  test('Warranty Activation: Completed installations activate official digital warranty certificates', async ({ page }) => {
    await page.goto('/app/warranties')

    await expect(page.locator('body')).toContainText(/Warranty Management & Digital Certificates/i)
    await expect(page.locator('body')).toContainText('WAR-INV-2025-019')
    await expect(page.locator('body')).toContainText(/Solar Modules|Inverters/i)
  })
})

