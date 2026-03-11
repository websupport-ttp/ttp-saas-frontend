'use client'

import { useState, useEffect } from 'react'
import { pricingService, Discount } from '@/lib/services/pricing-service'

export default function DiscountsTab() {
  const [discounts, setDiscounts] = useState<Discount[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    code: '',
    type: 'percentage' as 'percentage' | 'fixed' | 'role-based' | 'provider-specific',
    value: 0,
    roleDiscounts: {
      user: 0,
      staff: 10,
      agent: 15,
      business: 20
    },
    provider: {
      type: '',
      name: '',
      code: ''
    },
    appliesTo: [] as string[],
    minPurchaseAmount: 0,
    maxDiscountAmount: undefined as number | undefined,
    usageLimit: undefined as number | undefined,
    validFrom: '',
    validUntil: '',
    isActive: true,
    isStackable: false,
    priority: 0
  })

  const serviceTypes = ['all', 'flights', 'hotels', 'car-hire', 'visa', 'insurance', 'packages']
  const providerTypes = ['airline', 'hotel', 'car-rental', 'insurance']

  useEffect(() => {
    loadDiscounts()
  }, [])

  const loadDiscounts = async () => {
    try {
      setLoading(true)
      const response = await pricingService.getAllDiscounts()
      setDiscounts(response.data.discounts || [])
    } catch (error) {
      console.error('Error loading discounts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const submitData: any = { ...formData }
      
      // Clean up data based on type
      if (formData.type !== 'role-based') {
        delete submitData.roleDiscounts
      }
      if (formData.type !== 'provider-specific') {
        delete submitData.provider
      }
      if (formData.type === 'role-based' || formData.type === 'provider-specific') {
        delete submitData.value
        delete submitData.code
      }
      
      // Remove empty optional fields
      if (!submitData.maxDiscountAmount) delete submitData.maxDiscountAmount
      if (!submitData.usageLimit) delete submitData.usageLimit
      if (!submitData.validFrom) delete submitData.validFrom
      if (!submitData.validUntil) delete submitData.validUntil

      if (editingDiscount) {
        await pricingService.updateDiscount(editingDiscount._id, submitData)
      } else {
        await pricingService.createDiscount(submitData)
      }
      resetForm()
      loadDiscounts()
    } catch (error: any) {
      alert(error.message || 'Failed to save discount')
    }
  }

  const handleEdit = (discount: Discount) => {
    setEditingDiscount(discount)
    setFormData({
      name: discount.name,
      description: discount.description || '',
      code: discount.code || '',
      type: discount.type,
      value: discount.value || 0,
      roleDiscounts: discount.roleDiscounts || { user: 0, staff: 10, agent: 15, business: 20 },
      provider: discount.provider || { type: '', name: '', code: '' },
      appliesTo: discount.appliesTo,
      minPurchaseAmount: discount.minPurchaseAmount || 0,
      maxDiscountAmount: discount.maxDiscountAmount,
      usageLimit: discount.usageLimit,
      validFrom: discount.validFrom ? new Date(discount.validFrom).toISOString().split('T')[0] : '',
      validUntil: discount.validUntil ? new Date(discount.validUntil).toISOString().split('T')[0] : '',
      isActive: discount.isActive,
      isStackable: discount.isStackable,
      priority: discount.priority
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this discount?')) return
    try {
      await pricingService.deleteDiscount(id)
      loadDiscounts()
    } catch (error: any) {
      alert(error.message || 'Failed to delete discount')
    }
  }

  const resetForm = () => {
    setEditingDiscount(null)
    setShowForm(false)
    setFormData({
      name: '',
      description: '',
      code: '',
      type: 'percentage',
      value: 0,
      roleDiscounts: {
        user: 0,
        staff: 10,
        agent: 15,
        business: 20
      },
      provider: {
        type: '',
        name: '',
        code: ''
      },
      appliesTo: [],
      minPurchaseAmount: 0,
      maxDiscountAmount: undefined,
      usageLimit: undefined,
      validFrom: '',
      validUntil: '',
      isActive: true,
      isStackable: false,
      priority: 0
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Discounts</h3>
          <p className="text-sm text-gray-600">Manage discount codes and promotions</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-brand-red text-white rounded-lg hover:bg-brand-red-dark transition-colors"
        >
          {showForm ? 'Cancel' : 'Add Discount'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
              >
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed Amount</option>
                <option value="role-based">Role-Based</option>
                <option value="provider-specific">Provider-Specific</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
              rows={2}
            />
          </div>

          {(formData.type === 'percentage' || formData.type === 'fixed') && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                  placeholder="e.g., SUMMER10"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Value * {formData.type === 'percentage' ? '(%)' : '(Amount)'}
                </label>
                <input
                  type="number"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>
          )}

          {formData.type === 'role-based' && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">User (%)</label>
                <input
                  type="number"
                  value={formData.roleDiscounts.user}
                  onChange={(e) => setFormData({
                    ...formData,
                    roleDiscounts: { ...formData.roleDiscounts, user: parseFloat(e.target.value) }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                  min="0"
                  max="100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Staff (%)</label>
                <input
                  type="number"
                  value={formData.roleDiscounts.staff}
                  onChange={(e) => setFormData({
                    ...formData,
                    roleDiscounts: { ...formData.roleDiscounts, staff: parseFloat(e.target.value) }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                  min="0"
                  max="100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Agent (%)</label>
                <input
                  type="number"
                  value={formData.roleDiscounts.agent}
                  onChange={(e) => setFormData({
                    ...formData,
                    roleDiscounts: { ...formData.roleDiscounts, agent: parseFloat(e.target.value) }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                  min="0"
                  max="100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Business (%)</label>
                <input
                  type="number"
                  value={formData.roleDiscounts.business}
                  onChange={(e) => setFormData({
                    ...formData,
                    roleDiscounts: { ...formData.roleDiscounts, business: parseFloat(e.target.value) }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                  min="0"
                  max="100"
                />
              </div>
            </div>
          )}

          {formData.type === 'provider-specific' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Provider Type</label>
                <select
                  value={formData.provider.type}
                  onChange={(e) => setFormData({
                    ...formData,
                    provider: { ...formData.provider, type: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                >
                  <option value="">Select type</option>
                  {providerTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Provider Name</label>
                <input
                  type="text"
                  value={formData.provider.name}
                  onChange={(e) => setFormData({
                    ...formData,
                    provider: { ...formData.provider, name: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Provider Code</label>
                <input
                  type="text"
                  value={formData.provider.code}
                  onChange={(e) => setFormData({
                    ...formData,
                    provider: { ...formData.provider, code: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Applies To *</label>
            <div className="flex flex-wrap gap-2">
              {serviceTypes.map(type => (
                <label key={type} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.appliesTo.includes(type)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({ ...formData, appliesTo: [...formData.appliesTo, type] })
                      } else {
                        setFormData({ ...formData, appliesTo: formData.appliesTo.filter(t => t !== type) })
                      }
                    }}
                    className="mr-2"
                  />
                  <span className="text-sm capitalize">{type}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Purchase Amount</label>
              <input
                type="number"
                value={formData.minPurchaseAmount}
                onChange={(e) => setFormData({ ...formData, minPurchaseAmount: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Discount Amount</label>
              <input
                type="number"
                value={formData.maxDiscountAmount || ''}
                onChange={(e) => setFormData({ ...formData, maxDiscountAmount: e.target.value ? parseFloat(e.target.value) : undefined })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                min="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Usage Limit</label>
              <input
                type="number"
                value={formData.usageLimit || ''}
                onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value ? parseInt(e.target.value) : undefined })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Valid From</label>
              <input
                type="date"
                value={formData.validFrom}
                onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Valid Until</label>
              <input
                type="date"
                value={formData.validUntil}
                onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <input
                type="number"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                min="0"
              />
            </div>

            <div className="flex items-center">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="mr-2"
                />
                <span className="text-sm font-medium text-gray-700">Active</span>
              </label>
            </div>

            <div className="flex items-center">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isStackable}
                  onChange={(e) => setFormData({ ...formData, isStackable: e.target.checked })}
                  className="mr-2"
                />
                <span className="text-sm font-medium text-gray-700">Stackable</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-brand-red text-white rounded-lg hover:bg-brand-red-dark transition-colors"
            >
              {editingDiscount ? 'Update' : 'Create'} Discount
            </button>
          </div>
        </form>
      )}

      {/* Discounts List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-600">Loading discounts...</div>
        ) : discounts.length === 0 ? (
          <div className="p-8 text-center text-gray-600">No discounts found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {discounts.map((discount) => (
                  <tr key={discount._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{discount.name}</div>
                      {discount.description && (
                        <div className="text-sm text-gray-500">{discount.description}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900 capitalize">{discount.type}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {discount.type === 'percentage' && `${discount.value}%`}
                        {discount.type === 'fixed' && `$${discount.value}`}
                        {discount.type === 'role-based' && 'Role-based'}
                        {discount.type === 'provider-specific' && 'Provider'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{discount.code || '-'}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        discount.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {discount.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleEdit(discount)}
                        className="text-brand-blue hover:text-brand-blue-800 mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(discount._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}