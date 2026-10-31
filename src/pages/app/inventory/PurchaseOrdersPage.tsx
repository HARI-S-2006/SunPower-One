import { useState } from 'react'
import { MetricCard } from '@/components/ui/MetricCard'
import { DataTable } from '@/components/ui/DataTable'
import { StatusChip } from '@/components/ui/StatusChip'
import {
  ShoppingCart,
  Download,
  Search,
  Clock,
  Package
} from 'lucide-react'

interface POItem {
  id: string
  poNumber: string
  supplierName: string
  itemSummary: string
  quantity: number
  totalAmount: number
  orderDate: string
  expectedDelivery: string
  status: 'ordered' | 'in_transit' | 'received_dock' | 'settled'
}

const PURCHASE_ORDERS: POItem[] = [
  {
    id: 'po-01',
    poNumber: 'PO-2026-0089',
    supplierName: 'Adani Solar Regional Distribution',
    itemSummary: 'Adani 540W Mono PERC Half-Cut Modules (Batch 20)',
    quantity: 20,
    totalAmount: 284000,
    orderDate: '2026-10-15',
    expectedDelivery: '2026-10-20',
    status: 'received_dock',
  },
  {
    id: 'po-02',
    poNumber: 'PO-2026-0090',
    supplierName: 'Ginlong Solis India Pvt Ltd',
    itemSummary: 'Solis 4.0kW Single-Phase Grid Inverters',
    quantity: 6,
    totalAmount: 228000,
    orderDate: '2026-10-22',
    expectedDelivery: '2026-10-27',
    status: 'in_transit',
  },
  {
    id: 'po-03',
    poNumber: 'PO-2026-0091',
    supplierName: 'Luminous Power Technologies',
    itemSummary: 'Luminous Solar 48V 100Ah Lithium Batteries',
    quantity: 4,
    totalAmount: 312000,
    orderDate: '2026-10-24',
    expectedDelivery: '2026-10-31',
    status: 'ordered',
  },
]

export function PurchaseOrdersPage() {
  const [pos] = useState<POItem[]>(PURCHASE_ORDERS)
  const [searchTerm, setSearchTerm] = useState('')

  const totalProcurement = pos.reduce((acc, p) => acc + p.totalAmount, 0)
  const inTransitCount = pos.filter(p => p.status === 'in_transit' || p.status === 'ordered').length

  const filtered = pos.filter(p =>
    p.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.itemSummary.toLowerCase().includes(searchTerm.toLowerCase())
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
                Procurement Pipeline
              </span>
              <span className="text-xs text-[#6E7787]">Automated Replenishment Trigger</span>
            </div>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#172747] font-['Plus_Jakarta_Sans']">
              Purchase Orders & Inward Consignments
            </h1>
            <p className="text-sm text-[#6E7787]">
              Manage vendor purchase orders, freight tracking numbers, and inward barcode receiving.
            </p>
          </div>

          <button
            onClick={() => {
              const csv = 'PONumber,Supplier,Item,Qty,Total,OrderDate,ExpectedDelivery,Status\n' + pos.map(p => `${p.poNumber},"${p.supplierName}","${p.itemSummary}",${p.quantity},${p.totalAmount},${p.orderDate},${p.expectedDelivery},${p.status}`).join('\n')
              const blob = new Blob([csv], { type: 'text/csv' })
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = 'Purchase_Orders.csv'
              a.click()
            }}
            className="flex items-center gap-2 rounded-xl border border-[#E8E0D6] bg-white px-4 py-2.5 text-xs font-bold text-[#172747] hover:bg-[#F7F3EC] shadow-sm transition-all"
          >
            <Download className="h-4 w-4 text-[#493027]" />
            Export PO CSV
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          title="Active Procurement Value"
          value={`₹${totalProcurement.toLocaleString('en-IN')}`}
          subtitle="Hardware on PO pipeline"
          icon={ShoppingCart}
        />
        <MetricCard
          title="Consignments In-Transit"
          value={inTransitCount.toString()}
          subtitle="En-route to central warehouse"
          trend="neutral"
          trendValue="On schedule"
          icon={Clock}
        />
        <MetricCard
          title="Warehouse Dock Intake"
          value="1 Consignment"
          subtitle="Ready for QA serial scanning"
          icon={Package}
        />
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl bg-white p-4 shadow-sm border border-[#E8E0D6]">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6E7787]" />
          <input
            type="text"
            placeholder="Search PO #, supplier, equipment..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-[#E8E0D6] pl-9 pr-4 py-2 text-xs focus:border-[#172747] focus:outline-none"
          />
        </div>
      </div>

      {/* PO Table */}
      <DataTable title={`Active Purchase Orders (${filtered.length})`}>
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-[#E8E0D6] bg-[#F7F3EC] text-[#493027] font-bold uppercase tracking-wider">
              <th className="py-3 px-4">PO #</th>
              <th className="py-3 px-4">Supplier OEM</th>
              <th className="py-3 px-4">Consignment Items</th>
              <th className="py-3 px-4">Quantity</th>
              <th className="py-3 px-4">Total Amount</th>
              <th className="py-3 px-4">Order Date</th>
              <th className="py-3 px-4">ETA</th>
              <th className="py-3 px-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8E0D6]">
            {filtered.map((p) => (
              <tr key={p.id} className="hover:bg-[#F7F3EC]/50 transition-colors">
                <td className="py-3.5 px-4 font-mono font-bold text-[#172747]">{p.poNumber}</td>
                <td className="py-3.5 px-4 font-semibold text-[#172747]">{p.supplierName}</td>
                <td className="py-3.5 px-4 text-[#493027] font-medium">{p.itemSummary}</td>
                <td className="py-3.5 px-4 font-bold text-[#172747] tabular-nums">{p.quantity} Units</td>
                <td className="py-3.5 px-4 font-bold text-[#172747] tabular-nums">
                  ₹{p.totalAmount.toLocaleString('en-IN')}
                </td>
                <td className="py-3.5 px-4 text-[#6E7787] font-mono">{p.orderDate}</td>
                <td className="py-3.5 px-4 text-[#6E7787] font-mono">{p.expectedDelivery}</td>
                <td className="py-3.5 px-4 text-right">
                  <StatusChip
                    status={
                      p.status === 'received_dock'
                        ? 'completed'
                        : p.status === 'in_transit'
                        ? 'in-progress'
                        : 'pending'
                    }
                    label={p.status.replace('_', ' ')}
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
