require('dotenv').config();
const logger = require('./src/config/logger');
const dbConfig = require('./src/config/database');

async function checkColumnNames() {
  try {
    logger.info('🔍 Checking exact column names in bins table...\n');
    
    const adminClient = dbConfig.getAdminClient();
    
    // Get a single bin record to see all column names
    const { data: bins, error } = await adminClient
      .from('bins')
      .select('*')
      .limit(1);
    
    if (error) {
      logger.error('Error fetching bins:', error);
      return;
    }
    
    if (bins && bins.length > 0) {
      const bin = bins[0];
      logger.info('📋 Column names in bins table:');
      Object.keys(bin).forEach(key => {
        logger.info(`- ${key}: ${typeof bin[key]} (${bin[key]})`);
      });
      
      logger.info('\n🔍 Key findings:');
      logger.info(`Primary key column: ${Object.keys(bin).find(k => k.includes('id') || k.includes('Id')) || 'Unknown'}`);
      logger.info(`Bin code column: ${Object.keys(bin).find(k => k.includes('code') || k.includes('Code')) || 'Unknown'}`);
      logger.info(`Location column: ${Object.keys(bin).find(k => k.includes('location') || k.includes('Location')) || 'Unknown'}`);
    }
    
  } catch (error) {
    logger.error('Analysis failed:', error);
  }
}

// Run analysis
checkColumnNames(); 