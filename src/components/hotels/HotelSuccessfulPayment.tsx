'use client'

import { useState } from 'react'
import Image from 'next/image'

interface HotelBookingDetails {
  confirmationNumber: string
  bookingDate: string
  guestName: string
  email: string
  totalAmount: number
  subtotal: number
  taxes: number
  nights: number
  adults: number
  children: number
  rooms: number
}

interface HotelDetails {
  name: string
  location: {
    city: string
    country: string
  }
  pricePerNight: number
  bookingInfo: {
    nights: number
    adults: number
    children: number
    rooms: number
  }
  images: string[]
}

interface PaymentMethod {
  cardNumber: string
  cardholderName: string
  expiryDate: string
  cardType: string
}

interface HotelSuccessfulPaymentProps {
  hotel: HotelDetails
  bookingDetails: HotelBookingDetails
  paymentMethod: PaymentMethod
  currency?: string
  onViewBooking?: () => void
  onBookAnother?: () => void
  bookingReference?: string
  verificationStatus?: 'verifying' | 'success' | 'failed'
}

export default function HotelSuccessfulPayment({
  hotel,
  bookingDetails,
  paymentMethod,
  currency = 'USD',
  onViewBooking,
  onBookAnother,
  bookingReference,
  verificationStatus = 'success'
}: HotelSuccessfulPaymentProps) {
  const [showBookingDetails, setShowBookingDetails] = useState(false)

  const formatCurrency = (amount: number) => {
    if (currency === 'NGN') {
      return `₦${amount.toLocaleString()}`
    }
    return `$${amount.toFixed(2)}`
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Hotel Booking Confirmed!</h1>
        <p className="text-gray-600">Your hotel reservation has been successfully confirmed.</p>
        {bookingReference && (
          <p className="text-sm text-gray-500 mt-2">
            Booking Reference: <span className="font-medium">{bookingReference}</span>
          </p>
        )}
      </div>

      {/* Hotel Summary */}
      <div className="bg-white rounded-lg border border-gray-200 mb-8">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Hotel Summary</h2>
          
          {/* Hotel Booking Details */}
          <div className="border border-gray-200 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={hotel.images[0]}
                  alt={hotel.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">{hotel.name}</h3>
                    <p className="text-gray-600 text-sm">{hotel.location.city}, {hotel.location.country}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatCurrency(bookingDetails.totalAmount)}</p>
                    <p className="text-sm text-gray-500">total</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Check-in - Check-out</p>
                    <p className="font-medium text-gray-900">{bookingDetails.nights} Nights</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Guests</p>
                    <p className="font-medium text-gray-900">{bookingDetails.adults} Adult{bookingDetails.adults > 1 ? 's' : ''}, {bookingDetails.children} Children</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Rooms</p>
                    <p className="font-medium text-gray-900">{bookingDetails.rooms} Room{bookingDetails.rooms > 1 ? 's' : ''}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Rate</p>
                    <p className="font-medium text-gray-900">{formatCurrency(hotel.pricePerNight)}/night</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Details */}
      <div className="bg-white rounded-lg border border-gray-200 mb-8">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Booking Details</h2>
            <button
              onClick={() => setShowBookingDetails(!showBookingDetails)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              {showBookingDetails ? 'Hide Details' : 'Show Details'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Guest Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Name:</span>
                  <span className="text-gray-900">{bookingDetails.guestName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Email:</span>
                  <span className="text-gray-900">{bookingDetails.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Confirmation:</span>
                  <span className="text-gray-900">{bookingDetails.confirmationNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Booking Date:</span>
                  <span className="text-gray-900">{bookingDetails.bookingDate}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-3">Payment Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Payment Method:</span>
                  <span className="text-gray-900">{paymentMethod.cardNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Cardholder:</span>
                  <span className="text-gray-900">{paymentMethod.cardholderName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Status:</span>
                  <span className="text-green-600 font-medium">{paymentMethod.expiryDate}</span>
                </div>
              </div>
            </div>
          </div>

          {showBookingDetails && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="font-medium text-gray-900 mb-3">Price Breakdown</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal:</span>
                  <span className="text-gray-900">{formatCurrency(bookingDetails.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Taxes and Fees:</span>
                  <span className="text-gray-900">{formatCurrency(bookingDetails.taxes)}</span>
                </div>
                <div className="flex justify-between font-semibold text-base pt-2 border-t border-gray-200">
                  <span className="text-gray-900">Total:</span>
                  <span className="text-gray-900">{formatCurrency(bookingDetails.totalAmount)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={onViewBooking}
          className="px-6 py-3 border-2 border-red-500 text-red-500 bg-white rounded-lg hover:bg-red-50 transition-colors duration-200 font-medium"
        >
          View Booking Details
        </button>
        <button
          onClick={onBookAnother}
          className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 font-medium"
        >
          Book Another Hotel
        </button>
      </div>
    </div>
  )
}