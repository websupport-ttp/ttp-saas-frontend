import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { RouteValidator, BookingFlowNavigator, BOOKING_STEPS, BookingStep } from '@/lib/routing';
import { BookingStateManager } from '@/lib/bookingState';

interface UseRouteProtectionOptions {
  requiredBookingData?: boolean;
  redirectTo?: string;
  onUnauthorized?: () => void;
}

/**
 * Hook to protect routes in any travel service booking flow
 */
export function useRouteProtection(options: UseRouteProtectionOptions = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const serviceType = RouteValidator.getServiceType(pathname);
  const { requiredBookingData = false, redirectTo, onUnauthorized } = options;

  // Set default redirect based on service type
  const defaultRedirectTo = redirectTo || (serviceType ? `/${serviceType}` : '/hotels');

  useEffect(() => {
    if (!serviceType) return;

    // Validate resource ID in the route (for services that use IDs)
    const resourceId = RouteValidator.getResourceIdFromRoute(pathname);
    if (resourceId && !RouteValidator.isValidId(resourceId)) {
      if (onUnauthorized) {
        onUnauthorized();
      } else {
        router.replace(defaultRedirectTo);
      }
      return;
    }

    // Check if booking data is required and available
    if (requiredBookingData) {
      const currentStep = RouteValidator.getBookingStep(pathname);
      const hasBookingData = currentStep ? 
        BookingStateManager.hasRequiredDataForStep(currentStep, serviceType) : 
        false;
      
      if (!hasBookingData) {
        if (onUnauthorized) {
          onUnauthorized();
        } else {
          // Redirect to appropriate page based on service type and resource ID
          if (resourceId && (serviceType === 'hotels' || serviceType === 'car-hire')) {
            router.replace(`/${serviceType}/${resourceId}`);
          } else {
            router.replace(defaultRedirectTo);
          }
        }
        return;
      }
    }
  }, [pathname, requiredBookingData, defaultRedirectTo, onUnauthorized, router, serviceType]);

  return {
    isProtected: requiredBookingData,
    serviceType,
    currentStep: RouteValidator.getBookingStep(pathname) as BookingStep,
    resourceId: RouteValidator.getResourceIdFromRoute(pathname),
    // Legacy support
    hotelId: RouteValidator.getHotelIdFromRoute(pathname),
  };
}

/**
 * Hook to validate booking flow navigation for any travel service
 */
export function useBookingFlowValidation() {
  const pathname = usePathname();
  const router = useRouter();

  const serviceType = RouteValidator.getServiceType(pathname);
  const currentStep = RouteValidator.getBookingStep(pathname) as BookingStep;
  const resourceId = RouteValidator.getResourceIdFromRoute(pathname);

  const canNavigateToStep = (targetStep: BookingStep): boolean => {
    if (!currentStep || !serviceType) return false;
    return BookingFlowNavigator.isStepAccessible(targetStep, currentStep, serviceType);
  };

  const navigateToStep = (step: BookingStep, force = false) => {
    if (!serviceType) return;

    if (!force && !canNavigateToStep(step)) {
      console.warn(`Cannot navigate to step ${step} from current step ${currentStep}`);
      return;
    }

    const url = buildStepUrl(step, serviceType, resourceId);
    if (url) {
      router.push(url);
    }
  };

  const goToNextStep = () => {
    if (!serviceType) return;
    const nextStep = BookingFlowNavigator.getNextStep(currentStep, serviceType);
    if (nextStep) {
      navigateToStep(nextStep);
    }
  };

  const goToPreviousStep = () => {
    if (!serviceType) return;
    const previousStep = BookingFlowNavigator.getPreviousStep(currentStep, serviceType);
    if (previousStep) {
      navigateToStep(previousStep, true); // Force navigation backwards
    }
  };

  return {
    serviceType,
    currentStep,
    resourceId,
    canNavigateToStep,
    navigateToStep,
    goToNextStep,
    goToPreviousStep,
    progress: serviceType ? BookingFlowNavigator.getProgressPercentage(currentStep, serviceType) : 0,
    // Legacy support
    hotelId: RouteValidator.getHotelIdFromRoute(pathname),
  };
}

/**
 * Build URL for a specific step in any service
 */
function buildStepUrl(step: BookingStep, serviceType: 'hotels' | 'car-hire' | 'visa-application' | 'travel-insurance', resourceId?: string | null): string | null {
  switch (serviceType) {
    case 'hotels':
      switch (step) {
        case BOOKING_STEPS.SEARCH:
          return '/hotels';
        case BOOKING_STEPS.DETAILS:
          return resourceId ? `/hotels/${resourceId}` : '/hotels';
        case BOOKING_STEPS.GUESTS:
          return resourceId ? `/hotels/${resourceId}/guests` : '/hotels';
        case BOOKING_STEPS.PAYMENT:
          return resourceId ? `/hotels/${resourceId}/payment` : '/hotels';
        case BOOKING_STEPS.SUCCESS:
          return resourceId ? `/hotels/${resourceId}/success` : '/hotels';
        default:
          return '/hotels';
      }
    case 'car-hire':
      switch (step) {
        case BOOKING_STEPS.CAR_SEARCH:
          return '/car-hire';
        case BOOKING_STEPS.CAR_DETAILS:
          return resourceId ? `/car-hire/${resourceId}` : '/car-hire';
        case BOOKING_STEPS.CONTACT:
          return resourceId ? `/car-hire/${resourceId}/contact` : '/car-hire';
        case BOOKING_STEPS.PAYMENT:
          return resourceId ? `/car-hire/${resourceId}/payment` : '/car-hire';
        case BOOKING_STEPS.SUCCESS:
          return resourceId ? `/car-hire/${resourceId}/success` : '/car-hire';
        default:
          return '/car-hire';
      }
    case 'visa-application':
      switch (step) {
        case BOOKING_STEPS.VISA_START:
          return '/visa-application';
        case BOOKING_STEPS.PERSONAL:
          return '/visa-application/personal';
        case BOOKING_STEPS.PASSPORT:
          return '/visa-application/passport';
        case BOOKING_STEPS.APPOINTMENT:
          return '/visa-application/appointment';
        case BOOKING_STEPS.REVIEW:
          return '/visa-application/review';
        case BOOKING_STEPS.PAYMENT:
          return '/visa-application/payment';
        case BOOKING_STEPS.SUCCESS:
          return '/visa-application/success';
        default:
          return '/visa-application';
      }
    case 'travel-insurance':
      switch (step) {
        case BOOKING_STEPS.INSURANCE_PLANS:
          return '/travel-insurance';
        case BOOKING_STEPS.TRIP_DETAILS:
          return '/travel-insurance/details';
        case BOOKING_STEPS.TRAVELERS:
          return '/travel-insurance/travelers';
        case BOOKING_STEPS.REVIEW:
          return '/travel-insurance/review';
        case BOOKING_STEPS.PAYMENT:
          return '/travel-insurance/payment';
        case BOOKING_STEPS.SUCCESS:
          return '/travel-insurance/success';
        default:
          return '/travel-insurance';
      }
    default:
      return null;
  }
}

/**
 * Check if booking data is available in session storage
 */
function checkBookingDataAvailability(): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    const bookingData = sessionStorage.getItem('hotelBookingData');
    return bookingData !== null;
  } catch (error) {
    console.error('Error checking booking data:', error);
    return false;
  }
}