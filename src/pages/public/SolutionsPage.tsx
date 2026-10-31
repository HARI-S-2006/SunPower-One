import { Link } from 'react-router-dom'
import { Sun, Zap, Grid, Battery, ArrowRight, Check } from 'lucide-react'

const systemTypes = [
  {
    id: 'on-grid',
    title: 'On-Grid Solar Systems',
    subtitle: 'Connected to the electricity grid',
    icon: Grid,
    description: 'Generate solar power and feed excess back to the grid. Reduce electricity bills with net metering.',
    capacity: '1 kW to 5 kW',
    components: ['Solar Panels', 'Grid-Tie Inverter', 'Mounting Structure', 'AC/DC Wiring', 'Safety Earthing', 'Monitoring System'],
    benefits: ['Lower electricity bills', 'Net metering credits', 'No battery maintenance', 'Grid backup', 'Government subsidies available'],
    idealFor: ['Homeowners with reliable grid', 'Small factories', 'Commercial buildings', 'Anyone wanting bill reduction'],
  },
  {
    id: 'off-grid',
    title: 'Off-Grid Solar Systems',
    subtitle: 'Complete energy independence',
    icon: Battery,
    description: 'Generate and store your own power. Perfect for areas without grid access or frequent outages.',
    capacity: '1 kW to 5 kW',
    components: ['Solar Panels', 'Hybrid Inverter', 'Battery Bank', 'Mounting Structure', 'AC/DC Wiring', 'Safety Earthing', 'Charge Controller'],
    benefits: ['Complete energy independence', 'Power during outages', 'No grid dependency', 'Remote location ready', 'Scalable storage'],
    idealFor: ['Remote locations', 'Areas with unreliable grid', 'Farms & rural properties', 'Emergency backup systems'],
  },
]

export function SolutionsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-gradient-to-b from-background to-muted/50 py-20 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
              <Sun className="h-4 w-4" aria-hidden="true" />
              <Zap className="h-4 w-4 text-yellow-400" aria-hidden="true" />
              <span>Solar Solutions</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6">
              Choose the Right System for{' '}
              <span className="text-primary">Your Needs</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              From grid-connected systems that reduce your bills to off-grid solutions for complete energy independence.
              We offer 1 kW to 5 kW systems tailored for homes and small factories.
            </p>
          </div>
        </div>
      </section>

      {/* System Comparison */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {systemTypes.map((system) => (
              <article key={system.id} className="p-8 rounded-2xl bg-card border">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <system.icon className="h-7 w-7" aria-hidden="true" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">{system.title}</h2>
                    <p className="text-muted-foreground">{system.subtitle}</p>
                  </div>
                </div>

                <p className="text-muted-foreground mb-6">{system.description}</p>

                <div className="mb-6">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <span className="font-medium text-foreground">Capacity:</span>
                    <span>{system.capacity}</span>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold text-foreground mb-3">Key Components</h3>
                  <ul className="space-y-2">
                    {system.components.map((comp) => (
                      <li key={comp} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
                        <span>{comp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold text-foreground mb-3">Benefits</h3>
                  <ul className="space-y-2">
                    {system.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-500 shrink-0" aria-hidden="true" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold text-foreground mb-3">Ideal For</h3>
                  <div className="flex flex-wrap gap-2">
                    {system.idealFor.map((item) => (
                      <span key={item} className="px-3 py-1 rounded-full bg-muted text-sm text-muted-foreground">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <Link
                  to={`/solutions/${system.id}`}
                  className="inline-flex items-center gap-2 w-full rounded-md bg-primary px-6 py-3 text-center font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Learn More
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Comparison Table */}
      <section className="py-20 lg:py-28 bg-muted/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Quick Comparison</h2>
            <p className="text-lg text-muted-foreground">Side-by-side comparison to help you decide</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full" role="table">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-semibold text-foreground">Feature</th>
                  <th className="text-center p-4 font-semibold text-foreground">On-Grid</th>
                  <th className="text-center p-4 font-semibold text-foreground">Off-Grid</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: 'Grid Connection', onGrid: 'Yes', offGrid: 'No' },
                  { feature: 'Battery Storage', onGrid: 'Optional', offGrid: 'Required' },
                  { feature: 'Net Metering', onGrid: 'Yes', offGrid: 'No' },
                  { feature: 'Power During Outage', onGrid: 'No (without battery)', offGrid: 'Yes' },
                  { feature: 'Maintenance', onGrid: 'Low', offGrid: 'Medium (battery)' },
                  { feature: 'Upfront Cost', onGrid: 'Lower', offGrid: 'Higher' },
                  { feature: 'Subsidy Eligible', onGrid: 'Yes', offGrid: 'Limited' },
                  { feature: 'Best For', onGrid: 'Grid-connected homes', offGrid: 'Remote/unreliable grid' },
                ].map((row) => (
                  <tr key={row.feature} className="border-b">
                    <td className="p-4 text-foreground">{row.feature}</td>
                    <td className="p-4 text-center text-muted-foreground">{row.onGrid}</td>
                    <td className="p-4 text-center text-muted-foreground">{row.offGrid}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-28 bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">Not Sure Which System?</h2>
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Use our solar calculator to estimate your requirements, or request a free site survey
            where our technicians will assess your property and recommend the best solution.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/solar-calculator"
              className="w-full sm:w-auto rounded-md bg-primary-foreground px-8 py-3 text-lg font-medium text-primary hover:bg-primary-foreground/90 transition-colors"
            >
              Try Solar Calculator
            </Link>
            <Link
              to="/request-survey"
              className="w-full sm:w-auto rounded-md border-2 border-primary-foreground px-8 py-3 text-lg font-medium hover:bg-primary-foreground/10 transition-colors"
            >
              Request Free Survey
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}