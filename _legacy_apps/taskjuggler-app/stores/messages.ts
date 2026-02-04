import { create } from 'zustand';
import api from '../utils/api';

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

interface MessagesState {
  taskMessages: Record<string, TaskMessage[]>;
  directMessages: Record<string, DirectMessage[]>;
  conversations: Conversation[];
  unreadCounts: Record<string, number>;
  directUnreadCount: number;
  loading: boolean;
  fetchTaskMessages: (taskId: string, limit?: number, before?: string) => Promise<TaskMessage[]>;
  sendTaskMessage: (taskId: string, content: string, contentType?: string, attachments?: any[]) => Promise<TaskMessage>;
  markTaskMessagesRead: (taskId: string) => Promise<void>;
  fetchTaskUnreadCount: (taskId: string) => Promise<number>;
  fetchConversations: () => Promise<void>;
  fetchDirectMessages: (userId: string, limit?: number) => Promise<any>;
  sendDirectMessage: (recipientId: string, content: string) => Promise<DirectMessage>;
  fetchDirectUnreadCount: () => Promise<number>;
}

export const useMessagesStore = create<MessagesState>((set, get) => ({
  taskMessages: {},
  directMessages: {},
  conversations: [],
  unreadCounts: {},
  directUnreadCount: 0,
  loading: false,

  fetchTaskMessages: async (taskId: string, limit = 50, before?: string) => {
    set({ loading: true });
    try {
      const params: any = { limit };
      if (before) params.before = before;
      const response = await api.get(`/tasks/${taskId}/messages`, { params });
      const messages = response.data.messages || [];
      set((state) => ({
        taskMessages: { ...state.taskMessages, [taskId]: messages },
        loading: false,
      }));
      return messages;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  sendTaskMessage: async (taskId: string, content: string, contentType = 'text', attachments?: any[]) => {
    const response = await api.post(`/tasks/${taskId}/messages`, {
      content,
      content_type: contentType,
      attachments,
    });
    const message = response.data.message;
    set((state) => {
      const existing = state.taskMessages[taskId] || [];
      return {
        taskMessages: { ...state.taskMessages, [taskId]: [...existing, message] },
      };
    });
    return message;
  },

  markTaskMessagesRead: async (taskId: string) => {
    await api.post(`/tasks/${taskId}/messages/read`);
    await get().fetchTaskUnreadCount(taskId);
  },

  fetchTaskUnreadCount: async (taskId: string) => {
    const response = await api.get(`/tasks/${taskId}/messages/unread`);
    const count = response.data.unread_count || 0;
    set((state) => ({
      unreadCounts: { ...state.unreadCounts, [taskId]: count },
    }));
    return count;
  },

  fetchConversations: async () => {
    set({ loading: true });
    try {
      const response = await api.get('/messages/conversations');
      set({ conversations: response.data.conversations || [], loading: false });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  fetchDirectMessages: async (userId: string, limit = 50) => {
    set({ loading: true });
    try {
      const response = await api.get(`/messages/with/${userId}`, { params: { limit } });
      const messages = response.data.messages || [];
      set((state) => ({
        directMessages: { ...state.directMessages, [userId]: messages },
        loading: false,
      }));
      return response.data;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  sendDirectMessage: async (recipientId: string, content: string) => {
    const response = await api.post(`/messages/to/${recipientId}`, { content });
    const message = response.data.message;
    set((state) => {
      const existing = state.directMessages[recipientId] || [];
      return {
        directMessages: { ...state.directMessages, [recipientId]: [...existing, message] },
      };
    });
    await get().fetchConversations(); // Refresh conversations
    return message;
  },

  fetchDirectUnreadCount: async () => {
    const response = await api.get('/messages/unread');
    const count = response.data.unread_count || 0;
    set({ directUnreadCount: count });
    return count;
  },
}));
