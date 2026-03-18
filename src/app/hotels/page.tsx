'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import ServiceFooter from '@/components/layout/ServiceFooter';
import HotelSearchForm from '@/components/hotels/HotelSearchForm';
import FilterBar from '@/components/hotels/FilterBar';
import HotelCard from '@/components/hotels/HotelCard';
import { SearchCriteria, FilterOptions, Hotel } from '@/types/hotels';
import { SAMPLE_HOTELS, filterHotels } from '@/lib/hotels';
import { hotelService, HotelResult, HotelSearchCriteria } from '@/lib/services/hotel-service';
import { getUIIcon } from '@/lib/constants/icons';
import { NavigationHelper } from '@/lib/routing';
import { useNotifications } from '@/contexts/notification-context';

export default function HotelsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addNotification } = useNotifications();
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria | null>(null);
  const [initialSearchData, setInitialSearchData] = useState<SearchCriteria | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({});
  const [hotels, setHotels] = useState<HotelResult[]>([]);
  const [filteredHotels, setFilteredHotels] = useState<HotelResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasAutoSearched, setHasAutoSearched] = useState(false);

  // Parse URL parameters on component mount
  useEffect(() => {
    if (hasAutoSearched) return;

    const destination = searchParams.get('destination');
    const checkin = searchParams.get('checkin');
    const checkout = searchParams.get('checkout');
    const guests = searchParams.get('guests');

    if (destination && checkin && checkout) {
      // Parse destination - remove airport code if present
      const cleanDestination = destination.replace(/\([A-Z]{3}\)$/, '').trim();
      
      // Parse guests string like "1 room, 2 guests"
      let rooms = 1;
      let adults = 1;
      let children = 0;
      
      if (guests) {
        const roomMatch = guests.match(/(\d+)\s+room/);
        const guestMatch = guests.match(/(\d+)\s+guest/);
        
        if (roomMatch) rooms = parseInt(roomMatch[1]);
        if (guestMatch) {
          const totalGuests = parseInt(guestMatch[1]);
          adults = Math.max(1, totalGuests); // At least 1 adult
        }
      }

      const searchData: SearchCriteria = {
        location: cleanDestination,
        checkIn: new Date(checkin),
        checkOut: new Date(checkout),
        rooms,
        adults,
        children
      };

      setInitialSearchData(searchData);
      setHasAutoSearched(true);
      
      // Automatically trigger search after a short delay to ensure form is populated
      setTimeout(() => {
        handleSearch(searchData);
      }, 100);
    }
  }, [searchParams, hasAutoSearched]);

  // Filter hotels when filters change
  useEffect(() => {
    if (hotels.length > 0) {
      const convertedHotels = hotels.map(h => ({
        id: h.id,
        name: h.name,
        location: { address: h.address, city: h.address, country: '' },
        images: h.images,
        description: h.name,
        amenities: h.amenities.map(a => ({ id: a, name: a, icon: '', category: 'comfort' as const })),
        pricePerNight: parseFloat(h.rates?.[0]?.showAmount || '0'),
        classification: `${h.stars || 0}-Star`,
        bedTypes: []
      }));
      
      const filtered = filterHotels(convertedHotels, filters);
      setFilteredHotels(hotels.filter(h => filtered.some(f => f.id === h.id)));
    }
  }, [hotels, filters]);

  const handleSearch = async (criteria: SearchCriteria) => {
    setIsLoading(true);
    setSearchCriteria(criteria);
    setHasSearched(true);
    setError(null);
    
    try {
      // Convert SearchCriteria to HotelSearchCriteria
      const hotelSearchCriteria: HotelSearchCriteria = {
        destination: criteria.location,
        checkInDate: criteria.checkIn.toISOString().split('T')[0],
        checkOutDate: criteria.checkOut.toISOString().split('T')[0],
        guests: Array.from({ length: criteria.rooms }, (_, i) => ({
          adults: Math.max(1, Math.ceil(criteria.adults / criteria.rooms)),
          children: [],
        })),
        residency: criteria.residency || 'ng',
        currency: 'USD',
      };

      const response = await hotelService.searchHotels(hotelSearchCriteria);
      setHotels(response.hotels);
      
      // Store search results and criteria in localStorage for hotel details page
      localStorage.setItem('hotelSearchResults', JSON.stringify(response.hotels));
      localStorage.setItem('hotelSearchCriteria', JSON.stringify(criteria));
      
      if (response.hotels.length === 0) {
        addNotification({ type: 'info', title: 'No Results', message: 'No hotels found for your search criteria. Try adjusting your dates or location.' });
      }
    } catch (error) {
      console.error('Hotel search error:', error);
      setError('Failed to search hotels. Please try again.');
      addNotification({ type: 'error', title: 'Search Failed', message: 'Failed to search hotels. Please try again.' });
      
      // Fallback to sample data for development
      const convertedSampleHotels: HotelResult[] = SAMPLE_HOTELS.map(hotel => ({
        id: hotel.id,
        hid: 0,
        name: hotel.name,
        address: hotel.location.address,
        stars: 4,
        images: hotel.images,
        amenities: hotel.amenities?.map(a => a.name) || [],
        location: { latitude: 0, longitude: 0 },
        rating: 4.5,
        reviewCount: 100,
        rates: [{
          matchHash: '',
          bookHash: '',
          roomName: 'Standard Room',
          meal: 'nomeal',
          mealData: { value: 'nomeal', has_breakfast: false, no_child_meal: false },
          dailyPrice: String(hotel.pricePerNight),
          showAmount: String(hotel.pricePerNight),
          amount: String(hotel.pricePerNight),
          currency: 'USD',
          paymentType: 'deposit',
          cancellationPenalties: null,
          freeCancellationBefore: null,
          includedTaxes: [],
          excludedTaxes: [],
          roomDataTrans: null,
        }],
      }));
      setHotels(convertedSampleHotels);
      
      localStorage.setItem('hotelSearchResults', JSON.stringify(convertedSampleHotels));
      localStorage.setItem('hotelSearchCriteria', JSON.stringify(criteria));
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const handleBookNow = (hotel: any) => {
    // Store the selected hotel data in localStorage for immediate access
    localStorage.setItem('selectedHotel', JSON.stringify(hotel));
    
    // Navigate to hotel details page with search criteria if available
    const url = searchCriteria 
      ? NavigationHelper.buildHotelDetailsUrl(hotel.id, searchCriteria)
      : `/hotels/${hotel.id}`;
    
    router.push(url);
  };

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {[...Array(8)].map((_, index) => (
        <div key={index} className="bg-white border border-gray-200 rounded-lg overflow-hidden animate-pulse">
          <div className="h-48 bg-gray-300"></div>
          <div className="p-6">
            <div className="h-6 bg-gray-300 rounded mb-2"></div>
            <div className="h-4 bg-gray-300 rounded mb-3 w-3/4"></div>
            <div className="h-4 bg-gray-300 rounded mb-4"></div>
            <div className="flex justify-between items-center">
              <div className="h-8 bg-gray-300 rounded w-20"></div>
              <div className="h-10 bg-gray-300 rounded w-24"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const EmptyState = () => (
    <div className="text-center py-12">
      <img 
        src={getUIIcon('search')} 
        alt="No results" 
        className="h-16 w-16 mx-auto mb-4 opacity-50"
      />
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {hasSearched ? 'No hotels found' : 'Start your search'}
      </h3>
      <p className="text-gray-600 mb-6">
        {hasSearched 
          ? 'Try adjusting your filters or search criteria to find more options.'
          : 'Enter your destination and travel dates to find the perfect hotel.'
        }
      </p>
      {hasSearched && (
        <button
          onClick={() => setFilters({})}
          className="text-brand-red hover:text-red-700 font-medium"
        >
          Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <main id="main-content">
      <Header />

      {/* Search Section */}
      <section className="py-6 bg-white border-b border-gray-200">
        <div className="container-custom">
          <HotelSearchForm 
            onSearch={handleSearch} 
            initialValues={initialSearchData || undefined}
          />
        </div>
      </section>

      {/* Results Section */}
      <section className="py-8 sm:py-12 bg-gray-50">
        <div className="container-custom">
          {hasSearched && (
            <div className="mb-6 sm:mb-8">
              {/* Filter Bar */}
              {filteredHotels.length > 0 && (
                <div className="mb-4">
                  <FilterBar filters={filters} onFilterChange={handleFilterChange} />
                </div>
              )}
              
              {/* Title below filter bar */}
              <div className="text-left">
                <h2 className="text-gray-600 text-xs sm:text-sm">
                  Choose a <span className="text-red-500">Hotel</span> to Stay
                </h2>
              </div>
            </div>
          )}

          {/* Hotel Results */}
          {isLoading ? (
            <LoadingSkeleton />
          ) : filteredHotels.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredHotels.map((hotelOffer) => {
                // Convert HotelResult to card format
                const hotel = {
                  id: hotelOffer.id,
                  name: hotelOffer.name,
                  location: hotelOffer.address || '',
                  city: hotelOffer.address || '',
                  country: '',
                  image: hotelOffer.images[0] || '/images/placeholder-hotel.png',
                  gallery: hotelOffer.images,
                  rating: hotelOffer.rating,
                  reviewCount: hotelOffer.reviewCount,
                  price: parseFloat(hotelOffer.rates?.[0]?.showAmount || '0'),
                  currency: hotelOffer.rates?.[0]?.currency || 'USD',
                  amenities: hotelOffer.amenities,
                  description: hotelOffer.name,
                  coordinates: {
                    lat: hotelOffer.location?.latitude || 0,
                    lng: hotelOffer.location?.longitude || 0,
                  }
                };
                
                return (
                  <HotelCard
                    key={hotel.id}
                    hotel={hotel}
                    onClick={() => handleBookNow(hotel)}
                  />
                );
              })}
            </div>
          ) : hasSearched ? (
            <EmptyState />
          ) : (
            /* Featured Hotels (shown when no search has been performed) */
            <div className="text-center">
              <h2 className="font-poppins font-bold text-2xl sm:text-3xl text-gray-900 mb-4">
                Featured Hotels
              </h2>
              <p className="text-gray-600 mb-8 sm:mb-12 text-sm sm:text-base">
                Handpicked accommodations for an unforgettable stay
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {SAMPLE_HOTELS.slice(0, 8).map((sampleHotel) => {
                  // Convert sample hotel to Hotel format
                  const hotel = {
                    id: sampleHotel.id,
                    name: sampleHotel.name,
                    location: `${sampleHotel.location.city}, ${sampleHotel.location.country}`,
                    city: sampleHotel.location.city,
                    country: sampleHotel.location.country,
                    image: sampleHotel.images[0],
                    gallery: sampleHotel.images,
                    rating: 4.5, // Default rating since not available in sample data
                    reviewCount: Math.floor(Math.random() * 1000) + 100,
                    price: sampleHotel.pricePerNight,
                    currency: 'USD',
                    amenities: sampleHotel.amenities?.map(a => a.name) || [],
                    description: sampleHotel.description,
                    coordinates: {
                      lat: 0,
                      lng: 0
                    }
                  };
                  
                  return (
                    <HotelCard
                      key={hotel.id}
                      hotel={hotel}
                      onClick={() => handleBookNow(hotel)}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      <ServiceFooter />
    </main>
  );
}