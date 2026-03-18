'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import ServiceFooter from '@/components/layout/ServiceFooter'
import { hotelService } from '@/lib/services/hotel-service'

interface ConfirmedBooking {
  orderId?: string
  hotel?: any
  guests?: any[]
  contactInfo?: any
  searchData?: any
  prebookedRate?: any
  excludedTaxes?: any[]
}

export default function HotelSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [booking, setBooking] = useState<ConfirmedBooking | null>(null)
  const [orderInfo, setOrderInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const orderId = searchParams.get('orderId')

    // Load confirmed booking from localStorage
    let stored: ConfirmedBooking = {}
    try {
      const raw = localStorage.getItem('confirmedHotelBooking')
      if (raw) stored = JSON.parse(raw)
    } catch { /* ignore */ }

    // If we have a Paystack reference instead (legacy flow), redirect to universal success
    const reference = searchParams.get('reference') || searchParams.get('trxref')
    if (!orderId && reference) {
      router.replace(`/success?service=hotel&reference=${reference}`)
      return
    }

    setBooking({ ...stored, orderId: orderId || stored.orderId })

    // Fetch ETG order info if we have an orderId
    const id = orderId || stored.orderId
    if (id) {
      hotelService.getOrderInfo(id)
        .then(info => setOrderInfo(info))
        .catch(err => {
          console.warn('Could not fetch order info:', err.message)
          // Non-fatal — we still show what we have from localStorage
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [searchParams, router])

  const hotel = booking?.hotel
  const searchData = booking?.searchData
  const guests = booking?.guests || []
  const contactInfo = booking?.contactInfo
  const excludedTaxes = booking?.excludedTaxes || []
  const primaryGuest = guests[0]

  const formatDate = (d?: string) =>
    d ? new Date(d + 'T12:00:00').toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500" />
          <p className="text-gray-600">Confirming your booking...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success banner */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Booking Confirmed</h1>
          <p className="text-gray-500 text-sm">
            {contactInfo?.email
              ? `A confirmation has been sent to ${contactInfo.email}`
              : 'Your hotel booking has been confirmed.'}
          </p>
          {booking?.orderId && (
            <p className="mt-2 text-xs text-gray-400">Order ID: {booking.orderId}</p>
          )}
        </div>

        {/* Booking details card */}
        <div className="border border-gray-200 rounded-xl overflow-hidden mb-6">
          {/* Hotel header */}
          {hotel && (
            <div className="flex gap-4 p-5 border-b border-gray-100">
              {hotel.images?.[0] && (
                <img
                  src={hotel.images[0]}
                  alt={hotel.name}
                  className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                />
              )}
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{hotel.name}</h2>
                <p className="text-sm text-gray-500">
                  {hotel.location?.address && `${hotel.location.address}, `}
                  {hotel.location?.city}, {hotel.location?.country}
                </p>
                {hotel.stars > 0 && (
                  <div className="flex gap-0.5 mt-1">
                    {Array.from({ length: hotel.stars }).map((_, i) => (
                      <svg key={i} className="w-3.5 h-3.5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Stay details */}
          <div className="grid grid-cols-2 gap-px bg-gray-100">
            <div className="bg-white p-4">
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Check-in</p>
              <p className="text-sm font-medium text-gray-900">{formatDate(searchData?.checkin)}</p>
            </div>
            <div className="bg-white p-4">
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Check-out</p>
              <p className="text-sm font-medium text-gray-900">{formatDate(searchData?.checkout)}</p>
            </div>
            <div className="bg-white p-4">
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Guests</p>
              <p className="text-sm font-medium text-gray-900">
                {searchData?.adults || 1} adult{(searchData?.adults || 1) > 1 ? 's' : ''}
                {searchData?.children > 0 ? `, ${searchData.children} child${searchData.children > 1 ? 'ren' : ''}` : ''}
              </p>
            </div>
            <div className="bg-white p-4">
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Duration</p>
              <p className="text-sm font-medium text-gray-900">
                {searchData?.nights || hotel?.bookingInfo?.nights || 1} night{(searchData?.nights || 1) > 1 ? 's' : ''}
              </p>
            </div>
          </div>

          {/* Primary guest */}
          {primaryGuest && (
            <div className="p-4 border-t border-gray-100">
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Primary Guest</p>
              <p className="text-sm font-medium text-gray-900">
                {primaryGuest.title} {primaryGuest.firstName} {primaryGuest.lastName}
              </p>
              {contactInfo?.email && (
                <p className="text-sm text-gray-500">{contactInfo.email}</p>
              )}
            </div>
          )}

          {/* Room / rate info from ETG order */}
          {orderInfo?.room_name && (
            <div className="p-4 border-t border-gray-100">
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Room</p>
              <p className="text-sm font-medium text-gray-900">{orderInfo.room_name}</p>
              {orderInfo.meal && (
                <p className="text-xs text-gray-500 mt-0.5">{orderInfo.meal}</p>
              )}
            </div>
          )}

          {/* Excluded taxes (payable at property) */}
          {excludedTaxes.length > 0 && (
            <div className="p-4 border-t border-amber-100 bg-amber-50">
              <p className="text-xs font-medium text-amber-800 uppercase tracking-wide mb-2">Payable at property</p>
              {excludedTaxes.map((tax, i) => (
                <div key={i} className="flex justify-between text-sm text-amber-700">
                  <span>{tax.name}</span>
                  <span>{tax.currency} {parseFloat(tax.amount).toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}

          {/* Price */}
          {hotel?.pricePerNight && (
            <div className="p-4 border-t border-gray-100 flex justify-between items-center">
              <span className="text-sm text-gray-600">
                ₦{hotel.pricePerNight.toLocaleString()} × {searchData?.nights || hotel?.bookingInfo?.nights || 1} night{(searchData?.nights || 1) > 1 ? 's' : ''}
              </span>
              <span className="text-base font-semibold text-gray-900">
                ₦{(hotel.pricePerNight * (searchData?.nights || hotel?.bookingInfo?.nights || 1)).toLocaleString()}
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={() => router.push('/hotels')}
            className="flex-1 py-3 rounded-lg border-2 border-red-500 text-red-500 font-medium hover:bg-red-50 transition-colors"
          >
            Book another hotel
          </button>
          <button
            onClick={() => router.push('/')}
            className="flex-1 py-3 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition-colors"
          >
            Back to home
          </button>
        </div>
      </main>

      <ServiceFooter />
    </div>
  )
}