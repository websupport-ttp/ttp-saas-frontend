'use client'

import { useState, useEffect } from 'react'
import { pricingService, Discount } from '@/lib/services/pricing-service'

type DiscountType = 'percentage' | 'fixed' | 'role-based' | 'provider-specific' | 'provider-role-based'

const EMPTY_ROLE_DISCOUNTS = {
  customer: 0, business: 0, staff: 0,
  vendor: 0, agent: 0, manager: 0, executive: 0, admin: 0,
}

const EMPTY_FORM = {
  name: '',
  description: '',
  code: '',
  type: 'percentage' as DiscountType,
  value: 0,
  roleDiscounts: { ...EMPTY_ROLE_DISCOUNTS },
  provider: { type: '', name: '', code: '' },
  appliesTo: [] as string[],
  minPurchaseAmount: 0,
  maxDiscountAmount: undefined as number | undefined,
  usageLimit: undefined as number | undefined,
  validFrom: '',
  validUntil: '',
  isActive: true,
  isStackable: false,
  priority: 0,
}

const ALL_ROLES = [
  'customer', 'business', 'staff', 'vendor',
  'agent', 'manager', 'executive', 'admin',
] as const
type RoleKey = typeof ALL_ROLES[number]

const SERVICE_TYPES = ['all', 'flights', 'hotels', 'car-hire', 'visa', 'insurance', 'packages']
const PROVIDER_TYPES = ['airline', 'hotel', 'car-rental', 'insurance']

const TYPE_LABELS: Record<DiscountType, string> = {
  percentage: 'Percentage (flat %)',
  fixed: 'Fixed Amount',
  'role-based': 'Role-Based (different % per user type)',
  'provider-specific': 'Provider-Specific (flat % from provider)',
  'provider-role-based': 'Provider + Role-Based (provider deal, split by user type)',
}

const needsProvider = (t: DiscountType) => t === 'provider-specific' || t === 'provider-role-based'
const needsRoles = (t: DiscountType) => t === 'role-based' || t === 'provider-role-based'
const needsValue = (t: DiscountType) => t === 'percentage' || t === 'fixed' || t === 'provider-specific'

function valueLabel(t: DiscountType) {
  if (t === 'fixed') return 'Fixed Amount'
  if (t === 'provider-specific') return 'Provider Discount (%)'
  return 'Value (%)'
}

function discountSummary(d: Discount): string {
  if (d.type === 'role-based' || d.type === 'provider-role-based') {
    const rd = d.roleDiscounts
    if (!rd) return 'Role-based'
    // Show only roles that have a non-zero value
    const parts = ALL_ROLES
      .filter(r => (rd[r] ?? 0) > 0)
      .map(r => `${r.charAt(0).toUpperCase() + r.slice(1)} ${rd[r]}%`)
    return parts.length > 0 ? parts.join(' / ') : 'Role-based (all 0%)'
  }
  if (d.type === 'fixed') return `₦${d.value}`
  return `${d.value}%`
}

