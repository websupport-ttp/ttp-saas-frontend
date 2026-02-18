// ============================================================================
// HOTEL SERVICES CONSTANTS
// ============================================================================

import { Amenity } from '@/types/hotels';

// Common hotel amenities
export const HOTEL_AMENITIES: Amenity[] = [
  {
    id: 'wifi',
    name: 'Free WiFi',
    icon: 'wifi',
    category: 'connectivity',
  },
  {
    id: 'restaurant',
    name: 'Restaurant',
    icon: 'restaurant',
    category: 'dining',
  },
  {
    id: 'spa',
    name: 'Spa & Wellness',
    icon: 'spa',
    category: 'wellness',
  },
  {
    id: 'gym',
    name: 'Fitness Center',
    icon: 'gym',
    category: 'wellness',
  },
  {
    id: 'pool',
    name: 'Swimming Pool',
    icon: 'pool',
    category: 'wellness',
  },
  {
    id: 'parking',
    name: 'Free Parking',
    icon: 'parking',
    category: 'comfort',
  },
  {
    id: 'room-service',
    name: 'Room Service',
    icon: 'room-service',
    category: 'comfort',
  },
  {
    id: 'business-center',
    name: 'Business Center',
    icon: 'business',
    category: 'business',
  },
  {
    id: 'concierge',
    name: 'Concierge',
    icon: 'concierge',
    category: 'comfort',
  },
  {
    id: 'laundry',
    name: 'Laundry Service',
    icon: 'laundry',
    category: 'comfort',
  },
];

// Hotel classifications
export const HOTEL_CLASSIFICATIONS = [
  '5-Star Luxury',
  '4-Star',
  '3-Star',
  'Boutique',
  'Resort',
  'Business Hotel',
  'Budget',
] as const;

// Bed types
export const BED_TYPES = [
  'Single',
  'Double',
  'Queen',
  'King',
  'Twin',
  'Sofa Bed',
] as const;

// Payment methods
export const PAYMENT_METHODS = [
  {
    id: 'credit-card',
    name: 'Credit Card',
    icon: 'credit-card',
  },
  {
    id: 'google-pay',
    name: 'Google Pay',
    icon: 'google-pay',
  },
  {
    id: 'apple-pay',
    name: 'Apple Pay',
    icon: 'apple-pay',
  },
  {
    id: 'paypal',
    name: 'PayPal',
    icon: 'paypal',
  },
  {
    id: 'crypto',
    name: 'Cryptocurrency',
    icon: 'crypto',
  },
] as const;

// Default tax rate (12%)
export const DEFAULT_TAX_RATE = 0.12;

// Maximum number of guests per room
export const MAX_GUESTS_PER_ROOM = 4;

// Maximum number of rooms per booking
export const MAX_ROOMS_PER_BOOKING = 5;

// Booking status options
export const BOOKING_STATUSES = [
  'confirmed',
  'pending',
  'cancelled',
] as const;