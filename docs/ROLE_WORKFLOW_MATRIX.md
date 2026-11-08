# SunPower One — Role-Based Access Control & Operational Workflow Matrix

> **System Truth Artifact**  
> **Classification:** Security Specification & RBAC Architecture  
> **Release Candidate:** SunPower One ERP v1.0.0  
> **Audited Standards:** ISO 27001 • SOC-2 Type II Principles • Zero-Trust Data Isolation

---

## 1. Overview & Identity Model

SunPower One operates on an enterprise **Zero-Trust Role-Based Access Control (RBAC)** architecture. Every user belongs to a strictly defined identity category with assigned operational permissions, workspace boundaries, and data mutability controls.

### 9 Canonical System Personas

| Persona ID | Identity Name | Assigned Role | Security Profile | Authorized Entry Route | Associated Workspace |
|---|---|---|---|---|---|
| `usr-01` | **Marcus Vance** | `director` | `admin` | `/app/dashboard` | Executive Operations Command Center |
| `usr-02` | **Elena Rostova** | `sales` | `employee` | `/app/crm/leads` | Sales Pipeline & Solar Sizing Terminal |
| `usr-03` | **Mateo Kowalski** | `survey` | `employee` | `/app/surveys` | Engineering Feasibility & Photogrammetry |
| `usr-04` | **Vikram Singh** | `warehouse` | `employee` | `/app/inventory` | Inventory & Hardware Serial Registry |
| `usr-05` | **David O'Connor** | `coordinator` | `employee` | `/app/installations` | Installation Projects & Field Scheduling |
| `usr-06` | **Priya Patel** | `finance` | `employee` | `/app/invoices` | Billing, Escrow Receipts & P&L Analysis |
| `usr-07` | **Aisha Khan** | `support` | `employee` | `/app/service` | Customer Service & Zero-Cost RMA Desk |
| `usr-08` | **Field Crew Chief** | `technician` | `technician` | `/technician/dashboard` | Mobile Field Commissioning Portal |
| `usr-09` | **Siddharth Varma** | `customer` | `customer` | `/portal/dashboard` | Customer Self-Service Solar Hub |

---

## 2. Granular Role Permission Matrix

| Operational Capability | Director / Admin | Sales Executive | Survey Engineer | Warehouse Manager | Installation Coordinator | Finance Specialist | Support Officer | Field Technician | Solar Customer |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **Executive SCADA Dashboard** | **Full** | Read (Self) | None | None | Read (Crew) | Read (Fin) | None | None | None |
| **CRM Leads: Capture & Qualify** | **Full** | **Full** | None | None | None | None | None | None | None |
| **Site Survey: Schedule & Upload** | **Full** | Read | **Full** | None | Read | None | None | None | None |
| **Survey Adjudication (Pass/Fail)**| **Full** | None | **Full** | None | None | None | None | None | None |
| **System Sizing & Solar Calculator**| **Full** | **Full** | Read | None | None | None | None | None | Read (Public) |
| **BOM Generation & Margin Check** | **Full** | **Full** | None | Read | Read | Read | None | None | None |
| **Formal Quotations: Author & Issue**| **Full** | **Full** | None | None | None | None | None | None | Read/Accept |
| **Survey Approval Gate Enforcement**| **Full** | Strict Enforce | Enforce | None | None | None | None | None | None |
| **Sales Orders & Escrow Milestone**| **Full** | Read | None | Read | **Full** | Read | None | None | Pay Milestone |
| **Warehouse Stock Management** | **Full** | Read (Avail) | None | **Full** | Read | Read | None | None | None |
| **Serial Numbers: QR Token Issuance**| **Full** | None | None | **Full** | Read | None | Read | Verify Only | View Installed |
| **Order Picking & Dispatch Release**| **Full** | None | None | **Full** | None | None | None | None | None |
| **Field Crew Assignment & Dispatch**| **Full** | None | None | None | **Full** | None | None | View Assigned | View Assigned |
| **10-Point Safety Checklist** | **Full** | None | None | None | Verify | None | None | **Execute** | View Summary |
| **Customer Digital Sign-Off Pad** | **Full** | None | None | None | None | None | None | **Capture** | **Sign** |
| **Warranty Certificate Activation** | **Full** | Read | None | None | **Trigger** | Read | Read | None | Download |
| **RMA Warranty Claims Adjudication**| **Full** | None | None | Read | None | None | **Full** | Execute Visit | Submit |
| **Zero-Cost Warranty Replacement** | **Full** | None | None | Fulfill | None | Verify | **Adjudicate**| Install | None (No Fee) |
| **GST Tax Invoices & Milestone Billing**| **Full**| None | None | None | None | **Full** | None | None | Download Tax Inv|
| **Operational Expenses & Crew Payouts**| **Full**| None | None | None | Verify Hours | **Disburse** | None | View Own Payout| None |
| **PM Surya Ghar Subsidy Tracking** | **Full** | Read | None | None | Track Status | **Claim Sub.** | None | None | View Sub. Credit|
| **Project Profitability & Margins** | **Full** | View Deal Margin| None | None | None | **Full P&L** | None | None | None |
| **System Settings & Role Switching** | **Full** | None | None | None | None | None | None | None | None |

