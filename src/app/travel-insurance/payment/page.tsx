'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ServiceLayout from '@/components/hotels/ServiceLayout';
import PaymentMethodSelector from '@/components/hotels/PaymentMethodSelector';
import CreditCardForm from '@/components/hotels/CreditCardForm';
import { InsurancePolicy, InsuranceQuote } from '@/types/travel-insurance';
import { PaymentMethod, PaymentDetails, CardProcessor } from '@/types/hotels';
import { BookingResponse, PolicyPurchaseData } from '@/types/api';
import { useUniversalNavigation } from '@/hooks/useUniversalNavigation';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { insuranceService } from '@/lib/services/insurance-service';

export default function InsurancePaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { getStoredData, storeData } = useUniversalNavigation();
  
  const [policy, setPolicy] = useState<InsurancePolicy | null>(null);
  const [quote, setQuote] = useState<InsuranceQuote | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('paystack');
  const [selectedCardProcessor, setSelectedCardProcessor] = useState<CardProcessor>('paystack');
  const [paymentData, setPaymentData] = useState<PaymentDetails>({ 
    method: 'paystack',
    cardProcessor: 'paystack'
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  useEffect(() => {
    // Check for payment verification callback
    const reference = searchParams.get('reference');
    const policyId = searchParams.get('policy_id');
    
    if (reference && policyId) {
      verifyPayment(policyId, reference);
      return;
    }

    // Check if user has completed previous steps
    const storedPolicy = getStoredData('travel-insurance', 'policy');
    const storedQuote = getStoredData('travel-insurance', 'quote');
    
    if (!storedPolicy || !storedQuote) {
      router.push('/travel-insurance');
      return;
    }

    setPolicy({
      ...storedPolicy,
      tripDetails: {
        ...storedPolicy.tripDetails,
        departureDate: new Date(storedPolicy.tripDetails.departureDate),
        returnDate: new Date(storedPolicy.tripDetails.returnDate),
      },
      effectiveDate: new Date(storedPolicy.effectiveDate),
      expirationDate: new Date(storedPolicy.expirationDate),
      createdAt: new Date(storedPolicy.createdAt),
      travelers: storedPolicy.travelers.map((traveler: any) => ({
        ...traveler,
        personalInfo: {
          ...traveler.personalInfo,
          dateOfBirth: new Date(traveler.personalInfo.dateOfBirth),
        }
      }))
    });
    setQuote(storedQuote);
  }, [getStoredData, router, searchParams]);

  const handlePaymentMethodChange = (method: PaymentMethod) => {
    setSelectedPaymentMethod(method);
    setPaymentData({ 
      method,
      cardProcessor: method === 'paystack' ? selectedCardProcessor : undefined
    });
  };

  const handleCardProcessorChange = (processor: CardProcessor) => {
    setSelectedCardProcessor(processor);
    setPaymentData({ 
      method: selectedPaymentMethod,
      cardProcessor: processor
    });
  };

  const handlePaymentDataChange = (data: PaymentDetails) => {
    setPaymentData(data);
  };

  const verifyPayment = async (policyId: string, reference: string) => {
    setIsProcessing(true);
    setPaymentError(null);
    
    try {
      const verificationResult = await insuranceService.verifyPayment(policyId, reference);
      
      if (verificationResult.status === 'success') {
        // Get policy confirmation
        const policyConfirmation = await insuranceService.getPolicyConfirmation(policyId);
        
        // Store completed policy
        storeData('travel-insurance', 'completedPolicy', policyConfirmation);
        storeData('travel-insurance', 'paymentReference', reference);
        
        // Redirect to success page
        router.push('/travel-insurance/success');
      } else {
        setPaymentError('Payment verification failed. Please contact support.');
      }
    } catch (error) {
      console.error('Payment verification failed:', error);
      setPaymentError(error instanceof Error ? error.message : 'Payment verification failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayment = async () => {
    if (!policy || !quote) return;

    // Check if paystack is selected but no processor is chosen
    if (selectedPaymentMethod === 'paystack' && !selectedCardProcessor) {
      setPaymentError('Please select a card processor');
      return;
    }

    // Check if paystack with Paystack is selected
    if (selectedPaymentMethod === 'paystack' && selectedCardProcessor !== 'paystack') {
      setPaymentError(`${selectedCardProcessor} integration coming soon. Please select Paystack for now.`);
      return;
    }

    setIsProcessing(true);
    setPaymentError(null);
    
    try {
      // For non-paystack payment methods, show info message
      if (selectedPaymentMethod !== 'paystack') {
        setPaymentError(`${selectedPaymentMethod} integration coming soon. Please use Paystack for now.`);
        return;
      }

      // Prepare purchase data
      const purchaseData: PolicyPurchaseData = {
        quoteId: (quote as any).quoteId || `quote_${Date.now()}`, // Fallback for quote ID
        planId: policy.id,
        customerDetails: {
          firstName: policy.travelers[0].personalInfo.firstName,
          lastName: policy.travelers[0].personalInfo.lastName,
          email: policy.travelers[0].personalInfo.email,
          phoneNumber: policy.travelers[0].personalInfo.phoneNumber,
          dateOfBirth: policy.travelers[0].personalInfo.dateOfBirth.toISOString().split('T')[0],
          address: policy.travelers[0].personalInfo.address
        },
        emergencyContact: policy.travelers[0].beneficiary
      };

      let bookingResponse: BookingResponse;

      // Choose purchase method based on number of travelers
      if (policy.travelers.length > 1) {
        bookingResponse = await insuranceService.purchaseFamilyPolicy(purchaseData);
      } else {
        bookingResponse = await insuranceService.purchaseIndividualPolicy(purchaseData);
      }

      // Store booking reference for verification
      storeData('travel-insurance', 'bookingReference', bookingResponse.bookingReference);
      storeData('travel-insurance', 'paymentReference', bookingResponse.paymentReference);
      
      // Redirect to Paystack for payment
      window.location.href = bookingResponse.authorizationUrl;
    } catch (error) {
      console.error('Payment initiation failed:', error);
      setPaymentError(error instanceof Error ? error.message : 'Payment failed. Please try again.');
      setIsProcessing(false);
    }
  };

  const handleBack = () => {
    router.push('/travel-insurance/review');
  };

  const progressSteps = [
    { label: 'Choose Plan', active: false, completed: true },
    { label: 'Trip Details', active: false, completed: true },
    { label: 'Travelers', active: false, completed: true },
    { label: 'Review', active: false, completed: true },
    { label: 'Payment', active: true, completed: false },
  ];

  if (!policy || !quote) {
    return (
      <ServiceLayout title="Travel Insurance">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
        </div>
      </ServiceLayout>
    );
  }

  const getTripDuration = () => {
    return Math.ceil(
      (policy.tripDetails.returnDate.getTime() - policy.tripDetails.departureDate.getTime()) / (1000 * 60 * 60 * 24)
    );
  };

  return (
    <ServiceLayout title="Travel Insurance">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col lg:flex-row items-start gap-6 lg:gap-8 xl:gap-16 w-full">
          {/* Left Side - Payment Form */}
          <div className="flex-1 w-full lg:max-w-[686px]">
            <div className="flex flex-col gap-6 sm:gap-8">
              {/* Payment Method Selector */}
              <PaymentMethodSelector
                selectedMethod={selectedPaymentMethod}
                selectedCardProcessor={selectedCardProcessor}
                onMethodChange={handlePaymentMethodChange}
                onCardProcessorChange={handleCardProcessorChange}
              />

              {/* Payment Method Forms */}
              {selectedPaymentMethod === 'paystack' && (
                <div className="border border-gray-200 rounded-lg p-6 bg-white">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">Complete payment securely</h4>
                      <p className="text-gray-600 text-sm mb-4">
                        Click "Confirm & Pay" to proceed to our secure payment gateway where you can pay using:
                      </p>
                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                        <div className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div>
                          <span>Credit/Debit Cards</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div>
                          <span>Bank Transfer</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div>
                          <span>USSD Banking</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div>
                          <span>Mobile Money</span>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-xs text-gray-500">
                          🔒 Your payment is secured with bank-level encryption
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {selectedPaymentMethod === 'google-pay' && (
                <div className="flex flex-col gap-6 w-full max-w-[480px]">
                  <h3 className="text-gray-600 text-lg font-semibold">Google Pay details</h3>
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-blue-800 text-sm">
                      You will be redirected to Google Pay to complete your payment securely.
                    </p>
                  </div>
                </div>
              )}

              {selectedPaymentMethod === 'apple-pay' && (
                <div className="flex flex-col gap-6 w-full max-w-[480px]">
                  <h3 className="text-gray-600 text-lg font-semibold">Apple Pay details</h3>
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <p className="text-gray-800 text-sm">
                      Use Touch ID or Face ID to complete your payment with Apple Pay.
                    </p>
                  </div>
                </div>
              )}

              {selectedPaymentMethod === 'paypal' && (
                <div className="flex flex-col gap-6 w-full max-w-[480px]">
                  <h3 className="text-gray-600 text-lg font-semibold">PayPal details</h3>
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-blue-800 text-sm">
                      You will be redirected to PayPal to log in and complete your payment.
                    </p>
                  </div>
                </div>
              )}

              {/* Payment Error Display */}
              {paymentError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-red-800 mb-1">Payment Error</h4>
                      <p className="text-sm text-red-700">{paymentError}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Policy Terms */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 sm:p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Policy Terms</h4>
                <div className="space-y-3 text-sm text-gray-600">
                  <p>
                    <strong>Coverage Period:</strong> Your policy is effective from {formatDate(policy.effectiveDate)} to {formatDate(policy.expirationDate)}.
                  </p>
                  <p>
                    <strong>Cooling-off Period:</strong> You have 14 days from purchase to cancel for a full refund, provided you haven't started your trip.
                  </p>
                  <p>
                    <strong>Claims:</strong> Report claims within 30 days of the incident. All documentation must be provided within 90 days.
                  </p>
                  <p>
                    <strong>Emergency Assistance:</strong> 24/7 emergency hotline available worldwide for medical emergencies and evacuation needs.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="w-full sm:w-auto order-2 sm:order-1"
                >
                  Back to Review
                </Button>
                <Button
                  onClick={handlePayment}
                  disabled={isProcessing || (selectedPaymentMethod === 'paystack' && selectedCardProcessor !== 'paystack')}
                  className="w-full sm:flex-1 order-1 sm:order-2"
                  size="lg"
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Processing Payment...
                    </div>
                  ) : (
                    `Confirm & Pay ${formatCurrency(quote.totalPremium)}`
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Right Side - Policy Summary */}
          <div className="w-full lg:w-[400px] lg:flex-shrink-0 order-first lg:order-last">
            <div className="lg:sticky lg:top-8">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Policy Summary</h3>
                
                {/* Policy Information */}
                <div className="mb-4 sm:mb-6">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">🛡️</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 capitalize">{policy.planType} Coverage</h4>
                      <p className="text-sm text-gray-600">Policy #{policy.policyNumber}</p>
                      <p className="text-sm text-gray-500">{policy.tripDetails.destination}</p>
                    </div>
                  </div>
                </div>

                {/* Trip Details */}
                <div className="mb-6 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Departure</span>
                    <span className="font-medium">{formatDate(policy.tripDetails.departureDate)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Return</span>
                    <span className="font-medium">{formatDate(policy.tripDetails.returnDate)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Duration</span>
                    <span className="font-medium">{getTripDuration()} day{getTripDuration() !== 1 ? 's' : ''}</span>
                  </div>
                </div>

                {/* Travelers */}
                <div className="mb-6 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Travelers</span>
                    <span className="font-medium">{policy.travelers.length}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {policy.travelers.map((traveler, index) => (
                      <div key={traveler.id}>
                        {traveler.personalInfo.firstName} {traveler.personalInfo.lastName}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key Coverage */}
                <div className="mb-6">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Key Coverage</h5>
                  <div className="space-y-1 text-xs text-gray-600">
                    <div className="flex justify-between">
                      <span>Medical Expenses:</span>
                      <span>{formatCurrency(policy.coverage.medicalExpenses)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Trip Cancellation:</span>
                      <span>{formatCurrency(policy.coverage.tripCancellation)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Baggage:</span>
                      <span>{formatCurrency(policy.coverage.baggage)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Emergency Evacuation:</span>
                      <span>{formatCurrency(policy.coverage.emergencyEvacuation)}</span>
                    </div>
                  </div>
                </div>

                {/* Pricing */}
                <div className="border-t border-gray-200 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Base Premium</span>
                    <span className="font-medium">{formatCurrency(quote.premiumBreakdown.basePremium)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Taxes & fees</span>
                    <span className="font-medium">{formatCurrency(quote.premiumBreakdown.taxes)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2">
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-900">Total Premium</span>
                      <span className="font-semibold text-gray-900 text-lg">{formatCurrency(quote.totalPremium)}</span>
                    </div>
                  </div>
                </div>

                {/* Security Notice */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    Your payment is secured with 256-bit SSL encryption. Policy documents will be emailed after payment confirmation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ServiceLayout>
  );
}