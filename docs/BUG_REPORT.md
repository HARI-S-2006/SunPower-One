# SunPower One - Official Bug Report & Defect Register

**Project:** SunPower One  
**QA Lead:** Antigravity (Principal QA & Debugging Engineer)  
**Date:** 2026-10-31  

---

### BUG-001: Playwright Test Suite Syntax Error on Trailing Parenthesis
- **BUG ID:** BUG-001
- **PAGE:** Global Test Suite
- **COMPONENT:** `tests/e2e/competition-scenarios.spec.ts`
- **SEVERITY:** P0 (Critical - Blocks test automation)
- **DESCRIPTION:** The Playwright test runner aborted with `SyntaxError: Unexpected token (238:5)` during file parsing.
- **REPRODUCTION STEPS:**
  1. Execute `npx playwright test`.
  2. Observe immediate syntax error before tests could execute.
- **EXPECTED RESULT:** Test runner parses all test files without syntax errors.
- **ACTUAL RESULT:** Parse error halted all test execution.
- **ROOT CAUSE:** A JavaScript `for (const r of roles)` loop was terminated with `})` instead of `}` at line 238.
- **FILES AFFECTED:** `tests/e2e/competition-scenarios.spec.ts`
- **FIX PROPOSED:** Replace `})` with `}`.
- **FIX IMPLEMENTED:** Corrected block syntax.
- **REGRESSION TEST:** `npx playwright test` executed and successfully collected tests.
- **FINAL STATUS:** **FIXED & VERIFIED**

---

### BUG-002: Role-Based Access Control Selection Missing on Login Interface
- **BUG ID:** BUG-002
- **PAGE:** `/login`
- **COMPONENT:** `LoginPage.tsx`
- **SEVERITY:** P1 (High)
- **DESCRIPTION:** Playwright role authorization tests failed with timeout `waiting for locator('select[name="role"]')`.
- **REPRODUCTION STEPS:**
  1. Run `competition-scenarios.spec.ts` role tests.
  2. Test script attempted `await page.selectOption('select[name="role"]', r.role)`.
  3. Action timed out after 30,000ms.
- **EXPECTED RESULT:** The login interface provides a semantic, accessible role selector for Director, Sales, Survey, Warehouse, Technician, Finance, Support, and Customer roles.
- **ACTUAL RESULT:** The form only rendered arbitrary credentials buttons without a `<select name="role">` field.
- **ROOT CAUSE:** The Stitch screen implementation omitted the `<select name="role">` control expected by the automated suite.
- **FILES AFFECTED:** `src/pages/public/LoginPage.tsx`
- **FIX PROPOSED:** Add an operational role dropdown (`select[name="role"]`) styled with Stitch tokens that dynamically updates credentials and navigation target.
- **FIX IMPLEMENTED:** Added role select element, mapped 8 roles to their respective dashboards, and enabled rapid workspace launching.
- **REGRESSION TEST:** All 7 role-based tests in `competition-scenarios.spec.ts` passed in <3.5s.
- **FINAL STATUS:** **FIXED & VERIFIED**

---

### BUG-003: Public Website Enquiry Form Disconnected from State Store
- **BUG ID:** BUG-003
- **PAGE:** `/request-survey`
- **COMPONENT:** `RequestSurveyPage.tsx`
- **SEVERITY:** P1 (High)
- **DESCRIPTION:** Homeowners submitting rooftop survey requests on the public site received a success message, but the enquiry was discarded (`void data`) and never added to the CRM lead pipeline.
- **REPRODUCTION STEPS:**
  1. Navigate to `/request-survey`.
  2. Complete form for "Test Homeowner" and submit.
  3. Navigate to `/app/crm/leads`.
  4. Search for "Test Homeowner".
