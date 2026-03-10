// src/router.tsx
import {
  createRouter,
  createRoute,
  createRootRoute,
  Outlet,
  redirect,
} from '@tanstack/react-router';
import { lazy, Suspense } from 'react';
import { PortalLayout } from '@/components/layout/PortalLayout';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { PageLoader } from '@/components/shared/PageLoader';
import { useAuthStore } from '@/store/auth.store';

// ─── Lazy-loaded pages ────────────────────────────────────────────────────────
const LoginPage           = lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage        = lazy(() => import('@/pages/auth/RegisterPage'));
const DashboardPage       = lazy(() => import('@/pages/portal/DashboardPage'));
const ProjectsListPage    = lazy(() => import('@/pages/portal/ProjectsListPage'));
const ProjectIntakePage   = lazy(() => import('@/pages/portal/ProjectIntakePage'));
const ProjectDetailPage   = lazy(() => import('@/pages/portal/ProjectDetailPage'));
const FpoDashboardPage    = lazy(() => import('@/pages/portal/FpoDashboardPage'));
const FpoFarmersPage      = lazy(() => import('@/pages/portal/FpoFarmersPage'));
const FpoPayoutsPage      = lazy(() => import('@/pages/portal/FpoPayoutsPage'));
const FpoPracticeLogPage  = lazy(() => import('@/pages/portal/FpoPracticeLogPage'));
const CreditsPage         = lazy(() => import('@/pages/portal/CreditsPage'));
const NotificationsPage   = lazy(() => import('@/pages/portal/NotificationsPage'));
const ProfilePage         = lazy(() => import('@/pages/settings/ProfilePage'));
const OrganizationPage    = lazy(() => import('@/pages/settings/OrganizationPage'));
const KycPage             = lazy(() => import('@/pages/settings/KycPage'));

// Simple placeholder for pages not yet built
function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-center">
      <span className="text-5xl">🚧</span>
      <h2 className="font-display text-xl font-semibold italic text-cgs-forest">{title}</h2>
      <p className="text-sm text-gray-500">This page is coming soon.</p>
    </div>
  );
}

function withSuspense(Component: React.ComponentType) {
  return () => (
    <Suspense fallback={<PageLoader />}>
      <Component />
    </Suspense>
  );
}

// ─── Root route ───────────────────────────────────────────────────────────────
const rootRoute = createRootRoute({
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <Outlet />
    </Suspense>
  ),
});

// ─── Auth guards ──────────────────────────────────────────────────────────────
const authGuard = () => {
  const { isAuthenticated } = useAuthStore.getState();
  if (isAuthenticated) throw redirect({ to: '/dashboard' });
};

const protectedGuard = () => {
  const { isAuthenticated, isLoading } = useAuthStore.getState();
  if (!isLoading && !isAuthenticated) throw redirect({ to: '/login' });
};

// ─── Public auth routes ───────────────────────────────────────────────────────
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: withSuspense(LoginPage),
  beforeLoad: authGuard,
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/register',
  component: withSuspense(RegisterPage),
  beforeLoad: authGuard,
});

const verifyEmailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/verify-email',
  component: () => <PlaceholderPage title="Verify Email" />,
});

const forgotPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/forgot-password',
  component: () => <PlaceholderPage title="Forgot Password" />,
});

// ─── Portal layout (authenticated) ───────────────────────────────────────────
const portalLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'portal',
  component: () => (
    <ProtectedRoute>
      <PortalLayout />
    </ProtectedRoute>
  ),
  beforeLoad: protectedGuard,
});

// ─── Portal pages ─────────────────────────────────────────────────────────────
const dashboardRoute = createRoute({
  getParentRoute: () => portalLayoutRoute,
  path: '/dashboard',
  component: withSuspense(DashboardPage),
});

const projectsRoute = createRoute({
  getParentRoute: () => portalLayoutRoute,
  path: '/projects',
  component: withSuspense(ProjectsListPage),
});

const projectsNewRoute = createRoute({
  getParentRoute: () => portalLayoutRoute,
  path: '/projects/new',
  component: withSuspense(ProjectIntakePage),
});

const projectDetailRoute = createRoute({
  getParentRoute: () => portalLayoutRoute,
  path: '/projects/$projectId',
  component: withSuspense(ProjectDetailPage),
});

const fpoRoute = createRoute({
  getParentRoute: () => portalLayoutRoute,
  path: '/fpo',
  component: withSuspense(FpoDashboardPage),
});

const fpoFarmersRoute = createRoute({
  getParentRoute: () => portalLayoutRoute,
  path: '/fpo/farmers',
  component: withSuspense(FpoFarmersPage),
});

const fpoPayoutsRoute = createRoute({
  getParentRoute: () => portalLayoutRoute,
  path: '/fpo/payouts',
  component: withSuspense(FpoPayoutsPage),
});

const fpoPracticeLogRoute = createRoute({
  getParentRoute: () => portalLayoutRoute,
  path: '/fpo/practice-log',
  component: withSuspense(FpoPracticeLogPage),
});

const creditsRoute = createRoute({
  getParentRoute: () => portalLayoutRoute,
  path: '/credits',
  component: withSuspense(CreditsPage),
});

const notificationsRoute = createRoute({
  getParentRoute: () => portalLayoutRoute,
  path: '/notifications',
  component: withSuspense(NotificationsPage),
});

// ─── Settings routes ──────────────────────────────────────────────────────────
const profileRoute = createRoute({
  getParentRoute: () => portalLayoutRoute,
  path: '/settings/profile',
  component: withSuspense(ProfilePage),
});

const organizationRoute = createRoute({
  getParentRoute: () => portalLayoutRoute,
  path: '/settings/organization',
  component: withSuspense(OrganizationPage),
});

const kycRoute = createRoute({
  getParentRoute: () => portalLayoutRoute,
  path: '/settings/kyc',
  component: withSuspense(KycPage),
});

// ─── Index redirect ───────────────────────────────────────────────────────────
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => { throw redirect({ to: '/dashboard' }); },
  component: () => null,
});

// ─── Route tree ───────────────────────────────────────────────────────────────
const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  registerRoute,
  verifyEmailRoute,
  forgotPasswordRoute,
  portalLayoutRoute.addChildren([
    dashboardRoute,
    projectsRoute,
    projectsNewRoute,
    projectDetailRoute,
    fpoRoute,
    fpoFarmersRoute,
    fpoPayoutsRoute,
    fpoPracticeLogRoute,
    creditsRoute,
    notificationsRoute,
    profileRoute,
    organizationRoute,
    kycRoute,
  ]),
]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
