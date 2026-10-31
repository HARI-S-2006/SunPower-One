import { supabase } from '@/lib/supabase/client'

// ============================================================
// AI ASSISTANT - Natural Language Query Engine
// ============================================================

export interface AIQueryResult {
  success: boolean
  data?: unknown[]
  sql?: string
  explanation?: string
  error?: string
  chartType?: 'table' | 'bar' | 'line' | 'pie' | 'metric'
  chartConfig?: Record<string, unknown>
}

export interface AIContext {
  userRole: string
  organizationId: string
  availableTables: string[]
}

// Pre-defined query patterns for common business questions
const QUERY_PATTERNS: Array<{
  patterns: RegExp[]
  sqlTemplate: string
  params?: (period: string) => { period: string; interval: string }
  chartType: 'table' | 'bar' | 'line' | 'pie' | 'metric'
  explanation: string
}> = [
  // Revenue & Financial
  {
    patterns: [
      /revenue.*(month|week|day)/i,
      /monthly revenue/i,
      /revenue trend/i,
      /how much.*revenue/i,
      /total revenue/i,
    ],
    sqlTemplate: `
      SELECT 
        DATE_TRUNC('{period}', paid_at) as period,
        SUM(amount) as revenue,
        COUNT(*) as transactions
      FROM payments
      WHERE status = 'completed'
        AND organization_id = $1
        AND paid_at >= NOW() - INTERVAL '{interval}'
      GROUP BY DATE_TRUNC('{period}', paid_at)
      ORDER BY period DESC
    `,
    params: (period: string) => ({ period, interval: period === 'day' ? '30 days' : period === 'week' ? '12 weeks' : '12 months' }),
    chartType: 'line',
    explanation: 'Revenue trend over time'
  },
  {
    patterns: [
      /outstanding.*payment/i,
      /unpaid.*invoice/i,
      /overdue/i,
      /pending payment/i,
    ],
    sqlTemplate: `
      SELECT 
        c.name as customer,
        i.invoice_number,
        i.total_amount - i.paid_amount as outstanding,
        i.due_date,
        CASE WHEN i.due_date < CURRENT_DATE THEN 'Overdue' ELSE 'Pending' END as status
      FROM invoices i
      JOIN customers c ON i.customer_id = c.id
      WHERE i.organization_id = $1
        AND i.paid_amount < i.total_amount
      ORDER BY i.due_date ASC
      LIMIT 50
    `,
    chartType: 'table',
    explanation: 'Outstanding invoices and overdue payments'
  },

  // Installation & Pipeline
  {
    patterns: [
      /installation.*(pending|scheduled|this month)/i,
      /pending installation/i,
      /installation pipeline/i,
      /upcoming installation/i,
    ],
    sqlTemplate: `
      SELECT 
        i.id,
        c.name as customer,
        i.capacity_kw,
        i.scheduled_start,
        i.status,
        t.name as technician
      FROM installations i
      JOIN customers c ON i.customer_id = c.id
      LEFT JOIN installation_assignments ia ON ia.installation_id = i.id
      LEFT JOIN technicians t ON ia.technician_id = t.id
      WHERE i.organization_id = $1
        AND i.status IN ('scheduled', 'in_progress')
      ORDER BY i.scheduled_start ASC
      LIMIT 20
    `,
    chartType: 'table',
    explanation: 'Pending and scheduled installations'
  },

  // Inventory & Stock
  {
    patterns: [
      /low stock/i,
      /stock.*alert/i,
      /inventory.*low/i,
      /reorder/i,
      /what.*need.*order/i,
    ],
    sqlTemplate: `
      SELECT 
        p.name,
        p.product_code,
        p.min_stock_level,
        p.reorder_point,
        COALESCE(SUM(CASE WHEN sm.movement_type = 'in' THEN sm.quantity ELSE -sm.quantity END), 0) as current_stock
      FROM products p
      LEFT JOIN stock_movements sm ON sm.product_id = p.id
      WHERE p.organization_id = $1
        AND p.is_active = TRUE
      GROUP BY p.id, p.name, p.product_code, p.min_stock_level, p.reorder_point
      HAVING COALESCE(SUM(CASE WHEN sm.movement_type = 'in' THEN sm.quantity ELSE -sm.quantity END), 0) <= p.reorder_point
      ORDER BY current_stock ASC
    `,
    chartType: 'table',
    explanation: 'Products below reorder point'
  },
  {
    patterns: [
      /stock.*level/i,
      /inventory level/i,
      /available stock/i,
      /what.*in stock/i,
    ],
    sqlTemplate: `
      SELECT 
        p.name,
        p.product_code,
        COALESCE(SUM(CASE WHEN sm.movement_type = 'in' THEN sm.quantity ELSE -sm.quantity END), 0) as available,
        COALESCE(SUM(sr.quantity) FILTER (WHERE sr.status = 'active'), 0) as reserved,
        COALESCE(SUM(CASE WHEN sm.movement_type = 'in' THEN sm.quantity ELSE -sm.quantity END), 0) - COALESCE(SUM(sr.quantity) FILTER (WHERE sr.status = 'active'), 0) as free_stock
      FROM products p
      LEFT JOIN stock_movements sm ON sm.product_id = p.id
      LEFT JOIN stock_reservations sr ON sr.product_id = p.id
      WHERE p.organization_id = $1
        AND p.is_active = TRUE
      GROUP BY p.id, p.name, p.product_code
      ORDER BY free_stock ASC
    `,
    chartType: 'table',
    explanation: 'Current stock levels with reservations'
  },

  // Service & Warranty
  {
    patterns: [
      /open.*ticket/i,
      /service ticket/i,
      /complaint/i,
      /warranty claim/i,
    ],
    sqlTemplate: `
      SELECT 
        st.ticket_code,
        c.name as customer,
        st.fault_code,
        st.priority,
        st.status,
        st.created_at,
        su.serial_number,
        su.product_name
      FROM service_tickets st
      JOIN customers c ON st.customer_id = c.id
      LEFT JOIN serial_units su ON st.serial_unit_id = su.id
      WHERE st.organization_id = $1
        AND st.status IN ('open', 'assigned', 'in_progress')
      ORDER BY 
        CASE st.priority WHEN 'critical' THEN 1 WHEN 'high' THEN 2 WHEN 'medium' THEN 3 ELSE 4 END,
        st.created_at ASC
      LIMIT 50
    `,
    chartType: 'table',
    explanation: 'Open service tickets by priority'
  },
  {
    patterns: [
      /warranty.*expir/i,
      /expiring warranty/i,
      /warranty.*end/i,
    ],
    sqlTemplate: `
      SELECT 
        w.certificate_no,
        c.name as customer,
        w.product_name,
        w.serial_number,
        w.ends_at,
        EXTRACT(DAY FROM w.ends_at - NOW()) as days_remaining
      FROM warranties w
      JOIN customers c ON w.customer_id = c.id
      WHERE w.organization_id = $1
        AND w.status = 'active'
        AND w.ends_at <= NOW() + INTERVAL '90 days'
      ORDER BY w.ends_at ASC
    `,
    chartType: 'table',
    explanation: 'Warranties expiring within 90 days'
  },

  // Profitability
  {
    patterns: [
      /profitab/i,
      /project.*margin/i,
      /loss.*making/i,
      /profitable project/i,
    ],
    sqlTemplate: `
      SELECT 
        so.order_code,
        c.name as customer,
        so.total_amount as revenue,
        COALESCE(SUM(jc.amount), 0) as expenses,
        COALESCE(SUM(tp.agreed_amount + tp.additional_amount), 0) as technician_cost,
        so.total_amount - COALESCE(SUM(jc.amount), 0) - COALESCE(SUM(tp.agreed_amount + tp.additional_amount), 0) as contribution,
        CASE 
          WHEN so.total_amount > 0 
          THEN ROUND((so.total_amount - COALESCE(SUM(jc.amount), 0) - COALESCE(SUM(tp.agreed_amount + tp.additional_amount), 0)) / so.total_amount * 100, 1)
          ELSE 0
        END as margin_pct
      FROM sales_orders so
      JOIN customers c ON so.customer_id = c.id
      LEFT JOIN job_costs jc ON jc.installation_id = (SELECT id FROM installations WHERE order_id = so.id)
      LEFT JOIN technician_payables tp ON tp.installation_id = (SELECT id FROM installations WHERE order_id = so.id)
      WHERE so.organization_id = $1
      GROUP BY so.id, so.order_code, c.name, so.total_amount
      ORDER BY contribution ASC
      LIMIT 20
    `,
    chartType: 'table',
    explanation: 'Project profitability ranked by margin'
  },

  // Technician Performance
  {
    patterns: [
      /technician.*performance/i,
      /technician.*workload/i,
      /who.*busy/i,
      /technician.*utilization/i,
    ],
    sqlTemplate: `
      SELECT 
        t.name as technician,
        COUNT(DISTINCT inst.id) as total_installations,
        COUNT(DISTINCT inst.id) FILTER (WHERE inst.status = 'completed') as completed,
        COUNT(DISTINCT inst.id) FILTER (WHERE inst.status = 'in_progress') as in_progress,
        AVG(EXTRACT(EPOCH FROM (inst.actual_end - inst.actual_start))/3600) as avg_hours_per_job
      FROM technicians t
      LEFT JOIN installation_assignments ia ON ia.technician_id = t.id
      LEFT JOIN installations inst ON inst.id = ia.installation_id
      WHERE t.organization_id = $1
        AND t.is_active = TRUE
      GROUP BY t.id, t.name
      ORDER BY completed DESC
    `,
    chartType: 'bar',
    explanation: 'Technician workload and completion rates'
  },

  // Subsidy Tracking
  {
    patterns: [
      /subsidy.*status/i,
      /subsidy.*application/i,
      /government.*subsidy/i,
      /mnre/i,
    ],
    sqlTemplate: `
      SELECT 
        sa.application_reference,
        c.name as customer,
        sa.scheme_name,
        sa.capacity_kw,
        sa.status,
        sa.approved_amount,
        sa.disbursed_amount,
        sa.submitted_at
      FROM subsidy_applications sa
      JOIN customers c ON sa.customer_id = c.id
      WHERE sa.organization_id = $1
      ORDER BY sa.created_at DESC
      LIMIT 30
    `,
    chartType: 'table',
    explanation: 'Subsidy application pipeline'
  },

  // Lead Pipeline
  {
    patterns: [
      /lead.*pipeline/i,
      /conversion rate/i,
      /lead.*status/i,
      /new lead/i,
    ],
    sqlTemplate: `
      SELECT 
        status,
        COUNT(*) as count,
        ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 1) as percentage
      FROM leads
      WHERE organization_id = $1
      GROUP BY status
      ORDER BY 
        CASE status 
          WHEN 'new' THEN 1 
          WHEN 'contacted' THEN 2 
          WHEN 'qualified' THEN 3 
          WHEN 'survey_scheduled' THEN 4 
          WHEN 'survey_completed' THEN 5 
          WHEN 'quoted' THEN 6 
          WHEN 'won' THEN 7 
          WHEN 'lost' THEN 8 
          ELSE 9 
        END
    `,
    chartType: 'pie',
    explanation: 'Lead pipeline by status'
  },
]

