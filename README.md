# SunPower One

The intelligent operating platform for solar installation businesses.

## Overview

SunPower One is a complete Solar Installation Management System built for the hackathon competition. It transforms the manually operated solar installation business (WhatsApp, phone calls, paper registers) into a connected, transparent, and efficiently managed digital platform.

**Company:** SunPower Solutions
- ~40 rooftop installations/month
- ~15 field technicians
- Homeowners and small factories
- 1 kW to 5 kW solar systems
- Installation + warranty support

## Competition Requirements

See [docs/COMPETITION_REQUIREMENTS.md](docs/COMPETITION_REQUIREMENTS.md) for the complete authoritative requirements including:
- 6 mandatory real-life scenarios
- 7 connected business modules
- Complete business lifecycle management
- Database and security requirements
- Required frontend pages and dashboards

## Technology Stack

**Frontend:**
- React 18 + TypeScript
- Vite
- Tailwind CSS + shadcn/ui
- React Router v6
- TanStack Query (React Query)
- React Hook Form + Zod
- Recharts
- Lucide React

**Backend:**
- Supabase (PostgreSQL + Auth + Storage + Realtime + Edge Functions)
- PostgreSQL functions for critical business logic
- Row Level Security (RLS) on all business tables

**Testing:**
- Vitest + React Testing Library
- Playwright (E2E)
- SQL security tests

**Design:**
- Google Stitch (Project ID: 11813858513178811754)
- Authoritative UI/UX source

## Project Structure

```
SUNPOWER-ONE/
├── AGENTS.md                 # Agent handoffs and ownership
├── README.md                 # This file
├── .env.example              # Environment template
├── docs/                     # All technical documentation
│   ├── COMPETITION_REQUIREMENTS.md
│   ├── PHASE_PROGRESS.md
│   ├── AGENT_HANDOFFS.md
│   ├── DATABASE_DESIGN.md
│   ├── RLS_POLICIES.md
│   └── ...
├── design/
│   └── stitch/               # Stitch design system exports
│       ├── DESIGN_SYSTEM.md
│       ├── SCREEN_INVENTORY.md
│       ├── ROUTE_MAPPING.md
│       ├── COMPONENT_INVENTORY.md
│       ├── screenshots/
│       ├── exported-code/
│       └── assets/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── ui/               # shadcn/ui base components
│   │   ├── layout/           # Layout components (shells, navigation)
│   │   └── forms/            # Form components
│   ├── pages/                # Page components by route
│   │   ├── public/           # Public website pages
│   │   ├── app/              # Admin application pages
│   │   ├── technician/       # Technician mobile pages
│   │   └── portal/           # Customer portal pages
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Libraries and utilities
│   │   ├── supabase/         # Supabase client, auth, types
│   │   ├── stitch/           # Stitch design tokens
│   │   ├── bom/              # BOM calculation engine
│   │   └── utils.ts
│   ├── types/                # TypeScript types
│   ├── styles/               # Global styles, Tailwind
│   └── main.tsx              # Application entry
├── supabase/
│   ├── migrations/           # Database migrations (numbered)
│   ├── functions/            # Edge Functions
│   ├── seed/                 # Seed data for development
│   └── config.toml           # Supabase local config
├── tests/
│   ├── unit/                 # Vitest unit tests
│   ├── integration/          # Integration tests
│   ├── e2e/                  # Playwright E2E tests
│   └── fixtures/             # Test fixtures and helpers
└── public/                   # Static assets
```

## Getting Started

### Prerequisites
- Node.js 20+
- pnpm (recommended) or npm
- Supabase CLI (for local development)
- Git

### Installation

```bash
# Install dependencies
pnpm install

# Copy environment template
cp .env.example .env

# Start Supabase locally (optional)
supabase start

# Run database migrations
supabase db reset

# Start development server
pnpm dev
```

### Environment Variables

See `.env.example` for required variables:
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key (server only)

## Development Workflow

### Phase-Based Development
This project follows a strict 15-phase roadmap. See `docs/PHASE_PROGRESS.md` for current status.

**Current Phase:** Phase 0 - Local Workspace and Project Foundation

### Team Collaboration
- 3 developers with defined ownership (see AGENTS.md)
- Feature branches for all changes
- Atomic commits with conventional messages
- All tests must pass before merge

### Code Standards
- TypeScript strict mode
- ESLint + Prettier
- No dummy business workflows
- No hardcoded KPIs
- Database-enforced permissions (RLS)
- All money as NUMERIC/DECIMAL
- UUID identifiers

## Key Business Rules (Enforced in Database)

1. **No final quotation before survey approval** - Database constraint
2. **No duplicate customer creation** - Unique constraints + deduplication logic
3. **No duplicate order conversion** - Idempotent order creation
4. **No duplicate serial dispatch** - Unique serial per customer
5. **No negative stock** - Transaction-safe reservations
6. **Warranty starts at delivery completion** - Configurable trigger
7. **Customer confirmation required for ticket closure** - Workflow enforcement

## Required Demonstration (Acceptance Tests)

The complete end-to-end flow must work through the UI:
1. Customer enquiry → Lead → Survey → Approval → Quotation → Order → Payment
2. Stock check → Procurement → Serial scanning → Dispatch → Delivery
3. Warranty activation → Installation → Photos → Testing → Signature
4. Service request → Warranty check → Repair → Customer confirmation
5. Director dashboard: Revenue, profitability, inventory, complaints, subsidies

## Documentation

- `docs/COMPETITION_REQUIREMENTS.md` - Authoritative requirements
- `docs/PHASE_PROGRESS.md` - Phase tracking
- `docs/AGENT_HANDOFFS.md` - Detailed work logs
- `docs/DATABASE_DESIGN.md` - Schema documentation
- `docs/RLS_POLICIES.md` - Security policies
- `design/stitch/DESIGN_SYSTEM.md` - Design tokens and components

## License

Hackathon competition entry - SunPower One