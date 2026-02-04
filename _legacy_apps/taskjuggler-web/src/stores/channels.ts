import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '@/utils/api';
import type { Channel } from '@/types';

export const useChannelsStore = defineStore('channels', () => {
  const channels = ref<Channel[]>([]);
  const currentChannel = ref<Channel | null>(null);
  const loading = ref(false);

  async function fetchChannels() {
    loading.value = true;
    try {
      const response = await api.get('/channels');
      channels.value = response.data;
    } finally {
      loading.value = false;
    }
  }

  async function provisionPhone(data: { phone_number?: string; greeting_message?: string; voicemail_greeting?: string }) {
    const response = await api.post('/channels/phone', data);
    channels.value.push(response.data);
    return response.data;
  }

  async function createEmail(data: { email_address: string; greeting_message?: string }) {
    const response = await api.post('/channels/email', data);
    channels.value.push(response.data);
    return response.data;
  }

  async function updateChannel(id: string, data: Partial<Channel>) {
    const response = await api.put(`/channels/${id}`, data);
    const index = channels.value.findIndex(c => c.id === id);
    if (index !== -1) {
      channels.value[index] = response.data;
    }
    if (currentChannel.value?.id === id) {
      currentChannel.value = response.data;
    }
    return response.data;
  }

  async function deleteChannel(id: string) {
    await api.delete(`/channels/${id}`);
    channels.value = channels.value.filter(c => c.id !== id);
  }

  return {
    channels,
    currentChannel,
    loading,
    fetchChannels,
    provisionPhone,
    createEmail,
    updateChannel,
    deleteChannel,
  };
});
