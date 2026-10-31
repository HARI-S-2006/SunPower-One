import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, ArrowRight, Shield, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DemoCredential {
  email: string
  roleName: string
  roleCategory: 'director' | 'lead' | 'estimator' | 'technician' | 'customer'
  redirectUrl: string
}

const demoCredentials: DemoCredential[] = [
  {
    email: 'marcus.vance@sunpower-solutions.com',
    roleName: 'Admin (M. Vance)',
    roleCategory: 'director',
    redirectUrl: '/app/dashboard',
  },
  {
    email: 'm.kowalski@field.sunpower-solutions.com',
    roleName: 'Lead (M. Kowalski)',
    roleCategory: 'lead',
    redirectUrl: '/technician',
  },
  {
    email: 'elena.rostova@solar.sunpower-solutions.com',
    roleName: 'Solar Estimator',
    roleCategory: 'estimator',
    redirectUrl: '/app/quotations',
  },
]

export function LoginPage() {
  const navigate = useNavigate()
  const [selectedCred, setSelectedCred] = useState<DemoCredential>(demoCredentials[0])
  const [email, setEmail] = useState(demoCredentials[0].email)
  const [password, setPassword] = useState('••••••••••••••••')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberTerminal, setRememberTerminal] = useState(true)
  const [authState, setAuthState] = useState<'idle' | 'verifying' | 'success'>('idle')
  const [statusMessage, setStatusMessage] = useState('')

  const handleSelectDemo = (cred: DemoCredential) => {
    setSelectedCred(cred)
    setEmail(cred.email)
    setPassword('••••••••••••••••')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setAuthState('verifying')
    setStatusMessage('Verifying biometric credentials with HSM cluster #US-WEST-4...')

    setTimeout(() => {
      setStatusMessage('MFA challenge cleared. Provisioning telemetry workspace...')
    }, 800)

    setTimeout(() => {
      setAuthState('success')
      setStatusMessage('Authentication successful! Launching workspace...')
    }, 1500)

    setTimeout(() => {
      navigate(selectedCred.redirectUrl)
    }, 2000)
  }

  const handleSSO = (provider: string) => {
    setAuthState('verifying')
    setStatusMessage(`Redirecting to ${provider} Enterprise Identity Provider federated gateway...`)
    setTimeout(() => {
      navigate('/app/dashboard')
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-[#F7F3EC] flex flex-col justify-between selection:bg-[#FFD7CA] selection:text-[#7A5C51]">
      {/* Top Header */}
      <header className="w-full py-4 px-4 sm:px-8 flex items-center justify-between border-b border-[#E8E0D6] bg-white">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#172747] flex items-center justify-center text-[#FFDDB7] shadow-sm">
            <span className="material-symbols-outlined text-[22px]">solar_power</span>
          </div>
          <span className="font-display text-lg font-bold tracking-tight text-[#172747]">
            SUNPOWER
            <span className="text-[#493027] font-sans text-xs ml-1.5 font-semibold tracking-normal uppercase">
              Solutions
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-2 text-[#827B73] text-xs font-semibold uppercase tracking-wider">
          <span className="material-symbols-outlined text-[18px] text-[#B18751]">verified_user</span>
          <span className="hidden sm:inline">SOC-2 Type II • ISO 27001 Audited</span>
        </div>
      </header>

      {/* Main Authentication Grid */}
      <main className="w-full flex-1 flex flex-col justify-center py-6 sm:py-10">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 rounded-2xl shadow-warm-lg overflow-hidden bg-white border border-[#E8E0D6]">
            {/* LEFT HERO PANEL (Stitch 5 cols) */}
            <div className="lg:col-span-5 relative bg-[#493027] text-white p-6 sm:p-8 lg:p-10 flex flex-col justify-between overflow-hidden">
              {/* Solar Geometry Background */}
              <div className="absolute inset-0 pointer-events-none opacity-15">
                <svg className="w-full h-full object-cover" fill="none" viewBox="0 0 500 700">
                  <path className="text-[#FFDDB7]" d="M-50 150 L550 50" stroke="currentColor" strokeDasharray="4 8" strokeWidth="1.2" />
                  <path className="text-[#FFDDB7]" d="M-50 250 L550 150" stroke="currentColor" strokeWidth="1.2" />
                  <path className="text-[#FFDDB7]" d="M-50 350 L550 250" stroke="currentColor" strokeDasharray="6 6" strokeWidth="1.2" />
                  <path className="text-[#FFDDB7]" d="M-50 450 L550 350" stroke="currentColor" strokeWidth="1.2" />
                  <polygon className="text-[#FFDDB7]" fill="currentColor" fillOpacity="0.1" points="180,180 320,150 290,290 150,320" />
                  <polygon className="text-[#FFDDB7]" fill="currentColor" fillOpacity="0.07" points="150,330 290,300 260,440 120,470" />
                </svg>
              </div>

              {/* Panel Top: Brand & Tagline */}
              <div className="relative z-10 space-y-4">
                <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-3 py-1 text-white border border-white/10">
                  <span className="w-2 h-2 rounded-full bg-[#FFDDB7] animate-pulse" />
                  <span className="text-[11px] font-semibold tracking-widest uppercase text-[#FFDDB7]">
                    Industrial Telemetry Active
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[#172747] flex items-center justify-center text-[#FFDDB7] shadow-md border border-[#FFDDB7]/20">
                      <span className="material-symbols-outlined text-[28px]">solar_power</span>
                    </div>
                    <div>
                      <h1 className="font-display text-xl font-bold tracking-tight text-white">
                        SUNPOWER
                      </h1>
                      <p className="text-[10px] uppercase tracking-widest text-[#FFD7CA] font-semibold">
                        SOLUTIONS ENTERPRISE
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-[#EFE6E1] pt-2 italic font-medium">
                    &quot;Smart Solar Operations. Simplified.&quot;
                  </p>
                </div>

                {/* Enterprise Badges */}
                <div className="space-y-2.5 pt-2">
                  <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm flex items-start gap-3 border border-white/5">
                    <div className="p-1 rounded bg-[#3A2200] text-[#FFDDB7] mt-0.5">
                      <span className="material-symbols-outlined text-[18px]">domain_verification</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-white">Commercial Rooftop PV Telemetry</p>
                      <p className="text-[11px] text-[#EFE6E1]">
                        Multi-tenant portfolio balancing across high-capacity utility interconnects.
                      </p>
                    </div>
                  </div>

                  <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm flex items-start gap-3 border border-white/5">
                    <div className="p-1 rounded bg-[#3A2200] text-[#FFDDB7] mt-0.5">
                      <span className="material-symbols-outlined text-[18px]">verified</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-white">ISO-9001 Audited Operations</p>
                      <p className="text-[11px] text-[#EFE6E1]">
                        Hardware Security Module (HSM) FIPS 140-2 Level 3 verified authentication.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Solar Array Image Hero */}
              <div className="relative z-10 my-6 rounded-xl overflow-hidden shadow-md border border-white/10 group">
                <img
                  className="w-full h-36 object-cover object-center transform group-hover:scale-105 transition-transform duration-700 ease-out"
                  alt="Modern commercial rooftop solar panel array"
                  src="https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#172747]/90 via-transparent to-transparent flex items-end p-3">
                  <div className="flex items-center justify-between w-full text-white text-xs">
                    <span className="font-semibold text-[11px] uppercase tracking-wide opacity-90">
                      Site ID #AZ-8422 • Interconnect Live
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] bg-[#172747]/90 px-2 py-0.5 rounded-full text-[#FFDDB7]">
                      99.98% Pr
                    </span>
                  </div>
                </div>
              </div>

              {/* Operational Stats Strip */}
              <div className="relative z-10 space-y-2">
                <div className="bg-[#172747]/60 rounded-xl p-3 backdrop-blur-sm border border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-[#FFD7CA] uppercase tracking-wider font-semibold">
                        Managed Generation
                      </p>
                      <p className="font-display text-xl font-bold text-white tabular-nums">
                        74.2 <span className="text-xs text-[#FFDDB7] font-sans">MW DC</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-[#FFD7CA] uppercase tracking-wider font-semibold">
                        Commercial Sites
                      </p>
                      <p className="font-display text-xl font-bold text-white tabular-nums">
                        846 <span className="text-xs text-[#EFE6E1] font-sans">Sites</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[#EFE6E1] text-[11px] pt-1">
                  <span className="flex items-center gap-1">
                    <Shield className="h-3 w-3 text-[#FFDDB7]" />
                    SOC-2 Type II Certified
                  </span>
                  <span className="text-[#FFD7CA] opacity-40">•</span>
                  <span>256-Bit HSM Hardware Encrypted</span>
                </div>
              </div>
            </div>

            {/* RIGHT AUTHENTICATION CONTAINER (Stitch 7 cols) */}
            <div className="lg:col-span-7 bg-[#FBF2ED] p-6 sm:p-8 lg:p-12 flex flex-col justify-center items-center">
              <div className="w-full max-w-lg bg-white rounded-xl shadow-warm-sm border border-[#E8E0D6] p-6 sm:p-8">
                {/* Header */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#B18751] bg-[#F5ECE7] px-2.5 py-1 rounded-md">
                      Operations Gateway
                    </span>
                    <span className="text-xs text-[#827B73] flex items-center gap-1.5 font-semibold">
                      <span className="w-2 h-2 rounded-full bg-[#2D5A43]" /> System Nominal
                    </span>
                  </div>
                  <h2 className="font-display text-2xl text-[#172747] font-bold tracking-tight">
                    Command Center Sign In
                  </h2>
                  <p className="text-xs sm:text-sm text-[#827B73] mt-1">
                    Authenticate via verified multi-factor credentials or enterprise federated directory.
                  </p>
                </div>

                {/* Quick Simulation Profile Selector */}
                <div className="mb-6 p-2.5 bg-[#F5ECE7] rounded-xl border border-[#E8E0D6]">
                  <div className="flex items-center justify-between mb-2 px-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#827B73]">
                      Select Profile Simulation
                    </span>
                    <span className="text-[10px] font-semibold text-[#493027]">
                      Quick Credentials
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    {demoCredentials.map((cred) => {
                      const isSelected = selectedCred.email === cred.email
                      return (
                        <button
                          key={cred.email}
                          type="button"
                          onClick={() => handleSelectDemo(cred)}
                          className={cn(
                            'px-2 py-1.5 text-center rounded-lg text-xs font-semibold transition-all duration-150 truncate',
                            isSelected
                              ? 'bg-white text-[#172747] shadow-warm-sm border border-[#E8E0D6]'
                              : 'text-[#827B73] hover:bg-[#EFE6E1]'
                          )}
                        >
                          {cred.roleName}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Corporate Email */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <label className="font-semibold text-[#292522]" htmlFor="email">
                        Corporate Email Address
                      </label>
                      <span className="text-[#827B73]">SSO Enabled</span>
                    </div>
                    <div className="relative flex items-center">
                      <span className="material-symbols-outlined absolute left-3 text-[#827B73] text-[20px] pointer-events-none">
                        alternate_email
                      </span>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full h-10 pl-10 pr-4 bg-[#FBF2ED] text-[#292522] rounded-[10px] text-sm border border-[#E8E0D6] focus:bg-white focus:border-[#172747] focus:outline-none focus:ring-3 focus:ring-[#172747]/12 transition-all"
                      />
                    </div>
                  </div>

                  {/* Password / Passphrase */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <label className="font-semibold text-[#292522]" htmlFor="password">
                        Security Credential / Token
                      </label>
                      <button type="button" className="text-[#493027] hover:underline font-semibold">
                        Forgot key?
                      </button>
                    </div>
                    <div className="relative flex items-center">
                      <span className="material-symbols-outlined absolute left-3 text-[#827B73] text-[20px] pointer-events-none">
                        lock
                      </span>
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full h-10 pl-10 pr-10 bg-[#FBF2ED] text-[#292522] rounded-[10px] text-sm border border-[#E8E0D6] focus:bg-white focus:border-[#172747] focus:outline-none focus:ring-3 focus:ring-[#172747]/12 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 text-[#827B73] hover:text-[#292522] p-1"
                        aria-label="Toggle password view"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Trust Field Terminal & Session */}
                  <div className="flex items-center justify-between pt-1 text-xs">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberTerminal}
                        onChange={(e) => setRememberTerminal(e.target.checked)}
                        className="w-4 h-4 rounded text-[#172747] accent-[#172747]"
                      />
                      <span className="font-semibold text-[#292522]">Trust this field terminal</span>
                    </label>
                    <span className="text-[10px] font-semibold text-[#B18751] bg-[#F5ECE7] px-2 py-0.5 rounded">
                      30-Day HSM Session
                    </span>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={authState !== 'idle'}
                    className="w-full h-11 bg-[#172747] text-white rounded-[10px] text-sm font-semibold tracking-wide flex items-center justify-center gap-2 shadow-warm-sm hover:bg-[#1E345E] transition-all duration-200 mt-4 disabled:opacity-75 cursor-pointer group"
                  >
                    {authState === 'idle' ? (
                      <>
                        <span>Authenticate & Launch Workspace</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin text-[#FFDDB7]" />
                        <span>Verifying HSM Cluster...</span>
                      </>
                    )}
                  </button>
                </form>

                {/* Audit Status Notice */}
                {authState !== 'idle' && (
                  <div className="mt-4 p-3 rounded-lg bg-[#F5ECE7] text-xs text-[#172747] flex items-center gap-2 border border-[#E8E0D6] animate-fade-in">
                    <RefreshCw className="h-4 w-4 animate-spin text-[#493027] shrink-0" />
                    <span className="font-medium">{statusMessage}</span>
                  </div>
                )}

                {/* SSO Divider */}
                <div className="relative my-6 text-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full bg-[#E8E0D6] h-[1px]" />
                  </div>
                  <span className="relative bg-white px-3 text-[10px] font-bold uppercase tracking-wider text-[#827B73]">
                    Or Enterprise Provider
                  </span>
                </div>

                {/* Enterprise SSO Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleSSO('Okta')}
                    className="h-10 px-3 rounded-[10px] bg-[#FBF2ED] hover:bg-[#F5ECE7] text-xs font-semibold text-[#292522] flex items-center justify-center gap-2 border border-[#E8E0D6] transition-all"
                  >
                    <span className="w-4 h-4 rounded-full bg-[#172747] flex items-center justify-center text-white font-bold text-[9px]">
                      O
                    </span>
                    <span>Okta Enterprise SSO</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSSO('Azure AD')}
                    className="h-10 px-3 rounded-[10px] bg-[#FBF2ED] hover:bg-[#F5ECE7] text-xs font-semibold text-[#292522] flex items-center justify-center gap-2 border border-[#E8E0D6] transition-all"
                  >
                    <div className="grid grid-cols-2 gap-0.5 w-3.5 h-3.5">
                      <span className="bg-[#F25022]" />
                      <span className="bg-[#7FBA00]" />
                      <span className="bg-[#00A4EF]" />
                      <span className="bg-[#FFB900]" />
                    </div>
                    <span>Microsoft Azure AD</span>
                  </button>
                </div>
              </div>

              {/* Footer Regulatory Notice */}
              <div className="w-full max-w-lg mt-4 text-center space-y-1 text-[#827B73] text-xs">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#7A5C51]">
                  Contractor License #C46-1049281 • C-10 Electrical Specialist
                </p>
                <p className="text-[10px] leading-tight opacity-75">
                  Authorized Personnel Only. System activity is logged under ISO 27001 regulatory compliance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-[#827B73] text-xs border-t border-[#E8E0D6] bg-white">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 text-[#2D5A43] font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#2D5A43]" /> TLS 1.3 256-Bit Encrypted
          </span>
          <span>•</span>
          <span>© 2026 SunPower Solutions Inc. All rights reserved.</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/about" className="hover:text-[#172747]">Security Whitepaper</Link>
          <Link to="/contact" className="hover:text-[#172747]">System Status</Link>
        </div>
      </footer>
    </div>
  )
}
