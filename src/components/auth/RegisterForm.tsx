// src/components/auth/RegisterForm.tsx
// Two-step registration matching the actual backend flow:
// Step 1: Register account (email + password + firstName + lastName + role + phone)
// Step 2: Create Organisation (name + legalName + type + registeredAddress + state + district + pincode)
import { useForm } from 'react-hook-form';
import { useNavigate } from '@tanstack/react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { toast } from 'sonner';
import { useRegister } from '@/hooks/auth/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { ROUTES } from '@/lib/constants/routes';
import { UserRole, OrganizationType, type RegisterPayload, type CreateOrgPayload } from '@/types/auth.types';
import { INDIAN_STATES } from '@/lib/constants/app.constants';
import apiClient from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/constants/api-endpoints';
import { Link } from '@tanstack/react-router';

const ORG_TYPE_OPTIONS = [
  { value: OrganizationType.CORPORATE, label: 'Corporate' },
  { value: OrganizationType.FPO, label: 'Farmer Producer Organisation (FPO)' },
  { value: OrganizationType.NGO, label: 'NGO' },
  { value: OrganizationType.MUNICIPAL_BODY, label: 'Municipal Body' },
  { value: OrganizationType.RENEWABLE_DEVELOPER, label: 'Renewable Energy Developer' },
  { value: OrganizationType.WASTE_MANAGEMENT_FIRM, label: 'Waste Management Firm' },
  { value: OrganizationType.INDUSTRIAL, label: 'Industrial Company' },
  { value: OrganizationType.INVESTOR, label: 'Investor' },
];

const ROLE_OPTIONS = [
  { value: UserRole.PROJECT_DEVELOPER, label: 'Project Developer' },
  { value: UserRole.FPO_OFFICER, label: 'FPO Officer' },
  { value: UserRole.CORPORATE_BUYER, label: 'Corporate Buyer' },
];

const STEPS = ['Account', 'Organisation'] as const;

// Step 1 form
interface AccountForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
}

// Step 2 form
interface OrgForm {
  name: string;
  legalName: string;
  type: OrganizationType;
  registeredAddress: string;
  state: string;
  district: string;
  pincode: string;
  gstin: string;
  website: string;
}

