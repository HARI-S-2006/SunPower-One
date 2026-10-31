import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Plus,
  Calendar,
  ArrowRight,
  Phone,
  MapPin,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { StatusChip } from '@/components/ui/StatusChip'
import { DataTable, Column } from '@/components/ui/DataTable'
import { useSolarStore, Lead } from '@/lib/store/solarStore'

export function LeadsPage() {
  const { leads, surveys, createLead, scheduleSurvey } = useSolarStore()

  const [showAddModal, setShowAddModal] = useState(false)
  const [scheduleModalLead, setScheduleModalLead] = useState<Lead | null>(null)
  const [scheduledTech, setScheduledTech] = useState('Mateo Kowalski')
  const [scheduledDate, setScheduledDate] = useState('2026-11-03')

  // New Lead Form state
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    email: '',
    address: '',
    city: 'Bengaluru',
    capacityKw: 3,
    systemType: 'on-grid' as 'on-grid' | 'off-grid',
    monthlyBill: 3500,
    roofAreaSqFt: 500,
    assignedSalesExec: 'Elena Rostova',
    notes: '',
  })

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.customerName.trim() || !formData.phone.trim()) return

    createLead({
      ...formData,
      capacityKw: Number(formData.capacityKw),
      monthlyBill: Number(formData.monthlyBill),
      roofAreaSqFt: Number(formData.roofAreaSqFt),
    })

    setShowAddModal(false)
    setFormData({
      customerName: '',
      phone: '',
      email: '',
      address: '',
      city: 'Bengaluru',
      capacityKw: 3,
      systemType: 'on-grid',
      monthlyBill: 3500,
      roofAreaSqFt: 500,
      assignedSalesExec: 'Elena Rostova',
      notes: '',
    })
  }

  const handleConfirmSchedule = (e: React.FormEvent) => {
    e.preventDefault()
    if (!scheduleModalLead) return
    scheduleSurvey(scheduleModalLead.id, scheduledTech, scheduledDate)
    setScheduleModalLead(null)
  }

  const columns: Column<Lead>[] = [
    {
      key: 'referenceNo',
      header: 'Reference',
      sortable: true,
      render: (lead) => (
        <span className="font-mono text-xs font-bold text-[#172747]">
          {lead.referenceNo}
        </span>
      ),
    },
    {
      key: 'customerName',
      header: 'Customer',
      sortable: true,
      render: (lead) => (
        <div>
          <p className="font-semibold text-[#292522]">{lead.customerName}</p>
          <div className="flex items-center gap-2 text-xs text-[#827B73] mt-0.5">
            <span className="flex items-center gap-0.5"><Phone className="h-3 w-3" /> {lead.phone}</span>
            <span>•</span>
            <span className="flex items-center gap-0.5"><MapPin className="h-3 w-3" /> {lead.city}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'capacityKw',
      header: 'Package',
      sortable: true,
      render: (lead) => (
        <div className="text-xs">
          <span className="font-bold text-[#292522]">{lead.capacityKw} kW</span>{' '}
          <span className="uppercase text-[#827B73] font-semibold">({lead.systemType})</span>
          <p className="text-[#827B73] font-mono tabular-nums">Bill: ₹{lead.monthlyBill.toLocaleString()}/mo</p>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Pipeline Stage',
      sortable: true,
      render: (lead) => <StatusChip status={lead.status} />,
    },
    {
      key: 'assignedSalesExec',
      header: 'Assigned Exec',
      render: (lead) => (
        <span className="text-xs font-medium text-[#292522]">
          {lead.assignedSalesExec}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (lead) => {
        const linkedSurvey = surveys.find((s) => s.leadId === lead.id || s.id === lead.surveyId)

        return (
          <div className="flex items-center justify-end gap-1.5">
            {lead.status === 'new' && (
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs bg-[#172747] text-white hover:bg-[#1E345E]"
                onClick={() => setScheduleModalLead(lead)}
              >
                <Calendar className="h-3.5 w-3.5 mr-1 text-[#FFDDB7]" />
                Schedule Survey
              </Button>
            )}

            {linkedSurvey && (
              <Link to="/app/surveys">
                <Button variant="outline" size="sm" className="h-8 text-xs">
                  Survey ({linkedSurvey.status})
                </Button>
              </Link>
            )}

            <Link to={`/app/customers?leadId=${lead.id}`}>
              <Button variant="ghost" size="sm" className="h-8 text-xs">
                Profile <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </Link>
          </div>
        )
      },
    },
  ]

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header Deck */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#827B73] uppercase tracking-wider">
              CRM & Inquiries
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-[#172747]" />
            <span className="text-xs text-[#2D5A43] font-semibold">40 Installs/Month Pipeline</span>
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-[#172747]">
            Customer Inquiries & Leads
          </h1>
          <p className="text-xs sm:text-sm text-[#827B73] mt-0.5">
            Track prospective rooftop solar homeowners and factories through the connected lifecycle.
          </p>
        </div>

        <Button
          variant="default"
          onClick={() => setShowAddModal(true)}
          className="bg-[#172747] text-white hover:bg-[#1E345E] shadow-warm-sm"
        >
          <Plus className="h-4 w-4 mr-1 text-[#FFDDB7]" />
          Record New Customer Lead
        </Button>
      </div>

      {/* Leads Table */}
      <Card>
        <CardContent className="p-4 sm:p-6">
          <DataTable
            data={leads}
            columns={columns}
            keyExtractor={(lead) => lead.id}
            searchable={true}
            searchPlaceholder="Search customer, phone, reference..."
            searchKeys={['customerName', 'referenceNo', 'phone', 'city']}
            pageSize={8}
          />
        </CardContent>
      </Card>

      {/* Modal: Record New Customer Lead */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#302019]/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-xl bg-white rounded-2xl border border-[#E8E0D6] shadow-warm-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E0D6] bg-[#F7F3EC]/70">
              <div>
                <h3 className="font-headline text-base font-bold text-[#172747]">
                  Record New Customer Inquiry (Scenario 1)
                </h3>
                <p className="text-xs text-[#827B73]">Capture complete rooftop requirements</p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-[#827B73] hover:bg-[#EAE1DC]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 overflow-y-auto space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#827B73] uppercase">Customer Name *</label>
                  <Input
                    required
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    placeholder="e.g. Ramesh Chandra"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#827B73] uppercase">Phone Number *</label>
                  <Input
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98450 00000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#827B73] uppercase">Email Address</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="customer@gmail.com"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#827B73] uppercase">City / Location</label>
                  <Input
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Bengaluru"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#827B73] uppercase">Installation Address</label>
                <Input
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Plot / Street / Area"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#827B73] uppercase">Capacity (kW)</label>
                  <select
                    value={formData.capacityKw}
                    onChange={(e) => setFormData({ ...formData, capacityKw: Number(e.target.value) })}
                    className="h-10 w-full rounded-[10px] border border-[#E8E0D6] bg-white px-3 text-xs font-semibold text-[#292522]"
                  >
                    {[1, 2, 3, 4, 5].map((kw) => (
                      <option key={kw} value={kw}>{kw} kW</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#827B73] uppercase">System Type</label>
                  <select
                    value={formData.systemType}
                    onChange={(e) => setFormData({ ...formData, systemType: e.target.value as any })}
                    className="h-10 w-full rounded-[10px] border border-[#E8E0D6] bg-white px-3 text-xs font-semibold text-[#292522]"
                  >
                    <option value="on-grid">On-Grid (Net Meter)</option>
                    <option value="off-grid">Off-Grid (Battery)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#827B73] uppercase">Monthly Bill (₹)</label>
                  <Input
                    type="number"
                    value={formData.monthlyBill}
                    onChange={(e) => setFormData({ ...formData, monthlyBill: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#827B73] uppercase">Roof Area (Sq Ft)</label>
                <Input
                  type="number"
                  value={formData.roofAreaSqFt}
                  onChange={(e) => setFormData({ ...formData, roofAreaSqFt: Number(e.target.value) })}
                  placeholder="e.g. 600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#827B73] uppercase">Notes & Special Requirements</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="e.g. 3-phase connection available, client prefers elevated structure"
                  className="w-full h-20 rounded-[10px] border border-[#E8E0D6] p-3 text-xs text-[#292522]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#E8E0D6]">
                <Button variant="outline" type="button" onClick={() => setShowAddModal(false)}>
                  Cancel
                </Button>
                <Button variant="default" type="submit" className="bg-[#172747] text-white">
                  Save Customer Lead
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Schedule Site Survey */}
      {scheduleModalLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#302019]/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-2xl border border-[#E8E0D6] shadow-warm-lg p-6 space-y-4">
            <h3 className="font-headline text-base font-bold text-[#172747]">
              Schedule Site Survey for {scheduleModalLead.customerName}
            </h3>
            <p className="text-xs text-[#827B73]">
              Assign one of our 15 certified technicians to inspect rooftop feasibility, tilt, and shadow-free area.
            </p>

            <form onSubmit={handleConfirmSchedule} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#827B73]">Assigned Technician</label>
                <select
                  value={scheduledTech}
                  onChange={(e) => setScheduledTech(e.target.value)}
                  className="h-10 w-full rounded-[10px] border border-[#E8E0D6] bg-white px-3 text-xs font-semibold"
                >
                  <option value="Mateo Kowalski">Mateo Kowalski (Field Crew Lead #01)</option>
                  <option value="Rajesh Kumar">Rajesh Kumar (Senior Commissioning Tech #02)</option>
                  <option value="Suresh Patil">Suresh Patil (Electrical Specialist #03)</option>
                  <option value="Amit Deshmukh">Amit Deshmukh (Rooftop Rigging Lead #04)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#827B73]">Scheduled Inspection Date</label>
                <Input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <Button variant="outline" type="button" onClick={() => setScheduleModalLead(null)}>
                  Cancel
                </Button>
                <Button variant="default" type="submit" className="bg-[#172747] text-white">
                  Confirm & Dispatch Tech
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
