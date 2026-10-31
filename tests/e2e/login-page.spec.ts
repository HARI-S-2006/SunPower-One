import { test, expect } from '@playwright/test'

test.describe('SunPower One - Updated Login Page Verification', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
  })

  test('Requirement 1 & 2: Profile simulation buttons and conditional role visibility', async ({ page }) => {
    // 1. Verify three profile buttons exist
    const adminBtn = page.getByRole('button', { name: 'Admin', exact: true })
    const employeeBtn = page.getByRole('button', { name: 'Employee', exact: true })
    const customerBtn = page.getByRole('button', { name: 'Customer', exact: true })

    await expect(adminBtn).toBeVisible()
    await expect(employeeBtn).toBeVisible()
    await expect(customerBtn).toBeVisible()

    // Old options should not exist
    await expect(page.getByText('Admin (M. Vance)')).not.toBeVisible()
    await expect(page.getByText('Lead (M. Kowalski)')).not.toBeVisible()
    await expect(page.getByText('Solar Estimator')).not.toBeVisible()

    // Default state: Admin is selected, Operational Role & Terminal section must be HIDDEN
    await expect(page.locator('#role-select')).not.toBeVisible()
    await expect(page.getByText('Operational Role & Terminal')).not.toBeVisible()

    // 2. Select Employee -> Operational Role dropdown must APPEAR
    await employeeBtn.click()
    await expect(page.locator('#role-select')).toBeVisible()
    await expect(page.getByText('Operational Role & Terminal')).toBeVisible()

    // Confirm "Field Technician (Mobile Checklist)" and "Solar Customer (Self-Service Portal)" are REMOVED
    const roleSelect = page.locator('#role-select')
    const optionsText = await roleSelect.locator('option').allInnerTexts()
    expect(optionsText.some(t => t.includes('Field Technician'))).toBe(false)
    expect(optionsText.some(t => t.includes('Solar Customer'))).toBe(false)

    // Confirm remaining roles are present
    expect(optionsText.some(t => t.includes('Executive Director'))).toBe(true)
    expect(optionsText.some(t => t.includes('Sales Executive'))).toBe(true)
    expect(optionsText.some(t => t.includes('Site Survey Engineer'))).toBe(true)
    expect(optionsText.some(t => t.includes('Warehouse Manager'))).toBe(true)
    expect(optionsText.some(t => t.includes('Finance Controller'))).toBe(true)
    expect(optionsText.some(t => t.includes('Service Desk Support'))).toBe(true)

    // 3. Select Customer -> Operational Role dropdown must DISAPPEAR
    await customerBtn.click()
    await expect(page.locator('#role-select')).not.toBeVisible()
    await expect(page.getByText('Operational Role & Terminal')).not.toBeVisible()

    // 4. Select Admin -> Operational Role dropdown must remain HIDDEN
    await adminBtn.click()
    await expect(page.locator('#role-select')).not.toBeVisible()
    await expect(page.getByText('Operational Role & Terminal')).not.toBeVisible()
  })

  test('Requirement 3: Updated form labels', async ({ page }) => {
    // Email Address
    await expect(page.getByLabel('Email Address')).toBeVisible()
    await expect(page.getByText('Corporate Email Address')).not.toBeVisible()

    // Password
    await expect(page.getByLabel('Password', { exact: true })).toBeVisible()
    await expect(page.getByText('Security Credential / Token')).not.toBeVisible()

    // Submit button: LOGIN
    const submitBtn = page.locator('button[type="submit"]')
    await expect(submitBtn).toBeVisible()
    await expect(submitBtn).toHaveText(/LOGIN/i)
    await expect(page.getByText('Authenticate & Launch Workspace')).not.toBeVisible()

    // SSO buttons: Google and Microsoft Azure AD
    await expect(page.getByRole('button', { name: 'Google', exact: true })).toBeVisible()
    await expect(page.getByRole('button', { name: /Microsoft Azure AD/i })).toBeVisible()
    await expect(page.getByText('Okta Enterprise SSO')).not.toBeVisible()
  })

  test('Requirement 4: Functional login flows for all 3 profiles', async ({ page }) => {
    // 1. Admin login flow
    const adminBtn = page.getByRole('button', { name: 'Admin', exact: true })
    await adminBtn.click()
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL(/.*app\/dashboard/, { timeout: 10000 })

    // 2. Customer login flow
    await page.goto('/login')
    const customerBtn = page.getByRole('button', { name: 'Customer', exact: true })
    await customerBtn.click()
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL(/.*portal\/dashboard/, { timeout: 10000 })

    // 3. Employee login flow (Sales)
    await page.goto('/login')
    const employeeBtn = page.getByRole('button', { name: 'Employee', exact: true })
    await employeeBtn.click()
    await page.selectOption('#role-select', 'sales')
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL(/.*app\/crm\/leads/, { timeout: 10000 })
  })

  test('Requirement 5: Mobile responsiveness of updated login page', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/login')

    // Profile buttons visible and stack cleanly
    await expect(page.getByRole('button', { name: 'Admin', exact: true })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Employee', exact: true })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Customer', exact: true })).toBeVisible()

    // Test toggle on mobile
    await page.getByRole('button', { name: 'Employee', exact: true }).click()
    await expect(page.locator('#role-select')).toBeVisible()

    await page.getByRole('button', { name: 'Customer', exact: true }).click()
    await expect(page.locator('#role-select')).not.toBeVisible()

    // Check labels on mobile
    await expect(page.getByLabel('Email Address')).toBeVisible()
    await expect(page.getByLabel('Password', { exact: true })).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toHaveText(/LOGIN/i)
    await expect(page.getByRole('button', { name: 'Google', exact: true })).toBeVisible()
  })

  test('Requirement 6: Header contains Register button, search bar removed, navigates to /register', async ({ page }) => {
    await page.goto('/')

    // Header has "Register" button
    const headerRegisterBtn = page.locator('header nav').getByRole('link', { name: 'Register', exact: true })
    await expect(headerRegisterBtn).toBeVisible()

    // "Get Started" is removed from header
    await expect(page.locator('header nav').getByRole('link', { name: 'Get Started', exact: true })).not.toBeVisible()

    // Header search bar is removed
    await expect(page.locator('header nav input[placeholder*="Search"]')).not.toBeVisible()

    // Clicking Register navigates to /register
    await headerRegisterBtn.click()
    await expect(page).toHaveURL(/.*register/, { timeout: 10000 })
    await expect(page.getByRole('heading', { name: 'Create Your Account' })).toBeVisible()
  })

  test('Requirement 7: Dedicated Registration Page collects details and handles registration flow', async ({ page }) => {
    await page.goto('/register')

    // Account Type options
    await expect(page.getByRole('button', { name: /Residential Customer/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /Commercial & Industrial/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /Solar Partner \/ EPC/i })).toBeVisible()

    // Form fields
    await expect(page.locator('#reg-name')).toBeVisible()
    await expect(page.locator('#reg-phone')).toBeVisible()
    await expect(page.locator('#reg-email')).toBeVisible()
    await expect(page.locator('#reg-password')).toBeVisible()
    await expect(page.locator('#reg-confirm-password')).toBeVisible()

    // Fill registration form
    await page.fill('#reg-name', 'Aditi Sharma')
    await page.fill('#reg-phone', '+91 9876543210')
    await page.fill('#reg-email', 'aditi.sharma@example.com')
    await page.fill('#reg-property', 'Green Acres Villa #4')
    await page.fill('#reg-address', 'Bengaluru, 560034')
    await page.fill('#reg-password', 'SolarSecure2026!')
    await page.fill('#reg-confirm-password', 'SolarSecure2026!')
    await page.check('input[type="checkbox"]')

    // Submit registration
    await page.click('button[type="submit"]')

    // Successful provisioning and redirect
    await expect(page).toHaveURL(/.*portal\/dashboard/, { timeout: 10000 })
  })

  test('Requirement 8: Bi-directional navigation between Login and Register', async ({ page }) => {
    // Start at login
    await page.goto('/login')
    const registerLink = page.getByRole('link', { name: /Register here/i })
    await expect(registerLink).toBeVisible()
    await registerLink.click()
    await expect(page).toHaveURL(/.*register/, { timeout: 10000 })

    // On register page, link to sign in
    await page.goto('/register')
    const signInLink = page.getByRole('link', { name: /Sign In here/i })
    await expect(signInLink).toBeVisible()
    await signInLink.click()
    // It toggles mode to login
    await expect(page.locator('#login-email')).toBeVisible()
  })

  test('Requirement 9: Side-by-side Login and Register action buttons and dynamic mode toggle', async ({ page }) => {
    await page.goto('/register')

    // On Register page, both LOGIN and REGISTER buttons are placed beside each other
    const registerBtn = page.locator('button[type="submit"]')
    const loginSwitchBtn = page.getByRole('button', { name: /^LOGIN$/i })
    await expect(registerBtn).toBeVisible()
    await expect(registerBtn).toHaveText(/REGISTER/i)
    await expect(loginSwitchBtn).toBeVisible()

    // Clicking LOGIN switches form to Sign In / Login mode
    await loginSwitchBtn.click()
    await expect(page.locator('#login-email')).toBeVisible()
    await expect(page.locator('#login-password')).toBeVisible()

    // Now submit button is LOGIN, and REGISTER switch button is beside it
    const loginSubmitBtn = page.locator('button[type="submit"]')
    const registerSwitchBtn = page.getByRole('button', { name: /^REGISTER$/i })
    await expect(loginSubmitBtn).toHaveText(/LOGIN/i)
    await expect(registerSwitchBtn).toBeVisible()

    // Clicking REGISTER switches back to Register mode
    await registerSwitchBtn.click()
    await expect(page.locator('#reg-name')).toBeVisible()
    await expect(page.locator('#reg-email')).toBeVisible()
  })
})



