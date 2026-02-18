/**
 * Car Hire Service
 * Handles car rental bookings and payment verification
 */

import { apiClient } from '../api-client';
import {
  BookingResponse,
  PaymentVerificationResponse
} from '@/types/api';

export interface CarBookingData {
  carId: string;
  pickupLocation: string;
  returnLocation: string;
  pickupDate: string;
  returnDate: string;
  driverInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    dateOfBirth: string;
    licenseNumber: string;
    licenseCountry: string;
    licenseExpiryDate: string;
  };
  emergencyContact: {
    name: string;
    relationship: string;
    phoneNumber: string;
  };
  extras: string[];
  specialRequests?: string;
}

export class CarHireService {
  /**
   * Book a car rental (public - no authentication required)
   */
  async bookCar(bookingData: CarBookingData): Promise<BookingResponse> {
    try {
      const response = await apiClient.post<BookingResponse>(
        '/car-hire/book',
        bookingData,
        { requiresAuth: false } // Allow guest bookings
      );

      if (!response.success) {
        throw new Error(response.message || 'Failed to book car rental');
      }

      return response.data;
    } catch (error) {
      console.error('Car booking error:', error);
      throw error;
    }
  }

  /**
   * Verify car rental payment
   */
  async verifyPayment(reference: string): Promise<PaymentVerificationResponse> {
    try {
      const response = await apiClient.post<PaymentVerificationResponse>(
        '/car-hire/verify-payment',
        { reference },
        { requiresAuth: true }
      );

      if (!response.success) {
        throw new Error(response.message || 'Failed to verify payment');
      }

      return response.data;
    } catch (error) {
      console.error('Car rental payment verification error:', error);
      throw error;
    }
  }

  /**
   * Get booking status by reference
   */
  async getBookingStatus(bookingReference: string): Promise<any> {
    try {
      const response = await apiClient.get<any>(
        `/car-hire/booking/${bookingReference}/status`,
        { requiresAuth: true }
      );

      if (!response.success) {
        throw new Error(response.message || 'Failed to get booking status');
      }

      return response.data;
    } catch (error) {
      console.error('Car booking status error:', error);
      throw error;
    }
  }

  /**
   * Get user's car rental bookings
   */
  async getUserBookings(): Promise<any[]> {
    try {
      const response = await apiClient.get<any[]>(
        '/car-hire/my-bookings',
        { requiresAuth: true }
      );

      if (!response.success) {
        throw new Error(response.message || 'Failed to get car bookings');
      }

      return response.data;
    } catch (error) {
      console.error('Get car bookings error:', error);
      throw error;
    }
  }

  /**
   * Cancel car rental booking
   */
  async cancelBooking(bookingReference: string, reason?: string): Promise<any> {
    try {
      const response = await apiClient.post<any>(
        `/car-hire/booking/${bookingReference}/cancel`,
        { reason },
        { requiresAuth: true }
      );

      if (!response.success) {
        throw new Error(response.message || 'Failed to cancel car booking');
      }

      return response.data;
    } catch (error) {
      console.error('Car booking cancellation error:', error);
      throw error;
    }
  }

  /**
   * Get available cars for specific dates and location
   */
  async searchCars(
    pickupLocation: string,
    returnLocation: string,
    pickupDate: string,
    returnDate: string
  ): Promise<any[]> {
    try {
      const response = await apiClient.post<any[]>(
        '/car-hire/search',
        {
          pickupLocation,
          returnLocation,
          pickupDate,
          returnDate
        },
        { requiresAuth: false }
      );

      if (!response.success) {
        throw new Error(response.message || 'Failed to search cars');
      }

      return response.data;
    } catch (error) {
      console.error('Car search error:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const carHireService = new CarHireService();