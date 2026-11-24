import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { usePermissions } from '../hooks/usePermissions';
import { ROUTE_PATHS } from './routePaths';
import type { Permission, UserRole } from '../types/auth.types';

export interface ProtectedRouteProps {
  children: React.ReactElement;
  requiredRole?: UserRole | UserRole[];
  requiredPermission?: Permission;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  requiredPermission,
}) => {
  const { isAuthenticated } = useAuth();
  const { isRole, can } = usePermissions();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login page while preserving attempted location
    return <Navigate to={ROUTE_PATHS.LOGIN} state={{ from: location }} replace />;
  }

  // Check Role Requirement
  if (requiredRole && !isRole(requiredRole)) {
    return <Navigate to={ROUTE_PATHS.UNAUTHORIZED} replace />;
  }

  // Check Granular Permission Requirement
  if (requiredPermission && !can(requiredPermission)) {
    return <Navigate to={ROUTE_PATHS.UNAUTHORIZED} replace />;
  }

  return children;
};
