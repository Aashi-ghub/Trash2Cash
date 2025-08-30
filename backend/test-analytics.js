const axios = require('axios');
const dbConfig = require('./src/config/database'); // Import database config

const API_BASE_URL = 'http://localhost:3000/api';

const login = async (email, password) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/users/login`, { email, password });
    return res.data.token;
  } catch (error) {
    console.error('Login failed:', error.response ? error.response.data : error.message);
    return null;
  }
};

const getAnalyticsData = async (token, endpoint) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/analytics${endpoint}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    console.error(`Failed to fetch ${endpoint}:`, error.response ? error.response.data : error.message);
    return null;
  }
};

const runTests = async () => {
  console.log('--- Starting Analytics API Test ---');

  // 1. Login as a mock user
  console.log('\nLogging in as host1@example.com...');
  const token = await login('host1@example.com', 'password123');
  if (!token) {
    console.error('Could not retrieve auth token. Exiting.');
    return;
  }
  console.log('Login successful. Token received.');

  // Fetch a real bin_id from the database
  console.log('\nFetching a bin ID from the database...');
  const supabase = dbConfig.getAdminClient();
  const { data: bins, error: binError } = await supabase.from('bins').select('bin_id').limit(1);

  if (binError || !bins || bins.length === 0) {
    console.error('Could not fetch a bin to test with:', binError?.message || 'No bins found.');
    return;
  }
  const binId = bins[0].bin_id;
  console.log(`Using bin_id: ${binId}`);

  // Give the schedulers a moment to run
  console.log('\nWaiting 10 seconds for schedulers to process data...');
  await new Promise(resolve => setTimeout(resolve, 10000));

  // 2. Fetch AI Insights for the bin
  console.log(`\nFetching AI insights for Bin ${binId}...`);
  const insights = await getAnalyticsData(token, `/insights/${binId}`);
  if (insights) {
    console.log('Received AI Insights:', JSON.stringify(insights.slice(0, 2), null, 2));
    console.log(`(Showing 2 of ${insights.length} insights)`);
  }

  // 3. Fetch Anomalies for the bin
  console.log(`\nFetching anomalies for Bin ${binId}...`);
  const anomalies = await getAnalyticsData(token, `/anomalies/${binId}`);
  if (anomalies) {
    console.log('Received Anomalies:', JSON.stringify(anomalies, null, 2));
  }

  // 4. Fetch user's rewards history
  console.log("\nFetching authenticated user's rewards history...");
  const rewardsHistory = await getAnalyticsData(token, '/rewards/me');
  if (rewardsHistory) {
    console.log('Received Rewards History:', JSON.stringify(rewardsHistory.slice(0, 3), null, 2));
    console.log(`(Showing 3 of ${rewardsHistory.length} rewards)`);
  }

  // 5. Fetch user's rewards summary
  console.log("\nFetching authenticated user's rewards summary...");
  const rewardsSummary = await getAnalyticsData(token, '/rewards/summary');
  if (rewardsSummary) {
    console.log('Received Rewards Summary:', JSON.stringify(rewardsSummary, null, 2));
  }

  console.log('\n--- Analytics API Test Finished ---');
};

runTests();