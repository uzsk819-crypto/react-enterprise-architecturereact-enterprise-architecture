import { useAuthStore } from '../store/authStore';
import type { Permission, UserRole } from '../types/auth.types';

export interface UsePermissionsReturn {
  can: (permission: Permission) => boolean;
  canAny: (permissions: Permission[]) => boolean;
  canAll: (permissions: Permission[]) => boolean;
  isRole: (role: UserRole | UserRole[]) => boolean;
  userPermissions: Permission[];
  userRole: UserRole | undefined;
}

/**
 * Dedicated hook for granular Role & Permission validations.
 */
export function usePermissions(): UsePermissionsReturn {
  const user = useAuthStore((state) => state.user);

  const can = (permission: Permission): boolean => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    return user.permissions.includes(permission);
  };

  const canAny = (permissions: Permission[]): boolean => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    return permissions.some((perm) => user.permissions.includes(perm));
  };

  const canAll = (permissions: Permission[]): boolean => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    return permissions.every((perm) => user.permissions.includes(perm));
  };

  const isRole = (role: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    const allowed = Array.isArray(role) ? role : [role];
    return allowed.includes(user.role);
  };

  return {
    can,
    canAny,
    canAll,
    isRole,
    userPermissions: user?.permissions || [],
    userRole: user?.role,
  };
}
