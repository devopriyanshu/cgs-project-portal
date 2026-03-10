// src/pages/portal/ProjectsListPage.tsx
import { useState } from 'react';
import { Link, useSearch, useNavigate } from '@tanstack/react-router';
import { Plus, Search, SlidersHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';
import { useProjects } from '@/hooks/projects/useProjects';
import { ProjectCard, ProjectCardSkeleton } from '@/components/projects/ProjectCard';
import { ProjectStatus, ProjectSector, ProjectBucket } from '@/types/project.types';
import { ROUTES } from '@/lib/constants/routes';

const STATUS_OPTIONS = Object.values(ProjectStatus);
const SECTOR_OPTIONS = Object.values(ProjectSector);
const BUCKET_OPTIONS = Object.values(ProjectBucket);

export default function ProjectsListPage() {
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<ProjectStatus | ''>('');
  const [selectedSector, setSelectedSector] = useState<ProjectSector | ''>('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useProjects({
    page,
    limit: 9,
    search: search || undefined,
    status: (selectedStatus as ProjectStatus) || undefined,
    sector: (selectedSector as ProjectSector) || undefined,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold italic text-cgs-forest">My Projects</h1>
          <p className="mt-1 text-sm text-gray-500">
            {data?.meta?.total ?? 0} project{(data?.meta?.total ?? 0) !== 1 ? 's' : ''} registered
          </p>
        </div>
        <Link
          to={ROUTES.PROJECTS.NEW}
          className="flex items-center gap-2 rounded-lg bg-cgs-sage px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-cgs-moss"
        >
          <Plus size={16} />
          New Project
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search projects..."
            className="w-full rounded-lg border border-cgs-mist bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-cgs-sage focus:ring-2 focus:ring-cgs-sage/20"
          />
        </div>
        <select
          value={selectedStatus}
          onChange={(e) => { setSelectedStatus(e.target.value as ProjectStatus | ''); setPage(1); }}
          className="rounded-lg border border-cgs-mist bg-white px-3 py-2 text-sm outline-none focus:border-cgs-sage"
        >
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
          ))}
        </select>
        <select
          value={selectedSector}
          onChange={(e) => { setSelectedSector(e.target.value as ProjectSector | ''); setPage(1); }}
          className="rounded-lg border border-cgs-mist bg-white px-3 py-2 text-sm outline-none focus:border-cgs-sage"
        >
          <option value="">All Sectors</option>
          {SECTOR_OPTIONS.map((s) => (
            <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
          ))}
        </select>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <ProjectCardSkeleton key={i} />)}
        </div>
      ) : data?.data?.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-center">
          <span className="mb-4 text-6xl">🌱</span>
          <h3 className="font-display text-xl font-semibold italic text-cgs-forest">
            No projects found
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            {search || selectedStatus || selectedSector
              ? 'Try adjusting your filters'
              : 'Start by registering your first carbon project'}
          </p>
          {!search && !selectedStatus && !selectedSector && (
            <Link
              to={ROUTES.PROJECTS.NEW}
              className="mt-5 rounded-lg bg-cgs-sage px-5 py-2.5 text-sm font-semibold text-white hover:bg-cgs-moss"
            >
              Register First Project →
            </Link>
          )}
        </div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {data?.data?.map((project) => (
            <motion.div key={project.id} layout>
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Pagination */}
      {data?.meta && data.meta.totalPages > 1 && (
        <div className="flex items-center justify-between pt-4">
          <p className="text-sm text-gray-500">
            Showing {((page - 1) * 9) + 1}–{Math.min(page * 9, data.meta.total)} of {data.meta.total}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(page - 1)}
              disabled={!data.meta.hasPrevPage}
              className="rounded-lg border border-cgs-mist px-3 py-1.5 text-sm hover:bg-gray-50 disabled:opacity-40"
            >
              ← Prev
            </button>
            <span className="text-sm font-medium">
              Page {data.meta.page} of {data.meta.totalPages}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={!data.meta.hasNextPage}
              className="rounded-lg border border-cgs-mist px-3 py-1.5 text-sm hover:bg-gray-50 disabled:opacity-40"
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
