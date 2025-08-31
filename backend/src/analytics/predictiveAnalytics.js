const { pool } = require('../config/database');
const ollamaAiService = require('../services/hybridAiService');

/**
 * Advanced predictive analytics for waste management optimization
 */
class PredictiveAnalytics {
  constructor() {
    this.predictionHorizons = {
      short: 24, // 24 hours
      medium: 168, // 1 week
      long: 720 // 1 month
    };
  }

  /**
   * Generate comprehensive predictions for a bin
   * @param {string} binId - Bin ID
   * @param {Object} options - Prediction options
   * @returns {Promise<Object>} Predictive analytics results
   */
  async generatePredictions(binId, options = {}) {
    try {
      // Get historical data
      const historicalData = await this.getHistoricalData(binId);
      
      if (!historicalData || historicalData.length === 0) {
        return this.getDefaultPredictions(binId);
      }

      const predictions = {
        bin_id: binId,
        generated_at: new Date().toISOString(),
        horizons: {}
      };

      // 1. Capacity Forecasting
      predictions.horizons.capacity = await this.predictCapacity(historicalData, options);
      
      // 2. Usage Pattern Prediction
      predictions.horizons.usage = await this.predictUsagePatterns(historicalData, options);
      
      // 3. Collection Optimization
      predictions.horizons.collection = await this.optimizeCollectionSchedule(historicalData, options);
      
      // 4. Revenue Forecasting
      predictions.horizons.revenue = await this.predictRevenue(historicalData, options);
      
      // 5. Maintenance Prediction
      predictions.horizons.maintenance = await this.predictMaintenance(historicalData, options);
      
      // 6. AI-powered Insights
      predictions.ai_insights = await this.getAIPredictions(binId, historicalData);

      return {
        status: 'success',
        data: predictions
      };
    } catch (error) {
      console.error('Predictive analytics error:', error);
      return {
        status: 'error',
        error: error.message,
        data: this.getDefaultPredictions(binId)
      };
    }
  }

  /**
   * Get historical data for predictions
   * @param {string} binId - Bin ID
   * @returns {Promise<Array>} Historical data
   */
  async getHistoricalData(binId) {
    const query = `
      SELECT 
        e.*,
        ai.purity_score,
        ai.anomaly_detected,
        b.location,
        b.capacity_kg
      FROM bin_events e
      LEFT JOIN ai_insights ai ON e.id = ai.event_id
      LEFT JOIN bins b ON e.bin_id = b.bin_id
      WHERE e.bin_id = $1
      AND e.created_at >= NOW() - INTERVAL '30 days'
      ORDER BY e.created_at DESC
    `;

    const { rows } = await pool.query(query, [binId]);
    return rows;
  }

  /**
   * Predict capacity requirements
   * @param {Array} historicalData - Historical data
   * @param {Object} options - Prediction options
   * @returns {Promise<Object>} Capacity predictions
   */
  async predictCapacity(historicalData, options) {
    const predictions = {};
    
    // Calculate daily averages
    const dailyAverages = this.calculateDailyAverages(historicalData);
    
    // Predict for different horizons
    Object.entries(this.predictionHorizons).forEach(([horizon, hours]) => {
      const days = hours / 24;
      const predictedCapacity = dailyAverages.weight * days * 1.2; // 20% buffer
      
      predictions[horizon] = {
        predicted_capacity_kg: Math.round(predictedCapacity * 100) / 100,
        confidence: this.calculateConfidence(historicalData, horizon),
        factors: {
          daily_average: dailyAverages.weight,
          trend: this.calculateTrend(historicalData),
          seasonality: this.detectSeasonality(historicalData),
          buffer_percentage: 20
        }
      };
    });

    return predictions;
  }

