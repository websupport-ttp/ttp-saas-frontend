/**
 * Secure Token Storage
 * Handles secure storage of authentication tokens with fallback mechanisms
 */

import { appConfig } from './config';

export interface TokenData {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  tokenType?: string;
}

export interface StorageOptions {
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
  domain?: string;
  path?: string;
}

class TokenStorage {
  private readonly ACCESS_TOKEN_KEY = appConfig.authCookieName;
  private readonly REFRESH_TOKEN_KEY = appConfig.refreshTokenName;
  private readonly TOKEN_DATA_KEY = 'token_data';
  private readonly STORAGE_VERSION_KEY = 'token_storage_version';
  private readonly CURRENT_VERSION = '1.0';

  /**
   * Check if we're in a browser environment
   */
  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  /**
   * Check if cookies are available and working
   */
  private areCookiesAvailable(): boolean {
    if (!this.isBrowser()) return false;
    
    try {
      // Test cookie functionality
      const testKey = 'test_cookie';
      document.cookie = `${testKey}=test; path=/`;
      const cookieExists = document.cookie.includes(`${testKey}=test`);
      
      // Clean up test cookie
      if (cookieExists) {
        document.cookie = `${testKey}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
      }
      
      return cookieExists;
    } catch (error) {
      return false;
    }
  }

  /**
   * Check if localStorage is available and working
   */
  private isLocalStorageAvailable(): boolean {
    if (!this.isBrowser()) return false;
    
    try {
      const testKey = 'test_storage';
      localStorage.setItem(testKey, 'test');
      const value = localStorage.getItem(testKey);
      localStorage.removeItem(testKey);
      return value === 'test';
    } catch (error) {
      return false;
    }
  }

  /**
   * Set secure cookie with proper options
   */
  private setCookie(
    name: string, 
    value: string, 
    options: StorageOptions = {}
  ): void {
    if (!this.isBrowser()) return;

    const {
      secure = window.location.protocol === 'https:',
      httpOnly = false, // Note: httpOnly can't be set from client-side JS
      sameSite = 'lax',
      domain,
      path = '/',
    } = options;

    let cookieString = `${name}=${encodeURIComponent(value)}; path=${path}`;

    if (secure) {
      cookieString += '; Secure';
    }

    cookieString += `; SameSite=${sameSite}`;

    if (domain) {
      cookieString += `; Domain=${domain}`;
    }

    // Set expiration to 7 days for refresh token, 1 hour for access token
    const isRefreshToken = name === this.REFRESH_TOKEN_KEY;
    const expirationDays = isRefreshToken ? 7 : 1/24; // 1 hour for access token
    const expirationDate = new Date();
    expirationDate.setTime(expirationDate.getTime() + (expirationDays * 24 * 60 * 60 * 1000));
    cookieString += `; Expires=${expirationDate.toUTCString()}`;

    try {
      document.cookie = cookieString;
    } catch (error) {
      console.error('Error setting cookie:', error);
    }
  }

  /**
   * Get cookie value
   */
  private getCookie(name: string): string | null {
    if (!this.isBrowser()) return null;

    try {
      const nameEQ = name + '=';
      const cookies = document.cookie.split(';');
      
      for (let cookie of cookies) {
        let c = cookie.trim();
        if (c.indexOf(nameEQ) === 0) {
          return decodeURIComponent(c.substring(nameEQ.length));
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error getting cookie:', error);
      return null;
    }
  }

  /**
   * Delete cookie
   */
  private deleteCookie(name: string, options: StorageOptions = {}): void {
    if (!this.isBrowser()) return;

    const { domain, path = '/' } = options;
    
    let cookieString = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}`;
    
    if (domain) {
      cookieString += `; Domain=${domain}`;
    }

    try {
      document.cookie = cookieString;
    } catch (error) {
      console.error('Error deleting cookie:', error);
    }
  }

  /**
   * Encrypt token data (basic implementation)
   */
  private encryptToken(token: string): string {
    if (!this.isBrowser()) return token;
    
    try {
      // Basic encoding - in production, use proper encryption
      return btoa(encodeURIComponent(token));
    } catch (error) {
      console.error('Error encrypting token:', error);
      return token;
    }
  }

  /**
   * Decrypt token data (basic implementation)
   */
  private decryptToken(encryptedToken: string): string {
    if (!this.isBrowser()) return encryptedToken;
    
    try {
      // Basic decoding - in production, use proper decryption
      return decodeURIComponent(atob(encryptedToken));
    } catch (error) {
      console.error('Error decrypting token:', error);
      return encryptedToken;
    }
  }

  /**
   * Validate token format and expiration
   */
  private isTokenValid(token: string): boolean {
    if (!token) return false;

    try {
      // Basic JWT validation
      const parts = token.split('.');
      if (parts.length !== 3) return false;

      // Check expiration
      const payload = JSON.parse(atob(parts[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      
      return payload.exp > currentTime;
    } catch (error) {
      return false;
    }
  }

  /**
   * Detect potential token tampering
   */
  private detectTampering(tokenData: TokenData): boolean {
    try {
      // Check if tokens are properly formatted
      if (!this.isTokenValid(tokenData.accessToken)) {
        return true;
      }

      // Check if expiration time makes sense
      const expiresAt = new Date(tokenData.expiresAt);
      const now = new Date();
      
      if (expiresAt <= now) {
        return true;
      }

      // Additional tampering checks can be added here
      return false;
    } catch (error) {
      return true; // Assume tampering if we can't validate
    }
  }

  /**
   * Store tokens securely
   */
  public storeTokens(tokenData: TokenData, options: StorageOptions = {}): boolean {
    if (!this.isBrowser()) return false;

    try {
      // Store version for migration purposes
      if (this.isLocalStorageAvailable()) {
        localStorage.setItem(this.STORAGE_VERSION_KEY, this.CURRENT_VERSION);
      }

      const cookiesAvailable = this.areCookiesAvailable();
      const localStorageAvailable = this.isLocalStorageAvailable();

      // Prefer cookies for refresh token (more secure)
      if (cookiesAvailable) {
        // Store refresh token in cookie (httpOnly would be set server-side)
        this.setCookie(this.REFRESH_TOKEN_KEY, this.encryptToken(tokenData.refreshToken), {
          secure: true,
          sameSite: 'strict',
          ...options
        });

        // Store access token in cookie as well for better security
        this.setCookie(this.ACCESS_TOKEN_KEY, this.encryptToken(tokenData.accessToken), {
          secure: true,
          sameSite: 'strict',
          ...options
        });
      }

      // Fallback to localStorage if cookies not available
      if (localStorageAvailable) {
        // Store encrypted tokens
        localStorage.setItem(this.ACCESS_TOKEN_KEY, this.encryptToken(tokenData.accessToken));
        localStorage.setItem(this.REFRESH_TOKEN_KEY, this.encryptToken(tokenData.refreshToken));
        
        // Store token metadata
        localStorage.setItem(this.TOKEN_DATA_KEY, JSON.stringify({
          expiresAt: tokenData.expiresAt,
          tokenType: tokenData.tokenType || 'Bearer',
          storedAt: new Date().toISOString()
        }));
      }

      return true;
    } catch (error) {
      console.error('Error storing tokens:', error);
      return false;
    }
  }

  /**
   * Retrieve tokens from storage
   */
  public getTokens(): TokenData | null {
    if (!this.isBrowser()) return null;

    try {
      let accessToken: string | null = null;
      let refreshToken: string | null = null;
      let tokenMetadata: any = null;

      // Try to get from cookies first
      if (this.areCookiesAvailable()) {
        const cookieAccessToken = this.getCookie(this.ACCESS_TOKEN_KEY);
        const cookieRefreshToken = this.getCookie(this.REFRESH_TOKEN_KEY);

        if (cookieAccessToken) {
          accessToken = this.decryptToken(cookieAccessToken);
        }
        if (cookieRefreshToken) {
          refreshToken = this.decryptToken(cookieRefreshToken);
        }
      }

      // Fallback to localStorage
      if ((!accessToken || !refreshToken) && this.isLocalStorageAvailable()) {
        if (!accessToken) {
          const storageAccessToken = localStorage.getItem(this.ACCESS_TOKEN_KEY);
          if (storageAccessToken) {
            accessToken = this.decryptToken(storageAccessToken);
          }
        }

        if (!refreshToken) {
          const storageRefreshToken = localStorage.getItem(this.REFRESH_TOKEN_KEY);
          if (storageRefreshToken) {
            refreshToken = this.decryptToken(storageRefreshToken);
          }
        }

        // Get metadata
        const metadataString = localStorage.getItem(this.TOKEN_DATA_KEY);
        if (metadataString) {
          tokenMetadata = JSON.parse(metadataString);
        }
      }

      // Return null if we don't have both tokens
      if (!accessToken || !refreshToken) {
        return null;
      }

      const tokenData: TokenData = {
        accessToken,
        refreshToken,
        expiresAt: tokenMetadata?.expiresAt || new Date(Date.now() + 3600000).toISOString(), // 1 hour default
        tokenType: tokenMetadata?.tokenType || 'Bearer'
      };

      // Check for tampering
      if (this.detectTampering(tokenData)) {
        console.warn('Token tampering detected, clearing tokens');
        this.clearTokens();
        return null;
      }

      return tokenData;
    } catch (error) {
      console.error('Error retrieving tokens:', error);
      return null;
    }
  }

  /**
   * Clear all stored tokens
   */
  public clearTokens(): void {
    if (!this.isBrowser()) return;

    try {
      // Clear cookies
      if (this.areCookiesAvailable()) {
        this.deleteCookie(this.ACCESS_TOKEN_KEY);
        this.deleteCookie(this.REFRESH_TOKEN_KEY);
      }

      // Clear localStorage
      if (this.isLocalStorageAvailable()) {
        localStorage.removeItem(this.ACCESS_TOKEN_KEY);
        localStorage.removeItem(this.REFRESH_TOKEN_KEY);
        localStorage.removeItem(this.TOKEN_DATA_KEY);
        localStorage.removeItem(this.STORAGE_VERSION_KEY);
      }
    } catch (error) {
      console.error('Error clearing tokens:', error);
    }
  }

  /**
   * Check if tokens exist
   */
  public hasTokens(): boolean {
    return this.getTokens() !== null;
  }

  /**
   * Check if access token is expired
   */
  public isAccessTokenExpired(): boolean {
    const tokenData = this.getTokens();
    if (!tokenData) return true;

    try {
      const expiresAt = new Date(tokenData.expiresAt);
      const now = new Date();
      const bufferTime = 5 * 60 * 1000; // 5 minutes buffer
      
      return expiresAt.getTime() - bufferTime <= now.getTime();
    } catch (error) {
      return true;
    }
  }

  /**
   * Update access token (keeping refresh token)
   */
  public updateAccessToken(newAccessToken: string, expiresAt: string): boolean {
    const currentTokens = this.getTokens();
    if (!currentTokens) return false;

    return this.storeTokens({
      ...currentTokens,
      accessToken: newAccessToken,
      expiresAt
    });
  }

  /**
   * Get storage info for debugging
   */
  public getStorageInfo(): {
    cookiesAvailable: boolean;
    localStorageAvailable: boolean;
    hasTokens: boolean;
    version: string | null;
  } {
    return {
      cookiesAvailable: this.areCookiesAvailable(),
      localStorageAvailable: this.isLocalStorageAvailable(),
      hasTokens: this.hasTokens(),
      version: this.isLocalStorageAvailable() ? 
        localStorage.getItem(this.STORAGE_VERSION_KEY) : null
    };
  }
}

// Export singleton instance
export const tokenStorage = new TokenStorage();

// Export types
export type { TokenStorage };