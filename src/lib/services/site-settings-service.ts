// lib/services/site-settings-service.ts
import { apiClient } from '../api-client';

export interface SiteSettings {
  _id: string;
  phone: string;
  phoneDescription: string;
  email: string;
  emailDescription: string;
  address: string;
  addressDescription: string;
  tagline: string;
  foundedYear: number;
  companyName: string;
  socialLinks: {
    facebook: string;
    instagram: string;
    twitter: string;
    linkedin: string;
  };
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateSiteSettingsData {
  phone?: string;
  phoneDescription?: string;
  email?: string;
  emailDescription?: string;
  address?: string;
  addressDescription?: string;
  tagline?: string;
  foundedYear?: number;
  companyName?: string;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
}

class SiteSettingsService {
  private baseUrl = '/settings/site';

  async getSiteSettings(): Promise<SiteSettings> {
    const response = await apiClient.get<SiteSettings>(this.baseUrl);
    return response.data;
  }

  async updateSiteSettings(data: UpdateSiteSettingsData): Promise<SiteSettings> {
    const response = await apiClient.put<SiteSettings>(this.baseUrl, data);
    return response.data;
  }
}

export const siteSettingsService = new SiteSettingsService();
