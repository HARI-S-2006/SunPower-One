import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  Plus,
  ShieldAlert,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatusChip } from '@/components/ui/StatusChip'
import { DataTable, Column } from '@/components/ui/DataTable'
import { useSolarStore, Quotation } from '@/lib/store/solarStore'

export function QuotationsPage() {
  const [searchParams] = useSearchParams()
  const surveyIdParam = searchParams.get('surveyId')

  const {
    quotations,
    leads,
    surveys,
    generateQuotation,
    acceptQuotation,
  } = useSolarStore()

  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(quotations[0] || null)
  const [showGenerateModal, setShowGenerateModal] = useState(false)

  // Generator form
  const [selectedLeadId, setSelectedLeadId] = useState<string>(() => {
    if (surveyIdParam) {
      const matchingSurvey = surveys.find((s) => s.id === surveyIdParam)
      if (matchingSurvey) return matchingSurvey.leadId
    }
    return leads[0]?.id || ''
  })
  const [selectedCapacity, setSelectedCapacity] = useState(3)
  const [selectedType, setSelectedType] = useState<'on-grid' | 'off-grid'>('on-grid')
  const [blockErrorMessage, setBlockErrorMessage] = useState<string | null>(null)

  // Check whether the selected lead is blocked due to unapproved survey!
  const targetLead = leads.find((l) => l.id === selectedLeadId)
  const targetSurvey = surveys.find(
    (s) => s.leadId === selectedLeadId || s.id === targetLead?.surveyId
  )
  const isBlocked = !targetSurvey || targetSurvey.status !== 'approved'

  const handleGenerateQuotation = (e: React.FormEvent) => {
    e.preventDefault()
    setBlockErrorMessage(null)

    const result = generateQuotation(selectedLeadId, selectedCapacity, selectedType)
    if (result.error) {
      setBlockErrorMessage(result.error)
      return
    }

    if (result.quotation) {
      setSelectedQuotation(result.quotation)
      setShowGenerateModal(false)
    }
  }

  const handleAcceptQuotation = (quoteId: string) => {
    const newOrder = acceptQuotation(quoteId)
    setSelectedQuotation((prev) =>
      prev?.id === quoteId ? { ...prev, status: 'accepted' } : prev
    )
    alert(`Quotation accepted! Sales Order ${newOrder.orderNo} created in Warehouse Staging.`)
  }

  const columns: Column<Quotation>[] = [
    {
      key: 'quotationNo',
      header: 'Quotation No',
      sortable: true,
      render: (q) => (
        <span className="font-mono text-xs font-bold text-[#172747]">
          {q.quotationNo}
        </span>
      ),
    },
    {
      key: 'customerName',
      header: 'Customer',
      sortable: true,
      render: (q) => (
        <div>
          <p className="font-semibold text-[#292522]">{q.customerName}</p>
          <span className="text-xs text-[#827B73]">
            {q.systemCapacityKw} kW {q.systemType.toUpperCase()}
          </span>
        </div>
      ),
    },
    {
      key: 'totalAmount',
      header: 'Price (Gross)',
      sortable: true,
      render: (q) => (
        <div className="text-xs">
          <p className="font-bold text-[#292522] font-mono tabular-nums">
            ₹{q.bom.totalAmount.toLocaleString()}
          </p>
          <p className="text-[#2D5A43] font-semibold">
            Subsidy: -₹{q.bom.estimatedSubsidyAmount.toLocaleString()}
          </p>
        </div>
      ),
    },
    {
      key: 'advanceAmount',
      header: '30% Advance',
      render: (q) => (
        <span className="font-mono text-xs font-semibold text-[#172747] tabular-nums">
          ₹{q.advanceAmount.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (q) => <StatusChip status={q.status} />,
    },
    {
      key: 'actions',
      header: 'Review',
      align: 'right',
      render: (q) => (
        <Button
          variant="outline"
          size="sm"
          className="h-8 text-xs"
          onClick={() => setSelectedQuotation(q)}
        >
          View BOM
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
            <span>Sales & Commercial Contracts</span>
            <span>•</span>
            <span className="text-[#172747]">Automated BOM Pricing</span>
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-[#172747]">
            Commercial Solar Quotations
          </h1>
          <p className="text-xs sm:text-sm text-[#827B73] mt-0.5">
            Issued quotations with component BOM pricing, milestone schedules, and subsidy offsets.
          </p>
        </div>

        <Button
          variant="default"
          onClick={() => {
            setShowGenerateModal(true)
            setBlockErrorMessage(null)
          }}
          className="bg-[#172747] text-white hover:bg-[#1E345E] shadow-warm-sm"
        >
          <Plus className="h-4 w-4 mr-1 text-[#FFDDB7]" />
          Create New Quotation
        </Button>
      </div>

      {/* Mandatory Rule Banner */}
      <div className="p-4 rounded-xl bg-[#F5ECE7] border border-[#E8E0D6] flex items-start gap-3.5">
        <div className="p-2 rounded-lg bg-[#172747] text-[#FFDDB7] shrink-0 mt-0.5">
          <ShieldAlert className="h-5 w-5" />
        </div>
        <div className="text-xs text-[#292522] leading-relaxed">
          <strong className="text-[#172747] uppercase font-bold tracking-wide">
            Strict Business Requirement Enforced:
          </strong>
          <p className="mt-0.5 text-[#827B73]">
            A commercial quotation cannot be released to a customer without prior engineering approval of the rooftop site survey.
            Attempting to quote an unapproved survey will trigger an explanatory blocking alert.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Quotations Table */}
        <div className="lg:col-span-7">
          <Card>
            <CardContent className="p-4 sm:p-6">
              <DataTable
                data={quotations}
                columns={columns}
                keyExtractor={(q) => q.id}
                searchable={true}
                searchPlaceholder="Search quotation, customer..."
                searchKeys={['quotationNo', 'customerName']}
                onRowClick={(q) => setSelectedQuotation(q)}
                pageSize={6}
              />
            </CardContent>
          </Card>
        </div>

        {/* Right Column (5 cols): Selected Quotation BOM & Acceptance File */}
        <div className="lg:col-span-5">
          {selectedQuotation ? (
            <Card className="border-[#172747]/20 shadow-warm-md">
              <CardHeader className="bg-[#F7F3EC]/70 border-b border-[#E8E0D6] pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-mono text-xs font-bold text-[#172747]">
                      {selectedQuotation.quotationNo}
                    </span>
                    <CardTitle className="text-base font-bold text-[#292522]">
                      {selectedQuotation.customerName}
                    </CardTitle>
                  </div>
                  <StatusChip status={selectedQuotation.status} />
                </div>
                <p className="text-xs text-[#827B73] mt-1">
                  {selectedQuotation.systemCapacityKw} kW {selectedQuotation.systemType.toUpperCase()} Package
                </p>
              </CardHeader>

              <CardContent className="p-5 space-y-4">
                {/* Cost Breakdown */}
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-[#827B73]">
                    <span>Equipment & Modules:</span>
                    <span className="font-mono text-[#292522]">
                      ₹{selectedQuotation.bom.totalEquipmentCost.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#827B73]">
                    <span>Installation & Commissioning:</span>
                    <span className="font-mono text-[#292522]">
                      ₹{selectedQuotation.bom.installationCost.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#827B73]">
                    <span>Composite Solar Taxes:</span>
                    <span className="font-mono text-[#292522]">
                      ₹{selectedQuotation.bom.taxAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-[#E8E0D6] flex justify-between font-bold text-sm text-[#172747]">
                    <span>Total Contract Value:</span>
                    <span className="font-display font-bold">
                      ₹{selectedQuotation.bom.totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Milestone Payment Escrow Schedule */}
                <div className="p-3.5 rounded-xl bg-[#F7F3EC] border border-[#E8E0D6] space-y-2 text-xs">
                  <span className="font-bold text-[#827B73] uppercase tracking-wider text-[10px]">
                    Payment Milestone Escrow
                  </span>
                  <div className="space-y-1.5">
                    <div className="flex justify-between">
                      <span className="font-medium text-[#292522]">1. Order Booking (30%):</span>
                      <strong className="font-mono text-[#172747]">
                        ₹{selectedQuotation.advanceAmount.toLocaleString()}
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-[#292522]">2. Pre-Dispatch Inspection (50%):</span>
                      <strong className="font-mono text-[#292522]">
                        ₹{Math.round(selectedQuotation.bom.totalAmount * 0.5).toLocaleString()}
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-[#292522]">3. Final Grid Commissioning (20%):</span>
                      <strong className="font-mono text-[#292522]">
                        ₹{Math.round(selectedQuotation.bom.totalAmount * 0.2).toLocaleString()}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* BOM Items Preview */}
                <div className="space-y-1.5">
                  <span className="font-bold text-[#827B73] uppercase tracking-wider text-[10px]">
                    Included BOM Components ({selectedQuotation.bom.items.length} items)
                  </span>
                  <div className="max-h-36 overflow-y-auto space-y-1 divide-y divide-[#F7F3EC]">
                    {selectedQuotation.bom.items.map((item) => (
                      <div key={item.id} className="pt-1 flex justify-between text-xs">
                        <span className="text-[#292522] truncate max-w-[200px]">{item.productName}</span>
                        <span className="font-mono text-[#827B73]">{item.quantity} {item.unit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Acceptance Action */}
                <div className="pt-3 border-t border-[#E8E0D6]">
                  {selectedQuotation.status === 'accepted' ? (
                    <div className="p-3 rounded-xl bg-[#2D5A43]/10 text-xs text-[#2D5A43] font-bold flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle className="h-4 w-4" />
                        Quotation Accepted by Customer
                      </span>
                      <Link to="/app/orders">
                        <Button variant="outline" size="sm" className="h-7 text-[11px]">
                          View Order
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <Button
                      variant="default"
                      className="w-full bg-[#2D5A43] hover:bg-[#234735] text-white"
                      onClick={() => handleAcceptQuotation(selectedQuotation.id)}
                    >
                      <CheckCircle className="h-4 w-4 mr-1.5" />
                      Accept Quotation & Confirm Sales Order
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-64 flex items-center justify-center text-center p-6 text-sm text-[#827B73]">
              Select a quotation from the register to review BOM pricing and milestones.
            </Card>
          )}
        </div>
      </div>

      {/* Modal: Create Quotation with Site Survey Approval Gatekeeper */}
      {showGenerateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#302019]/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-white rounded-2xl border border-[#E8E0D6] shadow-warm-lg p-6 space-y-4">
            <div>
              <h3 className="font-headline text-base font-bold text-[#172747]">
                Generate Commercial Solar Quotation
              </h3>
              <p className="text-xs text-[#827B73]">
                Strict engineering rule: Linked site survey must be approved.
              </p>
            </div>

            {blockErrorMessage && (
              <div className="p-3.5 rounded-xl bg-[#9E3A3A]/10 border border-[#9E3A3A]/25 flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-[#9E3A3A] shrink-0 mt-0.5" />
                <div className="text-xs text-[#9E3A3A]">
                  <strong className="block font-bold">Quotation Generation Blocked</strong>
                  <p className="mt-0.5 leading-relaxed">{blockErrorMessage}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleGenerateQuotation} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#827B73] uppercase">Select Customer Lead</label>
                <select
                  value={selectedLeadId}
                  onChange={(e) => {
                    setSelectedLeadId(e.target.value)
                    setBlockErrorMessage(null)
                  }}
                  className="h-10 w-full rounded-[10px] border border-[#E8E0D6] bg-white px-3 text-xs font-semibold text-[#292522]"
                >
                  {leads.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.customerName} ({l.referenceNo}) - {l.capacityKw}kW
                    </option>
                  ))}
                </select>
              </div>

              {/* Live Survey Status Indicator for Selected Lead */}
              <div className="p-3 rounded-lg bg-[#F7F3EC] border border-[#E8E0D6] text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#827B73]">Site Survey Feasibility Status:</span>
                  {targetSurvey ? (
                    <StatusChip status={targetSurvey.status} />
                  ) : (
                    <span className="text-xs font-bold text-[#9E3A3A]">No Survey Scheduled</span>
                  )}
                </div>

                {isBlocked && (
                  <p className="text-[11px] text-[#9E3A3A] font-medium pt-1">
                    ⚠️ Cannot issue quotation: Survey has not received engineering approval.
                  </p>
                )}
                {!isBlocked && (
                  <p className="text-[11px] text-[#2D5A43] font-medium pt-1">
                    ✓ Survey verified and approved ({targetSurvey?.surveyNo}). Ready to quote.
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#827B73] uppercase">Capacity (kW)</label>
                  <select
                    value={selectedCapacity}
                    onChange={(e) => setSelectedCapacity(Number(e.target.value))}
                    className="h-10 w-full rounded-[10px] border border-[#E8E0D6] bg-white px-3 text-xs font-semibold"
                  >
                    {[1, 2, 3, 4, 5].map((k) => (
                      <option key={k} value={k}>{k} kW</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#827B73] uppercase">Topology</label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value as any)}
                    className="h-10 w-full rounded-[10px] border border-[#E8E0D6] bg-white px-3 text-xs font-semibold"
                  >
                    <option value="on-grid">On-Grid (Net Meter)</option>
                    <option value="off-grid">Off-Grid (Battery Storage)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#E8E0D6]">
                <Button variant="outline" type="button" onClick={() => setShowGenerateModal(false)}>
                  Cancel
                </Button>
                <Button
                  variant="default"
                  type="submit"
                  disabled={isBlocked}
                  className="bg-[#172747] text-white disabled:opacity-50"
                >
                  Generate Approved Quotation
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
