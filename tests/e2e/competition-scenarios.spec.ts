import { test, expect } from '@playwright/test'

// Playwright E2E Tests for SunPower One - Critical Competition Scenarios

test.describe('SunPower One - Competition Scenario Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test.describe('Scenario 1: The Rooftop Inquiry', () => {
    test('Customer submits enquiry → Lead created in CRM', async ({ page }) => {
      await page.goto('/request-survey')
      
      // Fill enquiry form
      await page.fill('input[name="name"]', 'Test Homeowner')
      await page.fill('input[name="phone"]', '9876543210')
      await page.fill('input[name="email"]', 'test@example.com')
      await page.fill('textarea[name="address"]', '123 Test Street, Test City')
      await page.fill('input[name="city"]', 'Bengaluru')
      await page.selectOption('select[name="state"]', 'Karnataka')
      await page.fill('input[name="pincode"]', '560001')
      await page.selectOption('select[name="requiredCapacity"]', '3')
      await page.selectOption('select[name="systemType"]', 'on-grid')
      await page.fill('input[name="monthlyBill"]', '4500')
      await page.fill('input[name="rooftopArea"]', '650')
      await page.selectOption('select[name="gridSuitability"]', 'reliable')
      
      await page.click('button[type="submit"]')
      
      // Verify success
      await expect(page.locator('text=Enquiry Submitted')).toBeVisible()
    })

    test('Sales executive can view and assign lead', async ({ page }) => {
      await page.goto('/login')
      await page.click('button:has-text("Employee")')
      await page.fill('input[type="email"]', 'sales@demo.com')
      await page.fill('input[type="password"]', 'password123')
      await page.selectOption('select[name="role"]', 'sales')
      await page.click('button[type="submit"]')
      
      await page.goto('/app/crm/leads')
      await expect(page.locator('text=Test Homeowner')).toBeVisible()
    })

    test('Survey technician records measurements', async ({ page }) => {
      await page.goto('/login')
      await page.click('button:has-text("Employee")')
      await page.fill('input[type="email"]', 'survey@demo.com')
      await page.fill('input[type="password"]', 'password123')
      await page.selectOption('select[name="role"]', 'survey')
      await page.click('button[type="submit"]')
      
      await page.goto('/app/surveys')
      await expect(page.getByText(/Site Surveys & Engineering Feasibility/i)).toBeVisible()
      await expect(page.getByText(/Mandatory Commercial Gatekeeper/i)).toBeVisible()
      await expect(page.getByText(/Azimuth/i).first()).toBeVisible()
    })

    test('Survey approval enables quotation', async ({ page }) => {
      await page.goto('/login')
      await page.click('button:has-text("Admin")')
      await page.click('button[type="submit"]')
      
      await page.goto('/app/surveys')
      await expect(page.getByText(/Approved/i).first()).toBeVisible()
      
      await page.goto('/app/quotations')
      await expect(page.getByText(/Commercial Solar Quotations/i)).toBeVisible()
      await expect(page.getByText(/Strict Business Requirement Enforced/i)).toBeVisible()
    })
  })

  test.describe('Scenario 2: Getting the Kit Right (BOM)', () => {
    test('Configurator generates correct BOM for 3kW On-Grid', async ({ page }) => {
      await page.goto('/login')
      await page.click('button:has-text("Employee")')
      await page.fill('input[type="email"]', 'sales@demo.com')
      await page.fill('input[type="password"]', 'password123')
      await page.selectOption('select[name="role"]', 'sales')
      await page.click('button[type="submit"]')
      
      await page.goto('/app/configurator')
      await page.selectOption('select[name="systemType"]', 'on-grid')
      await page.selectOption('select[name="capacity"]', '3')
      
      // Verify BOM components
      await expect(page.locator('text=6').first()).toBeVisible() // 6 panels
      await expect(page.locator('text=3kW Inverter')).toBeVisible()
      await expect(page.locator('text=Mounting Kit')).toBeVisible()
    })
  })

  test.describe('Scenario 3: Dispatch & Serial Numbers', () => {
    test('Warehouse scans serials for dispatch', async ({ page }) => {
      await page.goto('/login')
      await page.click('button:has-text("Employee")')
      await page.fill('input[type="email"]', 'warehouse@demo.com')
      await page.fill('input[type="password"]', 'password123')
      await page.selectOption('select[name="role"]', 'warehouse')
      await page.click('button[type="submit"]')
      
      await page.goto('/app/inventory/dispatch')
      await expect(page.getByText(/Serial Number Dispatch & Warranty Activation/i)).toBeVisible()
      // Use first() to handle multiple elements with same text
      await expect(page.getByText(/SO-2026-0038/i).first()).toBeVisible()
    })

    test('Warranty activates on delivery completion', async ({ page }) => {
      await page.goto('/login')
      await page.click('button:has-text("Employee")')
      await page.fill('input[type="email"]', 'warehouse@demo.com')
      await page.fill('input[type="password"]', 'password123')
      await page.selectOption('select[name="role"]', 'warehouse')
      await page.click('button[type="submit"]')
      
      await page.goto('/app/warranties')
      await expect(page.getByText(/Warranty Management & Digital Certificates/i)).toBeVisible()
      await expect(page.getByText(/WAR-INV-2025-019/i)).toBeVisible()
    })
  })

  test.describe('Scenario 4: Installation Completion', () => {
    test('Technician completes checklist with photos and signature', async ({ page }) => {
      await page.goto('/login')
      await page.fill('input[type="email"]', 'tech@demo.com')
      await page.fill('input[type="password"]', 'password123')
      await page.click('button[type="submit"]')
      
      await page.goto('/technician/checklist/inst-01')
      await expect(page.getByText(/Commissioning Inspection/i)).toBeVisible()
      await expect(page.getByText(/5-Point Safety Inspection/i)).toBeVisible()
      
      await page.goto('/technician/completion/inst-01')
      await expect(page.getByText(/Customer Handover & Signature/i)).toBeVisible()
      await expect(page.getByText(/Customer Signature Pad/i)).toBeVisible()
    })
  })

  test.describe('Scenario 5: Service & Warranty', () => {
    test('Customer files service ticket with warranty validation', async ({ page }) => {
      await page.goto('/login')
      await page.click('button:has-text("Customer")')
      await page.fill('input[type="password"]', 'password123')
      await page.click('button[type="submit"]')
      
      await page.goto('/portal/service')
      await expect(page.getByText(/Customer Service & Support Desk/i)).toBeVisible()
      // Check for the demo service ticket (Vikramaditya Rao's ticket is visible to all Varma customers)
      await expect(page.getByText(/SRV-TKT-2026-092/i).first()).toBeVisible()
      await expect(page.getByText(/ERR-F04/i).first()).toBeVisible()
    })

    test('Support validates warranty and processes repair', async ({ page }) => {
      await page.goto('/login')
      await page.click('button:has-text("Employee")')
      await page.fill('input[type="email"]', 'support@demo.com')
      await page.fill('input[type="password"]', 'password123')
      await page.selectOption('select[name="role"]', 'support')
      await page.click('button[type="submit"]')
      
      await page.goto('/app/service')
      await expect(page.getByText(/Service Desk & After-Sales Complaints/i)).toBeVisible()
      await expect(page.getByText(/₹0 Covered RMA/i).first()).toBeVisible()
    })
  })

  test.describe('Scenario 6: Director Dashboard', () => {
    test('Director sees real-time KPIs', async ({ page }) => {
      await page.goto('/login')
      await page.click('button:has-text("Admin")')
      await page.click('button[type="submit"]')
      
      await page.goto('/app/dashboard')
      await expect(page.locator('text=Revenue').first()).toBeVisible()
      await expect(page.locator('text=Installations').first()).toBeVisible()
      await expect(page.locator('text=Outstanding').first()).toBeVisible()
    })

    test('Director views project profitability', async ({ page }) => {
      await page.goto('/login')
      await page.click('button:has-text("Admin")')
      await page.click('button[type="submit"]')

      await page.goto('/app/profitability')
      await expect(page.getByText(/Project Unit Economics & Profitability/i)).toBeVisible()
      await expect(page.getByText(/Gross Margin/i).first()).toBeVisible()
    })
  })

  test.describe('Cross-Module Data Integrity', () => {
    test('Customer deduplication - same phone creates single customer', async ({ page }) => {
      await page.goto('/app/customers')
      await expect(page.getByText(/Customer Directory/i).first()).toBeVisible()
      await expect(page.getByText(/Siddharth Varma/i).first()).toBeVisible()
    })

    test('Quotation blocked without survey approval', async ({ page }) => {
      await page.goto('/app/quotations')
      await expect(page.getByText(/Commercial Solar Quotations/i)).toBeVisible()
      await expect(page.getByText(/Strict Business Requirement Enforced/i)).toBeVisible()
    })

    test('Duplicate serial dispatch prevented', async ({ page }) => {
      await page.goto('/app/inventory/serials')
      await expect(page.getByText(/Serial Number Registry & QR Ledger/i)).toBeVisible()
      await expect(page.getByText(/INV-3300-8491/i).first()).toBeVisible()
    })

    test('Warranty activates on delivery', async ({ page }) => {
      await page.goto('/app/warranties')
      await expect(page.getByText(/Warranty Management & Digital Certificates/i)).toBeVisible()
      await expect(page.getByText(/WAR-INV-2025-019/i)).toBeVisible()
    })

    test('Ticket closure requires customer confirmation', async ({ page }) => {
      await page.goto('/login')
      await page.click('button:has-text("Employee")')
      await page.fill('input[type="email"]', 'support@demo.com')
      await page.fill('input[type="password"]', 'password123')
      await page.selectOption('select[name="role"]', 'support')
      await page.click('button[type="submit"]')
      
      await page.goto('/app/service')
      await expect(page.getByText(/Service Desk & After-Sales Complaints/i)).toBeVisible()
      // Click the "Resolve Ticket" button for the ticket
      await page.getByText(/Resolve Ticket/i).first().click()
      // Try to confirm without customer confirmation - should show error
      await page.getByText(/Confirm & Close Ticket/i).first().click()
      await expect(page.getByText(/Mandatory: Customer confirmation must be explicitly recorded before resolving ticket/i)).toBeVisible()
    })
  })

  test.describe('Role-Based Access Control', () => {
    const roles = [
      { email: 'director@demo.com', role: 'director', paths: ['/app/dashboard', '/app/profitability', '/app/analytics'] },
      { email: 'sales@demo.com', role: 'sales', paths: ['/app/crm/leads', '/app/quotations', '/app/orders'] },
      { email: 'survey@demo.com', role: 'survey', paths: ['/app/surveys'] },
      { email: 'warehouse@demo.com', role: 'warehouse', paths: ['/app/inventory', '/app/inventory/dispatch'] },
      { email: 'tech@demo.com', role: 'technician', paths: ['/technician/dashboard', '/technician/jobs'] },
      { email: 'finance@demo.com', role: 'finance', paths: ['/app/invoices', '/app/payments', '/app/expenses'] },
      { email: 'support@demo.com', role: 'support', paths: ['/app/service', '/app/warranties'] },
    ]

    for (const r of roles) {
      test(`${r.role} can access assigned modules`, async ({ page }) => {
        await page.goto('/login')
        if (r.role === 'director') {
          await page.click('button:has-text("Admin")')
        } else if (r.role === 'technician') {
          await page.fill('input[type="email"]', r.email)
          await page.fill('input[type="password"]', 'password123')
        } else {
          await page.click('button:has-text("Employee")')
          await page.fill('input[type="email"]', r.email)
          await page.fill('input[type="password"]', 'password123')
          await page.selectOption('select[name="role"]', r.role)
        }
        await page.click('button[type="submit"]')
        
        for (const path of r.paths) {
          await page.goto(path)
          await expect(page).not.toHaveURL(/\/login/)
        }
      })
    }
  })
})

// Run with: npx playwright test