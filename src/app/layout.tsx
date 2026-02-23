import type { Metadata, Viewport } from 'next'
import { ReactNode } from 'react'
import './globals.css'
import BrowserCompatibilityInit from '@/components/BrowserCompatibilityInit'
import { Providers } from '@/components/providers'

// Site configuration
const siteConfig = {
  name: 'The Travel Place',
  description: 'From International and local flight booking to visa applications, hotel bookings, travel insurance, and local car rentals — The Travel Place brings everything you need to plan your trip together in one seamless, easy-to-use platform',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://travelplace.com',
  ogImage: '/images/og-image.jpg',
  creator: 'The Travel Place',
  keywords: [
    'travel',
    'flights',
    'hotels',
    'car rental',
    'visa applications',
    'travel insurance',
    'flight booking',
    'hotel booking',
    'travel planning',
    'vacation packages',
    'business travel',
    'international travel',
    'domestic travel',
    'travel deals',
    'travel agency'
  ],
}

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} - Travel Made Effortless`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [
    {
      name: siteConfig.creator,
      url: siteConfig.url,
    },
  ],
  creator: siteConfig.creator,
  publisher: siteConfig.creator,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} - Travel Made Effortless`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: '@travelplace',
    site: '@travelplace',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/images/logo-icon.svg', type: 'image/svg+xml' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'mask-icon', url: '/safari-pinned-tab.svg', color: '#ef4444' },
    ],
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    yandex: process.env.YANDEX_VERIFICATION,
    yahoo: process.env.YAHOO_VERIFICATION,
  },
  alternates: {
    canonical: siteConfig.url,
  },
  category: 'travel',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#1f2937' },
  ],
}

// Structured data for the organization
const organizationStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'TravelAgency',
  name: siteConfig.name,
  description: siteConfig.description,
  url: siteConfig.url,
  logo: `${siteConfig.url}/images/logo.png`,
  sameAs: [
    'https://facebook.com/travelplace',
    'https://twitter.com/travelplace',
    'https://instagram.com/travelplace',
    'https://linkedin.com/company/travelplace',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+1-555-123-4567',
    contactType: 'customer service',
    availableLanguage: ['English'],
    areaServed: 'Worldwide',
  },
  address: {
    '@type': 'PostalAddress',
    streetAddress: '123 Travel Street',
    addressLocality: 'New York',
    addressRegion: 'NY',
    postalCode: '10001',
    addressCountry: 'US',
  },
  offers: {
    '@type': 'AggregateOffer',
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock',
    category: 'Travel Services',
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Travel Services',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Flight Booking',
          description: 'International and domestic flight reservations',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Hotel Booking',
          description: 'Accommodation reservations worldwide',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Car Rental',
          description: 'Vehicle rental services',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Visa Applications',
          description: 'Travel visa processing and applications',
        },
      },
    ],
  },
}

// Website structured data
const websiteStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: siteConfig.name,
  url: siteConfig.url,
  description: siteConfig.description,
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${siteConfig.url}/search?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Material Icons */}
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
        
        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="//images.unsplash.com" />
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationStructuredData),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteStructuredData),
          }}
        />
        
        {/* Additional meta tags */}
        <meta name="application-name" content={siteConfig.name} />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content={siteConfig.name} />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#ef4444" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className="font-nunito text-gray-900 antialiased bg-white">
        {/* Skip to main content link for accessibility */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-brand-red text-white px-6 py-3 rounded-lg font-medium z-[9999] transition-all duration-200 focus:shadow-lg"
        >
          Skip to main content
        </a>
        
        {/* Screen reader announcements */}
        <div 
          id="announcement-region" 
          className="sr-only" 
          aria-live="polite" 
          aria-atomic="true"
        ></div>
        
        {/* Browser compatibility initialization */}
        <BrowserCompatibilityInit />
        
        {/* Main application content */}
        <div id="root" className="min-h-screen">
          <Providers>
            {children}
          </Providers>
        </div>
        
        {/* Design consistency checker - development only */}
        {process.env.NODE_ENV === 'development' && (
          <div id="design-checker">
            {/* This will be dynamically imported to avoid affecting production bundle */}
          </div>
        )}
        
        {/* Back to top button (will be added via JavaScript if needed) */}
        <div id="back-to-top-anchor" className="sr-only">Back to top</div>
      </body>
    </html>
  )
}