import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  X,
  LayoutDashboard,
  Users,
  User,
  Calendar,
  Package,
  FileText,
  Truck,
  Hammer,
  Shield,
  LifeBuoy,
  DollarSign,
  BarChart3,
  Bot,
  Bell,
  Settings,
  ChevronDown,
  ChevronRight,
  QrCode,
  ExternalLink,
  Smartphone,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { SerialScannerModal } from '@/components/ui/SerialScannerModal'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

interface NavGroup {
  label: string
  items: {
    name: string
    href: string
    icon: React.ElementType
    badge?: string
    highlight?: boolean
  }[]
}

const navGroups: NavGroup[] = [
  {
    label: 'Overview',
    items: [
      { name: 'Operations Dashboard', href: '/app/dashboard', icon: LayoutDashboard },
    ],
  },
  {
    label: 'CRM & Pipeline',
    items: [
      { name: 'Leads & Inquiries', href: '/app/crm/leads', icon: Users, badge: '4 New' },
      { name: 'Customer Directory', href: '/app/customers', icon: User },
    ],
  },
  {
    label: 'Surveys & Engineering',
    items: [
      { name: 'Site Surveys & Feasibility', href: '/app/surveys', icon: Calendar, badge: '2 Pending' },
      { name: 'Solar Configurator (1-5kW)', href: '/app/configurator', icon: Package },
    ],
  },
  {
    label: 'Sales & Quotations',
    items: [
      { name: 'Quotations & Pricing', href: '/app/quotations', icon: FileText },
      { name: 'Bill of Materials (BOM)', href: '/app/bom', icon: FileText },
      { name: 'Sales Orders', href: '/app/orders', icon: Truck },
      { name: 'Milestone Payments', href: '/app/payments', icon: DollarSign },
    ],
  },
  {
    label: 'Inventory & Dispatch',
    items: [
      { name: 'Stock & Warehouse', href: '/app/inventory', icon: Package },
      { name: 'Serial Number Registry', href: '/app/inventory/serials', icon: QrCode, highlight: true },
      { name: 'Dispatch Staging', href: '/app/inventory/dispatch', icon: Truck },
      { name: 'Product Catalogue', href: '/app/products', icon: Package },
      { name: 'Suppliers & Procurement', href: '/app/suppliers', icon: Truck },
    ],
  },
  {
    label: 'Installations & Field',
    items: [
      { name: 'Crew Operations', href: '/app/installations', icon: Hammer },
      { name: '15 Technicians Roster', href: '/app/technicians', icon: Users },
      { name: 'Crew Schedules', href: '/app/technician-schedule', icon: Calendar },
    ],
  },
  {
    label: 'Warranty & Service',
    items: [
      { name: 'Warranty Management', href: '/app/warranties', icon: Shield },
      { name: 'Service Tickets Desk', href: '/app/service', icon: LifeBuoy, badge: '1 Open' },
    ],
  },
  {
    label: 'Finance & Analytics',
    items: [
      { name: 'Customer Invoices', href: '/app/invoices', icon: FileText },
      { name: 'Expense Ledger', href: '/app/expenses', icon: DollarSign },
      { name: 'Technician Settlements', href: '/app/technician-payments', icon: DollarSign },
      { name: 'Government Subsidies', href: '/app/subsidies', icon: Shield },
      { name: 'Project Profitability', href: '/app/profitability', icon: BarChart3 },
      { name: 'Business Analytics', href: '/app/analytics', icon: BarChart3 },
    ],
  },
  {
    label: 'Intelligence & Platform',
    items: [
      { name: 'Solar Intelligence AI', href: '/app/ai-assistant', icon: Bot },
      { name: 'System Notifications', href: '/app/notifications', icon: Bell },
      { name: 'Configuration & Settings', href: '/app/settings', icon: Settings },
    ],
  },
]

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation()
  const [scannerOpen, setScannerOpen] = useState(false)
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({})

  const toggleGroup = (groupLabel: string) => {
    setCollapsedGroups((prev) => ({ ...prev, [groupLabel]: !prev[groupLabel] }))
  }

  return (
    <>
      {/* Mobile Backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-[#302019]/70 backdrop-blur-sm lg:hidden transition-opacity',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={cn(
          'fixed lg:sticky top-0 z-50 flex h-screen w-72 flex-col bg-[#302019] text-[#FFF8F5] transition-transform duration-200 border-r border-[#493027] shadow-xl',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
        aria-label="Main enterprise navigation"
      >
        {/* Brand Header */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-[#493027] px-5 bg-[#261914]">
          <Link
            to="/app/dashboard"
            className="flex items-center gap-2.5 group"
            onClick={onClose}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#172747] text-[#FFDDB7] shadow-md border border-[#493027] group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[22px]">solar_power</span>
            </div>
            <div className="leading-none">
              <div className="font-display font-bold tracking-tight text-base text-white flex items-center gap-1.5">
                SUNPOWER
                <span className="text-[10px] font-sans font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-[#493027] text-[#FFDDB7]">
                  ERP
                </span>
              </div>
              <p className="text-[10px] uppercase tracking-widest text-[#E5BEB1] mt-0.5 font-medium">
                Solutions Enterprise
              </p>
            </div>
          </Link>

          <button
            type="button"
            className="lg:hidden inline-flex items-center justify-center rounded-lg p-1.5 text-[#E5BEB1] hover:bg-[#493027] hover:text-white"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Telemetry Live Badge & Quick Scanner Action */}
        <div className="px-4 py-3 bg-[#38251D] border-b border-[#493027]/80 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2D5A43] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4ADE80]" />
            </span>
            <span className="font-mono text-[11px] text-[#E5BEB1] font-medium tracking-tight">
              SCADA GRID 99.98%
            </span>
          </div>

          <button
            onClick={() => setScannerOpen(true)}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-[#172747] text-[#FFDDB7] hover:bg-[#1E345E] transition-colors border border-[#FFDDB7]/20 shadow-sm"
            title="Scan asset serial or QR code"
          >
            <QrCode className="h-3.5 w-3.5" />
            Scan QR
          </button>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-4" role="navigation">
          {navGroups.map((group) => {
            const isCollapsed = collapsedGroups[group.label]
            return (
              <div key={group.label} className="space-y-1">
                <button
                  onClick={() => toggleGroup(group.label)}
                  className="w-full flex items-center justify-between px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#D9CFBD]/80 hover:text-white transition-colors"
                >
                  <span>{group.label}</span>
                  {isCollapsed ? (
                    <ChevronRight className="h-3 w-3 opacity-60" />
                  ) : (
                    <ChevronDown className="h-3 w-3 opacity-60" />
                  )}
                </button>

                {!isCollapsed && (
                  <ul className="space-y-0.5">
                    {group.items.map((item) => {
                      const isActive =
                        location.pathname === item.href ||
                        (item.href !== '/app/dashboard' &&
                          location.pathname.startsWith(item.href))
                      const Icon = item.icon

                      return (
                        <li key={item.name}>
                          <Link
                            to={item.href}
                            onClick={onClose}
                            className={cn(
                              'group flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all duration-150',
                              isActive
                                ? 'bg-[#172747] text-white shadow-sm font-semibold border-l-2 border-[#FFDDB7]'
                                : 'text-[#E5BEB1] hover:bg-[#493027] hover:text-white'
                            )}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <Icon
                                className={cn(
                                  'h-4 w-4 shrink-0 transition-colors',
                                  isActive
                                    ? 'text-[#FFDDB7]'
                                    : 'text-[#D9CFBD] group-hover:text-white'
                                )}
                              />
                              <span className="truncate">{item.name}</span>
                            </div>

                            {item.badge && (
                              <span
                                className={cn(
                                  'ml-2 rounded px-1.5 py-0.2 text-[10px] font-bold tracking-tight',
                                  isActive
                                    ? 'bg-[#FFDDB7] text-[#172747]'
                                    : 'bg-[#493027] text-[#FFDDB7]'
                                )}
                              >
                                {item.badge}
                              </span>
                            )}
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </div>
            )
          })}

          {/* Quick Links to Other Portals for Demo Pair-Programming */}
          <div className="pt-2 border-t border-[#493027]">
            <p className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#D9CFBD]/80">
              Demo Portal Switcher
            </p>
            <div className="grid grid-cols-2 gap-1.5 px-1 pt-1">
              <Link
                to="/technician"
                className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-[#261914] text-[11px] font-medium text-[#FFDDB7] hover:bg-[#493027] border border-[#493027]"
              >
                <Smartphone className="h-3.5 w-3.5" />
                Technician
              </Link>
              <Link
                to="/portal"
                className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-[#261914] text-[11px] font-medium text-[#FFDDB7] hover:bg-[#493027] border border-[#493027]"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Customer
              </Link>
            </div>
          </div>
        </nav>

        {/* User Card & Active Role Footprint */}
        <div className="p-3 border-t border-[#493027] bg-[#261914]">
          <div className="flex items-center gap-2.5 rounded-lg bg-[#302019] p-2 border border-[#493027]">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#172747] text-white font-bold text-xs border border-[#FFDDB7]/30">
              MV
            </div>
            <div className="min-w-0 flex-1 leading-tight">
              <p className="truncate text-xs font-semibold text-white">Marcus Vance</p>
              <p className="truncate text-[10px] text-[#E5BEB1]">Executive Director</p>
            </div>
            <span className="h-2 w-2 rounded-full bg-[#4ADE80]" title="Session Verified" />
          </div>
        </div>
      </aside>

      {/* Global Interactive QR Scanner Modal */}
      <SerialScannerModal
        isOpen={scannerOpen}
        onClose={() => setScannerOpen(false)}
        onScanSuccess={(serial) => {
          alert(`Scanned asset serial: ${serial}\nStatus: Verified against Inventory Ledger.`)
        }}
      />
    </>
  )
}
