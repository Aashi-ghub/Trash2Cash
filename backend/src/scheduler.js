const cron = require('node-cron');
const { aggregateDailyMetrics } = require('./analytics/metrics');
const { generateAndStoreInsights } = require('./analytics/insights');
const { detectAndStoreAnomalies } = require('./analytics/anomalies');
const { calculateAndStoreRewards } = require('./analytics/rewards');

/**
 * Initializes the cron jobs for the application.
 */
const initScheduledJobs = () => {
  // Schedule the daily metrics aggregation to run every day at midnight.
  cron.schedule('0 0 * * *', () => {
    console.log('Running daily metrics aggregation job...');
    aggregateDailyMetrics();
  }, {
    scheduled: true,
    timezone: "UTC"
  });

  // Schedule the AI insights generation to run every 5 minutes.
  cron.schedule('*/5 * * * *', () => {
    console.log('Running AI insights generation job...');
    generateAndStoreInsights();
  }, {
    scheduled: true,
    timezone: "UTC"
  });

  // Schedule the anomaly detection to run every 10 minutes.
  cron.schedule('*/10 * * * *', () => {
    console.log('Running anomaly detection job...');
    detectAndStoreAnomalies();
  }, {
    scheduled: true,
    timezone: "UTC"
  });

  // Schedule the rewards calculation to run every 15 minutes.
  cron.schedule('*/15 * * * *', () => {
    console.log('Running rewards calculation job...');
    calculateAndStoreRewards();
  }, {
    scheduled: true,
    timezone: "UTC"
  });

  console.log('Cron jobs initialized.');
};

module.exports = { initScheduledJobs };
