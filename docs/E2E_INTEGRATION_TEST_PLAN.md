# Phase 14: End-to-End Integration Test Plan

## Overview
Verify all 6 mandatory competition scenarios work end-to-end through the application interface with all 7 connected business modules.

---

## Test Environment Setup

### Prerequisites
- Supabase project configured with migrations 001-004
- `.env` file with valid Supabase credentials
- `npm run dev` running on localhost:5173

### Demo Data (from migration 004_seed_data.sql)
- Organization: SunPower Solutions
- 4 demo leads (various statuses)
- 3 surveys (1 approved, 1 pending, 1 approved)
- 2 quotations (1 approved_ready, 1 accepted)
- 2 orders (1 staging_warehouse, 1 commissioned)
- 6 serial assets
- 2 installations (1 assigned, 1 commissioned)
- 2 warranties
- 1 service ticket
- 2 subsidies
- 2 technician payments

---

## Scenario 1: The Rooftop Inquiry (Complete Flow)

### Steps
1. **Public Website** → `/request-survey`
   - Fill enquiry form: Name, phone, email, address, 3kW, On-Grid, ₹4500 bill, 650 sq ft roof
   - Submit → Lead auto-created in CRM

2. **Admin App** → `/app/crm/leads`
   - Verify lead appears with status "new"
   - Assign to sales executive
   - Schedule site survey → assigns technician

3. **Technician Portal** → `/technician/jobs`
   - Technician sees assigned survey
   - Fill measurements: roof direction (South), tilt (14°), cable distance (28m), roof area (650), shadow-free (480)
   - Upload photos
   - Submit for approval

4. **Admin App** → `/app/surveys`
   - Review survey → Approve
   - Status changes to "approved"

5. **Admin App** → `/app/quotations`
   - Generate quotation for approved survey
   - BOM auto-calculated (6 panels @ 500W = 3kW)
   - Quotation status: "approved_ready" → "sent"

6. **Customer Portal** → `/portal/quotations`
   - Customer views quotation
   - Accepts → Creates sales order

7. **Admin App** → `/app/orders`
   - Order created with payment milestones (30% advance, 50% pre-dispatch, 20% commissioning)
   - Record advance payment

8. **Admin App** → `/app/inventory/dispatch`
   - Reserve stock for order
   - Scan serial numbers for inverter, panels
   - Dispatch → Delivered

9. **Technician Portal** → `/technician/jobs`
   - Installation job appears
   - Complete checklist: mounting, electrical, testing
   - Customer digital signature
   - Generation confirmed (3.12 kW)

10. **Customer Portal** → `/portal/equipment`
    - View installed equipment with serials
    - View active warranties (20yr panel, 2yr inverter)

### Expected Results
- ✅ Lead created from enquiry
- ✅ Survey approved before quotation
- ✅ BOM auto-generated from rules
- ✅ Order created from accepted quotation
- ✅ Stock reserved and serials dispatched
- ✅ Warranty activated on delivery
- ✅ Installation completed with evidence
- ✅ Customer sees equipment & warranties in portal

---

## Scenario 2: Getting the Kit Right (BOM Auto-Generation)

### Steps
1. **Admin App** → `/app/configurator`
   - Select On-Grid, 3kW
   - System auto-calculates:
     - 6 panels (500W each)
     - 1x 3kW inverter
     - 1x mounting kit (3kW)
     - DC/AC cables, connectors, earthing, SPDs, distribution boxes
     - Monitoring system

2. **Admin App** → `/app/bom`
   - View generated BOM with quantities and pricing
   - Verify all components present
   - Export to quotation

### Expected Results
- ✅ Panel count = CEILING(3000/500) = 6
- ✅ Inverter matched to capacity (3kW)
- ✅ Mounting kit matched to capacity (3kW)
- ✅ Cables proportional to kW
- ✅ Connectors = 2 per panel × 6 = 12
- ✅ All safety components included

---

## Scenario 3: Dispatch Day & Serial Numbers

### Steps
1. **Admin App** → `/app/inventory/serials`
   - Register serial numbers: INV-4000-9102, PNL-540W-0081..86
   - Generate QR codes

2. **Admin App** → `/app/inventory/dispatch`
   - Create dispatch for order SO-2026-0038
   - Scan serial numbers via camera
   - Validate each serial belongs to order
   - Mark delivered

3. **Verify**:
   - Serial status → "delivered"
   - Warranty auto-activated (delivery trigger)
   - Customer sees equipment in portal
   - Stock movements recorded

### Expected Results
- ✅ Each serial scanned once
- ✅ Duplicate dispatch prevented
- ✅ Warranty starts at delivery
- ✅ Stock ledger updated
- ✅ Customer notified

---

## Scenario 4: On The Roof (Installation)

### Steps
1. **Technician Portal** → `/technician/jobs`
   - View assigned job JOB-2026-0044
   - Navigate to site

2. **Technician Portal** → `/technician/checklist/:id`
   - Complete mandatory checklist:
     - ✅ Mounting structure torque verified
     - ✅ Isolation resistance > 1 MΩ
     - ✅ Voc/Isc string verified
     - ✅ Earthing < 5Ω
     - ✅ Anti-islanding functional

3. **Technician Portal** → `/technician/completion/:id`
   - Record test readings: Voc=395.4V, Isc=13.2A, Earth=2.4Ω, Gen=3.8kW
   - Upload photos
   - Customer digital signature
   - Generate completion report

