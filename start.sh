#!/bin/bash

echo "Starting MakeCode Arcade Sprite Generator deployment..."

# Load environment variables from root .env file
if [ -f ".env" ]; then
    set -a
    source .env
    set +a
fi

# Build the client
echo "Building client application..."
npm run build:client

# Install Python dependencies (no venv)
echo "Installing Python dependencies..."
pip install -r server/requirements.txt

# Start the server
echo "Starting Python FastAPI server..."
cd server
python -m uvicorn app.main:app --host ${HOST:-0.0.0.0} --port ${PORT:-8000}