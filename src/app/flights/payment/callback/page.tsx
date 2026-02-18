'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function FlightPaymentCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Get payment reference from URL parameters
    const reference = searchParams.get('reference') || searchParams.get('trxref')
    
    if (reference) {
      // Redirect to universal success page with flight service parameter
      router.replace(`/success?service=flight&reference=${reference}`)
    } else {
      // No reference found, redirect to universal success page anyway
      router.replace('/success?service=flight')
    }
  }, [searchParams, router])

  // This component will redirect immediately, so no UI needed
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        <p className="mt-4 text-gray-600">Redirecting to booking confirmation...</p>
      </div>
    </div>
  )
}