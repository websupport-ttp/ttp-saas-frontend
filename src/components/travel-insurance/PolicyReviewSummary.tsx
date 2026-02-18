'use client';

import React, { useState } from 'react';
import { PolicyReviewSummaryProps } from '@/types/travel-insurance';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { formatCurrency, formatDate } from '@/lib/utils';

export function PolicyReviewSummary({
  policy,
  quote,
  onEdit,
  onAcceptTerms,
  onSubmit,
  termsAccepted
}: PolicyReviewSummaryProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    coverage: false,
    travelers: false,
    terms: false
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getTripDuration = () => {
    const days = Math.ceil(
      (policy.tripDetails.returnDate.getTime() - policy.tripDetails.departureDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    return days;
  };

  const getCoverageItems = () => [
    { label: 'Medical Expenses', amount: policy.coverage.medicalExpenses, icon: '🏥' },
    { label: 'Trip Cancellation', amount: policy.coverage.tripCancellation, icon: '✈️' },
    { label: 'Trip Interruption', amount: policy.coverage.tripInterruption, icon: '🔄' },
    { label: 'Baggage Coverage', amount: policy.coverage.baggage, icon: '🧳' },
    { label: 'Baggage Delay', amount: policy.coverage.baggageDelay, icon: '⏰' },
    { label: 'Flight Delay', amount: policy.coverage.flightDelay, icon: '🛫' },
    { label: 'Emergency Evacuation', amount: policy.coverage.emergencyEvacuation, icon: '🚁' },
    { label: 'Accidental Death', amount: policy.coverage.accidentalDeath, icon: '🛡️' },
  ].filter(item => item.amount > 0);

  return (
    <div className="policy-review-summary">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Review Your Policy</h2>
        <p className="text-gray-600 text-sm">
          Please review all details before completing your purchase.
        </p>
      </div>

      {/* Policy Summary Card - Mobile optimized */}
      <div className="bg-white border border-gray-200 rounded-lg mb-6">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg capitalize">{policy.planType} Coverage</h3>
              <p className="text-sm text-gray-600">Policy #{policy.policyNumber}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(quote.totalPremium)}
              </div>
              <div className="text-sm text-gray-500">Total Premium</div>
            </div>
          </div>
        </div>

        {/* Trip Details - Collapsible on mobile */}
        <div className="border-b border-gray-100">
          <button
            onClick={() => toggleSection('trip')}
            className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50 md:cursor-default"
          >
            <h4 className="font-medium">Trip Details</h4>
            <span className="md:hidden">
              {expandedSections.trip ? '−' : '+'}
            </span>
          </button>
          
          <div className={`px-4 pb-4 space-y-3 ${expandedSections.trip ? 'block' : 'hidden md:block'}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-600">Destination:</span>
                <div className="font-medium">{policy.tripDetails.destination}</div>
              </div>
              <div>
                <span className="text-gray-600">Duration:</span>
                <div className="font-medium">{getTripDuration()} days</div>
              </div>
              <div>
                <span className="text-gray-600">Departure:</span>
                <div className="font-medium">{formatDate(policy.tripDetails.departureDate)}</div>
              </div>
              <div>
                <span className="text-gray-600">Return:</span>
                <div className="font-medium">{formatDate(policy.tripDetails.returnDate)}</div>
              </div>
              <div>
                <span className="text-gray-600">Travelers:</span>
                <div className="font-medium">{policy.travelers.length}</div>
              </div>
              <div>
                <span className="text-gray-600">Trip Type:</span>
                <div className="font-medium capitalize">{policy.tripDetails.tripType}</div>
              </div>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit('trip')}
              className="w-full md:w-auto"
            >
              Edit Trip Details
            </Button>
          </div>
        </div>

        {/* Coverage Details - Collapsible on mobile */}
        <div className="border-b border-gray-100">
          <button
            onClick={() => toggleSection('coverage')}
            className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50 md:cursor-default"
          >
            <h4 className="font-medium">Coverage Details</h4>
            <span className="md:hidden">
              {expandedSections.coverage ? '−' : '+'}
            </span>
          </button>
          
          <div className={`px-4 pb-4 ${expandedSections.coverage ? 'block' : 'hidden md:block'}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {getCoverageItems().map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                  <span className="text-sm font-semibold text-green-600">
                    {formatCurrency(item.amount)}
                  </span>
                </div>
              ))}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit('coverage')}
              className="w-full md:w-auto mt-3"
            >
              Change Coverage
            </Button>
          </div>
        </div>

        {/* Travelers - Collapsible on mobile */}
        <div className="border-b border-gray-100">
          <button
            onClick={() => toggleSection('travelers')}
            className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50 md:cursor-default"
          >
            <h4 className="font-medium">Covered Travelers ({policy.travelers.length})</h4>
            <span className="md:hidden">
              {expandedSections.travelers ? '−' : '+'}
            </span>
          </button>
          
          <div className={`px-4 pb-4 space-y-3 ${expandedSections.travelers ? 'block' : 'hidden md:block'}`}>
            {policy.travelers.map((traveler, index) => (
              <div key={traveler.id} className="p-3 bg-gray-50 rounded-lg">
                <div className="font-medium text-sm mb-1">
                  {traveler.personalInfo.firstName} {traveler.personalInfo.lastName}
                </div>
                <div className="text-xs text-gray-600 space-y-1">
                  <div>DOB: {formatDate(traveler.personalInfo.dateOfBirth)}</div>
                  <div>Email: {traveler.personalInfo.email}</div>
                  {traveler.medicalInfo?.hasPreExistingConditions && (
                    <div className="text-orange-600 font-medium">
                      ⚠️ Pre-existing conditions declared
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit('travelers')}
              className="w-full md:w-auto"
            >
              Edit Travelers
            </Button>
          </div>
        </div>

        {/* Premium Breakdown */}
        <div className="p-4">
          <h4 className="font-medium mb-3">Premium Breakdown</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Base Premium:</span>
              <span>{formatCurrency(quote.premiumBreakdown.basePremium)}</span>
            </div>
            {quote.premiumBreakdown.ageAdjustment !== 0 && (
              <div className="flex justify-between">
                <span>Age Adjustment:</span>
                <span>{formatCurrency(quote.premiumBreakdown.ageAdjustment)}</span>
              </div>
            )}
            {quote.premiumBreakdown.tripTypeAdjustment !== 0 && (
              <div className="flex justify-between">
                <span>Trip Type Adjustment:</span>
                <span>{formatCurrency(quote.premiumBreakdown.tripTypeAdjustment)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Taxes & Fees:</span>
              <span>{formatCurrency(quote.premiumBreakdown.taxes)}</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-semibold">
              <span>Total Premium:</span>
              <span className="text-red-600">{formatCurrency(quote.totalPremium)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Terms and Conditions - Mobile optimized */}
      <div className="bg-white border border-gray-200 rounded-lg mb-6">
        <button
          onClick={() => toggleSection('terms')}
          className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50"
        >
          <h4 className="font-medium">Terms and Conditions</h4>
          <span>{expandedSections.terms ? '−' : '+'}</span>
        </button>
        
        {expandedSections.terms && (
          <div className="px-4 pb-4">
            <div className="max-h-60 overflow-y-auto text-sm text-gray-600 space-y-3 border rounded p-3 bg-gray-50">
              <div>
                <h5 className="font-medium text-gray-800 mb-1">Coverage Period</h5>
                <p>Coverage begins at 12:01 AM on your departure date and ends at 11:59 PM on your return date, or when you return home, whichever is earlier.</p>
              </div>
              
              <div>
                <h5 className="font-medium text-gray-800 mb-1">Pre-existing Conditions</h5>
                <p>Pre-existing medical conditions are covered only if declared during application and additional premium is paid where applicable.</p>
              </div>
              
              <div>
                <h5 className="font-medium text-gray-800 mb-1">Claims Process</h5>
                <p>Claims must be reported within 30 days of the incident. All supporting documentation must be provided within 90 days.</p>
              </div>
              
              <div>
                <h5 className="font-medium text-gray-800 mb-1">Cancellation Policy</h5>
                <p>You may cancel this policy within 14 days of purchase for a full refund, provided you have not departed on your trip.</p>
              </div>
              
              <div>
                <h5 className="font-medium text-gray-800 mb-1">Emergency Assistance</h5>
                <p>24/7 emergency assistance is available. Contact our emergency hotline immediately in case of medical emergencies or evacuation needs.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Terms Acceptance */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start space-x-3">
          <Checkbox
            checked={termsAccepted}
            onChange={(e) => onAcceptTerms(e.target.checked)}
            className="mt-1"
          />
          <div className="text-sm">
            <p className="text-blue-800">
              I have read and agree to the{' '}
              <button
                onClick={() => toggleSection('terms')}
                className="underline font-medium hover:text-blue-900"
              >
                terms and conditions
              </button>
              , policy wording, and understand the coverage details and exclusions.
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons - Mobile optimized */}
      <div className="space-y-3 md:flex md:space-y-0 md:space-x-4 md:justify-end">
        <Button
          variant="outline"
          onClick={() => onEdit('review')}
          className="w-full md:w-auto"
        >
          Make Changes
        </Button>
        <Button
          onClick={onSubmit}
          disabled={!termsAccepted}
          className="w-full md:w-auto touch-target"
          size="lg"
        >
          Proceed to Payment
        </Button>
      </div>

      {/* Mobile-specific summary */}
      <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg md:hidden">
        <div className="flex items-center text-green-800">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <div className="font-medium">Ready to Purchase</div>
            <div className="text-sm">
              {policy.travelers.length} traveler{policy.travelers.length > 1 ? 's' : ''} • {getTripDuration()} days • {formatCurrency(quote.totalPremium)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}