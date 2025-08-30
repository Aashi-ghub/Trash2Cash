const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function addMorePoints() {
  console.log('💰 Adding more points to test user...');

  try {
    // Get the test user
    const { data: user, error: userError } = await supabase
      .from('users')
      .select()
      .eq('email', 'test@trash2cash.com')
      .single();

    if (userError) {
      console.error('❌ User not found:', userError);
      return;
    }

    console.log('✅ Found user:', user.display_name);

    // Get existing bins
    const { data: bins, error: binsError } = await supabase
      .from('bins')
      .select('bin_id')
      .eq('user_id', user.user_id);

    if (binsError) {
      console.error('❌ Error fetching bins:', binsError);
      return;
    }

    if (bins.length === 0) {
      console.log('❌ No bins found for user');
      return;
    }

    console.log('✅ Found bins:', bins.length);

    // Create more bin events and rewards
    const events = [];
    const rewards = [];
    const now = new Date();
    
    for (let i = 0; i < 20; i++) {
      const eventTime = new Date(now.getTime() - (i * 2 * 60 * 60 * 1000)); // Each event 2 hours apart
      const binId = bins[i % bins.length].bin_id;
      
      events.push({
        bin_id: binId,
        user_id: user.user_id,
        timestamp_utc: eventTime.toISOString(),
        categories: {
          plastic: Math.floor(Math.random() * 15) + 5,
          paper: Math.floor(Math.random() * 12) + 3,
          metal: Math.floor(Math.random() * 8) + 2,
          glass: Math.floor(Math.random() * 5) + 1,
          organic: Math.floor(Math.random() * 20) + 5
        },
        payload_json: {
          sensor_data: {
            temperature: 25 + Math.random() * 10,
            humidity: 40 + Math.random() * 20
          }
        },
        hv_count: Math.floor(Math.random() * 8) + 2,
        lv_count: Math.floor(Math.random() * 15) + 5,
        org_count: Math.floor(Math.random() * 20) + 5,
        battery_pct: 60 + Math.random() * 40,
        fill_level_pct: Math.random() * 100,
        weight_kg_total: Math.random() * 50 + 15,
        weight_kg_delta: Math.random() * 8 + 2
      });
    }

    const { data: createdEvents, error: eventsError } = await supabase
      .from('bin_events')
      .insert(events)
      .select();

    if (eventsError) {
      console.error('❌ Error creating events:', eventsError);
      return;
    }

    console.log('✅ Created events:', createdEvents.length);

    // Create rewards for these events
    for (let i = 0; i < createdEvents.length; i++) {
      const eventId = createdEvents[i].id;
      const points = Math.floor(Math.random() * 30) + 10; // 10-40 points per event
      
      rewards.push({
        user_id: user.user_id,
        event_id: eventId,
        points_earned: points,
        reason: 'Recycling activity'
      });
    }

    const { data: createdRewards, error: rewardsError } = await supabase
      .from('rewards_ledger')
      .insert(rewards)
      .select();

    if (rewardsError) {
      console.error('❌ Error creating rewards:', rewardsError);
      return;
    }

    console.log('✅ Created rewards:', createdRewards.length);

    // Calculate total points
    const totalPoints = createdRewards.reduce((sum, reward) => sum + reward.points_earned, 0);
    console.log(`💰 Added ${totalPoints} total points`);

    // Get current total points
    const { data: allRewards, error: totalError } = await supabase
      .from('rewards_ledger')
      .select('points_earned')
      .eq('user_id', user.user_id);

    if (!totalError && allRewards) {
      const grandTotal = allRewards.reduce((sum, reward) => sum + reward.points_earned, 0);
      console.log(`🎯 User now has ${grandTotal} total points`);
    }

    console.log('🎉 Successfully added more points!');

  } catch (error) {
    console.error('❌ Error adding points:', error);
  }
}

// Run the script
addMorePoints();
