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
      .select('*, bin_events(bins(location))')
      .eq('user_id', req.auth.userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({
      status: 'success',
      data: rewards || []
    });
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
      .select('points_earned, created_at')
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
    
    // Calculate monthly points (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const monthly_points = rewards ? rewards
      .filter(r => new Date(r.created_at) >= thirtyDaysAgo)
      .reduce((sum, r) => sum + (r.points_earned || 0), 0) : 0;

    // Calculate CO2 saved (rough estimate: 1 point = 0.1 kg CO2)
    const co2_saved = total_points * 0.1;

    // Determine rank based on points
    let rank = 'Eco Warrior';
    let next_rank_points = 0;
    if (total_points >= 5000) {
      rank = 'Eco Master';
      next_rank_points = 0;
    } else if (total_points >= 2000) {
      rank = 'Eco Champion';
      next_rank_points = 5000 - total_points;
    } else if (total_points >= 1000) {
      rank = 'Eco Warrior';
      next_rank_points = 2000 - total_points;
    } else if (total_points >= 500) {
      rank = 'Eco Explorer';
      next_rank_points = 1000 - total_points;
    } else {
      rank = 'Eco Beginner';
      next_rank_points = 500 - total_points;
    }
    
    res.json({
      total_points,
      monthly_points,
      total_events: rewards ? rewards.length : 0,
      co2_saved: Math.round(co2_saved * 10) / 10,
      rank,
      next_rank_points,
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
    
    // Get user's bins
    const { data: bins, error: binsError } = await supabase
      .from('bins')
      .select('*')
      .eq('user_id', req.auth.userId);

    if (binsError) throw binsError;

    // Get total events for user's bins
    const { data: events, error: eventsError } = await supabase
      .from('bin_events')
      .select('*')
      .in('bin_id', bins ? bins.map(b => b.bin_id) : []);

    if (eventsError) throw eventsError;

    // Calculate stats
    const total_bins = bins ? bins.length : 0;
    const active_bins = bins ? bins.filter(b => b.status === 'active').length : 0;
    const total_collections = events ? events.length : 0;
    
    // Calculate average fill level
    const avg_fill_level = events && events.length > 0 
      ? events.reduce((sum, e) => sum + (e.fill_level_pct || 0), 0) / events.length 
      : 0;

    // Calculate revenue (mock calculation: 10 INR per event)
    const monthly_revenue = events ? events.length * 10 : 0;

    // Get top performing bin
    const top_performing_bin = bins && bins.length > 0 ? bins[0].location || 'Unknown' : 'No bins';

    res.json({
      total_bins,
      active_bins,
      total_collections,
      monthly_revenue,
      avg_fill_level: Math.round(avg_fill_level),
      top_performing_bin,
    });
  } catch (error) {
    console.error('Error fetching user dashboard stats:', error);
    res.status(500).send('Server error');
  }
});

/**
 * @route   POST /api/analytics/rewards/redeem
 * @desc    Redeem a reward (creates negative points entry)
 * @access  Private
 */
router.post('/rewards/redeem', auth, async (req, res) => {
  try {
    const { reward_name, points_cost } = req.body;

    if (!reward_name || !points_cost) {
      return res.status(400).json({ 
        status: 'error',
        message: 'Reward name and points cost are required' 
      });
    }

    const supabase = dbConfig.getAdminClient();

    // Check if user has enough points
    const { data: currentRewards, error: rewardsError } = await supabase
      .from('rewards_ledger')
      .select('points_earned')
      .eq('user_id', req.auth.userId);

    if (rewardsError) throw rewardsError;

    const currentPoints = currentRewards ? currentRewards.reduce((sum, r) => sum + (r.points_earned || 0), 0) : 0;
    
    if (currentPoints < points_cost) {
      return res.status(400).json({
        status: 'error',
        message: 'Insufficient points for redemption'
      });
    }

    // Get a recent event for the user (or create a simple redemption event)
    let eventId = null;
    const { data: recentEvents, error: eventsError } = await supabase
      .from('bin_events')
      .select('id')
      .eq('user_id', req.auth.userId)
      .order('created_at', { ascending: false })
      .limit(1);

    if (!eventsError && recentEvents && recentEvents.length > 0) {
      eventId = recentEvents[0].id;
    }

    // Create a negative points entry for redemption
    const redemptionData = {
      user_id: req.auth.userId,
      points_earned: -points_cost, // Negative points for redemption
      reason: `Redeemed: ${reward_name}`,
    };

    // Only add event_id if we have one
    if (eventId) {
      redemptionData.event_id = eventId;
    }

    const { data: redemption, error } = await supabase
      .from('rewards_ledger')
      .insert(redemptionData)
      .select()
      .single();

    if (error) {
      console.error('Database error during redemption:', error);
      throw error;
    }

    console.log('✅ Redemption successful:', {
      user_id: req.auth.userId,
      reward_name,
      points_cost,
      redemption_id: redemption.id
    });

    res.json({
      status: 'success',
      data: {
        redemption_id: redemption.id,
        reward_name,
        points_cost,
        remaining_points: currentPoints - points_cost,
      }
    });
  } catch (error) {
    console.error('Error redeeming reward:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to redeem reward: ' + error.message
    });
  }
});

module.exports = router;
