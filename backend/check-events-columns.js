require('dotenv').config();
const logger = require('./src/config/logger');
const dbConfig = require('./src/config/database');

async function checkEventsColumns() {
  try {
    logger.info('🔍 Checking exact column names in bin_events table...\n');
    
    const adminClient = dbConfig.getAdminClient();
    
    // Get a single event record to see all column names
    const { data: events, error } = await adminClient
      .from('bin_events')
      .select('*')
      .limit(1);
    
    if (error) {
      logger.error('Error fetching events:', error);
      return;
    }
    
    if (events && events.length > 0) {
      const event = events[0];
      logger.info('📋 Column names in bin_events table:');
      Object.keys(event).forEach(key => {
        logger.info(`- ${key}: ${typeof event[key]} (${event[key]})`);
      });
      
      logger.info('\n🔍 Key findings:');
      logger.info(`Primary key column: ${Object.keys(event).find(k => k === 'id') || 'Unknown'}`);
      logger.info(`Bin ID column: ${Object.keys(event).find(k => k.includes('bin')) || 'Unknown'}`);
      logger.info(`User ID column: ${Object.keys(event).find(k => k.includes('user')) || 'Unknown'}`);
    }
    
  } catch (error) {
    logger.error('Analysis failed:', error);
  }
}

// Run analysis
checkEventsColumns(); 