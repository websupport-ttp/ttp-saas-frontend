'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { packageService } from '@/lib/services/package-service';
import { useNotifications } from '@/contexts/notification-context';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function PackagePaymentVerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addNotification } = useNotifications();
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState<'success' | 'failed' | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reference = searchParams.get('reference');
  const packageId = searchParams.get('packageId');

  useEffect(() => {
    if (reference) {
      verifyPayment();
    } else {
      setError('No payment reference found');
      setIsVerifying(false);
    }
  }, [reference]);

  const verifyPayment = async () => {
    if (!reference) return;

    setIsVerifying(true);
    setError(null);

    try {
      const result = await packageService.verifyPayment(reference);
      
      if (result.status === 'success') {
        setVerificationStatus('success');
        
        // Store verification result for success page
        const verificationData = {
          reference,
          paymentVerification: result,
          verifiedAt: new Date().toISOString()
        };
        localStorage.setItem('packagePaymentVerification', JSON.stringify(verificationData));

        addNotification({
          type: 'success',
          title: 'Payment Verified!',
          message: 'Your payment has been successfully verified.'
        });

        // Redirect to success page
        setTimeout(() => {
          if (packageId) {
            router.push(`/packages/${packageId}/success?reference=${reference}`);
          } else {
            router.push(`/packages/success?reference=${reference}`);
          }
        }, 2000);
      } else {
        setVerificationStatus('failed');
        setError('Payment verification failed. Please contact support if you believe this is an error.');
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      setVerificationStatus('failed');
      setError('Failed to verify payment. Please try again or contact support.');
      addNotification({
        type: 'error',
        title: 'Verification Failed',
        message: 'Failed to verify payment. Please contact support if you have been charged.'
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleRetry = () => {
    verifyPayment();
  };

  const handleContactSupport = () => {
    window.location.href = 'mailto:support@thetravelplace.com?subject=Payment Verification Issue&body=Payment Reference: ' + reference;
  };

  const handleBackToPackages = () => {
    router.push('/packages');
  };

  return (
    <main id="main-content">
      <Header />

      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
        <div className="max-w-md w-full mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            {isVerifying && (
              <>
                <div className="mb-6 flex justify-center">
                  <LoadingSpinner size="lg" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Verifying Payment
                </h2>
                <p className="text-gray-600 mb-4">
                  Please wait while we verify your payment...
                </p>
                <p className="text-sm text-gray-500">
                  Reference: {reference}
                </p>
              </>
            )}

            {!isVerifying && verificationStatus === 'success' && (
              <>
                <div className="mb-6">
                  <svg
                    className="h-16 w-16 text-green-500 mx-auto"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-green-900 mb-4">
                  Payment Verified!
                </h2>
                <p className="text-gray-600 mb-6">
                  Your payment has been successfully verified. Redirecting to confirmation page...
                </p>
                <div className="flex items-center justify-center text-sm text-gray-500">
                  <LoadingSpinner size="sm" />
                  <span className="ml-2">Redirecting...</span>
                </div>
              </>
            )}

            {!isVerifying && verificationStatus === 'failed' && (
              <>
                <div className="mb-6">
                  <svg
                    className="h-16 w-16 text-red-500 mx-auto"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-red-900 mb-4">
                  Verification Failed
                </h2>
                <p className="text-gray-600 mb-6">
                  {error || 'We could not verify your payment. Please try again or contact our support team.'}
                </p>
                <div className="space-y-3">
                  <button
                    onClick={handleRetry}
                    className="w-full bg-brand-red hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                  >
                    Try Again
                  </button>
                  <button
                    onClick={handleContactSupport}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                  >
                    Contact Support
                  </button>
                  <button
                    onClick={handleBackToPackages}
                    className="w-full bg-white hover:bg-gray-50 text-gray-900 font-semibold py-2 px-6 rounded-lg border border-gray-300 transition-colors"
                  >
                    Back to Packages
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-4">
                  Reference: {reference}
                </p>
              </>
            )}

            {!isVerifying && !verificationStatus && error && (
              <>
                <div className="mb-6">
                  <svg
                    className="h-16 w-16 text-red-500 mx-auto"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-red-900 mb-4">
                  Invalid Request
                </h2>
                <p className="text-gray-600 mb-6">
                  {error}
                </p>
                <button
                  onClick={handleBackToPackages}
                  className="w-full bg-brand-red hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                >
                  Back to Packages
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}