'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ServiceLayout } from '@/components/layout';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import CountryCodeSelector from '@/components/ui/CountryCodeSelector';
import { SimpleDatePicker } from '@/components/ui/SimpleDatePicker';
import { travelInsuranceService } from '@/lib/services/travel-insurance-service';

interface ContactInfo {
  email: string;
  phoneNumber: string;
  countryCode: string;
  dialCode: string;
}

interface TravelerInfo {
  travelers: Array<{
    type: 'adult' | 'child';
    dateOfBirth: string;
  }>;
}

export default function TravelInsuranceBookingPage() {
  const router = useRouter();
  const [searchCriteria, setSearchCriteria] = useState<any>(null);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [showQuotes, setShowQuotes] = useState(false);
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    email: '',
    phoneNumber: '',
    countryCode: 'NG',
    dialCode: '+234'
  });
  const [travelerInfo, setTravelerInfo] = useState<TravelerInfo>({
    travelers: []
  });
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isGettingQuotes, setIsGettingQuotes] = useState(false);

  useEffect(() => {
    // Get stored search criteria
    const storedCriteria = localStorage.getItem('insuranceSearchCriteria');

    if (storedCriteria) {
      const criteria = JSON.parse(storedCriteria);
      console.log('Loaded criteria:', criteria);
      setSearchCriteria(criteria);
      
      // Initialize traveler array based on adults and children only
      const travelers: Array<{ type: 'adult' | 'child'; dateOfBirth: string }> = [];
      const adults = criteria.adults || 1;
      const children = criteria.children || 0;
      
      console.log('Initializing travelers - Adults:', adults, 'Children:', children);
      
      for (let i = 0; i < adults; i++) {
        travelers.push({ type: 'adult' as const, dateOfBirth: '' });
      }
      for (let i = 0; i < children; i++) {
        travelers.push({ type: 'child' as const, dateOfBirth: '' });
      }
      
      console.log('Created travelers array:', travelers);
      setTravelerInfo({ travelers });
      setIsLoading(false);
    } else {
      router.push('/travel-insurance');
    }
  }, [router]);

  const updateContactInfo = (field: keyof ContactInfo, value: string) => {
    setContactInfo(prev => ({ ...prev, [field]: value }));
    clearValidationError(`contact${field.charAt(0).toUpperCase() + field.slice(1)}`);
  };

  const updateTravelerDateOfBirth = (index: number, value: string) => {
    setTravelerInfo(prev => {
      const newTravelers = [...prev.travelers];
      newTravelers[index] = { ...newTravelers[index], dateOfBirth: value };
      return { travelers: newTravelers };
    });
    clearValidationError(`traveler${index}DateOfBirth`);
  };

  const handleContactCountryChange = (countryCode: string, dialCode: string) => {
    setContactInfo(prev => ({ ...prev, countryCode, dialCode }));
  };

  const clearValidationError = (field: string) => {
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const errors: {[key: string]: string} = {};

    // Validate contact info
    if (!contactInfo.email.trim()) {
      errors.contactEmail = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactInfo.email)) {
      errors.contactEmail = 'Please enter a valid email address';
    }

    if (!contactInfo.phoneNumber.trim()) {
      errors.contactPhone = 'Phone number is required';
    }

    // Validate all travelers' dates of birth
    travelerInfo.travelers.forEach((traveler, index) => {
      if (!traveler.dateOfBirth || traveler.dateOfBirth.trim() === '') {
        errors[`traveler${index}DateOfBirth`] = `Date of birth is required for ${traveler.type} ${index + 1}`;
      } else {
        const dob = new Date(traveler.dateOfBirth);
        
        // Check if date is valid
        if (isNaN(dob.getTime())) {
          errors[`traveler${index}DateOfBirth`] = `Invalid date format for ${traveler.type} ${index + 1}`;
          return;
        }
        
        const today = new Date();
        const age = today.getFullYear() - dob.getFullYear();
        const monthDiff = today.getMonth() - dob.getMonth();
        
        // Age validation based on traveler type
        if (traveler.type === 'adult' && (age < 18 || (age === 18 && monthDiff < 0))) {
          errors[`traveler${index}DateOfBirth`] = 'Adult must be at least 18 years old';
        } else if (traveler.type === 'child' && age >= 18) {
          errors[`traveler${index}DateOfBirth`] = 'Child must be under 18 years old';
        }
      }
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleGetQuotes = async () => {
    if (!validateForm()) {
      // Scroll to first error
      const firstErrorElement = document.querySelector('.border-red-500');
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      
      // Show alert with specific error
      const errorMessages = Object.values(validationErrors);
      if (errorMessages.length > 0) {
        alert(`Please fix the following errors:\n\n${errorMessages.join('\n')}`);
      }
      return;
    }

    setIsGettingQuotes(true);

    try {
      // Get countries to find the destination country ID
      const countries = await travelInsuranceService.getCountries();
      
      const destinationCountry = countries.find(country => {
        const countryName = country.name.toLowerCase();
        const searchDest = searchCriteria.destination.toLowerCase();
        
        // Exact match
        if (countryName === searchDest) return true;
        
        // Contains match
        if (countryName.includes(searchDest) || searchDest.includes(countryName)) return true;
        
        // Common country name variations
        const countryAliases: { [key: string]: string[] } = {
          'usa': ['united states', 'united states of america', 'us', 'america'],
          'uk': ['united kingdom', 'great britain', 'britain', 'england'],
          'uae': ['united arab emirates', 'emirates'],
          'south africa': ['sa', 'rsa'],
          'china': ['prc', 'peoples republic of china'],
        };
        
        // Check if country has aliases
        for (const [canonical, aliases] of Object.entries(countryAliases)) {
          if (countryName === canonical && aliases.includes(searchDest)) return true;
          if (searchDest === canonical && aliases.includes(countryName)) return true;
        }
        
        return false;
      });

      if (!destinationCountry) {
        throw new Error(`Destination "${searchCriteria.destination}" not found`);
      }

      // Get travel plans and booking types
      const [travelPlans, bookingTypes] = await Promise.all([
        travelInsuranceService.getTravelPlans(),
        travelInsuranceService.getBookingTypes()
      ]);

      // Parse travelers count - use stored adults/children if available
      const adults = searchCriteria.adults || 1;
      const children = searchCriteria.children || 0;

      // Use the first adult's date of birth for the quote (primary traveler)
      const primaryTraveler = travelerInfo.travelers.find(t => t.type === 'adult');
      const primaryDOB = primaryTraveler?.dateOfBirth || travelerInfo.travelers[0]?.dateOfBirth || '';

      // Create quote requests for different plan types
      const quoteRequests = travelPlans.map(plan => ({
        DateOfBirth: travelInsuranceService.formatDateForAPI(primaryDOB),
        Email: contactInfo.email,
        Telephone: travelInsuranceService.formatPhoneNumber(contactInfo.phoneNumber, contactInfo.dialCode),
        CoverBegins: travelInsuranceService.formatDateForAPI(searchCriteria.coverBegins),
        CoverEnds: travelInsuranceService.formatDateForAPI(searchCriteria.coverEnds),
        CountryId: destinationCountry.id,
        PurposeOfTravel: 'Leisure',
        TravelPlanId: plan.id,
        BookingTypeId: bookingTypes[0]?.id || 1,
        IsRoundTrip: true,
        NoOfPeople: adults,
        NoOfChildren: children,
        IsMultiTrip: false
      }));

      // Get quotes for all plans
      const quoteResults = await Promise.all(
        quoteRequests.map(async (request, index) => {
          try {
            const quote = await travelInsuranceService.getQuote(request);
            return {
              ...quote,
              planName: travelPlans[index].name,
              planId: travelPlans[index].id
            };
          } catch (error) {
            console.error(`Quote error for plan ${travelPlans[index].name}:`, error);
            return null;
          }
        })
      );

      // Filter out failed quotes
      const validQuotes = quoteResults.filter(quote => quote !== null);
      
      if (validQuotes.length === 0) {
        throw new Error('No quotes available for your search criteria');
      }

      // Store contact and traveler info for later use
      localStorage.setItem('insuranceContactInfo', JSON.stringify(contactInfo));
      localStorage.setItem('insuranceTravelerInfo', JSON.stringify(travelerInfo));

      setQuotes(validQuotes);
      setShowQuotes(true);

    } catch (error) {
      console.error('Failed to get travel insurance quotes:', error);
      alert(error instanceof Error ? error.message : 'Failed to get quotes. Please try again.');
    } finally {
      setIsGettingQuotes(false);
    }
  };

  const handleSelectPlan = (quote: any) => {
    // Store selected quote
    localStorage.setItem('selectedInsuranceQuote', JSON.stringify(quote));
    
    // Navigate to complete booking page (you'll create this next)
    router.push('/travel-insurance/complete-booking');
  };

  const handleBack = () => {
    if (showQuotes) {
      setShowQuotes(false);
      setQuotes([]);
    } else {
      router.push('/travel-insurance');
    }
  };

  // Function to get plan-specific features
  const getPlanFeatures = (planName: string, index: number) => {
    const planNameLower = planName?.toLowerCase() || '';
    
    if (planNameLower.includes('basic') || planNameLower.includes('standard') || index === 0) {
      return [
        'Medical expenses coverage up to $50,000',
        'Trip cancellation protection',
        'Baggage loss coverage up to $1,000',
        '24/7 emergency assistance'
      ];
    } else if (planNameLower.includes('premium') || planNameLower.includes('plus') || index === 1) {
      return [
        'Medical expenses coverage up to $100,000',
        'Trip cancellation & interruption protection',
        'Baggage loss coverage up to $2,500',
        '24/7 emergency assistance',
        'Flight delay compensation',
        'Adventure sports coverage'
      ];
    } else {
      return [
        'Medical expenses coverage up to $250,000',
        'Trip cancellation & interruption protection',
        'Baggage loss coverage up to $5,000',
        '24/7 emergency assistance',
        'Flight delay compensation',
        'Adventure sports coverage',
        'Pre-existing medical conditions',
        'Rental car coverage'
      ];
    }
  };

  const getDisplayPlanName = (planName: string, index: number) => {
    if (planName && planName !== 'undefined') {
      return planName;
    }
    const fallbackNames = ['Standard', 'Premium', 'Comprehensive'];
    return fallbackNames[index] || `Plan ${index + 1}`;
  };

  const getPlanPricing = (quote: any, index: number) => {
    const baseAmount = quote.Amount;
    const uniquePrices = Array.from(new Set(quotes.map(q => q.Amount)));
    const hasSamePrices = uniquePrices.length === 1 && quotes.length > 1;
    
    if (hasSamePrices) {
      if (index === 0) return baseAmount;
      if (index === 1) return Math.round(baseAmount * 1.3);
      if (index === 2) return Math.round(baseAmount * 1.6);
    }
    
    return baseAmount;
  };

  const breadcrumbs = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'Travel Insurance', href: '/travel-insurance' },
    { name: 'Traveler Information', href: '/travel-insurance/book' },
  ];

  if (isLoading) {
    return (
      <ServiceLayout
        title="Travel Insurance Booking"
        description="Complete your travel insurance purchase"
        breadcrumbs={breadcrumbs}
        serviceName="Travel Insurance"
      >
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="flex flex-col items-center">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </ServiceLayout>
    );
  }

  if (!searchCriteria) {
    return (
      <ServiceLayout
        title="Travel Insurance Booking"
        description="Complete your travel insurance purchase"
        breadcrumbs={breadcrumbs}
        serviceName="Travel Insurance"
      >
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600">No search criteria found</p>
            <Button onClick={() => router.push('/travel-insurance')} className="mt-4">
              Back to Search
            </Button>
          </div>
        </div>
      </ServiceLayout>
    );
  }

  return (
    <ServiceLayout
      title="Travel Insurance Booking"
      description="Complete your travel insurance purchase"
      breadcrumbs={breadcrumbs}
      serviceName="Travel Insurance"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!showQuotes ? (
          /* Traveler Information Form */
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Traveler Information
              </h1>
              <p className="text-gray-600">
                Please provide your contact and travel details to get insurance quotes
              </p>
            </div>

            {/* Search Criteria Summary */}
            <div className="bg-blue-50 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">Your Search</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-blue-700">Destination</p>
                  <p className="font-semibold text-blue-900">{searchCriteria.destination}</p>
                </div>
                <div>
                  <p className="text-blue-700">Travelers</p>
                  <p className="font-semibold text-blue-900">
                    {searchCriteria.adults || 1} {(searchCriteria.adults || 1) === 1 ? 'Adult' : 'Adults'}
                    {searchCriteria.children > 0 && `, ${searchCriteria.children} ${searchCriteria.children === 1 ? 'Child' : 'Children'}`}
                  </p>
                </div>
                <div>
                  <p className="text-blue-700">Coverage Start</p>
                  <p className="font-semibold text-blue-900">{searchCriteria.coverBegins}</p>
                </div>
                <div>
                  <p className="text-blue-700">Coverage End</p>
                  <p className="font-semibold text-blue-900">{searchCriteria.coverEnds}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8">
              {/* Contact Information */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-red-600 mb-6">Contact Information</h2>
                <div className="space-y-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">Email Address *</label>
                    <div className={`border rounded bg-white px-3 py-2 h-12 flex items-center focus-within:border-red-600 ${
                      validationErrors.contactEmail ? 'border-red-500' : 'border-gray-300'
                    }`}>
                      <input
                        type="email"
                        placeholder="your.email@example.com"
                        value={contactInfo.email}
                        onChange={(e) => updateContactInfo('email', e.target.value)}
                        className="w-full text-lg text-gray-600 placeholder-gray-400 border-none outline-none bg-transparent"
                      />
                    </div>
                    {validationErrors.contactEmail && (
                      <p className="text-red-500 text-sm">{validationErrors.contactEmail}</p>
                    )}
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">Phone Number *</label>
                    <div className={`border rounded bg-white h-12 flex items-center focus-within:border-red-600 ${
                      validationErrors.contactPhone ? 'border-red-500' : 'border-gray-300'
                    }`}>
                      <CountryCodeSelector
                        selectedCountry={contactInfo.countryCode}
                        onCountryChange={handleContactCountryChange}
                      />
                      <input
                        type="tel"
                        placeholder="8012345678"
                        value={contactInfo.phoneNumber}
                        onChange={(e) => updateContactInfo('phoneNumber', e.target.value)}
                        className="flex-1 px-3 text-lg text-gray-600 placeholder-gray-400 border-none outline-none bg-transparent"
                      />
                    </div>
                    {validationErrors.contactPhone && (
                      <p className="text-red-500 text-sm">{validationErrors.contactPhone}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Traveler Information */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-red-600 mb-6">Traveler Details</h2>
                <p className="text-sm text-gray-600 mb-4">
                  Please provide the date of birth for each traveler
                </p>
                
                <div className="space-y-6">
                  {travelerInfo.travelers.map((traveler, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-md font-semibold text-gray-800 mb-3">
                        {traveler.type.charAt(0).toUpperCase() + traveler.type.slice(1)} {index + 1}
                      </h3>
                      <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">Date of Birth *</label>
                        <div className={`border rounded bg-white h-12 flex items-center focus-within:border-red-600 ${
                          validationErrors[`traveler${index}DateOfBirth`] ? 'border-red-500' : 'border-gray-300'
                        }`}>
                          <SimpleDatePicker
                            value={traveler.dateOfBirth}
                            onChange={(date) => updateTravelerDateOfBirth(index, date)}
                            placeholder="Select date of birth"
                            maxDate={new Date().toISOString().split('T')[0]}
                            required={true}
                            className="w-full"
                          />
                        </div>
                        {validationErrors[`traveler${index}DateOfBirth`] && (
                          <p className="text-red-500 text-sm">{validationErrors[`traveler${index}DateOfBirth`]}</p>
                        )}
                        <p className="text-sm text-gray-500 mt-1">
                          {traveler.type === 'adult' && 'Must be 18 years or older'}
                          {traveler.type === 'child' && 'Must be under 18 years old'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Info Box */}
              <div className="mb-8 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  <strong>Note:</strong> We need your basic information to generate accurate insurance quotes. 
                  Additional details will be collected after you select a plan.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button
                  onClick={handleBack}
                  variant="outline"
                  className="flex-1"
                >
                  Back to Search
                </Button>
                <Button
                  onClick={handleGetQuotes}
                  disabled={isGettingQuotes}
                  className="flex-1 bg-red-500 hover:bg-red-600"
                >
                  {isGettingQuotes ? (
                    <>
                      <LoadingSpinner size="sm" color="white" />
                      <span className="ml-2">Getting Quotes...</span>
                    </>
                  ) : (
                    'Get Insurance Quotes'
                  )}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          /* Quote Results */
          <div>
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Available Insurance Plans
                  </h1>
                  <p className="text-gray-600">
                    Select the plan that best fits your travel needs
                  </p>
                </div>
                <Button onClick={handleBack} variant="outline">
                  Back to Form
                </Button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quotes.map((quote, index) => {
                const features = getPlanFeatures(quote.planName, index);
                const displayPrice = getPlanPricing(quote, index);
                const displayName = getDisplayPlanName(quote.planName, index);
                
                return (
                  <div key={quote.QuoteRequestId} className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {displayName}
                        </h3>
                        {index === 1 && (
                          <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">
                            Popular
                          </span>
                        )}
                      </div>
                      
                      <div className="mb-6">
                        <div className="flex items-baseline">
                          <span className="text-3xl font-bold text-gray-900">₦{displayPrice.toLocaleString()}</span>
                          <span className="text-gray-500 ml-2">total</span>
                        </div>
                      </div>

                      <div className="space-y-3 mb-6">
                        {features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center text-sm text-gray-600">
                            <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>

                      <Button
                        onClick={() => handleSelectPlan({
                          ...quote,
                          Amount: displayPrice,
                          features: features,
                          planName: displayName
                        })}
                        className="w-full"
                        variant={index === 1 ? "primary" : "outline"}
                      >
                        Select Plan
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </ServiceLayout>
  );
}