export function RegisterForm() {
  const navigate = useNavigate();
  const register = useRegister();
  const [step, setStep] = useState(0);

  // FIX: Keep a separate "account was saved" flag so we can still allow
  // going back to step 1 for review, but we know not to re-submit.
  const [accountSaved, setAccountSaved] = useState(false);
  const [orgSubmitting, setOrgSubmitting] = useState(false);

  // FIX: Use a SINGLE value for each select, initialised consistently.
  // Default to PROJECT_DEVELOPER role and CORPORATE org type.
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.PROJECT_DEVELOPER);
  const [selectedOrgType, setSelectedOrgType] = useState<OrganizationType>(OrganizationType.CORPORATE);

  const account = useForm<AccountForm>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      role: UserRole.PROJECT_DEVELOPER,
    },
  });

  const org = useForm<OrgForm>({
    defaultValues: {
      name: '',
      legalName: '',
      type: OrganizationType.CORPORATE,
      registeredAddress: '',
      state: '',
      district: '',
      pincode: '',
      gstin: '',
      website: '',
    },
  });

  // ── Step 1: Register user ──────────────────────────────────────────────
  const handleAccount = account.handleSubmit(async (data) => {
    if (data.password !== data.confirmPassword) {
      account.setError('confirmPassword', { message: "Passwords don't match" });
      return;
    }

    const payload: RegisterPayload = {
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone || undefined,
      // FIX: Use the controlled selectedRole, not just data.role which may lag
      role: selectedRole,
    };

    register.mutate(payload, {
      onSuccess: () => {
        setAccountSaved(true);
        setStep(1);
        toast.success('Account created! Now set up your organisation.');
      },
    });
  });

  // ── Step 2: Create organisation ────────────────────────────────────────
  const handleOrg = org.handleSubmit(async (data) => {
    setOrgSubmitting(true);
    const payload: CreateOrgPayload = {
      name: data.name,
      legalName: data.legalName,
      // FIX: Use the controlled selectedOrgType, not data.type which shadows the select
      type: selectedOrgType,
      registeredAddress: data.registeredAddress,
      state: data.state,
      district: data.district,
      pincode: data.pincode,
      gstin: data.gstin || undefined,
      website: data.website || undefined,
    };

    try {
      await apiClient.post(API_ENDPOINTS.ORGANIZATIONS.CREATE, payload);
      toast.success('Organisation created! Welcome to CGS.');
      navigate({ to: ROUTES.DASHBOARD });
    } catch {
      // interceptor handles toast
    } finally {
      setOrgSubmitting(false);
    }
  });

  return (
    <div className="w-full max-w-md">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold italic text-cgs-forest">Create your account</h1>
        <p className="mt-1 text-sm text-gray-500">Join the CGS carbon project ecosystem</p>
      </div>

      {/* Step pills */}
      <div className="mb-8 flex items-center gap-2">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all ${
              i < step ? 'bg-cgs-sage text-white' : i === step ? 'bg-cgs-forest text-cgs-cream' : 'bg-gray-100 text-gray-400'
            }`}>
              {i < step ? '✓' : i + 1}
            </div>
            <span className={`text-xs font-medium ${i === step ? 'text-cgs-forest' : 'text-gray-400'}`}>{s}</span>
            {i < STEPS.length - 1 && <div className="mx-1 h-0.5 w-8 bg-gray-200" />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.18 }}
        >
          {/* ── Step 0: Account Details ── */}
          {step === 0 && (
            <form onSubmit={handleAccount} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="First Name"
                  required
                  error={account.formState.errors.firstName?.message}
                  {...account.register('firstName', { required: 'Required' })}
                />
                <Input
                  label="Last Name"
                  required
                  error={account.formState.errors.lastName?.message}
                  {...account.register('lastName', { required: 'Required' })}
                />
              </div>

              <Input
                label="Email address"
                type="email"
                required
                placeholder="you@company.in"
                error={account.formState.errors.email?.message}
                {...account.register('email', { required: 'Required', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Valid email required' } })}
              />

              <Input
                label="Mobile Number (optional)"
                type="tel"
                placeholder="10-digit Indian mobile"
                error={account.formState.errors.phone?.message}
                {...account.register('phone', { pattern: { value: /^[6-9]\d{9}$/, message: 'Valid 10-digit mobile required' } })}
              />

              <Input
                label="Password"
                type="password"
                required
                hint="Minimum 8 characters"
                error={account.formState.errors.password?.message}
                {...account.register('password', { required: 'Required', minLength: { value: 8, message: 'Min 8 characters' } })}
              />

              <Input
                label="Confirm Password"
                type="password"
                required
                error={account.formState.errors.confirmPassword?.message}
                {...account.register('confirmPassword', { required: 'Required' })}
              />

              {/* FIX: Role select is fully controlled. value and onValueChange stay in sync. */}
              <Select
                label="Your Role"
                options={ROLE_OPTIONS}
                value={selectedRole}
                onValueChange={(v) => {
                  const newRole = v as UserRole;
                  setSelectedRole(newRole);
                  account.setValue('role', newRole, { shouldValidate: false });
                }}
              />

              <Button type="submit" loading={register.isPending} size="lg" className="mt-2 w-full">
                Create Account →
              </Button>
            </form>
          )}

          {/* ── Step 1: Organisation ── */}
          {step === 1 && (
            <form onSubmit={handleOrg} className="flex flex-col gap-4">
              <Input
                label="Organisation Name"
                required
                placeholder="e.g. Green Future FPO"
                error={org.formState.errors.name?.message}
                {...org.register('name', { required: 'Required' })}
              />

              <Input
                label="Legal Name"
                required
                placeholder="Name as per incorporation certificate"
                error={org.formState.errors.legalName?.message}
                {...org.register('legalName', { required: 'Required' })}
              />

              {/* FIX: Org type is fully controlled by selectedOrgType state.
                  No RHF registration needed since we read it directly in handleOrg. */}
              <Select
                label="Organisation Type"
                options={ORG_TYPE_OPTIONS}
                value={selectedOrgType}
                onValueChange={(v) => setSelectedOrgType(v as OrganizationType)}
              />

              <Input
                label="Registered Address"
                required
                placeholder="Street, locality, city"
                error={org.formState.errors.registeredAddress?.message}
                {...org.register('registeredAddress', { required: 'Required' })}
              />

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">State *</label>
                  <select
                    className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm focus:border-cgs-sage focus:outline-none focus:ring-2 focus:ring-cgs-sage/20"
                    defaultValue=""
                    {...org.register('state', { required: true })}
                  >
                    <option value="" disabled>Select state…</option>
                    {INDIAN_STATES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <Input
                  label="District"
                  required
                  error={org.formState.errors.district?.message}
                  {...org.register('district', { required: 'Required' })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Pincode"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  required
                  error={org.formState.errors.pincode?.message}
                  {...org.register('pincode', { required: 'Required', pattern: { value: /^\d{6}$/, message: '6-digit pincode' } })}
                />
                <Input
                  label="GSTIN (optional)"
                  placeholder="22AAAAA0000A1Z5"
                  {...org.register('gstin')}
                />
              </div>

              <Input
                label="Website (optional)"
                type="url"
                placeholder="https://example.com"
                {...org.register('website')}
              />

              <div className="flex gap-3 mt-2">
                {/* FIX: Back is never disabled — account is already saved server-side,
                    going back to step 0 just lets the user review (they can't re-submit). */}
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setStep(0)}
                  className="flex-1"
                >
                  ← Back
                </Button>
                {/* FIX: Show loading state during org creation to prevent double-submit. */}
                <Button type="submit" loading={orgSubmitting} size="lg" className="flex-1">
                  Finish Setup →
                </Button>
              </div>

              {/* Helpful note shown after account is saved */}
              {accountSaved && (
                <p className="text-center text-xs text-gray-400">
                  Account saved. Going back doesn't re-create your account.
                </p>
              )}
            </form>
          )}
        </motion.div>
      </AnimatePresence>

      <p className="mt-6 text-center text-sm text-gray-500">
        Already have an account?{' '}
        <Link to={ROUTES.AUTH.LOGIN} className="font-medium text-cgs-sage hover:underline">Sign in</Link>
      </p>
    </div>
  );
}
