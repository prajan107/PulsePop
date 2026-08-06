import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/store/authStore';
import { Spinner } from '@/components/ui/spinner';

interface ProtectedRouteProps {
  requireSuperuser?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requireSuperuser = false }) => {
  const { user, isAuthenticated, initialized } = useAuthStore();

  if (!initialized) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#0F172A]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireSuperuser && !user?.is_superuser) {
    return <Navigate to="/forbidden" replace />;
  }

  return <Outlet />;
};
