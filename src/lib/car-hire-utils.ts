// ============================================================================
// CAR HIRE UTILITY FUNCTIONS
// ============================================================================

import { CarRental, CarExtra, CarSearchCriteria, CarFilterOptions } from '@/types/car-hire';

/**
 * Calculate the total cost for a car rental booking
 * Minimum 1 day charge even for same-day rentals
 */
export function calculateCarRentalCost(
  car: CarRental,
  pickupDate: Date,
  returnDate: Date,
  extras: CarExtra[] = []
): number {
  const days = Math.max(1, Math.ceil((returnDate.getTime() - pickupDate.getTime()) / (1000 * 60 * 60 * 24)));
  const carCost = car.pricePerDay * days;
  const extrasCost = extras.reduce((total, extra) => total + (extra.pricePerDay * extra.quantity * days), 0);
  
  return carCost + extrasCost;
}

/**
 * Calculate the number of rental days
 * Minimum 1 day even for same-day rentals
 */
export function calculateRentalDays(pickupDate: Date, returnDate: Date): number {
  const days = Math.ceil((returnDate.getTime() - pickupDate.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(1, days); // Minimum 1 day
}

/**
 * Format car type for display
 */
export function formatCarType(type: string): string {
  const typeMap: { [key: string]: string } = {
    'economy': 'Economy',
    'compact': 'Compact',
    'midsize': 'Midsize',
    'fullsize': 'Full Size',
    'luxury': 'Luxury',
    'suv': 'SUV',
  };
  return typeMap[type] || type;
}

/**
 * Filter cars based on search criteria and filters
 */
export function filterCars(
  cars: CarRental[],
  criteria: CarSearchCriteria,
  filters: CarFilterOptions
): CarRental[] {
  return cars.filter(car => {
    // Capacity filter
    if (criteria.passengerCount && car.capacity < criteria.passengerCount) {
      return false;
    }

    // Car type filter
    if (filters.carType && filters.carType.length > 0 && !filters.carType.includes(car.type)) {
      return false;
    }

    // Capacity filter
    if (filters.capacity && car.capacity < filters.capacity) {
      return false;
    }

    // Price filter
    if (filters.maxPrice && car.pricePerDay > filters.maxPrice) {
      return false;
    }

    // Supplier filter
    if (filters.supplier && filters.supplier.length > 0 && !filters.supplier.includes(car.supplier?.name || '')) {
      return false;
    }

    // Transmission filter
    if (filters.transmission && car.transmission !== filters.transmission) {
      return false;
    }

    // Features filter
    if (filters.features && filters.features.length > 0 && car.features && Array.isArray(car.features)) {
      // Check if features is an array of objects with 'included' property
      if (car.features.length > 0 && typeof car.features[0] === 'object' && 'included' in car.features[0]) {
        const carFeatureIds = (car.features as any[]).filter(f => f.included).map(f => f.id);
        const hasAllFeatures = filters.features.every(featureId => carFeatureIds.includes(featureId));
        if (!hasAllFeatures) {
          return false;
        }
      }
    }

    return true;
  });
}

/**
 * Sort cars by different criteria
 */
export function sortCars(
  cars: CarRental[],
  sortBy: 'price' | 'rating' | 'capacity' | 'name',
  sortOrder: 'asc' | 'desc' = 'asc'
): CarRental[] {
  return [...cars].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'price':
        comparison = a.pricePerDay - b.pricePerDay;
        break;
      case 'rating':
        comparison = (a.rating || 0) - (b.rating || 0);
        break;
      case 'capacity':
        comparison = a.capacity - b.capacity;
        break;
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
    }

    return sortOrder === 'desc' ? -comparison : comparison;
  });
}

/**
 * Validate driver age for car rental
 */
export function validateDriverAge(age: number, carType: string): { valid: boolean; message?: string } {
  if (age < 21) {
    return { valid: false, message: 'Driver must be at least 21 years old' };
  }

  if (age < 25 && (carType === 'luxury' || carType === 'suv')) {
    return { valid: false, message: 'Driver must be at least 25 years old for luxury and SUV vehicles' };
  }

  return { valid: true };
}

/**
 * Generate a car booking confirmation number
 */