  /**
   * Predict usage patterns
   * @param {Array} historicalData - Historical data
   * @param {Object} options - Prediction options
   * @returns {Promise<Object>} Usage pattern predictions
   */
  async predictUsagePatterns(historicalData, options) {
    const patterns = {
      peak_hours: this.findPeakHours(historicalData),
      peak_days: this.findPeakDays(historicalData),
      seasonal_trends: this.analyzeSeasonalTrends(historicalData),
      user_behavior: this.analyzeUserBehavior(historicalData)
    };

    // Predict future patterns
    const predictions = {
      next_24h: {
        peak_hours: patterns.peak_hours,
        expected_events: Math.round(this.calculateDailyAverage(historicalData) * 1.1),
        confidence: 0.85
      },
      next_week: {
        peak_days: patterns.peak_days,
        expected_events: Math.round(this.calculateDailyAverage(historicalData) * 7),
        confidence: 0.75
      },
      next_month: {
        seasonal_adjustment: patterns.seasonal_trends.adjustment,
        expected_events: Math.round(this.calculateDailyAverage(historicalData) * 30 * patterns.seasonal_trends.adjustment),
        confidence: 0.65
      }
    };

    return predictions;
  }

  /**
   * Optimize collection schedule
   * @param {Array} historicalData - Historical data
   * @param {Object} options - Prediction options
   * @returns {Promise<Object>} Collection optimization
   */
  async optimizeCollectionSchedule(historicalData, options) {
    const optimization = {
      current_schedule: 'daily',
      recommended_schedule: this.calculateOptimalSchedule(historicalData),
      cost_analysis: this.analyzeCollectionCosts(historicalData),
      efficiency_gains: this.calculateEfficiencyGains(historicalData)
    };

    // Predict optimal collection times
    const peakUsage = this.findPeakHours(historicalData);
    optimization.recommended_times = peakUsage.map(hour => ({
      hour: hour.hour,
      reason: 'Peak usage period',
      efficiency_impact: hour.percentage
    }));

    return optimization;
  }

  /**
   * Predict revenue
   * @param {Array} historicalData - Historical data
   * @param {Object} options - Prediction options
   * @returns {Promise<Object>} Revenue predictions
   */
  async predictRevenue(historicalData, options) {
    const revenuePredictions = {};
    
    // Calculate current revenue metrics
    const currentMetrics = this.calculateRevenueMetrics(historicalData);
    
    Object.entries(this.predictionHorizons).forEach(([horizon, hours]) => {
      const days = hours / 24;
      const predictedRevenue = currentMetrics.daily_revenue * days;
      
      revenuePredictions[horizon] = {
        predicted_revenue: Math.round(predictedRevenue * 100) / 100,
        confidence: this.calculateConfidence(historicalData, horizon),
        factors: {
          daily_average: currentMetrics.daily_revenue,
          purity_bonus: currentMetrics.purity_bonus,
          user_engagement: currentMetrics.user_engagement,
          market_trends: 1.05 // 5% growth assumption
        }
      };
    });

    return revenuePredictions;
  }

  /**
   * Predict maintenance requirements
   * @param {Array} historicalData - Historical data
   * @param {Object} options - Prediction options
   * @returns {Promise<Object>} Maintenance predictions
   */
  async predictMaintenance(historicalData, options) {
    const maintenancePredictions = {
      next_maintenance: this.predictNextMaintenance(historicalData),
      risk_factors: this.assessMaintenanceRisks(historicalData),
      recommendations: this.generateMaintenanceRecommendations(historicalData)
    };

    return maintenancePredictions;
  }

  /**
   * Get AI-powered predictions
   * @param {string} binId - Bin ID
   * @param {Array} historicalData - Historical data
   * @returns {Promise<Object>} AI predictions
   */
  async getAIPredictions(binId, historicalData) {
    try {
      const aiResponse = await ollamaAiService.getPredictiveAnalytics(binId, {
        events: historicalData,
        bin_profile: await this.getBinProfile(binId)
      });

      return aiResponse.data || {};
    } catch (error) {
      console.error('AI predictions failed:', error);
      return {
        peak_usage_times: ['14:00-16:00', '18:00-20:00'],
        optimization_suggestions: ['Add token multiplier campaign', 'Consider additional bin placement'],
        risk_factors: ['High contamination rate', 'Irregular usage patterns']
      };
    }
  }

