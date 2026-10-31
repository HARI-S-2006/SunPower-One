import { useState } from 'react'
import { Sun, Zap, Home, Factory, Calculator, ArrowRight, Info, Check, X } from 'lucide-react'

interface FormData {
  customerType: 'residential' | 'commercial'
  monthlyBill: string
  electricityRate: number
  rooftopArea: string
  systemType: 'on-grid' | 'off-grid'
  state: string
}

export function SolarCalculatorPage() {
  const [formData, setFormData] = useState<FormData>({
    customerType: 'residential',
    monthlyBill: '',
    electricityRate: 8,
    rooftopArea: '',
    systemType: 'on-grid',
    state: '',
  })

  const [results, setResults] = useState<{
    recommendedKw: number
    estimatedPrice: number
    subsidyAmount: number
    netPrice: number
    subsidyNote: string
    monthlySavings: number
    paybackYears: number
    co2Offset: number
    panelsNeeded: number
    roofAreaNeeded: number
  } | null>(null)

  const calculate = () => {
    const bill = parseFloat(formData.monthlyBill) || 0
    const rate = typeof formData.electricityRate === 'number' ? formData.electricityRate : (parseFloat(String(formData.electricityRate)) || 8)
    const monthlyUnits = bill / rate
    const dailyUnits = monthlyUnits / 30
    const recommendedKw = Math.ceil(dailyUnits / 4) // ~4 units per kW per day
    const finalKw = Math.min(Math.max(recommendedKw, 1), 5)

    const pricePerKw = formData.systemType === 'on-grid' ? 60000 : 100000
    const estimatedPrice = finalKw * pricePerKw

    // Subsidy eligibility calculation (PM Surya Ghar / MNRE guidelines)
    let subsidyAmount = 0
    let subsidyNote = ''
    if (formData.systemType === 'off-grid') {
      subsidyAmount = 0
      subsidyNote = 'Off-grid battery storage systems are not eligible for central grid-tie subsidies under PM Surya Ghar.'
    } else if (formData.customerType === 'commercial') {
      subsidyAmount = 0
      subsidyNote = 'Commercial & Industrial connections are not eligible for residential CFA subsidies (Eligible for 40% Accelerated Depreciation under Section 32).'
    } else {
      // Residential On-grid PM Surya Ghar
      if (finalKw === 1) subsidyAmount = 30000
      else if (finalKw === 2) subsidyAmount = 60000
      else subsidyAmount = 78000
      subsidyNote = `Eligible for PM Surya Ghar: Muft Bijli Yojana Central Financial Assistance (CFA) of up to ₹${subsidyAmount.toLocaleString()} upon technical feasibility & DISCOM net-meter inspection.`
    }

    const netPrice = Math.max(0, estimatedPrice - subsidyAmount)
    const monthlySavings = Math.min(bill * 0.9, finalKw * 1200)
    const paybackYears = monthlySavings > 0 ? netPrice / (monthlySavings * 12) : 0
    const co2Offset = (finalKw * 1.33 * 365) / 1000 // tons per year
    const panelsNeeded = Math.ceil((finalKw * 1000) / 540)
    const roofAreaNeeded = panelsNeeded * 24

    setResults({
      recommendedKw: finalKw,
      estimatedPrice,
      subsidyAmount,
      netPrice,
      subsidyNote,
      monthlySavings: Math.round(monthlySavings),
      paybackYears: Math.round(paybackYears * 10) / 10,
      co2Offset: Math.round(co2Offset * 10) / 10,
      panelsNeeded,
      roofAreaNeeded,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    calculate()
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-gradient-to-b from-background to-muted/50 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
              <Sun className="h-4 w-4" aria-hidden="true" />
              <Zap className="h-4 w-4 text-yellow-400" aria-hidden="true" />
              <span>Solar Calculator</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-6">
              Estimate Your Solar{' '}
              <span className="text-primary">Requirements</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Get a quick estimate of system size, cost, and savings based on your electricity bill.
              This is an indicative estimate - final quotation requires a site survey.
            </p>
          </div>
        </div>
      </section>

      {/* Calculator Form */}
      <section className="py-12 lg:py-16 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="p-6 rounded-2xl bg-card border">
              <h2 className="text-2xl font-bold text-foreground mb-6">Calculate Your System</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Customer Type</label>
                  <div className="grid grid-cols-2 gap-3">
                    {(['residential', 'commercial'] as const).map((type) => (
                      <label
                        key={type}
                        className={`flex items-center justify-center gap-2 rounded-lg border p-4 cursor-pointer transition-colors ${
                          formData.customerType === type
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="customerType"
                          value={type}
                          checked={formData.customerType === type}
                          onChange={() => setFormData({ ...formData, customerType: type })}
                          className="sr-only"
                        />
                        <div className="flex flex-col items-center">
                          {type === 'residential' ? <Home className="h-6 w-6" /> : <Factory className="h-6 w-6" />}
                          <span className="text-sm font-medium capitalize">{type}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="monthlyBill" className="block text-sm font-medium text-foreground mb-2">
                    Average Monthly Electricity Bill (₹)
                  </label>
                  <input
                    id="monthlyBill"
                    type="number"
                    min="0"
                    step="100"
                    value={formData.monthlyBill}
                    onChange={(e) => setFormData({ ...formData, monthlyBill: e.target.value })}
                    className="w-full rounded-md border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="e.g., 3000"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="electricityRate" className="block text-sm font-medium text-foreground mb-2">
                    Electricity Rate (₹/unit)
                  </label>
                  <input
                    id="electricityRate"
                    type="number"
                    min="1"
                    max="20"
                    step="0.5"
                    value={formData.electricityRate}
                    onChange={(e) => setFormData({ ...formData, electricityRate: parseFloat(e.target.value) || 8 })}
                    className="w-full rounded-md border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="e.g., 8"
                  />
                </div>

                <div>
                  <label htmlFor="rooftopArea" className="block text-sm font-medium text-foreground mb-2">
                    Available Shadow-Free Rooftop Area (sq ft) <span className="text-muted-foreground">(optional)</span>
                  </label>
                  <input
                    id="rooftopArea"
                    type="number"
                    min="0"
                    step="50"
                    value={formData.rooftopArea}
                    onChange={(e) => setFormData({ ...formData, rooftopArea: e.target.value })}
                    className="w-full rounded-md border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="e.g., 500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">System Type</label>
                  <div className="grid grid-cols-2 gap-3">
                    {(['on-grid', 'off-grid'] as const).map((type) => (
                      <label
                        key={type}
                        className={`flex items-center justify-center gap-2 rounded-lg border p-4 cursor-pointer transition-colors ${
                          formData.systemType === type
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="systemType"
                          value={type}
                          checked={formData.systemType === type}
                          onChange={() => setFormData({ ...formData, systemType: type })}
                          className="sr-only"
                        />
                        <div className="flex flex-col items-center">
                          <span className="text-sm font-medium capitalize">{type.replace('-', ' ')}</span>
                          <span className="text-xs text-muted-foreground">
                            {type === 'on-grid' ? 'Grid connected' : 'Battery backup'}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-foreground mb-2">
                    State (for subsidy info)
                  </label>
                  <select
                    id="state"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full rounded-md border bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">Select your state</option>
                    <option value="maharashtra">Maharashtra</option>
                    <option value="gujarat">Gujarat</option>
                    <option value="rajasthan">Rajasthan</option>
                    <option value="karnataka">Karnataka</option>
                    <option value="tamil-nadu">Tamil Nadu</option>
                    <option value="delhi">Delhi</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-md bg-primary px-6 py-3 text-lg font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  <Calculator className="mr-2 h-5 w-5" aria-hidden="true" />
                  Calculate Estimate
                </button>
              </form>

              <div className="mt-6 p-4 rounded-lg bg-muted/50 border">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                  <div className="text-sm text-muted-foreground">
                    <p className="font-medium text-foreground mb-1">Important Note</p>
                    <p>This calculator provides an <strong>indicative estimate only</strong>. Final quotation requires an approved site survey as per competition requirements. Prices shown are before government subsidy. Actual system design depends on roof orientation, shading, structural assessment, and local regulations.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="p-6 rounded-2xl bg-card border">
              <h2 className="text-2xl font-bold text-foreground mb-6">Estimated Results</h2>
              {results ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-lg bg-primary/5 border">
                      <div className="text-2xl font-bold text-primary">{results.recommendedKw} kW</div>
                      <div className="text-xs text-muted-foreground">Capacity</div>
                    </div>
                    <div className="p-3.5 rounded-lg bg-primary/5 border">
                      <div className="text-xl font-bold text-foreground">₹{results.estimatedPrice.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">Gross Equipment Price</div>
                    </div>
                    <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200">
                      <div className="text-xl font-bold text-emerald-700">₹{results.netPrice.toLocaleString()}</div>
                      <div className="text-xs text-emerald-700 font-semibold">Net After Subsidy</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
                    <Info className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block">Subsidy & Financial Policy:</span>
                      <p className="mt-0.5 leading-relaxed">{results.subsidyNote}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                      <div className="text-2xl font-bold text-green-700">₹{results.monthlySavings.toLocaleString()}/mo</div>
                      <div className="text-sm text-green-700">Monthly Savings</div>
                    </div>
                    <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                      <div className="text-2xl font-bold text-blue-700">{results.paybackYears} years</div>
                      <div className="text-sm text-blue-700">Payback Period</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-amber-50 border border-amber-200">
                      <div className="text-2xl font-bold text-amber-700">{results.co2Offset} tons/yr</div>
                      <div className="text-sm text-amber-700">CO₂ Offset</div>
                    </div>
                    <div className="p-4 rounded-lg bg-purple-50 border border-purple-200">
                      <div className="text-2xl font-bold text-purple-700">{results.panelsNeeded} panels</div>
                      <div className="text-sm text-purple-700">Panels Needed</div>
                    </div>
                  </div>

                  {formData.rooftopArea && (
                    <div className="p-4 rounded-lg border" style={{ backgroundColor: results.roofAreaNeeded <= parseFloat(formData.rooftopArea) ? 'rgb(240 253 244)' : 'rgb(254 242 242)', borderColor: results.roofAreaNeeded <= parseFloat(formData.rooftopArea) ? 'rgb(187 247 208)' : 'rgb(254 202 202)' }}>
                      <div className="flex items-center gap-2">
                        {results.roofAreaNeeded <= parseFloat(formData.rooftopArea) ? (
                          <Check className="h-5 w-5 text-green-600" aria-hidden="true" />
                        ) : (
                          <X className="h-5 w-5 text-red-600" aria-hidden="true" />
                        )}
                        <span className="text-sm font-medium">
                          Roof area {results.roofAreaNeeded <= parseFloat(formData.rooftopArea) ? 'sufficient' : 'may be insufficient'}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Required: {results.roofAreaNeeded} sq ft | Available: {formData.rooftopArea} sq ft
                      </p>
                    </div>
                  )}

                  <div className="pt-4 border-t">
                    <a
                      href="/request-survey"
                      className="inline-flex items-center gap-2 w-full sm:w-auto rounded-md bg-primary px-6 py-3 text-center font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                      Request Site Survey
                      <ArrowRight className="h-5 w-5" aria-hidden="true" />
                    </a>
                    <p className="text-xs text-muted-foreground mt-3 text-center">
                      Final quotation issued only after approved site survey
                    </p>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center">
                  <Calculator className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" aria-hidden="true" />
                  <p className="text-muted-foreground">Fill in the form to see your estimate</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-12 bg-muted/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-xl bg-card border p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">About This Calculator</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2"><span className="text-primary">•</span> Estimates based on average Indian solar irradiation (4-5 kWh/m²/day)</li>
              <li className="flex items-start gap-2"><span className="text-primary">•</span> Assumes 500W panels, 18-20% efficiency, standard mounting</li>
              <li className="flex items-start gap-2"><span className="text-primary">•</span> On-grid pricing: ~₹60,000/kW | Off-grid: ~₹1,00,000/kW (includes batteries)</li>
              <li className="flex items-start gap-2"><span className="text-primary">•</span> Government subsidies (up to 40% for residential) not included in estimate</li>
              <li className="flex items-start gap-2"><span className="text-primary">•</span> Actual savings depend on consumption pattern, tariff structure, net metering policy</li>
              <li className="flex items-start gap-2"><span className="text-primary">•</span> Final quotation only after approved site survey (competition requirement)</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}