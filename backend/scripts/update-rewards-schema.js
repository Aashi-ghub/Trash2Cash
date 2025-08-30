const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function updateRewardsSchema() {
  console.log('🔧 Updating rewards_ledger schema...');

  try {
    // First, let's check the current structure
    const { data: tableInfo, error: infoError } = await supabase
      .from('information_schema.columns')
      .select('column_name, is_nullable, data_type')
      .eq('table_name', 'rewards_ledger')
      .eq('column_name', 'event_id');

    if (infoError) {
      console.error('❌ Error checking table structure:', infoError);
      return;
    }

    console.log('📋 Current event_id column info:', tableInfo);

    // Since we can't easily modify the schema through Supabase client,
    // let's modify the backend code to handle this differently
    console.log('⚠️  Schema modification requires manual database update');
    console.log('📝 Please run the following SQL in your database:');
    console.log('');
    console.log('-- Drop the existing foreign key constraint');
    console.log('ALTER TABLE rewards_ledger DROP CONSTRAINT IF EXISTS rewards_ledger_event_id_fkey;');
    console.log('');
    console.log('-- Make event_id nullable');
    console.log('ALTER TABLE rewards_ledger ALTER COLUMN event_id DROP NOT NULL;');
    console.log('');
    console.log('-- Re-add the foreign key constraint (now allowing nulls)');
    console.log('ALTER TABLE rewards_ledger ADD CONSTRAINT rewards_ledger_event_id_fkey FOREIGN KEY (event_id) REFERENCES bin_events(id) ON DELETE CASCADE;');
    console.log('');

    // For now, let's test if the current backend code works with a workaround
    console.log('🧪 Testing reward redemption with current setup...');
    
    // Try to create a test redemption entry
    const { data: testRedemption, error: testError } = await supabase
      .from('rewards_ledger')
      .insert({
        user_id: '00000000-0000-0000-0000-000000000000', // Dummy UUID
        event_id: null,
        points_earned: -100,
        reason: 'Test redemption',
      })
      .select()
      .single();

    if (testError) {
      console.log('❌ Test failed - schema update needed:', testError.message);
      console.log('💡 The backend will need the schema update to work properly');
    } else {
      console.log('✅ Test successful - schema already supports null event_id');
      // Clean up test data
      await supabase
        .from('rewards_ledger')
        .delete()
        .eq('reason', 'Test redemption');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Run the update
updateRewardsSchema();
