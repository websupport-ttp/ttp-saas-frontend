'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PaymentRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // Get the payment reference from the URL or prompt user
    const urlParams = new URLSearchParams(window.location.search);
    const reference = urlParams.get('reference') || urlParams.get('trxref');
    
    if (reference) {
      // Redirect to booking confirmation with the reference
      router.push(`/flights/booking-confirmation?reference=${reference}`);
    } else {
      // If no reference in URL, show manual input
      const manualReference = prompt('Please enter your payment reference (starts with TTP-FL-):');
      if (manualReference) {
        router.push(`/flights/booking-confirmation?reference=${manualReference}`);
      } else {
        router.push('/flights');
      }
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Redirecting to booking confirmation...</p>
      </div>
    </div>
  );
}