import { Header } from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">How It Works</h1>
          
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <p className="text-lg text-gray-600 mb-8">
              Booking your travel with The Travel Place is simple and straightforward. Follow these easy steps to plan your perfect trip.
            </p>

            <div className="space-y-12">
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-brand-red text-white rounded-full flex items-center justify-center text-xl font-bold">
                    1
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-3">Search & Compare</h2>
                  <p className="text-gray-600">
                    Browse through our extensive selection of flights, hotels, car rentals, and travel services. Use our advanced filters to find options that match your preferences and budget.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-brand-red text-white rounded-full flex items-center justify-center text-xl font-bold">
                    2
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-3">Select Your Service</h2>
                  <p className="text-gray-600">
                    Choose the service that best fits your needs. Review detailed information, pricing, and customer reviews to make an informed decision.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-brand-red text-white rounded-full flex items-center justify-center text-xl font-bold">
                    3
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-3">Secure Payment</h2>
                  <p className="text-gray-600">
                    Complete your booking with our secure payment system. We accept multiple payment methods and ensure your information is protected with industry-standard encryption.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-brand-red text-white rounded-full flex items-center justify-center text-xl font-bold">
                    4
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-3">Receive Confirmation</h2>
                  <p className="text-gray-600">
                    Get instant confirmation via email with all your booking details, including tickets, vouchers, and important travel information.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-brand-red text-white rounded-full flex items-center justify-center text-xl font-bold">
                    5
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-3">Enjoy Your Trip</h2>
                  <p className="text-gray-600">
                    Travel with confidence knowing our 24/7 customer support team is available to assist you throughout your journey.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-brand-red text-white rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Start Your Journey?</h2>
            <p className="mb-6">Book your next adventure with The Travel Place today.</p>
            <a
              href="/"
              className="inline-block bg-white text-brand-red px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Start Booking
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
