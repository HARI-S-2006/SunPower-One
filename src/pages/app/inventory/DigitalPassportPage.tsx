import { useState } from 'react'
import {
  QrCode,
  Barcode,
  ShieldCheck,
  Search,
  Plus,
  Printer,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  ExternalLink,
  Cpu,
  Zap,
  Battery,
  Layers,
  Gauge,
  AlertCircle,
  FileBadge,
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SerialScannerModal } from '@/components/ui/SerialScannerModal'
import { useSolarStore, DigitalPassport } from '@/lib/store/solarStore'
import { cn } from '@/lib/utils'

// Stylized visual QR Code SVG generator
function StylizedQrCode({ value, size = 160 }: { value: string; size?: number }) {
  const hash = value.split('').reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) | 0, 0)
  const patternSeed = Math.abs(hash)

  return (
    <div
      className="p-3 bg-white rounded-xl border border-[#E8E0D6] shadow-xs flex flex-col items-center justify-center inline-block"
      style={{ width: size + 24, height: size + 24 }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-[#172747]"
      >
        <rect width="100" height="100" fill="#FFFFFF" />

        {/* Finder Pattern Top-Left */}
        <rect x="6" y="6" width="26" height="26" rx="4" stroke="#172747" strokeWidth="4" />
        <rect x="13" y="13" width="12" height="12" rx="2" fill="#172747" />

        {/* Finder Pattern Top-Right */}
        <rect x="68" y="6" width="26" height="26" rx="4" stroke="#172747" strokeWidth="4" />
        <rect x="75" y="13" width="12" height="12" rx="2" fill="#172747" />

        {/* Finder Pattern Bottom-Left */}
        <rect x="6" y="68" width="26" height="26" rx="4" stroke="#172747" strokeWidth="4" />
        <rect x="13" y="75" width="12" height="12" rx="2" fill="#172747" />

        {/* Timing Pattern Horizontal & Vertical */}
        <path d="M 38 18 H 62" stroke="#B68B55" strokeWidth="3" strokeDasharray="3 3" />
        <path d="M 18 38 V 62" stroke="#B68B55" strokeWidth="3" strokeDasharray="3 3" />

        {/* Data Matrix Bits */}
        {Array.from({ length: 7 }).map((_, r) =>
          Array.from({ length: 7 }).map((_, c) => {
            const isBit = ((patternSeed >> ((r * 7 + c) % 24)) & 1) === 1
            const x = 38 + c * 3.7
            const y = 38 + r * 3.7
            return isBit ? (
              <rect key={`${r}-${c}`} x={x} y={y} width="3" height="3" rx="0.5" fill="#172747" />
            ) : null
          })
        )}

        {/* Side Accents */}
        <rect x="42" y="10" width="4" height="4" fill="#B68B55" />
        <rect x="52" y="10" width="4" height="4" fill="#172747" />
        <rect x="10" y="42" width="4" height="4" fill="#172747" />
        <rect x="10" y="52" width="4" height="4" fill="#B68B55" />
        <rect x="70" y="42" width="4" height="4" fill="#172747" />
        <rect x="80" y="52" width="4" height="4" fill="#172747" />
        <rect x="42" y="76" width="4" height="4" fill="#172747" />
        <rect x="52" y="84" width="4" height="4" fill="#B68B55" />
      </svg>
      <span className="font-mono text-[9px] text-[#827B73] font-semibold mt-1">
        ID: {value.slice(0, 14)}
      </span>
    </div>
  )
}

export function DigitalPassportPage() {
  const { passports, registerPassport } = useSolarStore()
  const [selectedPassport, setSelectedPassport] = useState<DigitalPassport | null>(
    passports[0] || null
  )
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [warrantyFilter, setWarrantyFilter] = useState<string>('all')

  // Modals
  const [scannerOpen, setScannerOpen] = useState(false)
  const [registerOpen, setRegisterOpen] = useState(false)
  const [printTagOpen, setPrintTagOpen] = useState(false)
  const [registerError, setRegisterError] = useState<string | null>(null)
  const [registerSuccess, setRegisterSuccess] = useState<string | null>(null)

  // Registration Form State
  const [newSerial, setNewSerial] = useState('')
  const [newProduct, setNewProduct] = useState('')
  const [newSku, setNewSku] = useState('')
  const [newCategory, setNewCategory] = useState<'inverter' | 'panel' | 'battery' | 'structure'>('inverter')
  const [newManufacturer, setNewManufacturer] = useState('Growatt')
  const [newModel, setNewModel] = useState('MIN 3300TL-X')
  const [newCapacity, setNewCapacity] = useState('3.3 kW')
  const [newEfficiency, setNewEfficiency] = useState('98.4%')
  const [newVoltage, setNewVoltage] = useState('160-500V MPPT')
  const [newWarrantyYears, setNewWarrantyYears] = useState(5)

  // Filtering
  const filteredPassports = passports.filter((p) => {
    const matchesSearch =
      p.serialNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.customerName && p.customerName.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter
    const matchesWarranty = warrantyFilter === 'all' || p.warrantyStatus === warrantyFilter

    return matchesSearch && matchesCategory && matchesWarranty
  })

  // Status Chip helper
  const getWarrantyBadge = (status: DigitalPassport['warrantyStatus']) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#2D5A43]/10 text-[#2D5A43] border border-[#2D5A43]/20">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2D5A43]" />
            Active Under Warranty
          </span>
        )
      case 'expiring_soon':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#B68B55]/15 text-[#B68B55] border border-[#B68B55]/30">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B68B55]" />
            Expiring Soon
          </span>
        )
      case 'expired':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#9E3A3A]/10 text-[#9E3A3A] border border-[#9E3A3A]/20">
            <span className="w-1.5 h-1.5 rounded-full bg-[#9E3A3A]" />
            Warranty Expired
          </span>
        )
      case 'unregistered':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#827B73]/10 text-[#827B73] border border-[#827B73]/20">
            <span className="w-1.5 h-1.5 rounded-full bg-[#827B73]" />
            Staged in Warehouse
          </span>
        )
    }
  }

  const getCategoryIcon = (category: DigitalPassport['category']) => {
    switch (category) {
      case 'inverter':
        return <Zap className="h-4 w-4 text-[#B68B55]" />
      case 'panel':
        return <Layers className="h-4 w-4 text-[#172747]" />
      case 'battery':
        return <Battery className="h-4 w-4 text-[#2D5A43]" />
      case 'structure':
        return <Cpu className="h-4 w-4 text-[#827B73]" />
      default:
        return <Cpu className="h-4 w-4 text-[#172747]" />
    }
  }

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setRegisterError(null)
    setRegisterSuccess(null)

    if (!newSerial.trim() || !newProduct.trim()) {
      setRegisterError('Please enter both Serial Number and Equipment Description.')
      return
    }

    const res = registerPassport({
      serialNumber: newSerial.trim().toUpperCase(),
      productName: newProduct.trim(),
      sku: newSku.trim() || `SKU-${newSerial.trim().toUpperCase()}`,
      category: newCategory,
      manufacturer: newManufacturer.trim(),
      model: newModel.trim(),
      ratedCapacity: newCapacity.trim(),
      specs: {
        efficiency: newEfficiency,
        voltageRange: newVoltage,
        mpptChannels: '2 MPPT',
      },
      warrantyDurationYears: Number(newWarrantyYears) || 5,
      warrantyStatus: 'unregistered',
    })

    if (res.error) {
      setRegisterError(res.error)
      return
    }

    setRegisterSuccess(`Asset registered successfully! Assigned Passport ${res.passport?.id}.`)
    if (res.passport) {
      setSelectedPassport(res.passport)
    }

    setTimeout(() => {
      setRegisterOpen(false)
      setRegisterSuccess(null)
      setNewSerial('')
      setNewProduct('')
      setNewSku('')
    }, 1200)
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E8E0D6]">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[26px] text-[#172747]">
              qr_code_2
            </span>
            <h1 className="font-headline text-2xl font-bold tracking-tight text-[#172747]">
              Solar Digital Passport & Asset Registry
            </h1>
          </div>
          <p className="text-sm text-[#827B73] mt-1">
            Verifiable hardware provenance, tamper-proof QR tokens, and end-to-end component traceability.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => setScannerOpen(true)}
            variant="outline"
            className="flex items-center gap-2 border-[#172747] text-[#172747] hover:bg-[#172747]/5 font-semibold text-xs"
          >
            <QrCode className="h-4 w-4" />
            Scan Asset QR
          </Button>

          <Button
            onClick={() => {
              setRegisterError(null)
              setRegisterSuccess(null)
              setRegisterOpen(true)
            }}
            className="flex items-center gap-2 bg-[#172747] hover:bg-[#1E345E] text-white font-semibold text-xs shadow-warm-sm"
          >
            <Plus className="h-4 w-4" />
            Register Asset
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-white border-[#E8E0D6] shadow-warm-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-[#827B73] uppercase tracking-wider">
                Total Digital Passports
              </p>
              <h3 className="text-2xl font-bold text-[#172747] mt-0.5">{passports.length}</h3>
              <p className="text-[11px] text-[#2D5A43] font-medium mt-0.5">100% Barcode verified</p>
            </div>
            <div className="p-2.5 rounded-xl bg-[#172747]/10 text-[#172747]">
              <Barcode className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-[#E8E0D6] shadow-warm-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-[#827B73] uppercase tracking-wider">
                Active Under Warranty
              </p>
              <h3 className="text-2xl font-bold text-[#2D5A43] mt-0.5">
                {passports.filter((p) => p.warrantyStatus === 'active').length}
              </h3>
              <p className="text-[11px] text-[#827B73] font-medium mt-0.5">Live SCADA telemetry</p>
            </div>
            <div className="p-2.5 rounded-xl bg-[#2D5A43]/10 text-[#2D5A43]">
              <ShieldCheck className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-[#E8E0D6] shadow-warm-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-[#827B73] uppercase tracking-wider">
                Staging & In-Transit
              </p>
              <h3 className="text-2xl font-bold text-[#B68B55] mt-0.5">
                {passports.filter((p) => p.warrantyStatus === 'unregistered' || !p.deliveryDate).length}
              </h3>
              <p className="text-[11px] text-[#827B73] font-medium mt-0.5">Ready for dispatch</p>
            </div>
            <div className="p-2.5 rounded-xl bg-[#B68B55]/10 text-[#B68B55]">
              <Clock className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-[#E8E0D6] shadow-warm-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-[#827B73] uppercase tracking-wider">
                Provenance Integrity
              </p>
              <h3 className="text-2xl font-bold text-[#172747] mt-0.5">100%</h3>
              <p className="text-[11px] text-[#2D5A43] font-medium mt-0.5">Cryptographic verification</p>
            </div>
            <div className="p-2.5 rounded-xl bg-[#172747]/10 text-[#172747]">
              <FileBadge className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#E8E0D6] shadow-warm-sm flex flex-col md:flex-row items-center gap-3 justify-between">
        <div className="relative flex-1 w-full md:max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#827B73]" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by serial #, passport ID, model, or customer..."
            className="pl-9 h-10 border-[#E8E0D6] focus:border-[#172747] text-xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-10 px-3 rounded-lg border border-[#E8E0D6] bg-white text-xs font-medium text-[#292522] focus:border-[#172747] focus:outline-none"
          >
            <option value="all">All Hardware Categories</option>
            <option value="inverter">Solar Inverters</option>
            <option value="panel">PV Modules & Panels</option>
            <option value="battery">Energy Storage (BESS)</option>
            <option value="structure">Mounting & BOS</option>
          </select>

          {/* Warranty Filter */}
          <select
            value={warrantyFilter}
            onChange={(e) => setWarrantyFilter(e.target.value)}
            className="h-10 px-3 rounded-lg border border-[#E8E0D6] bg-white text-xs font-medium text-[#292522] focus:border-[#172747] focus:outline-none"
          >
            <option value="all">All Warranty States</option>
            <option value="active">Active Under Warranty</option>
            <option value="expiring_soon">Expiring Soon (90 Days)</option>
            <option value="unregistered">Warehouse / Staging</option>
            <option value="expired">Expired</option>
          </select>
        </div>
      </div>

      {/* Main Master-Detail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left List Column (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#827B73]">
              Hardware Inventory ({filteredPassports.length})
            </span>
            <span className="text-[11px] text-[#827B73]">Click to view full passport</span>
          </div>

          <div className="space-y-2.5 max-h-[750px] overflow-y-auto pr-1">
            {filteredPassports.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-xl border border-dashed border-[#E8E0D6]">
                <AlertCircle className="h-8 w-8 text-[#827B73] mx-auto mb-2" />
                <p className="text-sm font-semibold text-[#292522]">No equipment matches your query</p>
                <p className="text-xs text-[#827B73] mt-1">Try adjusting your filters or search keywords.</p>
              </div>
            ) : (
              filteredPassports.map((p) => {
                const isSelected = selectedPassport?.id === p.id
                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedPassport(p)}
                    className={cn(
                      'p-4 rounded-xl border transition-all cursor-pointer bg-white',
                      isSelected
                        ? 'border-[#172747] ring-2 ring-[#172747]/15 shadow-warm-md'
                        : 'border-[#E8E0D6] hover:border-[#172747]/40 shadow-xs'
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-[#F7F3EC] text-[#172747]">
                          {getCategoryIcon(p.category)}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-xs font-bold text-[#172747]">
                              {p.serialNumber}
                            </span>
                            <span className="font-mono text-[10px] text-[#827B73] bg-[#F7F3EC] px-1 py-0.2 rounded">
                              {p.id}
                            </span>
                          </div>
                          <p className="text-xs font-semibold text-[#292522] mt-0.5 line-clamp-1">
                            {p.productName}
                          </p>
                        </div>
                      </div>
                      {getWarrantyBadge(p.warrantyStatus)}
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-[#E8E0D6]/60 flex items-center justify-between text-xs text-[#827B73]">
                      <div className="flex items-center gap-1">
                        <Zap className="h-3 w-3 text-[#B68B55]" />
                        <span>{p.ratedCapacity}</span>
                        <span className="mx-1">•</span>
                        <span>{p.warrantyDurationYears} Yr Warranty</span>
                      </div>
                      {p.customerName ? (
                        <span className="font-medium text-[#172747] truncate max-w-[140px]">
                          {p.customerName}
                        </span>
                      ) : (
                        <span className="italic text-[#827B73]">In Warehouse</span>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Right Details Column (7 cols) */}
        <div className="lg:col-span-7">
          {selectedPassport ? (
            <Card className="bg-white border-[#E8E0D6] shadow-warm-md sticky top-20">
              <CardHeader className="bg-[#F7F3EC]/70 border-b border-[#E8E0D6] pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#172747] text-white">
                        PASSPORT: {selectedPassport.id}
                      </span>
                      {getWarrantyBadge(selectedPassport.warrantyStatus)}
                    </div>
                    <CardTitle className="font-headline text-lg font-bold text-[#292522] mt-2">
                      {selectedPassport.productName}
                    </CardTitle>
                    <p className="font-mono text-xs text-[#827B73] mt-0.5">
                      Serial Number: <span className="font-bold text-[#172747]">{selectedPassport.serialNumber}</span> | SKU: {selectedPassport.sku}
                    </p>
                  </div>

                  <Button
                    onClick={() => setPrintTagOpen(true)}
                    variant="outline"
                    className="flex items-center gap-1.5 border-[#B68B55] text-[#493027] hover:bg-[#B68B55]/10 text-xs font-semibold self-start"
                  >
                    <Printer className="h-3.5 w-3.5" />
                    Print Asset Tag
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="p-6 space-y-6">
                {/* QR Code & Identification Badge */}
                <div className="p-4 rounded-xl bg-[#F7F3EC] border border-[#E8E0D6] flex flex-col sm:flex-row items-center gap-5">
                  <StylizedQrCode value={selectedPassport.qrToken} size={130} />

                  <div className="space-y-1.5 flex-1 min-w-0 text-center sm:text-left">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#B68B55]">
                      Verifiable Anti-Tamper QR Token
                    </span>
                    <h4 className="font-mono text-sm font-bold text-[#172747] break-all">
                      {selectedPassport.qrToken}
                    </h4>
                    <p className="text-xs text-[#827B73]">
                      Scan with any authorized mobile terminal to retrieve cryptographic proof of origin, real-time warranty adjudication, and maintenance service records.
                    </p>
                    <div className="pt-2 flex flex-wrap gap-2 justify-center sm:justify-start">
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#2D5A43] bg-white px-2 py-0.5 rounded border border-[#E8E0D6]">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Hardware Authenticated
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#172747] bg-white px-2 py-0.5 rounded border border-[#E8E0D6]">
                        <ShieldCheck className="h-3.5 w-3.5" /> Manufacturer Backed
                      </span>
                    </div>
                  </div>
                </div>

                {/* Technical Specifications */}
                <div>
                  <h4 className="font-headline text-sm font-bold text-[#292522] uppercase tracking-wider mb-3">
                    Technical Specifications
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 rounded-lg bg-[#FAF7F2] border border-[#E8E0D6]">
                      <span className="text-[10px] uppercase text-[#827B73] font-semibold block">Manufacturer</span>
                      <span className="text-xs font-bold text-[#172747]">{selectedPassport.manufacturer}</span>
                    </div>
                    <div className="p-3 rounded-lg bg-[#FAF7F2] border border-[#E8E0D6]">
                      <span className="text-[10px] uppercase text-[#827B73] font-semibold block">Model Code</span>
                      <span className="text-xs font-bold text-[#172747]">{selectedPassport.model}</span>
                    </div>
                    <div className="p-3 rounded-lg bg-[#FAF7F2] border border-[#E8E0D6]">
                      <span className="text-[10px] uppercase text-[#827B73] font-semibold block">Rated Capacity</span>
                      <span className="text-xs font-bold text-[#B68B55]">{selectedPassport.ratedCapacity}</span>
                    </div>
                    <div className="p-3 rounded-lg bg-[#FAF7F2] border border-[#E8E0D6]">
                      <span className="text-[10px] uppercase text-[#827B73] font-semibold block">Warranty Coverage</span>
                      <span className="text-xs font-bold text-[#2D5A43]">{selectedPassport.warrantyDurationYears} Years</span>
                    </div>
                    <div className="p-3 rounded-lg bg-[#FAF7F2] border border-[#E8E0D6]">
                      <span className="text-[10px] uppercase text-[#827B73] font-semibold block">Efficiency</span>
                      <span className="text-xs font-bold text-[#2D5A43]">{selectedPassport.specs?.efficiency || '98.4%'}</span>
                    </div>
                    <div className="p-3 rounded-lg bg-[#FAF7F2] border border-[#E8E0D6]">
                      <span className="text-[10px] uppercase text-[#827B73] font-semibold block">Operating Voltage</span>
                      <span className="text-xs font-bold text-[#172747]">{selectedPassport.specs?.voltageRange || '160-500V'}</span>
                    </div>
                    <div className="p-3 rounded-lg bg-[#FAF7F2] border border-[#E8E0D6]">
                      <span className="text-[10px] uppercase text-[#827B73] font-semibold block">Dispatch Date</span>
                      <span className="text-xs font-bold text-[#172747]">{selectedPassport.dispatchDate || 'Pending'}</span>
                    </div>
                    <div className="p-3 rounded-lg bg-[#FAF7F2] border border-[#E8E0D6]">
                      <span className="text-[10px] uppercase text-[#827B73] font-semibold block">Delivery Completion</span>
                      <span className="text-xs font-bold text-[#172747]">{selectedPassport.deliveryDate || 'In Transit'}</span>
                    </div>
                  </div>
                </div>

                {/* Commercial Deployment & Customer Context */}
                <div>
                  <h4 className="font-headline text-sm font-bold text-[#292522] uppercase tracking-wider mb-3">
                    Commercial Allocation & Site Deployment
                  </h4>
                  <div className="p-4 rounded-xl border border-[#E8E0D6] bg-white space-y-2.5">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] uppercase text-[#827B73] font-semibold">Assigned Customer</span>
                        <p className="text-sm font-bold text-[#292522]">
                          {selectedPassport.customerName || 'None (Unassigned Warehouse Inventory)'}
                        </p>
                        {selectedPassport.customerPhone && (
                          <p className="text-xs text-[#827B73]">{selectedPassport.customerPhone}</p>
                        )}
                      </div>
                      {selectedPassport.orderId && (
                        <div className="text-right">
                          <span className="text-[10px] uppercase text-[#827B73] font-semibold">Sales Order</span>
                          <p className="font-mono text-xs font-bold text-[#172747]">{selectedPassport.orderId}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Provenance & Activity Timeline */}
                <div>
                  <h4 className="font-headline text-sm font-bold text-[#292522] uppercase tracking-wider mb-3">
                    Asset Provenance Log
                  </h4>
                  <div className="relative border-l-2 border-[#E8E0D6] ml-3 pl-5 space-y-4">
                    {selectedPassport.activityHistory.map((act, i) => (
                      <div key={i} className="relative">
                        <span className="absolute -left-[27px] top-1 flex h-4 w-4 items-center justify-center rounded-full bg-white border-2 border-[#172747]">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#172747]" />
                        </span>
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-[#292522]">{act.action}</span>
                          <span className="text-[11px] text-[#827B73] font-mono">{act.timestamp}</span>
                        </div>
                        <p className="text-xs text-[#827B73] mt-0.5">
                          Actor: <span className="font-medium text-[#172747]">{act.actor}</span>
                          {act.remarks && ` — ${act.remarks}`}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="p-12 text-center bg-white rounded-xl border border-[#E8E0D6] shadow-warm-sm">
              <QrCode className="h-12 w-12 text-[#827B73] mx-auto mb-3" />
              <h3 className="font-headline text-lg font-bold text-[#292522]">No Asset Selected</h3>
              <p className="text-xs text-[#827B73] mt-1">Select an asset from the list to view its complete Digital Passport.</p>
            </div>
          )}
        </div>
      </div>

      {/* Optical Scanner Modal */}
      <SerialScannerModal
        isOpen={scannerOpen}
        onClose={() => setScannerOpen(false)}
        title="Digital Passport QR / Serial Scanner"
        expectedProduct="Scan physical QR code or enter asset barcode"
        dispatchedSerials={[]}
        onScanSuccess={(scannedCode) => {
          const match = passports.find(
            (p) =>
              p.serialNumber.toLowerCase() === scannedCode.toLowerCase() ||
              p.id.toLowerCase() === scannedCode.toLowerCase() ||
              p.qrToken.toLowerCase().includes(scannedCode.toLowerCase())
          )
          if (match) {
            setSelectedPassport(match)
            alert(`Verified Asset: ${match.productName} (${match.serialNumber})\nPassport: ${match.id}\nWarranty Status: ${match.warrantyStatus}`)
          } else {
            alert(`Scanned code: ${scannedCode}\nNo matching registered Digital Passport found. You may register this asset now.`)
            setNewSerial(scannedCode)
            setRegisterOpen(true)
          }
        }}
      />

      {/* Register Asset Modal */}
      {registerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#302019]/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-white rounded-2xl border border-[#E8E0D6] shadow-warm-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E0D6] bg-[#F7F3EC]/70">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-[#172747] text-white">
                  <Plus className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-headline text-base font-bold text-[#292522]">
                    Register Digital Passport Asset
                  </h3>
                  <p className="text-xs text-[#827B73]">Enforces cryptographic serial uniqueness</p>
                </div>
              </div>
              <button
                onClick={() => setRegisterOpen(false)}
                className="p-1.5 rounded-lg text-[#827B73] hover:bg-[#EAE1DC] hover:text-[#292522]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRegisterSubmit} className="p-6 overflow-y-auto space-y-4">
              {registerError && (
                <div className="p-3 rounded-lg bg-[#9E3A3A]/10 border border-[#9E3A3A]/20 text-[#9E3A3A] text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{registerError}</span>
                </div>
              )}

              {registerSuccess && (
                <div className="p-3 rounded-lg bg-[#2D5A43]/10 border border-[#2D5A43]/20 text-[#2D5A43] text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>{registerSuccess}</span>
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-[#292522] uppercase tracking-wider block mb-1">
                  Serial Number / Barcode *
                </label>
                <Input
                  value={newSerial}
                  onChange={(e) => setNewSerial(e.target.value)}
                  placeholder="e.g. INV-5000-9941"
                  required
                  className="font-mono text-xs border-[#E8E0D6] focus:border-[#172747]"
                />
                <span className="text-[10px] text-[#827B73] mt-1 block">
                  Must be unique across the global SunPower One registry.
                </span>
              </div>

              <div>
                <label className="text-xs font-bold text-[#292522] uppercase tracking-wider block mb-1">
                  Equipment Category *
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full h-10 px-3 rounded-lg border border-[#E8E0D6] bg-white text-xs font-medium text-[#292522] focus:border-[#172747]"
                >
                  <option value="inverter">Solar Inverter</option>
                  <option value="panel">Photovoltaic (PV) Module</option>
                  <option value="battery">Lithium Iron Phosphate Battery (BESS)</option>
                  <option value="structure">Mounting Structure & BOS</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#292522] uppercase tracking-wider block mb-1">
                  Product Description *
                </label>
                <Input
                  value={newProduct}
                  onChange={(e) => setNewProduct(e.target.value)}
                  placeholder="e.g. Growatt 5kW Hybrid Inverter (Dual MPPT)"
                  required
                  className="text-xs border-[#E8E0D6] focus:border-[#172747]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#292522] uppercase tracking-wider block mb-1">
                    Manufacturer
                  </label>
                  <Input
                    value={newManufacturer}
                    onChange={(e) => setNewManufacturer(e.target.value)}
                    placeholder="e.g. Growatt / Waaree"
                    className="text-xs border-[#E8E0D6]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#292522] uppercase tracking-wider block mb-1">
                    Model Code
                  </label>
                  <Input
                    value={newModel}
                    onChange={(e) => setNewModel(e.target.value)}
                    placeholder="e.g. SPH-5000"
                    className="text-xs border-[#E8E0D6]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#292522] uppercase tracking-wider block mb-1">
                    Rated Capacity
                  </label>
                  <Input
                    value={newCapacity}
                    onChange={(e) => setNewCapacity(e.target.value)}
                    placeholder="5.0 kW"
                    className="text-xs border-[#E8E0D6]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#292522] uppercase tracking-wider block mb-1">
                    Efficiency
                  </label>
                  <Input
                    value={newEfficiency}
                    onChange={(e) => setNewEfficiency(e.target.value)}
                    placeholder="98.2%"
                    className="text-xs border-[#E8E0D6]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#292522] uppercase tracking-wider block mb-1">
                    Warranty (Yrs)
                  </label>
                  <Input
                    type="number"
                    value={newWarrantyYears}
                    onChange={(e) => setNewWarrantyYears(Number(e.target.value))}
                    className="text-xs border-[#E8E0D6]"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-[#E8E0D6] flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setRegisterOpen(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-[#172747] hover:bg-[#1E345E] text-white text-xs font-semibold"
                >
                  Register Digital Passport
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Asset Tag Modal */}
      {printTagOpen && selectedPassport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#302019]/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-2xl border border-[#E8E0D6] shadow-warm-lg overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-5 py-3 border-b border-[#E8E0D6] bg-[#F7F3EC]">
              <div className="flex items-center gap-2">
                <Printer className="h-4 w-4 text-[#172747]" />
                <span className="font-headline text-sm font-bold text-[#292522]">Printable Hardware Tag</span>
              </div>
              <button
                onClick={() => setPrintTagOpen(false)}
                className="p-1 rounded text-[#827B73] hover:text-[#292522]"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              {/* Actual Physical Label Preview */}
              <div className="border-2 border-dashed border-[#172747] rounded-xl p-5 bg-[#FFFDF9] space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-[#E8E0D6] pb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1 rounded bg-[#172747] text-white">
                      <Zap className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <h4 className="font-headline text-xs font-bold text-[#172747] leading-none">
                        SUNPOWER SOLUTIONS
                      </h4>
                      <span className="text-[9px] uppercase tracking-widest text-[#827B73]">
                        Certified Solar Hardware
                      </span>
                    </div>
                  </div>
                  <span className="font-mono text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#172747]/10 text-[#172747]">
                    {selectedPassport.id}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-[#292522] leading-tight">
                      {selectedPassport.productName}
                    </p>
                    <p className="font-mono text-xs font-bold text-[#172747]">
                      S/N: {selectedPassport.serialNumber}
                    </p>
                    <p className="text-[10px] text-[#827B73]">
                      Specs: {selectedPassport.ratedCapacity} • {selectedPassport.specs?.efficiency || '98.4%'}
                    </p>
                    <p className="text-[10px] text-[#2D5A43] font-semibold">
                      Warranty: {selectedPassport.warrantyDurationYears} Years Manufacturer
                    </p>
                  </div>
                  <StylizedQrCode value={selectedPassport.qrToken} size={90} />
                </div>

                <div className="pt-2 border-t border-[#E8E0D6] flex items-center justify-between text-[9px] text-[#827B73]">
                  <span>Emergency Service: 1800-SUN-POWER</span>
                  <span className="font-mono">Tamper-Proof NFC/QR</span>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setPrintTagOpen(false)}
                  className="text-xs"
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    window.print()
                  }}
                  className="bg-[#172747] hover:bg-[#1E345E] text-white text-xs font-semibold flex items-center gap-1.5"
                >
                  <Printer className="h-4 w-4" />
                  Print Asset Tag
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
