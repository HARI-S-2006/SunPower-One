# SUNPOWER ONE - COMPETITION REQUIREMENTS

## 1. PROJECT CONFIGURATION

**APPLICATION NAME:** SunPower One

**BUSINESS COVERED BY THE PROBLEM STATEMENT:** SunPower Solutions

**PRODUCT POSITIONING:** The intelligent operating platform for solar installation businesses.

**EXACT PROJECT DIRECTORY:** C:\Users\shari\Desktop\Hackathons\OODO\SUNPOWER-ONE

**GOOGLE STITCH PROJECT:**
- Project Name: SunPower One
- Project ID: 11813858513178811754
- Project URL: https://stitch.withgoogle.com/projects/11813858513178811754

**UI/UX DESIGN AUTHORITY:** Google Stitch

**PRIMARY AI IMPLEMENTATION AGENT:** OpenCode + NVIDIA Nemotron 3 Ultra 550B A55B High

**SECONDARY COLLABORATION AND QA AGENT:** Antigravity + Gemini 3.8 Flash High

**HUMAN DEVELOPMENT TEAM:** 3 developers

---

## 2. UNDERSTAND THE ACTUAL COMPETITION REQUIREMENTS

### 2.1 THE COMPANY

The fictional company in the challenge is **SunPower Solutions**.

**Business Characteristics:**
- Approximately 40 rooftop solar installations per month
- Approximately 15 field technicians
- Customers include homeowners and small factories
- High-value inventory includes solar panels, inverters and batteries
- The business manages installation and post-installation warranty support
- Solar products are offered from 1 kW to 5 kW
- The company currently uses WhatsApp, phone calls, paper registers and manually maintained business records

The application must support an operating model consistent with this company. These values are baseline business assumptions for architecture and demonstration data, not enforced limits.

### 2.2 PRODUCTS AND SERVICES

The company offers:

**A. Solar Panel Set:**
- Solar panels
- Connectors
- Wires

**B. On-Grid System (1 kW to 5 kW):**
- Solar generation connected to the electricity grid
- Inverter
- Wiring boxes
- Charge controller where required by the configured product design
- Panels
- Safety earthing
- Metal mounting structures

**C. Off-Grid System (1 kW to 5 kW):**
- Components of the configured On-Grid package
- Compatible batteries for energy storage

**D. Installation Service:**
- Technician assignment
- Installation at the customer's premises
- Testing
- Completion documentation

**Product specifications and component configurations must be stored as configurable master data.**
- Do not invent universal electrical specifications
- Do not assume every product is compatible with every system

### 2.3 THE CURRENT BUSINESS PROBLEMS

The application must solve:
1. Lost customer enquiries
2. Incomplete manual quotations
3. Missing or untraceable serial numbers
4. Paper-based installation records
5. Photographs scattered across personal phones
6. Lost warranty information
7. Poor service complaint tracking
8. Unclear installation costs
9. Missing payment records
10. No reliable project-level profitability visibility
11. Untracked government subsidy paperwork
12. Incomplete technician payment visibility

### 2.4 THE COMPLETE BUSINESS LIFECYCLE

The application must manage:
**Customer Enquiry → Site Survey and Approval → Quotation and Order → Payment → Inventory and Dispatch → Installation → Warranty and Service → Finance and Business Analytics**

Every stage must be connected to the same customer and installation project. A customer must not be registered independently in every module.

---

## 3. SIX MANDATORY REAL-LIFE SCENARIOS

These scenarios are the central acceptance criteria for the competition.

### SCENARIO 1: THE ROOFTOP INQUIRY

**Business Situation:** A homeowner requests a 3 kW solar system.

**Website must collect:**
- Customer name
- Phone number
- Email
- Installation address
- Required capacity
- On-Grid or Off-Grid preference
- Monthly electricity bill
- Shadow-free rooftop area when available
- Grid suitability information when available
- Additional requirements

