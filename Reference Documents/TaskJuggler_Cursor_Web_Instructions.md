# Task Juggler - Vue/Vite Web Dashboard
## Complete Cursor Instructions

---

## Project Overview

You are building the web dashboard for Task Juggler using:
- Vue 3 (Composition API with `<script setup>`)
- Vite
- Pinia (state management)
- Vue Router
- Tailwind CSS
- Headless UI
- Laravel Echo + Pusher (real-time)

The dashboard allows users to:
- View and manage tasks
- Configure AI receptionist channels
- Create and manage routing rules
- Manage team members
- Access the marketplace
- View vendor dashboard (for vendors)

---

## Initial Setup

### Create Project

```bash
npm create vite@latest taskjuggler-web -- --template vue-ts
cd taskjuggler-web
```

### Install Dependencies

```bash
# Core
npm install vue-router@4 pinia @vueuse/core axios
npm install @headlessui/vue @heroicons/vue

# Styling
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Real-time
npm install laravel-echo pusher-js

# Forms & Validation
npm install vee-validate @vee-validate/zod zod

# Utilities
npm install date-fns
npm install -D @types/node
```

### Configure Tailwind

```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
      },
    },
  },
  plugins: [],
}
```

```css
/* src/assets/main.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  .btn {
    @apply px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2;
  }
  .btn-primary {
    @apply bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500;
  }
  .btn-secondary {
    @apply bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500;
  }
  .btn-danger {
    @apply bg-red-600 text-white hover:bg-red-700 focus:ring-red-500;
  }
  .input {
    @apply block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500;
  }
  .label {
    @apply block text-sm font-medium text-gray-700 mb-1;
  }
  .card {
    @apply bg-white rounded-lg shadow p-6;
  }
}
```

---

## Directory Structure

```
src/
├── assets/
│   └── main.css
├── components/
│   ├── common/
│   │   ├── AppHeader.vue
│   │   ├── AppSidebar.vue
│   │   ├── LoadingSpinner.vue
│   │   ├── EmptyState.vue
│   │   ├── ConfirmModal.vue
│   │   └── Pagination.vue
│   ├── tasks/
│   │   ├── TaskList.vue
│   │   ├── TaskCard.vue
│   │   ├── TaskDetail.vue
│   │   ├── TaskForm.vue
│   │   └── TaskFilters.vue
│   ├── inbox/
│   │   ├── InboxList.vue
│   │   ├── InboxItem.vue
│   │   └── InboxDetail.vue
│   ├── routing/
│   │   ├── RuleList.vue
│   │   ├── RuleCard.vue
│   │   ├── RuleForm.vue
│   │   ├── ConditionBuilder.vue
│   │   └── ActionBuilder.vue
│   ├── team/
│   │   ├── TeamList.vue
│   │   ├── TeamMemberCard.vue
│   │   └── TeamMemberForm.vue
│   ├── channels/
│   │   ├── ChannelList.vue
│   │   ├── ChannelCard.vue
│   │   └── ChannelSetup.vue
│   └── marketplace/
│       ├── ListingGrid.vue
│       ├── ListingCard.vue
│       ├── VendorCard.vue
│       └── VendorProfile.vue
├── composables/
│   ├── useApi.ts
│   ├── useAuth.ts
│   ├── useTasks.ts
│   ├── useRules.ts
│   └── useRealtime.ts
├── layouts/
│   ├── DefaultLayout.vue
│   └── AuthLayout.vue
├── pages/
│   ├── auth/
│   │   ├── LoginPage.vue
│   │   └── RegisterPage.vue
│   ├── dashboard/
│   │   └── DashboardPage.vue
│   ├── tasks/
│   │   ├── TasksPage.vue
│   │   └── TaskDetailPage.vue
│   ├── inbox/
│   │   └── InboxPage.vue
│   ├── routing/
│   │   ├── RulesPage.vue
│   │   └── RuleEditPage.vue
│   ├── team/
│   │   └── TeamPage.vue
│   ├── channels/
│   │   └── ChannelsPage.vue
│   ├── marketplace/
│   │   ├── MarketplacePage.vue
│   │   ├── ListingDetailPage.vue
│   │   └── VendorDetailPage.vue
│   └── settings/
│       └── SettingsPage.vue
├── router/
│   └── index.ts
├── stores/
│   ├── auth.ts
│   ├── tasks.ts
│   ├── inbox.ts
│   ├── rules.ts
│   ├── team.ts
│   └── channels.ts
├── types/
│   └── index.ts
├── utils/
│   ├── api.ts
│   ├── echo.ts
│   └── helpers.ts
├── App.vue
└── main.ts
```

---

## Types

