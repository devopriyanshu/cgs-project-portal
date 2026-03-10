// src/lib/api/client.ts
// THE single Axios instance. Import ONLY this for HTTP calls.

import axios, { type AxiosInstance, type InternalAxiosRequestConfig, type AxiosResponse } from 'axios';
import { API_BASE_URL } from '@/lib/constants/app.constants';
import { tokenService } from '@/lib/auth/token.service';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30_000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-Platform': 'cgs-project-portal',
    'X-Portal-Version': import.meta.env.VITE_APP_VERSION ?? '1.0.0',
  },
});

// ─── REQUEST INTERCEPTOR ──────────────────────────────────────────────────────
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenService.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers['X-Request-ID'] = crypto.randomUUID();
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── RESPONSE INTERCEPTOR ─────────────────────────────────────────────────────
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: string) => void;
  reject: (reason: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token!);
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = tokenService.getRefreshToken();
        if (!refreshToken) throw new Error('No refresh token');

        const { data } = await axios.post(`${API_BASE_URL}/api/v1/auth/refresh`, {
          refreshToken,
        });

        tokenService.setTokens(data.data.accessToken, data.data.refreshToken);
        processQueue(null, data.data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        
        // We must also clear zustand state, otherwise GuestRoute will redirect back to /dashboard
        // causing an infinite 401 -> login -> dashboard loop
        import('@/store/auth.store').then(({ useAuthStore }) => {
          useAuthStore.getState().logout();
        }).finally(() => {
          window.location.href = '/login?reason=session_expired';
        });
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Normalize error
    const normalizedError = {
      status: error.response?.status ?? 0,
      code: error.response?.data?.code ?? 'NETWORK_ERROR',
      message:
        error.response?.data?.message ?? error.message ?? 'An unexpected error occurred',
      errors: error.response?.data?.errors ?? [],
      requestId: error.config?.headers?.['X-Request-ID'],
    };

    return Promise.reject(normalizedError);
  }
);

export default apiClient;
