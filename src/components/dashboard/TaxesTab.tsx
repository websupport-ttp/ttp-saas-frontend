'use client'

import { useState, useEffect } from 'react'
import { pricingService, Tax } from '@/lib/services/pricing-service'

// Tax management with full CRUD functionality
export default function TaxesTab() {
  const [taxes, setTaxes] = useState<Tax[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingTax, setEditingTax] = useState<Tax | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    rate: 0,
    type: 'VAT' as 'VAT' | 'GST' | 'Sales Tax' | 'Service Tax' | 'Other',
    country: 'NG',
    isInclusive: false,
    isActive: true
  })

  const taxTypes = ['VAT', 'GST', 'Sales Tax', 'Service Tax', 'Other']
  const countries = ['NG', 'US', 'UK', 'CA', 'AU', 'ZA', 'KE', 'GH']

  useEffect(() => {
    loadTaxes()
  }, [])

  const loadTaxes = async () => {
    try {
      setLoading(true)
      const response = await pricingService.getAllTaxes()
      setTaxes(response.data.taxes || [])
    } catch (error) {
      console.error('Error loading taxes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingTax) {
        await pricingService.updateTax(editingTax._id, formData)
      } else {
        await pricingService.createTax(formData)
      }
      resetForm()
      loadTaxes()
    } catch (error: any) {
      alert(error.message || 'Failed to save tax')
    }
  }

  const handleEdit = (tax: Tax) => {
    setEditingTax(tax)
    setFormData({
      name: tax.name,
      description: tax.description || '',
      rate: tax.rate,
      type: tax.type,
      country: tax.country,
      isInclusive: tax.isInclusive,
      isActive: tax.isActive
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this tax?')) return
    try {
      await pricingService.deleteTax(id)
      loadTaxes()
    } catch (error: any) {
      alert(error.message || 'Failed to delete tax')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      rate: 0,
      type: 'VAT',
      country: 'NG',
      isInclusive: false,
      isActive: true
    })
    setEditingTax(null)
    setShowForm(false)
  }

  if (loading) {
    return <div className="text-center py-8">Loading...</div>
  }

  return (
    <div className="space-y-6">
      {/* Add Button */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
        >
          + Add Tax
        </button>
      )}

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg space-y-4">
          <h3 className="text-lg font-semibold">
            {editingTax ? 'Edit Tax' : 'New Tax'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="e.g., VAT"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as 'VAT' | 'GST' | 'Sales Tax' | 'Service Tax' | 'Other' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                {taxTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rate (%)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={formData.rate}
                onChange={(e) => setFormData({ ...formData, rate: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
              <select
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                {countries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              rows={2}
              placeholder="Optional description"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isInclusive}
                onChange={(e) => setFormData({ ...formData, isInclusive: e.target.checked })}
                className="mr-2"
                id="isInclusive"
              />
              <label htmlFor="isInclusive" className="text-sm text-gray-700">
                Tax is Inclusive (included in price)
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="mr-2"
                id="isActive"
              />
              <label htmlFor="isActive" className="text-sm text-gray-700">
                Active
              </label>
            </div>
          </div>

          <div className="flex gap-2">
            <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
              {editingTax ? 'Update' : 'Create'}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* List */}
      <div className="space-y-4">
        {taxes.map(tax => (
          <div key={tax._id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-gray-900">{tax.name}</h4>
                  {tax.isActive ? (
                    <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">Active</span>
                  ) : (
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-800 text-xs rounded-full">Inactive</span>
                  )}
                </div>
                {tax.description && (
                  <p className="text-sm text-gray-600 mt-1">{tax.description}</p>
                )}
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm">
                  <span className="text-gray-600">
                    <strong>Rate:</strong> {tax.rate}%
                  </span>
                  <span className="text-gray-600">
                    <strong>Type:</strong> {tax.type}
                  </span>
                  <span className="text-gray-600">
                    <strong>Country:</strong> {tax.country}
                  </span>
                  <span className="text-gray-600">
                    <strong>{tax.isInclusive ? 'Inclusive' : 'Exclusive'}</strong>
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(tax)}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(tax._id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}

        {taxes.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No taxes configured yet
          </div>
        )}
      </div>
    </div>
  )
}
