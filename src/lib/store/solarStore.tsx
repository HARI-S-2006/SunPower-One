import React, { createContext, useContext, useState, useEffect } from 'react'
import { calculateBOM, type BOMResult } from '@/lib/bom/calculator'

// ==========================================
// 1. DATA MODELS ACROSS THE 7 MODULES
// ==========================================

export interface Lead {
  id: string
  referenceNo: string
  customerName: string
  phone: string
  email: string
  address: string
  city: string
  capacityKw: number
  systemType: 'on-grid' | 'off-grid'
  monthlyBill: number
  roofAreaSqFt: number
  status: 'new' | 'survey_scheduled' | 'survey_approved' | 'quoted' | 'won' | 'lost'
  assignedSalesExec: string
  notes: string
  createdAt: string
  surveyId?: string
}

export interface SiteSurvey {
  id: string
  surveyNo: string
  leadId: string
  customerName: string
  siteAddress: string
  technicianName: string
  technicianId: string
  scheduledDate: string
  roofAreaSqFt: number
  shadowFreeAreaSqFt: number
  roofDirection: 'South' | 'South-West' | 'South-East' | 'West' | 'North'
  roofTiltAngle: number // degrees
  cableDistanceMeters: number
  gridSuitability: 'Optimal' | 'Requires Grid Tie Upgrade' | 'Inadequate'
  structuralStrength: 'Good - RCC Slab' | 'Tin Shed - Reinforcement Needed' | 'Tile Roof'
  photos: string[]
  technicianNotes: string
  status: 'scheduled' | 'pending_approval' | 'approved' | 'rejected'
  rejectionReason?: string
  approvedBy?: string
  approvedAt?: string
}

export interface Quotation {
  id: string
  quotationNo: string
  leadId: string
  surveyId: string
  customerName: string
  systemCapacityKw: number
  systemType: 'on-grid' | 'off-grid'
  bom: BOMResult
  status: 'draft' | 'pending_survey_approval' | 'approved_ready' | 'accepted' | 'rejected'
  advanceRequiredPercent: number
  advanceAmount: number
  createdAt: string
  validUntil: string
}

export interface SalesOrder {
  id: string
  orderNo: string
  quotationId: string
  customerName: string
  customerPhone: string
  deliveryAddress: string
  capacityKw: number
  systemType: 'on-grid' | 'off-grid'
  totalAmount: number
  paidAmount: number
  balanceAmount: number
  paymentMilestone: 'Advance Received (30%)' | 'Pre-Dispatch (50%)' | 'Commissioned (20%)' | 'Fully Settled'
  status: 'confirmed' | 'staging_warehouse' | 'dispatched' | 'installed' | 'commissioned'
  allocatedSerials: string[]
  dispatchDate?: string
  installationId?: string
  createdAt: string
}

export interface SerialAsset {
  id: string
  serialNumber: string
  productName: string
  category: 'panel' | 'inverter' | 'battery'
  orderId?: string
  customerName?: string
  warrantyYears: number
  status: 'in_stock' | 'allocated' | 'dispatched' | 'active_under_warranty' | 'warranty_expired'
  manufactureDate: string
  dispatchedAt?: string
}

export interface InstallationJob {
  id: string
  jobNo: string
  orderId: string
  customerName: string
  customerPhone: string
  siteAddress: string
  capacityKw: number
  leadTechnician: string
  scheduledDate: string
  status: 'assigned' | 'en_route' | 'in_progress' | 'testing' | 'commissioned'
  startTime?: string
  completionTime?: string
  checklist: {
    mountingStructureTorqueVerified: boolean
    isolationResistanceMeggerTestPassed: boolean
    vocAndIscStringVerified: boolean
    earthingResistanceLessThan5Ohms: boolean
    inverterAntiIslandingFunctional: boolean
  }
  testedVocVolts?: number
  testedIscAmps?: number
  testedEarthResistanceOhms?: number
  solarGenerationKwReading?: number
  photos: string[]
  customerSignature?: string
  commissioningDate?: string
}

export interface WarrantyRecord {
  id: string
  certificateNo: string
  serialNumber: string
  productName: string
  category: 'panel' | 'inverter' | 'battery'
  customerName: string
  customerPhone: string
  installationId: string
  orderId: string
  startDate: string
  expiryDate: string
  durationYears: number
  status: 'active' | 'claim_in_progress' | 'expired' | 'void'
  coverageScope: string
}

export interface ServiceTicket {
  id: string
  ticketNo: string
  customerName: string
  customerPhone: string
  siteAddress: string
  serialNumber: string
  productName: string
  faultCode: string
  faultDescription: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  status: 'open' | 'assigned' | 'diagnosing' | 'resolved' | 'closed'
  assignedTechnician: string
  warrantyStatus: 'covered_zero_cost' | 'chargeable_out_of_warranty'
  estimatedCost: number
  finalCost: number
  repairDetails?: string
  customerConfirmationRecorded: boolean
  createdAt: string
  resolvedAt?: string
}

export interface SubsidyRecord {
  id: string
  applicationRefNo: string
  customerName: string
  installationId: string
  capacityKw: number
  schemeName: string
  portalReference: string
  documentsSubmitted: boolean
  approvalStatus: 'submitted' | 'document_verified' | 'discom_approved' | 'disbursed'
  subsidyAmountApproved: number
  disbursedAmount: number
  disbursementDate?: string
}

