import { Header } from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function PressPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Press & Media</h1>
          
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <p className="text-lg text-gray-600 mb-8">
              Welcome to The Travel Place press center. Here you'll find our latest news, press releases, and media resources.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Media Inquiries</h2>
            <p className="text-gray-600 mb-6">
              For press inquiries, interviews, or media requests, please contact our communications team:
            </p>
            
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <p className="text-gray-700 mb-2">
                <span className="font-semibold">Email:</span>{' '}
                <a href="mailto:press@thetravelplace.ng" className="text-brand-red hover:underline">
                  press@thetravelplace.ng
                </a>
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Phone:</span> +234 (0) 903 557 3593
              </p>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">About The Travel Place</h2>
            <p className="text-gray-600 mb-6">
              Founded in 2016, The Travel Place is Nigeria's trusted travel booking platform, offering comprehensive travel services including flight bookings, hotel reservations, car rentals, visa assistance, and travel insurance. We're committed to making travel planning effortless and accessible for everyone.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Brand Assets</h2>
            <p className="text-gray-600 mb-4">
              For official logos, brand guidelines, and media assets, please contact our press team.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