export default function DiscountsTab() {
  const [discounts, setDiscounts] = useState<Discount[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null)
  const [formData, setFormData] = useState({ ...EMPTY_FORM })

  useEffect(() => { loadDiscounts() }, [])

  const loadDiscounts = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await pricingService.getAllDiscounts()
      if (response.error) setError(response.error)
      setDiscounts(response.data.discounts || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const payload: any = {
        name: formData.name,
        description: formData.description,
        type: formData.type,
        appliesTo: formData.appliesTo,
        minPurchaseAmount: formData.minPurchaseAmount,
        isActive: formData.isActive,
        isStackable: formData.isStackable,
        priority: formData.priority,
      }
      if (formData.maxDiscountAmount) payload.maxDiscountAmount = formData.maxDiscountAmount
      if (formData.usageLimit) payload.usageLimit = formData.usageLimit
      if (formData.validFrom) payload.validFrom = formData.validFrom
      if (formData.validUntil) payload.validUntil = formData.validUntil
      if (needsValue(formData.type)) {
        payload.value = formData.value
        if (formData.code) payload.code = formData.code
      }
      if (needsProvider(formData.type)) payload.provider = formData.provider
      if (needsRoles(formData.type)) payload.roleDiscounts = formData.roleDiscounts

      if (editingDiscount) {
        await pricingService.updateDiscount(editingDiscount._id, payload)
      } else {
        await pricingService.createDiscount(payload)
      }
      resetForm()
      loadDiscounts()
    } catch (err: any) {
      alert(err.message || 'Failed to save discount')
    }
  }

  const handleEdit = (d: Discount) => {
    setEditingDiscount(d)
    setFormData({
      name: d.name,
      description: d.description || '',
      code: d.code || '',
      type: d.type,
      value: d.value || 0,
      roleDiscounts: { ...EMPTY_ROLE_DISCOUNTS, ...d.roleDiscounts },
      provider: d.provider || { type: '', name: '', code: '' },
      appliesTo: d.appliesTo,
      minPurchaseAmount: d.minPurchaseAmount || 0,
      maxDiscountAmount: d.maxDiscountAmount,
      usageLimit: d.usageLimit,
      validFrom: d.validFrom ? new Date(d.validFrom).toISOString().split('T')[0] : '',
      validUntil: d.validUntil ? new Date(d.validUntil).toISOString().split('T')[0] : '',
      isActive: d.isActive,
      isStackable: d.isStackable,
      priority: d.priority,
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this discount?')) return
    try {
      await pricingService.deleteDiscount(id)
      loadDiscounts()
    } catch (err: any) {
      alert(err.message || 'Failed to delete discount')
    }
  }

  const resetForm = () => {
    setEditingDiscount(null)
    setShowForm(false)
    setFormData({ ...EMPTY_FORM, roleDiscounts: { ...EMPTY_ROLE_DISCOUNTS }, provider: { type: '', name: '', code: '' }, appliesTo: [] })
  }

  const set = (field: string, value: any) => setFormData(prev => ({ ...prev, [field]: value }))

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Discounts</h3>
          <p className="text-sm text-gray-600">Manage discount codes and promotions</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(!showForm) }}
          className="px-4 py-2 bg-brand-red text-white rounded-lg hover:bg-brand-red-dark transition-colors"
        >
          {showForm ? 'Cancel' : 'Add Discount'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6 space-y-5">
          <h4 className="font-semibold text-gray-800">{editingDiscount ? 'Edit Discount' : 'New Discount'}</h4>

          {/* Name + Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input
                type="text" required value={formData.name}
                onChange={e => set('name', e.target.value)}
                placeholder="e.g. Lufthansa Partner Discount"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
              <select
                value={formData.type}
                onChange={e => set('type', e.target.value as DiscountType)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
              >
                {(Object.entries(TYPE_LABELS) as [DiscountType, string][]).map(([val, label]) => (
                  <option key={val} value={val}>{label}</option>
                ))}
              </select>
              {formData.type === 'provider-role-based' && (
                <p className="text-xs text-gray-500 mt-1">
                  Use this when a provider (e.g. Lufthansa) gives you a deal and you want to pass different amounts to different user types.
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description} rows={2}
              onChange={e => set('description', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
            />
          </div>

          {/* Provider fields */}
          {needsProvider(formData.type) && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
              <p className="text-sm font-medium text-blue-800">Provider Details</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Provider Type</label>
                  <select
                    value={formData.provider.type}
                    onChange={e => set('provider', { ...formData.provider, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                  >
                    <option value="">Select type</option>
                    {PROVIDER_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Provider Name</label>
                  <input
                    type="text" value={formData.provider.name}
                    onChange={e => set('provider', { ...formData.provider, name: e.target.value })}
                    placeholder="e.g. Lufthansa"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Provider Code</label>
                  <input
                    type="text" value={formData.provider.code}
                    onChange={e => set('provider', { ...formData.provider, code: e.target.value.toUpperCase() })}
                    placeholder="e.g. LH"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Flat value */}
          {needsValue(formData.type) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{valueLabel(formData.type)} *</label>
                <input
                  type="number" required min={0} step="0.01" value={formData.value}
                  onChange={e => set('value', parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Discount Code (optional)</label>
                <input
                  type="text" value={formData.code}
                  onChange={e => set('code', e.target.value.toUpperCase())}
                  placeholder="e.g. SUMMER10"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                />
              </div>
            </div>
          )}

          {/* Per-role amounts */}
          {needsRoles(formData.type) && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-3">
              <div>
                <p className="text-sm font-medium text-amber-800">Discount % per User Type</p>
                {formData.type === 'provider-role-based' && (
                  <p className="text-xs text-amber-700 mt-0.5">
                    Set how much of the provider deal each user type receives. E.g. provider gives 15% — pass 5% to regular users, 10% to agents, 15% to business.
                  </p>
                )}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {ALL_ROLES.map(role => (
                  <div key={role}>
                    <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{role} (%)</label>
                    <input
                      type="number" min={0} max={100} step="0.1"
                      value={formData.roleDiscounts[role]}
                      onChange={e => set('roleDiscounts', { ...formData.roleDiscounts, [role]: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Applies To */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Applies To *</label>
            <div className="flex flex-wrap gap-3">
              {SERVICE_TYPES.map(type => (
                <label key={type} className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.appliesTo.includes(type)}
                    onChange={e => set('appliesTo', e.target.checked
                      ? [...formData.appliesTo, type]
                      : formData.appliesTo.filter(t => t !== type)
                    )}
                  />
                  <span className="text-sm capitalize">{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Limits + dates */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Purchase</label>
              <input type="number" min={0} value={formData.minPurchaseAmount}
                onChange={e => set('minPurchaseAmount', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Discount</label>
              <input type="number" min={0} value={formData.maxDiscountAmount || ''}
                onChange={e => set('maxDiscountAmount', e.target.value ? parseFloat(e.target.value) : undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Usage Limit</label>
              <input type="number" min={0} value={formData.usageLimit || ''}
                onChange={e => set('usageLimit', e.target.value ? parseInt(e.target.value) : undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <input type="number" min={0} value={formData.priority}
                onChange={e => set('priority', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Valid From</label>
              <input type="date" value={formData.validFrom}
                onChange={e => set('validFrom', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Valid Until</label>
              <input type="date" value={formData.validUntil}
                onChange={e => set('validUntil', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={formData.isActive}
                onChange={e => set('isActive', e.target.checked)} />
              <span className="text-sm font-medium text-gray-700">Active</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={formData.isStackable}
                onChange={e => set('isStackable', e.target.checked)} />
              <span className="text-sm font-medium text-gray-700">Stackable with other discounts</span>
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={resetForm}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button type="submit"
              className="px-4 py-2 bg-brand-red text-white rounded-lg hover:bg-brand-red-dark transition-colors">
              {editingDiscount ? 'Update' : 'Create'} Discount
            </button>
          </div>
        </form>
      )}

      {/* List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-600">Loading discounts...</div>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="text-red-600 font-medium">Failed to load discounts</p>
            <p className="text-sm text-gray-500 mt-1">{error}</p>
            <button onClick={loadDiscounts} className="mt-3 text-sm text-brand-blue underline">Retry</button>
          </div>
        ) : discounts.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No discounts found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {discounts.map(discount => (
                  <tr key={discount._id}>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{discount.name}</div>
                      {discount.description && <div className="text-xs text-gray-500">{discount.description}</div>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900 capitalize">{discount.type.replace(/-/g, ' ')}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{discountSummary(discount)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {discount.provider?.name
                          ? `${discount.provider.name} (${discount.provider.code})`
                          : '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{discount.code || '—'}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        discount.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {discount.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button onClick={() => handleEdit(discount)}
                        className="text-brand-blue hover:text-brand-blue-800 mr-3">Edit</button>
                      <button onClick={() => handleDelete(discount._id)}
                        className="text-red-600 hover:text-red-800">Delete</button>
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