### Expected Results
- ✅ All mandatory checks enforced
- ✅ Test readings recorded
- ✅ Photos uploaded
- ✅ Digital signature captured
- ✅ Completion report generated
- ✅ Order status → "commissioned"

---

## Scenario 5: Rainy Season Breakdown (Service)

### Steps
1. **Customer Portal** → `/portal/service`
   - File ticket: Inverter fault F-04 (Grid frequency abnormal)
   - Serial: INV-3300-8491
   - Priority: High

2. **Admin App** → `/app/service`
   - View ticket SRV-TKT-2026-092
   - Warranty check: Active (INV-3300-8491, expires 2027-04-12)
   - Coverage: Zero-cost repair

3. **Technician Portal** → `/technician/jobs`
   - Assigned to Rajesh Kumar
   - Diagnose: AC surge arrester failed
   - Repair under warranty
   - Customer confirms resolution

4. **Verify**:
   - Ticket closed with customer confirmation
   - Repair cost = ₹0 (warranty covered)
   - Warranty claim recorded

### Expected Results
- ✅ Warranty validated via serial
- ✅ Coverage confirmed (active, not expired)
- ✅ Zero customer charge
- ✅ Customer confirmation required for closure

---

## Scenario 6: Director's Month-End (Analytics)

### Steps
1. **Admin App** → `/app/dashboard`
   - View KPIs: Revenue, installations, pipeline, inventory, complaints

2. **Admin App** → `/app/profitability`
   - Project-wise P&L
   - Identify loss-making projects

3. **Admin App** → `/app/analytics`
   - Monthly run-rate
   - Regional density
   - Technician utilization

4. **Admin App** → `/app/finance/*`
   - Outstanding invoices
   - Technician payables
   - Subsidy status

### Expected Results
- ✅ Real-time KPIs from actual data
- ✅ Project profitability (revenue - expenses - tech pay)
- ✅ Daily/weekly/monthly filters
- ✅ Drill-down from KPI to records

---

## Cross-Module Verification

### Customer Identity (Single Source)
| Module | Customer Reference |
|--------|-------------------|
| CRM | customers.id |
| Surveys | surveys.customer_id → customers.id |
| Quotations | quotations.lead_id → leads.customer_id |
| Orders | sales_orders.customer_id |
| Inventory | serial_units.customer_id |
| Installations | installations.customer_id |
| Warranties | warranties.customer_id |
| Service | service_tickets.customer_id |
| Finance | invoices.customer_id |

### Serial Number Traceability
| Stage | Table | Key Fields |
|-------|-------|------------|
| Stock | serial_units | status='available' |
| Dispatch | dispatch_items | serial_unit_id, scanned_at |
| Delivery | serial_units | status='delivered', customer_id |
| Warranty | warranties | serial_unit_id, started_at |
| Installation | installation_evidence | serial visible in photos |
| Service | service_tickets | serial_unit_id |

---

## Test Execution Checklist

### Pre-Test
- [ ] Supabase connected and migrations applied
- [ ] Seed data loaded (migration 004)
- [ ] Dev server running
- [ ] Test accounts created for each role

### Scenario Tests
- [ ] Scenario 1: Complete Rooftop Inquiry flow
- [ ] Scenario 2: BOM auto-generation verified
- [ ] Scenario 3: Serial dispatch & warranty activation
- [ ] Scenario 4: Installation checklist & completion
- [ ] Scenario 5: Service ticket with warranty
- [ ] Scenario 6: Director dashboard KPIs

### Cross-Module Tests
- [ ] Customer deduplication (same phone → same customer)
- [ ] Quotation blocked without survey approval
- [ ] Duplicate serial dispatch prevented
- [ ] Warranty auto-activated on delivery
- [ ] Ticket closure requires customer confirmation
- [ ] Stock reservation prevents overselling

### Role-Based Access Tests
- [ ] Director: Full access
- [ ] Sales: Leads, quotations, customers
- [ ] Survey Tech: Surveys only
- [ ] Warehouse: Inventory, dispatch
- [ ] Install Tech: Jobs, checklists
- [ ] Finance: Invoices, payments, expenses
- [ ] Support: Tickets, warranties
- [ ] Customer: Portal only

### Data Integrity
- [ ] No orphaned records
- [ ] All UUIDs valid
- [ ] Decimal precision for money
- [ ] Audit logs populated
- [ ] RLS policies enforced

---

## Success Criteria

**All 6 scenarios execute without manual database intervention.**
**All 7 modules show connected data for the same customer/project.**
**Business rules enforced at database level (RLS, triggers, constraints).**
**Real-time KPIs calculated from actual transactional data.**
**No duplicate customers, orders, serials, or warranties created.**

---

## Sign-Off

| Test | Status | Notes |
|------|--------|-------|
| Scenario 1 | ⬜ | |
| Scenario 2 | ⬜ | |
| Scenario 3 | ⬜ | |
| Scenario 4 | ⬜ | |
| Scenario 5 | ⬜ | |
| Scenario 6 | ⬜ | |
| Cross-Module | ⬜ | |
| RBAC | ⬜ | |
| Data Integrity | ⬜ | |

**Tester:** _______________ **Date:** _______________ **Result:** PASS / FAIL