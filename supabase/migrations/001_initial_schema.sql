-- SunPower One - Core Database Schema
-- Migration: 001_initial_schema.sql
-- Description: Creates all core tables for the solar installation management system

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE user_role AS ENUM (
  'super_admin',
  'director',
  'sales_executive',
  'survey_technician',
  'warehouse_manager',
  'installation_technician',
  'finance_executive',
  'support_executive',
  'customer'
);

CREATE TYPE lead_status AS ENUM (
  'new',
  'contacted',
  'qualified',
  'survey_scheduled',
  'survey_completed',
  'quoted',
  'won',
  'lost'
);

CREATE TYPE survey_status AS ENUM (
  'scheduled',
  'in_progress',
  'submitted',
  'approved',
  'rejected'
);

CREATE TYPE quotation_status AS ENUM (
  'draft',
  'pending_approval',
  'approved',
  'sent',
  'accepted',
  'rejected',
  'expired'
);

CREATE TYPE order_status AS ENUM (
  'confirmed',
  'payment_pending',
  'payment_received',
  'in_production',
  'ready_for_dispatch',
  'dispatched',
  'delivered',
  'cancelled'
);

CREATE TYPE payment_status AS ENUM (
  'pending',
  'completed',
  'failed',
  'refunded',
  'partial'
);

CREATE TYPE inventory_status AS ENUM (
  'available',
  'reserved',
  'dispatched',
  'delivered',
  'damaged',
  'returned'
);

CREATE TYPE installation_status AS ENUM (
  'scheduled',
  'in_progress',
  'completed',
  'on_hold',
  'cancelled'
);

CREATE TYPE warranty_status AS ENUM (
  'active',
  'expired',
  'claimed',
  'voided'
);

CREATE TYPE ticket_status AS ENUM (
  'open',
  'assigned',
  'in_progress',
  'pending_customer',
  'resolved',
  'closed'
);

CREATE TYPE subsidy_status AS ENUM (
  'draft',
  'submitted',
  'under_review',
  'approved',
  'rejected',
  'disbursed'
);

-- ============================================================
-- IDENTITY & ORGANIZATION
-- ============================================================

CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  gst_number TEXT,
  address TEXT,
  phone TEXT,
  email TEXT,
  logo_url TEXT,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role user_role NOT NULL DEFAULT 'customer',
  avatar_url TEXT,
  phone TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_profiles_organization_id ON profiles(organization_id);
CREATE INDEX idx_profiles_role ON profiles(role);

CREATE TABLE organization_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role user_role NOT NULL,
  invited_by UUID REFERENCES profiles(id),
  invited_at TIMESTAMPTZ DEFAULT NOW(),
  accepted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, profile_id)
);

CREATE INDEX idx_organization_members_org ON organization_members(organization_id);
CREATE INDEX idx_organization_members_profile ON organization_members(profile_id);

CREATE TABLE role_permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  role user_role NOT NULL,
  resource TEXT NOT NULL,
  action TEXT NOT NULL,
  conditions JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(role, resource, action)
);

-- ============================================================
-- CRM
-- ============================================================

CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  customer_code TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL,
  type TEXT DEFAULT 'residential',
  status TEXT DEFAULT 'active',
  gst_number TEXT,
  pan_number TEXT,
  preferred_contact_method TEXT DEFAULT 'phone',
  notes TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, customer_code)
);

CREATE INDEX idx_customers_org ON customers(organization_id);
CREATE INDEX idx_customers_phone ON customers(phone);
CREATE INDEX idx_customers_email ON customers(email);

CREATE TABLE customer_contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  designation TEXT,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_customer_contacts_customer ON customer_contacts(customer_id);

CREATE TABLE customer_addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  address_type TEXT DEFAULT 'installation',
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_customer_addresses_customer ON customer_addresses(customer_id);

CREATE TABLE lead_sources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  lead_code TEXT NOT NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  source_id UUID REFERENCES lead_sources(id) ON DELETE SET NULL,
  assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
  status lead_status DEFAULT 'new',
  capacity_kw DECIMAL(5, 2),
  system_type TEXT,
  monthly_bill DECIMAL(12, 2),
  rooftop_area DECIMAL(10, 2),
  grid_suitability TEXT,
  additional_requirements TEXT,
  estimated_value DECIMAL(12, 2),
  probability INTEGER DEFAULT 10,
  expected_close_date DATE,
  lost_reason TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, lead_code)
);

