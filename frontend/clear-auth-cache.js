// Script to clear authentication cache
console.log('🧹 Clearing authentication cache...');

if (typeof window !== 'undefined') {
  // Clear localStorage
  localStorage.removeItem('trash2cash_token');
  localStorage.removeItem('trash2cash_user');
  localStorage.removeItem('dashboardRole');
  
  console.log('✅ Authentication cache cleared!');
  console.log('🔄 Please refresh the page and try logging in again.');
  console.log('');
  console.log('🔑 Use these credentials:');
  console.log('   Email: test@gmail.com');
  console.log('   Password: password123');
} else {
  console.log('❌ This script must be run in a browser environment');
}

// Instructions for manual clearing
console.log('');
console.log('📋 Manual Instructions:');
console.log('1. Open browser developer tools (F12)');
console.log('2. Go to Application/Storage tab');
console.log('3. Find Local Storage');
console.log('4. Delete all trash2cash_* items');
console.log('5. Refresh the page');
console.log('6. Try logging in with test@gmail.com / password123');
