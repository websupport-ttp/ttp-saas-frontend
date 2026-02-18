'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ServiceLayout } from '@/components/layout';
import { Button } from '@/components/ui/Button';
import { SimpleDatePicker } from '@/components/ui/SimpleDatePicker';
import { travelInsuranceService } from '@/lib/services/travel-insurance-service';

interface SearchFormData {
  destination: string;
  coverBegins: string;
  coverEnds: string;
  travelers: number;
}

export default function TravelInsurancePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [countries, setCountries] = useState<any[]>([]);
  
  // Search form state
  const [formData, setFormData] = useState<SearchFormData>({
    destination: '',
    coverBegins: '',
    coverEnds: '',
    travelers: 1
  });
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [isPrePopulated, setIsPrePopulated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync formData.travelers whenever adults or children change
  useEffect(() => {
    setFormData(prev => ({ ...prev, travelers: adults + children }));
  }, [adults, children]);

  useEffect(() => {
    // Load countries for the dropdown
    loadCountries();
    
    // Check if there are search parameters from URL
    const destination = searchParams.get('destination');
    const coverBegins = searchParams.get('coverBegins');
    const coverEnds = searchParams.get('coverEnds');
    const travelers = searchParams.get('travelers');

    // If URL parameters exist, populate the form
    if (destination || coverBegins || coverEnds || travelers) {
      // Parse travelers string - it could be "2 Adults, 1 Child" or just a number
      let adultsCount = 1;
      let childrenCount = 0;
      
      if (travelers) {
        // Try to parse "X Adults, Y Children" format
        const adultsMatch = travelers.match(/(\d+)\s*Adult/i);
        const childrenMatch = travelers.match(/(\d+)\s*Child/i);
        
        if (adultsMatch) {
          adultsCount = parseInt(adultsMatch[1]);
        }
        if (childrenMatch) {
          childrenCount = parseInt(childrenMatch[1]);
        }
        
        // If no match, try to parse as a single number (total travelers)
        if (!adultsMatch && !childrenMatch) {
          const travelersMatch = travelers.match(/(\d+)/);
          const travelerCount = travelersMatch ? parseInt(travelersMatch[1]) : 1;
          adultsCount = travelerCount;
          childrenCount = 0;
        }
      }

      setFormData({
        destination: destination || '',
        coverBegins: coverBegins || '',
        coverEnds: coverEnds || '',
        travelers: adultsCount + childrenCount
      });
      
      // Set adults and children based on parsed values
      setAdults(adultsCount);
      setChildren(childrenCount);
      
      setIsPrePopulated(true);
    }
  }, [searchParams]);

  const loadCountries = async () => {
    try {
      const countriesData = await travelInsuranceService.getCountries();
      setCountries(countriesData);
    } catch (error) {
      console.error('Failed to load countries:', error);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear any previous errors
    setError(null);
    
    if (!formData.destination || !formData.coverBegins || !formData.coverEnds) {
      setError('Please fill in all required fields');
      return;
    }

    // Validate dates
    const startDate = new Date(formData.coverBegins);
    const endDate = new Date(formData.coverEnds);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    if (startDate < today) {
      setError('Coverage start date cannot be in the past');
      return;
    }

    if (endDate < startDate) {
      setError('Coverage end date must be on or after start date');
      return;
    }

    setIsSubmitting(true);

    const criteria = {
      destination: formData.destination,
      coverBegins: formData.coverBegins,
      coverEnds: formData.coverEnds,
      travelers: `${formData.travelers} traveler${formData.travelers > 1 ? 's' : ''}`,
      adults: adults,
      children: children,
      totalTravelers: adults + children
    };

    // Store search criteria and redirect to traveler information form
    localStorage.setItem('insuranceSearchCriteria', JSON.stringify(criteria));
    router.push('/travel-insurance/book');
  };

  const breadcrumbs = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'Travel Insurance', href: '/travel-insurance' },
  ];

  return (
    <ServiceLayout
      title="Travel Insurance"
      description="Protect your travels with comprehensive insurance coverage"
      breadcrumbs={breadcrumbs}
      serviceName="Travel Insurance"
    >
      <div className="max-w-6xl mx-auto py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Travel Insurance
            </h1>
            <p className="text-lg text-gray-600">
              Protect your travels with comprehensive insurance coverage
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Get Your Travel Insurance Quote
            </h2>

            {/* Pre-populated form notice */}
            {isPrePopulated && (
              <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-800 mb-1">Form Pre-filled</h4>
                    <p className="text-sm text-blue-700">
                      Your search details have been automatically filled in. You can modify them below or click "Continue" to proceed.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-6">
              {/* Destination */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Destination Country *
                </label>
                <select
                  value={formData.destination}
                  onChange={(e) => setFormData(prev => ({ ...prev, destination: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  required
                >
                  <option value="">Select destination country</option>
                  {countries.map(country => (
                    <option key={country.id} value={country.name}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Travel Dates */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Coverage Start Date *
                  </label>
                  <SimpleDatePicker
                    value={formData.coverBegins}
                    onChange={(date) => setFormData(prev => ({ ...prev, coverBegins: date }))}
                    placeholder="Select start date"
                    minDate={new Date().toISOString().split('T')[0]}
                    required={true}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Coverage End Date *
                  </label>
                  <SimpleDatePicker
                    value={formData.coverEnds}
                    onChange={(date) => setFormData(prev => ({ ...prev, coverEnds: date }))}
                    placeholder="Select end date"
                    minDate={formData.coverBegins || new Date().toISOString().split('T')[0]}
                    required={true}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
              </div>

              {/* Number of Travelers */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Adults *
                  </label>
                  <select
                    value={adults}
                    onChange={(e) => setAdults(parseInt(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'Adult' : 'Adults'}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">18 years and above</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Children
                  </label>
                  <select
                    value={children}
                    onChange={(e) => setChildren(parseInt(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  >
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'Child' : 'Children'}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Under 18 years</p>
                </div>
              </div>

              {/* Total Travelers Display */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">
                  Total Travelers: <span className="font-semibold text-gray-900">{adults + children}</span>
                  {adults + children > 0 && (
                    <span className="text-gray-500 ml-2">
                      ({adults} {adults === 1 ? 'Adult' : 'Adults'}
                      {children > 0 ? `, ${children} ${children === 1 ? 'Child' : 'Children'}` : ''})
                    </span>
                  )}
                </p>
              </div>

              {/* Error Display */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-red-800 mb-1">Error</h4>
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-red-500 hover:bg-red-600 text-white py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    'Continue to Traveler Information'
                  )}
                </Button>
              </div>
            </form>
          </div>

          {/* Information section */}
          <div className="mt-12 bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">
              Why Choose Travel Insurance?
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-800">
              <div className="flex items-start space-x-2">
                <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                <span>Protect against unexpected medical expenses abroad</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                <span>Coverage for trip cancellations and interruptions</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                <span>Baggage loss and delay compensation</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                <span>24/7 emergency assistance worldwide</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ServiceLayout>
  );
}
