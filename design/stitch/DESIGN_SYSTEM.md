# SunPower One - Design System (Google Stitch Authority)

**Project ID:** 11813858513178811754
**Project URL:** https://stitch.withgoogle.com/projects/11813858513178811754
**Status:** Design tokens extracted from competition requirements; awaiting Stitch MCP access for full fidelity

---

## Color Palette

### Primary Brand Colors (SunPower Green)
```css
--sunpower-50:  #f0fdf4
--sunpower-100: #dcfce7
--sunpower-200: #bbf7d0
--sunpower-300: #86efac
--sunpower-400: #4ade80
--sunpower-500: #22c55e  /* Primary brand */
--sunpower-600: #16a34a  /* Primary actions */
--sunpower-700: #15803d
--sunpower-800: #166534
--sunpower-900: #14532d
--sunpower-950: #052e16
```

### Semantic Colors (CSS Variables)
```css
/* Light Mode */
--background: 0 0% 100%
--foreground: 222.2 84% 4.9%
--card: 0 0% 100%
--card-foreground: 222.2 84% 4.9%
--popover: 0 0% 100%
--popover-foreground: 222.2 84% 4.9%
--primary: 142 76% 36%           /* sunpower-600 */
--primary-foreground: 0 0% 98%
--secondary: 210 40% 96.1%
--secondary-foreground: 222.2 47.4% 11.2%
--muted: 210 40% 96.1%
--muted-foreground: 215.4 16.3% 46.9%
--accent: 210 40% 96.1%
--accent-foreground: 222.2 47.4% 11.2%
--destructive: 0 84.2% 60.2%
--destructive-foreground: 210 40% 98%
--border: 214.3 31.8% 91.4%
--input: 214.3 31.8% 91.4%
--ring: 142 76% 36%
--radius: 0.5rem

/* Dark Mode */
--background: 222.2 84% 4.9%
--foreground: 210 40% 98%
--card: 222.2 84% 4.9%
--card-foreground: 210 40% 98%
--popover: 222.2 84% 4.9%
--popover-foreground: 210 40% 98%
--primary: 142 76% 36%
--primary-foreground: 222.2 47.4% 11.2%
--secondary: 217.2 32.6% 17.5%
--secondary-foreground: 210 40% 98%
--muted: 217.2 32.6% 17.5%
--muted-foreground: 215 20.2% 65.1%
--accent: 217.2 32.6% 17.5%
--accent-foreground: 210 40% 98%
--destructive: 0 62.8% 30.6%
--destructive-foreground: 210 40% 98%
--border: 217.2 32.6% 17.5%
--input: 217.2 32.6% 17.5%
--ring: 142 76% 36%
```

### Status Colors
```css
--success: 142 76% 36%      /* Green - completed, approved, active */
--warning: 38 92% 50%       /* Amber - pending, warning */
--error: 0 84.2% 60.2%      /* Red - rejected, error, critical */
--info: 221 83% 53%         /* Blue - info, in-progress */
```

### Role-Based Accent Colors
```css
--role-director: 142 76% 36%        /* Green */
--role-sales: 221 83% 53%           /* Blue */
--role-survey: 262 83% 58%          /* Purple */
--role-warehouse: 38 92% 50%        /* Amber */
--role-technician: 14 86% 55%       /* Orange */
--role-finance: 346 87% 48%         /* Rose */
--role-support: 199 89% 48%         /* Sky */
--role-customer: 142 76% 36%        /* Green */
```

---

## Typography

### Font Families
```css
--font-sans: 'Inter', system-ui, -apple-system, sans-serif
--font-mono: 'JetBrains Mono', 'Fira Code', monospace
--font-display: 'Inter', system-ui, sans-serif
```