  /**
   * Calculate daily averages from historical data
   * @param {Array} historicalData - Historical data
   * @returns {Object} Daily averages
   */
  calculateDailyAverages(historicalData) {
    const dailyGroups = {};
    
    historicalData.forEach(event => {
      const date = new Date(event.created_at).toDateString();
      if (!dailyGroups[date]) {
        dailyGroups[date] = { weight: 0, events: 0, purity: 0 };
      }
      dailyGroups[date].weight += event.weight_kg || 0;
      dailyGroups[date].events += 1;
      dailyGroups[date].purity += event.purity_score || 0.85;
    });

    const dailyAverages = Object.values(dailyGroups).reduce((acc, day) => {
      acc.weight += day.weight;
      acc.events += day.events;
      acc.purity += day.purity;
      return acc;
    }, { weight: 0, events: 0, purity: 0 });

    const daysCount = Object.keys(dailyGroups).length;
    return {
      weight: dailyAverages.weight / daysCount,
      events: dailyAverages.events / daysCount,
      purity: dailyAverages.purity / daysCount
    };
  }

  /**
   * Find peak usage hours
   * @param {Array} historicalData - Historical data
   * @returns {Array} Peak hours
   */
  findPeakHours(historicalData) {
    const hourlyUsage = new Array(24).fill(0);
    
    historicalData.forEach(event => {
      const hour = new Date(event.created_at).getHours();
      hourlyUsage[hour]++;
    });

    const total = hourlyUsage.reduce((a, b) => a + b, 0);
    const peakHours = hourlyUsage
      .map((count, hour) => ({ hour, count, percentage: (count / total) * 100 }))
      .filter(({ percentage }) => percentage > 8) // More than 8% of daily usage
      .sort((a, b) => b.percentage - a.percentage);

    return peakHours.slice(0, 5); // Top 5 peak hours
  }

  /**
   * Find peak usage days
   * @param {Array} historicalData - Historical data
   * @returns {Array} Peak days
   */
  findPeakDays(historicalData) {
    const dailyUsage = new Array(7).fill(0);
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    historicalData.forEach(event => {
      const day = new Date(event.created_at).getDay();
      dailyUsage[day]++;
    });

    const total = dailyUsage.reduce((a, b) => a + b, 0);
    return dailyUsage
      .map((count, day) => ({ 
        day: dayNames[day], 
        count, 
        percentage: (count / total) * 100 
      }))
      .sort((a, b) => b.percentage - a.percentage);
  }

  /**
   * Analyze seasonal trends
   * @param {Array} historicalData - Historical data
   * @returns {Object} Seasonal analysis
   */
  analyzeSeasonalTrends(historicalData) {
    const monthlyUsage = new Array(12).fill(0);
    
    historicalData.forEach(event => {
      const month = new Date(event.created_at).getMonth();
      monthlyUsage[month]++;
    });

    const avgUsage = monthlyUsage.reduce((a, b) => a + b, 0) / 12;
    const currentMonth = new Date().getMonth();
    const currentUsage = monthlyUsage[currentMonth];
    
    return {
      current_month_usage: currentUsage,
      average_monthly_usage: avgUsage,
      adjustment: currentUsage / avgUsage,
      trend: currentUsage > avgUsage ? 'increasing' : 'decreasing'
    };
  }