```typescript
// src/types/index.ts

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  timezone: string;
  plan: 'free' | 'starter' | 'pro' | 'business';
  settings: Record<string, any>;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  requestor_id: string;
  owner_id?: string;
  team_member_id?: string;
  marketplace_vendor_id?: string;
  source_type?: 'phone' | 'email' | 'sms' | 'web' | 'api';
  extracted_data?: ExtractedData;
  contact_name?: string;
  contact_phone?: string;
  contact_email?: string;
  location_address?: string;
  location_unit?: string;
  location_city?: string;
  location_state?: string;
  location_zip?: string;
  due_date?: string;
  completed_at?: string;
  deliverables?: Deliverable[];
  tags?: string[];
  created_at: string;
  updated_at: string;
  
  // Relations
  requestor?: User;
  owner?: User;
  team_member?: TeamMember;
  marketplace_vendor?: MarketplaceVendor;
}

export interface ExtractedData {
  summary: string;
  category: string;
  subcategory?: string;
  keywords: string[];
  urgency_indicators: string[];
  sentiment: string;
  contact: {
    name?: string;
    phone?: string;
    email?: string;
  };
  location: {
    address?: string;
    unit?: string;
    city?: string;
    state?: string;
    zip?: string;
  };
  dates_mentioned: string[];
  times_mentioned: string[];
}

export interface Deliverable {
  url: string;
  type: string;
  metadata?: Record<string, any>;
  added_at: string;
}

export interface InboxItem {
  id: string;
  user_id: string;
  source_type: 'phone' | 'email' | 'sms';
  source_id?: string;
  from_identifier: string;
  from_name?: string;
  subject?: string;
  body: string;
  attachments?: any[];
  extracted_data?: ExtractedData;
  status: 'unprocessed' | 'processing' | 'processed' | 'failed' | 'dismissed';
  routed_to_task_id?: string;
  auto_response_sent: boolean;
  auto_response_text?: string;
  received_at: string;
  processed_at?: string;
}

export interface RoutingRule {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  priority: number;
  is_active: boolean;
  conditions: RuleConditions;
  actions: RuleActions;
  times_matched: number;
  last_matched_at?: string;
}

export interface RuleConditions {
  match_type: 'all' | 'any';
  rules: RuleCondition[];
}

export interface RuleCondition {
  field: string;
  operator: string;
  value: any;
}

export interface RuleActions {
  create_task: boolean;
  requestor: 'owner' | 'caller';
  assignee_type: 'self' | 'team_member' | 'marketplace_human' | 'marketplace_ai';
  assignee_id?: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  notifications: RuleNotification[];
  auto_response?: string;
  tags: string[];
}

export interface RuleNotification {
  type: 'immediate' | 'digest';
  recipient: 'owner' | 'assignee';
}

export interface TeamMember {
  id: string;
  owner_id: string;
  user_id?: string;
  name: string;
  email?: string;
  phone?: string;
  role?: string;
  can_receive_tasks: boolean;
}

export interface AssistantChannel {
  id: string;
  user_id: string;
  channel_type: 'phone' | 'email' | 'sms';
  phone_number?: string;
  email_address?: string;
  is_active: boolean;
  greeting_message?: string;
  voicemail_greeting?: string;
}

export interface ContactList {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  members?: ContactListMember[];
}

export interface ContactListMember {
  id: string;
  list_id: string;
  name?: string;
  phone?: string;
  email?: string;
}

export interface MarketplaceVendor {
  id: string;
  vendor_type: 'human' | 'ai' | 'hybrid';
  name: string;
  business_name?: string;
  description?: string;
  logo_url?: string;
  categories: string[];
  services: any[];
  pricing_model: 'fixed' | 'hourly' | 'quote' | 'per_task';
  base_rate?: number;
  is_active: boolean;
  is_verified: boolean;
  total_jobs: number;
  completed_jobs: number;
  average_rating?: number;
}

export interface MarketplaceListing {
  id: string;
  task_id: string;
  requestor_id: string;
  title: string;
  description?: string;
  category: string;
  budget_type: 'fixed' | 'hourly' | 'quote';
  budget_min?: number;
  budget_max?: number;
  status: 'open' | 'assigned' | 'completed' | 'cancelled';
  assigned_vendor_id?: string;
  needed_by?: string;
}
```

---

## API Setup

```typescript
// src/utils/api.ts

import axios, { AxiosInstance, AxiosError } from 'axios';
import { useAuthStore } from '@/stores/auth';

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor - add auth token
api.interceptors.request.use((config) => {
  const authStore = useAuthStore();
  if (authStore.token) {
    config.headers.Authorization = `Bearer ${authStore.token}`;
  }
  return config;
});

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      const authStore = useAuthStore();
      authStore.logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

```typescript
// src/utils/echo.ts

import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

declare global {
  interface Window {
    Pusher: typeof Pusher;
    Echo: Echo;
  }
}

window.Pusher = Pusher;

export function initializeEcho(token: string) {
  window.Echo = new Echo({
    broadcaster: 'pusher',
    key: import.meta.env.VITE_PUSHER_APP_KEY,
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
    forceTLS: true,
    authEndpoint: `${import.meta.env.VITE_API_URL}/broadcasting/auth`,
    auth: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });
}

export function getEcho(): Echo {
  return window.Echo;
}
```

---

## Stores

### Auth Store

```typescript
// src/stores/auth.ts

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '@/utils/api';
import { initializeEcho } from '@/utils/echo';
import type { User } from '@/types';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(localStorage.getItem('token'));
  const loading = ref(false);

  const isAuthenticated = computed(() => !!token.value);
  const isPro = computed(() => user.value?.plan && ['pro', 'business'].includes(user.value.plan));

  async function login(email: string, password: string) {
    loading.value = true;
    try {
      const response = await api.post('/auth/login', { email, password });
      token.value = response.data.token;
      user.value = response.data.user;
      localStorage.setItem('token', response.data.token);
      initializeEcho(response.data.token);
    } finally {
      loading.value = false;
    }
  }

  async function register(data: { name: string; email: string; password: string; password_confirmation: string }) {
    loading.value = true;
    try {
      const response = await api.post('/auth/register', data);
      token.value = response.data.token;
      user.value = response.data.user;
      localStorage.setItem('token', response.data.token);
      initializeEcho(response.data.token);
    } finally {
      loading.value = false;
    }
  }

  async function fetchUser() {
    if (!token.value) return;
    try {
      const response = await api.get('/auth/user');
      user.value = response.data;
    } catch {
      logout();
    }
  }

  function logout() {
    user.value = null;
    token.value = null;
    localStorage.removeItem('token');
  }

  return {
    user,
    token,
    loading,
    isAuthenticated,
    isPro,
    login,
    register,
    fetchUser,
    logout,
  };
});
```

### Tasks Store

```typescript
// src/stores/tasks.ts

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '@/utils/api';
import type { Task } from '@/types';

