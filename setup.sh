#!/bin/bash

# Hackney Forge AI Setup Script
# This script sets up the entire project for development

set -e

echo "🔥 Welcome to Hackney Forge AI Setup"
echo "======================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ and try again."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo ""

# Check if MongoDB is running (optional warning)
if ! command -v mongod &> /dev/null; then
    echo "⚠️  Warning: MongoDB doesn't seem to be installed locally."
    echo "   You can use MongoDB Atlas instead. Make sure to update MONGODB_URI in backend/.env"
    echo ""
fi

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install
echo ""

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..
echo ""

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..
echo ""

# Setup environment file
if [ ! -f backend/.env ]; then
    echo "⚙️  Creating backend/.env file from example..."
    cp backend/.env.example backend/.env
    echo "✅ Created backend/.env - Please update with your API keys!"
    echo ""
else
    echo "ℹ️  backend/.env already exists, skipping..."
    echo ""
fi

echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Edit backend/.env and add your API keys:"
echo "   - OPENAI_API_KEY (required)"
echo "   - HUGGINGFACE_API_KEY (optional)"
echo "   - STRIPE_SECRET_KEY (required for payments)"
echo "   - MONGODB_URI (update if not using localhost)"
echo ""
echo "2. Start MongoDB if using local instance:"
echo "   mongod"
echo ""
echo "3. Seed the database with initial data:"
echo "   cd backend && node src/seed.js"
echo ""
echo "4. Start the development servers:"
echo "   npm run dev"
echo ""
echo "🚀 The app will be available at:"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:5000"
echo ""
echo "Keep it real, innit! 💪"
