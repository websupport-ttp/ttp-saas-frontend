/**
 * API Error Handler Integration
 * Provides utilities for handling API errors with notifications and user feedback
 */

import { errorHandler, EnhancedAppError } from './error-handler';
import { ErrorType } from '@/types/api';

export interface ApiErrorHandlerOptions {
  showNotification?: boolean;
  context?: Record<string, any>;
  fallbackMessage?: string;
  onRetry?: () => Promise<any>;
  retryAttempts?: number;
}

export class ApiErrorHandler {
  private notificationHandler?: (error: EnhancedAppError) => void;

  constructor(notificationHandler?: (error: EnhancedAppError) => void) {
    this.notificationHandler = notificationHandler;
  }

  /**
   * Handle API errors with automatic retry and notification
   */
  async handleApiCall<T>(
    apiCall: () => Promise<T>,
    options: ApiErrorHandlerOptions = {}
  ): Promise<T> {
    const {
      showNotification = true,
      context,
      fallbackMessage,
      onRetry,
      retryAttempts = 0
    } = options;

    try {
      return await apiCall();
    } catch (error) {
      const enhancedError = errorHandler.handleError(error, {
        ...context,
        apiCall: apiCall.name || 'anonymous',
        retryAttempt: retryAttempts
      });

      // Show notification if requested
      if (showNotification && this.notificationHandler) {
        this.notificationHandler(enhancedError);
      }

      // Handle automatic retry for retryable errors
      if (enhancedError.retryable && retryAttempts < 3) {
        const delay = this.getRetryDelay(retryAttempts);
        await this.delay(delay);
        
        return this.handleApiCall(apiCall, {
          ...options,
          retryAttempts: retryAttempts + 1
        });
      }

      // Re-throw the enhanced error
      throw enhancedError;
    }
  }

  /**
   * Handle form submission errors with validation feedback
   */
  handleFormError(error: any, context?: Record<string, any>): {
    error: EnhancedAppError;
    fieldErrors: Record<string, string>;
    hasValidationErrors: boolean;
  } {
    const enhancedError = errorHandler.handleError(error, context);
    const validationErrors = errorHandler.getValidationErrors(enhancedError);
    
    // Convert validation errors to field-specific errors
    const fieldErrors: Record<string, string> = {};
    validationErrors.forEach(validationError => {
      fieldErrors[validationError.field] = validationError.message;
    });

    return {
      error: enhancedError,
      fieldErrors,
      hasValidationErrors: validationErrors.length > 0
    };
  }

  /**
   * Handle authentication errors with redirect
   */
  handleAuthError(error: any, context?: Record<string, any>): EnhancedAppError {
    const enhancedError = errorHandler.handleError(error, context);

    // Redirect to login for authentication errors
    if (enhancedError.type === ErrorType.AUTHENTICATION_ERROR) {
      // Clear any stored auth data
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
        
        // Redirect to login page
        setTimeout(() => {
          window.location.href = '/auth/login';
        }, 2000); // Give time for notification to show
      }
    }

    return enhancedError;
  }

  /**
   * Handle payment errors with specific messaging
   */
  handlePaymentError(error: any, context?: Record<string, any>): EnhancedAppError {
    const enhancedError = errorHandler.handleError(error, {
      ...context,
      errorCategory: 'payment'
    });

    // Add payment-specific context
    if (enhancedError.type === ErrorType.PAYMENT_ERROR) {
      enhancedError.context = {
        ...enhancedError.context,
        suggestedActions: [
          'Check your payment details',
          'Try a different payment method',
          'Contact your bank if the issue persists'
        ]
      };
    }

    return enhancedError;
  }

  /**
   * Handle file upload errors
   */
  handleUploadError(error: any, fileName?: string, context?: Record<string, any>): EnhancedAppError {
    const enhancedError = errorHandler.handleError(error, {
      ...context,
      fileName,
      errorCategory: 'upload'
    });

    return enhancedError;
  }

  /**
   * Get retry delay with exponential backoff
   */
  private getRetryDelay(attempt: number): number {
    return Math.min(1000 * Math.pow(2, attempt), 10000); // Max 10 seconds
  }

  /**
   * Delay utility
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Set notification handler
   */
  setNotificationHandler(handler: (error: EnhancedAppError) => void): void {
    this.notificationHandler = handler;
  }
}

// Create default instance
export const apiErrorHandler = new ApiErrorHandler();

// Convenience functions
export const handleApiCall = <T>(
  apiCall: () => Promise<T>,
  options?: ApiErrorHandlerOptions
) => apiErrorHandler.handleApiCall(apiCall, options);

export const handleFormError = (error: any, context?: Record<string, any>) =>
  apiErrorHandler.handleFormError(error, context);

export const handleAuthError = (error: any, context?: Record<string, any>) =>
  apiErrorHandler.handleAuthError(error, context);

export const handlePaymentError = (error: any, context?: Record<string, any>) =>
  apiErrorHandler.handlePaymentError(error, context);

export const handleUploadError = (error: any, fileName?: string, context?: Record<string, any>) =>
  apiErrorHandler.handleUploadError(error, fileName, context);