export interface TechnicianPaymentRecord {
  id: string
  settlementNo: string
  technicianName: string
  jobNo: string
  customerName: string
  agreedLabour: number
  additionalApprovedLabour: number
  advancePaid: number
  remainingPayable: number
  status: 'pending_commissioning' | 'payable' | 'settled'
  settlementDate?: string
}

// ==========================================
// 2. REALISTIC BASELINE DEMONSTRATION DATA
// ==========================================

const INITIAL_LEADS: Lead[] = [
  {
    id: 'lead-00',
    referenceNo: 'LD-2026-080',
    customerName: 'Test Homeowner',
    phone: '+91 98765 43210',
    email: 'test@example.com',
    address: '123 Test Street, Test City',
    city: 'Bengaluru',
    capacityKw: 3,
    systemType: 'on-grid',
    monthlyBill: 4500,
    roofAreaSqFt: 650,
    status: 'new',
    assignedSalesExec: 'Elena Rostova',
    notes: 'Website enquiry for 3kW rooftop system.',
    createdAt: '2026-10-23T09:00:00Z',
  },
  {
    id: 'lead-01',
    referenceNo: 'LD-2026-081',
    customerName: 'Anand Kumar Sharma',
    phone: '+91 98450 12345',
    email: 'anand.sharma@gmail.com',
    address: '42, 4th Cross, Indiranagar',
    city: 'Bengaluru',
    capacityKw: 3,
    systemType: 'on-grid',
    monthlyBill: 4500,
    roofAreaSqFt: 650,
    status: 'survey_approved',
    assignedSalesExec: 'Elena Rostova',
    notes: 'Homeowner wants maximum net metering savings. Approved shadow-free roof.',
    createdAt: '2026-10-24T10:30:00Z',
    surveyId: 'srv-01',
  },
  {
    id: 'lead-02',
    referenceNo: 'LD-2026-082',
    customerName: 'Precision Tools & Castings Ltd',
    phone: '+91 94220 54321',
    email: 'ops@precisiontools.in',
    address: 'Plot 12, Peenya Industrial Area Phase 2',
    city: 'Bengaluru',
    capacityKw: 5,
    systemType: 'off-grid',
    monthlyBill: 18500,
    roofAreaSqFt: 1800,
    status: 'survey_scheduled',
    assignedSalesExec: 'Elena Rostova',
    notes: 'Industrial plant requiring battery backup during peak factory shifts.',
    createdAt: '2026-10-26T14:15:00Z',
    surveyId: 'srv-02',
  },
  {
    id: 'lead-03',
    referenceNo: 'LD-2026-083',
    customerName: 'Meera Nambiar',
    phone: '+91 99160 88234',
    email: 'meera.n@outlook.com',
    address: 'Villa 14, Palm Meadows, Whitefield',
    city: 'Bengaluru',
    capacityKw: 2,
    systemType: 'on-grid',
    monthlyBill: 2800,
    roofAreaSqFt: 400,
    status: 'new',
    assignedSalesExec: 'Marcus Vance',
    notes: 'Inquiry received via website solar calculator. Wants prompt site inspection.',
    createdAt: '2026-10-30T09:00:00Z',
  },
  {
    id: 'lead-04',
    referenceNo: 'LD-2026-084',
    customerName: 'Siddharth Varma',
    phone: '+91 98860 33412',
    email: 'siddharth.varma@gmail.com',
    address: '77, 8th Main, Koramangala 4th Block',
    city: 'Bengaluru',
    capacityKw: 4,
    systemType: 'on-grid',
    monthlyBill: 6200,
    roofAreaSqFt: 850,
    status: 'won',
    assignedSalesExec: 'Elena Rostova',
    notes: 'Quotation accepted, initial 30% advance paid. Ready for equipment dispatch.',
    createdAt: '2026-10-18T11:20:00Z',
    surveyId: 'srv-04',
  },
]

const INITIAL_SURVEYS: SiteSurvey[] = [
  {
    id: 'srv-01',
    surveyNo: 'SRV-2026-0041',
    leadId: 'lead-01',
    customerName: 'Anand Kumar Sharma',
    siteAddress: '42, 4th Cross, Indiranagar, Bengaluru',
    technicianName: 'Mateo Kowalski',
    technicianId: 'tech-01',
    scheduledDate: '2026-10-25',
    roofAreaSqFt: 650,
    shadowFreeAreaSqFt: 480,
    roofDirection: 'South',
    roofTiltAngle: 14,
    cableDistanceMeters: 28,
    gridSuitability: 'Optimal',
    structuralStrength: 'Good - RCC Slab',
    photos: [
      'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1545209575-7076a5992a54?auto=format&fit=crop&w=600&q=80',
    ],
    technicianNotes: 'RCC rooftop with zero shadowing between 9 AM and 4:30 PM. AC mains panel 28m away.',
    status: 'approved',
    approvedBy: 'Marcus Vance (Director)',
    approvedAt: '2026-10-25T16:00:00Z',
  },
  {
    id: 'srv-02',
    surveyNo: 'SRV-2026-0042',
    leadId: 'lead-02',
    customerName: 'Precision Tools & Castings Ltd',
    siteAddress: 'Plot 12, Peenya Industrial Area Phase 2, Bengaluru',
    technicianName: 'Rajesh Kumar',
    technicianId: 'tech-02',
    scheduledDate: '2026-10-31',
    roofAreaSqFt: 1800,
    shadowFreeAreaSqFt: 1200,
    roofDirection: 'South-West',
    roofTiltAngle: 10,
    cableDistanceMeters: 45,
    gridSuitability: 'Requires Grid Tie Upgrade',
    structuralStrength: 'Tin Shed - Reinforcement Needed',
    photos: [
      'https://images.unsplash.com/photo-1508873696983-2df57046475b?auto=format&fit=crop&w=600&q=80',
    ],
    technicianNotes: 'Requires purlin clamps and structure reinforcement for 5kW array. Cable run is 45 meters.',
    status: 'pending_approval',
  },
  {
    id: 'srv-04',
    surveyNo: 'SRV-2026-0038',
    leadId: 'lead-04',
    customerName: 'Siddharth Varma',
    siteAddress: '77, 8th Main, Koramangala 4th Block, Bengaluru',
    technicianName: 'Mateo Kowalski',
    technicianId: 'tech-01',
    scheduledDate: '2026-10-20',
    roofAreaSqFt: 850,
    shadowFreeAreaSqFt: 620,
    roofDirection: 'South',
    roofTiltAngle: 15,
    cableDistanceMeters: 22,
    gridSuitability: 'Optimal',
    structuralStrength: 'Good - RCC Slab',
    photos: [
      'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=600&q=80',
    ],
    technicianNotes: 'Clean south-facing roof terrace. Ready for 4 kW On-Grid installation.',
    status: 'approved',
    approvedBy: 'Marcus Vance (Director)',
    approvedAt: '2026-10-20T17:30:00Z',
  },
]

