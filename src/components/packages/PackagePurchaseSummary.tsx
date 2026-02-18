'use client';

import { PackageDetails } from '@/types/api';
import { format } from 'date-fns';

interface PackagePurchaseSummaryProps {
  packageDetails: PackageDetails;
  bookingData: any;
}

export default function PackagePurchaseSummary({
  packageDetails,
  bookingData
}: PackagePurchaseSummaryProps) {
  const adultCount = bookingData?.adultCount || 1;
  const childCount = bookingData?.childCount || 0;
  const selectedDate = bookingData?.selectedDate;

  // Calculate pricing
  const adultPrice = packageDetails.price.adult;
  const childPrice = packageDetails.price.child;
  const adultTotal = adultPrice * adultCount;
  const childTotal = childPrice * childCount;
  const subtotal = adultTotal + childTotal;
  const taxRate = 0.075; // 7.5% VAT
  const taxAmount = subtotal * taxRate;
  const totalAmount = subtotal + taxAmount;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: packageDetails.price.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'EEEE, MMMM d, yyyy');
    } catch {
      return dateString;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="font-poppins font-semibold text-xl text-gray-900 mb-6">
        Booking Summary
      </h3>

      {/* Package Info */}
      <div className="mb-6">
        <div className="flex items-start space-x-4">
          {packageDetails.images && packageDetails.images.length > 0 && (
            <img
              src={packageDetails.images[0]}
              alt={packageDetails.title}
              className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
            />
          )}
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 mb-1">
              {packageDetails.title}
            </h4>
            <p className="text-sm text-gray-600 mb-2">
              {packageDetails.destination}
            </p>
            <div className="flex items-center text-sm text-gray-500">
              <svg
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {packageDetails.duration} days
            </div>
          </div>
        </div>
      </div>

      {/* Travel Details */}
      <div className="mb-6 pb-6 border-b border-gray-200">
        <h4 className="font-medium text-gray-900 mb-3">Travel Details</h4>
        <div className="space-y-2 text-sm">
          {selectedDate && (
            <div className="flex justify-between">
              <span className="text-gray-600">Departure Date:</span>
              <span className="font-medium text-gray-900">
                {formatDate(selectedDate)}
              </span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-600">Duration:</span>
            <span className="font-medium text-gray-900">
              {packageDetails.duration} days
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Travelers:</span>
            <span className="font-medium text-gray-900">
              {adultCount} Adult{adultCount > 1 ? 's' : ''}
              {childCount > 0 && `, ${childCount} Child${childCount > 1 ? 'ren' : ''}`}
            </span>
          </div>
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3">Price Breakdown</h4>
        <div className="space-y-2 text-sm">
          {adultCount > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600">
                Adult × {adultCount} ({formatCurrency(adultPrice)} each)
              </span>
              <span className="font-medium text-gray-900">
                {formatCurrency(adultTotal)}
              </span>
            </div>
          )}
          {childCount > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600">
                Child × {childCount} ({formatCurrency(childPrice)} each)
              </span>
              <span className="font-medium text-gray-900">
                {formatCurrency(childTotal)}
              </span>
            </div>
          )}
          <div className="flex justify-between pt-2 border-t border-gray-200">
            <span className="text-gray-600">Subtotal:</span>
            <span className="font-medium text-gray-900">
              {formatCurrency(subtotal)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">VAT (7.5%):</span>
            <span className="font-medium text-gray-900">
              {formatCurrency(taxAmount)}
            </span>
          </div>
        </div>
      </div>

      {/* Total */}
      <div className="pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-gray-900">Total:</span>
          <span className="text-2xl font-bold text-brand-red">
            {formatCurrency(totalAmount)}
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-1 text-right">
          All prices in {packageDetails.price.currency}
        </p>
      </div>

      {/* Inclusions Preview */}
      {packageDetails.inclusions && packageDetails.inclusions.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="font-medium text-gray-900 mb-3">What's Included</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            {packageDetails.inclusions.slice(0, 4).map((inclusion, index) => (
              <li key={index} className="flex items-start">
                <svg
                  className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>{inclusion}</span>
              </li>
            ))}
            {packageDetails.inclusions.length > 4 && (
              <li className="text-xs text-gray-500 ml-6">
                +{packageDetails.inclusions.length - 4} more inclusions
              </li>
            )}
          </ul>
        </div>
      )}

      {/* Cancellation Policy */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="font-medium text-gray-900 mb-2">Cancellation Policy</h4>
        <div className="text-xs text-gray-600 space-y-1">
          <p>• Free cancellation up to 30 days before departure</p>
          <p>• 50% refund for cancellations 15-29 days before departure</p>
          <p>• 25% refund for cancellations 7-14 days before departure</p>
          <p>• No refund for cancellations within 7 days of departure</p>
        </div>
      </div>

      {/* Contact Info */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="bg-blue-50 rounded-lg p-3">
          <div className="flex items-start">
            <svg
              className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="text-sm">
              <p className="font-medium text-blue-900 mb-1">Need Help?</p>
              <p className="text-blue-700">
                Contact our travel experts at{' '}
                <a
                  href="tel:+2348123456789"
                  className="font-medium hover:underline"
                >
                  +234 812 345 6789
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}