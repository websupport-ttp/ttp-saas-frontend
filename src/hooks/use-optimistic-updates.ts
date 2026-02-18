'use client';

import { useState, useCallback, useRef } from 'react';
import { useErrorHandler } from './use-error-handler';

export interface OptimisticUpdate<T> {
  id: string;
  type: 'create' | 'update' | 'delete';
  data: T;
  originalData?: T;
  timestamp: number;
}

export interface UseOptimisticUpdatesOptions<T> {
  onError?: (error: any, update: OptimisticUpdate<T>) => void;
  onSuccess?: (result: any, update: OptimisticUpdate<T>) => void;
  rollbackDelay?: number; // Delay before rolling back failed updates
}

export function useOptimisticUpdates<T extends { id: string }>(
  initialData: T[] = [],
  options: UseOptimisticUpdatesOptions<T> = {}
) {
  const [data, setData] = useState<T[]>(initialData);
  const [pendingUpdates, setPendingUpdates] = useState<OptimisticUpdate<T>[]>([]);
  const { handleError } = useErrorHandler();
  const updateIdCounter = useRef(0);

  const generateUpdateId = useCallback(() => {
    return `optimistic_${Date.now()}_${++updateIdCounter.current}`;
  }, []);

  // Apply optimistic update immediately
  const applyOptimisticUpdate = useCallback((
    type: OptimisticUpdate<T>['type'],
    newData: T,
    originalData?: T
  ): string => {
    const updateId = generateUpdateId();
    const update: OptimisticUpdate<T> = {
      id: updateId,
      type,
      data: newData,
      originalData,
      timestamp: Date.now()
    };

    // Add to pending updates
    setPendingUpdates(prev => [...prev, update]);

    // Apply the update to data immediately
    setData(prev => {
      switch (type) {
        case 'create':
          return [...prev, newData];
        case 'update':
          return prev.map(item => item.id === newData.id ? newData : item);
        case 'delete':
          return prev.filter(item => item.id !== newData.id);
        default:
          return prev;
      }
    });

    return updateId;
  }, [generateUpdateId]);

  // Confirm successful update
  const confirmUpdate = useCallback((updateId: string, serverData?: T) => {
    setPendingUpdates(prev => prev.filter(update => update.id !== updateId));
    
    // If server returned different data, update with server version
    if (serverData) {
      setData(prev => prev.map(item => item.id === serverData.id ? serverData : item));
    }

    // Call success callback
    const update = pendingUpdates.find(u => u.id === updateId);
    if (update && options.onSuccess) {
      options.onSuccess(serverData, update);
    }
  }, [pendingUpdates, options]);

  // Rollback failed update
  const rollbackUpdate = useCallback((updateId: string, error?: any) => {
    const update = pendingUpdates.find(u => u.id === updateId);
    if (!update) return;

    // Remove from pending updates
    setPendingUpdates(prev => prev.filter(u => u.id !== updateId));

    // Rollback the data change
    setData(prev => {
      switch (update.type) {
        case 'create':
          return prev.filter(item => item.id !== update.data.id);
        case 'update':
          return update.originalData 
            ? prev.map(item => item.id === update.data.id ? update.originalData! : item)
            : prev;
        case 'delete':
          return update.originalData 
            ? [...prev, update.originalData]
            : prev;
        default:
          return prev;
      }
    });

    // Handle error
    if (error) {
      if (options.onError) {
        options.onError(error, update);
      } else {
        handleError(error, { showNotification: true });
      }
    }
  }, [pendingUpdates, options, handleError]);

  // Optimistic create
  const optimisticCreate = useCallback(async (
    newItem: T,
    asyncFn: () => Promise<T>
  ): Promise<T> => {
    const updateId = applyOptimisticUpdate('create', newItem);

    try {
      const result = await asyncFn();
      confirmUpdate(updateId, result);
      return result;
    } catch (error) {
      // Delay rollback to avoid jarring UI changes
      setTimeout(() => rollbackUpdate(updateId, error), options.rollbackDelay || 1000);
      throw error;
    }
  }, [applyOptimisticUpdate, confirmUpdate, rollbackUpdate, options.rollbackDelay]);

  // Optimistic update
  const optimisticUpdate = useCallback(async (
    updatedItem: T,
    asyncFn: () => Promise<T>
  ): Promise<T> => {
    const originalItem = data.find(item => item.id === updatedItem.id);
    const updateId = applyOptimisticUpdate('update', updatedItem, originalItem);

    try {
      const result = await asyncFn();
      confirmUpdate(updateId, result);
      return result;
    } catch (error) {
      setTimeout(() => rollbackUpdate(updateId, error), options.rollbackDelay || 1000);
      throw error;
    }
  }, [data, applyOptimisticUpdate, confirmUpdate, rollbackUpdate, options.rollbackDelay]);

  // Optimistic delete
  const optimisticDelete = useCallback(async (
    itemId: string,
    asyncFn: () => Promise<void>
  ): Promise<void> => {
    const originalItem = data.find(item => item.id === itemId);
    if (!originalItem) return;

    const updateId = applyOptimisticUpdate('delete', originalItem, originalItem);

    try {
      await asyncFn();
      confirmUpdate(updateId);
    } catch (error) {
      setTimeout(() => rollbackUpdate(updateId, error), options.rollbackDelay || 1000);
      throw error;
    }
  }, [data, applyOptimisticUpdate, confirmUpdate, rollbackUpdate, options.rollbackDelay]);

  // Check if an item has pending updates
  const hasPendingUpdate = useCallback((itemId: string): boolean => {
    return pendingUpdates.some(update => update.data.id === itemId);
  }, [pendingUpdates]);

  // Get pending update for an item
  const getPendingUpdate = useCallback((itemId: string): OptimisticUpdate<T> | undefined => {
    return pendingUpdates.find(update => update.data.id === itemId);
  }, [pendingUpdates]);

  // Clear all pending updates (useful for cleanup)
  const clearPendingUpdates = useCallback(() => {
    setPendingUpdates([]);
  }, []);

  // Refresh data from server (useful after reconnection)
  const refreshData = useCallback((serverData: T[]) => {
    setData(serverData);
    clearPendingUpdates();
  }, [clearPendingUpdates]);

  return {
    data,
    pendingUpdates,
    optimisticCreate,
    optimisticUpdate,
    optimisticDelete,
    hasPendingUpdate,
    getPendingUpdate,
    clearPendingUpdates,
    refreshData,
    confirmUpdate,
    rollbackUpdate
  };
}

// Specialized hook for form submissions with optimistic updates
export function useOptimisticForm<T extends { id: string }>(
  initialData: T[] = [],
  options: UseOptimisticUpdatesOptions<T> = {}
) {
  const optimistic = useOptimisticUpdates(initialData, options);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitWithOptimisticUpdate = useCallback(async (
    type: 'create' | 'update' | 'delete',
    data: T,
    asyncFn: () => Promise<T | void>
  ) => {
    setIsSubmitting(true);
    try {
      switch (type) {
        case 'create':
          return await optimistic.optimisticCreate(data, asyncFn as () => Promise<T>);
        case 'update':
          return await optimistic.optimisticUpdate(data, asyncFn as () => Promise<T>);
        case 'delete':
          return await optimistic.optimisticDelete(data.id, asyncFn as () => Promise<void>);
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [optimistic]);

  return {
    ...optimistic,
    isSubmitting,
    submitWithOptimisticUpdate
  };
}