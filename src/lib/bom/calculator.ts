export interface BOMItem {
  id: string
  category: 'panels' | 'inverter' | 'battery' | 'mounting' | 'electrical' | 'earthing' | 'services'
  productName: string
  modelNumber: string
  specifications: string
  quantity: number
  unit: string
  unitCost: number
  totalCost: number
  isRequired: boolean
  isSerialized: boolean
}

export interface BOMResult {
  systemCapacityKw: number
  systemType: 'on-grid' | 'off-grid'
  customerCategory?: 'residential' | 'commercial'
  items: BOMItem[]
  totalEquipmentCost: number
  installationCost: number
  subtotal: number
  taxAmount: number
  totalAmount: number
  estimatedSubsidyAmount: number
  subsidyEligibilityNote: string
  netPayableAfterSubsidy: number
  recommendedPanelCount: number
  estimatedRoofAreaSqFt: number
  estimatedDailyKwh: number
}

export function calculateBOM(
  capacityKw: number,
  systemType: 'on-grid' | 'off-grid',
  customCableLengthMeters = 30,
  customerCategory: 'residential' | 'commercial' = 'residential'
): BOMResult {
  const kw = Math.min(Math.max(capacityKw, 1), 5)
  const isOffGrid = systemType === 'off-grid'

  // Panel calculations: 540W Mono PERC Half-cut panels
  const panelWattage = 540
  const panelCount = Math.ceil((kw * 1000) / panelWattage)
  const actualKw = (panelCount * panelWattage) / 1000

  // 1. Solar Panels
  const panelItem: BOMItem = {
    id: 'bom-panels',
    category: 'panels',
    productName: 'Adani Solar 540W Mono PERC Half-Cut Module',
    modelNumber: 'AD-540-MH',
    specifications: `${panelWattage}W peak, 21.3% module efficiency, IP68 junction box, 20-Year Warranty`,
    quantity: panelCount,
    unit: 'panels',
    unitCost: 11800,
    totalCost: panelCount * 11800,
    isRequired: true,
    isSerialized: true,
  }

  // 2. Solar Inverter
  let inverterItem: BOMItem
  if (isOffGrid) {
    inverterItem = {
      id: 'bom-inverter',
      category: 'inverter',
      productName: `Growatt ${kw}kW Hybrid Off-Grid Inverter with MPPT`,
      modelNumber: `SPF-${kw * 1000}T-HVM`,
      specifications: `${kw}kW continuous output, 48V DC bus, dual MPPT tracker, pure sine wave, 2-Year Warranty`,
      quantity: 1,
      unit: 'unit',
      unitCost: kw <= 3 ? 42000 : 64000,
      totalCost: kw <= 3 ? 42000 : 64000,
      isRequired: true,
      isSerialized: true,
    }
  } else {
    inverterItem = {
      id: 'bom-inverter',
      category: 'inverter',
      productName: `Solis ${kw}kW Single-Phase Grid-Tied Inverter`,
      modelNumber: `SOL-${kw}.0-G99`,
      specifications: `${kw}kW on-grid inverter, 97.8% max efficiency, anti-islanding protection, IP65 outdoor, 2-Year Warranty`,
      quantity: 1,
      unit: 'unit',
      unitCost: kw <= 3 ? 28000 : 41000,
      totalCost: kw <= 3 ? 28000 : 41000,
      isRequired: true,
      isSerialized: true,
    }
  }

  // 3. Batteries (Off-Grid only)
  const items: BOMItem[] = [panelItem, inverterItem]

  if (isOffGrid) {
    const batteryCount = kw <= 2 ? 1 : kw <= 4 ? 2 : 3
    items.push({
      id: 'bom-battery',
      category: 'battery',
      productName: 'Luminous Solar 48V 100Ah LiFePO4 Lithium Battery Bank',
      modelNumber: 'LUM-48100-LI',
      specifications: '4.8 kWh usable storage, 3500+ cycles @ 80% DoD, integrated BMS with thermal cutoff, 2-Year Warranty',
      quantity: batteryCount,
      unit: 'units',
      unitCost: 65000,
      totalCost: batteryCount * 65000,
      isRequired: true,
      isSerialized: true,
    })
  }

  // 4. Mounting Structure
  items.push({
    id: 'bom-mounting',
    category: 'mounting',
    productName: 'Galvanized Cold-Rolled Steel High-Tilt Elevated Mounting Structure',
    modelNumber: 'GIZ-STR-30',
    specifications: '80 micron hot-dip galvanized, wind resistance up to 150 km/h, 15° fixed tilt with stainless hardware',
    quantity: panelCount,
    unit: 'module mounts',
    unitCost: 1450,
    totalCost: panelCount * 1450,
    isRequired: true,
    isSerialized: false,
  })

  // 5. Electrical Distribution Boxes (DCDB & ACDB)
  items.push(
    {
      id: 'bom-dcdb',
      category: 'electrical',
      productName: 'Solar DC Distribution Box (DCDB) with Type II SPD & 1000V DC Fuses',
      modelNumber: 'DCDB-2IN-2OUT',
      specifications: 'IP65 polycarbonate enclosure, 1000V DC surge arrester, 16A DC MCBs, touch-safe design',
      quantity: 1,
      unit: 'box',
      unitCost: 3800,
      totalCost: 3800,
      isRequired: true,
      isSerialized: false,
    },
    {
      id: 'bom-acdb',
      category: 'electrical',
      productName: 'AC Distribution Box (ACDB) with 4-Pole MCB & Class II AC SPD',
      modelNumber: 'ACDB-32A-SP',
      specifications: 'IP65 waterproof enclosure, 32A C-curve AC MCB, 275V AC SPD, indicator neon lamps',
      quantity: 1,
      unit: 'box',
      unitCost: 3400,
      totalCost: 3400,
      isRequired: true,
      isSerialized: false,
    }
  )

  // 6. Solar DC & AC Cables
  const dcLength = Math.max(customCableLengthMeters, 20)
  items.push(
    {
      id: 'bom-dc-cables',
      category: 'electrical',
      productName: 'Polycab 4.0 sq mm Tinned Copper Double-Insulated Solar DC Cable (Red & Black)',
      modelNumber: 'SOL-4SQ-TIN',
      specifications: '1500V DC rated, cross-linked polyolefin (XLPO) insulation, UV & ozone resistant, halogen free',
      quantity: dcLength * 2,
      unit: 'meters',
      unitCost: 58,
      totalCost: dcLength * 2 * 58,
      isRequired: true,
      isSerialized: false,
    },
    {
      id: 'bom-ac-cables',
      category: 'electrical',
      productName: 'Havells 4.0 sq mm 3-Core Copper Armoured AC Cable',
      modelNumber: 'ARM-4SQ-3C',
      specifications: '1100V grade, annealed bare electrolytic copper conductor, PVC insulated, galvanized steel wire armoured',
      quantity: 25,
      unit: 'meters',
      unitCost: 120,
      totalCost: 25 * 120,
      isRequired: true,
      isSerialized: false,
    }
  )

  // 7. Safety Earthing & Lightning Protection
  items.push(
    {
      id: 'bom-earthing',
      category: 'earthing',
      productName: 'Chemical Earthing Electrode Kit (2m x 17.2mm Copper-Bonded Steel Rod)',
      modelNumber: 'EARTH-CP-2M',
      specifications: 'UL certified copper-bonded steel rod, 25kg carbon-based earth enhancing compound, <5 Ohm earth resistance',
      quantity: 3, // AC, DC, and Lightning
      unit: 'sets',
      unitCost: 3200,
      totalCost: 3 * 3200,
      isRequired: true,
      isSerialized: false,
    },
    {
      id: 'bom-lightning',
      category: 'earthing',
      productName: 'Copper Solid Spike Conventional Lightning Arrester with 1m Base Pole',
      modelNumber: 'LA-COP-1M',
      specifications: 'Five-prong pure copper spike, tested for 40kA surge rating, includes FRP insulator mast',
      quantity: 1,
      unit: 'set',
      unitCost: 2900,
      totalCost: 2900,
      isRequired: true,
      isSerialized: false,
    }
  )

  // 8. Installation & Commissioning Service
  const installationCost = kw * 6000 + 4000
  items.push({
    id: 'bom-services',
    category: 'services',
    productName: 'Professional Rooftop Installation, Civil Rigging & Electrical Commissioning',
    modelNumber: 'SRV-INSTALL',
    specifications: 'Certified technicians, chemical anchor bolting, Voc/Isc testing, grid synchronization, safety sign-off',
    quantity: 1,
    unit: 'service package',
    unitCost: installationCost,
    totalCost: installationCost,
    isRequired: true,
    isSerialized: false,
  })

  // Financial aggregates
  const totalEquipmentCost = items
    .filter((i) => i.category !== 'services')
    .reduce((sum, item) => sum + item.totalCost, 0)

  const subtotal = totalEquipmentCost + installationCost
  // Blended composite tax (12% on solar items, 18% on service) approx 13.5%
  const taxAmount = Math.round(totalEquipmentCost * 0.12 + installationCost * 0.18)
  const totalAmount = subtotal + taxAmount

  // PM Surya Ghar / State Rooftop Subsidy: Strictly for Residential Grid-Connected Systems
  let estimatedSubsidyAmount = 0
  let subsidyEligibilityNote = ''

  if (isOffGrid) {
    estimatedSubsidyAmount = 0
    subsidyEligibilityNote = 'Off-Grid systems are not eligible for central grid-tie CFA subsidy under PM Surya Ghar.'
  } else if (customerCategory === 'commercial') {
    estimatedSubsidyAmount = 0
    subsidyEligibilityNote = 'Commercial/Industrial connections are not eligible for residential CFA subsidies (Eligible for 40% Accelerated Depreciation under Section 32).'
  } else {
    // Residential On-Grid Scheme: ₹30,000 for 1kW, ₹60,000 for 2kW, capped at ₹78,000 for 3kW+
    if (kw === 1) estimatedSubsidyAmount = 30000
    else if (kw === 2) estimatedSubsidyAmount = 60000
    else estimatedSubsidyAmount = 78000
    subsidyEligibilityNote = `Eligible for PM Surya Ghar: Muft Bijli Yojana CFA subsidy of up to ₹${estimatedSubsidyAmount.toLocaleString()} upon DISCOM technical feasibility and net-meter inspection.`
  }
  const netPayableAfterSubsidy = Math.max(0, totalAmount - estimatedSubsidyAmount)

  return {
    systemCapacityKw: actualKw,
    systemType,
    customerCategory,
    items,
    totalEquipmentCost,
    installationCost,
    subtotal,
    taxAmount,
    totalAmount,
    estimatedSubsidyAmount,
    subsidyEligibilityNote,
    netPayableAfterSubsidy,
    recommendedPanelCount: panelCount,
    estimatedRoofAreaSqFt: panelCount * 24, // approx 24 sq ft per panel
    estimatedDailyKwh: Math.round(kw * 4.2 * 10) / 10,
  }
}

