import { Header } from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function PartnershipsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Partnerships</h1>
          
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <p className="text-lg text-gray-600 mb-8">
              Partner with The Travel Place to expand your reach and provide exceptional travel services to your customers.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Partnership Opportunities</h2>
            
            <div className="space-y-6 mb-8">
              <div className="border-l-4 border-brand-red pl-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Travel Agencies</h3>
                <p className="text-gray-600">
                  Join our network of travel agencies and access our comprehensive booking platform, competitive rates, and dedicated support.
                </p>
              </div>

              <div className="border-l-4 border-brand-red pl-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Hotels & Accommodations</h3>
                <p className="text-gray-600">
                  List your property on our platform and reach thousands of travelers looking for quality accommodations.
                </p>
              </div>

              <div className="border-l-4 border-brand-red pl-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Car Rental Companies</h3>
                <p className="text-gray-600">
                  Expand your fleet's visibility and connect with travelers who need reliable transportation services.
                </p>
              </div>

              <div className="border-l-4 border-brand-red pl-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Corporate Partners</h3>
                <p className="text-gray-600">
                  Streamline your company's travel management with our corporate travel solutions and dedicated account management.
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Why Partner With Us?</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-600 mb-8">
              <li>Access to a growing customer base across Nigeria and beyond</li>
              <li>Advanced technology platform for seamless integration</li>
              <li>Competitive commission structures</li>
              <li>Marketing and promotional support</li>
              <li>Dedicated partnership management team</li>
            </ul>
          </div>

          <div className="bg-brand-red text-white rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Interested in Partnering?</h2>
            <p className="mb-6">Contact our partnerships team to explore collaboration opportunities.</p>
            <a
              href="mailto:partnerships@thetravelplace.ng"
              className="inline-block bg-white text-brand-red px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
