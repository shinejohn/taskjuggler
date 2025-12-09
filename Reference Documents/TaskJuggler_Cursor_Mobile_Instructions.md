# Task Juggler - React Native Mobile App
## Complete Cursor Instructions

---

## Project Overview

You are building the mobile app for Task Juggler using:
- React Native with Expo (SDK 51+)
- Expo Router (file-based routing)
- Zustand (state management)
- React Query (server state)
- NativeWind (Tailwind for React Native)
- Expo Notifications (push notifications)

The app allows users to:
- View and manage tasks
- Receive push notifications for new tasks
- Configure routing rules
- Manage team members
- Access the marketplace
- Use voice commands (future)

---

## Initial Setup

### Create Project

```bash
npx create-expo-app@latest taskjuggler-app --template tabs
cd taskjuggler-app
```

### Install Dependencies

```bash
# Navigation & Routing
npx expo install expo-router expo-linking expo-constants

# State Management
npm install zustand @tanstack/react-query

# UI & Styling
npm install nativewind tailwindcss
npx expo install react-native-reanimated react-native-gesture-handler

# Forms
npm install react-hook-form zod @hookform/resolvers

# Notifications
npx expo install expo-notifications expo-device

# Storage
npx expo install @react-native-async-storage/async-storage expo-secure-store

# Utilities
npm install axios date-fns
npx expo install expo-haptics expo-clipboard

# Icons
npm install lucide-react-native react-native-svg
```

### Configure NativeWind

```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
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
};
```

```javascript
// babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
  };
};
```

```javascript
// metro.config.js
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, { input: "./global.css" });
```

```css
/* global.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Configure app.json

```json
{
  "expo": {
    "name": "Task Juggler",
    "slug": "taskjuggler",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#2563eb"
    },
    "assetBundlePatterns": ["**/*"],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.taskjuggler.app",
      "infoPlist": {
        "NSCameraUsageDescription": "Used to scan QR codes and take photos for tasks",
        "NSMicrophoneUsageDescription": "Used for voice commands"
      }
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#2563eb"
      },
      "package": "com.taskjuggler.app",
      "permissions": ["CAMERA", "RECORD_AUDIO", "VIBRATE"]
    },
    "plugins": [
      "expo-router",
      [
        "expo-notifications",
        {
          "icon": "./assets/notification-icon.png",
          "color": "#2563eb"
        }
      ]
    ],
    "scheme": "taskjuggler",
    "extra": {
      "eas": {
        "projectId": "your-project-id"
      }
    }
  }
}
```

---

## Directory Structure

```
app/
├── (auth)/
│   ├── _layout.tsx
│   ├── login.tsx
│   └── register.tsx
├── (tabs)/
│   ├── _layout.tsx
│   ├── index.tsx              # Dashboard
│   ├── tasks/
│   │   ├── _layout.tsx
│   │   ├── index.tsx          # Task list
│   │   └── [id].tsx           # Task detail
│   ├── inbox.tsx
│   ├── rules/
│   │   ├── _layout.tsx
│   │   ├── index.tsx          # Rules list
│   │   └── [id].tsx           # Rule edit
│   ├── marketplace/
│   │   ├── _layout.tsx
│   │   ├── index.tsx          # Browse
│   │   ├── listings/[id].tsx
│   │   └── vendors/[id].tsx
│   └── settings.tsx
├── _layout.tsx                 # Root layout
├── +not-found.tsx
└── +html.tsx

components/
├── ui/
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Card.tsx
│   ├── Badge.tsx
│   ├── Modal.tsx
│   ├── Select.tsx
│   ├── Switch.tsx
│   └── LoadingSpinner.tsx
├── tasks/
│   ├── TaskCard.tsx
│   ├── TaskList.tsx
│   ├── TaskDetail.tsx
│   ├── TaskForm.tsx
│   └── TaskFilters.tsx
├── inbox/
│   ├── InboxItem.tsx
│   └── InboxList.tsx
├── rules/
│   ├── RuleCard.tsx
│   ├── RuleForm.tsx
│   ├── ConditionBuilder.tsx
│   └── ActionBuilder.tsx
├── marketplace/
│   ├── ListingCard.tsx
│   ├── VendorCard.tsx
│   └── VendorProfile.tsx
└── common/
    ├── Header.tsx
    ├── EmptyState.tsx
    └── ErrorBoundary.tsx

lib/
├── api.ts
├── auth.ts
├── notifications.ts
└── storage.ts

stores/
├── auth.ts
├── tasks.ts
├── inbox.ts
├── rules.ts
└── team.ts

hooks/
├── useAuth.ts
├── useTasks.ts
├── useRules.ts
├── useNotifications.ts
└── useRefreshOnFocus.ts

types/
└── index.ts

constants/
└── index.ts
```

---

## Types

```typescript
// types/index.ts

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
  status: TaskStatus;
  priority: TaskPriority;
  requestor_id: string;
  owner_id?: string;
  team_member_id?: string;
  marketplace_vendor_id?: string;
  source_type?: SourceType;
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

