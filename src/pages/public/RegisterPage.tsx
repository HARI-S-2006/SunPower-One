import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, ArrowRight, Shield, RefreshCw, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

type AccountCategory = 'residential' | 'commercial' | 'epc_partner'
type AuthMode = 'register' | 'login'

interface CategoryOption {
  id: AccountCategory
  title: string
  subtitle: string
  defaultRedirect: string
}

const accountCategories: CategoryOption[] = [
  {
    id: 'residential',
    title: 'Residential Customer',
    subtitle: 'Rooftop PV & Home Battery',
    defaultRedirect: '/portal/dashboard',
  },
  {
    id: 'commercial',
    title: 'Commercial & Industrial',
    subtitle: 'Enterprise Rooftops & P&L',
    defaultRedirect: '/app/dashboard',
  },
  {
    id: 'epc_partner',
    title: 'Solar Partner / EPC',
    subtitle: 'Installers & Contractors',
    defaultRedirect: '/app/crm/leads',
  },
]

interface DemoCredential {
  id: 'admin' | 'employee' | 'customer'
  email: string
  roleName: string
  roleCategory: 'director' | 'employee' | 'customer'
  redirectUrl: string
}

const demoCredentials: DemoCredential[] = [
  {
    id: 'admin',
    email: 'admin@sunpower-solutions.com',
    roleName: 'Admin',
    roleCategory: 'director',
    redirectUrl: '/app/dashboard',
  },
  {
    id: 'employee',
    email: 'sales@demo.com',
    roleName: 'Employee',
    roleCategory: 'employee',
    redirectUrl: '/app/crm/leads',
  },
  {
    id: 'customer',
    email: 'customer@demo.com',
    roleName: 'Customer',
    roleCategory: 'customer',
    redirectUrl: '/portal/dashboard',
  },
]

const roleRedirectMap: Record<string, { email: string; name: string; url: string }> = {
  director: { email: 'director@demo.com', name: 'Executive Director', url: '/app/dashboard' },
  sales: { email: 'sales@demo.com', name: 'Sales Executive', url: '/app/crm/leads' },
  survey: { email: 'survey@demo.com', name: 'Survey Engineer', url: '/app/surveys' },
  warehouse: { email: 'warehouse@demo.com', name: 'Warehouse Manager', url: '/app/inventory' },
  technician: { email: 'tech@demo.com', name: 'Field Technician', url: '/technician/dashboard' },
  finance: { email: 'finance@demo.com', name: 'Finance Controller', url: '/app/invoices' },
  support: { email: 'support@demo.com', name: 'Service Desk Support', url: '/app/service' },
  customer: { email: 'customer@demo.com', name: 'Solar Customer', url: '/portal/dashboard' },
}

