/**
 * API Client Service
 * Centralized HTTP client with axios configuration, interceptors, and error handling
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { 
  ApiResponse, 
  RequestConfig, 
  AppError, 
  ErrorType 
} from '@/types/api';
import { appConfig, isDevelopment } from './config';

// API Client Configuration
interface ApiClientConfig {
  baseURL: string;
  timeout: number;
  retries: number;
  retryDelay: number;
}

class ApiClient {
  private axiosInstance: AxiosInstance;
  private config: ApiClientConfig;
  private authToken: string | null = null;
  private refreshToken: string | null = null;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (value: any) => void;
    reject: (error: any) => void;
  }> = [];

  constructor(config: ApiClientConfig) {
    this.config = config;
    this.axiosInstance = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    this.setupInterceptors();
    this.loadTokensFromStorage();
  }

  /**
   * Load authentication tokens from storage
   */
  private loadTokensFromStorage(): void {
    if (typeof window !== 'undefined') {
      this.authToken = localStorage.getItem('auth_token');
      this.refreshToken = localStorage.getItem('refresh_token');
    }
  }

  /**
   * Save authentication tokens to storage
   */
  private saveTokensToStorage(authToken: string, refreshToken: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', authToken);
      localStorage.setItem('refresh_token', refreshToken);
      this.authToken = authToken;
      this.refreshToken = refreshToken;
    }
  }

  /**
   * Clear authentication tokens from storage
   */
  private clearTokensFromStorage(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      this.authToken = null;
      this.refreshToken = null;
    }
  }

  /**
   * Setup request and response interceptors
   */
  private setupInterceptors(): void {
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // Add authentication header if token exists and not explicitly disabled
        if (this.authToken && !config.headers.Authorization && config.headers['X-Skip-Auth'] !== 'true') {
          config.headers.Authorization = `Bearer ${this.authToken}`;
        }

        // Remove the skip auth header if it exists (internal use only)
        if (config.headers['X-Skip-Auth']) {
          delete config.headers['X-Skip-Auth'];
        }

        // Keep X-Guest-Request header for response interceptor to check

        // Add request ID for tracking
        config.headers['X-Request-ID'] = this.generateRequestId();

        // Add timestamp for request timing
        config.metadata = { startTime: Date.now() };

        // Add user agent information
        if (typeof window !== 'undefined') {
          config.headers['X-Client-Version'] = '1.0.0';
          config.headers['X-Client-Platform'] = 'web';
        }



        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response) => {
        // Calculate request duration
        const duration = response.config.metadata?.startTime 
          ? Date.now() - response.config.metadata.startTime 
          : 0;

        // Log response in development

        // Transform backend response format to frontend format if needed
        if (response.data && typeof response.data === 'object' && response.data.status) {
          // Backend uses { status: 'success'|'error'|'fail', message, data }
          // Frontend expects { success: boolean, message, data }
          const backendResponse = response.data;
          
          // Check for errors BEFORE transformation
          if (backendResponse.status === 'error' || backendResponse.status === 'fail') {
            const apiError = new Error(backendResponse.message || 'API returned error');
            (apiError as any).response = response;
            (apiError as any).isApiError = true;
            throw apiError;
          }
          
          // Transform to frontend format
          response.data = {
            success: backendResponse.status === 'success',
            message: backendResponse.message,
            data: backendResponse.data,
            errors: backendResponse.errors,
            meta: backendResponse.meta
          };
        } else {
          // Check for API-level errors in responses that don't use status field
          if (response.data && typeof response.data === 'object' && response.data.success === false) {
            const apiError = new Error(response.data.message || 'API returned error');
            (apiError as any).response = response;
            (apiError as any).isApiError = true;
            throw apiError;
          }
        }

        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };



        // Handle 401 errors with token refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
          // Skip token refresh for auth endpoints to avoid infinite loops
          const isAuthEndpoint = originalRequest.url?.includes('/auth/');
          // Check if this is a guest request that should not redirect
          const isGuestRequest = originalRequest.headers?.['X-Guest-Request'] === 'true';
          
          if (!isAuthEndpoint && !isGuestRequest && this.refreshToken) {
            if (this.isRefreshing) {
              // If already refreshing, queue the request
              return new Promise((resolve, reject) => {
                this.failedQueue.push({ resolve, reject });
              }).then((token) => {
                if (originalRequest.headers) {
                  originalRequest.headers.Authorization = `Bearer ${token}`;
                }
                return this.axiosInstance(originalRequest);
              }).catch((err) => {
                return Promise.reject(err);
              });
            }

            originalRequest._retry = true;
            this.isRefreshing = true;

            try {
              const newToken = await this.refreshAuthToken();
              this.processQueue(null, newToken);
              
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
              }
              
              return this.axiosInstance(originalRequest);
            } catch (refreshError) {
              this.processQueue(refreshError, null);
              this.clearTokensFromStorage();
              
              // Import auth service to handle logout properly
              try {
                const { authService } = await import('./auth-service');
                await authService.clearAuthData();
              } catch (importError) {
                console.error('Error importing auth service:', importError);
              }
              
              // Redirect to login page
              if (typeof window !== 'undefined') {
                window.location.href = '/auth/login';
              }
              
              return Promise.reject(refreshError);
            } finally {
              this.isRefreshing = false;
            }
          } else {
            // For auth endpoints or when no refresh token, clear auth data and redirect
            this.clearTokensFromStorage();
            
            // Only redirect if it's not a guest request and not an auth endpoint
            if (typeof window !== 'undefined' && !isAuthEndpoint && !isGuestRequest) {
              window.location.href = '/auth/login';
            }
          }
        }

        // Handle rate limiting with exponential backoff
        if (error.response?.status === 429) {
          const retryAfter = error.response.headers['retry-after'];
          const delay = retryAfter ? parseInt(retryAfter) * 1000 : Math.min(1000 * Math.pow(2, (originalRequest._retryCount || 0)), 30000);
          
          originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;
          
          if (originalRequest._retryCount <= 3) {
            await this.delay(delay);
            return this.axiosInstance(originalRequest);
          }
        }

        return Promise.reject(this.handleError(error));
      }
    );
  }

  /**
   * Process queued requests after token refresh
   */
  private processQueue(error: any, token: string | null): void {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        resolve(token);
      }
    });

    this.failedQueue = [];
  }

  /**
   * Refresh authentication token using auth service
   */
  private async refreshAuthToken(): Promise<string> {
    // Import auth service dynamically to avoid circular dependency
    const { authService } = await import('./auth-service');
    
    try {
      const newToken = await authService.refreshToken();
      return newToken;
    } catch (error) {
      this.clearTokensFromStorage();
      throw error;
    }
  }

  /**
   * Generate unique request ID
   */
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Handle and transform errors
   */
  private handleError(error: AxiosError): AppError {
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      return {
        type: ErrorType.TIMEOUT_ERROR,
        message: 'Request timeout. Please try again.',
        statusCode: 408,
      };
    }

    if (!error.response) {
      return {
        type: ErrorType.NETWORK_ERROR,
        message: 'Network error. Please check your connection.',
        details: error.message,
      };
    }

    const { status, data } = error.response;
    const responseData = data as any; // Type assertion for response data

    switch (status) {
      case 400:
        return {
          type: ErrorType.VALIDATION_ERROR,
          message: responseData?.message || 'Invalid request data',
          details: responseData?.errors,
          statusCode: status,
        };
      case 401:
        return {
          type: ErrorType.AUTHENTICATION_ERROR,
          message: responseData?.message || 'Authentication required',
          statusCode: status,
        };
      case 404:
        return {
          type: ErrorType.NOT_FOUND,
          message: responseData?.message || 'Resource not found',
          statusCode: status,
        };
      case 429:
        return {
          type: ErrorType.RATE_LIMIT,
          message: responseData?.message || 'Too many requests. Please try again later.',
          statusCode: status,
        };
      case 500:
      default:
        return {
          type: ErrorType.SERVER_ERROR,
          message: responseData?.message || 'Internal server error',
          statusCode: status,
          details: responseData,
        };
    }
  }

  /**
   * Retry logic for failed requests
   */
  private async retryRequest<T>(
    requestFn: () => Promise<AxiosResponse<T>>,
    retries: number = this.config.retries
  ): Promise<AxiosResponse<T>> {
    try {
      return await requestFn();
    } catch (error) {
      if (retries > 0 && this.shouldRetry(error as AxiosError)) {
        await this.delay(this.config.retryDelay);
        return this.retryRequest(requestFn, retries - 1);
      }
      throw error;
    }
  }

  /**
   * Determine if request should be retried
   */
  private shouldRetry(error: AxiosError): boolean {
    // Retry on network errors or 5xx server errors
    return !error.response || (error.response.status >= 500 && error.response.status < 600);
  }

  /**
   * Delay utility for retry logic
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Set authentication tokens
   */
  public setAuthTokens(authToken: string, refreshToken: string): void {
    this.saveTokensToStorage(authToken, refreshToken);
  }

  /**
   * Clear authentication tokens
   */
  public clearAuthTokens(): void {
    this.clearTokensFromStorage();
  }

  /**
   * Check if user is authenticated
   */
  public isAuthenticated(): boolean {
    return !!this.authToken;
  }

  /**
   * GET request
   */
  public async get<T>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    const requestConfig: AxiosRequestConfig = {
      ...config,
      headers: {
        ...config?.headers,
      },
    };

    if (config?.requiresAuth === false) {
      requestConfig.headers = requestConfig.headers || {};
      requestConfig.headers['X-Skip-Auth'] = 'true';
    }

    const response = await this.retryRequest(() => 
      this.axiosInstance.get<ApiResponse<T>>(url, requestConfig),
      config?.retries
    );

    return response.data;
  }

  /**
   * POST request
   */
  public async post<T>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    const requestConfig: AxiosRequestConfig = {
      ...config,
      headers: {
        ...config?.headers,
      },
    };

    if (config?.requiresAuth === false) {
      requestConfig.headers = requestConfig.headers || {};
      requestConfig.headers['X-Skip-Auth'] = 'true';
      requestConfig.headers['X-Guest-Request'] = 'true';
    }

    const response = await this.retryRequest(() => 
      this.axiosInstance.post<ApiResponse<T>>(url, data, requestConfig),
      config?.retries
    );

    return response.data;
  }

  /**
   * PUT request
   */
  public async put<T>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    const requestConfig: AxiosRequestConfig = {
      ...config,
      headers: {
        ...config?.headers,
      },
    };

    if (config?.requiresAuth === false) {
      requestConfig.headers = requestConfig.headers || {};
      requestConfig.headers['X-Skip-Auth'] = 'true';
    }

    const response = await this.retryRequest(() => 
      this.axiosInstance.put<ApiResponse<T>>(url, data, requestConfig),
      config?.retries
    );

    return response.data;
  }

  /**
   * DELETE request
   */
  public async delete<T>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    const requestConfig: AxiosRequestConfig = {
      ...config,
      headers: {
        ...config?.headers,
      },
    };

    if (config?.requiresAuth === false) {
      requestConfig.headers = requestConfig.headers || {};
      requestConfig.headers['X-Skip-Auth'] = 'true';
    }

    const response = await this.retryRequest(() => 
      this.axiosInstance.delete<ApiResponse<T>>(url, requestConfig),
      config?.retries
    );

    return response.data;
  }

  /**
   * File upload request
   */
  public async upload<T>(
    url: string, 
    file: File, 
    config?: RequestConfig & { onUploadProgress?: (progress: number) => void }
  ): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);

    const requestConfig: AxiosRequestConfig = {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config?.headers,
      },
      onUploadProgress: (progressEvent) => {
        if (config?.onUploadProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          config.onUploadProgress(progress);
        }
      },
    };

    const response = await this.axiosInstance.post<ApiResponse<T>>(url, formData, requestConfig);
    return response.data;
  }
}

// Create and configure API client instance
const createApiClient = (): ApiClient => {
  const config: ApiClientConfig = {
    baseURL: appConfig.apiBaseUrl || process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api/v1',
    timeout: appConfig.apiTimeout || 30000,
    retries: 3,
    retryDelay: 1000,
  };

  return new ApiClient(config);
};

// Export singleton instance
export const apiClient = createApiClient();

// Export types for external use
export type { ApiClient, ApiClientConfig };