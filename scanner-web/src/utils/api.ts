import axios, { type AxiosInstance, type AxiosError } from 'axios';
import { useAuthStore } from '@/stores/auth';

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://api.taskjuggler.com/api',
  withCredentials: true, // CRITICAL for Laravel Sanctum
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
  
  // CRITICAL: Add team context
  if (authStore.currentTeam) {
    config.headers['X-Team-ID'] = authStore.currentTeam.id.toString();
  }
  
  // Add app context header for all requests
  config.headers['X-App-Context'] = 'scanner';
  
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
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
    } else if (error.response?.status === 403) {
      window.location.href = '/upgrade';
    } else {
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
