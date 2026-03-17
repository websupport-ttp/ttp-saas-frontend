/**
 * Authentication Service
 * Handles user authentication, token management, and user state
 */

import { apiClient } from './api-client';
import { appConfig } from './config';
import { tokenStorage, TokenData } from './token-storage';
import {
  User,
  LoginCredentials,
  RegisterData,
  AuthResponse,
  ApiResponse,
  ErrorType,
  AppError
} from '@/types/api';

export interface AuthService {
  login(credentials: LoginCredentials): Promise<AuthResponse>;
  loginWithGoogle(googleUser: { googleId: string; email: string; firstName: string; lastName: string; otherNames?: string }): Promise<AuthResponse>;
  logout(): Promise<void>;
  register(userData: RegisterData): Promise<AuthResponse>;
  sendVerificationCodes(email: string, phoneNumber: string): Promise<any>;
  verifyRegistrationCodes(email: string, phoneNumber: string, emailOtp: string, phoneOtp: string): Promise<any>;
  resendEmailOtp(email: string, phoneNumber: string): Promise<any>;
  resendPhoneOtp(email: string, phoneNumber: string, method?: 'sms' | 'whatsapp' | 'call'): Promise<any>;
  refreshToken(): Promise<string>;
  getCurrentUser(): User | null;
  isAuthenticated(): boolean;
  getAuthToken(): string | null;
  clearAuthData(): void;
}

class AuthenticationService implements AuthService {
  private currentUser: User | null = null;
  private authToken: string | null = null;
  private refreshTokenValue: string | null = null;

  constructor() {
    this.loadAuthDataFromStorage();
  }

  /**
   * Load authentication data from storage on initialization
   */
  private loadAuthDataFromStorage(): void {
    if (typeof window !== 'undefined') {
      try {
        // Load tokens using secure token storage
        const tokenData = tokenStorage.getTokens();
        if (tokenData) {
          this.authToken = tokenData.accessToken;
          this.refreshTokenValue = tokenData.refreshToken;

          // Update API client with tokens
          apiClient.setAuthTokens(tokenData.accessToken, tokenData.refreshToken);
        }
        
        // Load user data from localStorage (less sensitive)
        const userData = localStorage.getItem('user_data');
        if (userData) {
          this.currentUser = JSON.parse(userData);
        }

        // Check for token tampering or expiration
        if (tokenData && tokenStorage.isAccessTokenExpired()) {
          console.log('Access token expired, will attempt refresh on next API call');
        }
      } catch (error) {
        console.error('Error loading auth data from storage:', error);
        this.clearAuthData();
      }
    }
  }

  /**
   * Save authentication data to storage
   */
  private saveAuthDataToStorage(authResponse: AuthResponse): void {
    if (typeof window !== 'undefined') {
      try {
        // Prepare token data for secure storage
        const tokenData: TokenData = {
          accessToken: authResponse.token,
          refreshToken: authResponse.refreshToken,
          expiresAt: authResponse.expiresAt,
          tokenType: 'Bearer'
        };

        // Save tokens using secure token storage
        const tokensSaved = tokenStorage.storeTokens(tokenData, {
          secure: window.location.protocol === 'https:',
          sameSite: 'strict'
        });

        if (!tokensSaved) {
          throw new Error('Failed to save authentication tokens securely');
        }
        
        // Save user data to localStorage (less sensitive)
        localStorage.setItem('user_data', JSON.stringify(authResponse.user));
        
        // Update instance variables
        this.authToken = authResponse.token;
        this.refreshTokenValue = authResponse.refreshToken;
        this.currentUser = authResponse.user;

        // Update API client
        apiClient.setAuthTokens(authResponse.token, authResponse.refreshToken);
      } catch (error) {
        console.error('Error saving auth data to storage:', error);
        throw new Error('Failed to save authentication data');
      }
    }
  }

