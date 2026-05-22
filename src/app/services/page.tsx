'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { Header } from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'

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

// ── CountUp component ─────────────────────────────────────────────────────────
// Parses "50K+", "4.9★", "150+" etc. and counts up the numeric part
function CountUp({ value, trigger }: { value: string; trigger: boolean }) {
  const [display, setDisplay] = useState('0')

  useEffect(() => {
    if (!trigger) return
    // Extract numeric part and suffix
    const match = value.match(/^([\d.]+)(.*)$/)
    if (!match) { setDisplay(value); return }
    const target = parseFloat(match[1])
    const suffix = match[2]
    const isDecimal = match[1].includes('.')
    const duration = 1200
    const steps = 40
    const interval = duration / steps
    let step = 0
    const timer = setInterval(() => {
      step++
      const progress = step / steps
      // Ease out
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = target * eased
      setDisplay((isDecimal ? current.toFixed(1) : Math.floor(current).toString()) + suffix)
      if (step >= steps) { setDisplay(value); clearInterval(timer) }
    }, interval)
    return () => clearInterval(timer)
  }, [trigger, value])

  return <>{display}</>
}

// ── Parallax hook ─────────────────────────────────────────────────────────────
function useParallax(speed = 0.3) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const onScroll = () => {
      const rect = el.getBoundingClientRect()
      const offset = (window.innerHeight / 2 - rect.top - rect.height / 2) * speed
      el.style.transform = `translateY(${offset}px)`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [speed])
  return ref
}

// ── Service data ──────────────────────────────────────────────────────────────
const services = [
  {
    title: 'Flight Booking',
    description: 'Search hundreds of airlines and snag the best fares — whether you\'re hopping locally or flying across continents.',
    href: '/flights',
    icon: 'flight',
    accent: '#e21e24',
    lightBg: '#fff5f5',
    stat: '500+ airlines',
  },
  {
    title: 'Hotel Reservations',
    description: 'From cosy guesthouses to five-star resorts, find the perfect place to rest your head at prices that make sense.',
    href: '/hotels',
    icon: 'hotel',
    accent: '#0ea5e9',
    lightBg: '#f0f9ff',
    stat: '1M+ properties',
  },
  {
    title: 'Car Rental',
    description: 'Hit the road on your own terms. Pick up a car at the airport or in town — flexible, affordable, and hassle-free.',
    href: '/car-hire',
    icon: 'directions_car',
    accent: '#f59e0b',
    lightBg: '#fffbeb',
    stat: 'Pickup anywhere',
  },
  {
    title: 'Travel Insurance',
    description: 'Travel with total peace of mind. Our plans cover medical emergencies, cancellations, lost luggage, and more.',
    href: '/travel-insurance',
    icon: 'health_and_safety',
    accent: '#10b981',
    lightBg: '#f0fdf4',
    stat: 'Instant coverage',
  },
  {
    title: 'Visa Assistance',
    description: 'Navigating visa requirements can be stressful — we make it simple with step-by-step guidance and document support.',
    href: '/visa-application',
    icon: 'badge',
    accent: '#8b5cf6',
    lightBg: '#f5f3ff',
    stat: '100+ countries',
  },
  {
    title: 'Travel Packages',
    description: 'Let us do the planning. Our curated packages bundle flights, hotels, and experiences into one seamless trip.',
    href: '/packages',
    icon: 'card_travel',
    accent: '#e21e24',
    lightBg: '#fff5f5',
    stat: 'All-inclusive deals',
  },
]

const reasons = [
  { icon: 'verified', title: 'Trusted & Secure', text: 'Your payments and personal data are protected with bank-level security.' },
  { icon: 'support_agent', title: '24/7 Support', text: 'Real humans, always on call. Reach us any time — day or night.' },
  { icon: 'price_check', title: 'Best Price Promise', text: 'We match or beat any comparable price. No hidden fees, ever.' },
  { icon: 'bolt', title: 'Instant Confirmation', text: 'Book in minutes and get your confirmation straight to your inbox.' },
]

