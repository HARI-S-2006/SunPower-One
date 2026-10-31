import { Link } from 'react-router-dom'
import { Home, ArrowLeft, SunMedium, Compass } from 'lucide-react'

export function NotFoundPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 bg-[#F7F3EC]">
      <div className="max-w-md w-full bg-white rounded-xl border border-[#E8E0D6] shadow-sm p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#F7F3EC] border border-[#E8E0D6] flex items-center justify-center text-[#B68B55]">
          <Compass className="w-8 h-8 animate-pulse" />
        </div>
        
        <span className="inline-block px-3 py-1 mb-3 text-xs font-semibold uppercase tracking-wider text-[#B68B55] bg-[#F7F3EC] rounded-full border border-[#E8E0D6]">
          404 Error
        </span>
        
        <h1 className="text-3xl font-serif font-bold text-[#172747] mb-3">
          Page Not Found
        </h1>
        
        <p className="text-sm text-[#493027]/80 mb-8 leading-relaxed">
          The requested solar management route or document could not be located. It may have moved or the address may have a typo.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#172747] text-white text-sm font-medium hover:bg-[#1f345e] transition-colors shadow-sm"
          >
            <Home className="w-4 h-4" />
            Return Home
          </Link>
          <Link
            to="/solar-calculator"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#F7F3EC] text-[#172747] border border-[#E8E0D6] text-sm font-medium hover:bg-[#EFEAE1] transition-colors"
          >
            <SunMedium className="w-4 h-4 text-[#B68B55]" />
            Solar Calculator
          </Link>
        </div>
      </div>
    </div>
  )
}

