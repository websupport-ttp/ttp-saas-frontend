'use client'

import { useState, useEffect, useRef } from 'react'
import { Header } from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

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

const contactMethods = [
  { icon: 'phone', label: 'Phone', value: '+234 800 TRAVEL\n+234 1 234 5678', accent: '#e21e24' },
  { icon: 'email', label: 'Email', value: 'info@thetravelplace.com\nsupport@thetravelplace.com', accent: '#0ea5e9' },
  { icon: 'location_on', label: 'Address', value: '123 Travel Street\nVictoria Island, Lagos', accent: '#10b981' },
  { icon: 'schedule', label: 'Hours', value: 'Mon – Fri: 8:00 AM – 6:00 PM\nSat: 9:00 AM – 4:00 PM\nSun: Closed', accent: '#8b5cf6' },
]

const socials = [
  { label: 'Facebook', href: '#', svg: <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /> },
  { label: 'Instagram', href: '#', svg: <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /> },
  { label: 'Twitter / X', href: '#', svg: <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /> },
  { label: 'LinkedIn', href: '#', svg: <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /> },
]

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const { ref: heroRef, inView: heroInView } = useInView(0.1)
  const { ref: sidebarRef, inView: sidebarInView } = useInView(0.1)
  const { ref: formRef, inView: formInView } = useInView(0.1)

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
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const inputClass = "w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none transition-all duration-200 bg-white text-sm"

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="flex items-center justify-center py-20 px-4">
          <div className="max-w-md w-full text-center">
            <div className="bg-white rounded-2xl p-10 shadow-sm border border-gray-100">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5" style={{ backgroundColor: 'rgba(16,185,129,0.1)' }}>
                <span className="material-icons text-3xl" style={{ color: '#10b981' }}>check_circle</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">We got it!</h2>
              <p className="text-gray-500 mb-8 leading-relaxed">Expect a reply within a few hours. In the meantime, feel free to browse our latest deals.</p>
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
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-10" style={{ backgroundColor: '#e21e24', filter: 'blur(70px)' }} />
            <div className="absolute bottom-0 -left-20 w-72 h-72 rounded-full opacity-10" style={{ backgroundColor: '#e21e24', filter: 'blur(70px)' }} />
          </div>
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

          <div ref={heroRef} className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center"
            style={{ opacity: heroInView ? 1 : 0, transform: heroInView ? 'translateY(0)' : 'translateY(30px)', transition: 'opacity 0.7s ease, transform 0.7s ease' }}>
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-6 border" style={{ backgroundColor: 'rgba(226,30,36,0.1)', borderColor: 'rgba(226,30,36,0.3)' }}>
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

          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full block">
              <path d="M0 48L1440 48L1440 16C1200 48 960 0 720 16C480 32 240 0 0 16L0 48Z" fill="#F9FAFB" />
            </svg>
          </div>
        </section>

        {/* ── Content ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

            {/* ── Sidebar ── */}
            <div ref={sidebarRef} className="lg:col-span-2 flex flex-col gap-4"
              style={{ opacity: sidebarInView ? 1 : 0, transform: sidebarInView ? 'translateX(0)' : 'translateX(-30px)', transition: 'opacity 0.7s ease, transform 0.7s ease' }}>

              <div className="rounded-3xl overflow-hidden" style={{ backgroundColor: '#141b34' }}>
                <div className="p-8">
                  <h2 className="text-2xl font-extrabold text-white mb-2">Contact information</h2>
                  <p className="text-sm mb-8" style={{ color: 'rgba(255,255,255,0.5)' }}>Fill out the form and we'll be in touch shortly.</p>

                  <div className="space-y-6">
                    {contactMethods.map((m, i) => (
                      <div key={m.label}
                        className="flex items-start gap-4"
                        style={{ opacity: sidebarInView ? 1 : 0, transform: sidebarInView ? 'translateX(0)' : 'translateX(-20px)', transition: `opacity 0.5s ease ${0.1 + i * 0.1}s, transform 0.5s ease ${0.1 + i * 0.1}s` }}>
                        <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${m.accent}25` }}>
                          <span className="material-icons text-xl" style={{ color: m.accent }}>{m.icon}</span>
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>{m.label}</p>
                          <p className="text-white text-sm whitespace-pre-line leading-relaxed">{m.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Divider */}
                  <div className="my-8 h-px" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }} />

                  {/* Socials */}
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: 'rgba(255,255,255,0.4)' }}>Find us on</p>
                    <div className="flex gap-3">
                      {socials.map(s => (
                        <a key={s.label} href={s.href} aria-label={s.label}
                          className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200"
                          style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
                          onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#e21e24' }}
                          onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)' }}>
                          <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24" aria-hidden="true">
                            {s.svg}
                          </svg>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Decorative bottom strip */}
                <div className="h-2 w-full" style={{ background: 'linear-gradient(90deg, #e21e24, #8b5cf6, #0ea5e9, #10b981)' }} />
              </div>
            </div>

            {/* ── Form ── */}
            <div ref={formRef} className="lg:col-span-3"
              style={{ opacity: formInView ? 1 : 0, transform: formInView ? 'translateX(0)' : 'translateX(30px)', transition: 'opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s' }}>

              <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-sm border border-gray-100 h-full">
                <div className="mb-8">
                  <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Drop us a line</h2>
                  <p className="text-gray-500 text-sm">We typically reply within a few hours on business days.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="name" className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                        Full Name <span style={{ color: '#e21e24' }}>*</span>
                      </label>
                      <input type="text" id="name" name="name" required className={inputClass}
                        placeholder="Your full name" value={formData.name} onChange={handleChange}
                        onFocus={e => (e.currentTarget.style.borderColor = '#e21e24')}
                        onBlur={e => (e.currentTarget.style.borderColor = '#e5e7eb')} />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                        Email <span style={{ color: '#e21e24' }}>*</span>
                      </label>
                      <input type="email" id="email" name="email" required className={inputClass}
                        placeholder="your@email.com" value={formData.email} onChange={handleChange}
                        onFocus={e => (e.currentTarget.style.borderColor = '#e21e24')}
                        onBlur={e => (e.currentTarget.style.borderColor = '#e5e7eb')} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="phone" className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">Phone</label>
                      <input type="tel" id="phone" name="phone" className={inputClass}
                        placeholder="+234 800 000 0000" value={formData.phone} onChange={handleChange}
                        onFocus={e => (e.currentTarget.style.borderColor = '#e21e24')}
                        onBlur={e => (e.currentTarget.style.borderColor = '#e5e7eb')} />
                    </div>
                    <div>
                      <label htmlFor="subject" className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                        Subject <span style={{ color: '#e21e24' }}>*</span>
                      </label>
                      <select id="subject" name="subject" required className={inputClass}
                        value={formData.subject} onChange={handleChange}
                        onFocus={e => (e.currentTarget.style.borderColor = '#e21e24')}
                        onBlur={e => (e.currentTarget.style.borderColor = '#e5e7eb')}>
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
                    <label htmlFor="message" className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                      Message <span style={{ color: '#e21e24' }}>*</span>
                    </label>
                    <textarea id="message" name="message" rows={6} required className={`${inputClass} resize-none`}
                      placeholder="Tell us how we can help you..."
                      value={formData.message} onChange={handleChange}
                      onFocus={e => (e.currentTarget.style.borderColor = '#e21e24')}
                      onBlur={e => (e.currentTarget.style.borderColor = '#e5e7eb')} />
                  </div>

                  <button type="submit" disabled={isLoading}
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: '#e21e24' }}
                    onMouseEnter={e => { if (!isLoading) e.currentTarget.style.backgroundColor = '#c41e24' }}
                    onMouseLeave={e => { if (!isLoading) e.currentTarget.style.backgroundColor = '#e21e24' }}>
                    {isLoading ? (
                      <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />Sending...</>
                    ) : (
                      <><span>Send message</span><span className="material-icons text-base">send</span></>
                    )}
                  </button>
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
