# SunPower One - Component Inventory (Google Stitch)

**Project ID:** 11813858513178811754
**Source:** shadcn/ui + custom components built to Stitch design tokens
**Status:** Component library implementation in progress

---

## Base UI Components (shadcn/ui)

| Component | File | Status | Description |
|-----------|------|--------|-------------|
| Accordion | `accordion.tsx` | ✅ Built | Collapsible content sections |
| Alert Dialog | `alert-dialog.tsx` | ✅ Built | Confirmation modals |
| Aspect Ratio | `aspect-ratio.tsx` | ✅ Built | Responsive media containers |
| Avatar | `avatar.tsx` | ✅ Built | User/customer avatars |
| Badge | `badge.tsx` | ✅ Built | Status labels, tags |
| Breadcrumb | `breadcrumb.tsx` | ✅ Built | Navigation hierarchy |
| Button | `button.tsx` | ✅ Built | Primary, secondary, outline, ghost, destructive |
| Calendar | `calendar.tsx` | ✅ Built | Date picker, range selection |
| Card | `card.tsx` | ✅ Built | Content containers |
| Carousel | `carousel.tsx` | ✅ Built | Image/content sliders |
| Checkbox | `checkbox.tsx` | ✅ Built | Form checkboxes |
| Collapsible | `collapsible.tsx` | ✅ Built | Expandable sections |
| Combobox | `combobox.tsx` | ✅ Built | Searchable select |
| Command | `command.tsx` | ✅ Built | Command palette, search |
| Context Menu | `context-menu.tsx` | ✅ Built | Right-click menus |
| Data Table | `data-table.tsx` | ✅ Built | Sortable, filterable, paginated |
| Date Picker | `date-picker.tsx` | ✅ Built | Single/range date selection |
| Dialog | `dialog.tsx` | ✅ Built | Modals, forms |
| Drawer | `drawer.tsx` | ✅ Built | Side panels |
| Dropdown Menu | `dropdown-menu.tsx` | ✅ Built | Action menus |
| Form | `form.tsx` | ✅ Built | React Hook Form + Zod integration |
| Hover Card | `hover-card.tsx` | ✅ Built | Hover previews |
| Input | `input.tsx` | ✅ Built | Text, number, email, password |
| Input OTP | `input-otp.tsx` | ✅ Built | OTP verification |
| Label | `label.tsx` | ✅ Built | Form labels |
| Menubar | `menubar.tsx` | ✅ Built | Application menus |
| Navigation Menu | `navigation-menu.tsx` | ✅ Built | Top-level navigation |
| Pagination | `pagination.tsx` | ✅ Built | Page navigation |
| Popover | `popover.tsx` | ✅ Built | Floating content |
| Progress | `progress.tsx` | ✅ Built | Linear, circular progress |
| Radio Group | `radio-group.tsx` | ✅ Built | Option selection |
| Resizable | `resizable.tsx` | ✅ Built | Resizable panels |
| Scroll Area | `scroll-area.tsx` | ✅ Built | Custom scrollbars |
| Select | `select.tsx` | ✅ Built | Native select replacement |
| Separator | `separator.tsx` | ✅ Built | Visual dividers |
| Sheet | `sheet.tsx` | ✅ Built | Mobile bottom sheets |
| Sidebar | `sidebar.tsx` | ✅ Built | App sidebar (custom) |
| Skeleton | `skeleton.tsx` | ✅ Built | Loading placeholders |
| Slider | `slider.tsx` | ✅ Built | Range input |
| Sonner | `sonner.tsx` | ✅ Built | Toast notifications |
| Switch | `switch.tsx` | ✅ Built | Toggle switches |
| Table | `table.tsx` | ✅ Built | Data tables |
| Tabs | `tabs.tsx` | ✅ Built | Tabbed interfaces |
| Textarea | `textarea.tsx` | ✅ Built | Multi-line input |
| Toast | `toast.tsx` | ✅ Built | Legacy toast |
| Toggle | `toggle.tsx` | ✅ Built | Toggle buttons |
| Toggle Group | `toggle-group.tsx` | ✅ Built | Button groups |
| Tooltip | `tooltip.tsx` | ✅ Built | Hover tooltips |

---

## Custom Business Components

