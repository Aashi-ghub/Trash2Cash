require('dotenv').config();

const { createClient } = require('@supabase/supabase-js');
const logger = require('./logger');

class DatabaseConfig {
  constructor() {
    this.supabaseUrl = process.env.SUPABASE_URL;
    this.supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
    this.supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!this.supabaseUrl || !this.supabaseServiceRoleKey) {
      throw new Error('Missing required Supabase environment variables');
    }
  }

  // Client for regular operations (with RLS)
  getClient() {
    return createClient(this.supabaseUrl, this.supabaseAnonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
  }

  // Admin client for bypassing RLS (use with caution)
  getAdminClient() {
    return createClient(this.supabaseUrl, this.supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
  }

  // Test database connectivity
  async testConnection() {
    try {
      const adminClient = this.getAdminClient();
      // Test with a simple query to check if we can connect
      const { data, error } = await adminClient
        .from('bins')
        .select('count')
        .limit(1);
      
      if (error) {
        logger.error('Database connection test failed:', error);
        return false;
      }
      
      logger.info('Database connection test successful');
      return true;
    } catch (error) {
      logger.error('Database connection test error:', error);
      return false;
    }
  }

  // Get database configuration info
  getConfig() {
    return {
      url: this.supabaseUrl,
      region: process.env.DB_REGION || 'us-east-1',
      poolSize: parseInt(process.env.DB_POOL_SIZE) || 10,
      hasServiceRole: !!this.supabaseServiceRoleKey,
      hasAnonKey: !!this.supabaseAnonKey
    };
  }
}

module.exports = new DatabaseConfig(); 