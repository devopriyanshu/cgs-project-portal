// src/components/layout/Sidebar.tsx
import { Link, useLocation } from '@tanstack/react-router';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, FolderOpen, Plus, Users, ClipboardList,
  Wallet, Bell, User, Building, ShieldCheck, ExternalLink,
  LogOut, HelpCircle, Leaf, X
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useAuthStore } from '@/store/auth.store';
import { useUiStore } from '@/store/ui.store';
import { useLogout } from '@/hooks/auth/useAuth';
import { UserRole } from '@/types/auth.types';
import { ROUTES, EXTERNAL_URLS } from '@/lib/constants/routes';

const navGroups = [
  {
    label: 'OVERVIEW',
    items: [
      { to: ROUTES.DASHBOARD, icon: LayoutDashboard, label: 'Dashboard' },
      { to: ROUTES.NOTIFICATIONS, icon: Bell, label: 'Notifications' },
    ],
  },
  {
    label: 'PROJECTS',
    items: [
      { to: ROUTES.PROJECTS.LIST, icon: FolderOpen, label: 'My Projects' },
      { to: ROUTES.PROJECTS.NEW, icon: Plus, label: '+ New Project' },
    ],
  },
  {
    label: 'CREDITS',
    items: [
      { to: ROUTES.CREDITS.LIST, icon: Leaf, label: 'Credit Inventory' },
    ],
  },
  {
    label: 'ACCOUNT',
    items: [
      { to: ROUTES.SETTINGS.PROFILE, icon: User, label: 'Profile' },
      { to: ROUTES.SETTINGS.ORGANIZATION, icon: Building, label: 'Organisation' },
      { to: ROUTES.SETTINGS.KYC, icon: ShieldCheck, label: 'KYC' },
    ],
  },
];

const fpoGroup = {
  label: 'FPO MANAGEMENT',
  items: [
    { to: ROUTES.FPO.FARMERS, icon: Users, label: 'Farmers' },
    { to: ROUTES.FPO.PRACTICE_LOG, icon: ClipboardList, label: 'Practice Log' },
    { to: ROUTES.FPO.PAYOUTS, icon: Wallet, label: 'Payouts' },
  ],
};

export function Sidebar() {
  const { pathname } = useLocation();
  const { user } = useAuthStore();
  const { sidebarOpen, setSidebarOpen } = useUiStore();
  const logoutMutation = useLogout();

  const groups = user?.role === UserRole.FPO_OFFICER
    ? [navGroups[0], navGroups[1], fpoGroup, navGroups[2], navGroups[3]]
    : navGroups;

  const isActive = (path: string) =>
    pathname === path || (path !== '/dashboard' && pathname.startsWith(path));

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-20 bg-black/40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ x: sidebarOpen ? 0 : -280 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed left-0 top-0 z-30 flex h-full w-64 flex-col bg-cgs-forest text-cgs-white shadow-2xl lg:static lg:translate-x-0"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 p-5">
          <div>
            <p className="font-display text-xl font-bold italic text-cgs-sage">CGS</p>
            <p className="text-xs font-medium text-cgs-mist/70">Projects Portal</p>
            {user?.orgName && (
              <p className="mt-1 truncate text-xs text-cgs-white/50">{user.orgName}</p>
            )}
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded p-1 text-white/50 hover:text-white lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        {/* KYC badge */}
        {user?.kycStatus && (
          <div className="mx-4 mt-3">
            <span
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
                user.kycStatus === 'APPROVED'
                  ? 'bg-cgs-sage/20 text-cgs-sage'
                  : user.kycStatus === 'PENDING'
                  ? 'bg-yellow-500/20 text-yellow-400'
                  : 'bg-red-500/20 text-red-400'
              )}
            >
              <span
                className={cn(
                  'h-1.5 w-1.5 rounded-full',
                  user.kycStatus === 'APPROVED'
                    ? 'bg-cgs-sage'
                    : user.kycStatus === 'PENDING'
                    ? 'bg-yellow-400'
                    : 'bg-red-400'
                )}
              />
              KYC {user.kycStatus}
            </span>
          </div>
        )}

        {/* Nav */}
        <nav className="scrollbar-thin flex-1 overflow-y-auto px-3 py-4">
          {groups.map((group) => (
            <div key={group.label} className="mb-6">
              <p className="mb-2 px-3 text-[10px] font-semibold tracking-widest text-white/30">
                {group.label}
              </p>
              {group.items.map((item) => {
                const active = isActive(item.to);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150',
                      active
                        ? 'border-l-2 border-cgs-sage bg-cgs-sage/10 text-cgs-sage'
                        : 'text-white/70 hover:bg-white/5 hover:text-white'
                    )}
                    onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
                  >
                    <item.icon size={18} className={active ? 'text-cgs-sage' : ''} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-white/10 p-3 space-y-1">
          <a
            href={EXTERNAL_URLS.MARKETPLACE}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-cgs-sage hover:bg-white/5"
          >
            <ExternalLink size={16} />
            Marketplace ↗
          </a>
          <a
            href={EXTERNAL_URLS.HELP}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/50 hover:text-white hover:bg-white/5"
          >
            <HelpCircle size={16} />
            Help Centre
          </a>
          <button
            onClick={() => logoutMutation.mutate()}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/50 hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </motion.aside>
    </>
  );
}
