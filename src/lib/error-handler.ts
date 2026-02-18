/**
 * Comprehensive Error Handler
 * Provides centralized error handling with user-friendly messages, logging, and notifications
 */

import { AxiosError } from 'axios';
import { AppError, ErrorType, ValidationError } from '@/types/api';

// Error message mappings for user-friendly display
const ERROR_MESSAGES: Record<ErrorType, string> = {
  [ErrorType.NETWORK_ERROR]: 'Unable to connect to our servers. Please check your internet connection and try again.',
  [ErrorType.AUTHENTICATION_ERROR]: 'Your session has expired. Please log in again to continue.',
  [ErrorType.VALIDATION_ERROR]: 'Please check the information you entered and try again.',
  [ErrorType.PAYMENT_ERROR]: 'There was an issue processing your payment. Please try again or use a different payment method.',
  [ErrorType.SERVER_ERROR]: 'We\'re experiencing technical difficulties. Please try again in a few moments.',
  [ErrorType.NOT_FOUND]: 'The requested information could not be found. It may have been moved or deleted.',
  [ErrorType.RATE_LIMIT]: 'You\'re making requests too quickly. Please wait a moment before trying again.',
  [ErrorType.TIMEOUT_ERROR]: 'The request is taking longer than expected. Please try again.',
};

// Specific error code mappings for more detailed messages
const SPECIFIC_ERROR_MESSAGES: Record<string, string> = {
  // Authentication errors
  'INVALID_CREDENTIALS': 'The email or password you entered is incorrect. Please try again.',
  'ACCOUNT_LOCKED': 'Your account has been temporarily locked due to multiple failed login attempts.',
  'EMAIL_NOT_VERIFIED': 'Please verify your email address before logging in.',
  'PASSWORD_EXPIRED': 'Your password has expired. Please reset your password to continue.',
  
  // Payment errors
  'CARD_DECLINED': 'Your card was declined. Please check your card details or try a different payment method.',
  'INSUFFICIENT_FUNDS': 'Your card has insufficient funds for this transaction.',
  'CARD_EXPIRED': 'Your card has expired. Please use a different payment method.',
  'PAYMENT_TIMEOUT': 'The payment process timed out. Please try again.',
  
  // Booking errors
  'FLIGHT_UNAVAILABLE': 'The selected flight is no longer available. Please choose a different flight.',
  'HOTEL_UNAVAILABLE': 'The selected hotel room is no longer available. Please choose different dates or room.',
  'VISA_PROCESSING_ERROR': 'There was an error processing your visa assistance request. Please contact support.',
  'INSURANCE_QUOTE_EXPIRED': 'Your insurance quote has expired. Please request a new quote.',
  
  // File upload errors
  'FILE_TOO_LARGE': 'The file you selected is too large. Please choose a file smaller than 10MB.',
  'INVALID_FILE_TYPE': 'The file type is not supported. Please upload a PDF, JPG, or PNG file.',
  'UPLOAD_FAILED': 'Failed to upload the file. Please try again.',
  
  // General errors
  'MAINTENANCE_MODE': 'Our system is currently undergoing maintenance. Please try again later.',
  'FEATURE_DISABLED': 'This feature is temporarily unavailable. Please try again later.',
};

// Error severity levels
export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

// Enhanced error interface with additional metadata
export interface EnhancedAppError extends AppError {
  severity: ErrorSeverity;
  userMessage: string;
  technicalMessage: string;
  timestamp: string;
  requestId?: string;
  userId?: string;
  context?: Record<string, any>;
  retryable: boolean;
  actionable: boolean;
}

class ErrorHandler {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private errorLog: EnhancedAppError[] = [];

  /**
   * Transform any error into a standardized AppError
   */
  public handleError(error: any, context?: Record<string, any>): EnhancedAppError {
    let appError: EnhancedAppError;

    if (this.isAxiosError(error)) {
      appError = this.handleAxiosError(error, context);
    } else if (this.isAppError(error)) {
      appError = this.enhanceAppError(error, context);
    } else if (error instanceof Error) {
      appError = this.handleGenericError(error, context);
    } else {
      appError = this.handleUnknownError(error, context);
    }

    // Log the error
    this.logError(appError);

    return appError;
  }

