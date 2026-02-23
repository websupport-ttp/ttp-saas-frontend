/**
 * Form Validation Schemas
 * Comprehensive validation schemas matching backend requirements for all services
 */

import { z } from 'zod';

// Common validation patterns
// More flexible phone regex that accepts:
// - International format: +2348012345678
// - Local format with leading zero: 08012345678
// - Without country code: 8012345678
const phoneRegex = /^\+?[0-9]{7,15}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
const nameRegex = /^[a-zA-Z\s'-]+$/;
const airportCodeRegex = /^[A-Z]{3}$/;
const countryCodeRegex = /^[A-Z]{2}$/;
const currencyCodeRegex = /^[A-Z]{3}$/;
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
const mongoIdRegex = /^[0-9a-fA-F]{24}$/;

// Base reusable schemas
export const emailSchema = z
  .string()
  .email('Invalid email address')
  .max(255, 'Email cannot exceed 255 characters')
  .trim();

export const phoneSchema = z
  .string()
  .regex(phoneRegex, 'Invalid phone number format. Use format: +2348012345678 or 08012345678')
  .min(7, 'Phone number must be at least 7 digits')
  .max(15, 'Phone number cannot exceed 15 digits');

export const nameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters long')
  .max(50, 'Name cannot exceed 50 characters')
  .regex(nameRegex, 'Name can only contain letters, spaces, hyphens, and apostrophes')
  .trim();

export const strongPasswordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .max(128, 'Password cannot exceed 128 characters')
  .regex(passwordRegex, 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character');

export const dateSchema = z
  .string()
  .regex(dateRegex, 'Date must be in YYYY-MM-DD format')
  .refine((date) => {
    const parsedDate = new Date(date);
    return !isNaN(parsedDate.getTime());
  }, 'Invalid date');

export const futureDateSchema = dateSchema.refine((date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const inputDate = new Date(date);
  return inputDate >= today;
}, 'Date cannot be in the past');

// Authentication Schemas
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required').max(128, 'Password cannot exceed 128 characters'),
});

export const registerSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  password: strongPasswordSchema,
  phoneNumber: phoneSchema.optional(),
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  newPassword: strongPasswordSchema,
});

// Flight Schemas
export const flightSearchSchema = z.object({
  origin: z
    .string()
    .min(3, 'Origin is required')
    .max(100, 'Origin cannot exceed 100 characters')
    .trim(),
  destination: z
    .string()
    .min(3, 'Destination is required')
    .max(100, 'Destination cannot exceed 100 characters')
    .trim(),
  departureDate: futureDateSchema,
  returnDate: dateSchema.optional(),
  passengers: z.object({
    adults: z.number().int().min(1, 'At least 1 adult is required').max(9, 'Maximum 9 adults allowed'),
    children: z.number().int().min(0, 'Children count cannot be negative').max(9, 'Maximum 9 children allowed'),
    infants: z.number().int().min(0, 'Infants count cannot be negative').max(9, 'Maximum 9 infants allowed'),
  }),
  cabinClass: z.enum(['economy', 'premium_economy', 'business', 'first']),
  tripType: z.enum(['one_way', 'round_trip', 'multi_city']),
}).refine((data) => {
  // Return date is required for round trip
  if (data.tripType === 'round_trip' && !data.returnDate) {
    return false;
  }
  return true;
}, {
  message: 'Return date is required for round trip',
  path: ['returnDate'],
}).refine((data) => {
  // Return date must be after departure date
  if (data.returnDate && data.departureDate) {
    const departureDate = new Date(data.departureDate);
    const returnDate = new Date(data.returnDate);
    return returnDate > departureDate;
  }
  return true;
}, {
  message: 'Return date must be after departure date',
  path: ['returnDate'],
}).refine((data) => {
  // Infants cannot exceed adults
  return data.passengers.infants <= data.passengers.adults;
}, {
  message: 'Number of infants cannot exceed number of adults',
  path: ['passengers', 'infants'],
});

export const passengerInfoSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  phoneNumber: phoneSchema,
  dateOfBirth: dateSchema.refine((date) => {
    const birthDate = new Date(date);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    return age >= 0 && age <= 120;
  }, 'Invalid date of birth'),
  gender: z.enum(['MALE', 'FEMALE']),
  passportNumber: z
    .string()
    .min(6, 'Passport number must be at least 6 characters')
    .max(20, 'Passport number cannot exceed 20 characters')
    .optional(),
  passportExpiryDate: dateSchema.optional(),
  nationality: z
    .string()
    .min(2, 'Nationality must be at least 2 characters')
    .max(50, 'Nationality cannot exceed 50 characters')
    .optional(),
});