const INITIAL_QUOTATIONS: Quotation[] = [
  {
    id: 'quote-01',
    quotationNo: 'QT-2026-0041',
    leadId: 'lead-01',
    surveyId: 'srv-01',
    customerName: 'Anand Kumar Sharma',
    systemCapacityKw: 3.24,
    systemType: 'on-grid',
    bom: calculateBOM(3, 'on-grid', 28),
    status: 'approved_ready',
    advanceRequiredPercent: 30,
    advanceAmount: Math.round(calculateBOM(3, 'on-grid', 28).totalAmount * 0.3),
    createdAt: '2026-10-26T11:00:00Z',
    validUntil: '2026-11-26',
  },
  {
    id: 'quote-04',
    quotationNo: 'QT-2026-0038',
    leadId: 'lead-04',
    surveyId: 'srv-04',
    customerName: 'Siddharth Varma',
    systemCapacityKw: 4.32,
    systemType: 'on-grid',
    bom: calculateBOM(4, 'on-grid', 22),
    status: 'accepted',
    advanceRequiredPercent: 30,
    advanceAmount: Math.round(calculateBOM(4, 'on-grid', 22).totalAmount * 0.3),
    createdAt: '2026-10-21T09:30:00Z',
    validUntil: '2026-11-21',
  },
]

const INITIAL_ORDERS: SalesOrder[] = [
  {
    id: 'ord-01',
    orderNo: 'SO-2026-0038',
    quotationId: 'quote-04',
    customerName: 'Siddharth Varma',
    customerPhone: '+91 98860 33412',
    deliveryAddress: '77, 8th Main, Koramangala 4th Block, Bengaluru',
    capacityKw: 4,
    systemType: 'on-grid',
    totalAmount: 245000,
    paidAmount: 73500, // 30% advance paid
    balanceAmount: 171500,
    paymentMilestone: 'Advance Received (30%)',
    status: 'staging_warehouse',
    allocatedSerials: ['INV-4000-9102', 'PNL-540W-0081', 'PNL-540W-0082'],
    createdAt: '2026-10-23T14:00:00Z',
  },
  {
    id: 'ord-00',
    orderNo: 'SO-2026-0029',
    quotationId: 'quote-legacy',
    customerName: 'Vikramaditya Rao',
    customerPhone: '+91 98451 99012',
    deliveryAddress: '19, 1st Cross, Dollars Colony, Bengaluru',
    capacityKw: 3,
    systemType: 'on-grid',
    totalAmount: 185000,
    paidAmount: 185000,
    balanceAmount: 0,
    paymentMilestone: 'Fully Settled',
    status: 'commissioned',
    allocatedSerials: ['INV-3300-8491', 'PNL-540W-0012'],
    dispatchDate: '2025-04-12',
    installationId: 'inst-00',
    createdAt: '2025-04-05T10:00:00Z',
  },
]

const INITIAL_SERIALS: SerialAsset[] = [
  {
    id: 'ser-01',
    serialNumber: 'INV-3300-8491',
    productName: 'Solis 3.3kW Single-Phase Grid-Tied Inverter',
    category: 'inverter',
    orderId: 'ord-00',
    customerName: 'Vikramaditya Rao',
    warrantyYears: 2,
    status: 'active_under_warranty',
    manufactureDate: '2025-02-15',
    dispatchedAt: '2025-04-12',
  },
  {
    id: 'ser-02',
    serialNumber: 'INV-4000-9102',
    productName: 'Solis 4.0kW Single-Phase Grid-Tied Inverter',
    category: 'inverter',
    orderId: 'ord-01',
    customerName: 'Siddharth Varma',
    warrantyYears: 2,
    status: 'allocated',
    manufactureDate: '2026-08-10',
  },
  {
    id: 'ser-03',
    serialNumber: 'INV-5000-1120',
    productName: 'Growatt 5.0kW Hybrid Inverter with MPPT',
    category: 'inverter',
    warrantyYears: 2,
    status: 'in_stock',
    manufactureDate: '2026-09-01',
  },
  {
    id: 'ser-04',
    serialNumber: 'BAT-48V-9932',
    productName: 'Luminous Solar 48V 100Ah LiFePO4 Lithium Battery',
    category: 'battery',
    warrantyYears: 2,
    status: 'in_stock',
    manufactureDate: '2026-09-15',
  },
  {
    id: 'ser-05',
    serialNumber: 'BAT-48V-9933',
    productName: 'Luminous Solar 48V 100Ah LiFePO4 Lithium Battery',
    category: 'battery',
    warrantyYears: 2,
    status: 'in_stock',
    manufactureDate: '2026-09-15',
  },
  {
    id: 'ser-06',
    serialNumber: 'PNL-540W-0081',
    productName: 'Adani Solar 540W Mono PERC Module',
    category: 'panel',
    orderId: 'ord-01',
    customerName: 'Siddharth Varma',
    warrantyYears: 20,
    status: 'allocated',
    manufactureDate: '2026-07-20',
  },
]

