'use client'

import { useState } from 'react'
import PaymentMethodHeader from './PaymentMethodHeader'
import PaymentMethodForm from './PaymentMethodForm'
import CancellationPolicy from './CancellationPolicy'
import PaymentContinueWithChoice from './PaymentContinueWithChoice'

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

export default function PaymentMethod({
  onBack,
  onConfirmPay
}: PaymentMethodProps) {
  const [paymentData, setPaymentData] = useState<PaymentData>({
    paymentMethod: 'paystack',
    nameOnCard: '',
    cardNumber: '',
    expirationDate: '',
    ccv: '',
    saveCard: false,
    email: '',
    password: ''
  })

  const handleDataChange = (data: PaymentData) => {
    setPaymentData(data)
  }

  const handleConfirmPay = () => {
    onConfirmPay?.(paymentData)
  }

  return (
    <div className="flex items-start justify-between gap-8 lg:gap-16 xl:gap-24 w-full">
      {/* Left Side - Payment Form */}
      <div className="flex-1 max-w-[686px]">
        <div className="flex flex-col gap-8">
          {/* Payment Method Header */}
          <PaymentMethodHeader />

          {/* Payment Method Form */}
          <PaymentMethodForm onDataChange={handleDataChange} />

          {/* Cancellation Policy */}
          <CancellationPolicy
            onBack={onBack}
            onConfirmPay={handleConfirmPay}
          />
        </div>
      </div>

      {/* Right Side - Flight Cart */}
      <div className="flex-shrink-0 w-[400px]">
        <PaymentContinueWithChoice
          onBack={onBack}
          onConfirmPay={handleConfirmPay}
        />
      </div>
    </div>
  )
}