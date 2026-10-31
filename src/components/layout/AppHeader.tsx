import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Menu,
  Bell,
  Search,
  ChevronDown,
  LogOut,
  Settings,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface AppHeaderProps {
  onMenuClick: () => void
}

interface NotificationItem {
  id: string
  title: string
  desc: string
  time: string
  type: 'survey' | 'lead' | 'stock' | 'warranty'
  unread: boolean
}

const mockNotifications: NotificationItem[] = [
  {
    id: 'n1',
    title: 'Site Survey Submitted',
    desc: 'Roof survey for Anand Sharma (3kW) awaits engineering approval.',
    time: '12m ago',
    type: 'survey',
    unread: true,
  },
  {
    id: 'n2',
    title: 'New Commercial Inquiry',
    desc: '5 kW Off-Grid request from Precision Castings Ltd.',
    time: '45m ago',
    type: 'lead',
    unread: true,
  },
  {
    id: 'n3',
    title: 'Low Stock Alert',
    desc: 'Growatt 5kW Hybrid Inverters below threshold (3 remaining).',
    time: '2h ago',
    type: 'stock',
    unread: false,
  },
  {
    id: 'n4',
    title: 'Warranty Claim Filed',
    desc: 'Fault code E-04 reported on Inverter #INV-3300-8491.',
    time: '4h ago',
    type: 'warranty',
    unread: false,
  },
]