export const useTasksStore = defineStore('tasks', () => {
  const tasks = ref<Task[]>([]);
  const currentTask = ref<Task | null>(null);
  const loading = ref(false);
  const pagination = ref({
    current_page: 1,
    last_page: 1,
    per_page: 20,
    total: 0,
  });

  const pendingTasks = computed(() => tasks.value.filter(t => t.status === 'pending'));
  const activeTasks = computed(() => tasks.value.filter(t => ['accepted', 'in_progress'].includes(t.status)));
  const completedTasks = computed(() => tasks.value.filter(t => t.status === 'completed'));

  async function fetchTasks(params: Record<string, any> = {}) {
    loading.value = true;
    try {
      const response = await api.get('/tasks', { params });
      tasks.value = response.data.data;
      pagination.value = {
        current_page: response.data.current_page,
        last_page: response.data.last_page,
        per_page: response.data.per_page,
        total: response.data.total,
      };
    } finally {
      loading.value = false;
    }
  }

  async function fetchTask(id: string) {
    loading.value = true;
    try {
      const response = await api.get(`/tasks/${id}`);
      currentTask.value = response.data;
      return response.data;
    } finally {
      loading.value = false;
    }
  }

  async function createTask(data: Partial<Task>) {
    const response = await api.post('/tasks', data);
    tasks.value.unshift(response.data);
    return response.data;
  }

  async function updateTask(id: string, data: Partial<Task>) {
    const response = await api.put(`/tasks/${id}`, data);
    const index = tasks.value.findIndex(t => t.id === id);
    if (index !== -1) {
      tasks.value[index] = response.data;
    }
    if (currentTask.value?.id === id) {
      currentTask.value = response.data;
    }
    return response.data;
  }

  async function completeTask(id: string) {
    const response = await api.post(`/tasks/${id}/complete`);
    const index = tasks.value.findIndex(t => t.id === id);
    if (index !== -1) {
      tasks.value[index] = response.data;
    }
    return response.data;
  }

  async function assignTask(id: string, assigneeType: string, assigneeId: string) {
    const response = await api.post(`/tasks/${id}/assign`, {
      assignee_type: assigneeType,
      assignee_id: assigneeId,
    });
    const index = tasks.value.findIndex(t => t.id === id);
    if (index !== -1) {
      tasks.value[index] = response.data;
    }
    return response.data;
  }

  async function deleteTask(id: string) {
    await api.delete(`/tasks/${id}`);
    tasks.value = tasks.value.filter(t => t.id !== id);
  }

  // Real-time updates
  function addTask(task: Task) {
    const exists = tasks.value.find(t => t.id === task.id);
    if (!exists) {
      tasks.value.unshift(task);
    }
  }

  function updateTaskFromSocket(task: Task) {
    const index = tasks.value.findIndex(t => t.id === task.id);
    if (index !== -1) {
      tasks.value[index] = task;
    }
  }

  return {
    tasks,
    currentTask,
    loading,
    pagination,
    pendingTasks,
    activeTasks,
    completedTasks,
    fetchTasks,
    fetchTask,
    createTask,
    updateTask,
    completeTask,
    assignTask,
    deleteTask,
    addTask,
    updateTaskFromSocket,
  };
});
```

### Rules Store

```typescript
// src/stores/rules.ts

import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '@/utils/api';
import type { RoutingRule } from '@/types';

export const useRulesStore = defineStore('rules', () => {
  const rules = ref<RoutingRule[]>([]);
  const currentRule = ref<RoutingRule | null>(null);
  const loading = ref(false);

  async function fetchRules() {
    loading.value = true;
    try {
      const response = await api.get('/routing-rules');
      rules.value = response.data;
    } finally {
      loading.value = false;
    }
  }

  async function fetchRule(id: string) {
    loading.value = true;
    try {
      const response = await api.get(`/routing-rules/${id}`);
      currentRule.value = response.data;
      return response.data;
    } finally {
      loading.value = false;
    }
  }

  async function createRule(data: Partial<RoutingRule>) {
    const response = await api.post('/routing-rules', data);
    rules.value.push(response.data);
    return response.data;
  }

  async function updateRule(id: string, data: Partial<RoutingRule>) {
    const response = await api.put(`/routing-rules/${id}`, data);
    const index = rules.value.findIndex(r => r.id === id);
    if (index !== -1) {
      rules.value[index] = response.data;
    }
    return response.data;
  }

  async function deleteRule(id: string) {
    await api.delete(`/routing-rules/${id}`);
    rules.value = rules.value.filter(r => r.id !== id);
  }

  async function reorderRules(orderedRules: { id: string; priority: number }[]) {
    await api.post('/routing-rules/reorder', { rules: orderedRules });
    await fetchRules();
  }

  async function testRule(sampleData: Record<string, any>) {
    const response = await api.post('/routing-rules/test', { sample_data: sampleData });
    return response.data;
  }

  return {
    rules,
    currentRule,
    loading,
    fetchRules,
    fetchRule,
    createRule,
    updateRule,
    deleteRule,
    reorderRules,
    testRule,
  };
});
```

---

## Router

```typescript
// src/router/index.ts

