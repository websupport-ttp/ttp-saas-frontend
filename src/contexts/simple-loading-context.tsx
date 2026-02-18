'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SimpleLoadingContextType {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

const SimpleLoadingContext = createContext<SimpleLoadingContextType | undefined>(undefined);

interface SimpleLoadingProviderProps {
  children: ReactNode;
}

export function SimpleLoadingProvider({ children }: SimpleLoadingProviderProps) {
  const [isLoading, setIsLoading] = useState(false);

  const setLoading = (loading: boolean) => {
    setIsLoading(loading);
  };

  return (
    <SimpleLoadingContext.Provider value={{ isLoading, setLoading }}>
      {children}
    </SimpleLoadingContext.Provider>
  );
}

export function useSimpleLoading(): SimpleLoadingContextType {
  const context = useContext(SimpleLoadingContext);
  if (context === undefined) {
    throw new Error('useSimpleLoading must be used within a SimpleLoadingProvider');
  }
  return context;
}