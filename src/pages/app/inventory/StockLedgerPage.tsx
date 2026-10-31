import { useState } from 'react'
import { MetricCard } from '@/components/ui/MetricCard'
import { DataTable } from '@/components/ui/DataTable'
import {
  Warehouse,
  ArrowDownLeft,
  ArrowUpRight,
  Search,
  Filter,
  Download
} from 'lucide-react'

interface LedgerEntry {
  id: string
  entryNo: string
  date: string
  skuCode: string
  productName: string
  type: 'inward' | 'outward' | 'rma_return'
  quantity: number
  unit: string
  referenceDoc: string
  performedBy: string
  balanceAfter: number
}

const STOCK_TRANSACTIONS: LedgerEntry[] = [
  {
    id: 'tx-01',
    entryNo: 'TXN-2026-0492',
    date: '2026-10-24 16:30',
    skuCode: 'INV-SOLIS-4.0K',
    productName: 'Solis 4.0kW Single-Phase Grid-Tied Inverter',
    type: 'outward',
    quantity: 1,
    unit: 'Unit',
    referenceDoc: 'SO-2026-0038',
    performedBy: 'Marcus Vance (Warehouse Lead)',
    balanceAfter: 12,
  },
  {
    id: 'tx-02',
    entryNo: 'TXN-2026-0491',
    date: '2026-10-24 16:25',
    skuCode: 'PNL-ADANI-540W',
    productName: 'Adani Solar 540W Mono PERC Module',
    type: 'outward',
    quantity: 8,
    unit: 'Units',
    referenceDoc: 'SO-2026-0038',
    performedBy: 'Marcus Vance (Warehouse Lead)',
    balanceAfter: 180,
  },
  {
    id: 'tx-03',
    entryNo: 'TXN-2026-0490',
    date: '2026-10-20 11:15',
    skuCode: 'BAT-LUM-48V-100AH',
    productName: 'Luminous Solar 48V 100Ah LiFePO4 Lithium Battery',
    type: 'inward',
    quantity: 10,
    unit: 'Units',
    referenceDoc: 'PO-2026-0089',
    performedBy: 'Inventory Receiving Dock',
    balanceAfter: 9,
  },
  {
    id: 'tx-04',
    entryNo: 'TXN-2026-0489',
    date: '2026-10-18 09:40',
    skuCode: 'INV-SOLIS-3.3K',
    productName: 'Solis 3.3kW Single-Phase Grid-Tied Inverter',
    type: 'rma_return',
    quantity: 1,
    unit: 'Unit',
    referenceDoc: 'TKT-2026-012',
    performedBy: 'QA Inspection Lab',
    balanceAfter: 14,
  },
]

