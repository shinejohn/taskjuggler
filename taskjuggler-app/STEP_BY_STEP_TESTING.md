# Step-by-Step: Testing iOS & Android

**GENERATION 1.0** - Complete Testing Instructions

---

## 📋 Prerequisites Checklist

Before you start, make sure you have:

### Required (All Platforms)
- [ ] Node.js 18+ installed
- [ ] npm or yarn installed
- [ ] Expo CLI installed: `npm install -g expo-cli`
- [ ] Backend API running (or Railway URL configured)

### For iOS Testing (macOS only)
- [ ] macOS computer
- [ ] Xcode installed (from App Store)
- [ ] iOS Simulator (included with Xcode)
- [ ] OR iPhone/iPad with Expo Go app

### For Android Testing
- [ ] Android Studio installed
- [ ] Android Emulator configured
- [ ] OR Android phone with Expo Go app

---

## 🚀 Step 1: Install Dependencies

```bash
cd taskjuggler-app
npm install
```

**Expected:** Dependencies install without errors

---

## 🔧 Step 2: Configure API URL

The app needs to know where your backend API is located.

### Option A: Use Production API (Railway)

Already configured! The app is set to use:
```
https://taskjuggler-production.up.railway.app/api
```

**No changes needed** if your Railway backend is running.

### Option B: Use Local Development API

If testing with local backend:

1. **Start your backend:**
   ```bash
   cd ../taskjuggler-api
   php artisan serve
   # Server runs on http://localhost:8000
   ```

2. **Find your computer's IP address:**
   ```bash
   # macOS/Linux
   ifconfig | grep "inet " | grep -v 127.0.0.1
   # Look for something like: 192.168.1.100
   
   # Windows
   ipconfig
   # Look for IPv4 Address
   ```

3. **Update API URL in app.json:**
   ```json
   {
     "expo": {
       "extra": {
         "apiUrl": "http://YOUR_IP:8000/api"
       }
     }
   }
   ```

   **Important:**
   - For iOS Simulator: Use `http://localhost:8000/api`
   - For Android Emulator: Use `http://10.0.2.2:8000/api`
   - For Physical Device: Use `http://YOUR_IP:8000/api` (e.g., `192.168.1.100:8000/api`)

---

## 📱 Step 3: Start Development Server

```bash
cd taskjuggler-app
npx expo start
```

**What you'll see:**
- Metro bundler starting
- QR code in terminal
- Options menu:
  - Press `i` for iOS
  - Press `a` for Android
  - Press `w` for web
  - Press `r` to reload
  - Press `m` to toggle menu

---

## 🍎 Step 4A: Test on iOS Simulator

### Prerequisites
- macOS computer
- Xcode installed

### Steps

1. **Ensure Xcode is installed:**
   ```bash
   xcode-select --version
   # Should show version number
   ```

2. **Start Expo:**
   ```bash
   cd taskjuggler-app
   npx expo start
   ```

3. **Open iOS Simulator:**
   - Press `i` in terminal, OR
   - Run: `npx expo start --ios`

4. **Wait for build:**
   - First time may take 2-5 minutes
   - Simulator will open automatically
   - App will load

### Troubleshooting iOS Simulator

**"No simulators found"**
```bash
# List available simulators
xcrun simctl list devices

# Open Xcode and download simulators
# Xcode → Settings → Platforms → Download iOS Simulator
```

**"Build failed"**
```bash
# Clear cache
npx expo start --clear

# Reinstall dependencies
rm -rf node_modules
npm install
```

---

## 🤖 Step 4B: Test on Android Emulator

### Prerequisites
- Android Studio installed
- Android Emulator created

### Steps

1. **Create Android Emulator (if not done):**
   - Open Android Studio
   - Tools → Device Manager
   - Click "Create Device"
   - Choose device (e.g., Pixel 6)
   - Choose system image (API 33+)
   - Finish

2. **Start Emulator:**
   - From Android Studio: Device Manager → Play button
   - Or command line:
   ```bash
   emulator -list-avds  # List available
   emulator -avd Pixel_6_API_33  # Start specific
   ```

3. **Start Expo:**
   ```bash
   cd taskjuggler-app
   npx expo start
   ```

4. **Open Android Emulator:**
   - Press `a` in terminal, OR
   - Run: `npx expo start --android`

5. **Wait for build:**
   - First time may take 3-5 minutes
   - Emulator will open automatically
   - App will load

### Troubleshooting Android Emulator

**"No emulators found"**
```bash
# List available emulators
emulator -list-avds

# If empty, create one in Android Studio
```

