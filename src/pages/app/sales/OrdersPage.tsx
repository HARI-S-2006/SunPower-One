import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Truck,
  DollarSign,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatusChip } from '@/components/ui/StatusChip'
import { DataTable, Column } from '@/components/ui/DataTable'
import { useSolarStore, SalesOrder } from '@/lib/store/solarStore'

export function OrdersPage() {
  const { orders, recordOrderPayment } = useSolarStore()

  const [paymentModalOrder, setPaymentModalOrder] = useState<SalesOrder | null>(null)
  const [paymentAmount, setPaymentAmount] = useState(50000)

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!paymentModalOrder) return
    recordOrderPayment(paymentModalOrder.id, paymentAmount)
    setPaymentModalOrder(null)
  }

  const columns: Column<SalesOrder>[] = [
    {
      key: 'orderNo',
      header: 'Sales Order',
      sortable: true,
      render: (o) => (
        <span className="font-mono text-xs font-bold text-[#172747]">
          {o.orderNo}
        </span>
      ),
    },
    {
      key: 'customerName',
      header: 'Customer & Address',
      sortable: true,
      render: (o) => (
        <div>
          <p className="font-semibold text-[#292522]">{o.customerName}</p>
          <p className="text-xs text-[#827B73] truncate max-w-xs">{o.deliveryAddress}</p>
        </div>
      ),
    },
    {
      key: 'capacityKw',
      header: 'Package',
      render: (o) => (
        <div className="text-xs font-semibold text-[#292522]">
          {o.capacityKw} kW {o.systemType.toUpperCase()}
        </div>
      ),
    },
    {
      key: 'totalAmount',
      header: 'Value & Paid',
      sortable: true,
      render: (o) => (
        <div className="text-xs">
          <p className="font-bold text-[#292522] font-mono tabular-nums">
            ₹{o.totalAmount.toLocaleString()}
          </p>
          <p className="text-[#2D5A43] font-mono tabular-nums">
            Paid: ₹{o.paidAmount.toLocaleString()}
          </p>
        </div>
      ),
    },
    {
      key: 'paymentMilestone',
      header: 'Payment Milestone',
      render: (o) => (
        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#F7F3EC] text-[#172747] border border-[#E8E0D6]">
          {o.paymentMilestone}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Order State',
      sortable: true,
      render: (o) => <StatusChip status={o.status} />,
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (o) => (
        <div className="flex items-center justify-end gap-1.5">
          {o.balanceAmount > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              onClick={() => {
                setPaymentModalOrder(o)
                setPaymentAmount(Math.min(o.balanceAmount, 50000))
              }}
            >
              <DollarSign className="h-3 w-3 mr-0.5 text-[#2D5A43]" />
              Pay Milestone
            </Button>
          )}

          <Link to="/app/inventory/dispatch">
            <Button variant="default" size="sm" className="h-8 text-xs bg-[#172747] text-white">
              <Truck className="h-3 w-3 mr-1 text-[#FFDDB7]" />
              Dispatch
            </Button>
          </Link>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-[#827B73] uppercase tracking-wider">
          <span>Commercial Execution</span>
          <span>•</span>
          <span className="text-[#172747]">Milestone Escrow & Fulfillment</span>
        </div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-[#172747]">
          Sales Orders & Payment Milestones
        </h1>
        <p className="text-xs sm:text-sm text-[#827B73] mt-0.5">
          Confirmed rooftop orders, advance payments, serial packing lists, and warehouse dispatch staging.
        </p>
      </div>

      <Card>
        <CardContent className="p-4 sm:p-6">
          <DataTable
            data={orders}
            columns={columns}
            keyExtractor={(o) => o.id}
            searchable={true}
            searchPlaceholder="Search order number, customer..."
            searchKeys={['orderNo', 'customerName', 'deliveryAddress']}
            pageSize={8}
          />
        </CardContent>
      </Card>

      {/* Payment Recording Modal */}
      {paymentModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#302019]/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-2xl border border-[#E8E0D6] shadow-warm-lg p-6 space-y-4">
            <h3 className="font-headline text-base font-bold text-[#172747]">
              Record Payment for {paymentModalOrder.orderNo}
            </h3>
            <p className="text-xs text-[#827B73]">
              Customer: <strong>{paymentModalOrder.customerName}</strong> • Balance Remaining: <strong className="font-mono text-[#9E3A3A]">₹{paymentModalOrder.balanceAmount.toLocaleString()}</strong>
            </p>

            <form onSubmit={handleRecordPayment} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#827B73]">Payment Amount (₹)</label>
                <input
                  type="number"
                  min="1000"
                  max={paymentModalOrder.balanceAmount}
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  className="w-full h-10 rounded-[10px] border border-[#E8E0D6] px-3 font-mono text-sm text-[#292522]"
                />
              </div>

              <div className="p-3 rounded-lg bg-[#F7F3EC] text-xs text-[#827B73] space-y-1">
                <div className="flex justify-between">
                  <span>Current Paid:</span>
                  <span className="font-mono text-[#292522]">₹{paymentModalOrder.paidAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-[#2D5A43]">
                  <span>New Balance After Payment:</span>
                  <span className="font-mono">₹{(paymentModalOrder.balanceAmount - paymentAmount).toLocaleString()}</span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" type="button" onClick={() => setPaymentModalOrder(null)}>
                  Cancel
                </Button>
                <Button variant="default" type="submit" className="bg-[#2D5A43] text-white">
                  Confirm Payment Receipt
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
