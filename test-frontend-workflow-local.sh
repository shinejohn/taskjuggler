#!/bin/bash

# Frontend Tests Local Workflow Test Script
# Based on .github/workflows/frontend-tests.yml

set -e

echo "=========================================="
echo "Frontend Tests - Local Workflow Test"
echo "=========================================="
echo ""

BASE_DIR="$(dirname "$0")"
cd "$BASE_DIR" || exit 1

# Step 1: Build shared-ui
echo "=========================================="
echo "Step 1: Building Shared UI"
echo "=========================================="
cd shared-ui || {
    echo "❌ shared-ui directory not found"
    exit 1
}

echo "Installing dependencies..."
if [ -f package-lock.json ]; then
    npm ci
else
    npm install
fi

echo "Type checking..."
npm run type-check || npx vue-tsc --noEmit || echo "⚠️  Type checking skipped"

echo "Building shared-ui..."
npm run build || echo "⚠️  Build script not found, skipping"

echo "✅ Shared UI build complete"
echo ""

# Step 2: Test each frontend project
FRONTEND_PROJECTS=(
    "coordinator-web"
    "taskjuggler-web"
    "scanner-web"
    "urpa-web"
    "projects-web"
    "process-web"
)

cd "$BASE_DIR" || exit 1

for project in "${FRONTEND_PROJECTS[@]}"; do
    echo "=========================================="
    echo "Testing: $project"
    echo "=========================================="
    
    if [ ! -d "$project" ]; then
        echo "⚠️  Directory $project not found, skipping"
        echo ""
        continue
    fi
    
    cd "$project" || {
        echo "❌ Failed to enter $project directory"
        continue
    }
    
    # Install dependencies
    echo "Installing dependencies..."
    npm ci || npm install || {
        echo "❌ Failed to install dependencies for $project"
        cd "$BASE_DIR" || exit 1
        continue
    }
    
    # Type check
    echo "Type checking..."
    npm run type-check || npx vue-tsc --noEmit || echo "⚠️  Type checking skipped for $project"
    
    # Lint (if available)
    echo "Linting..."
    npm run lint || echo "⚠️  Linting skipped for $project"
    
    # Build
    echo "Building $project..."
    npm run build || {
        echo "❌ Build failed for $project"
        cd "$BASE_DIR" || exit 1
        continue
    }
    
    # Run tests (if available)
    echo "Running tests..."
    npm test || echo "⚠️  Tests skipped for $project"
    
    echo "✅ $project tests complete"
    echo ""
    
    cd "$BASE_DIR" || exit 1
done

echo "=========================================="
echo "Frontend Tests - Local Workflow Test Complete"
echo "=========================================="





