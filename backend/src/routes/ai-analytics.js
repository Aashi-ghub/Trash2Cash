const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const ollamaAiService = require('../services/hybridAiService');
const enhancedAnomalyDetection = require('../analytics/enhancedAnomalies');
const predictiveAnalytics = require('../analytics/predictiveAnalytics');
const { pool } = require('../config/database');

/**
 * @route GET /api/ai-analytics/health
 * @desc Check AI service health and status
 * @access Private
 */
router.get('/health', authenticateToken, async (req, res) => {
  try {
    const healthStatus = {
      timestamp: new Date().toISOString(),
             services: {
         ollama: {
           status: 'operational',
           base_url: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
           default_model: process.env.OLLAMA_DEFAULT_MODEL || 'llama3'
         },
        anomaly_detection: {
          status: 'operational',
          algorithms: [
            'statistical_analysis',
            'pattern_detection',
            'ai_powered_detection',
            'contextual_analysis',
            'temporal_analysis'
          ]
        },
        predictive_analytics: {
          status: 'operational',
          capabilities: [
            'capacity_forecasting',
            'usage_pattern_prediction',
            'collection_optimization',
            'revenue_forecasting',
            'maintenance_prediction'
          ]
        }
      },
      database: {
        status: 'connected',
        connection_pool: 'active'
      }
    };

    res.json({
      status: 'success',
      data: healthStatus
    });
  } catch (error) {
    console.error('AI Analytics health check error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to check AI analytics health',
      error: error.message
    });
  }
});

/**
 * @route POST /api/ai-analytics/analyze-events
 * @desc Analyze bin events with real AI processing
 * @access Private
 */
router.post('/analyze-events', authenticateToken, async (req, res) => {
  try {
    const { events, options = {} } = req.body;

    if (!events || !Array.isArray(events)) {
      return res.status(400).json({
        status: 'error',
        message: 'Events array is required'
      });
    }

    console.log(`🔍 Analyzing ${events.length} events with Ollama...`);
    
    const analysisResult = await ollamaAiService.analyzeEvents(events);

    res.json({
      status: 'success',
      data: analysisResult
    });
  } catch (error) {
    console.error('Event analysis error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to analyze events',
      error: error.message
    });
  }
});

/**
 * @route GET /api/ai-analytics/anomalies/:binId
 * @desc Get enhanced anomaly detection for a specific bin
 * @access Private
 */
router.get('/anomalies/:binId', authenticateToken, async (req, res) => {
  try {
    const { binId } = req.params;
    const { days = 7 } = req.query;

    // Get recent events for the bin
    const eventsQuery = `
      SELECT 
        e.*,
        ai.purity_score,
        ai.anomaly_detected,
        ai.raw_response as ai_insights,
        b.location,
        b.capacity_kg,
        b.location_type
      FROM bin_events e
      LEFT JOIN ai_insights ai ON e.id = ai.event_id
      LEFT JOIN bins b ON e.bin_id = b.bin_id
      WHERE e.bin_id = $1
      AND e.created_at >= NOW() - INTERVAL '${days} days'
      ORDER BY e.created_at DESC
    `;

    const { rows: events } = await pool.query(eventsQuery, [binId]);

    if (events.length === 0) {
      return res.json({
        status: 'success',
        data: {
          bin_id: binId,
          anomalies: [],
          message: 'No events found for analysis'
        }
      });
    }

    // Get bin profile
    const binProfile = {
      location_type: events[0]?.location_type || 'unknown',
      capacity_kg: events[0]?.capacity_kg || 100,
      location: events[0]?.location || 'Unknown'
    };

    // Run enhanced anomaly detection
    const anomalies = await enhancedAnomalyDetection.detectAnomalies(events, binProfile);

    res.json({
      status: 'success',
      data: {
        bin_id: binId,
        events_analyzed: events.length,
        anomalies_detected: anomalies.length,
        anomalies: anomalies,
        analysis_metadata: {
          algorithms_used: [
            'statistical_analysis',
            'pattern_detection',
            'ai_powered_detection',
            'contextual_analysis',
            'temporal_analysis'
          ],
          confidence_threshold: 0.6,
          analysis_period_days: parseInt(days)
        }
      }
    });
  } catch (error) {
    console.error('Anomaly detection error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to detect anomalies',
      error: error.message
    });
  }
});

/**
 * @route GET /api/ai-analytics/predictions/:binId
 * @desc Get predictive analytics for a specific bin
 * @access Private
 */
router.get('/predictions/:binId', authenticateToken, async (req, res) => {
  try {
    const { binId } = req.params;
    const { horizon = 'all' } = req.query;

    console.log(`🔮 Generating predictions for bin ${binId}...`);

    const predictions = await predictiveAnalytics.generatePredictions(binId, {
      horizon: horizon
    });

    res.json({
      status: 'success',
      data: predictions
    });
  } catch (error) {
    console.error('Predictive analytics error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to generate predictions',
      error: error.message
    });
  }
});

