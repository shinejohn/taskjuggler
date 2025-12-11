# Mobile App Build Setup - Complete ✅

## What Was Done

### 1. ✅ Environment Variables Set Up

**Updated `app.json`:**
- Added `apiUrl` in `extra` section
- Set to: `https://taskjuggler-production.up.railway.app/api`

**Created `.env.example`:**
- Template for environment variables
- Includes API URL, Project ID, and Pusher config

**Created `.env`:**
- Local environment file (gitignored)
- Pre-filled with API URL

### 2. ✅ Build Scripts Added

**Updated `package.json` with build commands:**
```json
"build:ios:dev": "eas build --platform ios --profile development"
"build:ios:preview": "eas build --platform ios --profile preview"
"build:ios:prod": "eas build --platform ios --profile production"
"build:android:dev": "eas build --platform android --profile development"
"build:android:preview": "eas build --platform android --profile preview"
"build:android:prod": "eas build --platform android --profile production"
"build:all:dev": "eas build --platform all --profile development"
"build:all:preview": "eas build --platform all --profile preview"
"build:all:prod": "eas build --platform all --profile production"
"submit:ios": "eas submit --platform ios"
"submit:android": "eas submit --platform android"
```

### 3. ✅ Automated Build Script Created

**Created `build.sh`:**
- Automated build script for iOS/Android
- Handles platform selection (ios/android/all)
- Handles profile selection (development/preview/production)
- Includes error checking and helpful messages
- Made executable with `chmod +x`

## How to Use

### Quick Build Commands

```bash
cd taskjuggler-app

# Development builds (for testing)
npm run build:ios:dev
npm run build:android:dev
npm run build:all:dev

# Preview builds (for internal testing)
npm run build:ios:preview
npm run build:android:preview
npm run build:all:preview

# Production builds (for App Store/Play Store)
npm run build:ios:prod
npm run build:android:prod
npm run build:all:prod
```

### Using the Build Script

```bash
cd taskjuggler-app

# Build for iOS (preview)
./build.sh ios preview

# Build for Android (preview)
./build.sh android preview

# Build for both (production)
./build.sh all production
```

## Prerequisites

Before building, ensure:

1. **EAS CLI installed:**
   ```bash
   npm install -g eas-cli
   ```

2. **Logged in to Expo:**
   ```bash
   eas login
   ```

3. **EAS configured:**
   ```bash
   cd taskjuggler-app
   eas build:configure
   ```

4. **Expo Project ID:**
   - Run `eas init` to create project
   - Or get from Expo dashboard
   - Add to `app.json` under `extra.eas.projectId`

## Next Steps

### For Development/Testing:
```bash
npm run build:ios:dev
npm run build:android:dev
```

### For Internal Testing:
```bash
npm run build:ios:preview
npm run build:android:preview
```

### For App Store Submission:
```bash
# Build
npm run build:ios:prod
npm run build:android:prod

# Submit (after build completes)
npm run submit:ios
npm run submit:android
```

## Environment Variables

The app uses:
- `EXPO_PUBLIC_API_URL` - Backend API endpoint (set in app.json)
- `EXPO_PUBLIC_PROJECT_ID` - Expo project ID (optional)
- `EXPO_PUBLIC_PUSHER_APP_KEY` - For real-time features (optional)

All variables prefixed with `EXPO_PUBLIC_` are available in the app via `process.env.EXPO_PUBLIC_*`

## Status

✅ **Environment variables configured**
✅ **Build scripts created**
✅ **Automated build script ready**
✅ **Ready to build!**

Run `npm run build:ios:preview` or `npm run build:android:preview` to start building!