---

## 3. Detailed Workflow Maps per Persona

### 3.1. Executive Director (`admin@sunpower-solutions.com`)
```mermaid
flowchart TD
    Login[Login via Director Tab] --> Dash["/app/dashboard (SCADA Telemetry)"]
    Dash --> Monitor["Global KPIs, Generation Yield, Inverter Status"]
    Dash --> Switcher["1-Click Role Switcher (/app/settings)"]
    Switcher --> Audit["Audit Subordinate Departments"]
    Dash --> Approvals["Approve High-Value Quotations & Payouts"]
```

### 3.2. Sales Executive (`sales@demo.com`)
```mermaid
flowchart TD
    Enquiry[New Rooftop Enquiry] --> CRM["/app/crm/leads (Qualify Lead)"]
    CRM --> RequestSurvey["Schedule Site Survey"]
    RequestSurvey --> WaitApproval["Wait for Survey Approval"]
    WaitApproval -->|Approved| Config["/app/configurator (Size PV System)"]
    Config --> BOM["/app/bom (Calculate Kit & Margins)"]
    BOM --> Quote["/app/quotations (Issue Formal Proposal)"]
    Quote --> Order["Customer Accepts → Order Created"]
```

### 3.3. Site Survey Engineer (`survey@demo.com`)
```mermaid
flowchart TD
    Assigned["New Site Ticket Assigned"] --> Surveys["/app/surveys (Ticket Timeline View)"]
    Surveys --> Inspect["Record Roof Type, RCC Tilt, Azimuth, Shading"]
    Inspect --> Photos["Upload Photogrammetry Drone & Mobile Images"]
    Photos --> Adjudicate["Mark Structural Feasibility: APPROVED / REVISIT / REJECTED"]
    Adjudicate --> Gatekeeper["Unlock Quotation Engine for Sales"]
```

### 3.4. Warehouse Manager (`warehouse@demo.com`)
```mermaid
flowchart TD
    Stock["/app/inventory (Monitor Stock Levels)"] --> Alert{"Low Stock Alert?"}
    Alert -->|Yes| PO["/app/purchase-orders (Issue Replenishment PO)"]
    Alert -->|No| OrderReady["Order Approved for Dispatch"]
    OrderReady --> Serials["/app/inventory/serials (Generate QR Tokens)"]
    Serials --> Dispatch["/app/inventory/dispatch (Scan & Lock Serials)"]
    Dispatch --> Handover["Release Material to Field Logistics"]
```

