// src/components/fpo/FarmerTable.tsx
import { useState } from 'react';
import { Search } from 'lucide-react';
import { useFarmers } from '@/hooks/fpo/useFpo';
import { Table } from '@/components/ui/Table';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Pagination } from '@/components/ui/Pagination';
import { TableRowSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import type { Farmer } from '@/types/fpo.types';

const STATUS_FILTERS = ['All', 'Active', 'Pending KYC', 'Inactive'];

const KYC_BADGE: Record<string, { label: string; variant: 'success' | 'warning' | 'error' | 'default' }> = {
  VERIFIED: { label: 'Verified', variant: 'success' },
  PENDING: { label: 'Pending KYC', variant: 'warning' },
  REJECTED: { label: 'Rejected', variant: 'error' },
};

export function FarmerTable() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const { data, isLoading } = useFarmers({
    page,
    limit: 20,
    search: search || undefined,
    status: statusFilter === 'All' ? undefined : statusFilter.toUpperCase().replace(' ', '_'),
  });

  const farmers = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div className="flex flex-col gap-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <Input
          placeholder="Search farmers…"
          leftIcon={<Search size={14} />}
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="max-w-xs"
        />
        <div className="flex gap-1.5">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => { setStatusFilter(s); setPage(1); }}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                statusFilter === s
                  ? 'border-cgs-sage bg-cgs-sage text-white'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-cgs-mist'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="rounded-xl border border-gray-100 p-0 overflow-hidden">
          <table className="w-full text-sm">
            <tbody>
              {Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} cols={7} />)}
            </tbody>
          </table>
        </div>
      ) : (
        <Table<Farmer>
          columns={[
            { key: 'name', header: 'Name', sortable: true },
            { key: 'phone', header: 'Phone' },
            { key: 'village', header: 'Village' },
            { key: 'district', header: 'District' },
            { key: 'totalAcres', header: 'Acres', render: (r) => r.totalAcres ?? '—' },
            {
              key: 'kycStatus',
              header: 'KYC',
              render: (r) => {
                const cfg = KYC_BADGE[r.kycStatus ?? 'PENDING'];
                return <Badge variant={cfg?.variant ?? 'default'}>{cfg?.label ?? r.kycStatus}</Badge>;
              },
            },
            {
              key: 'enrolledAt',
              header: 'Enrolled',
              render: (r) =>
                r.enrolledAt
                  ? new Date(r.enrolledAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
                  : '—',
            },
          ]}
          data={farmers}
          keyExtractor={(r) => r.id}
          emptyState={<EmptyState preset="farmers" />}
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
