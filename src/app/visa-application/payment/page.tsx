'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ServiceLayout, PaymentMethodSelector, CreditCardForm } from '@/components/hotels';
import { VisaPaymentSummary } from '@/components/visa-application';
import { VisaApplication, VisaType } from '@/types/visa-application';
import { PaymentMethod, PaymentDetails, CardProcessor } from '@/types/hotels';
import { generateVisaConfirmation } from '@/lib/visa-utils';
import { visaService } from '@/lib/services/visa-service';

// Mock visa application data - in real app this would come from state management
const mockVisaApplication: VisaApplication = {
  id: 'visa-app-001',
  destinationCountry: 'US',
  nationality: 'GB',
  visaType: {
    id: 'b1-b2',
    name: 'B-1/B-2 Tourist/Business Visa',
    description: 'For tourism, business meetings, and short-term visits',
    validityDays: 3650,
    maxStayDays: 180,
    entries: 'multiple',
    governmentFee: 160,
    processingFee: 50,
    processingTime: '5-10 business days',
    requirements: ['Valid passport', 'DS-160 form', 'Interview appointment', 'Supporting documents']
  },
  arrivalDate: new Date('2024-12-15'),
  travelers: [
    {
      id: 'traveler-001',
      personalInfo: {
        firstName: 'John',
        middleName: 'Michael',
        lastName: 'Smith',
        dateOfBirth: new Date('1990-05-15'),
        placeOfBirth: 'London, UK',
        nationality: 'British',
        gender: 'male',
        maritalStatus: 'single',
        email: 'john.smith@example.com',
        phoneNumber: '+44 20 1234 5678',
        address: {
          street: '123 Baker Street',
          city: 'London',
          state: 'England',
          postalCode: 'NW1 6XE',
          country: 'United Kingdom'
        }
      },
      passportInfo: {
        passportNumber: 'GB123456789',
        nationality: 'British',
        issueDate: new Date('2020-01-15'),
        expirationDate: new Date('2030-01-15'),
        issuingCountry: 'United Kingdom',
        placeOfIssue: 'London'
      },
      additionalInfo: {
        hasAssets: true,
        assetDetails: 'Property ownership and savings account',
        hasTravelHistory: true,
        travelHistoryDetails: 'Previous visits to EU countries',
        employmentStatus: 'employed',
        employerDetails: {
          name: 'Tech Solutions Ltd',
          address: '456 Business Park, London, UK',
          position: 'Software Engineer'
        },
        monthlyIncome: '£5,000-£7,500',
        previousApplications: 'none',
        purposeOfTravel: 'Tourism and business meetings',
        emergencyContact: {
          name: 'Jane Smith',
          relationship: 'Sister',
          phoneNumber: '+44 20 9876 5432',
          address: '789 Family Road, London, UK'
        }
      }
    }
  ],
  appointmentLocation: 'US Embassy London - 33 Nine Elms Lane, London SW11 7US',
  status: 'submitted',
  totalCost: 210,
  confirmationNumber: 'VISA123456ABCD',
  createdAt: new Date(),
  submittedAt: new Date()
};

