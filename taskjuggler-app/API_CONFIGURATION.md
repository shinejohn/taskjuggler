# API Configuration Guide

**GENERATION 1.0** - How to Configure API URL for Testing

---

## 📍 Current Configuration

The app is currently configured to use:
```
https://taskjuggler-production.up.railway.app/api
```

This is set in `app.json` and read by `utils/api.ts`.

---

## 🔧 How API URL is Configured

### Configuration File: `app.json`

```json
{
  "expo": {
    "extra": {
      "apiUrl": "https://taskjuggler-production.up.railway.app/api"
    }
  }
}
```

### API Client: `utils/api.ts`

```typescript
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.apiUrl || 
  'https://taskjuggler-production.up.railway.app/api';
```

---

## 🌐 Testing Scenarios

### Scenario 1: Production API (Railway)

**Already configured!** No changes needed.

- ✅ Works on all platforms
- ✅ Works on simulators/emulators
- ✅ Works on physical devices
- ✅ Works across networks

**Use this if:** Your Railway backend is deployed and running.

---

### Scenario 2: Local Development API

If you want to test with local backend running on your computer:

#### For iOS Simulator

**Update `app.json`:**
```json
{
  "expo": {
    "extra": {
      "apiUrl": "http://localhost:8000/api"
    }
  }
}
```

**Start backend:**
```bash
cd taskjuggler-api
php artisan serve
# Runs on http://localhost:8000
```

#### For Android Emulator

**Update `app.json`:**
```json
{
  "expo": {
    "extra": {
      "apiUrl": "http://10.0.2.2:8000/api"
    }
  }
}
```

**Note:** Android emulator uses `10.0.2.2` to access host machine's `localhost`.

#### For Physical Device

**Step 1: Find your computer's IP**
```bash
# macOS/Linux
ifconfig | grep "inet " | grep -v 127.0.0.1
# Example output: inet 192.168.1.100

# Windows
ipconfig
# Look for IPv4 Address
```

**Step 2: Update `app.json`:**
```json
{
  "expo": {
    "extra": {
      "apiUrl": "http://192.168.1.100:8000/api"
    }
  }
}
```

**Replace `192.168.1.100` with your actual IP address.**

**Step 3: Start backend:**
```bash
cd taskjuggler-api
php artisan serve --host=0.0.0.0
# This allows connections from network
```

**Step 4: Ensure same WiFi network**
- Device and computer must be on same WiFi
- Check firewall allows connections on port 8000

---

### Scenario 3: Tunnel Mode (Cross-Network)

If device and computer are on different networks:

**Start Expo with tunnel:**
```bash
npx expo start --tunnel
```

This creates a tunnel that works across networks, but:
- ⚠️ Slower than local network
- ⚠️ Requires internet connection
- ✅ Works from anywhere

---

## 🔄 Switching Between Configurations

### Quick Switch Method

Create different config files:

**app.json.production:**
```json
{
  "expo": {
    "extra": {
      "apiUrl": "https://taskjuggler-production.up.railway.app/api"
    }
  }
}
```

**app.json.local:**
```json
{
  "expo": {
    "extra": {
      "apiUrl": "http://localhost:8000/api"
    }
  }
}
```

**Switch:**
```bash
# Use production
cp app.json.production app.json

# Use local
cp app.json.local app.json

# Restart Expo
npx expo start --clear
```

---

## ✅ Verification

### Check Current API URL

Add this to any screen temporarily:
```typescript
import Constants from 'expo-constants';

console.log('API URL:', Constants.expoConfig?.extra?.apiUrl);
```

### Test Connection

1. Start backend
2. Start mobile app
3. Try to login
4. Check network tab in Expo DevTools
5. Verify requests go to correct URL

---

## 🐛 Troubleshooting

### "Network request failed"

**Causes:**
- Backend not running
- Wrong API URL
- Firewall blocking
- Different networks

**Solutions:**
1. Verify backend: `curl http://localhost:8000/api/health`
2. Check API URL in app
3. Check firewall settings
4. Try tunnel mode: `npx expo start --tunnel`

### "Connection refused"

**Causes:**
- Backend not listening on correct interface
- Wrong IP address

**Solutions:**
```bash
# Start backend on all interfaces
php artisan serve --host=0.0.0.0

# Verify IP address
ifconfig  # macOS/Linux
ipconfig  # Windows
```

### "CORS error" (if testing web)

**Solution:**
Add CORS configuration in Laravel backend:
```php
// config/cors.php
'paths' => ['api/*'],
'allowed_origins' => ['*'],
```

---

## 📋 Configuration Checklist

- [ ] API URL set in `app.json`
- [ ] Backend is running
- [ ] Backend accessible from device/emulator
- [ ] Same network (for local testing)
- [ ] Firewall allows connections
- [ ] API URL verified in app

---

## 🎯 Recommended Setup

### For Development
- Use local API: `http://localhost:8000/api` (iOS Simulator)
- Use local API: `http://10.0.2.2:8000/api` (Android Emulator)
- Use network IP: `http://YOUR_IP:8000/api` (Physical Device)

### For Testing
- Use production API: `https://taskjuggler-production.up.railway.app/api`

### For Production
- Use production API: `https://taskjuggler-production.up.railway.app/api`

---

**Current Configuration:** Production API (Railway)  
**Status:** ✅ Ready for Testing  
**Last Updated:** December 11, 2024

