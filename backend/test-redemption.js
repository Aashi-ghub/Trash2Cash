const axios = require('axios');

async function testRedemption() {
  console.log('🧪 Testing reward redemption...\n');
  
  try {
    // First, login to get a token
    console.log('1. Logging in...');
    const loginResponse = await axios.post('http://localhost:5000/api/users/login', {
      email: 'test@gmail.com',
      password: 'password123'
    });
    
    if (loginResponse.data.status !== 'success') {
      console.error('❌ Login failed:', loginResponse.data);
      return;
    }
    
    const token = loginResponse.data.data.token;
    console.log('   ✅ Login successful');
    
    // Check current points before redemption
    console.log('\n2. Checking current points...');
    const pointsResponse = await axios.get('http://localhost:5000/api/analytics/rewards/summary', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (pointsResponse.data.total_points !== undefined) {
      console.log(`   📊 Current points: ${pointsResponse.data.total_points}`);
    } else {
      console.log('   ❌ Could not get current points');
      return;
    }
    
    // Test redemption
    console.log('\n3. Testing redemption...');
    const redemptionResponse = await axios.post('http://localhost:5000/api/analytics/rewards/redeem', {
      reward_name: 'Test Starbucks Gift Card',
      points_cost: 100
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('   📡 Redemption response:', redemptionResponse.data);
    
    if (redemptionResponse.data.status === 'success') {
      console.log('   ✅ Redemption successful!');
      
      // Check points after redemption
      console.log('\n4. Checking points after redemption...');
      const newPointsResponse = await axios.get('http://localhost:5000/api/analytics/rewards/summary', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (newPointsResponse.data.total_points !== undefined) {
        console.log(`   📊 New points: ${newPointsResponse.data.total_points}`);
        const pointsDiff = pointsResponse.data.total_points - newPointsResponse.data.total_points;
        console.log(`   💰 Points deducted: ${pointsDiff}`);
      }
    } else {
      console.log('   ❌ Redemption failed:', redemptionResponse.data);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run the test
if (require.main === module) {
  testRedemption()
    .then(() => {
      console.log('\n✅ Redemption test completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Redemption test failed:', error);
      process.exit(1);
    });
}

module.exports = { testRedemption };