  /**
   * Analyze user behavior patterns
   * @param {Array} historicalData - Historical data
   * @returns {Object} User behavior analysis
   */
  analyzeUserBehavior(historicalData) {
    const userStats = {};
    
    historicalData.forEach(event => {
      const userId = event.user_id;
      if (!userStats[userId]) {
        userStats[userId] = { events: 0, totalWeight: 0, avgPurity: 0 };
      }
      userStats[userId].events++;
      userStats[userId].totalWeight += event.weight_kg || 0;
      userStats[userId].avgPurity += event.purity_score || 0.85;
    });

    const users = Object.values(userStats);
    const totalUsers = users.length;
    
    return {
      total_users: totalUsers,
      average_events_per_user: users.reduce((acc, user) => acc + user.events, 0) / totalUsers,
      average_weight_per_user: users.reduce((acc, user) => acc + user.totalWeight, 0) / totalUsers,
      average_purity_per_user: users.reduce((acc, user) => acc + user.avgPurity, 0) / totalUsers / totalUsers,
      engagement_level: this.calculateEngagementLevel(users)
    };
  }

  /**
   * Calculate confidence level for predictions
   * @param {Array} historicalData - Historical data
   * @param {string} horizon - Prediction horizon
   * @returns {number} Confidence level (0-1)
   */
  calculateConfidence(historicalData, horizon) {
    const dataPoints = historicalData.length;
    const daysOfData = this.getDaysOfData(historicalData);
    
    let baseConfidence = Math.min(0.95, dataPoints / 100);
    
    // Adjust for data recency
    const recencyFactor = Math.max(0.5, 1 - (daysOfData / 30));
    
    // Adjust for prediction horizon
    const horizonFactor = horizon === 'short' ? 1 : horizon === 'medium' ? 0.9 : 0.8;
    
    return Math.round((baseConfidence * recencyFactor * horizonFactor) * 100) / 100;
  }

  /**
   * Calculate trend in data
   * @param {Array} historicalData - Historical data
   * @returns {Object} Trend analysis
   */
  calculateTrend(historicalData) {
    if (historicalData.length < 7) return { direction: 'stable', slope: 0 };
    
    const sortedData = historicalData.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    const recentData = sortedData.slice(-7);
    const olderData = sortedData.slice(-14, -7);
    
    const recentAvg = recentData.reduce((acc, event) => acc + (event.weight_kg || 0), 0) / recentData.length;
    const olderAvg = olderData.reduce((acc, event) => acc + (event.weight_kg || 0), 0) / olderData.length;
    
    const slope = recentAvg - olderAvg;
    const direction = slope > 0 ? 'increasing' : slope < 0 ? 'decreasing' : 'stable';
    
    return { direction, slope: Math.round(slope * 100) / 100 };
  }

  /**
   * Detect seasonality in data
   * @param {Array} historicalData - Historical data
   * @returns {Object} Seasonality analysis
   */
  detectSeasonality(historicalData) {
    // Simplified seasonality detection
    // In a real implementation, you'd use more sophisticated methods like FFT or seasonal decomposition
    const weeklyPattern = new Array(7).fill(0);
    
    historicalData.forEach(event => {
      const day = new Date(event.created_at).getDay();
      weeklyPattern[day]++;
    });
    
    const avg = weeklyPattern.reduce((a, b) => a + b, 0) / 7;
    const variance = weeklyPattern.reduce((acc, count) => acc + Math.pow(count - avg, 2), 0) / 7;
    
    return {
      has_seasonality: variance > avg * 0.5,
      strength: Math.min(1, variance / avg),
      pattern: weeklyPattern
    };
  }

  /**
   * Calculate optimal collection schedule
   * @param {Array} historicalData - Historical data
   * @returns {string} Optimal schedule
   */
  calculateOptimalSchedule(historicalData) {
    const dailyAvg = this.calculateDailyAverage(historicalData);
    const capacity = 100; // Assume 100kg capacity
    
    if (dailyAvg > capacity * 0.8) return 'twice_daily';
    if (dailyAvg > capacity * 0.5) return 'daily';
    if (dailyAvg > capacity * 0.3) return 'every_other_day';
    return 'weekly';
  }

