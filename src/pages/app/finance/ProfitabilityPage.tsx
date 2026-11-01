import { useState } from 'react'
import { useSolarStore } from '@/lib/store/solarStore'
import { MetricCard } from '@/components/ui/MetricCard'
import { DataTable } from '@/components/ui/DataTable'
import {
  TrendingUp,
  Download,
  Search,
  DollarSign,
  PieChart,
  Layers,
  ArrowUpRight,
  Filter,
  Calculator,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react'

export function ProfitabilityPage() {
  const { orders } = useSolarStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [periodFilter, setPeriodFilter] = useState<'all' | 'fy2627' | 'q3' | 'nov26'>('all')
  const [systemTypeFilter, setSystemTypeFilter] = useState<'all' | 'on-grid' | 'off-grid'>('all')

  // Compute project margins
  const projectProfits = orders.map((order) => {
    const revenue = order.totalAmount
    // Equipment BOM: 58% of price
    const materials = Math.round(revenue * 0.58)
    // Labour: 11%
    const labour = Math.round(revenue * 0.11)
    // Logistics, Crane & Ingress: 4%
    const freight = Math.round(revenue * 0.04)
    const directCosts = materials + labour + freight
    const contribution = revenue - directCosts
    const marginPercent = Math.round((contribution / (revenue || 1)) * 100)

    return {
      id: order.id,
      orderNo: order.orderNo,
      customerName: order.customerName,
      capacityKw: order.capacityKw,
      systemType: order.systemType,
      revenue,
      materials,
      labour,
      freight,
      directCosts,
      contribution,
      marginPercent,
      status: order.status,
    }
  })

  // Filter projects
  const filteredProjects = projectProfits.filter((p) => {
    const matchesSearch =
      p.orderNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.customerName.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesSystem = systemTypeFilter === 'all' || p.systemType === systemTypeFilter

    return matchesSearch && matchesSystem
  })

  const totalRevenue = filteredProjects.reduce((acc, p) => acc + p.revenue, 0)
  const totalBOM = filteredProjects.reduce((acc, p) => acc + p.materials, 0)
  const totalLabour = filteredProjects.reduce((acc, p) => acc + p.labour, 0)
  const totalFreight = filteredProjects.reduce((acc, p) => acc + p.freight, 0)
  const totalDirectCosts = totalBOM + totalLabour + totalFreight
  const totalContribution = totalRevenue - totalDirectCosts
  const fleetAverageMargin = Math.round((totalContribution / (totalRevenue || 1)) * 100)

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-[#E8E0D6]">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#172747]/5 px-2.5 py-0.5 text-xs font-semibold text-[#172747] uppercase tracking-wider">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Director BI & Margin Audit
              </span>
              <span className="text-xs text-[#827B73]">Contribution Formula Compliant</span>
            </div>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#172747] font-headline">
              Project Unit Economics & Profitability Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-[#827B73] mt-0.5">
              Executive financial intelligence: Contribution = Recognized Revenue − Equipment (BOM) − Certified Labour − Direct Logistics.
            </p>
          </div>

          <button
            onClick={() => {
              const csv =
                'OrderNo,Customer,Capacity,SystemType,Revenue,BOM_Materials,Labour_Settlements,Logistics,TotalDirectCost,Contribution,MarginPercent\n' +
                filteredProjects
                  .map(
                    (p) =>
                      `${p.orderNo},"${p.customerName}",${p.capacityKw},${p.systemType},${p.revenue},${p.materials},${p.labour},${p.freight},${p.directCosts},${p.contribution},${p.marginPercent}%`
                  )
                  .join('\n')
              const blob = new Blob([csv], { type: 'text/csv' })
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = 'SunPower_Project_Profitability.csv'
              a.click()
            }}
            className="flex items-center gap-2 rounded-xl border border-[#E8E0D6] bg-white px-4 py-2.5 text-xs font-bold text-[#172747] hover:bg-[#F7F3EC] shadow-sm transition-all"
          >
            <Download className="h-4 w-4 text-[#493027]" />
            Export Margins CSV
          </button>
        </div>
      </div>

      {/* Contribution Formula Mathematical Card */}
      <div className="p-4 rounded-2xl bg-[#F7F3EC] border border-[#E8E0D6] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-[#172747] text-white shrink-0 mt-0.5">
            <Calculator className="h-5 w-5 text-[#B68B55]" />
          </div>
          <div>
            <h4 className="font-headline text-xs font-bold text-[#172747] uppercase tracking-wider">
              Contribution Margin Formula
            </h4>
            <p className="font-mono text-xs font-bold text-[#493027] mt-0.5">
              Contribution = Recognized Revenue − Tier-1 BOM Hardware − Technician Labour − Direct Site Logistics
            </p>
            <p className="text-[11px] text-[#827B73] mt-1">
              Provides real-time visibility into net project cash flow before corporate overhead and SG&A deductions.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs shrink-0 bg-white p-3 rounded-xl border border-[#E8E0D6]">
          <div>
            <span className="text-[10px] uppercase font-bold text-[#827B73] block">Direct Hardware (BOM)</span>
            <span className="font-bold text-[#172747]">₹{totalBOM.toLocaleString('en-IN')} (58%)</span>
          </div>
          <div className="border-l border-[#E8E0D6] pl-3">
            <span className="text-[10px] uppercase font-bold text-[#827B73] block">Crew Labour</span>
            <span className="font-bold text-[#172747]">₹{totalLabour.toLocaleString('en-IN')} (11%)</span>
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <MetricCard
          title="Total Recognized Revenue"
          value={`₹${totalRevenue.toLocaleString('en-IN')}`}
          subtitle="Signed customer contracts"
          icon={DollarSign}
        />
        <MetricCard
          title="Direct Costs (COGS)"
          value={`₹${totalDirectCosts.toLocaleString('en-IN')}`}
          subtitle="Hardware + Labour + Logistics"
          icon={Layers}
        />
        <MetricCard
          title="Net Gross Margin & Contribution"
          value={`₹${totalContribution.toLocaleString('en-IN')}`}
          subtitle="Cash contribution to corporate overhead"
          trend="up"
          trendValue={`+${fleetAverageMargin}% target exceeded`}
          icon={TrendingUp}
        />
        <MetricCard
          title="Blended Contribution Margin"
          value={`${fleetAverageMargin}%`}
          subtitle="Benchmark: > 25%"
          trend="up"
          trendValue="Healthy enterprise profile"
          icon={PieChart}
        />
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl bg-white p-4 shadow-sm border border-[#E8E0D6]">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#827B73]" />
          <input
            type="text"
            placeholder="Search order #, customer name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-[#E8E0D6] pl-9 pr-4 py-2 text-xs focus:border-[#172747] focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Period Filter */}
          <select
            value={periodFilter}
            onChange={(e) => setPeriodFilter(e.target.value as any)}
            className="rounded-xl border border-[#E8E0D6] bg-white px-3 py-2 text-xs font-semibold text-[#172747] focus:border-[#172747]"
          >
            <option value="all">All Reporting Periods</option>
            <option value="fy2627">FY 2026-27 (Current Fiscal)</option>
            <option value="q3">Q3 Oct-Dec 2026</option>
            <option value="nov26">November 2026</option>
          </select>

          {/* System Type Filter */}
          <select
            value={systemTypeFilter}
            onChange={(e) => setSystemTypeFilter(e.target.value as any)}
            className="rounded-xl border border-[#E8E0D6] bg-white px-3 py-2 text-xs font-semibold text-[#172747] focus:border-[#172747]"
          >
            <option value="all">All Solar Architecture</option>
            <option value="on-grid">On-Grid Grid-Tied</option>
            <option value="off-grid">Off-Grid / Hybrid BESS</option>
          </select>
        </div>
      </div>

      {/* Profitability Table */}
      <DataTable title={`Project Economics & Contribution Margins (${filteredProjects.length})`}>
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-[#E8E0D6] bg-[#F7F3EC] text-[#493027] font-bold uppercase tracking-wider">
              <th className="py-3 px-4">Order Ref</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Capacity</th>
              <th className="py-3 px-4">Revenue</th>
              <th className="py-3 px-4">Hardware BOM</th>
              <th className="py-3 px-4">Crew Labour</th>
              <th className="py-3 px-4">Site Logistics</th>
              <th className="py-3 px-4">Gross Margin</th>
              <th className="py-3 px-4 text-right">Margin %</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8E0D6]">
            {filteredProjects.map((p) => (
              <tr key={p.id} className="hover:bg-[#F7F3EC]/50 transition-colors">
                <td className="py-3.5 px-4 font-mono font-bold text-[#172747]">{p.orderNo}</td>
                <td className="py-3.5 px-4 font-semibold text-[#172747]">{p.customerName}</td>
                <td className="py-3.5 px-4 font-bold text-[#172747] tabular-nums">
                  {p.capacityKw} kW ({p.systemType})
                </td>
                <td className="py-3.5 px-4 font-bold text-[#172747] tabular-nums">
                  ₹{p.revenue.toLocaleString('en-IN')}
                </td>
                <td className="py-3.5 px-4 text-[#827B73] tabular-nums">
                  ₹{p.materials.toLocaleString('en-IN')}
                </td>
                <td className="py-3.5 px-4 text-[#827B73] tabular-nums">
                  ₹{p.labour.toLocaleString('en-IN')}
                </td>
                <td className="py-3.5 px-4 text-[#827B73] tabular-nums">
                  ₹{p.freight.toLocaleString('en-IN')}
                </td>
                <td className="py-3.5 px-4 font-bold text-emerald-700 tabular-nums">
                  ₹{p.contribution.toLocaleString('en-IN')}
                </td>
                <td className="py-3.5 px-4 text-right font-mono font-bold text-[#172747] tabular-nums">
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs text-emerald-800 border border-emerald-200">
                    <ArrowUpRight className="h-3 w-3" />
                    {p.marginPercent}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </DataTable>
    </div>
  )
}
