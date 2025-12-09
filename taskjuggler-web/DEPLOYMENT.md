# Task Juggler Web - Deployment Guide

## Vercel/Netlify Deployment

### Environment Variables

```bash
VITE_API_URL=https://your-api.railway.app/api
VITE_PUSHER_APP_KEY=your-pusher-key
VITE_PUSHER_APP_CLUSTER=mt1
```

### Build Command
```bash
npm run build
```

### Output Directory
```
dist
```

## Local Development

1. Install dependencies: `npm install`
2. Create `.env` file with environment variables
3. Run dev server: `npm run dev`
