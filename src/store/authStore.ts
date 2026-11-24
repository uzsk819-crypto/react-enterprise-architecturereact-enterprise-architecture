import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, AuthTokens, LoginCredentials, Permission, UserRole } from '../types/auth.types';

interface AuthStoreState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<User>;
  logout: () => void;
  setUser: (user: User | null) => void;
  setTokens: (tokens: AuthTokens | null) => void;
  hasPermission: (permission: Permission) => boolean;
  hasRole: (role: UserRole | UserRole[]) => boolean;
}

export const useAuthStore = create<AuthStoreState>()(
  persist(
    (set, get) => ({
      user: {
        id: 'usr_admin_01',
        name: 'Alex Morgan',
        email: 'alex.morgan@enterprise.io',
        role: 'admin',
        permissions: [
          'users:read',
          'users:write',
          'users:delete',
          'settings:read',
          'settings:write',
          'reports:read',
        ],
        department: 'Architecture & Platform',
        status: 'active',
        createdAt: '2024-01-15T08:00:00Z',
      },
      tokens: {
        accessToken: 'mock_jwt_access_token_super_secret',
        refreshToken: 'mock_jwt_refresh_token',
        expiresIn: 3600,
      },
      isAuthenticated: true,
      isLoading: false,

      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true });
        try {
          // Simulated enterprise auth response
          await new Promise((res) => setTimeout(res, 500));

          const isAdmin = credentials.email.includes('admin');
          const mockUser: User = {
            id: `usr_${Date.now()}`,
            name: credentials.email.split('@')[0].replace('.', ' '),
            email: credentials.email,
            role: isAdmin ? 'admin' : 'user',
            permissions: isAdmin
              ? ['users:read', 'users:write', 'users:delete', 'settings:read', 'settings:write', 'reports:read']
              : ['users:read', 'settings:read'],
            department: 'Engineering',
            status: 'active',
            createdAt: new Date().toISOString(),
          };

          const mockTokens: AuthTokens = {
            accessToken: `jwt_${Date.now()}_token`,
            refreshToken: `refresh_${Date.now()}_token`,
            expiresIn: 7200,
          };

          set({
            user: mockUser,
            tokens: mockTokens,
            isAuthenticated: true,
            isLoading: false,
          });

          return mockUser;
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          tokens: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setTokens: (tokens) => set({ tokens }),

      hasPermission: (permission: Permission): boolean => {
        const { user } = get();
        if (!user) return false;
        if (user.role === 'admin') return true;
        return user.permissions.includes(permission);
      },

      hasRole: (roles: UserRole | UserRole[]): boolean => {
        const { user } = get();
        if (!user) return false;
        const allowedRoles = Array.isArray(roles) ? roles : [roles];
        return allowedRoles.includes(user.role);
      },
    }),
    {
      name: 'app-auth-storage',
      partialize: (state) => ({
        user: state.user,
        tokens: state.tokens,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
