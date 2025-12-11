# iOS & Android Testing Guide - Task Juggler Mobile App

**Version:** GENERATION 1.0  
**Date:** December 11, 2024

---

## 📱 Overview

This guide covers everything you need to test the Task Juggler mobile app on both iOS and Android platforms, including simulators, emulators, and physical devices.

---

## 🛠️ Prerequisites

### Required Software

1. **Node.js** (v18 or higher)
   ```bash
   node --version  # Should be 18+
   ```

2. **npm** or **yarn**
   ```bash
   npm --version
   ```

3. **Expo CLI**
   ```bash
   npm install -g expo-cli
   # or
   npm install -g @expo/cli
   ```

4. **EAS CLI** (for building)
   ```bash
   npm install -g eas-cli
   ```

### For iOS Development

5. **Xcode** (macOS only)
   - Download from Mac App Store
   - Includes iOS Simulator
   - Requires Apple Developer account (free for simulator, paid for device testing)

6. **CocoaPods** (for iOS dependencies)
   ```bash
   sudo gem install cocoapods
   ```

### For Android Development

7. **Android Studio**
   - Download from: https://developer.android.com/studio
   - Includes Android Emulator
   - Requires Java Development Kit (JDK)

8. **Java Development Kit (JDK)**
   - JDK 17 or higher
   - Usually included with Android Studio

---

## 🚀 Quick Start

### Step 1: Install Dependencies

```bash
cd taskjuggler-app
npm install
```

### Step 2: Start Development Server

```bash
npx expo start
```

This will:
- Start the Metro bundler
- Show a QR code in terminal
- Open Expo DevTools in browser

---

## 📱 Testing on iOS

### Option 1: iOS Simulator (macOS only)

#### Setup iOS Simulator

1. **Install Xcode** (if not already installed)
   ```bash
   # Check if Xcode is installed
   xcode-select --version
   ```

2. **Open Xcode**
   - Go to Xcode → Settings → Platforms
   - Download iOS Simulator runtime

3. **List Available Simulators**
   ```bash
   xcrun simctl list devices
   ```

#### Run on iOS Simulator

**Method 1: From Expo CLI**
```bash
cd taskjuggler-app
npx expo start
# Press 'i' to open iOS simulator
```

**Method 2: Direct Command**
```bash
npx expo start --ios
```

**Method 3: Specific Simulator**
```bash
npx expo start --ios --simulator="iPhone 15 Pro"
```

#### Available iOS Simulators

Common simulators:
- iPhone 15 Pro
- iPhone 15
- iPhone 14 Pro
- iPhone 13
- iPad Pro (12.9-inch)

List all:
```bash
xcrun simctl list devices available
```

### Option 2: Physical iOS Device

#### Requirements
- iPhone or iPad running iOS 13+
- Apple ID (free account works)
- Same WiFi network as development machine

#### Steps

1. **Install Expo Go App**
   - Download "Expo Go" from App Store on your iPhone/iPad

2. **Start Development Server**
   ```bash
   cd taskjuggler-app
   npx expo start
   ```

3. **Connect Device**
   - **Option A:** Scan QR code with Camera app (iOS 11+)
   - **Option B:** Open Expo Go app and scan QR code
   - **Option C:** Enter URL manually in Expo Go

4. **Troubleshooting**
   - Ensure device and computer are on same WiFi
   - Check firewall settings
   - Try `npx expo start --tunnel` if local network doesn't work

---

## 🤖 Testing on Android

### Option 1: Android Emulator

#### Setup Android Emulator

1. **Install Android Studio**
   - Download from: https://developer.android.com/studio
   - Install with default settings

2. **Create Virtual Device**
   - Open Android Studio
   - Tools → Device Manager
   - Click "Create Device"
   - Select device (e.g., Pixel 6)
   - Select system image (API 33+ recommended)
   - Finish setup

3. **Start Emulator**
   - From Android Studio: Device Manager → Play button
   - Or from command line:
   ```bash
   emulator -avd Pixel_6_API_33
   ```

#### Run on Android Emulator

**Method 1: From Expo CLI**
```bash
cd taskjuggler-app
npx expo start
# Press 'a' to open Android emulator
```

