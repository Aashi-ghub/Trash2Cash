const { pool } = require('../config/database');

/**
 * Scans for new anomalous insights and stores them in the anomalies table.
 */
const detectAndStoreAnomalies = async () => {
  try {
    // Fetch new anomalous insights that haven't been recorded yet
    const newAnomaliesQuery = `
      SELECT
        ai.id AS insight_id,
        ai.event_id,
        e.bin_id,
        ai.purity_score,
        ai.raw_response->'anomaly_details'->>'type' AS anomaly_type,
        ai.raw_response->'anomaly_details'->>'severity' AS severity,
        ai.raw_response->'anomaly_details' AS details
      FROM ai_insights ai
      JOIN bin_events e ON ai.event_id = e.id
      LEFT JOIN anomalies a ON ai.id = a.insight_id
      WHERE (ai.anomaly_detected = TRUE OR ai.purity_score < 0.5) AND a.id IS NULL;
    `;
    const { rows: newAnomalies } = await pool.query(newAnomaliesQuery);

    if (newAnomalies.length === 0) {
      console.log('No new anomalies to record.');
      return;
    }

    console.log(`Found ${newAnomalies.length} new anomalies to record.`);

    // Store the new anomalies
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      for (const anomaly of newAnomalies) {
        const anomaly_type = anomaly.anomaly_type || 'LowPurity';
        const severity = anomaly.severity || 'medium';
        const details = anomaly.details || JSON.stringify({ message: `Purity score of ${anomaly.purity_score} is below threshold.` });

        const insertQuery = `
          INSERT INTO anomalies (insight_id, event_id, bin_id, anomaly_type, severity, details)
          VALUES ($1, $2, $3, $4, $5, $6);
        `;
        await client.query(insertQuery, [
          anomaly.insight_id,
          anomaly.event_id,
          anomaly.bin_id,
          anomaly_type,
          severity,
          details,
        ]);
      }
      await client.query('COMMIT');
      console.log(`Successfully stored ${newAnomalies.length} new anomalies.`);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error detecting or storing anomalies:', error);
  }
};

module.exports = {
  detectAndStoreAnomalies,
};