**Required Behaviour:**
1. Submit the enquiry
2. Create the lead automatically
3. Associate or create the customer record without duplication
4. Display the lead in the sales dashboard
5. Assign a sales executive
6. Record contact activities
7. Schedule the site survey
8. Assign a technician
9. Capture roof direction
10. Capture roof tilt
11. Capture cable distance
12. Capture roof area and shadow-free area
13. Upload survey photographs
14. Submit the survey for review
15. Approve or reject the survey

**MANDATORY BUSINESS RULE:**
A final customer quotation must not be issued or confirmed before the required site survey has been approved. Display an appropriate blocked status and explanation if a user attempts to bypass survey approval. The public website may display an indicative estimate clearly labelled as an estimate, but it must not be represented as an approved final quotation.

### SCENARIO 2: GETTING THE KIT RIGHT

**Business Situation:** A customer accepts a quotation for a 3 kW system. The system must automatically prepare the required equipment.

**Required components may include:**
- Solar panels
- Inverter
- Mounting stands
- Switches
- DC and AC wires
- Connectors
- Earthing
- Electrical safety components
- Batteries where required

**Required Functionality:**
1. Predefined quotation templates
2. Configurable component rules
3. Automatic quantity calculations
4. Automatic Bill of Materials generation
5. Component pricing
6. Quotation calculation
7. Customer advance or full payment recording
8. Confirmed order creation
9. Warehouse packing notification
10. Installation job visibility for the technician team

**BOM Definition:**
A Bill of Materials is the complete list of materials required to complete a particular solar installation. The BOM must depend on actual product specifications, capacity and system type.

**Simplified panel quantity example:**
- Required system capacity = 3000 W
- Panel rating = 500 W
- Required panel count = 6

Use configurable rules for other equipment and validate actual product compatibility. Never hardcode the full BOM inside React.

### SCENARIO 3: DISPATCH DAY AND SERIAL NUMBERS

**Business Situation:** The warehouse dispatches approximately ₹1,50,000 worth of solar equipment.

**Equipment can include:**
- Inverters
- Batteries
- Charge controllers
- Solar panels and other tracked assets where required

Every serialized product must be identifiable.

**Required Functionality:**
1. Register unique serial numbers
2. Generate barcode or QR identifiers
3. Scan each required serial before dispatch
4. Validate that the product belongs to the confirmed order
5. Record the serial against the order and customer
6. Verify stock availability
7. Update available stock through the stock movement ledger
8. Record dispatch
9. Record delivery completion
10. Activate the applicable warranty automatically

**Serial-number Rules:**
- Every tracked unit must have a unique identifier
- One serial number cannot be dispatched to two customers
- Dispatched serial numbers must retain their customer and order relationship
- Historical ownership and movement must be preserved
- Serial-number lookup must retrieve equipment, customer, order, delivery and warranty information

**WARRANTY EXAMPLES FROM THE COMPETITION:**
- Inverter: 2 years
- Battery: 2 years
- Solar panel: 20 years

These values are example policies and must be configurable per product.

**DEFAULT WARRANTY TRIGGER:**
The competition description specifies that the warranty clock starts when delivery is completed. Implement completed delivery as the default activation trigger. Where manufacturer terms specify another trigger, permit an authorized configurable policy. Do not silently use installation acceptance as the default if completed delivery is the configured trigger.

### SCENARIO 4: ON THE ROOF

**Business Situation:** Technicians complete the installation at the customer premises. Create a dedicated mobile-friendly technician experience.

**Required Functionality:**
1. Display assigned installation jobs
2. Display customer and address details
3. Display assigned equipment
4. Record installation start time
5. Record installation completion time
6. Confirm actual installed system capacity
7. Upload photographs of the completed installation
8. Record electrical testing details
9. Confirm that the solar system is generating power
10. Record testing status and observations
11. Collect the customer's digital signature
12. Generate a digital installation completion report

