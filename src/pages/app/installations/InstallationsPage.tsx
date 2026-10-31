import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Smartphone,
  CheckCircle,
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatusChip } from '@/components/ui/StatusChip'
import { DataTable, Column } from '@/components/ui/DataTable'
import { useSolarStore, InstallationJob } from '@/lib/store/solarStore'

export function InstallationsPage() {
  const { installations } = useSolarStore()
  const [selectedJob, setSelectedJob] = useState<InstallationJob | null>(installations[0] || null)

  const columns: Column<InstallationJob>[] = [
    {
      key: 'jobNo',
      header: 'Job ID',
      sortable: true,
      render: (j) => (
        <span className="font-mono text-xs font-bold text-[#172747]">
          {j.jobNo}
        </span>
      ),
    },
    {
      key: 'customerName',
      header: 'Customer & Address',
      sortable: true,
      render: (j) => (
        <div>
          <p className="font-semibold text-[#292522]">{j.customerName}</p>
          <p className="text-xs text-[#827B73] truncate max-w-xs">{j.siteAddress}</p>
        </div>
      ),
    },
    {
      key: 'capacityKw',
      header: 'Capacity',
      render: (j) => (
        <span className="text-xs font-bold text-[#172747]">
          {j.capacityKw} kW System
        </span>
      ),
    },
    {
      key: 'leadTechnician',
      header: 'Crew Lead',
      render: (j) => (
        <span className="text-xs font-medium text-[#292522]">
          {j.leadTechnician}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Field Status',
      sortable: true,
      render: (j) => <StatusChip status={j.status} />,
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (j) => (
        <div className="flex items-center justify-end gap-1.5">
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs"
            onClick={() => setSelectedJob(j)}
          >
            Review Job
          </Button>
          <Link to="/technician">
            <Button variant="default" size="sm" className="h-8 text-xs bg-[#172747] text-white">
              <Smartphone className="h-3 w-3 mr-1 text-[#FFDDB7]" />
              Field Mode
            </Button>
          </Link>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#827B73] uppercase tracking-wider">
            <span>Field Engineering & Commissioning</span>
            <span>•</span>
            <span className="text-[#172747]">15 Technician Crews</span>
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-[#172747]">
            Installations & Technician Crew Operations
          </h1>
          <p className="text-xs sm:text-sm text-[#827B73] mt-0.5">
            Monitor rooftop civil rigging, electrical megger testing, generation verification, and customer digital sign-off.
          </p>
        </div>

        <Link to="/technician">
          <Button variant="default" className="bg-[#172747] text-white hover:bg-[#1E345E] shadow-warm-sm">
            <Smartphone className="h-4 w-4 mr-1 text-[#FFDDB7]" />
            Launch Technician Mobile Experience
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Jobs Table */}
        <div className="lg:col-span-7">
          <Card>
            <CardContent className="p-4 sm:p-6">
              <DataTable
                data={installations}
                columns={columns}
                keyExtractor={(j) => j.id}
                searchable={true}
                searchPlaceholder="Search job, customer, technician..."
                searchKeys={['jobNo', 'customerName', 'leadTechnician', 'siteAddress']}
                onRowClick={(j) => setSelectedJob(j)}
                pageSize={6}
              />
            </CardContent>
          </Card>
        </div>

        {/* Right Column (5 cols): Job Commissioning Audit Card */}
        <div className="lg:col-span-5">
          {selectedJob ? (
            <Card className="border-[#172747]/20 shadow-warm-md">
              <CardHeader className="bg-[#F7F3EC]/70 border-b border-[#E8E0D6] pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-mono text-xs font-bold text-[#172747]">
                      {selectedJob.jobNo}
                    </span>
                    <CardTitle className="text-base font-bold text-[#292522]">
                      {selectedJob.customerName}
                    </CardTitle>
                  </div>
                  <StatusChip status={selectedJob.status} />
                </div>
                <p className="text-xs text-[#827B73] mt-1">{selectedJob.siteAddress}</p>
              </CardHeader>

              <CardContent className="p-5 space-y-4 text-xs">
                {/* Tech & Schedule Info */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-[#F7F3EC] border border-[#E8E0D6]">
                    <span className="text-[10px] text-[#827B73] uppercase font-bold">Crew Lead</span>
                    <p className="font-semibold text-[#292522] mt-0.5">{selectedJob.leadTechnician}</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#F7F3EC] border border-[#E8E0D6]">
                    <span className="text-[10px] text-[#827B73] uppercase font-bold">Scheduled Date</span>
                    <p className="font-semibold text-[#292522] mt-0.5 font-mono">{selectedJob.scheduledDate}</p>
                  </div>
                </div>

                {/* Checklist Audit */}
                <div className="space-y-2">
                  <span className="font-bold text-[#827B73] uppercase tracking-wider text-[10px]">
                    Field Safety & Testing Checklist
                  </span>
                  <div className="space-y-1.5 p-3 rounded-xl bg-white border border-[#E8E0D6]">
                    <div className="flex items-center justify-between">
                      <span>Mounting structure torque checked:</span>
                      {selectedJob.checklist.mountingStructureTorqueVerified ? (
                        <CheckCircle className="h-4 w-4 text-[#2D5A43]" />
                      ) : (
                        <span className="text-[10px] text-[#827B73]">Pending</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Voc & Isc strings within specs:</span>
                      {selectedJob.checklist.vocAndIscStringVerified ? (
                        <CheckCircle className="h-4 w-4 text-[#2D5A43]" />
                      ) : (
                        <span className="text-[10px] text-[#827B73]">Pending</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Earthing resistance &lt; 5 Ohms:</span>
                      {selectedJob.checklist.earthingResistanceLessThan5Ohms ? (
                        <CheckCircle className="h-4 w-4 text-[#2D5A43]" />
                      ) : (
                        <span className="text-[10px] text-[#827B73]">Pending</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Inverter anti-islanding functional:</span>
                      {selectedJob.checklist.inverterAntiIslandingFunctional ? (
                        <CheckCircle className="h-4 w-4 text-[#2D5A43]" />
                      ) : (
                        <span className="text-[10px] text-[#827B73]">Pending</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Electrical Testing Results */}
                {selectedJob.testedVocVolts && (
                  <div className="p-3.5 rounded-xl bg-[#F7F3EC] border border-[#E8E0D6] space-y-1.5 text-xs">
                    <span className="font-bold text-[#827B73] uppercase tracking-wider text-[10px]">
                      Commissioning Test Readings
                    </span>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-[#827B73]">Open Circuit Voc:</span>
                        <p className="font-mono font-bold text-[#292522]">{selectedJob.testedVocVolts} Volts</p>
                      </div>
                      <div>
                        <span className="text-[#827B73]">Short Circuit Isc:</span>
                        <p className="font-mono font-bold text-[#292522]">{selectedJob.testedIscAmps} Amps</p>
                      </div>
                      <div>
                        <span className="text-[#827B73]">Earth Resistance:</span>
                        <p className="font-mono font-bold text-[#2D5A43]">{selectedJob.testedEarthResistanceOhms} Ω (&lt;5Ω Pass)</p>
                      </div>
                      <div>
                        <span className="text-[#827B73]">Live Solar Gen:</span>
                        <p className="font-mono font-bold text-[#2D5A43]">{selectedJob.solarGenerationKwReading} kW Reading</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Customer Signature File */}
                {selectedJob.customerSignature ? (
                  <div className="p-3 rounded-lg bg-[#2D5A43]/10 border border-[#2D5A43]/20 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-[#2D5A43]">
                      Customer Acceptance Recorded
                    </span>
                    <p className="font-semibold text-xs text-[#292522] italic font-serif">
                      &quot;{selectedJob.customerSignature}&quot;
                    </p>
                    <p className="text-[10px] text-[#827B73]">
                      Commissioned on {selectedJob.commissioningDate}
                    </p>
                  </div>
                ) : (
                  <div className="p-3 rounded-lg bg-[#B68B55]/10 border border-[#B68B55]/20 text-xs text-[#827B73]">
                    Customer acceptance signature pending field completion.
                  </div>
                )}

                <Link to="/technician" className="block pt-2">
                  <Button variant="default" size="sm" className="w-full text-xs bg-[#172747] text-white">
                    <Smartphone className="h-3.5 w-3.5 mr-1" />
                    Open in Mobile Field Portal
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-64 flex items-center justify-center text-center p-6 text-sm text-[#827B73]">
              Select an installation job to review field checklist and testing parameters.
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
