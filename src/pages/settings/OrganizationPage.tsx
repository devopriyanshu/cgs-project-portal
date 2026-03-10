// src/pages/settings/OrganizationPage.tsx
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMyOrganization, useUpdateOrganization } from '@/hooks/organization/useOrganization';
import { PageHeader } from '@/components/layout/PageHeader';
import { gstinSchema } from '@/lib/utils/validators';
import { INDIAN_STATES } from '@/lib/constants/app.constants';

const orgSchema = z.object({
  name: z.string().min(2, 'Organisation name required'),
  gstin: gstinSchema,
  addressLine1: z.string().optional(),
  addressLine2: z.string().optional(),
  state: z.string().optional(),
  district: z.string().optional(),
  pincode: z.string().optional(),
});

type OrgForm = z.infer<typeof orgSchema>;

export default function OrganizationPage() {
  const { data: org, isLoading } = useMyOrganization();
  const update = useUpdateOrganization(org?.id ?? '');

  const { register, handleSubmit, reset, formState: { errors, isDirty, isSubmitting } } = useForm<OrgForm>({
    resolver: zodResolver(orgSchema),
  });

  useEffect(() => {
    if (org) {
      reset({
        name: org.name ?? '',
        gstin: org.gstin ?? '',
        addressLine1: org.addressLine1 ?? '',
        addressLine2: org.addressLine2 ?? '',
        state: org.state ?? '',
        district: org.district ?? '',
        pincode: org.pincode ?? '',
      });
    }
  }, [org]);

  if (isLoading) {
    return <div className="h-64 animate-pulse rounded-xl bg-gray-100" />;
  }

  const onSubmit = (values: OrgForm) => update.mutate(values);

  function Field({ name, label, placeholder }: { name: keyof OrgForm; label: string; placeholder?: string }) {
    return (
      <div>
        <label className="mb-1 block text-sm font-medium text-cgs-charcoal">{label}</label>
        <input
          {...register(name)}
          placeholder={placeholder}
          className="w-full rounded-lg border border-cgs-mist px-3 py-2.5 text-sm outline-none focus:border-cgs-sage focus:ring-2 focus:ring-cgs-sage/20"
        />
        {errors[name] && <p className="mt-1 text-xs text-red-500">{errors[name]?.message as string}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <PageHeader title="Organisation" subtitle="Update your organisation's registered details" />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 rounded-xl bg-white p-6 shadow-sm ring-1 ring-cgs-mist/40">
        <Field name="name" label="Legal Name" placeholder="Organisation legal name" />
        <Field name="gstin" label="GSTIN (optional)" placeholder="e.g. 22AAAAA0000A1Z5" />

        <div className="border-t border-gray-100 pt-4">
          <p className="mb-4 text-sm font-medium text-cgs-forest">Registered Address</p>
          <div className="space-y-4">
            <Field name="addressLine1" label="Address Line 1" />
            <Field name="addressLine2" label="Address Line 2 (optional)" />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-cgs-charcoal">State</label>
                <select
                  {...register('state')}
                  className="w-full rounded-lg border border-cgs-mist px-3 py-2.5 text-sm outline-none focus:border-cgs-sage"
                >
                  <option value="">Select state…</option>
                  {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <Field name="district" label="District" />
            </div>
            <Field name="pincode" label="PIN Code" placeholder="e.g. 110001" />
          </div>
        </div>

        <button
          type="submit"
          disabled={!isDirty || isSubmitting || update.isPending}
          className="w-full rounded-lg bg-cgs-sage py-2.5 text-sm font-semibold text-white hover:bg-cgs-moss disabled:cursor-not-allowed disabled:opacity-50"
        >
          {update.isPending ? 'Saving…' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
