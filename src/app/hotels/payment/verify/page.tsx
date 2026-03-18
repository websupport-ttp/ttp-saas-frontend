'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { hotelService } from '@/lib/services/hotel-service';
import { useNotifications } from '@/contexts/notification-context';

export default function HotelPaymentVerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addNotification } = useNotifications();
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const verifyPayment = async () => {
      const reference = searchParams.get('reference');
      const trxref = searchParams.get('trxref');
      const hotelId = searchParams.get('hotelId');
      
      const paymentRef = reference || trxref;
      
      if (!paymentRef) {
        addNotification({
          type: 'error',
          title: 'Verification Error',
          message: 'No payment reference found'
        });
        router.push('/hotels');
        return;
      }

      try {
        // For ETG hotels, check order status using the orderId (passed as reference)
        const result = await hotelService.checkBookingStatus(paymentRef);
        
        if (result.status === 'ok' || result.status === 'confirmed') {
          const successUrl = hotelId 
            ? `/hotels/${hotelId}/success?orderId=${paymentRef}`
            : `/hotels/success?orderId=${paymentRef}`;
          router.push(successUrl);
        } else {
          addNotification({
            type: 'error',
            title: 'Booking Failed',
            message: 'Booking verification failed. Please contact support.'
          });
          router.push('/hotels');
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        addNotification({
          type: 'error',
          title: 'Verification Error',
          message: 'Unable to verify payment. Please contact support.'
        });
        router.push('/hotels');
      } finally {
        setIsVerifying(false);
      }
    };

    verifyPayment();
  }, [searchParams, router, addNotification]);

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Verifying Payment</h2>
          <p className="text-gray-600">Please wait while we process your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Processing...</h2>
        <p className="text-gray-600">Redirecting you to the confirmation page...</p>
      </div>
    </div>
  );
}