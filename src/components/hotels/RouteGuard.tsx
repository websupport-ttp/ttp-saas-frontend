'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { RouteValidator } from '@/lib/routing';
import { SAMPLE_HOTELS } from '@/lib/hotels';
import { BookingStateManager } from '@/lib/bookingState';
import { MOCK_CAR_RENTALS } from '@/lib/car-hire-utils';

interface RouteGuardProps {
  children: React.ReactNode;
  requiresBookingData?: boolean;
  requiresValidResource?: boolean;
}

/**
 * Component to guard travel service booking flow routes
 */
export default function RouteGuard({ 
  children, 
  requiresBookingData = false,
  requiresValidResource = true 
}: RouteGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isValidating, setIsValidating] = useState(true);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const validateRoute = async () => {
      setIsValidating(true);

      try {
        const serviceType = RouteValidator.getServiceType(pathname);
        if (!serviceType) {
          setIsValid(true);
          setIsValidating(false);
          return;
        }

        // Validate resource ID if required (for services that use resource IDs)
        if (requiresValidResource) {
          const resourceId = RouteValidator.getResourceIdFromRoute(pathname);
          
          if (resourceId) {
            if (!RouteValidator.isValidId(resourceId)) {
              router.replace(`/${serviceType}`);
              return;
            }

            // Check if resource exists based on service type
            let resourceExists = false;
            switch (serviceType) {
              case 'hotels':
                resourceExists = SAMPLE_HOTELS.some(hotel => hotel.id === resourceId);
                break;
              case 'car-hire':
                resourceExists = MOCK_CAR_RENTALS.some(car => car.id === resourceId);
                break;
              case 'visa-application':
              case 'travel-insurance':
                // These services don't use resource IDs, so always valid
                resourceExists = true;
                break;
            }

            if (!resourceExists) {
              router.replace(`/${serviceType}`);
              return;
            }
          }
        }

        // Validate booking data if required
        if (requiresBookingData) {
          const currentStep = RouteValidator.getBookingStep(pathname);
          const hasRequiredData = currentStep ? 
            BookingStateManager.hasRequiredDataForStep(currentStep, serviceType) : 
            false;
          
          if (!hasRequiredData) {
            const resourceId = RouteValidator.getResourceIdFromRoute(pathname);
            if (resourceId && (serviceType === 'hotels' || serviceType === 'car-hire')) {
              router.replace(`/${serviceType}/${resourceId}`);
            } else {
              router.replace(`/${serviceType}`);
            }
            return;
          }
        }

        setIsValid(true);
      } catch (error) {
        console.error('Route validation error:', error);
        const serviceType = RouteValidator.getServiceType(pathname) || 'hotels';
        router.replace(`/${serviceType}`);
      } finally {
        setIsValidating(false);
      }
    };

    validateRoute();
  }, [pathname, requiresBookingData, requiresValidResource, router]);

  // Show loading state while validating
  if (isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Validating route...</p>
        </div>
      </div>
    );
  }

  // Show children if route is valid
  if (isValid) {
    return <>{children}</>;
  }

  // Return null if route is invalid (redirect will happen)
  return null;
}

/**
 * Check if booking data exists in session storage
 */
function checkBookingData(): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    const bookingData = sessionStorage.getItem('hotelBookingData');
    if (!bookingData) return false;

    const parsed = JSON.parse(bookingData);
    return parsed && parsed.hotel && parsed.dates && parsed.guests;
  } catch (error) {
    console.error('Error checking booking data:', error);
    return false;
  }
}