// ── Service Row (horizontal feature list item) ────────────────────────────────
function ServiceRow({ service, index }: { service: typeof services[0]; index: number }) {
  const { ref, inView } = useInView()
  const [hovered, setHovered] = useState(false)

  return (
    <div
      ref={ref}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateX(0)' : 'translateX(-30px)',
        transition: `opacity 0.55s ease ${index * 0.07}s, transform 0.55s ease ${index * 0.07}s`,
      }}
    >
      <Link
        href={service.href}
        className="group block"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div
          className="relative flex items-start gap-5 bg-white rounded-2xl p-5 border border-gray-100 overflow-hidden"
          style={{
            boxShadow: hovered ? '0 8px 30px -6px rgba(0,0,0,0.10)' : '0 2px 10px -4px rgba(0,0,0,0.05)',
            transition: 'box-shadow 0.3s ease',
          }}
        >
          {/* Sliding left border */}
          <div
            className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
            style={{
              backgroundColor: service.accent,
              transform: hovered ? 'scaleY(1)' : 'scaleY(0)',
              transformOrigin: 'top',
              transition: 'transform 0.3s ease',
            }}
          />

          {/* Icon */}
          <div
            className="flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{
              backgroundColor: service.lightBg,
              transform: hovered ? 'scale(1.06)' : 'scale(1)',
              transition: 'transform 0.3s ease',
            }}
          >
            <span className="material-icons text-3xl" style={{ color: service.accent }}>
              {service.icon}
            </span>
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <h3
                className="text-base font-bold"
                style={{ color: hovered ? service.accent : '#111827', transition: 'color 0.2s ease' }}
              >
                {service.title}
              </h3>
              <span
                className="text-xs font-semibold px-2 py-0.5 rounded-full"
                style={{ backgroundColor: service.lightBg, color: service.accent }}
              >
                {service.stat}
              </span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              {service.description}
            </p>
          </div>

          {/* Arrow */}
          <div
            className="flex-shrink-0 self-center"
            style={{
              transform: hovered ? 'translateX(4px)' : 'translateX(0)',
              transition: 'transform 0.25s ease',
            }}
          >
            <span className="material-icons text-xl" style={{ color: service.accent }}>arrow_forward</span>
          </div>
        </div>
      </Link>
    </div>
  )
}

