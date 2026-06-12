#!/bin/bash
# Run Playwright all-pages tests for every app in ALLPAGES.md
# Builds each app, serves it, runs tests, then moves to next app.

set -e
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT"

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

FAILURES=0

# App name, directory, port (matches playwright config)
APPS=(
  "taskjuggler-web:taskjuggler-web:5173"
  "coordinator-web:coordinator-web:3003"
  "ideacircuit-web:ideacircuit-web:3004"
  "official-notice-web:official-notice-web:5175"
  "process-web:process-web:3001"
  "projects-web:projects-web:3002"
  "scanner-web:scanner-web:3005"
  "urpa-web:urpa-web:3006"
)

echo "Installing e2e-tests dependencies..."
(cd e2e-tests && npm install) || { echo "e2e-tests npm install failed"; exit 1; }

echo "Building shared-ui first..."
(cd shared-ui && npm run build) || { echo "shared-ui build failed"; exit 1; }

for entry in "${APPS[@]}"; do
  IFS=':' read -r project dir port <<< "$entry"
  echo ""
  echo -e "${YELLOW}=== $project (port $port) ===${NC}"

  if [ ! -d "$dir" ]; then
    echo -e "${RED}Directory $dir not found, skipping${NC}"
    FAILURES=$((FAILURES + 1))
    continue
  fi

  echo "Building $dir..."
  if ! (cd "$dir" && npm run build 2>/dev/null); then
    echo -e "${RED}Build failed for $dir${NC}"
    FAILURES=$((FAILURES + 1))
    continue
  fi

  echo "Starting preview on port $port..."
  (cd "$dir" && npx vite preview --port "$port") &
  PREVIEW_PID=$!
  sleep 3

  if ! kill -0 $PREVIEW_PID 2>/dev/null; then
    echo -e "${RED}Preview failed to start for $dir${NC}"
    FAILURES=$((FAILURES + 1))
    continue
  fi

  echo "Running Playwright tests for $project..."
  if (cd e2e-tests && TASKJUGGLER_URL="http://localhost:5173" COORDINATOR_URL="http://localhost:3003" \
      IDEACIRCUIT_URL="http://localhost:3004" OFFICIAL_NOTICE_URL="http://localhost:5175" \
      PROCESS_URL="http://localhost:3001" PROJECTS_URL="http://localhost:3002" \
      SCANNER_URL="http://localhost:3005" URPA_URL="http://localhost:3006" \
      npm run test -- "tests/all-pages/${project}.spec.ts" --project="$project"); then
    echo -e "${GREEN}✓ $project tests passed${NC}"
  else
    echo -e "${RED}✗ $project tests failed${NC}"
    FAILURES=$((FAILURES + 1))
  fi

  kill $PREVIEW_PID 2>/dev/null || true
  sleep 1
done

echo ""
if [ $FAILURES -eq 0 ]; then
  echo -e "${GREEN}✅ All app tests passed!${NC}"
  exit 0
else
  echo -e "${RED}❌ $FAILURES app(s) had failures${NC}"
  exit 1
fi