import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/dashboard',
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/pages/auth/LoginPage.vue'),
      meta: { guest: true },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/pages/auth/RegisterPage.vue'),
      meta: { guest: true },
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/pages/dashboard/DashboardPage.vue'),
      meta: { auth: true },
    },
    {
      path: '/tasks',
      name: 'tasks',
      component: () => import('@/pages/tasks/TasksPage.vue'),
      meta: { auth: true },
    },
    {
      path: '/tasks/:id',
      name: 'task-detail',
      component: () => import('@/pages/tasks/TaskDetailPage.vue'),
      meta: { auth: true },
    },
    {
      path: '/inbox',
      name: 'inbox',
      component: () => import('@/pages/inbox/InboxPage.vue'),
      meta: { auth: true },
    },
    {
      path: '/routing-rules',
      name: 'routing-rules',
      component: () => import('@/pages/routing/RulesPage.vue'),
      meta: { auth: true },
    },
    {
      path: '/routing-rules/new',
      name: 'routing-rule-new',
      component: () => import('@/pages/routing/RuleEditPage.vue'),
      meta: { auth: true },
    },
    {
      path: '/routing-rules/:id/edit',
      name: 'routing-rule-edit',
      component: () => import('@/pages/routing/RuleEditPage.vue'),
      meta: { auth: true },
    },
    {
      path: '/team',
      name: 'team',
      component: () => import('@/pages/team/TeamPage.vue'),
      meta: { auth: true },
    },
    {
      path: '/channels',
      name: 'channels',
      component: () => import('@/pages/channels/ChannelsPage.vue'),
      meta: { auth: true },
    },
    {
      path: '/marketplace',
      name: 'marketplace',
      component: () => import('@/pages/marketplace/MarketplacePage.vue'),
      meta: { auth: true },
    },
    {
      path: '/marketplace/listings/:id',
      name: 'marketplace-listing',
      component: () => import('@/pages/marketplace/ListingDetailPage.vue'),
      meta: { auth: true },
    },
    {
      path: '/marketplace/vendors/:id',
      name: 'marketplace-vendor',
      component: () => import('@/pages/marketplace/VendorDetailPage.vue'),
      meta: { auth: true },
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('@/pages/settings/SettingsPage.vue'),
      meta: { auth: true },
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // Fetch user if we have a token but no user
  if (authStore.token && !authStore.user) {
    await authStore.fetchUser();
  }

  // Redirect to login if auth required
  if (to.meta.auth && !authStore.isAuthenticated) {
    return next({ name: 'login', query: { redirect: to.fullPath } });
  }

  // Redirect to dashboard if already logged in
  if (to.meta.guest && authStore.isAuthenticated) {
    return next({ name: 'dashboard' });
  }

  next();
});

export default router;
```

---

## Layouts

### Default Layout

```vue
<!-- src/layouts/DefaultLayout.vue -->
<script setup lang="ts">
import { ref } from 'vue';
import AppHeader from '@/components/common/AppHeader.vue';
import AppSidebar from '@/components/common/AppSidebar.vue';

const sidebarOpen = ref(false);
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <AppSidebar :open="sidebarOpen" @close="sidebarOpen = false" />
    
    <div class="lg:pl-64">
      <AppHeader @toggle-sidebar="sidebarOpen = true" />
      
      <main class="py-6">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>
```

### App Sidebar

```vue
<!-- src/components/common/AppSidebar.vue -->
<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import {
  HomeIcon,
  ClipboardDocumentListIcon,
  InboxIcon,
  ArrowPathIcon,
  UserGroupIcon,
  PhoneIcon,
  ShoppingBagIcon,
  Cog6ToothIcon,
} from '@heroicons/vue/24/outline';

defineProps<{
  open: boolean;
}>();

defineEmits<{
  close: [];
}>();

const route = useRoute();

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Tasks', href: '/tasks', icon: ClipboardDocumentListIcon },
  { name: 'Inbox', href: '/inbox', icon: InboxIcon },
  { name: 'Routing Rules', href: '/routing-rules', icon: ArrowPathIcon },
  { name: 'Team', href: '/team', icon: UserGroupIcon },
  { name: 'Channels', href: '/channels', icon: PhoneIcon },
  { name: 'Marketplace', href: '/marketplace', icon: ShoppingBagIcon },
  { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
];

const isActive = (href: string) => route.path.startsWith(href);
</script>

<template>
  <!-- Mobile sidebar backdrop -->
  <div
    v-if="open"
    class="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
    @click="$emit('close')"
  />

  <!-- Sidebar -->
  <div
    :class="[
      'fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0',
      open ? 'translate-x-0' : '-translate-x-full',
    ]"
  >
    <div class="flex h-16 items-center justify-center border-b">
      <span class="text-xl font-bold text-primary-600">Task Juggler</span>
    </div>

    <nav class="mt-6 px-3">
      <div class="space-y-1">
        <router-link
          v-for="item in navigation"
          :key="item.name"
          :to="item.href"
          :class="[
            isActive(item.href)
              ? 'bg-primary-50 text-primary-600'
              : 'text-gray-700 hover:bg-gray-50',
            'group flex items-center px-3 py-2 text-sm font-medium rounded-lg',
          ]"
          @click="$emit('close')"
        >
          <component
            :is="item.icon"
            :class="[
              isActive(item.href) ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-500',
              'mr-3 h-5 w-5',
            ]"
          />
          {{ item.name }}
        </router-link>
      </div>
    </nav>
  </div>
</template>
```

---

## Pages

### Dashboard Page

```vue
<!-- src/pages/dashboard/DashboardPage.vue -->
<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useTasksStore } from '@/stores/tasks';
import { useAuthStore } from '@/stores/auth';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import TaskCard from '@/components/tasks/TaskCard.vue';
import {
  ClipboardDocumentListIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
} from '@heroicons/vue/24/outline';

const tasksStore = useTasksStore();
const authStore = useAuthStore();

onMounted(() => {
  tasksStore.fetchTasks();
});

