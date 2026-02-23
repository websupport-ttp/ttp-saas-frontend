// ============================================================================
// CAR HIRE SERVICE TYPES
// ============================================================================

// Car rental data model
export interface CarRental {
  id: string;
  name: string;
  brand?: string;
  model?: string;
  year?: number;
  type: 'economy' | 'compact' | 'midsize' | 'fullsize' | 'luxury' | 'suv';
  capacity: number;
  doors: number;
  transmission: 'automatic' | 'manual';
  fuelType?: 'petrol' | 'diesel' | 'electric' | 'hybrid';
  features?: CarFeature[];
  pricePerDay: number;
  currency?: string;
  location?: string;
  supplier?: CarSupplier;
  image: string;
  images?: string[];
  rating?: number;
  fuelPolicy?: 'full-to-full' | 'full-to-empty' | 'same-to-same';
  mileage?: 'unlimited' | 'limited';
  airConditioning?: boolean;
}

// Car feature interface
export interface CarFeature {
  id: string;
  name: string;
  icon: string;
  included: boolean;
  description?: string;
}

// Car supplier information
export interface CarSupplier {
  name: string;
  logo: string;
  rating: number;
  recommendationPercentage: number;
  location: string;
  hoursOfOperation: {
    weekdays: string;
    weekends: string;
  };
}

// Car booking data model
export interface CarBooking {
  id: string;
  carId: string;
  pickupLocation: string;
  pickupDate: Date;
  returnDate: Date;
  driverInfo: DriverInformation;
  emergencyContact: EmergencyContact;
  extras: CarExtra[];
  totalCost: number;
  confirmationNumber: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  createdAt: Date;
}

// Driver information
export interface DriverInformation {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: Date;
  licenseNumber: string;
  licenseCountry: string;
  licenseExpiryDate: Date;
}

// Emergency contact information
export interface EmergencyContact {
  name: string;
  relationship: string;
  phoneNumber: string;
  email?: string;
}

// Car extras/add-ons
export interface CarExtra {
  id: string;
  name: string;
  description: string;
  pricePerDay: number;
  quantity: number;
  category: 'driver' | 'equipment' | 'insurance';
}

// Car search criteria
export interface CarSearchCriteria {
  location: string;
  pickupDate: Date;
  returnDate: Date;
  passengerCount: number;
  driverAge?: number;
}

// Car filter options
export interface CarFilterOptions {
  carType?: string[];
  capacity?: number;
  maxPrice?: number;
  supplier?: string[];
  transmission?: 'automatic' | 'manual';
  fuelPolicy?: string;
  features?: string[];
}

// ============================================================================
// COMPONENT PROP INTERFACES
// ============================================================================

// Car search form props
export interface CarSearchFormProps {
  location: string;
  pickupDate: Date;
  returnDate: Date;
  passengerCount: number;
  onSearch: (criteria: CarSearchCriteria) => void;
}

// Car card props
export interface CarCardProps {
  car: CarRental;
  onSelect: (carId: string) => void;
  className?: string;
}

// Car filter bar props
export interface CarFilterBarProps {
  filters: CarFilterOptions;
  onFilterChange: (filters: CarFilterOptions) => void;
  availableSuppliers: string[];
}

// Car details view props
export interface CarDetailsViewProps {
  car: CarRental;
  selectedExtras: CarExtra[];
  onExtrasChange: (extras: CarExtra[]) => void;
  onBookNow: () => void;
}

// Car contact form props
export interface CarContactFormProps {
  driverInfo: DriverInformation;
  emergencyContact: EmergencyContact;
  onDriverInfoChange: (info: DriverInformation) => void;
  onEmergencyContactChange: (contact: EmergencyContact) => void;
  onSubmit: () => void;
}