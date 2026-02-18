// Test script to verify flight API connection to backend
const axios = require('axios');

const API_BASE_URL = 'http://localhost:8080/api/v1';

async function testFlightSearch() {
  try {
    console.log('🔍 Testing Flight Search API Connection...\n');
    
    const searchData = {
      originLocationCode: 'LOS',
      destinationLocationCode: 'JFK',
      departureDate: '2024-12-15',
      returnDate: '2024-12-22',
      adults: 2,
      children: 1,
      infants: 0,
      currencyCode: 'NGN',
      travelClass: 'ECONOMY',
      nonStop: false,
      max: 50
    };

    console.log('📤 Sending request to:', `${API_BASE_URL}/products/flights/search`);
    console.log('📤 Request data:', JSON.stringify(searchData, null, 2));

    const response = await axios.post(`${API_BASE_URL}/products/flights/search`, searchData, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: 30000
    });
    
    console.log('✅ Flight Search Response Status:', response.status);
    console.log('✅ Response Status:', response.data.status);
    console.log('✅ Response Message:', response.data.message);
    
    if (response.data.data) {
      const flightData = response.data.data;
      console.log('✅ Flight Results Found:', flightData.meta?.count || flightData.data?.length || 0);
      
      if (flightData.data && flightData.data.length > 0) {
        const firstFlight = flightData.data[0];
        console.log('✅ Sample Flight:', {
          id: firstFlight.id,
          price: firstFlight.price?.total,
          currency: firstFlight.price?.currency,
          carrier: firstFlight.validatingAirlineCodes?.[0] || 'N/A'
        });
      }
      
      if (flightData.dictionaries) {
        console.log('✅ Dictionaries Available:', Object.keys(flightData.dictionaries));
      }
    }
    
    console.log('\n🎉 Flight API Connection Test Successful!');
    return true;
    
  } catch (error) {
    console.error('❌ Flight API Connection Test Failed:');
    
    if (error.response) {
      console.error('❌ Response Status:', error.response.status);
      console.error('❌ Response Data:', error.response.data);
    } else if (error.request) {
      console.error('❌ No Response Received - Check if backend is running on port 8080');
      console.error('❌ Request Error:', error.message);
    } else {
      console.error('❌ Request Setup Error:', error.message);
    }
    
    return false;
  }
}

async function testBackendHealth() {
  try {
    console.log('🏥 Testing Backend Health...\n');
    
    const response = await axios.get(`${API_BASE_URL.replace('/api/v1', '')}/health`, {
      timeout: 10000
    });
    
    console.log('✅ Backend Health Status:', response.data.data?.status);
    console.log('✅ Services Status:', Object.keys(response.data.data?.services || {}));
    
    return true;
  } catch (error) {
    console.error('❌ Backend Health Check Failed:', error.message);
    return false;
  }
}

async function runTests() {
  console.log('🚀 Starting Flight API Connection Tests...\n');
  
  // Test backend health first
  const healthOk = await testBackendHealth();
  
  if (!healthOk) {
    console.log('\n⚠️  Backend health check failed. Make sure your backend is running on port 8080');
    console.log('💡 Start your backend with: cd backend && npm start');
    return;
  }
  
  // Test flight search
  const flightOk = await testFlightSearch();
  
  console.log('\n📋 Test Summary:');
  console.log(`- Backend Health: ${healthOk ? '✅ OK' : '❌ Failed'}`);
  console.log(`- Flight Search: ${flightOk ? '✅ OK' : '❌ Failed'}`);
  
  if (healthOk && flightOk) {
    console.log('\n🎉 All tests passed! Your frontend is now connected to the real backend API.');
    console.log('💡 Frontend Environment: NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api/v1');
    console.log('💡 Backend Running: http://localhost:8080');
  } else {
    console.log('\n⚠️  Some tests failed. Please check your backend configuration.');
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { testFlightSearch, testBackendHealth };