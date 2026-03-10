// src/store/auth.store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types/auth.types';
import { tokenService } from '@/lib/auth/token.service';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      setUser: (user) => set({ user, isAuthenticated: true, isLoading: false }),
      setLoading: (isLoading) => set({ isLoading }),
      logout: () => {
        tokenService.clearTokens();
        set({ user: null, isAuthenticated: false, isLoading: false });
      },
    }),
    {
      name: 'cgs-auth',
      partialize: (state) => ({ user: state.user }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Restore isAuthenticated from persisted user
          if (state.user && tokenService.getAccessToken()) {
            state.isAuthenticated = true;
          }
          state.isLoading = false;
        }
      },
    }
  )
);
