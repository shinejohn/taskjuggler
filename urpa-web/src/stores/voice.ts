import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '@/utils/api';

interface PrerecordedResponse {
  id: string;
  user_id: string;
  trigger_phrase: string;
  response_text: string;
  audio_url?: string;
  usage_count: number;
  last_used_at?: string;
  created_at: string;
}

export const useVoiceStore = defineStore('voice', () => {
  const prerecordedResponses = ref<PrerecordedResponse[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const currentCallId = ref<string | null>(null);

  async function fetchPrerecordedResponses() {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.get('/urpa/voice/prerecorded');
      prerecordedResponses.value = response.data.data || response.data || [];
      return response.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to load responses';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function findResponse(userInput: string, context?: Record<string, any>) {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.post('/urpa/voice/find-response', {
        user_input: userInput,
        ...context,
      });
      return response.data.data || response.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to find response';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  return {
    prerecordedResponses,
    currentCallId,
    loading,
    error,
    fetchPrerecordedResponses,
    findResponse,
  };
});

