import axios, { type AxiosInstance, type AxiosError } from 'axios';
import { useAuthStore } from '@/stores/auth';

const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const authStore = useAuthStore();
  if (authStore.token) {
    config.headers.Authorization = `Bearer ${authStore.token}`;
  }
  
  // Add app context header for all requests
  config.headers['X-App-Context'] = 'process';
  
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
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

export default apiClient;
