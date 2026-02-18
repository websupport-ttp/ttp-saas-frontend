'use client';

import { ReactNode } from 'react';
import ErrorBoundary from './ErrorBoundary';
import { useNotificationHelpers } from '@/contexts/notification-context';
import { EnhancedAppError, ErrorSeverity } from '@/lib/error-handler';

interface GlobalErrorBoundaryProps {
  children: ReactNode;
}

export default function GlobalErrorBoundary({ children }: GlobalErrorBoundaryProps) {
  const { showError } = useNotificationHelpers();

  const handleError = (error: Error, errorInfo: any, enhancedError: EnhancedAppError) => {
    // Show toast notification for non-critical errors
    if (enhancedError.severity !== ErrorSeverity.CRITICAL) {
      showError(
        'Application Error',
        enhancedError.userMessage,
        {
          persistent: true,
          actions: [
            {
              label: 'Reload Page',
              action: () => window.location.reload(),
              variant: 'primary'
            }
          ]
        }
      );
    }

    // Log to external monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      // This would integrate with error monitoring services
      console.error('Global Error Boundary:', {
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        enhancedError,
      });
    }
  };

  return (
    <ErrorBoundary
      level="global"
      showDetails={process.env.NODE_ENV === 'development'}
      showSuggestions={true}
      onError={handleError}
    >
      {children}
    </ErrorBoundary>
  );
}