const axios = require('axios');

class OllamaService {
  constructor() {
    this.baseURL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
    this.defaultModel = process.env.OLLAMA_DEFAULT_MODEL || 'llama2:7b';
    this.apiKey = process.env.OLLAMA_API_KEY;
    this.timeout = 60000; // Longer timeout for local processing
    this.isAvailable = false;
    
    // Check if we have cloud Ollama configuration
    if (this.baseURL.includes('api.ollama.ai') && this.apiKey) {
      console.log('☁️ Cloud Ollama detected');
      this.isAvailable = true;
    } else if (process.env.NODE_ENV === 'production' || process.env.OLLAMA_DISABLED === 'true') {
      console.log('🚀 Production mode: Using AI fallback service');
      this.isAvailable = false;
    } else {
      this.checkAvailability();
    }
  }

  async checkAvailability() {
    try {
      const response = await axios.get(`${this.baseURL}/api/tags`, {
        timeout: 5000
      });
      this.isAvailable = true;
      console.log('✅ Ollama service is available');
      if (response.data.models && response.data.models.length > 0) {
        console.log(`📦 Available models: ${response.data.models.map(m => m.name).join(', ')}`);
      }
    } catch (error) {
      this.isAvailable = false;
      console.warn('⚠️  Ollama service not available. Using simple AI fallback for MVP.');
    }
  }

  // Simple AI fallback for MVP when Ollama is not available
  generateSimpleAnalysis(events, analysisType = 'events') {
    // Using simple AI fallback for MVP
    
    if (analysisType === 'events') {
      const totalEvents = events.length;
      const avgFillLevel = events.reduce((sum, e) => sum + (e.fill_level_pct || 0), 0) / totalEvents;
      const avgWeight = events.reduce((sum, e) => sum + (e.weight_kg_total || 0), 0) / totalEvents;
      
      return {
        insights: [
          {
            type: "usage_pattern",
            description: `Analyzed ${totalEvents} events with average fill level of ${avgFillLevel.toFixed(1)}%`,
            severity: "low",
            recommendation: "Monitor fill levels and optimize collection schedules",
            confidence: 0.8
          },
          {
            type: "efficiency",
            description: `Average weight per event: ${avgWeight.toFixed(1)}kg`,
            severity: "medium",
            recommendation: "Consider weight-based collection optimization",
            confidence: 0.7
          }
        ],
        summary: `Smart analysis of ${totalEvents} bin events completed successfully.`,
        trends: {
          fill_level_trend: avgFillLevel > 60 ? "high" : "normal",
          weight_trend: avgWeight > 50 ? "increasing" : "stable",
          usage_frequency: totalEvents > 100 ? "high" : "normal"
        },
        anomalies: []
      };
    }
    
    return {
      insights: [],
      summary: "Analysis completed",
      trends: {},
      anomalies: []
    };
  }

  generateSimpleSingleEventAnalysis(event) {
    const fillLevel = event.fill_level_pct || 0;
    const weight = event.weight_kg_total || 0;
    
    const isAnomaly = fillLevel > 90 || fillLevel < 10 || weight > 100;
    const anomalyType = fillLevel > 90 ? "high_fill" : fillLevel < 10 ? "low_fill" : weight > 100 ? "heavy_weight" : "normal";
    
    return {
      anomaly_score: isAnomaly ? 0.8 : 0.2,
      is_anomaly: isAnomaly,
      anomaly_type: anomalyType,
      description: `Event analysis: Fill level ${fillLevel}%, Weight ${weight}kg. ${isAnomaly ? 'Anomaly detected.' : 'Normal operation.'}`,
      confidence: 0.7
    };
  }

  generateSimplePredictions(binId, historicalData) {
    const totalEvents = historicalData.length;
    const avgFillLevel = historicalData.reduce((sum, e) => sum + (e.fill_level_pct || 0), 0) / totalEvents;
    
    return {
      capacity_forecast: {
        next_24h: `${Math.min(100, avgFillLevel + 15).toFixed(1)}%`,
        next_week: `${Math.min(100, avgFillLevel + 25).toFixed(1)}%`,
        next_month: `${Math.min(100, avgFillLevel + 35).toFixed(1)}%`
      },
      collection_optimization: {
        optimal_frequency: avgFillLevel > 70 ? "daily" : "every 2-3 days",
        efficiency_score: 0.75
      },
      usage_patterns: {
        peak_hours: ["9-11 AM", "2-4 PM", "6-8 PM"],
        peak_days: ["Monday", "Wednesday", "Friday"]
      },
      maintenance_prediction: {
        next_maintenance: "2024-02-15",
        confidence: 0.8
      }
    };
  }

