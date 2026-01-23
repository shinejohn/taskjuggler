# Task Juggler Platform Integration Guide
## Complete Guide for Integrating New Applications into the Task Juggler Platform

**Version:** 1.0  
**Last Updated:** December 2025  
**Purpose:** This document provides comprehensive instructions for integrating new applications (like "scanner", "4process.ai", "4projects.ai") into the Task Juggler platform ecosystem, enabling code reuse, consistent design, and unified user experience.

---

## TABLE OF CONTENTS

1. [Platform Architecture Overview](#platform-architecture-overview)
2. [Design System Integration](#design-system-integration)
3. [Component Library Reuse](#component-library-reuse)
4. [Routing and Navigation](#routing-and-navigation)
5. [State Management Integration](#state-management-integration)
6. [API Integration](#api-integration)
7. [Authentication and Authorization](#authentication-and-authorization)
8. [Styling and Theming](#styling-and-theming)
9. [Build Configuration](#build-configuration)
10. [Testing Strategy](#testing-strategy)
11. [Deployment Integration](#deployment-integration)
12. [Example Integration: Scanner App](#example-integration-scanner-app)
13. [Cursor Instructions Template](#cursor-instructions-template)

---

## PLATFORM ARCHITECTURE OVERVIEW

### Platform Structure

```
taskjuggler-platform/
├── taskjuggler-api/          # Laravel 12 Backend API
├── taskjuggler-web/          # Main Task Juggler Web App
├── process-web/              # 4process.ai App
├── projects-web/             # 4projects.ai App
├── scanner-web/              # Scanner App (example)
├── shared/                   # Shared resources
│   ├── design-system/        # Fibonacco Design System
│   ├── components/           # Shared Vue components
│   ├── utilities/            # Shared utilities
│   └── types/                # Shared TypeScript types
└── infrastructure/           # AWS Infrastructure (Pulumi)
```

### Core Principles

1. **Shared Design System**: All apps use Fibonacco Design System v1.0
2. **Component Reuse**: Base UI components shared across apps
3. **Unified Authentication**: Single auth system via Laravel Sanctum
4. **Consistent API**: All apps use the same API backend
5. **Modular Architecture**: Each app is independent but integrated
6. **Shared Navigation**: Unified navigation experience

---

## DESIGN SYSTEM INTEGRATION

### Step 1: Install Design System

Each new app must integrate the Fibonacco Design System:

```bash
# Copy design system CSS
cp shared/design-system/css/design-system.css your-app/src/assets/css/
```

### Step 2: Configure Tailwind CSS

Update `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Use your app's brand colors
        primary: {
          DEFAULT: '#007AFF', // Your app's primary color
          hover: '#0056B3',
          light: 'rgba(0, 122, 255, 0.1)',
        },
        // ... other colors from design system
        'bg-primary': 'var(--color-bg-primary)',
        'bg-secondary': 'var(--color-bg-secondary)',
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        border: 'var(--color-border)',
      },
      spacing: {
        '1': 'var(--space-1)',
        '2': 'var(--space-2)',
        // ... all spacing tokens
      },
      borderRadius: {
        'sm': 'var(--radius-sm)',
        'md': 'var(--radius-md)',
        // ... all radius tokens
      },
      boxShadow: {
        '1': 'var(--shadow-1)',
        '2': 'var(--shadow-2)',
        // ... all shadow tokens
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'sans-serif'],
      },
      transitionTimingFunction: {
        'out-expo': 'var(--ease-out-expo)',
        'out': 'var(--ease-out)',
        'spring': 'var(--ease-spring)',
      },
      transitionDuration: {
        'micro': 'var(--duration-micro)',
        'fast': 'var(--duration-fast)',
        'normal': 'var(--duration-normal)',
      },
    },
  },
  plugins: [],
}
```

### Step 3: Import Design System in Main Entry

```typescript
// main.ts or main.js
import './assets/css/design-system.css'
import './style.css'
```

### Step 4: Apply Glass Surfaces

Use glass utility classes for cards and elevated surfaces:

```vue
<template>
  <div class="glass-standard rounded-lg p-6">
    <!-- Your content -->
  </div>
</template>
```

---

## COMPONENT LIBRARY REUSE

### Available Shared Components

The Task Juggler platform provides a base component library that all apps can use:

#### Base UI Components

1. **Button** (`@/components/ui/Button.vue`)
   - Variants: `primary`, `secondary`, `ghost`
   - Sizes: `sm`, `md`, `lg`
   - Supports icon slots

2. **Card** (`@/components/ui/Card.vue`)
   - Glass effect built-in
   - Padding variants: `none`, `sm`, `md`, `lg`
   - Interactive mode with hover effects

3. **Input** (`@/components/ui/Input.vue`)
   - Label, error, hint support
   - Validation states
   - Accessible by default

4. **Badge** (`@/components/ui/Badge.vue`)
   - Status variants
   - Size variants
   - Customizable colors

5. **Modal** (`@/components/ui/Modal.vue`)
   - Size variants: `sm`, `md`, `lg`, `xl`, `full`
   - Backdrop click handling
   - Animations included

6. **Avatar** (`@/components/ui/Avatar.vue`)
   - Size variants
   - Initials fallback
   - Online indicator support

7. **LoadingSpinner** (`@/components/ui/LoadingSpinner.vue`)
   - Size variants
   - Accessible animations

### Using Shared Components

#### Option 1: Copy Components (Recommended for Independence)

Copy base components to your app and customize:

```bash
# Copy base components
cp -r taskjuggler-web/src/components/ui your-app/src/components/
```

Then customize as needed for your app's specific requirements.

#### Option 2: Shared Package (For Tight Integration)

Create a shared component package:

```typescript
// shared/components/index.ts
export { default as Button } from './Button.vue'
export { default as Card } from './Card.vue'
// ... other components
```

Then import in your app:

```typescript
import { Button, Card } from '@taskjuggler/shared-components'
```

### Creating App-Specific Components

Extend base components for app-specific needs:

```vue
<!-- YourAppButton.vue -->
<template>
  <Button
    :variant="variant"
    :size="size"
    :class="['your-app-button', className]"
    @click="$emit('click', $event)"
  >
    <slot />
  </Button>
</template>

<script setup lang="ts">
import Button from '@/components/ui/Button.vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

defineProps<Props>()
defineEmits<['click']>()
</script>

<style scoped>
.your-app-button {
  /* App-specific overrides */
}
</style>
```

---

## ROUTING AND NAVIGATION

### Integration with Main Platform Navigation

#### Option 1: Standalone App (Recommended)

Your app runs independently but shares navigation patterns:

```typescript
// router/index.ts
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory('/scanner'), // Sub-path
  routes: [
    {
      path: '/',
      name: 'scanner-home',
      component: () => import('@/pages/HomePage.vue'),
    },
    // ... your routes
  ],
})
```

#### Option 2: Integrated Routes

Add your app's routes to the main Task Juggler router:

```typescript
// In taskjuggler-web/src/router/index.ts
{
  path: '/scanner',
  name: 'scanner',
  component: () => import('@scanner-web/App.vue'),
  meta: { requiresAuth: true },
  children: [
    // Scanner app routes
  ],
}
```

### Navigation Components

Use the platform's navigation components:

```vue
<template>
  <AppLayout>
    <!-- Your app content -->
  </AppLayout>
</template>

<script setup lang="ts">
import AppLayout from '@/components/layout/AppLayout.vue'
</script>
```

Or create app-specific navigation:

```vue
<!-- ScannerNav.vue -->
<template>
  <nav class="scanner-nav">
    <!-- App-specific navigation -->
  </nav>
</template>

<style scoped>
.scanner-nav {
  /* Use design system tokens */
  background: var(--color-surface-glass);
  backdrop-filter: blur(20px);
  /* ... */
}
</style>
```

---

## STATE MANAGEMENT INTEGRATION

### Using Pinia Stores

#### Option 1: Shared Stores

For platform-wide state (auth, user, etc.):

```typescript
// Use the main platform's auth store
import { useAuthStore } from '@taskjuggler-web/stores/auth'

const authStore = useAuthStore()
```

#### Option 2: App-Specific Stores

Create stores for your app's specific state:

```typescript
// stores/scanner.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useScannerStore = defineStore('scanner', () => {
  const scans = ref([])
  const loading = ref(false)
  
  const activeScans = computed(() => 
    scans.value.filter(s => s.status === 'active')
  )
  
  async function fetchScans() {
    loading.value = true
    try {
      const response = await api.get('/api/scanner/scans')
      scans.value = response.data
    } finally {
      loading.value = false
    }
  }
  
  return {
    scans,
    loading,
    activeScans,
    fetchScans,
  }
})
```

### Store Organization

```
stores/
├── auth.ts              # Shared auth (import from platform)
├── scanner.ts           # App-specific scanner state
├── scanner-settings.ts  # Scanner settings
└── scanner-history.ts   # Scan history
```

---

## API INTEGRATION

### API Client Setup

Use the platform's API client pattern:

```typescript
// api/client.ts
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://api.taskjuggler.com',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

// Request interceptor - add auth token
api.interceptors.request.use((config) => {
  const authStore = useAuthStore()
  if (authStore.token) {
    config.headers.Authorization = `Bearer ${authStore.token}`
  }
  return config
})

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const authStore = useAuthStore()
      authStore.logout()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
```

### API Service Pattern

```typescript
// api/scanner.ts
import api from './client'

export const scannerApi = {
  // Get all scans
  getScans: (params?: any) => 
    api.get('/api/scanner/scans', { params }),
  
  // Get scan by ID
  getScan: (id: string) => 
    api.get(`/api/scanner/scans/${id}`),
  
  // Create scan
  createScan: (data: any) => 
    api.post('/api/scanner/scans', data),
  
  // Update scan
  updateScan: (id: string, data: any) => 
    api.put(`/api/scanner/scans/${id}`, data),
  
  // Delete scan
  deleteScan: (id: string) => 
    api.delete(`/api/scanner/scans/${id}`),
}
```

### Backend API Endpoints

Your app's backend endpoints should follow the platform's API structure:

```php
// In taskjuggler-api/routes/api.php
Route::prefix('scanner')->middleware('auth:sanctum')->group(function () {
    Route::apiResource('scans', ScannerController::class);
    Route::post('scans/{scan}/process', [ScannerController::class, 'process']);
    // ... other scanner routes
});
```

---

## AUTHENTICATION AND AUTHORIZATION

### Using Platform Authentication

All apps use the same authentication system:

```typescript
// In your app
import { useAuthStore } from '@taskjuggler-web/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

// Check if user is authenticated
if (!authStore.isAuthenticated) {
  router.push('/login')
}

// Access user data
const user = authStore.user
```

### Route Guards

Protect routes that require authentication:

```typescript
// router/index.ts
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})
```

### Permission-Based Access

If your app needs specific permissions:

```typescript
// utils/permissions.ts
import { useAuthStore } from '@/stores/auth'

export function hasPermission(permission: string): boolean {
  const authStore = useAuthStore()
  return authStore.user?.permissions?.includes(permission) ?? false
}

// Usage
if (hasPermission('scanner:create')) {
  // Show create button
}
```

---

## STYLING AND THEMING

### Using Design System Tokens

Always use CSS custom properties from the design system:

```vue
<style scoped>
.my-component {
  /* Use design system tokens */
  padding: var(--space-6);
  border-radius: var(--radius-lg);
  background: var(--color-surface-glass);
  color: var(--color-text-primary);
  font-size: var(--font-body-large);
  
  /* Use Tailwind utilities that map to tokens */
  @apply p-6 rounded-lg;
}
</style>
```

### App-Specific Colors

Define your app's brand colors in the design system CSS:

```css
/* your-app/src/assets/css/design-system.css */
:root {
  /* Your app's brand colors */
  --color-primary: #YOUR_COLOR;
  --color-primary-hover: #YOUR_HOVER_COLOR;
  --color-primary-light: rgba(YOUR_RGB, 0.1);
  
  /* Use platform defaults for others */
  --color-bg-primary: #FFFFFF;
  /* ... */
}
```

### Dark Mode Support

Dark mode is automatically handled by the design system:

```vue
<template>
  <div class="my-component">
    <!-- Content automatically adapts to dark mode -->
  </div>
</template>

<style scoped>
.my-component {
  background: var(--color-bg-primary); /* Adapts to dark mode */
  color: var(--color-text-primary); /* Adapts to dark mode */
}
</style>
```

### Responsive Design

Use design system breakpoints:

```vue
<style scoped>
.my-component {
  padding: var(--space-4);
}

@media (min-width: 640px) {
  .my-component {
    padding: var(--space-6);
  }
}

@media (min-width: 1024px) {
  .my-component {
    padding: var(--space-8);
  }
}
</style>
```

---

## BUILD CONFIGURATION

### Vite Configuration

Your app's `vite.config.ts` should be configured for the platform:

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // Optional: Alias to shared components
      '@shared': path.resolve(__dirname, '../shared'),
    },
  },
  server: {
    port: 3001, // Use unique port for your app
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})
```

### Environment Variables

Create `.env` file:

```bash
# .env
VITE_API_URL=https://api.taskjuggler.com
VITE_APP_NAME=Scanner
VITE_APP_SLUG=scanner
```

### Package.json

```json
{
  "name": "@taskjuggler/scanner-web",
  "version": "1.0.0",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext .vue,.js,.ts"
  },
  "dependencies": {
    "vue": "^3.4.0",
    "vue-router": "^4.3.0",
    "pinia": "^2.1.0",
    "axios": "^1.6.0"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.0.0",
    "vite": "^5.0.0",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  }
}
```

---

## TESTING STRATEGY

### Unit Tests

Test components using Vitest:

```typescript
// tests/components/ScannerButton.test.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ScannerButton from '@/components/ScannerButton.vue'

describe('ScannerButton', () => {
  it('renders correctly', () => {
    const wrapper = mount(ScannerButton, {
      props: { label: 'Scan' },
    })
    expect(wrapper.text()).toContain('Scan')
  })
})
```

### Integration Tests

Test API integration:

```typescript
// tests/api/scanner.test.ts
import { describe, it, expect } from 'vitest'
import { scannerApi } from '@/api/scanner'

describe('Scanner API', () => {
  it('fetches scans', async () => {
    const scans = await scannerApi.getScans()
    expect(Array.isArray(scans.data)).toBe(true)
  })
})
```

### E2E Tests

Use Playwright for E2E testing:

```typescript
// e2e/scanner.spec.ts
import { test, expect } from '@playwright/test'

test('scanner workflow', async ({ page }) => {
  await page.goto('/scanner')
  await page.click('button:has-text("New Scan")')
  // ... test workflow
})
```

---

## DEPLOYMENT INTEGRATION

### Docker Configuration

Create `Dockerfile`:

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Nginx Configuration

```nginx
# nginx.conf
server {
    listen 80;
    server_name scanner.taskjuggler.com;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass https://api.taskjuggler.com;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### AWS Infrastructure Integration

Add your app to the Pulumi infrastructure:

```python
# infrastructure/pulumi/infrastructure/compute.py

# Add scanner app ECS service
scanner_service = aws.ecs.Service(
    f"{project_name}-{environment}-scanner",
    cluster=cluster.id,
    task_definition=scanner_task_definition.arn,
    desired_count=2,
    launch_type="FARGATE",
    network_configuration=aws.ecs.ServiceNetworkConfigurationArgs(
        subnets=private_subnet_ids,
        security_groups=[scanner_security_group.id],
        assign_public_ip=False,
    ),
    load_balancers=[aws.ecs.ServiceLoadBalancerArgs(
        target_group_arn=scanner_target_group.arn,
        container_name="scanner",
        container_port=80,
    )],
)
```

### Environment Variables in AWS

Store app-specific secrets in Secrets Manager:

```bash
aws secretsmanager create-secret \
  --name taskjuggler/production/scanner \
  --secret-string '{"api_key": "xxx", "config": "yyy"}' \
  --region us-east-1
```

---

## EXAMPLE INTEGRATION: SCANNER APP

### Project Structure

```
scanner-web/
├── src/
│   ├── assets/
│   │   └── css/
│   │       └── design-system.css    # Copied from shared
│   ├── components/
│   │   ├── ui/                       # Base components (copied)
│   │   │   ├── Button.vue
│   │   │   ├── Card.vue
│   │   │   └── index.ts
│   │   └── scanner/                  # App-specific components
│   │       ├── ScannerCard.vue
│   │       ├── ScanResult.vue
│   │       └── ScannerControls.vue
│   ├── pages/
│   │   ├── ScannerPage.vue
│   │   ├── ScanDetailPage.vue
│   │   └── ScanHistoryPage.vue
│   ├── stores/
│   │   ├── scanner.ts
│   │   └── scanner-settings.ts
│   ├── api/
│   │   ├── client.ts                 # API client
│   │   └── scanner.ts                 # Scanner endpoints
│   ├── router/
│   │   └── index.ts
│   ├── App.vue
│   └── main.ts
├── public/
├── .env
├── .env.example
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

### Implementation Steps

1. **Initialize Project**
   ```bash
   npm create vite@latest scanner-web -- --template vue-ts
   cd scanner-web
   npm install vue-router pinia axios
   npm install -D tailwindcss postcss autoprefixer
   ```

2. **Copy Design System**
   ```bash
   cp ../taskjuggler-web/src/assets/css/design-system.css src/assets/css/
   cp -r ../taskjuggler-web/src/components/ui src/components/
   ```

3. **Configure Tailwind**
   ```bash
   npx tailwindcss init -p
   # Then update tailwind.config.js as shown above
   ```

4. **Set Up API Client**
   ```typescript
   // src/api/client.ts
   // Copy from taskjuggler-web/src/utils/api.ts
   // Update baseURL to your API endpoint
   ```

5. **Create Stores**
   ```typescript
   // src/stores/scanner.ts
   // Implement scanner-specific state management
   ```

6. **Create Components**
   ```vue
   <!-- src/components/scanner/ScannerCard.vue -->
   <template>
     <Card class="scanner-card" interactive @click="handleClick">
       <!-- Use design system components -->
       <Badge :variant="statusVariant">{{ scan.status }}</Badge>
       <!-- Your scanner-specific content -->
     </Card>
   </template>
   ```

7. **Create Pages**
   ```vue
   <!-- src/pages/ScannerPage.vue -->
   <template>
     <AppLayout>
       <div class="scanner-page">
         <!-- Use design system components -->
         <Button variant="primary" @click="startScan">
           Start Scan
         </Button>
         <!-- Your scanner UI -->
       </div>
     </AppLayout>
   </template>
   ```

8. **Set Up Routing**
   ```typescript
   // src/router/index.ts
   import { createRouter, createWebHistory } from 'vue-router'
   
   const router = createRouter({
     history: createWebHistory('/scanner'),
     routes: [
       {
         path: '/',
         name: 'scanner-home',
         component: () => import('@/pages/ScannerPage.vue'),
         meta: { requiresAuth: true },
       },
       // ... other routes
     ],
   })
   ```

---

## CURSOR INSTRUCTIONS TEMPLATE

Use this template when creating Cursor instructions for new apps:

```markdown
# [App Name] - Cursor Instructions
## Integration with Task Juggler Platform

## Project Context

[App Name] is a [description] application that integrates with the Task Juggler platform. It shares the platform's design system, authentication, and API infrastructure while maintaining its own specialized functionality.

## Architecture

- **Framework**: Vue 3 + TypeScript + Vite
- **State Management**: Pinia
- **Routing**: Vue Router 7
- **Styling**: Tailwind CSS + Fibonacco Design System
- **API**: Laravel Sanctum (shared backend)
- **Deployment**: AWS ECS Fargate (via platform infrastructure)

## Design System

This app uses the Fibonacco Design System v1.0. Always:
- Use CSS custom properties (var(--color-primary), etc.)
- Apply glass morphism effects to cards (.glass-standard)
- Follow spacing system (4px base unit)
- Use design system typography scale
- Support dark mode automatically
- Ensure 44px minimum touch targets

## Component Library

Base components available:
- Button (variants: primary, secondary, ghost)
- Card (with glass effect)
- Input (with validation)
- Badge (status variants)
- Modal (with animations)
- Avatar (with initials fallback)
- LoadingSpinner

Location: `src/components/ui/`

## API Integration

- Base URL: `import.meta.env.VITE_API_URL`
- Authentication: Bearer token via Laravel Sanctum
- API client: `src/api/client.ts`
- Endpoints: `/api/[app-name]/...`

## State Management

- Auth: Use `useAuthStore()` from platform
- App state: Create app-specific stores in `src/stores/`
- Pattern: Pinia stores with TypeScript

## Routing

- Base path: `/[app-name]`
- Protected routes: Use `meta: { requiresAuth: true }`
- Navigation: Can use platform's AppLayout or create custom

## Styling Rules

1. Always use design system tokens
2. Use Tailwind utilities that map to tokens
3. Create app-specific components that extend base components
4. Maintain glass morphism aesthetic
5. Support dark mode (automatic via design system)

## File Structure

```
src/
├── assets/css/design-system.css  # Design system
├── components/
│   ├── ui/                        # Base components
│   └── [app]/                     # App-specific components
├── pages/                         # Route pages
├── stores/                        # Pinia stores
├── api/                           # API clients
├── router/                        # Vue Router config
└── utils/                         # Utilities
```

## Development Workflow

1. Use design system components first
2. Extend base components for app-specific needs
3. Follow platform's API patterns
4. Use shared authentication
5. Test with platform's test user credentials

## Integration Points

- **Authentication**: Shared via Laravel Sanctum
- **API**: Shared backend API
- **Design**: Shared design system
- **Navigation**: Can integrate with platform nav or standalone
- **Deployment**: Via platform's AWS infrastructure

## Key Files to Reference

- Design System: `PLATFORM_INTEGRATION_GUIDE.md`
- API Patterns: `taskjuggler-web/src/utils/api.ts`
- Component Examples: `taskjuggler-web/src/components/ui/`
- Store Patterns: `taskjuggler-web/src/stores/`

## Common Patterns

### Creating a New Page
```vue
<template>
  <AppLayout>
    <Card>
      <h1 class="text-headline">{{ title }}</h1>
      <!-- Content -->
    </Card>
  </AppLayout>
</template>
```

### API Call Pattern
```typescript
import { scannerApi } from '@/api/scanner'
import { useScannerStore } from '@/stores/scanner'

const store = useScannerStore()
await store.fetchScans()
```

### Form Pattern
```vue
<template>
  <form @submit.prevent="handleSubmit">
    <Input
      v-model="form.name"
      label="Name"
      :error="errors.name"
    />
    <Button type="submit" :loading="loading">
      Submit
    </Button>
  </form>
</template>
```

## Testing

- Unit tests: Vitest
- Component tests: Vue Test Utils
- E2E tests: Playwright
- API tests: Mock API responses

## Deployment

- Build: `npm run build`
- Docker: Use platform's Dockerfile pattern
- AWS: Add to platform's Pulumi infrastructure
- Environment: Use Secrets Manager for config

---

**Always reference PLATFORM_INTEGRATION_GUIDE.md for detailed integration instructions.**
```

---

## QUICK REFERENCE CHECKLIST

### Initial Setup
- [ ] Copy design system CSS
- [ ] Configure Tailwind with design tokens
- [ ] Copy base UI components
- [ ] Set up API client
- [ ] Configure routing
- [ ] Set up Pinia stores
- [ ] Create app-specific components

### Development
- [ ] Use design system tokens for styling
- [ ] Extend base components for app needs
- [ ] Follow platform API patterns
- [ ] Use shared authentication
- [ ] Implement dark mode support
- [ ] Ensure accessibility (44px touch targets, ARIA labels)
- [ ] Add loading and error states

### Testing
- [ ] Unit tests for components
- [ ] Integration tests for API
- [ ] E2E tests for workflows
- [ ] Test dark mode
- [ ] Test responsive design

### Deployment
- [ ] Create Dockerfile
- [ ] Configure Nginx
- [ ] Add to AWS infrastructure
- [ ] Set up environment variables
- [ ] Configure CI/CD
- [ ] Set up monitoring

---

## SUPPORT AND RESOURCES

### Documentation
- **Design System**: `FIBONACCO_DESIGN_SYSTEM.md`
- **Platform Architecture**: `Reference Documents/TaskJuggler_Complete_Architecture_v3.md`
- **API Documentation**: `taskjuggler-api/README.md`

### Code Examples
- **Task Juggler Web**: `taskjuggler-web/src/` (reference implementation)
- **4process.ai**: `process-web/src/` (example integration)
- **4projects.ai**: `projects-web/src/` (example integration)

### Getting Help
1. Check this integration guide first
2. Review existing app implementations
3. Reference design system documentation
4. Check platform API documentation

---

**END OF INTEGRATION GUIDE**

*This document should be stored in Claude.ai's project file and referenced when creating cursor instructions for new apps integrating with the Task Juggler platform.*