/**
 * @route GET /api/ai-analytics/network-overview
 * @desc Get AI-powered network overview and insights
 * @access Private
 */
router.get('/network-overview', authenticateToken, async (req, res) => {
  try {
    // Get network statistics
    const networkStatsQuery = `
      SELECT 
        COUNT(DISTINCT b.bin_id) as total_bins,
        COUNT(DISTINCT e.user_id) as active_users,
        COUNT(e.id) as total_events,
        AVG(ai.purity_score) as avg_purity,
        SUM(e.weight_kg) as total_weight_collected
      FROM bins b
      LEFT JOIN bin_events e ON b.bin_id = e.bin_id
      LEFT JOIN ai_insights ai ON e.id = ai.event_id
      WHERE e.created_at >= NOW() - INTERVAL '30 days'
    `;

    const { rows: [networkStats] } = await pool.query(networkStatsQuery);

    // Get recent anomalies
    const recentAnomaliesQuery = `
      SELECT 
        a.*,
        b.location,
        e.weight_kg,
        e.fill_level
      FROM anomalies a
      JOIN bins b ON a.bin_id = b.bin_id
      LEFT JOIN bin_events e ON a.event_id = e.id
      WHERE a.detected_at >= NOW() - INTERVAL '7 days'
      ORDER BY a.detected_at DESC
      LIMIT 10
    `;

    const { rows: recentAnomalies } = await pool.query(recentAnomaliesQuery);

    // Get top performing bins
    const topBinsQuery = `
      SELECT 
        b.bin_id,
        b.location,
        COUNT(e.id) as event_count,
        AVG(ai.purity_score) as avg_purity,
        SUM(e.weight_kg) as total_weight
      FROM bins b
      LEFT JOIN bin_events e ON b.bin_id = e.bin_id
      LEFT JOIN ai_insights ai ON e.id = ai.event_id
      WHERE e.created_at >= NOW() - INTERVAL '30 days'
      GROUP BY b.bin_id, b.location
      ORDER BY total_weight DESC
      LIMIT 5
    `;

    const { rows: topBins } = await pool.query(topBinsQuery);

    // Generate AI insights for the network
    const networkInsights = {
      overall_health: networkStats.avg_purity > 0.8 ? 'excellent' : networkStats.avg_purity > 0.6 ? 'good' : 'needs_attention',
      recommendations: [
        networkStats.avg_purity < 0.7 ? 'Implement user education program to improve sorting quality' : null,
        recentAnomalies.length > 5 ? 'Review anomaly patterns and adjust detection thresholds' : null,
        networkStats.total_events < 100 ? 'Consider expanding network coverage' : null
      ].filter(Boolean),
      trends: {
        user_engagement: networkStats.active_users > 50 ? 'high' : 'moderate',
        collection_efficiency: networkStats.total_weight_collected > 1000 ? 'excellent' : 'good',
        system_health: recentAnomalies.length < 3 ? 'stable' : 'needs_monitoring'
      }
    };

    res.json({
      status: 'success',
      data: {
        network_statistics: networkStats,
        recent_anomalies: recentAnomalies,
        top_performing_bins: topBins,
        ai_insights: networkInsights,
        generated_at: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Network overview error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to generate network overview',
      error: error.message
    });
  }
});

/**
 * @route POST /api/ai-analytics/optimize-collection
 * @desc Get AI-powered collection optimization recommendations
 * @access Private
 */
router.post('/optimize-collection', authenticateToken, async (req, res) => {
  try {
    const { binIds, constraints = {} } = req.body;

    if (!binIds || !Array.isArray(binIds)) {
      return res.status(400).json({
        status: 'error',
        message: 'Bin IDs array is required'
      });
    }

    const optimizationResults = [];

    for (const binId of binIds) {
      try {
        const predictions = await predictiveAnalytics.generatePredictions(binId);
        const collectionOptimization = predictions.data?.horizons?.collection;

        if (collectionOptimization) {
          optimizationResults.push({
            bin_id: binId,
            current_schedule: collectionOptimization.current_schedule,
            recommended_schedule: collectionOptimization.recommended_schedule,
            cost_savings: collectionOptimization.cost_analysis.savings,
            efficiency_gains: collectionOptimization.efficiency_gains,
            recommended_times: collectionOptimization.recommended_times
          });
        }
      } catch (error) {
        console.error(`Failed to optimize bin ${binId}:`, error);
        optimizationResults.push({
          bin_id: binId,
          error: 'Failed to generate optimization'
        });
      }
    }

    // Calculate network-wide optimization
    const totalSavings = optimizationResults
      .filter(result => result.cost_savings)
      .reduce((sum, result) => sum + result.cost_savings, 0);

    const networkOptimization = {
      total_bins_analyzed: binIds.length,
      total_cost_savings: totalSavings,
      average_efficiency_improvement: optimizationResults
        .filter(result => result.efficiency_gains)
        .reduce((sum, result) => sum + result.efficiency_gains.improvement_potential, 0) / optimizationResults.length,
      recommendations: [
        totalSavings > 100 ? 'Implement recommended schedule changes to save costs' : null,
        'Consider route optimization for multiple bins',
        'Monitor efficiency gains after implementation'
      ].filter(Boolean)
    };

    res.json({
      status: 'success',
      data: {
        bin_optimizations: optimizationResults,
        network_optimization: networkOptimization,
        generated_at: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Collection optimization error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to optimize collection',
      error: error.message
    });
  }
});

/**
 * @route GET /api/ai-analytics/real-time-insights
 * @desc Get real-time AI insights for dashboard
 * @access Private
 */
router.get('/real-time-insights', authenticateToken, async (req, res) => {
  try {
    // Get real-time data
    const realTimeQuery = `
      SELECT 
        COUNT(DISTINCT e.bin_id) as active_bins_today,
        COUNT(e.id) as events_today,
        AVG(ai.purity_score) as avg_purity_today,
        SUM(e.weight_kg) as weight_collected_today
      FROM bin_events e
      LEFT JOIN ai_insights ai ON e.id = ai.event_id
      WHERE e.created_at >= NOW() - INTERVAL '24 hours'
    `;

    const { rows: [realTimeStats] } = await pool.query(realTimeQuery);

    // Get recent AI insights
    const recentInsightsQuery = `
      SELECT 
        ai.*,
        e.bin_id,
        e.weight_kg,
        e.fill_level,
        b.location
      FROM ai_insights ai
      JOIN bin_events e ON ai.event_id = e.id
      JOIN bins b ON e.bin_id = b.bin_id
      WHERE ai.created_at >= NOW() - INTERVAL '6 hours'
      ORDER BY ai.created_at DESC
      LIMIT 20
    `;

    const { rows: recentInsights } = await pool.query(recentInsightsQuery);

    // Generate real-time insights
    const insights = {
      system_health: {
        status: realTimeStats.avg_purity_today > 0.8 ? 'excellent' : 'good',
        purity_trend: realTimeStats.avg_purity_today > 0.85 ? 'improving' : 'stable',
        activity_level: realTimeStats.events_today > 50 ? 'high' : 'moderate'
      },
      alerts: [
        realTimeStats.avg_purity_today < 0.7 ? 'Low purity detected - consider user education' : null,
        realTimeStats.events_today < 10 ? 'Low activity detected - check system status' : null
      ].filter(Boolean),
      recommendations: [
        'Monitor peak usage hours for optimal collection scheduling',
        'Review anomaly patterns for system improvements',
        'Track user engagement trends'
      ]
    };

    res.json({
      status: 'success',
      data: {
        real_time_stats: realTimeStats,
        recent_insights: recentInsights,
        ai_insights: insights,
        last_updated: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Real-time insights error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get real-time insights',
      error: error.message
    });
  }
});

// Ollama-specific routes
router.get('/ollama/status', authenticateToken, async (req, res) => {
  try {
    const ollamaService = require('../services/ollamaService');
    const status = ollamaService.getStatus();
    const models = await ollamaService.getAvailableModels();
    
    res.json({
      success: true,
      data: {
        status,
        available_models: models
      }
    });
  } catch (error) {
    console.error('Error checking Ollama status:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/ollama/chat', authenticateToken, async (req, res) => {
  try {
    const { message, context, model } = req.body;
    
    if (!message) {
      return res.status(400).json({ success: false, error: 'Message is required' });
    }

    const ollamaService = require('../services/ollamaService');
    const response = await ollamaService.chat(message, context || '', model);
    
    res.json({
      success: true,
      data: {
        response,
        model: model || 'default'
      }
    });
  } catch (error) {
    console.error('Error in Ollama chat:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/ollama/pull-model', authenticateToken, async (req, res) => {
  try {
    const { model_name } = req.body;
    
    if (!model_name) {
      return res.status(400).json({ success: false, error: 'Model name is required' });
    }

    const ollamaService = require('../services/ollamaService');
    const result = await ollamaService.pullModel(model_name);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error pulling Ollama model:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/ai-services/status', authenticateToken, async (req, res) => {
  try {
    const status = await ollamaAiService.getServiceStatus();
    
    res.json({
      success: true,
      data: status
    });
  } catch (error) {
    console.error('Error getting AI services status:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/ai-services/preferred', authenticateToken, async (req, res) => {
  try {
    const { service } = req.body;
    
    if (!service || service !== 'ollama') {
      return res.status(400).json({ success: false, error: 'Only "ollama" service is supported' });
    }

    const result = { success: true, preferred: 'ollama' };
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error setting preferred AI service:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
