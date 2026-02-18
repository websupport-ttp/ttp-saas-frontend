// Utility functions for airline-related operations

/**
 * Get airline logo path based on airline name
 */
export function getAirlineLogo(airlineName: string): string {
  if (!airlineName) {
    return '/images/flights/airlines/default-airline.svg'
  }

  // Normalize airline name for consistent matching
  const normalizedName = airlineName.toLowerCase().trim()
  
  // Map of airline names to their logo files
  const airlineLogos: Record<string, string> = {
    // Major International Airlines
    'hawaiian airlines': '/images/flights/airlines/hawaiian-airlines.svg',
    'hawaiian': '/images/flights/airlines/hawaiian-airlines.svg',
    'delta airlines': '/images/flights/airlines/delta-airlines.svg',
    'delta': '/images/flights/airlines/delta-airlines.svg',
    'american airlines': '/images/flights/airlines/american-airlines.svg',
    'american': '/images/flights/airlines/american-airlines.svg',
    'united airlines': '/images/flights/airlines/united-airlines.svg',
    'united': '/images/flights/airlines/united-airlines.svg',
    'lufthansa': '/images/flights/airlines/lufthansa.svg',
    'british airways': '/images/flights/airlines/british-airways.svg',
    'emirates': '/images/flights/airlines/emirates.svg',
    'qatar airways': '/images/flights/airlines/qatar-airways.svg',
    'etihad airways': '/images/flights/airlines/etihad-airways.svg',
    'turkish airlines': '/images/flights/airlines/turkish-airlines.svg',
    'klm': '/images/flights/airlines/klm.svg',
    'air france': '/images/flights/airlines/air-france.svg',
    'swiss': '/images/flights/airlines/swiss.svg',
    'austrian airlines': '/images/flights/airlines/austrian-airlines.svg',
    
    // African Airlines
    'arik air': '/images/flights/airlines/arik-air.svg',
    'air peace': '/images/flights/airlines/air-peace.svg',
    'dana air': '/images/flights/airlines/dana-air.svg',
    'azman air': '/images/flights/airlines/azman-air.svg',
    'max air': '/images/flights/airlines/max-air.svg',
    'overland airways': '/images/flights/airlines/overland-airways.svg',
    'ethiopian airlines': '/images/flights/airlines/ethiopian-airlines.svg',
    'kenya airways': '/images/flights/airlines/kenya-airways.svg',
    'south african airways': '/images/flights/airlines/south-african-airways.svg',
    'egyptair': '/images/flights/airlines/egyptair.svg',
    
    // Budget Airlines
    'ryanair': '/images/flights/airlines/ryanair.svg',
    'easyjet': '/images/flights/airlines/easyjet.svg',
    'southwest': '/images/flights/airlines/southwest.svg',
    'jetblue': '/images/flights/airlines/jetblue.svg',
    'spirit airlines': '/images/flights/airlines/spirit-airlines.svg',
    'frontier airlines': '/images/flights/airlines/frontier-airlines.svg',
  }

  // Try exact match first
  if (airlineLogos[normalizedName]) {
    return airlineLogos[normalizedName]
  }

  // Try partial matches for airline codes or variations
  for (const [key, logo] of Object.entries(airlineLogos)) {
    if (normalizedName.includes(key) || key.includes(normalizedName)) {
      return logo
    }
  }

  // Return default airline logo if no match found
  return '/images/flights/airlines/default-airline.svg'
}

/**
 * Format flight duration from minutes to readable format
 */
export function formatFlightDuration(durationMinutes: number): string {
  if (!durationMinutes || durationMinutes <= 0) {
    return 'N/A'
  }

  const hours = Math.floor(durationMinutes / 60)
  const minutes = durationMinutes % 60

  if (hours === 0) {
    return `${minutes}m`
  } else if (minutes === 0) {
    return `${hours}h`
  } else {
    return `${hours}h ${minutes}m`
  }
}

/**
 * Format flight time from ISO string or time string
 */
export function formatFlightTime(timeString: string): string {
  if (!timeString) {
    return 'N/A'
  }

  try {
    // If it's already in HH:MM format, return as is
    if (/^\d{1,2}:\d{2}(\s?(AM|PM))?$/i.test(timeString)) {
      return timeString
    }

    // Try to parse as ISO date
    const date = new Date(timeString)
    if (!isNaN(date.getTime())) {
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    }

    return timeString
  } catch (error) {
    console.warn('Error formatting flight time:', error)
    return timeString
  }
}

/**
 * Extract airline code from flight number (e.g., "AA123" -> "AA")
 */
export function extractAirlineCode(flightNumber: string): string {
  if (!flightNumber) {
    return ''
  }

  const match = flightNumber.match(/^([A-Z]{2,3})/i)
  return match ? match[1].toUpperCase() : ''
}

/**
 * Format layover information
 */
export function formatLayover(layoverMinutes: number, layoverAirport: string): string {
  if (!layoverMinutes || layoverMinutes <= 0) {
    return ''
  }

  const duration = formatFlightDuration(layoverMinutes)
  return layoverAirport ? `${duration} in ${layoverAirport}` : duration
}