'use client';

import Link from 'next/link';

export default function InsurancePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Travel Insurance</h1>
          
          <p className="text-gray-600 mb-6">
            Travel insurance is coming soon! We're working on bringing you comprehensive travel insurance options to protect your trips.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-blue-900 mb-2">Coming Soon</h2>
            <p className="text-blue-800">
              In the meantime, check out our other services or contact us for more information about travel insurance options.
            </p>
          </div>

          <div className="flex gap-4">
            <Link
              href="/"
              className="inline-block px-6 py-2 bg-brand-red text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Back to Home
            </Link>
            <Link
              href="/contact"
              className="inline-block px-6 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
