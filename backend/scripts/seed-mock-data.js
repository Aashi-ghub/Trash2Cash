require('dotenv').config();
const db = require('../src/config/database');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

const seed = async () => {
  try {
    const client = db.getAdminClient();

    // 1. Clear existing data
    console.log("Clearing existing data...");
    await client.from('anomalies').delete().neq('id', uuidv4());
    await client.from('ai_insights').delete().neq('id', uuidv4());
    await client.from('rewards_ledger').delete().neq('id', uuidv4());
    await client.from('badges_ledger').delete().neq('id', uuidv4());
    await client.from('bin_events').delete().neq('id', uuidv4());
    await client.from('bins').delete().neq('bin_id', uuidv4());
    await client.from('users').delete().neq('user_id', uuidv4());
    console.log("Cleared existing data.");

    // 2. Seed users
    const users = [
      { username: 'host1', email: 'host1@example.com', password: 'password123', role: 'host' },
      { username: 'host2', email: 'host2@example.com', password: 'password456', role: 'host' },
    ];

    const createdUsers = [];
    for (const user of users) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      const { data, error } = await client
        .from('users')
        .insert({
          username: user.username,
          email: user.email,
          password_hash: hashedPassword,
          role: user.role
        })
        .select('user_id, username')
        .single();

      if (error) throw error;
      createdUsers.push(data);
      console.log(`Created user: ${data.username}`);
    }

    // 3. Seed bins (location simplified to JSON lat/lng)
    const bins = [
      { user_id: createdUsers[0].user_id, bin_code: 'BIN-' + uuidv4().slice(0, 8), location: 'New York', status: 'active' },
      { user_id: createdUsers[1].user_id, bin_code: 'BIN-' + uuidv4().slice(0, 8), location: 'Los Angeles', status: 'active' },
      { user_id: createdUsers[1].user_id, bin_code: 'BIN-' + uuidv4().slice(0, 8), location: 'Chicago', status: 'inactive' }
    ];

    const createdBins = [];
    for (const bin of bins) {
      const { data, error } = await client
        .from('bins')
        .insert(bin)
        .select('bin_id')
        .single();

      if (error) throw error;
      createdBins.push(data);
      console.log(`Created bin with id: ${data.bin_id}`);
    }

    // 4. Seed bin_events
    const bin_events = [];
    const eventTypes = ['deposit', 'collection', 'maintenance'];
    const materialTypes = ['plastic', 'glass', 'metal', 'organic'];

    for (let i = 0; i < 50; i++) { // keep it light for dev
      const bin = createdBins[Math.floor(Math.random() * createdBins.length)];
      bin_events.push({
        bin_id: bin.bin_id,
        timestamp_utc: new Date().toISOString(),
        fill_level_pct: Math.floor(Math.random() * 101),
        weight_kg_total: (Math.random() * 10).toFixed(2),
        payload_json: {
            event_type: eventTypes[Math.floor(Math.random() * eventTypes.length)],
            material: materialTypes[Math.floor(Math.random() * materialTypes.length)],
            purity_score: Math.random().toFixed(2),
        }
      });
    }

    const { data: createdEvents, error: eventError } = await client.from('bin_events').insert(bin_events).select();
    if (eventError) throw eventError;
    console.log(`Created ${createdEvents.length} events.`);

    // 5. Seed AI Insights and Anomalies
    const insights = [];
    const anomalies = [];
    for (const event of createdEvents) {
      const isAnomaly = Math.random() < 0.1; // 10% chance of being an anomaly
      const insight = {
        event_id: event.id,
        purity_score: Math.random(),
        anomaly_detected: isAnomaly,
        raw_response: { detail: 'Mocked AI analysis' }
      };
      insights.push(insight);

      if (isAnomaly) {
        anomalies.push({
          bin_id: event.bin_id,
          event_id: event.id,
          anomaly_type: 'contamination',
          severity: 'high',
          description: 'High contamination detected in bin.'
        });
      }
    }

    const { error: insightError } = await client.from('ai_insights').insert(insights);
    if (insightError) throw insightError;
    console.log(`Created ${insights.length} AI insights.`);

    if (anomalies.length > 0) {
      const { error: anomalyError } = await client.from('anomalies').insert(anomalies);
      if (anomalyError) throw anomalyError;
      console.log(`Created ${anomalies.length} anomalies.`);
    }

    console.log("✅ Database seeded successfully!");
  } catch (err) {
    console.error("Error seeding database:", err);
  }
};

seed();