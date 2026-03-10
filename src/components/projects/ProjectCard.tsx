// src/components/projects/ProjectCard.tsx
import { Link } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { MapPin, Leaf, ArrowRight } from 'lucide-react';
import { ProjectStatusBadge } from './ProjectStatusBadge';
import { cn } from '@/lib/utils/cn';
import { formatCO2 } from '@/lib/utils/format';
import { ROUTES } from '@/lib/constants/routes';
import type { Project } from '@/types/project.types';

const SECTOR_COLORS: Record<string, string> = {
  AGRICULTURE: 'from-emerald-500/20 to-green-400/10',
  RENEWABLE_ENERGY: 'from-yellow-500/20 to-amber-400/10',
  WASTE_MANAGEMENT: 'from-orange-500/20 to-red-400/10',
  INDUSTRIAL: 'from-slate-500/20 to-gray-400/10',
  NATURE_BASED: 'from-teal-500/20 to-green-400/10',
  GREEN_BUILDINGS: 'from-blue-500/20 to-sky-400/10',
};

const SECTOR_ICONS: Record<string, string> = {
  AGRICULTURE: '🌾',
  RENEWABLE_ENERGY: '☀️',
  WASTE_MANAGEMENT: '♻️',
  INDUSTRIAL: '🏭',
  NATURE_BASED: '🌳',
  GREEN_BUILDINGS: '🏢',
};

interface Props {
  project: Project;
}

export function ProjectCard({ project }: Props) {
  const sectorGradient = SECTOR_COLORS[project.sector] ?? 'from-gray-500/20 to-gray-400/10';
  const sectorIcon = SECTOR_ICONS[project.sector] ?? '📋';

  return (
    <motion.div
      whileHover={{ y: -2, boxShadow: '0 8px 25px -5px rgba(0,0,0,0.1)' }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      <Link to={ROUTES.PROJECTS.DETAIL(project.id)} className="block">
        <div className="overflow-hidden rounded-xl border border-cgs-mist/50 bg-white shadow-sm transition-shadow hover:shadow-md">
          {/* Banner */}
          <div className={cn('flex h-24 items-center justify-between bg-gradient-to-br px-5', sectorGradient)}>
            <span className="text-4xl">{sectorIcon}</span>
            {project.bucket && (
              <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-bold text-cgs-forest">
                Bucket {project.bucket}
              </span>
            )}
          </div>

          {/* Content */}
          <div className="p-4">
            <div className="mb-2 flex items-start justify-between gap-2">
              <h3 className="font-display text-base font-semibold italic text-cgs-forest leading-snug">
                {project.name ?? `${project.sector.replace('_', ' ')} Project`}
              </h3>
              <ProjectStatusBadge status={project.status} />
            </div>

            {(project.state || project.district) && (
              <p className="mb-3 flex items-center gap-1 text-xs text-gray-500">
                <MapPin size={12} />
                {[project.district, project.state].filter(Boolean).join(', ')}
              </p>
            )}

            {project.estimatedAnnualCo2 && (
              <p className="flex items-center gap-1 text-xs text-cgs-moss">
                <Leaf size={12} />
                ~{formatCO2(project.estimatedAnnualCo2)} / year
              </p>
            )}

            <div className="mt-4 flex items-center justify-end">
              <span className="flex items-center gap-1 text-xs font-medium text-cgs-sage">
                View project <ArrowRight size={12} />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
export function ProjectCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-100 bg-white">
      <div className="h-24 animate-pulse bg-gray-100" />
      <div className="p-4">
        <div className="mb-3 flex justify-between">
          <div className="h-4 w-40 animate-pulse rounded bg-gray-200" />
          <div className="h-5 w-16 animate-pulse rounded-full bg-gray-200" />
        </div>
        <div className="mb-2 h-3 w-28 animate-pulse rounded bg-gray-100" />
        <div className="h-3 w-20 animate-pulse rounded bg-gray-100" />
      </div>
    </div>
  );
}
