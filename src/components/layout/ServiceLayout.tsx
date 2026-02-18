import Head from 'next/head'
import { Header } from './Header'
import ServiceFooter from './ServiceFooter'
import { SiteLayoutProps } from '@/types'

interface ServiceLayoutProps extends SiteLayoutProps {
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
  // Service-specific props
  serviceName?: string;
}

export default function ServiceLayout({
  children,
  showHeader = true,
  showFooter = true,
  className = '',
  title,
  description,
  keywords,
  ogImage,
  canonicalUrl,
  noIndex = false,
  structuredData,
  pageType = 'service',
  breadcrumbs,
  serviceName,
}: ServiceLayoutProps) {
  // Generate page-specific meta tags
  const pageTitle = title ? `${title} | The Travel Place` : 'The Travel Place - Travel Services'
  const pageDescription = description || 'Professional travel services including flight booking, hotel reservations, car rental, and visa applications with The Travel Place'
  const pageKeywords = keywords?.join(', ') || 'travel services, flights, hotels, car rental, visa applications, travel booking'
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
      <Head>
        {/* Primary meta tags */}
        <title>{pageTitle}</title>
        <meta name="title" content={pageTitle} />
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={pageKeywords} />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content={pageType} />
        <meta property="og:url" content={currentUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={pageOgImage} />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={currentUrl} />
        <meta property="twitter:title" content={pageTitle} />
        <meta property="twitter:description" content={pageDescription} />
        <meta property="twitter:image" content={pageOgImage} />

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
        className={`min-h-screen flex flex-col bg-gray-50 ${className}`}
        itemScope
        itemType="https://schema.org/WebPage"
      >
        {/* White Header */}
        {showHeader && (
          <header role="banner" className="bg-white shadow-sm border-b border-gray-100">
            <div className="service-header-override">
              <Header />
            </div>
          </header>
        )}

        {/* Breadcrumb navigation */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav
            role="navigation"
            aria-label="Breadcrumb"
            className="bg-white border-b border-gray-200"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <ol className="flex items-center space-x-2 py-4 text-sm">
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
          className="flex-1 py-12"
          itemProp="mainContentOfPage"
          tabIndex={-1}
        >
          {children}
        </main>

        {/* White Footer without Newsletter */}
        {showFooter && (
          <ServiceFooter />
        )}
      </div>
    </>
  )
}