CREATE INDEX idx_leads_org ON leads(organization_id);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_assigned ON leads(assigned_to);
CREATE INDEX idx_leads_customer ON leads(customer_id);

CREATE TABLE lead_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  description TEXT,
  outcome TEXT,
  next_action TEXT,
  next_action_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_lead_activities_lead ON lead_activities(lead_id);
CREATE INDEX idx_lead_activities_user ON lead_activities(user_id);

CREATE TABLE follow_ups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  due_date TIMESTAMPTZ NOT NULL,
  activity_type TEXT NOT NULL,
  notes TEXT,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_follow_ups_lead ON follow_ups(lead_id);
CREATE INDEX idx_follow_ups_user_due ON follow_ups(user_id, due_date);
CREATE INDEX idx_follow_ups_completed ON follow_ups(completed);

-- ============================================================
-- SURVEY
-- ============================================================

CREATE TABLE survey_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  requested_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  preferred_date DATE,
  preferred_time_slot TEXT,
  notes TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_survey_requests_lead ON survey_requests(lead_id);

CREATE TABLE surveys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  request_id UUID NOT NULL REFERENCES survey_requests(id) ON DELETE CASCADE,
  technician_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  scheduled_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  roof_direction TEXT,
  roof_tilt DECIMAL(5, 2),
  cable_distance DECIMAL(8, 2),
  roof_area DECIMAL(10, 2),
  shadow_free_area DECIMAL(10, 2),
  grid_suitability TEXT,
  grid_notes TEXT,
  status survey_status DEFAULT 'scheduled',
  approved_by UUID REFERENCES profiles(id),
  approved_at TIMESTAMPTZ,
  approval_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_surveys_org ON surveys(organization_id);
CREATE INDEX idx_surveys_technician ON surveys(technician_id);
CREATE INDEX idx_surveys_status ON surveys(status);

CREATE TABLE survey_measurements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  survey_id UUID NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,
  measurement_type TEXT NOT NULL,
  value DECIMAL(10, 2) NOT NULL,
  unit TEXT NOT NULL,
  location_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE survey_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  survey_id UUID NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  caption TEXT,
  photo_type TEXT,
  uploaded_by UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE survey_approvals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  survey_id UUID NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,
  approved_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  approved_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PRODUCTS & BOM
-- ============================================================

CREATE TABLE product_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  parent_id UUID REFERENCES product_categories(id) ON DELETE SET NULL,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  category_id UUID REFERENCES product_categories(id) ON DELETE SET NULL,
  product_code TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  unit TEXT NOT NULL,
  base_price DECIMAL(12, 2) NOT NULL DEFAULT 0,
  cost_price DECIMAL(12, 2),
  tax_rate DECIMAL(5, 2) DEFAULT 18,
  is_serialized BOOLEAN DEFAULT FALSE,
  warranty_months INTEGER,
  min_stock_level INTEGER DEFAULT 0,
  max_stock_level INTEGER,
  reorder_point INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, product_code)
);

CREATE INDEX idx_products_org ON products(organization_id);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_serialized ON products(is_serialized);

