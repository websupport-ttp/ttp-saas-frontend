'use client';

import Link from 'next/link';

const sitemapLinks = [
  { category: 'Main', links: [
    { label: 'Home', href: '/' },
    { label: 'About Us', href: '/about' },
    { label: 'How It Works', href: '/how-it-works' },
    { label: 'Contact Us', href: '/contact' },
  ]},
  { category: 'Services', links: [
    { label: 'Flights', href: '/flights' },
    { label: 'Hotels', href: '/hotels' },
    { label: 'Car Hire', href: '/car-hire' },
    { label: 'Visa Applications', href: '/visa-applications' },
    { label: 'Travel Insurance', href: '/insurance' },
  ]},
  { category: 'Account', links: [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'My Bookings', href: '/bookings' },
    { label: 'Manage Booking', href: '/manage-booking' },
  ]},
  { category: 'Company', links: [
    { label: 'Blog', href: '/blog' },
    { label: 'Careers', href: '/careers' },
    { label: 'Partnerships', href: '/partnerships' },
    { label: 'Press', href: '/press' },
  ]},
  { category: 'Support', links: [
    { label: 'Help Center', href: '/help' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Group Travel', href: '/group-travel' },
  ]},
  { category: 'Legal', links: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms & Conditions', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
    { label: 'Safety & Security', href: '/safety' },
    { label: 'Accessibility', href: '/accessibility' },
  ]},
  { category: 'Partners', links: [
    { label: 'Become a Vendor', href: '/vendor-agent-signup' },
    { label: 'Become an Agent', href: '/vendor-agent-signup' },
  ]},
];

export default function SitemapPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sitemap</h1>
          <p className="text-gray-600">Browse all pages on The Travel Place website.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sitemapLinks.map((section) => (
            <div key={section.category} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">{section.category}</h2>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-brand-red hover:text-red-700 transition-colors font-medium"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-block px-6 py-2 bg-brand-red text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
