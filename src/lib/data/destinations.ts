import { Destination } from '@/types';

export const popularDestinations: Destination[] = [
  {
    id: 'japan-tokyo',
    name: 'Tokyo',
    country: 'Japan',
    continent: 'Asia',
    image: '/images/japan-destination.png',
    price: 1299,
    currency: 'USD',
    duration: '7 days',
    description: 'Experience the perfect blend of traditional culture and modern innovation in Japan\'s bustling capital city.',
    highlights: [
      'Visit iconic temples and shrines',
      'Experience world-class cuisine',
      'Explore vibrant neighborhoods like Shibuya and Harajuku',
      'Witness cherry blossoms in spring',
      'Discover cutting-edge technology and pop culture'
    ],
    bestTimeToVisit: 'March to May, September to November',
    coordinates: {
      lat: 35.6762,
      lng: 139.6503
    }
  },
  {
    id: 'australia-sydney',
    name: 'Sydney',
    country: 'Australia',
    continent: 'Oceania',
    image: '/images/australia-destination.png',
    price: 1599,
    currency: 'USD',
    duration: '10 days',
    description: 'Discover Australia\'s iconic harbor city with its stunning beaches, world-famous landmarks, and vibrant culture.',
    highlights: [
      'Visit the Sydney Opera House and Harbour Bridge',
      'Relax at Bondi and Manly beaches',
      'Explore the historic Rocks district',
      'Take a ferry across Sydney Harbour',
      'Experience diverse dining and nightlife'
    ],
    bestTimeToVisit: 'September to November, March to May',
    coordinates: {
      lat: -33.8688,
      lng: 151.2093
    }
  },
  {
    id: 'portugal-lisbon',
    name: 'Lisbon',
    country: 'Portugal',
    continent: 'Europe',
    image: '/images/portugal-destination.png',
    price: 899,
    currency: 'USD',
    duration: '6 days',
    description: 'Explore Portugal\'s charming capital with its colorful neighborhoods, historic trams, and delicious cuisine.',
    highlights: [
      'Ride the iconic Tram 28',
      'Explore the historic Alfama district',
      'Visit Belém Tower and Jerónimos Monastery',
      'Enjoy fresh seafood and pastéis de nata',
      'Experience vibrant Fado music'
    ],
    bestTimeToVisit: 'April to October',
    coordinates: {
      lat: 38.7223,
      lng: -9.1393
    }
  },
  {
    id: 'peru-machu-picchu',
    name: 'Machu Picchu',
    country: 'Peru',
    continent: 'South America',
    image: '/images/peru-destination.png',
    price: 1199,
    currency: 'USD',
    duration: '8 days',
    description: 'Journey to the ancient Incan citadel high in the Andes Mountains for an unforgettable adventure.',
    highlights: [
      'Explore the mysterious Machu Picchu ruins',
      'Hike the famous Inca Trail',
      'Visit the Sacred Valley',
      'Experience local Quechua culture',
      'Discover Cusco\'s colonial architecture'
    ],
    bestTimeToVisit: 'May to September',
    coordinates: {
      lat: -13.1631,
      lng: -72.5450
    }
  },
  {
    id: 'iceland-reykjavik',
    name: 'Reykjavik',
    country: 'Iceland',
    continent: 'Europe',
    image: '/images/iceland-destination.jpg',
    price: 1399,
    currency: 'USD',
    duration: '7 days',
    description: 'Experience the land of fire and ice with stunning natural wonders, geothermal spas, and Northern Lights.',
    highlights: [
      'Witness the Northern Lights',
      'Relax in the Blue Lagoon',
      'Explore the Golden Circle route',
      'See powerful waterfalls like Gullfoss',
      'Experience unique Nordic culture'
    ],
    bestTimeToVisit: 'June to August, September to March for Northern Lights',
    coordinates: {
      lat: 64.1466,
      lng: -21.9426
    }
  },
  {
    id: 'thailand-bangkok',
    name: 'Bangkok',
    country: 'Thailand',
    continent: 'Asia',
    image: '/images/thailand-destination.jpg',
    price: 799,
    currency: 'USD',
    duration: '9 days',
    description: 'Immerse yourself in Thailand\'s vibrant capital with its ornate temples, bustling markets, and incredible street food.',
    highlights: [
      'Visit the Grand Palace and Wat Pho',
      'Explore floating markets',
      'Experience world-renowned street food',
      'Take a longtail boat through canals',
      'Shop at Chatuchak Weekend Market'
    ],
    bestTimeToVisit: 'November to March',
    coordinates: {
      lat: 13.7563,
      lng: 100.5018
    }
  },
  {
    id: 'morocco-marrakech',
    name: 'Marrakech',
    country: 'Morocco',
    continent: 'Africa',
    image: '/images/morocco-destination.jpg',
    price: 999,
    currency: 'USD',
    duration: '6 days',
    description: 'Discover the magic of Morocco in this imperial city with its vibrant souks, stunning architecture, and rich culture.',
    highlights: [
      'Explore the bustling Jemaa el-Fnaa square',
      'Wander through colorful souks',
      'Visit the beautiful Bahia Palace',
      'Experience traditional hammam spas',
      'Take a day trip to the Atlas Mountains'
    ],
    bestTimeToVisit: 'March to May, September to November',
    coordinates: {
      lat: 31.6295,
      lng: -7.9811
    }
  },
  {
    id: 'greece-santorini',
    name: 'Santorini',
    country: 'Greece',
    continent: 'Europe',
    image: '/images/greece-destination.jpg',
    price: 1199,
    currency: 'USD',
    duration: '5 days',
    description: 'Experience the breathtaking beauty of this Greek island with its iconic white-washed buildings and stunning sunsets.',
    highlights: [
      'Watch spectacular sunsets in Oia',
      'Explore volcanic beaches',
      'Visit ancient Akrotiri ruins',
      'Taste exceptional local wines',
      'Enjoy traditional Greek cuisine'
    ],
    bestTimeToVisit: 'April to October',
    coordinates: {
      lat: 36.3932,
      lng: 25.4615
    }
  },
  {
    id: 'norway-bergen',
    name: 'Bergen',
    country: 'Norway',
    continent: 'Europe',
    image: '/images/norway-destination.jpg',
    price: 1699,
    currency: 'USD',
    duration: '8 days',
    description: 'Gateway to the Norwegian fjords, Bergen offers stunning natural beauty and rich maritime heritage.',
    highlights: [
      'Explore colorful Bryggen wharf',
      'Take scenic fjord cruises',
      'Ride the Fløibanen funicular',
      'Visit traditional stave churches',
      'Experience the midnight sun'
    ],
    bestTimeToVisit: 'May to September',
    coordinates: {
      lat: 60.3913,
      lng: 5.3221
    }
  },
  {
    id: 'vietnam-hanoi',
    name: 'Hanoi',
    country: 'Vietnam',
    continent: 'Asia',
    image: '/images/vietnam-destination.jpg',
    price: 699,
    currency: 'USD',
    duration: '7 days',
    description: 'Vietnam\'s capital city offers a perfect blend of ancient traditions and French colonial charm.',
    highlights: [
      'Explore the historic Old Quarter',
      'Visit the Temple of Literature',
      'Take a cruise in Halong Bay',
      'Experience vibrant street food culture',
      'Learn about Vietnamese history'
    ],
    bestTimeToVisit: 'October to December, March to April',
    coordinates: {
      lat: 21.0285,
      lng: 105.8542
    }
  },
  {
    id: 'chile-patagonia',
    name: 'Patagonia',
    country: 'Chile',
    continent: 'South America',
    image: '/images/chile-destination.jpg',
    price: 1899,
    currency: 'USD',
    duration: '12 days',
    description: 'Explore one of the world\'s last great wilderness areas with dramatic landscapes and incredible wildlife.',
    highlights: [
      'Trek in Torres del Paine National Park',
      'See glaciers and icebergs',
      'Spot penguins and whales',
      'Experience gaucho culture',
      'Witness stunning mountain vistas'
    ],
    bestTimeToVisit: 'November to March',
    coordinates: {
      lat: -50.9423,
      lng: -73.4068
    }
  },
  {
    id: 'indonesia-labuan-bajo',
    name: 'Labuan Bajo',
    country: 'Indonesia',
    continent: 'Asia',
    image: '/images/labuan-bajo-image.png',
    price: 899,
    currency: 'USD',
    duration: '6 days',
    description: 'Gateway to Komodo National Park, offering incredible diving, pristine beaches, and unique wildlife encounters.',
    highlights: [
      'See Komodo dragons in their natural habitat',
      'Dive in world-class coral reefs',
      'Visit Pink Beach',
      'Explore traditional fishing villages',
      'Enjoy stunning sunset views'
    ],
    bestTimeToVisit: 'April to December',
    coordinates: {
      lat: -8.4967,
      lng: 119.8881
    }
  }
];

export const getDestinationById = (id: string): Destination | undefined => {
  return popularDestinations.find(destination => destination.id === id);
};

export const getDestinationsByContinent = (continent: string): Destination[] => {
  return popularDestinations.filter(destination => destination.continent === continent);
};

export const getFeaturedDestinations = (count: number = 8): Destination[] => {
  return popularDestinations.slice(0, count);
};