'use client'

import Link from 'next/link'
import Image from 'next/image'

// Enhanced SVG icons for social media
const Facebook = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
)

const Instagram = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
)

const Twitter = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
  </svg>
)

const LinkedIn = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
)

const Mail = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
)

const Phone = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
)

const MapPin = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

// Comprehensive footer data structure
const footerData = {
  company: {
    title: 'Company',
    links: [
      { label: 'About Travel Place', href: '/about' },
      { label: 'How it works', href: '/how-it-works' },
      { label: 'Careers', href: '/careers' },
      { label: 'Press & Media', href: '/press' },
      { label: 'Blog', href: '/blog' },
      { label: 'Partnerships', href: '/partnerships' },
    ]
  },
  services: {
    title: 'Services',
    links: [
      { label: 'Flight Booking', href: '/flights' },
      { label: 'Hotel Booking', href: '/hotels' },
      { label: 'Car Hire', href: '/car-hire' },
      { label: 'Visa Applications', href: '/visa-applications' },
      { label: 'Travel Insurance', href: '/insurance' },
      { label: 'Group Travel', href: '/group-travel' },
    ]
  },
  support: {
    title: 'Support',
    links: [
      { label: 'Help Center', href: '/help' },
      { label: 'Contact Us', href: '/contact' },
      { label: 'Customer Service', href: '/customer-service' },
      { label: 'Travel Guides', href: '/guides' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Booking Management', href: '/manage-booking' },
    ]
  },
  legal: {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Cookie Policy', href: '/cookies' },
      { label: 'Trust & Safety', href: '/safety' },
      { label: 'Accessibility', href: '/accessibility' },
      { label: 'Sitemap', href: '/sitemap' },
    ]
  }
}

const contactInfo = [
  { 
    icon: Phone, 
    label: '+1 (555) 123-4567', 
    href: 'tel:+15551234567',
    description: '24/7 Customer Support'
  },
  { 
    icon: Mail, 
    label: 'info@travelplace.com', 
    href: 'mailto:info@travelplace.com',
    description: 'General Inquiries'
  },
  { 
    icon: MapPin, 
    label: '123 Travel Street, New York, NY 10001', 
    href: 'https://maps.google.com/?q=123+Travel+Street+New+York+NY',
    description: 'Visit Our Office'
  },
]

const socialLinks = [
  { icon: Facebook, href: 'https://facebook.com/travelplace', label: 'Facebook', color: 'hover:text-blue-500' },
  { icon: Instagram, href: 'https://instagram.com/travelplace', label: 'Instagram', color: 'hover:text-pink-500' },
  { icon: Twitter, href: 'https://twitter.com/travelplace', label: 'Twitter', color: 'hover:text-blue-400' },
  { icon: LinkedIn, href: 'https://linkedin.com/company/travelplace', label: 'LinkedIn', color: 'hover:text-blue-600' },
]

interface ServiceFooterProps {
  className?: string;
}

export default function ServiceFooter({ className = '' }: ServiceFooterProps) {
  return (
    <footer className={`bg-white text-gray-900 border-t border-gray-200 ${className}`} role="contentinfo">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-6 group">
              <div className="flex items-center space-x-3">
                <div className="relative w-12 h-12">
                  <Image
                    src="/images/logo-icon.svg"
                    alt="The Travel Place logo"
                    fill
                    sizes="48px"
                    className="object-contain transition-opacity duration-300 group-hover:opacity-80"
                  />
                </div>
                <span className="font-bold text-xl text-gray-900">
                  The Travel Place
                </span>
              </div>
            </Link>
            
            <p className="text-gray-600 mb-6 leading-relaxed">
              Your trusted partner for seamless travel experiences. From flights and hotels to visa applications and car rentals, we make travel planning effortless.
            </p>

            {/* Contact Information */}
            <div className="space-y-4">
              {contactInfo.map(({ icon: Icon, label, href, description }) => (
                <div key={label} className="flex items-start space-x-3">
                  <Icon className="w-5 h-5 text-brand-red mt-0.5 flex-shrink-0" />
                  <div>
                    <Link
                      href={href}
                      className="text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium"
                      {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    >
                      {label}
                    </Link>
                    <p className="text-gray-500 text-sm">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {Object.entries(footerData).map(([key, section]) => (
            <div key={key}>
              <h4 className="font-semibold text-lg text-gray-900 mb-6">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-gray-600 hover:text-gray-900 transition-colors duration-200 text-sm font-medium"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0">
            {/* Social Links */}
            <div className="flex items-center space-x-6">
              <span className="text-gray-500 text-sm font-medium">Follow us:</span>
              <div className="flex space-x-4">
                {socialLinks.map(({ icon: Icon, href, label, color }) => (
                  <Link
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-3 rounded-full bg-gray-100 text-gray-500 transition-all duration-200 hover:bg-gray-200 hover:scale-110 ${color}`}
                    aria-label={`Follow us on ${label}`}
                  >
                    <Icon className="w-5 h-5" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Copyright and Legal */}
            <div className="flex flex-col lg:flex-row items-center space-y-2 lg:space-y-0 lg:space-x-8 text-gray-500 text-sm">
              <div>
                © {new Date().getFullYear()} The Travel Place Limited. All rights reserved.
              </div>
              <div className="flex items-center space-x-4">
                <Link href="/privacy" className="hover:text-gray-900 transition-colors duration-200">
                  Privacy
                </Link>
                <span>•</span>
                <Link href="/terms" className="hover:text-gray-900 transition-colors duration-200">
                  Terms
                </Link>
                <span>•</span>
                <Link href="/cookies" className="hover:text-gray-900 transition-colors duration-200">
                  Cookies
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}