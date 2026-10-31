import { useState } from 'react'
import { useSolarStore } from '@/lib/store/solarStore'
import { MetricCard } from '@/components/ui/MetricCard'
import { StatusChip } from '@/components/ui/StatusChip'
import { DataTable } from '@/components/ui/DataTable'
import {
  Receipt,
  Download,
  Search,
  CheckCircle2,
  Clock,
  Eye,
  X
} from 'lucide-react'

export function InvoicesPage() {
  const { orders } = useSolarStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null)

  // Derive tax invoices from orders
  const invoices = orders.map((order, idx) => {
    const isPaid = order.paidAmount >= order.totalAmount
    const baseAmount = Math.round(order.totalAmount / 1.12)
    const gstAmount = order.totalAmount - baseAmount
    return {
      id: `inv-${order.id}`,
      invoiceNo: `INV-2026-0${84 + idx}`,
      orderNo: order.orderNo,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      date: order.createdAt.split('T')[0],
      dueDate: '2026-11-15',
      baseAmount,
      gstAmount,
      totalAmount: order.totalAmount,
      paidAmount: order.paidAmount,
      balanceAmount: order.balanceAmount,
      status: isPaid ? 'settled' : order.paidAmount > 0 ? 'partially_paid' : 'due',
      milestone: order.paymentMilestone,
    }
  })

  const totalBilled = invoices.reduce((acc, i) => acc + i.totalAmount, 0)
  const totalCollected = invoices.reduce((acc, i) => acc + i.paidAmount, 0)
  const totalOutstanding = invoices.reduce((acc, i) => acc + i.balanceAmount, 0)

  const filteredInvoices = invoices.filter(
    (inv) =>
      inv.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.orderNo.toLowerCase().includes(searchTerm.toLowerCase())
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
                GST Tax Compliance Engine
              </span>
              <span className="text-xs text-[#6E7787]">12% Concessional Solar GST Active</span>
            </div>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#172747] font-['Plus_Jakarta_Sans']">
              Commercial Invoices & Billing
            </h1>
            <p className="text-sm text-[#6E7787]">
              Track milestone-based tax invoices, GST reconciliation, and collection escrow.
            </p>
          </div>

          <button
            onClick={() => {
              const csv = 'InvoiceNo,OrderNo,Customer,Total,Paid,Balance,Status\n' + invoices.map(i => `${i.invoiceNo},${i.orderNo},"${i.customerName}",${i.totalAmount},${i.paidAmount},${i.balanceAmount},${i.status}`).join('\n')
              const blob = new Blob([csv], { type: 'text/csv' })
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = 'Tax_Invoices.csv'
              a.click()
            }}
            className="flex items-center gap-2 rounded-xl border border-[#E8E0D6] bg-white px-4 py-2.5 text-xs font-bold text-[#172747] hover:bg-[#F7F3EC] shadow-sm transition-all"
          >
            <Download className="h-4 w-4 text-[#493027]" />
            Export Invoices CSV
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          title="Total Billed Receivables"
          value={`₹${totalBilled.toLocaleString('en-IN')}`}
          subtitle="All commercial customer invoices"
          icon={Receipt}
        />
        <MetricCard
          title="Realized Revenue Collected"
          value={`₹${totalCollected.toLocaleString('en-IN')}`}
          subtitle={`${Math.round((totalCollected / (totalBilled || 1)) * 100)}% realization rate`}
          trend="up"
          trendValue="Healthy escrow"
          icon={CheckCircle2}
        />
        <MetricCard
          title="Outstanding Balances"
          value={`₹${totalOutstanding.toLocaleString('en-IN')}`}
          subtitle="Pre-dispatch & post-commissioning"
          trend="neutral"
          trendValue="On schedule"
          icon={Clock}
        />
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl bg-white p-4 shadow-sm border border-[#E8E0D6]">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6E7787]" />
          <input
            type="text"
            placeholder="Search invoice #, customer name, order #..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-[#E8E0D6] pl-9 pr-4 py-2 text-xs focus:border-[#172747] focus:outline-none"
          />
        </div>
      </div>

      {/* Invoices Table */}
      <DataTable title={`Commercial Tax Invoices (${filteredInvoices.length})`}>
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-[#E8E0D6] bg-[#F7F3EC] text-[#493027] font-bold uppercase tracking-wider">
              <th className="py-3 px-4">Invoice #</th>
              <th className="py-3 px-4">Order Ref</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Invoice Date</th>
              <th className="py-3 px-4">Total Amount</th>
              <th className="py-3 px-4">Amount Paid</th>
              <th className="py-3 px-4">Balance</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">View</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8E0D6]">
            {filteredInvoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-[#F7F3EC]/50 transition-colors">
                <td className="py-3.5 px-4 font-mono font-bold text-[#172747]">{inv.invoiceNo}</td>
                <td className="py-3.5 px-4 font-mono text-[#6E7787]">{inv.orderNo}</td>
                <td className="py-3.5 px-4 font-semibold text-[#172747]">{inv.customerName}</td>
                <td className="py-3.5 px-4 text-[#6E7787] font-mono">{inv.date}</td>
                <td className="py-3.5 px-4 font-bold text-[#172747] tabular-nums">
                  ₹{inv.totalAmount.toLocaleString('en-IN')}
                </td>
                <td className="py-3.5 px-4 font-bold text-emerald-700 tabular-nums">
                  ₹{inv.paidAmount.toLocaleString('en-IN')}
                </td>
                <td className="py-3.5 px-4 font-bold text-[#493027] tabular-nums">
                  ₹{inv.balanceAmount.toLocaleString('en-IN')}
                </td>
                <td className="py-3.5 px-4">
                  <StatusChip
                    status={
                      inv.status === 'settled'
                        ? 'completed'
                        : inv.status === 'partially_paid'
                        ? 'in-progress'
                        : 'pending'
                    }
                    label={inv.status.replace('_', ' ')}
                  />
                </td>
                <td className="py-3.5 px-4 text-right">
                  <button
                    onClick={() => setSelectedInvoice(inv)}
                    className="inline-flex items-center gap-1 rounded-lg border border-[#E8E0D6] bg-white px-2.5 py-1 text-[11px] font-bold text-[#172747] hover:bg-[#F7F3EC]"
                  >
                    <Eye className="h-3 w-3 text-[#493027]" />
                    Invoice
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </DataTable>

      {/* Invoice Modal Simulation */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl border border-[#E8E0D6] space-y-4">
            <div className="flex items-center justify-between border-b border-[#E8E0D6] pb-3">
              <div className="flex items-center gap-2">
                <Receipt className="h-5 w-5 text-[#493027]" />
                <span className="font-bold text-[#172747] font-['Plus_Jakarta_Sans']">Tax Invoice Document</span>
              </div>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="rounded-lg p-1 text-[#6E7787] hover:bg-[#F7F3EC] hover:text-[#172747]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="rounded-2xl border border-[#E8E0D6] bg-[#FFF8F5] p-5 space-y-3 text-xs">
              <div className="flex justify-between border-b border-[#E8E0D6] pb-2">
                <div>
                  <h4 className="font-bold text-base text-[#172747]">SUNPOWER SOLUTIONS PVT LTD</h4>
                  <p className="text-[11px] text-[#6E7787]">GSTIN: 29AABCS1429B1Z8</p>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-[#172747]">{selectedInvoice.invoiceNo}</span>
                  <p className="text-[11px] text-[#6E7787]">Date: {selectedInvoice.date}</p>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] text-[#6E7787] uppercase font-bold">Billed To</span>
                <p className="font-bold text-[#172747]">{selectedInvoice.customerName}</p>
                <p className="text-[#6E7787]">{selectedInvoice.customerPhone}</p>
              </div>

              <div className="divide-y divide-[#E8E0D6] border-y border-[#E8E0D6] py-2">
                <div className="flex justify-between py-1.5">
                  <span className="text-[#6E7787]">Base Material & Installation Cost:</span>
                  <span className="font-mono font-semibold text-[#172747]">₹{selectedInvoice.baseAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-[#6E7787]">Concessional Solar GST (12%):</span>
                  <span className="font-mono font-semibold text-[#172747]">₹{selectedInvoice.gstAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between py-1.5 font-bold text-sm">
                  <span className="text-[#172747]">Total Tax Invoice Amount:</span>
                  <span className="font-mono text-[#172747]">₹{selectedInvoice.totalAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between py-1.5 text-emerald-700 font-semibold">
                  <span>Paid in Escrow:</span>
                  <span className="font-mono">₹{selectedInvoice.paidAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between py-1.5 text-[#493027] font-bold">
                  <span>Balance Due:</span>
                  <span className="font-mono">₹{selectedInvoice.balanceAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedInvoice(null)}
              className="w-full rounded-xl bg-[#172747] py-3 text-xs font-bold text-white hover:bg-[#011232]"
            >
              Close Invoice
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
