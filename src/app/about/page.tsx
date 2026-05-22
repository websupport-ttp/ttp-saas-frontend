'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Image from 'next/image'
import { teamService, TeamMember } from '@/lib/services/team-service'
import { siteSettingsService, SiteSettings } from '@/lib/services/site-settings-service'

export default function AboutPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [team, siteSettings] = await Promise.all([
          teamService.getTeamMembers(),
          siteSettingsService.getSiteSettings()
        ])
        setTeamMembers(team)
        setSettings(siteSettings)
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])
  const stats = [
    { label: 'Happy Customers', value: '50,000+' },
    { label: 'Destinations', value: '200+' },
    { label: 'Years Experience', value: '15+' },
    { label: 'Travel Experts', value: '100+' }
  ]

  const foundedYear = settings?.foundedYear || 2016

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        {/* Hero Section */}
        <div className="bg-brand-blue text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                We exist to get you there
              </h1>
              <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">
                Since {foundedYear}, we've been turning travel dreams into real trips — one booking at a time.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Our Story */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                How it all started
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Back in {foundedYear}, we started with a simple frustration: booking travel was harder than it needed to be. 
                  Too many tabs, too many fees, too little clarity. So we built something better.
                </p>
                <p>
                  We believe a great trip starts long before you board the plane. It starts the moment 
                  you decide to go — and that moment should feel exciting, not stressful. Our job is 
                  to handle the logistics so you can focus on the adventure.
                </p>
                <p>
                  Today, tens of thousands of travellers trust us to get them where they're going — 
                  whether that's a quick business trip, a family holiday, or the solo adventure 
                  they've been putting off for years.
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
                What drives us
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Travel should be for everyone — not just those who can navigate a maze of booking sites. 
                We're here to make the whole experience feel effortless, from first search to safe return.
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
                  Fast & frictionless
                </h3>
                <p className="text-gray-600">
                  Book in minutes, get confirmed instantly. No waiting, no back-and-forth.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-brand-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  People over process
                </h3>
                <p className="text-gray-600">
                  Real humans on standby 24/7 — because sometimes you just need to talk to someone.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-brand-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No surprises
                </h3>
                <p className="text-gray-600">
                  What you see is what you pay. Transparent pricing, secure bookings, zero hidden fees.
                </p>
              </div>
            </div>
          </div>

          {/* Team */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                The people behind your trips
              </h2>
              <p className="text-xl text-gray-600">
                A small, passionate team obsessed with making travel easier for everyone.
              </p>
            </div>
            
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red"></div>
              </div>
            ) : teamMembers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {teamMembers.map((member) => (
                  <div key={member._id} className="bg-white rounded-lg p-6 shadow-sm text-center">
                    <Image
                      src={member.image || '/images/author-avatar.svg'}
                      alt={member.name}
                      width={120}
                      height={120}
                      className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                    />
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">
                      {member.name}
                    </h3>
                    <p className="text-brand-red font-medium mb-3">
                      {member.role}
                    </p>
                    {member.bio && (
                      <p className="text-gray-600 text-sm">
                        {member.bio}
                      </p>
                    )}
                    {(member.linkedin || member.twitter || member.email) && (
                      <div className="flex justify-center gap-3 mt-4">
                        {member.linkedin && (
                          <a
                            href={member.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-blue-600 transition-colors"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                            </svg>
                          </a>
                        )}
                        {member.twitter && (
                          <a
                            href={member.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-blue-400 transition-colors"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                            </svg>
                          </a>
                        )}
                        {member.email && (
                          <a
                            href={`mailto:${member.email}`}
                            className="text-gray-400 hover:text-brand-red transition-colors"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                No team members to display
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}