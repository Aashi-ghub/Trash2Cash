const ollamaService = require('./ollamaService');

class OllamaAiService {
  constructor() {
    this.serviceStatus = {
      ollama: false
    };
    this.checkServices();
  }

  async checkServices() {
    // Skip Ollama check in production or when OLLAMA_DISABLED is set
    if (process.env.NODE_ENV === 'production' || process.env.OLLAMA_DISABLED === 'true') {
      this.serviceStatus.ollama = false;
      console.log('🔍 AI Services Status (Production):');
      console.log('  Ollama: ❌ Disabled (Production mode)');
      console.log('  Using: ✅ AI Fallback Service');
    } else {
      // Check Ollama availability for development
      try {
        await ollamaService.checkAvailability();
        this.serviceStatus.ollama = ollamaService.isAvailable;
      } catch (error) {
        this.serviceStatus.ollama = false;
      }

      console.log('🔍 AI Services Status:');
      console.log(`  Ollama: ${this.serviceStatus.ollama ? '✅ Available' : '❌ Not Available'}`);
    }
  }

  async getAvailableServices() {
    await this.checkServices();
    return {
      ollama: this.serviceStatus.ollama,
      preferred: 'ollama'
    };
  }

  async analyzeEvents(events) {
    if (!this.serviceStatus.ollama) {
      throw new Error('Ollama service not available. Please start Ollama with: ollama run llama3');
    }

    try {
      console.log('🦙 Using Ollama for event analysis...');
      return await ollamaService.analyzeEvents(events);
    } catch (error) {
      console.error('❌ Ollama event analysis failed:', error.message);
      throw new Error(`AI analysis failed: ${error.message}`);
    }
  }

  async analyzeSingleEvent(event) {
    if (!this.serviceStatus.ollama) {
      throw new Error('Ollama service not available. Please start Ollama with: ollama run llama3');
    }

    try {
      console.log('🦙 Using Ollama for single event analysis...');
      return await ollamaService.analyzeSingleEvent(event);
    } catch (error) {
      console.error('❌ Ollama single event analysis failed:', error.message);
      throw new Error(`AI analysis failed: ${error.message}`);
    }
  }

  async getPredictiveAnalytics(binId, historicalData) {
    if (!this.serviceStatus.ollama) {
      throw new Error('Ollama service not available. Please start Ollama with: ollama run llama3');
    }

    try {
      console.log('🦙 Using Ollama for predictive analytics...');
      return await ollamaService.getPredictiveAnalytics(binId, historicalData);
    } catch (error) {
      console.error('❌ Ollama predictive analytics failed:', error.message);
      throw new Error(`AI prediction failed: ${error.message}`);
    }
  }

  async chat(message, context = '') {
    if (!this.serviceStatus.ollama) {
      throw new Error('Ollama service not available. Please start Ollama with: ollama run llama3');
    }

    try {
      console.log('🦙 Using Ollama for chat...');
      return await ollamaService.chat(message, context);
    } catch (error) {
      console.error('❌ Ollama chat failed:', error.message);
      throw new Error(`AI chat failed: ${error.message}`);
    }
  }

  async getServiceStatus() {
    await this.checkServices();
    return {
      services: this.serviceStatus,
      preferred: 'ollama',
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = new OllamaAiService();
