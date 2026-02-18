'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ServiceLayout } from '@/components/layout';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { paymentVerificationService } from '@/lib/services/payment-verification-service';

export default function FlightBookingConfirmationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [verificationStatus, setVerificationStatus] = useState<'verifying' | 'success' | 'failed' | 'timeout'>('verifying');
  const [error, setError] = useState<string | null>(null);

  const handlePaymentVerification = async () => {
    try {
      // Extract payment reference from URL
      const reference = searchParams.get('reference') || searchParams.get('trxref');
      
      if (!reference) {
        setError('No payment reference found');
        setVerificationStatus('failed');
        return;
      }

      // Start automatic payment verification
      const verificationId = paymentVerificationService.startVerification({
        reference,
        serviceType: 'flight',
        onSuccess: (result) => {
          console.log('Flight payment verified successfully:', result);
          
          // Store booking details for success page
          if (result.data) {
            const bookingDetails = {
              reference: reference,
              flight: {
                departure: { 
                  code: result.data.flightDetails?.departure?.iataCode || 'LOS', 
                  location: result.data.flightDetails?.departure?.location || 'Lagos, Nigeria',
                  date: result.data.flightDetails?.departure?.date || 'Today',
                  time: result.data.flightDetails?.departure?.time || '7:00AM'
                },
                arrival: { 
                  code: result.data.flightDetails?.arrival?.iataCode || 'LGW', 
                  location: result.data.flightDetails?.arrival?.location || 'London, Gatwick',
                  date: result.data.flightDetails?.arrival?.date || 'Today',
                  time: result.data.flightDetails?.arrival?.time || '12:15PM'
                }
              },
              passenger: result.data.passengerDetails,
              amount: result.data.amountPaid,
              currency: result.data.currency
            };
            localStorage.setItem('lastBookingDetails', JSON.stringify(bookingDetails));
          }
          
          setVerificationStatus('success');
          // Redirect to universal success page after a short delay
          setTimeout(() => {
            router.push(`/success?service=flight&reference=${reference}`);
          }, 2000);
        },
        onFailure: (error) => {
          console.error('Flight payment verification failed:', error);
          
          // Provide more specific error messages
          let errorMessage = error.message;
          if (error.message.includes('not found')) {
            errorMessage = 'Payment reference not found. Please check your booking confirmation email or contact support.';
          } else if (error.message.includes('network') || error.message.includes('timeout')) {
            errorMessage = 'Network error during verification. Please refresh the page or try again.';
          } else if (error.message.includes('failed')) {
            errorMessage = 'Payment verification failed. Your payment may still be processing. Please check your email or contact support.';
          }
          
          setError(errorMessage);
          setVerificationStatus('failed');
        },
        onTimeout: () => {
          console.warn('Flight payment verification timed out');
          setError('Payment verification is taking longer than expected. Your payment was successful and you should receive a confirmation email shortly. You can also check your booking status by contacting support.');
          setVerificationStatus('timeout');
        }
      });

      console.log('Started flight payment verification:', verificationId);
    } catch (error) {
      console.error('Error starting payment verification:', error);
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
      setVerificationStatus('failed');
    }
  };

  useEffect(() => {
    handlePaymentVerification();

    // Cleanup verification on unmount
    return () => {
      paymentVerificationService.stopAllVerifications();
    };
  }, [searchParams, router]);

  const breadcrumbs = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'Flight Booking', href: '/flights' },
    { name: 'Payment Confirmation', href: '/flights/booking-confirmation' },
  ];

  return (
    <ServiceLayout
      title="Flight Payment Confirmation"
      description="Confirming your flight booking payment"
      breadcrumbs={breadcrumbs}
      serviceName="Flight Booking"
    >
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            {verificationStatus === 'verifying' && (
              <div className="flex flex-col items-center">
                <LoadingSpinner size="lg" />
                <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                  Confirming Payment
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  Please wait while we verify your payment...
                </p>
              </div>
            )}

            {verificationStatus === 'success' && (
              <>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                  <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                  Payment Confirmed!
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  Your flight booking has been confirmed. Redirecting to booking details...
                </p>
              </>
            )}

            {(verificationStatus === 'failed' || verificationStatus === 'timeout') && (
              <>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100">
                  <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                  {verificationStatus === 'timeout' ? 'Verification Taking Longer' : 'Payment Verification Issue'}
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  {error || 'Unable to verify your payment. Please contact support.'}
                </p>
                <div className="mt-6 space-y-3">
                  {verificationStatus === 'timeout' && (
                    <button
                      onClick={() => router.push('/flights/success')}
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      Continue to Booking Confirmation
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setVerificationStatus('verifying');
                      setError(null);
                      handlePaymentVerification();
                    }}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Retry Verification
                  </button>
                  <button
                    onClick={() => router.push('/flights')}
                    className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Back to Flight Search
                  </button>
                  <button
                    onClick={() => router.push('/contact')}
                    className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Contact Support
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </ServiceLayout>
  );
}