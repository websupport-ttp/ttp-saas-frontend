'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Metadata } from 'next';
import { ServiceLayout, PaymentMethodSelector, BookingSummary } from '@/components/hotels';
import RouteGuard from '@/components/hotels/RouteGuard';
import CreditCardForm from '@/components/hotels/CreditCardForm';
import { getHotelById } from '@/lib/hotels';
import { PaymentMethod, PaymentDetails, HotelDetails, Guest, CardProcessor } from '@/types/hotels';
import { HotelBookingData } from '@/types/api';
import { hotelService } from '@/lib/services/hotel-service';
import { HOTEL_ROUTES } from '@/lib/routing';
import { useBookingState } from '@/lib/bookingState';
import { useNotifications } from '@/contexts/notification-context';

interface PaymentPageProps {
  params: {
    id: string;
  };
}

export default function PaymentPage({ params }: PaymentPageProps) {
  const router = useRouter();
  const { addNotification } = useNotifications();
  const [hotel, setHotel] = useState<HotelDetails | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('paystack');
  const [selectedCardProcessor, setSelectedCardProcessor] = useState<CardProcessor>('paystack');
  const [paymentData, setPaymentData] = useState<PaymentDetails>({
    method: 'paystack',
    cardProcessor: 'paystack'
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingData, setBookingData] = useState<any>(null);
  const { updatePaymentDetails, completeBooking } = useBookingState();

  // Mock booking data - in real app this would come from booking state/context
  const mockBookingData = {
    dates: {
      checkIn: new Date('2024-12-15'),
      checkOut: new Date('2024-12-18'),
      nights: 3
    },
    guests: [
      {
        type: 'Adult' as const,
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: new Date('1990-01-01'),
        email: 'john.doe@example.com',
        phoneNumber: '+1234567890'
      }
    ] as Guest[],
    pricing: {
      subtotal: 450,
      taxes: 67.50,
      total: 517.50
    }
  };

  useEffect(() => {
    // Load hotel data and booking data from session storage
    const loadData = async () => {
      try {
        // Load hotel details
        const hotelData = getHotelById(params.id);
        if (hotelData) {
          setHotel(hotelData);
        }

        // Load booking data from session storage
        const storedBookingData = sessionStorage.getItem('hotelBookingData');
        if (storedBookingData) {
          setBookingData(JSON.parse(storedBookingData));
        }
      } catch (error) {
        console.error('Error loading booking data:', error);
        addNotification({ type: 'error', title: 'Error', message: 'Error loading booking information' });
      }
    };

    loadData();
  }, [params.id, addNotification]);

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
    if (!bookingData || !hotel) {
      addNotification({ type: 'error', title: 'Error', message: 'Missing booking information' });
      return;
    }

    try {
      // For non-Paystack payment methods, show info message
      if (selectedPaymentMethod !== 'paystack') {
        addNotification({ 
          type: 'info', 
          title: 'Payment Method', 
          message: `${selectedPaymentMethod} integration coming soon. Using Paystack for now.` 
        });
      }

      // Prepare hotel booking data
      const hotelBookingData: HotelBookingData = {
        hotelId: params.id,
        roomId: 'standard-room', // This would come from room selection
        checkInDate: bookingData.dates.checkIn.toISOString().split('T')[0],
        checkOutDate: bookingData.dates.checkOut.toISOString().split('T')[0],
        guests: bookingData.guests.map((guest: Guest) => ({
          firstName: guest.firstName,
          lastName: guest.lastName,
          email: guest.email || '',
          phoneNumber: guest.phoneNumber || ''
        })),
        specialRequests: ''
      };

      // Update payment details in booking state
      updatePaymentDetails(paymentData);
      
      // Make hotel booking API call
      const bookingResponse = await hotelService.bookHotel(hotelBookingData);
      
      // Store booking reference for verification
      sessionStorage.setItem('hotelBookingReference', bookingResponse.bookingReference);
      sessionStorage.setItem('hotelPaymentReference', bookingResponse.paymentReference);
      
      // Redirect to Paystack for payment
      if (bookingResponse.authorizationUrl) {
        window.location.href = bookingResponse.authorizationUrl;
      } else {
        throw new Error('No payment URL received from server');
      }
    } catch (error) {
      console.error('Hotel booking failed:', error);
      addNotification({ 
        type: 'error', 
        title: 'Booking Failed', 
        message: error instanceof Error ? error.message : 'Booking failed. Please try again.' 
      });
      setIsProcessing(false);
    }
  };

  const handleBack = () => {
    router.push(HOTEL_ROUTES.GUESTS(params.id));
  };

  if (!hotel) {
    return (
      <ServiceLayout title="Payment">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
            <p className="text-gray-600">Loading hotel information...</p>
          </div>
        </div>
      </ServiceLayout>
    );
  }

  const breadcrumbs = [
    { name: 'Hotels', href: '/hotels' },
    { name: hotel.name, href: `/hotels/${params.id}` },
    { name: 'Guest Information', href: `/hotels/${params.id}/guests` },
    { name: 'Payment', href: `/hotels/${params.id}/payment` }
  ];

  return (
    <RouteGuard requiresValidResource={true} requiresBookingData={true}>
      <ServiceLayout title="Complete Your Booking" breadcrumbs={breadcrumbs}>
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

              {/* Cancellation Policy */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 sm:p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Cancellation Policy</h4>
                <div className="space-y-3 text-sm text-gray-600">
                  <p>
                    <strong>Free cancellation</strong> until 24 hours before check-in. After that, the following fees apply:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>24-48 hours before check-in: 50% of total booking cost</li>
                    <li>Less than 24 hours or no-show: 100% of total booking cost</li>
                  </ul>
                  <p>
                    Changes to your booking may be subject to availability and rate differences.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6">
                <button
                  onClick={handleBack}
                  className="w-full sm:w-auto px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors order-2 sm:order-1"
                >
                  Back to Guest Info
                </button>
                <button
                  onClick={handlePayment}
                  disabled={isProcessing || (selectedPaymentMethod === 'paystack' && selectedCardProcessor !== 'paystack')}
                  className="w-full sm:flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors order-1 sm:order-2"
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Processing Payment...
                    </div>
                  ) : (
                    `Confirm & Pay $${mockBookingData.pricing.total.toFixed(2)}`
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Side - Booking Summary */}
          <div className="w-full lg:w-[400px] lg:flex-shrink-0 order-first lg:order-last">
            <div className="lg:sticky lg:top-8">
              {bookingData && (
                <BookingSummary
                  hotel={hotel}
                  dates={bookingData.dates}
                  guests={bookingData.guests}
                  pricing={bookingData.pricing || mockBookingData.pricing}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </ServiceLayout>
    </RouteGuard>
  );
}