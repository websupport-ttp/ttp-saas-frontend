'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function VerifyPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'success' | 'error' | 'loading'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const statusParam = searchParams.get('status')
    const messageParam = searchParams.get('message')

    if (statusParam === 'success') {
      setStatus('success')
      setMessage(messageParam || 'Email verified successfully! You can now login.')
      
      // Auto-redirect to home after 5 seconds
      setTimeout(() => {
        router.push('/')
      }, 5000)
    } else if (statusParam === 'error') {
      setStatus('error')
      setMessage(messageParam || 'Verification failed. Please try again.')
    } else {
      setStatus('loading')
      setMessage('Verifying your email...')
    }
  }, [searchParams, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-red/10 via-white to-brand-blue/10 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Icon */}
          <div className="mb-6">
            {status === 'success' && (
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
            
            {status === 'error' && (
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            )}
            
            {status === 'loading' && (
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="animate-spin w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            )}
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {status === 'success' && 'Email Verified!'}
            {status === 'error' && 'Verification Failed'}
            {status === 'loading' && 'Verifying...'}
          </h1>

          {/* Message */}
          <p className="text-gray-600 mb-6">
            {message}
          </p>

          {/* Actions */}
          <div className="space-y-3">
            {status === 'success' && (
              <>
                <Link
                  href="/"
                  className="block w-full bg-brand-red text-white py-3 px-6 rounded-lg font-medium hover:bg-brand-red-600 transition-colors"
                >
                  Go to Homepage
                </Link>
                <p className="text-sm text-gray-500">
                  Redirecting automatically in 5 seconds...
                </p>
              </>
            )}

            {status === 'error' && (
              <>
                <Link
                  href="/"
                  className="block w-full bg-brand-red text-white py-3 px-6 rounded-lg font-medium hover:bg-brand-red-600 transition-colors"
                >
                  Go to Homepage
                </Link>
                <p className="text-sm text-gray-600 mt-4">
                  Need help?{' '}
                  <a href="mailto:support@test.ttp.ng" className="text-brand-red hover:underline">
                    Contact Support
                  </a>
                </p>
              </>
            )}

            {status === 'loading' && (
              <p className="text-sm text-gray-500">
                Please wait while we verify your email...
              </p>
            )}
          </div>
        </div>

        {/* Additional Info */}
        {status === 'success' && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Your email has been verified. You can now access all features of The Travel Place.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
