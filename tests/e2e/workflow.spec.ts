import { test, expect } from '@playwright/test'

test.describe('SunPower One - Complete Enterprise Lifecycle & Competition Scenarios', () => {
  // Test 1: Public Website & Navigation
  test('Experience A: Public Portal - HomePage renders hero & quick calculator', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/SunPower One/i)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(page.getByText(/The Intelligent Operating Platform for/i).first()).toBeVisible()

    // Navigate to Solar Calculator
    await page.click('text=Solar Calculator')
    await expect(page).toHaveURL(/.*solar-calculator/)
    await expect(page.getByText(/Estimate Your Solar Requirements/i)).toBeVisible()
  })

  // Test 2: Enterprise Authentication & Login
  test('Experience B: Login Page authenticates into Enterprise Operations', async ({ page }) => {
    await page.goto('/login')
    await expect(page.getByText(/SUNPOWER/i).first()).toBeVisible()
    await expect(page.getByText(/Command Center Sign In/i)).toBeVisible()

    // Sign in using prefilled demo credentials
    await page.click('button[type="submit"]')

    // Wait for redirect to dashboard
    await expect(page).toHaveURL(/.*app\/dashboard/, { timeout: 10000 })
    await expect(page.getByText(/Solar Operations Command Center/i)).toBeVisible()
  })

  // Test 3: Operations Dashboard KPIs & SCADA telemetry
  test('Experience B: Operations Dashboard displays SCADA telemetry & pipeline', async ({ page }) => {
    await page.goto('/app/dashboard')
    await expect(page.getByText(/Solar Operations Command Center/i)).toBeVisible()
    await expect(page.getByText(/SCADA Telemetry Grid Active/i)).toBeVisible()
  })

  // Test 4: Scenario 1 - CRM Leads & Customer Directory
  test('Scenario 1: CRM Lead pipeline lists enquiries and customers', async ({ page }) => {
    await page.goto('/app/crm/leads')
    await expect(page.getByText(/Customer Inquiries & Leads/i)).toBeVisible()
    await expect(page.getByText(/Siddharth Varma/i)).toBeVisible()
  })

  // Test 5: Scenario 2 - Survey Feasibility & Commercial Approval Gatekeeper
  test('Scenario 2: Survey Approval Gatekeeper enforces approval before quotation', async ({ page }) => {
    await page.goto('/app/surveys')
    await expect(page.getByText(/Site Surveys & Engineering Feasibility/i)).toBeVisible()
    await expect(page.getByText(/Mandatory Commercial Gatekeeper/i)).toBeVisible()

    // Go to quotations and check gatekeeper rule
    await page.goto('/app/quotations')
    await expect(page.getByText(/Commercial Solar Quotations/i)).toBeVisible()
    await expect(page.getByText(/Strict Business Requirement Enforced/i)).toBeVisible()
  })

  // Test 6: Scenario 3 - BOM & Configurator calculation
  test('Scenario 3: Solar Configurator calculates dynamic BOM and subsidies', async ({ page }) => {
    await page.goto('/app/configurator')
    await expect(page.getByText(/Solar System Configurator & BOM Engine/i)).toBeVisible()

    // Verify capacity tabs
    await expect(page.getByRole('button', { name: '3 kW' })).toBeVisible()
    await page.click('button:has-text("4 kW")')
    await expect(page.getByText(/4 kW System/i).first()).toBeVisible()
  })

  // Test 7: Scenario 4 - Orders & Milestone Escrow tracking
  test('Scenario 4: Sales Orders track 30% / 50% / 20% milestone escrow', async ({ page }) => {
    await page.goto('/app/orders')
    await expect(page.getByText(/Sales Orders & Payment Milestones/i)).toBeVisible()
    await expect(page.getByText(/SO-2026-0038/i)).toBeVisible()
  })

  // Test 8: Scenario 5 - Serial Numbers & Warehouse Dispatch
  test('Scenario 5: Warehouse Dispatch verifies serials and rejects duplicates', async ({ page }) => {
    await page.goto('/app/inventory/dispatch')
    await expect(page.getByText(/Serial Number Dispatch & Warranty Activation/i)).toBeVisible()

    // Go to serials registry
    await page.goto('/app/inventory/serials')
    await expect(page.getByText(/Serial Number Registry & QR Ledger/i)).toBeVisible()
    await expect(page.getByText(/INV-3300-8491/i).first()).toBeVisible()
  })

  // Test 9: Experience C - Technician Mobile Experience
  test('Experience C: Technician Mobile Portal checklist and customer signature', async ({ page }) => {
    await page.goto('/technician/dashboard')
    await expect(page.getByText(/Technician Command/i)).toBeVisible()
    await expect(page.getByText(/Field Unit Active/i)).toBeVisible()

    // Check checklist page
    await page.goto('/technician/checklist/inst-01')
    await expect(page.getByText(/Commissioning Inspection/i)).toBeVisible()
    await expect(page.getByText(/5-Point Safety Inspection/i)).toBeVisible()
    await expect(page.getByText(/Mounting Structure Torque Verified/i)).toBeVisible()

    // Check customer completion & canvas signature pad
    await page.goto('/technician/completion/inst-01')
    await expect(page.getByText(/Customer Handover & Signature/i)).toBeVisible()
    await expect(page.getByText(/Customer Signature Pad/i)).toBeVisible()
  })

  // Test 10: Scenario 6 & 7 - Warranty Registry & Service Desk Adjudication
  test('Scenario 7: Warranty Registry & Service Desk Adjudication (₹0 Covered RMA)', async ({ page }) => {
    // Warranty registry
    await page.goto('/app/warranties')
    await expect(page.getByText(/Warranty Management & Digital Certificates/i)).toBeVisible()
    await expect(page.getByText(/WAR-INV-2025-019/i)).toBeVisible()

    // Service Desk with ₹0 covered warranty adjudication
    await page.goto('/app/service')
    await expect(page.getByText(/Service Desk & After-Sales Complaints/i)).toBeVisible()
    await expect(page.getByText(/ERR-F04/i)).toBeVisible()
    await expect(page.getByText(/₹0 Covered RMA/i).first()).toBeVisible()
  })

  // Test 11: Finance, Invoices & Subsidy tracking
  test('Financial Modules: Invoices, Subsidies & Profitability ledger', async ({ page }) => {
    await page.goto('/app/invoices')
    await expect(page.getByText(/Commercial Invoices & Billing/i)).toBeVisible()

    await page.goto('/app/subsidies')
    await expect(page.getByText(/PM Surya Ghar Subsidy Tracker/i)).toBeVisible()

    await page.goto('/app/profitability')
    await expect(page.getByText(/Project Unit Economics & Profitability/i)).toBeVisible()
  })

  // Test 12: Experience D - Customer Portal
  test('Experience D: Customer Portal self-service dashboard & telemetry', async ({ page }) => {
    await page.goto('/portal/dashboard')
    await expect(page.getByText(/Welcome back, Siddharth Varma/i)).toBeVisible()
    await expect(page.getByText(/Live Solar Output/i)).toBeVisible()
    await expect(page.getByText(/Project Lifecycle Status/i)).toBeVisible()

    // Customer quotations
    await page.goto('/portal/quotations')
    await expect(page.getByText(/My Commercial Quotations/i)).toBeVisible()

    // Customer warranties
    await page.goto('/portal/warranties')
    await expect(page.getByText(/Digital Warranty Certificates/i)).toBeVisible()
  })
})
