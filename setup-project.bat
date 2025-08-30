@echo off
echo 🚀 Setting up Trash2Cash Project...
echo ==================================

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

echo ✅ Node.js version: 
node --version

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ npm version: 
npm --version

REM Navigate to frontend directory
echo 📁 Setting up frontend...
cd frontend

REM Install dependencies
echo 📦 Installing frontend dependencies...
npm install

REM Create environment file if it doesn't exist
if not exist .env.local (
    echo 🔧 Creating .env.local file...
    copy env.example .env.local
    echo ✅ Environment file created
) else (
    echo ✅ Environment file already exists
)

echo.
echo 🎉 Setup complete!
echo ==================================
echo To start the development server:
echo   cd frontend
echo   npm run dev
echo.
echo The application will be available at: http://localhost:3000
echo.
echo Backend API is deployed at: https://eco-hive-network.onrender.com
echo Health check: https://eco-hive-network.onrender.com/health
echo.
echo 📚 For more information, see SETUP_GUIDE.md
echo.
pause
