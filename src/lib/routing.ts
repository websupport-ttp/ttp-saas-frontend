import { SearchCriteria } from '@/types/hotels';

// Hotel booking flow routes
export const HOTEL_ROUTES = {
  SEARCH: '/hotels',
  DETAILS: (id: string) => `/hotels/${id}`,
  GUESTS: (id: string) => `/hotels/${id}/guests`,
  PAYMENT: (id: string) => `/hotels/${id}/payment`,
  SUCCESS: (id: string) => `/hotels/${id}/success`,
} as const;

// Car hire booking flow routes
export const CAR_HIRE_ROUTES = {
  SEARCH: '/car-hire',
  DETAILS: (id: string) => `/car-hire/${id}`,
  CONTACT: (id: string) => `/car-hire/${id}/contact`,
  PAYMENT: (id: string) => `/car-hire/${id}/payment`,
  SUCCESS: (id: string) => `/car-hire/${id}/success`,
} as const;

// Visa application flow routes
export const VISA_ROUTES = {
  START: '/visa-application',
  PERSONAL: '/visa-application/personal',
  PASSPORT: '/visa-application/passport',
  APPOINTMENT: '/visa-application/appointment',
  REVIEW: '/visa-application/review',
  PAYMENT: '/visa-application/payment',
  SUCCESS: '/visa-application/success',
} as const;

// Travel insurance flow routes
export const INSURANCE_ROUTES = {
  PLANS: '/travel-insurance',
  DETAILS: '/travel-insurance/details',
  TRAVELERS: '/travel-insurance/travelers',
  REVIEW: '/travel-insurance/review',
  PAYMENT: '/travel-insurance/payment',
  SUCCESS: '/travel-insurance/success',
} as const;

// Route validation utilities
export class RouteValidator {
  /**
   * Validates ID format for any service
   */
  static isValidId(id: string): boolean {
    return /^[a-zA-Z0-9-_]+$/.test(id);
  }

  /**
   * Validates hotel ID format (legacy method)
   */
  static isValidHotelId(id: string): boolean {
    return this.isValidId(id);
  }

  /**
   * Gets the service type from pathname
   */
  static getServiceType(pathname: string): 'hotels' | 'car-hire' | 'visa-application' | 'travel-insurance' | null {
    const segments = pathname.split('/');
    const service = segments[1];
    
    if (['hotels', 'car-hire', 'visa-application', 'travel-insurance'].includes(service)) {
      return service as 'hotels' | 'car-hire' | 'visa-application' | 'travel-insurance';
    }
    
    return null;
  }

  /**
   * Validates if a route is part of any booking flow
   */
  static isBookingRoute(pathname: string): boolean {
    const serviceType = this.getServiceType(pathname);
    if (!serviceType) return false;

    const segments = pathname.split('/');
    
    switch (serviceType) {
      case 'hotels':
        return segments.length >= 4;
      case 'car-hire':
        return segments.length >= 4;
      case 'visa-application':
        return segments.length >= 3;
      case 'travel-insurance':
        return segments.length >= 3;
      default:
        return false;
    }
  }

  /**
   * Validates if a route is part of the hotel booking flow
   */
  static isHotelBookingRoute(pathname: string): boolean {
    return pathname.startsWith('/hotels/') && pathname.split('/').length >= 4;
  }

  /**
   * Gets the current step in any booking flow
   */
  static getBookingStep(pathname: string): string | null {
    const segments = pathname.split('/');
    const serviceType = this.getServiceType(pathname);
    
    if (!serviceType) return null;
    
    switch (serviceType) {
      case 'hotels':
        if (segments.length >= 4) {
          return segments[3];
        }
        break;
      case 'car-hire':
        if (segments.length >= 4) {
          return segments[3];
        }
        break;
      case 'visa-application':
        if (segments.length >= 3) {
          return segments[2];
        }
        break;
      case 'travel-insurance':
        if (segments.length >= 3) {
          return segments[2];
        }
        break;
    }
    
    return null;
  }

  /**
   * Gets the hotel ID from the current route
   */
  static getHotelIdFromRoute(pathname: string): string | null {
    const segments = pathname.split('/');
    if (segments.length >= 3 && segments[1] === 'hotels') {
      return segments[2];
    }
    return null;
  }

  /**
   * Gets the car ID from the current route
   */
  static getCarIdFromRoute(pathname: string): string | null {
    const segments = pathname.split('/');
    if (segments.length >= 3 && segments[1] === 'car-hire') {
      return segments[2];
    }
    return null;
  }

  /**
   * Gets the resource ID from any service route
   */
  static getResourceIdFromRoute(pathname: string): string | null {
    const serviceType = this.getServiceType(pathname);
    
    switch (serviceType) {
      case 'hotels':
        return this.getHotelIdFromRoute(pathname);
      case 'car-hire':
        return this.getCarIdFromRoute(pathname);
      case 'visa-application':
      case 'travel-insurance':
        // These services don't use resource IDs in routes
        return null;
      default:
        return null;
    }
  }
}

