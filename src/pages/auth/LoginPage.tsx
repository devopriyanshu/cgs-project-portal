// src/pages/auth/LoginPage.tsx
import { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useLogin } from '@/hooks/auth/useAuth';
import { emailSchema, passwordSchema } from '@/lib/utils/validators';
import { ROUTES } from '@/lib/constants/routes';
import { cn } from '@/lib/utils/cn';

const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const loginMutation = useLogin();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      await loginMutation.mutateAsync(data);
      navigate({ to: ROUTES.DASHBOARD });
    } catch {
      // Error toast handled in hook
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-cgs-cream px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <p className="font-display text-4xl font-bold italic text-cgs-forest">CGS</p>
          <p className="mt-1 text-sm text-gray-500">Common Ground Solutions — Projects Portal</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl bg-white p-8 shadow-lg ring-1 ring-cgs-mist/50"
        >
          <h1 className="mb-1 font-display text-2xl font-bold italic text-cgs-forest">
            Welcome back
          </h1>
          <p className="mb-6 text-sm text-gray-500">Sign in to your project portal</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                  'w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none transition',
                  'focus:border-cgs-sage focus:ring-2 focus:ring-cgs-sage/20',
                  errors.email ? 'border-red-400 bg-red-50' : 'border-cgs-mist bg-white'
                )}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-cgs-charcoal">
                Password
              </label>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className={cn(
                    'w-full rounded-lg border px-3.5 py-2.5 pr-10 text-sm outline-none transition',
                    'focus:border-cgs-sage focus:ring-2 focus:ring-cgs-sage/20',
                    errors.password ? 'border-red-400 bg-red-50' : 'border-cgs-mist bg-white'
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center justify-end">
              <Link
                to={ROUTES.AUTH.FORGOT_PASSWORD}
                className="text-xs text-cgs-sage hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-cgs-sage px-4 py-3 font-semibold text-white shadow-sm transition hover:bg-cgs-moss disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loginMutation.isPending ? (
                <><Loader2 size={16} className="animate-spin" /> Signing in...</>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-gray-500">
            New to CGS?{' '}
            <Link to={ROUTES.AUTH.REGISTER} className="font-medium text-cgs-sage hover:underline">
              Create an account
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
