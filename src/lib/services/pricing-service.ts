/**
 * Pricing Service
 * Handles pricing calculations, discount retrieval, and price breakdowns
 */

import { apiClient } from "../api-client";

export interface PriceBreakdownItem {
  id: string;
  name: string;
  type: string;
  value: number;
  amount: number;
}

export interface PriceBreakdown {
  basePrice: number;
  serviceCharges: PriceBreakdownItem[];
  taxes: PriceBreakdownItem[];
  discounts: PriceBreakdownItem[];
  subtotal: number;
  totalServiceCharges: number;
  totalTaxes: number;
  totalDiscounts: number;
  finalPrice: number;
}

export interface ApplicableDiscount {
  id: string;
  name: string;
  code?: string;
  type: string;
  value: number;
  discountAmount?: number;
  isStackable: boolean;
}

export interface Discount {
  _id: string;
  name: string;
  description?: string;
  code?: string;
  type: 'percentage' | 'fixed' | 'role-based' | 'provider-specific' | 'provider-role-based';
  value?: number;
  roleDiscounts?: {
    customer: number;
    business: number;
    staff: number;
    vendor: number;
    agent: number;
    manager: number;
    executive: number;
    admin: number;
  };
  provider?: {
    type: string;
    name: string;
    code: string;
  };
  appliesTo: string[];
  minPurchaseAmount?: number;
  maxDiscountAmount?: number;
  usageLimit?: number;
  usageCount?: number;
  validFrom?: string;
  validUntil?: string;
  isActive: boolean;
  isStackable: boolean;
  priority: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ServiceCharge {
  _id: string;
  name: string;
  description?: string;
  type: 'percentage' | 'fixed';
  value: number;
  appliesTo: string[];
  isActive: boolean;
  priority: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Tax {
  _id: string;
  name: string;
  description?: string;
  type: 'VAT' | 'GST' | 'Sales Tax' | 'Service Tax' | 'Other';
  rate: number;
  country: string;
  appliesTo: string[];
  isInclusive: boolean;
  isActive: boolean;
  priority: number;
  createdAt?: string;
  updatedAt?: string;
}

export class PricingService {
  /**
   * Calculate price with all charges, taxes, and discounts
   */
  async calculatePrice(params: {
    basePrice: number;
    serviceType: string;
    userRole?: string;
    discountCode?: string;
    providerCode?: string;
    country?: string;
  }): Promise<PriceBreakdown> {
    try {
      const response = await apiClient.post<PriceBreakdown>(
        "/pricing/calculate",
        params,
        { requiresAuth: false }
      );

      return response.data;
    } catch (error) {
      console.error("Price calculation error:", error);
      // Return basic breakdown if calculation fails
      return {
        basePrice: params.basePrice,
        serviceCharges: [],
        taxes: [],
        discounts: [],
        subtotal: params.basePrice,
        totalServiceCharges: 0,
        totalTaxes: 0,
        totalDiscounts: 0,
        finalPrice: params.basePrice,
      };
    }
  }

  /**
   * Get applicable discounts for a service type
   */
  async getApplicableDiscounts(params: {
    serviceType: string;
    userRole?: string;
    providerCode?: string;
  }): Promise<ApplicableDiscount[]> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append("serviceType", params.serviceType);
      if (params.userRole) queryParams.append("userRole", params.userRole);
      if (params.providerCode) queryParams.append("providerCode", params.providerCode);

      const response = await apiClient.get<{ count: number; discounts: ApplicableDiscount[] }>(
        `/discounts/applicable/${params.serviceType}?${queryParams.toString()}`,
        { requiresAuth: false }
      );

      return response.data?.discounts || [];
    } catch (error) {
      console.error("Error fetching applicable discounts:", error);
      return [];
    }
  }

  /**
   * Validate a discount code
   */
  async validateDiscountCode(params: {
    code: string;
    serviceType: string;
    amount: number;
    userRole?: string;
  }): Promise<ApplicableDiscount | null> {
    try {
      const response = await apiClient.post<{ discount: ApplicableDiscount }>(
        "/discounts/validate",
        params,
        { requiresAuth: false }
      );

      return response.data?.discount || null;
    } catch (error) {
      console.error("Discount validation error:", error);
      return null;
    }
  }

  /**
   * Get best applicable discount for a service
   * Checks for provider-specific, role-based, and general discounts
   */
  async getBestDiscount(params: {
    serviceType: string;
    userRole?: string;
    providerCode?: string;
    basePrice?: number;
  }): Promise<ApplicableDiscount | null> {
    try {
      const discounts = await this.getApplicableDiscounts({
        serviceType: params.serviceType,
        userRole: params.userRole,
        providerCode: params.providerCode,
      });

      if (discounts.length === 0) return null;

      // Return the first (highest priority) discount
      return discounts[0];
    } catch (error) {
      console.error("Error getting best discount:", error);
      return null;
    }
  }

  /**
   * Get all discounts (admin)
   */
  async getAllDiscounts(): Promise<{ data: { discounts: Discount[] }; error?: string }> {
    try {
      const response = await apiClient.get<{ count: number; discounts: Discount[] }>(
        "/discounts",
        { requiresAuth: true }
      );

      // apiClient.get() returns ApiResponse<T> where T = { count, discounts }
      // After interceptor: { success, message, data: { count, discounts } }
      // So response.data is { count, discounts }
      const discounts = response.data?.discounts;
      console.log('[PricingService] getAllDiscounts raw response:', JSON.stringify(response));
      return {
        data: {
          discounts: Array.isArray(discounts) ? discounts : []
        }
      };
    } catch (error: any) {
      const msg = error?.message || String(error);
      const status = error?.response?.status || error?.status;
      console.error(`[PricingService] getAllDiscounts failed (${status}):`, msg);
      return { data: { discounts: [] }, error: `${status ? status + ': ' : ''}${msg}` };
    }
  }

