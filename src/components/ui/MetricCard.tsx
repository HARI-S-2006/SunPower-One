import React from 'react'
import { Card } from './card'
import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

export interface MetricCardProps {
  label?: string
  title?: string
  value: string | number
  unit?: string
  trend?:
    | {
        value: string
        direction: 'up' | 'down' | 'neutral'
        isGood?: boolean
        label?: string
      }
    | 'up'
    | 'down'
    | 'neutral'
  trendValue?: string
  subtext?: string
  subtitle?: string
  icon?: React.ReactNode | React.ComponentType<{ className?: string }>
  className?: string
  action?: React.ReactNode
}

export function MetricCard({
  label,
  title,
  value,
  unit,
  trend,
  trendValue,
  subtext,
  subtitle,
  icon,
  className,
  action,
}: MetricCardProps) {
  const displayLabel = title || label || ''
  const displaySubtext = subtitle || subtext || ''

  // Normalize trend
  const normalizedTrend =
    typeof trend === 'string'
      ? {
          direction: trend,
          value: trendValue || (trend === 'up' ? '+Active' : ''),
          isGood: trend === 'up',
        }
      : trend

  // Render icon
  const renderIcon = () => {
    if (!icon) return null
    if (React.isValidElement(icon)) return icon
    if (typeof icon === 'function') {
      const IconComp = icon as React.ComponentType<{ className?: string }>
      return <IconComp className="h-4 w-4" />
    }
    return null
  }

  return (
    <Card className={cn('p-5 sm:p-6 bg-white border border-[#E8E0D6] rounded-xl shadow-warm-sm', className)}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-semibold tracking-wider text-[#827B73] uppercase font-sans">
          {displayLabel}
        </span>
        {icon && (
          <div className="p-2 rounded-lg bg-[#F7F3EC] text-[#172747]">
            {renderIcon()}
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline justify-between gap-3">
        <div className="flex items-baseline gap-1.5">
          <span className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#292522] tabular-nums">
            {value}
          </span>
          {unit && (
            <span className="font-sans text-sm font-medium text-[#827B73]">
              {unit}
            </span>
          )}
        </div>

        {normalizedTrend && (
          <div
            className={cn(
              'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold select-none',
              normalizedTrend.direction === 'up' && 'bg-[#2D5A43]/10 text-[#2D5A43]',
              normalizedTrend.direction === 'down' && 'bg-[#9E3A3A]/10 text-[#9E3A3A]',
              normalizedTrend.direction === 'neutral' && 'bg-[#E9DDCA]/60 text-[#827B73]'
            )}
          >
            {normalizedTrend.direction === 'up' && <TrendingUp className="h-3 w-3" />}
            {normalizedTrend.direction === 'down' && <TrendingDown className="h-3 w-3" />}
            {normalizedTrend.direction === 'neutral' && <Minus className="h-3 w-3" />}
            <span>{normalizedTrend.value}</span>
          </div>
        )}
      </div>

      {(displaySubtext || action) && (
        <div className="mt-3 flex items-center justify-between gap-2 pt-2 border-t border-[#F7F3EC]">
          {displaySubtext && (
            <p className="text-xs text-[#827B73] font-sans">
              {displaySubtext}
            </p>
          )}
          {action && <div className="text-xs">{action}</div>}
        </div>
      )}
    </Card>
  )
}
