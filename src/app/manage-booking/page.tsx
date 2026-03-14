'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ManageBookingPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Manage Your Bookings</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Link
              href="/bookings"
              className="block p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg hover:shadow-lg transition-shadow"
            >
              <h3 className="text-lg font-semibold text-blue-900 mb-2">View All Bookings</h3>
              <p className="text-blue-700">See all your flight, hotel, and car rental bookings in one place.</p>
            </Link>

            <Link
              href="/dashboard"
              className="block p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg hover:shadow-lg transition-shadow"
            >
              <h3 className="text-lg font-semibold text-green-900 mb-2">Dashboard</h3>
              <p className="text-green-700">Access your personal dashboard and booking history.</p>
            </Link>

            <Link
              href="/contact"
              className="block p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-lg hover:shadow-lg transition-shadow"
            >
              <h3 className="text-lg font-semibold text-red-900 mb-2">Need Help?</h3>
              <p className="text-red-700">Contact our support team for assistance with your bookings.</p>
            </Link>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-blue-900 mb-3">Quick Tips</h2>
            <ul className="lis
t-disc list-inside text-blue-800 space-y-2">
              <li>Check your booking reference number</li>
              <li>Review cancellation and modification policies</li>
              <li>Download your booking confirmation</li>
              <li>Contact support for special requests</li>
            </ul>
          </div>

          <div className="mt-8 flex gap-4">
            <Link
              href="/bookings"
              className="inline-block px-6 py-2 bg-brand-red text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              View My Bookings
            </Link>
            <Link
              href="/"
              className="inline-block px-6 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
