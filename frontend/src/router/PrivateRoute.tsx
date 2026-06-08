// Private Route Component for Authentication Guard

import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { ROUTES } from '@/constants/routes';
import { STORAGE_KEYS } from '@/constants/config';
import { UserRole } from '@/types';
import { useEffect, useState } from 'react';

interface PrivateRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole | 'admin' | 'analyst' | 'viewer';
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, requiredRole }) => {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Give the store time to rehydrate from localStorage
    // Increased timeout to ensure proper rehydration
    const timer = setTimeout(() => {
      setIsChecking(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // Check both store state and localStorage for authentication
  // This handles cases where store hasn't rehydrated yet after navigation
  const hasToken = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
  
  // Check if we have a demo token
  const isDemoMode = hasToken?.startsWith('demo-token-');
  
  // User is authenticated if:
  // 1. Store says they are authenticated, OR
  // 2. They have a valid token in localStorage (including demo tokens)
  const isUserAuthenticated = isAuthenticated || !!hasToken;

  // Debug logging
  console.log('[PrivateRoute] Auth check:', {
    isAuthenticated,
    hasToken: !!hasToken,
    isDemoMode,
    isUserAuthenticated,
    location: location.pathname,
    user: user?.email,
    storedUser: storedUser ? 'present' : 'missing',
    isChecking
  });

  // Wait for initial check to complete
  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!isUserAuthenticated) {
    console.log('[PrivateRoute] Not authenticated, redirecting to login');
    // Redirect to login page with return url
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  // In demo mode, skip role checks
  if (isDemoMode) {
    console.log('[PrivateRoute] Demo mode active, allowing access');
    return <>{children}</>;
  }

  // Check if user has required role (only for non-demo users)
  if (requiredRole && user?.role !== requiredRole) {
    console.log('[PrivateRoute] Insufficient role, redirecting to dashboard');
    // Redirect to dashboard if user doesn't have required role
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;

// Made with Bob
