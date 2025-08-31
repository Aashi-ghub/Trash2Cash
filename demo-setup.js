#!/usr/bin/env node

/**
 * Trash2Cash Demo Setup Script
 * 
 * This script helps set up the demo environment for hackathon judges.
 * It will:
 * 1. Check if backend is running
 * 2. Seed demo data
 * 3. Provide demo credentials
 * 4. Open the application
 */

const { exec } = require('child_process');
const http = require('http');

console.log('🚀 Trash2Cash Demo Setup');
console.log('========================\n');

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Check if backend is running
function checkBackend() {
  return new Promise((resolve) => {
    const req = http.get('https://trash2cash-j8zs.onrender.com/health', (res) => {
      if (res.statusCode === 200) {
        log('✅ Backend is running on https://trash2cash-j8zs.onrender.com', 'green');
        resolve(true);
      } else {
        log('❌ Backend responded with status: ' + res.statusCode, 'red');
        resolve(false);
      }
    });

    req.on('error', () => {
      log('❌ Backend is not running', 'red');
      resolve(false);
    });

    req.setTimeout(5000, () => {
      log('❌ Backend connection timeout', 'red');
      resolve(false);
    });
  });
}

// Seed demo data
function seedData() {
  return new Promise((resolve) => {
    log('🌱 Seeding demo data...', 'blue');
    
    exec('cd backend && npm run seed:mock', (error, stdout, stderr) => {
      if (error) {
        log('❌ Failed to seed data: ' + error.message, 'red');
        resolve(false);
        return;
      }
      
      log('✅ Demo data seeded successfully', 'green');
      resolve(true);
    });
  });
}

// Main demo setup
async function setupDemo() {
  log('🔍 Checking backend status...', 'blue');
  const backendRunning = await checkBackend();
  
  if (!backendRunning) {
    log('\n📋 To start the backend:', 'yellow');
    log('1. Open a new terminal', 'yellow');
    log('2. Run: cd backend && npm run dev', 'yellow');
    log('3. Wait for "Server running on port 3001" message', 'yellow');
    log('4. Run this script again\n', 'yellow');
    return;
  }

  log('\n🌱 Setting up demo data...', 'blue');
  const dataSeeded = await seedData();
  
  if (!dataSeeded) {
    log('❌ Failed to setup demo data', 'red');
    return;
  }

  log('\n🎉 Demo Setup Complete!', 'green');
  log('========================', 'green');
  
  log('\n📱 Demo Credentials:', 'blue');
  log('Email: test@trash2cash.com', 'yellow');
  log('Password: password123', 'yellow');
  
  log('\n🌐 Application URLs:', 'blue');
  log('Frontend: https://trash2-cash-r4vc.vercel.app/', 'yellow');
  log('Backend API: https://trash2cash-j8zs.onrender.com', 'yellow');
  log('Health Check: https://trash2cash-j8zs.onrender.com/health', 'yellow');
  
  log('\n🎯 Demo Features to Show:', 'blue');
  log('1. User Registration/Login', 'yellow');
  log('2. Dashboard with Points & Rewards', 'yellow');
  log('3. Smart Bin Management (Host Dashboard)', 'yellow');
  log('4. AI Analytics & Insights', 'yellow');
  log('5. Real-time Data Updates', 'yellow');
  
  log('\n🔧 Quick Commands:', 'blue');
  log('Start Frontend: npm run dev:frontend', 'yellow');
  log('Start Backend: npm run dev:backend', 'yellow');
  log('Seed Data: npm run seed', 'yellow');
  log('Test API: node test-dashboard-integration.js', 'yellow');
  
  log('\n🚀 Ready for demo! Open http://localhost:3000 in your browser', 'green');
}

// Run the setup
setupDemo().catch(console.error);