const stats = computed(() => [
  {
    name: 'Total Tasks',
    value: tasksStore.tasks.length,
    icon: ClipboardDocumentListIcon,
    color: 'bg-blue-500',
  },
  {
    name: 'Pending',
    value: tasksStore.pendingTasks.length,
    icon: ClockIcon,
    color: 'bg-yellow-500',
  },
  {
    name: 'In Progress',
    value: tasksStore.activeTasks.length,
    icon: ExclamationTriangleIcon,
    color: 'bg-orange-500',
  },
  {
    name: 'Completed',
    value: tasksStore.completedTasks.length,
    icon: CheckCircleIcon,
    color: 'bg-green-500',
  },
]);
</script>

<template>
  <DefaultLayout>
    <div class="space-y-6">
      <!-- Welcome -->
      <div>
        <h1 class="text-2xl font-bold text-gray-900">
          Welcome back, {{ authStore.user?.name }}
        </h1>
        <p class="mt-1 text-gray-500">
          Here's what's happening with your tasks today.
        </p>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div
          v-for="stat in stats"
          :key="stat.name"
          class="card flex items-center"
        >
          <div :class="[stat.color, 'rounded-lg p-3']">
            <component :is="stat.icon" class="h-6 w-6 text-white" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">{{ stat.name }}</p>
            <p class="text-2xl font-semibold text-gray-900">{{ stat.value }}</p>
          </div>
        </div>
      </div>

      <!-- Recent Tasks -->
      <div class="card">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-900">Recent Tasks</h2>
          <router-link to="/tasks" class="text-sm text-primary-600 hover:text-primary-700">
            View all →
          </router-link>
        </div>

        <div v-if="tasksStore.loading" class="py-8 text-center text-gray-500">
          Loading...
        </div>

        <div v-else-if="tasksStore.tasks.length === 0" class="py-8 text-center text-gray-500">
          No tasks yet. They'll appear here when created.
        </div>

        <div v-else class="space-y-3">
          <TaskCard
            v-for="task in tasksStore.tasks.slice(0, 5)"
            :key="task.id"
            :task="task"
          />
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>
```

### Routing Rules Page

```vue
<!-- src/pages/routing/RulesPage.vue -->
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRulesStore } from '@/stores/rules';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import RuleCard from '@/components/routing/RuleCard.vue';
import { PlusIcon, InformationCircleIcon } from '@heroicons/vue/24/outline';

const rulesStore = useRulesStore();
const draggedRule = ref<string | null>(null);

onMounted(() => {
  rulesStore.fetchRules();
});

function handleDragStart(ruleId: string) {
  draggedRule.value = ruleId;
}

function handleDragOver(e: DragEvent) {
  e.preventDefault();
}

async function handleDrop(targetId: string) {
  if (!draggedRule.value || draggedRule.value === targetId) return;

  const rules = [...rulesStore.rules];
  const draggedIndex = rules.findIndex(r => r.id === draggedRule.value);
  const targetIndex = rules.findIndex(r => r.id === targetId);

  const [removed] = rules.splice(draggedIndex, 1);
  rules.splice(targetIndex, 0, removed);

  // Update priorities
  const orderedRules = rules.map((rule, index) => ({
    id: rule.id,
    priority: (index + 1) * 10,
  }));

  await rulesStore.reorderRules(orderedRules);
  draggedRule.value = null;
}

async function toggleRule(rule: any) {
  await rulesStore.updateRule(rule.id, { is_active: !rule.is_active });
}

async function deleteRule(id: string) {
  if (confirm('Are you sure you want to delete this rule?')) {
    await rulesStore.deleteRule(id);
  }
}
</script>

<template>
  <DefaultLayout>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Routing Rules</h1>
          <p class="mt-1 text-gray-500">
            Define how incoming messages are converted to tasks and routed.
          </p>
        </div>
        <router-link to="/routing-rules/new" class="btn btn-primary flex items-center">
          <PlusIcon class="h-5 w-5 mr-2" />
          Add Rule
        </router-link>
      </div>

      <!-- Info Box -->
      <div class="bg-blue-50 rounded-lg p-4 flex">
        <InformationCircleIcon class="h-5 w-5 text-blue-500 flex-shrink-0" />
        <div class="ml-3">
          <p class="text-sm text-blue-700">
            Rules are evaluated from top to bottom. The first matching rule wins.
            Drag and drop to reorder. Messages that don't match any rule will be assigned to you.
          </p>
        </div>
      </div>

      <!-- Rules List -->
      <div v-if="rulesStore.loading" class="card py-8 text-center text-gray-500">
        Loading rules...
      </div>

      <div v-else-if="rulesStore.rules.length === 0" class="card py-8 text-center">
        <p class="text-gray-500 mb-4">No routing rules yet.</p>
        <router-link to="/routing-rules/new" class="btn btn-primary">
          Create your first rule
        </router-link>
      </div>

      <div v-else class="space-y-3">
        <RuleCard
          v-for="rule in rulesStore.rules"
          :key="rule.id"
          :rule="rule"
          draggable="true"
          @dragstart="handleDragStart(rule.id)"
          @dragover="handleDragOver"
          @drop="handleDrop(rule.id)"
          @toggle="toggleRule(rule)"
          @delete="deleteRule(rule.id)"
        />
      </div>

      <!-- Default Rule Indicator -->
      <div class="card bg-gray-50 border-dashed border-2 border-gray-300">
        <div class="flex items-center text-gray-500">
          <div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
            ∞
          </div>
          <div>
            <p class="font-medium">Default Rule</p>
            <p class="text-sm">
              Messages that don't match any rule above will be assigned to you with normal priority.
            </p>
          </div>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>
