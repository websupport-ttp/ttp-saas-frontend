/**
 * Package Service
 * Handles travel package browsing, purchase, and payment verification
 */

import { apiClient } from '../api-client';
import {
  PackageFilters,
  PackageListResponse,
  PackageDetails,
  PackagePurchaseData,
  BookingResponse,
  PaymentVerificationResponse
} from '@/types/api';

export class PackageService {
  /**
   * Get list of available packages with filtering
   */
  async getPackages(filters: PackageFilters = {}): Promise<PackageListResponse> {
    try {
      // Build query parameters from filters
      const queryParams = new URLSearchParams();
      
      if (filters.destination) {
        queryParams.append('destination', filters.destination);
      }
      if (filters.category) {
        queryParams.append('category', filters.category);
      }
      if (filters.duration?.min) {
        queryParams.append('minDuration', filters.duration.min.toString());
      }
      if (filters.duration?.max) {
        queryParams.append('maxDuration', filters.duration.max.toString());
      }
      if (filters.price?.min) {
        queryParams.append('minPrice', filters.price.min.toString());
      }
      if (filters.price?.max) {
        queryParams.append('maxPrice', filters.price.max.toString());
      }
      if (filters.page) {
        queryParams.append('page', filters.page.toString());
      }
      if (filters.limit) {
        queryParams.append('limit', filters.limit.toString());
      }

      const queryString = queryParams.toString();
      const endpoint = queryString 
        ? `/products/packages?${queryString}` 
        : '/products/packages';

      const response = await apiClient.get<PackageListResponse>(
        endpoint,
        { requiresAuth: false }
      );

      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch packages');
      }

      return response.data;
    } catch (error) {
      console.error('Package listing error:', error);
      throw error;
    }
  }

  /**
   * Get detailed information about a specific package
   */
  async getPackageDetails(packageId: string): Promise<PackageDetails> {
    try {
      const response = await apiClient.get<PackageDetails>(
        `/products/packages/${packageId}`,
        { requiresAuth: false }
      );

      if (!response.success) {
        throw new Error(response.message || 'Failed to get package details');
      }

      return response.data;
    } catch (error) {
      console.error('Package details error:', error);
      throw error;
    }
  }

  /**
   * Purchase a travel package
   */
  async purchasePackage(purchaseData: PackagePurchaseData): Promise<BookingResponse> {
    try {
      const response = await apiClient.post<BookingResponse>(
        `/products/packages/${purchaseData.packageId}/purchase`,
        purchaseData,
        { requiresAuth: true }
      );

      if (!response.success) {
        throw new Error(response.message || 'Failed to purchase package');
      }

      return response.data;
    } catch (error) {
      console.error('Package purchase error:', error);
      throw error;
    }
  }

  /**
   * Verify package payment
   */
  async verifyPayment(reference: string): Promise<PaymentVerificationResponse> {
    try {
      const response = await apiClient.post<PaymentVerificationResponse>(
        '/products/packages/verify-payment',
        { reference },
        { requiresAuth: true }
      );

      if (!response.success) {
        throw new Error(response.message || 'Failed to verify payment');
      }

      return response.data;
    } catch (error) {
      console.error('Package payment verification error:', error);
      throw error;
    }
  }

  /**
   * Get booking status by reference
   */
  async getBookingStatus(bookingReference: string): Promise<any> {
    try {
      const response = await apiClient.get<any>(
        `/products/packages/booking/${bookingReference}/status`,
        { requiresAuth: true }
      );

      if (!response.success) {
        throw new Error(response.message || 'Failed to get booking status');
      }

      return response.data;
    } catch (error) {
      console.error('Package booking status error:', error);
      throw error;
    }
  }

  /**
   * Get user's package bookings
   */
  async getUserBookings(): Promise<any[]> {
    try {
      const response = await apiClient.get<any[]>(
        '/products/packages/bookings',
        { requiresAuth: true }
      );

      if (!response.success) {
        throw new Error(response.message || 'Failed to get package bookings');
      }

      return response.data;
    } catch (error) {
      console.error('Get package bookings error:', error);
      throw error;
    }
  }

  /**
   * Get package availability for specific dates
   */
  async getPackageAvailability(
    packageId: string, 
    startDate: string, 
    endDate: string
  ): Promise<any[]> {
    try {
      const response = await apiClient.get<any[]>(
        `/products/packages/${packageId}/availability?startDate=${startDate}&endDate=${endDate}`,
        { requiresAuth: false }
      );

      if (!response.success) {
        throw new Error(response.message || 'Failed to get package availability');
      }

      return response.data;
    } catch (error) {
      console.error('Package availability error:', error);
      throw error;
    }
  }

  /**
   * Get package categories for filtering
   */
  async getPackageCategories(): Promise<string[]> {
    try {
      const response = await apiClient.get<string[]>(
        '/products/packages/categories',
        { requiresAuth: false }
      );

      if (!response.success) {
        throw new Error(response.message || 'Failed to get package categories');
      }

      return response.data;
    } catch (error) {
      console.error('Package categories error:', error);
      throw error;
    }
  }

  /**
   * Get popular destinations for packages
   */
  async getPopularDestinations(): Promise<string[]> {
    try {
      const response = await apiClient.get<string[]>(
        '/products/packages/destinations',
        { requiresAuth: false }
      );

      if (!response.success) {
        throw new Error(response.message || 'Failed to get popular destinations');
      }

      return response.data;
    } catch (error) {
      console.error('Popular destinations error:', error);
      throw error;
    }
  }

  /**
   * Cancel package booking
   */
  async cancelBooking(bookingReference: string, reason?: string): Promise<any> {
    try {
      const response = await apiClient.post<any>(
        `/products/packages/booking/${bookingReference}/cancel`,
        { reason },
        { requiresAuth: true }
      );

      if (!response.success) {
        throw new Error(response.message || 'Failed to cancel package booking');
      }

      return response.data;
    } catch (error) {
      console.error('Package booking cancellation error:', error);
      throw error;
    }
  }

  /**
   * Submit package review
   */
  async submitReview(
    bookingReference: string, 
    rating: number, 
    comment: string
  ): Promise<any> {
    try {
      const response = await apiClient.post<any>(
        `/products/packages/booking/${bookingReference}/review`,
        {
          rating,
          comment
        },
        { requiresAuth: true }
      );

      if (!response.success) {
        throw new Error(response.message || 'Failed to submit package review');
      }

      return response.data;
    } catch (error) {
      console.error('Submit package review error:', error);
      throw error;
    }
  }

  /**
   * Get package reviews
   */
  async getPackageReviews(packageId: string, page: number = 1, limit: number = 10): Promise<any> {
    try {
      const response = await apiClient.get<any>(
        `/products/packages/${packageId}/reviews?page=${page}&limit=${limit}`,
        { requiresAuth: false }
      );

      if (!response.success) {
        throw new Error(response.message || 'Failed to get package reviews');
      }

      return response.data;
    } catch (error) {
      console.error('Get package reviews error:', error);
      throw error;
    }
  }

  /**
   * Search packages by keyword
   */
  async searchPackages(query: string, filters: PackageFilters = {}): Promise<PackageListResponse> {
    try {
      const searchFilters = {
        ...filters,
        search: query
      };

      const queryParams = new URLSearchParams();
      queryParams.append('search', query);
      
      if (filters.destination) {
        queryParams.append('destination', filters.destination);
      }
      if (filters.category) {
        queryParams.append('category', filters.category);
      }
      if (filters.duration?.min) {
        queryParams.append('minDuration', filters.duration.min.toString());
      }
      if (filters.duration?.max) {
        queryParams.append('maxDuration', filters.duration.max.toString());
      }
      if (filters.price?.min) {
        queryParams.append('minPrice', filters.price.min.toString());
      }
      if (filters.price?.max) {
        queryParams.append('maxPrice', filters.price.max.toString());
      }
      if (filters.page) {
        queryParams.append('page', filters.page.toString());
      }
      if (filters.limit) {
        queryParams.append('limit', filters.limit.toString());
      }

      const response = await apiClient.get<PackageListResponse>(
        `/products/packages/search?${queryParams.toString()}`,
        { requiresAuth: false }
      );

      if (!response.success) {
        throw new Error(response.message || 'Failed to search packages');
      }

      return response.data;
    } catch (error) {
      console.error('Package search error:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const packageService = new PackageService();