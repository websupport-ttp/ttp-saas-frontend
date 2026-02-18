/**
 * Reference Data Service
 * Service for fetching airports and countries data from the backend API
 */

import { apiClient } from '@/lib/api-client';

export interface Airport {
  id: string;
  type: string;
  subType: string;
  name: string;
  detailedName?: string;
  iataCode: string;
  address?: {
    cityName?: string;
    cityCode?: string;
    countryName?: string;
    countryCode?: string;
    regionCode?: string;
  };
  geoCode?: {
    latitude: number;
    longitude: number;
  };
  timeZoneOffset?: string;
  analytics?: {
    travelers?: {
      score: number;
    };
  };
}

export interface Country {
  code: string;
  name: string;
  continent: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  meta: {
    count: number;
    cached?: boolean;
    cacheAge?: number;
    query?: string;
  };
}

class ReferenceDataService {
  private baseUrl = '/reference';

  /**
   * Search airports by query
   */
  async searchAirports(query: string, limit = 10): Promise<Airport[]> {
    try {
      const url = `${this.baseUrl}/airports/search?q=${encodeURIComponent(query)}&limit=${limit}`;
      const response = await apiClient.get<ApiResponse<Airport>>(url);
      
      // Check if response.data is the full API response or just the data array
      let airports: Airport[] = [];
      
      if (Array.isArray(response.data)) {
        // Axios already unwrapped to just the data array
        airports = response.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        // Full API response structure
        airports = response.data.data;
      } else {
        console.warn('Unexpected API response structure:', response.data);
        airports = [];
      }
      
      return airports;
    } catch (error) {
      console.error('Failed to search airports:', error);
      return [];
    }
  }

  /**
   * Get popular airports list
   */
  async getAirports(limit = 50): Promise<Airport[]> {
    try {
      const url = `${this.baseUrl}/airports?limit=${limit}`;
      const response = await apiClient.get<ApiResponse<Airport>>(url);
      return response.data.data || [];
    } catch (error) {
      console.error('Failed to get airports:', error);
      return [];
    }
  }

  /**
   * Get airport details by IATA code
   */
  async getAirportDetails(iataCode: string): Promise<Airport | null> {
    try {
      const response = await apiClient.get<{ success: boolean; data: Airport }>(
        `${this.baseUrl}/airports/${iataCode.toUpperCase()}`
      );
      return response.data.data || null;
    } catch (error) {
      console.error(`Failed to get airport details for ${iataCode}:`, error);
      return null;
    }
  }

  /**
   * Get countries list
   */
  async getCountries(): Promise<Country[]> {
    try {
      const response = await apiClient.get<ApiResponse<Country>>(
        `${this.baseUrl}/countries`
      );
      return response.data.data || [];
    } catch (error) {
      console.error('Failed to get countries:', error);
      return [];
    }
  }

  /**
   * Search countries by name
   */
  searchCountries(query: string, countries: Country[]): Country[] {
    if (!query || query.length < 2) return [];
    
    const searchTerm = query.toLowerCase();
    return countries.filter(country =>
      country.name.toLowerCase().includes(searchTerm) ||
      country.code.toLowerCase().includes(searchTerm)
    ).slice(0, 10);
  }

  /**
   * Format airport for display
   */
  formatAirportOption(airport: Airport) {
    const cityName = airport.address?.cityName || '';
    const countryName = airport.address?.countryName || '';
    
    // Format as "City(CODE)" for flights
    let label = airport.name;
    if (airport.iataCode && cityName) {
      label = `${cityName}(${airport.iataCode})`;
    } else if (airport.iataCode) {
      label = `${airport.name}(${airport.iataCode})`;
    }
    
    let subtitle = '';
    if (cityName && countryName) {
      subtitle = `${cityName}, ${countryName}`;
    } else if (cityName) {
      subtitle = cityName;
    } else if (countryName) {
      subtitle = countryName;
    }

    return {
      value: airport.iataCode || airport.id,
      label,
      subtitle,
      data: airport
    };
  }

  /**
   * Format country for display
   */
  formatCountryOption(country: Country) {
    return {
      value: country.code,
      label: country.name,
      subtitle: country.continent,
      data: country
    };
  }

  /**
   * Get cached airports (for performance)
   */
  private airportsCache: Airport[] | null = null;
  private airportsCacheTime: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  async getCachedAirports(): Promise<Airport[]> {
    const now = Date.now();
    
    if (this.airportsCache && (now - this.airportsCacheTime) < this.CACHE_DURATION) {
      return this.airportsCache;
    }

    const airports = await this.getAirports();
    this.airportsCache = airports;
    this.airportsCacheTime = now;
    
    return airports;
  }

  /**
   * Get cached countries (for performance)
   */
  private countriesCache: Country[] | null = null;
  private countriesCacheTime: number = 0;

  async getCachedCountries(): Promise<Country[]> {
    const now = Date.now();
    
    if (this.countriesCache && (now - this.countriesCacheTime) < this.CACHE_DURATION) {
      return this.countriesCache;
    }

    const countries = await this.getCountries();
    this.countriesCache = countries;
    this.countriesCacheTime = now;
    
    return countries;
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.airportsCache = null;
    this.countriesCache = null;
    this.airportsCacheTime = 0;
    this.countriesCacheTime = 0;
  }
}

export const referenceDataService = new ReferenceDataService();