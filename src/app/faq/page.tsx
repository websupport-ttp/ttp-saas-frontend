'use client';

import Link from 'next/link';
import { useState } from 'react';

const faqs = [
  {
    question: 'How do I book a flight?',
    answer: 'Visit our flights page, enter your travel details, and follow the booking process. You can search for flights, compare prices, and book directly through our platform.'
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards, debit cards, and online payment methods through our secure Paystack payment gateway.'
  },
  {
    question: 'Can I modify or cancel my booking?',
    answer: 'Yes, you can manage your bookings through your dashboard. Modification and cancellation policies depend on the service provider and booking terms.'
  },
  {
    question: 'How long does visa processing take?',
    answer: 'Visa processing times vary by country and visa type. Our visa assistance team will provide you with estimated timelines for your specific application.'
  },
  {
    question: 'Is my personal information secure?',
    answer: 'Yes, we use industry-standard encryption and security measures to protect your personal and payment information.'
  },
  {
    question: 'How do I contact customer support?',
    answer: 'You can reach our support team through the contact page, email, or phone. We\'re available 24/7 to assist you.'
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Frequently Asked Questions</h1>
          <p className="text-gray-600">Find answers to common questions about our services.</p>
        </div>

        <div className="bg-white rounded-lg shadow-md divide-y">
          {faqs.map((faq, index) => (
            <div key={index} className="p-6">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full text-left flex justify-between items-center hover:text-brand-red transition-colors"
              >
                <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
                <span className="text-2xl text-gray-400">
                  {openIndex === index ? '−' : '+'}
                </span>
              </button>
              {openIndex === index && (
                <p className="mt-4 text-gray-600 leading-relaxed">{faq.answer}</p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">Didn't find what you're looking for?</p>
          <Link
            href="/contact"
            className="inline-block px-6 py-2 bg-brand-red text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
