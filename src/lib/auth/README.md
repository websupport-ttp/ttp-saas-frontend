# Authentication System Documentation

This authentication system provides secure user authentication, token management, and route protection for The Travel Place frontend application.

## Features

- **Secure Token Storage**: Uses httpOnly cookies with localStorage fallback
- **Automatic Token Refresh**: Handles token expiration automatically
- **Route Protection**: Protects routes based on authentication and roles
- **Security Monitoring**: Detects tampering and security issues
- **Cross-tab Synchronization**: Syncs authentication state across browser tabs
- **TypeScript Support**: Fully typed for better development experience

## Quick Start

### 1. Wrap your app with AuthProvider

```tsx
// app/layout.tsx or pages/_app.tsx
import { AuthProvider } from '@/lib/auth';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
```

### 2. Use authentication in components

```tsx
// components/LoginForm.tsx
import { useLogin } from '@/lib/auth';

export function LoginForm() {
  const { login, isLoading, error } = useLogin();

  const handleSubmit = async (credentials: LoginCredentials) => {
    try {
      await login(credentials);
      // User will be redirected automatically
    } catch (error) {
      // Error is handled by the hook
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      {error && <div className="error">{error}</div>}
      <button disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

### 3. Protect routes

```tsx
// app/dashboard/page.tsx
import { ProtectedRoute } from '@/lib/auth';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div>Protected dashboard content</div>
    </ProtectedRoute>
  );
}

// Or use HOC
import { withAuth } from '@/lib/auth';

function DashboardPage() {
  return <div>Protected dashboard content</div>;
}

export default withAuth(DashboardPage);
```

### 4. Add security monitoring

```tsx
// app/layout.tsx
import { AuthProvider, AuthGuard } from '@/lib/auth';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <AuthProvider>
          <AuthGuard enableAutoRefresh enableSecurityMonitoring>
            {children}
          </AuthGuard>
        </AuthProvider>
      </body>
    </html>
  );
}
```

## API Reference

### Hooks

#### useAuth()
Main authentication hook providing full authentication state and methods.

```tsx
const {
  user,
  isLoading,
  isAuthenticated,
  error,
  login,
  register,
  logout,
  refreshUser,
  clearError,
  hasRole,
  isUserVerified
} = useAuth();
```

#### useLogin()
Simplified hook for login functionality.

```tsx
const { login, isLoading, error, clearError } = useLogin();
```

#### useAuthStatus()
Hook for checking authentication status.

```tsx
const { isAuthenticated, user, isLoading } = useAuthStatus();
```

#### useRoleAccess(requiredRole)
Hook for role-based access control.

```tsx
const { hasAccess, user, isLoading } = useRoleAccess('admin');
```

### Components

#### ProtectedRoute
Protects routes requiring authentication.

```tsx
<ProtectedRoute
  requiredRole="admin"
  requireVerification={true}
  fallbackPath="/login"
>
  <AdminPanel />
</ProtectedRoute>
```

#### AuthGuard
Provides automatic token refresh and security monitoring.

```tsx
<AuthGuard
  enableAutoRefresh={true}
  refreshInterval={5} // minutes
  enableSecurityMonitoring={true}
>
  <App />
</AuthGuard>
```

#### Specialized Route Components

```tsx
// Admin only
<AdminRoute>
  <AdminPanel />
</AdminRoute>

// Agent only
<AgentRoute>
  <AgentDashboard />
</AgentRoute>

// Verified users only
<VerifiedRoute>
  <VerifiedContent />
</VerifiedRoute>
```

### Services

#### authService
Core authentication service.

```tsx
import { authService } from '@/lib/auth';

// Login
const authResponse = await authService.login(credentials);

// Register
const authResponse = await authService.register(userData);

// Logout
await authService.logout();

// Check authentication
const isAuth = authService.isAuthenticated();

// Get current user
const user = authService.getCurrentUser();

// Refresh token
const newToken = await authService.refreshToken();
```

#### tokenStorage
Secure token storage service.

```tsx
import { tokenStorage } from '@/lib/auth';

// Store tokens
tokenStorage.storeTokens(tokenData, { secure: true });

// Get tokens
const tokens = tokenStorage.getTokens();

// Clear tokens
tokenStorage.clearTokens();

// Check expiration
const isExpired = tokenStorage.isAccessTokenExpired();
```

## Security Features

### Token Storage
- **Primary**: httpOnly cookies (set by server)
- **Fallback**: Encrypted localStorage
- **Cross-tab sync**: Storage events
- **Tampering detection**: Token validation

### Automatic Refresh
- Refreshes tokens before expiration
- Handles refresh failures gracefully
- Queues requests during refresh

### Security Monitoring
- Detects HTTP usage in production
- Monitors token tampering
- Validates storage availability
- Logs security issues

## Environment Variables

```env
# Required
NEXT_PUBLIC_API_BASE_URL=https://api.thetravelplace.com/api/v1
NEXT_PUBLIC_AUTH_COOKIE_NAME=ttp_auth_token
NEXT_PUBLIC_REFRESH_TOKEN_NAME=ttp_refresh_token

# Optional
NEXT_PUBLIC_API_TIMEOUT=30000
NEXT_PUBLIC_DEBUG_MODE=false
```

## Error Handling

The authentication system provides comprehensive error handling:

```tsx
try {
  await login(credentials);
} catch (error) {
  switch (error.type) {
    case 'AUTHENTICATION_ERROR':
      // Invalid credentials
      break;
    case 'NETWORK_ERROR':
      // Connection issues
      break;
    case 'VALIDATION_ERROR':
      // Form validation errors
      break;
    default:
      // Generic error
      break;
  }
}
```

## Best Practices

1. **Always use ProtectedRoute** for authenticated pages
2. **Enable AuthGuard** for automatic token refresh
3. **Handle loading states** in your UI
4. **Clear errors** after displaying them
5. **Use role-based access** for authorization
6. **Monitor security issues** in development
7. **Test cross-tab behavior** during development

## Troubleshooting

### Common Issues

1. **Tokens not persisting**: Check cookie settings and HTTPS
2. **Cross-tab logout**: Expected behavior for security
3. **Automatic redirects**: Check route protection settings
4. **Token refresh failures**: Check API endpoint availability

### Debug Information

```tsx
import { authService, tokenStorage } from '@/lib/auth';

// Get storage info
console.log(tokenStorage.getStorageInfo());

// Get security issues
console.log(authService.detectSecurityIssues());
```

## Migration Guide

If upgrading from a previous authentication system:

1. Replace old auth context with new AuthProvider
2. Update component imports to use new hooks
3. Replace manual token handling with authService
4. Add route protection where needed
5. Test authentication flows thoroughly

## Contributing

When contributing to the authentication system:

1. Maintain TypeScript types
2. Add tests for new functionality
3. Update documentation
4. Follow security best practices
5. Test cross-browser compatibility