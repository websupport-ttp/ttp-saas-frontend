'use client'

import React, { useState, useEffect } from 'react'
import { currencyService, Currency, CurrencyFormData } from '@/lib/services/currency-service'
import { useCurrency } from '@/contexts/CurrencyContext'
import { Plus, Edit2, Trash2, RefreshCw, X, Check, Loader2 } from 'lucide-react'

const CurrencyManagement: React.FC = () => {
  const { refreshCurrencies } = useCurrency()
  const [currencies, setCurrencies] = useState<Currency[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCurrency, setEditingCurrency] = useState<Currency | null>(null)
  const [isUpdatingRates, setIsUpdatingRates] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const [formData, setFormData] = useState<CurrencyFormData>({
    code: '',
    name: '',
    symbol: '',
    markup: 0,
    fallbackRate: 1,
    isActive: true,
  })

  useEffect(() => {
    fetchCurrencies()
  }, [])

  const fetchCurrencies = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await currencyService.getAllCurrencies()
      setCurrencies(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load currencies')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateRates = async () => {
    try {
      setIsUpdatingRates(true)
      setError(null)
      const result = await currencyService.updateRates()
      await fetchCurrencies()
      await refreshCurrencies()
      alert(`Rates updated successfully!\nUpdated: ${result.updated}\nFailed: ${result.failed}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update rates')
    } finally {
      setIsUpdatingRates(false)
    }
  }

  const handleOpenModal = (currency?: Currency) => {
    if (currency) {
      setEditingCurrency(currency)
      setFormData({
        code: currency.code,
        name: currency.name,
        symbol: currency.symbol,
        markup: currency.markup,
        fallbackRate: currency.fallbackRate || 1,
        isActive: currency.isActive,
        exchangeRate: currency.rate,
      })
    } else {
      setEditingCurrency(null)
      setFormData({
        code: '',
        name: '',
        symbol: '',
        markup: 0,
        fallbackRate: 1,
        isActive: true,
      })
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingCurrency(null)
    setFormData({
      code: '',
      name: '',
      symbol: '',
      markup: 0,
      fallbackRate: 1,
      isActive: true,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setError(null)
      if (editingCurrency) {
        await currencyService.updateCurrency(editingCurrency.code, formData)
      } else {
        await currencyService.createCurrency(formData)
      }
      await fetchCurrencies()
      await refreshCurrencies()
      handleCloseModal()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save currency')
    }
  }

  const handleDelete = async (code: string) => {
    if (deleteConfirm === code) {
      try {
        setError(null)
        await currencyService.deleteCurrency(code)
        await fetchCurrencies()
        await refreshCurrencies()
        setDeleteConfirm(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete currency')
      }
    } else {
      setDeleteConfirm(code)
      setTimeout(() => setDeleteConfirm(null), 3000)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Currency Management</h2>
        <div className="flex gap-3">
          <button
            onClick={handleUpdateRates}
            disabled={isUpdatingRates}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isUpdatingRates ? 'animate-spin' : ''}`} />
            Update Rates
          </button>
          <button
            onClick={() => handleOpenModal()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Currency
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Markup</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currencies.map((currency) => (
              <tr key={currency.code} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {currency.code}
                  {currency.isBaseCurrency && (
                    <span className="ml-2 text-xs text-blue-600">(Base)</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{currency.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{currency.symbol}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{currency.rate.toFixed(4)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{currency.markup}%</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${currency.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {currency.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {new Date(currency.lastUpdated).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => handleOpenModal(currency)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  {!currency.isBaseCurrency && (
                    <button
                      onClick={() => handleDelete(currency.code)}
                      className={`${deleteConfirm === currency.code ? 'text-red-600' : 'text-gray-600'} hover:text-red-900`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                {editingCurrency ? 'Edit Currency' : 'Add Currency'}
              </h3>
              <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
                  Currency Code
                </label>
                <input
                  type="text"
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  disabled={!!editingCurrency}
                  maxLength={3}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                  placeholder="USD"
                />
              </div>

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Currency Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="US Dollar"
                />
              </div>

              <div>
                <label htmlFor="symbol" className="block text-sm font-medium text-gray-700 mb-1">
                  Symbol
                </label>
                <input
                  type="text"
                  id="symbol"
                  value={formData.symbol}
                  onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="$"
                />
              </div>

              <div>
                <label htmlFor="markup" className="block text-sm font-medium text-gray-700 mb-1">
                  Markup (%)
                </label>
                <input
                  type="number"
                  id="markup"
                  value={formData.markup}
                  onChange={(e) => setFormData({ ...formData, markup: parseFloat(e.target.value) })}
                  min="0"
                  max="100"
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="fallbackRate" className="block text-sm font-medium text-gray-700 mb-1">
                  Fallback Rate
                </label>
                <input
                  type="number"
                  id="fallbackRate"
                  value={formData.fallbackRate}
                  onChange={(e) => setFormData({ ...formData, fallbackRate: parseFloat(e.target.value) })}
                  min="0"
                  step="0.0001"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {editingCurrency && (
                <div>
                  <label htmlFor="exchangeRate" className="block text-sm font-medium text-gray-700 mb-1">
                    Exchange Rate (Optional Override)
                  </label>
                  <input
                    type="number"
                    id="exchangeRate"
                    value={formData.exchangeRate || ''}
                    onChange={(e) => setFormData({ ...formData, exchangeRate: e.target.value ? parseFloat(e.target.value) : undefined })}
                    min="0"
                    step="0.0001"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              )}

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                  Active
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  {editingCurrency ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default CurrencyManagement