export type TaskStatus = 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
export type TaskPriority = 'low' | 'normal' | 'high' | 'urgent';
export type SourceType = 'phone' | 'email' | 'sms' | 'web' | 'api';

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
  source_type: SourceType;
  from_identifier: string;
  from_name?: string;
  subject?: string;
  body: string;
  extracted_data?: ExtractedData;
  status: 'unprocessed' | 'processing' | 'processed' | 'failed' | 'dismissed';
  routed_to_task_id?: string;
  received_at: string;
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
  priority: TaskPriority;
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
}

export interface MarketplaceVendor {
  id: string;
  vendor_type: 'human' | 'ai' | 'hybrid';
  name: string;
  business_name?: string;
  description?: string;
  logo_url?: string;
  categories: string[];
  pricing_model: 'fixed' | 'hourly' | 'quote' | 'per_task';
  base_rate?: number;
  is_active: boolean;
  is_verified: boolean;
  average_rating?: number;
}

export interface MarketplaceListing {
  id: string;
  task_id: string;
  title: string;
  description?: string;
  category: string;
  budget_type: 'fixed' | 'hourly' | 'quote';
  budget_min?: number;
  budget_max?: number;
  status: 'open' | 'assigned' | 'completed' | 'cancelled';
}
```

---

## API & Auth Setup

```typescript
// lib/api.ts

import axios, { AxiosInstance, AxiosError } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000/api';

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      await SecureStore.deleteItemAsync('auth_token');
      router.replace('/login');
    }
    return Promise.reject(error);
  }
);

export default api;
```

```typescript
// lib/auth.ts

import * as SecureStore from 'expo-secure-store';
import api from './api';
import { User } from '@/types';

export interface LoginResponse {
  token: string;
  user: User;
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>('/auth/login', { email, password });
  await SecureStore.setItemAsync('auth_token', response.data.token);
  return response.data;
}

export async function register(data: {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>('/auth/register', data);
  await SecureStore.setItemAsync('auth_token', response.data.token);
  return response.data;
}

export async function logout(): Promise<void> {
  try {
    await api.post('/auth/logout');
  } finally {
    await SecureStore.deleteItemAsync('auth_token');
  }
}

export async function getUser(): Promise<User> {
  const response = await api.get<User>('/auth/user');
  return response.data;
}

export async function getToken(): Promise<string | null> {
  return SecureStore.getItemAsync('auth_token');
}

export async function isAuthenticated(): Promise<boolean> {
  const token = await getToken();
  return !!token;
}
```

```typescript
// lib/notifications.ts

import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import api from './api';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function registerForPushNotifications(): Promise<string | null> {
  if (!Device.isDevice) {
    console.log('Push notifications require a physical device');
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('Failed to get push token');
    return null;
  }

  const token = await Notifications.getExpoPushTokenAsync({
    projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
  });

  // Send token to backend
  await api.post('/push-tokens', { token: token.data });

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#2563eb',
    });
  }

  return token.data;
}

export function addNotificationReceivedListener(
  callback: (notification: Notifications.Notification) => void
) {
  return Notifications.addNotificationReceivedListener(callback);
}

export function addNotificationResponseReceivedListener(
  callback: (response: Notifications.NotificationResponse) => void
) {
  return Notifications.addNotificationResponseReceivedListener(callback);
}
```

---

## Stores

### Auth Store

```typescript
// stores/auth.ts

import { create } from 'zustand';
import { User } from '@/types';
import * as auth from '@/lib/auth';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  
  login: (email: string, password: string) => Promise<void>;
  register: (data: { name: string; email: string; password: string; password_confirmation: string }) => Promise<void>;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  login: async (email, password) => {
    const response = await auth.login(email, password);
    set({ user: response.user, isAuthenticated: true });
  },

  register: async (data) => {
    const response = await auth.register(data);
    set({ user: response.user, isAuthenticated: true });
  },

  logout: async () => {
    await auth.logout();
    set({ user: null, isAuthenticated: false });
  },

  fetchUser: async () => {
    try {
      const user = await auth.getUser();
      set({ user, isAuthenticated: true, isLoading: false });
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  checkAuth: async () => {
    set({ isLoading: true });
    const authenticated = await auth.isAuthenticated();
    if (authenticated) {
      await get().fetchUser();
    } else {
      set({ isLoading: false });
    }
    return get().isAuthenticated;
  },
}));
```

### Tasks Store

```typescript
// stores/tasks.ts

import { create } from 'zustand';
import { Task, TaskStatus, TaskPriority } from '@/types';
import api from '@/lib/api';

interface TasksState {
  tasks: Task[];
  currentTask: Task | null;
  isLoading: boolean;
  
