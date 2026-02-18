import { Hotel } from '@/types';

export const featuredHotels: Hotel[] = [
  {
    id: 'le-pirate-hotel-labuan-bajo',
    name: 'Le Pirate Hotel',
    location: 'Labuan Bajo',
    city: 'Labuan Bajo',
    country: 'Indonesia',
    image: '/images/le-pirate-hotel-image.png',
    gallery: [
      '/images/hotel-1.png',
      '/images/hotel-2.png',
      '/images/hotel-3.png'
    ],
    rating: 4.8,
    reviewCount: 324,
    price: 89,
    currency: 'USD',
    amenities: [
      'Ocean View',
      'Free WiFi',
      'Swimming Pool',
      'Restaurant',
      'Spa Services',
      'Diving Center',
      'Airport Transfer',
      'Tour Desk'
    ],
    description: 'A charming boutique hotel overlooking the stunning waters of Labuan Bajo, perfect for exploring Komodo National Park.',
    coordinates: {
      lat: -8.4967,
      lng: 119.8881
    }
  },
  {
    id: 'grand-palace-bangkok',
    name: 'The Grand Palace Hotel',
    location: 'Bangkok City Center',
    city: 'Bangkok',
    country: 'Thailand',
    image: '/images/hotel-2.png',
    gallery: [
      '/images/hotel-2.png',
      '/images/hotel-3.png',
      '/images/hotel-4.png'
    ],
    rating: 4.9,
    reviewCount: 567,
    price: 156,
    currency: 'USD',
    amenities: [
      'City View',
      'Free WiFi',
      'Fitness Center',
      'Rooftop Pool',
      'Multiple Restaurants',
      'Spa & Wellness',
      'Business Center',
      'Concierge Service'
    ],
    description: 'Luxury accommodation in the heart of Bangkok, offering easy access to temples, markets, and cultural attractions.',
    coordinates: {
      lat: 13.7563,
      lng: 100.5018
    }
  },
  {
    id: 'santorini-sunset-villa',
    name: 'Santorini Sunset Villa',
    location: 'Oia',
    city: 'Santorini',
    country: 'Greece',
    image: '/images/hotel-3.png',
    gallery: [
      '/images/hotel-3.png',
      '/images/hotel-4.png',
      '/images/hotel-5.png'
    ],
    rating: 4.7,
    reviewCount: 289,
    price: 245,
    currency: 'USD',
    amenities: [
      'Sunset View',
      'Private Terrace',
      'Infinity Pool',
      'Free WiFi',
      'Breakfast Included',
      'Wine Tasting',
      'Airport Transfer',
      'Romantic Setting'
    ],
    description: 'Experience breathtaking sunsets from this exclusive villa perched on the cliffs of Oia, Santorini.',
    coordinates: {
      lat: 36.4618,
      lng: 25.3753
    }
  },
  {
    id: 'tokyo-imperial-hotel',
    name: 'Tokyo Imperial Hotel',
    location: 'Ginza District',
    city: 'Tokyo',
    country: 'Japan',
    image: '/images/hotel-4.png',
    gallery: [
      '/images/hotel-4.png',
      '/images/hotel-5.png',
      '/images/hotel-6.png'
    ],
    rating: 4.6,
    reviewCount: 892,
    price: 198,
    currency: 'USD',
    amenities: [
      'Garden View',
      'Traditional Design',
      'Multiple Restaurants',
      'Tea Ceremony',
      'Fitness Center',
      'Business Facilities',
      'Concierge Service',
      'Cultural Activities'
    ],
    description: 'A blend of traditional Japanese hospitality and modern luxury in Tokyo\'s prestigious Ginza district.',
    coordinates: {
      lat: 35.6762,
      lng: 139.6503
    }
  },
  {
    id: 'sydney-harbour-resort',
    name: 'Sydney Harbour Resort',
    location: 'Circular Quay',
    city: 'Sydney',
    country: 'Australia',
    image: '/images/hotel-5.png',
    gallery: [
      '/images/hotel-5.png',
      '/images/hotel-6.png',
      '/images/hotel-1.png'
    ],
    rating: 4.8,
    reviewCount: 445,
    price: 189,
    currency: 'USD',
    amenities: [
      'Harbour View',
      'Opera House View',
      'Rooftop Bar',
      'Swimming Pool',
      'Fine Dining',
      'Spa Services',
      'Fitness Center',
      'Prime Location'
    ],
    description: 'Unparalleled views of Sydney Harbour and Opera House from this premium waterfront resort.',
    coordinates: {
      lat: -33.8688,
      lng: 151.2093
    }
  },
  {
    id: 'lisbon-heritage-hotel',
    name: 'Lisbon Heritage Hotel',
    location: 'Alfama District',
    city: 'Lisbon',
    country: 'Portugal',
    image: '/images/hotel-6.png',
    gallery: [
      '/images/hotel-6.png',
      '/images/hotel-1.png',
      '/images/hotel-2.png'
    ],
    rating: 4.5,
    reviewCount: 356,
    price: 134,
    currency: 'USD',
    amenities: [
      'Historic Building',
      'City View',
      'Free WiFi',
      'Traditional Restaurant',
      'Fado Performances',
      'Rooftop Terrace',
      'Cultural Tours',
      'Wine Cellar'
    ],
    description: 'Stay in a beautifully restored historic building in Lisbon\'s charming Alfama neighborhood.',
    coordinates: {
      lat: 38.7223,
      lng: -9.1393
    }
  },
  {
    id: 'reykjavik-northern-lights-lodge',
    name: 'Northern Lights Lodge',
    location: 'Reykjavik Outskirts',
    city: 'Reykjavik',
    country: 'Iceland',
    image: '/images/hotel-1.png',
    gallery: [
      '/images/hotel-1.png',
      '/images/hotel-2.png',
      '/images/hotel-3.png'
    ],
    rating: 4.9,
    reviewCount: 178,
    price: 267,
    currency: 'USD',
    amenities: [
      'Northern Lights View',
      'Glass Igloos',
      'Geothermal Spa',
      'Aurora Wake-up Service',
      'Nordic Cuisine',
      'Guided Tours',
      'Photography Workshops',
      'Cozy Fireplaces'
    ],
    description: 'Unique glass igloo accommodation designed for optimal Northern Lights viewing in Iceland\'s pristine wilderness.',
    coordinates: {
      lat: 64.1466,
      lng: -21.9426
    }
  },
  {
    id: 'marrakech-riad-palace',
    name: 'Marrakech Riad Palace',
    location: 'Medina',
    city: 'Marrakech',
    country: 'Morocco',
    image: '/images/hotel-2.png',
    gallery: [
      '/images/hotel-2.png',
      '/images/hotel-3.png',
      '/images/hotel-4.png'
    ],
    rating: 4.7,
    reviewCount: 423,
    price: 112,
    currency: 'USD',
    amenities: [
      'Traditional Architecture',
      'Courtyard Pool',
      'Hammam Spa',
      'Rooftop Terrace',
      'Moroccan Cuisine',
      'Cultural Experiences',
      'Souk Tours',
      'Cooking Classes'
    ],
    description: 'Authentic Moroccan hospitality in a beautifully restored traditional riad in the heart of Marrakech\'s medina.',
    coordinates: {
      lat: 31.6295,
      lng: -7.9811
    }
  }
];

export const getHotelById = (id: string): Hotel | undefined => {
  return featuredHotels.find(hotel => hotel.id === id);
};

export const getHotelsByCity = (city: string): Hotel[] => {
  return featuredHotels.filter(hotel => hotel.city.toLowerCase() === city.toLowerCase());
};

export const getHotelsByCountry = (country: string): Hotel[] => {
  return featuredHotels.filter(hotel => hotel.country.toLowerCase() === country.toLowerCase());
};

export const getFeaturedHotels = (count: number = 6): Hotel[] => {
  return featuredHotels.slice(0, count);
};

export const getHotelsByPriceRange = (minPrice: number, maxPrice: number): Hotel[] => {
  return featuredHotels.filter(hotel => hotel.price >= minPrice && hotel.price <= maxPrice);
};