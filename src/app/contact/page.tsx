'use client'

import { useState, useEffect, useRef } from 'react'
import { Header } from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

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

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const { ref: heroRef, inView: heroInView } = useInView(0.1)
  const { ref: contentRef, inView: contentInView } = useInView(0.1)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setIsSubmitted(true)
    } catch (error) {
      console.error('Form submission error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const contactMethods = [
    {
      icon: 'phone',
      label: 'Phone',
      value: '+234 800 TRAVEL\n+234 1 234 5678',
    },
    {
      icon: 'email',
      label: 'Email',
      value: 'info@thetravelplace.com\nsupport@thetravelplace.com',
    },
    {
      icon: 'location_on',
      label: 'Address',
      value: '123 Travel Street\nVictoria Island, Lagos\nNigeria',
    },
    {
      icon: 'schedule',
      label: 'Hours',
      value: 'Mon – Fri: 8:00 AM – 6:00 PM\nSat: 9:00 AM – 4:00 PM\nSun: Closed',
    },
  ]

  const socials = [
    { icon: 'facebook', label: 'Facebook', href: '#', color: '#1877f2' },
    { icon: 'instagram', label: 'Instagram', href: '#', color: '#e1306c' },
    { icon: 'twitter', label: 'Twitter / X', href: '#', color: '#1da1f2' },
  ]

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="flex items-center justify-center py-20 px-4">
          <div className="max-w-md w-full text-center">
            <div className="bg-white rounded-2xl p-10 shadow-sm border border-gray-100">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                style={{ backgroundColor: 'rgba(16,185,129,0.1)' }}
              >
                <span className="material-icons text-3xl" style={{ color: '#10b981' }}>check_circle</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">We got it!</h2>
              <p className="text-gray-500 mb-8 leading-relaxed">
                Expect a reply within a few hours. In the meantime, feel free to browse our latest deals.
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="px-8 py-3 rounded-xl font-bold text-white transition-all duration-200"
                style={{ backgroundColor: '#e21e24' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#c41e24')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#e21e24')}
              >
                Send another message
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

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

          <div
            ref={heroRef}
            className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center"
            style={{
              opacity: heroInView ? 1 : 0,
              transform: heroInView ? 'translateY(0)' : 'translateY(30px)',
              transition: 'opacity 0.7s ease, transform 0.7s ease',
            }}
          >
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-6 border"
              style={{ backgroundColor: 'rgba(226,30,36,0.1)', borderColor: 'rgba(226,30,36,0.3)' }}
            >
              <span className="material-icons text-sm" style={{ color: '#e21e24' }}>chat</span>
              <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.8)' }}>Get in touch</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
              Let's talk <span style={{ color: '#e21e24' }}>travel</span>
            </h1>
            <p className="text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Got a question, a booking issue, or just want to say hi? We're always happy to hear from you.
            </p>
          </div>

          {/* Wave */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full block">
              <path d="M0 48L1440 48L1440 16C1200 48 960 0 720 16C480 32 240 0 0 16L0 48Z" fill="#F9FAFB" />
            </svg>
          </div>
        </section>

        {/* ── Content ── */}
        <div
          ref={contentRef}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* ── Sidebar ── */}
            <div
              className="lg:col-span-1 space-y-4"
              style={{
                opacity: contentInView ? 1 : 0,
                transform: contentInView ? 'translateX(0)' : 'translateX(-30px)',
                transition: 'opacity 0.7s ease, transform 0.7s ease',
              }}
            >
              <h2 className="text-2xl font-extrabold text-gray-900 mb-6">Get in touch</h2>

              {/* Contact method cards */}
              {contactMethods.map((method, i) => (
                <div
                  key={method.label}
                  className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-start gap-4"
                  style={{
                    opacity: contentInView ? 1 : 0,
                    transform: contentInView ? 'translateY(0)' : 'translateY(20px)',
                    transition: `opacity 0.5s ease ${i * 0.1}s, transform 0.5s ease ${i * 0.1}s`,
                  }}
                >
                  <div
                    className="flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: '#e21e24' }}
                  >
                    <span className="material-icons text-xl text-white">{method.icon}</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 mb-1">{method.label}</p>
                    <p className="text-gray-500 text-sm whitespace-pre-line leading-relaxed">{method.value}</p>
                  </div>
                </div>
              ))}

              {/* Social row */}
              <div
                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
                style={{
                  opacity: contentInView ? 1 : 0,
                  transform: contentInView ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'opacity 0.5s ease 0.45s, transform 0.5s ease 0.45s',
                }}
              >
                <p className="font-bold text-gray-900 mb-4">We're also on</p>
                <div className="flex gap-3">
                  {socials.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      aria-label={s.label}
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white transition-opacity duration-200 hover:opacity-80"
                      style={{ backgroundColor: s.color }}
                    >
                      <span className="material-icons text-xl">{s.icon}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Form ── */}
            <div
              className="lg:col-span-2"
              style={{
                opacity: contentInView ? 1 : 0,
                transform: contentInView ? 'translateX(0)' : 'translateX(30px)',
                transition: 'opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s',
              }}
            >
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-extrabold text-gray-900 mb-8">Drop us a line</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Name <span style={{ color: '#e21e24' }}>*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200"
                        style={{ '--tw-ring-color': '#e21e24' } as React.CSSProperties}
                        placeholder="Your full name"
                        value={formData.name}
                        onChange={handleChange}
                        onFocus={e => (e.currentTarget.style.borderColor = '#e21e24')}
                        onBlur={e => (e.currentTarget.style.borderColor = '#e5e7eb')}
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address <span style={{ color: '#e21e24' }}>*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none transition-all duration-200"
                        placeholder="your.email@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        onFocus={e => (e.currentTarget.style.borderColor = '#e21e24')}
                        onBlur={e => (e.currentTarget.style.borderColor = '#e5e7eb')}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none transition-all duration-200"
                        placeholder="+234 800 000 0000"
                        value={formData.phone}
                        onChange={handleChange}
                        onFocus={e => (e.currentTarget.style.borderColor = '#e21e24')}
                        onBlur={e => (e.currentTarget.style.borderColor = '#e5e7eb')}
                      />
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
                        Subject <span style={{ color: '#e21e24' }}>*</span>
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 focus:outline-none transition-all duration-200 bg-white"
                        value={formData.subject}
                        onChange={handleChange}
                        onFocus={e => (e.currentTarget.style.borderColor = '#e21e24')}
                        onBlur={e => (e.currentTarget.style.borderColor = '#e5e7eb')}
                      >
                        <option value="">Select a subject</option>
                        <option value="general">General Inquiry</option>
                        <option value="booking">Booking Support</option>
                        <option value="complaint">Complaint</option>
                        <option value="partnership">Partnership</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                      Message <span style={{ color: '#e21e24' }}>*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={6}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none transition-all duration-200 resize-none"
                      placeholder="Tell us how we can help you..."
                      value={formData.message}
                      onChange={handleChange}
                      onFocus={e => (e.currentTarget.style.borderColor = '#e21e24')}
                      onBlur={e => (e.currentTarget.style.borderColor = '#e5e7eb')}
                    />
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ backgroundColor: '#e21e24' }}
                      onMouseEnter={e => { if (!isLoading) e.currentTarget.style.backgroundColor = '#c41e24' }}
                      onMouseLeave={e => { if (!isLoading) e.currentTarget.style.backgroundColor = '#e21e24' }}
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                          Sending...
                        </>
                      ) : (
                        <>
                          Send it →
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
