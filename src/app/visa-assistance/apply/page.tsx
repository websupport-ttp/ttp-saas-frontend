'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ServiceLayout } from '@/components/layout'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import ErrorMessage from '@/components/ui/ErrorMessage'
import { appConfig } from '@/lib/config'

interface VisaPrice {
  type: string
  price: number
  currency: string
  processingTime: string
  description: string
  isAvailable: boolean
}

interface VisaPriceEntry {
  _id: string
  country: string
  countryCode: string
  visaTypes: VisaPrice[]
  isOthers: boolean
}

interface FormState {
  fullName: string
  email: string
  phone: string
  nationality: string
  dateOfBirth: string
  passportNumber: string
  passportExpiry: string
  travelPurpose: string
  travelDateFrom: string
  travelDateTo: string
}

const INITIAL_FORM: FormState = {
  fullName: '',
  email: '',
  phone: '',
  nationality: '',
  dateOfBirth: '',
  passportNumber: '',
  passportExpiry: '',
  travelPurpose: 'Tourism',
  travelDateFrom: '',
  travelDateTo: '',
}

const inputClass =
  'w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none bg-white text-sm transition-colors duration-200'

const labelClass = 'block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2'

export default function VisaAssistanceApplyPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isHydrated, setIsHydrated] = useState(false)

  // From URL params (set by ServiceTabs search form)
  const countryParam = searchParams.get('country') || ''
  const visaTypeParam = searchParams.get('visaType') || ''
  const nationalityParam = searchParams.get('nationality') || ''

  const [pricing, setPricing] = useState<VisaPrice | null>(null)
  const [priceEntry, setPriceEntry] = useState<VisaPriceEntry | null>(null)
  const [isOthers, setIsOthers] = useState(false)
  const [pricingLoading, setPricingLoading] = useState(false)

  const [form, setForm] = useState<FormState>({
    ...INITIAL_FORM,
    nationality: nationalityParam,
  })
  const [errors, setErrors] = useState<Partial<FormState>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [applicationRef, setApplicationRef] = useState<string | null>(null)

  const breadcrumbs = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'Visa Assistance', href: '/visa-applications' },
    { name: 'Apply', href: '/visa-assistance/apply' },
  ]

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  // Fetch pricing when country + visa type are available
  useEffect(() => {
    if (!countryParam || !visaTypeParam) return
    fetchPricing()
  }, [countryParam, visaTypeParam])

  const fetchPricing = async () => {
    setPricingLoading(true)
    try {
      const res = await fetch(
        `${appConfig.apiBaseUrl}/visa-assistance/prices/${encodeURIComponent(countryParam)}/${encodeURIComponent(visaTypeParam)}`
      )
      const data = await res.json()
      if (data.success) {
        if (data.data.isOthers) {
          setIsOthers(true)
          setPriceEntry(data.data.entry)
        } else {
          setIsOthers(false)
          setPricing(data.data)
          setPriceEntry(null)
        }
      }
    } catch {
      // non-fatal — pricing just won't show
    } finally {
      setPricingLoading(false)
    }
  }

  const validate = (): boolean => {
    const e: Partial<FormState> = {}
    if (!form.fullName.trim()) e.fullName = 'Full name is required'
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email is required'
    if (!form.phone.trim()) e.phone = 'Phone number is required'
    if (!form.nationality.trim()) e.nationality = 'Nationality is required'
    if (!form.dateOfBirth) e.dateOfBirth = 'Date of birth is required'
    if (!form.passportNumber.trim()) e.passportNumber = 'Passport number is required'
    if (!form.passportExpiry) e.passportExpiry = 'Passport expiry is required'
    if (!form.travelDateFrom) e.travelDateFrom = 'Travel date is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleChange = (field: keyof FormState, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const res = await fetch(`${appConfig.apiBaseUrl}/visa-assistance/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          destinationCountry: countryParam || 'Others',
          visaType: visaTypeParam || 'Tourist',
          fullName: form.fullName,
          email: form.email,
          phone: form.phone,
          nationality: form.nationality,
          dateOfBirth: form.dateOfBirth,
          passportNumber: form.passportNumber,
          passportExpiry: form.passportExpiry,
          travelPurpose: form.travelPurpose,
          travelDates: {
            startDate: form.travelDateFrom,
            endDate: form.travelDateTo,
          },
          isOthersRequest: isOthers,
        }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.message || 'Submission failed')

      setApplicationRef(data.data.applicationReference)
      setSubmitted(true)
    } catch (err: any) {
      setSubmitError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isHydrated) {
    return (
      <ErrorBoundary>
        <ServiceLayout title="Visa Assistance" breadcrumbs={breadcrumbs} serviceName="Visa Assistance">
          <div className="flex items-center justify-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        </ServiceLayout>
      </ErrorBoundary>
    )
  }

  // ── Success screen ──────────────────────────────────────────────────────────
  if (submitted && applicationRef) {
    return (
      <ErrorBoundary>
        <ServiceLayout title="Application Submitted" breadcrumbs={breadcrumbs} serviceName="Visa Assistance">
          <div className="max-w-2xl mx-auto py-16 px-4 text-center">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ backgroundColor: 'rgba(16,185,129,0.1)' }}
            >
              <span className="material-icons text-4xl" style={{ color: '#10b981' }}>check_circle</span>
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-4">Application Received!</h1>
            <p className="text-gray-500 mb-2">Your reference number is:</p>
            <div
              className="inline-block font-mono font-bold text-xl px-6 py-3 rounded-xl mb-6"
              style={{ backgroundColor: 'rgba(226,30,36,0.08)', color: '#e21e24' }}
            >
              {applicationRef}
            </div>
            <p className="text-gray-600 leading-relaxed mb-8">
              {isOthers
                ? "We've received your request. Since the destination you selected isn't on our standard list, one of our visa officers will reach out to you shortly with pricing and next steps."
                : "A payment link will be sent to your email shortly. Once you pay, our visa team will begin processing your application."}
            </p>
            <p className="text-sm text-gray-400 mb-8">Keep this reference number — you'll need it to track your application.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push('/')}
                className="px-8 py-3 rounded-xl font-bold text-white transition-all duration-200"
                style={{ backgroundColor: '#e21e24' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#c41e24')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#e21e24')}
              >
                Back to Home
              </button>
              <button
                onClick={() => router.push(`/visa-assistance/track?ref=${applicationRef}`)}
                className="px-8 py-3 rounded-xl font-bold border transition-all duration-200"
                style={{ borderColor: '#e21e24', color: '#e21e24' }}
              >
                Track Application
              </button>
            </div>
          </div>
        </ServiceLayout>
      </ErrorBoundary>
    )
  }

  // ── Main form ──────────────────────────────────────────────────────────────
  return (
    <ErrorBoundary>
      <ServiceLayout
        title="Visa Assistance Application"
        description="Fill in your details and our team will process your visa assistance request"
        breadcrumbs={breadcrumbs}
        serviceName="Visa Assistance"
      >
        <div className="max-w-6xl mx-auto py-8 px-4">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Visa Assistance Application</h1>
            <p className="text-gray-500">
              {countryParam
                ? `${countryParam} · ${visaTypeParam} Visa`
                : 'Complete the form below and our team will take it from here'}
            </p>
          </div>

          {submitError && (
            <div className="mb-6">
              <ErrorMessage message={submitError} />
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* ── Left: form fields ── */}
              <div className="lg:col-span-2 space-y-6">

                {/* Personal info */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                  <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                    <span className="material-icons text-xl" style={{ color: '#e21e24' }}>person</span>
                    Personal Information
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="sm:col-span-2">
                      <label className={labelClass}>Full Name <span style={{ color: '#e21e24' }}>*</span></label>
                      <input
                        type="text" className={inputClass} placeholder="As it appears on your passport"
                        value={form.fullName} onChange={e => handleChange('fullName', e.target.value)}
                        onFocus={e => (e.currentTarget.style.borderColor = '#e21e24')}
                        onBlur={e => (e.currentTarget.style.borderColor = '#e5e7eb')}
                      />
                      {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                    </div>
                    <div>
                      <label className={labelClass}>Email Address <span style={{ color: '#e21e24' }}>*</span></label>
                      <input
                        type="email" className={inputClass} placeholder="your@email.com"
                        value={form.email} onChange={e => handleChange('email', e.target.value)}
                        onFocus={e => (e.currentTarget.style.borderColor = '#e21e24')}
                        onBlur={e => (e.currentTarget.style.borderColor = '#e5e7eb')}
                      />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>
                    <div>
                      <label className={labelClass}>Phone Number <span style={{ color: '#e21e24' }}>*</span></label>
                      <input
                        type="tel" className={inputClass} placeholder="+234 800 000 0000"
                        value={form.phone} onChange={e => handleChange('phone', e.target.value)}
                        onFocus={e => (e.currentTarget.style.borderColor = '#e21e24')}
                        onBlur={e => (e.currentTarget.style.borderColor = '#e5e7eb')}
                      />
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                    </div>
                    <div>
                      <label className={labelClass}>Nationality <span style={{ color: '#e21e24' }}>*</span></label>
                      <input
                        type="text" className={inputClass} placeholder="e.g. Nigerian"
                        value={form.nationality} onChange={e => handleChange('nationality', e.target.value)}
                        onFocus={e => (e.currentTarget.style.borderColor = '#e21e24')}
                        onBlur={e => (e.currentTarget.style.borderColor = '#e5e7eb')}
                      />
                      {errors.nationality && <p className="text-red-500 text-xs mt-1">{errors.nationality}</p>}
                    </div>
                    <div>
                      <label className={labelClass}>Date of Birth <span style={{ color: '#e21e24' }}>*</span></label>
                      <input
                        type="date" className={inputClass}
                        value={form.dateOfBirth} onChange={e => handleChange('dateOfBirth', e.target.value)}
                        onFocus={e => (e.currentTarget.style.borderColor = '#e21e24')}
                        onBlur={e => (e.currentTarget.style.borderColor = '#e5e7eb')}
                      />
                      {errors.dateOfBirth && <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth}</p>}
                    </div>
                  </div>
                </div>

                {/* Passport */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                  <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                    <span className="material-icons text-xl" style={{ color: '#e21e24' }}>badge</span>
                    Passport Details
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className={labelClass}>Passport Number <span style={{ color: '#e21e24' }}>*</span></label>
                      <input
                        type="text" className={inputClass} placeholder="A12345678"
                        value={form.passportNumber} onChange={e => handleChange('passportNumber', e.target.value.toUpperCase())}
                        onFocus={e => (e.currentTarget.style.borderColor = '#e21e24')}
                        onBlur={e => (e.currentTarget.style.borderColor = '#e5e7eb')}
                      />
                      {errors.passportNumber && <p className="text-red-500 text-xs mt-1">{errors.passportNumber}</p>}
                    </div>
                    <div>
                      <label className={labelClass}>Passport Expiry Date <span style={{ color: '#e21e24' }}>*</span></label>
                      <input
                        type="date" className={inputClass}
                        value={form.passportExpiry} onChange={e => handleChange('passportExpiry', e.target.value)}
                        onFocus={e => (e.currentTarget.style.borderColor = '#e21e24')}
                        onBlur={e => (e.currentTarget.style.borderColor = '#e5e7eb')}
                      />
                      {errors.passportExpiry && <p className="text-red-500 text-xs mt-1">{errors.passportExpiry}</p>}
                    </div>
                  </div>
                </div>

                {/* Travel info */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                  <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                    <span className="material-icons text-xl" style={{ color: '#e21e24' }}>flight_takeoff</span>
                    Travel Information
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className={labelClass}>Intended Travel Date <span style={{ color: '#e21e24' }}>*</span></label>
                      <input
                        type="date" className={inputClass}
                        value={form.travelDateFrom} onChange={e => handleChange('travelDateFrom', e.target.value)}
                        onFocus={e => (e.currentTarget.style.borderColor = '#e21e24')}
                        onBlur={e => (e.currentTarget.style.borderColor = '#e5e7eb')}
                      />
                      {errors.travelDateFrom && <p className="text-red-500 text-xs mt-1">{errors.travelDateFrom}</p>}
                    </div>
                    <div>
                      <label className={labelClass}>Return Date (optional)</label>
                      <input
                        type="date" className={inputClass}
                        value={form.travelDateTo} onChange={e => handleChange('travelDateTo', e.target.value)}
                        onFocus={e => (e.currentTarget.style.borderColor = '#e21e24')}
                        onBlur={e => (e.currentTarget.style.borderColor = '#e5e7eb')}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className={labelClass}>Purpose of Travel</label>
                      <select
                        className={inputClass}
                        value={form.travelPurpose}
                        onChange={e => handleChange('travelPurpose', e.target.value)}
                        onFocus={e => (e.currentTarget.style.borderColor = '#e21e24')}
                        onBlur={e => (e.currentTarget.style.borderColor = '#e5e7eb')}
                      >
                        <option value="Tourism">Tourism / Holiday</option>
                        <option value="Business">Business</option>
                        <option value="Education">Education / Study</option>
                        <option value="Medical">Medical</option>
                        <option value="Family Visit">Family Visit</option>
                        <option value="Transit">Transit</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 px-10 py-4 rounded-xl font-bold text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: '#e21e24' }}
                    onMouseEnter={e => { if (!isSubmitting) e.currentTarget.style.backgroundColor = '#c41e24' }}
                    onMouseLeave={e => { if (!isSubmitting) e.currentTarget.style.backgroundColor = '#e21e24' }}
                  >
                    {isSubmitting ? (
                      <><LoadingSpinner size="sm" color="white" /><span>Submitting...</span></>
                    ) : (
                      <><span>Submit Application</span><span className="material-icons text-base">send</span></>
                    )}
                  </button>
                </div>
              </div>

              {/* ── Right: price summary ── */}
              <div className="lg:col-span-1">
                <div className="sticky top-4 space-y-4">

                  {/* Visa details card */}
                  <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                    <h3 className="text-base font-bold text-gray-900 mb-4">Application Summary</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Destination</span>
                        <span className="font-semibold text-gray-900">{countryParam || '—'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Visa Type</span>
                        <span className="font-semibold text-gray-900">{visaTypeParam || '—'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Nationality</span>
                        <span className="font-semibold text-gray-900">{form.nationality || nationalityParam || '—'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing card */}
                  <div className="rounded-2xl border p-6 shadow-sm" style={{ backgroundColor: '#141b34', borderColor: '#1e2a4a' }}>
                    <h3 className="text-base font-bold text-white mb-4">Service Fee</h3>
                    {pricingLoading ? (
                      <div className="flex items-center gap-2 text-white/60 text-sm">
                        <LoadingSpinner size="sm" color="white" />
                        <span>Loading pricing...</span>
                      </div>
                    ) : isOthers ? (
                      <div>
                        <p className="text-white/60 text-sm leading-relaxed mb-3">
                          This destination isn't on our standard list yet. Our team will contact you with a custom quote.
                        </p>
                        <div
                          className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full"
                          style={{ backgroundColor: 'rgba(245,158,11,0.2)', color: '#f59e0b' }}
                        >
                          <span className="material-icons text-sm">info</span>
                          Manual pricing required
                        </div>
                      </div>
                    ) : pricing ? (
                      <div>
                        <div className="text-4xl font-extrabold text-white mb-1">
                          ₦{pricing.price.toLocaleString()}
                        </div>
                        <p className="text-white/50 text-xs mb-4">Service fee · {pricing.currency}</p>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2 text-white/70">
                            <span className="material-icons text-sm" style={{ color: '#10b981' }}>schedule</span>
                            {pricing.processingTime}
                          </div>
                          {pricing.description && (
                            <div className="flex items-start gap-2 text-white/70">
                              <span className="material-icons text-sm mt-0.5" style={{ color: '#e21e24' }}>info</span>
                              <span>{pricing.description}</span>
                            </div>
                          )}
                        </div>
                        <div className="mt-4 pt-4 border-t border-white/10 text-xs text-white/40 leading-relaxed">
                          Payment link will be sent to your email after submission. You only pay after our officer reviews your application.
                        </div>
                      </div>
                    ) : (
                      <p className="text-white/50 text-sm">Select a destination to see pricing.</p>
                    )}
                  </div>

                  {/* Help card */}
                  <div
                    className="rounded-2xl p-5 text-sm"
                    style={{ backgroundColor: 'rgba(226,30,36,0.06)', border: '1px solid rgba(226,30,36,0.15)' }}
                  >
                    <div className="flex items-start gap-3">
                      <span className="material-icons text-xl flex-shrink-0" style={{ color: '#e21e24' }}>support_agent</span>
                      <div>
                        <p className="font-semibold text-gray-900 mb-1">Need help?</p>
                        <p className="text-gray-500 leading-relaxed">
                          Our visa team is available to guide you. Call us or{' '}
                          <a href="/contact" className="font-medium" style={{ color: '#e21e24' }}>send a message</a>.
                        </p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </form>
        </div>
      </ServiceLayout>
    </ErrorBoundary>
  )
}
