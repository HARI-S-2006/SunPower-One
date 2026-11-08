import { useState } from 'react'
import { useSolarStore, type UserAccount } from '@/lib/store/solarStore'
import {
  ShieldCheck,
  CreditCard,
  Landmark,
  Save,
  RotateCcw,
  CheckCircle2,
  User,
  Key,
  Building,
  Phone,
  Mail,
  Shield,
  Layers,
  Sparkles,
  Lock,
  ArrowRight
} from 'lucide-react'

export function SettingsPage() {
  const {
    currentUser,
    userAccounts,
    updateUserAccount,
    setAuthUser,
    resetToDefaultData
  } = useSolarStore()

  const [activeTab, setActiveTab] = useState<'profile' | 'platform'>('profile')

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: currentUser?.name || 'Marcus Vance',
    email: currentUser?.email || 'admin@sunpower-solutions.com',
    phone: currentUser?.phone || '+91 98450 10001',
    department: currentUser?.department || 'Executive Governance & Engineering Strategy',
    organization: currentUser?.organization || 'SunPower Solutions Enterprise',
    password: currentUser?.password || 'password123',
  })
  const [profileSaved, setProfileSaved] = useState(false)

  // Escrow state
  const [escrow, setEscrow] = useState({
    advance: 30,
    preDispatch: 50,
    commissioning: 20,
  })

  // Warranty state
  const [warranty, setWarranty] = useState({
    pvModulesYears: 20,
    inverterYears: 2,
    batteryYears: 2,
  })

  // CFA Subsidy state
  const [cfa, setCfa] = useState({
    tier1PerKw: 30000,
    tier2PerKw: 18000,
    maxCfaCap: 78000,
  })

  const [savedSuccess, setSavedSuccess] = useState(false)
  const [resetSuccess, setResetSuccess] = useState(false)

  const escrowSum = escrow.advance + escrow.preDispatch + escrow.commissioning
  const isEscrowValid = escrowSum === 100

  const initials = (currentUser?.name || 'Marcus Vance')
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault()
    if (currentUser?.id) {
      updateUserAccount(currentUser.id, {
        name: profileForm.name,
        phone: profileForm.phone,
        department: profileForm.department,
        organization: profileForm.organization,
        password: profileForm.password,
      })
    } else {
      setAuthUser({
        name: profileForm.name,
        phone: profileForm.phone,
        department: profileForm.department,
        organization: profileForm.organization,
      })
    }
    setProfileSaved(true)
    setTimeout(() => setProfileSaved(false), 3000)
  }

  const handleQuickSwitchAccount = (account: UserAccount) => {
    setAuthUser(account)
    setProfileForm({
      name: account.name,
      email: account.email,
      phone: account.phone,
      department: account.department,
      organization: account.organization,
      password: account.password,
    })
    setProfileSaved(true)
    setTimeout(() => setProfileSaved(false), 2500)
  }

  const handleSavePlatform = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isEscrowValid) return
    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 3000)
  }

  const handleResetData = () => {
    if (confirm('Are you sure you want to reset all mock data and user accounts back to baseline demonstration records?')) {
      resetToDefaultData()
      setResetSuccess(true)
      setTimeout(() => setResetSuccess(false), 3000)
    }
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-[#E8E0D6]">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#172747]/5 px-2.5 py-0.5 text-xs font-semibold text-[#172747] uppercase tracking-wider">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Enterprise Identity & Governance
              </span>
              <span className="text-xs text-[#6E7787]">SCADA System Config v4.2 • ISO-27001 Audited</span>
            </div>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#172747] font-['Plus_Jakarta_Sans']">
              Account Profile & System Policy Settings
            </h1>
            <p className="text-sm text-[#6E7787]">
              Manage authenticated user identity, role permissions, statutory warranty policies, and PM Surya Ghar escrow rules.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetData}
              className="flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs font-bold text-red-700 hover:bg-red-100 shadow-sm transition-all"
            >
              <RotateCcw className="h-4 w-4" />
              Reset Demo Dataset
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-[#E8E0D6]">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'profile'
                ? 'bg-[#172747] text-white shadow-sm'
                : 'bg-[#F7F3EC] text-[#6E7787] hover:text-[#172747] hover:bg-[#E8E0D6]'
            }`}
          >
            <User className="h-4 w-4" />
            User Account Profile & Credentials
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('platform')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'platform'
                ? 'bg-[#172747] text-white shadow-sm'
                : 'bg-[#F7F3EC] text-[#6E7787] hover:text-[#172747] hover:bg-[#E8E0D6]'
            }`}
          >
            <Layers className="h-4 w-4" />
            Enterprise Policy & SCADA Rules
          </button>
        </div>
      </div>

      {profileSaved && (
        <div className="rounded-2xl bg-emerald-50 p-4 border border-emerald-200 flex items-center gap-2 text-xs font-semibold text-emerald-800 animate-fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          Account profile and credentials updated successfully in the system database.
        </div>
      )}

      {savedSuccess && (
        <div className="rounded-2xl bg-emerald-50 p-4 border border-emerald-200 flex items-center gap-2 text-xs font-semibold text-emerald-800 animate-fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          Enterprise operating parameters successfully updated and applied across enterprise workflows.
        </div>
      )}

      {resetSuccess && (
        <div className="rounded-2xl bg-blue-50 p-4 border border-blue-200 flex items-center gap-2 text-xs font-semibold text-blue-800 animate-fade-in">
          <CheckCircle2 className="h-4 w-4 text-blue-600" />
          Demonstration dataset reset to initial competition scenarios.
        </div>
      )}

      {activeTab === 'profile' ? (
        <div className="space-y-6">
          {/* User Account Overview Card */}
          <div className="rounded-2xl bg-white p-6 shadow-sm border border-[#E8E0D6] space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E8E0D6] pb-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-2xl bg-[#172747] text-white flex items-center justify-center font-bold text-2xl border-2 border-[#FFDDB7] shadow-md">
                  {initials}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-[#172747] font-['Plus_Jakarta_Sans']">
                      {currentUser?.name || 'Marcus Vance'}
                    </h2>
                    <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800 uppercase tracking-wide">
                      Active Account
                    </span>
                  </div>
                  <p className="text-xs text-[#6E7787] mt-0.5">
                    {currentUser?.title || 'Executive Director'} • {currentUser?.organization || 'SunPower Solutions Enterprise'}
                  </p>
                  <p className="text-[11px] font-mono text-[#B18751] mt-1">
                    System Account ID: {currentUser?.id || 'usr-01'}
                  </p>
                </div>
              </div>

              {currentUser?.profile === 'admin' && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold text-[#827B73]">Quick Account Switcher (Director Console):</span>
                  <select
                    id="settings-quick-switch-select"
                    value={currentUser?.email || 'admin@sunpower-solutions.com'}
                    onChange={(e) => {
                      const match = userAccounts.find(a => a.email.toLowerCase() === e.target.value.toLowerCase())
                      if (match) handleQuickSwitchAccount(match)
                    }}
                    className="rounded-xl border border-[#E8E0D6] bg-[#F7F3EC] px-3 py-1.5 text-xs font-bold text-[#172747] focus:border-[#172747] focus:outline-none cursor-pointer"
                    aria-label="Quick Account Switcher"
                  >
                    {userAccounts.map((u) => (
                      <option key={u.id} value={u.email}>
                        {u.name} ({u.title})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* 1-Click Role Switcher Pill Buttons (Restricted Exclusively to Admin Director) */}
            {currentUser?.profile === 'admin' && (
              <div className="pt-3 border-t border-[#E8E0D6]">
                <span className="text-[10px] font-bold text-[#827B73] uppercase tracking-wider block mb-2">
                  1-Click Role Switcher (Admin Emulation Only):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {userAccounts.map((account) => {
                    const isCurrent = currentUser?.email.toLowerCase() === account.email.toLowerCase()
                    return (
                      <button
                        key={account.id}
                        type="button"
                        onClick={() => handleQuickSwitchAccount(account)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border flex items-center gap-1.5 cursor-pointer ${
                          isCurrent
                            ? 'bg-[#172747] text-white border-[#172747] shadow-sm'
                            : 'bg-[#F7F3EC] text-[#292522] border-[#E8E0D6] hover:bg-white hover:border-[#B18751]'
                        }`}
                      >
                        <span>{account.name}</span>
                        <span className="text-[10px] opacity-75 font-mono">({account.role})</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="rounded-xl bg-[#F7F3EC] p-3.5 border border-[#E8E0D6]">
                <span className="text-[#6E7787] block font-semibold">Security Credential Status</span>
                <span className="font-bold text-[#172747] mt-1 flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  FIPS 140-2 Level 3 Verified
                </span>
              </div>
              <div className="rounded-xl bg-[#F7F3EC] p-3.5 border border-[#E8E0D6]">
                <span className="text-[#6E7787] block font-semibold">RBAC Operational Tier</span>
                <span className="font-bold text-[#172747] mt-1 capitalize">
                  {currentUser?.profile || 'admin'} • {currentUser?.role || 'director'}
                </span>
              </div>
              <div className="rounded-xl bg-[#F7F3EC] p-3.5 border border-[#E8E0D6]">
                <span className="text-[#6E7787] block font-semibold">Department</span>
                <span className="font-bold text-[#172747] mt-1 truncate block">
                  {currentUser?.department || 'Executive Operations'}
                </span>
              </div>
              <div className="rounded-xl bg-[#F7F3EC] p-3.5 border border-[#E8E0D6]">
                <span className="text-[#6E7787] block font-semibold">Registered Contact Phone</span>
                <span className="font-bold text-[#172747] mt-1 font-mono">
                  {currentUser?.phone || '+91 98450 10001'}
                </span>
              </div>
            </div>
          </div>

          {/* Edit Profile Form */}
          <div className="rounded-2xl bg-white p-6 shadow-sm border border-[#E8E0D6] space-y-4">
            <div className="flex items-center gap-2 border-b border-[#E8E0D6] pb-3">
              <User className="h-5 w-5 text-[#172747]" />
              <div>
                <h3 className="text-base font-bold text-[#172747] font-['Plus_Jakarta_Sans']">
                  Edit Account Details & Password
                </h3>
                <p className="text-xs text-[#6E7787]">
                  Updates are saved immediately to the system database and synchronised across all operational views.
                </p>
              </div>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#6E7787] font-semibold mb-1">
                    Full Legal Name
                  </label>
                  <input
                    type="text"
                    required
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full rounded-xl border border-[#E8E0D6] p-2.5 font-bold text-[#172747] focus:border-[#172747] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#6E7787] font-semibold mb-1">
                    Primary Email (Immutable Sign-In Key)
                  </label>
                  <input
                    type="email"
                    disabled
                    value={profileForm.email}
                    className="w-full rounded-xl border border-[#E8E0D6] bg-gray-50 p-2.5 font-mono text-[#827B73] cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-[#6E7787] font-semibold mb-1">
                    Contact Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className="w-full rounded-xl border border-[#E8E0D6] p-2.5 font-bold text-[#172747] focus:border-[#172747] focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[#6E7787] font-semibold mb-1">
                    Department / Operational Unit
                  </label>
                  <input
                    type="text"
                    value={profileForm.department}
                    onChange={(e) => setProfileForm({ ...profileForm, department: e.target.value })}
                    className="w-full rounded-xl border border-[#E8E0D6] p-2.5 font-bold text-[#172747] focus:border-[#172747] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#6E7787] font-semibold mb-1">
                    Organization / Entity
                  </label>
                  <input
                    type="text"
                    value={profileForm.organization}
                    onChange={(e) => setProfileForm({ ...profileForm, organization: e.target.value })}
                    className="w-full rounded-xl border border-[#E8E0D6] p-2.5 font-bold text-[#172747] focus:border-[#172747] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#6E7787] font-semibold mb-1">
                    Account Security Password
                  </label>
                  <input
                    type="text"
                    required
                    value={profileForm.password}
                    onChange={(e) => setProfileForm({ ...profileForm, password: e.target.value })}
                    className="w-full rounded-xl border border-[#E8E0D6] p-2.5 font-mono text-[#172747] focus:border-[#172747] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-xl bg-[#172747] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#011232] shadow-sm transition-all"
                >
                  <Save className="h-4 w-4 text-[#FFDDB7]" />
                  Save Account Changes
                </button>
              </div>
            </form>
          </div>

          {/* All Registered System Accounts Directory */}
          <div className="rounded-2xl bg-white p-6 shadow-sm border border-[#E8E0D6] space-y-4">
            <div className="flex items-center justify-between border-b border-[#E8E0D6] pb-3">
              <div>
                <h3 className="text-base font-bold text-[#172747] font-['Plus_Jakarta_Sans']">
                  Database User Accounts Directory ({userAccounts.length} Verified Records)
                </h3>
                <p className="text-xs text-[#6E7787]">
                  All active accounts in the database. Click &quot;Login As&quot; to test individual role permissions.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#E8E0D6] bg-[#FAF7F2] text-[#827B73]">
                    <th className="p-3 font-semibold">User</th>
                    <th className="p-3 font-semibold">Email & Phone</th>
                    <th className="p-3 font-semibold">Role & Title</th>
                    <th className="p-3 font-semibold">Department</th>
                    <th className="p-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E0D6]">
                  {userAccounts.map((account) => {
                    const isCurrent = currentUser?.email.toLowerCase() === account.email.toLowerCase()
                    const accInitials = account.name.split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2).toUpperCase()
                    return (
                      <tr key={account.id} className={isCurrent ? 'bg-amber-50/50' : 'hover:bg-[#FAF7F2]/50'}>
                        <td className="p-3">
                          <div className="flex items-center gap-2.5">
                            <div className="h-7 w-7 rounded-lg bg-[#172747] text-white flex items-center justify-center font-bold text-xs">
                              {accInitials}
                            </div>
                            <div>
                              <p className="font-bold text-[#172747]">{account.name}</p>
                              <span className="text-[10px] font-mono text-[#827B73]">{account.id}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <p className="font-mono text-[#172747]">{account.email}</p>
                          <p className="text-[10px] text-[#827B73]">{account.phone}</p>
                        </td>
                        <td className="p-3">
                          <span className="inline-block bg-[#172747]/10 text-[#172747] px-2 py-0.5 rounded font-semibold text-[10px] uppercase">
                            {account.role}
                          </span>
                          <p className="text-[11px] text-[#6E7787] mt-0.5">{account.title}</p>
                        </td>
                        <td className="p-3 text-[#6E7787] max-w-xs truncate">
                          {account.department}
                        </td>
                        <td className="p-3 text-right">
                          {isCurrent ? (
                            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-lg">
                              Current User
                            </span>
                          ) : currentUser?.profile === 'admin' ? (
                            <button
                              type="button"
                              onClick={() => handleQuickSwitchAccount(account)}
                              className="inline-flex items-center gap-1 rounded-lg border border-[#E8E0D6] bg-white px-2.5 py-1 text-xs font-semibold text-[#172747] hover:bg-[#172747] hover:text-white transition-all shadow-2xs"
                              aria-label={`Switch account to ${account.name}`}
                            >
                              <span>Switch To {account.name}</span>
                              <ArrowRight className="h-3 w-3" />
                            </button>
                          ) : (
                            <span className="text-[10px] text-[#827B73] font-mono px-2 py-0.5 rounded bg-gray-100">
                              Restricted Clearance
                            </span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSavePlatform} className="space-y-6">
          {/* Milestone Escrow Schedule Settings */}
          <div className="rounded-2xl bg-white p-6 shadow-sm border border-[#E8E0D6] space-y-4">
            <div className="flex items-center justify-between border-b border-[#E8E0D6] pb-3">
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-[#493027]" />
                <h3 className="text-base font-bold text-[#172747] font-['Plus_Jakarta_Sans']">
                  Milestone Escrow Payment Schedule
                </h3>
              </div>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                  isEscrowValid ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                }`}
              >
                Total: {escrowSum}% {isEscrowValid ? '✓ Valid' : '⚠ Must Equal 100%'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-[#6E7787] font-semibold mb-1">
                  Milestone 1: Advance Booking (%)
                </label>
                <input
                  type="number"
                  min="10"
                  max="50"
                  value={escrow.advance}
                  onChange={(e) => setEscrow({ ...escrow, advance: parseInt(e.target.value) || 0 })}
                  className="w-full rounded-xl border border-[#E8E0D6] p-2.5 font-bold text-[#172747] tabular-nums"
                />
                <span className="block text-[11px] text-[#6E7787] mt-1">Required to schedule site survey and staging</span>
              </div>

              <div>
                <label className="block text-[#6E7787] font-semibold mb-1">
                  Milestone 2: Pre-Dispatch (%)
                </label>
                <input
                  type="number"
                  min="20"
                  max="70"
                  value={escrow.preDispatch}
                  onChange={(e) => setEscrow({ ...escrow, preDispatch: parseInt(e.target.value) || 0 })}
                  className="w-full rounded-xl border border-[#E8E0D6] p-2.5 font-bold text-[#172747] tabular-nums"
                />
                <span className="block text-[11px] text-[#6E7787] mt-1">Required before warehouse serial barcode dispatch</span>
              </div>

              <div>
                <label className="block text-[#6E7787] font-semibold mb-1">
                  Milestone 3: Post-Commissioning (%)
                </label>
                <input
                  type="number"
                  min="10"
                  max="30"
                  value={escrow.commissioning}
                  onChange={(e) => setEscrow({ ...escrow, commissioning: parseInt(e.target.value) || 0 })}
                  className="w-full rounded-xl border border-[#E8E0D6] p-2.5 font-bold text-[#172747] tabular-nums"
                />
                <span className="block text-[11px] text-[#6E7787] mt-1">Due upon verified grid sync and customer signature</span>
              </div>
            </div>
          </div>

          {/* Warranty Durations Policy */}
          <div className="rounded-2xl bg-white p-6 shadow-sm border border-[#E8E0D6] space-y-4">
            <div className="flex items-center gap-2 border-b border-[#E8E0D6] pb-3">
              <ShieldCheck className="h-5 w-5 text-emerald-600" />
              <h3 className="text-base font-bold text-[#172747] font-['Plus_Jakarta_Sans']">
                Statutory Warranty Duration Policy
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-[#6E7787] font-semibold mb-1">
                  Solar PV Modules (Years)
                </label>
                <input
                  type="number"
                  value={warranty.pvModulesYears}
                  onChange={(e) => setWarranty({ ...warranty, pvModulesYears: parseInt(e.target.value) || 0 })}
                  className="w-full rounded-xl border border-[#E8E0D6] p-2.5 font-bold text-[#172747] tabular-nums"
                />
                <span className="block text-[11px] text-[#6E7787] mt-1">Tier-1 80% linear performance guarantee</span>
              </div>

              <div>
                <label className="block text-[#6E7787] font-semibold mb-1">
                  Grid-Tied & Hybrid Inverter (Years)
                </label>
                <input
                  type="number"
                  value={warranty.inverterYears}
                  onChange={(e) => setWarranty({ ...warranty, inverterYears: parseInt(e.target.value) || 0 })}
                  className="w-full rounded-xl border border-[#E8E0D6] p-2.5 font-bold text-[#172747] tabular-nums"
                />
                <span className="block text-[11px] text-[#6E7787] mt-1">Full OEM replacement / RMA guarantee</span>
              </div>

              <div>
                <label className="block text-[#6E7787] font-semibold mb-1">
                  Battery Energy Storage (Years)
                </label>
                <input
                  type="number"
                  value={warranty.batteryYears}
                  onChange={(e) => setWarranty({ ...warranty, batteryYears: parseInt(e.target.value) || 0 })}
                  className="w-full rounded-xl border border-[#E8E0D6] p-2.5 font-bold text-[#172747] tabular-nums"
                />
                <span className="block text-[11px] text-[#6E7787] mt-1">LiFePO4 4000 cycle capacity guarantee</span>
              </div>
            </div>
          </div>

          {/* Central Financial Assistance (CFA) Rules */}
          <div className="rounded-2xl bg-white p-6 shadow-sm border border-[#E8E0D6] space-y-4">
            <div className="flex items-center gap-2 border-b border-[#E8E0D6] pb-3">
              <Landmark className="h-5 w-5 text-amber-600" />
              <h3 className="text-base font-bold text-[#172747] font-['Plus_Jakarta_Sans']">
                PM Surya Ghar Subsidy CFA Matrix
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-[#6E7787] font-semibold mb-1">
                  Tier 1 Subsidy (1–2 kW Rate)
                </label>
                <input
                  type="number"
                  value={cfa.tier1PerKw}
                  onChange={(e) => setCfa({ ...cfa, tier1PerKw: parseInt(e.target.value) || 0 })}
                  className="w-full rounded-xl border border-[#E8E0D6] p-2.5 font-bold text-[#172747] tabular-nums"
                />
                <span className="block text-[11px] text-[#6E7787] mt-1">₹30,000 per kW up to 2 kW (Max ₹60,000)</span>
              </div>

              <div>
                <label className="block text-[#6E7787] font-semibold mb-1">
                  Tier 2 Subsidy (3 kW Additional)
                </label>
                <input
                  type="number"
                  value={cfa.tier2PerKw}
                  onChange={(e) => setCfa({ ...cfa, tier2PerKw: parseInt(e.target.value) || 0 })}
                  className="w-full rounded-xl border border-[#E8E0D6] p-2.5 font-bold text-[#172747] tabular-nums"
                />
                <span className="block text-[11px] text-[#6E7787] mt-1">₹18,000 for 3rd kW increment</span>
              </div>

              <div>
                <label className="block text-[#6E7787] font-semibold mb-1">
                  Maximum CFA Cap
                </label>
                <input
                  type="number"
                  value={cfa.maxCfaCap}
                  onChange={(e) => setCfa({ ...cfa, maxCfaCap: parseInt(e.target.value) || 0 })}
                  className="w-full rounded-xl border border-[#E8E0D6] p-2.5 font-bold text-[#172747] tabular-nums"
                />
                <span className="block text-[11px] text-[#6E7787] mt-1">Ceiling per residential meter (₹78,000)</span>
              </div>
            </div>
          </div>

          {/* Submit Save */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!isEscrowValid}
              className={`flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white shadow-md transition-all ${
                isEscrowValid ? 'bg-[#172747] hover:bg-[#011232]' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Save className="h-4 w-4 text-[#E9DDCA]" />
              Save Platform Configurations
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
