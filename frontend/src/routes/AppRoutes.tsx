import React, { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { AuthenticatedLayout } from '@/layouts/AuthenticatedLayout';
import { PublicLayout } from '@/layouts/PublicLayout';
import { PageLoader } from '@/components/common/PageLoader';
import { RouteErrorBoundary } from '@/components/common/RouteErrorBoundary';
import { GuestRoute } from './GuestRoute';
import { ProtectedRoute } from './ProtectedRoute';

// Lazy-loaded page components for route-based code splitting
const LoginPage = lazy(() =>
  import('@/pages/Login/LoginPage').then((m) => ({ default: m.LoginPage }))
);
const RegisterPage = lazy(() =>
  import('@/pages/Register/RegisterPage').then((m) => ({ default: m.RegisterPage }))
);
const DashboardPage = lazy(() =>
  import('@/pages/Dashboard/DashboardPage').then((m) => ({ default: m.DashboardPage }))
);
const TrendsPage = lazy(() =>
  import('@/pages/Trends/TrendsPage').then((m) => ({ default: m.TrendsPage }))
);
const TrendDetailPage = lazy(() =>
  import('@/pages/Trends/TrendDetailPage').then((m) => ({ default: m.TrendDetailPage }))
);
const AnalyticsPage = lazy(() =>
  import('@/pages/Analytics/AnalyticsPage').then((m) => ({ default: m.AnalyticsPage }))
);
const MonitoringPage = lazy(() =>
  import('@/pages/Monitoring/MonitoringPage').then((m) => ({ default: m.MonitoringPage }))
);
const ProfilePage = lazy(() =>
  import('@/pages/Profile/ProfilePage').then((m) => ({ default: m.ProfilePage }))
);
const UnauthorizedPage = lazy(() =>
  import('@/pages/Error/UnauthorizedPage').then((m) => ({ default: m.UnauthorizedPage }))
);
const ForbiddenPage = lazy(() =>
  import('@/pages/Error/ForbiddenPage').then((m) => ({ default: m.ForbiddenPage }))
);
const ServerErrorPage = lazy(() =>
  import('@/pages/Error/ServerErrorPage').then((m) => ({ default: m.ServerErrorPage }))
);
const NotFoundPage = lazy(() =>
  import('@/pages/Error/NotFoundPage').then((m) => ({ default: m.NotFoundPage }))
);

export const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public Guest Routes (Login, Register) */}
        <Route element={<PublicLayout />}>
          <Route element={<GuestRoute />}>
            <Route
              path="/login"
              element={
                <RouteErrorBoundary routeName="Login">
                  <LoginPage />
                </RouteErrorBoundary>
              }
            />
            <Route
              path="/register"
              element={
                <RouteErrorBoundary routeName="Register">
                  <RegisterPage />
                </RouteErrorBoundary>
              }
            />
          </Route>

          {/* Public Error Pages */}
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="/forbidden" element={<ForbiddenPage />} />
          <Route path="/server-error" element={<ServerErrorPage />} />
        </Route>

        {/* Authenticated Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AuthenticatedLayout />}>
            <Route
              path="/"
              element={
                <RouteErrorBoundary routeName="Dashboard">
                  <DashboardPage />
                </RouteErrorBoundary>
              }
            />
            <Route
              path="/dashboard"
              element={
                <RouteErrorBoundary routeName="Dashboard">
                  <DashboardPage />
                </RouteErrorBoundary>
              }
            />
            <Route
              path="/trends"
              element={
                <RouteErrorBoundary routeName="Trend Explorer">
                  <TrendsPage />
                </RouteErrorBoundary>
              }
            />
            <Route
              path="/trends/:id"
              element={
                <RouteErrorBoundary routeName="Trend Detail">
                  <TrendDetailPage />
                </RouteErrorBoundary>
              }
            />
            <Route
              path="/analytics"
              element={
                <RouteErrorBoundary routeName="Analytics Dashboard">
                  <AnalyticsPage />
                </RouteErrorBoundary>
              }
            />
            <Route
              path="/monitoring"
              element={
                <RouteErrorBoundary routeName="System Monitoring">
                  <MonitoringPage />
                </RouteErrorBoundary>
              }
            />
            <Route
              path="/profile"
              element={
                <RouteErrorBoundary routeName="Profile">
                  <ProfilePage />
                </RouteErrorBoundary>
              }
            />
          </Route>
        </Route>

        {/* Admin Protected Route Example */}
        <Route element={<ProtectedRoute requireSuperuser={true} />}>
          <Route element={<AuthenticatedLayout />}>
            <Route
              path="/admin"
              element={
                <RouteErrorBoundary routeName="Admin Profile">
                  <ProfilePage />
                </RouteErrorBoundary>
              }
            />
          </Route>
        </Route>

        {/* 404 Catch All */}
        <Route element={<PublicLayout />}>
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
};
