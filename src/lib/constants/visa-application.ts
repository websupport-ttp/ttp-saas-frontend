// ============================================================================
// VISA APPLICATION CONSTANTS
// ============================================================================

// Visa application status
export const VISA_APPLICATION_STATUS = {
  DRAFT: 'draft',
  SUBMITTED: 'submitted',
  PROCESSING: 'processing',
  APPROVED: 'approved',
  DENIED: 'denied',
} as const;

// Visa entry types
export const VISA_ENTRY_TYPES = {
  SINGLE: 'single',
  MULTIPLE: 'multiple',
} as const;

// Gender options
export const GENDER_OPTIONS = {
  MALE: 'male',
  FEMALE: 'female',
  OTHER: 'other',
} as const;

// Marital status options
export const MARITAL_STATUS_OPTIONS = {
  SINGLE: 'single',
  MARRIED: 'married',
  DIVORCED: 'divorced',
  WIDOWED: 'widowed',
} as const;

// Employment status options
export const EMPLOYMENT_STATUS_OPTIONS = {
  EMPLOYED: 'employed',
  UNEMPLOYED: 'unemployed',
  STUDENT: 'student',
  RETIRED: 'retired',
  SELF_EMPLOYED: 'self-employed',
} as const;

// Previous application status
export const PREVIOUS_APPLICATION_STATUS = {
  NONE: 'none',
  APPROVED: 'approved',
  DENIED_RECENT: 'denied_recent',
  DENIED_OLD: 'denied_old',
} as const;

// Common visa types
export const COMMON_VISA_TYPES = [
  {
    id: 'tourist',
    name: 'Tourist Visa',
    description: 'For leisure and tourism purposes',
    validityDays: 90,
    maxStayDays: 30,
    entries: VISA_ENTRY_TYPES.SINGLE,
  },
  {
    id: 'business',
    name: 'Business Visa',
    description: 'For business meetings and conferences',
    validityDays: 180,
    maxStayDays: 90,
    entries: VISA_ENTRY_TYPES.MULTIPLE,
  },
  {
    id: 'transit',
    name: 'Transit Visa',
    description: 'For airport transit purposes',
    validityDays: 15,
    maxStayDays: 3,
    entries: VISA_ENTRY_TYPES.SINGLE,
  },
] as const;

// Popular destination countries
export const POPULAR_DESTINATIONS = [
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'CN', name: 'China', flag: '🇨🇳' },
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
] as const;

// Common nationalities
export const COMMON_NATIONALITIES = [
  { code: 'US', name: 'American' },
  { code: 'GB', name: 'British' },
  { code: 'CA', name: 'Canadian' },
  { code: 'AU', name: 'Australian' },
  { code: 'DE', name: 'German' },
  { code: 'FR', name: 'French' },
  { code: 'JP', name: 'Japanese' },
  { code: 'CN', name: 'Chinese' },
  { code: 'IN', name: 'Indian' },
  { code: 'BR', name: 'Brazilian' },
] as const;

// Relationship types for emergency contacts
export const RELATIONSHIP_TYPES = [
  'Spouse',
  'Parent',
  'Child',
  'Sibling',
  'Friend',
  'Colleague',
  'Other',
] as const;

// Required documents by visa type
export const REQUIRED_DOCUMENTS = {
  tourist: [
    'Valid passport',
    'Passport-sized photographs',
    'Proof of accommodation',
    'Flight itinerary',
    'Bank statements',
    'Travel insurance',
  ],
  business: [
    'Valid passport',
    'Passport-sized photographs',
    'Business invitation letter',
    'Company registration documents',
    'Flight itinerary',
    'Bank statements',
    'Travel insurance',
  ],
  transit: [
    'Valid passport',
    'Passport-sized photographs',
    'Onward flight ticket',
    'Visa for final destination (if required)',
  ],
} as const;

