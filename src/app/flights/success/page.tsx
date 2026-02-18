'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function FlightSuccessPage() {
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
  return null
}