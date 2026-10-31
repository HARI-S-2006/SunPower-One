import { Database, AlertCircle, CheckCircle } from 'lucide-react'

interface PlaceholderPageProps {
  title: string
  description: string
  icon?: React.ComponentType<{ className?: string }>
  features?: string[]
  phase?: number
}

export function PlaceholderPage({ title, description, icon: Icon = Database, features = [] as string[], phase = 0 }: PlaceholderPageProps) {
  const phaseNames = [
    'Foundation',
    'Stitch Design',
    'Database & Auth',
    'CRM & Customers',
    'Survey Management',
    'Product & BOM',
    'Quotations & Sales',
    'Inventory & Procurement',
    'Technicians & Installation',
    'Warranty Management',
    'Service & After-Sales',
    'Finance & Subsidy',
    'Analytics & Dashboard',
    'AI Assistant',
    'Integration',
    'Optimization',
  ]

  const currentPhase = phaseNames[phase] || `Phase ${phase}`

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{title}</h1>
          <p className="text-muted-foreground mt-1">{description}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
            {currentPhase}
          </span>
          {phase <= 1 && (
            <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-sm font-medium">
              In Progress
            </span>
          )}
          {phase > 1 && phase <= 15 && (
            <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
              Planned
            </span>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Status Card */}
          <div className="p-6 rounded-xl bg-card border">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-6 w-6" aria-hidden="true" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-foreground">Development Status</h2>
                <p className="text-muted-foreground mt-1">
                  {phase === 0
                    ? 'Foundation work in progress. Setting up project structure, documentation, and development environment.'
                    : phase === 1
                    ? 'Stitch design system integration in progress. Retrieving design tokens, screens, and components.'
                    : `This module will be implemented in ${currentPhase}.`}
                </p>
              </div>
            </div>
          </div>

          {/* Planned Features */}
          {features.length > 0 && (
            <div className="p-6 rounded-xl bg-card border">
              <h2 className="text-lg font-semibold text-foreground mb-4">Planned Features</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {features.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-primary/5 transition-colors"
                  >
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-primary/10 text-primary">
                      <CheckCircle className="h-4 w-4" aria-hidden="true" />
                    </div>
                    <span className="text-sm text-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Phase Roadmap */}
          <div className="p-6 rounded-xl bg-card border">
            <h2 className="text-lg font-semibold text-foreground mb-4">Implementation Roadmap</h2>
            <div className="space-y-3">
              {phaseNames.map((phaseName, index) => (
                <div
                  key={phaseName}
                  className={`flex items-center gap-4 p-3 rounded-lg transition-colors ${
                    index < phase
                      ? 'bg-green-50 border border-green-200'
                      : index === phase
                      ? 'bg-primary/5 border border-primary/20'
                      : 'bg-muted/50'
                  }`}
                >
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-medium ${
                      index < phase
                        ? 'bg-green-500 text-green-50'
                        : index === phase
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {index < phase ? (
                      <CheckCircle className="h-5 w-5" aria-hidden="true" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${index <= phase ? 'text-foreground' : 'text-muted-foreground'}`}>
                      Phase {index + 1}: {phaseName}
                    </p>
                    {index === phase && (
                      <p className="text-sm text-primary">Current Phase</p>
                    )}
                  </div>
                  {index < phase && (
                    <span className="text-xs text-green-600 font-medium">Complete</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="p-6 rounded-xl bg-card border">
            <h3 className="font-semibold text-foreground mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full p-3 rounded-lg border hover:bg-accent transition-colors text-left">
                <span className="text-sm font-medium text-foreground">View Requirements</span>
                <p className="text-xs text-muted-foreground">Competition requirements for this module</p>
              </button>
              <button className="w-full p-3 rounded-lg border hover:bg-accent transition-colors text-left">
                <span className="text-sm font-medium text-foreground">API Reference</span>
                <p className="text-xs text-muted-foreground">Database schema & API endpoints</p>
              </button>
              <button className="w-full p-3 rounded-lg border hover:bg-accent transition-colors text-left">
                <span className="text-sm font-medium text-foreground">Design Specs</span>
                <p className="text-xs text-muted-foreground">Stitch screens & component library</p>
              </button>
            </div>
          </div>

          {/* Key Requirements */}
          <div className="p-6 rounded-xl bg-card border">
            <h3 className="font-semibold text-foreground mb-4">Key Competition Requirements</h3>
            <div className="space-y-3 text-sm">
              {[
                'No dummy business workflows',
                'No hardcoded dashboard KPIs',
                'Database-enforced permissions (RLS)',
                'All money as NUMERIC/DECIMAL',
                'UUID identifiers',
                'Customer deduplication enforced',
                'No duplicate order conversion',
                'No duplicate serial dispatch',
                'Transaction-safe stock operations',
                'Warranty triggers at delivery',
                'Customer confirmation for ticket closure',
              ].map((req) => (
                <div key={req} className="flex items-start gap-2 text-muted-foreground">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{req}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tech Stack */}
          <div className="p-6 rounded-xl bg-card border">
            <h3 className="font-semibold text-foreground mb-4">Tech Stack</h3>
            <div className="flex flex-wrap gap-2">
              {['React 18', 'TypeScript', 'Vite', 'Tailwind CSS', 'shadcn/ui', 'TanStack Query', 'React Hook Form', 'Zod', 'Supabase', 'PostgreSQL', 'Row Level Security', 'Edge Functions', 'Vitest', 'Playwright'].map((tech) => (
                <span key={tech} className="px-2 py-1 rounded text-xs bg-muted text-muted-foreground">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}