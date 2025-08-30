# Smart Bin Backend - Phase 1

A Node.js backend for smart waste bin management with Supabase integration, featuring user management, bin tracking, and IoT event ingestion.

## 🚀 Quick Start

### 1. Environment Setup

Copy the environment template and configure your Supabase credentials:

```bash
cp env.example .env
```

Fill in your Supabase details:
```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
PORT=3000
NODE_ENV=development
DB_REGION=us-east-1
DB_POOL_SIZE=10
LOG_LEVEL=info
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Database Setup

```bash
npm run setup-db
npm run apply-views
```

### 4. Seed Test Data

```bash
npm run seed-data
```

### 5. Start Server

```bash
npm run dev
```

The server will start on `http://localhost:3000`

## 📊 API Endpoints

### Health Check
- **GET** `/health` - Check server and database connectivity

### Users API
- **GET** `/api/users` - Get all users
- **GET** `/api/users/:userId` - Get user by ID
- **POST** `/api/users` - Create new user
- **PUT** `/api/users/:userId` - Update user
- **DELETE** `/api/users/:userId` - Delete user

### Bins API
- **GET** `/api/bins` - Get all bins
- **GET** `/api/bins/:binId` - Get bin by ID
- **GET** `/api/bins/user/:userId` - Get bins by user ID
- **POST** `/api/bins` - Create new bin
- **PUT** `/api/bins/:binId` - Update bin
- **DELETE** `/api/bins/:binId` - Delete bin
- **GET** `/api/bins/:binId/stats` - Get bin statistics

### Events API
- **GET** `/api/events` - Get all events (with pagination)
- **GET** `/api/events/:eventId` - Get event by ID
- **GET** `/api/events/bin/:binId` - Get events by bin ID
- **POST** `/api/events` - Create new event (IoT ingestion)
- **POST** `/api/events/bulk` - Bulk create events
- **PUT** `/api/events/:eventId` - Update event
- **DELETE** `/api/events/:eventId` - Delete event

### Analytics API
- **GET** `/api/analytics/insights/:binId` - Get AI insights for a specific bin
- **GET** `/api/analytics/anomalies/:binId` - Get anomalies for a specific bin
- **GET** `/api/analytics/rewards/me` - Get rewards history for the authenticated user
- **GET** `/api/analytics/rewards/summary` - Get a summary of rewards for the authenticated user
- **GET** `/api/analytics/dashboard-stats/me` - Get dashboard stats for the authenticated user

## 🧪 Postman Testing Guide

### 1. Health Check
```
GET http://localhost:3000/health
```

### 2. Create Test Users

**Create Admin User:**
```
POST http://localhost:3000/api/users
Content-Type: application/json

{
  "email": "admin@smartbin.com",
  "role": "admin",
  "display_name": "System Administrator",
  "contact_phone": "+1234567890",
  "contact_address": "123 Admin Street, City, State"
}
```

**Create Host User:**
```
POST http://localhost:3000/api/users
Content-Type: application/json

{
  "email": "host1@smartbin.com",
  "role": "host",
  "display_name": "John Doe",
  "contact_phone": "+1234567891",
  "contact_address": "456 Host Avenue, City, State"
}
```

**Create Device User:**
```
POST http://localhost:3000/api/users
Content-Type: application/json

{
  "email": "device1@smartbin.com",
  "role": "device",
  "display_name": "Smart Bin Device 001"
}
```

### 3. Get All Users
```
GET http://localhost:3000/api/users
```

### 4. Create Bins

**Create Bin (replace {host_user_id} with actual user ID):**
```
POST http://localhost:3000/api/bins
Content-Type: application/json

{
  "bin_code": "BIN001",
  "user_id": "{host_user_id}",
  "location": "Downtown Mall - Food Court",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "status": "active"
}
```

**Create Another Bin:**
```
POST http://localhost:3000/api/bins
Content-Type: application/json

{
  "bin_code": "BIN002",
  "user_id": "{host_user_id}",
  "location": "Central Park - Near Fountain",
  "latitude": 40.7829,
  "longitude": -73.9654,
  "status": "active"
}
```

### 5. Get All Bins
```
GET http://localhost:3000/api/bins
```

### 6. Create IoT Events

**Single Event (replace {bin_id} and {device_user_id} with actual IDs):**
```
POST http://localhost:3000/api/events
Content-Type: application/json

{
  "bin_id": "{bin_id}",
  "user_id": "{device_user_id}",
  "timestamp_utc": "2024-01-15T10:30:00Z",
  "categories": {
    "plastic": 5,
    "paper": 8,
    "metal": 2,
    "glass": 1,
    "organic": 12
  },
  "payload_json": {
    "sensor_data": {
      "temperature": 22.5,
      "humidity": 45.2,
      "pressure": 1013.2
    },
    "device_info": {
      "firmware_version": "1.2.3",
      "battery_voltage": 3.8
    }
  },
  "hv_count": 3,
  "lv_count": 6,
  "org_count": 8,
  "battery_pct": 85.5,
  "fill_level_pct": 65.2,
  "weight_kg_total": 12.5,
  "weight_kg_delta": 2.1
}
```

