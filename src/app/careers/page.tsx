import { Header } from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Careers at The Travel Place</h1>
          
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <p className="text-lg text-gray-600 mb-8">
              Join our team and help travelers create unforgettable experiences around the world.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Why Work With Us?</h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-brand-red mb-2">Growth Opportunities</h3>
                <p className="text-gray-600">
                  We invest in our team's professional development with training programs and career advancement paths.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-brand-red mb-2">Competitive Benefits</h3>
                <p className="text-gray-600">
                  Enjoy comprehensive health coverage, travel discounts, and competitive compensation packages.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-brand-red mb-2">Work-Life Balance</h3>
                <p className="text-gray-600">
                  We value your time with flexible working arrangements and generous paid time off.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-brand-red mb-2">Inclusive Culture</h3>
                <p className="text-gray-600">
                  Be part of a diverse, supportive team that celebrates different perspectives and backgrounds.
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Current Openings</h2>
            <p className="text-gray-600 mb-6">
              We're always looking for talented individuals to join our team. Check back soon for available positions or send your resume to{' '}
              <a href="mailto:careers@thetravelplace.ng" className="text-brand-red hover:underline">
                careers@thetravelplace.ng
              </a>
            </p>
          </div>

          <div className="bg-brand-red text-white rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Join Our Team?</h2>
            <p className="mb-6">Send your resume and cover letter to start your journey with us.</p>
            <a
              href="mailto:careers@thetravelplace.ng"
              className="inline-block bg-white text-brand-red px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Apply Now
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
