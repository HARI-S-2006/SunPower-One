# AGENTS.md - SunPower One Agent Handoffs and Ownership

## Project Overview
SunPower One - Solar Installation Management System for Hackathon Competition

## Team Ownership (3 Developers)

### DEVELOPER 1: Database & Backend Architecture
**Responsibilities:**
- Supabase database schema design and migrations
- PostgreSQL functions for critical business logic
- Row Level Security (RLS) policies
- Supabase Auth configuration
- Supabase Edge Functions for secrets/integrations
- Database security testing
- Business logic enforcement at database level

**Owned Files:**
- `supabase/migrations/*`
- `supabase/functions/*`
- `src/lib/supabase/*`
- `src/types/database.ts`
- `docs/DATABASE_DESIGN.md`
- `docs/RLS_POLICIES.md`

### DEVELOPER 2: Frontend & Stitch Implementation
**Responsibilities:**
- React + TypeScript + Vite application setup
- Google Stitch design system implementation
- Public website pages
- Admin application shell and routing
- Technician mobile experience
- Customer portal
- UI component library (shadcn/ui + Tailwind)
- Responsive design and accessibility

**Owned Files:**
- `src/components/ui/*`
- `src/components/layout/*`
- `src/pages/public/*`
- `src/pages/app/*`
- `src/pages/technician/*`
- `src/pages/portal/*`
- `src/hooks/*`
- `src/lib/stitch/*`
- `design/stitch/*`
- `tailwind.config.ts`
- `vite.config.ts`

### DEVELOPER 3: Business Modules & Integration
**Responsibilities:**
- Inventory management (stock, serials, dispatch)
- Installation workflow (technician jobs, checklists, signatures)
- Warranty and service management
- Finance and analytics dashboards
- Subsidy tracking
- End-to-end integration testing
- Playwright E2E tests
- Demonstration dataset creation

**Owned Files:**
- `src/pages/app/inventory/*`
- `src/pages/app/installations/*`
- `src/pages/app/warranties/*`
- `src/pages/app/service/*`
- `src/pages/app/invoices/*`
- `src/pages/app/expenses/*`
- `src/pages/app/technician-payments/*`
- `src/pages/app/subsidies/*`
- `src/pages/app/profitability/*`
- `src/pages/app/analytics/*`
- `src/lib/bom/*`
- `tests/e2e/*`
- `tests/fixtures/*`

## Shared Responsibilities
- API integration layer (TanStack Query)
- Form validation (React Hook Form + Zod)
- State management
- Error boundaries and logging
- Documentation updates

## Handoff Protocol

### Before Starting Work
1. Read this AGENTS.md
2. Read `docs/PHASE_PROGRESS.md`
3. Check git status for uncommitted changes
4. Review owned files for conflicts

### During Work
1. Create feature branch from main
2. Make atomic commits with clear messages
3. Run tests before pushing
4. Update relevant documentation

### After Completing Phase
1. Update `docs/PHASE_PROGRESS.md` with:
   - Phase number and name
   - Completion status
   - Files created/modified
   - Tests passed/failed
   - Blockers or unresolved dependencies
   - Handoff notes for next developer
2. Run full test suite
3. Verify build succeeds
4. Tag release if applicable

## Integration Requirements

### DEVELOPER 1 → DEVELOPER 2
- Database types exported to `src/types/database.ts`
- Supabase client configured in `src/lib/supabase/client.ts`
- Auth helpers in `src/lib/supabase/auth.ts`
- RLS policies documented for frontend permission checks

### DEVELOPER 1 → DEVELOPER 3
- PostgreSQL functions for BOM calculation, stock reservation, serial dispatch
- Warranty activation triggers
- Financial aggregation views
- Migration scripts for demo data

### DEVELOPER 2 → DEVELOPER 3
- Shared UI components (forms, tables, modals)
- Routing structure and navigation
- Design tokens and theme configuration
- Responsive breakpoints

### DEVELOPER 3 → DEVELOPER 1
- Business logic requirements for database functions
- Performance query patterns for optimization
- Test cases for security validation

### DEVELOPER 3 → DEVELOPER 2
- Page-level component requirements
- Data fetching patterns (TanStack Query keys)
- Form schemas (Zod)
- Mobile-specific UX needs

## Communication Channels
- Primary: This AGENTS.md file (update handoff sections)
- Secondary: `docs/AGENT_HANDOFFS.md` for detailed work logs
- Escalation: Direct communication for blocking issues

## Current Phase Status
**Phase 0: Local Workspace and Project Foundation** - IN PROGRESS
**Phase 1: Stitch Design and Application Foundation** - PENDING

## Unresolved Integrations
- [ ] Google Stitch MCP access for project 11813858513178811754
- [ ] Supabase project credentials (URL, anon key, service role key)
- [ ] Supabase Edge Functions deployment target
- [ ] Production deployment target (Vercel/Netlify/etc.)

## Contact Information
- Primary Agent: OpenCode (NVIDIA Nemotron 3 Ultra)
- QA Agent: Antigravity (Gemini 3.8 Flash)
- Human Team: 3 developers (roles defined above)