// src/pages/portal/DashboardPage.tsx
import { motion } from 'framer-motion';
import { Link } from '@tanstack/react-router';
import {
  FolderOpen, Leaf, TrendingUp, AlertCircle, Plus, ExternalLink, Download, Activity, FlaskConical
} from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { useProjects } from '@/hooks/projects/useProjects';
import { useNotifications } from '@/hooks/notifications/useNotifications';
import { useFpoStats } from '@/hooks/fpo/useFpo';
import { UserRole } from '@/types/auth.types';
import { ProjectStatus } from '@/types/project.types';
import { ROUTES, EXTERNAL_URLS } from '@/lib/constants/routes';
import { formatINR, formatRelativeTime } from '@/lib/utils/format';
import { ProjectStatusBadge } from '@/components/projects/ProjectStatusBadge';
import { cn } from '@/lib/utils/cn';

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-cgs-mist/40"
    >
      <div className={cn('mb-3 inline-flex rounded-lg p-2', color)}>
        <Icon size={20} className="text-white" />
      </div>
      <p className="text-2xl font-bold text-cgs-charcoal">{value}</p>
      <p className="mt-1 text-sm text-gray-500">{label}</p>
    </motion.div>
  );
}

function StatCardSkeleton() {
  return (
    <div className="rounded-xl bg-white p-5 shadow-sm">
      <div className="mb-3 h-9 w-9 animate-pulse rounded-lg bg-gray-200" />
      <div className="h-7 w-20 animate-pulse rounded bg-gray-200" />
      <div className="mt-1 h-4 w-28 animate-pulse rounded bg-gray-100" />
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { data: projects, isLoading: projectsLoading } = useProjects({ limit: 5 });
  const { data: notifications } = useNotifications();
  const { data: fpoStats } = useFpoStats();

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const isFpo = user?.role === UserRole.FPO_OFFICER;

  const activeProjects = projects?.data?.filter(p =>
    [ProjectStatus.MRV_IN_PROGRESS, ProjectStatus.ACTIVE, ProjectStatus.ELIGIBLE].includes(p.status)
  ).length ?? 0;

  // ── Temporary hardcoded MRV data (Phase 2 — Python FastAPI, not yet live) ──
  const MOCK_MRV_STATE = {
    monitoringCycle: 'Kharif 2024',
    satelliteRunDate: '15 Feb 2025',
    ndviScore: 0.72,
    soilCarbonEstimate: '4.2 tCO₂e/ha',
    verificationStatus: 'PENDING_VVB',
    estimatedCredits: 1240,
    lastUpdated: '2 Mar 2025',
  };


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold italic text-cgs-forest">
            {greeting}, {user?.firstName ?? 'there'} 👋
          </h1>
          <p className="mt-1 text-sm text-gray-500">{user?.orgName}</p>
        </div>
        <Link
          to={ROUTES.PROJECTS.NEW}
          className="flex items-center gap-2 rounded-lg bg-cgs-sage px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-cgs-moss"
        >
          <Plus size={16} />
          New Project
        </Link>
      </div>

      {/* KYC alert */}
      {user?.kycStatus && user.kycStatus !== 'APPROVED' && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3"
        >
          <AlertCircle size={18} className="shrink-0 text-amber-600" />
          <p className="text-sm text-amber-800">
            <strong>Complete your KYC</strong> to list credits and receive payments.{' '}
            <Link to={ROUTES.SETTINGS.KYC} className="font-medium underline">
              Complete KYC →
            </Link>
          </p>
        </motion.div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {projectsLoading ? (
          Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
        ) : isFpo ? (
          <>
            <StatCard icon={FolderOpen} label="Total Farmers" value={fpoStats?.totalFarmers ?? 0} color="bg-cgs-sage" />
            <StatCard icon={Leaf} label="Total Acres" value={fpoStats?.totalAcres?.toLocaleString('en-IN') ?? 0} color="bg-cgs-moss" />
            <StatCard icon={TrendingUp} label="Credits Generated" value={fpoStats?.totalCreditsGenerated ?? 0} color="bg-cgs-earth" />
            <StatCard icon={TrendingUp} label="Payouts Distributed" value={formatINR(fpoStats?.totalPayoutsDistributed ?? 0)} color="bg-cgs-gold/80" />
          </>
        ) : (
          <>
            <StatCard icon={FolderOpen} label="Active Projects" value={activeProjects} color="bg-cgs-sage" />
            <StatCard icon={Leaf} label="Credits Issued" value={projects?.data?.reduce((a, p) => a + (p.totalCreditsIssued ?? 0), 0) ?? 0} color="bg-cgs-moss" />
            <StatCard icon={TrendingUp} label="Revenue (INR)" value={formatINR(projects?.data?.reduce((a, p) => a + (p.revenueEarned ?? 0), 0) ?? 0)} color="bg-cgs-earth" />
            <StatCard icon={AlertCircle} label="Pending Actions" value={notifications?.data?.filter(n => !n.isRead).length ?? 0} color="bg-cgs-gold/80" />
          </>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent projects */}
        <div className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-cgs-forest">Recent Projects</h2>
            <Link to={ROUTES.PROJECTS.LIST} className="text-sm text-cgs-sage hover:underline">
              View all →
            </Link>
          </div>
          {projectsLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-14 animate-pulse rounded-lg bg-gray-100" />
              ))}
            </div>
          ) : projects?.data?.length === 0 ? (
            <div className="flex flex-col items-center py-12 text-center">
              <span className="mb-3 text-5xl">🌱</span>
              <p className="font-medium text-cgs-forest">No projects yet</p>
              <p className="mt-1 text-sm text-gray-500">Start by registering your first project</p>
              <Link
                to={ROUTES.PROJECTS.NEW}
                className="mt-4 rounded-lg bg-cgs-sage px-4 py-2 text-sm font-medium text-white hover:bg-cgs-moss"
              >
                Register Project →
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 rounded-xl bg-white shadow-sm ring-1 ring-cgs-mist/40">
              {projects?.data?.map((project) => (
                <Link
                  key={project.id}
                  to={ROUTES.PROJECTS.DETAIL(project.id)}
                  className="flex items-center justify-between px-4 py-3 hover:bg-gray-50"
                >
                  <div>
                    <p className="font-medium text-cgs-charcoal">
                      {project.name ?? `${project.sector.replace('_', ' ')} Project`}
                    </p>
                    <p className="text-xs text-gray-400">
                      {[project.district, project.state].filter(Boolean).join(', ')}
                    </p>
                  </div>
                  <ProjectStatusBadge status={project.status} />
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Quick actions + recent notifications */}
        <div className="space-y-6">
          {/* Quick actions */}
          <div>
            <h2 className="mb-4 font-semibold text-cgs-forest">Quick Actions</h2>
            <div className="space-y-2">
              <Link
                to={ROUTES.PROJECTS.NEW}
                className="flex items-center gap-3 rounded-lg bg-white px-4 py-3 text-sm font-medium text-cgs-forest shadow-sm ring-1 ring-cgs-mist/40 hover:bg-cgs-mist/20"
              >
                <Plus size={16} className="text-cgs-sage" />
                + Register New Project
              </Link>
              <a
                href={EXTERNAL_URLS.MARKETPLACE}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-lg bg-white px-4 py-3 text-sm font-medium text-cgs-forest shadow-sm ring-1 ring-cgs-mist/40 hover:bg-cgs-mist/20"
              >
                <ExternalLink size={16} className="text-cgs-sage" />
                Browse Marketplace ↗
              </a>
              <button className="flex w-full items-center gap-3 rounded-lg bg-white px-4 py-3 text-sm font-medium text-cgs-forest shadow-sm ring-1 ring-cgs-mist/40 hover:bg-cgs-mist/20">
                <Download size={16} className="text-cgs-sage" />
                Download BRSR Report
              </button>
            </div>
          </div>

          {/* MRV Status — temporary hardcoded preview (Phase 2 Python, not yet live) */}
          {!isFpo && (
            <div>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-semibold text-cgs-forest">MRV Status</h2>
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700">
                  Preview
                </span>
              </div>
              <div className="rounded-xl border border-dashed border-cgs-earth/40 bg-amber-50/40 p-4 space-y-3">
                <div className="flex items-center gap-2 mb-1">
                  <FlaskConical size={15} className="text-cgs-earth" />
                  <p className="text-xs font-semibold text-cgs-forest">{MOCK_MRV_STATE.monitoringCycle}</p>
                  <span className="ml-auto rounded-full bg-yellow-100 px-2 py-0.5 text-[10px] font-medium text-yellow-700">
                    {MOCK_MRV_STATE.verificationStatus.replace('_', ' ')}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-lg bg-white px-3 py-2 shadow-sm ring-1 ring-gray-100">
                    <p className="text-[10px] uppercase tracking-wide text-gray-400">NDVI Score</p>
                    <p className="mt-0.5 text-lg font-bold text-cgs-moss">{MOCK_MRV_STATE.ndviScore}</p>
                  </div>
                  <div className="rounded-lg bg-white px-3 py-2 shadow-sm ring-1 ring-gray-100">
                    <p className="text-[10px] uppercase tracking-wide text-gray-400">Est. Credits</p>
                    <p className="mt-0.5 text-lg font-bold text-cgs-earth">{MOCK_MRV_STATE.estimatedCredits.toLocaleString('en-IN')}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[11px] text-gray-500">
                  <span>Soil carbon: {MOCK_MRV_STATE.soilCarbonEstimate}</span>
                  <span className="flex items-center gap-1">
                    <Activity size={10} />
                    Satellite: {MOCK_MRV_STATE.satelliteRunDate}
                  </span>
                </div>
                <p className="text-center text-[10px] text-gray-400 border-t border-gray-100 pt-2">
                  🛰️ Live MRV via satellite analysis — launching Q3 2025
                </p>
              </div>
            </div>
          )}

          {/* Recent notifications */}
          <div>
            <h2 className="mb-4 font-semibold text-cgs-forest">Recent Notifications</h2>
            <div className="space-y-2">
              {notifications?.data?.slice(0, 4).map((n) => (
                <div
                  key={n.id}
                  className={cn(
                    'rounded-lg px-3 py-2.5 text-sm',
                    !n.isRead ? 'bg-cgs-sage/5 ring-1 ring-cgs-sage/20' : 'bg-white ring-1 ring-gray-100'
                  )}
                >
                  <p className={cn('leading-snug', !n.isRead && 'font-medium text-cgs-forest')}>
                    {n.title}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-400">{formatRelativeTime(n.createdAt)}</p>
                </div>
              ))}
              {!notifications?.data?.length && (
                <p className="text-sm text-gray-400">You're all caught up! ✓</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
