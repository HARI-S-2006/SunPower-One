import { Link } from 'react-router-dom'
import { Sun, Zap, ArrowRight, CheckCircle, Shield, Truck, Users, Calculator, MapPin, Star } from 'lucide-react'

export function HomePage() {
  const features = [
    {
      icon: Users,
      title: 'Complete CRM',
      description: 'Manage leads, customers, and follow-ups in one place. Never lose an enquiry again.',
    },
    {
      icon: MapPin,
      title: 'Survey Management',
      description: 'Schedule site surveys, capture roof measurements, photos, and get approvals digitally.',
    },
    {
      icon: Calculator,
      title: 'Smart Quotations',
      description: 'Auto-generate BOMs from configurable rules. Accurate pricing every time.',
    },
    {
      icon: Truck,
      title: 'Inventory & Serial Tracking',
      description: 'Track every panel, inverter, and battery by serial number. QR scanning for dispatch.',
    },
    {
      icon: CheckCircle,
      title: 'Mobile Installation',
      description: 'Technician checklists, photos, testing, and digital signatures on-site.',
    },
    {
      icon: Shield,
      title: 'Warranty & Service',
      description: 'Automatic warranty activation, service tickets, and coverage validation.',
    },
  ]

  const stats = [
    { value: '40+', label: 'Installations/Month' },
    { value: '15', label: 'Field Technicians' },
    { value: '1-5kW', label: 'System Range' },
    { value: '20yr', label: 'Panel Warranty' },
  ]

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/50 py-20 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
              <Sun className="h-4 w-4" aria-hidden="true" />
              <Zap className="h-4 w-4 text-yellow-400" aria-hidden="true" />
              <span>SunPower One - Solar Installation Management</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6">
              The Intelligent Operating Platform for{' '}
              <span className="text-primary">Solar Installation Businesses</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Replace WhatsApp, paper registers, and manual records with one connected application.
              Manage your entire business lifecycle - from enquiry to warranty - in a single platform.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/request-survey"
                className="w-full sm:w-auto rounded-md bg-primary px-8 py-3 text-lg font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Request a Survey
                <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
              </Link>
              <Link
                to="/solar-calculator"
                className="w-full sm:w-auto rounded-md border bg-background px-8 py-3 text-lg font-medium hover:bg-accent transition-colors"
              >
                Try Solar Calculator
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center p-6 rounded-xl bg-card border">
                <div className="text-3xl sm:text-4xl font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Everything You Need to Run Your Solar Business
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Seven connected modules covering the complete business lifecycle.
              Built for the way SunPower Solutions actually works.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <article
                key={feature.title}
                className="group p-6 rounded-xl bg-card border hover:border-primary/50 transition-colors"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <feature.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Business Lifecycle */}
      <section className="py-20 lg:py-28 bg-muted/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Complete Business Lifecycle Management
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Every stage connected to the same customer and project. No duplicate data entry.
            </p>
          </div>

          <div className="overflow-x-auto">
            <ol className="flex items-center gap-4 min-w-max px-4 pb-4" role="list" aria-label="Business lifecycle stages">
              {[
                { label: 'Customer Enquiry', icon: Users },
                { label: 'Site Survey', icon: MapPin },
                { label: 'Quotation & Order', icon: Calculator },
                { label: 'Payment', icon: Shield },
                { label: 'Inventory & Dispatch', icon: Truck },
                { label: 'Installation', icon: CheckCircle },
                { label: 'Warranty & Service', icon: Shield },
                { label: 'Finance & Analytics', icon: Star },
              ].map((stage, index) => (
                <li key={stage.label} className="flex flex-col items-center relative">
                  {index < 7 && (
                    <div className="absolute top-10 left-1/2 w-full h-1 bg-border -translate-x-1/2 lg:w-[calc(100%+1rem)]" aria-hidden="true" />
                  )}
                  <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-primary text-primary-foreground z-10">
                    <stage.icon className="h-8 w-8" aria-hidden="true" />
                  </div>
                  <span className="mt-3 text-sm font-medium text-center text-foreground whitespace-nowrap">{stage.label}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Customer Types */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
                Built for Solar Installation Companies Like Yours
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                SunPower One is designed for businesses managing 40+ installations per month with field teams of 15+ technicians.
                Whether you serve homeowners or small factories, our platform scales with you.
              </p>
              <ul className="space-y-4">
                {[
                  'Homeowner rooftop installations (1-5 kW)',
                  'Small factory & commercial projects',
                  'On-Grid and Off-Grid system configurations',
                  'Post-installation warranty & service management',
                  'Government subsidy documentation tracking',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary shrink-0" aria-hidden="true" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 p-8 border">
              <div className="aspect-video rounded-lg bg-primary/10 flex items-center justify-center">
                <div className="text-center p-8">
                  <Sun className="h-16 w-16 mx-auto text-primary/50 mb-4" aria-hidden="true" />
                  <p className="text-foreground">Dashboard Preview</p>
                  <p className="text-sm text-muted-foreground mt-2">Real-time KPIs from actual data</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-28 bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">Ready to Transform Your Solar Business?</h2>
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Join SunPower Solutions in replacing manual operations with a connected digital platform.
            Start with a free survey request today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/request-survey"
              className="w-full sm:w-auto rounded-md bg-primary-foreground px-8 py-3 text-lg font-medium text-primary hover:bg-primary-foreground/90 transition-colors"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
            </Link>
            <Link
              to="/contact"
              className="w-full sm:w-auto rounded-md border-2 border-primary-foreground px-8 py-3 text-lg font-medium hover:bg-primary-foreground/10 transition-colors"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}