  /**
   * Handle Axios HTTP errors
   */
  private handleAxiosError(error: AxiosError, context?: Record<string, any>): EnhancedAppError {
    const response = error.response;
    const request = error.request;

    // Network error (no response received)
    if (!response && request) {
      return this.createEnhancedError({
        type: ErrorType.NETWORK_ERROR,
        message: 'Network error occurred',
        statusCode: 0,
      }, context, {
        severity: ErrorSeverity.HIGH,
        retryable: true,
        actionable: true,
      });
    }

    // Request timeout
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      return this.createEnhancedError({
        type: ErrorType.TIMEOUT_ERROR,
        message: 'Request timeout',
        statusCode: 408,
      }, context, {
        severity: ErrorSeverity.MEDIUM,
        retryable: true,
        actionable: true,
      });
    }

    // HTTP response errors
    if (response) {
      const { status, data } = response;
      const responseData = data as any;

      switch (status) {
        case 400:
          return this.createEnhancedError({
            type: ErrorType.VALIDATION_ERROR,
            message: responseData?.message || 'Validation error',
            details: responseData?.errors,
            code: responseData?.code,
            statusCode: status,
          }, context, {
            severity: ErrorSeverity.LOW,
            retryable: false,
            actionable: true,
          });

        case 401:
          return this.createEnhancedError({
            type: ErrorType.AUTHENTICATION_ERROR,
            message: responseData?.message || 'Authentication required',
            code: responseData?.code,
            statusCode: status,
          }, context, {
            severity: ErrorSeverity.HIGH,
            retryable: false,
            actionable: true,
          });

        case 403:
          return this.createEnhancedError({
            type: ErrorType.AUTHENTICATION_ERROR,
            message: responseData?.message || 'Access forbidden',
            code: responseData?.code,
            statusCode: status,
          }, context, {
            severity: ErrorSeverity.HIGH,
            retryable: false,
            actionable: false,
          });

        case 404:
          return this.createEnhancedError({
            type: ErrorType.NOT_FOUND,
            message: responseData?.message || 'Resource not found',
            code: responseData?.code,
            statusCode: status,
          }, context, {
            severity: ErrorSeverity.MEDIUM,
            retryable: false,
            actionable: true,
          });

        case 429:
          return this.createEnhancedError({
            type: ErrorType.RATE_LIMIT,
            message: responseData?.message || 'Rate limit exceeded',
            code: responseData?.code,
            statusCode: status,
          }, context, {
            severity: ErrorSeverity.MEDIUM,
            retryable: true,
            actionable: true,
          });

        case 500:
        case 502:
        case 503:
        case 504:
          return this.createEnhancedError({
            type: ErrorType.SERVER_ERROR,
            message: responseData?.message || 'Server error',
            code: responseData?.code,
            statusCode: status,
          }, context, {
            severity: status >= 503 ? ErrorSeverity.CRITICAL : ErrorSeverity.HIGH,
            retryable: true,
            actionable: false,
          });

        default:
          return this.createEnhancedError({
            type: ErrorType.SERVER_ERROR,
            message: responseData?.message || 'Unknown server error',
            code: responseData?.code,
            statusCode: status,
          }, context, {
            severity: ErrorSeverity.MEDIUM,
            retryable: false,
            actionable: false,
          });
      }
    }

