import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Travel services route validation
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Redirect /insurance to /travel-insurance for convenience
  if (pathname === '/insurance') {
    return NextResponse.redirect(new URL('/travel-insurance', request.url));
  }

  // Handle hotel booking flow routes
  if (pathname.startsWith('/hotels/')) {
    const segments = pathname.split('/');
    
    // Pattern: /hotels/[id]/guests, /hotels/[id]/payment, /hotels/[id]/success
    if (segments.length >= 4) {
      const hotelId = segments[2];
      const page = segments[3];
      
      // Validate hotel ID format (should be alphanumeric)
      if (!hotelId || !/^[a-zA-Z0-9-_]+$/.test(hotelId)) {
        return NextResponse.redirect(new URL('/hotels', request.url));
      }
      
      // Validate booking flow pages
      const validPages = ['guests', 'payment', 'success'];
      if (validPages.includes(page)) {
        // Check if required booking data exists for protected pages
        if (page === 'payment' || page === 'success') {
          // In a real app, you'd check session/cookies for booking data
          // For now, we'll allow access but the pages will handle missing data
        }
      }
    }
  }

  // Handle car hire booking flow routes
  if (pathname.startsWith('/car-hire/')) {
    const segments = pathname.split('/');
    
    // Pattern: /car-hire/[id]/contact, /car-hire/[id]/payment, /car-hire/[id]/success
    if (segments.length >= 4) {
      const carId = segments[2];
      const page = segments[3];
      
      // Validate car ID format (should be alphanumeric)
      if (!carId || !/^[a-zA-Z0-9-_]+$/.test(carId)) {
        return NextResponse.redirect(new URL('/car-hire', request.url));
      }
      
      // Validate booking flow pages
      const validPages = ['contact', 'payment', 'success'];
      if (validPages.includes(page)) {
        // Check if required booking data exists for protected pages
        if (page === 'payment' || page === 'success') {
          // Pages will handle missing data validation
        }
      }
    }
  }

  // Handle visa application flow routes
  if (pathname.startsWith('/visa-application/')) {
    const segments = pathname.split('/');
    
    // Pattern: /visa-application/personal, /visa-application/passport, etc.
    if (segments.length >= 3) {
      const page = segments[2];
      
      // Validate visa application flow pages
      const validPages = ['personal', 'passport', 'appointment', 'review', 'payment', 'success'];
      if (validPages.includes(page)) {
        // Check if required application data exists for protected pages
        if (['payment', 'success'].includes(page)) {
          // Pages will handle missing data validation
        }
      }
    }
  }

  // Handle travel insurance flow routes
  if (pathname.startsWith('/travel-insurance/')) {
    const segments = pathname.split('/');
    
    // Pattern: /travel-insurance/details, /travel-insurance/travelers, etc.
    if (segments.length >= 3) {
      const page = segments[2];
      
      // Validate travel insurance flow pages
      const validPages = ['details', 'travelers', 'review', 'payment', 'success'];
      if (validPages.includes(page)) {
        // Check if required insurance data exists for protected pages
        if (['payment', 'success'].includes(page)) {
          // Pages will handle missing data validation
        }
      }
    }
  }

  return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    '/hotels/:path*',
    '/car-hire/:path*',
    '/visa-application/:path*',
    '/travel-insurance/:path*',
  ],
};