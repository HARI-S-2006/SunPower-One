# SunPower One - Screen Inventory (Google Stitch)

**Project ID:** 11813858513178811754
**Source:** Google Stitch (awaiting MCP access)
**Status:** Placeholder inventory based on competition requirements

---

## Public Website Screens

| Screen ID | Screen Name | Route | Description | Priority |
|-----------|-------------|-------|-------------|----------|
| STITCH-001 | Home Page | `/` | Hero, features, stats, lifecycle, CTA | P0 |
| STITCH-002 | About Us | `/about` | Mission, values, team, company info | P1 |
| STITCH-003 | Solutions Overview | `/solutions` | On-Grid vs Off-Grid comparison | P0 |
| STITCH-004 | On-Grid Systems | `/solutions/on-grid` | 1-5kW specs, components, pricing, benefits | P0 |
| STITCH-005 | Off-Grid Systems | `/solutions/off-grid` | Battery systems, backup, sizing | P0 |
| STITCH-006 | Solar Calculator | `/solar-calculator` | Interactive estimator with results | P0 |
| STITCH-007 | Request Survey | `/request-survey` | Enquiry form with validation | P0 |
| STITCH-008 | Contact | `/contact` | Contact form, info, map | P1 |
| STITCH-009 | Login | `/login` | Role-based login with demo credentials | P0 |

---

## Admin Application Screens

| Screen ID | Screen Name | Route | Module | Description | Priority |
|-----------|-------------|-------|--------|-------------|----------|
| STITCH-100 | Director Dashboard | `/app/dashboard` | Analytics | Executive KPIs, charts, alerts | P0 |
| STITCH-101 | CRM - Leads | `/app/crm/leads` | CRM | Lead pipeline, Kanban, list view | P0 |
| STITCH-102 | CRM - Lead Detail | `/app/crm/leads/:id` | CRM | Lead details, activities, actions | P0 |
| STITCH-103 | Customers | `/app/customers` | CRM | Customer list, search, filters | P0 |
| STITCH-104 | Customer Detail | `/app/customers/:id` | CRM | 360° view: leads, surveys, orders, installs, warranties, service | P0 |
| STITCH-105 | Surveys List | `/app/surveys` | Survey | Survey scheduling, status board | P0 |
| STITCH-106 | Survey Detail | `/app/surveys/:id` | Survey | Measurements, photos, approval | P0 |
| STITCH-107 | Survey Form | `/app/surveys/new` | Survey | Mobile-optimized survey form | P0 |
| STITCH-108 | Configurator | `/app/configurator` | Sales | System builder with live BOM | P0 |
| STITCH-109 | Products Catalogue | `/app/products` | Inventory | Product master data, categories | P1 |
| STITCH-110 | Product Detail | `/app/products/:id` | Inventory | Specs, compatibility, pricing | P1 |
| STITCH-111 | BOM Engine | `/app/bom` | Sales | Templates, rules, generation | P0 |
| STITCH-112 | BOM Detail | `/app/bom/:id` | Sales | Items, pricing, export | P0 |
| STITCH-113 | Quotations List | `/app/quotations` | Sales | List with status, filters | P0 |
| STITCH-114 | Quotation Detail | `/app/quotations/:id` | Sales | Versioned, PDF, approval gate | P0 |
| STITCH-115 | Quotation Builder | `/app/quotations/new` | Sales | From configurator/BOM | P0 |
| STITCH-116 | Orders List | `/app/orders` | Sales | Order pipeline, payments | P0 |
| STITCH-117 | Order Detail | `/app/orders/:id` | Sales | Items, payments, dispatch, install | P0 |
| STITCH-118 | Payments | `/app/payments` | Finance | Received, allocated, outstanding | P0 |
| STITCH-119 | Inventory Dashboard | `/app/inventory` | Inventory | Stock levels, alerts, valuation | P0 |
| STITCH-120 | Stock Ledger | `/app/inventory/stock-ledger` | Inventory | Movements, audit trail | P1 |
| STITCH-121 | Serial Numbers | `/app/inventory/serials` | Inventory | Register, search, QR, dispatch | P0 |
| STITCH-122 | Dispatch | `/app/inventory/dispatch` | Inventory | Scan, validate, deliver, warranty | P0 |
| STITCH-123 | Suppliers | `/app/suppliers` | Procurement | Supplier management | P1 |
| STITCH-124 | Purchase Orders | `/app/purchase-orders` | Procurement | PO workflow, receipts | P1 |
| STITCH-125 | Installations | `/app/installations` | Installation | Schedule, assign, track | P0 |
| STITCH-126 | Installation Detail | `/app/installations/:id` | Installation | Jobs, evidence, completion | P0 |
| STITCH-127 | Technicians | `/app/technicians` | Installation | Profiles, skills, availability | P0 |
| STITCH-128 | Technician Schedule | `/app/technician-schedule` | Installation | Visual calendar board | P0 |
| STITCH-129 | Warranties | `/app/warranties` | Warranty | Policies, activation, claims | P0 |
| STITCH-130 | Service Tickets | `/app/service` | Service | Tickets, assignments, SLA | P0 |
| STITCH-131 | Invoices | `/app/invoices` | Finance | Generation, tracking, GST | P0 |
| STITCH-132 | Expenses | `/app/expenses` | Finance | Categories, approval, allocation | P1 |
| STITCH-133 | Technician Payments | `/app/technician-payments` | Finance | Labour, advances, settlement | P0 |
| STITCH-134 | Subsidies | `/app/subsidies` | Finance | Applications, documents, status | P1 |
| STITCH-135 | Profitability | `/app/profitability` | Analytics | Project P&L, margins | P0 |
| STITCH-136 | Analytics | `/app/analytics` | Analytics | Funnel, trends, operational | P1 |
| STITCH-137 | AI Assistant | `/app/ai-assistant` | Cross-cutting | NL queries, insights | P2 |
| STITCH-138 | Notifications | `/app/notifications` | Cross-cutting | Center, preferences | P1 |
| STITCH-139 | Settings | `/app/settings` | Cross-cutting | Users, roles, org, integrations | P1 |

