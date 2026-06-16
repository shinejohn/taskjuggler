import { ref, onMounted } from 'vue';
import api from '@/services/api';

/**
 * Creates an IdeaCircuit meeting on mount for LiveKit video sessions.
 */
export function useIdeacircuitMeeting(title: string, meetingType = 'general') {
  const meetingId = ref<string | null>(null);
  const loading = ref(true);
  const error = ref<string | null>(null);

  onMounted(async () => {
    try {
      const response = await api.createMeeting({
        title,
        meeting_type: meetingType,
      });
      const meeting = response.data?.data ?? response.data;
      meetingId.value = meeting?.id ?? null;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create meeting';
    } finally {
      loading.value = false;
    }
  });

  return { meetingId, loading, error };
}
