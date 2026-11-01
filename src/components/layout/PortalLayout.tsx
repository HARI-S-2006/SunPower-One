import { useState } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  FileText,
  Package,
  Shield,
  LifeBuoy,
  User,
  ArrowLeft,
  Menu,
  X,
  Sun,
  Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSolarStore } from '@/lib/store/solarStore'

const portalNavigation = [
  { name: 'System Overview', href: '/portal', icon: LayoutDashboard },
  { name: 'Quotations & Proposals', href: '/portal/quotations', icon: FileText },
  { name: 'Active Orders', href: '/portal/orders', icon: Package },
  { name: 'Equipment & Serials', href: '/portal/equipment', icon: Package },
  { name: 'Warranty Certificates', href: '/portal/warranty', icon: Shield },
  { name: 'Service & Support', href: '/portal/service', icon: LifeBuoy },
  { name: 'Account Profile', href: '/portal/profile', icon: User },
]

export function PortalLayout() {
  const { customerProfile } = useSolarStore()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const initials = customerProfile.name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="min-h-screen bg-[#F7F3EC] flex flex-col lg:flex-row">
      {/* Mobile Backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-[#302019]/70 backdrop-blur-sm lg:hidden transition-opacity',
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      {/* Customer Portal Sidebar */}
      <aside
        className={cn(
          'fixed lg:sticky top-0 z-50 flex h-screen w-64 shrink-0 flex-col bg-[#302019] text-[#FFF8F5] transition-transform duration-200 border-r border-[#493027] shadow-xl',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
        aria-label="Customer self-service navigation"
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-[#493027] px-4 bg-[#261914]">
          <Link
            to="/portal"
            className="flex items-center gap-2"
            onClick={() => setSidebarOpen(false)}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#172747] text-[#FFDDB7] shadow border border-[#493027]">
              <span className="material-symbols-outlined text-[20px]">solar_power</span>
            </div>
            <div>
              <span className="font-display font-bold text-sm tracking-tight text-white block">
                SUNPOWER
              </span>
              <span className="text-[10px] text-[#FFDDB7] uppercase font-semibold">
                Customer Portal
              </span>
            </div>
          </Link>

          <button
            type="button"
            className="lg:hidden p-1.5 rounded-lg text-[#E5BEB1] hover:bg-[#493027]"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Customer Site Identification Card */}
        <div className="p-3 bg-[#38251D] border-b border-[#493027]">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full bg-[#172747] text-[#FFDDB7] flex items-center justify-center font-bold text-xs border border-[#FFDDB7]/20">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">{customerProfile.name}</p>
              <p className="text-[10px] text-[#E5BEB1] truncate">Site #{customerProfile.siteId} • {customerProfile.solarCapacity}</p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {portalNavigation.map((item) => {
            const isActive =
              location.pathname === item.href ||
              (item.href !== '/portal' && location.pathname.startsWith(item.href)) ||
              (item.href === '/portal/warranty' && location.pathname.startsWith('/portal/warrant'))
            const Icon = item.icon

            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold transition-colors',
                  isActive
                    ? 'bg-[#172747] text-white border-l-2 border-[#FFDDB7]'
                    : 'text-[#E5BEB1] hover:bg-[#493027] hover:text-white'
                )}
              >
                <Icon className="h-4 w-4 text-[#D9CFBD]" />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>

        {/* Return to ERP Command Center */}
        <div className="p-3 border-t border-[#493027] bg-[#261914]">
          <Link
            to="/app/dashboard"
            className="flex items-center justify-center gap-1.5 w-full py-2 rounded-lg bg-[#172747] text-white text-xs font-semibold hover:bg-[#1E345E] transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Command Center
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0">
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-[#E8E0D6] bg-white px-4 lg:px-8 shadow-warm-sm">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="lg:hidden p-2 rounded-lg text-[#493027] hover:bg-[#F7F3EC]"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open portal navigation"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2">
              <Sun className="h-4 w-4 text-[#B68B55]" />
              <h1 className="font-headline text-sm font-bold text-[#292522]">
                My Solar Dashboard & Building Telemetry
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#2D5A43]/10 text-[#2D5A43] font-semibold border border-[#2D5A43]/20">
              <Zap className="h-3.5 w-3.5" />
              <span>Generating Clean Power ({customerProfile.liveOutputKw} kW)</span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="mx-auto max-w-6xl w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
