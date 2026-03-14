'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/auth-context'

type ApplicationType = 'Vendor' | 'Agent'

interface FormData {
  applicationType: ApplicationType
  businessName: string
  businessEmail: string
  businessPhone: string
  businessAddress: {
    street: string
    city: string
    state: string
    country: string
    zipCode: string
  }
  businessRegistrationNumber: string
  bankDetails: {
    bankName: string
    accountNumber: string
    accountName: string
    accountType: string
    swiftCode: string
  }
}

interface DocumentUpload {
  file: File | null
  url: string
  fileName: string
}

export default function VendorAgentSignupPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [step, setStep] = useState(1)
  const [applicationType, setApplicationType] = useState<ApplicationType | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [formData, setFormData] = useState<FormData>({
    applicationType: 'Vendor',
    businessName: '',
    businessEmail: '',
    businessPhone: '',
    businessAddress: {
      street: '',
      city: '',
      state: '',
      country: '',
      zipCode: '',
    },
    businessRegistrationNumber: '',
    bankDetails: {
      bankName: '',
      accountNumber: '',
      accountName: '',
      accountType: 'Savings',
      swiftCode: '',
    },
  })

  const [documents, setDocuments] = useState({
    registrationDocument: { file: null, url: '', fileName: '' } as DocumentUpload,
    identificationDocument: { file: null, url: '', fileName: '' } as DocumentUpload,
    proofOfAddress: { file: null, url: '', fileName: '' } as DocumentUpload,
  })

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-red/5 to-brand-red/10 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-6">
            You need to be logged in to apply as a vendor or agent.
          </p>
          <Link
            href="/"
            className="inline-block bg-brand-red text-white px-6 py-2 rounded-lg hover:bg-brand-red-600 transition-colors"
          >
            Go to Login
          </Link>
        </div>
      </div>
    )
  }

  const handleApplicationTypeSelect = (type: ApplicationType) => {
    setApplicationType(type)
    setFormData(prev => ({ ...prev, applicationType: type }))
    setStep(2)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    if (name.includes('.')) {
      const [parent, child] = name.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof FormData],
          [child]: value,
        },
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, docType: string) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB')
      return
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg']
    if (!allowedTypes.includes(file.type)) {
      setError('Only PDF and image files are allowed')
      return
    }

    // Create preview URL
    const url = URL.createObjectURL(file)
    setDocuments(prev => ({
      ...prev,
      [docType]: {
        file,
        url,
        fileName: file.name,
      },
    }))
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setIsLoading(true)

    try {
      // Validate required documents
      if (!documents.registrationDocument.file || !documents.identificationDocument.file) {
        setError('Registration and identification documents are required')
        setIsLoading(false)
        return
      }

      // Submit application
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/vendor-agent-applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Failed to submit application')
      }

      const data = await response.json()
      const applicationId = data.data.application._id

      // Upload documents
      const uploadPromises = []
      for (const [docType, doc] of Object.entries(documents)) {
        if (doc.file) {
          uploadPromises.push(uploadDocument(applicationId, docType, doc.file))
        }
      }

      await Promise.all(uploadPromises)

      setSuccess('Application submitted successfully! We will review your application and get back to you soon.')
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
    } catch (err: any) {
      setError(err.message || 'Failed to submit application')
    } finally {
      setIsLoading(false)
    }
  }

  const uploadDocument = async (applicationId: string, docType: string, file: File) => {
    const formDataObj = new FormData()
    formDataObj.append('file', file)
    formDataObj.append('folder', 'vendor-agent-applications')

    // Upload to S3 via backend
    const uploadResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/upload`, {
      method: 'POST',
      credentials: 'include',
      body: formDataObj,
    })

    if (!uploadResponse.ok) {
      throw new Error('Failed to upload document')
    }

    const uploadData = await uploadResponse.json()

    // Update application with document URL
    const updateResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/vendor-agent-applications/${applicationId}/upload-documents`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          [docType]: {
            url: uploadData.data.url,
            s3Key: uploadData.data.s3Key,
            fileName: file.name,
            uploadedAt: new Date().toISOString(),
          },
        }),
      }
    )

    if (!updateResponse.ok) {
      throw new Error('Failed to save document')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-red/5 to-brand-red/10 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {step === 1 ? 'Become a Partner' : `${applicationType} Application`}
          </h1>
          <p className="text-lg text-gray-600">
            {step === 1
              ? 'Choose whether you want to apply as a vendor or agent'
              : 'Complete your application to get started'}
          </p>
        </div>

        {/* Step 1: Application Type Selection */}
        {step === 1 && (
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Vendor Card */}
            <button
              onClick={() => handleApplicationTypeSelect('Vendor')}
              className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow text-left"
            >
              <div className="text-4xl mb-4">🚗</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Become a Vendor</h3>
              <p className="text-gray-600 mb-4">
                List your vehicles and earn commission on every booking
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>✓ Manage your fleet</li>
                <li>✓ Set your own rates</li>
                <li>✓ Earn competitive commissions</li>
                <li>✓ Access analytics dashboard</li>
              </ul>
            </button>

            {/* Agent Card */}
            <button
              onClick={() => handleApplicationTypeSelect('Agent')}
              className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow text-left"
            >
              <div className="text-4xl mb-4">✈️</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Become an Agent</h3>
              <p className="text-gray-600 mb-4">
                Book travel services for your clients and earn commissions
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>✓ Book flights, hotels & more</li>
                <li>✓ Manage client bookings</li>
                <li>✓ Earn agent commissions</li>
                <li>✓ Dedicated support</li>
              </ul>
            </button>
          </div>
        )}

        {/* Step 2: Application Form */}
        {step === 2 && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-600">{success}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Business Information */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Business Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Business Name *
                    </label>
                    <input
                      type="text"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                      placeholder="Your business name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Business Email *
                    </label>
                    <input
                      type="email"
                      name="businessEmail"
                      value={formData.businessEmail}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                      placeholder="business@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Business Phone *
                    </label>
                    <input
                      type="tel"
                      name="businessPhone"
                      value={formData.businessPhone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                      placeholder="+234..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Registration Number *
                    </label>
                    <input
                      type="text"
                      name="businessRegistrationNumber"
                      value={formData.businessRegistrationNumber}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                      placeholder="RC/BN number"
                    />
                  </div>
                </div>
              </div>

              {/* Business Address */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Business Address</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="businessAddress.street"
                    value={formData.businessAddress.street}
                    onChange={handleInputChange}
                    placeholder="Street address"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                  />
                  <input
                    type="text"
                    name="businessAddress.city"
                    value={formData.businessAddress.city}
                    onChange={handleInputChange}
                    placeholder="City"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                  />
                  <input
                    type="text"
                    name="businessAddress.state"
                    value={formData.businessAddress.state}
                    onChange={handleInputChange}
                    placeholder="State"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                  />
                  <input
                    type="text"
                    name="businessAddress.country"
                    value={formData.businessAddress.country}
                    onChange={handleInputChange}
                    placeholder="Country"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                  />
                </div>
              </div>

              {/* Bank Details */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Bank Details</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="bankDetails.bankName"
                    value={formData.bankDetails.bankName}
                    onChange={handleInputChange}
                    placeholder="Bank name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                  />
                  <input
                    type="text"
                    name="bankDetails.accountNumber"
                    value={formData.bankDetails.accountNumber}
                    onChange={handleInputChange}
                    placeholder="Account number"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                  />
                  <input
                    type="text"
                    name="bankDetails.accountName"
                    value={formData.bankDetails.accountName}
                    onChange={handleInputChange}
                    placeholder="Account name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                  />
                  <select
                    name="bankDetails.accountType"
                    value={formData.bankDetails.accountType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                  >
                    <option value="Savings">Savings</option>
                    <option value="Checking">Checking</option>
                    <option value="Business">Business</option>
                  </select>
                </div>
              </div>

              {/* Documents */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Required Documents</h3>
                <div className="space-y-4">
                  {/* Registration Document */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Registration Document * (PDF or Image)
                    </label>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileUpload(e, 'registrationDocument')}
                      className="w-full"
                    />
                    {documents.registrationDocument.fileName && (
                      <p className="text-sm text-green-600 mt-2">
                        ✓ {documents.registrationDocument.fileName}
                      </p>
                    )}
                  </div>

                  {/* Identification Document */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Means of Identification * (Passport, National ID, etc.)
                    </label>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileUpload(e, 'identificationDocument')}
                      className="w-full"
                    />
                    {documents.identificationDocument.fileName && (
                      <p className="text-sm text-green-600 mt-2">
                        ✓ {documents.identificationDocument.fileName}
                      </p>
                    )}
                  </div>

                  {/* Proof of Address */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Proof of Address (Optional)
                    </label>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileUpload(e, 'proofOfAddress')}
                      className="w-full"
                    />
                    {documents.proofOfAddress.fileName && (
                      <p className="text-sm text-green-600 mt-2">
                        ✓ {documents.proofOfAddress.fileName}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-6 py-3 bg-brand-red text-white rounded-lg font-medium hover:bg-brand-red-600 transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
