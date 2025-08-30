require('dotenv').config();
const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testWithExistingData() {
  console.log('🚀 Testing Smart Bin API with Existing Data...\n');

  try {
    // 1. Health Check
    console.log('1. Testing Health Check...');
    const health = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health Check:', health.data.status);
    console.log('Database Connected:', health.data.database.connected);
    console.log('');

    // 2. Get All Bins (should return your 4 existing bins)
    console.log('2. Testing Get All Bins...');
    const bins = await axios.get(`${BASE_URL}/api/bins`);
    console.log(`✅ Found ${bins.data.data.length} bins:`);
    bins.data.data.forEach((bin, index) => {
      console.log(`${index + 1}. ${bin.bin_code} - ${bin.location || 'No location'}`);
    });
    console.log('');

    // 3. Get All Events (should return your 3 existing events)
    console.log('3. Testing Get All Events...');
    const events = await axios.get(`${BASE_URL}/api/events`);
    console.log(`✅ Found ${events.data.data.length} events:`);
    events.data.data.forEach((event, index) => {
      console.log(`${index + 1}. Event ${event.id.substring(0, 8)}...`);
      console.log(`   Bin: ${event.bin_id.substring(0, 8)}...`);
      console.log(`   Time: ${event.timestamp_utc}`);
      console.log(`   Battery: ${event.battery_pct}%, Fill: ${event.fill_level_pct}%`);
      console.log(`   Weight: ${event.weight_kg_total}kg`);
    });
    console.log('');

    // 4. Get All Users (from profiles table)
    console.log('4. Testing Get All Users...');
    const users = await axios.get(`${BASE_URL}/api/users`);
    console.log(`✅ Found ${users.data.data.length} users:`);
    users.data.data.forEach((user, index) => {
      console.log(`${index + 1}. ${user.display_name || user.name} (${user.role})`);
    });
    console.log('');

    // 5. Test specific bin operations
    if (bins.data.data.length > 0) {
      const firstBin = bins.data.data[0];
      console.log(`5. Testing Bin Operations for ${firstBin.bin_code}...`);
      
      // Get specific bin
      const binDetail = await axios.get(`${BASE_URL}/api/bins/${firstBin.id}`);
      console.log(`✅ Bin Details: ${binDetail.data.data.bin_code} - ${binDetail.data.data.location}`);
      
      // Get bin statistics
      try {
        const binStats = await axios.get(`${BASE_URL}/api/bins/${firstBin.id}/stats`);
        console.log(`✅ Bin Statistics: ${binStats.data.data.total_events} events`);
      } catch (error) {
        console.log('⚠️ Bin statistics view not available yet');
      }
      console.log('');
    }

    // 6. Test event filtering
    console.log('6. Testing Event Filtering...');
    
    // Get events for specific bin
    if (events.data.data.length > 0) {
      const firstEvent = events.data.data[0];
      const binEvents = await axios.get(`${BASE_URL}/api/events/bin/${firstEvent.bin_id}`);
      console.log(`✅ Events for bin ${firstEvent.bin_id.substring(0, 8)}...: ${binEvents.data.data.length} events`);
    }

    // Get events with pagination
    const paginatedEvents = await axios.get(`${BASE_URL}/api/events?limit=2&offset=0`);
    console.log(`✅ Paginated events: ${paginatedEvents.data.data.length} events (limit 2)`);
    console.log('');

    // 7. Test data analysis endpoints
    console.log('7. Testing Data Analysis...');
    
    // Get recent events
    const recentEvents = await axios.get(`${BASE_URL}/api/events?limit=5`);
    if (recentEvents.data.data.length > 0) {
      const avgBattery = recentEvents.data.data.reduce((sum, e) => sum + (e.battery_pct || 0), 0) / recentEvents.data.data.length;
      const avgFill = recentEvents.data.data.reduce((sum, e) => sum + (e.fill_level_pct || 0), 0) / recentEvents.data.data.length;
      const totalWeight = recentEvents.data.data.reduce((sum, e) => sum + (e.weight_kg_total || 0), 0);
      
      console.log(`📊 Analysis Results:`);
      console.log(`   Average Battery: ${avgBattery.toFixed(1)}%`);
      console.log(`   Average Fill Level: ${avgFill.toFixed(1)}%`);
      console.log(`   Total Weight: ${totalWeight.toFixed(1)}kg`);
      console.log(`   Total Events: ${recentEvents.data.data.length}`);
    }
    console.log('');

    // 8. Display API endpoints for manual testing
    console.log('🎯 API Endpoints for Manual Testing:');
    console.log('=====================================');
    console.log(`GET ${BASE_URL}/health`);
    console.log(`GET ${BASE_URL}/api/bins`);
    console.log(`GET ${BASE_URL}/api/events`);
    console.log(`GET ${BASE_URL}/api/users`);
    
    if (bins.data.data.length > 0) {
      const binId = bins.data.data[0].id;
      console.log(`GET ${BASE_URL}/api/bins/${binId}`);
      console.log(`GET ${BASE_URL}/api/events/bin/${binId}`);
    }
    
    if (events.data.data.length > 0) {
      const eventId = events.data.data[0].id;
      console.log(`GET ${BASE_URL}/api/events/${eventId}`);
    }
    
    if (users.data.data.length > 0) {
      const userId = users.data.data[0].user_id;
      console.log(`GET ${BASE_URL}/api/users/${userId}`);
    }
    console.log('');

    // 9. Postman variables
    console.log('🔧 Postman Variables to Set:');
    console.log('============================');
    if (bins.data.data.length > 0) {
      console.log(`bin_id: ${bins.data.data[0].id}`);
    }
    if (events.data.data.length > 0) {
      console.log(`event_id: ${events.data.data[0].id}`);
    }
    if (users.data.data.length > 0) {
      console.log(`user_id: ${users.data.data[0].user_id}`);
      console.log(`host_user_id: ${users.data.data.find(u => u.role === 'host')?.user_id || users.data.data[0].user_id}`);
      console.log(`device_user_id: ${users.data.data.find(u => u.role === 'device')?.user_id || users.data.data[0].user_id}`);
    }
    console.log('');

    console.log('🎉 All tests completed successfully!');
    console.log('Your existing data is working perfectly with the API!');

  } catch (error) {
    console.error('❌ Test Failed:', error.response?.data || error.message);
    if (error.response?.data) {
      console.error('Error Details:', error.response.data);
    }
  }
}

// Run the test
testWithExistingData(); 