import { appConfig } from '@/lib/config';

const API_BASE_URL = appConfig.apiBaseUrl;

export interface ServiceCharge {
  _id: string;
  name: string;
  description?: string;
  type: 'percentage' | 'fixed';
  value: number;
  appliesTo: string[];
  isActive: boolean;
  priority: number;
  createdAt: string;
  updatedAt: string;
}

export interface Tax {
  _id: string;
  name: string;
  description?: string;
  type: 'VAT' | 'GST' | 'Sales Tax' | 'Service Tax' | 'Other';
  rate: number;
  appliesTo: string[];
  country: string;
  isActive: boolean;
  isInclusive: boolean;
  priority: number;
  createdAt: string;
  updatedAt: string;
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
  usageCount: number;
  validFrom?: string;
  validUntil?: string;
  isActive: boolean;
  isStackable: boolean;
  priority: number;
  createdAt: string;
  updatedAt: string;
}

class PricingService {
  private async fetchWithAuth(url: string, options: RequestInit = {}) {
    const response = await fetch(url, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'An error occurred');
    }

    return data;
  }

  // Service Charges
  async getAllServiceCharges(filters?: { isActive?: boolean; appliesTo?: string }) {
    const params = new URLSearchParams();
    if (filters?.isActive !== undefined) params.append('isActive', String(filters.isActive));
    if (filters?.appliesTo) params.append('appliesTo', filters.appliesTo);

    return this.fetchWithAuth(`${API_BASE_URL}/service-charges?${params.toString()}`);
  }

  async createServiceCharge(data: Partial<ServiceCharge>) {
    return this.fetchWithAuth(`${API_BASE_URL}/service-charges`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateServiceCharge(id: string, data: Partial<ServiceCharge>) {
    return this.fetchWithAuth(`${API_BASE_URL}/service-charges/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteServiceCharge(id: string) {
    return this.fetchWithAuth(`${API_BASE_URL}/service-charges/${id}`, {
      method: 'DELETE',
    });
  }

  // Taxes
  async getAllTaxes(filters?: { isActive?: boolean; appliesTo?: string; country?: string }) {
    const params = new URLSearchParams();
    if (filters?.isActive !== undefined) params.append('isActive', String(filters.isActive));
    if (filters?.appliesTo) params.append('appliesTo', filters.appliesTo);
    if (filters?.country) params.append('country', filters.country);

    return this.fetchWithAuth(`${API_BASE_URL}/taxes?${params.toString()}`);
  }

  async createTax(data: Partial<Tax>) {
    return this.fetchWithAuth(`${API_BASE_URL}/taxes`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTax(id: string, data: Partial<Tax>) {
    return this.fetchWithAuth(`${API_BASE_URL}/taxes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteTax(id: string) {
    return this.fetchWithAuth(`${API_BASE_URL}/taxes/${id}`, {
      method: 'DELETE',
    });
  }

  // Discounts
  async getAllDiscounts(filters?: { isActive?: boolean; type?: string; appliesTo?: string }) {
    const params = new URLSearchParams();
    if (filters?.isActive !== undefined) params.append('isActive', String(filters.isActive));
    if (filters?.type) params.append('type', filters.type);
    if (filters?.appliesTo) params.append('appliesTo', filters.appliesTo);

    return this.fetchWithAuth(`${API_BASE_URL}/discounts?${params.toString()}`);
  }

  async createDiscount(data: Partial<Discount>) {
    return this.fetchWithAuth(`${API_BASE_URL}/discounts`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateDiscount(id: string, data: Partial<Discount>) {
    return this.fetchWithAuth(`${API_BASE_URL}/discounts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteDiscount(id: string) {
    return this.fetchWithAuth(`${API_BASE_URL}/discounts/${id}`, {
      method: 'DELETE',
    });
  }

  async validateDiscountCode(code: string, serviceType: string, amount: number, userRole: string) {
    return this.fetchWithAuth(`${API_BASE_URL}/discounts/validate`, {
      method: 'POST',
      body: JSON.stringify({ code, serviceType, amount, userRole }),
    });
  }
}

export const pricingService = new PricingService();
