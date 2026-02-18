# Error Handling System

This directory contains a comprehensive error handling system for The Travel Place frontend application. The system provides centralized error processing, user-friendly messaging, logging, and monitoring capabilities.

## Components

### 1. Error Handler (`error-handler.ts`)
The core error processing engine that transforms any error into a standardized, enhanced error with user-friendly messages.

**Features:**
- Transforms raw errors into `EnhancedAppError` objects
- Maps technical errors to user-friendly messages
- Determines error severity and actionability
- Provides retry logic recommendations
- Includes comprehensive error context

**Usage:**
```typescript
import { handleError } from '@/lib/errors';

try {
  await apiCall();
} catch (error) {
  const enhancedError = handleError(error, { userId: 'user123' });
  console.log(enhancedError.userMessage); // User-friendly message
}
```

### 2. API Error Handler (`api-error-handler.ts`)
Specialized error handling for API calls with automatic retry logic and notification integration.

**Features:**
- Automatic retry for retryable errors
- Form validation error handling
- Authentication error handling with redirects
- Payment error handling with specific messaging
- File upload error handling

**Usage:**
```typescript
import { handleApiCall } from '@/lib/errors';

const result = await handleApiCall(
  () => apiClient.post('/bookings', bookingData),
  {
    showNotification: true,
    onRetry: () => console.log('Retrying...'),
    context: { bookingId: 'booking123' }
  }
);
```

### 3. Error Logger (`error-logger.ts`)
Structured error logging for debugging and monitoring with export capabilities.

**Features:**
- In-memory error log with size limits
- localStorage persistence in development
- External service integration for production
- Error statistics and analytics
- Log filtering and export (JSON/CSV)
- Global error handlers for unhandled errors

**Usage:**
```typescript
import { getErrorLogs, getErrorStatistics } from '@/lib/errors';

// Get recent errors
const recentErrors = getErrorLogs({ limit: 10 });

// Get error statistics
const stats = getErrorStatistics({
  from: new Date(Date.now() - 24 * 60 * 60 * 1000),
  to: new Date()
});
```

### 4. React Hook (`use-error-handler.ts`)
React hook for handling errors with notifications and user feedback.

**Features:**
- Integration with notification system
- Automatic retry handling
- Validation error processing
- Network error handling
- Recent error access

**Usage:**
```typescript
import { useErrorHandler } from '@/lib/errors';

function MyComponent() {
  const { handleApiError, handleValidationError } = useErrorHandler();

  const submitForm = async (data) => {
    try {
      await apiCall(data);
    } catch (error) {
      const { validationErrors } = handleValidationError(error);
      // Handle validation errors in form
    }
  };
}
```

### 5. Error Boundary Components

#### ErrorBoundary (`ErrorBoundary.tsx`)
Enhanced React error boundary with user-friendly error display and recovery options.

**Features:**
- Severity-based error display
- Suggested actions for users
- Technical details for debugging
- Retry and recovery options
- Integration with error handler

#### GlobalErrorBoundary (`GlobalErrorBoundary.tsx`)
Application-level error boundary for catching unhandled React errors.

**Features:**
- Global error catching
- Notification integration
- Production error monitoring
- Automatic error reporting

**Usage:**
```tsx
import { GlobalErrorBoundary } from '@/lib/errors';

function App() {
  return (
    <GlobalErrorBoundary>
      <YourApp />
    </GlobalErrorBoundary>
  );
}
```

## Error Types and Severity

### Error Types
- `NETWORK_ERROR` - Connection issues
- `AUTHENTICATION_ERROR` - Auth failures
- `VALIDATION_ERROR` - Form validation issues
- `PAYMENT_ERROR` - Payment processing issues
- `SERVER_ERROR` - Backend server errors
- `NOT_FOUND` - Resource not found
- `RATE_LIMIT` - Too many requests
- `TIMEOUT_ERROR` - Request timeouts

### Severity Levels
- `LOW` - Minor issues, user can continue
- `MEDIUM` - Moderate issues, some functionality affected
- `HIGH` - Serious issues, major functionality affected
- `CRITICAL` - Severe issues, application may be unusable

