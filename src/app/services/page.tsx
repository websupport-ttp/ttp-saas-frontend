'use client'

import { useEffect, useRef, useState } from 'react'
import { Header } from '@/components/layout/Header'
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
    color: 'from-blue-500 to-blue-600',
    lightColor: 'bg-blue-50',
    iconColor: 'text-blue-600',
    stat: '500+ airlines',
  },
  {
    title: 'Hotel Reservations',
    description: 'From cosy guesthouses to five-star resorts, find the perfect place to rest your head at prices that make sense.',
    href: '/hotels',
    icon: 'hotel',
    color: 'from-emerald-500 to-emerald-600',
    lightColor: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    stat: '1M+ properties',
  },
  {
    title: 'Car Rental',
    description: 'Hit the road on your own terms. Pick up a car at the airport or in town — flexible, affordable, and hassle-free.',
    href: '/car-hire',
    icon: 'directions_car',
    color: 'from-orange-500 to-orange-600',
    lightColor: 'bg-orange-50',
    iconColor: 'text-orange-600',
    stat: 'Pickup anywhere',
  },
  {
    title: 'Travel Insurance',
    description: 'Travel with total peace of mind. Our plans cover medical emergencies, cancellations, lost luggage, and more.',
    href: '/travel-insurance',
    icon: 'health_and_safety',
    color: 'from-purple-500 to-purple-600',
    lightColor: 'bg-purple-50',
    iconColor: 'text-purple-600',
    stat: 'Instant coverage',
  },
  {
    title: 'Visa Assistance',
    description: 'Navigating visa requirements can be stressful — we make it simple with step-by-step guidance and document support.',
    href: '/visa-application',
    icon: 'badge',
    color: 'from-rose-500 to-rose-600',
    lightColor: 'bg-rose-50',
    iconColor: 'text-rose-600',
    stat: '100+ countries',
  },
  {
    title: 'Travel Packages',
    description: 'Let us do the planning. Our curated packages bundle flights, hotels, and experiences into one seamless trip.',
    href: '/packages',
    icon: 'card_travel',
    color: 'from-brand-red to-red-600',
    lightColor: 'bg-red-50',
    iconColor: 'text-brand-red',
    stat: 'All-inclusive deals',
  },
]

// ── Why choose us ─────────────────────────────────────────────────────────────
const reasons = [
  { icon: 'verified', title: 'Trusted & Secure', text: 'Your payments and personal data are protected with bank-level security.' },
  { icon: 'support_agent', title: '24/7 Support', text: 'Real humans, always on call. Reach us any time — day or night.' },
  { icon: 'price_check', title: 'Best Price Promise', text: 'We match or beat any comparable price. No hidden fees, ever.' },
  { icon: 'bolt', title: 'Instant Confirmation', text: 'Book in minutes and get your confirmation straight to your inbox.' },
]

// ── Service Card ──────────────────────────────────────────────────────────────
function ServiceCard({ service, index }: { service: typeof services[0]; index: number }) {
  const { ref, inView } = useInView()
  const [hovered, setHovered] = useState(false)

  return (
    <div
      ref={ref}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(40px)',
        transition: `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`,
      }}
    >
      <Link
        href={service.href}
        className="group block h-full"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div
          className="relative h-full bg-white rounded-2xl overflow-hidden border border-gray-100"
          style={{
            boxShadow: hovered
              ? '0 20px 60px -10px rgba(0,0,0,0.15)'
              : '0 4px 20px -4px rgba(0,0,0,0.06)',
            transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
            transition: 'box-shadow 0.3s ease, transform 0.3s ease',
          }}
        >
          {/* Gradient top bar */}
          <div className={`h-1.5 w-full bg-gradient-to-r ${service.color}`} />

          <div className="p-7">
            {/* Icon */}
            <div
              className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl ${service.lightColor} mb-5`}
              style={{
                transform: hovered ? 'scale(1.1) rotate(-5deg)' : 'scale(1) rotate(0deg)',
                transition: 'transform 0.3s ease',
              }}
            >
              <span className={`material-icons text-3xl ${service.iconColor}`}>
                {service.icon}
              </span>
            </div>

            {/* Stat badge */}
            <div className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${service.lightColor} ${service.iconColor} mb-4`}>
              {service.stat}
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-brand-red transition-colors duration-200">
              {service.title}
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-5">
              {service.description}
            </p>

            {/* CTA */}
            <div className="flex items-center text-brand-red font-semibold text-sm">
              <span>Explore</span>
              <span
                className="material-icons text-base ml-1"
                style={{
                  transform: hovered ? 'translateX(5px)' : 'translateX(0)',
                  transition: 'transform 0.25s ease',
                }}
              >
                arrow_forward
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}