Every installation must have a traceable digital record containing timestamps, photographs, testing information and customer acceptance. Mandatory checklist completion must be enforced. Do not allow users to mark an installation complete while mandatory evidence or testing results are missing.

### SCENARIO 5: THE RAINY SEASON BREAKDOWN

**Business Situation:** A customer reports an inverter failure after approximately 18 months. The inverter displays a fault code and the system has stopped generating electricity.

**Required Functionality:**
1. Search for the customer
2. Retrieve the customer's installation details
3. Search the inverter's serial number
4. Retrieve the correct warranty record
5. Check the warranty coverage
6. Create a service ticket
7. Record the fault code
8. Record the complaint description
9. Assign priority
10. Assign a technician
11. Schedule service
12. Record diagnosis
13. Record repair or replacement
14. Record parts and labour
15. Track complaint status
16. Obtain customer resolution confirmation
17. Close the ticket only after the required customer confirmation

**WARRANTY DECISION:**
When the repair or replacement is covered by the applicable warranty terms:
- Customer-covered repair cost = zero
- Customer-covered replacement cost = zero
- Record the claim against the applicable warranty

When the warranty is expired or the failure is excluded by the applicable policy:
- Calculate chargeable components
- Calculate labour
- Generate a service estimate
- Record customer approval
- Track payment or invoice

Do not treat every failure during a warranty period as automatically covered. Validate applicable coverage and exclusions. The complaint must remain unresolved until the customer confirms that the issue is fixed.

### SCENARIO 6: THE DIRECTOR'S MONTH-END

The director must be able to understand the complete state of the business.

**Required Information:**
- Daily revenue
- Weekly revenue
- Monthly revenue
- Actual project profitability
- Loss-making installations
- Available inventory
- Pending installations
- Unfinished jobs
- Open customer complaints
- Outstanding customer payments
- Technician payment obligations
- Stock purchases
- Government subsidy paperwork
- Customer invoices
- Expenses

**Required Financial Records:**
- Customer payments
- Advance payments
- Full payments
- Customer invoices
- Equipment costs
- Labour expenses
- Transportation costs
- Other direct expenses
- Supplier purchases
- Technician payment records

**Illustrative Financial Example:**
- Customer payment: ₹1,50,000
- Equipment cost: ₹90,000
- Technician labour: ₹10,000
- Other expenses: ₹5,000
- Illustrative contribution: ₹45,000

These are demonstration values, not fixed competition figures or actual company data.

**Build a project-wise profitability report. Separate:**
- Quoted amount
- Confirmed order amount
- Invoiced amount
- Revenue recognized
- Payment collected
- Outstanding balance
- Actual expenses
- Technician payable amount

**GOVERNMENT SUBSIDY TRACKING:**
Build a separate subsidy documentation workflow. Track:
- Customer
- Associated installation
- Scheme name
- Eligibility review
- Required documents
- Documents received
- Submission date
- Application reference
- Application status
- Pending documents
- Approval status
- Approved amount when known
- Rejection reasons
- Disbursement status
- Supporting documents

Do not claim to connect to a real government subsidy portal unless an official supported integration and credentials are available.

**TECHNICIAN PAYMENTS:**
Track:
- Technician
- Installation/job
- Agreed labour amount
- Additional approved labour
- Advance paid
- Remaining payable
- Payment date
- Payment reference
- Settlement status

Include technician payment summaries in finance and management reports.

---

## 4. SEVEN REQUIRED CONNECTED BUSINESS MODULES

Present the application to judges around these seven primary modules:

**MODULE 1: CRM** - Customer enquiries, customer profiles, lead ownership, follow-ups and lead conversion.

**MODULE 2: SURVEY MANAGEMENT** - Roof inspection, measurements, photographs, reports, survey scheduling and approval.

**MODULE 3: SALES AND QUOTATION** - Solar packages, configurations, quotations, BOM, order confirmation and payments.

