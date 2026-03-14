'use client';

import Link from 'next/link';

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Cookie Policy</h1>

          <div className="prose prose-sm max-w-none text-gray-600 space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">What are Cookies?</h2>
              <p>
                Cookies are small text files that are stored on your device when you visit our website. They help us remember your preferences and improve your browsing experience.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">How We Use Cookies</h2>
              <p>We use cookies for:</p>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li>Authentication and session management</li>
                <li>Remembering your preferences</li>
                <li>Analytics and performance monitoring</li>
                <li>Improving user experience</li>
                <li>Security and fraud prevention</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Types of Cookies</h2>
              <p>
                <strong>Essential Cookies:</strong> Required for the website to function properly. These cannot be disabled.
              </p>
              <p className="mt-2">
                <strong>Analytics Cookies:</strong> Help us understand how visitors use our website.
              </p>
              <p className="mt-2">
                <strong>Preference Cookies:</strong> Remember your choices and settings.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Managing Cookies</h2>
              <p>
                You can control cookies through your browser settings. Most browsers allow you to refuse cookies or alert you when cookies are being sent. However, blocking cookies may affect website functionality.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Contact Us</h2>
              <p>
                If you have questions about our cookie policy, please contact us through the contact page.
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
              href="/privacy"
              className="inline-block px-6 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