export function RegisterPage() {
  const navigate = useNavigate()
  const [authMode, setAuthMode] = useState<AuthMode>('register')

  // Register state
  const [selectedCategory, setSelectedCategory] = useState<AccountCategory>('residential')
  const [fullName, setFullName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [companyOrProperty, setCompanyOrProperty] = useState('')
  const [installationAddress, setInstallationAddress] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showRegPassword, setShowRegPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [registerState, setRegisterState] = useState<'idle' | 'submitting' | 'success'>('idle')

  // Login state
  const [selectedProfile, setSelectedProfile] = useState<'admin' | 'employee' | 'customer'>('admin')
  const [selectedRole, setSelectedRole] = useState('sales')
  const [loginEmail, setLoginEmail] = useState(demoCredentials[0].email)
  const [loginPassword, setLoginPassword] = useState('••••••••••••••••')
  const [showLoginPassword, setShowLoginPassword] = useState(false)
  const [rememberTerminal, setRememberTerminal] = useState(true)
  const [loginState, setLoginState] = useState<'idle' | 'verifying' | 'success'>('idle')

  const [errorMessage, setErrorMessage] = useState('')
  const [statusMessage, setStatusMessage] = useState('')

  const handleSelectDemo = (cred: DemoCredential) => {
    setSelectedProfile(cred.id)
    setLoginPassword('••••••••••••••••')
    if (cred.id === 'admin') {
      setLoginEmail(cred.email)
      setSelectedRole('director')
    } else if (cred.id === 'customer') {
      setLoginEmail(cred.email)
      setSelectedRole('customer')
    } else if (cred.id === 'employee') {
      const activeRole = selectedRole === 'customer' || selectedRole === 'technician' ? 'sales' : selectedRole
      setSelectedRole(activeRole)
      setLoginEmail(roleRedirectMap[activeRole]?.email || cred.email)
    }
  }

  const handleRoleChange = (role: string) => {
    setSelectedRole(role)
    const match = roleRedirectMap[role]
    if (match) {
      setLoginEmail(match.email)
      setLoginPassword('••••••••••••••••')
    }
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')

    if (!agreeTerms) {
      setErrorMessage('Please accept the Terms of Service and Privacy Policy to continue.')
      return
    }

    if (regPassword.length < 8) {
      setErrorMessage('Password must be at least 8 characters in length.')
      return
    }

    if (regPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify your password entry.')
      return
    }

    setRegisterState('submitting')
    setStatusMessage('Provisioning secure account credentials and configuring solar workspace...')

    const selectedOption = accountCategories.find((c) => c.id === selectedCategory)
    const targetUrl = selectedOption?.defaultRedirect || '/portal/dashboard'

    setTimeout(() => {
      setRegisterState('success')
      setStatusMessage('Registration complete! Launching your personalized solar control center...')
      setTimeout(() => {
        navigate(targetUrl)
      }, 1200)
    }, 1000)
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')
    setLoginState('verifying')
    setStatusMessage('Authentication successful! Launching workspace...')

    let destination = '/app/dashboard'
    if (selectedProfile === 'customer' || loginEmail.toLowerCase().includes('customer')) {
      destination = '/portal/dashboard'
    } else if (selectedProfile === 'admin') {
      destination = '/app/dashboard'
    } else {
      destination = roleRedirectMap[selectedRole]?.url || '/app/dashboard'
    }

    setTimeout(() => {
      setLoginState('success')
      navigate(destination)
    }, 150)
  }

  const handleSSO = (provider: string) => {
    const isReg = authMode === 'register'
    if (isReg) {
      setRegisterState('submitting')
      setStatusMessage(`Initiating ${provider} Federated Single Sign-On registration handshake...`)
    } else {
      setLoginState('verifying')
      setStatusMessage(`Redirecting to ${provider} Enterprise Identity Provider federated gateway...`)
    }

    setTimeout(() => {
      if (isReg) {
        setRegisterState('success')
        setStatusMessage(`${provider} account linked! Redirecting to workspace...`)
      } else {
        setLoginState('success')
      }
      setTimeout(() => {
        navigate(isReg ? '/portal/dashboard' : '/app/dashboard')
      }, 1200)
    }, 1200)
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

      {/* Main Container */}
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

              {/* Panel Top: Brand & Highlights */}
              <div className="relative z-10 space-y-4">
                <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-3 py-1 text-white border border-white/10">
                  <span className="w-2 h-2 rounded-full bg-[#FFDDB7] animate-pulse" />
                  <span className="text-[11px] font-semibold tracking-widest uppercase text-[#FFDDB7]">
                    {authMode === 'register' ? 'Enterprise Onboarding Active' : 'Industrial Telemetry Active'}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[#172747] flex items-center justify-center text-[#FFDDB7] shadow-md border border-[#FFDDB7]/20">
                      <span className="material-symbols-outlined text-[28px]">
                        {authMode === 'register' ? 'how_to_reg' : 'solar_power'}
                      </span>
                    </div>
                    <div>
                      <h1 className="font-display text-xl font-bold tracking-tight text-white">
                        {authMode === 'register' ? 'REGISTER' : 'SUNPOWER'}
                      </h1>
                      <p className="text-[10px] uppercase tracking-widest text-[#FFD7CA] font-semibold">
                        {authMode === 'register' ? 'SUNPOWER ONE PLATFORM' : 'SOLUTIONS ENTERPRISE'}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-[#EFE6E1] pt-2 italic font-medium">
                    {authMode === 'register'
                      ? '"Join over 840+ commercial and residential solar assets managed seamlessly."'
                      : '"Smart Solar Operations. Simplified."'}
                  </p>
                </div>

                {/* Features & Benefits */}
                <div className="space-y-2.5 pt-2">
                  <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm flex items-start gap-3 border border-white/5">
                    <div className="p-1 rounded bg-[#3A2200] text-[#FFDDB7] mt-0.5">
                      <span className="material-symbols-outlined text-[18px]">solar_power</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-white">Real-Time Photovoltaic Telemetry</p>
                      <p className="text-[11px] text-[#EFE6E1]">
                        Live inverter telemetry, battery health tracking, and generation analytics.
                      </p>
                    </div>
                  </div>

                  <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm flex items-start gap-3 border border-white/5">
                    <div className="p-1 rounded bg-[#3A2200] text-[#FFDDB7] mt-0.5">
                      <span className="material-symbols-outlined text-[18px]">assignment_turned_in</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-white">Automated BOM & Commissioning</p>
                      <p className="text-[11px] text-[#EFE6E1]">
                        Instant bill-of-materials calculation, technician dispatch, and digital sign-off.
                      </p>
                    </div>
                  </div>

                  <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm flex items-start gap-3 border border-white/5">
                    <div className="p-1 rounded bg-[#3A2200] text-[#FFDDB7] mt-0.5">
                      <span className="material-symbols-outlined text-[18px]">verified_user</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-white">Institutional Grade Security</p>
                      <p className="text-[11px] text-[#EFE6E1]">
                        SOC-2 Type II audit compliant, role-based access control, and 256-bit encryption.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Solar Array Graphic Visual */}
              <div className="relative z-10 my-6 rounded-xl overflow-hidden shadow-md border border-white/10 bg-gradient-to-br from-[#1E345E] to-[#0A1A3A] h-28 flex items-center justify-center">
                <svg className="w-full h-full opacity-40 absolute inset-0" viewBox="0 0 400 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 120 L100 60 L300 60 L400 120 Z" fill="#172747" stroke="#FFDDB7" strokeWidth="1.5" />
                  <path d="M50 120 L120 60 M100 120 L150 60 M150 120 L180 60 M200 120 L210 60 M250 120 L240 60 M300 120 L270 60 M350 120 L300 60" stroke="#FFDDB7" strokeWidth="1" strokeDasharray="2 2" />
                  <circle cx="200" cy="35" r="22" fill="#B18751" fillOpacity="0.3" stroke="#FFDDB7" strokeWidth="1.5" />
                </svg>
                <div className="absolute inset-0 bg-gradient-to-t from-[#172747]/95 via-transparent to-transparent flex items-end p-3">
                  <div className="flex items-center justify-between w-full text-white text-xs z-10">
                    <span className="font-semibold text-[11px] uppercase tracking-wide opacity-90">
                      {authMode === 'register' ? 'Rapid Solar Onboarding' : 'Site ID #AZ-8422 Verified'}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] bg-[#172747]/90 px-2 py-0.5 rounded-full text-[#FFDDB7]">
                      {authMode === 'register' ? '100% Free Setup' : '99.98% Uptime'}
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
                      <p className="font-display text-lg font-bold text-white tabular-nums">
                        74.2 <span className="text-xs text-[#FFDDB7] font-sans">MW DC</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-[#FFD7CA] uppercase tracking-wider font-semibold">
                        Commercial Sites
                      </p>
                      <p className="font-display text-lg font-bold text-white tabular-nums">
                        846 <span className="text-xs text-[#EFE6E1] font-sans">Sites</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[#EFE6E1] text-[11px] pt-1">
                  <span className="flex items-center gap-1">
                    <Shield className="h-3 w-3 text-[#FFDDB7]" />
                    GDPR & SOC-2 Compliant
                  </span>
                  <span className="text-[#FFD7CA] opacity-40">•</span>
                  <span>Zero Spam Guarantee</span>
                </div>
              </div>
            </div>

            {/* RIGHT FORM CONTAINER (Stitch 7 cols) */}
            <div className="lg:col-span-7 bg-[#FBF2ED] p-6 sm:p-8 lg:p-10 flex flex-col justify-center items-center">
              <div className="w-full max-w-lg bg-white rounded-xl shadow-warm-sm border border-[#E8E0D6] p-6 sm:p-8">
                {/* Header */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#B18751] bg-[#F5ECE7] px-2.5 py-1 rounded-md">
                      {authMode === 'register' ? 'SolarSync 360 • Account Creation' : 'SolarSync 360 • Operations Gateway'}
                    </span>
                    <span className="text-xs text-[#827B73] flex items-center gap-1.5 font-semibold">
                      <span className="w-2 h-2 rounded-full bg-[#2D5A43]" /> System Nominal
                    </span>
                  </div>
                  <h2 className="font-display text-2xl text-[#172747] font-bold tracking-tight">
                    {authMode === 'register' ? 'Create Your Account' : 'SolarSync 360 Sign In'}
                  </h2>
                  <p className="text-xs sm:text-sm text-[#827B73] mt-1">
                    {authMode === 'register'
                      ? 'Select your account category and provide your details to register.'
                      : 'Authenticate via verified credentials or enterprise federated directory.'}
                  </p>
                </div>

                {/* Top Tab Mode Switcher: Sign In vs Register */}
                <div className="grid grid-cols-2 gap-1.5 p-1.5 bg-[#F5ECE7] rounded-xl border border-[#E8E0D6] mb-4">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('login')
                      setErrorMessage('')
                    }}
                    className={cn(
                      'py-2 px-3 text-center rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer',
                      authMode === 'login'
                        ? 'bg-white text-[#172747] shadow-warm-sm border border-[#E8E0D6]'
                        : 'text-[#827B73] hover:text-[#292522] hover:bg-[#EFE6E1]'
                    )}
                  >
                    <span className="material-symbols-outlined text-[17px]">login</span>
                    <span>Sign In</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('register')
                      setErrorMessage('')
                    }}
                    className={cn(
                      'py-2 px-3 text-center rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer',
                      authMode === 'register'
                        ? 'bg-white text-[#172747] shadow-warm-sm border border-[#E8E0D6]'
                        : 'text-[#827B73] hover:text-[#292522] hover:bg-[#EFE6E1]'
                    )}
                  >
                    <span className="material-symbols-outlined text-[17px]">how_to_reg</span>
                    <span>Register</span>
                  </button>
                </div>

                {/* Error Banner */}
                {errorMessage && (
                  <div className="mb-4 p-3 rounded-lg bg-red-50 text-xs text-red-700 border border-red-200 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-red-600 shrink-0">
                      error
                    </span>
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* ================= REGISTER MODE FORM ================= */}
                {authMode === 'register' ? (
                  <form onSubmit={handleRegister} className="space-y-3.5">
                    {/* Account Category Selector */}
                    <div className="p-2 bg-[#F5ECE7] rounded-xl border border-[#E8E0D6]">
                      <div className="flex items-center justify-between mb-1.5 px-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#827B73]">
                          Select Account Type
                        </span>
                        <span className="text-[10px] font-semibold text-[#493027]">
                          Tailored Interface
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-1.5">
                        {accountCategories.map((cat) => {
                          const isSelected = selectedCategory === cat.id
                          return (
                            <button
                              key={cat.id}
                              type="button"
                              onClick={() => setSelectedCategory(cat.id)}
                              className={cn(
                                'px-2 py-2 text-center rounded-lg transition-all duration-150',
                                isSelected
                                  ? 'bg-white text-[#172747] shadow-warm-sm border border-[#E8E0D6]'
                                  : 'text-[#827B73] hover:bg-[#EFE6E1]'
                              )}
                            >
                              <div className="text-xs font-semibold leading-tight truncate">{cat.title}</div>
                              <div className="text-[9px] text-[#827B73] mt-0.5 truncate hidden sm:block">
                                {cat.subtitle}
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    {/* Full Name & Phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-[#292522]" htmlFor="reg-name">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <div className="relative flex items-center">
                          <span className="material-symbols-outlined absolute left-3 text-[#827B73] text-[18px] pointer-events-none">
                            person
                          </span>
                          <input
                            id="reg-name"
                            type="text"
                            required
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="e.g. John Doe"
                            className="w-full h-10 pl-9 pr-3 bg-[#FBF2ED] text-[#292522] rounded-[10px] text-sm border border-[#E8E0D6] focus:bg-white focus:border-[#172747] focus:outline-none focus:ring-2 focus:ring-[#172747]/15 transition-all"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-[#292522]" htmlFor="reg-phone">
                          Phone Number <span className="text-red-500">*</span>
                        </label>
                        <div className="relative flex items-center">
                          <span className="material-symbols-outlined absolute left-3 text-[#827B73] text-[18px] pointer-events-none">
                            call
                          </span>
                          <input
                            id="reg-phone"
                            type="tel"
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+91 98765 43210"
                            className="w-full h-10 pl-9 pr-3 bg-[#FBF2ED] text-[#292522] rounded-[10px] text-sm border border-[#E8E0D6] focus:bg-white focus:border-[#172747] focus:outline-none focus:ring-2 focus:ring-[#172747]/15 transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Email Address */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#292522]" htmlFor="reg-email">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <div className="relative flex items-center">
                        <span className="material-symbols-outlined absolute left-3 text-[#827B73] text-[18px] pointer-events-none">
                          alternate_email
                        </span>
                        <input
                          id="reg-email"
                          type="email"
                          required
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          placeholder="john.doe@company.com"
                          className="w-full h-10 pl-9 pr-3 bg-[#FBF2ED] text-[#292522] rounded-[10px] text-sm border border-[#E8E0D6] focus:bg-white focus:border-[#172747] focus:outline-none focus:ring-2 focus:ring-[#172747]/15 transition-all"
                        />
                      </div>
                    </div>

                    {/* Company / Property Name & Address */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-[#292522]" htmlFor="reg-property">
                          {selectedCategory === 'residential' ? 'Property / House No.' : 'Organization / Firm'}
                        </label>
                        <div className="relative flex items-center">
                          <span className="material-symbols-outlined absolute left-3 text-[#827B73] text-[18px] pointer-events-none">
                            {selectedCategory === 'residential' ? 'home' : 'apartment'}
                          </span>
                          <input
                            id="reg-property"
                            type="text"
                            value={companyOrProperty}
                            onChange={(e) => setCompanyOrProperty(e.target.value)}
                            placeholder={selectedCategory === 'residential' ? 'Villa #12, Phase 2' : 'Apex Solar Systems Pvt'}
                            className="w-full h-10 pl-9 pr-3 bg-[#FBF2ED] text-[#292522] rounded-[10px] text-sm border border-[#E8E0D6] focus:bg-white focus:border-[#172747] focus:outline-none focus:ring-2 focus:ring-[#172747]/15 transition-all"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-[#292522]" htmlFor="reg-address">
                          City / PIN Code
                        </label>
                        <div className="relative flex items-center">
                          <span className="material-symbols-outlined absolute left-3 text-[#827B73] text-[18px] pointer-events-none">
                            location_on
                          </span>
                          <input
                            id="reg-address"
                            type="text"
                            value={installationAddress}
                            onChange={(e) => setInstallationAddress(e.target.value)}
                            placeholder="Bengaluru, 560001"
                            className="w-full h-10 pl-9 pr-3 bg-[#FBF2ED] text-[#292522] rounded-[10px] text-sm border border-[#E8E0D6] focus:bg-white focus:border-[#172747] focus:outline-none focus:ring-2 focus:ring-[#172747]/15 transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Password & Confirm Password */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-[#292522]" htmlFor="reg-password">
                          Password <span className="text-red-500">*</span>
                        </label>
                        <div className="relative flex items-center">
                          <span className="material-symbols-outlined absolute left-3 text-[#827B73] text-[18px] pointer-events-none">
                            lock
                          </span>
                          <input
                            id="reg-password"
                            type={showRegPassword ? 'text' : 'password'}
                            required
                            value={regPassword}
                            onChange={(e) => setRegPassword(e.target.value)}
                            placeholder="Min 8 characters"
                            className="w-full h-10 pl-9 pr-9 bg-[#FBF2ED] text-[#292522] rounded-[10px] text-sm border border-[#E8E0D6] focus:bg-white focus:border-[#172747] focus:outline-none focus:ring-2 focus:ring-[#172747]/15 transition-all"
                          />
                          <button
                            type="button"
                            onClick={() => setShowRegPassword(!showRegPassword)}
                            className="absolute right-2.5 text-[#827B73] hover:text-[#292522] p-1"
                            aria-label="Toggle password view"
                          >
                            {showRegPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-[#292522]" htmlFor="reg-confirm-password">
                          Confirm Password <span className="text-red-500">*</span>
                        </label>
                        <div className="relative flex items-center">
                          <span className="material-symbols-outlined absolute left-3 text-[#827B73] text-[18px] pointer-events-none">
                            lock_reset
                          </span>
                          <input
                            id="reg-confirm-password"
                            type={showConfirmPassword ? 'text' : 'password'}
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Re-enter password"
                            className="w-full h-10 pl-9 pr-9 bg-[#FBF2ED] text-[#292522] rounded-[10px] text-sm border border-[#E8E0D6] focus:bg-white focus:border-[#172747] focus:outline-none focus:ring-2 focus:ring-[#172747]/15 transition-all"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-2.5 text-[#827B73] hover:text-[#292522] p-1"
                            aria-label="Toggle confirm password view"
                          >
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Terms & Conditions Checkbox */}
                    <div className="pt-1">
                      <label className="flex items-start gap-2.5 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={agreeTerms}
                          onChange={(e) => setAgreeTerms(e.target.checked)}
                          className="w-4 h-4 mt-0.5 rounded text-[#172747] accent-[#172747] shrink-0"
                        />
                        <span className="text-xs text-[#827B73] leading-relaxed">
                          I agree to the{' '}
                          <Link to="/about" className="font-semibold text-[#172747] hover:underline">
                            Terms of Service
                          </Link>
                          , acknowledge the{' '}
                          <Link to="/about" className="font-semibold text-[#172747] hover:underline">
                            SOC-2 Privacy Policy
                          </Link>{' '}
                          and consent to system telemetry communication.
                        </span>
                      </label>
                    </div>

                    {/* Dual Action Buttons: Login beside Register */}
                    <div className="grid grid-cols-2 gap-3 mt-3">
                      <button
                        type="button"
                        onClick={() => {
                          setAuthMode('login')
                          setErrorMessage('')
                        }}
                        className="h-11 rounded-[10px] text-sm font-semibold tracking-wide flex items-center justify-center gap-1.5 border-2 border-[#172747] text-[#172747] hover:bg-[#172747]/5 transition-all duration-200 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[18px]" aria-hidden="true">login</span>
                        <span>LOGIN</span>
                      </button>

                      <button
                        type="submit"
                        disabled={registerState !== 'idle'}
                        className="h-11 bg-[#172747] text-white rounded-[10px] text-sm font-semibold tracking-wide flex items-center justify-center gap-2 shadow-warm-sm hover:bg-[#1E345E] transition-all duration-200 disabled:opacity-75 cursor-pointer group"
                      >
                        {registerState === 'idle' ? (
                          <>
                            <span className="material-symbols-outlined text-[18px]" aria-hidden="true">how_to_reg</span>
                            <span>REGISTER</span>
                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </>
                        ) : registerState === 'submitting' ? (
                          <>
                            <RefreshCw className="h-4 w-4 animate-spin text-[#FFDDB7]" />
                            <span>Registering...</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                            <span>Registered!</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                ) : (
                  /* ================= LOGIN MODE FORM ================= */
                  <form onSubmit={handleLogin} className="space-y-4">
                    {/* Quick Simulation Profile Selector */}
                    <div className="p-2.5 bg-[#F5ECE7] rounded-xl border border-[#E8E0D6]">
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
                          const isSelected = selectedProfile === cred.id
                          return (
                            <button
                              key={cred.id}
                              type="button"
                              onClick={() => handleSelectDemo(cred)}
                              className={cn(
                                'px-2 py-1.5 text-center rounded-lg text-xs font-semibold transition-all duration-150 truncate cursor-pointer',
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

                    {/* Role / Workspace Selection - Displayed only for Employee profile */}
                    {selectedProfile === 'employee' && (
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-xs">
                          <label className="font-semibold text-[#292522]" htmlFor="role-select">
                            Operational Role & Terminal
                          </label>
                          <span className="text-[#827B73]">RBAC Mode</span>
                        </div>
                        <select
                          id="role-select"
                          name="role"
                          value={selectedRole}
                          onChange={(e) => handleRoleChange(e.target.value)}
                          className="w-full h-10 px-3 bg-[#FBF2ED] text-[#292522] rounded-[10px] text-sm border border-[#E8E0D6] focus:bg-white focus:border-[#172747] focus:outline-none focus:ring-3 focus:ring-[#172747]/12 transition-all cursor-pointer font-medium"
                        >
                          <option value="director">Executive Director (Director Console)</option>
                          <option value="sales">Sales Executive (CRM & Quotations)</option>
                          <option value="survey">Site Survey Engineer (Rooftop Feasibility)</option>
                          <option value="warehouse">Warehouse Manager (Inventory & Dispatch)</option>
                          <option value="finance">Finance Controller (Invoicing & P&L)</option>
                          <option value="support">Service Desk Support (Warranty & RMA)</option>
                        </select>
                      </div>
                    )}

                    {/* Email Address */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <label className="font-semibold text-[#292522]" htmlFor="login-email">
                          Email Address
                        </label>
                        <span className="text-[#827B73]">SSO Enabled</span>
                      </div>
                      <div className="relative flex items-center">
                        <span className="material-symbols-outlined absolute left-3 text-[#827B73] text-[20px] pointer-events-none">
                          alternate_email
                        </span>
                        <input
                          id="login-email"
                          type="email"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          required
                          className="w-full h-10 pl-10 pr-4 bg-[#FBF2ED] text-[#292522] rounded-[10px] text-sm border border-[#E8E0D6] focus:bg-white focus:border-[#172747] focus:outline-none focus:ring-3 focus:ring-[#172747]/12 transition-all"
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <label className="font-semibold text-[#292522]" htmlFor="login-password">
                          Password
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
                          id="login-password"
                          type={showLoginPassword ? 'text' : 'password'}
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          required
                          className="w-full h-10 pl-10 pr-10 bg-[#FBF2ED] text-[#292522] rounded-[10px] text-sm border border-[#E8E0D6] focus:bg-white focus:border-[#172747] focus:outline-none focus:ring-3 focus:ring-[#172747]/12 transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowLoginPassword(!showLoginPassword)}
                          className="absolute right-3 text-[#827B73] hover:text-[#292522] p-1 cursor-pointer"
                          aria-label="Toggle password view"
                        >
                          {showLoginPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
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

                    {/* Dual Action Buttons: Login beside Register */}
                    <div className="grid grid-cols-2 gap-3 mt-3">
                      <button
                        type="submit"
                        disabled={loginState !== 'idle'}
                        className="h-11 bg-[#172747] text-white rounded-[10px] text-sm font-semibold tracking-wide flex items-center justify-center gap-2 shadow-warm-sm hover:bg-[#1E345E] transition-all duration-200 disabled:opacity-75 cursor-pointer group"
                      >
                        {loginState === 'idle' ? (
                          <>
                            <span>LOGIN</span>
                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </>
                        ) : (
                          <>
                            <RefreshCw className="h-4 w-4 animate-spin text-[#FFDDB7]" />
                            <span>Verifying...</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setAuthMode('register')
                          setErrorMessage('')
                        }}
                        className="h-11 rounded-[10px] text-sm font-semibold tracking-wide flex items-center justify-center gap-1.5 border-2 border-[#172747] text-[#172747] hover:bg-[#172747]/5 transition-all duration-200 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[18px]" aria-hidden="true">how_to_reg</span>
                        <span>REGISTER</span>
                      </button>
                    </div>
                  </form>
                )}

                {/* Audit / Progress Notice */}
                {(registerState !== 'idle' || loginState !== 'idle') && (
                  <div className="mt-3 p-3 rounded-lg bg-[#F5ECE7] text-xs text-[#172747] flex items-center gap-2 border border-[#E8E0D6] animate-fade-in">
                    {registerState === 'submitting' || loginState === 'verifying' ? (
                      <RefreshCw className="h-4 w-4 animate-spin text-[#493027] shrink-0" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    )}
                    <span className="font-medium">{statusMessage}</span>
                  </div>
                )}

                {/* SSO Divider */}
                <div className="relative my-4 text-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full bg-[#E8E0D6] h-[1px]" />
                  </div>
                  <span className="relative bg-white px-3 text-[10px] font-bold uppercase tracking-wider text-[#827B73]">
                    {authMode === 'register' ? 'Or Register With Enterprise Provider' : 'Or Enterprise Provider'}
                  </span>
                </div>

                {/* Enterprise SSO Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleSSO('Google')}
                    className="h-9 px-3 rounded-[10px] bg-[#FBF2ED] hover:bg-[#F5ECE7] text-xs font-semibold text-[#292522] flex items-center justify-center gap-2 border border-[#E8E0D6] transition-all cursor-pointer"
                  >
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>Google</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSSO('Azure AD')}
                    className="h-9 px-3 rounded-[10px] bg-[#FBF2ED] hover:bg-[#F5ECE7] text-xs font-semibold text-[#292522] flex items-center justify-center gap-2 border border-[#E8E0D6] transition-all cursor-pointer"
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

                {/* Toggle link below SSO */}
                <div className="mt-4 pt-3 border-t border-[#E8E0D6] text-center text-xs text-[#827B73]">
                  {authMode === 'register' ? (
                    <>
                      <span>Already have an account? </span>
                      <Link
                        to="/login"
                        onClick={(e) => {
                          e.preventDefault()
                          setAuthMode('login')
                          setErrorMessage('')
                        }}
                        className="font-semibold text-[#172747] hover:text-[#B18751] hover:underline transition-colors cursor-pointer"
                      >
                        Sign In here
                      </Link>
                    </>
                  ) : (
                    <>
                      <span>Don&apos;t have an account? </span>
                      <Link
                        to="/register"
                        onClick={(e) => {
                          e.preventDefault()
                          setAuthMode('register')
                          setErrorMessage('')
                        }}
                        className="font-semibold text-[#172747] hover:text-[#B18751] hover:underline transition-colors cursor-pointer"
                      >
                        Register here
                      </Link>
                    </>
                  )}
                </div>
              </div>

              {/* Footer Regulatory Notice */}
              <div className="w-full max-w-lg mt-3 text-center space-y-1 text-[#827B73] text-xs">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#7A5C51]">
                  Contractor License #C46-1049281 • C-10 Electrical Specialist
                </p>
                <p className="text-[10px] leading-tight opacity-75">
                  Secure Enterprise Portal. User data is encrypted at rest and in transit under ISO 27001 standards.
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