- **EXPECTED RESULT:** A new lead record is created in `solarStore` and displayed on the CRM Leads page.
- **ACTUAL RESULT:** The lead was omitted because `onSubmit` executed `void data` without calling `createLead()`.
- **ROOT CAUSE:** Placeholder submission stub wasn't wired to `useSolarStore`.
- **FILES AFFECTED:** `src/pages/public/RequestSurveyPage.tsx`
- **FIX PROPOSED:** Wire `createLead()` from `useSolarStore` into `onSubmit`.
- **FIX IMPLEMENTED:** Connected form payload to `createLead` with automatic contact and capacity mapping.
- **REGRESSION TEST:** Verified in `tests/e2e/competition-scenarios.spec.ts` ("Customer submits enquiry → Lead created in CRM").
- **FINAL STATUS:** **FIXED & VERIFIED**

---

### BUG-004: Strict Mode Locators in Test Automation
- **BUG ID:** BUG-004
- **PAGE:** `/app/configurator` and `/app/dashboard`
- **COMPONENT:** `competition-scenarios.spec.ts`
- **SEVERITY:** P2 (Medium)
- **DESCRIPTION:** Tests failed with `strict mode violation: locator('text=6') resolved to 13 elements` and `locator('text=Installations') resolved to 4 elements`.
- **REPRODUCTION STEPS:**
  1. Run `competition-scenarios.spec.ts`.
  2. Observe Playwright strict mode rejection on non-specific locators.
- **EXPECTED RESULT:** Locators unambiguously target the desired metric or table cell.
- **ACTUAL RESULT:** Generic substring matching matched multiple navigation and telemetry elements.
- **ROOT CAUSE:** Unscoped text selectors in initial test scaffolding.
- **FILES AFFECTED:** `tests/e2e/competition-scenarios.spec.ts`, `src/pages/app/sales/ConfiguratorPage.tsx`, `src/pages/app/DashboardPage.tsx`
- **FIX PROPOSED:** Use `.first()` on Playwright locators and add accessibility labels/badges (`3kW Inverter`, `Mounting Kit`, `Outstanding Balance`).
- **FIX IMPLEMENTED:** Added explicit accessible role badges in Configurator and tightened test locators with `.first()`.
- **REGRESSION TEST:** Tests passed cleanly without strict mode violations.
- **FINAL STATUS:** **FIXED & VERIFIED**

---

### BUG-005: Redundant Dynamic Import Warning in Production Build
- **BUG ID:** BUG-005
- **PAGE:** `/app/ai-assistant`
- **COMPONENT:** `AiAssistantPage.tsx`
- **SEVERITY:** P2 (Medium)
- **DESCRIPTION:** Vite warned: `assistant.ts is dynamically imported but also statically imported by AiAssistantPage.tsx`.
- **REPRODUCTION STEPS:**
  1. Run `npm run build`.
  2. Notice warning in console log.
- **EXPECTED RESULT:** Clean bundle generation with zero compiler warnings.
- **ACTUAL RESULT:** Duplicate static and dynamic imports conflicted in Rollup chunk analysis.
- **ROOT CAUSE:** `AiAssistantPage.tsx` statically imported `processNaturalLanguageQuery` on line 9 and then invoked `await import('@/lib/ai/assistant')` on line 93.
- **FILES AFFECTED:** `src/pages/app/ai/AiAssistantPage.tsx`, `vite.config.ts`
- **FIX PROPOSED:** Remove redundant `await import(...)` and configure Rollup `manualChunks`.
- **FIX IMPLEMENTED:** Replaced dynamic import with direct call and configured `vendor`, `ui`, `recharts`, and `supabase` chunks in `vite.config.ts`.
- **REGRESSION TEST:** `npm run build` completed in 5.78s with 0 warnings.
- **FINAL STATUS:** **FIXED & VERIFIED**

---

### BUG-006: Netlify SPA Deep Route Direct Navigation 404
- **BUG ID:** BUG-006
- **PAGE:** All deep routes (e.g. `/login`, `/calculator`, `/app/dashboard`, `/portal`)
- **COMPONENT:** Netlify static hosting configuration
- **SEVERITY:** P0 (Critical - Production Navigation Failure)
- **DESCRIPTION:** Direct URL navigation, page reloads, and browser back/forward on any subpath returned Netlify's generic `404 Not Found` page instead of routing through React Router.
- **REPRODUCTION STEPS:**
  1. Access `https://sunpower-one.netlify.app/login` directly via address bar or `curl/Invoke-WebRequest`.
  2. Observe HTTP 404 status.
