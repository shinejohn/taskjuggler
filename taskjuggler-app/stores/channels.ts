import { create } from 'zustand';
import api from '../utils/api';
import type { Channel } from '../types';

interface ChannelsState {
  channels: Channel[];
  currentChannel: Channel | null;
  loading: boolean;
  fetchChannels: () => Promise<void>;
  provisionPhone: (data: { phone_number?: string; greeting_message?: string; voicemail_greeting?: string }) => Promise<Channel>;
  createEmail: (data: { email_address: string; greeting_message?: string }) => Promise<Channel>;
  updateChannel: (id: string, data: Partial<Channel>) => Promise<Channel>;
  deleteChannel: (id: string) => Promise<void>;
}

export const useChannelsStore = create<ChannelsState>((set) => ({
  channels: [],
  currentChannel: null,
  loading: false,

  fetchChannels: async () => {
    set({ loading: true });
    try {
      const response = await api.get('/channels');
      set({ channels: response.data, loading: false });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  provisionPhone: async (data) => {
    const response = await api.post('/channels/phone', data);
    set((state) => ({ channels: [...state.channels, response.data] }));
    return response.data;
  },

  createEmail: async (data) => {
    const response = await api.post('/channels/email', data);
    set((state) => ({ channels: [...state.channels, response.data] }));
    return response.data;
  },

  updateChannel: async (id: string, data: Partial<Channel>) => {
    const response = await api.put(`/channels/${id}`, data);
    set((state) => ({
      channels: state.channels.map((c) => (c.id === id ? response.data : c)),
      currentChannel: state.currentChannel?.id === id ? response.data : state.currentChannel,
    }));
    return response.data;
  },

  deleteChannel: async (id: string) => {
    await api.delete(`/channels/${id}`);
    set((state) => ({
      channels: state.channels.filter((c) => c.id !== id),
      currentChannel: state.currentChannel?.id === id ? null : state.currentChannel,
    }));
  },
}));
