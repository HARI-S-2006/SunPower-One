import { supabase } from '@/lib/supabase/client'
import type { Database } from '@/types/database'

type Tables = Database['public']['Tables']

// ============================================================
// GENERIC API HELPERS
// ============================================================

export async function fetchList<T>(
  table: string,
  options: {
    select?: string
    filter?: Record<string, unknown>
    orderBy?: { column: string; ascending?: boolean }
    limit?: number
    offset?: number
  } = {}
): Promise<{ data: T[] | null; error: Error | null; count: number | null }> {
  let query = supabase.from(table).select(options.select || '*', { count: 'exact' })
  
  if (options.filter) {
    Object.entries(options.filter).forEach(([key, value]) => {
      query = query.eq(key, value)
    })
  }
  
  if (options.orderBy) {
    query = query.order(options.orderBy.column, { ascending: options.orderBy.ascending ?? false })
  }
  
  if (options.limit) {
    query = query.limit(options.limit)
  }
  
  if (options.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 20) - 1)
  }
  
  const { data, error, count } = await query
  
  return {
    data: data as T[] | null,
    error: error ? new Error(error.message) : null,
    count
  }
}

export async function fetchOne<T>(
  table: string,
  id: string,
  select?: string
): Promise<{ data: T | null; error: Error | null }> {
  const { data, error } = await supabase
    .from(table)
    .select(select || '*')
    .eq('id', id)
    .single()
  
  return {
    data: data as T | null,
    error: error ? new Error(error.message) : null
  }
}

export async function createRecord<T extends Record<string, unknown>>(
  table: string,
  record: T
): Promise<{ data: T | null; error: Error | null }> {
  const { data, error } = await supabase
    .from(table)
    .insert(record)
    .select()
    .single()
  
  return {
    data: data as T | null,
    error: error ? new Error(error.message) : null
  }
}

export async function updateRecord<T extends Record<string, unknown>>(
  table: string,
  id: string,
  updates: Partial<T>
): Promise<{ data: T | null; error: Error | null }> {
  const { data, error } = await supabase
    .from(table)
    .update(updates as Record<string, unknown>)
    .eq('id', id)
    .select()
    .single()
  
  return {
    data: data as T | null,
    error: error ? new Error(error.message) : null
  }
}

export async function deleteRecord(
  table: string,
  id: string
): Promise<{ error: Error | null }> {
  const { error } = await supabase
    .from(table)
    .delete()
    .eq('id', id)
  
  return {
    error: error ? new Error(error.message) : null
  }
}

// ============================================================
// RPC FUNCTIONS
// ============================================================

export async function rpc<Args extends Record<string, unknown>, Return>(
  functionName: string,
  args: Args
): Promise<{ data: Return | null; error: Error | null }> {
  const { data, error } = await supabase.rpc(functionName, args)
  
  return {
    data: data as Return | null,
    error: error ? new Error(error.message) : null
  }
}

// ============================================================
// SPECIFIC API FUNCTIONS
// ============================================================

// Customers
export const customersApi = {
  list: (options?: Parameters<typeof fetchList>[1]) => 
    fetchList('customers', { 
      orderBy: { column: 'created_at', ascending: false },
      ...options 
    }),
  get: (id: string) => fetchOne('customers', id),
  create: (data: Tables['customers']['Insert']) => createRecord('customers', data),
  update: (id: string, data: Tables['customers']['Update']) => updateRecord('customers', id, data),
  findOrCreate: (args: {
    org_id: string
    name: string
    phone: string
    email?: string
    address?: string
    city?: string
    state?: string
    pincode?: string
    type?: string
    created_by: string
  }) => rpc('find_or_create_customer', args),
}

// Leads
export const leadsApi = {
  list: (options?: Parameters<typeof fetchList>[1]) => 
    fetchList('leads', { 
      orderBy: { column: 'created_at', ascending: false },
      ...options 
    }),
  get: (id: string) => fetchOne('leads', id, `
    *,
    customer:customers(*),
    source:lead_sources(*),
    assigned:profiles!leads_assigned_to_fkey(*)
  `),
  create: (data: Tables['leads']['Insert']) => createRecord('leads', data),
  update: (id: string, data: Tables['leads']['Update']) => updateRecord('leads', id, data),
  createFromEnquiry: (args: {
    org_id: string
    name: string
    phone: string
    email: string
    address: string
    city: string
    state: string
    pincode: string
    capacity_kw: number
    system_type: string
    monthly_bill: number
    rooftop_area: number
    grid_suitability: string
    additional_requirements: string
    source_id: string
    created_by: string
  }) => rpc('create_lead_from_enquiry', args),
}

