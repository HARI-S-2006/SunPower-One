'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Label } from './label'

export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string
  description?: string
  error?: string
  required?: boolean
  children: React.ReactNode
}

function FormField({ label, description, error, required, children, className, ...props }: FormFieldProps) {
  return (
    <div className={cn('space-y-1.5', className)} {...props}>
      {label && (
        <Label className={cn(error && 'text-destructive')}>
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      {children}
      {description && !error && <p className="text-sm text-muted-foreground">{description}</p>}
      {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
    </div>
  )
}

export { FormField }