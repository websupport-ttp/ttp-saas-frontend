'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

// Types
interface LoadingState {
  [key: string]: {
    isLoading: boolean;
    message?: string;
    progress?: number;
  };
}

interface LoadingContextType {
  loading: LoadingState;
  setLoading: (key: string, loading: boolean, message?: string, progress?: number) => void;
  isLoading: (key: string) => boolean;
  getLoadingMessage: (key: string) => string | undefined;
  getLoadingProgress: (key: string) => number | undefined;
  clearLoading: (key: string) => void;
  clearAllLoading: () => void;
  withLoading: (key: string, asyncFn: () => Promise<any>, message?: string) => Promise<any>;
}

interface LoadingProviderProps {
  children: ReactNode;
}

// Context
const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

// Provider
export function LoadingProvider({ children }: LoadingProviderProps) {
  const [loadingState, setLoadingState] = useState<LoadingState>({});

  const setLoading = useCallback((
    key: string, 
    loading: boolean, 
    message?: string, 
    progress?: number
  ) => {
    setLoadingState(prev => ({
      ...prev,
      [key]: loading ? { isLoading: true, message, progress } : { isLoading: false }
    }));
  }, []);

  const isLoading = useCallback((key: string): boolean => {
    return loadingState[key]?.isLoading || false;
  }, [loadingState]);

  const getLoadingMessage = useCallback((key: string): string | undefined => {
    return loadingState[key]?.message;
  }, [loadingState]);

  const getLoadingProgress = useCallback((key: string): number | undefined => {
    return loadingState[key]?.progress;
  }, [loadingState]);

  const clearLoading = useCallback((key: string) => {
    setLoadingState(prev => {
      const newState = { ...prev };
      delete newState[key];
      return newState;
    });
  }, []);

  const clearAllLoading = useCallback(() => {
    setLoadingState({});
  }, []);

  const withLoading = useCallback((
    key: string,
    asyncFn: () => Promise<any>,
    message?: string
  ): Promise<any> => {
    return (async () => {
      try {
        setLoading(key, true, message);
        const result = await asyncFn();
        return result;
      } finally {
        setLoading(key, false);
      }
    })();
  }, [setLoading]);

  const value: LoadingContextType = {
    loading: loadingState,
    setLoading,
    isLoading,
    getLoadingMessage,
    getLoadingProgress,
    clearLoading,
    clearAllLoading,
    withLoading
  };

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
}

// Specialized hooks for common loading scenarios
export function useApiLoading() {
  const { setLoading, isLoading, withLoading } = useLoading();

  return {
    // Search operations
    isSearching: isLoading('search'),
    setSearching: (loading: boolean, message?: string) => setLoading('search', loading, message),
    withSearch: (asyncFn: () => Promise<any>) => withLoading('search', asyncFn, 'Searching...'),

    // Form submissions
    isSubmitting: isLoading('submit'),
    setSubmitting: (loading: boolean, message?: string) => setLoading('submit', loading, message),
    withSubmit: (asyncFn: () => Promise<any>) => withLoading('submit', asyncFn, 'Submitting...'),

    // File uploads
    isUploading: isLoading('upload'),
    setUploading: (loading: boolean, message?: string, progress?: number) => 
      setLoading('upload', loading, message, progress),
    withUpload: (asyncFn: () => Promise<any>) => withLoading('upload', asyncFn, 'Uploading...'),

    // Payment verification
    isVerifying: isLoading('verify'),
    setVerifying: (loading: boolean, message?: string) => setLoading('verify', loading, message),
    withVerify: (asyncFn: () => Promise<any>) => withLoading('verify', asyncFn, 'Verifying payment...'),

    // Data fetching
    isFetching: isLoading('fetch'),
    setFetching: (loading: boolean, message?: string) => setLoading('fetch', loading, message),
    withFetch: (asyncFn: () => Promise<any>) => withLoading('fetch', asyncFn, 'Loading data...'),

    // Booking operations
    isBooking: isLoading('booking'),
    setBooking: (loading: boolean, message?: string) => setLoading('booking', loading, message),
    withBooking: (asyncFn: () => Promise<any>) => withLoading('booking', asyncFn, 'Processing booking...'),
  };
}

// Hook for page-level loading states
export function usePageLoading() {
  const { setLoading, isLoading, clearLoading } = useLoading();

  return {
    isPageLoading: isLoading('page'),
    setPageLoading: (loading: boolean, message?: string) => setLoading('page', loading, message),
    clearPageLoading: () => clearLoading('page'),
  };
}

// Hook for component-level loading states
export function useComponentLoading(componentName: string) {
  const { setLoading, isLoading, clearLoading, withLoading } = useLoading();

  return {
    isLoading: isLoading(componentName),
    setLoading: (loading: boolean, message?: string) => setLoading(componentName, loading, message),
    clearLoading: () => clearLoading(componentName),
    withLoading: (asyncFn: () => Promise<any>, message?: string) => 
      withLoading(componentName, asyncFn, message),
  };
}