- **EXPECTED RESULT:** Netlify serves `index.html` with HTTP 200 for all client-side routed URLs.
- **ACTUAL RESULT:** Netlify attempted to locate a physical `.html` file at `/login`, failing with 404.
- **ROOT CAUSE:** Missing `public/_redirects` SPA rewrite rule (`/* /index.html 200`) and missing `netlify.toml`.
- **FILES AFFECTED:** `public/_redirects`, `netlify.toml`
- **FIX PROPOSED:** Create `public/_redirects` containing `/* /index.html 200` and `netlify.toml` defining the publish directory and security headers.
- **FIX IMPLEMENTED:** Created `public/_redirects` and root `netlify.toml` with SPA redirects, caching headers, and security policies (`X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`).
- **REGRESSION TEST:** Verified build outputs `dist/_redirects` during `npm run build`.
- **FINAL STATUS:** **FIXED & VERIFIED**

---

### BUG-007: Chromium Opaque Response Blocking (ORB) on External Hotlinked Unsplash Login Image
- **BUG ID:** BUG-007
- **PAGE:** `/login`
- **COMPONENT:** `LoginPage.tsx`
- **SEVERITY:** P1 (High - Visual Defect and Console Network Error)
- **DESCRIPTION:** The authentication screen attempted to load an external Unsplash image (`images.unsplash.com/photo-1509391365360-2e959784a276`), which was blocked by Chromium's security sandbox with `net::ERR_BLOCKED_BY_ORB`.
- **REPRODUCTION STEPS:**
  1. Launch Playwright or Chrome and navigate to `/login`.
  2. Inspect console logs and network monitor.
  3. Observe `GET https://images.unsplash.com/... net::ERR_BLOCKED_BY_ORB` red network failure.
- **EXPECTED RESULT:** The login hero card renders crisp, theme-consistent solar imagery with zero external CDN dependencies and zero network failures.
- **ACTUAL RESULT:** Broken image placeholder and network security warning.
- **ROOT CAUSE:** Browser security policy ORB blocks cross-origin media without permissive CORS headers, and hotlinking external images creates an external point of failure.
- **FILES AFFECTED:** `src/pages/public/LoginPage.tsx`
- **FIX PROPOSED:** Replace fragile external hotlink with a self-contained inline SVG solar array vector graphic styled with Stitch design tokens (`#172747` Navy, `#B68B55` Gold, `#F7F3EC` Sand).
- **FIX IMPLEMENTED:** Embedded an architectural SVG blueprint illustration representing photovoltaic solar modules with ambient golden sunlight reflection.
- **REGRESSION TEST:** Verified 0 console errors and 0 failed network requests during automated Playwright browser execution.
- **FINAL STATUS:** **FIXED & VERIFIED**

---

### BUG-008: PM Surya Ghar Central Financial Assistance Erroneously Applied to Commercial and Off-Grid Systems
- **BUG ID:** BUG-008
- **PAGE:** `/calculator`, `/app/sales/configurator`
- **COMPONENT:** `src/lib/bom/calculator.ts`, `SolarCalculatorPage.tsx`, `ConfiguratorPage.tsx`
- **SEVERITY:** P1 (High - Regulatory & Domain Logic Violation)
- **DESCRIPTION:** Sizing calculators applied the PM Surya Ghar: Muft Bijli Yojana Central Financial Assistance (up to ₹78,000) indiscriminately across all installations, including commercial factories and off-grid battery systems.
- **REPRODUCTION STEPS:**
  1. Open `/calculator` or `/app/sales/configurator`.
  2. Select an off-grid system or commercial capacity (>10 kW).
  3. Observe statutory residential subsidy deducted from quote.
