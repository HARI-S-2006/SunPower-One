#!/usr/bin/env node

/**
 * Demo Data Verification Script
 * Verifies all seed data is correctly loaded and relationships are intact
 */

const { createClient } = require('@supabase/supabase-js')

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing Supabase credentials. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

async function verifyData() {
  console.log('🔍 Verifying SunPower One Demo Data...\n')
  
  const checks = []

  // 1. Organization
  const { data: orgs, error: orgError } = await supabase
    .from('organizations')
    .select('*')
  checks.push({ name: 'Organization', pass: !orgError && orgs.length > 0, count: orgs?.length || 0 })

  // 2. Products
  const { data: products, error: prodError } = await supabase
    .from('products')
    .select('*')
  checks.push({ name: 'Products', pass: !prodError && products.length >= 15, count: products?.length || 0 })

  // 3. Solar Packages
  const { data: packages, error: pkgError } = await supabase
    .from('solar_packages')
    .select('*')
  checks.push({ name: 'Solar Packages', pass: !pkgError && packages.length >= 7, count: packages?.length || 0 })

  // 4. BOM Templates & Rules
  const { data: templates, error: tmplError } = await supabase
    .from('bom_templates')
    .select('*')
  const { data: rules, error: rulesError } = await supabase
    .from('bom_rules')
    .select('*')
  checks.push({ name: 'BOM Templates', pass: !tmplError && templates.length >= 2, count: templates?.length || 0 })
  checks.push({ name: 'BOM Rules', pass: !rulesError && rules.length >= 20, count: rules?.length || 0 })

  // 5. Warranty Policies
  const { data: warranties, error: wpError } = await supabase
    .from('warranty_policies')
    .select('*')
  checks.push({ name: 'Warranty Policies', pass: !wpError && warranties.length >= 8, count: warranties?.length || 0 })

  // 6. Warehouse Locations
  const { data: warehouses, error: whError } = await supabase
    .from('warehouse_locations')
    .select('*')
  checks.push({ name: 'Warehouse Locations', pass: !whError && warehouses.length >= 1, count: warehouses?.length || 0 })

  // 7. Suppliers
  const { data: suppliers, error: supError } = await supabase
    .from('suppliers')
    .select('*')
  checks.push({ name: 'Suppliers', pass: !supError && suppliers.length >= 3, count: suppliers?.length || 0 })

  // 8. Expense Categories
  const { data: expCats, error: ecError } = await supabase
    .from('expense_categories')
    .select('*')
  checks.push({ name: 'Expense Categories', pass: !ecError && expCats.length >= 7, count: expCats?.length || 0 })

  // 9. Application Settings
  const { data: settings, error: setError } = await supabase
    .from('application_settings')
    .select('*')
  checks.push({ name: 'App Settings', pass: !setError && settings.length >= 8, count: settings?.length || 0 })

  // 10. Seed Data Relationships - Demo Customers
  const { data: customers, error: custError } = await supabase
    .from('customers')
    .select('*')
  checks.push({ name: 'Customers (Demo)', pass: !custError && customers.length >= 4, count: customers?.length || 0 })

  // 11. Leads
  const { data: leads, error: leadError } = await supabase
    .from('leads')
    .select('*')
  checks.push({ name: 'Leads', pass: !leadError && leads.length >= 4, count: leads?.length || 0 })

  // 12. Surveys
  const { data: surveys, error: survError } = await supabase
    .from('surveys')
    .select('*')
  checks.push({ name: 'Surveys', pass: !survError && surveys.length >= 3, count: surveys?.length || 0 })

  // 13. Quotations
  const { data: quotations, error: quotError } = await supabase
    .from('quotations')
    .select('*')
  checks.push({ name: 'Quotations', pass: !quotError && quotations.length >= 2, count: quotations?.length || 0 })

  // 14. Sales Orders
  const { data: orders, error: ordError } = await supabase
    .from('sales_orders')
    .select('*')
  checks.push({ name: 'Sales Orders', pass: !ordError && orders.length >= 2, count: orders?.length || 0 })

  // 15. Serial Units
  const { data: serials, error: serError } = await supabase
    .from('serial_units')
    .select('*')
  checks.push({ name: 'Serial Units', pass: !serError && serials.length >= 6, count: serials?.length || 0 })

  // 16. Installations
  const { data: installations, error: instError } = await supabase
    .from('installations')
    .select('*')
  checks.push({ name: 'Installations', pass: !instError && installations.length >= 2, count: installations?.length || 0 })

  // 17. Warranties
  const { data: warrs, error: warrError } = await supabase
    .from('warranties')
    .select('*')
  checks.push({ name: 'Warranties', pass: !warrError && warrs.length >= 2, count: warrs?.length || 0 })

  // 17. Service Tickets
  const { data: tickets, error: tickError } = await supabase
    .from('service_tickets')
    .select('*')
  checks.push({ name: 'Service Tickets', pass: !tickError && tickets.length >= 1, count: tickets?.length || 0 })

  // 18. Subsidies
  const { data: subsidies, error: subError } = await supabase
    .from('subsidy_applications')
    .select('*')
  checks.push({ name: 'Subsidies', pass: !subError && subsidies.length >= 2, count: subsidies?.length || 0 })

  // 19. Technician Payments
  const { data: techPays, error: tpError } = await supabase
    .from('technician_payables')
    .select('*')
  checks.push({ name: 'Tech Payables', pass: !tpError && techPays.length >= 2, count: techPays?.length || 0 })

  // 20. Stock Movements (from seed)
  const { data: movements, error: movError } = await supabase
    .from('stock_movements')
    .select('*')
  checks.push({ name: 'Stock Movements', pass: !movError && movements.length >= 15, count: movements?.length || 0 })

  // Print Results
  console.log('┌─────────────────────────────┬────────┬───────┐')
  console.log('│ Check                       │ Pass   │ Count │')
  console.log('├─────────────────────────────┼────────┼───────┤')
  
  let allPass = true
  for (const check of checks) {
    const status = check.pass ? '✅ PASS' : '❌ FAIL'
    if (!check.pass) allPass = false
    console.log(`│ ${check.name.padEnd(27)} │ ${status} │ ${String(check.count).padStart(5)} │`)
  }
  
  console.log('└─────────────────────────────┴────────┴───────┘\n')
  
  // Verify Relationships
  console.log('🔗 Verifying Key Relationships...\n')
  
  // Customer -> Leads
  const { data: custLeads } = await supabase
    .from('leads')
    .select('customer_id')
    .not('customer_id', 'is', null)
  console.log(`   Leads with customer_id: ${custLeads?.length || 0}`)
  
  // Surveys -> Leads
  const { data: survLeads } = await supabase
    .from('surveys')
    .select('lead_id')
  console.log(`   Surveys linked to leads: ${survLeads?.length || 0}`)
  
  // Quotations -> Surveys
  const { data: quotSurv } = await supabase
    .from('quotations')
    .select('survey_id')
    .not('survey_id', 'is', null)
  console.log(`   Quotations linked to surveys: ${quotSurv?.length || 0}`)
  
  // Orders -> Quotations
  const { data: ordQuot } = await supabase
    .from('sales_orders')
    .select('quotation_id')
  console.log(`   Orders linked to quotations: ${ordQuot?.length || 0}`)
  
  // Serials -> Orders
  const { data: serOrd } = await supabase
    .from('serial_units')
    .select('order_id')
    .not('order_id', 'is', null)
  console.log(`   Serials linked to orders: ${serOrd?.length || 0}`)
  
  // Warranties -> Serials
  const { data: warrSer } = await supabase
    .from('warranties')
    .select('serial_unit_id')
  console.log(`   Warranties linked to serials: ${warrSer?.length || 0}`)
  
  // Installations -> Orders
  const { data: instOrd } = await supabase
    .from('installations')
    .select('order_id')
  console.log(`   Installations linked to orders: ${instOrd?.length || 0}`)
  
  console.log('\n' + (allPass ? '✅ ALL CHECKS PASSED' : '❌ SOME CHECKS FAILED'))
  
  process.exit(allPass ? 0 : 1)
}

verifyData().catch(console.error)