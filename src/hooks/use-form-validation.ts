/**
 * Form Validation Hook
 * Provides comprehensive form validation with real-time validation,
 * server-side error handling, and field-specific error display
 */

import { useState, useCallback, useEffect } from 'react';
import { z } from 'zod';
import { extractValidationErrors, validateFormData, type ValidationErrors } from '../lib/validation/schemas';
import { useErrorHandler } from './use-error-handler';
import { AppError } from '../types/api';

interface UseFormValidationOptions<T> {
  schema: z.ZodSchema<T>;
  initialValues?: Partial<T>;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  onSubmit?: (data: T) => Promise<void> | void;
  onError?: (errors: ValidationErrors) => void;
}

interface FormState<T> {
  values: Partial<T>;
  errors: ValidationErrors;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  isValid: boolean;
  isDirty: boolean;
}

interface FormActions<T> {
  setValue: (field: keyof T, value: any) => void;
  setValues: (values: Partial<T>) => void;
  setError: (field: string, error: string) => void;
  setErrors: (errors: ValidationErrors) => void;
  clearError: (field: string) => void;
  clearErrors: () => void;
  setTouched: (field: keyof T, touched?: boolean) => void;
  setFieldTouched: (field: keyof T) => void;
  validateField: (field: keyof T) => boolean;
  validateForm: () => boolean;
  handleSubmit: (e?: React.FormEvent) => Promise<void>;
  reset: (values?: Partial<T>) => void;
  handleServerErrors: (error: any) => void;
}

