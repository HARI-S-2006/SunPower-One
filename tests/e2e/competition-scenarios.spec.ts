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
      await page.fill('input[type="email"]', 'sales@demo.com')
      await page.fill('input[type="password"]', 'password123')
      await page.selectOption('select[name="role"]', 'sales')
      await page.click('button[type="submit"]')
      
      await page.goto('/app/crm/leads')
      await expect(page.locator('text=Test Homeowner')).toBeVisible()
    })

    test('Survey technician records measurements', async ({ page }) => {
      await page.goto('/login')
      await page.fill('input[type="email"]', 'survey@demo.com')
      await page.fill('input[type="password"]', 'password123')
      await page.selectOption('select[name="role"]', 'survey')
      await page.click('button[type="submit"]')
      
      await page.goto('/app/surveys')
      // Click on survey to record measurements
      // Fill roof direction, tilt, cable distance, areas
      // Upload photos
      // Submit for approval
    })

    test('Survey approval enables quotation', async ({ page }) => {
      await page.goto('/login')
      await page.fill('input[type="email"]', 'director@demo.com')
      await page.fill('input[type="password"]', 'password123')
      await page.selectOption('select[name="role"]', 'director')
      await page.click('button[type="submit"]')
      
      await page.goto('/app/surveys')
      // Approve survey
      await page.goto('/app/quotations')
      // Generate quotation - should be allowed now
      // Verify BOM auto-generated
    })
  })

  test.describe('Scenario 2: Getting the Kit Right (BOM)', () => {
    test('Configurator generates correct BOM for 3kW On-Grid', async ({ page }) => {
      await page.goto('/login')
      await page.fill('input[type="email"]', 'sales@demo.com')
      await page.fill('input[type="password"]', 'password123')
      await page.selectOption('select[name="role"]', 'sales')
      await page.click('button[type="submit"]')
      
      await page.goto('/app/configurator')
      await page.selectOption('select[name="systemType"]', 'on-grid')
      await page.selectOption('select[name="capacity"]', '3')
      
      // Verify BOM components
      await expect(page.locator('text=6')).toBeVisible() // 6 panels
      await expect(page.locator('text=3kW Inverter')).toBeVisible()
      await expect(page.locator('text=Mounting Kit')).toBeVisible()
    })
  })

  test.describe('Scenario 3: Dispatch & Serial Numbers', () => {
    test('Warehouse scans serials for dispatch', async ({ page }) => {
      await page.goto('/login')
      await page.fill('input[type="email"]', 'warehouse@demo.com')
      await page.fill('input[type="password"]', 'password123')
      await page.selectOption('select[name="role"]', 'warehouse')
      await page.click('button[type="submit"]')
      
      await page.goto('/app/inventory/dispatch')
      // Scan serial numbers
      // Validate each belongs to order
      // Complete dispatch
    })

    test('Warranty activates on delivery completion', async ({ page }) => {
      await page.goto('/login')
      await page.fill('input[type="email"]', 'warehouse@demo.com')
      await page.fill('input[type="password"]', 'password123')
      await page.selectOption('select[name="role"]', 'warehouse')
      await page.click('button[type="submit"]')
      
      await page.goto('/app/inventory/dispatch')
      // Mark as delivered
      // Verify warranty records created
    })
  })

  test.describe('Scenario 4: Installation Completion', () => {
    test('Technician completes checklist with photos and signature', async ({ page }) => {
      await page.goto('/login')
      await page.fill('input[type="email"]', 'tech@demo.com')
      await page.fill('input[type="password"]', 'password123')
      await page.selectOption('select[name="role"]', 'technician')
      await page.click('button[type="submit"]')
      
      await page.goto('/technician/jobs')
      // Start installation
      // Complete mandatory checklist
      // Upload photos
      // Record test readings
      // Customer signature
      // Mark complete
    })
  })

  test.describe('Scenario 5: Service & Warranty', () => {
    test('Customer files service ticket with warranty validation', async ({ page }) => {
      await page.goto('/login')
      await page.fill('input[type="email"]', 'customer@demo.com')
      await page.fill('input[type="password"]', 'password123')
      await page.selectOption('select[name="role"]', 'customer')
      await page.click('button[type="submit"]')
      
      await page.goto('/portal/service')
      // File ticket with serial number
      // Verify warranty shows as covered
    })

    test('Support validates warranty and processes repair', async ({ page }) => {
      await page.goto('/login')
      await page.fill('input[type="email"]', 'support@demo.com')
      await page.fill('input[type="password"]', 'password123')
      await page.selectOption('select[name="role"]', 'support')
      await page.click('button[type="submit"]')
      
      await page.goto('/app/service')
      // Verify warranty coverage
      // Process repair (covered = zero cost)
      // Customer confirms resolution
    })
  })

  test.describe('Scenario 6: Director Dashboard', () => {
    test('Director sees real-time KPIs', async ({ page }) => {
      await page.goto('/login')
      await page.fill('input[type="email"]', 'director@demo.com')
      await page.fill('input[type="password"]', 'password123')
      await page.selectOption('select[name="role"]', 'director')
      await page.click('button[type="submit"]')
      
      await page.goto('/app/dashboard')
      // Verify KPIs visible
      await expect(page.locator('text=Revenue')).toBeVisible()
      await expect(page.locator('text=Installations')).toBeVisible()
      await expect(page.locator('text=Outstanding')).toBeVisible()
    })

    test('Director views project profitability', async ({ page }) => {
      await page.goto('/app/profitability')
      // Verify project P&L table
      // Verify loss-making projects highlighted
    })
  })

  test.describe('Cross-Module Data Integrity', () => {
    test('Customer deduplication - same phone creates single customer', async ({ page }) => {
      // Submit two enquiries with same phone
      // Verify only one customer record created
    })

    test('Quotation blocked without survey approval', async ({ page }) => {
      // Try to approve quotation without survey approval
      // Verify error message shown
    })

    test('Duplicate serial dispatch prevented', async ({ page }) => {
      // Try to dispatch same serial to two orders
      // Verify error
    })

    test('Warranty activates on delivery', async ({ page }) => {
      // Complete delivery
      // Verify warranty records created with delivery date as start
    })

    test('Ticket closure requires customer confirmation', async ({ page }) => {
      // Try to close ticket without customer confirmation
      // Verify blocked
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
        await page.fill('input[type="email"]', r.email)
        await page.fill('input[type="password"]', 'password123')
        await page.selectOption('select[name="role"]', r.role)
        await page.click('button[type="submit"]')
        
        for (const path of r.paths) {
          await page.goto(path)
          await expect(page).not.toHaveURL(/\/login/)
        }
      })
    })
  })
})

// Run with: npx playwright test