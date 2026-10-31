import { useState } from 'react'
import { useSolarStore } from '@/lib/store/solarStore'
import {
  ShieldCheck,
  CreditCard,
  Landmark,
  Save,
  RotateCcw,
  CheckCircle2
} from 'lucide-react'

export function SettingsPage() {
  const { resetToDefaultData } = useSolarStore()

  const [escrow, setEscrow] = useState({
    advance: 30,
    preDispatch: 50,
    commissioning: 20,
  })

  const [warranty, setWarranty] = useState({
    pvModulesYears: 20,
    inverterYears: 2,
    batteryYears: 2,
  })

  const [cfa, setCfa] = useState({
    tier1PerKw: 30000,
    tier2PerKw: 18000,
    maxCfaCap: 78000,
  })

  const [savedSuccess, setSavedSuccess] = useState(false)
  const [resetSuccess, setResetSuccess] = useState(false)

  const escrowSum = escrow.advance + escrow.preDispatch + escrow.commissioning
  const isEscrowValid = escrowSum === 100

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isEscrowValid) return
    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 3000)
  }

  const handleResetData = () => {
    if (confirm('Are you sure you want to reset all mock data back to baseline demonstration records?')) {
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
                Enterprise Operating Parameters
              </span>
              <span className="text-xs text-[#6E7787]">SCADA System Config v4.2</span>
            </div>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#172747] font-['Plus_Jakarta_Sans']">
              Platform Configuration & Policy Settings
            </h1>
            <p className="text-sm text-[#6E7787]">
              Configure milestone escrow percentages, warranty terms, and PM Surya Ghar central subsidy caps.
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
      </div>

      {savedSuccess && (
        <div className="rounded-2xl bg-emerald-50 p-4 border border-emerald-200 flex items-center gap-2 text-xs font-semibold text-emerald-800">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          Settings successfully updated and applied across enterprise workflows.
        </div>
      )}

      {resetSuccess && (
        <div className="rounded-2xl bg-blue-50 p-4 border border-blue-200 flex items-center gap-2 text-xs font-semibold text-blue-800">
          <CheckCircle2 className="h-4 w-4 text-blue-600" />
          Demonstration dataset reset to initial competition scenarios.
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
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
    </div>
  )
}
