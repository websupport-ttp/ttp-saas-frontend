'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PackagePurchaseForm from '@/components/packages/PackagePurchaseForm';
import PackagePurchaseSummary from '@/components/packages/PackagePurchaseSummary';
import { PackageDetails, PackagePurchaseData, ParticipantInfo } from '@/types/api';
import { packageService } from '@/lib/services/package-service';
import { useNotifications } from '@/contexts/notification-context';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function PackagePurchasePage() {
  const router = useRouter();
  const params = useParams();
  const { addNotification } = useNotifications();
  const [packageDetails, setPackageDetails] = useState<PackageDetails | null>(null);
  const [bookingData, setBookingData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const packageId = params.id as string;

  useEffect(() => {
    // Load booking data from localStorage
    const storedBookingData = localStorage.getItem('packageBookingData');
    if (storedBookingData) {
      const data = JSON.parse(storedBookingData);
      setBookingData(data);
      setPackageDetails(data.packageDetails);
      setIsLoading(false);
    } else {
      // If no booking data, redirect back to package details
      router.push(`/packages/${packageId}`);
    }
  }, [packageId, router]);

  const handlePurchase = async (purchaseData: PackagePurchaseData) => {
    setIsProcessing(true);
    setError(null);

    try {
      const response = await packageService.purchasePackage(purchaseData);
      
      // Store purchase data for confirmation page
      const confirmationData = {
        ...purchaseData,
        bookingReference: response.bookingReference,
        paymentReference: response.paymentReference,
        amount: response.amount,
        currency: response.currency,
        packageDetails
      };
      
      localStorage.setItem('packagePurchaseData', JSON.stringify(confirmationData));
      
      // Redirect to payment
      if (response.authorizationUrl) {
        window.location.href = response.authorizationUrl;
      } else {
        // If no payment URL, go directly to confirmation
        router.push(`/packages/${packageId}/success?reference=${response.bookingReference}`);
      }
    } catch (error) {
      console.error('Package purchase error:', error);
      setError('Failed to process package purchase. Please try again.');
      addNotification({
        type: 'error',
        title: 'Purchase Failed',
        message: 'Failed to process package purchase. Please try again.'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBackToPackage = () => {
    router.push(`/packages/${packageId}`);
  };

  if (isLoading) {
    return (
      <main id="main-content">
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-600">Loading purchase details...</p>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (!bookingData || !packageDetails) {
    return (
      <main id="main-content">
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Booking Data Not Found</h2>
            <p className="text-gray-600 mb-6">
              Please start the booking process from the package details page.
            </p>
            <button
              onClick={handleBackToPackage}
              className="bg-brand-red hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
            >
              Back to Package
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
              onClick={() => router.push('/packages')}
              className="hover:text-brand-red transition-colors"
            >
              Packages
            </button>
            <span>/</span>
            <button
              onClick={handleBackToPackage}
              className="hover:text-brand-red transition-colors"
            >
              {packageDetails.title}
            </button>
            <span>/</span>
            <span className="text-gray-900 font-medium">Purchase</span>
          </nav>
        </div>
      </section>

      {/* Page Header */}
      <section className="py-8 bg-white">
        <div className="container-custom">
          <h1 className="font-poppins font-bold text-3xl text-gray-900 mb-2">
            Complete Your Booking
          </h1>
          <p className="text-gray-600">
            Review your details and complete the purchase for {packageDetails.title}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 bg-gray-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Purchase Form */}
            <div className="lg:col-span-2">
              <PackagePurchaseForm
                packageDetails={packageDetails}
                bookingData={bookingData}
                onPurchase={handlePurchase}
                isProcessing={isProcessing}
                error={error}
              />
            </div>

            {/* Right Column - Purchase Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <PackagePurchaseSummary
                  packageDetails={packageDetails}
                  bookingData={bookingData}
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