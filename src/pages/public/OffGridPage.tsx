import { Sun, Zap, Battery, Check, ArrowRight } from 'lucide-react'

export function OffGridPage() {
  const systemSizes = [
    { kw: 1, panels: 2, battery: '5 kWh', area: '100 sq ft', estPrice: '₹1,20,000', backup: '8-10 hours' },
    { kw: 2, panels: 4, battery: '10 kWh', area: '200 sq ft', estPrice: '₹2,20,000', backup: '10-12 hours' },
    { kw: 3, panels: 6, battery: '15 kWh', area: '300 sq ft', estPrice: '₹3,20,000', backup: '12-15 hours' },
    { kw: 4, panels: 8, battery: '20 kWh', area: '400 sq ft', estPrice: '₹4,10,000', backup: '15-18 hours' },
    { kw: 5, panels: 10, battery: '25 kWh', area: '500 sq ft', estPrice: '₹5,00,000', backup: '18-24 hours' },
  ]

  const components = [
    { name: 'Solar Panels', desc: 'High-efficiency monocrystalline panels (500W each)', icon: Sun },
    { name: 'Hybrid Inverter', desc: 'Manages solar, battery, and load simultaneously', icon: Battery },
    { name: 'Battery Bank', desc: 'Lithium-ion (LiFePO4) for long life & safety', icon: Battery },
    { name: 'Mounting Structure', desc: 'Galvanized iron/aluminum rails for roof/ground', icon: Sun },
    { name: 'AC/DC Wiring', desc: 'UV-resistant cables, conduits, and junction boxes', icon: Zap },
    { name: 'Safety & Earthing', desc: 'Lightning arrestor, earthing, DC/AC protection', icon: Zap },
    { name: 'Charge Controller', desc: 'MPPT controller for optimal battery charging', icon: Battery },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-gradient-to-b from-background to-muted/50 py-20 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
              <Sun className="h-4 w-4" aria-hidden="true" />
              <Zap className="h-4 w-4 text-yellow-400" aria-hidden="true" />
              <span>Off-Grid Solar Systems</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6">
              Complete Energy{' '}
              <span className="text-primary">Independence</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Generate, store, and use your own power 24/7. Perfect for remote locations,
              areas with unreliable grid, or anyone wanting total energy security.
              1 kW to 5 kW systems with lithium battery storage.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="/request-survey" className="w-full sm:w-auto rounded-md bg-primary px-8 py-3 text-lg font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                Get Free Quote
                <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
              </a>
              <a href="/solar-calculator" className="w-full sm:w-auto rounded-md border bg-background px-8 py-3 text-lg font-medium hover:bg-accent transition-colors">
                Calculate Needs
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">How Off-Grid Solar Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Complete energy independence with solar generation and battery storage.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: 1, title: 'Solar Generation', desc: 'Panels generate DC power during daylight hours' },
              { step: 2, title: 'Smart Inverter', desc: 'Hybrid inverter powers loads & charges batteries' },
              { step: 3, title: 'Battery Storage', desc: 'Excess energy stored in lithium battery bank' },
              { step: 4, title: '24/7 Power', desc: 'Batteries power your home day and night' },
            ].map((step) => (
              <div key={step.step} className="p-6 rounded-xl bg-card border text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary text-2xl font-bold">
                  {step.step}
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* System Sizes */}
      <section className="py-20 lg:py-28 bg-muted/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Available System Sizes</h2>
            <p className="text-lg text-muted-foreground mb-4">Includes lithium battery storage for 24/7 power</p>
            <p className="text-sm text-muted-foreground">*Estimated prices. Actual pricing requires site survey & load analysis.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full" role="table">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-semibold text-foreground">System Size</th>
                  <th className="text-center p-4 font-semibold text-foreground">Panels (500W)</th>
                  <th className="text-center p-4 font-semibold text-foreground">Battery Storage</th>
                  <th className="text-center p-4 font-semibold text-foreground">Roof Area</th>
                  <th className="text-center p-4 font-semibold text-foreground">Est. Price</th>
                  <th className="text-center p-4 font-semibold text-foreground">Backup Time</th>
                  <th className="text-center p-4 font-semibold text-foreground">Best For</th>
                </tr>
              </thead>
              <tbody>
                {systemSizes.map((size) => (
                  <tr key={size.kw} className="border-b hover:bg-card">
                    <td className="p-4 font-semibold text-foreground">{size.kw} kW</td>
                    <td className="p-4 text-center text-muted-foreground">{size.panels}</td>
                    <td className="p-4 text-center text-muted-foreground">{size.battery}</td>
                    <td className="p-4 text-center text-muted-foreground">{size.area}</td>
                    <td className="p-4 text-center font-medium text-foreground">{size.estPrice}</td>
                    <td className="p-4 text-center text-blue-600 font-medium">{size.backup}</td>
                    <td className="p-4 text-center text-sm text-muted-foreground">
                      {size.kw <= 2 ? 'Small cabins/essential loads' : size.kw === 3 ? 'Medium homes' : 'Large homes/farms'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Components */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">System Components</h2>
            <p className="text-lg text-muted-foreground">Everything included for complete off-grid operation</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {components.map((comp) => (
              <div key={comp.name} className="p-6 rounded-xl bg-card border">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
                  <comp.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{comp.name}</h3>
                <p className="text-sm text-muted-foreground">{comp.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Battery Info */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">Lithium Battery Technology</h2>
              <div className="space-y-6">
                {[
                  { title: 'LiFePO4 Chemistry', desc: 'Lithium Iron Phosphate - safest, longest-lasting battery chemistry available.' },
                  { title: '6000+ Cycles', desc: 'Rated for 6000+ charge cycles at 80% depth of discharge - 15+ years life.' },
                  { title: 'Built-in BMS', desc: 'Battery Management System protects against overcharge, over-discharge, short circuit.' },
                  { title: 'Fast Charging', desc: 'Charge from 0-100% in 2-3 hours with adequate solar input.' },
                  { title: 'Wide Temperature Range', desc: 'Operates from -20°C to 60°C - suitable for all Indian climates.' },
                  { title: 'Modular & Scalable', desc: 'Add more batteries later as your energy needs grow.' },
                ].map((benefit) => (
                  <div key={benefit.title} className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Check className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{benefit.title}</h3>
                      <p className="text-sm text-muted-foreground">{benefit.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 p-8 border aspect-video flex items-center justify-center">
              <div className="text-center">
                <Battery className="h-24 w-24 mx-auto text-primary/30 mb-4" aria-hidden="true" />
                <p className="text-foreground">Battery Storage System</p>
                <p className="text-sm text-muted-foreground">LiFePO4 | 15+ year life | Modular</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* When to Choose Off-Grid */}
      <section className="py-20 lg:py-28 bg-muted/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">When to Choose Off-Grid</h2>
            <p className="text-lg text-muted-foreground">Off-grid is ideal when:</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Sun, title: 'No Grid Access', desc: 'Remote locations, farms, hill stations without electricity connection' },
              { icon: Zap, title: 'Unreliable Grid', desc: 'Frequent power cuts, voltage fluctuations, scheduled load shedding' },
              { icon: Battery, title: 'Critical Loads', desc: 'Medical equipment, servers, security systems needing 24/7 power' },
              { icon: Sun, title: 'Energy Independence', desc: 'Want complete control over your energy production and consumption' },
              { icon: Zap, title: 'High Diesel Costs', desc: 'Currently running diesel generators - solar pays back in 3-5 years' },
              { icon: Battery, title: 'New Construction', desc: 'Building new - design for off-grid from the start' },
            ].map((item) => (
              <div key={item.title} className="p-6 rounded-xl bg-card border">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
                  <item.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-28 bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">Achieve Energy Independence</h2>
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Schedule a free site assessment. We'll analyze your energy needs, roof space,
            and design a custom off-grid system with battery storage.
          </p>
          <a
            href="/request-survey"
            className="inline-flex items-center gap-2 rounded-md bg-primary-foreground px-8 py-3 text-lg font-medium text-primary hover:bg-primary-foreground/90 transition-colors"
          >
            Request Free Assessment
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </a>
        </div>
      </section>
    </div>
  )
}