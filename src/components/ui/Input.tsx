import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: 'default' | 'outline' | 'filled';
  size?: 'sm' | 'md' | 'lg';
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  variant = 'default',
  size = 'md',
  className = '',
  id,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-5 py-4 text-lg'
  };

  const variantClasses = {
    default: 'border border-gray-300 bg-white focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20',
    outline: 'border-2 border-gray-300 bg-transparent focus:border-brand-blue',
    filled: 'border-0 bg-gray-100 focus:bg-white focus:ring-2 focus:ring-brand-blue/20'
  };

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {label}
        </label>
      )}

      <input
        id={inputId}
        className={cn(
          'w-full rounded-lg transition-all duration-200 outline-none',
          sizeClasses[size],
          variantClasses[variant],
          error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
          props.disabled && 'opacity-50 cursor-not-allowed bg-gray-50',
          className
        )}
        {...props}
      />

      {error && (
        <p className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  );
};

export default Input;

// Named export for compatibility
export { Input };