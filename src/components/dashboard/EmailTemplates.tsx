'use client'

import { useState, useEffect } from 'react'
import { emailTemplateService, EmailTemplate, CreateEmailTemplateData } from '@/lib/services/email-template-service'

export default function EmailTemplates() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [previewHtml, setPreviewHtml] = useState('')
  const [showPreview, setShowPreview] = useState(false)
  const [categoryFilter, setCategoryFilter] = useState<string>('all')

  const [formData, setFormData] = useState<CreateEmailTemplateData>({
    name: '',
    displayName: '',
    description: '',
    subject: '',
    category: 'notification',
    headerTitle: 'THE TRAVEL PLACE',
    headerSubtitle: '',
    headerIcon: 'mail',
    greeting: 'Hello!',
    mainContent: '',
    footerText: 'Thank you for choosing The Travel Place.',
    isActive: true,
    variables: [],
  })

  useEffect(() => {
    loadTemplates()
  }, [categoryFilter])

  const loadTemplates = async () => {
    try {
      setIsLoading(true)
      const params = categoryFilter !== 'all' ? { category: categoryFilter } : {}
      const data = await emailTemplateService.getAll(params)
      setTemplates(data)
    } catch (err: any) {
      setError(err.message || 'Failed to load email templates')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectTemplate = (template: EmailTemplate) => {
    setSelectedTemplate(template)
    setFormData({
      name: template.name,
      displayName: template.displayName,
      description: template.description || '',
      subject: template.subject,
      category: template.category,
      headerTitle: template.headerTitle,
      headerSubtitle: template.headerSubtitle || '',
      headerIcon: template.headerIcon,
      greeting: template.greeting,
      mainContent: template.mainContent,
      footerText: template.footerText,
      isActive: template.isActive,
      variables: template.variables || [],
    })
    setIsEditing(false)
    setIsCreating(false)
    setShowPreview(false)
  }

  const handleCreateNew = () => {
    setSelectedTemplate(null)
    setFormData({
      name: '',
      displayName: '',
      description: '',
      subject: '',
      category: 'notification',
      headerTitle: 'THE TRAVEL PLACE',
      headerSubtitle: '',
      headerIcon: 'mail',
      greeting: 'Hello!',
      mainContent: '',
      footerText: 'Thank you for choosing The Travel Place.',
      isActive: true,
      variables: [],
    })
    setIsCreating(true)
    setIsEditing(false)
    setShowPreview(false)
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      setError('')
      setSuccess('')

      if (isCreating) {
        await emailTemplateService.create(formData)
        setSuccess('Email template created successfully!')
      } else if (selectedTemplate) {
        await emailTemplateService.update(selectedTemplate._id, formData)
        setSuccess('Email template updated successfully!')
      }

      await loadTemplates()
      setIsEditing(false)
      setIsCreating(false)
    } catch (err: any) {
      setError(err.message || 'Failed to save email template')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this email template?')) return

    try {
      setError('')
      setSuccess('')
      await emailTemplateService.delete(id)
      setSuccess('Email template deleted successfully!')
      await loadTemplates()
      setSelectedTemplate(null)
    } catch (err: any) {
      setError(err.message || 'Failed to delete email template')
    }
  }

  const handlePreview = async () => {
    if (!selectedTemplate && !isCreating) return

    try {
      setError('')
      // Generate sample data from variables
      const sampleData: Record<string, any> = {}
      formData.variables?.forEach(v => {
        sampleData[v.name] = v.example || `[${v.name}]`
      })

      let html: string
      if (selectedTemplate && !isCreating) {
        html = await emailTemplateService.preview(selectedTemplate._id, sampleData)
      } else {
        // For new templates, we can't preview until saved
        setError('Please save the template first to preview it')
        return
      }

      setPreviewHtml(html)
      setShowPreview(true)
    } catch (err: any) {
      setError(err.message || 'Failed to generate preview')
    }
  }

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'booking', label: 'Booking' },
    { value: 'authentication', label: 'Authentication' },
    { value: 'notification', label: 'Notification' },
    { value: 'marketing', label: 'Marketing' },
  ]

  const icons = [
    'mail', 'flight', 'hotel', 'directions_car', 'shield', 'verified_user',
    'check_circle', 'lock_reset', 'celebration', 'notifications', 'campaign'
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Email Templates</h2>
          <p className="text-sm text-gray-600 mt-1">
            Manage email templates for bookings, notifications, and more
          </p>
        </div>
        <button
          onClick={handleCreateNew}
          className="px-4 py-2 bg-brand-red text-white rounded-lg hover:bg-brand-red-600 transition-colors"
        >
          Create New Template
        </button>
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Template List */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Category
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {templates.map(template => (
              <div
                key={template._id}
                onClick={() => handleSelectTemplate(template)}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedTemplate?._id === template._id
                    ? 'bg-brand-red text-white'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-sm">{template.displayName}</h3>
                    <p className={`text-xs mt-1 ${
                      selectedTemplate?._id === template._id ? 'text-white/80' : 'text-gray-500'
                    }`}>
                      {template.category}
                    </p>
                  </div>
                  {template.isSystem && (
                    <span className={`text-xs px-2 py-1 rounded ${
                      selectedTemplate?._id === template._id
                        ? 'bg-white/20 text-white'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      System
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Template Editor */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {!selectedTemplate && !isCreating ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <p>Select a template to edit or create a new one</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Action Buttons */}
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  {isCreating ? 'Create New Template' : 'Edit Template'}
                </h3>
                <div className="flex gap-2">
                  {!isCreating && !isEditing && (
                    <>
                      <button
                        onClick={handlePreview}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Preview
                      </button>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 bg-brand-red text-white rounded-lg hover:bg-brand-red-600 transition-colors"
                      >
                        Edit
                      </button>
                      {selectedTemplate && !selectedTemplate.isSystem && (
                        <button
                          onClick={() => handleDelete(selectedTemplate._id)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          Delete
                        </button>
                      )}
                    </>
                  )}
                  {(isEditing || isCreating) && (
                    <>
                      <button
                        onClick={() => {
                          setIsEditing(false)
                          setIsCreating(false)
                          if (selectedTemplate) {
                            handleSelectTemplate(selectedTemplate)
                          }
                        }}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-4 py-2 bg-brand-red text-white rounded-lg hover:bg-brand-red-600 transition-colors disabled:opacity-50"
                      >
                        {isSaving ? 'Saving...' : 'Save'}
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Template Name (ID)
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      disabled={!isCreating && selectedTemplate?.isSystem}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent disabled:bg-gray-100"
                      placeholder="e.g., flight_confirmation"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={formData.displayName}
                      onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                      disabled={!isEditing && !isCreating}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent disabled:bg-gray-100"
                      placeholder="e.g., Flight Booking Confirmation"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    disabled={!isEditing && !isCreating}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent disabled:bg-gray-100"
                    placeholder="Brief description of when this template is used"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Subject
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    disabled={!isEditing && !isCreating}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent disabled:bg-gray-100"
                    placeholder="Use {{variable}} for dynamic content"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                      disabled={!isEditing && !isCreating}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent disabled:bg-gray-100"
                    >
                      <option value="booking">Booking</option>
                      <option value="authentication">Authentication</option>
                      <option value="notification">Notification</option>
                      <option value="marketing">Marketing</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Header Icon
                    </label>
                    <select
                      value={formData.headerIcon}
                      onChange={(e) => setFormData({ ...formData, headerIcon: e.target.value })}
                      disabled={!isEditing && !isCreating}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent disabled:bg-gray-100"
                    >
                      {icons.map(icon => (
                        <option key={icon} value={icon}>{icon}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Header Title
                    </label>
                    <input
                      type="text"
                      value={formData.headerTitle}
                      onChange={(e) => setFormData({ ...formData, headerTitle: e.target.value })}
                      disabled={!isEditing && !isCreating}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Header Subtitle
                    </label>
                    <input
                      type="text"
                      value={formData.headerSubtitle}
                      onChange={(e) => setFormData({ ...formData, headerSubtitle: e.target.value })}
                      disabled={!isEditing && !isCreating}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent disabled:bg-gray-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Greeting
                  </label>
                  <input
                    type="text"
                    value={formData.greeting}
                    onChange={(e) => setFormData({ ...formData, greeting: e.target.value })}
                    disabled={!isEditing && !isCreating}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent disabled:bg-gray-100"
                    placeholder="Use {{variable}} for dynamic content"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Main Content (HTML)
                  </label>
                  <textarea
                    value={formData.mainContent}
                    onChange={(e) => setFormData({ ...formData, mainContent: e.target.value })}
                    disabled={!isEditing && !isCreating}
                    rows={12}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent disabled:bg-gray-100 font-mono text-sm"
                    placeholder="HTML content with {{variable}} placeholders"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Footer Text
                  </label>
                  <input
                    type="text"
                    value={formData.footerText}
                    onChange={(e) => setFormData({ ...formData, footerText: e.target.value })}
                    disabled={!isEditing && !isCreating}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent disabled:bg-gray-100"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    disabled={!isEditing && !isCreating}
                    className="h-4 w-4 text-brand-red focus:ring-brand-red border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                    Active (template will be used for emails)
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold">Email Preview</h3>
              <button
                onClick={() => setShowPreview(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4">
              <iframe
                srcDoc={previewHtml}
                className="w-full h-full border-0"
                style={{ minHeight: '600px' }}
                title="Email Preview"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
