#!/bin/bash
unset DOCKER_HOST

set_sock_and_check() {
    export DOCKER_HOST="$1"
    docker info > /dev/null 2>&1
    return $?
}

if ! docker info > /dev/null 2>&1; then
    if [ -S /var/run/docker.sock ] && set_sock_and_check "unix:///var/run/docker.sock"; then
        echo "🔧 Using Docker socket at /var/run/docker.sock"
    elif [ -S "$HOME/.docker/run/docker.sock" ] && set_sock_and_check "unix://$HOME/.docker/run/docker.sock"; then
        echo "🔧 Using Docker socket at $HOME/.docker/run/docker.sock"
    else
        unset DOCKER_HOST
    fi
fi

echo "🔍 Checking Docker status (Host: $DOCKER_HOST)..."

# Function to check if Docker is running
check_docker() {
    docker info > /dev/null 2>&1
    return $?
}

if ! check_docker; then
    echo "⚠️  Docker is not running."
    echo "🚀 Attempting to start Docker Desktop..."
    
    # Try to open Docker
    echo "👉 Please manually open 'Docker' from your Applications folder if it's not already starting."
    open -a Docker > /dev/null 2>&1
    
    echo "⏳ Waiting for Docker to initialize..."
    
    # Wait loop
    while ! check_docker; do
        echo -ne "   Waiting for Docker daemon to be ready... (Press Ctrl+C to cancel)\r"
        sleep 2
    done
    echo ""
    echo "✅ Docker is up and running!"
fi

echo "✅ Docker is ready."
echo "📦 Building and starting services..."

# Clean up any potential zombie containers/networks first
echo "🧹 Cleaning up old processes and metadata files..."
# Remove macOS metadata files that break Docker build on external drives
find . -name "._*" -delete 2>/dev/null || true

# Kill any processes occupying our ports (3005, 4000, 8000)
lsof -ti:3005,4000,8000 | xargs kill -9 2>/dev/null || true

docker compose down --remove-orphans > /dev/null 2>&1

# Start fresh with fallbacks
compose_up() {
    docker compose up --build -d
    return $?
}

if ! compose_up; then
    echo "⚠️  Compose failed with current Docker host. Trying fallbacks..."
    unset DOCKER_HOST
    if compose_up; then
        echo "✅ Compose succeeded after unsetting DOCKER_HOST."
    elif [ -S /var/run/docker.sock ]; then
        export DOCKER_HOST="unix:///var/run/docker.sock"
        if compose_up; then
            echo "✅ Compose succeeded using /var/run/docker.sock."
        elif [ -S "$HOME/.docker/run/docker.sock" ]; then
            export DOCKER_HOST="unix://$HOME/.docker/run/docker.sock"
            compose_up
        fi
    elif [ -S "$HOME/.docker/run/docker.sock" ]; then
        export DOCKER_HOST="unix://$HOME/.docker/run/docker.sock"
        compose_up
    fi
fi

if [ $? -eq 0 ]; then
    echo "🎉 Services started successfully!"
    echo "🌍 Access the app at: http://localhost:3005"
    
    echo "Testing connection..."
    sleep 5
    if curl -s http://localhost:3005 > /dev/null; then
        echo "✅ Frontend is responding!"
    else
        echo "⚠️  Frontend is running but not yet responding to curl (might be building/starting up)."
        echo "   Please wait a few moments and refresh your browser."
    fi
else
    echo "❌ Failed to start services. Check the error logs above."
fi
