const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

// Test data storage
let testData = {
  users: {},
  bins: {},
  events: {}
};

async function testAPI() {
  console.log('🚀 Starting Smart Bin API Tests...\n');

  try {
    // 1. Health Check
    console.log('1. Testing Health Check...');
    const health = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health Check:', health.data.status);
    console.log('Database Connected:', health.data.database.connected);
    console.log('');

    // 2. Create Test Users
    console.log('2. Creating Test Users...');
    
    const adminUser = await axios.post(`${BASE_URL}/api/users`, {
      email: 'admin@smartbin.com',
      role: 'admin',
      display_name: 'System Administrator',
      contact_phone: '+1234567890',
      contact_address: '123 Admin Street, City, State'
    });
    testData.users.admin = adminUser.data.data;
    console.log('✅ Admin User Created:', adminUser.data.data.user_id);

    const hostUser = await axios.post(`${BASE_URL}/api/users`, {
      email: 'host1@smartbin.com',
      role: 'host',
      display_name: 'John Doe',
      contact_phone: '+1234567891',
      contact_address: '456 Host Avenue, City, State'
    });
    testData.users.host = hostUser.data.data;
    console.log('✅ Host User Created:', hostUser.data.data.user_id);

    const deviceUser = await axios.post(`${BASE_URL}/api/users`, {
      email: 'device1@smartbin.com',
      role: 'device',
      display_name: 'Smart Bin Device 001'
    });
    testData.users.device = deviceUser.data.data;
    console.log('✅ Device User Created:', deviceUser.data.data.user_id);
    console.log('');

    // 3. Create Test Bins
    console.log('3. Creating Test Bins...');
    
    const bin1 = await axios.post(`${BASE_URL}/api/bins`, {
      bin_code: 'BIN001',
      user_id: testData.users.host.user_id,
      location: 'Downtown Mall - Food Court',
      latitude: 40.7128,
      longitude: -74.0060,
      status: 'active'
    });
    testData.bins.bin1 = bin1.data.data;
    console.log('✅ Bin 1 Created:', bin1.data.data.bin_id);

    const bin2 = await axios.post(`${BASE_URL}/api/bins`, {
      bin_code: 'BIN002',
      user_id: testData.users.host.user_id,
      location: 'Central Park - Near Fountain',
      latitude: 40.7829,
      longitude: -73.9654,
      status: 'active'
    });
    testData.bins.bin2 = bin2.data.data;
    console.log('✅ Bin 2 Created:', bin2.data.data.bin_id);
    console.log('');

    // 4. Create Test Events
    console.log('4. Creating Test Events...');
    
    const event1 = await axios.post(`${BASE_URL}/api/events`, {
      bin_id: testData.bins.bin1.bin_id,
      user_id: testData.users.device.user_id,
      timestamp_utc: new Date().toISOString(),
      categories: {
        plastic: 5,
        paper: 8,
        metal: 2,
        glass: 1,
        organic: 12
      },
      payload_json: {
        sensor_data: {
          temperature: 22.5,
          humidity: 45.2,
          pressure: 1013.2
        },
        device_info: {
          firmware_version: '1.2.3',
          battery_voltage: 3.8
        }
      },
      hv_count: 3,
      lv_count: 6,
      org_count: 8,
      battery_pct: 85.5,
      fill_level_pct: 65.2,
      weight_kg_total: 12.5,
      weight_kg_delta: 2.1
    });
    testData.events.event1 = event1.data.data;
    console.log('✅ Event 1 Created:', event1.data.data.id);

    const event2 = await axios.post(`${BASE_URL}/api/events`, {
      bin_id: testData.bins.bin2.bin_id,
      user_id: testData.users.device.user_id,
      timestamp_utc: new Date().toISOString(),
      categories: {
        plastic: 3,
        paper: 6,
        metal: 1,
        glass: 0,
        organic: 9
      },
      payload_json: {
        sensor_data: {
          temperature: 21.8,
          humidity: 42.1,
          pressure: 1012.8
        }
      },
      hv_count: 2,
      lv_count: 4,
      org_count: 6,
      battery_pct: 87.2,
      fill_level_pct: 45.8,
      weight_kg_total: 8.3,
      weight_kg_delta: 1.5
    });
    testData.events.event2 = event2.data.data;
    console.log('✅ Event 2 Created:', event2.data.data.id);
    console.log('');

    // 5. Test Retrieval Operations
    console.log('5. Testing Retrieval Operations...');
    
    const allUsers = await axios.get(`${BASE_URL}/api/users`);
    console.log('✅ All Users Retrieved:', allUsers.data.data.length, 'users');

    const allBins = await axios.get(`${BASE_URL}/api/bins`);
    console.log('✅ All Bins Retrieved:', allBins.data.data.length, 'bins');

    const allEvents = await axios.get(`${BASE_URL}/api/events`);
    console.log('✅ All Events Retrieved:', allEvents.data.data.length, 'events');

    const binStats = await axios.get(`${BASE_URL}/api/bins/${testData.bins.bin1.bin_id}/stats`);
    console.log('✅ Bin Statistics Retrieved for Bin 1');
    console.log('');

    // 6. Display Test Results
    console.log('🎉 All Tests Completed Successfully!');
    console.log('');
    console.log('📋 Test Data Summary:');
    console.log('=====================');
    console.log(`Admin User ID: ${testData.users.admin.user_id}`);
    console.log(`Host User ID: ${testData.users.host.user_id}`);
    console.log(`Device User ID: ${testData.users.device.user_id}`);
    console.log(`Bin 1 ID: ${testData.bins.bin1.bin_id}`);
    console.log(`Bin 2 ID: ${testData.bins.bin2.bin_id}`);
    console.log(`Event 1 ID: ${testData.events.event1.id}`);
    console.log(`Event 2 ID: ${testData.events.event2.id}`);
    console.log('');
    console.log('🔧 Postman Variables to Set:');
    console.log('============================');
    console.log(`user_id: ${testData.users.host.user_id}`);
    console.log(`host_user_id: ${testData.users.host.user_id}`);
    console.log(`device_user_id: ${testData.users.device.user_id}`);
    console.log(`bin_id: ${testData.bins.bin1.bin_id}`);
    console.log(`event_id: ${testData.events.event1.id}`);
    console.log('');
    console.log('📊 Sample API Calls:');
    console.log('====================');
    console.log(`GET ${BASE_URL}/health`);
    console.log(`GET ${BASE_URL}/api/users`);
    console.log(`GET ${BASE_URL}/api/bins`);
    console.log(`GET ${BASE_URL}/api/events`);
    console.log(`GET ${BASE_URL}/api/bins/${testData.bins.bin1.bin_id}/stats`);

  } catch (error) {
    console.error('❌ Test Failed:', error.response?.data || error.message);
    if (error.response?.data) {
      console.error('Error Details:', error.response.data);
    }
  }
}

// Run the test
testAPI(); 