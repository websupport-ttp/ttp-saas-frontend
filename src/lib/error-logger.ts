/**
 * Error Logging Service
 * Provides structured error logging for debugging and monitoring
 */

import { EnhancedAppError, ErrorSeverity } from './error-handler';
import { ErrorType } from '@/types/api';

export interface ErrorLogEntry {
  id: string;
  timestamp: string;
  error: EnhancedAppError;
  userAgent?: string;
  url?: string;
  userId?: string;
  sessionId?: string;
  buildVersion?: string;
}

export interface ErrorLogFilter {
  severity?: ErrorSeverity[];
  type?: string[];
  dateFrom?: Date;
  dateTo?: Date;
  userId?: string;
  limit?: number;
}

class ErrorLogger {
  private logs: ErrorLogEntry[] = [];
  private maxLogs = 1000;
  private sessionId: string;
  private isDevelopment = process.env.NODE_ENV === 'development';

  constructor() {
    this.sessionId = this.generateSessionId();
    this.initializeLogger();
  }

  /**
   * Log an error
   */
  log(error: EnhancedAppError, additionalContext?: Record<string, any>): void {
    const logEntry: ErrorLogEntry = {
      id: this.generateLogId(),
      timestamp: new Date().toISOString(),
      error: {
        ...error,
        context: {
          ...error.context,
          ...additionalContext
        }
      },
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      userId: error.userId,
      sessionId: this.sessionId,
      buildVersion: process.env.NEXT_PUBLIC_BUILD_VERSION || 'unknown'
    };

    // Add to in-memory log
    this.logs.push(logEntry);

    // Maintain log size limit
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Persist to localStorage in development
    if (this.isDevelopment) {
      this.persistToLocalStorage(logEntry);
    }

    // Send to external service in production
    if (!this.isDevelopment) {
      this.sendToExternalService(logEntry);
    }

    // Console logging based on severity
    this.consoleLog(logEntry);
  }

  /**
   * Get filtered logs
   */
  getLogs(filter: ErrorLogFilter = {}): ErrorLogEntry[] {
    let filteredLogs = [...this.logs];

    // Filter by severity
    if (filter.severity && filter.severity.length > 0) {
      filteredLogs = filteredLogs.filter(log => 
        filter.severity!.includes(log.error.severity)
      );
    }

    // Filter by type
    if (filter.type && filter.type.length > 0) {
      filteredLogs = filteredLogs.filter(log => 
        filter.type!.includes(log.error.type)
      );
    }

    // Filter by date range
    if (filter.dateFrom) {
      filteredLogs = filteredLogs.filter(log => 
        new Date(log.timestamp) >= filter.dateFrom!
      );
    }

    if (filter.dateTo) {
      filteredLogs = filteredLogs.filter(log => 
        new Date(log.timestamp) <= filter.dateTo!
      );
    }

    // Filter by user ID
    if (filter.userId) {
      filteredLogs = filteredLogs.filter(log => 
        log.userId === filter.userId
      );
    }

    // Apply limit
    if (filter.limit && filter.limit > 0) {
      filteredLogs = filteredLogs.slice(-filter.limit);
    }

    return filteredLogs.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  /**
   * Get error statistics
   */
  getStatistics(timeRange?: { from: Date; to: Date }): {
    totalErrors: number;
    errorsBySeverity: Record<ErrorSeverity, number>;
    errorsByType: Record<string, number>;
    topErrors: Array<{ message: string; count: number }>;
    errorRate: number; // errors per hour
  } {
    let logs = this.logs;

    if (timeRange) {
      logs = logs.filter(log => {
        const logTime = new Date(log.timestamp);
        return logTime >= timeRange.from && logTime <= timeRange.to;
      });
    }

    const errorsBySeverity: Record<ErrorSeverity, number> = {
      [ErrorSeverity.LOW]: 0,
      [ErrorSeverity.MEDIUM]: 0,
      [ErrorSeverity.HIGH]: 0,
      [ErrorSeverity.CRITICAL]: 0
    };

    const errorsByType: Record<string, number> = {};
    const errorMessages: Record<string, number> = {};

    logs.forEach(log => {
      // Count by severity
      errorsBySeverity[log.error.severity]++;

      // Count by type
      errorsByType[log.error.type] = (errorsByType[log.error.type] || 0) + 1;

      // Count by message
      const message = log.error.userMessage || log.error.message;
      errorMessages[message] = (errorMessages[message] || 0) + 1;
    });

    // Get top errors
    const topErrors = Object.entries(errorMessages)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([message, count]) => ({ message, count }));

    // Calculate error rate (errors per hour)
    const timeSpan = timeRange 
      ? (timeRange.to.getTime() - timeRange.from.getTime()) / (1000 * 60 * 60)
      : 24; // Default to 24 hours
    const errorRate = logs.length / timeSpan;

    return {
      totalErrors: logs.length,
      errorsBySeverity,
      errorsByType,
      topErrors,
      errorRate
    };
  }

  /**
   * Export logs for debugging
   */
  exportLogs(format: 'json' | 'csv' = 'json'): string {
    const logs = this.getLogs();

    if (format === 'csv') {
      const headers = [
        'Timestamp',
        'Severity',
        'Type',
        'Message',
        'User Message',
        'Status Code',
        'Request ID',
        'User ID',
        'URL'
      ];

      const rows = logs.map(log => [
        log.timestamp,
        log.error.severity,
        log.error.type,
        log.error.technicalMessage,
        log.error.userMessage,
        log.error.statusCode?.toString() || '',
        log.error.requestId || '',
        log.userId || '',
        log.url || ''
      ]);

      return [headers, ...rows].map(row => 
        row.map(cell => `"${cell}"`).join(',')
      ).join('\n');
    }

    return JSON.stringify(logs, null, 2);
  }

