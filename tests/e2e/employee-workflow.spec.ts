import { test, expect } from '@playwright/test'

test.describe('Phase 12.4: Employee Multi-Role Operational Workflows', () => {

  test('Role 1: Sales Executive manages leads, quotations and configurator', async ({ page }) => {
    await page.goto('/login')
    await page.waitForLoadState('networkidle')

    const employeeBtn = page.getByRole('button', { name: 'Employee', exact: true })
    await employeeBtn.click()
    await page.selectOption('#role-select', 'sales')
    await page.fill('input#email', 'sales@demo.com')
    await page.fill('input#password', 'password123')
    await page.click('button[type="submit"]')
    await page.waitForURL(/\/app\/(crm\/leads|dashboard)/)

    // Access CRM leads
    await page.goto('/app/crm/leads')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('body')).toContainText(/Customer Inquiries & Leads/i)

    // Access Quotations
    await page.goto('/app/quotations')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('body')).toContainText(/Commercial Solar Quotations/i)

    // Access Configurator
    await page.goto('/app/configurator')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('body')).toContainText(/Solar System Configurator & BOM Engine/i)
  })

  test('Role 2: Site Survey Engineer records rooftop metrics and feasibility status', async ({ page }) => {
    await page.goto('/login')
    await page.waitForLoadState('networkidle')

    const employeeBtn = page.getByRole('button', { name: 'Employee', exact: true })
    await employeeBtn.click()
    await page.selectOption('#role-select', 'survey')
    await page.fill('input#email', 'survey@demo.com')
    await page.fill('input#password', 'password123')
    await page.click('button[type="submit"]')
    await page.waitForURL(/\/app\/(surveys|dashboard)/)

    await page.goto('/app/surveys')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('body')).toContainText(/Site Surveys & Engineering Feasibility/i)
    await expect(page.locator('body')).toContainText(/Mandatory Commercial Gatekeeper/i)
    await expect(page.locator('body')).toContainText(/Shadow-Free/i)
  })

  test('Role 3: Warehouse Manager manages inventory, serials and dispatch', async ({ page }) => {
    await page.goto('/login')
    await page.waitForLoadState('networkidle')

    const employeeBtn = page.getByRole('button', { name: 'Employee', exact: true })
    await employeeBtn.click()
    await page.selectOption('#role-select', 'warehouse')
    await page.fill('input#email', 'warehouse@demo.com')
    await page.fill('input#password', 'password123')
    await page.click('button[type="submit"]')
    await page.waitForURL(/\/app\/(inventory|dashboard)/)

    // Check inventory stock ledger
    await page.goto('/app/inventory')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('body')).toContainText(/Inventory|Stock|Warehouse/i)

    // Check dispatch staging
    await page.goto('/app/inventory/dispatch')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('body')).toContainText(/Serial Number Dispatch & Warranty Activation/i)

    // Check serials ledger
    await page.goto('/app/inventory/serials')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('body')).toContainText(/Serial Number Registry & QR Ledger/i)
  })

  test('Role 4: Installation Coordinator monitors field crews and jobs', async ({ page }) => {
    await page.goto('/login')
    await page.waitForLoadState('networkidle')

    const employeeBtn = page.getByRole('button', { name: 'Employee', exact: true })
    await employeeBtn.click()
    await page.selectOption('#role-select', 'coordinator')
    await page.fill('input#email', 'coordinator@demo.com')
    await page.fill('input#password', 'password123')
    await page.click('button[type="submit"]')
    await page.waitForURL(/\/app\/(installations|dashboard)/)

    await page.goto('/app/installations')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('body')).toContainText(/Solar Installation Management/i)
  })

  test('Role 5: Finance Controller oversees invoices, payments and subsidies', async ({ page }) => {
    await page.goto('/login')
    await page.waitForLoadState('networkidle')

    const employeeBtn = page.getByRole('button', { name: 'Employee', exact: true })
    await employeeBtn.click()
    await page.selectOption('#role-select', 'finance')
    await page.fill('input#email', 'finance@demo.com')
    await page.fill('input#password', 'password123')
    await page.click('button[type="submit"]')
    await page.waitForURL(/\/app\/(invoices|dashboard)/)

    // Customer Invoices
    await page.goto('/app/invoices')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('body')).toContainText(/Customer Invoices|Billing Ledger/i)

    // Milestone Payments
    await page.goto('/app/payments')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('body')).toContainText(/Payment Receipts|Milestone Escrow/i)

    // Government Subsidies
    await page.goto('/app/subsidies')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('body')).toContainText(/PM Surya Ghar|Subsidy Claims/i)
  })

  test('Role 6: Service Desk Support manages warranties, tickets and zero-cost RMA', async ({ page }) => {
    await page.goto('/login')
    await page.waitForLoadState('networkidle')

    const employeeBtn = page.getByRole('button', { name: 'Employee', exact: true })
    await employeeBtn.click()
    await page.selectOption('#role-select', 'support')
    await page.fill('input#email', 'support@demo.com')
    await page.fill('input#password', 'password123')
    await page.click('button[type="submit"]')
    await page.waitForURL(/\/app\/(service|dashboard)/)

    // Service Desk
    await page.goto('/app/service')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('body')).toContainText(/Service Desk & After-Sales Complaints/i)
    await expect(page.locator('body')).toContainText(/₹0 Covered RMA/i)

    // Warranties
    await page.goto('/app/warranties')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('body')).toContainText(/Warranty Management & Digital Certificates/i)
  })
})
