'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PackageGallery from '@/components/packages/PackageGallery';
import PackageInfo from '@/components/packages/PackageInfo';
import PackageItinerary from '@/components/packages/PackageItinerary';
import PackageReviews from '@/components/packages/PackageReviews';
import PackageBookingCard from '@/components/packages/PackageBookingCard';
import { PackageDetails } from '@/types/api';
import { packageService } from '@/lib/services/package-service';
import { useNotifications } from '@/contexts/notification-context';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function PackageDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { addNotification } = useNotifications();
  const [packageDetails, setPackageDetails] = useState<PackageDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'itinerary' | 'reviews'>('overview');

  const packageId = params.id as string;

  useEffect(() => {
    if (packageId) {
      loadPackageDetails();
    }
  }, [packageId]);

  const loadPackageDetails = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const details = await packageService.getPackageDetails(packageId);
      setPackageDetails(details);
    } catch (error) {
      console.error('Package details error:', error);
      setError('Failed to load package details. Please try again.');
      addNotification({ 
        type: 'error', 
        title: 'Loading Failed', 
        message: 'Failed to load package details. Please try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookPackage = (selectedDate: string, participants: any[]) => {
    if (!packageDetails) return;

    // Store booking data for the purchase page
    const bookingData = {
      packageId: packageDetails.id,
      selectedDate,
      participants,
      packageDetails
    };
    
    localStorage.setItem('packageBookingData', JSON.stringify(bookingData));
    router.push(`/packages/${packageId}/purchase`);
  };

  const handleBackToPackages = () => {
    router.push('/packages');
  };

  if (isLoading) {
    return (
      <main id="main-content">
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-600">Loading package details...</p>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (error || !packageDetails) {
    return (
      <main id="main-content">
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Package Not Found</h2>
            <p className="text-gray-600 mb-6">
              {error || 'The package you are looking for could not be found.'}
            </p>
            <button
              onClick={handleBackToPackages}
              className="bg-brand-red hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
            >
              Back to Packages
            </button>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main id="main-content">
      <Header />

      {/* Breadcrumb */}
      <section className="py-4 bg-gray-50">
        <div className="container-custom">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <button
              onClick={() => router.push('/')}
              className="hover:text-brand-red transition-colors"
            >
              Home
            </button>
            <span>/</span>
            <button
              onClick={handleBackToPackages}
              className="hover:text-brand-red transition-colors"
            >
              Packages
            </button>
            <span>/</span>
            <span className="text-gray-900 font-medium">{packageDetails.title}</span>
          </nav>
        </div>
      </section>

      {/* Package Header */}
      <section className="py-8 bg-white">
        <div className="container-custom">
          <div className="mb-6">
            <h1 className="font-poppins font-bold text-4xl text-gray-900 mb-4">
              {packageDetails.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-gray-600">
              <div className="flex items-center">
                <span className="font-medium">{packageDetails.destination}</span>
              </div>
              <div className="flex items-center">
                <span>{packageDetails.duration} days</span>
              </div>
              <div className="flex items-center">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(packageDetails.rating)
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="ml-2 text-sm">
                    {packageDetails.rating} ({packageDetails.reviews.length} reviews)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 bg-gray-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Package Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Gallery */}
              <PackageGallery images={packageDetails.images} title={packageDetails.title} />

              {/* Tab Navigation */}
              <div className="bg-white rounded-lg shadow-sm">
                <div className="border-b border-gray-200">
                  <nav className="flex space-x-8 px-6">
                    <button
                      onClick={() => setActiveTab('overview')}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === 'overview'
                          ? 'border-brand-red text-brand-red'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Overview
                    </button>
                    <button
                      onClick={() => setActiveTab('itinerary')}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === 'itinerary'
                          ? 'border-brand-red text-brand-red'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Itinerary
                    </button>
                    <button
                      onClick={() => setActiveTab('reviews')}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === 'reviews'
                          ? 'border-brand-red text-brand-red'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Reviews ({packageDetails.reviews.length})
                    </button>
                  </nav>
                </div>

                <div className="p-6">
                  {activeTab === 'overview' && (
                    <PackageInfo packageDetails={packageDetails} />
                  )}
                  {activeTab === 'itinerary' && (
                    <PackageItinerary itinerary={packageDetails.itinerary} />
                  )}
                  {activeTab === 'reviews' && (
                    <PackageReviews 
                      reviews={packageDetails.reviews}
                      rating={packageDetails.rating}
                      packageId={packageDetails.id}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Booking Card */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <PackageBookingCard
                  packageDetails={packageDetails}
                  onBookPackage={handleBookPackage}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}