import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Compass,
  Ruler,
  Zap,
  Camera,
  FileCheck,
  ShieldAlert,
  Check,
  ChevronDown,
  ChevronUp,
  Search,
  MapPin,
  User,
  Calendar,
  Lock,
  Copy,
  Eye,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Plus,
  X,
  Layers,
  Sparkles
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatusChip } from '@/components/ui/StatusChip'
import { useSolarStore, SiteSurvey } from '@/lib/store/solarStore'

type SurveyFilterStatus = 'all' | 'pending_approval' | 'approved' | 'in_progress' | 'scheduled' | 'revisit_required' | 'rejected'

export function SurveysPage() {
  const { surveys, approveSurvey, rejectSurvey, revisitSurvey, startInspection } = useSolarStore()
  const navigate = useNavigate()

  // State management
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<SurveyFilterStatus>('all')
  const [engineerFilter, setEngineerFilter] = useState<string>('all')
  const [expandedTickets, setExpandedTickets] = useState<Record<string, boolean>>(() => {
    // Default: expand first ticket or any pending approval ticket
    const initial: Record<string, boolean> = {}
    surveys.forEach((s, idx) => {
      initial[s.id] = idx === 0 || s.status === 'pending_approval'
    })
    return initial
  })

  // Modals
  const [rejectModalOpen, setRejectModalOpen] = useState(false)
  const [revisitModalOpen, setRevisitModalOpen] = useState(false)
  const [targetSurveyId, setTargetSurveyId] = useState<string | null>(null)
  const [actionReason, setActionReason] = useState('')
  const [activePhotoModal, setActivePhotoModal] = useState<{ src: string; title: string; surveyNo: string } | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  // Copy handler
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  // Toggle ticket expand/collapse
  const toggleTicket = (id: string) => {
    setExpandedTickets((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  // Expand / Collapse all
  const toggleAll = (expand: boolean) => {
    const updated: Record<string, boolean> = {}
    surveys.forEach((s) => {
      updated[s.id] = expand
    })
    setExpandedTickets(updated)
  }

  // Engineering Approval Actions
  const handleApprove = (surveyId: string) => {
    approveSurvey(surveyId, 'Marcus Vance (Director / Chief Engineer)')
  }

  const openRejectModal = (surveyId: string) => {
    setTargetSurveyId(surveyId)
    setActionReason('')
    setRejectModalOpen(true)
  }

  const handleConfirmReject = () => {
    if (!targetSurveyId || !actionReason.trim()) return
    rejectSurvey(targetSurveyId, actionReason)
    setRejectModalOpen(false)
    setTargetSurveyId(null)
    setActionReason('')
  }

  const openRevisitModal = (surveyId: string) => {
    setTargetSurveyId(surveyId)
    setActionReason('')
    setRevisitModalOpen(true)
  }

  const handleConfirmRevisit = () => {
    if (!targetSurveyId || !actionReason.trim()) return
    revisitSurvey(targetSurveyId, actionReason)
    setRevisitModalOpen(false)
    setTargetSurveyId(null)
    setActionReason('')
  }

  // List of distinct engineers for filter dropdown
  const engineersList = useMemo(() => {
    const names = new Set(surveys.map((s) => s.technicianName).filter(Boolean))
    return Array.from(names)
  }, [surveys])

  // Filtered surveys
  const filteredSurveys = useMemo(() => {
    return surveys.filter((s) => {
      // Status filter
      if (statusFilter !== 'all' && s.status !== statusFilter) return false

      // Engineer filter
      if (engineerFilter !== 'all' && s.technicianName !== engineerFilter) return false

      // Search query
      const q = searchQuery.toLowerCase().trim()
      if (!q) return true

      return (
        s.surveyNo.toLowerCase().includes(q) ||
        s.customerName.toLowerCase().includes(q) ||
        s.siteAddress.toLowerCase().includes(q) ||
        s.technicianName.toLowerCase().includes(q)
      )
    })
  }, [surveys, statusFilter, engineerFilter, searchQuery])

  // Counts for tabs
  const counts = useMemo(() => {
    return {
      all: surveys.length,
      pending_approval: surveys.filter((s) => s.status === 'pending_approval').length,
      approved: surveys.filter((s) => s.status === 'approved').length,
      in_progress: surveys.filter((s) => s.status === 'in_progress').length,
      scheduled: surveys.filter((s) => s.status === 'scheduled').length,
      revisit_required: surveys.filter((s) => s.status === 'revisit_required').length,
      rejected: surveys.filter((s) => s.status === 'rejected').length,
    }
  }, [surveys])

  // Helper to determine stage count and current stage name
  const getStageSummary = (status: SiteSurvey['status']) => {
    switch (status) {
      case 'scheduled':
        return { stageNumber: 2, totalStages: 8, label: 'Stage 2 of 8 • Site Survey Scheduled', next: 'On-site Physical Walkthrough' }
      case 'in_progress':
        return { stageNumber: 4, totalStages: 8, label: 'Stage 4 of 8 • Physical Inspection Underway', next: 'Submit Rooftop Geometry & Photos' }
      case 'pending_approval':
        return { stageNumber: 6, totalStages: 8, label: 'Stage 6 of 8 • Awaiting Feasibility Sign-Off', next: 'Executive Engineering Sign-Off' }
      case 'revisit_required':
        return { stageNumber: 5, totalStages: 8, label: 'Stage 5 of 8 • Field Revisit Required', next: 'Technician Re-survey with Drone Photogrammetry' }
      case 'rejected':
        return { stageNumber: 7, totalStages: 8, label: 'Stage 7 of 8 • Feasibility Rejected', next: 'Commercial Quotation Permanently Locked' }
      case 'approved':
      default:
        return { stageNumber: 8, totalStages: 8, label: 'Stage 8 of 8 • Feasibility Approved & Quotation Unlocked', next: 'Commercial Quotation & BOM Matrix' }
    }
  }

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#827B73] uppercase tracking-wider">
            <span>Engineering & Feasibility</span>
            <span>•</span>
            <span className="text-[#2D5A43] font-bold">Mandatory Commercial Gatekeeper</span>
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-[#172747]">
            Site Surveys & Engineering Feasibility
          </h1>
          <p className="text-xs sm:text-sm text-[#827B73] mt-0.5 max-w-2xl">
            Ticket-based lifecycle progress timeline tracking physical rooftop azimuth, structural load, shadow assessment, and cable run validation.
          </p>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => toggleAll(true)}
            className="text-xs h-8 border-[#E8E0D6] text-[#172747] hover:bg-[#F7F3EC]"
          >
            Expand All
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => toggleAll(false)}
            className="text-xs h-8 border-[#E8E0D6] text-[#172747] hover:bg-[#F7F3EC]"
          >
            Collapse All
          </Button>
        </div>
      </div>

      {/* 2. Mandatory Gatekeeper Rule Banner */}
      <div className="p-4 rounded-2xl bg-[#F5ECE7] border border-[#E8E0D6] flex items-start gap-3.5 shadow-sm">
        <div className="p-2.5 rounded-xl bg-[#172747] text-[#FFDDB7] shrink-0 mt-0.5 shadow-sm">
          <ShieldAlert className="h-5 w-5" />
        </div>
        <div className="text-xs text-[#292522] leading-relaxed">
          <strong className="text-[#172747] uppercase font-bold tracking-wide flex items-center gap-1.5">
            <Lock className="h-3.5 w-3.5 text-[#E87A5D]" />
            Strict Business Rule Enforced by Architecture:
          </strong>
          <p className="mt-0.5 text-[#827B73]">
            A final commercial quotation and sales contract <strong>cannot be generated or issued</strong> before
            the linked site survey has been officially approved by an authorized engineer. Unapproved sites (Pending, Scheduled, or Rejected) are
            strictly prevented from entering the commercial pricing pipeline.
          </p>
        </div>
      </div>

      {/* 3. Executive Summary KPI Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="rounded-xl bg-white p-3.5 border border-[#E8E0D6] shadow-sm">
          <span className="text-[10px] uppercase font-bold text-[#827B73] block">Total Surveys</span>
          <span className="text-xl font-bold text-[#172747] font-mono mt-0.5 block">{counts.all} Tickets</span>
        </div>
        <div className="rounded-xl bg-amber-50/60 p-3.5 border border-amber-200/60 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-amber-800 block">Pending Sign-off</span>
          <span className="text-xl font-bold text-amber-900 font-mono mt-0.5 block">{counts.pending_approval} Awaiting</span>
        </div>
        <div className="rounded-xl bg-emerald-50/60 p-3.5 border border-emerald-200/60 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-emerald-800 block">Feasibility Approved</span>
          <span className="text-xl font-bold text-emerald-900 font-mono mt-0.5 block">{counts.approved} Ready</span>
        </div>
        <div className="rounded-xl bg-blue-50/60 p-3.5 border border-blue-200/60 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-blue-800 block">In Inspection</span>
          <span className="text-xl font-bold text-blue-900 font-mono mt-0.5 block">{counts.in_progress} Active</span>
        </div>
        <div className="rounded-xl bg-[#FAF7F2] p-3.5 border border-[#E8E0D6] shadow-sm col-span-2 sm:col-span-1">
          <span className="text-[10px] uppercase font-bold text-[#827B73] block">Revisit / Rejected</span>
          <span className="text-xl font-bold text-[#9E3A3A] font-mono mt-0.5 block">{counts.revisit_required + counts.rejected} Blocked</span>
        </div>
      </div>

      {/* 4. Filter & Search Controls */}
      <div className="rounded-2xl bg-white p-4 shadow-sm border border-[#E8E0D6] space-y-3">
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-[#F0EAE1] pb-3">
          {(
            [
              { id: 'all', label: 'All Surveys', count: counts.all },
              { id: 'pending_approval', label: 'Pending Approval', count: counts.pending_approval },
              { id: 'approved', label: 'Approved', count: counts.approved },
              { id: 'in_progress', label: 'In Progress', count: counts.in_progress },
              { id: 'scheduled', label: 'Scheduled', count: counts.scheduled },
              { id: 'revisit_required', label: 'Revisit Required', count: counts.revisit_required },
              { id: 'rejected', label: 'Rejected', count: counts.rejected },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all flex items-center gap-1.5 ${
                statusFilter === tab.id
                  ? 'bg-[#172747] text-white shadow-sm'
                  : 'bg-[#F7F3EC] text-[#493027] hover:bg-[#E8E0D6]'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  statusFilter === tab.id
                    ? 'bg-white/20 text-[#FFDDB7]'
                    : 'bg-[#E8E0D6] text-[#493027]'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search & Inspector Select */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8C7A6B]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search survey ID, customer, address..."
              className="w-full rounded-xl border border-[#E8E0D6] bg-[#F7F3EC]/50 pl-9 pr-3 py-1.5 text-xs text-[#172747] placeholder-[#8C7A6B] focus:border-[#172747] focus:outline-none focus:ring-1 focus:ring-[#172747]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#8C7A6B] hover:text-[#172747]"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-[#827B73] whitespace-nowrap">Inspector:</span>
            <select
              value={engineerFilter}
              onChange={(e) => setEngineerFilter(e.target.value)}
              className="rounded-xl border border-[#E8E0D6] bg-[#F7F3EC]/50 px-3 py-1.5 text-xs text-[#172747] focus:border-[#172747] focus:outline-none"
            >
              <option value="all">All Survey Engineers ({engineersList.length})</option>
              {engineersList.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 5. Vertically Stacked Survey Ticket Cards */}
      <div className="space-y-5">
        {filteredSurveys.length === 0 ? (
          <div className="rounded-2xl bg-white p-12 text-center border border-[#E8E0D6] shadow-sm">
            <Layers className="mx-auto h-12 w-12 text-[#8C7A6B]/50" />
            <h3 className="mt-3 text-base font-bold text-[#172747]">No Survey Tickets Matched</h3>
            <p className="mt-1 text-xs text-[#6E7787]">
              Try adjusting your search criteria or resetting filters to view active engineering files.
            </p>
          </div>
        ) : (
          filteredSurveys.map((survey) => {
            const isExpanded = !!expandedTickets[survey.id]
            const summary = getStageSummary(survey.status)

            return (
              <Card
                key={survey.id}
                className="overflow-hidden border border-[#E8E0D6] shadow-sm hover:shadow-md transition-shadow bg-white rounded-2xl"
              >
                {/* TICKET CARD HEADER */}
                <CardHeader
                  className="bg-[#FAF7F2] p-5 border-b border-[#E8E0D6] cursor-pointer select-none"
                  onClick={() => toggleTicket(survey.id)}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Left: ID, Customer, Address */}
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="font-mono text-xs font-bold text-[#172747] bg-[#F0EAE1] px-2.5 py-1 rounded-md border border-[#E0D6CA]">
                          {survey.surveyNo}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleCopy(survey.surveyNo, survey.id)
                          }}
                          className="text-[#8C7A6B] hover:text-[#172747] transition-colors"
                          title="Copy Survey ID"
                        >
                          {copiedId === survey.id ? (
                            <Check className="h-3.5 w-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                        <StatusChip status={survey.status} />
                        <span className="text-[11px] font-semibold text-[#827B73]">
                          {summary.label}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-[#172747] font-['Plus_Jakarta_Sans'] flex items-center gap-2">
                        {survey.customerName}
                      </h3>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-[#827B73]">
                        <span className="flex items-center gap-1 truncate max-w-md">
                          <MapPin className="h-3.5 w-3.5 text-[#E87A5D] shrink-0" />
                          {survey.siteAddress}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="h-3.5 w-3.5 text-[#172747] shrink-0" />
                          Inspector: <strong className="text-[#292522]">{survey.technicianName}</strong>
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-[#8C7A6B] shrink-0" />
                          Date: <strong className="text-[#292522]">{survey.scheduledDate}</strong>
                        </span>
                      </div>
                    </div>

                    {/* Right: Progress Summary & Expand Button */}
                    <div className="flex items-center gap-4 self-end lg:self-center">
                      <div className="text-right hidden sm:block">
                        <span className="text-[11px] font-bold text-[#827B73] uppercase tracking-wider block">
                          Next Action
                        </span>
                        <span className="text-xs font-semibold text-[#172747] block max-w-xs truncate">
                          {summary.next}
                        </span>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleTicket(survey.id)
                        }}
                        className="h-9 px-3 rounded-xl border-[#E8E0D6] bg-white text-[#172747] hover:bg-[#F7F3EC] flex items-center gap-1 text-xs font-bold"
                      >
                        {isExpanded ? (
                          <>
                            <span>Collapse</span>
                            <ChevronUp className="h-4 w-4 ml-0.5" />
                          </>
                        ) : (
                          <>
                            <span>View Timeline</span>
                            <ChevronDown className="h-4 w-4 ml-0.5" />
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Collapsed Preview Strip */}
                  {!isExpanded && (
                    <div className="mt-3 pt-3 border-t border-[#E8E0D6]/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-3 text-[#6E7787]">
                        <span className="font-semibold text-[#292522]">
                          Rooftop Azimuth: {survey.roofDirection} @ {survey.roofTiltAngle}°
                        </span>
                        <span>•</span>
                        <span className="font-bold text-[#2D5A43]">
                          {survey.shadowFreeAreaSqFt} sq ft shadow-free
                        </span>
                        <span>•</span>
                        <span>Cable run: {survey.cableDistanceMeters}m</span>
                      </div>

                      <span className="text-[11px] font-semibold text-[#172747] hover:underline flex items-center gap-1">
                        Open detailed engineering timeline <ArrowRight className="h-3 w-3 text-[#E87A5D]" />
                      </span>
                    </div>
                  )}
                </CardHeader>

                {/* EXPANDED CONTENT: VERTICAL PROGRESS TIMELINE */}
                {isExpanded && (
                  <CardContent className="p-6 space-y-6 bg-white">
                    <div className="border-b border-[#F0EAE1] pb-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-[#172747]" />
                        <h4 className="text-sm font-bold uppercase tracking-wider text-[#172747]">
                          Survey Lifecycle Progress Timeline
                        </h4>
                      </div>
                      <span className="text-xs text-[#827B73]">
                        Chronological Audit Trail • ISO 9001 Compliant
                      </span>
                    </div>

                    {/* THE VERTICAL TIMELINE CONTAINER */}
                    <div className="relative pl-6 space-y-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E8E0D6]">
                      {/* ============================================================ */}
                      {/* MILESTONE 1: ENQUIRY RECEIVED */}
                      {/* ============================================================ */}
                      <div className="relative group">
                        {/* Connecting Dot */}
                        <div className="absolute -left-[30px] top-0 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white shadow-sm ring-4 ring-white">
                          <Check className="h-3.5 w-3.5 stroke-[3]" />
                        </div>

                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <h5 className="text-sm font-bold text-[#172747] flex items-center gap-2">
                              1. Solar Inquiry Received & Ticket Generated
                            </h5>
                            <span className="text-[11px] font-mono text-[#827B73] bg-[#F7F3EC] px-2 py-0.5 rounded">
                              {survey.scheduledDate} (Preliminary Registration)
                            </span>
                          </div>
                          <p className="text-xs text-[#827B73]">
                            Customer submitted rooftop solar request. Ticket <span className="font-mono font-bold text-[#172747]">{survey.surveyNo}</span> registered in CRM pipeline with address <span className="text-[#292522]">{survey.siteAddress}</span>.
                          </p>
                        </div>
                      </div>

                      {/* ============================================================ */}
                      {/* MILESTONE 2: SURVEY SCHEDULED */}
                      {/* ============================================================ */}
                      <div className="relative group">
                        <div className="absolute -left-[30px] top-0 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white shadow-sm ring-4 ring-white">
                          <Check className="h-3.5 w-3.5 stroke-[3]" />
                        </div>

                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <h5 className="text-sm font-bold text-[#172747] flex items-center gap-2">
                              2. Physical Site Inspection Scheduled
                            </h5>
                            <span className="text-[11px] font-mono text-[#827B73] bg-[#F7F3EC] px-2 py-0.5 rounded">
                              Appointment: {survey.scheduledDate} • 10:30 AM IST
                            </span>
                          </div>
                          <p className="text-xs text-[#827B73]">
                            Field visit confirmed with customer. Preliminary DISCOM substation lookup completed for Indiranagar/Whitefield feeder line.
                          </p>
                        </div>
                      </div>

                      {/* ============================================================ */}
                      {/* MILESTONE 3: ENGINEER ASSIGNED */}
                      {/* ============================================================ */}
                      <div className="relative group">
                        <div className="absolute -left-[30px] top-0 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white shadow-sm ring-4 ring-white">
                          <Check className="h-3.5 w-3.5 stroke-[3]" />
                        </div>

                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <h5 className="text-sm font-bold text-[#172747] flex items-center gap-2">
                              3. Lead Field Engineer Assigned
                            </h5>
                            <span className="text-[11px] font-mono text-[#827B73]">
                              Assigned by Dispatch Operations
                            </span>
                          </div>
                          <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E8E0D6] flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2.5">
                              <div className="h-7 w-7 rounded-lg bg-[#172747] text-[#FFDDB7] flex items-center justify-center font-bold text-xs">
                                {survey.technicianName.charAt(0)}
                              </div>
                              <div>
                                <span className="font-bold text-[#172747] block">{survey.technicianName}</span>
                                <span className="text-[11px] text-[#827B73]">Certified Solar PV Field Surveyor • ID: {survey.technicianId}</span>
                              </div>
                            </div>
                            <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
                              Equipped: Clinometer & Drone Kit
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* ============================================================ */}
                      {/* MILESTONE 4: SITE INSPECTION STARTED */}
                      {/* ============================================================ */}
                      {(() => {
                        const isDone = survey.status !== 'scheduled'
                        const isActive = survey.status === 'in_progress'

                        return (
                          <div className="relative group">
                            <div
                              className={`absolute -left-[30px] top-0 flex h-6 w-6 items-center justify-center rounded-full text-white shadow-sm ring-4 ring-white ${
                                isDone && !isActive
                                  ? 'bg-emerald-600'
                                  : isActive
                                  ? 'bg-[#172747] ring-amber-300 animate-pulse'
                                  : 'bg-[#C4B8AA]'
                              }`}
                            >
                              {isDone && !isActive ? (
                                <Check className="h-3.5 w-3.5 stroke-[3]" />
                              ) : isActive ? (
                                <RefreshCw className="h-3 w-3 animate-spin text-[#FFDDB7]" />
                              ) : (
                                <span className="h-2 w-2 rounded-full bg-white" />
                              )}
                            </div>

                            <div className="space-y-1">
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <h5 className={`text-sm font-bold flex items-center gap-2 ${isActive ? 'text-[#172747]' : isDone ? 'text-[#172747]' : 'text-[#8C7A6B]'}`}>
                                  4. Site Inspection & Physical Walkthrough
                                  {isActive && (
                                    <span className="rounded-full bg-blue-100 text-blue-800 text-[10px] px-2 py-0.5 font-bold animate-pulse">
                                      IN PROGRESS
                                    </span>
                                  )}
                                </h5>
                                <span className="text-[11px] font-mono text-[#827B73]">
                                  {isDone ? `${survey.scheduledDate} • 11:15 AM` : 'Pending Field Arrival'}
                                </span>
                              </div>
                              <p className="text-xs text-[#827B73]">
                                {isDone
                                  ? `Lead engineer ${survey.technicianName} arrived at site, performed rooftop hatch safety check, and surveyed orientation obstacles.`
                                  : 'Technician will check in upon arrival at customer premises to begin structural and shading inspection.'}
                              </p>

                              {/* Action to trigger inspection for testing if scheduled */}
                              {survey.status === 'scheduled' && (
                                <div className="pt-1">
                                  <Button
                                    size="sm"
                                    onClick={() => startInspection(survey.id)}
                                    className="h-7 text-xs bg-[#172747] text-white hover:bg-[#1E345E]"
                                  >
                                    Simulate Technician Arrival (Start Inspection)
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        )
                      })()}

                      {/* ============================================================ */}
                      {/* MILESTONE 5: SITE MEASUREMENTS & PHOTOS SUBMITTED */}
                      {/* ============================================================ */}
                      {(() => {
                        const isDone = survey.status !== 'scheduled' && survey.status !== 'in_progress'
                        const isActive = survey.status === 'in_progress'

                        return (
                          <div className="relative group">
                            <div
                              className={`absolute -left-[30px] top-0 flex h-6 w-6 items-center justify-center rounded-full text-white shadow-sm ring-4 ring-white ${
                                isDone
                                  ? 'bg-emerald-600'
                                  : isActive
                                  ? 'bg-amber-500 ring-amber-200 animate-pulse'
                                  : 'bg-[#C4B8AA]'
                              }`}
                            >
                              {isDone ? (
                                <Check className="h-3.5 w-3.5 stroke-[3]" />
                              ) : (
                                <span className="h-2 w-2 rounded-full bg-white" />
                              )}
                            </div>

                            <div className="space-y-3">
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <h5 className={`text-sm font-bold flex items-center gap-2 ${isDone ? 'text-[#172747]' : 'text-[#8C7A6B]'}`}>
                                  5. Site Measurements & Rooftop Photographs Submitted
                                </h5>
                                <span className="text-[11px] font-mono text-[#827B73]">
                                  {isDone ? 'Recorded via Field Tablet App' : 'Pending Submission'}
                                </span>
                              </div>

                              {isDone ? (
                                <>
                                  {/* Rooftop Geometry Grid */}
                                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-[#FAF7F2] p-4 rounded-xl border border-[#E8E0D6]">
                                    <div className="space-y-0.5">
                                      <span className="text-[10px] uppercase font-bold text-[#827B73] flex items-center gap-1">
                                        <Ruler className="h-3 w-3" /> Total Rooftop Area
                                      </span>
                                      <strong className="font-mono text-sm text-[#172747] block">
                                        {survey.roofAreaSqFt} sq ft
                                      </strong>
                                    </div>
                                    <div className="space-y-0.5">
                                      <span className="text-[10px] uppercase font-bold text-emerald-800 flex items-center gap-1">
                                        <Zap className="h-3 w-3 text-emerald-600" /> Shadow-Free Area
                                      </span>
                                      <strong className="font-mono text-sm text-emerald-700 font-bold block">
                                        {survey.shadowFreeAreaSqFt} sq ft
                                      </strong>
                                    </div>
                                    <div className="space-y-0.5">
                                      <span className="text-[10px] uppercase font-bold text-[#827B73] flex items-center gap-1">
                                        <Compass className="h-3 w-3" /> Azimuth & Tilt
                                      </span>
                                      <strong className="text-xs text-[#292522] block">
                                        {survey.roofDirection} @ {survey.roofTiltAngle}° Tilt
                                      </strong>
                                    </div>
                                    <div className="space-y-0.5">
                                      <span className="text-[10px] uppercase font-bold text-[#827B73]">
                                        Cable Run to Main Panel
                                      </span>
                                      <strong className="font-mono text-xs text-[#292522] block">
                                        {survey.cableDistanceMeters} meters
                                      </strong>
                                    </div>
                                  </div>

                                  {/* Structural Base & Grid Suitability */}
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                                    <div className="p-3 rounded-xl bg-white border border-[#E8E0D6] flex items-center justify-between">
                                      <span className="text-[#827B73]">Structural Base Assessment:</span>
                                      <strong className="text-[#292522]">{survey.structuralStrength}</strong>
                                    </div>
                                    <div className="p-3 rounded-xl bg-white border border-[#E8E0D6] flex items-center justify-between">
                                      <span className="text-[#827B73]">DISCOM Grid Suitability:</span>
                                      <span
                                        className={`font-bold ${
                                          survey.gridSuitability === 'Optimal'
                                            ? 'text-[#2D5A43]'
                                            : 'text-[#B68B55]'
                                        }`}
                                      >
                                        {survey.gridSuitability}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Inspector Observations */}
                                  <div className="p-3.5 rounded-xl bg-[#F7F3EC] border border-[#E8E0D6] text-xs space-y-1">
                                    <span className="font-bold text-[#172747] uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                                      <User className="h-3 w-3 text-[#E87A5D]" />
                                      Field Surveyor Remarks ({survey.technicianName})
                                    </span>
                                    <p className="text-[#493027] italic leading-relaxed">
                                      &quot;{survey.technicianNotes}&quot;
                                    </p>
                                  </div>

                                  {/* Rooftop Inspection Photographs */}
                                  <div className="space-y-2">
                                    <span className="font-bold text-[#172747] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                                      <Camera className="h-3.5 w-3.5 text-[#172747]" />
                                      Rooftop Inspection Photographs ({survey.photos.length} Captured)
                                    </span>

                                    {survey.photos.length > 0 ? (
                                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                                        {survey.photos.map((src, i) => (
                                          <button
                                            key={i}
                                            type="button"
                                            aria-label={`View full rooftop photograph ${i + 1}`}
                                            onClick={() =>
                                              setActivePhotoModal({
                                                src,
                                                title: `Rooftop Perspective #${i + 1} • Azimuth ${survey.roofDirection}`,
                                                surveyNo: survey.surveyNo,
                                              })
                                            }
                                            className="group/photo relative rounded-xl overflow-hidden h-28 border border-[#E8E0D6] cursor-pointer shadow-sm hover:border-[#172747] transition-all text-left focus:outline-none focus:ring-2 focus:ring-[#172747]"
                                          >
                                            <img
                                              src={src}
                                              alt={`Rooftop inspection photograph ${i + 1}`}
                                              className="w-full h-full object-cover group-hover/photo:scale-105 transition-transform duration-300 pointer-events-none"
                                            />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/photo:opacity-100 transition-opacity flex items-center justify-center text-white gap-1 text-xs font-semibold pointer-events-none">
                                              <Eye className="h-4 w-4" />
                                              <span>Enlarge</span>
                                            </div>
                                            <span className="absolute bottom-1 right-1 bg-black/75 text-white text-[9px] px-1.5 py-0.5 rounded font-mono pointer-events-none">
                                              Photo #{i + 1}
                                            </span>
                                          </button>
                                        ))}
                                      </div>
                                    ) : (
                                      <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8E0D6] text-center text-xs text-[#827B73]">
                                        No photographs submitted for this site.
                                      </div>
                                    )}
                                  </div>
                                </>
                              ) : (
                                <p className="text-xs text-[#827B73]">
                                  Measurements and photogrammetry will be automatically populated once the field engineer finishes the on-site checklist.
                                </p>
                              )}
                            </div>
                          </div>
                        )
                      })()}

                      {/* ============================================================ */}
                      {/* MILESTONE 6: FEASIBILITY REVIEW */}
                      {/* ============================================================ */}
                      {(() => {
                        const isReviewDone = survey.status === 'approved' || survey.status === 'rejected' || survey.status === 'revisit_required'
                        const isUnderReview = survey.status === 'pending_approval'

                        return (
                          <div className="relative group">
                            <div
                              className={`absolute -left-[30px] top-0 flex h-6 w-6 items-center justify-center rounded-full text-white shadow-sm ring-4 ring-white ${
                                isReviewDone
                                  ? 'bg-emerald-600'
                                  : isUnderReview
                                  ? 'bg-[#172747] ring-blue-200 animate-pulse'
                                  : 'bg-[#C4B8AA]'
                              }`}
                            >
                              {isReviewDone ? (
                                <Check className="h-3.5 w-3.5 stroke-[3]" />
                              ) : isUnderReview ? (
                                <Clock className="h-3 w-3 text-[#FFDDB7]" />
                              ) : (
                                <span className="h-2 w-2 rounded-full bg-white" />
                              )}
                            </div>

                            <div className="space-y-2">
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <h5 className={`text-sm font-bold flex items-center gap-2 ${isUnderReview ? 'text-[#172747]' : isReviewDone ? 'text-[#172747]' : 'text-[#8C7A6B]'}`}>
                                  6. Engineering Feasibility & Shading Analysis Review
                                </h5>
                                <span className="text-[11px] font-mono text-[#827B73]">
                                  Evaluator: Marcus Vance (Chief Engineer)
                                </span>
                              </div>

                              {isReviewDone || isUnderReview ? (
                                <div className="p-3.5 rounded-xl bg-white border border-[#E8E0D6] text-xs space-y-1.5">
                                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                                    <div>
                                      <span className="text-[#827B73] block">Structural Integrity:</span>
                                      <strong className="text-[#172747]">{survey.structuralStrength}</strong>
                                    </div>
                                    <div>
                                      <span className="text-[#827B73] block">Annual Shading Factor:</span>
                                      <strong className="text-emerald-700">&lt; 3.5% Loss (Optimal)</strong>
                                    </div>
                                    <div>
                                      <span className="text-[#827B73] block">Grid Feeder Capacity:</span>
                                      <strong className={survey.gridSuitability === 'Optimal' ? 'text-emerald-700' : 'text-amber-700'}>
                                        {survey.gridSuitability}
                                      </strong>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <p className="text-xs text-[#827B73]">
                                  PVSyst 3D shading model and structural load verification queued for engineering review.
                                </p>
                              )}
                            </div>
                          </div>
                        )
                      })()}

                      {/* ============================================================ */}
                      {/* MILESTONE 7: FINAL APPROVAL GATEKEEPER */}
                      {/* ============================================================ */}
                      <div className="relative group">
                        {/* Dynamic marker based on final approval status */}
                        <div
                          className={`absolute -left-[30px] top-0 flex h-6 w-6 items-center justify-center rounded-full text-white shadow-sm ring-4 ring-white ${
                            survey.status === 'approved'
                              ? 'bg-emerald-600'
                              : survey.status === 'rejected'
                              ? 'bg-[#9E3A3A]'
                              : survey.status === 'revisit_required'
                              ? 'bg-amber-600'
                              : survey.status === 'pending_approval'
                              ? 'bg-[#172747] ring-amber-300 animate-pulse'
                              : 'bg-[#C4B8AA]'
                          }`}
                        >
                          {survey.status === 'approved' && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                          {survey.status === 'rejected' && <XCircle className="h-4 w-4" />}
                          {survey.status === 'revisit_required' && <AlertCircle className="h-4 w-4" />}
                          {survey.status === 'pending_approval' && <Clock className="h-3 w-3 text-[#FFDDB7]" />}
                          {survey.status === 'scheduled' || survey.status === 'in_progress' ? (
                            <span className="h-2 w-2 rounded-full bg-white" />
                          ) : null}
                        </div>

                        <div className="space-y-3">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <h5 className="text-sm font-bold text-[#172747] flex items-center gap-2">
                              7. Final Feasibility Decision & Executive Sign-off
                            </h5>
                            <span className="text-[11px] font-mono text-[#827B73]">
                              Status: <StatusChip status={survey.status} />
                            </span>
                          </div>

                          {/* Approved state */}
                          {survey.status === 'approved' && (
                            <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs space-y-2">
                              <div className="flex items-center gap-2 font-bold text-emerald-800">
                                <CheckCircle className="h-4 w-4 text-emerald-600" />
                                <span>Feasibility Approved & Signed Off</span>
                              </div>
                              <p className="text-[#493027]">
                                Approved by: <strong>{survey.approvedBy || 'Marcus Vance (Director / Chief Engineer)'}</strong> on{' '}
                                <span className="font-mono">{survey.approvedAt || '2026-10-25 16:00 UTC'}</span>.
                              </p>
                              <p className="text-[11px] text-emerald-900/80">
                                Rooftop geometry verified. Maximum recommended solar array capacity: <strong>{(survey.shadowFreeAreaSqFt / 120).toFixed(1)} kW DC</strong>.
                              </p>
                            </div>
                          )}

                          {/* Pending Approval state with interactive action buttons */}
                          {survey.status === 'pending_approval' && (
                            <div className="p-4 rounded-xl bg-[#FAF7F2] border-2 border-[#172747] text-xs space-y-3 shadow-sm">
                              <div className="flex items-center gap-2 font-bold text-[#172747]">
                                <Clock className="h-4 w-4 text-[#E87A5D]" />
                                <span>Feasibility Review Awaiting Director Sign-off</span>
                              </div>
                              <p className="text-[#6E7787]">
                                Physical measurements and photographs submitted. As an authorized engineering director, review the rooftop data and take an adjudication decision:
                              </p>
                              <div className="flex flex-wrap gap-2.5 pt-1">
                                <Button
                                  size="sm"
                                  onClick={() => handleApprove(survey.id)}
                                  className="h-8 text-xs bg-[#2D5A43] hover:bg-[#234735] text-white flex items-center gap-1 font-bold shadow-sm"
                                >
                                  <CheckCircle className="h-3.5 w-3.5" />
                                  Approve Feasibility
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => openRevisitModal(survey.id)}
                                  className="h-8 text-xs border-amber-600 text-amber-800 hover:bg-amber-50 flex items-center gap-1 font-bold"
                                >
                                  <AlertCircle className="h-3.5 w-3.5 text-amber-600" />
                                  Request Revisit
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => openRejectModal(survey.id)}
                                  className="h-8 text-xs border-[#9E3A3A] text-[#9E3A3A] hover:bg-[#9E3A3A]/10 flex items-center gap-1 font-bold"
                                >
                                  <XCircle className="h-3.5 w-3.5 text-[#9E3A3A]" />
                                  Reject Feasibility
                                </Button>
                              </div>
                            </div>
                          )}

                          {/* Revisit Required state */}
                          {survey.status === 'revisit_required' && (
                            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-300 text-xs space-y-2">
                              <div className="flex items-center gap-2 font-bold text-amber-900">
                                <AlertCircle className="h-4 w-4 text-amber-600" />
                                <span>Field Revisit Required</span>
                              </div>
                              <p className="text-[#493027]">
                                Revisit Reason: <em>&quot;{survey.rejectionReason}&quot;</em>
                              </p>
                              <div className="pt-1 flex items-center gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => handleApprove(survey.id)}
                                  className="h-7 text-xs bg-[#172747] text-white hover:bg-[#1E345E]"
                                >
                                  Override & Approve
                                </Button>
                              </div>
                            </div>
                          )}

                          {/* Rejected state */}
                          {survey.status === 'rejected' && (
                            <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-200 text-xs space-y-2">
                              <div className="flex items-center gap-2 font-bold text-rose-900">
                                <XCircle className="h-4 w-4 text-rose-600" />
                                <span>Feasibility Rejected & Locked</span>
                              </div>
                              <p className="text-rose-900/90">
                                Rejection Justification: <em>&quot;{survey.rejectionReason}&quot;</em>
                              </p>
                              <p className="text-[11px] text-rose-700 font-semibold">
                                Commercial quotation generation is strictly prevented for this site until structural retrofits are confirmed.
                              </p>
                            </div>
                          )}

                          {/* Scheduled / In Progress */}
                          {(survey.status === 'scheduled' || survey.status === 'in_progress') && (
                            <p className="text-xs text-[#827B73]">
                              Adjudication actions will be enabled after measurements and photographs are submitted.
                            </p>
                          )}
                        </div>
                      </div>

                      {/* ============================================================ */}
                      {/* MILESTONE 8: PROCEED TO COMMERCIAL QUOTATION */}
                      {/* ============================================================ */}
                      <div className="relative group pt-1">
                        <div
                          className={`absolute -left-[30px] top-1 flex h-6 w-6 items-center justify-center rounded-full text-white shadow-sm ring-4 ring-white ${
                            survey.status === 'approved' ? 'bg-[#172747]' : 'bg-[#C4B8AA]'
                          }`}
                        >
                          {survey.status === 'approved' ? (
                            <FileCheck className="h-3.5 w-3.5 text-[#FFDDB7]" />
                          ) : (
                            <Lock className="h-3 w-3 text-white" />
                          )}
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h5 className={`text-sm font-bold flex items-center gap-2 ${survey.status === 'approved' ? 'text-[#172747]' : 'text-[#8C7A6B]'}`}>
                              8. Commercial Quotation Pipeline
                            </h5>
                            {survey.status === 'approved' ? (
                              <span className="rounded-full bg-emerald-100 text-emerald-800 text-[10px] px-2.5 py-0.5 font-bold">
                                UNLOCKED
                              </span>
                            ) : (
                              <span className="rounded-full bg-gray-100 text-gray-700 text-[10px] px-2.5 py-0.5 font-bold flex items-center gap-1">
                                <Lock className="h-3 w-3" /> GATED
                              </span>
                            )}
                          </div>

                          {survey.status === 'approved' ? (
                            <div className="p-4 rounded-xl bg-[#172747] text-white space-y-3 shadow-sm">
                              <div>
                                <span className="text-[10px] uppercase font-bold text-[#FFDDB7] tracking-wider block">
                                  Commercial Readiness Confirmed
                                </span>
                                <p className="text-xs text-[#F7F3EC]/80 mt-0.5">
                                  Feasibility sign-off enables dynamic BOM generation (3kW to 15kW), statutory PM Surya Ghar subsidy claim calculation, and customer sales order execution.
                                </p>
                              </div>
                              <Link to={`/app/quotations?surveyId=${survey.id}`}>
                                <Button
                                  size="sm"
                                  className="w-full sm:w-auto h-9 text-xs bg-[#FFDDB7] text-[#172747] hover:bg-white font-bold flex items-center gap-1.5 shadow"
                                >
                                  <FileCheck className="h-4 w-4 text-[#172747]" />
                                  Proceed to Quotation Matrix →
                                </Button>
                              </Link>
                            </div>
                          ) : (
                            <div className="p-3.5 rounded-xl bg-[#F7F3EC] border border-[#E8E0D6] text-xs space-y-1">
                              <span className="font-bold text-[#827B73] uppercase tracking-wider text-[10px] flex items-center gap-1">
                                <Lock className="h-3 w-3 text-[#827B73]" />
                                Commercial Quotation Generation Locked
                              </span>
                              <p className="text-[#827B73]">
                                As mandated by company policy, a formal commercial contract cannot be prepared until the survey ticket receives an official feasibility sign-off.
                              </p>
                            </div>
                          )}
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

      {/* 6. Photo Lightbox Modal */}
      {activePhotoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-3xl rounded-2xl bg-white overflow-hidden shadow-2xl border border-[#E8E0D6]">
            {/* Modal Header */}
            <div className="flex items-center justify-between bg-[#172747] px-6 py-3 text-white">
              <div>
                <span className="text-[11px] font-mono text-[#FFDDB7] block">
                  SURVEY FILE #{activePhotoModal.surveyNo}
                </span>
                <h4 className="text-sm font-bold">{activePhotoModal.title}</h4>
              </div>
              <button
                onClick={() => setActivePhotoModal(null)}
                className="rounded-lg p-1 text-white/80 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Image Display */}
            <div className="p-4 bg-black flex items-center justify-center max-h-[70vh]">
              <img
                src={activePhotoModal.src}
                alt={activePhotoModal.title}
                className="max-h-[65vh] w-auto object-contain rounded-lg shadow-md"
              />
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[#FAF7F2] border-t border-[#E8E0D6] flex items-center justify-between text-xs text-[#827B73]">
              <span>Resolution: High-Definition Inspection Photogrammetry • Geotagged</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActivePhotoModal(null)}
                className="h-8 text-xs border-[#E8E0D6] text-[#172747]"
              >
                Close View
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 7. Rejection Reason Modal */}
      {rejectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#302019]/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-2xl border border-[#E8E0D6] shadow-warm-lg p-6 space-y-4">
            <h3 className="font-headline text-base font-bold text-[#9E3A3A] flex items-center gap-1.5">
              <XCircle className="h-5 w-5" />
              Record Engineering Feasibility Rejection
            </h3>
            <p className="text-xs text-[#827B73]">
              State the structural, shading, or grid capacity reason why this rooftop cannot proceed to commercial quotation.
            </p>

            <textarea
              required
              rows={4}
              value={actionReason}
              onChange={(e) => setActionReason(e.target.value)}
              placeholder="e.g. Asbestos sheeting brittle; excessive winter shading from adjacent commercial building; transformer capacity full."
              className="w-full rounded-xl border border-[#E8E0D6] p-3 text-xs text-[#292522] focus:border-[#172747] focus:outline-none focus:ring-1 focus:ring-[#172747]"
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRejectModalOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="sm"
                disabled={!actionReason.trim()}
                onClick={handleConfirmReject}
                className="text-xs bg-[#9E3A3A] hover:bg-[#852E2E]"
              >
                Confirm Rejection & Lock Pipeline
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 8. Revisit Request Modal */}
      {revisitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#302019]/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-2xl border border-[#E8E0D6] shadow-warm-lg p-6 space-y-4">
            <h3 className="font-headline text-base font-bold text-amber-800 flex items-center gap-1.5">
              <AlertCircle className="h-5 w-5 text-amber-600" />
              Request Field Revisit & Re-measurement
            </h3>
            <p className="text-xs text-[#827B73]">
              Specify the corrective actions or supplementary photogrammetry required by the survey engineer.
            </p>

            <textarea
              required
              rows={4}
              value={actionReason}
              onChange={(e) => setActionReason(e.target.value)}
              placeholder="e.g. Parapet shadow boundary unclear in afternoon; re-survey with high-mast drone thermography."
              className="w-full rounded-xl border border-[#E8E0D6] p-3 text-xs text-[#292522] focus:border-amber-600 focus:outline-none focus:ring-1 focus:ring-amber-600"
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRevisitModalOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                disabled={!actionReason.trim()}
                onClick={handleConfirmRevisit}
                className="text-xs bg-amber-700 hover:bg-amber-800 text-white font-bold"
              >
                Dispatch Revisit Instructions
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
