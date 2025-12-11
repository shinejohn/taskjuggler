# Complete Testing Instructions - iOS & Android

**GENERATION 1.0** - Everything You Need to Test the App

---

## 🎯 Quick Start (5 Minutes)

### Step 1: Install Dependencies
```bash
cd taskjuggler-app
npm install
```

### Step 2: Start Development Server
```bash
npx expo start
```

### Step 3: Choose Platform
- **iOS Simulator:** Press `i` or run `npx expo start --ios`
- **Android Emulator:** Press `a` or run `npx expo start --android`
- **Physical Device:** Install "Expo Go" app and scan QR code

**That's it!** The app should load.

---

## 📱 Detailed Platform Instructions

### 🍎 iOS Testing

#### Option 1: iOS Simulator (macOS only)

**Requirements:**
- macOS computer
- Xcode installed (free from App Store)

**Steps:**
1. Install Xcode from Mac App Store
2. Open Xcode → Settings → Platforms
3. Download iOS Simulator runtime
4. Run: `cd taskjuggler-app && npx expo start --ios`
5. Simulator opens automatically
6. App loads in simulator

**Available Simulators:**
- iPhone 15 Pro (recommended)
- iPhone 14 Pro
- iPhone 13
- iPad Pro

**List all:**
```bash
xcrun simctl list devices available
```

#### Option 2: Physical iOS Device

**Requirements:**
- iPhone/iPad with iOS 13+
- Same WiFi network as computer

**Steps:**
1. Install "Expo Go" from App Store
2. Run: `cd taskjuggler-app && npx expo start`
3. Open Camera app on iPhone
4. Scan QR code shown in terminal
5. App opens in Expo Go

**Troubleshooting:**
- Not connecting? Try: `npx expo start --tunnel`
- Different network? Use tunnel mode
- Still not working? Check firewall settings

---

### 🤖 Android Testing

#### Option 1: Android Emulator

**Requirements:**
- Android Studio installed
- Android Emulator created

**Steps:**
1. **Install Android Studio:**
   - Download: https://developer.android.com/studio
   - Install with default settings

2. **Create Emulator:**
   - Open Android Studio
   - Tools → Device Manager
   - Click "Create Device"
   - Choose device (Pixel 6 recommended)
   - Choose system image (API 33+)
   - Finish setup

3. **Start Emulator:**
   - From Android Studio: Click Play button
   - Or command line: `emulator -avd Pixel_6_API_33`

4. **Run App:**
   ```bash
   cd taskjuggler-app
   npx expo start --android
   ```

5. **App loads in emulator**

#### Option 2: Physical Android Device

**Requirements:**
- Android device (Android 6.0+)
- Same WiFi network OR USB connection

**Steps:**
1. **Enable Developer Mode:**
   - Settings → About Phone
   - Tap "Build Number" 7 times
   - Go back → Developer Options

2. **Enable USB Debugging:**
   - Settings → Developer Options
   - Enable "USB Debugging"

3. **Install Expo Go:**
   - Download from Google Play Store

4. **Connect Device:**

   **WiFi Method (Easiest):**
   ```bash
   cd taskjuggler-app
   npx expo start
   # Scan QR code with Expo Go app
   ```

   **USB Method:**
   ```bash
   # Connect device via USB
   adb devices  # Verify connection
   npx expo start --android
   ```

---

## 🔧 Configuration

### API URL Configuration

The app is configured to use:
```
https://taskjuggler-production.up.railway.app/api
```

**For Local Testing:**

1. **Start Backend:**
   ```bash
   cd taskjuggler-api
   php artisan serve
   ```

2. **Update `app.json`:**
   ```json
   {
     "expo": {
       "extra": {
         "apiUrl": "http://localhost:8000/api"  // iOS Simulator
         // OR
         "apiUrl": "http://10.0.2.2:8000/api"   // Android Emulator
         // OR
         "apiUrl": "http://192.168.1.100:8000/api"  // Physical Device (your IP)
       }
     }
   }
   ```

3. **Find Your IP:**
   ```bash
   # macOS/Linux
   ifconfig | grep "inet " | grep -v 127.0.0.1
   
   # Windows
   ipconfig
   ```

4. **Restart Expo:**
   ```bash
   npx expo start --clear
   ```

---

## 🧪 Testing Checklist

### Basic Functionality
- [ ] App launches
- [ ] Login screen displays
- [ ] Can register new account
- [ ] Can login
- [ ] Can logout

### Tasks
- [ ] Tasks list displays
- [ ] Can create task
- [ ] Can view task details
- [ ] Can edit task
- [ ] Can complete task
- [ ] Can delete task

### Teams
- [ ] Teams list displays
- [ ] Can create team
- [ ] Can view team details
- [ ] Can invite members
- [ ] Can view team tasks

### Messaging
- [ ] Can send task message
- [ ] Can view task messages
- [ ] Can send direct message
- [ ] Can view conversations
- [ ] Unread counts display

### Navigation
- [ ] All tabs work
- [ ] Navigation is smooth
- [ ] Back button works
- [ ] Deep linking works

---

## 🏗️ Building Standalone Apps

### Development Build (For Testing)

**iOS:**
```bash
cd taskjuggler-app
npm run build:ios:dev
# or
eas build --platform ios --profile development
```

**Android:**
```bash
cd taskjuggler-app
npm run build:android:dev
# or
eas build --platform android --profile development
```

**Requirements:**
- Expo account (free): https://expo.dev
- EAS CLI: `npm install -g eas-cli`
- Login: `eas login`

**Install:**
- iOS: Download from EAS dashboard, install via TestFlight
- Android: Download APK, enable "Unknown Sources", install

---

## 🐛 Troubleshooting

### "Unable to connect to Metro"

```bash
# Kill process on port 8081
lsof -ti:8081 | xargs kill -9

# Clear cache
npx expo start --clear
```

### "API connection failed"

1. Check backend is running
2. Verify API URL in `app.json`
3. Check firewall settings
4. Try tunnel: `npx expo start --tunnel`

### "Device not found" (Android)

```bash
# Check ADB
adb devices

# Restart ADB
adb kill-server
adb start-server
```

### "Build failed"

```bash
# Clear everything
rm -rf node_modules
npm install
npx expo start --clear
```

---

## 📚 Additional Resources

- **Expo Docs:** https://docs.expo.dev
- **React Native Docs:** https://reactnative.dev
- **EAS Build:** https://docs.expo.dev/build/introduction/
- **iOS Simulator:** https://developer.apple.com/documentation/xcode/simulating-devices
- **Android Emulator:** https://developer.android.com/studio/run/emulator

---

## ✅ Success!

You're ready when:
- ✅ App runs on iOS Simulator
- ✅ App runs on Android Emulator
- ✅ App runs on physical devices
- ✅ All features work
- ✅ No crashes

---

**Status:** Ready for Testing  
**Version:** GENERATION 1.0  
**Last Updated:** December 11, 2024
