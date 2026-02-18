'use client'

export default function HotelCancellationPolicy() {
  return (
    <div className="flex flex-col gap-4 w-full max-w-[682px]">
      <div className="flex flex-col gap-4">
        <h3 className="text-gray-600 text-lg font-semibold">
          Cancellation policy
        </h3>
        <p className="text-gray-500 text-base leading-relaxed">
          This hotel booking has a flexible cancellation policy. If you cancel or change your booking up to 24 hours before the check-in date, you are eligible for a free refund. All hotel bookings made on The Travelplace are backed by our satisfaction guarantee, however cancellation policies vary by hotel. See the full cancellation policy for this booking.
        </p>
      </div>
    </div>
  )
}