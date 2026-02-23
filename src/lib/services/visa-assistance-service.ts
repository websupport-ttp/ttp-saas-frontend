// Visa Assistance API Service
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

export interface VisaRequestData {
  destinationCountry: string;
  visaType: string;
  travelDates?: {
    departure?: string;
    return?: string;
  };
  email: string;
  phone: string;
  fullName: string;
  nationality: string;
  travelPurpose?: string;
  urgency?: 'Standard' | 'Express' | 'Super Express';
}

export interface VisaApplicationData {
  applicationReference: string;
  personalInformation: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    placeOfBirth: string;
    gender: string;
    maritalStatus: string;
    occupation: string;
  };
  passportDetails: {
    passportNumber: string;
    issueDate: string;
    expiryDate: string;
    issuingCountry: string;
  };
  travelDates: {
    intendedDeparture: string;
    intendedReturn?: string;
  };
  documents?: Array<{
    type: string;
    url: string;
    uploadedAt: Date;
  }>;
}

export interface FollowUpNote {
  note: string;
  contactMethod: 'Email' | 'Phone' | 'WhatsApp';
  nextAction?: string;
  nextActionDate?: string;
}

export interface PaymentLinkRequest {
  amount: number;
  description?: string;
  dueDate?: string;
}

class VisaAssistanceService {
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

  async createVisaRequest(requestData: VisaRequestData) {
    return this.fetchWithAuth(`${API_BASE_URL}/api/v1/visa-assistance/request`, {
      method: 'POST',
      body: JSON.stringify(requestData),
    });
  }

  async submitApplication(applicationData: VisaApplicationData) {
    return this.fetchWithAuth(`${API_BASE_URL}/api/v1/visa-assistance/applications`, {
      method: 'POST',
      body: JSON.stringify(applicationData),
    });
  }

  async getApplicationByReference(reference: string) {
    return this.fetchWithAuth(`${API_BASE_URL}/api/v1/visa-assistance/applications/${reference}`);
  }

  async getOfficerApplications(filters?: { status?: string; urgency?: string }) {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.urgency) params.append('urgency', filters.urgency);

    const queryString = params.toString();
    const url = `${API_BASE_URL}/api/v1/visa-assistance/officer/applications${queryString ? `?${queryString}` : ''}`;

    return this.fetchWithAuth(url);
  }

  async addFollowUpNote(applicationId: string, followUp: FollowUpNote) {
    return this.fetchWithAuth(
      `${API_BASE_URL}/api/v1/visa-assistance/applications/${applicationId}/follow-up`,
      {
        method: 'POST',
        body: JSON.stringify(followUp),
      }
    );
  }

  async generatePaymentLink(applicationId: string, paymentData: PaymentLinkRequest) {
    return this.fetchWithAuth(
      `${API_BASE_URL}/api/v1/visa-assistance/applications/${applicationId}/generate-payment-link`,
      {
        method: 'POST',
        body: JSON.stringify(paymentData),
      }
    );
  }

  async updateApplicationStatus(applicationId: string, status: string, notes?: string) {
    return this.fetchWithAuth(
      `${API_BASE_URL}/api/v1/visa-assistance/applications/${applicationId}/status`,
      {
        method: 'PUT',
        body: JSON.stringify({ status, notes }),
      }
    );
  }

  async assignApplication(applicationId: string, officerId: string) {
    return this.fetchWithAuth(
      `${API_BASE_URL}/api/v1/visa-assistance/applications/${applicationId}/assign`,
      {
        method: 'PUT',
        body: JSON.stringify({ officerId }),
      }
    );
  }
}

export const visaAssistanceService = new VisaAssistanceService();
