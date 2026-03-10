// src/pages/portal/NotificationsPage.tsx
import { useState } from 'react';
import { Bell, CheckCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNotifications, useMarkAllRead, useMarkNotificationRead } from '@/hooks/notifications/useNotifications';
import { useNotificationStore } from '@/store/notification.store';
import { formatRelativeTime } from '@/lib/utils/format';
import { Pagination } from '@/components/ui/Pagination';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageHeader } from '@/components/layout/PageHeader';
import { NotificationCategory } from '@/types/notification.types';
import { cn } from '@/lib/utils/cn';

type Filter = 'all' | 'unread' | NotificationCategory;

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'unread', label: 'Unread' },
  { id: NotificationCategory.PROJECT, label: 'Projects' },
  { id: NotificationCategory.PAYMENT, label: 'Payments' },
  { id: NotificationCategory.MRV, label: 'MRV' },
];

const CATEGORY_ICONS: Record<NotificationCategory, string> = {
  [NotificationCategory.PROJECT]: '📁',
  [NotificationCategory.PAYMENT]: '💸',
  [NotificationCategory.MRV]: '📡',
  [NotificationCategory.KYC]: '🪪',
  [NotificationCategory.SYSTEM]: '🔔',
};

export default function NotificationsPage() {
  const [filter, setFilter] = useState<Filter>('all');
  const [page, setPage] = useState(1);
  const { data, isLoading } = useNotifications(page);
  const markAllRead = useMarkAllRead();
  const markRead = useMarkNotificationRead();
  const { unreadCount } = useNotificationStore();

  const filtered = data?.data?.filter((n) => {
    if (filter === 'unread') return !n.isRead;
    if (filter === 'all') return true;
    return n.category === filter;
  }) ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        subtitle={unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
        actions={
          unreadCount > 0 ? (
            <button
              onClick={() => markAllRead.mutate()}
              disabled={markAllRead.isPending}
              className="flex items-center gap-2 rounded-lg border border-cgs-mist bg-white px-4 py-2 text-sm font-medium text-cgs-forest hover:bg-cgs-mist/30"
            >
              <CheckCheck size={15} /> Mark all read
            </button>
          ) : undefined
        }
      />

      {/* Filter pills */}
      <div className="flex gap-2 flex-wrap">
        {FILTERS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => { setFilter(id); setPage(1); }}
            className={cn(
              'rounded-full px-3 py-1.5 text-sm font-medium transition',
              filter === id
                ? 'bg-cgs-sage text-white'
                : 'bg-white text-gray-500 ring-1 ring-cgs-mist hover:ring-cgs-sage/40'
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Notification list */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-start gap-3 rounded-xl bg-white p-4 shadow-sm">
              <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-48 animate-pulse rounded bg-gray-200" />
                <div className="h-3 w-72 animate-pulse rounded bg-gray-100" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState preset="notifications" />
      ) : (
        <div className="space-y-2">
          {filtered.map((n) => (
            <motion.button
              key={n.id}
              layout
              onClick={() => !n.isRead && markRead.mutate(n.id)}
              className={cn(
                'w-full flex items-start gap-3 rounded-xl p-4 text-left transition',
                !n.isRead
                  ? 'bg-cgs-sage/5 ring-1 ring-cgs-sage/20 hover:bg-cgs-sage/10'
                  : 'bg-white ring-1 ring-gray-100 hover:bg-gray-50'
              )}
            >
              {/* Icon */}
              <div className={cn(
                'flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-lg',
                !n.isRead ? 'bg-cgs-sage/10' : 'bg-gray-100'
              )}>
                {CATEGORY_ICONS[n.category] ?? <Bell size={16} />}
              </div>

              <div className="flex-1 min-w-0">
                <p className={cn('text-sm leading-snug', !n.isRead ? 'font-semibold text-cgs-forest' : 'text-cgs-charcoal')}>
                  {n.title}
                </p>
                {n.body && (
                  <p className="mt-0.5 text-sm text-gray-500 line-clamp-2">{n.body}</p>
                )}
                <p className="mt-1 text-xs text-gray-400">{formatRelativeTime(n.createdAt)}</p>
              </div>

              {!n.isRead && (
                <div className="h-2 w-2 shrink-0 mt-1.5 rounded-full bg-cgs-sage" />
              )}
            </motion.button>
          ))}
        </div>
      )}

      {/* Pagination */}
      {data?.meta && data.meta.totalPages > 1 && (
        <Pagination
          page={data.meta.page}
          totalPages={data.meta.totalPages}
          hasNextPage={data.meta.hasNextPage}
          hasPrevPage={data.meta.hasPrevPage}
          total={data.meta.total}
          limit={data.meta.limit}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
