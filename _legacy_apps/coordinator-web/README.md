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
- Uses shared UI components from `@taskjuggler/ui` package

## UI Components

This project uses shared UI components from `@taskjuggler/ui`:

```vue
<script setup lang="ts">
import { Button, Card, Input } from '@taskjuggler/ui';
</script>
```

All base UI components (Button, Card, Input, etc.) are provided by the shared-ui package. Custom UI components have been removed in favor of the shared component library.




