// Quick test for airport code extraction
function extractAirportCode(airportString) {
  // Extract code from format like "London Heathrow Airport (LHR)"
  const match = airportString.match(/\(([A-Z]{3})\)/);
  return match ? match[1] : airportString.substring(0, 3).toUpperCase();
}

// Test cases
const testCases = [
  "London Heathrow Airport (LHR)",
  "Charles de Gaulle Airport (CDG)",
  "John F. Kennedy International Airport (JFK)",
  "Dubai International Airport (DXB)",
  "LHR", // Already a code
  "CDG", // Already a code
  "invalid input"
];

console.log('🧪 Testing Airport Code Extraction:');
testCases.forEach(test => {
  const result = extractAirportCode(test);
  console.log(`"${test}" → "${result}"`);
});

// Expected output:
// "London Heathrow Airport (LHR)" → "LHR"
// "Charles de Gaulle Airport (CDG)" → "CDG"
// "John F. Kennedy International Airport (JFK)" → "JFK"
// "Dubai International Airport (DXB)" → "DXB"
// "LHR" → "LHR"
// "CDG" → "CDG"
// "invalid input" → "INV"