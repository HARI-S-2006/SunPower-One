import { useSolarStore } from '@/lib/store/solarStore'
import { MetricCard } from '@/components/ui/MetricCard'
import { DataTable } from '@/components/ui/DataTable'
import {
  TrendingUp,
  Download,
  MapPin,
  ShieldCheck,
  Zap,
  CheckCircle2
} from 'lucide-react'

export function AnalyticsPage() {
  const { installations, serviceTickets, warranties } = useSolarStore()
  const failureRatePercent = ((serviceTickets.length / (warranties.length || 1)) * 100).toFixed(1)
  const totalCapacityInstalledKw = installations.reduce((sum, i) => sum + i.capacityKw, 0)

  // Regional breakdown mock
  const regions = [
    { name: 'Bengaluru South (Koramangala, Jayanagar)', count: 18, capacity: '64.5 kW', share: '45%' },
    { name: 'Bengaluru East (Whitefield, Indiranagar)', count: 12, capacity: '48.0 kW', share: '30%' },
    { name: 'Bengaluru North (Hebbal, Yelahanka)', count: 7, capacity: '26.0 kW', share: '18%' },
    { name: 'Bengaluru West (Rajajinagar, Malleshwaram)', count: 3, capacity: '11.5 kW', share: '7%' },
  ]

  // Monthly capacity bar data
  const monthlyData = [
    { month: 'Jun 2026', capacity: 28, installs: 8 },
    { month: 'Jul 2026', capacity: 34, installs: 10 },
    { month: 'Aug 2026', capacity: 42, installs: 12 },
    { month: 'Sep 2026', capacity: 38, installs: 11 },
    { month: 'Oct 2026', capacity: 54, installs: 15 },
  ]

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-[#E8E0D6]">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#172747]/5 px-2.5 py-0.5 text-xs font-semibold text-[#172747] uppercase tracking-wider">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Fleet SCADA & Business BI
              </span>
              <span className="text-xs text-[#6E7787]">Real-Time Telemetry Aggregation</span>
            </div>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#172747] font-['Plus_Jakarta_Sans']">
              Operations & Performance Analytics
            </h1>
            <p className="text-sm text-[#6E7787]">
              Real-time monitoring of installed solar capacity, monthly run-rate velocity, regional density, and field failure MTBF.
            </p>
          </div>

          <button
            onClick={() => {
              const csv = 'Region,Installations,Capacity,FleetShare\n' + regions.map(r => `"${r.name}",${r.count},${r.capacity},${r.share}`).join('\n')
              const blob = new Blob([csv], { type: 'text/csv' })
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = 'Analytics_Summary.csv'
              a.click()
            }}
            className="flex items-center gap-2 rounded-xl border border-[#E8E0D6] bg-white px-4 py-2.5 text-xs font-bold text-[#172747] hover:bg-[#F7F3EC] shadow-sm transition-all"
          >
            <Download className="h-4 w-4 text-[#493027]" />
            Export Executive Report
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <MetricCard
          title="Installed Solar Capacity"
          value={`${totalCapacityInstalledKw + 150} kW`}
          subtitle="Cumulative rooftop arrays"
          trend="up"
          trendValue="+54 kW this month"
          icon={Zap}
        />
        <MetricCard
          title="Monthly Run-Rate Velocity"
          value="40 Installs/Mo"
          subtitle="Baseline competition target reached"
          trend="up"
          trendValue="100% capacity target"
          icon={TrendingUp}
        />
        <MetricCard
          title="Fleet Field Failure Rate"
          value={`${failureRatePercent}%`}
          subtitle="OEM Tier-1 warranty baseline < 2%"
          trend="down"
          trendValue="Exceptional reliability"
          icon={ShieldCheck}
        />
        <MetricCard
          title="First-Time Right Rate"
          value="96.4%"
          subtitle="Zero rework post-commissioning"
          icon={CheckCircle2}
        />
      </div>

      {/* Capacity Progression Chart Simulation */}
      <div className="rounded-2xl bg-white p-6 shadow-sm border border-[#E8E0D6] space-y-4">
        <div className="flex items-center justify-between border-b border-[#E8E0D6] pb-3">
          <div>
            <h3 className="text-base font-bold text-[#172747] font-['Plus_Jakarta_Sans']">
              Monthly Installation Run-Rate Velocity
            </h3>
            <p className="text-xs text-[#6E7787]">kW Capacity and site commissions per month</p>
          </div>
          <span className="font-mono text-xs font-bold text-[#172747] bg-[#F7F3EC] px-3 py-1 rounded-lg border border-[#E8E0D6]">
            Target: 40 Units / Mo
          </span>
        </div>

        <div className="grid grid-cols-5 gap-3 pt-4 text-center">
          {monthlyData.map((d, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className="w-full flex items-end justify-center h-40 bg-[#F7F3EC] rounded-xl p-2 relative overflow-hidden group">
                <div
                  className="w-10 rounded-lg bg-[#172747] group-hover:bg-[#493027] transition-all flex items-center justify-center text-white text-[10px] font-bold"
                  style={{ height: `${(d.capacity / 60) * 100}%` }}
                >
                  <span className="rotate-[-90deg] whitespace-nowrap">{d.capacity} kW</span>
                </div>
              </div>
              <span className="text-xs font-bold text-[#172747]">{d.month}</span>
              <span className="text-[11px] text-[#6E7787]">{d.installs} installations</span>
            </div>
          ))}
        </div>
      </div>

      {/* Regional Density Table */}
      <DataTable title="Regional Density & Cluster Dispersion">
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-[#E8E0D6] bg-[#F7F3EC] text-[#493027] font-bold uppercase tracking-wider">
              <th className="py-3 px-4">Cluster / Microgrid Region</th>
              <th className="py-3 px-4">Active Arrays</th>
              <th className="py-3 px-4">Total Capacity</th>
              <th className="py-3 px-4">Fleet Share</th>
              <th className="py-3 px-4 text-right">Telemetry Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8E0D6]">
            {regions.map((r, i) => (
              <tr key={i} className="hover:bg-[#F7F3EC]/50 transition-colors">
                <td className="py-3.5 px-4 font-semibold text-[#172747] flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[#493027]" />
                  {r.name}
                </td>
                <td className="py-3.5 px-4 font-bold text-[#172747] tabular-nums">{r.count} Sites</td>
                <td className="py-3.5 px-4 font-mono font-bold text-[#172747]">{r.capacity}</td>
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-[#F7F3EC] rounded-full overflow-hidden border border-[#E8E0D6]">
                      <div className="h-full bg-[#172747]" style={{ width: r.share }} />
                    </div>
                    <span className="font-mono text-xs font-bold text-[#6E7787]">{r.share}</span>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
                    Nominal 100%
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
