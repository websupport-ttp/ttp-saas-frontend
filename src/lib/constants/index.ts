// ============================================================================
// SHARED CONSTANTS EXPORTS
// ============================================================================

// Re-export all service constants
export * from './hotels';
export * from './icons';
export * from './car-hire';
export * from './visa-application';
export * from './travel-insurance';

// Service navigation constants
export const SERVICE_ROUTES = {
  FLIGHTS: '/flights',
  HOTELS: '/hotels',
  CAR_HIRE: '/car-hire',
  VISA_APPLICATION: '/visa-application',
  TRAVEL_INSURANCE: '/travel-insurance',
} as const;

// Service labels
export const SERVICE_LABELS = {
  [SERVICE_ROUTES.FLIGHTS]: 'Flights',
  [SERVICE_ROUTES.HOTELS]: 'Hotels',
  [SERVICE_ROUTES.CAR_HIRE]: 'Car Hire',
  [SERVICE_ROUTES.VISA_APPLICATION]: 'Visa Assistance',
  [SERVICE_ROUTES.TRAVEL_INSURANCE]: 'Travel Insurance',
} as const;

// Common form validation patterns
export const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^\+?[\d\s\-\(\)]+$/,
  PASSPORT: /^[A-Z0-9]{6,12}$/,
  LICENSE: /^[A-Z0-9\-]{5,20}$/,
  POSTAL_CODE: /^[A-Z0-9\s\-]{3,10}$/i,
} as const;

// Date format constants
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  INPUT: 'yyyy-MM-dd',
  API: 'yyyy-MM-dd\'T\'HH:mm:ss.SSS\'Z\'',
} as const;

// Currency constants
export const CURRENCIES = {
  USD: { code: 'USD', symbol: '$', name: 'US Dollar' },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro' },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound' },
  CAD: { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  AUD: { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
} as const;