import { Badge } from './badge'

export type BusinessStatus =
  // CRM / Leads
  | 'new'
  | 'contacted'
  | 'survey_scheduled'
  | 'survey_completed'
  | 'quoted'
  | 'won'
  | 'lost'
  // Survey
  | 'pending_schedule'
  | 'scheduled'
  | 'in_progress'
  | 'pending_approval'
  | 'approved'
  | 'rejected'
  // Quotations / Orders
  | 'draft'
  | 'pending_survey_approval'
  | 'issued'
  | 'accepted'
  | 'confirmed'
  | 'partially_paid'
  | 'paid'
  // Inventory / Dispatch
  | 'in_stock'
  | 'reserved'
  | 'dispatched'
  | 'delivered'
  | 'defective'
  // Installation
  | 'assigned'
  | 'en_route'
  | 'testing'
  | 'completed'
  | 'cancelled'
  // Warranty / Service
  | 'active'
  | 'expired'
  | 'void'
  | 'claimed'
  | 'open'
  | 'investigating'
  | 'resolved'
  | 'closed'
  | 'covered'
  | 'chargeable'

interface StatusChipProps {
  status: string
  label?: string
  className?: string
}

export function StatusChip({ status, label, className }: StatusChipProps) {
  const normStatus = status.toLowerCase().replace(/[\s-]/g, '_')

  let variant: 'default' | 'destructive' | 'outline' | 'secondary' | 'success' | 'warning' | 'gray' | 'info' = 'default'

  switch (normStatus) {
    case 'approved':
    case 'won':
    case 'accepted':
    case 'paid':
    case 'delivered':
    case 'completed':
    case 'active':
    case 'resolved':
    case 'closed':
    case 'covered':
      variant = 'success'
      break

    case 'pending_approval':
    case 'pending_schedule':
    case 'scheduled':
    case 'survey_scheduled':
    case 'survey_completed':
    case 'partially_paid':
    case 'assigned':
    case 'in_progress':
    case 'testing':
    case 'investigating':
    case 'reserved':
      variant = 'warning'
      break

    case 'rejected':
    case 'lost':
    case 'defective':
    case 'cancelled':
    case 'expired':
    case 'void':
    case 'pending_survey_approval':
    case 'chargeable':
      variant = 'destructive'
      break

    case 'confirmed':
    case 'dispatched':
    case 'issued':
    case 'en_route':
      variant = 'info'
      break

    case 'draft':
    case 'new':
    case 'contacted':
    case 'in_stock':
    case 'open':
    default:
      variant = 'default'
      break
  }

  const displayLabel =
    label ||
    normStatus
      .split('_')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ')

  return (
    <Badge variant={variant} className={className}>
      {displayLabel}
    </Badge>
  )
}