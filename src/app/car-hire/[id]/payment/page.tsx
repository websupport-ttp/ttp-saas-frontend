'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ServiceLayout, PaymentMethodSelector } from '@/components/hotels';
import { CarBookingSummary } from '@/components/car-hire';
import { CarRental, DriverInformation, EmergencyContact, CarExtra } from '@/types/car-hire';
import { MOCK_CAR_RENTALS, calculateCarRentalCost, calculateRentalDays } from '@/lib/car-hire-utils';
import { PaymentMethod, PaymentDetails, CardProcessor } from '@/types/hotels';
import { carHireService, CarBookingData } from '@/lib/services/car-hire-service';

interface CarPaymentPageProps {
  params: {
    id: string;
  };
}

export default function CarPaymentPage({ params }: CarPaymentPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // State for payment
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('paystack');
  const [selectedCardProcessor, setSelectedCardProcessor] = useState<CardProcessor>('paystack');
  const [paymentData, setPaymentData] = useState<PaymentDetails>({
    method: 'paystack',
    cardProcessor: 'paystack'
  });
  const [isProcessing, setIsProcessing] = useState(false);
  
  // State for booking data
  const [bookingData, setBookingData] = useState<{
    car: CarRental;
    location: string;
    pickupDate: Date;
    returnDate: Date;
    passengerCount: number;
    driverInfo: DriverInformation;
    emergencyContact: EmergencyContact;
    extras: CarExtra[];
  } | null>(null);

  // Load booking data from session storage
  useEffect(() => {
    try {
      const savedData = sessionStorage.getItem('carBookingData');
      if (savedData) {
        const parsed = JSON.parse(savedData);
        
        // Safely parse dates
        const parseDate = (dateValue: any): Date => {
          if (!dateValue) return new Date();
          const date = new Date(dateValue);
          return isNaN(date.getTime()) ? new Date() : date;
        };
        
        setBookingData({
          ...parsed,
          pickupDate: parseDate(parsed.pickupDate),
          returnDate: parseDate(parsed.returnDate),
          driverInfo: {
            ...parsed.driverInfo,
            dateOfBirth: parseDate(parsed.driverInfo.dateOfBirth),
            licenseExpiryDate: parseDate(parsed.driverInfo.licenseExpiryDate),
          },
          extras: parsed.extras || []
        });
      }
    } catch (error) {
      console.error('Error loading booking data:', error);
    }
  }, []);

  // Find the car if booking data is not available
  const car = bookingData?.car || MOCK_CAR_RENTALS.find(c => c.id === params.id);

  if (!car || !bookingData) {
    return (
      <ServiceLayout title="Loading...">
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
            <p className="text-gray-600">Loading booking information...</p>
          </div>
        </div>
      </ServiceLayout>
    );
  }

  const subtotal = calculateCarRentalCost(car, bookingData.pickupDate, bookingData.returnDate, bookingData.extras);
  const taxes = subtotal * 0.15; // 15% tax
  const total = subtotal + taxes;

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

  const handlePayment = async () => {
    console.log('Payment button clicked');
    console.log('Booking data:', bookingData);
    
    if (!bookingData) {
      alert('Booking data is missing. Please go back and complete the contact form.');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // For non-Paystack payment methods, show info message
      if (selectedPaymentMethod !== 'paystack') {
        console.log(`${selectedPaymentMethod} integration coming soon. Using Paystack for now.`);
      }

      // Helper function to safely format date
      const formatDate = (date: Date): string => {
        if (!date || isNaN(date.getTime())) {
          throw new Error('Invalid date provided');
        }
        return date.toISOString().split('T')[0];
      };

      // Prepare car booking data
      const carBookingData: CarBookingData = {
        carId: params.id,
        pickupLocation: bookingData.location || 'Not specified',
        returnLocation: bookingData.location || 'Not specified',
        pickupDate: formatDate(bookingData.pickupDate),
        returnDate: formatDate(bookingData.returnDate),
        driverInfo: {
          firstName: bookingData.driverInfo.firstName,
          lastName: bookingData.driverInfo.lastName,
          email: bookingData.driverInfo.email,
          phoneNumber: bookingData.driverInfo.phoneNumber,
          dateOfBirth: formatDate(bookingData.driverInfo.dateOfBirth),
          licenseNumber: bookingData.driverInfo.licenseNumber,
          licenseCountry: bookingData.driverInfo.licenseCountry,
          licenseExpiryDate: formatDate(bookingData.driverInfo.licenseExpiryDate),
        },
        emergencyContact: bookingData.emergencyContact,
        extras: bookingData.extras.map(extra => extra.id),
        specialRequests: ''
      };

      console.log('Submitting car booking:', carBookingData);

      // Make car booking API call
      const bookingResponse = await carHireService.bookCar(carBookingData);
      
      console.log('Booking response:', bookingResponse);
      
      // Store booking reference for verification
      sessionStorage.setItem('carBookingReference', bookingResponse.bookingReference);
      sessionStorage.setItem('carPaymentReference', bookingResponse.paymentReference);
      
      // Redirect to Paystack for payment
      if (bookingResponse.authorizationUrl) {
        window.location.href = bookingResponse.authorizationUrl;
      } else {
        throw new Error('No payment URL received from server');
      }
    } catch (error) {
      console.error('Car booking/payment failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      // Check if it's a 404 error (API not implemented)
      if (errorMessage.includes('404') || errorMessage.includes("Can't find")) {
        alert('Car hire booking API is not yet implemented. This feature is coming soon!');
      } else {
        alert(`Payment failed: ${errorMessage}. Please try again.`);
      }
      setIsProcessing(false);
    }
  };

  const handleBack = () => {
    router.push(`/car-hire/${params.id}/contact?${searchParams.toString()}`);
  };

  const breadcrumbs = [
    { name: 'Car Hire', href: '/car-hire' },
    { name: car.name, href: `/car-hire/${car.id}` },
    { name: 'Contact Information', href: `/car-hire/${car.id}/contact` },
    { name: 'Payment', href: `/car-hire/${car.id}/payment` }
  ];

  return (
    <ServiceLayout title="Complete Your Car Rental" breadcrumbs={breadcrumbs}>
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
                hideCardProcessor={true}
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

              {/* Rental Terms */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 sm:p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Rental Terms & Conditions</h4>
                <div className="space-y-3 text-sm text-gray-600">
                  <p>
                    <strong>Driver Requirements:</strong> Valid driver's license required. Minimum age 21 (25 for luxury/SUV vehicles).
                  </p>
                  <p>
                    <strong>Fuel Policy:</strong> {car.fuelPolicy === 'full-to-full' ? 'Return with full tank' : 'Return with same fuel level'}.
                  </p>
                  <p>
                    <strong>Mileage:</strong> {car.mileage === 'unlimited' ? 'Unlimited mileage included' : 'Limited mileage - additional charges may apply'}.
                  </p>
                  <p>
                    <strong>Cancellation:</strong> Free cancellation up to 24 hours before pickup. Late cancellation fees may apply.
                  </p>
                  <p>
                    <strong>Insurance:</strong> Basic insurance included. Additional coverage available at pickup location.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6">
                <button
                  onClick={handleBack}
                  className="w-full sm:w-auto px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors order-2 sm:order-1"
                >
                  Back to Contact Info
                </button>
                <button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full sm:flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors order-1 sm:order-2"
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Processing Payment...
                    </div>
                  ) : (
                    `Confirm & Pay $${total.toFixed(2)}`
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Side - Booking Summary */}
          <div className="w-full lg:w-[400px] lg:flex-shrink-0 order-first lg:order-last">
            <div className="lg:sticky lg:top-8">
              <CarBookingSummary
                car={car}
                location={bookingData.location}
                pickupDate={bookingData.pickupDate}
                returnDate={bookingData.returnDate}
                driverInfo={bookingData.driverInfo}
                extras={bookingData.extras}
                subtotal={subtotal}
                taxes={taxes}
                total={total}
              />
            </div>
          </div>
        </div>
      </div>
    </ServiceLayout>
  );
}