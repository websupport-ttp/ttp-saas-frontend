'use client';

import { useCurrency } from '@/contexts/CurrencyContext';
import { useState, useEffect } from 'react';

interface ServiceChargeItem {
  id: string;
  name: string;
  type: 'percentage' | 'fixed';
  value: number;
  amount: number;
}

interface DiscountItem {
  id: string;
  name: string;
  code?: string;
  type: string;
  value: number; // the % or fixed amount used
  amount: number;
}

interface TaxItem {
  id: string;
  name: string;
  type: string;
  rate: number;
  amount: number;
  isInclusive: boolean;
}

interface PriceBreakdownData {
  basePrice: number;
  serviceCharges: ServiceChargeItem[];
  taxes: TaxItem[];
  discounts: DiscountItem[];
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

const PERCENTAGE_TYPES = new Set(['percentage', 'role-based', 'provider-specific', 'provider-role-based']);

export default function PriceBreakdown({
  basePrice,
  serviceType,
  userRole = 'guest',
  discountCode,
  providerCode,
  country = 'NG',
  onPriceCalculated,
  showDetails = true,
}: PriceBreakdownProps) {
  const { formatAmount } = useCurrency();
  const [breakdown, setBreakdown] = useState<PriceBreakdownData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (basePrice > 0) calculatePrice();
  }, [basePrice, serviceType, userRole, discountCode, providerCode, country]);

  const calculatePrice = async () => {
    try {
      setLoading(true);
      setError(null);

      // Strip trailing /api/v1 to avoid double-path
      const base = (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1')
        .replace(/\/api\/v1\/?$/, '');

      const response = await fetch(`${base}/api/v1/pricing/calculate`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ basePrice, serviceType, userRole, discountCode, providerCode, country }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to calculate price');

      setBreakdown(data.data);
      onPriceCalculated?.(data.data);
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
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="h-6 bg-gray-200 rounded w-full" />
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

  if (!breakdown) return null;

  const hasDetails =
    breakdown.serviceCharges.length > 0 ||
    breakdown.discounts.length > 0 ||
    breakdown.taxes.length > 0;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 w-full">
      <div className="space-y-2 w-full">

        {/* Base Price */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Base Price</span>
          <span className="text-gray-900">{formatAmount(breakdown.basePrice)}</span>
        </div>

        {/* ── Collapsed summary rows (always visible) ── */}
        {!expanded && (
          <>
            {breakdown.totalServiceCharges > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Service Charges</span>
                <span className="text-gray-900">{formatAmount(breakdown.totalServiceCharges)}</span>
              </div>
            )}
            {breakdown.totalDiscounts > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-green-600">Discounts</span>
                <span className="text-green-600">-{formatAmount(breakdown.totalDiscounts)}</span>
              </div>
            )}
            {breakdown.totalTaxes > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Taxes &amp; Fees</span>
                <span className="text-gray-900">{formatAmount(breakdown.totalTaxes)}</span>
              </div>
            )}
          </>
        )}

        {/* ── Expanded detail rows ── */}
        {expanded && (
          <div className="space-y-1.5 border-l-2 border-gray-100 pl-3 mt-1">

            {/* Service charges */}
            {breakdown.serviceCharges.map((charge) => (
              <div key={charge.id} className="flex justify-between text-sm">
                <span className="text-gray-500">
                  {charge.name}
                  {charge.type === 'percentage' ? ` (${charge.value}%)` : ' (fixed)'}
                </span>
                <span className="text-gray-800">{formatAmount(charge.amount)}</span>
              </div>
            ))}

            {/* Discounts */}
            {breakdown.discounts.map((discount) => (
              <div key={discount.id} className="flex justify-between text-sm">
                <span className="text-green-600">
                  {discount.name}
                  {discount.code ? ` [${discount.code}]` : ''}
                  {PERCENTAGE_TYPES.has(discount.type) && discount.value > 0
                    ? ` (${discount.value}%)`
                    : discount.type === 'fixed'
                    ? ` (fixed)`
                    : ''}
                </span>
                <span className="text-green-600">-{formatAmount(discount.amount)}</span>
              </div>
            ))}

            {/* Taxes */}
            {breakdown.taxes.map((tax) => (
              <div key={tax.id} className="flex justify-between text-sm">
                <span className="text-gray-500">
                  {tax.name} ({tax.rate}%){tax.isInclusive ? ' incl.' : ''}
                </span>
                <span className="text-gray-800">{formatAmount(tax.amount)}</span>
              </div>
            ))}
          </div>
        )}

        {/* Show / Hide details toggle */}
        {showDetails && hasDetails && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 pt-1"
          >
            <svg
              className={`w-3.5 h-3.5 transition-transform ${expanded ? 'rotate-180' : ''}`}
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            {expanded ? 'Hide details' : 'Show details'}
          </button>
        )}

        {/* Total */}
        <div className="border-t border-gray-200 pt-2 mt-1">
          <div className="flex justify-between font-semibold text-base">
            <span className="text-gray-900">Total</span>
            <span className="text-gray-900">{formatAmount(breakdown.finalPrice)}</span>
          </div>
        </div>

      </div>
    </div>
  );
}