  /**
   * Create a new discount (admin)
   */
  async createDiscount(data: Partial<Discount>): Promise<{ data: { discount: Discount } }> {
    try {
      const response = await apiClient.post<{ data: { discount: Discount } }>(
        "/discounts",
        data,
        { requiresAuth: true }
      );

      return response.data;
    } catch (error) {
      console.error("Error creating discount:", error);
      throw error;
    }
  }

  /**
   * Update a discount (admin)
   */
  async updateDiscount(id: string, data: Partial<Discount>): Promise<{ data: { discount: Discount } }> {
    try {
      const response = await apiClient.put<{ data: { discount: Discount } }>(
        `/discounts/${id}`,
        data,
        { requiresAuth: true }
      );

      return response.data;
    } catch (error) {
      console.error("Error updating discount:", error);
      throw error;
    }
  }

  /**
   * Delete a discount (admin)
   */
  async deleteDiscount(id: string): Promise<void> {
    try {
      await apiClient.delete(
        `/discounts/${id}`,
        { requiresAuth: true }
      );
    } catch (error) {
      console.error("Error deleting discount:", error);
      throw error;
    }
  }

  /**
   * Get all service charges (admin)
   */
  async getAllServiceCharges(): Promise<{ data: { serviceCharges: ServiceCharge[] }; error?: string }> {
    try {
      const response = await apiClient.get<{ count: number; serviceCharges: ServiceCharge[] }>(
        "/service-charges",
        { requiresAuth: true }
      );

      // apiClient.get() returns ApiResponse<T> where T = { count, serviceCharges }
      // After interceptor: { success, message, data: { count, serviceCharges } }
      // So response.data is { count, serviceCharges }
      const serviceCharges = response.data?.serviceCharges;
      console.log('[PricingService] getAllServiceCharges raw response:', JSON.stringify(response));
      return {
        data: {
          serviceCharges: Array.isArray(serviceCharges) ? serviceCharges : []
        }
      };
    } catch (error: any) {
      const msg = error?.message || String(error);
      const status = error?.response?.status || error?.status;
      console.error(`[PricingService] getAllServiceCharges failed (${status}):`, msg);
      return { data: { serviceCharges: [] }, error: `${status ? status + ': ' : ''}${msg}` };
    }
  }

  /**
   * Create a new service charge (admin)
   */
  async createServiceCharge(data: Partial<ServiceCharge>): Promise<{ data: { serviceCharge: ServiceCharge } }> {
    try {
      const response = await apiClient.post<{ data: { serviceCharge: ServiceCharge } }>(
        "/service-charges",
        data,
        { requiresAuth: true }
      );

      return response.data;
    } catch (error) {
      console.error("Error creating service charge:", error);
      throw error;
    }
  }

  /**
   * Update a service charge (admin)
   */
  async updateServiceCharge(id: string, data: Partial<ServiceCharge>): Promise<{ data: { serviceCharge: ServiceCharge } }> {
    try {
      const response = await apiClient.put<{ data: { serviceCharge: ServiceCharge } }>(
        `/service-charges/${id}`,
        data,
        { requiresAuth: true }
      );

      return response.data;
    } catch (error) {
      console.error("Error updating service charge:", error);
      throw error;
    }
  }

  /**
   * Delete a service charge (admin)
   */
  async deleteServiceCharge(id: string): Promise<void> {
    try {
      await apiClient.delete(
        `/service-charges/${id}`,
        { requiresAuth: true }
      );
    } catch (error) {
      console.error("Error deleting service charge:", error);
      throw error;
    }
  }

  /**
   * Get all taxes (admin)
   */
  async getAllTaxes(): Promise<{ data: { taxes: Tax[] } }> {
    try {
      const response = await apiClient.get<{ count: number; taxes: Tax[] }>(
        "/taxes",
        { requiresAuth: true }
      );

      // apiClient.get() returns ApiResponse<T> where T = { count, taxes }
      // So response.data is { count, taxes }
      return {
        data: {
          taxes: response.data?.taxes || []
        }
      };
    } catch (error) {
      console.error("Error fetching taxes:", error);
      return { data: { taxes: [] } };
    }
  }

  /**
   * Create a new tax (admin)
   */
  async createTax(data: Partial<Tax>): Promise<{ data: { tax: Tax } }> {
    try {
      const response = await apiClient.post<{ data: { tax: Tax } }>(
        "/taxes",
        data,
        { requiresAuth: true }
      );

      return response.data;
    } catch (error) {
      console.error("Error creating tax:", error);
      throw error;
    }
  }

  /**
   * Update a tax (admin)
   */
  async updateTax(id: string, data: Partial<Tax>): Promise<{ data: { tax: Tax } }> {
    try {
      const response = await apiClient.put<{ data: { tax: Tax } }>(
        `/taxes/${id}`,
        data,
        { requiresAuth: true }
      );

      return response.data;
    } catch (error) {
      console.error("Error updating tax:", error);
      throw error;
    }
  }

  /**
   * Delete a tax (admin)
   */
  async deleteTax(id: string): Promise<void> {
    try {
      await apiClient.delete(
        `/taxes/${id}`,
        { requiresAuth: true }
      );
    } catch (error) {
      console.error("Error deleting tax:", error);
      throw error;
    }
  }
}

// Export singleton instance
export const pricingService = new PricingService();