  fetchTasks: (params?: Record<string, any>) => Promise<void>;
  fetchTask: (id: string) => Promise<Task>;
  createTask: (data: Partial<Task>) => Promise<Task>;
  updateTask: (id: string, data: Partial<Task>) => Promise<Task>;
  completeTask: (id: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  addTaskFromNotification: (task: Task) => void;
}

export const useTasksStore = create<TasksState>((set, get) => ({
  tasks: [],
  currentTask: null,
  isLoading: false,

  fetchTasks: async (params = {}) => {
    set({ isLoading: true });
    try {
      const response = await api.get('/tasks', { params });
      set({ tasks: response.data.data });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchTask: async (id) => {
    set({ isLoading: true });
    try {
      const response = await api.get(`/tasks/${id}`);
      set({ currentTask: response.data });
      return response.data;
    } finally {
      set({ isLoading: false });
    }
  },

  createTask: async (data) => {
    const response = await api.post('/tasks', data);
    set({ tasks: [response.data, ...get().tasks] });
    return response.data;
  },

  updateTask: async (id, data) => {
    const response = await api.put(`/tasks/${id}`, data);
    set({
      tasks: get().tasks.map((t) => (t.id === id ? response.data : t)),
      currentTask: get().currentTask?.id === id ? response.data : get().currentTask,
    });
    return response.data;
  },

  completeTask: async (id) => {
    const response = await api.post(`/tasks/${id}/complete`);
    set({
      tasks: get().tasks.map((t) => (t.id === id ? response.data : t)),
      currentTask: get().currentTask?.id === id ? response.data : get().currentTask,
    });
  },

  deleteTask: async (id) => {
    await api.delete(`/tasks/${id}`);
    set({ tasks: get().tasks.filter((t) => t.id !== id) });
  },

  addTaskFromNotification: (task) => {
    const exists = get().tasks.find((t) => t.id === task.id);
    if (!exists) {
      set({ tasks: [task, ...get().tasks] });
    }
  },
}));
```

### Rules Store

```typescript
// stores/rules.ts

import { create } from 'zustand';
import { RoutingRule } from '@/types';
import api from '@/lib/api';

interface RulesState {
  rules: RoutingRule[];
  currentRule: RoutingRule | null;
  isLoading: boolean;
  
  fetchRules: () => Promise<void>;
  fetchRule: (id: string) => Promise<RoutingRule>;
  createRule: (data: Partial<RoutingRule>) => Promise<RoutingRule>;
  updateRule: (id: string, data: Partial<RoutingRule>) => Promise<RoutingRule>;
  deleteRule: (id: string) => Promise<void>;
  toggleRule: (id: string) => Promise<void>;
  reorderRules: (orderedIds: string[]) => Promise<void>;
}

export const useRulesStore = create<RulesState>((set, get) => ({
  rules: [],
  currentRule: null,
  isLoading: false,

  fetchRules: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get('/routing-rules');
      set({ rules: response.data });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchRule: async (id) => {
    set({ isLoading: true });
    try {
      const response = await api.get(`/routing-rules/${id}`);
      set({ currentRule: response.data });
      return response.data;
    } finally {
      set({ isLoading: false });
    }
  },

  createRule: async (data) => {
    const response = await api.post('/routing-rules', data);
    set({ rules: [...get().rules, response.data] });
    return response.data;
  },

  updateRule: async (id, data) => {
    const response = await api.put(`/routing-rules/${id}`, data);
    set({
      rules: get().rules.map((r) => (r.id === id ? response.data : r)),
      currentRule: get().currentRule?.id === id ? response.data : get().currentRule,
    });
    return response.data;
  },

  deleteRule: async (id) => {
    await api.delete(`/routing-rules/${id}`);
    set({ rules: get().rules.filter((r) => r.id !== id) });
  },

  toggleRule: async (id) => {
    const rule = get().rules.find((r) => r.id === id);
    if (rule) {
      await get().updateRule(id, { is_active: !rule.is_active });
    }
  },

  reorderRules: async (orderedIds) => {
    const orderedRules = orderedIds.map((id, index) => ({
      id,
      priority: (index + 1) * 10,
    }));
    await api.post('/routing-rules/reorder', { rules: orderedRules });
    await get().fetchRules();
  },
}));
```

---

## App Layout

### Root Layout

```typescript
// app/_layout.tsx

import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useAuthStore } from '@/stores/auth';
import {
  registerForPushNotifications,
  addNotificationResponseReceivedListener,
} from '@/lib/notifications';
import { router } from 'expo-router';
import '../global.css';

const queryClient = new QueryClient();

export default function RootLayout() {
  const { checkAuth, isAuthenticated } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      registerForPushNotifications();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const subscription = addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data;
      if (data?.taskId) {
        router.push(`/tasks/${data.taskId}`);
      }
    });

