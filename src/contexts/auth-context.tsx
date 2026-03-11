/**
 * Authentication Context
 * Provides authentication state and methods to React components
 */

'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/auth-service';
import {
  User,
  LoginCredentials,
  RegisterData,
  AuthResponse
} from '@/types/api';

// Authentication Context Type
export interface AuthContextType {
  // State
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;

  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  loginWithGoogle: (googleUser: { googleId: string; email: string; firstName: string; lastName: string; otherNames?: string }) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  clearError: () => void;

  // Utilities
  hasRole: (role: string) => boolean;
  isUserVerified: () => boolean;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider Props
interface AuthProviderProps {
  children: ReactNode;
}

// Authentication Provider Component
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Initialize authentication state
  useEffect(() => {
    initializeAuth();
    
    // Set up periodic auth check (every 5 minutes)
    const authCheckInterval = setInterval(() => {
      if (user) {
        // Silently verify auth is still valid
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/profile`, {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        }).then(response => {
          if (!response.ok) {
            // Auth expired, logout
            handleLogout(false);
          }
        }).catch(() => {
          // Network error, don't logout
        });
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(authCheckInterval);
  }, [user]);

  /**
   * Initialize authentication state from storage
   */
  const initializeAuth = async () => {
    try {
      setIsLoading(true);
      
      // Get current user from localStorage
      const currentUser = authService.getCurrentUser();
      
      if (currentUser) {
        // Since we use HTTP-only cookies, verify auth by making an API call
        try {
          // Try to fetch user profile to verify cookie is still valid
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/profile`, {
            credentials: 'include', // Send cookies
            headers: {
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            // Cookie is valid, user is authenticated
            setUser(currentUser);
          } else {
            // Cookie expired or invalid, clear auth
            await handleLogout(false);
          }
        } catch (error) {
          // Network error or auth failed, clear auth
          console.error('Auth verification failed:', error);
          await handleLogout(false);
        }
      } else {
        // No user data in localStorage
        setUser(null);
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Login user
   */
  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const authResponse: AuthResponse = await authService.login(credentials);
      setUser(authResponse.user);

      // Redirect to dashboard or intended page
      const redirectTo = sessionStorage.getItem('redirectAfterLogin') || '/dashboard';
      sessionStorage.removeItem('redirectAfterLogin');
      router.push(redirectTo);
    } catch (error: any) {
      setError(error.message || 'Login failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Login with Google
   */
  const loginWithGoogle = async (googleUser: { 
    googleId: string; 
    email: string; 
    firstName: string; 
    lastName: string; 
    otherNames?: string 
  }): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const authResponse: AuthResponse = await authService.loginWithGoogle(googleUser);
      setUser(authResponse.user);

      // Redirect to dashboard or intended page
      const redirectTo = sessionStorage.getItem('redirectAfterLogin') || '/dashboard';
      sessionStorage.removeItem('redirectAfterLogin');
      router.push(redirectTo);
    } catch (error: any) {
      setError(error.message || 'Google login failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Register new user
   */
  const register = async (userData: RegisterData): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const authResponse: AuthResponse = await authService.register(userData);
      setUser(authResponse.user);

      // Redirect to dashboard or welcome page
      router.push('/dashboard');
    } catch (error: any) {
      setError(error.message || 'Registration failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Logout user
   */
  const logout = async (): Promise<void> => {
    await handleLogout(true);
  };

  /**
   * Handle logout process
   */
  const handleLogout = async (redirectToLogin: boolean = true): Promise<void> => {
    try {
      setIsLoading(true);
      await authService.logout();
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      setUser(null);
      setError(null);
      setIsLoading(false);
      
      if (redirectToLogin) {
        router.push('/login');
      }
    }
  };

  /**
   * Refresh user data
   */
  const refreshUser = async (): Promise<void> => {
    try {
      setIsLoading(true);
      
      // Get updated user data from auth service
      const currentUser = authService.getCurrentUser();
      
      if (currentUser && authService.isAuthenticated()) {
        setUser(currentUser);
      } else {
        await handleLogout(false);
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
      await handleLogout(false);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Clear error state
   */
  const clearError = (): void => {
    setError(null);
  };

  /**
   * Check if user has specific role
   */
  const hasRole = (role: string): boolean => {
    return authService.hasRole(role);
  };

  /**
   * Check if user is verified
   */
  const isUserVerified = (): boolean => {
    return authService.isUserVerified();
  };

  // Context value
  const contextValue: AuthContextType = {
    // State
    user,
    isLoading,
    isAuthenticated: !!user && authService.isAuthenticated(),
    error,

    // Actions
    login,
    loginWithGoogle,
    register,
    logout,
    refreshUser,
    clearError,

    // Utilities
    hasRole,
    isUserVerified,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to use authentication context
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}

/**
 * Hook for authentication loading state
 */
export function useAuthLoading(): boolean {
  const { isLoading } = useAuth();
  return isLoading;
}

/**
 * Hook for authentication status
 */
export function useAuthStatus(): {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
} {
  const { isAuthenticated, user, isLoading } = useAuth();
  return { isAuthenticated, user, isLoading };
}

/**
 * Hook for user data
 */
export function useUser(): User | null {
  const { user } = useAuth();
  return user;
}

/**
 * Hook for authentication actions
 */
export function useAuthActions(): {
  login: (credentials: LoginCredentials) => Promise<void>;
  loginWithGoogle: (googleUser: { googleId: string; email: string; firstName: string; lastName: string; otherNames?: string }) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
} {
  const { login, loginWithGoogle, register, logout, refreshUser } = useAuth();
  return { login, loginWithGoogle, register, logout, refreshUser };
}