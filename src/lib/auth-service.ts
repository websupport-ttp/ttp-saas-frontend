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
  logout(): Promise<void>;
  register(userData: RegisterData): Promise<AuthResponse>;
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
      const response: ApiResponse<AuthResponse> = await apiClient.post(
        '/auth/login',
        credentials,
        { requiresAuth: false }
      );

      if (!response.success || !response.data) {
        throw new Error(response.message || 'Login failed');
      }

      // Save authentication data
      this.saveAuthDataToStorage(response.data);

      return response.data;
    } catch (error: any) {
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
        throw new Error('An account with this email already exists');
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
   */
  public async refreshToken(): Promise<string> {
    if (!this.refreshTokenValue) {
      throw new Error('No refresh token available');
    }

    try {
      const response: ApiResponse<{ token: string; refreshToken: string }> = await apiClient.post(
        '/auth/refresh',
        { refreshToken: this.refreshTokenValue },
        { requiresAuth: false }
      );

      if (!response.success || !response.data) {
        throw new Error(response.message || 'Token refresh failed');
      }

      // Update tokens
      this.authToken = response.data.token;
      this.refreshTokenValue = response.data.refreshToken;

      // Save to secure storage
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
      // Clear auth data on refresh failure
      this.clearAuthData();
      
      if (error.type === ErrorType.AUTHENTICATION_ERROR) {
        throw new Error('Session expired. Please login again.');
      }

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
    return !!(this.authToken && this.refreshTokenValue && this.currentUser);
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
}

// Create and export singleton instance
export const authService = new AuthenticationService();

// Export types for external use
export type { AuthenticationService };