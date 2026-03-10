// src/components/projects/ProjectStatusBadge.tsx
import { cn } from '@/lib/utils/cn';
import { ProjectStatus } from '@/types/project.types';

const STATUS_CONFIG: Record<ProjectStatus, { label: string; className: string }> = {
  [ProjectStatus.DRAFT]:          { label: 'Draft',           className: 'bg-gray-100 text-gray-600' },
  [ProjectStatus.SUBMITTED]:      { label: 'Submitted',       className: 'bg-blue-100 text-blue-700' },
  [ProjectStatus.PRE_SCREENING]:  { label: 'Screening',       className: 'bg-amber-100 text-amber-700' },
  [ProjectStatus.ELIGIBLE]:       { label: 'Eligible',        className: 'bg-green-100 text-green-700' },
  [ProjectStatus.INELIGIBLE]:     { label: 'Ineligible',      className: 'bg-red-100 text-red-700' },
  [ProjectStatus.MRV_ACTIVE]:     { label: 'MRV Active',      className: 'bg-purple-100 text-purple-700' },
  [ProjectStatus.VVB_SUBMITTED]:  { label: 'VVB Submitted',   className: 'bg-indigo-100 text-indigo-700' },
  [ProjectStatus.REGISTRY_PENDING]:{ label: 'Registry Pending', className: 'bg-orange-100 text-orange-700' },
  [ProjectStatus.ACTIVE]:         { label: 'Active',          className: 'bg-emerald-100 text-emerald-700' },
  [ProjectStatus.COMPLETED]:      { label: 'Completed',       className: 'bg-cgs-forest/10 text-cgs-forest' },
  [ProjectStatus.SUSPENDED]:      { label: 'Suspended',       className: 'bg-gray-100 text-gray-500' },
};

interface Props {
  status: ProjectStatus;
  className?: string;
}

export function ProjectStatusBadge({ status, className }: Props) {
  const config = STATUS_CONFIG[status] ?? { label: status, className: 'bg-gray-100 text-gray-600' };
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
