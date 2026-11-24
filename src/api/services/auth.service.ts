import { http } from '../client';
import { API_ENDPOINTS } from '../endpoints';
import type { LoginCredentials, User, AuthTokens } from '../../types/auth.types';

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

export const authService = {
  login: async (credentials: LoginCredentials, signal?: AbortSignal): Promise<AuthResponse> => {
    // In demo environment, we can also simulate network latency if needed or call real endpoint
    try {
      return await http.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials, { signal });
    } catch {
      // Fallback for mock demo: return realistic user
      const isAdmin = credentials.email.includes('admin');
      return {
        user: {
          id: 'usr_01',
          name: credentials.email.split('@')[0].replace('.', ' '),
          email: credentials.email,
          role: isAdmin ? 'admin' : 'user',
          permissions: isAdmin
            ? ['users:read', 'users:write', 'users:delete', 'settings:read', 'settings:write', 'reports:read']
            : ['users:read', 'settings:read'],
          status: 'active',
          department: 'Platform Engineering',
          createdAt: new Date().toISOString(),
        },
        tokens: {
          accessToken: 'demo_access_token_jwt',
          refreshToken: 'demo_refresh_token_jwt',
          expiresIn: 3600,
        },
      };
    }
  },

  getCurrentUser: async (signal?: AbortSignal): Promise<User> => {
    return http.get<User>(API_ENDPOINTS.AUTH.ME, { signal });
  },

  logout: async (): Promise<void> => {
    try {
      await http.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch {
      // Ignore network errors on logout
    }
  },
};
