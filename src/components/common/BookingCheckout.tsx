'use client';

import { useState } from 'react';
import PriceBreakdown from './PriceBreakdown';
import DiscountCodeInput from './DiscountCodeInput';

interface BookingCheckoutProps {
  serviceType: 'flights' | 'hotels' | 'car-hire' | 'visa-assistance' | 'travel-insurance';
  basePrice: number;
  userRole?: string;
  bookingDetails: React.ReactNode;
  onCheckout: (finalPrice: number, discountCode?: string) => void;
}

export default function BookingCheckout({
  serviceType,
  basePrice,
  userRole = 'user',
  bookingDetails,
  onCheckout
}: BookingCheckoutProps) {
  const [discountCode, setDiscountCode] = useState<string | undefined>();
  const [finalPrice, setFinalPrice] = useState(basePrice);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDiscountApplied = (code: string, discount: any) => {
    setDiscountCode(code);
  };

  const handleDiscountRemoved = () => {
    setDiscountCode(undefined);
  };

  const handleCheckout = async () => {
    setIsProcessing(true);
    try {
      await onCheckout(finalPrice, discountCode);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Booking Details */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Booking Details</h2>
            {bookingDetails}
          </div>

          {/* Discount Code */}
          <DiscountCodeInput
            serviceType={serviceType}
            amount={basePrice}
            userRole={userRole}
            onDiscountApplied={handleDiscountApplied}
            onDiscountRemoved={handleDiscountRemoved}
          />

          {/* Payment Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Information</h2>
            <p className="text-sm text-gray-600 mb-4">
              You will be redirected to our secure payment gateway to complete your booking.
            </p>
            
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>Secure Payment</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>SSL Encrypted</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - Price Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-4 space-y-4">
            <PriceBreakdown
              basePrice={basePrice}
              serviceType={serviceType}
              userRole={userRole}
              discountCode={discountCode}
              onPriceCalculated={(breakdown) => setFinalPrice(breakdown.finalPrice)}
              showDetails={true}
            />

            <button
              onClick={handleCheckout}
              disabled={isProcessing}
              className="w-full bg-brand-red text-white py-3 px-6 rounded-lg font-semibold hover:bg-brand-red-dark disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {isProcessing ? 'Processing...' : 'Proceed to Payment'}
            </button>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Free Cancellation</p>
                  <p className="text-blue-700">Cancel up to 24 hours before your booking for a full refund.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
