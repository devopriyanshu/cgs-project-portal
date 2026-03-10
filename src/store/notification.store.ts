// src/store/notification.store.ts
import { create } from 'zustand';
import type { Notification } from '@/types/notification.types';

interface NotificationStore {
  queue: Notification[];
  unreadCount: number;
  addNotification: (n: Notification) => void;
  removeNotification: (id: string) => void;
  setUnreadCount: (count: number) => void;
  clearAll: () => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  queue: [],
  unreadCount: 0,
  addNotification: (n) =>
    set((s) => ({ queue: [n, ...s.queue].slice(0, 50) })),
  removeNotification: (id) =>
    set((s) => ({ queue: s.queue.filter((n) => n.id !== id) })),
  setUnreadCount: (unreadCount) => set({ unreadCount }),
  clearAll: () => set({ queue: [], unreadCount: 0 }),
}));
