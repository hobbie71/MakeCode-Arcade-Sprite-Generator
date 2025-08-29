#!/bin/bash

# Production startup script for Railway/Railpack deployment

echo "Starting MakeCode Arcade Sprite Generator deployment..."

# Load environment variables from root .env file
if [ -f ".env" ]; then
    echo "Loading environment variables from .env file..."
    set -a
    source .env
    set +a
fi

# Install Python dependencies if virtual environment doesn't exist
if [ ! -d "server/.venv" ]; then
    echo "Setting up Python virtual environment..."
    cd server
    python3 -m venv .venv
    source .venv/bin/activate
    pip install -r requirements.txt
    cd ..
fi

# Build the client
echo "Building client application..."
npm run build:client

# Start the server
echo "Starting Python FastAPI server..."
cd server
source .venv/bin/activate
python -m uvicorn app.main:app --host ${HOST:-0.0.0.0} --port ${PORT:-8000}
