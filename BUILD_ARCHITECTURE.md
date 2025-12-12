# Build Architecture - Task Juggler

## Overview

Task Juggler consists of **three separate applications** that are built and deployed independently:

1. **Laravel Backend API** (`taskjuggler-api`) - PHP + PostgreSQL
2. **Vue.js Web Frontend** (`taskjuggler-web`) - Vue 3 + Vite + Tailwind
3. **React Native Mobile App** (`taskjuggler-app`) - Expo + React Native

---

## Laravel Backend Build

### Why Node.js is Required

Laravel 12 uses **Vite** to compile its CSS and JavaScript assets:
- `resources/css/app.css` → compiled CSS
- `resources/js/app.js` → compiled JavaScript
- Tailwind CSS compilation

**Node.js is ONLY needed for building Laravel's own assets, NOT for the separate Vue.js frontend.**

### Build Process

1. Install PHP 8.2 + Node.js 20
2. Install Composer dependencies
3. Install npm dependencies (for Vite)
4. Build Laravel assets: `npm run build`
5. Cache Laravel config/routes/views
6. Start PHP server

### Configuration Files

- `nixpacks.toml` - Defines the build phases
- `railway.json` - Railway deployment config (uses Nixpacks)

---

## Vue.js Web Frontend

### Deployment

The Vue.js frontend (`taskjuggler-web`) is a **separate SPA** that should be deployed to:
- Vercel
- Netlify
- Railway (separate service)
- Any static hosting service

### Build Command

```bash
cd taskjuggler-web
npm ci
VITE_API_URL=https://your-api.railway.app/api npm run build
```

### Environment Variables

- `VITE_API_URL` - Backend API URL
- `VITE_PUSHER_APP_KEY` - Pusher key for real-time
- `VITE_PUSHER_APP_CLUSTER` - Pusher cluster

---

## React Native Mobile App

### Deployment

The mobile app (`taskjuggler-app`) is built using:
- Expo EAS Build (for iOS/Android)
- Separate build process (see `taskjuggler-app/build.sh`)

### Build Command

```bash
cd taskjuggler-app
eas build --platform all --profile production
```

---

## Summary

| Component | Technology | Build Tool | Node.js Required? | Deploy Where? |
|-----------|-----------|------------|-------------------|---------------|
| Laravel Backend | PHP 8.2 | Composer + Vite | ✅ Yes (for Vite) | Railway |
| Vue Web Frontend | Vue 3 | Vite | ✅ Yes | Vercel/Netlify |
| Mobile App | React Native | Expo EAS | ✅ Yes | Expo |

---

## Key Points

1. **Laravel backend needs Node.js** to compile its own CSS/JS assets via Vite
2. **Vue.js frontend is separate** - deploy independently, don't bundle with Laravel
3. **Each application builds independently** - no cross-dependencies in build process
4. **Laravel serves API only** - not the Vue.js frontend

---

## Current Build Configuration

### `nixpacks.toml`
- Installs PHP 8.2 + Node.js 20
- Builds Laravel assets with Vite
- Caches Laravel config/routes/views
- Starts PHP server

### `railway.json`
- Uses Nixpacks builder
- Starts Laravel server on `$PORT`

---

## Troubleshooting

If build fails:
1. Check Node.js version (should be 20)
2. Verify `package.json` exists in `taskjuggler-api`
3. Ensure `vite.config.js` is correct
4. Check Laravel asset paths in `resources/`
