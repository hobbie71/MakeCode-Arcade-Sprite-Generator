#!/bin/bash

# Navigate to the server directory
cd "$(dirname "$0")"

# Activate virtual environment
source ../.venv/bin/activate

# Set PYTHONPATH to include the server directory
export PYTHONPATH="$(pwd)"

# Start the server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
