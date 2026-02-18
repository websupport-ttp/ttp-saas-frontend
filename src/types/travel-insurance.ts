// ============================================================================
// TRAVEL INSURANCE SERVICE TYPES
// ============================================================================

// Insurance policy data model
export interface InsurancePolicy {
  id: string;
  policyNumber: string;
  planType: 'basic' | 'standard' | 'premium';
  coverage: InsuranceCoverage;
  tripDetails: TripDetails;
  travelers: InsuredTraveler[];
  premium: number;
  effectiveDate: Date;
  expirationDate: Date;
  status: 'active' | 'expired' | 'cancelled';
  createdAt: Date;
  confirmationNumber: string;
}

// Insurance coverage details
export interface InsuranceCoverage {
  medicalExpenses: number;
  tripCancellation: number;
  tripInterruption: number;
  baggage: number;
  baggageDelay: number;
  flightDelay: number;
  emergencyEvacuation: number;
  accidentalDeath: number;
  personalLiability: number;
  additionalBenefits: string[];
}

// Trip details for insurance
export interface TripDetails {
  destination: string;
  departureDate: Date;
  returnDate: Date;
  tripType: 'leisure' | 'business' | 'adventure' | 'study';
  tripCost: number;
  numberOfTravelers: number;
  domesticTrip: boolean;
}

// Insured traveler information
export interface InsuredTraveler {
  id: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    gender: 'male' | 'female' | 'other';
    email: string;
    phoneNumber: string;
    address: {
      street: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
    };
  };
  medicalInfo?: {
    hasPreExistingConditions: boolean;
    conditions?: string[];
    medications?: string[];
    allergies?: string[];
  };
  beneficiary: {
    name: string;
    relationship: string;
    phoneNumber: string;
    email?: string;
    address: {
      street: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
    };
  };
}

// Insurance plan options
export interface InsurancePlan {
  id: string;
  name: string;
  type: 'basic' | 'standard' | 'premium';
  description: string;
  coverage: InsuranceCoverage;
  basePrice: number;
  ageMultipliers: {
    under30: number;
    age30to60: number;
    over60: number;
  };
  tripTypeMultipliers: {
    leisure: number;
    business: number;
    adventure: number;
    study: number;
  };
  features: string[];
  exclusions: string[];
  popular?: boolean;
}

// Insurance quote request
export interface InsuranceQuoteRequest {
  tripDetails: TripDetails;
  travelers: {
    age: number;
    hasPreExistingConditions: boolean;
  }[];
  planType: 'basic' | 'standard' | 'premium';
}

// Insurance quote response
export interface InsuranceQuote {
  planId: string;
  totalPremium: number;
  premiumBreakdown: {
    basePremium: number;
    ageAdjustment: number;
    tripTypeAdjustment: number;
    taxes: number;
  };
  coverage: InsuranceCoverage;
  validUntil: Date;
}

// ============================================================================
// COMPONENT PROP INTERFACES
// ============================================================================

// Insurance plan selector props
export interface InsurancePlanSelectorProps {
  plans: InsurancePlan[];
  selectedPlan: string | null;
  tripDetails: TripDetails | null;
  onPlanSelect: (planId: string) => void;
  onCompare: (planIds: string[]) => void;
}

// Trip details form props
export interface TripDetailsFormProps {
  tripDetails: TripDetails;
  onTripDetailsChange: (details: TripDetails) => void;
  onSubmit: (quote?: any) => void;
}

// Traveler information form props
export interface TravelerInformationFormProps {
  travelers: InsuredTraveler[];
  onTravelerUpdate: (index: number, traveler: InsuredTraveler) => void;
  onAddTraveler: () => void;
  onRemoveTraveler: (index: number) => void;
  onSubmit: () => void;
}

// Policy review summary props
export interface PolicyReviewSummaryProps {
  policy: InsurancePolicy;
  quote: InsuranceQuote;
  onEdit: (section: string) => void;
  onAcceptTerms: (accepted: boolean) => void;
  onSubmit: () => void;
  termsAccepted: boolean;
}

// Insurance comparison props
export interface InsuranceComparisonProps {
  plans: InsurancePlan[];
  selectedPlans: string[];
  onPlanSelect: (planId: string) => void;
  onClose: () => void;
}