// ── Reason Card ───────────────────────────────────────────────────────────────
function ReasonCard({ reason, index }: { reason: typeof reasons[0]; index: number }) {
  const { ref, inView } = useInView()
  return (
    <div
      ref={ref}
      className="flex gap-4"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateX(0)' : 'translateX(-30px)',
        transition: `opacity 0.5s ease ${index * 0.12}s, transform 0.5s ease ${index * 0.12}s`,
      }}
    >
      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
        <span className="material-icons text-white text-2xl">{reason.icon}</span>
      </div>
      <div>
        <h4 className="font-bold text-white mb-1">{reason.title}</h4>
        <p className="text-blue-100 text-sm leading-relaxed">{reason.text}</p>
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ServicesPage() {
  const heroParallax = useParallax(0.25)
  const { ref: heroRef, inView: heroInView } = useInView(0.1)

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <Header />

      {/* ── Hero ── */}
      <section className="relative bg-gradient-to-br from-brand-blue via-blue-700 to-blue-900 overflow-hidden">
        {/* Parallax background blobs */}
        <div ref={heroParallax} className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 -left-20 w-80 h-80 bg-brand-red/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/3 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <div ref={heroRef}>
            {/* Eyebrow */}
            <div
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6"
              style={{
                opacity: heroInView ? 1 : 0,
                transform: heroInView ? 'translateY(0)' : 'translateY(20px)',
                transition: 'opacity 0.6s ease, transform 0.6s ease',
              }}
            >
              <span className="material-icons text-brand-red text-sm">explore</span>
              <span className="text-white/90 text-sm font-medium">Everything you need to travel well</span>
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
              <span className="text-brand-red">not harder</span>
            </h1>

            <p
              className="text-xl text-blue-100 max-w-2xl mx-auto mb-10"
              style={{
                opacity: heroInView ? 1 : 0,
                transform: heroInView ? 'translateY(0)' : 'translateY(30px)',
                transition: 'opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s',
              }}
            >
              From your first search to your safe return home — we handle every detail so you can focus on the adventure.
            </p>

            {/* Stats row */}
            <div
              className="flex flex-wrap justify-center gap-8"
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
                <div key={s.label} className="text-center">
                  <div className="text-3xl font-extrabold text-white">{s.value}</div>
                  <div className="text-blue-200 text-sm mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 60L1440 60L1440 20C1200 60 960 0 720 20C480 40 240 0 0 20L0 60Z" fill="#F9FAFB" />
          </svg>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Services Grid ── */}
        <section className="py-20">
          <SectionHeader
            eyebrow="What we offer"
            title="Six ways we make travel easy"
            subtitle="Pick what you need — or let us bundle it all together."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 mt-12">
            {services.map((service, i) => (
              <ServiceCard key={service.href} service={service} index={i} />
            ))}
          </div>
        </section>

        {/* ── Why choose us ── */}
        <section className="py-20">
          <div className="bg-gradient-to-br from-brand-blue to-blue-900 rounded-3xl overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-0">
              {/* Left — text */}
              <div className="p-10 lg:p-14">
                <SectionHeaderLight
                  eyebrow="Why travellers choose us"
                  title="We've got your back, every step of the way"
                />
                <div className="mt-10 space-y-7">
                  {reasons.map((r, i) => <ReasonCard key={r.title} reason={r} index={i} />)}
                </div>
              </div>

              {/* Right — decorative */}
              <div className="relative hidden lg:flex items-center justify-center p-14 overflow-hidden">
                <div className="absolute inset-0 bg-white/5" />
                <div className="relative grid grid-cols-2 gap-5">
                  {['flight', 'hotel', 'directions_car', 'health_and_safety', 'badge', 'card_travel'].map((icon, i) => (
                    <div
                      key={icon}
                      className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center"
                      style={{
                        animation: `float ${2.5 + i * 0.4}s ease-in-out infinite alternate`,
                        animationDelay: `${i * 0.2}s`,
                      }}
                    >
                      <span className="material-icons text-white text-3xl">{icon}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Process steps ── */}
        <section className="py-20">
          <SectionHeader
            eyebrow="How it works"
            title="Book your trip in three simple steps"
            subtitle="No complicated forms, no endless tabs. Just a smooth path from idea to itinerary."
          />
          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-10 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-brand-red/30 via-brand-red to-brand-red/30" />

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
                  className="text-center"
                  style={{
                    opacity: inView ? 1 : 0,
                    transform: inView ? 'translateY(0)' : 'translateY(40px)',
                    transition: `opacity 0.6s ease ${i * 0.15}s, transform 0.6s ease ${i * 0.15}s`,
                  }}
                >
                  <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-brand-red/10 mb-6 group hover:bg-brand-red transition-colors duration-300">
                    <span className="material-icons text-brand-red text-3xl group-hover:text-white transition-colors duration-300">{step.icon}</span>
                    <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-brand-red text-white text-xs font-bold flex items-center justify-center">
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

      {/* Float animation keyframes */}
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
        className="inline-flex items-center gap-2 bg-brand-red/10 rounded-full px-4 py-1.5 mb-4"
        style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(15px)', transition: 'opacity 0.5s ease, transform 0.5s ease' }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-brand-red" />
        <span className="text-brand-red text-sm font-semibold">{eyebrow}</span>
      </div>
      <h2
        className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4"
        style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(20px)', transition: 'opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s' }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className="text-gray-500 text-lg"
          style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(20px)', transition: 'opacity 0.6s ease 0.2s, transform 0.6s ease 0.2s' }}
        >
          {subtitle}
        </p>
      )}
    </div>
  )
}

