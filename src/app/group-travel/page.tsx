'use client';

import Link from 'next/link';

export default function GroupTravelPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Group Travel</h1>
          
          <p className="text-gray-600 mb-6">
            Planning a group trip? We offer special packages and discounts for group travel arrangements.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-blue-900 mb-2">Group Travel Services</h2>
            <p className="text-blue-800 mb-4">
              We provide customized travel solutions for groups including:
            </p>
            <ul className="list-disc list-inside text-blue-800 space-y-2">
              <li>Bulk flight bookings with group discounts</li>
              <li>Hotel accommodations for large parties</li>
              <li>Car rental packages for group transportation</li>
              <li>Visa assistance for group applications</li>
              <li>Travel insurance for groups</li>
              <li>Dedicated group travel coordinator</li>
            </ul>
          </div>

          <div className="flex gap-4">
            <Link
              href="/contact"
              className="inline-block px-6 py-2 bg-brand-red text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Request Group Quote
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
