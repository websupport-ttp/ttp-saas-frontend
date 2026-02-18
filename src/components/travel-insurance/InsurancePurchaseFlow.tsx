'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { PolicyPurchaseData, BookingResponse } from '@/types/api';
import { InsurancePlan, TripDetails } from '@/types/travel-insurance';
import { insuranceService } from '@/lib/services/insurance-service';
import { formatCurrency } from '@/lib/utils';

interface InsurancePurchaseFlowProps {
  selectedPlan: InsurancePlan;
  tripDetails: TripDetails;
  customerDetails: any;
  onPurchaseSuccess: (bookingResponse: BookingResponse) => void;
  onPurchaseError: (error: string) => void;
}

export function InsurancePurchaseFlow({
  selectedPlan,
  tripDetails,
  customerDetails,
  onPurchaseSuccess,
  onPurchaseError
}: InsurancePurchaseFlowProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [purchaseType, setPurchaseType] = useState<'individual' | 'family'>('individual');

  const calculateTotalPremium = () => {
    if (!tripDetails) return selectedPlan.basePrice;
    
    const days = Math.ceil(
      (tripDetails.returnDate.getTime() - tripDetails.departureDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    const baseAmount = selectedPlan.basePrice * days * tripDetails.numberOfTravelers;
    const tripMultiplier = selectedPlan.tripTypeMultipliers[tripDetails.tripType];
    
    return Math.round(baseAmount * tripMultiplier);
  };

  const handlePurchase = async () => {
    setIsProcessing(true);
    
    try {
      // Prepare purchase data
      const purchaseData: PolicyPurchaseData = {
        quoteId: `quote_${Date.now()}`, // This should come from the quote response
        planId: selectedPlan.id,
        customerDetails: {
          firstName: customerDetails.firstName,
          lastName: customerDetails.lastName,
          email: customerDetails.email,
          phoneNumber: customerDetails.phoneNumber,
          dateOfBirth: customerDetails.dateOfBirth,
          address: customerDetails.address
        },
        emergencyContact: customerDetails.emergencyContact
      };

      let bookingResponse: BookingResponse;

      // Choose purchase method based on type
      if (purchaseType === 'family' && tripDetails.numberOfTravelers > 1) {
        bookingResponse = await insuranceService.purchaseFamilyPolicy(purchaseData);
      } else {
        bookingResponse = await insuranceService.purchaseIndividualPolicy(purchaseData);
      }

      onPurchaseSuccess(bookingResponse);
    } catch (error) {
      console.error('Insurance purchase failed:', error);
      onPurchaseError(error instanceof Error ? error.message : 'Purchase failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const totalPremium = calculateTotalPremium();

  return (
    <div className="insurance-purchase-flow">
      <div className="bg-white border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Complete Your Purchase</h3>
        
        {/* Plan Summary */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium">{selectedPlan.name}</h4>
            <div className="text-right">
              <div className="text-xl font-bold text-red-600">
                {formatCurrency(totalPremium)}
              </div>
              <div className="text-sm text-gray-500">total premium</div>
            </div>
          </div>
          
          <div className="text-sm text-gray-600 space-y-1">
            <div>Destination: {tripDetails.destination}</div>
            <div>
              Travel Dates: {tripDetails.departureDate.toLocaleDateString()} - {tripDetails.returnDate.toLocaleDateString()}
            </div>
            <div>Travelers: {tripDetails.numberOfTravelers}</div>
          </div>
        </div>

        {/* Purchase Type Selection */}
        {tripDetails.numberOfTravelers > 1 && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Policy Type
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="purchaseType"
                  value="individual"
                  checked={purchaseType === 'individual'}
                  onChange={(e) => setPurchaseType(e.target.value as 'individual' | 'family')}
                  className="mr-3"
                />
                <div>
                  <div className="font-medium">Individual Policies</div>
                  <div className="text-sm text-gray-600">
                    Separate policy for each traveler
                  </div>
                </div>
              </label>
              
              <label className="flex items-center">
                <input
                  type="radio"
                  name="purchaseType"
                  value="family"
                  checked={purchaseType === 'family'}
                  onChange={(e) => setPurchaseType(e.target.value as 'individual' | 'family')}
                  className="mr-3"
                />
                <div>
                  <div className="font-medium">Family Policy</div>
                  <div className="text-sm text-gray-600">
                    Single policy covering all travelers
                  </div>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* Key Coverage Highlights */}
        <div className="mb-6">
          <h4 className="font-medium text-sm mb-3 text-gray-700">Your Coverage Includes:</h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Medical: {formatCurrency(selectedPlan.coverage.medicalExpenses)}
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Trip Cancellation: {formatCurrency(selectedPlan.coverage.tripCancellation)}
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Baggage: {formatCurrency(selectedPlan.coverage.baggage)}
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Emergency Evacuation: {formatCurrency(selectedPlan.coverage.emergencyEvacuation)}
            </div>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="mb-6">
          <label className="flex items-start space-x-3">
            <input
              type="checkbox"
              required
              className="mt-1"
            />
            <div className="text-sm text-gray-600">
              I agree to the{' '}
              <a href="/terms" className="text-red-600 hover:underline" target="_blank">
                Terms and Conditions
              </a>{' '}
              and{' '}
              <a href="/privacy" className="text-red-600 hover:underline" target="_blank">
                Privacy Policy
              </a>
            </div>
          </label>
        </div>

        {/* Purchase Button */}
        <Button
          onClick={handlePurchase}
          disabled={isProcessing}
          className="w-full"
          size="lg"
        >
          {isProcessing ? (
            <div className="flex items-center space-x-2">
              <LoadingSpinner size="sm" color="white" />
              <span>Processing Purchase...</span>
            </div>
          ) : (
            `Purchase Policy - ${formatCurrency(totalPremium)}`
          )}
        </Button>

        {/* Security Notice */}
        <div className="mt-4 text-center">
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>Secure payment powered by Paystack</span>
          </div>
        </div>
      </div>
    </div>
  );
}