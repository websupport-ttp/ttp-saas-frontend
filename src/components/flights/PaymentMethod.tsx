'use client'

import { useState, useEffect } from 'react'
import PaymentMethodHeader from './PaymentMethodHeader'
import PaymentMethodForm from './PaymentMethodForm'
import CancellationPolicy from './CancellationPolicy'
import PaymentContinueWithChoice from './PaymentContinueWithChoice'
import { useAuth } from '@/contexts/auth-context'

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

interface PaymentMethodProps {
  onBack?: () => void
  onConfirmPay?: (paymentData: PaymentData) => void
}

function parseDuration(raw: string): string {
  const m = raw.match(/PT(?:(\d+)H)?(?:(\d+)M)?/)
  if (!m) return raw
  return `${m[1] ? m[1] + 'h' : ''}${m[2] ? ' ' + m[2] + 'm' : ''}`.trim()
}

function fmtTime(dt: string): string {
  if (!dt) return ''
  return new Date(dt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
}

function extractFlightDetails(flight: any, idx: number) {
  const itin = flight?.itineraries?.[idx]
  if (!itin) return null
  const segs = itin.segments || []
  if (!segs.length) return null
  const first = segs[0]
  const last = segs[segs.length - 1]
  let layover: string | undefined
  if (segs.length > 1) {
    const stopCode = segs[0].arrival?.iataCode
    layover = stopCode ? `Stop in ${stopCode}` : undefined
  }
  return {
    airline: first.carrierCode || '',
    flightNumber: `${first.carrierCode}${first.number}`,
    duration: parseDuration(itin.duration || ''),
    departureTime: fmtTime(first.departure?.at),
    arrivalTime: fmtTime(last.arrival?.at),
    layover,
  }
}

export default function PaymentMethod({ onBack, onConfirmPay }: PaymentMethodProps) {
  const { user } = useAuth()
  const userRole = (user?.role as string) || 'customer'
  const [selectedFlight, setSelectedFlight] = useState<any>(null)
  const [paymentData, setPaymentData] = useState<PaymentData>({
    paymentMethod: 'paystack', nameOnCard: '', cardNumber: '',
    expirationDate: '', ccv: '', saveCard: false, email: '', password: ''
  })

  useEffect(() => {
    try {
      const raw = localStorage.getItem('selectedFlight')
      if (raw) setSelectedFlight(JSON.parse(raw))
    } catch {}
  }, [])

  const outbound = extractFlightDetails(selectedFlight, 0)
  const returnFlt = extractFlightDetails(selectedFlight, 1)
  const basePrice = parseFloat(selectedFlight?.price?.total || '0')
  const providerCode =
    selectedFlight?.validatingAirlineCodes?.[0] ||
    selectedFlight?.itineraries?.[0]?.segments?.[0]?.carrierCode

  return (
    <div className="flex items-start justify-between gap-8 lg:gap-16 xl:gap-24 w-full">
      <div className="flex-1 max-w-[686px]">
        <div className="flex flex-col gap-8">
          <PaymentMethodHeader />
          <PaymentMethodForm onDataChange={setPaymentData} />
          <CancellationPolicy onBack={onBack} onConfirmPay={() => onConfirmPay?.(paymentData)} />
        </div>
      </div>
      <div className="flex-shrink-0 w-[400px]">
        <PaymentContinueWithChoice
          outboundFlight={outbound}
          returnFlight={returnFlt}
          basePrice={basePrice}
          providerCode={providerCode}
          userRole={userRole}
          onBack={onBack}
          onConfirmPay={() => onConfirmPay?.(paymentData)}
        />
      </div>
    </div>
  )
}