**Method 2: Direct Command**
```bash
npx expo start --android
```

**Method 3: Specific Emulator**
```bash
# List available emulators
emulator -list-avds

# Start specific emulator
emulator -avd Pixel_6_API_33 &
npx expo start --android
```

### Option 2: Physical Android Device

#### Requirements
- Android device running Android 6.0+ (API 23+)
- USB debugging enabled
- Same WiFi network OR USB connection

#### Steps

1. **Enable Developer Options**
   - Settings → About Phone
   - Tap "Build Number" 7 times
   - Go back → Developer Options

2. **Enable USB Debugging**
   - Settings → Developer Options
   - Enable "USB Debugging"
   - Enable "Install via USB" (if available)

3. **Install Expo Go App**
   - Download "Expo Go" from Google Play Store

4. **Connect Device**

   **Option A: USB Connection**
   ```bash
   # Connect device via USB
   # Verify connection
   adb devices
   
   # Start Expo
   cd taskjuggler-app
   npx expo start --android
   ```

   **Option B: WiFi Connection**
   ```bash
   cd taskjuggler-app
   npx expo start
   # Scan QR code with Expo Go app
   ```

5. **Troubleshooting**
   - Install ADB: `brew install android-platform-tools` (macOS)
   - Check connection: `adb devices`
   - Try `npx expo start --tunnel` if local network doesn't work

---

## 🔧 Development Commands

### Start Development Server

```bash
cd taskjuggler-app
npx expo start
```

**Options:**
- `--ios` - Open iOS simulator
- `--android` - Open Android emulator
- `--web` - Open in web browser
- `--tunnel` - Use tunnel (works across networks)
- `--clear` - Clear cache

### Useful Expo Commands

```bash
# Clear cache and restart
npx expo start --clear

# Start with tunnel (for remote testing)
npx expo start --tunnel

# Run on specific platform
npx expo run:ios
npx expo run:android

# Install dependencies
npx expo install --fix

# Check for updates
npx expo-doctor
```

---

## 🏗️ Building for Production

### Development Build (Recommended for Testing)

#### iOS Development Build

1. **Configure EAS**
   ```bash
   cd taskjuggler-app
   eas build:configure
   ```

2. **Build for iOS**
   ```bash
   eas build --platform ios --profile development
   ```

3. **Install on Device**
   - Download from EAS build page
   - Install via TestFlight (recommended)
   - Or install directly via link

#### Android Development Build

1. **Build for Android**
   ```bash
   eas build --platform android --profile development
   ```

2. **Install on Device**
   - Download APK from EAS build page
   - Enable "Install from Unknown Sources"
   - Install APK

### Production Build

#### iOS Production Build

```bash
eas build --platform ios --profile production
```

**Requirements:**
- Apple Developer account ($99/year)
- App Store Connect setup
- Certificates and provisioning profiles

#### Android Production Build

```bash
eas build --platform android --profile production
```

**Requirements:**
- Google Play Console account ($25 one-time)
- Signing key configured

---

## 🧪 Testing Checklist

### iOS Testing

- [ ] App launches successfully
- [ ] Login/Register works
- [ ] Tasks list displays
- [ ] Create task works
- [ ] Edit task works
- [ ] Teams list displays
- [ ] Create team works
- [ ] Team invitations work
- [ ] Task messaging works
- [ ] Direct messaging works
- [ ] Navigation works
- [ ] Notifications work (if configured)
- [ ] Offline handling (if implemented)

### Android Testing

- [ ] App launches successfully
- [ ] Login/Register works
- [ ] Tasks list displays
- [ ] Create task works
- [ ] Edit task works
- [ ] Teams list displays
- [ ] Create team works
- [ ] Team invitations work
- [ ] Task messaging works
- [ ] Direct messaging works
- [ ] Navigation works
- [ ] Notifications work (if configured)
- [ ] Offline handling (if implemented)

---

## 🐛 Troubleshooting

### Common Issues

#### "Unable to connect to Metro bundler"

**Solutions:**
```bash
# Clear cache
npx expo start --clear

# Check if port 8081 is available
lsof -ti:8081 | xargs kill -9

# Restart Metro
npx expo start
```

