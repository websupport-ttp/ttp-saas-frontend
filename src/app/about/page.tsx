'use client'

import { Header } from '@/components/layout/Header'
import Image from 'next/image'

export default function AboutPage() {
  const stats = [
    { label: 'Happy Customers', value: '50,000+' },
    { label: 'Destinations', value: '200+' },
    { label: 'Years Experience', value: '15+' },
    { label: 'Travel Experts', value: '100+' }
  ]

  const team = [
    {
      name: 'Sarah Johnson',
      role: 'CEO & Founder',
      image: '/images/author-avatar-1.svg',
      bio: 'With over 20 years in the travel industry, Sarah founded The Travel Place to make travel accessible to everyone.'
    },
    {
      name: 'Michael Chen',
      role: 'Head of Operations',
      image: '/images/author-avatar-2.svg',
      bio: 'Michael ensures our operations run smoothly and our customers receive exceptional service worldwide.'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Travel Experience Director',
      image: '/images/author-avatar.svg',
      bio: 'Emily curates unique travel experiences and manages our destination partnerships globally.'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        {/* Hero Section */}
        <div className="bg-brand-blue text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                About The Travel Place
              </h1>
              <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">
                Your trusted partner in creating unforgettable travel experiences since 2009
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Our Story */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Founded in 2009, The Travel Place began as a small travel agency with a big dream: 
                  to make world-class travel experiences accessible to everyone. What started as a 
                  passion project has grown into one of Nigeria's most trusted travel companies.
                </p>
                <p>
                  We believe that travel has the power to transform lives, broaden perspectives, 
                  and create lasting memories. Our mission is to remove the barriers that prevent 
                  people from exploring the world, whether it's complex booking processes, 
                  language barriers, or simply not knowing where to start.
                </p>
                <p>
                  Today, we serve thousands of customers annually, helping them discover new 
                  destinations, reconnect with family abroad, and pursue their business goals 
                  around the globe.
                </p>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/images/about-people.svg"
                alt="About us"
                width={600}
                height={400}
                className="w-full h-auto rounded-lg"
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-brand-red mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Our Mission */}
          <div className="bg-white rounded-lg p-8 md:p-12 shadow-sm mb-20">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Our Mission
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                To democratize travel by providing seamless, affordable, and personalized 
                travel solutions that connect people to the world's most amazing destinations.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-brand-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Speed & Efficiency
                </h3>
                <p className="text-gray-600">
                  Quick bookings and instant confirmations to get you traveling faster
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-brand-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Customer First
                </h3>
                <p className="text-gray-600">
                  24/7 support and personalized service for every traveler
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-brand-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Trust & Reliability
                </h3>
                <p className="text-gray-600">
                  Secure bookings and guaranteed service you can depend on
                </p>
              </div>
            </div>
          </div>

          {/* Team */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Meet Our Team
              </h2>
              <p className="text-xl text-gray-600">
                The passionate people behind your travel experiences
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <div key={index} className="bg-white rounded-lg p-6 shadow-sm text-center">
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={120}
                    height={120}
                    className="w-24 h-24 rounded-full mx-auto mb-4"
                  />
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-brand-red font-medium mb-3">
                    {member.role}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {member.bio}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-r from-brand-red to-brand-orange rounded-lg p-8 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl mb-6 opacity-90">
              Join thousands of satisfied travelers who trust us with their adventures
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/"
                className="px-6 py-3 bg-white text-brand-red rounded-lg hover:bg-gray-100 transition-colors font-medium"
              >
                Start Planning
              </a>
              <a
                href="/contact"
                className="px-6 py-3 border-2 border-white text-white rounded-lg hover:bg-white hover:text-brand-red transition-colors font-medium"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}