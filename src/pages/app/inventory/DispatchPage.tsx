import { useState } from 'react'
import {
  Truck,
  QrCode,
  CheckCircle,
  AlertTriangle,
  ShieldCheck,
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatusChip } from '@/components/ui/StatusChip'
import { SerialScannerModal } from '@/components/ui/SerialScannerModal'
import { useSolarStore } from '@/lib/store/solarStore'

export function DispatchPage() {
  const { orders, serials, dispatchOrder } = useSolarStore()

  const pendingOrders = orders.filter((o) => o.status === 'staging_warehouse' || o.status === 'confirmed')
  const [selectedOrderId, setSelectedOrderId] = useState<string>(pendingOrders[0]?.id || '')
  const [selectedSerials, setSelectedSerials] = useState<string[]>([])
  const [scannerOpen, setScannerOpen] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const targetOrder = orders.find((o) => o.id === selectedOrderId)

  // Available in-stock serials
  const availableSerials = serials.filter(
    (s) => s.status === 'in_stock' || (s.orderId === selectedOrderId && s.status === 'allocated')
  )

  const handleToggleSerial = (serialNo: string) => {
    setSelectedSerials((prev) =>
      prev.includes(serialNo) ? prev.filter((s) => s !== serialNo) : [...prev, serialNo]
    )
  }

  const handleDispatch = () => {
    if (!selectedOrderId || selectedSerials.length === 0) return

    setFeedback(null)
    const result = dispatchOrder(selectedOrderId, selectedSerials)

    if (result.success) {
      setFeedback({
        type: 'success',
        message: `Order dispatched successfully! Serial warranties (2-Year Inverter, 20-Year Panels) automatically activated upon delivery completion. Crew job assigned!`,
      })
      setSelectedSerials([])
    } else if (result.error) {
      setFeedback({
        type: 'error',
        message: result.error,
      })
    }
  }

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#827B73] uppercase tracking-wider">
            <span>Warehouse Staging & Outbound</span>
            <span>•</span>
            <span className="text-[#172747]">Serial Validation Hub</span>
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-[#172747]">
            Serial Number Dispatch & Warranty Activation (Scenario 3)
          </h1>
          <p className="text-xs sm:text-sm text-[#827B73] mt-0.5">
            Every high-value panel, inverter, and battery must be scanned and verified before leaving the warehouse.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={() => setScannerOpen(true)}
          className="border-[#172747] text-[#172747] hover:bg-[#172747]/5"
        >
          <QrCode className="h-4 w-4 mr-1 text-[#B68B55]" />
          Launch Optical Scanner
        </Button>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-xl border flex items-start gap-3.5 text-xs ${
            feedback.type === 'success'
              ? 'bg-[#2D5A43]/10 border-[#2D5A43]/20 text-[#2D5A43]'
              : 'bg-[#9E3A3A]/10 border-[#9E3A3A]/25 text-[#9E3A3A]'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle className="h-5 w-5 shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
          )}
          <div>
            <strong className="font-bold block text-sm">
              {feedback.type === 'success' ? 'Dispatch & Warranty Complete' : 'Serial Collision Error'}
            </strong>
            <p className="mt-0.5 leading-relaxed">{feedback.message}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 cols): Order Selection */}
        <div className="lg:col-span-5 space-y-4">
          <Card>
            <CardHeader className="bg-[#F7F3EC]/70 border-b border-[#E8E0D6] pb-4">
              <CardTitle className="text-base font-bold text-[#172747]">
                Orders Awaiting Warehouse Dispatch
              </CardTitle>
              <p className="text-xs text-[#827B73]">
                {pendingOrders.length} orders ready for equipment packaging
              </p>
            </CardHeader>

            <CardContent className="p-4 space-y-2.5">
              {pendingOrders.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#827B73]">
                  No orders currently pending dispatch. All confirmed orders have been dispatched!
                </div>
              ) : (
                pendingOrders.map((ord) => {
                  const isSelected = ord.id === selectedOrderId
                  return (
                    <div
                      key={ord.id}
                      onClick={() => {
                        setSelectedOrderId(ord.id)
                        setSelectedSerials(ord.allocatedSerials || [])
                        setFeedback(null)
                      }}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-[#172747] bg-[#172747]/5 shadow-warm-sm'
                          : 'border-[#E8E0D6] bg-white hover:bg-[#F7F3EC]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-[#172747]">{ord.orderNo}</span>
                        <StatusChip status={ord.status} />
                      </div>
                      <p className="font-semibold text-sm text-[#292522] mt-1">{ord.customerName}</p>
                      <p className="text-xs text-[#827B73]">
                        {ord.capacityKw} kW {ord.systemType.toUpperCase()} • ₹{ord.totalAmount.toLocaleString()}
                      </p>
                      <p className="text-[11px] text-[#2D5A43] font-medium mt-1">
                        Milestone: {ord.paymentMilestone}
                      </p>
                    </div>
                  )
                })
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column (7 cols): Serial Selection & Packing List */}
        <div className="lg:col-span-7 space-y-6">
          {targetOrder ? (
            <Card>
              <CardHeader className="bg-[#F7F3EC]/70 border-b border-[#E8E0D6] pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-bold text-[#172747]">
                      Packing List & Serial Verification
                    </CardTitle>
                    <p className="text-xs text-[#827B73]">
                      Target Order: <strong className="text-[#292522]">{targetOrder.orderNo}</strong> for {targetOrder.customerName}
                    </p>
                  </div>
                  <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-[#172747] text-white">
                    {selectedSerials.length} Serials Scanned
                  </span>
                </div>
              </CardHeader>

              <CardContent className="p-5 space-y-5">
                {/* Available Inventory Serials Checklist */}
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#827B73] block">
                    Select Tracked Serial Numbers to Pack & Dispatch
                  </span>

                  <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                    {availableSerials.map((ser) => {
                      const isChecked = selectedSerials.includes(ser.serialNumber)
                      return (
                        <div
                          key={ser.id}
                          onClick={() => handleToggleSerial(ser.serialNumber)}
                          className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                            isChecked
                              ? 'border-[#2D5A43] bg-[#2D5A43]/10'
                              : 'border-[#E8E0D6] bg-white hover:bg-[#F7F3EC]'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {}}
                              className="w-4 h-4 rounded text-[#172747] accent-[#172747] pointer-events-none"
                            />
                            <div>
                              <p className="font-mono text-xs font-bold text-[#292522]">
                                {ser.serialNumber}
                              </p>
                              <p className="text-xs text-[#827B73]">{ser.productName}</p>
                            </div>
                          </div>

                          <div className="text-right text-xs">
                            <span className="font-bold text-[#172747] block">
                              {ser.warrantyYears}-Year Warranty
                            </span>
                            <span className="text-[10px] text-[#827B73] capitalize">
                              Mfg: {ser.manufactureDate}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Warranty Activation Notice */}
                <div className="p-3.5 rounded-xl bg-[#2D5A43]/10 border border-[#2D5A43]/20 flex items-start gap-3 text-xs text-[#2D5A43]">
                  <ShieldCheck className="h-5 w-5 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-bold">Automatic Warranty Activation on Dispatch</strong>
                    <p className="text-[#827B73] mt-0.5">
                      Per the competition requirements, the warranty clock starts on completed delivery/dispatch.
                      Dispatching these serials will immediately generate official digital warranty certificates.
                    </p>
                  </div>
                </div>

                {/* Confirm Dispatch Button */}
                <div className="pt-2 border-t border-[#E8E0D6] flex justify-between items-center">
                  <span className="text-xs text-[#827B73]">
                    {selectedSerials.length > 0
                      ? `${selectedSerials.length} serialized assets selected`
                      : 'Please select at least 1 serial number'}
                  </span>

                  <Button
                    variant="default"
                    disabled={selectedSerials.length === 0}
                    onClick={handleDispatch}
                    className="bg-[#172747] hover:bg-[#1E345E] text-white disabled:opacity-50"
                  >
                    <Truck className="h-4 w-4 mr-1 text-[#FFDDB7]" />
                    Confirm Dispatch & Activate Warranties
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-64 flex items-center justify-center text-center p-6 text-sm text-[#827B73]">
              Select an order from the staging queue to review and scan asset serials.
            </Card>
          )}
        </div>
      </div>

      <SerialScannerModal
        isOpen={scannerOpen}
        onClose={() => setScannerOpen(false)}
        dispatchedSerials={serials.filter((s) => s.status === 'dispatched').map((s) => s.serialNumber)}
        onScanSuccess={(scanned) => {
          if (!selectedSerials.includes(scanned)) {
            setSelectedSerials((prev) => [...prev, scanned])
          }
        }}
      />
    </div>
  )
}
