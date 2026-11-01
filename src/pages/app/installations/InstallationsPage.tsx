import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Smartphone,
  CheckCircle2,
  Clock,
  Truck,
  ShieldCheck,
  Calendar,
  Layers,
  Zap,
  Gauge,
  UserCheck,
  ChevronDown,
  ChevronRight,
  Filter,
  Search,
  AlertCircle,
  FileText,
  PenTool,
  Check,
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { StatusChip } from '@/components/ui/StatusChip'
import { useSolarStore, InstallationJob } from '@/lib/store/solarStore'
import { cn } from '@/lib/utils'

const INSTALLATION_MILESTONES = [
  { step: 1, title: 'Site Survey & Rooftop Feasibility', defaultActor: 'Mateo Kowalski (Field Surveyor)', phase: 'Engineering' },
  { step: 2, title: 'Feasibility Sign-Off & System Sizing', defaultActor: 'Marcus Vance (Director / Chief Engineer)', phase: 'Engineering' },
  { step: 3, title: 'BOM Allocation & Digital Passport Ingestion', defaultActor: 'Vikram Singh (Warehouse Mgr)', phase: 'Supply Chain' },
  { step: 4, title: 'Warehouse Staging & Dispatch Out', defaultActor: 'Warehouse Logistics Team', phase: 'Supply Chain' },
  { step: 5, title: 'On-Site Hardware Delivery (Warranty Activated)', defaultActor: 'Logistics Courier / Field Crew', phase: 'Field Ingress' },
  { step: 6, title: 'Rooftop Civil Structure & Rail Rigging', defaultActor: 'Arjun Mehta (Senior Rigging Tech)', phase: 'Rooftop Civil' },
  { step: 7, title: 'PV Module Cabling & Inverter Interconnect', defaultActor: 'Karan Sharma (Lead Electrician)', phase: 'Electrical DC/AC' },
  { step: 8, title: 'Safety Megger & Earthing Resistance (<5Ω)', defaultActor: 'Field QA Engineer', phase: 'Testing & QA' },
  { step: 9, title: 'Discom Net-Meter Grid Synchronisation', defaultActor: 'BESCOM / Discom Inspector', phase: 'Grid Commissioning' },
  { step: 10, title: 'Customer Handover & Digital Acceptance', defaultActor: 'Customer & Operations Lead', phase: 'Handover & Sign-Off' },
]

