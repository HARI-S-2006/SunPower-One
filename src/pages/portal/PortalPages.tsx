import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSolarStore, type Quotation, type ServiceTicket, type WarrantyRecord } from '@/lib/store/solarStore'
import { MetricCard } from '@/components/ui/MetricCard'
import {
  Sun,
  Zap,
  ShieldCheck,
  LifeBuoy,
  CheckCircle2,
  Sparkles,
  Plus,
  X,
  Download,
  Printer,
  ExternalLink,
  FileText,
  Search,
  Filter,
  Copy,
  Check,
  Award,
  Shield,
  AlertCircle,
  Calendar,
  BadgeCheck,
  QrCode
} from 'lucide-react'

// ==========================================
// 1. CUSTOMER PORTAL DASHBOARD
// ==========================================
export function PortalDashboardPage() {
  const { orders, warranties, serviceTickets, customerProfile } = useSolarStore()
  const navigate = useNavigate()

  // Primary customer demo context (Siddharth Varma / Vikramaditya Rao)
  const currentOrder = orders[0] || orders[1]
  const customerWarranties = warranties.filter(w => w.customerName.includes('Varma') || w.customerName.includes('Vikramaditya'))
  const customerTickets = serviceTickets.filter(t => t.customerName.includes('Varma') || t.customerName.includes('Vikramaditya'))

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome & System Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-[#172747] p-6 text-white shadow-xl">
        <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-[#E9DDCA]/15 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-[#E9DDCA]">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              BESCOM Grid Synchronized • Net Metered
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white font-['Plus_Jakarta_Sans']">
              Welcome back, {customerProfile.name}
            </h1>
            <p className="text-sm text-[#F7F3EC]/80 max-w-xl">
              {customerProfile.solarCapacity} Rooftop Solar PV Microgrid at {customerProfile.address}. High-efficiency Mono PERC array operating normally.
            </p>
          </div>

          {/* Quick Real-Time Pill */}
          <div className="rounded-2xl bg-white/10 backdrop-blur-md p-4 border border-white/10 min-w-[200px] text-center">
            <span className="text-[11px] uppercase tracking-wider text-[#E9DDCA] font-semibold block">
              Live Solar Output (Demonstration Telemetry)
            </span>
            <span className="text-3xl font-bold text-white tabular-nums block mt-1">
              3.84 kW
            </span>
            <span className="text-xs text-emerald-300 font-medium">96% of peak • Synced 2m ago</span>
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Today's Generation"
          value="18.4 kWh"
          subtitle="Estimated savings: ₹156"
          trend="up"
          trendValue="+12% vs avg"
          icon={Zap}
        />
        <MetricCard
          title="Lifetime Clean Energy"
          value="2,480 kWh"
          subtitle="Total electricity produced"
          icon={Sun}
        />
        <MetricCard
          title="CO2 Emissions Offset"
          value="2.03 Tons"
          subtitle="Equivalent to 96 trees planted"
          icon={Sparkles}
        />
        <MetricCard
          title="Protected Warranties"
          value={`${customerWarranties.length || 3} Assets`}
          subtitle="20-Yr Module & 2-Yr Inverter"
          icon={ShieldCheck}
        />
      </div>

      {/* Project Status Progression */}
      <div className="rounded-2xl bg-white p-6 shadow-sm border border-[#E8E0D6] space-y-4">
        <div className="flex items-center justify-between border-b border-[#E8E0D6] pb-3">
          <div>
            <h3 className="text-base font-bold text-[#172747] font-['Plus_Jakarta_Sans']">
              Project Lifecycle Status
            </h3>
            <p className="text-xs text-[#6E7787]">Turnkey execution progress for Order {currentOrder?.orderNo}</p>
          </div>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
            {currentOrder?.status.replace('_', ' ').toUpperCase()}
          </span>
        </div>

        {/* 5-Step Visual Stepper */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 pt-2">
          {[
            { step: '1', title: 'Site Survey', desc: 'Feasibility approved', done: true },
            { step: '2', title: 'Quotation & Escrow', desc: '30% Advance paid', done: true },
            { step: '3', title: 'Serial Dispatch', desc: 'Hardware staged', done: true },
            { step: '4', title: 'Installation', desc: 'Testing & commissioning', done: currentOrder?.status === 'commissioned' || currentOrder?.status === 'installed' },
            { step: '5', title: 'Handover & Warranty', desc: 'Active protection', done: currentOrder?.status === 'commissioned' },
          ].map((s, i) => (
            <div
              key={i}
              className={`rounded-xl p-3 border transition-all ${
                s.done
                  ? 'bg-emerald-50/60 border-emerald-300 text-emerald-900'
                  : 'bg-[#F7F3EC]/50 border-[#E8E0D6] text-[#6E7787]'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                    s.done ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {s.done ? '✓' : s.step}
                </span>
                <span className="font-bold text-xs">{s.title}</span>
              </div>
              <p className="text-[11px] leading-tight pl-8">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Quick Access */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Installed Assets & Serials */}
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-[#E8E0D6] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#172747] font-['Plus_Jakarta_Sans']">
              Installed Solar Equipment
            </h3>
            <Link to="/portal/equipment" className="text-xs font-bold text-[#493027] hover:underline">
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {[
              { name: 'Adani 540W Mono PERC Modules (8x)', serial: 'PNL-540W-0081..88', warranty: '20 Years' },
              { name: 'Solis 4.0kW Single-Phase Inverter', serial: 'INV-4000-9102', warranty: '2 Years' },
              { name: 'Anodized Aluminium Mounting Rack', serial: 'MNT-SS304-2026', warranty: '10 Years' },
            ].map((eq, i) => (
              <div key={i} className="flex items-center justify-between rounded-xl bg-[#F7F3EC] p-3 text-xs">
                <div>
                  <span className="font-bold text-[#172747] block">{eq.name}</span>
                  <span className="font-mono text-[#6E7787] text-[11px]">{eq.serial}</span>
                </div>
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800">
                  {eq.warranty} Warranty
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Service & Helpdesk Widget */}
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-[#E8E0D6] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#172747] font-['Plus_Jakarta_Sans']">
              Service Desk & Support
            </h3>
            <Link to="/portal/service" className="text-xs font-bold text-[#493027] hover:underline">
              Log Ticket
            </Link>
          </div>

          {customerTickets.length > 0 ? (
            <div className="space-y-3">
              {customerTickets.map((t) => (
                <div key={t.id} className="rounded-xl bg-[#F7F3EC] p-3 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-[#172747]">{t.ticketNo}</span>
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                      ₹0 Covered Warranty
                    </span>
                  </div>
                  <p className="text-[#172747] font-medium">{t.faultCode}: {t.faultDescription}</p>
                  <p className="text-[11px] text-[#6E7787]">Assigned Tech: {t.assignedTechnician} • Status: {t.status}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl bg-[#F7F3EC] p-6 text-center text-xs text-[#6E7787] space-y-2">
              <CheckCircle2 className="h-8 w-8 text-emerald-600 mx-auto" />
              <p className="font-bold text-[#172747]">All Systems Operational</p>
              <p>No active complaints or tickets filed. Your array is generating normally.</p>
            </div>
          )}

          <button
            onClick={() => navigate('/portal/service')}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#172747] py-2.5 text-xs font-bold text-white hover:bg-[#011232]"
          >
            <LifeBuoy className="h-4 w-4 text-[#E9DDCA]" />
            Request Rapid Service Inspection
          </button>
        </div>
      </div>
    </div>
  )
}

// ==========================================
// 2. CUSTOMER QUOTATIONS PAGE
// ==========================================
export function PortalQuotationsPage() {
  const { quotations, customerProfile } = useSolarStore()
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null)

  return (
    <div className="space-y-6 pb-12">
      <div className="rounded-2xl bg-white p-6 shadow-sm border border-[#E8E0D6]">
        <h1 className="text-2xl font-bold text-[#172747] font-['Plus_Jakarta_Sans']">
          My Commercial Quotations
        </h1>
        <p className="text-sm text-[#6E7787]">
          Review engineering proposals, component pricing breakdowns, and accepted agreements for {customerProfile.name} (Customer ID: {customerProfile.id} • Site #{customerProfile.siteId}).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {quotations.map((q) => (
          <div key={q.id} className="rounded-2xl bg-white p-5 shadow-sm border border-[#E8E0D6] space-y-4">
            <div className="flex items-center justify-between border-b border-[#E8E0D6] pb-3">
              <span className="font-mono text-xs font-bold text-[#172747]">{q.quotationNo}</span>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider ${
                  q.status === 'accepted'
                    ? 'bg-emerald-100 text-emerald-800'
                    : q.status === 'approved_ready'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {q.status.replace('_', ' ')}
              </span>
            </div>

            <div>
              <h3 className="text-lg font-bold text-[#172747]">
                {q.systemCapacityKw} kW {q.systemType.toUpperCase()} Solar System
              </h3>
              <p className="text-xs text-[#6E7787] mt-0.5">Valid until {q.validUntil}</p>
            </div>

            <div className="rounded-xl bg-[#F7F3EC] p-3 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-[#6E7787]">Hardware & Materials:</span>
                <span className="font-bold text-[#172747]">₹{q.bom.totalEquipmentCost.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6E7787]">Installation & Commissioning:</span>
                <span className="font-bold text-[#172747]">₹{q.bom.installationCost.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6E7787]">Concessional Solar GST (12%):</span>
                <span className="font-bold text-[#172747]">₹{q.bom.taxAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between border-t border-[#E8E0D6] pt-1.5 font-bold text-sm text-[#172747]">
                <span>Total Quotation Amount:</span>
                <span className="font-mono text-emerald-700">₹{q.bom.totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedQuotation(q)}
              className="w-full rounded-xl bg-[#172747] py-2.5 text-xs font-bold text-white hover:bg-[#011232]"
            >
              View Full BOM Breakdown
            </button>
          </div>
        ))}
      </div>

      {selectedQuotation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl border border-[#E8E0D6] space-y-4">
            <div className="flex items-center justify-between border-b border-[#E8E0D6] pb-3">
              <h3 className="font-bold text-base text-[#172747] font-['Plus_Jakarta_Sans']">
                BOM Specification: {selectedQuotation.quotationNo}
              </h3>
              <button
                onClick={() => setSelectedQuotation(null)}
                className="rounded-lg p-1 text-[#6E7787] hover:bg-[#F7F3EC] hover:text-[#172747]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-72 overflow-y-auto divide-y divide-[#E8E0D6] text-xs">
              {selectedQuotation.bom.items.map((c, i) => (
                <div key={i} className="py-2 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-[#172747] block">{c.productName}</span>
                    <span className="text-[#6E7787]">{c.quantity} {c.unit} @ ₹{c.unitCost.toLocaleString('en-IN')}</span>
                  </div>
                  <span className="font-bold text-[#172747] font-mono">₹{c.totalCost.toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setSelectedQuotation(null)}
              className="w-full rounded-xl bg-[#172747] py-2.5 text-xs font-bold text-white hover:bg-[#011232]"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ==========================================
// 3. CUSTOMER ORDERS & PAYMENTS PAGE
// ==========================================
export function PortalOrdersPage() {
  const { orders, customerProfile } = useSolarStore()

  return (
    <div className="space-y-6 pb-12">
      <div className="rounded-2xl bg-white p-6 shadow-sm border border-[#E8E0D6]">
        <h1 className="text-2xl font-bold text-[#172747] font-['Plus_Jakarta_Sans']">
          My Orders & Payment Schedule
        </h1>
        <p className="text-sm text-[#6E7787]">
          Track contract milestones for {customerProfile.name} (Customer ID: {customerProfile.id}): 30% Booking Advance, 50% Pre-Dispatch, and 20% Commissioning.
        </p>
      </div>

      <div className="space-y-4">
        {orders.map((o) => (
          <div key={o.id} className="rounded-2xl bg-white p-6 shadow-sm border border-[#E8E0D6] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E8E0D6] pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-[#6E7787]">{o.orderNo}</span>
                <h3 className="text-lg font-bold text-[#172747]">
                  {o.capacityKw} kW {o.systemType.toUpperCase()} Solar Installation
                </h3>
              </div>
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-800">
                {o.paymentMilestone}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="rounded-xl bg-[#F7F3EC] p-3">
                <span className="text-[#6E7787] block">Total Contract Value</span>
                <span className="text-base font-bold text-[#172747] tabular-nums">
                  ₹{o.totalAmount.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="rounded-xl bg-emerald-50 p-3 border border-emerald-200">
                <span className="text-emerald-800 block">Amount Paid in Escrow</span>
                <span className="text-base font-bold text-emerald-700 tabular-nums">
                  ₹{o.paidAmount.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="rounded-xl bg-amber-50 p-3 border border-amber-200">
                <span className="text-amber-800 block">Balance Remaining</span>
                <span className="text-base font-bold text-amber-700 tabular-nums">
                  ₹{o.balanceAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center text-xs text-[#6E7787]">
              <span>Delivery Site: <strong className="text-[#172747]">{o.deliveryAddress}</strong></span>
              <span className="font-mono">Created: {o.createdAt.split('T')[0]}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ==========================================
// 4. CUSTOMER INSTALLATIONS PAGE
// ==========================================
export function PortalInstallationsPage() {
  const { installations, customerProfile } = useSolarStore()

  return (
    <div className="space-y-6 pb-12">
      <div className="rounded-2xl bg-white p-6 shadow-sm border border-[#E8E0D6]">
        <h1 className="text-2xl font-bold text-[#172747] font-['Plus_Jakarta_Sans']">
          Installation & Field Commissioning
        </h1>
        <p className="text-sm text-[#6E7787]">
          Verified commissioning checklists, electrical meter readings, and technician sign-offs for {customerProfile.name} (Site #{customerProfile.siteId} • {customerProfile.solarCapacity}).
        </p>
      </div>

      <div className="space-y-4">
        {installations.map((inst) => (
          <div key={inst.id} className="rounded-2xl bg-white p-6 shadow-sm border border-[#E8E0D6] space-y-4">
            <div className="flex items-center justify-between border-b border-[#E8E0D6] pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-[#6E7787]">{inst.jobNo}</span>
                <h3 className="text-lg font-bold text-[#172747]">{customerProfile.name} - {customerProfile.solarCapacity} System</h3>
                <p className="text-xs text-[#6E7787]">Installation Site: {customerProfile.address}</p>
              </div>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 uppercase">
                {inst.status.replace('_', ' ')}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="rounded-xl bg-[#F7F3EC] p-3">
                <span className="text-[#6E7787] block">Open Circuit Voc</span>
                <span className="font-bold text-[#172747] tabular-nums">{inst.testedVocVolts || 395.4} V</span>
              </div>
              <div className="rounded-xl bg-[#F7F3EC] p-3">
                <span className="text-[#6E7787] block">Short Circuit Isc</span>
                <span className="font-bold text-[#172747] tabular-nums">{inst.testedIscAmps || 13.2} A</span>
              </div>
              <div className="rounded-xl bg-[#F7F3EC] p-3">
                <span className="text-[#6E7787] block">Earth Resistance</span>
                <span className="font-bold text-[#172747] tabular-nums">{inst.testedEarthResistanceOhms || 2.4} Ω (&lt;5Ω)</span>
              </div>
              <div className="rounded-xl bg-emerald-50 p-3 border border-emerald-200">
                <span className="text-emerald-800 block">Verified Solar Gen</span>
                <span className="font-bold text-emerald-700 tabular-nums">{inst.solarGenerationKwReading || 3.8} kW</span>
              </div>
            </div>

            <div className="rounded-xl bg-[#F7F3EC] p-4 text-xs space-y-2">
              <span className="font-bold text-[#493027] uppercase tracking-wider block">IEC 62446 Safety Verified</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[#172747]">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> Structure Torque 35 Nm SS304</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> Insulation Resistance &gt; 1.0 MΩ</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> Earthing Pit Reading &lt; 5.0 Ohms</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> Anti-Islanding Grid Cut Functional</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ==========================================
// 5. CUSTOMER EQUIPMENT & SERIALS PAGE
// ==========================================
export function PortalEquipmentPage() {
  const { serials, passports, customerProfile } = useSolarStore()
  const [selectedPassport, setSelectedPassport] = useState<any | null>(null)

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      <div className="rounded-2xl bg-white p-6 shadow-sm border border-[#E8E0D6] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#172747]/5 px-2.5 py-0.5 text-xs font-semibold text-[#172747] uppercase tracking-wider">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Verified Hardware Authenticity
            </span>
            <span className="text-xs text-[#827B73]">Site #{customerProfile.siteId} • {customerProfile.name}</span>
          </div>
          <h1 className="text-2xl font-bold text-[#172747] font-headline mt-1">
            Installed Solar Equipment & Digital Passports
          </h1>
          <p className="text-xs sm:text-sm text-[#827B73] mt-0.5">
            Immutable physical serial numbers, tamper-proof QR tokens, and manufacturer-backed warranty bonds for {customerProfile.name} ({customerProfile.id}).
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {passports.map((p) => (
          <div
            key={p.id}
            className="rounded-2xl bg-white p-5 shadow-warm-sm border border-[#E8E0D6] space-y-3.5 hover:border-[#172747]/40 transition-all"
          >
            <div className="flex items-center justify-between border-b border-[#E8E0D6] pb-2.5">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-[#172747]">{p.serialNumber}</span>
                <span className="font-mono text-[10px] text-[#B68B55] bg-[#F7F3EC] px-1.5 py-0.2 rounded font-semibold">
                  {p.id}
                </span>
              </div>
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 uppercase">
                {p.warrantyStatus}
              </span>
            </div>

            <div>
              <h3 className="font-headline font-bold text-[#292522] text-sm">{p.productName}</h3>
              <p className="text-xs text-[#827B73] mt-0.5">
                Model: <strong>{p.model}</strong> • Manufacturer: <strong>{p.manufacturer}</strong>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded-lg bg-[#F7F3EC]">
                <span className="text-[10px] uppercase text-[#827B73] block font-semibold">Rating</span>
                <strong className="text-[#172747]">{p.ratedCapacity}</strong>
              </div>
              <div className="p-2 rounded-lg bg-[#F7F3EC]">
                <span className="text-[10px] uppercase text-[#827B73] block font-semibold">Warranty Tenure</span>
                <strong className="text-[#2D5A43]">{p.warrantyDurationYears} Years Protection</strong>
              </div>
            </div>

            <div className="pt-2 border-t border-[#E8E0D6] flex items-center justify-between">
              <span className="font-mono text-[11px] text-[#827B73] truncate max-w-[200px]">
                QR: {p.qrToken.slice(0, 22)}...
              </span>
              <button
                onClick={() => setSelectedPassport(p)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#172747] text-white text-xs font-semibold hover:bg-[#1E345E] transition-colors"
              >
                <QrCode className="h-3.5 w-3.5 text-[#FFDDB7]" />
                Inspect Passport & QR
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Customer Digital Passport Modal */}
      {selectedPassport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#302019]/70 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-[#E8E0D6] space-y-4">
            <div className="flex items-center justify-between border-b border-[#E8E0D6] pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
                <h3 className="font-headline text-base font-bold text-[#292522]">
                  Solar Digital Passport
                </h3>
              </div>
              <button
                onClick={() => setSelectedPassport(null)}
                className="p-1 rounded text-[#827B73] hover:text-[#292522]"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-xl bg-[#F7F3EC] border border-[#E8E0D6] flex flex-col items-center text-center space-y-3">
              <div className="p-3 bg-white rounded-xl border border-[#E8E0D6] shadow-xs">
                <QrCode className="h-28 w-28 text-[#172747]" />
              </div>
              <div>
                <span className="font-mono text-xs font-bold text-[#172747] block">
                  {selectedPassport.id}
                </span>
                <span className="font-mono text-[10px] text-[#827B73]">
                  Token: {selectedPassport.qrToken}
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-[#E8E0D6]">
                <span className="text-[#827B73]">Registered Beneficiary:</span>
                <strong className="text-[#292522]">{customerProfile.name} ({customerProfile.id})</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E8E0D6]">
                <span className="text-[#827B73]">Site Address:</span>
                <strong className="text-[#292522] text-right truncate max-w-[220px]">{customerProfile.address}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E8E0D6]">
                <span className="text-[#827B73]">Hardware Asset:</span>
                <strong className="text-[#292522]">{selectedPassport.productName}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E8E0D6]">
                <span className="text-[#827B73]">Serial Barcode:</span>
                <strong className="font-mono text-[#172747]">{selectedPassport.serialNumber}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E8E0D6]">
                <span className="text-[#827B73]">Rated Capacity:</span>
                <strong className="text-[#B68B55]">{selectedPassport.ratedCapacity}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E8E0D6]">
                <span className="text-[#827B73]">Warranty Status:</span>
                <strong className="text-[#2D5A43] uppercase">{selectedPassport.warrantyStatus} ({selectedPassport.warrantyDurationYears} Yrs)</strong>
              </div>
            </div>

            <button
              onClick={() => setSelectedPassport(null)}
              className="w-full bg-[#172747] hover:bg-[#1E345E] text-white text-xs font-semibold py-2.5"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ==========================================
// 6. CUSTOMER WARRANTIES PAGE
// ==========================================
export function PortalWarrantiesPage() {
  const { warranties, customerProfile } = useSolarStore()
  const navigate = useNavigate()
  const [selectedWarranty, setSelectedWarranty] = useState<WarrantyRecord | null>(null)
  const [activeCategory, setActiveCategory] = useState<'all' | 'panel' | 'inverter' | 'battery'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handlePrint = () => {
    window.print()
  }

  const filteredWarranties = warranties.filter(w => {
    const matchesCategory = activeCategory === 'all' || w.category === activeCategory
    const q = searchQuery.toLowerCase().trim()
    const matchesSearch = !q ||
      w.productName.toLowerCase().includes(q) ||
      w.certificateNo.toLowerCase().includes(q) ||
      w.serialNumber.toLowerCase().includes(q) ||
      w.customerName.toLowerCase().includes(q)
    return matchesCategory && matchesSearch
  })

  // Calculation for remaining years
  const getRemainingYears = (expiryDate: string) => {
    const exp = new Date(expiryDate).getTime()
    const now = new Date().getTime()
    const diffYears = Math.max(0, Math.round((exp - now) / (1000 * 60 * 60 * 24 * 365.25)))
    return diffYears
  }

  return (
    <div className="space-y-6 pb-16">
      {/* 1. Header & Summary Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-[#172747] p-6 text-white shadow-xl">
        <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-[#FFDDB7]/15 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-[#FFDDB7]">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              100% Comprehensive Coverage • DISCOM & IEC Certified
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white font-['Plus_Jakarta_Sans']">
              Digital Warranty Certificates
            </h1>
            <p className="text-sm text-[#F7F3EC]/80 max-w-2xl">
              Official manufacturer bonds and performance guarantees issued for {customerProfile.name} (Site #{customerProfile.siteId} • {customerProfile.solarCapacity}). Every key asset is backed by linear power output and rapid zero-cost hardware replacement.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => navigate('/portal/service')}
              className="inline-flex items-center gap-2 rounded-xl bg-[#E87A5D] px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#d66c50] transition-colors"
            >
              <LifeBuoy className="h-4 w-4" />
              File Warranty Claim
            </button>
          </div>
        </div>

        {/* 4 Key SLA Badges */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-white/10 pt-4">
          <div className="rounded-xl bg-white/5 p-3 text-center border border-white/5">
            <span className="text-[10px] uppercase tracking-wider text-[#FFDDB7] font-semibold block">Total Covered Assets</span>
            <span className="text-xl font-bold text-white font-mono mt-0.5 block">{warranties.length} Products</span>
          </div>
          <div className="rounded-xl bg-white/5 p-3 text-center border border-white/5">
            <span className="text-[10px] uppercase tracking-wider text-[#FFDDB7] font-semibold block">Max Performance Bond</span>
            <span className="text-xl font-bold text-white font-mono mt-0.5 block">25 Years Linear</span>
          </div>
          <div className="rounded-xl bg-white/5 p-3 text-center border border-white/5">
            <span className="text-[10px] uppercase tracking-wider text-[#FFDDB7] font-semibold block">Warranty Status</span>
            <span className="text-xl font-bold text-emerald-400 font-mono mt-0.5 block">100% Active</span>
          </div>
          <div className="rounded-xl bg-white/5 p-3 text-center border border-white/5">
            <span className="text-[10px] uppercase tracking-wider text-[#FFDDB7] font-semibold block">Turnaround SLA</span>
            <span className="text-xl font-bold text-white font-mono mt-0.5 block">&lt; 24h RMA</span>
          </div>
        </div>
      </div>

      {/* 2. Search & Category Filters */}
      <div className="rounded-2xl bg-white p-4 shadow-sm border border-[#E8E0D6] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {(['all', 'panel', 'inverter', 'battery'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                activeCategory === cat
                  ? 'bg-[#172747] text-white shadow-sm'
                  : 'bg-[#F7F3EC] text-[#493027] hover:bg-[#E8E0D6]'
              }`}
            >
              {cat === 'all' && 'All Equipment (' + warranties.length + ')'}
              {cat === 'panel' && 'Solar Panels (25-Yr)'}
              {cat === 'inverter' && 'Inverters (5-Yr)'}
              {cat === 'battery' && 'Battery Storage (5-Yr)'}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8C7A6B]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search serial, certificate, or model..."
            className="w-full rounded-xl border border-[#E8E0D6] bg-[#F7F3EC]/50 pl-9 pr-3 py-1.5 text-xs text-[#172747] placeholder-[#8C7A6B] focus:border-[#172747] focus:outline-none focus:ring-1 focus:ring-[#172747]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#8C7A6B] hover:text-[#172747]"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* 3. Certificate Cards Grid */}
      <div className="space-y-4">
        {filteredWarranties.length === 0 ? (
          <div className="rounded-2xl bg-white p-12 text-center border border-[#E8E0D6]">
            <ShieldCheck className="mx-auto h-12 w-12 text-[#8C7A6B]/50" />
            <h3 className="mt-3 text-base font-bold text-[#172747]">No warranty certificates matched</h3>
            <p className="mt-1 text-xs text-[#6E7787]">Try adjusting your search query or switching categories.</p>
          </div>
        ) : (
          filteredWarranties.map((w) => {
            const remaining = getRemainingYears(w.expiryDate)
            return (
              <div
                key={w.id}
                className="rounded-2xl border border-[#E8E0D6] bg-white p-6 shadow-sm hover:shadow-md transition-shadow space-y-4"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F0EAE1] pb-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#172747] text-[#FFDDB7]">
                      {w.category === 'panel' && <Sun className="h-5 w-5" />}
                      {w.category === 'inverter' && <Zap className="h-5 w-5" />}
                      {w.category === 'battery' && <Award className="h-5 w-5" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#172747] bg-[#F7F3EC] px-2 py-0.5 rounded">
                          {w.certificateNo}
                        </span>
                        <button
                          onClick={() => handleCopy(w.certificateNo, w.id)}
                          className="text-[#8C7A6B] hover:text-[#172747] transition-colors"
                          title="Copy Certificate Number"
                        >
                          {copiedId === w.id ? (
                            <Check className="h-3.5 w-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>
                      <h3 className="text-lg font-bold text-[#172747] mt-1 font-['Plus_Jakarta_Sans']">
                        {w.productName}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-center">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      ACTIVE WARRANTY
                    </span>
                    <span className="rounded-full bg-[#172747]/5 px-2.5 py-1 text-[11px] font-semibold text-[#172747]">
                      {w.durationYears} Years Total
                    </span>
                  </div>
                </div>

                {/* Details Matrix */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs bg-[#FAF7F2] p-4 rounded-xl border border-[#F0EAE1]">
                  <div>
                    <span className="text-[#8C7A6B] font-medium block">Asset Serial Number</span>
                    <strong className="font-mono text-[#172747] text-xs font-bold mt-0.5 block">{w.serialNumber}</strong>
                  </div>
                  <div>
                    <span className="text-[#8C7A6B] font-medium block">Coverage Window</span>
                    <strong className="text-[#172747] mt-0.5 block">{w.startDate} → {w.expiryDate}</strong>
                  </div>
                  <div>
                    <span className="text-[#8C7A6B] font-medium block">Remaining Validity</span>
                    <strong className="text-emerald-700 font-bold mt-0.5 block">{remaining} Years Remaining</strong>
                  </div>
                  <div>
                    <span className="text-[#8C7A6B] font-medium block">Registered Beneficiary</span>
                    <strong className="text-[#172747] mt-0.5 block">{w.customerName}</strong>
                  </div>
                </div>

                {/* Scope of Coverage */}
                <div className="rounded-xl bg-white p-3.5 text-xs border border-[#E8E0D6] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#172747] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                      <BadgeCheck className="h-4 w-4 text-emerald-600" />
                      Legally Binding Coverage Scope
                    </span>
                    <span className="text-[10px] text-[#8C7A6B] font-mono">ISO 9001:2015 & IEC 61215</span>
                  </div>
                  <p className="text-[#493027] leading-relaxed">{w.coverageScope}</p>
                </div>

                {/* Action Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedWarranty(w)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#172747] px-4 py-2 text-xs font-bold text-white hover:bg-[#0c162b] transition-colors"
                    >
                      <Award className="h-3.5 w-3.5 text-[#FFDDB7]" />
                      View Official Certificate Bond
                    </button>
                    <button
                      onClick={() => {
                        setSelectedWarranty(w)
                        setTimeout(() => handlePrint(), 300)
                      }}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-[#E8E0D6] bg-white px-3.5 py-2 text-xs font-semibold text-[#172747] hover:bg-[#F7F3EC] transition-colors"
                    >
                      <Printer className="h-3.5 w-3.5 text-[#8C7A6B]" />
                      Print / PDF
                    </button>
                  </div>

                  <button
                    onClick={() => navigate('/portal/service')}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E87A5D] hover:text-[#d66c50] transition-colors"
                  >
                    <LifeBuoy className="h-3.5 w-3.5" />
                    Claim Warranty on Serial {w.serialNumber} →
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* 4. SLA Protocol & Assurance Banner */}
      <div className="rounded-2xl bg-[#FFF8F5] border border-[#E8E0D6] p-6 space-y-4">
        <h3 className="text-base font-bold text-[#172747] font-['Plus_Jakarta_Sans'] flex items-center gap-2">
          <Shield className="h-5 w-5 text-[#E87A5D]" />
          SunPower One 3-Step Warranty Claim Guarantee
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="rounded-xl bg-white p-4 border border-[#E8E0D6] space-y-1">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#172747] text-white font-bold text-[11px]">1</span>
            <h4 className="font-bold text-[#172747] pt-1">File via Customer Desk</h4>
            <p className="text-[#6E7787]">Submit a service request with your asset serial number and inverter fault code.</p>
          </div>
          <div className="rounded-xl bg-white p-4 border border-[#E8E0D6] space-y-1">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#172747] text-white font-bold text-[11px]">2</span>
            <h4 className="font-bold text-[#172747] pt-1">Telemetry Adjudication</h4>
            <p className="text-[#6E7787]">Our engineers verify string telemetry and DISCOM net-meter logs remotely within 4 hours.</p>
          </div>
          <div className="rounded-xl bg-white p-4 border border-[#E8E0D6] space-y-1">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#172747] text-white font-bold text-[11px]">3</span>
            <h4 className="font-bold text-[#172747] pt-1">Zero-Cost Replacement</h4>
            <p className="text-[#6E7787]">Certified technician dispatched to your site with warranty replacement hardware under ₹0 RMA.</p>
          </div>
        </div>
      </div>

      {/* 5. Official Certificate Modal */}
      {selectedWarranty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl border-4 border-[#172747] overflow-hidden my-8">
            {/* Modal Controls Bar */}
            <div className="flex items-center justify-between bg-[#172747] px-6 py-3 text-white">
              <span className="text-xs font-mono font-bold tracking-wider text-[#FFDDB7]">
                OFFICIAL WARRANTY BOND #{selectedWarranty.certificateNo}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="rounded-lg bg-white/10 px-2.5 py-1 text-xs font-semibold text-white hover:bg-white/20 transition-colors flex items-center gap-1"
                >
                  <Printer className="h-3 w-3" />
                  Print Bond
                </button>
                <button
                  onClick={() => setSelectedWarranty(null)}
                  className="rounded-lg p-1 text-white/80 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Official Certificate Paper Container */}
            <div className="p-8 space-y-6 bg-[#FCFBF8]">
              {/* Certificate Header Banner */}
              <div className="text-center space-y-1 border-b-2 border-[#172747] pb-6">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-[#172747] text-[#FFDDB7] mb-2 shadow">
                  <ShieldCheck className="h-7 w-7" />
                </div>
                <h2 className="text-2xl font-bold uppercase tracking-wider text-[#172747] font-['Plus_Jakarta_Sans']">
                  Certificate of Solar Warranty
                </h2>
                <p className="text-xs text-[#8C7A6B] uppercase tracking-widest font-semibold">
                  SunPower One Distributed Clean Energy Systems Limited
                </p>
                <p className="text-[11px] text-[#6E7787]">
                  Statutory Performance Bond issued in accordance with MNRE Guidelines & IEC 61215/61730
                </p>
              </div>

              {/* Certificate Body Grid */}
              <div className="grid grid-cols-2 gap-4 text-xs border border-[#E8E0D6] bg-white p-5 rounded-xl">
                <div>
                  <span className="text-[#8C7A6B] block">Registered Beneficiary</span>
                  <strong className="text-sm font-bold text-[#172747] block mt-0.5">{selectedWarranty.customerName}</strong>
                  <span className="text-[11px] text-[#6E7787]">Site ID: Site #AZ-8422 • 3 kW On-Grid</span>
                </div>
                <div>
                  <span className="text-[#8C7A6B] block">Certificate Reference</span>
                  <strong className="font-mono text-sm font-bold text-[#172747] block mt-0.5">{selectedWarranty.certificateNo}</strong>
                  <span className="text-[11px] text-[#6E7787]">Serial: {selectedWarranty.serialNumber}</span>
                </div>
                <div>
                  <span className="text-[#8C7A6B] block">Covered Equipment</span>
                  <strong className="text-xs font-bold text-[#172747] block mt-0.5">{selectedWarranty.productName}</strong>
                </div>
                <div>
                  <span className="text-[#8C7A6B] block">Guarantee Period</span>
                  <strong className="text-xs font-bold text-emerald-700 block mt-0.5">
                    {selectedWarranty.durationYears} Years ({selectedWarranty.startDate} to {selectedWarranty.expiryDate})
                  </strong>
                </div>
              </div>

              {/* Warranty Guarantee Covenant */}
              <div className="rounded-xl bg-[#FAF7F2] p-4 text-xs border border-[#E8E0D6] space-y-2">
                <span className="font-bold text-[#172747] uppercase tracking-wider text-[11px] block">
                  Authoritative Performance & Repair Covenant
                </span>
                <p className="text-[#493027] leading-relaxed">
                  {selectedWarranty.coverageScope}
                </p>
                <p className="text-[11px] text-[#8C7A6B] italic">
                  In the event of module degradation beyond permissible tolerance or inverter internal electrical failure, SunPower One guarantees on-site replacement at ₹0 cost under our certified RMA warranty protocol.
                </p>
              </div>

              {/* Digital Seal & Signatures */}
              <div className="pt-4 border-t border-[#E8E0D6] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-14 w-14 rounded-full border-2 border-dashed border-[#172747] flex items-center justify-center p-1 bg-white">
                    <div className="h-full w-full rounded-full bg-[#172747] text-[#FFDDB7] flex items-center justify-center font-bold text-[9px] uppercase tracking-tighter text-center leading-tight">
                      OFFICIAL<br />SEAL
                    </div>
                  </div>
                  <div>
                    <span className="font-mono text-[10px] text-[#8C7A6B] block">SHA-256 DIGITAL BOND VERIFIED</span>
                    <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                      Active & Enforceable
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-['Caveat',cursive] text-lg font-bold text-[#172747] block italic">
                    Marcus Vance
                  </span>
                  <div className="border-t border-[#172747] pt-1">
                    <span className="text-[10px] text-[#8C7A6B] block uppercase tracking-wider font-bold">
                      Chief Technology Officer
                    </span>
                    <span className="text-[10px] text-[#6E7787] block">SunPower One Quality Assurance</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="flex justify-end gap-2 bg-[#F0EAE1] px-6 py-3 border-t border-[#E8E0D6]">
              <button
                onClick={() => setSelectedWarranty(null)}
                className="rounded-xl border border-[#E8E0D6] bg-white px-4 py-2 text-xs font-bold text-[#172747] hover:bg-[#F7F3EC] transition-colors"
              >
                Close
              </button>
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#172747] px-4 py-2 text-xs font-bold text-white hover:bg-[#0c162b] transition-colors"
              >
                <Printer className="h-3.5 w-3.5 text-[#FFDDB7]" />
                Print Certificate PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


export function PortalServicePage() {
  const { serviceTickets, logServiceTicket, customerProfile } = useSolarStore()
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [formData, setFormData] = useState({
    customerName: 'Siddharth Varma',
    customerPhone: '+91 98860 33412',
    siteAddress: '77, 8th Main, Koramangala 4th Block, Bengaluru',
    serialNumber: 'INV-4000-9102',
    faultCode: 'ERR-F04',
    description: 'Inverter tripping on overvoltage alarm during midday peak.',
    priority: 'high' as ServiceTicket['priority'],
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    logServiceTicket(formData)
    setIsOpenModal(false)
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="rounded-2xl bg-white p-6 shadow-sm border border-[#E8E0D6] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#172747] font-['Plus_Jakarta_Sans']">
            Customer Service & Support Desk
          </h1>
          <p className="text-sm text-[#6E7787]">
            File warranty service claims, track field technician visits, and confirm resolved repairs.
          </p>
        </div>

        <button
          onClick={() => setIsOpenModal(true)}
          className="flex items-center gap-2 rounded-xl bg-[#172747] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#011232]"
        >
          <Plus className="h-4 w-4 text-[#E9DDCA]" />
          + File Service Request
        </button>
      </div>

      <div className="space-y-4">
        {serviceTickets.map((t) => (
          <div key={t.id} className="rounded-2xl bg-white p-6 shadow-sm border border-[#E8E0D6] space-y-3">
            <div className="flex items-center justify-between border-b border-[#E8E0D6] pb-2">
              <span className="font-mono text-xs font-bold text-[#172747]">{t.ticketNo}</span>
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                ₹0 Covered Zero-Cost Warranty
              </span>
            </div>

            <div>
              <h3 className="font-bold text-[#172747] text-sm">Fault: {t.faultCode} - {t.productName}</h3>
              <p className="text-xs text-[#6E7787] mt-0.5">{t.faultDescription}</p>
            </div>

            <div className="flex justify-between items-center text-xs text-[#6E7787] pt-2 border-t border-[#F7F3EC]">
              <span>Assigned Technician: <strong className="text-[#172747]">{t.assignedTechnician}</strong></span>
              <span>Status: <strong className="text-emerald-700 capitalize">{t.status}</strong></span>
            </div>
          </div>
        ))}
      </div>

      {isOpenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-[#E8E0D6] space-y-4">
            <div className="flex items-center justify-between border-b border-[#E8E0D6] pb-3">
              <h3 className="font-bold text-base text-[#172747] font-['Plus_Jakarta_Sans']">
                File Warranty Repair Claim
              </h3>
              <button
                onClick={() => setIsOpenModal(false)}
                className="rounded-lg p-1 text-[#6E7787] hover:bg-[#F7F3EC] hover:text-[#172747]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#6E7787] font-medium">Equipment Serial Number</label>
                <input
                  type="text"
                  required
                  value={formData.serialNumber}
                  onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-[#E8E0D6] p-2.5 font-mono uppercase"
                />
              </div>

              <div>
                <label className="block text-[#6E7787] font-medium">Observed Issue / Error Code</label>
                <input
                  type="text"
                  required
                  value={formData.faultCode}
                  onChange={(e) => setFormData({ ...formData, faultCode: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-[#E8E0D6] p-2.5 font-mono font-bold text-red-600"
                />
              </div>

              <div>
                <label className="block text-[#6E7787] font-medium">Issue Description</label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-[#E8E0D6] p-2.5"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsOpenModal(false)}
                  className="flex-1 rounded-xl border border-[#E8E0D6] py-2.5 font-bold text-[#6E7787]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-[#172747] py-2.5 font-bold text-white hover:bg-[#011232]"
                >
                  Submit Service Claim
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

// ==========================================
// 8. CUSTOMER PROFILE PAGE
// ==========================================
export function PortalProfilePage() {
  const { customerProfile, updateCustomerProfile } = useSolarStore()
  const [isEditing, setIsEditing] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [editForm, setEditForm] = useState({
    name: customerProfile.name,
    phone: customerProfile.phone,
    email: customerProfile.email,
    address: customerProfile.address,
    solarCapacity: customerProfile.solarCapacity,
    discomConsumerId: customerProfile.discomConsumerId,
  })

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    updateCustomerProfile(editForm)
    setIsEditing(false)
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  const initials = customerProfile.name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      <div className="rounded-2xl bg-white p-6 shadow-sm border border-[#E8E0D6] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#172747]/5 px-2.5 py-0.5 text-xs font-semibold text-[#172747] uppercase tracking-wider">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Verified Customer Record
            </span>
            <span className="text-xs font-mono text-[#8C7A6B]">Customer ID: {customerProfile.id}</span>
          </div>
          <h1 className="text-2xl font-bold text-[#172747] font-['Plus_Jakarta_Sans'] mt-1">
            Customer Account Profile
          </h1>
          <p className="text-sm text-[#6E7787]">
            Unified credentials, DISCOM consumer record, and microgrid solar installation details.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {saveSuccess && (
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1">
              <Check className="h-3.5 w-3.5" /> Profile Updated Across System!
            </span>
          )}
          <button
            onClick={() => {
              setEditForm({
                name: customerProfile.name,
                phone: customerProfile.phone,
                email: customerProfile.email,
                address: customerProfile.address,
                solarCapacity: customerProfile.solarCapacity,
                discomConsumerId: customerProfile.discomConsumerId,
              })
              setIsEditing(!isEditing)
            }}
            className="px-4 py-2 rounded-xl bg-[#172747] text-white text-xs font-semibold hover:bg-[#011232] transition-colors"
          >
            {isEditing ? 'Cancel Edit' : 'Edit Customer Profile'}
          </button>
        </div>
      </div>

      {/* Edit Form Drawer */}
      {isEditing && (
        <div className="rounded-2xl bg-[#FCFBF8] p-6 shadow-sm border-2 border-[#172747] space-y-4">
          <div className="flex items-center justify-between border-b border-[#E8E0D6] pb-3">
            <h3 className="font-bold text-base text-[#172747] font-['Plus_Jakarta_Sans']">
              Update Customer Information
            </h3>
            <span className="text-xs text-[#8C7A6B]">Changes propagate immediately to all portal views</span>
          </div>

          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[#6E7787] font-medium mb-1">Customer Full Name</label>
              <input
                type="text"
                required
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="w-full rounded-xl border border-[#E8E0D6] p-2.5 text-xs text-[#172747] bg-white focus:border-[#172747] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[#6E7787] font-medium mb-1">Primary Phone Number</label>
              <input
                type="text"
                required
                value={editForm.phone}
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                className="w-full rounded-xl border border-[#E8E0D6] p-2.5 text-xs text-[#172747] bg-white focus:border-[#172747] focus:outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-[#6E7787] font-medium mb-1">Email Address</label>
              <input
                type="email"
                required
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                className="w-full rounded-xl border border-[#E8E0D6] p-2.5 text-xs text-[#172747] bg-white focus:border-[#172747] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[#6E7787] font-medium mb-1">Solar System Capacity</label>
              <input
                type="text"
                required
                value={editForm.solarCapacity}
                onChange={(e) => setEditForm({ ...editForm, solarCapacity: e.target.value })}
                className="w-full rounded-xl border border-[#E8E0D6] p-2.5 text-xs text-[#172747] bg-white focus:border-[#172747] focus:outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[#6E7787] font-medium mb-1">Installation Site Address</label>
              <input
                type="text"
                required
                value={editForm.address}
                onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                className="w-full rounded-xl border border-[#E8E0D6] p-2.5 text-xs text-[#172747] bg-white focus:border-[#172747] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[#6E7787] font-medium mb-1">DISCOM Consumer ID</label>
              <input
                type="text"
                required
                value={editForm.discomConsumerId}
                onChange={(e) => setEditForm({ ...editForm, discomConsumerId: e.target.value })}
                className="w-full rounded-xl border border-[#E8E0D6] p-2.5 text-xs text-[#172747] bg-white focus:border-[#172747] focus:outline-none font-mono"
              />
            </div>
            <div className="flex items-end gap-2">
              <button
                type="submit"
                className="w-full rounded-xl bg-[#172747] py-2.5 text-xs font-bold text-white hover:bg-[#011232] transition-colors"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="w-full rounded-xl bg-gray-100 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Primary Customer Profile Card */}
      <div className="rounded-2xl bg-white p-6 shadow-sm border border-[#E8E0D6] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8E0D6] pb-5">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#172747] text-[#FFDDB7] text-2xl font-bold border-2 border-[#B68B55]/30 shadow-md">
              {initials}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-[#172747] font-['Plus_Jakarta_Sans']">{customerProfile.name}</h3>
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                  Active Consumer
                </span>
              </div>
              <p className="text-xs text-[#6E7787] mt-0.5">
                {customerProfile.gridStatus} • Site #{customerProfile.siteId}
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-[11px] uppercase tracking-wider text-[#8C7A6B] font-semibold block">Customer Account ID</span>
            <span className="text-base font-mono font-bold text-[#172747] block">{customerProfile.id}</span>
          </div>
        </div>

        {/* 6 Key Attributes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div className="rounded-xl bg-[#F7F3EC] p-4 border border-[#E8E0D6] space-y-1">
            <span className="text-[#8C7A6B] block font-medium">Customer Full Name</span>
            <strong className="text-[#172747] text-sm block">{customerProfile.name}</strong>
            <span className="text-[10px] text-[#6E7787]">Primary Registered Account Holder</span>
          </div>

          <div className="rounded-xl bg-[#F7F3EC] p-4 border border-[#E8E0D6] space-y-1">
            <span className="text-[#8C7A6B] block font-medium">Primary Contact Phone</span>
            <strong className="text-[#172747] font-mono text-sm block">{customerProfile.phone}</strong>
            <span className="text-[10px] text-[#6E7787]">SMS OTP & Telemetry Alerts Enabled</span>
          </div>

          <div className="rounded-xl bg-[#F7F3EC] p-4 border border-[#E8E0D6] space-y-1">
            <span className="text-[#8C7A6B] block font-medium">Email Address</span>
            <strong className="text-[#172747] text-sm block">{customerProfile.email}</strong>
            <span className="text-[10px] text-[#6E7787]">Monthly Invoices & Warranty Bond Dispatch</span>
          </div>

          <div className="rounded-xl bg-[#F7F3EC] p-4 border border-[#E8E0D6] space-y-1 md:col-span-2">
            <span className="text-[#8C7A6B] block font-medium">Installation Site Address</span>
            <strong className="text-[#172747] text-sm block">{customerProfile.address}</strong>
            <span className="text-[10px] text-[#6E7787]">Rooftop PV Array Geotagged & Commissioned</span>
          </div>

          <div className="rounded-xl bg-[#F7F3EC] p-4 border border-[#E8E0D6] space-y-1">
            <span className="text-[#8C7A6B] block font-medium">Customer Identifier</span>
            <strong className="font-mono text-[#172747] text-sm block">{customerProfile.id}</strong>
            <span className="text-[10px] text-[#6E7787]">Unique Global Customer Record</span>
          </div>

          <div className="rounded-xl bg-emerald-50 p-4 border border-emerald-200 space-y-1">
            <span className="text-emerald-800 block font-medium">Installed Solar Capacity</span>
            <strong className="text-emerald-900 text-sm block">{customerProfile.solarCapacity}</strong>
            <span className="text-[10px] text-emerald-700">Live Telemetry: {customerProfile.liveOutputKw} kW Operating</span>
          </div>

          <div className="rounded-xl bg-[#F7F3EC] p-4 border border-[#E8E0D6] space-y-1">
            <span className="text-[#8C7A6B] block font-medium">DISCOM Consumer Account</span>
            <strong className="font-mono text-[#172747] text-sm block">{customerProfile.discomConsumerId}</strong>
            <span className="text-[10px] text-[#6E7787]">Bi-Directional Net Meter Synchronized</span>
          </div>

          <div className="rounded-xl bg-[#F7F3EC] p-4 border border-[#E8E0D6] space-y-1">
            <span className="text-[#8C7A6B] block font-medium">PM Surya Ghar Scheme Reference</span>
            <strong className="font-mono text-[#172747] text-sm block">{customerProfile.schemeRef}</strong>
            <span className="text-[10px] text-[#6E7787]">Direct Benefit Transfer (DBT) Approved</span>
          </div>
        </div>
      </div>
    </div>
  )
}
