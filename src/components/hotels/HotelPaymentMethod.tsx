'use client'

import { useState } from 'react'
import PaymentMethodHeader from '@/components/flights/PaymentMethodHeader'
import PaymentMethodForm from '@/components/flights/PaymentMethodForm'
import HotelCancellationPolicy from './HotelCancellationPolicy'
import HotelPaymentSidebar from './HotelPaymentSidebar'

interface PaymentData {
  paymentMethod: 'paystack' | 'google' | 'apple' | 'paypal'
  nameOnCard: string
  cardNumber: string
  expirationDate: string
  ccv: string
  saveCard: boolean
  email: string
  password: string
}

interface HotelDetails {
  id: string
  name: string
  location: {
    city: string
    country: string
  }
  pricePerNight: number
  bookingInfo: {
    nights: number
    adults: number
    children: number
    rooms: number
  }
  images: string[]
}

interface HotelPaymentMethodProps {
  hotel: HotelDetails
  totalAmount: number
  guests?: any[]
  onBack?: () => void
  onConfirmPay?: (paymentData: PaymentData) => void
}

export default function HotelPaymentMethod({
  hotel,
  totalAmount,
  guests = [],
  onBack,
  onConfirmPay
}: HotelPaymentMethodProps) {
  const [paymentData, setPaymentData] = useState<PaymentData>({
    paymentMethod: 'paystack',
    nameOnCard: '',
    cardNumber: '',
    expirationDate: '',
    ccv: '',
    saveCard: false,
    email: '',
    password: ''
  })

  // Helper function to format phone number to E.164 format
  const formatPhoneNumberToE164 = (phoneNumber: string, dialCode?: string): string => {
    if (!phoneNumber) return '+2348000000000';
    
    // Remove all non-digit characters
    let cleanNumber = phoneNumber.replace(/\D/g, '');
    
    // If number starts with 0, remove it (Nigerian local format)
    if (cleanNumber.startsWith('0')) {
      cleanNumber = cleanNumber.substring(1);
    }
    
    // Extract country code from dialCode (remove + sign)
    const countryCode = dialCode ? dialCode.replace('+', '') : '234';
    
    // If the number already starts with the country code, don't add it again
    if (cleanNumber.startsWith(countryCode)) {
      return `+${cleanNumber}`;
    }
    
    // Add country code and ensure it starts with +
    const formattedNumber = `+${countryCode}${cleanNumber}`;
    
    // Validate the formatted number matches E.164 format
    const e164Regex = /^\+?[1-9]\d{1,14}$/;
    if (!e164Regex.test(formattedNumber)) {
      console.warn('Formatted phone number does not match E.164 format:', formattedNumber);
      return '+2348000000000'; // Fallback to valid Nigerian number
    }
    
    return formattedNumber;
  }

  const handleDataChange = (data: PaymentData) => {
    setPaymentData(data)
  }

  const handleConfirmPay = async () => {
    try {
      // Get URL parameters for booking details
      const urlParams = new URLSearchParams(window.location.search);
      const destination = urlParams.get('destination') || hotel.location.city;
      const checkin = urlParams.get('checkin') || new Date().toISOString().split('T')[0];
      const checkout = urlParams.get('checkout') || new Date(Date.now() + (hotel.bookingInfo.nights * 24 * 60 * 60 * 1000)).toISOString().split('T')[0];
      const rooms = parseInt(urlParams.get('rooms') || '1');
      const adults = parseInt(urlParams.get('adults') || '1');
      const children = parseInt(urlParams.get('children') || '0');

      // Get contact and guest data from URL parameters
      let contactInfo = null;
      let guestData = [];
      
      try {
        const contactParam = urlParams.get('contact');
        const guestsParam = urlParams.get('guests');
        
        if (contactParam) {
          contactInfo = JSON.parse(decodeURIComponent(contactParam));
        }
        
        if (guestsParam) {
          guestData = JSON.parse(decodeURIComponent(guestsParam));
        }
      } catch (e) {
        console.error('Error parsing contact/guest data:', e);
      }

      // Use the first guest for primary guest details, fallback to legacy guests prop
      const primaryGuest = guestData[0] || guests[0] || {};
      
      // Prepare booking data for API call
      const bookingPayload = {
        hotelDetails: {
          id: hotel.id,
          name: hotel.name,
          price: hotel.pricePerNight || (hotel as any).rooms?.[0]?.price?.total || (hotel as any).price || 25000,
          currency: 'NGN',
          checkInDate: checkin,
          checkOutDate: checkout,
          roomName: 'Standard Room',
          location: hotel.location
        },
        guestDetails: {
          firstName: primaryGuest.firstName || 'Guest',
          lastName: primaryGuest.lastName || 'User',
          email: contactInfo?.email || primaryGuest.email || 'guest@example.com',
          phoneNumber: formatPhoneNumberToE164(
            contactInfo?.phoneNumber || primaryGuest.phoneNumber, 
            contactInfo?.dialCode || primaryGuest.dialCode
          ) || '+2348000000000',
          title: primaryGuest.title || 'Mr',
          middleName: primaryGuest.middleName || '',
          dateOfBirth: primaryGuest.dateOfBirth || '1990-01-01',
          nationality: primaryGuest.nationality || 'Nigerian'
        },
        bookingInfo: {
          destination: destination,
          checkInDate: checkin,
          checkOutDate: checkout,
          nights: hotel.bookingInfo.nights,
          rooms: rooms,
          adults: adults,
          children: children
        },
        paymentDetails: {
          callback_url: `${window.location.origin}/success?service=hotel`,
          currency: 'NGN'
        },
        searchId: 'dummy-search-id',
        roomId: 'dummy-room-id',
        isGuestBooking: true
      };

      console.log('Sending hotel booking request:', bookingPayload);
      console.log('Contact info:', contactInfo);
      console.log('Guest data:', guestData);
      console.log('Primary guest phone number details:', {
        contactPhone: contactInfo?.phoneNumber,
        contactDialCode: contactInfo?.dialCode,
        guestPhone: primaryGuest.phoneNumber,
        guestDialCode: primaryGuest.dialCode,
        formattedPhoneNumber: formatPhoneNumberToE164(
          contactInfo?.phoneNumber || primaryGuest.phoneNumber, 
          contactInfo?.dialCode || primaryGuest.dialCode
        )
      });

      // Call the hotel booking API
      const response = await fetch('http://localhost:8080/api/v1/products/hotels/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingPayload)
      });

      const result = await response.json();
      console.log('Hotel booking API response:', result);

      if (result.status === 'success' && result.data?.authorizationUrl) {
        // Store booking data for success page
        localStorage.setItem('currentHotelBooking', JSON.stringify({
          hotel: hotel,
          bookingReference: result.data.bookingReference || result.data.paymentReference,
          paymentReference: result.data.paymentReference,
          totalAmount: result.data.amount,
          bookingInfo: bookingPayload.bookingInfo,
          guestDetails: bookingPayload.guestDetails,
          contactInfo: contactInfo,
          allGuests: guestData
        }));

        // Redirect to Paystack payment page
        window.location.href = result.data.authorizationUrl;
      } else {
        console.error('Hotel booking failed:', result.message || result.error);
        alert(`Booking failed: ${result.message || result.error || 'Please try again.'}`);
      }
    } catch (error) {
      console.error('Hotel booking error:', error);
      alert('An error occurred. Please try again.');
    }
  }

  // Calculate price breakdown based on actual booking data
  const calculatePriceBreakdown = () => {
    const basePrice = hotel.pricePerNight || 25000;
    const nights = hotel.bookingInfo.nights || 1;
    const rooms = hotel.bookingInfo.rooms || 1;
    const subtotal = basePrice * nights * rooms;
    const taxRate = 0.12; // 12% tax
    const taxesAndFees = Math.round(subtotal * taxRate);
    const total = subtotal + taxesAndFees;
    
    return {
      subtotal,
      taxesAndFees,
      total
    };
  };
  
  const priceSummary = calculatePriceBreakdown();

  return (
    <div className="flex items-start justify-between gap-8 lg:gap-16 xl:gap-24 w-full">
      {/* Left Side - Payment Form */}
      <div className="flex-1 max-w-[686px]">
        <div className="flex flex-col gap-8">
          {/* Payment Method Header */}
          <PaymentMethodHeader />

          {/* Payment Method Form */}
          <PaymentMethodForm onDataChange={handleDataChange} />

          {/* Hotel Cancellation Policy */}
          <HotelCancellationPolicy />
        </div>
      </div>

      {/* Right Side - Hotel Booking Summary */}
      <div className="flex-shrink-0 w-[400px]">
        <HotelPaymentSidebar
          hotel={hotel}
          priceSummary={priceSummary}
          onBack={onBack}
          onConfirmPay={handleConfirmPay}
        />
      </div>
    </div>
  )
}