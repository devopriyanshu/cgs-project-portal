// src/pages/portal/ProjectDetailPage.tsx
import { useParams } from '@tanstack/react-router';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Activity, Leaf, Settings, Edit, Loader2 } from 'lucide-react';
import { useProject, useProjectDocuments } from '@/hooks/projects/useProjects';
import { useMrvRecords } from '@/hooks/mrv/useMrv';
import { useCredits } from '@/hooks/credits/useCredits';
import { ProjectStatusBadge } from '@/components/projects/ProjectStatusBadge';
import { PageHeader } from '@/components/layout/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { FileUpload } from '@/components/ui/FileUpload';
import { ROUTES } from '@/lib/constants/routes';
import { formatINR, formatNumber, formatDate } from '@/lib/utils/format';
import { ProjectSector } from '@/types/project.types';
import { MrvStatus } from '@/types/mrv.types';
import { cn } from '@/lib/utils/cn';
import { Link } from '@tanstack/react-router';

type Tab = 'overview' | 'documents' | 'mrv' | 'credits' | 'settings';

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'overview', label: 'Overview', icon: Activity },
  { id: 'documents', label: 'Documents', icon: FileText },
  { id: 'mrv', label: 'MRV', icon: Activity },
  { id: 'credits', label: 'Credits', icon: Leaf },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const LIFECYCLE_NODES = [
  'Registration', 'Pre-Screen', 'Eligibility', 'MRV', 'VVB', 'Registry', 'Listed'
];

