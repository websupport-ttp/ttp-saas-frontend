'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import ServiceFooter from '@/components/layout/ServiceFooter';
import { SAMPLE_HOTELS } from '@/lib/hotels';
import AmenityIcon from '@/components/ui/AmenityIcon';

export default function HotelDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [hotel, setHotel] = useState<any>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageError, setImageError] = useState<boolean>(false);

  // Reset image index when hotel changes and ensure it's within bounds
  useEffect(() => {
    if (hotel?.images?.length) {
      setCurrentImageIndex(0);
      setImageError(false);
    }
  }, [hotel?.id]);

  // Ensure currentImageIndex is always within bounds
  const safeImageIndex = hotel?.images?.length ? 
    Math.min(currentImageIndex, hotel.images.length - 1) : 0;

  // Get current image with fallback
  const getCurrentImage = () => {
    if (imageError || !hotel?.images?.length) {
      return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgdmlld0JveD0iMCAwIDgwMCA2MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zNjggMjgwSDQzMlYzNDRIMzY4VjI4MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHA+CjxwYXRoIGQ9Ik0zMjggMjQwSDQ3MlYzODRIMzI4VjI0MFoiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJub25lIi8+CjxjaXJjbGUgY3g9IjM2MCIgY3k9IjI3MiIgcj0iMTYiIGZpbGw9IiM5Q0EzQUYiLz4KPHA+Cjx0ZXh0IHg9IjQwMCIgeT0iMzIwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM2QjcyODAiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkhvdGVsIEltYWdlPC90ZXh0Pgo8L3N2Zz4K';
    }
    return hotel.images[safeImageIndex] || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgdmlld0JveD0iMCAwIDgwMCA2MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zNjggMjgwSDQzMlYzNDRIMzY4VjI4MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHA+CjxwYXRoIGQ9Ik0zMjggMjQwSDQ3MlYzODRIMzI4VjI0MFoiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJub25lIi8+CjxjaXJjbGUgY3g9IjM2MCIgY3k9IjI3MiIgcj0iMTYiIGZpbGw9IiM5Q0EzQUYiLz4KPHA+Cjx0ZXh0IHg9IjQwMCIgeT0iMzIwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM2QjcyODAiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkhvdGVsIEltYWdlPC90ZXh0Pgo8L3N2Zz4K';
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageClick = (newIndex: number) => {
    if (hotel?.images && newIndex < hotel.images.length && newIndex >= 0) {
      setCurrentImageIndex(newIndex);
      setImageError(false);
    }
  };

  useEffect(() => {
    // Helper function to get booking info from search params or localStorage
    const getBookingInfo = () => {
      // Try to get from URL search params first
      const checkin = searchParams.get('checkin');
      const checkout = searchParams.get('checkout');
      const adults = searchParams.get('adults');
      const children = searchParams.get('children');
      const rooms = searchParams.get('rooms');
      
      if (checkin && checkout) {
        const checkinDate = new Date(checkin);
        const checkoutDate = new Date(checkout);
        const nights = Math.ceil((checkoutDate.getTime() - checkinDate.getTime()) / (1000 * 60 * 60 * 24));
        
        return {
          adults: parseInt(adults || '1'),
          children: parseInt(children || '0'),
          nights: Math.max(1, nights),
          rooms: parseInt(rooms || '1')
        };
      }
      
      // Try to get from localStorage search criteria
      try {
        const storedCriteria = localStorage.getItem('hotelSearchCriteria');
        if (storedCriteria) {
          const criteria = JSON.parse(storedCriteria);
          
          // Convert string dates back to Date objects if needed
          const checkinDate = new Date(criteria.checkIn);
          const checkoutDate = new Date(criteria.checkOut);
          
          // Validate dates
          if (isNaN(checkinDate.getTime()) || isNaN(checkoutDate.getTime())) {
            console.error('Invalid dates in stored criteria:', criteria);
            throw new Error('Invalid dates');
          }
          
          const nights = Math.ceil((checkoutDate.getTime() - checkinDate.getTime()) / (1000 * 60 * 60 * 24));
          
          console.log('Parsed booking info from localStorage:', {
            adults: criteria.adults || 1,
            children: criteria.children || 0,
            nights: Math.max(1, nights),
            rooms: criteria.rooms || 1,
            originalCriteria: criteria
          });
          
          return {
            adults: criteria.adults || 1,
            children: criteria.children || 0,
            nights: Math.max(1, nights),
            rooms: criteria.rooms || 1
          };
        }
      } catch (error) {
        console.error('Error parsing stored search criteria:', error);
      }
      
      // Default fallback
      console.log('Using default booking info fallback');
      return {
        adults: 1,
        children: 0,
        nights: 1,
        rooms: 1
      };
    };

    // Find hotel by ID from sample data
    const hotelId = params.id as string;
    const bookingInfo = getBookingInfo();
    
    // Check if this is a dummy hotel from search results
    if (hotelId.startsWith('dummy_hotel_')) {
      // First try to get the selected hotel data (most recent)
      const selectedHotel = localStorage.getItem('selectedHotel');
      if (selectedHotel) {
        try {
          const hotel = JSON.parse(selectedHotel);
          if (hotel.id === hotelId) {
            const pricePerNight = hotel.rooms?.[0]?.price?.total || hotel.price || 25000;
            
            // Fix location structure for dummy hotels from search results
            const hotelLocation = typeof hotel.location === 'string' 
              ? { 
                  address: `${Math.floor(Math.random() * 999) + 1} Main Street`,
                  city: hotel.city || 'Lagos', 
                  country: 'Nigeria' 
                }
              : hotel.location || { 
                  address: `${Math.floor(Math.random() * 999) + 1} Main Street`,
                  city: hotel.city || 'Lagos', 
                  country: 'Nigeria' 
                };
            
            setHotel({
              ...hotel,
              location: hotelLocation,
              images: hotel.gallery || hotel.images || [],
              pricePerNight: pricePerNight,
              fullDescription: hotel.description || "This hotel offers comfortable accommodations with modern amenities and excellent service.",
              serviceDescription: "Your stay includes comfortable rooms with modern amenities. Our dedicated staff ensures a pleasant experience throughout your visit.",
              amenities: hotel.amenities?.map((name: string) => ({ name, icon: 'default' })) || [
                { name: 'Free WiFi', icon: 'wifi' },
                { name: 'Restaurant', icon: 'restaurant' },
                { name: 'Room Service', icon: 'room-service' }
              ],
              bookingInfo: bookingInfo
            });
            return;
          }
        } catch (error) {
          console.error('Error parsing selected hotel:', error);
        }
      }
      
      // Fallback to search results
      const searchResults = localStorage.getItem('hotelSearchResults');
      
      if (searchResults) {
        try {
          const hotels = JSON.parse(searchResults);
          
          const foundHotel = hotels.find((h: any) => h.id === hotelId);
          
          if (foundHotel) {
            const pricePerNight = foundHotel.rooms?.[0]?.price?.total || foundHotel.price || 25000;
            
            // Fix location structure for dummy hotels from search results
            const hotelLocation = typeof foundHotel.location === 'string' 
              ? { 
                  address: `${Math.floor(Math.random() * 999) + 1} Main Street`,
                  city: foundHotel.city || 'Lagos', 
                  country: 'Nigeria' 
                }
              : foundHotel.location || { 
                  address: `${Math.floor(Math.random() * 999) + 1} Main Street`,
                  city: foundHotel.city || 'Lagos', 
                  country: 'Nigeria' 
                };
            
            setHotel({
              ...foundHotel,
              location: hotelLocation,
              images: foundHotel.gallery || foundHotel.images || [],
              // Convert the search result format to hotel details format
              pricePerNight: pricePerNight,
              fullDescription: foundHotel.description || "This hotel offers comfortable accommodations with modern amenities and excellent service.",
              serviceDescription: "Your stay includes comfortable rooms with modern amenities. Our dedicated staff ensures a pleasant experience throughout your visit.",
              amenities: foundHotel.amenities?.map((name: string) => ({ name, icon: 'default' })) || [
                { name: 'Free WiFi', icon: 'wifi' },
                { name: 'Restaurant', icon: 'restaurant' },
                { name: 'Room Service', icon: 'room-service' }
              ],
              bookingInfo: bookingInfo
            });
            return;
          }
        } catch (error) {
          console.error('Error parsing search results:', error);
        }
      }
      
      // If no search results found, redirect to hotel search
      router.replace('/hotels');
      return;
    }
    
    // Handle regular hotel IDs
    const foundHotel = SAMPLE_HOTELS.find(h => h.id === hotelId);
    
    if (foundHotel) {
      setHotel({
        ...foundHotel,
        // Add additional details for the hotel page
        fullDescription: "This Stylish And Roomy Family Home Is Nestled In Stockholm's Kista District, Just 1.4 Km Away From The Royal Swedish Opera. Museum Of Medieval Stockholm, And Skansen, Offering The Convenience Of Free Private Parking, It's Also A Short 9 Km Drive From Friends Arena And 34 Km From Arlanda Airport.\n\nExplore Nearby Attractions Like The Army Museum, Just 15 Km Away, And The Royal Palace, Situated 15 Km From This Charming Home. For Convenience, Bromma Stockholm Airport Is The Closest Airport, Located Just 8 Km Away From This Stylish And Spacious Family Retreat.",
        serviceDescription: "Your Stay At Our Hotel Includes A Complimentary Breakfast To Kickstart Your Day, And Our Rooms Offer A Cozy And Comfortable Retreat. Select Rooms Feature A Relaxing Bath Tub For Added Luxury.\n\nOur Dedicated Staff Is At Your Service, Ensuring A Seamless And Enjoyable Experience Throughout Your Stay. In Addition To The Inviting Accommodations, Indulge In Extra Leisure Activities Such As Our Fitness Center Or Spa. We've Thoughtfully Curated Every Aspect To Make Your Stay Special, Promising A Combination Of Comfort, Convenience, And Delightful Extras.",
        amenities: [
          { name: 'Free WiFi', icon: 'wifi' },
          { name: 'Restaurant', icon: 'restaurant' },
          { name: 'Bathroom', icon: 'bathroom' },
          { name: 'Air Conditioning', icon: 'ac' },
          { name: 'Parking Available', icon: 'parking' },
          { name: 'Fitness Center', icon: 'fitness' },
          { name: 'Room Service', icon: 'room-service' },
          { name: 'Tea/Coffee Machine', icon: 'coffee' }
        ],
        bookingInfo: bookingInfo
      });
    } else {
      // If hotel not found, redirect to hotels page
      router.replace('/hotels');
    }
  }, [params.id, router, searchParams]);

  if (!hotel) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red mb-4"></div>
          <p className="text-gray-600">Loading hotel details...</p>
        </div>
      </div>
    );
  }

  const handleBookNow = () => {
    // Ensure pricePerNight is correctly set for dummy hotels
    const hotelDataForBooking = {
      ...hotel,
      pricePerNight: hotel.pricePerNight || hotel.rooms?.[0]?.price?.total || hotel.price || 25000
    };
    
    // Get search criteria from URL params or localStorage
    const checkin = searchParams.get('checkin');
    const checkout = searchParams.get('checkout');
    const adults = searchParams.get('adults');
    const children = searchParams.get('children');
    const rooms = searchParams.get('rooms');
    const destination = searchParams.get('location');
    
    // Build URL with search criteria
    const urlParams = new URLSearchParams();
    urlParams.set('hotel', encodeURIComponent(JSON.stringify(hotelDataForBooking)));
    
    // Add search criteria if available from URL
    if (checkin && checkout && adults && rooms) {
      urlParams.set('destination', destination || hotel.location?.city || 'Lagos');
      urlParams.set('checkin', checkin);
      urlParams.set('checkout', checkout);
      urlParams.set('adults', adults);
      urlParams.set('children', children || '0');
      urlParams.set('rooms', rooms);
    } else {
      // Try to get from localStorage if not in URL
      try {
        const storedCriteria = localStorage.getItem('hotelSearchCriteria');
        if (storedCriteria) {
          const criteria = JSON.parse(storedCriteria);
          urlParams.set('destination', criteria.location || hotel.location?.city || 'Lagos');
          urlParams.set('checkin', criteria.checkIn ? new Date(criteria.checkIn).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]);
          urlParams.set('checkout', criteria.checkOut ? new Date(criteria.checkOut).toISOString().split('T')[0] : new Date(Date.now() + 24*60*60*1000).toISOString().split('T')[0]);
          urlParams.set('adults', (criteria.adults || 1).toString());
          urlParams.set('children', (criteria.children || 0).toString());
          urlParams.set('rooms', (criteria.rooms || 1).toString());
        }
      } catch (error) {
        console.error('Error parsing stored search criteria:', error);
        // Use defaults if parsing fails
        urlParams.set('destination', hotel.location?.city || 'Lagos');
        urlParams.set('checkin', new Date().toISOString().split('T')[0]);
        urlParams.set('checkout', new Date(Date.now() + 24*60*60*1000).toISOString().split('T')[0]);
        urlParams.set('adults', '1');
        urlParams.set('children', '0');
        urlParams.set('rooms', '1');
      }
    }
    
    // Navigate to booking page with all parameters
    router.push(`/hotels/book?${urlParams.toString()}`);
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hotel Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              {hotel.name}
            </h1>
            <p className="text-gray-600 flex items-center">
              <svg className="h-4 w-4 mr-1 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              {hotel.location?.address && `${hotel.location.address}, `}
              {hotel.location?.city && `${hotel.location.city}, `}
              {hotel.location?.country || 'Location'}
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button className="p-2 rounded-full border border-gray-300 hover:bg-gray-50">
              <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
            <button className="p-2 rounded-full border border-gray-300 hover:bg-gray-50">
              <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Main Image */}
            <div className="relative rounded-lg overflow-hidden h-96">
              <img
                src={getCurrentImage()}
                alt={hotel.name}
                className="w-full h-full object-cover"
                onError={handleImageError}
                key={`main-${safeImageIndex}-${imageError}`} // Force re-render on error state change
              />
            </div>
            
            {/* Side Images - 2x2 Grid */}
            <div className="grid grid-cols-2 grid-rows-2 gap-4 h-96">
              {hotel.images?.slice(1, 5).map((image: string, index: number) => (
                <div key={index} className="relative rounded-lg overflow-hidden">
                  <img
                    src={image}
                    alt={`${hotel.name} ${index + 2}`}
                    className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => handleImageClick(index + 1)}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgdmlld0JveD0iMCAwIDgwMCA2MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zNjggMjgwSDQzMlYzNDRIMzY4VjI4MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHA+CjxwYXRoIGQ9Ik0zMjggMjQwSDQ3MlYzODRIMzI4VjI0MFoiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJub25lIi8+CjxjaXJjbGUgY3g9IjM2MCIgY3k9IjI3MiIgcj0iMTYiIGZpbGw9IiM5Q0EzQUYiLz4KPHA+Cjx0ZXh0IHg9IjQwMCIgeT0iMzIwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM2QjcyODAiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkhvdGVsIEltYWdlPC90ZXh0Pgo8L3N2Zz4K';
                    }}
                  />
                  {index === 3 && hotel.images && hotel.images.length > 5 && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <button
                        className="text-white font-semibold flex items-center space-x-2 text-sm"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>See More Photos</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
              {/* Fallback when no side images available */}
              {(!hotel.images || hotel.images.length <= 1) && 
                Array.from({ length: 4 }, (_, index) => (
                  <div key={`fallback-${index}`} className="relative rounded-lg overflow-hidden">
                    <img
                      src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgdmlld0JveD0iMCAwIDgwMCA2MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zNjggMjgwSDQzMlYzNDRIMzY4VjI4MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHA+CjxwYXRoIGQ9Ik0zMjggMjQwSDQ3MlYzODRIMzI4VjI0MFoiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJub25lIi8+CjxjaXJjbGUgY3g9IjM2MCIgY3k9IjI3MiIgcj0iMTYiIGZpbGw9IiM5Q0EzQUYiLz4KPHA+Cjx0ZXh0IHg9IjQwMCIgeT0iMzIwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM2QjcyODAiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkhvdGVsIEltYWdlPC90ZXh0Pgo8L3N2Zz4K"
                      alt={`${hotel.name} placeholder ${index + 2}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))
              }
            </div>
          </div>
        </div>

        {/* Hotel Details Section */}
        <div className="space-y-12">
          {/* Container 1: Hotel Details Description */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Hotel Details</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left: First two paragraphs */}
              <div className="space-y-4 text-gray-600 text-sm leading-relaxed">
                <p>This Stylish And Roomy Family Home Is Nestled In Stockholm's Kista District, Just 1.4 Km Away From The Royal Swedish Opera. Museum Of Medieval Stockholm, And Skansen, Offering The Convenience Of Free Private Parking, It's Also A Short 9 Km Drive From Friends Arena And 34 Km From Arlanda Airport.</p>
                <p>Explore Nearby Attractions Like The Army Museum, Just 15 Km Away, And The Royal Palace, Situated 15 Km From This Charming Home. For Convenience, Bromma Stockholm Airport Is The Closest Airport, Located Just 8 Km Away From This Stylish And Spacious Family Retreat.</p>
              </div>
              
              {/* Right: Service description paragraphs */}
              <div className="space-y-4 text-gray-600 text-sm leading-relaxed">
                <p>Your Stay At Our Hotel Includes A Complimentary Breakfast To Kickstart Your Day, And Our Rooms Offer A Cozy And Comfortable Retreat. Select Rooms Feature A Relaxing Bath Tub For Added Luxury.</p>
                <p>Our Dedicated Staff Is At Your Service, Ensuring A Seamless And Enjoyable Experience Throughout Your Stay. In Addition To The Inviting Accommodations, Indulge In Extra Leisure Activities Such As Our Fitness Center Or Spa. We've Thoughtfully Curated Every Aspect To Make Your Stay Special, Promising A Combination Of Comfort, Convenience, And Delightful Extras.</p>
              </div>
            </div>
          </div>

          {/* Container 2: Amenities and Booking Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Amenities */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Amenities</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {hotel.amenities.map((amenity: any, index: number) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-6 h-6 flex items-center justify-center">
                      <AmenityIcon name={amenity.name} className="h-5 w-5 text-gray-600" />
                    </div>
                    <span className="text-gray-700 text-sm">{amenity.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Booking Information */}
            <div className="lg:text-right">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Booking Information</h2>
              <div className="space-y-4">
                <div className="text-base font-bold text-gray-900">
                  {hotel.bookingInfo.adults}&nbsp;Adults,&nbsp;{hotel.bookingInfo.children}&nbsp;Children,&nbsp;{hotel.bookingInfo.nights}&nbsp;Nights&nbsp;|&nbsp;{hotel.bookingInfo.rooms}&nbsp;Room{hotel.bookingInfo.rooms > 1 ? 's' : ''}
                </div>
                <div className="flex items-center lg:justify-end space-x-2">
                  <span className="text-xl font-bold text-green-600">₦{hotel.pricePerNight?.toLocaleString()}</span>
                  <span className="text-gray-600 text-sm">Per night</span>
                </div>
                <div className="flex space-x-3 lg:justify-end">
                  <button
                    onClick={handleBack}
                    className="px-4 py-2 rounded-lg hover:bg-red-50 transition-colors duration-200 font-medium"
                    style={{ 
                      border: '2px solid #ef4444', 
                      color: '#ef4444', 
                      backgroundColor: 'white' 
                    }}
                  >
                    Back
                  </button>
                  <button
                    onClick={handleBookNow}
                    className="px-4 py-2 bg-brand-red text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium"
                  >
                    Book now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <ServiceFooter />
    </div>
  );
}