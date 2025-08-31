require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const logger = require('./config/logger');
const dbConfig = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  logger.http(`${req.method} ${req.path} - ${req.ip}`);
  next();
});

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    const dbConnected = await dbConfig.testConnection();
    const dbConfigInfo = dbConfig.getConfig();
    
    const healthStatus = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      database: {
        connected: dbConnected,
        region: dbConfigInfo.region,
        poolSize: dbConfigInfo.poolSize,
        hasServiceRole: dbConfigInfo.hasServiceRole,
        hasAnonKey: dbConfigInfo.hasAnonKey
      },
      version: '1.0.0'
    };

    const statusCode = dbConnected ? 200 : 503;
    res.status(statusCode).json(healthStatus);
    
    if (dbConnected) {
      logger.info('Health check passed - Database connected successfully');
    } else {
      logger.error('Health check failed - Database connection issue');
    }
  } catch (error) {
    logger.error('Health check error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Health check failed',
      error: error.message
    });
  }
});

// API routes
app.use('/api/users', require('./routes/users'));
app.use('/api/bins', require('./routes/bins'));
app.use('/api/events', require('./routes/events'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/device-keys', require('./routes/deviceKeys'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/ai-analytics', require('./routes/ai-analytics'));
app.use('/api/ai-notifications', require('./routes/ai-notifications'));

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found',
    path: req.originalUrl
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  logger.error('Unhandled error:', error);
  res.status(500).json({
    status: 'error',
    message: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { error: error.message })
  });
});

// Start server
app.listen(PORT, () => {
  logger.info(`Smart Bin Backend server running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`Health check available at: http://localhost:${PORT}/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

module.exports = app; 