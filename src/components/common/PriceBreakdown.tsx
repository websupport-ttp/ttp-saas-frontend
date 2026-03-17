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
  value: number;
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

const PERCENTAGE_TYPES = new Set([
  'percentage', 'role-based', 'provider-specific', 'provider-role-based',
]);

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
    if (basePrice > 0) fetchBreakdown();
  }, [basePrice, serviceType, userRole, discountCode, providerCode, country]);

  const fetchBreakdown = async () => {
    try {
      setLoading(true);
      setError(null);

      const rawBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1';
      const base = rawBase.replace(/\/api\/v1\/?$/, '');

      const res = await fetch(`${base}/api/v1/pricing/calculate`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ basePrice, serviceType, userRole, discountCode, providerCode, country }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to calculate price');

      setBreakdown(json.data);
      onPriceCalculated?.(json.data);
    } catch (err: any) {
      setError(err.message);
      console.error('PriceBreakdown error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="h-6 bg-gray-200 rounded w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-sm text-red-600">Price calculation error: {error}</p>
        <button onClick={fetchBreakdown} className="mt-2 text-xs text-red-700 underline">Retry</button>
      </div>
    );
  }

  if (!breakdown) return null;

  const hasDetails =
    breakdown.serviceCharges.length > 0 ||
    breakdown.discounts.length > 0 ||
    breakdown.taxes.length > 0;

  // Helper row
  const Row = ({
    label, value, sub, green, indent,
  }: {
    label: string; value: string; sub?: string; green?: boolean; indent?: boolean;
  }) => (
    <div className={`flex justify-between items-baseline text-sm ${indent ? 'pl-3' : ''}`}>
      <span className={`${green ? 'text-green-600' : 'text-gray-600'} ${indent ? 'text-xs' : ''}`}>
        {label}{sub ? <span className="text-gray-400 ml-1">{sub}</span> : null}
      </span>
      <span className={`${green ? 'text-green-600' : 'text-gray-900'} font-medium tabular-nums`}>
        {value}
      </span>
    </div>
  );

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 w-full space-y-2">

      {/* Base price — always shown */}
      <Row label="Base Price" value={formatAmount(breakdown.basePrice)} />

      {/* ── Collapsed: summary totals only ── */}
      {!expanded && (
        <>
          {breakdown.totalServiceCharges > 0 && (
            <Row label="Service Charges" value={formatAmount(breakdown.totalServiceCharges)} />
          )}
          {breakdown.totalDiscounts > 0 && (
            <Row label="Discounts" value={`-${formatAmount(breakdown.totalDiscounts)}`} green />
          )}
          {breakdown.totalTaxes > 0 && (
            <Row label="Taxes & Fees" value={formatAmount(breakdown.totalTaxes)} />
          )}
        </>
      )}

      {/* ── Expanded: each line item ── */}
      {expanded && (
        <div className="space-y-2">

          {/* Service charges */}
          {breakdown.serviceCharges.length > 0 && (
            <div className="space-y-1">
              <div className="flex justify-between text-sm font-medium text-gray-700 border-t border-gray-100 pt-1">
                <span>Service Charges</span>
                <span className="tabular-nums">{formatAmount(breakdown.totalServiceCharges)}</span>
              </div>
              {breakdown.serviceCharges.map(c => (
                <Row
                  key={c.id}
                  label={c.name}
                  sub={c.type === 'percentage' ? `(${c.value}%)` : '(fixed)'}
                  value={formatAmount(c.amount)}
                  indent
                />
              ))}
            </div>
          )}

          {/* Discounts */}
          {breakdown.discounts.length > 0 && (
            <div className="space-y-1">
              <div className="flex justify-between text-sm font-medium text-green-700 border-t border-gray-100 pt-1">
                <span>Discounts</span>
                <span className="tabular-nums">-{formatAmount(breakdown.totalDiscounts)}</span>
              </div>
              {breakdown.discounts.map(d => {
                const pctLabel = PERCENTAGE_TYPES.has(d.type) && d.value > 0
                  ? `(${d.value}%)`
                  : d.type === 'fixed' ? '(fixed)' : undefined;
                const codePart = d.code ? ` [${d.code}]` : '';
                return (
                  <Row
                    key={d.id}
                    label={`${d.name}${codePart}`}
                    sub={pctLabel}
                    value={`-${formatAmount(d.amount)}`}
                    green
                    indent
                  />
                );
              })}
            </div>
          )}

          {/* Taxes */}
          {breakdown.taxes.length > 0 && (
            <div className="space-y-1">
              <div className="flex justify-between text-sm font-medium text-gray-700 border-t border-gray-100 pt-1">
                <span>Taxes & Fees</span>
                <span className="tabular-nums">{formatAmount(breakdown.totalTaxes)}</span>
              </div>
              {breakdown.taxes.map(t => (
                <Row
                  key={t.id}
                  label={t.name}
                  sub={`(${t.rate}%)${t.isInclusive ? ' incl.' : ''}`}
                  value={t.isInclusive ? 'included' : formatAmount(t.amount)}
                  indent
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Show / Hide toggle */}
      {showDetails && hasDetails && (
        <button
          onClick={() => setExpanded(v => !v)}
          className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 pt-0.5"
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
      <div className="border-t border-gray-200 pt-2">
        <div className="flex justify-between font-semibold text-base">
          <span className="text-gray-900">Total</span>
          <span className="text-gray-900 tabular-nums">{formatAmount(breakdown.finalPrice)}</span>
        </div>
      </div>

    </div>
  );
}