export const flightBookingSchema = z.object({
  flightDetails: z.object({
    id: z.string().min(1, 'Flight ID is required'),
    price: z.number().positive('Flight price must be positive'),
  }),
  passengerDetails: z.array(passengerInfoSchema).min(1, 'At least one passenger is required'),
  referralCode: z
    .string()
    .min(3, 'Referral code must be at least 3 characters')
    .max(50, 'Referral code cannot exceed 50 characters')
    .trim()
    .toUpperCase()
    .optional(),
});

// Visa Application Schemas
export const visaBasicInfoSchema = z.object({
  destinationCountry: z
    .string()
    .min(2, 'Destination country is required')
    .max(100, 'Destination country cannot exceed 100 characters'),
  visaType: z.enum(['Tourist', 'Business', 'Student', 'Transit', 'Work'], {
    message: 'Please select a valid visa type'
  }),
  urgency: z.enum(['Standard', 'Express', 'Super Express']).default('Standard'),
});

export const visaPersonalInfoSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  otherNames: nameSchema.optional(),
  dateOfBirth: dateSchema.refine((date) => {
    const birthDate = new Date(date);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    return age >= 16 && age <= 100;
  }, 'Age must be between 16 and 100 years'),
  gender: z.enum(['Male', 'Female', 'Other']),
  nationality: z
    .string()
    .min(2, 'Nationality is required')
    .max(50, 'Nationality cannot exceed 50 characters'),
  maritalStatus: z.enum(['Single', 'Married', 'Divorced', 'Widowed']),
  occupation: z
    .string()
    .min(2, 'Occupation is required')
    .max(100, 'Occupation cannot exceed 100 characters'),
  email: emailSchema,
  phoneNumber: phoneSchema,
  address: z.object({
    street: z
      .string()
      .min(5, 'Street address must be at least 5 characters')
      .max(200, 'Street address cannot exceed 200 characters'),
    city: z
      .string()
      .min(2, 'City is required')
      .max(100, 'City cannot exceed 100 characters'),
    state: z
      .string()
      .min(2, 'State is required')
      .max(100, 'State cannot exceed 100 characters'),
    postalCode: z
      .string()
      .min(3, 'Postal code must be at least 3 characters')
      .max(20, 'Postal code cannot exceed 20 characters'),
    country: z
      .string()
      .min(2, 'Country is required')
      .max(100, 'Country cannot exceed 100 characters'),
  }),
});

export const visaTravelInfoSchema = z.object({
  purposeOfVisit: z
    .string()
    .min(2, 'Purpose of visit is required')
    .max(200, 'Purpose of visit cannot exceed 200 characters'),
  intendedDateOfEntry: futureDateSchema,
  intendedDateOfExit: futureDateSchema,
  accommodationDetails: z
    .string()
    .min(10, 'Accommodation details must be at least 10 characters')
    .max(500, 'Accommodation details cannot exceed 500 characters'),
  previousVisits: z.boolean(),
  previousVisitDetails: z
    .string()
    .max(500, 'Previous visit details cannot exceed 500 characters')
    .optional(),
}).refine((data) => {
  // Exit date must be after entry date
  const entryDate = new Date(data.intendedDateOfEntry);
  const exitDate = new Date(data.intendedDateOfExit);
  return exitDate > entryDate;
}, {
  message: 'Exit date must be after entry date',
  path: ['intendedDateOfExit'],
}).refine((data) => {
  // Previous visit details required if previousVisits is true
  if (data.previousVisits && !data.previousVisitDetails?.trim()) {
    return false;
  }
  return true;
}, {
  message: 'Previous visit details are required when you have visited before',
  path: ['previousVisitDetails'],
});

export const visaPassportInfoSchema = z.object({
  passportNumber: z
    .string()
    .min(6, 'Passport number must be at least 6 characters')
    .max(20, 'Passport number cannot exceed 20 characters'),
  issueDate: dateSchema.refine((date) => {
    const issueDate = new Date(date);
    const today = new Date();
    return issueDate <= today;
  }, 'Issue date cannot be in the future'),
  expiryDate: dateSchema.refine((date) => {
    const expiryDate = new Date(date);
    const today = new Date();
    return expiryDate > today;
  }, 'Passport must be valid (not expired)'),
  placeOfIssue: z
    .string()
    .min(2, 'Place of issue is required')
    .max(100, 'Place of issue cannot exceed 100 characters'),
}).refine((data) => {
  // Expiry date must be at least 6 months after issue date
  const issueDate = new Date(data.issueDate);
  const expiryDate = new Date(data.expiryDate);
  const sixMonthsAfterIssue = new Date(issueDate);
  sixMonthsAfterIssue.setMonth(sixMonthsAfterIssue.getMonth() + 6);
  return expiryDate >= sixMonthsAfterIssue;
}, {
  message: 'Passport expiry date must be at least 6 months after issue date',
  path: ['expiryDate'],
});

