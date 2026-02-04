import { ref } from 'vue';
import { vapiService } from '@/services/vapi';
import api from '@/utils/api';

export function useVoice() {
  const isCallActive = ref(false);
  const currentCallId = ref<string | null>(null);

  async function startCall(config: { assistantId: string; customerNumber: string }) {
    try {
      const response = await vapiService.startCall(config);
      currentCallId.value = response.id;
      isCallActive.value = true;
      return response;
    } catch (error) {
      throw error;
    }
  }

  async function endCall() {
    if (currentCallId.value) {
      await vapiService.endCall(currentCallId.value);
      currentCallId.value = null;
      isCallActive.value = false;
    }
  }

  async function findResponse(userInput: string, context?: Record<string, any>) {
    try {
      const response = await api.post('/urpa/voice/find-response', {
        user_input: userInput,
        ...context,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  return {
    isCallActive,
    currentCallId,
    startCall,
    endCall,
    findResponse,
  };
}

