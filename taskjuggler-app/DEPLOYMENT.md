# Task Juggler Mobile - Deployment Guide

## Expo Deployment

### Build for Production

#### iOS
```bash
eas build --platform ios
```

#### Android
```bash
eas build --platform android
```

### Environment Variables

Set in `app.json` or `.env`:
```bash
EXPO_PUBLIC_API_URL=https://your-api.railway.app/api
```

### App Store Submission

1. Configure `app.json` with app details
2. Build with EAS: `eas build --platform ios --profile production`
3. Submit: `eas submit --platform ios`

### Android Play Store

1. Build: `eas build --platform android --profile production`
2. Submit: `eas submit --platform android`