    // Fallback for other axios errors
    return this.createEnhancedError({
      type: ErrorType.NETWORK_ERROR,
      message: error.message || 'Network error',
    }, context, {
      severity: ErrorSeverity.MEDIUM,
      retryable: true,
      actionable: true,
    });
  }

  /**
   * Enhance existing AppError with additional metadata
   */
  private enhanceAppError(error: AppError, context?: Record<string, any>): EnhancedAppError {
    return this.createEnhancedError(error, context, {
      severity: this.determineSeverity(error),
      retryable: this.isRetryable(error),
      actionable: this.isActionable(error),
    });
  }

  /**
   * Handle generic JavaScript errors
   */
  private handleGenericError(error: Error, context?: Record<string, any>): EnhancedAppError {
    return this.createEnhancedError({
      type: ErrorType.SERVER_ERROR,
      message: error.message || 'An unexpected error occurred',
      details: {
        name: error.name,
        stack: error.stack,
      },
    }, context, {
      severity: ErrorSeverity.HIGH,
      retryable: false,
      actionable: false,
    });
  }

  /**
   * Handle unknown error types
   */
  private handleUnknownError(error: any, context?: Record<string, any>): EnhancedAppError {
    return this.createEnhancedError({
      type: ErrorType.SERVER_ERROR,
      message: 'An unknown error occurred',
      details: error,
    }, context, {
      severity: ErrorSeverity.MEDIUM,
      retryable: false,
      actionable: false,
    });
  }

  /**
   * Create enhanced error with user-friendly messages
   */
  private createEnhancedError(
    baseError: AppError,
    context?: Record<string, any>,
    metadata?: {
      severity: ErrorSeverity;
      retryable: boolean;
      actionable: boolean;
    }
  ): EnhancedAppError {
    const userMessage = this.getUserFriendlyMessage(baseError);
    const technicalMessage = baseError.message;

    return {
      ...baseError,
      severity: metadata?.severity || ErrorSeverity.MEDIUM,
      userMessage,
      technicalMessage,
      timestamp: new Date().toISOString(),
      requestId: this.extractRequestId(context),
      userId: this.extractUserId(context),
      context,
      retryable: metadata?.retryable || false,
      actionable: metadata?.actionable || false,
    };
  }

  /**
   * Get user-friendly error message
   */
  private getUserFriendlyMessage(error: AppError): string {
    // Check for specific error code first
    if (error.code && SPECIFIC_ERROR_MESSAGES[error.code]) {
      return SPECIFIC_ERROR_MESSAGES[error.code];
    }

    // Fall back to general error type message
    return ERROR_MESSAGES[error.type] || 'An unexpected error occurred. Please try again.';
  }

  /**
   * Determine error severity based on type and status code
   */
  private determineSeverity(error: AppError): ErrorSeverity {
    switch (error.type) {
      case ErrorType.AUTHENTICATION_ERROR:
        return ErrorSeverity.HIGH;
      case ErrorType.PAYMENT_ERROR:
        return ErrorSeverity.HIGH;
      case ErrorType.SERVER_ERROR:
        return error.statusCode && error.statusCode >= 503 ? ErrorSeverity.CRITICAL : ErrorSeverity.HIGH;
      case ErrorType.NETWORK_ERROR:
      case ErrorType.TIMEOUT_ERROR:
        return ErrorSeverity.MEDIUM;
      case ErrorType.VALIDATION_ERROR:
      case ErrorType.NOT_FOUND:
        return ErrorSeverity.LOW;
      case ErrorType.RATE_LIMIT:
        return ErrorSeverity.MEDIUM;
      default:
        return ErrorSeverity.MEDIUM;
    }
  }

  /**
   * Determine if error is retryable
   */
  private isRetryable(error: AppError): boolean {
    const retryableTypes = [
      ErrorType.NETWORK_ERROR,
      ErrorType.TIMEOUT_ERROR,
      ErrorType.RATE_LIMIT,
    ];

    if (retryableTypes.includes(error.type)) {
      return true;
    }

    // Server errors 500, 502, 503, 504 are retryable
    if (error.type === ErrorType.SERVER_ERROR && error.statusCode) {
      return [500, 502, 503, 504].includes(error.statusCode);
    }

    return false;
  }

  /**
   * Determine if error is actionable by the user
   */
  private isActionable(error: AppError): boolean {
    const nonActionableTypes = [ErrorType.SERVER_ERROR];
    
    if (nonActionableTypes.includes(error.type)) {
      return false;
    }

    // 403 Forbidden is not actionable
    if (error.statusCode === 403) {
      return false;
    }

    return true;
  }

  /**
   * Extract request ID from context or error
   */
  private extractRequestId(context?: Record<string, any>): string | undefined {
    return context?.requestId || context?.headers?.['x-request-id'];
  }

  /**
   * Extract user ID from context
   */
  private extractUserId(context?: Record<string, any>): string | undefined {
    return context?.userId || context?.user?.id;
  }

  /**
   * Log error for debugging and monitoring
   */
  private logError(error: EnhancedAppError): void {
    // Add to in-memory log
    this.errorLog.push(error);

    // Keep only last 100 errors in memory
    if (this.errorLog.length > 100) {
      this.errorLog = this.errorLog.slice(-100);
    }

    // Use error logger for structured logging
    if (typeof window !== 'undefined') {
      // Dynamically import to avoid circular dependency
      import('./error-logger').then(({ errorLogger }) => {
        errorLogger.log(error);
      }).catch(console.warn);
    }

    // Console logging
    if (this.isDevelopment) {
      console.group(`🚨 Error [${error.severity.toUpperCase()}]`);
      console.error('User Message:', error.userMessage);
      console.error('Technical Message:', error.technicalMessage);
      console.error('Type:', error.type);
      console.error('Status Code:', error.statusCode);
      console.error('Code:', error.code);
      console.error('Details:', error.details);
      console.error('Context:', error.context);
      console.error('Timestamp:', error.timestamp);
      console.groupEnd();
    } else {
      // In production, log only essential information
      console.error('Error:', {
        type: error.type,
        code: error.code,
        statusCode: error.statusCode,
        severity: error.severity,
        requestId: error.requestId,
        timestamp: error.timestamp,
      });
    }

    // Send to external monitoring service in production
    if (!this.isDevelopment && error.severity === ErrorSeverity.CRITICAL) {
      this.sendToMonitoring(error);
    }
  }

  /**
   * Send critical errors to monitoring service
   */
  private sendToMonitoring(error: EnhancedAppError): void {
    // This would integrate with services like Sentry, LogRocket, etc.
    // For now, we'll just log it
    console.error('CRITICAL ERROR - Should be sent to monitoring:', {
      type: error.type,
      message: error.technicalMessage,
      statusCode: error.statusCode,
      requestId: error.requestId,
      userId: error.userId,
      timestamp: error.timestamp,
      context: error.context,
    });
  }

  /**
   * Get validation errors in a structured format
   */
  public getValidationErrors(error: EnhancedAppError): ValidationError[] {
    if (error.type === ErrorType.VALIDATION_ERROR && error.details) {
      return Array.isArray(error.details) ? error.details : [];
    }
    return [];
  }

  /**
   * Check if error should show retry button
   */
  public shouldShowRetry(error: EnhancedAppError): boolean {
    return error.retryable && error.actionable;
  }

  /**
   * Get suggested actions for the user
   */
  public getSuggestedActions(error: EnhancedAppError): string[] {
    const actions: string[] = [];

    switch (error.type) {
      case ErrorType.NETWORK_ERROR:
        actions.push('Check your internet connection');
        actions.push('Try refreshing the page');
        break;
      case ErrorType.AUTHENTICATION_ERROR:
        actions.push('Log in again');
        actions.push('Clear your browser cache');
        break;
      case ErrorType.VALIDATION_ERROR:
        actions.push('Check the form fields for errors');
        actions.push('Ensure all required fields are filled');
        break;
      case ErrorType.PAYMENT_ERROR:
        actions.push('Check your payment details');
        actions.push('Try a different payment method');
        actions.push('Contact your bank if the issue persists');
        break;
      case ErrorType.RATE_LIMIT:
        actions.push('Wait a few minutes before trying again');
        break;
      case ErrorType.SERVER_ERROR:
        actions.push('Try again in a few minutes');
        actions.push('Contact support if the problem persists');
        break;
    }

    return actions;
  }

  /**
   * Get recent errors for debugging
   */
  public getRecentErrors(limit: number = 10): EnhancedAppError[] {
    return this.errorLog.slice(-limit);
  }

  /**
   * Clear error log
   */
  public clearErrorLog(): void {
    this.errorLog = [];
  }

  /**
   * Type guards
   */
  private isAxiosError(error: any): error is AxiosError {
    return error && error.isAxiosError === true;
  }

  private isAppError(error: any): error is AppError {
    return error && typeof error.type === 'string' && typeof error.message === 'string';
  }
}

// Create singleton instance
export const errorHandler = new ErrorHandler();

// Export convenience functions
export const handleError = (error: any, context?: Record<string, any>) => 
  errorHandler.handleError(error, context);

export const getValidationErrors = (error: EnhancedAppError) => 
  errorHandler.getValidationErrors(error);

export const shouldShowRetry = (error: EnhancedAppError) => 
  errorHandler.shouldShowRetry(error);

export const getSuggestedActions = (error: EnhancedAppError) => 
  errorHandler.getSuggestedActions(error);

// EnhancedAppError type is already exported with the interface definition above