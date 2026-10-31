import { useState } from 'react'
import { useSolarStore, type TechnicianPaymentRecord } from '@/lib/store/solarStore'
import { MetricCard } from '@/components/ui/MetricCard'
import { StatusChip } from '@/components/ui/StatusChip'
import { DataTable } from '@/components/ui/DataTable'
import {
  Download,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  HardHat,
  Check
} from 'lucide-react'

export function TechnicianPaymentsPage() {
  const { techPayments } = useSolarStore()
  const [payments, setPayments] = useState<TechnicianPaymentRecord[]>(techPayments)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const totalPayable = payments.reduce((acc, p) => acc + p.remainingPayable, 0)
  const totalSettled = payments.filter(p => p.status === 'settled').reduce((acc, p) => acc + (p.agreedLabour + p.additionalApprovedLabour), 0)
  const pendingJobsCount = payments.filter(p => p.status !== 'settled').length

  const handleSettlePayment = (id: string) => {
    setPayments(prev =>
      prev.map(p =>
        p.id === id
          ? {
              ...p,
              status: 'settled',
              remainingPayable: 0,
              settlementDate: new Date().toISOString().split('T')[0],
            }
          : p
      )
    )
  }

  const filteredPayments = payments.filter(p => {
    const matchesSearch =
      p.settlementNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.technicianName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.jobNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.customerName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-[#E8E0D6]">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#172747]/5 px-2.5 py-0.5 text-xs font-semibold text-[#172747] uppercase tracking-wider">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Crew Settlement Ledger
              </span>
              <span className="text-xs text-[#6E7787]">Direct Field Crew Disbursals</span>
            </div>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#172747] font-['Plus_Jakarta_Sans']">
              Technician Labour & Commissioning Settlements
            </h1>
            <p className="text-sm text-[#6E7787]">
              Track base installation rates, approved rooftop elevation premiums, advance payments, and final balance releases.
            </p>
          </div>

          <button
            onClick={() => {
              const csv = 'SettlementNo,Technician,JobNo,Customer,Agreed,Extra,Advance,Remaining,Status\n' + payments.map(p => `${p.settlementNo},"${p.technicianName}",${p.jobNo},"${p.customerName}",${p.agreedLabour},${p.additionalApprovedLabour},${p.advancePaid},${p.remainingPayable},${p.status}`).join('\n')
              const blob = new Blob([csv], { type: 'text/csv' })
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = 'Technician_Settlements.csv'
              a.click()
            }}
            className="flex items-center gap-2 rounded-xl border border-[#E8E0D6] bg-white px-4 py-2.5 text-xs font-bold text-[#172747] hover:bg-[#F7F3EC] shadow-sm transition-all"
          >
            <Download className="h-4 w-4 text-[#493027]" />
            Export Settlements CSV
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          title="Total Disbursed to Crew"
          value={`₹${totalSettled.toLocaleString('en-IN')}`}
          subtitle="All completed jobs settled"
          trend="up"
          trendValue="100% on-time payout"
          icon={CheckCircle2}
        />
        <MetricCard
          title="Pending Payable Balances"
          value={`₹${totalPayable.toLocaleString('en-IN')}`}
          subtitle="Upon commissioning sign-off"
          icon={Clock}
        />
        <MetricCard
          title="Active Installation Jobs"
          value={pendingJobsCount.toString()}
          subtitle="In-flight and awaiting customer sign"
          icon={HardHat}
        />
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl bg-white p-4 shadow-sm border border-[#E8E0D6]">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6E7787]" />
          <input
            type="text"
            placeholder="Search settlement #, technician, job, customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-[#E8E0D6] pl-9 pr-4 py-2 text-xs focus:border-[#172747] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-[#6E7787] flex items-center gap-1 font-medium">
            <Filter className="h-3.5 w-3.5" /> Status:
          </span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-[#E8E0D6] bg-white px-3 py-2 text-xs font-semibold text-[#172747] focus:border-[#172747] focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="settled">Settled</option>
            <option value="payable">Payable</option>
            <option value="pending_commissioning">Pending Commissioning</option>
          </select>
        </div>
      </div>

      {/* Settlements Table */}
      <DataTable title={`Technician Settlements Ledger (${filteredPayments.length})`}>
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-[#E8E0D6] bg-[#F7F3EC] text-[#493027] font-bold uppercase tracking-wider">
              <th className="py-3 px-4">Settlement #</th>
              <th className="py-3 px-4">Technician Name</th>
              <th className="py-3 px-4">Job & Customer</th>
              <th className="py-3 px-4">Agreed Labour</th>
              <th className="py-3 px-4">Approved Extras</th>
              <th className="py-3 px-4">Advance Paid</th>
              <th className="py-3 px-4">Balance Payable</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8E0D6]">
            {filteredPayments.map((p) => (
              <tr key={p.id} className="hover:bg-[#F7F3EC]/50 transition-colors">
                <td className="py-3.5 px-4 font-mono font-bold text-[#172747]">{p.settlementNo}</td>
                <td className="py-3.5 px-4 font-semibold text-[#172747]">{p.technicianName}</td>
                <td className="py-3.5 px-4">
                  <span className="block font-mono text-[11px] text-[#6E7787]">{p.jobNo}</span>
                  <span className="font-semibold text-[#172747]">{p.customerName}</span>
                </td>
                <td className="py-3.5 px-4 font-bold text-[#172747] tabular-nums">
                  ₹{p.agreedLabour.toLocaleString('en-IN')}
                </td>
                <td className="py-3.5 px-4 text-[#6E7787] tabular-nums">
                  {p.additionalApprovedLabour > 0 ? `+₹${p.additionalApprovedLabour.toLocaleString('en-IN')}` : '₹0'}
                </td>
                <td className="py-3.5 px-4 text-[#6E7787] tabular-nums">
                  ₹{p.advancePaid.toLocaleString('en-IN')}
                </td>
                <td className="py-3.5 px-4 font-bold text-[#493027] tabular-nums">
                  ₹{p.remainingPayable.toLocaleString('en-IN')}
                </td>
                <td className="py-3.5 px-4">
                  <StatusChip
                    status={
                      p.status === 'settled'
                        ? 'completed'
                        : p.status === 'payable'
                        ? 'in-progress'
                        : 'pending'
                    }
                    label={p.status.replace('_', ' ')}
                  />
                </td>
                <td className="py-3.5 px-4 text-right">
                  {p.status !== 'settled' ? (
                    <button
                      onClick={() => handleSettlePayment(p.id)}
                      className="rounded-lg bg-[#172747] px-3 py-1.5 text-[11px] font-bold text-white hover:bg-[#011232] transition-colors"
                    >
                      Release Payment
                    </button>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-[11px]">
                      <Check className="h-3.5 w-3.5" />
                      Paid {p.settlementDate}
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
