const axios = require('axios');

// Test configuration
const BASE_URL = 'http://localhost:3000';
const TEST_TOKEN = 'test-token'; // Replace with actual token for testing

async function testOllamaIntegration() {
  console.log('🧪 Testing Ollama Integration...\n');

  const headers = {
    'Authorization': `Bearer ${TEST_TOKEN}`,
    'Content-Type': 'application/json'
  };

  try {
    // Test 1: Check Ollama Status
    console.log('1. Testing Ollama Status...');
    const statusResponse = await axios.get(`${BASE_URL}/api/ai-analytics/ollama/status`, { headers });
    console.log('✅ Status Response:', statusResponse.data);
    console.log('');

    // Test 2: Test Chat Functionality
    console.log('2. Testing Chat Functionality...');
    const chatResponse = await axios.post(`${BASE_URL}/api/ai-analytics/ollama/chat`, {
      message: 'Hello! Can you help me with waste management analysis?',
      context: 'This is a test for the Trash2Cash system'
    }, { headers });
    console.log('✅ Chat Response:', chatResponse.data);
    console.log('');

    // Test 3: Test AI Services Status
    console.log('3. Testing AI Services Status...');
    const aiServicesResponse = await axios.get(`${BASE_URL}/api/ai-analytics/ai-services/status`, { headers });
    console.log('✅ AI Services Status:', aiServicesResponse.data);
    console.log('');

    // Test 4: Test Event Analysis (should use hybrid service)
    console.log('4. Testing Event Analysis...');
    const testEvents = [
      {
        bin_id: 'TEST001',
        fill_level: 75.5,
        weight_kg: 25.3,
        timestamp: new Date().toISOString(),
        location: 'Test Location'
      }
    ];
    
    const analysisResponse = await axios.post(`${BASE_URL}/api/ai-analytics/analyze-events`, {
      events: testEvents
    }, { headers });
    console.log('✅ Event Analysis Response:', analysisResponse.data);
    console.log('');

    console.log('🎉 All tests completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      console.log('💡 Tip: Make sure to use a valid authentication token');
    }
    
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Tip: Make sure the backend server is running on port 3000');
    }
  }
}

// Test Ollama service directly
async function testOllamaService() {
  console.log('🦙 Testing Ollama Service Directly...\n');

  try {
    const ollamaService = require('./src/services/ollamaService');
    
    // Check status
    const status = ollamaService.getStatus();
    console.log('✅ Ollama Service Status:', status);
    
    // Test text generation
    if (status.available) {
      console.log('Testing text generation...');
      const response = await ollamaService.generateText('Hello, this is a test message.');
      console.log('✅ Text Generation Response:', response);
    } else {
      console.log('⚠️  Ollama service not available. Make sure Ollama is running.');
    }
    
  } catch (error) {
    console.error('❌ Ollama service test failed:', error.message);
  }
}

// Test hybrid AI service
async function testHybridService() {
  console.log('🤖 Testing Hybrid AI Service...\n');

  try {
    const hybridService = require('./src/services/hybridAiService');
    
    // Get service status
    const status = await hybridService.getServiceStatus();
    console.log('✅ Hybrid Service Status:', status);
    
    // Test event analysis
    const testEvents = [
      {
        bin_id: 'TEST001',
        fill_level: 75.5,
        weight_kg: 25.3,
        timestamp: new Date().toISOString(),
        location: 'Test Location'
      }
    ];
    
    const analysis = await hybridService.analyzeEvents(testEvents);
    console.log('✅ Hybrid Event Analysis:', analysis);
    
  } catch (error) {
    console.error('❌ Hybrid service test failed:', error.message);
  }
}

// Run tests
async function runAllTests() {
  console.log('🚀 Starting Ollama Integration Tests\n');
  console.log('=====================================\n');
  
  await testOllamaService();
  console.log('\n-------------------------------------\n');
  
  await testHybridService();
  console.log('\n-------------------------------------\n');
  
  await testOllamaIntegration();
  console.log('\n=====================================');
  console.log('🏁 All tests completed!');
}

// Run if this file is executed directly
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = {
  testOllamaIntegration,
  testOllamaService,
  testHybridService,
  runAllTests
};
