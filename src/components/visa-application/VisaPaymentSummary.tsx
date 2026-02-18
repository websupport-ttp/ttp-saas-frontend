'use client';

import { VisaApplication, VisaType } from '@/types/visa-application';
import { calculateFeeBreakdown, getCountryInfo } from '@/lib/visa-utils';
import { formatDate } from '@/lib/travel-services-utils';

interface VisaPaymentSummaryProps {
  application: VisaApplication;
  visaType: VisaType;
}

export default function VisaPaymentSummary({ application, visaType }: VisaPaymentSummaryProps) {
  const feeBreakdown = calculateFeeBreakdown(visaType, application.travelers.length);
  const destinationInfo = getCountryInfo(application.destinationCountry);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Summary</h3>
      
      {/* Visa Information */}
      <div className="mb-4 sm:mb-6">
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="text-3xl flex-shrink-0">
            {destinationInfo?.flag || '🌍'}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-gray-900">{visaType.name}</h4>
            <p className="text-sm text-gray-600">
              {destinationInfo?.name || application.destinationCountry}
            </p>
            <p className="text-sm text-gray-500">{visaType.description}</p>
          </div>
        </div>
      </div>

      {/* Application Details */}
      <div className="mb-6 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Application ID</span>
          <span className="font-medium">{application.id}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Planned Arrival</span>
          <span className="font-medium">{formatDate(application.arrivalDate)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Processing Time</span>
          <span className="font-medium">{visaType.processingTime}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Number of Travelers</span>
          <span className="font-medium">{application.travelers.length}</span>
        </div>
      </div>

      {/* Travelers */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Travelers</h4>
        <div className="space-y-1">
          {application.travelers.map((traveler, index) => (
            <div key={traveler.id} className="text-sm text-gray-600">
              {index + 1}. {traveler.personalInfo.firstName} {traveler.personalInfo.lastName}
            </div>
          ))}
        </div>
      </div>

      {/* Fee Breakdown */}
      <div className="border-t border-gray-200 pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">
            Government Fees ({application.travelers.length} × ${visaType.governmentFee})
          </span>
          <span className="font-medium">${feeBreakdown.governmentFees}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">
            Processing Fees ({application.travelers.length} × ${visaType.processingFee})
          </span>
          <span className="font-medium">${feeBreakdown.processingFees}</span>
        </div>
        <div className="border-t border-gray-200 pt-2">
          <div className="flex justify-between">
            <span className="font-semibold text-gray-900">Total</span>
            <span className="font-semibold text-gray-900 text-lg">${feeBreakdown.total}</span>
          </div>
        </div>
      </div>

      {/* Important Notes */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="space-y-2">
          <p className="text-xs text-gray-500">
            <strong>Important:</strong> Government fees are non-refundable regardless of visa decision.
          </p>
          <p className="text-xs text-gray-500">
            Processing fees may be partially refundable if application is withdrawn before processing begins.
          </p>
          <p className="text-xs text-gray-500">
            You will receive appointment confirmation details via email after payment.
          </p>
        </div>
      </div>

      {/* Modification Options */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex flex-col gap-2">
          <button className="text-left text-sm text-blue-600 hover:text-blue-800 transition-colors">
            Review application details
          </button>
          <button className="text-left text-sm text-blue-600 hover:text-blue-800 transition-colors">
            Change appointment location
          </button>
        </div>
      </div>
    </div>
  );
}