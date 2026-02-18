/**
 * Travel Insurance Service
 * Handles travel insurance quotes, booking, and payment verification
 */

import { apiClient } from "../api-client";
import { appConfig } from "../config";

// Travel Insurance Types
export interface TravelInsuranceQuoteRequest {
  DateOfBirth: string; // DD-MMM-YYYY format
  Email: string;
  Telephone: string;
  CoverBegins: string; // DD-MMM-YYYY format
  CoverEnds: string; // DD-MMM-YYYY format
  CountryId: number;
  PurposeOfTravel: string;
  TravelPlanId: number;
  BookingTypeId: number;
  IsRoundTrip: boolean;
  NoOfPeople: number;
  NoOfChildren: number;
  IsMultiTrip: boolean;
}

export interface TravelInsuranceQuoteResponse {
  QuoteRequestId: number;
  ProductVariantId: string;
  Amount: number;
  AllianzPrice: string;
  // Additional quote details from Allianz
}

export interface TravelInsurancePurchaseRequest {
  quoteId: number;
  customerDetails: {
    Surname: string;
    MiddleName?: string;
    FirstName: string;
    GenderId: number;
    TitleId: number;
    DateOfBirth: string; // DD-MMM-YYYY format
    Email: string;
    Telephone: string;
    StateId: number;
    Address: string;
    ZipCode: string;
    Nationality: string;
    PassportNo: string;
    Occupation: string;
    MaritalStatusId: number;
    PreExistingMedicalCondition: boolean;
    NextOfKin: {
      FullName: string;
      Address: string;
      Relationship: string;
      Telephone: string;
    };
  };
  paymentDetails?: {
    callback_url: string;
    currency: string;
  };
}

export interface TravelInsuranceLookupData {
  id: number;
  name: string;
}

export interface PaymentVerificationResponse {
  status: string;
  message: string;
  data?: any;
}

export class TravelInsuranceService {
  /**
   * Get lookup data for travel insurance
   */
  async getLookupData(type: string): Promise<TravelInsuranceLookupData[]> {
    try {
      const response = await apiClient.get<{ data: TravelInsuranceLookupData[] }>(
        `/products/travel-insurance/lookup/${type}`,
        { requiresAuth: false }
      );

      return response.data.data;
    } catch (error) {
      console.error(`Travel insurance lookup error for ${type}:`, error);
      throw error;
    }
  }

  /**
   * Get countries for travel insurance
   */
  async getCountries(): Promise<TravelInsuranceLookupData[]> {
    return this.getLookupData('countries');
  }

  /**
   * Get travel plans
   */
  async getTravelPlans(): Promise<TravelInsuranceLookupData[]> {
    return this.getLookupData('travel-plans');
  }

  /**
   * Get booking types
   */
  async getBookingTypes(): Promise<TravelInsuranceLookupData[]> {
    return this.getLookupData('Booking Type');
  }

  /**
   * Get gender options
   */
  async getGenders(): Promise<TravelInsuranceLookupData[]> {
    return this.getLookupData('Gender');
  }

  /**
   * Get title options
   */
  async getTitles(): Promise<TravelInsuranceLookupData[]> {
    return this.getLookupData('Title');
  }

  /**
   * Get state options
   */
  async getStates(): Promise<TravelInsuranceLookupData[]> {
    return this.getLookupData('State');
  }

  /**
   * Get marital status options
   */
  async getMaritalStatuses(): Promise<TravelInsuranceLookupData[]> {
    return this.getLookupData('Marital Status');
  }

  /**
   * Get a travel insurance quote
   */
  async getQuote(quoteRequest: TravelInsuranceQuoteRequest): Promise<TravelInsuranceQuoteResponse> {
    try {
      const response = await apiClient.post<TravelInsuranceQuoteResponse>(
        "/products/travel-insurance/quote",
        quoteRequest,
        { requiresAuth: false }
      );

      return response.data;
    } catch (error) {
      console.error("Travel insurance quote error:", error);
      throw error;
    }
  }

