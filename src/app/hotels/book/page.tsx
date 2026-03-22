'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import ServiceFooter from '@/components/layout/ServiceFooter';
import { SimpleDatePicker } from '@/components/ui/SimpleDatePicker';
import CountryCodeSelector from '@/components/ui/CountryCodeSelector';
import { hotelService } from '@/lib/services/hotel-service';
import MetapolicyDisplay from '@/components/hotels/MetapolicyDisplay';
import { useCurrency } from '@/contexts/CurrencyContext';

interface Guest {
  type: 'Adult' | 'Minor';
  title: string;
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: string;
  nationality: string;
}

interface ContactInfo {
  email: string;
  phoneNumber: string;
  countryCode: string;
  dialCode: string;
}

export default function HotelBookingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { formatAmount } = useCurrency();
  const [hotel, setHotel] = useState<any>(null);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    email: '',
    phoneNumber: '',
    countryCode: 'NG',
    dialCode: '+234'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchData, setSearchData] = useState<any>(null);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [prebookedRate, setPrebookedRate] = useState<any>(null);
  const [hotelPageData, setHotelPageData] = useState<any>(null);
  const [excludedTaxes, setExcludedTaxes] = useState<any[]>([]);

  useEffect(() => {
    // Get hotel data from URL params
    const hotelData = searchParams.get('hotel');
    const destination = searchParams.get('destination');
    const checkin = searchParams.get('checkin');
    const checkout = searchParams.get('checkout');
    const guests = searchParams.get('guests');
    
    if (hotelData) {
      try {
        const parsedHotel = JSON.parse(decodeURIComponent(hotelData));
        
        // Try to get search data from localStorage first
        let searchInfo = {
          destination: destination || parsedHotel.location?.city || 'Lagos',
          checkin: checkin,
          checkout: checkout,
          adults: parseInt(searchParams.get('adults') || '1'),
          children: parseInt(searchParams.get('children') || '0'),
          rooms: parseInt(searchParams.get('rooms') || '1'),
          nights: 1
        };

        console.log('Booking page URL params:', {
          destination,
          checkin,
          checkout,
          adults: searchParams.get('adults'),
          children: searchParams.get('children'),
          rooms: searchParams.get('rooms')
        });
        console.log('Initial search info:', searchInfo);
        console.log('Hotel booking info from URL:', parsedHotel.bookingInfo);

        // If no URL params, try to use hotel's bookingInfo first
        if (!checkin && !checkout && !searchParams.get('adults') && parsedHotel.bookingInfo) {
          console.log('Using hotel bookingInfo as primary source');
          searchInfo.adults = parsedHotel.bookingInfo.adults || 1;
          searchInfo.children = parsedHotel.bookingInfo.children || 0;
          searchInfo.rooms = parsedHotel.bookingInfo.rooms || 1;
          searchInfo.nights = parsedHotel.bookingInfo.nights || 1;
        }

        // Try to get from localStorage search criteria if URL params are missing
        if (!checkin || !checkout) {
          try {
            const storedCriteria = localStorage.getItem('hotelSearchCriteria');
            console.log('No URL params, checking localStorage:', storedCriteria);
            if (storedCriteria) {
              const criteria = JSON.parse(storedCriteria);
              console.log('Parsed stored criteria:', criteria);
              searchInfo.checkin = criteria.checkIn;
              searchInfo.checkout = criteria.checkOut;
              searchInfo.adults = criteria.adults || searchInfo.adults;
              searchInfo.children = criteria.children || searchInfo.children;
              searchInfo.rooms = criteria.rooms || searchInfo.rooms;
            } else {
              // If no localStorage and no URL params, generate dates based on today + nights from hotel
              const today = new Date();
              // Use tomorrow as check-in to avoid same-day booking issues
              const checkin = new Date(today);
              checkin.setDate(today.getDate() + 1);
              const checkout = new Date(checkin);
              checkout.setDate(checkin.getDate() + (searchInfo.nights || 1));
              
              searchInfo.checkin = checkin.toISOString().split('T')[0];
              searchInfo.checkout = checkout.toISOString().split('T')[0];
              console.log('Generated dates from tomorrow:', { checkin: searchInfo.checkin, checkout: searchInfo.checkout });
            }
          } catch (e) {
            console.error('Error parsing stored search criteria:', e);
            // Generate fallback dates (tomorrow + 1 night)
            const today = new Date();
            const checkin = new Date(today);
            checkin.setDate(today.getDate() + 1);
            const checkout = new Date(checkin);
            checkout.setDate(checkin.getDate() + 1);
            
            searchInfo.checkin = checkin.toISOString().split('T')[0];
            searchInfo.checkout = checkout.toISOString().split('T')[0];
          }
        }
        
        // Parse guest data from URL if available
        if (guests) {
          try {
            const guestData = JSON.parse(decodeURIComponent(guests));
            searchInfo.adults = guestData.adults || searchInfo.adults;
            searchInfo.children = guestData.children || searchInfo.children;
            searchInfo.rooms = guestData.rooms || searchInfo.rooms;
          } catch (e) {
            console.error('Error parsing guest data:', e);
          }
        }
        
        // Calculate nights from dates
        if (searchInfo.checkin && searchInfo.checkout) {
          const checkinDate = new Date(searchInfo.checkin);
          const checkoutDate = new Date(searchInfo.checkout);
          const timeDiff = checkoutDate.getTime() - checkinDate.getTime();
          searchInfo.nights = Math.max(1, Math.ceil(timeDiff / (1000 * 3600 * 24)));
        }
        
        console.log('Final search info before setting:', searchInfo);
        setSearchData(searchInfo);
        
        // Update hotel with search-based booking info and ensure pricePerNight is set
        const updatedHotel = {
          ...parsedHotel,
          pricePerNight: parsedHotel.pricePerNight || parsedHotel.rooms?.[0]?.price?.total || parsedHotel.price || 25000,
          bookingInfo: {
            adults: searchInfo.adults,
            children: searchInfo.children,
            nights: searchInfo.nights,
            rooms: searchInfo.rooms
          }
        };
        
        setHotel(updatedHotel);
        
        // Initialize guests based on search info
        const initialGuests: Guest[] = [];
        
        // Add adults
        for (let i = 0; i < searchInfo.adults; i++) {
          initialGuests.push({
            type: 'Adult',
            title: '',
            firstName: '',
            middleName: '',
            lastName: '',
            dateOfBirth: '',
            nationality: ''
          });
        }
        
        // Add children
        for (let i = 0; i < searchInfo.children; i++) {
          initialGuests.push({
            type: 'Minor',
            title: '',
            firstName: '',
            middleName: '',
            lastName: '',
            dateOfBirth: '',
            nationality: ''
          });
        }
        
        setGuests(initialGuests);
      } catch (error) {
        console.error('Error parsing hotel data:', error);
        router.push('/hotels');
      }
    } else {
      router.push('/hotels');
    }
    setIsLoading(false);

    // Load prebooked rate and hotel page data from localStorage
    try {
      const stored = localStorage.getItem('prebookedRate');
      if (stored) {
        const parsed = JSON.parse(stored);
        setPrebookedRate(parsed);
        // Extract excluded taxes from the prebooked rate
        if (parsed.rate?.excludedTaxes?.length) {
          setExcludedTaxes(parsed.rate.excludedTaxes);
        }
      }
      const storedPage = localStorage.getItem('hotelPageData');
      if (storedPage) setHotelPageData(JSON.parse(storedPage));
    } catch (e) {
      console.warn('Could not load prebooked rate from localStorage', e);
    }
  }, [searchParams, router]);

  const updateGuest = (index: number, field: keyof Guest, value: string) => {
    setGuests(prev => prev.map((guest, i) => 
      i === index ? { ...guest, [field]: value } : guest
    ));
    
    // Clear validation error for this field when user starts typing
    const errorKey = `guest${index}${field.charAt(0).toUpperCase() + field.slice(1)}`;
    if (validationErrors[errorKey]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  const updateContactInfo = (field: keyof ContactInfo, value: string) => {
    setContactInfo(prev => ({ ...prev, [field]: value }));
    
    // Clear validation error for this field when user starts typing
    const errorKey = `contact${field.charAt(0).toUpperCase() + field.slice(1)}`;
    if (validationErrors[errorKey]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  const handleContactCountryChange = (countryCode: string, dialCode: string) => {
    setContactInfo(prev => ({ ...prev, countryCode, dialCode }));
  };

  // Validation functions
  const validateContactInfo = () => {
    const errors: {[key: string]: string} = {};
    
    if (!contactInfo.email.trim()) {
      errors.contactEmail = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactInfo.email)) {
      errors.contactEmail = 'Please enter a valid email address';
    }
    
    if (!contactInfo.phoneNumber.trim()) {
      errors.contactPhone = 'Phone number is required';
    } else if (contactInfo.phoneNumber.length < 10) {
      errors.contactPhone = 'Please enter a valid phone number';
    }
    
    return errors;
  };

  const validateGuests = () => {
    const errors: {[key: string]: string} = {};
    
    guests.forEach((guest, index) => {
      if (!guest.title) {
        errors[`guest${index}Title`] = 'Title is required';
      }
      
      if (!guest.firstName.trim()) {
        errors[`guest${index}FirstName`] = 'First name is required';
      }
      
      if (!guest.lastName.trim()) {
        errors[`guest${index}LastName`] = 'Last name is required';
      }
      
      if (!guest.dateOfBirth) {
        errors[`guest${index}DateOfBirth`] = 'Date of birth is required';
      }
      
      if (!guest.nationality) {
        errors[`guest${index}Nationality`] = 'Nationality is required';
      }
    });
    
    return errors;
  };

  const validateForm = () => {
    const contactErrors = validateContactInfo();
    const guestErrors = validateGuests();
    const allErrors = { ...contactErrors, ...guestErrors };
    
    setValidationErrors(allErrors);
    return Object.keys(allErrors).length === 0;
  };

  // ── Price calculation — use ETG prebooked rate when available ──────────────
  const getRateData = () => {
    // Prefer the prebooked rate's confirmed rate object
    const rate = prebookedRate?.rate || hotelPageData?.rates?.[0] || null;
    return rate;
  };

  const calculateSubtotal = () => {
    const rate = getRateData();
    if (rate?.showAmount) return parseFloat(rate.showAmount);
    if (rate?.dailyPrice && hotel?.bookingInfo?.nights) {
      return parseFloat(rate.dailyPrice) * (hotel.bookingInfo.nights || 1);
    }
    // Fallback to hotel.pricePerNight
    if (!hotel?.pricePerNight || !hotel?.bookingInfo?.nights || !hotel?.bookingInfo?.rooms) return 0;
    return hotel.pricePerNight * hotel.bookingInfo.nights * hotel.bookingInfo.rooms;
  };

  const calculateIncludedTaxes = () => {
    const rate = getRateData();
    if (!rate?.includedTaxes?.length) return 0;
    return rate.includedTaxes.reduce((sum: number, t: any) => sum + parseFloat(t.amount || '0'), 0);
  };

  const calculateTaxes = () => {
    const rate = getRateData();
    // If ETG rate has included taxes, use those; otherwise fall back to 12%
    if (rate?.includedTaxes?.length) return calculateIncludedTaxes();
    return Math.round(calculateSubtotal() * 0.12);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTaxes();
  };

  const getRateCurrency = () => {
    const rate = getRateData();
    return rate?.currency || 'USD';
  };

  const handleBack = () => {
    router.back();
  };

  const handleProceedToPayment = async () => {
    // Validate form before proceeding
    if (!validateForm()) {
      const firstErrorElement = document.querySelector('.border-red-500');
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);
    setBookingError(null);

    try {
      // If we have a prebooked rate (ETG flow), run createBookingForm → startBooking
      if (prebookedRate?.bookHash) {
        // Build ETG guest rooms array: one room with all guests
        const etgGuests = guests.map(g => ({
          first_name: g.firstName,
          last_name: g.lastName,
          ...(g.type === 'Minor' && g.dateOfBirth
            ? { age: Math.floor((Date.now() - new Date(g.dateOfBirth).getTime()) / (365.25 * 24 * 3600 * 1000)) }
            : {}),
        }));

        // Step 3a: create booking form
        const formResult = await hotelService.createBookingForm({
          bookHash: prebookedRate.bookHash,
          guests: [{ guests: etgGuests }],
          userPhone: `${contactInfo.dialCode}${contactInfo.phoneNumber}`.replace(/\s+/g, ''),
          userEmail: contactInfo.email,
        });

        if (!formResult.orderId) {
          throw new Error('Failed to create booking form — no orderId returned');
        }

        // Step 3b: start booking + poll
        const primaryGuest = guests[0];
        const bookingResult = await hotelService.startBooking({
          orderId: formResult.orderId,
          partnerOrderId: formResult.partnerOrderId,
          userPhone: `${contactInfo.dialCode}${contactInfo.phoneNumber}`.replace(/\s+/g, ''),
          userEmail: contactInfo.email,
          guestName: primaryGuest ? `${primaryGuest.firstName} ${primaryGuest.lastName}` : undefined,
          hotelName: hotel?.name,
          checkin: searchData?.checkin,
          checkout: searchData?.checkout,
        });

        if (bookingResult.status !== 'ok') {
          throw new Error(`Booking failed: ${bookingResult.error || bookingResult.status}`);
        }

        // Store confirmed booking data
        localStorage.setItem('confirmedHotelBooking', JSON.stringify({
          orderId: bookingResult.orderId,
          hotel,
          guests,
          contactInfo,
          searchData,
          prebookedRate,
          excludedTaxes,
        }));

        // Navigate to success page
        router.push(`/hotels/success?orderId=${bookingResult.orderId}`);
        return;
      }

      // Fallback: navigate to payment page (non-ETG hotels)
      const hotelData = encodeURIComponent(JSON.stringify(hotel));
      const guestData = encodeURIComponent(JSON.stringify(guests));
      const contactData = encodeURIComponent(JSON.stringify(contactInfo));

      const urlParams = new URLSearchParams();
      urlParams.set('hotel', hotelData);
      urlParams.set('guests', guestData);
      urlParams.set('contact', contactData);

      if (searchData) {
        urlParams.set('destination', searchData.destination || hotel.location.city);
        urlParams.set('checkin', searchData.checkin);
        urlParams.set('checkout', searchData.checkout);
        urlParams.set('nights', searchData.nights?.toString() || '1');
        urlParams.set('rooms', searchData.rooms?.toString() || '1');
        urlParams.set('adults', searchData.adults?.toString() || '1');
        urlParams.set('children', searchData.children?.toString() || '0');
      }

      router.push(`/hotels/payment?${urlParams.toString()}`);
    } catch (err: any) {
      console.error('Hotel booking error:', err);
      setBookingError(err.message || 'Booking failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red mb-4"></div>
          <p className="text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Hotel not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hotel Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{hotel.name}</h1>
          <p className="text-gray-600 flex items-center">
            <svg className="h-4 w-4 mr-1 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            {hotel.location.address}, {hotel.location.city}, {hotel.location.country}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Contact and Guest Information Forms */}
          <div className="lg:col-span-2">
            {/* Contact Information Section */}
            <div className="mb-12">
              <h2 className="text-xl font-bold text-red-600 mb-6">Contact Information</h2>
              <p className="text-gray-600 text-sm mb-6">
                This information will be used for booking confirmation and communication.
              </p>

              <div className="space-y-4">
                {/* Email and Phone Row */}
                <div className="flex gap-4">
                  <div className="flex flex-col gap-1 flex-1">
                    <div className={`border rounded bg-white px-3 py-2 h-12 flex items-end focus-within:border-red-600 ${
                      validationErrors.contactEmail ? 'border-red-500' : 'border-gray-300'
                    }`}>
                      <input
                        type="email"
                        placeholder="Email address*"
                        value={contactInfo.email}
                        onChange={(e) => updateContactInfo('email', e.target.value)}
                        className="w-full text-lg text-gray-600 placeholder-gray-600 border-none outline-none bg-transparent focus:outline-none focus:ring-0"
                      />
                    </div>
                    {validationErrors.contactEmail && (
                      <p className="text-red-500 text-sm mt-1">{validationErrors.contactEmail}</p>
                    )}
                  </div>

                  <div className="flex flex-col gap-1 w-[300px]">
                    <div className={`border rounded bg-white h-12 flex items-center focus-within:border-red-600 ${
                      validationErrors.contactPhone ? 'border-red-500' : 'border-gray-300'
                    }`}>
                      <CountryCodeSelector
                        selectedCountry={contactInfo.countryCode}
                        onCountryChange={handleContactCountryChange}
                      />
                      <input
                        type="tel"
                        placeholder="Phone number*"
                        value={contactInfo.phoneNumber}
                        onChange={(e) => updateContactInfo('phoneNumber', e.target.value)}
                        className="flex-1 px-3 text-lg text-gray-600 placeholder-gray-600 border-none outline-none bg-transparent focus:outline-none focus:ring-0"
                      />
                    </div>
                    {validationErrors.contactPhone && (
                      <p className="text-red-500 text-sm mt-1">{validationErrors.contactPhone}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Guest Information Section */}
            <div>
              <h2 className="text-xl font-bold text-red-600 mb-6">Guest Information</h2>
              <p className="text-gray-600 text-sm mb-8">
                Enter the required information for each guest and be sure that it exactly matches your government-issued ID.
              </p>

              {/* Guest Forms */}
              <div className="space-y-8">
                {guests.map((guest, index) => (
                  <div key={index} className="border-b border-gray-200 pb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Guest {index + 1} ({guest.type})
                    </h3>
                    
                    {/* Title Radio Buttons */}
                    <div className="flex gap-6 mb-4">
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name={`title-${index}`}
                            value="Mr"
                            checked={guest.title === 'Mr'}
                            onChange={(e) => updateGuest(index, 'title', e.target.value)}
                            className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
                          />
                          <span className="text-gray-600 text-sm">Mr</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name={`title-${index}`}
                            value="Ms"
                            checked={guest.title === 'Ms'}
                            onChange={(e) => updateGuest(index, 'title', e.target.value)}
                            className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
                          />
                          <span className="text-gray-600 text-sm">Ms</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name={`title-${index}`}
                            value="Mrs"
                            checked={guest.title === 'Mrs'}
                            onChange={(e) => updateGuest(index, 'title', e.target.value)}
                            className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
                          />
                          <span className="text-gray-600 text-sm">Mrs</span>
                        </label>
                      </div>
                      {validationErrors[`guest${index}Title`] && (
                        <p className="text-red-500 text-sm">{validationErrors[`guest${index}Title`]}</p>
                      )}
                    </div>

                    {/* Name Fields Row */}
                    <div className="flex gap-4 mb-4">
                      <div className="flex flex-col gap-1 flex-1">
                        <div className={`border rounded bg-white px-3 py-2 h-12 flex items-end focus-within:border-red-600 ${
                          validationErrors[`guest${index}FirstName`] ? 'border-red-500' : 'border-gray-300'
                        }`}>
                          <input
                            type="text"
                            placeholder="First name*"
                            value={guest.firstName}
                            onChange={(e) => updateGuest(index, 'firstName', e.target.value)}
                            className="w-full text-lg text-gray-600 placeholder-gray-600 border-none outline-none bg-transparent focus:outline-none focus:ring-0"
                          />
                        </div>
                        {validationErrors[`guest${index}FirstName`] && (
                          <p className="text-red-500 text-sm mt-1">{validationErrors[`guest${index}FirstName`]}</p>
                        )}
                      </div>

                      <div className="flex flex-col gap-1 flex-1">
                        <div className={`border rounded bg-white px-3 py-2 h-12 flex items-end focus-within:border-red-600 ${
                          validationErrors[`guest${index}LastName`] ? 'border-red-500' : 'border-gray-300'
                        }`}>
                          <input
                            type="text"
                            placeholder="Last name*"
                            value={guest.lastName}
                            onChange={(e) => updateGuest(index, 'lastName', e.target.value)}
                            className="w-full text-lg text-gray-600 placeholder-gray-600 border-none outline-none bg-transparent focus:outline-none focus:ring-0"
                          />
                        </div>
                        {validationErrors[`guest${index}LastName`] && (
                          <p className="text-red-500 text-sm mt-1">{validationErrors[`guest${index}LastName`]}</p>
                        )}
                      </div>

                      <div className="flex flex-col gap-1 flex-1">
                        <div className="border border-gray-300 rounded bg-white px-3 py-2 h-12 flex items-end focus-within:border-red-600">
                          <input
                            type="text"
                            placeholder="Middle name"
                            value={guest.middleName}
                            onChange={(e) => updateGuest(index, 'middleName', e.target.value)}
                            className="w-full text-lg text-gray-600 placeholder-gray-600 border-none outline-none bg-transparent focus:outline-none focus:ring-0"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-1 w-[150px]">
                        <div className={`border rounded bg-white h-12 flex items-center focus-within:border-red-600 ${
                          validationErrors[`guest${index}DateOfBirth`] ? 'border-red-500' : 'border-gray-300'
                        }`}>
                          <SimpleDatePicker
                            value={guest.dateOfBirth}
                            onChange={(date) => updateGuest(index, 'dateOfBirth', date)}
                            placeholder="DOB*"
                            maxDate={new Date().toISOString().split('T')[0]}
                            required={true}
                            className="w-full"
                          />
                        </div>
                        {validationErrors[`guest${index}DateOfBirth`] && (
                          <p className="text-red-500 text-sm mt-1">{validationErrors[`guest${index}DateOfBirth`]}</p>
                        )}
                      </div>

                      <div className="flex flex-col gap-1 w-[150px]">
                        <div className={`border rounded bg-white px-3 py-2 h-12 flex items-end focus-within:border-red-600 ${
                          validationErrors[`guest${index}Nationality`] ? 'border-red-500' : 'border-gray-300'
                        }`}>
                          <select
                            value={guest.nationality}
                            onChange={(e) => updateGuest(index, 'nationality', e.target.value)}
                            className="w-full text-lg text-gray-600 border-none outline-none bg-transparent focus:outline-none focus:ring-0"
                          >
                            <option value="">Nationality*</option>
                            <option value="AF">Afghan</option>
                            <option value="AL">Albanian</option>
                            <option value="DZ">Algerian</option>
                            <option value="AD">Andorran</option>
                            <option value="AO">Angolan</option>
                            <option value="AG">Antiguan</option>
                            <option value="AR">Argentine</option>
                            <option value="AM">Armenian</option>
                            <option value="AU">Australian</option>
                            <option value="AT">Austrian</option>
                            <option value="AZ">Azerbaijani</option>
                            <option value="BS">Bahamian</option>
                            <option value="BH">Bahraini</option>
                            <option value="BD">Bangladeshi</option>
                            <option value="BB">Barbadian</option>
                            <option value="BY">Belarusian</option>
                            <option value="BE">Belgian</option>
                            <option value="BZ">Belizean</option>
                            <option value="BJ">Beninese</option>
                            <option value="BT">Bhutanese</option>
                            <option value="BO">Bolivian</option>
                            <option value="BA">Bosnian</option>
                            <option value="BW">Botswanan</option>
                            <option value="BR">Brazilian</option>
                            <option value="BN">Bruneian</option>
                            <option value="BG">Bulgarian</option>
                            <option value="BF">Burkinabe</option>
                            <option value="BI">Burundian</option>
                            <option value="CV">Cape Verdean</option>
                            <option value="KH">Cambodian</option>
                            <option value="CM">Cameroonian</option>
                            <option value="CA">Canadian</option>
                            <option value="CF">Central African</option>
                            <option value="TD">Chadian</option>
                            <option value="CL">Chilean</option>
                            <option value="CN">Chinese</option>
                            <option value="CO">Colombian</option>
                            <option value="KM">Comorian</option>
                            <option value="CG">Congolese</option>
                            <option value="CR">Costa Rican</option>
                            <option value="HR">Croatian</option>
                            <option value="CU">Cuban</option>
                            <option value="CY">Cypriot</option>
                            <option value="CZ">Czech</option>
                            <option value="DK">Danish</option>
                            <option value="DJ">Djiboutian</option>
                            <option value="DM">Dominican</option>
                            <option value="DO">Dominican (Rep.)</option>
                            <option value="EC">Ecuadorian</option>
                            <option value="EG">Egyptian</option>
                            <option value="SV">Salvadoran</option>
                            <option value="GQ">Equatorial Guinean</option>
                            <option value="ER">Eritrean</option>
                            <option value="EE">Estonian</option>
                            <option value="SZ">Swazi</option>
                            <option value="ET">Ethiopian</option>
                            <option value="FJ">Fijian</option>
                            <option value="FI">Finnish</option>
                            <option value="FR">French</option>
                            <option value="GA">Gabonese</option>
                            <option value="GM">Gambian</option>
                            <option value="GE">Georgian</option>
                            <option value="DE">German</option>
                            <option value="GH">Ghanaian</option>
                            <option value="GR">Greek</option>
                            <option value="GD">Grenadian</option>
                            <option value="GT">Guatemalan</option>
                            <option value="GN">Guinean</option>
                            <option value="GW">Guinea-Bissauan</option>
                            <option value="GY">Guyanese</option>
                            <option value="HT">Haitian</option>
                            <option value="HN">Honduran</option>
                            <option value="HU">Hungarian</option>
                            <option value="IS">Icelandic</option>
                            <option value="IN">Indian</option>
                            <option value="ID">Indonesian</option>
                            <option value="IR">Iranian</option>
                            <option value="IQ">Iraqi</option>
                            <option value="IE">Irish</option>
                            <option value="IL">Israeli</option>
                            <option value="IT">Italian</option>
                            <option value="JM">Jamaican</option>
                            <option value="JP">Japanese</option>
                            <option value="JO">Jordanian</option>
                            <option value="KZ">Kazakhstani</option>
                            <option value="KE">Kenyan</option>
                            <option value="KI">Kiribati</option>
                            <option value="KW">Kuwaiti</option>
                            <option value="KG">Kyrgyz</option>
                            <option value="LA">Laotian</option>
                            <option value="LV">Latvian</option>
                            <option value="LB">Lebanese</option>
                            <option value="LS">Basotho</option>
                            <option value="LR">Liberian</option>
                            <option value="LY">Libyan</option>
                            <option value="LI">Liechtensteiner</option>
                            <option value="LT">Lithuanian</option>
                            <option value="LU">Luxembourgish</option>
                            <option value="MG">Malagasy</option>
                            <option value="MW">Malawian</option>
                            <option value="MY">Malaysian</option>
                            <option value="MV">Maldivian</option>
                            <option value="ML">Malian</option>
                            <option value="MT">Maltese</option>
                            <option value="MH">Marshallese</option>
                            <option value="MR">Mauritanian</option>
                            <option value="MU">Mauritian</option>
                            <option value="MX">Mexican</option>
                            <option value="FM">Micronesian</option>
                            <option value="MD">Moldovan</option>
                            <option value="MC">Monegasque</option>
                            <option value="MN">Mongolian</option>
                            <option value="ME">Montenegrin</option>
                            <option value="MA">Moroccan</option>
                            <option value="MZ">Mozambican</option>
                            <option value="MM">Burmese</option>
                            <option value="NA">Namibian</option>
                            <option value="NR">Nauruan</option>
                            <option value="NP">Nepali</option>
                            <option value="NL">Dutch</option>
                            <option value="NZ">New Zealander</option>
                            <option value="NI">Nicaraguan</option>
                            <option value="NE">Nigerien</option>
                            <option value="NG">Nigerian</option>
                            <option value="KP">North Korean</option>
                            <option value="MK">North Macedonian</option>
                            <option value="NO">Norwegian</option>
                            <option value="OM">Omani</option>
                            <option value="PK">Pakistani</option>
                            <option value="PW">Palauan</option>
                            <option value="PA">Panamanian</option>
                            <option value="PG">Papua New Guinean</option>
                            <option value="PY">Paraguayan</option>
                            <option value="PE">Peruvian</option>
                            <option value="PH">Filipino</option>
                            <option value="PL">Polish</option>
                            <option value="PT">Portuguese</option>
                            <option value="QA">Qatari</option>
                            <option value="RO">Romanian</option>
                            <option value="RU">Russian</option>
                            <option value="RW">Rwandan</option>
                            <option value="KN">Kittitian</option>
                            <option value="LC">Saint Lucian</option>
                            <option value="VC">Vincentian</option>
                            <option value="WS">Samoan</option>
                            <option value="SM">Sammarinese</option>
                            <option value="ST">São Toméan</option>
                            <option value="SA">Saudi</option>
                            <option value="SN">Senegalese</option>
                            <option value="RS">Serbian</option>
                            <option value="SC">Seychellois</option>
                            <option value="SL">Sierra Leonean</option>
                            <option value="SG">Singaporean</option>
                            <option value="SK">Slovak</option>
                            <option value="SI">Slovenian</option>
                            <option value="SB">Solomon Islander</option>
                            <option value="SO">Somali</option>
                            <option value="ZA">South African</option>
                            <option value="SS">South Sudanese</option>
                            <option value="ES">Spanish</option>
                            <option value="LK">Sri Lankan</option>
                            <option value="SD">Sudanese</option>
                            <option value="SR">Surinamese</option>
                            <option value="SE">Swedish</option>
                            <option value="CH">Swiss</option>
                            <option value="SY">Syrian</option>
                            <option value="TW">Taiwanese</option>
                            <option value="TJ">Tajik</option>
                            <option value="TZ">Tanzanian</option>
                            <option value="TH">Thai</option>
                            <option value="TL">Timorese</option>
                            <option value="TG">Togolese</option>
                            <option value="TO">Tongan</option>
                            <option value="TT">Trinidadian</option>
                            <option value="TN">Tunisian</option>
                            <option value="TR">Turkish</option>
                            <option value="TM">Turkmen</option>
                            <option value="TV">Tuvaluan</option>
                            <option value="UG">Ugandan</option>
                            <option value="UA">Ukrainian</option>
                            <option value="AE">Emirati</option>
                            <option value="GB">British</option>
                            <option value="US">American</option>
                            <option value="UY">Uruguayan</option>
                            <option value="UZ">Uzbek</option>
                            <option value="VU">Vanuatuan</option>
                            <option value="VE">Venezuelan</option>
                            <option value="VN">Vietnamese</option>
                            <option value="YE">Yemeni</option>
                            <option value="ZM">Zambian</option>
                            <option value="ZW">Zimbabwean</option>
                          </select>
                        </div>
                        {validationErrors[`guest${index}Nationality`] && (
                          <p className="text-red-500 text-sm mt-1">{validationErrors[`guest${index}Nationality`]}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Booking Details */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-lg p-6 sticky top-8">
              <h3 className="text-xl font-bold text-red-600 mb-6">Your Booking Details</h3>
              
              {/* Check-in/Check-out */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-lg font-bold text-gray-900 mb-1">Check - In</p>
                  <p className="text-base text-gray-700">
                    {searchData?.checkin ? new Date(searchData.checkin + 'T12:00:00').toLocaleDateString('en-US', { 
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric' 
                    }) : 'Not selected'}
                  </p>
                </div>
                <div className="border-l border-red-500 pl-4">
                  <p className="text-lg font-bold text-gray-900 mb-1">Check - Out</p>
                  <p className="text-base text-gray-700">
                    {searchData?.checkout ? new Date(searchData.checkout + 'T12:00:00').toLocaleDateString('en-US', { 
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric' 
                    }) : 'Not selected'}
                  </p>
                </div>
              </div>

              {/* Booking Summary */}
              <div className="mb-6">
                <ul className="space-y-2 text-base text-gray-700">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-black rounded-full mr-3"></span>
                    You Will Stay {hotel?.bookingInfo?.nights || 1} Night{(hotel?.bookingInfo?.nights || 1) > 1 ? 's' : ''}
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-black rounded-full mr-3"></span>
                    You Selected {hotel?.bookingInfo?.rooms || 1} Room{(hotel?.bookingInfo?.rooms || 1) > 1 ? 's' : ''} For :
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-black rounded-full mr-3"></span>
                    {hotel?.bookingInfo?.adults || 1} Adult{(hotel?.bookingInfo?.adults || 1) > 1 ? 's' : ''}
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-black rounded-full mr-3"></span>
                    {hotel?.bookingInfo?.children || 0} Children
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-black rounded-full mr-3"></span>
                    0 Infant{/* Infants are typically not counted in hotel bookings */}
                  </li>
                </ul>
              </div>

              {/* Amount */}
              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-bold text-gray-900">Amount :</span>
                  <span className="text-2xl font-bold text-green-600">
                    {formatAmount(parseFloat(getRateData()?.dailyPrice || String(hotel?.pricePerNight || 0)), getRateCurrency())}
                  </span>
                  <span className="text-base text-gray-700">Per Night</span>
                </div>
                {prebookedRate?.priceChanged && (
                  <p className="text-amber-600 text-sm mt-1">
                    Price updated from {formatAmount(parseFloat(prebookedRate.oldPrice || '0'), getRateCurrency())} to {formatAmount(parseFloat(prebookedRate.newPrice || '0'), getRateCurrency())}
                  </p>
                )}
              </div>

              {/* Metapolicy */}
              {hotelPageData?.metapolicy && (
                <MetapolicyDisplay metapolicy={hotelPageData.metapolicy} />
              )}

              {/* Price Breakdown */}
              <div className="mb-8 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-base text-gray-700">Subtotal</span>
                  <span className="text-base font-semibold text-gray-900">{formatAmount(calculateSubtotal(), getRateCurrency())}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-base text-gray-700">
                    {getRateData()?.includedTaxes?.length ? 'Included Taxes & Fees' : 'Taxes and Fees (est.)'}
                  </span>
                  <span className="text-base font-semibold text-gray-900">{formatAmount(calculateTaxes(), getRateCurrency())}</span>
                </div>
                {excludedTaxes.length > 0 && (
                  <div className="pt-2 border-t border-gray-200">
                    <p className="text-sm text-amber-700 font-medium mb-1">Payable at property:</p>
                    {excludedTaxes.map((tax, i) => (
                      <div key={i} className="flex justify-between items-center text-sm text-amber-700">
                        <span>{tax.name}</span>
                        <span>{formatAmount(parseFloat(tax.amount), tax.currency)}</span>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex justify-between items-center pt-2 border-t border-gray-300">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-lg font-bold text-gray-900">{formatAmount(calculateTotal(), getRateCurrency())}</span>
                </div>
              </div>

              {bookingError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {bookingError}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleBack}
                  disabled={isSubmitting}
                  className="flex-1 px-3 py-3 text-red-500 bg-white rounded-lg hover:bg-red-50 transition-colors duration-200 font-medium text-center whitespace-nowrap disabled:opacity-50"
                  style={{ border: '2px solid #ef4444' }}
                >
                  Back
                </button>
                <button
                  onClick={handleProceedToPayment}
                  disabled={isSubmitting}
                  className="flex-1 px-3 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 font-medium text-center whitespace-nowrap disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {isSubmitting && (
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  )}
                  {isSubmitting ? 'Booking...' : prebookedRate?.bookHash ? 'Confirm Booking' : 'Proceed to payment'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <ServiceFooter />
    </div>
  );
}