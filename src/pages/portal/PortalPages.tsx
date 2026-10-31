import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSolarStore, type Quotation, type ServiceTicket } from '@/lib/store/solarStore'
import { MetricCard } from '@/components/ui/MetricCard'
import {
  Sun,
  Zap,
  ShieldCheck,
  LifeBuoy,
  CheckCircle2,
  Sparkles,
  Plus,
  X
} from 'lucide-react'

// ==========================================
// 1. CUSTOMER PORTAL DASHBOARD
// ==========================================
export function PortalDashboardPage() {
  const { orders, warranties, serviceTickets } = useSolarStore()
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
              Welcome back, {currentOrder?.customerName || 'Siddharth Varma'}
            </h1>
            <p className="text-sm text-[#F7F3EC]/80 max-w-xl">
              {currentOrder?.capacityKw || 4.0} kW Rooftop Solar PV Microgrid at {currentOrder?.deliveryAddress || 'Koramangala, Bengaluru'}. High-efficiency Mono PERC array operating normally.
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
  const { quotations } = useSolarStore()
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null)

  return (
    <div className="space-y-6 pb-12">
      <div className="rounded-2xl bg-white p-6 shadow-sm border border-[#E8E0D6]">
        <h1 className="text-2xl font-bold text-[#172747] font-['Plus_Jakarta_Sans']">
          My Commercial Quotations
        </h1>
        <p className="text-sm text-[#6E7787]">
          Review engineering proposals, component pricing breakdowns, and accepted agreements.
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
  const { orders } = useSolarStore()

  return (
    <div className="space-y-6 pb-12">
      <div className="rounded-2xl bg-white p-6 shadow-sm border border-[#E8E0D6]">
        <h1 className="text-2xl font-bold text-[#172747] font-['Plus_Jakarta_Sans']">
          My Orders & Payment Schedule
        </h1>
        <p className="text-sm text-[#6E7787]">
          Track contract milestones: 30% Booking Advance, 50% Pre-Dispatch, and 20% Commissioning.
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
  const { installations } = useSolarStore()

  return (
    <div className="space-y-6 pb-12">
      <div className="rounded-2xl bg-white p-6 shadow-sm border border-[#E8E0D6]">
        <h1 className="text-2xl font-bold text-[#172747] font-['Plus_Jakarta_Sans']">
          Installation & Field Commissioning
        </h1>
        <p className="text-sm text-[#6E7787]">
          Verified commissioning checklists, electrical meter readings, and technician sign-offs.
        </p>
      </div>

      <div className="space-y-4">
        {installations.map((inst) => (
          <div key={inst.id} className="rounded-2xl bg-white p-6 shadow-sm border border-[#E8E0D6] space-y-4">
            <div className="flex items-center justify-between border-b border-[#E8E0D6] pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-[#6E7787]">{inst.jobNo}</span>
                <h3 className="text-lg font-bold text-[#172747]">{inst.customerName} - {inst.capacityKw} kW System</h3>
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
  const { serials } = useSolarStore()

  return (
    <div className="space-y-6 pb-12">
      <div className="rounded-2xl bg-white p-6 shadow-sm border border-[#E8E0D6]">
        <h1 className="text-2xl font-bold text-[#172747] font-['Plus_Jakarta_Sans']">
          Installed Equipment & Serial Registry
        </h1>
        <p className="text-sm text-[#6E7787]">
          Immutable serial identity numbers recorded at dispatch and registered with OEM manufacturers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {serials.map((s) => (
          <div key={s.id} className="rounded-2xl bg-white p-5 shadow-sm border border-[#E8E0D6] space-y-3">
            <div className="flex items-center justify-between border-b border-[#E8E0D6] pb-2">
              <span className="font-mono text-xs font-bold text-[#172747]">{s.serialNumber}</span>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 uppercase">
                {s.status.replace('_', ' ')}
              </span>
            </div>

            <div>
              <h3 className="font-bold text-[#172747] text-sm">{s.productName}</h3>
              <p className="text-xs text-[#6E7787] capitalize mt-0.5">Category: {s.category}</p>
            </div>

            <div className="flex justify-between items-center rounded-xl bg-[#F7F3EC] p-2.5 text-xs">
              <span className="text-[#6E7787]">OEM Warranty:</span>
              <strong className="text-[#493027] font-bold">{s.warrantyYears} Years Protection</strong>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ==========================================
// 6. CUSTOMER WARRANTIES PAGE
// ==========================================
export function PortalWarrantiesPage() {
  const { warranties } = useSolarStore()

  return (
    <div className="space-y-6 pb-12">
      <div className="rounded-2xl bg-white p-6 shadow-sm border border-[#E8E0D6]">
        <h1 className="text-2xl font-bold text-[#172747] font-['Plus_Jakarta_Sans']">
          Digital Warranty Certificates
        </h1>
        <p className="text-sm text-[#6E7787]">
          Official warranty bonds guaranteeing 20-year module efficiency and 2-year inverter replacement.
        </p>
      </div>

      <div className="space-y-4">
        {warranties.map((w) => (
          <div key={w.id} className="rounded-2xl border-2 border-[#172747] bg-[#FFF8F5] p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#E8E0D6] pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-[#172747]">{w.certificateNo}</span>
                <h3 className="text-lg font-bold text-[#172747]">{w.productName}</h3>
              </div>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                ACTIVE WARRANTY
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-[#6E7787] block">Asset Serial</span>
                <strong className="font-mono text-[#172747]">{w.serialNumber}</strong>
              </div>
              <div>
                <span className="text-[#6E7787] block">Coverage Period</span>
                <strong className="text-[#172747]">{w.durationYears} Years ({w.startDate} - {w.expiryDate})</strong>
              </div>
              <div>
                <span className="text-[#6E7787] block">Registered Owner</span>
                <strong className="text-[#172747]">{w.customerName}</strong>
              </div>
            </div>

            <div className="rounded-xl bg-white p-3 text-xs border border-[#E8E0D6]">
              <span className="font-bold text-[#6E7787] uppercase tracking-wider block">Coverage Scope</span>
              <p className="mt-1 text-[#172747]">{w.coverageScope}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ==========================================
// 7. CUSTOMER SERVICE DESK & TICKETS
// ==========================================
export function PortalServicePage() {
  const { serviceTickets, logServiceTicket } = useSolarStore()
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
  const { orders } = useSolarStore()
  const currentOrder = orders[0]

  return (
    <div className="space-y-6 pb-12">
      <div className="rounded-2xl bg-white p-6 shadow-sm border border-[#E8E0D6]">
        <h1 className="text-2xl font-bold text-[#172747] font-['Plus_Jakarta_Sans']">
          Customer Account Profile
        </h1>
        <p className="text-sm text-[#6E7787]">
          Verified account credentials, DISCOM consumer number, and site installation details.
        </p>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm border border-[#E8E0D6] space-y-4">
        <div className="flex items-center gap-4 border-b border-[#E8E0D6] pb-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#172747] text-white text-xl font-bold">
            SV
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#172747]">{currentOrder?.customerName || 'Siddharth Varma'}</h3>
            <p className="text-xs text-[#6E7787]">Active Solar Microgrid Consumer • BESCOM Net Metered</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="space-y-3">
            <div>
              <span className="text-[#6E7787] block font-medium">Primary Contact Phone</span>
              <strong className="text-[#172747] font-mono">{currentOrder?.customerPhone || '+91 98860 33412'}</strong>
            </div>
            <div>
              <span className="text-[#6E7787] block font-medium">Email Address</span>
              <strong className="text-[#172747]">siddharth.varma@example.com</strong>
            </div>
            <div>
              <span className="text-[#6E7787] block font-medium">Installation Site Address</span>
              <strong className="text-[#172747]">{currentOrder?.deliveryAddress || '77, 8th Main, Koramangala 4th Block, Bengaluru'}</strong>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <span className="text-[#6E7787] block font-medium">DISCOM Consumer Account ID</span>
              <strong className="font-mono text-[#172747]">BESCOM-S4-992014-A</strong>
            </div>
            <div>
              <span className="text-[#6E7787] block font-medium">Installed Solar Capacity</span>
              <strong className="text-[#172747]">{currentOrder?.capacityKw || 4.0} kW ({currentOrder?.systemType || 'On-Grid'})</strong>
            </div>
            <div>
              <span className="text-[#6E7787] block font-medium">PM Surya Ghar Reference</span>
              <strong className="font-mono text-[#172747]">SURYA-2026-KA-0941</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
