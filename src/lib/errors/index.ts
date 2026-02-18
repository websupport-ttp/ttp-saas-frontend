/**
 * Error Handling System Exports
 * Centralized exports for all error handling utilities
 */

// Core error handler
export {
  errorHandler,
  handleError,
  getValidationErrors,
  shouldShowRetry,
  getSuggestedActions,
  ErrorSeverity,
  type EnhancedAppError
} from '../error-handler';

// API error handling
export {
  apiErrorHandler,
  handleApiCall,
  handleFormError,
  handleAuthError,
  handlePaymentError,
  handleUploadError,
  ApiErrorHandler,
  type ApiErrorHandlerOptions
} from '../api-error-handler';

// Error logging
export {
  errorLogger,
  logError,
  getErrorLogs,
  getErrorStatistics,
  exportErrorLogs,
  clearErrorLogs,
  type ErrorLogEntry,
  type ErrorLogFilter
} from '../error-logger';

// React hooks
export {
  useErrorHandler,
  type ErrorHandlerOptions
} from '../../hooks/use-error-handler';

// Components
export { default as ErrorBoundary } from '../../components/ui/ErrorBoundary';
export { default as GlobalErrorBoundary } from '../../components/ui/GlobalErrorBoundary';

// Types from API
export {
  ErrorType,
  type AppError,
  type ValidationError
} from '../../types/api';