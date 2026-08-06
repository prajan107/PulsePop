import { useQuery } from '@tanstack/react-query';
import { authService } from '../services/authService';
import { useAuthStore } from '../store/authStore';

export const useCurrentUser = () => {
  const { isAuthenticated, setUser } = useAuthStore();

  const query = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const user = await authService.getCurrentUser();
      setUser(user);
      return user;
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5, // 5 mins
  });

  return {
    user: query.data || useAuthStore.getState().user,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};
