// Debug script to check user data
console.log('🔍 Debugging user data...');

if (typeof window !== 'undefined') {
  // Check localStorage
  const token = localStorage.getItem('trash2cash_token');
  const userStr = localStorage.getItem('trash2cash_user');
  
  console.log('📋 Current localStorage data:');
  console.log(`   Token: ${token ? 'Present' : 'Missing'}`);
  console.log(`   User data: ${userStr ? 'Present' : 'Missing'}`);
  
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      console.log('👤 User data from localStorage:');
      console.log(`   ID: ${user.id}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Name: ${user.name}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Points: ${user.points}`);
    } catch (error) {
      console.log('❌ Failed to parse user data:', error);
    }
  }
  
  // Clear all auth data
  console.log('\n🧹 Clearing all auth data...');
  localStorage.removeItem('trash2cash_token');
  localStorage.removeItem('trash2cash_user');
  localStorage.removeItem('dashboardRole');
  
  console.log('✅ Auth data cleared!');
  console.log('🔄 Please refresh the page and login again.');
  
} else {
  console.log('❌ This script must be run in a browser environment');
}

console.log('\n📋 Instructions:');
console.log('1. Run this script in browser console');
console.log('2. Refresh the page');
console.log('3. Login with test@gmail.com / password123');
console.log('4. Check if the profile shows correct email');
