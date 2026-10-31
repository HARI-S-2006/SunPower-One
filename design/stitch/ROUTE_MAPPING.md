# SunPower One - Route Mapping (Stitch Screen → Application Route)

**Project ID:** 11813858513178811754
**Mapping Strategy:** Each Stitch screen maps to a specific route; dynamic segments for detail views

---

## Public Website Routes

| Stitch Screen ID | Route | Component | Layout | Auth Required |
|------------------|-------|-----------|--------|---------------|
| STITCH-001 | `/` | `HomePage` | `PublicLayout` | No |
| STITCH-002 | `/about` | `AboutPage` | `PublicLayout` | No |
| STITCH-003 | `/solutions` | `SolutionsPage` | `PublicLayout` | No |
| STITCH-004 | `/solutions/on-grid` | `OnGridPage` | `PublicLayout` | No |
| STITCH-005 | `/solutions/off-grid` | `OffGridPage` | `PublicLayout` | No |
| STITCH-006 | `/solar-calculator` | `SolarCalculatorPage` | `PublicLayout` | No |
| STITCH-007 | `/request-survey` | `RequestSurveyPage` | `PublicLayout` | No |
| STITCH-008 | `/contact` | `ContactPage` | `PublicLayout` | No |
| STITCH-009 | `/login` | `LoginPage` | `PublicLayout` | No |

---

## Admin Application Routes

| Stitch Screen ID | Route | Component | Layout | Auth Required | Roles |
|------------------|-------|-----------|--------|---------------|-------|
| STITCH-100 | `/app/dashboard` | `DashboardPage` | `AppLayout` | Yes | director, finance |
| STITCH-101 | `/app/crm/leads` | `CrmPage` | `AppLayout` | Yes | director, sales |
| STITCH-102 | `/app/crm/leads/:id` | `LeadDetailPage` | `AppLayout` | Yes | director, sales |
| STITCH-103 | `/app/customers` | `CustomersPage` | `AppLayout` | Yes | director, sales, support |
| STITCH-104 | `/app/customers/:id` | `CustomerDetailPage` | `AppLayout` | Yes | director, sales, support |
| STITCH-105 | `/app/surveys` | `SurveysPage` | `AppLayout` | Yes | director, survey |
| STITCH-106 | `/app/surveys/:id` | `SurveyDetailPage` | `AppLayout` | Yes | director, survey |
| STITCH-107 | `/app/surveys/new` | `SurveyFormPage` | `AppLayout` | Yes | survey |
| STITCH-108 | `/app/configurator` | `ConfiguratorPage` | `AppLayout` | Yes | director, sales |
| STITCH-109 | `/app/products` | `ProductsPage` | `AppLayout` | Yes | director, warehouse |
| STITCH-110 | `/app/products/:id` | `ProductDetailPage` | `AppLayout` | Yes | director, warehouse |
| STITCH-111 | `/app/bom` | `BomPage` | `AppLayout` | Yes | director, sales |
| STITCH-112 | `/app/bom/:id` | `BomDetailPage` | `AppLayout` | Yes | director, sales |
| STITCH-113 | `/app/quotations` | `QuotationsPage` | `AppLayout` | Yes | director, sales |
| STITCH-114 | `/app/quotations/:id` | `QuotationDetailPage` | `AppLayout` | Yes | director, sales |
| STITCH-115 | `/app/quotations/new` | `QuotationBuilderPage` | `AppLayout` | Yes | sales |
| STITCH-116 | `/app/orders` | `OrdersPage` | `AppLayout` | Yes | director, sales, warehouse |
| STITCH-117 | `/app/orders/:id` | `OrderDetailPage` | `AppLayout` | Yes | director, sales, warehouse |
| STITCH-118 | `/app/payments` | `PaymentsPage` | `AppLayout` | Yes | director, finance |
| STITCH-119 | `/app/inventory` | `InventoryPage` | `AppLayout` | Yes | director, warehouse |
| STITCH-120 | `/app/inventory/stock-ledger` | `StockLedgerPage` | `AppLayout` | Yes | director, warehouse |
| STITCH-121 | `/app/inventory/serials` | `SerialsPage` | `AppLayout` | Yes | director, warehouse |
| STITCH-122 | `/app/inventory/dispatch` | `DispatchPage` | `AppLayout` | Yes | director, warehouse |
| STITCH-123 | `/app/suppliers` | `SuppliersPage` | `AppLayout` | Yes | director, warehouse |
| STITCH-124 | `/app/purchase-orders` | `PurchaseOrdersPage` | `AppLayout` | Yes | director, warehouse |
| STITCH-125 | `/app/installations` | `InstallationsPage` | `AppLayout` | Yes | director, technician |
| STITCH-126 | `/app/installations/:id` | `InstallationDetailPage` | `AppLayout` | Yes | director, technician |
| STITCH-127 | `/app/technicians` | `TechniciansPage` | `AppLayout` | Yes | director |
| STITCH-128 | `/app/technician-schedule` | `TechnicianSchedulePage` | `AppLayout` | Yes | director, technician |
| STITCH-129 | `/app/warranties` | `WarrantiesPage` | `AppLayout` | Yes | director, support |
| STITCH-130 | `/app/service` | `ServicePage` | `AppLayout` | Yes | director, support |
| STITCH-131 | `/app/invoices` | `InvoicesPage` | `AppLayout` | Yes | director, finance |
| STITCH-132 | `/app/expenses` | `ExpensesPage` | `AppLayout` | Yes | director, finance |
| STITCH-133 | `/app/technician-payments` | `TechnicianPaymentsPage` | `AppLayout` | Yes | director, finance |
| STITCH-134 | `/app/subsidies` | `SubsidiesPage` | `AppLayout` | Yes | director, finance |
| STITCH-135 | `/app/profitability` | `ProfitabilityPage` | `AppLayout` | Yes | director, finance |
| STITCH-136 | `/app/analytics` | `AnalyticsPage` | `AppLayout` | Yes | director |
| STITCH-137 | `/app/ai-assistant` | `AiAssistantPage` | `AppLayout` | Yes | director |
| STITCH-138 | `/app/notifications` | `NotificationsPage` | `AppLayout` | Yes | all |
| STITCH-139 | `/app/settings` | `SettingsPage` | `AppLayout` | Yes | director |

