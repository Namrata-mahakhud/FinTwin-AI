// Main App Component

import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { router } from './router';
import { ToastContainer } from './components/common';
import { useToastStore } from './store/toastStore';
import { useUIStore } from './store/uiStore';
import './App.css';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  const { toasts, removeToast } = useToastStore();
  const { theme, setTheme } = useUIStore();

  // Initialize theme on mount
  useEffect(() => {
    console.log('📱 App mounted, current theme:', theme);
    console.log('📱 Document classes:', document.documentElement.className);

    // Apply the stored theme to the document immediately
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      console.log('✅ Applied dark mode in App');
    } else {
      document.documentElement.classList.remove('dark');
      console.log('✅ Applied light mode in App');
    }
  }, [theme]);

  // Initialize theme on first mount only
  useEffect(() => {
    // Check if this is the first time (no stored theme)
    const storedData = localStorage.getItem('fintwin-ui-store');
    console.log('💾 Stored UI data:', storedData);
    if (!storedData) {
      console.log('🆕 First time load, setting dark theme');
      // Default to dark theme on first load
      setTheme('dark');
    }
  }, [setTheme]);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ToastContainer toasts={toasts} onClose={removeToast} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;

// Made with Bob
