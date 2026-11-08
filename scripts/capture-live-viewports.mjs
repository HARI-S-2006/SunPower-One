import { chromium } from 'playwright'

async function captureScreenshots() {
  const browser = await chromium.launch()
  const page = await browser.newPage()

  // Tablet 768x1024
  await page.setViewportSize({ width: 768, height: 1024 })
  await page.goto('https://sunpower-one.netlify.app/solutions', { waitUntil: 'networkidle' })
  await page.screenshot({ path: 'docs/screenshots/live-production/audit-tablet-768.png', fullPage: false })

  // Mobile 390x844
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('https://sunpower-one.netlify.app/contact', { waitUntil: 'networkidle' })
  await page.screenshot({ path: 'docs/screenshots/live-production/audit-mobile-390.png', fullPage: false })

  // Customer Portal Live
  await page.goto('https://sunpower-one.netlify.app/login', { waitUntil: 'networkidle' })
  await page.getByRole('button', { name: 'Customer', exact: true }).click()
  await page.click('button[type="submit"]')
  await page.waitForURL('**/portal/dashboard')
  await page.screenshot({ path: 'docs/screenshots/live-production/audit-customer-portal.png' })

  // ERP Commands Live
  await page.goto('https://sunpower-one.netlify.app/login', { waitUntil: 'networkidle' })
  await page.getByRole('button', { name: 'Admin', exact: true }).click()
  await page.click('button[type="submit"]')
  await page.waitForURL('**/app/dashboard')
  await page.screenshot({ path: 'docs/screenshots/live-production/audit-erp-command.png' })

  await browser.close()
  console.log('Screenshots captured successfully!')
}

captureScreenshots().catch(console.error)