// Navigation utilities
export class NavigationHelper {
  /**
   * Builds URL with search criteria as query parameters
   */
  static buildHotelDetailsUrl(hotelId: string, searchCriteria?: SearchCriteria): string {
    const baseUrl = HOTEL_ROUTES.DETAILS(hotelId);
    
    if (!searchCriteria) {
      return baseUrl;
    }

    const params = new URLSearchParams({
      location: searchCriteria.location,
      checkin: searchCriteria.checkIn.toISOString().split('T')[0],
      checkout: searchCriteria.checkOut.toISOString().split('T')[0],
      rooms: searchCriteria.rooms.toString(),
      adults: searchCriteria.adults.toString(),
      children: searchCriteria.children.toString(),
    });

    return `${baseUrl}?${params.toString()}`;
  }

  /**
   * Builds URL for guest information page with search criteria
   */
  static buildGuestInfoUrl(hotelId: string, searchCriteria: SearchCriteria): string {
    const baseUrl = HOTEL_ROUTES.GUESTS(hotelId);
    
    const params = new URLSearchParams({
      location: searchCriteria.location,
      checkIn: searchCriteria.checkIn.toISOString(),
      checkOut: searchCriteria.checkOut.toISOString(),
      rooms: searchCriteria.rooms.toString(),
      adults: searchCriteria.adults.toString(),
      children: searchCriteria.children.toString(),
    });

    return `${baseUrl}?${params.toString()}`;
  }

  /**
   * Builds URL for payment page with search criteria
   */
  static buildPaymentUrl(hotelId: string, searchCriteria: SearchCriteria): string {
    const baseUrl = HOTEL_ROUTES.PAYMENT(hotelId);
    
    const params = new URLSearchParams({
      location: searchCriteria.location,
      checkIn: searchCriteria.checkIn.toISOString(),
      checkOut: searchCriteria.checkOut.toISOString(),
      rooms: searchCriteria.rooms.toString(),
      adults: searchCriteria.adults.toString(),
      children: searchCriteria.children.toString(),
    });

    return `${baseUrl}?${params.toString()}`;
  }

  /**
   * Parses search criteria from URL search parameters
   */
  static parseSearchCriteriaFromUrl(searchParams: URLSearchParams): SearchCriteria | null {
    const location = searchParams.get('location');
    const checkIn = searchParams.get('checkIn');
    const checkOut = searchParams.get('checkOut');
    const rooms = searchParams.get('rooms');
    const adults = searchParams.get('adults');
    const children = searchParams.get('children');

    if (!location || !checkIn || !checkOut) {
      return null;
    }

    return {
      location,
      checkIn: new Date(checkIn),
      checkOut: new Date(checkOut),
      rooms: parseInt(rooms || '1'),
      adults: parseInt(adults || '1'),
      children: parseInt(children || '0'),
    };
  }
}

// Booking flow step definitions
export const BOOKING_STEPS = {
  // Hotel steps
  SEARCH: 'search',
  DETAILS: 'details',
  GUESTS: 'guests',
  PAYMENT: 'payment',
  SUCCESS: 'success',
  
  // Car hire steps
  CAR_SEARCH: 'car-search',
  CAR_DETAILS: 'car-details',
  CONTACT: 'contact',
  
  // Visa application steps
  VISA_START: 'visa-start',
  PERSONAL: 'personal',
  PASSPORT: 'passport',
  APPOINTMENT: 'appointment',
  REVIEW: 'review',
  
  // Travel insurance steps
  INSURANCE_PLANS: 'insurance-plans',
  TRIP_DETAILS: 'details',
  TRAVELERS: 'travelers',
} as const;

export type BookingStep = typeof BOOKING_STEPS[keyof typeof BOOKING_STEPS];

// Service-specific step definitions
export const HOTEL_STEPS = [
  BOOKING_STEPS.SEARCH,
  BOOKING_STEPS.DETAILS,
  BOOKING_STEPS.GUESTS,
  BOOKING_STEPS.PAYMENT,
  BOOKING_STEPS.SUCCESS,
] as const;

export const CAR_HIRE_STEPS = [
  BOOKING_STEPS.CAR_SEARCH,
  BOOKING_STEPS.CAR_DETAILS,
  BOOKING_STEPS.CONTACT,
  BOOKING_STEPS.PAYMENT,
  BOOKING_STEPS.SUCCESS,
] as const;

export const VISA_STEPS = [
  BOOKING_STEPS.VISA_START,
  BOOKING_STEPS.PERSONAL,
  BOOKING_STEPS.PASSPORT,
  BOOKING_STEPS.APPOINTMENT,
  BOOKING_STEPS.REVIEW,
  BOOKING_STEPS.PAYMENT,
  BOOKING_STEPS.SUCCESS,
] as const;

export const INSURANCE_STEPS = [
  BOOKING_STEPS.INSURANCE_PLANS,
  BOOKING_STEPS.TRIP_DETAILS,
  BOOKING_STEPS.TRAVELERS,
  BOOKING_STEPS.REVIEW,
  BOOKING_STEPS.PAYMENT,
  BOOKING_STEPS.SUCCESS,
] as const;

