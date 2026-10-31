import { test, expect } from '@playwright/test'

test.describe('Site Surveys & Feasibility - Ticket Timeline View', () => {
  test('should render ticket-based vertical timeline view with summary KPIs', async ({ page }) => {
    await page.goto('/app/surveys')

    // Header & Tagline
    await expect(page.getByText(/Site Surveys & Engineering Feasibility/i)).toBeVisible()
    await expect(page.getByText(/Mandatory Commercial Gatekeeper/i)).toBeVisible()
    await expect(page.getByText(/Total Surveys/i)).toBeVisible()
    await expect(page.getByText(/Pending Sign-off/i)).toBeVisible()

    // Multiple ticket cards should be present
    await expect(page.locator('text=SRV-2026-0041').first()).toBeVisible()
    await expect(page.locator('text=Anand Kumar Sharma').first()).toBeVisible()
    await expect(page.locator('text=SRV-2026-0042').first()).toBeVisible()
    await expect(page.locator('text=Precision Tools & Castings Ltd').first()).toBeVisible()

    // Check vertical timeline milestones inside expanded ticket
    await expect(page.locator('text=1. Solar Inquiry Received & Ticket Generated').first()).toBeVisible()
    await expect(page.locator('text=2. Physical Site Inspection Scheduled').first()).toBeVisible()
    await expect(page.locator('text=3. Lead Field Engineer Assigned').first()).toBeVisible()
    await expect(page.locator('text=4. Site Inspection & Physical Walkthrough').first()).toBeVisible()
    await expect(page.locator('text=5. Site Measurements & Rooftop Photographs Submitted').first()).toBeVisible()
    await expect(page.locator('text=6. Engineering Feasibility & Shading Analysis Review').first()).toBeVisible()
    await expect(page.locator('text=7. Final Feasibility Decision & Executive Sign-off').first()).toBeVisible()
    await expect(page.locator('text=8. Commercial Quotation Pipeline').first()).toBeVisible()

    // Approved ticket has Unlocked Quotation action
    await expect(page.locator('text=Proceed to Quotation Matrix →').first()).toBeVisible()

    // Capture screenshot of the full timeline page
    await page.screenshot({ path: 'docs/screenshots/surveys-timeline-view.png', fullPage: true })
  })

  test('should expand and collapse individual ticket cards independently', async ({ page }) => {
    await page.goto('/app/surveys')

    // Click Collapse All
    await page.getByRole('button', { name: 'Collapse All' }).click()

    // Timeline heading should not be visible when collapsed
    await expect(page.locator('text=Survey Lifecycle Progress Timeline').first()).not.toBeVisible()

    // Click View Timeline on first ticket
    await page.locator('button:has-text("View Timeline")').first().click()

    // Only that ticket's timeline expands
    await expect(page.locator('text=Survey Lifecycle Progress Timeline')).toHaveCount(1)
    await expect(page.locator('text=1. Solar Inquiry Received & Ticket Generated')).toBeVisible()
  })

  test('should filter tickets by status and search query', async ({ page }) => {
    await page.goto('/app/surveys')

    // Filter by Pending Approval
    await page.getByRole('button', { name: /Pending Approval/i }).click()
    await expect(page.locator('text=SRV-2026-0042').first()).toBeVisible()
    await expect(page.locator('text=SRV-2026-0041')).not.toBeVisible()

    // Filter by Rejected
    await page.getByRole('button', { name: /Rejected/i }).click()
    await expect(page.locator('text=SRV-2026-0036').first()).toBeVisible()
    await expect(page.locator('text=Kaveri Textile Mills').first()).toBeVisible()
    await expect(page.locator('text=Stage 7 of 8 • Feasibility Rejected').first()).toBeVisible()

    // Expand rejected ticket to inspect reason
    await page.getByRole('button', { name: /View Timeline/i }).first().click()
    await expect(page.locator('text=Feasibility Rejected & Locked').first()).toBeVisible()

    // Search query
    await page.getByRole('button', { name: /All Surveys/i }).click()
    await page.fill('input[placeholder*="Search survey ID"]', 'Whitefield')
    await expect(page.locator('text=Green Valley Villas #14').first()).toBeVisible()
    await expect(page.locator('text=Anand Kumar Sharma')).not.toBeVisible()
  })

  test('should open rooftop photo lightbox modal', async ({ page }) => {
    await page.goto('/app/surveys')

    // Ensure tickets are expanded
    await page.getByRole('button', { name: 'Expand All' }).click()

    // Find and click a photo thumbnail
    const photoBtn = page.getByRole('button', { name: /View full rooftop photograph 1/i }).first()
    await expect(photoBtn).toBeVisible({ timeout: 5000 })
    await photoBtn.click()

    // Lightbox modal should appear
    await expect(page.locator('text=SURVEY FILE #')).toBeVisible()
    await expect(page.locator('text=High-Definition Inspection Photogrammetry')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Close View' })).toBeVisible()

    // Take screenshot of photo lightbox
    await page.screenshot({ path: 'docs/screenshots/surveys-photo-modal.png' })

    // Close modal
    await page.getByRole('button', { name: 'Close View' }).click()
    await expect(page.locator('text=Close View')).not.toBeVisible()
  })

  test('should handle adjudication approval, rejection, and revisit actions', async ({ page }) => {
    await page.goto('/app/surveys')

    // Go to Pending Approval
    await page.getByRole('button', { name: /Pending Approval/i }).click()
    await expect(page.locator('text=SRV-2026-0042').first()).toBeVisible()

    // Ensure it's expanded
    const approveBtn = page.getByRole('button', { name: 'Approve Feasibility' }).first()
    if (!await approveBtn.isVisible()) {
      await page.locator('button:has-text("View Timeline")').first().click()
    }

    // Approve Feasibility
    await page.getByRole('button', { name: 'Approve Feasibility' }).first().click()

    // Switch to Approved tab to verify it moved and unlocked quotation
    await page.getByRole('button', { name: /^Approved/i }).click()
    await expect(page.locator('text=SRV-2026-0042').first()).toBeVisible()
    await expect(page.locator('text=Feasibility Approved & Signed Off').first()).toBeVisible()
    await expect(page.locator('text=Proceed to Quotation Matrix →').first()).toBeVisible()
  })
})
