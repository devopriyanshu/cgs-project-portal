// src/components/shared/ProtectedRoute.tsx
import { Navigate, useLocation } from '@tanstack/react-router';
import { useAuthStore } from '@/store/auth.store';
import type { UserRole } from '@/types/auth.types';
import { PageLoader } from './PageLoader';

interface Props {
  children: React.ReactNode;
  requiredRoles?: UserRole[];
}

export function ProtectedRoute({ children, requiredRoles }: Props) {
  const { isAuthenticated, user, isLoading } = useAuthStore();
  const location = useLocation();

  if (isLoading) return <PageLoader />;

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        search={{ redirect: location.href }}
      />
    );
  }

  if (requiredRoles && user && !requiredRoles.includes(user.role)) {
    return (
      <div className="flex h-screen items-center justify-center bg-cgs-cream">
        <div className="text-center">
          <div className="mb-4 text-6xl">🔒</div>
          <h1 className="mb-2 font-display text-2xl font-bold text-cgs-forest">
            Access Restricted
          </h1>
          <p className="text-cgs-charcoal/70">
            You do not have permission to view this page.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
