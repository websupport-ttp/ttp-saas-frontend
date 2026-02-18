/**
 * Flight Service
 * Handles flight search, booking, and payment verification
 */

import { apiClient } from "../api-client";
import { appConfig } from "../config";
import {
	FlightSearchCriteria,
	FlightSearchResponse,
	FlightBookingData,
	BookingResponse,
	PaymentVerificationResponse,
} from "@/types/api";

export class FlightService {
	/**
	 * Search for flights based on criteria
	 */
	async searchFlights(
		criteria: FlightSearchCriteria
	): Promise<FlightSearchResponse> {
		try {
			// Transform frontend criteria to backend format
			const backendCriteria: Record<string, any> = {
				originLocationCode: criteria.origin,
				destinationLocationCode: criteria.destination,
				departureDate: criteria.departureDate,
				adults: criteria.passengers.adults,
				children: criteria.passengers.children,
				infants: criteria.passengers.infants,
				currencyCode: "NGN",
				max: 50,
				travelClass: criteria.cabinClass?.toUpperCase() || "ECONOMY",
				nonStop: false,
			};

			// Add return date only if it exists and trip is round trip
			if (criteria.returnDate && criteria.returnDate.trim()) {
				backendCriteria.returnDate = criteria.returnDate;
			}

			// Remove undefined values to avoid validation errors
			Object.keys(backendCriteria).forEach((key) => {
				if (backendCriteria[key] === undefined || backendCriteria[key] === "") {
					delete backendCriteria[key];
				}
			});

			const response = await apiClient.post<FlightSearchResponse>(
				"/products/flights/search",
				backendCriteria,
				{ requiresAuth: false }
			);

			// API client already transforms backend response to frontend format
			// and throws errors for failed responses
			return response.data;
		} catch (error) {
			throw error;
		}
	}

	/**
	 * Book a flight
	 */
	async bookFlight(bookingData: FlightBookingData, asGuest: boolean = false): Promise<BookingResponse> {
		try {
			const response = await apiClient.post<BookingResponse>(
				"/products/flights/book",
				bookingData,
				{ requiresAuth: !asGuest }
			);

			return response.data;
		} catch (error) {
			console.error("Flight booking error:", error);
			throw error;
		}
	}

	/**
	 * Verify flight payment
	 */
	async verifyPayment(reference: string): Promise<PaymentVerificationResponse> {
		try {
			const response = await apiClient.post<PaymentVerificationResponse>(
				"/products/flights/verify-payment",
				{ reference },
				{ requiresAuth: false } // Payment verification should work for guest bookings
			);

			return response.data;
		} catch (error) {
			console.error("Payment verification error:", error);
			throw error;
		}
	}

	/**
	 * Get booking status by reference
	 */
	async getBookingStatus(bookingReference: string): Promise<any> {
		try {
			const response = await apiClient.get<any>(
				`/products/flights/booking/${bookingReference}/status`,
				{ requiresAuth: true }
			);

			return response.data;
		} catch (error) {
			console.error("Booking status error:", error);
			throw error;
		}
	}

	/**
	 * Create a flight booking (alias for bookFlight with enhanced data processing)
	 */
	async createBooking(bookingData: any): Promise<{ success: boolean; paymentUrl?: string; error?: string; bookingReference?: string }> {
		try {
			// Transform the booking data to match the expected FlightBookingData format
			const transformedData: FlightBookingData = {
				flightDetails: bookingData.flight,
				passengerDetails: [
					{
						id: `passenger-${Date.now()}`,
						name: {
							firstName: bookingData.passenger.firstName,
							lastName: bookingData.passenger.lastName,
						},
						gender: 'MALE', // Default, should be collected from form
						dateOfBirth: bookingData.passenger.dateOfBirth,
						contact: {
							emailAddress: bookingData.passenger.email,
							phones: [
								{
									deviceType: "MOBILE",
									countryCallingCode: "234", // Default to Nigeria
									number: bookingData.passenger.phone,
								},
							],
						},
						documents: [], // Will be populated if needed
					},
				],
				paymentDetails: {
					method: 'paystack',
					amount: parseFloat(bookingData.totalAmount),
					currency: bookingData.currency,
					callback_url: `${appConfig.siteUrl}/success?service=flight`,
				},
				isGuestBooking: true,
				guestContactInfo: {
					email: bookingData.passenger.email,
					phone: bookingData.passenger.phone,
					countryCode: "NG",
					dialCode: "+234",
				},
			};

			const response = await this.bookFlight(transformedData, true); // Book as guest

			// Store the complete booking data for the success page
			if (response.bookingReference) {
				const completeBookingData = {
					reference: response.bookingReference,
					flight: bookingData.flight, // This contains the full flight data with price breakdown
					passenger: {
						firstName: bookingData.passenger.firstName,
						lastName: bookingData.passenger.lastName,
						email: bookingData.passenger.email,
						phone: bookingData.passenger.phone,
						dateOfBirth: bookingData.passenger.dateOfBirth
					},
					passengerName: `${bookingData.passenger.firstName} ${bookingData.passenger.lastName}`,
					email: bookingData.passenger.email,
					totalAmount: bookingData.totalAmount,
					currency: bookingData.currency,
					// Store actual price breakdown from flight data
					priceBreakdown: {
						base: bookingData.flight?.price?.base || bookingData.totalAmount,
						taxes: bookingData.flight?.price?.taxes || '0',
						total: bookingData.flight?.price?.total || bookingData.totalAmount,
						currency: bookingData.flight?.price?.currency || bookingData.currency
					},
					bookingDate: new Date().toLocaleDateString('en-US', { 
						year: 'numeric', 
						month: 'long', 
						day: 'numeric' 
					})
				};
				
				console.log('💾 Storing booking data for success page:', {
					flightPrice: bookingData.flight?.price,
					priceBreakdown: completeBookingData.priceBreakdown,
					totalAmount: bookingData.totalAmount
				});
				
				localStorage.setItem('currentFlightBooking', JSON.stringify(completeBookingData));
			}

			return {
				success: true,
				paymentUrl: response.authorizationUrl,
				bookingReference: response.bookingReference,
			};
		} catch (error) {
			console.error("Create booking error:", error);
			return {
				success: false,
				error: error instanceof Error ? error.message : "Booking failed",
			};
		}
	}

	/**
	 * Get user's flight bookings
	 */
	async getUserBookings(): Promise<any[]> {
		try {
			const response = await apiClient.get<any[]>(
				"/products/flights/bookings",
				{ requiresAuth: true }
			);

			return response.data;
		} catch (error) {
			console.error("Get bookings error:", error);
			throw error;
		}
	}
}

// Export singleton instance
export const flightService = new FlightService();
