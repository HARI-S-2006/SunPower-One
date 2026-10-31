import { useState } from 'react'
import { calculateBOM } from '@/lib/bom/calculator'
import { MetricCard } from '@/components/ui/MetricCard'
import { DataTable } from '@/components/ui/DataTable'
import {
  Package,
  Zap,
  Battery,
  Shield,
  Download,
  DollarSign
} from 'lucide-react'

export function BomPage() {
  const [capacityKw, setCapacityKw] = useState<number>(3)
  const [systemType, setSystemType] = useState<'on-grid' | 'off-grid'>('on-grid')

  const bom = calculateBOM(capacityKw, systemType)

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-[#E8E0D6]">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#172747]/5 px-2.5 py-0.5 text-xs font-semibold text-[#172747] uppercase tracking-wider">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Engineering Specification Engine
              </span>
              <span className="text-xs text-[#6E7787]">Automated IEC 62548 BoS Generation</span>
            </div>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#172747] font-['Plus_Jakarta_Sans']">
              Standard Bill of Materials (BOM) Architecture
            </h1>
            <p className="text-sm text-[#6E7787]">
              Parametric system generator mapping capacity (1–5 kW) and grid-coupling to exact hardware quantities.
            </p>
          </div>

          <button
            onClick={() => {
              const csv = 'Component,Category,Qty,Unit,UnitPrice,Total\n' + bom.items.map(c => `"${c.productName}","${c.category}",${c.quantity},"${c.unit}",${c.unitCost},${c.totalCost}`).join('\n')
              const blob = new Blob([csv], { type: 'text/csv' })
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = `BOM_${capacityKw}kW_${systemType}.csv`
              a.click()
            }}
            className="flex items-center gap-2 rounded-xl border border-[#E8E0D6] bg-white px-4 py-2.5 text-xs font-bold text-[#172747] hover:bg-[#F7F3EC] shadow-sm transition-all"
          >
            <Download className="h-4 w-4 text-[#493027]" />
            Export BOM CSV
          </button>
        </div>
      </div>

      {/* Interactive Controls Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-2xl bg-white p-5 shadow-sm border border-[#E8E0D6]">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#493027] mb-2">
            System Capacity Selection
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((kw) => (
              <button
                key={kw}
                onClick={() => setCapacityKw(kw)}
                className={`flex-1 rounded-xl py-2.5 text-sm font-bold transition-all ${
                  capacityKw === kw
                    ? 'bg-[#172747] text-white shadow-md'
                    : 'bg-[#F7F3EC] text-[#172747] hover:bg-[#E9DDCA]/50'
                }`}
              >
                {kw} kW
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#493027] mb-2">
            Grid Synchronization Architecture
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => setSystemType('on-grid')}
              className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold transition-all ${
                systemType === 'on-grid'
                  ? 'bg-[#172747] text-white shadow-md'
                  : 'bg-[#F7F3EC] text-[#172747] hover:bg-[#E9DDCA]/50'
              }`}
            >
              <Zap className="h-4 w-4" />
              On-Grid (Net Metered)
            </button>
            <button
              onClick={() => setSystemType('off-grid')}
              className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold transition-all ${
                systemType === 'off-grid'
                  ? 'bg-[#172747] text-white shadow-md'
                  : 'bg-[#F7F3EC] text-[#172747] hover:bg-[#E9DDCA]/50'
              }`}
            >
              <Battery className="h-4 w-4" />
              Off-Grid (Hybrid + BESS)
            </button>
          </div>
        </div>
      </div>

      {/* Summary KPI row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <MetricCard
          title="Hardware Subtotal"
          value={`₹${bom.totalEquipmentCost.toLocaleString('en-IN')}`}
          subtitle={`${bom.items.length} Line items`}
          icon={Package}
        />
        <MetricCard
          title="Installation & Services"
          value={`₹${bom.installationCost.toLocaleString('en-IN')}`}
          subtitle="Certified technician labor"
          icon={Zap}
        />
        <MetricCard
          title="Concessional GST (12%)"
          value={`₹${bom.taxAmount.toLocaleString('en-IN')}`}
          subtitle="Statutory tax breakdown"
          icon={Shield}
        />
        <MetricCard
          title="Total System Cost"
          value={`₹${bom.totalAmount.toLocaleString('en-IN')}`}
          subtitle={`₹${Math.round(bom.totalAmount / capacityKw).toLocaleString('en-IN')}/kW all-inclusive`}
          trend="up"
          trendValue="Competitive pricing"
          icon={DollarSign}
        />
      </div>

      {/* Components Table */}
      <DataTable title={`Generated Bill of Materials for ${capacityKw} kW ${systemType.toUpperCase()} System`}>
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-[#E8E0D6] bg-[#F7F3EC] text-[#493027] font-bold uppercase tracking-wider">
              <th className="py-3 px-4">Component Name</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Quantity</th>
              <th className="py-3 px-4">Unit Price</th>
              <th className="py-3 px-4 text-right">Total Price</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8E0D6]">
            {bom.items.map((c, i) => (
              <tr key={i} className="hover:bg-[#F7F3EC]/50 transition-colors">
                <td className="py-3.5 px-4 font-semibold text-[#172747]">{c.productName}</td>
                <td className="py-3.5 px-4">
                  <span className="rounded-full bg-[#F7F3EC] border border-[#E8E0D6] px-2 py-0.5 text-[11px] font-semibold text-[#493027] capitalize">
                    {c.category}
                  </span>
                </td>
                <td className="py-3.5 px-4 font-bold text-[#172747] tabular-nums">
                  {c.quantity} {c.unit}
                </td>
                <td className="py-3.5 px-4 text-[#6E7787] tabular-nums">
                  ₹{c.unitCost.toLocaleString('en-IN')}
                </td>
                <td className="py-3.5 px-4 text-right font-bold text-[#172747] tabular-nums">
                  ₹{c.totalCost.toLocaleString('en-IN')}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-[#172747] bg-[#F7F3EC] font-bold text-xs text-[#172747]">
              <td colSpan={4} className="py-3 px-4 text-right uppercase tracking-wider">
                All-Inclusive Turnkey Price (Hardware + Labor + GST):
              </td>
              <td className="py-3 px-4 text-right text-base text-[#172747] tabular-nums">
                ₹{bom.totalAmount.toLocaleString('en-IN')}
              </td>
            </tr>
          </tfoot>
        </table>
      </DataTable>
    </div>
  )
}
