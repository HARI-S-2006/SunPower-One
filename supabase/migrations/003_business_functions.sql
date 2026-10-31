-- SunPower One - Database Business Logic Functions
-- Migration: 003_business_functions.sql
-- Description: PostgreSQL functions for critical business logic enforcement

-- ============================================================
-- HELPER FUNCTIONS
-- ============================================================

-- Generate unique codes with prefix
CREATE OR REPLACE FUNCTION generate_code(prefix TEXT, table_name TEXT, code_column TEXT)
RETURNS TEXT AS $$
DECLARE
  new_code TEXT;
  counter INTEGER;
  max_num INTEGER;
BEGIN
  -- Get the max number for this prefix
  EXECUTE format('SELECT COALESCE(MAX(CAST(REPLACE(%I, %L, '''') AS INTEGER)), 0) FROM %I WHERE %I LIKE %L',
    code_column, prefix, table_name, code_column, prefix || '%')
  INTO max_num;
  
  counter := max_num + 1;
  new_code := prefix || LPAD(counter::TEXT, 6, '0');
  
  RETURN new_code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- CUSTOMER DEDUPLICATION
-- ============================================================

-- Find or create customer by phone/email
CREATE OR REPLACE FUNCTION find_or_create_customer(
  p_org_id UUID,
  p_name TEXT,
  p_phone TEXT,
  p_email TEXT DEFAULT NULL,
  p_address TEXT DEFAULT NULL,
  p_city TEXT DEFAULT NULL,
  p_state TEXT DEFAULT NULL,
  p_pincode TEXT DEFAULT NULL,
  p_type TEXT DEFAULT 'residential',
  p_created_by UUID
)
RETURNS UUID AS $$
DECLARE
  v_customer_id UUID;
BEGIN
  -- Try to find existing customer by phone
  SELECT id INTO v_customer_id
  FROM customers
  WHERE organization_id = p_org_id
  AND phone = p_phone
  LIMIT 1;
  
  IF v_customer_id IS NULL AND p_email IS NOT NULL THEN
    -- Try to find by email
    SELECT id INTO v_customer_id
    FROM customers
    WHERE organization_id = p_org_id
    AND email = p_email
    LIMIT 1;
  END IF;
  
  IF v_customer_id IS NULL THEN
    -- Create new customer
    INSERT INTO customers (
      organization_id, customer_code, name, email, phone, type,
      created_by
    ) VALUES (
      p_org_id,
      generate_code('CUST', 'customers', 'customer_code'),
      p_name, p_email, p_phone, p_type,
      p_created_by
    ) RETURNING id INTO v_customer_id;
    
    -- Create primary address if provided
    IF p_address IS NOT NULL THEN
      INSERT INTO customer_addresses (
        customer_id, address_line1, city, state, pincode, is_primary
      ) VALUES (
        v_customer_id, p_address, p_city, p_state, p_pincode, TRUE
      );
    END IF;
  END IF;
  
  RETURN v_customer_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- LEAD MANAGEMENT
-- ============================================================

-- Create lead from enquiry
CREATE OR REPLACE FUNCTION create_lead_from_enquiry(
  p_org_id UUID,
  p_name TEXT,
  p_phone TEXT,
  p_email TEXT,
  p_address TEXT,
  p_city TEXT,
  p_state TEXT,
  p_pincode TEXT,
  p_capacity_kw DECIMAL,
  p_system_type TEXT,
  p_monthly_bill DECIMAL,
  p_rooftop_area DECIMAL,
  p_grid_suitability TEXT,
  p_additional_requirements TEXT,
  p_source_id UUID,
  p_created_by UUID
)
RETURNS UUID AS $$
DECLARE
  v_customer_id UUID;
  v_lead_id UUID;
  v_lead_code TEXT;
BEGIN
  -- Find or create customer
  v_customer_id := find_or_create_customer(
    p_org_id, p_name, p_phone, p_email,
    p_address, p_city, p_state, p_pincode,
    'residential', p_created_by
  );
  
  -- Generate lead code
  v_lead_code := generate_code('LEAD', 'leads', 'lead_code');
  
  -- Create lead
  INSERT INTO leads (
    organization_id, lead_code, customer_id, source_id,
    status, capacity_kw, system_type, monthly_bill,
    rooftop_area, grid_suitability, additional_requirements,
    created_by
  ) VALUES (
    p_org_id, v_lead_code, v_customer_id, p_source_id,
    'new', p_capacity_kw, p_system_type, p_monthly_bill,
    p_rooftop_area, p_grid_suitability, p_additional_requirements,
    p_created_by
  ) RETURNING id INTO v_lead_id;
  
  -- Log activity
  INSERT INTO lead_activities (lead_id, user_id, activity_type, description)
  VALUES (v_lead_id, p_created_by, 'created', 'Lead created from enquiry');
  
  RETURN v_lead_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- QUOTATION VALIDATION (Survey Approval Required)
-- ============================================================

-- Check if survey is approved for a lead
CREATE OR REPLACE FUNCTION is_survey_approved(p_lead_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_approved BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM surveys s
    JOIN survey_approvals sa ON s.id = sa.survey_id
    WHERE s.lead_id = p_lead_id
    AND s.status = 'approved'
    AND sa.status = 'approved'
  ) INTO v_approved;
  
  RETURN COALESCE(v_approved, FALSE);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Prevent quotation approval without survey approval
CREATE OR REPLACE FUNCTION validate_quotation_approval()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'approved' AND OLD.status != 'approved' THEN
    IF NOT is_survey_approved(NEW.lead_id) THEN
      RAISE EXCEPTION 'Cannot approve quotation: Site survey must be approved first. Lead % has no approved survey.', NEW.lead_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER quotation_approval_trigger
  BEFORE UPDATE ON quotations
  FOR EACH ROW
  EXECUTE FUNCTION validate_quotation_approval();

-- ============================================================
-- BOM CALCULATION
-- ============================================================

-- Calculate BOM from template rules
CREATE OR REPLACE FUNCTION calculate_bom_from_template(
  p_bom_record_id UUID,
  p_capacity_kw DECIMAL,
  p_system_type TEXT
)
RETURNS VOID AS $$
DECLARE
  v_rule RECORD;
  v_quantity INTEGER;
  v_unit_price DECIMAL;
  v_total_price DECIMAL;
  v_product_id UUID;
BEGIN
  -- Clear existing BOM items
  DELETE FROM bom_items WHERE bom_record_id = p_bom_record_id;
  
  -- Process each rule
  FOR v_rule IN
    SELECT br.*, p.id as product_id, p.base_price, p.unit
    FROM bom_rules br
    JOIN products p ON (br.product_id = p.id OR (br.product_category_id = p.category_id AND br.product_id IS NULL))
    WHERE br.template_id = (SELECT template_id FROM bom_records WHERE id = p_bom_record_id)
    AND p.is_active = TRUE
    AND p.organization_id = (SELECT organization_id FROM bom_records WHERE id = p_bom_record_id)
  LOOP
    -- Calculate quantity based on rule
    CASE v_rule.calculation_type
      WHEN 'fixed' THEN
        v_quantity := v_rule.formula::INTEGER;
      WHEN 'per_kw' THEN
        v_quantity := CEIL(p_capacity_kw * v_rule.formula::DECIMAL);
      WHEN 'per_panel' THEN
        -- Assume panel wattage from product spec
        v_quantity := CEIL(p_capacity_kw * 1000 / COALESCE((
          SELECT spec_value::INTEGER FROM product_specifications
          WHERE product_id = v_rule.product_id AND spec_key = 'wattage'
        ), 500));
      WHEN 'formula' THEN
        -- Evaluate custom formula (simplified)
        v_quantity := 1; -- Would need safe eval in production
      ELSE
        v_quantity := 1;
    END CASE;
    
    -- Apply conditions
    IF v_rule.conditions ? 'system_type' THEN
      IF v_rule.conditions->>'system_type' != p_system_type THEN
        CONTINUE;
      END IF;
    END IF;
    
    IF v_rule.conditions ? 'min_capacity' THEN
      IF p_capacity_kw < (v_rule.conditions->>'min_capacity')::DECIMAL THEN
        CONTINUE;
      END IF;
    END IF;
    
    v_unit_price := v_rule.product_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM products WHERE id = v_rule.product_id
    ) ? (
      SELECT base_price FROM products WHERE id = v_rule.product_id
    ) : 0;
    
    v_total_price := v_quantity * v_unit_price;
    
    -- Insert BOM item
    INSERT INTO bom_items (
      bom_record_id, product_id, quantity, unit_price, total_price, is_optional
    ) VALUES (
      p_bom_record_id, v_rule.product_id, v_quantity, v_unit_price, v_total_price, v_rule.is_optional
    );
  END LOOP;
  
  -- Update BOM record total
  UPDATE bom_records
  SET total_price = (
    SELECT COALESCE(SUM(total_price), 0) FROM bom_items WHERE bom_record_id = p_bom_record_id
  )
  WHERE id = p_bom_record_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- ORDER CONVERSION (Idempotent)
-- ============================================================

-- Convert quotation to sales order (prevents duplicates)
CREATE OR REPLACE FUNCTION convert_quotation_to_order(
  p_quotation_id UUID,
  p_created_by UUID
)
RETURNS UUID AS $$
DECLARE
  v_order_id UUID;
  v_quotation RECORD;
BEGIN
  -- Get quotation with lock
  SELECT * INTO v_quotation
  FROM quotations
  WHERE id = p_quotation_id
  FOR UPDATE;
  
  -- Check if order already exists
  SELECT id INTO v_order_id
  FROM sales_orders
  WHERE quotation_id = p_quotation_id
  LIMIT 1;
  
  IF v_order_id IS NOT NULL THEN
    RAISE EXCEPTION 'Sales order already exists for quotation %', p_quotation_id;
  END IF;
  
  -- Validate quotation can be converted
  IF v_quotation.status NOT IN ('accepted', 'approved') THEN
    RAISE EXCEPTION 'Quotation must be accepted or approved before converting to order';
  END IF;
  
  -- Check survey approval
  IF NOT is_survey_approved(v_quotation.lead_id) THEN
    RAISE EXCEPTION 'Cannot create order: Site survey not approved';
  END IF;
  
  -- Create order
  INSERT INTO sales_orders (
    organization_id, quotation_id, customer_id, order_code,
    status, order_date, expected_delivery_date, total_amount,
    advance_amount, balance_amount, created_by
  ) VALUES (
    v_quotation.organization_id, p_quotation_id, v_quotation.lead_id,
    generate_code('ORD', 'sales_orders', 'order_code'),
    'confirmed', CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days',
    v_quotation.total_amount, 0, v_quotation.total_amount,
    p_created_by
  ) RETURNING id INTO v_order_id;
  
  -- Copy quotation items to order items
  INSERT INTO sales_order_items (order_id, product_id, quantity, unit_price, tax_rate, total_price)
  SELECT v_order_id, product_id, quantity, unit_price, tax_rate, total_price
  FROM quotation_items
  WHERE quotation_id = p_quotation_id;
  
  -- Create payment milestones (default: 50% advance, 50% on delivery)
  INSERT INTO payment_milestones (order_id, description, amount, due_date, sequence, is_advance)
  VALUES
    (v_order_id, 'Advance Payment (50%)', v_quotation.total_amount * 0.5, CURRENT_DATE + INTERVAL '7 days', 1, TRUE),
    (v_order_id, 'Balance Payment (50%)', v_quotation.total_amount * 0.5, CURRENT_DATE + INTERVAL '30 days', 2, FALSE);
  
  -- Update quotation status
  UPDATE quotations SET status = 'accepted' WHERE id = p_quotation_id;
  
  RETURN v_order_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- STOCK RESERVATION (Concurrency Safe)
-- ============================================================

-- Reserve stock for order (uses advisory lock for concurrency)
CREATE OR REPLACE FUNCTION reserve_stock_for_order(
  p_order_id UUID,
  p_created_by UUID
)
RETURNS BOOLEAN AS $$
DECLARE
  v_item RECORD;
  v_available INTEGER;
  v_reserved INTEGER;
BEGIN
  -- Lock the order
  PERFORM pg_advisory_xact_lock(hashtext(p_order_id::TEXT));
  
  FOR v_item IN
    SELECT soi.product_id, soi.quantity
    FROM sales_order_items soi
    WHERE soi.order_id = p_order_id
  LOOP
    -- Get available stock (excluding reserved)
    SELECT COALESCE(SUM(CASE WHEN sm.movement_type = 'in' THEN sm.quantity ELSE -sm.quantity END), 0)
    - COALESCE(SUM(sr.quantity) FILTER (WHERE sr.status = 'active'), 0)
    INTO v_available
    FROM stock_movements sm
    LEFT JOIN stock_reservations sr ON sr.product_id = sm.product_id
    WHERE sm.product_id = v_item.product_id
    AND sm.organization_id = (SELECT organization_id FROM sales_orders WHERE id = p_order_id);
    
    v_reserved := v_item.quantity;
    
    IF v_available < v_reserved THEN
      RAISE EXCEPTION 'Insufficient stock for product %. Available: %, Required: %', 
        v_item.product_id, v_available, v_reserved;
    END IF;
    
    -- Create reservation
    INSERT INTO stock_reservations (
      organization_id, product_id, order_id, quantity, status
    ) VALUES (
      (SELECT organization_id FROM sales_orders WHERE id = p_order_id),
      v_item.product_id, p_order_id, v_reserved, 'active'
    ) ON CONFLICT DO NOTHING;
  END LOOP;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Release stock reservation
CREATE OR REPLACE FUNCTION release_stock_reservation(
  p_order_id UUID
)
RETURNS VOID AS $$
BEGIN
  UPDATE stock_reservations
  SET status = 'cancelled', updated_at = NOW()
  WHERE order_id = p_order_id AND status = 'active';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- SERIAL DISPATCH VALIDATION
-- ============================================================

-- Validate and dispatch serial units
CREATE OR REPLACE FUNCTION dispatch_serial_units(
  p_dispatch_id UUID,
  p_serial_numbers TEXT[],
  p_scanned_by UUID
)
RETURNS VOID AS $$
DECLARE
  v_serial RECORD;
  v_order_id UUID;
BEGIN
  -- Get dispatch and order
  SELECT order_id INTO v_order_id FROM dispatches WHERE id = p_dispatch_id;
  
  IF v_order_id IS NULL THEN
    RAISE EXCEPTION 'Dispatch % not found', p_dispatch_id;
  END IF;
  
  -- Validate each serial
  FOREACH v_serial IN ARRAY p_serial_numbers LOOP
    -- Check serial exists and belongs to order
    SELECT * INTO v_serial
    FROM serial_units
    WHERE serial_number = v_serial
    AND organization_id = (SELECT organization_id FROM dispatches WHERE id = p_dispatch_id)
    FOR UPDATE;
    
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Serial number % not found or not in organization', v_serial;
    END IF;
    
    IF v_serial.status != 'available' AND v_serial.status != 'reserved' THEN
      RAISE EXCEPTION 'Serial number % is not available (status: %)', v_serial, v_serial.status;
    END IF;
    
    IF v_serial.order_id IS NOT NULL AND v_serial.order_id != v_order_id THEN
      RAISE EXCEPTION 'Serial number % belongs to different order', v_serial;
    END IF;
    
    -- Create dispatch item
    INSERT INTO dispatch_items (dispatch_id, serial_unit_id, scanned_at, scanned_by)
    VALUES (p_dispatch_id, v_serial.id, NOW(), p_scanned_by);
    
    -- Update serial status
    UPDATE serial_units
    SET status = 'dispatched', order_id = v_order_id, updated_at = NOW()
    WHERE id = v_serial.id;
    
    -- Create stock movement
    INSERT INTO stock_movements (
      organization_id, product_id, location_id, movement_type,
      quantity, reference_type, reference_id, created_by
    ) VALUES (
      (SELECT organization_id FROM dispatches WHERE id = p_dispatch_id),
      v_serial.product_id,
      v_serial.location_id,
      'out', 1, 'dispatch', p_dispatch_id, p_scanned_by
    );
  END LOOP;
  
  -- Update dispatch status
  UPDATE dispatches SET status = 'dispatched', dispatched_at = NOW() WHERE id = p_dispatch_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- WARRANTY ACTIVATION ON DELIVERY
-- ============================================================

-- Activate warranty when delivery completed
CREATE OR REPLACE FUNCTION activate_warranty_on_delivery(
  p_dispatch_id UUID
)
RETURNS VOID AS $$
DECLARE
  v_item RECORD;
  v_policy RECORD;
  v_warranty_start TIMESTAMPTZ;
  v_warranty_end TIMESTAMPTZ;
BEGIN
  -- Get delivered serial units
  FOR v_item IN
    SELECT su.*, wp.duration_months, wp.trigger_event
    FROM dispatch_items di
    JOIN serial_units su ON di.serial_unit_id = su.id
    JOIN products p ON su.product_id = p.id
    JOIN warranty_policies wp ON p.id = wp.product_id
    WHERE di.dispatch_id = p_dispatch_id
    AND wp.is_active = TRUE
  LOOP
    -- Determine warranty start based on trigger
    CASE v_item.trigger_event
      WHEN 'delivery_completed' THEN
        v_warranty_start := NOW();
      WHEN 'installation_completed' THEN
        v_warranty_start := NULL; -- Will be set on installation completion
      ELSE
        v_warranty_start := NOW();
    END CASE;
    
    IF v_warranty_start IS NOT NULL THEN
      v_warranty_end := v_warranty_start + (v_item.duration_months || ' months')::INTERVAL;
      
      INSERT INTO warranties (
        organization_id, serial_unit_id, customer_id, policy_id,
        started_at, ends_at, status, activated_by, activation_trigger_event
      ) VALUES (
        (SELECT organization_id FROM dispatches WHERE id = p_dispatch_id),
        v_item.id,
        (SELECT customer_id FROM sales_orders WHERE id = (SELECT order_id FROM dispatches WHERE id = p_dispatch_id)),
        (SELECT id FROM warranty_policies WHERE product_id = v_item.product_id AND is_active = TRUE LIMIT 1),
        v_warranty_start, v_warranty_end, 'active',
        (SELECT delivered_by FROM dispatches WHERE id = p_dispatch_id),
        v_item.trigger_event
      ) ON CONFLICT DO NOTHING;
      
      -- Update serial unit
      UPDATE serial_units
      SET warranty_start = v_warranty_start,
          warranty_end = v_warranty_end,
          warranty_trigger_event = v_item.trigger_event,
          status = 'delivered',
          customer_id = (SELECT customer_id FROM sales_orders WHERE id = (SELECT order_id FROM dispatches WHERE id = p_dispatch_id)),
          updated_at = NOW()
      WHERE id = v_item.id;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on dispatch delivery
CREATE OR REPLACE FUNCTION trigger_warranty_activation()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'delivered' AND OLD.status != 'delivered' THEN
    PERFORM activate_warranty_on_delivery(NEW.id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER dispatch_delivery_trigger
  AFTER UPDATE ON dispatches
  FOR EACH ROW
  EXECUTE FUNCTION trigger_warranty_activation();

-- ============================================================
-- SERVICE COVERAGE VALIDATION
-- ============================================================

-- Check warranty coverage for service ticket
CREATE OR REPLACE FUNCTION check_warranty_coverage(
  p_serial_unit_id UUID,
  p_fault_code TEXT DEFAULT NULL,
  p_failure_type TEXT DEFAULT NULL
)
RETURNS TABLE (
  is_covered BOOLEAN,
  warranty_id UUID,
  coverage_details TEXT,
  exclusion_reason TEXT
) AS $$
DECLARE
  v_warranty RECORD;
  v_policy RECORD;
BEGIN
  -- Get active warranty for serial
  SELECT w.*, wp.coverage_details, wp.exclusions, wp.duration_months
  INTO v_warranty, v_policy
  FROM warranties w
  JOIN warranty_policies wp ON w.policy_id = wp.id
  WHERE w.serial_unit_id = p_serial_unit_id
  AND w.status = 'active'
  AND w.ends_at > NOW()
  LIMIT 1;
  
  IF NOT FOUND THEN
    RETURN QUERY SELECT FALSE, NULL, NULL, 'No active warranty found'::TEXT;
  END IF;
  
  -- Check exclusions
  IF v_policy.exclusions IS NOT NULL AND p_fault_code IS NOT NULL THEN
    IF v_policy.exclusions ILIKE '%' || p_fault_code || '%' THEN
      RETURN QUERY SELECT FALSE, v_warranty.id, v_policy.coverage_details, 
        'Fault code excluded by warranty policy'::TEXT;
    END IF;
  END IF;
  
  RETURN QUERY SELECT TRUE, v_warranty.id, v_policy.coverage_details, NULL::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- INSTALLATION COMPLETION VALIDATION
-- ============================================================

-- Validate installation completion requirements
CREATE OR REPLACE FUNCTION validate_installation_completion(
  p_installation_id UUID
)
RETURNS TABLE (
  is_valid BOOLEAN,
  missing_requirements TEXT[]
) AS $$
DECLARE
  v_missing TEXT[] := ARRAY[]::TEXT[];
  v_checklist_complete BOOLEAN;
  v_tests_passed BOOLEAN;
  v_photos_count INTEGER;
  v_signature_exists BOOLEAN;
  v_generation_confirmed BOOLEAN;
BEGIN
  -- Check mandatory checklist items
  SELECT COUNT(*) = 0 INTO v_checklist_complete
  FROM installation_checklist_items
  WHERE checklist_id = (SELECT id FROM installation_checklists WHERE installation_id = p_installation_id)
  AND is_mandatory = TRUE
  AND is_completed = FALSE;
  
  IF NOT v_checklist_complete THEN
    v_missing := v_missing || 'Mandatory checklist items incomplete';
  END IF;
  
  -- Check tests
  SELECT COUNT(*) = 0 INTO v_tests_passed
  FROM installation_tests
  WHERE installation_id = p_installation_id
  AND status != 'passed';
  
  IF NOT v_tests_passed THEN
    v_missing := v_missing || 'Not all tests passed';
  END IF;
  
  -- Check photos
  SELECT COUNT(*) INTO v_photos_count
  FROM installation_evidence
  WHERE installation_id = p_installation_id
  AND evidence_type = 'photo';
  
  IF v_photos_count = 0 THEN
    v_missing := v_missing || 'No installation photos uploaded';
  END IF;
  
  -- Check customer signature
  SELECT EXISTS(SELECT 1 FROM customer_acceptances WHERE installation_id = p_installation_id)
  INTO v_signature_exists;
  
  IF NOT v_signature_exists THEN
    v_missing := v_missing || 'Customer signature missing';
  END IF;
  
  -- Check generation confirmation
  SELECT generation_confirmed INTO v_generation_confirmed
  FROM installations WHERE id = p_installation_id;
  
  IF NOT v_generation_confirmed THEN
    v_missing := v_missing || 'Power generation not confirmed';
  END IF;
  
  RETURN QUERY SELECT 
    CASE WHEN array_length(v_missing, 1) IS NULL THEN TRUE ELSE FALSE END,
    v_missing;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- CUSTOMER TICKET CLOSURE
-- ============================================================

-- Prevent ticket closure without customer confirmation
CREATE OR REPLACE FUNCTION validate_ticket_closure()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'closed' AND OLD.status != 'closed' THEN
    IF NOT NEW.customer_confirmed THEN
      RAISE EXCEPTION 'Cannot close ticket: Customer confirmation required';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER ticket_closure_trigger
  BEFORE UPDATE ON service_tickets
  FOR EACH ROW
  EXECUTE FUNCTION validate_ticket_closure();

-- ============================================================
-- FINANCIAL AGGREGATION VIEWS
-- ============================================================

-- Project profitability view
CREATE OR REPLACE VIEW project_profitability AS
SELECT 
  so.id as order_id,
  so.order_code,
  c.name as customer_name,
  so.total_amount as quoted_amount,
  so.total_amount as confirmed_amount,
  COALESCE(SUM(p.amount) FILTER (WHERE p.status = 'completed'), 0) as payment_collected,
  so.total_amount - COALESCE(SUM(p.amount) FILTER (WHERE p.status = 'completed'), 0) as outstanding_balance,
  COALESCE(SUM(jc.amount), 0) as actual_expenses,
  COALESCE(SUM(tp.agreed_amount + tp.additional_amount), 0) as technician_payable,
  so.total_amount - COALESCE(SUM(jc.amount), 0) - COALESCE(SUM(tp.agreed_amount + tp.additional_amount), 0) as contribution_margin
FROM sales_orders so
JOIN customers c ON so.customer_id = c.id
LEFT JOIN payments p ON p.order_id = so.id
LEFT JOIN job_costs jc ON jc.installation_id = (SELECT id FROM installations WHERE order_id = so.id)
LEFT JOIN technician_payables tp ON tp.installation_id = (SELECT id FROM installations WHERE order_id = so.id)
GROUP BY so.id, so.order_code, c.name, so.total_amount;

-- Stock availability view
CREATE OR REPLACE VIEW stock_availability AS
SELECT 
  p.id as product_id,
  p.name,
  p.product_code,
  p.is_serialized,
  wl.name as location,
  COALESCE(SUM(CASE WHEN sm.movement_type = 'in' THEN sm.quantity ELSE -sm.quantity END), 0) as total_stock,
  COALESCE(SUM(sr.quantity) FILTER (WHERE sr.status = 'active'), 0) as reserved_stock,
  COALESCE(SUM(CASE WHEN sm.movement_type = 'in' THEN sm.quantity ELSE -sm.quantity END), 0) 
    - COALESCE(SUM(sr.quantity) FILTER (WHERE sr.status = 'active'), 0) as available_stock,
  p.min_stock_level,
  p.reorder_point
FROM products p
JOIN warehouse_locations wl ON wl.organization_id = p.organization_id
LEFT JOIN stock_movements sm ON sm.product_id = p.id AND sm.location_id = wl.id
LEFT JOIN stock_reservations sr ON sr.product_id = p.id AND sr.location_id = wl.id AND sr.status = 'active'
WHERE p.is_active = TRUE
GROUP BY p.id, p.name, p.product_code, p.is_serialized, wl.name, p.min_stock_level, p.reorder_point;

-- Grant permissions on views
GRANT SELECT ON project_profitability TO authenticated;
GRANT SELECT ON stock_availability TO authenticated;