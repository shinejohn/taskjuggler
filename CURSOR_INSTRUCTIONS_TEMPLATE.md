# Cursor Instructions Template for Task Juggler Platform Apps
## Template for Creating Comprehensive Cursor Instructions

**Purpose:** This template provides a structure for creating detailed Cursor instructions for new applications that integrate with the Task Juggler platform. Use this template and fill in the app-specific details.

---

## [APP NAME] - Cursor Instructions

### Project Overview

**[App Name]** is a [brief description] application that integrates with the Task Juggler platform ecosystem. It leverages the platform's shared design system, authentication infrastructure, and API backend while providing specialized functionality for [specific purpose].

**Key Characteristics:**
- Built with Vue 3 + TypeScript + Vite
- Uses Fibonacco Design System v1.0
- Shares authentication with Task Juggler platform
- Uses shared API backend (Laravel Sanctum)
- Deployed via AWS ECS (platform infrastructure)

---

## Architecture Context

### Technology Stack

- **Frontend Framework**: Vue 3 (Composition API)
- **Language**: TypeScript
- **Build Tool**: Vite
- **State Management**: Pinia
- **Routing**: Vue Router 7
- **Styling**: Tailwind CSS + Fibonacco Design System
- **HTTP Client**: Axios
- **Authentication**: Laravel Sanctum (shared)
- **Backend API**: Laravel 12 (shared platform API)

### Project Structure

```
[app-name]-web/
├── src/
│   ├── assets/
│   │   └── css/
│   │       └── design-system.css    # Fibonacco Design System
│   ├── components/
│   │   ├── ui/                       # Base UI components (shared pattern)
│   │   │   ├── Button.vue
│   │   │   ├── Card.vue
│   │   │   ├── Input.vue
│   │   │   ├── Badge.vue
│   │   │   ├── Modal.vue
│   │   │   ├── Avatar.vue
│   │   │   ├── LoadingSpinner.vue
│   │   │   └── index.ts
│   │   └── [app]/                    # App-specific components
│   │       └── [ComponentName].vue
│   ├── pages/                        # Route pages
│   │   ├── [PageName]Page.vue
│   │   └── ...
│   ├── stores/                       # Pinia stores
│   │   ├── [store-name].ts
│   │   └── ...
│   ├── api/                          # API clients
│   │   ├── client.ts                 # Base API client
│   │   └── [app].ts                  # App-specific endpoints
│   ├── router/                       # Vue Router
│   │   └── index.ts
│   ├── utils/                        # Utilities
│   │   └── ...
│   ├── types/                         # TypeScript types
│   │   └── index.ts
│   ├── App.vue
│   └── main.ts
├── public/
├── .env
├── .env.example
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

---

## Design System Integration

### CRITICAL: Always Use Design System

This app MUST use the Fibonacco Design System v1.0. Reference: `FIBONACCO_DESIGN_SYSTEM.md`

**Key Rules:**
1. **Colors**: Always use CSS custom properties (`var(--color-primary)`, etc.)
2. **Spacing**: Use 4px base unit system (`var(--space-4)`, etc.)
3. **Typography**: Use design system font scale
4. **Glass Surfaces**: Apply `.glass-standard` or `.glass-prominent` to cards
5. **Dark Mode**: Automatically supported via design system tokens
6. **Accessibility**: 44px minimum touch targets, ARIA labels required

### Design System Files

- **CSS**: `src/assets/css/design-system.css` (copied from platform)
- **Tailwind Config**: Configured with design tokens
- **Components**: Base components follow design system patterns

### Color Palette

**[App Name] Brand Colors:**
- Primary: `#XXXXXX` (define your app's primary color)
- Secondary: `#XXXXXX` (if applicable)
- Use platform defaults for: backgrounds, text, borders

**Implementation:**
```css
:root {
  --color-primary: #XXXXXX; /* Your app color */
  --color-primary-hover: #XXXXXX; /* Darker variant */
  --color-primary-light: rgba(XX, XX, XX, 0.1); /* Light variant */
}
```

