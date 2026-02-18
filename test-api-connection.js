// Test API connection from frontend
const axios = require('axios');

const testApiConnection = async () => {
  try {
    console.log('🧪 Testing API connection from frontend...');
    
    // Test health endpoint first
    console.log('📡 Testing health endpoint...');
    const healthResponse = await axios.get('http://localhost:3004/health');
    console.log('✅ Health check:', healthResponse.status, healthResponse.data);
    
    // Test flight search endpoint
    console.log('\n📡 Testing flight search endpoint...');
    const flightData = {
      originLocationCode: 'LOS',
      destinationLocationCode: 'JFK',
      departureDate: '2024-12-15',
      adults: 1,
      children: 0,
      infants: 0,
      currencyCode: 'NGN',
      travelClass: 'ECONOMY',
      nonStop: false,
      max: 10
    };
    
    const flightResponse = await axios.post('http://localhost:3004/api/v1/products/flights/search', flightData);
    console.log('✅ Flight search:', flightResponse.status);
    console.log('✅ Flight data count:', flightResponse.data.data?.data?.length || 0);
    
    console.log('\n🎉 All API connections successful!');
    
  } catch (error) {
    console.error('❌ API connection failed:');
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    } else {
      console.error('   Error:', error.message);
    }
  }
};

testApiConnection();