  /**
   * Analyze collection costs
   * @param {Array} historicalData - Historical data
   * @returns {Object} Cost analysis
   */
  analyzeCollectionCosts(historicalData) {
    const dailyAvg = this.calculateDailyAverage(historicalData);
    const currentSchedule = 'daily';
    const optimalSchedule = this.calculateOptimalSchedule(historicalData);
    
    const costs = {
      current: { frequency: 'daily', cost_per_day: 50 },
      optimal: { frequency: optimalSchedule, cost_per_day: this.getScheduleCost(optimalSchedule) },
      savings: 0
    };
    
    costs.savings = costs.current.cost_per_day - costs.optimal.cost_per_day;
    
    return costs;
  }

  /**
   * Calculate efficiency gains
   * @param {Array} historicalData - Historical data
   * @returns {Object} Efficiency analysis
   */
  calculateEfficiencyGains(historicalData) {
    const currentEfficiency = 0.75; // Assume 75% efficiency
    const potentialEfficiency = 0.95; // Target 95% efficiency
    
    return {
      current_efficiency: currentEfficiency,
      potential_efficiency: potentialEfficiency,
      improvement_potential: potentialEfficiency - currentEfficiency,
      estimated_savings_percentage: ((potentialEfficiency - currentEfficiency) / currentEfficiency) * 100
    };
  }

  /**
   * Calculate revenue metrics
   * @param {Array} historicalData - Historical data
   * @returns {Object} Revenue metrics
   */
  calculateRevenueMetrics(historicalData) {
    const dailyAvg = this.calculateDailyAverage(historicalData);
    const avgPurity = historicalData.reduce((acc, event) => acc + (event.purity_score || 0.85), 0) / historicalData.length;
    
    return {
      daily_revenue: dailyAvg * 2.5, // Assume $2.5 per kg
      purity_bonus: avgPurity > 0.9 ? 0.1 : 0, // 10% bonus for high purity
      user_engagement: this.calculateUserEngagement(historicalData),
      market_rate: 2.5
    };
  }

  /**
   * Predict next maintenance
   * @param {Array} historicalData - Historical data
   * @returns {Object} Maintenance prediction
   */
  predictNextMaintenance(historicalData) {
    const lastMaintenance = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // Assume 7 days ago
    const usageIntensity = this.calculateUsageIntensity(historicalData);
    
    const maintenanceInterval = usageIntensity > 0.8 ? 14 : usageIntensity > 0.5 ? 21 : 30; // days
    const nextMaintenance = new Date(lastMaintenance.getTime() + maintenanceInterval * 24 * 60 * 60 * 1000);
    
    return {
      next_maintenance_date: nextMaintenance.toISOString(),
      days_until_maintenance: Math.ceil((nextMaintenance - new Date()) / (24 * 60 * 60 * 1000)),
      maintenance_interval_days: maintenanceInterval,
      usage_intensity: usageIntensity
    };
  }

  /**
   * Assess maintenance risks
   * @param {Array} historicalData - Historical data
   * @returns {Array} Risk factors
   */
  assessMaintenanceRisks(historicalData) {
    const risks = [];
    
    const usageIntensity = this.calculateUsageIntensity(historicalData);
    if (usageIntensity > 0.9) {
      risks.push({
        type: 'high_usage_risk',
        severity: 'high',
        description: 'Bin usage exceeds 90% capacity regularly',
        recommendation: 'Consider additional bin placement or more frequent collection'
      });
    }
    
    const contaminationRate = this.calculateContaminationRate(historicalData);
    if (contaminationRate > 0.2) {
      risks.push({
        type: 'high_contamination_risk',
        severity: 'medium',
        description: 'Contamination rate exceeds 20%',
        recommendation: 'Implement user education program'
      });
    }
    
    return risks;
  }

