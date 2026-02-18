'use client';

import { Button } from '@/components/ui/Button';
import { VisaReviewSummaryProps } from '@/types/visa-application';
import { formatVisaValidity, calculateFeeBreakdown, getCountryInfo } from '@/lib/visa-utils';
import { formatDate } from '@/lib/travel-services-utils';

export default function VisaReviewSummary({
  application,
  visaType,
  onEdit,
  onSubmit
}: VisaReviewSummaryProps) {
  const feeBreakdown = calculateFeeBreakdown(visaType, application.travelers.length);
  const destinationInfo = getCountryInfo(application.destinationCountry);
  const nationalityInfo = getCountryInfo(application.nationality);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Review Your Application
          </h2>
          <p className="text-gray-600">
            Please review all information before submitting your visa application
          </p>
        </div>

        {/* Visa Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="text-4xl">
              {destinationInfo?.flag || '🌍'}
            </div>
            <div>
              <h3 className="text-xl font-semibold text-blue-900">
                {visaType.name}
              </h3>
              <p className="text-blue-700">
                {destinationInfo?.name || application.destinationCountry}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-medium text-blue-700">Validity & Stay:</span>
              <p className="text-sm text-blue-600">
                {formatVisaValidity(visaType)}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-blue-700">Processing Time:</span>
              <p className="text-sm text-blue-600">
                {visaType.processingTime}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-blue-700">Planned Arrival:</span>
              <p className="text-sm text-blue-600">
                {formatDate(application.arrivalDate)}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-blue-700">Your Nationality:</span>
              <p className="text-sm text-blue-600">
                {nationalityInfo?.flag} {nationalityInfo?.name || application.nationality}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Travelers Information */}
      <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">
            Traveler Information ({application.travelers.length} {application.travelers.length === 1 ? 'person' : 'people'})
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit('personal')}
          >
            Edit
          </Button>
        </div>

        <div className="space-y-6">
          {application.travelers.map((traveler, index) => (
            <div key={traveler.id} className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">
                Traveler {index + 1}
              </h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Name:</span>
                  <p className="font-medium">
                    {traveler.personalInfo.firstName} {traveler.personalInfo.middleName} {traveler.personalInfo.lastName}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600">Date of Birth:</span>
                  <p className="font-medium">
                    {formatDate(traveler.personalInfo.dateOfBirth)}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600">Gender:</span>
                  <p className="font-medium capitalize">
                    {traveler.personalInfo.gender}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600">Email:</span>
                  <p className="font-medium">
                    {traveler.personalInfo.email}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600">Phone:</span>
                  <p className="font-medium">
                    {traveler.personalInfo.phoneNumber}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600">Passport Number:</span>
                  <p className="font-medium">
                    {traveler.passportInfo.passportNumber}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Appointment Information */}
      <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">
            Appointment Location
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit('appointment')}
          >
            Edit
          </Button>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="font-medium text-gray-900 mb-2">
            {application.appointmentLocation}
          </p>
          <p className="text-sm text-gray-600">
            You will receive appointment confirmation details after payment
          </p>
        </div>
      </div>

      {/* Fee Breakdown */}
      <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">
          Fee Breakdown
        </h3>

        <div className="space-y-4">
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-600">
              Government Fees ({application.travelers.length} × ${visaType.governmentFee})
            </span>
            <span className="font-medium">
              ${feeBreakdown.governmentFees}
            </span>
          </div>
          
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-600">
              Processing Fees ({application.travelers.length} × ${visaType.processingFee})
            </span>
            <span className="font-medium">
              ${feeBreakdown.processingFees}
            </span>
          </div>
          
          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900">
                Total Amount
              </span>
              <span className="text-2xl font-bold text-gray-900">
                ${feeBreakdown.total}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Important:</strong> Government fees are non-refundable. Processing fees may be partially refundable if the application is withdrawn before processing begins.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            variant="outline"
            size="lg"
            onClick={() => onEdit('passport')}
            className="sm:w-auto"
          >
            Back to Edit
          </Button>
          <Button
            size="lg"
            onClick={onSubmit}
            className="flex-1"
          >
            Proceed to Payment
          </Button>
        </div>
      </div>
    </div>
  );
}