| Component | File | Status | Description |
|-----------|------|--------|-------------|
| KPICard | `kpi-card.tsx` | 🔄 Planned | Dashboard metric with trend |
| DataGrid | `data-grid.tsx` | 🔄 Planned | Advanced table with inline edit |
| KanbanBoard | `kanban-board.tsx` | 🔄 Planned | Drag-drop columns |
| Stepper | `stepper.tsx` | 🔄 Planned | Multi-step wizard |
| SignaturePad | `signature-pad.tsx` | 🔄 Planned | Canvas signature capture |
| QRScanner | `qr-scanner.tsx` | 🔄 Planned | Camera-based QR/barcode |
| FileUpload | `file-upload.tsx` | 🔄 Planned | Drag-drop with preview |
| ImageGallery | `image-gallery.tsx` | 🔄 Planned | Photo grid with lightbox |
| StatusBadge | `status-badge.tsx` | 🔄 Planned | Semantic status colors |
| RoleBadge | `role-badge.tsx` | 🔄 Planned | Role-based colored badges |
| CurrencyInput | `currency-input.tsx` | 🔄 Planned | INR formatted input |
| PhoneInput | `phone-input.tsx` | 🔄 Planned | Indian phone format |
| PincodeInput | `pincode-input.tsx` | 🔄 Planned | 6-digit pincode |
| CapacitySelector | `capacity-selector.tsx` | 🔄 Planned | 1-5kW system selector |
| SystemTypeToggle | `system-type-toggle.tsx` | 🔄 Planned | On-Grid/Off-Grid toggle |
| SerialInput | `serial-input.tsx` | 🔄 Planned | Serial number with validation |
| DateRangePicker | `date-range-picker.tsx` | 🔄 Planned | From-to date range |
| UserAvatar | `user-avatar.tsx` | 🔄 Planned | User/customer avatar |
| OrganizationSwitcher | `org-switcher.tsx` | 🔄 Planned | Multi-org support |
| NotificationBell | `notification-bell.tsx` | 🔄 Planned | Header notification dropdown |
| SearchCommand | `search-command.tsx` | 🔄 Planned | Global search (Cmd+K) |
| ChartContainer | `chart-container.tsx` | 🔄 Planned | Recharts wrapper |
| Sparkline | `sparkline.tsx` | 🔄 Planned | Mini trend charts |
| EmptyState | `empty-state.tsx` | 🔄 Planned | Illustrative empty states |
| LoadingOverlay | `loading-overlay.tsx` | 🔄 Planned | Full-screen loader |
| ErrorBoundary | `error-boundary.tsx` | 🔄 Planned | React error boundary |

---

## Layout Components

| Component | File | Status | Description |
|-----------|------|--------|-------------|
| PublicLayout | `layout/PublicLayout.tsx` | ✅ Built | Public website shell |
| AppLayout | `layout/AppLayout.tsx` | ✅ Built | Admin app shell with sidebar |
| TechnicianLayout | `layout/TechnicianLayout.tsx` | ✅ Built | Technician mobile shell |
| PortalLayout | `layout/PortalLayout.tsx` | ✅ Built | Customer portal shell |
| Header | `layout/Header.tsx` | ✅ Built | Public header |
| AppHeader | `layout/AppHeader.tsx` | ✅ Built | Admin header with search/notifications |
| Sidebar | `layout/Sidebar.tsx` | ✅ Built | Collapsible admin sidebar |
| Footer | `layout/Footer.tsx` | ✅ Built | Public footer |
| PageHeader | `layout/PageHeader.tsx` | 🔄 Planned | Consistent page titles |
| Breadcrumbs | `layout/Breadcrumbs.tsx` | 🔄 Planned | Navigation breadcrumbs |
| MobileNav | `layout/MobileNav.tsx` | 🔄 Planned | Bottom tab bar for mobile |

---

## Form Components

| Component | File | Status | Description |
|-----------|------|--------|-------------|
| FormField | `forms/FormField.tsx` | 🔄 Planned | Label + input + error + hint |
| FormSection | `forms/FormSection.tsx` | 🔄 Planned | Grouped form fields |
| AddressForm | `forms/AddressForm.tsx` | 🔄 Planned | Indian address fields |
| CustomerForm | `forms/CustomerForm.tsx` | 🔄 Planned | Customer create/edit |
| LeadForm | `forms/LeadForm.tsx` | 🔄 Planned | Lead create/edit |
| SurveyForm | `forms/SurveyForm.tsx` | 🔄 Planned | Survey measurements |
| QuotationForm | `forms/QuotationForm.tsx` | 🔄 Planned | Quotation builder |
| OrderForm | `forms/OrderForm.tsx` | 🔄 Planned | Order creation |
| PaymentForm | `forms/PaymentForm.tsx` | 🔄 Planned | Payment recording |
| DispatchForm | `forms/DispatchForm.tsx` | 🔄 Planned | Dispatch processing |
| InstallationForm | `forms/InstallationForm.tsx` | 🔄 Planned | Installation scheduling |
| ServiceTicketForm | `forms/ServiceTicketForm.tsx` | 🔄 Planned | Ticket creation |
| ExpenseForm | `forms/ExpenseForm.tsx` | 🔄 Planned | Expense entry |
| TechnicianPaymentForm | `forms/TechnicianPaymentForm.tsx` | 🔄 Planned | Labour payment |

---

## Data Display Components