### Type Scale
| Token | Size | Line Height | Weight | Use Case |
|-------|------|-------------|--------|----------|
| display-xl | 4.5rem (72px) | 1.1 | 700 | Hero headlines |
| display-lg | 3.75rem (60px) | 1.1 | 700 | Page titles |
| display-md | 3rem (48px) | 1.2 | 700 | Section headers |
| display-sm | 2.25rem (36px) | 1.2 | 600 | Card titles |
| heading-xl | 1.875rem (30px) | 1.3 | 600 | H1 |
| heading-lg | 1.5rem (24px) | 1.4 | 600 | H2 |
| heading-md | 1.25rem (20px) | 1.4 | 600 | H3 |
| heading-sm | 1.125rem (18px) | 1.5 | 600 | H4 |
| body-lg | 1.125rem (18px) | 1.6 | 400 | Lead text |
| body-md | 1rem (16px) | 1.6 | 400 | Body text |
| body-sm | 0.875rem (14px) | 1.5 | 400 | Secondary text |
| body-xs | 0.75rem (12px) | 1.5 | 400 | Captions |
| label-lg | 1rem (16px) | 1.5 | 500 | Form labels |
| label-md | 0.875rem (14px) | 1.5 | 500 | Input labels |
| label-sm | 0.75rem (12px) | 1.5 | 500 | Small labels |
| code-sm | 0.875rem (14px) | 1.6 | 400 | Inline code |
| code-md | 0.875rem (14px) | 1.6 | 400 | Code blocks |

---

## Spacing System

### Base Unit: 4px (0.25rem)
```css
--space-0: 0
--space-1: 0.25rem  /* 4px */
--space-2: 0.5rem   /* 8px */
--space-3: 0.75rem  /* 12px */
--space-4: 1rem     /* 16px */
--space-5: 1.25rem  /* 20px */
--space-6: 1.5rem   /* 24px */
--space-8: 2rem     /* 32px */
--space-10: 2.5rem  /* 40px */
--space-12: 3rem    /* 48px */
--space-16: 4rem    /* 64px */
--space-20: 5rem    /* 80px */
--space-24: 6rem    /* 96px */
```

### Component Spacing
```css
--spacing-xs: var(--space-1)    /* 4px */
--spacing-sm: var(--space-2)    /* 8px */
--spacing-md: var(--space-4)    /* 16px */
--spacing-lg: var(--space-6)    /* 24px */
--spacing-xl: var(--space-8)    /* 32px */
--spacing-2xl: var(--space-12)  /* 48px */
```

---

## Border Radius
```css
--radius-none: 0
--radius-sm: 0.25rem   /* 4px */
--radius-md: 0.375rem  /* 6px */
--radius-lg: 0.5rem    /* 8px */
--radius-xl: 0.75rem   /* 12px */
--radius-2xl: 1rem     /* 16px */
--radius-full: 9999px
```

---

## Shadows
```css
--shadow-xs: 0 1px 2px 0 rgb(0 0 0 / 0.05)
--shadow-sm: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)
--shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25)
--shadow-inner: inset 0 2px 4px 0 rgb(0 0 0 / 0.05)
```

---

## Breakpoints
```css
--breakpoint-sm: 640px   /* Mobile landscape */
--breakpoint-md: 768px   /* Tablet */
--breakpoint-lg: 1024px  /* Desktop */
--breakpoint-xl: 1280px  /* Large desktop */
--breakpoint-2xl: 1536px /* Extra large */
```

### Container Max Widths
```css
--container-sm: 640px
--container-md: 768px
--container-lg: 1024px
--container-xl: 1280px
--container-2xl: 1400px  /* App default */
```

---

## Z-Index Scale
```css
--z-dropdown: 100
--z-sticky: 200
--z-fixed: 300
--z-modal-backdrop: 400
--z-modal: 500
--z-popover: 600
--z-tooltip: 700
--z-toast: 800
```

---

## Transitions
```css
--transition-fast: 150ms ease
--transition-normal: 200ms ease
--transition-slow: 300ms ease
--transition-slower: 500ms ease
```

---

## Component Tokens

### Button
```css
--btn-height-sm: 32px
--btn-height-md: 40px
--btn-height-lg: 48px
--btn-height-xl: 56px
--btn-padding-x-sm: 12px
--btn-padding-x-md: 16px
--btn-padding-x-lg: 24px
--btn-padding-x-xl: 32px
--btn-font-size: var(--label-md)
--btn-font-weight: 500
--btn-border-radius: var(--radius-md)
```

