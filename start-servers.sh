#!/bin/bash

# PETVERSE Server Startup Script with Auto-Restart
# This script starts both frontend and backend servers with monitoring

echo "🚀 Starting PETVERSE servers..."

# Function to check if a port is in use
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null ; then
        return 0  # Port is in use
    else
        return 1  # Port is free
    fi
}

# Function to start backend with restart capability
start_backend() {
    echo "🔧 Starting backend server..."
    cd /Users/hirushadilshan/Documents/ITP_H/PETVERSE/backend
    PORT=4000 npm start &
    BACKEND_PID=$!
    echo "🚀 Backend started with PID: $BACKEND_PID"
    cd ..
}

# Function to start frontend
start_frontend() {
    echo "🎨 Starting frontend server..."
    cd /Users/hirushadilshan/Documents/ITP_H/PETVERSE/frontend
    npm run dev &
    FRONTEND_PID=$!
    echo "🚀 Frontend started with PID: $FRONTEND_PID"
    cd ..
}

# Check and start backend
echo "🔧 Checking backend server (port 4000)..."
if check_port 4000; then
    echo "✅ Backend is already running on port 4000"
else
    start_backend
fi

# Wait a moment for backend to start
sleep 3

# Verify backend is working
echo "🔍 Verifying backend..."
if curl -s http://localhost:4000/health > /dev/null; then
    echo "✅ Backend health check passed"
else
    echo "❌ Backend health check failed, restarting..."
    pkill -f "PORT=4000 npm start"
    sleep 2
    start_backend
    sleep 3
fi

# Check and start frontend
echo "🎨 Checking frontend server (port 3000)..."
if check_port 3000; then
    echo "✅ Frontend is already running on port 3000"
else
    start_frontend
fi

echo ""
echo "🎉 PETVERSE is ready!"
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend:  http://localhost:4000"
echo "🧪 Test Page: http://localhost:3000/test"
echo ""
echo "💡 Test accounts:"
echo "   Email: test@petverse.com, Password: 123456 (Pet Owner)"
echo "   Email: admin@petverse.com, Password: admin123 (Admin)"
echo ""
echo "🔄 To restart servers if they crash:"
echo "   Run: ./start-servers.sh"
echo ""