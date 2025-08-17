#!/bin/bash

# Setup script for MakeCode Arcade Sprite Generator
# This script sets up the development environment

echo "🚀 Setting up MakeCode Arcade Sprite Generator..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install client dependencies
echo "📦 Installing client dependencies..."
cd client
npm install
cd ..

# Setup Python server
echo "🐍 Setting up Python server..."
cd server

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment and install dependencies
echo "Installing Python dependencies..."
source venv/bin/activate
pip install -r requirements.txt

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cp .env.example .env
fi

cd ..

echo "✅ Setup complete! 🎉"
echo ""
echo "To start development:"
echo "  npm run dev        # Start both client and server"
echo "  npm run dev:client # Start only React client (http://localhost:3000)"
echo "  npm run dev:server # Start only Python server (http://localhost:8000)"
echo ""
echo "API Documentation: http://localhost:8000/docs"
echo "Client App: http://localhost:3000"
