# SunPower One - Quick Start Guide

## 🚀 Get Running in 3 Minutes

```bash
# 1. Clone & Install
cd C:\Users\shari\Desktop\Hackathons\OODO\SUNPOWER-ONE
npm install

# 2. Configure Supabase (or use demo mode)
cp .env.example .env
# Edit .env with your Supabase credentials

# 3. Start Dev Server
npm run dev
# → Opens http://localhost:5173
```

---

## 🎯 Demo Accounts (No Supabase Needed!)

| Role | Email | Password | Access |
|------|-------|----------|--------|
| **Director** | `director@demo.com` | `password123` | Full system |
| **Sales** | `sales@demo.com` | `password123` | Leads, Quotes, Orders |
| **Survey Tech** | `survey@demo.com` | `password123` | Surveys |
| **Warehouse** | `warehouse@demo.com` | `password123` | Inventory, Dispatch |
| **Technician** | `tech@demo.com` | `password123` | Mobile jobs |
| **Finance** | `finance@demo.com` | `password123` | Invoices, Payments |
| **Support** | `support@demo.com` | `password123` | Tickets, Warranties |
| **Customer** | `customer@demo.com` | `password123` | Portal |

---

## 🔑 Key Flows to Demo

### 1. **Rooftop Inquiry → Installation** (Scenario 1)
```
/request-survey → /app/crm/leads → /app/surveys → /app/quotations → /app/orders → /app/inventory/dispatch → /technician/jobs → /portal
```

### 2. **BOM Auto-Generation** (Scenario 2)
```
/app/configurator → Select 3kW On-Grid → Auto: 6 panels, inverter, mounting, cables
```

### 3. **Serial Dispatch & Warranty** (Scenario 3)
```
/app/inventory/serials → Register serials → /app/inventory/dispatch → Scan → Auto-warranty
```

### 4. **Installation Completion** (Scenario 4)
```
/technician/checklist/:id → 5-point checklist → Photos → Customer signature → Complete
```

### 5. **Service & Warranty** (Scenario 5)
```
/portal/service → File ticket with serial → Auto warranty check → ₹0 covered repair
```

### 6. **Director Analytics** (Scenario 6)
```
/app/dashboard → KPIs → /app/profitability → /app/analytics
```

---

## 🧪 Run Tests

```bash
# Unit tests
npm run test:run

# E2E tests (requires dev server running)
npm run dev &
npm run e2e

# Type check
npm run typecheck
```

---

## 📦 Build for Production

```bash
npm run build
# Output in /dist - deploy to Vercel, Netlify, etc.
```

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| `src/lib/store/solarStore.tsx` | Reactive state (7 modules, demo data) |
| `src/lib/bom/calculator.ts` | Parametric BOM engine |
| `supabase/migrations/*.sql` | 90+ tables, RLS, functions |
| `design/stitch/*.md` | Design system docs |
| `docs/COMPETITION_REQUIREMENTS.md` | Authoritative requirements |
| `DEPLOYMENT.md` | Vercel + Supabase deploy guide |

---

## 🆘 Troubleshooting

| Issue | Fix |
|-------|-----|
| "Supabase not configured" | Works in demo mode without Supabase |
| Port 5173 busy | `npm run dev -- --port 3000` |
| Build fails | Run `npm run typecheck` first |
| Demo data missing | Click "Reset Demo Dataset" in `/app/settings` |

---

## 🏆 Competition Ready

✅ **6 Scenarios** | ✅ **7 Modules** | ✅ **4 Experiences** | ✅ **All Tests Pass**

**Good luck at the hackathon!** 🚀