---

## Technician Mobile Routes

| Stitch Screen ID | Route | Component | Layout | Auth Required | Roles |
|------------------|-------|-----------|--------|---------------|-------|
| STITCH-200 | `/technician/dashboard` | `TechnicianDashboardPage` | `TechnicianLayout` | Yes | installation_technician, survey_technician |
| STITCH-201 | `/technician/jobs` | `TechnicianJobsPage` | `TechnicianLayout` | Yes | installation_technician, survey_technician |
| STITCH-202 | `/technician/jobs/:id` | `TechnicianJobDetailPage` | `TechnicianLayout` | Yes | installation_technician, survey_technician |
| STITCH-203 | `/technician/scan` | `TechnicianScanPage` | `TechnicianLayout` | Yes | installation_technician, warehouse_manager |
| STITCH-204 | `/technician/checklist/:id` | `TechnicianChecklistPage` | `TechnicianLayout` | Yes | installation_technician |
| STITCH-205 | `/technician/completion/:id` | `TechnicianCompletionPage` | `TechnicianLayout` | Yes | installation_technician |

---

## Customer Portal Routes

| Stitch Screen ID | Route | Component | Layout | Auth Required | Roles |
|------------------|-------|-----------|--------|---------------|-------|
| STITCH-300 | `/portal/dashboard` | `PortalDashboardPage` | `PortalLayout` | Yes | customer |
| STITCH-301 | `/portal/quotations` | `PortalQuotationsPage` | `PortalLayout` | Yes | customer |
| STITCH-302 | `/portal/orders` | `PortalOrdersPage` | `PortalLayout` | Yes | customer |
| STITCH-303 | `/portal/installations` | `PortalInstallationsPage` | `PortalLayout` | Yes | customer |
| STITCH-304 | `/portal/equipment` | `PortalEquipmentPage` | `PortalLayout` | Yes | customer |
| STITCH-305 | `/portal/warranties` | `PortalWarrantiesPage` | `PortalLayout` | Yes | customer |
| STITCH-306 | `/portal/service` | `PortalServicePage` | `PortalLayout` | Yes | customer |
| STITCH-307 | `/portal/profile` | `PortalProfilePage` | `PortalLayout` | Yes | customer |

---

## Route Guards & Middleware

```typescript
// Protected route wrapper
<Route element={<RequireAuth allowedRoles={['director', 'sales']}><AppLayout /><Outlet /></RequireAuth>}>
  <Route path="/app/crm/leads" element={<CrmPage />} />
  ...
</Route>

// Role-based access
const roleRoutes = {
  director: ['/app/*', '/app/dashboard', '/app/profitability', '/app/analytics'],
  sales: ['/app/crm/*', '/app/quotations/*', '/app/orders/*', '/app/configurator'],
  survey_technician: ['/app/surveys/*', '/technician/*'],
  warehouse_manager: ['/app/inventory/*', '/app/suppliers/*', '/app/purchase-orders/*', '/technician/scan'],
  installation_technician: ['/app/installations/*', '/technician/*'],
  finance_executive: ['/app/payments', '/app/invoices', '/app/expenses', '/app/technician-payments', '/app/subsidies', '/app/profitability'],
  support_executive: ['/app/warranties', '/app/service'],
  customer: ['/portal/*'],
}
```

---

## Navigation Structure

### Public Header Navigation
```
Home → Solutions → Solar Calculator → Request Survey → About → Contact → Login
```

