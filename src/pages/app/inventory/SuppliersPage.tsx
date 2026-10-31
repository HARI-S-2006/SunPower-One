import { useState } from 'react'
import { MetricCard } from '@/components/ui/MetricCard'
import { DataTable } from '@/components/ui/DataTable'
import { StatusChip } from '@/components/ui/StatusChip'
import {
  Building2,
  MapPin,
  Search,
  Star,
  Package
} from 'lucide-react'

interface SupplierItem {
  id: string
  name: string
  category: string
  contactPerson: string
  phone: string
  email: string
  location: string
  leadTimeDays: number
  qualityRating: number
  activeOrdersCount: number
  status: 'active_tier_1' | 'approved_secondary'
}

const SUPPLIERS_LIST: SupplierItem[] = [
  {
    id: 'sup-01',
    name: 'Adani Solar Regional Distribution',
    category: 'Mono PERC Solar PV Modules (540W)',
    contactPerson: 'Anand Kulkarni (Key Accounts)',
    phone: '+91 80 4129 8800',
    email: 'solar.sales@adani.com',
    location: 'Mundra / Bengaluru Hub',
    leadTimeDays: 4,
    qualityRating: 4.9,
    activeOrdersCount: 2,
    status: 'active_tier_1',
  },
  {
    id: 'sup-02',
    name: 'Ginlong Solis India Pvt Ltd',
    category: 'Single-Phase & 3-Phase Grid-Tied Inverters',
    contactPerson: 'Neha Sharma (Supply Chain)',
    phone: '+91 22 6128 9911',
    email: 'support.india@ginlong.com',
    location: 'Mumbai Distribution Center',
    leadTimeDays: 3,
    qualityRating: 4.8,
    activeOrdersCount: 1,
    status: 'active_tier_1',
  },
  {
    id: 'sup-03',
    name: 'Growatt Energy New Tech Co.',
    category: 'Hybrid MPPT Inverters & Battery Storage',
    contactPerson: 'David Chen / Rajiv Rao',
    phone: '+91 80 2341 5566',
    email: 'orders@growatt-india.com',
    location: 'Shenzhen / Chennai Port Hub',
    leadTimeDays: 7,
    qualityRating: 4.7,
    activeOrdersCount: 1,
    status: 'active_tier_1',
  },
  {
    id: 'sup-04',
    name: 'Luminous Power Technologies Pvt Ltd',
    category: 'LiFePO4 48V Lithium Storage Batteries',
    contactPerson: 'Deepak Verma',
    phone: '+91 11 4055 8899',
    email: 'corporate.bess@luminous.com',
    location: 'Gurugram / Hosur Depot',
    leadTimeDays: 5,
    qualityRating: 4.9,
    activeOrdersCount: 1,
    status: 'active_tier_1',
  },
]

export function SuppliersPage() {
  const [suppliers] = useState<SupplierItem[]>(SUPPLIERS_LIST)
  const [searchTerm, setSearchTerm] = useState('')

  const filtered = suppliers.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-[#E8E0D6]">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#172747]/5 px-2.5 py-0.5 text-xs font-semibold text-[#172747] uppercase tracking-wider">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                OEM Strategic Procurement
              </span>
              <span className="text-xs text-[#6E7787]">Direct Factory Sourcing Agreements</span>
            </div>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#172747] font-['Plus_Jakarta_Sans']">
              Tier-1 Hardware Suppliers & Vendors
            </h1>
            <p className="text-sm text-[#6E7787]">
              Certified equipment manufacturers providing 25-year and 2-year warranty back-to-back agreements.
            </p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          title="Active Tier-1 Partners"
          value={suppliers.length.toString()}
          subtitle="Direct OEM relationships"
          icon={Building2}
        />
        <MetricCard
          title="Average Delivery Lead Time"
          value="4.2 Days"
          subtitle="Direct warehouse replenishment"
          trend="down"
          trendValue="Express buffer available"
          icon={Package}
        />
        <MetricCard
          title="Supplier Quality Rating"
          value="4.8 / 5.0"
          subtitle="Zero RMA defect rejections"
          icon={Star}
        />
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl bg-white p-4 shadow-sm border border-[#E8E0D6]">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6E7787]" />
          <input
            type="text"
            placeholder="Search supplier, component category, contact..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-[#E8E0D6] pl-9 pr-4 py-2 text-xs focus:border-[#172747] focus:outline-none"
          />
        </div>
      </div>

      {/* Suppliers Table */}
      <DataTable title={`Tier-1 Equipment Suppliers (${filtered.length})`}>
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-[#E8E0D6] bg-[#F7F3EC] text-[#493027] font-bold uppercase tracking-wider">
              <th className="py-3 px-4">Supplier OEM</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Key Contact</th>
              <th className="py-3 px-4">Location Hub</th>
              <th className="py-3 px-4">Lead Time</th>
              <th className="py-3 px-4">Quality Rating</th>
              <th className="py-3 px-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8E0D6]">
            {filtered.map((s) => (
              <tr key={s.id} className="hover:bg-[#F7F3EC]/50 transition-colors">
                <td className="py-3.5 px-4 font-bold text-[#172747]">{s.name}</td>
                <td className="py-3.5 px-4 text-[#493027] font-medium">{s.category}</td>
                <td className="py-3.5 px-4">
                  <span className="block font-semibold text-[#172747]">{s.contactPerson}</span>
                  <span className="text-[11px] text-[#6E7787] font-mono">{s.phone}</span>
                </td>
                <td className="py-3.5 px-4 text-[#6E7787] flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-[#493027]" />
                  {s.location}
                </td>
                <td className="py-3.5 px-4 font-bold text-[#172747] tabular-nums">
                  {s.leadTimeDays} Days
                </td>
                <td className="py-3.5 px-4 font-bold text-[#172747] tabular-nums flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                  {s.qualityRating}
                </td>
                <td className="py-3.5 px-4 text-right">
                  <StatusChip
                    status="completed"
                    label={s.status.replace('_', ' ').toUpperCase()}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </DataTable>
    </div>
  )
}