export function generateCarBookingConfirmation(): string {
  const prefix = 'CAR';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}${timestamp}${random}`;
}

/**
 * Format car features for display
 */
export function formatCarFeatures(car: CarRental): string[] {
  const features = [];
  
  features.push(`${car.capacity} passengers`);
  features.push(`${car.doors} doors`);
  features.push(car.transmission === 'automatic' ? 'Automatic' : 'Manual');
  
  if (car.airConditioning) {
    features.push('Air Conditioning');
  }
  
  if (car.mileage === 'unlimited') {
    features.push('Unlimited Mileage');
  }

  return features;
}

/**
 * Calculate age from date of birth
 */
export function calculateAge(dateOfBirth: Date): number {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}

/**
 * Validate license expiry date
 */
export function validateLicenseExpiry(expiryDate: Date): { valid: boolean; message?: string } {
  const today = new Date();
  const threeMonthsFromNow = new Date();
  threeMonthsFromNow.setMonth(today.getMonth() + 3);

  if (expiryDate <= today) {
    return { valid: false, message: 'License has expired' };
  }

  if (expiryDate <= threeMonthsFromNow) {
    return { valid: false, message: 'License expires within 3 months. Please renew before travel.' };
  }

  return { valid: true };
}
/**

 * Mock car rental data for development and testing
 */
export const MOCK_CAR_RENTALS: CarRental[] = [
  {
    id: 'car-1',
    name: 'Toyota Corolla',
    type: 'economy',
    capacity: 5,
    doors: 4,
    transmission: 'automatic',
    features: [
      { id: 'ac', name: 'Air Conditioning', icon: 'snowflake', included: true },
      { id: 'unlimited_mileage', name: 'Unlimited Mileage', icon: 'road', included: true },
      { id: 'bluetooth', name: 'Bluetooth', icon: 'bluetooth', included: true },
    ],
    pricePerDay: 45,
    supplier: {
      name: 'Budget',
      logo: '/images/suppliers/budget.png',
      rating: 4.2,
      recommendationPercentage: 85,
      location: 'Airport Terminal 1',
      hoursOfOperation: {
        weekdays: '6:00 AM - 11:00 PM',
        weekends: '7:00 AM - 10:00 PM'
      }
    },
    image: '/images/cars/toyota-corolla.jpg',
    rating: 4.3,
    fuelPolicy: 'full-to-full',
    mileage: 'unlimited',
    airConditioning: true
  },
  {
    id: 'car-2',
    name: 'Honda Civic',
    type: 'compact',
    capacity: 5,
    doors: 4,
    transmission: 'automatic',
    features: [
      { id: 'ac', name: 'Air Conditioning', icon: 'snowflake', included: true },
      { id: 'unlimited_mileage', name: 'Unlimited Mileage', icon: 'road', included: true },
      { id: 'gps', name: 'GPS Navigation', icon: 'map-pin', included: true },
      { id: 'usb', name: 'USB Ports', icon: 'usb', included: true },
    ],
    pricePerDay: 55,
    supplier: {
      name: 'Hertz',
      logo: '/images/suppliers/hertz.png',
      rating: 4.5,
      recommendationPercentage: 92,
      location: 'Downtown Location',
      hoursOfOperation: {
        weekdays: '7:00 AM - 10:00 PM',
        weekends: '8:00 AM - 9:00 PM'
      }
    },
    image: '/images/cars/honda-civic.jpg',
    rating: 4.4,
    fuelPolicy: 'full-to-full',
    mileage: 'unlimited',
    airConditioning: true
  },
  {
    id: 'car-3',
    name: 'Ford Explorer',
    type: 'suv',
    capacity: 7,
    doors: 4,
    transmission: 'automatic',
    features: [
      { id: 'ac', name: 'Air Conditioning', icon: 'snowflake', included: true },
      { id: 'unlimited_mileage', name: 'Unlimited Mileage', icon: 'road', included: true },
      { id: 'gps', name: 'GPS Navigation', icon: 'map-pin', included: true },
      { id: 'bluetooth', name: 'Bluetooth', icon: 'bluetooth', included: true },
    ],
    pricePerDay: 85,
    supplier: {
      name: 'Enterprise',
      logo: '/images/suppliers/enterprise.png',
      rating: 4.6,
      recommendationPercentage: 88,
      location: 'Airport Terminal 2',
      hoursOfOperation: {
        weekdays: '6:00 AM - 11:30 PM',
        weekends: '7:00 AM - 10:30 PM'
      }
    },
    image: '/images/cars/ford-explorer.jpg',
    rating: 4.5,
    fuelPolicy: 'full-to-full',
    mileage: 'unlimited',
    airConditioning: true
  },
  {
    id: 'car-4',
    name: 'BMW 3 Series',
    type: 'luxury',
    capacity: 5,
    doors: 4,
    transmission: 'automatic',
    features: [
      { id: 'ac', name: 'Air Conditioning', icon: 'snowflake', included: true },
      { id: 'unlimited_mileage', name: 'Unlimited Mileage', icon: 'road', included: true },
      { id: 'gps', name: 'GPS Navigation', icon: 'map-pin', included: true },
      { id: 'bluetooth', name: 'Bluetooth', icon: 'bluetooth', included: true },
    ],
    pricePerDay: 120,
    supplier: {
      name: 'Avis',
      logo: '/images/suppliers/avis.png',
      rating: 4.7,
      recommendationPercentage: 90,
      location: 'Premium Car Center',
      hoursOfOperation: {
        weekdays: '8:00 AM - 9:00 PM',
        weekends: '9:00 AM - 8:00 PM'
      }
    },
    image: '/images/cars/bmw-3-series.jpg',
    rating: 4.6,
    fuelPolicy: 'full-to-full',
    mileage: 'unlimited',
    airConditioning: true
  },
  {
    id: 'car-5',
    name: 'Nissan Sentra',
    type: 'compact',
    capacity: 5,
    doors: 4,
    transmission: 'manual',
    features: [
      { id: 'ac', name: 'Air Conditioning', icon: 'snowflake', included: true },
      { id: 'unlimited_mileage', name: 'Unlimited Mileage', icon: 'road', included: false },
      { id: 'bluetooth', name: 'Bluetooth', icon: 'bluetooth', included: true },
    ],
    pricePerDay: 35,
    supplier: {
      name: 'Thrifty',
      logo: '/images/suppliers/thrifty.png',
      rating: 4.0,
      recommendationPercentage: 78,
      location: 'City Center',
      hoursOfOperation: {
        weekdays: '7:00 AM - 9:00 PM',
        weekends: '8:00 AM - 8:00 PM'
      }
    },
    image: '/images/cars/nissan-sentra.jpg',
    rating: 4.1,
    fuelPolicy: 'same-to-same',
    mileage: 'limited',
    airConditioning: true
  },
  {
    id: 'car-6',
    name: 'Chevrolet Tahoe',
    type: 'suv',
    capacity: 8,
    doors: 4,
    transmission: 'automatic',
    features: [
      { id: 'ac', name: 'Air Conditioning', icon: 'snowflake', included: true },
      { id: 'unlimited_mileage', name: 'Unlimited Mileage', icon: 'road', included: true },
      { id: 'gps', name: 'GPS Navigation', icon: 'map-pin', included: true },
      { id: 'bluetooth', name: 'Bluetooth', icon: 'bluetooth', included: true },
    ],
    pricePerDay: 95,
    supplier: {
      name: 'Budget',
      logo: '/images/suppliers/budget.png',
      rating: 4.2,
      recommendationPercentage: 85,
      location: 'Airport Terminal 1',
      hoursOfOperation: {
        weekdays: '6:00 AM - 11:00 PM',
        weekends: '7:00 AM - 10:00 PM'
      }
    },
    image: '/images/cars/chevrolet-tahoe.jpg',
    rating: 4.3,
    fuelPolicy: 'full-to-full',
    mileage: 'unlimited',
    airConditioning: true
  }
];

/**
 * Get available car suppliers from mock data
 */
export function getAvailableSuppliers(): string[] {
  const suppliers = MOCK_CAR_RENTALS.map(car => car.supplier?.name || 'Unknown').filter(name => name !== 'Unknown');
  const uniqueSuppliers = Array.from(new Set(suppliers));
  return uniqueSuppliers.sort();
}