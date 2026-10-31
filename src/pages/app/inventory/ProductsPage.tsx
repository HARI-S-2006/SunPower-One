import { useState } from 'react'
import { MetricCard } from '@/components/ui/MetricCard'
import { DataTable } from '@/components/ui/DataTable'
import { StatusChip } from '@/components/ui/StatusChip'
import {
  Package,
  Search,
  Filter,
  AlertTriangle,
  Layers
} from 'lucide-react'

interface ProductItem {
  id: string
  code: string
  name: string
  category: 'panel' | 'inverter' | 'battery' | 'mounting' | 'electrical'
  oem: string
  specifications: string
  unitPrice: number
  inStock: number
  reorderLevel: number
  warrantyYears: number
}

const PRODUCTS_CATALOG: ProductItem[] = [
  {
    id: 'p-01',
    code: 'PNL-ADANI-540W',
    name: 'Adani Solar 540W Mono PERC Half-Cut Module',
    category: 'panel',
    oem: 'Adani Solar',
    specifications: '21.4% Efficiency, 144 Half-Cells, IP68 Junction Box',
    unitPrice: 14200,
    inStock: 180,
    reorderLevel: 50,
    warrantyYears: 20,
  },
  {
    id: 'p-02',
    code: 'INV-SOLIS-3.3K',
    name: 'Solis 3.3kW Single-Phase Grid-Tied Inverter',
    category: 'inverter',
    oem: 'Ginlong Solis',
    specifications: 'Single MPPT, 97.8% Max Eff, Built-in DC Switch',
    unitPrice: 32000,
    inStock: 14,
    reorderLevel: 5,
    warrantyYears: 2,
  },
  {
    id: 'p-03',
    code: 'INV-SOLIS-4.0K',
    name: 'Solis 4.0kW Single-Phase Grid-Tied Inverter',
    category: 'inverter',
    oem: 'Ginlong Solis',
    specifications: 'Dual MPPT, IP65 Outdoor, RS485 / WiFi SCADA',
    unitPrice: 38000,
    inStock: 12,
    reorderLevel: 5,
    warrantyYears: 2,
  },
  {
    id: 'p-04',
    code: 'INV-GROWATT-5.0K',
    name: 'Growatt 5.0kW Hybrid Inverter with MPPT',
    category: 'inverter',
    oem: 'Growatt',
    specifications: 'Dual MPPT, 48V Battery Port, Backup Emergency Power',
    unitPrice: 58000,
    inStock: 8,
    reorderLevel: 4,
    warrantyYears: 2,
  },
  {
    id: 'p-05',
    code: 'BAT-LUM-48V-100AH',
    name: 'Luminous Solar 48V 100Ah LiFePO4 Lithium Battery',
    category: 'battery',
    oem: 'Luminous Power Technologies',
    specifications: '4.8 kWh Usable, 4000 Cycles @ 80% DoD, Smart BMS',
    unitPrice: 78000,
    inStock: 9,
    reorderLevel: 4,
    warrantyYears: 2,
  },
  {
    id: 'p-06',
    code: 'MNT-ALU-STRUCTURE',
    name: 'Anodized Aluminium Rooftop Mounting Rails & Clamps',
    category: 'mounting',
    oem: 'SolRacks India',
    specifications: '6063-T6 Grade, SS304 Hardware, 150 km/h Wind Rated',
    unitPrice: 6500,
    inStock: 45,
    reorderLevel: 15,
    warrantyYears: 10,
  },
  {
    id: 'p-07',
    code: 'ELE-DCDB-ACDB-SET',
    name: 'Enclosed DCDB & ACDB Distribution Boxes with SPD',
    category: 'electrical',
    oem: 'Havells / Schneider',
    specifications: 'Class II Type 2 Surge Arrestors, MCBs, IP65 Enclosure',
    unitPrice: 8500,
    inStock: 32,
    reorderLevel: 10,
    warrantyYears: 5,
  },
]

