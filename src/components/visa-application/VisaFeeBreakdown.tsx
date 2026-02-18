'use client';

import React from 'react';
import { VisaFees } from '@/types/api';

interface VisaFeeBreakdownProps {
  fees: VisaFees;
  urgency: string;
  onProceedToPayment?: () => void;
  showPaymentButton?: boolean;
  loading?: boolean;
}

export const VisaFeeBreakdown: React.FC<VisaFeeBreakdownProps> = ({
  fees,
  urgency,
  onProceedToPayment,
  showPaymentButton = false,
  loading = false
}) => {
  const getUrgencyLabel = (urgency: string) => {
    switch (urgency) {
      case 'express':
        return 'Express Processing';
      case 'urgent':
        return 'Urgent Processing';
      default:
        return 'Standard Processing';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'express':
        return 'text-orange-600 bg-orange-50';
      case 'urgent':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-green-600 bg-green-50';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Fee Breakdown</h3>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getUrgencyColor(urgency)}`}>
          {getUrgencyLabel(urgency)}
        </span>
      </div>
      
      <div className="space-y-3">
        {/* Base Fee */}
        <div className="flex justify-between items-center py-2 border-b border-gray-100">
          <div>
            <span className="text-gray-600">Base Visa Fee</span>
            <p className="text-xs text-gray-500">Government processing fee</p>
          </div>
          <span className="font-medium text-gray-900">
            {fees.currency} {fees.baseFee.toLocaleString()}
          </span>
        </div>
        
        {/* Urgency Fee */}
        {fees.urgencyFee && fees.urgencyFee > 0 && (
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <div>
              <span className="text-gray-600">Urgency Fee</span>
              <p className="text-xs text-gray-500">Additional fee for {urgency} processing</p>
            </div>
            <span className="font-medium text-gray-900">
              {fees.currency} {fees.urgencyFee.toLocaleString()}
            </span>
          </div>
        )}
        
        {/* Service Fee */}
        <div className="flex justify-between items-center py-2 border-b border-gray-100">
          <div>
            <span className="text-gray-600">Service Fee</span>
            <p className="text-xs text-gray-500">Application processing & support</p>
          </div>
          <span className="font-medium text-gray-900">
            {fees.currency} {fees.serviceFee.toLocaleString()}
          </span>
        </div>
        
        {/* Total */}
        <div className="flex justify-between items-center py-4 border-t-2 border-gray-200 bg-gray-50 -mx-6 px-6 rounded-b-lg">
          <div>
            <span className="text-lg font-semibold text-gray-900">Total Amount</span>
            <p className="text-xs text-gray-500">All fees included</p>
          </div>
          <span className="text-xl font-bold text-blue-600">
            {fees.currency} {fees.total.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Payment Button */}
      {showPaymentButton && onProceedToPayment && (
        <div className="mt-6">
          <button
            onClick={onProceedToPayment}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </div>
            ) : (
              'Proceed to Payment'
            )}
          </button>
        </div>
      )}

      {/* Fee Notes */}
      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-4 w-4 text-yellow-400 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-2">
            <p className="text-xs text-yellow-700">
              <strong>Important:</strong> All fees are non-refundable once the application is submitted. 
              Processing times are estimates and may vary based on embassy workload and individual circumstances.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisaFeeBreakdown;