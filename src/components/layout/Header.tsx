import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Sun, Zap } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

export function Header() {
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navigation = [
    { name: 'Solutions', href: '/solutions' },
    { name: 'Solar Calculator', href: '/solar-calculator' },
    { name: 'Request Survey', href: '/request-survey' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8" aria-label="Main navigation">
        <div className="flex items-center gap-8 lg:gap-12">
          <Link to="/" className="flex items-center gap-2" aria-label="SunPower One Home">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Sun className="h-5 w-5" aria-hidden="true" />
              <Zap className="h-5 w-5 text-yellow-400" aria-hidden="true" />
            </div>
            <span className="font-bold text-xl">SunPower One</span>
          </Link>

          <div className="hidden lg:flex lg:items-center lg:gap-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-primary',
                  location.pathname === item.href
                    ? 'text-primary'
                    : 'text-muted-foreground'
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex lg:hidden">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        <div className="hidden lg:flex lg:items-center lg:gap-4">
          <Link
            to="/login"
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Sign In
          </Link>
          <Link
            to="/request-survey"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div id="mobile-menu" className="lg:hidden border-t bg-background">
          <div className="space-y-1 px-4 py-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'block px-3 py-2 rounded-md text-base font-medium',
                  location.pathname === item.href
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4 border-t flex flex-col gap-2">
              <Link
                to="/login"
                className="text-center text-muted-foreground hover:text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link
                to="/request-survey"
                className="rounded-md bg-primary px-4 py-2 text-center text-sm font-medium text-primary-foreground hover:bg-primary/90"
                onClick={() => setMobileMenuOpen(false)}
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}