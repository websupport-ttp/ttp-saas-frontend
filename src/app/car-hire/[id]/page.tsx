'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { CarRental, CarExtra } from '@/types/car-hire';
import { CarDetailsView } from '@/components/car-hire';
import ServiceLayout from '@/components/hotels/ServiceLayout';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

export default function CarDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [car, setCar] = useState<CarRental | null>(null);
  const [selectedExtras, setSelectedExtras] = useState<CarExtra[]>([]);
  const [pickupDate, setPickupDate] = useState<Date>(new Date());
  const [returnDate, setReturnDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const carId = params.id as string;
        const response = await fetch(`${API_BASE_URL}/api/v1/car-hire/${carId}`);
        
        if (!response.ok) {
          throw new Error('Car not found');
        }
        
        const data = await response.json();
        console.log('Car API response:', data);
        
        // Handle both response formats
        const backendCar = data.data?.car || data.data;
        
        if (!backendCar || !backendCar._id) {
          console.error('Invalid car data:', data);
          setError('Car not found');
          setLoading(false);
          return;
        }
          // Transform backend car to match CarRental interface
          const transformedCar: CarRental = {
            id: backendCar._id,
            name: backendCar.name,
            brand: backendCar.brand,
            model: backendCar.model,
            year: backendCar.year,
            type: backendCar.type,
            capacity: backendCar.capacity,
            doors: backendCar.doors || 4,
            transmission: backendCar.transmission,
            fuelType: backendCar.fuelType || 'petrol',
            pricePerDay: backendCar.pricePerDay,
            currency: 'NGN',
            image: backendCar.image || '/images/car-placeholder.jpg',
            images: backendCar.images || [],
            features: backendCar.features || ['Air Conditioning', 'Bluetooth', 'GPS Navigation'],
            mileage: backendCar.mileage || 'unlimited',
            fuelPolicy: backendCar.fuelPolicy || 'full-to-full',
            location: backendCar.location,
            supplier: {
              name: backendCar.supplier?.name || 'The Travel Place',
              rating: backendCar.supplier?.rating || 4.5,
              logo: '/images/logo.png',
              recommendationPercentage: 95,
              location: backendCar.location,
              hoursOfOperation: {
                weekdays: '8:00 AM - 6:00 PM',
                weekends: '9:00 AM - 5:00 PM'
              }
            },
            availability: backendCar.availability,
            rating: backendCar.supplier?.rating || 4.5,
            reviewCount: 0,
            insuranceIncluded: true,
            depositRequired: true,
            cancellationPolicy: 'Free cancellation up to 24 hours before pickup',
            airConditioning: backendCar.features?.includes('Air Conditioning') || true,
          };
          
          setCar(transformedCar);
      } catch (err: any) {
        console.error('Error fetching car:', err);
        setError(err.message || 'Failed to load car details');
      } finally {
        setLoading(false);
      }
    };

    fetchCar();

    // Get search parameters
    const pickup = searchParams.get('pickup');
    const returnParam = searchParams.get('return');
    
    if (pickup) {
      setPickupDate(new Date(pickup));
    }
    if (returnParam) {
      setReturnDate(new Date(returnParam));
    }
  }, [params.id, searchParams]);

  const handleExtrasChange = (extras: CarExtra[]) => {
    setSelectedExtras(extras);
  };

  const handleBookNow = () => {
    if (!car) return;
    
    // Get location and passenger count from URL params
    const location = searchParams.get('location') || '';
    const passengers = searchParams.get('passengers') || '1';
    
    // Store booking data in session storage for the contact form
    const bookingData = {
      carId: car.id,
      pickupDate: pickupDate.toISOString(),
      returnDate: returnDate.toISOString(),
      selectedExtras,
    };
    
    sessionStorage.setItem('carBookingData', JSON.stringify(bookingData));
    
    // Navigate to contact information page with all necessary parameters
    const contactParams = new URLSearchParams({
      location,
      pickupDate: pickupDate.toISOString(),
      returnDate: returnDate.toISOString(),
      passengerCount: passengers,
    });
    
    router.push(`/car-hire/${car.id}/contact?${contactParams.toString()}`);
  };

  if (loading) {
    return (
      <ServiceLayout
        title="Car Details"
        breadcrumbs={[
          { name: 'Car Hire', href: '/car-hire' },
          { name: 'Loading...', href: '#' }
        ]}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red mx-auto mb-4"></div>
            <p className="text-gray-600">Loading car details...</p>
          </div>
        </div>
      </ServiceLayout>
    );
  }

  if (error || !car) {
    return (
      <ServiceLayout
        title="Car Details"
        breadcrumbs={[
          { name: 'Car Hire', href: '/car-hire' },
          { name: 'Car Details', href: '#' }
        ]}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Car not found</h2>
            <p className="mt-2 text-gray-600">{error || "The car you're looking for doesn't exist."}</p>
            <button
              onClick={() => router.push('/car-hire')}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-red hover:bg-red-700"
            >
              Back to Car Hire
            </button>
          </div>
        </div>
      </ServiceLayout>
    );
  }

  return (
    <ServiceLayout
      title={`${car.name} - Car Details`}
      breadcrumbs={[
        { name: 'Car Hire', href: '/car-hire' },
        { name: car.name, href: '#' }
      ]}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CarDetailsView
          car={car}
          pickupDate={pickupDate}
          returnDate={returnDate}
          selectedExtras={selectedExtras}
          onExtrasChange={handleExtrasChange}
          onBookNow={handleBookNow}
        />
      </div>
    </ServiceLayout>
  );
}