### 3.5. Installation Coordinator (`coordinator@demo.com`)
```mermaid
flowchart TD
    Order["Confirmed Order with Dispatched Kit"] --> Project["/app/installations (Create Project Milestone)"]
    Project --> Assign["/app/technicians (Assign Certified Field Crew)"]
    Assign --> Calendar["/app/technician-schedule (Set Installation Window)"]
    Calendar --> Progress["Track Real-time Field Progress"]
    Progress --> HandoverCompleted["Commissioning Completed"]
    HandoverCompleted --> Warranty["/app/warranties (Auto-Generate Warranty Certificate)"]
```

### 3.6. Billing & Finance Specialist (`finance@demo.com`)
```mermaid
flowchart TD
    MilestoneTrigger["Project Milestone Reached"] --> Invoice["/app/invoices (Generate GST Tax Invoice)"]
    Invoice --> Payments["/app/payments (Verify Escrow Milestone Receipt)"]
    Payments --> Subsidies["/app/subsidies (Track PM Surya Ghar Portal Claim)"]
    Subsidies --> Expenses["/app/expenses (Reconcile Project Logistics)"]
    Expenses --> Settlements["/app/technician-payments (Disburse Crew Payouts)"]
    Settlements --> Profit["/app/profitability (Record Net Gross Margin)"]
```

### 3.7. Customer Support Officer (`support@demo.com`)
```mermaid
flowchart TD
    CustomerTicket["Customer Reports Fault in Inverter/Panel"] --> Service["/app/service (Support Desk)"]
    Service --> WarrantyLookup["Validate Serial in Warranty Registry"]
    WarrantyLookup --> Eligible{"Within 25-Yr Coverage?"}
    Eligible -->|Yes| ZeroCost["Issue Zero-Cost ₹0 RMA Authorization"]
    Eligible -->|No| PaidService["Quote Paid Service Rate"]
    ZeroCost --> ScheduleTech["Dispatch Field Tech for Replacement"]
    ScheduleTech --> Closure["Customer Signs Digital Resolution Form"]
```

### 3.8. Field Technician (`tech@demo.com`)
```mermaid
flowchart TD
    MobileLogin["Login on Mobile Handheld"] --> TechDash["/technician/dashboard (Today's Assigned Jobs)"]
    TechDash --> JobDossier["/technician/jobs/:id (Customer & Hardware Specs)"]
    JobDossier --> ScanKit["/technician/scan (Verify Physical Serials vs Dispatch)"]
    ScanKit --> Checklist["/technician/checklist/:id (10-Point Megger & Earthing Test)"]
    Checklist --> PhotoProof["Upload Inverter & Array Installation Photos"]
    PhotoProof --> Completion["/technician/completion/:id (Collect Customer Digital Signature)"]
```

### 3.9. Solar Customer (`customer@demo.com`)
```mermaid
flowchart TD
    PortalLogin["Customer Sign In"] --> Dashboard["/portal/dashboard (Live Generation & Savings)"]
    Dashboard --> Quotations["/portal/quotations (Review Sizing & Net Price)"]
    Quotations --> Orders["/portal/orders (View 30/50/20 Escrow Schedule)"]
    Orders --> PayMilestone["Execute Milestone Payment via Secured Gateway"]
    PayMilestone --> TrackInstall["/portal/installations (Monitor Field Progress)"]
    TrackInstall --> Passports["/portal/equipment (View Installed Serials & Passports)"]
    Passports --> Certificate["/portal/warranty (Download 25-Year Warranty)"]
    Certificate --> Help["/portal/service (Request Maintenance / Telemetry Health)"]
```

---

## 4. Security Enforcement & Data Guardrails

1. **Authentication Gatekeeper:** Public unauthenticated visitors cannot access `/app/*`, `/technician/*`, or `/portal/*`. Any direct URL query redirects to `/login`.
2. **Profile Isolation:** Customers cannot navigate to internal ERP routes. Employee profiles cannot access Executive Director settings without verified admin credentials.
3. **Session Integrity:** Local storage sessions persist the verified authentication token, assigned profile, and HSM role token. User menu sign-out instantly flushes session storage and redirects to `/login`.

