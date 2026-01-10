# @taskjuggler/ui - Shared Component Library

Shared shadcn-vue component library for all Vue projects in the Task Juggler monorepo.

## Installation

This package is part of the monorepo workspace. Install dependencies:

```bash
npm install
```

## Adding Components

Use the shadcn-vue CLI to add components:

```bash
npx shadcn-vue@latest add button
npx shadcn-vue@latest add card
npx shadcn-vue@latest add input
# ... etc
```

## Usage in Projects

Import components in your Vue projects:

```vue
<script setup lang="ts">
import { Button, Card } from '@taskjuggler/ui';
</script>

<template>
  <Card>
    <Button>Click me</Button>
  </Card>
</template>
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

