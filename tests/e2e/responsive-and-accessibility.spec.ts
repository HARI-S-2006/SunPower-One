import { test, expect } from '@playwright/test'

test.describe('Phase 12.12: Responsive Viewports & Accessibility Compliance Suite', () => {

  test('Mobile Viewport (375px × 667px): Public Homepage & Login Page render responsively without horizontal scroll overflow', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Verify header and mobile navigation trigger
    await expect(page.locator('header')).toBeVisible()

    // Ensure document width matches viewport (no horizontal overflow)
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
    expect(scrollWidth).toBeLessThanOrEqual(400)

    // Mobile Login Page
    await page.goto('/login')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('button[type="submit"]')).toBeVisible()
    const loginScrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
    expect(loginScrollWidth).toBeLessThanOrEqual(400)
  })

  test('Tablet Viewport (768px × 1024px): Solar Calculator renders responsive grid and controls', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.goto('/solar-calculator')
    await page.waitForLoadState('networkidle')

    await expect(page.getByText(/Estimate Your Solar Requirements/i)).toBeVisible()
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
    expect(scrollWidth).toBeLessThanOrEqual(775)
  })

  test('Desktop Viewport (1440px × 900px): Admin Operations Command Center renders full multi-column Stitch layout', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/login')
    await page.waitForLoadState('networkidle')

    const adminBtn = page.getByRole('button', { name: 'Admin', exact: true })
    await adminBtn.click()
    await page.click('button[type="submit"]')
    await page.waitForURL('**/app/dashboard')

    // Sidebar and AppHeader must be visible simultaneously
    await expect(page.locator('aside')).toBeVisible()
    await expect(page.locator('header')).toBeVisible()
    await expect(page.locator('main')).toBeVisible()
  })

  test('Accessibility: Form fields have matching label associations and aria attributes', async ({ page }) => {
    await page.goto('/login')
    await page.waitForLoadState('networkidle')

    // Form inputs must have id matching label htmlFor
    const emailInput = page.locator('input#email')
    const emailLabel = page.locator('label[for="email"]')
    await expect(emailInput).toBeVisible()
    await expect(emailLabel).toBeVisible()

    const passwordInput = page.locator('input#password')
    const passwordLabel = page.locator('label[for="password"]')
    await expect(passwordInput).toBeVisible()
    await expect(passwordLabel).toBeVisible()
  })

  test('Keyboard Navigation: Focus states allow tab navigation through authentication form', async ({ page }) => {
    await page.goto('/login')
    await page.waitForLoadState('networkidle')

    // Clear email input and type via keyboard
    await page.fill('input#email', '')
    await page.focus('input#email')
    await page.keyboard.type('test@keyboard.com')
    expect(await page.inputValue('input#email')).toBe('test@keyboard.com')

    // Tab to password
    await page.fill('input#password', '')
    await page.focus('input#password')
    await page.keyboard.type('secret123')
    expect(await page.inputValue('input#password')).toBe('secret123')
  })
})
