'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Header, Footer } from '@/components/layout';
import { ServiceLayoutProps } from '@/types/hotels';
import BookingProgress from './BookingProgress';
import { RouteValidator } from '@/lib/routing';

// Breadcrumb navigation component
function BreadcrumbNavigation({ breadcrumbs }: { breadcrumbs: Array<{ name: string; href: string }> }) {
  return (
    <nav className="bg-gray-50 border-b border-gray-200" aria-label="Breadcrumb">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-2 py-4 text-sm">
          <Link 
            href="/" 
            className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
          >
            Home
          </Link>
          {breadcrumbs.map((crumb, index) => (
            <div key={index} className="flex items-center space-x-2">
              <svg 
                className="w-4 h-4 text-gray-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              {index === breadcrumbs.length - 1 ? (
                <span className="text-gray-900 font-medium" aria-current="page">
                  {crumb.name}
                </span>
              ) : (
                <Link 
                  href={crumb.href}
                  className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                >
                  {crumb.name}
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
}

export default function ServiceLayout({ children, title, breadcrumbs }: ServiceLayoutProps) {
  const pathname = usePathname();
  
  // Check if we're in a hotel booking flow
  const isBookingFlow = RouteValidator.isHotelBookingRoute(pathname) || pathname.startsWith('/hotels/');
  
  // Add service header override class to body for header styling
  useEffect(() => {
    const overrideElement = document.createElement('div');
    overrideElement.className = 'service-header-override';
    overrideElement.style.display = 'none';
    document.body.appendChild(overrideElement);

    return () => {
      const existingElement = document.querySelector('.service-header-override');
      if (existingElement) {
        existingElement.remove();
      }
    };
  }, []);

  return (
    <div className="service-layout min-h-screen flex flex-col">
      {/* Header */}
      <Header />
      
      {/* Breadcrumb Navigation */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <BreadcrumbNavigation breadcrumbs={breadcrumbs} />
      )}
      
      {/* Booking Progress - Show only in booking flow */}
      {isBookingFlow && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <BookingProgress />
          </div>
        </div>
      )}
      
      {/* Page Title */}
      {title && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
              {title}
            </h1>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <main 
        id="main-content" 
        className="flex-1 bg-gray-50"
        role="main"
      >
        {children}
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}