// Mock appointment locations for different countries
export const APPOINTMENT_LOCATIONS = {
  'US': [
    {
      id: 'us-embassy-london',
      name: 'US Embassy London',
      address: {
        street: '33 Nine Elms Lane',
        city: 'London',
        state: 'England',
        postalCode: 'SW11 7US',
        country: 'United Kingdom'
      },
      coordinates: { lat: 51.4816, lng: -0.1426 },
      hoursOfOperation: {
        weekdays: '8:00 AM - 5:00 PM',
        weekends: 'Closed'
      },
      contactInfo: {
        phone: '+44 20 7499 9000',
        email: 'LondonIV@state.gov'
      },
      availableSlots: [] as Date[]
    },
    {
      id: 'us-consulate-edinburgh',
      name: 'US Consulate Edinburgh',
      address: {
        street: '3 Regent Terrace',
        city: 'Edinburgh',
        state: 'Scotland',
        postalCode: 'EH7 5BW',
        country: 'United Kingdom'
      },
      coordinates: { lat: 55.9533, lng: -3.1883 },
      hoursOfOperation: {
        weekdays: '9:00 AM - 4:00 PM',
        weekends: 'Closed'
      },
      contactInfo: {
        phone: '+44 131 556 8315',
        email: 'EdinburghConsulate@state.gov'
      },
      availableSlots: [] as Date[]
    },
    {
      id: 'us-consulate-belfast',
      name: 'US Consulate Belfast',
      address: {
        street: 'Danesfort House, 223 Stranmillis Road',
        city: 'Belfast',
        state: 'Northern Ireland',
        postalCode: 'BT9 5GR',
        country: 'United Kingdom'
      },
      coordinates: { lat: 54.5973, lng: -5.9301 },
      hoursOfOperation: {
        weekdays: '8:30 AM - 4:30 PM',
        weekends: 'Closed'
      },
      contactInfo: {
        phone: '+44 28 9038 6100',
        email: 'BelfastConsulate@state.gov'
      },
      availableSlots: [] as Date[]
    }
  ],
  'GB': [
    {
      id: 'uk-visa-center-manchester',
      name: 'UK Visa Application Centre Manchester',
      address: {
        street: '1 Piccadilly Gardens',
        city: 'Manchester',
        state: 'England',
        postalCode: 'M1 1RG',
        country: 'United Kingdom'
      },
      coordinates: { lat: 53.4808, lng: -2.2426 },
      hoursOfOperation: {
        weekdays: '8:00 AM - 6:00 PM',
        weekends: '9:00 AM - 2:00 PM'
      },
      contactInfo: {
        phone: '+44 161 123 4567',
        email: 'manchester@vfshelpline.com'
      },
      availableSlots: [] as Date[]
    },
    {
      id: 'uk-visa-center-birmingham',
      name: 'UK Visa Application Centre Birmingham',
      address: {
        street: '2 Snowhill Queensway',
        city: 'Birmingham',
        state: 'England',
        postalCode: 'B4 6GA',
        country: 'United Kingdom'
      },
      coordinates: { lat: 52.4862, lng: -1.8904 },
      hoursOfOperation: {
        weekdays: '8:00 AM - 6:00 PM',
        weekends: '9:00 AM - 2:00 PM'
      },
      contactInfo: {
        phone: '+44 121 456 7890',
        email: 'birmingham@vfshelpline.com'
      },
      availableSlots: [] as Date[]
    }
  ],
  'CA': [
    {
      id: 'canada-visa-center-london',
      name: 'Canada Visa Application Centre London',
      address: {
        street: '5 Aldermanbury Square',
        city: 'London',
        state: 'England',
        postalCode: 'EC2V 7HR',
        country: 'United Kingdom'
      },
      coordinates: { lat: 51.5155, lng: -0.0922 },
      hoursOfOperation: {
        weekdays: '8:30 AM - 4:30 PM',
        weekends: 'Closed'
      },
      contactInfo: {
        phone: '+44 20 7258 6600',
        email: 'info.ukctd-londoncvac@vfshelpline.com'
      },
      availableSlots: [] as Date[]
    }
  ]
} as const;