import { useState } from 'react'
import { useSolarStore, type ServiceTicket } from '@/lib/store/solarStore'
import { MetricCard } from '@/components/ui/MetricCard'
import { StatusChip } from '@/components/ui/StatusChip'
import { DataTable } from '@/components/ui/DataTable'
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
  UserCheck
} from 'lucide-react'

export function ServiceDeskPage() {
  const { serviceTickets, logServiceTicket, resolveServiceTicket } = useSolarStore()

  const [searchTerm, setSearchTerm] = useState('')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  const [isLogModalOpen, setIsLogModalOpen] = useState(false)
  const [resolvingTicket, setResolvingTicket] = useState<ServiceTicket | null>(null)

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

  const openTicketsCount = serviceTickets.filter(t => t.status !== 'closed' && t.status !== 'resolved').length
  const coveredTicketsCount = serviceTickets.filter(t => t.warrantyStatus === 'covered_zero_cost').length
  const criticalCount = serviceTickets.filter(t => t.priority === 'critical' || t.priority === 'high').length

  const filteredTickets = serviceTickets.filter(t => {
    const matchesSearch =
      t.ticketNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.faultCode.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter
    return matchesSearch && matchesPriority
  })

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault()
    logServiceTicket(formData)
    setIsLogModalOpen(false)
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
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-[#E8E0D6]">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-900 uppercase tracking-wider">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-600 animate-ping" />
                RAPID SERVICE DISPATCH SLA
              </span>
              <span className="text-xs text-[#6E7787]">Automated Warranty Adjudication Active</span>
            </div>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#172747] font-['Plus_Jakarta_Sans']">
              Service Desk & After-Sales Complaints
            </h1>
            <p className="text-sm text-[#6E7787]">
              Adjudicate fault codes, dispatch field technicians, and verify covered ₹0 zero-cost repairs.
            </p>
          </div>

          <button
            onClick={() => setIsLogModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-[#172747] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#011232] shadow-md transition-all"
          >
            <Plus className="h-4 w-4 text-[#E9DDCA]" />
            + Log New Service Request
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Active Open Tickets"
          value={openTicketsCount.toString()}
          subtitle="Awaiting resolution or triage"
          trend="down"
          trendValue="-20% avg resolution time"
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
          title="High / Critical Alerts"
          value={criticalCount.toString()}
          subtitle="Same-day dispatch response"
          icon={AlertTriangle}
        />
        <MetricCard
          title="Mean Time To Resolution"
          value="4.2 Hrs"
          subtitle="Target < 24 hrs"
          icon={Clock}
        />
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl bg-white p-4 shadow-sm border border-[#E8E0D6]">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6E7787]" />
          <input
            type="text"
            placeholder="Search ticket #, customer, serial, fault code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-[#E8E0D6] pl-9 pr-4 py-2 text-xs focus:border-[#172747] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-[#6E7787] flex items-center gap-1 font-medium">
            <Filter className="h-3.5 w-3.5" /> Priority:
          </span>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="rounded-xl border border-[#E8E0D6] bg-white px-3 py-2 text-xs font-semibold text-[#172747] focus:border-[#172747] focus:outline-none"
          >
            <option value="all">All Priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Tickets Table */}
      <DataTable
        title={`Field Service Complaints Queue (${filteredTickets.length})`}
        actions={
          <span className="text-xs text-[#6E7787]">
            Adjudicated by serial warranty engine
          </span>
        }
      >
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-[#E8E0D6] bg-[#F7F3EC] text-[#493027] font-bold uppercase tracking-wider">
              <th className="py-3 px-4">Ticket #</th>
              <th className="py-3 px-4">Customer & Site</th>
              <th className="py-3 px-4">Fault Code</th>
              <th className="py-3 px-4">Serial Asset</th>
              <th className="py-3 px-4">Warranty Adjudication</th>
              <th className="py-3 px-4">Assigned Tech</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8E0D6]">
            {filteredTickets.map((t) => (
              <tr key={t.id} className="hover:bg-[#F7F3EC]/50 transition-colors">
                <td className="py-3.5 px-4 font-mono font-bold text-[#172747]">{t.ticketNo}</td>
                <td className="py-3.5 px-4">
                  <span className="block font-semibold text-[#172747]">{t.customerName}</span>
                  <span className="text-[11px] text-[#6E7787] truncate max-w-[200px] block">{t.siteAddress}</span>
                </td>
                <td className="py-3.5 px-4">
                  <span className="inline-flex items-center gap-1 font-mono font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded text-[11px]">
                    {t.faultCode}
                  </span>
                  <p className="text-[11px] text-[#6E7787] mt-1 truncate max-w-[220px]">{t.faultDescription}</p>
                </td>
                <td className="py-3.5 px-4 font-mono text-xs text-[#493027] font-semibold">
                  {t.serialNumber}
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
                <td className="py-3.5 px-4 font-semibold text-[#172747]">{t.assignedTechnician}</td>
                <td className="py-3.5 px-4">
                  <StatusChip
                    status={
                      t.status === 'resolved' || t.status === 'closed'
                        ? 'completed'
                        : t.status === 'diagnosing'
                        ? 'in-progress'
                        : 'pending'
                    }
                    label={t.status}
                  />
                </td>
                <td className="py-3.5 px-4 text-right">
                  {t.status !== 'resolved' && t.status !== 'closed' ? (
                    <button
                      onClick={() => setResolvingTicket(t)}
                      className="rounded-lg bg-[#172747] px-3 py-1.5 text-[11px] font-bold text-white hover:bg-[#011232] transition-colors"
                    >
                      Resolve Ticket
                    </button>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-[11px]">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Closed
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </DataTable>

      {/* Log Ticket Modal */}
      {isLogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl border border-[#E8E0D6] space-y-4">
            <div className="flex items-center justify-between border-b border-[#E8E0D6] pb-3">
              <div className="flex items-center gap-2">
                <Wrench className="h-5 w-5 text-[#493027]" />
                <span className="font-bold text-[#172747] font-['Plus_Jakarta_Sans']">Log New Service Complaint</span>
              </div>
              <button
                onClick={() => setIsLogModalOpen(false)}
                className="rounded-lg p-1 text-[#6E7787] hover:bg-[#F7F3EC] hover:text-[#172747]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#6E7787] font-medium">Customer Name</label>
                <input
                  type="text"
                  required
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-[#E8E0D6] p-2.5 text-xs text-[#172747]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#6E7787] font-medium">Phone</label>
                  <input
                    type="text"
                    required
                    value={formData.customerPhone}
                    onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-[#E8E0D6] p-2.5 text-xs text-[#172747]"
                  />
                </div>
                <div>
                  <label className="block text-[#6E7787] font-medium">Serial Number</label>
                  <input
                    type="text"
                    required
                    value={formData.serialNumber}
                    onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-[#E8E0D6] p-2.5 text-xs font-mono uppercase text-[#172747]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#6E7787] font-medium">Fault Code</label>
                <input
                  type="text"
                  required
                  value={formData.faultCode}
                  onChange={(e) => setFormData({ ...formData, faultCode: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-[#E8E0D6] p-2.5 text-xs font-mono font-bold text-red-700 uppercase"
                />
              </div>

              <div>
                <label className="block text-[#6E7787] font-medium">Fault Description & Symptoms</label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-[#E8E0D6] p-2.5 text-xs text-[#172747]"
                />
              </div>

              <div>
                <label className="block text-[#6E7787] font-medium">Priority SLA</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                  className="mt-1 w-full rounded-xl border border-[#E8E0D6] p-2.5 text-xs text-[#172747]"
                >
                  <option value="low">Low (48h SLA)</option>
                  <option value="medium">Medium (24h SLA)</option>
                  <option value="high">High (12h SLA)</option>
                  <option value="critical">Critical Emergency (4h SLA)</option>
                </select>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsLogModalOpen(false)}
                  className="flex-1 rounded-xl border border-[#E8E0D6] py-2.5 font-bold text-[#6E7787] hover:bg-[#F7F3EC]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-[#172747] py-2.5 font-bold text-white hover:bg-[#011232]"
                >
                  Submit & Adjudicate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Resolution & Customer Confirmation Gatekeeper Modal */}
      {resolvingTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl border border-[#E8E0D6] space-y-4">
            <div className="flex items-center justify-between border-b border-[#E8E0D6] pb-3">
              <div className="flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-emerald-600" />
                <span className="font-bold text-[#172747] font-['Plus_Jakarta_Sans']">Resolve Service Ticket</span>
              </div>
              <button
                onClick={() => setResolvingTicket(null)}
                className="rounded-lg p-1 text-[#6E7787] hover:bg-[#F7F3EC] hover:text-[#172747]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="rounded-2xl bg-[#F7F3EC] p-4 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-[#6E7787]">Ticket:</span>
                <strong className="font-mono text-[#172747]">{resolvingTicket.ticketNo}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6E7787]">Customer:</span>
                <strong className="text-[#172747]">{resolvingTicket.customerName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6E7787]">Warranty Status:</span>
                <strong className="text-emerald-700">
                  {resolvingTicket.warrantyStatus === 'covered_zero_cost' ? '₹0 Covered Warranty' : 'Chargeable'}
                </strong>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[#6E7787] font-medium">Technician Repair Notes</label>
                <textarea
                  rows={3}
                  value={repairNotes}
                  onChange={(e) => setRepairNotes(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[#E8E0D6] p-2.5 text-xs text-[#172747]"
                />
              </div>

              {/* Mandatory Customer Confirmation Checkbox */}
              <div className="rounded-xl border border-emerald-300 bg-emerald-50/50 p-3">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={customerConfirmed}
                    onChange={(e) => {
                      setCustomerConfirmed(e.target.checked)
                      setResolutionError(null)
                    }}
                    className="h-4 w-4 rounded border-[#E8E0D6] text-emerald-600 focus:ring-emerald-600 mt-0.5"
                  />
                  <div className="text-[11px] text-[#172747] leading-relaxed">
                    <strong>Mandatory Customer Acceptance:</strong> Customer has confirmed that inverter/system is now operational, generation verified, and fault cleared.
                  </div>
                </label>
              </div>

              {resolutionError && (
                <div className="rounded-lg bg-red-50 p-2.5 text-xs text-red-700 border border-red-200">
                  {resolutionError}
                </div>
              )}

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setResolvingTicket(null)}
                  className="flex-1 rounded-xl border border-[#E8E0D6] py-2.5 font-bold text-[#6E7787] hover:bg-[#F7F3EC]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmResolution}
                  className="flex-1 rounded-xl bg-emerald-600 py-2.5 font-bold text-white hover:bg-emerald-700"
                >
                  Confirm & Close Ticket
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