### Admin Sidebar Navigation (Grouped)
```
Dashboard
CRM
  ├─ Leads
Customers
Surveys
Configurator
Products
BOM
Quotations
Orders
Payments
Inventory
  ├─ Stock Ledger
  ├─ Serial Numbers
  ├─ Dispatch
Suppliers
Purchase Orders
Installations
Technicians
Technician Schedule
Warranties
Service
Invoices
Expenses
Technician Payments
Subsidies
Profitability
Analytics
AI Assistant
Notifications
Settings
```

### Technician Bottom Tab Bar (Mobile)
```
Dashboard | Jobs | Scan | Profile
```

### Customer Portal Sidebar
```
Dashboard | Quotations | Orders | Installations | Equipment | Warranties | Service | Profile
```

---

## Deep Linking Patterns

| Entity | Pattern | Example |
|--------|---------|---------|
| Lead | `/app/crm/leads/:leadId` | `/app/crm/leads/550e8400-e29b-41d4-a716-446655440000` |
| Customer | `/app/customers/:customerId` | `/app/customers/550e8400-e29b-41d4-a716-446655440001` |
| Survey | `/app/surveys/:surveyId` | `/app/surveys/550e8400-e29b-41d4-a716-446655440002` |
| Quotation | `/app/quotations/:quotationId` | `/app/quotations/550e8400-e29b-41d4-a716-446655440003` |
| Order | `/app/orders/:orderId` | `/app/orders/550e8400-e29b-41d4-a716-446655440004` |
| Installation | `/app/installations/:installationId` | `/app/installations/550e8400-e29b-41d4-a716-446655440005` |
| Serial Unit | `/app/inventory/serials/:serialId` | `/app/inventory/serials/INV-2024-001234` |
| Service Ticket | `/app/service/:ticketId` | `/app/service/550e8400-e29b-41d4-a716-446655440006` |
| Technician Job | `/technician/jobs/:jobId` | `/technician/jobs/550e8400-e29b-41d4-a716-446655440007` |
| Customer Quotation | `/portal/quotations/:quotationId` | `/portal/quotations/550e8400-e29b-41d4-a716-446655440003` |

---

## Query Parameters (Standardized)

| Parameter | Purpose | Example |
|-----------|---------|---------|
| `page` | Pagination | `?page=2` |
| `limit` | Page size | `?limit=25` |
| `sort` | Sort field | `?sort=created_at` |
| `order` | Sort direction | `?order=desc` |
| `search` | Global search | `?search=john` |
| `status` | Status filter | `?status=pending,approved` |
| `date_from` | Date range start | `?date_from=2024-01-01` |
| `date_to` | Date range end | `?date_to=2024-12-31` |
| `assigned_to` | User filter | `?assigned_to=550e8400...` |

---

## Route Parameters Type Safety

```typescript
// Generated from route definitions
type AppRoutes = 
  | `/app/dashboard`
  | `/app/crm/leads`
  | `/app/crm/leads/${string}`
  | `/app/customers`
  | `/app/customers/${string}`
  | `/app/surveys`
  | `/app/surveys/${string}`
  | `/app/surveys/new`
  | `/app/configurator`
  | `/app/products`
  | `/app/products/${string}`
  | `/app/bom`
  | `/app/bom/${string}`
  | `/app/quotations`
  | `/app/quotations/${string}`
  | `/app/quotations/new`
  | `/app/orders`
  | `/app/orders/${string}`
  | `/app/payments`
  | `/app/inventory`
  | `/app/inventory/stock-ledger`
  | `/app/inventory/serials`
  | `/app/inventory/serials/${string}`
  | `/app/inventory/dispatch`
  | `/app/suppliers`
  | `/app/purchase-orders`
  | `/app/installations`
  | `/app/installations/${string}`
  | `/app/technicians`
  | `/app/technician-schedule`
  | `/app/warranties`
  | `/app/service`
  | `/app/invoices`
  | `/app/expenses`
  | `/app/technician-payments`
  | `/app/subsidies`
  | `/app/profitability`
  | `/app/analytics`
  | `/app/ai-assistant`
  | `/app/notifications`
  | `/app/settings`;

type TechnicianRoutes = 
  | `/technician/dashboard`
  | `/technician/jobs`
  | `/technician/jobs/${string}`
  | `/technician/scan`
  | `/technician/checklist/${string}`
  | `/technician/completion/${string}`;

type PortalRoutes = 
  | `/portal/dashboard`
  | `/portal/quotations`
  | `/portal/quotations/${string}`
  | `/portal/orders`
  | `/portal/orders/${string}`
  | `/portal/installations`
  | `/portal/installations/${string}`
  | `/portal/equipment`
  | `/portal/equipment/${string}`
  | `/portal/warranties`
  | `/portal/service`
  | `/portal/profile`;

type PublicRoutes = 
  | `/`
  | `/about`
  | `/solutions`
  | `/solutions/on-grid`
  | `/solutions/off-grid`
  | `/solar-calculator`
  | `/request-survey`
  | `/contact`
  | `/login`;
```