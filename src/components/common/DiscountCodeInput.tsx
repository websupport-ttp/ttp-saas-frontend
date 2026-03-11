'use client';

import { useState } from 'react';
import { appConfig } from '@/lib/config';

interface DiscountCodeInputProps {
  serviceType: string;
  amount: number;
  userRole?: string;
  onDiscountApplied: (code: string, discount: any) => void;
  onDiscountRemoved: () => void;
}

export default function DiscountCodeInput({
  serviceType,
  amount,
  userRole = 'user',
  onDiscountApplied,
  onDiscountRemoved
}: DiscountCodeInputProps) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [appliedDiscount, setAppliedDiscount] = useState<any>(null);

  const validateCode = async () => {
    if (!code.trim()) {
      setError('Please enter a discount code');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const API_BASE_URL = appConfig.apiBaseUrl;
      const response = await fetch(`${API_BASE_URL}/pricing/validate-discount`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: code.trim(),
          serviceType,
          amount,
          userRole
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Invalid discount code');
      }

      setAppliedDiscount(data.data);
      onDiscountApplied(code.trim(), data.data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      setAppliedDiscount(null);
    } finally {
      setLoading(false);
    }
  };

  const removeDiscount = () => {
    setCode('');
    setAppliedDiscount(null);
    setError(null);
    onDiscountRemoved();
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h4 className="font-medium text-gray-900 mb-3">Have a discount code?</h4>
      
      {!appliedDiscount ? (
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="Enter code"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
              disabled={loading}
            />
            <button
              onClick={validateCode}
              disabled={loading || !code.trim()}
              className="px-4 py-2 bg-brand-red text-white rounded-lg hover:bg-brand-red-dark disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Validating...' : 'Apply'}
            </button>
          </div>
          
          {error && (
            <div className="flex items-start gap-2 text-sm text-red-600">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-green-900">{appliedDiscount.name}</p>
              <p className="text-xs text-green-700">Code: {code}</p>
            </div>
          </div>
          <button
            onClick={removeDiscount}
            className="text-sm text-red-600 hover:text-red-700 font-medium"
          >
            Remove
          </button>
        </div>
      )}
    </div>
  );
}
