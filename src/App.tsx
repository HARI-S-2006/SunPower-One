import { Routes, Route, Navigate } from 'react-router-dom'
import { PublicLayout } from '@/components/layout/PublicLayout'
import { AppLayout } from '@/components/layout/AppLayout'
import { TechnicianLayout } from '@/components/layout/TechnicianLayout'
import { PortalLayout } from '@/components/layout/PortalLayout'

// Public pages
import { HomePage } from '@/pages/public/HomePage'
import { AboutPage } from '@/pages/public/AboutPage'
import { SolutionsPage } from '@/pages/public/SolutionsPage'
import { OnGridPage } from '@/pages/public/OnGridPage'
import { OffGridPage } from '@/pages/public/OffGridPage'
import { SolarCalculatorPage } from '@/pages/public/SolarCalculatorPage'
import { RequestSurveyPage } from '@/pages/public/RequestSurveyPage'
import { ContactPage } from '@/pages/public/ContactPage'
import { LoginPage } from '@/pages/public/LoginPage'
import { NotFoundPage } from '@/pages/public/NotFoundPage'

// App pages
import {
  DashboardPage,
  CrmPage,
  CustomersPage,
  SurveysPage,
  ConfiguratorPage,
  ProductsPage,
  BomPage,
  QuotationsPage,
  OrdersPage,
  PaymentsPage,
  InventoryPage,
  StockLedgerPage,
  SerialsPage,
  DispatchPage,
  SuppliersPage,
  PurchaseOrdersPage,
  InstallationsPage,
  TechniciansPage,
  TechnicianSchedulePage,
  WarrantiesPage,
  ServicePage,
  InvoicesPage,
  ExpensesPage,
  TechnicianPaymentsPage,
  SubsidiesPage,
  ProfitabilityPage,
  AnalyticsPage,
  AiAssistantPage,
  NotificationsPage,
  SettingsPage,
} from '@/pages/app/AppPages'

// Technician pages
import {
  TechnicianDashboardPage,
  TechnicianJobsPage,
  TechnicianJobDetailPage,
  TechnicianScanPage,
  TechnicianChecklistPage,
  TechnicianCompletionPage,
} from '@/pages/technician/TechnicianPages'

// Portal pages
import {
  PortalDashboardPage,
  PortalQuotationsPage,
  PortalOrdersPage,
  PortalInstallationsPage,
  PortalEquipmentPage,
  PortalWarrantiesPage,
  PortalServicePage,
  PortalProfilePage,
} from '@/pages/portal/PortalPages'

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/solutions" element={<SolutionsPage />} />
        <Route path="/solutions/on-grid" element={<OnGridPage />} />
        <Route path="/solutions/off-grid" element={<OffGridPage />} />
        <Route path="/solar-calculator" element={<SolarCalculatorPage />} />
        <Route path="/calculator" element={<Navigate to="/solar-calculator" replace />} />
        <Route path="/request-survey" element={<RequestSurveyPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Route>

      {/* Admin app routes - protected */}
      <Route element={<AppLayout />}>
        <Route path="/app" element={<Navigate to="/app/dashboard" replace />} />
        <Route path="/app/dashboard" element={<DashboardPage />} />
        <Route path="/app/crm" element={<CrmPage />} />
        <Route path="/app/crm/leads" element={<CrmPage />} />
        <Route path="/app/leads" element={<Navigate to="/app/crm/leads" replace />} />
        <Route path="/app/customers" element={<CustomersPage />} />
        <Route path="/app/surveys" element={<SurveysPage />} />
        <Route path="/app/configurator" element={<ConfiguratorPage />} />
        <Route path="/app/products" element={<ProductsPage />} />
        <Route path="/app/bom" element={<BomPage />} />
        <Route path="/app/quotations" element={<QuotationsPage />} />
        <Route path="/app/orders" element={<OrdersPage />} />
        <Route path="/app/payments" element={<PaymentsPage />} />
        <Route path="/app/inventory" element={<InventoryPage />} />
        <Route path="/app/inventory/stock-ledger" element={<StockLedgerPage />} />
        <Route path="/app/inventory/serials" element={<SerialsPage />} />
        <Route path="/app/inventory/dispatch" element={<DispatchPage />} />
        <Route path="/app/suppliers" element={<SuppliersPage />} />
        <Route path="/app/purchase-orders" element={<PurchaseOrdersPage />} />
        <Route path="/app/installations" element={<InstallationsPage />} />
        <Route path="/app/technicians" element={<TechniciansPage />} />
        <Route path="/app/technician-schedule" element={<TechnicianSchedulePage />} />
        <Route path="/app/warranties" element={<WarrantiesPage />} />
        <Route path="/app/service" element={<ServicePage />} />
        <Route path="/app/invoices" element={<InvoicesPage />} />
        <Route path="/app/expenses" element={<ExpensesPage />} />
        <Route path="/app/technician-payments" element={<TechnicianPaymentsPage />} />
        <Route path="/app/subsidies" element={<SubsidiesPage />} />
        <Route path="/app/profitability" element={<ProfitabilityPage />} />
        <Route path="/app/analytics" element={<AnalyticsPage />} />
        <Route path="/app/ai-assistant" element={<AiAssistantPage />} />
        <Route path="/app/notifications" element={<NotificationsPage />} />
        <Route path="/app/settings" element={<SettingsPage />} />
      </Route>

      {/* Technician routes - mobile optimized */}
      <Route element={<TechnicianLayout />}>
        <Route path="/technician" element={<Navigate to="/technician/jobs" replace />} />
        <Route path="/technician/dashboard" element={<TechnicianDashboardPage />} />
        <Route path="/technician/jobs" element={<TechnicianJobsPage />} />
        <Route path="/technician/jobs/:id" element={<TechnicianJobDetailPage />} />
        <Route path="/technician/scan" element={<TechnicianScanPage />} />
        <Route path="/technician/checklist/:id" element={<TechnicianChecklistPage />} />
        <Route path="/technician/completion/:id" element={<TechnicianCompletionPage />} />
      </Route>

      {/* Customer portal routes */}
      <Route element={<PortalLayout />}>
        <Route path="/portal" element={<Navigate to="/portal/dashboard" replace />} />
        <Route path="/portal/dashboard" element={<PortalDashboardPage />} />
        <Route path="/portal/quotations" element={<PortalQuotationsPage />} />
        <Route path="/portal/orders" element={<PortalOrdersPage />} />
        <Route path="/portal/installations" element={<PortalInstallationsPage />} />
        <Route path="/portal/equipment" element={<PortalEquipmentPage />} />
        <Route path="/portal/warranties" element={<PortalWarrantiesPage />} />
        <Route path="/portal/service" element={<PortalServicePage />} />
        <Route path="/portal/profile" element={<PortalProfilePage />} />
      </Route>

      {/* 404 Catch-all route */}
      <Route element={<PublicLayout />}>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App