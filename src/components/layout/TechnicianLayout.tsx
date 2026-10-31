import { useState } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import {
  ListTodo,
  QrCode,
  CheckCircle2,
  HardHat,
  ArrowLeft,
  Menu,
  X,
  Smartphone,
  PhoneCall,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const techNavigation = [
  { name: 'Field Jobs', href: '/technician', icon: ListTodo, badge: '3 Assigned' },
  { name: 'Barcode / QR Scan', href: '/technician/scan', icon: QrCode },
  { name: 'Commissioning Checklist', href: '/technician/checklist', icon: CheckCircle2 },
]

export function TechnicianLayout() {
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#F7F3EC] flex flex-col lg:flex-row">
      {/* Mobile Drawer Backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-[#302019]/70 backdrop-blur-sm lg:hidden transition-opacity',
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      {/* Field Technician Sidebar */}
      <aside
        className={cn(
          'fixed lg:sticky top-0 z-50 flex h-screen w-64 shrink-0 flex-col bg-[#302019] text-[#FFF8F5] transition-transform duration-200 border-r border-[#493027] shadow-xl',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
        aria-label="Field technician navigation"
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-[#493027] px-4 bg-[#261914]">
          <Link
            to="/technician"
            className="flex items-center gap-2"
            onClick={() => setSidebarOpen(false)}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#B68B55] text-[#302019] font-bold shadow">
              <HardHat className="h-5 w-5" />
            </div>
            <div>
              <span className="font-display font-bold text-sm tracking-tight text-white block">
                FIELD CREW
              </span>
              <span className="text-[10px] text-[#FFDDB7] uppercase font-semibold">
                SunPower Mobile
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

        {/* Technician Active Status */}
        <div className="p-3 bg-[#38251D] border-b border-[#493027] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#4ADE80] animate-pulse" />
            <span className="font-semibold text-white">Mateo Kowalski</span>
          </div>
          <span className="text-[10px] font-mono uppercase bg-[#172747] text-[#FFDDB7] px-1.5 py-0.5 rounded">
            Crew Lead #04
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {techNavigation.map((item) => {
            const isActive =
              location.pathname === item.href ||
              (item.href !== '/technician' && location.pathname.startsWith(item.href))
            const Icon = item.icon

            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center justify-between rounded-lg px-3 py-2.5 text-xs font-semibold transition-colors min-h-[44px]',
                  isActive
                    ? 'bg-[#172747] text-white border-l-2 border-[#FFDDB7]'
                    : 'text-[#E5BEB1] hover:bg-[#493027] hover:text-white'
                )}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="h-4 w-4 text-[#D9CFBD]" />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="rounded bg-[#B68B55] px-1.5 py-0.5 text-[10px] font-bold text-[#302019]">
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Emergency Hotline & Return to Command Center */}
        <div className="p-3 border-t border-[#493027] bg-[#261914] space-y-2">
          <div className="p-2 rounded-lg bg-[#302019] border border-[#493027] text-xs text-[#E5BEB1] flex items-center gap-2">
            <PhoneCall className="h-4 w-4 text-[#B68B55] shrink-0" />
            <div>
              <p className="font-semibold text-white text-[11px]">Dispatch Control</p>
              <p className="text-[10px] font-mono text-[#D9CFBD]">+91 (800) 555-SOLAR</p>
            </div>
          </div>

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
        <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between border-b border-[#E8E0D6] bg-white px-4 lg:px-6 shadow-warm-sm">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="lg:hidden p-2 rounded-lg text-[#493027] hover:bg-[#F7F3EC]"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open field navigation"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2">
              <Smartphone className="h-4 w-4 text-[#172747]" />
              <h1 className="font-headline text-sm font-bold text-[#292522]">
                Technician Field Portal
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="hidden sm:inline text-[#827B73]">Current Zone:</span>
            <span className="font-semibold text-[#292522] bg-[#F7F3EC] px-2 py-1 rounded-md border border-[#E8E0D6]">
              Sector 4 - Whitefield
            </span>
          </div>
        </header>

        <main className="flex-1 p-3 sm:p-5 lg:p-6 overflow-y-auto">
          <div className="mx-auto max-w-4xl w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
