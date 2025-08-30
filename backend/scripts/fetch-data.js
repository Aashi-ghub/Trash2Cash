require('dotenv').config();
const logger = require('../src/config/logger');
const dbConfig = require('../src/config/database');

async function fetchData() {
  try {
    logger.info('Fetching data from Supabase...');
    
    const adminClient = dbConfig.getAdminClient();
    
    // Fetch users
    logger.info('\n=== USERS ===');
    const { data: users, error: usersError } = await adminClient
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (usersError) {
      logger.error('Error fetching users:', usersError);
    } else {
      logger.info(`Found ${users.length} users:`);
      users.forEach(user => {
        logger.info(`- ${user.email} (${user.role}) - ${user.display_name}`);
      });
    }
    
    // Fetch bins
    logger.info('\n=== BINS ===');
    const { data: bins, error: binsError } = await adminClient
      .from('bins')
      .select(`
        *,
        users (
          email,
          display_name,
          role
        )
      `)
      .order('created_at', { ascending: false });
    
    if (binsError) {
      logger.error('Error fetching bins:', binsError);
    } else {
      logger.info(`Found ${bins.length} bins:`);
      bins.forEach(bin => {
        logger.info(`- ${bin.bin_code}: ${bin.location} (${bin.status}) - Owner: ${bin.users?.display_name || 'Unknown'}`);
      });
    }
    
    // Fetch events
    logger.info('\n=== EVENTS ===');
    const { data: events, error: eventsError } = await adminClient
      .from('bin_events')
      .select(`
        id,
        bin_id,
        timestamp_utc,
        hv_count,
        lv_count,
        org_count,
        battery_pct,
        fill_level_pct,
        weight_kg_total,
        bins (
          bin_code,
          location
        )
      `)
      .order('timestamp_utc', { ascending: false })
      .limit(10);
    
    if (eventsError) {
      logger.error('Error fetching events:', eventsError);
    } else {
      logger.info(`Found ${events.length} recent events (showing latest 10):`);
      events.forEach(event => {
        logger.info(`- Event ${event.id}: Bin ${event.bins?.bin_code || event.bin_id} at ${event.timestamp_utc}`);
        logger.info(`  HV: ${event.hv_count}, LV: ${event.lv_count}, Org: ${event.org_count}`);
        logger.info(`  Battery: ${event.battery_pct}%, Fill: ${event.fill_level_pct}%, Weight: ${event.weight_kg_total}kg`);
      });
    }
    
    // Fetch summary statistics
    logger.info('\n=== SUMMARY STATISTICS ===');
    const { data: stats, error: statsError } = await adminClient
      .from('bin_summary_stats')
      .select('*')
      .order('total_events', { ascending: false });
    
    if (statsError) {
      logger.error('Error fetching statistics:', statsError);
    } else {
      logger.info(`Found ${stats.length} bin statistics:`);
      stats.forEach(stat => {
        logger.info(`- ${stat.bin_code}: ${stat.total_events} events, Avg Fill: ${stat.avg_fill_level?.toFixed(1)}%, Avg Battery: ${stat.avg_battery_level?.toFixed(1)}%`);
        logger.info(`  Last Event: ${stat.last_event_time}, Total Weight: ${stat.total_weight_processed?.toFixed(2)}kg`);
      });
    }
    
    // Database connection test
    logger.info('\n=== DATABASE CONNECTION TEST ===');
    const isConnected = await dbConfig.testConnection();
    if (isConnected) {
      logger.info('✅ Database connection: SUCCESS');
    } else {
      logger.error('❌ Database connection: FAILED');
    }
    
    // Configuration info
    logger.info('\n=== CONFIGURATION INFO ===');
    const config = dbConfig.getConfig();
    logger.info(`Database URL: ${config.url ? 'Configured' : 'Missing'}`);
    logger.info(`Region: ${config.region}`);
    logger.info(`Pool Size: ${config.poolSize}`);
    logger.info(`Service Role Key: ${config.hasServiceRole ? '✅ Configured' : '❌ Missing'}`);
    logger.info(`Anon Key: ${config.hasAnonKey ? '✅ Configured' : '❌ Missing'}`);
    
    // Count totals
    logger.info('\n=== DATA COUNTS ===');
    const { count: userCount } = await adminClient.from('users').select('*', { count: 'exact', head: true });
    const { count: binCount } = await adminClient.from('bins').select('*', { count: 'exact', head: true });
    const { count: eventCount } = await adminClient.from('bin_events').select('*', { count: 'exact', head: true });
    
    logger.info(`Total Users: ${userCount || 0}`);
    logger.info(`Total Bins: ${binCount || 0}`);
    logger.info(`Total Events: ${eventCount || 0}`);
    
    // Recent activity
    logger.info('\n=== RECENT ACTIVITY ===');
    const { data: recentEvents } = await adminClient
      .from('bin_events')
      .select('timestamp_utc, bins(bin_code)')
      .order('timestamp_utc', { ascending: false })
      .limit(5);
    
    if (recentEvents && recentEvents.length > 0) {
      logger.info('Latest 5 events:');
      recentEvents.forEach(event => {
        logger.info(`- ${event.timestamp_utc} - Bin ${event.bins?.bin_code || 'Unknown'}`);
      });
    } else {
      logger.info('No recent events found');
    }
    
    logger.info('\n=== FETCH COMPLETE ===');
    
  } catch (error) {
    logger.error('Error fetching data:', error);
    process.exit(1);
  }
}

// Run fetch if called directly
if (require.main === module) {
  fetchData();
}

module.exports = fetchData; 