#!/bin/bash

# Comprehensive Test Suite Runner
# Runs all tests (backend, frontend E2E) and generates reports

set -e

echo "🧪 Starting Comprehensive Test Suite..."
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Results directory
RESULTS_DIR="./test-results"
mkdir -p "$RESULTS_DIR"

# Track failures
FAILURES=0

# Function to run tests and capture results
run_test_suite() {
    local name=$1
    local command=$2
    
    echo -e "${YELLOW}Running $name tests...${NC}"
    
    if eval "$command"; then
        echo -e "${GREEN}✓ $name tests passed${NC}"
        return 0
    else
        echo -e "${RED}✗ $name tests failed${NC}"
        FAILURES=$((FAILURES + 1))
        return 1
    fi
}

# Backend Unit Tests
echo "📦 Backend Unit Tests"
run_test_suite "Backend Unit" "cd taskjuggler-api && php artisan test --testsuite=Unit --log-junit=$RESULTS_DIR/backend-unit.xml"

# Backend Feature Tests
echo ""
echo "📦 Backend Feature Tests"
run_test_suite "Backend Feature" "cd taskjuggler-api && php artisan test --testsuite=Feature --log-junit=$RESULTS_DIR/backend-feature.xml"

# Frontend E2E Tests
echo ""
echo "🌐 Frontend E2E Tests"
run_test_suite "Frontend E2E" "cd e2e-tests && npm test -- --reporter=json --output=$RESULTS_DIR/e2e-results.json"

# Generate Summary
echo ""
echo "📊 Generating Test Summary..."

SUMMARY_FILE="$RESULTS_DIR/summary.txt"
cat > "$SUMMARY_FILE" << EOF
Test Suite Summary
==================
Generated: $(date)

Backend Unit Tests: $([ -f "$RESULTS_DIR/backend-unit.xml" ] && echo "Completed" || echo "Failed")
Backend Feature Tests: $([ -f "$RESULTS_DIR/backend-feature.xml" ] && echo "Completed" || echo "Failed")
Frontend E2E Tests: $([ -f "$RESULTS_DIR/e2e-results.json" ] && echo "Completed" || echo "Failed")

Total Failures: $FAILURES
EOF

cat "$SUMMARY_FILE"

# Final Status
echo ""
if [ $FAILURES -eq 0 ]; then
    echo -e "${GREEN}✅ All test suites completed successfully!${NC}"
    exit 0
else
    echo -e "${RED}❌ $FAILURES test suite(s) failed. Check results in $RESULTS_DIR${NC}"
    exit 1
fi
