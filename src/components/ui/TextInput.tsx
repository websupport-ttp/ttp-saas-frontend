'use client';

import { forwardRef, useState } from 'react';
import { cn } from '@/lib/utils';

export interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  variant?: 'default' | 'filled';
}

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ 
    className,
    label,
    error,
    helperText,
    leftIcon,
    rightIcon,
    fullWidth = false,
    variant = 'default',
    id,
    ...props 
  }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    const baseInputStyles = 'block px-3 py-2.5 text-gray-900 placeholder-gray-500 border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0';
    
    const variants = {
      default: 'bg-white border-gray-300 rounded-lg focus:border-brand-red focus:ring-brand-red',
      filled: 'bg-gray-50 border-gray-200 rounded-lg focus:bg-white focus:border-brand-red focus:ring-brand-red'
    };

    const errorStyles = error 
      ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
      : '';

    const iconPadding = {
      left: leftIcon ? 'pl-10' : '',
      right: rightIcon ? 'pr-10' : ''
    };

    return (
      <div className={cn('relative', fullWidth && 'w-full')}>
        {/* Label */}
        {label && (
          <label 
            htmlFor={inputId}
            className={cn(
              'block text-sm font-medium mb-2 transition-colors duration-200',
              error ? 'text-red-700' : 'text-gray-700',
              isFocused && !error && 'text-brand-red'
            )}
          >
            {label}
          </label>
        )}

        {/* Input Container */}
        <div className="relative">
          {/* Left Icon */}
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <div className={cn(
                'transition-colors duration-200',
                error ? 'text-red-500' : 'text-gray-400',
                isFocused && !error && 'text-brand-red'
              )}>
                {leftIcon}
              </div>
            </div>
          )}

          {/* Input Field */}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              baseInputStyles,
              variants[variant],
              errorStyles,
              iconPadding.left,
              iconPadding.right,
              fullWidth && 'w-full',
              className
            )}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            {...props}
          />

          {/* Right Icon */}
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <div className={cn(
                'transition-colors duration-200',
                error ? 'text-red-500' : 'text-gray-400',
                isFocused && !error && 'text-brand-red'
              )}>
                {rightIcon}
              </div>
            </div>
          )}
        </div>

        {/* Helper Text or Error Message */}
        {(error || helperText) && (
          <div className="mt-2">
            {error ? (
              <p className="text-sm text-red-600 flex items-center">
                <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </p>
            ) : (
              <p className="text-sm text-gray-600">{helperText}</p>
            )}
          </div>
        )}
      </div>
    );
  }
);

TextInput.displayName = 'TextInput';

export { TextInput };