  /**
   * Clear authentication data from storage and memory
   */
  public clearAuthData(): void {
    if (typeof window !== 'undefined') {
      // Clear tokens using secure token storage
      tokenStorage.clearTokens();
      
      // Clear user data from localStorage
      localStorage.removeItem('user_data');
    }

    // Clear instance variables
    this.authToken = null;
    this.refreshTokenValue = null;
    this.currentUser = null;

    // Clear API client tokens
    apiClient.clearAuthTokens();
  }

  /**
   * Login user with email and password
   */
  public async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response: ApiResponse<any> = await apiClient.post(
        '/auth/login',
        credentials,
        { requiresAuth: false }
      );

      if (!response.success || !response.data) {
        throw new Error(response.message || 'Login failed');
      }

      // Backend uses HTTP-only cookies for tokens, so we only save user data
      const user = response.data.user;
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('user_data', JSON.stringify(user));
      }
      
      this.currentUser = user;

      // Return a mock AuthResponse for compatibility
      return {
        user,
        token: 'cookie-based', // Tokens are in HTTP-only cookies
        refreshToken: 'cookie-based',
        expiresAt: new Date(Date.now() + 3600000).toISOString() // 1 hour
      };
    } catch (error: any) {
      // Preserve verification error details for frontend handling
      if (error.response?.data?.requiresVerification || error.details?.requiresVerification) {
        // Re-throw with original response data intact
        const verificationError = new Error(error.message) as any;
        verificationError.response = {
          data: error.details || error.response?.data
        };
        throw verificationError;
      }
      
      // Handle specific authentication errors
      if (error.type === ErrorType.AUTHENTICATION_ERROR) {
        throw new Error('Invalid email or password');
      }
      
      if (error.type === ErrorType.VALIDATION_ERROR) {
        throw new Error(error.message || 'Please check your login credentials');
      }

      if (error.type === ErrorType.NETWORK_ERROR) {
        throw new Error('Network error. Please check your connection and try again.');
      }

      throw new Error(error.message || 'Login failed. Please try again.');
    }
  }

  /**
   * Login with Google
   */
  public async loginWithGoogle(googleUser: { 
    googleId: string; 
    email: string; 
    firstName: string; 
    lastName: string; 
    otherNames?: string 
  }): Promise<AuthResponse> {
    try {
      const response: ApiResponse<any> = await apiClient.post(
        '/auth/google',
        googleUser,
        { requiresAuth: false }
      );

      if (!response.success || !response.data) {
        throw new Error(response.message || 'Google login failed');
      }

      // Backend uses HTTP-only cookies for tokens, so we only save user data
      const user = response.data.user;
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('user_data', JSON.stringify(user));
      }
      
      this.currentUser = user;

      // Return a mock AuthResponse for compatibility
      return {
        user,
        token: 'cookie-based', // Tokens are in HTTP-only cookies
        refreshToken: 'cookie-based',
        expiresAt: new Date(Date.now() + 3600000).toISOString() // 1 hour
      };
    } catch (error: any) {
      if (error.type === ErrorType.NETWORK_ERROR) {
        throw new Error('Network error. Please check your connection and try again.');
      }

      throw new Error(error.message || 'Google login failed. Please try again.');
    }
  }

  /**
   * Register new user
   */
  public async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      const response: ApiResponse<AuthResponse> = await apiClient.post(
        '/auth/register',
        userData,
        { requiresAuth: false }
      );

      if (!response.success || !response.data) {
        throw new Error(response.message || 'Registration failed');
      }

      // Save authentication data
      this.saveAuthDataToStorage(response.data);

      return response.data;
    } catch (error: any) {
      // Handle specific registration errors
      if (error.type === ErrorType.VALIDATION_ERROR) {
        if (error.details && Array.isArray(error.details)) {
          const validationMessages = error.details.map((err: any) => err.message).join(', ');
          throw new Error(validationMessages);
        }
        throw new Error(error.message || 'Please check your registration details');
      }

      if (error.statusCode === 409) {
        // Use the specific error message from backend (email or phone)
        throw new Error(error.message || 'An account with this email or phone number already exists');
      }

      if (error.type === ErrorType.NETWORK_ERROR) {
        throw new Error('Network error. Please check your connection and try again.');
      }

      throw new Error(error.message || 'Registration failed. Please try again.');
    }
  }

  /**
   * Logout user and clear authentication data
   */
  public async logout(): Promise<void> {
    try {
      // Call logout endpoint if authenticated
      if (this.isAuthenticated()) {
        await apiClient.post('/auth/logout', {
          refreshToken: this.refreshTokenValue
        });
      }
    } catch (error) {
      // Log error but don't throw - we still want to clear local data
      console.error('Error during logout API call:', error);
    } finally {
      // Always clear authentication data locally
      this.clearAuthData();
    }
  }

  /**
   * Refresh authentication token
   * Note: Backend uses HTTP-only cookies for refresh token, so we don't need to send it in the body
   */
  public async refreshToken(): Promise<string> {
    try {
      // Call refresh endpoint without body - the refresh token is in HTTP-only cookies
      // and will be sent automatically by the browser
      const response: ApiResponse<{ token: string; refreshToken: string }> = await apiClient.post(
        '/auth/refresh',
        {}, // Empty body - refresh token is in cookies
        { requiresAuth: false }
      );

      if (!response.success || !response.data) {
        throw new Error(response.message || 'Token refresh failed');
      }

      // Update tokens (though they're mainly in cookies)
      this.authToken = response.data.token;
      this.refreshTokenValue = response.data.refreshToken;

      // Save to secure storage for reference
      if (typeof window !== 'undefined') {
        const tokenData: TokenData = {
          accessToken: response.data.token,
          refreshToken: response.data.refreshToken,
          expiresAt: new Date(Date.now() + 3600000).toISOString(), // 1 hour default
          tokenType: 'Bearer'
        };

        tokenStorage.storeTokens(tokenData, {
          secure: window.location.protocol === 'https:',
          sameSite: 'strict'
        });
      }

      // Update API client
      apiClient.setAuthTokens(response.data.token, response.data.refreshToken);

      return response.data.token;
    } catch (error: any) {
      // Only clear auth data on explicit 401 (invalid refresh token).
      // Do NOT clear on network errors or 5xx — the session may still be valid.
      const status = error?.response?.status || error?.status || error?.statusCode;
      if (status === 401) {
        this.clearAuthData();
        throw new Error('Session expired. Please login again.');
      }

      // For any other error (network, 5xx, etc.) just throw without clearing
      throw new Error(error.message || 'Failed to refresh authentication token');
    }
  }

  /**
   * Get current authenticated user
   */
  public getCurrentUser(): User | null {
    return this.currentUser;
  }

  /**
   * Check if user is authenticated
   */
  public isAuthenticated(): boolean {
    // With HTTP-only cookies, we just check if user data exists
    return !!this.currentUser;
  }

  /**
   * Get current authentication token
   */
  public getAuthToken(): string | null {
    return this.authToken;
  }

  /**
   * Update current user data
   */
  public updateCurrentUser(user: User): void {
    this.currentUser = user;
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('user_data', JSON.stringify(user));
    }
  }

  /**
   * Check if token is expired
   */
  public isTokenExpired(): boolean {
    // Use secure token storage for expiration check
    return tokenStorage.isAccessTokenExpired();
  }

  /**
   * Get user role
   */
  public getUserRole(): string | null {
    return this.currentUser?.role || null;
  }

  /**
   * Check if user has specific role
   */
  public hasRole(role: string): boolean {
    return this.currentUser?.role === role;
  }

  /**
   * Check if user is verified
   */
  public isUserVerified(): boolean {
    return this.currentUser?.isVerified || false;
  }

  /**
   * Get storage information for debugging
   */
  public getStorageInfo(): any {
    return tokenStorage.getStorageInfo();
  }

  /**
   * Detect potential security issues
   */
  public detectSecurityIssues(): string[] {
    const issues: string[] = [];
    
    if (typeof window !== 'undefined') {
      // Check if running over HTTP in production
      if (window.location.protocol === 'http:' && window.location.hostname !== 'localhost') {
        issues.push('Application is running over HTTP in production environment');
      }

      // Check storage availability
      const storageInfo = tokenStorage.getStorageInfo();
      if (!storageInfo.cookiesAvailable && !storageInfo.localStorageAvailable) {
        issues.push('No secure storage mechanism available');
      }

      // Check if tokens exist but user is null (potential tampering)
      if (storageInfo.hasTokens && !this.currentUser) {
        issues.push('Tokens exist but user data is missing - potential tampering detected');
      }
    }

    return issues;
  }

  /**
   * Force token refresh if needed
   */
  public async ensureValidToken(): Promise<string | null> {
    if (!this.isAuthenticated()) {
      return null;
    }

    if (this.isTokenExpired()) {
      try {
        return await this.refreshToken();
      } catch (error) {
        console.error('Failed to refresh token:', error);
        this.clearAuthData();
        return null;
      }
    }

    return this.authToken;
  }

  /**
   * Send verification codes to email and phone before registration
   */
  public async sendVerificationCodes(email: string, phoneNumber: string): Promise<any> {
    try {
      const response: ApiResponse<any> = await apiClient.post(
        '/auth/send-verification-codes',
        { email, phoneNumber },
        { requiresAuth: false }
      );

      if (!response.success) {
        throw new Error(response.message || 'Failed to send verification codes');
      }

      return response.data;
    } catch (error: any) {
      if (error.statusCode === 409) {
        throw new Error(error.message || 'Email or phone number already registered');
      }
      throw new Error(error.message || 'Failed to send verification codes. Please try again.');
    }
  }

  /**
   * Verify email and phone OTPs
   */
  public async verifyRegistrationCodes(
    email: string,
    phoneNumber: string,
    emailOtp: string,
    phoneOtp: string
  ): Promise<any> {
    try {
      const response: ApiResponse<any> = await apiClient.post(
        '/auth/verify-registration-codes',
        { email, phoneNumber, emailOtp, phoneOtp },
        { requiresAuth: false }
      );

      if (!response.success) {
        throw new Error(response.message || 'Verification failed');
      }

      return response.data;
    } catch (error: any) {
      if (error.statusCode === 404) {
        throw new Error('Verification session expired. Please request new codes.');
      }
      if (error.statusCode === 429) {
        throw new Error('Too many attempts. Please request new codes.');
      }
      throw new Error(error.message || 'Verification failed. Please check your codes.');
    }
  }

  /**
   * Resend email OTP
   */
  public async resendEmailOtp(email: string, phoneNumber: string): Promise<any> {
    try {
      const response: ApiResponse<any> = await apiClient.post(
        '/auth/resend-email-otp',
        { email, phoneNumber },
        { requiresAuth: false }
      );

      if (!response.success) {
        throw new Error(response.message || 'Failed to resend email code');
      }

      return response.data;
    } catch (error: any) {
      if (error.statusCode === 429) {
        throw new Error('Please wait before requesting a new code');
      }
      throw new Error(error.message || 'Failed to resend email code. Please try again.');
    }
  }

  /**
   * Resend phone OTP with method selection
   */
  public async resendPhoneOtp(
    email: string,
    phoneNumber: string,
    method: 'sms' | 'whatsapp' | 'call' = 'sms'
  ): Promise<any> {
    try {
      const response: ApiResponse<any> = await apiClient.post(
        '/auth/resend-phone-otp',
        { email, phoneNumber, method },
        { requiresAuth: false }
      );

      if (!response.success) {
        throw new Error(response.message || 'Failed to resend phone code');
      }

      return response.data;
    } catch (error: any) {
      if (error.statusCode === 429) {
        throw new Error('Please wait before requesting a new code');
      }
      throw new Error(error.message || 'Failed to resend phone code. Please try again.');
    }
  }
}

// Create and export singleton instance
export const authService = new AuthenticationService();

// Export types for external use
export type { AuthenticationService };