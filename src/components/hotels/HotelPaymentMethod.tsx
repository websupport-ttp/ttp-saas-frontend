'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import PaymentMethodHeader from '@/components/flights/PaymentMethodHeader'
import PaymentMethodForm from '@/components/flights/PaymentMethodForm'
import HotelCancellationPolicy from './HotelCancellationPolicy'
import HotelPaymentSidebar from './HotelPaymentSidebar'
import { hotelService } from '@/lib/services/hotel-service'
interface PaymentData {
  paymentMethod: 'paystack' | 'google' | 'apple' | 'paypal'
  nameOnCard: string
  cardNumber: string
  expirationDate: string
  ccv: string
  saveCard: boolean
  email: string
  password: string
}

interface HotelDetails {
  id: string
  name: string
  location: { city: string; country: string }
  pricePerNight: number
  bookingInfo: { nights: number; adults: number; children: number; rooms: number }
  images: string[]
}

interface HotelPaymentMethodProps {
  hotel: HotelDetails
  totalAmount: number
  guests?: any[]
  onBack?: () => void
  onConfirmPay?: (paymentData: PaymentData) => void
}

export default function HotelPaymentMethod({
  hotel,
  totalAmount,
  guests = [],
  onBack,
  onConfirmPay,
}: HotelPaymentMethodProps) {
  const router = useRouter()
  const [paymentData, setPaymentData] = useState<PaymentData>({
    paymentMethod: 'paystack',
    nameOnCard: '', cardNumber: '', expirationDate: '',
    ccv: '', saveCard: false, email: '', password: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [bookingError, setBookingError] = useState<string | null>(null)

  const handleDataChange = (data: PaymentData) => setPaymentData(data)

  const handleConfirmPay = async () => {
    setIsSubmitting(true)
    setBookingError(null)

    try {
      const urlParams = new URLSearchParams(window.location.search)

      // Parse contact + guest data from URL
      let contactInfo: any = null
      let guestData: any[] = []
      try {
        const cp = urlParams.get('contact')
        const gp = urlParams.get('guests')
        if (cp) contactInfo = JSON.parse(decodeURIComponent(cp))
        if (gp) guestData = JSON.parse(decodeURIComponent(gp))
      } catch { /* ignore */ }

      const allGuests = guestData.length ? guestData : guests
      const phone = contactInfo?.dialCode
        ? `${contactInfo.dialCode}${contactInfo.phoneNumber}`.replace(/\s/g, '')
        : '+2348000000000'

      // Try ETG flow if a prebooked rate exists
      const prebookedRaw = localStorage.getItem('prebookedRate')
      if (prebookedRaw) {
        const prebooked = JSON.parse(prebookedRaw)
        if (prebooked?.bookHash) {
          const etgGuests = allGuests.map((g: any) => ({
            first_name: g.firstName || 'Guest',
            last_name: g.lastName || 'User',
            ...(g.type === 'Minor' && g.dateOfBirth
              ? { age: Math.floor((Date.now() - new Date(g.dateOfBirth).getTime()) / (365.25 * 24 * 3600 * 1000)) }
              : {}),
          }))

          const formResult = await hotelService.createBookingForm({
            bookHash: prebooked.bookHash,
            guests: [{ guests: etgGuests }],
            userPhone: phone,
          })

          if (!formResult.orderId) throw new Error('No orderId returned from booking form')

          const bookingResult = await hotelService.startBooking({
            orderId: formResult.orderId,
            partnerOrderId: formResult.partnerOrderId,
            userPhone: phone,
          })

          if (bookingResult.status !== 'ok') {
            throw new Error(`Booking failed: ${bookingResult.error || bookingResult.status}`)
          }

          localStorage.setItem('confirmedHotelBooking', JSON.stringify({
            orderId: bookingResult.orderId,
            hotel,
            guests: allGuests,
            contactInfo,
            searchData: {
              checkin: urlParams.get('checkin'),
              checkout: urlParams.get('checkout'),
              nights: parseInt(urlParams.get('nights') || '1'),
              adults: parseInt(urlParams.get('adults') || '1'),
              children: parseInt(urlParams.get('children') || '0'),
            },
            prebookedRate: prebooked,
            excludedTaxes: prebooked.rate?.excludedTaxes || [],
          }))

          router.push(`/hotels/success?orderId=${bookingResult.orderId}`)
          return
        }
      }

      // Fallback: call onConfirmPay prop (legacy / non-ETG path)
      onConfirmPay?.(paymentData)
    } catch (err: any) {
      console.error('Hotel payment error:', err)
      setBookingError(err.message || 'Booking failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const nights = hotel.bookingInfo.nights || 1
  const rooms = hotel.bookingInfo.rooms || 1
  const subtotal = (hotel.pricePerNight || 0) * nights * rooms
  const taxesAndFees = Math.round(subtotal * 0.12)
  const priceSummary = { subtotal, taxesAndFees, total: subtotal + taxesAndFees }

  return (
    <div className="flex items-start justify-between gap-8 lg:gap-16 xl:gap-24 w-full">
      {/* Left — payment form */}
      <div className="flex-1 max-w-[686px] flex flex-col gap-8">
        <PaymentMethodHeader />
        <PaymentMethodForm onDataChange={handleDataChange} />
        <HotelCancellationPolicy />
        {bookingError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {bookingError}
          </div>
        )}
      </div>

      {/* Right — summary + confirm */}
      <div className="flex-shrink-0 w-[400px]">
        <HotelPaymentSidebar
          hotel={hotel}
          priceSummary={priceSummary}
          onBack={onBack}
          onConfirmPay={handleConfirmPay}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  )
}