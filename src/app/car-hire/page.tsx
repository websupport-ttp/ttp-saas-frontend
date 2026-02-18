'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { CarSearchForm, CarCard, CarFilterBar } from '@/components/car-hire';
import { CarSearchCriteria, CarFilterOptions, CarRental } from '@/types/car-hire';
import { filterCars, sortCars, getAvailableSuppliers } from '@/lib/car-hire-utils';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

export default function CarHirePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchCriteria, setSearchCriteria] = useState<CarSearchCriteria | null>(null);
  const [filters, setFilters] = useState<CarFilterOptions>({});
  const [sortBy, setSortBy] = useState<'price' | 'rating' | 'capacity' | 'name'>('price');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [initialFormValues, setInitialFormValues] = useState<Partial<CarSearchCriteria> | undefined>(undefined);
  const [cars, setCars] = useState<CarRental[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch cars from backend
  const fetchCars = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/v1/car-hire`);
      
      if (response.ok) {
        const data = await response.json();
        const backendCars = data.data?.cars || [];
        
        // Transform backend cars to match CarRental interface
        const transformedCars: CarRental[] = backendCars.map((car: any) => ({
          id: car._id,
          name: car.name,
          brand: car.brand,
          model: car.model,
          year: car.year,
          type: car.type,
          capacity: car.capacity,
          doors: car.doors || 4,
          transmission: car.transmission,
          fuelType: car.fuelType || 'petrol',
          pricePerDay: car.pricePerDay,
          currency: 'NGN',
          image: car.image || '/images/car-placeholder.jpg',
          images: car.images || [],
          features: car.features || ['Air Conditioning', 'Bluetooth', 'GPS Navigation'],
          mileage: car.mileage || 'unlimited',
          fuelPolicy: car.fuelPolicy || 'full-to-full',
          location: car.location,
          supplier: {
            name: car.supplier?.name || 'The Travel Place',
            rating: car.supplier?.rating || 4.5,
            logo: '/images/logo.png',
            recommendationPercentage: 95,
            location: car.location,
            hoursOfOperation: {
              weekdays: '8:00 AM - 6:00 PM',
              weekends: '9:00 AM - 5:00 PM'
            }
          },
          availability: car.availability,
          rating: car.supplier?.rating || 4.5,
          reviewCount: 0,
          insuranceIncluded: true,
          depositRequired: true,
          cancellationPolicy: 'Free cancellation up to 24 hours before pickup'
        }));
        
        setCars(transformedCars);
      }
    } catch (error) {
      console.error('Error fetching cars:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  // Pre-fill form from URL parameters
  useEffect(() => {
    const pickupAddress = searchParams.get('pickupAddress');
    const dropoffAddress = searchParams.get('dropoffAddress');
    const pickupDate = searchParams.get('pickupDate');
    const pickupTime = searchParams.get('pickupTime');
    const dropoffDate = searchParams.get('dropoffDate');
    const dropoffTime = searchParams.get('dropoffTime');
    const passengers = searchParams.get('passengers');

    if (pickupAddress || dropoffAddress || pickupDate) {
      const initialValues: Partial<CarSearchCriteria> = {};
      
      if (pickupAddress) {
        initialValues.location = pickupAddress;
        initialValues.pickupAddress = pickupAddress;
      }
      
      if (dropoffAddress) {
        initialValues.dropoffAddress = dropoffAddress;
      }
      
      if (pickupDate) {
        const dateObj = new Date(pickupDate);
        if (!isNaN(dateObj.getTime())) {
          initialValues.pickupDate = dateObj;
          
          if (pickupTime) {
            const [hours, minutes] = pickupTime.split(':');
            dateObj.setHours(parseInt(hours), parseInt(minutes));
          }
        }
      }
      
      if (dropoffDate) {
        const dateObj = new Date(dropoffDate);
        if (!isNaN(dateObj.getTime())) {
          initialValues.returnDate = dateObj;
          
          if (dropoffTime) {
            const [hours, minutes] = dropoffTime.split(':');
            dateObj.setHours(parseInt(hours), parseInt(minutes));
          }
        }
      }
      
      if (passengers) {
        const passengerCount = parseInt(passengers);
        if (!isNaN(passengerCount) && passengerCount > 0) {
          initialValues.passengerCount = passengerCount;
        }
      }
      
      setInitialFormValues(initialValues);
      
      // Auto-trigger search if we have enough data
      if (pickupAddress && pickupDate) {
        const pickupDateTime = new Date(pickupDate);
        if (pickupTime) {
          const [hours, minutes] = pickupTime.split(':');
          pickupDateTime.setHours(parseInt(hours), parseInt(minutes));
        }
        
        const returnDateTime = dropoffDate ? new Date(dropoffDate) : new Date(pickupDateTime.getTime() + 24 * 60 * 60 * 1000);
        if (dropoffDate && dropoffTime) {
          const [hours, minutes] = dropoffTime.split(':');
          returnDateTime.setHours(parseInt(hours), parseInt(minutes));
        }
        
        const criteria: CarSearchCriteria = {
          location: pickupAddress,
          pickupDate: pickupDateTime,
          returnDate: returnDateTime,
          passengerCount: passengers ? parseInt(passengers) : 1,
          pickupAddress: pickupAddress,
          dropoffAddress: dropoffAddress || pickupAddress,
        };
        
        setSearchCriteria(criteria);
      }
    }
  }, [searchParams]);

  const handleSearch = (criteria: CarSearchCriteria) => {
    setSearchCriteria(criteria);
  };

  const handleCarSelect = (carId: string) => {
    if (searchCriteria) {
      const params = new URLSearchParams({
        pickup: searchCriteria.pickupDate.toISOString(),
        return: searchCriteria.returnDate.toISOString(),
        location: searchCriteria.location,
        passengers: searchCriteria.passengerCount.toString()
      });
      router.push(`/car-hire/${carId}?${params.toString()}`);
    } else {
      router.push(`/car-hire/${carId}`);
    }
  };

  const handleFilterChange = (newFilters: CarFilterOptions) => {
    setFilters(newFilters);
  };

  // Filter and sort cars based on search criteria and filters
  const getFilteredCars = (): CarRental[] => {
    if (!searchCriteria) return [];
    
    const filtered = filterCars(cars, searchCriteria, filters);
    return sortCars(filtered, sortBy, sortOrder);
  };

  const filteredCars = getFilteredCars();
  const availableSuppliers = getAvailableSuppliers();

  return (
    <main id="main-content">
      <Header />
      
      {/* Search Form */}
      <section className="py-12 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-8">
            <h1 className="font-poppins font-bold text-4xl text-gray-900 mb-4">
              Car Hire
            </h1>
            <p className="text-gray-600 text-lg">
              Find and book the perfect vehicle for your journey
            </p>
          </div>
          <CarSearchForm onSearch={handleSearch} initialValues={initialFormValues} />
        </div>
      </section>

      {/* Search Results */}
      {searchCriteria && (
        <section className="py-8 bg-white">
          <div className="container-custom">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Available Cars in {searchCriteria.location}
                </h2>
                <p className="text-gray-600">
                  {loading ? 'Searching...' : `${filteredCars.length} cars found for ${searchCriteria.passengerCount} passenger${searchCriteria.passengerCount !== 1 ? 's' : ''}`}
                </p>
              </div>
              
              {/* Sort Options */}
              <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                <label className="text-sm font-medium text-gray-700">Sort by:</label>
                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [newSortBy, newSortOrder] = e.target.value.split('-') as [typeof sortBy, typeof sortOrder];
                    setSortBy(newSortBy);
                    setSortOrder(newSortOrder);
                  }}
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-brand-red"
                >
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating-desc">Rating: High to Low</option>
                  <option value="capacity-desc">Capacity: High to Low</option>
                  <option value="name-asc">Name: A to Z</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Filter Sidebar */}
              <div className="lg:col-span-1">
                <CarFilterBar
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  availableSuppliers={availableSuppliers}
                />
              </div>

              {/* Car Results */}
              <div className="lg:col-span-3">
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading available cars...</p>
                  </div>
                ) : filteredCars.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredCars.map((car) => (
                      <CarCard
                        key={car.id}
                        car={car}
                        onSelect={handleCarSelect}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No cars found</h3>
                    <p className="text-gray-600 mb-4">
                      Try adjusting your search criteria or filters to find more options.
                    </p>
                    <button
                      onClick={() => setFilters({})}
                      className="text-brand-red hover:text-red-700 font-medium"
                    >
                      Clear all filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Popular Car Categories (shown when no search) */}
      {!searchCriteria && (
        <section className="py-16 bg-white">
          <div className="container-custom">
            <div className="text-center">
              <h2 className="font-poppins font-bold text-3xl text-gray-900 mb-4">
                Browse by Car Type
              </h2>
              <p className="text-gray-600 mb-12">
                Find the perfect vehicle for your travel needs
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="h-32 bg-gray-100 rounded mb-4 flex items-center justify-center">
                    <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Saloon</h3>
                  <p className="text-gray-600 text-sm mb-2">Comfortable sedans for city travel</p>
                  <p className="text-brand-red font-semibold">From ₦25,000/day</p>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="h-32 bg-gray-100 rounded mb-4 flex items-center justify-center">
                    <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">SUV</h3>
                  <p className="text-gray-600 text-sm mb-2">Spacious vehicles for families</p>
                  <p className="text-brand-red font-semibold">From ₦45,000/day</p>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="h-32 bg-gray-100 rounded mb-4 flex items-center justify-center">
                    <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Minivan</h3>
                  <p className="text-gray-600 text-sm mb-2">Perfect for group travel</p>
                  <p className="text-brand-red font-semibold">From ₦55,000/day</p>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="h-32 bg-gray-100 rounded mb-4 flex items-center justify-center">
                    <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Luxury</h3>
                  <p className="text-gray-600 text-sm mb-2">Premium vehicles for special occasions</p>
                  <p className="text-brand-red font-semibold">From ₦80,000/day</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}