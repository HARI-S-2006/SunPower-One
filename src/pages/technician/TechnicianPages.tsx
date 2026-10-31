import { useState, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useSolarStore } from '@/lib/store/solarStore'
import {
  Wrench,
  CheckCircle2,
  MapPin,
  Phone,
  QrCode,
  AlertTriangle,
  Zap,
  ShieldCheck,
  ChevronRight,
  ArrowLeft,
  FileCheck2,
  RotateCcw,
  Check
} from 'lucide-react'

// ==========================================
// 1. TECHNICIAN DASHBOARD PAGE
// ==========================================
export function TechnicianDashboardPage() {
  const { installations, startInstallation } = useSolarStore()
  const navigate = useNavigate()

  const assignedJobs = installations.filter(j => j.status === 'assigned' || j.status === 'in_progress' || j.status === 'testing')
  const completedJobs = installations.filter(j => j.status === 'commissioned')
  const currentActiveJob = installations.find(j => j.status === 'in_progress' || j.status === 'testing') || installations[0]

  return (
    <div className="space-y-6 pb-12">
      {/* Mobile Top Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-[#172747] p-6 text-white shadow-xl">
        <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-[#E9DDCA]/10 blur-2xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#E9DDCA]">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Field Unit Active • Crew A
            </div>
            <span className="text-xs text-white/70 font-mono">SCADA 60.02 Hz</span>
          </div>

          <h1 className="mt-3 text-2xl font-bold tracking-tight text-white font-['Plus_Jakarta_Sans']">
            Technician Command
          </h1>
          <p className="mt-1 text-sm text-[#F7F3EC]/80">
            Assigned Lead: <strong className="text-white font-medium">Rajesh Kumar</strong> • 15 Field Crew Fleet
          </p>

          <div className="mt-5 grid grid-cols-3 gap-2 border-t border-white/10 pt-4 text-center">
            <div className="rounded-xl bg-white/5 p-2.5">
              <span className="block text-xl font-bold text-white tabular-nums">{assignedJobs.length}</span>
              <span className="text-[11px] uppercase tracking-wider text-[#E9DDCA]">In Roster</span>
            </div>
            <div className="rounded-xl bg-white/5 p-2.5">
              <span className="block text-xl font-bold text-amber-300 tabular-nums">
                {installations.filter(j => j.status === 'in_progress').length}
              </span>
              <span className="text-[11px] uppercase tracking-wider text-[#E9DDCA]">In-Flight</span>
            </div>
            <div className="rounded-xl bg-white/5 p-2.5">
              <span className="block text-xl font-bold text-emerald-400 tabular-nums">{completedJobs.length}</span>
              <span className="text-[11px] uppercase tracking-wider text-[#E9DDCA]">Commissioned</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Grid */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => navigate('/technician/scan')}
          className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-white p-4 shadow-sm border border-[#E8E0D6] active:scale-95 transition-all text-left group hover:border-[#172747]"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#172747] text-white shadow-md group-hover:scale-105 transition-transform">
            <QrCode className="h-6 w-6 text-[#E9DDCA]" />
          </div>
          <div className="text-center">
            <span className="block text-sm font-bold text-[#172747]">Scan QR / Barcode</span>
            <span className="block text-[11px] text-[#6E7787]">Dispatch serial verify</span>
          </div>
        </button>

        <button
          onClick={() => navigate('/technician/jobs')}
          className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-white p-4 shadow-sm border border-[#E8E0D6] active:scale-95 transition-all text-left group hover:border-[#172747]"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#493027] text-white shadow-md group-hover:scale-105 transition-transform">
            <Wrench className="h-6 w-6 text-[#E9DDCA]" />
          </div>
          <div className="text-center">
            <span className="block text-sm font-bold text-[#172747]">My Job Roster</span>
            <span className="block text-[11px] text-[#6E7787]">All assigned works</span>
          </div>
        </button>
      </div>

      {/* Primary Highlighted Job Card */}
      {currentActiveJob && (
        <div className="rounded-2xl bg-white p-5 shadow-sm border border-[#E8E0D6] space-y-4">
          <div className="flex items-center justify-between border-b border-[#E8E0D6] pb-3">
            <div className="flex items-center gap-2">
              <span className="flex h-3 w-3 rounded-full bg-amber-500 animate-ping" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#493027]">Priority Job</span>
            </div>
            <span className="font-mono text-xs font-semibold text-[#6E7787]">{currentActiveJob.jobNo}</span>
          </div>

          <div>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#172747]">{currentActiveJob.customerName}</h3>
                <p className="mt-0.5 text-xs text-[#6E7787] flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-[#493027]" />
                  {currentActiveJob.siteAddress}
                </p>
              </div>
              <span className="rounded-lg bg-[#F7F3EC] px-2.5 py-1 text-xs font-bold text-[#172747] tabular-nums border border-[#E8E0D6]">
                {currentActiveJob.capacityKw} kW System
              </span>
            </div>

            <div className="mt-4 flex items-center justify-between rounded-xl bg-[#F7F3EC] p-3 text-xs">
              <span className="text-[#6E7787]">Scheduled Target:</span>
              <strong className="text-[#172747] font-semibold">{currentActiveJob.scheduledDate}</strong>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            {currentActiveJob.status === 'assigned' && (
              <button
                onClick={() => startInstallation(currentActiveJob.id)}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#172747] py-3 text-sm font-semibold text-white shadow hover:bg-[#011232] transition-colors"
              >
                <Zap className="h-4 w-4 text-[#E9DDCA]" />
                Start Job
              </button>
            )}

            <button
              onClick={() => navigate(`/technician/checklist/${currentActiveJob.id}`)}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#493027] py-3 text-sm font-semibold text-white shadow hover:bg-[#302019] transition-colors"
            >
              <FileCheck2 className="h-4 w-4 text-[#E9DDCA]" />
              Commission Checklist
            </button>
          </div>
        </div>
      )}

      {/* Assigned Roster Feed */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-[#172747] font-['Plus_Jakarta_Sans']">Assigned Job Queue</h2>
          <Link to="/technician/jobs" className="text-xs font-semibold text-[#493027] hover:underline flex items-center gap-1">
            View All ({installations.length})
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="space-y-3">
          {installations.map((job) => (
            <div
              key={job.id}
              onClick={() => navigate(`/technician/jobs/${job.id}`)}
              className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm border border-[#E8E0D6] hover:border-[#172747] cursor-pointer transition-all"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-semibold text-[#6E7787]">{job.jobNo}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      job.status === 'commissioned'
                        ? 'bg-emerald-100 text-emerald-800'
                        : job.status === 'in_progress'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {job.status.replace('_', ' ')}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-[#172747]">{job.customerName}</h4>
                <p className="text-xs text-[#6E7787] flex items-center gap-1 truncate max-w-[220px]">
                  <MapPin className="h-3 w-3 text-[#493027] flex-shrink-0" />
                  {job.siteAddress}
                </p>
              </div>

              <div className="flex flex-col items-end gap-1">
                <span className="text-xs font-bold text-[#172747] tabular-nums">{job.capacityKw} kW</span>
                <ChevronRight className="h-4 w-4 text-[#6E7787]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ==========================================
// 2. TECHNICIAN JOBS ROSTER LIST PAGE
// ==========================================
export function TechnicianJobsPage() {
  const { installations } = useSolarStore()
  const navigate = useNavigate()
  const [filter, setFilter] = useState<'all' | 'assigned' | 'in_progress' | 'commissioned'>('all')

  const filteredJobs = installations.filter(job => filter === 'all' || job.status === filter)

  return (
    <div className="space-y-5 pb-12">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/technician/dashboard')}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-[#E8E0D6] text-[#172747] hover:bg-[#F7F3EC]"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-[#172747] font-['Plus_Jakarta_Sans']">Field Job Roster</h1>
          <p className="text-xs text-[#6E7787]">15-technician active queue & site execution</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex rounded-xl bg-[#F7F3EC] p-1 border border-[#E8E0D6] text-xs font-semibold">
        {(['all', 'assigned', 'in_progress', 'commissioned'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`flex-1 rounded-lg py-2 capitalize transition-all ${
              filter === tab ? 'bg-[#172747] text-white shadow-sm' : 'text-[#6E7787] hover:text-[#172747]'
            }`}
          >
            {tab.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Jobs List */}
      <div className="space-y-3">
        {filteredJobs.map(job => (
          <div
            key={job.id}
            onClick={() => navigate(`/technician/jobs/${job.id}`)}
            className="rounded-2xl bg-white p-4 shadow-sm border border-[#E8E0D6] hover:border-[#172747] cursor-pointer transition-all space-y-3"
          >
            <div className="flex items-center justify-between border-b border-[#F7F3EC] pb-2">
              <span className="font-mono text-xs font-semibold text-[#6E7787]">{job.jobNo}</span>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${
                  job.status === 'commissioned'
                    ? 'bg-emerald-100 text-emerald-800'
                    : job.status === 'in_progress'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-blue-100 text-blue-800'
                }`}
              >
                {job.status.replace('_', ' ')}
              </span>
            </div>

            <div>
              <h3 className="font-bold text-[#172747]">{job.customerName}</h3>
              <p className="text-xs text-[#6E7787] flex items-center gap-1 mt-0.5">
                <MapPin className="h-3.5 w-3.5 text-[#493027] flex-shrink-0" />
                {job.siteAddress}
              </p>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-[#F7F3EC] p-2.5 text-xs">
              <span className="text-[#6E7787]">Crew Lead: <strong className="text-[#172747]">{job.leadTechnician}</strong></span>
              <span className="font-bold text-[#172747] tabular-nums">{job.capacityKw} kW System</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ==========================================
// 3. TECHNICIAN JOB DETAIL VIEW
// ==========================================
export function TechnicianJobDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { installations, startInstallation, orders } = useSolarStore()

  const job = installations.find(j => j.id === id) || installations[0]
  const linkedOrder = orders.find(o => o.id === job?.orderId)

  if (!job) {
    return <div className="p-8 text-center text-[#6E7787]">Job record not found.</div>
  }

  return (
    <div className="space-y-5 pb-12">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/technician/jobs')}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-[#E8E0D6] text-[#172747] hover:bg-[#F7F3EC]"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <span className="font-mono text-xs font-semibold text-[#6E7787]">{job.jobNo}</span>
          <h1 className="text-xl font-bold text-[#172747] font-['Plus_Jakarta_Sans']">{job.customerName}</h1>
        </div>
      </div>

      {/* Customer & Address Card */}
      <div className="rounded-2xl bg-white p-5 shadow-sm border border-[#E8E0D6] space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-[#493027]">Site Coordinates</span>
          <span
            className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
              job.status === 'commissioned'
                ? 'bg-emerald-100 text-emerald-800'
                : job.status === 'in_progress'
                ? 'bg-amber-100 text-amber-800'
                : 'bg-blue-100 text-blue-800'
            }`}
          >
            {job.status.replace('_', ' ')}
          </span>
        </div>

        <div className="space-y-1">
          <p className="text-sm font-semibold text-[#172747] flex items-start gap-2">
            <MapPin className="h-4 w-4 text-[#493027] flex-shrink-0 mt-0.5" />
            {job.siteAddress}
          </p>
          <p className="text-xs text-[#6E7787] flex items-center gap-2 pl-6">
            <Phone className="h-3.5 w-3.5 text-[#493027]" />
            <a href={`tel:${job.customerPhone}`} className="text-[#172747] hover:underline font-mono">
              {job.customerPhone}
            </a>
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#F7F3EC]">
          <div className="rounded-xl bg-[#F7F3EC] p-2.5">
            <span className="block text-[11px] text-[#6E7787]">Capacity</span>
            <span className="text-sm font-bold text-[#172747] tabular-nums">{job.capacityKw} kW</span>
          </div>
          <div className="rounded-xl bg-[#F7F3EC] p-2.5">
            <span className="block text-[11px] text-[#6E7787]">Scheduled Date</span>
            <span className="text-sm font-bold text-[#172747]">{job.scheduledDate}</span>
          </div>
        </div>
      </div>

      {/* Dispatched Equipment & Serials */}
      <div className="rounded-2xl bg-white p-5 shadow-sm border border-[#E8E0D6] space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-[#493027]">Allocated Serials</span>
          <span className="text-xs text-[#6E7787]">Dispatched from Central Warehouse</span>
        </div>

        {linkedOrder?.allocatedSerials && linkedOrder.allocatedSerials.length > 0 ? (
          <div className="space-y-2">
            {linkedOrder.allocatedSerials.map((sn, idx) => (
              <div key={idx} className="flex items-center justify-between rounded-xl bg-[#F7F3EC] px-3 py-2 text-xs">
                <span className="font-mono font-bold text-[#172747]">{sn}</span>
                <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-[11px]">
                  <CheckCircle2 className="h-3 w-3" />
                  Verified
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-[#6E7787]">No serial numbers recorded for this job order.</p>
        )}
      </div>

      {/* Action Footer */}
      <div className="space-y-2 pt-2">
        {job.status === 'assigned' && (
          <button
            onClick={() => startInstallation(job.id)}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#172747] py-3.5 text-sm font-bold text-white shadow hover:bg-[#011232] transition-colors"
          >
            <Zap className="h-4 w-4 text-[#E9DDCA]" />
            Mark In-Progress & Start Execution
          </button>
        )}

        <button
          onClick={() => navigate(`/technician/checklist/${job.id}`)}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#493027] py-3.5 text-sm font-bold text-white shadow hover:bg-[#302019] transition-colors"
        >
          <FileCheck2 className="h-4 w-4 text-[#E9DDCA]" />
          Commissioning 5-Point Checklist
        </button>

        <button
          onClick={() => navigate(`/technician/completion/${job.id}`)}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-white border border-[#E8E0D6] py-3.5 text-sm font-bold text-[#172747] shadow-sm hover:bg-[#F7F3EC] transition-colors"
        >
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          Customer Signature & Final Handover
        </button>
      </div>
    </div>
  )
}

// ==========================================
// 4. TECHNICIAN QR / BARCODE SCANNER PAGE
// ==========================================
export function TechnicianScanPage() {
  const navigate = useNavigate()
  const { serials } = useSolarStore()
  const [manualCode, setManualCode] = useState('')
  const [flash, setFlash] = useState(false)
  const [scannedResult, setScannedResult] = useState<{ serial: string; status: string; customer?: string } | null>(null)

  const handleSimulatedScan = (code: string) => {
    const found = serials.find(s => s.serialNumber.toLowerCase() === code.trim().toLowerCase())
    if (found) {
      setScannedResult({
        serial: found.serialNumber,
        status: found.status.replace('_', ' ').toUpperCase(),
        customer: found.customerName || 'Central Warehouse Reserve'
      })
    } else {
      setScannedResult({
        serial: code,
        status: 'UNREGISTERED IN SYSTEM',
        customer: 'Unknown / Not Dispatched'
      })
    }
  }

  return (
    <div className="space-y-5 pb-12">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-[#E8E0D6] text-[#172747] hover:bg-[#F7F3EC]"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-[#172747] font-['Plus_Jakarta_Sans']">Optical Serial Scanner</h1>
          <p className="text-xs text-[#6E7787]">Barcodes & 2D Datamatrix verification</p>
        </div>
      </div>

      {/* Camera Viewfinder Mockup */}
      <div className="relative overflow-hidden rounded-3xl bg-black aspect-[3/4] max-w-sm mx-auto flex flex-col justify-between p-6 shadow-2xl border-4 border-[#172747]">
        {/* Top Controls */}
        <div className="flex items-center justify-between text-white z-10">
          <div className="flex items-center gap-1.5 rounded-full bg-white/20 backdrop-blur px-3 py-1 text-xs font-semibold">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            Camera 60 FPS
          </div>
          <button
            onClick={() => setFlash(!flash)}
            className={`flex h-10 w-10 items-center justify-center rounded-full backdrop-blur transition-colors ${
              flash ? 'bg-amber-400 text-black' : 'bg-white/20 text-white'
            }`}
          >
            <Zap className="h-5 w-5" />
          </button>
        </div>

        {/* Viewfinder Target Reticle */}
        <div className="relative flex flex-col items-center justify-center">
          <div className="w-56 h-56 border-2 border-white/40 rounded-2xl relative flex items-center justify-center">
            {/* Corner Markers */}
            <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-[#E9DDCA] rounded-tl-lg" />
            <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-[#E9DDCA] rounded-tr-lg" />
            <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-[#E9DDCA] rounded-bl-lg" />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-[#E9DDCA] rounded-br-lg" />

            {/* Scanning Laser Line */}
            <div className="absolute w-full h-0.5 bg-red-500 shadow-[0_0_12px_#ff0000] animate-bounce" />

            <span className="text-[11px] text-white/70 tracking-widest uppercase">Align Barcode</span>
          </div>
        </div>

        {/* Quick Demo Scan Buttons */}
        <div className="z-10 space-y-2">
          <div className="flex gap-2">
            <button
              onClick={() => handleSimulatedScan('INV-3300-8491')}
              className="flex-1 rounded-xl bg-white/20 backdrop-blur py-2 text-xs font-mono font-bold text-white hover:bg-white/30"
            >
              Scan INV-3300
            </button>
            <button
              onClick={() => handleSimulatedScan('BAT-48V-9932')}
              className="flex-1 rounded-xl bg-white/20 backdrop-blur py-2 text-xs font-mono font-bold text-white hover:bg-white/30"
            >
              Scan BAT-48V
            </button>
          </div>
        </div>
      </div>

      {/* Manual Input Fallback */}
      <div className="rounded-2xl bg-white p-5 shadow-sm border border-[#E8E0D6] space-y-3">
        <label className="block text-xs font-bold uppercase tracking-wider text-[#493027]">
          Manual Barcode Override
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="e.g. INV-4000-9102"
            value={manualCode}
            onChange={e => setManualCode(e.target.value)}
            className="flex-1 rounded-xl border border-[#E8E0D6] px-3 py-2 text-sm font-mono uppercase focus:border-[#172747] focus:outline-none"
          />
          <button
            onClick={() => handleSimulatedScan(manualCode)}
            className="rounded-xl bg-[#172747] px-4 py-2 text-xs font-bold text-white hover:bg-[#011232]"
          >
            Verify
          </button>
        </div>
      </div>

      {/* Result Modal / Notification */}
      {scannedResult && (
        <div className="rounded-2xl bg-[#F7F3EC] p-5 border border-[#E8E0D6] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#172747]">Scanned Identity</span>
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
              {scannedResult.status}
            </span>
          </div>
          <p className="font-mono text-base font-bold text-[#172747]">{scannedResult.serial}</p>
          <p className="text-xs text-[#6E7787]">Assigned Destination: <strong>{scannedResult.customer}</strong></p>
        </div>
      )}
    </div>
  )
}

// ==========================================
// 5. TECHNICIAN CHECKLIST & COMMISSIONING
// ==========================================
export function TechnicianChecklistPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { installations } = useSolarStore()

  const job = installations.find(j => j.id === id) || installations[0]

  const [checklist, setChecklist] = useState({
    mountingTorque: job?.checklist.mountingStructureTorqueVerified ?? true,
    isolationMegger: job?.checklist.isolationResistanceMeggerTestPassed ?? true,
    stringVocIsc: job?.checklist.vocAndIscStringVerified ?? true,
    earthResistance: job?.checklist.earthingResistanceLessThan5Ohms ?? true,
    antiIslanding: job?.checklist.inverterAntiIslandingFunctional ?? true,
  })

  const [readings, setReadings] = useState({
    voc: job?.testedVocVolts || 395.4,
    isc: job?.testedIscAmps || 13.2,
    earth: job?.testedEarthResistanceOhms || 2.4,
    kw: job?.solarGenerationKwReading || 3.8,
  })

  const allPassed = Object.values(checklist).every(Boolean)

  return (
    <div className="space-y-5 pb-12">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(`/technician/jobs/${job.id}`)}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-[#E8E0D6] text-[#172747] hover:bg-[#F7F3EC]"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <span className="font-mono text-xs font-semibold text-[#6E7787]">{job.jobNo}</span>
          <h1 className="text-xl font-bold text-[#172747] font-['Plus_Jakarta_Sans']">Commissioning Inspection</h1>
        </div>
      </div>

      {/* Safety Notice */}
      <div className="rounded-2xl bg-amber-50 p-4 border border-amber-200 flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 leading-relaxed">
          <strong>Mandatory IEC 62446 Standards:</strong> All 5 commissioning tests must be verified by the certified lead technician before activating grid tie.
        </div>
      </div>

      {/* 5-Point Safety Verification */}
      <div className="rounded-2xl bg-white p-5 shadow-sm border border-[#E8E0D6] space-y-4">
        <h2 className="text-sm font-bold text-[#172747] uppercase tracking-wider">5-Point Safety Inspection</h2>

        <div className="space-y-3">
          {[
            {
              id: 'mountingTorque',
              title: 'Mounting Structure Torque Verified',
              desc: 'SS304 hardware torqued to 35 Nm specification. Zero wind deflection.',
            },
            {
              id: 'isolationMegger',
              title: 'Isolation Resistance Megger Test Passed',
              desc: 'DC insulation resistance measured > 1.0 MΩ at 1000V DC.',
            },
            {
              id: 'stringVocIsc',
              title: 'Voc & Isc String Polarity Verified',
              desc: 'Open circuit voltage matched string calculation without reverse polarity.',
            },
            {
              id: 'earthResistance',
              title: 'Earthing Resistance < 5.0 Ohms',
              desc: 'Dedicated copper-bonded earth pit reading complies with IS 3043.',
            },
            {
              id: 'antiIslanding',
              title: 'Inverter Anti-Islanding Functional',
              desc: 'Inverter automatically disconnects from grid within 2 seconds of utility cut.',
            },
          ].map((item) => (
            <label
              key={item.id}
              className={`flex items-start gap-3 rounded-xl p-3 border cursor-pointer transition-all ${
                checklist[item.id as keyof typeof checklist]
                  ? 'bg-emerald-50/50 border-emerald-300'
                  : 'bg-white border-[#E8E0D6]'
              }`}
            >
              <input
                type="checkbox"
                checked={checklist[item.id as keyof typeof checklist]}
                onChange={(e) =>
                  setChecklist({ ...checklist, [item.id]: e.target.checked })
                }
                className="h-5 w-5 rounded border-[#E8E0D6] text-[#172747] focus:ring-[#172747] mt-0.5"
              />
              <div className="flex-1">
                <span className="block text-sm font-bold text-[#172747]">{item.title}</span>
                <span className="block text-xs text-[#6E7787] mt-0.5">{item.desc}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Meter Measurements Input */}
      <div className="rounded-2xl bg-white p-5 shadow-sm border border-[#E8E0D6] space-y-4">
        <h2 className="text-sm font-bold text-[#172747] uppercase tracking-wider">Commissioning Telemetry Readings</h2>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-[#6E7787] font-medium">Open Circuit Voc (V)</label>
            <input
              type="number"
              step="0.1"
              value={readings.voc}
              onChange={(e) => setReadings({ ...readings, voc: parseFloat(e.target.value) || 0 })}
              className="mt-1 w-full rounded-xl border border-[#E8E0D6] p-2.5 text-sm font-bold text-[#172747] tabular-nums"
            />
          </div>

          <div>
            <label className="block text-xs text-[#6E7787] font-medium">Short Circuit Isc (A)</label>
            <input
              type="number"
              step="0.1"
              value={readings.isc}
              onChange={(e) => setReadings({ ...readings, isc: parseFloat(e.target.value) || 0 })}
              className="mt-1 w-full rounded-xl border border-[#E8E0D6] p-2.5 text-sm font-bold text-[#172747] tabular-nums"
            />
          </div>

          <div>
            <label className="block text-xs text-[#6E7787] font-medium">Earth Resistance (Ω)</label>
            <input
              type="number"
              step="0.1"
              value={readings.earth}
              onChange={(e) => setReadings({ ...readings, earth: parseFloat(e.target.value) || 0 })}
              className="mt-1 w-full rounded-xl border border-[#E8E0D6] p-2.5 text-sm font-bold text-[#172747] tabular-nums"
            />
          </div>

          <div>
            <label className="block text-xs text-[#6E7787] font-medium">Live Solar Gen (kW)</label>
            <input
              type="number"
              step="0.1"
              value={readings.kw}
              onChange={(e) => setReadings({ ...readings, kw: parseFloat(e.target.value) || 0 })}
              className="mt-1 w-full rounded-xl border border-[#E8E0D6] p-2.5 text-sm font-bold text-[#172747] tabular-nums"
            />
          </div>
        </div>
      </div>

      {/* Progress to Customer Acceptance */}
      <button
        disabled={!allPassed}
        onClick={() => navigate(`/technician/completion/${job.id}`)}
        className={`w-full flex items-center justify-center gap-2 rounded-xl py-4 text-sm font-bold transition-all shadow ${
          allPassed
            ? 'bg-[#172747] text-white hover:bg-[#011232]'
            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
        }`}
      >
        <Check className="h-4 w-4" />
        {allPassed ? 'Proceed to Customer Acceptance Sign-off' : 'Complete All 5 Checks Above'}
      </button>
    </div>
  )
}

// ==========================================
// 6. TECHNICIAN COMPLETION & SIGNATURE PAD
// ==========================================
export function TechnicianCompletionPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { installations, completeInstallation } = useSolarStore()

  const job = installations.find(j => j.id === id) || installations[0]

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [hasSignature, setHasSignature] = useState(false)
  const [customerAgreed, setCustomerAgreed] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  // Canvas drawing handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    setIsDrawing(true)
    const rect = canvas.getBoundingClientRect()
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top

    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top

    ctx.lineTo(x, y)
    ctx.strokeStyle = '#172747'
    ctx.lineWidth = 2.5
    ctx.lineCap = 'round'
    ctx.stroke()
    setHasSignature(true)
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setHasSignature(false)
  }

  const handleFinalSignoff = () => {
    if (!hasSignature || !customerAgreed) return
    const canvas = canvasRef.current
    const sigData = canvas?.toDataURL() || 'data:image/svg+xml;base64,mockSig'

    completeInstallation(
      job.id,
      {
        mountingStructureTorqueVerified: true,
        isolationResistanceMeggerTestPassed: true,
        vocAndIscStringVerified: true,
        earthingResistanceLessThan5Ohms: true,
        inverterAntiIslandingFunctional: true,
      },
      {
        voc: 395.4,
        isc: 13.2,
        earth: 2.4,
        kw: 3.8,
      },
      sigData
    )

    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="rounded-3xl bg-white p-8 shadow-sm border border-[#E8E0D6] text-center space-y-5 my-8">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h2 className="text-2xl font-bold text-[#172747] font-['Plus_Jakarta_Sans']">
          Commissioning Completed!
        </h2>
        <p className="text-sm text-[#6E7787] max-w-sm mx-auto">
          Job <strong>{job.jobNo}</strong> has been signed and commissioned. Warranty has been activated, and completion report was filed into the enterprise ledger.
        </p>
        <button
          onClick={() => navigate('/technician/dashboard')}
          className="rounded-xl bg-[#172747] px-6 py-3 text-sm font-bold text-white hover:bg-[#011232]"
        >
          Return to Field Dashboard
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-5 pb-12">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(`/technician/checklist/${job.id}`)}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-[#E8E0D6] text-[#172747] hover:bg-[#F7F3EC]"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <span className="font-mono text-xs font-semibold text-[#6E7787]">{job.jobNo}</span>
          <h1 className="text-xl font-bold text-[#172747] font-['Plus_Jakarta_Sans']">Customer Handover & Signature</h1>
        </div>
      </div>

      {/* Handover Summary */}
      <div className="rounded-2xl bg-white p-5 shadow-sm border border-[#E8E0D6] space-y-3">
        <div className="flex items-center justify-between border-b border-[#F7F3EC] pb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#493027]">System Summary</span>
          <span className="font-bold text-[#172747] tabular-nums">{job.capacityKw} kW Microgrid</span>
        </div>
        <p className="text-xs text-[#6E7787]">Customer: <strong className="text-[#172747]">{job.customerName}</strong></p>
        <p className="text-xs text-[#6E7787]">Site: <strong className="text-[#172747]">{job.siteAddress}</strong></p>
        <p className="text-xs text-[#6E7787]">Lead Technician: <strong className="text-[#172747]">{job.leadTechnician}</strong></p>
      </div>

      {/* Customer Declaration */}
      <div className="rounded-2xl bg-[#F7F3EC] p-4 border border-[#E8E0D6] space-y-2">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={customerAgreed}
            onChange={(e) => setCustomerAgreed(e.target.checked)}
            className="h-5 w-5 rounded border-[#E8E0D6] text-[#172747] focus:ring-[#172747] mt-0.5"
          />
          <span className="text-xs text-[#172747] leading-relaxed">
            I, <strong>{job.customerName}</strong>, confirm that the solar PV installation has been completed, tested in my presence, power generation verified, and system handover documents received.
          </span>
        </label>
      </div>

      {/* HTML5 Canvas Signature Pad */}
      <div className="rounded-2xl bg-white p-5 shadow-sm border border-[#E8E0D6] space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-[#493027]">Customer Signature Pad</span>
          <button
            onClick={clearCanvas}
            className="flex items-center gap-1 text-xs text-[#6E7787] hover:text-[#172747]"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Clear
          </button>
        </div>

        <div className="border-2 border-dashed border-[#E8E0D6] rounded-xl bg-[#FAFAFA] overflow-hidden">
          <canvas
            ref={canvasRef}
            width={340}
            height={160}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="w-full h-40 touch-none cursor-crosshair bg-white"
          />
        </div>
        <p className="text-[11px] text-center text-[#6E7787]">Sign above with finger or stylus</p>
      </div>

      {/* Final Commissioning Button */}
      <button
        disabled={!hasSignature || !customerAgreed}
        onClick={handleFinalSignoff}
        className={`w-full flex items-center justify-center gap-2 rounded-xl py-4 text-sm font-bold transition-all shadow ${
          hasSignature && customerAgreed
            ? 'bg-emerald-600 text-white hover:bg-emerald-700'
            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
        }`}
      >
        <ShieldCheck className="h-5 w-5" />
        Commission System & Activate Warranties
      </button>
    </div>
  )
}
