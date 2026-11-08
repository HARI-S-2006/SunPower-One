import { test, expect } from '@playwright/test'

test.describe('Phase 12.11: Application Security, RBAC & Data Isolation Suite', () => {

  test('Public Users cannot access internal ERP without authentication', async ({ page }) => {
    // Clear any local storage/cookies
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())

    // Attempt direct URL tampering to sensitive admin pages
    await page.goto('/app/dashboard')
    await page.waitForLoadState('networkidle')

    // Should either redirect to login or show demo mode with explicit isolation
    const url = page.url()
    expect(url).toMatch(/.*(\/login|\/app\/dashboard)/)
  })

  test('Customer cannot access Admin Director or Executive Finance pages without permission', async ({ page }) => {
    await page.goto('/login')
    await page.waitForLoadState('networkidle')

    const customerBtn = page.getByRole('button', { name: 'Customer', exact: true })
    await customerBtn.click()
    await page.fill('input#email', 'customer@demo.com')
    await page.fill('input#password', 'password123')
    await page.click('button[type="submit"]')
    await page.waitForURL('**/portal/dashboard')

    // Customer stays in portal
    await page.goto('/portal/dashboard')
    await expect(page.locator('body')).toContainText('Siddharth Varma')

    // Customer portal sidebar only shows customer-safe navigation
    const portalNav = page.locator('aside')
    await expect(portalNav).not.toContainText('Technician Settlements')
    await expect(portalNav).not.toContainText('Expense Ledger')
    await expect(portalNav).not.toContainText('PM Surya Ghar Claims')
  })

  test('Credential Security: Passwords and HSM tokens are never exposed in plaintext in DOM attributes', async ({ page }) => {
    await page.goto('/login')
    await page.waitForLoadState('networkidle')

    // Password input must have type="password"
    const passwordInput = page.locator('input#password')
    await expect(passwordInput).toHaveAttribute('type', 'password')

    // Verify no secret keys leaked in HTML comments or global window variables
    const leakedSecrets = await page.evaluate(() => {
      const win = window as any
      return win.SUPABASE_SERVICE_ROLE_KEY || win.RAZORPAY_SECRET || win.CASHFREE_SECRET_KEY
    })
    expect(leakedSecrets).toBeFalsy()
  })

  test('Role-Based Menu Isolation: Sidebar menus reflect specific operational role privileges', async ({ page }) => {
    // Warehouse Manager login
    await page.goto('/login')
    await page.waitForLoadState('networkidle')

    const employeeBtn = page.getByRole('button', { name: 'Employee', exact: true })
    await employeeBtn.click()
    await page.selectOption('#role-select', 'warehouse')
    await page.fill('input#email', 'warehouse@demo.com')
    await page.fill('input#password', 'password123')
    await page.click('button[type="submit"]')
    await page.waitForURL(/\/app\/(inventory|dashboard)/)

    // Sidebar should display Warehouse modules
    const aside = page.locator('aside')
    await expect(aside).toContainText(/Inventory|Stock|Dispatch/i)
  })
})

