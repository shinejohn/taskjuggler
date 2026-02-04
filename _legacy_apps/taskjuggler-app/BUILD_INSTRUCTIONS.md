# React Native App - Build Instructions

## Current Status

✅ **App is configured** with:
- Expo SDK 54
- iOS bundle identifier: `com.taskjuggler.app`
- Android package: `com.taskjuggler.app`
- Basic app structure with tabs, auth, and core pages

❌ **Not yet built** for iOS or Android

## Prerequisites

1. **Install EAS CLI:**
   ```bash
   npm install -g eas-cli
   ```

2. **Login to Expo:**
   ```bash
   eas login
   ```

3. **Configure EAS (if not done):**
   ```bash
   cd taskjuggler-app
   eas build:configure
   ```

## Build Commands

### Development Builds (for testing)

#### iOS Simulator
```bash
cd taskjuggler-app
eas build --platform ios --profile development
```

#### Android APK
```bash
cd taskjuggler-app
eas build --platform android --profile development
```

### Preview Builds (for internal testing)

#### iOS
```bash
eas build --platform ios --profile preview
```

#### Android
```bash
eas build --platform android --profile preview
```

### Production Builds (for App Store/Play Store)

#### iOS (App Store)
```bash
eas build --platform ios --profile production
```

#### Android (Play Store)
```bash
eas build --platform android --profile production
```

## Environment Variables

Before building, set environment variables in `app.json` or `.env`:

```json
{
  "expo": {
    "extra": {
      "apiUrl": "https://taskjuggler-production.up.railway.app/api"
    }
  }
}
```

Or create `.env`:
```bash
EXPO_PUBLIC_API_URL=https://taskjuggler-production.up.railway.app/api
```

## App Store Submission

### iOS (App Store Connect)

1. **Build:**
   ```bash
   eas build --platform ios --profile production
   ```

2. **Submit:**
   ```bash
   eas submit --platform ios
   ```

**Requirements:**
- Apple Developer account ($99/year)
- App Store Connect app created
- App icons and screenshots
- Privacy policy URL

### Android (Google Play Store)

1. **Build:**
   ```bash
   eas build --platform android --profile production
   ```

2. **Submit:**
   ```bash
   eas submit --platform android
   ```

**Requirements:**
- Google Play Developer account ($25 one-time)
- Play Console app created
- App icons and screenshots
- Privacy policy URL

## Local Development

### Run on iOS Simulator
```bash
cd taskjuggler-app
npm run ios
# or
npx expo run:ios
```

### Run on Android Emulator
```bash
cd taskjuggler-app
npm run android
# or
npx expo run:android
```

### Start Development Server
```bash
cd taskjuggler-app
npm start
# or
npx expo start
```

## Next Steps

1. **Set up Expo account** (if not done)
2. **Configure EAS** with `eas build:configure`
3. **Add environment variables** for API URL
4. **Build development version** to test
5. **Build production version** when ready
6. **Submit to stores** when app is complete

## Notes

- EAS Build requires an Expo account (free tier available)
- Production builds may require paid EAS plan for faster builds
- iOS builds require Apple Developer account
- Android builds can be done with free Google Play account
