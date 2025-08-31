const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function addCO2Data() {
  console.log('🌱 Adding CO2-rich data for test@gmail.com user...');

  try {
    // Get the test user
    const { data: user, error: userError } = await supabase
      .from('users')
      .select()
      .eq('email', 'test@gmail.com')
      .single();

    if (userError) {
      console.error('❌ User test@gmail.com not found:', userError);
      return;
    }

    console.log('✅ Found user:', user.display_name, `(${user.email})`);

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

    // Create diverse bin events with realistic recycling data
    console.log('📊 Creating diverse recycling events...');
    const events = [];
    const now = new Date();
    
    // Create events over the last 30 days with varying recycling amounts
    for (let i = 0; i < 60; i++) {
      const eventTime = new Date(now.getTime() - (i * 12 * 60 * 60 * 1000)); // Each event 12 hours apart
      const binId = bins[i % bins.length].bin_id;
      
      // Vary the recycling amounts to make it more realistic
      const plasticAmount = Math.floor(Math.random() * 25) + 5; // 5-30 items
      const paperAmount = Math.floor(Math.random() * 20) + 3;   // 3-23 items
      const metalAmount = Math.floor(Math.random() * 12) + 2;   // 2-14 items
      const glassAmount = Math.floor(Math.random() * 8) + 1;    // 1-9 items
      const organicAmount = Math.floor(Math.random() * 30) + 5; // 5-35 items
      
      events.push({
        bin_id: binId,
        user_id: user.user_id,
        timestamp_utc: eventTime.toISOString(),
        categories: {
          plastic: plasticAmount,
          paper: paperAmount,
          metal: metalAmount,
          glass: glassAmount,
          organic: organicAmount
        },
        payload_json: {
          sensor_data: {
            temperature: 20 + Math.random() * 15,
            humidity: 30 + Math.random() * 40
          },
          recycling_quality: 0.7 + Math.random() * 0.3 // 70-100% quality
        },
        hv_count: Math.floor(Math.random() * 15) + 3,
        lv_count: Math.floor(Math.random() * 25) + 5,
        org_count: organicAmount,
        battery_pct: 50 + Math.random() * 50,
        fill_level_pct: Math.random() * 100,
        weight_kg_total: Math.random() * 80 + 20,
        weight_kg_delta: Math.random() * 15 + 3
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

    // Create rewards for these events with varied point values
    console.log('💰 Creating varied rewards...');
    const rewards = [];
    for (let i = 0; i < createdEvents.length; i++) {
      const eventId = createdEvents[i].id;
      const event = events[i];
      
      // Calculate points based on recycling amounts (more realistic)
      const plasticPoints = event.categories.plastic * 2; // 2 points per plastic item
      const paperPoints = event.categories.paper * 1.5;   // 1.5 points per paper item
      const metalPoints = event.categories.metal * 3;     // 3 points per metal item
      const glassPoints = event.categories.glass * 2.5;   // 2.5 points per glass item
      const organicPoints = event.categories.organic * 1; // 1 point per organic item
      
      const totalPoints = Math.floor(plasticPoints + paperPoints + metalPoints + glassPoints + organicPoints);
      
      rewards.push({
        user_id: user.user_id,
        event_id: eventId,
        points_earned: totalPoints,
        reason: `Recycled ${event.categories.plastic} plastic, ${event.categories.paper} paper, ${event.categories.metal} metal, ${event.categories.glass} glass, ${event.categories.organic} organic items`
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

    // Create AI insights for some events
    console.log('🤖 Creating AI insights...');
    const insights = [];
    for (let i = 0; i < 20; i++) {
      const eventId = createdEvents[i].id;
      insights.push({
        event_id: eventId,
        purity_score: 0.75 + Math.random() * 0.25, // 75-100% purity
        anomaly_detected: Math.random() > 0.9, // 10% chance of anomaly
        raw_response: {
          analysis: 'High-quality recycling detected. Good separation of materials.',
          recommendations: ['Continue current practices', 'Consider composting for organic waste'],
          co2_impact: 'Significant CO2 reduction achieved through proper recycling'
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

    // Calculate total points and CO2 impact
    const totalPoints = createdRewards.reduce((sum, reward) => sum + reward.points_earned, 0);
    const co2Saved = totalPoints * 0.1; // 0.1 kg CO2 per point
    
    // Get current total points
    const { data: allRewards, error: totalError } = await supabase
      .from('rewards_ledger')
      .select('points_earned')
      .eq('user_id', user.user_id);

    let grandTotal = totalPoints;
    if (!totalError && allRewards) {
      grandTotal = allRewards.reduce((sum, reward) => sum + reward.points_earned, 0);
    }

    console.log('\n🎉 CO2 data addition completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`- User: ${user.display_name} (${user.email})`);
    console.log(`- New Events: ${createdEvents.length}`);
    console.log(`- New Rewards: ${createdRewards.length}`);
    console.log(`- AI Insights: ${createdInsights?.length || 0}`);
    console.log(`- Points Added: ${totalPoints}`);
    console.log(`- CO2 Saved: ${co2Saved.toFixed(1)} kg`);
    console.log(`- Grand Total Points: ${grandTotal}`);
    console.log(`- Total CO2 Impact: ${(grandTotal * 0.1).toFixed(1)} kg`);

  } catch (error) {
    console.error('❌ Error adding CO2 data:', error);
  }
}

// Run the script
addCO2Data();

