'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CarContactForm } from '@/components/car-hire';
import { ServiceLayout } from '@/components/hotels';
import { DriverInformation, EmergencyContact, CarRental } from '@/types/car-hire';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

interface CarContactPageProps {
  params: {
    id: string;
  };
}

export default function CarContactPage({ params }: CarContactPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get booking details from URL parameters
  const location = searchParams.get('location') || '';
  const pickupDateParam = searchParams.get('pickupDate');
  const returnDateParam = searchParams.get('returnDate');
  
  // Parse dates with proper defaults
  const pickupDate = pickupDateParam ? new Date(pickupDateParam) : new Date();
  const returnDate = returnDateParam 
    ? new Date(returnDateParam) 
    : new Date(pickupDate.getTime() + 24 * 60 * 60 * 1000); // Default to 1 day after pickup
  
  const passengerCount = parseInt(searchParams.get('passengerCount') || '1');

  // State for car data
  const [car, setCar] = useState<CarRental | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Initialize form state
  const [driverInfo, setDriverInfo] = useState<DriverInformation>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: new Date(),
    licenseNumber: '',
    licenseCountry: '',
    licenseExpiryDate: new Date(),
  });

  const [emergencyContact, setEmergencyContact] = useState<EmergencyContact>({
    name: '',
    relationship: '',
    phoneNumber: '',
    email: '',
  });

  // Fetch car data from API
  useEffect(() => {
    const fetchCar = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`${API_BASE_URL}/api/v1/car-hire/${params.id}`);
        
        if (!response.ok) {
          throw new Error('Car not found');
        }
        
        const data = await response.json();
        const backendCar = data.data?.car;
        
        if (backendCar) {
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
        } else {
          setError('Car not found');
        }
      } catch (err: any) {
        console.error('Error fetching car:', err);
        setError(err.message || 'Failed to load car details');
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [params.id]);

  // Load saved data from session storage on mount
  useEffect(() => {
    try {
      const savedData = sessionStorage.getItem('carBookingContactData');
      if (savedData) {
        const parsed = JSON.parse(savedData);
        if (parsed.driverInfo) {
          setDriverInfo({
            ...parsed.driverInfo,
            dateOfBirth: new Date(parsed.driverInfo.dateOfBirth),
            licenseExpiryDate: new Date(parsed.driverInfo.licenseExpiryDate),
          });
        }
        if (parsed.emergencyContact) {
          setEmergencyContact(parsed.emergencyContact);
        }
      }
    } catch (error) {
      console.error('Error loading saved contact data:', error);
    }
  }, []);

  // Save data to session storage whenever it changes
  useEffect(() => {
    try {
      const dataToSave = {
        driverInfo,
        emergencyContact,
      };
      sessionStorage.setItem('carBookingContactData', JSON.stringify(dataToSave));
    } catch (error) {
      console.error('Error saving contact data:', error);
    }
  }, [driverInfo, emergencyContact]);

  if (loading) {
    return (
      <ServiceLayout title="Loading...">
        <div className="min-h-screen flex items-center justify-center">
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
      <ServiceLayout title="Car Not Found">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Car Not Found</h1>
            <p className="text-gray-600 mb-6">{error || "The car you're looking for doesn't exist."}</p>
            <button
              onClick={() => router.push('/car-hire')}
              className="px-6 py-3 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition-colors"
            >
              Back to Car Search
            </button>
          </div>
        </div>
      </ServiceLayout>
    );
  }

  const handleDriverInfoChange = (updatedDriverInfo: DriverInformation) => {
    setDriverInfo(updatedDriverInfo);
  };

  const handleEmergencyContactChange = (updatedEmergencyContact: EmergencyContact) => {
    setEmergencyContact(updatedEmergencyContact);
  };

  const handleSubmit = async () => {
    if (!car) {
      console.error('Car data not available');
      return;
    }

    try {
      // Get URL parameters
      const location = searchParams.get('location') || '';
      const passengerCount = parseInt(searchParams.get('passengerCount') || '1');
      
      // Save complete booking data to session storage with properly serialized dates
      const bookingData = {
        car,
        location,
        pickupDate: pickupDate.toISOString(),
        returnDate: returnDate.toISOString(),
        passengerCount,
        driverInfo: {
          ...driverInfo,
          dateOfBirth: driverInfo.dateOfBirth?.toISOString() || new Date().toISOString(),
          licenseExpiryDate: driverInfo.licenseExpiryDate?.toISOString() || new Date().toISOString(),
        },
        emergencyContact,
        extras: [], // Load from previous sessionStorage if available
      };
      
      // Try to preserve extras from previous step
      try {
        const previousData = sessionStorage.getItem('carBookingData');
        if (previousData) {
          const parsed = JSON.parse(previousData);
          if (parsed.selectedExtras) {
            bookingData.extras = parsed.selectedExtras;
          }
        }
      } catch (e) {
        console.error('Error loading previous extras:', e);
      }
      
      sessionStorage.setItem('carBookingData', JSON.stringify(bookingData));
      
      // Navigate to payment page with parameters
      const paymentParams = new URLSearchParams({
        location,
        pickupDate: pickupDate.toISOString(),
        returnDate: returnDate.toISOString(),
        passengerCount: passengerCount.toString(),
      });
      
      const paymentUrl = `/car-hire/${params.id}/payment?${paymentParams.toString()}`;
      router.push(paymentUrl);
    } catch (error) {
      console.error('Error saving booking data:', error);
    }
  };

  const breadcrumbs = [
    { name: 'Car Hire', href: '/car-hire' },
    { name: car.name, href: `/car-hire/${car.id}` },
    { name: 'Contact Information', href: `/car-hire/${car.id}/contact` },
  ];

  return (
    <ServiceLayout title="Driver Information" breadcrumbs={breadcrumbs}>
      <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Driver Information</h1>
            <p className="text-gray-600">
              Please provide driver details and emergency contact information for your {car.name} rental
            </p>
          </div>

          {/* Car Summary */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <img
                  src={car.image}
                  alt={car.name}
                  className="w-16 h-12 object-cover rounded-md"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/images/placeholder-car.jpg';
                  }}
                />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{car.name}</h3>
                <p className="text-sm text-gray-600">
                  {location} • {pickupDate.toLocaleDateString()} - {returnDate.toLocaleDateString()}
                </p>
                <p className="text-sm font-medium text-red-600">
                  ${car.pricePerDay}/day
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <CarContactForm
              driverInfo={driverInfo}
              emergencyContact={emergencyContact}
              onDriverInfoChange={handleDriverInfoChange}
              onEmergencyContactChange={handleEmergencyContactChange}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>
    </ServiceLayout>
  );
}