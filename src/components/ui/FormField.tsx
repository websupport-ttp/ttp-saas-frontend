'use client';

import { cn } from '@/lib/utils';

export interface FormFieldProps {
  children: React.ReactNode;
  className?: string;
  error?: string | string[];
  required?: boolean;
  label?: string;
  description?: string;
}

export function FormField({ children, className, error, required, label, description }: FormFieldProps) {
  const errorMessage = Array.isArray(error) ? error[0] : error;
  const hasError = Boolean(errorMessage);

  return (
    <div className={cn('space-y-1', className)}>
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
      <div className={cn(hasError && 'relative')}>
        {children}
      </div>
      {hasError && (
        <p className="text-sm text-red-600 flex items-center gap-1" role="alert">
          <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {errorMessage}
        </p>
      )}
    </div>
  );
}

export interface FormGroupProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
}

export function FormGroup({ children, className, title, description }: FormGroupProps) {
  return (
    <div className={cn('space-y-6', className)}>
      {title && (
        <div className="border-b border-gray-200 pb-4">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          {description && (
            <p className="mt-1 text-sm text-gray-600">{description}</p>
          )}
        </div>
      )}
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}

export interface FormActionsProps {
  children: React.ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right' | 'between';
}

export function FormActions({ children, className, align = 'right' }: FormActionsProps) {
  const alignmentClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
    between: 'justify-between'
  };

  return (
    <div className={cn(
      'flex items-center space-x-4 pt-6 border-t border-gray-200',
      alignmentClasses[align],
      className
    )}>
      {children}
    </div>
  );
}