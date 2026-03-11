import { apiClient } from '../api-client'

export interface EmailTemplateVariable {
  name: string
  description: string
  example: string
}

export interface EmailTemplate {
  _id: string
  name: string
  displayName: string
  description?: string
  subject: string
  category: 'booking' | 'authentication' | 'notification' | 'marketing'
  variables: EmailTemplateVariable[]
  headerTitle: string
  headerSubtitle?: string
  headerIcon: string
  greeting: string
  mainContent: string
  footerText: string
  isActive: boolean
  isSystem: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateEmailTemplateData {
  name: string
  displayName: string
  description?: string
  subject: string
  category: 'booking' | 'authentication' | 'notification' | 'marketing'
  variables?: EmailTemplateVariable[]
  headerTitle?: string
  headerSubtitle?: string
  headerIcon?: string
  greeting: string
  mainContent: string
  footerText?: string
  isActive?: boolean
}

export interface UpdateEmailTemplateData extends Partial<CreateEmailTemplateData> {}

export const emailTemplateService = {
  /**
   * Get all email templates
   */
  async getAll(params?: { category?: string; isActive?: boolean }): Promise<EmailTemplate[]> {
    const queryParams = new URLSearchParams()
    if (params?.category) queryParams.append('category', params.category)
    if (params?.isActive !== undefined) queryParams.append('isActive', String(params.isActive))
    
    const url = `/email-templates${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    const response = await apiClient.get(url)
    return (response.data as any).templates
  },

  /**
   * Get email template by ID
   */
  async getById(id: string): Promise<EmailTemplate> {
    const response = await apiClient.get(`/email-templates/${id}`)
    return (response.data as any).template
  },

  /**
   * Get email template by name
   */
  async getByName(name: string): Promise<EmailTemplate> {
    const response = await apiClient.get(`/email-templates/name/${name}`)
    return (response.data as any).template
  },

  /**
   * Create new email template
   */
  async create(data: CreateEmailTemplateData): Promise<EmailTemplate> {
    const response = await apiClient.post('/email-templates', data)
    return (response.data as any).template
  },

  /**
   * Update email template
   */
  async update(id: string, data: UpdateEmailTemplateData): Promise<EmailTemplate> {
    const response = await apiClient.put(`/email-templates/${id}`, data)
    return (response.data as any).template
  },

  /**
   * Delete email template
   */
  async delete(id: string): Promise<void> {
    await apiClient.delete(`/email-templates/${id}`)
  },

  /**
   * Preview email template with sample data
   */
  async preview(id: string, sampleData: Record<string, any>): Promise<string> {
    const response = await apiClient.post(`/email-templates/${id}/preview`, { sampleData })
    return (response.data as any).html
  },
}
