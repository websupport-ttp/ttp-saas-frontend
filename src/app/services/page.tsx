'use client'

import { Header } from '@/components/layout/Header'
import Link from 'next/link'
import Image from 'next/image'

export default function ServicesPage() {
  const services = [
    {
      title: 'Flight Booking',
      description: 'Find and book flights to destinations worldwide with competitive prices and flexible options.',
      href: '/flights',
      icon: '/images/service-flight-icon.svg',
      image: '/images/service-01.png'
    },
    {
      title: 'Hotel Reservations',
      description: 'Book comfortable accommodations from budget-friendly to luxury hotels worldwide.',
      href: '/hotels',
      icon: '/images/service-hotel-icon.svg',
      image: '/images/service-02.png'
    },
    {
      title: 'Car Rental',
      description: 'Rent vehicles for your travel needs with flexible pickup and drop-off options.',
      href: '/car-hire',
      icon: '/images/service-car-icon.svg',
      image: '/images/service-03.png'
    },
    {
      title: 'Travel Insurance',
      description: 'Protect your trip with comprehensive travel insurance coverage.',
      href: '/travel-insurance',
      icon: '/images/service-visa-icon.svg',
      image: '/images/service-04.png'
    },
    {
      title: 'Visa Application',
      description: 'Get assistance with visa applications and requirements for your destination.',
      href: '/visa',
      icon: '/images/service-visa-icon.svg',
      image: '/images/service-05.png'
    },
    {
      title: 'Travel Packages',
      description: 'Discover curated travel packages combining flights, hotels, and activities.',
      href: '/packages',
      icon: '/images/service-tour-icon.svg',
      image: '/images/service-01.png'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Our Travel Services
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive travel solutions to make your journey seamless and memorable. 
              From flights to accommodations, we've got everything covered.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Link
                key={index}
                href={service.href}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden group"
              >
                <div className="aspect-w-16 aspect-h-9">
                  <Image
                    src={service.image}
                    alt={service.title}
                    width={400}
                    height={250}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-3">
                    <Image
                      src={service.icon}
                      alt=""
                      width={24}
                      height={24}
                      className="w-6 h-6 mr-3"
                    />
                    <h3 className="text-xl font-semibold text-gray-900">
                      {service.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 mb-4">
                    {service.description}
                  </p>
                  <div className="flex items-center text-brand-red font-medium">
                    Learn More
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* CTA Section */}
          <div className="mt-16 bg-brand-blue rounded-lg p-8 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">
              Need Help Planning Your Trip?
            </h2>
            <p className="text-xl mb-6 opacity-90">
              Our travel experts are here to help you create the perfect itinerary
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="px-6 py-3 bg-brand-red text-white rounded-lg hover:bg-brand-red-600 transition-colors font-medium"
              >
                Contact Us
              </Link>
              <Link
                href="tel:+234-800-TRAVEL"
                className="px-6 py-3 bg-white text-brand-blue rounded-lg hover:bg-gray-100 transition-colors font-medium"
              >
                Call Now
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}