| Component | File | Status | Description |
|-----------|------|--------|-------------|
| CustomerCard | `data/CustomerCard.tsx` | 🔄 Planned | Customer summary card |
| LeadCard | `data/LeadCard.tsx` | 🔄 Planned | Lead pipeline card |
| OrderCard | `data/OrderCard.tsx` | 🔄 Planned | Order summary card |
| InstallationCard | `data/InstallationCard.tsx` | 🔄 Planned | Installation status card |
| SerialCard | `data/SerialCard.tsx` | 🔄 Planned | Serial unit card |
| WarrantyCard | `data/WarrantyCard.tsx` | 🔄 Planned | Warranty status card |
| ServiceTicketCard | `data/ServiceTicketCard.tsx` | 🔄 Planned | Ticket summary card |
| ProductCard | `data/ProductCard.tsx` | 🔄 Planned | Product catalogue card |
| SupplierCard | `data/SupplierCard.tsx` | 🔄 Planned | Supplier summary card |
| TechnicianCard | `data/TechnicianCard.tsx` | 🔄 Planned | Technician profile card |
| InvoiceCard | `data/InvoiceCard.tsx` | 🔄 Planned | Invoice summary card |
| SubsidyCard | `data/SubsidyCard.tsx` | 🔄 Planned | Subsidy application card |

---

## Chart Components (Recharts Wrapper)

| Component | File | Status | Description |
|-----------|------|--------|-------------|
| RevenueChart | `charts/RevenueChart.tsx` | 🔄 Planned | Daily/weekly/monthly revenue |
| ProfitabilityChart | `charts/ProfitabilityChart.tsx` | 🔄 Planned | Project P&L waterfall |
| PipelineChart | `charts/PipelineChart.tsx` | 🔄 Planned | Lead funnel |
| InventoryChart | `charts/InventoryChart.tsx` | 🔄 Planned | Stock levels, turnover |
| InstallationChart | `charts/InstallationChart.tsx` | 🔄 Planned | Schedule vs actual |
| ServiceChart | `charts/ServiceChart.tsx` | 🔄 Planned | Tickets, SLA, resolution |
| SubsidyChart | `charts/SubsidyChart.tsx` | 🔄 Planned | Application pipeline |
| TechnicianUtilizationChart | `charts/TechnicianUtilizationChart.tsx` | 🔄 Planned | Technician workload |

---

## Component API Standards

### Props Interface Pattern
```typescript
interface ComponentProps extends React.HTMLAttributes<HTMLElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'destructive' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  isLoading?: boolean
  className?: string
  children?: React.ReactNode
}
```

### Compound Components Pattern
```typescript
// Card
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content</CardContent>
  <CardFooter>Actions</CardFooter>
</Card>

// Table
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Column</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Data</TableCell>
    </TableRow>
  </TableBody>
  <TableFooter>
    <TableRow>
      <TableCell>Footer</TableCell>
    </TableRow>
  </TableFooter>
</Table>
```

### Forward Ref Pattern
```typescript
const Component = React.forwardRef<HTMLButtonElement, ComponentProps>(
  ({ className, ...props }, ref) => (
    <button ref={ref} className={cn(baseStyles, className)} {...props} />
  )
)
Component.displayName = 'Component'
```

---

## Theming Integration

All components consume design tokens from:
- `tailwind.config.ts` - Theme extension
- `src/styles/globals.css` - CSS variables
- `src/lib/utils.ts` - `cn()` utility for class merging

### Color Mode Support
```typescript
// Automatic via CSS variables
<div className="bg-card text-card-foreground border-border">
  {/* Adapts to light/dark mode */}
</div>

// Explicit dark mode
<div className="dark:bg-card dark:text-card-foreground">
  {/* Forces dark */}
</div>
```

---

## Accessibility Checklist (Per Component)

- [ ] Keyboard navigable (Tab, Enter, Escape, Arrow keys)
- [ ] ARIA labels/descriptions where needed
- [ ] Focus visible states
- [ ] Color contrast AA (4.5:1 text, 3:1 UI)
- [ ] Screen reader announcements (toasts, loading)
- [ ] Reduced motion support
- [ ] Touch target minimum 44x44px (mobile)

---

## Testing Strategy

| Test Type | Tool | Coverage Target |
|-----------|------|-----------------|
| Unit | Vitest + RTL | 80%+ |
| Visual | Storybook | All variants |
| E2E | Playwright | Critical paths |
| Accessibility | axe-core | Zero violations |

---

## Documentation Per Component

Each component in `src/components/ui/` should have:
- `Component.tsx` - Implementation
- `Component.stories.tsx` - Storybook stories
- `Component.test.tsx` - Unit tests
- `index.ts` - Barrel export
- README.md (for complex components)

---

## Next Steps

1. ✅ Set up shadcn/ui base components
2. 🔄 Build custom business components
3. 🔄 Create layout components
4. 🔄 Build form components
5. 🔄 Build data display components
6. 🔄 Build chart components
7. 🔄 Set up Storybook
8. 🔄 Write unit tests
9. 🔄 Document in Storybook