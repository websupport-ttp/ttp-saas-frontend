// ============================================================================
// TRAVEL INSURANCE CONSTANTS
// ============================================================================

// Insurance plan types
export const INSURANCE_PLAN_TYPES = {
  BASIC: 'basic',
  STANDARD: 'standard',
  PREMIUM: 'premium',
} as const;

// Insurance plan labels
export const INSURANCE_PLAN_LABELS = {
  [INSURANCE_PLAN_TYPES.BASIC]: 'Basic Coverage',
  [INSURANCE_PLAN_TYPES.STANDARD]: 'Standard Coverage',
  [INSURANCE_PLAN_TYPES.PREMIUM]: 'Premium Coverage',
} as const;

// Trip types
export const TRIP_TYPES = {
  LEISURE: 'leisure',
  BUSINESS: 'business',
  ADVENTURE: 'adventure',
  STUDY: 'study',
} as const;

// Trip type labels
export const TRIP_TYPE_LABELS = {
  [TRIP_TYPES.LEISURE]: 'Leisure/Vacation',
  [TRIP_TYPES.BUSINESS]: 'Business Travel',
  [TRIP_TYPES.ADVENTURE]: 'Adventure/Sports',
  [TRIP_TYPES.STUDY]: 'Study/Education',
} as const;

// Policy status
export const POLICY_STATUS = {
  ACTIVE: 'active',
  EXPIRED: 'expired',
  CANCELLED: 'cancelled',
} as const;

// Age groups for pricing
export const AGE_GROUPS = {
  UNDER_30: 'under30',
  AGE_30_TO_60: 'age30to60',
  OVER_60: 'over60',
} as const;

// Coverage categories
export const COVERAGE_CATEGORIES = {
  MEDICAL: 'medical',
  TRIP: 'trip',
  BAGGAGE: 'baggage',
  DELAY: 'delay',
  EMERGENCY: 'emergency',
  LIABILITY: 'liability',
} as const;

// Standard coverage amounts by plan type
export const STANDARD_COVERAGE = {
  [INSURANCE_PLAN_TYPES.BASIC]: {
    medicalExpenses: 50000,
    tripCancellation: 5000,
    tripInterruption: 5000,
    baggage: 1000,
    baggageDelay: 200,
    flightDelay: 300,
    emergencyEvacuation: 100000,
    accidentalDeath: 25000,
    personalLiability: 0,
  },
  [INSURANCE_PLAN_TYPES.STANDARD]: {
    medicalExpenses: 100000,
    tripCancellation: 10000,
    tripInterruption: 10000,
    baggage: 2500,
    baggageDelay: 500,
    flightDelay: 600,
    emergencyEvacuation: 250000,
    accidentalDeath: 50000,
    personalLiability: 100000,
  },
  [INSURANCE_PLAN_TYPES.PREMIUM]: {
    medicalExpenses: 250000,
    tripCancellation: 25000,
    tripInterruption: 25000,
    baggage: 5000,
    baggageDelay: 1000,
    flightDelay: 1200,
    emergencyEvacuation: 500000,
    accidentalDeath: 100000,
    personalLiability: 250000,
  },
} as const;

// Base pricing by plan type (per day per person)
export const BASE_PRICING = {
  [INSURANCE_PLAN_TYPES.BASIC]: 8,
  [INSURANCE_PLAN_TYPES.STANDARD]: 15,
  [INSURANCE_PLAN_TYPES.PREMIUM]: 25,
} as const;

// Age multipliers for pricing
export const AGE_MULTIPLIERS = {
  [AGE_GROUPS.UNDER_30]: 1.0,
  [AGE_GROUPS.AGE_30_TO_60]: 1.2,
  [AGE_GROUPS.OVER_60]: 1.8,
} as const;

// Trip type multipliers for pricing
export const TRIP_TYPE_MULTIPLIERS = {
  [TRIP_TYPES.LEISURE]: 1.0,
  [TRIP_TYPES.BUSINESS]: 1.1,
  [TRIP_TYPES.ADVENTURE]: 1.5,
  [TRIP_TYPES.STUDY]: 0.9,
} as const;

// Common pre-existing conditions
export const COMMON_CONDITIONS = [
  'Diabetes',
  'High Blood Pressure',
  'Heart Disease',
  'Asthma',
  'Arthritis',
  'Cancer (in remission)',
  'Mental Health Conditions',
  'Pregnancy',
  'Other',
] as const;

// Common exclusions
export const COMMON_EXCLUSIONS = [
  'Pre-existing medical conditions (unless declared)',
  'High-risk activities (unless covered)',
  'War and terrorism (in some regions)',
  'Alcohol or drug-related incidents',
  'Intentional self-harm',
  'Criminal activities',
  'Travel against government advice',
  'Pregnancy-related claims (unless complications)',
] as const;

