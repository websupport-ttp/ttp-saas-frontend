'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { VisaApplicationData, VisaRequirements, VisaFees } from '@/types/api';

interface VisaApplicationReviewProps {
  applicationData: Partial<VisaApplicationData>;
  requirements: VisaRequirements | null;
  fees: VisaFees | null;
  onSubmit: () => void;
  onBack: () => void;
  loading?: boolean;
}

export const VisaApplicationReview: React.FC<VisaApplicationReviewProps> = ({
  applicationData,
  requirements,
  fees,
  onSubmit,
  onBack,
  loading = false
}) => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Review Your Application</h2>

      <div className="space-y-8">
        {/* Basic Information */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-gray-600">Destination Country:</span>
              <p className="font-medium">{applicationData.destinationCountry}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Visa Type:</span>
              <p className="font-medium">{applicationData.visaType}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Processing Urgency:</span>
              <p className="font-medium capitalize">{applicationData.urgency}</p>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        {applicationData.personalInfo && (
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-600">Full Name:</span>
                <p className="font-medium">
                  {applicationData.personalInfo.firstName} {applicationData.personalInfo.lastName}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Date of Birth:</span>
                <p className="font-medium">{applicationData.personalInfo.dateOfBirth}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Nationality:</span>
                <p className="font-medium">{applicationData.personalInfo.nationality}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Passport Number:</span>
                <p className="font-medium">{applicationData.personalInfo.passportNumber}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Email:</span>
                <p className="font-medium">{applicationData.personalInfo.email}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Phone:</span>
                <p className="font-medium">{applicationData.personalInfo.phoneNumber}</p>
              </div>
            </div>

            {applicationData.personalInfo.address && (
              <div className="mt-4">
                <span className="text-sm text-gray-600">Address:</span>
                <p className="font-medium">
                  {applicationData.personalInfo.address.street}, {applicationData.personalInfo.address.city}, {applicationData.personalInfo.address.state} {applicationData.personalInfo.address.postalCode}, {applicationData.personalInfo.address.country}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Travel Information */}
        {applicationData.travelInfo && (
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Travel Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-600">Purpose of Visit:</span>
                <p className="font-medium">{applicationData.travelInfo.purposeOfVisit}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Entry Date:</span>
                <p className="font-medium">{applicationData.travelInfo.intendedDateOfEntry}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Exit Date:</span>
                <p className="font-medium">{applicationData.travelInfo.intendedDateOfExit}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Previous Visits:</span>
                <p className="font-medium">{applicationData.travelInfo.previousVisits ? 'Yes' : 'No'}</p>
              </div>
            </div>

            <div className="mt-4">
              <span className="text-sm text-gray-600">Accommodation Details:</span>
              <p className="font-medium">{applicationData.travelInfo.accommodationDetails}</p>
            </div>

            {applicationData.travelInfo.previousVisits && applicationData.travelInfo.previousVisitDetails && (
              <div className="mt-4">
                <span className="text-sm text-gray-600">Previous Visit Details:</span>
                <p className="font-medium">{applicationData.travelInfo.previousVisitDetails}</p>
              </div>
            )}
          </div>
        )}

        {/* Fees Summary */}
        {fees && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Fee Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Base Fee:</span>
                <span className="font-medium">{fees.currency} {fees.baseFee}</span>
              </div>
              <div className="flex justify-between">
                <span>Service Fee:</span>
                <span className="font-medium">{fees.currency} {fees.serviceFee}</span>
              </div>
              {fees.urgencyFee && fees.urgencyFee > 0 && (
                <div className="flex justify-between">
                  <span>Urgency Fee:</span>
                  <span className="font-medium">{fees.currency} {fees.urgencyFee}</span>
                </div>
              )}
              <div className="border-t border-blue-200 pt-2 flex justify-between font-semibold text-lg">
                <span>Total:</span>
                <span>{fees.currency} {fees.total}</span>
              </div>
            </div>
          </div>
        )}

        {/* Requirements Checklist */}
        {requirements && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Required Documents</h3>
            <div className="space-y-2">
              {requirements.requiredDocuments.map((doc, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`doc-${index}`}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor={`doc-${index}`} className="text-sm">
                    {doc.name}
                    {doc.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                </div>
              ))}
            </div>
            <p className="text-sm text-yellow-700 mt-4">
              Please ensure you have all required documents ready before submitting your application.
            </p>
          </div>
        )}

        {/* Terms and Conditions */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-start space-x-2">
            <input
              type="checkbox"
              id="terms"
              required
              className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="terms" className="text-sm text-gray-700">
              I agree to the{' '}
              <a href="/terms" className="text-blue-600 hover:underline" target="_blank">
                Terms and Conditions
              </a>{' '}
              and{' '}
              <a href="/privacy" className="text-blue-600 hover:underline" target="_blank">
                Privacy Policy
              </a>. I confirm that all information provided is accurate and complete.
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            disabled={loading}
          >
            Back
          </Button>
          <Button
            onClick={onSubmit}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700"
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <LoadingSpinner size="sm" color="white" />
                <span>Submitting...</span>
              </div>
            ) : (
              'Submit Application'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VisaApplicationReview;