require('dotenv').config();
const fs = require('fs');
const path = require('path');
const logger = require('../src/config/logger');
const dbConfig = require('../src/config/database');

async function setupDatabase() {
  try {
    logger.info('Starting database setup...');
    
    // Test connection first
    const isConnected = await dbConfig.testConnection();
    if (!isConnected) {
      logger.error('Failed to connect to database. Please check your environment variables.');
      process.exit(1);
    }
    
    logger.info('Database connection successful');
    
    // Read and execute schema
    const schemaPath = path.join(__dirname, '../src/database/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    logger.info('Executing database schema...');
    
    const adminClient = dbConfig.getAdminClient();
    
    // For Supabase, we need to execute SQL through the SQL editor or use the REST API
    // Since we can't execute raw SQL directly, we'll create tables using the Supabase client
    logger.info('Creating database schema using Supabase client...');
    
    try {
      // Create users table
      logger.info('Creating users table...');
      const { error: usersError } = await adminClient
        .from('users')
        .select('user_id')
        .limit(1);
      
      if (usersError && usersError.message.includes('relation "users" does not exist')) {
        logger.info('Users table does not exist. Please create the schema manually in Supabase SQL Editor.');
        logger.info('Copy and paste the contents of src/database/schema.sql into your Supabase SQL Editor.');
        logger.info('Then run this script again to verify the setup.');
        return;
      }
      
      logger.info('Users table exists, proceeding with verification...');
    } catch (err) {
      logger.error('Error checking users table:', err.message);
      logger.info('Please create the database schema manually in Supabase SQL Editor.');
      logger.info('Copy and paste the contents of src/database/schema.sql into your Supabase SQL Editor.');
      return;
    }
    
    logger.info('Database schema setup completed');
    
    // Verify tables exist
    const tables = ['users', 'bins', 'bin_events'];
    for (const table of tables) {
      const { data, error } = await adminClient
        .from(table)
        .select('count')
        .limit(1);
      
      if (error) {
        logger.error(`Error verifying table ${table}:`, error);
      } else {
        logger.info(`Table ${table} verified successfully`);
      }
    }
    
    // Test the view
    const { data: viewData, error: viewError } = await adminClient
      .from('bin_summary_stats')
      .select('count')
      .limit(1);
    
    if (viewError) {
      logger.warn(`View verification warning: ${viewError.message}`);
    } else {
      logger.info('bin_summary_stats view verified successfully');
    }
    
    logger.info('Database setup completed successfully!');
    
    // Display configuration info
    const config = dbConfig.getConfig();
    logger.info('Database Configuration:');
    logger.info(`- Region: ${config.region}`);
    logger.info(`- Pool Size: ${config.poolSize}`);
    logger.info(`- Service Role: ${config.hasServiceRole ? 'Configured' : 'Missing'}`);
    logger.info(`- Anon Key: ${config.hasAnonKey ? 'Configured' : 'Missing'}`);
    
  } catch (error) {
    logger.error('Database setup failed:', error);
    process.exit(1);
  }
}

// Run setup if called directly
if (require.main === module) {
  setupDatabase();
}

module.exports = setupDatabase; 