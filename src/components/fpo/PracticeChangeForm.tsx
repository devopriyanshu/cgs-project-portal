// src/components/fpo/PracticeChangeForm.tsx
import { useState } from 'react';
import { toast } from 'sonner';
import { useFarmers } from '@/hooks/fpo/useFpo';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { cn } from '@/lib/utils/cn';
import apiClient from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/constants/api-endpoints';

const SEASONS = [
  'Kharif 2024', 'Rabi 2024–25', 'Kharif 2025', 'Rabi 2025–26',
];

interface FarmerPractice {
  farmerId: string;
  stubbleburnPrevented: boolean;
  ureaReductionPercent: number;
  noTill: boolean;
}

export function PracticeChangeForm() {
  const [season, setSeason] = useState(SEASONS[0]);
  const [practices, setPractices] = useState<Record<string, FarmerPractice>>({});
  const [submitting, setSubmitting] = useState(false);

  const { data: farmersData } = useFarmers({ limit: 100 });
  const farmers = farmersData?.data ?? [];

  const update = (farmerId: string, patch: Partial<FarmerPractice>) => {
    setPractices((prev) => {
      const existing = prev[farmerId] ?? { farmerId, stubbleburnPrevented: false, ureaReductionPercent: 0, noTill: false };
      return { ...prev, [farmerId]: { ...existing, ...patch } };
    });
  };

  const handleSubmit = async () => {
    const entries = Object.values(practices);
    if (entries.length === 0) { toast.error('No practice changes recorded.'); return; }
    setSubmitting(true);
    try {
      await apiClient.post(API_ENDPOINTS.FPO.LOG_PRACTICE, { season, entries });
      toast.success(`${entries.length} farmers' practice changes logged for ${season}.`);
      setPractices({});
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Select
          label="Season"
          options={SEASONS.map(s => ({ value: s, label: s }))}
          value={season}
          onValueChange={setSeason}
          className="w-56"
        />
      </div>

      <div className="rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
              <th className="px-4 py-3 text-left">Farmer</th>
              <th className="px-4 py-3 text-center">No Stubble Burn</th>
              <th className="px-4 py-3 text-center">Urea Reduction %</th>
              <th className="px-4 py-3 text-center">No-Till</th>
            </tr>
          </thead>
          <tbody>
            {farmers.map((f) => {
              const p = practices[f.id];
              return (
                <tr key={f.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-4 py-3 font-medium text-cgs-forest">{f.name}</td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => update(f.id, { stubbleburnPrevented: !p?.stubbleburnPrevented })}
                      className={cn(
                        'rounded-lg border px-3 py-1 text-xs font-medium transition-colors',
                        p?.stubbleburnPrevented
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                          : 'border-gray-200 text-gray-400 hover:border-gray-300'
                      )}
                    >
                      {p?.stubbleburnPrevented ? '✓ Did NOT burn' : 'Mark'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={p?.ureaReductionPercent ?? ''}
                      onChange={(e) => update(f.id, { ureaReductionPercent: Number(e.target.value) })}
                      className="w-16 rounded-lg border border-gray-200 px-2 py-1 text-center text-xs focus:border-cgs-sage focus:outline-none"
                      placeholder="%"
                    />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => update(f.id, { noTill: !p?.noTill })}
                      className={cn(
                        'rounded-lg border px-3 py-1 text-xs font-medium transition-colors',
                        p?.noTill
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                          : 'border-gray-200 text-gray-400 hover:border-gray-300'
                      )}
                    >
                      {p?.noTill ? '✓ Happy Seeder' : 'Mark'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSubmit} loading={submitting} disabled={Object.keys(practices).length === 0}>
          Submit Practice Changes ({Object.keys(practices).length} farmers)
        </Button>
      </div>
    </div>
  );
}
