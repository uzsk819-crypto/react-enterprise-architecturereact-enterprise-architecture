import { useAuthStore } from '../store/authStore';

/**
 * Centralized authentication hook.
 */
export function useAuth() {
  const {
    user,
    tokens,
    isAuthenticated,
    isLoading,
    login,
    logout,
    hasRole,
    hasPermission,
  } = useAuthStore();

  return {
    user,
    tokens,
    isAuthenticated,
    isLoading,
    login,
    logout,
    hasRole,
    hasPermission,
    isAdmin: user?.role === 'admin',
  };
}