export function ProductsPage() {
  const [products] = useState<ProductItem[]>(PRODUCTS_CATALOG)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')

  const totalSKUs = products.length
  const totalValuation = products.reduce((acc, p) => acc + (p.unitPrice * p.inStock), 0)
  const lowStockCount = products.filter(p => p.inStock <= p.reorderLevel).length

  const filtered = products.filter(p => {
    const matchesSearch =
      p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.oem.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCat = categoryFilter === 'all' || p.category === categoryFilter
    return matchesSearch && matchesCat
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
                Hardware SKU Master Database
              </span>
              <span className="text-xs text-[#6E7787]">Tier-1 Equipment Direct Integration</span>
            </div>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#172747] font-['Plus_Jakarta_Sans']">
              Product Catalog & Component Specifications
            </h1>
            <p className="text-sm text-[#6E7787]">
              Certified equipment master list powering automatic BOM calculations, warranty terms, and stock ledger.
            </p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          title="Active Hardware SKUs"
          value={totalSKUs.toString()}
          subtitle="Tier-1 approved components"
          icon={Package}
        />
        <MetricCard
          title="Warehouse Stock Valuation"
          value={`₹${totalValuation.toLocaleString('en-IN')}`}
          subtitle="At landed procurement cost"
          trend="up"
          trendValue="Sufficient for 40+ installs"
          icon={Layers}
        />
        <MetricCard
          title="Low Stock Reorder Alerts"
          value={lowStockCount.toString()}
          subtitle={lowStockCount === 0 ? 'All SKUs above reorder threshold' : 'Requires PO dispatch'}
          icon={AlertTriangle}
        />
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl bg-white p-4 shadow-sm border border-[#E8E0D6]">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6E7787]" />
          <input
            type="text"
            placeholder="Search SKU code, component name, OEM..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-[#E8E0D6] pl-9 pr-4 py-2 text-xs focus:border-[#172747] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-[#6E7787] flex items-center gap-1 font-medium">
            <Filter className="h-3.5 w-3.5" /> Category:
          </span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-xl border border-[#E8E0D6] bg-white px-3 py-2 text-xs font-semibold text-[#172747] focus:border-[#172747] focus:outline-none"
          >
            <option value="all">All Categories</option>
            <option value="panel">Solar Panels</option>
            <option value="inverter">Inverters</option>
            <option value="battery">Batteries</option>
            <option value="mounting">Mounting Structures</option>
            <option value="electrical">Electrical BoS</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <DataTable title={`Authorized Equipment Catalog (${filtered.length})`}>
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-[#E8E0D6] bg-[#F7F3EC] text-[#493027] font-bold uppercase tracking-wider">
              <th className="py-3 px-4">SKU Code</th>
              <th className="py-3 px-4">Component & OEM</th>
              <th className="py-3 px-4">Specifications</th>
              <th className="py-3 px-4">Unit Price</th>
              <th className="py-3 px-4">In Stock</th>
              <th className="py-3 px-4">Warranty</th>
              <th className="py-3 px-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8E0D6]">
            {filtered.map((p) => (
              <tr key={p.id} className="hover:bg-[#F7F3EC]/50 transition-colors">
                <td className="py-3.5 px-4 font-mono font-bold text-[#172747]">{p.code}</td>
                <td className="py-3.5 px-4">
                  <span className="block font-semibold text-[#172747]">{p.name}</span>
                  <span className="text-[11px] text-[#6E7787] font-medium">{p.oem}</span>
                </td>
                <td className="py-3.5 px-4 text-[#6E7787] max-w-xs truncate">{p.specifications}</td>
                <td className="py-3.5 px-4 font-bold text-[#172747] tabular-nums">
                  ₹{p.unitPrice.toLocaleString('en-IN')}
                </td>
                <td className="py-3.5 px-4 font-bold tabular-nums">
                  <span className={p.inStock <= p.reorderLevel ? 'text-amber-600' : 'text-emerald-700'}>
                    {p.inStock} Units
                  </span>
                </td>
                <td className="py-3.5 px-4 font-mono font-semibold text-[#493027]">
                  {p.warrantyYears} Years
                </td>
                <td className="py-3.5 px-4 text-right">
                  <StatusChip
                    status={p.inStock > p.reorderLevel ? 'completed' : 'pending'}
                    label={p.inStock > p.reorderLevel ? 'Healthy Stock' : 'Reorder Needed'}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </DataTable>
    </div>
  )
}
