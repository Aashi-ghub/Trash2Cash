const dbConfig = require('../config/database');
const ollamaAiService = require('../services/hybridAiService');

/**
 * Enhanced anomaly detection with advanced algorithms
 */
class EnhancedAnomalyDetection {
  constructor() {
    this.anomalyThresholds = {
      weight: { min: 0.1, max: 50.0, stdDev: 2.0 },
      fillLevel: { min: 0, max: 100, stdDev: 10 },
      purity: { min: 0.3, max: 1.0, stdDev: 0.15 },
      frequency: { minInterval: 300, maxInterval: 86400 } // 5 min to 24 hours
    };
  }

  /**
   * Enhanced anomaly detection with multiple algorithms
   * @param {Array} events - Recent events for analysis
   * @param {Object} binProfile - Historical bin profile
   * @returns {Array} Detected anomalies
   */
  async detectAnomalies(events, binProfile = {}) {
    const anomalies = [];

    // 1. Statistical Anomaly Detection
    const statisticalAnomalies = this.detectStatisticalAnomalies(events, binProfile);
    anomalies.push(...statisticalAnomalies);

    // 2. Pattern-based Anomaly Detection
    const patternAnomalies = this.detectPatternAnomalies(events, binProfile);
    anomalies.push(...patternAnomalies);

    // 3. AI-powered Anomaly Detection
    const aiAnomalies = await this.detectAIAnomalies(events);
    anomalies.push(...aiAnomalies);

    // 4. Contextual Anomaly Detection
    const contextualAnomalies = this.detectContextualAnomalies(events, binProfile);
    anomalies.push(...contextualAnomalies);

    // 5. Temporal Anomaly Detection
    const temporalAnomalies = this.detectTemporalAnomalies(events);
    anomalies.push(...temporalAnomalies);

    return this.consolidateAnomalies(anomalies);
  }

  /**
   * Statistical anomaly detection using Z-score and IQR methods
   * @param {Array} events - Events to analyze
   * @param {Object} binProfile - Bin profile data
   * @returns {Array} Statistical anomalies
   */
  detectStatisticalAnomalies(events, binProfile) {
    const anomalies = [];
    
    if (events.length < 3) return anomalies;

    // Calculate statistics for weight
    const weights = events.map(e => e.weight_kg || 0).filter(w => w > 0);
    if (weights.length > 0) {
      const weightStats = this.calculateStatistics(weights);
      const weightAnomalies = this.detectOutliers(weights, weightStats, 'weight');
      anomalies.push(...weightAnomalies);
    }

    // Calculate statistics for fill level
    const fillLevels = events.map(e => e.fill_level || 0).filter(f => f > 0);
    if (fillLevels.length > 0) {
      const fillStats = this.calculateStatistics(fillLevels);
      const fillAnomalies = this.detectOutliers(fillLevels, fillStats, 'fill_level');
      anomalies.push(...fillAnomalies);
    }

    // Calculate statistics for purity scores
    const purities = events.map(e => e.ai_insights?.purity_score || 0.85).filter(p => p > 0);
    if (purities.length > 0) {
      const purityStats = this.calculateStatistics(purities);
      const purityAnomalies = this.detectOutliers(purities, purityStats, 'purity');
      anomalies.push(...purityAnomalies);
    }

    return anomalies;
  }

  /**
   * Pattern-based anomaly detection
   * @param {Array} events - Events to analyze
   * @param {Object} binProfile - Bin profile data
   * @returns {Array} Pattern anomalies
   */
  detectPatternAnomalies(events, binProfile) {
    const anomalies = [];

    // Detect unusual usage patterns
    const usagePattern = this.analyzeUsagePattern(events);
    if (usagePattern.isUnusual) {
      anomalies.push({
        type: 'UnusualUsagePattern',
        severity: 'medium',
        confidence: 0.8,
        details: {
          pattern_type: usagePattern.type,
          deviation: usagePattern.deviation,
          expected_pattern: usagePattern.expected,
          actual_pattern: usagePattern.actual
        }
      });
    }

    // Detect material composition anomalies
    const materialAnomalies = this.detectMaterialAnomalies(events);
    anomalies.push(...materialAnomalies);

    // Detect weight distribution anomalies
    const weightAnomalies = this.detectWeightDistributionAnomalies(events);
    anomalies.push(...weightAnomalies);

    return anomalies;
  }

