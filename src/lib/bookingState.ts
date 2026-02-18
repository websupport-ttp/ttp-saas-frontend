import { Hotel, Guest, SearchCriteria, PaymentDetails } from '@/types/hotels';
import { VisaApplication } from '@/types/visa-application';
import { CarRental, CarBooking } from '@/types/car-hire';
import { InsurancePolicy, TripDetails, InsuredTraveler } from '@/types/travel-insurance';

// Booking state interface
export interface BookingState {
  hotel: Hotel | null;
  searchCriteria: SearchCriteria | null;
  guests: Guest[];
  paymentDetails: PaymentDetails | null;
  step: 'search' | 'details' | 'guests' | 'payment' | 'success';
  createdAt: Date;
  updatedAt: Date;
}

// Car hire booking state
export interface CarHireBookingState {
  car: CarRental | null;
  searchCriteria: any | null; // Car search criteria
  driverInfo: any | null;
  emergencyContact: any | null;
  extras: any[];
  paymentDetails: PaymentDetails | null;
  step: 'search' | 'details' | 'contact' | 'payment' | 'success';
  createdAt: Date;
  updatedAt: Date;
}

// Visa application state
export interface VisaApplicationState {
  application: VisaApplication | null;
  step: 'start' | 'personal' | 'passport' | 'appointment' | 'review' | 'payment' | 'success';
  createdAt: Date;
  updatedAt: Date;
}

// Travel insurance state
export interface TravelInsuranceState {
  policy: InsurancePolicy | null;
  tripDetails: TripDetails | null;
  travelers: InsuredTraveler[];
  paymentDetails: PaymentDetails | null;
  step: 'plans' | 'details' | 'travelers' | 'review' | 'payment' | 'success';
  createdAt: Date;
  updatedAt: Date;
}

// Storage keys
const BOOKING_STATE_KEY = 'hotelBookingState';
const BOOKING_DATA_KEY = 'hotelBookingData';
const VISA_APPLICATION_KEY = 'visaApplicationState';
const CAR_HIRE_STATE_KEY = 'carHireBookingState';
const TRAVEL_INSURANCE_STATE_KEY = 'travelInsuranceState';

/**
 * Booking state manager for hotel booking flow
 */
export class BookingStateManager {
  /**
   * Save booking state to session storage
   */
  static saveBookingState(state: Partial<BookingState>): void {
    if (typeof window === 'undefined') return;

    try {
      const currentState = this.getBookingState();
      const updatedState: BookingState = {
        ...currentState,
        ...state,
        updatedAt: new Date(),
      };

      sessionStorage.setItem(BOOKING_STATE_KEY, JSON.stringify(updatedState, this.dateReplacer));
    } catch (error) {
      console.error('Error saving booking state:', error);
    }
  }

  /**
   * Get booking state from session storage
   */
  static getBookingState(): BookingState {
    if (typeof window === 'undefined') {
      return this.getDefaultState();
    }

    try {
      const stored = sessionStorage.getItem(BOOKING_STATE_KEY);
      if (!stored) {
        return this.getDefaultState();
      }

      const parsed = JSON.parse(stored, this.dateReviver);
      return {
        ...this.getDefaultState(),
        ...parsed,
      };
    } catch (error) {
      console.error('Error loading booking state:', error);
      return this.getDefaultState();
    }
  }

  /**
   * Clear booking state
   */
  static clearBookingState(): void {
    if (typeof window === 'undefined') return;

    try {
      sessionStorage.removeItem(BOOKING_STATE_KEY);
      sessionStorage.removeItem(BOOKING_DATA_KEY);
    } catch (error) {
      console.error('Error clearing booking state:', error);
    }
  }

  /**
   * Update hotel selection
   */
  static updateHotel(hotel: Hotel): void {
    this.saveBookingState({ 
      hotel, 
      step: 'details' 
    });
  }

  /**
   * Update search criteria
   */
  static updateSearchCriteria(criteria: SearchCriteria): void {
    this.saveBookingState({ 
      searchCriteria: criteria,
      step: 'search'
    });
  }

  /**
   * Update guest information
   */
  static updateGuests(guests: Guest[]): void {
    this.saveBookingState({ 
      guests, 
      step: 'guests' 
    });
  }

  /**
   * Update payment details
   */
  static updatePaymentDetails(paymentDetails: PaymentDetails): void {
    this.saveBookingState({ 
      paymentDetails, 
      step: 'payment' 
    });
  }

  /**
   * Mark booking as completed
   */
  static completeBooking(): void {
    this.saveBookingState({ 
      step: 'success' 
    });
  }

