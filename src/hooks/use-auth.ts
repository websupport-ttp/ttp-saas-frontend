/**
 * Authentication Hooks
 * Custom hooks for authentication-related functionality
 */

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSimpleAuth } from '@/contexts/simple-auth-context';

import { LoginCredentials, RegisterData, User } from '@/types/api';

// Re-export useAuth from context for convenience
export { useSimpleAuth as useAuth } from '@/contexts/simple-auth-context';

/**
 * Hook for login functionality with form state management
 */
export function useLogin() {
  const { login, isLoading } = useSimpleAuth();
  // Mock implementations for missing methods
  const error = null;
  const clearError = () => {};
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = useCallback(async (credentials: LoginCredentials) => {
    try {
      setIsSubmitting(true);
      clearError();
      await login(credentials);
    } catch (error) {
      // Error is handled by the auth context
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, [login, clearError]);

  return {
    login: handleLogin,
    isLoading: isLoading || isSubmitting,
    error,
    clearError
  };
}

/**
 * Hook for registration functionality with form state management
 */
export function useRegister() {
  const { isLoading } = useSimpleAuth();
  // Mock implementations for missing methods
  const register = async (userData: RegisterData) => {};
  const error = null;
  const clearError = () => {};
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = useCallback(async (userData: RegisterData) => {
    try {
      setIsSubmitting(true);
      clearError();
      await register(userData);
    } catch (error) {
      // Error is handled by the auth context
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, [register, clearError]);

  return {
    register: handleRegister,
    isLoading: isLoading || isSubmitting,
    error,
    clearError
  };
}

/**
 * Hook for logout functionality
 */
export function useLogout() {
  const { logout, isLoading } = useSimpleAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = useCallback(async () => {
    try {
      setIsLoggingOut(true);
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  }, [logout]);

  return {
    logout: handleLogout,
    isLoading: isLoading || isLoggingOut
  };
}

/**
 * Hook for authentication status with redirect functionality
 */
export function useAuthRedirect(
  redirectTo: string = '/auth/login',
  requireAuth: boolean = true
) {
  const { isAuthenticated, isLoading } = useSimpleAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (requireAuth && !isAuthenticated) {
        router.push(redirectTo);
      } else if (!requireAuth && isAuthenticated) {
        router.push('/dashboard');
      }
    }
  }, [isAuthenticated, isLoading, requireAuth, redirectTo, router]);

  return { isAuthenticated, isLoading };
}

/**
 * Hook for role-based access control
 */
export function useRoleAccess(requiredRole?: string) {
  const { user, isAuthenticated, isLoading } = useSimpleAuth();
  // Mock implementation for missing method
  const hasRole = (role: string) => true;

  const hasAccess = useCallback(() => {
    if (!isAuthenticated || !user) return false;
    if (!requiredRole) return true;
    return hasRole(requiredRole);
  }, [isAuthenticated, user, requiredRole, hasRole]);

  return {
    hasAccess: hasAccess(),
    user,
    isLoading,
    isAuthenticated
  };
}

/**
 * Hook for user verification status
 */
export function useVerificationStatus() {
  const { user, isLoading } = useSimpleAuth();
  // Mock implementations for missing methods
  const isUserVerified = () => true;
  const refreshUser = async () => {};
  const [isRefreshing, setIsRefreshing] = useState(false);

  const checkVerificationStatus = useCallback(async () => {
    try {
      setIsRefreshing(true);
      await refreshUser();
    } catch (error) {
      console.error('Error checking verification status:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, [refreshUser]);

  return {
    isVerified: isUserVerified(),
    user,
    isLoading: isLoading || isRefreshing,
    checkVerificationStatus
  };
}

/**
 * Hook for authentication persistence
 */
export function useAuthPersistence() {
  const { isAuthenticated, user } = useSimpleAuth();
  // Mock implementation for missing method
  const refreshUser = async () => {};
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (isAuthenticated) {
          await refreshUser();
        }
      } catch (error) {
        console.error('Error initializing auth persistence:', error);
      } finally {
        setIsInitialized(true);
      }
    };

    initializeAuth();
  }, [isAuthenticated, refreshUser]);

  return {
    isInitialized,
    isAuthenticated,
    user
  };
}

/**
 * Hook for session timeout handling
 */
export function useSessionTimeout(timeoutMinutes: number = 30) {
  const { isAuthenticated, logout } = useSimpleAuth();
  const [timeLeft, setTimeLeft] = useState(timeoutMinutes * 60);
  const [isWarningShown, setIsWarningShown] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1;
        
        // Show warning at 5 minutes
        if (newTime === 300 && !isWarningShown) {
          setIsWarningShown(true);
        }
        
        // Auto logout when time expires
        if (newTime <= 0) {
          logout();
          return 0;
        }
        
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isAuthenticated, logout, isWarningShown]);

  const extendSession = useCallback(() => {
    setTimeLeft(timeoutMinutes * 60);
    setIsWarningShown(false);
  }, [timeoutMinutes]);

  return {
    timeLeft,
    isWarningShown,
    extendSession,
    formatTimeLeft: () => {
      const minutes = Math.floor(timeLeft / 60);
      const seconds = timeLeft % 60;
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
  };
}

/**
 * Hook for user profile management
 */
export function useUserProfile() {
  const { user, isLoading } = useSimpleAuth();
  // Mock implementation for missing method
  const refreshUser = async () => {};
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const updateProfile = useCallback(async (profileData: Partial<User>) => {
    try {
      setIsUpdating(true);
      setUpdateError(null);
      
      // This would typically call an API endpoint to update the profile
      // For now, we'll just refresh the user data
      await refreshUser();
    } catch (error: any) {
      setUpdateError(error.message || 'Failed to update profile');
      throw error;
    } finally {
      setIsUpdating(false);
    }
  }, [refreshUser]);

  return {
    user,
    updateProfile,
    isLoading: isLoading || isUpdating,
    error: updateError,
    clearError: () => setUpdateError(null)
  };
}