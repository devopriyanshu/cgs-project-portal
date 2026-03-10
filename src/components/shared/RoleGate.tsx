// src/components/shared/RoleGate.tsx
import type { UserRole } from '@/types/auth.types';
import { Link } from '@tanstack/react-router';
import { ROUTES } from '@/lib/constants/routes';

interface Props {
  requiredRoles: UserRole[];
  userRole: UserRole;
}

export function RoleGate({ requiredRoles }: Props) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <span className="mb-4 text-6xl">🔒</span>
      <h2 className="mb-2 font-display text-2xl font-bold italic text-cgs-forest">
        Access Restricted
      </h2>
      <p className="mb-1 text-gray-500">
        This page requires one of the following roles:
      </p>
      <p className="mb-6 font-mono text-sm text-cgs-moss">
        {requiredRoles.join(' | ')}
      </p>
      <Link
        to={ROUTES.DASHBOARD}
        className="rounded-lg bg-cgs-sage px-5 py-2.5 font-semibold text-white hover:bg-cgs-moss"
      >
        Go to Dashboard
      </Link>
    </div>
  );
}
