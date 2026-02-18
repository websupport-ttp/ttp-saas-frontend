/**
 * API Client with Loading States
 * Enhanced API client that integrates with loading context and provides
 * automatic loading state management for all API calls
 */

import { apiClient } from './api-client';
import { ApiResponse, RequestConfig } from '@/types/api';

// Global loading state manager (can be used outside React components)
class LoadingStateManager {
  private loadingStates: Map<string, boolean> = new Map();
  private listeners: Set<(states: Record<string, boolean>) => void> = new Set();

  setLoading(key: string, isLoading: boolean): void {
    this.loadingStates.set(key, isLoading);
    this.notifyListeners();
  }

  isLoading(key?: string): boolean {
    if (!key) {
      return Array.from(this.loadingStates.values()).some(Boolean);
    }
    return this.loadingStates.get(key) || false;
  }

  subscribe(listener: (states: Record<string, boolean>) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    const states = Object.fromEntries(this.loadingStates);
    this.listeners.forEach(listener => listener(states));
  }

  clear(): void {
    this.loadingStates.clear();
    this.notifyListeners();
  }
}

export const globalLoadingManager = new LoadingStateManager();

// Enhanced request configuration with loading options
export interface EnhancedRequestConfig extends RequestConfig {
  loadingKey?: string;
  showGlobalLoading?: boolean;
  silent?: boolean; // Don't show any loading indicators
  onProgress?: (progress: number) => void;
  params?: any; // Query parameters
}

// Enhanced API client with automatic loading state management
class ApiClientWithLoading {
  private generateLoadingKey(method: string, url: string): string {
    return `${method.toLowerCase()}_${url.replace(/[^a-zA-Z0-9]/g, '_')}`;
  }

  private async withLoading<T>(
    operation: () => Promise<T>,
    config?: EnhancedRequestConfig,
    method?: string,
    url?: string
  ): Promise<T> {
    if (config?.silent) {
      return operation();
    }

    const loadingKey = config?.loadingKey || 
      (method && url ? this.generateLoadingKey(method, url) : 'api_call');

    try {
      globalLoadingManager.setLoading(loadingKey, true);
      const result = await operation();
      return result;
    } finally {
      globalLoadingManager.setLoading(loadingKey, false);
    }
  }

  async get<T>(url: string, config?: EnhancedRequestConfig): Promise<ApiResponse<T>> {
    return this.withLoading(
      () => apiClient.get<T>(url, config),
      config,
      'GET',
      url
    );
  }

  async post<T>(url: string, data?: any, config?: EnhancedRequestConfig): Promise<ApiResponse<T>> {
    return this.withLoading(
      () => apiClient.post<T>(url, data, config),
      config,
      'POST',
      url
    );
  }

  async put<T>(url: string, data?: any, config?: EnhancedRequestConfig): Promise<ApiResponse<T>> {
    return this.withLoading(
      () => apiClient.put<T>(url, data, config),
      config,
      'PUT',
      url
    );
  }

  async delete<T>(url: string, config?: EnhancedRequestConfig): Promise<ApiResponse<T>> {
    return this.withLoading(
      () => apiClient.delete<T>(url, config),
      config,
      'DELETE',
      url
    );
  }

  async upload<T>(
    url: string, 
    file: File, 
    config?: EnhancedRequestConfig & { onUploadProgress?: (progress: number) => void }
  ): Promise<ApiResponse<T>> {
    const loadingKey = config?.loadingKey || `upload_${url.replace(/[^a-zA-Z0-9]/g, '_')}`;

    if (!config?.silent) {
      globalLoadingManager.setLoading(loadingKey, true);
    }

    try {
      const result = await apiClient.upload<T>(url, file, {
        ...config,
        onUploadProgress: (progress) => {
          if (config?.onProgress) {
            config.onProgress(progress);
          }
          if (config?.onUploadProgress) {
            config.onUploadProgress(progress);
          }
        }
      });
      return result;
    } finally {
      if (!config?.silent) {
        globalLoadingManager.setLoading(loadingKey, false);
      }
    }
  }

  // Utility methods for common loading patterns
  async search<T>(
    url: string, 
    params?: any, 
    config?: Omit<EnhancedRequestConfig, 'loadingKey'>
  ): Promise<ApiResponse<T>> {
    return this.get<T>(url, {
      ...config,
      loadingKey: 'search',
      params
    });
  }

  async submit<T>(
    url: string, 
    data: any, 
    config?: Omit<EnhancedRequestConfig, 'loadingKey'>
  ): Promise<ApiResponse<T>> {
    return this.post<T>(url, data, {
      ...config,
      loadingKey: 'submit'
    });
  }

  async fetchData<T>(
    url: string, 
    config?: Omit<EnhancedRequestConfig, 'loadingKey'>
  ): Promise<ApiResponse<T>> {
    return this.get<T>(url, {
      ...config,
      loadingKey: 'fetch'
    });
  }

  // Batch operations with loading management
  async batch<T>(
    operations: Array<() => Promise<T>>,
    config?: { loadingKey?: string; concurrent?: boolean }
  ): Promise<T[]> {
    const loadingKey = config?.loadingKey || 'batch_operation';
    
    try {
      globalLoadingManager.setLoading(loadingKey, true);
      
      if (config?.concurrent) {
        return Promise.all(operations.map(op => op()));
      } else {
        const results: T[] = [];
        for (const operation of operations) {
          results.push(await operation());
        }
        return results;
      }
    } finally {
      globalLoadingManager.setLoading(loadingKey, false);
    }
  }

  // Proxy methods to access original API client functionality
  setAuthTokens(authToken: string, refreshToken: string): void {
    apiClient.setAuthTokens(authToken, refreshToken);
  }

  clearAuthTokens(): void {
    apiClient.clearAuthTokens();
  }

  isAuthenticated(): boolean {
    return apiClient.isAuthenticated();
  }
}

// Create enhanced API client instance
export const apiClientWithLoading = new ApiClientWithLoading();