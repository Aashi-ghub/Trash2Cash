// Entry point for Render deployment
// This file ensures Render can find and start the server

const path = require('path');
const serverPath = path.join(__dirname, 'src', 'server.js');

// Import and start the server
require(serverPath);
