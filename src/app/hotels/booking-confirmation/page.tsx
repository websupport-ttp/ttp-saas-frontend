'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ServiceLayout } from '@/components/layout';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { paymentVerificationService } from '@/lib/services/payment-verification-service';

export default function HotelBookingConfirmationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [verificationStatus, setVerificationStatus] = useState<'verifying' | 'success' | 'failed' | 'timeout'>('verifying');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
          serviceType: 'hotel',
          onSuccess: (result) => {
            console.log('Hotel payment verified successfully:', result);
            setVerificationStatus('success');
            // Redirect to success page after a short delay
            setTimeout(() => {
              router.push('/hotels/success');
            }, 2000);
          },
          onFailure: (error) => {
            console.error('Hotel payment verification failed:', error);
            setError(error.message);
            setVerificationStatus('failed');
          },
          onTimeout: () => {
            console.warn('Hotel payment verification timed out');
            setError('Payment verification timed out. Please contact support.');
            setVerificationStatus('timeout');
          }
        });

        console.log('Started hotel payment verification:', verificationId);
      } catch (error) {
        console.error('Error starting payment verification:', error);
        setError(error instanceof Error ? error.message : 'Unknown error occurred');
        setVerificationStatus('failed');
      }
    };

    handlePaymentVerification();

    // Cleanup verification on unmount
    return () => {
      paymentVerificationService.stopAllVerifications();
    };
  }, [searchParams, router]);

  const breadcrumbs = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'Hotel Booking', href: '/hotels' },
    { name: 'Payment Confirmation', href: '/hotels/booking-confirmation' },
  ];

  return (
    <ServiceLayout
      title="Hotel Payment Confirmation"
      description="Confirming your hotel booking payment"
      breadcrumbs={breadcrumbs}
      serviceName="Hotel Booking"
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
                  Your hotel booking has been confirmed. Redirecting to booking details...
                </p>
              </>
            )}

            {(verificationStatus === 'failed' || verificationStatus === 'timeout') && (
              <>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                  <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                  Payment Verification Failed
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  {error || 'Unable to verify your payment. Please contact support.'}
                </p>
                <div className="mt-6 space-y-3">
                  <button
                    onClick={() => router.push('/hotels')}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Back to Hotel Search
                  </button>
                  <button
                    onClick={() => router.push('/contact')}
                    className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
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