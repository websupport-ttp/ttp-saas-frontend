'use client';

import Link from 'next/link';

export default function AccessibilityPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Accessibility Statement</h1>

          <div className="prose prose-sm max-w-none text-gray-600 space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Our Commitment</h2>
              <p>
                The Travel Place is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying relevant accessibility standards.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Accessibility Features</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>Keyboard navigation support</li>
                <li>Screen reader compatibility</li>
                <li>High contrast mode support</li>
                <li>Adjustable text sizes</li>
                <li>Alternative text for images</li>
                <li>Descriptive link text</li>
                <li>Form labels and error messages</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Standards Compliance</h2>
              <p>
                We strive to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards. Our website is designed to be accessible to all users, regardless of their abilities.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Accessibility Tools</h2>
              <p>
                Most browsers include built-in accessibility features. You can adjust text size, enable high contrast mode, and use keyboard shortcuts to navigate our website more easily.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Report Accessibility Issues</h2>
              <p>
                If you encounter any accessibility barriers while using our website, please contact us. We welcome your feedback and will work to resolve any issues promptly.
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
