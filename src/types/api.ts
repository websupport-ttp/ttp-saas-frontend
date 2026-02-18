/**
 * API Types and Interfaces
 * Defines TypeScript interfaces for API requests and responses
 */

// Base API Response Structure (Frontend)
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  errors?: ValidationError[];
  meta?: ResponseMeta;
}

// Backend API Response Structure (what the backend actually returns)
export interface BackendApiResponse<T = any> {
  status: 'success' | 'error' | 'fail';
  message: string;
  data: T;
  timestamp: string;
  requestId?: string;
  meta?: any;
  errors?: ValidationError[];
}

export interface ResponseMeta {
  pagination?: PaginationInfo;
  timestamp: string;
  requestId: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

// Error Types
export enum ErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  PAYMENT_ERROR = 'PAYMENT_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  RATE_LIMIT = 'RATE_LIMIT',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR'
}

export interface AppError {
  type: ErrorType;
  message: string;
  details?: any;
  code?: string;
  statusCode?: number;
}

// Request Configuration
export interface RequestConfig {
  headers?: Record<string, string>;
  timeout?: number;
  retries?: number;
  requiresAuth?: boolean;
  skipInterceptors?: boolean;
}

// Extended Axios Config for internal use
declare module 'axios' {
  interface AxiosRequestConfig {
    metadata?: {
      startTime: number;
    };
    _retry?: boolean;
    _retryCount?: number;
  }
}

// Authentication Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role: UserRole;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  AGENT = 'agent'
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresAt: string;
}

// Flight Types
export interface FlightSearchCriteria {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  passengers: {
    adults: number;
    children: number;
    infants: number;
  };
  cabinClass: 'economy' | 'premium_economy' | 'business' | 'first';
  tripType: 'one_way' | 'round_trip' | 'multi_city';
}

export interface FlightOffer {
  id: string;
  price: {
    total: string;
    currency: string;
    base: string;
    taxes: string;
  };
  itineraries: FlightItinerary[];
  validatingAirlineCodes: string[];
  travelerPricings: TravelerPricing[];
}

export interface FlightItinerary {
  duration: string;
  segments: FlightSegment[];
}

export interface FlightSegment {
  departure: {
    iataCode: string;
    terminal?: string;
    at: string;
  };
  arrival: {
    iataCode: string;
    terminal?: string;
    at: string;
  };
  carrierCode: string;
  number: string;
  aircraft: {
    code: string;
  };
  duration: string;
  id: string;
  numberOfStops: number;
  blacklistedInEU: boolean;
}

export interface TravelerPricing {
  travelerId: string;
  fareOption: string;
  travelerType: string;
  price: {
    currency: string;
    total: string;
    base: string;
  };
  fareDetailsBySegment: FareDetails[];
}

export interface FareDetails {
  segmentId: string;
  cabin: string;
  fareBasis: string;
  class: string;
  includedCheckedBags: {
    quantity: number;
  };
}

export interface PassengerInfo {
  id: string;
  dateOfBirth: string;
  name: {
    firstName: string;
    lastName: string;
  };
  gender: 'MALE' | 'FEMALE';
  contact: {
    emailAddress: string;
    phones: {
      deviceType: string;
      countryCallingCode: string;
      number: string;
    }[];
  };
  documents: {
    documentType: string;
    birthPlace?: string;
    issuanceLocation?: string;
    issuanceDate?: string;
    number: string;
    expiryDate: string;
    issuanceCountry: string;
    validityCountry: string;
    nationality: string;
    holder: boolean;
  }[];
}

export interface FlightBookingData {
  flightDetails: FlightOffer;
  passengerDetails: PassengerInfo[];
  paymentDetails?: PaymentInfo;
  referralCode?: string;
  isGuestBooking?: boolean;
  guestContactInfo?: {
    email: string;
    phone: string;
    countryCode: string;
    dialCode: string;
  };
}

export interface FlightSearchResponse {
  data: FlightOffer[];
  meta: {
    count: number;
    links?: {
      self: string;
    };
  };
  dictionaries: {
    locations: Record<string, LocationInfo>;
    aircraft: Record<string, AircraftInfo>;
    currencies: Record<string, string>;
    carriers: Record<string, string>;
  };
}

export interface LocationInfo {
  cityCode: string;
  countryCode: string;
}

export interface AircraftInfo {
  code: string;
  name: string;
}

// Visa Types
export interface VisaApplicationData {
  destinationCountry: string;
  visaType: string;
  urgency: string;
  personalInfo: PersonalInfo;
  travelInfo: TravelInfo;
  documents: DocumentInfo[];
}

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  placeOfBirth: string;
  nationality: string;
  passportNumber: string;
  passportExpiryDate: string;
  email: string;
  phoneNumber: string;
  address: AddressInfo;
}

export interface AddressInfo {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface TravelInfo {
  purposeOfVisit: string;
  intendedDateOfEntry: string;
  intendedDateOfExit: string;
  accommodationDetails: string;
  previousVisits: boolean;
  previousVisitDetails?: string;
}

export interface DocumentInfo {
  type: string;
  name: string;
  file: File;
  required: boolean;
}

export interface VisaRequirements {
  country: string;
  visaType: string;
  processingTime: string;
  validityPeriod: string;
  requiredDocuments: RequiredDocument[];
  fees: VisaFees;
}

export interface RequiredDocument {
  name: string;
  description: string;
  required: boolean;
  format: string[];
  maxSize: string;
}

export interface VisaFees {
  baseFee: number;
  urgencyFee?: number;
  serviceFee: number;
  total: number;
  currency: string;
}

export interface ApplicationStatus {
  id: string;
  status: 'pending' | 'processing' | 'approved' | 'rejected' | 'ready_for_collection';
  statusMessage: string;
  lastUpdated: string;
  estimatedCompletion?: string;
  trackingNumber: string;
}

// Insurance Types
export interface InsuranceQuoteData {
  tripType: 'single' | 'annual' | 'family';
  destination: string;
  departureDate: string;
  returnDate: string;
  travelers: TravelerInfo[];
  coverageType: 'basic' | 'comprehensive' | 'premium';
}

export interface TravelerInfo {
  age: number;
  preExistingConditions: boolean;
}

export interface InsuranceQuote {
  quoteId: string;
  plans: InsurancePlan[];
  validUntil: string;
}

export interface InsurancePlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  coverage: CoverageDetails;
  benefits: string[];
  exclusions: string[];
}

