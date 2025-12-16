import axios, { type AxiosInstance, type AxiosError } from 'axios';
import { useAuthStore } from '@/stores/auth';

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const authStore = useAuthStore();
  if (authStore.token) {
    config.headers.Authorization = `Bearer ${authStore.token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Log network errors for debugging
    if (!error.response) {
      console.error('Network Error:', {
        message: error.message,
        code: error.code,
        config: {
          url: error.config?.url,
          baseURL: error.config?.baseURL,
          method: error.config?.method,
        },
      });
    }

    if (error.response?.status === 401) {
      const authStore = useAuthStore();
      authStore.logout();
      window.location.href = '/login';
    } else {
      // Show error toast
      const message = (error.response?.data as any)?.message || 
                     (error.response?.data as any)?.error || 
                     error.message || 
                     'An error occurred';
      
      if ((window as any).$toast) {
        (window as any).$toast.error(message);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
