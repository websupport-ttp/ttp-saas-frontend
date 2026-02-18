// ============================================================================
// HOTEL SERVICES FLOW TYPES
// ============================================================================

// Core hotel data model
export interface Hotel {
  id: string;
  name: string;
  location: {
    address: string;
    city: string;
    country: string;
  };
  images: string[];
  description: string;
  amenities: Amenity[];
  pricePerNight: number;
  classification: string;
  bedTypes: string[];
}

// Amenity interface
export interface Amenity {
  id: string;
  name: string;
  icon: string;
  category: 'connectivity' | 'dining' | 'wellness' | 'business' | 'comfort';
}

// Guest information
export interface Guest {
  type: 'Adult' | 'Minor';
  firstName: string;
  middleName?: string;
  lastName: string;
  suffix?: string;
  dateOfBirth: Date;
  email?: string;
  phoneNumber?: string;
  redressNumber?: string;
  knownTravellerNumber?: string;
}

// Booking data model
export interface Booking {
  id: string;
  confirmationNumber: string;
  hotel: Hotel;
  dates: {
    checkIn: Date;
    checkOut: Date;
  };
  guests: Guest[];
  rooms: number;
  pricing: {
    roomRate: number;
    nights: number;
    subtotal: number;
    taxes: number;
    total: number;
  };
  paymentMethod: PaymentDetails;
  status: 'confirmed' | 'pending' | 'cancelled';
  createdAt: Date;
}

// Payment method types
export type PaymentMethod = 'paystack' | 'google-pay' | 'apple-pay' | 'paypal';

// Card processor types
export type CardProcessor = 'paystack' | 'stripe' | 'flutterwave';

export interface PaymentDetails {
  method: PaymentMethod;
  cardProcessor?: CardProcessor; // For card payments
  cardDetails?: {
    name: string;
    number: string;
    expirationDate: string;
    ccv: string;
  };
  createAccount?: boolean;
}

// Search criteria
export interface SearchCriteria {
  location: string;
  checkIn: Date;
  checkOut: Date;
  rooms: number;
  adults: number;
  children: number;
}

// Filter options
export interface FilterOptions {
  maxPrice?: number;
  amenities?: string[];
  bedType?: string;
  classification?: string;
}

// ============================================================================
// COMPONENT PROP INTERFACES
// ============================================================================

// Hotel search form props
export interface HotelSearchFormProps {
  location: string;
  checkIn: Date;
  checkOut: Date;
  rooms: number;
  adults: number;
  children: number;
  onSearch: (criteria: SearchCriteria) => void;
}

// Filter bar props
export interface FilterBarProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
}

// Hotel gallery props
export interface HotelGalleryProps {
  images: {
    main: string;
    thumbnails: string[];
  };
  hotelName: string;
}

// Guest information form props
export interface GuestInformationFormProps {
  guests: Guest[];
  onGuestUpdate: (guestIndex: number, guestData: Guest) => void;
  onSubmit: (allGuests: Guest[]) => void;
}

// Payment method selector props
export interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod;
  selectedCardProcessor?: CardProcessor;
  onMethodChange: (method: PaymentMethod) => void;
  onCardProcessorChange?: (processor: CardProcessor) => void;
}

// Booking summary props
export interface BookingSummaryProps {
  hotel: HotelDetails;
  dates: {
    checkIn: Date;
    checkOut: Date;
    nights: number;
  };
  guests: Guest[];
  pricing: {
    subtotal: number;
    taxes: number;
    total: number;
  };
}

// Success notification props
export interface SuccessNotificationProps {
  confirmationNumber: string;
  onDismiss?: () => void;
}

// Booking confirmation props
export interface BookingConfirmationProps {
  booking: Booking;
}

// Service layout props
export interface ServiceLayoutProps {
  children: React.ReactNode;
  title?: string;
  breadcrumbs?: Array<{ name: string; href: string }>;
}

// Hotel details (extended hotel info for booking)
export interface HotelDetails extends Hotel {
  policies?: {
    checkIn: string;
    checkOut: string;
    cancellation: string;
  };
  contact?: {
    phone: string;
    email: string;
  };
}