/**
 * Authentication Module Exports
 * Centralized exports for all authentication-related functionality
 */

// Core Services
export { authService } from '../auth-service';
export { tokenStorage } from '../token-storage';

// Types
export type { AuthService } from '../auth-service';
export type { TokenStorage, TokenData, StorageOptions } from '../token-storage';

// Context and Hooks
export {
  SimpleAuthProvider as AuthProvider,
  useSimpleAuth as useAuth
} from '../../contexts/simple-auth-context';

export type { SimpleAuthContextType as AuthContextType } from '../../contexts/simple-auth-context';

// Custom Hooks
export {
  useLogin,
  useRegister,
  useLogout,
  useAuthRedirect,
  useRoleAccess,
  useVerificationStatus,
  useAuthPersistence,
  useSessionTimeout,
  useUserProfile
} from '../../hooks/use-auth';

// Components
export {
  ProtectedRoute,
  withAuth,
  AdminRoute,
  AgentRoute,
  VerifiedRoute
} from '../../components/auth/protected-route';

export {
  AuthGuard,
  useSecurityMonitoring,
  useTokenRefresh
} from '../../components/auth/auth-guard';

// Re-export API types for convenience
export type {
  User,
  LoginCredentials,
  RegisterData,
  AuthResponse,
  UserRole
} from '../../types/api';