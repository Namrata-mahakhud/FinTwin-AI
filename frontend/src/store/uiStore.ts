// UI State Store using Zustand

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STORAGE_KEYS } from '@/constants/config';
import type { NotificationItem, NotificationType } from '@/types';

interface UIState {
  sidebarCollapsed: boolean;
  theme: 'light' | 'dark';
  notifications: NotificationItem[];
  activeModal: string | null;
  isLoading: boolean;
  loadingMessage: string | null;
}

interface UIActions {
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  addNotification: (notification: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => void;
  removeNotification: (id: string) => void;
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;
  openModal: (modalId: string) => void;
  closeModal: () => void;
  setLoading: (isLoading: boolean, message?: string) => void;
}

type UIStore = UIState & UIActions;

export const useUIStore = create<UIStore>()(
  persist(
    (set, get) => ({
      // Initial state
      sidebarCollapsed: false,
      theme: 'dark', // Default to dark theme
      notifications: [],
      activeModal: null,
      isLoading: false,
      loadingMessage: null,

      // Actions
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

      setSidebarCollapsed: (collapsed: boolean) => set({ sidebarCollapsed: collapsed }),

      setTheme: (theme: 'light' | 'dark') => {
        console.log('🎨 Setting theme to:', theme);
        set({ theme });
        // Apply theme to document
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
          console.log('✅ Dark class added to document');
        } else {
          document.documentElement.classList.remove('dark');
          console.log('✅ Dark class removed from document');
        }
      },

      toggleTheme: () => {
        const currentTheme = get().theme;
        console.log('🔄 Toggling theme from:', currentTheme);
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        console.log('🔄 New theme will be:', newTheme);
        get().setTheme(newTheme);
      },

      addNotification: (notification) => {
        const newNotification: NotificationItem = {
          ...notification,
          id: `notif-${Date.now()}-${Math.random()}`,
          timestamp: new Date().toISOString(),
          read: false,
        };
        set((state) => ({
          notifications: [newNotification, ...state.notifications],
        }));
      },

      removeNotification: (id: string) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        })),

      markNotificationAsRead: (id: string) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        })),

      clearNotifications: () => set({ notifications: [] }),

      openModal: (modalId: string) => set({ activeModal: modalId }),

      closeModal: () => set({ activeModal: null }),

      setLoading: (isLoading: boolean, message?: string) =>
        set({ isLoading, loadingMessage: message || null }),
    }),
    {
      name: 'fintwin-ui-store', // Use a dedicated key for UI store
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        theme: state.theme,
      }),
      onRehydrateStorage: () => (state) => {
        // Apply theme immediately after rehydration
        console.log('🎨 Theme rehydrated:', state?.theme);
        if (state) {
          if (state.theme === 'dark') {
            document.documentElement.classList.add('dark');
            console.log('✅ Dark mode applied');
          } else {
            document.documentElement.classList.remove('dark');
            console.log('✅ Light mode applied');
          }
        }
      },
    }
  )
);

// Helper function to show toast notifications
export const showToast = (
  type: NotificationType,
  title: string,
  message: string
) => {
  useUIStore.getState().addNotification({
    type,
    title,
    message,
  });
};

// Selectors
export const selectSidebarCollapsed = (state: UIStore) => state.sidebarCollapsed;
export const selectTheme = (state: UIStore) => state.theme;
export const selectNotifications = (state: UIStore) => state.notifications;
export const selectUnreadNotifications = (state: UIStore) =>
  state.notifications.filter((n) => !n.read);
export const selectActiveModal = (state: UIStore) => state.activeModal;
export const selectIsLoading = (state: UIStore) => state.isLoading;

// Made with Bob