**MODULE 4: INVENTORY** - Stock, procurement, serial-number tracking, QR scanning and warehouse dispatch.

**MODULE 5: INSTALLATION** - Technician scheduling, job assignment, mobile checklists, photographs, testing and digital customer acceptance.

**MODULE 6: WARRANTY AND SERVICE** - Warranty policies, equipment history, claims, repair, replacement and customer complaint tickets.

**MODULE 7: FINANCE AND ANALYTICS** - Customer invoices, payments, technician obligations, supplier expenses, subsidy tracking, revenue and project profitability.

Additional cross-cutting experiences such as authentication, notifications, administration and AI must support these seven connected modules rather than replace them.

---

## 5. MANDATORY BUSINESS RELATIONSHIPS

The application must have one connected customer and project identity.

**Required Relationships:**
Customer → Lead → Survey → Solar Configuration → BOM → Quotation → Sales Order → Payments → Stock Reservation → Dispatch → Serial Numbers → Installation → Warranty → Service Ticket → Repair Records → Financial Records → Profitability

- Do not register the same customer independently in every module
- Do not create duplicated installation records when orders are updated
- Do not create duplicate payment or warranty records when operations are retried
- Every entity must be reachable through meaningful record navigation

---

## 6. LOCAL WORKSPACE RULES

Use only: C:\Users\shari\Desktop\Hackathons\OODO\SUNPOWER-ONE

- Inspect the directory before creating files
- Preserve existing project work
- Do not clone any repository
- Do not require GitHub or remote repository services
- Do not push or pull source code
- Do not delete the project root
- Use PowerShell-compatible commands
- Do not place files outside PROJECT_ROOT

Create and maintain:
- AGENTS.md
- README.md
- .env.example
- docs/
- design/stitch/
- src/
- supabase/
- tests/
- public/

Create a detailed project foundation. Store all technical documentation inside the workspace.

---

## 7. GOOGLE STITCH: EXACT DESIGN AUTHORITY

**Project ID:** 11813858513178811754
**Project URL:** https://stitch.withgoogle.com/projects/11813858513178811754

Stitch is the authoritative source for approved UI/UX.

Use the available authenticated Stitch MCP integration to retrieve:
- Project details
- Available screens
- Screen identifiers
- Layouts
- Screenshots
- Colour tokens
- Typography
- Spacing
- Components
- Navigation
- Responsive rules
- Interactions

Do not invent retrieved screens. If direct access is unavailable, request the Antigravity design export.

Maintain:
- design/stitch/DESIGN_SYSTEM.md
- design/stitch/SCREEN_INVENTORY.md
- design/stitch/ROUTE_MAPPING.md
- design/stitch/COMPONENT_INVENTORY.md
- design/stitch/screenshots/
- design/stitch/exported-code/
- design/stitch/assets/

Implement the actual approved screens faithfully. When a required competition workflow has no screen design, add it using the existing Stitch design language. Clearly document additions that do not have an original Stitch screen. Never modify original Stitch designs without authorization.

---

## 8. TECHNOLOGY ARCHITECTURE

**Frontend:**
- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- React Router
- TanStack Query
- React Hook Form
- Zod
- Recharts
- Lucide React

**Backend:**
- Supabase PostgreSQL
- Supabase Auth
- Supabase Storage
- Supabase Realtime
- PostgreSQL functions
- Supabase Edge Functions

**Testing:**
- Vitest
- React Testing Library
- Playwright
- SQL security tests

Use one business database. Do not introduce a local PostgreSQL server. Do not introduce a separate custom application server. Critical inventory and finance operations must execute through trusted transactional database functions. Use Edge Functions for secrets, external integrations and appropriate server-side operations. Do not expose private credentials in the browser. If Supabase credentials are unavailable, create the integration architecture and clearly report that cloud connection is pending. Do not fabricate a successful connection.

---

## 9. DATABASE AND SECURITY REQUIREMENTS

Design a normalized relational PostgreSQL schema.

