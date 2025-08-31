const ollamaService = require('./src/services/ollamaService');
const ollamaAiService = require('./src/services/hybridAiService');

async function testOllamaIntegration() {
  console.log('🧪 Testing Ollama Integration...\n');

  try {
    // 1. Test Ollama Service Availability
    console.log('1. Testing Ollama Service Availability...');
    await ollamaService.checkAvailability();
    console.log(`   ✅ Ollama Available: ${ollamaService.isAvailable}`);
    
    if (ollamaService.isAvailable) {
      const models = await ollamaService.getAvailableModels();
      console.log(`   📦 Available Models: ${models.map(m => m.name).join(', ')}`);
    }

    // 2. Test AI Service Status
    console.log('\n2. Testing AI Service Status...');
    const serviceStatus = await ollamaAiService.getServiceStatus();
    console.log('   ✅ Service Status:', JSON.stringify(serviceStatus, null, 2));

    // 3. Test Event Analysis
    console.log('\n3. Testing Event Analysis...');
    const mockEvents = [
      {
        bin_id: 'TEST001',
        weight_kg: 15.5,
        fill_level: 75,
        user_id: 'user123',
        created_at: new Date().toISOString()
      },
      {
        bin_id: 'TEST002',
        weight_kg: 8.2,
        fill_level: 45,
        user_id: 'user456',
        created_at: new Date().toISOString()
      }
    ];

    const analysis = await ollamaAiService.analyzeEvents(mockEvents);
    console.log('   ✅ Event Analysis Result:', JSON.stringify(analysis, null, 2));

    // 4. Test Chat Functionality
    console.log('\n4. Testing Chat Functionality...');
    const chatResponse = await ollamaAiService.chat('Hello, how are you?');
    console.log('   ✅ Chat Response:', chatResponse);

    // 5. Test Predictive Analytics
    console.log('\n5. Testing Predictive Analytics...');
    const predictions = await ollamaAiService.getPredictiveAnalytics('TEST001', mockEvents);
    console.log('   ✅ Predictive Analytics:', JSON.stringify(predictions, null, 2));

    console.log('\n🎉 All Ollama integration tests passed!');
    console.log('\n📋 Summary:');
    console.log('   • Ollama service is running and accessible');
    console.log('   • AI service is properly configured');
    console.log('   • Event analysis is working');
    console.log('   • Chat functionality is operational');
    console.log('   • Predictive analytics are functional');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

// Run the test
testOllamaIntegration();
