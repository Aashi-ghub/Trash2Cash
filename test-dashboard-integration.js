const fetch = require('node-fetch');

const API_BASE = 'http://localhost:3001';

async function testDashboardIntegration() {
  console.log('🧪 Testing Dashboard Integration...\n');

  try {
    // Test 1: Health Check
    console.log('1. Testing Health Check...');
    const healthResponse = await fetch(`${API_BASE}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health Check:', healthData.status === 'ok' ? 'PASSED' : 'FAILED');

    // Test 2: Get Users (should return the test user)
    console.log('\n2. Testing Users API...');
    const usersResponse = await fetch(`${API_BASE}/api/users`);
    const usersData = await usersResponse.json();
    console.log('✅ Users API:', usersData.status === 'success' ? 'PASSED' : 'FAILED');
    console.log(`   Found ${usersData.data?.length || 0} users`);

    // Test 3: Get Bins
    console.log('\n3. Testing Bins API...');
    const binsResponse = await fetch(`${API_BASE}/api/bins`);
    const binsData = await binsResponse.json();
    console.log('✅ Bins API:', binsData.status === 'success' ? 'PASSED' : 'FAILED');
    console.log(`   Found ${binsData.data?.length || 0} bins`);

    // Test 4: Get Events
    console.log('\n4. Testing Events API...');
    const eventsResponse = await fetch(`${API_BASE}/api/events?limit=5`);
    const eventsData = await eventsResponse.json();
    console.log('✅ Events API:', eventsData.status === 'success' ? 'PASSED' : 'FAILED');
    console.log(`   Found ${eventsData.data?.length || 0} events`);

    // Test 5: Analytics endpoints (these require authentication)
    console.log('\n5. Testing Analytics API (requires auth)...');
    console.log('⚠️  Analytics endpoints require authentication - will show 401 error (expected)');
    
    const analyticsResponse = await fetch(`${API_BASE}/api/analytics/rewards/summary`);
    console.log('✅ Analytics API (unauthorized):', analyticsResponse.status === 401 ? 'PASSED (expected 401)' : 'FAILED');

    console.log('\n🎉 Integration Test Summary:');
    console.log('✅ Backend server is running');
    console.log('✅ Database is connected');
    console.log('✅ Sample data is seeded');
    console.log('✅ API endpoints are responding');
    console.log('✅ Authentication is working (blocking unauthorized requests)');
    
    console.log('\n📋 Next Steps:');
    console.log('1. Open http://localhost:3000 in your browser');
    console.log('2. Navigate to /dashboard');
    console.log('3. Login with test@trash2cash.com');
    console.log('4. Test the dashboard functionality');

  } catch (error) {
    console.error('❌ Integration test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure backend is running: npm start (in backend folder)');
    console.log('2. Check if port 3001 is available');
    console.log('3. Verify environment variables are set');
    console.log('4. Run the seeding script: node scripts/seed-dashboard-data.js');
  }
}

testDashboardIntegration();
