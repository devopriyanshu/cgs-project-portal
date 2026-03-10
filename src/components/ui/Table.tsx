// src/components/ui/Table.tsx
import * as React from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface Column<T> {
  key: keyof T | string;
  header: string;
  sortable?: boolean;
  className?: string;
  render?: (row: T, index: number) => React.ReactNode;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T, index: number) => string;
  sortKey?: string;
  sortOrder?: 'asc' | 'desc';
  onSort?: (key: string) => void;
  className?: string;
  emptyState?: React.ReactNode;
  rowClassName?: (row: T) => string;
}

export function Table<T>({
  columns,
  data,
  keyExtractor,
  sortKey,
  sortOrder,
  onSort,
  className,
  emptyState,
  rowClassName,
}: TableProps<T>) {
  return (
    <div className={cn('w-full overflow-x-auto rounded-xl border border-gray-100', className)}>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/80">
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className={cn(
                  'px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500',
                  col.sortable && 'cursor-pointer select-none hover:text-cgs-forest',
                  col.className
                )}
                onClick={() => col.sortable && onSort?.(String(col.key))}
              >
                <span className="flex items-center gap-1">
                  {col.header}
                  {col.sortable && (
                    <span className="text-gray-300">
                      {sortKey === col.key ? (
                        sortOrder === 'asc' ? (
                          <ChevronUp size={12} className="text-cgs-sage" />
                        ) : (
                          <ChevronDown size={12} className="text-cgs-sage" />
                        )
                      ) : (
                        <ChevronsUpDown size={12} />
                      )}
                    </span>
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 && emptyState ? (
            <tr>
              <td colSpan={columns.length} className="py-12 text-center">
                {emptyState}
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr
                key={keyExtractor(row, index)}
                className={cn(
                  'border-b border-gray-50 transition-colors hover:bg-gray-50/60',
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30',
                  rowClassName?.(row)
                )}
              >
                {columns.map((col) => (
                  <td key={String(col.key)} className={cn('px-4 py-3 text-cgs-charcoal', col.className)}>
                    {col.render
                      ? col.render(row, index)
                      : String((row as Record<string, unknown>)[String(col.key)] ?? '—')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
