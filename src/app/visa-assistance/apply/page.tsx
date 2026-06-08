'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ServiceLayout } from '@/components/layout'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import ErrorMessage from '@/components/ui/ErrorMessage'
import { StyledDatePicker } from '@/components/ui/StyledDatePicker'
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
  destinationCountry: string
  visaType: string
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
  urgency: string
}

const VISA_TYPES = ['Tourist', 'Business', 'Student', 'Transit', 'Work']
const TRAVEL_PURPOSES = ['Tourism', 'Business', 'Education', 'Medical', 'Family Visit', 'Transit', 'Other']
const URGENCY_OPTIONS = ['Standard', 'Express', 'Super Express']

const inputClass =
  'w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none bg-white text-sm transition-colors duration-200 focus:border-red-500'

const labelClass = 'block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2'

const breadcrumbs = [
  { name: 'Home', href: '/' },
  { name: 'Services', href: '/services' },
  { name: 'Visa Assistance', href: '/visa-assistance' },
  { name: 'Apply', href: '/visa-assistance/apply' },
]

export default function VisaAssistanceApplyPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isHydrated, setIsHydrated] = useState(false)

  // From URL params (set by ServiceTabs search form)
  const countryParam    = searchParams.get('country')     || ''
  const visaTypeParam   = searchParams.get('visaType')    || ''
  const nationalityParam = searchParams.get('nationality') || ''
  const urgencyParam    = searchParams.get('urgency')     || 'Standard'

  const [pricing, setPricing]         = useState<VisaPrice | null>(null)
  const [isOthers, setIsOthers]       = useState(false)
  const [pricingLoading, setPricingLoading] = useState(false)

  const [form, setForm] = useState<FormState>({
    destinationCountry: countryParam,
    visaType: visaTypeParam || 'Tourist',
    fullName: '',
    email: '',
    phone: '',
    nationality: nationalityParam,
    dateOfBirth: '',
    passportNumber: '',
    passportExpiry: '',
    travelPurpose: 'Tourism',
    travelDateFrom: '',
    travelDateTo: '',
    urgency: urgencyParam,
  })

  const [errors, setErrors]         = useState<Partial<Record<keyof FormState, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError]   = useState<string | null>(null)
  const [submitted, setSubmitted]       = useState(false)
  const [applicationRef, setApplicationRef] = useState<string | null>(null)
  const [submittedFee, setSubmittedFee]     = useState<number>(0)
  const [submittedManual, setSubmittedManual] = useState(false)

  useEffect(() => { setIsHydrated(true) }, [])

  // Keep form in sync if URL params arrive after hydration
  useEffect(() => {
    setForm(prev => ({
      ...prev,
      destinationCountry: countryParam  || prev.destinationCountry,
      visaType:           visaTypeParam  || prev.visaType,
      nationality:        nationalityParam || prev.nationality,
      urgency:            urgencyParam    || prev.urgency,
    }))
  }, [countryParam, visaTypeParam, nationalityParam, urgencyParam])

  // Fetch pricing whenever destination + type change
  useEffect(() => {
    if (!form.destinationCountry || !form.visaType) return
    fetchPricing(form.destinationCountry, form.visaType)
  }, [form.destinationCountry, form.visaType])

  const fetchPricing = async (country: string, visaType: string) => {
    setPricingLoading(true)
    try {
      const res  = await fetch(
        `${appConfig.apiBaseUrl}/visa-assistance/prices/${encodeURIComponent(country)}/${encodeURIComponent(visaType)}`
      )
      const data = await res.json()
      if (data.status === 'success') {
        if (data.data.isOthers) {
          setIsOthers(true)
          setPricing(null)
        } else {
          setIsOthers(false)
          setPricing(data.data)
        }
      }
    } catch {
      // non-fatal
    } finally {
      setPricingLoading(false)
    }
  }

  const validate = (): boolean => {
    const e: Partial<Record<keyof FormState, string>> = {}
    if (!form.destinationCountry.trim())  e.destinationCountry = 'Destination country is required'
    if (!form.visaType)                   e.visaType = 'Visa type is required'
    if (!form.fullName.trim())            e.fullName = 'Full name is required'
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
                                          e.email = 'Valid email is required'
    if (!form.phone.trim())               e.phone = 'Phone number is required'
    if (!form.nationality.trim())         e.nationality = 'Nationality is required'
    if (!form.dateOfBirth)                e.dateOfBirth = 'Date of birth is required'
    if (!form.passportNumber.trim())      e.passportNumber = 'Passport number is required'
    if (!form.passportExpiry)             e.passportExpiry = 'Passport expiry is required'
    if (!form.travelDateFrom)             e.travelDateFrom = 'Intended travel date is required'
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
          destinationCountry: form.destinationCountry || 'Others',
          visaType:           form.visaType           || 'Tourist',
          fullName:           form.fullName,
          email:              form.email,
          phone:              form.phone,
          nationality:        form.nationality,
          dateOfBirth:        form.dateOfBirth,
          passportNumber:     form.passportNumber,
          passportExpiry:     form.passportExpiry,
          travelPurpose:      form.travelPurpose,
          urgency:            form.urgency,
          travelDates: {
            startDate: form.travelDateFrom,
            endDate:   form.travelDateTo,
          },
          isOthersRequest: isOthers,
        }),
      })

      const data = await res.json()

      // ApiResponse always returns { status: 'success' | 'fail' | 'error', message, data }
      if (!res.ok || data.status !== 'success') {
        throw new Error(data.message || 'Submission failed')
      }

      setApplicationRef(data.data.applicationReference)
      setSubmittedFee(data.data.fee || 0)
      setSubmittedManual(data.data.requiresManualPricing || false)
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
            <p className="text-gray-600 leading-relaxed mb-4">
              {submittedManual
                ? "We've received your request. Since the destination you selected isn't on our standard list, one of our visa officers will reach out to you shortly with pricing and next steps."
                : submittedFee > 0
                  ? `Our service fee is ₦${submittedFee.toLocaleString()}. A payment link has been sent to your email — once payment is complete, our visa team will begin processing your application.`
                  : "A confirmation email has been sent to you. Our visa team will review your application and be in touch shortly."
              }
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
            <p className="text-gray-500">Complete the form below and our team will take it from here</p>
          </div>

          {submitError && (
            <div className="mb-6">
              <ErrorMessage message={submitError} />
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* ── Left: form fields ── */}
              <div className="lg:col-span-2 space-y-6">

                {/* Destination — pre-filled from URL but editable */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                  <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                    <span className="material-icons text-xl" style={{ color: '#e21e24' }}>public</span>
                    Visa Details
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className={labelClass}>Destination Country <span style={{ color: '#e21e24' }}>*</span></label>
                      <input
                        type="text"
                        className={inputClass}
                        placeholder="e.g. United Kingdom"
                        value={form.destinationCountry}
                        onChange={e => handleChange('destinationCountry', e.target.value)}
                      />
                      {errors.destinationCountry && (
                        <p className="text-red-500 text-xs mt-1">{errors.destinationCountry}</p>
                      )}
                    </div>
                    <div>
                      <label className={labelClass}>Visa Type <span style={{ color: '#e21e24' }}>*</span></label>
                      <select
                        className={inputClass}
                        value={form.visaType}
                        onChange={e => handleChange('visaType', e.target.value)}
                      >
                        {VISA_TYPES.map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                      {errors.visaType && <p className="text-red-500 text-xs mt-1">{errors.visaType}</p>}
                    </div>
                    <div className="sm:col-span-2">
                      <label className={labelClass}>Processing Speed</label>
                      <div className="flex gap-3 flex-wrap">
                        {URGENCY_OPTIONS.map(opt => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => handleChange('urgency', opt)}
                            className="px-4 py-2 rounded-xl text-sm font-semibold border transition-all duration-150"
                            style={{
                              backgroundColor: form.urgency === opt ? '#e21e24' : 'transparent',
                              color:           form.urgency === opt ? '#ffffff' : '#374151',
                              borderColor:     form.urgency === opt ? '#e21e24' : '#e5e7eb',
                            }}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

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
                        type="text"
                        className={inputClass}
                        placeholder="As it appears on your passport"
                        value={form.fullName}
                        onChange={e => handleChange('fullName', e.target.value)}
                      />
                      {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                    </div>
                    <div>
                      <label className={labelClass}>Email Address <span style={{ color: '#e21e24' }}>*</span></label>
                      <input
                        type="email"
                        className={inputClass}
                        placeholder="your@email.com"
                        value={form.email}
                        onChange={e => handleChange('email', e.target.value)}
                      />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>
                    <div>
                      <label className={labelClass}>Phone Number <span style={{ color: '#e21e24' }}>*</span></label>
                      <input
                        type="tel"
                        className={inputClass}
                        placeholder="+234 800 000 0000"
                        value={form.phone}
                        onChange={e => handleChange('phone', e.target.value)}
                      />
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                    </div>
                    <div>
                      <label className={labelClass}>Nationality <span style={{ color: '#e21e24' }}>*</span></label>
                      <input
                        type="text"
                        className={inputClass}
                        placeholder="e.g. Nigerian"
                        value={form.nationality}
                        onChange={e => handleChange('nationality', e.target.value)}
                      />
                      {errors.nationality && <p className="text-red-500 text-xs mt-1">{errors.nationality}</p>}
                    </div>
                    <div>
                      <label className={labelClass}>Date of Birth <span style={{ color: '#e21e24' }}>*</span></label>
                      {/* StyledDatePicker in single-date mode — any placeholder that isn't "Select dates" triggers non-flight mode */}
                      <div className="border border-gray-200 rounded-xl bg-white overflow-visible"
                           style={{ borderColor: errors.dateOfBirth ? '#ef4444' : undefined }}>
                        <StyledDatePicker
                          value={form.dateOfBirth}
                          onChange={v => handleChange('dateOfBirth', v)}
                          placeholder="Date of Birth"
                          maxDate={new Date().toISOString().split('T')[0]}
                          className="w-full"
                        />
                      </div>
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
                        type="text"
                        className={inputClass}
                        placeholder="A12345678"
                        value={form.passportNumber}
                        onChange={e => handleChange('passportNumber', e.target.value.toUpperCase())}
                      />
                      {errors.passportNumber && <p className="text-red-500 text-xs mt-1">{errors.passportNumber}</p>}
                    </div>
                    <div>
                      <label className={labelClass}>Passport Expiry Date <span style={{ color: '#e21e24' }}>*</span></label>
                      <div className="border border-gray-200 rounded-xl bg-white overflow-visible"
                           style={{ borderColor: errors.passportExpiry ? '#ef4444' : undefined }}>
                        <StyledDatePicker
                          value={form.passportExpiry}
                          onChange={v => handleChange('passportExpiry', v)}
                          placeholder="Passport Expiry"
                          minDate={new Date().toISOString().split('T')[0]}
                          className="w-full"
                        />
                      </div>
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
                      <div className="border border-gray-200 rounded-xl bg-white overflow-visible"
                           style={{ borderColor: errors.travelDateFrom ? '#ef4444' : undefined }}>
                        <StyledDatePicker
                          value={form.travelDateFrom}
                          onChange={v => handleChange('travelDateFrom', v)}
                          placeholder="Travel Date"
                          minDate={new Date().toISOString().split('T')[0]}
                          className="w-full"
                        />
                      </div>
                      {errors.travelDateFrom && <p className="text-red-500 text-xs mt-1">{errors.travelDateFrom}</p>}
                    </div>
                    <div>
                      <label className={labelClass}>Return Date <span className="text-gray-400 font-normal normal-case tracking-normal">(optional)</span></label>
                      <div className="border border-gray-200 rounded-xl bg-white overflow-visible">
                        <StyledDatePicker
                          value={form.travelDateTo}
                          onChange={v => handleChange('travelDateTo', v)}
                          placeholder="Return Date"
                          minDate={form.travelDateFrom || new Date().toISOString().split('T')[0]}
                          className="w-full"
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <label className={labelClass}>Purpose of Travel</label>
                      <select
                        className={inputClass}
                        value={form.travelPurpose}
                        onChange={e => handleChange('travelPurpose', e.target.value)}
                      >
                        {TRAVEL_PURPOSES.map(p => (
                          <option key={p} value={p}>{p}</option>
                        ))}
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

                  {/* Application summary card */}
                  <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                    <h3 className="text-base font-bold text-gray-900 mb-4">Application Summary</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Destination</span>
                        <span className="font-semibold text-gray-900">{form.destinationCountry || '—'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Visa Type</span>
                        <span className="font-semibold text-gray-900">{form.visaType || '—'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Nationality</span>
                        <span className="font-semibold text-gray-900">{form.nationality || '—'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Processing</span>
                        <span className="font-semibold text-gray-900">{form.urgency}</span>
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
                    ) : !form.destinationCountry ? (
                      <p className="text-white/50 text-sm">Enter a destination to see pricing.</p>
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
                          A payment link will be sent to your email after our officer reviews your application.
                        </div>
                      </div>
                    ) : (
                      <p className="text-white/50 text-sm">Pricing not available for this selection.</p>
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
