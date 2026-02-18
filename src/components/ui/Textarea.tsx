'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string | string[];
  label?: string;
  description?: string;
  loading?: boolean;
  showCharCount?: boolean;
  maxLength?: number;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, label, description, loading, showCharCount, maxLength, required, ...props }, ref) => {
    const errorMessage = Array.isArray(error) ? error[0] : error;
    const hasError = Boolean(errorMessage);
    const currentLength = props.value?.toString().length || 0;

    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
            {required && (
              <span className="text-red-500 ml-1" aria-label="Required field">
                *
              </span>
            )}
          </label>
        )}
        {description && (
          <p className="text-sm text-gray-600">{description}</p>
        )}
        <div className="relative">
          <textarea
            className={cn(
              'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
              hasError && 'border-red-500 focus-visible:ring-red-500',
              loading && 'opacity-50 cursor-not-allowed',
              className
            )}
            ref={ref}
            disabled={loading || props.disabled}
            aria-invalid={hasError}
            aria-describedby={hasError ? `${props.id}-error` : undefined}
            maxLength={maxLength}
            {...props}
          />
          {loading && (
            <div className="absolute top-2 right-2">
              <div className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-blue-600 rounded-full"></div>
            </div>
          )}
        </div>
        <div className="flex justify-between items-center">
          <div>
            {hasError && (
              <p 
                id={`${props.id}-error`}
                className="text-sm text-red-600 flex items-center gap-1" 
                role="alert"
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errorMessage}
              </p>
            )}
          </div>
          {showCharCount && maxLength && (
            <p className={cn(
              'text-sm',
              currentLength > maxLength * 0.9 ? 'text-orange-600' : 'text-gray-500',
              currentLength >= maxLength ? 'text-red-600' : ''
            )}>
              {currentLength}/{maxLength}
            </p>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export { Textarea };