export function InstallationsPage() {
  const {
    installations,
    updateInstallationMilestone,
    completeDelivery,
    completeInstallation,
  } = useSolarStore()

  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'timeline' | 'table'>('timeline')
  const [expandedJobs, setExpandedJobs] = useState<Record<string, boolean>>({
    [installations[0]?.id || '']: true,
  })

  // Sign-off Modal
  const [signingJob, setSigningJob] = useState<InstallationJob | null>(null)
  const [signerName, setSignerName] = useState('')
  const [vocReading, setVocReading] = useState(380)
  const [iscReading, setIscReading] = useState(9.8)
  const [earthReading, setEarthReading] = useState(2.8)
  const [kwReading, setKwReading] = useState(3.2)

  const toggleJob = (id: string) => {
    setExpandedJobs((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const toggleAll = (expand: boolean) => {
    const updated: Record<string, boolean> = {}
    installations.forEach((j) => {
      updated[j.id] = expand
    })
    setExpandedJobs(updated)
  }

  const filteredJobs = installations.filter((j) => {
    const matchesSearch =
      j.jobNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.leadTechnician.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.siteAddress.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || j.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getJobCurrentStage = (job: InstallationJob): number => {
    if (job.status === 'commissioned' || job.status === 'completed') return 10
    if (job.status === 'testing') return 8
    if (job.status === 'in_progress') return 7
    if (job.status === 'en_route') return 5
    return 4
  }

  const handleDeliveryConfirm = (job: InstallationJob) => {
    const today = new Date().toISOString().split('T')[0]
    completeDelivery(job.orderId, today)
    updateInstallationMilestone(job.id, 6, 'completed')
    alert(`Hardware Delivery Confirmed for Job ${job.jobNo}!\nWarranty Clock has officially commenced on ${today}.`)
  }

  const handleOpenSignOff = (job: InstallationJob) => {
    setSigningJob(job)
    setSignerName(job.customerName)
    setVocReading(job.testedVocVolts || 380)
    setIscReading(job.testedIscAmps || 9.8)
    setEarthReading(job.testedEarthResistanceOhms || 2.8)
    setKwReading(job.solarGenerationKwReading || job.capacityKw * 0.95)
  }

  const handleConfirmSignOff = (e: React.FormEvent) => {
    e.preventDefault()
    if (!signingJob || !signerName.trim()) return

    completeInstallation(
      signingJob.id,
      {
        mountingStructureTorqueVerified: true,
        isolationResistanceMeggerTestPassed: true,
        vocAndIscStringVerified: true,
        earthingResistanceLessThan5Ohms: earthReading < 5,
        inverterAntiIslandingFunctional: true,
      },
      {
        voc: Number(vocReading),
        isc: Number(iscReading),
        earth: Number(earthReading),
        kw: Number(kwReading),
      },
      signerName.trim()
    )

    updateInstallationMilestone(signingJob.id, 10, 'completed')
    alert(`Commissioning Handover Recorded!\nCustomer: ${signerName}\nEarth Resistance: ${earthReading}Ω (PASS)\nGeneration: ${kwReading} kW`)
    setSigningJob(null)
  }

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E8E0D6]">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#827B73] uppercase tracking-wider">
            <span>Crew Operations & Field Commissioning</span>
            <span>•</span>
            <span className="text-[#172747]">10-Milestone End-to-End Workflow</span>
          </div>
          <h1 className="font-headline text-2xl font-bold tracking-tight text-[#172747] mt-0.5">
            Solar Installation Management & Warranty Activation
          </h1>
          <p className="text-xs sm:text-sm text-[#827B73] mt-0.5">
            Track real-time progress across all 10 installation stages from engineering sign-off to customer handover.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/technician">
            <Button variant="outline" className="border-[#172747] text-[#172747] hover:bg-[#172747]/5 text-xs font-semibold">
              <Smartphone className="h-4 w-4 mr-1.5 text-[#172747]" />
              Field Technician Mode
            </Button>
          </Link>
          <Link to="/app/warranties">
            <Button className="bg-[#172747] hover:bg-[#1E345E] text-white text-xs font-semibold shadow-warm-sm">
              <ShieldCheck className="h-4 w-4 mr-1.5" />
              Warranty Registry
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-white border-[#E8E0D6] shadow-warm-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-[#827B73] uppercase tracking-wider">Total Crew Jobs</p>
              <h3 className="text-2xl font-bold text-[#172747] mt-0.5">{installations.length}</h3>
              <p className="text-[11px] text-[#827B73] mt-0.5">15 certified installers</p>
            </div>
            <div className="p-2.5 rounded-xl bg-[#172747]/10 text-[#172747]">
              <Layers className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-[#E8E0D6] shadow-warm-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-[#827B73] uppercase tracking-wider">Active Field In-Progress</p>
              <h3 className="text-2xl font-bold text-[#B68B55] mt-0.5">
                {installations.filter((j) => j.status === 'in_progress').length}
              </h3>
              <p className="text-[11px] text-[#B68B55] mt-0.5">Civil & Electrical rigging</p>
            </div>
            <div className="p-2.5 rounded-xl bg-[#B68B55]/10 text-[#B68B55]">
              <Zap className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-[#E8E0D6] shadow-warm-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-[#827B73] uppercase tracking-wider">Commissioned & Handed Over</p>
              <h3 className="text-2xl font-bold text-[#2D5A43] mt-0.5">
                {installations.filter((j) => j.status === 'commissioned' || j.status === 'completed').length}
              </h3>
              <p className="text-[11px] text-[#2D5A43] mt-0.5">Signed & generation active</p>
            </div>
            <div className="p-2.5 rounded-xl bg-[#2D5A43]/10 text-[#2D5A43]">
              <CheckCircle2 className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-[#E8E0D6] shadow-warm-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-[#827B73] uppercase tracking-wider">Warranty Clocks Active</p>
              <h3 className="text-2xl font-bold text-[#172747] mt-0.5">
                {installations.filter((j) => j.status === 'completed' || j.status === 'in_progress').length}
              </h3>
              <p className="text-[11px] text-[#2D5A43] mt-0.5">Triggered upon delivery</p>
            </div>
            <div className="p-2.5 rounded-xl bg-[#172747]/10 text-[#172747]">
              <ShieldCheck className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter and View Toggle Controls */}
      <div className="bg-white p-4 rounded-xl border border-[#E8E0D6] shadow-warm-sm flex flex-col md:flex-row items-center gap-3 justify-between">
        <div className="relative flex-1 w-full md:max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#827B73]" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Job ID, customer, technician, address..."
            className="pl-9 h-10 border-[#E8E0D6] text-xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 px-3 rounded-lg border border-[#E8E0D6] bg-white text-xs font-medium text-[#292522] focus:border-[#172747]"
          >
            <option value="all">All Installation Statuses</option>
            <option value="assigned">Assigned / In Staging</option>
            <option value="en_route">En Route / Delivery Pending</option>
            <option value="in_progress">Field In Progress</option>
            <option value="testing">Testing & Megger QA</option>
            <option value="commissioned">Commissioned & Closed</option>
          </select>

          {/* Expand/Collapse All Buttons */}
          <div className="flex items-center gap-1 border border-[#E8E0D6] rounded-lg p-0.5 bg-[#F7F3EC]">
            <button
              onClick={() => toggleAll(true)}
              className="px-2.5 py-1 text-xs font-medium text-[#292522] hover:bg-white rounded transition-colors"
            >
              Expand All
            </button>
            <button
              onClick={() => toggleAll(false)}
              className="px-2.5 py-1 text-xs font-medium text-[#827B73] hover:bg-white hover:text-[#292522] rounded transition-colors"
            >
              Collapse
            </button>
          </div>
        </div>
      </div>

      {/* Main 10-Milestone Ticket Cards */}
      <div className="space-y-4">
        {filteredJobs.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-xl border border-dashed border-[#E8E0D6]">
            <AlertCircle className="h-8 w-8 text-[#827B73] mx-auto mb-2" />
            <h3 className="font-headline text-base font-bold text-[#292522]">No installation jobs found</h3>
            <p className="text-xs text-[#827B73] mt-1">Adjust search keywords or filters to see jobs.</p>
          </div>
        ) : (
          filteredJobs.map((job) => {
            const isExpanded = expandedJobs[job.id] !== false
            const currentStage = getJobCurrentStage(job)

            return (
              <Card
                key={job.id}
                className="bg-white border-[#E8E0D6] shadow-warm-sm overflow-hidden transition-all hover:border-[#172747]/40"
              >
                {/* Ticket Header Banner */}
                <div
                  onClick={() => toggleJob(job.id)}
                  className="p-5 bg-gradient-to-r from-[#FAF7F2] to-white border-b border-[#E8E0D6] cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 select-none"
                >
                  <div className="flex items-start sm:items-center gap-3">
                    <button
                      type="button"
                      className="p-1 rounded-md text-[#827B73] hover:text-[#172747] hover:bg-[#EAE1DC] mt-0.5 sm:mt-0"
                    >
                      {isExpanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                    </button>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#172747] text-white">
                          {job.jobNo}
                        </span>
                        <span className="font-mono text-[11px] text-[#827B73] bg-[#E8E0D6]/60 px-1.5 py-0.2 rounded font-semibold">
                          Order: {job.orderId}
                        </span>
                        <StatusChip status={job.status} />
                        {job.customerSignature && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#2D5A43] bg-[#2D5A43]/10 px-2 py-0.5 rounded-full border border-[#2D5A43]/20">
                            <CheckCircle2 className="h-3 w-3" /> Signed & Handed Over
                          </span>
                        )}
                      </div>

                      <h3 className="font-headline text-base font-bold text-[#292522] mt-1.5">
                        {job.customerName}
                      </h3>
                      <p className="text-xs text-[#827B73]">{job.siteAddress}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs">
                    <div className="text-left md:text-right">
                      <span className="text-[10px] uppercase font-bold text-[#827B73] block">System Capacity</span>
                      <span className="font-bold text-[#172747] text-sm">{job.capacityKw} kW Solar Array</span>
                    </div>

                    <div className="text-left md:text-right">
                      <span className="text-[10px] uppercase font-bold text-[#827B73] block">Crew Lead</span>
                      <span className="font-semibold text-[#292522]">{job.leadTechnician}</span>
                    </div>

                    <div className="text-left md:text-right">
                      <span className="text-[10px] uppercase font-bold text-[#827B73] block">Scheduled Date</span>
                      <span className="font-mono font-medium text-[#292522]">{job.scheduledDate}</span>
                    </div>
                  </div>
                </div>

                {/* Collapsible Content */}
                {isExpanded && (
                  <CardContent className="p-6 space-y-6">
                    {/* Action Bar inside card */}
                    <div className="p-3.5 rounded-xl bg-[#F7F3EC] border border-[#E8E0D6] flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[20px] text-[#B68B55]">
                          timeline
                        </span>
                        <span className="text-xs font-bold text-[#172747] uppercase tracking-wide">
                          Progress: Milestone {currentStage} of 10 ({Math.round((currentStage / 10) * 100)}%)
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {currentStage < 6 && (
                          <Button
                            onClick={() => handleDeliveryConfirm(job)}
                            size="sm"
                            className="bg-[#2D5A43] hover:bg-[#234735] text-white text-xs font-semibold flex items-center gap-1.5"
                          >
                            <Truck className="h-3.5 w-3.5" />
                            Confirm On-Site Delivery (Start Warranty)
                          </Button>
                        )}

                        {job.status !== 'commissioned' && job.status !== 'completed' && (
                          <Button
                            onClick={() => handleOpenSignOff(job)}
                            size="sm"
                            className="bg-[#172747] hover:bg-[#1E345E] text-white text-xs font-semibold flex items-center gap-1.5"
                          >
                            <PenTool className="h-3.5 w-3.5" />
                            Commissioning Sign-Off & Handover
                          </Button>
                        )}

                        <Link to="/technician">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-[#172747] text-[#172747] hover:bg-[#172747]/5 text-xs font-semibold"
                          >
                            <Smartphone className="h-3.5 w-3.5 mr-1" />
                            Open in Field App
                          </Button>
                        </Link>
                      </div>
                    </div>

                    {/* 10-Milestone Vertical Connected Timeline */}
                    <div>
                      <h4 className="font-headline text-xs font-bold text-[#827B73] uppercase tracking-wider mb-4">
                        10-Milestone Installation Timeline
                      </h4>

                      <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E8E0D6]">
                        {INSTALLATION_MILESTONES.map((ms) => {
                          const isCompleted = ms.step < currentStage || job.status === 'commissioned' || job.status === 'completed'
                          const isCurrent = ms.step === currentStage && job.status !== 'commissioned' && job.status !== 'completed'
                          const isPending = ms.step > currentStage && job.status !== 'commissioned' && job.status !== 'completed'

                          return (
                            <div key={ms.step} className="relative flex items-start gap-3">
                              {/* Dot */}
                              <div
                                className={cn(
                                  'absolute -left-6 top-0.5 flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all',
                                  isCompleted
                                    ? 'bg-[#2D5A43] border-[#2D5A43] text-white'
                                    : isCurrent
                                    ? 'bg-[#B68B55] border-[#B68B55] text-white animate-pulse'
                                    : 'bg-white border-[#E8E0D6] text-[#827B73]'
                                )}
                              >
                                {isCompleted ? (
                                  <Check className="h-3.5 w-3.5 stroke-[3]" />
                                ) : (
                                  <span className="text-[10px] font-bold">{ms.step}</span>
                                )}
                              </div>

                              {/* Milestone Content Box */}
                              <div
                                className={cn(
                                  'flex-1 p-3.5 rounded-xl border transition-all text-xs',
                                  isCurrent
                                    ? 'bg-[#FFFDF9] border-[#B68B55] shadow-xs'
                                    : isCompleted
                                    ? 'bg-[#FBF9F5] border-[#E8E0D6]/80'
                                    : 'bg-white border-dashed border-[#E8E0D6] opacity-75'
                                )}
                              >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-[#292522] text-xs">
                                      {ms.step}. {ms.title}
                                    </span>
                                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#E8E0D6]/60 text-[#827B73] font-semibold">
                                      {ms.phase}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    {isCompleted && (
                                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#2D5A43]">
                                        <CheckCircle2 className="h-3.5 w-3.5" /> Completed
                                      </span>
                                    )}
                                    {isCurrent && (
                                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#B68B55]">
                                        <Clock className="h-3.5 w-3.5" /> Currently Active
                                      </span>
                                    )}
                                    {isPending && (
                                      <span className="text-[11px] text-[#827B73]">Pending</span>
                                    )}
                                  </div>
                                </div>

                                <div className="mt-1.5 flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#827B73]">
                                  <span>
                                    Action by: <strong className="text-[#172747]">{ms.defaultActor}</strong>
                                  </span>
                                  {ms.step === 5 && (
                                    <span className="text-[#2D5A43] font-semibold">
                                      ★ Triggers official warranty clock
                                    </span>
                                  )}
                                  {ms.step === 10 && job.customerSignature && (
                                    <span className="text-[#2D5A43] font-semibold">
                                      ★ Signed: &quot;{job.customerSignature}&quot;
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* Commissioning Test Parameters & Checklist */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[#E8E0D6]">
                      {/* Safety Checklist */}
                      <div className="p-4 rounded-xl border border-[#E8E0D6] bg-white space-y-2.5">
                        <span className="font-headline text-xs font-bold text-[#292522] uppercase tracking-wider block">
                          Field Safety & Structural Checklist
                        </span>
                        <div className="space-y-1.5 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="text-[#827B73]">Mounting structure torque checked:</span>
                            {job.checklist.mountingStructureTorqueVerified ? (
                              <span className="text-[#2D5A43] font-semibold flex items-center gap-1">
                                <CheckCircle2 className="h-3.5 w-3.5" /> Verified Pass
                              </span>
                            ) : (
                              <span className="text-[#827B73]">Pending Check</span>
                            )}
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[#827B73]">Voc & Isc strings within specs:</span>
                            {job.checklist.vocAndIscStringVerified ? (
                              <span className="text-[#2D5A43] font-semibold flex items-center gap-1">
                                <CheckCircle2 className="h-3.5 w-3.5" /> Verified Pass
                              </span>
                            ) : (
                              <span className="text-[#827B73]">Pending Check</span>
                            )}
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[#827B73]">Earthing resistance &lt; 5 Ohms:</span>
                            {job.checklist.earthingResistanceLessThan5Ohms ? (
                              <span className="text-[#2D5A43] font-semibold flex items-center gap-1">
                                <CheckCircle2 className="h-3.5 w-3.5" /> Verified Pass
                              </span>
                            ) : (
                              <span className="text-[#827B73]">Pending Check</span>
                            )}
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[#827B73]">Inverter anti-islanding functional:</span>
                            {job.checklist.inverterAntiIslandingFunctional ? (
                              <span className="text-[#2D5A43] font-semibold flex items-center gap-1">
                                <CheckCircle2 className="h-3.5 w-3.5" /> Verified Pass
                              </span>
                            ) : (
                              <span className="text-[#827B73]">Pending Check</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Measured Electrical Readings */}
                      <div className="p-4 rounded-xl border border-[#E8E0D6] bg-white space-y-2.5">
                        <span className="font-headline text-xs font-bold text-[#292522] uppercase tracking-wider block">
                          Calibrated Commissioning Readings
                        </span>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="p-2.5 rounded-lg bg-[#F7F3EC]">
                            <span className="text-[10px] text-[#827B73] uppercase font-bold block">Voc Voltage</span>
                            <span className="font-mono text-sm font-bold text-[#172747]">
                              {job.testedVocVolts || 380} V DC
                            </span>
                          </div>
                          <div className="p-2.5 rounded-lg bg-[#F7F3EC]">
                            <span className="text-[10px] text-[#827B73] uppercase font-bold block">Isc Amperage</span>
                            <span className="font-mono text-sm font-bold text-[#172747]">
                              {job.testedIscAmps || 9.8} A
                            </span>
                          </div>
                          <div className="p-2.5 rounded-lg bg-[#F7F3EC]">
                            <span className="text-[10px] text-[#827B73] uppercase font-bold block">Earth Resistance</span>
                            <span className="font-mono text-sm font-bold text-[#2D5A43]">
                              {job.testedEarthResistanceOhms || 2.8} Ω (&lt;5Ω Pass)
                            </span>
                          </div>
                          <div className="p-2.5 rounded-lg bg-[#F7F3EC]">
                            <span className="text-[10px] text-[#827B73] uppercase font-bold block">Generation Test</span>
                            <span className="font-mono text-sm font-bold text-[#2D5A43]">
                              {job.solarGenerationKwReading || (job.capacityKw * 0.95).toFixed(1)} kW Live
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            )
          })
        )}
      </div>

      {/* Commissioning & Handover Modal */}
      {signingJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#302019]/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-white rounded-2xl border border-[#E8E0D6] shadow-warm-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E0D6] bg-[#F7F3EC]">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-[#172747] text-white">
                  <PenTool className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-headline text-base font-bold text-[#292522]">
                    Customer Commissioning & Handover
                  </h3>
                  <p className="text-xs text-[#827B73]">Job {signingJob.jobNo} — {signingJob.customerName}</p>
                </div>
              </div>
              <button
                onClick={() => setSigningJob(null)}
                className="p-1 rounded text-[#827B73] hover:text-[#292522]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmSignOff} className="p-6 overflow-y-auto space-y-4">
              <div className="p-3 rounded-xl bg-[#F7F3EC] border border-[#E8E0D6] text-xs space-y-1">
                <span className="font-bold text-[#172747] uppercase tracking-wide text-[10px]">
                  Site Electrical Inspection Summary
                </span>
                <p className="text-[#827B73]">
                  All DC strings, inverter islanding protection, and earth pit impedance verified by lead technician.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#292522] uppercase tracking-wider block mb-1">
                    Open Circuit Voc (V)
                  </label>
                  <Input
                    type="number"
                    value={vocReading}
                    onChange={(e) => setVocReading(Number(e.target.value))}
                    required
                    className="font-mono text-xs border-[#E8E0D6]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#292522] uppercase tracking-wider block mb-1">
                    Short Circuit Isc (A)
                  </label>
                  <Input
                    type="number"
                    step="0.1"
                    value={iscReading}
                    onChange={(e) => setIscReading(Number(e.target.value))}
                    required
                    className="font-mono text-xs border-[#E8E0D6]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#292522] uppercase tracking-wider block mb-1">
                    Earth Resistance (&lt;5Ω)
                  </label>
                  <Input
                    type="number"
                    step="0.1"
                    value={earthReading}
                    onChange={(e) => setEarthReading(Number(e.target.value))}
                    required
                    className="font-mono text-xs border-[#E8E0D6]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#292522] uppercase tracking-wider block mb-1">
                    Solar Generation (kW)
                  </label>
                  <Input
                    type="number"
                    step="0.1"
                    value={kwReading}
                    onChange={(e) => setKwReading(Number(e.target.value))}
                    required
                    className="font-mono text-xs border-[#E8E0D6]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#292522] uppercase tracking-wider block mb-1">
                  Customer Acceptance Signatory Name *
                </label>
                <Input
                  value={signerName}
                  onChange={(e) => setSignerName(e.target.value)}
                  placeholder="e.g. Anand Kumar Sharma"
                  required
                  className="font-serif italic text-sm font-semibold border-[#E8E0D6] focus:border-[#172747]"
                />
                <span className="text-[10px] text-[#827B73] mt-1 block">
                  Legally confirms physical system delivery, successful generation test, and warranty activation.
                </span>
              </div>

              <div className="pt-4 border-t border-[#E8E0D6] flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSigningJob(null)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-[#2D5A43] hover:bg-[#234735] text-white text-xs font-semibold flex items-center gap-1.5"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Sign Off & Complete Handover
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
