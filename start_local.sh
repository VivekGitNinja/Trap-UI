#!/bin/bash

# Kill any existing processes on ports 3000, 4000, 8000
echo "🧹 Cleaning up existing processes on ports 3000, 4000, 8000..."
lsof -ti:3000,4000,8000 | xargs kill -9 2>/dev/null || true

# Function to run backend
run_backend() {
    echo "🚀 Starting Backend (Port 4000)..."
    cd "trap-ui-backend"
    if [ ! -d "node_modules" ]; then
        echo "📦 Installing backend dependencies..."
        npm install --silent
    fi
    if [ ! -d "dist" ]; then
        echo "🔨 Building backend..."
        npm run build
    fi
    # Run in background
    NO_INFRA=1 npm start > ../backend.log 2>&1 &
    BACKEND_PID=$!
    echo "✅ Backend running (PID: $BACKEND_PID)"
}

# Function to run analytics
run_analytics() {
    echo "🚀 Starting Analytics (Port 8000)..."
    cd "trap-ui-analytics"
    if [ ! -d ".venv" ]; then
        echo "📦 Creating python environment..."
        python3 -m venv .venv
    fi
    source .venv/bin/activate
    if [ ! -f ".installed" ]; then
        echo "📦 Installing analytics dependencies..."
        pip install --upgrade pip --quiet
        pip install -r requirements.txt --quiet
        touch .installed
    fi
    export PYPPETEER_EXECUTABLE_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
    # Run in background
    uvicorn app.main:app --host 0.0.0.0 --port 8000 > ../analytics.log 2>&1 &
    ANALYTICS_PID=$!
    echo "✅ Analytics running (PID: $ANALYTICS_PID)"
}

# Function to run frontend
run_frontend() {
    echo "🚀 Starting Frontend (Port 3000)..."
    cd "trap-ui-frontend"
    if [ ! -d "node_modules" ]; then
        echo "📦 Installing frontend dependencies..."
        npm install --silent
    fi
    
    # Set env vars for local no-docker mode
    export NEXT_PUBLIC_BACKEND_URL="http://localhost:4000"
    export NEXT_PUBLIC_DIRECT_ANALYZE="1"
    
    echo "🌍 Launching Frontend..."
    npm run dev
}

# Trap SIGINT to kill background processes
trap 'kill $BACKEND_PID $ANALYTICS_PID; exit' SIGINT

# Start services
(cd "$(dirname "$0")" && run_backend)
(cd "$(dirname "$0")" && run_analytics)

# Wait for backend and analytics to be ready
echo "⏳ Waiting for services to initialize..."
sleep 5

# Start frontend in foreground
(cd "$(dirname "$0")" && run_frontend)
