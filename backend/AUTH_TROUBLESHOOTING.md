# Authentication Troubleshooting Guide

## Common Issues and Solutions

### 1. 500 Server Error

**Symptoms:**
- Frontend shows "Failed to load resource: the server responded with a status of 500"
- API request fails with 500 status

**Possible Causes:**
- Missing JWT_SECRET environment variable
- Database connection issues
- Missing environment variables

**Solutions:**

#### A. Check JWT_SECRET
Make sure you have JWT_SECRET in your `.env` file:
```bash
JWT_SECRET=your_secure_jwt_secret_here
```

#### B. Check Environment Variables
Ensure all required environment variables are set:
```bash
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here

# Server Configuration
PORT=3000
NODE_ENV=development
```

#### C. Test Backend Health
Run the health check:
```bash
curl http://localhost:3000/health
```

### 2. Database Connection Issues

**Symptoms:**
- Health check shows database as disconnected
- Authentication endpoints return 500 errors

**Solutions:**

#### A. Check Supabase Configuration
- Verify your Supabase URL and keys are correct
- Ensure your Supabase project is active
- Check if your database tables exist

#### B. Test Database Connection
The backend includes a database connection test. Check the logs for:
```
Database connection test successful
```

### 3. Frontend Connection Issues

**Symptoms:**
- Frontend can't connect to backend
- CORS errors in browser console

**Solutions:**

#### A. Check API Base URL
Make sure your frontend is pointing to the correct backend URL:
```typescript
// In frontend/lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
```

#### B. Check CORS Configuration
The backend should have CORS enabled. Check if the backend is running and accessible.

### 4. Testing Authentication

#### A. Use the Test Script
Run the provided test script:
```bash
cd backend
node test-auth.js
```

#### B. Manual Testing
Test the endpoints manually:

**Health Check:**
```bash
curl http://localhost:3000/health
```

**Register:**
```bash
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "role": "user"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 5. Debugging Steps

1. **Check Backend Logs:**
   ```bash
   cd backend
   npm start
   # Look for error messages in the console
   ```

2. **Check Frontend Console:**
   - Open browser developer tools
   - Look for network errors in the Console tab
   - Check the Network tab for failed requests

3. **Verify Environment Variables:**
   ```bash
   # In backend directory
   echo $JWT_SECRET
   echo $SUPABASE_URL
   echo $SUPABASE_SERVICE_ROLE_KEY
   ```

4. **Test Database Schema:**
   Make sure your users table exists in Supabase with the correct columns:
   - user_id (primary key)
   - username
   - email
   - password_hash
   - role

### 6. Common Error Messages

- **"JWT_SECRET environment variable is required"**: Add JWT_SECRET to your .env file
- **"Missing required Supabase environment variables"**: Check your Supabase configuration
- **"User already exists"**: Try with a different email address
- **"Invalid credentials"**: Check your email/password combination

### 7. Getting Help

If you're still having issues:

1. Check the backend logs for detailed error messages
2. Verify all environment variables are set correctly
3. Test the backend endpoints manually using curl or Postman
4. Ensure your Supabase project is properly configured
5. Check that the database schema matches the expected structure
