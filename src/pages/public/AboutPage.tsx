import { Link } from 'react-router-dom'
import { Sun, Zap, ArrowRight, Target, Users, Heart, Lightbulb } from 'lucide-react'

export function AboutPage() {
  const values = [
    { icon: Target, title: 'Customer First', description: 'Every feature is designed to solve real problems faced by solar installation businesses and their customers.' },
    { icon: Lightbulb, title: 'Innovation', description: 'We continuously improve our platform with the latest technology to keep you ahead of the competition.' },
    { icon: Users, title: 'Team Success', description: 'Your field technicians, sales team, and management all win when operations are streamlined and transparent.' },
    { icon: Heart, title: 'Integrity', description: 'We build trust through reliable software, honest pricing, and commitment to your long-term success.' },
  ]

  const team = [
    { name: 'Rajesh Sharma', role: 'Founder & CEO', bio: '20+ years in solar industry. Former installation company owner.' },
    { name: 'Priya Patel', role: 'CTO', bio: 'Ex-Google, Microsoft. Expert in scalable SaaS platforms.' },
    { name: 'Amit Kumar', role: 'Head of Operations', bio: '15 years managing solar installation projects across India.' },
    { name: 'Sunita Singh', role: 'Customer Success', bio: 'Dedicated to helping customers maximize platform value.' },
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
              <span>About SunPower One</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6">
              Building the Future of{' '}
              <span className="text-primary">Solar Operations</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              SunPower One was born from the real challenges faced by SunPower Solutions -
              a solar installation company managing 40+ projects monthly with 15 field technicians.
              We built the platform we needed, and now we're sharing it with the industry.
            </p>
            <Link
              to="/request-survey"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-8 py-3 text-lg font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Experience the Platform
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">Our Mission</h2>
              <div className="space-y-4 text-lg text-muted-foreground">
                <p>
                  To transform manually operated solar installation businesses into connected,
                  transparent, and efficiently managed digital systems.
                </p>
                <p>
                  We believe that solar companies should focus on what they do best - installing
                  quality solar systems - not wrestling with disconnected tools, lost paperwork,
              </p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { number: '40+', label: 'Installations/Month Supported' },
                { number: '15+', label: 'Technicians Managed' },
                { number: '7', label: 'Connected Business Modules' },
                { number: '6', label: 'Real-Life Scenarios Covered' },
              ].map((stat) => (
                <div key={stat.label} className="p-6 rounded-xl bg-card border">
                  <div className="text-4xl font-bold text-primary">{stat.number}</div>
                  <div className="text-muted-foreground mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 lg:py-28 bg-muted/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Our Values</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              These principles guide every decision we make, from product design to customer support.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <article key={value.title} className="p-6 rounded-xl bg-card border">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
                  <value.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Meet Our Team</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experienced professionals from the solar industry and technology sector.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member) => (
              <article key={member.name} className="p-6 rounded-xl bg-card border text-center">
                <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Users className="h-10 w-10" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">{member.name}</h3>
                <p className="text-sm text-primary font-medium">{member.role}</p>
                <p className="text-sm text-muted-foreground mt-2">{member.bio}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-28 bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">Ready to Join Us?</h2>
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Whether you're a solar installer looking for better tools or a talented professional
            wanting to make an impact, we'd love to hear from you.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/contact"
              className="w-full sm:w-auto rounded-md bg-primary-foreground px-8 py-3 text-lg font-medium text-primary hover:bg-primary-foreground/90 transition-colors"
            >
              Get in Touch
            </Link>
            <Link
              to="/request-survey"
              className="w-full sm:w-auto rounded-md border-2 border-primary-foreground px-8 py-3 text-lg font-medium hover:bg-primary-foreground/10 transition-colors"
            >
              Try the Platform
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}