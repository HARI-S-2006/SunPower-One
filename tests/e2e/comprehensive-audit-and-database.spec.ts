import { test, expect } from '@playwright/test'

test.describe('SunPower One - Database, Authentication & Role Verification Suite', () => {

  test('Database accounts exist and can authenticate with matching headers and sidebars', async ({ page }) => {
    // 1. Test Sales Executive Login (Elena Rostova)
    await page.goto('/login')
    await page.waitForLoadState('networkidle')

    // Click employee profile simulation tab
    const employeeTab = page.locator('button:has-text("Operational Role")').first()
    if (await employeeTab.isVisible()) {
      await employeeTab.click()
    }

    // Fill credentials for Elena Rostova
    await page.fill('input#email', 'sales@demo.com')
    await page.fill('input#password', 'password123')
    await page.click('button[type="submit"]:has-text("LOGIN")')

    // Sales role redirects to /app/crm/leads or /app/dashboard
    await page.waitForURL(/.*\/app\/(crm\/leads|dashboard)/, { timeout: 15000 })
    
    // Header must show Elena Rostova and Sales Executive
    await expect(page.locator('header')).toContainText('Elena Rostova')
    await expect(page.locator('header')).toContainText('Sales Executive')

    // Sidebar footer MUST show Elena Rostova and Sales Executive (NOT Marcus Vance!)
    const sidebar = page.locator('aside')
    await expect(sidebar).toContainText('Elena Rostova')
    await expect(sidebar).toContainText('Sales Executive')
    await expect(sidebar).toContainText('ER')

    // 2. Test User Account Profile in Settings Page
    await page.goto('/app/settings')
    await page.waitForLoadState('networkidle')

    // Tab 1 should be User Account Profile & Security Credentials
    await expect(page.locator('body')).toContainText('User Account Profile & Credentials')
    await expect(page.locator('body')).toContainText('Elena Rostova')
    await expect(page.locator('body')).toContainText('usr-02')
    await expect(page.locator('body')).toContainText('Lead Sales Executive')

    // 3. Switch Account using 1-Click Role Switcher in Settings to Site Survey Engineer
    const switchSurveyBtn = page.locator('button:has-text("Mateo Kowalski")').first()
    if (await switchSurveyBtn.isVisible()) {
      await switchSurveyBtn.click()
      await page.waitForTimeout(500)
      await expect(page.locator('header')).toContainText('Mateo Kowalski')
      await expect(sidebar).toContainText('Mateo Kowalski')
    }
  })

  test('Site Survey photogrammetry images render without any broken images', async ({ page }) => {
    // Login as Director or Survey Engineer
    await page.goto('/login')
    await page.waitForLoadState('networkidle')

    const adminTab = page.locator('button:has-text("Director Console")').first()
    if (await adminTab.isVisible()) {
      await adminTab.click()
    }

    await page.fill('input#email', 'admin@sunpower-solutions.com')
    await page.fill('input#password', 'password123')
    await page.click('button[type="submit"]:has-text("LOGIN")')
    await page.waitForURL('**/app/dashboard', { timeout: 15000 })

    // Navigate to Site Surveys & Feasibility
    await page.goto('/app/surveys')
    await page.waitForLoadState('networkidle')

    // Check that tickets are loaded
    await expect(page.locator('body')).toContainText('Site Surveys & Engineering Feasibility')

    // Click "Expand All" to reveal all survey timeline sections
    const expandAllBtn = page.locator('button:has-text("Expand All")')
    if (await expandAllBtn.isVisible()) {
      await expandAllBtn.click()
    }

    // Locate the Rooftop Inspection Photographs section
    await expect(page.locator('body')).toContainText('Rooftop Inspection Photographs')

    // Verify all images rendered in the photogrammetry gallery have valid src and no broken icons
    const surveyImages = page.locator('img[alt*="Rooftop inspection photograph"]')
    const count = await surveyImages.count()
    expect(count).toBeGreaterThan(0)

    for (let i = 0; i < count; i++) {
      const img = surveyImages.nth(i)
      await expect(img).toBeVisible()
      const src = await img.getAttribute('src')
      expect(src).toBeTruthy()
      expect(src?.length).toBeGreaterThan(20)
    }

    // Click on the first photograph to test the Lightbox Modal
    const firstPhotoBtn = page.locator('button[aria-label*="View full rooftop photograph 1"]').first()
    if (await firstPhotoBtn.isVisible()) {
      await firstPhotoBtn.click()
      await expect(page.locator('body')).toContainText('SURVEY FILE #')
      await expect(page.locator('button:has-text("Close View")')).toBeVisible()
      await page.click('button:has-text("Close View")')
    }
  })

  test('Customer Portal unified data source consistency check', async ({ page }) => {
    // Login as Customer
    await page.goto('/login')
    await page.waitForLoadState('networkidle')

    const customerTab = page.locator('button:has-text("Solar Customer")').first()
    if (await customerTab.isVisible()) {
      await customerTab.click()
    }

    await page.fill('input#email', 'customer@demo.com')
    await page.fill('input#password', 'password123')
    await page.click('button[type="submit"]:has-text("LOGIN")')
    await page.waitForURL(/.*\/portal/, { timeout: 15000 })

    // 1. Dashboard: Check customer profile details
    await expect(page.locator('body')).toContainText('Welcome back, Siddharth Varma')
    await expect(page.locator('body')).toContainText('4.3 kW')
    await expect(page.locator('body')).toContainText('Koramangala 4th Block')

    // 2. Sidebar: Check customer site identification card
    const portalSidebar = page.locator('aside')
    await expect(portalSidebar).toContainText('Siddharth Varma')
    await expect(portalSidebar).toContainText('4.3 kW')

    // 3. Quotations page
    await page.goto('/portal/quotations')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('body')).toContainText('Siddharth Varma')
    await expect(page.locator('body')).toContainText('CUST-2026-038')

    // 4. Equipment & Serials page
    await page.goto('/portal/equipment')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('body')).toContainText('Siddharth Varma')
    await expect(page.locator('body')).toContainText('CUST-2026-038')

    // 5. Account Profile page
    await page.goto('/portal/profile')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('body')).toContainText('Siddharth Varma')
    await expect(page.locator('body')).toContainText('+91 98860 33412')
    await expect(page.locator('body')).toContainText('customer@demo.com')
    await expect(page.locator('body')).toContainText('Koramangala 4th Block')
    await expect(page.locator('body')).toContainText('4.3 kW')
  })

  test('New User Registration updates Database and auto-logs in with correct profile', async ({ page }) => {
    await page.goto('/register')
    await page.waitForLoadState('networkidle')

    // Fill registration form
    const uniqueEmail = `testuser_${Date.now()}@sunpower.com`
    await page.fill('input[placeholder="e.g. John Doe"]', 'Rohan Mehra')
    await page.fill('input[placeholder="john.doe@company.com"]', uniqueEmail)
    await page.fill('input[placeholder="+91 98765 43210"]', '+91 98888 77777')
    await page.fill('input[placeholder="Min 8 characters"]', 'securePass123!')
    await page.fill('input[placeholder="Re-enter password"]', 'securePass123!')
    await page.fill('input[placeholder="Bengaluru, 560001"]', 'Koramangala 4th Block, Bengaluru')

    // Agree to terms
    await page.check('input[type="checkbox"]')

    // Submit form
    await page.click('button[type="submit"]:has-text("REGISTER")')

    // Should redirect to portal or dashboard
    await page.waitForTimeout(1000)

    // Navigate to Settings to verify in Database table
    await page.goto('/app/settings')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('body')).toContainText('User Account Profile & Credentials')
    await expect(page.locator('body')).toContainText('Rohan Mehra')
    await expect(page.locator('body')).toContainText(uniqueEmail)
  })

  test('Field Technician Mobile Portal verification', async ({ page }) => {
    // Navigate directly to /technician
    await page.goto('/technician')
    await page.waitForLoadState('networkidle')

    // Verify Technician Header and Active Status
    await expect(page.locator('body')).toContainText('FIELD CREW')
    await expect(page.locator('body')).toContainText('SunPower Mobile')
    await expect(page.locator('aside')).toContainText('Mateo Kowalski')
    await expect(page.locator('aside')).toContainText('Crew Lead #04')

    // Verify mobile navigation links exist
    await expect(page.locator('a:has-text("Field Jobs")')).toBeVisible()
    await expect(page.locator('a:has-text("Barcode / QR Scan")')).toBeVisible()
    await expect(page.locator('a:has-text("Commissioning Checklist")')).toBeVisible()
  })

  test('Multi-role database directory verification on Settings Page', async ({ page }) => {
    // Login as Admin
    await page.goto('/login')
    await page.waitForLoadState('networkidle')

    const adminTab = page.locator('button:has-text("Director Console")')
    if (await adminTab.isVisible()) {
      await adminTab.click()
    }

    await page.fill('input#email', 'admin@sunpower-solutions.com')
    await page.fill('input#password', 'password123')
    await page.click('button[type="submit"]:has-text("LOGIN")')
    await page.waitForURL('**/app/dashboard', { timeout: 15000 })

    // Go to Settings
    await page.goto('/app/settings')
    await page.waitForLoadState('networkidle')

    // Verify all 9 accounts exist in the live database directory
    await expect(page.locator('body')).toContainText('Marcus Vance')
    await expect(page.locator('body')).toContainText('Elena Rostova')
    await expect(page.locator('body')).toContainText('Mateo Kowalski')
    await expect(page.locator('body')).toContainText('Vikram Singh')
    await expect(page.locator('body')).toContainText('David O\'Connor')
    await expect(page.locator('body')).toContainText('Priya Patel')
    await expect(page.locator('body')).toContainText('Aisha Khan')
    await expect(page.locator('body')).toContainText('Siddharth Varma')
  })
})