**"ADB not found"**
```bash
# Add Android SDK to PATH (macOS)
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools

# Add to ~/.zshrc or ~/.bash_profile
```

---

## 📲 Step 4C: Test on Physical Device

### iOS Device (iPhone/iPad)

1. **Install Expo Go:**
   - Open App Store on your device
   - Search "Expo Go"
   - Install

2. **Start Expo:**
   ```bash
   cd taskjuggler-app
   npx expo start
   ```

3. **Connect Device:**
   - **Option A:** Open Camera app → Scan QR code
   - **Option B:** Open Expo Go app → Scan QR code
   - **Option C:** Enter URL manually in Expo Go

4. **Ensure Same Network:**
   - Device and computer must be on same WiFi
   - If not working, try: `npx expo start --tunnel`

### Android Device

1. **Enable Developer Options:**
   - Settings → About Phone
   - Tap "Build Number" 7 times
   - Go back → Developer Options

2. **Enable USB Debugging:**
   - Settings → Developer Options
   - Enable "USB Debugging"

3. **Install Expo Go:**
   - Open Play Store
   - Search "Expo Go"
   - Install

4. **Connect Device:**

   **USB Method:**
   ```bash
   # Connect via USB
   adb devices  # Verify connection
   npx expo start --android
   ```

   **WiFi Method:**
   ```bash
   npx expo start
   # Scan QR code with Expo Go app
   ```

---

## ✅ Step 5: Verify Everything Works

### Test Checklist

**Authentication:**
- [ ] Can register new account
- [ ] Can login
- [ ] Can logout
- [ ] Session persists after app restart

**Tasks:**
- [ ] Tasks list displays
- [ ] Can create new task
- [ ] Can view task details
- [ ] Can edit task
- [ ] Can complete task
- [ ] Can delete task

**Teams:**
- [ ] Teams list displays
- [ ] Can create team
- [ ] Can view team details
- [ ] Can invite members
- [ ] Can view team tasks

**Messaging:**
- [ ] Can send task message
- [ ] Can view task messages
- [ ] Can send direct message
- [ ] Can view conversations
- [ ] Unread counts work

**Navigation:**
- [ ] All tabs work
- [ ] Deep linking works
- [ ] Back button works
- [ ] Navigation is smooth

---

## 🏗️ Step 6: Build for Testing (Optional)

If you want standalone builds (not Expo Go):

### Development Build

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
- Expo account (free)
- EAS CLI: `npm install -g eas-cli`
- Login: `eas login`

### Install Build

After build completes:
- **iOS:** Download from EAS dashboard, install via TestFlight or direct link
- **Android:** Download APK, enable "Install from Unknown Sources", install

---

## 🐛 Common Issues & Solutions

### Issue: "Unable to connect to Metro"

**Solution:**
```bash
# Kill process on port 8081
lsof -ti:8081 | xargs kill -9

# Clear cache and restart
npx expo start --clear
```

### Issue: "API connection failed"

**Solutions:**
1. Check backend is running: `php artisan serve`
2. Verify API URL in `app.json`
3. Check firewall settings
4. Try tunnel mode: `npx expo start --tunnel`

### Issue: "Device not found" (Android)

**Solutions:**
```bash
# Check ADB
adb devices

# Restart ADB
adb kill-server
adb start-server

# Verify USB debugging enabled
```

### Issue: "Build takes forever"

**Solutions:**
- First build always takes longer (2-5 min)
- Ensure good internet connection
- Clear cache: `npx expo start --clear`
- Check Expo status: https://status.expo.dev

---

## 📊 Testing Summary

### Quick Commands Reference

```bash
# Start development
cd taskjuggler-app
npm install
npx expo start

# iOS Simulator
npx expo start --ios

# Android Emulator
npx expo start --android

# Physical Device
npx expo start
# Scan QR code with Expo Go

# Clear cache
npx expo start --clear

# Build for testing
eas build --platform ios --profile development
eas build --platform android --profile development
```

---

## 🎯 Success Indicators

You're successful when:
- ✅ App launches on simulator/emulator
- ✅ App launches on physical device
- ✅ Can login/register
- ✅ All features work
- ✅ No crashes
- ✅ API connections work

---

## 📚 Next Steps

After testing:
1. Fix any bugs found
2. Test on multiple devices
3. Test on different OS versions
4. Build production version
5. Submit to App Store/Play Store

---

**Status:** Ready for Testing  
**Version:** GENERATION 1.0  
**Last Updated:** December 11, 2024

