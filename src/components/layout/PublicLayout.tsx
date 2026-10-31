import { Outlet, useLocation } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'

export function PublicLayout() {
  const location = useLocation()
  const isAuthPage = location.pathname === '/login'

  return (
    <div className="min-h-screen flex flex-col">
      {!isAuthPage && <Header />}
      <main className="flex-1">
        <Outlet />
      </main>
      {!isAuthPage && <Footer />}
    </div>
  )
}