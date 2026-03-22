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
  private airportDbUrl = '/airportdb';

  /**
   * Search airports/cities via AirportDB (primary) with fallback to Amadeus
   */
  async searchAirports(query: string, limit = 10): Promise<Airport[]> {
    // Try AirportDB first (free, no credentials needed)
    try {
      const url = `${this.airportDbUrl}/search?q=${encodeURIComponent(query)}&limit=${limit}`;
      const response = await apiClient.get<any>(url, { requiresAuth: false });
      const raw = response.data;
      const list: any[] = Array.isArray(raw) ? raw : (raw?.data ?? raw?.results ?? []);
      if (list.length > 0) return list.map(normalizeAirportDbItem);
    } catch { /* fall through */ }

    // Fallback: Amadeus reference endpoint
    try {
      const url = `${this.baseUrl}/airports/search?q=${encodeURIComponent(query)}&limit=${limit}`;
      const response = await apiClient.get<ApiResponse<Airport>>(url, { requiresAuth: false });
      const raw = response.data;
      if (Array.isArray(raw)) return raw;
      if (raw?.data && Array.isArray(raw.data)) return raw.data;
    } catch { /* ignore */ }

    return [];
  }

  /**
   * Get popular airports list
   */
  async getAirports(limit = 50): Promise<Airport[]> {
    try {
      const url = `${this.airportDbUrl}/popular?limit=${limit}`;
      const response = await apiClient.get<any>(url, { requiresAuth: false });
      const raw = response.data;
      const list: any[] = Array.isArray(raw) ? raw : (raw?.data ?? raw?.airports ?? []);
      return list.map(normalizeAirportDbItem);
    } catch {
      try {
        const url = `${this.baseUrl}/airports?limit=${limit}`;
        const response = await apiClient.get<ApiResponse<Airport>>(url, { requiresAuth: false });
        return response.data.data || [];
      } catch {
        return [];
      }
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
   * Get countries list — uses AirportDB countries endpoint
   */
  async getCountries(): Promise<Country[]> {
    try {
      const response = await apiClient.get<any>(`${this.airportDbUrl}/countries`, { requiresAuth: false });
      const raw = response.data;
      const list: any[] = Array.isArray(raw) ? raw : (raw?.data ?? raw?.countries ?? []);
      return list.map((c: any) => ({
        code: c.code || c.iso_code || c.isoCode || '',
        name: c.name || c.country_name || '',
        continent: c.continent || c.region || '',
      })).filter(c => c.code && c.name);
    } catch {
      try {
        const response = await apiClient.get<ApiResponse<Country>>(`${this.baseUrl}/countries`, { requiresAuth: false });
        return response.data.data || [];
      } catch {
        return [];
      }
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

// Pre-warm popular airports cache in the background on service load
if (typeof window !== 'undefined') {
  referenceDataService.getCachedAirports().catch(() => {/* silent */});
}

/**
 * Normalize an AirportDB response item to the Airport interface shape
 */
function normalizeAirportDbItem(item: any): Airport {
  return {
    id: item.icao_code || item.iata_code || item.id || '',
    type: 'location',
    subType: item.type === 'large_airport' || item.type === 'medium_airport' || item.type === 'small_airport'
      ? 'AIRPORT' : (item.type === 'city' ? 'CITY' : 'AIRPORT'),
    name: item.name || item.airport_name || '',
    iataCode: item.iata_code || item.iataCode || item.code || '',
    address: {
      cityName: item.municipality || item.city || item.cityName || '',
      cityCode: item.iata_code || '',
      countryName: item.country?.name || item.country_name || item.countryName || '',
      countryCode: item.iso_country || item.country?.code || item.countryCode || '',
    },
    geoCode: item.latitude_deg != null ? {
      latitude: parseFloat(item.latitude_deg),
      longitude: parseFloat(item.longitude_deg),
    } : undefined,
  };
}