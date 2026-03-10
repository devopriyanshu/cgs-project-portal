// src/hooks/mrv/useMrv.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import apiClient from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/constants/api-endpoints';
import { QUERY_KEYS } from '@/lib/constants/query-keys';
import { getErrorMessage, isNormalizedError } from '@/lib/api/error-handler';
import type { MrvRecord, SoilSample, SatelliteStatus } from '@/types/mrv.types';

export function useMrvRecords(projectId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.mrv.list(projectId),
    queryFn: async (): Promise<MrvRecord[]> => {
      const { data } = await apiClient.get(API_ENDPOINTS.MRV.LIST(projectId));
      return data.data;
    },
    enabled: !!projectId,
    staleTime: 60_000,
  });
}

export function useMrvRecord(projectId: string, mrvId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.mrv.detail(projectId, mrvId),
    queryFn: async (): Promise<MrvRecord> => {
      const { data } = await apiClient.get(API_ENDPOINTS.MRV.GET(projectId, mrvId));
      return data.data;
    },
    enabled: !!projectId && !!mrvId,
  });
}

export function useSatelliteStatus(projectId: string, mrvId: string, isProcessing: boolean) {
  return useQuery({
    queryKey: QUERY_KEYS.mrv.satelliteStatus(projectId, mrvId),
    queryFn: async () => {
      const { data } = await apiClient.get(API_ENDPOINTS.MRV.SATELLITE_STATUS(projectId, mrvId));
      return data.data as { status: SatelliteStatus };
    },
    enabled: !!projectId && !!mrvId && isProcessing,
    refetchInterval: isProcessing ? 15_000 : false,
  });
}

export function useSoilSamples(mrvId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.mrv.soilSamples(mrvId),
    queryFn: async (): Promise<SoilSample[]> => {
      const { data } = await apiClient.get(API_ENDPOINTS.MRV.SOIL_SAMPLES(mrvId));
      return data.data;
    },
    enabled: !!mrvId,
  });
}

export function useCreateMrvRecord(projectId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { period: string; startDate: string }) => {
      const { data } = await apiClient.post(API_ENDPOINTS.MRV.CREATE(projectId), payload);
      return data.data as MrvRecord;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.mrv.list(projectId) });
      toast.success('New monitoring period created.');
    },
    onError: (err) => {
      const msg = isNormalizedError(err) ? getErrorMessage(err.code) : 'Failed to create MRV record.';
      toast.error(msg);
    },
  });
}

export function useRequestSatelliteAnalysis(projectId: string, mrvId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data } = await apiClient.post(API_ENDPOINTS.MRV.REQUEST_SATELLITE(projectId, mrvId));
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.mrv.detail(projectId, mrvId) });
      toast.success('Satellite analysis requested. This may take up to 15 minutes.');
    },
    onError: (err) => {
      const msg = isNormalizedError(err) ? getErrorMessage(err.code) : 'Failed to request satellite analysis.';
      toast.error(msg);
    },
  });
}

export function useAddSoilSample(mrvId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<SoilSample>) => {
      const { data } = await apiClient.post(API_ENDPOINTS.MRV.ADD_SOIL_SAMPLE(mrvId), payload);
      return data.data as SoilSample;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.mrv.soilSamples(mrvId) });
      toast.success('Soil sample added.');
    },
    onError: (err) => {
      const msg = isNormalizedError(err) ? getErrorMessage(err.code) : 'Failed to add soil sample.';
      toast.error(msg);
    },
  });
}

export function useSubmitToVvb(mrvId: string, projectId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data } = await apiClient.post(API_ENDPOINTS.MRV.SUBMIT_TO_VVB(mrvId));
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.mrv.detail(projectId, mrvId) });
      toast.success('Report submitted to VVB successfully.');
    },
    onError: (err) => {
      const msg = isNormalizedError(err) ? getErrorMessage(err.code) : 'VVB submission failed.';
      toast.error(msg);
    },
  });
}