### Input
```css
--input-height-sm: 36px
--input-height-md: 44px
--input-height-lg: 52px
--input-padding-x: 12px
--input-font-size: var(--body-md)
--input-border-width: 1px
--input-border-radius: var(--radius-md)
--input-focus-ring: 2px
--input-focus-ring-color: var(--primary)
```

### Card
```css
--card-padding: var(--space-6)
--card-border-radius: var(--radius-xl)
--card-border-width: 1px
--card-shadow: var(--shadow-sm)
```

### Table
```css
--table-cell-padding-y: 12px
--table-cell-padding-x: 16px
--table-header-bg: var(--muted)
--table-row-hover-bg: var(--accent)
--table-border-color: var(--border)
```

---

## Iconography
- **Library:** Lucide React (consistent, clean, 24x24 base)
- **Sizes:** 16px (xs), 20px (sm), 24px (md), 32px (lg), 48px (xl)
- **Stroke Width:** 2px (default), 1.5px (small)

---

## Motion & Animation

### Easing
```css
--ease-in: cubic-bezier(0.4, 0, 1, 1)
--ease-out: cubic-bezier(0, 0, 0.2, 1)
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1)
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1)
```

### Keyframe Animations
- `fade-in`: 200ms ease-out
- `fade-out`: 150ms ease-in
- `slide-up`: 300ms ease-out
- `slide-down`: 300ms ease-out
- `scale-in`: 200ms ease-out
- `accordion-down`: 200ms ease-out
- `accordion-up`: 200ms ease-in
- `spin`: 1s linear infinite

---

## Accessibility

### Focus Styles
```css
--focus-ring: 2px solid var(--ring)
--focus-ring-offset: 2px
--focus-ring-offset-color: var(--background)
```

### Minimum Touch Targets
- **Mobile:** 48x48px
- **Desktop:** 40x40px

### Color Contrast (WCAG AA)
- Text on background: 4.5:1 minimum
- Large text (18px+): 3:1 minimum
- UI components: 3:1 minimum

---

## Stitch Screen Inventory (To Be Populated via MCP)

| Screen ID | Name | Route | Status |
|-----------|------|-------|--------|
| - | Dashboard | /app/dashboard | Designed |
| - | CRM Leads | /app/crm/leads | Designed |
| - | Customers | /app/customers | Designed |
| - | Surveys | /app/surveys | Designed |
| - | Configurator | /app/configurator | Designed |
| - | Products | /app/products | Designed |
| - | BOM | /app/bom | Designed |
| - | Quotations | /app/quotations | Designed |
| - | Orders | /app/orders | Designed |
| - | Inventory | /app/inventory | Designed |
| - | Installations | /app/installations | Designed |
| - | Technicians | /app/technicians | Designed |
| - | Warranties | /app/warranties | Designed |
| - | Service | /app/service | Designed |
| - | Analytics | /app/analytics | Designed |
| - | Technician Dashboard | /technician/dashboard | Designed |
| - | Technician Jobs | /technician/jobs | Designed |
| - | Customer Portal | /portal/dashboard | Designed |

---

## Implementation Notes

1. **All tokens defined as CSS variables** in `src/styles/globals.css` for runtime theming
2. **Tailwind config extends** these tokens via `theme.extend` in `tailwind.config.ts`
3. **Component library** uses these tokens via `clsx` + `tailwind-merge` utilities
4. **Dark mode** supported via class strategy on `<html>` element
5. **Responsive** via mobile-first breakpoints matching Stitch designs

---

## Next Steps (Awaiting Stitch MCP)

- [ ] Connect to Stitch MCP for project 11813858513178811754
- [ ] Extract actual screen designs, layouts, components
- [ ] Update tokens to match exact Stitch specifications
- [ ] Generate component code from Stitch exports
- [ ] Create SCREEN_INVENTORY.md with actual screen IDs
- [ ] Create ROUTE_MAPPING.md with exact Stitch-to-route mappings
- [ ] Create COMPONENT_INVENTORY.md with Stitch component library