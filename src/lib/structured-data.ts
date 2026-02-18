import { Destination, Hotel } from '@/types';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://travelplace.com';

export function generateDestinationStructuredData(destination: Destination) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TouristDestination',
    name: destination.name,
    description: destination.description,
    image: destination.image,
    geo: {
      '@type': 'GeoCoordinates',
      latitude: destination.coordinates.lat,
      longitude: destination.coordinates.lng,
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: destination.country,
      addressLocality: destination.name,
    },
    touristType: 'leisure',
    includesAttraction: destination.highlights.map((highlight) => ({
      '@type': 'TouristAttraction',
      name: highlight,
    })),
    offers: {
      '@type': 'Offer',
      price: destination.price,
      priceCurrency: destination.currency,
      availability: 'https://schema.org/InStock',
      validFrom: new Date().toISOString(),
      url: `${siteUrl}/destinations/${destination.id}`,
    },
  };
}

export function generateHotelStructuredData(hotel: Hotel) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Hotel',
    name: hotel.name,
    description: hotel.description,
    image: hotel.image,
    address: {
      '@type': 'PostalAddress',
      streetAddress: hotel.location,
      addressLocality: hotel.city,
      addressCountry: hotel.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: hotel.coordinates.lat,
      longitude: hotel.coordinates.lng,
    },
    starRating: {
      '@type': 'Rating',
      ratingValue: hotel.rating,
      bestRating: 5,
      worstRating: 1,
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: hotel.rating,
      reviewCount: hotel.reviewCount,
      bestRating: 5,
      worstRating: 1,
    },
    amenityFeature: hotel.amenities.map((amenity) => ({
      '@type': 'LocationFeatureSpecification',
      name: amenity,
    })),
    priceRange: `$${hotel.price}`,
    currenciesAccepted: hotel.currency,
    paymentAccepted: ['Cash', 'Credit Card'],
    offers: {
      '@type': 'Offer',
      price: hotel.price,
      priceCurrency: hotel.currency,
      availability: 'https://schema.org/InStock',
      validFrom: new Date().toISOString(),
      url: `${siteUrl}/hotels/${hotel.id}`,
    },
  };
}

export function generateBreadcrumbStructuredData(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateFAQStructuredData(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function generateServiceStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Travel Planning',
    provider: {
      '@type': 'TravelAgency',
      name: 'The Travel Place',
      url: siteUrl,
    },
    areaServed: 'Worldwide',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Travel Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Flight Booking',
            description: 'Book domestic and international flights',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Hotel Reservations',
            description: 'Reserve accommodations worldwide',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Car Rental',
            description: 'Rent vehicles for your travel needs',
          },
        },
        {
          '@type': 'Service',
          name: 'Visa Processing',
          description: 'Assistance with travel visa applications',
        },
      ],
    },
  };
}