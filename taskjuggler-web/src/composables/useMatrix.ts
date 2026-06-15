import { ref, computed } from 'vue';
import api from '@/utils/api';

export interface MatrixSession {
  enabled: boolean;
  provisioned?: boolean;
  homeserver_url?: string;
  user_id?: string;
  access_token?: string;
  device_id?: string;
}

const session = ref<MatrixSession>({ enabled: false });
const loading = ref(false);
const loaded = ref(false);

export function useMatrix() {
  const isEnabled = computed(() => session.value.enabled);
  const isProvisioned = computed(() => session.value.provisioned === true);

  async function loadSession(): Promise<MatrixSession> {
    if (loaded.value) {
      return session.value;
    }

    loading.value = true;
    try {
      const response = await api.get('/matrix/session');
      const data = response.data?.data ?? response.data;
      session.value = data as MatrixSession;
      loaded.value = true;
      return session.value;
    } catch {
      session.value = { enabled: false };
      loaded.value = true;
      return session.value;
    } finally {
      loading.value = false;
    }
  }

  function resetSession(): void {
    session.value = { enabled: false };
    loaded.value = false;
  }

  return {
    session,
    loading,
    isEnabled,
    isProvisioned,
    loadSession,
    resetSession,
  };
}