---

## Component Library

### Base Components Available

All base components are in `src/components/ui/`:

1. **Button** - Variants: `primary`, `secondary`, `ghost` | Sizes: `sm`, `md`, `lg`
2. **Card** - Glass effect, padding variants, interactive mode
3. **Input** - Label, error, hint support, validation states
4. **Badge** - Status variants, customizable colors
5. **Modal** - Size variants, backdrop handling, animations
6. **Avatar** - Size variants, initials fallback, online indicator
7. **LoadingSpinner** - Size variants, accessible animations

### Usage Pattern

```vue
<template>
  <Card padding="md" interactive>
    <h2 class="text-headline">Title</h2>
    <Input
      v-model="value"
      label="Label"
      :error="error"
    />
    <Button variant="primary" @click="handleClick">
      Submit
    </Button>
  </Card>
</template>

<script setup lang="ts">
import Card from '@/components/ui/Card.vue'
import Input from '@/components/ui/Input.vue'
import Button from '@/components/ui/Button.vue'
</script>
```

### Creating App-Specific Components

Extend base components for app needs:

```vue
<!-- components/[app]/[ComponentName].vue -->
<template>
  <Card :class="['app-specific-card', className]">
    <!-- Extend base Card with app-specific content -->
  </Card>
</template>

<script setup lang="ts">
import Card from '@/components/ui/Card.vue'
// Add app-specific logic
</script>

<style scoped>
.app-specific-card {
  /* App-specific overrides using design tokens */
}
</style>
```

---

## API Integration

### API Client Setup

**Base Client**: `src/api/client.ts`

```typescript
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://api.taskjuggler.com',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

// Auth interceptor
api.interceptors.request.use((config) => {
  const authStore = useAuthStore()
  if (authStore.token) {
    config.headers.Authorization = `Bearer ${authStore.token}`
  }
  return config
})

// Error interceptor
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

### App-Specific API Service

**File**: `src/api/[app].ts`

```typescript
import api from './client'

export const [app]Api = {
  // List resources
  getItems: (params?: any) => 
    api.get('/api/[app]/items', { params }),
  
  // Get single resource
  getItem: (id: string) => 
    api.get(`/api/[app]/items/${id}`),
  
  // Create resource
  createItem: (data: any) => 
    api.post('/api/[app]/items', data),
  
  // Update resource
  updateItem: (id: string, data: any) => 
    api.put(`/api/[app]/items/${id}`, data),
  
  // Delete resource
  deleteItem: (id: string) => 
    api.delete(`/api/[app]/items/${id}`),
}
```

### Backend Endpoints Required

Add to `taskjuggler-api/routes/api.php`:

```php
Route::prefix('[app]')->middleware('auth:sanctum')->group(function () {
    Route::apiResource('items', [App]Controller::class);
    // ... other routes
});
```

---

## State Management

### Using Platform Auth Store

```typescript
import { useAuthStore } from '@taskjuggler-web/stores/auth'

const authStore = useAuthStore()

// Check authentication
if (!authStore.isAuthenticated) {
  router.push('/login')
}

// Access user
const user = authStore.user
```

### Creating App Stores

**File**: `src/stores/[app].ts`

```typescript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { [app]Api } from '@/api/[app]'

