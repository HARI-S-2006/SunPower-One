import { test, expect } from '@playwright/test'

test.describe('Solar Intelligence AI Assistant', () => {
  test('should load welcome message without false empty data error', async ({ page }) => {
    await page.goto('/app/ai-assistant')
    await expect(page.locator('h1')).toContainText('AI Assistant')
    
    // Welcome message should be present
    const welcomeText = page.locator('text=Welcome to SunPower AI Assistant!')
    await expect(welcomeText).toBeVisible()

    // Must NOT show the old empty error on initial load
    const noDataText = page.locator('text=No data returned for this query.')
    await expect(noDataText).not.toBeVisible()
  })

  test('should query monthly revenue and return structured dataset', async ({ page }) => {
    await page.goto('/app/ai-assistant')

    // Click quick question button
    const revBtn = page.getByRole('button', { name: 'Show me monthly revenue for the last 12 months' })
    if (await revBtn.isVisible()) {
      await revBtn.click()
    } else {
      await page.fill('input[placeholder*="Ask me anything"]', 'Show me monthly revenue for the last 12 months')
      await page.locator('button[type="submit"]').click()
    }

    // Verify response
    await expect(page.locator('text=Oct 2026').first()).toBeVisible({ timeout: 5000 })
    await expect(page.locator('text=₹18,45,000').first()).toBeVisible()
    await expect(page.locator('text=Found 12 results').first()).toBeVisible()
  })

  test('should query low stock products and take screenshot', async ({ page }) => {
    await page.goto('/app/ai-assistant')

    // Ask about low stock
    await page.fill('input[placeholder*="Ask me anything"]', 'Which products are below reorder point?')
    await page.locator('button[type="submit"]').click()

    await expect(page.locator('text=Waaree 540W Mono PERC').first()).toBeVisible({ timeout: 5000 })
    await expect(page.locator('text=CRITICAL REORDER').first()).toBeVisible()

    // Ask about scheduled installations
    await page.fill('input[placeholder*="Ask me anything"]', 'What installations are scheduled this week?')
    await page.locator('button[type="submit"]').click()

    await expect(page.locator('text=JOB-2026-089').first()).toBeVisible({ timeout: 5000 })
    await expect(page.locator('text=Anand Kumar Sharma').first()).toBeVisible()

    // Save screenshot
    await page.screenshot({ path: 'docs/screenshots/ai-assistant-working.png', fullPage: true })
  })
})
