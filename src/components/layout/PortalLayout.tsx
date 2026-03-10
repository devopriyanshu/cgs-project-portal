// src/components/layout/PortalLayout.tsx
import { useEffect } from 'react';
import { Outlet } from '@tanstack/react-router';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { useCurrentUser } from '@/hooks/auth/useAuth';
import { useUiStore } from '@/store/ui.store';
import { cn } from '@/lib/utils/cn';

export function PortalLayout() {
  const { sidebarOpen } = useUiStore();
  useCurrentUser(); // keeps user data fresh

  return (
    <div className="flex h-screen overflow-hidden bg-cgs-cream">
      <Sidebar />
      <div className={cn(
        'flex flex-1 flex-col overflow-hidden transition-all duration-300',
        'lg:ml-0' // sidebar is in flow on desktop via `static` positioning
      )}>
        <Topbar />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
