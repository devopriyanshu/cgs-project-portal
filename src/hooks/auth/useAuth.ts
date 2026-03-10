// src/hooks/auth/useAuth.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import apiClient from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/constants/api-endpoints';
import { QUERY_KEYS } from '@/lib/constants/query-keys';
import { useAuthStore } from '@/store/auth.store';
import { tokenService } from '@/lib/auth/token.service';
import { getErrorMessage, isNormalizedError } from '@/lib/api/error-handler';
import type { User, LoginPayload, RegisterPayload, Session } from '@/types/auth.types';
import type { ApiResponse } from '@/types/api.types';

export function useCurrentUser() {
  const { isAuthenticated, setUser } = useAuthStore();

  return useQuery({
    queryKey: QUERY_KEYS.auth.me(),
    queryFn: async (): Promise<User> => {
      const { data } = await apiClient.get<ApiResponse<User>>(API_ENDPOINTS.AUTH.ME);
      setUser(data.data);
      return data.data;
    },
    enabled: isAuthenticated && !!tokenService.getAccessToken(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useLogin() {
  const { setUser } = useAuthStore();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      // Step 1: Login → get tokens only (backend returns {accessToken, refreshToken, expiresIn})
      const { data } = await apiClient.post<ApiResponse<Session>>(
        API_ENDPOINTS.AUTH.LOGIN,
        payload
      );
      const session = data.data;
      tokenService.setTokens(session.accessToken, session.refreshToken);

      // Step 2: Fetch the full user profile
      const meRes = await apiClient.get<ApiResponse<User>>(API_ENDPOINTS.AUTH.ME);
      return { session, user: meRes.data.data };
    },
    onSuccess: ({ user }) => {
      setUser(user);
      qc.invalidateQueries({ queryKey: QUERY_KEYS.auth.me() });
    },
    onError: (err) => {
      const msg = isNormalizedError(err)
        ? getErrorMessage(err.code, err.message)
        : 'Login failed. Please check your credentials.';
      toast.error(msg);
    },
  });
}

export function useRegister() {
  const { setUser } = useAuthStore();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (payload: RegisterPayload) => {
      // Register → backend returns {user, accessToken, refreshToken, expiresIn}
      const { data } = await apiClient.post<ApiResponse<Session & { user: User }>>(
        API_ENDPOINTS.AUTH.REGISTER,
        payload
      );
      return data.data;
    },
    onSuccess: (data) => {
      // Auto-login after registration
      tokenService.setTokens(data.accessToken, data.refreshToken);
      if (data.user) {
        setUser(data.user);
        qc.invalidateQueries({ queryKey: QUERY_KEYS.auth.me() });
      }
    },
    onError: (err) => {
      const msg = isNormalizedError(err)
        ? getErrorMessage(err.code, err.message)
        : 'Registration failed. Please try again.';
      toast.error(msg);
    },
  });
}

export function useLogout() {
  const { logout } = useAuthStore();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const refreshToken = tokenService.getRefreshToken();
      if (refreshToken) {
        // Backend logout expects {refreshToken} in body
        await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT, { refreshToken }).catch(() => {});
      }
    },
    onSettled: () => {
      tokenService.clearTokens();
      logout();
      qc.clear();
      window.location.href = '/login';
    },
  });
}