export function useFormValidation<T extends Record<string, any>>({
  schema,
  initialValues = {},
  validateOnChange = true,
  validateOnBlur = true,
  onSubmit,
  onError
}: UseFormValidationOptions<T>): [FormState<T>, FormActions<T>] {
  const { handleError } = useErrorHandler();

  const [state, setState] = useState<FormState<T>>({
    values: initialValues,
    errors: {},
    touched: {},
    isSubmitting: false,
    isValid: false,
    isDirty: false
  });

  // Validate a single field
  const validateField = useCallback((field: keyof T): boolean => {
    try {
      // Create a partial schema for the specific field
      const fieldValue = { [field]: state.values[field] };
      const result = validateFormData(schema, fieldValue);
      
      if (result.success) {
        // Clear error if validation passes
        setState(prev => {
          const newErrors = { ...prev.errors };
          delete newErrors[field as string];
          return {
            ...prev,
            errors: newErrors
          };
        });
        return true;
      } else {
        // Set field-specific errors
        setState(prev => ({
          ...prev,
          errors: {
            ...prev.errors,
            ...result.errors
          }
        }));
        return false;
      }
    } catch (error) {
      return false;
    }
  }, [schema, state.values]);

  // Validate entire form
  const validateForm = useCallback((): boolean => {
    const result = validateFormData(schema, state.values);
    
    if (result.success) {
      setState(prev => ({
        ...prev,
        errors: {},
        isValid: true
      }));
      return true;
    } else {
      setState(prev => ({
        ...prev,
        errors: result.errors || {},
        isValid: false
      }));
      if (onError && result.errors) {
        onError(result.errors);
      }
      return false;
    }
  }, [schema, state.values, onError]);

  // Set single field value
  const setValue = useCallback((field: keyof T, value: any) => {
    setState(prev => {
      const newValues = { ...prev.values, [field]: value };
      const newState = {
        ...prev,
        values: newValues,
        isDirty: true
      };

      // Validate on change if enabled and field is touched
      if (validateOnChange && prev.touched[field as string]) {
        const fieldValue = { [field]: value };
        const result = validateFormData(schema, fieldValue);
        
        if (result.success) {
          // Clear error if validation passes
          const newErrors = { ...prev.errors };
          delete newErrors[field as string];
          newState.errors = newErrors;
        } else if (result.errors) {
          // Set field-specific errors
          newState.errors = {
            ...prev.errors,
            ...result.errors
          };
        }
      }

      return newState;
    });
  }, [schema, validateOnChange]);

  // Set multiple field values
  const setValues = useCallback((values: Partial<T>) => {
    setState(prev => ({
      ...prev,
      values: { ...prev.values, ...values },
      isDirty: true
    }));
  }, []);

  // Set field error
  const setError = useCallback((field: string, error: string) => {
    setState(prev => ({
      ...prev,
      errors: {
        ...prev.errors,
        [field]: [error]
      }
    }));
  }, []);

  // Set multiple errors
  const setErrors = useCallback((errors: ValidationErrors) => {
    setState(prev => ({
      ...prev,
      errors: { ...prev.errors, ...errors }
    }));
  }, []);

  // Clear single field error
  const clearError = useCallback((field: string) => {
    setState(prev => {
      const newErrors = { ...prev.errors };
      delete newErrors[field];
      return {
        ...prev,
        errors: newErrors
      };
    });
  }, []);

  // Clear all errors
  const clearErrors = useCallback(() => {
    setState(prev => ({
      ...prev,
      errors: {}
    }));
  }, []);

  // Set field as touched
  const setTouched = useCallback((field: keyof T, touched = true) => {
    setState(prev => ({
      ...prev,
      touched: {
        ...prev.touched,
        [field as string]: touched
      }
    }));
  }, []);

  // Handle field blur (set touched and validate if enabled)
  const setFieldTouched = useCallback((field: keyof T) => {
    setState(prev => ({
      ...prev,
      touched: {
        ...prev.touched,
        [field as string]: true
      }
    }));

    // Validate on blur if enabled
    if (validateOnBlur) {
      setTimeout(() => validateField(field), 0);
    }
  }, [validateOnBlur, validateField]);

  // Handle form submission
  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    setState(prev => ({ ...prev, isSubmitting: true }));

    try {
      // Mark all fields as touched
      const allTouched = Object.keys(state.values).reduce((acc, key) => {
        acc[key] = true;
        return acc;
      }, {} as Record<string, boolean>);

      setState(prev => ({ ...prev, touched: allTouched }));

      // Validate form
      if (!validateForm()) {
        setState(prev => ({ ...prev, isSubmitting: false }));
        return;
      }

      // Call onSubmit if provided
      if (onSubmit) {
        const result = validateFormData(schema, state.values);
        if (result.success && result.data) {
          await onSubmit(result.data);
        }
      }
    } catch (error) {
      handleServerErrors(error);
    } finally {
      setState(prev => ({ ...prev, isSubmitting: false }));
    }
  }, [state.values, validateForm, onSubmit, schema]);

  // Handle server-side validation errors
  const handleServerErrors = useCallback((error: any) => {
    if (error && typeof error === 'object') {
      // Handle API validation errors
      if (error.type === 'VALIDATION_ERROR' && error.details?.validationErrors) {
        setErrors(error.details.validationErrors);
        return;
      }
      
      // Handle field-specific errors from server response
      if (error.details?.errors) {
        const serverErrors: ValidationErrors = {};
        
        if (Array.isArray(error.details.errors)) {
          // Handle array of error objects
          error.details.errors.forEach((err: any) => {
            if (err.field && err.message) {
              serverErrors[err.field] = [err.message];
            }
          });
        } else if (typeof error.details.errors === 'object') {
          // Handle object with field keys
          Object.entries(error.details.errors).forEach(([field, messages]) => {
            if (Array.isArray(messages)) {
              serverErrors[field] = messages;
            } else if (typeof messages === 'string') {
              serverErrors[field] = [messages];
            }
          });
        }
        
        if (Object.keys(serverErrors).length > 0) {
          setErrors(serverErrors);
          return;
        }
      }
    }

    // Handle generic errors
    handleError(error);
  }, [setErrors, handleError]);

  // Reset form
  const reset = useCallback((values?: Partial<T>) => {
    setState({
      values: values || initialValues,
      errors: {},
      touched: {},
      isSubmitting: false,
      isValid: false,
      isDirty: false
    });
  }, [initialValues]);

  // Update isValid when values or errors change
  useEffect(() => {
    const hasErrors = Object.values(state.errors).some(error => 
      error && error.length > 0
    );
    const hasValues = Object.keys(state.values).length > 0;
    
    setState(prev => ({
      ...prev,
      isValid: !hasErrors && hasValues
    }));
  }, [state.errors, state.values]);

  const formState: FormState<T> = state;
  
  const formActions: FormActions<T> = {
    setValue,
    setValues,
    setError,
    setErrors,
    clearError,
    clearErrors,
    setTouched,
    setFieldTouched,
    validateField,
    validateForm,
    handleSubmit,
    reset,
    handleServerErrors
  };

  return [formState, formActions];
}

// Helper hook for field-level validation
export function useFieldValidation<T>(
  fieldName: keyof T,
  formState: FormState<T>,
  formActions: FormActions<T>
) {
  const fieldError = formState.errors[fieldName as string];
  const fieldTouched = formState.touched[fieldName as string];
  const fieldValue = formState.values[fieldName];

  const hasError = fieldTouched && fieldError && fieldError.length > 0;
  const errorMessage = hasError ? fieldError[0] : undefined;

  const handleChange = useCallback((value: any) => {
    formActions.setValue(fieldName, value);
  }, [fieldName, formActions]);

  const handleBlur = useCallback(() => {
    formActions.setFieldTouched(fieldName);
  }, [fieldName, formActions]);

  return {
    value: fieldValue,
    error: errorMessage,
    hasError,
    touched: fieldTouched,
    onChange: handleChange,
    onBlur: handleBlur
  };
}