### Identity and Organization:
- organizations
- profiles
- organization_members
- role_permissions

### CRM:
- customers
- customer_contacts
- customer_addresses
- leads
- lead_sources
- lead_activities
- follow_ups

### Survey:
- survey_requests
- surveys
- survey_measurements
- survey_photos
- survey_approvals

### Products and BOM:
- product_categories
- products
- product_specifications
- solar_packages
- package_components
- solar_configurations
- bom_templates
- bom_rules
- bom_records
- bom_items
- warranty_policies

### Sales:
- quotations
- quotation_items
- quotation_versions
- sales_orders
- sales_order_items
- payment_milestones
- payments
- payment_allocations

### Inventory:
- suppliers
- purchase_orders
- purchase_order_items
- warehouse_locations
- stock_movements
- stock_reservations
- inventory_adjustments
- serial_units
- dispatches
- dispatch_items

### Installation:
- technicians
- technician_skills
- technician_availability
- installations
- installation_assignments
- installation_checklists
- installation_checklist_items
- installation_evidence
- installation_tests
- customer_acceptances

### Warranty and Service:
- warranties
- warranty_claims
- service_tickets
- service_assignments
- service_updates
- repair_records
- repair_parts
- replacement_records

### Finance and Subsidy:
- invoices
- invoice_items
- expenses
- expense_categories
- vendor_bills
- vendor_bill_items
- technician_payables
- technician_payments
- job_costs
- subsidy_applications
- subsidy_documents
- subsidy_status_history

### Shared:
- notifications
- notification_preferences
- audit_logs
- activity_logs
- application_settings
- document_metadata
- integration_settings

Refine table boundaries where needed, but preserve all required capabilities. Use foreign keys, unique constraints and indexes. Use UUID identifiers. Use NUMERIC/DECIMAL for money. Use database migrations for every structural change. Use RLS on every exposed business table.

### Roles:
- Super Administrator
- Director
- Sales Executive
- Survey Technician
- Warehouse Manager
- Installation Technician
- Finance Executive
- Support Executive
- Customer

Enforce permissions in the database, not only in React.
- Customers must only access their own records
- Technicians must only access assigned work
- Warehouse users must not receive unrestricted financial access
- Sales users must not receive unrestricted accounting access
- Only authorized administrators can assign roles

Test both allowed and denied database actions.

---

## 10. REQUIRED FRONTEND PAGES

### PUBLIC WEBSITE:
- /
- /about
- /solutions
- /solutions/on-grid
- /solutions/off-grid
- /solar-calculator
- /request-survey
- /contact
- /login

### ADMIN APPLICATION:
- /app/dashboard
- /app/crm
- /app/crm/leads
- /app/customers
- /app/surveys
- /app/configurator
- /app/products
- /app/bom
- /app/quotations
- /app/orders
- /app/payments
- /app/inventory
- /app/inventory/stock-ledger
- /app/inventory/serials
- /app/inventory/dispatch
- /app/suppliers
- /app/purchase-orders
- /app/installations
- /app/technicians
- /app/technician-schedule
- /app/warranties
- /app/service
- /app/invoices
- /app/expenses
- /app/technician-payments
- /app/subsidies
- /app/profitability
- /app/analytics
- /app/ai-assistant
- /app/notifications
- /app/settings

### TECHNICIAN:
- /technician/dashboard
- /technician/jobs
- /technician/jobs/:id
- /technician/scan
- /technician/checklist/:id
- /technician/completion/:id

### CUSTOMER:
- /portal/dashboard
- /portal/quotations
- /portal/orders
- /portal/installations
- /portal/equipment
- /portal/warranties
- /portal/service
- /portal/profile

Create corresponding dynamic record details and additional routes as needed. Every page must use actual database data once its backend phase is complete. Every related business record must be navigable.

---

## 11. COMPLETE DATABASE BUSINESS LOGIC

