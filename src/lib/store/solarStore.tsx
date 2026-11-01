import React, { createContext, useContext, useState, useEffect } from 'react'
import { calculateBOM, type BOMResult } from '@/lib/bom/calculator'

// ==========================================
// 1. DATA MODELS ACROSS THE 7 MODULES
// ==========================================

import { isSupabaseConfigured, backendMode } from '@/lib/supabase/client'


export interface AuthUser {
  profile: 'admin' | 'employee' | 'customer'
  role: 'director' | 'sales' | 'survey' | 'warehouse' | 'coordinator' | 'finance' | 'support' | 'customer'
  name: string
  email: string
}

export interface DigitalPassport {
  id: string
  serialNumber: string
  productName: string
  sku: string
  category: 'panel' | 'inverter' | 'battery' | 'structure'
  manufacturer: string
  model: string
  ratedCapacity: string
  specs: Record<string, string>
  customerName?: string
  customerPhone?: string
  orderId?: string
  installationId?: string
  dispatchDate?: string
  deliveryDate?: string
  warrantyDurationYears: number
  warrantyStatus: 'active' | 'expiring_soon' | 'expired' | 'unregistered'
  qrToken: string
  activityHistory: {
    action: string
    timestamp: string
    actor: string
    remarks?: string
  }[]
}

export interface CustomerProfile {
  id: string
  name: string
  phone: string
  email: string
  address: string
  siteId: string
  discomConsumerId: string
  solarCapacity: string
  capacityKw: number
  systemType: 'on-grid' | 'off-grid'
  schemeRef: string
  sanctionLoad: string
  gridStatus: string
  liveOutputKw: number
  contractValue: number
  installationDate: string
}

export const DEFAULT_CUSTOMER_PROFILE: CustomerProfile = {
  id: 'CUST-2026-038',
  name: 'Siddharth Varma',
  phone: '+91 98860 33412',
  email: 'customer@demo.com',
  address: '77, 8th Main, Koramangala 4th Block, Bengaluru, KA 560034',
  siteId: 'AZ-8422',
  discomConsumerId: 'BESCOM-S4-992014-A',
  solarCapacity: '4.3 kW On-Grid',
  capacityKw: 4.3,
  systemType: 'on-grid',
  schemeRef: 'SURYA-2026-KA-0941',
  sanctionLoad: '5.0 kW',
  gridStatus: 'BESCOM Grid Synchronized • Net Metered',
  liveOutputKw: 3.84,
  contractValue: 245000,
  installationDate: '2026-04-10',
}

export interface InstallationMilestoneEvent {
  milestoneNumber: number
  title: string
  date: string
  actor: string
  status: 'completed' | 'current' | 'pending' | 'blocked'
  remarks?: string
}

export type ServiceTicketStatus =
  | 'new'
  | 'open'
  | 'under_review'
  | 'warranty_verification'
  | 'approved_for_service'
  | 'awaiting_assignment'
  | 'scheduled'
  | 'in_progress'
  | 'diagnosing'
  | 'awaiting_customer_confirmation'
  | 'resolved'
  | 'closed'
  | 'rejected'

