'use client'

interface DatePickerInputProps {
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
  required?: boolean
  min?: string
  max?: string
  className?: string
}

export default function DatePickerInput({
  label,
  value,
  onChange,
  error,
  required = false,
  min,
  max,
  className = ''
}: DatePickerInputProps) {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Find the input and trigger its click to open date picker
    const input = e.currentTarget.querySelector('input[type="date"]') as HTMLInputElement
    if (input) {
      if (input.showPicker) {
        input.showPicker()
      } else {
        input.focus()
      }
    }
  }

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div 
        className="relative cursor-pointer"
        onClick={handleClick}
      >
        <input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          min={min}
          max={max}
          className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-brand-red cursor-pointer ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
          required={required}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}