CREATE TABLE product_specifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  spec_key TEXT NOT NULL,
  spec_value TEXT NOT NULL,
  unit TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE solar_packages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  capacity_kw DECIMAL(5, 2) NOT NULL,
  system_type TEXT NOT NULL,
  base_price DECIMAL(12, 2) NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE package_components (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  package_id UUID NOT NULL REFERENCES solar_packages(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  is_optional BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(package_id, product_id)
);

CREATE TABLE solar_configurations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  package_id UUID REFERENCES solar_packages(id) ON DELETE SET NULL,
  capacity_kw DECIMAL(5, 2) NOT NULL,
  system_type TEXT NOT NULL,
  customizations JSONB DEFAULT '{}',
  total_price DECIMAL(12, 2) DEFAULT 0,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE bom_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  system_type TEXT NOT NULL,
  capacity_min_kw DECIMAL(5, 2),
  capacity_max_kw DECIMAL(5, 2),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE bom_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  template_id UUID NOT NULL REFERENCES bom_templates(id) ON DELETE CASCADE,
  product_category_id UUID REFERENCES product_categories(id) ON DELETE SET NULL,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  calculation_type TEXT NOT NULL,
  formula TEXT,
  conditions JSONB DEFAULT '{}',
  is_optional BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE bom_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  configuration_id UUID NOT NULL REFERENCES solar_configurations(id) ON DELETE CASCADE,
  template_id UUID REFERENCES bom_templates(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'draft',
  total_price DECIMAL(12, 2) DEFAULT 0,
  approved_by UUID REFERENCES profiles(id),
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_bom_records_config ON bom_records(configuration_id);

CREATE TABLE bom_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bom_record_id UUID NOT NULL REFERENCES bom_records(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(12, 2) NOT NULL,
  total_price DECIMAL(12, 2) NOT NULL,
  is_optional BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE warranty_policies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  duration_months INTEGER NOT NULL,
  trigger_event TEXT DEFAULT 'delivery_completed',
  coverage_details TEXT,
  exclusions TEXT,
  terms_conditions TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, product_id)
);

-- ============================================================
-- SALES
-- ============================================================

CREATE TABLE quotations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  configuration_id UUID NOT NULL REFERENCES solar_configurations(id) ON DELETE CASCADE,
  version INTEGER DEFAULT 1,
  status quotation_status DEFAULT 'draft',
  subtotal DECIMAL(12, 2) DEFAULT 0,
  tax_amount DECIMAL(12, 2) DEFAULT 0,
  discount_amount DECIMAL(12, 2) DEFAULT 0,
  total_amount DECIMAL(12, 2) DEFAULT 0,
  valid_until DATE,
  approved_by UUID REFERENCES profiles(id),
  approved_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  accepted_at TIMESTAMPTZ,
  rejected_at TIMESTAMPTZ,
  rejection_reason TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_quotations_org ON quotations(organization_id);
CREATE INDEX idx_quotations_lead ON quotations(lead_id);
CREATE INDEX idx_quotations_status ON quotations(status);

CREATE TABLE quotation_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quotation_id UUID NOT NULL REFERENCES quotations(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(12, 2) NOT NULL,
  tax_rate DECIMAL(5, 2) DEFAULT 18,
  discount_percent DECIMAL(5, 2) DEFAULT 0,
  total_price DECIMAL(12, 2) NOT NULL,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE quotation_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quotation_id UUID NOT NULL REFERENCES quotations(id) ON DELETE CASCADE,
  version INTEGER NOT NULL,
  snapshot JSONB NOT NULL,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(quotation_id, version)
);

CREATE TABLE sales_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  quotation_id UUID NOT NULL REFERENCES quotations(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  order_code TEXT NOT NULL,
  status order_status DEFAULT 'confirmed',
  order_date DATE DEFAULT CURRENT_DATE,
  expected_delivery_date DATE,
  total_amount DECIMAL(12, 2) DEFAULT 0,
  advance_amount DECIMAL(12, 2) DEFAULT 0,
  balance_amount DECIMAL(12, 2) DEFAULT 0,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, order_code)
);

CREATE INDEX idx_sales_orders_org ON sales_orders(organization_id);
CREATE INDEX idx_sales_orders_customer ON sales_orders(customer_id);
CREATE INDEX idx_sales_orders_status ON sales_orders(status);
CREATE INDEX idx_sales_orders_quotation ON sales_orders(quotation_id);

CREATE TABLE sales_order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES sales_orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(12, 2) NOT NULL,
  tax_rate DECIMAL(5, 2) DEFAULT 18,
  total_price DECIMAL(12, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE payment_milestones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES sales_orders(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  due_date DATE,
  sequence INTEGER NOT NULL,
  is_advance BOOLEAN DEFAULT FALSE,
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  order_id UUID REFERENCES sales_orders(id) ON DELETE SET NULL,
  payment_code TEXT NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  payment_method TEXT NOT NULL,
  reference_number TEXT,
  status payment_status DEFAULT 'pending',
  paid_at TIMESTAMPTZ,
  allocated_amount DECIMAL(12, 2) DEFAULT 0,
  notes TEXT,
  received_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, payment_code)
);

CREATE INDEX idx_payments_org ON payments(organization_id);
CREATE INDEX idx_payments_customer ON payments(customer_id);
CREATE INDEX idx_payments_order ON payments(order_id);
CREATE INDEX idx_payments_status ON payments(status);

