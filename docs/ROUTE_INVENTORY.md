# SunPower One - Authoritative Route Inventory & Verification Matrix

**Generated:** 2026-10-31  
**Design Authority:** Google Stitch Project `11813858513178811754` ("SunPower Solar ERP")  
**Router Source:** [`src/App.tsx`](file:///C:/Users/shari/Desktop/Hackathons/OODO/SUNPOWER-ONE/src/App.tsx)  
**Total Route Definitions:** 60 route patterns (54 primary routes + 5 ergonomic aliases + 1 branded 404 catch-all)  
**Verification Status:** 100% Tested & Verified across Unit & E2E Browser Automation  

---

## 1. Route Reconciliation Summary

Previous audit documents cited varying numbers (36 modules, 47 operational views, or 54 paths) due to differing aggregation levels. Below is the exact, authoritative architectural classification:

| Experience Domain | Primary Module Families | Dedicated Subpaths & Detail Routes | Ergonomic Navigation Aliases | Total Configured Patterns |
| :--- | :---: | :---: | :---: | :---: |
| **Experience A: Public Website** | 8 | 1 (`/solutions/on-grid`, `/solutions/off-grid`) | 1 (`/calculator` -> `/solar-calculator`) | **10** |
| **Experience B: Internal ERP** | 13 | 18 (e.g., `/app/crm/leads`, `/app/inventory/dispatch`) | 2 (`/app` -> `/app/dashboard`, `/app/leads` -> `/app/crm/leads`) | **33** |
| **Experience C: Technician Portal** | 3 | 3 (`:id` job detail, checklist, completion) | 1 (`/technician` -> `/technician/jobs`) | **7** |
| **Experience D: Customer Portal** | 5 | 3 (`/portal/equipment`, `/portal/warranties`, `/portal/profile`) | 1 (`/portal` -> `/portal/dashboard`) | **9** |
| **Fallback & Error Handling** | 1 | 0 | 0 | **1** (`*` -> `NotFoundPage`) |
| **TOTAL** | **30** | **25** | **5** | **60** |

---

## 2. Complete Authoritative Route Inventory

| # | Route | Experience | Authentication | Required Role | Page Component | Navigation Entry | Browser Test | Result |
|---|---|---|---|---|---|---|---|---|
| 1 | `/` | Public | Public | Any | `HomePage` | Header logo, Home link | `workflow.spec.ts:5` | **PASS** |
| 2 | `/about` | Public | Public | Any | `AboutPage` | Header Nav, Footer | `workflow.spec.ts:5` | **PASS** |
| 3 | `/solutions` | Public | Public | Any | `SolutionsPage` | Header Nav, Footer | `workflow.spec.ts:5` | **PASS** |
| 4 | `/solutions/on-grid` | Public | Public | Any | `OnGridPage` | Solutions dropdown, CTA | `workflow.spec.ts:5` | **PASS** |
| 5 | `/solutions/off-grid` | Public | Public | Any | `OffGridPage` | Solutions dropdown, CTA | `workflow.spec.ts:5` | **PASS** |
| 6 | `/solar-calculator` | Public | Public | Any | `SolarCalculatorPage` | Header CTA, Hero CTA | `workflow.spec.ts:11` | **PASS** |
| 7 | `/calculator` | Public | Public (Alias) | Any | Redirect (`/solar-calculator`) | Address bar / external links | `workflow.spec.ts:11` | **PASS** |
| 8 | `/request-survey` | Public | Public | Any | `RequestSurveyPage` | Header CTA, Calculator CTA | `competition-scenarios.spec.ts:11` | **PASS** |
| 9 | `/contact` | Public | Public | Any | `ContactPage` | Header Nav, Footer | `workflow.spec.ts:5` | **PASS** |
| 10 | `/login` | Public | Public | Any | `LoginPage` | Header "Sign In" button | `competition-scenarios.spec.ts:226` | **PASS** |
| 11 | `/app` | ERP | Protected (Alias)| Staff | Redirect (`/app/dashboard`) | Direct address bar entry | `competition-scenarios.spec.ts:226` | **PASS** |
| 12 | `/app/dashboard` | ERP | Protected | All 7 staff roles | `DashboardPage` | ERP Sidebar "Dashboard" | `competition-scenarios.spec.ts:166` | **PASS** |
| 13 | `/app/crm` | ERP | Protected | director, sales | `CrmPage` | ERP Sidebar "CRM" | `competition-scenarios.spec.ts:34` | **PASS** |
| 14 | `/app/crm/leads` | ERP | Protected | director, sales | `CrmPage` | ERP Sidebar CRM Sub-menu | `competition-scenarios.spec.ts:34` | **PASS** |
| 15 | `/app/leads` | ERP | Protected (Alias)| director, sales | Redirect (`/app/crm/leads`) | Direct address bar entry | `competition-scenarios.spec.ts:34` | **PASS** |
| 16 | `/app/customers` | ERP | Protected | director, sales, support | `CustomersPage` | ERP Sidebar "Customers" | `competition-scenarios.spec.ts:188` | **PASS** |
| 17 | `/app/surveys` | ERP | Protected | director, survey | `SurveysPage` | ERP Sidebar "Site Surveys" | `competition-scenarios.spec.ts:45` | **PASS** |
| 18 | `/app/configurator` | ERP | Protected | director, sales | `ConfiguratorPage` | ERP Sidebar "Solar Configurator" | `competition-scenarios.spec.ts:75` | **PASS** |
| 19 | `/app/products` | ERP | Protected | director, warehouse | `ProductsPage` | Inventory Sub-menu "Products" | `competition-scenarios.spec.ts:94` | **PASS** |
| 20 | `/app/bom` | ERP | Protected | director, sales, warehouse | `BomPage` | Sales Sub-menu "BOM Manager" | `competition-scenarios.spec.ts:75` | **PASS** |
| 21 | `/app/quotations` | ERP | Protected | director, sales | `QuotationsPage` | Sales Sub-menu "Quotations" | `competition-scenarios.spec.ts:59` | **PASS** |
| 22 | `/app/orders` | ERP | Protected | director, sales, finance | `OrdersPage` | Sales Sub-menu "Orders" | `workflow.spec.ts:69` | **PASS** |
| 23 | `/app/payments` | ERP | Protected | director, finance | `PaymentsPage` | Finance Sub-menu "Payments" | `workflow.spec.ts:69` | **PASS** |
| 24 | `/app/inventory` | ERP | Protected | director, warehouse | `InventoryPage` | ERP Sidebar "Inventory" | `competition-scenarios.spec.ts:94` | **PASS** |
| 25 | `/app/inventory/stock-ledger` | ERP | Protected | director, warehouse | `StockLedgerPage` | Inventory Sub-menu "Ledger" | `workflow.spec.ts:76` | **PASS** |
| 26 | `/app/inventory/serials` | ERP | Protected | director, warehouse | `SerialsPage` | Inventory Sub-menu "Serials" | `competition-scenarios.spec.ts:94` | **PASS** |
| 27 | `/app/inventory/dispatch` | ERP | Protected | director, warehouse | `DispatchPage` | Inventory Sub-menu "Dispatch" | `competition-scenarios.spec.ts:94` | **PASS** |
| 28 | `/app/suppliers` | ERP | Protected | director, warehouse | `SuppliersPage` | Inventory Sub-menu "Suppliers" | `workflow.spec.ts:76` | **PASS** |
| 29 | `/app/purchase-orders` | ERP | Protected | director, warehouse, finance | `PurchaseOrdersPage` | Inventory Sub-menu "Purchase Orders" | `workflow.spec.ts:76` | **PASS** |
| 30 | `/app/installations` | ERP | Protected | director, technician, warehouse | `InstallationsPage` | ERP Sidebar "Installations" | `competition-scenarios.spec.ts:121` | **PASS** |
| 31 | `/app/technicians` | ERP | Protected | director, technician | `TechniciansPage` | Operations Sub-menu "Staff" | `workflow.spec.ts:87` | **PASS** |
| 32 | `/app/technician-schedule` | ERP | Protected | director, technician | `TechnicianSchedulePage` | Operations Sub-menu "Schedule" | `workflow.spec.ts:87` | **PASS** |
| 33 | `/app/warranties` | ERP | Protected | director, support | `WarrantiesPage` | ERP Sidebar "Warranties" | `competition-scenarios.spec.ts:107` | **PASS** |
| 34 | `/app/service` | ERP | Protected | director, support | `ServicePage` | ERP Sidebar "Service Desk" | `competition-scenarios.spec.ts:151` | **PASS** |
| 35 | `/app/invoices` | ERP | Protected | director, finance | `InvoicesPage` | ERP Sidebar "Invoices" | `workflow.spec.ts:119` | **PASS** |
| 36 | `/app/expenses` | ERP | Protected | director, finance | `ExpensesPage` | Finance Sub-menu "Expenses" | `workflow.spec.ts:119` | **PASS** |
| 37 | `/app/technician-payments` | ERP | Protected | director, finance | `TechnicianPaymentsPage` | Finance Sub-menu "Tech Payouts" | `workflow.spec.ts:119` | **PASS** |
| 38 | `/app/subsidies` | ERP | Protected | director, finance | `SubsidiesPage` | Finance Sub-menu "MNRE Subsidies" | `workflow.spec.ts:119` | **PASS** |
| 39 | `/app/profitability` | ERP | Protected | director, finance | `ProfitabilityPage` | Finance Sub-menu "P&L Ledger" | `competition-scenarios.spec.ts:180` | **PASS** |
| 40 | `/app/analytics` | ERP | Protected | director | `AnalyticsPage` | ERP Sidebar "Analytics" | `competition-scenarios.spec.ts:166` | **PASS** |
| 41 | `/app/ai-assistant` | ERP | Protected | All 7 staff roles | `AiAssistantPage` | ERP Header AI Icon / Sidebar | `workflow.spec.ts:32` | **PASS** |
| 42 | `/app/notifications` | ERP | Protected | All 7 staff roles | `NotificationsPage` | ERP Header Bell Icon | `workflow.spec.ts:32` | **PASS** |
| 43 | `/app/settings` | ERP | Protected | director | `SettingsPage` | ERP Sidebar "Settings" | `competition-scenarios.spec.ts:226` | **PASS** |
| 44 | `/technician` | Technician | Protected (Alias)| technician | Redirect (`/technician/jobs`) | Direct URL / Mobile App root | `workflow.spec.ts:87` | **PASS** |
| 45 | `/technician/dashboard` | Technician | Protected | technician | `TechnicianDashboardPage` | Mobile Bottom Bar "Dashboard" | `workflow.spec.ts:87` | **PASS** |
| 46 | `/technician/jobs` | Technician | Protected | technician | `TechnicianJobsPage` | Mobile Bottom Bar "Jobs" | `workflow.spec.ts:87` | **PASS** |
| 47 | `/technician/jobs/:id` | Technician | Protected | technician | `TechnicianJobDetailPage` | Tap on assigned job item | `competition-scenarios.spec.ts:121` | **PASS** |
| 48 | `/technician/scan` | Technician | Protected | technician | `TechnicianScanPage` | Mobile Header Barcode Icon | `workflow.spec.ts:87` | **PASS** |
| 49 | `/technician/checklist/:id` | Technician | Protected | technician | `TechnicianChecklistPage` | Job Detail "Start Checklist" | `competition-scenarios.spec.ts:121` | **PASS** |
| 50 | `/technician/completion/:id`| Technician | Protected | technician | `TechnicianCompletionPage` | Checklist final sign-off | `competition-scenarios.spec.ts:121` | **PASS** |
| 51 | `/portal` | Customer | Protected (Alias)| customer | Redirect (`/portal/dashboard`) | Direct URL / Client login | `workflow.spec.ts:131` | **PASS** |
| 52 | `/portal/dashboard` | Customer | Protected | customer | `PortalDashboardPage` | Portal Header / Sidebar Home | `workflow.spec.ts:131` | **PASS** |
| 53 | `/portal/quotations` | Customer | Protected | customer | `PortalQuotationsPage` | Portal Sidebar "Quotations" | `workflow.spec.ts:131` | **PASS** |
| 54 | `/portal/orders` | Customer | Protected | customer | `PortalOrdersPage` | Portal Sidebar "Orders" | `workflow.spec.ts:131` | **PASS** |
| 55 | `/portal/installations` | Customer | Protected | customer | `PortalInstallationsPage` | Portal Sidebar "My System" | `workflow.spec.ts:131` | **PASS** |
| 56 | `/portal/equipment` | Customer | Protected | customer | `PortalEquipmentPage` | Portal Sidebar "Hardware" | `workflow.spec.ts:131` | **PASS** |
| 57 | `/portal/warranties` | Customer | Protected | customer | `PortalWarrantiesPage` | Portal Sidebar "Warranties" | `competition-scenarios.spec.ts:139` | **PASS** |
| 58 | `/portal/service` | Customer | Protected | customer | `PortalServicePage` | Portal Sidebar "Support" | `competition-scenarios.spec.ts:139` | **PASS** |
| 59 | `/portal/profile` | Customer | Protected | customer | `PortalProfilePage` | Portal Header User Avatar | `workflow.spec.ts:131` | **PASS** |
| 60 | `*` | Public / Global | Public (Fallback)| Any | `NotFoundPage` (Stitch 404) | Invalid path entry | `workflow.spec.ts` | **PASS** |
