// Authentication Store using Zustand

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from '@/services/api/auth.api';
import { STORAGE_KEYS } from '@/constants/config';
import type { User, LoginCredentials, RegisterData } from '@/types';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  clearError: () => void;
  setUser: (user: User) => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });
        try {
          // Demo mode: Check for demo credentials
          if (credentials.email === 'demo@fintwin.ai' || credentials.email === 'admin@fintwin.ai') {
            // Simulate API delay
            await new Promise((resolve) => setTimeout(resolve, 500));

            const demoUser: User = {
              id: 'demo-user-1',
              email: credentials.email,
              firstName: 'Demo',
              lastName: 'User',
              role:
                credentials.email === 'admin@fintwin.ai' ? ('admin' as any) : ('analyst' as any),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };

            const demoToken = 'demo-token-' + Date.now();

            localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, demoToken);
            localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, demoToken);

            console.log('[AuthStore] Demo login successful:', {
              email: demoUser.email,
              token: demoToken,
              tokenStored: !!localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN),
            });

            set({
              user: demoUser,
              accessToken: demoToken,
              refreshToken: demoToken,
              isAuthenticated: true,
              isLoading: false,
            });
            return;
          }

          // Real API call
          const response = await authApi.login(credentials);

          // Store tokens
          localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.accessToken);
          localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.refreshToken);

          set({
            user: response.user,
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: any) {
          set({
            error: error.error?.message || 'Login failed',
            isLoading: false,
          });
          throw error;
        }
      },

      register: async (data: RegisterData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authApi.register(data);

          // Store tokens
          localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.accessToken);
          localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.refreshToken);

          set({
            user: response.user,
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: any) {
          set({
            error: error.error?.message || 'Registration failed',
            isLoading: false,
          });
          throw error;
        }
      },

      logout: async () => {
        try {
          // Only call API logout if not in demo mode
          const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
          if (token && !token.startsWith('demo-token-')) {
            await authApi.logout();
          }
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          // Clear ALL localStorage items related to the app
          localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
          localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
          localStorage.removeItem(STORAGE_KEYS.USER);
          localStorage.removeItem(STORAGE_KEYS.THEME);
          localStorage.removeItem(STORAGE_KEYS.RECENT_SCENARIOS);
          localStorage.removeItem(STORAGE_KEYS.RECENT_PORTFOLIOS);

          // Clear any journey-related data
          localStorage.removeItem('journey-storage');

          console.log('[AuthStore] Logout complete, all state cleared');

          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            error: null,
          });
        }
      },

      refreshUser: async () => {
        set({ isLoading: true });
        try {
          const user = await authApi.getCurrentUser();
          set({ user, isLoading: false });
        } catch (error: any) {
          set({
            error: error.error?.message || 'Failed to refresh user',
            isLoading: false,
          });
          // If refresh fails, logout
          get().logout();
        }
      },

      clearError: () => set({ error: null }),

      setUser: (user: User) => set({ user }),
    }),
    {
      name: STORAGE_KEYS.USER,
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Selectors
export const selectUser = (state: AuthStore) => state.user;
export const selectIsAuthenticated = (state: AuthStore) => state.isAuthenticated;
export const selectIsLoading = (state: AuthStore) => state.isLoading;
export const selectError = (state: AuthStore) => state.error;

// Made with Bob
