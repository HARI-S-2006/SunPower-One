import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  useSolarStore,
  type ServiceTicket,
  type ServiceTicketStatus,
  type PreventiveMaintenanceTask,
} from '@/lib/store/solarStore'
import { MetricCard } from '@/components/ui/MetricCard'
import { StatusChip } from '@/components/ui/StatusChip'
import { DataTable } from '@/components/ui/DataTable'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  LifeBuoy,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Wrench,
  X,
  UserCheck,
  QrCode,
  ArrowRight,
  Calendar,
  AlertCircle,
  FileText,
  RotateCcw,
  Check,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const STATUS_PROGRESSION: ServiceTicketStatus[] = [
  'new',
  'under_review',
  'warranty_verification',
  'approved_for_service',
  'awaiting_assignment',
  'scheduled',
  'in_progress',
  'awaiting_customer_confirmation',
  'resolved',
  'closed',
]

const STATUS_LABELS: Record<ServiceTicketStatus, string> = {
  new: '1. New Request',
  under_review: '2. Under Review',
  warranty_verification: '3. Warranty Verification',
  approved_for_service: '4. Service Approved',
  awaiting_assignment: '5. Awaiting Assignment',
  scheduled: '6. Field Scheduled',
  in_progress: '7. In Progress',
  awaiting_customer_confirmation: '8. Awaiting Confirmation',
  resolved: '9. Resolved',
  closed: '10. Closed & Signed',
  rejected: 'Rejected',
  open: 'Open',
  diagnosing: 'Diagnosing',
}

