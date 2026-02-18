'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ServiceLayout, GuestInformationForm, BookingSummary } from '@/components/hotels';
import RouteGuard from '@/components/hotels/RouteGuard';
import { Guest, Hotel } from '@/types/hotels';
import { HotelOffer } from '@/types/api';
import { SAMPLE_HOTELS, createInitialGuestList, calculateBookingPrice, calculateNights } from '@/lib/hotels';
import { hotelService } from '@/lib/services/hotel-service';
import { NavigationHelper } from '@/lib/routing';
import { useBookingState } from '@/lib/bookingState';

interface GuestInformationPageProps {
  params: {
    id: string;
  };
}

export default function GuestInformationPage({ params }: GuestInformationPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get booking details from URL parameters
  const checkIn = searchParams.get('checkIn') ? new Date(searchParams.get('checkIn')!) : new Date();
  const checkOut = searchParams.get('checkOut') ? new Date(searchParams.get('checkOut')!) : new Date();
  const adults = parseInt(searchParams.get('adults') || '1');
  const children = parseInt(searchParams.get('children') || '0');
  const rooms = parseInt(searchParams.get('rooms') || '1');

  // Initialize state
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHotel, setIsLoadingHotel] = useState(true);
  const { updateGuests } = useBookingState();

  useEffect(() => {
    // Load hotel details
    const loadHotelDetails = async () => {
      setIsLoadingHotel(true);
      try {
        const hotelDetails = await hotelService.getHotelDetails(params.id);
        
        // Convert HotelOffer to Hotel format
        const convertedHotel: Hotel = {
          id: hotelDetails.id,
          name: hotelDetails.name,
          location: hotelDetails.location,
          images: hotelDetails.images,
          description: `${hotelDetails.name} - ${hotelDetails.location.city}`,
          amenities: hotelDetails.amenities.map((amenity: string) => ({ 
            id: amenity, 
            name: amenity, 
            icon: '', 
            category: 'comfort' as const 
          })),
          pricePerNight: hotelDetails.rooms[0]?.price.total || 0,
          classification: `${hotelDetails.rating}-Star`,
          bedTypes: hotelDetails.rooms.map((room: any) => room.bedType)
        };
        
        setHotel(convertedHotel);
      } catch (error) {
        console.error('Error loading hotel details:', error);
        // Fallback to sample data
        const fallbackHotel = SAMPLE_HOTELS.find(h => h.id === params.id);
        setHotel(fallbackHotel || null);
      } finally {
        setIsLoadingHotel(false);
      }
    };

    loadHotelDetails();
  }, [params.id]);

  useEffect(() => {
    // Create initial guest list based on booking criteria
    const initialGuests = createInitialGuestList(adults, children);
    setGuests(initialGuests);
  }, [adults, children]);

  if (isLoadingHotel) {
    return (
      <ServiceLayout title="Loading...">
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Loading hotel details...</p>
          </div>
        </div>
      </ServiceLayout>
    );
  }

  if (!hotel) {
    return (
      <ServiceLayout title="Hotel Not Found">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Hotel Not Found</h1>
            <p className="text-gray-600 mb-6">The hotel you're looking for doesn't exist.</p>
            <button
              onClick={() => router.push('/hotels')}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              Back to Hotels
            </button>
          </div>
        </div>
      </ServiceLayout>
    );
  }

  const handleGuestUpdate = (guestIndex: number, guestData: Guest) => {
    setGuests(prev => {
      const updated = [...prev];
      updated[guestIndex] = guestData;
      return updated;
    });
  };

  const handleSubmit = async (allGuests: Guest[]) => {
    setIsLoading(true);
    
    try {
      // Update guests in booking state
      updateGuests(allGuests);
      
      // Store guest information in session storage for the payment page (legacy support)
      const bookingData = {
        hotel,
        dates: { checkIn, checkOut },
        guests: allGuests,
        rooms,
      };
      
      sessionStorage.setItem('hotelBookingData', JSON.stringify(bookingData));
      
      // Navigate to payment page using navigation helper
      const searchCriteria = { 
        location: searchParams.get('location') || '',
        checkIn, 
        checkOut, 
        rooms, 
        adults, 
        children 
      };
      const paymentUrl = NavigationHelper.buildPaymentUrl(params.id, searchCriteria);
      router.push(paymentUrl);
    } catch (error) {
      console.error('Error saving guest information:', error);
      // Handle error - could show a toast notification
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  // Calculate booking details for summary
  const nights = calculateNights(checkIn, checkOut);
  const pricing = calculateBookingPrice(hotel.pricePerNight, nights);

  const breadcrumbs = [
    { name: 'Hotels', href: '/hotels' },
    { name: hotel.name, href: `/hotels/${hotel.id}` },
    { name: 'Guest Information', href: `/hotels/${hotel.id}/guests` },
  ];

  return (
    <RouteGuard requiresValidResource={true}>
      <ServiceLayout title="Guest Information" breadcrumbs={breadcrumbs}>
        <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Guest Information</h1>
            <p className="text-gray-600">
              Please provide information for all guests staying at {hotel.name}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Guest Information Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Guest Details
                  </h2>
                  <p className="text-sm text-gray-600">
                    {guests.length} guest{guests.length !== 1 ? 's' : ''} • {rooms} room{rooms !== 1 ? 's' : ''}
                  </p>
                </div>

                <GuestInformationForm
                  guests={guests}
                  onGuestUpdate={handleGuestUpdate}
                  onSubmit={handleSubmit}
                />
              </div>
            </div>

            {/* Booking Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <BookingSummary
                  hotel={hotel}
                  dates={{
                    checkIn,
                    checkOut,
                    nights,
                  }}
                  guests={guests}
                  pricing={pricing}
                />

                {/* Navigation Buttons */}
                <div className="mt-6 space-y-3">
                  <button
                    onClick={handleBack}
                    disabled={isLoading}
                    className="w-full px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Back to Hotel Details
                  </button>
                  
                  <div className="text-xs text-gray-500 text-center">
                    Complete guest information to proceed to payment
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ServiceLayout>
    </RouteGuard>
  );
}