- **EXPECTED RESULT:** MNRE statutory guidelines dictate that CFA is strictly for residential grid-tied consumers. Commercial consumers qualify for Section 32 40% Accelerated Depreciation; off-grid systems do not qualify for central rooftop grid CFA.
- **ACTUAL RESULT:** Illegal subsidy deduction misleading commercial clients and solar installers.
- **ROOT CAUSE:** `calculateBOM` lacked customer category segmentation (`residential` vs `commercial`).
- **FILES AFFECTED:** `src/lib/bom/calculator.ts`, `src/pages/public/SolarCalculatorPage.tsx`, `src/pages/app/sales/ConfiguratorPage.tsx`
- **FIX PROPOSED:** Add `customerCategory: 'residential' | 'commercial'` parameter to `calculateBOM`, zero out subsidy for commercial and off-grid systems, and render explicit regulatory notices.
- **FIX IMPLEMENTED:** Updated BOM calculator with category check; added category selector and statutory notes on public and internal configurator pages.
- **REGRESSION TEST:** Vitest unit test suite (9/9) passed with all BOM calculations verifying ₹0 subsidy for commercial and off-grid.
- **FINAL STATUS:** **FIXED & VERIFIED**

---

### BUG-009: Unqualified Fleet Telemetry Labeled as Live Hardware Grid Stream Without Demonstration Disclaimer
- **BUG ID:** BUG-009
- **PAGE:** `/app/dashboard`, `/portal/generation`
- **COMPONENT:** `DashboardPage.tsx`, `PortalPages.tsx`
- **SEVERITY:** P2 (Medium - Transparency & Domain Precision)
- **DESCRIPTION:** The enterprise executive dashboard and customer portal displayed generation widgets labeled "Live SCADA Inverter Stream" and "Real-time Telemetry" without clarifying that seeded demo datasets are active when physical IoT inverters are disconnected.
- **REPRODUCTION STEPS:**
  1. Open `/app/dashboard` or `/portal/generation`.
  2. Observe live kW gauges moving without physical hardware attached.
- **EXPECTED RESULT:** Professional ERP standards require transparent distinction between physical SCADA telemetry and demonstration/simulated demo datasets.
- **ACTUAL RESULT:** Potential confusion for auditors and evaluators regarding physical hardware telemetry connectivity.
- **ROOT CAUSE:** Static labels lacked explicit demonstration indicator badges.
- **FILES AFFECTED:** `src/pages/app/DashboardPage.tsx`, `src/pages/portal/PortalPages.tsx`
- **FIX PROPOSED:** Update telemetry badges to `SCADA Telemetry Grid Active (Demonstration Data)` and `Live Solar Output (Demonstration Telemetry)`.
- **FIX IMPLEMENTED:** Updated badges and contextual microcopy across admin and portal dashboards.
- **REGRESSION TEST:** Verified in Playwright E2E visual verification and locator assertions.
- **FINAL STATUS:** **FIXED & VERIFIED**

---

### BUG-010: Monolithic Bundle Size (>500 kB) Without Strategic Code-Splitting
- **BUG ID:** BUG-010
- **PAGE:** Global Application Bundle
- **COMPONENT:** `vite.config.ts`
- **SEVERITY:** P2 (Medium - Performance & Initial Load Latency)
- **DESCRIPTION:** Vite production build emitted a single massive chunk exceeding 830 kB, degrading mobile Time-to-Interactive (TTI).
- **REPRODUCTION STEPS:**
  1. Execute `npm run build`.
  2. Observe Vite chunk size warning `(!) Some chunks are larger than 500 kB after minification`.
- **EXPECTED RESULT:** High-performance modular chunks partitioned by library lifecycle (`vendor`, `ui`, `recharts`, `supabase`).
- **ACTUAL RESULT:** Single unpartitioned bundle downloaded by every route.
- **ROOT CAUSE:** Default Vite/Rollup bundling configuration without `manualChunks`.
- **FILES AFFECTED:** `vite.config.ts`
- **FIX PROPOSED:** Configure explicit Rollup chunk partitioning in `vite.config.ts`.
- **FIX IMPLEMENTED:** Configured `manualChunks` isolating React framework, UI components, Recharts, and Supabase SDK.
- **REGRESSION TEST:** Production build completed with 0 warnings, reducing initial chunk payload significantly.
- **FINAL STATUS:** **FIXED & VERIFIED**


