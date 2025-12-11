import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '@/utils/api';

export interface TaskMessage {
  id: string;
  task_id: string;
  sender_id?: string;
  sender_type: 'human' | 'ai_agent' | 'system';
  content: string;
  content_type: 'text' | 'file' | 'image' | 'system';
  source_channel?: string;
  attachments?: any[];
  created_at: string;
  sender?: {
    id: string;
    name: string;
    avatar_url?: string;
  };
}

export interface DirectMessage {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  read_at?: string;
  created_at: string;
  sender?: {
    id: string;
    name: string;
    avatar_url?: string;
  };
}

export interface Conversation {
  user: {
    id: string;
    name: string;
    avatar_url?: string;
  };
  last_message: {
    content: string;
    sent_at: string;
    is_mine: boolean;
  };
  unread_count: number;
}

export const useMessagesStore = defineStore('messages', () => {
  const taskMessages = ref<Record<string, TaskMessage[]>>({});
  const directMessages = ref<Record<string, DirectMessage[]>>({});
  const conversations = ref<Conversation[]>([]);
  const unreadCounts = ref<Record<string, number>>({});
  const directUnreadCount = ref(0);
  const loading = ref(false);

  // Task Messages
  async function fetchTaskMessages(taskId: string, limit = 50, before?: string) {
    loading.value = true;
    try {
      const params: any = { limit };
      if (before) params.before = before;
      const response = await api.get(`/tasks/${taskId}/messages`, { params });
      taskMessages.value[taskId] = response.data.messages || [];
      return response.data.messages;
    } finally {
      loading.value = false;
    }
  }

  async function sendTaskMessage(taskId: string, content: string, contentType = 'text', attachments?: any[]) {
    const response = await api.post(`/tasks/${taskId}/messages`, {
      content,
      content_type: contentType,
      attachments,
    });
    if (!taskMessages.value[taskId]) {
      taskMessages.value[taskId] = [];
    }
    taskMessages.value[taskId].push(response.data.message);
    return response.data.message;
  }

  async function markTaskMessagesRead(taskId: string) {
    await api.post(`/tasks/${taskId}/messages/read`);
    await fetchTaskUnreadCount(taskId);
  }

  async function fetchTaskUnreadCount(taskId: string) {
    const response = await api.get(`/tasks/${taskId}/messages/unread`);
    unreadCounts.value[taskId] = response.data.unread_count || 0;
    return response.data.unread_count;
  }

  // Direct Messages
  async function fetchConversations() {
    loading.value = true;
    try {
      const response = await api.get('/messages/conversations');
      conversations.value = response.data.conversations || [];
    } finally {
      loading.value = false;
    }
  }

  async function fetchDirectMessages(userId: string, limit = 50) {
    loading.value = true;
    try {
      const response = await api.get(`/messages/with/${userId}`, { params: { limit } });
      directMessages.value[userId] = response.data.messages || [];
      return response.data;
    } finally {
      loading.value = false;
    }
  }

  async function sendDirectMessage(recipientId: string, content: string) {
    const response = await api.post(`/messages/to/${recipientId}`, { content });
    if (!directMessages.value[recipientId]) {
      directMessages.value[recipientId] = [];
    }
    directMessages.value[recipientId].push(response.data.message);
    await fetchConversations(); // Refresh conversations
    return response.data.message;
  }

  async function fetchDirectUnreadCount() {
    const response = await api.get('/messages/unread');
    directUnreadCount.value = response.data.unread_count || 0;
    return response.data.unread_count;
  }

  return {
    taskMessages,
    directMessages,
    conversations,
    unreadCounts,
    directUnreadCount,
    loading,
    fetchTaskMessages,
    sendTaskMessage,
    markTaskMessagesRead,
    fetchTaskUnreadCount,
    fetchConversations,
    fetchDirectMessages,
    sendDirectMessage,
    fetchDirectUnreadCount,
  };
});