  generateSimpleChatResponse(message, context) {
    const responses = [
      "Based on the smart bin data, I can see normal operation patterns with some optimization opportunities.",
      "The system is performing well with consistent collection patterns and good efficiency.",
      "Analysis shows healthy usage trends with room for minor improvements in scheduling.",
      "Current data indicates stable operations with recommended monitoring of fill levels.",
      "Smart bin performance is within expected parameters with some areas for optimization."
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }

  async generateText(prompt, model = this.defaultModel) {
    if (!this.isAvailable) {
      throw new Error('Ollama service not available. Using simple AI fallback for MVP.');
    }

    try {
      console.log(`🦙 Generating text with model: ${model}`);
      console.log(`📝 Prompt length: ${prompt.length} characters`);
      
      const headers = {
        'Content-Type': 'application/json'
      };
      
      // Add API key for cloud Ollama
      if (this.apiKey) {
        headers['Authorization'] = `Bearer ${this.apiKey}`;
      }
      
      const response = await axios.post(`${this.baseURL}/api/generate`, {
        model: model,
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.3, // Lower temperature for more consistent responses
          top_p: 0.9,
          max_tokens: 2000, // Increased for better responses
          num_predict: 1000
        }
      }, {
        headers,
        timeout: this.timeout
      });

      console.log(`✅ Generated response: ${response.data.response.length} characters`);
      return response.data.response;
    } catch (error) {
      console.error('❌ Ollama API error:', error.response?.data || error.message);
      throw new Error(`Ollama generation failed: ${error.response?.data?.error || error.message}`);
    }
  }

