const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seedDashboardData() {
  console.log('🌱 Seeding dashboard data...');

  try {
    // Create a test user
    let { data: user, error: userError } = await supabase
      .from('users')
      .insert({
        username: 'testuser',
        email: 'test@trash2cash.com',
        password_hash: '$2b$10$dummy.hash.for.testing',
        role: 'host',
        display_name: 'Test User'
      })
      .select()
      .single();

    if (userError) {
      if (userError.code === '23505') { // Unique violation
        console.log('Test user already exists, using existing user');
        const { data: existingUser } = await supabase
          .from('users')
          .select()
          .eq('email', 'test@trash2cash.com')
          .single();
        user = existingUser;
      } else {
        throw userError;
      }
    }

    console.log('✅ Created test user:', user.user_id);

    // Create test bins
    const bins = [
      {
        bin_code: 'BIN001',
        user_id: user.user_id,
        location: 'Downtown Mall',
        latitude: 12.9716,
        longitude: 77.5946,
        status: 'active'
      },
      {
        bin_code: 'BIN002',
        user_id: user.user_id,
        location: 'City Park',
        latitude: 12.9789,
        longitude: 77.5917,
        status: 'active'
      },
      {
        bin_code: 'BIN003',
        user_id: user.user_id,
        location: 'Office Building',
        latitude: 12.9754,
        longitude: 77.5991,
        status: 'active'
      }
    ];

    const { data: createdBins, error: binsError } = await supabase
      .from('bins')
      .insert(bins)
      .select();

    if (binsError) throw binsError;
    console.log('✅ Created bins:', createdBins.length);

    // Create test bin events
    const events = [];
    const now = new Date();
    
    for (let i = 0; i < 50; i++) {
      const eventTime = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000)); // Each event 1 day apart
      const binId = createdBins[i % createdBins.length].bin_id;
      
      events.push({
        bin_id: binId,
        user_id: user.user_id,
        timestamp_utc: eventTime.toISOString(),
        categories: {
          plastic: Math.floor(Math.random() * 10) + 1,
          paper: Math.floor(Math.random() * 8) + 1,
          metal: Math.floor(Math.random() * 5) + 1,
          glass: Math.floor(Math.random() * 3) + 1,
          organic: Math.floor(Math.random() * 15) + 1
        },
        payload_json: {
          sensor_data: {
            temperature: 25 + Math.random() * 10,
            humidity: 40 + Math.random() * 20
          }
        },
        hv_count: Math.floor(Math.random() * 5) + 1,
        lv_count: Math.floor(Math.random() * 10) + 1,
        org_count: Math.floor(Math.random() * 15) + 1,
        battery_pct: 60 + Math.random() * 40,
        fill_level_pct: Math.random() * 100,
        weight_kg_total: Math.random() * 50 + 10,
        weight_kg_delta: Math.random() * 5 + 1
      });
    }

    const { data: createdEvents, error: eventsError } = await supabase
      .from('bin_events')
      .insert(events)
      .select();

    if (eventsError) throw eventsError;
    console.log('✅ Created events:', createdEvents.length);

    // Create rewards ledger entries
    const rewards = [];
    for (let i = 0; i < 30; i++) {
      const eventId = createdEvents[i].id;
      const points = Math.floor(Math.random() * 20) + 5; // 5-25 points per event
      
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

    if (rewardsError) throw rewardsError;
    console.log('✅ Created rewards:', createdRewards.length);

    // Create some badges
    const badges = [
      {
        user_id: user.user_id,
        badge_name: 'First Recycle',
        description: 'Completed your first recycling activity'
      },
      {
        user_id: user.user_id,
        badge_name: 'Eco Warrior',
        description: 'Reached 1000 points'
      },
      {
        user_id: user.user_id,
        badge_name: 'Consistent Recycler',
        description: 'Recycled for 7 consecutive days'
      }
    ];

    const { data: createdBadges, error: badgesError } = await supabase
      .from('badges_ledger')
      .insert(badges)
      .select();

    if (badgesError) {
      if (badgesError.code !== '23505') { // Ignore unique violations
        throw badgesError;
      }
      console.log('Some badges already exist');
    } else {
      console.log('✅ Created badges:', createdBadges.length);
    }

    // Create AI insights for some events
    const insights = [];
    for (let i = 0; i < 10; i++) {
      const eventId = createdEvents[i].id;
      insights.push({
        event_id: eventId,
        purity_score: 0.8 + Math.random() * 0.2,
        anomaly_detected: Math.random() > 0.8, // 20% chance of anomaly
        raw_response: {
          analysis: 'Sample AI analysis',
          recommendations: ['Increase collection frequency', 'Check sensor calibration']
        }
      });
    }

    const { data: createdInsights, error: insightsError } = await supabase
      .from('ai_insights')
      .insert(insights)
      .select();

    if (insightsError) throw insightsError;
    console.log('✅ Created AI insights:', createdInsights.length);

    // Create some anomalies
    const anomalies = [];
    for (let i = 0; i < 3; i++) {
      const insightId = createdInsights[i].id;
      const eventId = createdEvents[i].id;
      const binId = createdBins[i % createdBins.length].bin_id;
      
      anomalies.push({
        insight_id: insightId,
        event_id: eventId,
        bin_id: binId,
        anomaly_type: 'high_fill_level',
        severity: 'medium',
        details: {
          description: 'Bin fill level exceeded 90%',
          recommendation: 'Schedule collection soon'
        }
      });
    }

    const { data: createdAnomalies, error: anomaliesError } = await supabase
      .from('anomalies')
      .insert(anomalies)
      .select();

    if (anomaliesError) throw anomaliesError;
    console.log('✅ Created anomalies:', createdAnomalies.length);

    console.log('🎉 Dashboard data seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`- User: ${user.display_name} (${user.email})`);
    console.log(`- Bins: ${createdBins.length}`);
    console.log(`- Events: ${createdEvents.length}`);
    console.log(`- Rewards: ${createdRewards.length}`);
    console.log(`- Badges: ${createdBadges?.length || 0}`);
    console.log(`- AI Insights: ${createdInsights.length}`);
    console.log(`- Anomalies: ${createdAnomalies.length}`);

  } catch (error) {
    console.error('❌ Error seeding dashboard data:', error);
    process.exit(1);
  }
}

// Run the seeding
seedDashboardData();