  /**
   * AI-powered anomaly detection using Ollama
   * @param {Array} events - Events to analyze
   * @returns {Array} AI-detected anomalies
   */
  async detectAIAnomalies(events) {
    const anomalies = [];

    try {
      // Get AI analysis for recent events
      const aiResponse = await ollamaAiService.analyzeEvents(events);
      
      if (aiResponse.insights) {
        aiResponse.insights.forEach(insight => {
          if (insight.type === 'anomaly' || insight.severity === 'high') {
            anomalies.push({
              type: insight.type,
              severity: insight.severity,
              confidence: insight.confidence || 0.7,
              details: insight,
              ai_provider: 'ollama'
            });
          }
        });
      }

      // Check for anomalies in the anomalies array
      if (aiResponse.anomalies) {
        aiResponse.anomalies.forEach(anomaly => {
          anomalies.push({
            type: anomaly.type,
            severity: anomaly.severity,
            confidence: anomaly.confidence || 0.7,
            details: anomaly,
            ai_provider: 'ollama'
          });
        });
      }
    } catch (error) {
      console.error('AI anomaly detection failed:', error.message);
    }

    return anomalies;
  }

  /**
   * Contextual anomaly detection based on bin context
   * @param {Array} events - Events to analyze
   * @param {Object} binProfile - Bin profile data
   * @returns {Array} Contextual anomalies
   */
  detectContextualAnomalies(events, binProfile) {
    const anomalies = [];

    // Location-based anomalies
    if (binProfile.location_type) {
      const locationAnomalies = this.detectLocationBasedAnomalies(events, binProfile);
      anomalies.push(...locationAnomalies);
    }

    // Time-based anomalies
    const timeAnomalies = this.detectTimeBasedAnomalies(events, binProfile);
    anomalies.push(...timeAnomalies);

    // User behavior anomalies
    const userAnomalies = this.detectUserBehaviorAnomalies(events);
    anomalies.push(...userAnomalies);

    return anomalies;
  }

  /**
   * Temporal anomaly detection for time-series data
   * @param {Array} events - Events to analyze
   * @returns {Array} Temporal anomalies
   */
  detectTemporalAnomalies(events) {
    const anomalies = [];

    if (events.length < 5) return anomalies;

    // Sort events by timestamp
    const sortedEvents = events.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

    // Detect sudden spikes or drops
    const spikes = this.detectTemporalSpikes(sortedEvents);
    anomalies.push(...spikes);

    // Detect unusual intervals
    const intervals = this.detectUnusualIntervals(sortedEvents);
    anomalies.push(...intervals);

    return anomalies;
  }

  // Helper methods for statistical analysis
  calculateStatistics(values) {
    const n = values.length;
    const mean = values.reduce((sum, val) => sum + val, 0) / n;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / n;
    const stdDev = Math.sqrt(variance);
    
    const sorted = [...values].sort((a, b) => a - b);
    const q1 = sorted[Math.floor(n * 0.25)];
    const q3 = sorted[Math.floor(n * 0.75)];
    const iqr = q3 - q1;
    
    return { mean, stdDev, q1, q3, iqr, min: sorted[0], max: sorted[n - 1] };
  }

  detectOutliers(values, stats, type) {
    const anomalies = [];
    const zScoreThreshold = 2.5;
    const iqrMultiplier = 1.5;

    values.forEach((value, index) => {
      const zScore = Math.abs((value - stats.mean) / stats.stdDev);
      const isZScoreOutlier = zScore > zScoreThreshold;
      
      const lowerBound = stats.q1 - iqrMultiplier * stats.iqr;
      const upperBound = stats.q3 + iqrMultiplier * stats.iqr;
      const isIQROutlier = value < lowerBound || value > upperBound;

      if (isZScoreOutlier || isIQROutlier) {
        anomalies.push({
          type: `${type}_outlier`,
          severity: zScore > 3 ? 'high' : 'medium',
          confidence: Math.min(zScore / 4, 0.95),
          details: {
            value,
            z_score: zScore,
            iqr_outlier: isIQROutlier,
            threshold: type === 'weight' ? this.anomalyThresholds.weight : this.anomalyThresholds.fillLevel
          }
        });
      }
    });

    return anomalies;
  }

