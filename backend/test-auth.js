const fetch = require('node-fetch');

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

async function testAuth() {
  console.log('Testing authentication endpoints...\n');

  // Test health endpoint
  try {
    console.log('1. Testing health endpoint...');
    const healthResponse = await fetch(`${API_BASE_URL}/health`);
    const healthData = await healthResponse.json();
    console.log('Health Status:', healthResponse.status);
    console.log('Health Data:', JSON.stringify(healthData, null, 2));
    console.log('');
  } catch (error) {
    console.error('Health check failed:', error.message);
  }

  // Test register endpoint
  try {
    console.log('2. Testing register endpoint...');
    const registerResponse = await fetch(`${API_BASE_URL}/api/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        role: 'user'
      })
    });
    
    const registerData = await registerResponse.json();
    console.log('Register Status:', registerResponse.status);
    console.log('Register Data:', JSON.stringify(registerData, null, 2));
    console.log('');
  } catch (error) {
    console.error('Register test failed:', error.message);
  }

  // Test login endpoint
  try {
    console.log('3. Testing login endpoint...');
    const loginResponse = await fetch(`${API_BASE_URL}/api/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      })
    });
    
    const loginData = await loginResponse.json();
    console.log('Login Status:', loginResponse.status);
    console.log('Login Data:', JSON.stringify(loginData, null, 2));
    console.log('');
  } catch (error) {
    console.error('Login test failed:', error.message);
  }
}

testAuth().catch(console.error);
