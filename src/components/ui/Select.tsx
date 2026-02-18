'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string | string[];
  label?: string;
  description?: string;
  options: SelectOption[];
  placeholder?: string;
  loading?: boolean;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, label, description, options, placeholder, loading, required, ...props }, ref) => {
    const errorMessage = Array.isArray(error) ? error[0] : error;
    const hasError = Boolean(errorMessage);

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
          <select
            className={cn(
              'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
              hasError && 'border-red-500 focus-visible:ring-red-500',
              loading && 'opacity-50 cursor-not-allowed',
              className
            )}
            ref={ref}
            disabled={loading || props.disabled}
            aria-invalid={hasError}
            aria-describedby={hasError ? `${props.id}-error` : undefined}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>
          {loading && (
            <div className="absolute inset-y-0 right-8 flex items-center">
              <div className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-blue-600 rounded-full"></div>
            </div>
          )}
        </div>
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
    );
  }
);

Select.displayName = 'Select';

export { Select };