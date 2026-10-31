import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  Phone,
  Mail,
  MapPin,
  Shield,
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatusChip } from '@/components/ui/StatusChip'
import { DataTable, Column } from '@/components/ui/DataTable'
import { useSolarStore } from '@/lib/store/solarStore'

interface CustomerProfile {
  id: string
  name: string
  type: 'Residential' | 'Commercial & Industrial'
  phone: string
  email: string
  address: string
  city: string
  totalCapacityKw: number
  totalSpend: number
  activeInstallationsCount: number
  activeWarrantiesCount: number
  openComplaintsCount: number
  leadId?: string
}

export function CustomersPage() {
  const [searchParams] = useSearchParams()
  const filterLeadId = searchParams.get('leadId')

  const { leads, orders, warranties, serviceTickets, surveys } = useSolarStore()

  // Generate unified customer profiles from leads & orders
  const customers: CustomerProfile[] = leads.map((lead) => {
    const customerOrders = orders.filter((o) => o.customerName === lead.customerName)
    const customerWarranties = warranties.filter((w) => w.customerName === lead.customerName)
    const customerTickets = serviceTickets.filter((t) => t.customerName === lead.customerName)
    const spend = customerOrders.reduce((sum, o) => sum + o.paidAmount, 0)

    const isCommercial =
      lead.customerName.toLowerCase().includes('ltd') ||
      lead.customerName.toLowerCase().includes('castings') ||
      lead.customerName.toLowerCase().includes('tools') ||
      lead.capacityKw >= 5

    return {
      id: `cust-${lead.id}`,
      name: lead.customerName,
      type: isCommercial ? 'Commercial & Industrial' : 'Residential',
      phone: lead.phone,
      email: lead.email,
      address: lead.address,
      city: lead.city,
      totalCapacityKw: lead.capacityKw,
      totalSpend: spend,
      activeInstallationsCount: customerOrders.length,
      activeWarrantiesCount: customerWarranties.length,
      openComplaintsCount: customerTickets.filter((t) => t.status !== 'closed').length,
      leadId: lead.id,
    }
  })

  const [selectedCustomer, setSelectedCustomer] = useState<CustomerProfile | null>(() => {
    if (filterLeadId) {
      const match = customers.find((c) => c.leadId === filterLeadId)
      if (match) return match
    }
    return customers[0] || null
  })

  const columns: Column<CustomerProfile>[] = [
    {
      key: 'name',
      header: 'Customer & Type',
      sortable: true,
      render: (c) => (
        <div>
          <p className="font-semibold text-[#292522]">{c.name}</p>
          <span
            className={`inline-block text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded mt-0.5 ${
              c.type.includes('Commercial')
                ? 'bg-[#493027] text-[#FFDDB7]'
                : 'bg-[#172747]/10 text-[#172747]'
            }`}
          >
            {c.type}
          </span>
        </div>
      ),
    },
    {
      key: 'city',
      header: 'Contact & Location',
      render: (c) => (
        <div className="text-xs text-[#827B73]">
          <p className="font-medium text-[#292522]">{c.phone}</p>
          <p>{c.address}, {c.city}</p>
        </div>
      ),
    },
    {
      key: 'totalCapacityKw',
      header: 'Solar Portfolio',
      sortable: true,
      render: (c) => (
        <div className="text-xs">
          <span className="font-bold text-[#172747]">{c.totalCapacityKw} kW Total</span>
          <p className="text-[#827B73] font-mono tabular-nums">Paid: ₹{c.totalSpend.toLocaleString()}</p>
        </div>
      ),
    },
    {
      key: 'activeWarrantiesCount',
      header: 'Coverage',
      render: (c) => (
        <div className="flex items-center gap-2">
          {c.activeWarrantiesCount > 0 ? (
            <span className="text-xs font-semibold text-[#2D5A43] flex items-center gap-1">
              <Shield className="h-3.5 w-3.5" />
              {c.activeWarrantiesCount} Protected
            </span>
          ) : (
            <span className="text-xs text-[#827B73]">Pre-installation</span>
          )}
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Action',
      align: 'right',
      render: (c) => (
        <Button
          variant="outline"
          size="sm"
          className="h-8 text-xs"
          onClick={() => setSelectedCustomer(c)}
        >
          View Full File
        </Button>
      ),
    },
  ]

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-[#827B73] uppercase tracking-wider">
          <span>CRM Master</span>
          <span>•</span>
          <span className="text-[#172747]">Unified Account Directory</span>
        </div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-[#172747]">
          Customer Directory & Unified Account Records
        </h1>
        <p className="text-xs sm:text-sm text-[#827B73] mt-0.5">
          Single source of truth linking inquiries, rooftop surveys, quotations, equipment serials, warranties, and service tickets.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Customer Directory Table */}
        <div className="lg:col-span-7">
          <Card>
            <CardContent className="p-4 sm:p-6">
              <DataTable
                data={customers}
                columns={columns}
                keyExtractor={(c) => c.id}
                searchable={true}
                searchPlaceholder="Search customer, phone, location..."
                searchKeys={['name', 'phone', 'city', 'address']}
                onRowClick={(c) => setSelectedCustomer(c)}
                pageSize={6}
              />
            </CardContent>
          </Card>
        </div>

        {/* Right Column (5 cols): Selected Customer Complete File */}
        <div className="lg:col-span-5">
          {selectedCustomer ? (
            <Card className="border-[#172747]/20 shadow-warm-md">
              <CardHeader className="bg-[#F7F3EC]/70 border-b border-[#E8E0D6] pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-[#172747] text-white flex items-center justify-center font-bold text-sm">
                      {selectedCustomer.name
                        .split(' ')
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join('')}
                    </div>
                    <div>
                      <CardTitle className="text-base font-bold text-[#172747]">
                        {selectedCustomer.name}
                      </CardTitle>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#B68B55]">
                        {selectedCustomer.type}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#827B73]">
                    {selectedCustomer.id}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="p-5 space-y-5">
                {/* Contact Data */}
                <div className="space-y-1.5 text-xs text-[#292522]">
                  <p className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-[#827B73]" />
                    <strong className="font-semibold">{selectedCustomer.phone}</strong>
                  </p>
                  <p className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-[#827B73]" />
                    <span>{selectedCustomer.email || 'No email registered'}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-[#827B73]" />
                    <span>{selectedCustomer.address}, {selectedCustomer.city}</span>
                  </p>
                </div>

                {/* Connected Records Quick Deck */}
                <div className="grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="p-2.5 rounded-lg bg-[#F7F3EC] border border-[#E8E0D6]">
                    <span className="text-[10px] uppercase font-bold text-[#827B73]">Capacity</span>
                    <p className="font-display text-base font-bold text-[#172747]">
                      {selectedCustomer.totalCapacityKw} kW
                    </p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#F7F3EC] border border-[#E8E0D6]">
                    <span className="text-[10px] uppercase font-bold text-[#827B73]">Total Spend</span>
                    <p className="font-display text-base font-bold text-[#2D5A43] tabular-nums">
                      ₹{selectedCustomer.totalSpend.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Linked Survey Info */}
                <div className="space-y-2 pt-2 border-t border-[#E8E0D6]">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#827B73]">
                    Connected Site Feasibility
                  </h4>
                  {surveys.filter((s) => s.customerName === selectedCustomer.name).map((s) => (
                    <div key={s.id} className="p-2.5 rounded-lg bg-white border border-[#E8E0D6] text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-[#172747]">{s.surveyNo}</span>
                        <StatusChip status={s.status} />
                      </div>
                      <p className="text-[#827B73]">
                        Roof Area: <strong className="text-[#292522]">{s.roofAreaSqFt} sq ft</strong> • Tilt: <strong className="text-[#292522]">{s.roofTiltAngle}°</strong>
                      </p>
                    </div>
                  ))}
                </div>

                {/* Linked Warranties */}
                <div className="space-y-2 pt-2 border-t border-[#E8E0D6]">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#827B73]">
                    Active Warranty Certificates
                  </h4>
                  {warranties.filter((w) => w.customerName === selectedCustomer.name).length === 0 ? (
                    <p className="text-xs text-[#827B73] italic">No active warranties issued yet.</p>
                  ) : (
                    warranties
                      .filter((w) => w.customerName === selectedCustomer.name)
                      .map((w) => (
                        <div key={w.id} className="p-2.5 rounded-lg bg-[#2D5A43]/5 border border-[#2D5A43]/20 text-xs space-y-0.5">
                          <div className="flex items-center justify-between">
                            <span className="font-mono font-bold text-[#2D5A43]">{w.certificateNo}</span>
                            <span className="text-[10px] font-bold uppercase text-[#2D5A43]">
                              {w.durationYears} Yr Term
                            </span>
                          </div>
                          <p className="font-semibold text-[#292522]">{w.productName}</p>
                          <p className="text-[11px] text-[#827B73] font-mono">
                            Serial: <strong>{w.serialNumber}</strong> • Valid thru {w.expiryDate}
                          </p>
                        </div>
                      ))
                  )}
                </div>

                {/* Quick Context Actions */}
                <div className="pt-2 border-t border-[#E8E0D6] flex flex-wrap gap-2">
                  <Link to={`/app/crm/leads`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full text-xs">
                      View Lead
                    </Button>
                  </Link>
                  <Link to={`/app/surveys`} className="flex-1">
                    <Button variant="default" size="sm" className="w-full text-xs bg-[#172747] text-white">
                      Inspect Survey
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-64 flex items-center justify-center text-center p-6 text-sm text-[#827B73]">
              Select a customer from the directory to review complete account records.
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