// Lead Activities
export const leadActivitiesApi = {
  list: (leadId: string) => fetchList('lead_activities', {
    filter: { lead_id: leadId },
    orderBy: { column: 'created_at', ascending: false }
  }),
  create: (data: Tables['lead_activities']['Insert']) => createRecord('lead_activities', data),
}

// Follow-ups
export const followUpsApi = {
  list: (leadId: string) => fetchList('follow_ups', {
    filter: { lead_id: leadId },
    orderBy: { column: 'due_date', ascending: true }
  }),
  create: (data: Tables['follow_ups']['Insert']) => createRecord('follow_ups', data),
  update: (id: string, data: Tables['follow_ups']['Update']) => updateRecord('follow_ups', id, data),
}

// Surveys
export const surveysApi = {
  list: (options?: Parameters<typeof fetchList>[1]) => 
    fetchList('surveys', { 
      orderBy: { column: 'scheduled_at', ascending: true },
      ...options 
    }),
  get: (id: string) => fetchOne('surveys', id, `
    *,
    request:survey_requests(*),
    technician:profiles!surveys_technician_id_fkey(*),
    measurements:survey_measurements(*),
    photos:survey_photos(*),
    approval:survey_approvals(*)
  `),
  create: (data: Tables['surveys']['Insert']) => createRecord('surveys', data),
  update: (id: string, data: Tables['surveys']['Update']) => updateRecord('surveys', id, data),
}

// Products
export const productsApi = {
  list: (options?: Parameters<typeof fetchList>[1]) => 
    fetchList('products', { 
      orderBy: { column: 'name', ascending: true },
      ...options 
    }),
  get: (id: string) => fetchOne('products', id, `
    *,
    category:product_categories(*),
    specifications:product_specifications(*),
    warranty_policy:warranty_policies(*)
  `),
  create: (data: Tables['products']['Insert']) => createRecord('products', data),
  update: (id: string, data: Tables['products']['Update']) => updateRecord('products', id, data),
}

// Solar Packages
export const packagesApi = {
  list: (options?: Parameters<typeof fetchList>[1]) => 
    fetchList('solar_packages', { 
      orderBy: { column: 'capacity_kw', ascending: true },
      ...options 
    }),
  get: (id: string) => fetchOne('solar_packages', id, `
    *,
    components:package_components(
      *,
      product:products(*)
    )
  `),
  create: (data: Tables['solar_packages']['Insert']) => createRecord('solar_packages', data),
}

// BOM
export const bomApi = {
  calculate: (args: {
    bom_record_id: string
    capacity_kw: number
    system_type: string
  }) => rpc('calculate_bom_from_template', args),
  getRecord: (id: string) => fetchOne('bom_records', id, `
    *,
    items:bom_items(*, product:products(*))
  `),
  listRecords: (options?: Parameters<typeof fetchList>[1]) => 
    fetchList('bom_records', { ...options }),
}

// Quotations
export const quotationsApi = {
  list: (options?: Parameters<typeof fetchList>[1]) => 
    fetchList('quotations', { 
      orderBy: { column: 'created_at', ascending: false },
      ...options 
    }),
  get: (id: string) => fetchOne('quotations', id, `
    *,
    lead:leads(*, customer:customers(*)),
    configuration:solar_configurations(*),
    items:quotation_items(*, product:products(*))
  `),
  create: (data: Tables['quotations']['Insert']) => createRecord('quotations', data),
  update: (id: string, data: Tables['quotations']['Update']) => updateRecord('quotations', id, data),
}

// Sales Orders
export const ordersApi = {
  list: (options?: Parameters<typeof fetchList>[1]) => 
    fetchList('sales_orders', { 
      orderBy: { column: 'created_at', ascending: false },
      ...options 
    }),
  get: (id: string) => fetchOne('sales_orders', id, `
    *,
    customer:customers(*),
    quotation:quotations(*),
    items:sales_order_items(*, product:products(*)),
    milestones:payment_milestones(*),
    payments:payments(*),
    dispatch:dispatches(*)
  `),
  create: (data: Tables['sales_orders']['Insert']) => createRecord('sales_orders', data),
  update: (id: string, data: Tables['sales_orders']['Update']) => updateRecord('sales_orders', id, data),
  convertFromQuotation: (args: { quotation_id: string; created_by: string }) => 
    rpc('convert_quotation_to_order', args),
  reserveStock: (args: { order_id: string; created_by: string }) => 
    rpc('reserve_stock_for_order', args),
  releaseStock: (args: { order_id: string }) => 
    rpc('release_stock_reservation', args),
}

