require('dotenv').config();
const logger = require('../src/config/logger');
const dbConfig = require('../src/config/database');

async function seedData() {
  try {
    logger.info('Starting data seeding...');
    
    const adminClient = dbConfig.getAdminClient();
    
    // Seed test users
    logger.info('Seeding test users...');
    const testUsers = [
      {
        email: 'admin@smartbin.com',
        role: 'admin',
        display_name: 'System Administrator',
        contact_phone: '+1234567890',
        contact_address: '123 Admin Street, City, State'
      },
      {
        email: 'host1@smartbin.com',
        role: 'host',
        display_name: 'John Doe',
        contact_phone: '+1234567891',
        contact_address: '456 Host Avenue, City, State'
      },
      {
        email: 'host2@smartbin.com',
        role: 'host',
        display_name: 'Jane Smith',
        contact_phone: '+1234567892',
        contact_address: '789 Host Boulevard, City, State'
      },
      {
        email: 'operator1@smartbin.com',
        role: 'operator',
        display_name: 'Mike Johnson',
        contact_phone: '+1234567893',
        contact_address: '321 Operator Road, City, State'
      },
      {
        email: 'device1@smartbin.com',
        role: 'device',
        display_name: 'Smart Bin Device 001',
        contact_phone: null,
        contact_address: null
      }
    ];
    
    const { data: users, error: usersError } = await adminClient
      .from('users')
      .insert(testUsers)
      .select('user_id, email, role, display_name');
    
    if (usersError) {
      logger.error('Error seeding users:', usersError);
      return;
    }
    
    logger.info(`Created ${users.length} test users`);
    
    // Find user IDs for reference
    const adminUser = users.find(u => u.role === 'admin');
    const host1User = users.find(u => u.email === 'host1@smartbin.com');
    const host2User = users.find(u => u.email === 'host2@smartbin.com');
    const deviceUser = users.find(u => u.role === 'device');
    
    // Seed test bins
    logger.info('Seeding test bins...');
    const testBins = [
      {
        bin_code: 'BIN001',
        user_id: host1User.user_id,
        location: 'Downtown Mall - Food Court',
        latitude: 40.7128,
        longitude: -74.0060,
        status: 'active'
      },
      {
        bin_code: 'BIN002',
        user_id: host1User.user_id,
        location: 'Downtown Mall - Entrance',
        latitude: 40.7130,
        longitude: -74.0062,
        status: 'active'
      },
      {
        bin_code: 'BIN003',
        user_id: host2User.user_id,
        location: 'Central Park - Near Fountain',
        latitude: 40.7829,
        longitude: -73.9654,
        status: 'active'
      },
      {
        bin_code: 'BIN004',
        user_id: host2User.user_id,
        location: 'Central Park - Playground Area',
        latitude: 40.7830,
        longitude: -73.9656,
        status: 'maintenance'
      },
      {
        bin_code: 'BIN005',
        user_id: host1User.user_id,
        location: 'Office Building - Lobby',
        latitude: 40.7589,
        longitude: -73.9851,
        status: 'active'
      }
    ];
    
    const { data: bins, error: binsError } = await adminClient
      .from('bins')
      .insert(testBins)
      .select('bin_id, bin_code, location, status');
    
    if (binsError) {
      logger.error('Error seeding bins:', binsError);
      return;
    }
    
    logger.info(`Created ${bins.length} test bins`);
    
    // Seed test events
    logger.info('Seeding test events...');
    const now = new Date();
    const testEvents = [];
    
    // Generate events for each bin over the last 7 days
    bins.forEach((bin, binIndex) => {
      for (let i = 0; i < 5; i++) {
        const eventTime = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000) + (binIndex * 2 * 60 * 60 * 1000));
        
        testEvents.push({
          bin_id: bin.bin_id,
          user_id: deviceUser.user_id,
          timestamp_utc: eventTime.toISOString(),
          categories: {
            plastic: Math.floor(Math.random() * 10) + 1,
            paper: Math.floor(Math.random() * 15) + 2,
            metal: Math.floor(Math.random() * 5) + 1,
            glass: Math.floor(Math.random() * 3) + 1,
            organic: Math.floor(Math.random() * 20) + 5
          },
          payload_json: {
            sensor_data: {
              temperature: 20 + Math.random() * 10,
              humidity: 40 + Math.random() * 20,
              pressure: 1013 + Math.random() * 10
            },
            device_info: {
              firmware_version: '1.2.3',
              battery_voltage: 3.7 + Math.random() * 0.3
            }
          },
          hv_count: Math.floor(Math.random() * 5) + 1,
          lv_count: Math.floor(Math.random() * 8) + 2,
          org_count: Math.floor(Math.random() * 12) + 3,
          battery_pct: 60 + Math.random() * 40,
          fill_level_pct: Math.random() * 100,
          weight_kg_total: 5 + Math.random() * 15,
          weight_kg_delta: Math.random() * 2 - 1
        });
      }
    });
    
    const { data: events, error: eventsError } = await adminClient
      .from('bin_events')
      .insert(testEvents)
      .select('id, bin_id, timestamp_utc');
    
    if (eventsError) {
      logger.error('Error seeding events:', eventsError);
      return;
    }
    
    logger.info(`Created ${events.length} test events`);
    
    // Display summary
    logger.info('Data seeding completed successfully!');
    logger.info('Summary:');
    logger.info(`- Users: ${users.length}`);
    logger.info(`- Bins: ${bins.length}`);
    logger.info(`- Events: ${events.length}`);
    
    // Display test credentials
    logger.info('\nTest Credentials:');
    logger.info('Admin User: admin@smartbin.com');
    logger.info('Host 1: host1@smartbin.com');
    logger.info('Host 2: host2@smartbin.com');
    logger.info('Operator: operator1@smartbin.com');
    logger.info('Device: device1@smartbin.com');
    
    logger.info('\nTest Bin Codes:');
    bins.forEach(bin => {
      logger.info(`- ${bin.bin_code}: ${bin.location} (${bin.status})`);
    });
    
  } catch (error) {
    logger.error('Data seeding failed:', error);
    process.exit(1);
  }
}

// Run seeding if called directly
if (require.main === module) {
  seedData();
}

module.exports = seedData; 