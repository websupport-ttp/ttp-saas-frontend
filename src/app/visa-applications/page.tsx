'use client';

import { useEffect } from 'react';
import { Header } from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ServiceHero from '@/components/sections/ServiceHero'
import SearchForm from '@/components/ui/SearchForm'

export default function VisaApplicationsPage() {
  // Set page metadata for client component
  useEffect(() => {
    document.title = 'Visa Applications - The Travel Place';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Apply for travel visas without stress. We handle the paperwork while you plan your adventure.');
    }
  }, []);

  const handleSearch = (data: any) => {
    console.log('Visa search:', data)
    // Handle visa search logic here
  }

  return (
    <main id="main-content">
      <Header />
      
      <ServiceHero
        title="Visa Applications Made Easy"
        description="Apply for travel visas without stress. We handle the paperwork while you plan your adventure. Get expert guidance for a smooth application process."
        backgroundImage="/images/service-01.png"
      />

      <section className="py-12 bg-gray-50">
        <div className="container-custom">
          <SearchForm serviceType="visa-application" onSearch={handleSearch} />
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center">
            <h2 className="font-poppins font-bold text-3xl text-gray-900 mb-4">
              Popular Visa Types
            </h2>
            <p className="text-gray-600 mb-12">
              Choose the right visa type for your travel needs
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Visa type cards would go here */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-brand-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-brand-red text-2xl">🏖️</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">Tourist Visa</h3>
                <p className="text-gray-600 mb-4">Perfect for leisure travel and sightseeing</p>
                <button className="btn-primary w-full">Apply Now</button>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-brand-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-brand-red text-2xl">💼</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">Business Visa</h3>
                <p className="text-gray-600 mb-4">For business meetings and conferences</p>
                <button className="btn-primary w-full">Apply Now</button>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-brand-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-brand-red text-2xl">🎓</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">Student Visa</h3>
                <p className="text-gray-600 mb-4">For educational purposes and studies</p>
                <button className="btn-primary w-full">Apply Now</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}