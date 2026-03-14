'use client';

import Link from 'next/link';

export default function SafetyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Safety & Security</h1>

          <div className="prose prose-sm max-w-none text-gray-600 space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Your Safety is Our Priority</h2>
              <p>
                At The Travel Place, we are committed to ensuring your safety and security throughout your travel journey. We implement industry-leading security measures to protect your personal and financial information.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Data Protection</h2>
              <p>
                We use SSL encryption to protect all data transmitted between your device and our servers. Your payment information is processed securely through PCI-DSS compliant payment gateways.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Travel Safety Tips</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>Always keep your travel documents secure</li>
                <li>Register with your embassy before traveling</li>
                <li>Share your itinerary with trusted contacts</li>
                <li>Purchase travel insurance for protection</li>
                <li>Keep emergency contacts readily available</li>
                <li>Stay aware of local customs and regulations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Secure Booking</h2>
              <p>
                Our booking platform uses advanced security protocols to ensure your transactions are safe. All payment information is encrypted and never stored on our servers.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Report Security Issues</h2>
              <p>
                If you discover a security vulnerability, please contact our security team immediately. We take all security concerns seriously and will investigate promptly.
              </p>
            </section>
          </div>

          <div className="mt-8 flex gap-4">
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
