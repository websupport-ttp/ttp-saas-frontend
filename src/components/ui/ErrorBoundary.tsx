'use client';

import { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from './Button';
import { errorHandler, EnhancedAppError, ErrorSeverity, getSuggestedActions } from '@/lib/error-handler';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  enhancedError?: EnhancedAppError;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo, enhancedError: EnhancedAppError) => void;
  showDetails?: boolean;
  showSuggestions?: boolean;
  level?: 'page' | 'component' | 'global';
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Create enhanced error with React error context
    const context = {
      componentStack: errorInfo.componentStack,
      errorBoundary: this.props.level || 'component',
      timestamp: new Date().toISOString(),
    };

    const enhancedError = errorHandler.handleError(error, context);
    
    this.setState({ 
      error, 
      errorInfo, 
      enhancedError 
    });
    
    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo, enhancedError);
    }
  }

  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: undefined, 
      errorInfo: undefined,
      enhancedError: undefined 
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  getSeverityColor = (severity: ErrorSeverity): string => {
    switch (severity) {
      case ErrorSeverity.LOW:
        return 'text-yellow-500';
      case ErrorSeverity.MEDIUM:
        return 'text-orange-500';
      case ErrorSeverity.HIGH:
        return 'text-red-500';
      case ErrorSeverity.CRITICAL:
        return 'text-red-600';
      default:
        return 'text-red-500';
    }
  };

  getSeverityIcon = (severity: ErrorSeverity) => {
    const baseClasses = "w-16 h-16 mx-auto mb-4";
    const colorClass = this.getSeverityColor(severity);
    
    switch (severity) {
      case ErrorSeverity.LOW:
        return (
          <svg className={`${baseClasses} ${colorClass}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      case ErrorSeverity.CRITICAL:
        return (
          <svg className={`${baseClasses} ${colorClass}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
          </svg>
        );
      default:
        return (
          <svg className={`${baseClasses} ${colorClass}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
    }
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const { enhancedError } = this.state;
      const severity = enhancedError?.severity || ErrorSeverity.MEDIUM;
      const userMessage = enhancedError?.userMessage || 'We encountered an unexpected error. Please try again or contact support if the problem persists.';
      const suggestions = enhancedError ? getSuggestedActions(enhancedError) : [];

      // Default error UI
      return (
        <div className="min-h-[400px] flex items-center justify-center p-8">
          <div className="text-center max-w-lg">
            <div className="mb-6">
              {this.getSeverityIcon(severity)}
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {severity === ErrorSeverity.CRITICAL ? 'Critical Error' : 'Oops! Something went wrong'}
            </h2>
            
            <p className="text-gray-600 mb-6">
              {userMessage}
            </p>

            {/* Suggested Actions */}
            {this.props.showSuggestions !== false && suggestions.length > 0 && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-left">
                <h3 className="text-sm font-semibold text-blue-900 mb-2">
                  What you can try:
                </h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  {suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Error Details (Development/Debug) */}
            {this.props.showDetails && this.state.error && (
              <details className="mb-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700 mb-2">
                  Show technical details
                </summary>
                <div className="bg-gray-100 p-4 rounded-lg text-sm font-mono text-gray-800 overflow-auto max-h-60">
                  {enhancedError && (
                    <div className="mb-4 space-y-2">
                      <div><strong>Error Type:</strong> {enhancedError.type}</div>
                      <div><strong>Severity:</strong> {enhancedError.severity}</div>
                      <div><strong>Timestamp:</strong> {enhancedError.timestamp}</div>
                      {enhancedError.requestId && (
                        <div><strong>Request ID:</strong> {enhancedError.requestId}</div>
                      )}
                      {enhancedError.code && (
                        <div><strong>Error Code:</strong> {enhancedError.code}</div>
                      )}
                    </div>
                  )}
                  
                  <div className="mb-2">
                    <strong>Error Message:</strong> {this.state.error.message}
                  </div>
                  
                  {this.state.error.stack && (
                    <div className="mb-2">
                      <strong>Stack Trace:</strong>
                      <pre className="whitespace-pre-wrap text-xs mt-1 max-h-32 overflow-auto">
                        {this.state.error.stack}
                      </pre>
                    </div>
                  )}
                  
                  {this.state.errorInfo?.componentStack && (
                    <div>
                      <strong>Component Stack:</strong>
                      <pre className="whitespace-pre-wrap text-xs mt-1 max-h-32 overflow-auto">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="primary"
                onClick={this.handleRetry}
                className="flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Try Again
              </Button>
              
              {severity === ErrorSeverity.CRITICAL ? (
                <Button
                  variant="outline"
                  onClick={this.handleReload}
                  className="flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Reload Page
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={this.handleGoHome}
                  className="flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Go Home
                </Button>
              )}
            </div>

            {/* Support Contact for Critical Errors */}
            {severity === ErrorSeverity.CRITICAL && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">
                  If this error persists, please contact our support team with the error details above.
                </p>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
export { ErrorBoundary };