export function StockLedgerPage() {
  const [ledger] = useState<LedgerEntry[]>(STOCK_TRANSACTIONS)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')

  const totalInward = ledger.filter(l => l.type === 'inward').reduce((acc, l) => acc + l.quantity, 0)
  const totalOutward = ledger.filter(l => l.type === 'outward').reduce((acc, l) => acc + l.quantity, 0)

  const filtered = ledger.filter(l => {
    const matchesSearch =
      l.entryNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.referenceDoc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.skuCode.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === 'all' || l.type === typeFilter
    return matchesSearch && matchesType
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
                Double-Entry Inventory Audit
              </span>
              <span className="text-xs text-[#6E7787]">Immutable Stock Movement Journal</span>
            </div>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#172747] font-['Plus_Jakarta_Sans']">
              Warehouse Stock Ledger & Movements
            </h1>
            <p className="text-sm text-[#6E7787]">
              Continuous double-entry journal auditing all supplier inward receipts, sales order dispatches, and RMA returns.
            </p>
          </div>

          <button
            onClick={() => {
              const csv = 'EntryNo,Date,SKU,Product,Type,Qty,ReferenceDoc,BalanceAfter\n' + ledger.map(l => `${l.entryNo},${l.date},${l.skuCode},"${l.productName}",${l.type},${l.quantity},${l.referenceDoc},${l.balanceAfter}`).join('\n')
              const blob = new Blob([csv], { type: 'text/csv' })
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = 'Stock_Ledger.csv'
              a.click()
            }}
            className="flex items-center gap-2 rounded-xl border border-[#E8E0D6] bg-white px-4 py-2.5 text-xs font-bold text-[#172747] hover:bg-[#F7F3EC] shadow-sm transition-all"
          >
            <Download className="h-4 w-4 text-[#493027]" />
            Export Ledger CSV
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          title="Recent Inward Receipts"
          value={`+${totalInward} Units`}
          subtitle="PO consignments received"
          trend="up"
          trendValue="Central warehouse dock"
          icon={ArrowDownLeft}
        />
        <MetricCard
          title="Recent Outward Dispatches"
          value={`-${totalOutward} Units`}
          subtitle="Customer site allocations"
          trend="down"
          trendValue="Installed & in transit"
          icon={ArrowUpRight}
        />
        <MetricCard
          title="Stock Audit Compliance"
          value="100.0%"
          subtitle="Zero unrecorded inventory variances"
          icon={Warehouse}
        />
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl bg-white p-4 shadow-sm border border-[#E8E0D6]">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6E7787]" />
          <input
            type="text"
            placeholder="Search entry #, SKU, product, reference doc..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-[#E8E0D6] pl-9 pr-4 py-2 text-xs focus:border-[#172747] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-[#6E7787] flex items-center gap-1 font-medium">
            <Filter className="h-3.5 w-3.5" /> Movement:
          </span>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-xl border border-[#E8E0D6] bg-white px-3 py-2 text-xs font-semibold text-[#172747] focus:border-[#172747] focus:outline-none"
          >
            <option value="all">All Movements</option>
            <option value="inward">Inward (PO Delivery)</option>
            <option value="outward">Outward (Dispatch)</option>
            <option value="rma_return">RMA Return</option>
          </select>
        </div>
      </div>

      {/* Ledger Table */}
      <DataTable title={`Stock Movements Journal (${filtered.length})`}>
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-[#E8E0D6] bg-[#F7F3EC] text-[#493027] font-bold uppercase tracking-wider">
              <th className="py-3 px-4">Entry #</th>
              <th className="py-3 px-4">Date & Time</th>
              <th className="py-3 px-4">Movement Type</th>
              <th className="py-3 px-4">Component & SKU</th>
              <th className="py-3 px-4">Quantity</th>
              <th className="py-3 px-4">Reference Doc</th>
              <th className="py-3 px-4">Authorized By</th>
              <th className="py-3 px-4 text-right">Balance After</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8E0D6]">
            {filtered.map((l) => (
              <tr key={l.id} className="hover:bg-[#F7F3EC]/50 transition-colors">
                <td className="py-3.5 px-4 font-mono font-bold text-[#172747]">{l.entryNo}</td>
                <td className="py-3.5 px-4 text-[#6E7787] font-mono">{l.date}</td>
                <td className="py-3.5 px-4">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${
                      l.type === 'inward'
                        ? 'bg-emerald-100 text-emerald-800'
                        : l.type === 'outward'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {l.type === 'inward' ? <ArrowDownLeft className="h-3 w-3" /> : <ArrowUpRight className="h-3 w-3" />}
                    {l.type.replace('_', ' ')}
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <span className="block font-semibold text-[#172747]">{l.productName}</span>
                  <span className="font-mono text-[11px] text-[#6E7787]">{l.skuCode}</span>
                </td>
                <td className="py-3.5 px-4 font-bold text-[#172747] tabular-nums">
                  {l.quantity} {l.unit}
                </td>
                <td className="py-3.5 px-4 font-mono text-[#493027] font-semibold">{l.referenceDoc}</td>
                <td className="py-3.5 px-4 text-[#6E7787]">{l.performedBy}</td>
                <td className="py-3.5 px-4 text-right font-mono font-bold text-[#172747] tabular-nums">
                  {l.balanceAfter} Units
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </DataTable>
    </div>
  )
}
