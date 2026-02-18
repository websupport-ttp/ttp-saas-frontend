/**
 * Authentication Guard Component
 * Handles automatic token refresh and security monitoring
 */

'use client';

import React, { useEffect, useState, ReactNode } from 'react';
import { useSimpleAuth } from '@/contexts/simple-auth-context';
import { authService } from '@/lib/auth-service';
import { tokenStorage } from '@/lib/token-storage';

interface AuthGuardProps {
  children: ReactNode;
  enableAutoRefresh?: boolean;
  refreshInterval?: number; // in minutes
  enableSecurityMonitoring?: boolean;
}

/**
 * Authentication Guard Component
 * Provides automatic token refresh and security monitoring
 */
export function AuthGuard({
  children,
  enableAutoRefresh = true,
  refreshInterval = 5, // 5 minutes
  enableSecurityMonitoring = true
}: AuthGuardProps) {
  const { isAuthenticated, logout } = useSimpleAuth();
  // Mock implementation for missing method
  const refreshUser = async () => {};
  const [securityIssues, setSecurityIssues] = useState<string[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);

  // Auto-refresh token effect
  useEffect(() => {
    if (!enableAutoRefresh || !isAuthenticated) return;

    const interval = setInterval(async () => {
      try {
        // Check if token needs refresh
        if (tokenStorage.isAccessTokenExpired()) {
          console.log('Token expired, attempting refresh...');
          await authService.ensureValidToken();
          await refreshUser();
        }
      } catch (error) {
        console.error('Auto-refresh failed:', error);
        // Don't logout automatically on refresh failure
        // Let the user continue and handle it on next API call
      }
    }, refreshInterval * 60 * 1000);

    return () => clearInterval(interval);
  }, [isAuthenticated, enableAutoRefresh, refreshInterval, refreshUser]);

  // Security monitoring effect
  useEffect(() => {
    if (!enableSecurityMonitoring) return;

    const checkSecurity = () => {
      try {
        const issues = authService.detectSecurityIssues();
        setSecurityIssues(issues);

        // Log security issues
        if (issues.length > 0) {
          console.warn('Security issues detected:', issues);
        }
      } catch (error) {
        console.error('Security check failed:', error);
      }
    };

    // Initial security check
    checkSecurity();

    // Periodic security checks
    const securityInterval = setInterval(checkSecurity, 30000); // Every 30 seconds

    return () => clearInterval(securityInterval);
  }, [enableSecurityMonitoring]);

  // Token tampering detection effect
  useEffect(() => {
    if (!isAuthenticated) return;

    const checkTokenIntegrity = () => {
      const tokenData = tokenStorage.getTokens();
      
      if (!tokenData && isAuthenticated) {
        console.warn('Token tampering detected - tokens missing but user authenticated');
        logout();
        return;
      }

      // Additional integrity checks can be added here
    };

    // Check token integrity on focus
    const handleFocus = () => {
      checkTokenIntegrity();
    };

    window.addEventListener('focus', handleFocus);
    
    // Initial check
    checkTokenIntegrity();

    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [isAuthenticated, logout]);

  // Storage event listener for cross-tab synchronization
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      // Handle logout in other tabs
      if (event.key === 'user_data' && event.newValue === null) {
        if (isAuthenticated) {
          console.log('Logout detected in another tab');
          logout();
        }
      }

      // Handle token changes in other tabs
      if (event.key?.includes('token') && isAuthenticated) {
        console.log('Token change detected in another tab');
        refreshUser();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [isAuthenticated, logout, refreshUser]);

  // Render security warnings in development
  if (process.env.NODE_ENV === 'development' && securityIssues.length > 0) {
    return (
      <div>
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Security Issues Detected
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <ul className="list-disc list-inside space-y-1">
                  {securityIssues.map((issue, index) => (
                    <li key={index}>{issue}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        {children}
      </div>
    );
  }

  return <>{children}</>;
}

/**
 * Hook for security monitoring
 */
export function useSecurityMonitoring() {
  const [issues, setIssues] = useState<string[]>([]);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  const checkSecurity = () => {
    try {
      const securityIssues = authService.detectSecurityIssues();
      setIssues(securityIssues);
      setLastCheck(new Date());
      return securityIssues;
    } catch (error) {
      console.error('Security check failed:', error);
      return [];
    }
  };

  useEffect(() => {
    // Initial check
    checkSecurity();

    // Periodic checks
    const interval = setInterval(checkSecurity, 60000); // Every minute

    return () => clearInterval(interval);
  }, []);

  return {
    issues,
    lastCheck,
    checkSecurity,
    hasIssues: issues.length > 0
  };
}

/**
 * Hook for token refresh monitoring
 */
export function useTokenRefresh() {
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [refreshCount, setRefreshCount] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshToken = async () => {
    try {
      setIsRefreshing(true);
      const newToken = await authService.ensureValidToken();
      
      if (newToken) {
        setLastRefresh(new Date());
        setRefreshCount(prev => prev + 1);
      }
      
      return newToken;
    } catch (error) {
      console.error('Token refresh failed:', error);
      throw error;
    } finally {
      setIsRefreshing(false);
    }
  };

  return {
    lastRefresh,
    refreshCount,
    isRefreshing,
    refreshToken
  };
}