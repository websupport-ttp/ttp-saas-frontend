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
  type: 'percentage' | 'fixed' | 'role-based' | 'provider-specific';
  value?: number;
  roleDiscounts?: {
    user: number;
    staff: number;
    agent: number;
    business: number;
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
      const response = await apiClient.post<{ data: PriceBreakdown }>(
        "/pricing/calculate",
        params,
        { requiresAuth: false }
      );

      return response.data.data;
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

      const response = await apiClient.get<{ data: { discounts: ApplicableDiscount[] } }>(
        `/discounts/applicable/${params.serviceType}?${queryParams.toString()}`,
        { requiresAuth: false }
      );

      return response.data.data.discounts || [];
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
      const response = await apiClient.post<{ data: { discount: ApplicableDiscount } }>(
        "/discounts/validate",
        params,
        { requiresAuth: false }
      );

      return response.data.data.discount || null;
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
  async getAllDiscounts(): Promise<{ data: { discounts: Discount[] } }> {
    try {
      const response = await apiClient.get<{ data: { discounts: Discount[] } }>(
        "/discounts",
        { requiresAuth: true }
      );

      return response.data;
    } catch (error) {
      console.error("Error fetching discounts:", error);
      return { data: { discounts: [] } };
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
}

// Export singleton instance
export const pricingService = new PricingService();
