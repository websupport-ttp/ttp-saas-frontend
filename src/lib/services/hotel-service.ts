/**
 * Hotel Service — ETG/RateHawk API integration
 * Implements the full 3-step flow:
 *   1. Search by region (/hotels/search)
 *   2. Retrieve hotelpage (/hotels/hotelpage) + Prebook (/hotels/prebook)
 *   3. Booking form (/hotels/booking-form) → Start booking (/hotels/start-booking)
 */

import { apiClient } from '../api-client';

export interface HotelRate {
  matchHash: string;
  bookHash: string;
  roomName: string;
  meal: string;
  mealData: { value: string; has_breakfast: boolean; no_child_meal: boolean };
  dailyPrice: string;
  showAmount: string;
  amount: string;
  currency: string;
  paymentType: string;
  cancellationPenalties: any;
  freeCancellationBefore: string | null;
  includedTaxes: { name: string; amount: string; currency: string }[];
  excludedTaxes: { name: string; amount: string; currency: string }[];
  roomDataTrans: any;
}

export interface HotelResult {
  id: string;
  hid: number;
  name: string;
  address: string;
  stars: number;
  images: string[];
  amenities: string[];
  location: { latitude: number; longitude: number };
  rating: number;
  reviewCount: number;
  rates: HotelRate[];
}

export interface HotelSearchResponse {
  searchId: string;
  hotels: HotelResult[];
  totalResults: number;
}

export interface HotelPageResult extends HotelResult {
  description: any;
  metapolicy: { struct: any; extra: string };
  roomGroups: any[];
}

export interface PrebookResult {
  bookHash: string;   // p-... hash to use in booking
  priceChanged: boolean;
  newPrice?: string;
  oldPrice?: string;
  currency?: string;
  rate?: HotelRate;
}

export interface BookingFormResult {
  orderId: string;
  partnerOrderId: string;
  status: string;
}

export interface BookingStatusResult {
  status: 'ok' | 'processing' | 'timeout' | string;
  error?: string;
  orderId: string;
}

export interface HotelSearchCriteria {
  destination: string;
  checkInDate: string;
  checkOutDate: string;
  guests?: { adults: number; children: number[] }[];
  residency?: string;
  currency?: string;
}

class HotelService {
  // ── Step 1: Search ──────────────────────────────────────────────────────────

  async searchHotels(criteria: HotelSearchCriteria): Promise<HotelSearchResponse> {
    const response = await apiClient.post<HotelSearchResponse>(
      '/bookings/hotels/search',
      criteria,
      { requiresAuth: false }
    );
    return response.data;
  }

  // ── Step 2a: Retrieve hotelpage ─────────────────────────────────────────────

  async getHotelPage(params: {
    hotelId: string;
    checkin: string;
    checkout: string;
    guests?: { adults: number; children: number[] }[];
    residency?: string;
    currency?: string;
  }): Promise<HotelPageResult> {
    const response = await apiClient.post<HotelPageResult>(
      '/bookings/hotels/hotelpage',
      params,
      { requiresAuth: false }
    );
    return response.data;
  }

  // ── Step 2b: Prebook rate ───────────────────────────────────────────────────

  async prebookRate(bookHash: string, priceIncreasePercent = 0): Promise<PrebookResult> {
    const response = await apiClient.post<PrebookResult>(
      '/bookings/hotels/prebook',
      { bookHash, priceIncreasePercent },
      { requiresAuth: false }
    );
    return response.data;
  }

  // ── Step 3a: Create booking form ────────────────────────────────────────────

  async createBookingForm(params: {
    bookHash: string;
    guests: { guests: { first_name: string; last_name: string; age?: number }[] }[];
    userPhone: string;
  }): Promise<BookingFormResult> {
    const response = await apiClient.post<BookingFormResult>(
      '/bookings/hotels/booking-form',
      params,
      { requiresAuth: true }
    );
    return response.data;
  }

  // ── Step 3b: Start booking (polls until final status) ───────────────────────

  async startBooking(params: {
    orderId: string;
    partnerOrderId: string;
    userPhone: string;
  }): Promise<BookingStatusResult> {
    const response = await apiClient.post<BookingStatusResult>(
      '/bookings/hotels/start-booking',
      params,
      { requiresAuth: true }
    );
    return response.data;
  }

  // ── Manual status check ─────────────────────────────────────────────────────

  async checkBookingStatus(orderId: string): Promise<BookingStatusResult> {
    const response = await apiClient.post<BookingStatusResult>(
      '/bookings/hotels/booking-status',
      { orderId },
      { requiresAuth: true }
    );
    return response.data;
  }

  // ── Static content ──────────────────────────────────────────────────────────

  async getHotelDetails(hotelId: string): Promise<HotelPageResult> {
    const response = await apiClient.get<HotelPageResult>(
      `/bookings/hotels/static/${hotelId}`,
      { requiresAuth: false }
    );
    return response.data;
  }

  // ── Post-booking ────────────────────────────────────────────────────────────

  async cancelBooking(orderId: string): Promise<any> {
    const response = await apiClient.post<any>(
      '/bookings/hotels/cancel',
      { orderId },
      { requiresAuth: true }
    );
    return response.data;
  }

  async getOrderInfo(orderId: string): Promise<any> {
    const response = await apiClient.post<any>(
      '/bookings/hotels/order-info',
      { orderId },
      { requiresAuth: true }
    );
    return response.data;
  }

  // ── Admin: static dumps ─────────────────────────────────────────────────────

  async getHotelDump(): Promise<{ url: string; lastUpdate: string }> {
    const response = await apiClient.get<{ url: string; lastUpdate: string }>(
      '/bookings/hotels/dump',
      { requiresAuth: true }
    );
    return response.data;
  }

  async getHotelIncrementalDump(date?: string): Promise<{ url: string; lastUpdate: string }> {
    const url = date ? `/bookings/hotels/dump/incremental?date=${date}` : '/bookings/hotels/dump/incremental';
    const response = await apiClient.get<{ url: string; lastUpdate: string }>(
      url,
      { requiresAuth: true }
    );
    return response.data;
  }
}

export const hotelService = new HotelService();
