// src/components/layout/Topbar.tsx
import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Menu, Bell, ChevronDown, User, Settings, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/auth.store';
import { useUiStore } from '@/store/ui.store';
import { useLogout } from '@/hooks/auth/useAuth';
import { useNotifications } from '@/hooks/notifications/useNotifications';
import { ROUTES } from '@/lib/constants/routes';
import { formatRelativeTime } from '@/lib/utils/format';
import { cn } from '@/lib/utils/cn';

export function Topbar() {
  const { user } = useAuthStore();
  const { toggleSidebar } = useUiStore();
  const logoutMutation = useLogout();
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const { data: notifications } = useNotifications();

  const unreadCount = notifications?.data?.filter((n) => !n.isRead).length ?? 0;

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b border-cgs-mist/50 bg-cgs-cream/95 px-4 backdrop-blur-sm">
      {/* Mobile hamburger */}
      <button
        onClick={toggleSidebar}
        className="rounded-lg p-2 text-cgs-forest hover:bg-cgs-mist/50 lg:hidden"
      >
        <Menu size={20} />
      </button>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Notification bell */}
      <div className="relative">
        <button
          onClick={() => { setNotifOpen(!notifOpen); setUserOpen(false); }}
          className="relative rounded-lg p-2 text-cgs-forest hover:bg-cgs-mist/50"
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-cgs-sage text-[10px] font-bold text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        <AnimatePresence>
          {notifOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 w-80 rounded-xl bg-white shadow-xl ring-1 ring-black/5"
            >
              <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                <p className="font-semibold text-cgs-forest">Notifications</p>
                <Link
                  to={ROUTES.NOTIFICATIONS}
                  onClick={() => setNotifOpen(false)}
                  className="text-xs text-cgs-sage hover:underline"
                >
                  View all
                </Link>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
                {notifications?.data?.slice(0, 5).map((n) => (
                  <div
                    key={n.id}
                    className={cn(
                      'px-4 py-3 hover:bg-gray-50',
                      !n.isRead && 'bg-cgs-sage/5'
                    )}
                  >
                    <p className={cn('text-sm', !n.isRead && 'font-semibold text-cgs-forest')}>
                      {n.title}
                    </p>
                    <p className="mt-0.5 text-xs text-gray-500">{formatRelativeTime(n.createdAt)}</p>
                  </div>
                ))}
                {!notifications?.data?.length && (
                  <p className="py-8 text-center text-sm text-gray-400">You're all caught up! ✓</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* User menu */}
      <div className="relative">
        <button
          onClick={() => { setUserOpen(!userOpen); setNotifOpen(false); }}
          className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-cgs-forest hover:bg-cgs-mist/50"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cgs-moss text-white font-semibold text-sm">
            {user?.firstName?.[0] ?? user?.email?.[0]?.toUpperCase() ?? 'U'}
          </div>
          <span className="hidden font-medium md:block">
            {user?.firstName ?? user?.email?.split('@')[0]}
          </span>
          <ChevronDown size={14} className="text-gray-400" />
        </button>

        <AnimatePresence>
          {userOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 w-52 rounded-xl bg-white shadow-xl ring-1 ring-black/5 overflow-hidden"
            >
              <div className="border-b border-gray-100 px-4 py-3">
                <p className="font-medium text-cgs-forest">{user?.firstName} {user?.lastName}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <div className="py-1">
                <Link
                  to={ROUTES.SETTINGS.PROFILE}
                  onClick={() => setUserOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <User size={15} /> Profile
                </Link>
                <Link
                  to={ROUTES.SETTINGS.ORGANIZATION}
                  onClick={() => setUserOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Settings size={15} /> Settings
                </Link>
                <button
                  onClick={() => logoutMutation.mutate()}
                  className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-red-500 hover:bg-red-50"
                >
                  <LogOut size={15} /> Sign Out
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
