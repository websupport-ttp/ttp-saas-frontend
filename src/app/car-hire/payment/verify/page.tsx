'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ServiceLayout } from '@/components/hotels';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

export default function PaymentVerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reference = searchParams.get('reference');
  
  const [status, setStatus] = useState<'verifying' | 'success' | 'failed'>('verifying');
  const [message, setMessage] = useState('Verifying your payment...');
  const [bookingDetails, setBookingDetails] = useState<any>(null);

  useEffect(() => {
    if (!reference) {
      setStatus('failed');
      setMessage('No payment reference provided');
      return;
    }

    verifyPayment();
  }, [reference]);

  const verifyPayment = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/car-hire/verify-payment`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ reference }),
        }
      );

      const data = await response.json();

      console.log('Verification response:', data);
      console.log('response.ok:', response.ok);
      console.log('data.status:', data.status);
      console.log('Condition check:', response.ok && data.status === 'success');

      // Check both response.ok and data.status (root level)
      if (response.ok && data.status === 'success') {
        console.log('Setting status to SUCCESS');
        setStatus('success');
        setMessage(data.message || 'Payment verified successfully!');
        setBookingDetails(data.data);
        
        // Clear session storage
        sessionStorage.removeItem('carBookingReference');
        sessionStorage.removeItem('carPaymentReference');
      } else {
        console.log('Setting status to FAILED');
        setStatus('failed');
        setMessage(data.message || 'Payment verification failed');
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      setStatus('failed');
      setMessage('An error occurred while verifying your payment');
    }
  };

  const handleContinue = () => {
    if (status === 'success') {
      router.push('/car-hire');
    } else {
      router.push('/');
    }
  };

  return (
    <ServiceLayout title="Payment Verification" breadcrumbs={[]}>
      <div className="max-w-2xl mx-auto py-12 px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Status Icon */}
          <div className="flex justify-center mb-6">
            {status === 'verifying' && (
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-brand-red"></div>
            )}
            {status === 'success' && (
              <div className="rounded-full bg-green-100 p-4">
                <svg
                  className="w-16 h-16 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            )}
            {status === 'failed' && (
              <div className="rounded-full bg-red-100 p-4">
                <svg
                  className="w-16 h-16 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            )}
          </div>

          {/* Status Message */}
          <h2 className="text-2xl font-bold text-center mb-4">
            {status === 'verifying' && 'Verifying Payment'}
            {status === 'success' && 'Payment Successful!'}
            {status === 'failed' && 'Payment Failed'}
          </h2>

          <p className="text-center text-gray-600 mb-8">{message}</p>

          {/* Booking Details */}
          {status === 'success' && bookingDetails && (
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-lg mb-4">Booking Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Booking Reference:</span>
                  <span className="font-semibold">{bookingDetails.bookingReference}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Reference:</span>
                  <span className="font-semibold">{reference}</span>
                </div>
                {bookingDetails.amount && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount Paid:</span>
                    <span className="font-semibold">
                      ₦{(bookingDetails.amount / 100).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  A confirmation email has been sent to your email address with your booking details.
                </p>
              </div>
            </div>
          )}

          {/* Action Button */}
          <div className="flex justify-center">
            <button
              onClick={handleContinue}
              disabled={status === 'verifying'}
              className="px-8 py-3 bg-brand-red text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {status === 'success' ? 'Continue Browsing' : 'Go to Homepage'}
            </button>
          </div>

          {/* Support Info */}
          {status === 'failed' && (
            <div className="mt-6 text-center text-sm text-gray-600">
              <p>Need help? Contact our support team:</p>
              <p className="font-semibold mt-1">support@thetravelplace.com</p>
            </div>
          )}
        </div>
      </div>
    </ServiceLayout>
  );
}
