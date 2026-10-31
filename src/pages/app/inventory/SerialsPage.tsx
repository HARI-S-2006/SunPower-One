import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  QrCode,
  Barcode,
  Shield,
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatusChip } from '@/components/ui/StatusChip'
import { DataTable, Column } from '@/components/ui/DataTable'
import { SerialScannerModal } from '@/components/ui/SerialScannerModal'
import { useSolarStore, SerialAsset } from '@/lib/store/solarStore'

export function SerialsPage() {
  const { serials } = useSolarStore()
  const [scannerOpen, setScannerOpen] = useState(false)
  const [selectedSerial, setSelectedSerial] = useState<SerialAsset | null>(serials[0] || null)

  const columns: Column<SerialAsset>[] = [
    {
      key: 'serialNumber',
      header: 'Serial / Barcode',
      sortable: true,
      render: (s) => (
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-[#F7F3EC] text-[#172747]">
            <Barcode className="h-4 w-4" />
          </div>
          <div>
            <span className="font-mono text-xs font-bold text-[#172747] block">
              {s.serialNumber}
            </span>
            <span className="text-[10px] text-[#827B73] uppercase font-semibold">
              {s.category}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'productName',
      header: 'Equipment Specification',
      sortable: true,
      render: (s) => (
        <div>
          <p className="font-semibold text-xs text-[#292522]">{s.productName}</p>
          <span className="text-[11px] text-[#827B73]">Mfg: {s.manufactureDate}</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Lifecycle State',
      sortable: true,
      render: (s) => <StatusChip status={s.status} />,
    },
    {
      key: 'customerName',
      header: 'Customer Allocation',
      render: (s) => (
        <div className="text-xs">
          {s.customerName ? (
            <div>
              <p className="font-semibold text-[#292522]">{s.customerName}</p>
              <p className="text-[10px] font-mono text-[#827B73]">{s.orderId}</p>
            </div>
          ) : (
            <span className="text-[#827B73] italic">Unassigned in Warehouse</span>
          )}
        </div>
      ),
    },
    {
      key: 'warrantyYears',
      header: 'Warranty',
      render: (s) => (
        <span className="text-xs font-bold text-[#2D5A43]">
          {s.warrantyYears} Years
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Details',
      align: 'right',
      render: (s) => (
        <Button
          variant="outline"
          size="sm"
          className="h-8 text-xs"
          onClick={() => setSelectedSerial(s)}
        >
          Audit Ledger
        </Button>
      ),
    },
  ]

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#827B73] uppercase tracking-wider">
            <span>Inventory & Asset Tracking</span>
            <span>•</span>
            <span className="text-[#172747]">100% Traceability Standard</span>
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-[#172747]">
            Serial Number Registry & QR Ledger (Scenario 3)
          </h1>
          <p className="text-xs sm:text-sm text-[#827B73] mt-0.5">
            Individual asset serialization for panels, inverters, and battery banks. Precludes duplicate dispatch.
          </p>
        </div>

        <Button
          variant="default"
          onClick={() => setScannerOpen(true)}
          className="bg-[#172747] text-white hover:bg-[#1E345E] shadow-warm-sm"
        >
          <QrCode className="h-4 w-4 mr-1 text-[#FFDDB7]" />
          Scan Barcode / QR Code
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Serials Table */}
        <div className="lg:col-span-8">
          <Card>
            <CardContent className="p-4 sm:p-6">
              <DataTable
                data={serials}
                columns={columns}
                keyExtractor={(s) => s.id}
                searchable={true}
                searchPlaceholder="Search serial (e.g. INV-3300), product, customer..."
                searchKeys={['serialNumber', 'productName', 'customerName', 'orderId']}
                onRowClick={(s) => setSelectedSerial(s)}
                pageSize={7}
              />
            </CardContent>
          </Card>
        </div>

        {/* Right Column (4 cols): Serial Audit Card */}
        <div className="lg:col-span-4">
          {selectedSerial ? (
            <Card className="border-[#172747]/20 shadow-warm-md">
              <CardHeader className="bg-[#F7F3EC]/70 border-b border-[#E8E0D6] pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#827B73]">
                      Asset Audit Record
                    </span>
                    <CardTitle className="font-mono text-base font-bold text-[#172747]">
                      {selectedSerial.serialNumber}
                    </CardTitle>
                  </div>
                  <StatusChip status={selectedSerial.status} />
                </div>
                <p className="text-xs text-[#292522] font-semibold mt-1">
                  {selectedSerial.productName}
                </p>
              </CardHeader>

              <CardContent className="p-5 space-y-4 text-xs">
                {/* Visual Barcode Simulator */}
                <div className="p-4 rounded-xl bg-[#302019] text-center space-y-2 text-[#FFDDB7]">
                  <Barcode className="h-10 w-full mx-auto" />
                  <span className="font-mono text-xs tracking-widest font-bold">
                    {selectedSerial.serialNumber}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-[#F7F3EC]">
                    <span className="text-[#827B73]">Category:</span>
                    <strong className="text-[#292522] uppercase">{selectedSerial.category}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#F7F3EC]">
                    <span className="text-[#827B73]">Warranty Policy:</span>
                    <strong className="text-[#2D5A43]">{selectedSerial.warrantyYears}-Year Manufacturer Term</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#F7F3EC]">
                    <span className="text-[#827B73]">Manufacture Date:</span>
                    <span className="font-mono">{selectedSerial.manufactureDate}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#F7F3EC]">
                    <span className="text-[#827B73]">Dispatched Date:</span>
                    <span className="font-mono">{selectedSerial.dispatchedAt ? selectedSerial.dispatchedAt.split('T')[0] : 'In Warehouse'}</span>
                  </div>
                </div>

                {/* Customer Allocation */}
                <div className="p-3 rounded-lg bg-[#F7F3EC] border border-[#E8E0D6] space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#827B73]">Assigned Customer</span>
                  <p className="font-semibold text-sm text-[#292522]">
                    {selectedSerial.customerName || 'None (Unallocated Stock)'}
                  </p>
                  {selectedSerial.orderId && (
                    <p className="text-[11px] text-[#827B73]">
                      Sales Order: <strong className="font-mono text-[#172747]">{selectedSerial.orderId}</strong>
                    </p>
                  )}
                </div>

                {/* Link to Warranty */}
                {selectedSerial.customerName && (
                  <Link to="/app/warranties">
                    <Button variant="outline" size="sm" className="w-full text-xs">
                      <Shield className="h-3.5 w-3.5 mr-1 text-[#2D5A43]" />
                      View Active Digital Warranty Certificate
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="h-64 flex items-center justify-center text-center p-6 text-sm text-[#827B73]">
              Select an asset serial to inspect its movement ledger and warranty.
            </Card>
          )}
        </div>
      </div>

      <SerialScannerModal
        isOpen={scannerOpen}
        onClose={() => setScannerOpen(false)}
        dispatchedSerials={serials.filter((s) => s.status === 'dispatched').map((s) => s.serialNumber)}
        onScanSuccess={(scanned) => {
          const match = serials.find((s) => s.serialNumber === scanned)
          if (match) setSelectedSerial(match)
        }}
      />
    </div>
  )
}
