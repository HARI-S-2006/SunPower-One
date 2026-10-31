-- SunPower One - Row Level Security Policies
-- Migration: 002_rls_policies.sql
-- Description: Enables RLS on all business tables with role-based access control

-- ============================================================
-- HELPER FUNCTIONS
-- ============================================================

-- Get current user's organization_id
CREATE OR REPLACE FUNCTION get_user_org_id()
RETURNS UUID AS $$
BEGIN
  RETURN (SELECT organization_id FROM profiles WHERE id = auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get current user's role
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS user_role AS $$
BEGIN
  RETURN (SELECT role FROM profiles WHERE id = auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if user has specific role
CREATE OR REPLACE FUNCTION has_role(required_role user_role)
RETURNS BOOLEAN AS $$
DECLARE
  user_role user_role;
BEGIN
  SELECT role INTO user_role FROM profiles WHERE id = auth.uid();
  RETURN user_role = required_role OR user_role = 'super_admin' OR user_role = 'director';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if user is in organization
CREATE OR REPLACE FUNCTION is_org_member(org_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND organization_id = org_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if user can access customer (own customer or org member)
CREATE OR REPLACE FUNCTION can_access_customer(customer_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM customers
    WHERE id = customer_id
    AND (organization_id = get_user_org_id() OR customer_id = (
      SELECT id FROM customers WHERE id = customer_id AND organization_id = get_user_org_id()
    ))
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if user is assigned to installation/ticket
CREATE OR REPLACE FUNCTION is_assigned_to(entity_type TEXT, entity_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  IF entity_type = 'installation' THEN
    RETURN EXISTS (
      SELECT 1 FROM installation_assignments
      WHERE installation_id = entity_id
      AND technician_id = (SELECT id FROM technicians WHERE profile_id = auth.uid())
    );
  ELSIF entity_type = 'service_ticket' THEN
    RETURN EXISTS (
      SELECT 1 FROM service_tickets
      WHERE id = entity_id AND assigned_to = auth.uid()
    );
  END IF;
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- ENABLE RLS ON ALL TABLES
-- ============================================================

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE follow_ups ENABLE ROW LEVEL SECURITY;

ALTER TABLE survey_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_measurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_approvals ENABLE ROW LEVEL SECURITY;

ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_specifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE solar_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE package_components ENABLE ROW LEVEL SECURITY;
ALTER TABLE solar_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE bom_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE bom_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE bom_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE bom_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE warranty_policies ENABLE ROW LEVEL SECURITY;

ALTER TABLE quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotation_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_allocations ENABLE ROW LEVEL SECURITY;

ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE warehouse_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_adjustments ENABLE ROW LEVEL SECURITY;
ALTER TABLE serial_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE dispatches ENABLE ROW LEVEL SECURITY;
ALTER TABLE dispatch_items ENABLE ROW LEVEL SECURITY;

ALTER TABLE technicians ENABLE ROW LEVEL SECURITY;
ALTER TABLE technician_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE technician_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE installations ENABLE ROW LEVEL SECURITY;
ALTER TABLE installation_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE installation_checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE installation_checklist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE installation_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE installation_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_acceptances ENABLE ROW LEVEL SECURITY;

ALTER TABLE warranties ENABLE ROW LEVEL SECURITY;
ALTER TABLE warranty_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE repair_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE repair_parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE replacement_records ENABLE ROW LEVEL SECURITY;

ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE expense_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_bill_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE technician_payables ENABLE ROW LEVEL SECURITY;
ALTER TABLE technician_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_costs ENABLE ROW LEVEL SECURITY;
ALTER TABLE subsidy_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE subsidy_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE subsidy_status_history ENABLE ROW LEVEL SECURITY;

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE integration_settings ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- IDENTITY & ORGANIZATION POLICIES
-- ============================================================

-- Organizations: users can only see their own organization
CREATE POLICY "org_select_own" ON organizations
  FOR SELECT USING (id = get_user_org_id());

CREATE POLICY "org_update_own" ON organizations
  FOR UPDATE USING (id = get_user_org_id() AND has_role('director'));

-- Profiles: users can see profiles in their org
CREATE POLICY "profiles_select_org" ON profiles
  FOR SELECT USING (organization_id = get_user_org_id());

CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE USING (id = auth.uid());

CREATE POLICY "profiles_insert_org" ON profiles
  FOR INSERT WITH CHECK (organization_id = get_user_org_id() AND has_role('director'));

-- Organization members: org members can view, directors can manage
CREATE POLICY "org_members_select_org" ON organization_members
  FOR SELECT USING (organization_id = get_user_org_id());

CREATE POLICY "org_members_manage_director" ON organization_members
  FOR ALL USING (organization_id = get_user_org_id() AND has_role('director'));

-- Role permissions: readable by all org members
CREATE POLICY "role_perms_select_org" ON role_permissions
  FOR SELECT USING (true);

-- ============================================================
-- CRM POLICIES
-- ============================================================

-- Customers: org members can view, sales/director can manage
CREATE POLICY "customers_select_org" ON customers
  FOR SELECT USING (organization_id = get_user_org_id());

CREATE POLICY "customers_insert_sales" ON customers
  FOR INSERT WITH CHECK (organization_id = get_user_org_id() AND has_role('sales_executive') OR has_role('director'));

CREATE POLICY "customers_update_sales" ON customers
  FOR UPDATE USING (organization_id = get_user_org_id() AND (has_role('sales_executive') OR has_role('director')));

-- Customer contacts
CREATE POLICY "customer_contacts_select_org" ON customer_contacts
  FOR SELECT USING (customer_id IN (SELECT id FROM customers WHERE organization_id = get_user_org_id()));

CREATE POLICY "customer_contacts_manage_sales" ON customer_contacts
  FOR ALL USING (customer_id IN (SELECT id FROM customers WHERE organization_id = get_user_org_id()) AND (has_role('sales_executive') OR has_role('director')));

-- Customer addresses
CREATE POLICY "customer_addresses_select_org" ON customer_addresses
  FOR SELECT USING (customer_id IN (SELECT id FROM customers WHERE organization_id = get_user_org_id()));

CREATE POLICY "customer_addresses_manage_sales" ON customer_addresses
  FOR ALL USING (customer_id IN (SELECT id FROM customers WHERE organization_id = get_user_org_id()) AND (has_role('sales_executive') OR has_role('director')));

-- Lead sources
CREATE POLICY "lead_sources_select_org" ON lead_sources
  FOR SELECT USING (organization_id = get_user_org_id());

CREATE POLICY "lead_sources_manage_sales" ON lead_sources
  FOR ALL USING (organization_id = get_user_org_id() AND (has_role('sales_executive') OR has_role('director')));

-- Leads: sales can manage own leads, director sees all
CREATE POLICY "leads_select_org" ON leads
  FOR SELECT USING (
    organization_id = get_user_org_id() AND (
      has_role('director') OR
      assigned_to = auth.uid() OR
      has_role('sales_executive')
    )
  );

CREATE POLICY "leads_insert_sales" ON leads
  FOR INSERT WITH CHECK (organization_id = get_user_org_id() AND (has_role('sales_executive') OR has_role('director')));

CREATE POLICY "leads_update_assigned" ON leads
  FOR UPDATE USING (
    organization_id = get_user_org_id() AND (
      has_role('director') OR
      assigned_to = auth.uid() OR
      has_role('sales_executive')
    )
  );

-- Lead activities
CREATE POLICY "lead_activities_select_org" ON lead_activities
  FOR SELECT USING (lead_id IN (SELECT id FROM leads WHERE organization_id = get_user_org_id()));

CREATE POLICY "lead_activities_insert_sales" ON lead_activities
  FOR INSERT WITH CHECK (lead_id IN (SELECT id FROM leads WHERE organization_id = get_user_org_id()) AND (has_role('sales_executive') OR has_role('director')));

-- Follow-ups
CREATE POLICY "follow_ups_select_org" ON follow_ups
  FOR SELECT USING (lead_id IN (SELECT id FROM leads WHERE organization_id = get_user_org_id()));

CREATE POLICY "follow_ups_manage_assigned" ON follow_ups
  FOR ALL USING (
    lead_id IN (SELECT id FROM leads WHERE organization_id = get_user_org_id()) AND (
      has_role('director') OR
      user_id = auth.uid()
    )
  );

-- ============================================================
-- SURVEY POLICIES
-- ============================================================

CREATE POLICY "survey_requests_select_org" ON survey_requests
  FOR SELECT USING (organization_id = get_user_org_id());

CREATE POLICY "survey_requests_manage_sales" ON survey_requests
  FOR ALL USING (organization_id = get_user_org_id() AND (has_role('sales_executive') OR has_role('director')));

CREATE POLICY "surveys_select_org" ON surveys
  FOR SELECT USING (
    organization_id = get_user_org_id() AND (
      has_role('director') OR
      technician_id = auth.uid() OR
      has_role('sales_executive') OR
      has_role('survey_technician')
    )
  );

CREATE POLICY "surveys_insert_survey" ON surveys
  FOR INSERT WITH CHECK (organization_id = get_user_org_id() AND (has_role('survey_technician') OR has_role('director')));

CREATE POLICY "surveys_update_tech" ON surveys
  FOR UPDATE USING (
    organization_id = get_user_org_id() AND (
      has_role('director') OR
      technician_id = auth.uid() OR
      has_role('survey_technician')
    )
  );

CREATE POLICY "survey_measurements_all" ON survey_measurements
  FOR ALL USING (survey_id IN (SELECT id FROM surveys WHERE organization_id = get_user_org_id()));

CREATE POLICY "survey_photos_all" ON survey_photos
  FOR ALL USING (survey_id IN (SELECT id FROM surveys WHERE organization_id = get_user_org_id()));

CREATE POLICY "survey_approvals_director" ON survey_approvals
  FOR ALL USING (has_role('director'));

-- ============================================================
-- PRODUCTS & BOM POLICIES
-- ============================================================

CREATE POLICY "product_categories_select_org" ON product_categories
  FOR SELECT USING (organization_id = get_user_org_id());

CREATE POLICY "product_categories_manage_wh" ON product_categories
  FOR ALL USING (organization_id = get_user_org_id() AND (has_role('warehouse_manager') OR has_role('director')));

CREATE POLICY "products_select_org" ON products
  FOR SELECT USING (organization_id = get_user_org_id());

CREATE POLICY "products_manage_wh" ON products
  FOR ALL USING (organization_id = get_user_org_id() AND (has_role('warehouse_manager') OR has_role('director')));

CREATE POLICY "product_specs_all" ON product_specifications
  FOR ALL USING (product_id IN (SELECT id FROM products WHERE organization_id = get_user_org_id()));

CREATE POLICY "solar_packages_select_org" ON solar_packages
  FOR SELECT USING (organization_id = get_user_org_id());

CREATE POLICY "solar_packages_manage_sales" ON solar_packages
  FOR ALL USING (organization_id = get_user_org_id() AND (has_role('sales_executive') OR has_role('director')));

CREATE POLICY "package_components_all" ON package_components
  FOR ALL USING (package_id IN (SELECT id FROM solar_packages WHERE organization_id = get_user_org_id()));

CREATE POLICY "solar_configurations_select_org" ON solar_configurations
  FOR SELECT USING (organization_id = get_user_org_id());

CREATE POLICY "solar_configurations_manage_sales" ON solar_configurations
  FOR ALL USING (organization_id = get_user_org_id() AND (has_role('sales_executive') OR has_role('director')));

CREATE POLICY "bom_templates_select_org" ON bom_templates
  FOR SELECT USING (organization_id = get_user_org_id());

CREATE POLICY "bom_templates_manage_sales" ON bom_templates
  FOR ALL USING (organization_id = get_user_org_id() AND (has_role('sales_executive') OR has_role('director')));

CREATE POLICY "bom_rules_all" ON bom_rules
  FOR ALL USING (template_id IN (SELECT id FROM bom_templates WHERE organization_id = get_user_org_id()));

CREATE POLICY "bom_records_select_org" ON bom_records
  FOR SELECT USING (organization_id = get_user_org_id());

CREATE POLICY "bom_records_manage_sales" ON bom_records
  FOR ALL USING (organization_id = get_user_org_id() AND (has_role('sales_executive') OR has_role('director')));

CREATE POLICY "bom_items_all" ON bom_items
  FOR ALL USING (bom_record_id IN (SELECT id FROM bom_records WHERE organization_id = get_user_org_id()));

CREATE POLICY "warranty_policies_select_org" ON warranty_policies
  FOR SELECT USING (organization_id = get_user_org_id());

CREATE POLICY "warranty_policies_manage_wh" ON warranty_policies
  FOR ALL USING (organization_id = get_user_org_id() AND (has_role('warehouse_manager') OR has_role('director')));

-- ============================================================
-- SALES POLICIES
-- ============================================================

CREATE POLICY "quotations_select_org" ON quotations
  FOR SELECT USING (
    organization_id = get_user_org_id() AND (
      has_role('director') OR
      has_role('sales_executive') OR
      has_role('finance_executive')
    )
  );

CREATE POLICY "quotations_manage_sales" ON quotations
  FOR ALL USING (
    organization_id = get_user_org_id() AND (
      has_role('sales_executive') OR has_role('director')
    )
  );

CREATE POLICY "quotation_items_all" ON quotation_items
  FOR ALL USING (quotation_id IN (SELECT id FROM quotations WHERE organization_id = get_user_org_id()));

CREATE POLICY "quotation_versions_all" ON quotation_versions
  FOR ALL USING (quotation_id IN (SELECT id FROM quotations WHERE organization_id = get_user_org_id()));

CREATE POLICY "sales_orders_select_org" ON sales_orders
  FOR SELECT USING (
    organization_id = get_user_org_id() AND (
      has_role('director') OR
      has_role('sales_executive') OR
      has_role('warehouse_manager') OR
      has_role('finance_executive')
    )
  );

CREATE POLICY "sales_orders_manage_sales" ON sales_orders
  FOR ALL USING (
    organization_id = get_user_org_id() AND (
      has_role('sales_executive') OR has_role('director')
    )
  );

CREATE POLICY "sales_order_items_all" ON sales_order_items
  FOR ALL USING (order_id IN (SELECT id FROM sales_orders WHERE organization_id = get_user_org_id()));

CREATE POLICY "payment_milestones_all" ON payment_milestones
  FOR ALL USING (order_id IN (SELECT id FROM sales_orders WHERE organization_id = get_user_org_id()));

CREATE POLICY "payments_select_org" ON payments
  FOR SELECT USING (
    organization_id = get_user_org_id() AND (
      has_role('director') OR
      has_role('finance_executive') OR
      has_role('sales_executive')
    )
  );

CREATE POLICY "payments_manage_finance" ON payments
  FOR ALL USING (
    organization_id = get_user_org_id() AND (
      has_role('finance_executive') OR has_role('director')
    )
  );

CREATE POLICY "payment_allocations_all" ON payment_allocations
  FOR ALL USING (payment_id IN (SELECT id FROM payments WHERE organization_id = get_user_org_id()));

-- ============================================================
-- INVENTORY POLICIES
-- ============================================================

CREATE POLICY "suppliers_select_org" ON suppliers
  FOR SELECT USING (organization_id = get_user_org_id());

CREATE POLICY "suppliers_manage_wh" ON suppliers
  FOR ALL USING (organization_id = get_user_org_id() AND (has_role('warehouse_manager') OR has_role('director')));

CREATE POLICY "purchase_orders_select_org" ON purchase_orders
  FOR SELECT USING (
    organization_id = get_user_org_id() AND (
      has_role('director') OR
      has_role('warehouse_manager') OR
      has_role('finance_executive')
    )
  );

CREATE POLICY "purchase_orders_manage_wh" ON purchase_orders
  FOR ALL USING (organization_id = get_user_org_id() AND (has_role('warehouse_manager') OR has_role('director')));

CREATE POLICY "purchase_order_items_all" ON purchase_order_items
  FOR ALL USING (purchase_order_id IN (SELECT id FROM purchase_orders WHERE organization_id = get_user_org_id()));

CREATE POLICY "warehouse_locations_select_org" ON warehouse_locations
  FOR SELECT USING (organization_id = get_user_org_id());

CREATE POLICY "warehouse_locations_manage_wh" ON warehouse_locations
  FOR ALL USING (organization_id = get_user_org_id() AND (has_role('warehouse_manager') OR has_role('director')));

CREATE POLICY "stock_movements_select_org" ON stock_movements
  FOR SELECT USING (
    organization_id = get_user_org_id() AND (
      has_role('director') OR
      has_role('warehouse_manager')
    )
  );

CREATE POLICY "stock_movements_manage_wh" ON stock_movements
  FOR INSERT WITH CHECK (
    organization_id = get_user_org_id() AND (
      has_role('warehouse_manager') OR has_role('director')
    )
  );

CREATE POLICY "stock_reservations_select_org" ON stock_reservations
  FOR SELECT USING (
    organization_id = get_user_org_id() AND (
      has_role('director') OR
      has_role('warehouse_manager') OR
      has_role('sales_executive')
    )
  );

CREATE POLICY "stock_reservations_manage_wh" ON stock_reservations
  FOR ALL USING (organization_id = get_user_org_id() AND (has_role('warehouse_manager') OR has_role('director')));

CREATE POLICY "inventory_adjustments_select_org" ON inventory_adjustments
  FOR SELECT USING (
    organization_id = get_user_org_id() AND (
      has_role('director') OR
      has_role('warehouse_manager')
    )
  );

CREATE POLICY "inventory_adjustments_manage_wh" ON inventory_adjustments
  FOR INSERT WITH CHECK (
    organization_id = get_user_org_id() AND (
      has_role('warehouse_manager') OR has_role('director')
    )
  );

CREATE POLICY "serial_units_select_org" ON serial_units
  FOR SELECT USING (
    organization_id = get_user_org_id() AND (
      has_role('director') OR
      has_role('warehouse_manager') OR
      has_role('support_executive') OR
      (customer_id IN (SELECT id FROM customers WHERE id = auth.uid()))
    )
  );

CREATE POLICY "serial_units_manage_wh" ON serial_units
  FOR ALL USING (organization_id = get_user_org_id() AND (has_role('warehouse_manager') OR has_role('director')));

CREATE POLICY "dispatches_select_org" ON dispatches
  FOR SELECT USING (
    organization_id = get_user_org_id() AND (
      has_role('director') OR
      has_role('warehouse_manager') OR
      has_role('sales_executive')
    )
  );

CREATE POLICY "dispatches_manage_wh" ON dispatches
  FOR ALL USING (organization_id = get_user_org_id() AND (has_role('warehouse_manager') OR has_role('director')));

CREATE POLICY "dispatch_items_all" ON dispatch_items
  FOR ALL USING (dispatch_id IN (SELECT id FROM dispatches WHERE organization_id = get_user_org_id()));

-- ============================================================
-- INSTALLATION POLICIES
-- ============================================================

CREATE POLICY "technicians_select_org" ON technicians
  FOR SELECT USING (organization_id = get_user_org_id());

CREATE POLICY "technicians_manage_director" ON technicians
  FOR ALL USING (organization_id = get_user_org_id() AND has_role('director'));

CREATE POLICY "technician_skills_all" ON technician_skills
  FOR ALL USING (technician_id IN (SELECT id FROM technicians WHERE organization_id = get_user_org_id()));

CREATE POLICY "technician_availability_all" ON technician_availability
  FOR ALL USING (technician_id IN (SELECT id FROM technicians WHERE organization_id = get_user_org_id()));

CREATE POLICY "installations_select_org" ON installations
  FOR SELECT USING (
    organization_id = get_user_org_id() AND (
      has_role('director') OR
      has_role('installation_technician') OR
      has_role('sales_executive')
    )
  );

CREATE POLICY "installations_manage_tech" ON installations
  FOR ALL USING (
    organization_id = get_user_org_id() AND (
      has_role('director') OR
      has_role('installation_technician')
    )
  );

CREATE POLICY "installation_assignments_all" ON installation_assignments
  FOR ALL USING (installation_id IN (SELECT id FROM installations WHERE organization_id = get_user_org_id()));

CREATE POLICY "installation_checklists_all" ON installation_checklists
  FOR ALL USING (installation_id IN (SELECT id FROM installations WHERE organization_id = get_user_org_id()));

CREATE POLICY "installation_checklist_items_all" ON installation_checklist_items
  FOR ALL USING (checklist_id IN (SELECT id FROM installation_checklists WHERE installation_id IN (SELECT id FROM installations WHERE organization_id = get_user_org_id())));

CREATE POLICY "installation_evidence_all" ON installation_evidence
  FOR ALL USING (installation_id IN (SELECT id FROM installations WHERE organization_id = get_user_org_id()));

CREATE POLICY "installation_tests_all" ON installation_tests
  FOR ALL USING (installation_id IN (SELECT id FROM installations WHERE organization_id = get_user_org_id()));

CREATE POLICY "customer_acceptances_all" ON customer_acceptances
  FOR ALL USING (installation_id IN (SELECT id FROM installations WHERE organization_id = get_user_org_id()));

-- ============================================================
-- WARRANTY & SERVICE POLICIES
-- ============================================================

CREATE POLICY "warranties_select_org" ON warranties
  FOR SELECT USING (
    organization_id = get_user_org_id() AND (
      has_role('director') OR
      has_role('support_executive') OR
      has_role('warehouse_manager') OR
      customer_id = (SELECT id FROM customers WHERE id = auth.uid())
    )
  );

CREATE POLICY "warranties_manage_wh" ON warranties
  FOR ALL USING (organization_id = get_user_org_id() AND (has_role('warehouse_manager') OR has_role('director')));

CREATE POLICY "warranty_claims_select_org" ON warranty_claims
  FOR SELECT USING (
    warranty_id IN (SELECT id FROM warranties WHERE organization_id = get_user_org_id()) AND (
      has_role('director') OR
      has_role('support_executive')
    )
  );

CREATE POLICY "service_tickets_select_org" ON service_tickets
  FOR SELECT USING (
    organization_id = get_user_org_id() AND (
      has_role('director') OR
      has_role('support_executive') OR
      assigned_to = auth.uid() OR
      customer_id = (SELECT id FROM customers WHERE id = auth.uid())
    )
  );

CREATE POLICY "service_tickets_manage_support" ON service_tickets
  FOR ALL USING (
    organization_id = get_user_org_id() AND (
      has_role('support_executive') OR has_role('director')
    )
  );

CREATE POLICY "service_tickets_assign_tech" ON service_tickets
  FOR UPDATE USING (
    organization_id = get_user_org_id() AND (
      has_role('support_executive') OR has_role('director') OR assigned_to = auth.uid()
    )
  );

CREATE POLICY "service_assignments_all" ON service_assignments
  FOR ALL USING (ticket_id IN (SELECT id FROM service_tickets WHERE organization_id = get_user_org_id()));

CREATE POLICY "service_updates_all" ON service_updates
  FOR ALL USING (ticket_id IN (SELECT id FROM service_tickets WHERE organization_id = get_user_org_id()));

CREATE POLICY "repair_records_select_org" ON repair_records
  FOR SELECT USING (
    ticket_id IN (SELECT id FROM service_tickets WHERE organization_id = get_user_org_id()) AND (
      has_role('director') OR
      has_role('support_executive')
    )
  );

CREATE POLICY "repair_records_manage_support" ON repair_records
  FOR ALL USING (
    ticket_id IN (SELECT id FROM service_tickets WHERE organization_id = get_user_org_id()) AND (
      has_role('support_executive') OR has_role('director')
    )
  );

CREATE POLICY "repair_parts_all" ON repair_parts
  FOR ALL USING (repair_id IN (SELECT id FROM repair_records WHERE ticket_id IN (SELECT id FROM service_tickets WHERE organization_id = get_user_org_id())));

CREATE POLICY "replacement_records_all" ON replacement_records
  FOR ALL USING (ticket_id IN (SELECT id FROM service_tickets WHERE organization_id = get_user_org_id()));

-- ============================================================
-- FINANCE & SUBSIDY POLICIES
-- ============================================================

CREATE POLICY "invoices_select_org" ON invoices
  FOR SELECT USING (
    organization_id = get_user_org_id() AND (
      has_role('director') OR
      has_role('finance_executive') OR
      has_role('sales_executive') OR
      customer_id = (SELECT id FROM customers WHERE id = auth.uid())
    )
  );

CREATE POLICY "invoices_manage_finance" ON invoices
  FOR ALL USING (organization_id = get_user_org_id() AND (has_role('finance_executive') OR has_role('director')));

CREATE POLICY "invoice_items_all" ON invoice_items
  FOR ALL USING (invoice_id IN (SELECT id FROM invoices WHERE organization_id = get_user_org_id()));

CREATE POLICY "expense_categories_select_org" ON expense_categories
  FOR SELECT USING (organization_id = get_user_org_id());

CREATE POLICY "expense_categories_manage_finance" ON expense_categories
  FOR ALL USING (organization_id = get_user_org_id() AND (has_role('finance_executive') OR has_role('director')));

CREATE POLICY "expenses_select_org" ON expenses
  FOR SELECT USING (
    organization_id = get_user_org_id() AND (
      has_role('director') OR
      has_role('finance_executive')
    )
  );

CREATE POLICY "expenses_manage_finance" ON expenses
  FOR ALL USING (organization_id = get_user_org_id() AND (has_role('finance_executive') OR has_role('director')));

CREATE POLICY "vendor_bills_select_org" ON vendor_bills
  FOR SELECT USING (
    organization_id = get_user_org_id() AND (
      has_role('director') OR
      has_role('finance_executive') OR
      has_role('warehouse_manager')
    )
  );

CREATE POLICY "vendor_bills_manage_finance" ON vendor_bills
  FOR ALL USING (organization_id = get_user_org_id() AND (has_role('finance_executive') OR has_role('director')));

CREATE POLICY "vendor_bill_items_all" ON vendor_bill_items
  FOR ALL USING (vendor_bill_id IN (SELECT id FROM vendor_bills WHERE organization_id = get_user_org_id()));

CREATE POLICY "technician_payables_select_org" ON technician_payables
  FOR SELECT USING (
    organization_id = get_user_org_id() AND (
      has_role('director') OR
      has_role('finance_executive') OR
      technician_id = (SELECT id FROM technicians WHERE profile_id = auth.uid())
    )
  );

CREATE POLICY "technician_payables_manage_finance" ON technician_payables
  FOR ALL USING (organization_id = get_user_org_id() AND (has_role('finance_executive') OR has_role('director')));

CREATE POLICY "technician_payments_all" ON technician_payments
  FOR ALL USING (payable_id IN (SELECT id FROM technician_payables WHERE organization_id = get_user_org_id()));

CREATE POLICY "job_costs_select_org" ON job_costs
  FOR SELECT USING (
    organization_id = get_user_org_id() AND (
      has_role('director') OR
      has_role('finance_executive')
    )
  );

CREATE POLICY "job_costs_manage_finance" ON job_costs
  FOR ALL USING (organization_id = get_user_org_id() AND (has_role('finance_executive') OR has_role('director')));

CREATE POLICY "subsidy_applications_select_org" ON subsidy_applications
  FOR SELECT USING (
    organization_id = get_user_org_id() AND (
      has_role('director') OR
      has_role('finance_executive')
    )
  );

CREATE POLICY "subsidy_applications_manage_finance" ON subsidy_applications
  FOR ALL USING (organization_id = get_user_org_id() AND (has_role('finance_executive') OR has_role('director')));

CREATE POLICY "subsidy_documents_all" ON subsidy_documents
  FOR ALL USING (application_id IN (SELECT id FROM subsidy_applications WHERE organization_id = get_user_org_id()));

CREATE POLICY "subsidy_status_history_all" ON subsidy_status_history
  FOR ALL USING (application_id IN (SELECT id FROM subsidy_applications WHERE organization_id = get_user_org_id()));

-- ============================================================
-- SHARED POLICIES
-- ============================================================

CREATE POLICY "notifications_select_own" ON notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "notifications_insert_system" ON notifications
  FOR INSERT WITH CHECK (organization_id = get_user_org_id());

CREATE POLICY "notification_preferences_select_own" ON notification_preferences
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "notification_preferences_manage_own" ON notification_preferences
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "audit_logs_select_org" ON audit_logs
  FOR SELECT USING (organization_id = get_user_org_id() AND has_role('director'));

CREATE POLICY "audit_logs_insert_system" ON audit_logs
  FOR INSERT WITH CHECK (organization_id = get_user_org_id());

CREATE POLICY "activity_logs_select_org" ON activity_logs
  FOR SELECT USING (organization_id = get_user_org_id() AND has_role('director'));

CREATE POLICY "activity_logs_insert_system" ON activity_logs
  FOR INSERT WITH CHECK (organization_id = get_user_org_id());

CREATE POLICY "application_settings_select_org" ON application_settings
  FOR SELECT USING (organization_id = get_user_org_id() AND (has_role('director') OR is_public));

CREATE POLICY "application_settings_manage_director" ON application_settings
  FOR ALL USING (organization_id = get_user_org_id() AND has_role('director'));

CREATE POLICY "document_metadata_select_org" ON document_metadata
  FOR SELECT USING (organization_id = get_user_org_id());

CREATE POLICY "document_metadata_insert_org" ON document_metadata
  FOR INSERT WITH CHECK (organization_id = get_user_org_id());

CREATE POLICY "integration_settings_select_director" ON integration_settings
  FOR SELECT USING (organization_id = get_user_org_id() AND has_role('director'));

CREATE POLICY "integration_settings_manage_director" ON integration_settings
  FOR ALL USING (organization_id = get_user_org_id() AND has_role('director'));