  /**
   * Check if booking has required data for a specific step
   */
  static hasRequiredDataForStep(step: string, serviceType: 'hotels' | 'car-hire' | 'visa-application' | 'travel-insurance' = 'hotels'): boolean {
    switch (serviceType) {
      case 'hotels':
        return this.hasRequiredHotelDataForStep(step);
      case 'car-hire':
        return this.hasRequiredCarHireDataForStep(step);
      case 'visa-application':
        return this.hasRequiredVisaDataForStep(step);
      case 'travel-insurance':
        return this.hasRequiredInsuranceDataForStep(step);
      default:
        return true;
    }
  }

  /**
   * Check if hotel booking has required data for a specific step
   */
  private static hasRequiredHotelDataForStep(step: string): boolean {
    const state = this.getBookingState();

    switch (step) {
      case 'details':
        return state.searchCriteria !== null;
      case 'guests':
        return state.hotel !== null && state.searchCriteria !== null;
      case 'payment':
        return state.hotel !== null && 
               state.searchCriteria !== null && 
               state.guests.length > 0;
      case 'success':
        return state.hotel !== null && 
               state.searchCriteria !== null && 
               state.guests.length > 0 && 
               state.paymentDetails !== null;
      default:
        return true;
    }
  }

  /**
   * Check if car hire booking has required data for a specific step
   */
  private static hasRequiredCarHireDataForStep(step: string): boolean {
    const state = this.getCarHireBookingState();

    switch (step) {
      case 'details':
        return state.searchCriteria !== null;
      case 'contact':
        return state.car !== null && state.searchCriteria !== null;
      case 'payment':
        return state.car !== null && 
               state.searchCriteria !== null && 
               state.driverInfo !== null;
      case 'success':
        return state.car !== null && 
               state.searchCriteria !== null && 
               state.driverInfo !== null && 
               state.paymentDetails !== null;
      default:
        return true;
    }
  }

  /**
   * Check if visa application has required data for a specific step
   */
  private static hasRequiredVisaDataForStep(step: string): boolean {
    const state = this.getVisaApplicationState();

    switch (step) {
      case 'personal':
        return state.application !== null;
      case 'passport':
        return state.application !== null && 
               state.application.travelers.length > 0;
      case 'appointment':
        return state.application !== null && 
               state.application.travelers.length > 0 &&
               state.application.travelers.every(t => t.passportInfo !== null);
      case 'review':
        return state.application !== null && 
               state.application.appointmentLocation !== null;
      case 'payment':
        return state.application !== null && 
               state.application.appointmentLocation !== null;
      case 'success':
        return state.application !== null && 
               state.application.status === 'submitted';
      default:
        return true;
    }
  }

  /**
   * Check if travel insurance has required data for a specific step
   */
  private static hasRequiredInsuranceDataForStep(step: string): boolean {
    const state = this.getTravelInsuranceState();

    switch (step) {
      case 'details':
        return state.policy !== null;
      case 'travelers':
        return state.policy !== null && state.tripDetails !== null;
      case 'review':
        return state.policy !== null && 
               state.tripDetails !== null && 
               state.travelers.length > 0;
      case 'payment':
        return state.policy !== null && 
               state.tripDetails !== null && 
               state.travelers.length > 0;
      case 'success':
        return state.policy !== null && 
               state.tripDetails !== null && 
               state.travelers.length > 0 && 
               state.paymentDetails !== null;
      default:
        return true;
    }
  }

  /**
   * Get booking progress percentage
   */
  static getBookingProgress(): number {
    const state = this.getBookingState();
    
    let progress = 0;
    if (state.searchCriteria) progress += 20;
    if (state.hotel) progress += 20;
    if (state.guests.length > 0) progress += 30;
    if (state.paymentDetails) progress += 20;
    if (state.step === 'success') progress += 10;

    return Math.min(progress, 100);
  }

  /**
   * Get default booking state
   */
  private static getDefaultState(): BookingState {
    const now = new Date();
    return {
      hotel: null,
      searchCriteria: null,
      guests: [],
      paymentDetails: null,
      step: 'search',
      createdAt: now,
      updatedAt: now,
    };
  }

  /**
   * JSON replacer for Date objects
   */
  private static dateReplacer(_key: string, value: any): any {
    if (value instanceof Date) {
      return { __type: 'Date', value: value.toISOString() };
    }
    return value;
  }

  /**
   * JSON reviver for Date objects
   */
  private static dateReviver(_key: string, value: any): any {
    if (value && typeof value === 'object' && value.__type === 'Date') {
      return new Date(value.value);
    }
    return value;
  }

  /**
   * Save visa application to session storage
   */
  static saveVisaApplication(application: VisaApplication): void {
    if (typeof window === 'undefined') return;

    try {
      sessionStorage.setItem(VISA_APPLICATION_KEY, JSON.stringify(application, this.dateReplacer));
    } catch (error) {
      console.error('Error saving visa application:', error);
    }
  }

