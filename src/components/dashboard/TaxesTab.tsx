'use client'

import { useState, useEffect } from 'react'
import { pricingService, Tax } from '@/lib/services/pricing-service'

export default function TaxesTab() {
  const [taxes, setTaxes] = useState<Tax[]>([])
  const [loading, setLoading] = useState(true)

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

  if (loading) return <div className="text-center py-8">Loading...</div>

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">
        Tax management interface - Similar to Service Charges with tax-specific fields (rate, type, country, isInclusive)
      </p>
      
      {taxes.map(tax => (
        <div key={tax._id} className="border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-semibold">{tax.name}</h4>
              <p className="text-sm text-gray-600 mt-1">{tax.description}</p>
              <div className="flex gap-4 mt-2 text-sm text-gray-600">
                <span><strong>Rate:</strong> {tax.rate}%</span>
                <span><strong>Type:</strong> {tax.type}</span>
                <span><strong>Country:</strong> {tax.country}</span>
                <span><strong>{tax.isInclusive ? 'Inclusive' : 'Exclusive'}</strong></span>
              </div>
            </div>
          </div>
        </div>
      ))}
      
      {taxes.length === 0 && (
        <div className="text-center py-8 text-gray-500">No taxes configured</div>
      )}
    </div>
  )
}
