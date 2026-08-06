import { useAuthStore } from '../store/authStore';

export const useAuth = () => {
  const {
    user,
    accessToken,
    isAuthenticated,
    isLoading,
    initialized,
    login,
    register,
    logout,
    loadCurrentUser,
  } = useAuthStore();

  return {
    user,
    accessToken,
    isAuthenticated,
    isLoading,
    initialized,
    login,
    register,
    logout,
    loadCurrentUser,
  };
};
