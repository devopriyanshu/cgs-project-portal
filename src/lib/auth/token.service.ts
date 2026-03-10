// src/lib/auth/token.service.ts

const IS_DEV = import.meta.env.DEV;
const ACCESS_TOKEN_KEY = 'cgs_at';
const REFRESH_TOKEN_KEY = 'cgs_rt';

class TokenService {
  private accessToken: string | null = null;

  getAccessToken(): string | null {
    if (IS_DEV) {
      return localStorage.getItem(ACCESS_TOKEN_KEY);
    }
    return this.accessToken;
  }

  getRefreshToken(): string | null {
    if (IS_DEV) {
      return localStorage.getItem(REFRESH_TOKEN_KEY);
    }
    return null; // HttpOnly cookie is sent automatically by browser
  }

  setTokens(accessToken: string, refreshToken?: string): void {
    if (IS_DEV) {
      localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
      if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    } else {
      this.accessToken = accessToken;
    }
  }

  clearTokens(): void {
    this.accessToken = null;
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }

  decodeToken(token: string): {
    sub: string;
    role: string;
    email: string;
    orgId?: string;
    exp: number;
  } | null {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(atob(base64));
      return payload;
    } catch {
      return null;
    }
  }

  isExpired(token: string): boolean {
    const payload = this.decodeToken(token);
    if (!payload) return true;
    return payload.exp * 1000 < Date.now();
  }
}

export const tokenService = new TokenService();