**Bulk Events:**
```
POST http://localhost:3000/api/events/bulk
Content-Type: application/json

{
  "events": [
    {
      "bin_id": "{bin_id}",
      "user_id": "{device_user_id}",
      "timestamp_utc": "2024-01-15T09:00:00Z",
      "categories": {
        "plastic": 3,
        "paper": 5,
        "metal": 1,
        "glass": 0,
        "organic": 8
      },
      "payload_json": {
        "sensor_data": {
          "temperature": 21.8,
          "humidity": 42.1,
          "pressure": 1012.8
        }
      },
      "hv_count": 2,
      "lv_count": 4,
      "org_count": 6,
      "battery_pct": 87.2,
      "fill_level_pct": 45.8,
      "weight_kg_total": 8.3,
      "weight_kg_delta": 1.5
    },
    {
      "bin_id": "{bin_id}",
      "user_id": "{device_user_id}",
      "timestamp_utc": "2024-01-15T10:00:00Z",
      "categories": {
        "plastic": 4,
        "paper": 6,
        "metal": 2,
        "glass": 1,
        "organic": 10
      },
      "payload_json": {
        "sensor_data": {
          "temperature": 22.1,
          "humidity": 43.5,
          "pressure": 1013.0
        }
      },
      "hv_count": 3,
      "lv_count": 5,
      "org_count": 7,
      "battery_pct": 86.8,
      "fill_level_pct": 55.3,
      "weight_kg_total": 10.2,
      "weight_kg_delta": 1.9
    }
  ]
}
```

### 7. Get Events

**Get All Events:**
```
GET http://localhost:3000/api/events
```

**Get Events with Pagination:**
```
GET http://localhost:3000/api/events?limit=10&offset=0
```

**Get Events by Bin:**
```
GET http://localhost:3000/api/events/bin/{bin_id}
```

**Get Events with Date Filter:**
```
GET http://localhost:3000/api/events?start_date=2024-01-15T00:00:00Z&end_date=2024-01-15T23:59:59Z
```

### 8. Get Bin Statistics
```
GET http://localhost:3000/api/bins/{bin_id}/stats
```

### 9. Update Operations

**Update User:**
```
PUT http://localhost:3000/api/users/{user_id}
Content-Type: application/json

{
  "display_name": "Updated Name",
  "contact_phone": "+1234567899"
}
```

**Update Bin:**
```
PUT http://localhost:3000/api/bins/{bin_id}
Content-Type: application/json

{
  "status": "maintenance",
  "location": "Updated Location"
}
```

**Update Event:**
```
PUT http://localhost:3000/api/events/{event_id}
Content-Type: application/json

{
  "fill_level_pct": 75.5,
  "battery_pct": 82.1
}
```

## 🔧 Utility Scripts

### Fetch All Data
```bash
npm run fetch-data
```

### Database Setup
```bash
npm run setup-db
```

### Seed Test Data
```bash
npm run seed-data
```

## 📋 Test Data Summary

After running `npm run seed-data`, you'll have:

- **5 Test Users:**
  - admin@smartbin.com (admin)
  - host1@smartbin.com (host)
  - host2@smartbin.com (host)
  - operator1@smartbin.com (operator)
  - device1@smartbin.com (device)

- **5 Test Bins:**
  - BIN001: Downtown Mall - Food Court
  - BIN002: Downtown Mall - Entrance
  - BIN003: Central Park - Near Fountain
  - BIN004: Central Park - Playground Area
  - BIN005: Office Building - Lobby

- **25 Test Events** (5 events per bin over the last 7 days)

## 🔒 Security Features

- Row Level Security (RLS) policies implemented
- Role-based access control (admin, host, operator, device)
- Input validation with Joi schemas
- Secure Supabase client configuration

## 📝 Logging

Logs are written to:
- Console (colored output)
- `logs/error.log` (error level only)
- `logs/all.log` (all levels)

## 🚨 Error Handling

All endpoints return consistent error responses:
```json
{
  "status": "error",
  "message": "Error description",
  "details": "Additional error details (in development)"
}
```

## 📊 Database Schema

- **users**: User management with roles
- **bins**: Bin information and location
- **bin_events**: IoT sensor data and waste categorization
- **bin_summary_stats**: Aggregated statistics view

## 🔄 Next Steps

This completes Phase 1 of the smart-bin backend. The system is ready for:
- IoT device integration
- Real-time data ingestion
- Dashboard development
- Analytics implementation (Phase 2) 

### Analytics API
- **GET** `/api/analytics/insights/:binId` - Get AI insights for a specific bin
- **GET** `/api/analytics/anomalies/:binId` - Get anomalies for a specific bin
- **GET** `/api/analytics/rewards/me` - Get rewards history for the authenticated user
- **GET** `/api/analytics/rewards/summary` - Get a summary of rewards for the authenticated user
- **GET** `/api/analytics/dashboard-stats/me` - Get dashboard stats for the authenticated user

## 📊 Database Schema

- **users**: User management with roles
- **bins**: Bin information and location
- **bin_events**: IoT sensor data and waste categorization
- **bin_summary_stats**: Aggregated statistics view
- **user_dashboard_stats**: Materialized view for user-specific dashboard statistics.

## 🔄 Next Steps

This completes Phase 1 and 2 of the smart-bin backend. The system is ready for:
- Frontend integration
- Real-time data ingestion
- Dashboard development

## ✨ Authors

- **Developer 1**: Backend infrastructure, user and bin management, data ingestion.
- **Developer 2**: Analytics, AI integration, rewards, and anomaly detection.