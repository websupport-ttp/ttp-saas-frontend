'use client';

import React from 'react';
import LoadingSpinner from './LoadingSpinner';

interface LoadingOverlayProps {
  isLoading: boolean;
  text?: string;
  className?: string;
  children: React.ReactNode;
}

export function LoadingOverlay({ 
  isLoading, 
  text = 'Loading...', 
  className = '', 
  children 
}: LoadingOverlayProps) {
  return (
    <div className={`relative ${className}`}>
      {children}
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
          <div className="flex flex-col items-center space-y-2">
            <LoadingSpinner size="md" />
            {text && (
              <p className="text-sm text-gray-600">{text}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}