const INITIAL_INSTALLATIONS: InstallationJob[] = [
  {
    id: 'inst-01',
    jobNo: 'JOB-2026-0044',
    orderId: 'ord-01',
    customerName: 'Siddharth Varma',
    customerPhone: '+91 98860 33412',
    siteAddress: '77, 8th Main, Koramangala 4th Block, Bengaluru',
    capacityKw: 4,
    leadTechnician: 'Mateo Kowalski',
    scheduledDate: '2026-11-02',
    status: 'assigned',
    checklist: {
      mountingStructureTorqueVerified: false,
      isolationResistanceMeggerTestPassed: false,
      vocAndIscStringVerified: false,
      earthingResistanceLessThan5Ohms: false,
      inverterAntiIslandingFunctional: false,
    },
    photos: [],
  },
  {
    id: 'inst-00',
    jobNo: 'JOB-2025-0012',
    orderId: 'ord-00',
    customerName: 'Vikramaditya Rao',
    customerPhone: '+91 98451 99012',
    siteAddress: '19, 1st Cross, Dollars Colony, Bengaluru',
    capacityKw: 3,
    leadTechnician: 'Rajesh Kumar',
    scheduledDate: '2025-04-15',
    status: 'commissioned',
    startTime: '2025-04-15T09:00:00Z',
    completionTime: '2025-04-15T16:30:00Z',
    checklist: {
      mountingStructureTorqueVerified: true,
      isolationResistanceMeggerTestPassed: true,
      vocAndIscStringVerified: true,
      earthingResistanceLessThan5Ohms: true,
      inverterAntiIslandingFunctional: true,
    },
    testedVocVolts: 248.5,
    testedIscAmps: 12.8,
    testedEarthResistanceOhms: 2.4,
    solarGenerationKwReading: 3.12,
    photos: [
      'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=600&q=80',
    ],
    customerSignature: 'Vikramaditya Rao (Digitally Accepted)',
    commissioningDate: '2025-04-15',
  },
]

const INITIAL_WARRANTIES: WarrantyRecord[] = [
  {
    id: 'war-01',
    certificateNo: 'WAR-INV-2025-019',
    serialNumber: 'INV-3300-8491',
    productName: 'Solis 3.3kW Single-Phase Grid-Tied Inverter',
    category: 'inverter',
    customerName: 'Vikramaditya Rao',
    customerPhone: '+91 98451 99012',
    installationId: 'inst-00',
    orderId: 'ord-00',
    startDate: '2025-04-12', // Trigger: Delivery completion
    expiryDate: '2027-04-12', // 2 years
    durationYears: 2,
    status: 'active',
    coverageScope: 'Full replacement / component repair for internal electrical faults. Excludes lightning direct hit.',
  },
  {
    id: 'war-02',
    certificateNo: 'WAR-PNL-2025-012',
    serialNumber: 'PNL-540W-0012',
    productName: 'Adani Solar 540W Mono PERC Module',
    category: 'panel',
    customerName: 'Vikramaditya Rao',
    customerPhone: '+91 98451 99012',
    installationId: 'inst-00',
    orderId: 'ord-00',
    startDate: '2025-04-12',
    expiryDate: '2045-04-12', // 20 years
    durationYears: 20,
    status: 'active',
    coverageScope: 'Linear power performance guarantee: 90% peak output at 10 years, 80% at 20 years.',
  },
]

const INITIAL_SERVICE_TICKETS: ServiceTicket[] = [
  {
    id: 'tkt-01',
    ticketNo: 'SRV-TKT-2026-092',
    customerName: 'Vikramaditya Rao',
    customerPhone: '+91 98451 99012',
    siteAddress: '19, 1st Cross, Dollars Colony, Bengaluru',
    serialNumber: 'INV-3300-8491',
    productName: 'Solis 3.3kW Inverter',
    faultCode: 'ERR-F04: Grid Frequency Abnormal / Inverter Trip',
    faultDescription: 'Inverter trip occurring during heavy monsoon showers. Display error F-04, zero solar power export to grid.',
    priority: 'high',
    status: 'open',
    assignedTechnician: 'Rajesh Kumar',
    warrantyStatus: 'covered_zero_cost',
    estimatedCost: 0,
    finalCost: 0,
    repairDetails: 'Warranty active until 2027-04-12. Technician assigned to inspect AC surge arrester & grid frequency relay.',
    customerConfirmationRecorded: false,
    createdAt: '2026-10-31T08:30:00Z',
  },
]

