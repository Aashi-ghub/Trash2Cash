const { pool } = require('../config/database');

/**
 * Calculates rewards for new events and updates the rewards_ledger.
 */
const calculateAndStoreRewards = async () => {
  try {
    // Fetch new events with AI insights that haven't been processed for rewards
    const newEventsForRewardsQuery = `
      SELECT
        e.id AS event_id,
        b.user_id,
        ai.purity_score
      FROM bin_events e
      JOIN ai_insights ai ON e.id = ai.event_id
      JOIN bins b ON e.bin_id = b.bin_id
      LEFT JOIN rewards_ledger rl ON e.id = rl.event_id
      WHERE rl.id IS NULL;
    `;
    const { rows: newEvents } = await pool.query(newEventsForRewardsQuery);

    if (newEvents.length === 0) {
      console.log('No new events to process for rewards.');
      return;
    }

    console.log(`Found ${newEvents.length} new events to process for rewards.`);

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      for (const event of newEvents) {
        const points_earned = Math.round(event.purity_score * 100);
        const reason = 'Purity score reward';
        const insertQuery = `
          INSERT INTO rewards_ledger (user_id, event_id, points_earned, reason)
          VALUES ($1, $2, $3, $4);
        `;
        await client.query(insertQuery, [event.user_id, event.event_id, points_earned, reason]);
      }
      await client.query('COMMIT');
      console.log(`Successfully stored ${newEvents.length} new rewards.`);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
