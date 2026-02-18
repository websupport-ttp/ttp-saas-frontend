'use client'

import { useEffect, useState } from 'react'
import { SiteLayout } from '@/components/layout'
import { HeroSection, PackagesSection, ProcessSection, AboutUsSection, TestimonialSection, ArticlesSection, HotDealsSection } from '@/components/sections'

// Homepage structured data
const homepageStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'The Travel Place - Travel Made Effortless',
  description: 'From International and local flight booking to visa applications, hotel bookings, travel insurance, and local car rentals — The Travel Place brings everything you need to plan your trip together in one seamless, easy-to-use platform',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://travelplace.com',
  mainEntity: {
    '@type': 'TravelAgency',
    name: 'The Travel Place',
    description: 'Comprehensive travel booking platform',
    offers: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Flight Booking',
          description: 'International and domestic flight reservations'
        }
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Hotel Booking',
          description: 'Accommodation reservations worldwide'
        }
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Car Rental',
          description: 'Vehicle rental services'
        }
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Visa Applications',
          description: 'Travel visa processing and applications'
        }
      }
    ]
  }
}

export default function HomePage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <SiteLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </SiteLayout>
    )
  }

  return (
    <SiteLayout
      showHeader={true}
      title="Travel Made Effortless"
      description="From International and local flight booking to visa applications, hotel bookings, travel insurance, and local car rentals — The Travel Place brings everything you need to plan your trip together in one seamless, easy-to-use platform"
      keywords={[
        'travel booking',
        'flight booking',
        'hotel reservations',
        'car rental',
        'visa applications',
        'travel insurance',
        'vacation packages',
        'travel deals',
        'international travel',
        'domestic travel'
      ]}
      pageType="website"
      structuredData={homepageStructuredData}
      canonicalUrl={process.env.NEXT_PUBLIC_SITE_URL || 'https://travelplace.com'}
    >
      {/* Critical above-the-fold content */}
      <HeroSection />
      <PackagesSection />
      <HotDealsSection />
      <AboutUsSection />
      <TestimonialSection />
      <ArticlesSection />
      <ProcessSection />
    </SiteLayout>
  )
}