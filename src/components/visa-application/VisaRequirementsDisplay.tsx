'use client';

import React from 'react';
import { VisaRequirements, VisaFees } from '@/types/api';
import VisaFeeBreakdown from './VisaFeeBreakdown';

interface VisaRequirementsDisplayProps {
  requirements: VisaRequirements | null;
  fees: VisaFees | null;
  loading: boolean;
  error: string | null;
  urgency?: string;
  onProceedToApplication?: () => void;
}

export const VisaRequirementsDisplay: React.FC<VisaRequirementsDisplayProps> = ({
  requirements,
  fees,
  loading,
  error,
  urgency = 'standard',
  onProceedToApplication
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error Loading Requirements</h3>
            <p className="mt-1 text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!requirements || !fees) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
        <p className="text-gray-600">Select a country and visa type to view requirements and fees.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Visa Information */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {requirements.visaType} Visa for {requirements.country}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Processing Time</h4>
            <p className="text-blue-800">{requirements.processingTime}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium text-green-900 mb-2">Validity Period</h4>
            <p className="text-green-800">{requirements.validityPeriod}</p>
          </div>
        </div>

        {/* Required Documents */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-3">Required Documents</h4>
          <div className="space-y-3">
            {requirements.requiredDocuments.map((doc, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-900 flex items-center">
                      {doc.name}
                      {doc.required && (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                          Required
                        </span>
                      )}
                    </h5>
                    <p className="text-sm text-gray-600 mt-1">{doc.description}</p>
                    <div className="mt-2 text-xs text-gray-500">
                      <span>Accepted formats: {doc.format.join(', ')}</span>
                      <span className="ml-4">Max size: {doc.maxSize}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fee Breakdown */}
      <VisaFeeBreakdown
        fees={fees}
        urgency={urgency}
        onProceedToPayment={onProceedToApplication}
        showPaymentButton={!!onProceedToApplication}
      />

      {/* Important Notes */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">Important Notes</h3>
            <div className="mt-2 text-sm text-yellow-700">
              <ul className="list-disc list-inside space-y-1">
                <li>Processing times are estimates and may vary</li>
                <li>All documents must be clear and legible</li>
                <li>Fees are non-refundable once application is submitted</li>
                <li>Additional documents may be requested during processing</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisaRequirementsDisplay;