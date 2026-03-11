import { Header } from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Terms of Service</h1>
          
          <div className="bg-white rounded-lg shadow-sm p-8">
            <p className="text-sm text-gray-500 mb-8">Last Updated: March 11, 2026</p>

            <div className="prose max-w-none">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-600 mb-6">
                By accessing and using The Travel Place platform, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Booking and Reservations</h2>
              <p className="text-gray-600 mb-6">
                All bookings are subject to availability and confirmation. Prices are subject to change until payment is received. You are responsible for ensuring all information provided is accurate and complete.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Payment Terms</h2>
              <p className="text-gray-600 mb-6">
                Payment must be made in full at the time of booking unless otherwise specified. We accept various payment methods as displayed on our platform. All transactions are processed securely.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Cancellation and Refunds</h2>
              <p className="text-gray-600 mb-6">
                Cancellation policies vary by service provider. Refunds are subject to the terms and conditions of the respective airlines, hotels, or service providers. Cancellation fees may apply.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. User Responsibilities</h2>
              <p className="text-gray-600 mb-4">You agree to:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-600 mb-6">
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Comply with all applicable laws and regulations</li>
                <li>Not use our services for any unlawful purpose</li>
              </ul>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Limitation of Liability</h2>
              <p className="text-gray-600 mb-6">
                The Travel Place acts as an intermediary between you and service providers. We are not liable for any issues arising from services provided by third parties, including but not limited to flight delays, cancellations, or service quality.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Changes to Terms</h2>
              <p className="text-gray-600 mb-6">
                We reserve the right to modify these terms at any time. Continued use of our services after changes constitutes acceptance of the modified terms.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Contact Information</h2>
              <p className="text-gray-600">
                For questions about these Terms of Service, contact us at{' '}
                <a href="mailto:legal@thetravelplace.ng" className="text-brand-red hover:underline">
                  legal@thetravelplace.ng
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
          