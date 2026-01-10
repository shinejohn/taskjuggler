# Coordinator Web App

AI-Powered Virtual Assistants for Task Juggler Platform

## Setup

```bash
npm install
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

- `VITE_API_URL` - TaskJuggler API URL (default: http://localhost:8000/api)

## Architecture

- **Framework**: Vue 3 + TypeScript + Vite
- **State Management**: Pinia
- **Routing**: Vue Router 4
- **Styling**: Tailwind CSS + Fibonacco Design System
- **API**: Laravel Sanctum (shared backend)

## Integration

This app integrates with the TaskJuggler Platform:
- Uses shared authentication via `taskjuggler-api`
- Follows Fibonacco Design System
- Shares base UI components pattern




