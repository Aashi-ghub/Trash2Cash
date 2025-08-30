const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seedTestUserData() {
  console.log('🌱 Seeding data for test@gmail.com user...');

  try {
    // Get the test user (test@gmail.com)
    const { data: user, error: userError } = await supabase
      .from('users')
      .select()
      .eq('email', 'test@gmail.com')
      .single();

    if (userError) {
      console.error('❌ User test@gmail.com not found:', userError);
      console.log('Please make sure the user exists in the database');
      return;
    }

    console.log('✅ Found user:', user.display_name, `(${user.email})`);

    // Check if user already has bins
    const { data: existingBins, error: binsCheckError } = await supabase
      .from('bins')
      .select('bin_id')
      .eq('user_id', user.user_id);

    if (binsCheckError) {
      console.error('❌ Error checking existing bins:', binsCheckError);
      return;
    }

    let bins = existingBins;

    // Create bins if they don't exist
    if (existingBins.length === 0) {
      console.log('📦 Creating bins for user...');
      
      const newBins = [
        {
          bin_code: 'TEST001',
          user_id: user.user_id,
          location: 'Downtown Mall',
          latitude: 12.9716,
          longitude: 77.5946,
          status: 'active'
        },
        {
          bin_code: 'TEST002',
          user_id: user.user_id,
          location: 'City Park',
          latitude: 12.9789,
          longitude: 77.5917,
          status: 'active'
        },
        {
          bin_code: 'TEST003',
          user_id: user.user_id,
          location: 'Office Building',
          latitude: 12.9754,
          longitude: 77.5991,
          status: 'active'
        }
      ];

      const { data: createdBins, error: binsError } = await supabase
        .from('bins')
        .insert(newBins)
        .select();

      if (binsError) {
        console.error('❌ Error creating bins:', binsError);
        return;
      }

      bins = createdBins;
      console.log('✅ Created bins:', bins.length);
    } else {
      console.log('✅ User already has bins:', bins.length);
    }

    // Create bin events
    console.log('📊 Creating bin events...');
    const events = [];
    const now = new Date();
    
    for (let i = 0; i < 40; i++) {
      const eventTime = new Date(now.getTime() - (i * 3 * 60 * 60 * 1000)); // Each event 3 hours apart
      const binId = bins[i % bins.length].bin_id;
      
      events.push({
        bin_id: binId,
        user_id: user.user_id,
        timestamp_utc: eventTime.toISOString(),
        categories: {
          plastic: Math.floor(Math.random() * 20) + 5,
          paper: Math.floor(Math.random() * 15) + 3,
          metal: Math.floor(Math.random() * 10) + 2,
          glass: Math.floor(Math.random() * 8) + 1,
          organic: Math.floor(Math.random() * 25) + 5
        },
        payload_json: {
          sensor_data: {
            temperature: 25 + Math.random() * 10,
            humidity: 40 + Math.random() * 20
          }
        },
        hv_count: Math.floor(Math.random() * 10) + 2,
        lv_count: Math.floor(Math.random() * 20) + 5,
        org_count: Math.floor(Math.random() * 25) + 5,
        battery_pct: 60 + Math.random() * 40,
        fill_level_pct: Math.random() * 100,
        weight_kg_total: Math.random() * 60 + 15,
        weight_kg_delta: Math.random() * 10 + 2
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

    // Create rewards ledger entries
    console.log('💰 Creating rewards...');
    const rewards = [];
    for (let i = 0; i < createdEvents.length; i++) {
      const eventId = createdEvents[i].id;
      const points = Math.floor(Math.random() * 35) + 15; // 15-50 points per event
      
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

    // Create some badges
    console.log('🏆 Creating badges...');
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
      },
      {
        user_id: user.user_id,
        badge_name: 'Plastic Hero',
        description: 'Recycled 100 plastic items'
      }
    ];

    const { data: createdBadges, error: badgesError } = await supabase
      .from('badges_ledger')
      .insert(badges)
      .select();

    if (badgesError) {
      if (badgesError.code !== '23505') { // Ignore unique violations
        console.error('❌ Error creating badges:', badgesError);
      } else {
        console.log('✅ Some badges already exist');
      }
    } else {
      console.log('✅ Created badges:', createdBadges.length);
    }

    // Create AI insights for some events
    console.log('🤖 Creating AI insights...');
    const insights = [];
    for (let i = 0; i < 15; i++) {
      const eventId = createdEvents[i].id;
      insights.push({
        event_id: eventId,
        purity_score: 0.8 + Math.random() * 0.2,
        anomaly_detected: Math.random() > 0.8, // 20% chance of anomaly
        raw_response: {
          analysis: 'Sample AI analysis for test user',
          recommendations: ['Increase collection frequency', 'Check sensor calibration']
        }
      });
    }

    const { data: createdInsights, error: insightsError } = await supabase
      .from('ai_insights')
      .insert(insights)
      .select();

    if (insightsError) {
      console.error('❌ Error creating AI insights:', insightsError);
    } else {
      console.log('✅ Created AI insights:', createdInsights.length);
    }

    // Calculate total points
    const totalPoints = createdRewards.reduce((sum, reward) => sum + reward.points_earned, 0);
    
    // Get current total points
    const { data: allRewards, error: totalError } = await supabase
      .from('rewards_ledger')
      .select('points_earned')
      .eq('user_id', user.user_id);

    let grandTotal = totalPoints;
    if (!totalError && allRewards) {
      grandTotal = allRewards.reduce((sum, reward) => sum + reward.points_earned, 0);
    }

    console.log('\n🎉 Test user data seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`- User: ${user.display_name} (${user.email})`);
    console.log(`- Bins: ${bins.length}`);
    console.log(`- Events: ${createdEvents.length}`);
    console.log(`- Rewards: ${createdRewards.length}`);
    console.log(`- Badges: ${createdBadges?.length || 0}`);
    console.log(`- AI Insights: ${createdInsights?.length || 0}`);
    console.log(`- Total Points Added: ${totalPoints}`);
    console.log(`- Grand Total Points: ${grandTotal}`);

  } catch (error) {
    console.error('❌ Error seeding test user data:', error);
  }
}

// Run the seeding
seedTestUserData();
