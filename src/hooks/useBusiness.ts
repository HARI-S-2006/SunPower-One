import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { surveysApi, productsApi, packagesApi, bomApi, quotationsApi, ordersApi, paymentsApi, inventoryApi, installationsApi, warrantiesApi, serviceTicketsApi, financeApi } from '@/lib/api'

// ============================================================
// SURVEYS HOOKS
// ============================================================

export function useSurveys(params?: Parameters<typeof surveysApi.list>[0]) {
  return useQuery({
    queryKey: ['surveys', params],
    queryFn: () => surveysApi.list(params),
    select: (result) => result.data,
  })
}

export function useSurvey(id: string) {
  return useQuery({
    queryKey: ['survey', id],
    queryFn: () => surveysApi.get(id),
    select: (result) => result.data,
    enabled: !!id,
  })
}

export function useCreateSurvey() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: surveysApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['surveys'] })
    },
  })
}

export function useUpdateSurvey() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof surveysApi.update>[1] }) => 
      surveysApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['surveys'] })
      queryClient.invalidateQueries({ queryKey: ['survey', id] })
    },
  })
}

// ============================================================
// PRODUCTS HOOKS
// ============================================================

export function useProducts(params?: Parameters<typeof productsApi.list>[0]) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => productsApi.list(params),
    select: (result) => result.data,
  })
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => productsApi.get(id),
    select: (result) => result.data,
    enabled: !!id,
  })
}

export function useCreateProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: productsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}

export function useUpdateProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof productsApi.update>[1] }) => 
      productsApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['product', id] })
    },
  })
}

// ============================================================
// PACKAGES HOOKS
// ============================================================

export function usePackages(params?: Parameters<typeof packagesApi.list>[0]) {
  return useQuery({
    queryKey: ['packages', params],
    queryFn: () => packagesApi.list(params),
    select: (result) => result.data,
  })
}

export function usePackage(id: string) {
  return useQuery({
    queryKey: ['package', id],
    queryFn: () => packagesApi.get(id),
    select: (result) => result.data,
    enabled: !!id,
  })
}

// ============================================================
// BOM HOOKS
// ============================================================

export function useBomRecord(id: string) {
  return useQuery({
    queryKey: ['bomRecord', id],
    queryFn: () => bomApi.getRecord(id),
    select: (result) => result.data,
    enabled: !!id,
  })
}

export function useCalculateBom() {
  return useMutation({
    mutationFn: bomApi.calculate,
  })
}

// ============================================================
// QUOTATIONS HOOKS
// ============================================================

export function useQuotations(params?: Parameters<typeof quotationsApi.list>[0]) {
  return useQuery({
    queryKey: ['quotations', params],
    queryFn: () => quotationsApi.list(params),
    select: (result) => result.data,
  })
}

export function useQuotation(id: string) {
  return useQuery({
    queryKey: ['quotation', id],
    queryFn: () => quotationsApi.get(id),
    select: (result) => result.data,
    enabled: !!id,
  })
}

export function useCreateQuotation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: quotationsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotations'] })
    },
  })
}

export function useUpdateQuotation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof quotationsApi.update>[1] }) => 
      quotationsApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['quotations'] })
      queryClient.invalidateQueries({ queryKey: ['quotation', id] })
    },
  })
}

// ============================================================
// ORDERS HOOKS
// ============================================================

export function useOrders(params?: Parameters<typeof ordersApi.list>[0]) {
  return useQuery({
    queryKey: ['orders', params],
    queryFn: () => ordersApi.list(params),
    select: (result) => result.data,
  })
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => ordersApi.get(id),
    select: (result) => result.data,
    enabled: !!id,
  })
}

export function useConvertQuotationToOrder() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ordersApi.convertFromQuotation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['quotations'] })
    },
  })
}

export function useReserveStock() {
  return useMutation({
    mutationFn: ordersApi.reserveStock,
  })
}

export function useReleaseStock() {
  return useMutation({
    mutationFn: ordersApi.releaseStock,
  })
}

// ============================================================
// PAYMENTS HOOKS
// ============================================================

export function usePayments(params?: Parameters<typeof paymentsApi.list>[0]) {
  return useQuery({
    queryKey: ['payments', params],
    queryFn: () => paymentsApi.list(params),
    select: (result) => result.data,
  })
}

export function useCreatePayment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: paymentsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] })
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
  })
}

// ============================================================
// INVENTORY HOOKS
// ============================================================