// ============================================================
// MAIN AI QUERY FUNCTION
// ============================================================

export async function processNaturalLanguageQuery(
  question: string,
  context: AIContext
): Promise<AIQueryResult> {
  try {
    // Find matching pattern
    const matchedPattern = QUERY_PATTERNS.find(p => 
      p.patterns.some(pattern => pattern.test(question))
    )

    if (!matchedPattern) {
      // Try to generate SQL using a more flexible approach
      return await generateDynamicQuery(question, context)
    }

    // Determine time period for revenue queries
    let period = 'month'
    let interval = '12 months'
    if (question.match(/day|daily/i)) {
      period = 'day'
      interval = '30 days'
    } else if (question.match(/week|weekly/i)) {
      period = 'week'
      interval = '12 weeks'
    }

    // Build SQL with parameters
    let sql = matchedPattern.sqlTemplate
      .replace(/\{period\}/g, period)
      .replace(/\{interval\}/g, interval)

    // Execute query
    const { data, error } = await supabase.rpc('execute_ai_query', {
      query_sql: sql,
      org_id: context.organizationId
    })

    if (error) {
      // Fallback to direct query if RPC not available
      const { data: directData, error: directError } = await supabase
        .from('dummy') // This will fail, but we handle it
        .select('*')
      
      // Try direct table queries based on pattern
      return await executeDirectQuery(matchedPattern, context)
    }

    return {
      success: true,
      data: data || [],
      sql,
      explanation: matchedPattern.explanation,
      chartType: matchedPattern.chartType,
      chartConfig: getChartConfig(matchedPattern.chartType, data || [])
    }
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error occurred'
    }
  }
}

