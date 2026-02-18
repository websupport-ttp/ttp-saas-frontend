'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Simple auth context for testing
export interface SimpleAuthContextType {
  user: any | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: any) => Promise<void>;
  logout: () => Promise<void>;
}

const SimpleAuthContext = createContext<SimpleAuthContextType | undefined>(undefined);

interface SimpleAuthProviderProps {
  children: ReactNode;
}

export function SimpleAuthProvider({ children }: SimpleAuthProviderProps) {
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (credentials: any): Promise<void> => {
    setIsLoading(true);
    // Mock login
    setTimeout(() => {
      setUser({ id: '1', email: credentials.email });
      setIsLoading(false);
    }, 1000);
  };

  const logout = async (): Promise<void> => {
    setUser(null);
  };

  return (
    <SimpleAuthContext.Provider value={{
      user,
      isLoading,
      isAuthenticated: !!user,
      login,
      logout,
    }}>
      {children}
    </SimpleAuthContext.Provider>
  );
}

export function useSimpleAuth(): SimpleAuthContextType {
  const context = useContext(SimpleAuthContext);
  if (context === undefined) {
    throw new Error('useSimpleAuth must be used within a SimpleAuthProvider');
  }
  return context;
}