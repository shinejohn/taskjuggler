import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '@/utils/api';
import type { UrpaArtifact, AITask } from '@/types/ai';

interface AISession {
  id: string;
  user_id: string;
  session_type: string;
  persona_used?: string;
  message_count: number;
  ai_request_count: number;
  created_at: string;
}

interface AIMessage {
  id: string;
  session_id: string;
  role: 'user' | 'assistant';
  content: string;
  input_tokens?: number;
  output_tokens?: number;
  created_at: string;
}

export const useAiStore = defineStore('ai', () => {
  const sessions = ref<AISession[]>([]);
  const currentSession = ref<AISession | null>(null);
  const messages = ref<AIMessage[]>([]);
  const artifacts = ref<UrpaArtifact[]>([]);
  const tasks = ref<AITask[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchSessions() {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.get('/urpa/ai/sessions');
      sessions.value = response.data.data || [];
      return response.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to load sessions';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function createSession(type: string, persona?: string): Promise<AISession> {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.post('/urpa/ai/sessions', {
        session_type: type,
        persona_used: persona,
      });
      currentSession.value = response.data;
      sessions.value.unshift(response.data);
      return response.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create session';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function fetchMessages(sessionId: string) {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.get(`/urpa/ai/sessions/${sessionId}/messages`);
      messages.value = response.data.data || [];
      return response.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to load messages';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function sendMessage(sessionId: string, content: string) {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.post(`/urpa/ai/sessions/${sessionId}/messages`, {
        content,
      });
      if (response.data.user_message) {
        messages.value.push(response.data.user_message);
      }
      if (response.data.ai_message) {
        messages.value.push(response.data.ai_message);
      }
      return response.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to send message';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function fetchArtifacts() {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.get('/urpa/ai/artifacts');
      artifacts.value = response.data.data || [];
      return response.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to load artifacts';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function generateArtifact(type: string, prompt: string, language?: string) {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.post('/urpa/ai/artifacts', {
        artifact_type: type,
        prompt,
        language,
      });
      artifacts.value.unshift(response.data);
      return response.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to generate artifact';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function fetchTasks() {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.get('/urpa/ai/tasks');
      tasks.value = response.data.data || [];
      return response.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to load tasks';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  return {
    sessions,
    currentSession,
    messages,
    artifacts,
    tasks,
    loading,
    error,
    fetchSessions,
    createSession,
    fetchMessages,
    sendMessage,
    fetchArtifacts,
    generateArtifact,
    fetchTasks,
  };
});