export interface CoverageDetails {
  medicalExpenses: number;
  tripCancellation: number;
  baggage: number;
  personalAccident: number;
  emergencyEvacuation: number;
}

export interface PolicyPurchaseData {
  quoteId: string;
  planId: string;
  customerDetails: CustomerDetails;
  emergencyContact: EmergencyContact;
}

export interface CustomerDetails {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  address: AddressInfo;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phoneNumber: string;
}

// Hotel Types
export interface HotelSearchCriteria {
  destination: string;
  checkInDate: string;
  checkOutDate: string;
  rooms: RoomRequirement[];
  currency?: string;
}

export interface RoomRequirement {
  adults: number;
  children: number;
  childrenAges?: number[];
}

export interface HotelSearchResponse {
  hotels: HotelOffer[];
  totalResults: number;
}

export interface HotelOffer {
  id: string;
  name: string;
  rating: number;
  location: {
    address: string;
    city: string;
    country: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  amenities: string[];
  images: string[];
  rooms: RoomOffer[];
  cancellationPolicy: string;
}

export interface RoomOffer {
  id: string;
  name: string;
  description: string;
  price: {
    total: number;
    currency: string;
    breakdown: PriceBreakdown[];
  };
  bedType: string;
  maxOccupancy: number;
  amenities: string[];
  cancellable: boolean;
}

export interface PriceBreakdown {
  date: string;
  rate: number;
}

export interface HotelBookingData {
  hotelId: string;
  roomId: string;
  checkInDate: string;
  checkOutDate: string;
  guests: GuestInfo[];
  specialRequests?: string;
}

export interface GuestInfo {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

// Package Types
export interface PackageFilters {
  destination?: string;
  category?: string;
  duration?: {
    min: number;
    max: number;
  };
  price?: {
    min: number;
    max: number;
  };
  page?: number;
  limit?: number;
}

export interface PackageListResponse {
  packages: PackageSummary[];
  totalResults: number;
  filters: AvailableFilters;
}

export interface PackageSummary {
  id: string;
  title: string;
  destination: string;
  duration: number;
  price: {
    from: number;
    currency: string;
  };
  rating: number;
  reviewCount: number;
  images: string[];
  highlights: string[];
  category: string;
}

export interface AvailableFilters {
  destinations: string[];
  categories: string[];
  priceRange: {
    min: number;
    max: number;
  };
  durationRange: {
    min: number;
    max: number;
  };
}

export interface PackageDetails {
  id: string;
  title: string;
  description: string;
  destination: string;
  duration: number;
  price: {
    adult: number;
    child: number;
    currency: string;
  };
  inclusions: string[];
  exclusions: string[];
  itinerary: ItineraryDay[];
  images: string[];
  rating: number;
  reviews: Review[];
  availability: AvailabilityInfo[];
}

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  activities: string[];
  meals: string[];
  accommodation?: string;
}

export interface Review {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface AvailabilityInfo {
  date: string;
  available: boolean;
  price: number;
}

export interface PackagePurchaseData {
  packageId: string;
  selectedDate: string;
  participants: ParticipantInfo[];
  specialRequests?: string;
}

export interface ParticipantInfo {
  type: 'adult' | 'child';
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  passportNumber?: string;
  dietaryRequirements?: string;
}

// Payment Types
export interface PaymentInfo {
  method?: 'card' | 'bank_transfer' | 'paystack';
  currency: string;
  amount?: number;
  callback_url?: string;
}

export interface BookingResponse {
  bookingReference: string;
  authorizationUrl: string;
  paymentReference: string;
  amount: number;
  currency: string;
  expiresAt: string;
}

export interface PaymentVerificationResponse {
  status: 'success' | 'failed' | 'pending';
  reference: string;
  amount: number;
  currency: string;
  paidAt?: string;
  channel?: string;
  fees?: number;
  authorization?: {
    authorizationCode: string;
    bin: string;
    last4: string;
    expMonth: string;
    expYear: string;
    channel: string;
    cardType: string;
    bank: string;
    countryCode: string;
    brand: string;
  };
}

// Booking Types
export interface Booking {
  id: string;
  type: 'flight' | 'hotel' | 'visa' | 'insurance' | 'package';
  reference: string;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
  details: any; // Specific to booking type
  payment: PaymentStatus;
}

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

export interface PaymentStatus {
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  amount: number;
  currency: string;
  reference: string;
  paidAt?: string;
}

// File Upload Types
export interface UploadResponse {
  success: boolean;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  uploadedAt: string;
}

// Lookup Data Types
export interface LookupData {
  countries: Country[];
  currencies: Currency[];
  airports: Airport[];
  airlines: Airline[];
}

export interface Country {
  code: string;
  name: string;
  currency: string;
  flag: string;
}

export interface Currency {
  code: string;
  name: string;
  symbol: string;
}

export interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
}

export interface Airline {
  code: string;
  name: string;
  logo: string;
}