import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '@/utils/api';
import { getEcho } from '@/utils/echo';
import { useAuthStore } from './auth';
import type { PhoneCall } from '@/types/phone';

interface CallFilters {
  direction?: 'inbound' | 'outbound';
  status?: string;
  start_date?: string;
  end_date?: string;
}

export const usePhoneStore = defineStore('phone', () => {
  const calls = ref<PhoneCall[]>([]);
  const currentCall = ref<PhoneCall | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  let echoChannel: any = null;

  async function fetchCalls(filters?: CallFilters) {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.get('/urpa/phone/calls', { params: filters });
      calls.value = response.data.data || [];
      return response.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to load calls';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function startCall(data: { contact_id?: string; recipient_number: string }) {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.post('/urpa/phone/calls', data);
      const newCall = response.data;
      calls.value.unshift(newCall);
      currentCall.value = newCall;
      return newCall;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to start call';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function endCall(callId: string) {
    loading.value = true;
    try {
      await api.patch(`/urpa/phone/calls/${callId}/complete`);
      const call = calls.value.find(c => c.id === callId);
      if (call) {
        call.status = 'completed';
        call.ended_at = new Date().toISOString();
      }
      if (currentCall.value?.id === callId) {
        currentCall.value = null;
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to end call';
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
      echoChannel.listen('.phone.call.status.changed', (e: { phoneCall: PhoneCall }) => {
        const existingIndex = calls.value.findIndex(call => call.id === e.phoneCall.id);
        if (existingIndex !== -1) {
          calls.value[existingIndex] = e.phoneCall;
        } else {
          calls.value.unshift(e.phoneCall);
        }
        if (currentCall.value && currentCall.value.id === e.phoneCall.id) {
          currentCall.value = e.phoneCall;
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
    calls,
    currentCall,
    loading,
    error,
    fetchCalls,
    startCall,
    endCall,
    setupRealtimeListeners,
    cleanupRealtimeListeners,
  };
});

