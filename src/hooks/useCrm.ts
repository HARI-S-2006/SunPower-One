import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { customersApi, leadsApi, leadActivitiesApi, followUpsApi } from '@/lib/api'

// ============================================================
// CUSTOMERS HOOKS
// ============================================================

export function useCustomers(params?: Parameters<typeof customersApi.list>[0]) {
  return useQuery({
    queryKey: ['customers', params],
    queryFn: () => customersApi.list(params),
    select: (result) => result.data,
  })
}

export function useCustomer(id: string) {
  return useQuery({
    queryKey: ['customer', id],
    queryFn: () => customersApi.get(id),
    select: (result) => result.data,
    enabled: !!id,
  })
}

export function useCreateCustomer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: customersApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] })
    },
  })
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof customersApi.update>[1] }) => 
      customersApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['customers'] })
      queryClient.invalidateQueries({ queryKey: ['customer', id] })
    },
  })
}

export function useFindOrCreateCustomer() {
  return useMutation({
    mutationFn: customersApi.findOrCreate,
  })
}

// ============================================================
// LEADS HOOKS
// ============================================================

export function useLeads(params?: Parameters<typeof leadsApi.list>[0]) {
  return useQuery({
    queryKey: ['leads', params],
    queryFn: () => leadsApi.list(params),
    select: (result) => result.data,
  })
}

export function useLead(id: string) {
  return useQuery({
    queryKey: ['lead', id],
    queryFn: () => leadsApi.get(id),
    select: (result) => result.data,
    enabled: !!id,
  })
}

export function useCreateLead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: leadsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] })
    },
  })
}

export function useUpdateLead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof leadsApi.update>[1] }) => 
      leadsApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['leads'] })
      queryClient.invalidateQueries({ queryKey: ['lead', id] })
    },
  })
}

export function useCreateLeadFromEnquiry() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: leadsApi.createFromEnquiry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] })
    },
  })
}

// ============================================================
// LEAD ACTIVITIES HOOKS
// ============================================================

export function useLeadActivities(leadId: string) {
  return useQuery({
    queryKey: ['leadActivities', leadId],
    queryFn: () => leadActivitiesApi.list(leadId),
    select: (result) => result.data,
    enabled: !!leadId,
  })
}

export function useCreateLeadActivity() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: leadActivitiesApi.create,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['leadActivities', variables.lead_id] })
    },
  })
}

// ============================================================
// FOLLOW-UPS HOOKS
// ============================================================

export function useFollowUps(leadId: string) {
  return useQuery({
    queryKey: ['followUps', leadId],
    queryFn: () => followUpsApi.list(leadId),
    select: (result) => result.data,
    enabled: !!leadId,
  })
}

export function useCreateFollowUp() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: followUpsApi.create,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['followUps', variables.lead_id] })
    },
  })
}

export function useUpdateFollowUp() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof followUpsApi.update>[1] }) => 
      followUpsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['followUps'] })
    },
  })
}