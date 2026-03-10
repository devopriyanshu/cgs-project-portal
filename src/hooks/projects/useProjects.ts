// src/hooks/projects/useProjects.ts
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import apiClient from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/constants/api-endpoints';
import { QUERY_KEYS } from '@/lib/constants/query-keys';
import type { PaginatedResponse, PaginationParams } from '@/types/api.types';
import type { Project, ProjectStatus, ProjectSector, ProjectBucket } from '@/types/project.types';

export interface ProjectFilters extends PaginationParams {
  status?: ProjectStatus;
  sector?: ProjectSector;
  bucket?: ProjectBucket;
  search?: string;
}

export function useProjects(filters: ProjectFilters = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.projects.list(filters as Record<string, unknown>),
    queryFn: async (): Promise<PaginatedResponse<Project>> => {
      const { data } = await apiClient.get(API_ENDPOINTS.PROJECTS.LIST, {
        params: {
          page: filters.page ?? 1,
          limit: filters.limit ?? 10,
          ...(filters.status && { status: filters.status }),
          ...(filters.sector && { sector: filters.sector }),
          ...(filters.bucket && { bucket: filters.bucket }),
          ...(filters.search && { search: filters.search }),
          ...(filters.sortBy && { sortBy: filters.sortBy }),
          ...(filters.sortOrder && { sortOrder: filters.sortOrder }),
        },
      });
      return data;
    },
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
}

export function useProject(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.projects.detail(id),
    queryFn: async (): Promise<Project> => {
      const { data } = await apiClient.get(API_ENDPOINTS.PROJECTS.GET(id));
      return data.data;
    },
    enabled: !!id,
    staleTime: 60_000,
  });
}

export function useProjectDocuments(projectId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.projects.documents(projectId),
    queryFn: async () => {
      const { data } = await apiClient.get(API_ENDPOINTS.PROJECTS.DOCUMENTS(projectId));
      return data.data;
    },
    enabled: !!projectId,
  });
}
