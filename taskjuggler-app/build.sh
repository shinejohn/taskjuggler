#!/bin/bash

# Task Juggler Mobile App - Build Script
# This script automates the build process for iOS and Android

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
PLATFORM="${1:-all}"  # ios, android, or all (default)
PROFILE="${2:-preview}"  # development, preview, or production (default: preview)

echo -e "${GREEN}🚀 Task Juggler Mobile App - Build Script${NC}"
echo "Platform: $PLATFORM"
echo "Profile: $PROFILE"
echo ""

# Check if EAS CLI is installed
if ! command -v eas &> /dev/null; then
    echo -e "${RED}❌ EAS CLI is not installed${NC}"
    echo "Install it with: npm install -g eas-cli"
    exit 1
fi

# Check if logged in to Expo
if ! eas whoami &> /dev/null; then
    echo -e "${YELLOW}⚠️  Not logged in to Expo${NC}"
    echo "Please run: eas login"
    exit 1
fi

# Check if EAS is configured
if [ ! -f "eas.json" ]; then
    echo -e "${YELLOW}⚠️  EAS not configured${NC}"
    echo "Running: eas build:configure"
    eas build:configure
fi

# Check environment variables
if [ -z "$EXPO_PUBLIC_API_URL" ]; then
    echo -e "${YELLOW}⚠️  EXPO_PUBLIC_API_URL not set${NC}"
    echo "Using default from app.json"
fi

# Build based on platform
case $PLATFORM in
    ios)
        echo -e "${GREEN}📱 Building for iOS...${NC}"
        eas build --platform ios --profile "$PROFILE"
        ;;
    android)
        echo -e "${GREEN}🤖 Building for Android...${NC}"
        eas build --platform android --profile "$PROFILE"
        ;;
    all)
        echo -e "${GREEN}📱🤖 Building for both iOS and Android...${NC}"
        eas build --platform all --profile "$PROFILE"
        ;;
    *)
        echo -e "${RED}❌ Invalid platform: $PLATFORM${NC}"
        echo "Usage: ./build.sh [ios|android|all] [development|preview|production]"
        exit 1
        ;;
esac

echo -e "${GREEN}✅ Build process completed!${NC}"
echo ""
echo "Next steps:"
echo "1. Check build status: eas build:list"
echo "2. Download build: eas build:view [BUILD_ID]"
echo "3. Submit to stores: npm run submit:ios or npm run submit:android"
