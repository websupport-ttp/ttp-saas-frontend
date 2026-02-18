// ============================================================================
// CORE DATA TYPES
// ============================================================================

// Geographic coordinates
export interface Coordinates {
  lat: number;
  lng: number;
}

// Enhanced destination interface
export interface Destination {
  id: string;
  name: string;
  country: string;
  continent: string;
  image: string;
  price: number;
  currency: string;
  duration: string;
  description: string;
  highlights: string[];
  bestTimeToVisit: string;
  coordinates: Coordinates;
}

// Enhanced hotel interface
export interface Hotel {
  id: string;
  name: string;
  location: string;
  city: string;
  country: string;
  image: string;
  gallery: string[];
  rating: number;
  reviewCount: number;
  price: number;
  currency: string;
  amenities: string[];
  description: string;
  coordinates: Coordinates;
}

// Service feature interface
export interface ServiceFeature {
  id: string;
  title: string;
  description: string;
  icon: string;
  benefits: string[];
}

// Enhanced testimonial interface
export interface Testimonial {
  id: string;
  text: string;
  author: string;
  role: string;
  company?: string;
  avatar: string;
  rating: number;
  location: string;
  date: string;
}

// Article/Blog post interface
export interface Article {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  href: string;
  publishedAt: string;
  readTime: number;
  author: string;
}

// ============================================================================
// NAVIGATION & UI TYPES
// ============================================================================

// Navigation structure
export interface NavigationItem {
  label: string;
  href: string;
  icon?: string;
  children?: NavigationItem[];
  external?: boolean;
}

// Service types
export type ServiceType = 'flights' | 'hotels' | 'car' | 'car-hire' | 'insurance' | 'visa' | 'visa-application' | 'travel-insurance';

// Button variants
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'small' | 'medium' | 'large';

// Card variants
export type CardVariant = 'default' | 'hover' | 'destination' | 'hotel' | 'feature' | 'testimonial';

// ============================================================================
// FORM & SEARCH TYPES
// ============================================================================

// Passenger data for flight bookings
export interface PassengerData {
  // Basic information
  firstName: string;
  middle?: string;
  lastName: string;
  title?: string;
  suffix?: string;
  dateOfBirth: string;
  
  // Contact information
  email: string;
  phone: string;
  countryCode?: string;
  dialCode?: string;
  
  // Travel security
  redressNumber?: string;
  knownTravellerNumber?: string;
  
  // Emergency contact
  emergencyFirstName?: string;
  emergencyLastName?: string;
  emergencyEmail?: string;
  emergencyPhone?: string;
  sameAsPassenger?: boolean;
  
  // Form state
  agreeToTerms?: boolean;
}

// Enhanced search form data
export interface SearchFormData {
  // Flight search
  from?: string;
  to?: string;
  departure?: string;
  return?: string;
  dates?: string; // Combined dates field for flights
  passengers?: string | { adults: number; children: number; infants: number };
  tripType?: 'oneWay' | 'roundTrip' | 'multiCity';
  flightType?: string;
  
  // Hotel search
  destination?: string;
  hotelName?: string;
  checkin?: string;
  checkout?: string;
  guests?: string;
  rooms?: string;
  
  // Car rental
  location?: string;
  pickup?: string;
  dropoff?: string;
  pickupTime?: string;
  dropoffTime?: string;
  drivers?: string;
  
  // Travel insurance
  travelers?: string;
  
  // Visa application
  nationality?: string;
  destinationCountry?: string;
  applicants?: string;
  visaType?: string;
  travelPurpose?: string;
}

// Form field types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'date' | 'select' | 'textarea' | 'autocomplete' | 'passenger-selector' | 'room-selector';
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  autocompleteType?: 'airport' | 'location' | 'country';
  defaultValue?: string;
  validation?: {
    pattern?: string;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
  };
}

// Newsletter subscription
export interface NewsletterSubscription {
  email: string;
  preferences?: {
    deals: boolean;
    destinations: boolean;
    tips: boolean;
  };
}

// ============================================================================
// COMPONENT PROP TYPES
// ============================================================================

// Button component props
export interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

// Card component props
export interface CardProps {
  variant?: CardVariant;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

// Destination card props
export interface DestinationCardProps {
  destination: Destination;
  className?: string;
  showPrice?: boolean;
  showDuration?: boolean;
  onClick?: (destination: Destination) => void;
}

// Hotel card props
export interface HotelCardProps {
  hotel: Hotel;
  className?: string;
  showRating?: boolean;
  showAmenities?: boolean;
  onClick?: (hotel: Hotel) => void;
}

// Feature card props
export interface FeatureCardProps {
  feature: ServiceFeature;
  className?: string;
  showBenefits?: boolean;
  onClick?: (feature: ServiceFeature) => void;
}

// Testimonial card props
export interface TestimonialCardProps {
  testimonial: Testimonial;
  className?: string;
  showRating?: boolean;
  showDate?: boolean;
}

// ============================================================================
// LAYOUT & SECTION TYPES
// ============================================================================

// Site layout props
export interface SiteLayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
  className?: string;
  // SEO and meta tag props
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
  structuredData?: object;
  // Page-specific props
  pageType?: 'website' | 'article' | 'product' | 'service';
  breadcrumbs?: Array<{ name: string; href: string }>;
}

// Section props
export interface SectionProps {
  title?: string;
  subtitle?: string;
  className?: string;
  children: React.ReactNode;
}

// Hero section props
export interface HeroSectionProps {
  title: string;
  subtitle: string;
  backgroundImage?: string;
  showSearchTabs?: boolean;
  className?: string;
}

// ============================================================================
// API & DATA TYPES
// ============================================================================

// API response wrapper
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
}

// Pagination
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Search filters
export interface SearchFilters {
  priceRange?: {
    min: number;
    max: number;
  };
  rating?: number;
  amenities?: string[];
  location?: string;
  sortBy?: 'price' | 'rating' | 'popularity' | 'distance';
  sortOrder?: 'asc' | 'desc';
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

// Loading states
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

// Theme types
export type Theme = 'light' | 'dark';

// Breakpoint types
export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';

// Animation types
export type AnimationType = 'fade-in' | 'slide-up' | 'slide-in-left' | 'slide-in-right' | 'bounce-gentle' | 'pulse-soft';

// ============================================================================
// TRAVEL SERVICES TYPES
// ============================================================================

// Re-export hotel types
export * from './hotels';

// Re-export car hire types
export * from './car-hire';

// Re-export visa application types
export * from './visa-application';

// Re-export travel insurance types
export * from './travel-insurance';

// ============================================================================
// LEGACY TYPES (for backward compatibility)
// ============================================================================

// Legacy package destination (deprecated - use Destination instead)
export interface PackageDestination {
  id: string;
  name: string;
  country: string;
  duration: string;
  price: string;
  image: string;
  location: string;
}

// Legacy service card (deprecated - use ServiceFeature instead)
export interface ServiceCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  href: string;
  buttonText: string;
}