export interface PreventiveMaintenanceTask {
  id: string
  taskNo: string
  customerName: string
  siteAddress: string
  capacityKw: number
  lastMaintenanceDate: string
  nextScheduledDate: string
  status: 'upcoming' | 'overdue' | 'completed'
  serviceType: string
  assignedTechnician: string
  remarks?: string
}

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
  status: 'scheduled' | 'pending_approval' | 'approved' | 'rejected' | 'revisit_required' | 'in_progress'
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
  systemType?: 'on-grid' | 'off-grid'
  leadTechnician: string
  scheduledDate: string
  deliveryDate?: string
  status: 'assigned' | 'en_route' | 'in_progress' | 'testing' | 'commissioned' | 'completed'
  currentMilestoneStage?: number
  startTime?: string
  completionTime?: string
  handoverRemarks?: string
  milestones?: InstallationMilestoneEvent[]
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
  passportId?: string
  faultCode: string
  faultDescription: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  status: ServiceTicketStatus
  assignedTechnician: string
  appointmentDate?: string
  warrantyStatus: 'covered_zero_cost' | 'chargeable_out_of_warranty'
  adjudicationReason?: string
  sparePartsUsed?: string[]
  estimatedCost: number
  finalCost: number
  repairDetails?: string
  customerConfirmationRecorded: boolean
  customerSatisfaction?: 'satisfied' | 'unsatisfied'
  closedAt?: string
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
    technicianNotes: 'RCC rooftop with zero shadowing between 9 AM and 4:30 PM. AC mains panel 28m away. High solar irradiance profile.',
    status: 'approved',
    approvedBy: 'Marcus Vance (Director / Chief Engineer)',
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
    id: 'srv-03',
    surveyNo: 'SRV-2026-0043',
    leadId: 'lead-03',
    customerName: 'Green Valley Villas #14',
    siteAddress: 'Villa 14, Prestige Green Valley, Whitefield, Bengaluru',
    technicianName: 'Vikram Singh',
    technicianId: 'tech-03',
    scheduledDate: '2026-11-05',
    roofAreaSqFt: 1100,
    shadowFreeAreaSqFt: 920,
    roofDirection: 'South',
    roofTiltAngle: 12,
    cableDistanceMeters: 18,
    gridSuitability: 'Optimal',
    structuralStrength: 'Good - RCC Slab',
    photos: [
      'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=600&q=80',
    ],
    technicianNotes: 'Site visit scheduled for Wednesday. Client requested preliminary azimuth assessment.',
    status: 'scheduled',
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
    approvedBy: 'Marcus Vance (Director / Chief Engineer)',
    approvedAt: '2026-10-20T17:30:00Z',
  },
  {
    id: 'srv-05',
    surveyNo: 'SRV-2026-0044',
    leadId: 'lead-05',
    customerName: 'Meera Nambiar',
    siteAddress: 'Villa 28, Palm Meadows Phase 1, Airport Road, Bengaluru',
    technicianName: 'Mateo Kowalski',
    technicianId: 'tech-01',
    scheduledDate: '2026-11-01',
    roofAreaSqFt: 720,
    shadowFreeAreaSqFt: 580,
    roofDirection: 'South-East',
    roofTiltAngle: 16,
    cableDistanceMeters: 25,
    gridSuitability: 'Optimal',
    structuralStrength: 'Good - RCC Slab',
    photos: [
      'https://images.unsplash.com/photo-1545209575-7076a5992a54?auto=format&fit=crop&w=600&q=80',
    ],
    technicianNotes: 'Survey engineer currently on site measuring parapet shading and taking azimuth angle readings.',
    status: 'in_progress',
  },
  {
    id: 'srv-06',
    surveyNo: 'SRV-2026-0045',
    leadId: 'lead-06',
    customerName: 'Apex Logistics Hub',
    siteAddress: 'Survey 44, Nelamangala Highway Interchange, Bengaluru',
    technicianName: 'Rajesh Kumar',
    technicianId: 'tech-02',
    scheduledDate: '2026-10-28',
    roofAreaSqFt: 2400,
    shadowFreeAreaSqFt: 1450,
    roofDirection: 'West',
    roofTiltAngle: 8,
    cableDistanceMeters: 62,
    gridSuitability: 'Requires Grid Tie Upgrade',
    structuralStrength: 'Tin Shed - Reinforcement Needed',
    photos: [
      'https://images.unsplash.com/photo-1508873696983-2df57046475b?auto=format&fit=crop&w=600&q=80',
    ],
    technicianNotes: 'Adjacent communication tower creates afternoon shadow. High-mast drone thermography required to determine exact winter horizon angle.',
    status: 'revisit_required',
    rejectionReason: 'Adjacent 35m mobile tower casts winter shadow. Field revisit required with drone 3D horizon photogrammetry before commercial sign-off.',
  },
  {
    id: 'srv-07',
    surveyNo: 'SRV-2026-0036',
    leadId: 'lead-07',
    customerName: 'Kaveri Textile Mills',
    siteAddress: 'Industrial Suburb, Doddaballapur Road, Bengaluru',
    technicianName: 'Amit Sharma',
    technicianId: 'tech-04',
    scheduledDate: '2026-10-18',
    roofAreaSqFt: 3500,
    shadowFreeAreaSqFt: 2200,
    roofDirection: 'North',
    roofTiltAngle: 5,
    cableDistanceMeters: 85,
    gridSuitability: 'Inadequate',
    structuralStrength: 'Tin Shed - Reinforcement Needed',
    photos: [],
    technicianNotes: 'Asbestos fiber cement roofing sheets degraded. High structural risk under 150 km/h wind shear.',
    status: 'rejected',
    rejectionReason: 'Brittle asbestos roof structure fails statutory IS 875 load testing. BESCOM feeder transformer operating at 98% capacity with zero net-metering headroom.',
  },
];

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
    certificateNo: 'WAR-INV-2026-8422',
    serialNumber: 'INV-GW3K-8422',
    productName: 'Growatt 3.3kW Single-Phase Grid-Tied Inverter (MIN 3300TL-X)',
    category: 'inverter',
    customerName: 'Siddharth Varma', customerPhone: '+91 98860 33412',
    installationId: 'inst-8422',
    orderId: 'ord-8422',
    startDate: '2026-04-10',
    expiryDate: '2031-04-10',
    durationYears: 5,
    status: 'active',
    coverageScope: 'Zero-cost replacement warranty covering internal MPPT circuit, IGBT modules, Wi-Fi datalogger, and AC/DC surge suppressors. Guaranteed 24-hour turnaround SLA.',
  },
  {
    id: 'war-02',
    certificateNo: 'WAR-PNL-2026-8422',
    serialNumber: 'PNL-WAA-540-0891',
    productName: 'Waaree 540W Mono PERC Bifacial Solar PV Array (6 Modules)',
    category: 'panel',
    customerName: 'Siddharth Varma', customerPhone: '+91 98860 33412',
    installationId: 'inst-8422',
    orderId: 'ord-8422',
    startDate: '2026-04-10',
    expiryDate: '2051-04-10',
    durationYears: 25,
    status: 'active',
    coverageScope: '25-Year Linear Power Degradation Warranty: >= 98% nominal power in Year 1, <= 0.55% annual degradation, guaranteeing >= 84.8% peak output at Year 25. IEC 61215/61730 certified.',
  },
  {
    id: 'war-03',
    certificateNo: 'WAR-BOS-2026-8422',
    serialNumber: 'BOS-STR-ALU-8422',
    productName: 'SunPower HDG Anodized Aluminium Mounting Structure & DC Balance of System',
    category: 'panel',
    customerName: 'Siddharth Varma', customerPhone: '+91 98860 33412',
    installationId: 'inst-8422',
    orderId: 'ord-8422',
    startDate: '2026-04-10',
    expiryDate: '2036-04-10',
    durationYears: 10,
    status: 'active',
    coverageScope: '10-Year Mechanical Structural Guarantee against galvanic corrosion and wind speeds up to 170 km/h (IS 875 Part 3 compliant).',
  },
  {
    id: 'war-04',
    certificateNo: 'WAR-INV-2025-019',
    serialNumber: 'INV-3300-8491',
    productName: 'Solis 3.3kW Single-Phase Grid-Tied Inverter',
    category: 'inverter',
    customerName: 'Vikramaditya Rao',
    customerPhone: '+91 98451 99012',
    installationId: 'inst-00',
    orderId: 'ord-00',
    startDate: '2025-04-12',
    expiryDate: '2027-04-12',
    durationYears: 2,
    status: 'active',
    coverageScope: 'Full replacement / component repair for internal electrical faults. Excludes lightning direct hit.',
  },
  {
    id: 'war-05',
    certificateNo: 'WAR-PNL-2025-012',
    serialNumber: 'PNL-540W-0012',
    productName: 'Adani Solar 540W Mono PERC Module',
    category: 'panel',
    customerName: 'Vikramaditya Rao',
    customerPhone: '+91 98451 99012',
    installationId: 'inst-00',
    orderId: 'ord-00',
    startDate: '2025-04-12',
    expiryDate: '2045-04-12',
    durationYears: 20,
    status: 'active',
    coverageScope: 'Linear power performance guarantee: 90% peak output at 10 years, 80% at 20 years.',
  },
  {
    id: 'war-06',
    certificateNo: 'WAR-BAT-2025-004',
    serialNumber: 'BAT-LFP-48100-04',
    productName: 'SunPower 48V 100Ah LiFePO4 Lithium Battery Storage',
    category: 'battery',
    customerName: 'Vikramaditya Rao',
    customerPhone: '+91 98451 99012',
    installationId: 'inst-00',
    orderId: 'ord-00',
    startDate: '2025-04-12',
    expiryDate: '2030-04-12',
    durationYears: 5,
    status: 'active',
    coverageScope: '5-Year / 6,000 Cycle Warranty guaranteeing >= 70% state-of-health retention under standard C/2 operating temperatures.',
  },
];


