import { Header } from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
          
          <div className="bg-white rounded-lg shadow-sm p-8">
            <p className="text-sm text-gray-500 mb-8">Last Updated: March 11, 2026</p>

            <div className="prose max-w-none">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Information We Collect</h2>
              <p className="text-gray-600 mb-6">
                We collect information you provide directly to us, including name, email address, phone number, payment information, and travel preferences when you create an account or make a booking.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. How We Use Your Information</h2>
              <p className="text-gray-600 mb-4">We use the information we collect to:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-600 mb-6">
                <li>Process your bookings and transactions</li>
                <li>Send booking confirmations and updates</li>
                <li>Provide customer support</li>
                <li>Improve our services</li>
                <li>Send promotional communications (with your consent)</li>
              </ul>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Information Sharing</h2>
              <p className="text-gray-600 mb-6">
                We share your information with service providers necessary to complete your bookings (airlines, hotels, car rental companies) and payment processors. We do not sell your personal information to third parties.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Data Security</h2>
              <p className="text-gray-600 mb-6">
                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Your Rights</h2>
              <p className="text-gray-600 mb-4">You have the right to:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-600 mb-6">
                <li>Access your personal information</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Opt-out of marketing communications</li>
                <li>Data portability</li>
              </ul>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Cookies</h2>
              <p className="text-gray-600 mb-6">
                We use cookies and similar technologies to enhance your experience, analyze site usage, and assist in our marketing efforts. You can control cookies through your browser settings.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Contact Us</h2>
              <p className="text-gray-600 mb-4">
                If you have questions about this Privacy Policy, please contact us at:
              </p>
              <p className="text-gray-600">
                Email:{' '}
                <a href="mailto:privacy@thetravelplace.ng" className="text-brand-red hover:underline">
                  privacy@thetravelplace.ng
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
