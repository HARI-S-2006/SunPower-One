import { describe, it, expect } from 'vitest'
import { calculateBOM } from '@/lib/bom/calculator'

describe('Solar System BOM Calculator & Business Logic', () => {
  it('calculates 3 kW On-Grid BOM with accurate equipment, labor, and GST', () => {
    const bom = calculateBOM(3, 'on-grid')

    // 6 panels * 540W = 3.24 kW actual DC capacity
    expect(bom.systemCapacityKw).toBe(3.24)
    expect(bom.systemType).toBe('on-grid')
    expect(bom.items.length).toBeGreaterThan(5)

    // Check panels
    const panels = bom.items.find(i => i.category === 'panels')
    expect(panels).toBeDefined()
    expect(panels?.quantity).toBe(6)

    // Check inverter
    const inverter = bom.items.find(i => i.category === 'inverter')
    expect(inverter).toBeDefined()
    expect(inverter?.productName).toContain('Solis')

    // On-grid should NOT include battery
    const battery = bom.items.find(i => i.category === 'battery')
    expect(battery).toBeUndefined()

    // Financial calculations: Equipment at 12% GST + Labor at 18% GST
    expect(bom.totalEquipmentCost).toBeGreaterThan(100000)
    expect(bom.installationCost).toBeGreaterThan(15000)
    expect(bom.taxAmount).toBe(20002)
    expect(bom.totalAmount).toBe(bom.subtotal + bom.taxAmount)

    // Subsidy: 3 kW eligible for up to ₹78,000 under PM Surya Ghar
    expect(bom.estimatedSubsidyAmount).toBe(78000)
    expect(bom.netPayableAfterSubsidy).toBe(bom.totalAmount - 78000)
  })

  it('calculates 5 kW Off-Grid BOM including Lithium Battery Storage', () => {
    const bom = calculateBOM(5, 'off-grid')

    // 10 panels * 540W = 5.4 kW actual DC capacity
    expect(bom.systemCapacityKw).toBe(5.4)
    expect(bom.systemType).toBe('off-grid')

    // Off-grid MUST include battery storage
    const battery = bom.items.find(i => i.category === 'battery')
    expect(battery).toBeDefined()
    expect(battery?.productName).toContain('Lithium')
    expect(battery?.quantity).toBe(3) // 3x battery modules for 5.4kW BESS storage

    // Hybrid inverter check
    const inverter = bom.items.find(i => i.category === 'inverter')
    expect(inverter?.productName).toContain('Hybrid')

    // Total should be higher due to BESS storage
    expect(bom.totalAmount).toBeGreaterThan(350000)
  })

  it('validates PM Surya Ghar CFA tier rules', () => {
    // 1 kW: ₹30,000
    const bom1 = calculateBOM(1, 'on-grid')
    expect(bom1.estimatedSubsidyAmount).toBe(30000)

    // 2 kW: ₹60,000
    const bom2 = calculateBOM(2, 'on-grid')
    expect(bom2.estimatedSubsidyAmount).toBe(60000)

    // 3 kW: ₹78,000 (cap)
    const bom3 = calculateBOM(3, 'on-grid')
    expect(bom3.estimatedSubsidyAmount).toBe(78000)

    // 5 kW: still capped at ₹78,000 residential maximum
    const bom5 = calculateBOM(5, 'on-grid')
    expect(bom5.estimatedSubsidyAmount).toBe(78000)
  })
})