**A. FINAL QUOTATION VALIDATION** - Prevent final quotation issuance before required site-survey approval. Enforce the rule through trusted database operations.

**B. BOM CALCULATION** - Use configurable product data and rules.

**C. ORDER CONVERSION** - Prevent duplicate sales orders when a quotation is accepted repeatedly.

**D. STOCK RESERVATION** - Use transaction-safe operations and concurrency protection.

**E. SERIAL DISPATCH** - Require valid serials for serialized products. Prevent duplicate dispatch.

**F. WARRANTY ACTIVATION** - Use completed delivery as the default trigger. Apply configured product-specific policy and retain the actual trigger event.

**G. SERVICE COVERAGE** - Validate the specific policy and exclusions.
- COVERED REPAIR: No customer charge for covered parts and labour.
- EXPIRED OR EXCLUDED REPAIR: Generate a chargeable estimate.

**H. INSTALLATION COMPLETION** - Require timestamps, equipment mapping, checklist completion, test confirmation, photos and customer acceptance.

**I. CUSTOMER TICKET CLOSURE** - Require customer resolution confirmation.

**J. FINANCE** - Maintain separate revenue, invoices, receipts, direct expenses, outstanding amounts and technician payment obligations.

**K. SUBSIDY WORKFLOW** - Track paperwork and application status. Do not claim government portal submission unless a supported integration exists.

---

## 12. REQUIRED SYSTEM DASHBOARDS

### DIRECTOR DASHBOARD:
- Total enquiries
- Qualified leads
- Approved surveys
- Pending quotations
- Confirmed orders
- Monthly installations
- Unfinished installations
- Revenue
- Payments received
- Outstanding amount
- Project profitability
- Loss-making jobs
- Inventory availability
- Stock purchasing
- Open complaints
- Warranty claims
- Technician payment obligations
- Subsidy applications

### SALES DASHBOARD:
- New enquiries
- Follow-ups
- Lead stages
- Surveys awaiting approval
- Quotations
- Sales conversion
- Expected revenue

### WAREHOUSE DASHBOARD:
- Stock availability
- Reserved stock
- Low stock
- Purchase requirements
- Dispatch queue
- Serial verification

### TECHNICIAN DASHBOARD:
- Assigned jobs
- Today's schedule
- Pending checklist
- In-progress installations
- Completed jobs

### SUPPORT DASHBOARD:
- Open complaints
- High-priority complaints
- Warranty-covered claims
- Chargeable service jobs
- Pending customer confirmations

### CUSTOMER DASHBOARD:
- Quotations
- Orders
- Payments
- Installation progress
- Installed equipment
- Warranties
- Service requests

All KPIs must be calculated from actual records. Use daily, weekly and monthly date filters where appropriate. Clicking a KPI must lead to the associated filtered records.

---

## 13. PHASED ENGINEERING ROADMAP

Implement all phases sequentially. Do not attempt to generate the entire application in one operation.

**PHASE 0: LOCAL WORKSPACE AND PROJECT FOUNDATION**
- Inspect exact directory
- Preserve existing files
- Detect installed runtime
- Create project structure
- Create AGENTS.md
- Create competition requirements document
- Create technical documentation
- Establish code standards
- Record unresolved integrations

**PHASE 1: STITCH DESIGN AND APPLICATION FOUNDATION**
- Retrieve project 11813858513178811754
- Inspect all available screens
- Extract actual design tokens
- Create screen inventory
- Map Stitch screens to routes
- Build design system
- Build reusable components
- Build responsive application shells
- Validate frontend build

**PHASE 2: SUPABASE DATABASE AND AUTHENTICATION**
- Supabase client
- Initial migrations
- Organization
- Profiles
- Roles
- Authentication
- Protected routes
- RLS
- Security tests

**PHASE 3: CRM AND CUSTOMER MANAGEMENT**
- Enquiry form
- Lead management
- Customer profiles
- Lead pipeline
- Follow-ups
- Activity history
- Customer deduplication

