// src/hooks/fpo/useFpo.ts
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { toast } from 'sonner';
import apiClient from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/constants/api-endpoints';
import { QUERY_KEYS } from '@/lib/constants/query-keys';
import { getErrorMessage, isNormalizedError } from '@/lib/api/error-handler';
import type { FpoDetails, FpoStats, Farmer, FarmerPayout } from '@/types/fpo.types';
import type { PaginatedResponse, PaginationParams } from '@/types/api.types';

export function useFpoStats() {
  return useQuery({
    queryKey: QUERY_KEYS.fpo.stats(),
    queryFn: async (): Promise<FpoStats> => {
      const { data } = await apiClient.get(API_ENDPOINTS.FPO.STATS);
      return data.data;
    },
    staleTime: 60_000,
    refetchInterval: 60_000,
  });
}

export function useFpoDetails() {
  return useQuery({
    queryKey: QUERY_KEYS.fpo.details(),
    queryFn: async (): Promise<FpoDetails> => {
      const { data } = await apiClient.get(API_ENDPOINTS.FPO.DETAILS);
      return data.data;
    },
  });
}

export interface FarmerFilters extends PaginationParams {
  search?: string;
  status?: string;
  kycStatus?: string;
  district?: string;
}

export function useFarmers(filters: FarmerFilters = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.fpo.farmers(filters as Record<string, unknown>),
    queryFn: async (): Promise<PaginatedResponse<Farmer>> => {
      const { data } = await apiClient.get(API_ENDPOINTS.FPO.FARMERS, { params: filters });
      return data;
    },
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
}

export function useFarmer(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.fpo.farmer(id),
    queryFn: async (): Promise<Farmer> => {
      const { data } = await apiClient.get(API_ENDPOINTS.FPO.GET_FARMER(id));
      return data.data;
    },
    enabled: !!id,
  });
}

export function useEnrollFarmer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<Farmer> & { aadhaarHash: string }) => {
      const { data } = await apiClient.post(API_ENDPOINTS.FPO.ENROLL_FARMER, payload);
      return data.data as Farmer;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.fpo.farmers() });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.fpo.stats() });
      toast.success('Farmer enrolled successfully.');
    },
    onError: (err) => {
      const msg = isNormalizedError(err) ? getErrorMessage(err.code, err.message) : 'Enrollment failed.';
      toast.error(msg);
    },
  });
}

interface PayoutFilters extends PaginationParams {
  status?: string;
}

export function useFarmerPayouts(filters: PayoutFilters = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.fpo.payouts(filters as Record<string, unknown>),
    queryFn: async (): Promise<PaginatedResponse<FarmerPayout>> => {
      const { data } = await apiClient.get(API_ENDPOINTS.FPO.PAYOUTS, { params: filters });
      return data;
    },
    placeholderData: keepPreviousData,
  });
}

export function useRetryPayout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payoutId: string) => {
      const { data } = await apiClient.post(API_ENDPOINTS.FPO.RETRY_PAYOUT(payoutId));
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.fpo.payouts() });
      toast.success('Payout retry initiated.');
    },
    onError: (err) => {
      const msg = isNormalizedError(err) ? getErrorMessage(err.code, err.message) : 'Retry failed.';
      toast.error(msg);
    },
  });
}


export function useBatchStatus(batchId: string, isProcessing: boolean) {
  return useQuery({
    queryKey: QUERY_KEYS.fpo.batchStatus(batchId),
    queryFn: async () => {
      const { data } = await apiClient.get(API_ENDPOINTS.FPO.BATCH_STATUS(batchId));
      return data.data;
    },
    enabled: !!batchId && isProcessing,
    refetchInterval: isProcessing ? 3_000 : false,
  });
}