```

### Rule Edit Page

```vue
<!-- src/pages/routing/RuleEditPage.vue -->
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useRulesStore } from '@/stores/rules';
import { useTeamStore } from '@/stores/team';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import ConditionBuilder from '@/components/routing/ConditionBuilder.vue';
import ActionBuilder from '@/components/routing/ActionBuilder.vue';

const route = useRoute();
const router = useRouter();
const rulesStore = useRulesStore();
const teamStore = useTeamStore();

const isEditing = computed(() => !!route.params.id);
const loading = ref(false);
const saving = ref(false);

const form = ref({
  name: '',
  description: '',
  conditions: {
    match_type: 'all' as 'all' | 'any',
    rules: [] as any[],
  },
  actions: {
    create_task: true,
    requestor: 'owner' as 'owner' | 'caller',
    assignee_type: 'self' as string,
    assignee_id: null as string | null,
    priority: 'normal' as string,
    notifications: [
      { type: 'immediate', recipient: 'assignee' },
    ],
    auto_response: '',
    tags: [] as string[],
  },
});

onMounted(async () => {
  await teamStore.fetchTeamMembers();
  
  if (isEditing.value) {
    loading.value = true;
    const rule = await rulesStore.fetchRule(route.params.id as string);
    form.value = {
      name: rule.name,
      description: rule.description || '',
      conditions: rule.conditions,
      actions: rule.actions,
    };
    loading.value = false;
  }
});

async function handleSubmit() {
  saving.value = true;
  try {
    if (isEditing.value) {
      await rulesStore.updateRule(route.params.id as string, form.value);
    } else {
      await rulesStore.createRule(form.value);
    }
    router.push('/routing-rules');
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <DefaultLayout>
    <div class="max-w-3xl mx-auto">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">
          {{ isEditing ? 'Edit Rule' : 'Create Rule' }}
        </h1>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Basic Info -->
        <div class="card">
          <h2 class="text-lg font-semibold mb-4">Basic Information</h2>
          
          <div class="space-y-4">
            <div>
              <label class="label">Rule Name</label>
              <input
                v-model="form.name"
                type="text"
                class="input"
                placeholder="e.g., Maintenance Requests"
                required
              />
            </div>

            <div>
              <label class="label">Description (optional)</label>
              <textarea
                v-model="form.description"
                class="input"
                rows="2"
                placeholder="Describe what this rule does..."
              />
            </div>
          </div>
        </div>

        <!-- Conditions -->
        <div class="card">
          <h2 class="text-lg font-semibold mb-4">When...</h2>
          <ConditionBuilder v-model="form.conditions" />
        </div>

        <!-- Actions -->
        <div class="card">
          <h2 class="text-lg font-semibold mb-4">Then...</h2>
          <ActionBuilder
            v-model="form.actions"
            :team-members="teamStore.members"
          />
        </div>

        <!-- Submit -->
        <div class="flex justify-end space-x-3">
          <router-link to="/routing-rules" class="btn btn-secondary">
            Cancel
          </router-link>
          <button type="submit" class="btn btn-primary" :disabled="saving">
            {{ saving ? 'Saving...' : (isEditing ? 'Update Rule' : 'Create Rule') }}
          </button>
        </div>
      </form>
    </div>
  </DefaultLayout>
</template>
```

### Channels Page

```vue
<!-- src/pages/channels/ChannelsPage.vue -->
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useChannelsStore } from '@/stores/channels';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import ChannelCard from '@/components/channels/ChannelCard.vue';
import ChannelSetup from '@/components/channels/ChannelSetup.vue';
import {
  PhoneIcon,
  EnvelopeIcon,
  ChatBubbleLeftIcon,
} from '@heroicons/vue/24/outline';

const channelsStore = useChannelsStore();
const showSetup = ref(false);
const setupType = ref<'phone' | 'email' | null>(null);

onMounted(() => {
  channelsStore.fetchChannels();
});

function openSetup(type: 'phone' | 'email') {
  setupType.value = type;
  showSetup.value = true;
}
</script>

<template>
  <DefaultLayout>
    <div class="space-y-6">
      <!-- Header -->
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Assistant Channels</h1>
        <p class="mt-1 text-gray-500">
          Configure how your AI assistant receives messages.
        </p>
      </div>

      <!-- Active Channels -->
      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <ChannelCard
          v-for="channel in channelsStore.channels"
          :key="channel.id"
          :channel="channel"
        />
      </div>

      <!-- Add Channel Options -->
      <div class="card">
        <h2 class="text-lg font-semibold mb-4">Add Channel</h2>
        
        <div class="grid gap-4 md:grid-cols-3">
          <!-- Phone -->
          <button
            @click="openSetup('phone')"
            class="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors text-left"
          >
            <PhoneIcon class="h-8 w-8 text-primary-600 mb-2" />
            <h3 class="font-medium text-gray-900">Phone Number</h3>
            <p class="text-sm text-gray-500">
              Get a dedicated number for calls and voicemails
            </p>
          </button>

          <!-- Email -->
          <button
            @click="openSetup('email')"
            class="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors text-left"
          >
            <EnvelopeIcon class="h-8 w-8 text-primary-600 mb-2" />
            <h3 class="font-medium text-gray-900">Email Address</h3>
            <p class="text-sm text-gray-500">
              Get an email address for forwarding messages
            </p>
          </button>

          <!-- SMS (included with phone) -->
          <div class="p-4 border-2 border-gray-200 rounded-lg bg-gray-50">
            <ChatBubbleLeftIcon class="h-8 w-8 text-gray-400 mb-2" />
            <h3 class="font-medium text-gray-500">SMS</h3>
            <p class="text-sm text-gray-400">
              Included with phone number
            </p>
          </div>
        </div>
      </div>

      <!-- Setup Instructions -->
      <div class="card bg-blue-50">
        <h3 class="font-semibold text-blue-900 mb-2">How It Works</h3>
        <ul class="text-sm text-blue-700 space-y-2">
          <li>
            <strong>Phone:</strong> Forward your missed calls to your Task Juggler number.
            The AI will answer, take messages, and create tasks.
          </li>
          <li>
            <strong>Email:</strong> Forward emails to your Task Juggler email address.
            The AI will extract tasks and route them according to your rules.
          </li>
          <li>
            <strong>SMS:</strong> Share your Task Juggler number with contacts.
            Text messages become tasks automatically.
          </li>
        </ul>
      </div>
    </div>

    <!-- Setup Modal -->
    <ChannelSetup
      v-if="showSetup"
      :type="setupType!"
      @close="showSetup = false"
    />
  </DefaultLayout>
</template>
```

---

## Components

### Rule Card

```vue
<!-- src/components/routing/RuleCard.vue -->
<script setup lang="ts">
import { computed } from 'vue';
import type { RoutingRule } from '@/types';
import { Switch } from '@headlessui/vue';
import {
  PencilIcon,
  TrashIcon,
  Bars3Icon,
} from '@heroicons/vue/24/outline';

const props = defineProps<{
  rule: RoutingRule;
}>();

const emit = defineEmits<{
  toggle: [];
  delete: [];
}>();

const conditionSummary = computed(() => {
  const { conditions } = props.rule;
  const count = conditions.rules?.length || 0;
  const type = conditions.match_type === 'all' ? 'all' : 'any';
  return `${count} condition${count !== 1 ? 's' : ''} (match ${type})`;
});

const actionSummary = computed(() => {
  const { actions } = props.rule;
  const assignee = actions.assignee_type === 'self' 
    ? 'yourself' 
    : actions.assignee_type === 'team_member'
      ? 'team member'
      : 'marketplace';
  return `Assign to ${assignee}, ${actions.priority} priority`;
});
</script>

<template>
  <div
    :class="[
      'card flex items-center cursor-move',
      !rule.is_active && 'opacity-60',
    ]"
  >
    <!-- Drag Handle -->
    <div class="mr-4 text-gray-400">
      <Bars3Icon class="h-5 w-5" />
    </div>

    <!-- Rule Info -->
    <div class="flex-1 min-w-0">
      <div class="flex items-center">
        <h3 class="font-semibold text-gray-900 truncate">{{ rule.name }}</h3>
        <span
          v-if="rule.times_matched > 0"
          class="ml-2 text-xs text-gray-500"
        >
          (matched {{ rule.times_matched }} times)
        </span>
      </div>
      <p class="text-sm text-gray-500 truncate">
        {{ conditionSummary }} → {{ actionSummary }}
      </p>
    </div>

    <!-- Toggle -->
    <Switch
      :model-value="rule.is_active"
      @update:model-value="emit('toggle')"
      :class="[
        rule.is_active ? 'bg-primary-600' : 'bg-gray-200',
        'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors',
      ]"
    >
      <span
        :class="[
          rule.is_active ? 'translate-x-5' : 'translate-x-0',
          'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition-transform mt-0.5 ml-0.5',
        ]"
      />
    </Switch>

    <!-- Actions -->
    <div class="ml-4 flex items-center space-x-2">
      <router-link
        :to="`/routing-rules/${rule.id}/edit`"
        class="p-2 text-gray-400 hover:text-gray-600"
      >
        <PencilIcon class="h-5 w-5" />
      </router-link>
      <button
        @click="emit('delete')"
        class="p-2 text-gray-400 hover:text-red-600"
      >
        <TrashIcon class="h-5 w-5" />
      </button>
    </div>
  </div>