**PHASE 4: SURVEY MANAGEMENT**
- Survey scheduling
- Technician assignment
- Measurements
- Photographs
- Grid suitability
- Reports
- Approval and rejection

**PHASE 5: PRODUCT CATALOGUE AND BOM ENGINE**
- Product master data
- Solar packages
- On-Grid
- Off-Grid
- Product compatibility
- Configurator
- Component rules
- BOM generation

**PHASE 6: QUOTATIONS AND SALES**
- Quotation templates
- Final quotation approval restrictions
- Price calculation
- Revisions
- PDF
- Customer acceptance
- Sales order
- Advance/full payment
- Payment allocation

**PHASE 7: INVENTORY AND PROCUREMENT**
- Suppliers
- Purchase orders
- Receipts
- Stock ledger
- Reservations
- Low-stock alerts
- Serial numbers
- QR scanning
- Dispatch and delivery

**PHASE 8: TECHNICIANS AND INSTALLATION**
- Technician management
- Scheduling
- Assigned jobs
- Mobile forms
- Start and finish times
- Installed capacity
- Photos
- Testing
- Generation confirmation
- Digital signature
- Completion reports

**PHASE 9: WARRANTY MANAGEMENT**
- Product warranty rules
- Delivery-triggered activation
- Serial-number lookup
- Eligibility
- Expiry tracking
- Warranty claim records

**PHASE 10: SERVICE AND AFTER-SALES**
- Complaints
- Fault codes
- Tickets
- Assignments
- Warranty validation
- Free covered repair
- Chargeable repair
- Parts and labour
- Resolution
- Customer confirmation

**PHASE 11: FINANCE AND SUBSIDY MANAGEMENT**
- Customer invoices
- Customer payments
- Vendor bills
- Technician payments
- Expenses
- Job costs
- Subsidy documents
- Subsidy application tracking
- Reconciliation
- Outstanding payments

**PHASE 12: ANALYTICS AND DIRECTOR DASHBOARD**
- Daily/weekly/monthly reports
- Revenue
- Expenses
- Project profitability
- Loss-making projects
- Inventory
- Pending installations
- Complaints
- Technician payment obligations
- Subsidies

**PHASE 13: SOLAR INTELLIGENCE AI**
- Authorized natural-language reports
- Inventory insights
- Complaint classification
- Installation delay analysis
- Warranty summaries
- Financial insights

**PHASE 14: END-TO-END INTEGRATION**
- Full customer journey
- All six mandatory scenarios
- Seven business modules
- Cross-page navigation
- Data consistency
- Security testing
- Repeatable demonstration dataset

**PHASE 15: OPTIMIZATION AND DEPLOYMENT**
- Performance audit
- Security audit
- Accessibility
- Responsive testing
- Database query optimization
- Automated browser tests
- Error handling
- Production build
- Deployment documentation

---

## 14. THREE-PERSON TEAM COLLABORATION

**Team size:** 3 developers

**Recommended ownership:**

**DEVELOPER 1:** Database, Supabase, security, business logic and critical transactions.

**DEVELOPER 2:** React frontend, Stitch implementation, public website and application design.

**DEVELOPER 3:** Inventory, field operations, testing, subsidy, finance and integration coordination.

You must document file and feature ownership. Do not allow multiple agents to simultaneously alter the same migration, shared types or component. Maintain: docs/AGENT_HANDOFFS.md

Record the completed work and all integration requirements.

---

## 15. QUALITY, SECURITY AND OPTIMIZATION

For every feature:
1. Inspect existing implementation
2. Understand dependencies
3. Define business behaviour
4. Design the data model
5. Implement migration
6. Implement trusted business logic
7. Implement frontend
8. Integrate actual data
9. Implement validation
10. Implement permissions
11. Write tests
12. Run tests
13. Fix failures
14. Update documentation

