# Dashboard Integration Guide

## Overview

The Trash2Cash dashboard has been successfully integrated with the real backend API, replacing all mock data with live data from the database. This guide explains the integration architecture and how to use it.

## 🏗️ Architecture

### Frontend Components

1. **Custom Hooks** (`frontend/lib/hooks/useDashboardData.ts`)
   - `useUserDashboardData()` - Fetches user-specific data
   - `useHostDashboardData()` - Fetches host-specific data
   - Handles loading states, error handling, and data transformation

2. **Loading Skeletons** (`frontend/components/ui/loading-skeleton.tsx`)
   - `DashboardSkeleton` - Loading state for user dashboard
   - `HostDashboardSkeleton` - Loading state for host dashboard

3. **Updated Dashboard** (`frontend/components/role-based-dashboard.tsx`)
   - Uses real API data instead of mock data
   - Implements error handling and retry functionality
   - Shows loading states during data fetching

### Backend API Endpoints

1. **Analytics Routes** (`backend/src/routes/analytics.js`)
   - `GET /api/analytics/rewards/summary` - User rewards summary
   - `GET /api/analytics/rewards/me` - User rewards history
   - `GET /api/analytics/dashboard-stats/me` - Host dashboard stats

2. **Enhanced Data Processing**
   - Real-time calculations for points, ranks, and statistics
   - CO2 impact calculations
   - Monthly vs total statistics

## 🔄 Data Flow

```
Frontend Dashboard
       ↓
Custom Hooks (useDashboardData)
       ↓
API Client (apiClient)
       ↓
Backend API Endpoints
       ↓
Database (Supabase)
```

## 📊 Dashboard Features

### User Dashboard
- **Real-time Points**: Fetched from `rewards_ledger` table
- **Monthly Statistics**: Calculated from last 30 days
- **CO2 Impact**: Estimated based on points earned
- **Ranking System**: Dynamic rank calculation
- **Activity History**: Real recycling events
- **Leaderboard**: User rankings (partially mock for now)

### Host Dashboard
- **Bin Management**: Real bins from database
- **Collection Statistics**: Based on actual events
- **Revenue Tracking**: Calculated from events
- **System Health**: Real bin status monitoring
- **Performance Analytics**: Live data visualization

## 🚀 Getting Started

### 1. Start the Backend
```bash
cd backend
npm install
npm start
```

### 2. Seed Sample Data
```bash
cd backend
node scripts/seed-dashboard-data.js
```

### 3. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```

### 4. Access the Dashboard
- Navigate to `http://localhost:3000/dashboard`
- Login with test credentials: `test@trash2cash.com`
- Switch between User and Host views

## 🔧 Configuration

### Environment Variables

**Backend** (`.env`):
```env
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
JWT_SECRET=your_jwt_secret
```

**Frontend** (`.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### API Base URL
The frontend is configured to connect to `http://localhost:3001` by default. Update `frontend/lib/api.ts` if needed.

## 📈 Data Structure

### User Stats
```typescript
interface UserStats {
  totalPoints: number
  monthlyPoints: number
  itemsRecycled: number
  co2Saved: number
  rank: string
  nextRankPoints: number
}
```

### Host Stats
```typescript
interface HostStats {
  totalBins: number
  activeBins: number
  totalCollections: number
  monthlyRevenue: number
  avgFillLevel: number
  topPerformingBin: string
}
```

## 🛠️ Error Handling

### Frontend Error Handling
- **Loading States**: Skeleton components during data fetch
- **Error States**: User-friendly error messages with retry buttons
- **Fallback Data**: Mock data when API is unavailable
- **Network Errors**: Graceful degradation

### Backend Error Handling
- **Database Errors**: Proper error responses
- **Authentication**: JWT token validation
- **Data Validation**: Input sanitization
- **Rate Limiting**: API protection

## 🔄 Real-time Updates

### Current Implementation
- Manual refresh buttons
- Data fetched on component mount
- User-triggered updates

### Future Enhancements
- WebSocket connections for real-time updates
- Automatic polling for live data
- Push notifications for important events

## 🧪 Testing

### API Testing
```bash
# Test backend health
curl http://localhost:3001/health

# Test analytics endpoints (requires auth)
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3001/api/analytics/rewards/summary
```

### Frontend Testing
- Use the API Status component in the dashboard
- Check browser developer tools for network requests
- Verify data loading and error states

## 📝 Sample Data

The seeding script creates:
- **1 Test User**: `test@trash2cash.com`
- **3 Smart Bins**: Downtown Mall, City Park, Office Building
- **50 Events**: Historical recycling data
- **30 Rewards**: Points earned from activities
- **3 Badges**: Achievement badges
- **10 AI Insights**: Analytics data
- **3 Anomalies**: System alerts

## 🔐 Authentication

### Current Implementation
- JWT-based authentication
- Token stored in localStorage
- Automatic token inclusion in API requests

### Security Features
- Token expiration handling
- Secure password hashing
- Role-based access control
- API endpoint protection

## 🎯 Performance Optimizations

### Frontend
- **Lazy Loading**: Components load on demand
- **Memoization**: React hooks optimization
- **Skeleton Loading**: Better perceived performance
- **Error Boundaries**: Graceful error handling

### Backend
- **Database Indexing**: Optimized queries
- **Connection Pooling**: Efficient database connections
- **Caching**: Redis integration (future)
- **Compression**: Response optimization

## 🚨 Troubleshooting

### Common Issues

1. **API Connection Failed**
   - Check if backend is running on port 3001
   - Verify environment variables
   - Check network connectivity

2. **Authentication Errors**
   - Ensure JWT_SECRET is set
   - Check token expiration
   - Verify user exists in database

3. **Empty Dashboard**
   - Run the seeding script
   - Check database connection
   - Verify API endpoints

4. **Loading States Not Working**
   - Check custom hooks implementation
   - Verify error handling
   - Test API responses

### Debug Commands
```bash
# Check backend logs
cd backend && npm run dev

# Check frontend logs
cd frontend && npm run dev

# Test database connection
cd backend && node scripts/test-db.js
```

## 🔮 Future Enhancements

### Planned Features
- **Real-time Updates**: WebSocket integration
- **Advanced Analytics**: Charts and graphs
- **Mobile App**: React Native version
- **Push Notifications**: Real-time alerts
- **Multi-language Support**: Internationalization
- **Dark Mode**: Theme switching

### Performance Improvements
- **Server-side Rendering**: Better SEO
- **CDN Integration**: Faster loading
- **Database Optimization**: Query improvements
- **Caching Strategy**: Redis implementation

## 📚 Additional Resources

- [Backend API Documentation](./README.md)
- [Database Schema](./backend/src/database/schema.sql)
- [Frontend Components](./frontend/components/)
- [API Client](./frontend/lib/api.ts)

---

**Note**: This integration provides a solid foundation for the Trash2Cash dashboard. The system is designed to be scalable and maintainable, with clear separation of concerns between frontend and backend components.
