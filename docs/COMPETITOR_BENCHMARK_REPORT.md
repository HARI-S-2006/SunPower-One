# SunPower One - Competitor Benchmark & Industry Platform Study

**Author:** Antigravity (Principal Product Designer & Solar ERP Domain Specialist)  
**Date:** 2026-10-31  
**Target Platform:** SunPower One (`https://sunpower-one.netlify.app/`)  
**Design Authority:** Google Stitch Project `11813858513178811754` ("SunPower Solar ERP")  

---

## 1. Executive Summary & Benchmark Scope

To ensure SunPower One competes effectively with established commercial and enterprise solar software, an in-depth comparative benchmark was conducted against four industry benchmark platforms and the Government of India's official rooftop solar framework:

1. **OpenSolar** (Global solar CRM, design, and digital proposals platform)
2. **Aurora Solar** (Engineering-grade irradiance modeling, shading, and sales proposals)
3. **SolarEdge Monitoring Platform** (Inverter-level telemetry, fleet management, and warranty RMA)
4. **Freyr Energy (SunPro)** (Indian rooftop solar specialist, DISCOM net-metering, and customer onboarding)
5. **PM Surya Ghar / National Rooftop Solar Portal** (Official MNRE subsidy structure, technical feasibility approval, and net-metering guidelines)

---

## 2. In-Depth Platform Analysis

### 2.1 Reference 1: OpenSolar (`https://www.opensolar.com/`)
- **Key Strengths:**
  - Fast, interactive customer-facing proposal with embedded digital e-signature and milestone payment triggers.
  - Connected project CRM offering both Kanban board and high-density tabular views.
  - Dynamic Bill of Materials (BOM) linking system hardware sizing directly to distributor pricing.
- **Task Flow & Navigation:**
  - Clear lifecycle stepper: Leads → Design → Proposal → Contract → Installation → Payment.
  - Document repository attaching permit packs, engineering drawings, and structural certificates to each project record.
- **Key Takeaways for SunPower One:**
  - *Adopt:* Interactive proposal preview with clear milestone breakdown (Booking Advance, Pre-Dispatch, Post-Commissioning) and e-signature.
  - *Adopt:* Double-entry inventory linkage where confirmed orders auto-allocate warehouse serials.
  - *Avoid:* Overly complex global distributor catalogs that distract from Indian Tier-1 OEM hardware (Adani, Solis, Growatt, Luminous).

---

### 2.2 Reference 2: Aurora Solar (`https://aurorasolar.com/`)
- **Key Strengths:**
  - Highly accurate lidar-based rooftop 3D modeling and remote shading analysis.
  - Granular utility tariff modeling, time-of-use rate schedules, and payback timeline projections.
  - Proposal tracking: Notifications when a homeowner opens or reviews an engineering proposal.
- **Task Flow & Navigation:**
  - Clean left-hand parametric sidebar with immediate visual updates to generation curves.
- **Key Takeaways for SunPower One:**
  - *Adopt:* Clear transparent assumptions on solar irradiance (4.2 peak sun hours/day average in Southern India), DISCOM net-metering tariff curves, and rooftop shadow-free area ratios.
  - *Avoid:* Requiring high-bandwidth WebGL 3D CAD modeling on technician mobile field devices; keep field surveys light and fast with azimuth, tilt angle, and photo evidence.

---

### 2.3 Reference 3: SolarEdge (`https://www.solaredge.com/`)
- **Key Strengths:**
  - Module-level power optimizer and inverter performance monitoring.
  - Clear visual distinction between live telemetry, synchronized history, and offline sensor status.
  - RMA and warranty claim portal tying equipment serial numbers directly to certified repair technicians and fault code logs (`ERR-F04`, etc.).
- **Task Flow & Navigation:**
  - Dedicated installer portal vs. customer mobile app.
- **Key Takeaways for SunPower One:**
  - *Adopt:* Explicit telemetry freshness indicators (distinguishing real-time sensor streams from simulated demonstration data).
  - *Adopt:* Zero-cost warranty adjudication workflow where active OEM bonds immediately waive customer repair charges.

---

### 2.4 Reference 4: Freyr Energy (`https://freyrenergy.com/`)
- **Key Strengths:**
  - Tailored to the Indian residential and MSME commercial rooftop market.
  - Transparent guidance on state electricity boards (BESCOM, TANGEDCO, MSEDCL) and net-metering timelines.
  - Clear explanation of monthly electricity bill savings and EMI financing options.
- **Task Flow & Navigation:**
  - Highly accessible public enquiry funnel asking for monthly electricity bill and PIN code to derive feasibility.
- **Key Takeaways for SunPower One:**
  - *Adopt:* Localized Indian rupee currency formatting (`₹ Lakhs`, `₹ Crores`), statutory GST tax treatment (12% solar PV equipment / 18% engineering services), and DISCOM documentation trackers.

---

