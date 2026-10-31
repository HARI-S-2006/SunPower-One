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
  ArrowUpRight
} from 'lucide-react'

export function ProfitabilityPage() {
  const { orders } = useSolarStore()
  const [searchTerm, setSearchTerm] = useState('')

  // Compute project margins
  const projectProfits = orders.map((order) => {
    const revenue = order.totalAmount
    // Estimated BOM: 60% of price
    const materials = Math.round(revenue * 0.58)
    // Labour: 12%
    const labour = Math.round(revenue * 0.11)
    // Logistics & Crane: 4%
    const freight = Math.round(revenue * 0.04)
    const totalCost = materials + labour + freight
    const grossMargin = revenue - totalCost
    const marginPercent = Math.round((grossMargin / revenue) * 100)

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
      totalCost,
      grossMargin,
      marginPercent,
      status: order.status,
    }
  })

  const totalRevenue = projectProfits.reduce((acc, p) => acc + p.revenue, 0)
  const totalCost = projectProfits.reduce((acc, p) => acc + p.totalCost, 0)
  const totalGrossMargin = totalRevenue - totalCost
  const fleetAverageMargin = Math.round((totalGrossMargin / (totalRevenue || 1)) * 100)

  const filteredProjects = projectProfits.filter(
    (p) =>
      p.orderNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-[#E8E0D6]">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#172747]/5 px-2.5 py-0.5 text-xs font-semibold text-[#172747] uppercase tracking-wider">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Executive Margin Audit
              </span>
              <span className="text-xs text-[#6E7787]">Direct Profitability per Project</span>
            </div>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#172747] font-['Plus_Jakarta_Sans']">
              Project Unit Economics & Profitability
            </h1>
            <p className="text-sm text-[#6E7787]">
              Real-time gross margin breakdown: Contract Revenue − (Tier-1 BOM Materials + Certified Crew Labour + Specialized Transport).
            </p>
          </div>

          <button
            onClick={() => {
              const csv = 'OrderNo,Customer,Capacity,Revenue,Materials,Labour,Freight,GrossMargin,MarginPercent\n' + projectProfits.map(p => `${p.orderNo},"${p.customerName}",${p.capacityKw},${p.revenue},${p.materials},${p.labour},${p.freight},${p.grossMargin},${p.marginPercent}%`).join('\n')
              const blob = new Blob([csv], { type: 'text/csv' })
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = 'Project_Profitability.csv'
              a.click()
            }}
            className="flex items-center gap-2 rounded-xl border border-[#E8E0D6] bg-white px-4 py-2.5 text-xs font-bold text-[#172747] hover:bg-[#F7F3EC] shadow-sm transition-all"
          >
            <Download className="h-4 w-4 text-[#493027]" />
            Export Margins CSV
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <MetricCard
          title="Total Contract Revenue"
          value={`₹${totalRevenue.toLocaleString('en-IN')}`}
          subtitle="Signed customer contracts"
          icon={DollarSign}
        />
        <MetricCard
          title="Total Project Cost (COGS)"
          value={`₹${totalCost.toLocaleString('en-IN')}`}
          subtitle="Hardware + Labour + Freight"
          icon={Layers}
        />
        <MetricCard
          title="Net Gross Margin"
          value={`₹${totalGrossMargin.toLocaleString('en-IN')}`}
          subtitle="Aggregate cash contribution"
          trend="up"
          trendValue={`+${fleetAverageMargin}% target exceeded`}
          icon={TrendingUp}
        />
        <MetricCard
          title="Fleet Blended Margin"
          value={`${fleetAverageMargin}%`}
          subtitle="Benchmark: > 25%"
          trend="up"
          trendValue="Healthy margin profile"
          icon={PieChart}
        />
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl bg-white p-4 shadow-sm border border-[#E8E0D6]">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6E7787]" />
          <input
            type="text"
            placeholder="Search order #, customer name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-[#E8E0D6] pl-9 pr-4 py-2 text-xs focus:border-[#172747] focus:outline-none"
          />
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
              <th className="py-3 px-4">BOM Materials</th>
              <th className="py-3 px-4">Field Labour</th>
              <th className="py-3 px-4">Transport</th>
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
                <td className="py-3.5 px-4 text-[#6E7787] tabular-nums">
                  ₹{p.materials.toLocaleString('en-IN')}
                </td>
                <td className="py-3.5 px-4 text-[#6E7787] tabular-nums">
                  ₹{p.labour.toLocaleString('en-IN')}
                </td>
                <td className="py-3.5 px-4 text-[#6E7787] tabular-nums">
                  ₹{p.freight.toLocaleString('en-IN')}
                </td>
                <td className="py-3.5 px-4 font-bold text-emerald-700 tabular-nums">
                  ₹{p.grossMargin.toLocaleString('en-IN')}
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
