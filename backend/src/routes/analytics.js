const express = require('express');
const router = express.Router();
const dbConfig = require('../config/database');
const auth = require('../middleware/auth');

/**
 * @route   GET /api/analytics/insights/:binId
 * @desc    Get AI insights for a specific bin
 * @access  Private
 */
router.get('/insights/:binId', auth, async (req, res) => {
  const { binId } = req.params;

  try {
    const supabase = dbConfig.getAdminClient();
    
    const express = require('express');
const router = express.Router();
const dbConfig = require('../config/database');
const auth = require('../middleware/auth');

/**
 * @route   GET /api/analytics/insights/:binId
 * @desc    Get AI insights for a specific bin
 * @access  Private
 */
router.get('/insights/:binId', auth, async (req, res) => {
  const { binId } = req.params;

  try {
    const supabase = dbConfig.getAdminClient();
    
    const { data: insights, error } = await supabase
      .from('ai_insights')
            .select('*, bin_events!inner(*)')
      .eq('bin_events.bin_id', binId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    if (!insights || insights.length === 0) {
      return res.status(404).json({ msg: 'No insights found for this bin.' });
    }

    res.json(insights);
  } catch (error) {
    console.error('Error fetching AI insights:', error);
    res.status(500).send('Server error');
  }
});

/**
 * @route   GET /api/analytics/anomalies/:binId
 * @desc    Get anomalies for a specific bin
 * @access  Private
 */
router.get('/anomalies/:binId', auth, async (req, res) => {
  const { binId } = req.params;

  try {
    const supabase = dbConfig.getAdminClient();
    
    const { data: anomalies, error } = await supabase
      .from('anomalies')
      .select('*')
      .eq('bin_id', binId)
      .order('detected_at', { ascending: false });

    if (error) throw error;
    
    if (!anomalies || anomalies.length === 0) {
      return res.status(404).json({ msg: 'No anomalies found for this bin.' });
    }

    res.json(anomalies);
  } catch (error) {
    console.error('Error fetching anomalies:', error);
    res.status(500).send('Server error');
  }
});

/**
 * @route   GET /api/analytics/rewards/me
 * @desc    Get rewards history for the authenticated user
 * @access  Private
 */
router.get('/rewards/me', auth, async (req, res) => {
  try {
    const supabase = dbConfig.getAdminClient();
    
    const { data: rewards, error } = await supabase
      .from('rewards_ledger')
      .select('*')
      .eq('user_id', req.auth.userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(rewards || []);
  } catch (error) {
    console.error('Error fetching user rewards:', error);
    res.status(500).send('Server error');
  }
});

/**
 * @route   GET /api/analytics/rewards/summary
 * @desc    Get a summary of rewards for the authenticated user
 * @access  Private
 */
router.get('/rewards/summary', auth, async (req, res) => {
  try {
    const supabase = dbConfig.getAdminClient();
    
    // Get rewards summary
    const { data: rewards, error: rewardsError } = await supabase
      .from('rewards_ledger')
      .select('points_earned')
      .eq('user_id', req.auth.userId);

    if (rewardsError) throw rewardsError;

    // Get badges
    const { data: badges, error: badgesError } = await supabase
      .from('badges_ledger')
      .select('badge_name, achieved_at')
      .eq('user_id', req.auth.userId)
      .order('achieved_at', { ascending: false });

    if (badgesError) throw badgesError;

    // Calculate summary
    const total_points = rewards ? rewards.reduce((sum, r) => sum + (r.points_earned || 0), 0) : 0;
    
    res.json({
      total_points,
      total_events: rewards ? rewards.length : 0,
      badges: badges || [],
    });
  } catch (error) {
    console.error('Error fetching user rewards summary:', error);
    res.status(500).send('Server error');
  }
});

/**
 * @route   GET /api/analytics/dashboard-stats/me
 * @desc    Get dashboard stats for the authenticated user
 * @access  Private
 */
router.get('/dashboard-stats/me', auth, async (req, res) => {
  try {
    const supabase = dbConfig.getAdminClient();
    
    const { data, error } = await supabase
      .from('user_dashboard_stats')
      .select('*')
      .eq('user_id', req.auth.userId)
      .single();

    if (error) throw error;
    
    if (!data) {
      return res.status(404).json({ msg: 'No dashboard stats found for this user.' });
    }

    res.json(data);
  } catch (error) {
    console.error('Error fetching user dashboard stats:', error);
    res.status(500).send('Server error');
  }
});

module.exports = router;


    if (error) throw error;
    
    if (!insights || insights.length === 0) {
      return res.status(404).json({ msg: 'No insights found for this bin.' });
    }

    res.json(insights);
  } catch (error) {
    console.error('Error fetching AI insights:', error);
    res.status(500).send('Server error');
  }
});

/**
 * @route   GET /api/analytics/anomalies/:binId
 * @desc    Get anomalies for a specific bin
 * @access  Private
 */
router.get('/anomalies/:binId', auth, async (req, res) => {
  const { binId } = req.params;

  try {
    const supabase = dbConfig.getAdminClient();
    
    const { data: anomalies, error } = await supabase
      .from('anomalies')
      .select('*')
      .eq('bin_id', binId)
      .order('detected_at', { ascending: false });

    if (error) throw error;
    
    if (!anomalies || anomalies.length === 0) {
      return res.status(404).json({ msg: 'No anomalies found for this bin.' });
    }

    res.json(anomalies);
  } catch (error) {
    console.error('Error fetching anomalies:', error);
    res.status(500).send('Server error');
  }
});

/**
 * @route   GET /api/analytics/rewards/me
 * @desc    Get rewards history for the authenticated user
 * @access  Private
 */
router.get('/rewards/me', auth, async (req, res) => {
  try {
    const supabase = dbConfig.getAdminClient();
    
    const { data: rewards, error } = await supabase
      .from('rewards_ledger')
      .select('*')
      .eq('user_id', req.auth.userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(rewards || []);
  } catch (error) {
    console.error('Error fetching user rewards:', error);
    res.status(500).send('Server error');
  }
});

/**
 * @route   GET /api/analytics/rewards/summary
 * @desc    Get a summary of rewards for the authenticated user
 * @access  Private
 */
router.get('/rewards/summary', auth, async (req, res) => {
  try {
    const supabase = dbConfig.getAdminClient();
    
    // Get rewards summary
    const { data: rewards, error: rewardsError } = await supabase
      .from('rewards_ledger')
      .select('points_earned')
      .eq('user_id', req.auth.userId);

    if (rewardsError) throw rewardsError;

    // Get badges
    const { data: badges, error: badgesError } = await supabase
      .from('badges_ledger')
      .select('badge_name, achieved_at')
      .eq('user_id', req.auth.userId)
      .order('achieved_at', { ascending: false });

    if (badgesError) throw badgesError;

    // Calculate summary
    const total_points = rewards ? rewards.reduce((sum, r) => sum + (r.points_earned || 0), 0) : 0;
    
    res.json({
      total_points,
      total_events: rewards ? rewards.length : 0,
      badges: badges || [],
    });
  } catch (error) {
    console.error('Error fetching user rewards summary:', error);
    res.status(500).send('Server error');
  }
});

module.exports = router;
