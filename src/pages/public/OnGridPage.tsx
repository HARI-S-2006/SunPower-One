import { Sun, Zap, Grid, Check, ArrowRight } from 'lucide-react'

export function OnGridPage() {
  const systemSizes = [
    { kw: 1, panels: 2, area: '100 sq ft', estPrice: '₹65,000', monthlySavings: '₹800-1,200' },
    { kw: 2, panels: 4, area: '200 sq ft', estPrice: '₹1,20,000', monthlySavings: '₹1,600-2,400' },
    { kw: 3, panels: 6, area: '300 sq ft', estPrice: '₹1,70,000', monthlySavings: '₹2,400-3,600' },
    { kw: 4, panels: 8, area: '400 sq ft', estPrice: '₹2,20,000', monthlySavings: '₹3,200-4,800' },
    { kw: 5, panels: 10, area: '500 sq ft', estPrice: '₹2,70,000', monthlySavings: '₹4,000-6,000' },
  ]

  const components = [
    { name: 'Solar Panels', desc: 'High-efficiency monocrystalline panels (500W each)', icon: Sun },
    { name: 'Grid-Tie Inverter', desc: 'Converts DC to AC, syncs with grid frequency', icon: Grid },
    { name: 'Mounting Structure', desc: 'Galvanized iron/aluminum rails for roof mounting', icon: Grid },
    { name: 'AC/DC Wiring', desc: 'UV-resistant cables, conduits, and junction boxes', icon: Zap },
    { name: 'Safety Earthing', desc: 'Lightning arrestor, earthing strips, and bonding', icon: Zap },
    { name: 'Monitoring System', desc: 'WiFi/Ethernet data logger for performance tracking', icon: Sun },
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
              <span>On-Grid Solar Systems</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6">
              Grid-Connected Solar for{' '}
              <span className="text-primary">Homes & Businesses</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Generate your own power, reduce electricity bills by up to 90%, and earn credits
              for excess energy fed back to the grid. 1 kW to 5 kW systems available.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="/request-survey" className="w-full sm:w-auto rounded-md bg-primary px-8 py-3 text-lg font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                Get Free Quote
                <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
              </a>
              <a href="/solar-calculator" className="w-full sm:w-auto rounded-md border bg-background px-8 py-3 text-lg font-medium hover:bg-accent transition-colors">
                Calculate Savings
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">How On-Grid Solar Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Simple, reliable, and cost-effective. Your system works seamlessly with the grid.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: 1, title: 'Sunlight Hits Panels', desc: 'Solar panels convert sunlight into DC electricity' },
              { step: 2, title: 'Inverter Converts Power', desc: 'Grid-tie inverter converts DC to usable AC power' },
              { step: 3, title: 'Power Your Home', desc: 'Solar power runs your appliances first' },
              { step: 4, title: 'Excess Goes to Grid', desc: 'Extra energy earns credits via net metering' },
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
            <p className="text-lg text-muted-foreground mb-4">Choose the right capacity for your needs</p>
            <p className="text-sm text-muted-foreground">*Estimated prices before subsidy. Actual pricing requires site survey.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full" role="table">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-semibold text-foreground">System Size</th>
                  <th className="text-center p-4 font-semibold text-foreground">Panels (500W)</th>
                  <th className="text-center p-4 font-semibold text-foreground">Roof Area</th>
                  <th className="text-center p-4 font-semibold text-foreground">Est. Price</th>
                  <th className="text-center p-4 font-semibold text-foreground">Monthly Savings</th>
                  <th className="text-center p-4 font-semibold text-foreground">Best For</th>
                </tr>
              </thead>
              <tbody>
                {systemSizes.map((size) => (
                  <tr key={size.kw} className="border-b hover:bg-card">
                    <td className="p-4 font-semibold text-foreground">{size.kw} kW</td>
                    <td className="p-4 text-center text-muted-foreground">{size.panels}</td>
                    <td className="p-4 text-center text-muted-foreground">{size.area}</td>
                    <td className="p-4 text-center font-medium text-foreground">{size.estPrice}</td>
                    <td className="p-4 text-center text-green-600 font-medium">{size.monthlySavings}</td>
                    <td className="p-4 text-center text-sm text-muted-foreground">
                      {size.kw <= 2 ? 'Small homes' : size.kw === 3 ? 'Medium homes' : 'Large homes/small factories'}
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
            <p className="text-lg text-muted-foreground">Quality components for reliable performance</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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

      {/* Benefits */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">Why Choose On-Grid?</h2>
              <div className="space-y-6">
                {[
                  { title: 'Reduce Bills by Up to 90%', desc: 'Generate your own power during peak hours when electricity rates are highest.' },
                  { title: 'Earn with Net Metering', desc: 'Export excess energy to the grid and get credits on your electricity bill.' },
                  { title: 'Government Subsidies', desc: 'Up to 40% subsidy available for residential systems under government schemes.' },
                  { title: 'Low Maintenance', desc: 'No batteries to maintain. Panels and inverters typically last 20-25 years.' },
                  { title: 'Increase Property Value', desc: 'Solar installations increase home value and attract buyers.' },
                  { title: 'Environmental Impact', desc: 'A 3kW system offsets ~4 tons of CO₂ annually - equivalent to planting 180 trees.' },
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
                <Sun className="h-24 w-24 mx-auto text-primary/30 mb-4" aria-hidden="true" />
                <p className="text-foreground">System Diagram</p>
                <p className="text-sm text-muted-foreground">Interactive visualization coming soon</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-28 bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">Ready to Go Solar?</h2>
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Start with a free site survey. Our technicians will assess your roof, calculate
            the optimal system size, and provide a detailed quotation.
          </p>
          <a
            href="/request-survey"
            className="inline-flex items-center gap-2 rounded-md bg-primary-foreground px-8 py-3 text-lg font-medium text-primary hover:bg-primary-foreground/90 transition-colors"
          >
            Request Free Survey
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </a>
        </div>
      </section>
    </div>
  )
}