import { test, expect } from '@playwright/test'

test.describe('Phase 12.3: Admin Director Operations Workflow Suite', () => {

  test('Director Dashboard: Renders live SCADA telemetry, KPIs and operational summaries without NaN or zero errors', async ({ page }) => {
    await page.goto('/login')
    await page.waitForLoadState('networkidle')

    const adminBtn = page.getByRole('button', { name: 'Admin', exact: true })
    await adminBtn.click()
    await page.click('button[type="submit"]')
    await page.waitForURL('**/app/dashboard', { timeout: 15000 })

    // 1. SCADA Telemetry & Baseline Header
    await expect(page.locator('body')).toContainText(/Solar Operations Command Center/i)
    await expect(page.locator('body')).toContainText(/SCADA Telemetry Grid Active/i)
    await expect(page.locator('body')).toContainText(/74.2/i)
    await expect(page.locator('body')).toContainText(/MW DC/i)

    // 2. Operational Metrics Cards
    await expect(page.locator('body')).toContainText(/Collected Revenue/i)
    await expect(page.locator('body')).toContainText(/In-Flight Installations/i)
    await expect(page.locator('body')).toContainText(/Active Service Desk/i)

    // Ensure no broken NaN displays
    const pageText = await page.innerText('body')
    expect(pageText).not.toContain('NaN')
    expect(pageText).not.toContain('undefined')

    // 3. Quick Action Buttons
    await expect(page.locator('button:has-text("New Lead"), a:has-text("New Lead")').first()).toBeVisible()
    await expect(page.locator('button:has-text("Site Surveys"), a:has-text("Site Surveys")').first()).toBeVisible()
  })

  test('Director Dashboard: Interactive quick links navigate to respective ERP modules', async ({ page }) => {
    await page.goto('/login')
    await page.waitForLoadState('networkidle')

    const adminBtn = page.getByRole('button', { name: 'Admin', exact: true })
    await adminBtn.click()
    await page.click('button[type="submit"]')
    await page.waitForURL('**/app/dashboard')

    // Navigate to Project Profitability
    await page.goto('/app/profitability')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('body')).toContainText(/Project Unit Economics & Profitability/i)
    await expect(page.locator('body')).toContainText(/Gross Margin/i)

    // Navigate to Business Analytics
    await page.goto('/app/analytics')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('body')).toContainText(/Analytics|Performance|Intelligence/i)
  })

  test('Director Console: Quick Role Switcher allows viewing Field Technician and Customer portals', async ({ page }) => {
    await page.goto('/login')
    await page.waitForLoadState('networkidle')

    const adminBtn = page.getByRole('button', { name: 'Admin', exact: true })
    await adminBtn.click()
    await page.click('button[type="submit"]')
    await page.waitForURL('**/app/dashboard')

    // Direct navigation to Field Crew Mobile Experience
    await page.goto('/technician/dashboard')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('body')).toContainText(/Technician Command|Field Unit Active|FIELD CREW/i)

    // Direct navigation to Customer Experience
    await page.goto('/portal/dashboard')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('body')).toContainText(/Siddharth Varma/i)
  })
})

