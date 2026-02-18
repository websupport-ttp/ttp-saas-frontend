'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { formatCurrency, formatDate } from '@/lib/utils';
import { insuranceService } from '@/lib/services/insurance-service';

interface PolicyConfirmationProps {
  policy: any;
  paymentReference?: string;
  onDownloadPolicy?: () => void;
}

export function PolicyConfirmation({
  policy,
  paymentReference,
  onDownloadPolicy
}: PolicyConfirmationProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const handleDownloadPolicy = async () => {
    if (!policy?.id) return;

    setIsDownloading(true);
    setDownloadError(null);

    try {
      const policyDocument = await insuranceService.downloadPolicyDocument(policy.id);
      
      // Create download link
      const url = window.URL.createObjectURL(policyDocument);
      const link = document.createElement('a');
      link.href = url;
      link.download = `travel-insurance-policy-${policy.policyNumber || policy.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      if (onDownloadPolicy) {
        onDownloadPolicy();
      }
    } catch (error) {
      console.error('Failed to download policy document:', error);
      setDownloadError('Failed to download policy document. Please try again or contact support.');
    } finally {
      setIsDownloading(false);
    }
  };

  const getTripDuration = () => {
    if (!policy?.tripDetails) return 0;
    const departure = new Date(policy.tripDetails.departureDate);
    const returnDate = new Date(policy.tripDetails.returnDate);
    return Math.ceil((returnDate.getTime() - departure.getTime()) / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="policy-confirmation">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Policy Purchased Successfully!
        </h1>
        <p className="text-gray-600">
          Your travel insurance policy is now active and ready to protect your trip.
        </p>
      </div>

      {/* Policy Details Card */}
      <div className="bg-white border rounded-lg p-6 mb-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Policy Confirmation
            </h2>
            <div className="space-y-1 text-sm text-gray-600">
              <div>Policy Number: <span className="font-medium text-gray-900">{policy.policyNumber || policy.id}</span></div>
              <div>Confirmation: <span className="font-medium text-gray-900">{policy.confirmationNumber}</span></div>
              {paymentReference && (
                <div>Payment Reference: <span className="font-medium text-gray-900">{paymentReference}</span></div>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(policy.premium || 0)}
            </div>
            <div className="text-sm text-gray-500">Total Premium</div>
          </div>
        </div>

        {/* Trip Information */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Trip Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Destination:</span>
                <span className="font-medium">{policy.tripDetails?.destination}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Departure:</span>
                <span className="font-medium">
                  {policy.tripDetails?.departureDate ? formatDate(new Date(policy.tripDetails.departureDate)) : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Return:</span>
                <span className="font-medium">
                  {policy.tripDetails?.returnDate ? formatDate(new Date(policy.tripDetails.returnDate)) : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Duration:</span>
                <span className="font-medium">{getTripDuration()} days</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-3">Coverage Period</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Effective:</span>
                <span className="font-medium">
                  {policy.effectiveDate ? formatDate(new Date(policy.effectiveDate)) : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Expires:</span>
                <span className="font-medium">
                  {policy.expirationDate ? formatDate(new Date(policy.expirationDate)) : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Coverage Summary */}
        <div className="mb-6">
          <h3 className="font-medium text-gray-900 mb-3">Coverage Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="font-medium text-gray-900">
                {formatCurrency(policy.coverage?.medicalExpenses || 0)}
              </div>
              <div className="text-gray-600">Medical Expenses</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="font-medium text-gray-900">
                {formatCurrency(policy.coverage?.tripCancellation || 0)}
              </div>
              <div className="text-gray-600">Trip Cancellation</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="font-medium text-gray-900">
                {formatCurrency(policy.coverage?.baggage || 0)}
              </div>
              <div className="text-gray-600">Baggage Coverage</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="font-medium text-gray-900">
                {formatCurrency(policy.coverage?.emergencyEvacuation || 0)}
              </div>
              <div className="text-gray-600">Emergency Evacuation</div>
            </div>
          </div>
        </div>

        {/* Insured Travelers */}
        {policy.travelers && policy.travelers.length > 0 && (
          <div className="mb-6">
            <h3 className="font-medium text-gray-900 mb-3">Insured Travelers</h3>
            <div className="space-y-2">
              {policy.travelers.map((traveler: any, index: number) => (
                <div key={traveler.id || index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">
                      {traveler.personalInfo?.firstName} {traveler.personalInfo?.lastName}
                    </div>
                    <div className="text-sm text-gray-600">
                      DOB: {traveler.personalInfo?.dateOfBirth ? formatDate(new Date(traveler.personalInfo.dateOfBirth)) : 'N/A'}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    {traveler.personalInfo?.email}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Download Error */}
        {downloadError && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-1">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-red-800 mb-1">Download Error</h4>
                <p className="text-sm text-red-700">{downloadError}</p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Button
            onClick={handleDownloadPolicy}
            disabled={isDownloading}
            className="flex-1"
          >
            {isDownloading ? (
              <div className="flex items-center space-x-2">
                <LoadingSpinner size="sm" color="white" />
                <span>Downloading...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Download Policy Document</span>
              </div>
            )}
          </Button>
          
          <Button
            variant="outline"
            onClick={() => window.print()}
            className="flex-1"
          >
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              <span>Print Confirmation</span>
            </div>
          </Button>
        </div>
      </div>

      {/* Important Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-medium text-blue-900 mb-3">Important Information</h3>
        <div className="space-y-2 text-sm text-blue-800">
          <div className="flex items-start space-x-2">
            <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
            <span>Keep your policy number and confirmation details safe for future reference</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
            <span>Emergency assistance is available 24/7 at the number provided in your policy document</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
            <span>Report any claims within 30 days of the incident for faster processing</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
            <span>You have a 14-day cooling-off period to cancel for a full refund if you haven't started your trip</span>
          </div>
        </div>
      </div>
    </div>
  );
}