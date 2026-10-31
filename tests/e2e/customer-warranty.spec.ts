import { test, expect } from '@playwright/test'

test.describe('Customer Portal - Warranty Certificates Page', () => {
  test('should navigate to /portal/warranty from sidebar without 404', async ({ page }) => {
    await page.goto('/portal')

    // Click "Warranty Certificates" in customer portal sidebar
    const warrantyLink = page.locator('aside').getByRole('link', { name: /Warranty Certificates/i })
    await expect(warrantyLink).toBeVisible()
    await warrantyLink.click()

    // URL should be /portal/warranty
    await expect(page).toHaveURL(/.*portal\/warranty/)

    // Must NOT be a 404 page
    await expect(page.locator('text=404 ERROR')).not.toBeVisible()
    await expect(page.locator('text=Page Not Found')).not.toBeVisible()

    // Title and SLA badges
    await expect(page.getByRole('heading', { name: 'Digital Warranty Certificates' })).toBeVisible()
    await expect(page.locator('text=100% Comprehensive Coverage')).toBeVisible()

    // Check Anand Kumar's warranties
    await expect(page.locator('text=WAR-INV-2026-8422')).toBeVisible()
    await expect(page.locator('text=Growatt 3.3kW Single-Phase Grid-Tied Inverter')).toBeVisible()
    await expect(page.locator('text=WAR-PNL-2026-8422')).toBeVisible()
    await expect(page.locator('text=Waaree 540W Mono PERC Bifacial Solar PV Array')).toBeVisible()

    // Take screenshot of the improved warranties page
    await page.screenshot({ path: 'docs/screenshots/customer-portal-warranties-fixed.png', fullPage: true })
  })

  test('should filter by category and search', async ({ page }) => {
    await page.goto('/portal/warranty')

    // Filter by Inverters
    await page.getByRole('button', { name: /Inverters/i }).click()
    await expect(page.locator('text=Growatt 3.3kW Single-Phase Grid-Tied Inverter')).toBeVisible()
    await expect(page.locator('text=Waaree 540W Mono PERC')).not.toBeVisible()

    // Search by serial
    await page.getByRole('button', { name: /All Equipment/i }).click()
    await page.fill('input[placeholder*="Search serial"]', 'PNL-WAA')
    await expect(page.locator('text=Waaree 540W Mono PERC')).toBeVisible()
    await expect(page.locator('text=Growatt 3.3kW')).not.toBeVisible()
  })

  test('should open official certificate bond modal', async ({ page }) => {
    await page.goto('/portal/warranty')

    // Click "View Official Certificate Bond" on first card
    await page.locator('button:has-text("View Official Certificate Bond")').first().click()

    // Modal should appear
    await expect(page.locator('text=CERTIFICATE OF SOLAR WARRANTY')).toBeVisible()
    await expect(page.locator('text=SunPower One Distributed Clean Energy Systems Limited')).toBeVisible()
    await expect(page.locator('text=Marcus Vance')).toBeVisible()
    await expect(page.locator('text=Chief Technology Officer')).toBeVisible()

    // Capture screenshot of the modal
    await page.screenshot({ path: 'docs/screenshots/customer-warranty-modal.png' })
  })

  test('should support both /portal/warranty and /portal/warranties URLs', async ({ page }) => {
    await page.goto('/portal/warranties')
    await expect(page.getByRole('heading', { name: 'Digital Warranty Certificates' })).toBeVisible()
    await expect(page.locator('text=404 ERROR')).not.toBeVisible()
  })
})