// Popular destinations for insurance
export const POPULAR_INSURANCE_DESTINATIONS = [
  { region: 'Europe', countries: ['France', 'Germany', 'Italy', 'Spain', 'United Kingdom'] },
  { region: 'North America', countries: ['United States', 'Canada', 'Mexico'] },
  { region: 'Asia', countries: ['Japan', 'Thailand', 'Singapore', 'South Korea', 'China'] },
  { region: 'Oceania', countries: ['Australia', 'New Zealand', 'Fiji'] },
  { region: 'South America', countries: ['Brazil', 'Argentina', 'Chile', 'Peru'] },
  { region: 'Africa', countries: ['South Africa', 'Egypt', 'Morocco', 'Kenya'] },
] as const;

// Sample insurance plans
export const SAMPLE_INSURANCE_PLANS = [
  {
    id: 'basic-plan',
    name: 'Essential Coverage',
    type: 'basic' as const,
    description: 'Basic protection for budget-conscious travelers',
    coverage: {
      ...STANDARD_COVERAGE.basic,
      additionalBenefits: ['24/7 Emergency Assistance', 'Online Claims Processing'],
    },
    basePrice: BASE_PRICING.basic,
    ageMultipliers: {
      under30: AGE_MULTIPLIERS.under30,
      age30to60: AGE_MULTIPLIERS.age30to60,
      over60: AGE_MULTIPLIERS.over60,
    },
    tripTypeMultipliers: {
      leisure: TRIP_TYPE_MULTIPLIERS.leisure,
      business: TRIP_TYPE_MULTIPLIERS.business,
      adventure: TRIP_TYPE_MULTIPLIERS.adventure,
      study: TRIP_TYPE_MULTIPLIERS.study,
    },
    features: [
      '24/7 Emergency Assistance',
      'Online Claims Processing',
      'Coverage for Trip Delays',
      'Basic Medical Coverage',
    ],
    exclusions: COMMON_EXCLUSIONS,
    popular: false,
  },
  {
    id: 'standard-plan',
    name: 'Comprehensive Coverage',
    type: 'standard' as const,
    description: 'Complete protection with enhanced benefits',
    coverage: {
      ...STANDARD_COVERAGE.standard,
      additionalBenefits: ['24/7 Emergency Assistance', 'Online Claims Processing', 'Personal Liability Protection', 'Baggage Delay Compensation'],
    },
    basePrice: BASE_PRICING.standard,
    ageMultipliers: {
      under30: AGE_MULTIPLIERS.under30,
      age30to60: AGE_MULTIPLIERS.age30to60,
      over60: AGE_MULTIPLIERS.over60,
    },
    tripTypeMultipliers: {
      leisure: TRIP_TYPE_MULTIPLIERS.leisure,
      business: TRIP_TYPE_MULTIPLIERS.business,
      adventure: TRIP_TYPE_MULTIPLIERS.adventure,
      study: TRIP_TYPE_MULTIPLIERS.study,
    },
    features: [
      '24/7 Emergency Assistance',
      'Online Claims Processing',
      'Coverage for Trip Delays',
      'Enhanced Medical Coverage',
      'Personal Liability Protection',
      'Baggage Delay Compensation',
      'Flight Connection Coverage',
      'Rental Car Excess Coverage',
    ],
    exclusions: COMMON_EXCLUSIONS,
    popular: true,
  },
  {
    id: 'premium-plan',
    name: 'Ultimate Protection',
    type: 'premium' as const,
    description: 'Maximum coverage for complete peace of mind',
    coverage: {
      ...STANDARD_COVERAGE.premium,
      additionalBenefits: ['24/7 Emergency Assistance', 'Online Claims Processing', 'Personal Liability Protection', 'Baggage Delay Compensation', 'Adventure Sports Coverage', 'Pre-existing Conditions Coverage', 'Cancel for Any Reason', 'Concierge Services'],
    },
    basePrice: BASE_PRICING.premium,
    ageMultipliers: {
      under30: AGE_MULTIPLIERS.under30,
      age30to60: AGE_MULTIPLIERS.age30to60,
      over60: AGE_MULTIPLIERS.over60,
    },
    tripTypeMultipliers: {
      leisure: TRIP_TYPE_MULTIPLIERS.leisure,
      business: TRIP_TYPE_MULTIPLIERS.business,
      adventure: TRIP_TYPE_MULTIPLIERS.adventure,
      study: TRIP_TYPE_MULTIPLIERS.study,
    },
    features: [
      '24/7 Emergency Assistance',
      'Online Claims Processing',
      'Coverage for Trip Delays',
      'Maximum Medical Coverage',
      'Personal Liability Protection',
      'Baggage Delay Compensation',
      'Flight Connection Coverage',
      'Rental Car Excess Coverage',
      'Adventure Sports Coverage',
      'Pre-existing Conditions Coverage',
      'Cancel for Any Reason',
      'Concierge Services',
    ],
    exclusions: COMMON_EXCLUSIONS.filter(exclusion => 
      !exclusion.includes('Pre-existing') && !exclusion.includes('High-risk')
    ),
    popular: false,
  },
] as const;