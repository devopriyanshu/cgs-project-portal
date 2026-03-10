// src/hooks/notifications/useNotifications.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import apiClient from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/constants/api-endpoints';
import { QUERY_KEYS } from '@/lib/constants/query-keys';
import { useNotificationStore } from '@/store/notification.store';
import type { Notification } from '@/types/notification.types';
import type { PaginatedResponse } from '@/types/api.types';

export function useNotifications(page = 1) {
  const { setUnreadCount } = useNotificationStore();

  return useQuery({
    queryKey: QUERY_KEYS.notifications.list(page),
    queryFn: async (): Promise<PaginatedResponse<Notification>> => {
      const { data } = await apiClient.get(API_ENDPOINTS.NOTIFICATIONS.LIST, {
        params: { page, limit: 20 },
      });
      // Update global unread count from first-page metadata
      if (page === 1 && data.meta?.unreadCount !== undefined) {
        setUnreadCount(data.meta.unreadCount);
      }
      return data;
    },
    staleTime: 30_000,
  });
}

// ⚠️ TanStack Query v5: id goes in mutationFn, NOT the hook constructor arg.
// Usage: const markRead = useMarkNotificationRead(); markRead.mutate(notificationId);
export function useMarkNotificationRead() {
  const qc = useQueryClient();
  const { setUnreadCount, unreadCount } = useNotificationStore();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.patch(API_ENDPOINTS.NOTIFICATIONS.MARK_READ(id));
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notifications'] });
      setUnreadCount(Math.max(0, unreadCount - 1));
    },
  });
}

export function useMarkAllRead() {
  const qc = useQueryClient();
  const { setUnreadCount } = useNotificationStore();

  return useMutation({
    mutationFn: async () => {
      await apiClient.patch(API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notifications'] });
      setUnreadCount(0);
      toast.success('All notifications marked as read.');
    },
  });
}