## User-Friendly Messages

The system includes comprehensive error message mapping:

```typescript
// Technical error
throw new Error('ECONNREFUSED: Connection refused');

// User sees
"Unable to connect to our servers. Please check your internet connection and try again."
```

## Integration with Notifications

The error handling system integrates seamlessly with the notification system:

```typescript
import { useErrorHandler } from '@/lib/errors';

const { handleError } = useErrorHandler();

// Automatically shows notification
handleError(error, {
  showNotification: true,
  onRetry: () => retryAction()
});
```

## Monitoring and Analytics

### Development
- Console logging with detailed information
- localStorage persistence
- Error statistics dashboard

### Production
- External service integration (Sentry, LogRocket, etc.)
- Critical error alerting
- Performance impact monitoring

## Best Practices

### 1. Always Use Error Handler
```typescript
// ❌ Don't do this
catch (error) {
  console.error(error);
  alert('Something went wrong');
}

// ✅ Do this
catch (error) {
  const enhancedError = handleError(error, context);
  // Error is automatically logged and user gets friendly message
}
```

### 2. Provide Context
```typescript
const enhancedError = handleError(error, {
  userId: user.id,
  action: 'booking_flight',
  flightId: flight.id,
  timestamp: new Date().toISOString()
});
```

### 3. Handle Specific Error Types
```typescript
// For API calls
const result = await handleApiCall(() => apiClient.post('/data'));

// For form submissions
const { fieldErrors } = handleFormError(error);

// For authentication
handleAuthError(error); // Automatically redirects on auth failure
```

### 4. Use Error Boundaries
```tsx
// Wrap components that might throw
<ErrorBoundary level="component" showSuggestions={true}>
  <RiskyComponent />
</ErrorBoundary>
```

### 5. Monitor Error Trends
```typescript
// Regular monitoring
const stats = getErrorStatistics();
if (stats.errorRate > threshold) {
  // Alert development team
}
```

## Configuration

### Environment Variables
```bash
# Error logging
NEXT_PUBLIC_ERROR_LOGGING_ENABLED=true
NEXT_PUBLIC_ERROR_MONITORING_URL=https://monitoring.example.com

# Development settings
NEXT_PUBLIC_SHOW_ERROR_DETAILS=true
NEXT_PUBLIC_ERROR_LOG_LEVEL=debug
```

### Monitoring Service Integration
```typescript
// Configure external monitoring
errorLogger.setExternalService({
  url: process.env.NEXT_PUBLIC_ERROR_MONITORING_URL,
  apiKey: process.env.ERROR_MONITORING_API_KEY,
  projectId: process.env.ERROR_MONITORING_PROJECT_ID
});
```

## Testing

### Unit Tests
```typescript
import { handleError, ErrorSeverity } from '@/lib/errors';

test('handles network errors correctly', () => {
  const error = new Error('Network error');
  const enhanced = handleError(error);
  
  expect(enhanced.severity).toBe(ErrorSeverity.MEDIUM);
  expect(enhanced.retryable).toBe(true);
  expect(enhanced.userMessage).toContain('connection');
});
```

### Integration Tests
```typescript
test('error boundary catches and displays errors', () => {
  const ThrowError = () => { throw new Error('Test error'); };
  
  render(
    <ErrorBoundary>
      <ThrowError />
    </ErrorBoundary>
  );
  
  expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
});
```

## Migration Guide

### From Basic Error Handling
```typescript
// Before
try {
  await apiCall();
} catch (error) {
  console.error(error);
  setError(error.message);
}

// After
try {
  await apiCall();
} catch (error) {
  const enhancedError = handleError(error, { context: 'api_call' });
  // Error automatically logged and user notified
}
```

### Adding Error Boundaries
```tsx
// Wrap your app
<GlobalErrorBoundary>
  <App />
</GlobalErrorBoundary>

// Wrap risky components
<ErrorBoundary level="component">
  <DataFetchingComponent />
</ErrorBoundary>
```

This error handling system provides a robust foundation for managing errors throughout the application while maintaining a great user experience.