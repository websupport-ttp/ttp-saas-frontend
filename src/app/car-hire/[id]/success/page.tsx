'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function CarHireSuccessRedirect() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Get the reference from URL params
    const reference = searchParams.get('reference') || searchParams.get('trxref')
    
    // Redirect to universal success page with service parameter
    const newUrl = `/success?service=car-hire${reference ? `&reference=${reference}` : ''}`
    router.replace(newUrl)
  }, [router, searchParams])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red mb-4"></div>
        <p className="text-gray-600">Redirecting to booking confirmation...</p>
      </div>
    </div>
  )
}