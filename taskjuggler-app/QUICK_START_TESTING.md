# Quick Start: Testing iOS & Android

**GENERATION 1.0** - Quick Reference Guide

---

## 🚀 Fastest Way to Test

### Step 1: Install Dependencies (One Time)

```bash
cd taskjuggler-app
npm install
```

### Step 2: Start Development Server

```bash
npx expo start
```

### Step 3: Choose Your Platform

**For iOS Simulator (macOS only):**
- Press `i` in terminal, OR
- Run: `npx expo start --ios`

**For Android Emulator:**
- Press `a` in terminal, OR
- Run: `npx expo start --android`

**For Physical Device:**
- Install "Expo Go" app on your phone
- Scan QR code shown in terminal
- App will load on your device

---

## 📱 Testing on Physical Devices

### iOS Device (iPhone/iPad)

1. **Install Expo Go** from App Store
2. **Start server:** `npx expo start`
3. **Open Camera app** and scan QR code
4. **App opens** in Expo Go

### Android Device

1. **Install Expo Go** from Google Play
2. **Start server:** `npx expo start`
3. **Open Expo Go app** and scan QR code
4. **App opens** in Expo Go

**Note:** Device and computer must be on same WiFi network

---

## 🔧 If Something Doesn't Work

### Clear Cache
```bash
npx expo start --clear
```

### Check Backend is Running
```bash
cd ../taskjuggler-api
php artisan serve
# Should show: Server running on http://localhost:8000
```

### Update API URL for Device Testing

If testing on physical device, update API URL to your computer's IP:

1. **Find your IP:**
   ```bash
   # macOS/Linux
   ifconfig | grep "inet " | grep -v 127.0.0.1
   
   # Windows
   ipconfig
   # Look for IPv4 Address (e.g., 192.168.1.100)
   ```

2. **Update API config** in mobile app:
   - Look for API configuration file
   - Change from `localhost` to your IP (e.g., `192.168.1.100:8000`)

---

## ✅ Quick Test Checklist

- [ ] App launches
- [ ] Can login/register
- [ ] Tasks list shows
- [ ] Can create task
- [ ] Teams work
- [ ] Messaging works

---

## 🎯 That's It!

You're ready to test. For detailed instructions, see `IOS_ANDROID_TESTING_GUIDE.md`

