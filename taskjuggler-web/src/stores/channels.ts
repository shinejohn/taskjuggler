import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '@/utils/api';
import type { Channel } from '@/types';

export const useChannelsStore = defineStore('channels', () => {
  const channels = ref<Channel[]>([]);
  const currentChannel = ref<Channel | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchChannels() {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.get('/channels');
      channels.value = Array.isArray(response.data) ? response.data : response.data?.data ?? [];
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch channels';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function provisionPhone(data: { phone_number?: string; greeting_message?: string; voicemail_greeting?: string }) {
    error.value = null;
    try {
      const response = await api.post('/channels/phone', data);
      channels.value.push(response.data);
      return response.data;
    } catch (err: any) {
      error.value = err.message || 'Failed to provision phone';
      throw err;
    }
  }

  async function createEmail(data: { email_address: string; greeting_message?: string }) {
    error.value = null;
    try {
      const response = await api.post('/channels/email', data);
      channels.value.push(response.data);
      return response.data;
    } catch (err: any) {
      error.value = err.message || 'Failed to create email channel';
      throw err;
    }
  }

  async function updateChannel(id: string, data: Partial<Channel>) {
    error.value = null;
    try {
      const response = await api.put(`/channels/${id}`, data);
      const index = channels.value.findIndex(c => c.id === id);
      if (index !== -1) {
        channels.value[index] = response.data;
      }
      if (currentChannel.value?.id === id) {
        currentChannel.value = response.data;
      }
      return response.data;
    } catch (err: any) {
      error.value = err.message || 'Failed to update channel';
      throw err;
    }
  }

  async function deleteChannel(id: string) {
    error.value = null;
    try {
      await api.delete(`/channels/${id}`);
      channels.value = channels.value.filter(c => c.id !== id);
    } catch (err: any) {
      error.value = err.message || 'Failed to delete channel';
      throw err;
    }
  }

  return {
    channels,
    currentChannel,
    loading,
    error,
    fetchChannels,
    provisionPhone,
    createEmail,
    updateChannel,
    deleteChannel,
  };
});
