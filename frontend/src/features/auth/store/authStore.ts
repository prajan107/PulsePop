import { create } from 'zustand';
import { TOKEN_STORAGE_KEY } from '@/api/axios';
import { authService } from '../services/authService';
import { AuthState, LoginCredentials, RegisterCredentials, User } from '../types';

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: localStorage.getItem(TOKEN_STORAGE_KEY),
  isAuthenticated: !!localStorage.getItem(TOKEN_STORAGE_KEY),
  isLoading: false,
  initialized: false,

  login: async (credentials: LoginCredentials) => {
    set({ isLoading: true });
    try {
      const response = await authService.login(credentials);
      const token = response.access_token;
      localStorage.setItem(TOKEN_STORAGE_KEY, token);

      set({
        accessToken: token,
        isAuthenticated: true,
      });

      const user = await authService.getCurrentUser();
      set({
        user,
        isLoading: false,
        initialized: true,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  register: async (credentials: RegisterCredentials) => {
    set({ isLoading: true });
    try {
      await authService.register(credentials);
      // Auto login after registration
      await get().login({
        email: credentials.email,
        password: credentials.password,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
      initialized: true,
    });
  },

  loadCurrentUser: async () => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!token) {
      set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        isLoading: false,
        initialized: true,
      });
      return;
    }

    set({ isLoading: true });
    try {
      const user = await authService.getCurrentUser();
      set({
        user,
        accessToken: token,
        isAuthenticated: true,
        isLoading: false,
        initialized: true,
      });
    } catch {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        isLoading: false,
        initialized: true,
      });
    }
  },

  setUser: (user: User | null) => {
    set({ user });
  },
}));
