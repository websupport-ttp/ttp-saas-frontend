'use client';

import { useState, useEffect } from 'react';
import { globalLoadingManager } from '@/lib/api-client-with-loading';

// React hook for using API loading states
export function useApiLoading() {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const unsubscribe = globalLoadingManager.subscribe(setLoadingStates);
    return unsubscribe;
  }, []);

  return {
    loadingStates,
    isLoading: (key?: string) => globalLoadingManager.isLoading(key),
    
    // Common loading state checks
    isSearching: globalLoadingManager.isLoading('search'),
    isSubmitting: globalLoadingManager.isLoading('submit'),
    isFetching: globalLoadingManager.isLoading('fetch'),
    isUploading: Array.from(Object.keys(loadingStates)).some(key => 
      key.startsWith('upload_') && loadingStates[key]
    ),
    
    // Any API call in progress
    hasActiveRequests: globalLoadingManager.isLoading(),
    
    // Clear all loading states
    clearAll: () => globalLoadingManager.clear(),
  };
}