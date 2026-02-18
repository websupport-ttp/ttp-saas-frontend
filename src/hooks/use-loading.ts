'use client';

import { useState, useCallback, useRef } from 'react';

export interface LoadingState {
  [key: string]: boolean;
}

export interface UseLoadingReturn {
  loading: LoadingState;
  isLoading: (key?: string) => boolean;
  setLoading: (key: string, loading: boolean) => void;
  startLoading: (key: string) => void;
  stopLoading: (key: string) => void;
  withLoading: <T>(key: string, asyncFn: () => Promise<T>) => Promise<T>;
  clearAll: () => void;
}

export function useLoading(initialState: LoadingState = {}): UseLoadingReturn {
  const [loading, setLoadingState] = useState<LoadingState>(initialState);
  const loadingRef = useRef<LoadingState>(initialState);

  // Update ref when state changes
  loadingRef.current = loading;

  const isLoading = useCallback((key?: string): boolean => {
    if (!key) {
      return Object.values(loadingRef.current).some(Boolean);
    }
    return Boolean(loadingRef.current[key]);
  }, []);

  const setLoading = useCallback((key: string, isLoading: boolean) => {
    setLoadingState(prev => ({
      ...prev,
      [key]: isLoading
    }));
  }, []);

  const startLoading = useCallback((key: string) => {
    setLoading(key, true);
  }, [setLoading]);

  const stopLoading = useCallback((key: string) => {
    setLoading(key, false);
  }, [setLoading]);

  const withLoading = useCallback(async <T>(
    key: string, 
    asyncFn: () => Promise<T>
  ): Promise<T> => {
    try {
      startLoading(key);
      const result = await asyncFn();
      return result;
    } finally {
      stopLoading(key);
    }
  }, [startLoading, stopLoading]);

  const clearAll = useCallback(() => {
    setLoadingState({});
  }, []);

  return {
    loading,
    isLoading,
    setLoading,
    startLoading,
    stopLoading,
    withLoading,
    clearAll
  };
}

// Specialized hook for API calls
export interface UseApiLoadingReturn extends UseLoadingReturn {
  isSearching: boolean;
  isSubmitting: boolean;
  isUploading: boolean;
  isVerifying: boolean;
  setSearching: (loading: boolean) => void;
  setSubmitting: (loading: boolean) => void;
  setUploading: (loading: boolean) => void;
  setVerifying: (loading: boolean) => void;
  withSearch: <T>(asyncFn: () => Promise<T>) => Promise<T>;
  withSubmit: <T>(asyncFn: () => Promise<T>) => Promise<T>;
  withUpload: <T>(asyncFn: () => Promise<T>) => Promise<T>;
  withVerify: <T>(asyncFn: () => Promise<T>) => Promise<T>;
}

export function useApiLoading(): UseApiLoadingReturn {
  const baseLoading = useLoading();

  const isSearching = baseLoading.isLoading('search');
  const isSubmitting = baseLoading.isLoading('submit');
  const isUploading = baseLoading.isLoading('upload');
  const isVerifying = baseLoading.isLoading('verify');

  const setSearching = useCallback((loading: boolean) => {
    baseLoading.setLoading('search', loading);
  }, [baseLoading]);

  const setSubmitting = useCallback((loading: boolean) => {
    baseLoading.setLoading('submit', loading);
  }, [baseLoading]);

  const setUploading = useCallback((loading: boolean) => {
    baseLoading.setLoading('upload', loading);
  }, [baseLoading]);

  const setVerifying = useCallback((loading: boolean) => {
    baseLoading.setLoading('verify', loading);
  }, [baseLoading]);

  const withSearch = useCallback(<T>(asyncFn: () => Promise<T>) => {
    return baseLoading.withLoading('search', asyncFn);
  }, [baseLoading]);

  const withSubmit = useCallback(<T>(asyncFn: () => Promise<T>) => {
    return baseLoading.withLoading('submit', asyncFn);
  }, [baseLoading]);

  const withUpload = useCallback(<T>(asyncFn: () => Promise<T>) => {
    return baseLoading.withLoading('upload', asyncFn);
  }, [baseLoading]);

  const withVerify = useCallback(<T>(asyncFn: () => Promise<T>) => {
    return baseLoading.withLoading('verify', asyncFn);
  }, [baseLoading]);

  return {
    ...baseLoading,
    isSearching,
    isSubmitting,
    isUploading,
    isVerifying,
    setSearching,
    setSubmitting,
    setUploading,
    setVerifying,
    withSearch,
    withSubmit,
    withUpload,
    withVerify
  };
}

// Hook for managing upload progress
export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface UseUploadProgressReturn {
  progress: UploadProgress | null;
  setProgress: (progress: UploadProgress | null) => void;
  updateProgress: (loaded: number, total: number) => void;
  resetProgress: () => void;
  isUploading: boolean;
}

export function useUploadProgress(): UseUploadProgressReturn {
  const [progress, setProgressState] = useState<UploadProgress | null>(null);

  const setProgress = useCallback((newProgress: UploadProgress | null) => {
    setProgressState(newProgress);
  }, []);

  const updateProgress = useCallback((loaded: number, total: number) => {
    const percentage = total > 0 ? Math.round((loaded / total) * 100) : 0;
    setProgressState({ loaded, total, percentage });
  }, []);

  const resetProgress = useCallback(() => {
    setProgressState(null);
  }, []);

  const isUploading = progress !== null && progress.percentage < 100;

  return {
    progress,
    setProgress,
    updateProgress,
    resetProgress,
    isUploading
  };
}