// ============================================================================
// VISA APPLICATION UTILITY FUNCTIONS
// ============================================================================

import { VisaApplication, VisaType, VisaTraveler, AppointmentLocation } from '@/types/visa-application';
import { VISA_APPLICATION_STATUS, POPULAR_DESTINATIONS, COMMON_NATIONALITIES } from '@/lib/constants/visa-application';

/**
 * Calculate total visa application cost
 */
export function calculateVisaCost(visaType: VisaType, numberOfTravelers: number): number {
  return (visaType.governmentFee + visaType.processingFee) * numberOfTravelers;
}

/**
 * Calculate processing time in business days
 */
export function calculateProcessingDays(processingTime: string): number {
  const match = processingTime.match(/(\d+)/);
  return match ? parseInt(match[1]) : 0;
}

/**
 * Validate passport expiry for visa application
 */
export function validatePassportExpiry(
  expiryDate: Date,
  travelDate: Date,
  requiredValidityMonths: number = 6
): { valid: boolean; message?: string } {
  const requiredExpiryDate = new Date(travelDate);
  requiredExpiryDate.setMonth(requiredExpiryDate.getMonth() + requiredValidityMonths);

  if (expiryDate <= travelDate) {
    return { valid: false, message: 'Passport expires before travel date' };
  }

  if (expiryDate <= requiredExpiryDate) {
    return { 
      valid: false, 
      message: `Passport must be valid for at least ${requiredValidityMonths} months after travel date` 
    };
  }

  return { valid: true };
}

/**
 * Generate visa application confirmation number
 */
export function generateVisaConfirmation(): string {
  const prefix = 'VISA';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}${timestamp}${random}`;
}

/**
 * Format visa validity information
 */
export function formatVisaValidity(visaType: VisaType): string {
  const validity = visaType.validityDays;
  const maxStay = visaType.maxStayDays;
  const entries = visaType.entries === 'single' ? 'Single Entry' : 'Multiple Entry';

  if (validity >= 365) {
    const years = Math.floor(validity / 365);
    return `${years} year${years > 1 ? 's' : ''} validity, ${maxStay} days max stay, ${entries}`;
  } else {
    return `${validity} days validity, ${maxStay} days max stay, ${entries}`;
  }
}

/**
 * Get country information by code
 */
export function getCountryInfo(countryCode: string): { name: string; flag: string } | null {
  const country = POPULAR_DESTINATIONS.find(dest => dest.code === countryCode);
  return country ? { name: country.name, flag: country.flag } : null;
}

/**
 * Get nationality by country code
 */
export function getNationalityByCountry(countryCode: string): string | null {
  const nationality = COMMON_NATIONALITIES.find(nat => nat.code === countryCode);
  return nationality?.name || null;
}

/**
 * Calculate distance between two coordinates (Haversine formula)
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Find nearest appointment locations
 */
export function findNearestLocations(
  userLat: number,
  userLon: number,
  locations: AppointmentLocation[],
  maxResults: number = 5
): AppointmentLocation[] {
  return locations
    .map(location => ({
      ...location,
      distance: calculateDistance(userLat, userLon, location.coordinates.lat, location.coordinates.lng)
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, maxResults);
}

/**
 * Validate application completeness
 */
export function validateApplicationCompleteness(application: VisaApplication): {
  complete: boolean;
  missingFields: string[];
} {
  const missingFields: string[] = [];

  if (!application.destinationCountry) missingFields.push('Destination Country');
  if (!application.nationality) missingFields.push('Nationality');
  if (!application.visaType) missingFields.push('Visa Type');
  if (!application.arrivalDate) missingFields.push('Arrival Date');
  if (!application.appointmentLocation) missingFields.push('Appointment Location');

  // Check travelers
  if (application.travelers.length === 0) {
    missingFields.push('Traveler Information');
  } else {
    application.travelers.forEach((traveler, index) => {
      if (!traveler.personalInfo.firstName) missingFields.push(`Traveler ${index + 1} First Name`);
      if (!traveler.personalInfo.lastName) missingFields.push(`Traveler ${index + 1} Last Name`);
      if (!traveler.personalInfo.email) missingFields.push(`Traveler ${index + 1} Email`);
      if (!traveler.passportInfo.passportNumber) missingFields.push(`Traveler ${index + 1} Passport Number`);
    });
  }

  return {
    complete: missingFields.length === 0,
    missingFields
  };
}

/**
 * Format application status for display
 */
export function formatApplicationStatus(status: 'draft' | 'submitted' | 'processing' | 'approved' | 'denied'): string {
  const statusLabels = {
    'draft': 'Draft',
    'submitted': 'Submitted',
    'processing': 'Processing',
    'approved': 'Approved',
    'denied': 'Denied',
  };

  return statusLabels[status] || status;
}

/**
 * Calculate application fee breakdown
 */
export function calculateFeeBreakdown(visaType: VisaType, numberOfTravelers: number): {
  governmentFees: number;
  processingFees: number;
  total: number;
} {
  const governmentFees = visaType.governmentFee * numberOfTravelers;
  const processingFees = visaType.processingFee * numberOfTravelers;
  
  return {
    governmentFees,
    processingFees,
    total: governmentFees + processingFees
  };
}

/**
 * Validate age for visa application
 */
export function validateApplicantAge(dateOfBirth: Date, minAge: number = 0): { valid: boolean; message?: string } {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  if (age < minAge) {
    return { valid: false, message: `Applicant must be at least ${minAge} years old` };
  }

  return { valid: true };
}