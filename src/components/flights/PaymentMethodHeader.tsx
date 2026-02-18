'use client'

interface PaymentMethodHeaderProps {
  title?: string
  description?: string
}

export default function PaymentMethodHeader({
  title = "Payment method",
  description = "Select a payment method below. The Travelplace processes your payment securely with end-to-end encryption."
}: PaymentMethodHeaderProps) {
  return (
    <div className="flex flex-col gap-4 w-full">
      <h2 className="text-red-600 text-2xl font-bold leading-tight">
        {title}
      </h2>
      <p className="text-gray-600 text-lg leading-relaxed">
        {description}
      </p>
    </div>
  )
}