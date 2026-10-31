import { useState } from 'react'
import { useSolarStore, type SubsidyRecord } from '@/lib/store/solarStore'
import { MetricCard } from '@/components/ui/MetricCard'
import { StatusChip } from '@/components/ui/StatusChip'
import { DataTable } from '@/components/ui/DataTable'
import {
  Download,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Landmark,
  Check
} from 'lucide-react'

export function SubsidiesPage() {
  const { subsidies } = useSolarStore()
  const [subsidyList, setSubsidyList] = useState<SubsidyRecord[]>(subsidies)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const totalApproved = subsidyList.reduce((acc, s) => acc + s.subsidyAmountApproved, 0)
  const totalDisbursed = subsidyList.reduce((acc, s) => acc + s.disbursedAmount, 0)
  const pendingDisbursal = totalApproved - totalDisbursed

  const handleUpdateStatus = (id: string, newStatus: SubsidyRecord['approvalStatus']) => {
    setSubsidyList(prev =>
      prev.map(s => {
        if (s.id === id) {
          const isDisbursed = newStatus === 'disbursed'
          return {
            ...s,
            approvalStatus: newStatus,
            disbursedAmount: isDisbursed ? s.subsidyAmountApproved : s.disbursedAmount,
            disbursementDate: isDisbursed ? new Date().toISOString().split('T')[0] : s.disbursementDate,
          }
        }
        return s
      })
    )
  }

  const filteredSubsidies = subsidyList.filter(s => {
    const matchesSearch =
      s.applicationRefNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.portalReference.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || s.approvalStatus === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-[#E8E0D6]">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
                MNRE NATIONAL PORTAL INTEGRATION
              </span>
              <span className="text-xs text-[#6E7787]">PM Surya Ghar CFA Subsidy Sync</span>
            </div>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#172747] font-['Plus_Jakarta_Sans']">
              PM Surya Ghar Subsidy Tracker
            </h1>
            <p className="text-sm text-[#6E7787]">
              End-to-end documentation tracking for Central Financial Assistance (up to ₹78,000 direct bank transfer to customer).
            </p>
          </div>

          <button
            onClick={() => {
              const csv = 'ApplicationNo,Customer,CapacityKw,Scheme,ApprovedSubsidy,Disbursed,Status\n' + subsidyList.map(s => `${s.applicationRefNo},"${s.customerName}",${s.capacityKw},"${s.schemeName}",${s.subsidyAmountApproved},${s.disbursedAmount},${s.approvalStatus}`).join('\n')
              const blob = new Blob([csv], { type: 'text/csv' })
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = 'PM_Surya_Ghar_Subsidies.csv'
              a.click()
            }}
            className="flex items-center gap-2 rounded-xl border border-[#E8E0D6] bg-white px-4 py-2.5 text-xs font-bold text-[#172747] hover:bg-[#F7F3EC] shadow-sm transition-all"
          >
            <Download className="h-4 w-4 text-[#493027]" />
            Export Subsidy Roster
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          title="Total Sanctioned Subsidy"
          value={`₹${totalApproved.toLocaleString('en-IN')}`}
          subtitle="PM Surya Ghar approved CFA"
          icon={Landmark}
        />
        <MetricCard
          title="Disbursed to Bank Accounts"
          value={`₹${totalDisbursed.toLocaleString('en-IN')}`}
          subtitle="Direct DBT to customers"
          trend="up"
          trendValue="100% DISCOM clearance"
          icon={CheckCircle2}
        />
        <MetricCard
          title="In-Pipeline DISCOM Verifications"
          value={`₹${pendingDisbursal.toLocaleString('en-IN')}`}
          subtitle="Meter testing & approval"
          icon={Clock}
        />
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl bg-white p-4 shadow-sm border border-[#E8E0D6]">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6E7787]" />
          <input
            type="text"
            placeholder="Search application #, customer, portal ref..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-[#E8E0D6] pl-9 pr-4 py-2 text-xs focus:border-[#172747] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-[#6E7787] flex items-center gap-1 font-medium">
            <Filter className="h-3.5 w-3.5" /> Stage:
          </span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-[#E8E0D6] bg-white px-3 py-2 text-xs font-semibold text-[#172747] focus:border-[#172747] focus:outline-none"
          >
            <option value="all">All Stages</option>
            <option value="submitted">Submitted</option>
            <option value="document_verified">Document Verified</option>
            <option value="discom_approved">DISCOM Approved</option>
            <option value="disbursed">Disbursed DBT</option>
          </select>
        </div>
      </div>

      {/* Subsidies Table */}
      <DataTable title={`PM Surya Ghar CFA Applications (${filteredSubsidies.length})`}>
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-[#E8E0D6] bg-[#F7F3EC] text-[#493027] font-bold uppercase tracking-wider">
              <th className="py-3 px-4">Application #</th>
              <th className="py-3 px-4">Customer Name</th>
              <th className="py-3 px-4">Capacity</th>
              <th className="py-3 px-4">Portal Reference</th>
              <th className="py-3 px-4">Sanctioned CFA</th>
              <th className="py-3 px-4">Disbursed</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Workflow Stage</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8E0D6]">
            {filteredSubsidies.map((s) => (
              <tr key={s.id} className="hover:bg-[#F7F3EC]/50 transition-colors">
                <td className="py-3.5 px-4 font-mono font-bold text-[#172747]">{s.applicationRefNo}</td>
                <td className="py-3.5 px-4 font-semibold text-[#172747]">{s.customerName}</td>
                <td className="py-3.5 px-4 font-bold text-[#172747] tabular-nums">{s.capacityKw} kW</td>
                <td className="py-3.5 px-4 font-mono text-[#6E7787]">{s.portalReference}</td>
                <td className="py-3.5 px-4 font-bold text-emerald-700 tabular-nums">
                  ₹{s.subsidyAmountApproved.toLocaleString('en-IN')}
                </td>
                <td className="py-3.5 px-4 font-bold text-[#172747] tabular-nums">
                  ₹{s.disbursedAmount.toLocaleString('en-IN')}
                </td>
                <td className="py-3.5 px-4">
                  <StatusChip
                    status={
                      s.approvalStatus === 'disbursed'
                        ? 'completed'
                        : s.approvalStatus === 'discom_approved' || s.approvalStatus === 'document_verified'
                        ? 'in-progress'
                        : 'pending'
                    }
                    label={s.approvalStatus.replace('_', ' ')}
                  />
                </td>
                <td className="py-3.5 px-4 text-right">
                  {s.approvalStatus !== 'disbursed' ? (
                    <select
                      value={s.approvalStatus}
                      onChange={(e) => handleUpdateStatus(s.id, e.target.value as any)}
                      className="rounded-lg border border-[#E8E0D6] bg-white px-2 py-1 text-[11px] font-semibold text-[#172747]"
                    >
                      <option value="submitted">Submitted</option>
                      <option value="document_verified">Doc Verified</option>
                      <option value="discom_approved">DISCOM Approved</option>
                      <option value="disbursed">Mark Disbursed</option>
                    </select>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-[11px]">
                      <Check className="h-3.5 w-3.5" />
                      Disbursed {s.disbursementDate}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </DataTable>
    </div>
  )
}