const INITIAL_PASSPORTS: DigitalPassport[] = [
  {
    id: 'dp-01',
    serialNumber: 'INV-3300-8491',
    productName: 'Solis 3.3kW Single-Phase On-Grid Inverter',
    sku: 'INV-SOLIS-3.3K',
    category: 'inverter',
    manufacturer: 'Ginlong Solis Technologies',
    model: 'S5-GR1P3.3K',
    ratedCapacity: '3.3 kW AC / 4.5 kW DC Input',
    specs: {
      'Max Efficiency': '97.7%',
      'MPPT Voltage Range': '90V - 550V',
      'Protection Degree': 'IP65 Weatherproof',
      'Cooling': 'Natural Convection',
    },
    customerName: 'Siddharth Varma',
    customerPhone: '+91 98860 33412',
    orderId: 'ord-01',
    installationId: 'inst-01',
    dispatchDate: '2026-10-25',
    deliveryDate: '2026-10-26',
    warrantyDurationYears: 5,
    warrantyStatus: 'active',
    qrToken: 'sunpower://passport/dp-01',
    activityHistory: [
      { action: 'Inward Warehouse Receipt', timestamp: '2026-10-15 10:30', actor: 'Vikram Singh (Warehouse Manager)', remarks: 'QC passed with OEM factory test calibration certificate.' },
      { action: 'Allocated to Sales Order', timestamp: '2026-10-22 14:15', actor: 'Elena Rostova (Sales Exec)', remarks: 'Reserved for Siddharth Varma 4.3kW rooftop project.' },
      { action: 'Dispatched to Site', timestamp: '2026-10-25 09:00', actor: 'Vikram Singh (Warehouse Manager)', remarks: 'Loaded on delivery fleet vehicle KA-04-E-8812.' },
      { action: 'Delivery Completed & Warranty Clock Started', timestamp: '2026-10-26 11:30', actor: 'Logistics Fleet Driver', remarks: 'Delivered at Indiranagar site. 5-Year warranty clock started.' },
      { action: 'Commissioned & Safety Tested', timestamp: '2026-10-28 15:45', actor: 'Mateo Kowalski (Lead Tech)', remarks: 'Megger and anti-islanding passed.' }
    ]
  },
  {
    id: 'dp-02',
    serialNumber: 'INV-4000-9102',
    productName: 'Growatt 5.0kW Hybrid Energy Storage Inverter',
    sku: 'INV-GW-5K-H',
    category: 'inverter',
    manufacturer: 'Shenzhen Growatt New Energy',
    model: 'SPH 5000TL BL-UP',
    ratedCapacity: '5.0 kW AC / 8.0 kW DC Peak',
    specs: {
      'Max Efficiency': '97.5%',
      'Battery Voltage': '48V Low Voltage',
      'EPS Switch Time': '< 10ms UPS grade',
    },
    customerName: 'Siddharth Varma',
    customerPhone: '+91 98860 33412',
    orderId: 'ord-02',
    installationId: 'inst-02',
    dispatchDate: '2026-10-28',
    deliveryDate: '2026-10-29',
    warrantyDurationYears: 5,
    warrantyStatus: 'active',
    qrToken: 'sunpower://passport/dp-02',
    activityHistory: [
      { action: 'Inward Warehouse Receipt', timestamp: '2026-10-18 11:00', actor: 'Vikram Singh (Warehouse Manager)' },
      { action: 'Allocated to Order', timestamp: '2026-10-27 16:00', actor: 'Elena Rostova (Sales Exec)' },
      { action: 'Delivered & Warranty Clock Started', timestamp: '2026-10-29 14:00', actor: 'Logistics Fleet', remarks: 'Warranty coverage active.' }
    ]
  },
  {
    id: 'dp-03',
    serialNumber: 'BAT-48V-9932',
    productName: 'Pylontech US3000C 3.55kWh LiFePO4 Battery Module',
    sku: 'BAT-PYL-3.5K',
    category: 'battery',
    manufacturer: 'Pylon Technologies Co., Ltd.',
    model: 'US3000C',
    ratedCapacity: '3.55 kWh / 48V / 74Ah',
    specs: {
      'Chemistry': 'Lithium Iron Phosphate (LiFePO4)',
      'DoD': '95%',
      'Cycle Life': '> 6,000 Cycles @ 25°C',
    },
    customerName: 'Siddharth Varma',
    customerPhone: '+91 98860 33412',
    orderId: 'ord-02',
    installationId: 'inst-02',
    dispatchDate: '2026-10-28',
    deliveryDate: '2026-10-29',
    warrantyDurationYears: 5,
    warrantyStatus: 'active',
    qrToken: 'sunpower://passport/dp-03',
    activityHistory: [
      { action: 'Inward Warehouse Receipt', timestamp: '2026-10-18 11:30', actor: 'Vikram Singh (Warehouse Manager)' },
      { action: 'Delivered to Site', timestamp: '2026-10-29 14:00', actor: 'Logistics Fleet' }
    ]
  },
  {
    id: 'dp-04',
    serialNumber: 'PNL-550W-0041',
    productName: 'Waaree 550W Bifacial TOPCon High Efficiency Module',
    sku: 'PNL-WR-550W',
    category: 'panel',
    manufacturer: 'Waaree Energies Ltd.',
    model: 'Arka Series 550W',
    ratedCapacity: '550 Watts Peak (STC)',
    specs: {
      'Module Efficiency': '21.3%',
      'Bifaciality Factor': '70 ± 5%',
      'Cell Type': 'N-Type TOPCon 144 Half-Cells',
      'Dimensions': '2278 x 1134 x 35 mm',
    },
    customerName: 'Anand Kumar Sharma',
    customerPhone: '+91 98450 12345',
    orderId: 'ord-01',
    installationId: 'inst-01',
    dispatchDate: '2026-10-25',
    deliveryDate: '2026-10-26',
    warrantyDurationYears: 25,
    warrantyStatus: 'active',
    qrToken: 'sunpower://passport/dp-04',
    activityHistory: [
      { action: 'Inward Warehouse Receipt', timestamp: '2026-10-12 09:15', actor: 'Vikram Singh (Warehouse Manager)' },
      { action: 'Dispatched to Site', timestamp: '2026-10-25 09:00', actor: 'Vikram Singh (Warehouse Manager)' },
      { action: 'Delivery Completed & 25-Yr Performance Guarantee Started', timestamp: '2026-10-26 11:30', actor: 'Logistics Fleet' }
    ]
  },
  {
    id: 'dp-05',
    serialNumber: 'INV-2026-8819',
    productName: 'Solis 5kW 3-Phase Grid-Tied Inverter',
    sku: 'INV-SOLIS-5K-3P',
    category: 'inverter',
    manufacturer: 'Ginlong Solis Technologies',
    model: 'S5-GR3P5K',
    ratedCapacity: '5.0 kW AC',
    specs: {
      'Max Efficiency': '98.3%',
      'MPPT Channels': '2 Dual MPPT',
    },
    warrantyDurationYears: 5,
    warrantyStatus: 'unregistered',
    qrToken: 'sunpower://passport/dp-05',
    activityHistory: [
      { action: 'Inward Warehouse Receipt', timestamp: '2026-10-28 14:00', actor: 'Vikram Singh (Warehouse Manager)', remarks: 'Stored in Bay B-04. Ready for allocation.' }
    ]
  }
];

