// Debug script to check authentication state
console.log('=== Auth Debug Info ===');

// Check localStorage
const token = localStorage.getItem('trash2cash_token');
const user = localStorage.getItem('trash2cash_user');

console.log('Token exists:', !!token);
console.log('User exists:', !!user);

if (token) {
  console.log('Token (first 20 chars):', token.substring(0, 20) + '...');
}

if (user) {
  try {
    const userData = JSON.parse(user);
    console.log('User data:', userData);
  } catch (e) {
    console.log('Failed to parse user data:', e);
  }
}

// Test API call
async function testApi() {
  try {
    const response = await fetch('https://trash2cash-j8zs.onrender.com/api/users/me', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('API Response status:', response.status);
    console.log('API Response ok:', response.ok);
    
    const data = await response.text();
    console.log('API Response data:', data);
    
  } catch (error) {
    console.log('API Error:', error);
  }
}

if (token) {
  testApi();
} else {
  console.log('No token found, skipping API test');
}