// Booking flow navigation
export class BookingFlowNavigator {
  /**
   * Gets the step order for a specific service
   */
  static getStepOrder(serviceType: 'hotels' | 'car-hire' | 'visa-application' | 'travel-insurance'): readonly BookingStep[] {
    switch (serviceType) {
      case 'hotels':
        return HOTEL_STEPS;
      case 'car-hire':
        return CAR_HIRE_STEPS;
      case 'visa-application':
        return VISA_STEPS;
      case 'travel-insurance':
        return INSURANCE_STEPS;
      default:
        return HOTEL_STEPS;
    }
  }

  /**
   * Gets the next step in the booking flow for any service
   */
  static getNextStep(currentStep: BookingStep, serviceType?: 'hotels' | 'car-hire' | 'visa-application' | 'travel-insurance'): BookingStep | null {
    // Default to hotel steps if no service type provided (backward compatibility)
    const stepOrder = serviceType ? this.getStepOrder(serviceType) : HOTEL_STEPS;

    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex >= 0 && currentIndex < stepOrder.length - 1) {
      return stepOrder[currentIndex + 1];
    }
    return null;
  }

  /**
   * Gets the previous step in the booking flow for any service
   */
  static getPreviousStep(currentStep: BookingStep, serviceType?: 'hotels' | 'car-hire' | 'visa-application' | 'travel-insurance'): BookingStep | null {
    // Default to hotel steps if no service type provided (backward compatibility)
    const stepOrder = serviceType ? this.getStepOrder(serviceType) : HOTEL_STEPS;

    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex > 0) {
      return stepOrder[currentIndex - 1];
    }
    return null;
  }

  /**
   * Checks if a step is accessible based on the current step for any service
   */
  static isStepAccessible(targetStep: BookingStep, currentStep: BookingStep, serviceType?: 'hotels' | 'car-hire' | 'visa-application' | 'travel-insurance'): boolean {
    // Default to hotel steps if no service type provided (backward compatibility)
    const stepOrder = serviceType ? this.getStepOrder(serviceType) : HOTEL_STEPS;

    const targetIndex = stepOrder.indexOf(targetStep);
    const currentIndex = stepOrder.indexOf(currentStep);

    // Can always go back to previous steps
    if (targetIndex <= currentIndex) {
      return true;
    }

    // Can only go forward one step at a time
    return targetIndex === currentIndex + 1;
  }

  /**
   * Gets the progress percentage for the current step in any service
   */
  static getProgressPercentage(currentStep: BookingStep, serviceType?: 'hotels' | 'car-hire' | 'visa-application' | 'travel-insurance'): number {
    // Default to hotel steps if no service type provided (backward compatibility)
    const stepOrder = serviceType ? this.getStepOrder(serviceType) : HOTEL_STEPS;

    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex >= 0) {
      return ((currentIndex + 1) / stepOrder.length) * 100;
    }
    return 0;
  }

  /**
   * Maps route step names to booking steps for different services
   */
  static mapRouteStepToBookingStep(routeStep: string, serviceType: 'hotels' | 'car-hire' | 'visa-application' | 'travel-insurance'): BookingStep | null {
    switch (serviceType) {
      case 'hotels':
        switch (routeStep) {
          case 'details': return BOOKING_STEPS.DETAILS;
          case 'guests': return BOOKING_STEPS.GUESTS;
          case 'payment': return BOOKING_STEPS.PAYMENT;
          case 'success': return BOOKING_STEPS.SUCCESS;
          default: return BOOKING_STEPS.SEARCH;
        }
      case 'car-hire':
        switch (routeStep) {
          case 'details': return BOOKING_STEPS.CAR_DETAILS;
          case 'contact': return BOOKING_STEPS.CONTACT;
          case 'payment': return BOOKING_STEPS.PAYMENT;
          case 'success': return BOOKING_STEPS.SUCCESS;
          default: return BOOKING_STEPS.CAR_SEARCH;
        }
      case 'visa-application':
        switch (routeStep) {
          case 'personal': return BOOKING_STEPS.PERSONAL;
          case 'passport': return BOOKING_STEPS.PASSPORT;
          case 'appointment': return BOOKING_STEPS.APPOINTMENT;
          case 'review': return BOOKING_STEPS.REVIEW;
          case 'payment': return BOOKING_STEPS.PAYMENT;
          case 'success': return BOOKING_STEPS.SUCCESS;
          default: return BOOKING_STEPS.VISA_START;
        }
      case 'travel-insurance':
        switch (routeStep) {
          case 'details': return BOOKING_STEPS.TRIP_DETAILS;
          case 'travelers': return BOOKING_STEPS.TRAVELERS;
          case 'review': return BOOKING_STEPS.REVIEW;
          case 'payment': return BOOKING_STEPS.PAYMENT;
          case 'success': return BOOKING_STEPS.SUCCESS;
          default: return BOOKING_STEPS.INSURANCE_PLANS;
        }
      default:
        return null;
    }
  }
}