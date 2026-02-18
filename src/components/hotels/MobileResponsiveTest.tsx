'use client';

import { useState } from 'react';
import { HotelSearchForm, HotelCard, FilterBar, HotelGallery, GuestInformationForm, PaymentMethodSelector, BookingSummary } from '@/components/hotels';
import { SearchCriteria, FilterOptions, Hotel, Guest, PaymentMethod } from '@/types/hotels';

// Test component to verify mobile responsiveness
export default function MobileResponsiveTest() {
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({});
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('paystack');

  // Sample data for testing
  const sampleHotel: Hotel = {
    id: 'test-hotel',
    name: 'Test Hotel for Mobile Responsiveness',
    location: {
      address: '123 Test Street',
      city: 'Test City',
      country: 'Test Country'
    },
    images: ['/images/hotels/hotel-1.jpg', '/images/hotels/hotel-2.jpg'],
    description: 'This is a test hotel to verify mobile responsiveness across all components.',
    amenities: [
      { id: 'wifi', name: 'Free WiFi', icon: '/images/amenities/wifi.svg', category: 'connectivity' },
      { id: 'pool', name: 'Swimming Pool', icon: '/images/amenities/pool.svg', category: 'wellness' }
    ],
    pricePerNight: 150,
    classification: 'Luxury Hotel',
    bedTypes: ['King', 'Queen']
  };

  const sampleGuests: Guest[] = [
    {
      type: 'Adult',
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: new Date('1990-01-01'),
      email: 'john@example.com',
      phoneNumber: '+1234567890'
    }
  ];

  const sampleGalleryImages = {
    main: '/images/hotels/hotel-1.jpg',
    thumbnails: ['/images/hotels/hotel-2.jpg', '/images/hotels/hotel-3.jpg']
  };

  const handleSearch = (criteria: SearchCriteria) => {
    setSearchCriteria(criteria);
  };

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const handleBookNow = (hotelId: string) => {
    console.log('Book now clicked for hotel:', hotelId);
  };

  const handleGuestUpdate = (guestIndex: number, guestData: Guest) => {
    console.log('Guest updated:', guestIndex, guestData);
  };

  const handleGuestSubmit = (allGuests: Guest[]) => {
    console.log('All guests submitted:', allGuests);
  };

  const handlePaymentMethodChange = (method: PaymentMethod) => {
    setSelectedPaymentMethod(method);
  };

  return (
    <div className="mobile-responsive-test p-4 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Mobile Responsiveness Test
        </h1>
        <p className="text-gray-600">
          Test all hotel components on different screen sizes
        </p>
      </div>

      {/* Hotel Search Form Test */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Hotel Search Form</h2>
        <HotelSearchForm onSearch={handleSearch} />
      </section>

      {/* Filter Bar Test */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Filter Bar</h2>
        <FilterBar filters={filters} onFilterChange={handleFilterChange} />
      </section>

      {/* Hotel Card Test */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Hotel Card</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <HotelCard
            hotel={{
              id: sampleHotel.id,
              name: sampleHotel.name,
              location: `${sampleHotel.location.city}, ${sampleHotel.location.country}`,
              city: sampleHotel.location.city,
              country: sampleHotel.location.country,
              image: sampleHotel.images[0],
              gallery: sampleHotel.images,
              rating: 4.5,
              reviewCount: 0,
              price: sampleHotel.pricePerNight,
              currency: 'USD',
              amenities: sampleHotel.amenities?.map(a => a.name) || [],
              description: sampleHotel.description,
              coordinates: { lat: 0, lng: 0 }
            }}
            onClick={() => handleBookNow(sampleHotel.id)}
          />
          <HotelCard
            hotel={{
              id: "hotel-2",
              name: "Another Test Hotel",
              location: "Another City, Another Country",
              city: "Another City",
              country: "Another Country",
              image: "/images/hotels/hotel-2.jpg",
              gallery: ["/images/hotels/hotel-2.jpg"],
              rating: 4.0,
              reviewCount: 0,
              price: 200,
              currency: 'USD',
              amenities: [],
              description: "Another test hotel for grid layout testing.",
              coordinates: { lat: 0, lng: 0 }
            }}
            onClick={() => handleBookNow("hotel-2")}
          />
        </div>
      </section>

      {/* Hotel Gallery Test */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Hotel Gallery</h2>
        <HotelGallery images={sampleGalleryImages} hotelName={sampleHotel.name} />
      </section>

      {/* Payment Method Selector Test */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Payment Method Selector</h2>
        <PaymentMethodSelector
          selectedMethod={selectedPaymentMethod}
          onMethodChange={handlePaymentMethodChange}
        />
      </section>

      {/* Guest Information Form Test */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Guest Information Form</h2>
        <GuestInformationForm
          guests={sampleGuests}
          onGuestUpdate={handleGuestUpdate}
          onSubmit={handleGuestSubmit}
        />
      </section>

      {/* Booking Summary Test */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Booking Summary</h2>
        <div className="max-w-md">
          <BookingSummary
            hotel={sampleHotel}
            dates={{
              checkIn: new Date('2024-12-15'),
              checkOut: new Date('2024-12-18'),
              nights: 3
            }}
            guests={sampleGuests}
            pricing={{
              subtotal: 450,
              taxes: 67.50,
              total: 517.50
            }}
          />
        </div>
      </section>

      {/* Responsive Breakpoint Indicators */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Responsive Breakpoint Indicators</h2>
        <div className="grid grid-cols-1 gap-4">
          <div className="p-4 bg-red-100 rounded-lg block sm:hidden">
            <strong>Mobile (&lt; 640px)</strong> - You are viewing on a mobile device
          </div>
          <div className="p-4 bg-yellow-100 rounded-lg hidden sm:block md:hidden">
            <strong>Small (640px - 768px)</strong> - You are viewing on a small tablet
          </div>
          <div className="p-4 bg-green-100 rounded-lg hidden md:block lg:hidden">
            <strong>Medium (768px - 1024px)</strong> - You are viewing on a tablet
          </div>
          <div className="p-4 bg-blue-100 rounded-lg hidden lg:block xl:hidden">
            <strong>Large (1024px - 1280px)</strong> - You are viewing on a small desktop
          </div>
          <div className="p-4 bg-purple-100 rounded-lg hidden xl:block">
            <strong>Extra Large (&gt; 1280px)</strong> - You are viewing on a large desktop
          </div>
        </div>
      </section>
    </div>
  );
}