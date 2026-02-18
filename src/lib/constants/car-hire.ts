// ============================================================================
// CAR HIRE CONSTANTS
// ============================================================================

// Car types
export const CAR_TYPES = {
  ECONOMY: 'economy',
  COMPACT: 'compact',
  MIDSIZE: 'midsize',
  FULLSIZE: 'fullsize',
  LUXURY: 'luxury',
  SUV: 'suv',
} as const;

// Car type labels
export const CAR_TYPE_LABELS = {
  [CAR_TYPES.ECONOMY]: 'Economy',
  [CAR_TYPES.COMPACT]: 'Compact',
  [CAR_TYPES.MIDSIZE]: 'Midsize',
  [CAR_TYPES.FULLSIZE]: 'Full Size',
  [CAR_TYPES.LUXURY]: 'Luxury',
  [CAR_TYPES.SUV]: 'SUV',
} as const;

// Transmission types
export const TRANSMISSION_TYPES = {
  AUTOMATIC: 'automatic',
  MANUAL: 'manual',
} as const;

// Fuel policies
export const FUEL_POLICIES = {
  FULL_TO_FULL: 'full-to-full',
  FULL_TO_EMPTY: 'full-to-empty',
  SAME_TO_SAME: 'same-to-same',
} as const;

// Car feature categories
export const CAR_FEATURE_CATEGORIES = {
  COMFORT: 'comfort',
  SAFETY: 'safety',
  TECHNOLOGY: 'technology',
  CONVENIENCE: 'convenience',
} as const;

// Car extra categories
export const CAR_EXTRA_CATEGORIES = {
  DRIVER: 'driver',
  EQUIPMENT: 'equipment',
  INSURANCE: 'insurance',
} as const;

// Common car features
export const COMMON_CAR_FEATURES = [
  { id: 'ac', name: 'Air Conditioning', icon: 'snowflake', category: CAR_FEATURE_CATEGORIES.COMFORT },
  { id: 'unlimited_mileage', name: 'Unlimited Mileage', icon: 'road', category: CAR_FEATURE_CATEGORIES.CONVENIENCE },
  { id: 'automatic', name: 'Automatic Transmission', icon: 'gear', category: CAR_FEATURE_CATEGORIES.CONVENIENCE },
  { id: 'gps', name: 'GPS Navigation', icon: 'map-pin', category: CAR_FEATURE_CATEGORIES.TECHNOLOGY },
  { id: 'bluetooth', name: 'Bluetooth', icon: 'bluetooth', category: CAR_FEATURE_CATEGORIES.TECHNOLOGY },
  { id: 'usb', name: 'USB Ports', icon: 'usb', category: CAR_FEATURE_CATEGORIES.TECHNOLOGY },
] as const;

// Common car extras
export const COMMON_CAR_EXTRAS = [
  { id: 'additional_driver', name: 'Additional Driver', pricePerDay: 15, category: CAR_EXTRA_CATEGORIES.DRIVER },
  { id: 'child_seat', name: 'Child Seat', pricePerDay: 8, category: CAR_EXTRA_CATEGORIES.EQUIPMENT },
  { id: 'booster_seat', name: 'Booster Seat', pricePerDay: 6, category: CAR_EXTRA_CATEGORIES.EQUIPMENT },
  { id: 'gps_device', name: 'GPS Device', pricePerDay: 12, category: CAR_EXTRA_CATEGORIES.EQUIPMENT },
  { id: 'ski_rack', name: 'Ski Rack', pricePerDay: 10, category: CAR_EXTRA_CATEGORIES.EQUIPMENT },
  { id: 'full_coverage', name: 'Full Coverage Insurance', pricePerDay: 25, category: CAR_EXTRA_CATEGORIES.INSURANCE },
] as const;

// Booking status
export const CAR_BOOKING_STATUS = {
  CONFIRMED: 'confirmed',
  PENDING: 'pending',
  CANCELLED: 'cancelled',
} as const;

// Filter options
export const CAR_FILTER_OPTIONS = {
  CAPACITY: [2, 4, 5, 7, 9],
  PRICE_RANGES: [
    { min: 0, max: 50, label: 'Under $50' },
    { min: 50, max: 100, label: '$50 - $100' },
    { min: 100, max: 200, label: '$100 - $200' },
    { min: 200, max: 999999, label: 'Over $200' },
  ],
} as const;