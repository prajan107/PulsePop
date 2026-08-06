import { useAuthStore } from '@/features/auth/store/authStore';

interface ProtectedRouteOptions {
  requireSuperuser?: boolean;
}

export const useProtectedRoute = (options: ProtectedRouteOptions = {}) => {
  const { user, isAuthenticated, initialized, isLoading } = useAuthStore();

  const isUnauthorized = initialized && !isAuthenticated;
  const isForbidden =
    initialized &&
    isAuthenticated &&
    options.requireSuperuser &&
    !user?.is_superuser;

  const isAllowed = initialized && isAuthenticated && !isForbidden;

  return {
    isAllowed,
    isLoading: !initialized || isLoading,
    isUnauthorized,
    isForbidden,
    user,
  };
};
