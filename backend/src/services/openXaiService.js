const axios = require('axios');

/**
 * Real OpenXAI Xnode integration service for AI analysis of bin events
 */
class OpenXaiService {
  constructor() {
    this.baseURL = process.env.OPENXAI_BASE_URL || 'https://api.openxai.com';
    this.apiKey = process.env.OPENXAI_API_KEY;
    this.timeout = 30000; // 30 seconds timeout
    
    if (!this.apiKey) {
      console.warn('⚠️  OPENXAI_API_KEY not found. Using fallback mock service.');
    }
  }

  /**
   * Analyze bin events with real AI processing
   * @param {Array} events - Array of bin events to analyze
   * @returns {Promise<Object>} AI analysis results
   */
  async analyzeEvents(events) {
    if (!this.apiKey) {
      return this.fallbackAnalysis(events);
    }

    try {
      console.log(`[OpenXAI] Analyzing ${events.length} events with real AI...`);
      
      const analysisPromises = events.map(event => this.analyzeSingleEvent(event));
      const results = await Promise.allSettled(analysisPromises);
      
      const successfulResults = results
        .filter(result => result.status === 'fulfilled')
        .map(result => result.value);
      
      const failedResults = results
        .filter(result => result.status === 'rejected')
        .map((result, index) => ({
          event_id: events[index]?.id,
          error: result.reason.message,
          fallback: true
        }));

      console.log(`[OpenXAI] Successfully analyzed ${successfulResults.length} events`);
      if (failedResults.length > 0) {
        console.warn(`[OpenXAI] ${failedResults.length} events failed, using fallback`);
        const fallbackResults = await this.fallbackAnalysis(
          events.filter((_, index) => results[index].status === 'rejected')
        );
        successfulResults.push(...fallbackResults);
      }

      return {
        status: 'success',
        data: {
          batch_id: `batch_${Date.now()}`,
          insights: successfulResults,
          metadata: {
            total_events: events.length,
            successful_analysis: successfulResults.length,
            failed_analysis: failedResults.length,
            provider: 'openxai'
          }
        }
      };
    } catch (error) {
      console.error('[OpenXAI] Service error, falling back to mock:', error.message);
      return this.fallbackAnalysis(events);
    }
  }

  /**
   * Analyze a single bin event with OpenXAI
   * @param {Object} event - Single bin event
   * @returns {Promise<Object>} Analysis result
   */
  async analyzeSingleEvent(event) {
    const payload = this.prepareEventPayload(event);
    
    const response = await axios.post(
      `${this.baseURL}/v1/analysis/waste-classification`,
      payload,
      {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'X-Request-ID': `event_${event.id}`
        },
        timeout: this.timeout
      }
    );

