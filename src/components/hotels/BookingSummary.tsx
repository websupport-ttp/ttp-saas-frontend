'use client';

import { BookingSummaryProps } from '@/types/hotels';
import { formatPrice, formatDate } from '@/lib/hotels';

export default function BookingSummary({ hotel, dates, guests, pricing }: BookingSummaryProps) {
  const adultCount = guests.filter(guest => guest.type === 'Adult').length;
  const minorCount = guests.filter(guest => guest.type === 'Minor').length;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h3>
      
      {/* Hotel Information */}
      <div className="mb-4 sm:mb-6">
        <div className="flex items-start gap-3 sm:gap-4">
          <img
            src={hotel.images[0]}
            alt={hotel.name}
            className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-gray-900 truncate">{hotel.name}</h4>
            <p className="text-sm text-gray-600 truncate">
              {hotel.location.city}, {hotel.location.country}
            </p>
            <p className="text-sm text-gray-500">{hotel.classification}</p>
          </div>
        </div>
      </div>

      {/* Dates */}
      <div className="mb-6 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Check-in</span>
          <span className="font-medium">{formatDate(dates.checkIn)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Check-out</span>
          <span className="font-medium">{formatDate(dates.checkOut)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Duration</span>
          <span className="font-medium">{dates.nights} night{dates.nights !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Guests */}
      <div className="mb-6 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Adults</span>
          <span className="font-medium">{adultCount}</span>
        </div>
        {minorCount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Children</span>
            <span className="font-medium">{minorCount}</span>
          </div>
        )}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Total Guests</span>
          <span className="font-medium">{guests.length}</span>
        </div>
      </div>

      {/* Pricing */}
      <div className="border-t border-gray-200 pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">
            {formatPrice(hotel.pricePerNight)} × {dates.nights} night{dates.nights !== 1 ? 's' : ''}
          </span>
          <span className="font-medium">{formatPrice(pricing.subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Taxes & fees</span>
          <span className="font-medium">{formatPrice(pricing.taxes)}</span>
        </div>
        <div className="border-t border-gray-200 pt-2">
          <div className="flex justify-between">
            <span className="font-semibold text-gray-900">Total</span>
            <span className="font-semibold text-gray-900 text-lg">{formatPrice(pricing.total)}</span>
          </div>
        </div>
      </div>

      {/* Modification Options */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex flex-col gap-3">
          <button className="text-left text-sm text-blue-600 hover:text-blue-800 transition-colors">
            Change dates
          </button>
          <button className="text-left text-sm text-blue-600 hover:text-blue-800 transition-colors">
            Modify guests
          </button>
          <button className="text-left text-sm text-blue-600 hover:text-blue-800 transition-colors">
            Select different room
          </button>
        </div>
      </div>

      {/* Policies */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          Free cancellation until 24 hours before check-in. After that, cancellation fees may apply.
        </p>
      </div>
    </div>
  );
}