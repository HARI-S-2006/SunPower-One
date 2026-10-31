# SunPower One - Responsive Layout Rules
**Project ID:** `11813858513178811754`  
**UI/UX Authority:** Google Stitch

This document defines the responsive grid, breakpoint behaviors, and layout adaptations for desktop, tablet, and mobile field use.

---

## 1. Grid & Breakpoint Specifications

| Viewport Category | Breakpoint | Grid Columns | Gutter | Outer Margin | Target Devices & Scenarios |
|---|---|---|---|---|---|
| **Desktop / Command Center** | `≥ 1280px` (`lg` / `xl`) | 12 Columns | 2.0rem (32px) | 3.0rem (48px) | Executive dashboards, dispatch desks, quotation matrix. Max width: 1600px centered. |
| **Tablet / Field Tablet** | `768px – 1279px` (`md`) | 8 Columns | 1.5rem (24px) | 2.0rem (32px) | Site survey inspectors, iPad / Galaxy Tab, warehouse managers. Navigation collapses to off-canvas rail. |
| **Mobile / Technician Phone** | `< 768px` (`sm`) | 4 Columns (Fluid 1-col card stack) | 1.0rem (16px) | 1.0rem (16px) | Field technicians on rooftops, serial barcode scanning, customer digital signature collection. |

---

## 2. Component Adaptations by Breakpoint

### 2.1 Navigation Shell
- **Desktop (≥ 1280px):** Fixed persistent Espresso sidebar (`260px` expanded, `68px` collapsed). Main content area receives `pl-64` or `pl-[260px]`.
- **Tablet (768px – 1279px):** Sidebar defaults to collapsed icon rail (`68px`), expandable on hover or hamburger toggle.
- **Mobile (< 768px):** Off-canvas full-screen drawer with backdrop blur. Bottom navigation bar or top hamburger menu for quick access to Technician Jobs, Scanner, and Checklist.

### 2.2 Enterprise Data Tables
- **Desktop:** Multi-column tabular view with sortable columns, inline status badges, right-aligned monetary values, and action menus.
- **Tablet:** Horizontally scrollable container with sticky left identifier column and sticky right action column.
- **Mobile:** Tables morph into structured vertical summary cards with key metric badges, expandable accordion details, and prominent tap targets (minimum 44px height).

### 2.3 Solar Configurator & Sizing Matrix
- **Desktop:** Side-by-side split layout: System capacity & component picker (7 columns) + Live Bill of Materials (BOM) summary & payment schedule (5 columns).
- **Tablet & Mobile:** Stacked vertical flow with sticky bottom action drawer displaying total amount and "Generate Quotation" button.

### 2.4 Rooftop Survey & Technician Checklists
- **Desktop:** Full rooftop feasibility overview with high-resolution photo gallery and side-by-side engineering notes.
- **Mobile (Rooftop Mode):** Touch-friendly single-step wizard with oversized radio buttons, camera quick-capture buttons, high-contrast sunlight-legible text, and offline state indicators.

### 2.5 Digital Customer Signature Pad
- High-resolution HTML5 canvas with touch and stylus support.
- Full-width mobile modal with clear "Clear", "Review", and "Confirm Signature" actions.
