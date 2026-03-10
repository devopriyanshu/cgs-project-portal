// src/components/projects/ProjectTimeline.tsx
import { CheckCircle2, Circle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { ProjectStatus } from '@/types/project.types';
import type { Project } from '@/types/project.types';

const LIFECYCLE_NODES = [
  { key: 'DRAFT',     label: 'Registration',  statuses: [ProjectStatus.DRAFT] },
  { key: 'SCREENING', label: 'Pre-Screen',     statuses: [ProjectStatus.SUBMITTED, ProjectStatus.PRE_SCREENING] },
  { key: 'ELIGIBLE',  label: 'Eligibility',    statuses: [ProjectStatus.ELIGIBLE, ProjectStatus.INELIGIBLE] },
  { key: 'MRV',       label: 'MRV',            statuses: [ProjectStatus.MRV_ACTIVE] },
  { key: 'VVB',       label: 'VVB',            statuses: [ProjectStatus.VVB_SUBMITTED] },
  { key: 'REGISTRY',  label: 'Registry',       statuses: [ProjectStatus.REGISTRY_PENDING] },
  { key: 'ACTIVE',    label: 'Listed',         statuses: [ProjectStatus.ACTIVE, ProjectStatus.COMPLETED] },
];

const STATUS_ORDER: ProjectStatus[] = [ProjectStatus.DRAFT, ProjectStatus.SUBMITTED, ProjectStatus.PRE_SCREENING, ProjectStatus.ELIGIBLE, ProjectStatus.MRV_ACTIVE, ProjectStatus.VVB_SUBMITTED, ProjectStatus.REGISTRY_PENDING, ProjectStatus.ACTIVE, ProjectStatus.COMPLETED];

interface Props {
  project: Project;
}

export function ProjectTimeline({ project }: Props) {
  const currentIdx = STATUS_ORDER.indexOf(project.status);

  return (
    <div className="overflow-x-auto">
      <div className="flex items-center gap-0 py-4 min-w-max px-2">
        {LIFECYCLE_NODES.map((node, i) => {
          const nodeStatusIdx = node.statuses.length > 0
            ? Math.max(...node.statuses.map((s) => STATUS_ORDER.indexOf(s)))
            : i;
          const isCompleted = currentIdx > nodeStatusIdx;
          const isActive = node.statuses.includes(project.status);
          const isPending = !isCompleted && !isActive;

          return (
            <div key={node.key} className="flex items-center">
              {/* Node */}
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all',
                    isCompleted && 'border-cgs-sage bg-cgs-sage text-white',
                    isActive && 'border-cgs-sage bg-white text-cgs-sage shadow-md ring-4 ring-cgs-sage/20',
                    isPending && 'border-gray-200 bg-white text-gray-300'
                  )}
                >
                  {isCompleted ? (
                    <CheckCircle2 size={16} />
                  ) : isActive ? (
                    <Clock size={14} className="animate-pulse" />
                  ) : (
                    <Circle size={14} />
                  )}
                </div>
                <span
                  className={cn(
                    'text-[11px] font-medium whitespace-nowrap',
                    isCompleted && 'text-cgs-sage',
                    isActive && 'text-cgs-forest font-semibold',
                    isPending && 'text-gray-400'
                  )}
                >
                  {node.label}
                </span>
              </div>

              {/* Connector */}
              {i < LIFECYCLE_NODES.length - 1 && (
                <div
                  className={cn(
                    'mx-1 mt-[-18px] h-0.5 w-12',
                    isCompleted ? 'bg-cgs-sage' : 'bg-gray-200'
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