  analyzeUsagePattern(events) {
    // Simple pattern analysis - can be enhanced
    const hourlyUsage = new Array(24).fill(0);
    events.forEach(event => {
      const hour = new Date(event.created_at).getHours();
      hourlyUsage[hour]++;
    });

    const avgUsage = hourlyUsage.reduce((sum, count) => sum + count, 0) / 24;
    const maxUsage = Math.max(...hourlyUsage);
    const deviation = maxUsage / avgUsage;

    return {
      isUnusual: deviation > 2,
      type: 'hourly_usage_spike',
      deviation,
      expected: avgUsage,
      actual: maxUsage
    };
  }

  detectMaterialAnomalies(events) {
    const anomalies = [];
    
    events.forEach(event => {
      if (event.categories) {
        const total = Object.values(event.categories).reduce((sum, val) => sum + val, 0);
        const plasticRatio = event.categories.plastic / total;
        
        if (plasticRatio > 0.8) {
          anomalies.push({
            type: 'high_plastic_ratio',
            severity: 'medium',
            confidence: 0.8,
            details: {
              plastic_ratio: plasticRatio,
              threshold: 0.8
            }
          });
        }
      }
    });

    return anomalies;
  }

  detectWeightDistributionAnomalies(events) {
    const anomalies = [];
    
    if (events.length < 3) return anomalies;

    const weights = events.map(e => e.weight_kg_total || e.weight_kg || 0);
    const avgWeight = weights.reduce((sum, w) => sum + w, 0) / weights.length;
    
    weights.forEach((weight, index) => {
      if (weight > avgWeight * 3) {
        anomalies.push({
          type: 'unusual_weight',
          severity: 'high',
          confidence: 0.9,
          details: {
            weight,
            average_weight: avgWeight,
            multiplier: weight / avgWeight
          }
        });
      }
    });

    return anomalies;
  }

  detectLocationBasedAnomalies(events, binProfile) {
    // Placeholder for location-based anomaly detection
    return [];
  }

  detectTimeBasedAnomalies(events, binProfile) {
    const anomalies = [];
    
    events.forEach(event => {
      const hour = new Date(event.created_at).getHours();
      if (hour < 6 || hour > 22) {
        anomalies.push({
          type: 'off_hours_usage',
          severity: 'low',
          confidence: 0.7,
          details: {
            hour,
            expected_hours: '6:00-22:00'
          }
        });
      }
    });

    return anomalies;
  }

  detectUserBehaviorAnomalies(events) {
    // Placeholder for user behavior anomaly detection
    return [];
  }

  detectTemporalSpikes(events) {
    const anomalies = [];
    
    for (let i = 1; i < events.length - 1; i++) {
      const prev = events[i - 1];
      const curr = events[i];
      const next = events[i + 1];
      
      const prevWeight = prev.weight_kg_total || prev.weight_kg || 0;
      const currWeight = curr.weight_kg_total || curr.weight_kg || 0;
      const nextWeight = next.weight_kg_total || next.weight_kg || 0;
      
      const avgNeighbor = (prevWeight + nextWeight) / 2;
      const spike = currWeight / avgNeighbor;
      
      if (spike > 2) {
        anomalies.push({
          type: 'temporal_spike',
          severity: 'medium',
          confidence: 0.8,
          details: {
            spike_ratio: spike,
            timestamp: curr.created_at
          }
        });
      }
    }

    return anomalies;
  }

  detectUnusualIntervals(events) {
    const anomalies = [];
    
    for (let i = 1; i < events.length; i++) {
      const prev = new Date(events[i - 1].created_at);
      const curr = new Date(events[i].created_at);
      const interval = curr - prev;
      
      if (interval < this.anomalyThresholds.frequency.minInterval * 1000) {
        anomalies.push({
          type: 'rapid_succession',
          severity: 'medium',
          confidence: 0.7,
          details: {
            interval_seconds: interval / 1000,
            threshold: this.anomalyThresholds.frequency.minInterval
          }
        });
      }
    }

    return anomalies;
  }

  consolidateAnomalies(anomalies) {
    // Remove duplicates and merge similar anomalies
    const consolidated = [];
    const seen = new Set();

    anomalies.forEach(anomaly => {
      const key = `${anomaly.type}_${anomaly.severity}`;
      if (!seen.has(key)) {
        seen.add(key);
        consolidated.push(anomaly);
      }
    });

    return consolidated.sort((a, b) => {
      const severityOrder = { high: 3, medium: 2, low: 1 };
      return severityOrder[b.severity] - severityOrder[a.severity];
    });
  }
}

module.exports = new EnhancedAnomalyDetection();
