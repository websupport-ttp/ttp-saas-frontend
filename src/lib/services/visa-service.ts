/**
 * Visa Service
 * Handles visa requirements, fee calculation, applications, and status tracking
 */

import { apiClient } from '../api-client';
import {
  VisaRequirements,
  VisaFees,
  VisaApplicationData,
  ApplicationStatus,
  BookingResponse,
  PaymentVerificationResponse,
  UploadResponse,
  ApiResponse
} from '@/types/api';

export class VisaService {
  /**
   * Get visa requirements for a specific country and visa type
   */
  async getRequirements(country: string, visaType: string): Promise<VisaRequirements> {
    try {
      const response = await apiClient.get<VisaRequirements>(
        `/products/visa/requirements?country=${encodeURIComponent(country)}&visaType=${encodeURIComponent(visaType)}`,
        { requiresAuth: false }
      );

      if (!response.success) {
        throw new Error(response.message || 'Failed to get visa requirements');
      }

      return response.data;
    } catch (error) {
      console.error('Visa requirements error:', error);
      throw error;
    }
  }

  /**
   * Calculate visa fees based on application data
   */
  async calculateFees(applicationData: Partial<VisaApplicationData>): Promise<VisaFees> {
    try {
      const response = await apiClient.post<VisaFees>(
        '/products/visa/calculate-fees',
        {
          destinationCountry: applicationData.destinationCountry,
          visaType: applicationData.visaType,
          urgency: applicationData.urgency || 'standard',
          applicantCount: 1 // Default to 1 applicant
        },
        { requiresAuth: false }
      );

      if (!response.success) {
        throw new Error(response.message || 'Failed to calculate visa fees');
      }

      return response.data;
    } catch (error) {
      console.error('Visa fee calculation error:', error);
      throw error;
    }
  }

  /**
   * Get visa requirements and fees together
   */
  async getRequirementsAndFees(
    country: string, 
    visaType: string, 
    urgency: string = 'standard'
  ): Promise<{ requirements: VisaRequirements; fees: VisaFees }> {
    try {
      const [requirements, fees] = await Promise.all([
        this.getRequirements(country, visaType),
        this.calculateFees({ destinationCountry: country, visaType, urgency })
      ]);

      return { requirements, fees };
    } catch (error) {
      console.error('Error getting requirements and fees:', error);
      throw error;
    }
  }

  /**
   * Submit visa application
   */
  async submitApplication(applicationData: VisaApplicationData): Promise<{ applicationId: string; trackingNumber: string }> {
    try {
      const response = await apiClient.post<{ applicationId: string; trackingNumber: string }>(
        '/products/visa/apply',
        applicationData,
        { requiresAuth: true }
      );

      if (!response.success) {
        throw new Error(response.message || 'Failed to submit visa application');
      }

      return response.data;
    } catch (error) {
      console.error('Visa application submission error:', error);
      throw error;
    }
  }

  /**
   * Upload document for visa application
   */
  async uploadDocument(
    applicationId: string, 
    document: File, 
    documentType: string,
    onUploadProgress?: (progress: number) => void
  ): Promise<UploadResponse> {
    try {
      const response = await apiClient.upload<UploadResponse>(
        `/products/visa/${applicationId}/upload-document`,
        document,
        { 
          requiresAuth: true,
          onUploadProgress,
          headers: {
            'X-Document-Type': documentType
          }
        }
      );

      if (!response.success) {
        throw new Error(response.message || 'Failed to upload document');
      }

      return response.data;
    } catch (error) {
      console.error('Document upload error:', error);
      throw error;
    }
  }

  /**
   * Get visa application status
   */
  async getApplicationStatus(applicationId: string): Promise<ApplicationStatus> {
    try {
      const response = await apiClient.get<ApplicationStatus>(
        `/products/visa/${applicationId}/status`,
        { requiresAuth: true }
      );

      if (!response.success) {
        throw new Error(response.message || 'Failed to get application status');
      }

      return response.data;
    } catch (error) {
      console.error('Application status error:', error);
      throw error;
    }
  }

  /**
   * Initiate visa payment
   */
  async initiatePayment(applicationId: string): Promise<BookingResponse> {
    try {
      const response = await apiClient.post<BookingResponse>(
        `/products/visa/${applicationId}/payment`,
        {},
        { requiresAuth: true }
      );

      if (!response.success) {
        throw new Error(response.message || 'Failed to initiate visa payment');
      }

      return response.data;
    } catch (error) {
      console.error('Visa payment initiation error:', error);
      throw error;
    }
  }

  /**
   * Verify visa payment
   */
  async verifyPayment(applicationId: string, reference: string): Promise<PaymentVerificationResponse> {
    try {
      const response = await apiClient.post<PaymentVerificationResponse>(
        `/products/visa/${applicationId}/verify-payment`,
        { reference },
        { requiresAuth: true }
      );

      if (!response.success) {
        throw new Error(response.message || 'Failed to verify visa payment');
      }

      return response.data;
    } catch (error) {
      console.error('Visa payment verification error:', error);
      throw error;
    }
  }

  /**
   * Get user's visa applications
   */
  async getUserApplications(): Promise<any[]> {
    try {
      const response = await apiClient.get<any[]>(
        '/products/visa/applications',
        { requiresAuth: true }
      );

      if (!response.success) {
        throw new Error(response.message || 'Failed to get visa applications');
      }

      return response.data;
    } catch (error) {
      console.error('Get visa applications error:', error);
      throw error;
    }
  }

  /**
   * Get supported countries for visa applications
   */
  async getSupportedCountries(): Promise<{ code: string; name: string; visaTypes: string[] }[]> {
    try {
      const response = await apiClient.get<{ code: string; name: string; visaTypes: string[] }[]>(
        '/products/visa/countries',
        { requiresAuth: false }
      );

      if (!response.success) {
        throw new Error(response.message || 'Failed to get supported countries');
      }

      return response.data;
    } catch (error) {
      console.error('Get supported countries error:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const visaService = new VisaService();