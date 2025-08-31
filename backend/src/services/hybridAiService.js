const ollamaService = require('./ollamaService');

class OllamaAiService {
  constructor() {
    this.serviceStatus = {
      ollama: false
    };
    this.checkServices();
  }

  async checkServices() {
    // Check Ollama availability
    try {
      await ollamaService.checkAvailability();
      this.serviceStatus.ollama = ollamaService.isAvailable;
    } catch (error) {
      this.serviceStatus.ollama = false;
    }

    console.log('🔍 AI Services Status:');
    console.log(`  Ollama: ${this.serviceStatus.ollama ? '✅ Available' : '❌ Not Available'}`);
  }

  async getAvailableServices() {
    await this.checkServices();
    return {
      ollama: this.serviceStatus.ollama,
      preferred: 'ollama'
    };
  }

  async analyzeEvents(events) {
    try {
      // Use Ollama for event analysis
      if (this.serviceStatus.ollama) {
        console.log('🦙 Using Ollama for event analysis...');
        return await ollamaService.analyzeEvents(events);
      }
      
      // If Ollama is not available, use mock fallback
      console.log('⚠️  Ollama not available, using mock analysis...');
      return await this.mockAnalysis(events);
      
    } catch (error) {
      console.error('Ollama service failed:', error.message);
      console.log('⚠️  Using mock analysis as fallback...');
      return await this.mockAnalysis(events);
    }
  }

  async analyzeSingleEvent(event) {
    try {
      if (this.serviceStatus.ollama) {
        console.log('🦙 Using Ollama for single event analysis...');
        return await ollamaService.analyzeSingleEvent(event);
      }
      
      return await this.mockSingleEventAnalysis(event);
      
    } catch (error) {
      console.error('Ollama service failed:', error.message);
      return await this.mockSingleEventAnalysis(event);
    }
  }

  async getPredictiveAnalytics(binId, historicalData) {
    try {
      if (this.serviceStatus.ollama) {
        console.log('🦙 Using Ollama for predictive analytics...');
        return await ollamaService.getPredictiveAnalytics(binId, historicalData);
      }
      
      return await this.mockPredictiveAnalytics(binId, historicalData);
      
    } catch (error) {
      console.error('Ollama service failed:', error.message);
      return await this.mockPredictiveAnalytics(binId, historicalData);
    }
  }

  async chat(message, context = '') {
    try {
      if (this.serviceStatus.ollama) {
        console.log('🦙 Using Ollama for chat...');
        return await ollamaService.chat(message, context);
      }
      
      return await this.mockChat(message, context);
      
    } catch (error) {
      console.error('Chat service failed:', error.message);
      return await this.mockChat(message, context);
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

  // Mock fallback methods
  async mockAnalysis(events) {
    console.log('🎭 Using mock AI analysis...');
    return {
      insights: [
        {
          type: 'capacity_optimization',
          description: 'Mock analysis: Consider optimizing bin placement based on usage patterns',
          severity: 'medium',
          recommendation: 'Review bin distribution and collection schedules'
        }
      ],
      summary: 'Mock AI analysis completed for event batch',
      trends: {
        fill_level_trend: 'stable',
        weight_trend: 'stable',
        usage_frequency: 'medium'
      }
    };
  }

  async mockSingleEventAnalysis(event) {
    return {
      anomaly_score: 0.3,
      is_anomaly: false,
      anomaly_type: 'none',
      description: 'Mock analysis: Event appears normal',
      recommendation: 'Continue monitoring'
    };
  }

  async mockPredictiveAnalytics(binId, historicalData) {
    return {
      capacity_forecast: {
        next_24h: "70%",
        next_week: "80%",
        next_month: "85%"
      },
      collection_optimization: {
        optimal_frequency: "daily",
        next_collection: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        efficiency_score: 0.75
      },
      usage_patterns: {
        peak_hours: ["8:00", "18:00"],
        peak_days: ["Monday", "Wednesday", "Friday"],
        seasonal_trends: "Mock prediction based on historical patterns"
      },
      revenue_forecast: {
        daily_average: "$120",
        weekly_projection: "$840",
        monthly_projection: "$3600"
      }
    };
  }

  async mockChat(message, context = '') {
    return `Mock AI Response: I understand you're asking about "${message}". This is a fallback response when Ollama is unavailable. Please check your Ollama configuration.`;
  }
}

module.exports = new OllamaAiService();
