import { Header } from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function HelpCenterPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Help Center</h1>
          
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <p className="text-lg text-gray-600 mb-8">
              Find answers to common questions and get the support you need.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <a href="/help#booking" className="border border-gray-200 rounded-lg p-6 hover:border-brand-red transition-colors">
                <h3 className="text-lg font-semibold text-brand-red mb-2">Booking Help</h3>
                <p className="text-gray-600">
                  Learn how to search, compare, and book flights, hotels, and other services.
                </p>
              </a>

              <a href="/help#payment" className="border border-gray-200 rounded-lg p-6 hover:border-brand-red transition-colors">
                <h3 className="text-lg font-semibold text-brand-red mb-2">Payment & Billing</h3>
                <p className="text-gray-600">
                  Information about payment methods, invoices, and refunds.
                </p>
              </a>

              <a href="/help#account" className="border border-gray-200 rounded-lg p-6 hover:border-brand-red transition-colors">
                <h3 className="text-lg font-semibold text-brand-red mb-2">Account Management</h3>
                <p className="text-gray-600">
                  Manage your profile, bookings, and account settings.
                </p>
              </a>

              <a href="/help#travel" className="border border-gray-200 rounded-lg p-6 hover:border-brand-red transition-colors">
                <h3 className="text-lg font-semibold text-brand-red mb-2">Travel Information</h3>
                <p className="text-gray-600">
                  Get travel tips, visa requirements, and destination guides.
                </p>
              </a>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Support</h2>
            <p className="text-gray-600 mb-4">
              Can't find what you're looking for? Our support team is here to help.
            </p>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-700 mb-2">
                <span className="font-semibold">Email:</span>{' '}
                <a href="mailto:support@thetravelplace.ng" className="text-brand-red hover:underline">
                  support@thetravelplace.ng
                </a>
              </p>
              <p className="text-gray-700 mb-2">
                <span className="font-semibold">Phone:</span> +234 (0) 903 557 3593
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Hours:</span> 24/7 Customer Support
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