    return this.parseAnalysisResponse(response.data, event);
  }

  /**
   * Prepare event data for OpenXAI analysis
   * @param {Object} event - Bin event data
   * @returns {Object} Formatted payload
   */
  prepareEventPayload(event) {
    return {
      event_id: event.id,
      bin_id: event.bin_id,
      sensor_data: {
        weight_kg: event.weight_kg || 0,
        weight_delta: event.weight_kg_delta || 0,
        fill_level: event.fill_level || 0,
        temperature: event.temperature || 25,
        humidity: event.humidity || 50
      },
      event_data: event.event_data || {},
      timestamp: event.created_at,
      context: {
        bin_location: event.bins?.location || 'Unknown',
        user_id: event.user_id,
        previous_events_count: event.previous_events_count || 0
      }
    };
  }

  /**
   * Parse OpenXAI response into standardized format
   * @param {Object} response - OpenXAI API response
   * @param {Object} event - Original event data
   * @returns {Object} Standardized analysis result
   */
  parseAnalysisResponse(response, event) {
    const analysis = response.analysis || {};
    const predictions = response.predictions || {};
    
    return {
      event_id: event.id,
      bin_id: event.bin_id,
      classification: {
        material: analysis.primary_material || 'unknown',
        confidence: analysis.confidence || 0.85,
        secondary_materials: analysis.secondary_materials || [],
        contamination_level: analysis.contamination_level || 'low'
      },
      purity_score: analysis.purity_score || 0.85,
      anomaly_detected: analysis.anomaly_detected || false,
      anomaly_details: analysis.anomaly_detected ? {
        type: analysis.anomaly_type || 'UnusualPattern',
        message: analysis.anomaly_message || 'Unusual waste pattern detected',
        severity: analysis.anomaly_severity || 'medium',
        confidence: analysis.anomaly_confidence || 0.75
      } : null,
      predictions: {
        next_collection_estimate: predictions.next_collection_estimate,
        capacity_forecast: predictions.capacity_forecast,
        usage_pattern: predictions.usage_pattern
      },
      suggestions: analysis.suggestions || [],
      environmental_impact: {
        co2_saved: analysis.co2_saved || 0,
        energy_equivalent: analysis.energy_equivalent || 0,
        landfill_diverted: analysis.landfill_diverted || 0
      },
      processing_metadata: {
        model_version: response.model_version || 'v1.0',
        processing_time_ms: response.processing_time || 0,
        provider: 'openxai'
      }
    };
  }

  /**
   * Fallback analysis when OpenXAI is unavailable
   * @param {Array} events - Events to analyze
   * @returns {Array} Mock analysis results
   */
  async fallbackAnalysis(events) {
    console.log(`[OpenXAI] Using fallback analysis for ${events.length} events`);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
    
    return events.map(event => {
      const purity_score = parseFloat((Math.random() * 0.3 + 0.7).toFixed(2));
      const is_anomaly = Math.random() < 0.05;
      
      return {
        event_id: event.id,
        bin_id: event.bin_id,
        classification: {
          material: (event.event_data && event.event_data.material) || 'plastic',
          confidence: parseFloat((Math.random() * 0.2 + 0.8).toFixed(2)),
          secondary_materials: [],
          contamination_level: purity_score < 0.8 ? 'medium' : 'low'
        },
        purity_score,
        anomaly_detected: is_anomaly,
        anomaly_details: is_anomaly ? {
          type: 'UnusualWeight',
          message: `Weight ${event.weight_kg || 0}kg is unusual for this bin.`,
          severity: 'medium',
          confidence: 0.75
        } : null,
        predictions: {
          next_collection_estimate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          capacity_forecast: Math.random() * 0.3 + 0.7,
          usage_pattern: 'normal'
        },
        suggestions: purity_score < 0.8 ? ['Consider user education on sorting.'] : [],
        environmental_impact: {
          co2_saved: purity_score * 2.5,
          energy_equivalent: purity_score * 1.8,
          landfill_diverted: purity_score * 3.2
        },
        processing_metadata: {
          model_version: 'fallback-v1.0',
          processing_time_ms: 500,
          provider: 'fallback'
        }
      };
    });
  }

  /**
   * Get real-time predictions for bin optimization
   * @param {string} binId - Bin ID
   * @param {Object} historicalData - Historical bin data
   * @returns {Promise<Object>} Predictive analytics
   */
  async getPredictiveAnalytics(binId, historicalData) {
    if (!this.apiKey) {
      return this.fallbackPredictiveAnalytics(binId, historicalData);
    }

    try {
      const response = await axios.post(
        `${this.baseURL}/v1/predictions/bin-optimization`,
        {
          bin_id: binId,
          historical_data: historicalData,
          prediction_horizon: 7 // 7 days
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: this.timeout
        }
      );

      return {
        status: 'success',
        data: response.data,
        provider: 'openxai'
      };
    } catch (error) {
      console.error('[OpenXAI] Predictive analytics failed:', error.message);
      return this.fallbackPredictiveAnalytics(binId, historicalData);
    }
  }

  /**
   * Fallback predictive analytics
   * @param {string} binId - Bin ID
   * @param {Object} historicalData - Historical data
   * @returns {Object} Mock predictions
   */
  fallbackPredictiveAnalytics(binId, historicalData) {
    return {
      status: 'success',
      data: {
        peak_usage_times: ['14:00-16:00', '18:00-20:00'],
        optimal_collection_schedule: 'daily',
        capacity_forecast: {
          next_24h: 0.75,
          next_7d: 0.85,
          next_30d: 0.92
        },
        optimization_suggestions: [
          'Add token multiplier campaign during peak hours',
          'Consider additional bin placement',
          'Implement user education program'
        ],
        risk_factors: [
          'High contamination rate detected',
          'Irregular usage patterns'
        ]
      },
      provider: 'fallback'
    };
  }
}

module.exports = new OpenXaiService();