</template>
```

### Condition Builder

```vue
<!-- src/components/routing/ConditionBuilder.vue -->
<script setup lang="ts">
import { computed } from 'vue';
import { PlusIcon, XMarkIcon } from '@heroicons/vue/24/outline';

interface Condition {
  field: string;
  operator: string;
  value: any;
}

interface Conditions {
  match_type: 'all' | 'any';
  rules: Condition[];
}

const model = defineModel<Conditions>({ required: true });

const fields = [
  { value: 'category', label: 'Category' },
  { value: 'subcategory', label: 'Subcategory' },
  { value: 'keywords', label: 'Keywords' },
  { value: 'sentiment', label: 'Sentiment' },
  { value: 'source', label: 'Source' },
  { value: 'urgency_indicators', label: 'Urgency' },
];

const operators = {
  category: [
    { value: 'equals', label: 'equals' },
    { value: 'in', label: 'is one of' },
    { value: 'not_in', label: 'is not one of' },
  ],
  keywords: [
    { value: 'contains_any', label: 'contains any of' },
    { value: 'contains_all', label: 'contains all of' },
  ],
  sentiment: [
    { value: 'equals', label: 'equals' },
    { value: 'in', label: 'is one of' },
  ],
  source: [
    { value: 'equals', label: 'equals' },
    { value: 'in', label: 'is one of' },
  ],
  default: [
    { value: 'equals', label: 'equals' },
    { value: 'contains', label: 'contains' },
  ],
};

const categories = ['maintenance', 'scheduling', 'billing', 'sales', 'support', 'legal', 'research', 'general'];
const sentiments = ['positive', 'neutral', 'negative', 'frustrated', 'urgent'];
const sources = ['phone', 'email', 'sms'];

function addCondition() {
  model.value.rules.push({
    field: 'category',
    operator: 'equals',
    value: '',
  });
}

function removeCondition(index: number) {
  model.value.rules.splice(index, 1);
}

function getOperatorsForField(field: string) {
  return operators[field as keyof typeof operators] || operators.default;
}