  /**
   * Clear all logs
   */
  clearLogs(): void {
    this.logs = [];
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem('error_logs');
    }
  }

  /**
   * Initialize logger
   */
  private initializeLogger(): void {
    // Load persisted logs in development
    if (this.isDevelopment && typeof window !== 'undefined') {
      this.loadFromLocalStorage();
    }

    // Set up global error handlers
    if (typeof window !== 'undefined') {
      // Handle unhandled promise rejections
      window.addEventListener('unhandledrejection', (event) => {
        this.log({
          type: ErrorType.SERVER_ERROR,
          message: event.reason?.message || 'Unhandled promise rejection',
          severity: ErrorSeverity.HIGH,
          userMessage: 'An unexpected error occurred',
          technicalMessage: event.reason?.message || 'Unhandled promise rejection',
          timestamp: new Date().toISOString(),
          retryable: false,
          actionable: false,
          details: {
            reason: event.reason,
            promise: event.promise,
            errorCategory: 'UNHANDLED_PROMISE_REJECTION'
          }
        } as EnhancedAppError);
      });

      // Handle global JavaScript errors
      window.addEventListener('error', (event) => {
        this.log({
          type: ErrorType.SERVER_ERROR,
          message: event.message,
          severity: ErrorSeverity.HIGH,
          userMessage: 'An unexpected error occurred',
          technicalMessage: event.message,
          timestamp: new Date().toISOString(),
          retryable: false,
          actionable: false,
          details: {
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
            error: event.error,
            errorCategory: 'JAVASCRIPT_ERROR'
          }
        } as EnhancedAppError);
      });
    }
  }

  /**
   * Console logging based on severity
   */
  private consoleLog(logEntry: ErrorLogEntry): void {
    const { error } = logEntry;
    
    switch (error.severity) {
      case ErrorSeverity.CRITICAL:
        console.error('🔥 CRITICAL ERROR:', logEntry);
        break;
      case ErrorSeverity.HIGH:
        console.error('🚨 HIGH SEVERITY ERROR:', logEntry);
        break;
      case ErrorSeverity.MEDIUM:
        console.warn('⚠️ MEDIUM SEVERITY ERROR:', logEntry);
        break;
      case ErrorSeverity.LOW:
        console.info('ℹ️ LOW SEVERITY ERROR:', logEntry);
        break;
      default:
        console.log('📝 ERROR LOG:', logEntry);
    }
  }

  /**
   * Persist logs to localStorage (development only)
   */
  private persistToLocalStorage(logEntry: ErrorLogEntry): void {
    try {
      const existingLogs = localStorage.getItem('error_logs');
      const logs = existingLogs ? JSON.parse(existingLogs) : [];
      logs.push(logEntry);
      
      // Keep only last 100 logs in localStorage
      const recentLogs = logs.slice(-100);
      localStorage.setItem('error_logs', JSON.stringify(recentLogs));
    } catch (error) {
      console.warn('Failed to persist error log to localStorage:', error);
    }
  }

  /**
   * Load logs from localStorage (development only)
   */
  private loadFromLocalStorage(): void {
    try {
      const existingLogs = localStorage.getItem('error_logs');
      if (existingLogs) {
        const logs = JSON.parse(existingLogs);
        this.logs = [...this.logs, ...logs];
      }
    } catch (error) {
      console.warn('Failed to load error logs from localStorage:', error);
    }
  }

  /**
   * Send logs to external monitoring service (production only)
   */
  private sendToExternalService(logEntry: ErrorLogEntry): void {
    // This would integrate with services like Sentry, LogRocket, DataDog, etc.
    // For now, we'll just prepare the data structure
    
    if (logEntry.error.severity === ErrorSeverity.CRITICAL) {
      // Send immediately for critical errors
      this.sendLogEntry(logEntry);
    } else {
      // Batch non-critical errors
      this.batchLogEntry(logEntry);
    }
  }

  /**
   * Send individual log entry
   */
  private async sendLogEntry(logEntry: ErrorLogEntry): Promise<void> {
    try {
      // This would be replaced with actual API call to monitoring service
      console.log('Sending error to monitoring service:', logEntry);
      
      // Example API call:
      // await fetch('/api/errors', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(logEntry)
      // });
    } catch (error) {
      console.warn('Failed to send error to monitoring service:', error);
    }
  }

  /**
   * Batch log entries for efficient sending
   */
  private batchLogEntry(logEntry: ErrorLogEntry): void {
    // Implementation would batch entries and send periodically
    console.log('Batching error for monitoring service:', logEntry);
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  }

  /**
   * Generate unique log ID
   */
  private generateLogId(): string {
    return `log_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  }
}

// Create singleton instance
export const errorLogger = new ErrorLogger();

// Export convenience functions
export const logError = (error: EnhancedAppError, context?: Record<string, any>) =>
  errorLogger.log(error, context);

export const getErrorLogs = (filter?: ErrorLogFilter) =>
  errorLogger.getLogs(filter);

export const getErrorStatistics = (timeRange?: { from: Date; to: Date }) =>
  errorLogger.getStatistics(timeRange);

export const exportErrorLogs = (format?: 'json' | 'csv') =>
  errorLogger.exportLogs(format);

export const clearErrorLogs = () =>
  errorLogger.clearLogs();