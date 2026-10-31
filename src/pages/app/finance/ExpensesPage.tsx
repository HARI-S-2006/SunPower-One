import { useState } from 'react'
import { MetricCard } from '@/components/ui/MetricCard'
import { StatusChip } from '@/components/ui/StatusChip'
import { DataTable } from '@/components/ui/DataTable'
import {
  Receipt,
  Download,
  Search,
  Filter,
  Truck,
  Package
} from 'lucide-react'

interface ExpenseItem {
  id: string
  expenseNo: string
  category: 'hardware' | 'freight' | 'crane_lift' | 'tools' | 'consumables'
  description: string
  projectOrderNo: string
  vendor: string
  amount: number
  date: string
  status: 'approved' | 'settled' | 'pending_approval'
}

const INITIAL_EXPENSES: ExpenseItem[] = [
  {
    id: 'exp-01',
    expenseNo: 'EXP-2026-081',
    category: 'hardware',
    description: 'Adani 540W Mono PERC Batch 10 units procurement',
    projectOrderNo: 'SO-2026-0038',
    vendor: 'Adani Solar Regional Warehouse',
    amount: 142000,
    date: '2026-10-22',
    status: 'settled',
  },
  {
    id: 'exp-02',
    expenseNo: 'EXP-2026-082',
    category: 'freight',
    description: 'Specialized hydraulic shock delivery van to Koramangala site',
    projectOrderNo: 'SO-2026-0038',
    vendor: 'CityLogistics Green Fleet',
    amount: 4500,
    date: '2026-10-24',
    status: 'settled',
  },
  {
    id: 'exp-03',
    expenseNo: 'EXP-2026-083',
    category: 'crane_lift',
    description: 'Rooftop 4-floor boom crane hoist for module pallets',
    projectOrderNo: 'SO-2026-0038',
    vendor: 'Bengaluru Heavy Lifts',
    amount: 6000,
    date: '2026-10-25',
    status: 'approved',
  },
  {
    id: 'exp-04',
    expenseNo: 'EXP-2026-084',
    category: 'consumables',
    description: 'SS304 fastners, UV ties, grounding copper lugs & conduit',
    projectOrderNo: 'SO-2026-0029',
    vendor: 'Metro Electrical Supplies',
    amount: 8200,
    date: '2025-04-08',
    status: 'settled',
  },
]

export function ExpensesPage() {
  const [expenses] = useState<ExpenseItem[]>(INITIAL_EXPENSES)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0)
  const freightTotal = expenses.filter(e => e.category === 'freight' || e.category === 'crane_lift').reduce((sum, e) => sum + e.amount, 0)
  const hardwareTotal = expenses.filter(e => e.category === 'hardware').reduce((sum, e) => sum + e.amount, 0)

  const filteredExpenses = expenses.filter(e => {
    const matchesSearch =
      e.expenseNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.vendor.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || e.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-[#E8E0D6]">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#172747]/5 px-2.5 py-0.5 text-xs font-semibold text-[#172747] uppercase tracking-wider">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                Cost Accounting Ledger
              </span>
              <span className="text-xs text-[#6E7787]">Direct Project COGS Tracking</span>
            </div>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#172747] font-['Plus_Jakarta_Sans']">
              Operating Expenses & Procurement Ledger
            </h1>
            <p className="text-sm text-[#6E7787]">
              Reconcile hardware costs, freight logistics, crane rentals, and field consumables against sales orders.
            </p>
          </div>

          <button
            onClick={() => {
              const csv = 'ExpenseNo,Category,Description,OrderNo,Vendor,Amount,Date,Status\n' + expenses.map(e => `${e.expenseNo},${e.category},"${e.description}",${e.projectOrderNo},"${e.vendor}",${e.amount},${e.date},${e.status}`).join('\n')
              const blob = new Blob([csv], { type: 'text/csv' })
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = 'Expenses_Ledger.csv'
              a.click()
            }}
            className="flex items-center gap-2 rounded-xl border border-[#E8E0D6] bg-white px-4 py-2.5 text-xs font-bold text-[#172747] hover:bg-[#F7F3EC] shadow-sm transition-all"
          >
            <Download className="h-4 w-4 text-[#493027]" />
            Export Expense CSV
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          title="Total Incurred COGS"
          value={`₹${totalExpenses.toLocaleString('en-IN')}`}
          subtitle="Project direct materials and logistics"
          icon={Receipt}
        />
        <MetricCard
          title="Hardware Procurement"
          value={`₹${hardwareTotal.toLocaleString('en-IN')}`}
          subtitle="Modules, inverters, and battery banks"
          icon={Package}
        />
        <MetricCard
          title="Freight & Crane Lifts"
          value={`₹${freightTotal.toLocaleString('en-IN')}`}
          subtitle="Site transport and rooftop lifting"
          icon={Truck}
        />
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl bg-white p-4 shadow-sm border border-[#E8E0D6]">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6E7787]" />
          <input
            type="text"
            placeholder="Search expense #, description, vendor..."
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
            <option value="hardware">Hardware</option>
            <option value="freight">Freight</option>
            <option value="crane_lift">Crane Lift</option>
            <option value="consumables">Consumables</option>
          </select>
        </div>
      </div>

      {/* Expenses Table */}
      <DataTable title={`Direct Expense Ledger Entries (${filteredExpenses.length})`}>
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-[#E8E0D6] bg-[#F7F3EC] text-[#493027] font-bold uppercase tracking-wider">
              <th className="py-3 px-4">Expense #</th>
              <th className="py-3 px-4">Description</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Project Order</th>
              <th className="py-3 px-4">Vendor</th>
              <th className="py-3 px-4">Amount</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8E0D6]">
            {filteredExpenses.map((exp) => (
              <tr key={exp.id} className="hover:bg-[#F7F3EC]/50 transition-colors">
                <td className="py-3.5 px-4 font-mono font-bold text-[#172747]">{exp.expenseNo}</td>
                <td className="py-3.5 px-4 font-semibold text-[#172747]">{exp.description}</td>
                <td className="py-3.5 px-4">
                  <span className="rounded-full bg-[#F7F3EC] border border-[#E8E0D6] px-2 py-0.5 text-[11px] font-semibold text-[#493027] capitalize">
                    {exp.category.replace('_', ' ')}
                  </span>
                </td>
                <td className="py-3.5 px-4 font-mono text-[#6E7787]">{exp.projectOrderNo}</td>
                <td className="py-3.5 px-4 text-[#172747]">{exp.vendor}</td>
                <td className="py-3.5 px-4 font-bold text-[#172747] tabular-nums">
                  ₹{exp.amount.toLocaleString('en-IN')}
                </td>
                <td className="py-3.5 px-4 text-[#6E7787] font-mono">{exp.date}</td>
                <td className="py-3.5 px-4 text-right">
                  <StatusChip
                    status={
                      exp.status === 'settled'
                        ? 'completed'
                        : exp.status === 'approved'
                        ? 'in-progress'
                        : 'pending'
                    }
                    label={exp.status.replace('_', ' ')}
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
