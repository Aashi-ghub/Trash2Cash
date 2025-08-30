require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const logger = require('../src/config/logger');

async function applySchema() {
  const pool = new Pool({
    connectionString: process.env.SUPABASE_URL.replace('rest/v1', 'postgresql'),
  });

  try {
    logger.info('Starting database schema setup...');
    
    const schemaPath = path.join(__dirname, '../src/database/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    logger.info('Executing database schema...');
    await pool.query(schema);
    logger.info('Database schema setup completed successfully!');

  } catch (error) {
    logger.error('Database schema setup failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

if (require.main === module) {
  applySchema();
}

module.exports = applySchema;
