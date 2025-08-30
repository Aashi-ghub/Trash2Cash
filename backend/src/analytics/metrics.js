const { pool } = require('../config/database');

/**
 * Aggregates daily event metrics for all bins.
 * This function calculates the total weight and count of events for each bin for the current day.
 * The results are stored in a new table 'daily_bin_metrics'.
 */
const aggregateDailyMetrics = async () => {
  try {
    // Ensure the daily_bin_metrics table exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS daily_bin_metrics (
        metric_date DATE NOT NULL,
        bin_id UUID NOT NULL,
        total_weight_kg NUMERIC(10, 2) DEFAULT 0,
        event_count INTEGER DEFAULT 0,
        hv_count INTEGER DEFAULT 0,
        lv_count INTEGER DEFAULT 0,
        org_count INTEGER DEFAULT 0,
        PRIMARY KEY (metric_date, bin_id),
        FOREIGN KEY (bin_id) REFERENCES bins(bin_id)
      );
    `);

    const today = new Date().toISOString().slice(0, 10);

    const aggregationQuery = `
      INSERT INTO daily_bin_metrics (metric_date, bin_id, total_weight_kg, event_count, hv_count, lv_count, org_count)
      SELECT
        CURRENT_DATE AS metric_date,
        bin_id,
        SUM(weight_kg_total) AS total_weight_kg,
        COUNT(*) AS event_count,
        SUM(hv_count) AS hv_count,
        SUM(lv_count) AS lv_count,
        SUM(org_count) AS org_count
      FROM bin_events
      WHERE timestamp_utc >= CURRENT_DATE
      GROUP BY bin_id
      ON CONFLICT (metric_date, bin_id) DO UPDATE SET
        total_weight_kg = EXCLUDED.total_weight_kg,
        event_count = EXCLUDED.event_count,
        hv_count = EXCLUDED.hv_count,
        lv_count = EXCLUDED.lv_count,
        org_count = EXCLUDED.org_count;
    `;

    await pool.query(aggregationQuery);
    console.log(`Successfully aggregated metrics for ${today}`);
  } catch (error) {
    console.error('Error aggregating daily metrics:', error);
  }
};

module.exports = {
  aggregateDailyMetrics,
};
