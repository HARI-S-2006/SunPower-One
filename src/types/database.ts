// Database types will be generated from Supabase schema
// Run: npm run db:generate (after Supabase is configured)

export interface Database {
  public: {
    Tables: {
      // Identity & Organization
      organizations: {
        Row: Organization
        Insert: OrganizationInsert
        Update: OrganizationUpdate
      }
      profiles: {
        Row: Profile
        Insert: ProfileInsert
        Update: ProfileUpdate
      }
      organization_members: {
        Row: OrganizationMember
        Insert: OrganizationMemberInsert
        Update: OrganizationMemberUpdate
      }
      role_permissions: {
        Row: RolePermission
        Insert: RolePermissionInsert
        Update: RolePermissionUpdate
      }

      // CRM
      customers: {
        Row: Customer
        Insert: CustomerInsert
        Update: CustomerUpdate
      }
      customer_contacts: {
        Row: CustomerContact
        Insert: CustomerContactInsert
        Update: CustomerContactUpdate
      }
      customer_addresses: {
        Row: CustomerAddress
        Insert: CustomerAddressInsert
        Update: CustomerAddressUpdate
      }
      leads: {
        Row: Lead
        Insert: LeadInsert
        Update: LeadUpdate
      }
      lead_sources: {
        Row: LeadSource
        Insert: LeadSourceInsert
        Update: LeadSourceUpdate
      }
      lead_activities: {
        Row: LeadActivity
        Insert: LeadActivityInsert
        Update: LeadActivityUpdate
      }
      follow_ups: {
        Row: FollowUp
        Insert: FollowUpInsert
        Update: FollowUpUpdate
      }

      // Survey
      survey_requests: {
        Row: SurveyRequest
        Insert: SurveyRequestInsert
        Update: SurveyRequestUpdate
      }
      surveys: {
        Row: Survey
        Insert: SurveyInsert
        Update: SurveyUpdate
      }
      survey_measurements: {
        Row: SurveyMeasurement
        Insert: SurveyMeasurementInsert
        Update: SurveyMeasurementUpdate
      }
      survey_photos: {
        Row: SurveyPhoto
        Insert: SurveyPhotoInsert
        Update: SurveyPhotoUpdate
      }
      survey_approvals: {
        Row: SurveyApproval
        Insert: SurveyApprovalInsert
        Update: SurveyApprovalUpdate
      }

      // Products & BOM
      product_categories: {
        Row: ProductCategory
        Insert: ProductCategoryInsert
        Update: ProductCategoryUpdate
      }
      products: {
        Row: Product
        Insert: ProductInsert
        Update: ProductUpdate
      }
      product_specifications: {
        Row: ProductSpecification
        Insert: ProductSpecificationInsert
        Update: ProductSpecificationUpdate
      }
      solar_packages: {
        Row: SolarPackage
        Insert: SolarPackageInsert
        Update: SolarPackageUpdate
      }
      package_components: {
        Row: PackageComponent
        Insert: PackageComponentInsert
        Update: PackageComponentUpdate
      }
      solar_configurations: {
        Row: SolarConfiguration
        Insert: SolarConfigurationInsert
        Update: SolarConfigurationUpdate
      }
      bom_templates: {
        Row: BomTemplate
        Insert: BomTemplateInsert
        Update: BomTemplateUpdate
      }
      bom_rules: {
        Row: BomRule
        Insert: BomRuleInsert
        Update: BomRuleUpdate
      }
      bom_records: {
        Row: BomRecord
        Insert: BomRecordInsert
        Update: BomRecordUpdate
      }
      bom_items: {
        Row: BomItem
        Insert: BomItemInsert
        Update: BomItemUpdate
      }
      warranty_policies: {
        Row: WarrantyPolicy
        Insert: WarrantyPolicyInsert
        Update: WarrantyPolicyUpdate
      }

      // Sales
      quotations: {
        Row: Quotation
        Insert: QuotationInsert
        Update: QuotationUpdate
      }
      quotation_items: {
        Row: QuotationItem
        Insert: QuotationItemInsert
        Update: QuotationItemUpdate
      }
      quotation_versions: {
        Row: QuotationVersion
        Insert: QuotationVersionInsert
        Update: QuotationVersionUpdate
      }
      sales_orders: {
        Row: SalesOrder
        Insert: SalesOrderInsert
        Update: SalesOrderUpdate
      }
      sales_order_items: {
        Row: SalesOrderItem
        Insert: SalesOrderItemInsert
        Update: SalesOrderItemUpdate
      }
      payment_milestones: {
        Row: PaymentMilestone
        Insert: PaymentMilestoneInsert
        Update: PaymentMilestoneUpdate
      }
      payments: {
        Row: Payment
        Insert: PaymentInsert
        Update: PaymentUpdate
      }
      payment_allocations: {
        Row: PaymentAllocation
        Insert: PaymentAllocationInsert
        Update: PaymentAllocationUpdate
      }

      // Inventory
      suppliers: {
        Row: Supplier
        Insert: SupplierInsert
        Update: SupplierUpdate
      }
      purchase_orders: {
        Row: PurchaseOrder
        Insert: PurchaseOrderInsert
        Update: PurchaseOrderUpdate
      }
      purchase_order_items: {
        Row: PurchaseOrderItem
        Insert: PurchaseOrderItemInsert
        Update: PurchaseOrderItemUpdate
      }
      warehouse_locations: {
        Row: WarehouseLocation
        Insert: WarehouseLocationInsert
        Update: WarehouseLocationUpdate
      }
      stock_movements: {
        Row: StockMovement
        Insert: StockMovementInsert
        Update: StockMovementUpdate
      }
      stock_reservations: {
        Row: StockReservation
        Insert: StockReservationInsert
        Update: StockReservationUpdate
      }
      inventory_adjustments: {
        Row: InventoryAdjustment
        Insert: InventoryAdjustmentInsert
        Update: InventoryAdjustmentUpdate
      }
      serial_units: {
        Row: SerialUnit
        Insert: SerialUnitInsert
        Update: SerialUnitUpdate
      }
      dispatches: {
        Row: Dispatch
        Insert: DispatchInsert
        Update: DispatchUpdate
      }
      dispatch_items: {
        Row: DispatchItem
        Insert: DispatchItemInsert
        Update: DispatchItemUpdate
      }

      // Installation
      technicians: {
        Row: Technician
        Insert: TechnicianInsert
        Update: TechnicianUpdate
      }
      technician_skills: {
        Row: TechnicianSkill
        Insert: TechnicianSkillInsert
        Update: TechnicianSkillUpdate
      }
      technician_availability: {
        Row: TechnicianAvailability
        Insert: TechnicianAvailabilityInsert
        Update: TechnicianAvailabilityUpdate
      }
      installations: {
        Row: Installation
        Insert: InstallationInsert
        Update: InstallationUpdate
      }
      installation_assignments: {
        Row: InstallationAssignment
        Insert: InstallationAssignmentInsert
        Update: InstallationAssignmentUpdate
      }
      installation_checklists: {
        Row: InstallationChecklist
        Insert: InstallationChecklistInsert
        Update: InstallationChecklistUpdate
      }
      installation_checklist_items: {
        Row: InstallationChecklistItem
        Insert: InstallationChecklistItemInsert
        Update: InstallationChecklistItemUpdate
      }
      installation_evidence: {
        Row: InstallationEvidence
        Insert: InstallationEvidenceInsert
        Update: InstallationEvidenceUpdate
      }
      installation_tests: {
        Row: InstallationTest
        Insert: InstallationTestInsert
        Update: InstallationTestUpdate
      }
      customer_acceptances: {
        Row: CustomerAcceptance
        Insert: CustomerAcceptanceInsert
        Update: CustomerAcceptanceUpdate
      }

      // Warranty & Service
      warranties: {
        Row: Warranty
        Insert: WarrantyInsert
        Update: WarrantyUpdate
      }
      warranty_claims: {
        Row: WarrantyClaim
        Insert: WarrantyClaimInsert
        Update: WarrantyClaimUpdate
      }
      service_tickets: {
        Row: ServiceTicket
        Insert: ServiceTicketInsert
        Update: ServiceTicketUpdate
      }
      service_assignments: {
        Row: ServiceAssignment
        Insert: ServiceAssignmentInsert
        Update: ServiceAssignmentUpdate
      }
      service_updates: {
        Row: ServiceUpdate
        Insert: ServiceUpdateInsert
        Update: ServiceUpdateUpdate
      }
      repair_records: {
        Row: RepairRecord
        Insert: RepairRecordInsert
        Update: RepairRecordUpdate
      }
      repair_parts: {
        Row: RepairPart
        Insert: RepairPartInsert
        Update: RepairPartUpdate
      }
      replacement_records: {
        Row: ReplacementRecord
        Insert: ReplacementRecordInsert
        Update: ReplacementRecordUpdate
      }

      // Finance & Subsidy
      invoices: {
        Row: Invoice
        Insert: InvoiceInsert
        Update: InvoiceUpdate
      }
      invoice_items: {
        Row: InvoiceItem
        Insert: InvoiceItemInsert
        Update: InvoiceItemUpdate
      }
      expenses: {
        Row: Expense
        Insert: ExpenseInsert
        Update: ExpenseUpdate
      }
      expense_categories: {
        Row: ExpenseCategory
        Insert: ExpenseCategoryInsert
        Update: ExpenseCategoryUpdate
      }
      vendor_bills: {
        Row: VendorBill
        Insert: VendorBillInsert
        Update: VendorBillUpdate
      }
      vendor_bill_items: {
        Row: VendorBillItem
        Insert: VendorBillItemInsert
        Update: VendorBillItemUpdate
      }
      technician_payables: {
        Row: TechnicianPayable
        Insert: TechnicianPayableInsert
        Update: TechnicianPayableUpdate
      }
      technician_payments: {
        Row: TechnicianPayment
        Insert: TechnicianPaymentInsert
        Update: TechnicianPaymentUpdate
      }
      job_costs: {
        Row: JobCost
        Insert: JobCostInsert
        Update: JobCostUpdate
      }
      subsidy_applications: {
        Row: SubsidyApplication
        Insert: SubsidyApplicationInsert
        Update: SubsidyApplicationUpdate
      }
      subsidy_documents: {
        Row: SubsidyDocument
        Insert: SubsidyDocumentInsert
        Update: SubsidyDocumentUpdate
      }
      subsidy_status_history: {
        Row: SubsidyStatusHistory
        Insert: SubsidyStatusHistoryInsert
        Update: SubsidyStatusHistoryUpdate
      }

      // Shared
      notifications: {
        Row: Notification
        Insert: NotificationInsert
        Update: NotificationUpdate
      }
      notification_preferences: {
        Row: NotificationPreference
        Insert: NotificationPreferenceInsert
        Update: NotificationPreferenceUpdate
      }
      audit_logs: {
        Row: AuditLog
        Insert: AuditLogInsert
        Update: AuditLogUpdate
      }
      activity_logs: {
        Row: ActivityLog
        Insert: ActivityLogInsert
        Update: ActivityLogUpdate
      }
      application_settings: {
        Row: ApplicationSetting
        Insert: ApplicationSettingInsert
        Update: ApplicationSettingUpdate
      }
      document_metadata: {
        Row: DocumentMetadata
        Insert: DocumentMetadataInsert
        Update: DocumentMetadataUpdate
      }
      integration_settings: {
        Row: IntegrationSetting
        Insert: IntegrationSettingInsert
        Update: IntegrationSettingUpdate
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'super_admin' | 'director' | 'sales_executive' | 'survey_technician' | 'warehouse_manager' | 'installation_technician' | 'finance_executive' | 'support_executive' | 'customer'
      lead_status: 'new' | 'contacted' | 'qualified' | 'survey_scheduled' | 'survey_completed' | 'quoted' | 'won' | 'lost'
      survey_status: 'scheduled' | 'in_progress' | 'submitted' | 'approved' | 'rejected'
      quotation_status: 'draft' | 'pending_approval' | 'approved' | 'sent' | 'accepted' | 'rejected' | 'expired'
      order_status: 'confirmed' | 'payment_pending' | 'payment_received' | 'in_production' | 'ready_for_dispatch' | 'dispatched' | 'delivered' | 'cancelled'
      payment_status: 'pending' | 'completed' | 'failed' | 'refunded' | 'partial'
      inventory_status: 'available' | 'reserved' | 'dispatched' | 'delivered' | 'damaged' | 'returned'
      installation_status: 'scheduled' | 'in_progress' | 'completed' | 'on_hold' | 'cancelled'
      warranty_status: 'active' | 'expired' | 'claimed' | 'voided'
      ticket_status: 'open' | 'assigned' | 'in_progress' | 'pending_customer' | 'resolved' | 'closed'
      subsidy_status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'disbursed'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Placeholder type definitions - replace with generated types
export type Organization = { id: string; name: string; created_at: string; updated_at: string }
export type OrganizationInsert = Omit<Organization, 'id' | 'created_at' | 'updated_at'>
export type OrganizationUpdate = Partial<OrganizationInsert>

export type Profile = { id: string; organization_id: string; email: string; full_name: string; role: string; avatar_url: string | null; created_at: string; updated_at: string }
export type ProfileInsert = Omit<Profile, 'id' | 'created_at' | 'updated_at'>
export type ProfileUpdate = Partial<ProfileInsert>

export type OrganizationMember = { id: string; organization_id: string; profile_id: string; role: string; created_at: string }
export type OrganizationMemberInsert = Omit<OrganizationMember, 'id' | 'created_at'>
export type OrganizationMemberUpdate = Partial<OrganizationMemberInsert>

export type RolePermission = { id: string; role: string; resource: string; action: string; created_at: string }
export type RolePermissionInsert = Omit<RolePermission, 'id' | 'created_at'>
export type RolePermissionUpdate = Partial<RolePermissionInsert>

export type Customer = { id: string; organization_id: string; name: string; email: string; phone: string; type: string; created_at: string; updated_at: string }
export type CustomerInsert = Omit<Customer, 'id' | 'created_at' | 'updated_at'>
export type CustomerUpdate = Partial<CustomerInsert>

export type CustomerContact = { id: string; customer_id: string; name: string; phone: string; email: string; is_primary: boolean; created_at: string }
export type CustomerContactInsert = Omit<CustomerContact, 'id' | 'created_at'>
export type CustomerContactUpdate = Partial<CustomerContactInsert>

export type CustomerAddress = { id: string; customer_id: string; address_line1: string; address_line2: string | null; city: string; state: string; pincode: string; latitude: number | null; longitude: number | null; is_primary: boolean; created_at: string }
export type CustomerAddressInsert = Omit<CustomerAddress, 'id' | 'created_at'>
export type CustomerAddressUpdate = Partial<CustomerAddressInsert>

export type Lead = { id: string; organization_id: string; customer_id: string | null; source_id: string | null; assigned_to: string | null; status: string; capacity_kw: number | null; system_type: string | null; monthly_bill: number | null; rooftop_area: number | null; grid_suitability: string | null; additional_requirements: string | null; created_at: string; updated_at: string }
export type LeadInsert = Omit<Lead, 'id' | 'created_at' | 'updated_at'>
export type LeadUpdate = Partial<LeadInsert>

export type LeadSource = { id: string; name: string; description: string | null; created_at: string }
export type LeadSourceInsert = Omit<LeadSource, 'id' | 'created_at'>
export type LeadSourceUpdate = Partial<LeadSourceInsert>

export type LeadActivity = { id: string; lead_id: string; user_id: string; type: string; description: string; created_at: string }
export type LeadActivityInsert = Omit<LeadActivity, 'id' | 'created_at'>
export type LeadActivityUpdate = Partial<LeadActivityInsert>

export type FollowUp = { id: string; lead_id: string; user_id: string; due_date: string; type: string; notes: string | null; completed: boolean; completed_at: string | null; created_at: string }
export type FollowUpInsert = Omit<FollowUp, 'id' | 'created_at'>
export type FollowUpUpdate = Partial<FollowUpInsert>

export type SurveyRequest = { id: string; lead_id: string; requested_by: string; preferred_date: string | null; notes: string | null; created_at: string }
export type SurveyRequestInsert = Omit<SurveyRequest, 'id' | 'created_at'>
export type SurveyRequestUpdate = Partial<SurveyRequestInsert>

export type Survey = { id: string; request_id: string; technician_id: string; scheduled_at: string; started_at: string | null; completed_at: string | null; roof_direction: string | null; roof_tilt: number | null; cable_distance: number | null; roof_area: number | null; shadow_free_area: number | null; grid_suitability: string | null; status: string; created_at: string; updated_at: string }
export type SurveyInsert = Omit<Survey, 'id' | 'created_at' | 'updated_at'>
export type SurveyUpdate = Partial<SurveyInsert>

export type SurveyMeasurement = { id: string; survey_id: string; measurement_type: string; value: number; unit: string; notes: string | null; created_at: string }
export type SurveyMeasurementInsert = Omit<SurveyMeasurement, 'id' | 'created_at'>
export type SurveyMeasurementUpdate = Partial<SurveyMeasurementInsert>

export type SurveyPhoto = { id: string; survey_id: string; photo_url: string; caption: string | null; uploaded_by: string; created_at: string }
export type SurveyPhotoInsert = Omit<SurveyPhoto, 'id' | 'created_at'>
export type SurveyPhotoUpdate = Partial<SurveyPhotoInsert>

export type SurveyApproval = { id: string; survey_id: string; approved_by: string; approved_at: string; status: string; notes: string | null; created_at: string }
export type SurveyApprovalInsert = Omit<SurveyApproval, 'id' | 'created_at'>
export type SurveyApprovalUpdate = Partial<SurveyApprovalInsert>

export type ProductCategory = { id: string; name: string; description: string | null; parent_id: string | null; created_at: string }
export type ProductCategoryInsert = Omit<ProductCategory, 'id' | 'created_at'>
export type ProductCategoryUpdate = Partial<ProductCategoryInsert>

export type Product = { id: string; organization_id: string; category_id: string; name: string; sku: string; description: string | null; unit: string; base_price: number; is_serialized: boolean; warranty_months: number; is_active: boolean; created_at: string; updated_at: string }
export type ProductInsert = Omit<Product, 'id' | 'created_at' | 'updated_at'>
export type ProductUpdate = Partial<ProductInsert>

export type ProductSpecification = { id: string; product_id: string; key: string; value: string; unit: string | null; created_at: string }
export type ProductSpecificationInsert = Omit<ProductSpecification, 'id' | 'created_at'>
export type ProductSpecificationUpdate = Partial<ProductSpecificationInsert>

export type SolarPackage = { id: string; organization_id: string; name: string; description: string | null; capacity_kw: number; system_type: string; base_price: number; is_active: boolean; created_at: string; updated_at: string }
export type SolarPackageInsert = Omit<SolarPackage, 'id' | 'created_at' | 'updated_at'>
export type SolarPackageUpdate = Partial<SolarPackageInsert>

export type PackageComponent = { id: string; package_id: string; product_id: string; quantity: number; is_optional: boolean; created_at: string }
export type PackageComponentInsert = Omit<PackageComponent, 'id' | 'created_at'>
export type PackageComponentUpdate = Partial<PackageComponentInsert>

export type SolarConfiguration = { id: string; organization_id: string; lead_id: string | null; package_id: string; capacity_kw: number; system_type: string; customizations: Record<string, unknown>; total_price: number; created_at: string; updated_at: string }
export type SolarConfigurationInsert = Omit<SolarConfiguration, 'id' | 'created_at' | 'updated_at'>
export type SolarConfigurationUpdate = Partial<SolarConfigurationInsert>

export type BomTemplate = { id: string; organization_id: string; name: string; description: string | null; system_type: string; capacity_range: string; created_at: string; updated_at: string }
export type BomTemplateInsert = Omit<BomTemplate, 'id' | 'created_at' | 'updated_at'>
export type BomTemplateUpdate = Partial<BomTemplateInsert>

export type BomRule = { id: string; template_id: string; product_category_id: string; calculation_type: string; formula: string; conditions: Record<string, unknown>; created_at: string }
export type BomRuleInsert = Omit<BomRule, 'id' | 'created_at'>
export type BomRuleUpdate = Partial<BomRuleInsert>

export type BomRecord = { id: string; organization_id: string; configuration_id: string; template_id: string; status: string; total_price: number; created_at: string; updated_at: string }
export type BomRecordInsert = Omit<BomRecord, 'id' | 'created_at' | 'updated_at'>
export type BomRecordUpdate = Partial<BomRecordInsert>

export type BomItem = { id: string; bom_record_id: string; product_id: string; quantity: number; unit_price: number; total_price: number; is_optional: boolean; notes: string | null; created_at: string }
export type BomItemInsert = Omit<BomItem, 'id' | 'created_at'>
export type BomItemUpdate = Partial<BomItemInsert>

export type WarrantyPolicy = { id: string; organization_id: string; product_id: string; duration_months: number; trigger: string; coverage_details: string | null; exclusions: string | null; created_at: string; updated_at: string }
export type WarrantyPolicyInsert = Omit<WarrantyPolicy, 'id' | 'created_at' | 'updated_at'>
export type WarrantyPolicyUpdate = Partial<WarrantyPolicyInsert>

export type Quotation = { id: string; organization_id: string; lead_id: string; configuration_id: string; version: number; status: string; subtotal: number; tax_amount: number; total_amount: number; valid_until: string; approved_by: string | null; approved_at: string | null; created_at: string; updated_at: string }
export type QuotationInsert = Omit<Quotation, 'id' | 'created_at' | 'updated_at'>
export type QuotationUpdate = Partial<QuotationInsert>

export type QuotationItem = { id: string; quotation_id: string; product_id: string; quantity: number; unit_price: number; total_price: number; description: string | null; created_at: string }
export type QuotationItemInsert = Omit<QuotationItem, 'id' | 'created_at'>
export type QuotationItemUpdate = Partial<QuotationItemInsert>

export type QuotationVersion = { id: string; quotation_id: string; version: number; snapshot: Record<string, unknown>; created_by: string; created_at: string }
export type QuotationVersionInsert = Omit<QuotationVersion, 'id' | 'created_at'>
export type QuotationVersionUpdate = Partial<QuotationVersionInsert>

export type SalesOrder = { id: string; organization_id: string; quotation_id: string; customer_id: string; status: string; order_date: string; expected_delivery: string | null; total_amount: number; created_at: string; updated_at: string }
export type SalesOrderInsert = Omit<SalesOrder, 'id' | 'created_at' | 'updated_at'>
export type SalesOrderUpdate = Partial<SalesOrderInsert>

export type SalesOrderItem = { id: string; order_id: string; product_id: string; quantity: number; unit_price: number; total_price: number; created_at: string }
export type SalesOrderItemInsert = Omit<SalesOrderItem, 'id' | 'created_at'>
export type SalesOrderItemUpdate = Partial<SalesOrderItemInsert>

export type PaymentMilestone = { id: string; order_id: string; description: string; amount: number; due_date: string; sequence: number; is_advance: boolean; created_at: string }
export type PaymentMilestoneInsert = Omit<PaymentMilestone, 'id' | 'created_at'>
export type PaymentMilestoneUpdate = Partial<PaymentMilestoneInsert>

export type Payment = { id: string; organization_id: string; customer_id: string; order_id: string | null; amount: number; method: string; reference: string | null; status: string; paid_at: string; allocated_amount: number; notes: string | null; created_at: string; updated_at: string }
export type PaymentInsert = Omit<Payment, 'id' | 'created_at' | 'updated_at'>
export type PaymentUpdate = Partial<PaymentInsert>

export type PaymentAllocation = { id: string; payment_id: string; invoice_id: string | null; order_id: string | null; amount: number; created_at: string }
export type PaymentAllocationInsert = Omit<PaymentAllocation, 'id' | 'created_at'>
export type PaymentAllocationUpdate = Partial<PaymentAllocationInsert>

export type Supplier = { id: string; organization_id: string; name: string; contact_person: string | null; email: string | null; phone: string | null; address: string | null; gst_number: string | null; payment_terms: number | null; is_active: boolean; created_at: string; updated_at: string }
export type SupplierInsert = Omit<Supplier, 'id' | 'created_at' | 'updated_at'>
export type SupplierUpdate = Partial<SupplierInsert>

export type PurchaseOrder = { id: string; organization_id: string; supplier_id: string; status: string; order_date: string; expected_date: string | null; total_amount: number; created_at: string; updated_at: string }
export type PurchaseOrderInsert = Omit<PurchaseOrder, 'id' | 'created_at' | 'updated_at'>
export type PurchaseOrderUpdate = Partial<PurchaseOrderInsert>

export type PurchaseOrderItem = { id: string; purchase_order_id: string; product_id: string; quantity: number; unit_price: number; total_price: number; received_quantity: number; created_at: string }
export type PurchaseOrderItemInsert = Omit<PurchaseOrderItem, 'id' | 'created_at'>
export type PurchaseOrderItemUpdate = Partial<PurchaseOrderItemInsert>

export type WarehouseLocation = { id: string; organization_id: string; name: string; code: string; address: string | null; is_default: boolean; created_at: string; updated_at: string }
export type WarehouseLocationInsert = Omit<WarehouseLocation, 'id' | 'created_at' | 'updated_at'>
export type WarehouseLocationUpdate = Partial<WarehouseLocationInsert>

export type StockMovement = { id: string; organization_id: string; product_id: string; location_id: string; type: string; quantity: number; reference_type: string; reference_id: string | null; unit_cost: number | null; created_by: string; created_at: string }
export type StockMovementInsert = Omit<StockMovement, 'id' | 'created_at'>
export type StockMovementUpdate = Partial<StockMovementInsert>

export type StockReservation = { id: string; organization_id: string; product_id: string; order_id: string; quantity: number; status: string; expires_at: string | null; created_at: string; updated_at: string }
export type StockReservationInsert = Omit<StockReservation, 'id' | 'created_at' | 'updated_at'>
export type StockReservationUpdate = Partial<StockReservationInsert>

export type InventoryAdjustment = { id: string; organization_id: string; product_id: string; location_id: string; adjustment_type: string; quantity: number; reason: string; created_by: string; created_at: string }
export type InventoryAdjustmentInsert = Omit<InventoryAdjustment, 'id' | 'created_at'>
export type InventoryAdjustmentUpdate = Partial<InventoryAdjustmentInsert>

export type SerialUnit = { id: string; organization_id: string; product_id: string; serial_number: string; qr_code: string | null; status: string; location_id: string | null; customer_id: string | null; order_id: string | null; warranty_start: string | null; warranty_end: string | null; created_at: string; updated_at: string }
export type SerialUnitInsert = Omit<SerialUnit, 'id' | 'created_at' | 'updated_at'>
export type SerialUnitUpdate = Partial<SerialUnitInsert>

export type Dispatch = { id: string; organization_id: string; order_id: string; status: string; dispatched_at: string | null; delivered_at: string | null; delivered_by: string | null; delivery_notes: string | null; proof_of_delivery_url: string | null; created_at: string; updated_at: string }
export type DispatchInsert = Omit<Dispatch, 'id' | 'created_at' | 'updated_at'>
export type DispatchUpdate = Partial<DispatchInsert>

export type DispatchItem = { id: string; dispatch_id: string; serial_unit_id: string; scanned_at: string | null; scanned_by: string | null; created_at: string }
export type DispatchItemInsert = Omit<DispatchItem, 'id' | 'created_at'>
export type DispatchItemUpdate = Partial<DispatchItemInsert>

export type Technician = { id: string; organization_id: string; profile_id: string | null; employee_id: string; name: string; phone: string; email: string | null; skills: string[]; hourly_rate: number | null; is_active: boolean; created_at: string; updated_at: string }
export type TechnicianInsert = Omit<Technician, 'id' | 'created_at' | 'updated_at'>
export type TechnicianUpdate = Partial<TechnicianInsert>

export type TechnicianSkill = { id: string; technician_id: string; skill: string; proficiency: number; certified_at: string | null; created_at: string }
export type TechnicianSkillInsert = Omit<TechnicianSkill, 'id' | 'created_at'>
export type TechnicianSkillUpdate = Partial<TechnicianSkillInsert>

export type TechnicianAvailability = { id: string; technician_id: string; date: string; start_time: string; end_time: string; is_available: boolean; created_at: string }
export type TechnicianAvailabilityInsert = Omit<TechnicianAvailability, 'id' | 'created_at'>
export type TechnicianAvailabilityUpdate = Partial<TechnicianAvailabilityInsert>

export type Installation = { id: string; organization_id: string; order_id: string; customer_id: string; status: string; scheduled_start: string | null; actual_start: string | null; actual_end: string | null; installed_capacity_kw: number | null; generation_confirmed: boolean; completion_report_url: string | null; created_at: string; updated_at: string }
export type InstallationInsert = Omit<Installation, 'id' | 'created_at' | 'updated_at'>
export type InstallationUpdate = Partial<InstallationInsert>

export type InstallationAssignment = { id: string; installation_id: string; technician_id: string; role: string; assigned_at: string; created_at: string }
export type InstallationAssignmentInsert = Omit<InstallationAssignment, 'id' | 'created_at'>
export type InstallationAssignmentUpdate = Partial<InstallationAssignmentInsert>

export type InstallationChecklist = { id: string; installation_id: string; template_id: string; status: string; completed_at: string | null; created_at: string; updated_at: string }
export type InstallationChecklistInsert = Omit<InstallationChecklist, 'id' | 'created_at' | 'updated_at'>
export type InstallationChecklistUpdate = Partial<InstallationChecklistInsert>

export type InstallationChecklistItem = { id: string; checklist_id: string; item_text: string; is_mandatory: boolean; is_completed: boolean; completed_at: string | null; notes: string | null; created_at: string }
export type InstallationChecklistItemInsert = Omit<InstallationChecklistItem, 'id' | 'created_at'>
export type InstallationChecklistItemUpdate = Partial<InstallationChecklistItemInsert>

export type InstallationEvidence = { id: string; installation_id: string; item_id: string | null; photo_url: string; caption: string | null; uploaded_by: string; created_at: string }
export type InstallationEvidenceInsert = Omit<InstallationEvidence, 'id' | 'created_at'>
export type InstallationEvidenceUpdate = Partial<InstallationEvidenceInsert>

export type InstallationTest = { id: string; installation_id: string; test_type: string; expected_value: number | null; actual_value: number | null; unit: string | null; status: string; notes: string | null; tested_by: string; tested_at: string; created_at: string }
export type InstallationTestInsert = Omit<InstallationTest, 'id' | 'created_at'>
export type InstallationTestUpdate = Partial<InstallationTestInsert>

export type CustomerAcceptance = { id: string; installation_id: string; customer_name: string; signature_url: string; accepted_at: string; notes: string | null; created_at: string }
export type CustomerAcceptanceInsert = Omit<CustomerAcceptance, 'id' | 'created_at'>
export type CustomerAcceptanceUpdate = Partial<CustomerAcceptanceInsert>

export type Warranty = { id: string; organization_id: string; serial_unit_id: string; customer_id: string; policy_id: string; started_at: string; ends_at: string; status: string; activated_by: string; activation_trigger: string; created_at: string; updated_at: string }
export type WarrantyInsert = Omit<Warranty, 'id' | 'created_at' | 'updated_at'>
export type WarrantyUpdate = Partial<WarrantyInsert>

export type WarrantyClaim = { id: string; warranty_id: string; ticket_id: string | null; claim_type: string; description: string; status: string; approved_amount: number | null; processed_by: string | null; processed_at: string | null; created_at: string; updated_at: string }
export type WarrantyClaimInsert = Omit<WarrantyClaim, 'id' | 'created_at' | 'updated_at'>
export type WarrantyClaimUpdate = Partial<WarrantyClaimInsert>

export type ServiceTicket = { id: string; organization_id: string; customer_id: string; serial_unit_id: string | null; warranty_id: string | null; fault_code: string | null; description: string; priority: string; status: string; assigned_to: string | null; scheduled_at: string | null; created_at: string; updated_at: string }
export type ServiceTicketInsert = Omit<ServiceTicket, 'id' | 'created_at' | 'updated_at'>
export type ServiceTicketUpdate = Partial<ServiceTicketInsert>

export type ServiceAssignment = { id: string; ticket_id: string; technician_id: string; assigned_at: string; created_at: string }
export type ServiceAssignmentInsert = Omit<ServiceAssignment, 'id' | 'created_at'>
export type ServiceAssignmentUpdate = Partial<ServiceAssignmentInsert>

export type ServiceUpdate = { id: string; ticket_id: string; user_id: string; update_type: string; description: string; created_at: string }
export type ServiceUpdateInsert = Omit<ServiceUpdate, 'id' | 'created_at'>
export type ServiceUpdateUpdate = Partial<ServiceUpdateInsert>

export type RepairRecord = { id: string; ticket_id: string; diagnosis: string; resolution: string; parts_cost: number; labor_cost: number; total_cost: number; is_warranty: boolean; warranty_claim_id: string | null; created_at: string; updated_at: string }
export type RepairRecordInsert = Omit<RepairRecord, 'id' | 'created_at' | 'updated_at'>
export type RepairRecordUpdate = Partial<RepairRecordInsert>

export type RepairPart = { id: string; repair_id: string; product_id: string; quantity: number; unit_cost: number; total_cost: number; serial_number: string | null; created_at: string }
export type RepairPartInsert = Omit<RepairPart, 'id' | 'created_at'>
export type RepairPartUpdate = Partial<RepairPartInsert>

export type ReplacementRecord = { id: string; ticket_id: string; old_serial_unit_id: string; new_serial_unit_id: string; reason: string; cost: number; is_warranty: boolean; created_at: string }
export type ReplacementRecordInsert = Omit<ReplacementRecord, 'id' | 'created_at'>
export type ReplacementRecordUpdate = Partial<ReplacementRecordInsert>

export type Invoice = { id: string; organization_id: string; customer_id: string; order_id: string | null; invoice_number: string; invoice_date: string; due_date: string; status: string; subtotal: number; tax_amount: number; total_amount: number; paid_amount: number; pdf_url: string | null; created_at: string; updated_at: string }
export type InvoiceInsert = Omit<Invoice, 'id' | 'created_at' | 'updated_at'>
export type InvoiceUpdate = Partial<InvoiceInsert>

export type InvoiceItem = { id: string; invoice_id: string; description: string; quantity: number; unit_price: number; tax_rate: number; total_price: number; created_at: string }
export type InvoiceItemInsert = Omit<InvoiceItem, 'id' | 'created_at'>
export type InvoiceItemUpdate = Partial<InvoiceItemInsert>

export type Expense = { id: string; organization_id: string; category_id: string; vendor_id: string | null; amount: number; description: string; expense_date: string; status: string; approved_by: string | null; approved_at: string | null; receipt_url: string | null; created_at: string; updated_at: string }
export type ExpenseInsert = Omit<Expense, 'id' | 'created_at' | 'updated_at'>
export type ExpenseUpdate = Partial<ExpenseInsert>

export type ExpenseCategory = { id: string; organization_id: string; name: string; description: string | null; is_active: boolean; created_at: string }
export type ExpenseCategoryInsert = Omit<ExpenseCategory, 'id' | 'created_at'>
export type ExpenseCategoryUpdate = Partial<ExpenseCategoryInsert>

export type VendorBill = { id: string; organization_id: string; supplier_id: string; bill_number: string; bill_date: string; due_date: string; amount: number; status: string; pdf_url: string | null; created_at: string; updated_at: string }
export type VendorBillInsert = Omit<VendorBill, 'id' | 'created_at' | 'updated_at'>
export type VendorBillUpdate = Partial<VendorBillInsert>

export type VendorBillItem = { id: string; vendor_bill_id: string; product_id: string | null; description: string; quantity: number; unit_price: number; total_price: number; created_at: string }
export type VendorBillItemInsert = Omit<VendorBillItem, 'id' | 'created_at'>
export type VendorBillItemUpdate = Partial<VendorBillItemInsert>

export type TechnicianPayable = { id: string; organization_id: string; technician_id: string; installation_id: string | null; agreed_amount: number; additional_amount: number; advance_paid: number; remaining_payable: number; status: string; created_at: string; updated_at: string }
export type TechnicianPayableInsert = Omit<TechnicianPayable, 'id' | 'created_at' | 'updated_at'>
export type TechnicianPayableUpdate = Partial<TechnicianPayableInsert>

export type TechnicianPayment = { id: string; payable_id: string; amount: number; payment_date: string; reference: string | null; created_at: string }
export type TechnicianPaymentInsert = Omit<TechnicianPayment, 'id' | 'created_at'>
export type TechnicianPaymentUpdate = Partial<TechnicianPaymentInsert>

export type JobCost = { id: string; organization_id: string; installation_id: string; cost_type: string; description: string; amount: number; vendor_id: string | null; technician_id: string | null; incurred_at: string; created_at: string }
export type JobCostInsert = Omit<JobCost, 'id' | 'created_at'>
export type JobCostUpdate = Partial<JobCostInsert>

export type SubsidyApplication = { id: string; organization_id: string; customer_id: string; installation_id: string; scheme_name: string; eligibility_status: string | null; required_documents: string[]; submitted_documents: string[]; submitted_at: string | null; application_reference: string | null; status: string; approved_amount: number | null; rejection_reason: string | null; disbursed_at: string | null; created_at: string; updated_at: string }
export type SubsidyApplicationInsert = Omit<SubsidyApplication, 'id' | 'created_at' | 'updated_at'>
export type SubsidyApplicationUpdate = Partial<SubsidyApplicationInsert>

export type SubsidyDocument = { id: string; application_id: string; document_type: string; file_url: string; status: string; verified_by: string | null; verified_at: string | null; created_at: string }
export type SubsidyDocumentInsert = Omit<SubsidyDocument, 'id' | 'created_at'>
export type SubsidyDocumentUpdate = Partial<SubsidyDocumentInsert>

export type SubsidyStatusHistory = { id: string; application_id: string; from_status: string | null; to_status: string; changed_by: string; notes: string | null; created_at: string }
export type SubsidyStatusHistoryInsert = Omit<SubsidyStatusHistory, 'id' | 'created_at'>
export type SubsidyStatusHistoryUpdate = Partial<SubsidyStatusHistoryInsert>

export type Notification = { id: string; organization_id: string; user_id: string; type: string; title: string; message: string; data: Record<string, unknown> | null; read_at: string | null; created_at: string }
export type NotificationInsert = Omit<Notification, 'id' | 'created_at'>
export type NotificationUpdate = Partial<NotificationInsert>

export type NotificationPreference = { id: string; user_id: string; type: string; in_app: boolean; email: boolean; sms: boolean; push: boolean; created_at: string; updated_at: string }
export type NotificationPreferenceInsert = Omit<NotificationPreference, 'id' | 'created_at' | 'updated_at'>
export type NotificationPreferenceUpdate = Partial<NotificationPreferenceInsert>

export type AuditLog = { id: string; organization_id: string; user_id: string | null; action: string; resource: string; resource_id: string | null; old_values: Record<string, unknown> | null; new_values: Record<string, unknown> | null; ip_address: string | null; user_agent: string | null; created_at: string }
export type AuditLogInsert = Omit<AuditLog, 'id' | 'created_at'>
export type AuditLogUpdate = Partial<AuditLogInsert>

export type ActivityLog = { id: string; organization_id: string; user_id: string | null; entity_type: string; entity_id: string; action: string; description: string; metadata: Record<string, unknown> | null; created_at: string }
export type ActivityLogInsert = Omit<ActivityLog, 'id' | 'created_at'>
export type ActivityLogUpdate = Partial<ActivityLogInsert>

export type ApplicationSetting = { id: string; organization_id: string; key: string; value: string; description: string | null; is_public: boolean; created_at: string; updated_at: string }
export type ApplicationSettingInsert = Omit<ApplicationSetting, 'id' | 'created_at' | 'updated_at'>
export type ApplicationSettingUpdate = Partial<ApplicationSettingInsert>

export type DocumentMetadata = { id: string; organization_id: string; entity_type: string; entity_id: string; file_name: string; file_url: string; file_size: number; mime_type: string; uploaded_by: string; created_at: string }
export type DocumentMetadataInsert = Omit<DocumentMetadata, 'id' | 'created_at'>
export type DocumentMetadataUpdate = Partial<DocumentMetadataInsert>

export type IntegrationSetting = { id: string; organization_id: string; integration_name: string; config: Record<string, unknown>; is_active: boolean; created_at: string; updated_at: string }
export type IntegrationSettingInsert = Omit<IntegrationSetting, 'id' | 'created_at' | 'updated_at'>
export type IntegrationSettingUpdate = Partial<IntegrationSettingInsert>