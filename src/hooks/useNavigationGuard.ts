import { useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { BookingStateManager } from "@/lib/bookingState";
import { RouteValidator, BOOKING_STEPS, BookingStep } from "@/lib/routing";

interface NavigationGuardOptions {
	requiresBookingData?: boolean;
	allowedSteps?: BookingStep[];
	redirectTo?: string;
	onNavigationBlocked?: (
		targetStep: BookingStep,
		currentStep: BookingStep
	) => void;
}

/**
 * Hook to guard navigation in any travel service booking flow
 */
export function useNavigationGuard(options: NavigationGuardOptions = {}) {
	const router = useRouter();
	const pathname = usePathname();
	const serviceType = RouteValidator.getServiceType(pathname);
	const {
		requiresBookingData = false,
		allowedSteps = [],
		redirectTo,
		onNavigationBlocked,
	} = options;

	// Set default redirect based on service type
	const defaultRedirectTo = redirectTo || (serviceType ? `/${serviceType}` : "/hotels");

	const currentStep = RouteValidator.getBookingStep(
		pathname
	) as BookingStep | null;

	// Check if navigation to a step is allowed
	const canNavigateToStep = useCallback(
		(targetStep: BookingStep): boolean => {
			if (!serviceType) return false;

			// Always allow navigation to search/start pages
			const searchSteps: BookingStep[] = [BOOKING_STEPS.SEARCH, BOOKING_STEPS.CAR_SEARCH, BOOKING_STEPS.VISA_START, BOOKING_STEPS.INSURANCE_PLANS];
			if (searchSteps.includes(targetStep)) {
				return true;
			}

			// Check if step is in allowed steps
			if (allowedSteps.length > 0 && !allowedSteps.includes(targetStep)) {
				return false;
			}

			// Check if booking data is required and available
			if (requiresBookingData) {
				return BookingStateManager.hasRequiredDataForStep(targetStep, serviceType);
			}

			return true;
		},
		[allowedSteps, requiresBookingData, serviceType]
	);

	// Validate current route
	useEffect(() => {
		if (!currentStep) return;

		const isAllowed = canNavigateToStep(currentStep);

		if (!isAllowed) {
			if (onNavigationBlocked) {
				onNavigationBlocked(currentStep, currentStep);
			}

			// Find the last accessible step
			const accessibleStep = findLastAccessibleStep();
			if (accessibleStep) {
				router.replace(getStepUrl(accessibleStep));
			} else {
				router.replace(defaultRedirectTo);
			}
		}
	}, [
		pathname,
		currentStep,
		canNavigateToStep,
		onNavigationBlocked,
		defaultRedirectTo,
		router,
	]);

	// Find the last step that the user can access
	const findLastAccessibleStep = useCallback((): BookingStep | null => {
		if (!serviceType) return null;

		let stepOrder: BookingStep[];
		switch (serviceType) {
			case 'hotels':
				stepOrder = [BOOKING_STEPS.SEARCH, BOOKING_STEPS.DETAILS, BOOKING_STEPS.GUESTS, BOOKING_STEPS.PAYMENT, BOOKING_STEPS.SUCCESS];
				break;
			case 'car-hire':
				stepOrder = [BOOKING_STEPS.CAR_SEARCH, BOOKING_STEPS.CAR_DETAILS, BOOKING_STEPS.CONTACT, BOOKING_STEPS.PAYMENT, BOOKING_STEPS.SUCCESS];
				break;
			case 'visa-application':
				stepOrder = [BOOKING_STEPS.VISA_START, BOOKING_STEPS.PERSONAL, BOOKING_STEPS.PASSPORT, BOOKING_STEPS.APPOINTMENT, BOOKING_STEPS.REVIEW, BOOKING_STEPS.PAYMENT, BOOKING_STEPS.SUCCESS];
				break;
			case 'travel-insurance':
				stepOrder = [BOOKING_STEPS.INSURANCE_PLANS, BOOKING_STEPS.TRIP_DETAILS, BOOKING_STEPS.TRAVELERS, BOOKING_STEPS.REVIEW, BOOKING_STEPS.PAYMENT, BOOKING_STEPS.SUCCESS];
				break;
			default:
				return null;
		}

		// Go backwards through steps to find the last accessible one
		for (let i = stepOrder.length - 1; i >= 0; i--) {
			if (canNavigateToStep(stepOrder[i])) {
				return stepOrder[i];
			}
		}

		return null;
	}, [canNavigateToStep, serviceType]);

	// Get URL for a specific step
	const getStepUrl = useCallback(
		(step: BookingStep): string => {
			if (!serviceType) return defaultRedirectTo;

			const resourceId = RouteValidator.getResourceIdFromRoute(pathname);

			switch (serviceType) {
				case 'hotels':
					switch (step) {
						case BOOKING_STEPS.SEARCH:
							return "/hotels";
						case BOOKING_STEPS.DETAILS:
							return resourceId ? `/hotels/${resourceId}` : "/hotels";
						case BOOKING_STEPS.GUESTS:
							return resourceId ? `/hotels/${resourceId}/guests` : "/hotels";
						case BOOKING_STEPS.PAYMENT:
							return resourceId ? `/hotels/${resourceId}/payment` : "/hotels";
						case BOOKING_STEPS.SUCCESS:
							return resourceId ? `/hotels/${resourceId}/success` : "/hotels";
						default:
							return "/hotels";
					}
				case 'car-hire':
					switch (step) {
						case BOOKING_STEPS.CAR_SEARCH:
							return "/car-hire";
						case BOOKING_STEPS.CAR_DETAILS:
							return resourceId ? `/car-hire/${resourceId}` : "/car-hire";
						case BOOKING_STEPS.CONTACT:
							return resourceId ? `/car-hire/${resourceId}/contact` : "/car-hire";
						case BOOKING_STEPS.PAYMENT:
							return resourceId ? `/car-hire/${resourceId}/payment` : "/car-hire";
						case BOOKING_STEPS.SUCCESS:
							return resourceId ? `/car-hire/${resourceId}/success` : "/car-hire";
						default:
							return "/car-hire";
					}
				case 'visa-application':
					switch (step) {
						case BOOKING_STEPS.VISA_START:
							return "/visa-application";
						case BOOKING_STEPS.PERSONAL:
							return "/visa-application/personal";
						case BOOKING_STEPS.PASSPORT:
							return "/visa-application/passport";
						case BOOKING_STEPS.APPOINTMENT:
							return "/visa-application/appointment";
						case BOOKING_STEPS.REVIEW:
							return "/visa-application/review";
						case BOOKING_STEPS.PAYMENT:
							return "/visa-application/payment";
						case BOOKING_STEPS.SUCCESS:
							return "/visa-application/success";
						default:
							return "/visa-application";
					}
				case 'travel-insurance':
					switch (step) {
						case BOOKING_STEPS.INSURANCE_PLANS:
							return "/travel-insurance";
						case BOOKING_STEPS.TRIP_DETAILS:
							return "/travel-insurance/details";
						case BOOKING_STEPS.TRAVELERS:
							return "/travel-insurance/travelers";
						case BOOKING_STEPS.REVIEW:
							return "/travel-insurance/review";
						case BOOKING_STEPS.PAYMENT:
							return "/travel-insurance/payment";
						case BOOKING_STEPS.SUCCESS:
							return "/travel-insurance/success";
						default:
							return "/travel-insurance";
					}
				default:
					return defaultRedirectTo;
			}
		},
		[pathname, serviceType, defaultRedirectTo]
	);

	// Navigate to a specific step with validation
	const navigateToStep = useCallback(
		(step: BookingStep, force = false) => {
			if (!force && !canNavigateToStep(step)) {
				if (onNavigationBlocked && currentStep) {
					onNavigationBlocked(step, currentStep);
				}
				return false;
			}

			const url = getStepUrl(step);
			router.push(url);
			return true;
		},
		[canNavigateToStep, currentStep, getStepUrl, onNavigationBlocked, router]
	);

	// Navigate to next allowed step
	const navigateToNextStep = useCallback(() => {
		if (!currentStep || !serviceType) return false;

		let stepOrder: BookingStep[];
		switch (serviceType) {
			case 'hotels':
				stepOrder = [BOOKING_STEPS.SEARCH, BOOKING_STEPS.DETAILS, BOOKING_STEPS.GUESTS, BOOKING_STEPS.PAYMENT, BOOKING_STEPS.SUCCESS];
				break;
			case 'car-hire':
				stepOrder = [BOOKING_STEPS.CAR_SEARCH, BOOKING_STEPS.CAR_DETAILS, BOOKING_STEPS.CONTACT, BOOKING_STEPS.PAYMENT, BOOKING_STEPS.SUCCESS];
				break;
			case 'visa-application':
				stepOrder = [BOOKING_STEPS.VISA_START, BOOKING_STEPS.PERSONAL, BOOKING_STEPS.PASSPORT, BOOKING_STEPS.APPOINTMENT, BOOKING_STEPS.REVIEW, BOOKING_STEPS.PAYMENT, BOOKING_STEPS.SUCCESS];
				break;
			case 'travel-insurance':
				stepOrder = [BOOKING_STEPS.INSURANCE_PLANS, BOOKING_STEPS.TRIP_DETAILS, BOOKING_STEPS.TRAVELERS, BOOKING_STEPS.REVIEW, BOOKING_STEPS.PAYMENT, BOOKING_STEPS.SUCCESS];
				break;
			default:
				return false;
		}

		const currentIndex = stepOrder.indexOf(currentStep as BookingStep);
		if (currentIndex >= 0 && currentIndex < stepOrder.length - 1) {
			const nextStep = stepOrder[currentIndex + 1];
			return navigateToStep(nextStep);
		}

		return false;
	}, [currentStep, serviceType, navigateToStep]);

	// Navigate to previous step (always allowed)
	const navigateToPreviousStep = useCallback(() => {
		if (!currentStep || !serviceType) return false;

		let stepOrder: BookingStep[];
		switch (serviceType) {
			case 'hotels':
				stepOrder = [BOOKING_STEPS.SEARCH, BOOKING_STEPS.DETAILS, BOOKING_STEPS.GUESTS, BOOKING_STEPS.PAYMENT, BOOKING_STEPS.SUCCESS];
				break;
			case 'car-hire':
				stepOrder = [BOOKING_STEPS.CAR_SEARCH, BOOKING_STEPS.CAR_DETAILS, BOOKING_STEPS.CONTACT, BOOKING_STEPS.PAYMENT, BOOKING_STEPS.SUCCESS];
				break;
			case 'visa-application':
				stepOrder = [BOOKING_STEPS.VISA_START, BOOKING_STEPS.PERSONAL, BOOKING_STEPS.PASSPORT, BOOKING_STEPS.APPOINTMENT, BOOKING_STEPS.REVIEW, BOOKING_STEPS.PAYMENT, BOOKING_STEPS.SUCCESS];
				break;
			case 'travel-insurance':
				stepOrder = [BOOKING_STEPS.INSURANCE_PLANS, BOOKING_STEPS.TRIP_DETAILS, BOOKING_STEPS.TRAVELERS, BOOKING_STEPS.REVIEW, BOOKING_STEPS.PAYMENT, BOOKING_STEPS.SUCCESS];
				break;
			default:
				return false;
		}

		const currentIndex = stepOrder.indexOf(currentStep as BookingStep);
		if (currentIndex > 0) {
			const previousStep = stepOrder[currentIndex - 1];
			return navigateToStep(previousStep, true); // Force navigation backwards
		}

		return false;
	}, [currentStep, serviceType, navigateToStep]);

	return {
		serviceType,
		currentStep,
		canNavigateToStep,
		navigateToStep,
		navigateToNextStep,
		navigateToPreviousStep,
		findLastAccessibleStep,
	};
}
