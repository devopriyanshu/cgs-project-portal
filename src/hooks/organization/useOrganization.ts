// src/hooks/organization/useOrganization.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import apiClient from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/constants/api-endpoints';
import { QUERY_KEYS } from '@/lib/constants/query-keys';
import { getErrorMessage, isNormalizedError } from '@/lib/api/error-handler';
import type { Organization } from '@/types/organization.types';
import type { ApiResponse } from '@/types/api.types';

export function useMyOrganization() {
  return useQuery({
    queryKey: QUERY_KEYS.organizations.mine(),
    queryFn: async (): Promise<Organization> => {
      const { data } = await apiClient.get<ApiResponse<Organization>>(API_ENDPOINTS.ORGANIZATIONS.MY_ORG);
      return data.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateOrganization(orgId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<Organization>) => {
      const { data } = await apiClient.patch<ApiResponse<Organization>>(
        API_ENDPOINTS.ORGANIZATIONS.UPDATE(orgId), payload
      );
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.organizations.mine() });
      toast.success('Organisation updated successfully.');
    },
    onError: (err) => {
      const msg = isNormalizedError(err) ? getErrorMessage(err.code) : 'Update failed.';
      toast.error(msg);
    },
  });
}

export function useKycStatus() {
  return useQuery({
    queryKey: QUERY_KEYS.kyc.status(),
    queryFn: async () => {
      const { data } = await apiClient.get(API_ENDPOINTS.KYC.STATUS);
      return data.data as { status: string; submittedAt?: string; reviewedAt?: string; reason?: string };
    },
    staleTime: 60_000,
  });
}