CREATE TABLE payment_allocations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  payment_id UUID NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
  invoice_id UUID REFERENCES invoices(id) ON DELETE SET NULL,
  order_id UUID REFERENCES sales_orders(id) ON DELETE SET NULL,
  amount DECIMAL(12, 2) NOT NULL,
  allocated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INVENTORY
-- ============================================================

CREATE TABLE suppliers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  supplier_code TEXT NOT NULL,
  name TEXT NOT NULL,
  contact_person TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  pincode TEXT,
  gst_number TEXT,
  payment_terms_days INTEGER DEFAULT 30,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, supplier_code)
);

CREATE TABLE purchase_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  supplier_id UUID NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
  po_code TEXT NOT NULL,
  status TEXT DEFAULT 'draft',
  order_date DATE DEFAULT CURRENT_DATE,
  expected_date DATE,
  total_amount DECIMAL(12, 2) DEFAULT 0,
  notes TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, po_code)
);

CREATE INDEX idx_purchase_orders_org ON purchase_orders(organization_id);
CREATE INDEX idx_purchase_orders_supplier ON purchase_orders(supplier_id);
CREATE INDEX idx_purchase_orders_status ON purchase_orders(status);

CREATE TABLE purchase_order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  purchase_order_id UUID NOT NULL REFERENCES purchase_orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(12, 2) NOT NULL,
  tax_rate DECIMAL(5, 2) DEFAULT 18,
  total_price DECIMAL(12, 2) NOT NULL,
  received_quantity INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE warehouse_locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  address TEXT,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, code)
);

CREATE TABLE stock_movements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  location_id UUID NOT NULL REFERENCES warehouse_locations(id) ON DELETE CASCADE,
  movement_type TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  reference_type TEXT,
  reference_id UUID,
  unit_cost DECIMAL(12, 2),
  batch_number TEXT,
  expiry_date DATE,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_stock_movements_org ON stock_movements(organization_id);
CREATE INDEX idx_stock_movements_product ON stock_movements(product_id);
CREATE INDEX idx_stock_movements_location ON stock_movements(location_id);
CREATE INDEX idx_stock_movements_reference ON stock_movements(reference_type, reference_id);
CREATE INDEX idx_stock_movements_created ON stock_movements(created_at);

CREATE TABLE stock_reservations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  order_id UUID NOT NULL REFERENCES sales_orders(id) ON DELETE CASCADE,
  location_id UUID REFERENCES warehouse_locations(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL,
  status TEXT DEFAULT 'active',
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_stock_reservations_order ON stock_reservations(order_id);
CREATE INDEX idx_stock_reservations_product ON stock_reservations(product_id);
CREATE INDEX idx_stock_reservations_status ON stock_reservations(status);

CREATE TABLE inventory_adjustments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  location_id UUID NOT NULL REFERENCES warehouse_locations(id) ON DELETE CASCADE,
  adjustment_type TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  reason TEXT,
  reference_id UUID,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE serial_units (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  serial_number TEXT NOT NULL,
  qr_code TEXT,
  status inventory_status DEFAULT 'available',
  location_id UUID REFERENCES warehouse_locations(id) ON DELETE SET NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  order_id UUID REFERENCES sales_orders(id) ON DELETE SET NULL,
  warranty_start TIMESTAMPTZ,
  warranty_end TIMESTAMPTZ,
  warranty_trigger_event TEXT,
  manufacture_date DATE,
  batch_number TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, serial_number)
);

CREATE INDEX idx_serial_units_org ON serial_units(organization_id);
CREATE INDEX idx_serial_units_product ON serial_units(product_id);
CREATE INDEX idx_serial_units_status ON serial_units(status);
CREATE INDEX idx_serial_units_customer ON serial_units(customer_id);
CREATE INDEX idx_serial_units_order ON serial_units(order_id);

CREATE TABLE dispatches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  order_id UUID NOT NULL REFERENCES sales_orders(id) ON DELETE CASCADE,
  dispatch_code TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  dispatched_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  delivered_by UUID REFERENCES profiles(id),
  delivery_notes TEXT,
  proof_of_delivery_url TEXT,
  vehicle_number TEXT,
  driver_name TEXT,
  driver_phone TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, dispatch_code)
);

CREATE INDEX idx_dispatches_org ON dispatches(organization_id);
CREATE INDEX idx_dispatches_order ON dispatches(order_id);
CREATE INDEX idx_dispatches_status ON dispatches(status);

