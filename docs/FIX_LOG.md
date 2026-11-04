# SunPower One - Engineering Fix Log & Defect Remediation Register

**Project:** SunPower One - Enterprise Solar Installation Platform  
**Evaluation:** Ralph Loop Defect & Quality Verification Cycles (12 Iterations)  
**Total Fixes:** 16  
**Status:** **100% VERIFIED & TESTED**

---

## 1. Summary of Defect Fixes

| ID | Component | Severity | Description | Status |
| :--- | :--- | :---: | :--- | :---: |
| **FIX-001** | `tests/e2e` | P1 | Playwright async test runner syntax error resolution. | **VERIFIED** |
| **FIX-002** | `LoginPage.tsx` | P2 | Added role selector simulation tabs for 8 distinct enterprise roles. | **VERIFIED** |
| **FIX-003** | `RequestSurveyPage.tsx` | P1 | Connected public survey inquiry form to CRM lead pipeline store. | **VERIFIED** |
| **FIX-004** | `tests/e2e` | P2 | Replaced non-specific Playwright strict-mode DOM locators. | **VERIFIED** |
| **FIX-005** | `netlify.toml` | P0 | Added Netlify SPA rewrite rule to eliminate deep-route 404s. | **VERIFIED** |
| **FIX-006** | `calculator.ts` | P1 | Corrected PM Surya Ghar subsidy rule for non-residential categories. | **VERIFIED** |
| **FIX-007** | `ConfiguratorPage.tsx` | P1 | Added commercial category toggle with Section 32 tax disclaimer. | **VERIFIED** |
| **FIX-008** | `BomPage.tsx` | P2 | Standardized BOM calculations and tax line item precision. | **VERIFIED** |
| **FIX-009** | `QuotationsPage.tsx` | P1 | Enforced mandatory survey approval gating before quotation issuance. | **VERIFIED** |
| **FIX-010** | `DispatchPage.tsx` | P1 | Prevented duplicate hardware serial dispatch with atomic checks. | **VERIFIED** |
| **FIX-011** | `TechnicianPages.tsx` | P1 | Enforced mandatory checklist items and signature canvas before completion. | **VERIFIED** |
| **FIX-012** | `ServiceDeskPage.tsx` | P2 | Gated service ticket closure behind explicit customer confirmation. | **VERIFIED** |
| **FIX-013** | `App.tsx` | P2 | Standardized `/portal/warranties` and `/portal/warranty` routing aliases. | **VERIFIED** |
| **FIX-014** | `SurveysPage.tsx` & `PortalPages.tsx` | P0 | Fixed external Unsplash network failure; added local assets and Base64 SVGs. | **VERIFIED** |
| **FIX-015** | `solarStore.tsx` & `AppLayout.tsx` | P1 | Unified reactive user account database; eliminated Header vs Sidebar mismatch. | **VERIFIED** |
| **FIX-016** | `CustomerPortal` (All 7 Pages) | P1 | Synchronized single customer profile (`Siddharth Varma`, `AZ-8422`) across portals. | **VERIFIED** |

---

## 2. Detailed Technical Fix Reports (Cycles 14-16)

### FIX-014: Rooftop Survey Photogrammetry Asset Stabilization
- **Date:** 2026-11-04
- **Severity:** P0 (Critical Visual Integrity)
- **Files Modified:**
  - `src/lib/assets/photogrammetrySvgs.ts`
  - `src/pages/app/surveys/SurveysPage.tsx`
  - `src/pages/portal/PortalPages.tsx`
  - `src/lib/store/solarStore.tsx`
- **Issue:** Section 5 in Site Surveys and Portal Installation commissioning gallery displayed broken image placeholder icons when external CDNs failed or were blocked by client network policies.
- **Root Cause:** Hardcoded reliance on third-party Unsplash URLs without local hosting or offline fallback primitives.
- **Solution:**
  1. Staged 8 photographic JPEG inspection assets in `public/images/surveys/`.
  2. Implemented pure Base64 SVGs (`DEFAULT_SURVEY_PHOTOS`, `FALLBACK_PHOTO_SVG`) that render immediately in all browsers without network requests.
  3. Added inline `onError` self-healing handlers on all `<img>` elements.
  4. Sanitized localStorage store parser on hydration.
- **Verification:** `tests/e2e/deep-audit-inspector.spec.ts` verified `naturalWidth > 0` across all 48 routes with 0 broken images.

### FIX-015: Dynamic Multi-Role Authentication State Unification
- **Date:** 2026-11-04
- **Severity:** P1 (Functional RBAC)
- **Files Modified:** `src/lib/store/solarStore.tsx`, `src/components/layout/AppLayout.tsx`, `src/pages/app/settings/SettingsPage.tsx`
- **Issue:** Authenticating as Sales Executive (Elena Rostova) updated the top header, but the sidebar footer persistently rendered Marcus Vance (Executive Director).
- **Solution:** Extracted hardcoded static director labels in sidebar into a reactive `currentUser` store subscription, guaranteeing that whenever a user logs in or switches accounts, both Header and Sidebar update synchronously.
- **Verification:** Verified in `tests/e2e/comprehensive-audit-and-database.spec.ts` for all 8 operational roles.

### FIX-016: Customer Portal Unified Profile Data Centralization
- **Date:** 2026-11-04
- **Severity:** P1 (Data Consistency)
- **Files Modified:** `src/lib/store/solarStore.tsx`, `src/pages/portal/PortalPages.tsx`
- **Issue:** Sidebar displayed "Anand Kumar" while Quotations, Active Orders, and Account Profile displayed "Siddharth Varma".
- **Solution:** Bound all 7 customer portal pages and sidebar navigation to a unified reactive `customerProfile` object (`name: "Siddharth Varma"`, `id: "AZ-8422"`, `phone: "+91 98860 33412"`, `email: "customer@demo.com"`, `capacity: "4.3 kW On-Grid"`).
- **Verification:** Verified in `tests/e2e/comprehensive-audit-and-database.spec.ts` across Dashboard, Quotations, Orders, Equipment, Warranty, Support, and Profile.
