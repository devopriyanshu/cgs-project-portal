// src/components/ui/Pagination.tsx
import { cn } from '@/lib/utils/cn';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  total?: number;
  limit?: number;
  onPageChange: (page: number) => void;
  className?: string;
}

function getPages(current: number, total: number): Array<number | '...'> {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, '...', total];
  if (current >= total - 3) return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
  return [1, '...', current - 1, current, current + 1, '...', total];
}

export function Pagination({
  page, totalPages, hasNextPage, hasPrevPage, total, limit, onPageChange, className
}: PaginationProps) {
  const pages = getPages(page, totalPages);
  const start = total && limit ? ((page - 1) * limit) + 1 : null;
  const end = total && limit ? Math.min(page * limit, total) : null;

  return (
    <div className={cn('flex flex-col items-center gap-3 sm:flex-row sm:justify-between', className)}>
      {/* Showing X-Y of Z */}
      {total != null && start != null && end != null && (
        <p className="text-sm text-gray-500">
          Showing <span className="font-medium">{start}–{end}</span> of{' '}
          <span className="font-medium">{total}</span> results
        </p>
      )}

      {/* Pagination controls */}
      <div className="flex items-center gap-1">
        {/* Previous */}
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={!hasPrevPage}
          className="flex h-8 items-center gap-1 rounded-lg border border-cgs-mist px-3 text-sm font-medium text-cgs-forest hover:bg-cgs-mist/30 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft size={14} /> Prev
        </button>

        {/* Desktop: page numbers */}
        <div className="hidden items-center gap-1 sm:flex">
          {pages.map((p, i) =>
            p === '...' ? (
              <span key={`ellipsis-${i}`} className="px-2 text-gray-400">…</span>
            ) : (
              <button
                key={p}
                onClick={() => onPageChange(p as number)}
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition',
                  p === page
                    ? 'bg-cgs-sage text-white shadow-sm'
                    : 'border border-cgs-mist text-cgs-forest hover:bg-cgs-mist/30'
                )}
              >
                {p}
              </button>
            )
          )}
        </div>

        {/* Mobile: page X of Y */}
        <span className="px-3 text-sm font-medium text-gray-500 sm:hidden">
          Page {page} of {totalPages}
        </span>

        {/* Next */}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={!hasNextPage}
          className="flex h-8 items-center gap-1 rounded-lg border border-cgs-mist px-3 text-sm font-medium text-cgs-forest hover:bg-cgs-mist/30 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