// ── Hero icon grid (right side) ───────────────────────────────────────────────
const heroGridIcons = [
  { icon: 'flight', accent: '#e21e24', lightBg: 'rgba(226,30,36,0.15)' },
  { icon: 'hotel', accent: '#0ea5e9', lightBg: 'rgba(14,165,233,0.15)' },
  { icon: 'directions_car', accent: '#f59e0b', lightBg: 'rgba(245,158,11,0.15)' },
  { icon: 'health_and_safety', accent: '#10b981', lightBg: 'rgba(16,185,129,0.15)' },
  { icon: 'badge', accent: '#8b5cf6', lightBg: 'rgba(139,92,246,0.15)' },
  { icon: 'card_travel', accent: '#e21e24', lightBg: 'rgba(226,30,36,0.15)' },
]

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ServicesPage() {
  const heroParallax = useParallax(0.2)
  const { ref: heroRef, inView: heroInView } = useInView(0.1)

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <Header />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden" style={{ backgroundColor: '#141b34' }}>
        {/* Parallax blobs */}
        <div ref={heroParallax} className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-10" style={{ backgroundColor: '#e21e24', filter: 'blur(80px)' }} />
          <div className="absolute bottom-0 -left-24 w-80 h-80 rounded-full opacity-10" style={{ backgroundColor: '#e21e24', filter: 'blur(80px)' }} />
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

            {/* Left: text content */}
            <div ref={heroRef} className="lg:w-1/2">
              {/* Eyebrow */}
              <div
                className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-6 border"
                style={{
                  backgroundColor: 'rgba(226,30,36,0.1)',
                  borderColor: 'rgba(226,30,36,0.3)',
                  opacity: heroInView ? 1 : 0,
                  transform: heroInView ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'opacity 0.6s ease, transform 0.6s ease',
                }}
              >
                <span className="material-icons text-sm" style={{ color: '#e21e24' }}>explore</span>
                <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.8)' }}>Everything you need to travel well</span>
              </div>

              <h1
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight"
                style={{
                  opacity: heroInView ? 1 : 0,
                  transform: heroInView ? 'translateY(0)' : 'translateY(30px)',
                  transition: 'opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s',
                }}
              >
                Travel smarter,<br />
                <span style={{ color: '#e21e24' }}>not harder</span>
              </h1>

              <p
                className="text-lg lg:text-xl mb-10 leading-relaxed"
                style={{
                  color: 'rgba(255,255,255,0.7)',
                  opacity: heroInView ? 1 : 0,
                  transform: heroInView ? 'translateY(0)' : 'translateY(30px)',
                  transition: 'opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s',
                }}
              >
                From your first search to your safe return home — we handle every detail so you can focus on the adventure.
              </p>

              {/* Stats */}
              <div
                className="flex flex-wrap gap-8"
                style={{
                  opacity: heroInView ? 1 : 0,
                  transform: heroInView ? 'translateY(0)' : 'translateY(30px)',
                  transition: 'opacity 0.7s ease 0.35s, transform 0.7s ease 0.35s',
                }}
              >
                {[
                  { value: '50K+', label: 'Happy travellers' },
                  { value: '150+', label: 'Destinations' },
                  { value: '4.9★', label: 'Average rating' },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="text-3xl font-extrabold text-white">
                      <CountUp value={s.value} trigger={heroInView} />
                    </div>
                    <div className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: decorative 2×3 icon grid — lg+ only */}
            <div className="lg:w-1/2 hidden lg:flex items-center justify-center">
              <div className="grid grid-cols-3 gap-5">
                {heroGridIcons.map((item, i) => (
                  <div
                    key={item.icon + i}
                    className="w-24 h-24 rounded-3xl flex items-center justify-center"
                    style={{
                      backgroundColor: item.lightBg,
                      animation: `float ${2.4 + i * 0.4}s ease-in-out infinite alternate`,
                      animationDelay: `${i * 0.18}s`,
                    }}
                  >
                    <span className="material-icons text-4xl" style={{ color: item.accent }}>{item.icon}</span>
                  </div>
                ))}
              </div>
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Services horizontal list ── */}
        <section className="py-20">
          <SectionHeader
            eyebrow="What we offer"
            title="Six ways we make travel easy"
            subtitle="Pick what you need — or let us bundle it all together."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12">
            {services.map((service, i) => (
              <ServiceRow key={service.href} service={service} index={i} />
            ))}
          </div>
        </section>

        {/* ── Why choose us ── */}
        <section className="py-20">
          <div className="rounded-3xl overflow-hidden" style={{ backgroundColor: '#141b34' }}>
            <div className="grid lg:grid-cols-2">
              {/* Left */}
              <div className="p-10 lg:p-14">
                <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-5 border" style={{ backgroundColor: 'rgba(226,30,36,0.1)', borderColor: 'rgba(226,30,36,0.3)' }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#e21e24' }} />
                  <span className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.7)' }}>Why travellers choose us</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-10 leading-tight">
                  We've got your back,<br />every step of the way
                </h2>
                <div className="space-y-8">
                  {reasons.map((r, i) => {
                    const { ref, inView } = useInView()
                    return (
                      <div
                        key={r.title}
                        ref={ref}
                        className="flex gap-4"
                        style={{
                          opacity: inView ? 1 : 0,
                          transform: inView ? 'translateX(0)' : 'translateX(-20px)',
                          transition: `opacity 0.5s ease ${i * 0.1}s, transform 0.5s ease ${i * 0.1}s`,
                        }}
                      >
                        <div className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(226,30,36,0.15)' }}>
                          <span className="material-icons text-xl" style={{ color: '#e21e24' }}>{r.icon}</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-white mb-1">{r.title}</h4>
                          <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>{r.text}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Right — floating icons */}
              <div className="relative hidden lg:flex items-center justify-center p-14 overflow-hidden">
                <div className="absolute inset-0" style={{ backgroundColor: 'rgba(255,255,255,0.03)' }} />
                <div className="relative grid grid-cols-3 gap-5">
                  {services.map((s, i) => (
                    <div
                      key={s.icon}
                      className="w-20 h-20 rounded-2xl flex items-center justify-center"
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.07)',
                        animation: `float ${2.5 + i * 0.35}s ease-in-out infinite alternate`,
                        animationDelay: `${i * 0.15}s`,
                      }}
                    >
                      <span className="material-icons text-3xl" style={{ color: s.accent }}>{s.icon}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── How it works ── */}
        <section className="py-20">
          <SectionHeader
            eyebrow="How it works"
            title="Book your trip in three simple steps"
            subtitle="No complicated forms, no endless tabs. Just a smooth path from idea to itinerary."
          />
          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-10 left-[calc(33%+2rem)] right-[calc(33%+2rem)] h-px" style={{ backgroundColor: 'rgba(226,30,36,0.2)' }} />
            {[
              { step: '01', icon: 'search', title: 'Search & compare', text: 'Tell us where you want to go and when. We\'ll surface the best options instantly.' },
              { step: '02', icon: 'tune', title: 'Customise your trip', text: 'Add insurance, pick your seat, choose extras — everything in one place.' },
              { step: '03', icon: 'check_circle', title: 'Book & go', text: 'Pay securely and get instant confirmation. Your adventure starts now.' },
            ].map((step, i) => {
              const { ref, inView } = useInView()
              return (
                <div
                  key={step.step}
                  ref={ref}
                  className="text-center group"
                  style={{
                    opacity: inView ? 1 : 0,
                    transform: inView ? 'translateY(0)' : 'translateY(40px)',
                    transition: `opacity 0.6s ease ${i * 0.15}s, transform 0.6s ease ${i * 0.15}s`,
                  }}
                >
                  <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 transition-colors duration-300 cursor-default"
                    style={{ backgroundColor: 'rgba(226,30,36,0.08)' }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#e21e24')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgba(226,30,36,0.08)')}
                  >
                    <span className="material-icons text-3xl" style={{ color: '#e21e24' }}>{step.icon}</span>
                    <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full text-white text-xs font-bold flex items-center justify-center" style={{ backgroundColor: '#e21e24' }}>
                      {step.step}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{step.text}</p>
                </div>
              )
            })}
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-20">
          <CtaBanner />
        </section>

      </main>

      <Footer />

      <style jsx global>{`
        @keyframes float {
          from { transform: translateY(0px); }
          to   { transform: translateY(-12px); }
        }
      `}</style>
    </div>
  )
}

// ── Shared sub-components ─────────────────────────────────────────────────────

function SectionHeader({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  const { ref, inView } = useInView()
  return (
    <div ref={ref} className="text-center max-w-2xl mx-auto">
      <div
        className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-4"
        style={{
          backgroundColor: 'rgba(226,30,36,0.08)',
          opacity: inView ? 1 : 0,
          transform: inView ? 'translateY(0)' : 'translateY(15px)',
          transition: 'opacity 0.5s ease, transform 0.5s ease',
        }}
      >
        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#e21e24' }} />
        <span className="text-sm font-semibold" style={{ color: '#e21e24' }}>{eyebrow}</span>
      </div>
      <h2
        className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4"
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s',
        }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className="text-gray-500 text-lg"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.6s ease 0.2s, transform 0.6s ease 0.2s',
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  )
}

function CtaBanner() {
  const { ref, inView } = useInView()
  return (
    <div
      ref={ref}
      className="relative rounded-3xl p-10 lg:p-14 text-center overflow-hidden"
      style={{
        backgroundColor: '#141b34',
        opacity: inView ? 1 : 0,
        transform: inView ? 'scale(1)' : 'scale(0.97)',
        transition: 'opacity 0.6s ease, transform 0.6s ease',
      }}
    >
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full -translate-y-1/2 translate-x-1/2" style={{ backgroundColor: 'rgba(226,30,36,0.08)' }} />
      <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full translate-y-1/2 -translate-x-1/2" style={{ backgroundColor: 'rgba(226,30,36,0.05)' }} />

      <div className="relative">
        <span className="material-icons text-7xl mb-4 block" style={{ color: 'rgba(255,255,255,0.1)' }}>travel_explore</span>
        <h2 className="text-3xl lg:text-4xl font-extrabold text-white mb-4">
          Ready to start your next adventure?
        </h2>
        <p className="text-lg mb-8 max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.6)' }}>
          Our travel experts are standing by to help you plan the perfect trip — just the way you like it.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/flights"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold transition-all duration-200 hover:-translate-y-0.5"
            style={{ backgroundColor: '#e21e24', color: 'white' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#c41e24')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#e21e24')}
          >
            <span className="material-icons text-xl">flight_takeoff</span>
            Search flights
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold border transition-all duration-200"
            style={{ color: 'white', borderColor: 'rgba(255,255,255,0.2)', backgroundColor: 'rgba(255,255,255,0.07)' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.12)')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.07)')}
          >
            <span className="material-icons text-xl">support_agent</span>
            Talk to an expert
          </Link>
        </div>
      </div>
    </div>
  )
}
