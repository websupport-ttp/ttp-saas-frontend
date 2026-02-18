'use client'

import { useState, useEffect } from 'react'
import PassengerInfoHeader from './PassengerInfoHeader'
import PassengerInfoForm from './PassengerInfoForm'
import ContinueWithChoice from './ContinueWithChoice'
import { PassengerData } from '@/types'

interface PassengerInfoProps {
  onBack?: () => void
  onProceed?: (passengerData: PassengerData) => void
}

export default function PassengerInfo({
  onBack,
  onProceed
}: PassengerInfoProps) {
  const [passengerData, setPassengerData] = useState<PassengerData>({
    firstName: '',
    middle: '',
    lastName: '',
    suffix: '',
    dateOfBirth: '',
    email: '',
    phone: '',
    redressNumber: '',
    knownTravellerNumber: '',
    emergencyFirstName: '',
    emergencyLastName: '',
    emergencyEmail: '',
    emergencyPhone: '',
    sameAsPassenger: false,
    title: 'Mr',
    countryCode: 'NG',
    dialCode: '+234',
    agreeToTerms: false
  })

  const [isFormValid, setIsFormValid] = useState(false)

  // Validate form whenever passenger data changes
  useEffect(() => {
    const requiredFields = [
      'firstName',
      'lastName', 
      'dateOfBirth',
      'email',
      'phone'
    ]

    const isValid = requiredFields.every(field => {
      const value = passengerData[field as keyof PassengerData]
      return value && value.toString().trim() !== ''
    }) && Boolean(passengerData.agreeToTerms)

    setIsFormValid(isValid)
  }, [passengerData])

  const handleDataChange = (data: PassengerData) => {
    setPassengerData(data)
  }

  const handleProceed = () => {
    if (isFormValid) {
      onProceed?.(passengerData)
    }
  }

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Header */}
      <PassengerInfoHeader />

      {/* Main Content */}
      <div className="flex items-start justify-between gap-8 lg:gap-16 xl:gap-24">
        {/* Form Section */}
        <div className="flex-1 max-w-[648px]">
          <PassengerInfoForm
            passengerNumber={1}
            passengerType="Adult"
            onDataChange={handleDataChange}
          />
        </div>

        {/* Continue Section */}
        <div className="flex-shrink-0 w-[400px]">
          <ContinueWithChoice
            onBack={onBack}
            onProceed={handleProceed}
            isFormValid={isFormValid}
          />
        </div>
      </div>
    </div>
  )
}