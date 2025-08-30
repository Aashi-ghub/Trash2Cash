# Backend Deployment Guide

## Fixing Authentication on Deployed Backend

### 1. Update Deployed Code

The deployed backend needs the authentication fixes we made. You need to:

1. **Push the updated code** to your repository
2. **Redeploy** the backend on your hosting platform (Render, Heroku, etc.)

### 2. Set Environment Variables

On your deployment platform, set these environment variables:

```bash
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# JWT Configuration (CRITICAL - This was missing!)
JWT_SECRET=your_secure_jwt_secret_here

# Server Configuration
PORT=3000
NODE_ENV=production
```

### 3. Database Schema

Ensure your Supabase database has the correct `users` table:

```sql
CREATE TABLE IF NOT EXISTS users (
  user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 4. Test the Deployed Backend

After deployment, test the endpoints:

```bash
# Health check
curl https://eco-hive-network.onrender.com/health

# Test register
curl -X POST https://eco-hive-network.onrender.com/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "role": "user"
  }'
```

### 5. Switch Frontend to Use Deployed Backend

Once the deployed backend is fixed, update the frontend configuration:

```typescript
// In frontend/config/api.ts
export const API_CONFIG = {
  LOCAL: 'http://localhost:3000',
  DEPLOYED: 'https://eco-hive-network.onrender.com',
  CURRENT: 'https://eco-hive-network.onrender.com' // Change this line
};
```

## Quick Fix for Development

For now, use the local backend:

1. **Start your local backend:**
   ```bash
   cd backend
   npm start
   ```

2. **Ensure your local backend has the correct environment variables** in `.env`:
   ```bash
   JWT_SECRET=your_secure_jwt_secret_here
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```

3. **Test the local backend:**
   ```bash
   cd backend
   node test-auth.js
   ```

4. **The frontend will now use localhost:3000** by default
