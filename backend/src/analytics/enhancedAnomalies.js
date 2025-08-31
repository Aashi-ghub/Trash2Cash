const { pool } = require('../config/database');
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
   * AI-powered anomaly detection using OpenXAI
   * @param {Array} events - Events to analyze
   * @returns {Array} AI-detected anomalies
   */
  async detectAIAnomalies(events) {
    const anomalies = [];

    try {
      // Get AI analysis for recent events
      const aiResponse = await ollamaAiService.analyzeEvents(events);
      
      if (aiResponse.status === 'success' && aiResponse.data.insights) {
        aiResponse.data.insights.forEach(insight => {
          if (insight.anomaly_detected && insight.anomaly_details) {
            anomalies.push({
              type: insight.anomaly_details.type,
              severity: insight.anomaly_details.severity,
              confidence: insight.anomaly_details.confidence,
              details: insight.anomaly_details,
              ai_provider: insight.processing_metadata?.provider || 'openxai'
            });
          }
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

    // Detect seasonal anomalies
    const seasonal = this.detectSeasonalAnomalies(sortedEvents);
    anomalies.push(...seasonal);

    return anomalies;
  }

  /**
   * Calculate basic statistics for a dataset
   * @param {Array} data - Numeric data
   * @returns {Object} Statistics
   */
  calculateStatistics(data) {
    const sorted = data.sort((a, b) => a - b);
    const n = sorted.length;
    const sum = sorted.reduce((a, b) => a + b, 0);
    const mean = sum / n;
    const variance = sorted.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / n;
    const stdDev = Math.sqrt(variance);
    const median = n % 2 === 0 ? (sorted[n/2 - 1] + sorted[n/2]) / 2 : sorted[Math.floor(n/2)];
    const q1 = sorted[Math.floor(n * 0.25)];
    const q3 = sorted[Math.floor(n * 0.75)];
    const iqr = q3 - q1;

    return { mean, stdDev, median, q1, q3, iqr, min: sorted[0], max: sorted[n-1] };
  }

  /**
   * Detect outliers using Z-score and IQR methods
   * @param {Array} data - Data to analyze
   * @param {Object} stats - Calculated statistics
   * @param {string} metric - Metric name
   * @returns {Array} Outliers
   */
  detectOutliers(data, stats, metric) {
    const outliers = [];

    data.forEach((value, index) => {
      // Z-score method
      const zScore = Math.abs((value - stats.mean) / stats.stdDev);
      
      // IQR method
      const lowerBound = stats.q1 - 1.5 * stats.iqr;
      const upperBound = stats.q3 + 1.5 * stats.iqr;

      if (zScore > 2.5 || value < lowerBound || value > upperBound) {
        outliers.push({
          type: `${metric}_outlier`,
          severity: zScore > 3 ? 'high' : 'medium',
          confidence: Math.min(0.95, zScore / 4),
          details: {
            value,
            z_score: zScore,
            iqr_lower: lowerBound,
            iqr_upper: upperBound,
            method: zScore > 2.5 ? 'z_score' : 'iqr'
          }
        });
      }
    });

    return outliers;
  }

  /**
   * Analyze usage patterns
   * @param {Array} events - Events to analyze
   * @returns {Object} Usage pattern analysis
   */
  analyzeUsagePattern(events) {
    if (events.length < 3) return { isUnusual: false };

    const hourlyUsage = new Array(24).fill(0);
    const dailyUsage = new Array(7).fill(0);

    events.forEach(event => {
      const date = new Date(event.created_at);
      hourlyUsage[date.getHours()]++;
      dailyUsage[date.getDay()]++;
    });

    // Detect unusual patterns
    const maxHourly = Math.max(...hourlyUsage);
    const avgHourly = hourlyUsage.reduce((a, b) => a + b, 0) / 24;
    const maxDaily = Math.max(...dailyUsage);
    const avgDaily = dailyUsage.reduce((a, b) => a + b, 0) / 7;

    const isUnusual = maxHourly > avgHourly * 3 || maxDaily > avgDaily * 2;

    return {
      isUnusual,
      type: maxHourly > avgHourly * 3 ? 'hourly_spike' : 'daily_spike',
      deviation: maxHourly > avgHourly * 3 ? maxHourly / avgHourly : maxDaily / avgDaily,
      expected: { hourly: avgHourly, daily: avgDaily },
      actual: { hourly: maxHourly, daily: maxDaily }
    };
  }

  /**
   * Detect material composition anomalies
   * @param {Array} events - Events to analyze
   * @returns {Array} Material anomalies
   */
  detectMaterialAnomalies(events) {
    const anomalies = [];
    const materials = events.map(e => e.event_data?.material || 'unknown');
    const materialCounts = {};

    materials.forEach(material => {
      materialCounts[material] = (materialCounts[material] || 0) + 1;
    });

    const total = materials.length;
    const unusualMaterials = Object.entries(materialCounts)
      .filter(([material, count]) => {
        const percentage = (count / total) * 100;
        return material === 'unknown' && percentage > 20 || 
               material === 'contaminated' && percentage > 10;
      });

    unusualMaterials.forEach(([material, count]) => {
      anomalies.push({
        type: 'unusual_material_composition',
        severity: 'medium',
        confidence: 0.8,
        details: {
          material,
          percentage: (count / total) * 100,
          threshold: material === 'unknown' ? 20 : 10
        }
      });
    });

    return anomalies;
  }

  /**
   * Detect weight distribution anomalies
   * @param {Array} events - Events to analyze
   * @returns {Array} Weight anomalies
   */
  detectWeightDistributionAnomalies(events) {
    const anomalies = [];
    const weights = events.map(e => e.weight_kg || 0).filter(w => w > 0);

    if (weights.length === 0) return anomalies;

    // Detect unusually heavy or light deposits
    const avgWeight = weights.reduce((a, b) => a + b, 0) / weights.length;
    const heavyDeposits = weights.filter(w => w > avgWeight * 3);
    const lightDeposits = weights.filter(w => w < avgWeight * 0.1);

    if (heavyDeposits.length > 0) {
      anomalies.push({
        type: 'unusually_heavy_deposits',
        severity: 'medium',
        confidence: 0.7,
        details: {
          count: heavyDeposits.length,
          average_weight: avgWeight,
          heavy_weights: heavyDeposits
        }
      });
    }

    if (lightDeposits.length > 0) {
      anomalies.push({
        type: 'unusually_light_deposits',
        severity: 'low',
        confidence: 0.6,
        details: {
          count: lightDeposits.length,
          average_weight: avgWeight,
          light_weights: lightDeposits
        }
      });
    }

    return anomalies;
  }

  /**
   * Detect location-based anomalies
   * @param {Array} events - Events to analyze
   * @param {Object} binProfile - Bin profile
   * @returns {Array} Location anomalies
   */
  detectLocationBasedAnomalies(events, binProfile) {
    const anomalies = [];

    // This would be enhanced with real location data
    // For now, using basic patterns
    if (binProfile.location_type === 'residential' && events.length > 50) {
      anomalies.push({
        type: 'high_usage_residential_area',
        severity: 'low',
        confidence: 0.6,
        details: {
          location_type: binProfile.location_type,
          event_count: events.length,
          threshold: 50
        }
      });
    }

    return anomalies;
  }

  /**
   * Detect time-based anomalies
   * @param {Array} events - Events to analyze
   * @param {Object} binProfile - Bin profile
   * @returns {Array} Time anomalies
   */
  detectTimeBasedAnomalies(events, binProfile) {
    const anomalies = [];

    const nightEvents = events.filter(event => {
      const hour = new Date(event.created_at).getHours();
      return hour >= 22 || hour <= 6;
    });

    if (nightEvents.length > events.length * 0.3) {
      anomalies.push({
        type: 'unusual_night_usage',
        severity: 'medium',
        confidence: 0.7,
        details: {
          night_events: nightEvents.length,
          total_events: events.length,
          percentage: (nightEvents.length / events.length) * 100
        }
      });
    }

    return anomalies;
  }

  /**
   * Detect user behavior anomalies
   * @param {Array} events - Events to analyze
   * @returns {Array} User behavior anomalies
   */
  detectUserBehaviorAnomalies(events) {
    const anomalies = [];

    // Group events by user
    const userEvents = {};
    events.forEach(event => {
      const userId = event.user_id;
      if (!userEvents[userId]) userEvents[userId] = [];
      userEvents[userId].push(event);
    });

    // Detect users with unusual patterns
    Object.entries(userEvents).forEach(([userId, userEventList]) => {
      if (userEventList.length > 20) {
        anomalies.push({
          type: 'high_frequency_user',
          severity: 'low',
          confidence: 0.6,
          details: {
            user_id: userId,
            event_count: userEventList.length,
            threshold: 20
          }
        });
      }
    });

    return anomalies;
  }

  /**
   * Detect temporal spikes in data
   * @param {Array} sortedEvents - Events sorted by time
   * @returns {Array} Temporal spike anomalies
   */
  detectTemporalSpikes(sortedEvents) {
    const anomalies = [];

    for (let i = 1; i < sortedEvents.length - 1; i++) {
      const prev = sortedEvents[i - 1];
      const curr = sortedEvents[i];
      const next = sortedEvents[i + 1];

      const prevWeight = prev.weight_kg || 0;
      const currWeight = curr.weight_kg || 0;
      const nextWeight = next.weight_kg || 0;

      const avgWeight = (prevWeight + nextWeight) / 2;
      
      if (currWeight > avgWeight * 5) {
        anomalies.push({
          type: 'temporal_weight_spike',
          severity: 'medium',
          confidence: 0.8,
          details: {
            spike_weight: currWeight,
            average_weight: avgWeight,
            multiplier: currWeight / avgWeight
          }
        });
      }
    }

    return anomalies;
  }

  /**
   * Detect unusual time intervals between events
   * @param {Array} sortedEvents - Events sorted by time
   * @returns {Array} Interval anomalies
   */
  detectUnusualIntervals(sortedEvents) {
    const anomalies = [];

    for (let i = 1; i < sortedEvents.length; i++) {
      const prev = new Date(sortedEvents[i - 1].created_at);
      const curr = new Date(sortedEvents[i].created_at);
      const interval = (curr - prev) / 1000; // seconds

      if (interval < this.anomalyThresholds.frequency.minInterval) {
        anomalies.push({
          type: 'unusually_frequent_events',
          severity: 'medium',
          confidence: 0.7,
          details: {
            interval_seconds: interval,
            threshold: this.anomalyThresholds.frequency.minInterval
          }
        });
      }
    }

    return anomalies;
  }

  /**
   * Detect seasonal anomalies
   * @param {Array} sortedEvents - Events sorted by time
   * @returns {Array} Seasonal anomalies
   */
  detectSeasonalAnomalies(sortedEvents) {
    const anomalies = [];

    // This is a simplified seasonal detection
    // In a real implementation, you'd use more sophisticated seasonal decomposition
    const hourlyDistribution = new Array(24).fill(0);
    
    sortedEvents.forEach(event => {
      const hour = new Date(event.created_at).getHours();
      hourlyDistribution[hour]++;
    });

    const avgHourly = hourlyDistribution.reduce((a, b) => a + b, 0) / 24;
    const unusualHours = hourlyDistribution
      .map((count, hour) => ({ hour, count }))
      .filter(({ count }) => count > avgHourly * 2);

    unusualHours.forEach(({ hour, count }) => {
      anomalies.push({
        type: 'seasonal_usage_pattern',
        severity: 'low',
        confidence: 0.6,
        details: {
          hour,
          event_count: count,
          average_count: avgHourly,
          multiplier: count / avgHourly
        }
      });
    });

    return anomalies;
  }

  /**
   * Consolidate and deduplicate anomalies
   * @param {Array} anomalies - Raw anomalies
   * @returns {Array} Consolidated anomalies
   */
  consolidateAnomalies(anomalies) {
    const consolidated = [];
    const seen = new Set();

    anomalies.forEach(anomaly => {
      const key = `${anomaly.type}_${anomaly.severity}`;
      
      if (!seen.has(key)) {
        seen.add(key);
        consolidated.push(anomaly);
      } else {
        // Merge similar anomalies
        const existing = consolidated.find(a => `${a.type}_${a.severity}` === key);
        if (existing) {
          existing.confidence = Math.max(existing.confidence, anomaly.confidence);
          if (existing.details && anomaly.details) {
            existing.details = { ...existing.details, ...anomaly.details };
          }
        }
      }
    });

    return consolidated.sort((a, b) => {
      const severityOrder = { high: 3, medium: 2, low: 1 };
      return severityOrder[b.severity] - severityOrder[a.severity];
    });
  }
}

module.exports = new EnhancedAnomalyDetection();
