'use client'

import Head from 'next/head'
import { usePathname } from 'next/navigation'
import { Header } from './Header'
import { HomeHeader } from './HomeHeader'
import Footer from './Footer'
import { SiteLayoutProps } from '@/types'

interface ExtendedSiteLayoutProps extends SiteLayoutProps {
  headerClassName?: string;
  footerClassName?: string;
  mainClassName?: string;
  // SEO and meta tag props
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
  structuredData?: object;
  // Page-specific props
  pageType?: 'website' | 'article' | 'product' | 'service';
  breadcrumbs?: Array<{ name: string; href: string }>;
}

export default function SiteLayout({
  children,
  showHeader = true,
  showFooter = true,
  className = '',
  headerClassName = '',
  footerClassName = '',
  mainClassName = '',
  title,
  description,
  keywords,
  ogImage,
  canonicalUrl,
  noIndex = false,
  structuredData,
  pageType = 'website',
  breadcrumbs,
}: ExtendedSiteLayoutProps) {
  const pathname = usePathname()
  const isHomepage = pathname === '/'
  
  // Generate page-specific meta tags
  const pageTitle = title ? `${title} | The Travel Place` : 'The Travel Place - Travel Made Effortless'
  const pageDescription = description || 'From International and local flight booking to visa applications, hotel bookings, travel insurance, and local car rentals — The Travel Place brings everything you need to plan your trip together in one seamless, easy-to-use platform'
  const pageKeywords = keywords?.join(', ') || 'travel, flights, hotels, car rental, visa applications, travel insurance'
  const pageOgImage = ogImage || '/images/og-image.jpg'
  const currentUrl = canonicalUrl || (typeof window !== 'undefined' ? window.location.href : '')

  // Generate breadcrumb structured data
  const breadcrumbStructuredData = breadcrumbs ? {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.href,
    })),
  } : null

  return (
    <>
      {/* Page-specific meta tags */}
      <Head>
        {title && <title>{pageTitle}</title>}
        {description && <meta name="description" content={pageDescription} />}
        {keywords && <meta name="keywords" content={pageKeywords} />}

        {/* Open Graph meta tags */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={pageOgImage} />
        <meta property="og:type" content={pageType} />
        {currentUrl && <meta property="og:url" content={currentUrl} />}

        {/* Twitter Card meta tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={pageOgImage} />

        {/* Canonical URL */}
        {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

        {/* Robots meta tag */}
        {noIndex && <meta name="robots" content="noindex, nofollow" />}

        {/* Page-specific structured data */}
        {structuredData && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(structuredData),
            }}
          />
        )}

        {/* Breadcrumb structured data */}
        {breadcrumbStructuredData && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(breadcrumbStructuredData),
            }}
          />
        )}
      </Head>

      {/* Main site structure with semantic HTML */}
      <div
        className={`min-h-screen flex flex-col ${className}`}
        itemScope
        itemType="https://schema.org/WebPage"
      >
        {/* Site header */}
        {showHeader && (
          isHomepage ? (
            <HomeHeader className={headerClassName} />
          ) : (
            <header role="banner" className={headerClassName}>
              <Header />
            </header>
          )
        )}

        {/* Breadcrumb navigation */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav
            role="navigation"
            aria-label="Breadcrumb"
            className="bg-gray-50 border-b border-gray-200"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <ol className="flex items-center space-x-2 py-3 text-sm">
                {breadcrumbs.map((crumb, index) => (
                  <li key={crumb.href} className="flex items-center">
                    {index > 0 && (
                      <svg
                        className="w-4 h-4 text-gray-400 mx-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                    {index === breadcrumbs.length - 1 ? (
                      <span
                        className="text-gray-500 font-medium"
                        aria-current="page"
                      >
                        {crumb.name}
                      </span>
                    ) : (
                      <a
                        href={crumb.href}
                        className="text-brand-red hover:text-brand-red-dark transition-colors duration-200"
                      >
                        {crumb.name}
                      </a>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          </nav>
        )}

        {/* Main content area */}
        <main
          id="main-content"
          role="main"
          className={`flex-1 ${mainClassName}`}
          itemProp="mainContentOfPage"
          tabIndex={-1}
        >
          {/* Content wrapper for better semantic structure */}
          <div className="min-h-full">
            {children}
          </div>
        </main>

        {/* Site footer */}
        {showFooter && (
          <footer
            role="contentinfo"
            className={footerClassName}
            itemScope
            itemType="https://schema.org/WPFooter"
          >
            <Footer />
          </footer>
        )}
      </div>
    </>
  )
}