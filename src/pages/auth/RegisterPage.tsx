// src/pages/auth/RegisterPage.tsx
import { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Check } from 'lucide-react';
import { useRegister } from '@/hooks/auth/useAuth';
import { emailSchema, phoneSchema, passwordSchema } from '@/lib/utils/validators';
import { OrganizationType } from '@/types/auth.types';
import { ROUTES } from '@/lib/constants/routes';
import { cn } from '@/lib/utils/cn';

const ORG_TYPES = [
  { value: OrganizationType.PROJECT_DEVELOPER, icon: '🌱', label: 'Project Developer / NGO' },
  { value: OrganizationType.WASTE_MANAGEMENT, icon: '♻️', label: 'Waste Management Firm' },
  { value: OrganizationType.RENEWABLE_ENERGY, icon: '☀️', label: 'Renewable Energy Developer' },
  { value: OrganizationType.FPO, icon: '🌾', label: 'FPO / Agricultural Collective' },
  { value: OrganizationType.MUNICIPAL_BODY, icon: '🏛️', label: 'Municipal Body' },
  { value: OrganizationType.INDUSTRIAL_COMPANY, icon: '🏭', label: 'Industrial Company' },
  { value: OrganizationType.INVESTOR, icon: '💰', label: 'Investor / ESG Fund' },
];

const registerSchema = z.object({
  email: emailSchema,
  phone: phoneSchema,
  password: passwordSchema,
  orgType: z.nativeEnum(OrganizationType),
  agreeTerms: z.boolean().refine((v) => v, 'You must accept the terms'),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const navigate = useNavigate();
  const registerMutation = useRegister();

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const selectedOrgType = watch('orgType');

  const onSubmit = async (data: RegisterForm) => {
    try {
      await registerMutation.mutateAsync({
        email: data.email,
        phone: data.phone,
        password: data.password,
        orgType: data.orgType,
      });
      navigate({ to: ROUTES.AUTH.VERIFY_EMAIL, search: { email: data.email } });
    } catch {
      // Error handled by hook
    }
  };

  return (
    <div className="min-h-screen bg-cgs-cream px-4 py-12">
      <div className="mx-auto w-full max-w-lg">
        {/* Logo */}
        <div className="mb-8 text-center">
          <p className="font-display text-4xl font-bold italic text-cgs-forest">CGS</p>
          <p className="mt-1 text-sm text-gray-500">Create your project portal account</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-white p-8 shadow-lg ring-1 ring-cgs-mist/50"
        >
          <h1 className="mb-6 font-display text-2xl font-bold italic text-cgs-forest">
            Create Account
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Org type selection */}
            <div>
              <label className="mb-2 block text-sm font-medium text-cgs-charcoal">
                Organisation type
              </label>
              <div className="grid grid-cols-2 gap-2">
                {ORG_TYPES.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setValue('orgType', type.value, { shouldValidate: true })}
                    className={cn(
                      'flex items-center gap-2 rounded-lg border p-2.5 text-left text-sm transition',
                      selectedOrgType === type.value
                        ? 'border-cgs-sage bg-cgs-sage/10 text-cgs-forest font-medium'
                        : 'border-cgs-mist hover:border-cgs-sage/40 hover:bg-gray-50'
                    )}
                  >
                    <span className="text-lg">{type.icon}</span>
                    <span className="text-xs leading-tight">{type.label}</span>
                    {selectedOrgType === type.value && (
                      <Check size={14} className="ml-auto shrink-0 text-cgs-sage" />
                    )}
                  </button>
                ))}
              </div>
              {errors.orgType && (
                <p className="mt-1 text-xs text-red-500">{errors.orgType.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-cgs-charcoal">
                Email address
              </label>
              <input
                {...register('email')}
                type="email"
                placeholder="you@company.in"
                className={cn(
                  'w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none transition focus:border-cgs-sage focus:ring-2 focus:ring-cgs-sage/20',
                  errors.email ? 'border-red-400 bg-red-50' : 'border-cgs-mist'
                )}
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-cgs-charcoal">
                Mobile number
              </label>
              <div className="flex">
                <span className="flex items-center rounded-l-lg border border-r-0 border-cgs-mist bg-gray-50 px-3 text-sm text-gray-500">
                  +91
                </span>
                <input
                  {...register('phone')}
                  type="tel"
                  placeholder="9876543210"
                  maxLength={10}
                  className={cn(
                    'flex-1 rounded-r-lg border px-3.5 py-2.5 text-sm outline-none transition focus:border-cgs-sage focus:ring-2 focus:ring-cgs-sage/20',
                    errors.phone ? 'border-red-400 bg-red-50' : 'border-cgs-mist'
                  )}
                />
              </div>
              {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-cgs-charcoal">
                Password
              </label>
              <input
                {...register('password')}
                type="password"
                placeholder="Min 8 chars, uppercase, number, symbol"
                className={cn(
                  'w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none transition focus:border-cgs-sage focus:ring-2 focus:ring-cgs-sage/20',
                  errors.password ? 'border-red-400 bg-red-50' : 'border-cgs-mist'
                )}
              />
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3">
              <input
                {...register('agreeTerms')}
                type="checkbox"
                id="terms"
                className="mt-0.5 accent-cgs-sage"
              />
              <label htmlFor="terms" className="text-xs text-gray-600">
                I agree to CGS{' '}
                <a href="#" className="text-cgs-sage hover:underline">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-cgs-sage hover:underline">Privacy Policy</a>
              </label>
            </div>
            {errors.agreeTerms && <p className="text-xs text-red-500">{errors.agreeTerms.message}</p>}

            <button
              type="submit"
              disabled={registerMutation.isPending}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-cgs-sage px-4 py-3 font-semibold text-white shadow-sm transition hover:bg-cgs-moss disabled:opacity-60"
            >
              {registerMutation.isPending ? (
                <><Loader2 size={16} className="animate-spin" /> Creating account...</>
              ) : (
                'Create Account →'
              )}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to={ROUTES.AUTH.LOGIN} className="font-medium text-cgs-sage hover:underline">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
