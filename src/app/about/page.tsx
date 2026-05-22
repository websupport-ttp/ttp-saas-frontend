'use client'

import { useState, useEffect, useRef } from 'react'
import { Header } from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Image from 'next/image'
import { teamService, TeamMember } from '@/lib/services/team-service'
import { siteSettingsService, SiteSettings } from '@/lib/services/site-settings-service'

// ── Animation hook ────────────────────────────────────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true) }, { threshold })
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, inView }
}

// Hero stats animate on mount since they're above the fold.
// We use a two-step approach: start invisible, then add a class after mount.
function useOnMount(delay = 200) {
  const [triggered, setTriggered] = useState(false)
  useEffect(() => {
    // requestAnimationFrame ensures the browser has painted the initial state
    // before we trigger the transition, so the animation is always visible.
    const raf = requestAnimationFrame(() => {
      const t = setTimeout(() => setTriggered(true), delay)
      return () => clearTimeout(t)
    })
    return () => cancelAnimationFrame(raf)
  }, [delay])
  return triggered
}

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
    { label: 'Happy travellers', value: '50K+' },
    { label: 'Destinations', value: '200+' },
    { label: 'Years', value: '15+' },
    { label: 'Rating', value: '4.9★' },
  ]

  const foundedYear = settings?.foundedYear || 2016

  const { ref: heroRef, inView: heroInView } = useInView(0.1)
  const heroMounted = useOnMount(200) // above-fold trigger
  const { ref: storyRef, inView: storyInView } = useInView(0.1)
  const { ref: missionRef, inView: missionInView } = useInView(0.1)
  const { ref: teamRef, inView: teamInView } = useInView(0.1)

  const milestones = [
    { year: `${foundedYear}`, label: 'Founded', text: 'Started with a simple idea: make travel booking effortless for everyone.' },
    { year: '2019', label: '10K customers', text: 'Reached our first major milestone — 10,000 happy travellers.' },
    { year: '2024', label: '50K customers', text: 'Tens of thousands of trips later, we\'re still just getting started.' },
  ]

  const values = [
    {
      icon: 'bolt',
      title: 'Fast & frictionless',
      text: 'Book in minutes, get confirmed instantly. No waiting, no back-and-forth.',
      accent: '#e21e24',
      lightBg: 'rgba(226,30,36,0.15)',
    },
    {
      icon: 'favorite',
      title: 'People over process',
      text: 'Real humans on standby 24/7 — because sometimes you just need to talk to someone.',
      accent: '#0ea5e9',
      lightBg: 'rgba(14,165,233,0.15)',
    },
    {
      icon: 'verified',
      title: 'No surprises',
      text: 'What you see is what you pay. Transparent pricing, secure bookings, zero hidden fees.',
      accent: '#10b981',
      lightBg: 'rgba(16,185,129,0.15)',
    },
  ]

  const teamGradients = [
    'linear-gradient(135deg, #e21e24 0%, #c41e24 100%)',
    'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
    'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
    'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    'linear-gradient(135deg, #e21e24 0%, #8b5cf6 100%)',
  ]

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <Header />

      <main>
        {/* ── Hero ── */}
        <section className="relative overflow-hidden" style={{ backgroundColor: '#141b34' }}>
          {/* Background blobs */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-10" style={{ backgroundColor: '#e21e24', filter: 'blur(70px)' }} />
            <div className="absolute bottom-0 -left-20 w-72 h-72 rounded-full opacity-10" style={{ backgroundColor: '#e21e24', filter: 'blur(70px)' }} />
          </div>
          {/* Grid overlay */}
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }} />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

              {/* Left: text */}
              <div
                ref={heroRef}
                className="lg:w-1/2"
                style={{
                  opacity: heroMounted ? 1 : 0,
                  transform: heroMounted ? 'translateY(0)' : 'translateY(30px)',
                  transition: 'opacity 0.7s ease, transform 0.7s ease',
                }}
              >
                <div
                  className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-6 border"
                  style={{ backgroundColor: 'rgba(226,30,36,0.1)', borderColor: 'rgba(226,30,36,0.3)' }}
                >
                  <span className="material-icons text-sm" style={{ color: '#e21e24' }}>info</span>
                  <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.8)' }}>Our story</span>
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
                  We exist to<br />
                  <span style={{ color: '#e21e24' }}>get you there</span>
                </h1>
                <p className="text-lg lg:text-xl leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  Since {foundedYear}, we've been turning travel dreams into real trips — one booking at a time.
                </p>
              </div>

              {/* Right: 2×2 stat cards */}
              <div className="lg:w-1/2 grid grid-cols-2 gap-4 w-full max-w-md lg:max-w-none">
                {stats.map((stat, i) => (
                  <div
                    key={stat.label}
                    className="bg-white rounded-2xl p-6 text-center shadow-lg"
                    style={{
                      opacity: heroMounted ? 1 : 0,
                      transform: heroMounted ? 'translateY(0)' : 'translateY(30px)',
                      transition: `opacity 0.6s ease ${0.2 + i * 0.12}s, transform 0.6s ease ${0.2 + i * 0.12}s`,
                    }}
                  >
                    <div className="text-3xl lg:text-4xl font-extrabold mb-1" style={{ color: '#e21e24' }}>
                      {stat.value}
                    </div>
                    <div className="text-sm font-medium text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>

            </div>
          </div>

          {/* Wave */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full block">
              <path d="M0 48L1440 48L1440 16C1200 48 960 0 720 16C480 32 240 0 0 16L0 48Z" fill="#F9FAFB" />
            </svg>
          </div>
        </section>

        {/* ── How it all started ── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

            {/* Left: story text */}
            <div
              ref={storyRef}
              style={{
                opacity: storyInView ? 1 : 0,
                transform: storyInView ? 'translateX(0)' : 'translateX(-30px)',
                transition: 'opacity 0.7s ease, transform 0.7s ease',
              }}
            >
              <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-5" style={{ backgroundColor: 'rgba(226,30,36,0.08)' }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#e21e24' }} />
                <span className="text-sm font-semibold" style={{ color: '#e21e24' }}>Our origin</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-6">
                How it all started
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
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

            {/* Right: vertical timeline */}
            <div
              style={{
                opacity: storyInView ? 1 : 0,
                transform: storyInView ? 'translateX(0)' : 'translateX(30px)',
                transition: 'opacity 0.7s ease 0.15s, transform 0.7s ease 0.15s',
              }}
            >
              <div className="relative pl-8">
                {/* Vertical line */}
                <div className="absolute left-3 top-4 bottom-4 w-0.5" style={{ backgroundColor: 'rgba(226,30,36,0.2)' }} />

                <div className="space-y-8">
                  {milestones.map((m, i) => (
                    <div key={m.year} className="relative flex gap-5 items-start">
                      {/* Dot */}
                      <div
                        className="absolute -left-5 w-4 h-4 rounded-full border-2 border-white flex-shrink-0 mt-1"
                        style={{ backgroundColor: '#e21e24', boxShadow: '0 0 0 3px rgba(226,30,36,0.2)' }}
                      />
                      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex-1">
                        <div
                          className="inline-block text-xs font-bold px-3 py-1 rounded-full mb-2"
                          style={{ backgroundColor: 'rgba(226,30,36,0.08)', color: '#e21e24' }}
                        >
                          {m.year} · {m.label}
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed">{m.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ── What drives us ── */}
        <section style={{ backgroundColor: '#141b34' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div
              ref={missionRef}
              className="text-center mb-14"
              style={{
                opacity: missionInView ? 1 : 0,
                transform: missionInView ? 'translateY(0)' : 'translateY(20px)',
                transition: 'opacity 0.6s ease, transform 0.6s ease',
              }}
            >
              <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-5 border" style={{ backgroundColor: 'rgba(226,30,36,0.1)', borderColor: 'rgba(226,30,36,0.3)' }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#e21e24' }} />
                <span className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.7)' }}>Our values</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
                What drives us
              </h2>
              <p className="text-lg max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,0.6)' }}>
                Travel should be for everyone — not just those who can navigate a maze of booking sites.
              </p>
            </div>

            <div className="space-y-4 max-w-3xl mx-auto">
              {values.map((v, i) => (
                <div
                  key={v.title}
                  className="flex items-start gap-5 rounded-2xl p-6"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    opacity: missionInView ? 1 : 0,
                    transform: missionInView ? 'translateX(0)' : 'translateX(-20px)',
                    transition: `opacity 0.5s ease ${0.1 + i * 0.12}s, transform 0.5s ease ${0.1 + i * 0.12}s`,
                  }}
                >
                  <div
                    className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: v.lightBg }}
                  >
                    <span className="material-icons text-2xl" style={{ color: v.accent }}>{v.icon}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">{v.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>{v.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Team ── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div
            ref={teamRef}
            className="text-center mb-12"
            style={{
              opacity: teamInView ? 1 : 0,
              transform: teamInView ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 0.6s ease, transform 0.6s ease',
            }}
          >
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-5" style={{ backgroundColor: 'rgba(226,30,36,0.08)' }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#e21e24' }} />
              <span className="text-sm font-semibold" style={{ color: '#e21e24' }}>Meet the team</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
              The people behind your trips
            </h2>
            <p className="text-xl text-gray-500">
              A small, passionate team obsessed with making travel easier for everyone.
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#e21e24' }}></div>
            </div>
          ) : teamMembers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {teamMembers.map((member, idx) => (
                <div
                  key={member._id}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 text-center"
                  style={{
                    opacity: teamInView ? 1 : 0,
                    transform: teamInView ? 'translateY(0)' : 'translateY(30px)',
                    transition: `opacity 0.6s ease ${idx * 0.1}s, transform 0.6s ease ${idx * 0.1}s`,
                  }}
                >
                  {/* Gradient top bar */}
                  <div className="h-2 w-full" style={{ background: teamGradients[idx % teamGradients.length] }} />

                  <div className="p-6">
                    <Image
                      src={member.image || '/images/author-avatar.svg'}
                      alt={member.name}
                      width={120}
                      height={120}
                      className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-white shadow-md"
                    />
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {member.name}
                    </h3>
                    <p className="font-semibold mb-3 text-sm" style={{ color: '#e21e24' }}>
                      {member.role}
                    </p>
                    {member.bio && (
                      <p className="text-gray-500 text-sm leading-relaxed">
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
                            className="text-gray-400 transition-colors"
                            style={{ color: undefined }}
                            onMouseEnter={e => (e.currentTarget.style.color = '#e21e24')}
                            onMouseLeave={e => (e.currentTarget.style.color = '')}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              No team members to display
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  )
}
