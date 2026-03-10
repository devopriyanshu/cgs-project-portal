// src/components/projects/ProjectFilters.tsx
import { Search, X } from 'lucide-react';
import { useCallback } from 'react';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils/cn';
import { ProjectStatus, ProjectSector, ProjectBucket } from '@/types/project.types';
import type { ProjectFilters as Filters } from '@/hooks/projects/useProjects';

const STATUS_OPTIONS: { value: ProjectStatus; label: string }[] = [
  { value: ProjectStatus.DRAFT, label: 'Draft' },
  { value: ProjectStatus.SUBMITTED, label: 'Submitted' },
  { value: ProjectStatus.PRE_SCREENING, label: 'Pre-Screening' },
  { value: ProjectStatus.ELIGIBLE, label: 'Eligible' },
  { value: ProjectStatus.INELIGIBLE, label: 'Ineligible' },
  { value: ProjectStatus.MRV_ACTIVE, label: 'MRV' },
  { value: ProjectStatus.ACTIVE, label: 'Active' },
  { value: ProjectStatus.COMPLETED, label: 'Completed' },
];

const SECTOR_OPTIONS: { value: ProjectSector; label: string }[] = [
  { value: ProjectSector.AGRICULTURE, label: '🌾 Agriculture' },
  { value: ProjectSector.RENEWABLE_ENERGY, label: '☀️ Renewable Energy' },
  { value: ProjectSector.WASTE_MANAGEMENT, label: '♻️ Waste' },
  { value: ProjectSector.INDUSTRIAL, label: '🏭 Industrial' },
  { value: ProjectSector.NATURE_BASED, label: '🌳 Nature-Based' },
  { value: ProjectSector.GREEN_BUILDINGS, label: '🏢 Green Buildings' },
];

const BUCKET_OPTIONS: { value: ProjectBucket; label: string }[] = [
  { value: ProjectBucket.A, label: 'Bucket A' },
  { value: ProjectBucket.B, label: 'Bucket B' },
  { value: ProjectBucket.C, label: 'Bucket C' },
];

interface Props {
  filters: Filters;
  onChange: (f: Partial<Filters>) => void;
}

function FilterPill<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value?: T;
  onChange: (v: T | undefined) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(value === opt.value ? undefined : opt.value)}
          className={cn(
            'rounded-full border px-3 py-1 text-xs font-medium transition-all',
            value === opt.value
              ? 'border-cgs-sage bg-cgs-sage text-white'
              : 'border-gray-200 bg-white text-gray-600 hover:border-cgs-mist hover:bg-cgs-cream'
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export function ProjectFilters({ filters, onChange }: Props) {
  const hasFilters = filters.status || filters.sector || filters.bucket || filters.search;

  const clearAll = useCallback(() => {
    onChange({ status: undefined, sector: undefined, bucket: undefined, search: '' });
  }, [onChange]);

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-cgs-mist/50 bg-white p-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Search projects..."
          leftIcon={<Search size={14} />}
          value={filters.search ?? ''}
          onChange={(e) => onChange({ search: e.target.value })}
          className="max-w-xs"
        />
        {hasFilters && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600"
          >
            <X size={12} /> Clear filters
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-4">
        <div>
          <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
            Status
          </p>
          <FilterPill
            options={STATUS_OPTIONS}
            value={filters.status}
            onChange={(v) => onChange({ status: v })}
          />
        </div>

        <div>
          <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
            Sector
          </p>
          <FilterPill
            options={SECTOR_OPTIONS}
            value={filters.sector}
            onChange={(v) => onChange({ sector: v })}
          />
        </div>

        <div>
          <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
            Bucket
          </p>
          <FilterPill
            options={BUCKET_OPTIONS}
            value={filters.bucket}
            onChange={(v) => onChange({ bucket: v })}
          />
        </div>
      </div>
    </div>
  );
}
