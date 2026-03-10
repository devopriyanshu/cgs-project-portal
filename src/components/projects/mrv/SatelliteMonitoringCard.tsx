// src/components/projects/mrv/SatelliteMonitoringCard.tsx
import { useState } from 'react';
import { Satellite, RefreshCw } from 'lucide-react';
import {
  useSatelliteStatus,
  useRequestSatelliteAnalysis,
} from '@/hooks/mrv/useMrv';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils/cn';

interface Props {
  projectId: string;
  mrvId: string;
}

const STATUS_CONFIG = {
  NOT_STARTED: { label: 'Not Started', variant: 'default' as const, pulsing: false },
  PROCESSING: { label: 'Processing…', variant: 'info' as const, pulsing: true },
  COMPLETED: { label: 'Completed', variant: 'success' as const, pulsing: false },
  FAILED: { label: 'Failed', variant: 'error' as const, pulsing: false },
};

export function SatelliteMonitoringCard({ projectId, mrvId }: Props) {
  const [processing, setProcessing] = useState(false);
  const requestAnalysis = useRequestSatelliteAnalysis(projectId, mrvId);
  const { data: statusData } = useSatelliteStatus(projectId, mrvId, processing);

  const status = statusData?.status ?? 'NOT_STARTED';
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.NOT_STARTED;

  const handleRequest = () => {
    setProcessing(true);
    requestAnalysis.mutate(undefined, {
      onError: () => setProcessing(false),
    });
  };

  return (
    <div className="rounded-xl border border-gray-100 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <Satellite size={16} />
          </div>
          <div>
            <p className="text-sm font-semibold text-cgs-forest">Satellite Monitoring</p>
            <p className="text-xs text-gray-400">NDVI analysis, burn detection, tillage signatures</p>
          </div>
        </div>
        <Badge variant={config.variant}>
          <span className={cn('inline-block h-1.5 w-1.5 rounded-full mr-1 bg-current', config.pulsing && 'animate-pulse')} />
          {config.label}
        </Badge>
      </div>

      {status === 'NOT_STARTED' || status === 'FAILED' ? (
        <Button
          size="sm"
          variant="secondary"
          onClick={handleRequest}
          loading={requestAnalysis.isPending}
        >
          <RefreshCw size={14} />
          {status === 'FAILED' ? 'Retry Analysis' : 'Request Satellite Analysis'}
        </Button>
      ) : status === 'PROCESSING' ? (
        <div className="flex items-center gap-2 text-sm text-blue-600">
          <RefreshCw size={14} className="animate-spin" />
          Analysis in progress. Polling every 15 seconds…
        </div>
      ) : (
        <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
          ✓ Analysis complete. Download the MRV package to view NDVI charts and burn detection results.
        </div>
      )}
    </div>
  );
}
