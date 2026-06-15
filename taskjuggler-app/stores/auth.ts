import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api, { TOKEN_KEY } from '../utils/api';
import { unwrapApiData, type AuthPayload } from '../utils/apiHelpers';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  enabledModules: string[];
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
  initialize: () => Promise<void>;
}

async function migrateLegacyToken(): Promise<string | null> {
  const secureToken = await SecureStore.getItemAsync(TOKEN_KEY);
  if (secureToken) {
    return secureToken;
  }

  const legacyToken = await AsyncStorage.getItem('token');
  if (legacyToken) {
    await SecureStore.setItemAsync(TOKEN_KEY, legacyToken);
    await AsyncStorage.removeItem('token');
    return legacyToken;
  }

  return null;
}

function extractModules(user: User | AuthPayload['user']): string[] {
  if (Array.isArray(user.enabled_modules)) {
    return user.enabled_modules;
  }

  const settings = user.settings as { enabled_modules?: string[] } | undefined;
  return settings?.enabled_modules ?? [];
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  loading: false,
  isAuthenticated: false,
  enabledModules: [],

  initialize: async () => {
    try {
      const token = await migrateLegacyToken();
      if (token) {
        set({ token, isAuthenticated: true });
        await get().fetchUser();
      }
    } catch {
      // Token invalid or expired — stay logged out
    }
  },

  login: async (email: string, password: string) => {
    set({ loading: true });
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = unwrapApiData<AuthPayload>(response.data);
      await SecureStore.setItemAsync(TOKEN_KEY, token);
      const modules = extractModules(user);
      set({
        token,
        user: user as User,
        isAuthenticated: true,
        loading: false,
        enabledModules: modules,
      });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  register: async (data) => {
    set({ loading: true });
    try {
      const response = await api.post('/auth/register', data);
      const { token, user } = unwrapApiData<AuthPayload>(response.data);
      await SecureStore.setItemAsync(TOKEN_KEY, token);
      const modules = extractModules(user);
      set({
        token,
        user: user as User,
        isAuthenticated: true,
        loading: false,
        enabledModules: modules,
      });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  logout: async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      enabledModules: [],
    });
  },

  fetchUser: async () => {
    try {
      const response = await api.get('/auth/user');
      const user = unwrapApiData<User>(response.data);
      const modules = extractModules(user);
      set({ user, enabledModules: modules });
    } catch {
      await get().logout();
    }
  },
}));
