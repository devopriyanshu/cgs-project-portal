// src/components/credits/CreditTable.tsx
import { useState } from 'react';
import { useCredits, useCreateListing } from '@/hooks/credits/useCredits';
import { Table } from '@/components/ui/Table';
import { Pagination } from '@/components/ui/Pagination';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { TableRowSkeleton } from '@/components/ui/Skeleton';
import { CreateListingForm } from './CreateListingForm';
import { CreditStatusBadge } from './CreditStatusBadge';
import type { CarbonCredit } from '@/types/credit.types';

interface Props {
  projectId?: string;
}

export function CreditTable({ projectId }: Props) {
  const [page, setPage] = useState(1);
  const [listingCreditId, setListingCreditId] = useState<string | null>(null);

  const { data, isLoading } = useCredits({ page, limit: 10, projectId });
  const credits = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div className="flex flex-col gap-4">
      {isLoading ? (
        <div className="rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <tbody>{Array.from({ length: 10 }).map((_, i) => <TableRowSkeleton key={i} cols={6} />)}</tbody>
          </table>
        </div>
      ) : (
        <Table<CarbonCredit>
          columns={[
            { key: 'serialNumber', header: 'Serial Number', render: (r) => <span className="font-mono text-xs text-gray-600">{r.serialNumber}</span> },
            { key: 'vintageYear', header: 'Vintage' },
            { key: 'quantity', header: 'Quantity', render: (r) => `${r.quantity?.toLocaleString('en-IN')} t` },
            { key: 'status', header: 'Status', render: (r) => <CreditStatusBadge status={r.status} /> },
            { key: 'qualityScore', header: 'Quality', render: (r) => r.qualityScore ? `${r.qualityScore}/100` : '—' },
            {
              key: 'id',
              header: 'Actions',
              render: (r) => (
                <div className="flex gap-2">
                  {r.status === 'ISSUED' && (
                    <Button size="sm" variant="secondary" onClick={() => setListingCreditId(r.id)}>
                      List
                    </Button>
                  )}
                </div>
              ),
            },
          ]}
          data={credits}
          keyExtractor={(r) => r.id}
          emptyState={<EmptyState preset="credits" />}
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

      {listingCreditId && (
        <CreateListingForm
          creditId={listingCreditId}
          open={!!listingCreditId}
          onOpenChange={(v) => !v && setListingCreditId(null)}
        />
      )}
    </div>
  );
}
