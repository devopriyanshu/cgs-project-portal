// src/components/ui/Skeleton.tsx
import { cn } from '@/lib/utils/cn';

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-gray-200', className)}
      {...props}
    />
  );
}

// Preset skeletons matching content shapes
export function StatCardSkeleton() {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="mt-2 h-8 w-32" />
      <Skeleton className="mt-1.5 h-3 w-20" />
    </div>
  );
}

export function TableRowSkeleton({ cols = 5 }: { cols?: number }) {
  return (
    <tr className="border-b border-gray-50">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <Skeleton className={cn('h-3', i === 0 ? 'w-36' : i === cols - 1 ? 'w-16' : 'w-24')} />
        </td>
      ))}
    </tr>
  );
}

export function ProjectCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-100 bg-white">
      <Skeleton className="h-24 rounded-none" />
      <div className="p-4">
        <div className="mb-3 flex justify-between">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <Skeleton className="mb-2 h-3 w-28" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  );
}

export function KanbanCardSkeleton() {
  return (
    <div className="rounded-lg border border-gray-100 bg-white p-3">
      <Skeleton className="h-3 w-32 mb-2" />
      <Skeleton className="h-3 w-20" />
    </div>
  );
}
