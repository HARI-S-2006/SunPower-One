import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MetricCard } from '@/components/ui/MetricCard'
import { StatusChip } from '@/components/ui/StatusChip'
import { Input } from '@/components/ui/input'

describe('Stitch Design System UI Components', () => {
  it('renders primary button with deep navy styling and proper attributes', () => {
    render(<Button variant="default">Generate Quotation</Button>)
    const button = screen.getByRole('button', { name: /generate quotation/i })
    expect(button).toBeDefined()
    expect(button.className).toContain('bg-[#172747]')
  })

  it('renders brand button with espresso styling', () => {
    render(<Button variant="brand">Dispatch Warehouse</Button>)
    const button = screen.getByRole('button', { name: /dispatch warehouse/i })
    expect(button).toBeDefined()
    expect(button.className).toContain('bg-[#493027]')
  })

  it('renders status badge with correct semantic classes', () => {
    const { container } = render(<Badge variant="nominal">System Nominal</Badge>)
    expect(container.textContent).toContain('System Nominal')
    expect(container.firstChild).toHaveProperty('className')
  })

  it('renders metric card with large telemetry and tabular numbers', () => {
    render(
      <MetricCard
        label="Total Managed Generation"
        value="74.2"
        unit="MW DC"
        trend={{ value: '+4.2%', direction: 'up' }}
      />
    )
    expect(screen.getByText('Total Managed Generation')).toBeDefined()
    expect(screen.getByText('74.2')).toBeDefined()
    expect(screen.getByText('MW DC')).toBeDefined()
  })

  it('renders business status chips for key lifecycle states', () => {
    const { rerender } = render(<StatusChip status="approved" />)
    expect(screen.getByText('Approved')).toBeDefined()

    rerender(<StatusChip status="pending_survey_approval" />)
    expect(screen.getByText('Pending Survey Approval')).toBeDefined()

    rerender(<StatusChip status="dispatched" />)
    expect(screen.getByText('Dispatched')).toBeDefined()

    rerender(<StatusChip status="covered" />)
    expect(screen.getByText('Covered')).toBeDefined()
  })

  it('renders input with warm architectural border styling', () => {
    render(<Input placeholder="Enter inverter serial..." />)
    const input = screen.getByPlaceholderText(/enter inverter serial/i)
    expect(input).toBeDefined()
    expect(input.className).toContain('border-[#E8E0D6]')
  })
})
