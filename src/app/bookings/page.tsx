'use client'

import { useState, useEffect } from 'react'
import { ServiceLayout } from '@/components/layout'
import { flightService } from '@/lib/services/flight-service'
import { useSimpleAuth } from '@/contexts/simple-auth-context'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import ErrorMessage from '@/components/ui/ErrorMessage'
import { Button } from '@/components/ui/Button'
import ErrorBoundary from '@/components/ui/ErrorBoundary'

interface Booking {
  id: string
  type: 'flight' | 'hotel' | 'visa' | 'insurance' | 'package'
  reference: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'failed'
  createdAt: string
  updatedAt: string
  details: any
  payment: {
    status: 'pending' | 'paid' | 'failed' | 'refunded'
    amount: number
    currency: string
    reference: string
    paidAt?: string
  }
}

export default function BookingsPage() {
  const { user, isAuthenticated } = useSimpleAuth()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | undefined>()
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)

  const breadcrumbs = [
    { name: 'Home', href: '/' },
    { name: 'My Bookings', href: '/bookings' },
  ]

  useEffect(() => {
    if (isAuthenticated) {
      loadBookings()
    } else {
      setIsLoading(false)
      setError('Please log in to view your bookings')
    }
  }, [isAuthenticated])

  const loadBookings = async () => {
    try {
      setIsLoading(true)
      setError(undefined)
      const userBookings = await flightService.getUserBookings()
      setBookings(userBookings)
    } catch (err: any) {
      console.error('Error loading bookings:', err)
      setError(err.message || 'Failed to load bookings')
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'completed':
      case 'paid':
        return 'text-green-600 bg-green-100'
      case 'pending':
        return 'text-yellow-600 bg-yellow-100'
      case 'cancelled':
      case 'failed':
        return 'text-red-600 bg-red-100'
      case 'refunded':
        return 'text-blue-600 bg-blue-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const formatPrice = (amount: number, currency: string = 'NGN') => {
    if (currency === 'NGN') {
      return `₦${amount.toLocaleString()}`
    }
    return `${amount.toLocaleString()}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getBookingTypeIcon = (type: string) => {
    switch (type) {
      case 'flight':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        )
      case 'hotel':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        )
      case 'visa':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )
      case 'insurance':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        )
      case 'package':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        )
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        )
    }
  }

  if (!isAuthenticated) {
    return (
      <ErrorBoundary>
        <ServiceLayout
          title="My Bookings"
          description="View and manage your travel bookings"
          breadcrumbs={breadcrumbs}
          serviceName="Bookings"
        >
          <div className="max-w-4xl mx-auto py-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Log In</h2>
              <p className="text-gray-600 mb-6">You need to be logged in to view your bookings.</p>
              <Button
                variant="primary"
                onClick={() => window.location.href = '/auth/login'}
              >
                Log In
              </Button>
            </div>
          </div>
        </ServiceLayout>
      </ErrorBoundary>
    )
  }

  return (
    <ErrorBoundary>
      <ServiceLayout
        title="My Bookings"
        description="View and manage your travel bookings"
        breadcrumbs={breadcrumbs}
        serviceName="Bookings"
      >
        <div className="max-w-6xl mx-auto py-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
              <p className="text-gray-600 mt-2">View and manage all your travel bookings</p>
            </div>
            <Button
              variant="outline"
              onClick={loadBookings}
              disabled={isLoading}
            >
              Refresh
            </Button>
          </div>

          {isLoading && (
            <div className="flex flex-col items-center py-12">
              <LoadingSpinner size="lg" />
              <p className="text-gray-600 mt-4">Loading your bookings...</p>
            </div>
          )}

          {error && (
            <div className="mb-8">
              <ErrorMessage 
                message={error}
                onRetry={loadBookings}
                variant="card"
              />
            </div>
          )}

          {!isLoading && !error && bookings.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No bookings found</h3>
              <p className="text-gray-600 mb-6">You haven't made any bookings yet.</p>
              <Button
                variant="primary"
                onClick={() => window.location.href = '/flights'}
              >
                Book a Flight
              </Button>
            </div>
          )}

          {!isLoading && !error && bookings.length > 0 && (
            <div className="space-y-6">
              {bookings.map((booking) => (
                <div key={booking.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600">
                        {getBookingTypeIcon(booking.type)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 capitalize">
                            {booking.type} Booking
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                            {booking.status}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                          <div>
                            <p><span className="font-medium">Reference:</span> {booking.reference}</p>
                            <p><span className="font-medium">Booked:</span> {formatDate(booking.createdAt)}</p>
                          </div>
                          <div>
                            <p><span className="font-medium">Amount:</span> {formatPrice(booking.payment.amount, booking.payment.currency)}</p>
                            <p>
                              <span className="font-medium">Payment:</span> 
                              <span className={`ml-1 px-2 py-0.5 rounded text-xs ${getStatusColor(booking.payment.status)}`}>
                                {booking.payment.status}
                              </span>
                            </p>
                          </div>
                        </div>

                        {booking.type === 'flight' && booking.details && (
                          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Route:</span> {booking.details.route || 'Flight details'}
                            </p>
                            {booking.details.departureDate && (
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Departure:</span> {formatDate(booking.details.departureDate)}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex-shrink-0 flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedBooking(booking)}
                      >
                        View Details
                      </Button>
                      
                      {booking.status === 'confirmed' && booking.type === 'flight' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            // Download e-ticket functionality
                            console.log('Download e-ticket for:', booking.reference)
                          }}
                        >
                          Download Ticket
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Booking Details Modal */}
          {selectedBooking && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Booking Details</h2>
                    <button
                      onClick={() => setSelectedBooking(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Booking Information</h3>
                        <div className="space-y-2 text-sm">
                          <p><span className="font-medium">Reference:</span> {selectedBooking.reference}</p>
                          <p><span className="font-medium">Type:</span> {selectedBooking.type}</p>
                          <p><span className="font-medium">Status:</span> 
                            <span className={`ml-1 px-2 py-0.5 rounded text-xs ${getStatusColor(selectedBooking.status)}`}>
                              {selectedBooking.status}
                            </span>
                          </p>
                          <p><span className="font-medium">Created:</span> {formatDate(selectedBooking.createdAt)}</p>
                          <p><span className="font-medium">Updated:</span> {formatDate(selectedBooking.updatedAt)}</p>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Payment Information</h3>
                        <div className="space-y-2 text-sm">
                          <p><span className="font-medium">Amount:</span> {formatPrice(selectedBooking.payment.amount, selectedBooking.payment.currency)}</p>
                          <p><span className="font-medium">Status:</span> 
                            <span className={`ml-1 px-2 py-0.5 rounded text-xs ${getStatusColor(selectedBooking.payment.status)}`}>
                              {selectedBooking.payment.status}
                            </span>
                          </p>
                          <p><span className="font-medium">Reference:</span> {selectedBooking.payment.reference}</p>
                          {selectedBooking.payment.paidAt && (
                            <p><span className="font-medium">Paid At:</span> {formatDate(selectedBooking.payment.paidAt)}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {selectedBooking.details && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Booking Details</h3>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <pre className="text-sm text-gray-600 whitespace-pre-wrap">
                            {JSON.stringify(selectedBooking.details, null, 2)}
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
                    <Button
                      variant="outline"
                      onClick={() => setSelectedBooking(null)}
                    >
                      Close
                    </Button>
                    {selectedBooking.status === 'confirmed' && (
                      <Button
                        variant="primary"
                        onClick={() => {
                          // Contact support functionality
                          console.log('Contact support for:', selectedBooking.reference)
                        }}
                      >
                        Contact Support
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ServiceLayout>
    </ErrorBoundary>
  )
}