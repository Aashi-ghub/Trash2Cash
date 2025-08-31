# 🗑️➡️💰 Trash2Cash - Turn Waste into Rewards

> **Smart Recycling Platform | Hackathon Project**

Transform waste disposal into a rewarding experience with our IoT-powered smart recycling platform. Users earn points, badges, and rewards for proper waste disposal while contributing to environmental sustainability.

## 🚀 **Live Demo**

- **Frontend**: [https://trash2-cash-r4vc.vercel.app/](https://trash2-cash-r4vc.vercel.app/)
- **Backend API**: [https://trash2cash-j8zs.onrender.com](https://trash2cash-j8zs.onrender.com)
- **API Health Check**: [https://eco-hive-network.onrender.com/health](https://eco-hive-network.onrender.com/health)

## 🎯 **Demo Credentials**

```
Email: test@trash2cash.com
Password: password123
```

## ✨ **Key Features**

### 🏠 **For Users**
- **Smart Bin Integration** - IoT sensors track recycling activity
- **Points & Rewards System** - Earn points for every recycling action
- **Achievement Badges** - Unlock badges for milestones
- **Real-time Analytics** - Track your environmental impact
- **Gamified Experience** - Leaderboards and challenges

### 🏢 **For Hosts/Organizations**
- **Bin Management Dashboard** - Monitor all smart bins
- **Analytics & Insights** - AI-powered waste analysis
- **Maintenance Alerts** - Proactive bin maintenance
- **Revenue Tracking** - Monitor recycling program ROI

### 🤖 **AI-Powered Features**
- **Predictive Analytics** - Forecast waste collection needs
- **Anomaly Detection** - Identify unusual patterns
- **Smart Insights** - AI-generated recommendations
- **Real-time Monitoring** - Live bin status updates

## 🏗️ **Tech Stack**

### **Frontend**
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Radix UI** - Accessible component library
- **Framer Motion** - Smooth animations
- **React Three Fiber** - 3D visualizations

### **Backend**
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Supabase** - PostgreSQL database
- **JWT** - Authentication
- **OpenXAI** - AI analytics
- **Ollama** - Local LLM integration

### **Infrastructure**
- **Vercel** - Frontend deployment
- **Render** - Backend deployment
- **Supabase** - Database & auth
- **GitHub** - Version control

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js 18+
- npm or pnpm
- Git

### **1. Clone Repository**
```bash
git clone https://github.com/Aashi-ghub/Trash2Cash.git
cd Trash2Cash
```

### **2. Install Dependencies**
```bash
# Install all dependencies (frontend + backend)
npm run setup

# Or install separately:
npm run setup:frontend
npm run setup:backend
```

### **3. Environment Setup**

#### **Backend Configuration**
```bash
cd backend
cp env.example .env
```

Edit `.env` with your Supabase credentials:
```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
JWT_SECRET=your_secure_jwt_secret
```

#### **Frontend Configuration**
```bash
cd frontend
cp env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_API_BASE_URL=https://trash2cash-j8zs.onrender.com
```

### **4. Database Setup**
```bash
cd backend
npm run setup-db
npm run apply-schema
npm run seed:mock
```

### **5. Start Development Servers**
```bash
# Start both frontend and backend
npm run dev

# Or start separately:
npm run dev:frontend  # Frontend on http://localhost:3000
npm run dev:backend   # Backend on https://trash2cash-j8zs.onrender.com
```

## 📊 **API Documentation**

### **Core Endpoints**
- `GET /health` - Server health check
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User authentication
- `GET /api/bins` - Get all bins
- `GET /api/events` - Get recycling events
- `GET /api/analytics/rewards/me` - User rewards

### **AI Analytics**
- `GET /api/ai-analytics/insights/:binId` - AI insights
- `GET /api/ai-analytics/anomalies/:binId` - Anomaly detection
- `GET /api/ai-analytics/predictions/:binId` - Predictive analytics

### **Admin Features**
- `GET /api/admin/overview` - System overview
- `GET /api/admin/users` - User management
- `GET /api/admin/bins` - Bin management

## 🧪 **Testing**

### **API Testing**
```bash
# Test backend health
curl https://trash2cash-j8zs.onrender.com/health

# Test authentication
cd backend
node test-auth.js

# Test analytics
node test-analytics.js
```

### **Frontend Testing**
```bash
cd frontend
npm run lint
npm run build
```

## 📁 **Project Structure**

```
trash2cash/
├── frontend/                 # Next.js frontend
│   ├── app/                 # App Router pages
│   ├── components/          # React components
│   ├── lib/                 # Utilities & hooks
│   └── public/              # Static assets
├── backend/                 # Node.js backend
│   ├── src/
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── middleware/      # Express middleware
│   │   └── config/          # Configuration
│   ├── scripts/             # Database scripts
│   └── logs/                # Application logs
├── public/                  # Root static files
└── docs/                    # Documentation
```

## 🔧 **Development Scripts**

```bash
# Development
npm run dev                  # Start both servers
npm run dev:frontend         # Frontend only
npm run dev:backend          # Backend only

# Building
npm run build               # Build both projects
npm run build:frontend      # Build frontend
npm run build:backend       # Build backend

# Database
npm run seed                # Seed mock data
npm run setup-db            # Setup database

# Testing
npm run test                # Run all tests
npm run test:frontend       # Frontend tests
npm run test:backend        # Backend tests
```

## 🌟 **Hackathon Highlights**

### **Innovation**
- **IoT Integration** - Real-time smart bin monitoring
- **AI Analytics** - Predictive waste management
- **Gamification** - Engaging user experience
- **Sustainability Focus** - Environmental impact tracking

### **Technical Excellence**
- **Full-Stack Architecture** - Modern tech stack
- **Real-time Features** - Live data updates
- **Scalable Design** - Production-ready code
- **Comprehensive Testing** - Robust error handling

### **User Experience**
- **Intuitive UI** - Clean, modern interface
- **Mobile Responsive** - Works on all devices
- **Accessibility** - WCAG compliant
- **Performance** - Optimized loading times

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 **Acknowledgments**

- **Supabase** - Database and authentication
- **Vercel** - Frontend hosting
- **Render** - Backend hosting
- **OpenXAI** - AI analytics
- **Ollama** - Local LLM integration

---

**Built with ❤️ for a sustainable future**
