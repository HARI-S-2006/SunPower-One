# SunPower One - Deployment Guide

## Quick Deploy to Vercel + Supabase

### Prerequisites
- Supabase project created
- Vercel account
- Git repository (GitHub/GitLab/Bitbucket)

---

## 1. Supabase Setup

### Create Project
1. Go to [supabase.com](https://supabase.com) → New Project
2. Note your **Project URL** and **anon/public key**

### Run Migrations
```bash
# Install Supabase CLI
npm install -g supabase

# Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# Push migrations
supabase db push
```

### Verify Tables
Go to Supabase Dashboard → Table Editor → Verify 90+ tables exist

### Configure Auth
- Authentication → Providers → Enable Email/Password
- Authentication → URL Configuration → Add redirect URLs:
  - `http://localhost:5173/**` (dev)
  - `https://your-app.vercel.app/**` (prod)

---

## 2. Environment Variables

### Local (.env)
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_APP_NAME=SunPower One
VITE_APP_URL=http://localhost:5173
```

### Vercel (Project Settings → Environment Variables)
| Variable | Value |
|----------|-------|
| `VITE_SUPABASE_URL` | `https://your-project.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `your-anon-key` |
| `VITE_APP_NAME` | `SunPower One` |
| `VITE_APP_URL` | `https://your-app.vercel.app` |

---

## 3. Deploy to Vercel

### Option A: Vercel Dashboard
1. Import repository
2. Framework: **Vite**
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Add environment variables
6. Deploy

### Option B: Vercel CLI
```bash
npm i -g vercel
vercel login
vercel --prod
```

---

## 4. Post-Deploy Verification

### Checklist
- [ ] Homepage loads at `https://your-app.vercel.app`
- [ ] Login works with demo accounts
- [ ] All 4 experiences accessible:
  - Public: `/`, `/solutions`, `/calculator`, `/request-survey`
  - Admin: `/app/dashboard`, `/app/crm/leads`, etc.
  - Technician: `/technician/dashboard`
  - Customer: `/portal/dashboard`
- [ ] Supabase connection works (check Network tab for API calls)
- [ ] Demo data loads correctly

### Demo Accounts
| Role | Email | Password |
|------|-------|----------|
| Director | `director@demo.com` | `password123` |
| Sales | `sales@demo.com` | `password123` |
| Survey Tech | `survey@demo.com` | `password123` |
| Warehouse | `warehouse@demo.com` | `password123` |
| Technician | `tech@demo.com` | `password123` |
| Finance | `finance@demo.com` | `password123` |
| Support | `support@demo.com` | `password123` |
| Customer | `customer@demo.com` | `password123` |

---

## 5. Production Optimizations

### Vercel Settings
- **Edge Functions**: Enable for API routes if needed
- **ISR**: Not needed (SPA)
- **Caching**: Static assets cached automatically

### Supabase Settings
- **Connection Pooling**: Enable for production
- **Read Replicas**: Consider for high traffic
- **Backups**: Enable daily backups

### Security Headers (vercel.json)
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
      ]
    }
  ]
}
```

---

## 6. Monitoring & Maintenance

### Supabase Dashboard
- Database → Logs → Slow queries
- Auth → Users → Active sessions
- Storage → Usage

### Vercel Analytics
- Enable Web Analytics
- Enable Speed Insights

### Health Checks
```bash
# Test API connectivity
curl https://your-app.vercel.app/api/health

# Test Supabase
curl -H "apikey: YOUR_ANON_KEY" \
  https://your-project.supabase.co/rest/v1/
```

---

## 7. Rollback Procedure

### Vercel
```bash
# List deployments
vercel ls

# Rollback to previous
vercel rollback [deployment-url]
```

### Supabase
- Use Point-in-Time Recovery (PITR) if enabled
- Or restore from daily backup

---

## 8. Cost Estimates (Monthly)

| Service | Free Tier | Pro Estimate |
|---------|-----------|--------------|
| Vercel | ✅ | $20/mo |
| Supabase | ✅ (500MB DB) | $25/mo |
| **Total** | **$0** | **~$45/mo** |

---

## 9. Support Commands

```bash
# Local development
npm run dev

# Type check
npm run typecheck

# Lint
npm run lint

# Test
npm run test:run

# Build
npm run build

# Preview production build
npm run preview
```

---

## 10. Troubleshooting

| Issue | Solution |
|-------|----------|
| Supabase connection failed | Check VITE_SUPABASE_URL and anon key |
| Auth redirect loop | Verify redirect URLs in Supabase Auth settings |
| Build fails | Run `npm run typecheck` locally first |
| Demo data not loading | Check Supabase RLS policies enabled |
| Large bundle warning | Add `manualChunks` to vite.config.ts |

---

**Deployment Complete! 🚀**

Your SunPower One platform is now live at `https://your-app.vercel.app`