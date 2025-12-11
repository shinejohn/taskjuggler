#!/bin/bash

# Comprehensive Test Execution Script
# Usage: ./run-tests.sh [suite]

set -e

echo "🧪 Task Juggler Test Suite"
echo "=========================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test session ID
SESSION_ID="test-$(date +%Y%m%d-%H%M%S)"

echo "Session ID: $SESSION_ID"
echo ""

# Function to run test suite
run_suite() {
    local suite=$1
    local name=$2
    
    echo -e "${YELLOW}Running $name tests...${NC}"
    
    php artisan test --testsuite=$suite \
        --log-json=storage/logs/tests/$SESSION_ID-$suite.json \
        || {
        echo -e "${RED}$name tests failed${NC}"
        return 1
    }
    
    echo -e "${GREEN}$name tests passed${NC}"
    echo ""
}

# Run all test suites
echo "📋 Running API Tests..."
run_suite "Api" "API"

echo "📋 Running Service Tests..."
run_suite "Services" "Service"

echo "📋 Running Integration Tests..."
run_suite "Integration" "Integration"

# Generate report
echo "📊 Generating Test Report..."
php artisan test:report \
    --input=storage/logs/tests \
    --output=storage/logs/tests/reports

echo ""
echo -e "${GREEN}✅ All tests completed!${NC}"
echo ""
echo "View reports:"
echo "  - JSON: storage/logs/tests/latest-report.json"
echo "  - HTML: storage/logs/tests/latest-report.html"
echo ""
