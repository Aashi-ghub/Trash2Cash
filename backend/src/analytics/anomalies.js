const { pool } = require('../config/database');
const enhancedAnomalyDetection = require('./enhancedAnomalies');

/**
 * Enhanced anomaly detection with advanced algorithms
 */
const detectAndStoreAnomalies = async () => {
  try {
    console.log('🔍 Starting enhanced anomaly detection...');
    
    // Get recent events for analysis (last 7 days)
    const recentEventsQuery = `
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
      WHERE e.created_at >= NOW() - INTERVAL '7 days'
      ORDER BY e.created_at DESC
    `;
    
    const { rows: recentEvents } = await pool.query(recentEventsQuery);
    
    if (recentEvents.length === 0) {
      console.log('No recent events found for anomaly detection.');
      return;
    }

    console.log(`📊 Analyzing ${recentEvents.length} recent events for anomalies...`);

    // Group events by bin for contextual analysis
    const eventsByBin = {};
    recentEvents.forEach(event => {
      if (!eventsByBin[event.bin_id]) {
        eventsByBin[event.bin_id] = [];
      }
      eventsByBin[event.bin_id].push(event);
    });

    const allAnomalies = [];

    // Analyze each bin's events with enhanced detection
    for (const [binId, events] of Object.entries(eventsByBin)) {
      const binProfile = {
        location_type: events[0]?.location_type || 'unknown',
        capacity_kg: events[0]?.capacity_kg || 100,
        location: events[0]?.location || 'Unknown'
      };

      console.log(`🔍 Analyzing bin ${binId} with ${events.length} events...`);
      
      // Use enhanced anomaly detection
      const detectedAnomalies = await enhancedAnomalyDetection.detectAnomalies(events, binProfile);
      
      // Convert to database format
      detectedAnomalies.forEach(anomaly => {
        allAnomalies.push({
          bin_id: binId,
          event_id: events[0]?.id, // Use first event as reference
          anomaly_type: anomaly.type,
          severity: anomaly.severity,
          confidence: anomaly.confidence,
          details: JSON.stringify(anomaly.details),
          detected_at: new Date().toISOString()
        });
      });
    }

    if (allAnomalies.length === 0) {
      console.log('✅ No anomalies detected with enhanced algorithms.');
      return;
    }

    console.log(`🚨 Detected ${allAnomalies.length} anomalies with enhanced algorithms.`);

    // Store new anomalies
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      for (const anomaly of allAnomalies) {
        // Check if this anomaly is already recorded
        const existingQuery = `
          SELECT id FROM anomalies 
          WHERE bin_id = $1 AND anomaly_type = $2 AND severity = $3
          AND detected_at >= NOW() - INTERVAL '1 hour'
        `;
        const { rows: existing } = await client.query(existingQuery, [
          anomaly.bin_id, anomaly.anomaly_type, anomaly.severity
        ]);

        if (existing.length === 0) {
          const insertQuery = `
            INSERT INTO anomalies (bin_id, event_id, anomaly_type, severity, details, confidence, detected_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
          `;
          await client.query(insertQuery, [
            anomaly.bin_id,
            anomaly.event_id,
            anomaly.anomaly_type,
            anomaly.severity,
            anomaly.details,
            anomaly.confidence,
            anomaly.detected_at
          ]);
        }
      }
      
      await client.query('COMMIT');
      console.log(`✅ Successfully stored ${allAnomalies.length} new anomalies with enhanced detection.`);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('❌ Error in enhanced anomaly detection:', error);
  }
};

module.exports = {
  detectAndStoreAnomalies,
};
