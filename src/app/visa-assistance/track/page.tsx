'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { ServiceLayout } from '@/components/layout'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { appConfig } from '@/lib/config'

const breadcrumbs = [
  { name: 'Home', href: '/' },
  { name: 'Visa Assistance', href: '/visa-applications' },
  { name: 'Track Application', href: '/visa-assistance/track' },
]

const statusColors: Record<string, string> = {
  Pending: '#f59e0b',
  'Under Review': '#0ea5e9',
  'Additional Documents Required': '#f59e0b',
  Approved: '#10b981',
  Rejected: '#ef4444',
}

export default function TrackApplicationPage() {
  const searchParams = useSearchParams()
  const refParam = searchParams.get('ref') || ''

  const [reference, setReference] = useState(refParam)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (refParam) lookup(refParam)
  }, [refParam])

  const lookup = async (ref: string) => {
    if (!ref.trim()) return
    setLoading(true)
    setError(null)
    setData(null)
    try {
      const res = await fetch(`${appConfig.apiBaseUrl}/visa-assistance/track/${encodeURIComponent(ref.trim())}`)
      const json = await res.json()
      if (!res.ok || !json.success) throw new Error(json.message || 'Application not found')
      setData(json.data)
    } catch (err: any) {
      setError(err.message || 'Could not find application')
    } finally {
      setLoading(false)
    }
  }

  const statusColor = data ? (statusColors[data.status] || '#6b7280') : '#6b7280'

  return (
    <ErrorBoundary>
      <ServiceLayout title="Track Visa Application" breadcrumbs={breadcrumbs} serviceName="Visa Assistance">
        <div className="max-w-2xl mx-auto py-12 px-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Track Your Application</h1>
          <p className="text-gray-500 mb-8">Enter your application reference number to check the current status.</p>

          {/* Search */}
          <div className="flex gap-3 mb-8">
            <input
              type="text"
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none text-sm bg-white"
              placeholder="e.g. VISA-1234567890-ABCDE"
              value={reference}
              onChange={e => setReference(e.target.value.toUpperCase())}
              onKeyDown={e => e.key === 'Enter' && lookup(reference)}
              onFocus={e => (e.currentTarget.style.borderColor = '#e21e24')}
              onBlur={e => (e.currentTarget.style.borderColor = '#e5e7eb')}
            />
            <button
              onClick={() => lookup(reference)}
              disabled={loading || !reference.trim()}
              className="px-6 py-3 rounded-xl font-bold text-white disabled:opacity-50 transition-all duration-200"
              style={{ backgroundColor: '#e21e24' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#c41e24')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#e21e24')}
            >
              {loading ? <LoadingSpinner size="sm" color="white" /> : 'Track'}
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-xl p-4 text-sm text-red-700 bg-red-50 border border-red-200 mb-6">
              {error}
            </div>
          )}

          {/* Result */}
          {data && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="h-2 w-full" style={{ backgroundColor: statusColor }} />
              <div className="p-6 space-y-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Reference</p>
                    <p className="font-mono font-bold text-gray-900">{data.reference}</p>
                  </div>
                  <span
                    className="text-xs font-bold px-3 py-1.5 rounded-full"
                    style={{ backgroundColor: `${statusColor}20`, color: statusColor }}
                  >
                    {data.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400 mb-1">Destination</p>
                    <p className="font-semibold text-gray-900">{data.destinationCountry}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 mb-1">Visa Type</p>
                    <p className="font-semibold text-gray-900">{data.visaType}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 mb-1">Payment</p>
                    <p className="font-semibold text-gray-900">{data.paymentStatus}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 mb-1">Service Fee</p>
                    <p className="font-semibold text-gray-900">
                      {data.fee > 0 ? `₦${data.fee.toLocaleString()}` : 'TBC'}
                    </p>
                  </div>
                  {data.assignedOfficer && (
                    <div className="col-span-2">
                      <p className="text-gray-400 mb-1">Assigned Officer</p>
                      <p className="font-semibold text-gray-900">{data.assignedOfficer}</p>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-gray-100 text-xs text-gray-400">
                  Submitted on {new Date(data.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
              </div>
            </div>
          )}
        </div>
      </ServiceLayout>
    </ErrorBoundary>
  )
}
