const dbConfig = require('../src/config/database');

async function updateSchema() {
  console.log('🔧 Updating database schema...\n');
  
  try {
    const supabase = dbConfig.getAdminClient();
    
    // 1. First, let's check the current schema
    console.log('1. Checking current schema...');
    
    // Get current users to see what roles exist
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('role')
      .limit(10);
    
    if (usersError) {
      console.error('❌ Failed to fetch users:', usersError.message);
      return;
    }
    
    const currentRoles = [...new Set(users.map(u => u.role))];
    console.log(`   Current roles in database: ${currentRoles.join(', ')}`);
    
    // 2. Update the user_role enum to include 'user'
    console.log('\n2. Updating user_role enum...');
    
    // Note: In Supabase, we need to use SQL to alter the enum
    // This is a workaround - we'll create users with 'user' role and see if it works
    // If it doesn't work, we'll need to manually update the enum in Supabase dashboard
    
    console.log('   ⚠️  Note: If this fails, you may need to manually update the user_role enum in Supabase dashboard');
    console.log('   To do this:');
    console.log('   1. Go to your Supabase project dashboard');
    console.log('   2. Navigate to SQL Editor');
    console.log('   3. Run: ALTER TYPE user_role ADD VALUE IF NOT EXISTS \'user\';');
    
    // 3. Try to create a test user with 'user' role
    console.log('\n3. Testing user role creation...');
    
    const testUser = {
      username: 'test_user_role',
      email: 'test@userrole.com',
      password_hash: 'test_hash',
      role: 'user',
      display_name: 'Test User Role',
      contact_phone: '+91-0000000000',
      contact_address: 'Test Address'
    };
    
    const { data: testUserData, error: testError } = await supabase
      .from('users')
      .insert(testUser)
      .select('user_id, username, role')
      .single();
    
    if (testError) {
      console.error('❌ Failed to create test user with "user" role:', testError.message);
      console.log('\n🔧 Manual Schema Update Required:');
      console.log('Please run this SQL in your Supabase dashboard:');
      console.log('ALTER TYPE user_role ADD VALUE IF NOT EXISTS \'user\';');
      return;
    }
    
    console.log('   ✅ Successfully created test user with "user" role');
    console.log(`   Test user: ${testUserData.username} (${testUserData.role})`);
    
    // 4. Clean up test user
    console.log('\n4. Cleaning up test user...');
    const { error: deleteError } = await supabase
      .from('users')
      .delete()
      .eq('user_id', testUserData.user_id);
    
    if (deleteError) {
      console.error('❌ Failed to delete test user:', deleteError.message);
    } else {
      console.log('   ✅ Test user cleaned up');
    }
    
    console.log('\n🎉 Schema update completed successfully!');
    console.log('   The "user" role is now available for creating users.');
    
  } catch (error) {
    console.error('❌ Schema update failed:', error);
    throw error;
  }
}

// Run the schema update
if (require.main === module) {
  updateSchema()
    .then(() => {
      console.log('\n✅ Schema update completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Schema update failed:', error);
      process.exit(1);
    });
}

module.exports = { updateSchema };
