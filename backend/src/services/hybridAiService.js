const openXaiService = require('./openXaiService');
const ollamaService = require('./ollamaService');

class HybridAiService {
  constructor() {
    this.preferredService = 'openxai'; // Default preference
    this.fallbackService = 'ollama';
    this.serviceStatus = {
      openxai: false,
      ollama: false
    };
    this.checkServices();
  }

  async checkServices() {
    // Check OpenXAI availability
    this.serviceStatus.openxai = !!process.env.OPENXAI_API_KEY;
    
    // Check Ollama availability
    try {
      await ollamaService.checkAvailability();
      this.serviceStatus.ollama = ollamaService.isAvailable;
    } catch (error) {
      this.serviceStatus.ollama = false;
    }

    console.log('🔍 AI Services Status:');
    console.log(`  OpenXAI: ${this.serviceStatus.openxai ? '✅ Available' : '❌ Not Available'}`);
    console.log(`  Ollama: ${this.serviceStatus.ollama ? '✅ Available' : '❌ Not Available'}`);
  }

  async getAvailableServices() {
    await this.checkServices();
    return {
      openxai: this.serviceStatus.openxai,
      ollama: this.serviceStatus.ollama,
      preferred: this.preferredService,
      fallback: this.fallbackService
    };
  }

  async analyzeEvents(events) {
    try {
      // Try preferred service first (OpenXAI)
      if (this.serviceStatus.openxai) {
        console.log('🤖 Using OpenXAI for event analysis...');
        return await openXaiService.analyzeEvents(events);
      }
      
      // Fallback to Ollama
      if (this.serviceStatus.ollama) {
        console.log('🦙 Using Ollama for event analysis...');
        return await ollamaService.analyzeEvents(events);
      }
      
      // If neither is available, use mock fallback
      console.log('⚠️  No AI services available, using mock analysis...');
      return await this.mockAnalysis(events);
      
    } catch (error) {
      console.error('Primary AI service failed, trying fallback...');
      
      // Try fallback service
      if (this.preferredService === 'openxai' && this.serviceStatus.ollama) {
        try {
          console.log('🦙 Falling back to Ollama...');
          return await ollamaService.analyzeEvents(events);
        } catch (fallbackError) {
          console.error('Fallback service also failed:', fallbackError.message);
        }
      } else if (this.preferredService === 'ollama' && this.serviceStatus.openxai) {
        try {
          console.log('🤖 Falling back to OpenXAI...');
          return await openXaiService.analyzeEvents(events);
        } catch (fallbackError) {
          console.error('Fallback service also failed:', fallbackError.message);
        }
      }
      
      // Final fallback to mock
      console.log('⚠️  All AI services failed, using mock analysis...');
      return await this.mockAnalysis(events);
    }
  }

  async analyzeSingleEvent(event) {
    try {
      if (this.serviceStatus.openxai) {
        console.log('🤖 Using OpenXAI for single event analysis...');
        return await openXaiService.analyzeSingleEvent(event);
      }
      
      if (this.serviceStatus.ollama) {
        console.log('🦙 Using Ollama for single event analysis...');
        return await ollamaService.analyzeSingleEvent(event);
      }
      
      return await this.mockSingleEventAnalysis(event);
      
    } catch (error) {
      console.error('Primary AI service failed, trying fallback...');
      
      if (this.preferredService === 'openxai' && this.serviceStatus.ollama) {
        try {
          return await ollamaService.analyzeSingleEvent(event);
        } catch (fallbackError) {
          console.error('Fallback service also failed:', fallbackError.message);
        }
      } else if (this.preferredService === 'ollama' && this.serviceStatus.openxai) {
        try {
          return await openXaiService.analyzeSingleEvent(event);
        } catch (fallbackError) {
          console.error('Fallback service also failed:', fallbackError.message);
        }
      }
      
      return await this.mockSingleEventAnalysis(event);
    }
  }

  async getPredictiveAnalytics(binId, historicalData) {
    try {
      if (this.serviceStatus.openxai) {
        console.log('🤖 Using OpenXAI for predictive analytics...');
        return await openXaiService.getPredictiveAnalytics(binId, historicalData);
      }
      
      if (this.serviceStatus.ollama) {
        console.log('🦙 Using Ollama for predictive analytics...');
        return await ollamaService.getPredictiveAnalytics(binId, historicalData);
      }
      
      return await this.mockPredictiveAnalytics(binId, historicalData);
      
    } catch (error) {
      console.error('Primary AI service failed, trying fallback...');
      
      if (this.preferredService === 'openxai' && this.serviceStatus.ollama) {
        try {
          return await ollamaService.getPredictiveAnalytics(binId, historicalData);
        } catch (fallbackError) {
          console.error('Fallback service also failed:', fallbackError.message);
        }
      } else if (this.preferredService === 'ollama' && this.serviceStatus.openxai) {
        try {
          return await openXaiService.getPredictiveAnalytics(binId, historicalData);
        } catch (fallbackError) {
          console.error('Fallback service also failed:', fallbackError.message);
        }
      }
      
      return await this.mockPredictiveAnalytics(binId, historicalData);
    }
  }

  async chat(message, context = '') {
    try {
      if (this.serviceStatus.ollama) {
        console.log('🦙 Using Ollama for chat...');
        return await ollamaService.chat(message, context);
      }
      
      if (this.serviceStatus.openxai) {
        console.log('🤖 Using OpenXAI for chat...');
        // Note: OpenXAI might not have a direct chat method, so we'll use Ollama or mock
        return await ollamaService.chat(message, context);
      }
      
      return await this.mockChat(message, context);
      
    } catch (error) {
      console.error('Chat service failed:', error.message);
      return await this.mockChat(message, context);
    }
  }

  async setPreferredService(service) {
    if (['openxai', 'ollama'].includes(service)) {
      this.preferredService = service;
      this.fallbackService = service === 'openxai' ? 'ollama' : 'openxai';
      console.log(`🔄 Preferred AI service set to: ${service}`);
      return { success: true, preferred: service, fallback: this.fallbackService };
    }
    throw new Error('Invalid service. Must be "openxai" or "ollama"');
  }

  async getServiceStatus() {
    await this.checkServices();
    return {
      services: this.serviceStatus,
      preferred: this.preferredService,
      fallback: this.fallbackService,
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
    return `Mock AI Response: I understand you're asking about "${message}". This is a fallback response when AI services are unavailable. Please check your AI service configuration.`;
  }
}

module.exports = new HybridAiService();