  /**
   * Get visa application from session storage
   */
  static getVisaApplication(): VisaApplication | null {
    if (typeof window === 'undefined') return null;

    try {
      const stored = sessionStorage.getItem(VISA_APPLICATION_KEY);
      if (!stored) return null;

      return JSON.parse(stored, this.dateReviver);
    } catch (error) {
      console.error('Error loading visa application:', error);
      return null;
    }
  }

  /**
   * Clear visa application
   */
  static clearVisaApplication(): void {
    if (typeof window === 'undefined') return;

    try {
      sessionStorage.removeItem(VISA_APPLICATION_KEY);
    } catch (error) {
      console.error('Error clearing visa application:', error);
    }
  }

  // Car Hire State Management
  /**
   * Save car hire booking state to session storage
   */
  static saveCarHireBookingState(state: Partial<CarHireBookingState>): void {
    if (typeof window === 'undefined') return;

    try {
      const currentState = this.getCarHireBookingState();
      const updatedState: CarHireBookingState = {
        ...currentState,
        ...state,
        updatedAt: new Date(),
      };

      sessionStorage.setItem(CAR_HIRE_STATE_KEY, JSON.stringify(updatedState, this.dateReplacer));
    } catch (error) {
      console.error('Error saving car hire booking state:', error);
    }
  }

  /**
   * Get car hire booking state from session storage
   */
  static getCarHireBookingState(): CarHireBookingState {
    if (typeof window === 'undefined') {
      return this.getDefaultCarHireState();
    }

    try {
      const stored = sessionStorage.getItem(CAR_HIRE_STATE_KEY);
      if (!stored) {
        return this.getDefaultCarHireState();
      }

      const parsed = JSON.parse(stored, this.dateReviver);
      return {
        ...this.getDefaultCarHireState(),
        ...parsed,
      };
    } catch (error) {
      console.error('Error loading car hire booking state:', error);
      return this.getDefaultCarHireState();
    }
  }

  /**
   * Clear car hire booking state
   */
  static clearCarHireBookingState(): void {
    if (typeof window === 'undefined') return;

    try {
      sessionStorage.removeItem(CAR_HIRE_STATE_KEY);
    } catch (error) {
      console.error('Error clearing car hire booking state:', error);
    }
  }

  /**
   * Get default car hire state
   */
  private static getDefaultCarHireState(): CarHireBookingState {
    const now = new Date();
    return {
      car: null,
      searchCriteria: null,
      driverInfo: null,
      emergencyContact: null,
      extras: [],
      paymentDetails: null,
      step: 'search',
      createdAt: now,
      updatedAt: now,
    };
  }

  // Visa Application State Management
  /**
   * Save visa application state to session storage
   */
  static saveVisaApplicationState(state: Partial<VisaApplicationState>): void {
    if (typeof window === 'undefined') return;

    try {
      const currentState = this.getVisaApplicationState();
      const updatedState: VisaApplicationState = {
        ...currentState,
        ...state,
        updatedAt: new Date(),
      };

      sessionStorage.setItem(VISA_APPLICATION_KEY, JSON.stringify(updatedState, this.dateReplacer));
    } catch (error) {
      console.error('Error saving visa application state:', error);
    }
  }

  /**
   * Get visa application state from session storage
   */
  static getVisaApplicationState(): VisaApplicationState {
    if (typeof window === 'undefined') {
      return this.getDefaultVisaState();
    }

    try {
      const stored = sessionStorage.getItem(VISA_APPLICATION_KEY);
      if (!stored) {
        return this.getDefaultVisaState();
      }

      const parsed = JSON.parse(stored, this.dateReviver);
      return {
        ...this.getDefaultVisaState(),
        ...parsed,
      };
    } catch (error) {
      console.error('Error loading visa application state:', error);
      return this.getDefaultVisaState();
    }
  }

  /**
   * Clear visa application state
   */
  static clearVisaApplicationState(): void {
    if (typeof window === 'undefined') return;

    try {
      sessionStorage.removeItem(VISA_APPLICATION_KEY);
    } catch (error) {
      console.error('Error clearing visa application state:', error);
    }
  }

  /**
   * Get default visa application state
   */
  private static getDefaultVisaState(): VisaApplicationState {
    const now = new Date();
    return {
      application: null,
      step: 'start',
      createdAt: now,
      updatedAt: now,
    };
  }

  // Travel Insurance State Management
  /**
   * Save travel insurance state to session storage
   */
  static saveTravelInsuranceState(state: Partial<TravelInsuranceState>): void {
    if (typeof window === 'undefined') return;

    try {
      const currentState = this.getTravelInsuranceState();
      const updatedState: TravelInsuranceState = {
        ...currentState,
        ...state,
        updatedAt: new Date(),
      };

      sessionStorage.setItem(TRAVEL_INSURANCE_STATE_KEY, JSON.stringify(updatedState, this.dateReplacer));
    } catch (error) {
      console.error('Error saving travel insurance state:', error);
    }
  }