export const use[App]Store = defineStore('[app]', () => {
  // State
  const items = ref([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const currentItem = ref(null)
  
  // Getters
  const activeItems = computed(() => 
    items.value.filter(item => item.status === 'active')
  )
  
  // Actions
  async function fetchItems() {
    loading.value = true
    error.value = null
    try {
      const response = await [app]Api.getItems()
      items.value = response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch items'
    } finally {
      loading.value = false
    }
  }
  
  async function createItem(data: any) {
    loading.value = true
    error.value = null
    try {
      const response = await [app]Api.createItem(data)
      items.value.push(response.data)
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create item'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  return {
    items,
    loading,
    error,
    currentItem,
    activeItems,
    fetchItems,
    createItem,
  }
})
```

---

## Routing

### Router Configuration

**File**: `src/router/index.ts`

```typescript
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory('/[app]'), // Sub-path for your app
  routes: [
    {
      path: '/',
      name: '[app]-home',
      component: () => import('@/pages/HomePage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/items',
      name: '[app]-items',
      component: () => import('@/pages/ItemsPage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/items/:id',
      name: '[app]-item-detail',
      component: () => import('@/pages/ItemDetailPage.vue'),
      meta: { requiresAuth: true },
    },
  ],
})

// Auth guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})

export default router
```

---

## Styling Guidelines

### Always Use Design System Tokens

```vue
<style scoped>
.my-component {
  /* Use CSS custom properties */
  padding: var(--space-6);
  border-radius: var(--radius-lg);
  background: var(--color-surface-glass);
  color: var(--color-text-primary);
  font-size: var(--font-body-large);
  
  /* Or use Tailwind utilities that map to tokens */
  @apply p-6 rounded-lg;
}

.my-component:hover {
  background: var(--color-surface-glass-hover);
  box-shadow: var(--shadow-2);
}
</style>
```

### Glass Surfaces

Always use glass effect for cards and elevated surfaces:

```vue
<template>
  <div class="glass-standard rounded-lg p-6">
    <!-- Content -->
  </div>
</template>
```

### Responsive Design

```vue
<style scoped>
.component {
  padding: var(--space-4);
}

@media (min-width: 640px) {
  .component {
    padding: var(--space-6);
  }
}

@media (min-width: 1024px) {
  .component {
    padding: var(--space-8);
  }
}
</style>
```

---

## Common Patterns

### Page Template

```vue
<template>
  <AppLayout>
    <div class="page-container">
      <h1 class="page-title">{{ title }}</h1>
      
      <div v-if="loading" class="page-loading">
        <LoadingSpinner />
        <span>Loading...</span>
      </div>
      
      <div v-else-if="error" class="page-error">
        <p>{{ error }}</p>
        <Button @click="retry">Retry</Button>
      </div>
      
      <div v-else class="page-content">
        <!-- Content -->
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import AppLayout from '@/components/layout/AppLayout.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import Button from '@/components/ui/Button.vue'
import { use[App]Store } from '@/stores/[app]'

const store = use[App]Store()
const loading = computed(() => store.loading)
const error = computed(() => store.error)

onMounted(() => {
  store.fetchItems()
})
</script>
```

### Form Pattern

```vue
<template>
  <Card>
    <form @submit.prevent="handleSubmit" class="form">
      <Input
        v-model="form.name"
        label="Name"
        :error="errors.name"
        required
      />
      
      <Input
        v-model="form.description"
        label="Description"
        type="textarea"
        :hint="'Optional description'"
      />
      
      <div class="form-actions">
        <Button variant="ghost" @click="cancel">Cancel</Button>
        <Button type="submit" variant="primary" :disabled="loading">
          <LoadingSpinner v-if="loading" size="sm" />
          Save
        </Button>
      </div>
    </form>
  </Card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Card from '@/components/ui/Card.vue'
import Input from '@/components/ui/Input.vue'
import Button from '@/components/ui/Button.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import { use[App]Store } from '@/stores/[app]'

const store = use[App]Store()
const form = ref({ name: '', description: '' })
const errors = ref({})
const loading = ref(false)

async function handleSubmit() {
  loading.value = true
  errors.value = {}
  try {
    await store.createItem(form.value)
    // Success handling
  } catch (err: any) {
    if (err.response?.status === 422) {
      errors.value = err.response.data.errors
    }
  } finally {
    loading.value = false
  }
}
</script>
```

### List/Grid Pattern

```vue
<template>
  <div class="items-grid">
    <Card
      v-for="item in items"
      :key="item.id"
      class="item-card"
      interactive
      @click="handleItemClick(item)"
    >
      <h3 class="item-title">{{ item.name }}</h3>
      <Badge :variant="getStatusVariant(item.status)">
        {{ item.status }}
      </Badge>
    </Card>
  </div>
</template>

<script setup lang="ts">
import Card from '@/components/ui/Card.vue'
import Badge from '@/components/ui/Badge.vue'
import { use[App]Store } from '@/stores/[app]'

const store = use[App]Store()
const items = computed(() => store.items)

function getStatusVariant(status: string) {
  // Map status to badge variant
  return status === 'active' ? 'completed' : 'pending'
}
</script>

<style scoped>
.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--space-6);
}
</style>
```

---

## Testing Requirements

### Unit Tests

```typescript
// tests/components/[Component].test.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Component from '@/components/[app]/Component.vue'

describe('Component', () => {
  it('renders correctly', () => {
    const wrapper = mount(Component, {
      props: { /* props */ },
    })
    expect(wrapper.text()).toContain('Expected text')
  })
})
```

### Integration Tests

```typescript
// tests/api/[app].test.ts
import { describe, it, expect } from 'vitest'
import { [app]Api } from '@/api/[app]'

describe('[App] API', () => {
  it('fetches items', async () => {
    const response = await [app]Api.getItems()
    expect(response.data).toBeDefined()
  })
})
```

---

## Deployment Checklist

- [ ] Design system CSS copied and imported
- [ ] Tailwind configured with design tokens
- [ ] Base components copied
- [ ] API client configured
- [ ] Stores created
- [ ] Routes configured with auth guards
- [ ] All components use design system tokens
- [ ] Dark mode tested
- [ ] Responsive design tested
- [ ] Accessibility verified (44px touch targets, ARIA labels)
- [ ] Unit tests written
- [ ] Integration tests written
- [ ] Dockerfile created
- [ ] Environment variables documented
- [ ] Added to AWS infrastructure (if needed)

---

## Key Files to Reference

1. **Design System**: `FIBONACCO_DESIGN_SYSTEM.md`
2. **Integration Guide**: `PLATFORM_INTEGRATION_GUIDE.md`
3. **Task Juggler Web** (reference): `taskjuggler-web/src/`
4. **4process.ai** (example): `process-web/src/`
5. **4projects.ai** (example): `projects-web/src/`

---

## Development Rules

1. **Always use design system tokens** - Never hardcode colors, spacing, etc.
2. **Extend base components** - Don't recreate what exists
3. **Follow API patterns** - Use the same client setup and error handling
4. **Use shared authentication** - Don't create separate auth
5. **Maintain glass aesthetic** - Apply glass effects to cards
6. **Support dark mode** - It's automatic via design system
7. **Ensure accessibility** - 44px touch targets, ARIA labels, keyboard nav
8. **Write tests** - Unit and integration tests required
9. **Document components** - Add JSDoc comments
10. **Follow TypeScript** - Use proper types, avoid `any`

---

## Common Mistakes to Avoid

❌ **Don't**: Hardcode colors like `color: #007AFF`  
✅ **Do**: Use `color: var(--color-primary)`

❌ **Don't**: Create new button component from scratch  
✅ **Do**: Extend or use existing `Button` component

❌ **Don't**: Create separate authentication system  
✅ **Do**: Use platform's `useAuthStore()`

❌ **Don't**: Use fixed pixel values for spacing  
✅ **Do**: Use design system spacing tokens

❌ **Don't**: Ignore dark mode  
✅ **Do**: Use design system tokens (automatic dark mode)

❌ **Don't**: Skip accessibility  
✅ **Do**: 44px touch targets, ARIA labels, keyboard navigation

---

**END OF CURSOR INSTRUCTIONS TEMPLATE**

*Fill in app-specific details and store this in Claude.ai's project file for comprehensive cursor instructions.*
