// src/components/projects/mrv/MrvKanban.tsx
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useMrvRecords, useCreateMrvRecord } from '@/hooks/mrv/useMrv';
import { MrvStatus } from '@/types/mrv.types';
import type { MrvRecord } from '@/types/mrv.types';
import { MrvKanbanColumn } from './MrvKanbanColumn';
import { SatelliteMonitoringCard } from './SatelliteMonitoringCard';
import { SoilSampleTable } from './SoilSampleTable';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';

const COLUMNS: { status: MrvStatus; label: string }[] = [
  { status: MrvStatus.DATA_COLLECTION, label: 'Data Collection' },
  { status: MrvStatus.MONITORING_ACTIVE, label: 'Monitoring Active' },
  { status: MrvStatus.REPORT_COMPILED, label: 'Report Compiled' },
  { status: MrvStatus.VVB_SUBMITTED, label: 'VVB Submitted' },
  { status: MrvStatus.VVB_UNDER_REVIEW, label: 'VVB Under Review' },
  { status: MrvStatus.REGISTRY_PENDING, label: 'Registry Pending' },
  { status: MrvStatus.VERIFIED, label: 'Verified' },
];

interface Props {
  projectId: string;
  sector?: string;
}

export function MrvKanban({ projectId, sector }: Props) {
  const { data: records, isLoading } = useMrvRecords(projectId);
  const createMrv = useCreateMrvRecord(projectId);
  const [selected, setSelected] = useState<MrvRecord | null>(null);

  if (isLoading) {
    return (
      <div className="flex gap-3 overflow-x-auto pb-4">
        {COLUMNS.map((col) => (
          <div key={col.status} className="min-w-44 rounded-xl border border-gray-100 bg-gray-50 p-3">
            <Skeleton className="mb-3 h-3 w-28" />
            <Skeleton className="h-14 rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  const grouped = COLUMNS.reduce<Record<MrvStatus, MrvRecord[]>>(
    (acc, col) => {
      acc[col.status] = records?.filter((r) => r.status === col.status) ?? [];
      return acc;
    },
    {} as Record<MrvStatus, MrvRecord[]>
  );

  const handleNewPeriod = () => {
    const year = new Date().getFullYear();
    const month = new Date().getMonth() < 6 ? 'Kharif' : 'Rabi';
    createMrv.mutate({
      period: `${month} ${year}`,
      startDate: new Date().toISOString(),
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <h3 className="font-semibold text-cgs-forest">MRV Periods</h3>
        <Button size="sm" variant="secondary" onClick={handleNewPeriod} loading={createMrv.isPending}>
          <Plus size={14} /> New Monitoring Period
        </Button>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-3">
        {COLUMNS.map((col) => (
          <MrvKanbanColumn
            key={col.status}
            title={col.label}
            records={grouped[col.status]}
            isActive={selected?.status === col.status}
            onSelect={setSelected}
            selected={selected?.id}
          />
        ))}
      </div>

      {selected && (
        <div className="flex flex-col gap-6 rounded-xl border border-cgs-mist/50 bg-white p-6">
          <h4 className="font-display text-lg font-semibold italic text-cgs-forest">
            {selected.period}
          </h4>
          {sector === 'AGRICULTURE' && (
            <SatelliteMonitoringCard projectId={projectId} mrvId={selected.id} />
          )}
          <SoilSampleTable mrvId={selected.id} />
        </div>
      )}
    </div>
  );
}