const INITIAL_SUBSIDIES: SubsidyRecord[] = [
  {
    id: 'sub-01',
    applicationRefNo: 'MNRE-KA-2025-99214',
    customerName: 'Vikramaditya Rao',
    installationId: 'inst-00',
    capacityKw: 3,
    schemeName: 'PM Surya Ghar: Muft Bijli Yojana (Central Financial Assistance)',
    portalReference: 'NREG-BLR-041928',
    documentsSubmitted: true,
    approvalStatus: 'disbursed',
    subsidyAmountApproved: 78000,
    disbursedAmount: 78000,
    disbursementDate: '2025-06-20',
  },
  {
    id: 'sub-02',
    applicationRefNo: 'MNRE-KA-2026-10492',
    customerName: 'Siddharth Varma',
    installationId: 'inst-01',
    capacityKw: 4,
    schemeName: 'PM Surya Ghar: Muft Bijli Yojana (Central Financial Assistance)',
    portalReference: 'NREG-BLR-052011',
    documentsSubmitted: true,
    approvalStatus: 'discom_approved',
    subsidyAmountApproved: 78000,
    disbursedAmount: 0,
  },
]

const INITIAL_TECH_PAYMENTS: TechnicianPaymentRecord[] = [
  {
    id: 'tp-01',
    settlementNo: 'SET-2025-081',
    technicianName: 'Rajesh Kumar',
    jobNo: 'JOB-2025-0012',
    customerName: 'Vikramaditya Rao',
    agreedLabour: 18000,
    additionalApprovedLabour: 2000, // Elevated mast work
    advancePaid: 8000,
    remainingPayable: 12000,
    status: 'settled',
    settlementDate: '2025-04-20',
  },
  {
    id: 'tp-02',
    settlementNo: 'SET-2026-104',
    technicianName: 'Mateo Kowalski',
    jobNo: 'JOB-2026-0044',
    customerName: 'Siddharth Varma',
    agreedLabour: 24000,
    additionalApprovedLabour: 0,
    advancePaid: 10000,
    remainingPayable: 14000,
    status: 'pending_commissioning',
  },
]

// ==========================================
// 3. REACT CONTEXT AND LIFECYCLE ACTIONS
// ==========================================

interface SolarStoreContextType {
  leads: Lead[]
  surveys: SiteSurvey[]
  quotations: Quotation[]
  orders: SalesOrder[]
  serials: SerialAsset[]
  installations: InstallationJob[]
  warranties: WarrantyRecord[]
  serviceTickets: ServiceTicket[]
  subsidies: SubsidyRecord[]
  techPayments: TechnicianPaymentRecord[]

  // Action Methods
  createLead: (data: Omit<Lead, 'id' | 'referenceNo' | 'createdAt' | 'status'>) => Lead
  scheduleSurvey: (leadId: string, technicianName: string, date: string) => SiteSurvey
  approveSurvey: (surveyId: string, approverName: string) => void
  rejectSurvey: (surveyId: string, reason: string) => void
  generateQuotation: (leadId: string, capacityKw: number, systemType: 'on-grid' | 'off-grid') => { quotation?: Quotation; error?: string }
  acceptQuotation: (quotationId: string) => SalesOrder
  recordOrderPayment: (orderId: string, amount: number) => void
  dispatchOrder: (orderId: string, serialsToDispatch: string[]) => { success: boolean; error?: string }
  startInstallation: (jobId: string) => void
  completeInstallation: (
    jobId: string,
    checklist: InstallationJob['checklist'],
    readings: { voc: number; isc: number; earth: number; kw: number },
    signature: string
  ) => void
  logServiceTicket: (data: {
    customerName: string
    customerPhone: string
    siteAddress: string
    serialNumber: string
    faultCode: string
    description: string
    priority: ServiceTicket['priority']
  }) => ServiceTicket
  resolveServiceTicket: (ticketNo: string, repairNotes: string, customerConfirmed: boolean) => void
  resetToDefaultData: () => void
}

const SolarStoreContext = createContext<SolarStoreContextType | null>(null)

