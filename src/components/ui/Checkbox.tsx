'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface CheckboxProps {
  label?: string;
  description?: string;
  error?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  id?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  name?: string;
  value?: string;
  required?: boolean;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ 
    className,
    label,
    description,
    error,
    size = 'md',
    id,
    ...props 
  }, ref) => {
    const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

    const sizes = {
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6'
    };

    const labelSizes = {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg'
    };

    return (
      <div className="relative flex items-start">
        <div className="flex items-center h-6">
          <input
            ref={ref}
            id={checkboxId}
            type="checkbox"
            className={cn(
              'rounded border-gray-300 text-brand-red focus:ring-brand-red focus:ring-offset-0 transition-all duration-200',
              sizes[size],
              error && 'border-red-500 focus:ring-red-500',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              className
            )}
            {...props}
          />
        </div>
        
        {(label || description) && (
          <div className="ml-3 text-sm">
            {label && (
              <label 
                htmlFor={checkboxId}
                className={cn(
                  'font-medium cursor-pointer transition-colors duration-200',
                  error ? 'text-red-700' : 'text-gray-900',
                  labelSizes[size],
                  props.disabled && 'opacity-50 cursor-not-allowed'
                )}
              >
                {label}
              </label>
            )}
            {description && (
              <p className={cn(
                'text-gray-600 mt-1',
                error && 'text-red-600',
                props.disabled && 'opacity-50'
              )}>
                {description}
              </p>
            )}
          </div>
        )}
        
        {error && (
          <div className="absolute -bottom-6 left-0">
            <p className="text-sm text-red-600 flex items-center">
              <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </p>
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export { Checkbox };