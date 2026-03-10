// src/components/projects/ProjectBucketBadge.tsx
import type { ProjectBucket } from '@/types/project.types';
import { cn } from '@/lib/utils/cn';

interface Props {
  bucket: ProjectBucket;
  size?: 'sm' | 'md' | 'lg';
}

const BUCKET_CONFIG: Record<ProjectBucket, { label: string; className: string }> = {
  BUCKET_A: {
    label: 'Bucket A',
    className: 'bg-cgs-gold/15 text-amber-700 border border-cgs-gold/30',
  },
  BUCKET_B: {
    label: 'Bucket B',
    className: 'bg-cgs-sage/15 text-cgs-moss border border-cgs-sage/30',
  },
  BUCKET_C: {
    label: 'Bucket C',
    className: 'bg-cgs-earth/15 text-cgs-earth border border-cgs-earth/30',
  },
};

const SIZE_MAP = {
  sm: 'px-2 py-0.5 text-[10px]',
  md: 'px-2.5 py-0.5 text-xs',
  lg: 'px-4 py-1.5 text-sm font-semibold',
};

export function ProjectBucketBadge({ bucket, size = 'md' }: Props) {
  const config = BUCKET_CONFIG[bucket];
  if (!config) return null;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full font-medium',
        config.className,
        SIZE_MAP[size]
      )}
    >
      {config.label}
    </span>
  );
}