CREATE TABLE dispatch_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dispatch_id UUID NOT NULL REFERENCES dispatches(id) ON DELETE CASCADE,
  serial_unit_id UUID NOT NULL REFERENCES serial_units(id) ON DELETE CASCADE,
  scanned_at TIMESTAMPTZ,
  scanned_by UUID REFERENCES profiles(id),
  condition TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(dispatch_id, serial_unit_id)
);

-- ============================================================
-- INSTALLATION
-- ============================================================

CREATE TABLE technicians (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  employee_code TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  skills TEXT[] DEFAULT '{}',
  hourly_rate DECIMAL(10, 2),
  daily_rate DECIMAL(10, 2),
  is_active BOOLEAN DEFAULT TRUE,
  hire_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, employee_code)
);

CREATE INDEX idx_technicians_org ON technicians(organization_id);
CREATE INDEX idx_technicians_profile ON technicians(profile_id);

CREATE TABLE technician_skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  technician_id UUID NOT NULL REFERENCES technicians(id) ON DELETE CASCADE,
  skill TEXT NOT NULL,
  proficiency INTEGER DEFAULT 1,
  certified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(technician_id, skill)
);

CREATE TABLE technician_availability (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  technician_id UUID NOT NULL REFERENCES technicians(id) ON DELETE CASCADE,
  availability_date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  is_available BOOLEAN DEFAULT TRUE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(technician_id, availability_date)
);

