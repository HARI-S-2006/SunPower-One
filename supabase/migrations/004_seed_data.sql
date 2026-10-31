-- SunPower One - Seed Data for Development & Demo
-- Migration: 004_seed_data.sql
-- Description: Sample data for development and competition demo

-- ============================================================
-- ORGANIZATION & USERS
-- ============================================================

-- Insert demo organization (will be linked to auth users via profiles)
INSERT INTO organizations (id, name, gst_number, address, phone, email, settings) VALUES
('a0000000-0000-0000-0000-000000000001', 'SunPower Solutions', '27AAACS1234A1Z5', '123 Solar Lane, Green City, GC 12345', '+91 1800 123 456', 'info@sunpowerone.com', '{"timezone": "Asia/Kolkata", "currency": "INR"}')
ON CONFLICT DO NOTHING;

-- ============================================================
-- PRODUCT CATEGORIES
-- ============================================================

INSERT INTO product_categories (id, organization_id, name, description, sort_order) VALUES
('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Solar Panels', 'Photovoltaic modules', 1),
('b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'Inverters', 'Grid-tie and hybrid inverters', 2),
('b0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'Batteries', 'Energy storage systems', 3),
('b0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'Mounting Structures', 'Roof and ground mounting systems', 4),
('b0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001', 'Electrical Components', 'Cables, connectors, breakers, earthing', 5),
('b0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000001', 'Monitoring', 'Data loggers and monitoring systems', 6)
ON CONFLICT DO NOTHING;

-- ============================================================
-- PRODUCTS
-- ============================================================

-- Solar Panels
INSERT INTO products (id, organization_id, category_id, product_code, name, description, unit, base_price, cost_price, tax_rate, is_serialized, warranty_months, min_stock_level, reorder_point) VALUES
('c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'SP-500M', '500W Monocrystalline Solar Panel', 'High efficiency mono PERC panel, 21.5% efficiency', 'pcs', 12500, 9500, 18, TRUE, 240, 10, 5),
('c0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'SP-550M', '550W Monocrystalline Solar Panel', 'High efficiency mono PERC panel, 22.0% efficiency', 'pcs', 13500, 10200, 18, TRUE, 240, 10, 5),

-- Inverters
('c0000000-0000-0000-0000-000000000010', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000002', 'INV-3K-GT', '3kW Grid-Tie Inverter', 'Single phase, 98.5% efficiency, WiFi monitoring', 'pcs', 35000, 26000, 18, TRUE, 120, 3, 2),
('c0000000-0000-0000-0000-000000000011', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000002', 'INV-5K-GT', '5kW Grid-Tie Inverter', 'Three phase, 98.7% efficiency, WiFi monitoring', 'pcs', 55000, 41000, 18, TRUE, 120, 3, 2),
('c0000000-0000-0000-0000-000000000012', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000002', 'INV-5K-HY', '5kW Hybrid Inverter', 'Single phase, battery ready, 98.5% efficiency', 'pcs', 65000, 48000, 18, TRUE, 120, 2, 1),

-- Batteries
('c0000000-0000-0000-0000-000000000020', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000003', 'BAT-5KWH', '5kWh LiFePO4 Battery', '51.2V 100Ah, 6000+ cycles, built-in BMS', 'pcs', 45000, 34000, 18, TRUE, 120, 2, 1),
('c0000000-0000-0000-0000-000000000021', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000003', 'BAT-10KWH', '10kWh LiFePO4 Battery', '51.2V 200Ah, 6000+ cycles, built-in BMS', 'pcs', 85000, 64000, 18, TRUE, 120, 2, 1),

-- Mounting Structures
('c0000000-0000-0000-0000-000000000030', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000004', 'MS-RF-1KW', 'Roof Mount Kit 1kW', 'Aluminum rails, clamps, brackets for 2 panels', 'set', 8500, 6200, 18, FALSE, 0, 5, 3),
('c0000000-0000-0000-0000-000000000031', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000004', 'MS-RF-3KW', 'Roof Mount Kit 3kW', 'Aluminum rails, clamps, brackets for 6 panels', 'set', 22000, 16000, 18, FALSE, 0, 5, 3),
('c0000000-0000-0000-0000-000000000032', 'a0000000-0000-0000-0000-000000000004', 'MS-RF-5KW', 'Roof Mount Kit 5kW', 'Aluminum rails, clamps, brackets for 10 panels', 'set', 35000, 25500, 18, FALSE, 0, 3, 2),

-- Electrical Components
('c0000000-0000-0000-0000-000000000040', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000005', 'DC-CABLE-4MM', '4mm² DC Cable (100m)', 'UV resistant, TUV certified', 'roll', 4500, 3200, 18, FALSE, 0, 5, 2),
('c0000000-0000-0000-0000-000000000041', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000005', 'AC-CABLE-6MM', '6mm² AC Cable (100m)', '3-core, armored', 'roll', 6500, 4800, 18, FALSE, 0, 5, 2),
('c0000000-0000-0000-0000-000000000042', 'a0000000-0000-0000-0000-000000000005', 'MC4-CONN', 'MC4 Connector Pair', 'Male + Female, IP68', 'pair', 120, 85, 18, FALSE, 0, 20, 10),
('c0000000-0000-0000-0000-000000000043', 'a0000000-0000-0000-0000-000000000005', 'EARTH-KIT', 'Earthing Kit', 'Copper rod, strip, clamp, pit', 'set', 3500, 2500, 18, FALSE, 0, 10, 5),
('c0000000-0000-0000-0000-000000000044', 'a0000000-0000-0000-0000-000000000005', 'SPD-DC', 'DC Surge Protection Device', 'Type 2, 1000V DC', 'pcs', 2800, 2000, 18, FALSE, 0, 5, 2),
('c0000000-0000-0000-0000-000000000045', 'a0000000-0000-0000-0000-000000000005', 'SPD-AC', 'AC Surge Protection Device', 'Type 2, 320V AC', 'pcs', 3200, 2300, 18, FALSE, 0, 5, 2),
('c0000000-0000-0000-0000-000000000046', 'a0000000-0000-0000-0000-000000000005', 'DCDB-1PH', 'DC Distribution Box 1Ph', 'With fuses, SPD, isolator', 'pcs', 4500, 3200, 18, FALSE, 0, 3, 1),
('c0000000-0000-0000-0000-000000000047', 'a0000000-0000-0000-0000-000000000005', 'ACDB-1PH', 'AC Distribution Box 1Ph', 'With MCB, SPD, isolator', 'pcs', 5500, 4000, 18, FALSE, 0, 3, 1),

-- Monitoring
('c0000000-0000-0000-0000-000000000050', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000006', 'MON-WIFI', 'WiFi Data Logger', 'Real-time monitoring, cloud portal', 'pcs', 3500, 2500, 18, TRUE, 60, 5, 2)
ON CONFLICT DO NOTHING;

-- Product Specifications
INSERT INTO product_specifications (product_id, spec_key, spec_value, unit, display_order) VALUES
('c0000000-0000-0000-0000-000000000001', 'wattage', '500', 'W', 1),
('c0000000-0000-0000-0000-000000000001', 'efficiency', '21.5', '%', 2),
('c0000000-0000-0000-0000-000000000001', 'voltage_vmp', '41.2', 'V', 3),
('c0000000-0000-0000-0000-000000000001', 'current_imp', '12.14', 'A', 4),
('c0000000-0000-0000-0000-000000000002', 'wattage', '550', 'W', 1),
('c0000000-0000-0000-0000-000000000002', 'efficiency', '22.0', '%', 2),
('c0000000-0000-0000-0000-000000000010', 'capacity', '3', 'kW', 1),
('c0000000-0000-0000-0000-000000000010', 'phases', '1', '', 2),
('c0000000-0000-0000-0000-000000000011', 'capacity', '5', 'kW', 1),
('c0000000-0000-0000-0000-000000000011', 'phases', '3', '', 2),
('c0000000-0000-0000-0000-000000000012', 'capacity', '5', 'kW', 1),
('c0000000-0000-0000-0000-000000000012', 'phases', '1', '', 2),
('c0000000-0000-0000-0000-000000000020', 'capacity', '5', 'kWh', 1),
('c0000000-0000-0000-0000-000000000020', 'voltage', '51.2', 'V', 2),
('c0000000-0000-0000-0000-000000000020', 'chemistry', 'LiFePO4', '', 3),
('c0000000-0000-0000-0000-000000000021', 'capacity', '10', 'kWh', 1),
('c0000000-0000-0000-0000-000000000021', 'voltage', '51.2', 'V', 2),
('c0000000-0000-0000-0000-000000000021', 'chemistry', 'LiFePO4', '', 3)
ON CONFLICT DO NOTHING;

-- ============================================================
-- SOLAR PACKAGES
-- ============================================================

INSERT INTO solar_packages (id, organization_id, name, description, capacity_kw, system_type, base_price) VALUES
('d0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'On-Grid 1kW', 'Entry level grid-connected system', 1, 'on-grid', 65000),
('d0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'On-Grid 2kW', 'Small home grid-connected system', 2, 'on-grid', 120000),
('d0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'On-Grid 3kW', 'Standard home grid-connected system', 3, 'on-grid', 170000),
('d0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'On-Grid 5kW', 'Large home/small factory grid-connected system', 5, 'on-grid', 270000),
('d0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001', 'Off-Grid 1kW', 'Entry level battery backup system', 1, 'off-grid', 120000),
('d0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000001', 'Off-Grid 3kW', 'Standard home battery backup system', 3, 'off-grid', 320000),
('d0000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000001', 'Off-Grid 5kW', 'Large home/farm battery backup system', 5, 'off-grid', 500000)
ON CONFLICT DO NOTHING;

-- Package Components
INSERT INTO package_components (package_id, product_id, quantity, is_optional, sort_order) VALUES
-- On-Grid 1kW (2 panels)
('d0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 2, FALSE, 1),
('d0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000010', 1, FALSE, 2),
('d0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000030', 1, FALSE, 3),
('d0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000040', 1, FALSE, 4),
('d0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000042', 2, FALSE, 5),
('d0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000043', 1, FALSE, 6),
('d0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000044', 1, FALSE, 7),
('d0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000046', 1, FALSE, 8),
('d0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000047', 1, FALSE, 9),
('d0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000050', 1, FALSE, 10),

-- On-Grid 3kW (6 panels)
('d0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000001', 6, FALSE, 1),
('d0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000010', 1, FALSE, 2),
('d0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000031', 1, FALSE, 3),
('d0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000040', 1, FALSE, 4),
('d0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000042', 4, FALSE, 5),
('d0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000043', 1, FALSE, 6),
('d0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000044', 1, FALSE, 7),
('d0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000046', 1, FALSE, 8),
('d0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000047', 1, FALSE, 9),
('d0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000050', 1, FALSE, 10),

-- Off-Grid 3kW (6 panels + battery)
('d0000000-0000-0000-0000-000000000006', 'c0000000-0000-0000-0000-000000000001', 6, FALSE, 1),
('d0000000-0000-0000-0000-000000000006', 'c0000000-0000-0000-0000-000000000012', 1, FALSE, 2),
('d0000000-0000-0000-0000-000000000006', 'c0000000-0000-0000-0000-000000000021', 1, FALSE, 3),
('d0000000-0000-0000-0000-000000000006', 'c0000000-0000-0000-0000-000000000031', 1, FALSE, 4),
('d0000000-0000-0000-0000-000000000006', 'c0000000-0000-0000-0000-000000000040', 1, FALSE, 5),
('d0000000-0000-0000-0000-000000000006', 'c0000000-0000-0000-0000-000000000042', 4, FALSE, 6),
('d0000000-0000-0000-0000-000000000006', 'c0000000-0000-0000-0000-000000000043', 1, FALSE, 7),
('d0000000-0000-0000-0000-000000000006', 'c0000000-0000-0000-0000-000000000044', 1, FALSE, 8),
('d0000000-0000-0000-0000-000000000006', 'c0000000-0000-0000-0000-000000000045', 1, FALSE, 9),
('d0000000-0000-0000-0000-000000000006', 'c0000000-0000-0000-0000-000000000046', 1, FALSE, 10),
('d0000000-0000-0000-0000-000000000006', 'c0000000-0000-0000-0000-000000000047', 1, FALSE, 11),
('d0000000-0000-0000-0000-000000000006', 'c0000000-0000-0000-0000-000000000050', 1, FALSE, 12)
ON CONFLICT DO NOTHING;

-- ============================================================
-- BOM TEMPLATES & RULES
-- ============================================================

INSERT INTO bom_templates (id, organization_id, name, description, system_type, capacity_min_kw, capacity_max_kw) VALUES
('e0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'On-Grid Standard', 'Standard BOM for on-grid systems 1-5kW', 'on-grid', 1, 5),
('e0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'Off-Grid Standard', 'Standard BOM for off-grid systems 1-5kW', 'off-grid', 1, 5)
ON CONFLICT DO NOTHING;

-- BOM Rules - Panels (per kW, 500W panels)
INSERT INTO bom_rules (template_id, product_category_id, product_id, calculation_type, formula, conditions, sort_order) VALUES
('e0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', NULL, 'per_kw', '2', '{"system_type": "on-grid"}', 1),
('e0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000001', NULL, 'per_kw', '2', '{"system_type": "off-grid"}', 1),

-- Inverter rules
('e0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000010', 'formula', 'CASE WHEN capacity_kw <= 3 THEN 1 ELSE 0 END', '{"system_type": "on-grid"}', 2),
('e0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000011', 'formula', 'CASE WHEN capacity_kw > 3 THEN 1 ELSE 0 END', '{"system_type": "on-grid"}', 3),
('e0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000012', 'formula', '1', '{"system_type": "off-grid"}', 2),

-- Battery rules (off-grid only)
('e0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000020', 'formula', 'CASE WHEN capacity_kw <= 2 THEN 1 ELSE 0 END', '{"system_type": "off-grid"}', 3),
('e0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000021', 'formula', 'CASE WHEN capacity_kw > 2 THEN 1 ELSE 0 END', '{"system_type": "off-grid"}', 4),

-- Mounting structures
('e0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000030', 'formula', 'CASE WHEN capacity_kw <= 1.5 THEN 1 ELSE 0 END', '{}', 4),
('e0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000031', 'formula', 'CASE WHEN capacity_kw > 1.5 AND capacity_kw <= 4 THEN 1 ELSE 0 END', '{}', 5),
('e0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000032', 'formula', 'CASE WHEN capacity_kw > 4 THEN 1 ELSE 0 END', '{}', 6),

-- DC Cable (per kW)
('e0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000040', 'per_kw', '0.5', '{}', 7),
('e0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000040', 'per_kw', '0.5', '{}', 5),

-- MC4 Connectors (2 per panel)
('e0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000042', 'formula', 'CEIL(capacity_kw * 2 * 2)', '{}', 8),
('e0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000042', 'formula', 'CEIL(capacity_kw * 2 * 2)', '{}', 6),

-- Earthing kit (1 per system)
('e0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000043', 'fixed', '1', '{}', 9),
('e0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000043', 'fixed', '1', '{}', 7),

-- Surge protection
('e0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000044', 'fixed', '1', '{}', 10),
('e0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000045', 'fixed', '1', '{}', 11),
('e0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000044', 'fixed', '1', '{}', 8),
('e0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000045', 'fixed', '1', '{}', 9),

-- Distribution boxes
('e0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000046', 'fixed', '1', '{}', 12),
('e0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000047', 'fixed', '1', '{}', 13),
('e0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000046', 'fixed', '1', '{}', 10),
('e0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000047', 'fixed', '1', '{}', 11),

-- Monitoring
('e0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000006', 'c0000000-0000-0000-0000-000000000050', 'fixed', '1', '{}', 14),
('e0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000006', 'c0000000-0000-0000-0000-000000000050', 'fixed', '1', '{}', 12)
ON CONFLICT DO NOTHING;

-- ============================================================
-- WARRANTY POLICIES
-- ============================================================

INSERT INTO warranty_policies (organization_id, product_id, duration_months, trigger_event, coverage_details) VALUES
('a0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 240, 'delivery_completed', '20-year performance warranty (80% output at year 20), 12-year product warranty'),
('a0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000002', 240, 'delivery_completed', '20-year performance warranty (80% output at year 20), 12-year product warranty'),
('a0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000010', 120, 'delivery_completed', '10-year inverter warranty, 5-year standard + 5-year extended'),
('a0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000011', 120, 'delivery_completed', '10-year inverter warranty, 5-year standard + 5-year extended'),
('a0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000012', 120, 'delivery_completed', '10-year inverter warranty, 5-year standard + 5-year extended'),
('a0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000020', 120, 'delivery_completed', '10-year battery warranty (6000 cycles or 10 years)'),
('a0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000021', 120, 'delivery_completed', '10-year battery warranty (6000 cycles or 10 years)'),
('a0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000050', 60, 'delivery_completed', '5-year monitoring device warranty')
ON CONFLICT DO NOTHING;

-- ============================================================
-- WAREHOUSE LOCATIONS
-- ============================================================

INSERT INTO warehouse_locations (id, organization_id, name, code, address, is_default) VALUES
('f0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Main Warehouse', 'WH-MAIN', '123 Solar Lane, Green City', TRUE)
ON CONFLICT DO NOTHING;

-- ============================================================
-- INITIAL STOCK
-- ============================================================

-- Add initial stock movements
INSERT INTO stock_movements (organization_id, product_id, location_id, movement_type, quantity, unit_cost, reference_type, created_by) 
SELECT 'a0000000-0000-0000-0000-000000000001', p.id, 'f0000000-0000-0000-0000-000000000001', 'in', 
  CASE 
    WHEN p.product_code LIKE 'SP-%' THEN 50
    WHEN p.product_code LIKE 'INV-%' THEN 10
    WHEN p.product_code LIKE 'BAT-%' THEN 5
    WHEN p.product_code LIKE 'MS-%' THEN 15
    ELSE 20
  END,
  p.cost_price, 'initial_stock', NULL
FROM products p
WHERE p.organization_id = 'a0000000-0000-0000-0000-000000000001'
ON CONFLICT DO NOTHING;

-- ============================================================
-- SUPPLIERS
-- ============================================================

INSERT INTO suppliers (id, organization_id, supplier_code, name, contact_person, email, phone, address, gst_number, payment_terms_days) VALUES
('g0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'SUP-001', 'SolarTech Manufacturing', 'Rajesh Kumar', 'rajesh@solartech.in', '+91 98765 43210', 'Industrial Area, Mumbai', '27AABCS5678B1Z2', 30),
('g0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'SUP-002', 'PowerElectronics India', 'Priya Sharma', 'priya@powerelec.in', '+91 98765 43211', 'Electronics City, Bangalore', '29AABCP9012C1Z3', 45),
('g0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'SUP-003', 'GreenEnergy Storage', 'Amit Patel', 'amit@greenenergy.in', '+91 98765 43212', 'GIDC, Gujarat', '24AABCG3456D1Z4', 30)
ON CONFLICT DO NOTHING;

-- ============================================================
-- EXPENSE CATEGORIES
-- ============================================================

INSERT INTO expense_categories (organization_id, name, description) VALUES
('a0000000-0000-0000-0000-000000000001', 'Transport', 'Vehicle fuel, logistics, delivery'),
('a0000000-0000-0000-0000-000000000001', 'Labor', 'Technician wages, contractor payments'),
('a0000000-0000-0000-0000-000000000001', 'Equipment Rental', 'Crane, tools, scaffolding rental'),
('a0000000-0000-0000-0000-000000000001', 'Permits & Fees', 'Government permits, inspection fees'),
('a0000000-0000-0000-0000-000000000001', 'Office', 'Office supplies, utilities, rent'),
('a0000000-0000-0000-0000-000000000001', 'Marketing', 'Advertising, lead generation'),
('a0000000-0000-0000-0000-000000000001', 'Maintenance', 'Vehicle maintenance, tool repairs')
ON CONFLICT DO NOTHING;

-- ============================================================
-- APPLICATION SETTINGS
-- ============================================================

INSERT INTO application_settings (organization_id, key, value, description, is_public) VALUES
('a0000000-0000-0000-0000-000000000001', 'company_name', 'SunPower Solutions', 'Company name for documents', TRUE),
('a0000000-0000-0000-0000-000000000001', 'gst_number', '27AAACS1234A1Z5', 'GST registration number', TRUE),
('a0000000-0000-0000-0000-000000000001', 'default_tax_rate', '18', 'Default GST rate percentage', TRUE),
('a0000000-0000-0000-0000-000000000001', 'quotation_validity_days', '30', 'Default quotation validity in days', TRUE),
('a0000000-0000-0000-0000-000000000001', 'payment_terms_days', '30', 'Default payment terms in days', TRUE),
('a0000000-0000-0000-0000-000000000001', 'low_stock_threshold_days', '7', 'Days before expiry for stock alerts', FALSE),
('a0000000-0000-0000-0000-000000000001', 'warranty_trigger_default', 'delivery_completed', 'Default warranty activation trigger', FALSE),
('a0000000-0000-0000-0000-000000000001', 'installation_checklist_required', 'true', 'Require checklist completion for installation', FALSE)
ON CONFLICT DO NOTHING;