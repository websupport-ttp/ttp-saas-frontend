'use client'

import { useState, useEffect } from 'react'
import PassengerInfoHeader from './PassengerInfoHeader'
import PassengerInfoForm from './PassengerInfoForm'
import ContinueWithChoice from './ContinueWithChoice'
import { PassengerData } from '@/types'
import { useAuth } from '@/contexts/auth-context'

interface PassengerInfoProps {
  onBack?: () => void
  onProceed?: (passengerData: PassengerData) => void
}

export default function PassengerInfo({ onBack, onProceed }: PassengerInfoProps) {
  const { user } = useAuth()
  const [passengerData, setPassengerData] = useState<PassengerData>({
    firstName: '', middle: '', lastName: '', suffix: '',
    dateOfBirth: '', email: '', phone: '',
    redressNumber: '', knownTravellerNumber: '',
    emergencyFirstName: '', emergencyLastName: '',
    emergencyEmail: '', emergencyPhone: '',
    sameAsPassenger: false, title: 'Mr',
    countryCode: 'NG', dialCode: '+234', agreeToTerms: false
  })
  const [isFormValid, setIsFormValid] = useState(false)
  const [flightSummary, setFlightSummary] = useState<{
    outboundFlight: any
    returnFlight: any
    basePrice: number
    providerCode?: string
  }>({ outboundFlight: null, returnFlight: null, basePrice: 0 })

  // Load selected flight from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem('selectedFlight')
      if (!raw) return
      const flight = JSON.parse(raw)

      const basePrice = parseFloat(flight.price?.total || '0')
      const providerCode =
        flight.validatingAirlineCodes?.[0] ||
        flight.itineraries?.[0]?.segments?.[0]?.carrierCode

      const seg0 = flight.itineraries?.[0]?.segments?.[0]
      const seg0Last = flight.itineraries?.[0]?.segments?.slice(-1)[0]
      const outbound = seg0 ? {
        airline: seg0.carrierCode || providerCode || '',
        flightNumber: `${seg0.carrierCode}${seg0.number}`,
        duration: flight.itineraries?.[0]?.duration?.replace('PT', '').toLowerCase() || '',
        departureTime: seg0.departure?.at?.slice(11, 16) || '',
        arrivalTime: seg0Last?.arrival?.at?.slice(11, 16) || '',
      } : null

      const seg1 = flight.itineraries?.[1]?.segments?.[0]
      const seg1Last = flight.itineraries?.[1]?.segments?.slice(-1)[0]
      const returnFlight = seg1 ? {
        airline: seg1.carrierCode || providerCode || '',
        flightNumber: `${seg1.carrierCode}${seg1.number}`,
        duration: flight.itineraries?.[1]?.duration?.replace('PT', '').toLowerCase() || '',
        departureTime: seg1.departure?.at?.slice(11, 16) || '',
        arrivalTime: seg1Last?.arrival?.at?.slice(11, 16) || '',
      } : null

      setFlightSummary({ outboundFlight: outbound, returnFlight, basePrice, providerCode })
    } catch {
      // ignore parse errors
    }
  }, [])

  // Validate form
  useEffect(() => {
    const required = ['firstName', 'lastName', 'dateOfBirth', 'email', 'phone']
    const valid = required.every(f => {
      const v = passengerData[f as keyof PassengerData]
      return v && v.toString().trim() !== ''
    }) && Boolean(passengerData.agreeToTerms)
    setIsFormValid(valid)
  }, [passengerData])

  return (
    <div className="flex flex-col gap-8 w-full">
      <PassengerInfoHeader />
      <div className="flex items-start justify-between gap-8 lg:gap-16 xl:gap-24">
        <div className="flex-1 max-w-[648px]">
          <PassengerInfoForm
            passengerNumber={1}
            passengerType="Adult"
            onDataChange={(data) => setPassengerData(data)}
          />
        </div>
        <div className="flex-shrink-0 w-[400px]">
          <ContinueWithChoice
            outboundFlight={flightSummary.outboundFlight}
            returnFlight={flightSummary.returnFlight}
            basePrice={flightSummary.basePrice}
            providerCode={flightSummary.providerCode}
            userRole={user?.role || 'guest'}
            onBack={onBack}
            onProceed={() => { if (isFormValid) onProceed?.(passengerData) }}
            isFormValid={isFormValid}
          />
        </div>
      </div>
    </div>
  )
}
