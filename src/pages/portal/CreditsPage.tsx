// src/pages/portal/CreditsPage.tsx
import { useState } from 'react';
import { useCredits } from '@/hooks/credits/useCredits';
import { PageHeader } from '@/components/layout/PageHeader';
import { Pagination } from '@/components/ui/Pagination';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatNumber } from '@/lib/utils/format';
import { CreditStatus } from '@/types/credit.types';
import { cn } from '@/lib/utils/cn';

const STATUS_STYLES: Record<string, string> = {
  [CreditStatus.ISSUED]:   'bg-blue-100 text-blue-700',
  [CreditStatus.LISTED]:   'bg-cgs-sage/20 text-cgs-moss',
  [CreditStatus.RESERVED]: 'bg-amber-100 text-amber-700',
  [CreditStatus.SOLD]:     'bg-green-100 text-green-700',
  [CreditStatus.RETIRED]:  'bg-gray-100 text-gray-600',
};

export default function CreditsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useCredits({ page, limit: 10 });

  const stats = data?.data ? {
    total: data.data.reduce((sum, c) => sum + c.quantity, 0),
    listed: data.data.filter(c => c.status === CreditStatus.LISTED).reduce((sum, c) => sum + c.quantity, 0),
    sold: data.data.filter(c => c.status === CreditStatus.SOLD).reduce((sum, c) => sum + c.quantity, 0),
    buffer: Math.floor(data.data.reduce((sum, c) => sum + c.quantity, 0) * 0.2),
  } : null;

  return (
    <div className="space-y-6">
      <PageHeader title="Credit Inventory" subtitle="Manage and list your verified carbon credits" />

      {/* Summary stats */}
      {stats && (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { label: 'Total Issued', value: formatNumber(stats.total) },
            { label: 'Listed', value: formatNumber(stats.listed) },
            { label: 'Sold', value: formatNumber(stats.sold) },
            { label: 'Buffer Pool (20%)', value: formatNumber(stats.buffer) },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-cgs-mist/40">
              <p className="text-xl font-bold text-cgs-charcoal">{value}</p>
              <p className="mt-1 text-sm text-gray-500">{label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Credits table */}
      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 animate-pulse rounded-lg bg-gray-100" />
          ))}
        </div>
      ) : !data?.data?.length ? (
        <EmptyState preset="credits" />
      ) : (
        <div className="rounded-xl bg-white shadow-sm ring-1 ring-cgs-mist/40 overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="bg-cgs-cream/60 text-left">
                <th className="px-4 py-3 font-medium text-cgs-forest">Serial Number</th>
                <th className="px-4 py-3 font-medium text-cgs-forest">Vintage</th>
                <th className="px-4 py-3 font-medium text-cgs-forest">Quantity (tonnes)</th>
                <th className="px-4 py-3 font-medium text-cgs-forest">Status</th>
                <th className="px-4 py-3 font-medium text-cgs-forest">Quality Score</th>
                <th className="px-4 py-3 text-right font-medium text-cgs-forest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.data.map((credit) => (
                <tr key={credit.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono-cgs text-xs text-cgs-charcoal font-medium">
                    {credit.serialNumber ?? '—'}
                  </td>
                  <td className="px-4 py-3">{credit.vintageYear}</td>
                  <td className="px-4 py-3 font-semibold">{formatNumber(credit.quantity)}</td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      'rounded-full px-2 py-0.5 text-xs font-medium',
                      STATUS_STYLES[credit.status] ?? 'bg-gray-100 text-gray-600'
                    )}>
                      {credit.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {credit.qualityScore != null ? (
                      <div className="flex items-center gap-1">
                        {'★'.repeat(Math.floor(credit.qualityScore / 20))}{'☆'.repeat(5 - Math.floor(credit.qualityScore / 20))}
                        <span className="ml-1 text-xs text-gray-500">{(credit.qualityScore / 20).toFixed(1)}/5</span>
                      </div>
                    ) : '—'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {credit.status === CreditStatus.ISSUED && (
                      <button className="rounded-lg bg-cgs-sage px-3 py-1 text-xs font-semibold text-white hover:bg-cgs-moss">
                        List on Marketplace
                      </button>
                    )}
                    {credit.status === CreditStatus.LISTED && (
                      <button className="rounded-lg border border-cgs-mist px-3 py-1 text-xs font-medium text-cgs-forest hover:bg-gray-50">
                        View Ledger
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