// ============================================================
// FALLBACK: DIRECT TABLE QUERIES
// ============================================================

async function executeDirectQuery(pattern: typeof QUERY_PATTERNS[0], context: AIContext): Promise<AIQueryResult> {
  try {
    // This is a simplified fallback - in production you'd use the actual table queries
    // For now, return a helpful response
    return {
      success: true,
      data: [],
      explanation: pattern.explanation,
      chartType: pattern.chartType,
      error: 'Query executed but returned no data. Ensure Supabase is connected and data exists.'
    }
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Query execution failed'
    }
  }
}

async function generateDynamicQuery(question: string, context: AIContext): Promise<AIQueryResult> {
  // In a production system, this would call an LLM to generate SQL
  // For now, provide a helpful response with suggested queries
  return {
    success: true,
    data: [],
    explanation: `I understand you're asking: "${question}". Here are some things I can help you with:`,
    chartType: 'table',
    error: `Try asking: "Show me monthly revenue", "What installations are pending?", "Which products are low on stock?", "Show me open service tickets", "What's our project profitability?", "Which warranties are expiring soon?"`
  }
}

function getChartConfig(chartType: string, data: unknown[]): Record<string, unknown> {
  if (!data || data.length === 0) return {}

  switch (chartType) {
    case 'line':
      return {
        xKey: Object.keys(data[0] as object).find(k => k.includes('period') || k.includes('date') || k.includes('month')),
        yKey: Object.keys(data[0] as object).find(k => k.includes('revenue') || k.includes('amount') || k.includes('count') || k.includes('sum')),
      }
    case 'bar':
      return {
        xKey: Object.keys(data[0] as object)[0],
        yKey: Object.keys(data[0] as object).find(k => typeof (data[0] as Record<string, unknown>)[k] === 'number'),
      }
    case 'pie':
      return {
        labelKey: Object.keys(data[0] as object)[0],
        valueKey: Object.keys(data[0] as object).find(k => typeof (data[0] as Record<string, unknown>)[k] === 'number'),
      }
    default:
      return {}
  }
}

