// ============================================================================
// TRAVEL INSURANCE UTILITY FUNCTIONS
// ============================================================================

import { 
  InsurancePolicy, 
  InsurancePlan, 
  InsuranceQuote, 
  InsuranceQuoteRequest, 
  TripDetails, 
  InsuredTraveler 
} from '@/types/travel-insurance';
import { 
  INSURANCE_PLAN_TYPES, 
  AGE_MULTIPLIERS, 
  TRIP_TYPE_MULTIPLIERS, 
  BASE_PRICING,
  STANDARD_COVERAGE 
} from '@/lib/constants/travel-insurance';

/**
 * Calculate insurance premium based on trip details and travelers
 */
export function calculateInsurancePremium(
  plan: InsurancePlan,
  tripDetails: TripDetails,
  travelers: { age: number; hasPreExistingConditions: boolean }[]
): number {
  const tripDays = Math.ceil((tripDetails.returnDate.getTime() - tripDetails.departureDate.getTime()) / (1000 * 60 * 60 * 24));
  
  let totalPremium = 0;

  travelers.forEach(traveler => {
    let basePremium = plan.basePrice * tripDays;
    
    // Apply age multiplier
    const ageMultiplier = getAgeMultiplier(traveler.age, plan.ageMultipliers);
    basePremium *= ageMultiplier;
    
    // Apply trip type multiplier
    const tripTypeMultiplier = plan.tripTypeMultipliers[tripDetails.tripType];
    basePremium *= tripTypeMultiplier;
    
    // Add pre-existing condition surcharge
    if (traveler.hasPreExistingConditions) {
      basePremium *= 1.25; // 25% surcharge
    }
    
    totalPremium += basePremium;
  });

  return Math.round(totalPremium * 100) / 100; // Round to 2 decimal places
}

/**
 * Get age multiplier based on traveler age
 */
export function getAgeMultiplier(age: number, ageMultipliers: InsurancePlan['ageMultipliers']): number {
  if (age < 30) return ageMultipliers.under30;
  if (age <= 60) return ageMultipliers.age30to60;
  return ageMultipliers.over60;
}

/**
 * Calculate trip duration in days
 */
export function calculateTripDuration(departureDate: Date, returnDate: Date): number {
  return Math.ceil((returnDate.getTime() - departureDate.getTime()) / (1000 * 60 * 60 * 24));
}

/**
 * Generate insurance quote
 */
export function generateInsuranceQuote(
  plan: InsurancePlan,
  quoteRequest: InsuranceQuoteRequest
): InsuranceQuote {
  const basePremium = calculateInsurancePremium(plan, quoteRequest.tripDetails, quoteRequest.travelers);
  const taxes = basePremium * 0.08; // 8% tax
  const totalPremium = basePremium + taxes;

  return {
    planId: plan.id,
    totalPremium: Math.round(totalPremium * 100) / 100,
    premiumBreakdown: {
      basePremium: Math.round(basePremium * 100) / 100,
      ageAdjustment: 0, // Included in base premium calculation
      tripTypeAdjustment: 0, // Included in base premium calculation
      taxes: Math.round(taxes * 100) / 100,
    },
    coverage: plan.coverage,
    validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Valid for 7 days
  };
}

/**
 * Generate policy number
 */
export function generatePolicyNumber(): string {
  const prefix = 'INS';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}${timestamp}${random}`;
}

/**
 * Format coverage amount for display
 */
export function formatCoverageAmount(amount: number): string {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  } else if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(0)}K`;
  } else {
    return `$${amount}`;
  }
}

/**
 * Validate trip dates
 */
export function validateTripDates(departureDate: Date, returnDate: Date): { valid: boolean; message?: string } {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (departureDate < today) {
    return { valid: false, message: 'Departure date cannot be in the past' };
  }

  if (returnDate <= departureDate) {
    return { valid: false, message: 'Return date must be after departure date' };
  }

  const maxTripDays = 365; // Maximum trip duration
  const tripDays = calculateTripDuration(departureDate, returnDate);
  
  if (tripDays > maxTripDays) {
    return { valid: false, message: `Trip duration cannot exceed ${maxTripDays} days` };
  }

  return { valid: true };
}

/**
 * Calculate traveler age from date of birth
 */
export function calculateTravelerAge(dateOfBirth: Date): number {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}

/**
 * Validate traveler age for insurance
 */
export function validateTravelerAge(age: number): { valid: boolean; message?: string } {
  if (age < 0) {
    return { valid: false, message: 'Invalid age' };
  }

  if (age > 85) {
    return { valid: false, message: 'Coverage not available for travelers over 85 years old' };
  }

  return { valid: true };
}

/**
 * Compare insurance plans
 */
export function comparePlans(plans: InsurancePlan[]): {
  planId: string;
  name: string;
  coverage: { [key: string]: number };
  price: number;
}[] {
  return plans.map(plan => ({
    planId: plan.id,
    name: plan.name,
    coverage: {
      'Medical Expenses': plan.coverage.medicalExpenses,
      'Trip Cancellation': plan.coverage.tripCancellation,
      'Baggage': plan.coverage.baggage,
      'Emergency Evacuation': plan.coverage.emergencyEvacuation,
    },
    price: plan.basePrice,
  }));
}

/**
 * Check if destination requires travel insurance
 */
export function requiresTravelInsurance(destination: string): boolean {
  const requiredCountries = [
    'Germany', 'France', 'Italy', 'Spain', 'Netherlands', 'Belgium', 'Austria',
    'Switzerland', 'Czech Republic', 'Poland', 'Hungary', 'Slovakia', 'Slovenia',
    'Estonia', 'Latvia', 'Lithuania', 'Malta', 'Cyprus', 'Greece', 'Portugal',
    'Cuba', 'Russia', 'Belarus', 'Ukraine'
  ];
  
  return requiredCountries.some(country => 
    destination.toLowerCase().includes(country.toLowerCase())
  );
}

/**
 * Get recommended coverage based on destination
 */
export function getRecommendedCoverage(destination: string, tripCost: number): {
  planType: 'basic' | 'standard' | 'premium';
  reason: string;
} {
  const isHighRisk = ['United States', 'Canada', 'Japan', 'Switzerland', 'Norway'].some(country =>
    destination.toLowerCase().includes(country.toLowerCase())
  );

  const isExpensiveTrip = tripCost > 5000;

  if (isHighRisk || isExpensiveTrip) {
    return {
      planType: 'premium' as const,
      reason: isHighRisk 
        ? 'High medical costs in destination country' 
        : 'High trip value requires comprehensive coverage'
    };
  }

  if (tripCost > 2000) {
    return {
      planType: 'standard' as const,
      reason: 'Moderate trip value - standard coverage recommended'
    };
  }

  return {
    planType: 'basic' as const,
    reason: 'Basic coverage suitable for this trip'
  };
}