// src/components/projects/mrv/MrvKanbanColumn.tsx
import { cn } from '@/lib/utils/cn';
import type { MrvRecord } from '@/types/mrv.types';

interface Props {
  title: string;
  records: MrvRecord[];
  isActive?: boolean;
  onSelect: (record: MrvRecord) => void;
  selected?: string;
}

export function MrvKanbanColumn({ title, records, isActive, onSelect, selected }: Props) {
  return (
    <div
      className={cn(
        'flex min-w-44 flex-col rounded-xl border bg-gray-50/60 p-3',
        isActive ? 'border-cgs-sage/50 bg-cgs-sage/5' : 'border-gray-100'
      )}
    >
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs font-semibold text-gray-600">{title}</p>
        {records.length > 0 && (
          <span className="rounded-full bg-gray-200 px-1.5 py-0.5 text-[10px] font-semibold text-gray-600">
            {records.length}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        {records.map((r) => (
          <button
            key={r.id}
            onClick={() => onSelect(r)}
            className={cn(
              'rounded-lg border p-2.5 text-left text-xs transition-all',
              selected === r.id
                ? 'border-cgs-sage bg-white shadow-sm'
                : 'border-gray-100 bg-white hover:border-cgs-sage/50 hover:shadow-sm'
            )}
          >
            <p className="font-medium text-cgs-forest">{r.period}</p>
            {r.startDate && (
              <p className="mt-0.5 text-gray-400">
                Started {new Date(r.startDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
              </p>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