function getOptionsForField(field: string) {
  switch (field) {
    case 'category':
    case 'subcategory':
      return categories;
    case 'sentiment':
      return sentiments;
    case 'source':
      return sources;
    default:
      return null;
  }
}
</script>

<template>
  <div class="space-y-4">
    <!-- Match Type -->
    <div class="flex items-center space-x-4">
      <span class="text-sm text-gray-600">Match</span>
      <select v-model="model.match_type" class="input w-auto">
        <option value="all">All conditions (AND)</option>
        <option value="any">Any condition (OR)</option>
      </select>
    </div>

    <!-- Conditions -->
    <div class="space-y-3">
      <div
        v-for="(condition, index) in model.rules"
        :key="index"
        class="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg"
      >
        <!-- Field -->
        <select v-model="condition.field" class="input w-40">
          <option v-for="f in fields" :key="f.value" :value="f.value">
            {{ f.label }}
          </option>
        </select>

        <!-- Operator -->
        <select v-model="condition.operator" class="input w-40">
          <option
            v-for="op in getOperatorsForField(condition.field)"
            :key="op.value"
            :value="op.value"
          >
            {{ op.label }}
          </option>
        </select>

        <!-- Value -->
        <template v-if="getOptionsForField(condition.field)">
          <select v-model="condition.value" class="input flex-1">
            <option value="">Select...</option>
            <option
              v-for="opt in getOptionsForField(condition.field)"
              :key="opt"
              :value="opt"
            >
              {{ opt }}
            </option>
          </select>
        </template>
        <template v-else>
          <input
            v-model="condition.value"
            type="text"
            class="input flex-1"
            placeholder="Enter value (comma-separated for multiple)"
          />
        </template>

        <!-- Remove -->
        <button
          @click="removeCondition(index)"
          class="p-2 text-gray-400 hover:text-red-600"
        >
          <XMarkIcon class="h-5 w-5" />
        </button>
      </div>
    </div>

    <!-- Add Condition -->
    <button
      @click="addCondition"
      class="flex items-center text-sm text-primary-600 hover:text-primary-700"
    >
      <PlusIcon class="h-4 w-4 mr-1" />
      Add Condition
    </button>
  </div>
</template>
```

### Task Card

```vue
<!-- src/components/tasks/TaskCard.vue -->
<script setup lang="ts">
import { computed } from 'vue';
import type { Task } from '@/types';
import {
  PhoneIcon,
  EnvelopeIcon,
  ChatBubbleLeftIcon,
  GlobeAltIcon,
} from '@heroicons/vue/24/outline';
import { formatDistanceToNow } from 'date-fns';

const props = defineProps<{
  task: Task;
}>();

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  accepted: 'bg-blue-100 text-blue-800',
  in_progress: 'bg-orange-100 text-orange-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-gray-100 text-gray-800',
};

const priorityColors = {
  low: 'border-gray-300',
  normal: 'border-blue-300',
  high: 'border-orange-300',
  urgent: 'border-red-500 border-2',
};

const sourceIcon = computed(() => {
  switch (props.task.source_type) {
    case 'phone': return PhoneIcon;
    case 'email': return EnvelopeIcon;
    case 'sms': return ChatBubbleLeftIcon;
    default: return GlobeAltIcon;
  }
});

const timeAgo = computed(() => 
  formatDistanceToNow(new Date(props.task.created_at), { addSuffix: true })
);
</script>

<template>
  <router-link
    :to="`/tasks/${task.id}`"
    :class="[
      'block bg-white rounded-lg border p-4 hover:shadow-md transition-shadow',
      priorityColors[task.priority],
    ]"
  >
    <div class="flex items-start justify-between">
      <div class="flex-1 min-w-0">
        <div class="flex items-center space-x-2">
          <component :is="sourceIcon" class="h-4 w-4 text-gray-400" />
          <h3 class="font-medium text-gray-900 truncate">{{ task.title }}</h3>
        </div>
        
        <p v-if="task.contact_name" class="mt-1 text-sm text-gray-500">
          From: {{ task.contact_name }}
        </p>
        
        <div class="mt-2 flex items-center space-x-2">
          <span :class="['px-2 py-0.5 text-xs rounded-full', statusColors[task.status]]">
            {{ task.status }}
          </span>
          <span class="text-xs text-gray-400">{{ timeAgo }}</span>
        </div>
      </div>

      <div v-if="task.priority === 'urgent'" class="ml-2">
        <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
          URGENT
        </span>
      </div>
    </div>
  </router-link>
</template>
```

---

## Main Entry

```typescript
// src/main.ts

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import './assets/main.css';

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount('#app');
```

```vue
<!-- src/App.vue -->
<script setup lang="ts">
import { onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { initializeEcho } from '@/utils/echo';

const authStore = useAuthStore();

onMounted(async () => {
  if (authStore.token) {
    await authStore.fetchUser();
    initializeEcho(authStore.token);
  }
});
</script>

<template>
  <router-view />
</template>
```

---

## Environment Variables

```bash
# .env
VITE_API_URL=http://localhost:8000/api
VITE_PUSHER_APP_KEY=your-pusher-key
VITE_PUSHER_APP_CLUSTER=us2
```

---

## Build & Deploy

```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Railway Deployment

```json
// package.json scripts
{
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc && vite build",
    "preview": "vite preview"
  }
}
```

Railway will automatically detect Vite and build the project. Configure:
- Build command: `npm run build`
- Output directory: `dist`
- Environment variables: Add all `VITE_*` variables

---

## Next Steps

After implementing the web dashboard:

1. Add real-time updates using Laravel Echo
2. Implement marketplace browsing and vendor profiles
3. Add settings page for user preferences
4. Implement notification preferences
5. Add dark mode support
6. Add mobile-responsive improvements
