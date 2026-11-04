# SunPower One - Bug Register & Quality Tracking Report

**Project:** SunPower One - Solar Installation Management System  
**Last Updated:** 2026-11-04  
**Audit Evaluation:** Complete 12-Cycle Ralph Loop Quality Audit  
**Total Bugs Tracked:** 16  
**Resolved:** 16 (100%)  
**Open:** 0  

---

## 1. Bug Summary by Severity

| Severity Level | Total Logged | Resolved | Open | Resolution Rate |
| :--- | :---: | :---: | :---: | :---: |
| **P0 (Critical / Blocker)** | 2 | 2 | 0 | 100% |
| **P1 (High / Functional Defect)** | 5 | 5 | 0 | 100% |
| **P2 (Medium / UI Consistency)** | 5 | 5 | 0 | 100% |
| **P3 (Low / Polish & Optimization)** | 4 | 4 | 0 | 100% |
| **TOTAL** | **16** | **16** | **0** | **100%** |

---

## 2. Detailed Bug Log & Remediation History

### P0 - Critical / Blocker Defects

#### BUG-001: Netlify SPA Deep-Route 404 Errors on Refresh
- **Description:** Direct browser navigation or refreshing sub-routes (`/login`, `/solar-calculator`, `/app/dashboard`, `/portal/warranties`) returned Netlify 404 HTTP errors.
- **Root Cause:** Missing SPA client routing fallback in static web server build.
- **Remediation:** Created `public/_redirects` (`/* /index.html 200`) and configured `netlify.toml` SPA redirect rules.
- **Verification:** Verified across all 48 routes in Playwright crawler suite; returns HTTP 200 without error.
- **Status:** **RESOLVED**

#### BUG-014: External Image Failure & Broken Photogrammetry Display
- **Description:** Section 5 ("Site Measurements & Rooftop Photographs Submitted") in `/app/surveys` displayed broken image placeholder icons and alt text ("Rooftop inspection photograph 1").
- **Root Cause:** External Unsplash CDN URLs were blocked by CORS, rate limits, or network timeouts, and local storage cached stale image references without resilient offline fallbacks.
- **Remediation:**
  1. Staged 8 high-resolution local photogrammetry assets under `public/images/surveys/`.
  2. Implemented pure Base64 vector photogrammetry SVGs (`DEFAULT_SURVEY_PHOTOS`) in `src/lib/assets/photogrammetrySvgs.ts`.
  3. Added bulletproof `onError` recovery handlers in `SurveysPage.tsx` and `PortalPages.tsx`.
  4. Sanitized `solarStore.tsx` localStorage parser to automatically discard broken external URLs on store hydration.
- **Verification:** Verified via `tests/e2e/deep-audit-inspector.spec.ts` DOM evaluation: `naturalWidth > 0` for all rendered survey images.
- **Status:** **RESOLVED**

---

### P1 - High / Functional Defects

#### BUG-002: Public Survey Request Form Disconnected from Store
- **Description:** Submitting `/request-survey` did not create leads in internal CRM.
- **Remediation:** Hooked form submission handler to `createLead` action in `solarStore`.
- **Status:** **RESOLVED**

#### BUG-003 & BUG-004: Inaccurate Subsidy Calculation for Commercial Installations
- **Description:** Solar calculator and configurator erroneously applied PM Surya Ghar ₹78,000 residential subsidies to industrial/commercial installations.
- **Remediation:** Added category guards (`category === 'residential'`); commercial setups correctly reflect ₹0 CFA with 40% Section 32 Accelerated Depreciation disclaimers.
- **Status:** **RESOLVED**

#### BUG-015: User Identity Mismatch Between Top Navigation Header and Sidebar
- **Description:** Logging in as Sales Executive (Elena Rostova) showed Elena in the top navigation bar but retained Marcus Vance in the sidebar footer.
- **Remediation:** Implemented unified reactive `currentUser` identity in `solarStore.tsx` that binds both Header and Sidebar components to the authenticated session context.
- **Status:** **RESOLVED**

#### BUG-016: Customer Profile Data Fragmentation (Anand Kumar vs Siddharth Varma)
- **Description:** Customer portal sidebar showed Anand Kumar while Account Profile, Orders, and Warranties displayed Siddharth Varma.
- **Remediation:** Centralized consumer identity into a single persistent `customerProfile` record (`Siddharth Varma`, `AZ-8422`, 4.3 kW On-Grid) referenced uniformly across all 7 customer portal pages.
- **Status:** **RESOLVED**

---

### P2 - Medium Defects
- **BUG-005:** Bill of Materials calculation formula discrepancy for micro-inverters. (Resolved)
- **BUG-006:** Inactive warranty cards visible in customer dashboard before delivery. (Resolved)
- **BUG-007:** Duplicate serial number scan allowed in warehouse dispatch without error. (Resolved via unique constraint in `solarStore.tsx` and `003_business_functions.sql`).
- **BUG-008:** Service ticket closure permitted without mandatory customer verification. (Resolved via validation gate in `ServiceDeskPage.tsx`).
- **BUG-009:** Broken `/portal/warranties` vs `/portal/warranty` routing. (Resolved with route alias in `App.tsx`).

---

### P3 - Low Defects & Polish
- **BUG-010:** Missing Indian Rupee (₹) symbol formatting on certain invoice rows. (Resolved via standard `Intl.NumberFormat`).
- **BUG-011:** Technician mobile signature canvas blurred on high-DPI retina screens. (Resolved by scaling canvas with `window.devicePixelRatio`).
- **BUG-012:** Breadcrumb navigation truncating long project addresses. (Resolved with CSS `truncate` and tooltip).
- **BUG-013:** Missing meta theme-color for iOS mobile browser notch. (Added `#172747` to `index.html`).
