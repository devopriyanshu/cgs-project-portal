// src/pages/portal/FpoPracticeLogPage.tsx
import { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { useFarmers } from '@/hooks/fpo/useFpo';
import { cn } from '@/lib/utils/cn';
import apiClient from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/constants/api-endpoints';
import { toast } from 'sonner';

const SEASONS = ['Kharif 2024', 'Rabi 2024–25', 'Kharif 2025'] as const;

interface PracticeEntry {
  farmerId: string;
  stubbleBurning: boolean;
  ureaReductionPercent: number;
  noTill: boolean;
}

export default function FpoPracticeLogPage() {
  const [season, setSeason] = useState<string>(SEASONS[0]);
  const [entries, setEntries] = useState<Record<string, PracticeEntry>>({});
  const [submitting, setSubmitting] = useState(false);
  const { data } = useFarmers({ limit: 100 });

  const updateEntry = (farmerId: string, patch: Partial<PracticeEntry>) => {
    setEntries(prev => {
      const defaults: PracticeEntry = { farmerId, stubbleBurning: false, ureaReductionPercent: 0, noTill: false };
      const existing = prev[farmerId] ?? defaults;
      return { ...prev, [farmerId]: { ...existing, ...patch, farmerId } };
    });
  };

  const handleSubmit = async () => {
    const payload = Object.values(entries).map(e => ({ ...e, season }));
    if (!payload.length) { toast.error('No practice changes recorded.'); return; }
    setSubmitting(true);
    try {
      await apiClient.post(API_ENDPOINTS.FPO.LOG_PRACTICE, payload);
      toast.success(`${payload.length} farmers' practice changes logged for ${season}`);
      setEntries({});
    } catch {
      toast.error('Failed to submit practice changes. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Practice Change Log"
        subtitle="Log seasonal farming practices for MRV verification"
        actions={
          <button
            onClick={handleSubmit}
            disabled={submitting || !Object.keys(entries).length}
            className="rounded-lg bg-cgs-sage px-4 py-2 text-sm font-semibold text-white hover:bg-cgs-moss disabled:opacity-50"
          >
            {submitting ? 'Submitting…' : `Submit Log (${Object.keys(entries).length})`}
          </button>
        }
      />

      {/* Season selector */}
      <div className="flex gap-2">
        {SEASONS.map(s => (
          <button
            key={s}
            onClick={() => setSeason(s)}
            className={cn(
              'rounded-full px-4 py-1.5 text-sm font-medium transition',
              s === season ? 'bg-cgs-sage text-white' : 'bg-white ring-1 ring-cgs-mist text-gray-500 hover:ring-cgs-sage/40'
            )}
          >
            {s}
          </button>
        ))}
      </div>

      {!data?.data?.length ? (
        <EmptyState preset="farmers" description="Enroll farmers first, then log their seasonal practice changes." />
      ) : (
        <div className="space-y-3">
          {data.data.map(farmer => {
            const entry = entries[farmer.id];
            return (
              <div key={farmer.id} className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-cgs-mist/40">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div>
                    <p className="font-semibold text-cgs-charcoal">{farmer.firstName} {farmer.lastName}</p>
                    <p className="text-xs text-gray-400">{[farmer.village, farmer.district].filter(Boolean).join(', ')}</p>
                  </div>
                  {entry && <span className="text-xs font-medium text-cgs-sage">✓ Recorded</span>}
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {/* Stubble Burning */}
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={entry?.stubbleBurning === false}
                      onChange={e => updateEntry(farmer.id, { stubbleBurning: !e.target.checked })}
                      className="h-4 w-4 accent-cgs-sage"
                    />
                    <span className="text-sm text-gray-700">Did NOT burn stubble ✓</span>
                  </label>
                  {/* No Till */}
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!entry?.noTill}
                      onChange={e => updateEntry(farmer.id, { noTill: e.target.checked })}
                      className="h-4 w-4 accent-cgs-sage"
                    />
                    <span className="text-sm text-gray-700">Adopted Happy Seeder ✓</span>
                  </label>
                  {/* Urea Reduction */}
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-700 whitespace-nowrap">Urea reduction:</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={entry?.ureaReductionPercent ?? ''}
                      onChange={e => updateEntry(farmer.id, { ureaReductionPercent: Number(e.target.value) })}
                      placeholder="0"
                      className="w-16 rounded border border-cgs-mist px-2 py-1 text-sm outline-none focus:border-cgs-sage"
                    />
                    <span className="text-sm text-gray-500">%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
