import React, { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { loadCurrentUser, logout } = useAuthStore();

  useEffect(() => {
    loadCurrentUser();

    const handleUnauthorized = () => {
      logout();
    };

    window.addEventListener('pulsepop:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('pulsepop:unauthorized', handleUnauthorized);
    };
  }, [loadCurrentUser, logout]);

  return <>{children}</>;
};
