# API Client Interceptors

This document describes the request and response interceptors implemented in the API client service.

## Request Interceptors

The request interceptor handles the following functionality:

### Authentication Headers
- Automatically adds `Authorization: Bearer <token>` header to all requests
- Respects the `requiresAuth: false` configuration to skip authentication for public endpoints
- Uses internal `X-Skip-Auth` header to control authentication behavior

### Request Tracking
- Adds unique `X-Request-ID` header for request tracking and debugging
- Adds timestamp metadata for performance monitoring
- Includes client version and platform information

### Development Logging
- Logs all outgoing requests in development mode
- Redacts sensitive information like authorization tokens
- Includes request method, URL, headers, data, and parameters

## Response Interceptors

The response interceptor handles the following functionality:

### Performance Monitoring
- Calculates and logs request duration
- Tracks response times for performance analysis

### API Error Detection
- Detects API-level errors in successful HTTP responses
- Handles cases where HTTP 200 contains `success: false`

### Authentication Error Handling
- Automatically handles 401 Unauthorized responses
- Implements token refresh mechanism with request queuing
- Prevents infinite loops on authentication endpoints
- Redirects to login page when refresh fails

### Rate Limiting
- Handles 429 Too Many Requests responses
- Implements exponential backoff with retry logic
- Respects `Retry-After` headers from the server
- Maximum 3 retry attempts with increasing delays

### Error Processing
- Transforms axios errors into standardized `AppError` format
- Categorizes errors by type (network, authentication, validation, etc.)
- Provides user-friendly error messages
- Preserves technical details for debugging

## Token Refresh Flow

When a 401 error is encountered:

1. Check if request is to an auth endpoint (skip refresh to avoid loops)
2. Check if token refresh is already in progress
3. If refreshing, queue the failed request
4. If not refreshing, start refresh process:
   - Call auth service refresh method
   - Update stored tokens
   - Retry original request with new token
   - Process queued requests
5. If refresh fails, clear auth data and redirect to login

## Error Handling

The interceptors handle various error scenarios:

- **Network Errors**: Connection issues, timeouts
- **Authentication Errors**: Invalid tokens, expired sessions
- **Validation Errors**: Invalid request data
- **Rate Limiting**: Too many requests
- **Server Errors**: Internal server issues

## Configuration Options

The API client supports the following configuration options:

- `requiresAuth: false` - Skip authentication for public endpoints
- `timeout` - Request timeout in milliseconds
- `retries` - Number of retry attempts for failed requests
- `headers` - Custom headers to include with requests

## Usage Examples

```typescript
// Authenticated request (default)
const response = await apiClient.get('/user/profile');

// Public endpoint (no authentication)
const response = await apiClient.post('/auth/login', credentials, {
  requiresAuth: false
});

// Custom configuration
const response = await apiClient.get('/data', {
  timeout: 10000,
  retries: 5,
  headers: {
    'Custom-Header': 'value'
  }
});
```

## Security Considerations

- Authentication tokens are automatically redacted from logs
- Refresh tokens are handled securely through the auth service
- Failed authentication attempts trigger automatic cleanup
- Rate limiting prevents abuse and respects server limits