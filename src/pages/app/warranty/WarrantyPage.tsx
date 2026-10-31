import { useState } from 'react'
import { useSolarStore, type WarrantyRecord } from '@/lib/store/solarStore'
import { MetricCard } from '@/components/ui/MetricCard'
import { StatusChip } from '@/components/ui/StatusChip'
import { DataTable } from '@/components/ui/DataTable'
import {
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Download,
  Eye,
  X
} from 'lucide-react'

export function WarrantyPage() {
  const { warranties } = useSolarStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'claim_in_progress' | 'expired'>('all')
  const [selectedWarranty, setSelectedWarranty] = useState<WarrantyRecord | null>(null)

  const activeCount = warranties.filter(w => w.status === 'active').length
  const claimsCount = warranties.filter(w => w.status === 'claim_in_progress').length
  const panelCount = warranties.filter(w => w.category === 'panel').length
  const inverterCount = warranties.filter(w => w.category === 'inverter' || w.category === 'battery').length

  const filteredWarranties = warranties.filter(w => {
    const matchesSearch =
      w.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.certificateNo.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || w.status === statusFilter
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
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Asset Protection Engine
              </span>
              <span className="text-xs text-[#6E7787]">OEM Auto-Registration Active</span>
            </div>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#172747] font-['Plus_Jakarta_Sans']">
              Warranty Management & Digital Certificates
            </h1>
            <p className="text-sm text-[#6E7787]">
              Continuous lifecycle coverage: 20-Year Tier-1 PV performance & 2-Year Inverter / BESS replacement guarantee.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const csv = 'Certificate,Serial,Product,Customer,Expiry\n' + warranties.map(w => `${w.certificateNo},${w.serialNumber},"${w.productName}","${w.customerName}",${w.expiryDate}`).join('\n')
                const blob = new Blob([csv], { type: 'text/csv' })
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = 'Warranty_Registry.csv'
                a.click()
              }}
              className="flex items-center gap-2 rounded-xl border border-[#E8E0D6] bg-white px-4 py-2.5 text-xs font-bold text-[#172747] hover:bg-[#F7F3EC] shadow-sm transition-all"
            >
              <Download className="h-4 w-4 text-[#493027]" />
              Export Registry CSV
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Active Coverage Certificates"
          value={activeCount.toString()}
          subtitle="98.8% registered fleetwide"
          trend="up"
          trendValue="+14% MoM"
          icon={ShieldCheck}
        />
        <MetricCard
          title="Active RMA Claims"
          value={claimsCount.toString()}
          subtitle="Triage & replacement dispatch"
          trend="neutral"
          trendValue="Zero SLA breaches"
          icon={AlertTriangle}
        />
        <MetricCard
          title="20-Year PV Modules"
          value={panelCount.toString()}
          subtitle="Linear degradation guarantee"
          icon={CheckCircle2}
        />
        <MetricCard
          title="2-Year Inverter / BESS Assets"
          value={inverterCount.toString()}
          subtitle="Full replacement terms"
          icon={Clock}
        />
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl bg-white p-4 shadow-sm border border-[#E8E0D6]">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6E7787]" />
          <input
            type="text"
            placeholder="Search certificate, serial number, customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-[#E8E0D6] pl-9 pr-4 py-2 text-xs focus:border-[#172747] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-[#6E7787] flex items-center gap-1 font-medium">
            <Filter className="h-3.5 w-3.5" /> Filter:
          </span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="rounded-xl border border-[#E8E0D6] bg-white px-3 py-2 text-xs font-semibold text-[#172747] focus:border-[#172747] focus:outline-none"
          >
            <option value="all">All Statuses ({warranties.length})</option>
            <option value="active">Active Only</option>
            <option value="claim_in_progress">RMA Claim In Progress</option>
            <option value="expired">Expired</option>
          </select>
        </div>
      </div>

      {/* Warranties Table */}
      <DataTable
        title={`Registered Warranty Certificates (${filteredWarranties.length})`}
        actions={
          <span className="text-xs text-[#6E7787]">
            Showing {filteredWarranties.length} active digital bonds
          </span>
        }
      >
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-[#E8E0D6] bg-[#F7F3EC] text-[#493027] font-bold uppercase tracking-wider">
              <th className="py-3 px-4">Certificate #</th>
              <th className="py-3 px-4">Serial Number</th>
              <th className="py-3 px-4">Product Name</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Tenure</th>
              <th className="py-3 px-4">Expiry Date</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Certificate</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8E0D6]">
            {filteredWarranties.map((w) => (
              <tr key={w.id} className="hover:bg-[#F7F3EC]/50 transition-colors">
                <td className="py-3.5 px-4 font-mono font-bold text-[#172747]">{w.certificateNo}</td>
                <td className="py-3.5 px-4 font-mono font-semibold text-[#493027]">{w.serialNumber}</td>
                <td className="py-3.5 px-4">
                  <span className="block font-semibold text-[#172747]">{w.productName}</span>
                  <span className="text-[11px] text-[#6E7787] uppercase tracking-wide">{w.category}</span>
                </td>
                <td className="py-3.5 px-4">
                  <span className="block font-semibold text-[#172747]">{w.customerName}</span>
                  <span className="text-[11px] text-[#6E7787] font-mono">{w.customerPhone}</span>
                </td>
                <td className="py-3.5 px-4 font-bold text-[#172747] tabular-nums">
                  {w.durationYears} Years
                </td>
                <td className="py-3.5 px-4 text-[#6E7787] font-mono">{w.expiryDate}</td>
                <td className="py-3.5 px-4">
                  <StatusChip
                    status={
                      w.status === 'active'
                        ? 'completed'
                        : w.status === 'claim_in_progress'
                        ? 'in-progress'
                        : 'cancelled'
                    }
                    label={w.status.replace('_', ' ')}
                  />
                </td>
                <td className="py-3.5 px-4 text-right">
                  <button
                    onClick={() => setSelectedWarranty(w)}
                    className="inline-flex items-center gap-1 rounded-lg border border-[#E8E0D6] bg-white px-2.5 py-1 text-[11px] font-bold text-[#172747] hover:bg-[#F7F3EC]"
                  >
                    <Eye className="h-3 w-3 text-[#493027]" />
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </DataTable>

      {/* Certificate Modal */}
      {selectedWarranty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl border border-[#E8E0D6] space-y-4">
            <div className="flex items-center justify-between border-b border-[#E8E0D6] pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
                <span className="font-bold text-[#172747] font-['Plus_Jakarta_Sans']">Digital Warranty Certificate</span>
              </div>
              <button
                onClick={() => setSelectedWarranty(null)}
                className="rounded-lg p-1 text-[#6E7787] hover:bg-[#F7F3EC] hover:text-[#172747]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Official Certificate Paper Simulation */}
            <div className="rounded-2xl border-2 border-[#172747] bg-[#FFF8F5] p-5 space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-[#E8E0D6] pb-2">
                <span className="font-mono text-xs font-bold text-[#172747]">{selectedWarranty.certificateNo}</span>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 uppercase tracking-wide">
                  Official Warranty Bond
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-[#172747]">{selectedWarranty.productName}</h3>
                <p className="font-mono text-xs text-[#493027] mt-0.5">Serial: <strong>{selectedWarranty.serialNumber}</strong></p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-[#E8E0D6]">
                <div>
                  <span className="text-[11px] text-[#6E7787] block">Registered Owner</span>
                  <strong className="text-[#172747]">{selectedWarranty.customerName}</strong>
                </div>
                <div>
                  <span className="text-[11px] text-[#6E7787] block">Effective Coverage</span>
                  <strong className="text-[#172747]">{selectedWarranty.durationYears} Years ({selectedWarranty.startDate} to {selectedWarranty.expiryDate})</strong>
                </div>
              </div>

              <div className="rounded-xl bg-white p-3 text-xs border border-[#E8E0D6]">
                <span className="text-[11px] text-[#6E7787] font-bold uppercase tracking-wider block">Scope of Coverage</span>
                <p className="mt-1 text-[#172747] leading-relaxed">{selectedWarranty.coverageScope}</p>
              </div>
            </div>

            <button
              onClick={() => setSelectedWarranty(null)}
              className="w-full rounded-xl bg-[#172747] py-3 text-xs font-bold text-white hover:bg-[#011232]"
            >
              Close Certificate
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
