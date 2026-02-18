'use client';

import { useCallback } from 'react';
import { useNotificationHelpers } from '@/contexts/notification-context';
import { errorHandler, EnhancedAppError, ErrorSeverity, shouldShowRetry, getSuggestedActions } from '@/lib/error-handler';

export interface ErrorHandlerOptions {
  showNotification?: boolean;
  showRetry?: boolean;
  context?: Record<string, any>;
  onRetry?: () => void;
  fallbackMessage?: string;
}

export function useErrorHandler() {
  const { showError, showApiError } = useNotificationHelpers();

  const handleError = useCallback((
    error: any, 
    options: ErrorHandlerOptions = {}
  ): EnhancedAppError => {
    const {
      showNotification = true,
      showRetry = true,
      context,
      onRetry,
      fallbackMessage
    } = options;

    // Process error through error handler
    const enhancedError = errorHandler.handleError(error, context);

    // Show notification if requested
    if (showNotification) {
      const actions = [];

      // Add retry action if error is retryable and callback provided
      if (showRetry && shouldShowRetry(enhancedError) && onRetry) {
        actions.push({
          label: 'Retry',
          action: onRetry,
          variant: 'primary' as const
        });
      }

      // Add suggested actions for critical errors
      if (enhancedError.severity === ErrorSeverity.CRITICAL) {
        actions.push({
          label: 'Reload Page',
          action: () => window.location.reload(),
          variant: 'secondary' as const
        });
      }

      showError(
        getErrorTitle(enhancedError),
        enhancedError.userMessage || fallbackMessage || 'An unexpected error occurred',
        {
          duration: getNotificationDuration(enhancedError),
          persistent: enhancedError.severity === ErrorSeverity.CRITICAL,
          actions: actions.length > 0 ? actions : undefined
        }
      );
    }

    return enhancedError;
  }, [showError]);

  const handleApiError = useCallback((
    error: any,
    options: ErrorHandlerOptions = {}
  ): EnhancedAppError => {
    const enhancedError = errorHandler.handleError(error, options.context);

    if (options.showNotification !== false) {
      showApiError(enhancedError, options.fallbackMessage);
    }

    return enhancedError;
  }, [showApiError]);

  const handleValidationError = useCallback((
    error: any,
    options: ErrorHandlerOptions = {}
  ): { error: EnhancedAppError; validationErrors: Array<{ field: string; message: string }> } => {
    const enhancedError = errorHandler.handleError(error, options.context);
    const validationErrors = errorHandler.getValidationErrors(enhancedError);

    if (options.showNotification !== false && validationErrors.length > 0) {
      const errorMessages = validationErrors.map(err => `${err.field}: ${err.message}`).join(', ');
      showError(
        'Validation Error',
        `Please check the following fields: ${errorMessages}`,
        { duration: 10000 }
      );
    }

    return { error: enhancedError, validationErrors };
  }, [showError]);

  const handleNetworkError = useCallback((
    error: any,
    options: ErrorHandlerOptions = {}
  ): EnhancedAppError => {
    const enhancedError = errorHandler.handleError(error, options.context);

    if (options.showNotification !== false) {
      showError(
        'Connection Error',
        enhancedError.userMessage,
        {
          persistent: true,
          actions: [
            {
              label: 'Retry',
              action: options.onRetry || (() => window.location.reload()),
              variant: 'primary'
            }
          ]
        }
      );
    }

    return enhancedError;
  }, [showError]);

  const clearErrors = useCallback(() => {
    errorHandler.clearErrorLog();
  }, []);

  const getRecentErrors = useCallback((limit?: number) => {
    return errorHandler.getRecentErrors(limit);
  }, []);

  return {
    handleError,
    handleApiError,
    handleValidationError,
    handleNetworkError,
    clearErrors,
    getRecentErrors,
    shouldShowRetry,
    getSuggestedActions
  };
}

// Helper functions
function getErrorTitle(error: EnhancedAppError): string {
  switch (error.severity) {
    case ErrorSeverity.CRITICAL:
      return 'Critical Error';
    case ErrorSeverity.HIGH:
      return 'Error';
    case ErrorSeverity.MEDIUM:
      return 'Warning';
    case ErrorSeverity.LOW:
      return 'Notice';
    default:
      return 'Error';
  }
}

function getNotificationDuration(error: EnhancedAppError): number {
  switch (error.severity) {
    case ErrorSeverity.CRITICAL:
      return 0; // Persistent
    case ErrorSeverity.HIGH:
      return 10000; // 10 seconds
    case ErrorSeverity.MEDIUM:
      return 8000; // 8 seconds
    case ErrorSeverity.LOW:
      return 5000; // 5 seconds
    default:
      return 8000;
  }
}