// src/hooks/credits/useCredits.ts
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { toast } from 'sonner';
import apiClient from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/constants/api-endpoints';
import { QUERY_KEYS } from '@/lib/constants/query-keys';
import { getErrorMessage, isNormalizedError } from '@/lib/api/error-handler';
import type { CarbonCredit, CreditLedgerEntry, CreateListingPayload } from '@/types/credit.types';
import type { PaginatedResponse, PaginationParams } from '@/types/api.types';

interface CreditFilters extends PaginationParams {
  status?: string;
  projectId?: string;
}

export function useCredits(filters: CreditFilters = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.credits.list(filters as Record<string, unknown>),
    queryFn: async (): Promise<PaginatedResponse<CarbonCredit>> => {
      const { data } = await apiClient.get(API_ENDPOINTS.CREDITS.LIST, { params: filters });
      return data;
    },
    placeholderData: keepPreviousData,
    staleTime: 60_000,
  });
}

export function useCredit(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.credits.detail(id),
    queryFn: async (): Promise<CarbonCredit> => {
      const { data } = await apiClient.get(API_ENDPOINTS.CREDITS.GET(id));
      return data.data;
    },
    enabled: !!id,
    staleTime: 60_000,
  });
}

export function useCreditLedger(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.credits.ledger(id),
    queryFn: async (): Promise<CreditLedgerEntry[]> => {
      const { data } = await apiClient.get(API_ENDPOINTS.CREDITS.LEDGER(id));
      return data.data;
    },
    enabled: !!id,
  });
}

export function useCreateListing(creditId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateListingPayload) => {
      const { data } = await apiClient.post(API_ENDPOINTS.CREDITS.CREATE_LISTING(creditId), payload);
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.credits.detail(creditId) });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.credits.myListings() });
      toast.success('Credit listed on marketplace successfully.');
    },
    onError: (err) => {
      const msg = isNormalizedError(err) ? getErrorMessage(err.code, err.message) : 'Listing failed.';
      toast.error(msg);
    },
  });
}
