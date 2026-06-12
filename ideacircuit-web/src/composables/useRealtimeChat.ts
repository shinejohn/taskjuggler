import { ref, onMounted, onUnmounted } from 'vue';
import api from '../services/api';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

export interface Message {
  id: string;
  meeting_id: string;
  participant_id?: string;
  user_id?: string;
  message_text: string;
  message_type: string;
  is_ai_generated: boolean;
  created_at: string;
}

export const useRealtimeChat = (meetingId: string, participantId: string) => {
  const messages = ref<Message[]>([]);
  const loading = ref(true);
  const isConnected = ref(false);
  let echo: Echo<any> | null = null;

  // Load initial messages from API
  const loadMessages = async () => {
    try {
      const response = await api.getMessages(meetingId);
      const messageData = response.data.data || response.data;
      messages.value = Array.isArray(messageData) ? messageData : [];
    } catch (error) {
      console.error('Error loading messages:', error);
      messages.value = [];
    } finally {
      loading.value = false;
    }
  };

  // Set up Laravel Echo for real-time messages
  const setupEcho = () => {
    if (typeof window === 'undefined') return;

    // Set up Pusher on window
    if (!window.Pusher) {
      window.Pusher = Pusher;
    }

    const token = localStorage.getItem('token');
    // Remove /api suffix if present, broadcasting auth is at root
    const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace(/\/api$/, '');

    echo = new Echo({
      broadcaster: 'pusher',
      key: import.meta.env.VITE_PUSHER_APP_KEY || 'your-pusher-key',
      cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER || 'mt1',
      forceTLS: true,
      encrypted: true,
      authEndpoint: `${baseUrl}/broadcasting/auth`,
      auth: {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      },
    });

    // Use PresenceChannel for meeting room
    echo.join(`meetings.${meetingId}`)
      .here(() => {
        isConnected.value = true;
      })
      .listen('.message.received', (data: { message?: Message }) => {
        if (data.message) {
          const incoming = data.message;
          // Avoid duplicates
          if (!messages.value.some(msg => msg.id === incoming.id)) {
            messages.value = [...messages.value, incoming];
          }
        }
      })
      .error((error: unknown) => {
        console.error('Echo error:', error);
        isConnected.value = false;
      });
  };

  onMounted(() => {
    if (meetingId) {
      loadMessages();
      setupEcho();
    }
  });

  onUnmounted(() => {
    if (echo) {
      echo.leave(`meetings.${meetingId}`);
      echo.disconnect();
      echo = null;
    }
  });

  const send = async (text: string) => {
    try {
      // Send message via API
      const response = await api.sendMessage(meetingId, {
        text,
        participant_id: participantId
      });

      const newMessage = response.data.data || response.data;
      
      // Add message to local state optimistically
      if (newMessage) {
        // Avoid duplicates
        if (!messages.value.some(msg => msg.id === newMessage.id)) {
          messages.value = [...messages.value, newMessage];
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };

  return {
    messages,
    sendMessage: send,
    loading,
    isConnected
  };
};

// Extend Window interface for Pusher
declare global {
  interface Window {
    Pusher: typeof Pusher;
    Echo: typeof Echo;
  }
}