---

## Technician Mobile Screens

| Screen ID | Screen Name | Route | Description | Priority |
|-----------|-------------|-------|-------------|----------|
| STITCH-200 | Technician Dashboard | `/technician/dashboard` | My jobs, schedule, quick actions | P0 |
| STITCH-201 | My Jobs | `/technician/jobs` | List with filters, search | P0 |
| STITCH-202 | Job Detail | `/technician/jobs/:id` | Customer, equipment, serials, actions | P0 |
| STITCH-203 | QR Scanner | `/technician/scan` | Camera scan, validation, actions | P0 |
| STITCH-204 | Checklist | `/technician/checklist/:id` | Mandatory steps, photos, testing | P0 |
| STITCH-205 | Completion | `/technician/completion/:id` | Signature, report, handover | P0 |

---

## Customer Portal Screens

| Screen ID | Screen Name | Route | Description | Priority |
|-----------|-------------|-------|-------------|----------|
| STITCH-300 | Portal Dashboard | `/portal/dashboard` | Timeline, milestones, quick actions | P0 |
| STITCH-301 | My Quotations | `/portal/quotations` | List, view, accept, download | P0 |
| STITCH-302 | My Orders | `/portal/orders` | Status, payments, delivery | P0 |
| STITCH-303 | Installations | `/portal/installations` | Schedule, progress, photos | P0 |
| STITCH-304 | Equipment | `/portal/equipment` | Serials, specs, warranties | P0 |
| STITCH-305 | Warranties | `/portal/warranties` | Coverage, claims, expiry | P0 |
| STITCH-306 | Service Requests | `/portal/service` | Create, track, confirm | P0 |
| STITCH-307 | Profile | `/portal/profile` | Info, preferences, notifications | P1 |

---

## Component Screens (Reusable)

| Component ID | Name | Used In | Description |
|--------------|------|---------|-------------|
| STITCH-C001 | Button | All | Primary, secondary, outline, ghost, destructive |
| STITCH-C002 | Input | Forms | Text, number, email, select, textarea |
| STITCH-C003 | Card | All | Content container with header/body/footer |
| STITCH-C004 | Table | Lists | Sortable, filterable, paginated, row actions |
| STITCH-C005 | Modal | All | Dialogs, confirmations, forms |
| STITCH-C006 | Dropdown | All | Select, menu, combobox |
| STITCH-C007 | Tabs | Detail pages | Horizontal, vertical |
| STITCH-C008 | Accordion | Forms, details | Collapsible sections |
| STITCH-C009 | Badge | Status indicators | Status, role, priority |
| STITCH-C010 | Avatar | User, customer | Image, initials, fallback |
| STITCH-C011 | Breadcrumbs | Navigation | Hierarchical navigation |
| STITCH-C012 | Pagination | Lists | Page numbers, next/prev |
| STITCH-C013 | Toast | Feedback | Success, error, warning, info |
| STITCH-C014 | Tooltip | All | Hover information |
| STITCH-C015 | Progress | Installation, survey | Steps, percentage |
| STITCH-C016 | Chart | Dashboard | Bar, line, pie, area (Recharts) |
| STITCH-C017 | KPI Card | Dashboard | Metric with trend, sparkline |
| STITCH-C018 | Sidebar | App layouts | Collapsible, nested |
| STITCH-C019 | Header | App layouts | Search, notifications, user menu |
| STITCH-C020 | Footer | Public layout | Links, contact, social |
| STITCH-C021 | Form Field | Forms | Label, input, error, hint |
| STITCH-C022 | Data Grid | Complex lists | Inline edit, multi-select |
| STITCH-C023 | File Upload | Survey, installation | Drag-drop, preview, progress |
| STITCH-C024 | Signature Pad | Completion | Canvas-based, mobile |
| STITCH-C025 | Camera/Scanner | Technician, dispatch | QR/Barcode, photo |
| STITCH-C026 | Map | Survey, portal | Location picker, directions |
| STITCH-C027 | Calendar | Scheduling | Month, week, day views |
| STITCH-C028 | Kanban Board | CRM, installations | Drag-drop columns |
| STITCH-C029 | Stepper | Wizard forms | Progress, validation |
| STITCH-C030 | Empty State | All | Illustrative, actionable |

---

## Notes

- Screen IDs prefixed with `STITCH-` for traceability to Google Stitch
- Priority: P0 = Must have for competition, P1 = Should have, P2 = Nice to have
- Actual Stitch screen IDs to be populated once MCP access is available
- Mobile-first responsive variants for all screens
- Accessibility (WCAG AA) built into all components