const INITIAL_PREVENTIVE_TASKS: PreventiveMaintenanceTask[] = [
  {
    id: 'pm-01',
    taskNo: 'PM-2026-0012',
    customerName: 'Vikramaditya Rao',
    siteAddress: '19, 1st Cross, Dollars Colony, Bengaluru',
    capacityKw: 3,
    lastMaintenanceDate: '2026-07-15',
    nextScheduledDate: '2026-11-15',
    status: 'upcoming',
    serviceType: 'Quarterly Inverter & Array Inspection',
    assignedTechnician: 'Rajesh Kumar',
    remarks: 'Check DC terminal torque, clean PV module glass, inspect SPD cartridges.',
  },
  {
    id: 'pm-02',
    taskNo: 'PM-2026-0008',
    customerName: 'Siddharth Varma',
    siteAddress: '77, 8th Main, Koramangala 4th Block, Bengaluru',
    capacityKw: 4,
    lastMaintenanceDate: '2026-04-10',
    nextScheduledDate: '2026-10-10',
    status: 'overdue',
    serviceType: 'Semi-Annual String & Megger Audit',
    assignedTechnician: 'Mateo Kowalski',
    remarks: 'Overdue by 21 days: Customer requested scheduling after Diwali festival.',
  },
  {
    id: 'pm-03',
    taskNo: 'PM-2026-0015',
    customerName: 'Precision Tools & Castings Ltd',
    siteAddress: 'Plot 12, Peenya Industrial Area Phase 2, Bengaluru',
    capacityKw: 10,
    lastMaintenanceDate: '2026-08-01',
    nextScheduledDate: '2026-11-05',
    status: 'upcoming',
    serviceType: 'Annual Health Check & Thermography Scan',
    assignedTechnician: 'Vikram Singh',
    remarks: 'Thermal imaging of high-current DC combiner box and transformer interface.',
  }
];

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
  backendMode: 'demo' | 'production'
    isBackendConnected: boolean
  currentUser: AuthUser
  setAuthUser: (user: Partial<AuthUser>) => void
  customerProfile: CustomerProfile
  updateCustomerProfile: (updates: Partial<CustomerProfile>) => void
  passports: DigitalPassport[]
  registerPassport: (data: Omit<DigitalPassport, 'id' | 'qrToken' | 'activityHistory'>) => { passport?: DigitalPassport; error?: string }
  completeDelivery: (orderId: string, deliveryDate: string) => void
  updateInstallationMilestone: (jobId: string, milestoneIndex: number, status: 'completed' | 'current' | 'pending') => void
  advanceServiceTicketStatus: (ticketNo: string, nextStatus: ServiceTicketStatus, remarks?: string) => { success: boolean; error?: string }
  preventiveTasks: PreventiveMaintenanceTask[]
  completePreventiveTask: (taskId: string, remarks: string) => void

  // Action Methods
  createLead: (data: Omit<Lead, 'id' | 'referenceNo' | 'createdAt' | 'status'>) => Lead
  scheduleSurvey: (leadId: string, technicianName: string, date: string) => SiteSurvey
  approveSurvey: (surveyId: string, approverName: string) => void
  rejectSurvey: (surveyId: string, reason: string) => void
  revisitSurvey: (surveyId: string, reason: string) => void
  startInspection: (surveyId: string) => void
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

  const [currentUser, setCurrentUser] = useState<AuthUser>(() => {
    try {
      const saved = localStorage.getItem('sunpower_current_user')
      if (saved) return JSON.parse(saved)
    } catch (e) {}
    return {
      profile: 'admin',
      role: 'director',
      name: 'Marcus Vance',
      email: 'admin@sunpower-solutions.com',
    }
  })

  const [passports, setPassports] = useState<DigitalPassport[]>(() => {
    try {
      const saved = localStorage.getItem('sunpower_passports')
      if (saved) return JSON.parse(saved)
    } catch (e) {}
    return INITIAL_PASSPORTS
  })

  const [preventiveTasks, setPreventiveTasks] = useState<PreventiveMaintenanceTask[]>(() => {
    try {
      const saved = localStorage.getItem('sunpower_preventive')
      if (saved) return JSON.parse(saved)
    } catch (e) {}
    return INITIAL_PREVENTIVE_TASKS
  })

  const [customerProfile, setCustomerProfile] = useState<CustomerProfile>(() => {
    try {
      const saved = localStorage.getItem('sunpower_customer_profile');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_CUSTOMER_PROFILE;
  });

  const updateCustomerProfile: SolarStoreContextType['updateCustomerProfile'] = (updates) => {
    setCustomerProfile((prev: CustomerProfile) => {
      const updated = { ...prev, ...updates };
      try {
        localStorage.setItem('sunpower_customer_profile', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const setAuthUser: SolarStoreContextType['setAuthUser'] = (user) => {
    setCurrentUser((prev) => {
      const updated = { ...prev, ...user };
      try {
        localStorage.setItem('sunpower_current_user', JSON.stringify(updated));
      } catch (e) {}
      if (updated.profile === 'customer' && updated.name) {
        setCustomerProfile((cp: CustomerProfile) => {
          const next = { ...cp, name: updated.name };
          try {
            localStorage.setItem('sunpower_customer_profile', JSON.stringify(next));
          } catch (e) {}
          return next;
        });
      }
      return updated;
    });
  };

  const registerPassport: SolarStoreContextType['registerPassport'] = (data) => {
    // Prevent duplicate serial registration
    const existing = passports.find(p => p.serialNumber.toUpperCase() === data.serialNumber.toUpperCase())
    if (existing) {
      return { error: `Duplicate Serial Conflict: ${data.serialNumber} is already registered under Passport #${existing.id}.` }
    }

    const count = passports.length + 1
    const id = `dp-0${count}`
    const newPassport: DigitalPassport = {
      ...data,
      id,
      qrToken: `sunpower://passport/${id}`,
      activityHistory: [
        {
          action: 'Equipment Registered into Digital Passport & QR Registry',
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
          actor: currentUser.name,
          remarks: 'Initial factory registration with unique QR identifier.'
        }
      ]
    }

    setPassports(prev => {
      const updated = [newPassport, ...prev]
      localStorage.setItem('sunpower_passports', JSON.stringify(updated))
      return updated
    })

    return { passport: newPassport }
  }

  const completeDelivery: SolarStoreContextType['completeDelivery'] = (orderId, deliveryDate) => {
    // 1. Update order status
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'installed' } : o))

    // 2. Locate order and allocated serials
    const targetOrder = orders.find(o => o.id === orderId)
    if (!targetOrder) return

    // 3. Update serials to active_under_warranty
    setSerials(prev => prev.map(s => {
      if (s.orderId === orderId || targetOrder.allocatedSerials.includes(s.serialNumber)) {
        return { ...s, status: 'active_under_warranty' }
      }
      return s
    }))

    // 4. Update digital passports with deliveryDate and start warranty
    setPassports(prev => prev.map(p => {
      if (p.orderId === orderId || targetOrder.allocatedSerials.includes(p.serialNumber)) {
        return {
          ...p,
          deliveryDate,
          warrantyStatus: 'active',
          activityHistory: [
            ...p.activityHistory,
            {
              action: 'Delivery Completed at Customer Site & Warranty Clock Started',
              timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
              actor: currentUser.name,
              remarks: `Delivered to ${targetOrder.deliveryAddress}. Warranty clock officially started.`
            }
          ]
        }
      }
      return p
    }))

    // 5. Activate or update warranty record with startDate = deliveryDate
    setWarranties(prev => prev.map(w => {
      if (w.orderId === orderId || targetOrder.allocatedSerials.includes(w.serialNumber)) {
        const exp = new Date(deliveryDate)
        exp.setFullYear(exp.getFullYear() + w.durationYears)
        return {
          ...w,
          startDate: deliveryDate,
          expiryDate: exp.toISOString().split('T')[0],
          status: 'active'
        }
      }
      return w
    }))
  }

  const updateInstallationMilestone: SolarStoreContextType['updateInstallationMilestone'] = (jobId, milestoneIndex, status) => {
    setInstallations(prev => prev.map(j => {
      if (j.id === jobId) {
        return {
          ...j,
          currentMilestoneStage: milestoneIndex
        }
      }
      return j
    }))
  }

  const advanceServiceTicketStatus: SolarStoreContextType['advanceServiceTicketStatus'] = (ticketNo, nextStatus, remarks) => {
    const target = serviceTickets.find(t => t.ticketNo === ticketNo)
    if (!target) return { success: false, error: 'Ticket not found' }

    // Critical constraint: Cannot close ticket without customer confirmation
    if (nextStatus === 'closed' && !target.customerConfirmationRecorded) {
      return {
        success: false,
        error: 'Mandatory Policy: Service ticket cannot be closed without recorded customer confirmation.'
      }
    }

    setServiceTickets(prev => prev.map(t => {
      if (t.ticketNo === ticketNo) {
        return {
          ...t,
          status: nextStatus,
          repairDetails: remarks || t.repairDetails,
          resolvedAt: nextStatus === 'resolved' ? new Date().toISOString() : t.resolvedAt,
          closedAt: nextStatus === 'closed' ? new Date().toISOString() : t.closedAt
        }
      }
      return t
    }))

    return { success: true }
  }

  const completePreventiveTask: SolarStoreContextType['completePreventiveTask'] = (taskId, remarks) => {
    setPreventiveTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          status: 'completed',
          lastMaintenanceDate: new Date().toISOString().split('T')[0],
          remarks: remarks || task.remarks
        }
      }
      return task
    }))
  }

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

  const revisitSurvey: SolarStoreContextType['revisitSurvey'] = (surveyId, reason) => {
    setSurveys((prev) =>
      prev.map((s) => (s.id === surveyId ? { ...s, status: 'revisit_required', rejectionReason: reason } : s))
    )
  }

  const startInspection: SolarStoreContextType['startInspection'] = (surveyId) => {
    setSurveys((prev) =>
      prev.map((s) => (s.id === surveyId ? { ...s, status: 'in_progress' } : s))
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
        currentUser,
        setAuthUser,
        customerProfile,
        updateCustomerProfile,
        passports,
        registerPassport,
        completeDelivery,
        updateInstallationMilestone,
        advanceServiceTicketStatus,
        preventiveTasks,
        completePreventiveTask,
        quotations,
        orders,
        serials,
        installations,
        warranties,
        serviceTickets,
        subsidies,
        techPayments,
        backendMode,
        isBackendConnected: isSupabaseConfigured,
        createLead,
        scheduleSurvey,
        approveSurvey,
        rejectSurvey,
        revisitSurvey,
        startInspection,
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
