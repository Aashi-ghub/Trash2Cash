# Trash2Cash Project Setup Guide

This guide will help you set up and run the Trash2Cash project locally, integrating the frontend with the deployed backend at `https://eco-hive-network.onrender.com`.

## 🏗️ Project Architecture

- **Frontend**: Next.js 15 with TypeScript, Tailwind CSS, and Radix UI
- **Backend**: Node.js/Express API deployed on Render.com
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Currently using demo data (ready for real auth integration)

## 📋 Prerequisites

- Node.js 18+ 
- npm or pnpm
- Git

## 🚀 Quick Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Aashi-ghub/Trash2Cash.git
cd Trash2Cash
```

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install
# or
pnpm install

# Create environment file
cp env.example .env.local

# Start development server
npm run dev
# or
pnpm dev
```

The frontend will be available at `http://localhost:3000`

### 3. Backend (Already Deployed)

The backend is already deployed and running at:
- **URL**: https://eco-hive-network.onrender.com
- **Health Check**: https://eco-hive-network.onrender.com/health

## 🔧 Environment Configuration

### Frontend Environment (.env.local)

```env
# Backend API Configuration
NEXT_PUBLIC_API_BASE_URL=https://eco-hive-network.onrender.com

# Frontend Configuration
NEXT_PUBLIC_APP_NAME=Trash2Cash
NEXT_PUBLIC_APP_DESCRIPTION=Turn Waste into Rewards

# Authentication (if needed)
NEXT_PUBLIC_AUTH_ENABLED=true

# Analytics (optional)
NEXT_PUBLIC_ANALYTICS_ENABLED=false
```

## 📊 API Integration

The frontend is now integrated with the deployed backend API. Here are the available endpoints:

### Health Check
- `GET /health` - Check server and database connectivity

### Users API
- `GET /api/users` - Get all users
- `GET /api/users/:userId` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:userId` - Update user
- `DELETE /api/users/:userId` - Delete user

### Bins API
- `GET /api/bins` - Get all bins
- `GET /api/bins/:binId` - Get bin by ID
- `GET /api/bins/user/:userId` - Get bins by user ID
- `POST /api/bins` - Create new bin
- `PUT /api/bins/:binId` - Update bin
- `DELETE /api/bins/:binId` - Delete bin
- `GET /api/bins/:binId/stats` - Get bin statistics

### Events API
- `GET /api/events` - Get all events (with pagination)
- `GET /api/events/:eventId` - Get event by ID
- `GET /api/events/bin/:binId` - Get events by bin ID
- `POST /api/events` - Create new event (IoT ingestion)
- `POST /api/events/bulk` - Bulk create events
- `PUT /api/events/:eventId` - Update event
- `DELETE /api/events/:eventId` - Delete event

### Analytics API
- `GET /api/analytics/insights/:binId` - Get AI insights for a specific bin
- `GET /api/analytics/anomalies/:binId` - Get anomalies for a specific bin
- `GET /api/analytics/rewards/me` - Get rewards history for the authenticated user
- `GET /api/analytics/rewards/summary` - Get a summary of rewards for the authenticated user
- `GET /api/analytics/dashboard-stats/me` - Get dashboard stats for the authenticated user

## 🎯 Features

### User Dashboard
- **Reward Wallet**: Track points earned from recycling
- **Items Recycled**: Monthly recycling statistics
- **CO₂ Saved**: Environmental impact tracking
- **Current Rank**: Gamification system
- **Nearby Smart Bins**: Find recycling locations
- **Leaderboard**: Compare with other users
- **Recent Activity**: Track recycling history

### Host Dashboard
- **Bin Management**: Monitor smart bins
- **Collections**: Track waste collection
- **Revenue**: Monthly earnings
- **System Health**: Bin network status
- **Analytics**: Performance insights

### Role Switching
- Switch between User and Host views
- Different dashboards for different user types
- Role-based navigation and features

## 🧪 Testing the Integration

### 1. Health Check
Visit: https://eco-hive-network.onrender.com/health

### 2. Test API Endpoints
You can test the API endpoints using tools like:
- Postman
- curl
- Browser developer tools

### 3. Sample API Calls

```bash
# Get all users
curl https://eco-hive-network.onrender.com/api/users

# Get all bins
curl https://eco-hive-network.onrender.com/api/bins

# Get events with pagination
curl https://eco-hive-network.onrender.com/api/events?limit=10&offset=0
```

## 🔍 Troubleshooting

### Frontend Issues

1. **Port already in use**
   ```bash
   # Kill process on port 3000
   npx kill-port 3000
   ```

2. **Dependencies issues**
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Environment variables not loading**
   - Ensure `.env.local` file exists in frontend directory
   - Restart the development server

### Backend Issues

1. **API not responding**
   - Check if the backend is running: https://eco-hive-network.onrender.com/health
   - Verify the API base URL in `.env.local`

2. **CORS errors**
   - The backend has CORS configured for localhost:3000
   - If using a different port, update the backend CORS settings

## 📁 Project Structure

```
trash2cash/
├── frontend/                 # Next.js frontend application
│   ├── app/                 # App router pages
│   ├── components/          # React components
│   ├── lib/                 # Utilities and API client
│   ├── public/              # Static assets
│   └── package.json
├── backend/                 # Node.js backend (deployed)
│   ├── src/                 # Source code
│   ├── scripts/             # Database scripts
│   └── package.json
└── SETUP_GUIDE.md          # This file
```

## 🚀 Deployment

### Frontend Deployment
The frontend can be deployed to:
- Vercel (recommended for Next.js)
- Netlify
- Any static hosting service

### Backend Deployment
The backend is already deployed on Render.com and ready to use.

## 🔮 Next Steps

1. **Authentication**: Implement real user authentication
2. **Real-time Updates**: Add WebSocket connections for live data
3. **Mobile App**: Develop React Native mobile application
4. **IoT Integration**: Connect real smart bin devices
5. **Payment Integration**: Add reward redemption system

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the API documentation in `backend/README.md`
3. Test the backend health endpoint
4. Check browser console for frontend errors

## 🎉 Success!

Once you've completed the setup, you should be able to:
- Access the frontend at `http://localhost:3000`
- See the integrated dashboard with real API data
- Switch between User and Host views
- View mock data that can be replaced with real backend data

The project is now ready for development and testing! 🚀