function SectionHeaderLight({ eyebrow, title }: { eyebrow: string; title: string }) {
  const { ref, inView } = useInView()
  return (
    <div ref={ref}>
      <div
        className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 mb-4"
        style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(15px)', transition: 'opacity 0.5s ease, transform 0.5s ease' }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-brand-red" />
        <span className="text-white/80 text-sm font-semibold">{eyebrow}</span>
      </div>
      <h2
        className="text-3xl sm:text-4xl font-extrabold text-white leading-tight"
        style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(20px)', transition: 'opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s' }}
      >
        {title}
      </h2>
    </div>
  )
}

function CtaBanner() {
  const { ref, inView } = useInView()
  return (
    <div
      ref={ref}
      className="relative bg-gradient-to-r from-brand-red to-rose-600 rounded-3xl p-10 lg:p-14 text-center overflow-hidden"
      style={{ opacity: inView ? 1 : 0, transform: inView ? 'scale(1)' : 'scale(0.97)', transition: 'opacity 0.6s ease, transform 0.6s ease' }}
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="relative">
        <span className="material-icons text-white/30 text-7xl mb-4 block">travel_explore</span>
        <h2 className="text-3xl lg:text-4xl font-extrabold text-white mb-4">
          Ready to start your next adventure?
        </h2>
        <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
          Our travel experts are standing by to help you plan the perfect trip — just the way you like it.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/flights"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-brand-red rounded-xl font-bold hover:bg-gray-50 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
          >
            <span className="material-icons text-xl">flight_takeoff</span>
            Search flights
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/15 backdrop-blur-sm text-white border border-white/30 rounded-xl font-bold hover:bg-white/25 transition-all duration-200"
          >
            <span className="material-icons text-xl">support_agent</span>
            Talk to an expert
          </Link>
        </div>
      </div>
    </div>
  )
}
