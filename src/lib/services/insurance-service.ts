/**
 * Insurance Service
 * Handles travel insurance quotes, purchases, and policy management
 */

import { apiClient } from '../api-client';
import {
  InsuranceQuoteData,
  InsuranceQuote,
  PolicyPurchaseData,
  BookingResponse,
  PaymentVerificationResponse,
  ApiResponse
} from '@/types/api';

export class InsuranceService {
  /**
   * Get insurance quote based on trip details and traveler information
   */
  async getQuote(quoteData: InsuranceQuoteData): Promise<InsuranceQuote> {
    try {
      const response = await apiClient.post<InsuranceQuote>(
        '/products/travel-insurance/quote',
        {
          tripType: quoteData.tripType,
          destination: quoteData.destination,
          departureDate: quoteData.departureDate,
          returnDate: quoteData.returnDate,
          travelers: quoteData.travelers,
          coverageType: quoteData.coverageType
        },
        { requiresAuth: false }
      );

      if (!response.success) {
        throw new Error(response.message || 'Failed to get insurance quote');
      }

      return response.data;
    } catch (error) {
      console.error('Insurance quote error:', error);
      throw error;
    }
  }

  /**
   * Purchase individual insurance policy
   */
  async purchaseIndividualPolicy(policyData: PolicyPurchaseData): Promise<BookingResponse> {
    try {
      const response = await apiClient.post<BookingResponse>(
        '/products/travel-insurance/purchase/individual',
        policyData,
        { requiresAuth: true }
      );

      if (!response.success) {
        throw new Error(response.message || 'Failed to purchase individual policy');
      }

      return response.data;
    } catch (error) {
      console.error('Individual policy purchase error:', error);
      throw error;
    }
  }

  /**
   * Purchase family insurance policy
   */
  async purchaseFamilyPolicy(policyData: PolicyPurchaseData): Promise<BookingResponse> {
    try {
      const response = await apiClient.post<BookingResponse>(
        '/products/travel-insurance/purchase/family',
        policyData,
        { requiresAuth: true }
      );

      if (!response.success) {
        throw new Error(response.message || 'Failed to purchase family policy');
      }

      return response.data;
    } catch (error) {
      console.error('Family policy purchase error:', error);
      throw error;
    }
  }

  /**
   * Get policy details by ID
   */
  async getPolicyDetails(policyId: string): Promise<any> {
    try {
      const response = await apiClient.get<any>(
        `/products/travel-insurance/policy/${policyId}`,
        { requiresAuth: true }
      );

      if (!response.success) {
        throw new Error(response.message || 'Failed to get policy details');
      }

      return response.data;
    } catch (error) {
      console.error('Get policy details error:', error);
      throw error;
    }
  }

  /**
   * Get policy confirmation after purchase
   */
  async getPolicyConfirmation(policyId: string): Promise<any> {
    try {
      const response = await apiClient.get<any>(
        `/products/travel-insurance/policy/${policyId}/confirmation`,
        { requiresAuth: true }
      );

      if (!response.success) {
        throw new Error(response.message || 'Failed to get policy confirmation');
      }

      return response.data;
    } catch (error) {
      console.error('Policy confirmation error:', error);
      throw error;
    }
  }

  /**
   * Verify insurance payment
   */
  async verifyPayment(policyId: string, reference: string): Promise<PaymentVerificationResponse> {
    try {
      const response = await apiClient.post<PaymentVerificationResponse>(
        `/products/travel-insurance/policy/${policyId}/verify-payment`,
        { reference },
        { requiresAuth: true }
      );

      if (!response.success) {
        throw new Error(response.message || 'Failed to verify insurance payment');
      }

      return response.data;
    } catch (error) {
      console.error('Insurance payment verification error:', error);
      throw error;
    }
  }

  /**
   * Download policy document
   */
  async downloadPolicyDocument(policyId: string): Promise<Blob> {
    try {
      const response = await apiClient.get<Blob>(
        `/products/travel-insurance/policy/${policyId}/document`,
        { 
          requiresAuth: true,
          headers: {
            'Accept': 'application/pdf'
          }
        }
      );

      // For file downloads, the response might be different
      // This assumes the API returns the file directly
      return response.data as unknown as Blob;
    } catch (error) {
      console.error('Policy document download error:', error);
      throw error;
    }
  }

  /**
   * Get user's insurance policies
   */
  async getUserPolicies(): Promise<any[]> {
    try {
      const response = await apiClient.get<any[]>(
        '/products/travel-insurance/policies',
        { requiresAuth: true }
      );

      if (!response.success) {
        throw new Error(response.message || 'Failed to get user policies');
      }

      return response.data;
    } catch (error) {
      console.error('Get user policies error:', error);
      throw error;
    }
  }

  /**
   * Get lookup data for insurance forms (countries, coverage types, etc.)
   */
  async getLookupData(type: string): Promise<any> {
    try {
      const response = await apiClient.get<any>(
        `/products/travel-insurance/lookup/${type}`,
        { requiresAuth: false }
      );

      if (!response.success) {
        throw new Error(response.message || 'Failed to get lookup data');
      }

      return response.data;
    } catch (error) {
      console.error('Get lookup data error:', error);
      throw error;
    }
  }

  /**
   * Get available coverage types and their details
   */
  async getCoverageTypes(): Promise<any[]> {
    try {
      const response = await apiClient.get<any[]>(
        '/products/travel-insurance/coverage-types',
        { requiresAuth: false }
      );

      if (!response.success) {
        throw new Error(response.message || 'Failed to get coverage types');
      }

      return response.data;
    } catch (error) {
      console.error('Get coverage types error:', error);
      throw error;
    }
  }

  /**
   * Get policy status by reference
   */
  async getPolicyStatus(policyReference: string): Promise<any> {
    try {
      const response = await apiClient.get<any>(
        `/products/travel-insurance/policy/status/${policyReference}`,
        { requiresAuth: true }
      );

      if (!response.success) {
        throw new Error(response.message || 'Failed to get policy status');
      }

      return response.data;
    } catch (error) {
      console.error('Policy status error:', error);
      throw error;
    }
  }

  /**
   * Cancel insurance policy
   */
  async cancelPolicy(policyId: string, reason: string): Promise<any> {
    try {
      const response = await apiClient.post<any>(
        `/products/travel-insurance/policy/${policyId}/cancel`,
        { reason },
        { requiresAuth: true }
      );

      if (!response.success) {
        throw new Error(response.message || 'Failed to cancel policy');
      }

      return response.data;
    } catch (error) {
      console.error('Policy cancellation error:', error);
      throw error;
    }
  }

  /**
   * Submit insurance claim
   */
  async submitClaim(policyId: string, claimData: any): Promise<any> {
    try {
      const response = await apiClient.post<any>(
        `/products/travel-insurance/policy/${policyId}/claim`,
        claimData,
        { requiresAuth: true }
      );

      if (!response.success) {
        throw new Error(response.message || 'Failed to submit claim');
      }

      return response.data;
    } catch (error) {
      console.error('Claim submission error:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const insuranceService = new InsuranceService();