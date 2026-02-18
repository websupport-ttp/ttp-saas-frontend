'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ServiceLayout } from '@/components/layout';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

import { travelInsuranceService } from '@/lib/services/travel-insurance-service';

export default function CompleteBookingPage() {
  const router = useRouter();
  const [selectedQuote, setSelectedQuote] = useState<any>(null);
  const [searchCriteria, setSearchCriteria] = useState<any>(null);
  const [contactInfo, setContactInfo] = useState<any>(null);
  const [travelerInfo, setTravelerInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Lookup data
  const [titles, setTitles] = useState<any[]>([]);
  const [genders, setGenders] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [maritalStatuses, setMaritalStatuses] = useState<any[]>([]);
  
  // Form data
  const [formData, setFormData] = useState({
    titleId: '',
    firstName: '',
    middleName: '',
    surname: '',
    genderId: '',
    stateId: '',
    address: '',
    zipCode: '',
    nationality: 'Nigeria',
    passportNo: '',
    occupation: '',
    maritalStatusId: '',
    hasMedicalCondition: false,
    medicalCondition: '',
    nokFullName: '',
    nokAddress: '',
    nokRelationship: '',
    nokPhone: ''
  });
  
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    loadData();
  }, [router]);

  const loadData = async () => {
    try {
      // Get stored data
      const storedQuote = localStorage.getItem('selectedInsuranceQuote');
      const storedCriteria = localStorage.getItem('insuranceSearchCriteria');
      const storedContact = localStorage.getItem('insuranceContactInfo');
      const storedTraveler = localStorage.getItem('insuranceTravelerInfo');

      if (!storedQuote || !storedCriteria || !storedContact || !storedTraveler) {
        router.push('/travel-insurance');
        return;
      }

      setSelectedQuote(JSON.parse(storedQuote));
      setSearchCriteria(JSON.parse(storedCriteria));
      setContactInfo(JSON.parse(storedContact));
      setTravelerInfo(JSON.parse(storedTraveler));

      // Load lookup data
      const [titlesData, gendersData, statesData, maritalData] = await Promise.all([
        travelInsuranceService.getTitles(),
        travelInsuranceService.getGenders(),
        travelInsuranceService.getStates(),
        travelInsuranceService.getMaritalStatuses()
      ]);

      setTitles(titlesData);
      setGenders(gendersData);
      setStates(statesData);
      setMaritalStatuses(maritalData);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to load data:', error);
      alert('Failed to load booking form. Please try again.');
      router.push('/travel-insurance');
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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

    if (!formData.titleId) errors.titleId = 'Title is required';
    if (!formData.firstName.trim()) errors.firstName = 'First name is required';
    if (!formData.surname.trim()) errors.surname = 'Surname is required';
    if (!formData.genderId) errors.genderId = 'Gender is required';
    if (!formData.stateId) errors.stateId = 'State is required';
    if (!formData.address.trim()) errors.address = 'Address is required';
    if (!formData.zipCode.trim()) errors.zipCode = 'Zip code is required';
    if (!formData.nationality.trim()) errors.nationality = 'Nationality is required';
    if (!formData.passportNo.trim()) errors.passportNo = 'Passport number is required';
    if (!formData.occupation.trim()) errors.occupation = 'Occupation is required';
    if (!formData.maritalStatusId) errors.maritalStatusId = 'Marital status is required';
    
    if (formData.hasMedicalCondition && !formData.medicalCondition.trim()) {
      errors.medicalCondition = 'Please describe your medical condition';
    }
    
    if (!formData.nokFullName.trim()) errors.nokFullName = 'Next of kin name is required';
    if (!formData.nokAddress.trim()) errors.nokAddress = 'Next of kin address is required';
    if (!formData.nokRelationship.trim()) errors.nokRelationship = 'Relationship is required';
    if (!formData.nokPhone.trim()) errors.nokPhone = 'Next of kin phone is required';

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      const firstErrorElement = document.querySelector('.border-red-500');
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);

    try {
      // Get primary traveler's date of birth (first adult or first traveler)
      const primaryTraveler = travelerInfo.travelers?.find((t: any) => t.type === 'adult');
      const primaryDOB = primaryTraveler?.dateOfBirth || travelerInfo.travelers?.[0]?.dateOfBirth || travelerInfo.dateOfBirth || '';

      console.log('🔍 Full Traveler Info from localStorage:', JSON.stringify(travelerInfo, null, 2));
      console.log('🔍 Primary Traveler:', primaryTraveler);
      console.log('🔍 Primary DOB (raw):', primaryDOB);
      console.log('🔍 Primary DOB type:', typeof primaryDOB);
      console.log('🔍 Primary DOB length:', primaryDOB?.length);

      // Validate that we have a date of birth
      if (!primaryDOB || primaryDOB.trim() === '') {
        alert('Date of birth is required. Please go back and provide traveler information.');
        setIsSubmitting(false);
        return;
      }

      // Validate date format before proceeding
      const dobDate = new Date(primaryDOB);
      if (isNaN(dobDate.getTime())) {
        alert(`Invalid date of birth format: ${primaryDOB}. Please go back and select a valid date.`);
        setIsSubmitting(false);
        return;
      }

      console.log('✅ Date validation passed. Formatting date...');
      const formattedDOB = travelInsuranceService.formatDateForAPI(primaryDOB);
      console.log('✅ Formatted DOB:', formattedDOB);

      const purchaseRequest = {
        QuoteId: selectedQuote.QuoteRequestId,
        Surname: formData.surname,
        MiddleName: formData.middleName || '',
        FirstName: formData.firstName,
        GenderId: parseInt(formData.genderId),
        TitleId: parseInt(formData.titleId),
        DateOfBirth: formattedDOB,
        Email: contactInfo.email,
        Telephone: travelInsuranceService.formatPhoneNumber(contactInfo.phoneNumber, contactInfo.dialCode),
        StateId: parseInt(formData.stateId),
        Address: formData.address,
        ZipCode: formData.zipCode,
        Nationality: formData.nationality,
        PassportNo: formData.passportNo,
        Occupation: formData.occupation,
        MaritalStatusId: parseInt(formData.maritalStatusId),
        PreExistingMedicalCondition: formData.hasMedicalCondition,
        MedicalCondition: formData.hasMedicalCondition ? formData.medicalCondition : '',
        NextOfKin: {
          FullName: formData.nokFullName,
          Address: formData.nokAddress,
          Relationship: formData.nokRelationship,
          Telephone: travelInsuranceService.formatPhoneNumber(formData.nokPhone, '+234')
        }
      };

      console.log('📤 Purchase Request:', purchaseRequest);

      const result = await travelInsuranceService.purchaseIndividual({
        quoteId: selectedQuote.QuoteRequestId,
        customerDetails: purchaseRequest,
        paymentDetails: {
          callback_url: `${window.location.origin}/success?service=insurance`,
          currency: 'NGN'
        }
      });

      if (result.success && result.paymentUrl) {
        if (result.bookingReference) {
          localStorage.setItem('insuranceBookingReference', result.bookingReference);
        }
        window.location.href = result.paymentUrl;
      } else {
        throw new Error(result.error || 'Failed to initiate payment');
      }
    } catch (error) {
      console.error('❌ Purchase error:', error);
      alert(`Purchase failed: ${error instanceof Error ? error.message : 'Please try again.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const breadcrumbs = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'Travel Insurance', href: '/travel-insurance' },
    { name: 'Complete Booking', href: '/travel-insurance/complete-booking' },
  ];

  if (isLoading) {
    return (
      <ServiceLayout
        title="Complete Booking"
        description="Complete your travel insurance purchase"
        breadcrumbs={breadcrumbs}
        serviceName="Travel Insurance"
      >
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center flex flex-col items-center">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-600">Loading booking form...</p>
          </div>
        </div>
      </ServiceLayout>
    );
  }

  if (!selectedQuote) {
    return (
      <ServiceLayout
        title="Complete Booking"
        description="Complete your travel insurance purchase"
        breadcrumbs={breadcrumbs}
        serviceName="Travel Insurance"
      >
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600">No quote selected</p>
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
      title="Complete Booking"
      description="Complete your travel insurance purchase"
      breadcrumbs={breadcrumbs}
      serviceName="Travel Insurance"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-2">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Complete Your Booking</h1>
            
            {/* Info about multiple travelers */}
            {travelerInfo?.travelers && travelerInfo.travelers.length > 1 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-800 mb-1">Multiple Travelers</h4>
                    <p className="text-sm text-blue-700">
                      You're booking for {travelerInfo.travelers.length} travelers. Please provide the primary traveler's information below. 
                      Additional traveler details will be collected after payment confirmation.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Personal Information */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-bold text-red-600 mb-2">
                {travelerInfo?.travelers && travelerInfo.travelers.length > 1 
                  ? 'Primary Traveler Information' 
                  : 'Personal Information'}
              </h2>
              {travelerInfo?.travelers && travelerInfo.travelers.length > 1 && (
                <p className="text-sm text-gray-600 mb-4">
                  Traveler 1 of {travelerInfo.travelers.length} - {travelerInfo.travelers[0].type.charAt(0).toUpperCase() + travelerInfo.travelers[0].type.slice(1)}
                </p>
              )}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                  <select
                    value={formData.titleId}
                    onChange={(e) => updateFormData('titleId', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg ${validationErrors.titleId ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <option value="">Select title</option>
                    {titles.map(title => (
                      <option key={title.id} value={title.id}>{title.name}</option>
                    ))}
                  </select>
                  {validationErrors.titleId && <p className="text-red-500 text-sm mt-1">{validationErrors.titleId}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
                  <select
                    value={formData.genderId}
                    onChange={(e) => updateFormData('genderId', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg ${validationErrors.genderId ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <option value="">Select gender</option>
                    {genders.map(gender => (
                      <option key={gender.id} value={gender.id}>{gender.name}</option>
                    ))}
                  </select>
                  {validationErrors.genderId && <p className="text-red-500 text-sm mt-1">{validationErrors.genderId}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => updateFormData('firstName', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg ${validationErrors.firstName ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="First name"
                  />
                  {validationErrors.firstName && <p className="text-red-500 text-sm mt-1">{validationErrors.firstName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Middle Name</label>
                  <input
                    type="text"
                    value={formData.middleName}
                    onChange={(e) => updateFormData('middleName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Middle name (optional)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Surname *</label>
                  <input
                    type="text"
                    value={formData.surname}
                    onChange={(e) => updateFormData('surname', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg ${validationErrors.surname ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Surname"
                  />
                  {validationErrors.surname && <p className="text-red-500 text-sm mt-1">{validationErrors.surname}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Marital Status *</label>
                  <select
                    value={formData.maritalStatusId}
                    onChange={(e) => updateFormData('maritalStatusId', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg ${validationErrors.maritalStatusId ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <option value="">Select status</option>
                    {maritalStatuses.map(status => (
                      <option key={status.id} value={status.id}>{status.name}</option>
                    ))}
                  </select>
                  {validationErrors.maritalStatusId && <p className="text-red-500 text-sm mt-1">{validationErrors.maritalStatusId}</p>}
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-bold text-red-600 mb-6">Address Information</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                  <select
                    value={formData.stateId}
                    onChange={(e) => updateFormData('stateId', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg ${validationErrors.stateId ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <option value="">Select state</option>
                    {states.map(state => (
                      <option key={state.id} value={state.id}>{state.name}</option>
                    ))}
                  </select>
                  {validationErrors.stateId && <p className="text-red-500 text-sm mt-1">{validationErrors.stateId}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Zip Code *</label>
                  <input
                    type="text"
                    value={formData.zipCode}
                    onChange={(e) => updateFormData('zipCode', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg ${validationErrors.zipCode ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="100001"
                  />
                  {validationErrors.zipCode && <p className="text-red-500 text-sm mt-1">{validationErrors.zipCode}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Address *</label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => updateFormData('address', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg ${validationErrors.address ? 'border-red-500' : 'border-gray-300'}`}
                    rows={3}
                    placeholder="Enter your full address"
                  />
                  {validationErrors.address && <p className="text-red-500 text-sm mt-1">{validationErrors.address}</p>}
                </div>
              </div>
            </div>

            {/* Travel Documents */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-bold text-red-600 mb-6">Travel Documents</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nationality *</label>
                  <input
                    type="text"
                    value={formData.nationality}
                    onChange={(e) => updateFormData('nationality', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg ${validationErrors.nationality ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Nigeria"
                  />
                  {validationErrors.nationality && <p className="text-red-500 text-sm mt-1">{validationErrors.nationality}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Passport Number *</label>
                  <input
                    type="text"
                    value={formData.passportNo}
                    onChange={(e) => updateFormData('passportNo', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg ${validationErrors.passportNo ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="A12345678"
                  />
                  {validationErrors.passportNo && <p className="text-red-500 text-sm mt-1">{validationErrors.passportNo}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Occupation *</label>
                  <input
                    type="text"
                    value={formData.occupation}
                    onChange={(e) => updateFormData('occupation', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg ${validationErrors.occupation ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Software Developer"
                  />
                  {validationErrors.occupation && <p className="text-red-500 text-sm mt-1">{validationErrors.occupation}</p>}
                </div>
              </div>
            </div>

            {/* Medical Information */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-bold text-red-600 mb-6">Medical Information</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="medicalCondition"
                    checked={formData.hasMedicalCondition}
                    onChange={(e) => updateFormData('hasMedicalCondition', e.target.checked)}
                    className="w-4 h-4 text-red-600 border-gray-300 rounded"
                  />
                  <label htmlFor="medicalCondition" className="ml-2 text-sm text-gray-700">
                    I have a pre-existing medical condition
                  </label>
                </div>

                {formData.hasMedicalCondition && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Please describe your condition *</label>
                    <textarea
                      value={formData.medicalCondition}
                      onChange={(e) => updateFormData('medicalCondition', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg ${validationErrors.medicalCondition ? 'border-red-500' : 'border-gray-300'}`}
                      rows={3}
                      placeholder="Describe your medical condition"
                    />
                    {validationErrors.medicalCondition && <p className="text-red-500 text-sm mt-1">{validationErrors.medicalCondition}</p>}
                  </div>
                )}
              </div>
            </div>

            {/* Next of Kin */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-bold text-red-600 mb-6">Next of Kin (Emergency Contact)</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={formData.nokFullName}
                    onChange={(e) => updateFormData('nokFullName', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg ${validationErrors.nokFullName ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Emergency contact name"
                  />
                  {validationErrors.nokFullName && <p className="text-red-500 text-sm mt-1">{validationErrors.nokFullName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Relationship *</label>
                  <input
                    type="text"
                    value={formData.nokRelationship}
                    onChange={(e) => updateFormData('nokRelationship', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg ${validationErrors.nokRelationship ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Spouse, Parent, Sibling, etc."
                  />
                  {validationErrors.nokRelationship && <p className="text-red-500 text-sm mt-1">{validationErrors.nokRelationship}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    value={formData.nokPhone}
                    onChange={(e) => updateFormData('nokPhone', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg ${validationErrors.nokPhone ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="08012345678"
                  />
                  {validationErrors.nokPhone && <p className="text-red-500 text-sm mt-1">{validationErrors.nokPhone}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                  <textarea
                    value={formData.nokAddress}
                    onChange={(e) => updateFormData('nokAddress', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg ${validationErrors.nokAddress ? 'border-red-500' : 'border-gray-300'}`}
                    rows={2}
                    placeholder="Emergency contact address"
                  />
                  {validationErrors.nokAddress && <p className="text-red-500 text-sm mt-1">{validationErrors.nokAddress}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-8">
              <h3 className="text-xl font-bold text-red-600 mb-6">Booking Summary</h3>
              
              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-sm text-gray-600">Plan</p>
                  <p className="font-semibold">{selectedQuote.planName}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Destination</p>
                  <p className="font-semibold">{searchCriteria.destination}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Coverage Period</p>
                  <p className="font-semibold">{searchCriteria.coverBegins} to {searchCriteria.coverEnds}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Travelers</p>
                  <p className="font-semibold">{searchCriteria.travelers}</p>
                  {travelerInfo?.travelers && travelerInfo.travelers.length > 0 && (
                    <p className="text-xs text-gray-500 mt-1">
                      {travelerInfo.travelers.filter((t: any) => t.type === 'adult').length} Adult(s), {' '}
                      {travelerInfo.travelers.filter((t: any) => t.type === 'child').length} Child(ren)
                    </p>
                  )}
                </div>

                <div>
                  <p className="text-sm text-gray-600">Contact</p>
                  <p className="font-semibold text-sm">{contactInfo.email}</p>
                  <p className="font-semibold text-sm">{contactInfo.dialCode}{contactInfo.phoneNumber}</p>
                </div>
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Premium</span>
                  <span className="font-semibold">₦{selectedQuote.Amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Service Fee</span>
                  <span className="font-semibold">₦1,000</span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold border-t pt-2">
                  <span>Total</span>
                  <span>₦{(selectedQuote.Amount + 1000).toLocaleString()}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => router.back()}
                  variant="outline"
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-1 bg-red-500 hover:bg-red-600"
                >
                  {isSubmitting ? (
                    <>
                      <LoadingSpinner size="sm" color="white" />
                      <span className="ml-2">Processing...</span>
                    </>
                  ) : (
                    'Purchase Insurance'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ServiceLayout>
  );
}
