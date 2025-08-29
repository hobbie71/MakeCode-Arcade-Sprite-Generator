#!/bin/bash

# Development startup script
echo "Starting MakeCode Arcade Sprite Generator in development mode..."

# Function to cleanup background processes
cleanup() {
    echo "Stopping services..."
    kill $SERVER_PID 2>/dev/null
    kill $CLIENT_PID 2>/dev/null
    exit
}

# Set trap to cleanup on script exit
trap cleanup EXIT INT TERM

# Start the server
echo "Starting Python server..."
cd server
source .venv/bin/activate && export PYTHONPATH=.:$PYTHONPATH && python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000 &
SERVER_PID=$!
cd ..

# Wait a moment for server to start
sleep 3

# Start the client
echo "Starting Vite client..."
cd client
npm run dev &
CLIENT_PID=$!
cd ..

echo "Services started!"
echo "Server: http://localhost:8000"
echo "Client: http://localhost:3000 (or next available port)"
echo "Press Ctrl+C to stop all services"

# Wait for background processes
wait
