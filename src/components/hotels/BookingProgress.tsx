'use client';

import { usePathname } from 'next/navigation';
import { RouteValidator, BOOKING_STEPS, BookingStep, BookingFlowNavigator } from '@/lib/routing';

interface BookingProgressProps {
  currentStep?: BookingStep;
  className?: string;
}

// Service-specific step labels
const HOTEL_STEP_LABELS = {
  [BOOKING_STEPS.SEARCH]: 'Search',
  [BOOKING_STEPS.DETAILS]: 'Hotel Details',
  [BOOKING_STEPS.GUESTS]: 'Guest Info',
  [BOOKING_STEPS.PAYMENT]: 'Payment',
  [BOOKING_STEPS.SUCCESS]: 'Confirmation',
};

const CAR_HIRE_STEP_LABELS = {
  [BOOKING_STEPS.CAR_SEARCH]: 'Search',
  [BOOKING_STEPS.CAR_DETAILS]: 'Car Details',
  [BOOKING_STEPS.CONTACT]: 'Contact Info',
  [BOOKING_STEPS.PAYMENT]: 'Payment',
  [BOOKING_STEPS.SUCCESS]: 'Confirmation',
};

const VISA_STEP_LABELS = {
  [BOOKING_STEPS.VISA_START]: 'Start',
  [BOOKING_STEPS.PERSONAL]: 'Personal',
  [BOOKING_STEPS.PASSPORT]: 'Passport',
  [BOOKING_STEPS.APPOINTMENT]: 'Appointment',
  [BOOKING_STEPS.REVIEW]: 'Review',
  [BOOKING_STEPS.PAYMENT]: 'Payment',
  [BOOKING_STEPS.SUCCESS]: 'Confirmation',
};

const INSURANCE_STEP_LABELS = {
  [BOOKING_STEPS.INSURANCE_PLANS]: 'Plans',
  [BOOKING_STEPS.TRIP_DETAILS]: 'Trip Details',
  [BOOKING_STEPS.TRAVELERS]: 'Travelers',
  [BOOKING_STEPS.REVIEW]: 'Review',
  [BOOKING_STEPS.PAYMENT]: 'Payment',
  [BOOKING_STEPS.SUCCESS]: 'Confirmation',
};

/**
 * Booking progress indicator component
 */
export default function BookingProgress({ currentStep, className = '' }: BookingProgressProps) {
  const pathname = usePathname();
  const serviceType = RouteValidator.getServiceType(pathname);
  
  // Get service-specific configuration
  let stepOrder: readonly BookingStep[];
  let stepLabels: Record<string, string>;
  let defaultStep: BookingStep;

  switch (serviceType) {
    case 'car-hire':
      stepOrder = BookingFlowNavigator.getStepOrder('car-hire');
      stepLabels = CAR_HIRE_STEP_LABELS;
      defaultStep = BOOKING_STEPS.CAR_SEARCH;
      break;
    case 'visa-application':
      stepOrder = BookingFlowNavigator.getStepOrder('visa-application');
      stepLabels = VISA_STEP_LABELS;
      defaultStep = BOOKING_STEPS.VISA_START;
      break;
    case 'travel-insurance':
      stepOrder = BookingFlowNavigator.getStepOrder('travel-insurance');
      stepLabels = INSURANCE_STEP_LABELS;
      defaultStep = BOOKING_STEPS.INSURANCE_PLANS;
      break;
    case 'hotels':
    default:
      stepOrder = BookingFlowNavigator.getStepOrder('hotels');
      stepLabels = HOTEL_STEP_LABELS;
      defaultStep = BOOKING_STEPS.SEARCH;
      break;
  }
  
  // Determine current step from route if not provided
  const step = currentStep || (RouteValidator.getBookingStep(pathname) as BookingStep) || defaultStep;
  const currentStepIndex = stepOrder.indexOf(step);

  return (
    <div className={`booking-progress ${className}`}>
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        {stepOrder.map((stepKey, index) => {
          const isActive = index === currentStepIndex;
          const isCompleted = index < currentStepIndex;
          const isAccessible = index <= currentStepIndex;

          return (
            <div key={stepKey} className="flex items-center flex-1">
              {/* Step Circle */}
              <div className="flex items-center">
                <div
                  className={`
                    flex items-center justify-center w-8 h-8 rounded-full border-2 text-sm font-medium
                    ${isCompleted 
                      ? 'bg-green-600 border-green-600 text-white' 
                      : isActive 
                        ? 'bg-blue-600 border-blue-600 text-white' 
                        : isAccessible
                          ? 'bg-white border-gray-300 text-gray-500'
                          : 'bg-gray-100 border-gray-200 text-gray-400'
                    }
                  `}
                >
                  {isCompleted ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>

                {/* Step Label */}
                <div className="ml-3 hidden sm:block">
                  <p
                    className={`
                      text-sm font-medium
                      ${isActive 
                        ? 'text-blue-600' 
                        : isCompleted 
                          ? 'text-green-600' 
                          : isAccessible
                            ? 'text-gray-500'
                            : 'text-gray-400'
                      }
                    `}
                  >
                    {stepLabels[stepKey]}
                  </p>
                </div>
              </div>

              {/* Connector Line */}
              {index < stepOrder.length - 1 && (
                <div className="flex-1 mx-4">
                  <div
                    className={`
                      h-0.5 w-full
                      ${isCompleted 
                        ? 'bg-green-600' 
                        : 'bg-gray-200'
                      }
                    `}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile Step Labels */}
      <div className="mt-4 text-center sm:hidden">
        <p className="text-sm font-medium text-gray-900">
          {stepLabels[step]}
        </p>
        <p className="text-xs text-gray-500">
          Step {currentStepIndex + 1} of {stepOrder.length}
        </p>
      </div>
    </div>
  );
}