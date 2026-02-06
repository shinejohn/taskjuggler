#!/bin/bash
# Test Railway build command locally
set -e

echo "=== Testing Railway Build Command ==="
echo "Command: npm install && npm run build -w shared-ui && npm run build -w official-notice-web"
echo ""

# Clean test
rm -rf node_modules */node_modules

# Run Railway build command
npm install
npm run build -w shared-ui
npm run build -w official-notice-web

echo ""
echo "✅ Build test successful!"
