'use client'

import { useState } from 'react'

interface BookingDetails {
  confirmationNumber: string
  bookingDate: string
  guestName: string
  email: string
  totalAmount: number
  subtotal: number
  taxes: number
  // Service-specific fields
  nights?: number
  adults?: number
  children?: number
  rooms?: number
  // Flight-specific fields
  passengers?: number
  departure?: string
  arrival?: string
  flightClass?: string
  // Insurance-specific fields
  policyNumber?: string
  coveragePeriod?: string
  // Visa-specific fields
  applicationId?: string
  processingTime?: string
  // Package-specific fields
  packageDuration?: string
  packageType?: string
  // Car-hire-specific fields
  rentalDays?: number
  carModel?: string
}

interface ServiceDetails {
  id: string
  name: string
  type: 'hotel' | 'flight' | 'insurance' | 'visa' | 'package' | 'car-hire'
  location?: {
    city: string
    country: string
  }
  pricePerNight?: number
  images?: string[]
  // Flight-specific
  airline?: string
  flightNumber?: string
  route?: string
  // Insurance-specific
  provider?: string
  planType?: string
  // Visa-specific
  country?: string
  visaType?: string
  // Package-specific
  duration?: string
  packageType?: string
  // Car-hire-specific
  carModel?: string
  rentalDays?: number
}

interface PaymentMethod {
  cardNumber: string
  cardholderName: string
  expiryDate: string
  cardType: string
}

interface UniversalSuccessPageProps {
  serviceDetails: ServiceDetails
  bookingDetails: BookingDetails
  paymentMethod: PaymentMethod
  currency?: string
  onViewBooking?: () => void
  onBookAnother?: () => void
  bookingReference?: string
}