export function SolarStoreProvider({ children }: { children: React.ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>(() => {
    const saved = localStorage.getItem('sunpower_leads')
    return saved ? JSON.parse(saved) : INITIAL_LEADS
  })

  const [surveys, setSurveys] = useState<SiteSurvey[]>(() => {
    const saved = localStorage.getItem('sunpower_surveys')
    return saved ? JSON.parse(saved) : INITIAL_SURVEYS
  })

  const [quotations, setQuotations] = useState<Quotation[]>(() => {
    const saved = localStorage.getItem('sunpower_quotations')
    return saved ? JSON.parse(saved) : INITIAL_QUOTATIONS
  })

  const [orders, setOrders] = useState<SalesOrder[]>(() => {
    const saved = localStorage.getItem('sunpower_orders')
    return saved ? JSON.parse(saved) : INITIAL_ORDERS
  })

  const [serials, setSerials] = useState<SerialAsset[]>(() => {
    const saved = localStorage.getItem('sunpower_serials')
    return saved ? JSON.parse(saved) : INITIAL_SERIALS
  })

  const [installations, setInstallations] = useState<InstallationJob[]>(() => {
    const saved = localStorage.getItem('sunpower_installations')
    return saved ? JSON.parse(saved) : INITIAL_INSTALLATIONS
  })

  const [warranties, setWarranties] = useState<WarrantyRecord[]>(() => {
    const saved = localStorage.getItem('sunpower_warranties')
    return saved ? JSON.parse(saved) : INITIAL_WARRANTIES
  })

  const [serviceTickets, setServiceTickets] = useState<ServiceTicket[]>(() => {
    const saved = localStorage.getItem('sunpower_service_tickets')
    return saved ? JSON.parse(saved) : INITIAL_SERVICE_TICKETS
  })

  const [subsidies, setSubsidies] = useState<SubsidyRecord[]>(() => {
    const saved = localStorage.getItem('sunpower_subsidies')
    return saved ? JSON.parse(saved) : INITIAL_SUBSIDIES
  })

  const [techPayments, setTechPayments] = useState<TechnicianPaymentRecord[]>(() => {
    const saved = localStorage.getItem('sunpower_tech_payments')
    return saved ? JSON.parse(saved) : INITIAL_TECH_PAYMENTS
  })

  // Synchronize with localStorage
  useEffect(() => {
    localStorage.setItem('sunpower_leads', JSON.stringify(leads))
  }, [leads])
  useEffect(() => {
    localStorage.setItem('sunpower_surveys', JSON.stringify(surveys))
  }, [surveys])
  useEffect(() => {
    localStorage.setItem('sunpower_quotations', JSON.stringify(quotations))
  }, [quotations])
  useEffect(() => {
    localStorage.setItem('sunpower_orders', JSON.stringify(orders))
  }, [orders])
  useEffect(() => {
    localStorage.setItem('sunpower_serials', JSON.stringify(serials))
  }, [serials])
  useEffect(() => {
    localStorage.setItem('sunpower_installations', JSON.stringify(installations))
  }, [installations])
  useEffect(() => {
    localStorage.setItem('sunpower_warranties', JSON.stringify(warranties))
  }, [warranties])
  useEffect(() => {
    localStorage.setItem('sunpower_service_tickets', JSON.stringify(serviceTickets))
  }, [serviceTickets])
  useEffect(() => {
    localStorage.setItem('sunpower_subsidies', JSON.stringify(subsidies))
  }, [subsidies])
  useEffect(() => {
    localStorage.setItem('sunpower_tech_payments', JSON.stringify(techPayments))
  }, [techPayments])

  // --- ACTIONS ---

  const createLead: SolarStoreContextType['createLead'] = (data) => {
    const count = leads.length + 1
    const refNo = `LD-2026-0${count + 80}`
    const newLead: Lead = {
      ...data,
      id: `lead-${Date.now()}`,
      referenceNo: refNo,
      status: 'new',
      createdAt: new Date().toISOString(),
    }
    setLeads((prev) => [newLead, ...prev])
    return newLead
  }

  const scheduleSurvey: SolarStoreContextType['scheduleSurvey'] = (leadId, technicianName, date) => {
    const lead = leads.find((l) => l.id === leadId)
    const count = surveys.length + 1
    const surveyNo = `SRV-2026-00${count + 40}`

    const newSurvey: SiteSurvey = {
      id: `srv-${Date.now()}`,
      surveyNo,
      leadId,
      customerName: lead ? lead.customerName : 'Customer',
      siteAddress: lead ? `${lead.address}, ${lead.city}` : 'Bangalore',
      technicianName,
      technicianId: 'tech-01',
      scheduledDate: date,
      roofAreaSqFt: lead ? lead.roofAreaSqFt : 600,
      shadowFreeAreaSqFt: Math.round((lead ? lead.roofAreaSqFt : 600) * 0.75),
      roofDirection: 'South',
      roofTiltAngle: 14,
      cableDistanceMeters: 25,
      gridSuitability: 'Optimal',
      structuralStrength: 'Good - RCC Slab',
      photos: [
        'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=600&q=80',
      ],
      technicianNotes: 'Scheduled rooftop inspection.',
      status: 'scheduled',
    }

    setSurveys((prev) => [newSurvey, ...prev])
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: 'survey_scheduled', surveyId: newSurvey.id } : l))
    )
    return newSurvey
  }

  const approveSurvey: SolarStoreContextType['approveSurvey'] = (surveyId, approverName) => {
    setSurveys((prev) =>
      prev.map((s) =>
        s.id === surveyId
          ? {
              ...s,
              status: 'approved',
              approvedBy: approverName,
              approvedAt: new Date().toISOString(),
            }
          : s
      )
    )

    const targetSurvey = surveys.find((s) => s.id === surveyId)
    if (targetSurvey) {
      setLeads((prev) =>
        prev.map((l) => (l.id === targetSurvey.leadId ? { ...l, status: 'survey_approved' } : l))
      )
    }
  }

  const rejectSurvey: SolarStoreContextType['rejectSurvey'] = (surveyId, reason) => {
    setSurveys((prev) =>
      prev.map((s) => (s.id === surveyId ? { ...s, status: 'rejected', rejectionReason: reason } : s))
    )
  }

  // CRITICAL BUSINESS RULE: Final quotation blocked until Site Survey is approved!
  const generateQuotation: SolarStoreContextType['generateQuotation'] = (
    leadId,
    capacityKw,
    systemType
  ) => {
    const lead = leads.find((l) => l.id === leadId)
    if (!lead) return { error: 'Customer lead record not found.' }

    const linkedSurvey = surveys.find((s) => s.leadId === leadId || s.id === lead.surveyId)
    if (!linkedSurvey) {
      return {
        error:
          'MANDATORY BUSINESS RULE: Final Quotation blocked. A Site Survey has not been conducted for this site.',
      }
    }
    if (linkedSurvey.status !== 'approved') {
      return {
        error: `MANDATORY BUSINESS RULE: Final Quotation blocked. Site Survey (${linkedSurvey.surveyNo}) is currently '${linkedSurvey.status}'. Engineering approval is strictly required before issuing commercial pricing.`,
      }
    }

    const bom = calculateBOM(capacityKw, systemType, linkedSurvey.cableDistanceMeters)
    const count = quotations.length + 1
    const quoteNo = `QT-2026-00${count + 40}`
    const advanceAmount = Math.round(bom.totalAmount * 0.3)

    const newQuotation: Quotation = {
      id: `quote-${Date.now()}`,
      quotationNo: quoteNo,
      leadId,
      surveyId: linkedSurvey.id,
      customerName: lead.customerName,
      systemCapacityKw: bom.systemCapacityKw,
      systemType,
      bom,
      status: 'approved_ready',
      advanceRequiredPercent: 30,
      advanceAmount,
      createdAt: new Date().toISOString(),
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    }

    setQuotations((prev) => [newQuotation, ...prev])
    setLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, status: 'quoted' } : l)))
    return { quotation: newQuotation }
  }

  const acceptQuotation: SolarStoreContextType['acceptQuotation'] = (quotationId) => {
    const quote = quotations.find((q) => q.id === quotationId)
    if (!quote) throw new Error('Quotation not found')

    setQuotations((prev) =>
      prev.map((q) => (q.id === quotationId ? { ...q, status: 'accepted' } : q))
    )
    setLeads((prev) =>
      prev.map((l) => (l.id === quote.leadId ? { ...l, status: 'won' } : l))
    )

    const orderNo = `SO-2026-00${orders.length + 45}`
    const newOrder: SalesOrder = {
      id: `ord-${Date.now()}`,
      orderNo,
      quotationId,
      customerName: quote.customerName,
      customerPhone: '+91 98450 12345',
      deliveryAddress: 'Bengaluru Site',
      capacityKw: quote.systemCapacityKw,
      systemType: quote.systemType,
      totalAmount: quote.bom.totalAmount,
      paidAmount: quote.advanceAmount, // 30% advance recorded
      balanceAmount: quote.bom.totalAmount - quote.advanceAmount,
      paymentMilestone: 'Advance Received (30%)',
      status: 'staging_warehouse',
      allocatedSerials: [],
      createdAt: new Date().toISOString(),
    }

    setOrders((prev) => [newOrder, ...prev])
    return newOrder
  }

  const recordOrderPayment: SolarStoreContextType['recordOrderPayment'] = (orderId, amount) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const newPaid = ord.paidAmount + amount
          const newBalance = Math.max(0, ord.totalAmount - newPaid)
          let milestone = ord.paymentMilestone
          if (newBalance === 0) milestone = 'Fully Settled'
          else if (newPaid >= ord.totalAmount * 0.8) milestone = 'Commissioned (20%)'
          else if (newPaid >= ord.totalAmount * 0.5) milestone = 'Pre-Dispatch (50%)'

          return {
            ...ord,
            paidAmount: newPaid,
            balanceAmount: newBalance,
            paymentMilestone: milestone,
          }
        }
        return ord
      })
    )
  }

  // SERIAL DISPATCH WITH DUPLICATE DETECTION AND AUTOMATIC WARRANTY ACTIVATION
  const dispatchOrder: SolarStoreContextType['dispatchOrder'] = (orderId, serialsToDispatch) => {
    const order = orders.find((o) => o.id === orderId)
    if (!order) return { success: false, error: 'Order not found.' }

    // Check duplicate dispatch
    for (const s of serialsToDispatch) {
      const existing = serials.find((ser) => ser.serialNumber === s)
      if (existing && existing.status === 'dispatched' && existing.orderId !== orderId) {
        return {
          success: false,
          error: `CRITICAL SERIAL COLLISION: Serial ${s} is already dispatched to customer '${existing.customerName}'. One unit cannot be dispatched twice!`,
        }
      }
    }

    const dispatchTime = new Date().toISOString()
    const dispatchDateStr = dispatchTime.split('T')[0]

    // 1. Update serial status
    setSerials((prev) =>
      prev.map((ser) => {
        if (serialsToDispatch.includes(ser.serialNumber)) {
          return {
            ...ser,
            orderId,
            customerName: order.customerName,
            status: 'dispatched',
            dispatchedAt: dispatchTime,
          }
        }
        return ser
      })
    )

    // 2. Update order to dispatched
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: 'dispatched',
              dispatchDate: dispatchDateStr,
              allocatedSerials: serialsToDispatch,
            }
          : o
      )
    )

    // 3. AUTOMATIC WARRANTY ACTIVATION TRIGGER: Completed delivery / dispatch!
    const newWarranties: WarrantyRecord[] = serialsToDispatch.map((s) => {
      const asset = serials.find((item) => item.serialNumber === s)
      const isPanel = asset?.category === 'panel'
      const duration = isPanel ? 20 : 2 // 20 years for panel, 2 years for inverter/battery

      const expDate = new Date()
      expDate.setFullYear(expDate.getFullYear() + duration)

      return {
        id: `war-${Date.now()}-${s}`,
        certificateNo: `WAR-${asset?.category?.toUpperCase() || 'PV'}-${Date.now().toString().slice(-4)}`,
        serialNumber: s,
        productName: asset ? asset.productName : 'Solar Equipment',
        category: asset?.category || 'inverter',
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        installationId: `inst-${orderId}`,
        orderId,
        startDate: dispatchDateStr, // Delivery completion trigger
        expiryDate: expDate.toISOString().split('T')[0],
        durationYears: duration,
        status: 'active',
        coverageScope: isPanel
          ? '20-Year Linear Power Guarantee (min 80% output at year 20).'
          : '2-Year Full Component Replacement & Zero-Cost Repair Warranty.',
      }
    })

    setWarranties((prev) => [...newWarranties, ...prev])

    // 4. Create or update Installation Job for technicians
    const newJob: InstallationJob = {
      id: `inst-${orderId}`,
      jobNo: `JOB-2026-00${installations.length + 50}`,
      orderId,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      siteAddress: order.deliveryAddress,
      capacityKw: order.capacityKw,
      leadTechnician: 'Mateo Kowalski',
      scheduledDate: dispatchDateStr,
      status: 'assigned',
      checklist: {
        mountingStructureTorqueVerified: false,
        isolationResistanceMeggerTestPassed: false,
        vocAndIscStringVerified: false,
        earthingResistanceLessThan5Ohms: false,
        inverterAntiIslandingFunctional: false,
      },
      photos: [],
    }

    setInstallations((prev) => [newJob, ...prev])
    return { success: true }
  }

  const startInstallation: SolarStoreContextType['startInstallation'] = (jobId) => {
    setInstallations((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, status: 'in_progress', startTime: new Date().toISOString() } : j))
    )
  }

  const completeInstallation: SolarStoreContextType['completeInstallation'] = (
    jobId,
    checklist,
    readings,
    signature
  ) => {
    const completionTime = new Date().toISOString()
    const completionDate = completionTime.split('T')[0]

    setInstallations((prev) =>
      prev.map((j) => {
        if (j.id === jobId) {
          return {
            ...j,
            status: 'commissioned',
            completionTime,
            checklist,
            testedVocVolts: readings.voc,
            testedIscAmps: readings.isc,
            testedEarthResistanceOhms: readings.earth,
            solarGenerationKwReading: readings.kw,
            customerSignature: signature,
            commissioningDate: completionDate,
          }
        }
        return j
      })
    )

    const job = installations.find((j) => j.id === jobId)
    if (job) {
      setOrders((prev) =>
        prev.map((o) => (o.id === job.orderId ? { ...o, status: 'commissioned' } : o))
      )
    }
  }

  const logServiceTicket: SolarStoreContextType['logServiceTicket'] = (data) => {
    const count = serviceTickets.length + 1
    const ticketNo = `SRV-TKT-2026-0${count + 95}`

    // Check warranty eligibility based on serial
    const activeWarranty = warranties.find(
      (w) => w.serialNumber === data.serialNumber && w.status === 'active'
    )
    const isCovered = Boolean(activeWarranty)

    const newTicket: ServiceTicket = {
      id: `tkt-${Date.now()}`,
      ticketNo,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      siteAddress: data.siteAddress,
      serialNumber: data.serialNumber,
      productName: activeWarranty?.productName || 'Solar Equipment Asset',
      faultCode: data.faultCode,
      faultDescription: data.description,
      priority: data.priority,
      status: 'open',
      assignedTechnician: 'Rajesh Kumar',
      warrantyStatus: isCovered ? 'covered_zero_cost' : 'chargeable_out_of_warranty',
      estimatedCost: isCovered ? 0 : 8500,
      finalCost: isCovered ? 0 : 8500,
      repairDetails: isCovered
        ? `Covered under active warranty (#${activeWarranty?.certificateNo}). Zero-cost repair approved.`
        : 'Out of warranty / excluded event. Requires customer paid service quote.',
      customerConfirmationRecorded: false,
      createdAt: new Date().toISOString(),
    }

    setServiceTickets((prev) => [newTicket, ...prev])
    return newTicket
  }

  const resolveServiceTicket: SolarStoreContextType['resolveServiceTicket'] = (
    ticketNo,
    repairNotes,
    customerConfirmed
  ) => {
    setServiceTickets((prev) =>
      prev.map((t) => {
        if (t.ticketNo === ticketNo) {
          return {
            ...t,
            repairDetails: repairNotes,
            customerConfirmationRecorded: customerConfirmed,
            status: customerConfirmed ? 'closed' : 'resolved',
            resolvedAt: new Date().toISOString(),
          }
        }
        return t
      })
    )
  }

  const resetToDefaultData = () => {
    localStorage.clear()
    setLeads(INITIAL_LEADS)
    setSurveys(INITIAL_SURVEYS)
    setQuotations(INITIAL_QUOTATIONS)
    setOrders(INITIAL_ORDERS)
    setSerials(INITIAL_SERIALS)
    setInstallations(INITIAL_INSTALLATIONS)
    setWarranties(INITIAL_WARRANTIES)
    setServiceTickets(INITIAL_SERVICE_TICKETS)
    setSubsidies(INITIAL_SUBSIDIES)
    setTechPayments(INITIAL_TECH_PAYMENTS)
  }

  return (
    <SolarStoreContext.Provider
      value={{
        leads,
        surveys,
        quotations,
        orders,
        serials,
        installations,
        warranties,
        serviceTickets,
        subsidies,
        techPayments,
        createLead,
        scheduleSurvey,
        approveSurvey,
        rejectSurvey,
        generateQuotation,
        acceptQuotation,
        recordOrderPayment,
        dispatchOrder,
        startInstallation,
        completeInstallation,
        logServiceTicket,
        resolveServiceTicket,
        resetToDefaultData,
      }}
    >
      {children}
    </SolarStoreContext.Provider>
  )
}

export function useSolarStore() {
  const context = useContext(SolarStoreContext)
  if (!context) {
    throw new Error('useSolarStore must be used within a SolarStoreProvider')
  }
  return context
}
