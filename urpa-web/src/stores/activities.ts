import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '@/utils/api';
import { getEcho } from '@/utils/echo';
import { useAuthStore } from './auth';
import type { ActivityItem } from '@/types/activity';

interface ActivityFilters {
  type?: string;
  status?: string;
  source?: string;
  start_date?: string;
  end_date?: string;
}

export const useActivitiesStore = defineStore('activities', () => {
  const activities = ref<ActivityItem[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  let echoChannel: any = null;

  async function fetchActivities(filters?: ActivityFilters) {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.get('/urpa/activities', { params: filters });
      activities.value = response.data.data || [];
      return response.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to load activities';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function createActivity(data: Partial<ActivityItem>) {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.post('/urpa/activities', data);
      activities.value.unshift(response.data);
      return response.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create activity';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  function setupRealtimeListeners() {
    const authStore = useAuthStore();
    if (!authStore.isAuthenticated || !authStore.user) {
      return;
    }

    try {
      const echo = getEcho();
      const channelName = `urpa.user.${authStore.user.id}`;
      
      // Clean up existing listener if any
      if (echoChannel) {
        echo.leave(channelName);
      }

      echoChannel = echo.private(channelName);
      echoChannel.listen('.activity.created', (e: { activity: ActivityItem }) => {
        const existingIndex = activities.value.findIndex(a => a.id === e.activity.id);
        if (existingIndex !== -1) {
          activities.value[existingIndex] = e.activity;
        } else {
          activities.value.unshift(e.activity);
        }
      });
    } catch (error) {
      // Silently fail - real-time is optional
      error.value = 'Failed to setup real-time listeners';
    }
  }

  function cleanupRealtimeListeners() {
    const authStore = useAuthStore();
    if (authStore.user && echoChannel) {
      try {
        const echo = getEcho();
        echo.leave(`urpa.user.${authStore.user.id}`);
        echoChannel = null;
      } catch (error) {
        // Silently fail
      }
    }
  }

  return {
    activities,
    loading,
    error,
    fetchActivities,
    createActivity,
    setupRealtimeListeners,
    cleanupRealtimeListeners,
  };
});

