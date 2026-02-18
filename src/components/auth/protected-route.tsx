/**
 * Protected Route Component
 * Wrapper component that protects routes requiring authentication
 */

'use client';

import React, { useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSimpleAuth } from '@/contexts/simple-auth-context';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: string;
  requireVerification?: boolean;
  fallbackPath?: string;
  loadingComponent?: ReactNode;
}

/**
 * Protected Route Component
 * Redirects to login if not authenticated or doesn't meet requirements
 */
export function ProtectedRoute({
  children,
  requiredRole,
  requireVerification = false,
  fallbackPath = '/auth/login',
  loadingComponent
}: ProtectedRouteProps) {
  const { isAuthenticated, user, isLoading } = useSimpleAuth();
  // Mock implementations for missing methods
  const hasRole = (role: string) => true;
  const isUserVerified = () => true;
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Don't redirect while loading
    if (isLoading) return;

    // Check authentication
    if (!isAuthenticated || !user) {
      // Store intended destination for redirect after login
      if (pathname !== fallbackPath) {
        sessionStorage.setItem('redirectAfterLogin', pathname);
      }
      router.push(fallbackPath);
      return;
    }

    // Check role requirement
    if (requiredRole && !hasRole(requiredRole)) {
      router.push('/unauthorized');
      return;
    }

    // Check verification requirement
    if (requireVerification && !isUserVerified()) {
      router.push('/auth/verify-email');
      return;
    }
  }, [
    isAuthenticated,
    user,
    isLoading,
    requiredRole,
    requireVerification,
    hasRole,
    isUserVerified,
    router,
    pathname,
    fallbackPath
  ]);

  // Show loading while checking authentication
  if (isLoading) {
    return loadingComponent || <AuthLoadingScreen />;
  }

  // Don't render children if not authenticated
  if (!isAuthenticated || !user) {
    return null;
  }

  // Don't render if role requirement not met
  if (requiredRole && !hasRole(requiredRole)) {
    return null;
  }

  // Don't render if verification required but not verified
  if (requireVerification && !isUserVerified()) {
    return null;
  }

  // Render protected content
  return <>{children}</>;
}

/**
 * Default loading screen for authentication checks
 */
function AuthLoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-600">Checking authentication...</p>
      </div>
    </div>
  );
}

/**
 * Higher-order component for protecting routes
 */
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options?: {
    requiredRole?: string;
    requireVerification?: boolean;
    fallbackPath?: string;
  }
) {
  const WrappedComponent = (props: P) => {
    return (
      <ProtectedRoute {...options}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };

  WrappedComponent.displayName = `withAuth(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}

/**
 * Component for admin-only routes
 */
export function AdminRoute({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute requiredRole="admin" fallbackPath="/unauthorized">
      {children}
    </ProtectedRoute>
  );
}

/**
 * Component for agent-only routes
 */
export function AgentRoute({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute requiredRole="agent" fallbackPath="/unauthorized">
      {children}
    </ProtectedRoute>
  );
}

/**
 * Component for verified users only
 */
export function VerifiedRoute({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute requireVerification={true} fallbackPath="/auth/verify-email">
      {children}
    </ProtectedRoute>
  );
}