export const visaApplicationSchema = z.object({
  basicInfo: visaBasicInfoSchema,
  personalInfo: visaPersonalInfoSchema,
  travelInfo: visaTravelInfoSchema,
  passportInfo: visaPassportInfoSchema,
  referralCode: z
    .string()
    .min(3, 'Referral code must be at least 3 characters')
    .max(50, 'Referral code cannot exceed 50 characters')
    .trim()
    .toUpperCase()
    .optional(),
});

// Travel Insurance Schemas
export const insuranceQuoteSchema = z.object({
  tripType: z.enum(['single', 'annual', 'family']),
  destination: z
    .string()
    .min(2, 'Destination is required')
    .max(100, 'Destination cannot exceed 100 characters'),
  departureDate: futureDateSchema,
  returnDate: futureDateSchema,
  travelers: z.array(z.object({
    age: z.number().int().min(0, 'Age cannot be negative').max(120, 'Age cannot exceed 120'),
    preExistingConditions: z.boolean(),
  })).min(1, 'At least one traveler is required').max(20, 'Maximum 20 travelers allowed'),
  coverageType: z.enum(['basic', 'comprehensive', 'premium']),
}).refine((data) => {
  // Return date must be after departure date
  const departureDate = new Date(data.departureDate);
  const returnDate = new Date(data.returnDate);
  return returnDate > departureDate;
}, {
  message: 'Return date must be after departure date',
  path: ['returnDate'],
});

export const insurancePurchaseSchema = z.object({
  quoteId: z.string().min(1, 'Quote ID is required'),
  planId: z.string().min(1, 'Plan ID is required'),
  customerDetails: z.object({
    firstName: nameSchema,
    lastName: nameSchema,
    email: emailSchema,
    phoneNumber: phoneSchema,
    dateOfBirth: dateSchema,
    address: z.object({
      street: z.string().min(5, 'Street address is required'),
      city: z.string().min(2, 'City is required'),
      state: z.string().min(2, 'State is required'),
      postalCode: z.string().min(3, 'Postal code is required'),
      country: z.string().min(2, 'Country is required'),
    }),
  }),
  emergencyContact: z.object({
    name: nameSchema,
    relationship: z
      .string()
      .min(2, 'Relationship is required')
      .max(50, 'Relationship cannot exceed 50 characters'),
    phoneNumber: phoneSchema,
  }),
  referralCode: z
    .string()
    .min(3, 'Referral code must be at least 3 characters')
    .max(50, 'Referral code cannot exceed 50 characters')
    .trim()
    .toUpperCase()
    .optional(),
});

// Hotel Booking Schemas
export const hotelSearchSchema = z.object({
  destination: z
    .string()
    .min(2, 'Destination is required')
    .max(100, 'Destination cannot exceed 100 characters'),
  checkInDate: futureDateSchema,
  checkOutDate: futureDateSchema,
  rooms: z.array(z.object({
    adults: z.number().int().min(1, 'At least 1 adult per room').max(10, 'Maximum 10 adults per room'),
    children: z.number().int().min(0, 'Children count cannot be negative').max(8, 'Maximum 8 children per room'),
    childrenAges: z.array(z.number().int().min(0).max(17)).optional(),
  })).min(1, 'At least one room is required').max(10, 'Maximum 10 rooms allowed'),
  currency: z.string().regex(currencyCodeRegex, 'Invalid currency code').default('NGN'),
}).refine((data) => {
  // Check-out date must be after check-in date
  const checkInDate = new Date(data.checkInDate);
  const checkOutDate = new Date(data.checkOutDate);
  return checkOutDate > checkInDate;
}, {
  message: 'Check-out date must be after check-in date',
  path: ['checkOutDate'],
}).refine((data) => {
  // Validate children ages if provided
  return data.rooms.every(room => {
    if (room.childrenAges) {
      return room.childrenAges.length === room.children;
    }
    return true;
  });
}, {
  message: 'Number of children ages must match number of children',
  path: ['rooms'],
});