  /**
   * Purchase travel insurance (individual)
   */
  async purchaseIndividual(purchaseRequest: TravelInsurancePurchaseRequest): Promise<{ success: boolean; paymentUrl?: string; error?: string; bookingReference?: string }> {
    try {
      // Add callback URL to payment details
      const requestWithCallback = {
        ...purchaseRequest,
        paymentDetails: {
          callback_url: `${appConfig.siteUrl}/success?service=insurance`,
          currency: 'NGN',
          ...purchaseRequest.paymentDetails
        }
      };

      const response = await apiClient.post<any>(
        "/products/travel-insurance/purchase/individual",
        requestWithCallback,
        { requiresAuth: false }
      );

      console.log('🔍 Purchase response:', response);
      console.log('🔍 Response data:', response.data);
      console.log('🔍 Response structure:', JSON.stringify(response.data, null, 2));

      // Handle different response structures
      let responseData = response.data;
      
      // If response has nested data structure
      if (responseData.data && typeof responseData.data === 'object') {
        responseData = responseData.data;
      }

      // Check for success indicators
      const isSuccess = response.success || 
                       responseData.success || 
                       responseData.status === 'success' ||
                       response.data?.status === 'success';

      // Look for authorization URL in different possible locations
      const authUrl = responseData.authorizationUrl || 
                     responseData.authorization_url ||
                     responseData.paymentUrl ||
                     responseData.payment_url ||
                     response.data?.data?.authorizationUrl ||
                     response.data?.data?.authorization_url;

      // Look for reference in different possible locations
      const reference = responseData.reference || 
                       responseData.bookingReference ||
                       responseData.booking_reference ||
                       response.data?.data?.reference;

      console.log('🔍 Parsed values:', { isSuccess, authUrl, reference });

      if (isSuccess && authUrl) {
        // Store booking data for success page
        localStorage.setItem('currentInsuranceBooking', JSON.stringify({
          insurance: {
            id: reference || 'INS-' + Date.now(),
            planName: 'Travel Insurance Policy',
            provider: 'Allianz',
            planType: 'Standard Plan'
          },
          bookingReference: reference,
          paymentReference: reference,
          totalAmount: responseData.amount || purchaseRequest.quoteId,
          customerDetails: purchaseRequest.customerDetails,
          policyNumber: reference
        }));

        return {
          success: true,
          paymentUrl: authUrl,
          bookingReference: reference,
        };
      } else {
        console.error('❌ Purchase failed - missing success indicator or authorization URL');
        console.error('Response data:', responseData);
        throw new Error(responseData.message || response.data?.message || 'Purchase failed - missing payment URL');
      }
    } catch (error) {
      console.error("❌ Travel insurance purchase error:", error);
      
      // If it's an API error with response data, try to extract more info
      if (error && typeof error === 'object' && 'response' in error) {
        const apiError = error as any;
        console.error('❌ API Error Response:', apiError.response?.data);
      }
      
      return {
        success: false,
        error: error instanceof Error ? error.message : "Purchase failed",
      };
    }
  }

  /**
   * Verify travel insurance payment
   */
  async verifyPayment(reference: string): Promise<PaymentVerificationResponse> {
    try {
      const response = await apiClient.post<PaymentVerificationResponse>(
        "/products/travel-insurance/verify-payment",
        { reference },
        { requiresAuth: false }
      );

      return response.data;
    } catch (error) {
      console.error("Travel insurance payment verification error:", error);
      throw error;
    }
  }

  /**
   * Helper function to format date to DD-MMM-YYYY format required by backend
   */
  formatDateForAPI(dateString: string): string {
    if (!dateString || dateString.trim() === '') {
      throw new Error('Date string is required and cannot be empty');
    }
    
    console.log('📅 Formatting date for API:', dateString);
    
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.error('❌ Invalid date string:', dateString);
      throw new Error(`Invalid date: ${dateString}. Please select a valid date.`);
    }
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                   'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    const formatted = `${day}-${month}-${year}`;
    console.log('✅ Formatted date:', formatted);
    
    return formatted;
  }

  /**
   * Helper function to calculate age from date of birth
   */
  calculateAge(dateOfBirth: string): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }

  /**
   * Helper function to format phone number to E.164 format required by backend
   */
  formatPhoneNumber(phoneNumber: string, dialCode?: string): string {
    if (!phoneNumber) return '';
    
    // Remove all non-digit characters
    let cleanNumber = phoneNumber.replace(/\D/g, '');
    
    // If number starts with 0, remove it (Nigerian local format)
    if (cleanNumber.startsWith('0')) {
      cleanNumber = cleanNumber.substring(1);
    }
    
    // Extract country code from dialCode (remove + sign)
    const countryCode = dialCode ? dialCode.replace('+', '') : '234';
    
    // If the number already starts with the country code, don't add it again
    if (cleanNumber.startsWith(countryCode)) {
      return `+${cleanNumber}`;
    }
    
    // Add country code with + prefix for E.164 format
    return `+${countryCode}${cleanNumber}`;
  }
}

// Export singleton instance
export const travelInsuranceService = new TravelInsuranceService();