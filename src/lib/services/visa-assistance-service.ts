// Visa Assistance API Service — aligned with new backend endpoints
import { appConfig } from '@/lib/config'

const API = appConfig.apiBaseUrl

export interface VisaApplyPayload {
  destinationCountry: string
  visaType: string
  fullName: string
  email: string
  phone: string
  nationality: string
  dateOfBirth?: string
  passportNumber?: string
  passportExpiry?: string
  travelPurpose?: string
  travelDates?: { startDate?: string; endDate?: string }
  isOthersRequest?: boolean
  otherCountryNote?: string
}

class VisaAssistanceService {
  private async req<T>(url: string, options: RequestInit = {}): Promise<{ success: boolean; data: T; message?: string }> {
    const res = await fetch(url, {
      ...options,
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', ...options.headers },
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || 'Request failed')
    return data
  }

  // ── Price inventory ──────────────────────────────────────────────────────

  /** Get all active visa destination prices */
  async getPrices() {
    return this.req<any>(`${API}/visa-assistance/prices`)
  }

  /** Get price for a specific country + visa type */
  async getPrice(country: string, visaType: string) {
    return this.req<any>(`${API}/visa-assistance/prices/${encodeURIComponent(country)}/${encodeURIComponent(visaType)}`)
  }

  // ── Client flow ──────────────────────────────────────────────────────────

  /** Submit a visa assistance application */
  async apply(payload: VisaApplyPayload) {
    return this.req<{
      applicationReference: string
      fee: number
      currency: string
      processingTime: string
      requiresManualPricing: boolean
      message: string
    }>(`${API}/visa-assistance/apply`, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  }

  /** Track application by reference number */
  async track(reference: string) {
    return this.req<any>(`${API}/visa-assistance/track/${encodeURIComponent(reference)}`)
  }

  // ── Officer/Admin ────────────────────────────────────────────────────────

  async getOfficerApplications(filters?: { status?: string; paymentStatus?: string; assignedToMe?: boolean; page?: number }) {
    const params = new URLSearchParams()
    if (filters?.status) params.set('status', filters.status)
    if (filters?.paymentStatus) params.set('paymentStatus', filters.paymentStatus)
    if (filters?.assignedToMe) params.set('assignedToMe', 'true')
    if (filters?.page) params.set('page', String(filters.page))
    return this.req<any>(`${API}/visa-assistance/officer/applications?${params}`)
  }

  async getApplicationDetails(id: string) {
    return this.req<any>(`${API}/visa-assistance/officer/applications/${id}`)
  }

  async assignApplication(id: string, officerId: string) {
    return this.req<any>(`${API}/visa-assistance/officer/applications/${id}/assign`, {
      method: 'PUT',
      body: JSON.stringify({ officerId }),
    })
  }

  async updateStatus(id: string, status: string, notes?: string) {
    return this.req<any>(`${API}/visa-assistance/officer/applications/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, notes }),
    })
  }

  async addFollowUpNote(id: string, note: string, contactMethod?: string, nextAction?: string, nextActionDate?: string) {
    return this.req<any>(`${API}/visa-assistance/officer/applications/${id}/follow-up`, {
      method: 'POST',
      body: JSON.stringify({ note, contactMethod, nextAction, nextActionDate }),
    })
  }

  async generatePaymentLink(id: string, amount: number, description?: string, dueDate?: string) {
    return this.req<any>(`${API}/visa-assistance/officer/applications/${id}/payment-link`, {
      method: 'POST',
      body: JSON.stringify({ amount, description, dueDate }),
    })
  }

  // ── Admin price management ───────────────────────────────────────────────

  async getAllPricesAdmin() {
    return this.req<any>(`${API}/visa-assistance/admin/prices`)
  }

  async createPriceEntry(entry: any) {
    return this.req<any>(`${API}/visa-assistance/admin/prices`, {
      method: 'POST',
      body: JSON.stringify(entry),
    })
  }

  async updatePriceEntry(id: string, updates: any) {
    return this.req<any>(`${API}/visa-assistance/admin/prices/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    })
  }

  async deletePriceEntry(id: string) {
    return this.req<any>(`${API}/visa-assistance/admin/prices/${id}`, { method: 'DELETE' })
  }
}

export const visaAssistanceService = new VisaAssistanceService()
