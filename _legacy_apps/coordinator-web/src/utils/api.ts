import axios, { type AxiosInstance, type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/stores/auth';
import { apiCache, CACHE_TTL } from './cache';
import { createCancelToken, requestCancellationManager } from './requestCancellation';
import { trackApiCall } from './performance';

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor for auth, caching, cancellation, and performance tracking
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const authStore = useAuthStore();
  if (authStore.token) {
    config.headers.Authorization = `Bearer ${authStore.token}`;
  }
  
  // Add app context header for all requests
  config.headers['X-App-Context'] = 'coordinator';

  // Track request start time for performance monitoring
  (config as any).__startTime = performance.now();

  // Add cancel token for request cancellation (unless disabled)
  if ((config as any).cancelToken === undefined && (config as any).cancel !== false) {
    const { cancelToken, cancelKey } = createCancelToken(config);
    config.cancelToken = cancelToken;
    (config as any).__cancelKey = cancelKey;
  }

  // Check cache for GET requests (unless explicitly disabled)
  if (config.method === 'get' && (config as any).cache !== false) {
    // Check cache first
    const cached = apiCache.get(config.url!, config.params);
    if (cached) {
      // Remove from cancellation tracking since we're using cache
      const cancelKey = (config as any).__cancelKey;
      if (cancelKey) {
        requestCancellationManager.removeRequest(cancelKey);
      }
      // Return cached response synchronously
      return Promise.resolve({
        ...config,
        data: cached,
        headers: config.headers,
        status: 200,
        statusText: 'OK',
        config,
        request: {},
      } as any);
    }
  }

  return config;
});

api.interceptors.response.use(
  (response) => {
    // Track API call performance
    const startTime = (response.config as any).__startTime;
    if (startTime) {
      trackApiCall(
        response.config.url || '',
        response.config.method || 'GET',
        startTime,
        response.status
      );
    }

    // Remove from cancellation tracking on success
    const cancelKey = (response.config as any).__cancelKey;
    if (cancelKey) {
      requestCancellationManager.removeRequest(cancelKey);
    }

    // Cache GET responses
    const config = response.config as InternalAxiosRequestConfig & { cache?: boolean; cacheTTL?: number };
    if (config.method === 'get' && (config as any).cache !== false) {
      const ttl = (config as any).cacheTTL || CACHE_TTL.MEDIUM;
      apiCache.set(config.url!, response.data, ttl, config.params);
    }
    return response;
  },
  (error: AxiosError) => {
    // Track API call performance (even for errors)
    const startTime = (error.config as any)?.__startTime;
    if (startTime) {
      trackApiCall(
        error.config?.url || '',
        error.config?.method || 'GET',
        startTime,
        error.response?.status || null
      );
    }

    // Remove from cancellation tracking on error (unless it was cancelled)
    if (!axios.isCancel(error)) {
      const cancelKey = (error.config as any)?.__cancelKey;
      if (cancelKey) {
        requestCancellationManager.removeRequest(cancelKey);
      }
    }

    if (!error.response) {
      // Network error - log but don't show toast for every error
      // Only log in development
      if (import.meta.env.DEV) {
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
    }

    if (error.response?.status === 401) {
      const authStore = useAuthStore();
      authStore.logout();
      window.location.href = '/login';
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

