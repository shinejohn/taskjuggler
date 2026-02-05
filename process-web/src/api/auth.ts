import apiClient from './client';

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  timezone: string;
  plan?: 'free' | 'starter' | 'pro' | 'business';
  settings?: Record<string, any>;
  created_at?: string;
}

export const authApi = {
  async login(email: string, password: string) {
    const { data } = await apiClient.post('/auth/login', { email, password });
    return data.data || data;
  },

  async register(userData: { name: string; email: string; password: string; password_confirmation: string }) {
    const { data } = await apiClient.post('/auth/register', userData);
    return data.data || data;
  },

  async getUser() {
    const { data } = await apiClient.get('/auth/user');
    return data;
  },

  async logout() {
    await apiClient.post('/auth/logout');
  },
};
