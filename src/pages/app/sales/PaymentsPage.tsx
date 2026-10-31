import { useState } from 'react'
import { useSolarStore } from '@/lib/store/solarStore'
import { MetricCard } from '@/components/ui/MetricCard'
import { DataTable } from '@/components/ui/DataTable'
import {
  CreditCard,
  Search,
  CheckCircle2,
  Clock,
  Plus,
  X
} from 'lucide-react'

export function PaymentsPage() {
  const { orders, recordOrderPayment } = useSolarStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(orders[0]?.id || '')
  const [paymentAmount, setPaymentAmount] = useState(50000)

  const totalContracted = orders.reduce((sum, o) => sum + o.totalAmount, 0)
  const totalReceived = orders.reduce((sum, o) => sum + o.paidAmount, 0)
  const totalBalance = orders.reduce((sum, o) => sum + o.balanceAmount, 0)

  const handleRecord = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedOrder) return
    recordOrderPayment(selectedOrder, paymentAmount)
    setIsRecordModalOpen(false)
  }

  const filteredOrders = orders.filter(o =>
    o.orderNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.deliveryAddress.toLowerCase().includes(searchTerm.toLowerCase())
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
                Customer Escrow & Milestone Payments
              </span>
              <span className="text-xs text-[#6E7787]">30% Advance • 50% Dispatch • 20% Commission</span>
            </div>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#172747] font-['Plus_Jakarta_Sans']">
              Payment Receipts & Milestone Escrow
            </h1>
            <p className="text-sm text-[#6E7787]">
              Track stage-gate payment inflows to authorize dispatch, technician commissioning, and warranty issuance.
            </p>
          </div>

          <button
            onClick={() => setIsRecordModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-[#172747] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#011232] shadow-md transition-all"
          >
            <Plus className="h-4 w-4 text-[#E9DDCA]" />
            + Record Customer Payment
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          title="Total Contract Pipeline"
          value={`₹${totalContracted.toLocaleString('en-IN')}`}
          subtitle="Signed customer commitments"
          icon={CreditCard}
        />
        <MetricCard
          title="Escrow Inflows Collected"
          value={`₹${totalReceived.toLocaleString('en-IN')}`}
          subtitle={`${Math.round((totalReceived / (totalContracted || 1)) * 100)}% realization`}
          trend="up"
          trendValue="Healthy cashflow"
          icon={CheckCircle2}
        />
        <MetricCard
          title="Balance Due On Milestones"
          value={`₹${totalBalance.toLocaleString('en-IN')}`}
          subtitle="Awaiting dispatch or handover"
          icon={Clock}
        />
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl bg-white p-4 shadow-sm border border-[#E8E0D6]">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6E7787]" />
          <input
            type="text"
            placeholder="Search order #, customer name, location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-[#E8E0D6] pl-9 pr-4 py-2 text-xs focus:border-[#172747] focus:outline-none"
          />
        </div>
      </div>

      {/* Orders Payment Table */}
      <DataTable title={`Customer Milestone Accounts (${filteredOrders.length})`}>
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-[#E8E0D6] bg-[#F7F3EC] text-[#493027] font-bold uppercase tracking-wider">
              <th className="py-3 px-4">Order Ref</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">System</th>
              <th className="py-3 px-4">Total Contract</th>
              <th className="py-3 px-4">Paid to Date</th>
              <th className="py-3 px-4">Balance Due</th>
              <th className="py-3 px-4">Milestone Stage</th>
              <th className="py-3 px-4 text-right">Escrow Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8E0D6]">
            {filteredOrders.map((o) => (
              <tr key={o.id} className="hover:bg-[#F7F3EC]/50 transition-colors">
                <td className="py-3.5 px-4 font-mono font-bold text-[#172747]">{o.orderNo}</td>
                <td className="py-3.5 px-4">
                  <span className="block font-semibold text-[#172747]">{o.customerName}</span>
                  <span className="text-[11px] text-[#6E7787] font-mono">{o.customerPhone}</span>
                </td>
                <td className="py-3.5 px-4 font-bold text-[#172747] tabular-nums">
                  {o.capacityKw} kW ({o.systemType})
                </td>
                <td className="py-3.5 px-4 font-bold text-[#172747] tabular-nums">
                  ₹{o.totalAmount.toLocaleString('en-IN')}
                </td>
                <td className="py-3.5 px-4 font-bold text-emerald-700 tabular-nums">
                  ₹{o.paidAmount.toLocaleString('en-IN')}
                </td>
                <td className="py-3.5 px-4 font-bold text-[#493027] tabular-nums">
                  ₹{o.balanceAmount.toLocaleString('en-IN')}
                </td>
                <td className="py-3.5 px-4">
                  <span className="rounded-full bg-blue-50 border border-blue-200 px-2.5 py-0.5 text-[11px] font-semibold text-blue-800">
                    {o.paymentMilestone}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right">
                  {o.balanceAmount > 0 ? (
                    <button
                      onClick={() => {
                        setSelectedOrder(o.id)
                        setPaymentAmount(Math.min(o.balanceAmount, 50000))
                        setIsRecordModalOpen(true)
                      }}
                      className="rounded-lg bg-[#172747] px-3 py-1.5 text-[11px] font-bold text-white hover:bg-[#011232]"
                    >
                      Receive Payment
                    </button>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-[11px]">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Fully Settled
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </DataTable>

      {/* Record Payment Modal */}
      {isRecordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-[#E8E0D6] space-y-4">
            <div className="flex items-center justify-between border-b border-[#E8E0D6] pb-3">
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-[#493027]" />
                <span className="font-bold text-[#172747] font-['Plus_Jakarta_Sans']">Record Customer Inflow</span>
              </div>
              <button
                onClick={() => setIsRecordModalOpen(false)}
                className="rounded-lg p-1 text-[#6E7787] hover:bg-[#F7F3EC] hover:text-[#172747]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleRecord} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#6E7787] font-medium">Select Order</label>
                <select
                  value={selectedOrder}
                  onChange={(e) => setSelectedOrder(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[#E8E0D6] p-2.5 text-xs text-[#172747]"
                >
                  {orders.map(o => (
                    <option key={o.id} value={o.id}>
                      {o.orderNo} - {o.customerName} (Bal: ₹{o.balanceAmount.toLocaleString('en-IN')})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[#6E7787] font-medium">Payment Amount (₹)</label>
                <input
                  type="number"
                  required
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(parseInt(e.target.value) || 0)}
                  className="mt-1 w-full rounded-xl border border-[#E8E0D6] p-2.5 text-sm font-bold text-[#172747] tabular-nums"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsRecordModalOpen(false)}
                  className="flex-1 rounded-xl border border-[#E8E0D6] py-2.5 font-bold text-[#6E7787] hover:bg-[#F7F3EC]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-[#172747] py-2.5 font-bold text-white hover:bg-[#011232]"
                >
                  Confirm Escrow Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
