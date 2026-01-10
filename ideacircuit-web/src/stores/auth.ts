import { create } from 'zustand';
import api from '../services/api';

export interface User {
  id: string;
  name: string;
  email: string;
  email_verified_at?: string;
  created_at: string;
  updated_at: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { name: string; email: string; password: string; password_confirmation: string }) => Promise<void>;
  logout: () => void;
  fetchUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: localStorage.getItem('token'),
  loading: false,
  isAuthenticated: !!localStorage.getItem('token'),

  login: async (email: string, password: string) => {
    set({ loading: true });
    try {
      const response = await api.post('/auth/login', { email, password });
      const responseData = response.data.data || response.data;
      const token = responseData.token;
      const user = responseData.user;

      if (!token) {
        throw new Error('No token received from server');
      }

      localStorage.setItem('token', token);
      set({ user, token, isAuthenticated: true, loading: false });
    } catch (error: any) {
      set({ loading: false });
      throw error;
    }
  },

  register: async (data) => {
    set({ loading: true });
    try {
      const response = await api.post('/auth/register', data);
      const responseData = response.data.data || response.data;
      const token = responseData.token;
      const user = responseData.user;

      if (!token) {
        throw new Error('No token received from server');
      }

      localStorage.setItem('token', token);
      set({ user, token, isAuthenticated: true, loading: false });
    } catch (error: any) {
      set({ loading: false });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false });
  },

  fetchUser: async () => {
    const { token } = get();
    if (!token) return;

    try {
      const response = await api.get('/auth/user');
      const user = response.data.data || response.data;
      set({ user });
    } catch (error) {
      get().logout();
    }
  },
}));

