// src/components/projects/mrv/SoilSampleTable.tsx
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useSoilSamples, useAddSoilSample } from '@/hooks/mrv/useMrv';
import { Drawer } from '@/components/ui/Drawer';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Skeleton } from '@/components/ui/Skeleton';
import { Table } from '@/components/ui/Table';
import type { SoilSample } from '@/types/mrv.types';

interface FormData {
  farmName: string;
  sampleDate: string;
  organicCarbonPercent: string;
  phLevel: string;
  labName: string;
}

export function SoilSampleTable({ mrvId }: { mrvId: string }) {
  const { data: samples, isLoading } = useSoilSamples(mrvId);
  const addSample = useAddSoilSample(mrvId);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [form, setForm] = useState<FormData>({ farmName: '', sampleDate: '', organicCarbonPercent: '', phLevel: '', labName: '' });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const validate = (): boolean => {
    const e: typeof errors = {};
    if (!form.farmName.trim()) e.farmName = 'Required';
    if (!form.sampleDate) e.sampleDate = 'Required';
    if (!form.organicCarbonPercent || isNaN(Number(form.organicCarbonPercent))) e.organicCarbonPercent = 'Valid number required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    addSample.mutate({
      farmName: form.farmName,
      sampleDate: form.sampleDate,
      organicCarbonPercent: Number(form.organicCarbonPercent),
      phLevel: form.phLevel ? Number(form.phLevel) : undefined,
      labName: form.labName || undefined,
    } as Partial<SoilSample>, {
      onSuccess: () => { setDrawerOpen(false); setForm({ farmName: '', sampleDate: '', organicCarbonPercent: '', phLevel: '', labName: '' }); },
    });
  };

  if (isLoading) return <Skeleton className="h-32 rounded-xl" />;

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-semibold text-cgs-forest">Soil Samples</p>
        <Button size="sm" variant="secondary" onClick={() => setDrawerOpen(true)}>
          <Plus size={14} /> Add Sample
        </Button>
      </div>

      <Table<SoilSample>
        columns={[
          { key: 'farmName', header: 'Farm Name' },
          { key: 'sampleDate', header: 'Sample Date', render: (r) => new Date(r.sampleDate).toLocaleDateString('en-IN') },
          { key: 'organicCarbonPercent', header: 'Organic Carbon', render: (r) => `${r.organicCarbonPercent}%` },
          { key: 'phLevel', header: 'pH', render: (r) => r.phLevel ?? '—' },
          { key: 'status', header: 'Status', render: (r) => r.status ?? '—' },
          { key: 'labName', header: 'Lab', render: (r) => r.labName ?? '—' },
        ]}
        data={samples ?? []}
        keyExtractor={(r) => r.id}
        emptyState={<p className="text-sm text-gray-400">No soil samples recorded yet</p>}
      />

      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen} title="Add Soil Sample">
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <Input label="Farm Name" required value={form.farmName} onChange={(e) => setForm(f => ({ ...f, farmName: e.target.value }))} error={errors.farmName} />
          <Input label="Sample Date" type="date" required value={form.sampleDate} onChange={(e) => setForm(f => ({ ...f, sampleDate: e.target.value }))} error={errors.sampleDate} />
          <Input label="Organic Carbon (%)" type="number" step="0.01" required value={form.organicCarbonPercent} onChange={(e) => setForm(f => ({ ...f, organicCarbonPercent: e.target.value }))} error={errors.organicCarbonPercent} />
          <Input label="pH (optional)" type="number" step="0.1" min="0" max="14" value={form.phLevel} onChange={(e) => setForm(f => ({ ...f, phLevel: e.target.value }))} />
          <Input label="Lab Name (optional)" value={form.labName} onChange={(e) => setForm(f => ({ ...f, labName: e.target.value }))} />
          <Button type="submit" loading={addSample.isPending} className="mt-2">Add Sample</Button>
        </form>
      </Drawer>
    </div>
  );
}
