'use client';

import { useCurrency } from '@/contexts/CurrencyContext';
import { useState, useEffect } from 'react';

interface PriceBreakdownItem {
  id: string;
  name: string;
  type: string;
  value: number;
  amount: number;
}

interface PriceBreakdownData {
  basePrice: number;
  serviceCharges: PriceBreakdownItem[];
  taxes: PriceBreakdownItem[];
  discounts: PriceBreakdownItem[];
  subtotal: number;
  totalServiceCharges: number;
  totalTaxes: number;
  totalDiscounts: number;
  finalPrice: number;
}

interface PriceBreakdownProps {
  basePrice: number;
  serviceType: string;
  userRole?: string;
  discountCode?: string;
  providerCode?: string;
  country?: string;
  onPriceCalculated?: (breakdown: PriceBreakdownData) => void;
  showDetails?: boolean;
}

export default function PriceBreakdown({
  basePrice,
  serviceType,
  userRole = 'user',
  discountCode,
  providerCode,
  country = 'NG',
  onPriceCalculated,
  showDetails = true
}: PriceBreakdownProps) {
  const { formatAmount } = useCurrency();
  const [breakdown, setBreakdown] = useState<PriceBreakdownData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    calculatePrice();
  }, [basePrice, serviceType, userRole, discountCode, providerCode, country]);

  const calculatePrice = async () => {
    try {
      setLoading(true);
      setError(null);

      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
      const response = await fetch(`${API_BASE_URL}/pricing/calculate`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          basePrice,
          serviceType,
          userRole,
          discountCode,
          providerCode,
          country
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to calculate price');
      }

      setBreakdown(data.data);
      if (onPriceCalculated) {
        onPriceCalculated(data.data);
      }
    } catch (err: any) {
      setError(err.message);
      console.error('Price calculation error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-6 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-sm text-red-600">Error calculating price: {error}</p>
      </div>
    );
  }

  if (!breakdown) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 w-full">
      <div className="space-y-3 w-full">
        {/* Base Price */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Base Price</span>
          <span className="text-gray-900">{formatAmount(breakdown.basePrice)}</span>
        </div>

        {/* Service Charges */}
        {breakdown.serviceCharges.length > 0 && (
          <>
            {showDetails && expanded ? (
              breakdown.serviceCharges.map((charge) => (
                <div key={charge.id} className="flex justify-between text-sm pl-4">
                  <span className="text-gray-600">
                    {charge.name}
                    {charge.type === 'percentage' && ` (${charge.value}%)`}
                  </span>
                  <span className="text-gray-900">{formatAmount(charge.amount)}</span>
                </div>
              ))
            ) : (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Service Charges</span>
                <span className="text-gray-900">{formatAmount(breakdown.totalServiceCharges)}</span>
              </div>
            )}
          </>
        )}

        {/* Discounts */}
        {breakdown.discounts.length > 0 && (
          <>
            {showDetails && expanded ? (
              breakdown.discounts.map((discount) => (
                <div key={discount.id} className="flex justify-between text-sm pl-4">
                  <span className="text-green-600">
                    {discount.name}
                    {discount.type === 'percentage' && ` (${discount.value}%)`}
                  </span>
                  <span className="text-green-600">-{formatAmount(discount.amount)}</span>
                </div>
              ))
            ) : (
              <div className="flex justify-between text-sm">
                <span className="text-green-600">Discounts</span>
                <span className="text-green-600">-{formatAmount(breakdown.totalDiscounts)}</span>
              </div>
            )}
          </>
        )}

        {/* Taxes */}
        {breakdown.taxes.length > 0 && (
          <>
            {showDetails && expanded ? (
              breakdown.taxes.map((tax) => (
                <div key={tax.id} className="flex justify-between text-sm pl-4">
                  <span className="text-gray-600">
                    {tax.name} ({tax.value}%)
                  </span>
                  <span className="text-gray-900">{formatAmount(tax.amount)}</span>
                </div>
              ))
            ) : (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Taxes & Fees</span>
                <span className="text-gray-900">{formatAmount(breakdown.totalTaxes)}</span>
              </div>
            )}
          </>
        )}

        {/* Toggle Details Button */}
        {showDetails && (breakdown.serviceCharges.length > 0 || breakdown.taxes.length > 0 || breakdown.discounts.length > 0) && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-brand-blue hover:text-brand-blue-800 flex items-center"
          >
            {expanded ? 'Hide' : 'Show'} details
            <svg
              className={`w-4 h-4 ml-1 transform transition-transform ${expanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        )}

        {/* Total */}
        <div className="border-t border-gray-200 pt-3">
          <div className="flex justify-between font-semibold text-lg">
            <span className="text-gray-900">Total</span>
            <span className="text-gray-900">{formatAmount(breakdown.finalPrice)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
