# 🚀 Quick Start Guide - Smart Bin API (Existing Supabase)

## Prerequisites
- Node.js installed
- Existing Supabase project and credentials

## Step 1: Setup Environment

1. Copy env template and fill values
```bash
cp env.example .env
```

2. Fill `.env`
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

## Step 2: Install Dependencies
```bash
npm install
```

## Step 3: Database
- Using your existing schema (no migrations applied by this repo)
- Tables aligned: `profiles`, `bins (id, bin_code, owner_user_id, location)`, `bin_events`
- For RLS and extensions examples, see `MANUAL_SCHEMA_SETUP.md`

## Step 4: Start the Server
```bash
npm run dev
```
Server: `http://localhost:3000`

## Step 5: Test Options

### Option A: Automated Tests
```bash
node test-with-existing-data.js
```

### Option B: Postman
- Import `Smart_Bin_API.postman_collection.json`
- Environment variables:
  - `base_url`: `http://localhost:3000`
  - `bin_id`, `event_id`, `user_id` (populate after first calls or from test script)

## Step 6: Manual API Examples

### Health Check
```bash
curl http://localhost:3000/health
```

### Admin-Create User (via Supabase Auth Admin)
```bash
curl -X POST http://localhost:3000/api/users/admin-create \
  -H "Content-Type: application/json" \
  -d '{
    "email": "new.user@example.com",
    "password": "StrongPassw0rd!",
    "role": "host",
    "display_name": "New Test User"
  }'
```

### Create Bin (matches existing schema)
```bash
curl -X POST http://localhost:3000/api/bins \
  -H "Content-Type: application/json" \
  -d '{
    "bin_code": "BIN-300",
    "owner_user_id": "<USER_UUID>",
    "location": "City"
  }'
```

### Create Event (integer percentages + payload_json)
```bash
curl -X POST http://localhost:3000/api/events \
  -H "Content-Type: application/json" \
  -d '{
    "bin_id": "<BIN_UUID>",
    "bin_code": "BIN-300",
    "location": "City",
    "timestamp_utc": "2025-08-27T12:00:00Z",
    "fill_level_pct": 60,
    "weight_kg_total": 25.5,
    "weight_kg_delta": 2.3,
    "battery_pct": 85,
    "ai_model_id": "model-v1.0",
    "ai_confidence_avg": 0.89,
    "payload_json": { "device_id": "DEVICE-001" },
    "hv_count": 5,
    "lv_count": 2,
    "org_count": 1
  }'
```

## Step 7: Inspect Data
```bash
npm run fetch-data
```

## Key Endpoints
- GET /health
- GET /api/users
- POST /api/users/admin-create
- GET /api/bins
- POST /api/bins
- GET /api/events
- POST /api/events
- POST /api/events/bulk

Note: `GET /api/bins/:id/stats` depends on a view (`bin_summary_stats`) that is not present in your current DB — skip for now.

## Troubleshooting
- Connection errors: check `.env` keys and Supabase project
- Validation errors: ensure payload matches examples (integer percentages)
- User creation: use `/api/users/admin-create` (Auth Admin API)

You're ready to build and test with your existing Supabase data! ✅ 