'use client'

import { useState, useEffect } from 'react'
import { pricingService, Tax } from '@/lib/services/pricing-service'

const SERVICE_OPTIONS = ['all', 'flights', 'hotels', 'car-hire', 'visa', 'insurance', 'packages']
const TAX_TYPES = ['VAT', 'GST', 'Sales Tax', 'Service Tax', 'Other']
const COUNTRIES = ['NG', 'US', 'UK', 'CA', 'AU', 'ZA', 'KE', 'GH']

const emptyForm = {
  name: '',
  description: '',
  rate: 0,
  type: 'VAT' as Tax['type'],
  country: 'NG',
  appliesTo: ['all'] as string[],
  isInclusive: false,
  isActive: true,
}

export default function TaxesTab() {
  const [taxes, setTaxes] = useState<Tax[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingTax, setEditingTax] = useState<Tax | null>(null)
  const [formData, setFormData] = useState({ ...emptyForm })

  useEffect(() => { loadTaxes() }, [])

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

  const toggleAppliesTo = (value: string) => {
    setFormData(prev => {
      const current = prev.appliesTo
      if (value === 'all') return { ...prev, appliesTo: ['all'] }
      const without = current.filter(v => v !== 'all' && v !== value)
      const next = current.includes(value) ? without : [...without, value]
      return { ...prev, appliesTo: next.length ? next : ['all'] }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.appliesTo.length) {
      alert('Please select at least one service this tax applies to.')
      return
    }
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
      appliesTo: tax.appliesTo?.length ? tax.appliesTo : ['all'],
      isInclusive: tax.isInclusive,
      isActive: tax.isActive,
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this tax?')) return
    try {
      await pricingService.deleteTax(id)
      loadTaxes()
    } catch (error: any) {
      alert(error.message || 'Failed to delete tax')
    }
  }

  const resetForm = () => {
    setFormData({ ...emptyForm })
    setEditingTax(null)
    setShowForm(false)
  }

  if (loading) return <div className="text-center py-8">Loading...</div>

  return (
    <div className="space-y-6">
      {!showForm && (
        <button onClick={() => setShowForm(true)} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
          + Add Tax
        </button>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg space-y-4">
          <h3 className="text-lg font-semibold">{editingTax ? 'Edit Tax' : 'New Tax'}</h3>

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
                onChange={(e) => setFormData({ ...formData, type: e.target.value as Tax['type'] })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                {TAX_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
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
                onChange={(e) => setFormData({ ...formData, rate: parseFloat(e.target.value) || 0 })}
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
                {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Applies To */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Applies To</label>
            <div className="flex flex-wrap gap-2">
              {SERVICE_OPTIONS.map(opt => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => toggleAppliesTo(opt)}
                  className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                    formData.appliesTo.includes(opt)
                      ? 'bg-red-600 text-white border-red-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-red-400'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-1">Select "all" to apply to every service type</p>
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

          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isInclusive}
                onChange={(e) => setFormData({ ...formData, isInclusive: e.target.checked })}
              />
              Tax is Inclusive (included in price)
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              />
              Active
            </label>
          </div>

          <div className="flex gap-2">
            <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
              {editingTax ? 'Update' : 'Create'}
            </button>
            <button type="button" onClick={resetForm} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {taxes.map(tax => (
          <div key={tax._id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-semibold text-gray-900">{tax.name}</h4>
                  <span className={`px-2 py-0.5 text-xs rounded-full ${tax.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                    {tax.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                {tax.description && <p className="text-sm text-gray-600 mt-1">{tax.description}</p>}
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-gray-600">
                  <span><strong>Rate:</strong> {tax.rate}%</span>
                  <span><strong>Type:</strong> {tax.type}</span>
                  <span><strong>Country:</strong> {tax.country}</span>
                  <span><strong>{tax.isInclusive ? 'Inclusive' : 'Exclusive'}</strong></span>
                  <span><strong>Applies to:</strong> {tax.appliesTo?.join(', ') || '—'}</span>
                </div>
              </div>
              <div className="flex gap-3 ml-4">
                <button onClick={() => handleEdit(tax)} className="text-blue-600 hover:text-blue-800 text-sm">Edit</button>
                <button onClick={() => handleDelete(tax._id)} className="text-red-600 hover:text-red-800 text-sm">Delete</button>
              </div>
            </div>
          </div>
        ))}
        {taxes.length === 0 && (
          <div className="text-center py-8 text-gray-500">No taxes configured yet</div>
        )}
      </div>
    </div>
  )
}