export function useStockMovements(params?: Parameters<typeof inventoryApi.stockMovements>[0]) {
  return useQuery({
    queryKey: ['stockMovements', params],
    queryFn: () => inventoryApi.stockMovements(params),
    select: (result) => result.data,
  })
}

export function useReservations(params?: Parameters<typeof inventoryApi.reservations>[0]) {
  return useQuery({
    queryKey: ['reservations', params],
    queryFn: () => inventoryApi.reservations(params),
    select: (result) => result.data,
  })
}

export function useSerialUnits(params?: Parameters<typeof inventoryApi.serialUnits>[0]) {
  return useQuery({
    queryKey: ['serialUnits', params],
    queryFn: () => inventoryApi.serialUnits(params),
    select: (result) => result.data,
  })
}

export function useDispatchSerials() {
  return useMutation({
    mutationFn: inventoryApi.dispatchSerials,
  })
}

// ============================================================
// INSTALLATIONS HOOKS
// ============================================================

export function useInstallations(params?: Parameters<typeof installationsApi.list>[0]) {
  return useQuery({
    queryKey: ['installations', params],
    queryFn: () => installationsApi.list(params),
    select: (result) => result.data,
  })
}

export function useInstallation(id: string) {
  return useQuery({
    queryKey: ['installation', id],
    queryFn: () => installationsApi.get(id),
    select: (result) => result.data,
    enabled: !!id,
  })
}

export function useValidateInstallationCompletion() {
  return useMutation({
    mutationFn: installationsApi.validateCompletion,
  })
}

// ============================================================
// WARRANTIES HOOKS
// ============================================================

export function useWarranties(params?: Parameters<typeof warrantiesApi.list>[0]) {
  return useQuery({
    queryKey: ['warranties', params],
    queryFn: () => warrantiesApi.list(params),
    select: (result) => result.data,
  })
}

export function useCheckWarrantyCoverage() {
  return useMutation({
    mutationFn: warrantiesApi.checkCoverage,
  })
}

// ============================================================
// SERVICE TICKETS HOOKS
// ============================================================

export function useServiceTickets(params?: Parameters<typeof serviceTicketsApi.list>[0]) {
  return useQuery({
    queryKey: ['serviceTickets', params],
    queryFn: () => serviceTicketsApi.list(params),
    select: (result) => result.data,
  })
}

export function useServiceTicket(id: string) {
  return useQuery({
    queryKey: ['serviceTicket', id],
    queryFn: () => serviceTicketsApi.get(id),
    select: (result) => result.data,
    enabled: !!id,
  })
}

export function useCreateServiceTicket() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: serviceTicketsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['serviceTickets'] })
    },
  })
}

export function useUpdateServiceTicket() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof serviceTicketsApi.update>[1] }) => 
      serviceTicketsApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['serviceTickets'] })
      queryClient.invalidateQueries({ queryKey: ['serviceTicket', id] })
    },
  })
}

// ============================================================
// FINANCE HOOKS
// ============================================================

export function useInvoices(params?: Parameters<typeof financeApi.invoices.list>[0]) {
  return useQuery({
    queryKey: ['invoices', params],
    queryFn: () => financeApi.invoices.list(params),
    select: (result) => result.data,
  })
}

export function useExpenses(params?: Parameters<typeof financeApi.expenses.list>[0]) {
  return useQuery({
    queryKey: ['expenses', params],
    queryFn: () => financeApi.expenses.list(params),
    select: (result) => result.data,
  })
}

export function useTechnicianPayables(params?: Parameters<typeof financeApi.technicianPayables.list>[0]) {
  return useQuery({
    queryKey: ['technicianPayables', params],
    queryFn: () => financeApi.technicianPayables.list(params),
    select: (result) => result.data,
  })
}

export function useSubsidies(params?: Parameters<typeof financeApi.subsidies.list>[0]) {
  return useQuery({
    queryKey: ['subsidies', params],
    queryFn: () => financeApi.subsidies.list(params),
    select: (result) => result.data,
  })
}

export function useProfitability() {
  return useQuery({
    queryKey: ['profitability'],
    queryFn: async () => {
      const { data, error } = await financeApi.profitability()
      if (error) throw error
      return data
    },
  })
}

export function useStockAvailability() {
  return useQuery({
    queryKey: ['stockAvailability'],
    queryFn: async () => {
      const { data, error } = await financeApi.stockAvailability()
      if (error) throw error
      return data
    },
  })
}