export default function ProjectDetailPage() {
  const { projectId } = useParams({ strict: false }) as { projectId: string };
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  const { data: project, isLoading: projectLoading } = useProject(projectId);
  const { data: documents } = useProjectDocuments(projectId);
  const { data: mrvRecords } = useMrvRecords(projectId);
  const { data: credits } = useCredits({ projectId });

  if (projectLoading) {
    return (
      <div className="space-y-6">
        <div className="h-48 animate-pulse rounded-xl bg-gray-100" />
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl bg-gray-100" />
          ))}
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <EmptyState
        emoji="🔍"
        title="Project not found"
        description="We couldn't find this project. It may have been removed or you don't have access."
        action={
          <Link to={ROUTES.PROJECTS.LIST} className="rounded-lg bg-cgs-sage px-4 py-2 text-sm font-semibold text-white hover:bg-cgs-moss">
            Back to Projects
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={project.name ?? `${project.sector.replace(/_/g, ' ')} Project`}
        breadcrumbs={[
          { label: 'Projects', to: ROUTES.PROJECTS.LIST },
          { label: project.name ?? 'Project' },
        ]}
        actions={
          <button className="flex items-center gap-2 rounded-lg border border-cgs-mist bg-white px-4 py-2 text-sm font-medium text-cgs-forest hover:bg-cgs-mist/30">
            <Edit size={15} /> Edit Project
          </button>
        }
      />

      {/* Project header card */}
      <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-cgs-mist/40">
        <div className="flex flex-wrap items-start gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <ProjectStatusBadge status={project.status} />
              {project.sector && (
                <span className="rounded-full bg-cgs-mist/50 px-2.5 py-0.5 text-xs font-medium text-cgs-moss">
                  {project.sector.replace(/_/g, ' ')}
                </span>
              )}
              {project.bucket && (
                <span className="rounded-full bg-cgs-gold/20 px-2.5 py-0.5 text-xs font-semibold text-cgs-earth">
                  Bucket {project.bucket}
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-6 text-sm text-gray-500">
              {project.state && <span>📍 {[project.district, project.state].filter(Boolean).join(', ')}</span>}
              {project.estimatedAnnualCo2 && (
                <span>🌿 {formatNumber(project.estimatedAnnualCo2)} t CO₂/yr</span>
              )}
              {project.registryStandard && (
                <span>📋 {project.registryStandard.replace(/_/g, ' ')}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: 'Credits Issued', value: formatNumber(project.totalCreditsIssued ?? 0) },
          { label: 'Credits Listed', value: formatNumber(project.creditsListed ?? 0) },
          { label: 'Revenue (INR)', value: formatINR(project.revenueEarned ?? 0) },
          { label: 'FPO Farmers', value: project.sector === ProjectSector.AGRICULTURE ? formatNumber(project.farmersEnrolled ?? 0) : 'N/A' },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-cgs-mist/40">
            <p className="text-xl font-bold text-cgs-charcoal">{value}</p>
            <p className="mt-1 text-sm text-gray-500">{label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="border-b border-cgs-mist">
        <div className="flex overflow-x-auto">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={cn(
                'flex items-center gap-1.5 whitespace-nowrap px-4 py-2.5 text-sm font-medium transition border-b-2 -mb-px',
                id === activeTab
                  ? 'border-cgs-sage text-cgs-sage'
                  : 'border-transparent text-gray-500 hover:text-cgs-forest'
              )}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Project Lifecycle Timeline */}
            <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-cgs-mist/40">
              <h3 className="mb-6 font-semibold text-cgs-forest">Project Lifecycle</h3>
              <div className="relative flex items-center justify-between">
                <div className="absolute left-0 right-0 h-0.5 bg-cgs-mist" />
                {LIFECYCLE_NODES.map((node, i) => {
                  const isCompleted = i < 2;  // TODO: derive from project status
                  const isActive = i === 2;
                  return (
                    <div key={node} className="relative flex flex-col items-center gap-2 z-10">
                      <div className={cn(
                        'flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold',
                        isCompleted ? 'border-cgs-sage bg-cgs-sage text-white' :
                        isActive ? 'border-cgs-sage bg-white text-cgs-sage ring-4 ring-cgs-sage/20 animate-pulse-slow' :
                        'border-gray-200 bg-white text-gray-400'
                      )}>
                        {isCompleted ? '✓' : i + 1}
                      </div>
                      <span className="hidden text-center text-xs font-medium text-gray-500 xl:block whitespace-nowrap">
                        {node}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* MRV Summary */}
            {mrvRecords && mrvRecords.length > 0 && (
              <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-cgs-mist/40">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-cgs-forest">MRV Records</h3>
                  <button onClick={() => setActiveTab('mrv')} className="text-sm text-cgs-sage hover:underline">
                    View all →
                  </button>
                </div>
                {mrvRecords.slice(0, 2).map((mrv) => (
                  <div key={mrv.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <span className="text-sm font-medium">{mrv.period}</span>
                    <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium',
                      mrv.status === MrvStatus.VERIFIED ? 'bg-green-100 text-green-700' :
                      mrv.status === MrvStatus.VVB_SUBMITTED ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-600'
                    )}>
                      {mrv.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* DOCUMENTS TAB */}
        {activeTab === 'documents' && (
          <div className="space-y-6">
            <FileUpload
              projectId={projectId}
              label="Upload Project Documents"
            />
            {documents && documents.length > 0 ? (
              <div className="rounded-xl bg-white shadow-sm ring-1 ring-cgs-mist/40 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-cgs-cream/60">
                      <th className="px-4 py-3 text-left font-medium text-cgs-forest">Document</th>
                      <th className="px-4 py-3 text-left font-medium text-cgs-forest">Type</th>
                      <th className="px-4 py-3 text-left font-medium text-cgs-forest">Date</th>
                      <th className="px-4 py-3 text-right font-medium text-cgs-forest">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {documents.map((doc: any) => (
                      <tr key={doc.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-cgs-charcoal">{doc.fileName}</td>
                        <td className="px-4 py-3 text-gray-500">{doc.documentType?.replace(/_/g, ' ')}</td>
                        <td className="px-4 py-3 text-gray-500">{formatDate(doc.createdAt)}</td>
                        <td className="px-4 py-3 text-right">
                          <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer"
                            className="text-cgs-sage hover:underline">Download</a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState preset="documents" />
            )}
          </div>
        )}

        {/* MRV TAB */}
        {activeTab === 'mrv' && (
          <div className="space-y-4">
            {mrvRecords && mrvRecords.length > 0 ? (
              mrvRecords.map((mrv) => (
                <div key={mrv.id} className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-cgs-mist/40">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-cgs-forest">{mrv.period}</h4>
                    <span className="text-sm text-gray-500">{mrv.status.replace(/_/g, ' ')}</span>
                  </div>
                  {mrv.estimatedIssuanceDate && (
                    <p className="text-sm text-gray-500">
                      Estimated issuance: <span className="font-medium">{formatDate(mrv.estimatedIssuanceDate)}</span>
                    </p>
                  )}
                </div>
              ))
            ) : (
              <EmptyState
                emoji="📊"
                title="No monitoring periods yet"
                description="Create your first MRV monitoring period to begin the verification process"
              />
            )}
          </div>
        )}

        {/* CREDITS TAB */}
        {activeTab === 'credits' && (
          <div>
            {credits?.data && credits.data.length > 0 ? (
              <div className="rounded-xl bg-white shadow-sm ring-1 ring-cgs-mist/40 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-cgs-cream/60">
                      <th className="px-4 py-3 text-left font-medium text-cgs-forest">Serial Number</th>
                      <th className="px-4 py-3 text-left font-medium text-cgs-forest">Vintage</th>
                      <th className="px-4 py-3 text-left font-medium text-cgs-forest">Quantity</th>
                      <th className="px-4 py-3 text-left font-medium text-cgs-forest">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {credits.data.map((credit) => (
                      <tr key={credit.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-mono-cgs text-xs text-cgs-charcoal">{credit.serialNumber}</td>
                        <td className="px-4 py-3">{credit.vintageYear}</td>
                        <td className="px-4 py-3">{formatNumber(credit.quantity)}</td>
                        <td className="px-4 py-3">
                          <span className="rounded-full bg-cgs-sage/10 px-2 py-0.5 text-xs font-medium text-cgs-moss">
                            {credit.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState preset="credits" />
            )}
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-cgs-mist/40">
            <p className="text-sm text-gray-500">Project settings — edit name, story, SDL goals, and buffer pool.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