export default function UniversalSuccessPage({
  serviceDetails,
  bookingDetails,
  paymentMethod,
  currency = 'NGN',
  onViewBooking,
  onBookAnother,
  bookingReference
}: UniversalSuccessPageProps) {
  const [showBookingDetails, setShowBookingDetails] = useState(false)

  const formatCurrency = (amount: number) => {
    if (currency === 'NGN') {
      return `₦${amount.toLocaleString()}`
    }
    return `$${amount.toFixed(2)}`
  }

  const getServiceIcon = () => {
    switch (serviceDetails.type) {
      case 'hotel':
        return (
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        )
      case 'flight':
        return (
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        )
      case 'insurance':
        return (
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        )
      case 'visa':
        return (
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )
      case 'package':
        return (
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        )
      case 'car-hire':
        return (
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        )
      default:
        return (
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )
    }
  }

  const getSuccessMessage = () => {
    switch (serviceDetails.type) {
      case 'hotel':
        return {
          title: 'Hotel Booking Confirmed!',
          subtitle: 'Your hotel reservation has been successfully confirmed.'
        }
      case 'flight':
        return {
          title: 'Flight Booking Confirmed!',
          subtitle: 'Your flight has been successfully booked.'
        }
      case 'insurance':
        return {
          title: 'Insurance Policy Confirmed!',
          subtitle: 'Your travel insurance policy has been successfully purchased.'
        }
      case 'visa':
        return {
          title: 'Visa Application Submitted!',
          subtitle: 'Your visa application has been successfully submitted.'
        }
      case 'package':
        return {
          title: 'Package Booking Confirmed!',
          subtitle: 'Your travel package has been successfully booked.'
        }
      case 'car-hire':
        return {
          title: 'Car Rental Confirmed!',
          subtitle: 'Your car rental has been successfully booked.'
        }
      default:
        return {
          title: 'Booking Confirmed!',
          subtitle: 'Your booking has been successfully confirmed.'
        }
    }
  }

  const getActionButtonText = () => {
    switch (serviceDetails.type) {
      case 'hotel':
        return 'Book Another Hotel'
      case 'flight':
        return 'Book Another Flight'
      case 'insurance':
        return 'Buy More Insurance'
      case 'visa':
        return 'Apply for Another Visa'
      case 'package':
        return 'Book Another Package'
      case 'car-hire':
        return 'Rent Another Car'
      default:
        return 'Book Another Service'
    }
  }

  const renderServiceSpecificDetails = () => {
    switch (serviceDetails.type) {
      case 'hotel':
        return (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Check-in - Check-out</p>
              <p className="font-medium text-gray-900">{bookingDetails.nights} Night{bookingDetails.nights !== 1 ? 's' : ''}</p>
            </div>
            <div>
              <p className="text-gray-500">Guests</p>
              <p className="font-medium text-gray-900">{bookingDetails.adults} Adult{bookingDetails.adults !== 1 ? 's' : ''}, {bookingDetails.children} Children</p>
            </div>
            <div>
              <p className="text-gray-500">Rooms</p>
              <p className="font-medium text-gray-900">{bookingDetails.rooms} Room{bookingDetails.rooms !== 1 ? 's' : ''}</p>
            </div>
            <div>
              <p className="text-gray-500">Rate</p>
              <p className="font-medium text-gray-900">{formatCurrency(serviceDetails.pricePerNight || 0)}/night</p>
            </div>
          </div>
        )
      case 'flight':
        return (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Route</p>
              <p className="font-medium text-gray-900">{serviceDetails.route || 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-500">Passengers</p>
              <p className="font-medium text-gray-900">{bookingDetails.passengers} Passenger{bookingDetails.passengers !== 1 ? 's' : ''}</p>
            </div>
            <div>
              <p className="text-gray-500">Class</p>
              <p className="font-medium text-gray-900">{bookingDetails.flightClass || 'Economy'}</p>
            </div>
            <div>
              <p className="text-gray-500">Airline</p>
              <p className="font-medium text-gray-900">{serviceDetails.airline || 'N/A'}</p>
            </div>
          </div>
        )
      case 'insurance':
        return (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Policy Number</p>
              <p className="font-medium text-gray-900">{bookingDetails.policyNumber || 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-500">Coverage Period</p>
              <p className="font-medium text-gray-900">{bookingDetails.coveragePeriod || 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-500">Provider</p>
              <p className="font-medium text-gray-900">{serviceDetails.provider || 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-500">Plan Type</p>
              <p className="font-medium text-gray-900">{serviceDetails.planType || 'N/A'}</p>
            </div>
          </div>
        )
      case 'visa':
        return (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Application ID</p>
              <p className="font-medium text-gray-900">{bookingDetails.applicationId || 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-500">Processing Time</p>
              <p className="font-medium text-gray-900">{bookingDetails.processingTime || 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-500">Country</p>
              <p className="font-medium text-gray-900">{serviceDetails.country || 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-500">Visa Type</p>
              <p className="font-medium text-gray-900">{serviceDetails.visaType || 'N/A'}</p>
            </div>
          </div>
        )
      case 'package':
        return (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Package Type</p>
              <p className="font-medium text-gray-900">{serviceDetails.packageType || 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-500">Duration</p>
              <p className="font-medium text-gray-900">{bookingDetails.packageDuration || serviceDetails.duration || 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-500">Location</p>
              <p className="font-medium text-gray-900">{serviceDetails.location ? `${serviceDetails.location.city}, ${serviceDetails.location.country}` : 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-500">Package ID</p>
              <p className="font-medium text-gray-900">{serviceDetails.id}</p>
            </div>
          </div>
        )
      case 'car-hire':
        return (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Car Model</p>
              <p className="font-medium text-gray-900">{serviceDetails.carModel || 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-500">Rental Days</p>
              <p className="font-medium text-gray-900">{bookingDetails.rentalDays || serviceDetails.rentalDays || 'N/A'} day{(bookingDetails.rentalDays || serviceDetails.rentalDays || 1) !== 1 ? 's' : ''}</p>
            </div>
            <div>
              <p className="text-gray-500">Location</p>
              <p className="font-medium text-gray-900">{serviceDetails.location ? `${serviceDetails.location.city}, ${serviceDetails.location.country}` : 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-500">Booking ID</p>
              <p className="font-medium text-gray-900">{serviceDetails.id}</p>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  const successMessage = getSuccessMessage()

  return (
    <div className="max-w-4xl mx-auto">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          {getServiceIcon()}
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{successMessage.title}</h1>
        <p className="text-gray-600">{successMessage.subtitle}</p>
        {bookingReference && (
          <p className="text-sm text-gray-500 mt-2">
            Booking Reference: <span className="font-medium">{bookingReference}</span>
          </p>
        )}
      </div>

      {/* Service Summary */}
      <div className="bg-white rounded-lg border border-gray-200 mb-8">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            {serviceDetails.type === 'hotel' ? 'Hotel' : 
             serviceDetails.type === 'flight' ? 'Flight' : 
             serviceDetails.type === 'insurance' ? 'Insurance' : 
             serviceDetails.type === 'visa' ? 'Visa' : 'Service'} Summary
          </h2>
          
          {/* Service Details */}
          <div className="border border-gray-200 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-4">
              {serviceDetails.images && serviceDetails.images[0] && (
                <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={serviceDetails.images[0]}
                    alt={serviceDetails.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">{serviceDetails.name}</h3>
                    {serviceDetails.location && (
                      <p className="text-gray-600 text-sm">{serviceDetails.location.city}, {serviceDetails.location.country}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatCurrency(bookingDetails.totalAmount)}</p>
                    <p className="text-sm text-gray-500">total</p>
                  </div>
                </div>
                
                {renderServiceSpecificDetails()}
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
              <h3 className="font-medium text-gray-900 mb-3">Customer Information</h3>
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
          {getActionButtonText()}
        </button>
      </div>
    </div>
  )
}