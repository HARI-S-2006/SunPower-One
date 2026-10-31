import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  CheckCircle,
  XCircle,
  Compass,
  Ruler,
  Zap,
  Camera,
  FileCheck,
  ShieldAlert,
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatusChip } from '@/components/ui/StatusChip'
import { DataTable, Column } from '@/components/ui/DataTable'
import { useSolarStore, SiteSurvey } from '@/lib/store/solarStore'

export function SurveysPage() {
  const { surveys, approveSurvey, rejectSurvey } = useSolarStore()

  const [selectedSurvey, setSelectedSurvey] = useState<SiteSurvey | null>(surveys[0] || null)
  const [rejectModalOpen, setRejectModalOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState('')

  const handleApprove = (surveyId: string) => {
    approveSurvey(surveyId, 'Marcus Vance (Director / Chief Engineer)')
    if (selectedSurvey?.id === surveyId) {
      setSelectedSurvey((prev) =>
        prev ? { ...prev, status: 'approved', approvedBy: 'Marcus Vance (Director / Chief Engineer)' } : null
      )
    }
  }

  const handleReject = () => {
    if (!selectedSurvey || !rejectReason.trim()) return
    rejectSurvey(selectedSurvey.id, rejectReason)
    setSelectedSurvey((prev) =>
      prev ? { ...prev, status: 'rejected', rejectionReason: rejectReason } : null
    )
    setRejectModalOpen(false)
    setRejectReason('')
  }

  const columns: Column<SiteSurvey>[] = [
    {
      key: 'surveyNo',
      header: 'Survey ID',
      sortable: true,
      render: (s) => (
        <span className="font-mono text-xs font-bold text-[#172747]">
          {s.surveyNo}
        </span>
      ),
    },
    {
      key: 'customerName',
      header: 'Customer & Site',
      sortable: true,
      render: (s) => (
        <div>
          <p className="font-semibold text-[#292522]">{s.customerName}</p>
          <p className="text-xs text-[#827B73] truncate max-w-xs">{s.siteAddress}</p>
        </div>
      ),
    },
    {
      key: 'shadowFreeAreaSqFt',
      header: 'Rooftop Geometry',
      sortable: true,
      render: (s) => (
        <div className="text-xs">
          <span className="font-bold text-[#292522]">{s.shadowFreeAreaSqFt} sq ft free</span>
          <p className="text-[#827B73]">
            {s.roofDirection} • {s.roofTiltAngle}° Tilt • {s.cableDistanceMeters}m run
          </p>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Approval Gate',
      sortable: true,
      render: (s) => <StatusChip status={s.status} />,
    },
    {
      key: 'technicianName',
      header: 'Inspector',
      render: (s) => (
        <span className="text-xs font-medium text-[#292522]">
          {s.technicianName}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Review',
      align: 'right',
      render: (s) => (
        <Button
          variant="outline"
          size="sm"
          className="h-8 text-xs"
          onClick={() => setSelectedSurvey(s)}
        >
          Engineering File
        </Button>
      ),
    },
  ]

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#827B73] uppercase tracking-wider">
            <span>Engineering & Feasibility</span>
            <span>•</span>
            <span className="text-[#2D5A43] font-bold">Mandatory Commercial Gatekeeper</span>
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-[#172747]">
            Site Surveys & Engineering Feasibility
          </h1>
          <p className="text-xs sm:text-sm text-[#827B73] mt-0.5">
            Physical rooftop azimuth, structural load, shadow assessment, and cable run validation.
          </p>
        </div>
      </div>

      {/* Mandatory Rule Banner */}
      <div className="p-4 rounded-xl bg-[#F5ECE7] border border-[#E8E0D6] flex items-start gap-3.5">
        <div className="p-2 rounded-lg bg-[#172747] text-[#FFDDB7] shrink-0 mt-0.5">
          <ShieldAlert className="h-5 w-5" />
        </div>
        <div className="text-xs text-[#292522] leading-relaxed">
          <strong className="text-[#172747] uppercase font-bold tracking-wide">
            Mandatory Business Rule Enforced by Architecture:
          </strong>
          <p className="mt-0.5 text-[#827B73]">
            A final commercial quotation and sales contract <strong>cannot be generated or issued</strong> before
            the linked site survey has been officially approved by an authorized engineer. Unapproved sites are
            strictly prevented from entering the commercial pricing pipeline.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Surveys Table */}
        <div className="lg:col-span-7">
          <Card>
            <CardContent className="p-4 sm:p-6">
              <DataTable
                data={surveys}
                columns={columns}
                keyExtractor={(s) => s.id}
                searchable={true}
                searchPlaceholder="Search survey ID, customer, address..."
                searchKeys={['surveyNo', 'customerName', 'siteAddress', 'technicianName']}
                onRowClick={(s) => setSelectedSurvey(s)}
                pageSize={6}
              />
            </CardContent>
          </Card>
        </div>

        {/* Right Column (5 cols): Detailed Inspection & Approval File */}
        <div className="lg:col-span-5">
          {selectedSurvey ? (
            <Card className="border-[#172747]/20 shadow-warm-md">
              <CardHeader className="bg-[#F7F3EC]/70 border-b border-[#E8E0D6] pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-mono text-xs font-bold text-[#172747]">
                      {selectedSurvey.surveyNo}
                    </span>
                    <CardTitle className="text-base font-bold text-[#292522]">
                      {selectedSurvey.customerName}
                    </CardTitle>
                  </div>
                  <StatusChip status={selectedSurvey.status} />
                </div>
                <p className="text-xs text-[#827B73] mt-1">{selectedSurvey.siteAddress}</p>
              </CardHeader>

              <CardContent className="p-5 space-y-5">
                {/* Rooftop Feasibility Metrics Grid */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-[#F7F3EC] border border-[#E8E0D6]">
                    <span className="text-[10px] uppercase font-bold text-[#827B73] flex items-center gap-1">
                      <Ruler className="h-3 w-3" /> Total Area
                    </span>
                    <p className="font-display text-base font-bold text-[#172747] mt-0.5">
                      {selectedSurvey.roofAreaSqFt} <span className="text-xs font-normal">sq ft</span>
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-[#2D5A43]/10 border border-[#2D5A43]/20">
                    <span className="text-[10px] uppercase font-bold text-[#2D5A43] flex items-center gap-1">
                      <Zap className="h-3 w-3" /> Shadow-Free Area
                    </span>
                    <p className="font-display text-base font-bold text-[#2D5A43] mt-0.5">
                      {selectedSurvey.shadowFreeAreaSqFt} <span className="text-xs font-normal">sq ft</span>
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-[#F7F3EC] border border-[#E8E0D6]">
                    <span className="text-[10px] uppercase font-bold text-[#827B73] flex items-center gap-1">
                      <Compass className="h-3 w-3" /> Azimuth & Tilt
                    </span>
                    <p className="font-semibold text-[#292522] mt-0.5">
                      {selectedSurvey.roofDirection} @ {selectedSurvey.roofTiltAngle}°
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-[#F7F3EC] border border-[#E8E0D6]">
                    <span className="text-[10px] uppercase font-bold text-[#827B73]">
                      Cable Run to Panel
                    </span>
                    <p className="font-semibold text-[#292522] mt-0.5 font-mono">
                      {selectedSurvey.cableDistanceMeters} meters
                    </p>
                  </div>
                </div>

                {/* Engineering Assessment Badges */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-[#E8E0D6]">
                    <span className="text-[#827B73]">Structural Base:</span>
                    <strong className="text-[#292522]">{selectedSurvey.structuralStrength}</strong>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-[#E8E0D6]">
                    <span className="text-[#827B73]">Discom Grid Suitability:</span>
                    <span
                      className={`font-semibold ${
                        selectedSurvey.gridSuitability.includes('Optimal')
                          ? 'text-[#2D5A43]'
                          : 'text-[#B68B55]'
                      }`}
                    >
                      {selectedSurvey.gridSuitability}
                    </span>
                  </div>
                </div>

                {/* Technician Observations */}
                <div className="space-y-1 text-xs">
                  <span className="font-bold text-[#827B73] uppercase tracking-wider text-[10px]">
                    Inspector Observations ({selectedSurvey.technicianName})
                  </span>
                  <p className="p-3 rounded-lg bg-[#F7F3EC] text-[#292522] italic border border-[#E8E0D6]">
                    &quot;{selectedSurvey.technicianNotes}&quot;
                  </p>
                </div>

                {/* Roof Photo Gallery */}
                <div className="space-y-1.5">
                  <span className="font-bold text-[#827B73] uppercase tracking-wider text-[10px] flex items-center gap-1">
                    <Camera className="h-3 w-3" /> Rooftop Site Photographs
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedSurvey.photos.map((src, i) => (
                      <div key={i} className="relative rounded-lg overflow-hidden h-24 border border-[#E8E0D6]">
                        <img
                          src={src}
                          alt="Rooftop inspection photograph"
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] px-1 rounded">
                          Roof View #{i + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Approval Action Gatekeeper */}
                <div className="pt-3 border-t border-[#E8E0D6] space-y-3">
                  {selectedSurvey.status === 'approved' ? (
                    <div className="p-3 rounded-xl bg-[#2D5A43]/10 border border-[#2D5A43]/20 space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#2D5A43]">
                        <CheckCircle className="h-4 w-4" />
                        <span>Feasibility Approved & Signed Off</span>
                      </div>
                      <p className="text-[11px] text-[#827B73]">
                        Approved by: <strong>{selectedSurvey.approvedBy}</strong>
                      </p>
                      <Link to={`/app/quotations?surveyId=${selectedSurvey.id}`}>
                        <Button
                          variant="default"
                          size="sm"
                          className="w-full text-xs bg-[#172747] text-white hover:bg-[#1E345E] mt-1"
                        >
                          <FileCheck className="h-3.5 w-3.5 mr-1 text-[#FFDDB7]" />
                          Proceed to Quotation Matrix
                        </Button>
                      </Link>
                    </div>
                  ) : selectedSurvey.status === 'rejected' ? (
                    <div className="p-3 rounded-xl bg-[#9E3A3A]/10 border border-[#9E3A3A]/20 space-y-1 text-xs">
                      <div className="flex items-center gap-2 font-bold text-[#9E3A3A]">
                        <XCircle className="h-4 w-4" />
                        <span>Survey Rejected</span>
                      </div>
                      <p className="text-[#827B73]">
                        Reason: <em>{selectedSurvey.rejectionReason}</em>
                      </p>
                      <p className="text-[11px] text-[#9E3A3A] font-semibold mt-1">
                        Commercial Quotation generation is permanently locked for this survey.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-[11px] font-semibold text-[#827B73] uppercase tracking-wider">
                        Executive Engineering Gatekeeper Actions:
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="default"
                          className="flex-1 text-xs bg-[#2D5A43] hover:bg-[#234735] text-white"
                          onClick={() => handleApprove(selectedSurvey.id)}
                        >
                          <CheckCircle className="h-3.5 w-3.5 mr-1" />
                          Approve Survey
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1 text-xs border-[#9E3A3A] text-[#9E3A3A] hover:bg-[#9E3A3A]/10"
                          onClick={() => setRejectModalOpen(true)}
                        >
                          <XCircle className="h-3.5 w-3.5 mr-1" />
                          Reject Feasibility
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-64 flex items-center justify-center text-center p-6 text-sm text-[#827B73]">
              Select a rooftop survey from the register to inspect measurements and approve feasibility.
            </Card>
          )}
        </div>
      </div>

      {/* Reject Reason Modal */}
      {rejectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#302019]/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-2xl border border-[#E8E0D6] shadow-warm-lg p-6 space-y-4">
            <h3 className="font-headline text-base font-bold text-[#9E3A3A]">
              Record Engineering Rejection Reason
            </h3>
            <p className="text-xs text-[#827B73]">
              State the structural or shadow-related reason why this rooftop cannot proceed to commercial quotation.
            </p>

            <textarea
              required
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Inadequate structural load on tin shed; excessive shadow coverage from adjacent multi-storey building."
              className="w-full h-24 rounded-[10px] border border-[#E8E0D6] p-3 text-xs text-[#292522]"
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setRejectModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                disabled={!rejectReason.trim()}
                onClick={handleReject}
              >
                Confirm Rejection & Lock
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