### 2.5 Reference 5: PM Surya Ghar: Muft Bijli Yojana (`https://services.india.gov.in/`)
- **Statutory Subsidy Rules & Limits:**
  - **1 kW System:** Fixed CFA of ₹30,000.
  - **2 kW System:** Fixed CFA of ₹60,000.
  - **3 kW to 5 kW Systems:** Capped at ₹78,000 maximum for residential rooftop consumers.
  - **Commercial & Industrial Customers:** Strictly **₹0 CFA subsidy**; eligible instead for 40% Accelerated Depreciation under Section 32 of the Income Tax Act.
  - **Off-Grid Systems:** Strictly **₹0 central CFA subsidy** (subsidy applies only to grid-connected net-metered installations).
- **Key Takeaways for SunPower One:**
  - *Crucial Domain Fix:* Never apply residential subsidies universally to commercial customers or off-grid battery systems. Explicitly validate consumer category before deducting CFA.

---

## 3. Comprehensive Competitor Comparison Matrix

| Area | SunPower One (Audited) | OpenSolar | Aurora Solar | SolarEdge | Competitive Recommendation for SunPower One |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **CRM & Leads** | Full Kanban & tabular lead ledger with 1-click survey conversion | Table & Kanban with automated email follow-ups | Project pipeline with sales CRM integration | Installer lead pass-through | **Superior local workflow**; add activity timeline and follow-up notes. |
| **Solar Design & Sizing** | Parametric 1–5 kW On/Off-Grid BOM engine with statutory GST | Integrated 2D layout with string sizing | 3D LIDAR modeling & irradiance simulations | Inverter string & optimizer designer | **Accurate for standard 1-5kW systems**; emphasize shadow-free area & tilt. |
| **Solar Calculator** | Parametric 1–5 kW with DISCOM tariff curves & subsidy caps | Financial ROI & cash flow modeling | Granular time-of-use tariff engine | Solar production estimate | **Industry standard**; add explicit residential vs commercial eligibility toggle. |
| **Proposals** | Itemized BOM breakdown, GST split, and customer modal | Interactive web proposals with e-sign | Digital proposal with financing options | PDF equipment spec sheets | **Adopt Aurora/OpenSolar style interactive proposal** with clear milestone terms. |
| **Inventory & Serials** | Serialized tracking, optical scanner, duplicate rejection | Distributor procurement & POs | Not natively included (integrations) | Component serial warranty registry | **Best-in-class warehouse dispatch**; triggers warranty upon delivery. |
| **Field Installation** | 6-screen mobile flow: 5-point safety check, meter readings, digital signature | Mobile app with checklists and file upload | Sales-oriented mobile experience | SetApp for inverter commissioning | **Exemplary mobile field experience**; 44px touch targets and offline resilience. |
| **Monitoring & Telemetry**| SCADA fleet metrics & customer generation cards | Not a monitoring product | Generation simulation only | Real-time optimizer & inverter telemetry | **Clarify simulated demo telemetry** vs live IoT sensor feeds. |
| **Warranty & RMA** | 20-Yr panel / 2-Yr inverter bonds, ₹0 covered RMA adjudication | Basic warranty file attachments | Warranty policy display | Deep component-level RMA replacement | **Strong operational parity with SolarEdge**; gatekeeper prevents premature closure. |
| **Customer Portal** | Self-service generation, orders, warranties, and complaints | Web proposal viewer | Interactive homeowner link | Dedicated mySolarEdge monitoring app | **Clean, accessible client hub**; add monitoring freshness tags. |
| **Financial Analytics**| Profitability margin calculator, invoice ledger, technician payables | Margin & commission reports | Financing & tax equity models | Hardware sales reporting | **Full operational P&L**; transparent gross margin breakdown. |
| **Mobile UX** | 44px field touch targets, adaptive camera scanner, HTML5 canvas | Responsive web app | Responsive proposal viewer | Native iOS/Android apps | **Excellent touch ergonomics**; add camera permissions graceful fallback. |

---

## 4. Key Engineering & Product Recommendations for SunPower One

1. **Netlify SPA Routing Fix:** Deploy `public/_redirects` (`/* /index.html 200`) and `netlify.toml` immediately to eliminate 404 errors on direct deep route entry.
2. **Telemetry Transparency:** Label all fleet counters (74.2 MW DC) and customer outputs (3.84 kW) as *"Demonstration Telemetry (Simulated IoT Dataset)"* to ensure full transparency.
3. **Targeted Subsidy Application:** Enhance `calculateBOM()` with `customerCategory` so commercial users and off-grid packages receive ₹0 PM Surya Ghar subsidy with an informative Accelerated Depreciation note.
4. **Milestone Payment Terminology:** Replace "Escrow" references with "Milestone Payment Schedule" (30% Booking / 50% Pre-Dispatch / 20% Post-Commissioning) and maintain configurable percentages in Settings.
5. **Brand Name Advisory:** Document that the trademark "SunPower One" is shared with a legacy Maxeon/SunPower residential application, recommending legal/brand review before broad commercial deployment.
