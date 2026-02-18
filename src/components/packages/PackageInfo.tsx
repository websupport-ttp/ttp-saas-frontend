'use client';

import { PackageDetails } from '@/types/api';

interface PackageInfoProps {
  packageDetails: PackageDetails;
}

export default function PackageInfo({ packageDetails }: PackageInfoProps) {
  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="space-y-6">
      {/* Description */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-3">About This Package</h3>
        <p className="text-gray-700 leading-relaxed">{packageDetails.description}</p>
      </div>

      {/* Pricing */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-3">Pricing</h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Adult (12+ years)</span>
              <span className="font-semibold text-gray-900">
                {formatPrice(packageDetails.price.adult, packageDetails.price.currency)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Child (2-11 years)</span>
              <span className="font-semibold text-gray-900">
                {formatPrice(packageDetails.price.child, packageDetails.price.currency)}
              </span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              * Prices are per person and may vary based on travel dates and availability
            </p>
          </div>
        </div>
      </div>

      {/* What's Included */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-3">What's Included</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {packageDetails.inclusions.map((inclusion, index) => (
            <div key={index} className="flex items-start space-x-2">
              <svg
                className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0"
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
              <span className="text-gray-700 text-sm">{inclusion}</span>
            </div>
          ))}
        </div>
      </div>

      {/* What's Not Included */}
      {packageDetails.exclusions && packageDetails.exclusions.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">What's Not Included</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {packageDetails.exclusions.map((exclusion, index) => (
              <div key={index} className="flex items-start space-x-2">
                <svg
                  className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                <span className="text-gray-700 text-sm">{exclusion}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Package Highlights */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-3">Package Highlights</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {packageDetails.itinerary.slice(0, 6).map((day, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-3">
              <h4 className="font-medium text-gray-900 mb-1">Day {day.day}</h4>
              <p className="text-sm text-gray-700 line-clamp-2">{day.title}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Important Information */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-3">Important Information</h3>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="space-y-2 text-sm text-gray-700">
            <p>• Passport required with at least 6 months validity</p>
            <p>• Visa requirements vary by nationality - check before booking</p>
            <p>• Travel insurance is highly recommended</p>
            <p>• Minimum 2 participants required for group tours</p>
            <p>• Itinerary may change due to weather or local conditions</p>
            <p>• Cancellation policy applies - see terms and conditions</p>
          </div>
        </div>
      </div>

      {/* Booking Terms */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-3">Booking Terms</h3>
        <div className="text-sm text-gray-700 space-y-2">
          <p>
            <strong>Deposit:</strong> 25% deposit required to secure booking, balance due 45 days before departure
          </p>
          <p>
            <strong>Cancellation:</strong> Free cancellation up to 60 days before departure, 50% refund 30-59 days, no refund within 30 days
          </p>
          <p>
            <strong>Changes:</strong> Changes subject to availability and may incur additional costs
          </p>
          <p>
            <strong>Age Restrictions:</strong> Some activities may have age restrictions - please inquire when booking
          </p>
        </div>
      </div>
    </div>
  );
}