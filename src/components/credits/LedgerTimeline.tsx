// src/components/credits/LedgerTimeline.tsx
import { useCreditLedger } from '@/hooks/credits/useCredits';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatRelativeTime } from '@/lib/utils/format';
import { cn } from '@/lib/utils/cn';
import type { CreditLedgerEntry } from '@/types/credit.types';

const EVENT_COLORS: Record<string, string> = {
  ISSUED:   'bg-blue-100 text-blue-700',
  LISTED:   'bg-cgs-sage/20 text-cgs-moss',
  RESERVED: 'bg-amber-100 text-amber-700',
  SOLD:     'bg-green-100 text-green-700',
  RETIRED:  'bg-gray-200 text-gray-600',
  DELISTED: 'bg-red-100 text-red-600',
};

export function LedgerTimeline({ creditId }: { creditId: string }) {
  const { data: entries, isLoading } = useCreditLedger(creditId);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3 pl-5 border-l-2 border-gray-100">
        {[1, 2, 3].map(i => <Skeleton key={i} className="h-12 rounded-lg" />)}
      </div>
    );
  }

  if (!entries?.length) {
    return <p className="text-sm text-gray-400">No ledger entries yet.</p>;
  }

  return (
    <div className="relative pl-6">
      <div className="absolute left-2 top-2 h-[calc(100%-16px)] w-0.5 bg-gray-100" />
      <div className="flex flex-col gap-4">
        {(entries as CreditLedgerEntry[]).map((entry) => {
          // Use toStatus as the display event label
          const eventLabel = entry.toStatus;
          const meta = entry.metadata as Record<string, unknown> | undefined;
          const notes = meta?.notes as string | undefined;
          const price = meta?.pricePerTonne as number | undefined;

          return (
            <div key={entry.id} className="relative flex items-start gap-3">
              <div className="absolute -left-[18px] mt-0.5 h-3 w-3 rounded-full border-2 border-cgs-sage bg-white" />
              <div className="flex-1 rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-medium', EVENT_COLORS[eventLabel] ?? 'bg-gray-100 text-gray-600')}>
                    {entry.action ?? eventLabel}
                  </span>
                  <span className="text-xs text-gray-400">{formatRelativeTime(entry.createdAt)}</span>
                </div>
                {notes && <p className="mt-1.5 text-xs text-gray-500">{notes}</p>}
                {price && (
                  <p className="mt-1 text-xs font-medium text-cgs-forest">
                    Price: ₹{Number(price).toLocaleString('en-IN')}/tonne
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