export function Header({ onMenuClick }: AppHeaderProps) {
  const navigate = useNavigate()
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [notifications, setNotifications] = useState(mockNotifications)
  const [activeRole, setActiveRole] = useState<'admin' | 'lead' | 'estimator'>('admin')

  const unreadCount = notifications.filter((n) => n.unread).length

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    const q = searchQuery.trim().toLowerCase()
    if (q.includes('lead') || q.includes('crm')) navigate('/app/crm/leads')
    else if (q.includes('survey')) navigate('/app/surveys')
    else if (q.includes('serial') || q.includes('inv-') || q.includes('bat-')) navigate('/app/inventory/serials')
    else if (q.includes('order')) navigate('/app/orders')
    else if (q.includes('invoice') || q.includes('pay')) navigate('/app/invoices')
    else if (q.includes('warranty')) navigate('/app/warranties')
    else navigate(`/app/customers?q=${encodeURIComponent(q)}`)
  }

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })))
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-[#E8E0D6] bg-white px-4 lg:px-8 shadow-warm-sm">
      {/* Left: Mobile Toggle & Search */}
      <div className="flex items-center gap-3 lg:gap-4 flex-1 max-w-xl">
        <button
          type="button"
          className="lg:hidden inline-flex items-center justify-center rounded-lg p-2 text-[#493027] hover:bg-[#F7F3EC] focus:outline-none"
          onClick={onMenuClick}
          aria-label="Open navigation sidebar"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Global Instant Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#827B73]" />
          <input
            type="search"
            placeholder="Search leads, customer serials (e.g. INV-3300), orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 rounded-[10px] border border-[#E8E0D6] bg-[#F7F3EC]/70 pl-10 pr-4 text-xs sm:text-sm text-[#292522] placeholder:text-[#827B73] focus:border-[#172747] focus:bg-white focus:outline-none focus:ring-3 focus:ring-[#172747]/12 transition-all"
            aria-label="Search across all modules"
          />
        </form>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3 ml-4">
        {/* Telemetry Status Strip - Hidden on small mobile */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#F7F3EC] border border-[#E8E0D6] text-xs">
          <ShieldCheck className="h-4 w-4 text-[#2D5A43]" />
          <span className="font-semibold text-[#292522]">ISO 9001 Audited</span>
          <span className="text-[#827B73]">•</span>
          <span className="text-[#827B73] font-mono tabular-nums">74.2 MW DC</span>
        </div>

        {/* Role Simulator Pill */}
        <div className="hidden sm:flex items-center bg-[#F7F3EC] p-1 rounded-lg border border-[#E8E0D6] text-xs font-semibold">
          <button
            onClick={() => setActiveRole('admin')}
            className={cn(
              'px-2.5 py-1 rounded-md transition-all',
              activeRole === 'admin'
                ? 'bg-[#172747] text-white shadow-xs'
                : 'text-[#827B73] hover:text-[#292522]'
            )}
          >
            Admin
          </button>
          <button
            onClick={() => setActiveRole('lead')}
            className={cn(
              'px-2.5 py-1 rounded-md transition-all',
              activeRole === 'lead'
                ? 'bg-[#493027] text-white shadow-xs'
                : 'text-[#827B73] hover:text-[#292522]'
            )}
          >
            Field Lead
          </button>
          <button
            onClick={() => setActiveRole('estimator')}
            className={cn(
              'px-2.5 py-1 rounded-md transition-all',
              activeRole === 'estimator'
                ? 'bg-[#172747] text-white shadow-xs'
                : 'text-[#827B73] hover:text-[#292522]'
            )}
          >
            Estimator
          </button>
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            type="button"
            className="relative p-2 rounded-lg text-[#827B73] hover:bg-[#F7F3EC] hover:text-[#292522] transition-colors"
            onClick={() => {
              setNotificationsOpen(!notificationsOpen)
              setUserMenuOpen(false)
            }}
            aria-expanded={notificationsOpen}
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#9E3A3A] text-white text-[10px] font-bold">
                {unreadCount}
              </span>
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-[#E8E0D6] bg-white p-3 shadow-warm-lg z-50 animate-fade-in">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#E8E0D6]">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-headline font-semibold text-sm text-[#292522]">
                    Operational Alerts
                  </h3>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full bg-[#9E3A3A]/10 text-[#9E3A3A] text-[10px] font-bold">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-xs text-[#172747] hover:underline font-semibold"
                  >
                    Mark read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto space-y-1 divide-y divide-[#F7F3EC]">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={cn(
                      'p-2.5 rounded-lg transition-colors cursor-pointer pt-2',
                      n.unread ? 'bg-[#F7F3EC]' : 'hover:bg-[#F7F3EC]/50'
                    )}
                    onClick={() => setNotificationsOpen(false)}
                  >
                    <div className="flex items-start gap-2">
                      {n.type === 'survey' && <Clock className="h-4 w-4 text-[#B68B55] mt-0.5" />}
                      {n.type === 'lead' && <Sparkles className="h-4 w-4 text-[#172747] mt-0.5" />}
                      {n.type === 'stock' && <AlertTriangle className="h-4 w-4 text-[#9E3A3A] mt-0.5" />}
                      {n.type === 'warranty' && <CheckCircle2 className="h-4 w-4 text-[#2D5A43] mt-0.5" />}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-[#292522]">{n.title}</p>
                        <p className="text-xs text-[#827B73] line-clamp-2 mt-0.5">{n.desc}</p>
                        <span className="text-[10px] text-[#827B73] font-mono mt-1 block">
                          {n.time}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu */}
        <div className="relative">
          <button
            type="button"
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-[#F7F3EC] transition-colors"
            onClick={() => {
              setUserMenuOpen(!userMenuOpen)
              setNotificationsOpen(false)
            }}
            aria-expanded={userMenuOpen}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#172747] text-white text-xs font-bold">
              {activeRole === 'admin' ? 'MV' : activeRole === 'lead' ? 'MK' : 'ER'}
            </div>
            <div className="hidden md:block text-left leading-tight">
              <p className="text-xs font-bold text-[#292522]">
                {activeRole === 'admin'
                  ? 'Marcus Vance'
                  : activeRole === 'lead'
                  ? 'Mateo Kowalski'
                  : 'Elena Rostova'}
              </p>
              <p className="text-[10px] text-[#827B73] capitalize">{activeRole} Role</p>
            </div>
            <ChevronDown className="h-4 w-4 text-[#827B73] hidden sm:block" />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-[#E8E0D6] bg-white p-2 shadow-warm-lg z-50 animate-fade-in">
              <div className="p-2 border-b border-[#E8E0D6]">
                <p className="text-xs font-bold text-[#292522]">SunPower Solutions</p>
                <p className="text-[11px] text-[#827B73]">Enterprise License #C46-1049281</p>
              </div>

              <div className="py-1">
                <Link
                  to="/app/settings"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-[#292522] hover:bg-[#F7F3EC] rounded-lg transition-colors"
                >
                  <Settings className="h-4 w-4 text-[#827B73]" />
                  Platform Settings
                </Link>
                <Link
                  to="/technician"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-[#292522] hover:bg-[#F7F3EC] rounded-lg transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px] text-[#827B73]">
                    engineering
                  </span>
                  Switch to Field Tech Mode
                </Link>
                <Link
                  to="/portal"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-[#292522] hover:bg-[#F7F3EC] rounded-lg transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px] text-[#827B73]">
                    home
                  </span>
                  Switch to Customer Portal
                </Link>
              </div>

              <div className="pt-1 border-t border-[#E8E0D6]">
                <Link
                  to="/login"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-[#9E3A3A] hover:bg-[#9E3A3A]/10 rounded-lg transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out / Switch Account
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
