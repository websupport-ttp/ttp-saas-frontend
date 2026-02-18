'use client'

interface PassengerInfoHeaderProps {
  title?: string
  description?: string
}

export default function PassengerInfoHeader({
  title = "Passenger information",
  description = "Enter the required information for each traveler and be sure that it exactly matches the government-issued ID presented at the airport."
}: PassengerInfoHeaderProps) {
  return (
    <div className="flex flex-col gap-4 w-full max-w-[682px]">
      <h2 className="text-red-600 text-2xl font-bold leading-tight">
        {title}
      </h2>
      <p className="text-gray-600 text-lg leading-relaxed">
        {description}
      </p>
    </div>
  )
}