// Payments
export const paymentsApi = {
  list: (options?: Parameters<typeof fetchList>[1]) => 
    fetchList('payments', { 
      orderBy: { column: 'paid_at', ascending: false },
      ...options 
    }),
  create: (data: Tables['payments']['Insert']) => createRecord('payments', data),
}

// Inventory
export const inventoryApi = {
  stockMovements: (options?: Parameters<typeof fetchList>[1]) => 
    fetchList('stock_movements', { 
      orderBy: { column: 'created_at', ascending: false },
      ...options 
    }),
  reservations: (options?: Parameters<typeof fetchList>[1]) => 
    fetchList('stock_reservations', { ...options }),
  serialUnits: (options?: Parameters<typeof fetchList>[1]) => 
    fetchList('serial_units', { ...options }),
  dispatchSerials: (args: {
    dispatch_id: string
    serial_numbers: string[]
    scanned_by: string
  }) => rpc('dispatch_serial_units', args),
  activateWarranty: (args: { dispatch_id: string }) => 
    rpc('activate_warranty_on_delivery', args),
}

// Installations
export const installationsApi = {
  list: (options?: Parameters<typeof fetchList>[1]) => 
    fetchList('installations', { 
      orderBy: { column: 'scheduled_start', ascending: true },
      ...options 
    }),
  get: (id: string) => fetchOne('installations', id, `
    *,
    customer:customers(*),
    order:sales_orders(*),
    assignments:installation_assignments(*, technician:technicians(*)),
    checklist:installation_checklists(*, items:installation_checklist_items(*)),
    evidence:installation_evidence(*),
    tests:installation_tests(*),
    acceptance:customer_acceptances(*)
  `),
  create: (data: Tables['installations']['Insert']) => createRecord('installations', data),
  update: (id: string, data: Tables['installations']['Update']) => updateRecord('installations', id, data),
  validateCompletion: (args: { installation_id: string }) => 
    rpc('validate_installation_completion', args),
}

// Warranties
export const warrantiesApi = {
  list: (options?: Parameters<typeof fetchList>[1]) => 
    fetchList('warranties', { 
      orderBy: { column: 'started_at', ascending: false },
      ...options 
    }),
  checkCoverage: (args: {
    serial_unit_id: string
    fault_code?: string
    failure_type?: string
  }) => rpc('check_warranty_coverage', args),
}

// Service Tickets
export const serviceTicketsApi = {
  list: (options?: Parameters<typeof fetchList>[1]) => 
    fetchList('service_tickets', { 
      orderBy: { column: 'created_at', ascending: false },
      ...options 
    }),
  get: (id: string) => fetchOne('service_tickets', id, `
    *,
    customer:customers(*),
    serial_unit:serial_units(*),
    warranty:warranties(*),
    assigned:profiles!service_tickets_assigned_to_fkey(*),
    updates:service_updates(*),
    repair:repair_records(*, parts:repair_parts(*, product:products(*))),
    replacement:replacement_records(*, old_serial:serial_units(*), new_serial:serial_units(*))
  `),
  create: (data: Tables['service_tickets']['Insert']) => createRecord('service_tickets', data),
  update: (id: string, data: Tables['service_tickets']['Update']) => updateRecord('service_tickets', id, data),
}

// Finance
export const financeApi = {
  invoices: {
    list: (options?: Parameters<typeof fetchList>[1]) => 
      fetchList('invoices', { 
        orderBy: { column: 'invoice_date', ascending: false },
        ...options 
      }),
    create: (data: Tables['invoices']['Insert']) => createRecord('invoices', data),
  },
  expenses: {
    list: (options?: Parameters<typeof fetchList>[1]) => 
      fetchList('expenses', { 
        orderBy: { column: 'expense_date', ascending: false },
        ...options 
      }),
    create: (data: Tables['expenses']['Insert']) => createRecord('expenses', data),
  },
  technicianPayables: {
    list: (options?: Parameters<typeof fetchList>[1]) => 
      fetchList('technician_payables', { ...options }),
  },
  subsidies: {
    list: (options?: Parameters<typeof fetchList>[1]) => 
      fetchList('subsidy_applications', { 
        orderBy: { column: 'created_at', ascending: false },
        ...options 
      }),
  },
  profitability: () => 
    supabase.from('project_profitability').select('*'),
  stockAvailability: () => 
    supabase.from('stock_availability').select('*'),
}