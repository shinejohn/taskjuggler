# TaskJuggler Web App

Vue 3 + TypeScript + Vite project for Task Juggler Platform

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

## UI Components

This project uses shared UI components from `@taskjuggler/ui`:

```vue
<script setup lang="ts">
import { Button, Card, Input } from '@taskjuggler/ui';
</script>
```

All base UI components are provided by the shared-ui package. Custom UI components (Button, Card, Input) have been removed in favor of the shared component library.
