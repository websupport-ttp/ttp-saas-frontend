// ============================================================================
// HOTEL SERVICES UTILITIES
// ============================================================================

import { SearchCriteria, FilterOptions, Hotel, Booking, Guest } from '@/types/hotels';
import { HOTEL_AMENITIES } from '@/lib/constants/hotels';

// Sample hotel data for development
export const SAMPLE_HOTELS: Hotel[] = [
  {
    id: '1',
    name: 'Luxury Resort & Spa',
    location: {
      address: '123 Beach Road',
      city: 'Bali',
      country: 'Indonesia',
    },
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    ],
    description: 'Experience ultimate luxury at our beachfront resort with world-class spa facilities, multiple dining options, and stunning ocean views.',
    amenities: [
      HOTEL_AMENITIES.find(a => a.id === 'wifi')!,
      HOTEL_AMENITIES.find(a => a.id === 'spa')!,
      HOTEL_AMENITIES.find(a => a.id === 'pool')!,
      HOTEL_AMENITIES.find(a => a.id === 'restaurant')!,
      HOTEL_AMENITIES.find(a => a.id === 'room-service')!,
    ],
    pricePerNight: 45000,
    classification: '5-Star Luxury',
    bedTypes: ['King', 'Queen', 'Twin'],
  },
  {
    id: '2',
    name: 'City Center Hotel',
    location: {
      address: '456 Downtown Street',
      city: 'Tokyo',
      country: 'Japan',
    },
    images: [
      'https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    ],
    description: 'Modern hotel in the heart of Tokyo with easy access to shopping, dining, and major attractions. Perfect for business and leisure travelers.',
    amenities: [
      HOTEL_AMENITIES.find(a => a.id === 'wifi')!,
      HOTEL_AMENITIES.find(a => a.id === 'business-center')!,
      HOTEL_AMENITIES.find(a => a.id === 'gym')!,
      HOTEL_AMENITIES.find(a => a.id === 'restaurant')!,
    ],
    pricePerNight: 35000,
    classification: '4-Star',
    bedTypes: ['Queen', 'Twin'],
  },
  {
    id: '3',
    name: 'Boutique Hotel',
    location: {
      address: '789 Art District',
      city: 'Paris',
      country: 'France',
    },
    images: [
      'https://images.unsplash.com/photo-1455587734955-081b22074882?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1587985064135-0366536eab42?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    ],
    description: 'Charming boutique hotel in the artistic heart of Paris. Each room is uniquely designed with local artwork and premium amenities.',
    amenities: [
      HOTEL_AMENITIES.find(a => a.id === 'wifi')!,
      HOTEL_AMENITIES.find(a => a.id === 'restaurant')!,
      HOTEL_AMENITIES.find(a => a.id === 'concierge')!,
      HOTEL_AMENITIES.find(a => a.id === 'laundry')!,
    ],
    pricePerNight: 65000,
    classification: 'Boutique',
    bedTypes: ['King', 'Queen'],
  },
  {
    id: '4',
    name: 'Mountain Lodge',
    location: {
      address: '321 Alpine Way',
      city: 'Aspen',
      country: 'USA',
    },
    images: [
      'https://images.unsplash.com/photo-1520637836862-4d197d17c90a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1549294413-26f195200c16?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    ],
    description: 'Cozy mountain lodge with breathtaking views, perfect for skiing and outdoor adventures. Features rustic charm with modern comforts.',
    amenities: [
      HOTEL_AMENITIES.find(a => a.id === 'wifi')!,
      HOTEL_AMENITIES.find(a => a.id === 'restaurant')!,
      HOTEL_AMENITIES.find(a => a.id === 'parking')!,
      HOTEL_AMENITIES.find(a => a.id === 'gym')!,
    ],
    pricePerNight: 55000,
    classification: 'Resort',
    bedTypes: ['King', 'Queen', 'Twin'],
  },
  {
    id: '5',
    name: 'Budget Inn',
    location: {
      address: '654 Main Street',
      city: 'Austin',
      country: 'USA',
    },
    images: [
      'https://images.unsplash.com/photo-1586611292717-f828b167408c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    ],
    description: 'Clean, comfortable, and affordable accommodation in downtown Austin. Great value for money with essential amenities.',
    amenities: [
      HOTEL_AMENITIES.find(a => a.id === 'wifi')!,
      HOTEL_AMENITIES.find(a => a.id === 'parking')!,
    ],
    pricePerNight: 18000,
    classification: 'Budget',
    bedTypes: ['Queen', 'Twin'],
  },
  {
    id: '6',
    name: 'Business Hotel',
    location: {
      address: '987 Corporate Blvd',
      city: 'Singapore',
      country: 'Singapore',
    },
    images: [
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    ],
    description: 'Professional business hotel with state-of-the-art meeting facilities, high-speed internet, and executive services.',
    amenities: [
      HOTEL_AMENITIES.find(a => a.id === 'wifi')!,
      HOTEL_AMENITIES.find(a => a.id === 'business-center')!,
      HOTEL_AMENITIES.find(a => a.id === 'gym')!,
      HOTEL_AMENITIES.find(a => a.id === 'restaurant')!,
      HOTEL_AMENITIES.find(a => a.id === 'laundry')!,
    ],
    pricePerNight: 42000,
    classification: 'Business Hotel',
    bedTypes: ['King', 'Queen'],
  },
];

/**
 * Get hotel by ID
 */
export function getHotelById(id: string): Hotel | null {
  return SAMPLE_HOTELS.find(hotel => hotel.id === id) || null;
}

/**
 * Calculate the number of nights between check-in and check-out dates
 */
export function calculateNights(checkIn: Date, checkOut: Date): number {
  const timeDiff = checkOut.getTime() - checkIn.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
}

/**
 * Calculate total booking price including taxes
 */
export function calculateBookingPrice(
  roomRate: number,
  nights: number,
  taxRate: number = 0.12
): { subtotal: number; taxes: number; total: number } {
  const subtotal = roomRate * nights;
  const taxes = subtotal * taxRate;
  const total = subtotal + taxes;
  
  return {
    subtotal: Math.round(subtotal * 100) / 100,
    taxes: Math.round(taxes * 100) / 100,
    total: Math.round(total * 100) / 100,
  };
}

/**
 * Format price with currency symbol
 */
export function formatPrice(amount: number, currency: string = 'NGN'): string {
  if (currency === 'NGN') {
    return `₦${amount.toLocaleString()}`;
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Format date for display
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

/**
 * Validate search criteria
 */
export function validateSearchCriteria(criteria: SearchCriteria): string[] {
  const errors: string[] = [];
  
  if (!criteria.location.trim()) {
    errors.push('Location is required');
  }
  
  if (criteria.checkOut <= criteria.checkIn) {
    errors.push('Check-out date must be after check-in date');
  }
  
  if (criteria.rooms < 1) {
    errors.push('At least one room is required');
  }
  
  if (criteria.adults < 1) {
    errors.push('At least one adult is required');
  }
  
  if (criteria.children < 0) {
    errors.push('Number of children cannot be negative');
  }
  
  return errors;
}

/**
 * Filter hotels based on criteria
 */
export function filterHotels(hotels: Hotel[], filters: FilterOptions): Hotel[] {
  return hotels.filter(hotel => {
    // Price filter
    if (filters.maxPrice && hotel.pricePerNight > filters.maxPrice) {
      return false;
    }
    
    // Amenities filter
    if (filters.amenities && filters.amenities.length > 0) {
      const hotelAmenityIds = hotel.amenities.map(a => a.id);
      const hasAllAmenities = filters.amenities.every(amenityId =>
        hotelAmenityIds.includes(amenityId)
      );
      if (!hasAllAmenities) {
        return false;
      }
    }
    
    // Bed type filter
    if (filters.bedType && !hotel.bedTypes.includes(filters.bedType)) {
      return false;
    }
    
    // Classification filter
    if (filters.classification && hotel.classification !== filters.classification) {
      return false;
    }
    
    return true;
  });
}

/**
 * Generate a booking confirmation number
 */
export function generateConfirmationNumber(): string {
  const prefix = 'HTL';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}${timestamp}${random}`;
}

/**
 * Validate guest information
 */
export function validateGuestInfo(guest: any): string[] {
  const errors: string[] = [];
  
  if (!guest.firstName?.trim()) {
    errors.push('First name is required');
  }
  
  if (!guest.lastName?.trim()) {
    errors.push('Last name is required');
  }
  
  if (!guest.dateOfBirth) {
    errors.push('Date of birth is required');
  }
  
  if (guest.type === 'Adult') {
    if (!guest.email?.trim()) {
      errors.push('Email is required for adults');
    }
    
    if (!guest.phoneNumber?.trim()) {
      errors.push('Phone number is required for adults');
    }
  }
  
  return errors;
}

/**
 * Check if a date is in the past
 */
export function isDateInPast(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
}

/**
 * Get minimum check-in date (today)
 */
export function getMinCheckInDate(): Date {
  return new Date();
}

/**
 * Get minimum check-out date (tomorrow)
 */
export function getMinCheckOutDate(checkInDate?: Date): Date {
  const minDate = checkInDate ? new Date(checkInDate) : new Date();
  minDate.setDate(minDate.getDate() + 1);
  return minDate;
}

/**
 * Create initial guest list based on booking criteria
 */
export function createInitialGuestList(adults: number, children: number): Guest[] {
  const guests: Guest[] = [];
  
  // Add adult guests
  for (let i = 0; i < adults; i++) {
    guests.push({
      type: 'Adult',
      firstName: '',
      middleName: '',
      lastName: '',
      suffix: '',
      dateOfBirth: new Date(),
      email: '',
      phoneNumber: '',
      redressNumber: '',
      knownTravellerNumber: '',
    });
  }
  
  // Add child guests
  for (let i = 0; i < children; i++) {
    guests.push({
      type: 'Minor',
      firstName: '',
      middleName: '',
      lastName: '',
      suffix: '',
      dateOfBirth: new Date(),
      email: '',
      phoneNumber: '',
      redressNumber: '',
      knownTravellerNumber: '',
    });
  }
  
  return guests;
}

/**
 * Determine guest type based on age
 */
export function determineGuestType(dateOfBirth: Date): 'Adult' | 'Minor' {
  const today = new Date();
  const age = today.getFullYear() - dateOfBirth.getFullYear();
  const monthDiff = today.getMonth() - dateOfBirth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())) {
    return age - 1 >= 18 ? 'Adult' : 'Minor';
  }
  
  return age >= 18 ? 'Adult' : 'Minor';
}

/**
 * Update guest type based on date of birth
 */
export function updateGuestTypeFromAge(guest: Guest): Guest {
  const guestType = determineGuestType(guest.dateOfBirth);
  return {
    ...guest,
    type: guestType,
  };
}

/**
 * Validate all guests in a booking
 */
export function validateAllGuests(guests: Guest[]): { [guestIndex: number]: string[] } {
  const errors: { [guestIndex: number]: string[] } = {};
  
  guests.forEach((guest, index) => {
    const guestErrors = validateGuestInfo(guest);
    if (guestErrors.length > 0) {
      errors[index] = guestErrors;
    }
  });
  
  return errors;
}

/**
 * Get guest count summary
 */
export function getGuestCountSummary(guests: Guest[]): { adults: number; minors: number; total: number } {
  const adults = guests.filter(guest => guest.type === 'Adult').length;
  const minors = guests.filter(guest => guest.type === 'Minor').length;
  
  return {
    adults,
    minors,
    total: adults + minors,
  };
}

/**
 * Format guest name for display
 */
export function formatGuestName(guest: Guest): string {
  const parts = [guest.firstName, guest.middleName, guest.lastName, guest.suffix]
    .filter(part => part && part.trim())
    .map(part => part!.trim());
  
  return parts.join(' ');
}

/**
 * Check if guest information is complete
 */
export function isGuestInfoComplete(guest: Guest): boolean {
  const errors = validateGuestInfo(guest);
  return errors.length === 0;
}

/**
 * Check if all guests have complete information
 */
export function areAllGuestsComplete(guests: Guest[]): boolean {
  return guests.every(guest => isGuestInfoComplete(guest));
}