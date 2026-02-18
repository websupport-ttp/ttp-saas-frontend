import { useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { RouteValidator, BookingFlowNavigator, BookingStep } from '@/lib/routing';
import { BookingStateManager } from '@/lib/bookingState';

interface UniversalNavigationOptions {
  onNavigationBlocked?: (targetStep: BookingStep, currentStep: BookingStep) => void;
}

/**
 * Universal navigation hook for all travel services
 * Provides consistent navigation functionality across hotels, car hire, visa application, and travel insurance
 */
export function useUniversalNavigation(options: UniversalNavigationOptions = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const { onNavigationBlocked } = options;

  const serviceType = RouteValidator.getServiceType(pathname);
  const currentStep = RouteValidator.getBookingStep(pathname) as BookingStep;
  const resourceId = RouteValidator.getResourceIdFromRoute(pathname);

  /**
   * Check if navigation to a step is allowed
   */
  const canNavigateToStep = useCallback(
    (targetStep: BookingStep): boolean => {
      if (!serviceType) return false;
      return BookingFlowNavigator.isStepAccessible(targetStep, currentStep, serviceType);
    },
    [serviceType, currentStep]
  );

  /**
   * Check if required data exists for a step
   */
  const hasRequiredDataForStep = useCallback(
    (step: BookingStep): boolean => {
      if (!serviceType) return false;
      return BookingStateManager.hasRequiredDataForStep(step, serviceType);
    },
    [serviceType]
  );

  /**
   * Build URL for a step in the current service
   */
  const buildStepUrl = useCallback(
    (step: BookingStep): string | null => {
      if (!serviceType) return null;

      switch (serviceType) {
        case 'hotels':
          switch (step) {
            case 'search':
              return '/hotels';
            case 'details':
              return resourceId ? `/hotels/${resourceId}` : '/hotels';
            case 'guests':
              return resourceId ? `/hotels/${resourceId}/guests` : '/hotels';
            case 'payment':
              return resourceId ? `/hotels/${resourceId}/payment` : '/hotels';
            case 'success':
              return resourceId ? `/hotels/${resourceId}/success` : '/hotels';
            default:
              return '/hotels';
          }
        case 'car-hire':
          switch (step) {
            case 'car-search':
              return '/car-hire';
            case 'car-details':
              return resourceId ? `/car-hire/${resourceId}` : '/car-hire';
            case 'contact':
              return resourceId ? `/car-hire/${resourceId}/contact` : '/car-hire';
            case 'payment':
              return resourceId ? `/car-hire/${resourceId}/payment` : '/car-hire';
            case 'success':
              return resourceId ? `/car-hire/${resourceId}/success` : '/car-hire';
            default:
              return '/car-hire';
          }
        case 'visa-application':
          switch (step) {
            case 'visa-start':
              return '/visa-application';
            case 'personal':
              return '/visa-application/personal';
            case 'passport':
              return '/visa-application/passport';
            case 'appointment':
              return '/visa-application/appointment';
            case 'review':
              return '/visa-application/review';
            case 'payment':
              return '/visa-application/payment';
            case 'success':
              return '/visa-application/success';
            default:
              return '/visa-application';
          }
        case 'travel-insurance':
          switch (step) {
            case 'insurance-plans':
              return '/travel-insurance';
            case 'details':
              return '/travel-insurance/details';
            case 'travelers':
              return '/travel-insurance/travelers';
            case 'review':
              return '/travel-insurance/review';
            case 'payment':
              return '/travel-insurance/payment';
            case 'success':
              return '/travel-insurance/success';
            default:
              return '/travel-insurance';
          }
        default:
          return null;
      }
    },
    [serviceType, resourceId]
  );

  /**
   * Navigate to a specific step with validation
   */
  const navigateToStep = useCallback(
    (step: BookingStep, force = false) => {
      if (!serviceType) return false;

      // Check if navigation is allowed
      if (!force && !canNavigateToStep(step)) {
        if (onNavigationBlocked && currentStep) {
          onNavigationBlocked(step, currentStep);
        }
        return false;
      }

      // Check if required data exists for protected steps
      const protectedSteps = ['payment', 'success'];
      if (!force && protectedSteps.includes(step) && !hasRequiredDataForStep(step)) {
        if (onNavigationBlocked && currentStep) {
          onNavigationBlocked(step, currentStep);
        }
        return false;
      }

      const url = buildStepUrl(step);
      if (url) {
        router.push(url);
        return true;
      }

      return false;
    },
    [serviceType, canNavigateToStep, hasRequiredDataForStep, buildStepUrl, router, onNavigationBlocked, currentStep]
  );

  /**
   * Navigate to the next step in the flow
   */
  const goToNextStep = useCallback(() => {
    if (!serviceType) return false;
    const nextStep = BookingFlowNavigator.getNextStep(currentStep, serviceType);
    if (nextStep) {
      return navigateToStep(nextStep);
    }
    return false;
  }, [serviceType, currentStep, navigateToStep]);

  /**
   * Navigate to the previous step in the flow
   */
  const goToPreviousStep = useCallback(() => {
    if (!serviceType) return false;
    const previousStep = BookingFlowNavigator.getPreviousStep(currentStep, serviceType);
    if (previousStep) {
      return navigateToStep(previousStep, true); // Force navigation backwards
    }
    return false;
  }, [serviceType, currentStep, navigateToStep]);

  /**
   * Navigate to the start of the current service
   */
  const goToServiceStart = useCallback(() => {
    if (!serviceType) return false;
    router.push(`/${serviceType}`);
    return true;
  }, [serviceType, router]);

  /**
   * Get the progress percentage for the current step
   */
  const getProgress = useCallback(() => {
    if (!serviceType) return 0;
    return BookingFlowNavigator.getProgressPercentage(currentStep, serviceType);
  }, [serviceType, currentStep]);

  /**
   * Store data for the current service
   */
  const storeData = useCallback(
    (service: string, key: string, data: any) => {
      if (typeof window !== 'undefined') {
        const storageKey = `${service}_${key}`;
        localStorage.setItem(storageKey, JSON.stringify(data));
      }
    },
    []
  );

  /**
   * Get stored data for the current service
   */
  const getStoredData = useCallback(
    (service: string, key: string) => {
      if (typeof window !== 'undefined') {
        const storageKey = `${service}_${key}`;
        const stored = localStorage.getItem(storageKey);
        return stored ? JSON.parse(stored) : null;
      }
      return null;
    },
    []
  );

  /**
   * Clear all session data for the current service
   */
  const clearServiceData = useCallback((service?: string) => {
    const targetService = service || serviceType;
    if (!targetService) return;

    if (typeof window !== 'undefined') {
      // Clear localStorage items for the service
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(`${targetService}_`)) {
          localStorage.removeItem(key);
        }
      });
    }

    // Also clear BookingStateManager data
    switch (targetService) {
      case 'hotels':
        BookingStateManager.clearBookingState();
        break;
      case 'car-hire':
        BookingStateManager.clearCarHireBookingState();
        break;
      case 'visa-application':
        BookingStateManager.clearVisaApplicationState();
        break;
      case 'travel-insurance':
        BookingStateManager.clearTravelInsuranceState();
        break;
    }
  }, [serviceType]);

  return {
    // Current state
    serviceType,
    currentStep,
    resourceId,
    
    // Navigation methods
    canNavigateToStep,
    hasRequiredDataForStep,
    navigateToStep,
    goToNextStep,
    goToPreviousStep,
    goToServiceStart,
    
    // Data methods
    storeData,
    getStoredData,
    
    // Utility methods
    buildStepUrl,
    getProgress,
    clearServiceData,
    
    // Legacy support
    hotelId: RouteValidator.getHotelIdFromRoute(pathname),
  };
}