CREATE TABLE installations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  order_id UUID NOT NULL REFERENCES sales_orders(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  status installation_status DEFAULT 'scheduled',
  scheduled_start TIMESTAMPTZ,
  actual_start TIMESTAMPTZ,
  actual_end TIMESTAMPTZ,
  installed_capacity_kw DECIMAL(5, 2),
  generation_confirmed BOOLEAN DEFAULT FALSE,
  completion_report_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_installations_org ON installations(organization_id);
CREATE INDEX idx_installations_order ON installations(order_id);
CREATE INDEX idx_installations_customer ON installations(customer_id);
CREATE INDEX idx_installations_status ON installations(status);
CREATE INDEX idx_installations_scheduled ON installations(scheduled_start);

CREATE TABLE installation_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  installation_id UUID NOT NULL REFERENCES installations(id) ON DELETE CASCADE,
  technician_id UUID NOT NULL REFERENCES technicians(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'lead',
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(installation_id, technician_id)
);

CREATE TABLE installation_checklists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  installation_id UUID NOT NULL REFERENCES installations(id) ON DELETE CASCADE,
  template_id UUID,
  status TEXT DEFAULT 'pending',
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE installation_checklist_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  checklist_id UUID NOT NULL REFERENCES installation_checklists(id) ON DELETE CASCADE,
  item_text TEXT NOT NULL,
  item_type TEXT,
  is_mandatory BOOLEAN DEFAULT TRUE,
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  notes TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE installation_evidence (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  installation_id UUID NOT NULL REFERENCES installations(id) ON DELETE CASCADE,
  item_id UUID REFERENCES installation_checklist_items(id) ON DELETE SET NULL,
  evidence_type TEXT NOT NULL,
  file_url TEXT NOT NULL,
  caption TEXT,
  uploaded_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE installation_tests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  installation_id UUID NOT NULL REFERENCES installations(id) ON DELETE CASCADE,
  test_type TEXT NOT NULL,
  expected_value DECIMAL(10, 2),
  actual_value DECIMAL(10, 2),
  unit TEXT,
  status TEXT DEFAULT 'pending',
  notes TEXT,
  tested_by UUID REFERENCES profiles(id),
  tested_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE customer_acceptances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  installation_id UUID NOT NULL REFERENCES installations(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  signature_url TEXT NOT NULL,
  accepted_at TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- WARRANTY & SERVICE
-- ============================================================

CREATE TABLE warranties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  serial_unit_id UUID NOT NULL REFERENCES serial_units(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  policy_id UUID NOT NULL REFERENCES warranty_policies(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  status warranty_status DEFAULT 'active',
  activated_by UUID REFERENCES profiles(id),
  activation_trigger_event TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_warranties_org ON warranties(organization_id);
CREATE INDEX idx_warranties_serial ON warranties(serial_unit_id);
CREATE INDEX idx_warranties_customer ON warranties(customer_id);
CREATE INDEX idx_warranties_status ON warranties(status);
CREATE INDEX idx_warranties_ends ON warranties(ends_at);

CREATE TABLE warranty_claims (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  warranty_id UUID NOT NULL REFERENCES warranties(id) ON DELETE CASCADE,
  ticket_id UUID REFERENCES service_tickets(id) ON DELETE SET NULL,
  claim_type TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending',
  approved_amount DECIMAL(12, 2),
  processed_by UUID REFERENCES profiles(id),
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE service_tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  serial_unit_id UUID REFERENCES serial_units(id) ON DELETE SET NULL,
  warranty_id UUID REFERENCES warranties(id) ON DELETE SET NULL,
  ticket_code TEXT NOT NULL,
  fault_code TEXT,
  description TEXT NOT NULL,
  priority TEXT DEFAULT 'medium',
  status ticket_status DEFAULT 'open',
  assigned_to UUID REFERENCES profiles(id),
  scheduled_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ,
  closed_at TIMESTAMPTZ,
  customer_confirmed BOOLEAN DEFAULT FALSE,
  customer_confirmed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, ticket_code)
);

CREATE INDEX idx_service_tickets_org ON service_tickets(organization_id);
CREATE INDEX idx_service_tickets_customer ON service_tickets(customer_id);
CREATE INDEX idx_service_tickets_status ON service_tickets(status);
CREATE INDEX idx_service_tickets_assigned ON service_tickets(assigned_to);
CREATE INDEX idx_service_tickets_serial ON service_tickets(serial_unit_id);

CREATE TABLE service_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id UUID NOT NULL REFERENCES service_tickets(id) ON DELETE CASCADE,
  technician_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE service_updates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id UUID NOT NULL REFERENCES service_tickets(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  update_type TEXT NOT NULL,
  description TEXT,
  is_customer_visible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE repair_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id UUID NOT NULL REFERENCES service_tickets(id) ON DELETE CASCADE,
  diagnosis TEXT,
  resolution TEXT,
  parts_cost DECIMAL(12, 2) DEFAULT 0,
  labor_cost DECIMAL(12, 2) DEFAULT 0,
  total_cost DECIMAL(12, 2) DEFAULT 0,
  is_warranty BOOLEAN DEFAULT FALSE,
  warranty_claim_id UUID REFERENCES warranty_claims(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE repair_parts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  repair_id UUID NOT NULL REFERENCES repair_records(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_cost DECIMAL(12, 2) NOT NULL,
  total_cost DECIMAL(12, 2) NOT NULL,
  serial_number TEXT,
  is_warranty BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE replacement_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id UUID NOT NULL REFERENCES service_tickets(id) ON DELETE CASCADE,
  old_serial_unit_id UUID NOT NULL REFERENCES serial_units(id) ON DELETE CASCADE,
  new_serial_unit_id UUID NOT NULL REFERENCES serial_units(id) ON DELETE CASCADE,
  reason TEXT,
  cost DECIMAL(12, 2) DEFAULT 0,
  is_warranty BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- FINANCE & SUBSIDY
-- ============================================================

CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  order_id UUID REFERENCES sales_orders(id) ON DELETE SET NULL,
  invoice_number TEXT NOT NULL,
  invoice_date DATE DEFAULT CURRENT_DATE,
  due_date DATE,
  status TEXT DEFAULT 'draft',
  subtotal DECIMAL(12, 2) DEFAULT 0,
  tax_amount DECIMAL(12, 2) DEFAULT 0,
  total_amount DECIMAL(12, 2) DEFAULT 0,
  paid_amount DECIMAL(12, 2) DEFAULT 0,
  pdf_url TEXT,
  notes TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, invoice_number)
);

CREATE INDEX idx_invoices_org ON invoices(organization_id);
CREATE INDEX idx_invoices_customer ON invoices(customer_id);
CREATE INDEX idx_invoices_status ON invoices(status);

CREATE TABLE invoice_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(12, 2) NOT NULL,
  tax_rate DECIMAL(5, 2) DEFAULT 18,
  total_price DECIMAL(12, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE expense_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES expense_categories(id) ON DELETE CASCADE,
  vendor_id UUID REFERENCES suppliers(id) ON DELETE SET NULL,
  amount DECIMAL(12, 2) NOT NULL,
  description TEXT,
  expense_date DATE NOT NULL,
  status TEXT DEFAULT 'pending',
  approved_by UUID REFERENCES profiles(id),
  approved_at TIMESTAMPTZ,
  receipt_url TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_expenses_org ON expenses(organization_id);
CREATE INDEX idx_expenses_category ON expenses(category_id);
CREATE INDEX idx_expenses_date ON expenses(expense_date);

CREATE TABLE vendor_bills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  supplier_id UUID NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
  bill_number TEXT NOT NULL,
  bill_date DATE NOT NULL,
  due_date DATE,
  amount DECIMAL(12, 2) NOT NULL,
  status TEXT DEFAULT 'pending',
  pdf_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, bill_number)
);

CREATE TABLE vendor_bill_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_bill_id UUID NOT NULL REFERENCES vendor_bills(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  description TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(12, 2) NOT NULL,
  total_price DECIMAL(12, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE technician_payables (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  technician_id UUID NOT NULL REFERENCES technicians(id) ON DELETE CASCADE,
  installation_id UUID REFERENCES installations(id) ON DELETE SET NULL,
  agreed_amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
  additional_amount DECIMAL(12, 2) DEFAULT 0,
  advance_paid DECIMAL(12, 2) DEFAULT 0,
  remaining_payable DECIMAL(12, 2) GENERATED ALWAYS AS (agreed_amount + additional_amount - advance_paid) STORED,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE technician_payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  payable_id UUID NOT NULL REFERENCES technician_payables(id) ON DELETE CASCADE,
  amount DECIMAL(12, 2) NOT NULL,
  payment_date DATE NOT NULL,
  payment_method TEXT,
  reference_number TEXT,
  notes TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE job_costs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  installation_id UUID NOT NULL REFERENCES installations(id) ON DELETE CASCADE,
  cost_type TEXT NOT NULL,
  description TEXT,
  amount DECIMAL(12, 2) NOT NULL,
  vendor_id UUID REFERENCES suppliers(id) ON DELETE SET NULL,
  technician_id UUID REFERENCES technicians(id) ON DELETE SET NULL,
  incurred_at DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE subsidy_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  installation_id UUID REFERENCES installations(id) ON DELETE SET NULL,
  scheme_name TEXT NOT NULL,
  eligibility_status TEXT,
  required_documents JSONB DEFAULT '[]',
  submitted_documents JSONB DEFAULT '[]',
  submitted_at TIMESTAMPTZ,
  application_reference TEXT,
  status subsidy_status DEFAULT 'draft',
  approved_amount DECIMAL(12, 2),
  rejection_reason TEXT,
  disbursed_at TIMESTAMPTZ,
  disbursement_reference TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_subsidy_applications_org ON subsidy_applications(organization_id);
CREATE INDEX idx_subsidy_applications_customer ON subsidy_applications(customer_id);
CREATE INDEX idx_subsidy_applications_status ON subsidy_applications(status);

CREATE TABLE subsidy_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID NOT NULL REFERENCES subsidy_applications(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL,
  file_url TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  verified_by UUID REFERENCES profiles(id),
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE subsidy_status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID NOT NULL REFERENCES subsidy_applications(id) ON DELETE CASCADE,
  from_status subsidy_status,
  to_status subsidy_status NOT NULL,
  changed_by UUID REFERENCES profiles(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SHARED
-- ============================================================

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  data JSONB DEFAULT '{}',
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read_at);

CREATE TABLE notification_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  in_app BOOLEAN DEFAULT TRUE,
  email BOOLEAN DEFAULT FALSE,
  sms BOOLEAN DEFAULT FALSE,
  push BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, type)
);

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource TEXT NOT NULL,
  resource_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_org ON audit_logs(organization_id);
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource, resource_id);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at);

CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  action TEXT NOT NULL,
  description TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_activity_logs_org ON activity_logs(organization_id);
CREATE INDEX idx_activity_logs_entity ON activity_logs(entity_type, entity_id);
CREATE INDEX idx_activity_logs_created ON activity_logs(created_at);

CREATE TABLE application_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  key TEXT NOT NULL,
  value TEXT,
  description TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, key)
);

CREATE TABLE document_metadata (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size BIGINT,
  mime_type TEXT,
  uploaded_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_document_metadata_entity ON document_metadata(entity_type, entity_id);

CREATE TABLE integration_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  integration_name TEXT NOT NULL,
  config JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, integration_name)
);