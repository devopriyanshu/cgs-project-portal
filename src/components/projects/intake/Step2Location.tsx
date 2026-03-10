// src/components/projects/intake/Step2Location.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod/v4';
import { useWizardStore } from '@/store/wizard.store';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { INDIA_STATES } from '@/lib/constants/app.constants';
import { Info } from 'lucide-react';

const schema = z.object({
  state: z.string().min(1, 'Please select a state'),
  district: z.string().min(1, 'Please select a district'),
  pincode: z.string().regex(/^\d{6}$/, 'Pincode must be 6 digits').optional().or(z.literal('')),
});

type FormData = z.infer<typeof schema>;

export function Step2Location() {
  const { data, updateData, advance, back } = useWizardStore();

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      state: data.state ?? '',
      district: data.district ?? '',
      pincode: data.pincode ?? '',
    },
  });

  const selectedState = watch('state');
  const districts = INDIA_STATES.find(s => s.name === selectedState)?.districts ?? [];

  const onSubmit = (values: FormData) => {
    updateData({ state: values.state, district: values.district, pincode: values.pincode });
    advance();
  };

  return (
    <div>
      <div className="mb-8">
        <span className="font-display text-8xl font-bold italic text-cgs-forest/5 select-none">02</span>
        <h2 className="-mt-8 font-display text-3xl font-semibold italic text-cgs-forest">
          Where is your project located?
        </h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex max-w-lg flex-col gap-4">
        <Select
          label="State / Union Territory"
          options={INDIA_STATES.map(s => ({ value: s.name, label: s.name }))}
          value={selectedState}
          onValueChange={(v) => { setValue('state', v); setValue('district', ''); }}
          error={errors.state?.message}
        />

        <Select
          label="District"
          options={districts.map(d => ({ value: d, label: d }))}
          value={watch('district')}
          onValueChange={(v) => setValue('district', v)}
          placeholder={selectedState ? 'Select district' : 'Select state first'}
          error={errors.district?.message}
          disabled={!selectedState}
        />

        <Input
          label="Pincode (optional)"
          type="text"
          inputMode="numeric"
          maxLength={6}
          placeholder="6-digit pincode"
          error={errors.pincode?.message}
          {...register('pincode')}
        />

        <div className="flex items-start gap-2 rounded-lg bg-blue-50 p-3 text-sm text-blue-700">
          <Info size={14} className="mt-0.5 shrink-0" />
          <span>
            Projects in priority districts (drought-prone, tribal, flood-affected) receive eligibility fast-track within 24 hours.
          </span>
        </div>

        <div className="mt-4 flex justify-between">
          <Button type="button" variant="ghost" onClick={back}>← Back</Button>
          <Button type="submit" size="lg">Continue →</Button>
        </div>
      </form>
    </div>
  );
}
