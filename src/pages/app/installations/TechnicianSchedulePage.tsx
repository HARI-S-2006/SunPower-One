import { useState } from 'react'
import { MetricCard } from '@/components/ui/MetricCard'
import { StatusChip } from '@/components/ui/StatusChip'
import {
  Calendar,
  Clock,
  MapPin,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

interface ScheduleSlot {
  id: string
  time: string
  jobType: 'Installation' | 'Site Survey' | 'Warranty Service'
  customerName: string
  address: string
  crewLead: string
  capacity: string
  status: 'scheduled' | 'in_progress' | 'completed'
}

const DAILY_SCHEDULE: ScheduleSlot[] = [
  {
    id: 'sc-01',
    time: '09:00 - 13:00',
    jobType: 'Installation',
    customerName: 'Siddharth Varma',
    address: '77, 8th Main, Koramangala 4th Block, Bengaluru',
    crewLead: 'Mateo Kowalski (Crew A)',
    capacity: '4.0 kW On-Grid',
    status: 'in_progress',
  },
  {
    id: 'sc-02',
    time: '11:00 - 13:30',
    jobType: 'Site Survey',
    customerName: 'Ananya Deshmukh',
    address: '14, Palm Meadows, Whitefield, Bengaluru',
    crewLead: 'Arjun Swaminathan (Survey Team)',
    capacity: '3.0 kW Off-Grid',
    status: 'scheduled',
  },
  {
    id: 'sc-03',
    time: '14:30 - 17:00',
    jobType: 'Warranty Service',
    customerName: 'Vikramaditya Rao',
    address: '19, 1st Cross, Dollars Colony, Bengaluru',
    crewLead: 'Rajesh Kumar (Service Unit)',
    capacity: 'Inverter Error ERR-F04',
    status: 'scheduled',
  },
]

export function TechnicianSchedulePage() {
  const [scheduleDate] = useState('Today, October 24, 2026')
  const [scheduleList] = useState<ScheduleSlot[]>(DAILY_SCHEDULE)

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-[#E8E0D6]">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#172747]/5 px-2.5 py-0.5 text-xs font-semibold text-[#172747] uppercase tracking-wider">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Live Dispatch Schedule
              </span>
              <span className="text-xs text-[#6E7787]">4 Crews Active in Field</span>
            </div>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#172747] font-['Plus_Jakarta_Sans']">
              Technician Field Calendar & Scheduling
            </h1>
            <p className="text-sm text-[#6E7787]">
              Real-time daily dispatch board coordinating installation teams, survey inspectors, and warranty service calls.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E8E0D6] bg-white text-[#172747] hover:bg-[#F7F3EC]">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="rounded-xl border border-[#E8E0D6] bg-[#F7F3EC] px-4 py-2 text-xs font-bold text-[#172747]">
              {scheduleDate}
            </span>
            <button className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E8E0D6] bg-white text-[#172747] hover:bg-[#F7F3EC]">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          title="Scheduled Dispatches Today"
          value={scheduleList.length.toString()}
          subtitle="Sites across Bengaluru metro"
          icon={Calendar}
        />
        <MetricCard
          title="Crews En-Route / On-Site"
          value="2 Units"
          subtitle="Live telemetry connected"
          icon={Clock}
        />
        <MetricCard
          title="Route Density Efficiency"
          value="94.2%"
          subtitle="Minimal transit travel overhead"
          icon={MapPin}
        />
      </div>

      {/* Schedule Timeline */}
      <div className="rounded-2xl bg-white p-6 shadow-sm border border-[#E8E0D6] space-y-4">
        <h3 className="text-base font-bold text-[#172747] font-['Plus_Jakarta_Sans']">
          Today's Site Execution Schedule
        </h3>

        <div className="divide-y divide-[#E8E0D6]">
          {scheduleList.map((slot) => (
            <div key={slot.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-[#F7F3EC] p-3 text-center min-w-[120px] border border-[#E8E0D6]">
                  <span className="block text-xs font-bold text-[#172747]">{slot.time}</span>
                  <span className="text-[10px] text-[#6E7787] uppercase font-semibold">{slot.jobType}</span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-[#172747]">{slot.customerName}</h4>
                  <p className="text-xs text-[#6E7787] flex items-center gap-1 mt-0.5">
                    <MapPin className="h-3.5 w-3.5 text-[#493027] flex-shrink-0" />
                    {slot.address}
                  </p>
                  <p className="text-xs text-[#493027] mt-1 font-medium">
                    Crew: <strong>{slot.crewLead}</strong> • System: <strong>{slot.capacity}</strong>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <StatusChip
                  status={
                    slot.status === 'completed'
                      ? 'completed'
                      : slot.status === 'in_progress'
                      ? 'in-progress'
                      : 'pending'
                  }
                  label={slot.status.replace('_', ' ')}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
