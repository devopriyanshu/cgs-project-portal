// src/hooks/projects/useProjectMutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import apiClient from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/constants/api-endpoints';
import { QUERY_KEYS } from '@/lib/constants/query-keys';
import { getErrorMessage, isNormalizedError } from '@/lib/api/error-handler';
import type { Project } from '@/types/project.types';

export function useCreateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<Project>) => {
      const { data } = await apiClient.post(API_ENDPOINTS.PROJECTS.CREATE, payload);
      return data.data as Project;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.projects.all() });
    },
    onError: (err) => {
      const msg = isNormalizedError(err) ? getErrorMessage(err.code, err.message) : 'Failed to create project.';
      toast.error(msg);
    },
  });
}

export function useUpdateProject(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<Project>) => {
      const { data } = await apiClient.patch(API_ENDPOINTS.PROJECTS.UPDATE(id), payload);
      return data.data as Project;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.projects.detail(id) });
      toast.success('Project updated successfully.');
    },
    onError: (err) => {
      const msg = isNormalizedError(err) ? getErrorMessage(err.code, err.message) : 'Failed to update project.';
      toast.error(msg);
    },
  });
}

export function useSubmitProject(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data } = await apiClient.post(API_ENDPOINTS.PROJECTS.SUBMIT(id));
      return data.data as Project;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.projects.detail(id) });
      toast.success('Project submitted for review.');
    },
    onError: (err) => {
      const msg = isNormalizedError(err) ? getErrorMessage(err.code, err.message) : 'Submission failed.';
      toast.error(msg);
    },
  });
}