export default function VisaPaymentPage() {
  const router = useRouter();
  const [application, setApplication] = useState<VisaApplication>(mockVisaApplication);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('paystack');
  const [selectedCardProcessor, setSelectedCardProcessor] = useState<CardProcessor>('paystack');
  const [paymentData, setPaymentData] = useState<PaymentDetails>({
    method: 'paystack'
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePaymentMethodChange = (method: PaymentMethod) => {
    setSelectedPaymentMethod(method);
    setPaymentData({ method });
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

  const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      // For non-Paystack payment methods, show info message
      if (selectedPaymentMethod !== 'paystack') {
        console.log(`${selectedPaymentMethod} integration coming soon. Using Paystack for now.`);
      }

      // Submit visa application first
      const applicationResult = await visaService.submitApplication({
        destinationCountry: application.destinationCountry,
        visaType: application.visaType.id,
        urgency: 'standard',
        personalInfo: {
          firstName: application.travelers[0].personalInfo.firstName,
          lastName: application.travelers[0].personalInfo.lastName,
          dateOfBirth: application.travelers[0].personalInfo.dateOfBirth.toISOString().split('T')[0],
          placeOfBirth: application.travelers[0].personalInfo.placeOfBirth,
          nationality: application.travelers[0].personalInfo.nationality,
          passportNumber: application.travelers[0].passportInfo.passportNumber,
          passportExpiryDate: application.travelers[0].passportInfo.expirationDate.toISOString().split('T')[0],
          email: application.travelers[0].personalInfo.email,
          phoneNumber: application.travelers[0].personalInfo.phoneNumber,
          address: application.travelers[0].personalInfo.address
        },
        travelInfo: {
          purposeOfVisit: application.travelers[0].additionalInfo.purposeOfTravel,
          intendedDateOfEntry: application.arrivalDate.toISOString().split('T')[0],
          intendedDateOfExit: application.arrivalDate.toISOString().split('T')[0], // Placeholder
          accommodationDetails: 'Hotel booking',
          previousVisits: false
        },
        documents: []
      });

      // Store application details
      sessionStorage.setItem('visaApplicationId', applicationResult.applicationId);
      sessionStorage.setItem('visaTrackingNumber', applicationResult.trackingNumber);

      // Initiate payment
      const paymentResponse = await visaService.initiatePayment(applicationResult.applicationId);
      
      // Store payment reference for verification
      sessionStorage.setItem('visaPaymentReference', paymentResponse.paymentReference);
      
      // Redirect to Paystack for payment
      if (paymentResponse.authorizationUrl) {
        window.location.href = paymentResponse.authorizationUrl;
      } else {
        throw new Error('No payment URL received from server');
      }
    } catch (error) {
      console.error('Visa application/payment failed:', error);
      setIsProcessing(false);
    }
  };

  const handleBack = () => {
    router.push('/visa-application/review');
  };

  const breadcrumbs = [
    { name: 'Visa Application', href: '/visa-application' },
    { name: 'Personal Details', href: '/visa-application/personal' },
    { name: 'Passport Information', href: '/visa-application/passport' },
    { name: 'Appointment', href: '/visa-application/appointment' },
    { name: 'Review Application', href: '/visa-application/review' },
    { name: 'Payment', href: '/visa-application/payment' }
  ];

  return (
    <ServiceLayout title="Complete Your Visa Application" breadcrumbs={breadcrumbs}>
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
                        Click "Submit Application & Pay" to proceed to our secure payment gateway where you can pay using:
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

              {/* Important Information */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 sm:p-6">
                <h4 className="text-lg font-semibold text-yellow-900 mb-4">Important Information</h4>
                <div className="space-y-3 text-sm text-yellow-800">
                  <p>
                    <strong>Processing Time:</strong> Your visa application will be processed within {application.visaType.processingTime}.
                  </p>
                  <p>
                    <strong>Appointment Confirmation:</strong> You will receive appointment details via email within 24 hours of payment.
                  </p>
                  <p>
                    <strong>Required Documents:</strong> Please bring all required documents to your appointment. A list will be provided in your confirmation email.
                  </p>
                  <p>
                    <strong>Refund Policy:</strong> Government fees are non-refundable. Processing fees may be partially refundable if withdrawn before processing begins.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6">
                <button
                  onClick={handleBack}
                  className="w-full sm:w-auto px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors order-2 sm:order-1"
                >
                  Back to Review
                </button>
                <button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full sm:flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors order-1 sm:order-2"
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Processing Payment...
                    </div>
                  ) : (
                    `Submit Application & Pay $${application.totalCost}`
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Side - Application Summary */}
          <div className="w-full lg:w-[400px] lg:flex-shrink-0 order-first lg:order-last">
            <div className="lg:sticky lg:top-8">
              <VisaPaymentSummary
                application={application}
                visaType={application.visaType}
              />
            </div>
          </div>
        </div>
      </div>
    </ServiceLayout>
  );
}