'use client';

import { BookingConfirmationProps } from '@/types/hotels';
import { formatPrice, formatDate } from '@/lib/hotels';

export default function BookingConfirmation({ booking }: BookingConfirmationProps) {
  const { hotel, dates, guests, pricing, paymentMethod, confirmationNumber, createdAt } = booking;
  
  const adultGuests = guests.filter(guest => guest.type === 'Adult');
  const minorGuests = guests.filter(guest => guest.type === 'Minor');
  
  const getPaymentMethodDisplay = () => {
    switch (paymentMethod.method) {
      case 'paystack':
        return paymentMethod.cardDetails 
          ? `Paystack Card ending in ${paymentMethod.cardDetails.number.slice(-4)}`
          : 'Paystack';
      case 'google-pay':
        return 'Google Pay';
      case 'apple-pay':
        return 'Apple Pay';
      case 'paypal':
        return 'PayPal';
      default:
        return 'Payment Method';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
      <div className="mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Booking Confirmation</h2>
        <p className="text-gray-600 text-sm sm:text-base">
          Booked on {formatDate(createdAt)} • Confirmation #{confirmationNumber}
        </p>
      </div>

      {/* Hotel Information */}
      <div className="mb-6 sm:mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Hotel Details</h3>
        <div className="flex items-start gap-3 sm:gap-4">
          <img
            src={hotel.images[0]}
            alt={hotel.name}
            className="w-16 h-16 sm:w-24 sm:h-24 rounded-lg object-cover flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h4 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">{hotel.name}</h4>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              {hotel.location.address}
            </p>
            <p className="text-gray-600 text-sm sm:text-base">
              {hotel.location.city}, {hotel.location.country}
            </p>
            <p className="text-sm text-gray-500 mt-2">{hotel.classification}</p>
          </div>
        </div>
      </div>

      {/* Stay Details */}
      <div className="mb-6 sm:mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Stay Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Check-in</p>
            <p className="text-lg font-semibold text-gray-900 mt-1">{formatDate(dates.checkIn)}</p>
            <p className="text-sm text-gray-600">After 3:00 PM</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Check-out</p>
            <p className="text-lg font-semibold text-gray-900 mt-1">{formatDate(dates.checkOut)}</p>
            <p className="text-sm text-gray-600">Before 11:00 AM</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Duration</p>
            <p className="text-lg font-semibold text-gray-900 mt-1">
              {pricing.nights} night{pricing.nights !== 1 ? 's' : ''}
            </p>
            <p className="text-sm text-gray-600">{guests.length} guest{guests.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
      </div>

      {/* Guest Information */}
      <div className="mb-6 sm:mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Guest Information</h3>
        
        {adultGuests.length > 0 && (
          <div className="mb-4">
            <h4 className="text-md font-medium text-gray-700 mb-2">Adults ({adultGuests.length})</h4>
            <div className="space-y-2">
              {adultGuests.map((guest, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">
                      {guest.firstName} {guest.middleName ? `${guest.middleName} ` : ''}{guest.lastName}
                      {guest.suffix ? ` ${guest.suffix}` : ''}
                    </p>
                    <p className="text-sm text-gray-600">
                      DOB: {formatDate(guest.dateOfBirth)}
                    </p>
                  </div>
                  <div className="text-right">
                    {guest.email && (
                      <p className="text-sm text-gray-600">{guest.email}</p>
                    )}
                    {guest.phoneNumber && (
                      <p className="text-sm text-gray-600">{guest.phoneNumber}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {minorGuests.length > 0 && (
          <div>
            <h4 className="text-md font-medium text-gray-700 mb-2">Children ({minorGuests.length})</h4>
            <div className="space-y-2">
              {minorGuests.map((guest, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">
                      {guest.firstName} {guest.middleName ? `${guest.middleName} ` : ''}{guest.lastName}
                      {guest.suffix ? ` ${guest.suffix}` : ''}
                    </p>
                    <p className="text-sm text-gray-600">
                      DOB: {formatDate(guest.dateOfBirth)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Payment Information */}
      <div className="mb-6 sm:mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-medium text-gray-900">Payment Method</p>
              <p className="text-gray-600">{getPaymentMethodDisplay()}</p>
            </div>
            <div className="text-right">
              <p className="font-medium text-gray-900">Total Paid</p>
              <p className="text-xl font-bold text-green-600">{formatPrice(pricing.total)}</p>
            </div>
          </div>
          
          {/* Price Breakdown */}
          <div className="border-t border-gray-200 pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">
                Room rate ({pricing.nights} night{pricing.nights !== 1 ? 's' : ''})
              </span>
              <span className="text-gray-900">{formatPrice(pricing.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Taxes & fees</span>
              <span className="text-gray-900">{formatPrice(pricing.taxes)}</span>
            </div>
            <div className="border-t border-gray-200 pt-2">
              <div className="flex justify-between font-semibold">
                <span className="text-gray-900">Total</span>
                <span className="text-gray-900">{formatPrice(pricing.total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Important Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Important Information</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Please bring a valid photo ID for check-in</li>
          <li>• Free cancellation until 24 hours before check-in</li>
          <li>• Contact the hotel directly for special requests</li>
          <li>• Check-in time: 3:00 PM | Check-out time: 11:00 AM</li>
        </ul>
      </div>
    </div>
  );
}