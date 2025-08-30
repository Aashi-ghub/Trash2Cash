require('dotenv').config();
const logger = require('./src/config/logger');
const dbConfig = require('./src/config/database');

async function analyzeExistingData() {
  try {
    logger.info('🔍 Analyzing existing Supabase data structure...\n');
    
    const adminClient = dbConfig.getAdminClient();
    
    // 1. Check what tables exist
    logger.info('=== DATABASE STRUCTURE ANALYSIS ===');
    
    // Try to get table information
    try {
      const { data: tables, error } = await adminClient
        .from('information_schema.tables')
        .select('table_name, table_type')
        .eq('table_schema', 'public');
      
      if (error) {
        logger.warn('Could not fetch table list, trying alternative approach...');
      } else {
        logger.info('📋 Available tables:');
        tables.forEach(table => {
          logger.info(`- ${table.table_name} (${table.table_type})`);
        });
      }
    } catch (err) {
      logger.warn('Could not access information_schema, proceeding with direct table checks...');
    }
    
    // 2. Check for bins table
    logger.info('\n=== BINS ANALYSIS ===');
    try {
      const { data: bins, error } = await adminClient
        .from('bins')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        logger.error('Error fetching bins:', error.message);
      } else {
        logger.info(`✅ Found ${bins.length} bins:`);
        bins.forEach((bin, index) => {
          logger.info(`${index + 1}. Bin Code: ${bin.bin_code || 'N/A'}`);
          logger.info(`   ID: ${bin.bin_id || bin.id || 'N/A'}`);
          logger.info(`   Location: ${bin.location || 'N/A'}`);
          logger.info(`   Status: ${bin.status || 'N/A'}`);
          logger.info(`   Created: ${bin.created_at || 'N/A'}`);
          logger.info(`   User ID: ${bin.user_id || 'N/A'}`);
          logger.info('');
        });
      }
    } catch (err) {
      logger.error('Error analyzing bins:', err.message);
    }
    
    // 3. Check for events table
    logger.info('=== EVENTS ANALYSIS ===');
    try {
      const { data: events, error } = await adminClient
        .from('bin_events')
        .select('*')
        .order('timestamp_utc', { ascending: false })
        .limit(10);
      
      if (error) {
        logger.error('Error fetching events:', error.message);
      } else {
        logger.info(`✅ Found ${events.length} events:`);
        events.forEach((event, index) => {
          logger.info(`${index + 1}. Event ID: ${event.id || event.event_id || 'N/A'}`);
          logger.info(`   Bin ID: ${event.bin_id || 'N/A'}`);
          logger.info(`   Timestamp: ${event.timestamp_utc || event.created_at || 'N/A'}`);
          logger.info(`   HV Count: ${event.hv_count || 'N/A'}`);
          logger.info(`   LV Count: ${event.lv_count || 'N/A'}`);
          logger.info(`   Org Count: ${event.org_count || 'N/A'}`);
          logger.info(`   Battery: ${event.battery_pct || 'N/A'}%`);
          logger.info(`   Fill Level: ${event.fill_level_pct || 'N/A'}%`);
          logger.info(`   Weight: ${event.weight_kg_total || 'N/A'}kg`);
          if (event.categories) {
            logger.info(`   Categories: ${JSON.stringify(event.categories)}`);
          }
          if (event.payload_json) {
            logger.info(`   Payload: ${JSON.stringify(event.payload_json).substring(0, 100)}...`);
          }
          logger.info('');
        });
      }
    } catch (err) {
      logger.error('Error analyzing events:', err.message);
    }
    
    // 4. Check for users table (might have different name)
    logger.info('=== USERS ANALYSIS ===');
    const possibleUserTables = ['users', 'user', 'profiles', 'auth_users'];
    
    for (const tableName of possibleUserTables) {
      try {
        const { data: users, error } = await adminClient
          .from(tableName)
          .select('*')
          .limit(5);
        
        if (!error && users && users.length > 0) {
          logger.info(`✅ Found users in table '${tableName}':`);
          users.forEach((user, index) => {
            logger.info(`${index + 1}. User ID: ${user.user_id || user.id || 'N/A'}`);
            logger.info(`   Email: ${user.email || 'N/A'}`);
            logger.info(`   Role: ${user.role || 'N/A'}`);
            logger.info(`   Name: ${user.display_name || user.name || 'N/A'}`);
            logger.info('');
          });
          break;
        }
      } catch (err) {
        // Table doesn't exist, continue to next
      }
    }
    
    // 5. Analyze data relationships
    logger.info('=== DATA RELATIONSHIPS ===');
    try {
      // Get unique bin IDs from events
      const { data: eventBins, error: eventBinsError } = await adminClient
        .from('bin_events')
        .select('bin_id')
        .limit(100);
      
      if (!eventBinsError && eventBins) {
        const uniqueBinIds = [...new Set(eventBins.map(e => e.bin_id))];
        logger.info(`📊 Events reference ${uniqueBinIds.length} unique bins:`);
        uniqueBinIds.forEach(binId => {
          logger.info(`- ${binId}`);
        });
      }
      
      // Get unique user IDs from events
      const { data: eventUsers, error: eventUsersError } = await adminClient
        .from('bin_events')
        .select('user_id')
        .limit(100);
      
      if (!eventUsersError && eventUsers) {
        const uniqueUserIds = [...new Set(eventUsers.map(e => e.user_id).filter(id => id))];
        logger.info(`👥 Events reference ${uniqueUserIds.length} unique users:`);
        uniqueUserIds.forEach(userId => {
          logger.info(`- ${userId}`);
        });
      }
    } catch (err) {
      logger.error('Error analyzing relationships:', err.message);
    }
    
    // 6. Data statistics
    logger.info('=== DATA STATISTICS ===');
    try {
      // Count events by date
      const { data: eventDates, error: eventDatesError } = await adminClient
        .from('bin_events')
        .select('timestamp_utc')
        .order('timestamp_utc', { ascending: false });
      
      if (!eventDatesError && eventDates) {
        const dates = eventDates.map(e => new Date(e.timestamp_utc).toDateString());
        const uniqueDates = [...new Set(dates)];
        logger.info(`📅 Events span ${uniqueDates.length} unique dates:`);
        uniqueDates.slice(0, 5).forEach(date => {
          const count = dates.filter(d => d === date).length;
          logger.info(`- ${date}: ${count} events`);
        });
      }
      
      // Analyze sensor data ranges
      const { data: sensorData, error: sensorDataError } = await adminClient
        .from('bin_events')
        .select('battery_pct, fill_level_pct, weight_kg_total, hv_count, lv_count, org_count');
      
      if (!sensorDataError && sensorData && sensorData.length > 0) {
        const batteryLevels = sensorData.map(e => e.battery_pct).filter(v => v != null);
        const fillLevels = sensorData.map(e => e.fill_level_pct).filter(v => v != null);
        const weights = sensorData.map(e => e.weight_kg_total).filter(v => v != null);
        
        if (batteryLevels.length > 0) {
          const avgBattery = batteryLevels.reduce((a, b) => a + b, 0) / batteryLevels.length;
          logger.info(`🔋 Average battery level: ${avgBattery.toFixed(1)}%`);
        }
        
        if (fillLevels.length > 0) {
          const avgFill = fillLevels.reduce((a, b) => a + b, 0) / fillLevels.length;
          logger.info(`📦 Average fill level: ${avgFill.toFixed(1)}%`);
        }
        
        if (weights.length > 0) {
          const totalWeight = weights.reduce((a, b) => a + b, 0);
          logger.info(`⚖️ Total weight processed: ${totalWeight.toFixed(1)}kg`);
        }
      }
    } catch (err) {
      logger.error('Error calculating statistics:', err.message);
    }
    
    logger.info('\n=== ANALYSIS COMPLETE ===');
    logger.info('💡 Recommendations:');
    logger.info('1. The data structure exists but may differ from our expected schema');
    logger.info('2. Consider creating the users table if it doesn\'t exist');
    logger.info('3. The bin_events table contains valuable sensor data');
    logger.info('4. You can start testing the API with the existing data');
    
  } catch (error) {
    logger.error('Analysis failed:', error);
  }
}

// Run analysis
analyzeExistingData(); 