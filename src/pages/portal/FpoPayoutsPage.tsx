// src/pages/portal/FpoPayoutsPage.tsx
import { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { useFarmerPayouts, useRetryPayout } from '@/hooks/fpo/useFpo';
import { PageHeader } from '@/components/layout/PageHeader';
import { Pagination } from '@/components/ui/Pagination';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatINR, formatDate } from '@/lib/utils/format';
import { cn } from '@/lib/utils/cn';

type PayoutTab = 'all' | 'pending' | 'processing' | 'completed' | 'failed';

const TABS: { id: PayoutTab; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'pending', label: 'Pending' },
  { id: 'processing', label: 'Processing' },
  { id: 'completed', label: 'Completed' },
  { id: 'failed', label: 'Failed' },
];

const STATUS_STYLES: Record<string, string> = {
  PENDING:    'bg-amber-100 text-amber-700',
  PROCESSING: 'bg-blue-100 text-blue-700',
  COMPLETED:  'bg-green-100 text-green-700',
  FAILED:     'bg-red-100 text-red-700',
};

export default function FpoPayoutsPage() {
  const [tab, setTab] = useState<PayoutTab>('all');
  const [page, setPage] = useState(1);
  const { data, isLoading } = useFarmerPayouts({
    page, limit: 20,
    status: tab !== 'all' ? tab.toUpperCase() : undefined,
  });
  const retry = useRetryPayout();

  const failedPayouts = data?.data?.filter(p => p.status === 'FAILED') ?? [];

  return (
    <div className="space-y-6">
      <PageHeader title="Farmer Payouts" subtitle="Track and manage all farmer payments" />

      {/* Failed payouts alert */}
      {failedPayouts.length > 0 && tab === 'all' && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <AlertCircle size={18} className="shrink-0 text-red-500" />
          <p className="text-sm text-red-700">
            <strong>{failedPayouts.length} payout{failedPayouts.length > 1 ? 's' : ''} failed.</strong>{' '}
            Common reasons: UPI ID inactive, bank account closed.{' '}
            <button
              onClick={() => setTab('failed')}
              className="font-medium underline"
            >
              Review & Retry All Failed →
            </button>
          </p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 border-b border-cgs-mist">
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => { setTab(id); setPage(1); }}
            className={cn(
              'px-4 py-2.5 text-sm font-medium transition border-b-2 -mb-px',
              id === tab
                ? 'border-cgs-sage text-cgs-sage'
                : 'border-transparent text-gray-500 hover:text-cgs-forest'
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 animate-pulse rounded-lg bg-gray-100" />
          ))}
        </div>
      ) : !data?.data?.length ? (
        <EmptyState preset="payouts" />
      ) : (
        <div className="rounded-xl bg-white shadow-sm ring-1 ring-cgs-mist/40 overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="bg-cgs-cream/60 text-left">
                <th className="px-4 py-3 font-medium text-cgs-forest">Farmer</th>
                <th className="px-4 py-3 font-medium text-cgs-forest">Amount</th>
                <th className="px-4 py-3 font-medium text-cgs-forest">UPI ID</th>
                <th className="px-4 py-3 font-medium text-cgs-forest">Status</th>
                <th className="px-4 py-3 font-medium text-cgs-forest">Date</th>
                <th className="px-4 py-3 text-right font-medium text-cgs-forest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.data.map((payout) => (
                <tr key={payout.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-cgs-charcoal">
                    {payout.farmer?.firstName} {payout.farmer?.lastName}
                  </td>
                  <td className="px-4 py-3 font-semibold">{formatINR(payout.amount)}</td>
                  <td className="px-4 py-3 font-mono-cgs text-xs text-gray-500">{payout.upiId ?? '—'}</td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      'rounded-full px-2 py-0.5 text-xs font-medium',
                      STATUS_STYLES[payout.status] ?? 'bg-gray-100 text-gray-600',
                      payout.status === 'PROCESSING' && 'animate-pulse'
                    )}>
                      {payout.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">{formatDate(payout.createdAt)}</td>
                  <td className="px-4 py-3 text-right">
                    {payout.status === 'FAILED' && (
                      <button
                        onClick={() => retry.mutate(payout.id)}
                        disabled={retry.isPending}
                        className="rounded-lg bg-red-500 px-3 py-1 text-xs font-medium text-white hover:bg-red-600 disabled:opacity-50"
                      >
                        Retry
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

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