export function ServiceDeskPage() {
  const {
    serviceTickets,
    passports,
    preventiveTasks,
    logServiceTicket,
    advanceServiceTicketStatus,
    resolveServiceTicket,
    completePreventiveTask,
  } = useSolarStore()

  const [activeTab, setActiveTab] = useState<'corrective' | 'preventive'>('corrective')
  const [searchTerm, setSearchTerm] = useState('')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  // Modals
  const [isLogModalOpen, setIsLogModalOpen] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState<ServiceTicket | null>(null)
  const [resolvingTicket, setResolvingTicket] = useState<ServiceTicket | null>(null)
  const [activePmTask, setActivePmTask] = useState<PreventiveMaintenanceTask | null>(null)

  // Log Form State
  const [formData, setFormData] = useState({
    customerName: 'Siddharth Varma',
    customerPhone: '+91 98860 33412',
    siteAddress: '77, 8th Main, Koramangala 4th Block, Bengaluru',
    serialNumber: 'INV-4000-9102',
    faultCode: 'ERR-F04',
    description: 'Inverter displaying DC Bus over-voltage alarm and tripping string circuit during peak solar irradiance.',
    priority: 'high' as ServiceTicket['priority'],
  })

  // Resolution Form State
  const [repairNotes, setRepairNotes] = useState('Firmware updated to v3.12, DC SPD re-seated, and string voltage normalized.')
  const [customerConfirmed, setCustomerConfirmed] = useState(false)
  const [resolutionError, setResolutionError] = useState<string | null>(null)

  // PM Completion State
  const [pmRemarks, setPmRemarks] = useState('Cleaned 12 PV modules, torqued rooftop racking bolts to 18Nm, verified inverter heatsink airflow.')

  // Counts
  const openTicketsCount = serviceTickets.filter((t) => t.status !== 'closed' && t.status !== 'resolved').length
  const coveredTicketsCount = serviceTickets.filter((t) => t.warrantyStatus === 'covered_zero_cost').length
  const upcomingPmCount = preventiveTasks.filter((t) => t.status === 'upcoming').length
  const criticalCount = serviceTickets.filter((t) => t.priority === 'critical' || t.priority === 'high').length

  const filteredTickets = serviceTickets.filter((t) => {
    const matchesSearch =
      t.ticketNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.faultCode.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter
    return matchesSearch && matchesPriority && matchesStatus
  })

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault()
    logServiceTicket(formData)
    setIsLogModalOpen(false)
  }

  const handleAdvanceStatus = (ticket: ServiceTicket, nextStatus: ServiceTicketStatus) => {
    const res = advanceServiceTicketStatus(ticket.ticketNo, nextStatus)
    if (!res.success) {
      alert(res.error || 'Cannot transition status.')
      return
    }
    // Update local modal if open
    if (selectedTicket?.ticketNo === ticket.ticketNo) {
      setSelectedTicket((prev) => (prev ? { ...prev, status: nextStatus } : null))
    }
  }

  const handleConfirmResolution = () => {
    if (!resolvingTicket) return
    if (!customerConfirmed) {
      setResolutionError('Mandatory: Customer confirmation must be explicitly recorded before resolving ticket.')
      return
    }
    resolveServiceTicket(resolvingTicket.ticketNo, repairNotes, true)
    setResolvingTicket(null)
    setResolutionError(null)
    setCustomerConfirmed(false)
  }

  const handleCompletePm = (e: React.FormEvent) => {
    e.preventDefault()
    if (!activePmTask) return
    completePreventiveTask(activePmTask.id, pmRemarks)
    alert(`Preventive Maintenance Task ${activePmTask.taskNo} recorded as Completed!`)
    setActivePmTask(null)
  }

  // Lookup matched passport
  const getMatchedPassport = (serial: string) => {
    return passports.find((p) => p.serialNumber.toLowerCase() === serial.toLowerCase())
  }

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Top Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-[#E8E0D6]">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-900 uppercase tracking-wider">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-600 animate-ping" />
                RAPID SERVICE DISPATCH SLA
              </span>
              <span className="text-xs text-[#827B73]">Automated Digital Passport & Warranty Adjudication</span>
            </div>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#172747] font-headline">
              Service Desk & After-Sales Complaints
            </h1>
            <p className="text-xs sm:text-sm text-[#827B73] mt-0.5">
              10-status RMA state machine, hardware passport verification, zero-cost claims, and scheduled fleet maintenance.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/app/inventory/passport">
              <Button variant="outline" className="border-[#172747] text-[#172747] hover:bg-[#172747]/5 text-xs font-semibold">
                <QrCode className="h-4 w-4 mr-1.5 text-[#B68B55]" />
                Digital Passports
              </Button>
            </Link>
            <Button
              onClick={() => setIsLogModalOpen(true)}
              className="bg-[#172747] hover:bg-[#1E345E] text-white text-xs font-semibold shadow-warm-sm"
            >
              <Plus className="h-4 w-4 mr-1 text-[#FFDDB7]" />
              Log Service Request
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Active Open Tickets"
          value={openTicketsCount.toString()}
          subtitle="In triage or field resolution"
          trend="down"
          trendValue="-20% MTTR"
          icon={LifeBuoy}
        />
        <MetricCard
          title="Zero-Cost Warranty Claims"
          value={coveredTicketsCount.toString()}
          subtitle="₹0 Customer liability applied"
          trend="up"
          trendValue="100% SLA compliance"
          icon={ShieldCheck}
        />
        <MetricCard
          title="Preventive Inspections"
          value={upcomingPmCount.toString()}
          subtitle="Scheduled fleet health checks"
          icon={Calendar}
        />
        <MetricCard
          title="Mean Time To Resolution"
          value="4.2 Hrs"
          subtitle="Target < 24 hrs"
          icon={Clock}
        />
      </div>

      {/* Main Mode Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E8E0D6] pb-2">
        <button
          onClick={() => setActiveTab('corrective')}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all',
            activeTab === 'corrective'
              ? 'bg-[#172747] text-white shadow-xs'
              : 'bg-white text-[#827B73] hover:bg-[#F7F3EC] border border-[#E8E0D6]'
          )}
        >
          <LifeBuoy className="h-4 w-4" />
          Corrective RMA Complaints Desk ({serviceTickets.length})
        </button>

        <button
          onClick={() => setActiveTab('preventive')}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all',
            activeTab === 'preventive'
              ? 'bg-[#172747] text-white shadow-xs'
              : 'bg-white text-[#827B73] hover:bg-[#F7F3EC] border border-[#E8E0D6]'
          )}
        >
          <Wrench className="h-4 w-4" />
          Scheduled Preventive Maintenance (PM) ({preventiveTasks.length})
        </button>
      </div>

      {/* Tab 1: Corrective Service Tickets */}
      {activeTab === 'corrective' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl bg-white p-4 shadow-sm border border-[#E8E0D6]">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#827B73]" />
              <input
                type="text"
                placeholder="Search ticket #, customer, serial, fault code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-[#E8E0D6] pl-9 pr-4 py-2 text-xs focus:border-[#172747] focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-xl border border-[#E8E0D6] bg-white px-3 py-2 text-xs font-semibold text-[#172747] focus:border-[#172747]"
              >
                <option value="all">All 10 Lifecycle Stages</option>
                <option value="new">1. New Request</option>
                <option value="under_review">2. Under Review</option>
                <option value="warranty_verification">3. Warranty Verification</option>
                <option value="approved_for_service">4. Service Approved</option>
                <option value="awaiting_assignment">5. Awaiting Assignment</option>
                <option value="scheduled">6. Field Scheduled</option>
                <option value="in_progress">7. In Progress</option>
                <option value="awaiting_customer_confirmation">8. Awaiting Confirmation</option>
                <option value="resolved">9. Resolved</option>
                <option value="closed">10. Closed & Signed</option>
              </select>

              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="rounded-xl border border-[#E8E0D6] bg-white px-3 py-2 text-xs font-semibold text-[#172747] focus:border-[#172747]"
              >
                <option value="all">All Priorities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          {/* Tickets Queue Table */}
          <DataTable
            title={`Field Service Queue (${filteredTickets.length})`}
            actions={
              <span className="text-xs text-[#827B73]">
                Click row to inspect Digital Passport & advance state machine
              </span>
            }
          >
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-[#E8E0D6] bg-[#F7F3EC] text-[#493027] font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Ticket #</th>
                  <th className="py-3 px-4">Customer & Site</th>
                  <th className="py-3 px-4">Fault Code</th>
                  <th className="py-3 px-4">Serial / Passport</th>
                  <th className="py-3 px-4">Warranty Adjudication</th>
                  <th className="py-3 px-4">Stage</th>
                  <th className="py-3 px-4">Customer Confirmed</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E0D6]">
                {filteredTickets.map((t) => {
                  const p = getMatchedPassport(t.serialNumber)
                  const isClosed = t.status === 'closed' || t.status === 'resolved'

                  return (
                    <tr
                      key={t.id}
                      onClick={() => setSelectedTicket(t)}
                      className="hover:bg-[#F7F3EC]/50 transition-colors cursor-pointer"
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-[#172747]">{t.ticketNo}</td>
                      <td className="py-3.5 px-4">
                        <span className="block font-semibold text-[#172747]">{t.customerName}</span>
                        <span className="text-[11px] text-[#827B73] truncate max-w-[200px] block">{t.siteAddress}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 font-mono font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded text-[11px]">
                          {t.faultCode}
                        </span>
                        <p className="text-[11px] text-[#827B73] mt-1 truncate max-w-[200px]">{t.faultDescription}</p>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-xs">
                        <span className="font-bold text-[#172747] block">{t.serialNumber}</span>
                        {p && (
                          <span className="text-[10px] text-[#B68B55] font-semibold">
                            Passport: {p.id}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        {t.warrantyStatus === 'covered_zero_cost' ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-800">
                            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                            ₹0 Covered RMA
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-bold text-amber-800">
                            Chargeable Out of Warranty
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#172747]/10 text-[#172747]">
                          {STATUS_LABELS[t.status] || t.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        {t.customerConfirmationRecorded ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#2D5A43]">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Sign-Off Yes
                          </span>
                        ) : (
                          <span className="text-[11px] text-[#827B73] italic">Pending</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        {!isClosed ? (
                          <Button
                            size="sm"
                            onClick={() => setResolvingTicket(t)}
                            className="bg-[#172747] text-white hover:bg-[#1E345E] text-xs h-7 px-2.5 font-semibold"
                          >
                            Resolve Ticket
                          </Button>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-[11px]">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Closed
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </DataTable>
        </div>
      )}

      {/* Tab 2: Scheduled Preventive Maintenance (PM) */}
      {activeTab === 'preventive' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-[#F7F3EC] border border-[#E8E0D6] flex items-center justify-between">
            <div>
              <h3 className="font-headline text-sm font-bold text-[#172747]">
                Fleet Health & Preventive Maintenance Routine
              </h3>
              <p className="text-xs text-[#827B73] mt-0.5">
                Bi-annual mechanical bolt torque verification, PV array thermography, and inverter DC capacitor health checks.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {preventiveTasks.map((task) => (
              <div
                key={task.id}
                className="p-5 rounded-2xl bg-white border border-[#E8E0D6] shadow-warm-sm space-y-3.5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#172747] bg-[#F7F3EC] px-2 py-0.5 rounded">
                      {task.taskNo}
                    </span>
                    <span
                      className={cn(
                        'text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full',
                        task.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : task.status === 'overdue'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800'
                      )}
                    >
                      {task.status}
                    </span>
                  </div>

                  <h4 className="font-headline text-sm font-bold text-[#292522] mt-2">
                    {task.serviceType}
                  </h4>
                  <p className="text-xs font-semibold text-[#172747] mt-0.5">{task.customerName}</p>
                  <p className="text-xs text-[#827B73]">{task.siteAddress}</p>

                  <div className="mt-3 pt-2.5 border-t border-[#E8E0D6] text-xs space-y-1">
                    <div className="flex items-center justify-between text-[#827B73]">
                      <span>System:</span>
                      <strong className="text-[#172747]">{task.capacityKw} kW Array</strong>
                    </div>
                    <div className="flex items-center justify-between text-[#827B73]">
                      <span>Lead Tech:</span>
                      <strong className="text-[#172747]">{task.assignedTechnician}</strong>
                    </div>
                    <div className="flex items-center justify-between text-[#827B73]">
                      <span>Scheduled Due:</span>
                      <strong className="text-[#172747] font-mono">{task.nextScheduledDate}</strong>
                    </div>
                  </div>
                </div>

                {task.status !== 'completed' ? (
                  <Button
                    onClick={() => setActivePmTask(task)}
                    className="w-full bg-[#172747] hover:bg-[#1E345E] text-white text-xs font-semibold"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                    Record & Complete PM Inspection
                  </Button>
                ) : (
                  <div className="p-2 rounded-lg bg-[#2D5A43]/10 text-center text-xs font-semibold text-[#2D5A43]">
                    ✓ Inspection Completed: {task.remarks || 'Pass'}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ticket Details & State Machine Drawer/Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#302019]/60 p-4 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl border border-[#E8E0D6] space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E8E0D6] pb-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#172747] text-white">
                  {selectedTicket.ticketNo}
                </span>
                <span className="font-headline text-base font-bold text-[#292522]">
                  {selectedTicket.customerName}
                </span>
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                className="p-1 rounded text-[#827B73] hover:text-[#292522]"
              >
                ✕
              </button>
            </div>

            {/* Matched Digital Passport Card */}
            {(() => {
              const passport = getMatchedPassport(selectedTicket.serialNumber)
              return (
                <div className="p-4 rounded-xl bg-[#F7F3EC] border border-[#E8E0D6] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs uppercase tracking-wider text-[#B68B55] flex items-center gap-1.5">
                      <QrCode className="h-4 w-4" /> Matched Hardware Digital Passport
                    </span>
                    <Link
                      to="/app/inventory/passport"
                      className="text-xs font-semibold text-[#172747] hover:underline"
                    >
                      View in Passport Registry →
                    </Link>
                  </div>
                  {passport ? (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-1">
                      <div>
                        <span className="text-[10px] text-[#827B73] block uppercase">Passport ID</span>
                        <strong className="text-[#172747] font-mono">{passport.id}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#827B73] block uppercase">Serial #</span>
                        <strong className="text-[#172747] font-mono">{passport.serialNumber}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#827B73] block uppercase">Rating</span>
                        <strong className="text-[#B68B55]">{passport.ratedCapacity}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#827B73] block uppercase">Warranty Status</span>
                        <strong className="text-[#2D5A43] uppercase">{passport.warrantyStatus}</strong>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-[#827B73]">
                      No digital passport directly matched for serial {selectedTicket.serialNumber}.
                    </p>
                  )}
                </div>
              )
            })()}

            {/* 10-Status State Machine Progression */}
            <div className="space-y-2">
              <span className="font-headline text-xs font-bold text-[#827B73] uppercase tracking-wider block">
                10-Stage RMA Lifecycle State Machine
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 text-xs">
                {STATUS_PROGRESSION.map((st, idx) => {
                  const currentIdx = STATUS_PROGRESSION.indexOf(selectedTicket.status)
                  const isDone = currentIdx >= idx
                  const isCurrent = selectedTicket.status === st

                  return (
                    <div
                      key={st}
                      className={cn(
                        'p-2 rounded-lg border text-center transition-all',
                        isCurrent
                          ? 'bg-[#172747] text-white border-[#172747] font-bold shadow-xs'
                          : isDone
                          ? 'bg-[#2D5A43]/10 text-[#2D5A43] border-[#2D5A43]/20 font-semibold'
                          : 'bg-white border-[#E8E0D6] text-[#827B73] opacity-60'
                      )}
                    >
                      <span className="block text-[10px]">{idx + 1}</span>
                      <span className="text-[11px] leading-tight block truncate">
                        {st.replace(/_/g, ' ')}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Advance Status Controls */}
            {selectedTicket.status !== 'closed' && selectedTicket.status !== 'resolved' && (
              <div className="p-3.5 rounded-xl border border-[#E8E0D6] bg-white flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-bold text-[#292522]">Current Stage:</span>
                  <span className="ml-1 text-xs font-semibold text-[#172747] uppercase">
                    {selectedTicket.status.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Shortcut to advance to next stage */}
                  {(() => {
                    const curr = STATUS_PROGRESSION.indexOf(selectedTicket.status)
                    const next = STATUS_PROGRESSION[curr + 1]
                    if (next && next !== 'resolved' && next !== 'closed') {
                      return (
                        <Button
                          size="sm"
                          onClick={() => handleAdvanceStatus(selectedTicket, next)}
                          className="bg-[#172747] hover:bg-[#1E345E] text-white text-xs font-semibold flex items-center gap-1"
                        >
                          Advance to {next.replace(/_/g, ' ')} <ArrowRight className="h-3 w-3" />
                        </Button>
                      )
                    }
                    return null
                  })()}

                  <Button
                    size="sm"
                    onClick={() => {
                      setResolvingTicket(selectedTicket)
                      setSelectedTicket(null)
                    }}
                    className="bg-[#2D5A43] hover:bg-[#234735] text-white text-xs font-semibold"
                  >
                    Resolve & Customer Confirmation
                  </Button>
                </div>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedTicket(null)}
                className="text-xs"
              >
                Close Details
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Resolution & Customer Sign-Off Gatekeeper Modal */}
      {resolvingTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#302019]/70 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-[#E8E0D6] space-y-4">
            <div className="flex items-center justify-between border-b border-[#E8E0D6] pb-3">
              <div className="flex items-center gap-2">
                <Wrench className="h-5 w-5 text-[#172747]" />
                <h3 className="font-headline text-base font-bold text-[#292522]">
                  Resolve Complaint & Customer Sign-Off
                </h3>
              </div>
              <button
                onClick={() => {
                  setResolvingTicket(null)
                  setResolutionError(null)
                }}
                className="p-1 rounded text-[#827B73] hover:text-[#292522]"
              >
                ✕
              </button>
            </div>

            {resolutionError && (
              <div className="p-3 rounded-lg bg-[#9E3A3A]/10 border border-[#9E3A3A]/20 text-[#9E3A3A] text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{resolutionError}</span>
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-[#292522] uppercase tracking-wider block mb-1">
                  Field Technician Repair Notes *
                </label>
                <textarea
                  rows={3}
                  value={repairNotes}
                  onChange={(e) => setRepairNotes(e.target.value)}
                  className="w-full rounded-lg border border-[#E8E0D6] p-2.5 text-xs focus:border-[#172747]"
                  placeholder="Describe repair actions, replacement serials, firmware upgrades..."
                />
              </div>

              {/* Strict Customer Confirmation Gate */}
              <div className="p-4 rounded-xl bg-[#F7F3EC] border border-[#E8E0D6] space-y-2">
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={customerConfirmed}
                    onChange={(e) => {
                      setCustomerConfirmed(e.target.checked)
                      if (e.target.checked) setResolutionError(null)
                    }}
                    className="mt-0.5 h-4 w-4 rounded border-[#E8E0D6] text-[#172747] focus:ring-[#172747]"
                  />
                  <div>
                    <span className="font-bold text-[#172747] block text-xs">
                      Mandatory Customer Acceptance Recorded
                    </span>
                    <span className="text-[11px] text-[#827B73]">
                      I verify that the customer has tested and approved the solar generation restoration and confirmed resolution.
                    </span>
                  </div>
                </label>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setResolvingTicket(null)
                  setResolutionError(null)
                }}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleConfirmResolution}
                className="bg-[#2D5A43] hover:bg-[#234735] text-white text-xs font-semibold flex items-center gap-1.5"
              >
                <CheckCircle2 className="h-4 w-4" />
                Confirm & Close Ticket
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Log New Ticket Modal */}
      {isLogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#302019]/70 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-[#E8E0D6] space-y-4">
            <div className="flex items-center justify-between border-b border-[#E8E0D6] pb-3">
              <div className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-[#172747]" />
                <h3 className="font-headline text-base font-bold text-[#292522]">
                  Log New Service Request
                </h3>
              </div>
              <button
                onClick={() => setIsLogModalOpen(false)}
                className="p-1 rounded text-[#827B73] hover:text-[#292522]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-[#292522] uppercase tracking-wider block mb-1">
                  Customer Name *
                </label>
                <Input
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  required
                  className="text-xs border-[#E8E0D6]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#292522] uppercase tracking-wider block mb-1">
                    Customer Phone
                  </label>
                  <Input
                    value={formData.customerPhone}
                    onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                    className="text-xs border-[#E8E0D6]"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#292522] uppercase tracking-wider block mb-1">
                    Hardware Serial # *
                  </label>
                  <Input
                    value={formData.serialNumber}
                    onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                    required
                    className="font-mono text-xs border-[#E8E0D6]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[#292522] uppercase tracking-wider block mb-1">
                  Site Address
                </label>
                <Input
                  value={formData.siteAddress}
                  onChange={(e) => setFormData({ ...formData, siteAddress: e.target.value })}
                  className="text-xs border-[#E8E0D6]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#292522] uppercase tracking-wider block mb-1">
                    Fault Code
                  </label>
                  <Input
                    value={formData.faultCode}
                    onChange={(e) => setFormData({ ...formData, faultCode: e.target.value })}
                    className="font-mono text-xs border-[#E8E0D6]"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#292522] uppercase tracking-wider block mb-1">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                    className="w-full h-10 px-3 rounded-lg border border-[#E8E0D6] bg-white text-xs font-semibold text-[#172747]"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-[#292522] uppercase tracking-wider block mb-1">
                  Fault Description
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-lg border border-[#E8E0D6] p-2.5 text-xs"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsLogModalOpen(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-[#172747] text-white hover:bg-[#1E345E] text-xs font-semibold"
                >
                  Create Service Ticket
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Complete Preventive Maintenance Modal */}
      {activePmTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#302019]/70 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-[#E8E0D6] space-y-4">
            <div className="flex items-center justify-between border-b border-[#E8E0D6] pb-3">
              <div className="flex items-center gap-2">
                <Wrench className="h-5 w-5 text-[#172747]" />
                <h3 className="font-headline text-base font-bold text-[#292522]">
                  Complete PM Task: {activePmTask.taskNo}
                </h3>
              </div>
              <button
                onClick={() => setActivePmTask(null)}
                className="p-1 rounded text-[#827B73] hover:text-[#292522]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCompletePm} className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-[#F7F3EC] border border-[#E8E0D6] space-y-1">
                <span className="font-bold text-[#172747]">{activePmTask.serviceType}</span>
                <p className="text-[#827B73]">
                  Customer: {activePmTask.customerName} ({activePmTask.siteAddress})
                </p>
              </div>

              <div>
                <label className="font-bold text-[#292522] uppercase tracking-wider block mb-1">
                  Technician Service Observations & Checklist *
                </label>
                <textarea
                  rows={3}
                  value={pmRemarks}
                  onChange={(e) => setPmRemarks(e.target.value)}
                  required
                  className="w-full rounded-lg border border-[#E8E0D6] p-2.5 text-xs"
                  placeholder="Record PV cleaning notes, inverter heatsink airflow, torque reading..."
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setActivePmTask(null)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-[#2D5A43] hover:bg-[#234735] text-white text-xs font-semibold"
                >
                  Confirm PM Completion
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
