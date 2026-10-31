import { useState } from 'react'
import { MetricCard } from '@/components/ui/MetricCard'
import { DataTable } from '@/components/ui/DataTable'
import { StatusChip } from '@/components/ui/StatusChip'
import {
  HardHat,
  Award,
  CheckCircle2,
  Search,
  Wrench
} from 'lucide-react'

interface TechMember {
  id: string
  code: string
  name: string
  role: 'Lead Electrician' | 'Mounting Specialist' | 'Commissioning Engineer' | 'Apprentice'
  certification: string
  phone: string
  currentJob: string
  completedInstalls: number
  rating: number
  status: 'on_site' | 'available' | 'in_transit'
}

const TECHNICIANS_FLEET: TechMember[] = [
  {
    id: 'tech-01',
    code: 'TECH-001',
    name: 'Rajesh Kumar',
    role: 'Commissioning Engineer',
    certification: 'MNRE Certified Master Solar Tech (Grade A)',
    phone: '+91 98450 11223',
    currentJob: 'JOB-2025-0012 (Completed)',
    completedInstalls: 48,
    rating: 4.9,
    status: 'available',
  },
  {
    id: 'tech-02',
    code: 'TECH-002',
    name: 'Mateo Kowalski',
    role: 'Lead Electrician',
    certification: 'IEC 62446 Grid Tie Specialist',
    phone: '+91 98860 44556',
    currentJob: 'JOB-2026-0044 (Koramangala 4kW)',
    completedInstalls: 36,
    rating: 4.8,
    status: 'on_site',
  },
  {
    id: 'tech-03',
    code: 'TECH-003',
    name: 'Arjun Swaminathan',
    role: 'Mounting Specialist',
    certification: 'High-Altitude Structural Rigging (SS304)',
    phone: '+91 98451 88990',
    currentJob: 'JOB-2026-0045 (Survey Indiranagar)',
    completedInstalls: 42,
    rating: 4.9,
    status: 'in_transit',
  },
  {
    id: 'tech-04',
    code: 'TECH-004',
    name: 'Pradeep Gowda',
    role: 'Lead Electrician',
    certification: 'Bescom HT/LT Wireman License',
    phone: '+91 99001 22334',
    currentJob: 'Central Depot Prep',
    completedInstalls: 29,
    rating: 4.7,
    status: 'available',
  },
]

export function TechniciansPage() {
  const [techs] = useState<TechMember[]>(TECHNICIANS_FLEET)
  const [searchTerm, setSearchTerm] = useState('')

  const activeOnSite = techs.filter(t => t.status === 'on_site').length
  const availableCount = techs.filter(t => t.status === 'available').length

  const filtered = techs.filter(t =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.role.toLowerCase().includes(searchTerm.toLowerCase())
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
                15 Certified Field Technicians
              </span>
              <span className="text-xs text-[#6E7787]">MNRE & IEC Standard Crew</span>
            </div>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#172747] font-['Plus_Jakarta_Sans']">
              Technician Workforce & Certification Roster
            </h1>
            <p className="text-sm text-[#6E7787]">
              Manage certified electrical leads, rooftop mounting teams, site safety ratings, and active assignments.
            </p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          title="Active Field Workforce"
          value="15 Technicians"
          subtitle="4 Specialized Crews"
          icon={HardHat}
        />
        <MetricCard
          title="Currently On Site"
          value={activeOnSite.toString()}
          subtitle="Executing installations"
          trend="up"
          trendValue="High productivity"
          icon={Wrench}
        />
        <MetricCard
          title="Ready For Dispatch"
          value={availableCount.toString()}
          subtitle="Available in staging"
          icon={CheckCircle2}
        />
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl bg-white p-4 shadow-sm border border-[#E8E0D6]">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6E7787]" />
          <input
            type="text"
            placeholder="Search technician name, badge #, role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-[#E8E0D6] pl-9 pr-4 py-2 text-xs focus:border-[#172747] focus:outline-none"
          />
        </div>
      </div>

      {/* Technicians Table */}
      <DataTable title={`Certified Technician Roster (${filtered.length})`}>
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-[#E8E0D6] bg-[#F7F3EC] text-[#493027] font-bold uppercase tracking-wider">
              <th className="py-3 px-4">Badge #</th>
              <th className="py-3 px-4">Technician Name</th>
              <th className="py-3 px-4">Role & Specialization</th>
              <th className="py-3 px-4">Certified Credentials</th>
              <th className="py-3 px-4">Active Deployment</th>
              <th className="py-3 px-4">Completed Installs</th>
              <th className="py-3 px-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8E0D6]">
            {filtered.map((t) => (
              <tr key={t.id} className="hover:bg-[#F7F3EC]/50 transition-colors">
                <td className="py-3.5 px-4 font-mono font-bold text-[#172747]">{t.code}</td>
                <td className="py-3.5 px-4">
                  <span className="block font-semibold text-[#172747]">{t.name}</span>
                  <span className="text-[11px] text-[#6E7787] font-mono">{t.phone}</span>
                </td>
                <td className="py-3.5 px-4 font-medium text-[#493027]">{t.role}</td>
                <td className="py-3.5 px-4 text-[#6E7787] flex items-center gap-1">
                  <Award className="h-3.5 w-3.5 text-amber-600" />
                  {t.certification}
                </td>
                <td className="py-3.5 px-4 font-mono text-xs text-[#172747]">{t.currentJob}</td>
                <td className="py-3.5 px-4 font-bold text-[#172747] tabular-nums">
                  {t.completedInstalls} Sites
                </td>
                <td className="py-3.5 px-4 text-right">
                  <StatusChip
                    status={
                      t.status === 'available'
                        ? 'completed'
                        : t.status === 'on_site'
                        ? 'in-progress'
                        : 'pending'
                    }
                    label={t.status.replace('_', ' ').toUpperCase()}
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