  /**
   * Get travel insurance state from session storage
   */
  static getTravelInsuranceState(): TravelInsuranceState {
    if (typeof window === 'undefined') {
      return this.getDefaultInsuranceState();
    }

    try {
      const stored = sessionStorage.getItem(TRAVEL_INSURANCE_STATE_KEY);
      if (!stored) {
        return this.getDefaultInsuranceState();
      }

      const parsed = JSON.parse(stored, this.dateReviver);
      return {
        ...this.getDefaultInsuranceState(),
        ...parsed,
      };
    } catch (error) {
      console.error('Error loading travel insurance state:', error);
      return this.getDefaultInsuranceState();
    }
  }

  /**
   * Clear travel insurance state
   */
  static clearTravelInsuranceState(): void {
    if (typeof window === 'undefined') return;

    try {
      sessionStorage.removeItem(TRAVEL_INSURANCE_STATE_KEY);
    } catch (error) {
      console.error('Error clearing travel insurance state:', error);
    }
  }

  /**
   * Get default travel insurance state
   */
  private static getDefaultInsuranceState(): TravelInsuranceState {
    const now = new Date();
    return {
      policy: null,
      tripDetails: null,
      travelers: [],
      paymentDetails: null,
      step: 'plans',
      createdAt: now,
      updatedAt: now,
    };
  }
}

/**
 * Hook for managing booking state across all travel services
 */
export function useBookingState() {
  // Hotel booking methods
  const getState = () => BookingStateManager.getBookingState();
  
  const updateHotel = (hotel: Hotel) => {
    BookingStateManager.updateHotel(hotel);
  };

  const updateSearchCriteria = (criteria: SearchCriteria) => {
    BookingStateManager.updateSearchCriteria(criteria);
  };

  const updateGuests = (guests: Guest[]) => {
    BookingStateManager.updateGuests(guests);
  };

  const updatePaymentDetails = (paymentDetails: PaymentDetails) => {
    BookingStateManager.updatePaymentDetails(paymentDetails);
  };

  const completeBooking = () => {
    BookingStateManager.completeBooking();
  };

  const clearState = () => {
    BookingStateManager.clearBookingState();
  };

  const hasRequiredDataForStep = (step: string, serviceType: 'hotels' | 'car-hire' | 'visa-application' | 'travel-insurance' = 'hotels') => {
    return BookingStateManager.hasRequiredDataForStep(step, serviceType);
  };

  const getProgress = () => {
    return BookingStateManager.getBookingProgress();
  };

  // Car hire booking methods
  const getCarHireState = () => BookingStateManager.getCarHireBookingState();
  
  const updateCarHireState = (state: Partial<CarHireBookingState>) => {
    BookingStateManager.saveCarHireBookingState(state);
  };

  const clearCarHireState = () => {
    BookingStateManager.clearCarHireBookingState();
  };

  // Visa application methods
  const getVisaApplication = () => {
    return BookingStateManager.getVisaApplication();
  };

  const updateVisaApplication = (application: VisaApplication) => {
    BookingStateManager.saveVisaApplication(application);
  };

  const clearVisaApplication = () => {
    BookingStateManager.clearVisaApplication();
  };

  const getVisaApplicationState = () => BookingStateManager.getVisaApplicationState();
  
  const updateVisaApplicationState = (state: Partial<VisaApplicationState>) => {
    BookingStateManager.saveVisaApplicationState(state);
  };

  const clearVisaApplicationState = () => {
    BookingStateManager.clearVisaApplicationState();
  };

  // Travel insurance methods
  const getTravelInsuranceState = () => BookingStateManager.getTravelInsuranceState();
  
  const updateTravelInsuranceState = (state: Partial<TravelInsuranceState>) => {
    BookingStateManager.saveTravelInsuranceState(state);
  };

  const clearTravelInsuranceState = () => {
    BookingStateManager.clearTravelInsuranceState();
  };

  return {
    // Hotel booking methods
    getState,
    updateHotel,
    updateSearchCriteria,
    updateGuests,
    updatePaymentDetails,
    completeBooking,
    clearState,
    hasRequiredDataForStep,
    getProgress,
    
    // Car hire methods
    getCarHireState,
    updateCarHireState,
    clearCarHireState,
    
    // Visa application methods (legacy)
    getVisaApplication,
    updateVisaApplication,
    clearVisaApplication,
    
    // Visa application state methods (new)
    getVisaApplicationState,
    updateVisaApplicationState,
    clearVisaApplicationState,
    
    // Travel insurance methods
    getTravelInsuranceState,
    updateTravelInsuranceState,
    clearTravelInsuranceState,
  };
}