#!/bin/bash

echo "🚀 Setting up Trash2Cash Project..."
echo "=================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm version: $(npm --version)"

# Navigate to frontend directory
echo "📁 Setting up frontend..."
cd frontend

# Install dependencies
echo "📦 Installing frontend dependencies..."
npm install

# Create environment file if it doesn't exist
if [ ! -f .env.local ]; then
    echo "🔧 Creating .env.local file..."
    cp env.example .env.local
    echo "✅ Environment file created"
else
    echo "✅ Environment file already exists"
fi

# Test backend connection
echo "🔍 Testing backend connection..."
BACKEND_URL="https://eco-hive-network.onrender.com"

# Test health endpoint
if curl -s "$BACKEND_URL/health" > /dev/null; then
    echo "✅ Backend is accessible at $BACKEND_URL"
else
    echo "⚠️  Backend might not be accessible. Please check the URL: $BACKEND_URL"
fi

echo ""
echo "🎉 Setup complete!"
echo "=================================="
echo "To start the development server:"
echo "  cd frontend"
echo "  npm run dev"
echo ""
echo "The application will be available at: http://localhost:3000"
echo ""
echo "Backend API is deployed at: $BACKEND_URL"
echo "Health check: $BACKEND_URL/health"
echo ""
echo "📚 For more information, see SETUP_GUIDE.md"

