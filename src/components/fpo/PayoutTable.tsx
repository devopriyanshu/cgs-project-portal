// src/components/fpo/PayoutTable.tsx
import { useState } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { useFarmerPayouts, useRetryPayout } from '@/hooks/fpo/useFpo';
import { Table } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Pagination } from '@/components/ui/Pagination';
import { EmptyState } from '@/components/ui/EmptyState';
import { TableRowSkeleton } from '@/components/ui/Skeleton';
import { formatINR } from '@/lib/utils/format';
import type { FarmerPayout } from '@/types/fpo.types';

const STATUS_TABS = ['All', 'Pending', 'Processing', 'Completed', 'Failed'];

const PAYOUT_BADGE: Record<string, { label: string; variant: 'warning' | 'info' | 'success' | 'error' | 'default' }> = {
  PENDING: { label: 'Pending', variant: 'warning' },
  PROCESSING: { label: 'Processing', variant: 'info' },
  COMPLETED: { label: 'Completed', variant: 'success' },
  FAILED: { label: 'Failed', variant: 'error' },
};

export function PayoutTable() {
  const [page, setPage] = useState(1);
  const [statusTab, setStatusTab] = useState('All');
  const retryPayout = useRetryPayout();

  const { data, isLoading } = useFarmerPayouts({
    page,
    limit: 20,
    status: statusTab === 'All' ? undefined : statusTab.toUpperCase(),
  });

  const payouts = data?.data ?? [];
  const meta = data?.meta;
  const failedCount = payouts.filter(p => p.status === 'FAILED').length;

  return (
    <div className="flex flex-col gap-4">
      {/* Failed alert */}
      {failedCount > 0 && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
          <AlertTriangle size={16} className="mt-0.5 shrink-0 text-red-500" />
          <div>
            <p className="text-sm font-semibold text-red-700">
              {failedCount} payout{failedCount > 1 ? 's' : ''} failed
            </p>
            <p className="text-xs text-red-500">
              Common reasons: UPI ID inactive, bank account closed. Review and retry below.
            </p>
          </div>
        </div>
      )}

      {/* Status tabs */}
      <div className="flex gap-1.5">
        {STATUS_TABS.map((t) => (
          <button
            key={t}
            onClick={() => { setStatusTab(t); setPage(1); }}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
              statusTab === t
                ? 'border-cgs-sage bg-cgs-sage text-white'
                : 'border-gray-200 bg-white text-gray-600 hover:border-cgs-mist'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <tbody>{Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} cols={6} />)}</tbody>
          </table>
        </div>
      ) : (
        <Table<FarmerPayout>
          columns={[
            { key: 'farmerName', header: 'Farmer Name' },
            { key: 'amount', header: 'Amount', render: (r) => formatINR(r.amount) },
            { key: 'upiId', header: 'UPI ID', render: (r) => r.upiId ?? '—' },
            {
              key: 'status',
              header: 'Status',
              render: (r) => {
                const cfg = PAYOUT_BADGE[r.status ?? 'PENDING'];
                return <Badge variant={cfg?.variant ?? 'default'}>{cfg?.label ?? r.status}</Badge>;
              },
            },
            { key: 'orderReference', header: 'Order Reference', render: (r) => <span className="font-mono text-xs text-gray-500">{r.orderReference ?? '—'}</span> },
            {
              key: 'id',
              header: 'Actions',
              render: (r) =>
                r.status === 'FAILED' ? (
                  <Button
                    size="sm"
                    variant="destructive"
                    loading={retryPayout.isPending}
                    onClick={() => retryPayout.mutate(r.id)}
                  >
                    <RefreshCw size={12} /> Retry
                  </Button>
                ) : null,
            },
          ]}
          data={payouts}
          keyExtractor={(r) => r.id}
          emptyState={<EmptyState preset="payouts" />}
        />
      )}

      {meta && (
        <Pagination
          page={page}
          totalPages={meta.totalPages}
          hasNextPage={meta.hasNextPage}
          hasPrevPage={meta.hasPrevPage}
          onPageChange={setPage}
          total={meta.total}
        />
      )}
    </div>
  );
}
