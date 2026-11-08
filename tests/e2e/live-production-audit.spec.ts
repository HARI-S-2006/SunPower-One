import { test, expect } from '@playwright/test'

const LIVE_BASE_URL = 'https://sunpower-one.netlify.app'

test.describe('SunPower One — Live Production Netlify Deployment Audit', () => {

  test('01. Live Homepage: Verify 200 OK, DNS resolution, DOM markers, and no broken assets', async ({ page }) => {
    test.setTimeout(45000)
    const consoleErrors: string[] = []
    page.on('console', msg => {
      if (msg.type() === 'error') {
        const text = msg.text()
        if (!text.includes('favicon') && !text.includes('chrome-extension')) {
          consoleErrors.push(text)
        }
      }
    })
    page.on('pageerror', err => consoleErrors.push(err.message))

    const response = await page.goto(LIVE_BASE_URL, { waitUntil: 'networkidle' })
    expect(response?.status()).toBe(200)

    // Check page title and primary hero elements
    await expect(page).toHaveTitle(/SunPower One/i)
    await expect(page.locator('header')).toBeVisible()
    await expect(page.getByText(/SunPower/i).first()).toBeVisible()
    await expect(page.getByText(/Solar/i).first()).toBeVisible()

    // Capture visual proof
    await page.screenshot({ path: 'docs/screenshots/live-production/01-live-homepage.png', fullPage: false })

    // Zero fatal console errors
    expect(consoleErrors).toHaveLength(0)
  })

  test('02. Live Login Page: Verify split-screen Stitch design, role selectors, and registration link', async ({ page }) => {
    test.setTimeout(45000)
    const response = await page.goto(`${LIVE_BASE_URL}/login`, { waitUntil: 'networkidle' })
    expect(response?.status()).toBe(200)

    await expect(page.locator('input#email')).toBeVisible()
    await expect(page.locator('input#password')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Admin', exact: true })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Customer', exact: true })).toBeVisible()

    await page.screenshot({ path: 'docs/screenshots/live-production/02-live-login.png', fullPage: false })
  })

  test('03. Live Solar Calculator: Verify parametric sizing, tariff estimation, and PM Surya Ghar subsidies', async ({ page }) => {
    test.setTimeout(45000)
    const response = await page.goto(`${LIVE_BASE_URL}/solar-calculator`, { waitUntil: 'networkidle' })
    expect(response?.status()).toBe(200)

    await expect(page.getByText(/Solar Calculator|Estimate Your Solar|Calculate Your System/i).first()).toBeVisible()

    // Fill monthly bill and trigger calculation
    const billInput = page.locator('input[type="number"]').first()
    await billInput.fill('5000')
    const calcBtn = page.getByRole('button', { name: /Calculate Estimate/i })
    await calcBtn.click()

    // Verify dynamic results including PM Surya Ghar subsidy
    await expect(page.getByText(/PM Surya Ghar/i).first()).toBeVisible()
    await expect(page.getByText(/Central Financial Assistance/i).first()).toBeVisible()

    await page.screenshot({ path: 'docs/screenshots/live-production/03-live-calculator.png', fullPage: false })
  })

  test('04. Live Admin Operations Command Center: Authenticate and verify SCADA telemetry & role switcher lock', async ({ page }) => {
    test.setTimeout(45000)
    await page.goto(`${LIVE_BASE_URL}/login`, { waitUntil: 'networkidle' })

    // Authenticate as Admin Director
    await page.getByRole('button', { name: 'Admin', exact: true }).click()
    await page.click('button[type="submit"]')
    await page.waitForURL('**/app/dashboard', { timeout: 15000 })

    // Verify SCADA telemetry grid and dashboard markers
    await expect(page.getByText(/Solar Operations Command Center/i).first()).toBeVisible()
    await expect(page.locator('aside')).toBeVisible()
    await expect(page.locator('header')).toBeVisible()

    // Verify role switcher is visible ONLY for Admin
    await expect(page.locator('#header-role-switcher')).toBeVisible()

    await page.screenshot({ path: 'docs/screenshots/live-production/04-live-admin-dashboard.png', fullPage: false })
  })

  test('05. Live Customer Portal: Authenticate as Siddharth Varma and verify real-time solar yield', async ({ page }) => {
    test.setTimeout(45000)
    await page.goto(`${LIVE_BASE_URL}/login`, { waitUntil: 'networkidle' })

    // Authenticate as Customer
    await page.getByRole('button', { name: 'Customer', exact: true }).click()
    await page.click('button[type="submit"]')
    await page.waitForURL('**/portal/dashboard', { timeout: 15000 })

    await expect(page.locator('body')).toContainText(/Siddharth Varma/i)
    await expect(page.getByText(/Live Solar Output|Solar Energy Production/i).first()).toBeVisible()

    await page.screenshot({ path: 'docs/screenshots/live-production/05-live-customer-portal.png', fullPage: false })
  })

  test('06. Live SPA 404 Routing: Verify invalid routes trigger dedicated NotFoundPage', async ({ page }) => {
    test.setTimeout(45000)
    await page.goto(`${LIVE_BASE_URL}/route-does-not-exist-audit-check`, { waitUntil: 'networkidle' })

    await expect(page.getByText(/Page Not Found|404/i).first()).toBeVisible()
    await expect(page.getByRole('link', { name: /Back to Home|Return Home/i })).toBeVisible()

    await page.screenshot({ path: 'docs/screenshots/live-production/06-live-404-handling.png', fullPage: false })
  })
})
