import React from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header as AppHeader } from './AppHeader'

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = React.useState(false)

  return (
    <div className="min-h-screen bg-[#F7F3EC] flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex flex-1 flex-col min-w-0">
        <AppHeader onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="mx-auto max-w-[1600px] w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