**Requirements:**
- No dummy business workflows
- No hardcoded dashboard KPIs
- No secret exposure
- No unrestricted RLS
- No duplicate customer creation
- No duplicate order conversion
- No duplicate serial dispatch
- No negative stock caused by concurrency
- No duplicate warranty activation
- No fabricated financial values
- No missing audit history
- No dead buttons
- No misleading success states

Use database aggregations for dashboards. Use pagination for large data collections. Optimize images and lazy-load large screens. Preserve all valid historical transactions.

---

## 16. REQUIRED ACCEPTANCE TESTS

Execute this complete demonstration:

**CUSTOMER:**
A homeowner requests a 3 kW On-Grid system.

1. Customer submits enquiry
2. CRM lead is created
3. Sales assigns the lead
4. A survey is scheduled
5. A technician records roof measurements
6. The survey is approved
7. System permits the final quotation
8. BOM is calculated
9. Quotation is generated
10. Customer accepts
11. Sales order is created
12. Advance or full payment is recorded
13. Warehouse checks required stock
14. Missing stock generates procurement requirements
15. Warehouse scans and maps serial numbers
16. Equipment is dispatched
17. Delivery completion is recorded
18. Warranty starts according to configured policy
19. Installation job becomes available
20. Technician completes installation
21. Installation photographs are uploaded
22. Testing and power generation are recorded
23. Customer signs acceptance
24. Customer portal reflects the installation
25. Customer's warranty records are visible

**SERVICE:**
Simulate an inverter issue after 18 months.
26. Search inverter serial
27. Retrieve the correct customer
28. Check warranty
29. Create service ticket
30. Assign technician
31. Record diagnosis
32. Process covered or chargeable repair
33. Obtain customer confirmation
34. Close ticket appropriately

**DIRECTOR:**
35. Verify project revenue
36. Verify actual equipment costs
37. Verify labour expenses
38. Verify other expenses
39. Verify contribution
40. Verify stock movement
41. Verify pending installations
42. Verify open complaints
43. Verify technician payment obligations
44. Verify subsidy paperwork status
45. Verify daily, weekly and monthly analytics

The entire demonstration must operate through the application interface. No manual database changes during the demonstration.

---

## 17. PHASE EXECUTION CONTROL

**First execution:** Complete Phase 0 and Phase 1 foundation work only. Do not implement all business modules in one generation.

**Before starting:**
- Inspect PROJECT_ROOT
- Preserve existing files
- Inspect the exact Stitch project where authorized access is available
- Identify current dependencies
- Build the base structure
- Create documentation
- Establish design references
- Prepare React foundations

**At completion:**
- Report files created
- Report files preserved
- Report Stitch access status
- Report screens retrieved
- Report application build status
- Report tests
- Report unresolved dependencies
- Update docs/PHASE_PROGRESS.md

Stop after the initial assigned foundation scope.

**For subsequent phases:**
- Read AGENTS.md
- Read current phase progress
- Inspect working code
- Implement the next requested phase
- Preserve previous features
- Coordinate with Antigravity
- Test
- Document
- Report

Do not mark a phase complete until acceptance criteria pass.

---

## 18. FINAL PRODUCT EXPECTATION

Deliver SunPower One as one connected, professional solar business operating platform.

**The most important competition outcomes are:**
1. Never lose a customer enquiry
2. Never issue an unauthorized final quotation before survey approval
3. Never forget required BOM components
4. Never lose track of a serialized product
5. Never lose installation evidence
6. Never miss warranty eligibility
7. Never leave complaints without resolution tracking
8. Never hide the true financial position of an installation

The application must transform the manually operated solar installation business into a connected, transparent and efficiently managed digital system.

**FUNCTIONALITY FIRST. BUSINESS INTEGRITY ALWAYS. STITCH DESIGN FIDELITY. SECURE DATA. REAL INTERACTIONS. COMPLETE WORKFLOWS.**

**BEGIN WITH PHASE 0.**