export const hotelBookingSchema = z.object({
  hotelId: z.string().min(1, 'Hotel ID is required'),
  roomId: z.string().min(1, 'Room ID is required'),
  checkInDate: futureDateSchema,
  checkOutDate: futureDateSchema,
  guests: z.array(z.object({
    firstName: nameSchema,
    lastName: nameSchema,
    email: emailSchema,
    phoneNumber: phoneSchema,
  })).min(1, 'At least one guest is required'),
  specialRequests: z
    .string()
    .max(1000, 'Special requests cannot exceed 1000 characters')
    .optional(),
  referralCode: z
    .string()
    .min(3, 'Referral code must be at least 3 characters')
    .max(50, 'Referral code cannot exceed 50 characters')
    .trim()
    .toUpperCase()
    .optional(),
}).refine((data) => {
  // Check-out date must be after check-in date
  const checkInDate = new Date(data.checkInDate);
  const checkOutDate = new Date(data.checkOutDate);
  return checkOutDate > checkInDate;
}, {
  message: 'Check-out date must be after check-in date',
  path: ['checkOutDate'],
});

// Package Booking Schemas
export const packageFiltersSchema = z.object({
  destination: z.string().optional(),
  category: z.string().optional(),
  duration: z.object({
    min: z.number().int().min(1).optional(),
    max: z.number().int().min(1).optional(),
  }).optional(),
  price: z.object({
    min: z.number().min(0).optional(),
    max: z.number().min(0).optional(),
  }).optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
});

export const packagePurchaseSchema = z.object({
  packageId: z.string().regex(mongoIdRegex, 'Invalid package ID format'),
  selectedDate: futureDateSchema,
  participants: z.array(z.object({
    type: z.enum(['adult', 'child']),
    firstName: nameSchema,
    lastName: nameSchema,
    dateOfBirth: dateSchema,
    passportNumber: z
      .string()
      .min(6, 'Passport number must be at least 6 characters')
      .max(20, 'Passport number cannot exceed 20 characters')
      .optional(),
    dietaryRequirements: z
      .string()
      .max(200, 'Dietary requirements cannot exceed 200 characters')
      .optional(),
  })).min(1, 'At least one participant is required').max(50, 'Maximum 50 participants allowed'),
  specialRequests: z
    .string()
    .max(1000, 'Special requests cannot exceed 1000 characters')
    .optional(),
  referralCode: z
    .string()
    .min(3, 'Referral code must be at least 3 characters')
    .max(50, 'Referral code cannot exceed 50 characters')
    .trim()
    .toUpperCase()
    .optional(),
});

// Payment Verification Schema
export const paymentVerificationSchema = z.object({
  reference: z.string().min(1, 'Payment reference is required'),
});

// File Upload Schema
export const fileUploadSchema = z.object({
  file: z.instanceof(File, { message: 'File is required' }),
  documentType: z.enum([
    'International Passport',
    'Passport Photograph',
    'Bank Statement',
    'Flight Itinerary',
    'Hotel Booking',
    'Invitation Letter',
    'Other'
  ]),
}).refine((data) => {
  // File size validation (10MB max)
  const maxSize = 10 * 1024 * 1024; // 10MB
  return data.file.size <= maxSize;
}, {
  message: 'File size cannot exceed 10MB',
  path: ['file'],
}).refine((data) => {
  // File type validation
  const allowedTypes = [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif'
  ];
  return allowedTypes.includes(data.file.type);
}, {
  message: 'File must be PDF, JPEG, JPG, PNG, or GIF',
  path: ['file'],
});

// Guest Checkout Schema
export const guestCheckoutSchema = z.object({
  email: emailSchema.optional(),
  phoneNumber: phoneSchema.optional(),
}).refine(data => data.email || data.phoneNumber, {
  message: "Either email or phone number is required for guest checkout",
  path: ["emailOrPhone"],
});

// Export validation error type
export type ValidationErrors = Record<string, string[]>;

// Utility function to extract validation errors from Zod error
export const extractValidationErrors = (error: z.ZodError): ValidationErrors => {
  const errors: ValidationErrors = {};
  
  error.issues.forEach((err: any) => {
    const path = err.path.join('.');
    if (!errors[path]) {
      errors[path] = [];
    }
    errors[path].push(err.message);
  });
  
  return errors;
};

// Utility function to validate form data
export const validateFormData = <T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean;
  data?: T;
  errors?: ValidationErrors;
} => {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: extractValidationErrors(error) };
    }
    return { success: false, errors: { general: ['Validation failed'] } };
  }
};