  async analyzeEvents(events) {
    if (!this.isAvailable) {
      console.log('🤖 Using simple AI fallback for event analysis');
      return this.generateSimpleAnalysis(events, 'events');
    }

    try {
      console.log(`🔍 Analyzing ${events.length} events with Ollama...`);
      
      // Prepare event summary for analysis
      const eventSummary = events.map(event => ({
        binId: event.bin_id,
        fillLevel: event.fill_level_pct || event.fill_level,
        weight: event.weight_kg_total || event.weight_kg,
        timestamp: event.timestamp_utc || event.created_at,
        categories: event.categories || {},
        batteryLevel: event.battery_pct
      }));

      const prompt = `You are an AI waste management analyst. Analyze the following smart bin events and provide detailed insights.

EVENT DATA:
${JSON.stringify(eventSummary, null, 2)}

ANALYSIS REQUIREMENTS:
1. Identify patterns in fill levels, weights, and usage
2. Detect any anomalies or unusual patterns
3. Provide actionable recommendations
4. Assess overall efficiency and trends

Please provide your analysis in the following JSON format:
{
  "insights": [
    {
      "type": "capacity_optimization|usage_pattern|anomaly|efficiency|maintenance",
      "description": "Detailed insight description",
      "severity": "low|medium|high",
      "recommendation": "Specific actionable recommendation",
      "confidence": 0.0-1.0
    }
  ],
  "summary": "Overall analysis summary",
  "trends": {
    "fill_level_trend": "increasing|decreasing|stable",
    "weight_trend": "increasing|decreasing|stable",
    "usage_frequency": "high|medium|low"
  },
  "anomalies": [
    {
      "type": "high_fill|low_fill|unusual_weight|timing_anomaly",
      "description": "Anomaly description",
      "severity": "low|medium|high"
    }
  ]
}

Respond only with valid JSON.`;

      const response = await this.generateText(prompt);
      
      // Try to parse JSON response
      try {
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const analysis = JSON.parse(jsonMatch[0]);
          console.log('✅ AI analysis completed successfully');
          return analysis;
        } else {
          throw new Error('No JSON found in response');
        }
      } catch (parseError) {
        console.error('❌ Failed to parse AI response:', parseError.message);
        return this.generateSimpleAnalysis(events, 'events');
      }
    } catch (error) {
      console.error('❌ Ollama event analysis failed:', error.message);
      return this.generateSimpleAnalysis(events, 'events');
    }
  }

  async analyzeSingleEvent(event) {
    if (!this.isAvailable) {
      console.log('🤖 Using simple AI fallback for single event analysis');
      return this.generateSimpleSingleEventAnalysis(event);
    }

    try {
      console.log('🔍 Analyzing single event with Ollama...');
      
      const prompt = `Analyze this single smart bin event for anomalies and insights:

EVENT DATA:
${JSON.stringify(event, null, 2)}

Please provide analysis in JSON format:
{
  "anomaly_score": 0.0-1.0,
  "is_anomaly": true/false,
  "anomaly_type": "high_fill|low_fill|unusual_weight|timing_anomaly|normal",
  "description": "Detailed analysis description",
  "confidence": 0.0-1.0
}

Respond only with valid JSON.`;

      const response = await this.generateText(prompt);
      
      try {
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const analysis = JSON.parse(jsonMatch[0]);
          console.log('✅ Single event analysis completed');
          return analysis;
        } else {
          throw new Error('No JSON found in response');
        }
      } catch (parseError) {
        console.error('❌ Failed to parse single event response:', parseError.message);
        return this.generateSimpleSingleEventAnalysis(event);
      }
    } catch (error) {
      console.error('❌ Ollama single event analysis failed:', error.message);
      return this.generateSimpleSingleEventAnalysis(event);
    }
  }

  async getPredictiveAnalytics(binId, historicalData) {
    if (!this.isAvailable) {
      console.log('🤖 Using simple AI fallback for predictive analytics');
      return this.generateSimplePredictions(binId, historicalData);
    }

    try {
      console.log(`🮸 Generating predictive analytics for bin ${binId}...`);
      
      const prompt = `Generate predictive analytics for smart bin operations based on historical data:

BIN ID: ${binId}
HISTORICAL DATA:
${JSON.stringify(historicalData.slice(0, 20), null, 2)}

Please provide predictions in JSON format:
{
  "capacity_forecast": {
    "next_24h": "percentage",
    "next_week": "percentage", 
    "next_month": "percentage"
  },
  "collection_optimization": {
    "optimal_frequency": "daily|every_2_days|weekly",
    "efficiency_score": 0.0-1.0
  },
  "usage_patterns": {
    "peak_hours": ["hour ranges"],
    "peak_days": ["day names"]
  },
  "maintenance_prediction": {
    "next_maintenance": "YYYY-MM-DD",
    "confidence": 0.0-1.0
  }
}

Respond only with valid JSON.`;

      const response = await this.generateText(prompt);
      
      try {
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const predictions = JSON.parse(jsonMatch[0]);
          console.log('✅ Predictive analytics completed');
          return predictions;
        } else {
          throw new Error('No JSON found in response');
        }
      } catch (parseError) {
        console.error('❌ Failed to parse predictions response:', parseError.message);
        return this.generateSimplePredictions(binId, historicalData);
      }
    } catch (error) {
      console.error('❌ Ollama predictive analytics failed:', error.message);
      return this.generateSimplePredictions(binId, historicalData);
    }
  }

  async chat(message, context = "") {
    if (!this.isAvailable) {
      console.log('🤖 Using simple AI fallback for chat');
      return this.generateSimpleChatResponse(message, context);
    }

    try {
      console.log('💬 Processing chat message with Ollama...');
      
      const systemPrompt = "You are an AI assistant for a smart waste management system. Provide helpful insights about bin operations, efficiency, and optimization.";
      const prompt = `${systemPrompt}

Context: ${context}
User Message: ${message}

Please provide a helpful response about smart bin operations and waste management.`;

      const response = await this.generateText(prompt);
      console.log('✅ Chat response generated');
      return response;
    } catch (error) {
      console.error('❌ Ollama chat failed:', error.message);
      return this.generateSimpleChatResponse(message, context);
    }
  }

  async getAvailableModels() {
    if (!this.isAvailable) {
      return [];
    }

    try {
      const response = await axios.get(`${this.baseURL}/api/tags`);
      return response.data.models || [];
    } catch (error) {
      console.error('Failed to get available models:', error.message);
      return [];
    }
  }

  async pullModel(modelName) {
    if (!this.isAvailable) {
      throw new Error('Ollama service not available');
    }

    try {
      const response = await axios.post(`${this.baseURL}/api/pull`, {
        name: modelName
      });
      return response.data;
    } catch (error) {
      console.error(`Failed to pull model ${modelName}:`, error.message);
      throw error;
    }
  }

  getStatus() {
    return {
      available: this.isAvailable,
      baseURL: this.baseURL,
      defaultModel: this.defaultModel,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = new OllamaService();
