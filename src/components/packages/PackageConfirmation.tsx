'use client';

import { format } from 'date-fns';
import { PackageDetails, ParticipantInfo } from '@/types/api';

interface PackageConfirmationProps {
  confirmationData: {
    packageDetails?: PackageDetails;
    participants?: ParticipantInfo[];
    bookingReference: string;
    paymentReference: string;
    amount?: number;
    currency?: string;
    selectedDate?: string;
    specialRequests?: string;
    paymentVerification?: any;
  };
  onViewBookings: () => void;
  onBackToPackages: () => void;
}

export default function PackageConfirmation({
  confirmationData,
  onViewBookings,
  onBackToPackages
}: PackageConfirmationProps) {
  const {
    packageDetails,
    participants = [],
    bookingReference,
    paymentReference,
    amount,
    currency = 'NGN',
    selectedDate,
    specialRequests,
    paymentVerification
  } = confirmationData;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: currency,
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

  const formatDateTime = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy \'at\' h:mm a');
    } catch {
      return dateString;
    }
  };

  const adultCount = participants.filter(p => p.type === 'adult').length;
  const childCount = participants.filter(p => p.type === 'child').length;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Booking Reference Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="text-center">
          <h2 className="font-poppins font-bold text-2xl text-gray-900 mb-2">
            Booking Confirmed
          </h2>
          <p className="text-gray-600 mb-4">
            Your travel package has been successfully booked
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 inline-block">
            <p className="text-sm text-green-700 mb-1">Booking Reference</p>
            <p className="font-mono text-xl font-bold text-green-900">
              {bookingReference}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Package Details */}
        <div className="space-y-6">
          {/* Package Information */}
          {packageDetails && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-lg text-gray-900 mb-4">
                Package Details
              </h3>
              
              <div className="flex items-start space-x-4 mb-4">
                {packageDetails.images && packageDetails.images.length > 0 && (
                  <img
                    src={packageDetails.images[0]}
                    alt={packageDetails.title}
                    className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                  />
                )}
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">
                    {packageDetails.title}
                  </h4>
                  <p className="text-gray-600 mb-2">
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
          )}

          {/* Participants */}
          {participants.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-lg text-gray-900 mb-4">
                Travelers
              </h3>
              <div className="space-y-3">
                {participants.map((participant, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {participant.firstName} {participant.lastName}
                      </p>
                      <p className="text-sm text-gray-600">
                        {participant.type === 'adult' ? 'Adult' : 'Child'}
                        {participant.dateOfBirth && (
                          <span className="ml-2">
                            • Born {format(new Date(participant.dateOfBirth), 'MMM d, yyyy')}
                          </span>
                        )}
                      </p>
                      {participant.dietaryRequirements && (
                        <p className="text-xs text-blue-600 mt-1">
                          Dietary: {participant.dietaryRequirements}
                        </p>
                      )}
                    </div>
                    {index === 0 && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        Lead Traveler
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Special Requests */}
          {specialRequests && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-lg text-gray-900 mb-4">
                Special Requests
              </h3>
              <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                {specialRequests}
              </p>
            </div>
          )}
        </div>

        {/* Right Column - Payment & Actions */}
        <div className="space-y-6">
          {/* Payment Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-lg text-gray-900 mb-4">
              Payment Details
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Reference:</span>
                <span className="font-mono text-sm font-medium text-gray-900">
                  {paymentReference}
                </span>
              </div>
              {amount && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount Paid:</span>
                  <span className="font-semibold text-green-600">
                    {formatCurrency(amount)}
                  </span>
                </div>
              )}
              {paymentVerification?.paidAt && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Date:</span>
                  <span className="font-medium text-gray-900">
                    {formatDateTime(paymentVerification.paidAt)}
                  </span>
                </div>
              )}
              {paymentVerification?.channel && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="font-medium text-gray-900 capitalize">
                    {paymentVerification.channel}
                  </span>
                </div>
              )}
              <div className="pt-2 border-t border-gray-200">
                <div className="flex items-center text-green-600">
                  <svg
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="font-medium">Payment Confirmed</span>
                </div>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
            <h3 className="font-semibold text-lg text-blue-900 mb-4">
              What's Next?
            </h3>
            <div className="space-y-3 text-sm text-blue-800">
              <div className="flex items-start">
                <svg
                  className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span>
                  You'll receive a confirmation email with detailed itinerary and travel documents
                </span>
              </div>
              <div className="flex items-start">
                <svg
                  className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
                <span>
                  Our travel team will contact you within 24 hours to finalize arrangements
                </span>
              </div>
              <div className="flex items-start">
                <svg
                  className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <span>
                  Check your booking status and manage your trip in "My Bookings"
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={onViewBookings}
              className="w-full bg-brand-red hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              View My Bookings
            </button>
            <button
              onClick={onBackToPackages}
              className="w-full bg-white hover:bg-gray-50 text-gray-900 font-semibold py-3 px-6 rounded-lg border border-gray-300 transition-colors"
            >
              Browse More Packages
            </button>
          </div>

          {/* Contact Support */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Need Assistance?</h4>
            <p className="text-sm text-gray-600 mb-3">
              Our travel experts are here to help with any questions about your booking.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center text-gray-700">
                <svg
                  className="h-4 w-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <a
                  href="tel:+2348123456789"
                  className="hover:text-brand-red transition-colors"
                >
                  +234 812 345 6789
                </a>
              </div>
              <div className="flex items-center text-gray-700">
                <svg
                  className="h-4 w-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <a
                  href="mailto:support@thetravelplace.com"
                  className="hover:text-brand-red transition-colors"
                >
                  support@thetravelplace.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}