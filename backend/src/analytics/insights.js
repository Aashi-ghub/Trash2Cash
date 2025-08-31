const { pool } = require('../config/database');
const ollamaAiService = require('../services/hybridAiService');

/**
 * Fetches events that have not yet been analyzed and generates AI insights for them.
 */
const generateAndStoreInsights = async () => {
  try {
    // Fetch events that do not have a corresponding entry in ai_insights
    const newEventsQuery = `
      SELECT e.*
      FROM bin_events e
      LEFT JOIN ai_insights ai ON e.id = ai.event_id
      WHERE ai.id IS NULL;
    `;
    const { rows: newEvents } = await pool.query(newEventsQuery);

    if (newEvents.length === 0) {
      console.log('No new events to analyze.');
      return;
    }

    console.log(`Found ${newEvents.length} new events to analyze.`);

    // Process new events with Ollama AI service
    const analysis = await ollamaAiService.analyzeEvents(newEvents);

    if (!analysis || !analysis.insights) {
      throw new Error('Failed to get insights from AI service.');
    }

    const insights = analysis.insights;

    // Store the new insights in the database
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      for (const insight of insights) {
        const insertQuery = `
          INSERT INTO ai_insights (event_id, purity_score, anomaly_detected, raw_response)
          VALUES ($1, $2, $3, $4);
        `;
        await client.query(insertQuery, [
          insight.event_id,
          insight.purity_score,
          insight.anomaly_detected,
          insight, // Store the full response for detailed analysis
        ]);
      }
      await client.query('COMMIT');
      console.log(`Successfully stored ${insights.length} new insights.`);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error generating or storing AI insights:', error);
  }
};

module.exports = {
  generateAndStoreInsights,
};
