'use client'

import { useState, useEffect } from 'react'
import { pricingService, ServiceCharge } from '@/lib/services/pricing-service'

export default function ServiceChargesTab() {
  const [charges, setCharges] = useState<ServiceCharge[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingCharge, setEditingCharge] = useState<ServiceCharge | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'percentage' as 'percentage' | 'fixed',
    value: 0,
    appliesTo: [] as string[],
    isActive: true,
    priority: 0
  })

  const serviceTypes = ['all', 'flights', 'hotels', 'car-hire', 'visa', 'insurance', 'packages']

  useEffect(() => {
    loadCharges()
  }, [])

  const loadCharges = async () => {
    try {
      setLoading(true)
      const response = await pricingService.getAllServiceCharges()
      setCharges(response.data.serviceCharges || [])
    } catch (error) {
      console.error('Error loading service charges:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingCharge) {
        await pricingService.updateServiceCharge(editingCharge._id, formData)
      } else {
        await pricingService.createServiceCharge(formData)
      }
      resetForm()
      loadCharges()
    } catch (error: any) {
      alert(error.message || 'Failed to save service charge')
    }
  }

  const handleEdit = (charge: ServiceCharge) => {
    setEditingCharge(charge)
    setFormData({
      name: charge.name,
      description: charge.description || '',
      type: charge.type,
      value: charge.value,
      appliesTo: charge.appliesTo,
      isActive: charge.isActive,
      priority: charge.priority
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service charge?')) return
    try {
      await pricingService.deleteServiceCharge(id)
      loadCharges()
    } catch (error: any) {
      alert(error.message || 'Failed to delete service charge')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      type: 'percentage',
      value: 0,
      appliesTo: [],
      isActive: true,
      priority: 0
    })
    setEditingCharge(null)
    setShowForm(false)
  }

  const toggleServiceType = (type: string) => {
    setFormData(prev => ({
      ...prev,
      appliesTo: prev.appliesTo.includes(type)
        ? prev.appliesTo.filter(t => t !== type)
        : [...prev.appliesTo, type]
    }))
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
          + Add Service Charge
        </button>
      )}

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg space-y-4">
          <h3 className="text-lg font-semibold">
            {editingCharge ? 'Edit Service Charge' : 'New Service Charge'}
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (₦)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Value {formData.type === 'percentage' ? '(%)' : '(₦)'}
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <input
                type="number"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              rows={2}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Applies To</label>
            <div className="flex flex-wrap gap-2">
              {serviceTypes.map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => toggleServiceType(type)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    formData.appliesTo.includes(type)
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="mr-2"
            />
            <label className="text-sm text-gray-700">Active</label>
          </div>

          <div className="flex gap-2">
            <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
              {editingCharge ? 'Update' : 'Create'}
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
        {charges.map(charge => (
          <div key={charge._id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-gray-900">{charge.name}</h4>
                  {charge.isActive ? (
                    <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">Active</span>
                  ) : (
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-800 text-xs rounded-full">Inactive</span>
                  )}
                </div>
                {charge.description && (
                  <p className="text-sm text-gray-600 mt-1">{charge.description}</p>
                )}
                <div className="flex gap-4 mt-2 text-sm">
                  <span className="text-gray-600">
                    <strong>Value:</strong> {charge.type === 'percentage' ? `${charge.value}%` : `₦${charge.value}`}
                  </span>
                  <span className="text-gray-600">
                    <strong>Applies to:</strong> {charge.appliesTo.join(', ')}
                  </span>
                  <span className="text-gray-600">
                    <strong>Priority:</strong> {charge.priority}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(charge)}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(charge._id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}

        {charges.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No service charges configured yet
          </div>
        )}
      </div>
    </div>
  )
}
