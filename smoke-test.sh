#!/bin/bash
set -e

# URLs to check (assumes local or staging env vars)
urls=(
  "${VITE_API_URL:-http://localhost:8000}/api/health"
  "http://localhost:3000" # process-web
  "http://localhost:3001" # taskjuggler-web
  "http://localhost:3002" # projects-web
  "http://localhost:3003" # coordinator-web
  "http://localhost:3004" # urpa-web
  "http://localhost:3005" # ideacircuit-web
  "http://localhost:3006" # scanner-web
)

echo "Starting Smoke Tests..."

for url in "${urls[@]}"; do
  echo "Checking $url..."
  if curl --output /dev/null --silent --head --fail "$url"; then
    echo "✅ $url is UP"
  else
    echo "❌ $url is DOWN"
    exit 1
  fi
done

echo "All services are UP!"
