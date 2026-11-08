import { test, expect } from '@playwright/test'

test.describe('Phase 12.1: Authentication & RBAC Regression Suite', () => {

  test('Admin Director Profile Authentication & Redirection', async ({ page }) => {
    await page.goto('/login')
    await page.waitForLoadState('networkidle')

    // Click Admin simulation button
    const adminBtn = page.getByRole('button', { name: 'Admin', exact: true })
    await adminBtn.click()

    await page.fill('input#email', 'admin@sunpower-solutions.com')
    await page.fill('input#password', 'password123')
    await page.click('button[type="submit"]')

    await page.waitForURL('**/app/dashboard', { timeout: 15000 })
    await expect(page.locator('header')).toContainText('Marcus Vance')
    await expect(page.locator('header')).toContainText('Executive Director')
  })

  test('Customer Profile Authentication & Portal Redirection', async ({ page }) => {
    await page.goto('/login')
    await page.waitForLoadState('networkidle')

    // Click Customer simulation button
    const customerBtn = page.getByRole('button', { name: 'Customer', exact: true })
    await customerBtn.click()

    await page.fill('input#email', 'customer@demo.com')
    await page.fill('input#password', 'password123')
    await page.click('button[type="submit"]')

    await page.waitForURL('**/portal/dashboard', { timeout: 15000 })
    await expect(page.locator('body')).toContainText('Siddharth Varma')
    await expect(page.locator('body')).toContainText('4.3 kW')
  })

  test('Employee Workspaces: All 6 Operational Roles can authenticate to authorized terminals', async ({ page }) => {
    const operationalRoles = [
      {
        name: 'Elena Rostova',
        email: 'sales@demo.com',
        roleSelect: 'sales',
        expectedUrl: /\/app\/(crm\/leads|dashboard)/,
        badgeText: 'Sales Executive'
      },
      {
        name: 'Mateo Kowalski',
        email: 'survey@demo.com',
        roleSelect: 'survey',
        expectedUrl: /\/app\/(surveys|dashboard)/,
        badgeText: 'Site Survey Engineer'
      },
      {
        name: 'Vikram Singh',
        email: 'warehouse@demo.com',
        roleSelect: 'warehouse',
        expectedUrl: /\/app\/(inventory|dashboard)/,
        badgeText: 'Warehouse Manager'
      },
      {
        name: 'David O\'Connor',
        email: 'coordinator@demo.com',
        roleSelect: 'coordinator',
        expectedUrl: /\/app\/(installations|dashboard)/,
        badgeText: 'Installation & Warranty Coordinator'
      },
      {
        name: 'Priya Patel',
        email: 'finance@demo.com',
        roleSelect: 'finance',
        expectedUrl: /\/app\/(invoices|dashboard)/,
        badgeText: 'Finance Controller'
      },
      {
        name: 'Aisha Khan',
        email: 'support@demo.com',
        roleSelect: 'support',
        expectedUrl: /\/app\/(service|dashboard)/,
        badgeText: 'Service Desk Support'
      }
    ]

    for (const op of operationalRoles) {
      await page.goto('/login')
      await page.waitForLoadState('networkidle')

      // Click Employee profile simulation tab
      const employeeBtn = page.getByRole('button', { name: 'Employee', exact: true })
      await employeeBtn.click()

      await page.selectOption('#role-select', op.roleSelect)
      await page.fill('input#email', op.email)
      await page.fill('input#password', 'password123')
      await page.click('button[type="submit"]')

      await page.waitForURL(op.expectedUrl, { timeout: 15000 })
      await expect(page.locator('header')).toContainText(op.name)
      await expect(page.locator('header')).toContainText(op.badgeText)
    }
  })

  test('Negative Authentication: Invalid credentials and role mismatches are rejected', async ({ page }) => {
    await page.goto('/login')
    await page.waitForLoadState('networkidle')

    // 1. Wrong Password Rejection
    const adminBtn = page.getByRole('button', { name: 'Admin', exact: true })
    await adminBtn.click()
    await page.fill('input#email', 'admin@sunpower-solutions.com')
    await page.fill('input#password', 'wrong-password-999')
    await page.click('button[type="submit"]')
    await expect(page.locator('div[role="alert"]')).toContainText(/Invalid password/i)

    // 2. Role Mismatch Rejection: Sales employee selecting Warehouse terminal
    const employeeBtn = page.getByRole('button', { name: 'Employee', exact: true })
    await employeeBtn.click()
    await page.selectOption('#role-select', 'warehouse')
    await page.fill('input#email', 'sales@demo.com')
    await page.fill('input#password', 'password123')
    await page.click('button[type="submit"]')
    await expect(page.locator('div[role="alert"]')).toContainText(/Access Denied/i)
  })

  test('Session Persistence & Sign Out workflow', async ({ page }) => {
    await page.goto('/login')
    await page.waitForLoadState('networkidle')

    const adminBtn = page.getByRole('button', { name: 'Admin', exact: true })
    await adminBtn.click()
    await page.fill('input#email', 'admin@sunpower-solutions.com')
    await page.fill('input#password', 'password123')
    await page.click('button[type="submit"]')
    await page.waitForURL('**/app/dashboard')

    // Refresh page to verify persistence
    await page.reload()
    await page.waitForLoadState('networkidle')
    await expect(page.locator('header')).toContainText('Marcus Vance')

    // Sign out: Open user menu and click sign out
    const userMenuBtn = page.locator('header button:has-text("Marcus Vance")').first()
    await userMenuBtn.click()
    const signOutLink = page.locator('a:has-text("Sign Out")').first()
    await signOutLink.click()
    await expect(page).toHaveURL(/.*login/, { timeout: 10000 })
  })
})
