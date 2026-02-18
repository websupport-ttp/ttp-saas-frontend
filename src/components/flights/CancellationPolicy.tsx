'use client'

interface CancellationPolicyProps {
  onBack?: () => void
  onConfirmPay?: () => void
}

export default function CancellationPolicy({
  onBack,
  onConfirmPay
}: CancellationPolicyProps) {
  return (
    <div className="flex flex-col gap-4 w-full max-w-[682px]">
      <div className="flex flex-col gap-4">
        <h3 className="text-gray-600 text-lg font-semibold">
          Cancellation policy
        </h3>
        <p className="text-gray-500 text-base leading-relaxed">
          This flight has a flexible cancellation policy. If you cancel or change your flight up to 30 days before the departure date, you are eligible for a free refund. All flights booked on The Travelplace are backed by our satisfaction guarantee, however cancellation policies vary by airline. See the full cancellation policy for this flight.
        </p>
      </div>

      {/* Button Row */}
      <div className="flex gap-6 mt-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-5 py-3 h-12 rounded text-lg font-normal hover:bg-red-50 transition-colors"
          style={{
            border: '3px solid #E21E24',
            color: '#E21E24',
            backgroundColor: 'white',
            borderRadius: '4px'
          }}
        >
          Back
        </button>
        
        <button
          onClick={onConfirmPay}
          className="flex items-center gap-2 px-5 py-3 h-12 bg-[#E21E24] rounded text-white text-lg font-normal hover:bg-red-700 transition-colors"
        >
          Confirm and pay
        </button>
      </div>
    </div>
  )
}