  /**
   * Generate maintenance recommendations
   * @param {Array} historicalData - Historical data
   * @returns {Array} Maintenance recommendations
   */
  generateMaintenanceRecommendations(historicalData) {
    const recommendations = [];
    
    const usageIntensity = this.calculateUsageIntensity(historicalData);
    if (usageIntensity > 0.8) {
      recommendations.push('Schedule preventive maintenance within 7 days');
    }
    
    const anomalyCount = historicalData.filter(event => event.anomaly_detected).length;
    if (anomalyCount > historicalData.length * 0.1) {
      recommendations.push('Investigate sensor calibration and system health');
    }
    
    return recommendations;
  }

  /**
   * Get bin profile
   * @param {string} binId - Bin ID
   * @returns {Promise<Object>} Bin profile
   */
  async getBinProfile(binId) {
    const query = 'SELECT * FROM bins WHERE bin_id = $1';
    const { rows } = await pool.query(query, [binId]);
    return rows[0] || {};
  }

  /**
   * Helper methods
   */
  calculateDailyAverage(historicalData) {
    const dailyGroups = {};
    historicalData.forEach(event => {
      const date = new Date(event.created_at).toDateString();
      if (!dailyGroups[date]) dailyGroups[date] = 0;
      dailyGroups[date] += event.weight_kg || 0;
    });
    
    const totalWeight = Object.values(dailyGroups).reduce((a, b) => a + b, 0);
    return totalWeight / Object.keys(dailyGroups).length;
  }

  calculateEngagementLevel(users) {
    const avgEvents = users.reduce((acc, user) => acc + user.events, 0) / users.length;
    if (avgEvents > 10) return 'high';
    if (avgEvents > 5) return 'medium';
    return 'low';
  }

  getDaysOfData(historicalData) {
    if (historicalData.length === 0) return 0;
    const firstDate = new Date(historicalData[historicalData.length - 1].created_at);
    const lastDate = new Date(historicalData[0].created_at);
    return Math.ceil((lastDate - firstDate) / (24 * 60 * 60 * 1000));
  }

  getScheduleCost(schedule) {
    const costs = {
      twice_daily: 80,
      daily: 50,
      every_other_day: 30,
      weekly: 20
    };
    return costs[schedule] || 50;
  }

  calculateUserEngagement(historicalData) {
    const uniqueUsers = new Set(historicalData.map(event => event.user_id)).size;
    return uniqueUsers / Math.max(1, historicalData.length) * 100;
  }

  calculateUsageIntensity(historicalData) {
    const dailyAvg = this.calculateDailyAverage(historicalData);
    const capacity = 100; // Assume 100kg capacity
    return Math.min(1, dailyAvg / capacity);
  }

  calculateContaminationRate(historicalData) {
    const lowPurityEvents = historicalData.filter(event => (event.purity_score || 0.85) < 0.7);
    return lowPurityEvents.length / historicalData.length;
  }

  /**
   * Get default predictions when no data is available
   * @param {string} binId - Bin ID
   * @returns {Object} Default predictions
   */
  getDefaultPredictions(binId) {
    return {
      bin_id: binId,
      generated_at: new Date().toISOString(),
      horizons: {
        capacity: {
          short: { predicted_capacity_kg: 25, confidence: 0.5 },
          medium: { predicted_capacity_kg: 175, confidence: 0.4 },
          long: { predicted_capacity_kg: 750, confidence: 0.3 }
        },
        usage: {
          next_24h: { expected_events: 5, confidence: 0.5 },
          next_week: { expected_events: 35, confidence: 0.4 },
          next_month: { expected_events: 150, confidence: 0.3 }
        }
      },
      ai_insights: {
        peak_usage_times: ['14:00-16:00', '18:00-20:00'],
        optimization_suggestions: ['Monitor usage patterns', 'Implement user education'],
        risk_factors: ['Limited historical data']
      }
    };
  }
}

module.exports = new PredictiveAnalytics();
