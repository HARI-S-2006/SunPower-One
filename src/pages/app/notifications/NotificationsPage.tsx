import { useState } from 'react'
import {
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Check,
  Trash2
} from 'lucide-react'

interface NotificationItem {
  id: string
  title: string
  description: string
  category: 'critical' | 'workflow' | 'escrow' | 'service'
  timestamp: string
  read: boolean
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-01',
    title: 'Site Survey SRV-2026-0045 Pending Approval',
    description: 'Technician Rajesh Kumar uploaded rooftop azimuth & 4 structural photos for Ananya Deshmukh. Commercial quotation blocked until approved.',
    category: 'workflow',
    timestamp: '15 mins ago',
    read: false,
  },
  {
    id: 'notif-02',
    title: 'Milestone Escrow Received: ₹73,500',
    description: '30% Advance payment recorded for Order SO-2026-0038 (Siddharth Varma). Order status advanced to Warehouse Staging.',
    category: 'escrow',
    timestamp: '1 hour ago',
    read: false,
  },
  {
    id: 'notif-03',
    title: 'SCADA Telemetry Fault Alert: ERR-F04',
    description: 'DC Bus over-voltage triggered on Inverter INV-4000-9102. Rapid response ticket TKT-2026-009 automatically adjudicated under warranty.',
    category: 'critical',
    timestamp: '3 hours ago',
    read: false,
  },
  {
    id: 'notif-04',
    title: 'Commissioning Sign-Off Completed',
    description: 'Job JOB-2025-0012 for Vikramaditya Rao signed by customer. 2-Year Inverter & 20-Year PV module warranties officially activated.',
    category: 'service',
    timestamp: '1 day ago',
    read: true,
  },
]

export function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  const unreadCount = notifications.filter(n => !n.read).length

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const clearAll = () => {
    setNotifications([])
  }

  const toggleRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: !n.read } : n))
  }

  const filtered = notifications.filter(n => filter === 'all' || !n.read)

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-[#E8E0D6]">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#172747]/5 px-2.5 py-0.5 text-xs font-semibold text-[#172747] uppercase tracking-wider">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                Operations Telemetry & Alerts
              </span>
              <span className="text-xs text-[#6E7787]">{unreadCount} Unread Notifications</span>
            </div>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#172747] font-['Plus_Jakarta_Sans']">
              Notification & Event Center
            </h1>
            <p className="text-sm text-[#6E7787]">
              Real-time audit alerts covering gatekeeper approvals, milestone escrow releases, and SCADA faults.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-1.5 rounded-xl border border-[#E8E0D6] bg-white px-3.5 py-2 text-xs font-bold text-[#172747] hover:bg-[#F7F3EC] shadow-sm transition-all"
            >
              <Check className="h-4 w-4" />
              Mark All as Read
            </button>
            <button
              onClick={clearAll}
              className="flex items-center gap-1.5 rounded-xl border border-[#E8E0D6] bg-white px-3.5 py-2 text-xs font-bold text-red-600 hover:bg-red-50 shadow-sm transition-all"
            >
              <Trash2 className="h-4 w-4" />
              Clear All
            </button>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            filter === 'all'
              ? 'bg-[#172747] text-white shadow-sm'
              : 'bg-white border border-[#E8E0D6] text-[#6E7787] hover:text-[#172747]'
          }`}
        >
          All Notifications ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            filter === 'unread'
              ? 'bg-[#172747] text-white shadow-sm'
              : 'bg-white border border-[#E8E0D6] text-[#6E7787] hover:text-[#172747]'
          }`}
        >
          Unread Only ({unreadCount})
        </button>
      </div>

      {/* Notification List */}
      <div className="space-y-3">
        {filtered.map((n) => (
          <div
            key={n.id}
            onClick={() => toggleRead(n.id)}
            className={`rounded-2xl p-5 shadow-sm border transition-all cursor-pointer flex items-start gap-4 ${
              n.read
                ? 'bg-white/80 border-[#E8E0D6] opacity-80'
                : 'bg-white border-[#172747]/30 ring-1 ring-[#172747]/10'
            }`}
          >
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl flex-shrink-0 ${
                n.category === 'critical'
                  ? 'bg-red-100 text-red-600'
                  : n.category === 'workflow'
                  ? 'bg-amber-100 text-amber-800'
                  : n.category === 'escrow'
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-blue-100 text-blue-700'
              }`}
            >
              {n.category === 'critical' ? (
                <AlertTriangle className="h-5 w-5" />
              ) : n.category === 'workflow' ? (
                <Clock className="h-5 w-5" />
              ) : n.category === 'escrow' ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : (
                <ShieldCheck className="h-5 w-5" />
              )}
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <h4 className={`text-sm font-bold ${n.read ? 'text-[#172747]' : 'text-[#172747] font-semibold'}`}>
                  {n.title}
                </h4>
                <span className="text-[11px] text-[#6E7787] font-mono">{n.timestamp}</span>
              </div>
              <p className="text-xs text-[#6E7787] leading-relaxed">{n.description}</p>
            </div>

            {!n.read && (
              <span className="h-2.5 w-2.5 rounded-full bg-[#172747] flex-shrink-0 mt-2" />
            )}
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="rounded-2xl bg-white p-8 text-center border border-[#E8E0D6] text-xs text-[#6E7787]">
            No notifications in this category.
          </div>
        )}
      </div>
    </div>
  )
}
