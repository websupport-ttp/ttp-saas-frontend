import { apiClient } from '../api-client';

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  rate: number;
  exchangeRate?: number; // Alias for rate
  markup: number;
  lastUpdated: string;
  isBaseCurrency?: boolean;
  isActive?: boolean;
  fallbackRate?: number;
  apiSource?: string;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ConversionResult {
  amount: number;
  rate: number;
  markup: number;
}

export interface CurrencyFormData {
  code: string;
  name: string;
  symbol: string;
  markup?: number;
  fallbackRate?: number;
  isActive?: boolean;
  exchangeRate?: number;
}

class CurrencyService {
  private baseUrl = '/currencies';

  /**
   * Get all active currencies
   */
  async getCurrencies(): Promise<Currency[]> {
    try {
      const response = await apiClient.get<{ currencies: Currency[] }>(this.baseUrl);
      return response.data.currencies;
    } catch (error) {
      console.error('Failed to fetch currencies:', error);
      // Return empty array instead of throwing to prevent app crash
      return [];
    }
  }

  /**
   * Get all currencies including inactive (Admin/Staff Tier 3+)
   */
  async getAllCurrencies(): Promise<Currency[]> {
    try {
      const response = await apiClient.get<{ currencies: Currency[] }>(`${this.baseUrl}/all`);
      return response.data.currencies;
    } catch (error) {
      console.error('Failed to fetch all currencies:', error);
      throw new Error('Failed to load all currencies');
    }
  }

  /**
   * Convert amount between currencies
   */
  async convertCurrency(amount: number, from: string, to: string): Promise<ConversionResult> {
    try {
      const response = await apiClient.post<ConversionResult>(`${this.baseUrl}/convert`, {
        amount,
        from,
        to,
      });
      return response.data;
    } catch (error) {
      console.error('Failed to convert currency:', error);
      throw new Error('Failed to convert currency');
    }
  }

  /**
   * Create new currency (Staff Tier 3+)
   */
  async createCurrency(data: CurrencyFormData): Promise<Currency> {
    try {
      const response = await apiClient.post<{ currency: Currency }>(this.baseUrl, data);
      return response.data.currency;
    } catch (error) {
      console.error('Failed to create currency:', error);
      throw new Error('Failed to create currency');
    }
  }

  /**
   * Update currency (Staff Tier 3+)
   */
  async updateCurrency(code: string, data: Partial<CurrencyFormData>): Promise<Currency> {
    try {
      const response = await apiClient.put<{ currency: Currency }>(`${this.baseUrl}/${code}`, data);
      return response.data.currency;
    } catch (error) {
      console.error('Failed to update currency:', error);
      throw new Error('Failed to update currency');
    }
  }

  /**
   * Delete currency (Staff Tier 3+)
   */
  async deleteCurrency(code: string): Promise<void> {
    try {
      await apiClient.delete(`${this.baseUrl}/${code}`);
    } catch (error) {
      console.error('Failed to delete currency:', error);
      throw new Error('Failed to delete currency');
    }
  }

  /**
   * Update exchange rates from API (Staff Tier 3+)
   */
  async updateRates(): Promise<{ updated: number; failed: number; lastUpdated: string }> {
    try {
      const response = await apiClient.post<{ updated: number; failed: number; lastUpdated: string }>(
        `${this.baseUrl}/update-rates`
      );
      return response.data;
    } catch (error) {
      console.error('Failed to update rates:', error);
      throw new Error('Failed to update exchange rates');
    }
  }
}

export const currencyService = new CurrencyService();
