import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Calendar,
  LifeBuoy,
  Plus,
  ArrowRight,
  Sparkles,
  QrCode,
  DollarSign,
} from 'lucide-react'
import { MetricCard } from '@/components/ui/MetricCard'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { StatusChip } from '@/components/ui/StatusChip'
import { Button } from '@/components/ui/button'
import { SerialScannerModal } from '@/components/ui/SerialScannerModal'
import { useSolarStore } from '@/lib/store/solarStore'

export function DashboardPage() {
  const {
    leads,
    surveys,
    orders,
    installations,
    serviceTickets,
  } = useSolarStore()

  const [scannerOpen, setScannerOpen] = useState(false)

  // Aggregated KPIs
  const totalRevenue = orders.reduce((sum, o) => sum + o.paidAmount, 0)
  const pendingSurveysCount = surveys.filter((s) => s.status === 'pending_approval').length
  const activeJobsCount = installations.filter((i) => i.status !== 'commissioned').length
  const openTicketsCount = serviceTickets.filter((t) => t.status !== 'closed').length

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Executive Command Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#172747] via-[#261914] to-[#493027] text-white p-6 sm:p-8 shadow-warm-lg border border-[#493027] relative overflow-hidden">
        {/* Subtle geometric lines */}
        <div className="absolute inset-0 pointer-events-none opacity-10">
          <svg className="w-full h-full object-cover" fill="none" viewBox="0 0 800 200">
            <path d="M-100 50 L900 150" stroke="#FFDDB7" strokeWidth="2" strokeDasharray="6 6" />
            <path d="M-100 120 L900 40" stroke="#FFDDB7" strokeWidth="1.5" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#FFDDB7] text-xs font-semibold uppercase tracking-wider border border-white/10">
              <span className="w-2 h-2 rounded-full bg-[#4ADE80] animate-pulse" />
              <span>SCADA Telemetry Grid Active • 99.98% Pr</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Solar Operations Command Center
            </h1>
            <p className="text-sm text-[#EFE6E1] max-w-2xl leading-relaxed">
              Operating baseline: ~40 monthly rooftop installations across 15 certified technician crews.
              Connected lifecycle from customer lead to survey approval, serial dispatch, and 20-year warranty.
            </p>
          </div>

          {/* Quick Action Button Deck */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Link to="/app/crm/leads">
              <Button variant="default" className="bg-[#172747] hover:bg-[#1E345E] text-white border border-[#FFDDB7]/30">
                <Plus className="h-4 w-4 mr-1 text-[#FFDDB7]" />
                New Lead
              </Button>
            </Link>
            <Link to="/app/surveys">
              <Button variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/20">
                <Calendar className="h-4 w-4 mr-1 text-[#FFDDB7]" />
                Site Surveys ({pendingSurveysCount})
              </Button>
            </Link>
            <Button
              variant="outline"
              onClick={() => setScannerOpen(true)}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20"
            >
              <QrCode className="h-4 w-4 mr-1 text-[#FFDDB7]" />
              Scan QR Serial
            </Button>
          </div>
        </div>
      </div>

      {/* 4 Core High-Impact Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <MetricCard
          label="Managed Generation"
          value="74.2"
          unit="MW DC"
          trend={{ value: '+4.2%', direction: 'up', label: 'vs last month' }}
          subtext="846 active solar installations"
          icon={<span className="material-symbols-outlined text-[20px]">solar_power</span>}
        />

        <MetricCard
          label="Collected Revenue"
          value={`₹${(totalRevenue / 100000).toFixed(1)}`}
          unit="Lakhs"
          trend={{ value: '88% of target', direction: 'neutral' }}
          subtext="Milestone payments collected"
          icon={<DollarSign className="h-5 w-5 text-[#2D5A43]" />}
        />

        <MetricCard
          label="In-Flight Installations"
          value={activeJobsCount}
          unit="Crews"
          trend={{ value: '15 Techs Assigned', direction: 'up' }}
          subtext="Rooftop jobs in progress"
          icon={<span className="material-symbols-outlined text-[20px]">engineering</span>}
        />

        <MetricCard
          label="Active Service Desk"
          value={openTicketsCount}
          unit="Tickets"
          trend={{ value: '100% Zero-Cost', direction: 'down', isGood: true }}
          subtext="Covered warranty repairs"
          icon={<LifeBuoy className="h-5 w-5 text-[#B68B55]" />}
        />
      </div>

      {/* Two Column Grid: Pipeline Activity & Critical Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Order & Dispatch Velocity */}
        <div className="lg:col-span-7 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-[#E8E0D6]">
              <div>
                <CardTitle className="text-base font-bold text-[#172747]">
                  Active Sales Orders & Equipment Dispatch
                </CardTitle>
                <p className="text-xs text-[#827B73]">
                  Connected orders with payment milestone and serial number status
                </p>
              </div>
              <Link to="/app/orders">
                <Button variant="ghost" size="sm" className="text-xs">
                  View All Orders <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </Link>
            </CardHeader>

            <CardContent className="p-0">
              <div className="divide-y divide-[#E8E0D6]">
                {orders.slice(0, 4).map((ord) => (
                  <div
                    key={ord.id}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#F7F3EC]/50 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#172747]">
                          {ord.orderNo}
                        </span>
                        <StatusChip status={ord.status} />
                        <span className="text-xs font-semibold text-[#827B73]">
                          {ord.capacityKw} kW {ord.systemType.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-[#292522]">{ord.customerName}</p>
                      <p className="text-xs text-[#827B73] flex items-center gap-2">
                        <span>Milestone: <strong className="text-[#292522]">{ord.paymentMilestone}</strong></span>
                        <span>•</span>
                        <span>Serials: <strong className="text-[#172747] font-mono">{ord.allocatedSerials.length > 0 ? ord.allocatedSerials.join(', ') : 'Pending Allocation'}</strong></span>
                      </p>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1 shrink-0">
                      <span className="font-display text-sm font-bold text-[#292522] tabular-nums">
                        ₹{ord.paidAmount.toLocaleString()}
                      </span>
                      <span className="text-[11px] text-[#827B73]">
                        of ₹{ord.totalAmount.toLocaleString()}
                      </span>
                      <Link to="/app/inventory/dispatch" className="mt-1">
                        <Button variant="outline" size="sm" className="h-7 text-xs">
                          Dispatch Hub
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Connected Lifecycle Navigation Guide */}
          <Card className="bg-[#F5ECE7]/60 border-[#E8E0D6]">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold text-[#493027] flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#B68B55]" />
                Connected Business Operating Lifecycle
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <Link
                  to="/app/crm/leads"
                  className="p-3 rounded-lg bg-white border border-[#E8E0D6] hover:border-[#172747] transition-colors"
                >
                  <p className="text-[10px] uppercase font-bold text-[#827B73]">Step 1</p>
                  <p className="font-semibold text-[#172747] mt-0.5">Customer Lead</p>
                  <p className="text-[11px] text-[#827B73] mt-1">{leads.length} Active leads</p>
                </Link>

                <Link
                  to="/app/surveys"
                  className="p-3 rounded-lg bg-white border border-[#E8E0D6] hover:border-[#172747] transition-colors"
                >
                  <p className="text-[10px] uppercase font-bold text-[#827B73]">Step 2</p>
                  <p className="font-semibold text-[#172747] mt-0.5">Site Survey</p>
                  <p className="text-[11px] text-[#827B73] mt-1">Approval Gatekeeper</p>
                </Link>

                <Link
                  to="/app/configurator"
                  className="p-3 rounded-lg bg-white border border-[#E8E0D6] hover:border-[#172747] transition-colors"
                >
                  <p className="text-[10px] uppercase font-bold text-[#827B73]">Step 3</p>
                  <p className="font-semibold text-[#172747] mt-0.5">BOM & Quotation</p>
                  <p className="text-[11px] text-[#827B73] mt-1">Auto-calculated 1-5kW</p>
                </Link>

                <Link
                  to="/app/inventory/dispatch"
                  className="p-3 rounded-lg bg-white border border-[#E8E0D6] hover:border-[#172747] transition-colors"
                >
                  <p className="text-[10px] uppercase font-bold text-[#827B73]">Step 4</p>
                  <p className="font-semibold text-[#172747] mt-0.5">Serial Dispatch</p>
                  <p className="text-[11px] text-[#827B73] mt-1">20-Yr Warranty Start</p>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column (5 cols): Surveys Needing Approval & Live Alerts */}
        <div className="lg:col-span-5 space-y-6">
          {/* Site Surveys Needing Approval */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-[#E8E0D6]">
              <div>
                <CardTitle className="text-base font-bold text-[#172747]">
                  Engineering Approvals
                </CardTitle>
                <p className="text-xs text-[#827B73]">
                  Mandatory feasibility sign-off before quotation release
                </p>
              </div>
              <Link to="/app/surveys">
                <Button variant="ghost" size="sm" className="text-xs">
                  Review All
                </Button>
              </Link>
            </CardHeader>

            <CardContent className="p-4 space-y-3">
              {surveys.map((srv) => (
                <div
                  key={srv.id}
                  className="p-3.5 rounded-xl border border-[#E8E0D6] bg-white space-y-2 hover:border-[#172747] transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#172747]">
                      {srv.surveyNo}
                    </span>
                    <StatusChip status={srv.status} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-[#292522]">{srv.customerName}</p>
                    <p className="text-xs text-[#827B73] truncate">{srv.siteAddress}</p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#F7F3EC] text-xs">
                    <span className="text-[#827B73]">
                      Shadow-Free: <strong className="text-[#292522]">{srv.shadowFreeAreaSqFt} sq ft</strong>
                    </span>
                    <span className="text-[#827B73]">
                      Tilt: <strong className="text-[#292522]">{srv.roofTiltAngle}°</strong>
                    </span>
                    <Link to="/app/surveys">
                      <Button variant="outline" size="sm" className="h-6 text-[11px]">
                        Inspect
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Active Warranty & Zero-Cost Service Status */}
          <Card className="border-[#E8E0D6]">
            <CardHeader className="pb-3 border-b border-[#E8E0D6]">
              <CardTitle className="text-base font-bold text-[#172747] flex items-center justify-between">
                <span>Active Service Adjudication</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#2D5A43]/10 text-[#2D5A43] font-bold">
                  Zero-Cost Warranty
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {serviceTickets.map((tkt) => (
                <div key={tkt.id} className="p-3 rounded-lg bg-[#F7F3EC] border border-[#E8E0D6] text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-[#172747]">{tkt.ticketNo}</span>
                    <StatusChip status={tkt.status} />
                  </div>
                  <p className="font-semibold text-[#292522]">{tkt.customerName} ({tkt.productName})</p>
                  <p className="text-[#9E3A3A] font-medium font-mono text-[11px]">{tkt.faultCode}</p>
                  <div className="flex items-center justify-between pt-1 border-t border-[#E8E0D6]">
                    <span className="text-[#2D5A43] font-bold">Covered: ₹0 Customer Charge</span>
                    <Link to="/app/service">
                      <Button variant="outline" size="sm" className="h-6 text-[11px]">
                        Adjudicate
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Global Barcode Scanner */}
      <SerialScannerModal
        isOpen={scannerOpen}
        onClose={() => setScannerOpen(false)}
        onScanSuccess={(serial) => {
          alert(`Asset serial scanned: ${serial}\nStatus: Verified in Inventory Ledger.`)
        }}
      />
    </div>
  )
}
