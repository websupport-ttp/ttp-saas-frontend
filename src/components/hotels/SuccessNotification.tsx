'use client';

import { useState } from 'react';
import { SuccessNotificationProps } from '@/types/hotels';

export default function SuccessNotification({ confirmationNumber, onDismiss }: SuccessNotificationProps) {
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
      <div className="flex items-start justify-between">
        <div className="flex items-start">
          {/* Success Icon */}
          <div className="flex-shrink-0">
            <svg
              className="w-6 h-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          
          {/* Success Message */}
          <div className="ml-3 min-w-0 flex-1">
            <h3 className="text-lg font-semibold text-green-800">
              Booking Confirmed!
            </h3>
            <p className="text-green-700 mt-1 text-sm sm:text-base">
              Your hotel reservation has been successfully confirmed.
            </p>
            <div className="mt-2">
              <p className="text-sm text-green-600">
                Confirmation Number: 
              </p>
              <span className="font-mono font-semibold bg-green-100 px-2 py-1 rounded text-sm break-all">
                {confirmationNumber}
              </span>
            </div>
            <p className="text-sm text-green-600 mt-2">
              A confirmation email has been sent to your registered email address.
            </p>
          </div>
        </div>
        
        {/* Dismiss Button */}
        {onDismiss && (
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 ml-4 text-green-400 hover:text-green-600 transition-colors"
            aria-label="Dismiss notification"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}