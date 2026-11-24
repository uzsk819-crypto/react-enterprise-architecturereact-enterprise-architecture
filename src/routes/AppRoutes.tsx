import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTE_PATHS } from './routePaths';
import { ProtectedRoute } from './ProtectedRoute';
import { AppLayout } from '../components/layouts/AppLayout';
import { AuthLayout } from '../components/layouts/AuthLayout';
import { LoadingFallback } from '../components/common/LoadingFallback';

// Lazy-loaded pages for optimized bundle splitting & performance
const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const DashboardPage = lazy(() => import('../pages/dashboard/DashboardPage'));
const UsersPage = lazy(() => import('../pages/users/UsersPage'));
const SettingsPage = lazy(() => import('../pages/settings/SettingsPage'));
const NotFoundPage = lazy(() => import('../pages/error/NotFoundPage'));
const UnauthorizedPage = lazy(() => import('../pages/error/UnauthorizedPage'));

export const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<LoadingFallback message="Loading application..." />}>
      <Routes>
        {/* Public Routes with AuthLayout */}
        <Route element={<AuthLayout />}>
          <Route path={ROUTE_PATHS.LOGIN} element={<LoginPage />} />
        </Route>

        {/* Protected Application Routes with AppLayout */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          {/* Default redirect to Dashboard */}
          <Route index element={<Navigate to={ROUTE_PATHS.DASHBOARD} replace />} />
          <Route path={ROUTE_PATHS.DASHBOARD} element={<DashboardPage />} />

          {/* Users management with granular permission guard */}
          <Route
            path={ROUTE_PATHS.USERS}
            element={
              <ProtectedRoute requiredPermission="users:read">
                <UsersPage />
              </ProtectedRoute>
            }
          />

          {/* Settings page */}
          <Route path={ROUTE_PATHS.SETTINGS} element={<SettingsPage />} />
        </Route>

        {/* Error Pages */}
        <Route path={ROUTE_PATHS.UNAUTHORIZED} element={<UnauthorizedPage />} />
        <Route path={ROUTE_PATHS.NOT_FOUND} element={<NotFoundPage />} />

        {/* Fallthrough Wildcard to 404 */}
        <Route path="*" element={<Navigate to={ROUTE_PATHS.NOT_FOUND} replace />} />
      </Routes>
    </Suspense>
  );
};
