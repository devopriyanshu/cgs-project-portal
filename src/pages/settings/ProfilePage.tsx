// src/pages/settings/ProfilePage.tsx
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/auth.store';
import { PageHeader } from '@/components/layout/PageHeader';
import apiClient from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/constants/api-endpoints';

const profileSchema = z.object({
  firstName: z.string().min(1, 'Required'),
  lastName: z.string().min(1, 'Required'),
  phone: z.string().optional(),
});

type ProfileForm = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const { register, handleSubmit, reset, formState: { errors, isDirty, isSubmitting } } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: { firstName: user?.firstName ?? '', lastName: user?.lastName ?? '' },
  });

  useEffect(() => {
    if (user) reset({ firstName: user.firstName, lastName: user.lastName });
  }, [user]);

  const onSubmit = async (values: ProfileForm) => {
    try {
      const { data } = await apiClient.patch(API_ENDPOINTS.USERS.UPDATE_PROFILE, values);
      setUser(data.data);
      toast.success('Profile updated successfully.');
    } catch {
      toast.error('Failed to update profile. Please try again.');
    }
  };

  return (
    <div className="space-y-6 max-w-lg">
      <PageHeader title="Profile" subtitle="Update your personal information" />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 rounded-xl bg-white p-6 shadow-sm ring-1 ring-cgs-mist/40">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-cgs-charcoal">First Name</label>
            <input
              {...register('firstName')}
              className="w-full rounded-lg border border-cgs-mist px-3 py-2.5 text-sm outline-none focus:border-cgs-sage focus:ring-2 focus:ring-cgs-sage/20"
            />
            {errors.firstName && <p className="mt-1 text-xs text-red-500">{errors.firstName.message}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-cgs-charcoal">Last Name</label>
            <input
              {...register('lastName')}
              className="w-full rounded-lg border border-cgs-mist px-3 py-2.5 text-sm outline-none focus:border-cgs-sage focus:ring-2 focus:ring-cgs-sage/20"
            />
            {errors.lastName && <p className="mt-1 text-xs text-red-500">{errors.lastName.message}</p>}
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-cgs-charcoal">Email</label>
          <input
            value={user?.email ?? ''}
            disabled
            className="w-full rounded-lg border border-cgs-mist bg-gray-50 px-3 py-2.5 text-sm text-gray-400 cursor-not-allowed"
          />
          <p className="mt-1 text-xs text-gray-400">Email cannot be changed. Contact support if needed.</p>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-cgs-charcoal">Role</label>
          <input
            value={user?.role?.replace(/_/g, ' ') ?? ''}
            disabled
            className="w-full rounded-lg border border-cgs-mist bg-gray-50 px-3 py-2.5 text-sm text-gray-400 cursor-not-allowed"
          />
        </div>

        <button
          type="submit"
          disabled={!isDirty || isSubmitting}
          className="w-full rounded-lg bg-cgs-sage py-2.5 text-sm font-semibold text-white hover:bg-cgs-moss disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? 'Saving…' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
