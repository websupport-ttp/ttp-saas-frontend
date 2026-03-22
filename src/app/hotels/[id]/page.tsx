'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import ServiceFooter from '@/components/layout/ServiceFooter';
import { SAMPLE_HOTELS } from '@/lib/hotels';
import AmenityIcon from '@/components/ui/AmenityIcon';
import { useCurrency } from '@/contexts/CurrencyContext';
import { hotelService, HotelRate } from '@/lib/services/hotel-service';

const PLACEHOLDER_IMG =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgdmlld0JveD0iMCAwIDgwMCA2MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zNjggMjgwSDQzMlYzNDRIMzY4VjI4MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHA+CjxwYXRoIGQ9Ik0zMjggMjQwSDQ3MlYzODRIMzI4VjI0MFoiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJub25lIi8+CjxjaXJjbGUgY3g9IjM2MCIgY3k9IjI3MiIgcj0iMTYiIGZpbGw9IiM5Q0EzQUYiLz4KPHA+Cjx0ZXh0IHg9IjQwMCIgeT0iMzIwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM2QjcyODAiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkhvdGVsIEltYWdlPC90ZXh0Pgo8L3N2Zz4K';

export default function HotelDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { formatAmount } = useCurrency();

  const [hotel, setHotel] = useState<any>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);

  // Room selection state
  const [rates, setRates] = useState<HotelRate[]>([]);
  const [ratesLoading, setRatesLoading] = useState(false);
  const [ratesError, setRatesError] = useState<string | null>(null);
  const [selectingRateHash, setSelectingRateHash] = useState<string | null>(null);
  const [hotelPageData, setHotelPageData] = useState<any>(null);
  const [isFavorited, setIsFavorited] = useState(false);

  const safeImageIndex = hotel?.images?.length
    ? Math.min(currentImageIndex, hotel.images.length - 1)
    : 0;

  const getCurrentImage = () => {
    if (imageError || !hotel?.images?.length) return PLACEHOLDER_IMG;
    return hotel.images[safeImageIndex] || PLACEHOLDER_IMG;
  };

  // ── Derive booking context ──────────────────────────────────────────────────
  const getBookingContext = useCallback(() => {
    const checkin = searchParams.get('checkin');
    const checkout = searchParams.get('checkout');
    const adults = searchParams.get('adults');
    const children = searchParams.get('children');
    const rooms = searchParams.get('rooms');

    if (checkin && checkout) {
      const nights = Math.max(1, Math.ceil(
        (new Date(checkout).getTime() - new Date(checkin).getTime()) / 86400000
      ));
      return {
        checkin, checkout,
        adults: parseInt(adults || '1'),
        children: parseInt(children || '0'),
        rooms: parseInt(rooms || '1'),
        nights,
      };
    }

    try {
      const c = JSON.parse(localStorage.getItem('hotelSearchCriteria') || '{}');
      const ci = new Date(c.checkIn);
      const co = new Date(c.checkOut);
      if (!isNaN(ci.getTime()) && !isNaN(co.getTime())) {
        return {
          checkin: ci.toISOString().split('T')[0],
          checkout: co.toISOString().split('T')[0],
          adults: c.adults || 1,
          children: c.children || 0,
          rooms: c.rooms || 1,
          nights: Math.max(1, Math.ceil((co.getTime() - ci.getTime()) / 86400000)),
        };
      }
    } catch { /* ignore */ }

    return { checkin: null, checkout: null, adults: 1, children: 0, rooms: 1, nights: 1 };
  }, [searchParams]);

  // ── Load hotel data ─────────────────────────────────────────────────────────
  useEffect(() => {
    const hotelId = params.id as string;
    const ctx = getBookingContext();
    const bookingInfo = { adults: ctx.adults, children: ctx.children, nights: ctx.nights, rooms: ctx.rooms };

    const applyHotel = (data: any) => setHotel({ ...data, bookingInfo });

    if (hotelId.startsWith('dummy_hotel_')) {
      try {
        const sel = localStorage.getItem('selectedHotel');
        if (sel) {
          const h = JSON.parse(sel);
          if (h.id === hotelId) {
            applyHotel(buildHotelShape(h, bookingInfo));
            return;
          }
        }
        const res = localStorage.getItem('hotelSearchResults');
        if (res) {
          const found = JSON.parse(res).find((h: any) => h.id === hotelId);
          if (found) { applyHotel(buildHotelShape(found, bookingInfo)); return; }
        }
      } catch { /* ignore */ }
      router.replace('/hotels');
      return;
    }

    const sample = SAMPLE_HOTELS.find(h => h.id === hotelId);
    if (sample) {
      applyHotel({
        ...sample,
        fullDescription: "This stylish hotel offers comfortable accommodations with modern amenities and excellent service.",
        serviceDescription: "Our dedicated staff ensures a seamless and enjoyable experience throughout your stay.",
        amenities: [
          { name: 'Free WiFi' }, { name: 'Restaurant' }, { name: 'Bathroom' },
          { name: 'Air Conditioning' }, { name: 'Parking Available' },
          { name: 'Fitness Center' }, { name: 'Room Service' }, { name: 'Tea/Coffee Machine' },
        ],
        bookingInfo,
      });
    } else {
      router.replace('/hotels');
    }
  }, [params.id, router, getBookingContext]);

  // ── Fetch live rates from ETG hotelpage ─────────────────────────────────────
  useEffect(() => {
    if (!hotel) return;
    const ctx = getBookingContext();
    if (!ctx.checkin || !ctx.checkout) return;

    const isEtg = hotel.hid || hotel.id?.startsWith('dummy_hotel_') === false;
    if (!isEtg) return;

    const residency = (() => {
      try { return JSON.parse(localStorage.getItem('hotelSearchCriteria') || '{}').residency || 'ng'; } catch { return 'ng'; }
    })();

    setRatesLoading(true);
    setRatesError(null);

    hotelService.getHotelPage({
      hotelId: hotel.id,
      checkin: ctx.checkin,
      checkout: ctx.checkout,
      guests: [{ adults: ctx.adults, children: [] }],
      residency,
    }).then(page => {
      setHotelPageData(page);
      const sorted = [...(page.rates || [])].sort(
        (a, b) => parseFloat(a.showAmount || a.dailyPrice || '0') - parseFloat(b.showAmount || b.dailyPrice || '0')
      );
      setRates(sorted);
    }).catch(err => {
      console.warn('Could not load room rates:', err.message);
      setRatesError('Could not load room rates. You can still proceed with the default rate.');
      // Fall back to rates stored in search results
      const fallback = hotel.rates || [];
      setRates(fallback);
    }).finally(() => setRatesLoading(false));
  }, [hotel?.id]);

  // ── Select a room: prebook → navigate to /hotels/book ──────────────────────
  const handleSelectRoom = async (rate: HotelRate) => {
    setSelectingRateHash(rate.bookHash);
    const ctx = getBookingContext();

    try {
      const prebook = await hotelService.prebookRate(rate.bookHash, 0);
      localStorage.setItem('prebookedRate', JSON.stringify(prebook));
      localStorage.setItem('hotelPageData', JSON.stringify(hotelPageData));

      const hotelForBooking = { ...hotel, pricePerNight: parseFloat(rate.dailyPrice || rate.showAmount || '0') };
      const urlParams = new URLSearchParams();
      urlParams.set('hotel', encodeURIComponent(JSON.stringify(hotelForBooking)));
      if (ctx.checkin) urlParams.set('checkin', ctx.checkin);
      if (ctx.checkout) urlParams.set('checkout', ctx.checkout);
      urlParams.set('adults', ctx.adults.toString());
      urlParams.set('children', ctx.children.toString());
      urlParams.set('rooms', ctx.rooms.toString());

      router.push(`/hotels/book?${urlParams.toString()}`);
    } catch (err: any) {
      console.error('Prebook failed:', err);
      setRatesError(`Could not reserve this room: ${err.message || 'Please try another room.'}`);
    } finally {
      setSelectingRateHash(null);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: hotel?.name || 'Hotel',
        text: `Check out ${hotel?.name}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href).then(() => alert('Link copied to clipboard!'));
    }
  };

  const handleFavorite = () => {
    setIsFavorited(prev => {
      const next = !prev;
      try {
        const saved: string[] = JSON.parse(localStorage.getItem('favoriteHotels') || '[]');
        if (next) {
          if (!saved.includes(hotel.id)) saved.push(hotel.id);
        } else {
          const idx = saved.indexOf(hotel.id);
          if (idx > -1) saved.splice(idx, 1);
        }
        localStorage.setItem('favoriteHotels', JSON.stringify(saved));
      } catch { /* ignore */ }
      return next;
    });
  };

  const handleProceedDefault = () => {
    const ctx = getBookingContext();
    const hotelForBooking = { ...hotel };
    const urlParams = new URLSearchParams();
    urlParams.set('hotel', encodeURIComponent(JSON.stringify(hotelForBooking)));
    if (ctx.checkin) urlParams.set('checkin', ctx.checkin);
    if (ctx.checkout) urlParams.set('checkout', ctx.checkout);
    urlParams.set('adults', ctx.adults.toString());
    urlParams.set('children', ctx.children.toString());
    urlParams.set('rooms', ctx.rooms.toString());
    router.push(`/hotels/book?${urlParams.toString()}`);
  };

  const handleBack = () => router.back();

  if (!hotel) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red mb-4" />
          <p className="text-gray-600">Loading hotel details...</p>
        </div>
      </div>
    );
  }

  const ctx = getBookingContext();

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hotel Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{hotel.name}</h1>
            <p className="text-gray-600 flex items-center text-sm">
              <svg className="h-4 w-4 mr-1 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              {hotel.location?.address && `${hotel.location.address}, `}
              {hotel.location?.city && `${hotel.location.city}, `}
              {hotel.location?.country || 'Location'}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="p-2 rounded-full border border-gray-300 hover:bg-gray-50" aria-label="Save" onClick={handleFavorite}>
              <svg className="h-5 w-5 text-gray-600" fill={isFavorited ? '#E21E24' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
            <button className="p-2 rounded-full border border-gray-300 hover:bg-gray-50" aria-label="Share" onClick={handleShare}>
              <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="relative rounded-lg overflow-hidden h-96">
              <img
                src={getCurrentImage()}
                alt={hotel.name}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
                key={`main-${safeImageIndex}-${imageError}`}
              />
            </div>
            <div className="grid grid-cols-2 grid-rows-2 gap-4 h-96">
              {hotel.images?.slice(1, 5).map((img: string, i: number) => (
                <div key={i} className="relative rounded-lg overflow-hidden">
                  <img
                    src={img}
                    alt={`${hotel.name} ${i + 2}`}
                    className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => { setCurrentImageIndex(i + 1); setImageError(false); }}
                    onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER_IMG; }}
                  />
                  {i === 3 && hotel.images?.length > 5 && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">See More Photos</span>
                    </div>
                  )}
                </div>
              ))}
              {(!hotel.images || hotel.images.length <= 1) &&
                Array.from({ length: 4 }, (_, i) => (
                  <div key={`ph-${i}`} className="relative rounded-lg overflow-hidden">
                    <img src={PLACEHOLDER_IMG} alt="placeholder" className="w-full h-full object-cover" />
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Hotel Details */}
        <div className="space-y-12">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Hotel Details</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4 text-gray-600 text-sm leading-relaxed">
                {hotel.fullDescription
                  ? hotel.fullDescription.split('\n').filter(Boolean).map((p: string, i: number) => <p key={i}>{p}</p>)
                  : <p>Comfortable accommodations with modern amenities and excellent service.</p>}
              </div>
              <div className="space-y-4 text-gray-600 text-sm leading-relaxed">
                {hotel.serviceDescription
                  ? hotel.serviceDescription.split('\n').filter(Boolean).map((p: string, i: number) => <p key={i}>{p}</p>)
                  : <p>Our dedicated staff ensures a seamless and enjoyable experience throughout your stay.</p>}
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Amenities</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {hotel.amenities?.map((amenity: any, i: number) => (
                <div key={i} className="flex items-center space-x-3">
                  <AmenityIcon name={amenity.name} className="h-5 w-5 text-gray-600 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">{amenity.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Available Rooms ─────────────────────────────────────────────── */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Available Rooms</h2>
              {ctx.checkin && ctx.checkout && (
                <span className="text-sm text-gray-500">
                  {ctx.nights} night{ctx.nights > 1 ? 's' : ''} · {ctx.adults} adult{ctx.adults > 1 ? 's' : ''}
                  {ctx.children > 0 ? ` · ${ctx.children} child${ctx.children > 1 ? 'ren' : ''}` : ''}
                </span>
              )}
            </div>

            {ratesLoading && (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="border border-gray-200 rounded-xl p-5 animate-pulse">
                    <div className="flex justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="h-5 bg-gray-200 rounded w-1/3" />
                        <div className="h-4 bg-gray-200 rounded w-1/4" />
                        <div className="h-4 bg-gray-200 rounded w-1/2" />
                      </div>
                      <div className="ml-6 flex flex-col items-end gap-2">
                        <div className="h-6 bg-gray-200 rounded w-24" />
                        <div className="h-10 bg-gray-200 rounded w-28" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!ratesLoading && ratesError && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm mb-4 flex items-center justify-between gap-4">
                <span>{ratesError}</span>
                <button
                  onClick={handleProceedDefault}
                  className="flex-shrink-0 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium text-sm"
                >
                  Proceed anyway
                </button>
              </div>
            )}

            {!ratesLoading && rates.length === 0 && !ratesError && (
              <p className="text-gray-500 text-sm">No rooms available for the selected dates.</p>
            )}

            {!ratesLoading && rates.length > 0 && (
              <div className="space-y-4">
                {rates.map((rate, i) => {
                  const price = parseFloat(rate.showAmount || rate.dailyPrice || '0');
                  const total = parseFloat(rate.showAmount || '0') || price * ctx.nights;
                  const currency = rate.currency || 'USD';
                  const isSelecting = selectingRateHash === rate.bookHash;
                  const hasFreeCancellation = !!rate.freeCancellationBefore;
                  const mealLabel = rate.mealData?.has_breakfast ? 'Breakfast included' : rate.meal === 'nomeal' ? 'No meals' : rate.meal || 'No meals';

                  return (
                    <div
                      key={rate.bookHash || i}
                      className="border border-gray-200 rounded-xl p-5 hover:border-red-300 hover:shadow-sm transition-all"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        {/* Room info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 text-base mb-1">{rate.roomName || 'Standard Room'}</h3>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {/* Meal badge */}
                            <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${
                              rate.mealData?.has_breakfast
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-100 text-gray-600'
                            }`}>
                              {rate.mealData?.has_breakfast ? (
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 6a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2zm0 6a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z" /></svg>
                              ) : (
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                              )}
                              {mealLabel}
                            </span>
                            {/* Cancellation badge */}
                            <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${
                              hasFreeCancellation
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-red-100 text-red-700'
                            }`}>
                              {hasFreeCancellation ? (
                                <>
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                  Free cancellation
                                </>
                              ) : (
                                <>
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                  Non-refundable
                                </>
                              )}
                            </span>
                            {/* Payment type */}
                            {rate.paymentType && (
                              <span className="inline-flex items-center text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium capitalize">
                                {rate.paymentType}
                              </span>
                            )}
                          </div>
                          {hasFreeCancellation && (
                            <p className="text-xs text-blue-600">
                              Free cancellation before {new Date(rate.freeCancellationBefore!).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </p>
                          )}
                          {rate.includedTaxes?.length > 0 && (
                            <p className="text-xs text-gray-500 mt-1">Taxes & fees included</p>
                          )}
                          {rate.excludedTaxes?.length > 0 && (
                            <p className="text-xs text-amber-600 mt-1">+ taxes payable at property</p>
                          )}
                        </div>

                        {/* Price + CTA */}
                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                          <div className="text-right">
                            <div className="text-xl font-bold text-gray-900">
                              {formatAmount(price, currency)}
                            </div>
                            <div className="text-xs text-gray-500">per night</div>
                            {ctx.nights > 1 && (
                              <div className="text-sm text-gray-600 mt-0.5">
                                {formatAmount(total, currency)} total
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => handleSelectRoom(rate)}
                            disabled={!!selectingRateHash}
                            className="px-5 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium text-sm disabled:opacity-60 flex items-center gap-2 min-w-[120px] justify-center"
                          >
                            {isSelecting ? (
                              <>
                                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Reserving...
                              </>
                            ) : 'Select Room'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Back button */}
            <div className="mt-8">
              <button
                onClick={handleBack}
                className="px-5 py-2 rounded-lg font-medium text-red-500 border-2 border-red-500 hover:bg-red-50 transition-colors"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      </main>

      <ServiceFooter />
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function buildHotelShape(h: any, bookingInfo: any) {
  const location =
    typeof h.location === 'string'
      ? { address: '', city: h.city || 'Unknown', country: '' }
      : h.location || { address: '', city: h.city || 'Unknown', country: '' };

  return {
    ...h,
    location,
    images: h.gallery || h.images || [],
    pricePerNight: h.rooms?.[0]?.price?.total || h.price || 0,
    fullDescription: h.description || 'This hotel offers comfortable accommodations with modern amenities and excellent service.',
    serviceDescription: 'Your stay includes comfortable rooms with modern amenities. Our dedicated staff ensures a pleasant experience throughout your visit.',
    amenities: Array.isArray(h.amenities)
      ? h.amenities.map((a: any) => (typeof a === 'string' ? { name: a } : a))
      : [{ name: 'Free WiFi' }, { name: 'Restaurant' }, { name: 'Room Service' }],
    bookingInfo,
  };
}