    return () => subscription.remove();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
        </Stack>
        <StatusBar style="auto" />
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
```

### Auth Layout

```typescript
// app/(auth)/_layout.tsx

import { Redirect, Stack } from 'expo-router';
import { useAuthStore } from '@/stores/auth';
import { View, ActivityIndicator } from 'react-native';

export default function AuthLayout() {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
}
```

### Tabs Layout

```typescript
// app/(tabs)/_layout.tsx

import { Redirect, Tabs } from 'expo-router';
import { useAuthStore } from '@/stores/auth';
import { View, ActivityIndicator } from 'react-native';
import {
  Home,
  ClipboardList,
  Inbox,
  GitBranch,
  ShoppingBag,
  Settings,
} from 'lucide-react-native';

export default function TabsLayout() {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: '#9ca3af',
        headerShown: true,
        headerStyle: { backgroundColor: '#ffffff' },
        headerTitleStyle: { fontWeight: '600' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          title: 'Tasks',
          headerShown: false,
          tabBarIcon: ({ color, size }) => <ClipboardList size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="inbox"
        options={{
          title: 'Inbox',
          tabBarIcon: ({ color, size }) => <Inbox size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="rules"
        options={{
          title: 'Rules',
          headerShown: false,
          tabBarIcon: ({ color, size }) => <GitBranch size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="marketplace"
        options={{
          title: 'Marketplace',
          headerShown: false,
          tabBarIcon: ({ color, size }) => <ShoppingBag size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
```

---

## Screens

### Login Screen

```typescript
// app/(auth)/login.tsx

import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Link, router } from 'expo-router';
import { useAuthStore } from '@/stores/auth';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 justify-center px-6"
      >
        <View className="mb-8">
          <Text className="text-3xl font-bold text-gray-900 text-center">
            Task Juggler
          </Text>
          <Text className="text-gray-500 text-center mt-2">
            Sign in to your account
          </Text>
        </View>

        <View className="space-y-4">
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-1">Email</Text>
            <TextInput
              className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
              placeholder="you@example.com"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
            />
          </View>

          <View>
            <Text className="text-sm font-medium text-gray-700 mb-1">Password</Text>
            <TextInput
              className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="password"
            />
          </View>

          <TouchableOpacity
            className={`bg-primary-600 rounded-lg py-3 mt-4 ${loading ? 'opacity-50' : ''}`}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text className="text-white text-center font-semibold text-lg">
              {loading ? 'Signing in...' : 'Sign In'}
            </Text>
          </TouchableOpacity>
        </View>

        <View className="mt-6 flex-row justify-center">
          <Text className="text-gray-500">Don't have an account? </Text>
          <Link href="/register" asChild>
            <TouchableOpacity>
              <Text className="text-primary-600 font-semibold">Sign up</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
```

### Dashboard Screen

```typescript
// app/(tabs)/index.tsx

import { useEffect } from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { useAuthStore } from '@/stores/auth';
import { useTasksStore } from '@/stores/tasks';
import { TaskCard } from '@/components/tasks/TaskCard';
import { ClipboardList, Clock, CheckCircle, AlertTriangle } from 'lucide-react-native';

export default function DashboardScreen() {
  const { user } = useAuthStore();
  const { tasks, isLoading, fetchTasks } = useTasksStore();

  useEffect(() => {
    fetchTasks();
  }, []);

  const stats = [
    {
      label: 'Total',
      value: tasks.length,
      icon: ClipboardList,
      color: 'bg-blue-500',
    },
    {
      label: 'Pending',
      value: tasks.filter((t) => t.status === 'pending').length,
      icon: Clock,
      color: 'bg-yellow-500',
    },
    {
      label: 'In Progress',
      value: tasks.filter((t) => ['accepted', 'in_progress'].includes(t.status)).length,
      icon: AlertTriangle,
      color: 'bg-orange-500',
    },
    {
      label: 'Completed',
      value: tasks.filter((t) => t.status === 'completed').length,
      icon: CheckCircle,
      color: 'bg-green-500',
    },
  ];

  const recentTasks = tasks.slice(0, 5);

  return (
    <ScrollView
      className="flex-1 bg-gray-100"
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={fetchTasks} />
      }
    >
      <View className="p-4">
        {/* Welcome */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.name?.split(' ')[0]}
          </Text>
          <Text className="text-gray-500 mt-1">
            Here's what's happening today
          </Text>
        </View>

        {/* Stats */}
        <View className="flex-row flex-wrap -mx-1 mb-6">
          {stats.map((stat) => (
            <View key={stat.label} className="w-1/2 p-1">
              <View className="bg-white rounded-xl p-4 flex-row items-center">
                <View className={`${stat.color} rounded-lg p-2 mr-3`}>
                  <stat.icon size={20} color="white" />
                </View>
                <View>
                  <Text className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </Text>
                  <Text className="text-gray-500 text-sm">{stat.label}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Recent Tasks */}
        <View className="bg-white rounded-xl p-4">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-semibold text-gray-900">
              Recent Tasks
            </Text>
            <Link href="/tasks" asChild>
              <TouchableOpacity>
                <Text className="text-primary-600 text-sm">View all →</Text>
              </TouchableOpacity>
            </Link>
          </View>

          {recentTasks.length === 0 ? (
            <View className="py-8 items-center">
              <Text className="text-gray-400">No tasks yet</Text>
            </View>
          ) : (
            <View className="space-y-3">
              {recentTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}
```

### Tasks List Screen

```typescript
// app/(tabs)/tasks/index.tsx

import { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { Link, Stack } from 'expo-router';
import { useTasksStore } from '@/stores/tasks';
import { TaskCard } from '@/components/tasks/TaskCard';
import { TaskFilters } from '@/components/tasks/TaskFilters';
import { Plus, Filter } from 'lucide-react-native';
import { TaskStatus } from '@/types';

export default function TasksScreen() {
  const { tasks, isLoading, fetchTasks } = useTasksStore();
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const filteredTasks = statusFilter === 'all'
    ? tasks
    : tasks.filter((t) => t.status === statusFilter);

  const renderItem = useCallback(
    ({ item }: { item: typeof tasks[0] }) => <TaskCard task={item} />,
    []
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Tasks',
          headerRight: () => (
            <View className="flex-row items-center">
              <TouchableOpacity
                onPress={() => setShowFilters(!showFilters)}
                className="p-2 mr-2"
              >
                <Filter size={22} color="#6b7280" />
              </TouchableOpacity>
              <Link href="/tasks/new" asChild>
                <TouchableOpacity className="p-2">
                  <Plus size={24} color="#2563eb" />
                </TouchableOpacity>
              </Link>
            </View>
          ),
        }}
      />

      <View className="flex-1 bg-gray-100">
        {showFilters && (
          <TaskFilters
            currentFilter={statusFilter}
            onFilterChange={setStatusFilter}
          />
        )}

        <FlatList
          data={filteredTasks}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          ItemSeparatorComponent={() => <View className="h-3" />}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={fetchTasks} />
          }
          ListEmptyComponent={
            <View className="py-12 items-center">
              <Text className="text-gray-400 text-lg">No tasks found</Text>
            </View>
          }
        />
      </View>
    </>
  );
}
```

### Task Detail Screen

```typescript
// app/(tabs)/tasks/[id].tsx

import { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Linking } from 'react-native';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { useTasksStore } from '@/stores/tasks';
import { formatDistanceToNow, format } from 'date-fns';
import {
  Phone,
  Mail,
  MapPin,
  Calendar,
  CheckCircle,
  Clock,
  User,
  FileText,
} from 'lucide-react-native';

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
  urgent: 'border-red-500',
};

export default function TaskDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { currentTask, fetchTask, completeTask, isLoading } = useTasksStore();

  useEffect(() => {
    if (id) {
      fetchTask(id);
    }
  }, [id]);

  const handleComplete = async () => {
    Alert.alert(
      'Complete Task',
      'Are you sure you want to mark this task as complete?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Complete',
          onPress: async () => {
            await completeTask(id);
            router.back();
          },
        },
      ]
    );
  };

  const handleCall = () => {
    if (currentTask?.contact_phone) {
      Linking.openURL(`tel:${currentTask.contact_phone}`);
    }
  };

  const handleEmail = () => {
    if (currentTask?.contact_email) {
      Linking.openURL(`mailto:${currentTask.contact_email}`);
    }
  };

  if (!currentTask) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-100">
        <Text className="text-gray-400">Loading...</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Task Details',
          headerRight: () =>
            currentTask.status !== 'completed' ? (
              <TouchableOpacity onPress={handleComplete} className="p-2">
                <CheckCircle size={24} color="#22c55e" />
              </TouchableOpacity>
            ) : null,
        }}
      />

      <ScrollView className="flex-1 bg-gray-100">
        <View className="p-4">
          {/* Header Card */}
          <View
            className={`bg-white rounded-xl p-4 border-l-4 ${priorityColors[currentTask.priority]}`}
          >
            <View className="flex-row items-start justify-between">
              <View className="flex-1">
                <Text className="text-xl font-bold text-gray-900">
                  {currentTask.title}
                </Text>
                {currentTask.description && (
                  <Text className="text-gray-600 mt-2">
                    {currentTask.description}
                  </Text>
                )}
              </View>
              <View
                className={`px-3 py-1 rounded-full ${statusColors[currentTask.status]}`}
              >
                <Text className="text-sm font-medium capitalize">
                  {currentTask.status.replace('_', ' ')}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center mt-4 pt-4 border-t border-gray-100">
              <Clock size={16} color="#9ca3af" />
              <Text className="text-gray-500 text-sm ml-2">
                Created {formatDistanceToNow(new Date(currentTask.created_at), { addSuffix: true })}
              </Text>
            </View>
          </View>

          {/* Contact Card */}
          {(currentTask.contact_name || currentTask.contact_phone || currentTask.contact_email) && (
            <View className="bg-white rounded-xl p-4 mt-4">
              <Text className="text-lg font-semibold text-gray-900 mb-3">
                Contact
              </Text>

              {currentTask.contact_name && (
                <View className="flex-row items-center mb-3">
                  <User size={18} color="#6b7280" />
                  <Text className="text-gray-700 ml-3">{currentTask.contact_name}</Text>
                </View>
              )}

              {currentTask.contact_phone && (
                <TouchableOpacity
                  onPress={handleCall}
                  className="flex-row items-center mb-3"
                >
                  <Phone size={18} color="#2563eb" />
                  <Text className="text-primary-600 ml-3">
                    {currentTask.contact_phone}
                  </Text>
                </TouchableOpacity>
              )}

              {currentTask.contact_email && (
                <TouchableOpacity
                  onPress={handleEmail}
                  className="flex-row items-center"
                >
                  <Mail size={18} color="#2563eb" />
                  <Text className="text-primary-600 ml-3">
                    {currentTask.contact_email}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Location Card */}
          {currentTask.location_address && (
            <View className="bg-white rounded-xl p-4 mt-4">
              <Text className="text-lg font-semibold text-gray-900 mb-3">
                Location
              </Text>
              <View className="flex-row items-start">
                <MapPin size={18} color="#6b7280" />
                <View className="ml-3 flex-1">
                  <Text className="text-gray-700">
                    {currentTask.location_address}
                    {currentTask.location_unit && `, ${currentTask.location_unit}`}
                  </Text>
                  <Text className="text-gray-500">
                    {[currentTask.location_city, currentTask.location_state, currentTask.location_zip]
                      .filter(Boolean)
                      .join(', ')}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Deliverables */}
          {currentTask.deliverables && currentTask.deliverables.length > 0 && (
            <View className="bg-white rounded-xl p-4 mt-4">
              <Text className="text-lg font-semibold text-gray-900 mb-3">
                Deliverables
              </Text>
              {currentTask.deliverables.map((deliverable, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => Linking.openURL(deliverable.url)}
                  className="flex-row items-center py-2 border-b border-gray-100 last:border-0"
                >
                  <FileText size={18} color="#2563eb" />
                  <Text className="text-primary-600 ml-3">{deliverable.type}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Tags */}
          {currentTask.tags && currentTask.tags.length > 0 && (
            <View className="bg-white rounded-xl p-4 mt-4">
              <Text className="text-lg font-semibold text-gray-900 mb-3">
                Tags
              </Text>
              <View className="flex-row flex-wrap">
                {currentTask.tags.map((tag, index) => (
                  <View
                    key={index}
                    className="bg-gray-100 rounded-full px-3 py-1 mr-2 mb-2"
                  >
                    <Text className="text-gray-600 text-sm">{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Actions */}
          {currentTask.status !== 'completed' && currentTask.status !== 'cancelled' && (
            <TouchableOpacity
              onPress={handleComplete}
              className="bg-green-600 rounded-xl py-4 mt-4"
            >
              <Text className="text-white text-center font-semibold text-lg">
                Mark as Complete
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </>
  );
}
```

### Rules List Screen

```typescript
// app/(tabs)/rules/index.tsx

import { useEffect, useCallback } from 'react';
import { View, Text, FlatList, RefreshControl, TouchableOpacity, Alert } from 'react-native';
import { Link, Stack } from 'expo-router';
import { useRulesStore } from '@/stores/rules';
import { RuleCard } from '@/components/rules/RuleCard';
import { Plus, Info } from 'lucide-react-native';

export default function RulesScreen() {
  const { rules, isLoading, fetchRules, deleteRule, toggleRule } = useRulesStore();

  useEffect(() => {
    fetchRules();
  }, []);

  const handleDelete = (id: string, name: string) => {
    Alert.alert(
      'Delete Rule',
      `Are you sure you want to delete "${name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteRule(id),
        },
      ]
    );
  };

  const renderItem = useCallback(
    ({ item }: { item: typeof rules[0] }) => (
      <RuleCard
        rule={item}
        onToggle={() => toggleRule(item.id)}
        onDelete={() => handleDelete(item.id, item.name)}
      />
    ),
    [toggleRule, deleteRule]
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Routing Rules',
          headerRight: () => (
            <Link href="/rules/new" asChild>
              <TouchableOpacity className="p-2">
                <Plus size={24} color="#2563eb" />
              </TouchableOpacity>
            </Link>
          ),
        }}
      />

      <View className="flex-1 bg-gray-100">
        {/* Info Banner */}
        <View className="bg-blue-50 p-4 flex-row items-start">
          <Info size={20} color="#3b82f6" />
          <Text className="text-blue-700 text-sm ml-3 flex-1">
            Rules are evaluated top to bottom. First match wins. Messages without
            a match go to you.
          </Text>
        </View>

        <FlatList
          data={rules}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          ItemSeparatorComponent={() => <View className="h-3" />}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={fetchRules} />
          }
          ListEmptyComponent={
            <View className="py-12 items-center">
              <Text className="text-gray-400 text-lg mb-4">No rules yet</Text>
              <Link href="/rules/new" asChild>
                <TouchableOpacity className="bg-primary-600 px-6 py-3 rounded-lg">
                  <Text className="text-white font-semibold">Create First Rule</Text>
                </TouchableOpacity>
              </Link>
            </View>
          }
          ListFooterComponent={
            rules.length > 0 ? (
              <View className="mt-3 bg-gray-200 border-2 border-dashed border-gray-300 rounded-xl p-4">
                <View className="flex-row items-center">
                  <View className="w-8 h-8 rounded-full bg-gray-300 items-center justify-center mr-3">
                    <Text className="text-gray-500">∞</Text>
                  </View>
                  <View>
                    <Text className="font-medium text-gray-500">Default Rule</Text>
                    <Text className="text-gray-400 text-sm">
                      Unmatched messages assigned to you
                    </Text>
                  </View>
                </View>
              </View>
            ) : null
          }
        />
      </View>
    </>
  );
}
```

### Settings Screen

```typescript
// app/(tabs)/settings.tsx

import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '@/stores/auth';
import {
  User,
  Bell,
  CreditCard,
  HelpCircle,
  LogOut,
  ChevronRight,
  Phone,
  Mail,
} from 'lucide-react-native';

export default function SettingsScreen() {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/login');
          },
        },
      ]
    );
  };

  const settingsSections = [
    {
      title: 'Account',
      items: [
        { icon: User, label: 'Profile', href: '/settings/profile' },
        { icon: Bell, label: 'Notifications', href: '/settings/notifications' },
        { icon: CreditCard, label: 'Subscription', href: '/settings/subscription' },
      ],
    },
    {
      title: 'Assistant',
      items: [
        { icon: Phone, label: 'Phone Channel', href: '/channels' },
        { icon: Mail, label: 'Email Channel', href: '/channels' },
      ],
    },
    {
      title: 'Support',
      items: [
        { icon: HelpCircle, label: 'Help Center', href: '/settings/help' },
      ],
    },
  ];

  return (
    <ScrollView className="flex-1 bg-gray-100">
      <View className="p-4">
        {/* User Info */}
        <View className="bg-white rounded-xl p-4 mb-4">
          <View className="flex-row items-center">
            <View className="w-16 h-16 rounded-full bg-primary-100 items-center justify-center">
              <Text className="text-2xl font-bold text-primary-600">
                {user?.name?.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View className="ml-4">
              <Text className="text-xl font-bold text-gray-900">{user?.name}</Text>
              <Text className="text-gray-500">{user?.email}</Text>
              <View className="mt-1 bg-primary-100 px-2 py-0.5 rounded self-start">
                <Text className="text-primary-700 text-sm capitalize">
                  {user?.plan} Plan
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Settings Sections */}
        {settingsSections.map((section) => (
          <View key={section.title} className="mb-4">
            <Text className="text-sm font-medium text-gray-500 mb-2 ml-2">
              {section.title}
            </Text>
            <View className="bg-white rounded-xl overflow-hidden">
              {section.items.map((item, index) => (
                <TouchableOpacity
                  key={item.label}
                  className={`flex-row items-center p-4 ${
                    index > 0 ? 'border-t border-gray-100' : ''
                  }`}
                  onPress={() => router.push(item.href)}
                >
                  <item.icon size={22} color="#6b7280" />
                  <Text className="flex-1 text-gray-900 ml-3">{item.label}</Text>
                  <ChevronRight size={20} color="#9ca3af" />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Logout */}
        <TouchableOpacity
          className="bg-white rounded-xl p-4 flex-row items-center"
          onPress={handleLogout}
        >
          <LogOut size={22} color="#ef4444" />
          <Text className="text-red-500 ml-3 font-medium">Logout</Text>
        </TouchableOpacity>

        {/* Version */}
        <Text className="text-center text-gray-400 text-sm mt-6">
          Version 1.0.0
        </Text>
      </View>
    </ScrollView>
  );
}
```

---

## Components

### Task Card

```typescript
// components/tasks/TaskCard.tsx

import { TouchableOpacity, View, Text } from 'react-native';
import { Link } from 'expo-router';
import { Task } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { Phone, Mail, MessageSquare, Globe } from 'lucide-react-native';

const statusColors = {
  pending: 'bg-yellow-100',
  accepted: 'bg-blue-100',
  in_progress: 'bg-orange-100',
  completed: 'bg-green-100',
  cancelled: 'bg-gray-100',
};

const statusTextColors = {
  pending: 'text-yellow-800',
  accepted: 'text-blue-800',
  in_progress: 'text-orange-800',
  completed: 'text-green-800',
  cancelled: 'text-gray-800',
};

const priorityBorders = {
  low: 'border-l-gray-300',
  normal: 'border-l-blue-400',
  high: 'border-l-orange-400',
  urgent: 'border-l-red-500',
};

const sourceIcons = {
  phone: Phone,
  email: Mail,
  sms: MessageSquare,
  web: Globe,
  api: Globe,
};

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const SourceIcon = sourceIcons[task.source_type || 'web'];
  const timeAgo = formatDistanceToNow(new Date(task.created_at), { addSuffix: true });

  return (
    <Link href={`/tasks/${task.id}`} asChild>
      <TouchableOpacity
        className={`bg-white rounded-xl p-4 border-l-4 ${priorityBorders[task.priority]}`}
        activeOpacity={0.7}
      >
        <View className="flex-row items-start">
          <View className="flex-1">
            <View className="flex-row items-center">
              <SourceIcon size={16} color="#9ca3af" />
              <Text className="text-gray-900 font-semibold ml-2 flex-1" numberOfLines={1}>
                {task.title}
              </Text>
            </View>

            {task.contact_name && (
              <Text className="text-gray-500 text-sm mt-1">
                From: {task.contact_name}
              </Text>
            )}

            <View className="flex-row items-center mt-2">
              <View
                className={`px-2 py-0.5 rounded-full ${statusColors[task.status]}`}
              >
                <Text
                  className={`text-xs font-medium ${statusTextColors[task.status]}`}
                >
                  {task.status.replace('_', ' ')}
                </Text>
              </View>
              <Text className="text-gray-400 text-xs ml-2">{timeAgo}</Text>
            </View>
          </View>

          {task.priority === 'urgent' && (
            <View className="bg-red-100 px-2 py-1 rounded">
              <Text className="text-red-700 text-xs font-bold">URGENT</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Link>
  );
}
```

### Rule Card

```typescript
// components/rules/RuleCard.tsx

import { TouchableOpacity, View, Text, Switch } from 'react-native';
import { Link } from 'expo-router';
import { RoutingRule } from '@/types';
import { Edit2, Trash2, GripVertical } from 'lucide-react-native';

interface RuleCardProps {
  rule: RoutingRule;
  onToggle: () => void;
  onDelete: () => void;
}

export function RuleCard({ rule, onToggle, onDelete }: RuleCardProps) {
  const conditionCount = rule.conditions.rules?.length || 0;
  const matchType = rule.conditions.match_type === 'all' ? 'AND' : 'OR';

  const assigneeLabel = {
    self: 'yourself',
    team_member: 'team member',
    marketplace_human: 'marketplace (human)',
    marketplace_ai: 'marketplace (AI)',
  }[rule.actions.assignee_type];

  return (
    <View
      className={`bg-white rounded-xl p-4 ${!rule.is_active ? 'opacity-60' : ''}`}
    >
      <View className="flex-row items-center">
        {/* Drag Handle */}
        <View className="mr-3">
          <GripVertical size={20} color="#d1d5db" />
        </View>

        {/* Content */}
        <View className="flex-1">
          <View className="flex-row items-center">
            <Text className="font-semibold text-gray-900">{rule.name}</Text>
            {rule.times_matched > 0 && (
              <Text className="text-gray-400 text-xs ml-2">
                ({rule.times_matched} matches)
              </Text>
            )}
          </View>
          <Text className="text-gray-500 text-sm mt-1">
            {conditionCount} condition{conditionCount !== 1 ? 's' : ''} ({matchType}) →{' '}
            {assigneeLabel}, {rule.actions.priority} priority
          </Text>
        </View>

        {/* Toggle */}
        <Switch
          value={rule.is_active}
          onValueChange={onToggle}
          trackColor={{ false: '#e5e7eb', true: '#bfdbfe' }}
          thumbColor={rule.is_active ? '#2563eb' : '#9ca3af'}
        />
      </View>

      {/* Actions */}
      <View className="flex-row justify-end mt-3 pt-3 border-t border-gray-100">
        <Link href={`/rules/${rule.id}`} asChild>
          <TouchableOpacity className="flex-row items-center mr-4">
            <Edit2 size={16} color="#6b7280" />
            <Text className="text-gray-600 text-sm ml-1">Edit</Text>
          </TouchableOpacity>
        </Link>
        <TouchableOpacity className="flex-row items-center" onPress={onDelete}>
          <Trash2 size={16} color="#ef4444" />
          <Text className="text-red-500 text-sm ml-1">Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
```

### Task Filters

```typescript
// components/tasks/TaskFilters.tsx

import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { TaskStatus } from '@/types';

interface TaskFiltersProps {
  currentFilter: TaskStatus | 'all';
  onFilterChange: (filter: TaskStatus | 'all') => void;
}

const filters: { value: TaskStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
];

export function TaskFilters({ currentFilter, onFilterChange }: TaskFiltersProps) {
  return (
    <View className="bg-white border-b border-gray-200">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12 }}
      >
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.value}
            onPress={() => onFilterChange(filter.value)}
            className={`px-4 py-2 rounded-full mr-2 ${
              currentFilter === filter.value
                ? 'bg-primary-600'
                : 'bg-gray-100'
            }`}
          >
            <Text
              className={`text-sm font-medium ${
                currentFilter === filter.value
                  ? 'text-white'
                  : 'text-gray-600'
              }`}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
```

---

## Environment Variables

```bash
# .env
EXPO_PUBLIC_API_URL=http://localhost:8000/api
EXPO_PUBLIC_PROJECT_ID=your-expo-project-id
EXPO_PUBLIC_PUSHER_APP_KEY=your-pusher-key
EXPO_PUBLIC_PUSHER_APP_CLUSTER=us2
```

---

## Build & Deploy

### Development

```bash
# Start development server
npx expo start

# Run on iOS simulator
npx expo run:ios

# Run on Android emulator
npx expo run:android
```

### EAS Build

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure EAS
eas build:configure

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android

# Submit to stores
eas submit --platform ios
eas submit --platform android
```

### eas.json

```json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {}
  },
  "submit": {
    "production": {}
  }
}
```

---

## Next Steps

After implementing the mobile app:

1. Add push notification handling for new tasks
2. Implement pull-to-refresh on all lists
3. Add offline support with local storage
4. Implement deep linking for task URLs
5. Add biometric authentication
6. Implement dark mode
7. Add haptic feedback for actions
8. Implement voice command feature (future)
