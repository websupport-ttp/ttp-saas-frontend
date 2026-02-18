/**
 * Hotel Service
 * Handles hotel search, booking, and payment verification
 */

import { apiClient } from '../api-client';
import {
  HotelSearchCriteria,
  HotelSearchResponse,
  HotelBookingData,
  BookingResponse,
  PaymentVerificationResponse
} from '@/types/api';

export class HotelService {
  /**
   * Search for hotels based on criteria
   */
  async searchHotels(criteria: HotelSearchCriteria): Promise<HotelSearchResponse> {
    try {
      // For now, return dummy data since Ratehawk account is not activated
      // This will be replaced with actual API call once the account is ready
      
      // Generate dummy hotels based on destination
      const dummyHotels = this.generateDummyHotels(criteria.destination, criteria.checkInDate, criteria.checkOutDate);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        hotels: dummyHotels,
        totalResults: dummyHotels.length
      };

      /* TODO: Uncomment this when Ratehawk account is activated
      // Parse destination to extract city and country
      // Format: "City" or "City, Country" or "Airport Name (CODE)"
      let city = criteria.destination;
      let countryCode = 'GB'; // Default to UK
      
      // Remove airport code if present (e.g., "London Heathrow Airport (LHR)" -> "London")
      city = city.replace(/\s*\([A-Z]{3}\)\s*$/, '').trim();
      
      // Extract city and country if comma-separated
      const parts = city.split(',').map(p => p.trim());
      if (parts.length > 1) {
        city = parts[0];
        // Map country name to ISO code
        countryCode = this.getCountryCode(parts[1]);
      } else {
        // If no country specified, extract from common airport names
        if (city.includes('Airport')) {
          city = city.replace(/\s*(International\s+)?Airport.*$/i, '').trim();
        }
      }

      // Collect children ages from all rooms
      const childrenAges: number[] = [];
      criteria.rooms.forEach(room => {
        if (room.children && room.children > 0) {
          // Default age for children if not specified
          for (let i = 0; i < room.children; i++) {
            childrenAges.push(10); // Default age
          }
        }
      });

      // Transform frontend criteria to backend format
      // Backend expects: destination, checkInDate, checkOutDate, adults, children (number), currency
      const backendCriteria = {
        destination: city, // Backend uses "destination" not "city"
        checkInDate: criteria.checkInDate,
        checkOutDate: criteria.checkOutDate,
        adults: criteria.rooms.reduce((sum, room) => sum + room.adults, 0),
        children: childrenAges.length, // Backend expects count, not array
        currency: criteria.currency || 'NGN'
      };

      console.log('🏨 Sending hotel search request:', backendCriteria);

      const response = await apiClient.post<HotelSearchResponse>(
        '/products/hotels/search',
        backendCriteria,
        { requiresAuth: false }
      );

      // Backend returns hotel data
      console.log('✅ Hotel search response:', response);

      return response.data;
      */
    } catch (error) {
      console.error('Hotel search error:', error);
      throw error;
    }
  }

  /**
   * Generate dummy hotel data for testing (temporary until Ratehawk is activated)
   */
  private generateDummyHotels(destination: string, checkInDate: string, checkOutDate: string): any[] {
    const hotelTemplates = [
      {
        name: 'Grand Palace Hotel',
        rating: 4.8,
        amenities: ['Free WiFi', 'Pool', 'Spa', 'Restaurant', 'Gym', 'Concierge'],
        description: 'Luxury hotel in the heart of the city with world-class amenities'
      },
      {
        name: 'City Center Inn',
        rating: 4.2,
        amenities: ['Free WiFi', 'Restaurant', 'Bar', 'Room Service', 'Business Center'],
        description: 'Modern hotel with excellent location and business facilities'
      },
      {
        name: 'Boutique Suites',
        rating: 4.6,
        amenities: ['Free WiFi', 'Spa', 'Restaurant', 'Concierge', 'Rooftop Bar'],
        description: 'Elegant boutique hotel with personalized service and unique design'
      },
      {
        name: 'Executive Hotel',
        rating: 4.1,
        amenities: ['Free WiFi', 'Business Center', 'Meeting Rooms', 'Restaurant', 'Gym'],
        description: 'Perfect for business travelers with modern conference facilities'
      },
      {
        name: 'Luxury Resort & Spa',
        rating: 4.9,
        amenities: ['Free WiFi', 'Pool', 'Spa', 'Multiple Restaurants', 'Golf Course', 'Beach Access'],
        description: 'Premium resort with world-class amenities and exceptional service'
      },
      {
        name: 'Comfort Inn',
        rating: 3.8,
        amenities: ['Free WiFi', 'Restaurant', 'Parking', 'Breakfast'],
        description: 'Comfortable and affordable accommodation with essential amenities'
      },
      {
        name: 'Airport Plaza Hotel',
        rating: 4.0,
        amenities: ['Free WiFi', 'Airport Shuttle', 'Restaurant', 'Gym', '24/7 Front Desk'],
        description: 'Convenient hotel near the airport with complimentary shuttle service'
      },
      {
        name: 'Heritage Hotel',
        rating: 4.4,
        amenities: ['Free WiFi', 'Restaurant', 'Bar', 'Heritage Tours', 'Garden'],
        description: 'Charming historic hotel with character and cultural experiences'
      },
      {
        name: 'Waterfront Hotel',
        rating: 4.3,
        amenities: ['Free WiFi', 'Restaurant', 'Bar', 'Waterfront Views', 'Marina'],
        description: 'Beautiful hotel with stunning water views and marina access'
      },
      {
        name: 'Business Suites',
        rating: 4.0,
        amenities: ['Free WiFi', 'Business Center', 'Meeting Rooms', 'Kitchenette', 'Laundry'],
        description: 'Extended stay hotel perfect for business travelers and long visits'
      }
    ];

    // Generate base prices based on destination (in NGN)
    const basePrices: Record<string, number> = {
      'Lagos': 35000,
      'Abuja': 30000,
      'Port Harcourt': 25000,
      'Kano': 20000,
      'Ibadan': 22000,
      'London': 85000,
      'New York': 95000,
      'Dubai': 65000,
      'Paris': 75000,
      'Tokyo': 60000,
      'Sydney': 70000,
      'Cape Town': 40000,
      'Mumbai': 25000,
      'Bangkok': 20000,
      'Istanbul': 35000,
      'Cairo': 30000,
      'Nairobi': 25000,
      'Accra': 28000,
      'Johannesburg': 45000,
      'Casablanca': 32000
    };

    const basePrice = basePrices[destination] || 20000; // Default price in NGN

    return hotelTemplates.map((template, index) => {
      // Calculate price variation based on hotel type and rating
      const priceMultiplier = 0.7 + (template.rating / 5) * 0.8; // 0.7 to 1.5 range
      const randomVariation = 0.8 + Math.random() * 0.4; // 0.8 to 1.2 range
      const finalPrice = Math.round(basePrice * priceMultiplier * randomVariation);

      return {
        id: `dummy_hotel_${index + 1}`,
        name: `${template.name} ${destination}`,
        rating: template.rating,
        location: {
          city: destination,
          country: 'Nigeria', // Add country field
          address: `${Math.floor(Math.random() * 999) + 1} ${['Main Street', 'Central Avenue', 'Victoria Road', 'King Street', 'Queen Avenue'][index % 5]}, ${destination}`,
          coordinates: {
            latitude: -6.5244 + (Math.random() - 0.5) * 0.1, // Lagos area with variation
            longitude: 3.3792 + (Math.random() - 0.5) * 0.1
          }
        },
        images: [
          `https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`, // Hotel lobby
          `https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`, // Hotel room
          `https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`, // Hotel exterior
          `https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`, // Hotel pool
          `https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`  // Hotel restaurant
        ],
        amenities: template.amenities,
        description: template.description,
        rooms: [
          {
            id: `room_${index + 1}_1`,
            type: 'Standard Room',
            description: 'Comfortable room with modern amenities',
            maxOccupancy: 2,
            price: {
              total: finalPrice,
              base: Math.round(finalPrice * 0.85),
              taxes: Math.round(finalPrice * 0.15),
              currency: 'NGN'
            },
            amenities: ['Free WiFi', 'Air Conditioning', 'TV', 'Mini Bar'],
            bedType: 'Queen Bed',
            roomSize: '25 sqm',
            availability: {
              available: true,
              checkIn: checkInDate,
              checkOut: checkOutDate
            }
          }
        ],
        policies: {
          checkIn: '15:00',
          checkOut: '11:00',
          cancellation: 'Free cancellation up to 24 hours before check-in',
          pets: index % 3 === 0 ? 'Pets allowed' : 'No pets allowed',
          smoking: 'Non-smoking property'
        },
        contact: {
          phone: `+234-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
          email: `info@${template.name.toLowerCase().replace(/\s+/g, '')}.com`,
          website: `https://www.${template.name.toLowerCase().replace(/\s+/g, '')}.com`
        },
        reviews: {
          totalReviews: Math.floor(Math.random() * 500) + 50,
          averageRating: template.rating,
          categories: {
            cleanliness: template.rating + (Math.random() - 0.5) * 0.2,
            service: template.rating + (Math.random() - 0.5) * 0.2,
            location: template.rating + (Math.random() - 0.5) * 0.2,
            value: template.rating + (Math.random() - 0.5) * 0.2
          }
        }
      };
    });
  }

  /**
   * Map country name to ISO 2-letter code
   */
  private getCountryCode(countryName: string): string {
    const countryMap: Record<string, string> = {
      'United Kingdom': 'GB',
      'UK': 'GB',
      'England': 'GB',
      'United States': 'US',
      'USA': 'US',
      'Nigeria': 'NG',
      'France': 'FR',
      'Germany': 'DE',
      'Spain': 'ES',
      'Italy': 'IT',
      'Canada': 'CA',
      'Australia': 'AU',
      'Japan': 'JP',
      'China': 'CN',
      'India': 'IN',
      'Brazil': 'BR',
      'Mexico': 'MX',
      'South Africa': 'ZA',
      'Egypt': 'EG',
      'Kenya': 'KE',
      'Ghana': 'GH',
      'UAE': 'AE',
      'United Arab Emirates': 'AE',
      'Saudi Arabia': 'SA',
      'Turkey': 'TR',
      'Greece': 'GR',
      'Netherlands': 'NL',
      'Belgium': 'BE',
      'Switzerland': 'CH',
      'Austria': 'AT',
      'Portugal': 'PT',
      'Sweden': 'SE',
      'Norway': 'NO',
      'Denmark': 'DK',
      'Finland': 'FI',
      'Poland': 'PL',
      'Czech Republic': 'CZ',
      'Ireland': 'IE',
      'Scotland': 'GB',
      'Wales': 'GB'
    };

    return countryMap[countryName] || 'GB'; // Default to GB if not found
  }

  /**
   * Book a hotel
   */
  async bookHotel(bookingData: HotelBookingData): Promise<BookingResponse> {
    try {
      const response = await apiClient.post<BookingResponse>(
        '/products/hotels/book',
        bookingData,
        { requiresAuth: true }
      );

      if (!response.success) {
        throw new Error(response.message || 'Failed to book hotel');
      }

      return response.data;
    } catch (error) {
      console.error('Hotel booking error:', error);
      throw error;
    }
  }

  /**
   * Verify hotel payment
   */
  async verifyPayment(reference: string): Promise<PaymentVerificationResponse> {
    try {
      const response = await apiClient.post<PaymentVerificationResponse>(
        '/products/hotels/verify-payment',
        { reference },
        { requiresAuth: true }
      );

      if (!response.success) {
        throw new Error(response.message || 'Failed to verify payment');
      }

      return response.data;
    } catch (error) {
      console.error('Hotel payment verification error:', error);
      throw error;
    }
  }

  /**
   * Get booking status by reference
   */
  async getBookingStatus(bookingReference: string): Promise<any> {
    try {
      const response = await apiClient.get<any>(
        `/products/hotels/booking/${bookingReference}/status`,
        { requiresAuth: true }
      );

      if (!response.success) {
        throw new Error(response.message || 'Failed to get booking status');
      }

      return response.data;
    } catch (error) {
      console.error('Hotel booking status error:', error);
      throw error;
    }
  }

  /**
   * Get user's hotel bookings
   */
  async getUserBookings(): Promise<any[]> {
    try {
      const response = await apiClient.get<any[]>(
        '/products/hotels/bookings',
        { requiresAuth: true }
      );

      if (!response.success) {
        throw new Error(response.message || 'Failed to get hotel bookings');
      }

      return response.data;
    } catch (error) {
      console.error('Get hotel bookings error:', error);
      throw error;
    }
  }

  /**
   * Get hotel details by ID
   */
  async getHotelDetails(hotelId: string): Promise<any> {
    try {
      const response = await apiClient.get<any>(
        `/products/hotels/${hotelId}`,
        { requiresAuth: false }
      );

      if (!response.success) {
        throw new Error(response.message || 'Failed to get hotel details');
      }

      return response.data;
    } catch (error) {
      console.error('Get hotel details error:', error);
      throw error;
    }
  }

  /**
   * Cancel hotel booking
   */
  async cancelBooking(bookingReference: string, reason?: string): Promise<any> {
    try {
      const response = await apiClient.post<any>(
        `/products/hotels/booking/${bookingReference}/cancel`,
        { reason },
        { requiresAuth: true }
      );

      if (!response.success) {
        throw new Error(response.message || 'Failed to cancel hotel booking');
      }

      return response.data;
    } catch (error) {
      console.error('Hotel booking cancellation error:', error);
      throw error;
    }
  }

  /**
   * Get available room types for a hotel
   */
  async getAvailableRooms(
    hotelId: string, 
    checkInDate: string, 
    checkOutDate: string, 
    rooms: any[]
  ): Promise<any[]> {
    try {
      const response = await apiClient.post<any[]>(
        `/products/hotels/${hotelId}/rooms/availability`,
        {
          checkInDate,
          checkOutDate,
          rooms
        },
        { requiresAuth: false }
      );

      if (!response.success) {
        throw new Error(response.message || 'Failed to get available rooms');
      }

      return response.data;
    } catch (error) {
      console.error('Get available rooms error:', error);
      throw error;
    }
  }

  /**
   * Get hotel amenities and facilities
   */
  async getHotelAmenities(hotelId: string): Promise<any> {
    try {
      const response = await apiClient.get<any>(
        `/products/hotels/${hotelId}/amenities`,
        { requiresAuth: false }
      );

      if (!response.success) {
        throw new Error(response.message || 'Failed to get hotel amenities');
      }

      return response.data;
    } catch (error) {
      console.error('Get hotel amenities error:', error);
      throw error;
    }
  }

  /**
   * Get hotel reviews and ratings
   */
  async getHotelReviews(hotelId: string, page: number = 1, limit: number = 10): Promise<any> {
    try {
      const response = await apiClient.get<any>(
        `/products/hotels/${hotelId}/reviews?page=${page}&limit=${limit}`,
        { requiresAuth: false }
      );

      if (!response.success) {
        throw new Error(response.message || 'Failed to get hotel reviews');
      }

      return response.data;
    } catch (error) {
      console.error('Get hotel reviews error:', error);
      throw error;
    }
  }

  /**
   * Submit hotel review
   */
  async submitReview(
    bookingReference: string, 
    rating: number, 
    comment: string
  ): Promise<any> {
    try {
      const response = await apiClient.post<any>(
        `/products/hotels/booking/${bookingReference}/review`,
        {
          rating,
          comment
        },
        { requiresAuth: true }
      );

      if (!response.success) {
        throw new Error(response.message || 'Failed to submit hotel review');
      }

      return response.data;
    } catch (error) {
      console.error('Submit hotel review error:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const hotelService = new HotelService();