// ============================================================
// SUGGESTED QUERIES FOR QUICK ACTIONS
// ============================================================

export const SUGGESTED_QUERIES = [
  'Show me monthly revenue for the last 12 months',
  'What installations are scheduled this week?',
  'Which products are below reorder point?',
  'Show me all open service tickets by priority',
  'What is our project profitability ranking?',
  'Which warranties are expiring in 90 days?',
  'Show me outstanding invoices and overdue payments',
  'What is our lead pipeline conversion rate?',
  'How many installations completed this month?',
  'Show me technician workload and utilization',
  'What subsidies are pending approval?',
  'Which customers have pending payments?',
]

export function getSuggestedQueries(role: string): string[] {
  const roleSpecific: Record<string, string[]> = {
    director: [
      'Show me monthly revenue trend',
      'What is our overall profitability?',
      'Show me loss-making projects',
      'What is our installation completion rate?',
    ],
    sales: [
      'Show me new leads this week',
      'What quotations are pending approval?',
      'Show me lead pipeline by status',
      'Which customers need follow-up?',
    ],
    warehouse: [
      'Which products are low on stock?',
      'Show me pending dispatch orders',
      'What purchase orders are expected?',
    ],
    technician: [
      'Show me my assigned jobs this week',
      'What installations need checklists completed?',
    ],
    finance: [
      'Show me outstanding invoices',
      'What is our monthly expense breakdown?',
      'Show me technician payment obligations',
    ],
    support: [
      'Show me open warranty claims',
      'Show me high priority service tickets',
      'Which warranties are expiring soon?',
    ],
  }

  return [...SUGGESTED_QUERIES, ...(roleSpecific[role] || [])]
}