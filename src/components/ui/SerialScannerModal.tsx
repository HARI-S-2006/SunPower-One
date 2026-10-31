import { useState } from 'react'
import { QrCode, X, CheckCircle, AlertTriangle, RefreshCw, Barcode } from 'lucide-react'
import { Button } from './button'
import { Input } from './input'

interface SerialScannerModalProps {
  isOpen: boolean
  onClose: () => void
  onScanSuccess: (serial: string) => void
  title?: string
  expectedProduct?: string
  dispatchedSerials?: string[]
}

export function SerialScannerModal({
  isOpen,
  onClose,
  onScanSuccess,
  title = 'Optical Serial / QR Scanner',
  expectedProduct = 'Solar Inverter 3.3kW / 5kW Hybrid',
  dispatchedSerials = ['INV-2026-8819', 'BAT-5000-0192', 'PNL-550W-0041'],
}: SerialScannerModalProps) {
  const [manualSerial, setManualSerial] = useState('')
  const [scanStatus, setScanStatus] = useState<'idle' | 'scanning' | 'success' | 'duplicate_error'>('idle')
  const [scannedResult, setScannedResult] = useState<string>('')

  if (!isOpen) return null

  const handleValidate = (serialToTest: string) => {
    const trimmed = serialToTest.trim().toUpperCase()
    if (!trimmed) return

    setScanStatus('scanning')
    setTimeout(() => {
      if (dispatchedSerials.includes(trimmed)) {
        setScanStatus('duplicate_error')
        setScannedResult(trimmed)
      } else {
        setScanStatus('success')
        setScannedResult(trimmed)
      }
    }, 600)
  }

  const handleConfirm = () => {
    if (scannedResult && scanStatus === 'success') {
      onScanSuccess(scannedResult)
      onClose()
      setScanStatus('idle')
      setManualSerial('')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#302019]/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-white rounded-2xl border border-[#E8E0D6] shadow-warm-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E0D6] bg-[#F7F3EC]/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#172747] text-white">
              <QrCode className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-headline text-base font-bold text-[#292522]">{title}</h3>
              <p className="text-xs text-[#827B73]">{expectedProduct}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#827B73] hover:bg-[#EAE1DC] hover:text-[#292522]"
            aria-label="Close scanner"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Camera Viewport Simulation */}
        <div className="p-6 bg-[#302019] relative flex flex-col items-center justify-center min-h-[220px] overflow-hidden">
          {/* Laser Scan Animation */}
          <div className="absolute inset-x-8 top-12 bottom-12 border-2 border-dashed border-[#FFDDB7]/50 rounded-xl pointer-events-none flex items-center justify-center">
            <div className="w-full h-0.5 bg-[#B68B55] shadow-[0_0_12px_#B68B55] animate-pulse" />
          </div>

          <div className="relative z-10 text-center space-y-2">
            <Barcode className="h-12 w-12 text-[#FFDDB7] mx-auto opacity-80" />
            <p className="text-xs font-semibold uppercase tracking-widest text-[#FFDDB7]">
              Optical Camera Ready
            </p>
            <p className="text-[11px] text-[#E5BEB1]">
              Align asset barcode or 2D QR code within framing bracket
            </p>
          </div>

          {/* Quick presets for rapid demo testing */}
          <div className="absolute bottom-3 inset-x-4 flex items-center justify-center gap-1.5 flex-wrap">
            <span className="text-[10px] text-[#E5BEB1] uppercase font-semibold mr-1">Demo Serials:</span>
            {['INV-3300-8491', 'BAT-48V-9932', 'INV-2026-8819'].map((s) => (
              <button
                key={s}
                onClick={() => handleValidate(s)}
                className="px-2 py-0.5 rounded text-[11px] font-mono bg-white/10 hover:bg-white/20 text-[#FFDDB7] border border-white/10 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Scan Status / Manual Input */}
        <div className="p-6 space-y-4">
          {scanStatus === 'duplicate_error' && (
            <div className="p-3 rounded-xl bg-[#9E3A3A]/10 border border-[#9E3A3A]/25 flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-[#9E3A3A] shrink-0 mt-0.5" />
              <div className="text-xs">
                <p className="font-semibold text-[#9E3A3A]">Duplicate Serial Number Rejected</p>
                <p className="text-[#827B73] mt-0.5">
                  Serial <code className="font-mono font-bold text-[#292522]">{scannedResult}</code> is already recorded in active dispatch. Multiple dispatches of the same serial are strictly forbidden.
                </p>
              </div>
            </div>
          )}

          {scanStatus === 'success' && (
            <div className="p-3 rounded-xl bg-[#2D5A43]/10 border border-[#2D5A43]/20 flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-[#2D5A43] shrink-0 mt-0.5" />
              <div className="text-xs">
                <p className="font-semibold text-[#2D5A43]">Valid Serial Number Verified</p>
                <p className="text-[#827B73] mt-0.5">
                  Asset <code className="font-mono font-bold text-[#292522]">{scannedResult}</code> passed inventory uniqueness and order allocation checks.
                </p>
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#827B73] uppercase tracking-wider">
              Or Manual Barcode Keying
            </label>
            <div className="flex gap-2">
              <Input
                value={manualSerial}
                onChange={(e) => setManualSerial(e.target.value)}
                placeholder="e.g. INV-3300-8491"
                className="font-mono uppercase"
                onKeyDown={(e) => e.key === 'Enter' && handleValidate(manualSerial)}
              />
              <Button
                variant="outline"
                onClick={() => handleValidate(manualSerial)}
                disabled={!manualSerial.trim() || scanStatus === 'scanning'}
              >
                {scanStatus === 'scanning' ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  'Validate'
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#E8E0D6] bg-[#F7F3EC]/50">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="default"
            disabled={scanStatus !== 'success'}
            onClick={handleConfirm}
          >
            Confirm & Allocate Serial
          </Button>
        </div>
      </div>
    </div>
  )
}