#### "Device not found" (Android)

**Solutions:**
```bash
# Check ADB connection
adb devices

# Restart ADB
adb kill-server
adb start-server

# Check USB debugging is enabled
```

#### "Build failed" (iOS)

**Solutions:**
```bash
# Clean build folder
cd ios
rm -rf build
cd ..

# Reinstall pods
cd ios
pod deintegrate
pod install
cd ..

# Try again
npx expo run:ios
```

#### "Expo Go not connecting"

**Solutions:**
- Ensure same WiFi network
- Try tunnel mode: `npx expo start --tunnel`
- Check firewall settings
- Restart Expo Go app
- Clear Expo Go cache

---

## 📋 Environment Setup Checklist

### macOS (iOS + Android)

- [ ] Node.js installed
- [ ] npm/yarn installed
- [ ] Expo CLI installed
- [ ] Xcode installed
- [ ] Android Studio installed
- [ ] Java JDK installed
- [ ] Android SDK configured
- [ ] Environment variables set

### Windows (Android only)

- [ ] Node.js installed
- [ ] npm/yarn installed
- [ ] Expo CLI installed
- [ ] Android Studio installed
- [ ] Java JDK installed
- [ ] Android SDK configured
- [ ] Environment variables set

---

## 🔐 API Configuration

### Backend API URL

Make sure your mobile app is configured to connect to the correct API:

**Development:**
```typescript
// In your API config file
const API_URL = 'http://localhost:8000/api';
// or
const API_URL = 'http://192.168.1.100:8000/api'; // Your local IP
```

**Production:**
```typescript
const API_URL = 'https://your-api-domain.com/api';
```

### Testing with Local Backend

1. **Start Backend Server**
   ```bash
   cd taskjuggler-api
   php artisan serve
   # Server runs on http://localhost:8000
   ```

2. **Update API URL in Mobile App**
   - For iOS Simulator: `http://localhost:8000/api`
   - For Android Emulator: `http://10.0.2.2:8000/api`
   - For Physical Device: `http://YOUR_IP:8000/api`

3. **Find Your IP Address**
   ```bash
   # macOS/Linux
   ifconfig | grep "inet "
   
   # Windows
   ipconfig
   ```

---

## 📱 Device-Specific Testing

### iOS Device Testing

**TestFlight (Recommended)**
1. Build with EAS: `eas build --platform ios`
2. Submit to TestFlight
3. Invite testers
4. Test on real devices

**Direct Install**
1. Build development build
2. Download IPA
3. Install via Xcode or Apple Configurator

### Android Device Testing

**Google Play Internal Testing**
1. Build with EAS: `eas build --platform android`
2. Upload to Play Console
3. Add testers
4. Test on real devices

**Direct Install**
1. Build APK
2. Transfer to device
3. Enable "Install from Unknown Sources"
4. Install APK

---

## 🎯 Quick Reference

### Start Development

```bash
cd taskjuggler-app
npm install
npx expo start
```

### iOS Simulator
```bash
npx expo start --ios
```

### Android Emulator
```bash
npx expo start --android
```

### Physical Device
```bash
npx expo start
# Scan QR code with Expo Go
```

### Build for Testing
```bash
eas build --platform ios --profile development
eas build --platform android --profile development
```

---

## 📚 Additional Resources

- **Expo Documentation:** https://docs.expo.dev
- **React Native Documentation:** https://reactnative.dev
- **EAS Build Documentation:** https://docs.expo.dev/build/introduction/
- **iOS Simulator Guide:** https://developer.apple.com/documentation/xcode/simulating-devices
- **Android Emulator Guide:** https://developer.android.com/studio/run/emulator

---

## ✅ Success Criteria

Your app is ready when:
- ✅ Runs on iOS Simulator
- ✅ Runs on Android Emulator
- ✅ Runs on physical iOS device
- ✅ Runs on physical Android device
- ✅ All features work correctly
- ✅ API connections work
- ✅ Navigation is smooth
- ✅ No crashes or errors

---

**Status:** Ready for Testing  
**Version:** GENERATION 1.0  
**Last Updated:** December 11, 2024
