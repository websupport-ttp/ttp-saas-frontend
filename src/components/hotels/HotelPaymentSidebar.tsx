'use client'

interface HotelDetails {
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

interface PriceSummary {
  subtotal: number
  taxesAndFees: number
  total: number
}

interface HotelPaymentSidebarProps {
  hotel: HotelDetails
  priceSummary: PriceSummary
  onBack?: () => void
  onConfirmPay?: () => void
}

export default function HotelPaymentSidebar({
  hotel,
  priceSummary,
  onBack,
  onConfirmPay
}: HotelPaymentSidebarProps) {
  return (
    <div className="flex flex-col items-end gap-10 w-[400px]">
      {/* Hotel Booking Summary */}
      <div className="flex flex-col gap-4 p-6 bg-white border border-gray-200 rounded-xl w-full">
        {/* Hotel Details */}
        <div className="flex gap-4">
          <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
            <img
              src={hotel.images?.[0] || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yOCAyNEgzNlYzMkgyOFYyNFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTIwIDIwSDQ0VjQ0SDIwVjIwWiIgc3Ryb2tlPSIjOUNBM0FGIiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiLz4KPGNpcmNsZSBjeD0iMjgiIGN5PSIyOCIgcj0iNCIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K'}
              alt={hotel.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yOCAyNEgzNlYzMkgyOFYyNFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTIwIDIwSDQ0VjQ0SDIwVjIwWiIgc3Ryb2tlPSIjOUNBM0FGIiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiLz4KPGNpcmNsZSBjeD0iMjgiIGN5PSIyOCIgcj0iNCIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K';
              }}
            />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{hotel.name}</h3>
            <p className="text-gray-600 text-sm">
              {hotel.location.city}, {hotel.location.country}
            </p>
          </div>
        </div>

        {/* Booking Details */}
        <div className="border-t border-gray-200 pt-4">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Duration:</span>
              <span className="text-gray-900 font-medium">{hotel.bookingInfo.nights} night{hotel.bookingInfo.nights > 1 ? 's' : ''}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Guests:</span>
              <span className="text-gray-900 font-medium">
                {hotel.bookingInfo.adults} adult{hotel.bookingInfo.adults > 1 ? 's' : ''}, {hotel.bookingInfo.children} children
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Rooms:</span>
              <span className="text-gray-900 font-medium">{hotel.bookingInfo.rooms} room{hotel.bookingInfo.rooms > 1 ? 's' : ''}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Rate:</span>
              <span className="text-gray-900 font-medium">₦{hotel.pricePerNight?.toLocaleString()}/night</span>
            </div>
          </div>
        </div>
      </div>

      {/* Price Summary */}
      <div className="flex justify-between gap-10 p-4 bg-white border border-gray-200 rounded-lg w-full">
        <div className="flex flex-col gap-2">
          <div className="text-gray-900 text-base font-semibold">
            Subtotal
          </div>
          <div className="text-gray-900 text-base font-semibold">
            Taxes and Fees
          </div>
          <div className="text-gray-900 text-base font-semibold">
            Total
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="text-gray-900 text-base font-semibold">
            ₦{priceSummary.subtotal.toLocaleString()}
          </div>
          <div className="text-gray-900 text-base font-semibold">
            ₦{priceSummary.taxesAndFees.toLocaleString()}
          </div>
          <div className="text-gray-900 text-base font-semibold">
            ₦{priceSummary.total.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Button Row */}
      <div className="flex gap-6 w-full">
        <button
          onClick={onBack}
          className="flex-1 flex items-center justify-center gap-2 px-5 py-3 h-12 rounded text-lg font-normal hover:bg-red-50 transition-colors"
          style={{
            border: '1px solid #E21E24',
            color: '#E21E24',
            backgroundColor: 'white',
            borderRadius: '4px'
          }}
        >
          Back
        </button>

        <button
          onClick={onConfirmPay}
          className="flex-1 flex items-center justify-center gap-2 px-5 py-3 h-12 bg-[#E21E24] rounded text-white text-lg font-normal hover:bg-red-700 transition-colors"
        >
          Confirm and pay
        </button>
      </div>
    </div>
  )
}