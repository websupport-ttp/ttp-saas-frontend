// ============================================================================
// VISA APPLICATION SERVICE TYPES
// ============================================================================

// Visa application data model
export interface VisaApplication {
  id: string;
  destinationCountry: string;
  nationality: string;
  visaType: VisaType;
  arrivalDate: Date;
  travelers: VisaTraveler[];
  appointmentLocation: string;
  status: 'draft' | 'submitted' | 'processing' | 'approved' | 'denied';
  totalCost: number;
  confirmationNumber: string;
  createdAt: Date;
  submittedAt?: Date;
}

// Visa type information
export interface VisaType {
  id: string;
  name: string;
  description: string;
  validityDays: number;
  maxStayDays: number;
  entries: 'single' | 'multiple';
  governmentFee: number;
  processingFee: number;
  processingTime: string;
  requirements: string[];
}

// Visa traveler information
export interface VisaTraveler {
  id: string;
  personalInfo: PersonalInformation;
  passportInfo: PassportInformation;
  additionalInfo: AdditionalInformation;
}

// Personal information for visa application
export interface PersonalInformation {
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth: Date;
  placeOfBirth: string;
  nationality: string;
  gender: 'male' | 'female' | 'other';
  maritalStatus: 'single' | 'married' | 'divorced' | 'widowed';
  email: string;
  phoneNumber: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

// Passport information
export interface PassportInformation {
  passportNumber: string;
  nationality: string;
  issueDate: Date;
  expirationDate: Date;
  issuingCountry: string;
  placeOfIssue: string;
}

// Additional information for visa application
export interface AdditionalInformation {
  hasAssets: boolean;
  assetDetails?: string;
  hasTravelHistory: boolean;
  travelHistoryDetails?: string;
  employmentStatus: 'employed' | 'unemployed' | 'student' | 'retired' | 'self-employed';
  employerDetails?: {
    name: string;
    address: string;
    position: string;
  };
  monthlyIncome: string;
  previousApplications: 'none' | 'approved' | 'denied_recent' | 'denied_old';
  previousApplicationDetails?: string;
  purposeOfTravel: string;
  accommodationDetails?: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phoneNumber: string;
    address: string;
  };
}

// Appointment location
export interface AppointmentLocation {
  id: string;
  name: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  coordinates: {
    lat: number;
    lng: number;
  };
  hoursOfOperation: {
    weekdays: string;
    weekends: string;
  };
  contactInfo: {
    phone: string;
    email: string;
  };
  availableSlots: Date[];
}

// Visa application search criteria
export interface VisaSearchCriteria {
  destinationCountry: string;
  nationality: string;
  visaType?: string;
  numberOfApplicants: number;
}

// ============================================================================
// COMPONENT PROP INTERFACES
// ============================================================================

// Visa application form props
export interface VisaApplicationFormProps {
  destinationCountry: string;
  nationality: string;
  visaType: VisaType | null;
  arrivalDate: Date | null;
  onCountryChange: (country: string) => void;
  onNationalityChange: (nationality: string) => void;
  onVisaTypeChange: (visaType: VisaType) => void;
  onArrivalDateChange: (date: Date | null) => void;
  onStartApplication: () => void;
}

// Visa personal details form props
export interface VisaPersonalDetailsFormProps {
  travelers: VisaTraveler[];
  onTravelerUpdate: (index: number, traveler: VisaTraveler) => void;
  onAddTraveler: () => void;
  onRemoveTraveler: (index: number) => void;
  onSubmit: () => void;
}

// Visa passport form props
export interface VisaPassportFormProps {
  traveler: VisaTraveler;
  onTravelerUpdate: (traveler: VisaTraveler) => void;
  onSubmit: () => void;
}

// Visa appointment selector props
export interface VisaAppointmentSelectorProps {
  userAddress: string;
  availableLocations: AppointmentLocation[];
  selectedLocation: string | null;
  onAddressChange: (address: string) => void;
  onLocationSelect: (locationId: string) => void;
  onSubmit: () => void;
}

// Visa review summary props
export interface VisaReviewSummaryProps {
  application: VisaApplication;
  visaType: VisaType;
  onEdit: (section: string) => void;
  onSubmit: () => void;
}