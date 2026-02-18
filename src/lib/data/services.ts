import { ServiceFeature } from '@/types';

export const serviceFeatures: ServiceFeature[] = [
  {
    id: 'flight-booking',
    title: 'Flight Booking',
    description: 'Find and book the best flights at competitive prices with our extensive airline partnerships and smart search technology.',
    icon: 'flight',
    benefits: [
      'Compare prices from 500+ airlines',
      'Flexible date search options',
      '24/7 customer support',
      'Instant booking confirmation',
      'Mobile boarding passes',
      'Free cancellation on select flights'
    ]
  },
  {
    id: 'hotel-reservations',
    title: 'Hotel Reservations',
    description: 'Discover and book accommodations worldwide, from luxury resorts to budget-friendly stays, all with verified reviews.',
    icon: 'hotel',
    benefits: [
      'Over 1 million properties worldwide',
      'Verified guest reviews and ratings',
      'Best price guarantee',
      'Free cancellation on most bookings',
      'Instant confirmation',
      'Special member discounts'
    ]
  },
  {
    id: 'car-rental',
    title: 'Car Rental',
    description: 'Rent vehicles from trusted providers at your destination with flexible pickup locations and comprehensive insurance options.',
    icon: 'car',
    benefits: [
      'Wide selection of vehicle types',
      'Competitive rental rates',
      'Flexible pickup and drop-off',
      'Comprehensive insurance coverage',
      'GPS navigation included',
      'No hidden fees policy'
    ]
  },
  {
    id: 'visa-assistance',
    title: 'Visa Assistance',
    description: 'Simplify your visa application process with our expert guidance and document preparation services for hassle-free travel.',
    icon: 'visa',
    benefits: [
      'Expert visa consultation',
      'Document preparation assistance',
      'Application status tracking',
      'Fast-track processing options',
      'Success rate guarantee',
      'Multi-country visa support'
    ]
  },
  {
    id: 'travel-insurance',
    title: 'Travel Insurance',
    description: 'Protect your journey with comprehensive travel insurance covering medical emergencies, trip cancellations, and more.',
    icon: 'insurance',
    benefits: [
      'Medical emergency coverage',
      'Trip cancellation protection',
      'Lost luggage compensation',
      'Flight delay coverage',
      '24/7 emergency assistance',
      'Worldwide coverage options'
    ]
  },
  {
    id: 'tour-packages',
    title: 'Tour Packages',
    description: 'Explore curated travel experiences with our expertly designed tour packages featuring local guides and unique activities.',
    icon: 'tour',
    benefits: [
      'Expertly curated itineraries',
      'Local professional guides',
      'Small group experiences',
      'Cultural immersion activities',
      'All-inclusive pricing',
      'Customizable packages'
    ]
  }
];

export const mainServices: ServiceFeature[] = [
  {
    id: 'best-flights',
    title: 'Best Flight Prices',
    description: 'We offer the best flight prices with our advanced search technology and extensive airline partnerships.',
    icon: 'flight-ticket',
    benefits: [
      'Price comparison across airlines',
      'Flexible booking options',
      'Instant confirmation',
      'Customer support'
    ]
  },
  {
    id: 'trusted-hotels',
    title: 'Trusted Hotel Partners',
    description: 'Book with confidence through our network of verified hotel partners offering quality accommodations.',
    icon: 'hotel-services',
    benefits: [
      'Verified accommodations',
      'Best rate guarantee',
      'Quality assurance',
      'Secure booking'
    ]
  },
  {
    id: 'easy-booking',
    title: 'Easy Booking Process',
    description: 'Our streamlined booking process makes planning your trip simple, fast, and hassle-free.',
    icon: 'services-tag',
    benefits: [
      'User-friendly interface',
      'Quick booking process',
      'Multiple payment options',
      'Instant confirmations'
    ]
  }
];

export const getServiceById = (id: string): ServiceFeature | undefined => {
  return serviceFeatures.find(service => service.id === id);
};

export const getMainServices = (): ServiceFeature[] => {
  return mainServices;
};

export const getAllServices = (): ServiceFeature[] => {
  return serviceFeatures;
};